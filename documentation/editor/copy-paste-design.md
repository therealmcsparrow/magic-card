# Copy and paste design

You can copy the design of a row, column or module and paste it onto another row, column or module, in the same card or in another one. The card's own Design tab has no copy and paste.

-   [Where to find it](#where-to-find-it)
-   [Replace and merge](#replace-and-merge)
-   [Where the copy is kept](#where-the-copy-is-kept)
-   [Linked cards](#linked-cards)

## Where to find it

| Place | Items |
| --- | --- |
| Three-dot menu of a row, column or module in the outline or Layers | Copy design, Paste design, Merge pasted design |
| Top of the Design tab of a row, column or module | Copy design, and Paste design with a menu: Replace design, Merge into design |

The paste items are disabled until something has been copied; their tooltip says "Copy a design first". In the Design tab, a short status ("Design copied", "Design pasted") confirms the action.

For the design settings themselves, see [Design](../design/README.md).

## Replace and merge

| Mode | Menu label | Result |
| --- | --- | --- |
| Replace | Paste design, or Replace design | The target's design becomes a copy of the copied design. |
| Merge | Merge pasted design, or Merge into design | The copied keys are written over the target's design. Keys the copy does not have stay. Animations and conditional design rules are added after the target's own. |

Pasted animations, conditional rules and their conditions get new ids, so pasting the same design twice never creates duplicate ids.

A paste is one undo step.

## Where the copy is kept

-   The copy is stored in the browser (local storage), so it stays available in other cards and other editor dialogs on the same browser.
-   It is also written to the system clipboard as YAML, when the browser allows it. You can paste that into a YAML editor.
-   Only one design is kept at a time. Copying again replaces it.
-   Empty values and editor bookkeeping (`not_synced`) are not copied.

## Linked cards

On a card linked to a template, a paste counts as an override. On a module, each design key that changed is marked. On a row or column, the whole design is marked. On a layout module's child, the layout module's child list is marked. See [Templates](templates.md#overrides).
