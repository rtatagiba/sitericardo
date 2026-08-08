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
  /** JPEG da viewport no momento da captura, como data URL. Ausente em snapshots antigos (schema é o mesmo, campo é opcional pra manter compatibilidade). */
  screenshot?: string;
  /** Bounding box (coordenadas de viewport) por nodeId, só pros nós referenciados por algum finding — pra overlay sobre o screenshot. */
  boxes?: Record<string, { x: number; y: number; width: number; height: number }>;
}

export type Severity = 'critical' | 'serious' | 'moderate' | 'minor';

export type FindingCategory = 'landmarks' | 'headings' | 'names' | 'div-soup' | 'links' | 'forms' | 'noise';

export interface Finding {
  id: string;
  severity: Severity;
  category: FindingCategory;
  message: string;
  /** Exemplos concretos (até 3) por trás do finding — pra evidência colapsável na UI. */
  evidence?: string[];
  /** nodeIds dos nós por trás do finding, quando aplicável — pra desenhar o overlay sobre o screenshot. */
  nodeIds?: string[];
}

export interface AxFindings {
  schema: 'ax-findings/1';
  url: string;
  score: number;
  band: string;
  findings: Finding[];
}
