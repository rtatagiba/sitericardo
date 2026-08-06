/**
 * Fase 0 — Spike de viabilidade do Extrator de árvore de acessibilidade.
 * Responde uma pergunta: o Browser Rendering do Cloudflare expõe a AX tree
 * completa via CDP (Accessibility.getFullAXTree, com `ignored`/`ignoredReasons`
 * nos nós — não a versão filtrada de page.accessibility.snapshot()), e
 * `setJavaScriptEnabled(false)` funciona nesse fork do Puppeteer?
 *
 * DESCARTÁVEL — sem SSRF guard, sem rate limit, sem cache. Rodar só com
 * `npm run dev` (= wrangler dev --remote) e testar via POST manual. Nunca
 * publicar isso. Se a Fase 0 confirmar viabilidade, este diretório some e
 * a lógica real nasce em frontend/functions/api/ (Fase 1), com blindagem
 * chegando na Fase 2.
 */
import puppeteer from '@cloudflare/puppeteer';

const NAV_TIMEOUT_MS = 20_000;

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/debug') {
      return json({ error: 'POST /debug { url: string, javaScriptEnabled?: boolean }' }, 404);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'invalid JSON body' }, 400);
    }

    const target = body.url;
    if (!target || !/^https?:\/\//i.test(target)) {
      return json({ error: 'body.url must be an http(s) URL' }, 400);
    }
    const jsEnabled = body.javaScriptEnabled !== false;

    const browser = await puppeteer.launch(env.MYBROWSER);
    try {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(NAV_TIMEOUT_MS);

      // Pergunta 2 do spike: desligar JS funciona via API do Puppeteer no
      // fork da Cloudflare? Se não, o fallback é CDP
      // `Emulation.setScriptExecutionDisabled` direto (ver plano, Fase 0).
      if (!jsEnabled) {
        await page.setJavaScriptEnabled(false);
      }

      const cdp = await page.createCDPSession();
      await cdp.send('Accessibility.enable');
      await page.goto(target, { waitUntil: 'networkidle0', timeout: NAV_TIMEOUT_MS });

      // Pergunta 1 do spike: isso devolve os nós crus, com `ignored` e
      // `ignoredReasons` — não a árvore filtrada de page.accessibility.snapshot().
      const { nodes } = await cdp.send('Accessibility.getFullAXTree');

      return json({
        url: target,
        javaScriptEnabled: jsEnabled,
        nodeCount: nodes.length,
        hasIgnoredField: nodes.some((n) => 'ignored' in n),
        sample: nodes.slice(0, 20),
      });
    } catch (err) {
      return json({ error: err instanceof Error ? err.message : 'capture failed' }, 502);
    } finally {
      // Sempre fechar — sessão que morre por BrowserIdle em vez de
      // NormalClosure continua contando minuto de browser.
      await browser.close();
    }
  },
};
