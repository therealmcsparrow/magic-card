# Display conditions

Display conditions show or hide the card, a row, a column or a module. They live under the `display` key of that item. In the editor they are set in the [Conditions tab](../inspector/conditions-tab.md). Back to [Card configuration](README.md).

## Contents

-   [The display key](#the-display-key)
-   [State](#state)
-   [Attribute](#attribute)
-   [Time](#time)
-   [Template](#template)
-   [Where conditions are used](#where-conditions-are-used)

## The display key

```yaml
display:
  mode: every
  conditions:
    - type: state
      entity: person.me
      state: home
    - type: time
      after: "07:00"
      before: "23:00"
```

| Key | Values | Default | What it does |
| --- | --- | --- | --- |
| `mode` | `every`, `any` | `every` | `every`: all conditions must be met. `any`: one is enough. |
| `conditions` | List | none | The conditions. An empty or missing list means always shown. |

Every condition has these keys:

| Key | Values | What it does |
| --- | --- | --- |
| `type` | `state`, `attribute`, `time`, `template` | The kind of condition. |
| `id` | Text | Written by the editor. Optional in YAML. |

A hidden item is left out of the card; a hidden card renders nothing. On the editor canvas hidden items stay visible and are marked as hidden.

## State

Compares an entity's state.

| Key | Type | What it does |
| --- | --- | --- |
| `entity` | Entity id | The entity to check. |
| `state` | Text | Met when the state is exactly this value. |
| `state_not` | Text | Met when the state is anything but this value. |
| `above` | Number | Met when the numeric state is above this value. YAML only. |
| `below` | Number | Met when the numeric state is below this value. YAML only. |

-   The comparison is exact and case-sensitive. Use the raw state (`on`, `home`, `heat`), not the translated text.
-   Only one test is used, in this order: `state` when set, else `state_not` when set, else `above` and `below`. `above` and `below` can be combined for a range, and both are exclusive.
-   `above` and `below` only apply when the state is a number. For a non-numeric state they are skipped and the condition is met.
-   Without an `entity` the condition is met (not configured yet). An entity that does not exist does not meet it.
-   With an entity but no test, the condition is met when the entity exists.

```yaml
- type: state
  entity: sensor.power
  above: 100
  below: 2000
```

## Attribute

Compares an attribute of an entity. Keys are as for State, plus:

| Key | Type | What it does |
| --- | --- | --- |
| `attribute` | Attribute name | The attribute to check, for example `brightness`. |

The attribute value is compared as text, so `state: "255"` matches a brightness of 255. Without `entity` or `attribute` the condition is met. A missing attribute counts as an empty value.

```yaml
- type: attribute
  entity: climate.living_room
  attribute: hvac_action
  state: heating
```

## Time

| Key | Format | What it does |
| --- | --- | --- |
| `after` | `HH:MM` | Met from this time on. |
| `before` | `HH:MM` | Met until this time (not including it). |

-   The time is the browser's local time.
-   The card checks time conditions again every minute, on the minute.
-   `after` and `before` must both hold, so a range cannot cross midnight. For a night range, use two conditions with `mode: any`: one with `after: "22:00"`, one with `before: "06:00"`.
-   Quote the times in YAML (`"07:00"`).

## Template

| Key | Type | What it does |
| --- | --- | --- |
| `template` | Jinja template | Met while the template renders true. |

The template is rendered by Home Assistant and updates live. A result counts as true when it is `true`, `yes`, `on`, `enable` (any case) or a non-zero number. Anything else, an error, or no result yet counts as false. An empty template is met.

```yaml
- type: template
  template: "{{ is_state('sun.sun', 'below_horizon') and states('sensor.lux') | float(0) < 50 }}"
```

## Where conditions are used

The same condition list, with `mode` and `conditions`, is used in several places:

| Where | Key | Effect |
| --- | --- | --- |
| Card, row, column, module | `display` | Show or hide the item. |
| Card | `conditional_appearance[].conditions` | Apply an appearance rule. See [Conditional appearance](conditional-appearance.md). |
| Row, column, module design | `design.conditional[].conditions` | Apply a design rule. See [Design](../design/README.md). |

Appearance and design rules are stricter than `display`. A rule applies only when it has at least one condition and every condition is complete (an entity, an attribute, a time bound or a template, depending on the type). A condition that is still empty is met in `display`, but keeps a rule from applying.

Animation and ring play conditions use their own simpler options. See [Design](../design/README.md).
