import type { AxHeadingOutlineEntry, AxSnapshot, AxSnapshotNode } from './types';

// Os três casos de uso do plano: JS ligado vs. desligado, antes/depois de uma
// migração, ou o próprio site vs. um concorrente. O diff é o mesmo cálculo
// estrutural nos três — só muda o rótulo de "before"/"after".
export type DiffMode = 'js' | 'migracao' | 'concorrente';

export interface DiffResult {
  mode: DiffMode;
  nodeCountBefore: number;
  nodeCountAfter: number;
  nodeCountDelta: number;
  landmarkCountBefore: number;
  landmarkCountAfter: number;
  headingOutlineBefore: AxHeadingOutlineEntry[];
  headingOutlineAfter: AxHeadingOutlineEntry[];
  interactiveAdded: string[];
  interactiveRemoved: string[];
}

function interactiveKey(node: AxSnapshotNode): string {
  return `${node.role ?? ''}: ${node.name ?? ''}`;
}

function interactiveKeySet(snapshot: AxSnapshot): Set<string> {
  return new Set(
    snapshot.nodes.filter((n) => !n.ignored && n.role && n.role !== 'none' && n.role !== 'generic').map(interactiveKey),
  );
}

export function diffSnapshots(before: AxSnapshot, after: AxSnapshot, mode: DiffMode): DiffResult {
  const beforeKeys = interactiveKeySet(before);
  const afterKeys = interactiveKeySet(after);

  return {
    mode,
    nodeCountBefore: before.nodeCount,
    nodeCountAfter: after.nodeCount,
    nodeCountDelta: after.nodeCount - before.nodeCount,
    landmarkCountBefore: before.probes.pageMeta.landmarkCount,
    landmarkCountAfter: after.probes.pageMeta.landmarkCount,
    headingOutlineBefore: before.probes.pageMeta.headingOutline,
    headingOutlineAfter: after.probes.pageMeta.headingOutline,
    interactiveAdded: [...afterKeys].filter((k) => !beforeKeys.has(k)),
    interactiveRemoved: [...beforeKeys].filter((k) => !afterKeys.has(k)),
  };
}
