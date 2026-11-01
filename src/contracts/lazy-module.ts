import type { CSSResultGroup, TemplateResult } from 'lit';
import type { CardModule, HomeAssistant } from '../types';
import type { LazyStubMetadata, MagicModule } from '../modules/module-types';

/** Contract: lazy modules and lazy card chunks. Version 1.11.0 (LAZY_MODULE_CONTRACT). Swiper, seasonal decor, markdown
 * and the rarely used modules leave magic-card.js. A quiet chunk (lazyChunk option `silent`) shows no failure notice. */

export const LAZY_MODULE_CONTRACT = '1.11.0';
export const LAZY_MODULE_CONTRACT_REVISION = 25;

/** webpackChunkName of each chunk; the file is dist/magic-card-<name>.js. */
export type LazyChunkName = 'slider' | 'seasonal' | 'markdown' | 'modules-extra' | 'controls' | 'flows' | 'pause' | 'popup' | 'decor' | 'flow-look' | 'slider-look' | 'layers' | 'svg-icon' | 'anim' | 'templates';

export const LAZY_CHUNK_FILES: Record<LazyChunkName, string> = {
  slider: 'magic-card-slider.js',
  seasonal: 'magic-card-seasonal.js',
  markdown: 'magic-card-markdown.js',
  'modules-extra': 'magic-card-modules-extra.js',
  flows: 'magic-card-flows.js',
  pause: 'magic-card-pause.js',
  popup: 'magic-card-popup.js',
  controls: 'magic-card-controls.js',
  decor: 'magic-card-decor.js',
  'flow-look': 'magic-card-flow-look.js',
  'slider-look': 'magic-card-slider-look.js',
  layers: 'magic-card-layers.js',
  'svg-icon': 'magic-card-svg-icon.js',
  anim: 'magic-card-anim.js',
  templates: 'magic-card-templates.js',
};

/**
 * Sanity ceilings (B, minified). The CAPS entry is measured + 5 % rounded up to 1 KiB; a measured
 * size over its ceiling means a magic-card.js module (Lit, registry, utils) or the module of a shared chunk (LAZY_SHARED_CHUNK_FILES) was copied
 * into the chunk. Report it, do not raise the ceiling.
 */
export const LAZY_CHUNK_CEILINGS: Record<LazyChunkName, number> = {
  slider: 122_880,
  seasonal: 81_920,
  markdown: 57_344,
  'modules-extra': 57_344,
  /** The views of the slider, spinbox, dropdown, light and gauge modules and the code only they use. */
  controls: 61_440,
  /** The flow resolver, line geometry, <mc-flows> and its card rules. */
  flows: 57_344,
  /** The Pause motion button class and its rules. */
  pause: 16_384,
  /** The pop-up controller, the page's pop-up coordinator and the pop-up rules. */
  popup: 20_480,
  /** <mc-ring>, <mc-shape>, <mc-value-bg> and the ring path. */
  decor: 49_152,
  'flow-look': 32_768,
  'slider-look': 28_672,
  /** Stack (15.3 KiB measured) + placement runtime and layer CSS (about 5-6 KiB). */
  layers: 24_576,
  /** Icon source, <mc-svg-icon>, the SVG sanitiser and the `mcu:` library client (about 61 KiB raw measured before the move). */
  'svg-icon': 65_536,
  /** The resolve, compiler and model of the animations, the preset and keyframe tables and the animation rules (`styles`), and the animation library. */
  anim: 94_208,
  /** The template source (one subscription per connection and name) and the template merge. */
  templates: 12_288,
};

/** Chunks that only hold shared source: no install, no BUILD, no notice. */
export type LazySharedChunkName = 'path-core' | 'history' | 'shape-path';

export const LAZY_SHARED_CHUNK_FILES: Record<LazySharedChunkName, string> = {
  'path-core': 'magic-card-path-core.js',
  history: 'magic-card-history.js',
  'shape-path': 'magic-card-shape-path.js',
};

/** Sanity ceilings (B, minified), as LAZY_CHUNK_CEILINGS. */
export const LAZY_SHARED_CHUNK_CEILINGS: Record<LazySharedChunkName, number> = {
  /** src/path/core.ts only. */
  'path-core': 10_240,
  /** src/services/history-cache.ts only. */
  history: 4_096,
  /** src/utils/shape-path.ts only. */
  'shape-path': 20_480,
};

/** Which module types each chunk serves (seasonal, flows, pause, popup, decor, flow-look, slider-look, layers, svg-icon, anim and templates serve no module type). */
export const LAZY_MODULE_TYPES: Record<Exclude<LazyChunkName, 'seasonal' | 'flows' | 'pause' | 'popup' | 'decor' | 'flow-look' | 'slider-look' | 'layers' | 'svg-icon' | 'anim' | 'templates'>, readonly string[]> = {
  slider: ['slider-layout'],
  markdown: ['markdown'],
  'modules-extra': ['camera', 'video-bg', 'weather', 'forecast', 'graphs', 'custom-card', 'tabs', 'clock', 'image'],
  controls: ['slider', 'spinbox', 'dropdown', 'light', 'gauge'],
};

/** Chunks only an editor loads. */
export type EditorLazyChunkName = 'layer-editor';

export const EDITOR_LAZY_CHUNK_FILES: Record<EditorLazyChunkName, string> = {
  'layer-editor': 'magic-card-layer-editor.js',
};

/** Same meaning as LAZY_CHUNK_CEILINGS; the cap is measured + 5 %. */
export const EDITOR_LAZY_CHUNK_CEILINGS: Record<EditorLazyChunkName, number> = {
  /** Panels about 75 KB + layer-editor i18n tables (en-GB ids, en-US, nl) about 20 KB. */
  'layer-editor': 114_688,
};

/** The svg-css chunk: the CSS paint resolver, loaded only where an SVG is opened. */
export const SVG_CSS_CHUNK = 'svg-css';
export const SVG_CSS_CHUNK_FILE = 'magic-card-svg-css.js';
/** Same meaning as LAZY_CHUNK_CEILINGS. The resolver (src/svg-safety/css.ts) is about 10 KiB minified. */
export const SVG_CSS_CHUNK_CEILING = 16_384;

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
export type OnDemandChunkName = 'anim-runtime' | 'particles' | 'shape-custom' | 'svg-image' | 'status';

/** Quiet chunks: each is built with lazyChunk(name, importer, { silent: true }), so a failure shows no notice. */
export const SILENT_CHUNKS = ['status'] as const;

/** The status chunk (contract card-status 1.0.0): the connection and not-updated faces. */
export const STATUS_CHUNK_FILE = 'magic-card-status.js';
/** Same meaning as LAZY_CHUNK_CEILINGS. */
export const STATUS_CHUNK_CEILING = 16_384;

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
export interface LazyModuleStub extends Omit<MagicModule, 'renderPreview' | 'metadata'> {
  /** type and inherit at once; name, description, category and icon once the editor chunk has evaluated. */
  readonly metadata: LazyStubMetadata;
  renderPreview?: MagicModule['renderPreview'];
  /**
   * The module's box before its view exists: same outer classes and, where the config fixes it,
   * the same size (camera aspect ratio, graph height, forecast skeleton). 'failed': no text.
   */
  placeholder(config: CardModule, state: 'pending' | 'failed'): TemplateResult;
}

// ── Needs, reserve, failure and manifest types ──

/** Pure, synchronous, total check on a card config. */
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

/**
 * Adoption assigns a new array (`root.adoptedStyleSheets = [...root.adoptedStyleSheets, ...sheets]`), never push (frozen on Chromium
 * 85); connectedCallback adds sheets a card missed while disconnected. Same-frame adoption is verified on Chromium 85, Chrome and Firefox ESR; Safari 16.4 must be confirmed on a device, otherwise Core inserts a `<style>` element in the same task.
 * While a slot of the card shows a notice, the host carries the `mc-fail` attribute; in that state ha-card is the scroll box and
 * the layout-shift rule does not apply. A request that joins one in flight gets a fresh window: that is waiting, not a retry.
 */
