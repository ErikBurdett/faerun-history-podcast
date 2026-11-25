import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Markdown from "react-markdown";
import { ArrowLeft, ArrowRight, BookOpen, Compass, Search } from "lucide-react";
import {
  atlasRoot,
  shelves,
  type AtlasEntry,
  type AtlasText,
} from "../data/atlasShelves";
import inventory from "../data/atlas/index.json";
import "../atlas.css";

const entries: AtlasEntry[] = inventory;
const byKey = new Map(entries.map((entry) => [entry.key, entry]));
const books = import.meta.glob<Record<string, AtlasText>>(
  ["../data/atlas/*.json", "!../data/atlas/index.json"],
  { import: "default" },
);
const pageSize = 16;
const entryUrl = (entry: AtlasEntry) => atlasRoot + "/" + entry.key;
const shelfFor = (key: string) =>
  shelves.find((s) => s.id === key.split("/")[0]);
const readText = (entry: AtlasEntry) =>
  books[
    "../data/atlas/" +
      (entry.parent.split("/")[1] || entry.key.split("/")[0]) +
      ".json"
  ]();

function EntryList({
  items,
  paintings = false,
}: {
  items: AtlasEntry[];
  paintings?: boolean;
}) {
  return (
    <ul className={paintings ? "atlas-paintings" : "atlas-register"}>
      {items.map((item) => (
        <li key={item.key}>
          <Link to={entryUrl(item)}>
            {item.art && (
              <img
                src={item.art}
                alt=""
                loading="lazy"
                className={
                  item.art.includes("/seals/") || item.art.includes("/guests/")
                    ? "pixel-art"
                    : ""
                }
              />
            )}
            <span>
              <small>{item.tag}</small>
              <strong>{item.title}</strong>
              {!paintings && (
                <span className="register-excerpt">{item.summary}</span>
              )}
            </span>
            {!paintings && <ArrowRight aria-hidden="true" size={17} />}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Catalog({ shelf, volume }: { shelf?: string; volume?: AtlasEntry }) {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const region = shelf === "places" ? params.get("region") || "" : "";
  const regions =
    shelf === "places"
      ? [
          ...new Set(
            entries
              .filter((e) => e.key.startsWith("places/"))
              .map((e) => e.tag),
          ),
        ]
      : [];
  const matches = entries.filter((e) => {
    if (region && e.tag !== region) return false;
    if (volume && e.parent !== volume.key) return false;
    if (shelf && !e.key.startsWith(shelf + "/")) return false;
    if (!volume && !words.length && e.parent) return false;
    const text = [
      e.title,
      e.tag,
      e.summary,
      e.terms,
      e.parent && byKey.get(e.parent)?.title,
    ]
      .join(" ")
      .toLowerCase();
    return words.every((word) => text.includes(word));
  });
  if (words.length) {
    const titleScore = (e: AtlasEntry) =>
      words.filter((word) => e.title.toLowerCase().includes(word)).length;
    matches.sort((a, b) => titleScore(b) - titleScore(a));
  }
  const pages = Math.max(1, Math.ceil(matches.length / pageSize));
  const page = Math.min(
    pages,
    Math.max(1, parseInt(params.get("page") || "1", 10) || 1),
  );
  function changePage(number: number) {
    const next = new URLSearchParams(params);
    if (number > 1) next.set("page", String(number));
    else next.delete("page");
    setParams(next);
    document.getElementById("atlas-search")?.focus();
  }
  return (
    <section
      className="atlas-catalog"
      aria-label={volume ? "Paintings in this volume" : "Browse the atlas"}
    >
      {volume && <h2>The paintings</h2>}
      <label className="atlas-search">
        <Search size={20} aria-hidden="true" />
        <input
          id="atlas-search"
          type="search"
          aria-label={
            volume ? "Search this volume" : "Search the atlas collection"
          }
          placeholder={
            volume
              ? "Find a painting in this volume…"
              : "Find a name, a place, or a card…"
          }
          value={query}
          onChange={(e) => {
            const next = new URLSearchParams(params);
            if (e.target.value) next.set("q", e.target.value);
            else next.delete("q");
            next.delete("page");
            setParams(next, { replace: true });
          }}
        />
      </label>
      {regions.length > 0 && (
        <label className="atlas-region">
          Browse by region{" "}
          <select
            value={region}
            onChange={(e) => {
              const next = new URLSearchParams(params);
              if (e.target.value) next.set("region", e.target.value);
              else next.delete("region");
              next.delete("page");
              setParams(next);
            }}
          >
            <option value="">All roads and old places</option>
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
      )}
      {!shelf && !words.length ? (
        <div className="atlas-doors">
          {shelves.map((s) => (
            <Link key={s.id} to={atlasRoot + "/" + s.id}>
              <img src={s.art} alt="" loading="lazy" />
              <div>
                <h2>{s.title}</h2>
                <p>{s.line}</p>
              </div>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : (
        <>
          <p className="atlas-count" aria-live="polite">
            {matches.length
              ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, matches.length)} of ${matches.length}`
              : "No entries found. Try another name or place."}
          </p>
          <EntryList
            items={matches.slice((page - 1) * pageSize, page * pageSize)}
            paintings={Boolean(volume)}
          />
          {pages > 1 && (
            <nav className="atlas-pagination" aria-label="Result pages">
              <button
                disabled={page === 1}
                onClick={() => changePage(page - 1)}
              >
                ← Previous
              </button>
              <span>
                Page {page} of {pages}
              </span>
              <button
                disabled={page === pages}
                onClick={() => changePage(page + 1)}
              >
                Next →
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}

function RelatedLinks({ keys }: { keys: string[] }) {
  return (
    <ul>
      {keys.map((key) => {
        const other = byKey.get(key)!;
        return (
          <li key={key}>
            <Link to={entryUrl(other)}>
              {other.title} <ArrowRight size={14} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Reader({ entry }: { entry: AtlasEntry }) {
  const [text, setText] = useState<AtlasText>();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let current = true;
    readText(entry)
      .then((data) => {
        if (current) setText(data[entry.key]);
      })
      .catch(() => {
        if (current) setFailed(true);
      });
    return () => {
      current = false;
    };
  }, [entry, attempt]);
  const shelf = shelfFor(entry.key)!;
  const isVolume = shelf.id === "grimoire" && !entry.parent;
  const parent = entry.parent ? byKey.get(entry.parent) : undefined;
  const peers = entries.filter(
    (e) => e.parent === entry.parent && e.key.startsWith(shelf.id + "/"),
  );
  const position = peers.indexOf(entry);
  const next = peers[position + 1];
  const previous = peers[position - 1];
  const illustration = entries.find((item) => item.parent && item.art === entry.art);
  const isPainting = Boolean(illustration) && shelf.id !== "chronicle";
  const caption = illustration && illustration.key !== entry.key ? illustration : undefined;
  return (
    <article className="atlas-leaf">
      <div className="atlas-leaf-title">
        <p className="folio-label">{entry.tag}</p>
        <h1>{entry.title}</h1>
        {parent && (
          <Link className="quiet-link" to={entryUrl(parent)}>
            <BookOpen size={16} />
            {parent.title}
          </Link>
        )}
      </div>
      <div className={"atlas-sheet" + (isPainting ? " painted-leaf" : "")}>
        {entry.art && (
          <figure
            className={
              "leaf-art " + (shelf.id === "chronicle" ? "chronicle-art " : "") +
              (entry.art.includes("/seals/") || entry.art.includes("/guests/")
                ? "seal-art"
                : "")
            }
          >
            <img
              src={entry.art}
              alt={caption ? "" : isPainting ? entry.title + " · card illustration" : ""}
            />
            {caption && <figcaption>From the grimoire · <Link to={entryUrl(caption)}>{caption.title}</Link></figcaption>}
          </figure>
        )}
        <div className="atlas-prose">
          {shelf.id !== "chronicle" && (
            <p className="leaf-opening">{entry.summary}</p>
          )}
          {parent && (
            <section className="card-origin">
              <h2>From {parent.title}</h2>
              <p>{parent.tag}</p>
              <p>{parent.summary}</p>
              <Link to={entryUrl(parent)}>
                Read the volume <span aria-hidden="true">→</span>
              </Link>
            </section>
          )}
          {failed ? (
            <p>
              These pages could not be opened.{" "}
              <button
                onClick={() => {
                  setFailed(false);
                  setAttempt(attempt + 1);
                }}
              >
                Try again
              </button>
            </p>
          ) : !text ? (
            <p role="status">Opening the page…</p>
          ) : (
            <>
              <Markdown
                components={{
                  a: ({ href, children }) =>
                    href?.startsWith(atlasRoot + "/") ? (
                      <Link to={href}>{children}</Link>
                    ) : (
                      <a href={href}>{children}</a>
                    ),
                }}
              >
                {text.body}
              </Markdown>

            </>
          )}
        </div>
      </div>
      {isVolume && <Catalog shelf="grimoire" volume={entry} />}
      {!!text?.figures?.length && (
        <details className="atlas-figures">
          <summary>
            See this people’s heraldry, settlements and companies
          </summary>
          <div>
            {text.figures.map((f) => (
              <figure key={f.label}>
                <span
                  aria-hidden="true"
                  style={{
                    width: f.w,
                    height: f.h,
                    backgroundPosition: `-${f.x}px -${f.y}px`,
                  }}
                />
                <figcaption>{f.label}</figcaption>
              </figure>
            ))}
          </div>
        </details>
      )}
      {!!text?.related.length && (
        <aside className="atlas-related">
          <h2>Follow the thread</h2>
          <RelatedLinks keys={text.related.slice(0, 6)} />
          {text.related.length > 6 && (
            <details>
              <summary>
                More from this collection ({text.related.length - 6})
              </summary>
              <RelatedLinks keys={text.related.slice(6)} />
            </details>
          )}
        </aside>
      )}
      <nav className="leaf-turn" aria-label="Turn the page">
        {previous && (
          <Link to={entryUrl(previous)}>
            <ArrowLeft size={16} />
            {previous.title}
          </Link>
        )}
        {next && (
          <Link to={entryUrl(next)}>
            {next.title}
            <ArrowRight size={16} />
          </Link>
        )}
      </nav>
    </article>
  );
}

export default function TheandrilAtlas() {
  const { shelf: id, leaf } = useParams();
  const shelf = shelves.find((s) => s.id === id);
  const entry = leaf ? byKey.get(id + "/" + leaf) : undefined;
  const missing = Boolean((id && !shelf) || (leaf && !entry));
  const title = missing
    ? "Page not found"
    : entry?.title || shelf?.title || "Atlas of Theandril";
  useEffect(() => {
    document.title = title + " | Theandril";
  }, [title]);
  return (
    <div className="folio-page world-page atlas">
      <nav className="folio-width atlas-breadcrumb" aria-label="Breadcrumb">
        <Link to="/theandril">
          <Compass size={15} />
          Theandril
        </Link>
        <span>/</span>
        {id ? <Link to={atlasRoot}>Atlas</Link> : "Atlas"}
        {shelf && (
          <>
            <span>/</span>
            {leaf ? (
              <Link to={atlasRoot + "/" + shelf.id}>{shelf.title}</Link>
            ) : (
              shelf.title
            )}
          </>
        )}
      </nav>
      <div className="folio-width">
        {missing ? (
          <section className="atlas-missing">
            <h1>There’s no entry at this address.</h1>
            <Link className="quiet-link" to={atlasRoot}>
              Return to the atlas <ArrowRight size={16} />
            </Link>
          </section>
        ) : entry ? (
          <Reader key={entry.key} entry={entry} />
        ) : (
          <>
            <header className="atlas-front">
              <img
                src={shelf?.art || "/assets/folio/cartography.webp"}
                alt=""
              />
              <div>
                <p className="folio-label">
                  {shelf
                    ? "Atlas of Theandril"
                    : "Grey Weir · Road Reckoning 2447"}
                </p>
                <h1>{shelf?.title || "Atlas of Theandril"}</h1>
                <p>
                  {shelf?.line ||
                    "Unfold the map at Grey Weir. A ferry toll can lead you to a people’s oath; a painted seal can lead you back a thousand years."}
                </p>
              </div>
            </header>
            <Catalog key={id || "all"} shelf={id} />
          </>
        )}
      </div>
    </div>
  );
}
