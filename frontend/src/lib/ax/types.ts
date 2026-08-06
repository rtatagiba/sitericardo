// Schema ax-snapshot/1 — contrato entre a captura (Worker) e a análise
// (ax-core, Fase 3). Mudar isso depois de a Fase 3 existir quebra os dois lados.

export interface AxSnapshotNode {
  nodeId: string;
  parentId?: string;
  childIds?: string[];
  ignored: boolean;
  ignoredReasons?: string[];
  role?: string;
  name?: string;
  backendDOMNodeId?: number;
}

export interface AxHeadingOutlineEntry {
  level: number;
  text: string;
}

export interface AxPageMeta {
  title: string;
  lang: string | null;
  headingOutline: AxHeadingOutlineEntry[];
  landmarkCount: number;
}

export interface AxDivSoupProbe {
  totalElements: number;
  genericContainers: number;
  ratio: number;
}

export interface AxSnapshot {
  schema: 'ax-snapshot/1';
  url: string;
  capturedAt: string;
  javaScriptEnabled: boolean;
  viewport: { width: number; height: number };
  nodeCount: number;
  nodes: AxSnapshotNode[];
  probes: {
    pageMeta: AxPageMeta;
    divSoup: AxDivSoupProbe;
  };
}
