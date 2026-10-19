# Templates

A template is a saved card that other cards can link to. A linked card takes its content and look from the template and keeps only the fields you override locally. Edit the template once and every linked card follows.

-   [Backend requirement](#backend-requirement)
-   [The template bar](#the-template-bar)
-   [Create a template](#create-a-template)
-   [Load a template](#load-a-template)
-   [Overrides](#overrides)
-   [Template animations](#template-animations)
-   [Re-sync](#re-sync)
-   [Save to template](#save-to-template)
-   [Unlink from template](#unlink-from-template)
-   [Adding a row to a linked card](#adding-a-row-to-a-linked-card)
-   [What a template does not hold](#what-a-template-does-not-hold)
-   [Limits](#limits)

## Backend requirement

Templates are stored in Home Assistant by the `magic_card_utils` integration. The editor uses its WebSocket commands `magic_card_utils/get_templates`, `magic_card_utils/save_template` and `magic_card_utils/delete_template`.

Without the integration, the template windows show "Magic Card integration not found. Please install it via HACS and add the integration." and no template can be loaded or saved.

## The template bar

The template bar sits under the pane head. In the Studio a compact version sits next to the card name in the top bar.

Not linked: the pane shows "Not linked to a template" and a No template button. Its menu has:

-   Load template…
-   Create template from this card

Linked: the bar shows "Template", a button with the template name, and either "In sync" or the number of overrides ("3 overrides"). In the pane, a "Re-sync 3 overrides" button appears on the right while there are overrides. The Studio's compact bar has no labels and no separate Re-sync button; use the menu.

The menu of a linked card:

| Item | Action |
| --- | --- |
| (note) | "Linked to template *name*." followed by "*n* fields differ locally." or "Fully in sync." |
| (list) | Each place with overrides (Card, Row 1, Row 1 / Col 2, or a module's label or type) and the overridden fields. |
| Re-sync *n* overrides | See [Re-sync](#re-sync). Disabled when there are none. |
| Save to template | See [Save to template](#save-to-template). |
| Unlink from template | See [Unlink from template](#unlink-from-template). |

## Create a template

Create template from this card opens the "Create template" window:

-   Template name (required).
-   Description (optional).

Save stores the card's content under that name and links this card to it. If the name is taken, the window asks "A template named "…" already exists. Overwrite?" and the button becomes Overwrite.

The stored template leaves out the template link, every override list and the per-card Home Assistant keys (see [What a template does not hold](#what-a-template-does-not-hold)).

From a card that is linked to another template, the new template gets the animations the card plays: the old template's documents, with this card's own versions and additions. Documents hidden on this card stay out of the new template, so after the card links to the new one it plays the same animations as before. A card with `custom_animations` in `not_synced` stores only its own documents.

## Load a template

Load template… opens the "Load template" window with a search field ("Search templates") and the saved templates in alphabetical order, each with its description.

-   Click a template (or press Enter or Space on it). The window asks "Load "…"? This will replace your current config." Press Load to confirm.
-   Loading replaces the card's whole config with the template's content and links the card to it. Only the per-card Home Assistant keys (`grid_options`, `visibility` and similar) and other keys the template does not manage, such as `card_mod`, are kept from the old config. The card's own `custom_animations` and `hidden_animations` go: the template supplies its animations. Undo brings the old config back.

Each template in the list also has two buttons:

| Button | Action |
| --- | --- |
| Edit template | Opens a form under the search field to change the name and description. Save renames the template (it refuses a name that already exists). |
| Delete template | Deletes the template from Home Assistant straight away. There is no confirmation and no undo. |

Renaming a template does not update cards that link to the old name.

## Overrides

On a linked card, a field you change in the inspector becomes an override. The field's path is written to a `not_synced` list on the card, row, column or module, and the card keeps its own value for it. Everything else keeps coming from the template.

-   Rows, columns and modules are matched to the template by their `id`.
-   Changes to a layout module's children (adding, moving, editing or deleting a child at any depth) override that layout module's whole child list. This covers the tree's work on tabs and row-module columns too: adding, renaming, moving or deleting a tab overrides the Tabs module's `tabs`, and adding or deleting a column, or editing a column's settings, conditions or design, overrides the Row module's `columns`.
-   When the layout module sits inside another layout module, any of these changes overrides the child list of the top-level layout module in the column, as for any nested edit.
-   On a top-level Row module, the layout preset and the column widths are module keys of their own. Picking a layout overrides `layout` and `column_widths`; changing a width (in the fields or with a drag handle in the Studio) overrides `column_widths`, and the Width and Column widths fields show its sync state. Gap between columns and Padding sync like any other module field.
-   Applying or removing an [icon animation](../design/quick-icon-animator.md) overrides the module's `design.animations`. The card stores its own copy of the animation document, as described in [Template animations](#template-animations).
-   Pasting a design onto a module overrides each design key that changed. On a row or column it overrides the whole design.
-   Picking a layout preset for a row overrides its `layout` and `column_widths`. The row then uses the preset, even when the template row has its own widths.
-   Changing a row's column widths (in the Column widths or Width field, with a drag handle in the Studio, or with Add column or Delete column on a row that has its own widths) overrides `column_widths`. The Column widths and Width fields show the sync state; Reset on the Column widths field removes the widths and makes them follow the template again.
-   Editing a row's actions overrides the row's whole `actions`. A row whose actions are all set to None keeps no actions, even when the template row has some.
-   A card's shape and its shape options count as one field: overriding the shape also keeps this card's shape options.
-   Adding, deleting or editing a flow line overrides the card's `flows`.
-   In the outline, a module with overrides shows a dot ("Has local overrides").

The inspector shows per-field sync state on linked cards. See [Inspector](../inspector/README.md).

## Template animations

A template can hold animation documents in `custom_animations`, the ones its modules play with `preset: custom:<id>`. A linked card plays them too. They are merged with the card's own documents by id:

-   A document of the card's own with the same id replaces the template's version of that one on this card. The template's other documents still apply.
-   A document of the card's own with an id the template does not have is added.
-   `hidden_animations` on the card lists template documents this card leaves out, without a replacement.
-   With `custom_animations` in the card's `not_synced`, the card uses only its own documents and none of the template's.

The card config holds only the card's own documents. The editor keeps the template's documents next to it and never writes them into the card.

On a linked card, the card's Design tab has a Template animations section under Animations. It lists every document of the template, by name:

| Tag | Meaning | Button |
| --- | --- | --- |
| From template | The card plays the template's version. | Hide leaves it out on this card. |
| Hidden | Listed in `hidden_animations`. | Show plays it again. |
| Changed on this card | The card has its own document with this id. | Use template removes the card's own document, so the template's version plays again. |

The sync indicator next to the section title keeps the whole list local (`custom_animations` in `not_synced`). The section then says "This card uses only its own custom_animations."

When an [icon animation](../design/quick-icon-animator.md#template-linked-cards) that comes from the template follows the module's new icon, the card stores its own version under the same id, so only that document changes on this card.

## Re-sync

Re-sync clears every override on the card (all `not_synced` lists and `hidden_animations`), then fetches the template again and takes its values. Clearing the overrides is one undo step.

## Save to template

Save to template writes the card's current content to the linked template. The override lists, the template link and the per-card Home Assistant keys are left out, so this card's local values become the template's values. Linked cards on the dashboard reload the template when it changes.

The template's `custom_animations` are saved with this card's own versions and additions. Documents hidden on this card stay in the template. This also holds for a card with `custom_animations` in `not_synced`: its documents are added to the template's and none of the template's are dropped.

After a successful save the card equals the template, so the editor clears its overrides: every `not_synced` list goes and the template bar shows In sync. `hidden_animations` stays, so animations you hid on this card stay hidden. The card's own copies that now match the template are removed from the card, so they show as From template again and follow later changes to the template. A copy whose id is hidden on this card stays. This also holds for a card with `custom_animations` in `not_synced`: its documents are now in the template, so the card drops its copies and the marker.

If saving fails, nothing changes on the card and nothing is shown in the editor. The error is written to the browser console.

## Unlink from template

Unlink from template removes the link (`template`). The card keeps its current content and no longer follows the template. The template animations it played become the card's own `custom_animations`, and `hidden_animations` is removed. There is no confirmation; undo restores the link, and the card shows the template's animations again.

Unlink waits until the template's animations are loaded. If they cannot be loaded, the card stays linked and the error is written to the browser console.

## Adding a row to a linked card

Add row on a linked card asks "Update linked cards?" first. "Only this card" adds the row locally. "Update all linked cards" adds the row and then saves the whole card to the template, as Save to template does. Escape cancels.

Only Add row asks this. Other structural changes (columns, modules) stay local until you use Save to template.

## Who can see a template

Every signed-in user sees a card that is linked to a template, and the card follows changes to the template without a reload. Only administrators can create, change, rename or delete templates.

A card asks Magic Card Utils for the one template it is linked to, and watches that template. Two cards that use the same template share one request. The card never asks for the full template list, so a dashboard that uses two templates costs two requests, however many templates you have saved. What a viewer receives is the card configuration, the card type and the time of the last save. The list of cards that use a template stays visible to administrators only.

### When a template cannot be shown

The card shows its own settings, with one line above them:

-   Template "name" wasn't found. The template was deleted or renamed. A rename does not update linked cards, so link them to the new name.
-   Template "name" couldn't be loaded. Magic Card Utils is missing, still starting, or too old for your user. The card tries again each time the connection to Home Assistant comes back, so a card that opened while Magic Card Utils was still loading fills in after the next reconnect.

Screen readers announce the line once.

### Versions

Viewers who are not administrators need both the Magic Card release and the Magic Card Utils release that add the per-template read commands. With an older Magic Card Utils, an administrator still sees the template (it is read from the full list, once per page, without live updates). Another user gets the second notice. An older Magic Card with the newer Magic Card Utils keeps working for administrators.

## What a template does not hold

The keys Home Assistant keeps for one card on its dashboard are never part of a template: `grid_options`, `layout_options`, `visibility` and `view_layout`. Each linked card keeps its own.

## Limits

-   A row, column or module that you add only on the linked card (with an id the template does not have) is kept and shown after the template's items.
-   A linked card saved with an older editor can hold copies of the template's animations in its own `custom_animations`. They show as Changed on this card and no longer follow the template. Use template removes such a copy.
-   An item that comes from the template and is deleted on the linked card comes back the next time the template is merged. Change the template itself (Save to template) to remove it everywhere.
-   On a linked card, a top-level module from the template that has no `id` cannot start or end a flow line. The editor shows "Give this module an id in the template". See [Flows](../flows/README.md).
