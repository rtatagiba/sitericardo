import type { AxSnapshot, Finding } from '../types';

export function checkHeadings(snapshot: AxSnapshot): Finding[] {
  const findings: Finding[] = [];
  const outline = snapshot.probes.pageMeta.headingOutline;

  const h1Count = outline.filter((h) => h.level === 1).length;
  if (h1Count === 0) {
    findings.push({
      id: 'heading-no-h1',
      severity: 'serious',
      category: 'headings',
      message: 'Não há H1 na página — sem título principal, o outline que um agente usa pra navegar fica sem raiz.',
    });
  } else if (h1Count > 1) {
    findings.push({
      id: 'heading-multiple-h1',
      severity: 'moderate',
      category: 'headings',
      message: `Há ${h1Count} H1s na página — deveria ter só um por página.`,
    });
  }

  for (let i = 1; i < outline.length; i++) {
    const jump = outline[i].level - outline[i - 1].level;
    if (jump > 1) {
      findings.push({
        id: 'heading-skip-level',
        severity: 'moderate',
        category: 'headings',
        message: `Salto de H${outline[i - 1].level} pra H${outline[i].level} ("${outline[i].text}") — quebra o outline hierárquico.`,
      });
    }
  }

  const emptyCount = outline.filter((h) => !h.text.trim()).length;
  if (emptyCount > 0) {
    findings.push({
      id: 'heading-empty',
      severity: 'minor',
      category: 'headings',
      message: `${emptyCount} heading(s) sem texto.`,
    });
  }

  return findings;
}
