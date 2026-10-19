# Magic Card documentation

This folder documents the Magic Card editor and every option the card supports. The [main README](../README.md) gives a short overview and covers installation. These pages go into detail. Each topic is a folder; its `README.md` lists the pages inside.

## Editor

| Folder | Covers |
| --- | --- |
| [Pane editor](editor/README.md) | The editor in the card dialog: Form and YAML modes, the structure outline (also where layout modules get their children, tabs and columns), item menus (copy YAML, copy and paste modules, wrap in a layout, hide on the dashboard, rename) and keyboard, undo and redo, templates and the animations a template shares with linked cards, copy and paste design |
| [Studio](studio/README.md) | The full-screen editor: layers, the live canvas, selection, the canvas width that follows the dashboard view, item menus on the canvas, the floating bar, adding flows on the canvas, keyboard shortcuts |
| [Inspector](inspector/README.md) | The settings panel for the selected card, row, column, module, tab or row-module column, tab by tab |
| [Themes](themes/README.md) | The theme editor in the Magic Card Utils Themes tab: creating a Home Assistant theme from blank, a preset or an installed theme, light, dark and Shared values, the Magic Card and third-party card groups, gradients, Try on dashboard and Revert, Use this theme, read-only files and the limits |
| [Animation studio](animation-studio/README.md) | Your own keyframe, particle, path and sequence animations: the library with live preset tiles, particles with physics, collisions and child particles, icon animations with part presets, the icon library, animated SVG export, the editor with layers, stage, timeline and inspector, icon parts, drawing, own SVG icons, card parts, state clips and value bindings, using them in cards and their YAML format. Needs the Magic Card Utils integration. |
| [SVG editor](svg-editor/README.md) | Drawing and editing icons on a 24 x 24 grid: tools, the grid, alignment, boolean operations, layers with groups and drag and drop, dual-tone Accent icons, path tools (outline stroke, offset, simplify, join, split, knife), importing SVG files and saving to the library. Needs Magic Card Utils. |
| [Shape editor](shape-editor/README.md) | Outlines for a card, row, column or module: corner types and sizes, free shapes with the pen, starting from a preset, combining shapes, the previews and saving to the library. [Custom shapes in cards](shape-editor/custom-shapes-in-cards.md) has the YAML and what older browsers show. Needs Magic Card Utils for the editor. |
| [Presets and the library](presets/README.md) | Your saved animations, theme presets, icons and shapes, the copies a card keeps, and the [export and import](presets/export-and-import.md) file format with its safety checks and the warning for themes that point to other websites. |
| [Magic Card Utils](magic-card-utils/README.md) | The integration's panel tabs (Templates, Animations, Themes, Library, Shapes and Editors), saved icons in a card and in Home Assistant's own cards, and what needs what. |

## Options reference

| Folder | Covers |
| --- | --- |
| [YAML](yaml/README.md) | The full config tree, value syntax, templates, YAML mode, troubleshooting and complete copy-paste examples |
| [Card, rows and columns](card/README.md) | Card-level, row and column options, actions, display conditions, conditional appearance and pop-up mode |
| [Modules](modules/README.md) | Every module type and its options, one page per module |
| [Card entity](card-entity/README.md) | One entity for the whole card: modules, rows and columns follow it unless they pick their own or `none`, layouts that share an entity with the modules inside, modules that need one kind of device, toggles on an inherited entity, `entity` and `card_entity` in templates, and how Magic Card Utils templates treat it |
| [Design](design/README.md) | The Design tab group by group, shapes, value backgrounds, hover, seasonal scenes, entity colours, conditional design, animations and catalogue presets, icon animations with their Quiet, Living and Glow styles, and rings, including timer rings |
| [Layers](design/layers.md) | Modules behind others or on top of the card, with position, blend, blur, darkening behind text, click-through and the Pause motion button. The card backdrop is in [Backgrounds](design/backgrounds.md#card-backdrop) |
| [Icon effects](icon-effects/README.md) | Liquid fill, device animations, line draw, morphing icons, duotone and gradient colours, custom SVG icons |
| [Flow lines](flows/README.md) | Animated lines between modules |

## Languages and accessibility

| Folder | Covers |
| --- | --- |
| [Languages](languages/README.md) | English (UK), English (US) and Dutch, which language Magic Card uses, and which text stays in English |
| [Accessibility](accessibility/README.md) | The WCAG 2.2 AA target, the keyboard and screen reader support in the editors, and what still needs a check on a real device |

## Examples

| Folder | Covers |
| --- | --- |
| [Card gallery](gallery/README.md) | Eighty-two complete cards with screenshots and YAML, thirty-seven of them animated: weather, climate, energy, lights, media, security, appliances, garden, seasonal, sci-fi and fantasy |
| [Complete dashboards](gallery/dashboards/README.md) | Twenty-five complete sections dashboards made of Magic Cards, each with its own theme: sci-fi, fantasy, western, steampunk and dystopian |
| [Theme examples](themes/examples/README.md) | The 45 theme presets of the theme editor, each with a screenshot of its light and dark modes |

## Where to start

-   New to the card: read [Pane editor](editor/README.md), then [Studio](studio/README.md).
-   Writing YAML by hand: start with [YAML](yaml/README.md), then [Card, rows and columns](card/README.md) and [Modules](modules/README.md).
-   Looking for ideas: browse the [Card gallery](gallery/README.md) and copy a card, or start from one of the [complete dashboards](gallery/dashboards/README.md).
-   Styling: [Design](design/README.md) and [Icon effects](icon-effects/README.md). To theme Home Assistant, start with [Themes](themes/README.md).
-   Drawing an icon or an outline: [SVG editor](svg-editor/README.md) and [Shape editor](shape-editor/README.md). To share a design with someone else, read [Export and import](presets/export-and-import.md).
-   Your own animations: [Animation studio](animation-studio/README.md). To make an icon's parts move, start with [Icon animations](animation-studio/icon-mode.md), or with the icon picker's Animated icons tab in the card editor (see [Icon animations in cards](design/quick-icon-animator.md)). [Icon parts](animation-studio/parts.md) covers the details. To react to an entity, read [States and values](animation-studio/states-and-values.md).
