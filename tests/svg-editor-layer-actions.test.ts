/** The layer action buttons (group, duplicate, delete, select all, move to, up, down) stay on one line. */
import { describe, expect, it } from 'vitest';
import { editorStyles } from '../src/svg-editor/styles';

const css = editorStyles.map((s) => s.cssText).join('\n').replace(/\/\*[\s\S]*?\*\//g, '');
const rule = (sel: string): string => [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(([, s]) => s.split(',').some((x) => x.replace(/\s+/g, '').replace(/^.*\}/, '') === sel.replace(/\s+/g, ''))).map(([, , b]) => b).join(';');

describe('layer action buttons fit on one line', () => {
  it('the row does not wrap and the gaps are tight', () => {
    const r = rule('.layers > .acts');
    expect(r).toMatch(/flex-wrap:\s*nowrap/);
    expect(r).toMatch(/gap:\s*2px/);
  });
  it('the buttons shrink to 24 px at most, never below (WCAG 2.2 target size)', () => {
    const r = rule('.layers > .acts .icon-btn');
    expect(r).toMatch(/min-width:\s*24px/);
    expect(r).toMatch(/min-height:\s*24px|height:\s*2[4-8]px/);
    expect(r).toMatch(/flex:\s*0 1 28px/);
  });
});
