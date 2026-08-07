// Fase 2.3 — cache por hash(url + modo + viewport). Duas pessoas auditando a
// mesma home popular não devem custar duas sessões de browser.
import type { KVNamespaceLike } from './kv';
import type { AxSnapshot } from '../../../../packages/ax-core/src/types';

const CACHE_TTL_S = 12 * 3600; // meio do range 6-24h do plano

export interface CacheKeyInput {
  url: string;
  javaScriptEnabled: boolean;
  viewport: { width: number; height: number };
}

export async function buildCacheKey(input: CacheKeyInput): Promise<string> {
  const raw = `${input.url}|js=${input.javaScriptEnabled}|${input.viewport.width}x${input.viewport.height}`;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `cache:${hex}`;
}

export async function getCachedSnapshot(kv: KVNamespaceLike, cacheKey: string): Promise<AxSnapshot | null> {
  const raw = await kv.get(cacheKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AxSnapshot;
  } catch {
    return null;
  }
}

export async function putCachedSnapshot(kv: KVNamespaceLike, cacheKey: string, snapshot: AxSnapshot): Promise<void> {
  await kv.put(cacheKey, JSON.stringify(snapshot), { expirationTtl: CACHE_TTL_S });
}
