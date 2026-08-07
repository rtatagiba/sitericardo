import type { AxSnapshot } from '../src/types';

// Snapshot sintético com defeitos plantados de propósito, um por categoria:
// sem landmark "main", pula de H1 pra H3, botão sem nome, div soup acima do
// limite, link com texto genérico e campo de form sem label. Serve pra travar
// o score esperado (test/score.test.ts) e detectar regressão silenciosa em
// regra de scoring.
export const DEFECTIVE_SNAPSHOT: AxSnapshot = {
  schema: 'ax-snapshot/1',
  url: 'https://exemplo-defeituoso.test/',
  capturedAt: '2026-01-01T00:00:00.000Z',
  javaScriptEnabled: true,
  viewport: { width: 1280, height: 800 },
  nodeCount: 6,
  nodes: [
    { nodeId: '1', ignored: false, role: 'RootWebArea', name: 'Exemplo defeituoso' },
    { nodeId: '2', ignored: false, role: 'heading', name: 'Título' }, // H1, coberto via probes
    { nodeId: '3', ignored: false, role: 'button', name: '' }, // botão sem nome
    { nodeId: '4', ignored: false, role: 'link', name: 'clique aqui' }, // link genérico
    { nodeId: '5', ignored: false, role: 'textbox', name: '' }, // campo sem label
    { nodeId: '6', ignored: true, ignoredReasons: ['uninteresting'], role: 'none' },
  ],
  probes: {
    pageMeta: {
      title: 'Exemplo defeituoso',
      lang: 'pt-BR',
      headingOutline: [
        { level: 1, text: 'Título' },
        { level: 3, text: 'Subtítulo direto em H3' }, // pula H2
      ],
      landmarkCount: 1, // tem landmark, mas nenhum "main"
    },
    divSoup: {
      totalElements: 100,
      genericContainers: 70,
      ratio: 0.7, // acima do limiar moderate (0.6)
    },
  },
};

// Snapshot limpo — sem findings, score 100 — pra garantir que checks não
// disparam falso-positivo numa página bem marcada.
export const CLEAN_SNAPSHOT: AxSnapshot = {
  schema: 'ax-snapshot/1',
  url: 'https://exemplo-limpo.test/',
  capturedAt: '2026-01-01T00:00:00.000Z',
  javaScriptEnabled: true,
  viewport: { width: 1280, height: 800 },
  nodeCount: 4,
  nodes: [
    { nodeId: '1', ignored: false, role: 'RootWebArea', name: 'Exemplo limpo' },
    { nodeId: '2', ignored: false, role: 'main', name: '' },
    { nodeId: '3', ignored: false, role: 'button', name: 'Enviar' },
    { nodeId: '4', ignored: false, role: 'link', name: 'Política de privacidade' },
  ],
  probes: {
    pageMeta: {
      title: 'Exemplo limpo',
      lang: 'pt-BR',
      headingOutline: [{ level: 1, text: 'Título' }],
      landmarkCount: 2,
    },
    divSoup: {
      totalElements: 100,
      genericContainers: 10,
      ratio: 0.1,
    },
  },
};
