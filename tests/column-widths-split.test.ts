import { describe, expect, it } from 'vitest';
import * as cardSide from '../src/utils/column-widths';
import * as editSide from '../src/utils/column-widths-edit';

/*
 * magic-card.js lays out rows (rowGridTemplate and what it needs); the editor-only width helpers are in column-widths-edit.ts,
 * which only the card editor imports.
 */

describe('column widths split', () => {
  it('column-widths.ts keeps what the card renders with', () => {
    expect(Object.keys(cardSide).sort()).toEqual(['WIDTH_RE', 'columnWidthsList', 'columnWidthsTemplate', 'hasColumnWidths', 'normalizeWidth', 'rowGridTemplate']);
  });

  it('column-widths-edit.ts has the editor helpers', () => {
    expect(Object.keys(editSide).sort()).toEqual(['applyRowLayout', 'effectiveWidths', 'parseWidth', 'widthWeights']);
  });

  it('parseWidth reads fr, %, px and auto, and falls back to 1fr', () => {
    expect(editSide.parseWidth('2fr')).toEqual({ value: 2, unit: 'fr' });
    expect(editSide.parseWidth('50%')).toEqual({ value: 50, unit: '%' });
    expect(editSide.parseWidth('auto')).toEqual({ value: 0, unit: 'auto' });
    expect(editSide.parseWidth('nonsense')).toEqual({ value: 1, unit: 'fr' });
  });
});
