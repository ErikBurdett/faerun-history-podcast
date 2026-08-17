import type { ComponentType, CSSProperties, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpenText,
  ExternalLink,
  Search,
  Shield,
  SlidersHorizontal,
  Skull,
  Sparkles,
  Swords,
  Users,
  Wand2,
  X,
} from 'lucide-react';
import {
  getCategoryIndex,
  getDnd5eApiRoot,
  getItem,
  type Dnd5eIndexResult,
  type Dnd5eIndexResponse,
} from '../lib/dnd5eApi';

type CategoryDef = {
  key: string;
  label: string;
  shortLabel?: string;
  Icon: ComponentType<{ className?: string }>;
};

const CATEGORIES: readonly CategoryDef[] = [
  { key: 'spells', label: 'Spells', Icon: Sparkles },
  { key: 'monsters', label: 'Monsters', Icon: Skull },
  { key: 'classes', label: 'Classes', Icon: Users },
  { key: 'subclasses', label: 'Subclasses', Icon: Users },
  { key: 'features', label: 'Features', Icon: Wand2 },
  { key: 'feats', label: 'Feats', Icon: Wand2 },
  { key: 'backgrounds', label: 'Backgrounds', Icon: BookOpenText },
  { key: 'races', label: 'Races', Icon: Users },
  { key: 'subraces', label: 'Subraces', Icon: Users },
  { key: 'skills', label: 'Skills', Icon: Wand2 },
  { key: 'conditions', label: 'Conditions', Icon: Shield },
  { key: 'equipment', label: 'Equipment', Icon: Swords },
  { key: 'magic-items', label: 'Magic Items', shortLabel: 'Items', Icon: Swords },
  { key: 'damage-types', label: 'Damage Types', shortLabel: 'Damage', Icon: Shield },
  { key: 'magic-schools', label: 'Magic Schools', shortLabel: 'Schools', Icon: Wand2 },
  { key: 'languages', label: 'Languages', Icon: BookOpenText },
  { key: 'traits', label: 'Traits', Icon: BookOpenText },
  { key: 'weapon-properties', label: 'Weapon Props', shortLabel: 'Weapons', Icon: Swords },
  { key: 'proficiencies', label: 'Proficiencies', shortLabel: 'Profs', Icon: Shield },
  { key: 'alignments', label: 'Alignments', Icon: BookOpenText },
  { key: 'ability-scores', label: 'Ability Scores', shortLabel: 'Abilities', Icon: Shield },
  { key: 'rules', label: 'Rules', Icon: BookOpenText },
  { key: 'rule-sections', label: 'Rule Sections', shortLabel: 'Sections', Icon: BookOpenText },
] as const;

const DEFAULT_CATEGORY = 'spells';
const PAGE_SIZE = 50;

const STAR_COUNT = 28;
const STAR_ANGLE = '42deg';
const STAR_DX = '120vw';
const STAR_DY = '76vh';

const FALLING_STARS = Array.from({ length: STAR_COUNT }, (_, i) => {
  const xPct = -22 + ((i * 9) % 140); // -22% .. 118%
  const yPct = -26 + ((i * 13) % 84); // -26% .. 58%
  const delay = ((i * 1.35) % 22).toFixed(2);
  const dur = (11.5 + (i % 9) * 1.15).toFixed(2);
  const len = 140 + (i % 10) * 18;
  const size = i % 7 === 0 ? '2.5px' : i % 3 === 0 ? '2px' : '1.5px';

  return {
    x: `${xPct}%`,
    y: `${yPct}%`,
    dx: STAR_DX,
    dy: STAR_DY,
    dur: `${dur}s`,
    delay: `${delay}s`,
    len: `${len}px`,
    angle: STAR_ANGLE,
    size,
  };
});

function isValidCategoryKey(category?: string): category is (typeof CATEGORIES)[number]['key'] {
  if (!category) return false;
  return CATEGORIES.some((c) => c.key === category);
}

function getCategoryDef(key: string) {
  return CATEGORIES.find((c) => c.key === key);
}

function normalizeSearch(s: string) {
  return s.trim().toLowerCase();
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-ink-950/40 border border-ink-800 text-ink-200">
      {children}
    </span>
  );
}

function KeyValueGrid({
  rows,
}: {
  rows: Array<{ label: string; value?: React.ReactNode }>;
}) {
  const visible = rows.filter((r) => r.value !== undefined && r.value !== null && r.value !== '');
  if (visible.length === 0) return null;

  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {visible.map((row) => (
        <div
          key={row.label}
          className="rounded-xl border border-ink-900/70 bg-ink-950/30 px-4 py-3"
        >
          <dt className="text-xs text-ink-300 tracking-wide">{row.label}</dt>
          <dd className="text-sm text-bone-50 mt-1 leading-snug">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function renderTextLines(lines?: unknown) {
  if (!Array.isArray(lines)) return null;
  const filtered = lines.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
  if (filtered.length === 0) return null;
  return (
    <div className="space-y-3">
      {filtered.map((p, idx) => (
        <p key={idx} className="text-ink-200 leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  );
}

function Markdownish({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');

  type Block =
    | { type: 'h2'; text: string }
    | { type: 'h3'; text: string }
    | { type: 'p'; text: string }
    | { type: 'ul'; items: string[] };

  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    const p = paragraph.join(' ').trim();
    if (p) blocks.push({ type: 'p', text: p });
    paragraph = [];
  };

  const flushList = () => {
    if (list.length) blocks.push({ type: 'ul', items: list });
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      flushParagraph();
      continue;
    }

    const h2 = trimmed.match(/^##\s+(.*)$/);
    if (h2) {
      flushList();
      flushParagraph();
      blocks.push({ type: 'h2', text: h2[1].trim() });
      continue;
    }

    const h3 = trimmed.match(/^###\s+(.*)$/);
    if (h3) {
      flushList();
      flushParagraph();
      blocks.push({ type: 'h3', text: h3[1].trim() });
      continue;
    }

    const li = trimmed.match(/^[-*]\s+(.*)$/);
    if (li) {
      flushParagraph();
      list.push(li[1].trim());
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushList();
  flushParagraph();

  if (!blocks.length) return null;

  return (
    <div className="space-y-4">
      {blocks.map((b, idx) => {
        if (b.type === 'h2') {
          return (
            <h4 key={idx} className="text-xl font-display font-semibold text-bone-50">
              {b.text}
            </h4>
          );
        }
        if (b.type === 'h3') {
          return (
            <h5 key={idx} className="text-lg font-display font-semibold text-bone-50">
              {b.text}
            </h5>
          );
        }
        if (b.type === 'ul') {
          return (
            <ul key={idx} className="space-y-2 pl-5 list-disc text-ink-200">
              {b.items.map((item) => (
                <li key={item} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={idx} className="text-ink-200 leading-relaxed">
            {b.text}
          </p>
        );
      })}
    </div>
  );
}

function renderDescription(desc?: unknown) {
  if (typeof desc === 'string' && desc.trim().length > 0) {
    return <Markdownish text={desc} />;
  }
  if (Array.isArray(desc)) {
    return renderTextLines(desc);
  }
  return null;
}

function renderNameList(items?: unknown) {
  if (!Array.isArray(items)) return null;
  const names = items
    .map((x) => (x && typeof x === 'object' && 'name' in x ? (x as { name?: unknown }).name : undefined))
    .filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
  if (names.length === 0) return null;
  return names.join(' · ');
}

function formatSpellLevel(level?: unknown) {
  if (typeof level !== 'number') return undefined;
  if (level === 0) return 'Cantrip';
  return `Level ${level}`;
}

function formatArmorClass(ac?: unknown) {
  if (typeof ac === 'number') return `${ac}`;
  if (!Array.isArray(ac)) return undefined;
  const vals = ac
    .map((x) => {
      if (!x || typeof x !== 'object') return undefined;
      const value = (x as { value?: unknown }).value;
      const type = (x as { type?: unknown }).type;
      if (typeof value !== 'number') return undefined;
      if (typeof type === 'string' && type.trim().length > 0) return `${value} (${type})`;
      return `${value}`;
    })
    .filter((x): x is string => typeof x === 'string');
  return vals.length ? vals.join(' · ') : undefined;
}

function formatSpeed(speed?: unknown) {
  if (!speed || typeof speed !== 'object') return undefined;
  const entries = Object.entries(speed as Record<string, unknown>)
    .map(([k, v]) => (typeof v === 'string' ? `${k}: ${v}` : undefined))
    .filter((x): x is string => typeof x === 'string');
  return entries.length ? entries.join(' · ') : undefined;
}

function formatChallengeRating(cr?: unknown) {
  if (typeof cr === 'number') return `CR ${cr}`;
  if (typeof cr === 'string') return `CR ${cr}`;
  return undefined;
}

function JsonValue({
  value,
  depth,
}: {
  value: unknown;
  depth: number;
}) {
  if (value === null) return <span className="text-ink-300">null</span>;
  if (value === undefined) return <span className="text-ink-300">—</span>;
  if (typeof value === 'string') {
    const isHttp = value.startsWith('http://') || value.startsWith('https://');
    if (isHttp) {
      return (
        <a
          className="text-candle-200 hover:text-candle-100 underline underline-offset-4 break-all"
          href={value}
          target="_blank"
          rel="noopener noreferrer"
        >
          {value}
        </a>
      );
    }

    if (value.includes('\n') && value.length > 120) {
      return (
        <div className="rounded-xl border border-ink-900/70 bg-ink-950/30 px-4 py-3">
          <div className="text-sm text-ink-200 whitespace-pre-wrap leading-relaxed">
            {value}
          </div>
        </div>
      );
    }
    return <span className="text-ink-200 break-words">{value}</span>;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return <span className="text-ink-200">{String(value)}</span>;
  }

  const maxDepth = 4;
  if (depth >= maxDepth) {
    return (
      <pre className="text-xs text-ink-200 whitespace-pre-wrap break-words">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-ink-300">[]</span>;
    const primitives = value.every(
      (v) => v === null || ['string', 'number', 'boolean'].includes(typeof v),
    );
    if (primitives) {
      return (
        <span className="text-ink-200 break-words">
          {(value as Array<string | number | boolean | null>)
            .map((v) => (v === null ? 'null' : String(v)))
            .join(', ')}
        </span>
      );
    }

    return (
      <div className="space-y-2">
        {(value as unknown[]).slice(0, 40).map((v, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-ink-900/70 bg-ink-950/30 px-4 py-3"
          >
            <JsonValue value={v} depth={depth + 1} />
          </div>
        ))}
        {value.length > 40 && (
          <p className="text-xs text-ink-300">… {value.length - 40} more</p>
        )}
      </div>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return <span className="text-ink-300">{'{}'}</span>;

    return (
      <div className="space-y-2">
        {entries.map(([k, v]) => (
          <div
            key={k}
            className="rounded-xl border border-ink-900/70 bg-ink-950/30 px-4 py-3"
          >
            <div className="text-xs text-ink-300 tracking-wide mb-1">{k}</div>
            <div className="text-sm">
              <JsonValue value={v} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <pre className="text-xs text-ink-200 whitespace-pre-wrap break-words">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function DetailBody({
  category,
  index,
  onClose,
}: {
  category: string;
  index: string;
  onClose: () => void;
}) {
  const [state, setState] = useState<
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'success'; item: Record<string, unknown> }
  >({ status: 'loading' });

  useEffect(() => {
    const ac = new AbortController();
    setState({ status: 'loading' });

    getItem<Record<string, unknown>>(category, index, ac.signal)
      .then((item) => setState({ status: 'success', item }))
      .catch((err: unknown) => {
        if (ac.signal.aborted) return;
        const message =
          err && typeof err === 'object' && 'status' in err
            ? `Couldn’t open this entry (HTTP ${(err as { status?: unknown }).status}).`
            : 'Couldn’t open this entry.';
        setState({ status: 'error', message });
      });

    return () => ac.abort();
  }, [category, index]);

  const apiUrl = `${getDnd5eApiRoot()}/${category}/${index}`;

  if (state.status === 'loading') {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-2/3 bg-ink-800/60 rounded mb-3" />
        <div className="h-4 w-1/2 bg-ink-800/50 rounded mb-6" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-ink-800/40 rounded" />
          <div className="h-4 w-11/12 bg-ink-800/35 rounded" />
          <div className="h-4 w-10/12 bg-ink-800/30 rounded" />
        </div>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div>
        <p className="text-ink-200 leading-relaxed mb-5">{state.message}</p>
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <a className="btn btn-primary" href={apiUrl} target="_blank" rel="noopener noreferrer">
            Open in API
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    );
  }

  const item = state.item;
  const name = typeof item.name === 'string' ? item.name : index;

  const desc = renderDescription(item.desc);
  const higherLevel = renderTextLines(item.higher_level);

  const spellLevel = formatSpellLevel(item.level);
  const schoolName =
    item.school && typeof item.school === 'object' && 'name' in item.school
      ? (item.school as { name?: unknown }).name
      : undefined;

  const monsterAc = formatArmorClass(item.armor_class);
  const monsterCr = formatChallengeRating(item.challenge_rating);
  const monsterSpeed = formatSpeed(item.speed);

  const isSpell = category === 'spells';
  const isMonster = category === 'monsters';

  const summaryRows = isSpell
    ? [
        { label: 'Level', value: spellLevel },
        { label: 'School', value: typeof schoolName === 'string' ? schoolName : undefined },
        { label: 'Casting time', value: typeof item.casting_time === 'string' ? item.casting_time : undefined },
        { label: 'Range', value: typeof item.range === 'string' ? item.range : undefined },
        { label: 'Duration', value: typeof item.duration === 'string' ? item.duration : undefined },
        {
          label: 'Components',
          value: Array.isArray(item.components) ? (item.components as unknown[]).join(', ') : undefined,
        },
        { label: 'Material', value: typeof item.material === 'string' ? item.material : undefined },
        { label: 'Classes', value: renderNameList(item.classes) },
      ]
    : isMonster
      ? [
          { label: 'Size', value: typeof item.size === 'string' ? item.size : undefined },
          { label: 'Type', value: typeof item.type === 'string' ? item.type : undefined },
          { label: 'Alignment', value: typeof item.alignment === 'string' ? item.alignment : undefined },
          { label: 'Armor Class', value: monsterAc },
          { label: 'Hit Points', value: typeof item.hit_points === 'number' ? item.hit_points : undefined },
          { label: 'Speed', value: monsterSpeed },
          { label: 'Challenge', value: monsterCr },
        ]
      : [
          { label: 'Index', value: typeof item.index === 'string' ? item.index : index },
          { label: 'Category', value: category },
        ];

  const actions =
    Array.isArray(item.actions) && item.actions.every((a) => a && typeof a === 'object')
      ? (item.actions as Array<{ name?: unknown; desc?: unknown }>)
      : undefined;

  const specialAbilities =
    Array.isArray(item.special_abilities) && item.special_abilities.every((a) => a && typeof a === 'object')
      ? (item.special_abilities as Array<{ name?: unknown; desc?: unknown }>)
      : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-ink-300 mb-1 capitalize">{category.replace(/-/g, ' ')}</p>
          <h2 className="text-2xl font-display font-semibold text-bone-50 leading-tight">{name}</h2>
          <div className="flex flex-wrap gap-2 mt-3">
            {isSpell && spellLevel && <Badge>{spellLevel}</Badge>}
            {isSpell && typeof schoolName === 'string' && <Badge>{schoolName}</Badge>}
            {isMonster && monsterCr && <Badge>{monsterCr}</Badge>}
            {isMonster && typeof item.type === 'string' && <Badge>{item.type}</Badge>}
          </div>
        </div>

        <button
          className="p-2 rounded-lg text-ink-200 hover:text-bone-50 hover:bg-ink-900/40 transition-all duration-300 border border-ink-800"
          onClick={onClose}
          aria-label="Close details"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <KeyValueGrid rows={summaryRows} />

      {desc && (
        <section className="space-y-3">
          <h3 className="text-lg font-display font-semibold text-bone-50">Description</h3>
          {desc}
        </section>
      )}

      {higherLevel && (
        <section className="space-y-3">
          <h3 className="text-lg font-display font-semibold text-bone-50">At Higher Levels</h3>
          {higherLevel}
        </section>
      )}

      {isMonster && specialAbilities && specialAbilities.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-display font-semibold text-bone-50">Traits</h3>
          <div className="space-y-3">
            {specialAbilities.map((a) => (
              <div key={typeof a.name === 'string' ? a.name : JSON.stringify(a)} className="rounded-xl border border-ink-900/70 bg-ink-950/30 px-4 py-3">
                {typeof a.name === 'string' && <p className="text-sm font-semibold text-bone-50 mb-1">{a.name}</p>}
                {typeof a.desc === 'string' && <p className="text-sm text-ink-200 leading-relaxed">{a.desc}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {isMonster && actions && actions.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-display font-semibold text-bone-50">Actions</h3>
          <div className="space-y-3">
            {actions.map((a) => (
              <div key={typeof a.name === 'string' ? a.name : JSON.stringify(a)} className="rounded-xl border border-ink-900/70 bg-ink-950/30 px-4 py-3">
                {typeof a.name === 'string' && <p className="text-sm font-semibold text-bone-50 mb-1">{a.name}</p>}
                {typeof a.desc === 'string' && <p className="text-sm text-ink-200 leading-relaxed">{a.desc}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <details className="rounded-xl border border-ink-900/70 bg-ink-950/30 px-4 py-3">
          <summary className="cursor-pointer select-none text-sm font-medium text-bone-50">
            Full entry (all fields)
          </summary>
          <div className="pt-4">
            <JsonValue value={item} depth={0} />
          </div>
        </details>
        <p className="text-xs text-ink-300">
          Some entries include markdown (for example, rule sections like{' '}
          <a
            className="underline underline-offset-4 hover:text-candle-200 transition-colors"
            href="https://www.dnd5eapi.co/api/2014/rule-sections/actions-in-combat"
            target="_blank"
            rel="noopener noreferrer"
          >
            actions-in-combat
          </a>
          ).
        </p>
      </section>

      <div className="flex flex-wrap gap-3 pt-2">
        <a
          className="btn btn-outline"
          href={apiUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open the raw entry in the SRD API"
        >
          Open in API
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </div>
    </div>
  );
}

function Library() {
  const params = useParams();
  const navigate = useNavigate();

  const rawCategory = params.category;
  const rawIndex = params.index;

  const category = isValidCategoryKey(rawCategory) ? rawCategory : DEFAULT_CATEGORY;
  const categoryDef = getCategoryDef(category);

  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [indexState, setIndexState] = useState<
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'success'; data: Dnd5eIndexResponse }
  >({ status: 'loading' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth < 768) setFiltersOpen(false);
  }, []);

  useEffect(() => {
    setQuery('');
    setVisibleCount(PAGE_SIZE);
  }, [category]);

  useEffect(() => {
    const ac = new AbortController();
    setIndexState({ status: 'loading' });

    getCategoryIndex(category, ac.signal)
      .then((data) => setIndexState({ status: 'success', data }))
      .catch((err: unknown) => {
        if (ac.signal.aborted) return;
        const message =
          err && typeof err === 'object' && 'status' in err
            ? `Couldn’t open this shelf (HTTP ${(err as { status?: unknown }).status}).`
            : 'Couldn’t open this shelf.';
        setIndexState({ status: 'error', message });
      });

    return () => ac.abort();
  }, [category]);

  const results = useMemo(
    () => (indexState.status === 'success' ? indexState.data.results : []),
    [indexState],
  );
  const normalizedQuery = normalizeSearch(query);

  const filtered = useMemo(() => {
    if (!normalizedQuery) return results;
    return results.filter((r) => normalizeSearch(r.name).includes(normalizedQuery));
  }, [results, normalizedQuery]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visible.length < filtered.length;

  const showDetails = isValidCategoryKey(rawCategory) && typeof rawIndex === 'string' && rawIndex.length > 0;
  const selectedIndex = showDetails ? rawIndex : undefined;

  const onCloseDetails = () => {
    navigate(`/library/${category}`);
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden mb-10">
          <div className="absolute inset-0 pointer-events-none">
            <div className="star-field opacity-60">
              {FALLING_STARS.map((s, idx) => (
                <span
                  key={`${s.x}-${s.y}-${s.delay}-${s.dur}-${idx}`}
                  className="star"
                  style={
                    {
                      ['--x']: s.x,
                      ['--y']: s.y,
                      ['--dx']: s.dx,
                      ['--dy']: s.dy,
                      ['--dur']: s.dur,
                      ['--delay']: s.delay,
                      ['--len']: s.len,
                      ['--angle']: s.angle,
                      ['--size']: s.size,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-ink-950/5 via-ink-950/40 to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wraith-500/10 border border-wraith-500/30 mb-6">
              <BookOpenText className="w-4 h-4 text-wraith-200" />
              <span className="text-wraith-200 text-sm tracking-wide">
                SRD Resource Library <span className="text-ink-300">·</span>{' '}
                Under development
              </span>
            </div>
            <h1 className="section-heading mb-4">The Archive</h1>
            <p className="text-ink-200 max-w-3xl mx-auto text-lg leading-relaxed">
              A searchable SRD reference powered by the D&amp;D 5e SRD API. Browse a shelf, then open an entry to read it like a candlelit folio.
            </p>
            <p className="text-sm text-ink-200/90 max-w-3xl mx-auto leading-relaxed mt-4">
              This section is still being built. Expect occasional rough edges as shelves and formatting improve.
            </p>
            <p className="text-xs text-ink-300 mt-3">
              Data source:{' '}
              <a
                className="underline underline-offset-4 hover:text-candle-200 transition-colors"
                href="https://5e-bits.github.io/docs/"
                target="_blank"
                rel="noopener noreferrer"
              >
                5e SRD API
              </a>
            </p>
          </motion.div>
        </section>

        <div className="card-glow p-6 md:p-8 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <div className="w-full md:max-w-md">
                <label className="sr-only" htmlFor="library-search">
                  Search
                </label>
                <div className="relative">
                  <Search className="w-5 h-5 text-ink-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    id="library-search"
                    className="input pl-12"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setVisibleCount(PAGE_SIZE);
                    }}
                    placeholder={`Search ${categoryDef?.label ?? 'the Archive'}…`}
                  />
                </div>
              </div>

              <div className="flex-1 flex items-center justify-between gap-3">
                <div className="hidden md:block text-sm text-ink-300">
                  Shelf:{' '}
                  <span className="text-bone-50 font-medium">
                    {categoryDef?.label ?? 'Spells'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setFiltersOpen((v) => !v)}
                  className="btn btn-outline h-12 px-4 shrink-0"
                  aria-expanded={filtersOpen}
                  aria-controls="library-filters"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  {filtersOpen ? 'Hide filters' : 'Show filters'}
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {filtersOpen && (
                <motion.div
                  id="library-filters"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2">
                    <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
                      <p className="text-xs text-ink-300">
                        Choose a shelf to browse.
                      </p>
                      <Link
                        to={`/library/${category}`}
                        className="text-xs text-ink-300 hover:text-candle-200 transition-colors underline underline-offset-4"
                        onClick={() => {
                          if (typeof window !== 'undefined' && window.innerWidth < 768) {
                            setFiltersOpen(false);
                          }
                        }}
                      >
                        Permalink this shelf
                      </Link>
                    </div>

                    <div className="flex flex-wrap gap-2 max-h-52 overflow-auto pr-1 md:max-h-none md:overflow-visible">
                      {CATEGORIES.map((c) => {
                        const active = c.key === category;
                        return (
                          <button
                            key={c.key}
                            onClick={() => {
                              navigate(`/library/${c.key}`);
                              if (typeof window !== 'undefined' && window.innerWidth < 768) {
                                setFiltersOpen(false);
                              }
                            }}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                              active
                                ? 'bg-mana-500/12 border-mana-500/40 text-mana-200'
                                : 'bg-ink-950/30 border-ink-800 text-ink-200 hover:text-bone-50 hover:border-candle-500/30 hover:bg-candle-500/10'
                            }`}
                          >
                            <c.Icon className={`w-4 h-4 ${active ? 'text-mana-200' : 'text-ink-300'}`} />
                            <span className="text-sm font-medium">{c.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {rawCategory && !isValidCategoryKey(rawCategory) && (
              <div className="rounded-xl border border-ember-500/25 bg-ember-500/10 px-4 py-3 text-sm text-ink-100">
                That shelf doesn’t exist. Showing <span className="font-semibold text-bone-50">{getCategoryDef(DEFAULT_CATEGORY)?.label ?? 'Spells'}</span> instead.
              </div>
            )}

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="text-sm text-ink-300">
                {indexState.status === 'loading' && 'Opening the stacks…'}
                {indexState.status === 'error' && indexState.message}
                {indexState.status === 'success' && (
                  <>
                    <span className="text-ink-200 font-medium">{filtered.length}</span> result{filtered.length === 1 ? '' : 's'}
                    {normalizedQuery ? (
                      <>
                        {' '}
                        for <span className="text-bone-50 font-medium">“{query.trim()}”</span>
                      </>
                    ) : null}
                  </>
                )}
              </div>

              <a
                className="text-xs text-ink-300 hover:text-candle-200 transition-colors inline-flex items-center gap-2"
                href={getDnd5eApiRoot()}
                target="_blank"
                rel="noopener noreferrer"
                title="Open the SRD API root"
              >
                API root
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <section className="lg:col-span-3">
            <div className="card-glow p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-mana-500/10 border border-mana-500/30 flex items-center justify-center">
                    {categoryDef ? <categoryDef.Icon className="w-5 h-5 text-mana-300" /> : <BookOpenText className="w-5 h-5 text-mana-300" />}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-display font-semibold text-bone-50">
                      {categoryDef?.label ?? 'Archive Shelf'}
                    </h2>
                    <p className="text-xs text-ink-300">Tap an entry to open its folio.</p>
                  </div>
                </div>
                {selectedIndex && (
                  <button className="btn btn-ghost" onClick={onCloseDetails}>
                    Close details
                  </button>
                )}
              </div>

              {indexState.status === 'loading' && (
                <div className="space-y-3">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-12 rounded-xl border border-ink-900/70 bg-ink-950/30 animate-pulse" />
                  ))}
                </div>
              )}

              {indexState.status === 'error' && (
                <div className="rounded-xl border border-ember-500/25 bg-ember-500/10 px-5 py-4">
                  <p className="text-ink-100 leading-relaxed">{indexState.message}</p>
                </div>
              )}

              {indexState.status === 'success' && (
                <>
                  <div className="space-y-2">
                    {visible.map((r: Dnd5eIndexResult) => {
                      const active = selectedIndex === r.index;
                      const spellLevel = category === 'spells' ? formatSpellLevel(r.level) : undefined;
                      return (
                        <Link
                          key={r.index}
                          to={`/library/${category}/${r.index}`}
                          className={`block rounded-xl border px-4 py-3 transition-all duration-300 ${
                            active
                              ? 'border-mana-500/40 bg-mana-500/10'
                              : 'border-ink-900/70 bg-ink-950/30 hover:border-candle-500/25 hover:bg-candle-500/5'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-bone-50 font-medium truncate">{r.name}</p>
                              <p className="text-xs text-ink-400 truncate">{r.index}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {spellLevel && <Badge>{spellLevel}</Badge>}
                              <span className="text-ink-300 text-xs">Open</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {hasMore && (
                    <div className="mt-6 flex justify-center">
                      <button
                        className="btn btn-outline"
                        onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                      >
                        Load more
                      </button>
                    </div>
                  )}

                  {!hasMore && filtered.length === 0 && (
                    <div className="rounded-xl border border-ink-900/70 bg-ink-950/30 px-5 py-4 mt-4">
                      <p className="text-ink-200 leading-relaxed">
                        No matches. Try a shorter query, or browse the list.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          <aside className="hidden lg:block lg:col-span-2">
            <div className="card-glow p-6 md:p-8 sticky top-28 max-h-[calc(100vh-8rem)] overflow-auto">
              {selectedIndex ? (
                <DetailBody category={category} index={selectedIndex} onClose={onCloseDetails} />
              ) : (
                <div>
                  <h2 className="text-xl font-display font-semibold text-bone-50 mb-3">
                    Open an entry
                  </h2>
                  <p className="text-ink-200 leading-relaxed">
                    Select something from the list to the left. On desktop, its folio opens here.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>

        <AnimatePresence>
          {showDetails && selectedIndex && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden"
                onClick={onCloseDetails}
              />
              <motion.div
                initial={{ y: '8%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '8%', opacity: 0 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                className="fixed inset-x-0 bottom-0 top-20 z-50 lg:hidden"
              >
                <div className="h-full max-w-3xl mx-auto px-4 pb-6">
                  <div className="card-glow h-full p-6 overflow-auto">
                    <DetailBody category={category} index={selectedIndex} onClose={onCloseDetails} />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Library;

