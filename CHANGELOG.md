# Changelog

All notable changes to Magic Card. Dates are release dates (UTC). Detailed documentation is in [documentation/](documentation/README.md).

Magic Card uses calendar versions: year, month and a release number within the month.

## Unreleased

### Performance
-   Dashboards load about 45 % less code. The card editor is now a separate file, `magic-card-editor.js`, that loads when you edit a card or open the animation studio. `magic-card.js` shrinks from 1.26 MB to 0.68 MB.
-   A new file, `magic-card-editor.js`, ships next to `magic-card.js`. With a manual install, copy it to the same folder. If it cannot be loaded, Home Assistant opens its YAML editor for the card instead.
-   After an update, hard refresh once. If the editor file and `magic-card.js` come from different versions, the editor asks you to reload the page.

## 2026.10.03 (2026-10-16)

### Fixes
-   Animate icon: a This icon animation made on a module that held an edited copy of a My animations animation was stored under the copy's id, so the panel showed no parts and the next icon change removed the animation. It now gets its own id and follows the icon. A library animation picked over such a copy also gets its own id, and Make a copy of such a copy stays a My animations copy.

## 2026.10.02 (2026-10-16)

### Editor
-   Animated icons tab in the icon picker of the Icon, Info and Button modules: a grid of moving tiles with search and a domain filter, with My animations (your saved icon animations from Magic Card Utils) above the 107 built-in ones. A click sets the icon and its animation in one undo step. A built-in animation is stored in the card and plays without the integration. An animation from My animations is linked by id, so later edits in the studio reach the card. One animated icon per module: a new pick replaces the old one, and entries you added in the Animations list are left alone. The Light module keeps Animate icon.
-   On a card linked to a template, a picked animated icon is kept as the card's own change.
-   Animate icon shows the same tile grid in place of the Library chips. Applying an animation from My animations links it like the picker does. It shows as Applied with "From My animations." and a Remove button, and as Changed, not applied once you edit it. A link to an animation the library no longer has says so.
-   A library animation is removed when the module's icon changes in the editor, including Clear, the entity's icon or an own SVG. This happens once the icon has stayed the same for about a second and Home Assistant knows the new icon, so a half-typed id never removes it. One undo brings it back. An embedded copy of a linked animation stays in the card.
-   Removed the Edit in animation studio link from the Animations list and the Open in animation studio link from Animate icon. They left the card editor and lost unsaved changes. To edit an animation further, import the card's YAML in Magic Card Utils.

## 2026.10.01 (2026-10-16)

The first public release. It covers everything built since the initial build.

### Editor
-   Pane editor with a structure outline, an inspector (General, Conditions, Design and Actions tabs), Form and YAML modes, undo and redo, and a template bar.
-   Studio: a full-screen editor with Layers, a clickable live canvas that colours the selection by level, device widths, a floating bar and keyboard shortcuts.
-   Add rows, columns and modules from the outline and from Layers, with an options menu per item. Picker windows (entity, icon, service, media, card, template, colour, font, attribute, module selector) open in the top layer and fit on phones.
-   Column layouts as presets or per-column widths (`fr`, `%`, `px`, `auto`) in `column_widths`, with drag handles on the studio canvas that snap, work with the arrow keys and count as one undo step.
-   Layout modules (horizontal, vertical, slider, tabs, row) are managed in the tree. A tabs module shows one item per tab, a row module one item per column, each with its own Add module row and menu. The row module has the layout presets, column widths and per-column General, Conditions and Design of a card row.
-   Copy and paste a design, and reset buttons for design fields and sections.

### Modules
-   25 module types for content, controls, layout and advanced use: info, icon, text, markdown, image, button, light, bar, gauge, graphs with real history, clock, weather and forecast, camera with a live stream option, slider, spinbox, dropdown, separator, layout modules, an embedded custom card and more.
-   Tap, hold and double-tap actions on modules and rows, including opening and closing pop-ups. Toggle calls `turn_on`, `turn_off`, `open` or `lock` the way Home Assistant does.
-   Display conditions on cards, rows, columns and modules: state, attribute, time and Jinja templates. Templates also work in Text and Markdown.
-   Pop-up mode: a card as a bottom sheet or dialog, opened by a `#hash`, an action or an entity state.

### Design
-   A Design panel for every card, row, column and module, grouped under Layout, Style, Effects and Advanced: spacing, borders and border length, typography with Google Fonts, backgrounds and video backgrounds, flexbox, grid, hover, custom CSS, entity colours and conditional design rules.
-   Shapes: squircle, pill, circle, hexagon, octagon, notch, ticket, wave and blob, with the border, ring and flow-line anchors following the shape.
-   Value backgrounds: a tank that fills to an entity's value, or a history sparkline behind the content.
-   Rings: a value ring or an animated ring that follows the exact border radius. A ring on a `timer` entity counts down live, and `min` and `max` can come from an entity.
-   Flow lines between any two modules, with moving dots or dashes whose speed follows an entity value, for energy flows such as solar to house to grid.
-   Seasonal scenes for the four seasons and for Christmas, New Year, Valentine, Easter and Halloween, picked by date or by hand, or driven by a `weather` entity and `sun.sun`, with border decorations that follow the shape.
-   Icon effects on every module icon: liquid fill, device animations, line draw, morphing state icons, solid, duotone, gradient and value colours, animated weather icons, your own sanitised SVG, and third-party icon packs.

### Animations
-   More than 100 animation presets on the card, rows, columns and modules, several per element, with play conditions on any entity or on tap.
-   Animate icon in the Design tab of icon, button, info and light modules: pick an animation from a library of 107 animated icons, or split the module's icon into parts and give them one-click presets. The card stores the result in its own `custom_animations`, so it plays without any integration. A split of the module's own icon follows the icon when you change it in the editor.
-   Animation studio, in the Magic Card Utils sidebar panel: keyframes on a timeline with zoom, snapping and per-key easing, particles, path motion and sequences, with a live preview on a real Magic Card and a shared library.
-   Icon animations in the studio: split any icon into parts, group and merge them, set pivots, and animate each part with its own track, draw-on and motion path. A Part presets panel offers nineteen one-click presets, and the pivot handle shows and moves the pivot a preset uses.
-   Drawing tools for extra shapes, card parts (name, state, icon and background as separate targets), state clips and value bindings driven by an entity.
-   Save as icon exports an edited icon as SVG, and Animated SVG exports a looping file with CSS keyframes and a SMIL fallback.
-   Cards use library animations as `preset: custom:<id>` and update live when an animation is saved. YAML mode can copy a card with its animations embedded.

### Templates
-   Save a card as a template and link other cards to it. Linked cards keep local overrides per key, with sync indicators and a reset to the template's value.
-   A template's `custom_animations` reach linked cards, merged by id. A card can replace one with its own version, hide single ones with `hidden_animations`, or use only its own by listing `custom_animations` in `not_synced`.

### Files and requirements
-   `magic-card.js` must be loaded as a JavaScript module (`type: module`). HACS and the Home Assistant resource editor add it that way.
-   The release also attaches `magic-card-anim-runtime.js`, `magic-card-animation-studio.js`, `magic-card-icon-library.js` and `magic-card-icon-animator.js`. HACS installs them next to `magic-card.js`; with a manual install, copy them there too. Dashboards load the runtime only for animations that need it and never load the studio, library or animator files.
-   The animation studio needs the [Magic Card Utils](https://github.com/therealmcsparrow/magic-card-utils) integration, version 2026.10.04 or newer.
-   The icon shapes of the icon library come from Material Design Icons by Pictogrammers (Apache License 2.0).

## Initial build (2026-05-25)

The first version of the card.
