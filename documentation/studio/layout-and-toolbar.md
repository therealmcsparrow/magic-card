# Layout and top bar

-   [Top bar](#top-bar)
-   [Workspace](#workspace)
-   [Hiding the side panels](#hiding-the-side-panels)
-   [Narrow screens](#narrow-screens)
-   [YAML mode](#yaml-mode)
-   [Sync with the pane editor](#sync-with-the-pane-editor)

## Top bar

From left to right:

| Control | What it does |
| --- | --- |
| Back to dialog | Closes the Studio. |
| Layers button | Shows or hides the Layers panel. Only visible on narrow screens (900 px wide or less). |
| Card name | The card's name, or "Untitled card". |
| Template bar | A compact template bar: the template name and override count, or a No template button. See [Templates](../editor/templates.md). |
| Form / YAML | Switches the editor mode. Shared with the pane editor. |
| Canvas width | Narrow, Wide, Panel. Follows the dashboard view. Hidden in YAML mode. See [Canvas width](device-widths.md). |
| Preview | Runs the card as on the dashboard, with live actions. Shows the notice "Preview: actions are live". Press again or Escape to return to editing. See [Preview](preview.md). |
| Undo, Redo | Same as Ctrl+Z and Ctrl+Y. Disabled when there is nothing to undo or redo, and while Preview is on. |
| Done | Closes the Studio. |

## Workspace

| Area | Width | Content |
| --- | --- | --- |
| Layers (left) | 240 px | "Layers" with the module count, and the structure outline. See [Structure outline](../editor/structure-outline.md). |
| Canvas (middle) | the rest | The live card on a dotted background. See [Canvas and selection](canvas-and-selection.md). |
| Inspector (right) | 340 px | The settings of the selection. See [Inspector](../inspector/README.md). |

On screens 1180 px wide or less, the side panels narrow to 220 px and 320 px.

The inspector's header and tab bar stay at the top of its panel; only the settings below them scroll. A tab switch or a new selection starts the settings at the top. See [Inspector header](../inspector/README.md#header).

The inspector tabs depend on what is selected:

| Selected | Tabs |
| --- | --- |
| Card | General, Design, Conditions, Flows |
| Row | General, Actions, Conditions, Design |
| Column | General, Conditions, Design |
| Module | The tabs the module type has, in the order General, Actions, Conditions, Design |

## Hiding the side panels

Layers and the inspector each have an edge button on their inner side while they sit beside the canvas. Press it to hide the panel. The canvas takes the width the panel gave up, and the button stays at the window edge. Press it again to show the panel with the same selection and scroll position.

The edge button is the same size whether its panel is shown or hidden, in every editor. Only its colours change: filled with the accent colour while the panel is hidden.

-   A hidden panel keeps its settings, and nothing changes in the card or the undo history.
-   Ctrl+\ (Cmd+\ on a Mac) hides both panels when either is shown. When both are hidden, it shows again the panels it hid last. It works from any field in the Studio, except while Preview is on. On keyboard layouts that type \ with AltGr, such as German and Dutch, the shortcut types the character instead, so use the edge buttons.
-   The Studio remembers which panels are hidden on this device and opens with them hidden. Other devices are not affected.
-   The first time the Studio opens with a panel hidden, a short hint explains the button and the shortcut. Press Got it to close it.
-   Edit on a layer, or a rename that needs the Layers list, shows a hidden panel again.
-   Where a panel is an overlay (900 px or less) or sits below the canvas (640 px or less), it has no edge button. The Layers button and the inspector keep their own controls there.
-   Preview hides both panels, so their buttons are not shown while it is on. See [Preview](preview.md).

## Narrow screens

| Screen width | Layout |
| --- | --- |
| 900 px or less | Layers is hidden. The Layers button in the top bar opens it as a panel over the canvas. Escape closes it and returns focus to the Layers button. Edit in a module's three-dot menu also closes it. |
| 640 px or less | One column: the canvas on top (at least 320 px high) and the inspector below it. The whole workspace scrolls, and the inspector's header and tabs stick to the top of the screen while you scroll through its settings (not on screens 480 px high or less). |

Layers always starts hidden when the Studio opens on a narrow screen.

## YAML mode

In YAML mode the canvas is replaced by Home Assistant's YAML editor, centred and at most 760 px wide. Layers and the inspector stay, and the canvas width switch is hidden. YAML edits work as in the pane. See [Form and YAML](../editor/form-and-yaml.md).

## Sync with the pane editor

The Studio and the pane editor are two views of one editor state:

-   Config, selection, Form / YAML mode and undo history are shared.
-   Picker windows and confirmation dialogs (Add module, templates, "Update linked cards?") open above the Studio while it is open.
-   Edits reach Home Assistant's card dialog shortly after you make them, whether you are in the Studio or the pane.
