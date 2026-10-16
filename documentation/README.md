# Magic Card documentation

This folder documents the Magic Card editor and every option the card supports. The [main README](../README.md) gives a short overview and covers installation. These pages go into detail. Each topic is a folder; its `README.md` lists the pages inside.

## Editor

| Folder | Covers |
| --- | --- |
| [Pane editor](editor/README.md) | The editor in the card dialog: Form and YAML modes, the structure outline (also where layout modules get their children, tabs and columns), its menus and keyboard, undo and redo, templates and the animations a template shares with linked cards, copy and paste design |
| [Studio](studio/README.md) | The full-screen editor: layers, the live canvas, selection, device widths, the floating bar, adding flows on the canvas, keyboard shortcuts |
| [Inspector](inspector/README.md) | The settings panel for the selected card, row, column, module, tab or row-module column, tab by tab |
| [Animation studio](animation-studio/README.md) | Your own keyframe, particle, path and sequence animations: the library, icon animations with part presets, the icon library, animated SVG export, the editor with layers, stage, timeline and inspector, icon parts, drawing, own SVG icons, card parts, state clips and value bindings, using them in cards and their YAML format. Needs the Magic Card Utils integration. |

## Options reference

| Folder | Covers |
| --- | --- |
| [YAML](yaml/README.md) | The full config tree, value syntax, templates, YAML mode, troubleshooting and complete copy-paste examples |
| [Card, rows and columns](card/README.md) | Card-level, row and column options, actions, display conditions, conditional appearance and pop-up mode |
| [Modules](modules/README.md) | Every module type and its options, one page per module |
| [Design](design/README.md) | The Design tab group by group, shapes, value backgrounds, hover, seasonal scenes, entity colours, conditional design, animations, icon animations and rings, including timer rings |
| [Icon effects](icon-effects/README.md) | Liquid fill, device animations, line draw, morphing icons, duotone and gradient colours, custom SVG icons |
| [Flow lines](flows/README.md) | Animated lines between modules |

## Where to start

-   New to the card: read [Pane editor](editor/README.md), then [Studio](studio/README.md).
-   Writing YAML by hand: start with [YAML](yaml/README.md), then [Card, rows and columns](card/README.md) and [Modules](modules/README.md).
-   Styling: [Design](design/README.md) and [Icon effects](icon-effects/README.md).
-   Your own animations: [Animation studio](animation-studio/README.md). To make an icon's parts move, start with [Icon animations](animation-studio/icon-mode.md), or with the icon picker's Animated icons tab in the card editor (see [Icon animations in cards](design/quick-icon-animator.md)). [Icon parts](animation-studio/parts.md) covers the details. To react to an entity, read [States and values](animation-studio/states-and-values.md).
