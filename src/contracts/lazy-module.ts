import type { TemplateResult } from 'lit';
import type { CardModule, HomeAssistant } from '../types';
import type { MagicModule } from '../modules/module-types';

/*
 * Contract: lazy modules and lazy card chunks. Version 1.3.0 (Architect-owned). ADR 0024.
 * Epic D (brief 23-product-manager.md): swiper, the seasonal decoration set, `marked` + markdown and
 * the rarely used modules leave magic-card.js. One mechanism: lazy entries in the module registry,
 * plus the same chunk helper for the seasonal elements (the existing loader pattern).
 * 1.1.0 (2026-10-19, additive; svg-and-shape-editors fix round 1, QA): the six older chunks without
 * install() also carry BUILD and their loaders refuse a mismatch through sameBuild() (section
 * "Build-checked older chunks", SAME_BUILD_CHUNK_FILES, SameBuildModule). The four lazyChunk() chunks
 * are unchanged.
 * 2026-10-19 (text only, version unchanged; code review 153): the typing sentence in "Build-checked
 * older chunks" now says which loaders still cast instead of claiming that none do.
 * 1.2.0 (2026-10-19, additive; flow-slider-styles T1): LazyChunkName gains 'flow-look' and 'slider-look'
 * (dist/magic-card-flow-look.js, dist/magic-card-slider-look.js). They serve no module type: each fills a
 * slot from install() (src/card/flow-look-slot.ts, src/modules/controls/slider-look-slot.ts; contracts
 * flow-look 1.0.0 and slider-look 1.0.0). prefetchLazy() loads flow-look when a `flows` entry has a look
 * key (hasFlowLook) and slider-look when a `slider` module has one (hasSliderLook); same walk rules
 * (nested children yes, `card_config` no). The background-layers run also claims 1.2.0 (chunk 'layers'):
 * the second branch to merge renumbers to 1.3.0 and merges both lines here.
 * 1.2.0 (2026-10-19, additive; background-layers, ADR 0038, bg-stack 1.0.0): chunk 'layers'
 * (magic-card-layers.js, entry src/layers/stack/chunk.ts) defines <mc-bg-stack>; it serves no module
 * type, like 'seasonal'. Prefetch: when the config has a non-empty card `background_layers` (also in
 * a conditional_appearance override); loaded on demand when the card renders <mc-bg-stack>.
 * 1.2.0 r2 (2026-10-20, CEO size ruling, folded in: not merged anywhere yet): (a) the 'layers' chunk
 *   also carries the layer-placement runtime (arrange, scanFills, layer CSS) and fills the layer slot
 *   (layer-placement 1.0.0 r3); it is prefetched when the config has any layered module too
 *   (hasLayers), and its ceiling rises to 24 KiB. (b) New section "Editor-side chunks": chunk
 *   'layer-editor' (magic-card-layer-editor.js, layer-editor 1.0.0), loaded by the editor chunk.
 * 1.3.0 (2026-10-20, combined beta merge of flow-slider-styles and background-layers; additive): both branches claimed
 * 1.2.0; background-layers merged second and renumbers to 1.3.0, all chunks kept: flow-look, slider-look, layers (card
 * side); look-editor (magic-card-look-editor.js, contract look-editor 1.0.0, loaded by src/editor/look-editor-loader.ts,
 * its own loader, not in LazyChunkName) and layer-editor (editor side).
 *
 * ── Core (magic-card.js) ──
 * - src/utils/lazy-chunk.ts: `lazyChunk(file, importer): LazyChunk`, the one helper every chunk below
 *   goes through. load() is memoised; it imports the chunk, checks `BUILD === __MC_BUILD_VERSION__`
 *   (VERSION in tests) and only then calls `install()`. Import rejection or a BUILD mismatch: one
 *   console.warn per chunk ("Magic Card: <file> did not load" / "Magic Card was updated, reload the
 *   page (magic-card.js X, <file> Y)"), resolves false, never retries until the page reloads
 *   (particles pattern, not the editor's retry). ready() never starts a load. whenReady(cb) runs cb
 *   once after a successful load (dropped on failure).
 * - src/utils/lazy-chunks.ts: the chunk table, one `lazyChunk()` per LazyChunkName, each with its
 *   literal `import(/* webpackChunkName: "<name>" *\/ '<entry>')`. Nothing else calls import() for
 *   these entries.
 * - src/modules/module-registry.ts: `registerLazy(stub, chunk)`, `provideView(type, view)`,
 *   `prefetch(config)`, `isReady(type)`. get / getAll / has / search / createDefault /
 *   getMetadata are unchanged and include lazy entries from module evaluation on (AC7, AC8).
 * - window.MagicCard.loadSeasonal: `() => Promise<boolean>`, additive (apiVersion stays 1); the
 *   animation studio calls it before it shows a seasonal preset (it uses <mc-seasonal> by tag).
 *
 * ── (1.1.0) Build-checked older chunks ──
 * The chunks in SAME_BUILD_CHUNK_FILES predate lazyChunk() and keep their own loaders and their own
 * export surface (no install()). Each entry exports BUILD (src/utils/build-version.ts BUILD_VERSION;
 * theme-presets its own PRESETS_BUILD, because the theme editor entry may not import src/utils). Each
 * loader passes the imported entry through `sameBuild(file, mod)` (src/utils/build-version.ts,
 * re-exported by lazy-chunk.ts) before it uses any export: BUILD equal -> the module; otherwise one
 * console.warn with the same "Magic Card was updated, reload the page (...)" text, no export is used
 * or handed on, and the loader returns its own failure value (shape-custom false; anim-runtime,
 * particles and both preset-catalogue loaders undefined; icon-library and theme-presets reject). No
 * retry until the page reloads. The theme-presets loader (src/theme-editor/presets/loader.ts) may not
 * import src/utils either, so it compares BUILD with PRESETS_BUILD itself, with the same warning text.
 * Side effects at evaluation are not covered by this guard (the anim-runtime entry imports compile-v2
 * for its registration); the AC13 rule below applies to new chunks, these six keep their current
 * evaluation behaviour. Typing: the entries are E & SameBuildModule, E being that entry's exports:
 * PresetCatalogueModule (preset-catalogue 1.x), src/particles/index.ts (its `particles` is
 * ParticlesModule, particles-v2), src/anim-runtime/index.ts, src/utils/shape-custom.ts,
 * src/anim-studio/icon-library-chunk.ts and src/theme-editor/presets/chunk.ts. The anim-runtime,
 * particles, shape-custom and icon-library loaders call sameBuild() without a cast. Some loaders still
 * cast: both preset-catalogue loaders cast the result to `PresetCatalogueModule | undefined`
 * (src/editor/components/preset-catalogue-loader.ts also casts the argument to `{ BUILD?: string }`),
 * and the theme-presets loader reads BUILD through `{ BUILD?: string }`. Those casts are allowed;
 * typing the imports so they can go is a cleanup, not a contract change.
 *
 * ── Chunk entries ──
 * Each chunk entry module exports LazyChunkModule and nothing runs at evaluation that changes
 * global state: no customElements.define, no @customElement decorator, no ModuleRegistry call, no
 * marked.setOptions at module top level, in the entry or in any file only the chunk contains. All of
 * that happens in install(). Reason (AC13): the server ignores the `?v=<contenthash>` query, so an
 * old cached magic-card.js can receive a newer chunk for the old URL; evaluating it must be
 * harmless, and install() is never called on a mismatch.
 *
 * ── Rendering rules (registry wrapper around a LazyModuleStub) ──
 * 1. View provided: `view.renderPreview(config, hass)`, same output as before the split (AC6).
 * 2. No view, stub has its own renderPreview (element kind, e.g. slider-layout): render it now and
 *    start the chunk load; the chunk defines the elements, which upgrade in place.
 * 3. No view, chunk not failed: start the load, add currentRenderContext()?.requestUpdate to
 *    chunk.whenReady (once per callback), return stub.placeholder(config, 'pending').
 * 4. Chunk failed: stub.placeholder(config, 'failed'): same box, no text, no busy state (AC10).
 * Validation (validate, hints), getDependencies, createDefault, migrate and metadata are on the
 * stub and stay synchronous. renderModuleContent and every other caller keep using MagicModule.
 *
 * ── Prefetch (AC3, AC4, AC11) ──
 * MagicCard.setConfig and the template merge call ModuleRegistry.prefetch(config): one walk over the
 * config (the collectDependencies walk: nested layout children included, `card_config` subtrees
 * skipped), collecting module `type`s with a lazy entry, and load() of each needed chunk at once, so
 * nested lazy modules never wait on their parent (no waterfall). The seasonal chunk is prefetched
 * when the config has a `seasonal` setting or a seasonal animation preset, and loaded on demand by
 * card-decorations.ts whenever it renders <mc-seasonal> / <mc-seasonal-deco>. (1.2.0) The layers
 * chunk likewise for `background_layers` and <mc-bg-stack>; (r2) also for any module with a
 * placement other than flow (hasLayers, in magic-card.js), and on demand when a render meets one.
 *
 * ── Editors ──
 * The editor chunk, the studio and the theme editor never import a *-view.ts file or a chunk entry
 * (that would copy the code into their chunk, AC2). Module editors import constants and helpers from
 * the stub files (src/modules/** /*-module.ts) or from sync utils. (r2) They never import
 * src/layers/placement.ts, src/layers/layer-css.ts or src/layers/stack/**: those are chunk-only; the
 * editor reads the layer slot (src/layers/layer-slot.ts, in magic-card.js) when it needs arrange().
 *
 * ── (r2) Editor-side chunks ──
 * Chunks that only an editor loads. Their loader lives in the editor chunk, calls the same
 * lazyChunk() helper (shared from magic-card.js) with its own literal import(), and the "Chunk
 * entries" rule above applies (BUILD + install(); elements defined in install(), no @customElement at
 * module level). They are not in LazyChunkName (magic-card.js never names them).
 * - 'layer-editor' -> magic-card-layer-editor.js, entry src/editor/layers/chunk.ts, loader
 *   src/editor/layers/layer-editor-loader.ts `loadLayerEditor(): Promise<boolean>`. Contract
 *   layer-editor 1.0.0.
 * - 'look-editor' -> magic-card-look-editor.js (flow-slider-styles), loader src/editor/look-editor-loader.ts. Contract
 *   look-editor 1.0.0. It keeps its own loader and is not in EditorLazyChunkName.
 *
 * ── Tests ──
 * `__setLazyImporterForTests(name, importer | undefined)` replaces one chunk import and forgets its
 * state; `__loadAllLazyChunksForTests()` loads and installs every chunk (vitest setup, so existing
 * renderPreview tests keep their synchronous output). (r2) The editor test setup also awaits
 * loadLayerEditor().
 */

export const LAZY_MODULE_CONTRACT = '1.3.0';
export const LAZY_MODULE_CONTRACT_REVISION = 1;

/** webpackChunkName of each chunk; the file is dist/magic-card-<name>.js. */
export type LazyChunkName = 'slider' | 'seasonal' | 'markdown' | 'modules-extra' | 'flow-look' | 'slider-look' | 'layers';

export const LAZY_CHUNK_FILES: Record<LazyChunkName, string> = {
  slider: 'magic-card-slider.js',
  seasonal: 'magic-card-seasonal.js',
  markdown: 'magic-card-markdown.js',
  'modules-extra': 'magic-card-modules-extra.js',
  'flow-look': 'magic-card-flow-look.js',
  'slider-look': 'magic-card-slider-look.js',
  layers: 'magic-card-layers.js',
};

/**
 * Sanity ceilings (B, minified). The CAPS entry is measured + 5 % rounded up to 1 KiB; a measured
 * size over its ceiling means a magic-card.js module (Lit, registry, utils, shape-path) was copied
 * into the chunk. Report it, do not raise the ceiling.
 */
export const LAZY_CHUNK_CEILINGS: Record<LazyChunkName, number> = {
  slider: 122_880,
  seasonal: 81_920,
  markdown: 57_344,
  'modules-extra': 45_056,
  'flow-look': 32_768,
  'slider-look': 28_672,
  /** r2: stack (15.3 KiB measured) + placement runtime and layer CSS (about 5-6 KiB). */
  layers: 24_576,
};

/** Which module types each chunk serves (seasonal, flow-look, slider-look and layers serve no module type). */
export const LAZY_MODULE_TYPES: Record<Exclude<LazyChunkName, 'seasonal' | 'flow-look' | 'slider-look' | 'layers'>, readonly string[]> = {
  slider: ['slider-layout'],
  markdown: ['markdown'],
  'modules-extra': ['camera', 'video-bg', 'weather', 'forecast', 'graphs', 'custom-card'],
};

/** (r2) Chunks only an editor loads (section "Editor-side chunks"). */
export type EditorLazyChunkName = 'layer-editor';

export const EDITOR_LAZY_CHUNK_FILES: Record<EditorLazyChunkName, string> = {
  'layer-editor': 'magic-card-layer-editor.js',
};

/** (r2) Same meaning as LAZY_CHUNK_CEILINGS; the cap is measured + 5 % (CEO sets it at the ratchet). */
export const EDITOR_LAZY_CHUNK_CEILINGS: Record<EditorLazyChunkName, number> = {
  /** Panels about 75 KB + layer-editor i18n tables (en-GB ids, en-US, nl) about 20 KB. */
  'layer-editor': 114_688,
};

/** What every chunk entry exports. */
export interface LazyChunkModule {
  /** __MC_BUILD_VERSION__ of the build that made this chunk. */
  readonly BUILD: string;
  /** Define elements, provide views, set library options. Called once, only when BUILD matches. */
  install(): void;
}

/** (1.1.0) The older chunks guarded by sameBuild() instead of lazyChunk() (dist file names). */
export const SAME_BUILD_CHUNK_FILES = [
  'magic-card-shape-custom.js',
  'magic-card-anim-runtime.js',
  'magic-card-particles.js',
  'magic-card-preset-catalogue.js',
  'magic-card-icon-library.js',
  'magic-card-theme-presets.js',
] as const;
export type SameBuildChunkFile = (typeof SAME_BUILD_CHUNK_FILES)[number];

/** (1.1.0) What every SAME_BUILD_CHUNK_FILES entry exports besides its own surface. */
export interface SameBuildModule {
  /** __MC_BUILD_VERSION__ of the build that made this chunk (theme-presets: PRESETS_BUILD). */
  readonly BUILD: string;
}

/** One lazily loaded chunk (src/utils/lazy-chunk.ts). */
export interface LazyChunk {
  readonly name: LazyChunkName | EditorLazyChunkName;
  /** Memoised; true once installed, false (one warning, no retry) on failure or BUILD mismatch. */
  load(): Promise<boolean>;
  /** Installed; never starts a load. */
  ready(): boolean;
  /** The load ended in failure. */
  failed(): boolean;
  /** Run cb once after a successful install (never on failure). */
  whenReady(cb: () => void): void;
}

/** The heavy half of a module, provided by its chunk's install(). */
export interface ModuleView {
  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult;
}

/**
 * The synchronous half of a lazy module, registered from magic-card.js. Everything a MagicModule
 * has, with renderPreview optional (present only for the element kind) and a placeholder.
 */
export interface LazyModuleStub extends Omit<MagicModule, 'renderPreview'> {
  renderPreview?: MagicModule['renderPreview'];
  /**
   * The module's box before its view exists: same outer classes and, where the config fixes it,
   * the same size (camera aspect ratio, graph height, forecast skeleton). 'failed': no text.
   */
  placeholder(config: CardModule, state: 'pending' | 'failed'): TemplateResult;
}
