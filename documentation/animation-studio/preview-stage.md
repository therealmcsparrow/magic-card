# Editor and preview stage

Opening an animation switches the studio to the editor. The editor fills the browser window: the page itself never scrolls, only the Layers list, the timeline lanes and the inspector scroll inside their own area. On macOS, use Cmd where this page says Ctrl.

-   [Layout](#layout)
-   [Layers](#layers)
-   [Stage and timeline](#stage-and-timeline)
-   [Inspector](#inspector)
-   [Animation settings](#animation-settings)
-   [Preview stage](#preview-stage)
-   [Tablets and smaller screens](#tablets-and-smaller-screens)
-   [Saving and errors](#saving-and-errors)
-   [Undo and redo](#undo-and-redo)
-   [Unsaved changes](#unsaved-changes)
-   [Keyboard shortcuts](#keyboard-shortcuts)

## Layout

| Part | What it holds |
| --- | --- |
| Top bar | Library (back to the list), the animation's name, its kind chip, a New or Unsaved changes chip, Undo, Redo and Save |
| Layers | The left column: what the animation can move. See [Layers](#layers). |
| Stage | The live preview with its transport row, in the middle |
| Timeline | Under the stage, for keyframes animations. See [Keyframes](keyframes.md). |
| Inspector | The right column: settings for what is selected. See [Inspector](#inspector). |

The kind editors have their own pages: [Keyframes](keyframes.md), [Particles](particles.md), [Path motion](path-motion.md) and [Sequences](sequences.md). The particle designer, the path editor and the sequence steps sit at the top of the inspector.

## Layers

The Layers column is 240 px wide, or 224 px when the studio is less than 1100 px wide. Its edge button hides it and shows it again; the stage takes the width of a hidden column. See [Hiding the panels](#hiding-the-panels). The studio remembers whether Layers is hidden in this browser.

For a keyframes animation the column holds three panels:

-   [Card parts](card-parts.md#in-the-studio): Element, Icon, Name, State and Background.
-   [Icon parts](parts.md#the-parts-list): Split icon, then the parts and groups of the icon.
-   [Shapes](drawing.md#the-shapes-list): your drawn shapes, once there are any.

Click a row to select that target. The timeline then shows its lanes, and the inspector shows its settings. Ctrl, Cmd or Shift adds a target to the selection or takes it out. Click the selected row again to clear the selection.

For path and sequence animations the column lists Element and Icon, with Moves on the one the animation moves. A particles animation shows "Particles play on the whole element."

### Hiding the panels

Layers and the inspector each have an edge button on their inner side while they sit beside the stage. Press it to hide the panel: the stage takes its width, and the button stays at the window edge. Press it again to show the panel with its selection and scroll position. The hidden panel keeps its settings and does not change the animation.

Ctrl+\ (Cmd+\ on a Mac) hides both panels when either is shown. When both are hidden, it shows again the panels it hid last. The shortcut works while focus is in the studio. On keyboard layouts that type \ with AltGr, such as German and Dutch, the shortcut types the character instead, so use the edge buttons.

If you collapsed Layers in an earlier version, it opens hidden once, with a short hint, and the studio then remembers the new setting instead.

## Stage and timeline

The stage shows the preview card at its real size, or scaled down to fit its area. It never shows the card larger than a dashboard would. When the card is shown smaller, a tag in the corner says by how much, for example 74%. On the Icon tile the card is 144 px high, so the icon isn't lost in an empty card.

While a part, group or shape is selected, or a drawing tool is in use, the stage zooms to the icon: the icon, with some room around it, fills the stage, up to four times its size. The tag then says Icon and the zoom, for example Icon 350%. Handles and points on the stage keep their size on screen. Selecting something else, or nothing, shows the whole card again.

A splitter between the stage and the timeline sets their heights:

-   Drag it to resize. Stage and timeline each keep at least 160 px.
-   With the splitter focused, Up and Down move it, with Shift in larger steps. Home and End go to the limits.
-   Double-click it to return to the automatic height, which fits the timeline to its lanes, or to its keyframe list on a narrow timeline (at most 60% of the column). The automatic height is set when you open an animation and when the window changes size. While you edit, it only grows, so the stage doesn't jump.

The studio remembers a height you dragged in this browser. Animations without a timeline give the whole middle column to the stage.

## Inspector

The inspector is 320 px wide (288 px when the studio is less than 1100 px wide) and shows what fits the selection. Each panel has its own section with a title, which opens and closes like the settings sections:

| Selected | The inspector shows |
| --- | --- |
| Nothing | The kind editor for particles, paths and sequences, then the animation settings (Animation, Timing, What moves), then [States](states-and-values.md#state-clips) |
| Keyframes on the timeline | The [keyframe inspector](keyframes.md#keyframe-inspector) |
| A part or group | The [part inspector](parts.md#animating-a-part) with its pivot (a part preset's pivot when there is one, see [Preset pivots](parts.md#preset-pivots)), [Part presets](icon-mode.md#part-presets) and [Value bindings](states-and-values.md#value-bindings) |
| Element or Icon | What the animation moves, with Move the icon instead (or Move the element instead) and Origin, then Value bindings. Icon without parts also gets Icon parts with Split icon, so you can split it from the inspector even while Layers is hidden. |
| A card part (Name, State, Background) | Value bindings |
| A drawn shape, or a drawing tool | The [shape inspector](drawing.md#the-shape-inspector) or the tool's options |

With something selected, a line at the top names it, for example "2 keyframes · Clapper", next to an Animation button that returns to the animation settings. Escape does the same.

The settings sections (Animation, Timing, What moves and the kind editor) open and close with a click on their header. The studio remembers which are open. A section that holds an error stays open and shows a dot in its header.

## Animation settings

| Section | Field | Notes |
| --- | --- | --- |
| Animation | Name | Up to 80 characters. The help text below shows the reference cards use, `custom:<id>`. The id can't be changed in the studio. |
| Timing | Duration | Seconds per cycle, 0.05 to 600. Sequences have no Duration: they last as long as their steps, and a card can still scale them with its own Duration. |
| Timing | Easing | Linear, Ease, Ease in, Ease out, Ease in-out, Spring, Smooth or Snap. A `cubic-bezier()` or `steps()` value from YAML shows as its own option. |
| Timing | Repeat | Infinite, 1, 2, 3, 5 or Custom. Custom shows Repeat count. |
| Timing | Direction | Normal, Reverse, Alternate or Alternate reverse |
| What moves | Target | Element or Icon. Keyframes and sequences only. Icon moves only the module's icon. A card's entry can override it. |
| What moves | Origin | Keyframes only. The point it scales and turns around: Center, Top, Bottom, Left, Right or a corner. A value from YAML, such as `50% 100%`, shows as its own option. |

These are the defaults a card uses when its entry leaves the field empty. See [Overrides](using-in-cards.md#overrides).

## Preview stage

The stage plays the animation on a real Magic Card, with the timing you set.

### Transport row

One row under the preview holds, from left to right:

-   Play and pause. Space does the same while focus isn't on a button or a field.
-   A scrubber across one cycle. Dragging it pauses the preview and holds that moment.
-   The time, for example `0.80 / 2.00 s`.
-   Speed: 0.25×, 0.5×, 1×, 1.5× or 2×. Speed only affects the preview and is not saved.
-   Preview tile: Icon (a bell icon), Button (a Doorbell button), Text ("Front door") or Card (an Info module with an icon, "Living room" and "21.5 °C"). Arrow keys move between them.
-   Card theme: Light card or Dark card. The stage starts in the theme of the page.
-   Reduced motion: shows the card as it looks with reduced motion turned on in the operating system or browser. The card then shows its still state, so the animation doesn't play, and play and scrub are disabled.

On a narrow stage the tile, theme and reduced motion controls wrap to a second line.

Particles, particles along a path and staggered sequences play on the card's row, which gives them room. A staggered sequence shows three tiles side by side, so you see the delay between them.

One cycle is the duration, the duration divided by Speed for custom particles, or the total length of a sequence's steps. The timeline and the sequence schedule follow the scrubber with their playhead.

While a field holds an invalid value, the stage keeps playing the last valid version of the animation.

### Tools on the stage

Depending on the animation, the stage also carries:

-   The Draw button and toolbar for keyframes animations. See [Drawing](drawing.md).
-   The parts overlay once the icon is split. See [Selecting parts on the stage](parts.md#selecting-parts-on-the-stage).
-   The path editor for path animations. See [Path motion](path-motion.md).
-   The state and value capsule for animations with clips or bindings. See [Previewing in the studio](states-and-values.md#previewing-in-the-studio).

When Magic Card itself is missing from the page, the stage shows "Magic Card is not loaded on this page".

## Tablets and smaller screens

The studio is made for a desktop and works on a tablet:

-   Everything uses pointer events, so a finger or pen works like a mouse. Handles and points on the stage have touch targets of at least 24 px at any stage scale.
-   Every action has a button. Nothing depends on hovering.
-   On the timeline a finger drag scrolls the lanes. Hold for 400 ms and then drag to select keyframes with a box. A quick tap clears the selection.
-   The Layers column has its edge button at every width, so a narrow window can give the stage the whole width.
-   Below 900 px the inspector slides over the editor instead of taking a column, and it has no edge button. The Inspector button in the top bar opens it, and selecting keyframes opens it too. Selecting a target, a part on the stage or a drawing tool keeps the stage in view. The focus moves into the inspector when it opens. Tap outside it, or press Escape, to close it; Escape puts the focus back on the Inspector button.

There is no phone layout.

## Saving and errors

Save (or Ctrl+S) checks the animation and stores it in the library. It is disabled while nothing has changed. A new animation becomes part of the library on its first save.

Errors show under the field they belong to. Errors in other places, such as the timeline or the parts, are listed at the top of the inspector with the field's path, for example `tracks[1].keyframes[2].draw`. Save stops with "Fix the marked fields first." while any error is left. When the integration refuses an animation, its message and field errors show in the same place.

## Undo and redo

Undo and Redo in the top bar (Ctrl+Z, Ctrl+Y or Ctrl+Shift+Z) work on the open animation. The history keeps 100 steps. Typing in one field counts as one step, and a drag (of a keyframe, a pivot, a point or a shape) counts as one step. A drag that is cancelled leaves no step. Opening another animation starts a new history. Saving keeps the history. After an undo or an edit, keyframes, parts and shapes that no longer exist drop out of the selection.

An animation can be at most 64 KB. A change that would make it larger (a split, a drawing, an edit on the timeline) is not made, and a note says so.

## Unsaved changes

The Unsaved changes chip shows while the animation differs from the stored one. Going back to the library, opening another animation or starting a new one then asks "Save your changes?":

-   Keep editing closes the question.
-   Discard drops the changes and continues.
-   Save saves first and continues when saving worked.

Closing or reloading the browser tab with unsaved changes makes the browser ask before it leaves.

When someone saves the open animation elsewhere and you have no unsaved changes, the editor switches to the new version.

## Keyboard shortcuts

| Shortcut | Where | Action |
| --- | --- | --- |
| `/` | Library | Focus the search field |
| Escape | Library | Close the New animation menu |
| Ctrl+S | Editor | Save |
| Ctrl+Z | Editor | Undo, not while typing in a field |
| Ctrl+Y or Ctrl+Shift+Z | Editor | Redo, not while typing in a field |
| Space | Editor | Play or pause the preview, not on a button or in a field |
| Escape | Editor | Back to the animation settings (the focus goes to the inspector), or close the sliding inspector |
| Ctrl+\ | Editor | Hide or show Layers and the inspector (see [Hiding the panels](#hiding-the-panels)) |

The shortcuts don't work while a window (delete, import, export, presets, unsaved changes, Save as icon, Import SVG) is open. The timeline, the parts list, the pivot handle on the stage (see [Pivots](parts.md#pivots)), the drawing tools, the path editor and the sequence steps have keys of their own, listed on their pages.
