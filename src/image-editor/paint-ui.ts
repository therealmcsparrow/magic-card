import { html, nothing, type TemplateResult } from 'lit';
import { IMAGE_THEME_COLOURS } from '../contracts/image-editor';
import { THEME_VAR_NAME_RE } from '../contracts/svg-image';
import type { Shape } from '../svg-editor/model';
import { button, field, slider } from '../ui-kit/templates';
import type { ImageExt } from './chunk';
import { t } from './i18n';
import { K } from './kit';
import {
  ACCENT,
  MAIN,
  MAX_STOPS,
  angleOf,
  cssOf,
  dashText,
  dragHandle,
  handleAt,
  linearPts,
  paintOf,
  parseDash,
  solidOf,
  stopsOf,
  stroked,
  themeOf,
  type Box,
  type Grad,
  type Look,
  type Rich,
} from './paint';

/* The Fill, Stroke, Opacity and Dashes controls of the inspector and the gradient handles on the canvas. */

export type Which = 'fill' | 'stroke';
type Kind = 'none' | 'main' | 'accent' | 'colour' | 'theme' | 'linear' | 'radial';

const BLUE = '#3f6fb5';
const aria = (b: boolean): string => (b ? 'true' : 'false');
const fmt = (n: number): string => String(Math.round(n * 10) / 10);

const kindOfValue = (v: Rich | 'none'): Kind => (v === 'none' ? 'none' : typeof v !== 'string' ? v.t : v === MAIN ? 'main' : v === ACCENT ? 'accent' : themeOf(v) ? 'theme' : 'colour');

/** The kind of paint a layer has for its fill or stroke. */
export const kindOf = (s: Shape, k: Which): Kind => kindOfValue(paintOf(s, k));

/** A look with its empty parts left out; undefined when nothing is left. */
function tidy(l: Look): Look | undefined {
  const o: Look = {};
  if (l.text !== undefined) o.text = l.text;
  if (l.fill !== undefined) o.fill = l.fill;
  if (l.stroke !== undefined) o.stroke = l.stroke;
  if (l.opacity !== undefined && l.opacity < 100) o.opacity = l.opacity;
  if (l.dash?.length) {
    o.dash = l.dash;
    if (l.offset) o.offset = l.offset;
  }
  return Object.keys(o).length ? o : undefined;
}

/** The layer with its look changed by `patch` (an undefined value removes that part). */
export function withLook(s: Shape, patch: Partial<Look>): Shape {
  const { look: _was, ...rest } = s;
  void _was;
  const l = tidy({ ...s.look, ...patch });
  return l ? { ...rest, look: l } : rest;
}

function toKind(s: Shape, k: Which, kind: Kind): Shape {
  const cur = paintOf(s, k);
  const solid = typeof cur === 'string' && cur !== 'none' ? cur : undefined;
  if (kind === 'none' || kind === 'main' || kind === 'accent') return { ...withLook(s, { [k]: undefined }), [k]: kind, auto: false };
  let v: Rich;
  if (kind === 'colour') v = solid && kindOfValue(solid) === 'colour' ? solid : BLUE;
  else if (kind === 'theme') v = solid && themeOf(solid) ? solid : 'var(--primary-color)';
  else {
    const first = solid ?? MAIN;
    const stops = typeof cur !== 'string' ? cur.s : [{ o: 0, c: first }, { o: 1, c: first === ACCENT ? MAIN : ACCENT }];
    v = { t: kind, s: stops, p: kind === 'linear' ? [0, 0.5, 1, 0.5] : [0.5, 0.5, 0.5] };
  }
  return { ...withLook(s, { [k]: v }), [k]: 'main', auto: false, ...(k === 'stroke' && s.width <= 0 ? { width: 2 } : {}) };
}

const kindItems = (): Array<[Kind, string]> => [
  ['none', t('None')],
  ['main', t('Main')],
  ['accent', t('Accent')],
  ['colour', t('Custom colour')],
  ['theme', t('Theme colour')],
  ['linear', t('Linear gradient')],
  ['radial', t('Radial gradient')],
];

// ── small controls ──

export function pick(id: string, label: string, value: string, items: Array<[string, string]>, on: (v: string) => void): TemplateResult {
  return field({
    id,
    label,
    control: html`<div class="select"
      ><select id=${id} class="input" @change=${(e: Event) => on((e.target as HTMLSelectElement).value)}>${items.map(([v, name]) => html`<option value=${v} ?selected=${v === value}>${name}</option>`)}</select
      ><ha-icon icon="mdi:chevron-down"></ha-icon
    ></div>`,
  });
}

export function num(id: string, label: string, value: number, on: (n: number) => void, o: { min?: number; max?: number; step?: number } = {}): TemplateResult {
  return field({
    id,
    label,
    control: html`<input
      id=${id}
      class="input"
      type="number"
      inputmode="decimal"
      step=${o.step ?? 'any'}
      min=${o.min ?? nothing}
      max=${o.max ?? nothing}
      .value=${fmt(value)}
      @change=${(e: Event) => {
        const el = e.target as HTMLInputElement;
        const n = parseFloat(el.value);
        if (Number.isFinite(n)) on(n);
        else el.value = fmt(value);
      }}
    />`,
  });
}

/** A text field with its message under it (the one message of the panel lives on the editor). */
function textField(x: ImageExt, id: string, label: string, value: string, hint: string, on: (v: string) => string | undefined, placeholder?: string): TemplateResult {
  const bad = x.problemAt === id;
  return field({
    id,
    label,
    error: bad ? hint : undefined,
    control: html`<input
      id=${id}
      class="input"
      type="text"
      autocomplete="off"
      placeholder=${placeholder ?? nothing}
      aria-invalid=${aria(bad)}
      aria-describedby=${bad ? `${id}-error` : nothing}
      .value=${value}
      @change=${(e: Event) => {
        const el = e.target as HTMLInputElement;
        const shown = on(el.value);
        x.problemAt = shown === undefined ? id : undefined;
        if (shown === undefined) x.shell.requestUpdate();
        else el.value = shown;
      }}
    />`,
  });
}

/** The colour popup of the card editor, or a plain field until that chunk has defined it. */
function colour(x: ImageExt, id: string, label: string, value: string, set: (v: string) => void): TemplateResult {
  if (customElements.get('mc-color-picker'))
    return html`<mc-color-picker
      .label=${label}
      .value=${value}
      @value-changed=${(e: CustomEvent) => {
        e.stopPropagation();
        const v = solidOf(String((e.detail as { value?: unknown } | undefined)?.value ?? ''));
        if (v && v !== value) set(v);
      }}
    ></mc-color-picker>`;
  x.needColours();
  return textField(x, id, label, value, t('Use a colour like #3f6fb5.'), (raw) => {
    const v = solidOf(raw);
    if (!v) return undefined;
    if (v !== value) set(v);
    return v;
  });
}

/** Humanised name of a theme variable: --primary-text-color is "Primary text colour". */
const themeLabel = (n: string): string => {
  const w = n.slice(2).replace(/-color$/, '').replace(/-/g, ' ');
  return t('{name} colour', { name: w.charAt(0).toUpperCase() + w.slice(1) });
};

function theme(x: ImageExt, id: string, value: string, set: (v: string) => void): TemplateResult {
  const cur = themeOf(value) ?? '--primary-color';
  const names = IMAGE_THEME_COLOURS.includes(cur) ? [...IMAGE_THEME_COLOURS] : [...IMAGE_THEME_COLOURS, cur];
  return html`${pick(`${id}-theme`, t('Theme colour'), cur, names.map((n) => [n, `${themeLabel(n)} (${n})`]), (n) => set(`var(${n})`))}
    ${textField(x, `${id}-theme-name`, t('Or type a name'), '', t('Use a name that starts with two dashes, like --my-colour.'), (raw) => {
      const n = raw.trim();
      if (!n) return '';
      if (!THEME_VAR_NAME_RE.test(n)) return undefined;
      set(`var(${n})`);
      return '';
    }, '--my-colour')}`;
}

/** The control that sets a solid value for a paint of this kind (colour popup or theme colour). */
const solidBody = (x: ImageExt, id: string, label: string, kind: Kind, v: string, set: (v: string) => void): TemplateResult | typeof nothing =>
  kind === 'colour' ? colour(x, `${id}-colour`, label, v, set) : kind === 'theme' ? theme(x, id, v, set) : nothing;

// ── gradients ──

/** Changes the gradient of every selected layer that has one in this paint. */
function editGrad(x: ImageExt, k: Which, f: (g: Grad, b: Box) => Grad, label: string, merge?: string): void {
  x.which = k;
  x.edit((s) => {
    const g = s.look?.[k];
    const b = K.shapeBox(s);
    return g && typeof g !== 'string' && b ? withLook(s, { [k]: f(g, b) }) : s;
  }, label, merge);
}

const stopColourItems = (): Array<[string, string]> => kindItems().filter(([v]) => ['main', 'accent', 'colour', 'theme'].includes(v));

function stopRow(x: ImageExt, k: Which, g: Grad, i: number): TemplateResult {
  const id = `${k}-stop-${i}`;
  const st = g.s[i];
  const n = i + 1;
  const kind = kindOfValue(st.c);
  const setStop = (patch: Partial<Grad['s'][number]>, label: string, merge?: string): void => editGrad(x, k, (q) => ({ ...q, s: q.s.map((s, j) => (j === i ? { ...s, ...patch } : s)) }), label, merge);
  const set = (c: string): void => setStop({ c }, 'Stop colour');
  return html`<div class="stop" role="group" aria-label=${t('Stop {n}', { n })}>
    ${num(`${id}-pos`, t('Stop {n} position (%)', { n }), st.o * 100, (v) => setStop({ o: Math.min(1, Math.max(0, Math.round(v * 10) / 1000)) }, 'Stop position', `stop${i}`), { min: 0, max: 100, step: 1 })}
    ${pick(`${id}-kind`, t('Stop {n} colour', { n }), kind, stopColourItems(), (v) => set(v === 'main' ? MAIN : v === 'accent' ? ACCENT : v === 'colour' ? (kind === 'colour' ? st.c : BLUE) : kind === 'theme' ? st.c : 'var(--primary-color)'))}
    ${solidBody(x, id, t('Stop {n} colour', { n }), kind, st.c, set)}
    ${button({
      label: t('Remove stop {n}', { n }),
      glyph: 'delete',
      iconOnly: true,
      size: 'sm',
      disabledReason: g.s.length <= 2 ? t('A gradient needs at least 2 stops.') : undefined,
      onClick: () => editGrad(x, k, (q) => ({ ...q, s: q.s.filter((_, j) => j !== i) }), 'Remove stop'),
    })}
  </div>`;
}

/** The gradient CSS the strip under the stops shows (the editor's own tones for Main and Accent). */
const strip = (g: Grad): string => `linear-gradient(90deg, ${stopsOf(g).map((s) => `${s.c === MAIN ? 'var(--mc-text, #212121)' : s.c === ACCENT ? 'var(--art-accent, #d9622b)' : cssOf(s.c)} ${Math.round(s.o * 100)}%`).join(', ')})`;

function gradientBody(x: ImageExt, k: Which, s: Shape, g: Grad): TemplateResult {
  const b = K.shapeBox(s) ?? { x: 0, y: 0, w: 1, h: 1 };
  const lin = g.t === 'linear';
  const more = g.s.length < MAX_STOPS;
  return html`<div class="grad">
    ${lin
      ? num(`${k}-angle`, t('Angle (degrees)'), angleOf(g.p, b.w, b.h), (d) => editGrad(x, k, (q, bx) => ({ ...q, p: linearPts(((d % 360) + 360) % 360, bx.w, bx.h) }), 'Gradient angle', `angle-${k}`), { step: 1 })
      : html`<div class="grid2">
          ${num(`${k}-cx`, t('Centre X (%)'), g.p[0] * 100, (v) => editGrad(x, k, (q) => ({ ...q, p: [v / 100, q.p[1], q.p[2]] }), 'Gradient centre', `cx-${k}`), { step: 1 })}
          ${num(`${k}-cy`, t('Centre Y (%)'), g.p[1] * 100, (v) => editGrad(x, k, (q) => ({ ...q, p: [q.p[0], v / 100, q.p[2]] }), 'Gradient centre', `cy-${k}`), { step: 1 })}
          ${num(`${k}-r`, t('Radius (%)'), g.p[2] * 100, (v) => editGrad(x, k, (q) => ({ ...q, p: [q.p[0], q.p[1], Math.max(0.01, v / 100)] }), 'Gradient radius', `r-${k}`), { min: 1, step: 1 })}
        </div>`}
    <div class="grad-strip" aria-hidden="true" style=${`background:${strip(g)}`}></div>
    <div class="stops">${g.s.map((_, i) => stopRow(x, k, g, i))}</div>
    ${button({
      label: t('Add stop'),
      glyph: 'add',
      variant: 'secondary',
      size: 'sm',
      disabledReason: more ? undefined : t('At most 8 stops.'),
      onClick: () =>
        editGrad(x, k, (q) => {
          const ss = stopsOf(q);
          let at = 0;
          for (let j = 1; j + 1 < ss.length; j++) if (ss[j + 1].o - ss[j].o > ss[at + 1].o - ss[at].o) at = j;
          const s = q.s.slice();
          s.splice(q.s.indexOf(ss[at]) + 1, 0, { o: Math.round(((ss[at].o + ss[at + 1].o) / 2) * 1000) / 1000, c: ss[at].c });
          return { ...q, s };
        }, 'Add stop'),
    })}
  </div>`;
}

// ── the inspector ──

/** The Fill or Stroke control of the layer: the kind, then what that kind needs. */
export function paintRow(x: ImageExt, s: Shape, k: Which): TemplateResult {
  const kind = kindOf(s, k);
  const v = paintOf(s, k);
  const label = k === 'fill' ? t('Fill') : t('Stroke');
  const set = (c: string): void => {
    x.which = k;
    x.edit((q) => (q[k] === 'none' ? q : withLook(q, { [k]: c })), `Change ${k}`);
  };
  return html`<div class="paint">
    ${pick(`${k}-kind`, label, kind, kindItems(), (nk) => {
      x.which = k;
      x.problemAt = undefined;
      x.edit((q) => toKind(q, k, nk as Kind), `Change ${k}`);
    })}
    ${typeof v === 'string' ? solidBody(x, k, t('{paint} colour', { paint: label }), kind, v, set) : gradientBody(x, k, s, v)}
  </div>`;
}

const dashKinds = (): Array<[string, string]> => [
  ['solid', t('Solid')],
  ['dashed', t('Dashed')],
  ['dotted', t('Dotted')],
  ['custom', t('Custom')],
];
const presets = (w: number): Record<string, number[]> => ({ dashed: [Math.round(w * 300) / 100, Math.round(w * 200) / 100], dotted: [Math.round(w * 100) / 100, Math.round(w * 200) / 100] });

/** Opacity of the layer, and under "More style options" the dashes of its outline. */
export function lookRows(x: ImageExt, s: Shape): TemplateResult {
  const op = s.look?.opacity ?? 100;
  const setOpacity = (n: number): void => x.edit((q) => withLook(q, { opacity: Math.min(100, Math.max(0, Math.round(n))) }), 'Opacity', 'opacity');
  const on = stroked(s);
  const d = s.look?.dash ?? [];
  const pre = presets(s.width);
  const dk = !d.length ? 'solid' : dashText(d) === dashText(pre.dashed) ? 'dashed' : dashText(d) === dashText(pre.dotted) ? 'dotted' : 'custom';
  const showList = dk === 'custom' || (x.dashList === s.id && d.length > 0);
  return html`${slider({ id: 'look-opacity', label: t('Opacity'), min: 0, max: 100, step: 1, value: op, unit: '%', onInput: setOpacity, onChange: setOpacity })}
    <p class="help">${t('Opacity fades the whole layer.')}</p>
    ${on
      ? html`<details class="more" ?open=${d.length > 0}>
          <summary>${t('More style options')}</summary>
          ${pick('look-dash', t('Dashes'), showList ? 'custom' : dk, dashKinds(), (v) => {
            x.dashList = v === 'custom' ? s.id : undefined;
            x.problemAt = undefined;
            x.edit((q) => withLook(q, v === 'solid' ? { dash: undefined, offset: undefined } : v === 'custom' ? { dash: q.look?.dash?.length ? q.look.dash : [8, 4] } : { dash: presets(q.width)[v] }), 'Dashes');
          })}
          ${showList
            ? textField(x, 'look-dash-list', t('Dash list'), dashText(d), t('Use up to 8 numbers separated by spaces, like 8 4.'), (raw) => {
                const l = parseDash(raw);
                if (l === 'bad' || !l.length) return undefined;
                x.edit((q) => withLook(q, { dash: l }), 'Dashes', 'dash-list');
                return dashText(l);
              })
            : nothing}
          ${d.length ? num('look-dash-offset', t('Dash offset'), s.look?.offset ?? 0, (n) => x.edit((q) => withLook(q, { offset: n }), 'Dash offset', 'dash-offset'), { step: 1 }) : nothing}
        </details>`
      : nothing}`;
}

// ── handles on the canvas ──

interface Pt {
  key: string;
  h: 'a' | 'b' | number;
  label: string;
  at: [number, number];
}

function handlePoints(g: Grad, b: Box): Pt[] {
  const lin = g.t === 'linear';
  const out: Pt[] = [
    { key: 'a', h: 'a', label: lin ? t('Gradient start') : t('Gradient centre'), at: handleAt(g, b, 'a') },
    { key: 'b', h: 'b', label: lin ? t('Gradient end') : t('Gradient radius'), at: handleAt(g, b, 'b') },
  ];
  g.s.forEach((s, i) => {
    if (s.o > 0 && s.o < 1) out.push({ key: `s${i}`, h: i, label: t('Gradient stop {n} of {count}', { n: i + 1, count: g.s.length }), at: handleAt(g, b, i) });
  });
  return out;
}

/** The paint whose handles show: the one last edited when it is a gradient, else the other. */
function active(x: ImageExt, s: Shape): Which | undefined {
  const is = (k: Which): boolean => typeof paintOf(s, k) === 'object';
  return is(x.which) ? x.which : is('fill') ? 'fill' : is('stroke') ? 'stroke' : undefined;
}

/** Focusable handles over the selected layer's gradient: start and end (or centre and radius) and the stops between. */
export function handles(x: ImageExt): TemplateResult | typeof nothing {
  const sh = x.shell;
  const s = sh.sel.length === 1 ? sh.selected[0] : undefined;
  if (!s || s.locked || x.readOnly || sh.tool !== 'select') return nothing;
  const k = active(x, s);
  const b = K.shapeBox(s);
  const g = k && (paintOf(s, k) as Grad);
  if (!k || !b || !g || typeof g === 'string') return nothing;
  const v = sh.view;
  const move = (p: Pt, to: [number, number], live: boolean, merge?: string): void => {
    const next = (q: Shape): Shape => {
      const cur = q.look?.[k];
      return cur && typeof cur !== 'string' ? withLook(q, { [k]: dragHandle(cur, b, p.h, to) }) : q;
    };
    if (live) sh.setDoc({ ...sh.doc, shapes: sh.doc.shapes.map((q) => (q.id === s.id ? next(q) : q)) });
    else x.edit(next, 'Move gradient handle', merge);
  };
  return html`<div class="gh">
    ${handlePoints(g, b).map(
      (p) => html`<button
        type="button"
        class="gh-pt"
        style=${`left:${v.x + p.at[0] * v.zoom}px;top:${v.y + p.at[1] * v.zoom}px`}
        aria-label=${p.label}
        @pointerdown=${(e: PointerEvent) => {
          e.stopPropagation();
          e.preventDefault();
          (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
          x.dragging = true;
        }}
        @pointermove=${(e: PointerEvent) => {
          if (!x.dragging) return;
          e.stopPropagation();
          const q = sh.point(e);
          move(p, [q[0], q[1]], true);
        }}
        @pointerup=${(e: PointerEvent) => {
          if (!x.dragging) return;
          e.stopPropagation();
          x.dragging = false;
          sh.commit('Move gradient handle');
        }}
        @pointercancel=${() => {
          x.dragging = false;
          sh.commit('Move gradient handle');
        }}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            sh.canvas()?.focus({ preventScroll: true });
            return;
          }
          const dx = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          const dy = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
          if (!dx && !dy) return;
          e.preventDefault();
          e.stopPropagation();
          const step = e.shiftKey ? 10 : 1;
          move(p, [p.at[0] + dx * step, p.at[1] + dy * step], false, `handle-${p.key}`);
        }}
      ></button>`,
    )}
  </div>`;
}
