// Captura de lead honesta (Fase 5): o resultado da auditoria já está
// inteiro na tela antes disso — isso aqui é só interesse opcional em
// relatório multi-página ou monitoramento recorrente, funcionalidades que
// ainda não existem. Gate no resultado básico queimaria a ferramenta.
import type { KVNamespaceLike } from '../../src/lib/ax/kv';

interface Env {
  AX_TOOL_KV: KVNamespaceLike;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  let body: { email?: string; url?: string; interest?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid JSON body' }, 400);
  }

  const email = body.email?.trim().slice(0, 200);
  if (!email || !EMAIL_RE.test(email)) {
    return json({ error: 'e-mail inválido' }, 400);
  }

  const key = `lead:${Date.now()}:${crypto.randomUUID()}`;
  await env.AX_TOOL_KV.put(
    key,
    JSON.stringify({
      email,
      url: body.url?.slice(0, 500) ?? null,
      interest: body.interest?.slice(0, 200) ?? null,
      capturedAt: new Date().toISOString(),
    }),
  );

  return json({ ok: true });
};
