import type { AnimationDoc } from '../anim-studio/model';
import type { CustomShapeOptions } from './custom-shape';
import type { ThemeDoc } from './theme-editor';
import type { IconSummary, SavedIcon, SavedShape } from './mcu-library';
import type { ImageBinding, ImageSummary } from './mcu-library-images';
import type { SvgImageApi } from './svg-image';

/*
 * Contract: preset files (export / import) and the transfer chunk. Version 1.2.0.
 * 1.2.0 (1.1.0 was never released): the image code of the transfer chunk lives in its own child chunk, image-transfer
 * (below); parseTransfer's opts.images is that chunk's reader (ImageReader) instead of the sanitiser. The file format
 * is unchanged.
 * 1.1.0 (additive): kind 'image' (below), HOST_KINDS['mcu-panel'] gains it, LibrarySource.isSaved knows 'images',
 * LibraryOpenDetail.kind gains 'image', parseTransfer takes opts.images, TRANSFER_CHUNK_CEILING is 65 KiB.
 * The view reads and writes images through the images_* commands (in the image-transfer chunk; a host's `source` is
 * not asked for images).
 * Host 'mcu-panel' (the Magic Card Utils panel's Library tab, mcu-library 1.0.0) for <mc-library-view>,
 * with New / Edit actions that fire `mc-library-open`.
 * <mc-library-view> reads saved icons and shapes
 * through `LibrarySource` (property `source`; without one it calls the mcu-library commands itself, so
 * it never imports a feature Module). resolveClashes gains opts `reserved` (ids another library holds:
 * renamed whatever the choice, so in 'replace' mode an id the target does not hold is still renamed when
 * reserved) and `takenName` (a new item whose name the target already shows gets a number; a replaced
 * item keeps its name); <mc-transfer-panel> gains properties `reserved(kind, id)` and
 * `takenName(kind, name)` passed through to it. External-host detection (contactsOtherHost) decodes CSS
 * escapes, removes tab/CR/LF, flags any value with a backslash or a comment opener, and checks every
 * argument of image-set() and similar functions.
 * Row thumbnail hook: <mc-library-view> property `rowExtra?: (kind, id) => { thumb?: Node; meta?: string }`;
 * `thumb` is drawn decorative before the row name, `meta` is appended to the id line (e.g. "10 points").
 * A host never reads or writes the view's shadow DOM; the Magic Card Utils Shapes tab uses this hook.
 *
 * ── Envelope (the file format; public once released, semver from then on) ──
 * One file holds one kind and one or more items. YAML or JSON, same object:
 *   magic_card_export: "1.0"       format marker + "major.minor" (TRANSFER_FORMAT)
 *   kind: animation | theme | shape | icon | image
 *   generator: "Magic Card 2026.10.11"   optional, informative only, never read back
 *   items:
 *     - id: sunrise                 LIBRARY_ID_RE (animations: ANIMATION_ID_RE, the same pattern)
 *       name: Sunrise               1..80 chars after trim
 *       author: Alex                optional, 1..AUTHOR_MAX_CHARS
 *       description: ...            optional, 1..DESCRIPTION_MAX_CHARS
 *       keywords: [sun, morning]    optional, icons and images only (<= 10 words of 1..32 chars)
 *       data: { ... }               per kind, below
 * Writing: always `items` (a list, even for one item), keys in the order above, YAML through
 * toYaml (noRefs: no anchors or aliases are ever written), JSON with 2-space indent. No timestamps,
 * no user ids, no hostnames (nothing personal goes into a file except the optional author the user
 * types).
 * Reading: `items` (list) or `item` (one object). Major > TRANSFER_MAJOR -> refused, nothing saved,
 * message names the file's version ("This file needs a newer Magic Card (format 2.x)"). Same major,
 * higher minor -> read; unknown keys dropped and listed. Unknown `kind` -> refused with the kind
 * named. More than MAX_IMPORT_ITEMS items -> refused.
 *
 * Per-kind `data` (item id and name are authoritative; copies of them inside data are overwritten):
 * - animation: an AnimationDoc without id and name. Read with validateAnimationDoc (strict, as the
 *   studio's import) plus validateSim for particles; an invalid item is refused whole and listed,
 *   the rest import. Built-in preset ids (ANIMATION_PRESETS) are never exported (everyone has
 *   them); catalogue animations are documents and export like any other. A sequence exported from
 *   the studio or the library takes the `custom:` documents its steps use along (listed in the
 *   export summary). On import, ids renamed by a clash are followed in sequence steps; a step
 *   naming a custom id that is in neither the file nor the target is a warning, not an error.
 *   author / description are not stored for animations (AnimationDoc is Core and has no such
 *   fields); the summary says so. Re-export writes neither.
 * - theme: a ThemeDoc (flat vars and/or modes.light / modes.dark). description doubles as the
 *   picker blurb. Rules: every key matches THEME_VAR_RE or is `modes`; `modes` holds only light /
 *   dark objects; values are strings of at most THEME_VALUE_MAX_CHARS or finite numbers (booleans,
 *   null, objects and lists are dropped and listed); compact JSON <= THEME_PRESET_MAX_BYTES. The
 *   theme editor runs its own docErrors on the result before it saves or opens it (the transfer
 *   chunk never imports src/theme-editor/**).
 *   Values that reference another host (EXTERNAL_REF_RE) and card-mod-* keys
 *   (CARD_MOD_KEY_RE, in the flat part or a mode) are KEPT, not stripped. The import summary
 *   shows a warning that lists every such variable (with mode) and every host name, BEFORE the
 *   user confirms; the confirm button reads "Import anyway" while that warning is shown. Values
 *   with a path on the sharer's own Home Assistant (url(/local/...)) get an info line ("may not
 *   exist on your system"). Nothing in the import path fetches anything.
 * - shape: Omit<CustomShapeOptions, 'ref'>, keys in SHAPE_KEYS only (others dropped and listed),
 *   points <= MAX_SHAPE_POINTS, compact JSON <= SHAPE_MAX_BYTES (mcu-library). Value checks are
 *   the custom-shape normaliser's (invalid values dropped one by one and listed).
 * - icon: { svg, path?, secondary_path?, view_box? }. svg goes through sanitizeSvg; everything it
 *   removes (script, <use>, external href, event attributes, unknown elements) is listed as a
 *   warning (the PM rule: icons are stripped, unlike themes). svg <= ICON_MAX_BYTES after
 *   sanitising. path / secondary_path must match the mcu-library path pattern, else dropped and
 *   listed; view_box four finite numbers, else taken from the sanitised svg. A missing or dropped
 *   path is saved as '' with the note "Open it in the SVG editor and save to show it in Home
 *   Assistant's own cards" (the HA form is computed by the SVG editor, not by this chunk).
 *
 * - image: { svg, view_box, bindings? }, see "Images" below.
 *
 * ── Images (kind image) ──
 * data: { svg, view_box, bindings? } (ImageData): the saved image without id, name, author, description, keywords,
 * thumb and timestamps (those are item fields or are made again). Items may carry `keywords` like icons. Reading
 * (ImageReader.readImage, in the image-transfer chunk): svg goes through the svg-image api's sanitizeImage (the
 * transfer and image-transfer chunks hold no SVG sink and no sanitiser of their own), everything it removes is listed
 * as svg_removed notes (element or element@attribute), an item it refuses is refused whole and listed. view_box is
 * taken from the sanitised drawing. svg + compact bindings <= IMAGE_MAX_BYTES, else the item is refused. bindings: at
 * most MAX_IMAGE_BINDINGS (the rest is dropped, over_cap); each entry is kept only when its target is an element id of
 * the drawing, its entity looks like an entity id, its `set` is a BindingSet, it has at most MAX_BINDING_RULES rules
 * each with a state or above / below and a value that fits the set (colour per BINDING_COLOUR_RE for fill and stroke,
 * 0..100 for opacity, boolean for visible), the same for `default`, and no earlier entry has the same (target, set). A
 * dropped entry is listed (dropped_value, path data.bindings[n]). Keys of data other than svg, view_box and bindings
 * are dropped and listed (dropped_key). Without opts.images every image item is refused with the "checker did not
 * load" note (the host loads the image-transfer chunk first). Nothing in the import path draws the markup.
 * Image envelopes are JSON only: a YAML text of kind image is refused ("Image files are JSON"), and export of images
 * writes JSON only. Files and texts over MAX_IMPORT_BYTES / MAX_IMPORT_CHARS are read only when the text is JSON (first
 * character `{`) and its marker says kind image, up to MAX_IMAGE_IMPORT_BYTES; the YAML parser never sees them. The
 * bounded copy of that large JSON path allows MAX_IMAGE_IMPORT_NODES visits and MAX_IMAGE_IMPORT_BYTES characters
 * (JSON has no aliases, so the expansion is the file itself); depth, keys and number rules are unchanged. These
 * bounds run in the transfer chunk, before any image code is asked.
 * checkFileSize(file) takes the name: a .json file up to MAX_IMAGE_IMPORT_BYTES passes, anything else is held to
 * MAX_IMPORT_BYTES.
 * Hosts: 'mcu-panel' (Images tab and Library tab) accepts images; the card editor's library view does when its kinds
 * hold 'image' (the view then passes accept ['image'] to <mc-transfer-panel>, property `accept`, which narrows the
 * host's kinds); a view on any other kind refuses an image file with where to import it. Importing needs Magic Card
 * Utils and an admin; without it the panel shows the install hint and never offers the import.
 * Library view: images are listed with thumbnail (THUMB_RE data URLs only), size and number of connections; actions
 * Edit (View for a non-admin; fires LIBRARY_OPEN_EVENT in 'mcu-panel'), Duplicate (images_get, then images_save under
 * a new name and a new id, then Edit), Rename, Delete, export of selected or all images (images_list, then images_get
 * in chunks of MAX_IMAGE_GET_IDS) and Import (images_save per item; a thumbnail is made through the svg-image api).
 * A non-admin sees the list, View and Export; no other action is drawn. The view keeps the markup, focus and
 * messages of these actions; the commands, the row text and the image-only words come from ImageTransfer.
 * `static contractRevision` of <mc-library-view> is at least IMAGES_MIN_CONTRACT_REVISION.
 *
 * ── Other inputs read (C5) ──
 * Detection order on the parsed value: (1) object with `magic_card_export` -> envelope; (2) the
 * studio's 2026.10.x export: a list of AnimationDocs, one AnimationDoc, an id-keyed map of them, or
 * a card config with `custom_animations` -> kind animation (ids and names from the docs); (3) text
 * whose first element is <svg (after an optional XML prolog / comments; or a .svg file name) ->
 * kind icon, one item, id = slug of the file name (or "icon"), name = file name; (4) a plain Home
 * Assistant theme file: a top-level map whose values are all objects of theme variables
 * (THEME_VAR_RE keys or `modes`) -> kind theme, one item per top-level key (id = slug, name =
 * key). Anything else: "This is not a Magic Card preset file."
 * A host passes the kinds it accepts (HOST_KINDS); another kind is refused with where to import it
 * ("Theme files are imported in Magic Card Utils > Themes").
 *
 * ── Safe parsing (untrusted input, C6) ──
 * 1. Files over MAX_IMPORT_BYTES are refused before reading (File.size); pasted text over
 *    MAX_IMPORT_CHARS is refused before parsing.
 * 2. Trimmed text starting with { or [ -> JSON.parse first; on a JSON error, YAML below.
 * 3. YAML: js-yaml load (one document; a second document is an error) with SAFE_YAML_SCHEMA =
 *    CORE_SCHEMA only: no merge key `<<`, no timestamps, no binary, no custom tags (any !tag is a
 *    parse error); duplicate keys are an error. Never src/utils/yaml-utils fromYaml (it adds the
 *    merge tag). Parser exceptions (RangeError from deep nesting included) -> "Not valid YAML".
 * 4. Bounded copy: the parsed value is walked once into a fresh JSON-only value. Every object,
 *    list and scalar visit counts, and a shared object (a YAML alias) counts again at every place
 *    it is used, so alias expansion is measured, not trusted. Refused when visits exceed
 *    MAX_IMPORT_NODES, depth exceeds MAX_IMPORT_DEPTH, re-visits of shared objects exceed
 *    MAX_YAML_ALIASES, or summed string length exceeds MAX_IMPORT_EXPANDED_CHARS. Keys __proto__,
 *    constructor and prototype are dropped; non-finite numbers are refused. The walk stops at the
 *    first limit hit (it never builds the expanded value).
 * 5. Only the copy reaches the per-kind validators. Budget: steps 1-4 refuse a 2 MB file or a
 *    10,000-alias bomb in under IMPORT_REFUSE_MS on desktop Chrome with 4x CPU throttle, and a
 *    valid 1 MB file parses without a long task over 200 ms on the same setup .
 *
 * ── Clashes and targets ──
 * Target per host: with Magic Card Utils, the library store of the kind (mcu-library 1.0.0;
 * animations through the existing animation commands). Without it (card editor, shape editor, SVG
 * editor only): animation / shape / icon items become inline copies on the card being edited
 * (custom_animations / custom_shapes / custom_icons[id]); themes need Magic Card Utils anyway.
 * 'mcu-panel' always has Magic Card Utils: every kind goes to its store.
 * An item whose id exists in the target is a clash. When any item clashes, the summary lists them
 * and asks once: "Replace" (overwrite, no base_updated_at) or "Keep both" (the imported ones get
 * uniqueId(id): id-2, id-3, ...). Cancel saves nothing. A library cap that is reached imports what
 * fits and lists the rest.
 *
 * ── Export ──
 * From: the library view (selected items of one kind), the animation studio (selected docs), the
 * theme editor (the open theme, a built-in preset or a My preset), the shape editor (the shape)
 * and the SVG editor (the icon). Format choice YAML (default) or JSON; "Download" (Blob + a[download],
 * object URL revoked) and "Copy" (clipboard; fallback: a selected read-only text area). Copy is
 * always offered (companion apps may block downloads). File name: magic-card-<kind>-<id>.<ext>
 * for one item, magic-card-<kind>s-<n>.<ext> for more.
 * Themes also get "Copy as HA theme": `<name>:` + the ThemeDoc as YAML, nothing else.
 * Round trip: export as YAML or JSON then import -> deep-equal items (ids kept, or renamed only by
 * Keep both). The contract test runs it for all four kinds and both formats.
 *
 * ── The transfer chunk (where the code lives) ──
 * One lazy chunk, webpackChunkName TRANSFER_CHUNK -> dist/TRANSFER_CHUNK_FILE, imported only by
 * src/editor/transfer-loader.ts in the card-editor chunk. Every host reaches it through the
 * magic-card.js runtime, so js-yaml, validateAnimationDoc, sanitizeSvg and the custom-shape
 * normaliser come from the parents (magic-card.js + magic-card-editor.js) and are never copied:
 * - card editor, shape editor, SVG editor: loadTransfer() from transfer-loader.ts.
 * - theme editor and animation studio entries: await window.MagicCard.loadEditor(), then
 *   window.MagicCard.loadTransfer() (module-editor 1.1.0, set by the editor chunk). Neither entry
 *   gets a new import(): the theme editor's one-import() rule stays.
 * - the Magic Card Utils panel: the same two calls (mcu-library 1.0.0).
 * magic-card.js grows 0 B (no runtime parsing of preset files; no theme
 * copy in cards). Dashboards that open no editor never fetch the chunk.
 * Loader rules (as presets/loader.ts): memoised while pending and once loaded; rejects on import
 * failure, after LOAD_TIMEOUT_MS, or when TRANSFER_CONTRACT_VERSION is not major 1; a rejection
 * clears the memo so "Try again" retries.
 * Size: CAPS entry = measured + 5 %, rounded up to 1 KiB, at most TRANSFER_CHUNK_CEILING (66 KiB = 67,584 B; the ceiling
 * stays, the image code lives in the image-transfer chunk). Over the ceiling means a parent module got
 * copied in (check js-yaml first), the library view grew, or image code came back (it belongs in image-transfer).
 * The transfer chunk holds no image command call (images_*), no binding check and no image-only message; it keeps
 * the kind name, the large-JSON bounds, the image refusals that run before image code is loaded ("Image files are
 * JSON", the 8 MB refusal, where to import, "checker did not load", the install hint) and the count plural.
 * It never imports src/utils/lazy-chunks.ts or src/svg-image/** (types excepted).
 *
 * ── The image-transfer chunk (image import, export and library actions) ──
 * A child lazy chunk of transfer: webpackChunkName IMAGE_TRANSFER_CHUNK -> dist/IMAGE_TRANSFER_CHUNK_FILE, chunk entry
 * src/image-transfer/chunk.ts exporting `createImageTransfer: CreateImageTransfer`. One import() site:
 * IMAGE_TRANSFER_LOADER (src/transfer/image-transfer-loader.ts, in eslint.config.mjs REGISTERED_IMPORT_SITES). That
 * file is also one of svg-image SVG_IMAGE_EDITOR_IMPORT_SITES: it imports both chunks together (Promise.all of the
 * svg-image chunk entry and the image-transfer chunk entry), then calls createImageTransfer(svgImage.api, kit) once.
 * Loader rules: memoised while pending and once loaded; resolves undefined (never rejects) on import failure, after
 * LOAD_TIMEOUT_MS, or when the result's `revision` is not IMAGE_TRANSFER_REVISION; undefined clears the memo so the
 * next call retries. A sync getter returns the loaded ImageTransfer or undefined (used for invalidate()).
 * Who loads it, and when:
 *   - <mc-transfer-panel> before parseTransfer when the text says kind image and the host accepts images (as today),
 *     passing the result as opts.images; when it resolves undefined the read is refused with "checker did not load";
 *   - <mc-library-view> when it lists kind image (before images_list); when it resolves undefined the view shows its
 *     error state with Try again. Other kinds never load it; a dashboard never fetches it.
 * Boundary (what the chunk may import): src/contracts/** (types, and constants the transfer chunk already used, so
 * the entry gains no export), src/i18n/runtime.ts (its own namespace) and its own folder. Nothing from src/transfer/**
 * (the kit below hands those helpers over once), src/svg-image/** (the api is handed in), src/utils/lazy-chunks.ts,
 * src/editor/** or lit. It defines no element and renders no template: the library view keeps all markup.
 * Sinks (the svg-image contract's rule): no SVG or HTML sink of any kind: no unsafeSVG / unsafeHTML, no innerHTML, no
 * DOMParser, no Blob, no createObjectURL, no <img> or URL built from markup. Thumbnails come only from
 * api.thumbnail and are sent only when they match THUMB_RE; the sanitiser runs only as api.sanitizeImage.
 * check-svg-sinks covers the chunk like any other (it has no parent that holds the image sanitiser, so any sink
 * fails the pairing).
 * Strings: i18n namespace 'image-transfer' (tables inline in the chunk, folder src/image-transfer, en-US and nl
 * complete, baseline 0). It holds the messages of ImageReader.readImage (could not be read, larger than {kb} KB,
 * markup not allowed, connection {n} not valid, only the first {max} connections) and the IMAGE_TRANSFER_TEXT words.
 * Messages the two chunks share stay in 'transfer' and reach the chunk through the kit (dropped key, removed part,
 * element and attribute names). A message is in one namespace only.
 * Errors: every command method rejects with the server's error unchanged (`code` kept: unauthorized, conflict,
 * library_full, too_large, unknown_command) and with an Error whose message is 'gone' when images_get returns no item;
 * the view maps them as it does for other kinds. Every method that writes calls api.invalidate for the ids it wrote.
 * Size: CAPS entry = measured + 5 %, rounded up to 1 KiB, at most IMAGE_TRANSFER_CHUNK_CEILING. The split adds one
 * chunk-table entry to magic-card.js (about 18 B gzip); nothing else of it is in the entry, and the entry caps stay as
 * they are. Measured on a Linux build like CI, with check-chunk-dups, check-entry-graph, check-svg-sinks and
 * check-es-syntax (editor side) passing.
 *
 * ── Accessibility (WCAG 2.2 AA, our bar) ──
 * The file control is a real <input type=file> behind a labelled button ("Choose a file"), accept
 * ".yaml,.yml,.json,.svg" (per host); the paste box is a labelled <textarea>; "Read" runs the
 * parse. The summary sits in a role=status live region (polite) and its heading takes focus;
 * refusals use role=alert. The clash choice is a radio group. Everything works by keyboard alone,
 * no drag, and reflows at 320 CSS px (200 % zoom). Escape closes the transfer panel (the hosts'
 * existing Escape guards apply).
 */

export const TRANSFER_CONTRACT_VERSION = '1.2.0';
/** File format marker value written by this version. */
export const TRANSFER_FORMAT = '1.0';
export const TRANSFER_MAJOR = 1;
export const TRANSFER_MARKER_KEY = 'magic_card_export';

export const TRANSFER_CHUNK = 'transfer';
export const TRANSFER_CHUNK_FILE = 'magic-card-transfer.js';
/** Hard ceiling of the transfer chunk (codec, safe parse, validators, transfer panel, library view). */
export const TRANSFER_CHUNK_CEILING = 66 * 1024; // 67,584 B
export const LOAD_TIMEOUT_MS = 8000;

export const IMAGE_TRANSFER_CHUNK = 'image-transfer';
export const IMAGE_TRANSFER_CHUNK_FILE = 'magic-card-image-transfer.js';
/** Hard ceiling of the image-transfer chunk (image reader, image commands, image words). */
export const IMAGE_TRANSFER_CHUNK_CEILING = 16 * 1024; // 16,384 B
/** The one import() site of the image-transfer chunk. */
export const IMAGE_TRANSFER_LOADER = 'src/transfer/image-transfer-loader.ts';
/** ImageTransfer.revision the loader accepts. */
export const IMAGE_TRANSFER_REVISION = 1;

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
      return cp > 0 && cp <= 0x10ffff && (cp < 0xd800 || cp > 0xdfff) ? String.fromCodePoint(cp) : '�';
    });
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
 * True when a theme value is not provably safe, i.e. it can make the browser contact another website
 * (strict allow-list, not trick-by-trick detection).
 * A value passes only when, after the allowed parts are taken out, it has no quote, no backslash, no `url(`,
 * no image function (image-set, -webkit-image-set, image, src, cross-fade, element), no `@import` and no `/*`.
 * Allowed parts: url() with a closed, trimmed argument that is exactly `/local/...` (no `//`, no `..`) or `#id`,
 * and quoted strings outside url() and image functions that hold no `:`, `/` or `\` (font names such as "Segoe UI").
 * Values over 4096 characters are refused. A `scheme://`, `//host` or `http:host` anywhere is also flagged.
 */
export function contactsOtherHost(value: string): boolean {
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
  /** `index` is the item's place in the file (for notes); `data` is the bounded copy's `data` value. Pure, synchronous. */
  readImage(index: number, data: unknown): ImageKindResult;
}

/** What window.MagicCard.loadTransfer() / loadTransfer() resolves to. */
export interface TransferChunk {
  version: typeof TRANSFER_CONTRACT_VERSION | string;
  /** Pure and synchronous: steps 1-5 above plus per-kind validation. */
  parseTransfer(text: string, opts: { accept: readonly TransferKind[]; fileName?: string; images?: ImageReader }): ParseResult;
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
 * Image-only words of the library view, in the image-transfer namespace:
 * export_all "Export all images", new "New image", view "View {name}", duplicate "Duplicate {name}",
 * copy_label "Name for the copy of {name}", copy_name "{name} copy", create_copy "Create copy",
 * delete_confirm "Delete {name}? Cards that use it show that the image is missing. This cannot be undone.",
 * duplicated "Duplicated as {name}."
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
 * <mc-transfer-panel> (all hosts): properties `host: TransferHost`, `mode: 'import' | 'export'`,
 * `exportItems?: { kind, items }`, `taken(kind, id): boolean`, `hasLibrary: boolean`.
 * Events (bubbling, composed): `mc-transfer-import` detail { kind, items, choice } after the user
 * confirms (the host saves; the panel never writes); `mc-transfer-close`.
 * <mc-library-view> (card editor): kinds animation / shape / icon, sources "Magic Card Utils"
 * (animations from animationLibrary + the existing animation commands, icons and shapes from the
 * mcu-library commands) and "This card" (the card's custom_* copies). List, search (name,
 * keywords), rename, delete (with confirm), export, import. Rename and delete need admin (the
 * commands say so); non-admin users see the list read-only.
 * Property `context: LibraryViewContext`, default 'card-editor' (all of the above). 'mcu-panel'
 * (the Magic Card Utils Library tab): kinds HOST_KINDS['mcu-panel'], source "Magic Card Utils" only (no
 * "This card", no `config`, `inline` false), `presets` = the panel's theme presets adapter, the transfer
 * panel opened with host 'mcu-panel'. Its header gets "New icon" (icons kind) / "New shape" (shapes
 * kind), and icon and shape rows get "Edit" (a real button, label "Edit <name>"); each fires
 * LIBRARY_OPEN_EVENT (bubbling, composed) with LibraryOpenDetail, and the panel opens the editor. The
 * `kinds`, when the host sets it, narrows these (the Shapes tab passes ['shape']; one kind hides the kind
 * selector). The
 * view itself never loads an editor chunk. Size: about 0.6-0.9 KB on the transfer chunk.
 */
