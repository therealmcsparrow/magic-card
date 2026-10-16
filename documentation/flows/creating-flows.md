# Creating flows

There are two ways to add a flow in the editor: the Flows tab of Card settings, or the Add flow from here button on the studio canvas. Both write the same `flows` entries. See [Flow lines](README.md) for what a flow does.

## The Flows tab

Select the card (Card settings) and open the Flows tab. It is the last tab, after General, Design and Conditions. See [Inspector](../inspector/README.md).

- With no flows, the tab explains: "Animated lines between two modules, like solar to house. Speed, width and direction can follow an entity value."
- Add flow adds an empty flow with a generated id and opens it.
- Each flow is a block titled "Flow N · From → To", with a chevron to open or close it and a delete button.
- Pick the From and To modules. Until both are set, the block shows "Pick the start module" and "Pick the end module".
- The rest of the fields are described in [Options](options.md). Each set field has a reset button.

### The module lists

From and To list every module of the card in reading order, including modules inside layout modules (Horizontal, Vertical, Tabs and so on). Each entry reads like "Row 1 · Column 2 · Info · Solar power": its position, the module type, then its label or its entity's name. Modules with the same label get their position added ("· Module 2").

- The module chosen at one end isn't offered at the other.
- A module without an id gets one when you pick it, in the same edit. The id starts with the module type, for example `info_lx2k9a_3f1c_4`.
- A flow that points at an id no module has shows "Module not found" (in the list and as an error under the field).

## On the studio canvas

In the [studio](../studio/README.md):

1. Select the module where the flow starts.
2. In its floating toolbar, choose Add flow from here (the connection icon). The canvas shows "Click the module to connect to. Esc cancels."
3. Click the module where the flow ends.

The new flow is added in one undoable step, modules without an id get one, and the new flow is selected. Clicking the start module again, or something that isn't a module, keeps waiting. Escape, the Cancel button in the hint, the toolbar button again or a click on the empty canvas around the card leaves connect mode.

### Selecting a flow on the canvas

Click a flow line between modules to select it. The line gets a highlight, and the inspector opens Card settings at the Flows tab with that flow open. Opening a flow's block in the Flows tab selects it on the canvas; closing it clears the selection. Clicking the empty canvas clears it too.

## Ids

Flows connect modules by `id`, so the modules at both ends need one. The editor writes them for you. In YAML, any unique string works:

```yaml
- id: grid
  type: info
  entity: sensor.grid_power
```

A flow without an `id` of its own still works. The editor and card then refer to it by its ends (`from>to`).

## Template-linked cards

On a card linked to a template:

- Editing flows marks `flows` as overridden for this card.
- A top-level module that comes from the template without an id can't be picked. It is listed as "(no id)" and disabled, with the hint "Give this module an id in the template". On the canvas the Add flow from here button is disabled for it, and clicking it as the end module shows the same hint. Give the module an id in the template first.
- A module nested inside a template module can get an id; that overrides the layout module's child list on this card.

## Deleting modules

Deleting a module (or a layout module with modules inside it) removes the flows that start or end at it, in the same undoable step. Flows that already pointed at an unknown id stay, so you can fix them.
