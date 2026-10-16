# Animation studio

The animation studio is a full-screen editor for your own animations. You build keyframe, particle, path and sequence animations with a live preview on a real Magic Card, save them in a library, and use them on any card next to the built-in presets.

A keyframes animation can do more than move the whole element. Start an icon animation from any icon or from the icon library of 107 ready-made animations, and animate its parts with one-click presets. It can split the icon into parts that move on their own, add shapes you draw, move the name, state and background of a module separately, play something else per entity state, and tie properties to an entity's value.

The library is shared by every card in your Home Assistant. A card refers to an animation as `preset: custom:<id>`. When you save a change in the studio, every card that uses that animation updates while it is open.

## Requirements

-   The [Magic Card Utils](https://github.com/therealmcsparrow/magic-card-utils) integration, version 2026.10.04 or newer. It stores the library and hosts the studio in its sidebar panel.
-   Magic Card added as a dashboard resource of type JavaScript module (`type: module`). HACS and the Home Assistant resource editor add it that way. A resource added as `type: js` does not work.
-   The files `magic-card-animation-studio.js`, `magic-card-icon-library.js` and `magic-card-anim-runtime.js` in the same folder as your `magic-card.js` resource. Each Magic Card release attaches them, and HACS installs them with the card. With a manual install, copy them next to `magic-card.js`.
    -   The panel loads the studio from `magic-card-animation-studio.js`.
    -   The studio loads `magic-card-icon-library.js` when you open the Icon animation window, and shows Loading icon library… until it is there. Without the file the window says the icon library could not be loaded and offers Try again. Starting from an icon still works. See [Start from the icon library](icon-mode.md#start-from-the-icon-library).
    -   Cards load `magic-card-anim-runtime.js` only when an animation uses icon parts, drawn shapes, card parts, state clips or value bindings. Without the file those cards still play the rest of the animation.
-   An admin user. The panel is only in the sidebar of admin users, and saving or deleting an animation needs an admin. Any signed-in user can read the library, so cards play custom animations on every user's dashboard.
-   A desktop browser or a tablet. There is no phone layout.

Without the integration, cards still play animations that are embedded in their own config. See [What happens without the integration](using-in-cards.md#what-happens-without-the-integration).

Older Magic Card versions without the animation runtime ignore the newer fields of an animation (`rig`, `tracks`, `clips`, `bindings`) and play only its top-level keyframes. An animation that has only tracks and no top-level keyframes plays nothing there.

## Opening the studio

-   Open the Magic Card Utils panel in the sidebar and go to its Animations tab.
-   Open one animation directly with `?animation=<id>` on the panel URL, for example `/magic-card-utils?animation=doorbell-wiggle`.
-   In the card editor, an animation from the library has an Edit in animation studio link under its entry. It opens the panel at that animation in a new browser tab, or in the same tab when you are already in the panel.

The studio starts on the library. Opening an animation switches to the editor, and the URL keeps `?animation=<id>` in step with the open animation.

The preview plays on a real `magic-card`, so Magic Card has to be loaded on the page. When it is missing, the stage shows "Magic Card is not loaded on this page".

## Pages

-   [Library](library.md): search, new animations, customising a preset, duplicate, rename, delete, export and import YAML, and the used-by count.
-   [Editor and preview stage](preview-stage.md): the layout with Layers, stage, timeline and inspector, the timing settings, the preview tiles, light and dark, speed, play, pause and scrub, reduced motion, tablets, undo and redo, unsaved changes and keyboard shortcuts.
-   [Keyframes](keyframes.md): the timeline with a group per target, properties, multi-select, snapping, zoom, the keyframe inspector, easing per keyframe and per property, and copy and paste between lanes and targets.
-   [Icon animations](icon-mode.md): starting from an icon or the icon library (a separate file loaded on demand), the icon split for you, and part presets with their parameters and pivots.
-   [Icon library](icon-library.md): 107 ready-made icon animations by domain, search, the domain filter and customising an entry.
-   [Icon parts](parts.md): splitting an icon, selecting, grouping and merging parts, pivots and preset pivots, part presets, draw-on and motion paths per part, and what does not work with parts.
-   [Drawing](drawing.md): the drawing tools, freehand smoothing, snapping, shapes as animation targets, and drawing on a tablet.
-   [Own icons](own-icons.md): saving the edited icon as an SVG for any card, importing SVG files, and the size limits.
-   [Animated SVG export](animated-svg-export.md): an icon animation as a looping SVG file with CSS keyframes and a SMIL fallback, its colour, and what it leaves out.
-   [Card parts](card-parts.md): animating the name, state, icon and background of a module separately, and the generated background layer.
-   [States and values](states-and-values.md): clips per entity state with transitions, value bindings, the `entity:` override and the state and value preview.
-   [Particles](particles.md): the particle designer, and particles based on a built-in preset.
-   [Path motion](path-motion.md): drawing a path on the stage, templates, and what moves along it.
-   [Sequences](sequences.md): steps played one after another, loop and stagger.
-   [Using animations in cards](using-in-cards.md): My animations in the animation picker, `preset: custom:<id>` with overrides, embedding animations when you share a card, cards linked to a template, and cards without the integration.
-   [Animation YAML](yaml.md): the animation document format, every field with its type, default and limits.

Related: [Animations](../design/animations.md) (the built-in presets), [Design](../design/README.md), [YAML reference](../yaml/README.md).
