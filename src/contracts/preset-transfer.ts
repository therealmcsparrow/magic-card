import type { AnimationDoc } from '../anim-studio/model';
import type { CustomShapeOptions } from './custom-shape';
import type { ThemeDoc } from './theme-editor';
import type { IconSummary, SavedIcon, SavedShape } from './mcu-library';
import type { ImageBinding, ImageSummary } from './mcu-library-images';
import type { SanitizeOptions, SvgImageApi } from './svg-image';
import type { SvgCssResolve } from './svg-safety';

/** Contract: preset files (export / import) and the transfer chunk. Version 1.4.0 (TRANSFER_CONTRACT_VERSION). Kinds:
 * animation, theme, shape, icon, image. Image code lives in the image-transfer child chunk (ImageReader). */

export const TRANSFER_CONTRACT_VERSION = '1.4.0';
/** File format marker value written by this version. */
export const TRANSFER_FORMAT = '1.0';
export const TRANSFER_MAJOR = 1;
export const TRANSFER_MARKER_KEY = 'magic_card_export';

export const TRANSFER_CHUNK = 'transfer';
export const TRANSFER_CHUNK_FILE = 'magic-card-transfer.js';
/** Hard ceiling of the transfer chunk (codec, safe parse, validators, transfer panel, library view, svg-css loader). */
export const TRANSFER_CHUNK_CEILING = 68 * 1024; // 69,632 B
export const LOAD_TIMEOUT_MS = 8000;

export const IMAGE_TRANSFER_CHUNK = 'image-transfer';
export const IMAGE_TRANSFER_CHUNK_FILE = 'magic-card-image-transfer.js';
/** Hard ceiling of the image-transfer chunk (image reader, image commands, image words). */
export const IMAGE_TRANSFER_CHUNK_CEILING = 16 * 1024; // 16,384 B
/** The one import() site of the image-transfer chunk. */
export const IMAGE_TRANSFER_LOADER = 'src/transfer/image-transfer-loader.ts';
/** ImageTransfer.revision the loader accepts. */
export const IMAGE_TRANSFER_REVISION = 2;

export const MAX_IMPORT_BYTES = 1024 * 1024;
export const MAX_IMPORT_CHARS = 1024 * 1024;
export const MAX_IMPORT_NODES = 100_000;
export const MAX_IMPORT_DEPTH = 64;
export const MAX_YAML_ALIASES = 256;
export const MAX_IMPORT_EXPANDED_CHARS = 2 * 1024 * 1024;
export const MAX_IMPORT_ITEMS = 200;
/** Visits allowed to the bounded copy of a large image envelope (JSON only). */
export const MAX_IMAGE_IMPORT_NODES = 1_000_000;
export const IMPORT_REFUSE_MS = 1000;

export const AUTHOR_MAX_CHARS = 80;
export const DESCRIPTION_MAX_CHARS = 280;
export const THEME_VALUE_MAX_CHARS = 1024;
/** Same number as mcu-library THEME_PRESET_MAX_BYTES. */
export const THEME_PRESET_MAX_BYTES = 32 * 1024;

/**
 * A theme value that makes the browser contact another host: an absolute or protocol-relative URL
 * anywhere in the value (url(), image-set(), @import or a bare string). data: and url(#id) do not
 * match. Matching values are kept and listed.
 */
export const EXTERNAL_REF_RE = /(?:\b[a-z][a-z0-9+.-]*:\/\/|(?:^|[\s,("'])\/\/[^\s/)"'])/i;
/** CSS escapes (`\74 ` and `\/`) resolved the way a browser reads them. */
export function decodeCssEscapes(value: string): string {
  return value
    .replace(/\\([0-9a-f]{1,6})[ \t\n\r\f]?|\\([\s\S])/gi, (_m, hex: string | undefined, ch: string | undefined) => {
      if (hex === undefined) return ch ?? '';
      const cp = parseInt(hex, 16);
      return cp > 0 && cp <= 0x10ffff && (cp < 0xd800 || cp > 0xdfff) ? String.fromCodePoint(cp) : '\uFFFD';
    });
}

/** The string arguments of a value, read whole: url("…"), url('…'), url(bare) and any other quoted string. */
const ARGUMENT_RE = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s"'()]*))\s*\)|"([^"]*)"|'([^']*)'/gi;
/** Characters that must not appear in a host name shown to the user. */
const HIDDEN_RE = /[^\x21-\x7e]/;
/** A page can load over either scheme, and `https:host` is only an address on a page served over http. */
const BASES = ['https://invalid.invalid', 'http://invalid.invalid'];
const BACKSLASH = String.fromCharCode(92);

/**
 * The hosts a theme value points at, as the browser resolves them (ASCII or punycode, lower case). Each
 * argument is read whole and parsed the way the browser does, never cut at a separator. `unknown` is true when
 * anything cannot be read with certainty (a scheme other than http or https, a stray
 * `:` or `/` outside an argument, an unreadable host), so callers show the generic warning next to any host that was read. A backslash or a comment makes the whole value unreadable: nothing is named. An argument holding a line break or a bracket makes the value unreadable (a stylesheet resumes inside it). Only `data:image/` values other than SVG contact nothing and are skipped.
 */
export function externalHosts(value: string): { hosts: string[]; unknown: boolean } {
  if (value.includes(BACKSLASH) || value.includes('/*')) return { hosts: [], unknown: true };
  const hosts = new Set<string>();
  let unknown = false;
  const rest = value.replace(ARGUMENT_RE, (_m, a?: string, b?: string, c?: string, d?: string, e?: string) => {
    const arg = a ?? b ?? c ?? d ?? e ?? '';
    if (/[\n\r\f()]/.test(arg)) unknown = true;
    for (const base of BASES) {
      try {
        const u = new URL(arg, base);
        if (u.protocol === 'data:' && /^\s*data:image\/(?!svg)/i.test(arg)) continue;
        if (u.hostname === 'invalid.invalid') continue;
        if ((u.protocol === 'https:' || u.protocol === 'http:') && u.hostname && !HIDDEN_RE.test(u.hostname)) hosts.add(u.hostname);
        else unknown = true;
      } catch {
        unknown = true;
      }
    }
    return ' ';
  });
  if (/[:/]/.test(rest)) unknown = true;
  return { hosts: [...hosts], unknown };
}

/** Longest value checked; the import already drops values over 1,024 characters, a longer one is refused as suspicious. */
const CHECK_MAX_CHARS = 4096;
/** A url() whose argument is unquoted or simply quoted, closed, and holds no space, quote, bracket or backslash. */
const SIMPLE_URL_RE = /\burl\(\s*(?:"([^"\s()\\]*)"|'([^'\s()\\]*)'|([^"'\s()\\]*))\s*\)/gi;
/** Same-origin only: a path under /local/ (plain characters, checked for // and .. in code) or a #fragment. */
const OWN_URL_RE = /^(?:\/local\/[\w\-./%~+=@,]*|#[\w-]+)$/;
const FETCH_RE = /\burl\(|(?:^|[^a-z0-9-])(?:-webkit-)?(?:image-set|image|src|cross-fade|element)\(|@import/i;
/** A quoted string that cannot be (part of) an address: no `:`, `/` or `\`. */
const PLAIN_STRING_RE = /"[^"\\:/]*"|'[^'\\:/]*'/g;

/**
 * True when a theme value is not provably safe, i.e. it can make the browser contact another website (strict
 * allow-list, not trick-by-trick detection). A `card-mod-` key always counts: card-mod renders its value, so
 * the text here is not what the browser loads.
 */
export function contactsOtherHost(value: string, key?: string): boolean {
  if (key !== undefined && CARD_MOD_KEY_RE.test(key)) return true;
  if (value.length > CHECK_MAX_CHARS || value.includes('\\') || value.includes('/*')) return true;
  if (EXTERNAL_REF_RE.test(value) || /(?:^|[^a-z0-9+.-])(?:https?|wss?|ftp):/i.test(value)) return true;
  const rest = value.replace(SIMPLE_URL_RE, (m, a?: string, b?: string, c?: string) => {
    const arg = a ?? b ?? c ?? '';
    return OWN_URL_RE.test(arg) && !arg.includes('//') && !arg.includes('..') ? ' ' : m;
  });
  if (FETCH_RE.test(rest)) return true;
  return /["']/.test(rest.replace(PLAIN_STRING_RE, ' '));
}

/** A value with a path on the sharer's own Home Assistant (info line only). */
export const LOCAL_PATH_RE = /url\(\s*["']?\/(?!\/)/i;
export const CARD_MOD_KEY_RE = /^card-mod-/i;

export type TransferKind = 'animation' | 'theme' | 'shape' | 'icon' | 'image';
export type TransferFormat = 'yaml' | 'json';
export type TransferHost = 'card-editor' | 'shape-editor' | 'svg-editor' | 'animation-studio' | 'theme-editor' | 'mcu-panel';

/** Kinds each host accepts on import (and offers on export). */
export const HOST_KINDS: Readonly<Record<TransferHost, readonly TransferKind[]>> = {
  'card-editor': ['animation', 'shape', 'icon'],
  'shape-editor': ['shape'],
  'svg-editor': ['icon'],
  'animation-studio': ['animation'],
  'theme-editor': ['theme'],
  'mcu-panel': ['icon', 'shape', 'image', 'animation', 'theme'],
};

/** A saved-item list as the library source answers it. */
export type LibraryListing<T> = { state: 'ok'; items: T[] } | { state: 'missing' | 'error'; items: [] };
/**
 * What <mc-library-view> reads saved icons and shapes through. The card editor passes
 * its own cached lists as `source`; without one the view calls the mcu-library commands itself. The view
 * never imports a feature Module.
 */
export interface LibrarySource {
  listIcons(hass: unknown): Promise<LibraryListing<IconSummary>>;
  listShapes(hass: unknown): Promise<LibraryListing<SavedShape>>;
  getIcon(hass: unknown, id: string): Promise<SavedIcon | undefined>;
  /** Whether the last list holds this id (false while no list is loaded). */
  isSaved(kind: 'icons' | 'shapes' | 'images', id: string): boolean;
  /** Forget cached lists. */
  reset(): void;
}

/** Where <mc-library-view> runs. */
export type LibraryViewContext = 'card-editor' | 'mcu-panel';
/** Fired by the library view in 'mcu-panel': New (no id) or Edit of an icon or shape. */
export const LIBRARY_OPEN_EVENT = 'mc-library-open';
export interface LibraryOpenDetail {
  kind: 'icon' | 'shape' | 'image';
  /** Absent = New. */
  id?: string;
}

export interface IconData {
  svg: string;
  path?: string;
  secondary_path?: string;
  view_box?: string;
}

export interface ImageData {
  svg: string;
  view_box: string;
  bindings?: ImageBinding[];
}

export interface TransferDataByKind {
  animation: Omit<AnimationDoc, 'id' | 'name'>;
  theme: ThemeDoc;
  shape: Omit<CustomShapeOptions, 'ref'>;
  icon: IconData;
  image: ImageData;
}

export interface TransferItem<K extends TransferKind = TransferKind> {
  id: string;
  name: string;
  author?: string;
  description?: string;
  /** Icons and images only. */
  keywords?: string[];
  data: TransferDataByKind[K];
}

export interface TransferEnvelope<K extends TransferKind = TransferKind> {
  magic_card_export: string;
  kind: K;
  generator?: string;
  items: TransferItem<K>[];
}

/** Where the parsed value came from (C5). */
export type TransferSource = 'envelope' | 'studio-list' | 'svg' | 'ha-theme';

export type TransferNoteCode =
  | 'dropped_key'
  | 'dropped_value'
  | 'invalid_item'
  | 'svg_removed'
  | 'path_missing'
  | 'external_ref'
  | 'card_mod'
  | 'local_path'
  | 'missing_step_ref'
  | 'not_stored'
  | 'over_cap';

export interface TransferNote {
  code: TransferNoteCode;
  /** Item index in the file (-1: the file). */
  item: number;
  /** Field path, e.g. "data.modes.dark.lovelace-background". */
  path: string;
  message: string;
  /** external_ref: the host names found. */
  hosts?: string[];
  /** external_ref: part of the value could not be read, so another website may be contacted. */
  unknown?: boolean;
}

export type TransferRefusal =
  | 'too_large'
  | 'not_parseable'
  | 'limits'
  | 'newer_format'
  | 'unknown_kind'
  | 'wrong_kind'
  | 'not_a_preset_file'
  | 'too_many_items'
  | 'no_valid_items';

export type ParseResult<K extends TransferKind = TransferKind> =
  | { ok: true; kind: K; source: TransferSource; items: TransferItem<K>[]; notes: TransferNote[] }
  | { ok: false; refusal: TransferRefusal; message: string };

export type ClashChoice = 'replace' | 'keep-both';

/** One image item read from a file: the kept data and its notes, or a refusal with its notes. */
export type ImageKindResult = { ok: true; data: ImageData; notes: TransferNote[] } | { ok: false; notes: TransferNote[] };

/** What parseTransfer asks for image items (ImageTransfer passes itself). */
export interface ImageReader {
  /**
   * `index` is the item's place in the file (for notes); `data` is the bounded copy's `data` value, or { svg } for an
   * SVG text read as an image. `options` goes to api.sanitizeImage unchanged: { file: true, css } only for that SVG
   * item (`css` is parseTransfer's opts.css, absent when it has none), never for envelope items. Pure, synchronous.
   */
  readImage(index: number, data: unknown, options?: SanitizeOptions): ImageKindResult;
}

/** What window.MagicCard.loadTransfer() / loadTransfer() resolves to. */
export interface TransferChunk {
  version: typeof TRANSFER_CONTRACT_VERSION | string;
  /**
   * Pure and synchronous: steps 1-5 above plus per-kind validation. `css` (svg-safety loadSvgCss's result, only from
   * <mc-transfer-panel>) is forwarded to the sanitiser of an item read from SVG text and to nothing else.
   */
  parseTransfer(text: string, opts: { accept: readonly TransferKind[]; fileName?: string; images?: ImageReader; css?: SvgCssResolve }): ParseResult;
  serialiseTransfer<K extends TransferKind>(kind: K, items: TransferItem<K>[], format: TransferFormat): string;
  /** "Copy as HA theme". */
  haThemeYaml(name: string, doc: ThemeDoc): string;
  /** Ids after the clash choice; sequence steps follow renamed animation ids. */
  resolveClashes<K extends TransferKind>(items: TransferItem<K>[], taken: (id: string) => boolean, choice: ClashChoice, opts?: { reserved?: (id: string) => boolean; takenName?: (name: string) => boolean }): TransferItem<K>[];
  /** Custom element tags the chunk defines (customElements.get guarded). */
  tags: { panel: 'mc-transfer-panel'; library: 'mc-library-view' };
}

/** Helpers and shared messages the transfer chunk hands the image-transfer chunk once (it imports none of them). */
export interface ImageTransferKit {
  note(code: TransferNoteCode, item: number, path: string, message: string): TransferNote;
  /** dropped_key note with the transfer chunk's "is not a preset field" message; `path` e.g. "data.thumb". */
  droppedKey(item: number, path: string): TransferNote;
  /** svg_removed note: "Removed {what}." / "(n times)". */
  removedNote(item: number, count: number, what: string): TransferNote;
  /** Readable names for a stripped element / attribute (a script, a <use> reference, the event handler onload...). */
  elementWhat(name: string): string;
  attributeWhat(name: string): string;
  slug(name: string, fallback: string): string;
  uniqueId(id: string, taken: (id: string) => boolean): string;
}

/** The logged-in connection the commands go through. */
export interface ImageTransferHass {
  callWS(msg: Record<string, unknown>): Promise<unknown>;
}

/**
 * Image-only words of the library view, in the image-transfer namespace: export_all "Export all images", new "New
 * image", view "View {name}", duplicate "Duplicate {name}", copy_label "Name for the copy of {name}", copy_name
 * "{name} copy", create_copy "Create copy", delete_confirm "Delete {name}?
 */
export const IMAGE_TRANSFER_TEXT = ['export_all', 'new', 'view', 'duplicate', 'copy_label', 'copy_name', 'create_copy', 'delete_confirm', 'duplicated'] as const;
export type ImageTransferText = (typeof IMAGE_TRANSFER_TEXT)[number];

/** What createImageTransfer returns: the image side of <mc-transfer-panel> and <mc-library-view>. */
export interface ImageTransfer extends ImageReader {
  revision: typeof IMAGE_TRANSFER_REVISION;
  /** images_list; `missing` for unknown_command or no connection, `error` otherwise. */
  list(hass: ImageTransferHass): Promise<LibraryListing<ImageSummary>>;
  /** Saved images as export items (images_get in chunks of MAX_IMAGE_GET_IDS; no thumb, no timestamps), in `ids` order. */
  exportItems(hass: ImageTransferHass, ids: readonly string[]): Promise<TransferItem<'image'>[]>;
  /** images_get, then images_save with the new name and base_updated_at of what was read. */
  rename(hass: ImageTransferHass, id: string, name: string): Promise<void>;
  /** images_get, then images_save under uniqueId(slug(name, 'image'), taken) without base_updated_at; resolves the new id. */
  duplicate(hass: ImageTransferHass, id: string, name: string, taken: (id: string) => boolean): Promise<string>;
  /** images_delete. */
  remove(hass: ImageTransferHass, id: string): Promise<void>;
  /**
   * One imported item: a thumbnail through api.thumbnail (THUMB_SIDE_PX, THUMB_MAX_BYTES; sent only when it matches
   * THUMB_RE, left out when the browser cannot make one), then images_save; `baseUpdatedAt` when it replaces a saved id.
   */
  save(hass: ImageTransferHass, item: TransferItem<'image'>, baseUpdatedAt?: string): Promise<void>;
  /** api.invalidate (the view calls it after an import batch). */
  invalidate(ids: readonly string[]): void;
  /** A row's thumbnail (only a THUMB_RE data URL, else undefined) and its id-line text after the id ("12 KB · 3 connections"). */
  row(summary: ImageSummary): { thumb?: string; meta: string };
  text(key: ImageTransferText, args?: Record<string, string | number>): string;
}

/** The image-transfer chunk entry's export. `api` is the svg-image chunk's, `kit` the transfer chunk's helpers. */
export type CreateImageTransfer = (api: SvgImageApi, kit: ImageTransferKit) => ImageTransfer;

/**
 * <mc-transfer-panel> (all hosts): properties `host: TransferHost`, `mode: 'import' | 'export'`, `exportItems?: {
 * kind, items }`, `taken(kind, id): boolean`, `hasLibrary: boolean`. Events (bubbling, composed): `mc-transfer-import`
 * (detail { kind, items, choice }, after the user confirms; the host saves) and `mc-transfer-close`.
 */
