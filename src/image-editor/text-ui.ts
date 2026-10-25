import { html, nothing, svg, type TemplateResult } from 'lit';
import { IMAGE_MAX_TEXT_CHARS } from '../contracts/svg-image';
import type { Shape } from '../svg-editor/model';
import { button, field, fieldHelpId, sectionHead, seg } from '../ui-kit/templates';
import type { ImageExt } from './chunk';
import { t } from './i18n';
import { K } from './kit';
import { num, pick } from './paint-ui';
import { FONTS, anchorOf, blank, boxFor, boxPaths, changed, cleanText, defaultSize, lineY, linesOf, nameOf, type TextData } from './text';

/* Text layers in the editor: adding one, the canvas node, and the Text section of the inspector. */

const COUNT_FROM = 1900;
const r2 = (n: number): number => Math.round(n * 100) / 100;

/** The layer with its text changed by `patch`; its box is rebuilt round the same anchor, and a name made from the words follows them. */
export function retext(s: Shape, patch: Partial<TextData>): Shape {
  const cur = s.look?.text;
  if (!cur) return s;
  const r = changed(cur, K.shapeBox(s), patch);
  const auto = !s.name || s.name === nameOf(cur.s, t('Text'));
  return { ...s, name: auto ? nameOf(r.t.s, t('Text')) : s.name, paths: boxPaths(r.box), look: { ...s.look, text: r.t } };
}

/** A new text layer in the middle of what the editor shows (the middle of the drawing when the view is elsewhere). */
export function newText(x: ImageExt): Shape {
  const sh = x.shell;
  const vb = sh.doc.vb;
  const td: TextData = { s: t('Text'), z: defaultSize(vb.w, vb.h), w: 400, a: 'start', f: 'sans-serif' };
  const r = sh.canvas()?.getBoundingClientRect();
  let p = r && r.width > 0 ? sh.point({ clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }) : sh.centre();
  if (!(p[0] > vb.x && p[0] < vb.x + vb.w && p[1] > vb.y && p[1] < vb.y + vb.h)) p = sh.centre();
  const b = boxFor([0, 0], td);
  const box = { ...b, x: r2(p[0] - b.w / 2), y: r2(p[1] - b.h / 2) };
  return K.newShape('path', boxPaths(box), { name: nameOf(td.s, td.s), look: { text: td } });
}

/** Add a text layer and put the cursor in its Content field, selected, so typing replaces the placeholder words. */
export function addText(x: ImageExt): void {
  if (x.readOnly) return;
  const sh = x.shell;
  sh.addShape(newText(x));
  void sh.updateComplete.then(() => {
    const el = sh.renderRoot.querySelector<HTMLTextAreaElement>('#tx-content');
    el?.focus();
    el?.select();
  });
}

export function addTextButton(x: ImageExt): TemplateResult {
  return button({ label: t('Add text'), glyph: 'add', size: 'sm', keys: 'T', onClick: () => addText(x) });
}

/** The layer on the canvas: <text> with the same attributes the saved file holds, so both draw alike. */
export function textNode(x: ImageExt, s: Shape): TemplateResult | undefined {
  const td = s.look?.text;
  const b = td && K.shapeBox(s);
  if (!td || !b) return undefined;
  const [ax, ay] = anchorOf(b, td);
  const lines = linesOf(td.s);
  const body = lines.length === 1 ? lines[0] : lines.map((l, i) => (l.trim() ? svg`<tspan x=${r2(ax)} y=${lineY(ay, i, td)}>${l}</tspan>` : nothing));
  return svg`<text
    x=${r2(ax)}
    y=${r2(ay)}
    font-size=${r2(td.z)}
    font-family=${td.f}
    font-weight=${td.w}
    font-style=${td.i ? 'italic' : 'normal'}
    text-anchor=${td.a}
    letter-spacing=${td.l ?? 0}
    style=${`${x.style(s)};stroke-width:${s.width};stroke-linejoin:round`}
  >${body}</text>`;
}

const weightItems = (): Array<[string, string]> => [
  ['300', t('Light')],
  ['400', t('Regular')],
  ['500', t('Medium')],
  ['600', t('Semi-bold')],
  ['700', t('Bold')],
  ['800', t('Extra bold')],
];

const fontItems = (): Array<[string, string]> => [
  ['sans-serif', t('Sans-serif')],
  ['serif', t('Serif')],
  ['monospace', t('Monospace')],
  ['system-ui', t('System')],
];

const fontHint = (f: string): string =>
  f === 'serif'
    ? t('With small feet, like print.')
    : f === 'monospace'
      ? t('Every letter the same width.')
      : f === 'system-ui'
        ? t('Whatever this device uses for its own screens.')
        : t('Clean, no feet.');

/** The Text section of the inspector for a text layer (undefined for any other layer). */
export function textRows(x: ImageExt, s: Shape): TemplateResult | undefined {
  const td = s.look?.text;
  if (!td) return undefined;
  const sh = x.shell;
  const set = (patch: Partial<TextData>, label: string, merge?: string): void => x.edit((q) => retext(q, patch), label, merge);
  const left = IMAGE_MAX_TEXT_CHARS - td.s.length;
  const countId = 'tx-count';
  const done = (): void => {
    const cur = sh.doc.shapes.find((q) => q.id === s.id);
    if (!cur?.look?.text || !blank(cur.look.text)) return;
    sh.apply(K.removeShapes(sh.doc, [s.id]), 'Delete');
    sh.select([]);
    sh.say(t('The empty text layer was removed.'));
    sh.canvas()?.focus({ preventScroll: true });
  };
  return html`<section class="group" aria-label=${t('Text')}>
    ${sectionHead({ title: t('Text'), level: 4 })}
    ${field({
      id: 'tx-content',
      label: t('Content'),
      help: t('Enter adds a line.'),
      control: html`<textarea
        id="tx-content"
        class="input"
        rows="3"
        maxlength=${IMAGE_MAX_TEXT_CHARS}
        aria-describedby=${`${fieldHelpId('tx-content')}${left <= IMAGE_MAX_TEXT_CHARS - COUNT_FROM ? ` ${countId}` : ''}`}
        .value=${td.s}
        @input=${(e: Event) => {
          const el = e.target as HTMLTextAreaElement;
          const v = cleanText(el.value);
          if (v !== el.value) el.value = v;
          set({ s: v }, 'Edit text', 'text-content');
        }}
        @change=${done}
      ></textarea>`,
    })}
    ${left <= IMAGE_MAX_TEXT_CHARS - COUNT_FROM
      ? html`<p id=${countId} class="help" role="status">${left > 0 ? t('{n} left', { n: left }) : t('That is the longest text (2048 characters).')}</p>`
      : nothing}
    <div class="grid2">
      ${num('tx-size', t('Size (units)'), td.z, (n) => set({ z: n }, 'Text size', 'text-size'), { min: 1, max: 1000, step: 1 })}
      ${pick('tx-weight', t('Weight'), String(td.w), weightItems(), (v) => set({ w: Number(v) }, 'Text weight'))}
    </div>
    <div class="field">
      <div class="field-head"><span class="lbl">${t('Style')}</span></div>
      ${button({ label: t('Italic'), size: 'sm', pressed: !!td.i, onClick: () => set({ i: td.i ? undefined : true }, 'Text style') })}
    </div>
    <div class="field">
      <div class="field-head"><span class="lbl">${t('Alignment')}</span></div>
      ${seg({
        role: 'radiogroup',
        label: t('Alignment'),
        full: true,
        value: td.a,
        items: [
          { value: 'start', label: t('Start') },
          { value: 'middle', label: t('Centre') },
          { value: 'end', label: t('End') },
        ],
        onChange: (a) => set({ a }, 'Text alignment'),
      })}
    </div>
    ${num('tx-spacing', t('Letter spacing (units)'), td.l ?? 0, (n) => set({ l: n }, 'Letter spacing', 'text-spacing'), { min: -100, max: 1000, step: 1 })}
    ${pick('tx-font', t('Font'), td.f, fontItems().filter(([v]) => FONTS.includes(v)), (f) => set({ f }, 'Text font'))}
    <p class="help">${fontHint(td.f)}</p>
    <p class="help">${t('Text uses fonts already on the device. Nothing is downloaded, so it can look a little different on another device.')}</p>
  </section>`;
}
