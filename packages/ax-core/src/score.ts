import type { Finding, Severity } from './types';

// PESOS — quanto cada severidade desconta do score de 100. Mudar isso muda o
// score de todo mundo; trate como mudança de produto, não ajuste solto.
export const SEVERITY_POINTS: Record<Severity, number> = {
  critical: 25,
  serious: 15,
  moderate: 8,
  minor: 3,
};

// Faixas de leitura do score.
export const SCORE_BANDS = [
  { min: 0, max: 40, label: 'crítico' },
  { min: 41, max: 70, label: 'atenção' },
  { min: 71, max: 100, label: 'bom' },
] as const;

export function scoreFindings(findings: Finding[]): { score: number; band: string } {
  const deduction = findings.reduce((sum, f) => sum + SEVERITY_POINTS[f.severity], 0);
  const score = Math.max(0, 100 - deduction);
  const band = SCORE_BANDS.find((b) => score >= b.min && score <= b.max)?.label ?? 'bom';
  return { score, band };
}
