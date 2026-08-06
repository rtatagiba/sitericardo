// Contrato canônico entre captura e análise. ax-core não depende de runtime
// nenhum (nem do Worker, nem de Node) — só desses tipos e funções puras, pra
// poder ser consumido tanto pelo Worker quanto por uma skill local via node.

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

export type Severity = 'critical' | 'serious' | 'moderate' | 'minor';

export type FindingCategory = 'landmarks' | 'headings' | 'names' | 'div-soup' | 'links' | 'forms' | 'noise';

export interface Finding {
  id: string;
  severity: Severity;
  category: FindingCategory;
  message: string;
}

export interface AxFindings {
  schema: 'ax-findings/1';
  url: string;
  score: number;
  band: string;
  findings: Finding[];
}
