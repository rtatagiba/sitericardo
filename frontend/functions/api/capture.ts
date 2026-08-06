// Cloudflare Pages Function — núcleo de captura da árvore de acessibilidade
// (Fase 1 do plano). Sem SSRF guard, sem rate limit, sem cache: isso é a
// Fase 2, bloqueante pra publicar. Não expor essa rota em produção antes dela.
import type { BrowserWorker } from '@cloudflare/puppeteer';
import { captureAx } from '../../src/lib/ax/capture';

interface Env {
  MYBROWSER: BrowserWorker;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
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
    const snapshot = await captureAx(env.MYBROWSER, {
      url: target,
      javaScriptEnabled: body.javaScriptEnabled,
    });
    return json(snapshot);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'capture failed' }, 502);
  }
};
