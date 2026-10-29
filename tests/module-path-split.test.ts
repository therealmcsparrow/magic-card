import { describe, expect, it } from 'vitest';
import * as cardSide from '../src/utils/module-path';
import * as editSide from '../src/utils/module-path-edit';
import type { CardModule } from '../src/types';

/*
 * magic-card.js reads children (childSlots, parseChildChain, childListKey); the editor-only tree helpers are in
 * module-path-edit.ts, which only the card editor imports.
 */

const row = {
  id: 'r',
  type: 'row',
  columns: [{ modules: [{ id: 'a', type: 'text' }] }, { modules: [{ id: 'b', type: 'text' }] }],
} as unknown as CardModule;

describe('module path split', () => {
  it('module-path.ts keeps the child reads the card does', () => {
    expect(Object.keys(cardSide).sort()).toEqual(['childListKey', 'childSlots', 'hasChildSlots', 'parseChildChain']);
  });

  it('module-path-edit.ts has the editor helpers', () => {
    expect(Object.keys(editSide).sort()).toEqual(['childAt', 'descendantAt', 'formatChildChain', 'hasSlotNodes', 'mutableSlot', 'replaceDescendant']);
  });

  it('the editor helpers still walk a row', () => {
    expect(editSide.descendantAt(row, [{ slot: 1, index: 0 }])).toMatchObject({ id: 'b' });
    expect(editSide.formatChildChain([{ slot: 1, index: 0 }])).toBe('1.0');
    expect(cardSide.parseChildChain('1.0')).toEqual([{ slot: 1, index: 0 }]);
    const next = editSide.replaceDescendant(row, [{ slot: 0, index: 0 }], { id: 'z', type: 'icon' } as unknown as CardModule);
    expect(cardSide.childSlots(next)![0][0]).toMatchObject({ id: 'z' });
    expect(cardSide.childSlots(row)![0][0]).toMatchObject({ id: 'a' });
    expect(editSide.hasSlotNodes(row)).toBe(true);
    expect(cardSide.childListKey(row)).toBe('columns');
  });
});
