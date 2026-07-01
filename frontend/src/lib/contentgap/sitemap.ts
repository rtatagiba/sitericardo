import type { FetchOptions } from './types';

export const DEFAULT_FETCH_OPTIONS: FetchOptions = {
  maxUrls: 3000,
  maxChildSitemaps: 15,
  timeoutMs: 15000,
};

/**
 * Ordered fetch strategies: direct first (some sites send CORS headers),
 * then free public CORS proxies. Keeps the site 100% static — no backend.
 */
const STRATEGIES: Array<(url: string) => string> = [
  (u) => u,
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
];

async function fetchText(url: string, timeoutMs: number): Promise<string> {
  let lastError: unknown;
  for (const wrap of STRATEGIES) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(wrap(url), {
        signal: controller.signal,
        headers: { Accept: 'application/xml, text/xml, text/plain, */*' },
      });
      if (!res.ok) {
        lastError = new Error(`HTTP ${res.status}`);
        continue;
      }
      const text = await res.text();
      if (text.trim().length === 0) {
        lastError = new Error('resposta vazia');
        continue;
      }
      return text;
    } catch (err) {
      lastError = err;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError instanceof Error ? lastError : new Error('falha ao buscar');
}

/**
 * Accepts any reasonable site input: with or without protocol, with or
 * without an explicit sitemap path. Examples that all work:
 * "meusite.com", "www.meusite.com/", "https://meusite.com",
 * "meusite.com/sitemap.xml", "http://meusite.com/sitemap_index.xml".
 */
export function normalizeSiteInput(input: string): { origin: string; sitemapUrl?: string } {
  let value = input
    .trim()
    .replace(/\s+/g, '')
    .replace(/[,;]+$/, '');
  // "//meusite.com" or "meusite.com" → add https; "http://" stays as typed
  value = value.replace(/^\/\//, '');
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
  const url = new URL(value);
  if (/\.xml(\?.*)?$/i.test(url.pathname + url.search)) {
    return { origin: url.origin, sitemapUrl: url.href };
  }
  // Any other path (e.g. meusite.com/blog) is ignored — discovery starts at the origin
  return { origin: url.origin };
}

function parseXml(text: string): Document | null {
  const doc = new DOMParser().parseFromString(text, 'text/xml');
  if (doc.querySelector('parsererror')) return null;
  return doc;
}

function extractLocs(doc: Document, parentTag: 'url' | 'sitemap'): string[] {
  const locs: string[] = [];
  doc.querySelectorAll(`${parentTag} > loc`).forEach((el) => {
    const value = el.textContent?.trim();
    if (value) locs.push(value);
  });
  return locs;
}

async function findSitemapUrl(origin: string, timeoutMs: number): Promise<string> {
  const candidates = [
    `${origin}/sitemap.xml`,
    `${origin}/sitemap_index.xml`,
    `${origin}/wp-sitemap.xml`,
    `${origin}/sitemap-index.xml`,
  ];
  for (const candidate of candidates) {
    try {
      const text = await fetchText(candidate, timeoutMs);
      if (parseXml(text)) return candidate;
    } catch {
      // try next candidate
    }
  }
  // Last resort: robots.txt often declares the sitemap location
  try {
    const robots = await fetchText(`${origin}/robots.txt`, timeoutMs);
    const match = robots.match(/^sitemap:\s*(\S+)/im);
    if (match) return match[1];
  } catch {
    // ignore
  }
  throw new Error('sitemap não encontrado');
}

/**
 * Fetches every page URL declared in a site's sitemap, following
 * sitemap-index files recursively (bounded by maxChildSitemaps/maxUrls).
 */
export async function fetchSitemapUrls(
  input: string,
  onProgress: (message: string) => void,
  options: FetchOptions = DEFAULT_FETCH_OPTIONS,
): Promise<string[]> {
  const { origin, sitemapUrl } = normalizeSiteInput(input);

  onProgress('a localizar sitemap...');
  const entryUrl = sitemapUrl ?? (await findSitemapUrl(origin, options.timeoutMs));

  const urls: string[] = [];
  const queue: string[] = [entryUrl];
  const visited = new Set<string>();
  let childrenFetched = 0;

  while (queue.length > 0 && urls.length < options.maxUrls) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    onProgress(`a ler ${visited.size > 1 ? `sub-sitemap ${visited.size - 1}` : 'sitemap'}... (${urls.length} URLs)`);

    let text: string;
    try {
      text = await fetchText(current, options.timeoutMs);
    } catch {
      if (current === entryUrl) throw new Error('não foi possível descarregar o sitemap');
      continue;
    }

    const doc = parseXml(text);
    if (!doc) {
      if (current === entryUrl) throw new Error('sitemap com XML inválido');
      continue;
    }

    if (doc.querySelector('sitemapindex')) {
      for (const child of extractLocs(doc, 'sitemap')) {
        if (childrenFetched >= options.maxChildSitemaps) break;
        childrenFetched++;
        queue.push(child);
      }
    } else {
      for (const loc of extractLocs(doc, 'url')) {
        if (urls.length >= options.maxUrls) break;
        urls.push(loc);
      }
    }
  }

  if (urls.length === 0) throw new Error('sitemap sem URLs de páginas');
  return urls;
}
