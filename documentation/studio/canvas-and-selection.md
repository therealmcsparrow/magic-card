# Canvas and selection

The canvas draws one live copy of the card with your Home Assistant data. You select rows, columns and modules by clicking them on the card.

-   [Clicking](#clicking)
-   [Right-click and long-press](#right-click-and-long-press)
-   [Hover](#hover)
-   [Selection frame and colours](#selection-frame-and-colours)
-   [The live card on the canvas](#the-live-card-on-the-canvas)
-   [Hidden, empty and nested items](#hidden-empty-and-nested-items)
-   [Pop-up cards](#pop-up-cards)
-   [Errors](#errors)

## Clicking

A click selects the innermost item under the pointer:

| Click on | Selects |
| --- | --- |
| A module | That module. Inside a layout module, the child you clicked, at any depth. |
| A column, outside its modules | The column |
| A column of a Row module, outside its modules | That column of the row module. It is selected like a tab or column in the tree and gets the same inspector as a card column. |
| A row, outside its columns (for example the gap) | The row |
| The card, outside its rows | The card |
| The dotted background around the card | The card. This also clears a selected flow line and cancels adding a flow. |
| A flow line, outside any module | That flow line. See [Flows on the canvas](flows-on-canvas.md). |

To reach a parent from a selected module, press Escape (module, then column, row, card), or use the breadcrumbs in the inspector header. A child of a Tabs or Row module goes to its tab or row-module column first, then to the layout module. See [Keyboard shortcuts](keyboard-shortcuts.md).

The hint under the canvas reads "Click a module to select it. Alt + Up/Down moves it, Del removes it, Shift + F10 opens its menu."

## Right-click and long-press

Right-click selects what a click would select and opens its menu at the pointer. On the dotted background it opens the card's menu. On a touch screen, hold a finger still on the card for half a second. Shift+right-click keeps the browser's own menu. The menus are the same as in Layers; see [Item menus](../editor/item-menus.md).

Copy and paste actions confirm in a small message at the foot of the canvas ("Row 2 YAML copied"), which screen readers announce.

## Hover

Moving the pointer over the card outlines what a click would select, in that level's colour, with its name in a small tag ("Row 2", "Column 1", "Button"). The card itself gets an outline without a tag. Nothing is outlined over the item that is already selected.

## Selection frame and colours

The selection has a frame with a name tag (except for the card). A selected module also has small squares on its corners. They cannot be dragged. Each level has its own colour, in the frame, the hover outline and the matching items in Layers:

| Level | Colour |
| --- | --- |
| Card | Grey (secondary text colour) |
| Row | Orange (the theme's warning colour, darkened) |
| Column, also a tab or a row-module column | Green (the theme's success colour, darkened) |
| Module | The theme's accent colour (primary colour) |

When a module is selected, the [floating bar](floating-bar.md) appears next to it. When a row or one of its columns is selected and the row has more than one column, resize handles appear on the gaps between the columns. The same goes for a Row module: select the module or one of its columns. See [Column resize](column-resize.md).

The frame stays on its item when the canvas scrolls, the window resizes or the card changes size.

## The live card on the canvas

Outside Preview, the canvas card uses your real entity states but cannot change anything (see [Preview](preview.md)):

-   Clicks, taps, holds and double taps select. They never run the tap, hold or double-tap actions of a module or a row.
-   Service calls are blocked. Only read-only requests reach Home Assistant (states, history, statistics, templates, camera images, media browsing, weather forecasts).
-   Requests from embedded cards to open more-info or run an action are stopped.
-   Keys pressed inside the card are not passed to the modules. Tab still moves focus. Other keys work as canvas shortcuts.
-   Inputs inside module previews cannot be typed into.

Other edit-mode differences on the canvas:

-   Camera modules do not start a live stream.
-   Slider layouts do not swipe or autoplay, and their page dots cannot be clicked.
-   The card is drawn without its template link, so the canvas never registers itself as a card that uses the template.

Module-specific behaviour is described in [Modules](../modules/README.md).

## Hidden, empty and nested items

-   Display conditions and Hide on dashboard do not hide anything on the canvas. Rows, columns, modules and tabs whose conditions are not met, or that are hidden on the dashboard, are drawn at reduced opacity and can still be selected. The name tag of a hidden item ends in "· hidden". Card-level display conditions are ignored on the canvas. See [Inspector](../inspector/README.md).
-   An empty column is drawn as a dashed box at least 40 px high, so you can click it.
-   An empty slot of a layout module shows placeholder text.
-   Tabs and Slider layouts: when you select a child that sits in another tab or slide (in Layers or by undo), the canvas switches to the tab or slide that holds it.
-   A tab has no frame of its own on the canvas. Selecting a tab in Layers shows that tab and frames the whole Tabs module.

## Pop-up cards

A card in pop-up mode is drawn inline on the canvas, like a normal card. To see the real pop-up, use Preview pop-up in the card's General tab. In the Studio it opens the pop-up of the canvas card, above the Studio. Clicks and keys inside that pop-up belong to the pop-up (close button, backdrop, swipe, Escape) and do not change the canvas selection. See [Card](../card/README.md).

## Errors

If the current config cannot be drawn, the canvas shows "Preview not updated:" with the error and keeps the last version it could draw. A module with invalid settings shows its own error or hint inside the card.
