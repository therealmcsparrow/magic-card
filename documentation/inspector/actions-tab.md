# Actions tab

The Actions tab sets what happens when a module or a row is tapped, held or double-tapped. Back to the [inspector overview](README.md).

## Contents

-   [Modules](#modules)
-   [Fields per action](#fields-per-action)
-   [Rows](#rows)

## Modules

The tab has three groups: Tap (`actions.tap_action`), Hold (`actions.hold_action`) and Double tap (`actions.double_tap_action`). Each group has an Action list and the fields that action needs. Clock, custom card, video background and separator modules have no Actions tab.

| UI label (Action) | YAML `action` | What it does |
| --- | --- | --- |
| None | `none` | Nothing (the default). |
| Toggle | `toggle` | Toggles an entity. |
| More info | `more-info` | Opens Home Assistant's more-info dialog of an entity. |
| Navigate | `navigate` | Goes to another dashboard path. |
| Call service | `perform-action` | Calls a Home Assistant action (service). |
| URL | `url` | Opens a web address in a new tab. |
| Assist | `assist` | Opens the Assist dialog. |
| Open pop-up | `popup` | Opens a Magic Card pop-up by its ID. |
| Close pop-up | `close-popup` | Closes the Magic Card pop-up that is open. |

`fire-dom-event` and `haptic` are YAML only. See [Actions](../card/actions.md) for those, and for how taps, holds and double taps are told apart.

## Fields per action

| Action | UI label | YAML key | Type | Default | What it does |
| --- | --- | --- | --- | --- | --- |
| Toggle, More info | Use module entity | `use_module_entity` | `true` / `false` | on | Use the module's own entity. Shown only when the module has an entity. Turning it on clears the action's own entity. |
| Toggle, More info | Entity | `entity` | Entity id | none | The entity to act on. Shown when the module has no entity, or Use module entity is off. |
| Navigate | Navigation path | `navigation_path` | Path | none | For example `/lovelace/lights`. A path of `#<ID>` opens the pop-up with that ID. |
| Open pop-up | Pop-up ID | `hash` | Pop-up ID | none | The ID of the pop-up to open. Suggestions list the pop-up IDs of Magic Cards on the page. A leading `#` is removed. |
| Close pop-up | (none) | | | | Closes the open pop-up, also from a button inside it. |
| URL | URL | `url_path` | URL | none | Only `http` and `https` addresses open. |
| Call service | Service | `service` | `domain.service` | none | The action to call. Type it, or use the search button to browse the actions Home Assistant offers. |
| Call service | Target entity | `data.entity_id` | Entity id | none | The entity the action targets. |
| Call service | Service data | `data` | YAML mapping | none | Extra data for the action, for example `brightness_pct: 50`. The field only takes the value once it is valid YAML. Leave empty to call the action without data. |

With Toggle and Use module entity on, the tab shows which entity it toggles.

An action that misses what it needs does not count: Navigate without a path, URL without an address, Call service without a service, Open pop-up without an ID, or Toggle and More info without an entity. A module whose actions are all like that stays inert, as if it had none.

Example of what the tab writes:

```yaml
actions:
  tap_action:
    action: toggle
  hold_action:
    action: more-info
  double_tap_action:
    action: perform-action
    service: light.turn_on
    data:
      entity_id: light.kitchen
      brightness_pct: 100
```

## Rows

Rows have the same Actions tab as modules: Tap, Hold and Double tap, each with the full Action list and the fields of that action. A row has no entity of its own, so Toggle and More info always ask for an Entity and there is no Use module entity switch. Picking None removes that gesture from the row's `actions`.

The card runs a row's action when you tap the row outside a module with its own action and outside a control, such as a slider, a switch, a button or an embedded card. A tap on a module without actions runs the row's action.

On a card linked to a template, editing a row's actions makes the whole `actions` of that row a local override.

How row taps and the keyboard work is in [Actions](../card/actions.md#row-actions).
