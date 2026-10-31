// Icon geometry source: resolves an icon reference to its SVG path data, from `window.customIcons`
// / `customIconsets`, a hidden `<ha-icon>` probe (mdi, hass, hassio, hademo) or a registered
// `svg:<hash>`. Unresolvable gives `undefined` and the caller keeps `<ha-icon>`.

import { sanitizeSvg, SanitizedSvg, StrokeShape, svgFailure, TOO_COMPLEX } from './svg-sanitize';

export type { StrokeShape };

export interface IconGeometry {
  /** Filled shapes (the icon's area: fill clip, morph). */
  paths: string[];
  viewBox: string;
  secondary?: string[];
  /** Stroked shapes (own SVG only): painted on their stroke, never morphed. */
  strokes?: StrokeShape[];
  /** Own SVG: indices of `paths` / `secondary` filled with fill-rule evenodd. */
  evenodd?: { paths?: number[]; accent?: number[] };
}

interface IconSetResult {
  path?: unknown;
  secondaryPath?: unknown;
  viewBox?: unknown;
  svg?: unknown;
  /** Magic Card Utils library: the full sanitised markup of a saved icon. */
  mc_svg?: unknown;
}
type IconSetGetter = (name: string) => IconSetResult | undefined | Promise<IconSetResult | undefined>;
interface IconWindow {
  customIconsets?: Record<string, IconSetGetter>;
  customIcons?: Record<string, { getIcon?: IconSetGetter }>;
}

const DEFAULT_VIEWBOX = '0 0 24 24';
const CACHE_MAX = 200;
const FAIL_TTL = 60_000;
const RETRY_INTERVAL = 500;
const RETRY_TRIES = 10;
/** How long a probe keeps running in the background after the caller's timeout. */
const PROBE_MAX = 15_000;

/** ref -> geometry, or null for a failure (expires after FAIL_TTL). Map order = LRU order. */
const cache = new Map<string, { g: IconGeometry | null; at: number }>();
const inflight = new Map<string, Promise<IconGeometry | undefined>>();
const listeners = new Map<string, Set<() => void>>();
/** Refs that failed while their prefix had no registered pack: re-checked when packs load late. */
const pending = new Set<string>();
let retryTimer: ReturnType<typeof setTimeout> | undefined;
let retriesLeft = 0;
let holder: HTMLElement | undefined;
/** Running probes (their cancel functions). */
const probes = new Set<() => void>();
let eventBound = false;

const iconWindow = (): IconWindow => (typeof window === 'undefined' ? {} : (window as unknown as IconWindow));
const prefixOf = (ref: string): string => (ref.includes(':') ? ref.slice(0, ref.indexOf(':')) : '');
const nameOf = (ref: string): string => ref.slice(ref.indexOf(':') + 1);
/** Prefixes HA resolves itself (its icon DB): the only ones worth an <ha-icon> probe. */
const HA_PREFIXES = new Set(['mdi', 'hass', 'hassio', 'hademo']);

function packGetter(prefix: string): IconSetGetter | undefined {
  const w = iconWindow();
  const set = w.customIconsets?.[prefix];
  if (typeof set === 'function') return set;
  const old = w.customIcons?.[prefix];
  if (old && typeof old.getIcon === 'function') return (name) => old.getIcon!(name);
  return undefined;
}

function store(ref: string, g: IconGeometry | null): void {
  cache.delete(ref);
  cache.set(ref, { g, at: Date.now() });
  while (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value!);
  if (g) {
    pending.delete(ref);
    listeners.get(ref)?.forEach((cb) => {
      try {
        cb();
      } catch {
        /* a listener must not break the others */
      }
    });
  }
}

/** Synchronous cache read (undefined while unresolved or after a failure). */
export function peekIconGeometry(ref: string): IconGeometry | undefined {
  const hit = cache.get(ref);
  if (!hit?.g) return undefined;
  cache.delete(ref);
  cache.set(ref, hit);
  return hit.g;
}

/** Calls `cb` whenever geometry for `ref` is resolved (also late, e.g. a pack that loads after the card). */
export function onIconGeometry(ref: string, cb: () => void): () => void {
  let set = listeners.get(ref);
  if (!set) listeners.set(ref, (set = new Set()));
  set.add(cb);
  return () => {
    set!.delete(cb);
    if (!set!.size) listeners.delete(ref);
  };
}

/** Registers geometry under a ref (own SVG: `svg:<hash>`). */
/** Stores a known geometry under `ref` (own SVG, tests). */
export function setIconGeometry(ref: string, g: IconGeometry): void {
  store(ref, g);
}

/**
 * Own SVGs: ref -> the full text, its sanitised markup and geometry, or the reason it was rejected.
 * LRU (Map order), at most OWN_MAX: a dashboard that pastes ever new SVGs (editing) can't grow it.
 */
const OWN_MAX = 50;
interface OwnSvg {
  text: string;
  markup?: string;
  geometry?: IconGeometry;
  error?: string;
}
const ownSvgs = new Map<string, OwnSvg>();

/** FNV-1a of the text, base 36: the same markup always gives the same ref. */
function fnv(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36) + text.length.toString(36);
}
let hash = fnv;
export function __setSvgHashForTests(fn: ((text: string) => string) | undefined): void {
  hash = fn ?? fnv;
}

function ownEntry(ref: string): OwnSvg | undefined {
  const e = ownSvgs.get(ref);
  if (e) {
    ownSvgs.delete(ref);
    ownSvgs.set(ref, e);
  }
  return e;
}

function sanitize(svgText: string): SanitizedSvg {
  try {
    return sanitizeSvg(svgText);
  } catch {
    // Anything the parser / walk can't handle (stack, odd DOM): rejected once, cached like any error.
    return svgFailure(TOO_COMPLEX);
  }
}

/**
 * Own SVG: sanitises the markup once and registers its shapes as the geometry of `svg:<hash>`.
 * Returns the ref; a rejected SVG has no geometry (svgError tells why). `as` registers it under
 * that ref instead, replacing what was there.
 */
export function registerSvgGeometry(svgText: string, as?: string): string {
  if (as) ownSvgs.delete(as);
  const base = as ?? `svg:${hash(svgText)}`;
  let ref = base;
  for (let n = 1; ownSvgs.has(ref) && ownSvgs.get(ref)!.text !== svgText; n++) ref = `${base}.${n}`;
  const known = ownEntry(ref);
  if (known) {
    // The icon cache may have evicted the geometry meanwhile: put it back.
    if (known.geometry && !cache.get(ref)?.g) store(ref, known.geometry);
    return ref;
  }
  const out = sanitize(svgText);
  const entry: OwnSvg = { text: svgText };
  if (out.error) entry.error = out.error;
  else {
    const g: IconGeometry = { paths: out.paths, viewBox: out.viewBox };
    if (out.accentPaths.length) g.secondary = out.accentPaths;
    if (out.strokes.length) g.strokes = out.strokes;
    if (out.evenodd) g.evenodd = out.evenodd;
    entry.markup = out.markup;
    entry.geometry = g;
  }
  ownSvgs.set(ref, entry);
  while (ownSvgs.size > OWN_MAX) {
    const old = ownSvgs.keys().next().value!;
    ownSvgs.delete(old);
    cache.delete(old);
  }
  if (entry.geometry) store(ref, entry.geometry);
  return ref;
}

/** The sanitised markup of an own SVG ref. */
export function peekSvgMarkup(ref: string): string | undefined {
  return ownSvgs.get(ref)?.markup;
}

/** Why an own SVG was rejected (undefined when it is fine or unknown). */
export function svgError(ref: string): string | undefined {
  return ownSvgs.get(ref)?.error;
}

type PackOutcome = IconGeometry | 'markup' | undefined;

async function fromPack(ref: string): Promise<PackOutcome> {
  const getter = packGetter(prefixOf(ref));
  if (!getter) return undefined;
  let res: IconSetResult | undefined;
  try {
    res = await getter(nameOf(ref));
  } catch {
    return undefined;
  }
  if (!res || typeof res !== 'object') return undefined;
  if (typeof res.mc_svg === 'string') {
    registerSvgGeometry(res.mc_svg, ref);
    const og = peekIconGeometry(ref);
    if (og) return og;
  }
  const path = typeof res.path === 'string' ? res.path.trim() : '';
  // Full SVG markup (multi-colour logos): no single path to draw; HA's <ha-icon> keeps rendering it.
  if (typeof res.svg === 'string' || path.startsWith('<')) return 'markup';
  if (!path) return undefined;
  const g: IconGeometry = { paths: [path], viewBox: typeof res.viewBox === 'string' && res.viewBox.trim() ? res.viewBox.trim() : DEFAULT_VIEWBOX };
  const sec = typeof res.secondaryPath === 'string' ? res.secondaryPath.trim() : '';
  if (sec && !sec.startsWith('<')) g.secondary = [sec];
  return g;
}

function probeHolder(): HTMLElement {
  if (holder?.isConnected) return holder;
  holder = document.createElement('div');
  holder.setAttribute('aria-hidden', 'true');
  holder.style.cssText = 'position:fixed;left:-9999px;top:0;width:0;height:0;overflow:hidden;pointer-events:none;';
  document.body.appendChild(holder);
  return holder;
}

interface SvgIconLike extends HTMLElement {
  path?: string;
  secondaryPath?: string;
  viewBox?: string;
}

/**
 * Renders a hidden <ha-icon> and reads the path its <ha-svg-icon> receives. While <ha-icon> isn't
 * defined (outside HA, or before HA loaded it) there is nothing to probe: wait for its definition
 * within the same time limit instead of polling an unknown element.
 */
function fromProbe(ref: string, timeoutMs: number): Promise<IconGeometry | undefined> {
  if (typeof document === 'undefined' || !document.body || typeof customElements === 'undefined') return Promise.resolve(undefined);
  if (customElements.get('ha-icon')) return probeNow(ref, timeoutMs);
  return new Promise((resolve) => {
    const start = Date.now();
    let done = false;
    const stop = (): boolean => {
      if (done) return false;
      done = true;
      probes.delete(cancel);
      clearTimeout(timer);
      return true;
    };
    const cancel = (): void => {
      if (stop()) resolve(undefined);
    };
    const timer = setTimeout(cancel, timeoutMs);
    probes.add(cancel);
    customElements.whenDefined('ha-icon').then(() => {
      if (stop()) void probeNow(ref, Math.max(0, timeoutMs - (Date.now() - start))).then(resolve);
    }, cancel);
  });
}

function probeNow(ref: string, timeoutMs: number): Promise<IconGeometry | undefined> {
  return new Promise((resolve) => {
    const probe = document.createElement('ha-icon');
    probe.setAttribute('icon', ref);
    let done = false;
    let observer: MutationObserver | undefined;
    // Properties set without attribute changes are invisible to the observer: poll as well.
    const poll = setInterval(() => {
      watch();
      check();
    }, 50);
    const timer = setTimeout(() => finish(undefined), timeoutMs);
    const finish = (g: IconGeometry | undefined): void => {
      if (done) return;
      done = true;
      probes.delete(cancel);
      observer?.disconnect();
      clearInterval(poll);
      clearTimeout(timer);
      probe.remove();
      if (holder && !holder.childElementCount) {
        holder.remove();
        holder = undefined;
      }
      resolve(g);
    };
    const check = (): void => {
      if (done) return;
      const svg = probe.shadowRoot?.querySelector<SvgIconLike>('ha-svg-icon');
      const path = typeof svg?.path === 'string' ? svg.path.trim() : '';
      if (!svg || !path) return;
      const g: IconGeometry = { paths: [path], viewBox: typeof svg.viewBox === 'string' && svg.viewBox.trim() ? svg.viewBox.trim() : DEFAULT_VIEWBOX };
      const sec = typeof svg.secondaryPath === 'string' ? svg.secondaryPath.trim() : '';
      if (sec) g.secondary = [sec];
      finish(g);
    };
    const cancel = (): void => finish(undefined);
    probes.add(cancel);
    probeHolder().appendChild(probe);
    function watch(): void {
      if (observer || !probe.shadowRoot || typeof MutationObserver === 'undefined') return;
      observer = new MutationObserver(check);
      observer.observe(probe.shadowRoot, { subtree: true, childList: true, attributes: true });
    }
    watch();
    // Lit elements: wait for their render passes (ha-icon, then ha-svg-icon) before polling.
    const lit = probe as HTMLElement & { updateComplete?: Promise<unknown> };
    lit.updateComplete?.then(() => {
      watch();
      check();
    }, () => undefined);
    check();
  });
}

function scheduleRetry(): void {
  retriesLeft = RETRY_TRIES;
  if (retryTimer || !pending.size) return;
  const tick = (): void => {
    retryTimer = undefined;
    retryPending();
    if (pending.size && --retriesLeft > 0) retryTimer = setTimeout(tick, RETRY_INTERVAL);
  };
  retryTimer = setTimeout(tick, RETRY_INTERVAL);
}

/** Re-checks failed refs whose icon pack has registered since (only the pack, never a new probe). */
function retryPending(): void {
  for (const ref of [...pending]) {
    if (!packGetter(prefixOf(ref)) || inflight.has(ref)) continue;
    pending.delete(ref);
    const p = fromPack(ref).then((r) => {
      inflight.delete(ref);
      if (r && r !== 'markup') store(ref, r);
      else store(ref, null);
      return r && r !== 'markup' ? r : undefined;
    });
    inflight.set(ref, p);
  }
}

/** The library changed (provider event): forget the listed `mcu:` refs (all when none are listed); watchers fetch them again. */
function libraryChanged(e: Event): void {
  const d = (e as CustomEvent<{ kind?: string; ids?: string[] }>).detail;
  if (d?.kind !== 'icons') return;
  for (const ref of d.ids?.length ? d.ids.map((id) => `mcu:${id}`) : [...cache.keys(), ...listeners.keys()].filter((r) => r.startsWith('mcu:'))) {
    cache.delete(ref);
    ownSvgs.delete(ref);
    listeners.get(ref)?.forEach((cb) => cb());
  }
}

function bindEvents(): void {
  if (eventBound || typeof window === 'undefined') return;
  eventBound = true;
  window.addEventListener('iconset-registered', retryPending);
  window.addEventListener('mcu-library-changed', libraryChanged);
}

/** Resolves an icon ref to its geometry; undefined when it can't be resolved (caller renders <ha-icon>). */
export function resolveIconGeometry(
  ref: string,
  opts: { timeoutMs?: number; probeMaxMs?: number } = {},
): Promise<IconGeometry | undefined> {
  if (!ref || !ref.includes(':')) return Promise.resolve(undefined);
  // Own SVG refs are registered, never looked up.
  if (ref.startsWith('svg:')) return Promise.resolve(peekIconGeometry(ref));
  bindEvents();
  const hit = cache.get(ref);
  if (hit) {
    if (hit.g) return Promise.resolve(peekIconGeometry(ref));
    const stale = Date.now() - hit.at > FAIL_TTL;
    // "Next render" retry: the pack of a failed ref registered since.
    const lateRetry = pending.has(ref) && !!packGetter(prefixOf(ref));
    if (!stale && !lateRetry) return Promise.resolve(undefined);
    // Its pack is here now: one more attempt, not one per render.
    if (lateRetry) pending.delete(ref);
    cache.delete(ref);
  }
  if (ref.startsWith('svg:')) return Promise.resolve(undefined);
  const running = inflight.get(ref);
  if (running) return running;
  const p = (async (): Promise<IconGeometry | undefined> => {
    const hadPack = !!packGetter(prefixOf(ref));
    const fromSet = await fromPack(ref);
    if (fromSet === 'markup') {
      store(ref, null);
      return undefined;
    }
    if (fromSet) {
      store(ref, fromSet);
      return fromSet;
    }
    const prefix = prefixOf(ref);
    if (!HA_PREFIXES.has(prefix)) {
      // HA can't resolve other prefixes without their pack: no probe, wait for the pack instead.
      store(ref, null);
      if (!hadPack) {
        pending.add(ref);
        scheduleRetry();
      }
      return undefined;
    }
    // The caller gets an answer after timeoutMs, but a slow probe (busy HA, icon DB still loading)
    // keeps running up to probeMaxMs: when it lands, the geometry is cached and listeners notified.
    const timeout = opts.timeoutMs ?? 3000;
    const probe = fromProbe(ref, Math.max(timeout, opts.probeMaxMs ?? PROBE_MAX));
    void probe.then((g) => {
      if (!g) return;
      store(ref, g);
      // A probe success means HA is up: re-check refs waiting for a late pack.
      retryPending();
    });
    const probed = await new Promise<IconGeometry | undefined>((resolve) => {
      const t = setTimeout(() => resolve(undefined), timeout);
      void probe.then((g) => {
        clearTimeout(t);
        resolve(g);
      });
    });
    if (probed) return probed;
    if (!peekIconGeometry(ref)) store(ref, null);
    return undefined;
  })().finally(() => inflight.delete(ref));
  inflight.set(ref, p);
  return p;
}

export function __resetIconSourceForTests(): void {
  cache.clear();
  ownSvgs.clear();
  inflight.clear();
  listeners.clear();
  pending.clear();
  clearTimeout(retryTimer);
  retryTimer = undefined;
  retriesLeft = 0;
  [...probes].forEach((cancel) => cancel());
  holder?.remove();
  holder = undefined;
}
