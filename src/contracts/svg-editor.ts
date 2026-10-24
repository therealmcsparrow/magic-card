import type { CustomShapeOptions } from './custom-shape';
import type { ShapeOptions } from '../types';
import type { SavedIconInput, SavedShape } from './mcu-library';
import type { SavedImageInput } from './mcu-library-images';
import type { BooleanOp } from './path-booleans';

/*
 * Contract: svg editor. Version 1.0.0.
 *
 * SVG editor and shape editor hosts. Two lazy chunks of the magic-card entry, each loaded by the
 * card-editor chunk (never by magic-card.js, which gains 0 B from them):
 * - module `svg-editor`, src/svg-editor/, chunk SVG_EDITOR_CHUNK_FILE, element SVG_EDITOR_TAG.
 * - module `shape-editor`, src/shape-editor/, chunk SHAPE_EDITOR_CHUNK_FILE, element SHAPE_EDITOR_TAG.
 * Both import() the path-canvas chunk (path-canvas 1.0.0) when they need it and take the editor-only
 * path-model parts (edit, tidy, draw) from its exports (one copy rule).
 * Neither imports src/path/edit.ts, tidy.ts or draw.ts (import scan test). Both import() the
 * path-booleans chunk (path-booleans 1.0.0) through src/path-booleans/loader.ts on the first press of
 * a boolean button, never on open, and import nothing else from src/path-booleans/. Modules
 * already in magic-card.js (src/icons/svg-sanitize.ts, src/icons/icon-source.ts,
 * src/utils/shape-path.ts) are imported normally, and src/path/core.ts comes from the shared path-core
 * chunk; webpack does not copy modules a parent chunk already holds. The animation studio entry imports the same src/path/ files (shared source, its
 * own bundle). Neither editor chunk imports src/anim-studio/** (import scan test).
 * The menu element comes from the path-canvas chunk: it is <mc-ui-menu> of the ui-kit (UI_MENU_TAG).
 * Neither editor ships a menu of its own or imports src/editor/components/menu-popover.ts.
 * The SVG editor import()s the path-tools chunk (path-tools 1.0.0) through src/path-tools/loader.ts
 * on the first use of a path tool, never on open, and imports nothing else from src/path-tools/. The
 * shape editor does not load it.
 *
 * Loaders (window contract, additive, apiVersion stays 1; set by the card-editor chunk when it
 * loads, so magic-card.js does not grow):
 * - window.MagicCard.loadSvgEditor(): Promise<boolean>
 * - window.MagicCard.loadShapeEditor(): Promise<boolean>
 * Memoised; false on failure and retried on the next call (chunk URL rewritten, as the theme
 * presets loader does); 8 s timeout. The Magic Card Utils panel calls window.MagicCard.loadEditor(),
 * then loadSvgEditor() / loadShapeEditor(), and creates the elements with host 'mcu' (section
 * "Hosts"). No new loader, entry or window member: magic-card.js and magic-card-editor.js grow 0 B.
 *
 * ── Shell rules (both hosts) ──
 * - Escape never closes an editor and never reaches Home Assistant's card dialog. Order: end a
 *   gesture, then close an open overlay or popover (the context menu and the shape picker count as
 *   overlays), then cancel a layer drag, then drop a path-tool preview, then drop a pending boolean
 *   operand or an unfinished pen outline, then clear the selection, then nothing (one-time hint).
 *   Mechanism, all three:
 *   1. a keydown listener on the layer root (the host element) that, for Escape, calls
 *      preventDefault() and stopPropagation() after the inner handlers ran (the same pattern
 *      module-selector.ts uses inside HA's dialog). A cancelled keydown also stops a native
 *      <dialog>'s close request.
 *   2. while open, a `cancel` listener on every ancestor native <dialog> (walk getRootNode().host
 *      upwards) that calls preventDefault(), removed on close (covers HA dialogs built on <dialog>).
 *   3. focus stays inside the layer while it is open (modal-like layer), so Escape is always
 *      dispatched from inside it.
 *   Checked against the HA 2026.10.2 card editor dialog, with focus on canvas, rail, field and
 *   overlay, in Chrome, Firefox and Safari: the dialog stays open.
 * - Keys and Home Assistant: every keydown an editor acts on (tool letters, Ctrl/Cmd chords, Shift+
 *   F10, ContextMenu, Delete) gets preventDefault() and stopPropagation() at the layer root after the
 *   inner handler ran, so HA's document shortcuts (quick bar, assist) and browser chords do not also
 *   fire. While a text field has focus nothing but Escape is taken.
 * - Focus returns to the opener, or its replacement by `data-focus-key`.
 * - Boolean buttons: labelled buttons in the tab order (no drag needed); the chunk loads
 *   on the first press (button busy, aria-busy); a load failure shows "Couldn't load the shape tools.
 *   Try again." and changes nothing; every outcome is announced in the editor's polite live region.
 * - Message texts: every sentence in this contract is the first sentence of its message. An editor
 *   may add a second one ("Nothing was changed.", "Try a smaller or simpler shape."). Tests match
 *   with includes / startsWith, never whole-string equality.
 * - Every menu item is the same action as its button: same history step, label, reason text,
 *   announcement and status-strip note. After a pick focus goes to the canvas (to the layer row when the
 *   menu opened there); after a close without a pick, back to the opener.
 *
 * ── <mc-svg-editor> ──
 * Opened by the module icon editor ("Draw an icon", "Customise this icon", "Edit icon") as a
 * full-screen layer.
 * Properties: hass; source: SvgEditorSource; libraryAvailable: boolean (icons_list answered);
 * savedId?: string (editing a library icon); module?: SvgEditorModuleFacts (for the notice);
 * host?: SvgEditorHost, default 'card'.
 * Exactly one artboard, viewBox default 0 0 24 24.
 * Save path, always: the document is serialised, passed through sanitizeSvg, tidied (path-model
 * tidy) and checked against SVG_MAX_BYTES; a sanitiser error or the size cap blocks the save with
 * the reason. The markup in the event is the sanitiser's output, never the editor's own string.
 * Pasted / imported SVG goes through sanitizeSvg before it reaches the document, and the editor
 * lists what was dropped (customSvgWarning text). A subpath over MAX_ANCHORS imports and stays
 * editable; adding to it is refused (the too-many-points warning, path-canvas mc-path-limit).
 * Library saves also compute `path` / `secondary_path` (mcu-library 1.0.0 "Saved icon path"), show
 * the "In Home Assistant" preview and its warning.
 * Grid size: a "Grid size" control next to the Grid and Snap toggles: SVG_GRID_STEPS
 * plus "Custom" (SVG_GRID_MIN to SVG_GRID_MAX units, step 0.05), default SVG_GRID_DEFAULT. It sets the
 * canvas `gridStep` and `snap.grid` and the draw tools' snapping. While snapping is on, arrows nudge
 * by the grid size and Shift+arrows by 4 x the grid size; with snapping off 0.5 and 4; the
 * Alt fine step stays 0.1 and unsnapped. Kept for the page session only (a module variable): not in
 * the card config, not in the SVG, not in browser storage.
 * Shapes tool: one rail tool with a kind picker over PRIMITIVE_KINDS (rounded rectangle, triangle,
 * arrow, chevron, plus, heart, speech bubble, drop, leaf, shield, cloud, ticket, tab, tag), next to
 * the rect / ellipse / line / polygon-star tools. Placed like the rect tool: drag, two clicks or the
 * keyboard crosshair (WCAG 2.5.7); Shift keeps the box square; snapping applies. Result: a new filled
 * layer from pathDraw.primitive(kind, box), named after the kind, one history step. The kind picker
 * shows each kind's glyph and name (no hover-only names).
 * Boolean operations: Combine, Subtract, Intersect, Exclude (SVG_BOOLEAN_OPS) in the
 * inspector and the layer menu.
 * - Operands: the selected layers that are visible and unlocked and have at least one closed
 *   subpath, in drawing order (a selected group counts as its layers). Enabled: Subtract, Intersect
 *   and Exclude with 2+ operands; Combine with 2+ operands, or with 1 layer that has 2+ closed
 *   subpaths ("merge to one path" for HA icon packs). A disabled button says why in its tooltip and
 *   aria-description.
 * - Order: Subtract takes the bottom-most operand minus all others.
 * - Result: one new layer at the bottom-most operand's place (inside its group if it was in one),
 *   with that operand's fill, stroke, stroke width and accent flag, fill rule nonzero, named
 *   "Combined shape" / "Subtracted shape" / "Intersected shape" / "Excluded shape"; the operand
 *   layers are removed; the selection is the result; one history step labelled by the op. Several
 *   pieces and holes are kept (an icon may have them). Over MAX_ANCHORS it stays editable with the
 *   too-many-points warning.
 * - Not applied, nothing changed, with a message: reason 'empty' "Nothing is left of these shapes.",
 *   'no-area' "Select closed shapes. Open lines have no area.", 'too-complex' "These shapes have too
 *   many points to combine.". skippedOpen > 0 adds "N open lines were left out." to a successful
 *   result.
 * Items and bounds, for everything below: the items are the visible, unlocked selected layers, a
 * selected group counting as one item (the union of its layers); hidden or locked ones are left out and
 * the help line says so. An item's box is its stored geometry (rotation is baked into the points, so a
 * rotated shape uses its rotated outline) flattened as model.ts pathsBounds does (within 0.01 units),
 * stroke width ignored. Every command below is one history step, announced, with no status-strip note.
 * Align (inspector section "Align", menu submenu "Align"): Align left, centre, right, top, middle,
 * bottom (SvgAlignEdge) relative to SVG_ALIGN_TARGETS: 'selection' = the union box of the items (2+
 * items; with 1 the choice falls back to 'canvas' and 'selection' shows "Select two or more shapes to
 * align them to each other."), 'canvas' = the viewBox, 'safe' = the viewBox inset by SVG_SAFE_INSET
 * (only at 24 x 24 with the safe area shown, else unavailable with "The safe area is hidden."). Each
 * item moves by translation only. Distribute horizontally / vertically: 3+ items ("Select three or
 * more shapes to space them evenly."), sorted by box left / top (ties: drawing order); the two
 * outermost stay; equal gaps between neighbouring boxes (negative when they overlap); ignores the
 * target. Pure maths in src/svg-editor/arrange.ts (editor-only; the shape editor does not align).
 * Placement ("Position and size" row, menu "Align" submenu): "Centre on canvas" translates the
 * union box of the items to the viewBox centre. "Fit to safe area" scales the union box uniformly about
 * its centre to the largest size inside the safe area (it may enlarge; stroke widths are not scaled)
 * and centres it there. "Match safe-area edges" translates per axis by the least amount that brings
 * the union box inside the safe area where it sticks out; on an axis where the box is larger than the
 * safe area it is centred; inside already = no move, no step. With nothing selected the three act on
 * every visible unlocked layer (the drawing). Fit and Match need the safe area ('safe' rule above).
 * Snapping to the safe area: while Snap is on and the safe area is shown, the canvas gets
 * snap.safeArea true (moves and scale drags snap the box to the safe-area edges and
 * centre lines with a labelled guide), and the stage draw tools (tools.ts) use the same lines.
 * Arrange order (Layer section, menu submenu "Arrange", keys): Bring to front, Forward, Backward,
 * Send to back, within each item's sibling list (top level, or its group; a selected group moves as
 * one). Selected siblings move as a block and keep their order; Forward / Backward move the block one
 * place past the next unselected sibling. At the limit the button / item is unavailable, no step. Keys
 * with focus in the editor and not in a text field: Ctrl/Cmd+BracketRight forward, Ctrl/Cmd+
 * BracketLeft backward, with Shift to the front / back (event.code). Alt+Up / Alt+Down in the Layers
 * list stay. Model: moveOrder takes several ids and to-end forms (model.ts).
 * Handles: in the Select tool the editor sets the canvas `transform` to the union box of the items
 * (scale true, rotate true, keepRatio = the "Lock ratio" switch in "Position and size", default on,
 * angle = the single item's `angle`, else 0) and does not draw its own `.selbox` for it (other
 * selected boxes may stay as plain outlines). On mc-path-transform it applies the matrix to every item
 * from the document at gesture start (as layer moves do); Esc restores that document; a commit is one
 * history step "Scale" / "Rotate" (keyboard steps merge within 1 s); a rotate adds its angle to each
 * layer's `angle` (mod 360). Alternatives without a drag (WCAG 2.5.7): W, H and Angle fields with Lock
 * ratio, "Rotate 90 degrees clockwise" / "counter-clockwise" next to Flip and in the menu, Ctrl/Cmd+
 * Shift+Arrows and the Rotation slider (canvas).
 * Context menu, "Shape actions" (PathMenuElement inside the editor's shadow root): opened by the
 * canvas (`contextMenu` true, mc-path-context), by right-click / long-press (LONG_PRESS_MS) / ContextMenu
 * / Shift+F10 on a layer row (the editor's own listener, same dedupe rule as the canvas), and by a
 * visible "More actions" button in the inspector header. Items by target:
 * - shape(s) selected: Duplicate, Delete; Flip horizontally, Flip vertically, Rotate 90 degrees clockwise,
 *   Rotate 90 degrees counter-clockwise; Arrange > (four); Align > (six, Distribute horizontally /
 *   vertically, Centre on canvas, Fit to safe area, Match safe-area edges); Combine > (SVG_BOOLEAN_OPS,
 *   their reasons as above).
 * - empty canvas: Select all, Zoom to fit.
 * - a point in the Node tool: Corner or Smooth (the other one), Delete point, Add point after.
 *
 * Events (bubbling, composed):
 * - `mc-svg-save` detail SvgSaveDetail. The host writes the module: target 'module' ->
 *   { icon: 'svg', svg }; target 'library' -> the editor has already called icons_save
 *   (mcu-library 1.0.0) and the host writes { icon: 'mcu:<id>' }, plus custom_icons[id] = svg when
 *   keepCopy. keepCopy's initial value: on when the markup is at most KEEP_COPY_DEFAULT_MAX_BYTES,
 *   else off (mcu-library 1.0.0); the size is shown next to the switch.
 * - `mc-svg-close` detail { dirty: boolean } after the user confirmed leaving unsaved work.
 * Start from an icon uses icon-source resolveIconGeometry (Home Assistant's icon DB through the
 * probe, or an installed pack): no MDI data is bundled.
 *
 * What changes when a module's icon becomes `icon: svg` or `icon: mcu:<id>` (facts from
 * render-icon.ts, mc-svg-icon.ts, follow-icon.ts, template-merge.ts; the notice shows only the lines
 * that apply, from SvgEditorModuleFacts):
 * - icon_fx keeps working: colours (incl. accent / secondary), fill, draw, morph and device motion.
 *   Own and saved icons are always drawn by <mc-svg-icon>. There is no "Glow" icon_fx key (Glow is
 *   an animated-icon Style); the notice must not name it.
 * - State icons (icon_on / icon_off) win over the drawing whenever they match the state (order in
 *   mc-svg-icon: rig, state icon, own icon, entity icon).
 * - An animated icon PICKED from the library (a library animation entry): it draws its own copy of
 *   the old icon, so the card editor removes that entry after the settled icon change, as it does
 *   for any icon change (follow-icon.ts). Done therefore removes it; the notice says so
 *   before Done ("The animated icon you picked is removed: it draws mdi:lightbulb. Animate your
 *   drawing with This icon.").
 * - A "This icon" animation (quick document) follows the new icon: explicitIcon/followIcons treat
 *   `svg` (geometry from the module's `svg` through svgGeometry) and `mcu:<id>` (through
 *   icon-source) as followable icons, re-split by piece index and embed rig.svg, as for any other
 *   icon change.
 * - Templates: Magic Card has no icon template. On a template-linked card, `icon` and `svg` are
 *   synced content keys: Done writes them as this card's override (not_synced icon and svg, the
 *   same path as any icon edit on a linked card); the template keeps its icon. Notice: "This card
 *   is linked to a template. Your drawing is used on this card only."
 * - Nothing else in the module is changed by Done.
 * - Nested <g> changes nothing at runtime: the sanitiser allows g at any depth, `.mc-accent`
 *   paints at any depth, and the geometry readers (svgGeometry, the follow-icon piece split) treat
 *   <g> as transparent. If a reader only took direct children, the fix would go in the editor's
 *   export instead (toSvg writes at most one <g> level; the tree stays editor-only), never in the runtime.
 *
 * ── <mc-shape-studio> ──
 * Opened from the shape picker (design panel) by the "Custom" tile, "Edit as custom" or "Edit shape".
 * Properties: hass; value: ShapeEditorValue; customShapes: the card's custom_shapes;
 * libraryAvailable; host?: SvgEditorHost, default 'card'; preset?: ShapeEditorPreset ("Edit as
 * custom": the preset's `shape` and `shape_options`; the studio converts it, `Notch` becomes Bevel,
 * `Ticket`, `Wave` and `Blob` get a notice); label?: string (the target, "Living room tile").
 * Every value has a labelled field; canvas handles mirror the fields. Free path
 * mode uses <mc-path-canvas> with maxPaths 1 and a constrain hook that keeps each point's anchoring
 * (custom-shape 1.0.0). In free path mode the studio always writes `padding` (px per side, from its
 * inscribed-rectangle solver at the "Edit at" size, raised by "Extra space") and shows the warning for
 * content cut at a preview size (custom-shape 1.0.0 Content inset).
 * Previews: three boxes (120 x 120, 360 x 120, 720 x 200) drawn with the runtime shapePath, so the
 * preview is the renderer, plus the real card behind the editor.
 * Mode switch: a "Corners | Free shape" segmented control (ShapeEditorMode) is the first
 * control of the panel, above the type tiles and starters. Corners -> Free shape converts the corner
 * outline to points (the existing Convert to path), one history step. Free shape -> Corners goes
 * back to the corner settings the shape last had (square corners if it started as a path) and drops
 * the points, one history step (undo brings the points back); when points were edited, a one-line
 * note under the switch says so before the switch is used. Corner mode keeps no canvas and no draw
 * tools; pressing a free-shape action from Corners is not offered (the switch comes first).
 * Free shape tools, all on the path canvas (loaded on entering Free shape):
 * - Select, Points (node editing), Add point, Remove point (Delete on a selected point does the same;
 *   refused below 3 points with "A shape needs at least 3 points."), and Pen.
 * - Pen = "Draw a new outline": a pending open path as canvas path 1 (maxPaths 2) in 'add' mode: tap
 *   places a corner point, drag pulls smooth handles, the keyboard crosshair + Enter places points
 *   (WCAG 2.5.7). Tapping the first point, or Finish with 3+ points, closes it and it REPLACES the
 *   outline (one history step, default anchoring, padding solver rerun). Esc or Cancel drops it;
 *   Finish is disabled under 3 points. The constrain hook applies to path 0 only.
 * - Starter outlines: a menu over PRIMITIVE_KINDS (ticket, tab, speech bubble, leaf, arrow, chevron,
 *   heart, drop, shield, cloud, tag, plus, triangle, rounded rectangle) drawn with
 *   pathDraw.primitive(kind, the whole Edit-at box). Picking one replaces the outline: one history
 *   step, default anchoring (each point anchored to its nearer edge, as new points are), padding
 *   solver rerun with the raise-survives rule. Every kind is at most 24 points.
 * Boolean operations in the shape editor, Free shape only:
 * - "Add shape" (same kind list) puts a pending operand on the canvas as path 1 (maxPaths 2, dashed,
 *   no fill), centred, half the Edit-at box in size; it moves by drag (Select) and by X / Y / W / H
 *   fields. Then Combine, Subtract or Intersect (SHAPE_BOOLEAN_OPS) applies it to the outline (outline
 *   first, so Subtract = outline minus operand); Cancel drops it. Exclude is not offered: with one
 *   outline and holes filled it either equals Combine or splits the shape.
 * - The operand is never written to the config and is not a history step; `mc-shape-change` carries
 *   only the outline. Undo after an apply restores the outline with nothing pending.
 * - Result rules (card shapes are one closed outline; holes are out of scope, custom-shape 1.0.0):
 *   one piece without holes -> applied. Several pieces -> singleOutline() keeps the largest, notice
 *   "Kept the largest piece. N smaller pieces were removed." Holes -> filled, notice "Card shapes
 *   have one outline, so the hole was filled." (both notices can show). More than MAX_SHAPE_POINTS
 *   points -> not applied, nothing changed: "The result needs N points. A card shape can have 64."
 *   Reason 'empty' -> not applied: "Nothing would be left of the shape." 'too-complex' -> not
 *   applied, same text as the SVG editor. An applied result gets default anchoring, the padding
 *   solver reruns (raise-survives rule), the cut-content warning and the crossing check run as after
 *   any edit, one history step labelled "Combine shape" / "Subtract shape" / "Intersect shape", the
 *   operand is gone.
 * What the shape editor takes from the SVG editor's shared features (Free shape only; Corners has no
 * canvas and no menu; there is no "More actions" button in either mode): no align, distribute,
 * arrange, flip, rotate, duplicate or placement row (one outline that fills its box). The pending
 * operand gets the canvas `transform` (scale true, rotate false, keepRatio true, bounds = the Edit-at
 * frame); a scale updates its X / Y / W / H and, like any operand change, is not a history step. No
 * Angle field and no rotate handle. "Centre" puts the operand in the middle of the Edit-at box.
 * Context menu "Outline actions" (canvas `contextMenu` true; right-click, long-press, the ContextMenu
 * key, Shift+F10): a point -> Corner or Smooth, Add point after, Remove point; a segment ->
 * Add point here (at the pressed point, PathContext.hit.at); the pending operand -> Combine, Subtract,
 * Intersect, Centre, Cancel; empty canvas -> Start from a shape..., Add shape..., Pen.
 * The shape editor takes the SVG editor's structure and the ui kit's look (ui-kit 1.0.0):
 * - Top bar (kit topBar): Back to card editor (Close in host 'mcu') | title | name | Undo, Redo | Export / Import
 *   (a menu: Export file, Import file, Copy YAML) | Save to library and Done (host 'mcu': one primary, Save) | Shortcuts.
 *   The name field is 180 px with a visible placeholder in host 'mcu'. Save to library stays pressable without
 *   Magic Card Utils: it shows the Library tab with the reason.
 * - Free shape: a tool rail (Select, Add point, Remove point, Pen) and a float toolbar over the canvas (Preview,
 *   Start from..., Combine..., Grid, Snap). Corners: the float toolbar has Preview and Start from... only. The
 *   canvas fills the height; nothing sits under it but the result note and the pen bar. There is no hint line and
 *   no "More actions" button: every action in the Outline actions menu has a button (Corner | Smooth, Add point
 *   after and Remove point in the point section; Add point on the rail; Combine, Subtract, Intersect, Centre and
 *   Cancel in the Combine section; Start from... and Combine... on the toolbar; Pen on the rail). The key
 *   help is the Shortcuts popover.
 * - Previews (three boxes, On card | Outlines, older browser look) are behind the Preview button, an anchored popover.
 * - Start from, Combine with, Save to library, Leave without saving and Export / Import are `<mc-ui-window>`s
 *   (movable, resizable and maximisable; the Leave window is an alert). Start from lists the shapes in both modes.
 *   In Corners mode it also lists the five corner styles, and a shape switches to Free shape: the new outline, the
 *   mode and the size are one history step. In host 'mcu', a new shape (no `savedId`, no `preset`, an empty
 *   `value`) opens Start from once.
 * - Grid and Snap (Free shape): the canvas `pixelGrid` and `gridStep` 10, and `snap` { grid 10, frame, no anchors }.
 *   Both start off and are not stored.
 * - The result note (what a button just did, with Undo) clears on the next edit, on a mode change, or 8 s after the
 *   last pointer or focus in it. Persistent warnings (the outline cuts the text area, crosses itself) stay as notices.
 * The SVG editor is built from the ui kit. Its chunk imports the kit (Core's editorTokens,
 * src/ui-kit/css, templates and glyphs) and nothing more: the card-editor chunk that loads it holds
 * the kit, so the chunk grows by no kit code. It defines no element of its own besides <mc-svg-editor>
 * and uses <mc-ui-window>, <mc-ui-popover>, <mc-ui-menu> and <mc-ui-toast>.
 * - Top bar: Back to card editor (Close in host 'mcu') | title | Start from... | name (180 px) | Undo, Redo | size chip |
 *   Export / Import (menu) | Save to library | Done | Shortcuts. The tool rail is the kit rail (a toolbar: arrows move the
 *   focus, a press picks the tool); Align, Combine and Path stay menu buttons after a divider on the canvas toolbar.
 * - Start from, Save to library, Leave, Start over, Make N Accent layers Main and Export / Import are <mc-ui-window>s
 *   (the confirmations are alerts, the others movable, resizable and maximisable). Shortcuts and Preview are anchored
 *   <mc-ui-popover>s: Preview is closed by default and the canvas keeps its full height. No hint line, no More actions.
 * - Yes / no settings are switches (no native checkbox), choices are segmented controls, MDI glyphs everywhere,
 *   the HA font in rem. A toast is <mc-ui-toast>; the result of an action is a notice.
 * - The path-tools panel (path-tools 1.0.0) renders with the same kit templates.
 * Events:
 * - `mc-shape-change` detail ShapeChangeDetail; `commit` false during drags. The host applies it
 *   through design-panel's ShapePatch (extended with custom_shapes) and pushes one history step
 *   per commit. Done after "Edit as custom" with no edit still sends one `mc-shape-change` so the
 *   card turns custom. The card editor sets `preset` and `label`, writes on `mc-shape-change` with
 *   `commit` true, and closes on `mc-shape-close`.
 * - `mc-shape-close` detail ShapeCloseDetail, from Done and from Back to card editor. The change
 *   events already applied everything (the card behind the editor is live), so there is nothing to
 *   confirm on leaving; the host closes the layer and returns focus to the opener. A pending operand
 *   or pen outline is dropped on close (it was never applied).
 * - `mc-shape-save` detail ShapeSaveDetail, host 'mcu' only (section "Hosts").
 *
 * Host rules (HA 2026.10.2, src/editor/custom/layer.ts):
 * - The layer is a modal <dialog> on <body> (top layer), not a child of the form: HA's card dialog
 *   transforms and clips, and the form re-renders on every committed change. The editors' ancestor
 *   <dialog> walk therefore finds none; the host covers Escape itself.
 * - HA's card dialog is a wa-dialog that also closes on a keydown that reaches its document-level key
 *   handling, not only on the browser's cancel. The editors' layer-root handler stops Escape only while
 *   focus is inside their shadow DOM; with focus on the editor element, the dialog or the page it does
 *   not, and the card dialog would close. The host stops Escape on the dialog (bubble) and on the window
 *   (capture, targets outside the layer), ignores `cancel`, and focuses the editor element on open.
 * - The entry button must stay enabled while the chunk loads (a disabled button drops focus, and focus
 *   returns to the opener, or its `data-focus-key` replacement).
 *
 * ── Image mode (1.1.0, revision 6) ──
 * Sources 'image-blank', 'image' and 'image-svg' open the editor on a library image (image-editor 1.0.0 holds
 * everything image-only; the shell loads it through src/svg-editor/image-loader.ts, the only import() of that
 * chunk, and gives it ImageEditorHost). Icon sources never load it. In image mode the editor keeps the drawing
 * canvas as the image's viewBox, saves only to the library (event 'mc-svg-save' { target: 'image-library', svg,
 * saved }), downloads ext.exportFile() instead of its own Blob, and opens read-only (no Save, Rename or Delete)
 * when hass.user.is_admin is false or the library is missing. Layers being dragged, moved by handles or nudged
 * carry `will-change: transform` until the gesture ends.
 *
 * ── Hosts: 'card' and 'mcu' ──
 * 'card' (default) is everything above. 'mcu' = hosted by the Magic Card Utils panel (mcu-library 1.0.0
 * "Editors in the panel"): no card, no module, no entity, no HA dialog.
 * - Version: both element classes have `static contractRevision` (= SVG_EDITOR_CONTRACT_REVISION). The
 *   panel needs SVG_EDITOR_MCU_MIN_REVISION or more, else it shows its update message and creates nothing.
 * - Layer: the panel mounts the element in its content area (no <dialog>). The editors' own Escape rule
 *   (layer root) still applies; the panel focuses the element on open and returns focus to the opener.
 * - <mc-svg-editor host="mcu">: source { kind: 'blank' } (New icon) or { kind: 'library', id } with
 *   savedId (Edit); `module` unset; libraryAvailable from icons_list as in 'card'. Save always targets
 *   'library'. The name is required: Save is disabled with "Give the icon a name." until it has one. A
 *   new icon's id is the name's slug made unique against icons_list; an edit sends base_updated_at, and
 *   `conflict` shows "This icon was changed somewhere else." with "Save as a copy" and "Reload". No Keep
 *   a copy switch, no module notice, no "save into the module". After a save `mc-svg-save` { target:
 *   'library', svg, saved } fires and the editor STAYS OPEN ("Saved" announced). `mc-svg-close` after the
 *   existing unsaved-work confirm. Imports go through sanitizeSvg as in 'card' (same boundary).
 * - Preview colours ('mcu' only): labelled colour inputs "Main preview colour" and "Accent preview
 *   colour" (defaults MCU_PREVIEW_MAIN, MCU_PREVIEW_ACCENT) colour the canvas and the previews. Session
 *   only: never saved, never in the markup, not in browser storage.
 * - <mc-shape-studio host="mcu">: `value` is the library shape being edited, or for New the studio's
 *   default custom shape (what the "Custom" tile starts with); customShapes {}; `preset` and `label`
 *   unset. The studio keeps its own value: it applies its own changes (it still fires mc-shape-change;
 *   the panel ignores it). No card behind it: the three preview boxes only. Save is "Save as shape" with a
 *   required name ("Give the shape a name."), same id and conflict rules (shapes_save); it fires
 *   `mc-shape-save` and stays open. "Close" replaces Done / Back: with changes since the last save it
 *   asks "Leave without saving?" (Leave, Keep editing), then fires mc-shape-close { done: false }.
 *
 * ── Dual-tone ──
 * The names stay "Main" and "Accent" everywhere. No new model, config or markup field
 * (Paint is none | main | accent; accent markup is class mc-accent).
 * - A "Dual-tone" switch in the document section. On open it is on when any layer paints Accent (fill
 *   or stroke), else off. Session state.
 * - Off: the paint pickers offer None and Main. Turning it off while N layers use Accent asks "Make N
 *   Accent layers Main?"; confirm sets them to Main as one history step "Single tone"; cancel keeps it on.
 * - On: the pickers offer None, Main and Accent. Each layer row shows a text tag "Main" or "Accent" (not
 *   colour alone, WCAG 1.4.1); the row menu gets "Make Accent" / "Make Main" (fill and stroke, one step).
 * - Preview strip (shown when the drawing has content): "In Magic Card" (Main and Accent in the card's
 *   colours, or the preview colours in 'mcu') and "In Home Assistant" (haForm: `path` in Main and
 *   `secondary_path` in the same colour at HA_SECONDARY_OPACITY), each at 24 and 48 px, labelled.
 * - Save and "Copy as HA path": `path` and `secondary_path` as mcu-library "Saved icon path" (Accent
 *   shapes go to secondary_path). With Accent layers the copy menu adds "Copy accent path".
 *
 * ── Groups and the layer tree ──
 * Model (src/svg-editor/model.ts, editor-only):
 * - Group has `parent?: string` (the enclosing group's id; absent = top level). Shape.group is the
 *   innermost group.
 * - Invariants, checked by a test helper after every operation: (I1) the shapes under a group, at all
 *   depths, are one contiguous run of `shapes`; (I2) every parent exists, no cycles; (I3) depth(group) =
 *   1 + depth(parent) <= MAX_GROUP_DEPTH (top-level group = 1); (I4) a group with no shape under it is
 *   removed.
 * - Paint order is the order of `shapes` (index 0 is painted first, the bottom). The tree lists the top
 *   first: a parent's items (its own shapes and child groups, ordered by their first shape) in reverse
 *   paint order, each group's items under it.
 * - Hidden and locked count for every descendant (an item is hidden when it or any ancestor is).
 * - toSvg writes one bare <g> per group level (nested, no attributes); hidden subtrees are left out.
 *   Import turns nested <g> into groups up to MAX_GROUP_DEPTH and puts deeper content into the 4th level
 *   with the note "Groups deeper than 4 levels were merged." Names, hide, lock and open state are not in
 *   the markup: a reopened icon gets its structure back with default names.
 * - Operations, each one history step, pure: groupItems(ids) puts a new group in the parent of the
 *   top-most item, at its place (items from other parents move in); refused when any item would end up
 *   deeper than MAX_GROUP_DEPTH. ungroup(id) moves its items to its parent at its place.
 *   moveItem(id, place: TreePlace): place.index is the position in the parent's tree order (top = 0)
 *   counted after the item is taken out. Refused, no change, when the place is inside the item itself,
 *   would exceed MAX_GROUP_DEPTH, or the target group (or one of its ancestors) is locked. The arrange
 *   order and moveOrder act on sibling items, a group as one block.
 * - Everything that counts "a selected group as its layers" (boolean operands, align items, handles)
 *   walks all depths; a selected group is one item for align and handles.
 * Layers list:
 * - role=tree; rows role=treeitem with aria-level, aria-expanded (groups), aria-setsize, aria-posinset;
 *   roving tabindex. Up / Down move focus, Right opens a group or goes to its first item, Left closes it
 *   or goes to the parent, Home / End, Enter selects, Ctrl/Cmd+Space adds to the selection, F2 renames.
 *   Indent per level; rows and their buttons at least 24 x 24 CSS px (WCAG 2.5.8); the focused row is
 *   kept clear of the sticky list header with scroll-padding (WCAG 2.4.11).
 * - Drag (pointer events, not HTML drag and drop): only from the row's grip button ("Drag to move
 *   <name>"), after DRAG_START_PX; touch-action none on the grip only. Over a row: top quarter = above,
 *   bottom quarter = below, middle half of a group row = into it (as its top item). A line or a group
 *   outline shows the target; an invalid target shows the not-allowed state and the reason in the list's
 *   status line ("Groups can be 4 levels deep.", "<name> is locked.", "A group can't go inside itself.").
 *   The list scrolls when the pointer is within DRAG_EDGE_PX of its top or bottom edge. Escape cancels.
 *   The drop is moveItem, one history step "Move layer". A long-press on the row (not the grip) opens
 *   the context menu and never starts a drag.
 * - Without a drag (WCAG 2.5.7), from the row menu ("Move" submenu) and keys on a focused row: Move up
 *   (Alt+Up) and Move down (Alt+Down), within the tree; Move into group above (Alt+Shift+Right: the
 *   item becomes the bottom item of the group right above it, so its paint order does not change); Move
 *   out of group (Alt+Shift+Left: it becomes the item right below its former group). Unavailable at a
 *   limit, with the reason. Keys follow the consumed-key rule above.
 * - After every move the polite live region says "<name> moved into <group>, position i of n" or
 *   "<name> moved to the top level, position i of n".
 * - "Group" inside a group at MAX_GROUP_DEPTH is disabled with "Groups can be 4 levels deep."
 *
 * ── Path tools, SVG editor only, path-tools 1.0.0 ──
 * - Entry points: an inspector section "Path" (Outline stroke, Offset, Simplify, Join, Split at point),
 *   the context menu submenu "Path" (same items, same reasons), "Split here" in the point menu, and a
 *   "Knife" rail tool (key K, consumed-key rule) placed like the line tool: drag, two clicks or the
 *   keyboard crosshair (WCAG 2.5.7).
 * - Targets: visible, unlocked selected layers. Outline stroke: layers with a stroke; a layer with fill
 *   and stroke keeps its fill without the stroke and gets a new layer "<name> outline" with the stroke's
 *   paint right above it. Offset (closed subpaths) and Simplify (all subpaths): each selected layer.
 *   Join: one layer with two open subpaths, two layers with one open subpath each (the result takes the
 *   bottom-most one's place and paint; the other is removed), or one open subpath (Close path). Split:
 *   the Node tool's single selected anchor (open: two layers "<name> 1" / "<name> 2" with the same paint;
 *   closed: the same layer, opened there). Knife: the selected layers, or with none selected every
 *   visible unlocked layer the drawn segment touches; a cut layer becomes one layer per piece, "<name> 1"
 *   to "<name> n", same paint, at its place.
 * - The first use loads the booleans and path-tools chunks together (control busy, aria-busy); a failure
 *   shows "Couldn't load the path tools. Try again." and changes nothing.
 * - Every tool opens the chunk's panel (renderPanel) with Apply and Cancel and a dashed preview on the
 *   canvas (rerun PREVIEW_DEBOUNCE_MS after a field change); the preview is never in the document or the
 *   history. Apply = one history step named after the tool. Cancel or Escape drops it. Outcomes and
 *   refusals (path-tools messages) go to the polite live region; a refusal changes nothing.
 * - The SVG editor holds no geometry for these tools (import scan: nothing from src/path-tools/ but
 *   loader.ts).
 */

export const SVG_EDITOR_CONTRACT_VERSION = '1.1.0';
/** Revision number of the element classes (static contractRevision); the Magic Card Utils panel checks it against SVG_EDITOR_MCU_MIN_REVISION. */
export const SVG_EDITOR_CONTRACT_REVISION = 6;
export const SVG_EDITOR_TAG = 'mc-svg-editor';
/**
 * Elements of the card editor chunk (module-editor contract) that the SVG editor uses by tag, never by import:
 * `mc-icon-picker` in Start from > An icon (props `hass`, `value`, `label`; event `value-changed` { value }).
 * Defined once loadEditor() resolved; without it the editor shows a plain name field.
 */
export const SVG_EDITOR_EXTERNAL_TAGS: readonly string[] = ['mc-icon-picker'];
export const SVG_EDITOR_CHUNK = 'svg-editor';
export const SVG_EDITOR_CHUNK_FILE = 'magic-card-svg-editor.js';
export const SHAPE_EDITOR_TAG = 'mc-shape-studio';
export const SHAPE_EDITOR_CHUNK = 'shape-editor';
export const SHAPE_EDITOR_CHUNK_FILE = 'magic-card-shape-editor.js';

/** Grid size choices in viewBox units (24 x 24 artboard). */
export const SVG_GRID_STEPS: readonly number[] = [0.5, 1, 2, 3, 4];
export const SVG_GRID_DEFAULT = 1;
export const SVG_GRID_MIN = 0.1;
export const SVG_GRID_MAX = 12;
/** Boolean ops each editor offers. */
export const SVG_BOOLEAN_OPS: readonly BooleanOp[] = ['union', 'subtract', 'intersect', 'exclude'];
export const SHAPE_BOOLEAN_OPS: readonly BooleanOp[] = ['union', 'subtract', 'intersect'];
/** What Align is relative to, and the safe-area inset at 24 x 24. */
export const SVG_ALIGN_TARGETS = ['selection', 'canvas', 'safe'] as const;
export const SVG_SAFE_INSET = 2;

/** Who hosts the editors. */
export const SVG_EDITOR_HOSTS = ['card', 'mcu'] as const;
/** The lowest element contractRevision the Magic Card Utils panel accepts. */
export const SVG_EDITOR_MCU_MIN_REVISION = 5;
/** Group nesting cap. A top-level group is level 1. */
export const MAX_GROUP_DEPTH = 4;
/** A layer drag starts after this many CSS px; edge auto-scroll zone. */
export const DRAG_START_PX = 4;
export const DRAG_EDGE_PX = 32;
/** How Home Assistant draws secondary_path (preview strip). */
export const HA_SECONDARY_OPACITY = 0.5;
/** Neutral preview colours in the MCU host (HA's default state icon and accent colours). */
export const MCU_PREVIEW_MAIN = '#44739e';
export const MCU_PREVIEW_ACCENT = '#ff9800';

/** The shape editor's top-level mode switch. */
export type ShapeEditorMode = 'corners' | 'free';
export type SvgAlignTarget = (typeof SVG_ALIGN_TARGETS)[number];
export type SvgAlignEdge = 'left' | 'centre' | 'right' | 'top' | 'middle' | 'bottom';
export type SvgArrange = 'front' | 'forward' | 'backward' | 'back';
export type SvgEditorHost = (typeof SVG_EDITOR_HOSTS)[number];

/** A place in the layer tree. parent null = top level; index in tree order, top = 0. */
export interface TreePlace {
  parent: string | null;
  index: number;
}

export type SvgEditorSource =
  | { kind: 'blank' }
  | { kind: 'icon'; icon: string }
  | { kind: 'svg'; svg: string }
  | { kind: 'library'; id: string }
  /** Image mode (image-editor 1.0.0). No size: the canvas-size step opens first. */
  | { kind: 'image-blank'; width?: number; height?: number }
  /** A library image. */
  | { kind: 'image'; id: string }
  /** A file opened as a new image. */
  | { kind: 'image-svg'; svg: string };

/** What the host tells the editor about the module, for the notice. */
export interface SvgEditorModuleFacts {
  /** The icon before, e.g. 'mdi:lightbulb' ('' = the entity's or type's icon). */
  icon: string;
  hasStateIcons: boolean;
  /** A library animation entry that Done will remove. */
  pickedAnimation: boolean;
  /** A "This icon" animation that will follow the drawing. */
  followsIcon: boolean;
  /** The card is linked to a template. */
  linked: boolean;
}

export interface SvgSaveDetail {
  target: 'module' | 'library' | 'image-library';
  /** sanitizeSvg output; for target 'image-library' the sanitised image markup. */
  svg: string;
  /** target 'library': the stored item (as the server returned it). target 'image-library': what was sent to images_save. */
  saved?: SavedIconInput | SavedImageInput;
  /** target 'library': also keep an inline copy in the card (custom_icons). */
  keepCopy?: boolean;
}

export interface ShapeEditorValue {
  shape: 'custom';
  shape_options: CustomShapeOptions;
}

/** "Edit as custom": the preset the studio starts from. */
export interface ShapeEditorPreset {
  shape: string;
  shape_options?: ShapeOptions;
}

export interface ShapeCloseDetail {
  done: boolean;
}

/** Host 'mcu': the stored item as the server returned it. */
export interface ShapeSaveDetail {
  saved: SavedShape;
}

export interface ShapeChangeDetail {
  value: ShapeEditorValue;
  /** Inline copies to merge into the card's custom_shapes (set when `ref` is written). */
  customShapes?: Record<string, CustomShapeOptions>;
  commit: boolean;
  label: string;
}
