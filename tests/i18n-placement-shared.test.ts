// D7 placement: a shared chunk (path-core, history, shape-path) hangs next to the chunk that uses it and never holds a
// namespace index, so it must not stop the using chunk from reaching the index its other parent holds.
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs tool without types
import { bundlesOf, reaches } from '../tools/i18n/placement.mjs';

const INDEX = 'src/i18n/labels/index.ts';
const stats = (shared: string) => ({
  chunks: [
    { id: 1, files: ['magic-card-editor.0c6effc1.js'], modules: ['./' + INDEX, './src/editor/x.ts'], parents: [0] },
    { id: 2, files: [shared], modules: ['./src/utils/shared.ts'], parents: [0] },
    { id: 3, files: ['magic-card-icon-animator.6c1bd615.js'], modules: ['./src/icon-anim/icon-doc.ts'], parents: [1, 2] },
  ],
});

describe('placement reach through a shared chunk', () => {
  it.each(['magic-card-shape-path.90093bb7.js', 'magic-card-history.2d57ac55.js', 'magic-card-path-core.5b3ab1fa.js'])(
    'a chunk whose second parent is %s reaches the index its real parent holds',
    (shared) => {
      const s = stats(shared);
      expect(reaches(s, bundlesOf(s), 'magic-card-icon-animator.js', INDEX)).toBe(true);
    },
  );

  it('a chunk whose real parents do not hold the index still fails', () => {
    const s = stats('magic-card-shape-path.90093bb7.js');
    s.chunks[0].modules = ['./src/editor/x.ts'];
    expect(reaches(s, bundlesOf(s), 'magic-card-icon-animator.js', INDEX)).toBe(false);
  });
});
