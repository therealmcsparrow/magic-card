# YAML troubleshooting

Common mistakes when writing the config by hand, and what to do about them.

## Contents

-   [The card shows "Invalid configuration"](#the-card-shows-invalid-configuration)
-   [A module shows "Unknown module"](#a-module-shows-unknown-module)
-   [A design value has no effect](#a-design-value-has-no-effect)
-   [A colour does not show](#a-colour-does-not-show)
-   [Part of a line disappears](#part-of-a-line-disappears)
-   [On, off, yes and no turn into true and false](#on-off-yes-and-no-turn-into-true-and-false)
-   [A time condition never matches](#a-time-condition-never-matches)
-   [A condition is always met](#a-condition-is-always-met)
-   [A conditional rule never applies](#a-conditional-rule-never-applies)
-   [A module shows more or less than expected](#a-module-shows-more-or-less-than-expected)
-   [An action does nothing](#an-action-does-nothing)
-   [A flow line is not drawn](#a-flow-line-is-not-drawn)
-   [A template shows nothing or the raw text](#a-template-shows-nothing-or-the-raw-text)
-   [A background image does not show](#a-background-image-does-not-show)
-   [A font does not load](#a-font-does-not-load)
-   [A shape, value background or seasonal scene does not show](#a-shape-value-background-or-seasonal-scene-does-not-show)
-   [A change on a template-linked card is undone](#a-change-on-a-template-linked-card-is-undone)
-   [Comments and anchors are gone](#comments-and-anchors-are-gone)
-   [A key from another card does nothing](#a-key-from-another-card-does-nothing)

## The card shows "Invalid configuration"

The structure is wrong. The message names the place (rows and columns count from 0):

| Message | Fix |
| --- | --- |
| Config must have a rows array | Add `rows:` with a list (`rows: []` is allowed). Check that `rows` is not indented under another key. |
| Row 0 must have a columns array | Every row needs `columns:` with a list |
| Row 0, Column 1 must have a modules array | Every column needs `modules:` with a list |

A common cause is a missing dash: `columns:` followed by `modules:` without `- ` makes the column a map instead of a list item.

```yaml
# wrong
columns:
  modules:
    - type: text
# right
columns:
  - modules:
      - type: text
```

## A module shows "Unknown module"

The `type` is missing or misspelled. Types are lower case with dashes: `slider-layout`, `video-bg`, `custom-card`. The full list is in [Shared module keys](schema.md#shared-module-keys). The rest of the card keeps working.

## A design value has no effect

-   It is a length outside `design`. In a design a bare number is px, but card `padding`, `border_radius` and `card_height` and row and column `gap` and `padding` need a unit: write `16px`.
-   The key name uses dashes. Design keys use underscores: `border_radius`, not `border-radius`.
-   A per-side key overrides it. `padding_top` beats `padding` for the top side.
-   A conditional design rule matches and sets the same key.
-   A `hover` value sets the same key while the pointer is over the element.
-   It is `border_radius` on an element with a `shape`. The shape wins.

## A colour does not show

-   A theme colour needs `var()`: `var(--primary-color)`, not `primary-color`.
-   `entity` only works in colour fields of a module with an entity in a coloured domain (light, switch, climate and others). A sensor has no state colour. On rows, columns and the card, `entity` is the text colour. See [Entity colour](value-syntax.md#entity-colour).
-   `background` is a plain CSS property. `entity` is read in `background_color`.
-   Module keys like `icon_color` and `bar_color` do not take `entity`. Use `use_entity_color: true` on icon and button modules.
-   Ring, flow, animation and icon colours reject anything that is not a colour (`url()`, a typo). The default colour is used instead.

## Part of a line disappears

`#` after a space starts a YAML comment. `box_shadow: 0 0 4px #000` stores `0 0 4px`. Quote values with `#`: `"0 0 4px #000"`, `color: "#ff9800"`.

## On, off, yes and no turn into true and false

In YAML-mode dashboards (`ui-lovelace.yaml`) Home Assistant reads bare `on`, `off`, `yes` and `no` as booleans. A state condition then compares the state `on` with `true` and never matches. Quote them: `state: "on"`. Quoting also does no harm in storage-mode dashboards.

## A time condition never matches

-   Quote times: `after: "07:30"`. Unquoted, some YAML readers turn `07:30` into a number.
-   `after` must be earlier in the day than `before`. A window across midnight needs two conditions and `mode: any`:

    ```yaml
    display:
      mode: any
      conditions:
        - type: time
          after: "22:00"
        - type: time
          before: "06:00"
    ```

-   The browser's clock is used, not the server's.

## A condition is always met

-   A `state` or `attribute` condition without `entity` (or `attribute`) counts as met. Display conditions do not use the module's entity. Only conditional design rules do.
-   `above` and `below` are ignored when `state` or `state_not` is set.
-   A state that is not a number (`unavailable`, `unknown`) passes `above` and `below`. Add `state_not: unavailable` as a separate condition.
-   An unknown `type` counts as met. Types are `state`, `attribute`, `time`, `template`.
-   An empty `template` counts as met.

These rules are for display conditions. Conditional design rules and conditional appearance rules treat an incomplete condition the other way round (see below).

## A conditional rule never applies

A conditional design rule or a conditional appearance rule changes nothing while it has no conditions, or while one of its conditions is not filled in:

-   A `state` condition without `entity`. On a module the module's entity fills it in, but rows, columns and the card have none, so name the entity there.
-   An `attribute` condition without `entity` or `attribute`.
-   A `template` condition with an empty `template`.
-   A `time` condition with neither `after` nor `before`.

## A module shows more or less than expected

A module toggle that is on for a new module from the editor is also on when the key is missing, so hand-written YAML shows the same as a module added in the editor. Set a toggle to `false` to hide that part:

| Module | On when missing |
| --- | --- |
| `bar` | `show_value` |
| `slider` | `show_value` |
| `camera` | `show_controls` |
| `graphs` | `fill`, `show_labels` |
| `gauge` | `needle`, `show_name` |
| `clock` | `show_date` |
| `light` | `show_brightness` |
| `weather` | `show_temperature`, `show_condition`, `animated_icons` |
| `forecast` | `show_temperature`, `show_precipitation`, `animated_icons` |
| `slider-layout` | `pagination`, `navigation` |

Toggles that start off stay off when missing: `button` `show_state`, `clock` `show_seconds`, `light` `show_color_temp`, `show_color` and `show_effect`, `graphs` `show_points`, `weather` `show_forecast`, `forecast` `show_wind`.

The `info` module shows name and state when both `show_name` and `show_state` are missing. With only one of them set, the other is off, as in older configs. Set both, or neither.

Each module's keys are in [Modules](../modules/README.md).

## An action does nothing

-   Actions are read from `actions:` on a module or row: `actions: { tap_action: { action: toggle } }`. A `tap_action` directly on the module is ignored.
-   Columns do not run actions. Put them on the row, on a module, or wrap the modules in a `horizontal` or `vertical` layout with actions.
-   A row action only runs on a tap outside modules that have their own action or control. Tapping a button or slider in the row runs that module instead.
-   `toggle` and `more-info` need an entity: the action's `entity` or the module's. A row has no entity, so give its action one.
-   An action that misses what it needs is skipped: `navigate` without `navigation_path`, `url` without `url_path`, `perform-action` without `service`, `popup` without `hash`.
-   `perform-action` takes `service: domain.service` and `data`. There is no `target` or `perform_action` key; put `entity_id` in `data`.
-   `url` opens only `http` and `https` URLs.
-   `popup` needs `hash` with the exact pop-up ID (case-sensitive), and the pop-up card must be on the open dashboard.
-   Actions do not fire on the studio canvas.

## A flow line is not drawn

-   `from` and `to` must be module ids. Give both modules an `id`; derived ids change when modules move.
-   Both modules must be visible. A module hidden by display conditions, or on a tab that is not open, has no line.
-   `from` and `to` must differ.
-   `show_when: flowing` hides the line while the value is at or below `min`.
-   With an entity whose state is not a number, the line idles.

## A template shows nothing or the raw text

-   `text` modules need `use_template: true`. Without it the text is shown as written.
-   A template error shows as "Template error: ..." in the text or markdown module. Test the template in Developer tools, Template.
-   Jinja is only read in text, markdown, template conditions and flow labels. Design values, labels and icons are not templated.
-   Editor thumbnails have no connection and show the raw text. The dashboard and the editor preview render it.

## A background image does not show

-   A path or URL that starts with `/`, `http://`, `https://` or `data:` is wrapped in `url()` for you. A relative path such as `local/bg.jpg` is not: start it with `/`, or write `url('...')`.
-   A `media-source://` id from the media browser works as it is. It shows once the card has resolved it.

## A font does not load

-   Only the Google Fonts offered in the editor's font picker are loaded. See [Fonts](value-syntax.md#fonts). Other families must be installed on the device.
-   The name must match the picker's spelling, apart from case: `Open Sans`, not `OpenSans`.
-   The device needs internet access to reach `fonts.googleapis.com`.

## A shape, value background or seasonal scene does not show

-   `shape` must be one of `squircle`, `pill`, `circle`, `hexagon`, `octagon`, `notch`, `ticket`, `wave` or `blob`. On the card it is `shape`, elsewhere `design.shape`.
-   A value background needs `type: fill` or `type: sparkline`. On the card, a row or a column it also needs its own `entity`.
-   A sparkline draws nothing until the entity has recorded history.
-   A seasonal scene is hidden while its `entity` is `off`. The `weather` scene needs `weather_entity`, and `daynight` draws nothing by day.
-   With `seasonal: auto`, the scene follows the date: check the [calendar](schema.md#seasonal-scenes) and `hemisphere`.
-   A card with `seasonal: auto` has empty space at its edges in months with no decoration. That room is kept on purpose so the layout does not move when a holiday starts. See [Seasonal scenes](schema.md#seasonal-scenes) for how to keep less.
-   With reduced motion turned on, scenes and animated shapes are still pictures.

## A change on a template-linked card is undone

The card takes the template's values on every load, except for the paths in `not_synced`. Add the key you changed to the `not_synced` list of the card, row, column or module. See [Template link](schema.md#template-link). Editing in Form mode does this for you.

Animations work differently: a linked card's `custom_animations` are merged with the template's by id, so a document of the card's own with the same id wins without a `not_synced` entry. To drop a template animation on one card, list its id in `hidden_animations`. See [Template animations](../editor/templates.md#template-animations).

## Comments and anchors are gone

Home Assistant stores the config as data. YAML comments, anchors and formatting are not kept. Keep a commented copy elsewhere if you need one.

## A key from another card does nothing

Magic Card has its own keys. Common mix-ups:

| Written | Use |
| --- | --- |
| `cards:` | `rows` → `columns` → `modules` |
| `tap_action:` on the module | `actions: { tap_action: ... }` |
| `name:` on a module to set its label | `label` (button), or `show_name` (info) |
| `styles:` / `style:` | `design:` with underscore keys, `design.css`, or the card's `css` |
| `perform_action:`, `target:` | `action: perform-action`, `service:`, `data:` |
| `color: primary-color` | `color: var(--primary-color)` |
