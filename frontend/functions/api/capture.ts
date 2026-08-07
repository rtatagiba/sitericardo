// Cloudflare Pages Function — captura da árvore de acessibilidade, com a
// blindagem da Fase 2: SSRF guard, cache, rate limit por IP e kill switch de
// orçamento diário. Endpoint público com browser headless é proxy de
// scraping grátis por padrão — nada disso é opcional antes de publicar.
import type { BrowserWorker } from '@cloudflare/puppeteer';
import { analyze } from '../../../packages/ax-core/src/analyze';
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
  if (!env.AX_TOOL_KV || !env.MYBROWSER) {
    return json(
      { error: `binding ausente: ${!env.AX_TOOL_KV ? 'AX_TOOL_KV' : 'MYBROWSER'} não configurado no dashboard do Pages` },
      500,
    );
  }

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
    return json({ snapshot: cached, findings: analyze(cached) }, 200, { 'X-Cache': 'HIT' });
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

  // Daqui pra frente é captura de verdade (5-15s) — os checks acima já
  // resolveram o resto em milissegundos. Streaming honesto de progresso em
  // vez de barra falsa: cada etapa só chega quando aconteceu de fato.
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };
      try {
        const snapshot = await captureAx(env.MYBROWSER, {
          url: target,
          javaScriptEnabled,
          onProgress: (step) => send({ step }),
        });
        send({ step: 'calculando-score' });
        const findings = analyze(snapshot);
        await putCachedSnapshot(env.AX_TOOL_KV, cacheKey, snapshot);
        send({ step: 'concluido', snapshot, findings });
      } catch (err) {
        if (err instanceof SsrfBlockedError) {
          send({ step: 'erro', error: err.message });
        } else {
          const retryAfter = upstreamRetryAfterSeconds(err);
          send({
            step: 'erro',
            error: retryAfter !== null
              ? 'servidor de captura temporariamente sobrecarregado, tente de novo em instantes'
              : err instanceof Error ? err.message : 'falha na captura',
          });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
};
