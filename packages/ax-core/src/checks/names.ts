import type { AxSnapshot, Finding } from '../types';

const INTERACTIVE_ROLES = new Set([
  'button',
  'link',
  'textbox',
  'checkbox',
  'radio',
  'combobox',
  'switch',
  'slider',
  'menuitem',
  'tab',
]);

export function checkNames(snapshot: AxSnapshot): Finding[] {
  const unnamed = snapshot.nodes.filter(
    (n) => !n.ignored && n.role && INTERACTIVE_ROLES.has(n.role) && !n.name?.trim(),
  );
  if (unnamed.length === 0) return [];
  return [
    {
      id: 'unnamed-interactive',
      severity: 'critical',
      category: 'names',
      message: `${unnamed.length} elemento(s) interativo(s) sem nome acessível (ex: role "${unnamed[0].role}") — inutilizáveis por leitor de tela ou agente.`,
    },
  ];
}
