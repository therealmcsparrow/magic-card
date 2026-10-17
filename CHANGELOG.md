# Changelog

All notable changes to Magic Card. Dates are release dates (UTC). Detailed documentation is in [documentation/](documentation/README.md).

Magic Card uses calendar versions: year, month and a release number within the month.

## 2026.10.07 (2026-10-17)

The theme editor starts from 45 presets now, in two groups, and the documentation has a screenshot of each one.

Each release now has ten files. One is new: `magic-card-theme-presets.js`, which the create dialog loads when it opens. HACS installs it with the card. With a manual install, copy all ten to the same folder, then hard refresh.

### New
-   The create dialog of the Themes tab lists 45 presets, up from 5. Original has 25: the five from 2026.10.06 and 20 new ones, such as Glass Aqua, OLED Green and Summer. Inspired by has 20 palettes, such as Nord, Dracula, Solarized and Tokyo Night, each with its own colour values.
-   Search presets by name, palette or style, and use Show to switch between All, Original and Inspired by.
-   Every light and dark mode passes 4.5 to 1 for text, secondary text, text on the primary colour and the state colours.
-   [Theme examples](documentation/themes/examples/README.md): a screenshot of each preset, light and dark side by side.

### Improved
-   The presets load the first time you open the create dialog. While they load, the dialog says so. If they cannot load, it says so and offers Try again. Blank and An installed theme work in every state.
-   The OLED presets note that dark mode is pure black, and the glass presets note that blur and transparency can be slow on old tablets.

## 2026.10.06 (2026-10-17)

A theme editor for Home Assistant themes, in the Themes tab of the Magic Card Utils panel. Edit a theme with a live preview beside the fields, and try it on your dashboard before you save it.

Each release now has nine files. One is new: `magic-card-theme-editor.js`, which the Themes tab loads. HACS installs it with the card. With a manual install, copy all nine to the same folder, then hard refresh. The Themes tab needs Magic Card Utils 2026.10.08 or newer.

### New
-   Themes tab in Magic Card Utils: create a theme from blank, from one of five presets (Paper, Midnight OLED, Ember, Contrast and Frost) or as a copy of an installed theme. Save writes `/config/themes/<name>.yaml` and reloads Home Assistant's themes, so the theme shows in its list without a restart.
-   Variables in groups: the Home Assistant groups, a Magic Card group, and groups for Tile card, Mushroom, Bubble Card, Ultra Card and button-card. A group whose card is not installed stays editable and says that its preview is not available.
-   Light and dark modes with a shared base. Preview each mode, and get a warning when a value has no effect in a mode.
-   Colour, size and gradient fields, and a raw row for any variable name.
-   Try on dashboard shows the draft in this browser tab, with a Revert bar. Nothing is saved until you save.
-   Use this theme selects the saved theme for your user.
-   When the include lines are missing from `configuration.yaml`, the Themes tab shows them. Saving waits until they are in place. The editor never edits `configuration.yaml`.
-   Read-only theme files open for viewing, with Copy to edit.

### Known limits
-   Comments are removed when a file is saved. The editor asks once before the first rewrite.
-   A file that uses YAML aliases (`&anchor` and `*alias`) is read only.
-   Magic Card's own `--mc-*` variables cannot be themed yet. The card sets them itself.

## 2026.10.05 (2026-10-17)

Card design rules, gradient colours, new ring starts and dropdowns for the long lists.

### New
-   Card Design tab: "Editing design for" picks Default, Hover or a rule, as it does on modules. A rule can change the card's ring, shape, shape options, value background and seasonal scene while its conditions match. The rules are the same as the conditional appearance rules on the Conditions tab, and that tab still lists them.
-   Gradients: a colour field offers Solid or Gradient. Choose a linear or radial gradient, an angle for a linear one, and two to five colours. Gradients work on card and module backgrounds, the value background fill, the ring stroke, the icon colour and the text colour of text, info and markdown modules.
-   Gradient limits: ring and icon gradients are linear only. Ring thresholds, the track and the glow, the sparkline and the wave stay solid. A background gradient is not offered with a background image or with a background that is not a gradient. Where a browser cannot draw a gradient on text, the text shows its first colour. See the [gradients page](documentation/design/gradients.md).
-   Ring start has eight positions: Top, Top right, Right, Bottom right, Bottom, Bottom left, Left and Top left. Top right, Bottom right and Bottom left are new, and "Top center" is now "Top". Saved cards keep working.
-   The animation studio's Part presets are one Preset dropdown instead of a grid of buttons.

### Improved
-   The card Design tab is grouped under headings, like the module design panel. Shape and Seasonal are dropdowns. Value background type and Ring mode stay as buttons.
-   Hover on the card moved into the "Editing design for" picker.
-   Existing solid colours and existing YAML load and render unchanged.

## 2026.10.04 (2026-10-17)

Each release now has eight files. Three are new: `magic-card-editor.js`, `magic-card-particles.js` and `magic-card-preset-catalogue.js`. HACS installs them with the card. With a manual install, copy all eight to the same folder. After the update, hard refresh once.

### New
-   Particles in the animation studio can do much more. Pick Baked loop (the default) or Live simulation. A baked loop works out every particle's path once and plays it as CSS, so a dashboard runs no script for it. Live simulation runs the physics on every dashboard that shows the card, only while the card is on screen. The studio warns that it uses more CPU, especially on wall tablets.
-   Seven new particle flows: Fountain, Explode and fall, Wave, Swirl, Zigzag, Rain (with a Wind angle) and Fireflies, next to Fall, Rise, Drift, Burst, Orbit and Spiral.
-   Eight built-in particle shapes (Circle, Square, Triangle, Star, Heart, Ring, Streak and Spark) next to an icon, an emoji or your own SVG. Mix up to four shapes and give each a weight. The editor shows the share each one gets.
-   Ranges for particle speed, opacity, spin, start delay and lifetime: each particle picks its own value between From and To. A seed makes the loop the same every time, and Shuffle picks new random paths.
-   Physics for particles: gravity in any direction, drag and turbulence. Particles can collide with the floor, the ceiling, the left and right edges and the card's icon or text box, with a bounce setting. Child particles spawn on a collision or at the end of a particle's life.
-   Particle speeds are in % of the card's shorter side per second, so a motion looks the same on wide and narrow cards.
-   A particles animation exports as an animated SVG of its baked loop. Icon and emoji particles export as dots.
-   46 catalogue presets in seven themes: Fire & heat, Cleaning, Christmas, Halloween, Valentine, Home automation, and Light & colour. Among them are snow that settles on the floor, a leak that drips and splashes, soap bubbles that pop and New Year fireworks. They are in the animation studio and in the card editor's Preset list. A pick in the card editor stores the animation in the card as `cat-<id>`, so it plays without Magic Card Utils.
-   Customise a preset in the animation studio shows every preset as a tile with a live mini card. Search also matches the group names. Tiles off screen stay still, and tap presets and heavy scenes play on hover or focus.
-   The icon library grows from 107 to 192 animations: more lights, fire, cleaning, home automation, seasonal icons, and new Animal, Household, Maker and Seasonal categories.
-   A Style switch in the icon picker's Animated icons tab plays library icons Quiet (one part moves, a little and slowly), Living (the full animation) or Glow (a soft outline round the lit part that follows light and dark themes).
-   Item menus on the card, rows, columns, modules, layout children, tabs and row-module columns. Open them with a right-click, a long-press, Shift+F10 or the Menu key, in the tree and on the Studio canvas. New items: Copy YAML, Rename, Hide on dashboard, Copy module, Paste module after, Wrap in layout and Reset to template.
-   Hide on dashboard sets `hidden: true`: the dashboard leaves the item out and the editor shows it dimmed. Rename gives a row, column or module a layer name (`editor_name`) that only the editor shows.
-   A copied module pastes into another card too. Its YAML also goes to the system clipboard.
-   The Studio canvas width follows the dashboard view: Narrow (400 px) for masonry, the card's share of a section for sections, Wide (800 px) for a sidebar view's main column, Panel for a panel view. Narrow, Wide and Panel replace Phone, Tablet and Desktop, and Match view returns to the detected width.
-   The Light module has an optional Icon field with the full icon picker, Animated icons included. Empty keeps the light's own icon.
-   The documentation has a [card gallery](documentation/gallery/README.md) of sixty cards with screenshots and YAML, twenty of them animated.

### Improved
-   Dashboards load about 46% less code. The card editor is now a separate file, `magic-card-editor.js`, that loads when you edit a card or open the animation studio. `magic-card.js` shrinks from 1.25 MB to 0.68 MB.
-   If `magic-card-editor.js` cannot be loaded, Home Assistant opens its YAML editor for the card. If the editor file and `magic-card.js` come from different versions, Home Assistant opens the YAML editor and the browser console asks you to reload the page.
-   The particle physics live in `magic-card-particles.js`, which only cards with such a particle animation load. While it loads, or when it is missing, the card plays a simpler version of the layer.
-   The catalogue presets live in `magic-card-preset-catalogue.js`, which only the card editor and the animation studio load.
-   In the Studio, the inspector's header and tabs stay at the top while its settings scroll. A tab switch starts the settings at the top.
-   The Animate icon button and panel are gone from the Design tab and the Studio. Pick animated icons in the icon picker's Animated icons tab, and split an icon into parts or export an animated SVG in the animation studio. Cards that use an animation made with Animate icon keep playing it.
-   Particle animations made with 2026.10.03 open and play unchanged.

### Fixed
-   Save to template left the card's overrides in place. After a successful save the card now shows In sync. Template animations hidden on the card stay hidden, and a failed save changes nothing.
-   Security camera in the icon library: only the camera head pans now. The wall mount stays still.

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
