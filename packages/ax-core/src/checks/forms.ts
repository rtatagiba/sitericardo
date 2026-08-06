import type { AxSnapshot, Finding } from '../types';

const FORM_CONTROL_ROLES = new Set(['textbox', 'checkbox', 'radio', 'combobox', 'switch']);

export function checkForms(snapshot: AxSnapshot): Finding[] {
  const unnamed = snapshot.nodes.filter(
    (n) => !n.ignored && n.role && FORM_CONTROL_ROLES.has(n.role) && !n.name?.trim(),
  );
  if (unnamed.length === 0) return [];
  return [
    {
      id: 'form-unnamed-control',
      severity: 'critical',
      category: 'forms',
      message: `${unnamed.length} campo(s) de formulário sem label associado.`,
      evidence: unnamed.slice(0, 3).map((n) => `role "${n.role}" (nodeId ${n.nodeId}), sem label`),
    },
  ];
}
