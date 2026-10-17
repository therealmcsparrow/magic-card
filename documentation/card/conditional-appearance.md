# Conditional appearance

Conditional appearance changes card fields, like the background or the theme, while conditions are met. It works on the card only; rows, columns and modules use conditional design rules instead (see [Design](../design/README.md)). In the editor it is the first section of the card's [Conditions tab](../inspector/conditions-tab.md#conditional-appearance-card-only). Back to [Card configuration](README.md).

## Rule keys

`conditional_appearance` is a list of rules:

| Key | Type / values | Default | What it does |
| --- | --- | --- | --- |
| `id` | Text | | Identifies the rule. Written by the editor. |
| `name` | Text | `Rule N` in the editor | A name for the rule. |
| `conditions` | List of conditions | none | When the rule applies. Same condition types as [Display conditions](display-conditions.md). A rule without conditions never applies. |
| `mode` | `every`, `any` | `every` | All conditions or any one. |
| `overrides` | Mapping | none | The card fields to change. |

## Override keys

| Key under `overrides` | What it replaces |
| --- | --- |
| `background` | `background` |
| `background_image` | `background_image` |
| `border_radius` | `border_radius` |
| `padding` | `padding` |
| `box_shadow` | `box_shadow` |
| `card_height` | `card_height` |
| `ring` | The whole ring. `{}` turns the Default ring off while the rule matches. |
| `shape`, `shape_options` | The shape and its options. `shape: none` turns the Default shape off. |
| `value_background` | The whole value background. `{ type: none }` turns it off. |
| `seasonal` | The seasonal scene. `none` turns it off. |
| `use_page_theme` | `use_page_theme`. Set `false` to switch to a card theme. |
| `theme` | `theme`. Only used together with `use_page_theme: false` (in the rule or on the card). |

Values have the same format as the card keys in [Card options](card-options.md). Empty values are ignored, so a field you leave out keeps the card's own setting.

A rule replaces each key as a whole, so a rule's `ring` replaces the whole Default ring. Animations and custom CSS cannot be set by a rule. The card's hover design still applies on top of every matching rule.

## Order

A rule applies only when it has at least one condition, every condition is complete and they match. A condition is complete with an `entity` (State), an `entity` and an `attribute` (Attribute), `after` or `before` (Time), or a `template` (Template). This differs from display conditions, where an empty condition is met.

Rules are checked from first to last. Every matching rule applies its overrides on top of the previous ones, so a later rule wins for a field both set. Rules are also applied in the editor preview.

## Example

The card turns red and switches theme while the alarm is triggered, and gets a dimmer background at night:

```yaml
background: var(--ha-card-background)
conditional_appearance:
  - id: appr-night
    name: Night
    conditions:
      - type: state
        entity: sun.sun
        state: below_horizon
    overrides:
      background: rgba(10, 10, 20, 0.9)
  - id: appr-alarm
    name: Alarm
    mode: any
    conditions:
      - type: state
        entity: alarm_control_panel.home
        state: triggered
      - type: state
        entity: binary_sensor.smoke
        state: "on"
    overrides:
      background: "#b71c1c"
      box_shadow: 0 0 24px rgba(255, 0, 0, 0.6)
      use_page_theme: false
      theme: Alarm
```

When both rules match, the Alarm background wins because it comes later.
