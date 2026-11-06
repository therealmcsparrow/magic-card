import type { CompiledTrack, CompiledV2 } from '../anim-studio/compile-v2';
import type { ApplyCtx } from './types';

// v2 runtime, card-part targets: tracks on `element`, `icon`, `name`, `state` and `background` play on the module's
// marked parts (`data-mc-part`) through rules in the runtime sheet scoped by the wrapper (`data-mc-tm`).
// Keyframes are shared per run key and counted; rows, columns and the card only take element and background.

/** Card-part targets this module plays (rig targets are rig.ts's). */
const PART_TARGETS = new Set(['element', 'icon', 'name', 'state', 'background']);
/** Timing when the card passes none: the document defaults of a looping keyframes doc. */
const DEFAULT_TIMING = '1s ease 0s infinite normal';
/** Background longhands the generated layer takes over from the wrapper. */
const BG_PROPS = [
  'background-color',
  'background-image',
  'background-position',
  'background-size',
  'background-repeat',
  'background-origin',
  'background-clip',
  'background-attachment',
  'background-blend-mode',
];

const GEN = 'data-mc-gen-bg';
const BG_ATTR = 'data-mc-bg-layer';
/** While the background hands over: no transitions on the wrapper. */
const READ_ATTR = 'data-mc-bg-read';
const TM_ATTR = 'data-mc-tm';
/**
 * The elements the card applies v2 data to: module wrappers, rows, columns and the card itself
 * (ha-card), each with its run keys in data-mc-run. Two attributes weigh as much as the class and
 * attribute this used to be, above the base animation rules of css/animations.ts.
 */
const WRAP = '[data-mc-run]';
/** Text alignment of a name / state part (l, c, r), for its default transform origin. */
const ALIGN_ATTR = 'data-mc-align';

/** The layer and the wrapper while it has one. */
const BASE_CSS = `:where(${WRAP}[${BG_ATTR}]) {
  position: relative;
  isolation: isolate;
}
${WRAP}[${BG_ATTR}] {
  background: none !important;
}
${WRAP}[${READ_ATTR}] {
  transition: none !important;
}
${WRAP} > [${GEN}] {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  pointer-events: none;
  transition: inherit;
}`;

// ── the runtime's sheet ──

/** Rules by entry id: `base`, `k:<run>` (a document's track keyframes), `w:<wrapper id>`. */
const entries = new Map<string, string>();
let dirty = false;
let sheet: CSSStyleSheet | undefined;
const fallbacks = new Set<HTMLStyleElement>();
const constructable = (): boolean =>
  typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype && typeof ShadowRoot !== 'undefined' && 'adoptedStyleSheets' in ShadowRoot.prototype;

const sheetText = (): string => [...entries.values()].join('\n');

function put(id: string, css: string): void {
  if (entries.get(id) === css) return;
  entries.set(id, css);
  dirty = true;
}
function drop(id: string): void {
  if (entries.delete(id)) dirty = true;
}
function flush(): void {
  if (!dirty) return;
  dirty = false;
  const text = sheetText();
  sheet?.replaceSync(text);
  for (const el of fallbacks) {
    if (el.isConnected) el.textContent = text;
    else fallbacks.delete(el);
  }
}
/** Adopt the sheet into a card's shadow root (once; after the card's own sheets, so these rules come later). */
function adopt(root: ShadowRoot | undefined): void {
  if (!root || typeof root.querySelector !== 'function') return;
  if (constructable()) {
    if (!sheet) {
      sheet = new CSSStyleSheet();
      sheet.replaceSync(sheetText());
    }
    if (!root.adoptedStyleSheets.includes(sheet)) root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
    return;
  }
  let el = root.querySelector<HTMLStyleElement>(':scope > style[data-mc-parts]');
  if (!el) {
    el = document.createElement('style');
    el.setAttribute('data-mc-parts', '');
    root.append(el);
  }
  el.textContent = sheetText();
  fallbacks.add(el);
}

/** Tests and probes: the runtime sheet's rules. */
export const partsSheetText = (): string => sheetText();

// ── rules ──

export interface TargetCssOptions {
  /** The entry's timing after the name: `<duration> <easing> <delay> <iterations> <direction>`. */
  timing?: string;
  /** Narrow the scope to wrappers with this `data-mc-tm`. */
  token?: string;
}

/** One document's card-part tracks on a wrapper, with the entry's timing. */
export interface PartRun {
  tracks: readonly CompiledTrack[];
  timing?: string;
}

/** The card-part tracks of a compiled document that have something to play. */
export const partTracks = (tracks: readonly CompiledTrack[]): CompiledTrack[] => tracks.filter((t) => PART_TARGETS.has(t.target) && !!t.css);

const rule = (sel: string, body: string): string => `${sel} {\n  ${body}\n}`;

/**
 * The rules playing the card-part tracks of `runs` (in order, stacked) on the parts of the wrappers
 * matching `scope` (a selector of the wrapper itself). No @keyframes.
 */
export function partsCss(scope: string, runs: readonly PartRun[]): string {
  const byTarget = new Map<string, { lists: string[]; origin?: string }>();
  for (const r of runs) {
    const timing = r.timing || DEFAULT_TIMING;
    for (const t of partTracks(r.tracks)) {
      let g = byTarget.get(t.target);
      if (!g) byTarget.set(t.target, (g = { lists: [] }));
      g.lists.push(...[t.name, ...(t.lanes ?? [])].map((n) => `${n} ${timing}`));
      g.origin ??= t.origin;
    }
  }
  const out: string[] = [];
  for (const [target, { lists, origin }] of byTarget) {
    const list = lists.join(', ');
    if (target === 'element') {
      out.push(
        rule(scope, `animation: var(--mc-anim-m, none), ${list};\n  transform-origin: ${origin ?? 'var(--mc-anim-om, center)'};`),
        // the wrapper's own variants (css/animations.ts): a module without its icon plays both lists, a tap adds the tap list
        rule(`${scope}[data-mc-anim~='icon']:not(:has(.mc-anim-icon))`, `animation: var(--mc-anim-mi, none), ${list};`),
        rule(`${scope}[data-mc-tap][data-mc-tapped]`, `animation: var(--mc-anim-m, none), var(--mc-anim-t), ${list};`),
      );
      continue;
    }
    // the wrapper's own part (`tag` and `extra` narrow it), not one of a module nested inside it
    const own = (tag = '', extra = '') => `${scope} ${tag}[data-mc-part="${target}"]${extra}:not(${scope} .mc-module-wrapper [data-mc-part])`;
    if (target === 'icon') {
      out.push(rule(own(), `display: inline-block;\n  animation: var(--mc-anim-i, none), ${list};\n  transform-origin: ${origin ?? 'var(--mc-anim-oi, center)'};`));
    } else {
      out.push(rule(own(), `animation: ${list};\n  transform-origin: ${origin ?? 'center'};`));
      // transforms need a box: an inline text span becomes inline-block (flex items are blocks anyway)
      out.push(rule(own('span'), 'display: inline-block;'));
      // no origin of its own: text turns and scales about where it is aligned (a wide, left-aligned
      // line about its left edge, not the middle of the empty space); apply() marks the alignment
      if (!origin && target !== 'background') {
        out.push(rule(own('', `[${ALIGN_ATTR}="l"]`), 'transform-origin: 0% 50%;'), rule(own('', `[${ALIGN_ATTR}="r"]`), 'transform-origin: 100% 50%;'));
      }
    }
    // SVG parts (gauge text and track) turn about their own box
    out.push(rule(`${scope} svg [data-mc-part="${target}"]`, 'transform-box: fill-box;'));
  }
  return out.join('\n');
}

/** The @keyframes of a document's card-part tracks. */
const keyframesCss = (tracks: readonly CompiledTrack[]): string =>
  partTracks(tracks)
    .map((t) => t.css)
    .join('\n');

/**
 * One document on its own: its tracks' @keyframes plus the rules, scoped
 * `.mc-module-wrapper[data-mc-run~="<runKey>"]` (and `[data-mc-tm~="<token>"]` with a token).
 * Rig targets (part:, group:, shape:) and empty tracks are skipped.
 */
export function targetCss(tracks: readonly CompiledTrack[], runKey: string, opts: TargetCssOptions = {}): string {
  const scope = `.mc-module-wrapper[data-mc-run~="${runKey}"]${opts.token ? `[${TM_ATTR}~="${opts.token}"]` : ''}`;
  const rules = partsCss(scope, [{ tracks, timing: opts.timing }]);
  return rules ? `${keyframesCss(tracks)}\n${rules}` : '';
}

// ── wrappers ──

interface RunState {
  tracks: CompiledTrack[];
  timing: string;
}
interface WrapperState {
  id: string;
  runs: Map<string, RunState>;
  /** Theme of the last apply (dark mode and theme name resolve var() differently). */
  theme: string;
  /** What the layer's background was taken from (style, class, theme). */
  bgFrom?: string;
  /** What the alignment marks were taken from. */
  alignFrom?: string;
}
const states = new WeakMap<HTMLElement, WrapperState>();
let nextId = 0;
/** Wrappers running each document (its @keyframes entry stays while > 0). */
const refs = new Map<string, number>();

function addRun(st: WrapperState, run: string, rs: RunState): void {
  if (!st.runs.has(run)) {
    refs.set(run, (refs.get(run) ?? 0) + 1);
    put(`k:${run}`, keyframesCss(rs.tracks));
  }
  st.runs.set(run, rs);
}
function dropRun(st: WrapperState, run: string): void {
  if (!st.runs.delete(run)) return;
  const n = (refs.get(run) ?? 1) - 1;
  if (n > 0) refs.set(run, n);
  else {
    refs.delete(run);
    drop(`k:${run}`);
  }
}

/** Apply this document's card-part tracks to the wrapper; idempotent per render. */
export function apply(wrapper: HTMLElement, v2: CompiledV2, ctx: ApplyCtx): void {
  const run = ctx.run;
  if (!run) return;
  let st = states.get(wrapper);
  const tracks = ctx.reducedMotion ? [] : partTracks(v2.tracks ?? []);
  if (!st && !tracks.length) return;
  if (!st) states.set(wrapper, (st = { id: `w${++nextId}`, runs: new Map(), theme: '' }));
  const themes = ctx.hass?.themes as { darkMode?: boolean; theme?: string } | undefined;
  st.theme = `${themes?.darkMode ? 'dark' : 'light'}|${themes?.theme ?? ''}`;
  // documents the wrapper no longer runs
  const live = new Set((wrapper.getAttribute('data-mc-run') ?? '').split(/\s+/).filter(Boolean));
  for (const r of [...st.runs.keys()]) if (!live.has(r)) dropRun(st, r);

  // apply() gets a new v2 object on every render: the run key is the content hash, so only a new
  // run or a new timing changes anything
  if (!tracks.length) dropRun(st, run);
  else {
    const timing = ctx.timing || DEFAULT_TIMING;
    if (st.runs.get(run)?.timing !== timing) addRun(st, run, { tracks, timing });
  }
  put('base', BASE_CSS);
  adopt(ctx.shadowRoot);
  sync(wrapper, st);
  flush();
}

/**
 * After a render: the wrapper runs only the documents in `keep` (run keys); drop the rules and the
 * generated layer of the others.
 */
export function prune(wrapper: HTMLElement, keep: Iterable<string>): void {
  const st = states.get(wrapper);
  if (!st) return;
  const k = new Set(keep);
  for (const r of [...st.runs.keys()]) if (!k.has(r)) dropRun(st, r);
  sync(wrapper, st);
  flush();
}

/** The wrapper left the page: drop its rules, marks and generated layer. */
export function release(wrapper: HTMLElement): void {
  const st = states.get(wrapper);
  if (!st) return;
  for (const r of [...st.runs.keys()]) dropRun(st, r);
  sync(wrapper, st);
  states.delete(wrapper);
  flush();
}

/** The wrapper's own parts (not those of a module nested inside it) matching `sel`. */
const ownParts = (wrapper: HTMLElement, sel: string): Element[] =>
  [...wrapper.querySelectorAll(sel)].filter((el) => el.closest('.mc-module-wrapper') === wrapper);

/** l / c / r from the computed text-align (start / end follow the direction). */
function alignOf(el: Element): string {
  const cs = getComputedStyle(el);
  const rtl = cs.direction === 'rtl';
  switch (cs.textAlign) {
    case 'center':
    case '-webkit-center':
      return 'c';
    case 'right':
    case '-webkit-right':
      return 'r';
    case 'end':
      return rtl ? 'l' : 'r';
    case 'start':
      return rtl ? 'r' : 'l';
    default:
      return 'l';
  }
}

/** Mark (or unmark) the alignment of the wrapper's HTML name and state parts; recomputed when the design changed or a part is new. */
function markAlign(wrapper: HTMLElement, st: WrapperState, on: boolean, from: string): void {
  const same = st.alignFrom === from;
  for (const el of ownParts(wrapper, '[data-mc-part="name"], [data-mc-part="state"]')) {
    if (!on || el instanceof SVGElement) {
      if (el.hasAttribute(ALIGN_ATTR)) el.removeAttribute(ALIGN_ATTR);
      continue;
    }
    if (same && el.hasAttribute(ALIGN_ATTR)) continue;
    const a = alignOf(el);
    if (el.getAttribute(ALIGN_ATTR) !== a) el.setAttribute(ALIGN_ATTR, a);
  }
  st.alignFrom = on ? from : undefined;
}

/** The wrapper's own `data-mc-part="background"` element (bar, gauge), not the generated one. */
const ownBackground = (wrapper: HTMLElement): boolean => ownParts(wrapper, `[data-mc-part="background"]:not([${GEN}])`).length > 0;

/** The wrapper's hover background (the card's hover rule for its data-mc-hover), as declarations for the layer. */
function hoverBackground(wrapper: HTMLElement): string {
  const id = wrapper.getAttribute('data-mc-hover');
  const root = wrapper.getRootNode() as ShadowRoot;
  const style = id && typeof root.querySelector === 'function' ? root.querySelector<HTMLStyleElement>('style[data-mc-hover-styles]') : null;
  if (!id || !style?.sheet) return '';
  const sel = `[data-mc-hover="${id.replace(/["\\]/g, '\\$&')}"]:hover`;
  let rules: CSSRuleList;
  try {
    rules = style.sheet.cssRules;
  } catch {
    return '';
  }
  for (const r of rules) {
    if (!(r instanceof CSSStyleRule) || r.selectorText !== sel) continue;
    return BG_PROPS.map((p) => [p, r.style.getPropertyValue(p)] as const)
      .filter(([, v]) => v && !/[{};]/.test(v))
      .map(([p, v]) => `${p}: ${v} !important;`)
      .join(' ');
  }
  return '';
}

/** Change the wrapper's background state without a transition (its own `transition: all` would fade it). */
function handOver(wrapper: HTMLElement, fn: () => void): void {
  wrapper.setAttribute(READ_ATTR, '');
  fn();
  // a style change with transitions off, then they come back with nothing left to animate
  void getComputedStyle(wrapper).backgroundColor;
  wrapper.removeAttribute(READ_ATTR);
}

function sync(wrapper: HTMLElement, st: WrapperState): void {
  const order = (wrapper.getAttribute('data-mc-run') ?? '').split(/\s+/);
  const runs = [...st.runs.entries()].sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0])).map(([, r]) => r);
  const scope = `${WRAP}[${TM_ATTR}="${st.id}"]`;
  const any = runs.length > 0;
  if (any) {
    if (wrapper.getAttribute(TM_ATTR) !== st.id) wrapper.setAttribute(TM_ATTR, st.id);
  } else if (wrapper.hasAttribute(TM_ATTR)) wrapper.removeAttribute(TM_ATTR);

  const style = wrapper.getAttribute('style') ?? '';
  const from = `${style}|${wrapper.className}|${st.theme}`;
  // alignment follows the design's own declarations: animation lists, entity colour and other custom
  // properties change with the state and would re-read every render
  const design = `${style.replace(/--[\w-]+\s*:[^;]*;?/g, '')}|${wrapper.className}`;
  markAlign(wrapper, st, runs.some((r) => r.tracks.some((t) => t.target === 'name' || t.target === 'state')), design);

  const layer = wrapper.querySelector<HTMLElement>(`:scope > [${GEN}]`);
  const want = runs.some((r) => r.tracks.some((t) => t.target === 'background')) && !ownBackground(wrapper);
  let hover = '';
  if (!want) {
    if (layer || wrapper.hasAttribute(BG_ATTR)) {
      handOver(wrapper, () => {
        layer?.remove();
        wrapper.removeAttribute(BG_ATTR);
      });
    }
    st.bgFrom = undefined;
  } else {
    let el = layer;
    if (!el) {
      el = document.createElement('div');
      el.setAttribute(GEN, '');
      el.setAttribute('data-mc-part', 'background');
      el.setAttribute('aria-hidden', 'true');
      // first: under a value background or particle layer (same z-index, earlier in the tree)
      wrapper.prepend(el);
    }
    // the wrapper's background moves into the layer: read with the hiding rule off, once per design and theme
    if (from !== st.bgFrom || !wrapper.hasAttribute(BG_ATTR)) {
      const layerEl = el;
      handOver(wrapper, () => {
        wrapper.removeAttribute(BG_ATTR);
        const cs = getComputedStyle(wrapper);
        for (const p of BG_PROPS) {
          const v = cs.getPropertyValue(p);
          if (v) layerEl.style.setProperty(p, v);
          else layerEl.style.removeProperty(p);
        }
        wrapper.setAttribute(BG_ATTR, '');
      });
      st.bgFrom = from;
    }
    hover = hoverBackground(wrapper);
  }

  if (!any) {
    drop(`w:${st.id}`);
    return;
  }
  const hoverRule = hover ? `\n${rule(`${scope}[data-mc-hover]:hover > [${GEN}]`, hover)}` : '';
  put(`w:${st.id}`, partsCss(scope, runs) + hoverRule);
}

/** Tests: forget the sheet and the wrapper ids. */
export function __resetTargetsForTests(): void {
  entries.clear();
  refs.clear();
  dirty = false;
  sheet = undefined;
  fallbacks.clear();
  nextId = 0;
}
