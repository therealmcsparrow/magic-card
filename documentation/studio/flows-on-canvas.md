# Flows on the canvas

Flow lines connect two modules with an animated line. In the Studio you can draw a new flow by clicking its two ends, and select an existing flow by clicking its line. The settings of each flow are in the card's Flows tab. See [Flows](../flows/README.md).

-   [Adding a flow](#adding-a-flow)
-   [What ends connect mode](#what-ends-connect-mode)
-   [Selecting a flow](#selecting-a-flow)
-   [Ids and templates](#ids-and-templates)

## Adding a flow

1.  Select the module the flow starts at.
2.  Press Add flow from here in the floating bar. The pointer turns into a crosshair and a bar at the foot of the canvas says "Click the module to connect to. Esc cancels." with a Cancel button.
3.  Click the module the flow ends at.

The new flow is added from the first module to the second, in one undo step. It becomes the selected flow, and the inspector opens the card's Flows tab with that flow expanded.

Clicks that do not end the flow keep connect mode waiting: the start module itself, a column, a row or the card.

The start can be chosen with the keyboard (the floating bar button), but the end module has to be clicked. To build a flow with the keyboard only, use the card's Flows tab.

## What ends connect mode

| Action | Result |
| --- | --- |
| Clicking another module | Adds the flow |
| Escape (focus on the canvas or on the hint bar) | Cancels. Escape here does not change the selection or close the Studio. |
| Cancel in the hint bar | Cancels |
| Add flow from here again | Cancels |
| Clicking the dotted background | Cancels |
| Selecting something else (for example in Layers) | Cancels |
| Any change to the config (a field, undo, YAML) | Cancels |

## Selecting a flow

Click a flow line where it does not cross a module. The flow is selected and highlighted on the canvas, the card becomes the selection, and the inspector opens Card, Flows with that flow expanded.

Selecting a row, column or module clears the flow selection. So does a click on the dotted background around the card.

## Ids and templates

A flow refers to its modules by `id`. If either module has no id, one is generated and written into the config when the flow is added.

On a card linked to a template:

-   Adding a flow overrides the card's `flows`, so this card keeps its own list.
-   A top-level module from the template without an `id` cannot be used, as a start or as an end. The floating bar button is disabled for it. Clicking such a module as the end shows "Give this module an id in the template, or pick another." and connect mode keeps waiting.
-   A layout child without an id gets one, and its layout module's child list becomes an override.

See [Templates](../editor/templates.md).
