import type { FetchOptions } from './types';

export const DEFAULT_FETCH_OPTIONS: FetchOptions = {
  maxUrls: 3000,
  maxChildSitemaps: 15,
  timeoutMs: 15000,
};

/**
 * Ordered fetch strategies: direct first (some sites send CORS headers),
 * then our own same-origin proxy (frontend/functions/api/fetch-url.ts),
 * then a public CORS proxy as last resort. Keeps the site 100% static.
 */
const STRATEGIES: Array<(url: string) => string> = [
  (u) => u,
  (u) => `/api/fetch-url?url=${encodeURIComponent(u)}`,
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
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

/**
 * Collects candidate sitemap entry points for an origin, most-authoritative
 * first. robots.txt "Sitemap:" lines win: the owner declares the real location,
 * which is decisive when a stale /sitemap.xml shadows the live one — e.g. a
 * WordPress→Astro migration that leaves a zombie Yoast index pointing at 404
 * children. Well-known paths follow as fallbacks. Callers try each in turn and
 * keep the first that yields actual page URLs (see crawlSitemap).
 */
async function discoverSitemapUrls(origin: string, timeoutMs: number): Promise<string[]> {
  const found: string[] = [];
  try {
    const robots = await fetchText(`${origin}/robots.txt`, timeoutMs);
    for (const m of robots.matchAll(/^\s*sitemap:\s*(\S+)/gim)) {
      const loc = m[1].trim();
      if (loc && !found.includes(loc)) found.push(loc);
    }
  } catch {
    // robots.txt missing/unreachable — fall back to well-known paths
  }
  const wellKnown = [
    `${origin}/sitemap.xml`,
    `${origin}/sitemap_index.xml`,
    `${origin}/sitemap-index.xml`,
    `${origin}/wp-sitemap.xml`,
  ];
  for (const c of wellKnown) if (!found.includes(c)) found.push(c);
  return found;
}

/**
 * Fallback for sites with no discoverable sitemap: pull page URLs from
 * their RSS/Atom feed instead. Gives partial coverage (recent posts)
 * rather than a hard failure.
 */
async function tryRssFeeds(origin: string, timeoutMs: number): Promise<string[]> {
  const candidates = [`${origin}/feed`, `${origin}/feed/`, `${origin}/?feed=rss2`];
  for (const url of candidates) {
    try {
      const text = await fetchText(url, timeoutMs);
      const doc = parseXml(text);
      if (!doc) continue;
      const links = Array.from(doc.querySelectorAll('item > link'))
        .map((el) => el.textContent?.trim())
        .filter((v): v is string => !!v);
      if (links.length > 0) return links;
    } catch {
      // try next candidate
    }
  }
  return [];
}

/**
 * Crawls one sitemap entry point, following sitemap-index files recursively
 * (bounded by maxChildSitemaps/maxUrls). Returns the page URLs found, or an
 * empty array on any failure — never throws, so the caller can move on to the
 * next candidate entry point (e.g. when an index lists only dead 404 children).
 */
async function crawlSitemap(
  entryUrl: string,
  options: FetchOptions,
  onProgress: (message: string) => void,
): Promise<string[]> {
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
      continue;
    }

    const doc = parseXml(text);
    if (!doc) continue;

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

  return urls;
}

/**
 * Fetches every page URL declared in a site's sitemap. Discovers candidate
 * entry points (robots.txt first, then well-known paths), then tries each until
 * one actually yields page URLs — so a stale index whose children all 404 falls
 * through to the real sitemap instead of failing. Sites with no usable sitemap
 * fall back to their RSS/Atom feed for partial coverage.
 */
export async function fetchSitemapUrls(
  input: string,
  onProgress: (message: string) => void,
  options: FetchOptions = DEFAULT_FETCH_OPTIONS,
): Promise<string[]> {
  const { origin, sitemapUrl } = normalizeSiteInput(input);

  onProgress('a localizar sitemap...');
  const entryUrls = sitemapUrl
    ? [sitemapUrl]
    : await discoverSitemapUrls(origin, options.timeoutMs);

  for (const entryUrl of entryUrls) {
    const urls = await crawlSitemap(entryUrl, options, onProgress);
    if (urls.length > 0) return urls;
  }

  onProgress('sitemap não encontrado, a tentar feed RSS...');
  const rssUrls = await tryRssFeeds(origin, options.timeoutMs);
  if (rssUrls.length > 0) return rssUrls.slice(0, options.maxUrls);

  throw new Error('sitemap não encontrado');
}
