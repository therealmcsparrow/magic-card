import type { CSSResultGroup, TemplateResult } from 'lit';
import type { CardModule, HomeAssistant } from '../types';
import type { MagicModule } from '../modules/module-types';

/*
 * Contract: lazy modules and lazy card chunks. Version 1.4.0.
 * Swiper, the seasonal decoration set, `marked` + markdown and the rarely used modules leave
 * magic-card.js. One mechanism: lazy entries in the module registry, plus the same chunk helper for the
 * seasonal elements (the existing loader pattern).
 * - The six older chunks without install() also carry BUILD and their loaders refuse a mismatch through
 *   sameBuild() (section "Build-checked older chunks", SAME_BUILD_CHUNK_FILES, SameBuildModule). The four
 *   lazyChunk() chunks of that group are unchanged.
 * - LazyChunkName includes 'flow-look' and 'slider-look' (dist/magic-card-flow-look.js,
 *   dist/magic-card-slider-look.js). They serve no module type: each fills a slot from install()
 *   (src/card/flow-look-slot.ts, src/modules/controls/slider-look-slot.ts; contracts flow-look 1.0.0 and
 *   slider-look 1.0.0). prefetchLazy() loads flow-look when a `flows` entry has a look key (hasFlowLook)
 *   and slider-look when a `slider` module has one (hasSliderLook); same walk rules (nested children yes,
 *   `card_config` no).
 * - Chunk 'layers' (magic-card-layers.js, entry src/layers/stack/chunk.ts, bg-stack 1.0.0) defines
 *   <mc-bg-stack>; it serves no module type, like 'seasonal'. Prefetch: when the config has a non-empty
 *   card `background_layers` (also in a conditional_appearance override); loaded on demand when the card
 *   renders <mc-bg-stack>. It also carries the layer-placement runtime (arrange, scanFills, layer CSS) and
 *   fills the layer slot (layer-placement 1.0.0); it is prefetched when the config has any layered module
 *   too (hasLayers), and its ceiling is 24 KiB.
 * - Section "Editor-side chunks": chunk 'layer-editor' (magic-card-layer-editor.js, layer-editor 1.0.0),
 *   loaded by the editor chunk, and 'look-editor' (magic-card-look-editor.js, contract look-editor 1.0.0,
 *   loaded by src/editor/look-editor-loader.ts, its own loader, not in LazyChunkName).
 * - Needs table, config-walk, styles adoption, timeout, retry and failure notice (sections after "Tests"):
 *   the anim-runtime, particles and shape-custom loaders go through lazyChunk(). whenReady callbacks
 *   survive a failure. OnDemandChunkName and the notice element are described in sections "Failure, retry
 *   and timeout" and "import() sites". A request that never settles is waited on, never replaced; the
 *   on-demand loader slots are the seam between a loader and the chunk table.
 * - LazyChunkName includes 'controls' (dist/magic-card-controls.js, ceiling 61,440 B, chunk entry
 *   src/modules/lazy/controls-chunk.ts). It holds the views of the slider, spinbox, dropdown, light and gauge
 *   modules (src/modules/controls/*-view.ts); their stubs (metadata, defaults, validation and a placeholder
 *   that reserves the default height, src/modules/controls/controls.needs.ts) stay in Core. Its needs() is the
 *   presence of one of those module types. The tabs view is in 'modules-extra' (ceiling 53,248 B). The chunk
 *   is the parent of 'slider-look' (the literal import() sits in controls-chunk.ts), so its load() loads
 *   'controls' first. The editor imports no stub or view: climateRange, supportsEffect and the dropdown
 *   option helpers are in small pure files (spinbox-range, light-effect, dropdown-options).
 * - LazyChunkName includes 'anim' (dist/magic-card-anim.js, ceiling 90,112 B, chunk entry
 *   src/anim-studio/anim-chunk.ts). It holds the animation resolve (src/anim-studio/resolve.ts), the
 *   document compiler and model it calls (compile, model, model-v2-core, css-keyframes), the
 *   custom-animation stylesheet, the sequence player, the preset table (src/utils/animation-presets.ts)
 *   and the preset keyframe and particle tables (src/css/animation-keyframes.ts, animation-scenes.ts,
 *   animation-extra.ts), and exports the preset keyframes and animation rules as `styles`. It defines no
 *   element and fills no slot: the card reads the module through lazyChunks.anim.module() and draws a plain card until it has installed. Its
 *   needs() is hasAnimations (src/utils/animation.needs.ts): a non-empty `animations` list or the legacy
 *   `animation_preset`, on any design the config walk reaches (card, rows, columns, modules, `hover`,
 *   `conditional[].design`, conditional_appearance rules). The hook points of the compiler stay in Core
 *   (src/utils/anim-hooks.ts).
 * - LazyChunkName includes 'svg-icon' (dist/magic-card-svg-icon.js, ceiling 65,536 B, chunk entry
 *   src/icons/chunk.ts). It holds the icon source (packs, the `mcu:` library client, own SVG),
 *   <mc-svg-icon> and the SVG sanitiser. Its needs() is src/icons/needs.ts (`custom_icons`, `icon_fx`,
 *   `svg`, any icon reference that is not a plain MDI id). A plain icon never loads it: renderIcon keeps
 *   <ha-icon>, no request. RenderContext has the optional `metChunk(name)`: a render that meets a feature
 *   whose chunk is not ready (a predicate miss, backstop rule 3) tells the card, which then shows that
 *   chunk's failure notice if it fails. metChunk takes a LazyChunkName or OnDemandChunkName.
 * - LazyChunkName includes 'flows' (dist/magic-card-flows.js, ceiling 57,344 B, chunk entry src/card/flows-chunk.ts).
 *   It holds the flow resolver (src/utils/flow.ts, with the key helpers of src/utils/flow-keys.ts, which the editor also uses), the line geometry and motion, <mc-flows> (defined in install())
 *   and the card-side flow rules (`styles`); the card reads `api.resolveCardFlows` through lazyChunks.flows.module()
 *   (src/card/flows-seam.ts). Its needs() is hasFlows (src/utils/flows.needs.ts). The card marks its content
 *   `data-mc-flows` from the config and draws no overlay until the chunk has installed; the overlay is absolutely
 *   positioned, so a late line moves nothing. 'flow-look' is a child of 'flows' (its literal import() sits in
 *   src/card/flows-chunk.ts), so its load() loads 'flows' first.
 * - LazyChunkName includes 'pause' (dist/magic-card-pause.js, ceiling 16,384 B, chunk entry src/card/pause-chunk.ts). It holds
 *   the CardPause class (state, remembered pause, button) and the button rules (`styles`); the card creates one through
 *   `api.create` (src/card/pause-seam.ts). Its needs() is wantsPause (src/contracts/card-pause.needs.ts). The 24 px strip
 *   the button sits in follows the config (`data-mc-pause-gap`, plain sheet), not the chunk, so installing it moves nothing.
 *   The offscreen observer hooks (src/icons/offscreen.ts) stay in the card bundle.
 * - LazyChunkName includes 'popup' (dist/magic-card-popup.js, ceiling 20,480 B, chunk entry src/card/popup-chunk.ts). It holds
 *   the PopupController (open and close, dialog, focus, history, triggers, swipe), the page's one PopupCoordinator (no other
 *   bundle may hold a copy, so the editor reaches it only through the chunk `api`: knownIds, preview, closeOpen) and the
 *   pop-up rules (`styles`). The card and the editor read the chunk through src/card/popup-seam.ts; its needs() is wantsPopup
 *   (src/utils/popup.ts). What must hold before the chunk loads stays in the entry and follows the config alone: whether
 *   the card is a hidden pop-up (popupHidden, `data-mc-popup-hidden`, `data-mc-popup-editor` and their host rules in the plain sheet, the taken-out-of-flow styles of the
 *   card, hui-card and grid cell: src/card/popup-nav.ts), so a pop-up card never shows in the layout early and installing
 *   the chunk moves nothing. navigateToPopup and the PopupHandle types are in popup-nav.ts too. The controller attaches
 *   after the install and opens a pop-up whose #id is already in the URL, without a history entry.
 * - `anim` is the parent chunk of 'anim-runtime', 'particles' and the editor chunk (their literal
 *   import()s sit in src/anim-studio/anim-chunk.ts), so webpack leaves the modules `anim` holds out of
 *   them. Chunk entries may export `api` for the one copy of their stateful modules: svg-icon (icon
 *   geometry, read by the editor through svgIconApi()) and seasonal (CardSeasonal, SeasonalBudget,
 *   sceneDecorations, sceneFlashes, seasonalSeed, seasonalPreviewDate, setSeasonalPreviewDate).
 *
 * ── Core (magic-card.js) ──
 * - src/utils/lazy-chunk.ts: `lazyChunk(file, importer): LazyChunk`, the one helper every chunk below
 *   goes through. load() is memoised; it imports the chunk, checks `BUILD === __MC_BUILD_VERSION__`
 *   (VERSION in tests) and only then calls `install()`. Import rejection or a BUILD mismatch: one
 *   console.warn per chunk ("Magic Card: <file> did not load" / "Magic Card was updated, reload the
 *   page (magic-card.js X, <file> Y)"), resolves false. (A load error is retried, see "Failure, retry
 *   and timeout"; a BUILD mismatch never is.) ready() never starts a load. whenReady(cb) runs cb once
 *   after a successful load (kept through a failure, so a later success still runs it).
 * - src/utils/lazy-chunks.ts: the chunk table, one `lazyChunk()` per LazyChunkName, each with its
 *   literal `import(/* webpackChunkName: "<name>" *\/ '<entry>')`. Nothing else calls import() for
 *   these entries (except the children of `anim`, section "import() sites").
 * - src/modules/module-registry.ts: `registerLazy(stub, chunk)`, `provideView(type, view)`,
 *   `prefetch(config)`, `isReady(type)`. get / getAll / has / search / createDefault /
 *   getMetadata are unchanged and include lazy entries from module evaluation on.
 * - window.MagicCard.loadSeasonal: `() => Promise<boolean>`, additive (apiVersion stays 1); the
 *   animation studio calls it before it shows a seasonal preset (it uses <mc-seasonal> by tag).
 *
 * ── Build-checked older chunks ──
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
 * for its registration); the "Chunk entries" rule below applies to new chunks, these six keep their current
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
 * that happens in install(). Reason: a cached magic-card.js of another release can still load a
 * chunk file next to it (the files of older releases stay on disk); evaluating it must be
 * harmless, and install() is never called on a mismatch.
 *
 * ── Rendering rules (registry wrapper around a LazyModuleStub) ──
 * 1. View provided: `view.renderPreview(config, hass)`, same output as before the split.
 * 2. No view, stub has its own renderPreview (element kind, e.g. slider-layout): render it now and
 *    start the chunk load; the chunk defines the elements, which upgrade in place.
 * 3. No view, chunk not failed: start the load, add currentRenderContext()?.requestUpdate to
 *    chunk.whenReady (once per callback), return stub.placeholder(config, 'pending').
 * 4. Chunk failed: stub.placeholder(config, 'failed'): same box, no text, no busy state.
 *    (The failed box holds the failure notice, see "Failure, retry and timeout".)
 * Validation (validate, hints), getDependencies, createDefault, migrate and metadata are on the
 * stub and stay synchronous. renderModuleContent and every other caller keep using MagicModule.
 *
 * ── Prefetch ──
 * MagicCard.setConfig and the template merge call ModuleRegistry.prefetch(config): one walk over the
 * config (the collectDependencies walk: nested layout children included, `card_config` subtrees
 * skipped), collecting module `type`s with a lazy entry, and load() of each needed chunk at once, so
 * nested lazy modules never wait on their parent (no waterfall). The seasonal chunk is prefetched
 * when the config has a `seasonal` setting or a seasonal animation preset, and loaded on demand by
 * card-decorations.ts whenever it renders <mc-seasonal> / <mc-seasonal-deco>. The layers
 * chunk likewise for `background_layers` and <mc-bg-stack>, also for any module with a
 * placement other than flow (hasLayers, in magic-card.js), and on demand when a render meets one.
 * (The needs table decides this, see "needs(config)".)
 *
 * ── Editors ──
 * The editor chunk, the studio and the theme editor never import a *-view.ts file or a chunk entry
 * (that would copy the code into their chunk). Module editors import constants and helpers from
 * the stub files (src/modules/** /*-module.ts) or from sync utils. They never import
 * src/layers/placement.ts, src/layers/layer-css.ts or src/layers/stack/**: those are chunk-only; the
 * editor reads the layer slot (src/layers/layer-slot.ts, in magic-card.js) when it needs arrange().
 *
 * ── Editor-side chunks ──
 * Chunks that only an editor loads. Their loader lives in the editor chunk, calls the same
 * lazyChunk() helper (shared from magic-card.js) with its own literal import(), and the "Chunk
 * entries" rule above applies (BUILD + install(); elements defined in install(), no @customElement at
 * module level). They are not in LazyChunkName (magic-card.js never names them).
 * - 'layer-editor' -> magic-card-layer-editor.js, entry src/editor/layers/chunk.ts, loader
 *   src/editor/layers/layer-editor-loader.ts `loadLayerEditor(): Promise<boolean>`. Contract
 *   layer-editor 1.0.0.
 * - 'look-editor' -> magic-card-look-editor.js, loader src/editor/look-editor-loader.ts. Contract
 *   look-editor 1.0.0. It keeps its own loader and is not in EditorLazyChunkName.
 *
 * ── Tests ──
 * `__setLazyImporterForTests(name, importer | undefined)` replaces one chunk import and forgets its
 * state; `__loadAllLazyChunksForTests()` loads and installs every chunk (vitest setup, so existing
 * renderPreview tests keep their synchronous output). The editor test setup also awaits
 * loadLayerEditor().
 *
 * ══ Plain cards need no chunk; every feature declares needs(config) ══
 *
 * ── Plain and feature ──
 * The plain keys are listed in tools/plain-keys.json. A card that uses only those renders from magic-card.js with zero
 * chunk requests and no placeholder. Every other key belongs to exactly one LazyChunkName.
 *
 * ── needs(config) ──
 * - Every LazyChunkName has one LazyFeature in the needs table, src/utils/lazy-features.ts (Core):
 *   `LAZY_FEATURES: Record<LazyChunkName, LazyFeature>`. prefetchLazy(config) runs, for each
 *   feature whose needs(config) is true, load() at once, all in parallel (no waterfall). It runs in
 *   setConfig and after the template merge, once per config object (WeakSet, as today).
 * - needs() lives in a predicate file: `src/contracts/<contract>.needs.ts` for a contract-owned
 *   feature (flow-look.needs.ts, slider-look.needs.ts, card-pause.needs.ts, bg-stack.needs.ts,
 *   particles-v2.needs.ts, custom-shape.needs.ts, ...), or `src/<module>/needs.ts`. A predicate file
 *   has only `import type` imports, plus src/utils/config-walk.ts and other *.needs.ts files. It holds
 *   key lists and reserve numbers, never data tables, defaults, themes or renderers. The contract's
 *   data stays in `src/contracts/<contract>.ts`, which magic-card.js no longer imports at run time
 *   (type-only imports are fine). The entry-graph check (tools/check-entry-graph.mjs) enforces it.
 * - needs() is pure, synchronous and total: it never throws (malformed input -> false) and never reads
 *   hass, the DOM, the date or chunk state. Walk rules: src/utils/config-walk.ts, the
 *   collectDependencies walk (nested layout children yes, `card_config` no, the first 32
 *   conditional_appearance overrides yes), stopping at the first hit.
 * - Backstop: a render that meets a feature whose chunk is not ready calls load() and whenReady
 *   (rendering rule 3), so a predicate miss costs a late paint, never a blank. Under
 *   `__strictNeedsForTests(true)` that path throws instead, so every miss on the gallery is caught.
 *
 * ── Styles in the same frame ──
 * - A chunk entry may export `styles` (CSSResultGroup). Before whenReady callbacks run, Core adds those
 *   sheets to the card's sheet list and to the adoptedStyleSheets of every connected card, so the
 *   feature's CSS and its first render land in the same frame. Feature CSS lives only in its chunk;
 *   src/css/css.ts keeps the plain sheet. Adoption assigns a new array
 *   (`root.adoptedStyleSheets = [...root.adoptedStyleSheets, ...sheets]`), never push (frozen on Chromium
 *   85); connectedCallback adds sheets a card missed while disconnected. Same-frame adoption is verified on
 *   Chromium 85, Chrome and Firefox ESR; Safari 16.4 must be confirmed on a device, otherwise Core
 *   inserts a `<style>` element in the same task.
 *
 * ── Reserve ──
 * - A late slot reserves SlotReserve from config only (never runtime
 *   state). LazyModuleStub.placeholder() and the slot features (pause strip, seasonal insets) use
 *   `reserve(node)` from the predicate file. The reserve stays after the chunk installs.
 *
 * ── Failure, retry and timeout ──
 * - One attempt = the import() plus install(), timed out after CHUNK_TIMEOUT_MS (10 s). A timeout counts
 *   as a failure; the request may still finish, and a late success installs and clears the notice. A
 *   new attempt while that request is still in flight gets the same promise from webpack (no second
 *   request, so no `r=` number is used) with a fresh 10 s window: that is waiting, not a retry. Only an
 *   attempt that sends a request is a retry, and it carries an `r=<n>` not used before on the page
 *   (no URL is reused); the attempt after a stalled request has settled (the browser failed or abandoned it) sends one. With native
 *   import() chunk loading webpack has no chunk timeout of its own and keeps the in-flight promise until the request settles,
 *   so a request that never settles cannot be replaced on this page: background attempts and "Try again" keep waiting on it,
 *   and the "Reload page" button shown after a failed "Try again" is the way out (Core never touches webpack's
 *   private chunk state and adds no second import() of a chunk URL).
 * - A load error: one silent retry after SILENT_RETRY_MS (2 s) under a new URL (`r=<n>` appended, the
 *   theme-presets loader pattern: browsers cache a failed import() per URL). If that fails too, the
 *   chunk is 'failed' with failure() 'load' and every slot of it shows the notice. Then up to
 *   BACKGROUND_RETRY_MS.length (3) background attempts at +30 s, +90 s and +5 min, per chunk (the
 *   loader is shared, so 20 cards on one dashboard cause one request per attempt). A success removes
 *   every notice of that chunk. retry() (the "Try again" button) is one extra attempt at any time and
 *   does not reset the background count.
 * - Mismatch: when a load fails, Core imports the manifest once per page (`magic-card-manifest.js` with a
 *   new `r=` query, memoised). Its `build` differs from BUILD_VERSION, or a chunk's BUILD differs ->
 *   failure() 'mismatch': no silent or background retry, the notice shows the "Reload page" variant
 *   (location.reload()) at once. Manifest unreachable or equal build -> 'load'.
 * - Timing: the first notice appears 2 s after a fast failure (a 404) and about 22 s after two stalls.
 * - Strings: a short part-name table keyed by LazyChunkName (at most 8 names, fallback "Part of this
 *   card"), British ids through the card i18n namespace. The chunk name and key go to console.warn.
 * - While a slot of the card shows a notice, the host carries the `mc-fail` attribute; in that state ha-card
 *   is the scroll box and the layout-shift rule does not apply.
 * - The notice is a template, chunkNotice(chunk) (src/card/chunk-notice.ts, in magic-card.js), rendered in the card's own
 *   shadow root: a module slot whose chunk failed renders it after the stub's failed box; the card renders one per failed chunk its
 *   config needs (or its render met, for the on-demand chunks) as the last child of the card content. It exists
 *   only after a failure, so a plain or healthy card has none.
 *
 * ── File names and manifest ──
 * - Chunks: `magic-card-<name>.<contenthash:8>.js`; LAZY_CHUNK_FILES keeps the logical name
 *   (`magic-card-<name>.js`) used by caps, tests and messages. `dist/magic-card-manifest.js` exports
 *   default LazyChunkManifest. Entries keep fixed names.
 *
 * ── import() sites ──
 * - Card side: import() only in src/utils/lazy-chunks.ts (the chunk table), src/anim-studio/anim-chunk.ts and the manifest check in
 *   src/utils/lazy-chunk.ts. anim-runtime, particles and shape-custom go through lazyChunk(): their
 *   literal import() sits in the table too (src/utils/lazy-chunks.ts `onDemandChunks`, OnDemandChunkName),
 *   and the three loaders no longer call import(). The loaders do not import the table: it fills a slot in
 *   each of them (provideRuntimeChunk, provideParticlesChunk, provideShapeChunk). These slots are the seam where a loader asks for the chunk; src/utils/lazy-chunks.ts fills them once when it evaluates. An empty slot makes the load functions
 *   resolve false or undefined and never throw; only magic-card.js, which evaluates the table, may rely on a load. The animation studio bundle
 *   imports a loader, and the table would pull every card chunk entry into its chunk graph (the studio and
 *   several chunks grew by 8 to 60 KB when it did); a bundle without the table has no chunk and loads nothing.
 *   The literal import()s of 'anim-runtime', 'particles' and the editor chunk sit in src/anim-studio/anim-chunk.ts (importRuntime,
 *   importParticles, importEditor). The table's importers for 'anim-runtime' and 'particles' call them in the same synchronous call, so a
 *   retry's `r=` reaches the request, and they reject while `anim` is not installed; their loader slots load `anim` first and
 *   resolve false/undefined when it fails. src/utils/editor-loader.ts loads `anim` and `svg-icon` first, keeps its own retry, and is no
 *   longer an import() site. Editor side: the
 *   existing loaders (transfer, preset-catalogue, icon-animator, look-editor, layer-editor,
 *   icon-library, path-canvas, path-tools, svg-booleans, svg-editor, shape-editor, theme-presets,
 *   i18n tables) are registered sites. The ESLint rule (no-restricted-syntax ImportExpression with an
 *   override for the registered files) fails any other import(). Moving editor loaders onto
 *   lazyChunk() is debt.
 */

export const LAZY_MODULE_CONTRACT = '1.4.0';
export const LAZY_MODULE_CONTRACT_REVISION = 9;

/** webpackChunkName of each chunk; the file is dist/magic-card-<name>.js. */
export type LazyChunkName = 'slider' | 'seasonal' | 'markdown' | 'modules-extra' | 'controls' | 'flows' | 'pause' | 'popup' | 'flow-look' | 'slider-look' | 'layers' | 'svg-icon' | 'anim';

export const LAZY_CHUNK_FILES: Record<LazyChunkName, string> = {
  slider: 'magic-card-slider.js',
  seasonal: 'magic-card-seasonal.js',
  markdown: 'magic-card-markdown.js',
  'modules-extra': 'magic-card-modules-extra.js',
  flows: 'magic-card-flows.js',
  pause: 'magic-card-pause.js',
  popup: 'magic-card-popup.js',
  controls: 'magic-card-controls.js',
  'flow-look': 'magic-card-flow-look.js',
  'slider-look': 'magic-card-slider-look.js',
  layers: 'magic-card-layers.js',
  'svg-icon': 'magic-card-svg-icon.js',
  anim: 'magic-card-anim.js',
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
  'modules-extra': 53_248,
  /** The views of the slider, spinbox, dropdown, light and gauge modules and the code only they use. */
  controls: 61_440,
  /** The flow resolver, line geometry, <mc-flows> and its card rules. */
  flows: 57_344,
  /** The Pause motion button class and its rules. */
  pause: 16_384,
  /** The pop-up controller, the page's pop-up coordinator and the pop-up rules. */
  popup: 20_480,
  'flow-look': 32_768,
  'slider-look': 28_672,
  /** Stack (15.3 KiB measured) + placement runtime and layer CSS (about 5-6 KiB). */
  layers: 24_576,
  /** Icon source, <mc-svg-icon>, the SVG sanitiser and the `mcu:` library client (about 61 KiB raw measured before the move). */
  'svg-icon': 65_536,
  /** The resolve, compiler and model of the animations, the preset and keyframe tables and the animation rules (`styles`). */
  anim: 90_112,
};

/** Which module types each chunk serves (seasonal, flows, pause, popup, flow-look, slider-look and layers serve no module type). */
export const LAZY_MODULE_TYPES: Record<Exclude<LazyChunkName, 'seasonal' | 'flows' | 'pause' | 'popup' | 'flow-look' | 'slider-look' | 'layers' | 'svg-icon' | 'anim'>, readonly string[]> = {
  slider: ['slider-layout'],
  markdown: ['markdown'],
  'modules-extra': ['camera', 'video-bg', 'weather', 'forecast', 'graphs', 'custom-card', 'tabs'],
  controls: ['slider', 'spinbox', 'dropdown', 'light', 'gauge'],
};

/** Chunks only an editor loads (section "Editor-side chunks"). */
export type EditorLazyChunkName = 'layer-editor';

export const EDITOR_LAZY_CHUNK_FILES: Record<EditorLazyChunkName, string> = {
  'layer-editor': 'magic-card-layer-editor.js',
};

/** Same meaning as LAZY_CHUNK_CEILINGS; the cap is measured + 5 %. */
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
  /** The feature's CSS, adopted by every card before whenReady callbacks run (same frame). */
  readonly styles?: CSSResultGroup;
}

/** The older chunks guarded by sameBuild() instead of lazyChunk() (dist file names). */
export const SAME_BUILD_CHUNK_FILES = [
  'magic-card-shape-custom.js',
  'magic-card-anim-runtime.js',
  'magic-card-particles.js',
  'magic-card-preset-catalogue.js',
  'magic-card-icon-library.js',
  'magic-card-theme-presets.js',
] as const;
export type SameBuildChunkFile = (typeof SAME_BUILD_CHUNK_FILES)[number];

/** What every SAME_BUILD_CHUNK_FILES entry exports besides its own surface. */
export interface SameBuildModule {
  /** __MC_BUILD_VERSION__ of the build that made this chunk (theme-presets: PRESETS_BUILD). */
  readonly BUILD: string;
}

/**
 * Chunks a render starts when it meets the need, with no needs() row (only the render knows whether a
 * document has a rig or a particle simulation): dist/magic-card-<name>.js. They load through lazyChunk() too.
 */
export type OnDemandChunkName = 'anim-runtime' | 'particles' | 'shape-custom';

/** One lazily loaded chunk (src/utils/lazy-chunk.ts). */
export interface LazyChunk {
  readonly name: LazyChunkName | OnDemandChunkName | EditorLazyChunkName;
  /** Memoised; true once installed, false (one warning) when the first two attempts fail or the BUILD differs; later retries may still install. */
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

// ── Needs, reserve, failure and manifest types ──

/** Pure, synchronous, total check on a card config (section "needs(config)"). */
export type NeedsCheck = (config: unknown) => boolean;

/** One row of the needs table, src/utils/lazy-features.ts. */
export interface LazyFeature {
  readonly chunk: LazyChunkName;
  readonly needs: NeedsCheck;
}

/**
 * Space a late slot holds before its chunk installs, from config only. 'none': an
 * overlay. 'px': a configured or per-key default height (24 px floor). 'ratio': padding-top percent
 * (no aspect-ratio, Chromium 85). 'grid': HA grid_options rows (rows x 56 px + gaps x 8 px).
 */
export type SlotReserve = { kind: 'none' } | { kind: 'px'; px: number } | { kind: 'ratio'; percent: number } | { kind: 'grid'; rows: number };

/** Why a chunk failed: 'load' (network, 404, timeout, install error) or 'mismatch' (another release). */
export type LazyChunkFailure = 'load' | 'mismatch';

/** LazyChunk plus retry; lazyChunk() returns this. */
export interface RetryableLazyChunk extends LazyChunk {
  /** One extra attempt under a new URL; only in the failed state; never resets the background count. */
  retry(): Promise<boolean>;
  /** Set once failed(). */
  failure(): LazyChunkFailure | undefined;
}

/** Default export of dist/magic-card-manifest.js. */
export interface LazyChunkManifest {
  /** __MC_BUILD_VERSION__ of the release. */
  readonly build: string;
  /** Logical name (magic-card-<name>.js) -> emitted file (magic-card-<name>.<hash8>.js). */
  readonly chunks: Readonly<Record<string, string>>;
}

/**
 * Timing of one chunk's attempts. The numbers live in
 * lazy-module.needs.ts, which magic-card.js may import; this file may not be imported by the entry at run time.
 */
export { BACKGROUND_RETRY_MS, CHUNK_TIMEOUT_MS, SILENT_RETRY_MS } from './lazy-module.needs';
