import { describe, expect, it } from 'vitest';
import { analyze } from '../src/analyze';
import { CLEAN_SNAPSHOT, DEFECTIVE_SNAPSHOT } from './fixtures';

describe('analyze', () => {
  it('não gera findings numa página bem marcada', () => {
    const result = analyze(CLEAN_SNAPSHOT);
    expect(result.findings).toHaveLength(0);
    expect(result.score).toBe(100);
    expect(result.band).toBe('bom');
  });

  // Trava o score esperado pra fixture com defeitos plantados — regressão
  // silenciosa em regra de scoring é difícil de perceber a olho.
  it('detecta os seis defeitos plantados e trava o score em 23/crítico', () => {
    const result = analyze(DEFECTIVE_SNAPSHOT);
    const ids = result.findings.map((f) => f.id).sort();
    expect(ids).toEqual([
      'div-soup',
      'form-unnamed-control',
      'heading-skip-level',
      'landmarks-no-main',
      'link-generic-text',
      'unnamed-interactive',
    ]);
    expect(result.score).toBe(23);
    expect(result.band).toBe('crítico');
  });
});
