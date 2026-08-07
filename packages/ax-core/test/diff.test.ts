import { describe, expect, it } from 'vitest';
import { diffSnapshots } from '../src/diff';
import { CLEAN_SNAPSHOT, DEFECTIVE_SNAPSHOT } from './fixtures';

describe('diffSnapshots', () => {
  it('reporta a diferença estrutural entre dois snapshots', () => {
    const result = diffSnapshots(CLEAN_SNAPSHOT, DEFECTIVE_SNAPSHOT, 'js');
    expect(result.mode).toBe('js');
    expect(result.nodeCountBefore).toBe(4);
    expect(result.nodeCountAfter).toBe(6);
    expect(result.nodeCountDelta).toBe(2);
    expect(result.landmarkCountBefore).toBe(2);
    expect(result.landmarkCountAfter).toBe(1);
    // "main" existia antes e sumiu depois — deve aparecer como removido.
    expect(result.interactiveRemoved).toContain('main: ');
  });

  it('não acusa diferença nenhuma comparando o mesmo snapshot consigo mesmo', () => {
    const result = diffSnapshots(CLEAN_SNAPSHOT, CLEAN_SNAPSHOT, 'concorrente');
    expect(result.nodeCountDelta).toBe(0);
    expect(result.interactiveAdded).toHaveLength(0);
    expect(result.interactiveRemoved).toHaveLength(0);
  });
});
