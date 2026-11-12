import { describe, it, expect } from 'vitest';
import { buttonPartDecls, truncates } from '../src/utils/button-parts';
import { designToStyle, hoverRule } from '../src/utils/css-utils';
import { configFontCandidates as configGoogleFonts } from '../src/google-fonts/loader';
import { COLOR_KEYS } from '../src/utils/css-design-map';

const d = (r: Record<string, unknown>) => buttonPartDecls(r);
const fast = (fn: () => void) => {
  const t = performance.now();
  fn();
  expect(performance.now() - t).toBeLessThan(50);
};

const HOSTILE = ['red; background: url(x)', 'a}b', 'a{b', 'url(http://evil/x)', '/* x */', 'a\\b', 'expression(alert(1))', '"', "'", '@import', '', ' ', 'x'.repeat(10_000), '__proto__', 'constructor', 'toString'];
const KEYS = [
  'icon_position', 'content_align', 'content_vertical_align', 'icon_size', 'icon_gap', 'label_overflow', 'state_position', 'icon_color',
  'label_color', 'state_color', 'icon_background', 'icon_background_shape', 'label_font_family', 'label_font_size', 'label_font_weight',
  'label_text_transform', 'state_font_size',
];

describe('buttonPartDecls: nothing unset, nothing emitted', () => {
  it('an empty design and unrelated keys write nothing', () => {
    expect(d({})).toEqual([]);
    expect(d({ color: 'red', font_size: '12px', hover: {} })).toEqual([]);
  });
  it('a key that is not set to anything usable writes nothing', () => {
    for (const k of KEYS) for (const v of [undefined, null, '', ' ', NaN, Infinity, true, {}, []]) {
      expect(d({ [k]: v }), `${k}=${String(v)}`).toEqual([]);
    }
  });
});

describe('buttonPartDecls: hostile values never reach the output', () => {
  for (const k of KEYS) {
    it(`${k} refuses breakouts and unknown words`, () => {
      for (const v of HOSTILE) {
        const out = d({ [k]: v }).join(';');
        expect(out, `${k}=${v.slice(0, 20)}`).not.toMatch(/url\(|evil|expression|@import|\*\/|\/\*|[{}\\]/);
        if (['icon_position', 'content_align', 'content_vertical_align', 'label_overflow', 'state_position', 'label_font_weight', 'label_text_transform', 'icon_background_shape'].includes(k)) {
          expect(d({ [k]: v }), `${k}=${v.slice(0, 20)}`).toEqual([]);
        }
        // every declaration is one custom property with no stray declaration inside
        for (const decl of d({ [k]: v })) expect(decl).toMatch(/^--[a-z0-9-]+:[^;]*$/);
      }
    });
  }
  it('lengths: negatives, exponents, double dots, functions and units outside the list are refused', () => {
    for (const k of ['icon_size', 'icon_gap', 'label_font_size', 'state_font_size']) {
      for (const v of ['-1px', '1e3px', '.5.5px', '1..5px', 'calc(1px + 2px)', 'var(--x)', '1 2', '1pt', '10px;', 'auto', '+1px', `${'9'.repeat(200)}px`]) {
        expect(d({ [k]: v }), `${k}=${v}`).toEqual([]);
      }
    }
  });
  it('lengths: plain numbers and units pass, a bare number is px', () => {
    expect(d({ icon_size: '32px' })).toContain('--mc-button-icon-size:32px');
    expect(d({ icon_size: 32 })).toContain('--mc-button-icon-size:32px');
    expect(d({ icon_gap: 0 })).toContain('--mc-bi-gap:0px');
    expect(d({ icon_gap: '0.5em' })).toContain('--mc-bi-gap:0.5em');
    expect(d({ label_font_size: '120%' })).toContain('--mc-bl-fs:120%');
    expect(d({ state_font_size: 11 })).toContain('--mc-bs-fs:11px');
  });
  it('size and gap take no percentage (it means nothing for them)', () => {
    expect(d({ icon_size: '50%' })).toEqual([]);
    expect(d({ icon_gap: '5%' })).toEqual([]);
  });
  it('colours: no url(), image functions, gradients or a long run of letters', () => {
    for (const k of ['icon_color', 'label_color', 'state_color', 'icon_background']) {
      for (const v of ['url(x)', 'linear-gradient(red, blue)', 'var(--x, url(x))', 'image-set(x 1x)', 'red; x: y', `${'a'.repeat(10_000)},()`]) {
        expect(d({ [k]: v }), `${k}=${v.slice(0, 20)}`).toEqual([]);
      }
    }
    fast(() => d({ icon_color: `${'a'.repeat(200_000)},()` }));
    fast(() => d({ label_color: `${'a'.repeat(250)}x(` }));
  });
  it('font family: only names, quoted names and commas; no stray or unbalanced quote', () => {
    for (const v of ["'abc", '"abc', "a'b", 'a;b', 'a)', 'a(b)', 'url(x)', "\"a'", '"a", ', ',', 'a,,b', `${'a'.repeat(129)}`]) {
      expect(d({ label_font_family: v }), v).toEqual([]);
    }
    expect(d({ label_font_family: '"Open Sans", sans-serif' })).toContain('--mc-bl-ff:"Open Sans", sans-serif');
    expect(d({ label_font_family: "'Fira Code',monospace" })).toContain("--mc-bl-ff:'Fira Code', monospace");
    expect(d({ label_font_family: 'Roboto' })).toContain('--mc-bl-ff:Roboto');
    fast(() => d({ label_font_family: ' '.repeat(100_000) + '!' }));
  });
  it('enumerations: only the listed words, never an inherited property name', () => {
    expect(d({ icon_position: 'diagonal' })).toEqual([]);
    expect(d({ content_align: 'stretch' })).toEqual([]);
    expect(d({ label_overflow: 'clip' })).toEqual([]);
    expect(d({ label_font_weight: '650' })).toEqual([]);
    expect(d({ label_font_weight: 'inherit' })).toEqual([]);
    expect(d({ label_text_transform: 'full-width' })).toEqual([]);
    expect(d({ state_position: 'left' })).toEqual([]);
    expect(d({ icon_position: ' above ' }).join(';')).toContain('--mc-bi-ia:1/2/2/4');
  });
});

describe('buttonPartDecls: values', () => {
  const has = (r: Record<string, unknown>, decl: string) => expect(d(r)).toContain(decl);
  it('icon_position places the icon on its line set and puts the gap on the side facing the label', () => {
    has({ icon_position: 'left' }, '--mc-bi-ia:2/1/4/2');
    has({ icon_position: 'right' }, '--mc-bi-ia:2/4/4/5');
    has({ icon_position: 'above' }, '--mc-bi-ia:1/2/2/4');
    has({ icon_position: 'below' }, '--mc-bi-ia:4/2/5/4');
    has({ icon_position: 'above' }, '--mc-bi-mb:var(--mc-bi-gap,var(--mc-gap-sm))');
    has({ icon_position: 'below' }, '--mc-bi-mt:var(--mc-bi-gap,var(--mc-gap-sm))');
    has({ icon_position: 'left' }, '--mc-bi-me:var(--mc-bi-gap,var(--mc-gap-sm))');
    has({ icon_position: 'left' }, '--mc-bi-ms:0');
    has({ icon_position: 'right' }, '--mc-bi-ms:var(--mc-bi-gap,var(--mc-gap-sm))');
    has({ icon_position: 'right' }, '--mc-bi-me:0');
    has({ state_position: 'beside' }, '--mc-bs-ms:var(--mc-bi-gap,var(--mc-gap-sm))');
    has({ state_position: 'below' }, '--mc-bs-ms:0');
    has({ icon_position: 'left' }, '--mc-bi-d:inline-grid');
  });
  it('any layout key switches to the grid with centred defaults and the label on its cell', () => {
    for (const r of [{ icon_position: 'right' }, { content_align: 'start' }, { content_vertical_align: 'end' }, { state_position: 'below' }]) {
      const out = d(r);
      expect(out).toEqual(expect.arrayContaining(['--mc-bi-d:inline-grid', '--mc-bi-g0:0', '--mc-bl-a:2/2']));
      expect(out.some((x) => x.startsWith('--mc-bi-ac:'))).toBe(true);
      expect(out.some((x) => x.startsWith('--mc-bi-ji:'))).toBe(true);
    }
  });
  it('alignment keys override the centred defaults', () => {
    const a = d({ content_align: 'end' });
    expect(a).toEqual(expect.arrayContaining(['--mc-bi-ji:end', '--mc-bi-jc:end', '--mc-bi-ac:center']));
    expect(d({ content_vertical_align: 'start' })).toContain('--mc-bi-ac:start');
    expect(d({ icon_position: 'left' })).toContain('--mc-bi-ji:center');
  });
  it('state_position beside and below', () => {
    has({ state_position: 'below' }, '--mc-bs-a:3/2');
    has({ state_position: 'beside' }, '--mc-bs-a:2/3');
  });
  it('truncate sets nowrap, hidden, ellipsis, a zero min width and a 100% max width; wrap sets normal wrapping', () => {
    expect(d({ label_overflow: 'truncate' })).toEqual(expect.arrayContaining(['--mc-bl-ws:nowrap', '--mc-bl-ov:hidden', '--mc-bl-to:ellipsis', '--mc-bi-mw:0', '--mc-bl-mxw:100%', '--mc-bi-fs:0']));
    expect(d({ label_overflow: 'wrap' })).toEqual(['--mc-bl-ws:normal']);
  });
  it('colours land on their part; an icon colour also lets the icon paint with currentColor', () => {
    expect(d({ icon_color: '#f00' })).toEqual(expect.arrayContaining(['--mc-bi-c:#f00', '--icon-primary-color:currentColor']));
    has({ label_color: 'rgb(1, 2, 3)' }, '--mc-bl-c:rgb(1, 2, 3)');
    has({ state_color: 'var(--primary-color)' }, '--mc-bs-c:var(--primary-color)');
    expect(d({ label_color: '#fff' })).not.toContain('--icon-primary-color:currentColor');
  });
  it('icon background: circle by default, rounded on request, padding from the icon size; shape alone does nothing', () => {
    expect(d({ icon_background: '#222' })).toEqual(expect.arrayContaining(['--mc-bi-bg:#222', '--mc-bi-br:50%', '--mc-bi-pad:calc(var(--mc-button-icon-size) *.3)']));
    has({ icon_background: '#222', icon_background_shape: 'rounded' }, '--mc-bi-br:25%');
    expect(d({ icon_background_shape: 'rounded' })).toEqual([]);
  });
  it('type: weight (number or word), case, size', () => {
    has({ label_font_weight: 700 }, '--mc-bl-fw:700');
    has({ label_font_weight: '300' }, '--mc-bl-fw:300');
    has({ label_font_weight: ' bold ' }, '--mc-bl-fw:bold');
    has({ label_text_transform: 'uppercase' }, '--mc-bl-tt:uppercase');
  });
});

describe('truncates: the title attribute follows the config, not the state', () => {
  it('base, hover and any conditional rule', () => {
    expect(truncates({ label_overflow: 'truncate' })).toBe(true);
    expect(truncates({ hover: { label_overflow: 'truncate' } })).toBe(true);
    expect(truncates({ conditional: [{ design: { label_overflow: 'truncate' } }] })).toBe(true);
    expect(truncates({ label_overflow: 'wrap' })).toBe(false);
    expect(truncates(undefined)).toBe(false);
    expect(truncates({ conditional: [null, {}] } as never)).toBe(false);
  });
});

describe('designToStyle and hoverRule with parts', () => {
  it('only a button (parts) gets the part declarations', () => {
    expect(designToStyle({ icon_position: 'above' } as never)).toBe('');
    expect(designToStyle({ icon_position: 'above' } as never, undefined, true)).toContain('--mc-bi-ia:1/2/2/4');
  });
  it('part declarations come before the custom css, so css can still win', () => {
    const s = designToStyle({ icon_gap: '4px', css: '--mc-bi-gap: 9px' } as never, undefined, true);
    expect(s.indexOf('--mc-bi-gap:4px')).toBeLessThan(s.indexOf('--mc-bi-gap: 9px'));
  });
  it('entity colours map before the helper checks them', () => {
    expect(designToStyle({ icon_color: 'entity' } as never, undefined, true)).toContain('--mc-bi-c:var(--mc-entity-color, currentColor)');
    expect(designToStyle({ label_color: 'entity 40%' } as never, undefined, true)).toMatch(/--mc-bl-c:color-mix\(/);
    expect(COLOR_KEYS).toEqual(expect.arrayContaining(['icon_color', 'label_color', 'state_color', 'icon_background']));
  });
  it('the hover rule writes them as important custom properties on the wrapper', () => {
    const r = hoverRule('h1', { icon_position: 'above', icon_size: '40px' } as never, { parts: true });
    expect(r).toContain('[data-mc-hover="h1"]:hover');
    expect(r).toContain('--mc-bi-ia:1/2/2/4 !important');
    expect(r).toContain('--mc-button-icon-size:40px !important');
    expect(hoverRule('h1', { icon_position: 'above' } as never)).toBe('');
  });
});

describe('label_font_family loads like font_family', () => {
  it('config walk finds it in a module, hover and conditional rule', () => {
    const cfg = { rows: [{ columns: [{ modules: [{ type: 'button', design: { label_font_family: '"Lato", sans-serif', hover: { label_font_family: 'Oswald' }, conditional: [{ design: { label_font_family: 'Poppins' } }] } }] }] }] };
    expect(configGoogleFonts(cfg).sort()).toEqual(['Lato', 'Oswald', 'Poppins']);
  });
});

describe('every key in one design stays well formed', () => {
  it('a full design is a list of custom properties', () => {
    const all = d({
      icon_position: 'above', content_align: 'start', content_vertical_align: 'end', icon_size: '30px', icon_gap: '4px', label_overflow: 'truncate',
      state_position: 'below', icon_color: '#f00', label_color: '#0f0', state_color: '#00f', icon_background: '#222', icon_background_shape: 'rounded',
      label_font_family: 'Lato', label_font_size: '14px', label_font_weight: 600, label_text_transform: 'capitalize', state_font_size: '10px',
    });
    for (const x of all) expect(x).toMatch(/^--[a-z0-9-]+:[^;{}]+$/);
    expect(new Set(all.map((x) => x.split(':')[0])).size).toBe(all.length);
  });
});
