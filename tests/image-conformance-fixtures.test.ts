import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import '../src/svg-editor/index';
import { __resetIconSourceForTests } from '../src/icons/icon-source';
import { __resetImageEditorForTests } from '../src/svg-editor/image-loader';
import type { McSvgEditor } from '../src/svg-editor/mc-svg-editor';
import { sanitizeImage } from '../src/svg-image/sanitize';

/*
 * Real card output for the server's conformance test. Each input is opened in the image editor and saved (the
 * payload images_save would carry), and also passed through sanitizeImage. With MCU_FIXTURE_OUT set to a file path
 * the cases are written there as JSON; the library server's tests run them through validate_image.
 */
type Ed = McSvgEditor & { updateComplete: Promise<boolean> };
const mounted: HTMLElement[] = [];
const rect = (): DOMRect => ({ left: 0, top: 0, width: 1400, height: 800, right: 1400, bottom: 800, x: 0, y: 0, toJSON() {} }) as DOMRect;
async function until(f: () => boolean, ms = 4000): Promise<void> {
  const t = Date.now();
  while (!f()) {
    if (Date.now() - t > ms) throw new Error('timeout');
    await new Promise((r) => setTimeout(r, 5));
  }
}
const settle = async (el: Ed): Promise<void> => {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
};
const svg = (inner: string): string => `<svg viewBox="0 0 400 300">${inner}</svg>`;

const CASES: Record<string, string> = {
  paints: svg('<rect id="r1" x="10" y="10" width="80" height="60" fill="#ff0000" stroke="#00ff00" stroke-width="3" opacity="0.5" transform="rotate(10 50 40)"/><circle id="c1" cx="200" cy="100" r="40" fill="var(--primary-color, #03a9f4)" stroke="var(--accent-color)"/><ellipse id="e1" cx="300" cy="200" rx="40" ry="20" fill="#abc" fill-opacity="0.4"/>'),
  gradients: svg('<defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="var(--primary-color, #000)" stop-opacity="0.5"/></linearGradient><radialGradient id="g2" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#f00"/><stop offset="1" stop-color="#00f"/></radialGradient></defs><rect id="r1" x="0" y="0" width="200" height="100" fill="url(#g1)"/><circle id="c1" cx="300" cy="150" r="60" fill="url(#g2)"/>'),
  text: svg('<text id="t1" x="20" y="60" font-size="32" font-family="Arial, sans-serif" font-weight="700" text-anchor="middle" fill="#112233"><tspan x="20" dy="0">First line &amp; more</tspan><tspan x="20" dy="38">Second &lt;line&gt; &quot;two&quot;</tspan></text><path id="p1" d="M0 200L100 250L50 290z" fill="#334455"/>'),
  paths: svg('<path id="p1" d="M10 10C 20 20, 40 20, 50 10S 80 0 90 10" fill="none" stroke="#123456" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 2"/><polygon id="pg" points="0,0 10,0 10,10" fill="#fa0"/><polyline id="pl" points="1 2 3 4 5 6" stroke="#000" fill="none"/><line id="l1" x1="0" y1="0" x2="50" y2="50" stroke="#999"/><g id="grp" data-name="Group &gt; one"><rect id="in" x="5" y="5" width="9" height="9" fill="#eee"/></g>'),
  imported_part: svg('<defs><clipPath id="c"><rect x="0" y="0" width="50" height="50"/></clipPath></defs><path id="a" data-name="First" d="M0 0H100V100H0Z" fill="#ff0000"/><rect id="win" x="10" y="10" width="80" height="80" fill="#0000ff" clip-path="url(#c)"/><path id="b" data-name="Last" d="M200 0H300V100H200Z" fill="#00ff00"/>'),
  imported_part_mask_and_group_opacity: svg('<defs><mask id="m"><circle cx="50" cy="50" r="40" fill="#fff"/></mask><linearGradient id="lg"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs><path id="a" d="M0 0H100V100H0Z" fill="#ff0000"/><g id="fx" opacity="0.6"><rect id="x1" x="0" y="0" width="90" height="90" fill="url(#lg)" mask="url(#m)"/><circle id="x2" cx="30" cy="30" r="10" fill="#00f" fill-opacity="0.5"/></g><path id="b" d="M200 0H300V100H200Z" fill="#00ff00"/>'),
};

beforeEach(() => {
  __resetIconSourceForTests();
  __resetImageEditorForTests();
});
afterEach(() => {
  mounted.splice(0).forEach((e) => e.remove());
  vi.restoreAllMocks();
});

async function editorSave(markup: string): Promise<Record<string, unknown>> {
  const calls: any[] = [];
  const hass = {
    language: 'en-GB',
    user: { is_admin: true },
    callWS: vi.fn(async (m: any) => {
      calls.push(m);
      if (m.type === 'magic_card_utils/images_list') return { images: [{ id: 'pic', name: 'Pic', view_box: '0 0 400 300', bytes: 1, bindings: 0, updated_at: 'u1' }] };
      if (m.type === 'magic_card_utils/images_get') return { images: m.ids[0] === 'pic' ? [{ id: 'pic', name: 'Pic', svg: markup, view_box: '0 0 400 300', created_at: 'c1', updated_at: 'u1' }] : [] };
      if (m.type === 'magic_card_utils/images_save') return { image: { id: m.image.id, name: m.image.name, view_box: m.image.view_box, bytes: 10, bindings: 0, updated_at: 'u2' } };
      return {};
    }),
  };
  const el = document.createElement('mc-svg-editor') as Ed;
  Object.assign(el, { source: { kind: 'image', id: 'pic' }, hass, host: 'mcu' });
  el.getBoundingClientRect = rect;
  document.body.append(el);
  mounted.push(el);
  await until(() => el.stage !== 'loading');
  await settle(el);
  el.apply({ ...el.doc, name: 'Pic saved' }, 'Rename image', 'name');
  await settle(el);
  (el.img as any).save();
  const saves = () => calls.filter((c) => c.type === 'magic_card_utils/images_save');
  await until(() => saves().length === 1);
  return saves()[0].image;
}

describe('card output for the library server', () => {
  it('collects what the editor saves and what the sanitiser emits', async () => {
    const out: Array<{ name: string; kind: 'editor-save' | 'sanitize'; image: Record<string, unknown> }> = [];
    for (const [name, markup] of Object.entries(CASES)) {
      const saved = await editorSave(markup);
      expect(typeof saved.svg).toBe('string');
      expect(saved.svg as string).toContain('xmlns="http://www.w3.org/2000/svg"');
      out.push({ name, kind: 'editor-save', image: saved });
      const s = sanitizeImage(markup);
      expect(s.error).toBeUndefined();
      out.push({ name, kind: 'sanitize', image: { id: 'pic', name: 'Pic', view_box: s.viewBox, svg: s.markup } });
      mounted.splice(0).forEach((e) => e.remove());
    }
    expect(out.some((c) => (c.image.svg as string).includes('class="mc-part"'))).toBe(true);
    const file = process.env.MCU_FIXTURE_OUT;
    if (file) {
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, JSON.stringify(out, null, 1) + '\n');
    }
  });
});
