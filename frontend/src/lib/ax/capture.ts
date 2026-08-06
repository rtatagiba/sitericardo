import puppeteer, { type BrowserWorker, type HTTPRequest } from '@cloudflare/puppeteer';
import { DIV_SOUP_PROBE, PAGE_META_PROBE } from './probes';
import { assertUrlIsSafe, SsrfBlockedError } from './ssrf';
import type { AxDivSoupProbe, AxPageMeta, AxSnapshot, AxSnapshotNode } from './types';

const NAV_TIMEOUT_MS = 20_000;
export const DEFAULT_VIEWPORT = { width: 1280, height: 800 };

export interface CaptureOptions {
  url: string;
  javaScriptEnabled?: boolean;
  viewport?: { width: number; height: number };
}

// Nó cru do CDP: role/name vêm como { type, value } (às vezes ausentes em nós
// puramente estruturais) e ignoredReasons como [{ name, value }].
interface RawAxNode {
  nodeId: string;
  parentId?: string;
  childIds?: string[];
  ignored: boolean;
  ignoredReasons?: Array<{ name: string }>;
  role?: { value?: string };
  name?: { value?: string };
  backendDOMNodeId?: number;
}

function normalizeNode(raw: RawAxNode): AxSnapshotNode {
  return {
    nodeId: raw.nodeId,
    parentId: raw.parentId,
    childIds: raw.childIds,
    ignored: raw.ignored,
    ignoredReasons: raw.ignoredReasons?.map((r) => r.name),
    role: raw.role?.value,
    name: raw.name?.value,
    backendDOMNodeId: raw.backendDOMNodeId,
  };
}

/**
 * Conecta no Browser Rendering, captura a AX tree completa via CDP e roda as
 * probes complementares. Sempre fecha o browser, inclusive em erro — sessão
 * que morre por BrowserIdle em vez de NormalClosure continua contando minuto.
 */
export async function captureAx(browserBinding: BrowserWorker, options: CaptureOptions): Promise<AxSnapshot> {
  const viewport = options.viewport ?? DEFAULT_VIEWPORT;
  const javaScriptEnabled = options.javaScriptEnabled !== false;

  // Valida a URL de entrada antes de gastar um lançamento de browser com ela.
  await assertUrlIsSafe(options.url);

  const browser = await puppeteer.launch(browserBinding);
  try {
    const capture = async (): Promise<AxSnapshot> => {
      const page = await browser.newPage();
      await page.setViewport(viewport);
      page.setDefaultNavigationTimeout(NAV_TIMEOUT_MS);

      if (!javaScriptEnabled) {
        await page.setJavaScriptEnabled(false);
      }

      // Revalida a cada navegação de frame principal (inclui redirects) —
      // validar só a URL de entrada deixa passar redirect pra IP interno.
      let blockedBy: SsrfBlockedError | undefined;
      await page.setRequestInterception(true);
      page.on('request', (request: HTTPRequest) => {
        if (!request.isNavigationRequest()) {
          request.continue();
          return;
        }
        assertUrlIsSafe(request.url())
          .then(() => request.continue())
          .catch((err) => {
            blockedBy = err instanceof SsrfBlockedError ? err : new SsrfBlockedError('navegação redirecionou pra destino bloqueado');
            request.abort('blockedbyclient');
          });
      });

      const cdp = await page.createCDPSession();
      await cdp.send('Accessibility.enable');
      try {
        await page.goto(options.url, { waitUntil: 'networkidle0', timeout: NAV_TIMEOUT_MS });
      } catch (err) {
        if (blockedBy) throw blockedBy;
        throw err;
      }

      const { nodes } = (await cdp.send('Accessibility.getFullAXTree')) as { nodes: RawAxNode[] };

      // Com JS desligado, page.evaluate ainda roda (é o motor da página
      // executando nosso script, não script da própria página).
      const divSoup = (await page.evaluate(DIV_SOUP_PROBE)) as AxDivSoupProbe;
      const pageMeta = (await page.evaluate(PAGE_META_PROBE)) as AxPageMeta;

      return {
        schema: 'ax-snapshot/1',
        url: options.url,
        capturedAt: new Date().toISOString(),
        javaScriptEnabled,
        viewport,
        nodeCount: nodes.length,
        nodes: nodes.map(normalizeNode),
        probes: { pageMeta, divSoup },
      };
    };

    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('capture timed out')), NAV_TIMEOUT_MS);
    });

    return await Promise.race([capture(), timeout]);
  } finally {
    await browser.close();
  }
}
