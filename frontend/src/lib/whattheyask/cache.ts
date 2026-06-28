import type { CacheEntry, Language } from './types';

const TTL = 24 * 60 * 60 * 1000;

function cacheKey(keyword: string, lang: Language): string {
  return `wta_${keyword.trim().toLowerCase()}_${lang}`;
}

export function getCache(keyword: string, lang: Language): Record<string, string[]> | null {
  try {
    const raw = localStorage.getItem(cacheKey(keyword, lang));
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > TTL) {
      localStorage.removeItem(cacheKey(keyword, lang));
      return null;
    }
    return entry.results;
  } catch {
    return null;
  }
}

export function setCache(keyword: string, lang: Language, results: Record<string, string[]>): void {
  try {
    const entry: CacheEntry = { results, timestamp: Date.now() };
    localStorage.setItem(cacheKey(keyword, lang), JSON.stringify(entry));
  } catch {
    // ignore quota errors
  }
}
