# YAML mode in the editor

How the editor applies, checks and keeps YAML. The Form / YAML switch itself is described in [Form and YAML](../editor/form-and-yaml.md).

## Contents

-   [Two places to edit YAML](#two-places-to-edit-yaml)
-   [How an edit is applied](#how-an-edit-is-applied)
-   [Validation and errors](#validation-and-errors)
-   [What the editor changes](#what-the-editor-changes)
-   [Round trips with Form mode](#round-trips-with-form-mode)
-   [Template-linked cards](#template-linked-cards)
-   [Legacy keys](#legacy-keys)

## Two places to edit YAML

-   The editor's own YAML mode, in the pane and in the studio. It uses Home Assistant's YAML editor.
-   Home Assistant's code editor in the card dialog (Show code editor). Home Assistant passes the result to the card and the editor as a new config.

Both edit the same config and both follow the rules below. The editor's YAML mode adds undo and redo and keeps the template bar in view.

## How an edit is applied

-   The YAML text is loaded when YAML mode opens. `type`, `name` and `template` come first, then the rest in stored order.
-   Every change that parses as YAML is applied at once and becomes one undo step. The undo history holds 50 steps.
-   The preview updates about 200 ms after you stop typing.
-   `type` is locked. Whatever you type, the card keeps `type: custom:magic-card`.
-   Undo and redo change the config, but the open YAML text is not reloaded. Switch to Form and back to see the result.

## Validation and errors

| Problem | What happens |
| --- | --- |
| The text is not valid YAML (bad indentation, an unclosed quote) | Not applied. Home Assistant's YAML editor shows the parse error. The card keeps the last valid config. |
| The editor is emptied | Applied as a config with no `rows`. The preview shows "Invalid configuration: Config must have a rows array". Undo, or type the config again. |
| `rows` is not a list | "Invalid configuration: Config must have a rows array" |
| A row has no `columns` list | "Invalid configuration: Row 0 must have a columns array" (rows and columns count from 0) |
| A column has no `modules` list | "Invalid configuration: Row 0, Column 1 must have a modules array" |
| A module has no `type`, or an unknown one | Not fatal. The module shows "Unknown module: ..." in its place and the rest of the card renders. |
| A module is missing something it needs (an entity, text) | Not fatal. The module shows a hint in the studio canvas, or an error in its own place when its options are invalid. |
| An unknown key | Kept and ignored |
| A number in a design key | Not an error. Lengths get `px`, design times `s`, `border_length` `%`; other keys take the number as it is. See [Numbers and booleans](value-syntax.md#numbers-and-booleans). |
| A value of the wrong type (a word where a list is expected, an unknown `shape`) | Ignored or replaced by the default. No error is shown. |

The "Invalid configuration" errors come from the card. Home Assistant shows them in place of the card in the preview and on the dashboard. The editor still holds the config, so you can fix it in YAML mode.

## What the editor changes

When you apply YAML, the editor stores it as it is. It does not:

-   add ids to rows, columns or modules (the card derives missing ids in memory only; see [ids](value-syntax.md#ids));
-   fill in default values;
-   remove unknown keys or Home Assistant's keys (`grid_options`, `visibility` and so on);
-   reorder lists.

YAML is stored as data, not as text. Comments, blank lines, anchors, key order inside maps and your quoting style are lost when the config is saved. Anchors and `<<` merge keys work while you type: they are expanded into plain values.

The editor does change the config when you use Form mode:

-   Adding a module writes its type's default keys and an id.
-   Duplicating gives the copy and its nested children new ids.
-   Choosing a module without an id as a flow end gives it one.
-   Deleting a module removes the flows connected to it.
-   Picking a layout preset for a row removes its `column_widths`.
-   Adding a column to a row with `column_widths` gives the new column `1fr`. Without `column_widths`, the row gets an equal layout. Removing a column drops its width, and a row left with one column loses `column_widths`.
-   Editing the animation list removes the [legacy animation keys](#legacy-keys).
-   On a template-linked card, a field you change in Form mode is added to `not_synced`. Changing column widths or the layout preset of a row marks `column_widths` and `layout` on that row.

## Round trips with Form mode

You can switch between Form and YAML at any time. Form mode reads the config you wrote. Keys that have no field in Form mode stay in the config untouched, for example `fire-dom-event` data or `layout_options`.

These keys have fields in Form mode: the card's `css` (Custom CSS in the card's Design tab), `hover` (the Hover section of the card's Design tab), `design.hover` (Hover under "Editing design for"), row `actions` (the row's Actions tab) and `column_widths` (width fields and drag handles between columns). The Shape, Value background and Seasonal sections edit `shape`, `value_background` and `seasonal`. The Seasonal section's Preview date is never saved.

Form mode needs `id` values only for conditional design rules and conditional appearance rules: give each rule a unique `id` if you want to edit it there.

## Template-linked cards

A card with `template:` shows the merged config in YAML mode: the template's content plus this card's overrides. On every load the card takes the template again and keeps only the paths listed in `not_synced`.

YAML mode does not add `not_synced` entries. If you change a template value in YAML, add its path to the matching `not_synced` list, or the template's value returns. Paths are listed in [Template link](schema.md#template-link). Form mode adds them for you.

`custom_animations` is the exception. YAML mode shows only the card's own documents; the template's are merged in by id when the card renders. A document you add with the id of a template document replaces that one on this card, and `hidden_animations` leaves template documents out. Copy YAML with Embed my animations on also finds the template's documents. See [Template animations](../editor/templates.md#template-animations).

## Legacy keys

Older configs keep working without changes:

| Old form | Now |
| --- | --- |
| `design.animation_preset` and the other `animation_*` keys | Read as one `animations` entry. Removed when the animation list is edited in Form mode. |
| Colour ranges with `to` | `to` still caps that range |
| Markdown `{{ state }}`, `{{ attribute }}`, `{{ entity }}` | Still filled from the module's entity |
| Clock `date_format: full` | Read as `long` |
| `info` module with only one of `show_name` / `show_state` set | The other one is off, as before. With neither set, both are on. |
| Module toggles missing from older hand-written YAML (`show_value`, `animated_icons`, `needle` and so on) | Now read as on, the same as a new module from the editor. Set a toggle to `false` to keep that part hidden. |
| Design values quoted as strings (`opacity: "0.8"`) | Still work. Plain numbers work too. |
