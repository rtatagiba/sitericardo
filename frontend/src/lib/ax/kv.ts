// Sem @cloudflare/workers-types no projeto — assinatura mínima que cobre o
// que rateLimit.ts e cache.ts realmente usam do binding KV.
export interface KVNamespaceLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}
