# Actions

Actions run when you tap, hold or double-tap a module or a row. They live under the `actions` key of that module or row. In the editor they are set in the [Actions tab](../inspector/actions-tab.md). Back to [Card configuration](README.md).

## Contents

-   [Gestures](#gestures)
-   [Action types](#action-types)
-   [Common fields](#common-fields)
-   [Pop-up actions](#pop-up-actions)
-   [Row actions](#row-actions)
-   [Examples](#examples)
-   [Limits](#limits)

## Gestures

```yaml
actions:
  tap_action:
    action: toggle
  hold_action:
    action: more-info
  double_tap_action:
    action: navigate
    navigation_path: /lovelace/lights
```

| Key | Gesture |
| --- | --- |
| `tap_action` | A tap or click. |
| `hold_action` | Press and hold for half a second. |
| `double_tap_action` | Two taps within a quarter of a second. |

-   A module without an action that can run stays inert: it is not a button and takes no keyboard focus. That covers `action: none`, and an action that misses what it needs: `navigate` without `navigation_path`, `url` without `url_path`, `perform-action` without `service`, `popup` without `hash`, or `toggle` and `more-info` without an entity.
-   When a double tap action is set, a single tap waits a quarter of a second for a possible second tap before it runs the tap action. Without one, a tap runs at once.
-   A pointer that moves more than 10 px between press and release counts as a swipe or scroll, so no tap or hold runs. Sliders and swipeable layouts keep working inside a tappable module.
-   With the keyboard, focus the module and press Enter or Space to tap, Shift with Enter or Space to hold, and Ctrl or Cmd with Enter or Space to double-tap.
-   Inside a layout module, a child with actions takes the tap. The layout module's own actions run only for taps on children without actions.
-   Actions do not run on the editor canvas.

## Action types

| `action` | Fields | What it does |
| --- | --- | --- |
| `none` | | Nothing. |
| `toggle` | `entity`, `use_module_entity` | Toggles the entity the way Home Assistant does (groups, locks, covers and valves open and close). |
| `more-info` | `entity`, `use_module_entity` | Opens the more-info dialog of the entity. |
| `navigate` | `navigation_path` | Goes to a path, for example `/lovelace/lights`. A path of `#<id>` opens the Magic Card pop-up with that ID. |
| `url` | `url_path` | Opens the URL in a new tab. Only `http` and `https` URLs open; a relative URL is resolved against the current page. |
| `perform-action` | `service`, `data`, `service_data` | Calls a Home Assistant action. |
| `assist` | | Opens the Assist dialog. |
| `popup` | `hash` | Opens the Magic Card pop-up with this ID. |
| `close-popup` | | Closes the open Magic Card pop-up. |
| `fire-dom-event` | `data` | Fires an `ll-custom` DOM event with `data` as its detail, for tools that listen for it. YAML only. |

### Entity for toggle and more-info

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `entity` | Entity id | none | The entity to act on. |
| `use_module_entity` | `true` / `false` | `true` | With `true` (or unset) the action uses its own `entity` when set, else the module's entity. With `false` it uses only its own `entity`. |

Without any entity, the action does nothing.

### perform-action

| Key | Type | What it does |
| --- | --- | --- |
| `service` | `domain.service`, for example `light.turn_on` | The action to call. |
| `data` | Mapping | Data for the action. Put the target in `data.entity_id`. |
| `service_data` | Mapping | Also sent. Merged after `data`, so its keys win. |

The card reads `service`, not Home Assistant's newer `perform_action` key, and has no separate `target` key. Put the entity in `data`:

```yaml
tap_action:
  action: perform-action
  service: light.turn_on
  data:
    entity_id: light.kitchen
    brightness_pct: 60
```

## Common fields

| Key | Values | What it does |
| --- | --- | --- |
| `haptic` | `success`, `warning`, `failure`, `light`, `medium`, `heavy`, `selection` | Sends a haptic event before the action runs. The Home Assistant companion app turns it into a vibration. YAML only. |

## Pop-up actions

Two actions open a pop-up and one closes it:

```yaml
# Open pop-up action
tap_action:
  action: popup
  hash: kitchen

# Navigate to the pop-up's ID
tap_action:
  action: navigate
  navigation_path: "#kitchen"

# Close whatever pop-up is open (also works from a button inside it)
tap_action:
  action: close-popup
```

`popup` and `navigate` to `#kitchen` both add `#kitchen` to the page URL, so any Magic Card with that pop-up ID opens, and the browser's back button closes it again. A leading `#` in `hash` is removed. Home Assistant's own cards can open a Magic Card pop-up the same way, with a navigate action to `#kitchen`. See [Pop-ups](popups.md).

Quote a navigation path that starts with `#`. Unquoted, YAML reads it as a comment.

## Row actions

A row runs its `actions` like a module, with the same gestures and action types:

```yaml
rows:
  - actions:
      tap_action:
        action: popup
        hash: kitchen
      hold_action:
        action: more-info
        entity: light.kitchen
    columns:
      - modules:
          - type: text
            text: Kitchen
```

-   A tap on a module with its own actions runs only that module's action. A tap on a control inside the row, such as a slider, a switch, a button, an input, a tab or an embedded card, runs only the control.
-   A tap anywhere else in the row runs the row's action, including a tap on a module without actions.
-   A row has no entity of its own. `toggle` and `more-info` need `entity` in the action, or they do nothing and do not count as an action.
-   A row with actions shows a pointer cursor. It takes keyboard focus (Enter or Space, with the same Shift and Ctrl or Cmd keys as modules) only when nothing inside it takes focus itself. A row that holds a module with actions or a control keeps the keyboard on those.
-   The row is not given a button role, so screen readers still read its content.
-   On a card linked to a template, a row's `actions` are synced as a whole. A local edit makes them a local override (`not_synced: [actions]`).

## Examples

A button that toggles its own entity on tap and opens a pop-up on hold:

```yaml
- type: button
  entity: light.living_room
  icon: mdi:sofa-outline
  actions:
    tap_action:
      action: toggle
    hold_action:
      action: popup
      hash: living-room
```

A module that opens the more-info dialog of a different entity:

```yaml
- type: icon
  entity: sensor.outdoor_temperature
  icon: mdi:thermometer
  actions:
    tap_action:
      action: more-info
      entity: weather.home
```

## Limits

-   Modules and rows run actions. Columns and the card itself have no actions.
-   `confirmation` from Home Assistant's action format is not supported: actions run without asking.
