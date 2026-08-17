export type Dnd5eIndexResult = {
  index: string;
  name: string;
  url: string;
  [key: string]: unknown;
};

export type Dnd5eIndexResponse = {
  count: number;
  results: Dnd5eIndexResult[];
};

export type Dnd5eApiError = Error & {
  status?: number;
  url?: string;
};

const DEFAULT_API_ROOT = 'https://www.dnd5eapi.co/api/2014';

export function getDnd5eApiRoot() {
  const envRoot = import.meta.env.VITE_DND5E_API_ROOT as string | undefined;
  return (envRoot?.trim() || DEFAULT_API_ROOT).replace(/\/+$/, '');
}

function toAbsoluteApiUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const root = getDnd5eApiRoot();
  if (pathOrUrl.startsWith('/')) return `${root}${pathOrUrl.replace(/^\/api\/2014/, '')}`;
  return `${root}/${pathOrUrl}`;
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, {
    signal,
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const err = new Error(`Request failed (${res.status})`) as Dnd5eApiError;
    err.status = res.status;
    err.url = url;
    throw err;
  }

  return (await res.json()) as T;
}

const indexCache = new Map<string, Promise<Dnd5eIndexResponse>>();
const itemCache = new Map<string, Promise<unknown>>();

export function clearDnd5eCaches() {
  indexCache.clear();
  itemCache.clear();
}

export async function getCategoryIndex(
  category: string,
  signal?: AbortSignal,
): Promise<Dnd5eIndexResponse> {
  const url = `${getDnd5eApiRoot()}/${category}`;
  const cached = indexCache.get(url);
  if (cached) return cached;

  const p = fetchJson<Dnd5eIndexResponse>(url, signal).catch((err) => {
    indexCache.delete(url);
    throw err;
  });
  indexCache.set(url, p);
  return p;
}

export async function getItem<T = unknown>(
  category: string,
  index: string,
  signal?: AbortSignal,
): Promise<T> {
  const url = `${getDnd5eApiRoot()}/${category}/${index}`;
  const cached = itemCache.get(url);
  if (cached) return (await cached) as T;

  const p = fetchJson<T>(url, signal).catch((err) => {
    itemCache.delete(url);
    throw err;
  });
  itemCache.set(url, p as Promise<unknown>);
  return p;
}

export async function getItemByUrl<T = unknown>(
  pathOrUrl: string,
  signal?: AbortSignal,
): Promise<T> {
  const url = toAbsoluteApiUrl(pathOrUrl);
  const cached = itemCache.get(url);
  if (cached) return (await cached) as T;

  const p = fetchJson<T>(url, signal).catch((err) => {
    itemCache.delete(url);
    throw err;
  });
  itemCache.set(url, p as Promise<unknown>);
  return p;
}

