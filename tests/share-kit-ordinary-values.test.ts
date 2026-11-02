import { describe, expect, it } from 'vitest';
import { cardKeyLists } from '../src/editor/transfer-loader';
import { createShareKit } from '../src/share-kit/chunk';
import { shareKitHelpers } from '../src/transfer/share-kit-loader';

// Ordinary shared looks are kept; only a real break-out refuses the file; SVG data pictures are left out and listed.
const kit = createShareKit(shareKitHelpers);
const lists = cardKeyLists();
const read = (extra: Record<string, unknown>) => kit.readCard(0, { type: 'custom:magic-card', ...extra }, lists);
const inModule = (design: Record<string, unknown>) => read({ rows: [{ columns: [{ modules: [{ type: 'text', text: 'a', design }] }] }] });
const SVG = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 4'><path d='M0 0h4v4z'/></svg>")`;

describe('ordinary values stay', () => {
  it.each(['0 auto', '6px auto 12px', '-4px auto 0', '0 0 0 auto', '8px auto'])('keeps margin %s', (margin) => {
    const r = read({ margin });
    expect(r.ok && r.data.margin).toBe(margin);
    expect(r.notes).toEqual([]);
  });
  it.each(['50% 50% 8px 8px / 100% 100% 8px 8px', '50% / 4px', '18px / 26px'])('keeps border_radius %s', (border_radius) => {
    const r = read({ border_radius });
    expect(r.ok && r.data.border_radius).toBe(border_radius);
  });
  it.each(['5.5cqw', 'clamp(26px, 4cqw, 34px)', 'clamp(20px, 6vw, 26px)', 'min(4cqh, 3dvh)', 'clamp(10px, calc(2cqw + 4px), 30px)'])('keeps font_size %s', (font_size) => {
    const r = inModule({ font_size });
    expect(r.notes).toEqual([]);
  });
  it('keeps a padding with clamp()', () => {
    const r = read({ padding: '14px clamp(16px, 4cqw, 26px) 6px' });
    expect(r.ok && r.data.padding).toBe('14px clamp(16px, 4cqw, 26px) 6px');
  });
  it('keeps safe clip-path functions in css and as a key', () => {
    const poly = 'polygon(0 60%, 12% 20%, 100% 100%, 0 100%)';
    const a = read({ css: `clip-path: ${poly}; margin: 0 auto` });
    expect(a.ok && a.data.css).toBe(`clip-path: ${poly}; margin: 0 auto`);
    const b = inModule({ clip_path: 'circle(40% at 50% 50%)' });
    expect(b.notes).toEqual([]);
  });
  it('keeps plain backgrounds', () => {
    for (const background of ['#112233', 'linear-gradient(180deg, #000 0%, rgba(0,0,0,0.5) 100%)', 'var(--card-background-color)']) {
      const r = read({ background });
      expect(r.ok && r.data.background).toBe(background);
    }
  });
  it('keeps a conditional look with several declarations and a template condition', () => {
    const conditional = [{ conditions: [{ condition: 'template', template: '{{ now().weekday() == 0 }}' }], design: { css: 'outline: 2px solid #22e6ff; outline-offset: 2px; box-shadow: 0 0 8px #22e6ff' } }];
    const r = inModule({ conditional });
    expect(r.ok).toBe(true);
    expect(r.notes).toEqual([]);
    expect(r.ok && JSON.stringify(r.data)).toContain('now().weekday()');
  });
  it('keeps display conditions with a template', () => {
    const r = read({ display: { conditions: [{ condition: 'template', template: "{{ is_state('sun.sun', 'above_horizon') }}" }] } });
    expect(r.ok).toBe(true);
  });
});

describe('SVG data pictures are left out, not refused', () => {
  it.each(['background_image', 'background'])('drops %s and lists it', (key) => {
    const r = read({ [key]: SVG });
    expect(r.ok).toBe(true);
    expect(r.ok && key in r.data).toBe(false);
    expect(r.notes.some((n) => n.code === 'dropped_value' && n.path.endsWith(key))).toBe(true);
  });
  it('drops it inside a conditional look and keeps the rest', () => {
    const r = inModule({ conditional: [{ conditions: [], design: { background_image: SVG, opacity: 0.5 } }] });
    expect(r.ok).toBe(true);
    expect(r.ok && JSON.stringify(r.data)).toContain('"opacity":0.5');
    expect(r.ok && JSON.stringify(r.data)).not.toContain('svg');
  });
  it('still refuses an svg url that breaks out', () => {
    expect(read({ background_image: `url("data:image/svg+xml;utf8,<svg/>") ; } </style>` }).ok).toBe(false);
    expect(read({ background_image: `url("data:image/svg+xml;utf8,<style>a{b:c}</style>")` }).ok).toBe(false);
    expect(read({ background_image: `url("data:image/svg+xml;utf8,\\22 x")` }).ok).toBe(false);
  });
});

describe('real break-outs are still refused', () => {
  const cond = (design: Record<string, unknown>, conditions: unknown[] = []) => ({ conditional: [{ conditions, design }] });
  it.each([
    ['conditional css with a brace', cond({ css: 'color: red; } body { x: y' })],
    ['conditional css with @import', cond({ css: "@import '/local/a.css'" })],
    ['conditional string with a brace', cond({ box_shadow: '0 0 1px red; } a{' })],
    ['a template in a style key', cond({ box_shadow: '{{ 1 }}' })],
    ['a template in another key of a condition', cond({}, [{ condition: 'template', template: '{{ 1 }}', color: '{{ 1 }}' }])],
    ['a marker in a design key', { 'a}': 'red' }],
    ['a marker in a design array', { stops: ['red', 'blue; }'] }],
  ])('refuses %s', (_name, design) => {
    expect(inModule(design).ok).toBe(false);
  });
  it.each([
    ['a template in a card style key', { box_shadow: '{{ 1 }}' }],
    ['a template in the card template name', { template: '{{ 1 }}' }],
    ['a template in an entity', { entity: '{{ 1 }}' }],
  ])('refuses %s', (_name, extra) => {
    expect(read(extra).ok).toBe(false);
  });
});
