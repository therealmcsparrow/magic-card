import type { CardModule, HomeAssistant } from '../types';
import type { BackgroundLayerConfig } from './bg-stack';
import type { ImageBinding, SavedImage } from './mcu-library-images';
import type { SvgCssOption } from './svg-safety';
import type { SanitisedImageMarkup } from './svg-reader';

/** Contract: library images on cards. Version 1.0.0. A library image is a full drawing saved in Magic Card Utils
 * (mcu-library 1.1.0, kind `images`). */

export const SVG_IMAGE_CONTRACT = '1.0.0';
export const SVG_IMAGE_CONTRACT_REVISION = 7;

export const IMAGE_REF_PREFIX = 'mcu-image:';
export const IMAGE_REF_RE = /^mcu-image:([a-z0-9][a-z0-9_-]{0,63})$/;

export const SVG_IMAGE_CHUNK = 'svg-image';
export const SVG_IMAGE_CHUNK_FILE = 'magic-card-svg-image.js';
export const SVG_IMAGE_CHUNK_CEILING = 40 * 1024;
export const SVG_IMAGE_TAG = 'mc-svg-image';
export const SVG_IMAGE_STATUS_EVENT = 'mc-svg-image-status';

/** The only editor-side files that import() the svg-image chunk entry; each reads `api` only. */
export const SVG_IMAGE_EDITOR_IMPORT_SITES: readonly string[] = ['src/svg-editor/image-loader.ts', 'src/transfer/image-transfer-loader.ts'];

/**
 * Most the whole magic-card.js change for this contract may add (bytes after gzip level 9 / Brotli quality 11, Linux
 * build). The entry caps themselves are in tools/size-caps.json.
 */
export const ENTRY_DELTA_MAX_GZIP = 224;
export const ENTRY_DELTA_MAX_BR = 384;

export const IMAGE_MAX_GET_IDS = 8;
export const IMAGE_RETRY_MS = 60_000;
export const IMAGE_RETRY_MAX_MS = 30 * 60_000;
export const IMAGE_SKELETON_MS = 10_000;
export const BINDING_MIN_INTERVAL_MS = 334;
export const MAX_LAYER_PREFETCH = 4;

/** Render budget lines; measured limits for tests, not runtime values. */
export const COLD_FIRST_MEDIAN_MAX_MS = 200;
export const COLD_FIRST_P95_MAX_MS = 300;
export const CACHE_HIT_MEDIAN_MAX_MS = 100;
export const BINDING_APPLY_MEDIAN_MAX_MS = 4;

/** Same numbers as mcu-library-images IMAGE_MAX_BYTES and MAX_IMAGE_BOX. */
export const IMAGE_MAX_BYTES = 256 * 1024;
export const MAX_IMAGE_BOX = 4096;
export const IMAGE_MAX_NODES = 10_000;
export const IMAGE_MAX_DEPTH = 64;
export const IMAGE_MAX_TEXT_CHARS = 2048;
export const IMAGE_MAX_DESCRIPTION_CHARS = 500;

/** Refused before parsing (lower-case; matched case-insensitively). */
export const IMAGE_TEXT_DENY: readonly string[] = ['<!doctype', '<!entity', '<?', '<![cdata['];

export const IMAGE_ELEMENTS: readonly string[] = [
  'svg', 'g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'defs', 'linearGradient',
  'radialGradient', 'stop', 'clipPath', 'mask', 'title', 'text', 'tspan',
];
export const IMAGE_ATTRIBUTES: readonly string[] = [
  'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'dx', 'dy', 'fx', 'fy', 'fr', 'width', 'height',
  'points', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit',
  'stroke-dasharray', 'stroke-dashoffset', 'opacity', 'fill-opacity', 'stroke-opacity', 'transform', 'viewBox', 'id',
  'class', 'offset', 'stop-color', 'stop-opacity', 'gradientUnits', 'gradientTransform', 'spreadMethod', 'clip-path',
  'clipPathUnits', 'mask', 'maskUnits', 'maskContentUnits', 'fill-rule', 'clip-rule', 'paint-order', 'vector-effect',
  'visibility', 'font-size', 'font-family', 'font-weight', 'font-style', 'text-anchor', 'dominant-baseline',
  'letter-spacing', 'preserveAspectRatio', 'data-name',
];
export const IMAGE_FONT_FAMILIES: readonly string[] = ['sans-serif', 'serif', 'monospace', 'system-ui'];
export const IMAGE_ID_RE = /^[A-Za-z][\w.-]{0,63}$/;
export const THEME_VAR_NAME_RE = /^--[a-z0-9][a-z0-9-]{0,63}$/;
export const IMAGE_MAIN_VAR = '--mc-image-main';
export const IMAGE_ACCENT_VAR = '--mc-image-accent';

export const MAX_IMAGE_BINDINGS = 64;
export const MAX_BINDING_RULES = 16;

export const IMAGE_OVERLAY_TYPES: readonly string[] = ['icon', 'info', 'button'];
export const MAX_IMAGE_OVERLAYS = 32;

export interface SanitizeOptions extends SvgCssOption {
  /** A .svg file the user opened or imported: a leading prolog may be removed first. */
  file?: boolean;
}

export interface SanitizedImage {
  /** `<svg viewBox>…</svg>`, empty on error. Branded inside the image sanitiser only. */
  markup: SanitisedImageMarkup;
  viewBox: string;
  /** Element ids present (binding targets). */
  ids: string[];
  /**
   * What was dropped, as `element` or `element@attribute` names, for the import summary. The same names for a drawing
   * with or without xmlns; also filled when the error is `empty`.
   */
  stripped: string[];
  error?: 'too_large' | 'unsafe_markup' | 'not_svg' | 'too_complex' | 'empty' | 'bad_viewbox';
  /** UTF-8 size of the input, for the message. */
  bytes: number;
}

export interface ImagePoint {
  x: number;
  y: number;
}

/** An overlay child of the image module. */
export type ImageOverlay = CardModule & { point?: ImagePoint };

/** Image module keys added by this contract (types.ts ImageModuleConfig). */
export interface ImageModuleImageKeys {
  /** A URL, media id, or IMAGE_REF_PREFIX + id. */
  image?: string;
  /** Main and Accent of a library image; design colour values. */
  colors?: { main?: string; accent?: string };
  /** Text alternative for screen readers, at most IMAGE_MAX_DESCRIPTION_CHARS; unset = decorative. Any image source. */
  description?: string;
  /** Library images with bindings: a visually hidden list of bound entities and their states. Default false. */
  state_summary?: boolean;
  modules?: ImageOverlay[];
}

/** <mc-svg-image> status, as property, host attribute and SVG_IMAGE_STATUS_EVENT detail. */
export type SvgImageStatus = 'waiting' | 'ready' | 'missing';

export interface SvgImageStatusDetail {
  status: Exclude<SvgImageStatus, 'waiting'>;
}

/** <mc-svg-image> properties. */
export interface SvgImageElementProps {
  ref: string;
  hass: HomeAssistant | undefined;
  colors?: { main?: string; accent?: string };
  fit?: 'contain' | 'cover' | 'fill' | 'none';
  entity?: string;
  description?: string;
  stateSummary?: boolean;
  /** Set by <mc-bg-stack> only: the element is a background layer's drawing. */
  layer?: BackgroundLayerConfig;
  /** With `layer`: its YAML index, for the status event. */
  at?: number;
  /** Read-only. */
  readonly status: SvgImageStatus;
}

/** Entry helper (src/utils/svg-image-loader.ts): start the chunk and tell the render it was met. */
export type NeedSvgImage = (ctx: { metChunk?(name: 'svg-image'): void } | undefined) => void;

type CallWS = (msg: Record<string, unknown>) => Promise<unknown>;

/** What the svg-image chunk exports as `api`. */
export interface SvgImageApi {
  /** `options.css` only from an open site, and only with { file: true }. */
  sanitizeImage(markup: string, options?: SanitizeOptions): SanitizedImage;
  /** The library item, sanitised; undefined when missing. Shares the page cache. */
  getImage(id: string, callWS: CallWS): Promise<(SavedImage & { sanitized: SanitizedImage }) | undefined>;
  /** Sanitised nodes for an editor canvas (imported parts, previews); undefined when nothing is drawable. */
  fragment(markup: string): DocumentFragment | undefined;
  /** Raster thumbnail (data:image/webp, else png) of sanitised markup, longest side `side`, at most `maxBytes`. */
  thumbnail(markup: string, side: number, maxBytes: number): Promise<string | undefined>;
  /** Sanitised markup as an image/svg+xml Blob for a download; undefined when nothing is drawable. */
  fileBlob(markup: string): Blob | undefined;
  /** The value a binding gives an element right now (editor preview uses it too). */
  bindingValue(b: ImageBinding, hass: HomeAssistant | undefined): string | number | boolean | undefined;
  /** Drop cached ids (after a save in the same page). */
  invalidate(ids: string[]): void;
}
