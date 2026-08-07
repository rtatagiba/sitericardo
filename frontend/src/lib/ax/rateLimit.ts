// Fase 2.2 — rate limit por IP e kill switch de orçamento diário.
// KV não tem incremento atômico; pra esse volume (poucas capturas/hora), uma
// corrida read-modify-write no pior caso deixa passar 1-2 requests a mais —
// aceitável. Comece conservador (5/h), dá pra afrouxar depois.
import type { KVNamespaceLike } from './kv';

const PER_IP_LIMIT = 5;
const PER_IP_WINDOW_S = 3600;
const DAILY_BUDGET = 200;

export class RateLimitedError extends Error {
  constructor(public retryAfterSeconds: number) {
    super('rate limit excedido');
    this.name = 'RateLimitedError';
  }
}

export class BudgetExhaustedError extends Error {
  constructor() {
    super('orçamento diário de capturas esgotado');
    this.name = 'BudgetExhaustedError';
  }
}

function secondsUntilNextWindow(windowSeconds: number): number {
  const now = Math.floor(Date.now() / 1000);
  return windowSeconds - (now % windowSeconds);
}

async function bump(kv: KVNamespaceLike, key: string, ttlSeconds: number): Promise<number> {
  const current = Number((await kv.get(key)) ?? '0');
  const next = current + 1;
  await kv.put(key, String(next), { expirationTtl: ttlSeconds });
  return next;
}

/** Lança BudgetExhaustedError se o orçamento diário global já estourou. */
export async function assertWithinDailyBudget(kv: KVNamespaceLike): Promise<void> {
  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  const key = `rl:global:${day}`;
  const count = Number((await kv.get(key)) ?? '0');
  if (count >= DAILY_BUDGET) {
    throw new BudgetExhaustedError();
  }
  await bump(kv, key, 26 * 3600); // margem sobre 24h pro fuso da leitura
}

/** Lança RateLimitedError se o IP já capturou demais na última hora. */
export async function assertWithinIpLimit(kv: KVNamespaceLike, ip: string): Promise<void> {
  const bucket = Math.floor(Date.now() / 1000 / PER_IP_WINDOW_S);
  const key = `rl:ip:${ip}:${bucket}`;
  const count = Number((await kv.get(key)) ?? '0');
  if (count >= PER_IP_LIMIT) {
    throw new RateLimitedError(secondsUntilNextWindow(PER_IP_WINDOW_S));
  }
  await bump(kv, key, PER_IP_WINDOW_S);
}
