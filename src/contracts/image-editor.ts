import type { HomeAssistant } from '../types';
import type { ImageBinding, SavedImageInput } from './mcu-library-images';

/*
 * Contract: image editing. Version 1.1.0 (IMAGE_EDITOR_CONTRACT), revision 6 (IMAGE_EDITOR_CONTRACT_REVISION).
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
 * ── In <mc-svg-editor> (svg-editor 1.1.0, SVG_EDITOR_CONTRACT_REVISION 6) ──
 *   SvgEditorSource holds three image sources:
 *     { kind: 'image-blank'; width?: number; height?: number }   no size: the canvas-size step opens first
 *     { kind: 'image'; id: string }                              a library image
 *     { kind: 'image-svg'; svg: string }                         a file opened as a new image
 *   An image source loads image-editor and svg-image before the first canvas render (the shell shows its loading
 *   state; a failed load shows the shell's load error with Retry), then calls createImageExt and hands every
 *   image-only decision to it. Icon sources never load image-editor.
 *   Image mode: canvas = the image's viewBox (presets IMAGE_CANVAS_PRESETS or custom, each side 16..MAX_IMAGE_BOX),
 *   grid default = longest side / 48 rounded to the SVG_GRID_STEPS-like ladder, safe area off, "In Home Assistant"
 *   preview off, icon-only actions hidden (Dual-tone, HA form). Every existing tool (shapes, pen, booleans, align,
 *   distribute, arrange, layers, groups, handles, context menu) works unchanged on the bigger box. Export in image
 *   mode downloads ext.exportFile(); the shell's own svg Blob is made for icon markup only.
 *   While a layer is dragged, moved by handles or nudged in a burst, the moved elements carry
 *   `will-change: transform`; it is removed when the gesture ends.
 *   Save targets: library only (images have no inline copy). Event detail for image saves:
 *     mc-svg-save { target: 'image-library', saved: SavedImageInput }.
 *   Save shortcut: Control+S, and Command+S on macOS; tooltips name the platform's key.
 *   Hosts: 'mcu' (panel Images tab, Library tab) and 'card' (opened from an image field by <mc-library-image-field>).
 *   Without Magic Card Utils, or for a non-admin user, image mode opens read-only: no Save, Rename or Delete; the
 *   reason is shown (install Magic Card Utils through HACS / ask an administrator).
 *   Touch and pen: pointer events throughout; the stage has touch-action: none. One finger or a pen uses the active
 *   tool, two fingers pan and pinch-zoom, a Pan tool exists for one-finger panning, and the layer list selects any
 *   layer as the fallback for small parts. On-canvas text has on-screen Done and Cancel.
 *
 * ── Image start window ──
 *   The window that opens for an 'image-blank' source without a size (the canvas-size step: presets, custom W x H)
 *   also offers Open file: a labelled button in its tab order, in front of an <input type=file
 *   accept=".svg,image/svg+xml">, with a help line. The file passes Import's gate before the text is read: the name
 *   ends in .svg or file.type is image/svg+xml, and File.size <= MAX_IMAGE_IMPORT_BYTES (8 MB); then file.text().
 *   Refusals use Import's words ("Choose an SVG file.", "That file is too big to open (over 8 MB). Try a smaller
 *   copy.") and "The file could not be read." when the read fails. When the window was closed, or Create was pressed,
 *   while the file was being read, the result is dropped and the document stays as it is.
 *   The text then goes the way of the { kind: 'image-svg', svg: text } source, which is read exactly like Import:
 *   api.sanitizeImage(text, { file: true }), then the import summary and the locked-part rules below; the sanitiser's
 *   IMAGE_MAX_BYTES (256 KiB) still applies after the 8 MB file gate, so a 2 MB file passes the gate and is then
 *   refused by the sanitiser with its size message. A refusal keeps the start window open with the reason in its
 *   role=alert line and changes nothing; the window, the shell and the image editor never parse, rewrite or draw the
 *   text before the sanitiser, and it never reaches unsafeSVG. The same SVG file gives the same drawing and summary
 *   here, through Import and through the Magic Card Utils Images import (preset-transfer 1.3.0, "SVG files as
 *   images"). A file named .svg that holds JSON is refused here by the sanitiser; the Images import refuses it with
 *   its own name message (preset-transfer "File names").
 *   Keyboard: every control reachable by Tab, visible focus, 24 x 24 px targets; results in the polite live region.
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
 *     canvas with opacity 0..100, position, scale, rotation (degrees) and a hide toggle. The picture is decoded
 *     (createImageBitmap) and drawn into a <canvas> in page memory, and the bitmap is closed; no object URL, data: URL
 *     or other URL is ever made for it. Remove picture and closing the editor set that canvas to 0 x 0 and drop it.
 *     The picture is never written to the document, the markup, the history, the save payload, the export file,
 *     localStorage or any request. Only the alignment numbers
 *     (x, y, scale, rotation, opacity) are kept in localStorage under REFERENCE_ALIGN_KEY_PREFIX + image id, and
 *     applied when a picture is picked again for that image.
 *   - Import: .svg files (the name ends in .svg or file.type is image/svg+xml, and File.size <= MAX_IMAGE_IMPORT_BYTES,
 *     checked before the text is read) through
 *     api.sanitizeImage(text, { file: true }). The import summary names each kind of stripped part once, without
 *     counts ("Removed scripts, event handlers."), or says nothing was removed. Text, tspan and gradients open as
 *     text layers and gradient paints. Nothing drawable is dropped: each run of adjacent sibling elements the editor
 *     cannot edit becomes one locked "Imported part" layer, in its place in the stacking order, with its own id (the
 *     element's id when it matches IMAGE_ID_RE and is free, else a new one) and a data-name. It is drawn on the
 *     canvas from api.fragment() and saved as its sanitised markup; defs it references are kept once in the saved
 *     <defs>. A locked part can be selected, renamed, reordered, hidden and deleted; it cannot be reshaped, moved or
 *     repainted, and booleans skip it with the reason shown. The summary's second line says such parts are kept as
 *     locked layers. Library images are read the same way, so an image with such parts opens editable. A locked part
 *     can be bound for opacity and visibility only; colour and outline colour show the reason ("This part keeps its
 *     own colours").
 *   - Imported part, saved form (part of the stored image format; reopening depends on it): each visible locked part
 *     layer is written as one group
 *       <g id="<layer id>" class="IMAGE_PART_CLASS" data-name="<layer name>"> <the part's markup> </g>
 *     in its place in the stacking order. id is the layer id (IMAGE_ID_RE); class is exactly IMAGE_PART_CLASS and is the
 *     only attribute that marks a part; data-name is the layer name with < > " & \ and control characters removed, at
 *     most 80 characters. Inside it, the part's markup is the held elements with the attributes of the groups that
 *     were above them in the source wrapped round them as plain <g> elements. The definitions (clip paths, masks,
 *     gradients, and the ones those refer to) that the written parts use are written once each in the root <defs>.
 *     Reopening: a <g> whose class attribute is exactly IMAGE_PART_CLASS, at any depth the reader walks, is read back
 *     as one locked part layer whose content is the group's children, with the group's id and data-name as the
 *     layer's id and name; it is never joined to a neighbouring part. Any other class value has no meaning. On cards
 *     the group is a plain <g> (the card sanitiser keeps `class`; no style refers to it). Bindings on a part target
 *     the group's id (opacity and visibility only).
 *   - Part-data limit: the total of all part layers' markup plus, for each part, the definitions it uses (a definition
 *     shared by several parts is counted once per part that uses it) is at most IMAGE_PART_DATA_MAX, counted as
 *     string length (UTF-16 code units). Over it, nothing is turned into part layers: a library image opens view-only
 *     with the editor's view-only reason ("This image has parts that this editor cannot change yet, so it opens for
 *     viewing only."), and an SVG import is refused with "That file cannot be used as an image." and changes nothing.
 *     The check covers the sum of every part, the last one included.
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
 *   TransferKind holds 'image'. <mc-library-view> lists images (thumbnail, name, size, binding count) in the
 *   'mcu-panel' and card contexts; kinds ['image'] for the Images tab and the field picker. Rename = images_save with
 *   the item fetched by images_get (same id); Duplicate = images_get, then images_save under a new name and id;
 *   delete = images_delete; export writes an envelope with kind 'image' items (data = SavedImageInput without thumb),
 *   one item or all images ("Export all"); import re-sanitises every item (stripped parts listed), checks bindings,
 *   and saves through images_save (clash: Replace / Keep both). No versions are kept. Envelopes with image items are
 *   JSON only and may be up to MAX_IMAGE_IMPORT_BYTES; other envelopes keep MAX_IMPORT_BYTES. Plain .svg files open
 *   in the editor and, where the panel accepts images only, import as images (preset-transfer 1.3.0, "SVG files as
 *   images"). Without Magic Card Utils, importing an image is refused with the install hint (cards keep no copy).
 */

export const IMAGE_EDITOR_CONTRACT = '1.1.0';
export const IMAGE_EDITOR_CONTRACT_REVISION = 6;

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

/** The class that marks an imported part's group in the saved markup (section "Imported part, saved form"). */
export const IMAGE_PART_CLASS = 'mc-part';
/** Most part data of one image, in UTF-16 code units (section "Part-data limit"). */
export const IMAGE_PART_DATA_MAX = 2 * 256 * 1024;

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
