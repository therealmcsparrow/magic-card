# Card entity

A card can name one entity, the device it is for. Modules, rows and columns that have no entity of their own use it. Set it once and every module follows it. To point the same card at another device, change one field.

Existing cards are unchanged. A card without an `entity` key renders as it always did, and a layout shares its entity with the modules inside only when you switch that on.

## Contents

-   [Set the card entity](#set-the-card-entity)
-   [The entity of a module](#the-entity-of-a-module)
-   [Rows, columns and layouts: Share with tiles inside](#rows-columns-and-layouts-share-with-tiles-inside)
-   [Modules that need one kind of device](#modules-that-need-one-kind-of-device)
-   [Actions on an inherited entity](#actions-on-an-inherited-entity)
-   [Templates](#templates)
-   [Keyboard and screen readers](#keyboard-and-screen-readers)
-   [Existing cards](#existing-cards)

The YAML spellings, the template variables and the exact rules are on [YAML and templates](yaml-and-templates.md).

## Set the card entity

Open Card settings, General, and fill in **Card entity**. The field is optional. Under it the editor says how many tiles follow it, for example "3 tiles follow it.", and how many need another kind of device, for example "1 tile needs another device." Clear the field to remove the key.

Typing in the field shows matching entity ids. The card entity is saved when you press Enter or leave the field, and only when it is a real entity id or empty; anything else goes back to the last good value. The Browse window lists the kinds of device your modules need (lights for a Light module, for example) first, and it keeps its size when you pick a row.

```yaml
type: custom:magic-card
entity: light.kitchen
rows:
  - columns:
      - modules:
          - type: icon
            icon: mdi:ceiling-light
          - type: info
            attribute: brightness
```

Both modules show the kitchen light. The card entity also feeds the card's own ring, value background and animations, and the actions of rows.

## The entity of a module

Every module that takes an entity has an **Entity** field in its General tab, with three buttons:

| Button | YAML | What the module does |
| --- | --- | --- |
| Same as card | no `entity` key | Uses the entity from the card, or from the layout around it (the button then reads Same as row or Same as column). |
| Pick one | `entity: sensor.temp` | Uses that entity. |
| No entity | `entity: none` | Has no entity, even when the card has one. |

Under the buttons the editor shows where the entity comes from: "From card: Kitchen light", with the entity id and its state under it. If the entity no longer exists in Home Assistant it says "(not found)".

Pick one starts with the entity the module was following, so overriding it takes one click and one edit. When there is nothing to follow, the key stays out of the YAML until you type an id.

When the card has no entity and no layout shares one, Same as card is greyed out and the field looks as it did before: the entity picker is open under the buttons. A link in the text under the buttons opens Card settings, General, with the Card entity field focused.

An attribute picker under the field lists the attributes of the entity the module uses. When that is not the module's own entity, a line says which one: "Attributes of light.kitchen (card)". The module's `attribute` applies to an inherited entity as well.

The structure outline shows the same thing in one line under each module: an inherited entity in muted text with a link icon ("Same as card · light.kitchen" in the wide outline), and a warning when the entity does not fit the module ("Needs a camera").

## Rows, columns and layouts: Share with tiles inside

Card rows, card columns, the columns of a row module, and the layout modules (horizontal, vertical, row, tabs and slider layout) can hold an entity of their own. Select a row or a column and the General tab starts with the same Entity field as a module, with Same as card, Pick one and No entity. By default it belongs to the layout alone. Turn on **Share with tiles inside** and the modules in it follow that entity before they follow the card. The switch appears once the layout has an entity of its own.

| Layout | Modules inside use |
| --- | --- |
| Entity picked, Share with tiles inside on (`share_entity: true`) | The layout's entity. |
| Entity picked, switch off or no `share_entity` key | The card entity. The layout's entity is only its own. |
| `entity: none` | No entity at all, whatever the card has. A module inside can still pick its own. |
| No entity | The card entity. |

Rows, columns and layouts that you add in the editor start with the switch on, and so does the first card from the card picker. Copies that came from pasting or duplicating keep their YAML as it was, and so do all rows, columns and layouts from before this feature, which means they keep the switch off.

A row or column with an entity of its own and the switch off uses that entity for itself: its design rules, ring, value background, animations, display conditions and its own tap action. With no entity of its own it uses the card entity, as before. A tap on a row with its own entity can toggle any kind of entity, because you picked it for the row; the care described under [Actions](#actions-on-an-inherited-entity) is for entities that come from somewhere else.

Nested layouts: a module follows the nearest row, column or layout that shares an entity, then the card. A sharing layout inside a layout with `entity: none` opens the entity again for its own children.

## Modules that need one kind of device

Some modules only make sense for one kind of device. When the entity they would inherit is another kind, they show nothing, as if their entity were `none`. The dashboard stays quiet. The editor explains it under the buttons in plain words, with two buttons: one that opens the entity window filtered to the right kind (Pick a light, Pick a camera) and one for No entity. While you edit, such a tile also shows a short "Needs another device" note under its content: in the editor preview, and in the dashboard's own edit mode. Normal viewing of the dashboard never shows it.

| Module | Follows an entity of |
| --- | --- |
| Camera | a camera |
| Weather, Forecast | a weather source |
| Light | a light |
| Dropdown | a select, input select, input text, text, climate, fan, light, media player, water heater or humidifier (the kinds it can set) |

The other modules accept any entity. Slider, Spinbox and Graphs follow whatever they are given and fall back to read-only or to history, as they do with an entity of their own.

The Custom card module never follows the card entity. It shows two buttons, Pick one and No entity, and says so.

An entity you pick yourself is never checked this way. The picker already narrows the list.

## Actions on an inherited entity

Tap, hold and double tap actions with `use_module_entity` (the default) act on the entity the module uses. Rows and columns use their own entity, else the card entity (or the nearest sharing row, column or layout), for their own actions.

An entity that comes from the card or a layout is treated with more care than one you picked for the module. A **toggle** on an inherited entity only toggles lights, switches, fans, input booleans, automations and humidifiers. For a lock, a cover, a climate entity or anything else it opens the more-info dialog instead, so a card entity of `lock.front_door` cannot be unlocked by a stray tap on a tile that merely follows it. Pick the entity on the module, or set the action's own entity, to toggle it directly.

Controls that have their own interaction do not change. A Slider that follows a cover still moves the cover, because moving the slider is the control. A Light module follows a light only (see above).

## Templates

Templates in Jinja (text modules, Markdown modules and `template` conditions) can read the entity of their module and the card's entity as `entity` and `card_entity`. See [YAML and templates](yaml-and-templates.md#template-variables).

Magic Card Utils templates, the saved cards you link to, never include the card entity. One template then fits any device, and the card keeps its own entity when you link a template or load one. When the card has no entity yet and the template has modules that would follow one, the Load confirmation asks **Which device is this card for?** Pick a device and the loaded card gets it. Leave the field empty and the card stays without. Setting a module of a linked card back to Same as card removes the entity the template gave it.

## Keyboard and screen readers

The three buttons are a group of toggle buttons, with one tab stop that moves with the arrow keys. The chosen button is bold with an underline, so it does not depend on colour. A greyed-out Same as card looks dimmed with a dashed border. The arrow keys, Home and End move the focus only. Space or Enter presses the focused button, because pressing one writes to the YAML. Pick one does not move the focus into the entity field. When you load a Magic Card Utils template and the confirmation asks for a device, the focus goes to that question. The next Tab stop is the field.

A greyed-out Same as card can still take the focus with the arrow keys, and its explanation is read out when it does.

A status message that is always present announces a change you make ("Now using Kitchen light from the card.", "No entity."). It stays silent when the editor redraws for other reasons.

On touch screens the buttons and the entity field are 44 px high. Long entity ids wrap instead of scrolling the pane sideways.

## Existing cards

-   A card without a card `entity` renders as before, and so does every module.
-   A layout with an `entity` of its own keeps it to itself until you turn on Share with tiles inside. No YAML changes by itself.
-   A text, Markdown or condition template gets `entity` and `card_entity` only when it mentions them, so templates that do not use the names keep their output.
-   `entity: none` had no meaning before, because entity ids always contain a dot. It now means no entity.
