import { describe, it, expect, vi } from 'vitest';
import { html, render } from 'lit';
import { button, chip, empty, field, fieldErrorId, fieldHelpId, notice, seg, switchRow, tiles, kitCss, kitLip, kitTokens, editorPrimitives, cornerGlyph, glyph } from '../src/ui-kit';
import { editorTokens } from '../src/css/editor-system';
import { KIT_CLASSES, KIT_SCOPED_TOKENS, NEW_TOKENS } from '../src/contracts/ui-kit';

const mount = (t: unknown): HTMLElement => {
  const host = document.createElement('div');
  document.body.append(host);
  render(t as never, host);
  return host;
};

describe('button', () => {
  it('text button: variant and size classes, no aria-label', () => {
    const h = mount(button({ label: 'Done', variant: 'primary', size: 'sm', onClick: () => {} }));
    const b = h.querySelector('button') as HTMLButtonElement;
    expect(b.className).toContain('btn btn-primary btn-sm');
    expect(b.textContent?.trim()).toBe('Done');
    expect(b.hasAttribute('aria-label')).toBe(false);
  });

  it('icon-only button: label is aria-label and title, class icon-btn', () => {
    const h = mount(button({ label: 'Undo', glyph: 'undo', iconOnly: true, onClick: () => {} }));
    const b = h.querySelector('button') as HTMLButtonElement;
    expect(b.className).toBe('icon-btn');
    expect(b.getAttribute('aria-label')).toBe('Undo');
    expect(b.getAttribute('title')).toBe('Undo');
    expect(b.querySelector('svg')).toBeTruthy();
    expect(b.textContent?.trim()).toBe('');
  });

  it('pressed, expanded and haspopup become aria', () => {
    const h = mount(button({ label: 'Grid', pressed: true, haspopup: 'menu', expanded: false, controls: 'm1', onClick: () => {} }));
    const b = h.querySelector('button') as HTMLButtonElement;
    expect(b.getAttribute('aria-pressed')).toBe('true');
    expect(b.getAttribute('aria-haspopup')).toBe('menu');
    expect(b.getAttribute('aria-expanded')).toBe('false');
    expect(b.getAttribute('aria-controls')).toBe('m1');
  });

  it('a disabledReason keeps it focusable and ignores the click', () => {
    const fn = vi.fn();
    const h = mount(button({ label: 'Combine', disabledReason: 'Select two shapes', onClick: fn }));
    const b = h.querySelector('button') as HTMLButtonElement;
    expect(b.disabled).toBe(false);
    expect(b.getAttribute('aria-disabled')).toBe('true');
    b.click();
    expect(fn).not.toHaveBeenCalled();
  });

  it('click calls onClick', () => {
    const fn = vi.fn();
    mount(button({ label: 'Go', onClick: fn })).querySelector('button')?.click();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('field and switchRow', () => {
  it('field: label for the control, help text, error replaces help', () => {
    const h = mount(field({ id: 'w', label: 'Width', help: 'In pixels.', control: html`<input id="w" class="input" />` }));
    expect(h.querySelector('label')?.getAttribute('for')).toBe('w');
    expect(h.querySelector('.help')?.id).toBe(fieldHelpId('w'));
    const e = mount(field({ id: 'w', label: 'Width', help: 'In pixels.', error: 'Use a number.', control: html`<input id="w" />` }));
    expect(e.querySelector('.help.error')?.id).toBe(fieldErrorId('w'));
    expect(e.querySelector('.help.error')?.getAttribute('role')).toBe('alert');
    expect(e.querySelectorAll('.help').length).toBe(1);
  });

  it('field: reset button only when onReset is set', () => {
    const fn = vi.fn();
    const h = mount(field({ id: 'w', label: 'Width', onReset: fn, resetLabel: 'Reset width', control: html`<input id="w" />` }));
    const r = h.querySelector('.field-reset') as HTMLButtonElement;
    expect(r.getAttribute('aria-label')).toBe('Reset width');
    r.click();
    expect(fn).toHaveBeenCalled();
    expect(mount(field({ id: 'x', label: 'X', control: html`` })).querySelector('.field-reset')).toBeNull();
  });

  it('switchRow is a role=switch button with aria-checked, labelled and described', () => {
    const fn = vi.fn();
    const h = mount(switchRow({ id: 's', label: 'Dual-tone', help: 'Two colours.', checked: false, onChange: fn }));
    const s = h.querySelector('button.switch') as HTMLButtonElement;
    expect(s.getAttribute('role')).toBe('switch');
    expect(s.getAttribute('aria-checked')).toBe('false');
    expect(s.getAttribute('aria-describedby')).toBe(fieldHelpId('s'));
    expect(h.querySelector('label')?.getAttribute('for')).toBe('s');
    s.click();
    expect(fn).toHaveBeenCalledWith(true);
  });
});

describe('seg, chip, tiles', () => {
  const items = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }];

  it('seg as radiogroup: aria-checked, one tab stop, arrows select', () => {
    const onChange = vi.fn();
    const h = mount(seg({ role: 'radiogroup', label: 'Mode', items, value: 'a', full: true, onChange }));
    const g = h.querySelector('.seg') as HTMLElement;
    expect(g.className).toBe('seg full');
    expect(g.getAttribute('role')).toBe('radiogroup');
    const bs = Array.from(g.querySelectorAll('button'));
    expect(bs.map((b) => b.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false']);
    expect(bs.map((b) => b.tabIndex)).toEqual([0, -1, -1]);
    bs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('seg as tablist uses tab roles and aria-selected', () => {
    const h = mount(seg({ role: 'tablist', label: 'Views', items, value: 'b', onChange: () => {} }));
    const bs = Array.from(h.querySelectorAll('button'));
    expect(bs.every((b) => b.getAttribute('role') === 'tab')).toBe(true);
    expect(bs.map((b) => b.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false']);
  });

  it('chip: span without a click handler, pressed button with one', () => {
    expect(mount(chip({ label: '3 points', tone: 'count' })).querySelector('span.chip.is-count')).toBeTruthy();
    const b = mount(chip({ label: 'Over 32 KB', tone: 'error', pressed: true, onClick: () => {} })).querySelector('button.chip.is-error') as HTMLElement;
    expect(b.getAttribute('aria-pressed')).toBe('true');
  });

  it('tiles: radiogroup, picked tile checked, click picks', () => {
    const onPick = vi.fn();
    const h = mount(tiles({ label: 'Start', items, value: 'b', onPick }));
    const ts = Array.from(h.querySelectorAll<HTMLElement>('.tile'));
    expect(ts.map((t) => t.getAttribute('aria-checked'))).toEqual(['false', 'true', 'false']);
    ts[2].click();
    expect(onPick).toHaveBeenCalledWith('c');
  });
});

describe('notice and empty', () => {
  it('error notice is role=alert, others role=status; tone class and action', () => {
    const fn = vi.fn();
    const e = mount(notice({ tone: 'error', text: ['Could not read the file.', 'Nothing was changed.'], action: { label: 'Try again', onClick: fn } }));
    const n = e.querySelector('.notice') as HTMLElement;
    expect(n.className).toContain('error');
    expect(n.getAttribute('role')).toBe('alert');
    expect(n.querySelectorAll('p').length).toBe(2);
    (n.querySelector('button') as HTMLButtonElement).click();
    expect(fn).toHaveBeenCalled();
    expect(mount(notice({ tone: 'info', text: 'Saved.' })).querySelector('.notice')?.getAttribute('role')).toBe('status');
    expect(mount(notice({ tone: 'info', text: 'Saved.', transient: true })).querySelector('.result-note')).toBeTruthy();
  });

  it('empty shows title, text and an optional action', () => {
    const h = mount(empty({ title: 'Nothing here yet', text: 'Draw a shape.', glyph: 'pen', action: { label: 'Draw', onClick: () => {} } }));
    expect(h.querySelector('strong')?.textContent).toBe('Nothing here yet');
    expect(h.querySelector('p')?.textContent).toBe('Draw a shape.');
    expect(h.querySelector('button')?.textContent?.trim()).toBe('Draw');
  });
});

describe('glyphs', () => {
  it('the svg-editor set is copied with its names, and the corner glyphs were added', () => {
    const g = mount(glyph('undo', 18));
    expect(g.querySelector('svg')?.getAttribute('width')).toBe('18');
    expect(mount(cornerGlyph('bevel', 90)).querySelector('svg')?.getAttribute('style')).toContain('rotate(90deg)');
  });
});

describe('css and tokens', () => {
  it('editorTokens carries the eight new tokens, with a coarse hit size', () => {
    for (const t of NEW_TOKENS) expect(editorTokens.cssText).toContain(`${t}:`);
    expect(editorTokens.cssText).toMatch(/pointer:\s*coarse[^}]*\{[^}]*--mc-hit:\s*44px/);
  });

  it('kitTokens declares the seven kit-scoped tokens on :host, with coarse hit sizes', () => {
    const css = kitTokens.cssText;
    for (const t of KIT_SCOPED_TOKENS) expect(css).toContain(`${t}:`);
    expect(css).toMatch(/:host\s*\{/);
    expect(css).toMatch(/pointer:\s*coarse[^}]*\{[^}]*--mc-hit-sm:\s*44px[^}]*--mc-hit-xs:\s*44px/);
    expect(kitCss[0]).toBe(kitTokens);
  });

  it('the kit parts define every class the contract lists as a kit class that needs a rule', () => {
    const all = [editorPrimitives, ...kitCss, kitLip].map((c) => c.cssText).join('\n');
    // classes the contract names but the kit does not style yet (rows, rail, topbar, slider row and the section header are screen work)
    const later = new Set(['rows', 'row', 'slider-row', 'with-action', 'result-note', 'toast']);
    const missing = KIT_CLASSES.filter((c) => !later.has(c) && !new RegExp(`\\.${c}(?![\\w-])`).test(all));
    expect(missing).toEqual([]);
  });

  it('the new button states exist', () => {
    const all = kitCss.map((c) => c.cssText).join('\n');
    expect(all).toContain('.btn-danger');
    expect(all).toContain("aria-pressed='true'");
    expect(all).toContain("aria-disabled='true'");
    expect(all).toContain('.icon-btn.xs');
  });
});

describe('light-theme contrast', () => {
  it('field border is Text at 50 %, not 40 %', () => {
    expect(editorTokens.cssText).toMatch(/--mc-field-border:\s*color-mix\(in srgb,\s*var\(--primary-text-color,\s*#212121\)\s*50%/);
  });

  it('--mc-focus is accent 80 % plus text 20 %, and the focus ring and focused field use it', () => {
    expect(editorTokens.cssText).toMatch(/--mc-focus:\s*color-mix\(in srgb,\s*var\(--mc-accent\)\s*80%,\s*var\(--mc-text\)\)/);
    const css = editorPrimitives.cssText;
    expect(css).toMatch(/:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--mc-focus\)/);
    expect(css).toMatch(/\.input:focus\s*\{[^}]*border-color:\s*var\(--mc-focus\)/);
  });

  it('an invalid field gets the error border, and the ring too while focused', () => {
    const css = editorPrimitives.cssText;
    expect(css).toMatch(/\.input\[aria-invalid=['"]true['"]\]\s*\{[^}]*border-color:\s*var\(--mc-error-ink\)/);
    expect(css).toMatch(/\.input\[aria-invalid=['"]true['"]\]:focus\s*\{[^}]*var\(--mc-error-ink\)/);
  });
});
