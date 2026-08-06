import type { AxSnapshot, Finding } from '../types';

const LARGE_TREE_THRESHOLD = 800;

export function checkNoise(snapshot: AxSnapshot): Finding[] {
  if (snapshot.nodeCount <= LARGE_TREE_THRESHOLD) return [];
  return [
    {
      id: 'tree-too-large',
      severity: 'moderate',
      category: 'noise',
      message: `Árvore de acessibilidade com ${snapshot.nodeCount} nós — árvores grandes custam mais tokens de contexto pra um agente processar.`,
    },
  ];
}
