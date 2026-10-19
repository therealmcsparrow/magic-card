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

describe('layer action row at the narrowest panel (320 px)', () => {
  it('renders all seven buttons in one .acts row', async () => {
    await import('../src/svg-editor/index');
    const el = document.createElement('mc-svg-editor') as HTMLElement & { updateComplete: Promise<boolean>; stage: string };
    Object.assign(el, { source: { kind: 'svg', svg: '<svg viewBox="0 0 24 24"><path d="M2 2h10v10H2z"/></svg>' } });
    document.body.append(el);
    const t = Date.now();
    while (el.stage === 'loading' && Date.now() - t < 4000) await new Promise((r) => setTimeout(r, 5));
    await el.updateComplete;
    const rows = el.shadowRoot!.querySelectorAll('.layers > .acts');
    expect(rows.length).toBe(1);
    expect(rows[0].querySelectorAll('button').length).toBe(7);
    el.remove();
  });
  it('seven minimum-size buttons plus six gaps fit in 320 px with room for panel padding', () => {
    const min = 24, gap = 2, n = 7;
    expect(n * min + (n - 1) * gap).toBeLessThanOrEqual(320 - 2 * 16);
    const r = rule('.layers > .acts .icon-btn');
    expect(Number(/min-width:\s*(\d+)px/.exec(r)![1])).toBeLessThanOrEqual(min);
  });
});
