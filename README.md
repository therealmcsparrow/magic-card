<p align="center"><img src="https://raw.githubusercontent.com/therealmcsparrow/magic-card/main/images/magic-card-icon.png" width="160" alt="Magic Card logo"></p>

# Magic Card

[![HACS][hacs-badge]][hacs-url]
[![GitHub Version][version-badge]][version-url]
[![GitHub Downloads][github-downloads-badge]][github-downloads]
[![GitHub License][license-badge]][license-url]
[![GitHub Last Commit][last-commit-badge]][last-commit-url]
[![GitHub Issues][issues-badge]][issues-url]

Magic Card is a Home Assistant Lovelace custom card that you build from rows, columns and modules. A visual editor (a pane editor and a full-screen Studio) lets you set up the structure, styling, animations, rings and conditions without writing YAML, and the YAML stays editable at any time.

This README is an overview. The [documentation](documentation/README.md) folder has a page for every part of the editor and every option, plus a full YAML reference with examples and a [card gallery](documentation/gallery/README.md) of a hundred and thirty-four cards with screenshots, sixty-nine of them animated, and twenty-five [complete dashboards](documentation/gallery/dashboards/README.md). Changes are listed in the [changelog](CHANGELOG.md).

## Features

-   Rows, columns and modules, with layout modules (horizontal, vertical, row, tabs, slider) that nest other modules. Their children, tabs and columns are managed in the structure tree, where you can drag a module into or out of any container, at any depth. The row module has the layout presets, column widths and per-column settings of a card row.
-   25 module types for content, controls, layout and advanced use (see [Modules](#modules)).
-   Pane editor with a structure outline, an inspector, Form and YAML modes, and undo and redo.
-   Studio: a full-screen editor with layers, a clickable live canvas and keyboard shortcuts. The canvas is Narrow, Wide or Panel wide, picked from the dashboard view the card sits in. Preview runs the card on the canvas as it runs on the dashboard, with live actions, and Escape returns to editing.
-   Side panels in the editors (card studio, animation studio, SVG editor, shape studio and theme editor) hide with an edge button, and Ctrl+\ hides or shows them all. Each editor remembers its hidden panels on this device. See [Hiding the side panels](#hiding-the-side-panels).
-   Tabs with states: style the active tab, the tab under the pointer and disabled tabs, in the base design and in conditional rules, with every tab setting in each state. Set per-side borders and corners, a different icon when a tab is active, and icon and tab animations per state. Disabled tabs stay visible but cannot be opened. See [Tabs](documentation/modules/layout/tabs.md#tab-states).
-   Item menus: right-click, long-press or Shift+F10 on any row, column, module or tab, in the tree and on the Studio canvas. Their actions are grouped into submenus. Copy its YAML, copy and paste a module (also into another card), replace a module with another type of the same kind, wrap it in a layout, hide it on the dashboard or give it a layer name that only the editor shows.
-   Design panel for every card, row, column and module: spacing, borders, typography, backgrounds, flexbox, grid and more, including entity colours and conditional design rules. The card itself has a border (width, style and colour), margin, opacity and backdrop filter.
-   More than 100 preset animations, several per element, with play conditions, plus 46 themed catalogue presets (see [Catalogue presets](#catalogue-presets)).
-   Animated icons: pick one of 192 ready-made icon animations, or one of your own, in the icon picker's Animated icons tab. Each ready-made one plays in a Quiet, Living or Glow style. The card stores the result itself, so it needs no integration.
-   Theme editor: create and edit Home Assistant themes in the Magic Card Utils Themes tab, with a live preview beside the fields, light and dark modes, 57 presets in three groups (see the [theme examples](documentation/themes/examples/README.md) for a screenshot of each), and a Try on dashboard button that shows a theme in your browser tab until you revert it. Needs the Magic Card Utils integration, version 2026.10.08 or newer. See [Themes](documentation/themes/README.md).
-   Animation studio: build your own keyframe, particle, path and sequence animations with a live preview, and use them on any card (needs the Magic Card Utils integration). Start from a preset in a grid of live tiles, start an icon animation from any icon or from the icon library, animate its parts with presets, export it as an animated SVG, draw shapes, animate a module's name, state and background separately, and drive animations from entity states and values.
-   Particles with physics, built in the animation studio: 13 flows, a weighted mix of shapes, gravity in any direction, drag, turbulence, collisions with the card's edges and its icon or text, and child particles that spawn on a hit or at the end of a particle's life. A particle layer plays as a baked loop, so the dashboard runs no script for it, or as a live simulation.
-   Value rings and animated rings that follow the border radius, starting from any of eight points. A ring on a `timer` entity counts down live.
-   Shapes: squircle, pill, circle, hexagon, octagon, notched corners, ticket, wave edge and blob outlines, with the border and ring drawn along them.
-   Value backgrounds: a tank that fills up to an entity value, or a faint history sparkline behind the content.
-   Flow lines: animated lines with moving dots between two modules (solar to house to grid), driven by an entity value. A thin line ends at the module's icon, picture or dial, so two icons in one row get a line between them. A wide look (tube, cable, neon, zigzag, or a swarm whose shapes travel) ends at the module's edge by default. Set Attach to to choose either. See [Attach to](documentation/flows/options.md#attach-to).
-   Flow looks: dashed, dotted, wave, zigzag, tube, neon and cable lines, with gradient and value colours, end markers, travelling shapes and icons, and five presets (Energy, Water, Data, Heat and Neon). A flow without look keys looks as before. See [Flow options](documentation/flows/options.md#look).
-   Slider looks: thin, pill, segmented and glass tracks, gradient and automatic fills, and a choice of handle. The Big fill style shows the entity's icon and value and updates while you drag. Five presets: Minimal, Material, Neon, Glass and Big fill. A slider without look keys looks as before. See [Slider](documentation/modules/controls/slider.md#look).
-   Card backdrop layers: up to four layers behind the card's content, made of pictures, gradients, patterns and colours. A picture can come from an entity or change with an entity's state. A module can also sit behind the other modules (Behind others) or at a fixed spot above them (On top), with position, opacity, blur and a blend mode. See [Backgrounds](documentation/design/backgrounds.md#card-backdrop) and [Layers](documentation/design/layers.md).
-   Pause motion button: a card can show a button that pauses everything on it that moves. It is hidden by default: set `pause_button` to `auto` (shown while the card has motion) or `always`, and pick the corner with `pause_button_corner`. If anything on a card moves for more than five seconds, set it to `auto` or `always` so viewers can stop the motion. The settings are in the Design tab's Motion group. While you edit, the studio canvas has a Pause preview motion button that freezes the preview without changing the card. See [Pause motion button](documentation/design/layers.md#pause-motion-button).
-   Seasonal scenes: snow, falling leaves, Christmas lights, fireworks, bats and more, picked by date or by hand, or driven by the weather and the sun.
-   Icon effects: liquid fill, device animations, line draw, morphing state icons, duotone and gradient colours, and your own SVG icons.
-   Tap, hold and double-tap actions, including opening and closing pop-ups.
-   Display conditions on cards, rows, columns and modules (state, attribute, time, template).
-   Card design rules: a rule can change the card's ring, shape, value background or seasonal scene while its conditions match.
-   Gradients for backgrounds, rings, icons and text, written as CSS gradients. See [Gradients](documentation/design/gradients.md).
-   Pop-up mode: show a card as a bottom sheet or dialog, opened by a `#hash`, an action or an entity state.
-   Card entity: name the device a card is for once. Modules, rows and columns follow it unless they pick their own entity or `No entity`, and a layout can share its entity with the modules inside. Existing cards are unchanged. See [Card entity](documentation/card-entity/README.md).
-   Templates: save a card as a template and link other cards to it. Linked cards also get the template's own animations, and each card can replace, hide or opt out of them.
-   SVG editor (pre-release, with Magic Card Utils): draw and edit icons on a 24 x 24 grid, with alignment, boolean operations, layers in groups with drag and drop, a dual-tone Accent colour, path tools (outline stroke, offset, simplify, join, split and knife), SVG import and export, and saving to the library. See [SVG editor](documentation/svg-editor/README.md).
-   Shape editor and custom shapes (pre-release): corners with their own type and size, a free outline with the pen, combined shapes, saved shapes, and `shape: custom` in YAML. See [Shape editor](documentation/shape-editor/README.md).
-   Presets and sharing (pre-release): save animations, theme presets, icons and shapes in the Magic Card Utils library, and export them to a versioned YAML or JSON file that anyone can import with safety checks. See [Presets and the library](documentation/presets/README.md).
-   Animation studio layers (pre-release): hide, solo and lock parts in the preview, keyframe layers in one stack, particle layers, and several emitters, each drawn in front of or behind the card. See [Layers](documentation/animation-studio/layers.md).
-   Library images (needs Magic Card Utils): draw pictures in the image editor, trace over a photo or floor plan, open or import SVG files, and show a library image in an image module or as a background behind the content. See [Images](documentation/images/README.md).
-   Languages: English (UK), English (US) and Dutch. Magic Card follows the language in your Home Assistant profile. The Dutch text was drafted with machine help and has not been checked by a professional translator. See [Languages](documentation/languages/README.md). To help translate, see [Translating](documentation/translating/README.md).
-   Built to WCAG 2.2 AA, with keyboard routes for every drag and labelled fields. See [Accessibility](documentation/accessibility/README.md).

## Installation

### HACS (recommended)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=therealmcsparrow&repository=magic-card&category=plugin)

Click the badge to open Magic Card in HACS on your own Home Assistant (HACS must be installed).

The current release is 2026.10.11.

1.  Install [HACS](https://hacs.xyz/) if you do not have it.
2.  Open HACS, then Frontend.
3.  Open the three-dot menu and choose Custom repositories.
4.  Add `https://github.com/therealmcsparrow/magic-card` with the category Lovelace (called Dashboard in newer HACS versions).
5.  Find Magic Card in the list and download it.
6.  If HACS did not add the resource itself, go to Settings, Dashboards, Resources and add `url: /hacsfiles/magic-card/magic-card.js` with `type: module` (JavaScript module).

HACS also downloads the other files of the release into the same folder. Magic Card loads each one from there when a card or editor needs it. The table under [Loading the other files](#loading-the-other-files) lists them.

### Manual

1.  Download every file of the [latest release](https://github.com/therealmcsparrow/magic-card/releases): each `.js` file together with its `.js.br` and `.js.gz` copy. The table under [Loading the other files](#loading-the-other-files) lists the `.js` files.
2.  Copy every file to `config/www/`, including the `.br` and `.gz` copies. Leave none out.
3.  Add the resource `url: /local/magic-card.js` with `type: module` (JavaScript module).

Keep the three files of each name together: `magic-card.js`, `magic-card.js.br` and `magic-card.js.gz`, and the same for every other file. When you update by hand, copy the whole new release and replace or delete all three files of a name together. If an old `.br` or `.gz` file stays behind, Home Assistant can keep sending it in place of the new `.js`.

Only `magic-card.js` is a resource. The other files load from the same folder when something needs them. A dashboard downloads only the files its cards use. Without a file, the feature it belongs to shows a message and the rest of the card still works.

### Loading the other files

| File | Loaded by |
| --- | --- |
| `magic-card-editor.js` | The card editor, when you edit a card, and the animation studio. Dashboards never load it. |
| `magic-card-slider.js` | Cards with a `slider-layout` module (the swipeable carousel). |
| `magic-card-seasonal.js` | Cards with a seasonal scene or a seasonal animation preset. |
| `magic-card-markdown.js` | Cards with a `markdown` module. |
| `magic-card-modules-extra.js` | Cards with a camera, video-bg, weather, forecast, graphs, tabs or custom-card module. |
| `magic-card-controls.js` | Cards with a slider, spinbox, dropdown, light or gauge module. |
| `magic-card-shape-custom.js` | Cards with `shape: custom`. |
| `magic-card-svg-editor.js` | The SVG editor in the Magic Card Utils panel. Dashboards never load it. |
| `magic-card-shape-editor.js` | The shape editor in the Magic Card Utils panel. Dashboards never load it. |
| `magic-card-path-canvas.js` | The drawing canvas of the SVG editor and the shape editor. |
| `magic-card-path-tools.js` | The path tools of the SVG editor, on the first use of one. |
| `magic-card-svg-booleans.js` | The boolean operations (Combine), on the first press of one. |
| `magic-card-transfer.js` | The import and export windows. Dashboards never load it. |
| `magic-card-i18n-labels.js` | The text tables of the animation studio, before it opens. |
| `magic-card-i18n-icons.js` | The icon names of the icon library in the animation studio. |
| `magic-card-anim-runtime.js` | Cards whose animations use icon parts, drawn shapes, card parts, state clips or value bindings. |
| `magic-card-particles.js` | Cards that play a particles animation with the newer particle settings (physics, collisions, child particles, shape mixes). Until it loads, or when it is missing, the card plays a simpler version of the same layer. |
| `magic-card-animation-studio.js` | The animation studio in Magic Card Utils. |
| `magic-card-icon-library.js` | The animation studio, when you start an icon animation. |
| `magic-card-icon-animator.js` | The card editor, when you open the icon picker's Animated icons tab. Dashboards never load it. |
| `magic-card-preset-catalogue.js` | The card editor's Animations list and the animation studio's Customise a preset window. Dashboards never load it. |
| `magic-card-theme-editor.js` | The Themes tab in the Magic Card Utils panel. Dashboards and the card editor never load it. |
| `magic-card-theme-presets.js` | The Themes tab's create dialog, when it opens, for the 57 presets. Dashboards and the card editor never load it. |
| `magic-card-flows.js` | Cards with flow lines. The card shows without the lines until this file has loaded. |
| `magic-card-pause.js` | Cards that show the Pause motion button (`pause_button` set to auto or always). The card keeps room for the button and draws it when this file has loaded. |
| `magic-card-popup.js` | Cards set up as a pop-up. The card stays out of the layout until this file has loaded, then opens if the page address already ends in its `#id`. |
| `magic-card-decor.js` | Cards with a ring, an outline shape or a value background (also a ring animation). A card with a shape waits for this file before it shows, so its content never moves. |
| `magic-card-flow-look.js` | Cards with a flow look (animated lines that run across the card). Loaded when the card config uses one. |
| `magic-card-slider-look.js` | Cards with a slider look (the styled slider track, fill and handle). Loaded when the card config uses one. |
| `magic-card-layers.js` | Cards with a moving card backdrop (pan and zoom, or camera snapshots). Colour, gradient, pattern and picture backdrops draw without it. |
| `magic-card-templates.js` | Cards linked to a template. Other cards never load it. A linked card shows its own settings until it arrives. |
| `magic-card-path-core.js` | The path parser shared by animations, icons, decorations and slider looks. Plain cards never load it; cards that use those features load it alongside their own file. |
| `magic-card-history.js` | Cards with a graphs module or a sparkline value background, alongside their own file. Plain cards never load it. |
| `magic-card-shape-path.js` | Cards with a ring, an outline shape, flow lines, a seasonal scene, a slider look or a custom shape, alongside their own file. Plain cards never load it. |
| `magic-card-status.js` | Cards with `quiet_time`, and any card when its connection to Home Assistant drops. It adds the connection, reconnected and not-updated lines. Without it the card works as before. |
| `magic-card-manifest.js` | Read only when a part fails to load, so the card can tell that its file comes from a different release than its parts. |
| `magic-card-look-editor.js` | The flow and slider look editors in the card editor. Dashboards never load it. |
| `magic-card-layer-editor.js` | The Card backdrop layer editor in the card editor. Dashboards never load it. |

Keep every file of the release in one folder. `magic-card.js` is the only file a dashboard loads at once. Some file names carry a short code after the main name, such as `magic-card-anim.06551dee.js`. The table leaves the code out, so copy each file under its full name.

### Loading

`magic-card.js` must be loaded as a JavaScript module (`type: module`). HACS and the Home Assistant resource editor add it that way. A resource added as `type: js` does not work: the card does not appear. Change the resource type to JavaScript module under Settings, Dashboards, Resources.

### Updating

Update through HACS, then hard refresh the browser (Ctrl+Shift+R, or Cmd+Shift+R on macOS). In the companion app, clear the frontend cache under Settings, Companion app, Troubleshooting. Home Assistant caches resources, so an old version can keep running until you do this.

HACS does not delete the files of an earlier release. After an update you can delete the older files in the folder HACS manages (the folder behind `/hacsfiles/magic-card/`) that the new release no longer uses. Keep every file of the new release. For a manual install, the same applies to the folder `config/www/`.

## The editor

Add the card from the card picker ("Magic Card") or use `type: custom:magic-card` in YAML. A new card starts with one row, one column and a text module.

### Pane editor

The editor in the card dialog has these parts:

-   Form / YAML switch. Form edits through fields, YAML edits the raw config. Both show the same config.
-   Template bar. Shows whether the card is linked to a template (see [Templates](#templates)).
-   Open studio button.
-   Structure outline. The card, its rows, their columns and the modules in each column, including children of layout modules. Click an item to select it. Add row adds a row with one column, Add module adds a module to a column, and Add column is in a row's three-dot menu.

    Layout modules are filled in the outline. Children of horizontal, vertical and slider layouts sit under the module with an Add module row. A tabs module shows one item per tab and a row module one item per column, each with its children and an Add module row, followed by Add tab or Add column. Selecting a tab edits its label and icon; selecting a row-module column gives it General, Conditions and Design tabs like a card column. The General tab of a layout module holds only its own settings.
-   Inspector. Edits the selected item. Its tabs depend on the item:

    | Selected | Tabs |
    | --- | --- |
    | Card | General, Design, Conditions, Flows |
    | Row | General, Actions, Conditions, Design |
    | Column | General, Conditions, Design |
    | Module | General, Actions, Conditions, Design |

    General holds the item's own options, Actions the tap, hold and double-tap actions, Conditions the display conditions (on the card it also holds the conditional appearance rules), and Design the styling, animations and ring. The card's Flows tab holds its flow lines.
-   Undo and redo buttons for every change (up to 50 steps). The keyboard shortcuts only work in the studio. The history is lost when Home Assistant's card dialog closes.

Every item in the outline has a menu. Right-click it, long-press it on a touch screen, press Shift+F10 or the Menu key, or use its three-dot button. The same menu opens on the Studio canvas. Next to the add, duplicate, move, delete and design copy and paste items, it has:

-   Copy YAML: the item's YAML on the clipboard.
-   Rename: a layer name (`editor_name`) for a row, column or module. Only the editor shows it, in the tree, on the canvas and in the inspector. Renaming a tab changes its label, and renaming the card changes its `name`.
-   Hide on dashboard: sets `hidden: true`. The dashboard leaves the item out, and the editor shows it dimmed with an eye-off mark.
-   Copy module, Paste module after and Wrap in layout (Vertical, Horizontal, Row, Tabs or Slider layout) on modules. A copied module also pastes into another card.
-   Reset to template, on a template-linked card.

See [Item menus](documentation/editor/item-menus.md) for the full list per item.

Keyboard in the outline: Up, Down, Home and End move focus between items, and Enter or Space selects the focused item. Right expands a collapsed row, or moves to the first column of an expanded row. Left collapses a row, or moves from a column or module to its parent. Delete removes the focused item (a row's only column and a Tabs module's only tab stay), Alt+Up and Alt+Down move a module, tab or row, Ctrl+D duplicates a module or row, F2 renames any item, and the Menu key (or Shift+F10) opens its menu.

### Studio

Open it with Open studio. It is a full-screen dialog with:

-   Layers on the left: the same outline as the pane editor, with an Add module row under every column. Its edge button hides it so the canvas can take the width. At 900 px wide or less, Layers is an overlay you open with the Layers button, and at 640 px or less the inspector moves below the canvas. See [Hiding the side panels](#hiding-the-side-panels).
-   A live canvas in the middle that renders the real card with your Home Assistant data. Click a module, column, row or the card background to select it. A click on the dotted area around the card also selects the card. Hovering previews what a click selects. Actions do not fire on the canvas, except in Preview (see [Preview](documentation/studio/preview.md)). The selection has one colour per level: grey for the card, orange for rows, green for columns and the theme accent colour for modules.
-   The inspector on the right, with the same tabs as in the pane editor. Its header and tab bar stay at the top while the settings below them scroll, and a tab switch starts the settings at the top.
-   A canvas width switch: Narrow (400 px), Wide (800 px) and Panel (the whole canvas). When the Studio opens it picks the width that matches the dashboard view: masonry, sections (scaled to the card's columns), panel or sidebar. Pick another width to override it, and Match view to go back. See [Canvas width](documentation/studio/device-widths.md).
-   The Form and YAML switch, the template bar, undo and redo buttons, and the Preview button. Preview runs the card as on the dashboard, with live actions. It hides the layers and the inspector, and the Form and YAML switch, the template bar, undo and redo are off until you leave it. See [Preview](documentation/studio/preview.md).

A floating bar next to the selected module moves it up or down, duplicates it, deletes it, or adds a flow line from it: choose Add flow from here, then click the module the flow goes to (Escape cancels). The new flow opens in Card settings, Flows. Click a flow line on the canvas to select it there; the selected flow is highlighted on the canvas. Connecting on the canvas needs a mouse or touch; with a keyboard, use the Flows tab in Card settings.

### Hiding the side panels

The card studio, the animation studio, the SVG editor, the shape studio and the theme editor have side panels. Where a panel sits as a column beside the canvas or the preview, it has an edge button on its inner side. Press the button to hide the panel. The canvas then takes the width the panel gave up, and the button stays at the window edge. Press it again to show the panel with the same selection and scroll position.

-   Ctrl+\ (Cmd+\ on a Mac) hides the side panels of the editor you are working in if any of them is shown. When they are all hidden, it shows again the panels it hid last. On keyboard layouts that type \ with AltGr, such as German and Dutch, the shortcut types the character instead, so use the edge buttons.
-   Each editor remembers its hidden panels on this device. Other editors and other devices are not affected.
-   When an editor opens with a panel hidden, a short hint explains the button and the shortcut, once. Press Got it to close it.
-   Where a panel is an overlay, a sheet, a slide-over or a block above or below the canvas, it has no edge button and keeps its own control.
-   The theme editor shows its Variables pane beside the preview at 1024 px and wider. Below that, Variables and Preview are tabs, and there is no button.

Keyboard shortcuts:

| Shortcut | Action |
| --- | --- |
| Ctrl/Cmd+Z | Undo (not while typing in a field) |
| Ctrl/Cmd+Y or Ctrl/Cmd+Shift+Z | Redo |
| Alt+Up / Alt+Down | Move the selected module, row, tab or row-module column (canvas focused) |
| Delete or Backspace | Delete the selected module, row or column (canvas focused) |
| Ctrl/Cmd+D | Duplicate the selected module or row (canvas focused) |
| Shift+F10 or the Menu key | Open the selection's item menu (canvas focused) |
| F2 | Rename the selection in Layers (canvas focused) |
| Escape | On the canvas: select the parent (module, column, row, card), or close the studio when the card is selected. While adding a flow it cancels. In Preview, it closes a dialog opened from the card first, then leaves Preview; it never closes the studio while Preview is on. |
| Ctrl/Cmd+\ | Hide or show the Layers and the inspector (see [Hiding the side panels](#hiding-the-side-panels)) |
| Arrow keys, Home, End in Layers | Move between items |

The canvas shortcuts work once the canvas has focus; it gets focus when the studio opens and when you click the card. Escape is handled by the innermost thing that uses it: an open menu or picker closes first, then the Layers overlay on a narrow screen. Outside Preview, Escape in Layers, the inspector or the top bar closes the studio.

### Templates

A template is a saved copy of a card that other cards can link to. The template bar offers:

-   Create template from this card saves the card under a name.
-   Load template replaces the card's whole config with the template and links the card to it, after asking for confirmation. Only Home Assistant's per-card keys and other keys the template does not manage (such as `card_mod`) are kept. Undo brings the old config back. The Load template window can also rename and delete templates; delete has no confirmation.
-   A linked card shows the template name and either the number of local overrides or "In sync".
-   Fields you change on a linked card become overrides (recorded in `not_synced` lists) and stay local. Everything else follows the template, so editing the template updates every linked card.
-   The template's own animations (`custom_animations`) play on every linked card. They merge with the card's own documents by id: a card document with the same id replaces the template's on that card, `hidden_animations` leaves single ones out, and `custom_animations` in `not_synced` makes the card use only its own. The card's Design tab lists them with Hide, Show and Use template.
-   Re-sync clears the local overrides and hidden animations and takes the template's values again.
-   Save to template writes the card's content back to the template. After a successful save the card's overrides are cleared and the bar shows "In sync". Template animations hidden on this card stay hidden. If saving fails, nothing changes and the error only appears in the browser console.
-   Add row on a linked card asks whether to update the linked cards as well.
-   Unlink from template detaches the card. The template animations it played become its own.

See [Templates](documentation/editor/templates.md) for the details.

Settings that Home Assistant keeps for a single card (`grid_options`, `layout_options`, `visibility`, `view_layout`) are never part of a template.

Templates are stored by the `magic_card_utils` backend integration. Without it, templates cannot be loaded or saved. Every user can see a linked card; only administrators can create, change or delete templates. A card reads just the templates it uses, and follows changes live. If a template is missing or cannot be loaded, the card shows its own settings with a short notice. Users who are not administrators need Magic Card Utils 2026.10.11-beta.2 or newer, which has the per-template read commands.

### Copy and paste design

Rows, columns and modules have Copy design, Paste design and Merge pasted design in their item menu, and Copy design and Paste design at the top of the Design tab (Paste design there opens a menu with Replace design and Merge into design). The card's own Design tab has no copy or paste. Paste either replaces the target's design or merges into it. The copy is kept in the browser and also placed on the system clipboard as YAML, so you can paste between cards and dialogs.

## Card structure

```
card
 └─ rows[]            layout, gap, padding, design, display
     └─ columns[]     vertical_align, gap, padding, design, display
         └─ modules[] type, entity, design, actions, display, module options
```

-   A row places its columns in a grid. `layout` is a list of relative widths joined by dashes, one number per column (`1`, `1-1`, `1-2`, `2-1`, `1-1-1`, `1-2-1`, `3-1-1`, and so on). A layout that does not match the column count falls back to equal columns. A value that is not numbers and dashes is used as the CSS `grid-template-columns` of the row, for example `120px 1fr`. `gap` and `padding` are CSS lengths.
-   A column stacks its modules vertically. `vertical_align` is `start`, `center`, `end` or `stretch`.
-   A module is one element. Every module has `type`, an optional `entity`, and the shared keys `design`, `actions` and `display`.
-   Layout modules hold more modules: `horizontal` and `vertical` have `modules`, `row` has `columns[].modules`, `tabs` has `tabs[].modules`, and `slider-layout` shows each child in `modules` as a slide. They nest to any depth, and every child supports design, actions and conditions as well. A `row` module works like a card row: `layout`, `column_widths`, `gap` and `padding` on the module, and `id`, `gap`, `padding`, `vertical_align`, `display` and `design` on each column. Older row modules keep working.
-   `id` fields on rows, columns and modules are optional in YAML. The card generates stable ids when they are missing.
-   `hidden: true` on a row, column, module, tab or row-module column leaves it out on the dashboard. `editor_name` gives a row, column or module a layer name that only the editor shows. See [Item menus](documentation/editor/item-menus.md#hide-on-dashboard).

Card-level options:

| Key | Description |
| --- | --- |
| `rows` | The rows (required) |
| `name` | Name shown in the editor |
| `use_page_theme` | `false` to use a card-only theme (default `true`) |
| `theme` | Theme name when `use_page_theme` is `false` |
| `background`, `background_image` | Card background |
| `border_radius`, `padding`, `box_shadow` | Card shape and spacing |
| `border_width`, `border_style`, `border_color` | Card border. Width takes one to four lengths (a bare number is px), style a border style such as `solid` or `dashed`. Unset keys keep the theme's border |
| `opacity` | Card opacity, 0 to 1 |
| `backdrop_filter` | Filter on what is behind the card, for example `blur(8px)`. It only shows through a see-through background |
| `margin` | Space around the card, one to four lengths (a bare number is px) |
| `card_height` | Minimum height of the card |
| `overflow` | `visible`, `hidden` or `auto` |
| `css` | Free CSS for the card's content, applied after the fields above (Custom CSS in the card's Design tab) |
| `hover` | Design values applied while the pointer is over the card's content (see [Design](#design)) |
| `display` | Display conditions for the whole card |
| `conditional_appearance` | Rules that override the card appearance while their conditions match |
| `animations`, `ring` | Card-level animations and ring (see below) |
| `shape`, `shape_options` | Card outline shape (see [Shapes](#shapes)) |
| `value_background` | Fill or sparkline behind the card's rows (see [Value backgrounds](#value-backgrounds)) |
| `popup` | Pop-up mode (see below) |
| `flows` | Animated flow lines between modules (see [Flow lines](#flow-lines)) |
| `template`, `not_synced` | Template link and local overrides |

## Modules

Every module accepts `entity` where it makes sense, plus `design`, `actions` and `display`. Clock, separator, video-bg and custom-card have no Actions tab in the editor, but actions written in YAML still work on them. The camera, light, weather and forecast entity pickers only list entities of their own domain. On/off options that a new module starts with switched on are also on when the key is missing from YAML (for example `bar.show_value`, `graphs.fill`, `gauge.needle`, `clock.show_date`, `slider-layout.pagination`). Set them to `false` to turn them off. The info module shows name and state when both `show_name` and `show_state` are missing. If only one of them is set, the missing one is off, as in older configs. The tables list the options each module reads.

### Content

| `type` | What it does | Key options |
| --- | --- | --- |
| `text` | Static text, a template or an entity value | `text`, `use_template` (Jinja in `text`), `use_entity`, `entity`, `attribute`, `entity_display` (`state`, `name`, `name_state`) |
| `icon` | An icon | `icon`, `size`, `icon_color`, `use_entity_icon`, `use_entity_color`, `entity` |
| `info` | Name, state and unit of an entity | `entity`, `attribute`, `show_name`, `show_state`, `show_unit`, `show_icon`, `icon`, `prefix`, `suffix`, `secondary_info` (an attribute name, or `last-changed` to show when the entity last changed, as Home Assistant's relative time) |
| `image` | An image from a URL, media or an entity | `image`, `entity`, `entity_picture`, `attribute`, `aspect_ratio` (`16:9`, `1.5`, `56.25%`), `fit` (`contain`, `cover`, `fill`, `none`) |
| `markdown` | Markdown with templates | `content`, `entity`, `attribute` |
| `bar` | A progress bar | `entity`, `attribute`, `min`, `max`, `severity` (colour ranges), `decimals`, `bar_height`, `bar_color`, `bar_background`, `show_value`, `direction` (`horizontal`, `vertical`) |
| `graphs` | A history line graph | `entity`, `attribute`, `hours_to_show`, `points_per_hour` (empty draws every recorded change), `line_color`, `line_width`, `fill`, `fill_color`, `show_points`, `show_labels` |
| `camera` | A camera stream or snapshot | `entity`, `camera_view` (`live`, `snapshot`; without the key it shows a snapshot, new modules get `live`), `refresh_interval` (seconds), `show_controls`, `aspect_ratio` |

### Controls

| `type` | What it does | Key options |
| --- | --- | --- |
| `button` | A button that runs its actions | `label`, `icon`, `entity`, `use_entity_icon`, `use_entity_color`, `show_state`, `attribute`, `button_style` (`default`, `outline`, `flat`, `icon-only`). Design keys for the icon and text: `icon_position`, `content_align`, `content_vertical_align`, `icon_size`, `icon_gap`, `icon_color`, `icon_background`, `icon_background_shape`, `label_overflow`, `label_color`, `label_font_family`, `label_font_size`, `label_font_weight`, `label_text_transform`, `state_position`, `state_color`, `state_font_size` (see [Button](documentation/modules/controls/button.md#icon-and-text)) |
| `slider` | Sets a number, a light brightness and similar | `entity`, `attribute`, `min`, `max`, `step`, `show_value`, `slider_color`, `track_color`, `direction` |
| `spinbox` | Plus and minus buttons for a number | `entity`, `attribute`, `min`, `max`, `step` |
| `dropdown` | Select from options | `entity`, `attribute`, `options` (a list of `{label, value}` or plain strings; empty uses the entity's own options) |
| `light` | Light controls | `entity`, `show_brightness`, `show_color_temp`, `show_color`, `show_effect`, `compact`, `icon` |
| `gauge` | A gauge | `entity`, `attribute`, `min`, `max`, `gauge_style` (`half`, `full`, `quarter`), `needle`, `show_name`, `show_unit`, `decimals`, `severity` |

`severity` is a list of colour ranges, for example `[{ from: 0, color: red }, { from: 30, color: green }]`. The range with the highest `from` at or below the value applies.

### Layout

| `type` | What it does | Key options |
| --- | --- | --- |
| `horizontal` | Children side by side | `modules`, `gap`, `align`, `justify` (`start`, `center`, `end`, `space-between`, `space-around`) |
| `vertical` | Children stacked | `modules`, `gap`, `align` (`start`, `center`, `end`, `stretch`) |
| `row` | A grid of columns inside a column, like a card row | `columns` (each with `modules`, and optionally `id`, `gap`, `padding`, `vertical_align`, `display`, `design`), `layout`, `column_widths`, `gap`, `padding` |
| `tabs` | Tabbed content | `tabs` (a list of `{ label, icon, modules }`), `active_tab` (index), `tab_style` (`default`, `pills`, `underline`) |
| `separator` | A divider line | `direction`, `separator_style` (`solid`, `dashed`, `dotted`, `none`), `separator_color`, `separator_width` |
| `slider-layout` | A swipeable carousel, one child per slide | `modules`, `pagination`, `navigation`, `slides_per_view`, `space_between` (px), `loop` (rewinds from the last slide to the first), `autoplay`, `autoplay_delay` (ms) |

### Advanced

| `type` | What it does | Key options |
| --- | --- | --- |
| `clock` | Current time and date | `format_12h` (unset follows your profile), `show_seconds`, `show_date`, `date_format` (`short`, `medium`, `long`, `numeric`, `iso`, or a pattern of tokens such as `YYYY`, `MMMM`, `dddd` and `[text]`) |
| `weather` | Current weather | `entity` (a weather entity), `show_temperature`, `show_condition`, `show_forecast`, `forecast_days`, `animated_icons` (on for new modules; existing cards without the key keep static icons) |
| `forecast` | A forecast list | `entity`, `forecast_type` (`daily`, `hourly`, `twice_daily`), `num_forecasts`, `show_temperature`, `show_precipitation`, `show_wind`, `animated_icons` (on for new modules; existing cards without the key keep static icons) |
| `video-bg` | A video | `url`, `poster`, `fit` (`cover`, `contain`), `autoplay`, `loop`, `muted` (on by default) |
| `custom-card` | Embeds another Lovelace card | `card_type` (for example `custom:button-card`, or a built-in type such as `entities`), `card_config` (that card's config), `name` |

## Design

Every card, row, column and module has a Design tab. Values are stored under `design:` (the card stores a few of them directly, see the card options above). Keys are CSS property names with underscores, for example `border_radius` or `font_size`.

The sections sit in four headed groups in one list. Layout and Style start open, Effects and Advanced start folded, and a group that holds a value opens anyway. Each heading shows how many values the group sets. The card's own Design tab is a shorter form of card fields (see the card options above).

-   Layout
    -   Spacing and box model: margin, padding, width, height, min and max sizes, box sizing.
    -   Positioning and layout: position, offsets, display, visibility, opacity, z-index, overflow, float, cursor, pointer events.
    -   Flexbox and CSS grid properties.
-   Style
    -   Backgrounds: background, colour, image (including media browser items), position, size, repeat, attachment, clip, origin, backdrop filter.
    -   Borders and outlines: border (all sides and per side), width, style, colour, radius, outline, box shadow, plus border length (below).
    -   Typography: font family, size, weight and style, colour, alignment, decoration, transform, shadow, line height, letter and word spacing, white space, word break. The font picker offers system fonts and Google Fonts. A Google Font the card uses (in a design or in custom CSS) is loaded from `fonts.googleapis.com` once per page, in weights 300, 400, 500 and 700 where the family has them (so bold is a real bold face), and the browser needs internet access for it. Loading a font sends a request to Google, a third party, from every device that shows the card. Roboto is never loaded, because Home Assistant already ships it.
    -   Shape (see [Shapes](#shapes)).
    -   Value background (see [Value backgrounds](#value-backgrounds)).
-   Effects
    -   Ring (see [Ring](#ring)).
    -   Transitions and animations: the preset animation list, plain transition and transform properties, filter.
-   Advanced
    -   Lists and tables.
    -   Custom CSS: free CSS applied to that element only (`design.css`).

A search field at the top filters the properties. While you search, every group with a match is open and the others are hidden.

Border length. `border_length` (`%` or `px`; a bare number is `%`) shortens each drawn border side to a line of that length, for accent lines. `border_length_align` (`start`, `center`, `end`) positions the line and `border_length_sides` (`top`, `right`, `bottom`, `left`) draws it on one side only. Without a border, the line is drawn as 2px solid in the border colour.

Per-side values. Margin, padding and border radius edit all four sides (or corners), each with its own unit (`px`, `em`, `rem`, `%`, `vw`, `vh`). A link button keeps the sides equal. Different sides are stored as keys such as `padding_top`, `padding_left` and `border_top_left_radius`, which override the shorthand.

Entity colour. In a colour field (`color`, `background_color`, `border_color`, `outline_color`, animation colours, ring colours) the value `entity` uses the colour Home Assistant gives the module's entity in its current state (a light's own colour when it is on). `entity 20%` is the same colour at 20% opacity. This works for the domains Home Assistant colours by state (light, switch, climate, cover and so on). Sensors have no state colour. `background` is a plain text property, so use `background_color` for an entity colour.

Reset, copy and paste. Each field has a reset button, each group a button that clears its values, and the top of the tab has Copy design and Paste design (replace or merge).

Hover. Pick Hover under "Editing design for" to set values that apply while the pointer is over a module, column or row. They are stored under `design.hover` with the same keys as the design (custom CSS included) and win over the default design and matching rules. Animations, rings, shapes, value backgrounds and border length are not available on hover. The card has its own `hover` key, applied to its content; edit it in the Hover section of the card's Design tab. Add a `transition` to the default design for a smooth change; with reduced motion the change is immediate. On a shaped element the hover border colour recolours the shape's outline and the hover shadow replaces the shape's shadow, as long as the default design has a border or a shadow to start from. With border length, the hover border colour recolours the short lines. Hover values are applied with `!important`, so a hover `transform` or `opacity` also overrides a running animation preset that animates them. A declaration written with `!important` in the default design's custom CSS still wins over hover.

Conditional design rules. In the Design tab, pick Add conditional rule next to "Editing design for". A rule has a name, conditions (the same types as display conditions), a match mode (`every` or `any`) and its own design. While the conditions match, the rule's values override the default design. Rules apply in order and later rules win. On a module, a condition without `entity` uses the module's entity (unless `use_module_entity: false`). A rule without conditions, or with a condition that is not filled in yet (such as a state condition without an entity), changes nothing.

```yaml
design:
  background_color: "#1e1e1e"
  conditional:
    - id: rule-on
      name: Light on
      mode: every
      conditions:
        - id: c1
          type: state
          entity: light.desk
          state: "on"
      design:
        background_color: entity 25%
```

## Animations

Animations are presets that the card renders itself, not CSS keyframes you write. They are listed under `design.animations` (or `animations` on the card).

-   An element can have several animations. Presets that animate different properties combine (for example `float` with `glow-pulse`). Two presets that animate the same property (two rotations, say) do not combine, and the later one wins.
-   Each entry has an `id` and a `preset`, and optional fields. Unset fields use the preset's defaults.

| Field | Meaning |
| --- | --- |
| `preset` | Preset id (list below) |
| `target` | `module` (the whole module, default), `icon` (only the icon; the editor offers it for icon, button, light and weather modules, and it also works on info in YAML) or `label` (only the label of a button). Cards, rows and columns animate themselves. |
| `trigger` | Play condition: `always` (default), `entity_on` (while the entity is active), `state` (while the entity state equals `state`), `tap` (plays once from the pointer position on every tap) |
| `trigger_entity` | Entity read by the play condition. Default: the module's entity. Required on cards, rows and columns, which have none. |
| `state` | State value for `trigger: state` |
| `color` | Colour of glows, particles and coloured filters. Accepts `entity` and `entity 30%`. Falls back to the design colour, then the entity colour, then the theme accent. |
| `duration`, `delay` | CSS times, for example `2s` or `600ms` |
| `easing` | `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`, `spring`, `smooth`, `snap`, or a `cubic-bezier()` or `steps()` function |
| `iterations` | `infinite` or a number |
| `direction` | `normal`, `reverse`, `alternate`, `alternate-reverse` |
| `intensity` | Preset-specific amount: degrees, scale in %, pixels or a particle count |
| `strength` | 0 to 100: how strongly the colour is painted (glow and particle presets), default 100 |

"Entity is on" uses Home Assistant's idea of active, so a cover that is not closed or a person who is home counts as on. A `tap` animation set to repeat forever plays once instead.

Presets, grouped as in the editor:

-   Glow and pulse: `breathe`, `glow-pulse`, `halo-ripple`, `aura`, `heartbeat`
-   Motion: `spin`, `fast-spin`, `sway`, `wobble`, `shake-alert`, `rumble`, `float`, `pendulum`, `orbit`, `coin-spin`, `rotate-3d`, `squash-stretch`, `wiggle`, `shadow-lift`
-   Playful: `bounce`, `jello`, `rubber-band`, `tada`, `swing`, `flip`, `pop`, `head-shake`
-   Light and colour: `shine-sweep`, `blink`, `neon-flicker`, `rainbow-hue`, `glitch`, `fade-pulse`, `holographic-shimmer`, `scanline`, `twinkle`, `spotlight`
-   Rings and sweeps: `ping`, `ripple-rings`, `radar-sweep`, `conic-border-spin`, `breathing-border`
-   Borders: `border-snake`, `neon-border`, `power-flow`, `marching-ants`
-   Weather and device: `flame-flicker`, `steam-rise`, `bubbles`, `snow-fall`, `rain-fall`, `liquid-wave`, `storm-flash`
-   Scenes: `fireflies`, `confetti`, `falling-leaves`, `lightning`, `ocean-waves`, `sun-rays`, `heat-shimmer`, `wind-lines`, `drip`, `equalizer-bars`, `charging-stripes`, `orbit-dots`, `typing-dots`
-   Backgrounds: `aurora`, `lava-lamp`, `plasma-gradient`, `gradient-flow`, `color-cycle-bg`, `starfield`, `meteor-shower`, `bokeh`, `matrix-rain`, `smoke`, `clouds-drift`, `water-ripple`, `fireworks`
-   Seasonal: `winter`, `spring`, `summer`, `autumn`, `christmas`, `new_year`, `valentine`, `easter`, `halloween`, `weather`, `daynight`, `snow`, `rain`, `storm`, `sun`, `clouds`, `fog`, `wind`, `night`, `dusk` (see [Seasonal scenes](#seasonal-scenes))
-   Interaction: `tap-ripple`, `press` (both play when the pointer goes down, also on elements without a tap action)

### Catalogue presets

The Preset list also offers 46 catalogue presets in seven themes: Fire & heat, Cleaning, Christmas, Halloween, Valentine, Home automation, and Light & colour. The Light & colour ones join the built-in Light & colour group, and each other theme has its own group. They include snow that settles on the card's floor, a leak that drips and splashes, soap bubbles that pop and New Year fireworks.

A catalogue preset is a complete animation. When you pick one, the editor copies it into the card's `custom_animations` as `cat-<id>`, and the entry plays it as `preset: custom:cat-<id>`. The card plays its own copy, so it works without Magic Card Utils. The editor removes a copy once no entry plays it. The catalogue is a separate file, `magic-card-preset-catalogue.js`, that the card editor and the animation studio load. Dashboards never load it. See [Catalogue presets](documentation/design/animations.md#catalogue-presets).

### My animations

With the [Magic Card Utils](https://github.com/therealmcsparrow/magic-card-utils) integration installed, you can build your own animations in its animation studio (the sidebar panel, Animations tab). They are stored in Home Assistant and shared by every card. Each one is keyframes, particles, a path or a sequence.

In the card editor they appear at the top of the Preset list, under My animations. The group only shows when the integration answers and has at least one animation. A card refers to one as `custom:<id>`:

```yaml
design:
  animations:
    - id: a1
      preset: custom:doorbell-wiggle
      trigger: entity_on
```

-   Leave the timing fields empty to use the animation's own values. Anything you set (`duration`, `delay`, `easing`, `iterations`, `direction`, `color`, `strength`, `target`, `trigger`) overrides it, as with presets. `intensity` is the amplitude in %, where 100 plays it as drawn.
-   `target` is optional. Without it the animation moves what it was built for: the element or the module's icon.
-   `entity` is for animations with state clips or value bindings: the entity they read instead of the module's (the editor's Entity for states and values).
-   The icon picker of the Icon, Info, Button and Light modules has an Animated icons tab with your saved icon animations and the 192 built-in ones. A click sets the icon and its animation in one step.
-   When you edit an animation in the studio, every card that uses it updates live.

Sharing a card. The YAML only holds the reference. To share a card with someone who does not have your animations, open the YAML view and use Copy YAML with Embed my animations on. This adds a `custom_animations:` list with the documents the card uses, including the steps of sequences. A card plays its embedded copy whenever the library lacks that id, for example on another Home Assistant or without the integration. Without the library or an embedded copy, the reference plays nothing and the editor says why.

### Icon animations

Icons are animated through the icon picker's Animated icons tab and the animation studio. The Design tab no longer has an Animate icon button. Cards that use an animation made with it keep playing it.

-   A pick from the icon library adds an entry `preset: custom:quick-icon-…` with `target: icon` to the module and stores the animation in the card's `custom_animations`, so it plays without Magic Card Utils.
-   Above the icon library tiles, three animated swatches set the Style: Quiet (one part moves, a little and slowly), Living (the full animation, the default) or Glow (the full animation with a soft outline round the lit part). The tile you click is stored in that Style.
-   To split a module's icon into parts, give each part a preset or export an animated SVG file, use the animation studio in Magic Card Utils. Saved icon animations show in the Animated icons tab under My animations.
-   An animation of the module's own icon follows that icon: give the module another icon in the editor and, about a second later, the animation moves onto the new icon's parts. A library animation is removed instead.

The Light module's Icon field is optional: empty keeps the light's own icon. The Animated icons tab is a separate file, `magic-card-icon-animator.js`, loaded only when you open it. See [Icon animations in cards](documentation/design/quick-icon-animator.md).

## Animation studio

The animation studio is a full-screen editor for your own animations. It runs in the sidebar panel of the [Magic Card Utils](https://github.com/therealmcsparrow/magic-card-utils) integration (2026.10.04 or newer), on the Animations tab, and loads `magic-card-animation-studio.js` from the same folder as your `magic-card.js` resource. Every release attaches that file.

-   Four kinds: keyframes on a timeline with an easing curve editor, particles, motion along a path you draw on the preview, and sequences of animations one after another.
-   Particles: a mix of up to four shapes with weights (circle, square, triangle, star, heart, ring, streak, spark, an icon, an emoji or your own SVG), 13 flows, ranges for speed, size, opacity, spin, start delay and lifetime, and a seed with a Shuffle button for new random paths. Physics adds gravity in any direction, drag and turbulence, collisions with the card's edges or its icon or text, and child particles that spawn on a hit or at the end of a particle's life.
-   Baked loop or Live simulation: a baked loop works out every path once in the studio and plays it as CSS, so dashboards run no script for it. Live simulation runs the physics on every dashboard that shows the card and uses more CPU. It runs only while the card is on screen.
-   A layout that fits the window: Layers on the left, the stage and the timeline in the middle with a splitter between them, and an inspector on the right that shows what you selected. Layers and the inspector each hide with an edge button, so the stage can take the full width. It works on a tablet.
-   A timeline with a group of lanes per target, zoom up to 1000%, snapping, multi-select and group drag, easing per property, and copy and paste between lanes and targets.
-   Icon parts: split an icon into its shapes, group and merge them, set pivots, and animate each part, with draw-on and motion paths. A part preset's pivot shows on the stage and in the inspector, where you can move it or reset it to the part's own.
-   Icon animations: New animation, then Icon animation…, splits any icon for you, or starts from one of 192 animations in the icon library (search, a domain filter and live thumbnails). Part presets animate a part, group or shape with one click, with parameters for duration share, delay, intensity and direction.
-   Animated SVG: Save as icon also exports the animation as a looping SVG file, with CSS keyframes and a SMIL fallback. A particles animation exports its baked loop from the Animated SVG button under the particle preview. Icon and emoji particles become dots in the file.
-   Drawing: pen, line, rectangle, ellipse and freehand tools with snapping. Shapes animate like parts. Save the result as an SVG icon for any card, or import an SVG file.
-   Card parts: move a module's name, state, icon and background separately.
-   States and values: play something else per entity state, with a cut, crossfade or finish-cycle transition, and tie rotation, position, scale, opacity, draw-on, colour or speed to an entity value. A capsule on the stage previews states and values.
-   A live preview on a real Magic Card: icon, button, text or card tile, light or dark card, speed, play, pause and scrub, and a reduced-motion preview.
-   A library with search, duplicate, rename, delete and YAML export and import. Customise a preset shows every built-in and catalogue preset as a live mini card, grouped by theme, with a search that also matches the group names. A click turns the preset into your own animation.
-   Undo and redo, a warning before you leave unsaved changes, and keyboard shortcuts.

Cards load the extra code for icon parts, shapes, card parts, clips and bindings from `magic-card-anim-runtime.js`, and the particle physics from `magic-card-particles.js`, only when an animation on the page uses them. Keep those files next to `magic-card.js` (see [Installation](#installation)). The resource must be a JavaScript module (see [Loading](#loading)).

The [animation studio documentation](documentation/animation-studio/README.md) covers every part, including the [YAML format](documentation/animation-studio/yaml.md) of an animation.

## Ring

A ring is an SVG outline drawn along the element's border. It follows the rendered border radius, so it fits a rounded card or a pill. Set it under `design.ring` for a module, row or column, or `ring` on the card. In the editor it is the Ring section, under Effects in the Design tab.

`mode` is `value`, `animated`, or not set (off).

Value mode fills the outline up to `(value - min) / (max - min)` of an entity.

| Key | Meaning |
| --- | --- |
| `entity`, `attribute` | The value. Default: the module's entity. Required on cards, rows and columns. |
| `min`, `max` | Range, default 0 to 100. Each is a number or `{ entity, attribute }`, which reads that entity's numeric state or attribute and falls back to the default when it cannot. |
| `timer_fill` | On a `timer` entity: `remaining` (default, the ring empties as time runs out) or `elapsed` (it fills up) |
| `thresholds` | Colour by value, for example `[{ from: 20, color: orange }]`. The highest `from` at or below the value wins. On a timer they read the remaining percentage. |
| `transition` | Fill transition time, default `1s` |

A value ring on a `timer` entity follows the timer: the time left against its duration, moving every second while it runs and is on screen, still while paused, empty while idle. `min`, `max` and `attribute` do not apply to it. The Info module shows a timer's time left as a live countdown, and the Text module does with `entity_display: remaining`.

Animated mode draws a moving stroke.

| Key | Meaning |
| --- | --- |
| `animation` | `snake` (default), `pulse`, `full`, `dots` (chase dots), `dashes` (marching ants) |
| `length` | Snake length in % of the outline (default 25) |
| `speed` | Time of one lap or pulse, default `3s` |

Shared options:

| Key | Meaning |
| --- | --- |
| `width` | Stroke width in px (default 3) |
| `color`, `track_color` | Stroke colour and background track colour. Both accept `entity`. |
| `track_opacity` | 0 to 100, opacity of the track |
| `start` | `top`, `top-left`, `right`, `bottom`, `left` |
| `direction` | `cw` or `ccw` |
| `linecap` | `round` or `butt` |
| `glow` | Glow blur in px (0 is off) |
| `position` | `inside`, `center`, `outside`. On the card itself `outside` is drawn inside, because the card clips its edge. |
| `trigger`, `trigger_entity`, `state` | Show the ring only while a condition holds: `always`, `entity_on` or `state` |

## Shapes

A shape replaces the rectangle of a module, row, column or the card with another outline. Set `design.shape` (on the card: `shape`) and, if you like, `design.shape_options`. In the editor it is the Shape section, under Style in the Design tab: pick a tile, then adjust the options of that shape.

| `shape` | Outline | Options |
| --- | --- | --- |
| `squircle` | Rounded rectangle with smooth corners | `corner`, `smoothing` |
| `pill` | Fully rounded ends | none |
| `circle` | Circle or ellipse that fills the box | none |
| `hexagon` | Points at the ends of the long side | `corner` (how far the slanted sides reach in) |
| `octagon` | Corners cut like a regular octagon | `corner` |
| `notch` | Small cut corners (16px by default) | `corner` |
| `ticket` | Half-circle cutouts on the left and right | `corner` |
| `wave` | One or all edges as a wave | `edge`, `amplitude`, `waves`, `animate` |
| `blob` | An irregular round shape | `seed`, `wobble`, `animate` |
| `none` | No shape (also the default) | none |

| Option | Meaning |
| --- | --- |
| `corner` | Corner size, cut or cutout size. A px number, `16px`, or `%` of the shorter side. |
| `smoothing` | Squircle corners, 0 to 1: 1 is rounder, 0 is squarer (default 0.6) |
| `edge` | Wave edge: `top`, `right`, `bottom` (default), `left` or `all` |
| `amplitude` | Wave height in px or % (default 8px) |
| `waves` | Number of waves along the edge (default 3) |
| `seed` | Blob: any number gives its own outline (default 7) |
| `wobble` | Blob irregularity, 0 to 1 (default 0.25) |
| `animate` | `true`: the wave flows or the blob morphs slowly. Paused off-screen and with reduced motion. |

Things to know:

-   A shape wins over `border_radius`.
-   The border (width, style, colour), border length and the ring follow the shape. A ring on a shaped element is always drawn inside.
-   Content gets extra padding so text stays clear of cut corners and waves.
-   `box_shadow` becomes a drop shadow along the shape. Only the first shadow is used.
-   The shape clips anything that pops out of a module, such as a dropdown list or a tooltip.
-   A pop-up card keeps a rectangular surface while it is open.
-   Known limitation: a shaped module with a `box_shadow` sits in a wrapper that draws the shadow, so a `%` width or a grid placement applies inside that wrapper.

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: info
            entity: sensor.living_room_temperature
            design:
              background_color: "#1e88e533"
              border_width: 2px
              border_color: "#1e88e5"
              shape: notch
              shape_options:
                corner: 14px
```

## Value backgrounds

A value background draws the value of an entity behind an element's content: a tank that fills up to the value, or a faint sparkline of its history. Set it under `design.value_background` for a module, row or column, or `value_background` on the card. In the editor it is the Value background section, under Style in the Design tab: pick Off, Fill or Sparkline.

| Key | Meaning |
| --- | --- |
| `type` | `fill` or `sparkline`. Without a type nothing is drawn. `none` turns off a value background that a template or the default design sets. |
| `entity`, `attribute` | The value. Default: the module's entity. Required on cards, rows and columns. |
| `min`, `max` | Fill range, default 0 to 100. A sparkline uses the range of its data unless you set them. |
| `color` | Fill or line colour. Default: the theme accent. Accepts `entity` and `entity 30%` (the state colour of the value's entity). |
| `opacity` | Fill opacity (default `25%`), or the opacity of the area under a sparkline at its bottom edge (default `18%`). Also `0.25` or `25`. |
| `direction` | Fill only: `up` (default), `down`, `left` or `right` |
| `wave` | Fill only: `false` turns off the moving wave on the surface |
| `hours` | Sparkline only: history window, default 24, at most 168 |
| `line_width` | Sparkline only: line width in px, default 1.5 |
| `area` | Sparkline only: `false` draws the line without the area under it |
| `smoothing` | Sparkline only: `false` draws straight segments |

An unavailable or non-numeric value shows an empty tank with a faint hatch. A value at the minimum shows an empty tank with a thin line along its floor. A sparkline sits in the lower part of the element, about 65% of its height, and its area fades out towards the top. When the live value is unavailable, the sparkline holds the last recorded value as a dashed line. A sparkline without history, or with history that fails to load, draws nothing. The sparkline line stays faint (45%) so text over it stays readable. You can change that with the `--mc-value-bg-line-opacity` CSS variable. Sparklines share the history fetches of graphs modules for the same entity and window, and only fetch while they are on screen. The wave stops for reduced motion and while the element is off-screen.

An open pop-up does not show the card's own value background. Like a shape, a value background can make a dropdown list or tooltip of that module render under its neighbours.

The background follows the element's border radius or shape:

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: info
            entity: sensor.water_tank
            design:
              shape: squircle
              value_background:
                type: fill
                color: "#29b6f6"
                opacity: 35%
          - type: info
            entity: sensor.living_room_temperature
            design:
              value_background:
                type: sparkline
                hours: 12
                min: 15
                max: 25
```

## Seasonal scenes

A seasonal scene fills a card with snow, blossom, falling leaves, fireworks, bats and the like. `seasonal: auto` picks the scene from the date, so a card looks festive at the right time of year without further setup. In the editor it is the Seasonal group of the card's Design tab.

```yaml
type: custom:magic-card
seasonal: auto
rows:
  - columns:
      - modules:
          - type: info
            entity: sensor.living_room_temperature
```

With `auto`, a holiday wins over the season. Outside the holidays the card shows the meteorological season: winter is December to February, spring March to May, and so on. Set `hemisphere: south` to flip the seasons.

| Scene | Particles | Border decorations | Shown by auto |
| --- | --- | --- | --- |
| `winter` | Snowflakes | Frost in the corners, icicles along the top | December to February |
| `spring` | Blossom petals | A flowering vine round the bottom-left corner | March to May |
| `summer` | Sun glow, butterflies | | June to August |
| `autumn` | Falling leaves, a little drizzle | | September to November |
| `christmas` | Snow and twinkling stars | Christmas lights along the border | 1 to 26 December |
| `new_year` | Fireworks and confetti | | 31 December and 1 January |
| `valentine` | Rising hearts | | 14 February |
| `easter` | Petals and bobbing eggs | | Palm Sunday to Easter Monday |
| `halloween` | Bats and low fog | A cobweb in the top-right corner, a pumpkin at the bottom | 24 to 31 October |
| `weather` | Follows `weather_entity`: snow, rain, a thunderstorm, sun, clouds, fog or wind | | Never |
| `daynight` | Follows `sun.sun`: stars and fireflies at night, a warm glow at dusk and dawn, nothing by day | | Never |

| Key | Meaning |
| --- | --- |
| `scene` | A scene from the table, `auto` (default) or `none`. `seasonal: christmas` is short for `seasonal: { scene: christmas }`, and `seasonal: true` for auto. |
| `layer` | `back` (default) draws the scene behind the content. `front` draws it over the content, dimmed. Taps still reach the content. |
| `intensity` | How many particles, `50%` by default. `100%` is 24, the most a scene draws. A plain number from 0 to 1 is a fraction, so `0.7` means 70%. Larger numbers are percentages (`70` is 70%), and `1%` with the percent sign stays 1%. |
| `decorations` | `false` turns off the border decorations |
| `entity` | Off switch: while this entity is `off` the scene is hidden. Use one `input_boolean` on all your cards to turn the decorations off everywhere at once. |
| `weather_entity` | The `weather` entity for the `weather` scene |
| `hemisphere` | `north` (default) or `south`, in any case |
| `combine` | More scenes drawn together with the main one, for example `[daynight]` for stars at night during winter |
| `calendar` | The holiday dates auto uses, as `MM-DD..MM-DD` (inclusive). A range can run over the new year, like `12-31..01-01`. `easter: auto` (default) works out Palm Sunday to Easter Monday for each year. `off` skips a holiday. An invalid range is ignored and the default dates apply. |

```yaml
type: custom:magic-card
seasonal:
  scene: auto
  intensity: 70%
  entity: input_boolean.festive
  hemisphere: north
  combine: [daynight]
  calendar:
    christmas: 12-06..12-26
    valentine: "off"
rows:
  - columns:
      - modules:
          - type: text
            text: Living room
          - type: info
            entity: sensor.living_room_temperature
```

Border decorations follow the card's border radius or shape. The content moves in so the decorations never cover it: Christmas lights keep 20 px free on every side, icicles 20 px at the top, the pumpkin 30 px at the bottom and the vine about 20 px at the bottom and left. Frost and the cobweb are faint corner backdrops that stay behind the content. Small elements drop the decorations that don't fit. Lights twinkle; the other decorations are still.

Every scene is also an animation preset in the Seasonal group, so a single module, row or column can have one (`animations: - preset: christmas`). `intensity` is the density in percent, `strength` the opacity and `decorations: false` turns off the border decorations. The `weather` preset follows the module's weather entity, or the weather entity picked as `trigger_entity`. The `daynight` preset follows `sun.sun`. The other presets are fixed scenes that don't change with the date.

```yaml
type: custom:magic-card
rows:
  - layout: 1-1
    columns:
      - modules:
          - type: weather
            entity: weather.home
            design:
              animations:
                - preset: weather
      - modules:
          - type: button
            entity: light.christmas_tree
            design:
              animations:
                - preset: christmas
                  intensity: 40
```

A card draws at most 60 seasonal particles in total. Its own scene gets its share first. When the seasonal presets on its modules, rows and columns ask for more than what is left, each of them is scaled down by the same factor. Thunderstorm flashes don't stack: a layer inside an element that already flashes skips its own flash, and at most five layers per card flash, which keeps a card under three flashes a second.

Auto goes by the date in the time zone your Home Assistant profile shows times in. With the profile set to the server's time zone, the scene changes at the server's midnight.

Particles pause while a card is off-screen. With reduced motion a scene is a still picture. A card without `seasonal` and without seasonal presets is not affected at all. While you edit a card, the Seasonal group has a Preview date: the card in the editor shows auto on that day. The preview date is never saved.

## Flow lines

A flow is an animated line between two modules of the same card, like an energy flow from solar to the house and the grid. Dots run along the line. With an entity, the speed and width follow its value, the line idles at or below `min`, and a negative value runs the dots the other way (grid import and export). Lines follow the layout when the card resizes, and cards without `flows` are unchanged.

Flows connect modules by their `id`, so give the modules you connect an `id`. The editor does this for you: in Card settings, open the Flows tab, choose Add flow and pick the From and To modules (every module is listed, modules inside layout modules too), or in the studio select a module and choose Add flow from here in its floating bar. A module without an id gets one when you pick it. On a card linked to a template, a module that comes from the template without an id can't be picked: give it an id in the template first. Deleting a module removes its flows in the same undoable step.

```yaml
type: custom:magic-card
rows:
  - layout: 1-1-1
    columns:
      - modules:
          - id: solar
            type: info
            entity: sensor.solar_power
            show_icon: true
            icon: mdi:solar-power
      - modules:
          - id: house
            type: info
            entity: sensor.house_power
            show_icon: true
            icon: mdi:home
      - modules:
          - id: grid
            type: info
            entity: sensor.grid_power
            show_icon: true
            icon: mdi:transmission-tower
flows:
  - id: solar-house
    from: solar
    to: house
    entity: sensor.solar_power
    max: 5000
    color: "#f9a825"
    label: value
  - id: grid-house
    from: grid
    to: house
    entity: sensor.grid_power   # negative = export: the dots run from house to grid
    max: 5000
    route: straight
```

`from`, `to` and usually `entity` are enough; everything else has a default.

| Key | Meaning |
| --- | --- |
| `id` | Stable id of the flow (the editor generates one) |
| `from`, `to` | Module ids of the start and end module. A flow to an unknown or hidden module is not drawn. |
| `from_side`, `to_side` | `auto` (default: the facing sides), `top`, `right`, `bottom`, `left` |
| `from_anchor`, `to_anchor` | `icon` (the module's icon, picture or dial, or its box when it has none) or `box` (the module's outer box). Unset: `box` for a wide look (tube, cable, neon, zigzag, or a swarm whose shapes travel: `spacing_mode: random`, `size_variation` above 0, or a known `shape_alternate`, not with `motion: pulse` or with `dots: 0` and no spacing), otherwise `icon`. An explicit value always wins. Thin flows without these keys change look: set `box` to keep the old look. |
| `route` | `curve` (default), `straight`, `elbow` (right angles with rounded corners) |
| `entity`, `attribute` | Value source. Without an entity the line always flows at `speed`. |
| `min` | At or below this value (as a magnitude) the line idles: no dots, `idle_color`. Default 0. |
| `max` | Value at which speed and width reach their maximum (default 1000) |
| `reverse_negative` | A negative value runs the dots from `to` to `from` (default `true`) |
| `color` | Line and dot colour (default the theme's primary colour). `entity` uses the state colour of the flow's entity, or of the From module's entity when the flow has none; `entity 40%` is that colour at 40% opacity. |
| `idle_color` | Line colour while idle. `30%` is `color` at 30% opacity. Default: the secondary text colour at 50%. |
| `width`, `scale_width` | Line width in px (default 3); with `scale_width` (default `true`) it grows to twice the width at `max` |
| `dots`, `dot_size` | Dots on the line at once, 0 to 8 (default 3; 0 = moving dashes), and their size in px (default 6) |
| `speed`, `min_speed` | Seconds for a dot to travel the line at `max` (default 2) and just above `min` (default 8) |
| `glow` | Glow around the dots in px (default 0) |
| `label`, `label_template` | `none` (default), `value` (the formatted entity value) or `template` (a Jinja template) at the middle of the line |
| `label_position` | `auto` (default: on the line when it has room, else beside it), `line`, `side` or `hidden` |
| `show_when` | `always` (default) or `flowing` (hide the line while idle) |
| `layer` | `back` (default: behind module content) or `front` (over it; never blocks taps) |

A back-layer line also runs under a layout module's own background (a Horizontal or Vertical stack with a background) and under a Slider module. Use `layer: front` for a flow that has to show over those.

With reduced motion turned on in the system, a flow is a static line with an arrowhead in the flow direction.

## Icon effects

The Icon, Button, Info, Light, Tabs, Weather and Forecast modules can draw their icon with effects. Set them under `icon_fx` on the module. Without `icon_fx` the icon renders exactly as before.

In the editor they are the Icon effects group of the General tab:

- Icon, Button, Info and Light: under the icon field (Info only while Show icon is on). With an entity, Icon when on and Icon when off sit next to it.
- Tabs: the group shows once a tab has an icon. The effects apply to every tab icon.
- Weather and Forecast: the group shows while Animated icons is off. Animated icons replace the effects; any `icon_fx` you set is kept and comes back when you turn Animated icons off.

| Key | Meaning |
| --- | --- |
| `fill` | Liquid fill by a value. `entity` and `attribute` (default: the module's entity), `min` and `max` (default 0 to 100), `color`, `empty_color` (opacity of the empty icon such as `25%`, or a colour), `wave` (default `true`), `direction` (`up`, `down`, `left`, `right`). `fill: {}` uses all defaults. |
| `device` | `auto` picks an animation from the entity: a fan spins faster at a higher speed, a light glows in its colour, a thermostat shows a flame while heating and snow while cooling, a washer drum turns, a cover swings while it moves, a playing media player shows an equalizer, and an alarm pulses. Or force one of `spin`, `glow`, `flame`, `drum`, `swing`, `pulse`, `snow`, `shake`, `eq`; a forced animation pauses while the entity is off or unavailable. |
| `draw` | Line draw: `load`, `change` (when the icon changes or the entity turns on or off) or `loop`. `draw_duration` defaults to `1.2s`. |
| `morph` | `true` morphs between `icon_on` and `icon_off` when the entity turns on or off. Icons with a different number of parts cross-fade. |
| `colors` | `style`: `solid` (default), `duotone`, `gradient` or `value`. `primary`, `secondary` (a colour or a share of the primary such as `40%`), `gradient` (a list of colours) and `angle`. `value` picks the colour along `gradient` by the fill's value (its entity, `min` and `max`); without a fill it uses the module's entity on a 0 to 100 scale. Colours accept `entity`. |

`icon_on` and `icon_off` set the icon while the entity is on or off, with or without a morph.

Your own SVG: set `icon: svg` and paste the markup under `svg`, or use Custom SVG in the editor (paste or upload, up to 32 KB). Scripts, event handlers, `foreignObject` and external references are removed, and the editor refuses an SVG that contains them. `<use>` and `<image>` aren't supported: they are removed too, and the editor refuses them. Styles (`<style>` and `style="…"`) are removed, so classes styled in a `<style>` block (as Illustrator exports them) lose their colours; the editor accepts the SVG with a warning. Use `fill` attributes instead. Parts with `fill="currentColor"` take the icon colour, parts with `class="mc-accent"` take `icon_fx.colors.secondary`. All effects work on the SVG's shapes.

Icons from third-party packs work when the pack provides the icon shape. Multi-colour logos and icons that can't be loaded show as they are, without effects; the editor says so. With reduced motion turned on, nothing moves, but the fill level and colours still show.

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: icon
            entity: sensor.phone_battery
            icon: mdi:battery
            size: 48px
            icon_fx:
              fill:
                min: 0
                max: 100
              colors:
                style: value
                gradient: ['#f44336', '#ffc107', '#4caf50']
          - type: icon
            entity: fan.bedroom
            icon: mdi:fan
            size: 48px
            icon_fx:
              device: auto
          - type: button
            entity: lock.front_door
            icon_on: mdi:lock
            icon_off: mdi:lock-open-variant
            icon_fx:
              morph: true
```

## Actions

The Actions tab of a module sets `tap_action`, `hold_action` and `double_tap_action` under `actions`. A module without an action stays inert, and so does an action missing what it needs (a `navigate` without a path, a `toggle` without any entity, and so on). If a double-tap action is set, a single tap waits briefly for a possible second tap. With the keyboard, Enter or Space taps, Shift+Enter holds and Ctrl+Enter double-taps.

| `action` | Fields | Result |
| --- | --- | --- |
| `none` | | Nothing |
| `toggle` | `entity` | Toggles the entity (the module entity by default) |
| `more-info` | `entity` | Opens the more-info dialog |
| `navigate` | `navigation_path` | Goes to a dashboard path, for example `/lovelace/lights`, or to `#kitchen` to open a pop-up (quote it in YAML: `"#kitchen"`, or it is read as a comment) |
| `perform-action` | `service` (`domain.service`), `data` (including `entity_id`) | Calls a Home Assistant action. `perform_action` and `target` are not read, so put the entity in `data`. Confirmation is not supported. |
| `url` | `url_path` | Opens an `http` or `https` URL in a new tab |
| `assist` | | Opens Assist |
| `popup` | `hash` | Opens the Magic Card pop-up with that ID |
| `close-popup` | | Closes the open pop-up |
| `fire-dom-event` | `data` | Fires an `ll-custom` event (YAML only) |

`toggle` and `more-info` use the action's own `entity` when it is set. Without one they fall back to the module's entity, unless `use_module_entity: false` is set. `haptic` (`success`, `warning`, `failure`, `light`, `medium`, `heavy`, `selection`) sends a haptic event, used by the companion app. Rows have the same Actions tab (stored under the row's `actions`). A row action runs when the row is tapped outside a module that has its own action or control, so module actions win. A row has no entity of its own, so `toggle` and `more-info` need the action's `entity`. Screen readers still read the row's content as usual. The row only takes keyboard focus (Enter or Space taps) when nothing inside it is interactive; otherwise use the modules' own controls. Columns have no actions.

## Display conditions

Conditions show or hide a card, row, column or module. They live under `display`:

```yaml
display:
  mode: every        # every = all must match (default), any = one is enough
  conditions:
    - id: c1
      type: state
      entity: person.me
      state: home
```

| `type` | Fields | Met when |
| --- | --- | --- |
| `state` | `entity`, then `state` or `state_not`, or `above` and `below` for numbers | The entity state matches. A missing entity does not match. `above` and `below` are ignored when `state` or `state_not` is set. |
| `attribute` | `entity`, `attribute`, then `state`, `state_not`, `above`, `below` | The attribute value matches |
| `time` | `after`, `before` (`HH:MM`) | The current time is at or after `after` and before `before`, in the browser's local time. A range cannot cross midnight (`22:00` to `06:00` never matches). |
| `template` | `template` (Jinja) | The template renders true, yes, on, enable or a non-zero number |

Template conditions use Home Assistant's template engine, for example `{{ is_state('sun.sun', 'below_horizon') and states('sensor.lux') | float < 50 }}`. A condition with no entity (or an empty template) counts as met. In the editor canvas, hidden items stay visible and are marked as hidden.

The same condition types drive conditional design rules and conditional card appearance. Animation and ring play conditions use the simpler options always, entity on and state equals.

## Pop-ups

Any Magic Card can be a pop-up. It then takes no room on the dashboard and opens over it.

1.  In the card's General tab, turn on Show as pop-up and set an ID (letters, digits, `-` and `_`, no spaces, case-sensitive).
2.  Open it from any button with a Navigate action to `#<id>`, or with the Open pop-up action and the same ID.

```yaml
popup:
  enabled: true
  hash: kitchen
  title: Kitchen
  style: sheet
```

| Key | Meaning |
| --- | --- |
| `enabled` | Turns pop-up mode on |
| `hash` | The pop-up ID. The pop-up is open while the page URL ends in `#<hash>`. |
| `title` | Header text and accessible name |
| `style` | `sheet` (bottom sheet, default) or `dialog` (centred) |
| `width` | Maximum width, default `600px` |
| `max_height` | Maximum height, default `90vh` |
| `backdrop_blur` | Backdrop blur, default `8px` |
| `backdrop_opacity` | Backdrop darkness from 0 to 1, default `0.4` |
| `show_close` | Close button in the header, default `true` |
| `auto_close` | Close after this many seconds without interaction (0 or unset: off) |
| `open_on` | `{ entity, state }`. Opens when the entity changes to that state (any change when `state` is empty). |
| `close_on` | `{ entity, state }`. Closes in the same way. |

Behaviour:

-   The card's `border_radius` shapes the pop-up surface. The pop-up content is the card's rows, so design, animations and conditions work as usual.
-   It closes with the close button, a click on the backdrop, Escape, a downward swipe on the sheet header, the browser back button, the auto close timer, a `close_on` trigger, or a Close pop-up action (also from a button inside the pop-up).
-   Only one Magic Card pop-up is open at a time. Loading a page whose URL ends in `#<id>` opens it right away.
-   Triggers react to a change of state. The first state received after loading does not open it, and attribute-only updates are ignored.
-   In the editors the card stays visible inline. The pop-up settings have a Preview pop-up button that opens the real pop-up, and a button that copies the navigation path.

## YAML examples

A simple card with a row and modules:

```yaml
type: custom:magic-card
name: Living room
rows:
  - layout: "1-1"
    gap: 12px
    columns:
      - vertical_align: center
        modules:
          - type: icon
            icon: mdi:sofa
            size: 32px
          - type: text
            text: Living room
      - modules:
          - type: info
            entity: sensor.living_room_temperature
            show_name: false
            show_state: true
            show_unit: true
          - type: bar
            entity: sensor.living_room_humidity
            min: 0
            max: 100
```

A button with an entity colour background and an animation:

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: button
            entity: light.desk
            label: Desk lamp
            use_entity_icon: true
            use_entity_color: true
            actions:
              tap_action:
                action: toggle
              hold_action:
                action: more-info
            design:
              background_color: entity 20%
              border_radius: 16px
              padding: 12px
              animations:
                - id: glow
                  preset: glow-pulse
                  trigger: entity_on
                  color: entity
                  duration: 2s
                  intensity: 16
                  strength: 60
```

A value ring (filter life):

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: info
            entity: sensor.purifier_filter_life
            show_name: true
            show_state: true
            design:
              padding: 16px
              border_radius: 24px
              ring:
                mode: value
                min: 0
                max: 100
                width: 4
                linecap: round
                start: top
                track_color: entity 20%
                thresholds:
                  - from: 0
                    color: red
                  - from: 20
                    color: orange
                  - from: 50
                    color: green
```

A pop-up card and a button that opens it. The first card is the pop-up:

```yaml
type: custom:magic-card
popup:
  enabled: true
  hash: kitchen
  title: Kitchen
  style: sheet
rows:
  - columns:
      - modules:
          - type: light
            entity: light.kitchen
            show_brightness: true
          - type: button
            label: Close
            icon: mdi:close
            actions:
              tap_action:
                action: close-popup
```

The second card holds the button:

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: button
            label: Kitchen
            icon: mdi:silverware-fork-knife
            actions:
              tap_action:
                action: popup
                hash: kitchen
```

A Navigate action with `navigation_path: "#kitchen"` opens the same pop-up.

A conditional design rule:

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: text
            use_entity: true
            entity: sensor.washing_machine_status
            design:
              padding: 12px
              border_radius: 12px
              background_color: "#2b2b2b"
              conditional:
                - id: rule-running
                  name: Running
                  mode: every
                  conditions:
                    - id: c1
                      type: state
                      entity: sensor.washing_machine_status
                      state: running
                  design:
                    background_color: "#1b5e20"
                    color: white
```

## Images

Library images are drawings you make in the Magic Card image editor and save to the Magic Card Utils library. A dashboard can show one in an image module, or as a background behind the content. The library holds up to 200 images, and each image can be up to 256 KiB.

Library images need the Magic Card Utils integration, installed through HACS like Magic Card. Everyone who can log in to Home Assistant can see them. Only administrators can create or change them.

The [Images](documentation/images/README.md) section covers the editor, the image and background options, the YAML form `mcu-image:<id>`, and [privacy](documentation/images/privacy.md).

## Sharing and privacy

Your designs can be shared as files. The [presets page](documentation/presets/README.md) explains the library, and [Export and import](documentation/presets/export-and-import.md) describes the file format and the checks that run on import.

### Sharing presets

When you import a theme file, Magic Card reads it on your computer. It downloads nothing while it reads, and it sends nothing to the author.

Some theme files point to a picture or font on another website, or contain `card-mod-` lines. If a file does, Magic Card lists each setting and the website before you confirm. If you choose **Import anyway**, every browser that shows a dashboard with this theme asks that website for the file, and the website can see the visitor's IP address. Lines that start with `card-mod-` only work when card-mod is installed, and they can restyle any card.

Only import files from people you trust. To avoid all of this, choose **Cancel**, or delete those lines from the file and import it again.

### Imported files are untrusted

Imported files are limited to 1 MB, parsed with a safe YAML reader, checked item by item, and cleaned (SVG scripts, links and external references are removed and listed). Theme files are the one exception, as described above, and only after you confirm.

### Privacy

Magic Card and Magic Card Utils have no telemetry and send nothing to the author. Your icons, shapes and presets are stored in your own Home Assistant (Magic Card Utils) or in the card configuration.

Magic Card Utils makes no requests to other websites. Magic Card makes them only when your own configuration asks for it:

-   A card that uses a Google font from the font picker loads that font from Google (`fonts.googleapis.com` and `fonts.gstatic.com`). Google can see the visitor's IP address. This also applies to a font set for a button label. To avoid it, use a font that is installed on the device.
-   An address you typed, such as an image, is requested by the browser, and that website can see the visitor's IP address.
-   A theme file kept with **Import anyway** that points to another website is requested the same way.

## Compatibility

-   Home Assistant 2024.8.0 or newer (`hacs.json`).
-   Known limitations:
    -   A saved icon appears as a one-colour silhouette in Home Assistant's own cards.
    -   A new icon appears in Home Assistant's icon picker after you reload the page.
    -   The Home Assistant companion apps are not verified with the editors and the new features yet.
-   Sections view: the card supplies no fixed size, so the Layout tab of the card (`grid_options`) controls its columns and rows as usual. A live pop-up asks for a full-width, auto-height cell with no minimum rows and takes itself out of the flow. The older `layout_options` are supported as well.
-   The `grid_options`, `layout_options`, `visibility` and `view_layout` keys that Home Assistant stores in the card config are kept when you edit the card or link it to a template.

### Older Android tablets

Magic Card needs Android System WebView 85 (Chromium 85) or newer. It was checked on a desktop copy of that engine, not on a tablet. On it, the bell swing, the glow and the ripple rings of some animated cards do not show, and the card can stutter when an extra file arrives. See [Older Android tablets](documentation/old-tablets/README.md) and the [old engine check](documentation/old-tablets/old-engine-check.md).

### Check a genuine release

Releases are built by a GitHub Actions workflow. You can check a download by looking at the release author and the attached SBOM, or with the GitHub CLI. Signed attestations exist only for releases built after they were added, so older releases pass the quick check only. See [Check a genuine release](documentation/security/check-a-genuine-release.md).

## Troubleshooting

-   A new option or the editor looks outdated. The browser still runs an old copy. Hard refresh (Ctrl+Shift+R) and, in the companion app, clear the frontend cache. Open the browser console and look for the line `MAGIC-CARD v<version>` to see which version is loaded. It must match the version you installed.
-   "Custom element doesn't exist: magic-card". The resource is missing or has the wrong URL. Check Settings, Dashboards, Resources for `/hacsfiles/magic-card/magic-card.js` (HACS) or `/local/magic-card.js` (manual), type JavaScript module.
-   A pop-up does not open from a button. The ID is case-sensitive and must match exactly. The pop-up card must be on the dashboard the user is viewing.
-   Templates cannot be saved or loaded. The `magic_card_utils` backend integration is missing.
-   The card editor, the Animated icons tab, the catalogue presets, the animation studio or its icon library cannot be loaded, or a particle layer plays only its simple version. A file next to `magic-card.js` is missing. Each release has 46 `.js` files, each with a `.br` and `.gz` copy. [Loading the other files](#loading-the-other-files) lists the main ones. With a manual install, copy all of them to the same folder, then hard refresh. The Themes tab in Magic Card Utils needs `magic-card-theme-editor.js` and `magic-card-theme-presets.js` next to `magic-card.js`. The icon library window has a Try again button once the file is there.
-   Home Assistant shows its YAML editor in place of the Magic Card editor. `magic-card-editor.js` is missing or comes from another version than `magic-card.js`. The browser console says which. Copy the file next to `magic-card.js` and hard refresh.
-   An entity colour shows nothing. The entity's domain has no state colour (a sensor, for example). Use a fixed colour instead.
-   A card broke after an update. [MAINTAINING.md](MAINTAINING.md) has the steps to roll back to the version that worked, to see which version runs and to stay on one version.
-   A card shows the tile "Magic Card updated. Tap to reload.". Tap it once. If it then says the old version is still running, follow [Clear the browser cache](documentation/loading-and-size/README.md#clear-the-browser-cache).
-   The tile on a wall tablet: the tile and its reload have not yet been checked on a real wall tablet. If your tablet keeps showing the tile after you tap it and clear the cache, [tell us which tablet and app you use](https://github.com/therealmcsparrow/magic-card/issues).
-   A card stands still. See the [pause reply](documentation/support/README.md#pause-reply) and the [update reply](documentation/support/README.md#update-reply).
-   To report a card that stands still, post in [Pause and focus reports](https://github.com/therealmcsparrow/magic-card/discussions/categories/pause-and-focus-reports).
-   How a size claim was measured and which cases we test: see [how we measured](documentation/loading-and-size/README.md#how-we-measured) and [bad cases we test](documentation/loading-and-size/README.md#bad-cases-we-test).

## Development

-   Prerequisites: Node.js 16+ and npm.
-   Install dependencies: `npm install`
-   Run dev server: `npm run dev` (serves on `http://localhost:5050`)
-   Build for production: `npm run build`
-   Tests: `npm test`

## Contributing

This is an open-source project and contributions are welcome. Open an issue or submit a pull request.

## Support

For issues, feature requests, or questions, please [create an issue on GitHub][issues-url]. To report a security problem, follow [SECURITY.md](SECURITY.md) and do not open a public issue.

If you like Magic Card and want to support its development:

-   Ko-fi: <https://ko-fi.com/mcsparrow>
-   PayPal: <https://www.paypal.biz/therealmcsparrow>

## Credits

The icon library and the icon shapes built into the animation studio and the Animated icons tab come from [Material Design Icons](https://pictogrammers.com/library/mdi/) by Pictogrammers, licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

### Special thanks

Special thanks to [Anas Box](https://www.youtube.com/@anasbox). His YouTube videos taught me how to animate cards in Home Assistant, and a lot of the animation work in Magic Card started there. If his videos have helped you too, you can support him here:

-   Patreon: <https://patreon.com/AnasBox>
-   YouTube membership: <https://www.youtube.com/@anasbox/join>
-   PayPal: <https://paypal.me/anasboxsupport>
-   Buy Me a Coffee: <https://buymeacoffee.com/anasbox>
-   Ko-fi: <https://ko-fi.com/anasbox>

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

The release bundles third-party software under its own licences. See [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

[hacs-badge]: https://img.shields.io/badge/HACS-Custom-41BDF5.svg
[hacs-url]: https://hacs.xyz/
[version-badge]: https://img.shields.io/github/package-json/v/therealmcsparrow/magic-card
[version-url]: https://github.com/therealmcsparrow/magic-card/releases
[github-downloads-badge]: https://img.shields.io/github/downloads/therealmcsparrow/magic-card/total?style=for-the-badge
[github-downloads]: https://github.com/therealmcsparrow/magic-card/releases
[license-badge]: https://img.shields.io/github/license/therealmcsparrow/magic-card
[license-url]: https://github.com/therealmcsparrow/magic-card/blob/main/LICENSE
[last-commit-badge]: https://img.shields.io/github/last-commit/therealmcsparrow/magic-card
[last-commit-url]: https://github.com/therealmcsparrow/magic-card/commits/main
[issues-badge]: https://img.shields.io/github/issues/therealmcsparrow/magic-card
[issues-url]: https://github.com/therealmcsparrow/magic-card/issues
