import { supportsAdoptingStyleSheets, type CSSResultGroup, type CSSResultOrNative, type LitElement } from 'lit';
import { BUILD_VERSION } from './build-version';
import { BACKGROUND_RETRY_MS, CHUNK_TIMEOUT_MS, IDLE_FALLBACK_MS, IDLE_TIMEOUT_MS, SILENT_RETRY_MS } from '../contracts/lazy-module.needs';
import type { EditorLazyChunkName, LazyChunkFailure, LazyChunkModule, LazyChunkName, OnDemandChunkName, RetryableLazyChunk } from '../contracts/lazy-module';

/** The one loader for the lazy chunks (contract lazy-module 1.12.0): memoised load, idle fetch, retries, install per frame, styles. */

/** The release this magic-card.js was built from; chunk entries carry their own copy as BUILD. */
export { BUILD_VERSION };

export { sameBuild } from './build-version';

export type LazyImporter<M extends LazyChunkModule = LazyChunkModule> = () => Promise<M>;

/** A RetryableLazyChunk plus the test hook that forgets its state (identity stays, the registry holds it). */
export interface LazyChunkControl<M extends LazyChunkModule = LazyChunkModule> extends RetryableLazyChunk {
  /** The installed chunk entry (undefined until ready). */
  module(): M | undefined;
  /** Tests: forget the load and swap the import (undefined restores the real one). */
  __reset(importer?: LazyImporter<M>): void;
}

/** The contract numbers in one object; tests shorten them. */
export const TIMING = { timeout: CHUNK_TIMEOUT_MS, silent: SILENT_RETRY_MS, background: BACKGROUND_RETRY_MS };

// ── page-wide state ──────────────────────────────────────────────────────────────────────────────

const listeners = new Set<() => void>();
const everFailed = new Set<string>();

/** Run cb when any chunk fails, recovers or ends a retry; returns the unsubscribe. The notices and the card use it. */
export const onChunkChange = (cb: () => void): (() => void) => (listeners.add(cb), () => void listeners.delete(cb));
/** Tell every subscriber to render again (the notices call it when their own state changes). */
export const notifyChunks = (): void => listeners.forEach((cb) => cb());

/** Names of the chunks that have failed on this page (they keep their notice element for the recovery message). */
export const failedChunkNames = (): ReadonlySet<string> => everFailed;

declare const __webpack_require__: { u: (id: unknown) => string } | undefined;
// seeded with the time, so a retry URL is new on this page and on an earlier one: a 404 is cached for a month, and the
// number would otherwise restart at 1 on every page load and meet the cached answer of the page before
let retries = Date.now();
let retrying = false;
let hooked = false;

/**
 * Call the chunk import. A retry asks for the chunk under a URL not yet requested on this page
 * (`r=<n>`), because browsers may cache a failed import(). The number is taken inside the import()
 * call; an attempt that finds the request in flight reuses it and uses no number.
 */
function request(importer: LazyImporter, again: boolean): Promise<LazyChunkModule> {
  if (again && typeof __webpack_require__ !== 'undefined') {
    if (!hooked) {
      hooked = true;
      const u = __webpack_require__.u;
      __webpack_require__.u = (id) => {
        const url = u(id);
        return retrying ? url + '?r=' + ++retries : url;
      };
    }
    retrying = true;
  }
  try {
    return importer();
  } finally {
    retrying = false;
  }
}

const sleep = (ms: number) => new Promise<void>((done) => setTimeout(done, ms));

/** Resolves when the browser is idle (at the latest after IDLE_TIMEOUT_MS), or after IDLE_FALLBACK_MS where requestIdleCallback is missing. */
const idle = (): Promise<void> =>
  new Promise<void>((done) => (typeof requestIdleCallback === 'function' ? requestIdleCallback(() => done(), { timeout: IDLE_TIMEOUT_MS }) : void setTimeout(done, IDLE_FALLBACK_MS)));

// ── install queue ────────────────────────────────────────────────────────────────────────────────

const installs: Array<() => void> = [];
let framing = false;

/** Run one queued install per animation frame; while the tab is hidden, wait for it to show. */
function pump(): void {
  if (framing || !installs.length) return;
  framing = true;
  if (document.hidden) {
    document.addEventListener('visibilitychange', () => ((framing = false), pump()), { once: true });
    return;
  }
  const run = () => {
    framing = false;
    if (document.hidden) return pump();
    installs.shift()?.();
    pump();
  };
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run);
  else setTimeout(run, 16);
}

/** Queue an install; each runs whole, alone in its frame. */
const enqueue = (job: () => void): void => {
  installs.push(job);
  pump();
};

// ── manifest check ───────────────────────────────────────────────────────────────────────────────

const pageId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/** The one manifest URL: fixed name next to this entry, a query unique to this page load. Never ?v=, never hashed. */
export const manifestUrl = (id: string = pageId): string => {
  const url = new URL('magic-card-manifest.js', import.meta.url);
  url.search = '?r=' + id;
  return url.href;
};

let manifestOn = true;
let loadManifest = (url: string): Promise<{ default?: { build?: string } }> => import(/* webpackIgnore: true */ url);
let manifest: Promise<boolean> | undefined;

/** True when the release manifest names another build than this entry: one import per page, memoised. */
const otherRelease = (): Promise<boolean> =>
  (manifest ??= manifestOn
    ? Promise.race([loadManifest(manifestUrl()).then((m) => !!m?.default?.build && m.default.build !== BUILD_VERSION, () => false), sleep(TIMING.timeout).then(() => false)])
    : Promise.resolve(false));

/** Tests: switch the manifest check on with a fake import (no arguments: off, memo forgotten). */
export function __manifestForTests(on = false, fn?: typeof loadManifest): void {
  manifestOn = on;
  manifest = undefined;
  if (fn) loadManifest = fn;
}

// ── styles adoption ──────────────────────────────────────────────────────────────────

const hosts = new Set<LitElement>();
let sheets: CSSResultOrNative[] = [];
const flat = (s: CSSResultGroup): CSSResultOrNative[] => (Array.isArray(s) ? s.flatMap(flat) : [s as CSSResultOrNative]);

const sheetOf = (s: CSSResultOrNative): CSSStyleSheet => (s instanceof CSSStyleSheet ? s : (s.styleSheet as CSSStyleSheet));

/**
 * Give one card the sheets adopted so far: its class (cards made later) and its shadow root (this one), same task.
 * Without adoptedStyleSheets (below the browser floor, Chromium 85 and Safari 16.4) the root is left alone; no
 * `<style>` fallback is inserted.
 */
function catchUp(el: LitElement): void {
  const cls = el.constructor as typeof LitElement;
  const fresh = sheets.filter((s) => !cls.elementStyles.includes(s));
  if (fresh.length) cls.elementStyles = [...cls.elementStyles, ...fresh];
  const root = el.renderRoot as ShadowRoot | undefined;
  if (!root || !supportsAdoptingStyleSheets) return;
  const miss = sheets.map(sheetOf).filter((s) => !root.adoptedStyleSheets.includes(s));
  // a new array every time: adoptedStyleSheets is frozen on Chromium 85, push() throws
  if (miss.length) root.adoptedStyleSheets = [...root.adoptedStyleSheets, ...miss];
}

/** A connected card: it gets every chunk's styles now and later. Call after super.connectedCallback() (the render root exists). */
export function trackHost(el: LitElement): void {
  hosts.add(el);
  catchUp(el);
}
export const untrackHost = (el: LitElement): void => void hosts.delete(el);

function adopt(styles: CSSResultGroup): void {
  sheets = [...sheets, ...flat(styles)];
  hosts.forEach(catchUp);
}

// ── the chunk ────────────────────────────────────────────────────────────────────────────────────

/** silent: a quiet chunk; a failure shows no notice and stays out of failedChunkNames(), the retries are the same. */
export function lazyChunk<M extends LazyChunkModule = LazyChunkModule>(
  name: LazyChunkName | OnDemandChunkName | EditorLazyChunkName,
  realImporter: LazyImporter<M>,
  options: { silent?: boolean } = {},
): LazyChunkControl<M> {
  // every chunk file is dist/magic-card-<name>.js (LAZY_CHUNK_FILES, EDITOR_LAZY_CHUNK_FILES)
  const file = `magic-card-${name}.js`;
  let importer = realImporter;
  let state: 'idle' | 'loading' | 'ready' | 'failed' = 'idle';
  let why: LazyChunkFailure | undefined;
  let mod: LazyChunkModule | undefined;
  let pending: Promise<boolean> | undefined;
  let busy: Promise<boolean> | undefined;
  let waiting = new Set<() => void>();
  let generation = 0;
  let last: unknown;

  const stop = (g: number, kind: LazyChunkFailure, message: string, err?: unknown): false => {
    if (g !== generation) return false;
    state = 'failed';
    why = kind;
    if (!options.silent) everFailed.add(name);
    console.warn(message, ...(err === undefined ? [] : [err]));
    notifyChunks();
    return false;
  };

  const stale = (g: number, other: string): false => stop(g, 'mismatch', `Magic Card was updated, reload the page (magic-card.js ${BUILD_VERSION}, ${file} ${other}).`);

  /** Check, install, adopt the styles, then run the whenReady callbacks. A late success (after a timeout) comes through here too. */
  const install = (g: number, m: LazyChunkModule): boolean => {
    if (g !== generation) return false;
    if (state === 'ready') return true;
    if (m?.BUILD !== BUILD_VERSION) return stale(g, String(m?.BUILD));
    try {
      m.install();
      if ('styles' in m && m.styles) adopt(m.styles);
    } catch (err) {
      last = err;
      return false;
    }
    mod = m;
    state = 'ready';
    why = undefined;
    pending = Promise.resolve(true);
    const callbacks = [...waiting];
    waiting.clear();
    for (const cb of callbacks) {
      try {
        cb();
      } catch (err) {
        console.warn(`Magic Card: a ${file} callback failed`, err);
      }
    }
    // only a chunk that had failed has a notice to clear; a first-time success needs no second render
    if (everFailed.has(name)) notifyChunks();
    return true;
  };

  /**
   * One attempt: the import, 10 s at most from the moment it starts; the first attempt waits for idle first. The timeout is
   * cleared when the module arrives, before it waits for its frame to install. A timeout is a failure, but a later success still installs.
   */
  const attempt = (g: number, again: boolean): Promise<boolean> =>
    new Promise<boolean>((done) => {
      void (again ? Promise.resolve() : idle()).then(() => {
        const timeout = setTimeout(() => done(false), TIMING.timeout);
        request(importer, again).then(
          (m) => (clearTimeout(timeout), enqueue(() => done(install(g, m)))),
          (err: unknown) => ((last = err), clearTimeout(timeout), done(false)),
        );
      });
    });

  /** An extra attempt from the failed state (the retry list or the button); one at a time. */
  const extra = (): Promise<boolean> => {
    const g = generation;
    return (busy ??= attempt(g, true).then((ok) => {
      busy = undefined;
      if (g === generation && !ok && state === 'failed') notifyChunks();
      return ok;
    }));
  };

  // state after an await: a late success may have changed it
  const now = () => state;

  /**
   * The first attempt, then the retries on one delay list: the silent retry, then the background ones. The promise
   * settles false at the first failure, while the later retries go on; a late success or a build mismatch ends them.
   */
  const first = (g: number): Promise<boolean> =>
    new Promise<boolean>((settle) => {
      void (async () => {
        let ok = await attempt(g, false);
        // another release next to this entry cannot be fixed by retrying: say so at once
        if (!ok && g === generation && now() === 'loading' && (await otherRelease())) stale(g, 'manifest');
        const delays = [TIMING.silent, ...TIMING.background];
        for (let i = 0; !ok && g === generation && now() !== 'ready' && why !== 'mismatch' && i < delays.length; i++) {
          await sleep(delays[i]);
          if (g !== generation || now() === 'ready') break;
          ok = await extra();
          if (!ok && now() === 'loading') stop(g, 'load', `Magic Card: ${file} did not load`, last);
          settle(ok);
        }
        settle(ok || now() === 'ready');
      })();
    });

  const load = (): Promise<boolean> => {
    if (!pending) {
      state = 'loading';
      pending = first(generation);
    }
    return pending;
  };

  return {
    name,
    load,
    ready: () => state === 'ready',
    failed: () => state === 'failed',
    failure: () => (state === 'failed' ? why : undefined),
    retry() {
      if (state === 'idle' || state === 'loading') return load();
      return state === 'failed' && why === 'load' ? extra() : Promise.resolve(state === 'ready');
    },
    whenReady(cb) {
      if (state === 'ready') cb();
      else waiting.add(cb);
    },
    module: () => mod as M | undefined,
    __reset(next) {
      generation++;
      importer = next ?? realImporter;
      pending = busy = mod = why = undefined;
      state = 'idle';
      waiting = new Set();
      everFailed.delete(name);
    },
  };
}
