import type { HomeAssistant } from '../types';
import type { ImageBinding, SavedImageInput } from './mcu-library-images';

/*
 * Contract: image editing. Version 1.0.0.
 * Full drawings are edited in the existing <mc-svg-editor> (svg-editor 1.1.0) in image mode. Image-only parts live in two
 * editor chunks so the svg-editor chunk grows only by the seam:
 *   - image-editor (dist/magic-card-image-editor.js, entry src/image-editor/chunk.ts): a child of the svg-editor chunk
 *     (literal import() in src/svg-editor/image-loader.ts, a registered import() site). It exports
 *     createImageExt(host): ImageEditorExt. Ceiling IMAGE_EDITOR_CHUNK_CEILING.
 *   - image-tools (dist/magic-card-image-tools.js, entry src/image-tools/chunk.ts): a child of the card-editor chunk
 *     (literal import() in src/editor/image-tools-loader.ts, a registered site). It defines <mc-library-image-field> and
 *     <mc-image-overlays>. Ceiling IMAGE_TOOLS_CHUNK_CEILING.
 * Both use the sanitiser, the image cache and every SVG sink for library-image markup through the svg-image card
 * chunk's `api` (svg-image 1.0.0), never their own copy. image-editor, image-tools and the transfer chunk hold no SVG
 * sink: no unsafeSVG, no Blob of type image/svg+xml, no value import of a sanitiser. Imported parts and previews are
 * drawn from api.fragment() nodes or <mc-svg-image>; thumbnails come from api.thumbnail(); image export files from
 * api.fileBlob(). Strings: i18n namespace 'image-editor' (en-GB ids, en-US and nl complete).
 *
 * ── svg-editor 1.1.0 (additive; SVG_EDITOR_CONTRACT_REVISION 6) ──
 *   SvgEditorSource gains
 *     { kind: 'image-blank'; width?: number; height?: number }   no size: the canvas-size step opens first
 *     { kind: 'image'; id: string }                              a library image
 *     { kind: 'image-svg'; svg: string }                         a file opened as a new image
 *   An image source loads image-editor and svg-image before the first canvas render (the shell shows its loading
 *   state; a failed load shows the shell's load error with Retry), then calls createImageExt and hands every
 *   image-only decision to it. Icon sources behave exactly as before and never load image-editor.
 *   Image mode: canvas = the image's viewBox (presets IMAGE_CANVAS_PRESETS or custom, each side 16..MAX_IMAGE_BOX),
 *   grid default = longest side / 48 rounded to the SVG_GRID_STEPS-like ladder, safe area off, "In Home Assistant"
 *   preview off, icon-only actions hidden (Dual-tone, HA form). Every existing tool (shapes, pen, booleans, align,
 *   distribute, arrange, layers, groups, handles, context menu) works unchanged on the bigger box. Export in image
 *   mode downloads ext.exportFile(); the shell's own svg Blob is made for icon markup only.
 *   While a layer is dragged, moved by handles or nudged in a burst, the moved elements carry
 *   `will-change: transform`; it is removed when the gesture ends.
 *   Save targets: library only (images have no inline copy). New event detail for image saves:
 *     mc-svg-save { target: 'image-library', saved: SavedImageInput }.
 *   Save shortcut: Control+S, and Command+S on macOS; tooltips name the platform's key.
 *   Hosts: 'mcu' (panel Images tab, Library tab) and 'card' (opened from an image field by <mc-library-image-field>).
 *   Without Magic Card Utils, or for a non-admin user, image mode opens read-only: no Save, Rename or Delete; the
 *   reason is shown (install Magic Card Utils through HACS / ask an administrator).
 *   Touch and pen: pointer events throughout; the stage has touch-action: none. One finger or a pen uses the active
 *   tool, two fingers pan and pinch-zoom, a Pan tool exists for one-finger panning, and the layer list selects any
 *   layer as the fallback for small parts. On-canvas text has on-screen Done and Cancel.
 *
 * ── ImageEditorExt (what image-editor gives the shell) ──
 *   - Canvas size step and Canvas size action (presets, custom W x H, keep ratio, content stays where it is). Cards
 *     that already wrote an aspect_ratio keep it; the card field offers to update it (below).
 *   - Paint: None, Main, Accent, hex colour (with alpha), theme colour (IMAGE_THEME_COLOURS list plus a typed
 *     --name), linear and radial gradient (2..8 stops, each stop any of the solid paints, angle or centre/radius
 *     handles on the canvas and as fields); opacity per layer 0..100; stroke dashes (presets and a typed list,
 *     dash offset). The saved markup uses the forms svg-image.ts allows: var(--mc-image-main), var(--mc-image-accent),
 *     var(--<name>), hex, url(#<gradient id>).
 *   - Text layers: a Text tool (click or tap to place, type in an on-canvas field; Enter or Done commits, Esc or
 *     Cancel cancels), size, weight, italic, alignment (start, middle, end), letter spacing, family from
 *     IMAGE_FONT_FAMILIES, multi-line as <tspan> lines. Text is a layer in the layer list (name = first characters),
 *     selectable, movable, alignable, paintable like a shape; booleans skip text layers with the reason shown.
 *   - Layer ids: every layer element gets a stable id (IMAGE_ID_RE) and a data-name with the layer name; ids survive
 *     save, reopen and rename, so bindings keep their targets. Every layer can be bound.
 *   - Reference underlay: "Reference picture" picks a local file. Before reading it: file.type is a raster type in
 *     REFERENCE_TYPES and file.size <= REFERENCE_MAX_FILE_BYTES, else refused with a plain reason. A picture with a
 *     side over REFERENCE_MAX_SIDE is scaled down in the browser (never refused for its pixel count). Shown behind the
 *     canvas with opacity 0..100, position, scale, rotation (degrees) and a hide toggle. The picture is held as an
 *     object URL in page memory and revoked when the editor closes; it is never written to the document, the markup,
 *     the history, the save payload, the export file, localStorage or any request. Only the alignment numbers
 *     (x, y, scale, rotation, opacity) are kept in localStorage under REFERENCE_ALIGN_KEY_PREFIX + image id, and
 *     applied when a picture is picked again for that image.
 *   - Import: .svg files through api.sanitizeImage(text, { file: true }); the import summary lists stripped parts;
 *     text, tspan and gradients open as text layers and gradient paints; anything not editable stays as one locked
 *     "Imported part" layer with its own id, drawn from api.fragment(). A locked part can be bound for opacity and
 *     visibility only; colour and outline colour show the reason ("This part keeps its own colours").
 *   - Bindings panel (Entity tab of a selected layer): entity picker, attribute (optional), what changes (colour,
 *     outline colour, visibility, opacity), rules list (state equals / number range -> value), default value, a live
 *     preview against the current hass, and "Test with state" to preview a state without changing anything, with a
 *     text line naming the result. "Start with on / off" adds rules for on, off and unavailable (unavailable: grey and
 *     lower opacity, so it is not shown by colour alone). "Copy this connection to..." applies one rule set to other
 *     layers, each with its own entity. A layer with bindings shows a link marker in the layer list. Bindings are
 *     part of the saved image (ImageBinding[]) and apply on every card that shows the image, backgrounds included.
 *     Warnings about missing entities appear in the editor only.
 *   - Save: name, keywords, optional author / description; a new image's id is the slug of its name (IMAGE_ID_SLUG:
 *     lower-case a-z, 0-9 and "-", at most 48 characters, "image" when empty) with "-2", "-3"... when images_list
 *     already holds it; the id never changes after the first save. "Save as a copy" (Save menu) saves under a new
 *     name and id. A size meter (svg + bindings against IMAGE_MAX_BYTES) is always visible in image mode with its
 *     state in words; a refused save shows the server's reason and the size; library_full names the limit. The
 *     editor makes `thumb` through api.thumbnail(markup, THUMB_SIDE_PX, THUMB_MAX_BYTES) (omitted when the browser
 *     cannot draw it).
 *   - Export: exportFile() returns api.fileBlob(saved markup).
 *   - Keyboard and zoom: every action has a button or menu item; the Text tool, gradient handles and the underlay have
 *     fields; works at 200 % zoom (WCAG 2.2 AA: 2.1.1, 2.1.2, 2.1.4, 2.4.7, 2.5.7, 2.5.8, 1.4.10, 1.4.13, 4.1.2,
 *     4.1.3). Repeated row controls carry names with the row ("Rule 2: move up").
 *
 * ── Card editor (image-tools) ──
 *   <mc-library-image-field>: replaces the plain image input of the image module editor and of image background layers
 *   (also each `states` value). Choices: "Library image" (picker over images_list with thumbnails, search, keyboard;
 *   opened by a Choose button, never by selecting the choice), "Draw a new image", "Edit image" (opens
 *   <mc-svg-editor host="card"> on the item), and the existing URL / media choices. It shows the reference string with
 *   a Copy button and, for an image with bindings, the entities it uses (unknown ones marked). Picking writes
 *   `mcu-image:<id>`; for the image module it also writes `aspect_ratio` from the viewBox (reduced, e.g. 16:9) when the
 *   module has none or the user agrees to replace it, and shows a Colours row (Main, Accent) writing `colors`, a
 *   Description field writing `description` and, for images with bindings, a "State summary for screen readers"
 *   switch writing `state_summary`. When the module's aspect_ratio differs from the drawing's, the field offers
 *   "Use the drawing's shape". A canvas resize never rewrites a card's aspect_ratio.
 *   In a background layer field the drawing is live too (its bindings apply). The field says, in one line, that
 *   backgrounds are decorative (screen readers skip them, they cannot hold buttons) and offers "Add an image module
 *   behind the content" for buttons, badges and a description; the action adds an image module with
 *   `placement: background` and the same reference. For a library image the layer editor hides Repeat and the
 *   Colours row (backgrounds use the default Main and Accent). The studio's layer status maps reason
 *   `image-missing` (bg-stack 1.2.0) to "This image is no longer in the library". A missing item shows "This image is
 *   no longer in the library" with Pick another.
 *   <mc-image-overlays>: the image module's Overlays section: Add icon, Add badge (info), Add button; a placement pad
 *   (the drawing with markers, drag or tap to place, arrow keys move 1 %, Shift+arrow 10 %); X and Y fields in %;
 *   "Place on part..." fills X and Y from <mc-svg-image>.pointOf(part); on touch a new overlay focuses its marker,
 *   not a field. The list order is the tab order and the stacking order; each overlay opens its own module editor
 *   (module-editor 1.0.0) for entity, tap action, confirmation and design; a new Button with a light, switch or fan
 *   entity defaults to toggle. The tree editor lists the overlays as the image module's children (container slot
 *   `modules`).
 *   The card-editor chunk only loads image-tools and mounts the two elements; it holds none of their code.
 *
 * ── Library view (preset-transfer 1.1.0) ──
 *   TransferKind gains 'image'. <mc-library-view> lists images (thumbnail, name, size, binding count) in the
 *   'mcu-panel' and card contexts; kinds ['image'] for the Images tab and the field picker. Rename = images_save with
 *   the item fetched by images_get (same id); Duplicate = images_get, then images_save under a new name and id;
 *   delete = images_delete; export writes an envelope with kind 'image' items (data = SavedImageInput without thumb),
 *   one item or all images ("Export all"); import re-sanitises every item (stripped parts listed), checks bindings,
 *   and saves through images_save (clash: Replace / Keep both). No versions are kept. Envelopes with image items are
 *   JSON only and may be up to MAX_IMAGE_IMPORT_BYTES; other envelopes keep MAX_IMPORT_BYTES. Plain .svg files open
 *   in the editor instead. Without Magic Card Utils, importing an image is refused with the install hint (cards keep
 *   no copy).
 */

export const IMAGE_EDITOR_CONTRACT = '1.0.0';
export const IMAGE_EDITOR_CONTRACT_REVISION = 3;

export const IMAGE_EDITOR_CHUNK = 'image-editor';
export const IMAGE_EDITOR_CHUNK_FILE = 'magic-card-image-editor.js';
export const IMAGE_EDITOR_CHUNK_CEILING = 96 * 1024;
export const IMAGE_TOOLS_CHUNK = 'image-tools';
export const IMAGE_TOOLS_CHUNK_FILE = 'magic-card-image-tools.js';
export const IMAGE_TOOLS_CHUNK_CEILING = 32 * 1024;

export const IMAGE_CANVAS_PRESETS: readonly { ratio: string; width: number; height: number }[] = [
  { ratio: '1:1', width: 1024, height: 1024 },
  { ratio: '4:3', width: 1280, height: 960 },
  { ratio: '16:9', width: 1920, height: 1080 },
  { ratio: '9:16', width: 1080, height: 1920 },
];
export const IMAGE_CANVAS_MIN = 16;
export const IMAGE_THEME_COLOURS: readonly string[] = [
  '--primary-color', '--accent-color', '--primary-text-color', '--secondary-text-color', '--disabled-text-color',
  '--card-background-color', '--primary-background-color', '--secondary-background-color', '--divider-color',
  '--state-icon-color', '--error-color', '--warning-color', '--success-color', '--info-color',
];
export const THUMB_SIDE_PX = 320;
export const MAX_IMAGE_IMPORT_BYTES = 8 * 1024 * 1024;

/** New image ids: the slug of the name. */
export const IMAGE_ID_SLUG = /^[a-z0-9](?:[a-z0-9-]{0,47})$/;

export const REFERENCE_TYPES: readonly string[] = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/bmp'];
export const REFERENCE_MAX_FILE_BYTES = 64 * 1024 * 1024;
export const REFERENCE_MAX_SIDE = 4096;
export const REFERENCE_ALIGN_KEY_PREFIX = 'mc-image-reference:';

/** What the shell hands createImageExt. */
export interface ImageEditorHost {
  hass: HomeAssistant | undefined;
  host: 'mcu' | 'card';
  /** Library writes allowed (Magic Card Utils present and the user is an admin). */
  canWrite: boolean;
  requestUpdate(): void;
}

/** Seam between <mc-svg-editor> and the image-editor chunk; shapes of the parts are internal to the two folders. */
export interface ImageEditorExt {
  readonly revision: number;
  /** Paint, text and gradient attributes for the saved markup of one layer. */
  serialiseLayer(layer: unknown): string;
  /** Layers from imported markup (text, gradients, locked parts) the icon importer does not handle. */
  importParts(markup: string): unknown[];
  bindings(): ImageBinding[];
  /** Builds the save payload (sanitised markup, bindings, thumb) or the reason it cannot be saved. */
  buildSave(meta: { id: string; name: string }): Promise<{ ok: true; input: SavedImageInput } | { ok: false; reason: 'too_large' | 'full' | 'invalid'; bytes?: number }>;
  /** The drawing as a download (api.fileBlob); undefined when nothing is drawable. */
  exportFile(): Blob | undefined;
  dispose(): void;
}
