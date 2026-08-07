import puppeteer, { type BrowserWorker, type HTTPRequest } from '@cloudflare/puppeteer';
import { analyze } from '../../../../packages/ax-core/src/analyze';
import { DIV_SOUP_PROBE, PAGE_META_PROBE } from './probes';
import { assertUrlIsSafe, SsrfBlockedError } from './ssrf';
import type { AxDivSoupProbe, AxPageMeta, AxSnapshot, AxSnapshotNode } from '../../../../packages/ax-core/src/types';

const NAV_TIMEOUT_MS = 20_000;
export const DEFAULT_VIEWPORT = { width: 1280, height: 800 };

export type CaptureStep = 'abrindo-browser' | 'carregando-pagina' | 'tirando-screenshot' | 'lendo-arvore' | 'rodando-sondas';

export interface CaptureOptions {
  url: string;
  javaScriptEnabled?: boolean;
  viewport?: { width: number; height: number };
  onProgress?: (step: CaptureStep) => void;
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

interface CdpSessionLike {
  send(method: string, params?: Record<string, unknown>): Promise<unknown>;
}

interface BoxModelResult {
  model: { content: number[] };
}

// Bounding box (retângulo mínimo em torno do quad de conteúdo) só pros nós
// que algum finding referenciou — não vale gastar uma volta de CDP por nó
// numa árvore com milhares deles pra desenhar um overlay que ninguém vai ver.
async function fetchBoxes(
  cdp: CdpSessionLike,
  nodes: AxSnapshotNode[],
  nodeIds: Set<string>,
): Promise<Record<string, { x: number; y: number; width: number; height: number }>> {
  const boxes: Record<string, { x: number; y: number; width: number; height: number }> = {};
  if (nodeIds.size === 0) return boxes;

  try {
    await cdp.send('DOM.enable');
  } catch {
    return boxes; // overlay é conveniência, não vale falhar a captura inteira por ele
  }

  const byId = new Map(nodes.map((n) => [n.nodeId, n]));
  for (const nodeId of nodeIds) {
    const node = byId.get(nodeId);
    if (!node?.backendDOMNodeId) continue;
    try {
      const result = (await cdp.send('DOM.getBoxModel', {
        backendNodeId: node.backendDOMNodeId,
      })) as BoxModelResult;
      // content = [x1,y1, x2,y2, x3,y3, x4,y4] = topLeft, topRight, bottomRight, bottomLeft
      const [x1, y1, x2, , , y3] = result.model.content;
      boxes[nodeId] = { x: x1, y: y1, width: x2 - x1, height: y3 - y1 };
    } catch {
      // nó sem box (display:none, fora do layout) — sem overlay pra ele, sem drama
    }
  }
  return boxes;
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

  const onProgress = options.onProgress ?? (() => {});

  onProgress('abrindo-browser');
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
      onProgress('carregando-pagina');
      try {
        await page.goto(options.url, { waitUntil: 'networkidle0', timeout: NAV_TIMEOUT_MS });
      } catch (err) {
        if (blockedBy) throw blockedBy;
        throw err;
      }

      onProgress('tirando-screenshot');
      const screenshotBase64 = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 70 });
      const screenshot = `data:image/jpeg;base64,${screenshotBase64}`;

      onProgress('lendo-arvore');
      const { nodes } = (await cdp.send('Accessibility.getFullAXTree')) as { nodes: RawAxNode[] };

      onProgress('rodando-sondas');
      // Com JS desligado, page.evaluate ainda roda (é o motor da página
      // executando nosso script, não script da própria página).
      const divSoup = (await page.evaluate(DIV_SOUP_PROBE)) as AxDivSoupProbe;
      const pageMeta = (await page.evaluate(PAGE_META_PROBE)) as AxPageMeta;
      const normalizedNodes = nodes.map(normalizeNode);

      const snapshot: AxSnapshot = {
        schema: 'ax-snapshot/1',
        url: options.url,
        capturedAt: new Date().toISOString(),
        javaScriptEnabled,
        viewport,
        nodeCount: nodes.length,
        nodes: normalizedNodes,
        probes: { pageMeta, divSoup },
        screenshot,
      };

      // analyze() é puro (só lê o snapshot montado acima) — dá pra rodar
      // aqui, antes de fechar o browser, só pra saber quais nós precisam de
      // bounding box pro overlay. O caller roda analyze() de novo depois
      // pra montar a resposta; é redundante mas barato, e mantém captura e
      // análise desacopladas.
      const overlayNodeIds = new Set(
        analyze(snapshot).findings.flatMap((f) => f.nodeIds ?? []),
      );
      snapshot.boxes = await fetchBoxes(cdp, normalizedNodes, overlayNodeIds);

      return snapshot;
    };

    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('capture timed out')), NAV_TIMEOUT_MS);
    });

    return await Promise.race([capture(), timeout]);
  } finally {
    await browser.close();
  }
}
