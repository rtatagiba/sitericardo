import type { AxSnapshot, Finding } from '../types';

const GENERIC_LINK_TEXTS = new Set([
  'clique aqui',
  'saiba mais',
  'leia mais',
  'aqui',
  'click here',
  'read more',
  'learn more',
  'here',
]);

export function checkLinks(snapshot: AxSnapshot): Finding[] {
  const generic = snapshot.nodes.filter(
    (n) => !n.ignored && n.role === 'link' && n.name && GENERIC_LINK_TEXTS.has(n.name.trim().toLowerCase()),
  );
  if (generic.length === 0) return [];
  return [
    {
      id: 'link-generic-text',
      severity: 'minor',
      category: 'links',
      message: `${generic.length} link(s) com texto genérico ("${generic[0].name}") — fora de contexto, não diz pra onde leva.`,
      evidence: generic.slice(0, 3).map((n) => `"${n.name}" (nodeId ${n.nodeId})`),
      nodeIds: generic.slice(0, 20).map((n) => n.nodeId),
    },
  ];
}
