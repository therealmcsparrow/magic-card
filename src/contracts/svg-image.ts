import type { CardModule, HomeAssistant } from '../types';
import type { BackgroundLayerConfig } from './bg-stack';
import type { ImageBinding, SavedImage } from './mcu-library-images';

/*
 * Contract: library images on cards. Version 1.0.0.
 * A library image is a full drawing saved in Magic Card Utils (mcu-library 1.1.0, kind `images`). Cards point at it with
 * one reference string; this contract fixes that reference, how each card surface draws it, the image sanitiser's
 * allow-list, entity bindings of drawing parts and overlays placed on the drawing.
 *
 * ── Reference (the one format) ──
 *   mcu-image:<id>        <id> matches mcu-library LIBRARY_ID_RE (IMAGE_REF_RE). Nothing else: no query, no version,
 *                         no inline SVG. The YAML stays readable and the drawing stays in the library.
 * The id is fixed when the image is first saved (mcu-library-images: a slug of the first name) and never changes;
 * renaming changes the name only, so references in cards keep working.
 * Allowed in exactly these places, and drawn the same way in each (inline <mc-svg-image>, bindings live):
 *   - image module        `image: mcu-image:<id>`                                 with overlays, description, summary
 *   - background layer    `background_layers[].image: mcu-image:<id>`             decorative (bg-stack 1.2.0)
 *   - background states   `background_layers[].states.<state>: mcu-image:<id>`    decorative, swapped per state
 *   (a background layer that follows an entity attribute whose value is such a reference draws it the same way).
 * Bindings live inside the saved image (SavedImage.bindings) and apply wherever the image is drawn; overlays live in
 * the card (image module `modules`). Buttons, badges and a description on a drawing behind content: an image module
 * with `placement: background` (layer-placement 1.0.0). No kept copy in cards (`custom_images` does not exist).
 * Card states, in this order:
 *   - waiting: image module: a skeleton box at the final size (the module's aspect_ratio), no spinner, no layout
 *     shift; background layer: nothing drawn yet, the layers beneath show (the layer box is absolute, nothing moves);
 *   - the svg-image chunk fails to load: the chunk's failure notice (render context metChunk), as for any chunk; a
 *     background layer draws nothing;
 *   - unknown id, deleted item, `unknown_command` (Magic Card Utils missing), `unauthorized`, a refused markup, or
 *     still waiting after IMAGE_SKELETON_MS: the missing-picture state (image module: the image-off fallback with the
 *     plain missing text, no ids; background layer: the layer renders nothing and the layers beneath show).
 * Never a blank or broken card.
 *
 * ── Chunk ──
 * svg-image (dist/magic-card-svg-image.js, chunk entry src/svg-image/chunk.ts) is an on-demand card chunk
 * (lazy-module OnDemandChunkName 'svg-image', literal import() in src/utils/lazy-chunks.ts `onDemandChunks`; no needs()
 * row). Ceiling SVG_IMAGE_CHUNK_CEILING; cap = measured + 5 %, rounded up to 1 KiB. It holds:
 *   - the image sanitiser (src/svg-image/sanitize.ts, statically imported: the chunk's SVG sinks are covered by it),
 *   - the image client (page-wide cache, batched images_get, change listener, retry),
 *   - <mc-svg-image> (defined in install()), for the image module and for background layers,
 *   - the binding engine,
 *   - every SVG sink that handles library-image markup for the editor chunks: thumbnails, export files and imported
 *     parts (api below). The image-editor, image-tools, transfer and image-transfer chunks hold no SVG sink: no
 *     unsafeSVG, no Blob of type image/svg+xml, no import of the sanitiser.
 * It exports `api: SvgImageApi`, the one copy of the client state. There are two ways in, and no others:
 *   - card side (magic-card.js and the card chunks): onDemandChunks['svg-image'] (load(), then module().api), through
 *     needSvgImage(ctx) or the control itself;
 *   - editor side: a dynamic import of the chunk entry in one of SVG_IMAGE_EDITOR_IMPORT_SITES, each also listed in
 *     eslint.config.mjs REGISTERED_IMPORT_SITES. The call is an import() of '../svg-image/chunk' carrying the magic
 *     comment webpackChunkName "svg-image" (the same name as the onDemandChunks line), and the caller reads `api`
 *     only. An editor-side chunk never imports src/utils/lazy-chunks.ts: a chunk that reads an export of an entry
 *     module makes webpack add export getters for it to magic-card.js.
 * Why the direct import keeps the entry clean and the state shared: with the same chunk name webpack resolves both
 * import() calls to the one chunk (no second copy; check-chunk-dups), whose id and file name are already in the
 * runtime's chunk table because of the onDemandChunks line, so a new site adds bytes only to the chunk that holds it.
 * Every editor chunk runs on the magic-card.js runtime (none carries its own), whose module cache holds one instance
 * of src/svg-image/chunk.ts: the cache and the client are the ones the cards use. An editor-side importer never calls
 * install(); <mc-svg-image> is defined only through the card's control (lazy-module), whose state a direct import
 * does not touch (a later load() by a card resolves from the module cache and installs).
 * Outside src/svg-image/, files import src/svg-image/** with `import type` only. A static value import would copy the
 * sanitiser into the importing chunk, which check-svg-sinks refuses.
 * Who loads it for cards, both through needSvgImage(ctx) (below):
 *   - the image view (modules-extra chunk) when its `image` matches IMAGE_REF_RE;
 *   - <mc-bg-stack> (magic-card.js) through host.needImage() when a layer's current value starts with IMAGE_REF_PREFIX.
 * A card without a library image reference never requests the chunk and never lists images.
 *
 * ── magic-card.js (the only entry change) ──
 *   - src/utils/lazy-chunks.ts: the `onDemandChunks['svg-image']` line (literal import()).
 *   - needSvgImage(ctx): starts the chunk (load(), idempotent) and calls ctx.metChunk('svg-image'). It sits in the
 *     entry (src/utils/svg-image-loader.ts, filled with a provide line from lazy-chunks.ts like svg-icon-loader.ts, or
 *     a direct import when that is smaller and keeps the entry graph acyclic; the builder measures both).
 *   - src/card/magic-card.ts _failNotices: a failed 'svg-image' the render met (this._met) shows its notice, as for
 *     the other on-demand chunks.
 *   - src/layers/stack-host.ts: BgStackHost.needImage() = needSvgImage(ctx()).
 *   - src/layers/stack/mc-bg-stack.ts: the live-layer branch of bg-stack 1.2.0 (no decode, <mc-svg-image> in the
 *     picture box, hass pushes re-render a stack that shows a live layer).
 *   - No change to media-resolver.ts, media.ts or safe-url.ts: a library image never becomes a URL, so no blob: and
 *     no data: URL is accepted anywhere and no SVG reaches an <img> or a CSS background-image.
 *   - The entry tests the prefix only (startsWith IMAGE_REF_PREFIX); the element checks IMAGE_REF_RE. A reference is
 *     never put in a URL sink.
 * Budget: the whole entry change fits ENTRY_DELTA_MAX_GZIP and ENTRY_DELTA_MAX_BR, measured on a Linux build like CI;
 * nothing else from this contract is in magic-card.js.
 *
 * ── Reading images (any logged-in user) ──
 *   - Through hass.callWS on the card's own logged-in connection: magic_card_utils/images_get { ids } (at most
 *     IMAGE_MAX_GET_IDS per call; requests in one animation frame are batched). Non-admin users read; they never
 *     write. The provider script is not used for reads. The card never sends more ids than that, so it never meets
 *     the server's `too_many` error (mcu-library-images IMAGE_ERR_TOO_MANY).
 *   - Cache: in page memory only, one entry per (id, updated_at): the sanitised drawing as an inert <template> (the
 *     sanitiser strips in the parsed tree and moves the nodes in; no serialise and re-parse) plus the markup string for
 *     editors. Each element clones the template. No localStorage, IndexedDB or Cache API (a floor plan is not left on
 *     the device).
 *   - The first sanitise of an item runs after the card's first paint (gated on the next animation frame), behind the
 *     waiting state. Heavy steps (sanitise, cold clone) are queued page-wide: at most one per animation frame, so many
 *     cards showing one drawing never make one long task. A draw step directly follows the sanitise step of its own
 *     data.
 *   - Freshness: `mcu-library-changed` { kind: 'images', ids } from the provider drops those ids and redraws every
 *     element showing them (module and background alike). On a websocket reconnect (connection 'ready') the chunk
 *     calls images_list once and refetches only ids whose updated_at changed. Without the provider, an edit shows
 *     after a page reload or a reconnect.
 *   - Retry while an element shows a missing item: after IMAGE_RETRY_MS, doubling up to IMAGE_RETRY_MAX_MS. No retry
 *     for an id that a fresh images_list does not hold, nor after `unknown_command` or `unauthorized`; those wait for
 *     a provider event naming the id, a reconnect or a page reload. The retry is silent.
 *
 * ── Render budget (Chromium, 4x CPU throttle, the 256 KiB / 1920x1080 / 300-layer fixture, N >= 10 runs) ──
 * Every line is judged on the median of the runs; p95 is reported with each measurement.
 *   - The card's own first paint is not delayed at all (sanitise and clone run after it, behind the waiting state).
 *   - Cold first element (nothing cached; from images_get data in hand to the drawing in the element plus one frame):
 *     median under COLD_FIRST_MEDIAN_MAX_MS, and p95 under COLD_FIRST_P95_MAX_MS.
 *   - Further element of a cached item: median under CACHE_HIT_MEDIAN_MAX_MS.
 *   - Binding apply (script, style and layout, 20 targets): median at most BINDING_APPLY_MEDIAN_MAX_MS.
 *   - Idle 5 s with a drawing on screen: equal to the card without it.
 * When a cold median reaches COLD_FIRST_MEDIAN_MAX_MS, the first remedy is to drop the frame gate before the
 * sanitise step when the requesting card has already painted (the images_get answer arrives after the card's paint),
 * keeping the one-heavy-step-per-frame queue. The card's paint stays undelayed in every case.
 *
 * ── <mc-svg-image> ──
 * Properties: ref (string), hass, colors ({ main?, accent? } design colour values), fit ('contain' | 'cover' |
 * 'fill' | 'none'), entity (the module's effective entity, for `entity` colour values), description (string),
 * stateSummary (boolean), layer (BackgroundLayerConfig; set only by <mc-bg-stack>), at (the layer's YAML index).
 * Properties set before the chunk defines the element are kept (the element reads them on upgrade).
 * Status (every mode): read-only `status` (SvgImageStatus: 'waiting' until the first outcome, then 'ready' when drawn
 * or 'missing' in the missing-picture state; a retry or provider event can move it either way), reflected as the
 * host attribute `status`. Each change away from 'waiting' fires SVG_IMAGE_STATUS_EVENT on the host, not bubbling,
 * not composed, detail { status }. The image view uses it for its missing state; the dashboard needs nothing else.
 * Shadow root: a stage box with the drawing's aspect ratio, sized inside the host by `fit` (contain: largest box
 * that fits, centred; cover: smallest box that covers, clipped by the host; fill: the host box, drawing stretched
 * with preserveAspectRatio none; none: viewBox units as CSS px, centred, clipped). The drawing (a clone of the cached
 * template) is put in the stage once per (id, updated_at); its ids are scoped by the shadow root and looked up with
 * ShadowRoot.getElementById (ids may hold "."). A <slot> in the stage holds overlays, beside the drawing's <svg>.
 * The host fills the box its parent gives it (height 100 %, size container); the parent gives it a box (the image
 * module's aspect_ratio, the layer's picture box).
 * Colours: Main is var(--mc-image-main), Accent var(--mc-image-accent); the host sets both from `colors` (design
 * colour values through the card's colour helper; defaults var(--primary-text-color) and var(--accent-color)).
 * Theme colours are var(--<name>) and inherit from the card, card-level themes and card_mod variables included.
 * Static: no animation, no fade-in, no CSS transition on bound parts, no timer while nothing changes, no observer
 * beyond the card's own; idle CPU equals a plain card.
 * Accessible name: with `description` set, the drawing's <svg> gets role="img" and aria-label = description; without
 * it, the <svg> is aria-hidden (decorative). role="img" is never put on the host or the stage, so overlays stay
 * reachable. With `stateSummary` on and bindings present, a visually hidden list follows the stage: one item per
 * bound entity (deduplicated, binding order), "<friendly name>: <state as HA formats it>", updated by the engine's
 * change step only. Overlays carry their own names.
 * pointOf(partId): the centre of a drawing part's box in percent of the viewBox (ImagePoint), or undefined; for the
 * overlay editor's "place on part".
 * The image module's box keeps the config's aspect_ratio from the first render (the editor writes the drawing's
 * ratio when an image is picked), so the late chunk moves nothing.
 *
 * ── In a background layer (`layer` set) ──
 * <mc-bg-stack> renders the element inside the layer's picture box (bg-stack 1.2.0); the element fills that box
 * (position absolute on all four sides). Box, opacity, blend, blur, crossfade and pan / zoom stay the stack's.
 * From `layer` the element reads only:
 *   size      cover -> fit cover; contain -> fit contain; auto -> fit none; "<n>%" -> fit contain with the stage at
 *             n % of the layer's width (aspect kept); anything else -> cover (the bg-stack default);
 *   position  LayerAnchor or "<x>% <y>%": where the stage sits in the layer box, as background-position places a
 *             picture; default center;
 *   repeat    ignored (a drawing is drawn once); the layer editor hides Repeat for library images.
 * colors, description, stateSummary and overlays do not apply: Main and Accent take their defaults, the drawing's
 * <svg> is always aria-hidden and no state list is rendered (the stack host is aria-hidden; backgrounds are
 * decorative). Bindings apply exactly as in the image module.
 * Status for the editor: besides SVG_IMAGE_STATUS_EVENT, the element fires bg-stack BG_LAYER_STATUS_EVENT (bubbles,
 * composed) with index = `at`: { status: 'error', reason: 'image-missing' } when it enters the missing-picture state,
 * { status: 'ok' } when it has drawn. The dashboard ignores it.
 * State swaps: when a layer's `states` or `image` hold several references, the element prefetches the other
 * references of its `layer` (at most MAX_LAYER_PREFETCH distinct ids, at idle time after its own first draw) into the
 * page cache, so a swap is a cache hit (measured 44 ms at 4x for the 256 KiB fixture, inside the stack's 300 ms
 * crossfade).
 *
 * ── Image sanitiser (browser; Magic Card Utils checks the same lists on save) ──
 * Input: a string of at most IMAGE_MAX_BYTES UTF-8 bytes (refused before parsing, `too_large`). Then, still before
 * parsing, refused (`unsafe_markup`) when the text holds any of IMAGE_TEXT_DENY (case-insensitive; the markup items of
 * Magic Card Utils TEXT_DENY except comments, which the parse drops), with the one file-mode CDATA case below. With
 * { file: true } (editor and transfer imports of .svg files only) a leading prolog is removed first by a linear scan:
 * a byte order mark, one `<?xml ...?>` declaration, comments, and one `<!DOCTYPE svg ...>` that holds no "[" (no
 * internal subset); a DOCTYPE with "[" is refused. Library markup and card renders never take that option.
 * CDATA in a style element (pending, with the svg-safety CSS paint resolver; until it lands every CDATA is refused):
 * IMAGE_TEXT_DENY keeps `<![cdata[`. Only with { file: true } does the pre-parse scan accept one exact-case
 * `<![CDATA[` when all of these hold: the text from the previous `<` matches `^<style(?:[ \t\r\n][^<>]*)?>[ \t\r\n]*$`;
 * the matching `]]>` exists; the content holds no `<`; and only ASCII whitespace, then `</style`, optional whitespace
 * and `>` follow. Each occurrence is found with indexOf (linear). Any other CDATA, any case variant, a second CDATA in
 * one style element, or CDATA without { file: true }: `unsafe_markup`, as before.
 * Parsed with DOMParser as image/svg+xml (text/html fallback, inert). Root <svg> with a valid viewBox (width and height
 * 1..MAX_IMAGE_BOX); root width / height dropped. At most IMAGE_MAX_NODES elements and IMAGE_MAX_DEPTH nesting, else
 * refused. Hostile tests cover both the XML parse and the text/html fallback parse.
 * One result for both parses: a drawing the XML parse does not take (a root <svg> without xmlns, for one) and the
 * text/html fallback reads goes through the same walk and the same lists, so it is stripped and listed exactly like
 * the same drawing with xmlns. A <script> (or any other dropped part) in a drawing without xmlns is removed and named
 * in `stripped`; it never turns the whole drawing into an error. Elements the HTML parser moves out of the root <svg>
 * (foreign-content breakout, e.g. a <p> or <img> inside the drawing) are not kept and are named in `stripped` too.
 * `empty` means nothing drawable is left after the walk, and that result still carries `stripped`. Each hostile
 * fixture runs with and without xmlns and must give the same error (or none) and the same `stripped` names; a fixture
 * with breakout tags may keep less in the fallback, never more.
 * Kept: elements in IMAGE_ELEMENTS, attributes in IMAGE_ATTRIBUTES (no namespaced names), values by these rules:
 *   - paint (fill, stroke, stop-color): none | currentColor | a colour (hex, a CSS colour keyword of 3 to 20 ASCII
 *     letters, or the colour functions the icon sanitiser allows) | url(#id) | var(--name) | var(--name, <hex>) with
 *     name matching THEME_VAR_NAME_RE. A var() fallback is a hex colour (#rgb to #rrggbbaa) and nothing else: no
 *     colour keyword, no colour function, no nested var(). This is the Magic Card Utils VAR_RE rule; a paint with
 *     any other fallback is dropped and listed like any other refused value, so it never reaches a save;
 *   - transform / gradientTransform: the transform list functions only;
 *   - font-family: one of IMAGE_FONT_FAMILIES (anything else becomes sans-serif); no @font-face exists anywhere;
 *   - id: IMAGE_ID_RE; data-name: plain text, at most 80 characters;
 *   - every value: no backslash, `<`, `>`, `//`, comment, `javascript:`, `data:`, `expression(`, `@import`, and every
 *     "(" opens an allowed function;
 *   - text content only inside <text>, <tspan> and <title>, escaped, at most IMAGE_MAX_TEXT_CHARS per element.
 * Dropped and listed (`stripped`): anything else, including script, foreignObject, image, use, a, filter, pattern,
 * animate*, set, event attributes, href / xlink:href, external or cross-origin url(); style attributes, style
 * elements and a gradient's href as in "Styles and gradient href" below.
 * Styles and gradient href (pending, with the svg-safety CSS paint resolver; until it lands style attributes, style
 * elements and every href / xlink:href are dropped and listed as above):
 *   - after parse and viewBox, before the walk, on every call, the sanitiser runs svg-safety resolveCss with
 *     IMAGE_POLICY. Allowed declarations of style attributes and of simple type, class and id rules in style elements
 *     (fill, stroke, stop-color, the opacities, the stroke and rule properties of svg-safety SvgCssProperty, local
 *     url(#id) gradient paint) become plain attributes, which then pass the value rules above like any attribute. CSS
 *     paint never takes var(). All other CSS (at-rules, other selectors, other properties) is dropped.
 *   - a linearGradient or radialGradient whose href / xlink:href points at a local gradient gets shallow copies of
 *     that gradient's stops (svg-safety, "Gradient href"); the href is then removed.
 *   - listed: `<element>@style` only when one of its declarations was dropped, `style` only when part of a style
 *     element was dropped, the gradient's href when it did not resolve. Fully resolved parts are not listed. A style
 *     element the HTML parser moved out of the drawing is listed as `style`.
 *   - the resolver's too_complex is `too_complex`; serialised output over IMAGE_MAX_BYTES is `too_large` (Magic Card
 *     Utils would refuse it on save).
 *   - output never holds a style attribute, a style element, CDATA or a comment. Magic Card Utils keeps refusing all
 *     of them on save, so a client that skips resolution fails closed.
 * The editor import and the transfer import show the list; the card renders silently. A result with nothing
 * drawable is an error. The card sanitises every markup it receives from the library before its first render.
 * Output: the sanitiser's serialiser writes xmlns="http://www.w3.org/2000/svg" (mcu-library-images IMAGE_ROOT_XMLNS) on
 * the root <svg> and on no other element. Everything the sanitiser and its serialiser emit passes Magic Card Utils
 * validation unchanged (mcu-library-images, "Card output passes"); a shared conformance test saves real serialiser
 * output through the server's validate_image.
 *
 * ── Bindings (inside the saved image) ──
 * SavedImage.bindings: at most MAX_IMAGE_BINDINGS entries, each targeting an element id of the markup. A target may
 * carry several bindings with different `set`, at most one per (target, set).
 *   target   element id (IMAGE_ID_RE) present in the markup; unknown targets are ignored
 *   entity   entity id
 *   attribute optional; compares the attribute instead of the state
 *   set      'fill' | 'stroke' | 'opacity' | 'visible'
 *   rules    at most MAX_BINDING_RULES; first match wins: { state: string } exact (also 'unavailable' and 'unknown'),
 *            or { above?: number, below?: number } on the numeric value (above < value < below; a non-numeric value
 *            never matches), each with `value`
 *   default  optional value used when the entity is missing or no rule matches; without it the element keeps the
 *            drawn value
 * Values: fill / stroke: a hex colour, `theme:<name>` (THEME_VAR_NAME_RE without the dashes), `main`, `accent` or
 * `entity` (the bound entity's state colour, entity-colour 1.x); opacity: 0..100; visible: boolean.
 * Engine: on each hass update the element reads only the bound entities, builds a key of their states and returns
 * at once when it is unchanged; otherwise it sets the changed targets' presentation attribute (fill, stroke, opacity,
 * visibility) on the cached element nodes, at once (no transition). Applies are spaced at least
 * BINDING_MIN_INTERVAL_MS apart per element: the first change after a quiet spell applies at once, changes inside the
 * interval collapse into one trailing apply of the latest states (at most 3 visible changes a second: WCAG 2.3.1,
 * and a chatty sensor costs at most 3 applies a second). The trailing apply is the only timer; it is cleared on
 * disconnect. No re-parse, no template re-render of the drawing, no error or text shown on the card for a missing or
 * unavailable entity.
 *
 * ── Overlays (in the card) ──
 * The image module is a container: `modules: CardModule[]` (at most MAX_IMAGE_OVERLAYS), each with
 *   point: { x: 0-100, y: 0-100 }   percent of the drawing (viewBox), the overlay's centre sits there; default 50 / 50;
 *                                   values outside are clamped
 * Types drawn: IMAGE_OVERLAY_TYPES (icon; info as the badge / state label; button). Other types are not drawn on
 * the drawing (the editor offers only these and shows a hint for others). The image view renders each child through
 * renderChildModule (actions, confirmation, keyboard, entity scope, design: as the same module elsewhere) inside a
 * wrapper `.mc-image-point` slotted into the stage: position absolute at left x % / top y % of the stage, translate
 * -50 % -50 %. Overlays keep their module size at every card size. The focus ring on an overlay is two-tone (light
 * inner, dark outer) so it shows on any artwork. A child with actions and no accessible name gets aria-label = its
 * entity's friendly name, else its type's label. Tab order is list order; stacking follows list order too.
 * `placement` / `layer` on these children are ignored. The overlay stays on its point at every card size because the
 * stage is the drawing's box.
 * Config walk, needs() predicates, the tree editor and entity scope see these children like any container's.
 */

export const SVG_IMAGE_CONTRACT = '1.0.0';
export const SVG_IMAGE_CONTRACT_REVISION = 5;

export const IMAGE_REF_PREFIX = 'mcu-image:';
export const IMAGE_REF_RE = /^mcu-image:([a-z0-9][a-z0-9_-]{0,63})$/;

export const SVG_IMAGE_CHUNK = 'svg-image';
export const SVG_IMAGE_CHUNK_FILE = 'magic-card-svg-image.js';
export const SVG_IMAGE_CHUNK_CEILING = 40 * 1024;
export const SVG_IMAGE_TAG = 'mc-svg-image';
export const SVG_IMAGE_STATUS_EVENT = 'mc-svg-image-status';

/** The only editor-side files that import() the svg-image chunk entry (see "Chunk"); each reads `api` only. */
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

/** Render budget lines (see "Render budget"); measured limits for tests, not runtime values. */
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

export interface SanitizeOptions {
  /** A .svg file the user opened or imported: a leading prolog may be removed first (see above). */
  file?: boolean;
}

export interface SanitizedImage {
  /** `<svg viewBox>…</svg>`, empty on error. */
  markup: string;
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
  /** Set by <mc-bg-stack> only: the element is a background layer's drawing (see above). */
  layer?: BackgroundLayerConfig;
  /** With `layer`: its YAML index, for the status event. */
  at?: number;
  /** Read-only (see "Status"). */
  readonly status: SvgImageStatus;
}

/** Entry helper (src/utils/svg-image-loader.ts): start the chunk and tell the render it was met. */
export type NeedSvgImage = (ctx: { metChunk?(name: 'svg-image'): void } | undefined) => void;

type CallWS = (msg: Record<string, unknown>) => Promise<unknown>;

/** What the svg-image chunk exports as `api`. */
export interface SvgImageApi {
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
