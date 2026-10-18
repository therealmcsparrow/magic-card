import type { CustomShapeOptions } from './custom-shape';
import type { ShapeOptions } from '../types';
import type { SavedIconInput, SavedShape } from './mcu-library';
import type { BooleanOp } from './path-booleans';

/*
 * Contract: SVG editor and shape editor hosts. Version 1.0.0 (Architect-owned). ADR 0016, ADR 0020.
 * Revision 2 (2026-10-18, before any implementation): Escape and the Home Assistant dialog; what
 * really happens to a module whose icon becomes the user's own (checked in the code); keepCopy
 * default; linked cards; "This icon" animations follow own and saved icons; shape studio writes
 * free-path `padding`.
 * Revision 3 (2026-10-18, CEO decisions after the hands-on demo, ADR 0025; nothing shipped, so in
 * place): SVG editor grid size setting and a Shapes tool with PRIMITIVE_KINDS; boolean operations in
 * both editors through the path-booleans 1.0.0 chunk; shape editor "Corners / Free shape" switch at
 * the top, free-shape pen, add / remove points and starter outlines; draw tools reach both editors
 * through the path-canvas chunk (path-canvas revision 4), which reverses "the shape editor never
 * imports draw".
 * Revision 4 (2026-10-18, CEO scope added after revision 3: align and distribute, on-canvas scale and
 * rotate handles, placement shortcuts, arrange order, a context menu; design 02 s7.6-7.10, 03 s9, 06 s7;
 * ADR 0026; PROPOSED, the SVG editor and path canvas ceilings need the CEO). Additive; uses path-canvas
 * revision 5. SVG_EDITOR_CONTRACT_REVISION moves to 4 in T30 and stays 3 while T24 / T26 run. Sections
 * marked (r4) below.
 * Revision 5 (2026-10-18, epic E, brief 48 with the CEO's decisions of 2026-10-18: all of E in this
 * release, both MCU entry points, groups nest 4 levels, the name "Accent" stays; ADR 0027; PROPOSED, the
 * SVG editor ceiling and the new path-tools chunk need the CEO). Additive: host 'mcu' for both elements
 * (E1), Dual-tone (E2), nested groups and the layer tree with drag and drop (E3), path tools through the
 * path-tools 1.0.0 chunk (E4). E5 is r4 (T29 / T31 / T32). SVG_EDITOR_CONTRACT_REVISION moves to 5 in
 * T39 (host mode), which the MCU panel checks. Sections marked (r5) below; (r5) supersedes the old
 * "Library tab, not in 1.0.0 scope" line under Loaders.
 *
 * Two lazy chunks of the magic-card entry, each loaded by the card-editor chunk (never by
 * magic-card.js, which gains 0 B from them):
 * - module `svg-editor`, src/svg-editor/, chunk SVG_EDITOR_CHUNK_FILE, element SVG_EDITOR_TAG.
 * - module `shape-editor`, src/shape-editor/, chunk SHAPE_EDITOR_CHUNK_FILE, element SHAPE_EDITOR_TAG.
 * Both import() the path-canvas chunk (path-canvas 1.0.0) when they need it and take the editor-only
 * path-model parts (edit, tidy, draw) from its exports (one copy rule, path-canvas.ts revision 4).
 * Neither imports src/path/edit.ts, tidy.ts or draw.ts (import scan test; revision 3 replaces the
 * revision-2026-10-18 line that had the SVG editor import draw.ts itself). Both import() the
 * path-booleans chunk (path-booleans 1.0.0) through src/path-booleans/loader.ts on the first press of
 * a boolean button, never on open, and import nothing else from src/path-booleans/. Modules
 * already in magic-card.js (src/path/core.ts, src/icons/svg-sanitize.ts, src/icons/icon-source.ts,
 * src/utils/shape-path.ts) are imported normally; webpack does not copy modules a parent chunk
 * already holds. The animation studio entry imports the same src/path/ files (shared source, its
 * own bundle). Neither editor chunk imports src/anim-studio/** (import scan test).
 * (r4) The menu element comes from the path-canvas chunk (PATH_MENU_TAG); neither editor ships a menu
 * of its own or imports src/editor/components/menu-popover.ts.
 * (r5) The SVG editor import()s the path-tools chunk (path-tools 1.0.0) through src/path-tools/loader.ts
 * on the first use of a path tool, never on open, and imports nothing else from src/path-tools/. The
 * shape editor does not load it.
 *
 * Loaders (window contract, additive, apiVersion stays 1; set by the card-editor chunk when it
 * loads, so magic-card.js does not grow):
 * - window.MagicCard.loadSvgEditor(): Promise<boolean>
 * - window.MagicCard.loadShapeEditor(): Promise<boolean>
 * Memoised; false on failure and retried on the next call (chunk URL rewritten, as the theme
 * presets loader does); 8 s timeout. The Magic Card Utils panel may later call loadEditor() then
 * loadSvgEditor() to host the SVG editor in a "Library" tab (not in 1.0.0 scope).
 * (r5) In scope now: the Magic Card Utils panel calls window.MagicCard.loadEditor(), then
 * loadSvgEditor() / loadShapeEditor(), and creates the elements with host 'mcu' (section "(r5) Hosts").
 * No new loader, entry or window member: magic-card.js and magic-card-editor.js grow 0 B.
 *
 * ── Shell rules (both hosts) ──
 * - Escape never closes an editor and never reaches Home Assistant's card dialog. Order: end a
 *   gesture, then close an open overlay or popover (r4: the context menu and the shape picker count as
 *   overlays), then (revision 3) drop a pending boolean operand or an unfinished pen outline, then
 *   clear the selection, then nothing (one-time hint, design 01 section 1). Mechanism, all three:
 *   1. a keydown listener on the layer root (the host element) that, for Escape, calls
 *      preventDefault() and stopPropagation() after the inner handlers ran (the same pattern
 *      module-selector.ts uses inside HA's dialog today). A cancelled keydown also stops a native
 *      <dialog>'s close request.
 *   2. while open, a `cancel` listener on every ancestor native <dialog> (walk getRootNode().host
 *      upwards) that calls preventDefault(), removed on close (covers HA dialogs built on <dialog>).
 *   3. focus stays inside the layer while it is open (modal-like layer, design 06), so Escape is
 *      always dispatched from inside it.
 *   Proof (T8, T11): HA 2026.10.2 card editor dialog (the S1 Docker image), focus on canvas, rail,
 *   field and overlay, in Chrome, Firefox and Safari: the dialog stays open.
 *   (r5) The Escape order gains, after overlays and before the pending operand: cancel a layer drag,
 *   then drop a path-tool preview.
 * - (r4) Keys and Home Assistant: every keydown an editor acts on (tool letters, Ctrl/Cmd chords, Shift+
 *   F10, ContextMenu, Delete) gets preventDefault() and stopPropagation() at the layer root after the
 *   inner handler ran, so HA's document shortcuts (quick bar, assist) and browser chords do not also
 *   fire. While a text field has focus nothing but Escape is taken.
 * - Focus returns to the opener, or its replacement by `data-focus-key` (design 01 section 1).
 * - Boolean buttons (revision 3): labelled buttons in the tab order (no drag needed); the chunk loads
 *   on the first press (button busy, aria-busy); a load failure shows "Couldn't load the shape tools.
 *   Try again." and changes nothing; every outcome is announced in the editor's polite live region.
 * - (r4) Message texts: every sentence in this contract is the first sentence of its message. An editor
 *   may add a second one ("Nothing was changed.", "Try a smaller or simpler shape.", design 02 s7.6).
 *   Tests match with includes / startsWith, never whole-string equality.
 * - (r4) Every menu item is the same action as its button: same history step, label, reason text,
 *   announcement and status-strip note. After a pick focus goes to the canvas (to the layer row when the
 *   menu opened there); after a close without a pick, back to the opener.
 *
 * ── <mc-svg-editor> ──
 * Opened by the module icon editor ("Draw an icon", "Customise this icon", "Edit icon") as a
 * full-screen layer.
 * Properties: hass; source: SvgEditorSource; libraryAvailable: boolean (icons_list answered);
 * savedId?: string (editing a library icon); module?: SvgEditorModuleFacts (for the notice).
 * (r5) host?: SvgEditorHost, default 'card'.
 * Exactly one artboard, viewBox default 0 0 24 24.
 * Save path, always: the document is serialised, passed through sanitizeSvg, tidied (path-model
 * tidy) and checked against SVG_MAX_BYTES; a sanitiser error or the size cap blocks the save with
 * the reason. The markup in the event is the sanitiser's output, never the editor's own string.
 * Pasted / imported SVG goes through sanitizeSvg before it reaches the document, and the editor
 * lists what was dropped (customSvgWarning text). A subpath over MAX_ANCHORS imports and stays
 * editable; adding to it is refused (W10, path-canvas mc-path-limit).
 * Library saves also compute `path` / `secondary_path` (mcu-library 1.0.0 "Saved icon path"), show
 * the "In Home Assistant" 24 px preview and W11.
 * Grid size (revision 3): a "Grid size" control next to the Grid and Snap toggles: SVG_GRID_STEPS
 * plus "Custom" (SVG_GRID_MIN to SVG_GRID_MAX units, step 0.05), default SVG_GRID_DEFAULT. It sets the
 * canvas `gridStep` and `snap.grid` and the draw tools' snapping. While snapping is on, arrows nudge
 * by the grid size and Shift+arrows by 4 x the grid size; with snapping off 0.5 and 4 as before; the
 * Alt fine step stays 0.1 and unsnapped. Kept for the page session only (a module variable): not in
 * the card config, not in the SVG, not in browser storage.
 * Shapes tool (revision 3): one rail tool with a kind picker over PRIMITIVE_KINDS (path-model
 * revision 3; rounded rectangle, triangle, arrow, chevron, plus, heart, speech bubble, drop, leaf,
 * shield, cloud, ticket, tab, tag), next to the existing rect / ellipse / line / polygon-star tools,
 * which stay. Placed like the rect tool: drag, two clicks or the keyboard crosshair (WCAG 2.5.7);
 * Shift keeps the box square; snapping applies. Result: a new filled layer from
 * pathDraw.primitive(kind, box), named after the kind, one history step. The kind picker shows each
 * kind's glyph and name (no hover-only names).
 * Boolean operations (revision 3): Combine, Subtract, Intersect, Exclude (SVG_BOOLEAN_OPS) in the
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
 *   pieces and holes are kept (an icon may have them). Over MAX_ANCHORS it stays editable with W10.
 * - Not applied, nothing changed, with a message: reason 'empty' "Nothing is left of these shapes.",
 *   'no-area' "Select closed shapes. Open lines have no area.", 'too-complex' "These shapes have too
 *   many points to combine.". skippedOpen > 0 adds "N open lines were left out." to a successful
 *   result.
 * (r4) Items and bounds, for everything below: the items are the visible, unlocked selected layers, a
 * selected group counting as one item (the union of its layers); hidden or locked ones are left out and
 * the help line says so. An item's box is its stored geometry (rotation is baked into the points, so a
 * rotated shape uses its rotated outline) flattened as model.ts pathsBounds does (within 0.01 units),
 * stroke width ignored. Every command below is one history step, announced, with no status-strip note.
 * (r4) Align (inspector section "Align", menu submenu "Align"): Align left, centre, right, top, middle,
 * bottom (SvgAlignEdge) relative to SVG_ALIGN_TARGETS: 'selection' = the union box of the items (2+
 * items; with 1 the choice falls back to 'canvas' and 'selection' shows "Select two or more shapes to
 * align them to each other."), 'canvas' = the viewBox, 'safe' = the viewBox inset by SVG_SAFE_INSET
 * (only at 24 x 24 with the safe area shown, else unavailable with "The safe area is hidden."). Each
 * item moves by translation only. Distribute horizontally / vertically: 3+ items ("Select three or
 * more shapes to space them evenly."), sorted by box left / top (ties: drawing order); the two
 * outermost stay; equal gaps between neighbouring boxes (negative when they overlap); ignores the
 * target. Pure maths in src/svg-editor/arrange.ts (editor-only; the shape editor does not align).
 * (r4) Placement ("Position and size" row, menu "Align" submenu): "Centre on canvas" translates the
 * union box of the items to the viewBox centre. "Fit to safe area" scales the union box uniformly about
 * its centre to the largest size inside the safe area (it may enlarge; stroke widths are not scaled)
 * and centres it there. "Match safe-area edges" translates per axis by the least amount that brings
 * the union box inside the safe area where it sticks out; on an axis where the box is larger than the
 * safe area it is centred; inside already = no move, no step. With nothing selected the three act on
 * every visible unlocked layer (the drawing). Fit and Match need the safe area ('safe' rule above).
 * (r4) Snapping to the safe area: while Snap is on and the safe area is shown, the canvas gets
 * snap.safeArea true (path-canvas r5: moves and scale drags snap the box to the safe-area edges and
 * centre lines with a labelled guide), and the stage draw tools (tools.ts) use the same lines.
 * (r4) Arrange order (Layer section, menu submenu "Arrange", keys): Bring to front, Forward, Backward,
 * Send to back, within each item's sibling list (top level, or its group; a selected group moves as
 * one). Selected siblings move as a block and keep their order; Forward / Backward move the block one
 * place past the next unselected sibling. At the limit the button / item is unavailable, no step. Keys
 * with focus in the editor and not in a text field: Ctrl/Cmd+BracketRight forward, Ctrl/Cmd+
 * BracketLeft backward, with Shift to the front / back (event.code). Alt+Up / Alt+Down in the Layers
 * list stay. Model: moveOrder gains multi-id and to-end forms (model.ts).
 * (r4) Handles: in the Select tool the editor sets the canvas `transform` to the union box of the items
 * (scale true, rotate true, keepRatio = the "Lock ratio" switch in "Position and size", default on,
 * angle = the single item's `angle`, else 0) and no longer draws its own `.selbox` for it (other
 * selected boxes may stay as plain outlines). On mc-path-transform it applies the matrix to every item
 * from the document at gesture start (as layer moves do); Esc restores that document; a commit is one
 * history step "Scale" / "Rotate" (keyboard steps merge within 1 s); a rotate adds its angle to each
 * layer's `angle` (mod 360). Alternatives without a drag (WCAG 2.5.7): W, H and Angle fields with Lock
 * ratio, "Rotate 90 degrees clockwise" / "counter-clockwise" next to Flip and in the menu, Ctrl/Cmd+
 * Shift+Arrows and the Rotation slider (canvas).
 * (r4) Context menu, "Shape actions" (PathMenuElement inside the editor's shadow root): opened by the
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
 * render-icon.ts, mc-svg-icon.ts, follow-icon.ts, template-merge.ts; the notice in design 01
 * section 2b shows only the lines that apply, from SvgEditorModuleFacts):
 * - icon_fx keeps working: colours (incl. accent / secondary), fill, draw, morph and device motion.
 *   Own and saved icons are always drawn by <mc-svg-icon>. There is no "Glow" icon_fx key (Glow is
 *   an animated-icon Style); the notice must not name it.
 * - State icons (icon_on / icon_off) win over the drawing whenever they match the state (unchanged
 *   order in mc-svg-icon: rig, state icon, own icon, entity icon).
 * - An animated icon PICKED from the library (a library animation entry): it draws its own copy of
 *   the old icon, so the card editor removes that entry after the settled icon change, as it does
 *   for any icon change today (follow-icon.ts). Done therefore removes it; the notice says so
 *   before Done ("The animated icon you picked is removed: it draws mdi:lightbulb. Animate your
 *   drawing with This icon.").
 * - A "This icon" animation (quick document): it follows the new icon. Today follow-icon.ts treats
 *   `icon: svg` like a cleared icon and leaves the rig on the old shape (the rig would keep drawing
 *   mdi:lightbulb over the drawing). Fix in T11: explicitIcon/followIcons treat `svg` (geometry from
 *   the module's `svg` through svgGeometry) and `mcu:<id>` (through icon-source) as followable
 *   icons, re-split by piece index and embed rig.svg, as for any other icon change.
 * - Templates: Magic Card has no icon template. On a template-linked card, `icon` and `svg` are
 *   synced content keys: Done writes them as this card's override (not_synced icon and svg, the
 *   same path as any icon edit on a linked card); the template keeps its icon. Notice: "This card
 *   is linked to a template. Your drawing is used on this card only."
 * - Nothing else in the module is changed by Done.
 * - (r5) Nested <g> (E3) must change nothing at runtime: the sanitiser allows g at any depth, `.mc-accent`
 *   paints at any depth, and the geometry readers (svgGeometry, the follow-icon piece split) must treat
 *   <g> as transparent. T34 proves it with a 4-level icon through icon_fx draw / morph and a "This icon"
 *   animation, magic-card.js +0 B. If a reader only takes direct children, the fix goes in the editor's
 *   export instead (toSvg writes at most one <g> level; the tree stays editor-only), never in the runtime.
 *
 * ── <mc-shape-studio> ──
 * Opened from the shape picker (design panel) by the "Custom" tile, "Edit as custom" or "Edit shape".
 * Properties: hass; value: ShapeEditorValue; customShapes: the card's custom_shapes;
 * libraryAvailable. Every value has a labelled field; canvas handles mirror the fields. Free path
 * mode uses <mc-path-canvas> with maxPaths 1 and a constrain hook that keeps each point's anchoring
 * (custom-shape 1.0.0). In free path mode the studio always writes `padding` (px per side, from its
 * inscribed-rectangle solver at the "Edit at" size, raised by "Extra space") and shows W6 when
 * content is cut at a preview size (custom-shape 1.0.0 Content inset).
 * (r5) host?: SvgEditorHost, default 'card'.
 * Previews: three boxes (120 x 120, 360 x 120, 720 x 200) drawn with the runtime shapePath, so the
 * preview is the renderer, plus the real card behind the editor as today.
 * Mode switch (revision 3): a "Corners | Free shape" segmented control (ShapeEditorMode) is the first
 * control of the panel, above the type tiles and starters. Corners -> Free shape converts the corner
 * outline to points (the existing Convert to path), one history step. Free shape -> Corners goes
 * back to the corner settings the shape last had (square corners if it started as a path) and drops
 * the points, one history step (undo brings the points back); when points were edited, a one-line
 * note under the switch says so before the switch is used. Corner mode keeps no canvas and no draw
 * tools; pressing a free-shape action from Corners is not offered (the switch comes first).
 * Free shape tools (revision 3), all on the path canvas (loaded on entering Free shape, as today):
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
 *   step, default anchoring (each point anchored to its nearer edge, as new points are today),
 *   padding solver rerun with the raise-survives rule. Every kind is at most 24 points.
 * Boolean operations in the shape editor (revision 3), Free shape only:
 * - "Add shape" (same kind list) puts a pending operand on the canvas as path 1 (maxPaths 2, dashed,
 *   no fill), centred, half the Edit-at box in size; it moves by drag (Select) and by X / Y / W / H
 *   fields. Then Combine, Subtract or Intersect (SHAPE_BOOLEAN_OPS) applies it to the outline (outline
 *   first, so Subtract = outline minus operand); Cancel drops it. Exclude is not offered: with one
 *   outline and holes filled it either equals Combine or splits the shape.
 * - The operand is never written to the config and is not a history step; `mc-shape-change` carries
 *   only the outline. Undo after an apply restores the outline with nothing pending.
 * - Result rules (card shapes are one closed outline; holes stay a Won't, custom-shape 1.0.0):
 *   one piece without holes -> applied. Several pieces -> singleOutline() keeps the largest, notice
 *   "Kept the largest piece. N smaller pieces were removed." Holes -> filled, notice "Card shapes
 *   have one outline, so the hole was filled." (both notices can show). More than MAX_SHAPE_POINTS
 *   points -> not applied, nothing changed: "The result needs N points. A card shape can have 64."
 *   Reason 'empty' -> not applied: "Nothing would be left of the shape." 'too-complex' -> not
 *   applied, same text as the SVG editor. An applied result gets default anchoring, the padding
 *   solver reruns (raise-survives rule), W6 and the crossing check run as after any edit, one
 *   history step labelled "Combine shape" / "Subtract shape" / "Intersect shape", the operand is gone.
 * (r4) What the shape editor takes from revision 4 (Free shape only; Corners has no canvas, no menu
 * and no "More actions"): no align, distribute, arrange, flip, rotate, duplicate or placement row (one
 * outline that fills its box). The pending operand gets the canvas `transform` (scale true, rotate
 * false, keepRatio true, bounds = the Edit-at frame); a scale updates its X / Y / W / H and, like any
 * operand change, is not a history step. No Angle field and no rotate handle this round. "Centre" puts
 * the operand in the middle of the Edit-at box. Context menu "Outline actions" (canvas `contextMenu`
 * true, plus "More actions"): a point -> Corner or Smooth, Add point after, Remove point; a segment ->
 * Add point here (at the pressed point, PathContext.hit.at); the pending operand -> Combine, Subtract,
 * Intersect, Centre, Cancel; empty canvas -> Start from a shape..., Add shape..., Pen.
 * Events:
 * - `mc-shape-change` detail ShapeChangeDetail; `commit` false during drags. The host applies it
 *   through design-panel's ShapePatch (extended with custom_shapes) and pushes one history step
 *   per commit.
 * - `mc-shape-close` detail ShapeCloseDetail, from Done and from Back to card editor. The change
 *   events already applied everything (the card behind the editor is live), so there is nothing to
 *   confirm on leaving; the host closes the layer and returns focus to the opener. A pending operand
 *   or pen outline is dropped on close (it was never applied).
 * - (r5) `mc-shape-save` detail ShapeSaveDetail, host 'mcu' only (section "(r5) Hosts").
 * Additive in T7 (2026-10-18, for the Architect to confirm): the properties `preset` ("Edit as custom":
 * the preset's `shape` and `shape_options`; the studio converts it, `Notch` becomes Bevel, `Ticket`,
 * `Wave` and `Blob` get a notice) and `label` (the target, "Living room tile"), and the event above.
 * Done after "Edit as custom" with no edit still sends one `mc-shape-change` so the card turns custom.
 * Recorded by the card editor (T8 / T11, 2026-10-18): the card editor uses all three as written (it sets
 * `preset` and `label`, writes on `mc-shape-change` with `commit` true, closes on `mc-shape-close`).
 * Confirmed by the Architect in revision 3.
 *
 * Host rules found in the live check (HA 2026.10.2, src/editor/custom/layer.ts, T8 / T11):
 * - The layer is a modal <dialog> on <body> (top layer), not a child of the form: HA's card dialog
 *   transforms and clips, and the form re-renders on every committed change. The editors' ancestor
 *   <dialog> walk therefore finds none; the host covers Escape itself.
 * - HA's card dialog is a wa-dialog that also closes on a keydown that reaches its document-level key
 *   handling, not only on the browser's cancel. The editors' layer-root handler stops Escape only while
 *   focus is inside their shadow DOM; with focus on the editor element, the dialog or the page it did
 *   not, and the card dialog closed. The host stops Escape on the dialog (bubble) and on the window
 *   (capture, targets outside the layer), ignores `cancel`, and focuses the editor element on open.
 * - The entry button must stay enabled while the chunk loads (a disabled button drops focus, and focus
 *   returns to the opener, or its `data-focus-key` replacement).
 *
 * ── (r5) Hosts (E1): 'card' and 'mcu' ──
 * 'card' (default) is everything above. 'mcu' = hosted by the Magic Card Utils panel (mcu-library 1.0.0
 * r4 "Editors in the panel"): no card, no module, no entity, no HA dialog.
 * - Version: both element classes get `static contractRevision` (= SVG_EDITOR_CONTRACT_REVISION). The
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
 *   existing unsaved-work confirm. Imports go through sanitizeSvg as in 'card' (same boundary, CRA).
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
 * ── (r5) Dual-tone (E2) ──
 * The names stay "Main" and "Accent" everywhere (CEO 2026-10-18). No new model, config or markup field
 * (Paint is already none | main | accent; accent markup is class mc-accent).
 * - A "Dual-tone" switch in the document section. On open it is on when any layer paints Accent (fill
 *   or stroke), else off. Session state.
 * - Off: the paint pickers offer None and Main. Turning it off while N layers use Accent asks "Make N
 *   Accent layers Main?"; confirm sets them to Main as one history step "Single tone"; cancel keeps it on.
 * - On: the pickers offer None, Main and Accent. Each layer row shows a text tag "Main" or "Accent" (not
 *   colour alone, WCAG 1.4.1); the row menu gets "Make Accent" / "Make Main" (fill and stroke, one step).
 * - Preview strip (shown when the drawing has content): "In Magic Card" (Main and Accent in the card's
 *   colours, or the preview colours in 'mcu') and "In Home Assistant" (haForm: `path` in Main and
 *   `secondary_path` in the same colour at HA_SECONDARY_OPACITY), each at 24 and 48 px, labelled. It
 *   replaces the separate 24 px "In Home Assistant" preview; W11 is unchanged.
 * - Save and "Copy as HA path": `path` and `secondary_path` as mcu-library "Saved icon path" (Accent
 *   shapes go to secondary_path, unchanged). With Accent layers the copy menu adds "Copy accent path".
 *
 * ── (r5) Groups and the layer tree (E3) ──
 * Model (src/svg-editor/model.ts, editor-only):
 * - Group gains `parent?: string` (the enclosing group's id; absent = top level). Shape.group stays the
 *   innermost group.
 * - Invariants, checked by a test helper after every operation: (I1) the shapes under a group, at all
 *   depths, are one contiguous run of `shapes`; (I2) every parent exists, no cycles; (I3) depth(group) =
 *   1 + depth(parent) <= MAX_GROUP_DEPTH (top-level group = 1); (I4) a group with no shape under it is
 *   removed.
 * - Paint order is the order of `shapes` (index 0 is painted first, the bottom). The tree lists the top
 *   first: a parent's items (its own shapes and child groups, ordered by their first shape) in reverse
 *   paint order, each group's items under it. This is the order T25 / T30 fix; E3 keeps it.
 * - Hidden and locked count for every descendant (an item is hidden when it or any ancestor is).
 * - toSvg writes one bare <g> per group level (nested, no attributes); hidden subtrees are left out.
 *   Import turns nested <g> into groups up to MAX_GROUP_DEPTH and puts deeper content into the 4th level
 *   with the note "Groups deeper than 4 levels were merged." Names, hide, lock and open state are not in
 *   the markup (as today): a reopened icon gets its structure back with default names.
 * - Operations, each one history step, pure: groupItems(ids) puts a new group in the parent of the
 *   top-most item, at its place (items from other parents move in); refused when any item would end up
 *   deeper than MAX_GROUP_DEPTH. ungroup(id) moves its items to its parent at its place.
 *   moveItem(id, place: TreePlace): place.index is the position in the parent's tree order (top = 0)
 *   counted after the item is taken out. Refused, no change, when the place is inside the item itself,
 *   would exceed MAX_GROUP_DEPTH, or the target group (or one of its ancestors) is locked. The r4
 *   arrange order and moveOrder act on sibling items, a group as one block.
 * - Everything that counts "a selected group as its layers" (boolean operands, r4 items, handles) walks
 *   all depths; a selected group is one item for align and handles.
 * Layers list:
 * - role=tree; rows role=treeitem with aria-level, aria-expanded (groups), aria-setsize, aria-posinset;
 *   roving tabindex. Up / Down move focus, Right opens a group or goes to its first item, Left closes it
 *   or goes to the parent, Home / End, Enter selects, Ctrl/Cmd+Space adds to the selection, F2 renames.
 *   Indent per level; rows and their buttons at least 24 x 24 CSS px (2.5.8); the focused row is kept
 *   clear of the sticky list header with scroll-padding (2.4.11).
 * - Drag (pointer events, not HTML drag and drop): only from the row's grip button ("Drag to move
 *   <name>"), after DRAG_START_PX; touch-action none on the grip only. Over a row: top quarter = above,
 *   bottom quarter = below, middle half of a group row = into it (as its top item). A line or a group
 *   outline shows the target; an invalid target shows the not-allowed state and the reason in the list's
 *   status line ("Groups can be 4 levels deep.", "<name> is locked.", "A group can't go inside itself.").
 *   The list scrolls when the pointer is within DRAG_EDGE_PX of its top or bottom edge. Escape cancels.
 *   The drop is moveItem, one history step "Move layer". A long-press on the row (not the grip) still
 *   opens the r4 context menu and never starts a drag.
 * - Without a drag (WCAG 2.5.7), from the row menu ("Move" submenu) and keys on a focused row: Move up
 *   (Alt+Up) and Move down (Alt+Down), now within the tree; Move into group above (Alt+Shift+Right: the
 *   item becomes the bottom item of the group right above it, so its paint order does not change); Move
 *   out of group (Alt+Shift+Left: it becomes the item right below its former group). Unavailable at a
 *   limit, with the reason. Keys follow the r4 consumed-key rule.
 * - After every move the polite live region says "<name> moved into <group>, position i of n" or
 *   "<name> moved to the top level, position i of n".
 * - "Group" inside a group at MAX_GROUP_DEPTH is disabled with "Groups can be 4 levels deep."
 *
 * ── (r5) Path tools (E4), SVG editor only, path-tools 1.0.0 ──
 * - Entry points: an inspector section "Path" (Outline stroke, Offset, Simplify, Join, Split at point),
 *   the context menu submenu "Path" (same items, same reasons), "Split here" in the point menu, and a
 *   "Knife" rail tool (key K, consumed-key rule) placed like the line tool: drag, two clicks or the
 *   keyboard crosshair (2.5.7).
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
 *
 * Contract tests added in revision 3 (QA): grid size sets gridStep and snap.grid, nudge follows it,
 * Custom bounds; every primitive kind placed by drag, two clicks and keyboard; Combine of two layers
 * gives one layer at the bottom-most place with its paint, Subtract order, disabled reasons, open
 * lines counted, 'empty' leaves the document unchanged, one undo restores the operands; shape editor
 * mode switch both ways with undo, pen replace / cancel / under-3 refusal, starter replace keeps a
 * user's padding raise, Add shape + each op incl. largest piece kept, hole filled, over-64 refused,
 * operand never in mc-shape-change, Esc drops a pending operand before clearing the selection;
 * import scan (no src/path/draw.ts, edit.ts, tidy.ts, nothing from src/path-booleans/ but loader.ts).
 * Contract tests added in revision 4 (QA): align each edge against selection / canvas / safe with a
 * rotated shape and a stroked shape (stroke ignored), a group as one item, a locked layer left out;
 * 'selection' falls back with one item; distribute 3 and 4 items incl. overlap, ends fixed; Centre on
 * canvas, Fit to safe area (uniform, centred, enlarges, stroke width unchanged), Match safe-area edges
 * (least move, inside = no step, oversize centred), all three with no selection; arrange block moves
 * inside a group and at top level, limits unavailable, Ctrl/Cmd+[ / ] (+Shift) by event.code; handles
 * scale and rotate several layers about the shared box, angle bookkeeping, Esc restore, one step per
 * drag; menu items per target in both editors, each runs the same action as its button (history label,
 * announcement), focus after pick and close; consumed keys do not reach document listeners; shape
 * editor operand scale updates the fields and is not a history step, no rotate handle, no menu in
 * Corners; messages matched by includes.
 * Contract tests added in revision 5 (QA): host 'mcu' in both elements (name required, new id unique
 * against the list, conflict with base_updated_at, no module notice or Keep a copy, preview colours not
 * in the markup, the studio keeps its own value, asks before leaving unsaved work, mc-shape-save, stays
 * open after a save), static contractRevision; Dual-tone state on open, Off turns Accent layers Main in
 * one step, tone tag text, both preview renderings, Copy accent path; tree invariants I1-I4 after group,
 * ungroup, moveItem and import at every depth, the depth / locked / self refusals with their reasons,
 * paint order matches the tree after a drop (top row painted last), one Ctrl+Z restores, keyboard moves
 * and their announcements, long-press opens the menu and never a drag, nested <g> in toSvg and on import
 * (5 levels merged into 4); path tools: chunk not fetched on open, load failure leaves the drawing
 * unchanged, each tool's target rules, Outline stroke of a filled and stroked layer gives two layers,
 * Join of two layers, Knife piece layers and names, one undo step per Apply, Escape drops the preview.
 */

export const SVG_EDITOR_CONTRACT_VERSION = '1.0.0';
/** 4 since T30 (revision 4); moves to 5 when T39 implements the (r5) host mode. */
export const SVG_EDITOR_CONTRACT_REVISION = 4;
export const SVG_EDITOR_TAG = 'mc-svg-editor';
export const SVG_EDITOR_CHUNK = 'svg-editor';
export const SVG_EDITOR_CHUNK_FILE = 'magic-card-svg-editor.js';
export const SHAPE_EDITOR_TAG = 'mc-shape-studio';
export const SHAPE_EDITOR_CHUNK = 'shape-editor';
export const SHAPE_EDITOR_CHUNK_FILE = 'magic-card-shape-editor.js';

/** Revision 3: grid size choices in viewBox units (24 x 24 artboard). */
export const SVG_GRID_STEPS: readonly number[] = [0.5, 1, 2, 3, 4];
export const SVG_GRID_DEFAULT = 1;
export const SVG_GRID_MIN = 0.1;
export const SVG_GRID_MAX = 12;
/** Revision 3: boolean ops each editor offers. */
export const SVG_BOOLEAN_OPS: readonly BooleanOp[] = ['union', 'subtract', 'intersect', 'exclude'];
export const SHAPE_BOOLEAN_OPS: readonly BooleanOp[] = ['union', 'subtract', 'intersect'];
/** Revision 4: what Align is relative to, and the safe-area inset at 24 x 24. */
export const SVG_ALIGN_TARGETS = ['selection', 'canvas', 'safe'] as const;
export const SVG_SAFE_INSET = 2;

/** Revision 5: who hosts the editors. */
export const SVG_EDITOR_HOSTS = ['card', 'mcu'] as const;
/** Revision 5: the lowest element contractRevision the Magic Card Utils panel accepts. */
export const SVG_EDITOR_MCU_MIN_REVISION = 5;
/** Revision 5: group nesting cap (CEO 2026-10-18). A top-level group is level 1. */
export const MAX_GROUP_DEPTH = 4;
/** Revision 5: a layer drag starts after this many CSS px; edge auto-scroll zone. */
export const DRAG_START_PX = 4;
export const DRAG_EDGE_PX = 32;
/** Revision 5: how Home Assistant draws secondary_path (preview strip). */
export const HA_SECONDARY_OPACITY = 0.5;
/** Revision 5: neutral preview colours in the MCU host (HA's default state icon and accent colours). */
export const MCU_PREVIEW_MAIN = '#44739e';
export const MCU_PREVIEW_ACCENT = '#ff9800';

/** Revision 3: the shape editor's top-level mode switch. */
export type ShapeEditorMode = 'corners' | 'free';
/** Revision 4. */
export type SvgAlignTarget = (typeof SVG_ALIGN_TARGETS)[number];
export type SvgAlignEdge = 'left' | 'centre' | 'right' | 'top' | 'middle' | 'bottom';
export type SvgArrange = 'front' | 'forward' | 'backward' | 'back';
/** Revision 5. */
export type SvgEditorHost = (typeof SVG_EDITOR_HOSTS)[number];

/** Revision 5: a place in the layer tree. parent null = top level; index in tree order, top = 0. */
export interface TreePlace {
  parent: string | null;
  index: number;
}

export type SvgEditorSource =
  | { kind: 'blank' }
  | { kind: 'icon'; icon: string }
  | { kind: 'svg'; svg: string }
  | { kind: 'library'; id: string };

/** What the host tells the editor about the module, for the notice (design 01 section 2b). */
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
  target: 'module' | 'library';
  /** sanitizeSvg output. */
  svg: string;
  /** target 'library': the stored item (as the server returned it). */
  saved?: SavedIconInput;
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

/** Revision 5, host 'mcu': the stored item as the server returned it. */
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
