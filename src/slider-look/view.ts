import { html, nothing, svg, TemplateResult } from 'lit';
import { createRef, ref, type Ref } from 'lit/directives/ref.js';
import type { CardModule, DesignConfig, HomeAssistant, SliderModuleConfig } from '../types';
import type { ModuleView } from '../contracts/lazy-module';
import { formatControlValue, numericControl, runServiceCall } from '../utils/entity-control';
import { clearPendingValue, controlKey, pendingValue, setPendingValue } from '../utils/pending-value';
import { renderTrack } from '../utils/slider-track';
import { entityStateColor } from '../utils/entity-color';
import { entityDisplayName, formatEntityValue } from '../utils/entity-value';
import { safeColor } from '../utils/animation';
import { currentRenderContext, currentRenderPass } from '../services/render-context';
import { t } from '../card/i18n';
import { alphaOf, css, lift, LIGHT_CARD, parseColour, PRIMARY_SHADE, SURFACE_DARK, SURFACE_LIGHT, thumbColours, type RGB } from './colour';
import { bigFillColours, bigFillIcon, fillSamples } from './big-fill';
import { createLive, type Live } from './live';
import { ShapeBox, trackShape } from './shape';
import { ERROR_MS, HIT_PX, LINGER_MS, nearestStop, resolveLook, segmentCount, stopKey, stopsIn, tickValues } from './resolve';
import { SLIDER_LOOK_CSS } from './css';

/*
 * The slider-look view (slider-look 1.0.0 r2): the whole slider for a module with look keys. The
 * interaction, ARIA and keys stay in renderTrack (src/utils/slider-track.ts); this file only draws
 * the parts and keeps the transient state (bubble linger, failed-call hint). The renderTrack bar and
 * background are hidden by the css; the fill, ticks, thumb and value are drawn here from one custom
 * property (--v) on .mc-sl-p, which the drag hooks update without a render.
 */

const DEFAULT_FILL = 'var(--primary-color, #03a9f4)';
const ALERT = 'M13 14H11V10H13M13 18H11V16H13M1 21H23L12 2L1 21Z';
const MAX_NAME = 80;
/** Above this fill the Big fill value moves to the far end, away from the thumb. */
const HIGH = 0.7;

/** Per-slider state that outlives a render: timers started by input and the elements they touch. */
interface State {
  wrap: Ref<HTMLElement>;
  status: Ref<HTMLElement>;
  err: boolean;
  errTimer?: ReturnType<typeof setTimeout>;
  lingerTimer?: ReturnType<typeof setTimeout>;
  /** The card's render request of the last render. */
  update?: () => void;
  /** Value fraction and text of the last render (what a cancelled drag goes back to). */
  frac: number;
  text: string;
  /** The current drag ended in a commit (the render shows the value then). */
  committed: boolean;
  /** The drag in progress (fraction and text): a render meanwhile (the entity echoes a live call) keeps it. */
  drag?: { f: number; text: string };
  /** Live throttle (created on the first live drag) and the send of the latest render. */
  live?: Live;
  send?: (v: number) => void;
  /** Track shape clip. */
  shape: ShapeBox;
  /** Stops the throttle when the slider is removed (Lit calls a ref callback with undefined then). */
  gone: (el?: Element) => void;
}
const states = new Map<string, State>();
/** How often a key was asked for in a render pass: the second slider with the same entity and id (the pop-up copy) gets its own state. */
const seen = new WeakMap<object, Map<string, number>>();

const stateFor = (base: string): State => {
  const pass = currentRenderPass();
  let n = 0;
  if (pass) {
    let counts = seen.get(pass);
    if (!counts) seen.set(pass, (counts = new Map()));
    n = counts.get(base) ?? 0;
    counts.set(base, n + 1);
  }
  const id = n ? `${base}|${n}` : base;
  let s = states.get(id);
  if (!s) {
    const st: State = {
      wrap: createRef(), status: createRef(), err: false, frac: 0, text: '', committed: false, shape: new ShapeBox(),
      // the slider left the DOM: stop its throttle and timers and forget the state (Lit calls a ref callback with undefined then)
      gone: (el) => {
        if (el) return;
        st.live?.stop();
        st.drag = undefined;
        clearTimeout(st.errTimer);
        clearTimeout(st.lingerTimer);
        st.errTimer = st.lingerTimer = undefined;
        st.err = false;
        if (states.get(id) === st) states.delete(id);
      },
    };
    states.set(id, (s = st));
  }
  return s;
};

/** Tests: how many slider states are alive. */
export const __sliderStateCountForTests = (): number => states.size;

const px = (n: number) => `${+n.toFixed(2)}px`;

/** var(--x, #hex) reads as its fallback for the contrast maths; the CSS value itself stays. */
const readColour = (c: string): RGB | undefined => parseColour(c) ?? parseColour(/^var\([^,]+,\s*([^)]+)\)$/.exec(c.trim())?.[1]);

/** A colour with an alpha below 1 (8-digit hex, rgba() or `/ a`): the contrast lift would make it opaque, so it is left as written. */
const translucent = (c: string): boolean => alphaOf(c) < 1;

const alertIcon = () => html`<svg viewBox="0 0 24 24" aria-hidden="true">${svg`<path d=${ALERT}></path>`}</svg>`;

function renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
  const c = config as SliderModuleConfig;
  const look = resolveLook(c);
  const vertical = c.direction === 'vertical';
  const design = (c.design || {}) as DesignConfig;
  const stateObj = c.entity && hass ? hass.states[c.entity] : undefined;
  const ctrl = stateObj ? numericControl(hass, stateObj, c.attribute, { min: c.min, max: c.max, step: c.step }) : undefined;
  const key = controlKey(c.entity, c.attribute, 'slider');
  const ctx = currentRenderContext();
  const st = stateFor(`${ctx?.instance ?? ''}|${key}|${c.id}`);
  st.update = ctx?.requestUpdate;

  const min = ctrl?.min ?? c.min ?? 0;
  const max = ctrl?.max ?? c.max ?? 100;
  const step = ctrl?.step ?? c.step ?? 1;
  const range = max - min;
  const value = ctrl ? pendingValue(key, ctrl.value) ?? ctrl.value : undefined;
  const fmt = (v: number) => (ctrl ? formatControlValue(hass, ctrl, v) : String(v));
  const valueText = ctrl && value !== undefined
    ? fmt(value)
    : stateObj
      ? formatEntityValue(hass, stateObj).text
      : '';
  const name = (stateObj ? entityDisplayName(hass, stateObj) : t('Slider')).slice(0, MAX_NAME);
  const frac = value === undefined || range <= 0 ? 0 : Math.max(0, Math.min(1, (value - min) / range));
  st.frac = frac;
  st.text = valueText;

  // ── stops, snapping and the spoken value
  const stops = stopsIn(look, min, max);
  const snapping = look.snap && stops.length > 0;
  const onStop = value === undefined ? undefined : stops.find((s) => Math.abs(s.value - value) < 1e-9);
  const spoken = onStop?.label ? `${onStop.label}, ${valueText}` : valueText;

  // ── colours: the fill's start colour, the fill shape, the thumb
  const dark = !!(hass?.themes as { darkMode?: boolean } | undefined)?.darkMode;
  const surface = dark ? SURFACE_DARK : SURFACE_LIGHT;
  let fill = safeColor(c.slider_color) ?? safeColor(design.color) ?? DEFAULT_FILL;
  if (look.entityColour && stateObj?.entity_id.startsWith('light.')) {
    // the light's own colour (lifted to 3:1 on the empty track); no colour reported keeps slider_color
    const own = parseColour(entityStateColor(stateObj));
    if (own) fill = css(lift(own, surface, 3));
  }
  // a light card: the fill reaches 3:1 on the card (a colour we can read is lifted, the theme primary gets a black shade)
  const own3 = dark || translucent(fill) ? undefined : parseColour(fill);
  const lifted = own3 && lift(own3, LIGHT_CARD, 3);
  if (lifted && lifted !== own3) fill = css(lifted);
  const dir = vertical ? 'to top' : 'to right';
  const attr = c.attribute;
  const light = stateObj?.entity_id.startsWith('light.');
  let grad: string | undefined;
  let sampleMode: 'solid' | 'gradient' | 'brightness' | 'kelvin' = look.fillMode === 'gradient' ? 'gradient' : 'solid';
  if (look.fillMode === 'gradient') grad = `linear-gradient(${dir}, ${fill}, ${look.fillTo ?? fill})`;
  else if (look.fillMode === 'auto' && light) {
    if (!attr || attr === 'brightness' || attr === 'brightness_pct') {
      // dark to bright: a black ramp over the colour, no colour maths needed
      grad = `linear-gradient(${dir}, rgba(0,0,0,0.75), rgba(0,0,0,0)), linear-gradient(${fill}, ${fill})`;
      sampleMode = 'brightness';
    } else if (attr === 'color_temp_kelvin' || attr === 'color_temp') {
      grad = `linear-gradient(${dir}, #ffa94d, #bfe0ff)`;
      sampleMode = 'kelvin';
    }
  }
  const shade = `rgba(0,0,0,${PRIMARY_SHADE})`;
  if (!dark && !grad && fill === DEFAULT_FILL) grad = `linear-gradient(${shade},${shade}), linear-gradient(${fill}, ${fill})`;
  const fillRgb = readColour(fill);
  const th = fillRgb ? thumbColours(fillRgb, surface) : undefined;
  const face = th ? css(th.face) : 'var(--text-primary-color, #fff)';
  const ring = th ? css(th.ring) : fill;
  const iconColour = th ? css(th.icon) : 'var(--primary-text-color, #212121)';
  const bf = look.style === 'big-fill';
  const bfc = bf ? bigFillColours(fillSamples(fillRgb, sampleMode, readColour(look.fillTo ?? ''))) : undefined;
  const shape = trackShape(c, st.update);
  st.shape.set(shape);

  // ── geometry
  const hasThumb = look.thumb === 'circle' || look.thumb === 'pill' || look.thumb === 'square';
  const long = look.thumbSize;
  const short = look.thumb === 'pill' ? Math.round(long * 0.57) : long;
  const tw = vertical && look.thumb === 'pill' ? short : long;
  const thh = vertical && look.thumb === 'pill' ? long : short;
  const across = hasThumb ? (vertical ? tw : thh) : 0;
  const radius = shape && look.style !== 'segmented'
    ? '0px'
    : look.radius === 'var(--mc-slider-radius)'
    ? ['tl', 'tr', 'br', 'bl'].map((k) => `var(--mc-design-radius-${k}, var(--mc-slider-radius))`).join(' ')
    : look.radius;
  const segs = look.style === 'segmented' ? segmentCount(look, min, max, step) : 0;

  const trackColour = safeColor(c.track_color) ?? safeColor(design.background);
  const vars = [
    `--mc-slider-color: ${fill}`,
    trackColour ? `--mc-slider-background: ${trackColour}` : '',
    grad ? `--sl-grad: ${grad}` : '',
    `--sl-t: ${px(look.thickness)}`,
    `--sl-hit: ${px(Math.max(HIT_PX, look.thickness))}`,
    `--sl-r: ${radius}`,
    `--sl-gap: ${px(look.gap)}`,
    `--sl-face: ${face}`,
    `--sl-ring: ${ring}`,
    `--sl-icon: ${iconColour}`,
    `--sl-bo: ${px(Math.max(across, look.thickness) / 2 + 10)}`,
    bfc ? `--bf-text: ${bfc.text}; --bf-out: ${bfc.outline}` : '',
    hasThumb ? `--tw: ${px(tw)}; --th: ${px(thh)}; --tr: ${look.thumb === 'square' ? '4px' : look.thumb === 'circle' ? '50%' : '999px'}` : '',
    hasThumb ? `--sl-tb: ${px(look.thumbBorder)}; --sl-tbc: ${look.thumbBorderColour}; --sl-glow: ${px(look.thumbGlow)}` : '',
  ].filter(Boolean);

  // ── ticks and labels (under the track; beside it when vertical)
  const at = (v: number) => (range > 0 ? Math.max(0, Math.min(1, (v - min) / range)) : 0);
  const ticks = new Map<number, boolean>();
  const r6 = (v: number) => +v.toFixed(6);
  if (look.ticks) {
    for (const v of tickValues(look, min, max)) ticks.set(r6(v), false);
    ticks.set(r6(min), true);
    ticks.set(r6(max), true);
  }
  for (const s of stops) ticks.set(r6(s.value), true);
  const labels: Array<{ f: number; text: string; on: boolean }> = [];
  for (const s of stops) if (s.short) labels.push({ f: at(s.value), text: s.short, on: s === onStop });
  if (look.limits && range > 0) {
    if (!stops.some((s) => s.short && s.value === min)) labels.unshift({ f: 0, text: fmt(min), on: false });
    if (!stops.some((s) => s.short && s.value === max)) labels.push({ f: 1, text: fmt(max), on: false });
  }
  const tickParts = [...ticks].map(([v, longTick]) => html`<i class="mc-sl-k ${longTick ? 'mc-sl-k--l' : ''}" style="--k: ${at(v)}"></i>`);
  const labelParts = labels.map(
    (l) => html`<span class="mc-sl-l" style="--k: ${l.f}" data-edge=${l.f <= 0.001 ? '0' : l.f >= 0.999 ? '1' : nothing} ?data-on=${l.on}>${l.text}</span>`,
  );
  if (labels.length) vars.push(`--nl: ${labels.length}`);

  // ── the failed call: snap back, show the hint, say it
  const couldnt = () => t("Couldn't set {name}", { name });
  const message = st.err ? couldnt() : '';
  const trackEl = () => st.wrap.value?.closest('.mc-tile-slider');
  /** The failed-call text: spoken (the status line) and shown for the same few seconds (under the track). */
  const setMessage = (text: string) => {
    if (st.status.value) st.status.value.textContent = text;
    const m = st.wrap.value?.querySelector('.mc-sl-m');
    if (m) m.textContent = text;
  };
  const fail = () => {
    clearPendingValue(key);
    st.err = true;
    if (st.errTimer) clearTimeout(st.errTimer);
    st.wrap.value?.setAttribute('data-error', '');
    trackEl()?.setAttribute('aria-invalid', 'true');
    setMessage(couldnt());
    st.update?.();
    st.errTimer = setTimeout(heal, ERROR_MS);
  };
  /** The window ended or the next set went through: the hint, the mark and aria-invalid go. */
  const heal = () => {
    if (!st.err) return;
    clearTimeout(st.errTimer);
    st.err = false;
    st.wrap.value?.removeAttribute('data-error');
    trackEl()?.removeAttribute('aria-invalid');
    setMessage('');
    st.update?.();
  };

  st.send = ctrl?.call && hass ? (v) => runServiceCall(hass, ctrl.call!(v), fail, heal) : undefined;

  // ── drag hooks: no render while dragging, the parts follow --v
  const texts = () => st.wrap.value?.closest('.mc-slider-container')?.querySelectorAll<HTMLElement>('[data-val]') ?? [];
  const show = (f: number, text: string) => {
    st.wrap.value?.style.setProperty('--v', String(f));
    st.wrap.value?.toggleAttribute('data-vl', f > HIGH);
    for (const n of texts()) n.textContent = text;
  };
  const onInput = (v: number) => {
    st.committed = false;
    const f = range > 0 ? (v - min) / range : 0;
    st.drag = { f, text: fmt(v) };
    show(f, st.drag.text);
    // live: the throttle sends the value; the final one goes out on release (onCommit)
    if (look.live) (st.live ??= createLive((n) => st.send?.(n))).input(v);
  };
  const onRelease = () => {
    st.live?.end();
    st.drag = undefined;
    if (!st.committed) show(st.frac, st.text);
    st.committed = false;
    const wrap = st.wrap.value;
    if (wrap && look.position === 'bubble') {
      wrap.setAttribute('data-linger', '');
      if (st.lingerTimer) clearTimeout(st.lingerTimer);
      st.lingerTimer = setTimeout(() => wrap.removeAttribute('data-linger'), LINGER_MS);
    }
  };

  // ── the parts inside the track
  const outline = (look.style === 'standard' || look.style === 'thin' || look.style === 'pill' || look.style === 'glass') && !shape;
  const fillBox = segs
    ? html`<div class="mc-sl-segs">${Array.from({ length: segs }, (_, i) => {
        const p = segs > 1 ? (vertical ? (segs - 1 - i) / (segs - 1) : i / (segs - 1)) * 100 : 0;
        return html`<i class="mc-sl-s" style="--i: ${i}; --n: ${segs}; --p: ${p}%"><b></b></i>`;
      })}</div>`
    : html`<div class="mc-sl-f"></div>`;
  const thumb = hasThumb
    ? html`<div class="mc-sl-th">${look.thumbIcon ? html`<ha-icon icon=${look.thumbIcon}></ha-icon>` : nothing}</div>`
    : nothing;
  const valueBox = (cls: string) => html`<div class=${cls} data-val aria-hidden="true" .textContent=${st.drag?.text ?? valueText}></div>`;
  const showValue = !!stateObj && valueText !== '';
  const onTrack = look.position === 'track' && showValue;
  const bubble = look.position === 'bubble' && showValue;
  const mark = st.err && look.position !== 'beside' ? html`<div class="mc-sl-e">${alertIcon()}</div>` : nothing;

  const icon = bf && look.showIcon ? bigFillIcon(hass, c.entity, look.icon, vertical && look.iconPos === 'center') : nothing;
  const parts = html`<div class="mc-sl-p" ${ref(st.wrap)} ${ref(st.gone)} style="--v: ${st.drag?.f ?? frac}" ?data-error=${st.err} ?data-vl=${(st.drag?.f ?? frac) > HIGH}>
    <div class="mc-sl-box" ${shape ? ref(st.shape.ref) : nothing}>
      <div class="mc-sl-t"></div>${fillBox}${shape ? html`<svg class="mc-sl-sh" aria-hidden="true"><path></path></svg>` : nothing}${outline ? html`<div class="mc-sl-o"></div>` : nothing}${look.thumb === 'line' && !segs ? html`<div class="mc-sl-g"></div>` : nothing}
    </div>${tickParts}${labelParts}${icon}${thumb}${bubble ? valueBox('mc-sl-b') : nothing}${onTrack ? valueBox('mc-sl-v') : nothing}${mark}<span class="mc-sl-m" aria-hidden="true" .textContent=${message}></span>
  </div>`;

  const track = renderTrack({
    value,
    min,
    max,
    step,
    vertical,
    disabled: !ctrl || ctrl.readOnly || !hass,
    label: name,
    valueText: spoken,
    style: `${vars.join('; ')};`,
    className: [
      'mc-sl',
      `mc-sl--${look.style}`,
      look.blur && look.style === 'glass' ? 'mc-sl--blur' : '',
      labels.length ? 'mc-sl--labels' : ticks.size ? 'mc-sl--ticks' : '',
      bubble ? 'mc-sl--bubble' : '',
    ].filter(Boolean).join(' '),
    parts,
    onInput,
    onRelease,
    snap: snapping ? (v) => nearestStop(stops, v) : undefined,
    nextValue: snapping ? (cur, k) => stopKey(stops, cur, k) : undefined,
    onCommit: (v) => {
      st.committed = true;
      if (!ctrl?.call || !hass) return;
      const call = ctrl.call;
      // live: the final value goes out at once (the drag's own calls were throttled)
      setPendingValue(key, v, ctrl.value, (sent) => runServiceCall(hass, call(sent), fail, heal), () => ctx?.requestUpdate(), look.live ? 0 : 300);
    },
  });

  const beside = look.position === 'beside' && stateObj
    ? st.err
      ? html`<span class="mc-slider-value mc-sl-ev">${alertIcon()}</span>`
      : html`<span class="mc-slider-value" data-val .textContent=${st.drag?.text ?? valueText}></span>`
    : nothing;

  return html`<style>${SLIDER_LOOK_CSS}</style>
    <div class="mc-module mc-slider mc-slider-container ${vertical ? 'mc-slider-container--vertical' : 'mc-slider-container--horizontal'} ${vertical && bf ? 'mc-slider-container--bigfill' : ''}">
      ${track}${beside}
      <span class="mc-sl-sr" role="status" ${ref(st.status)} .textContent=${message}></span>
    </div>`;
}

export const sliderLookView: ModuleView = { renderPreview };
