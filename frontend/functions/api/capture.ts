// Cloudflare Pages Function — captura da árvore de acessibilidade, com a
// blindagem da Fase 2: SSRF guard, cache, rate limit por IP e kill switch de
// orçamento diário. Endpoint público com browser headless é proxy de
// scraping grátis por padrão — nada disso é opcional antes de publicar.
import type { BrowserWorker } from '@cloudflare/puppeteer';
import { buildCacheKey, getCachedSnapshot, putCachedSnapshot } from '../../src/lib/ax/cache';
import { captureAx, DEFAULT_VIEWPORT } from '../../src/lib/ax/capture';
import type { KVNamespaceLike } from '../../src/lib/ax/kv';
import { assertWithinDailyBudget, assertWithinIpLimit, BudgetExhaustedError, RateLimitedError } from '../../src/lib/ax/rateLimit';
import { assertUrlIsSafe, SsrfBlockedError } from '../../src/lib/ax/ssrf';

interface Env {
  MYBROWSER: BrowserWorker;
  AX_TOOL_KV: KVNamespaceLike;
}

function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

// Erro típico do Browser Run quando a fila/quota de sessões está cheia — não
// é falha nossa, é 429 de verdade que precisa virar Retry-After pro cliente.
function upstreamRetryAfterSeconds(err: unknown): number | null {
  if (err instanceof Error && /code:\s*429/i.test(err.message)) return 10;
  return null;
}

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  let body: { url?: string; javaScriptEnabled?: boolean };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid JSON body' }, 400);
  }

  const target = body.url;
  if (!target || !/^https?:\/\//i.test(target)) {
    return json({ error: 'body.url must be an http(s) URL' }, 400);
  }

  try {
    await assertUrlIsSafe(target);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'URL bloqueada' }, 400);
  }

  const javaScriptEnabled = body.javaScriptEnabled !== false;
  const cacheKey = await buildCacheKey({ url: target, javaScriptEnabled, viewport: DEFAULT_VIEWPORT });

  const cached = await getCachedSnapshot(env.AX_TOOL_KV, cacheKey);
  if (cached) {
    return json(cached, 200, { 'X-Cache': 'HIT' });
  }

  try {
    await assertWithinDailyBudget(env.AX_TOOL_KV);
  } catch (err) {
    if (err instanceof BudgetExhaustedError) {
      return json({ error: 'orçamento diário de capturas esgotado, tente novamente amanhã' }, 503);
    }
    throw err;
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  try {
    await assertWithinIpLimit(env.AX_TOOL_KV, ip);
  } catch (err) {
    if (err instanceof RateLimitedError) {
      return json({ error: 'limite de capturas por hora excedido' }, 429, {
        'Retry-After': String(err.retryAfterSeconds),
      });
    }
    throw err;
  }

  try {
    const snapshot = await captureAx(env.MYBROWSER, { url: target, javaScriptEnabled });
    await putCachedSnapshot(env.AX_TOOL_KV, cacheKey, snapshot);
    return json(snapshot, 200, { 'X-Cache': 'MISS' });
  } catch (err) {
    if (err instanceof SsrfBlockedError) {
      return json({ error: err.message }, 400);
    }
    const retryAfter = upstreamRetryAfterSeconds(err);
    if (retryAfter !== null) {
      return json({ error: 'servidor de captura temporariamente sobrecarregado' }, 429, {
        'Retry-After': String(retryAfter),
      });
    }
    return json({ error: err instanceof Error ? err.message : 'capture failed' }, 502);
  }
};
