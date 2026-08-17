import { useEffect, useMemo, useState } from 'react';

const NS = {
  itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
  content: 'http://purl.org/rss/1.0/modules/content/',
  podcastIndex: 'https://podcastindex.org/namespace/1.0',
} as const;

export type PodcastFeedEpisode = {
  id: string;
  showName: string;
  title: string;
  episodeLabel?: string;
  episodeType?: string;
  publishedAt?: string;
  publishedDateLabel?: string;
  durationSeconds?: number;
  durationLabel?: string;
  description?: string;
  imageUrl?: string;
  audioUrl?: string;
  episodeUrl?: string;
};

type CacheShape = {
  fetchedAt: number;
  episodes: PodcastFeedEpisode[];
};

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const CACHE_KEY_PREFIX = 'taleofthelich:rss-cache:';

function safeText(x: string | null | undefined) {
  const t = (x ?? '').trim();
  return t.length ? t : undefined;
}

function collapseWhitespace(s: string) {
  return s.replace(/\s+/g, ' ').trim();
}

function stripHtmlToText(html: string) {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return collapseWhitespace(doc.body.textContent ?? '');
  } catch {
    return collapseWhitespace(html.replace(/<[^>]*>/g, ' '));
  }
}

function parseDurationSeconds(raw?: string) {
  const s = safeText(raw);
  if (!s) return undefined;

  if (/^\d+$/.test(s)) return Number.parseInt(s, 10);

  const parts = s.split(':').map((p) => Number.parseInt(p, 10));
  if (parts.some((n) => Number.isNaN(n))) return undefined;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return undefined;
}

function formatDuration(seconds?: number) {
  if (!seconds || !Number.isFinite(seconds) || seconds <= 0) return undefined;
  const minsTotal = Math.floor(seconds / 60);
  const hrs = Math.floor(minsTotal / 60);
  const mins = minsTotal % 60;
  if (hrs <= 0) return `${minsTotal} min`;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
}

function formatPubDate(pubDate?: string) {
  const s = safeText(pubDate);
  if (!s) return undefined;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return undefined;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

function getItunesText(item: Element, localName: string) {
  return safeText(item.getElementsByTagNameNS(NS.itunes, localName)?.[0]?.textContent);
}

function getContentEncodedHtml(item: Element) {
  return safeText(item.getElementsByTagNameNS(NS.content, 'encoded')?.[0]?.textContent);
}

function getEpisodeLabel(item: Element, title?: string) {
  const itunesEp = getItunesText(item, 'episode');
  if (itunesEp) return `E${itunesEp}`;

  const t = safeText(title);
  if (!t) return undefined;
  const m = t.match(/^E(?:pisode)?\s*([0-9]+(?:\.[0-9]+)?)\s*[:.-]\s*/i);
  if (!m) return undefined;
  return `E${m[1]}`;
}

function cleanTitle(rawTitle?: string) {
  const t = safeText(rawTitle);
  if (!t) return '';
  return t.replace(/^E(?:pisode)?\s*[0-9]+(?:\.[0-9]+)?\s*[:.-]\s*/i, '').trim();
}

function loadCache(feedUrl: string): CacheShape | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(`${CACHE_KEY_PREFIX}${feedUrl}`);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as CacheShape;
    if (
      typeof parsed !== 'object' ||
      !parsed ||
      typeof parsed.fetchedAt !== 'number' ||
      !Array.isArray(parsed.episodes)
    ) {
      return undefined;
    }
    return parsed;
  } catch {
    return undefined;
  }
}

function saveCache(feedUrl: string, episodes: PodcastFeedEpisode[]) {
  if (typeof window === 'undefined') return;
  try {
    const payload: CacheShape = { fetchedAt: Date.now(), episodes };
    window.localStorage.setItem(`${CACHE_KEY_PREFIX}${feedUrl}`, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export async function fetchPodcastFeedEpisodes(feedUrl: string): Promise<PodcastFeedEpisode[]> {
  const res = await fetch(feedUrl, {
    method: 'GET',
    headers: { Accept: 'text/xml, application/rss+xml, application/xml;q=0.9, text/plain;q=0.8' },
  });
  if (!res.ok) throw new Error(`RSS fetch failed (${res.status})`);

  const xml = await res.text();
  const doc = new DOMParser().parseFromString(xml, 'text/xml');

  const channel = doc.querySelector('channel');
  const showName = safeText(channel?.querySelector('title')?.textContent) ?? 'Podcast';

  const items = Array.from(doc.querySelectorAll('item'));

  const episodes = items
    .map((item) => {
      const rawTitle = safeText(item.querySelector('title')?.textContent) ?? '';
      const title = cleanTitle(rawTitle) || rawTitle;

      const guid = safeText(item.querySelector('guid')?.textContent);
      const link = safeText(item.querySelector('link')?.textContent);
      const id = guid ?? link ?? `${rawTitle}:${safeText(item.querySelector('pubDate')?.textContent) ?? ''}`;

      const pubDate = safeText(item.querySelector('pubDate')?.textContent);
      const publishedAt = pubDate ? new Date(pubDate).toISOString() : undefined;
      const publishedDateLabel = formatPubDate(pubDate);

      const durationSeconds = parseDurationSeconds(getItunesText(item, 'duration'));
      const durationLabel = formatDuration(durationSeconds);

      const episodeLabel = getEpisodeLabel(item, rawTitle);
      const episodeType = getItunesText(item, 'episodeType');

      const html =
        getContentEncodedHtml(item) ??
        safeText(item.querySelector('description')?.textContent) ??
        getItunesText(item, 'summary');
      const description = html ? stripHtmlToText(html) : undefined;

      const imageUrl = safeText(
        item.getElementsByTagNameNS(NS.itunes, 'image')?.[0]?.getAttribute('href'),
      );

      const enclosure = item.querySelector('enclosure');
      const audioUrl = safeText(enclosure?.getAttribute('url'));

      return {
        id,
        showName,
        title,
        episodeLabel,
        episodeType,
        publishedAt,
        publishedDateLabel,
        durationSeconds,
        durationLabel,
        description,
        imageUrl,
        audioUrl,
        episodeUrl: link,
      } satisfies PodcastFeedEpisode;
    })
    .filter((ep) => ep.title.length > 0);

  episodes.sort((a, b) => {
    const at = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bt = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bt - at;
  });

  return episodes;
}

export function usePodcastFeedEpisodes(feedUrl: string) {
  const cached = useMemo(() => loadCache(feedUrl), [feedUrl]);
  const [episodes, setEpisodes] = useState<PodcastFeedEpisode[]>(cached?.episodes ?? []);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | undefined>(undefined);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | undefined>(cached?.fetchedAt);

  useEffect(() => {
    let cancelled = false;

    const cache = loadCache(feedUrl);
    const cacheFresh = !!cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS;

    if (cache?.episodes?.length) {
      setEpisodes(cache.episodes);
      setLastUpdatedAt(cache.fetchedAt);
      setLoading(!cacheFresh);
    } else {
      setLoading(true);
    }

    fetchPodcastFeedEpisodes(feedUrl)
      .then((eps) => {
        if (cancelled) return;
        setEpisodes(eps);
        setError(undefined);
        setLoading(false);
        setLastUpdatedAt(Date.now());
        saveCache(feedUrl, eps);
      })
      .catch((e) => {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : 'Failed to load episodes';
        setError(msg);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [feedUrl]);

  return { episodes, loading, error, lastUpdatedAt };
}

