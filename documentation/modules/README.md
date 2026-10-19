# Modules

A module is one piece of a card: a text, an icon, a slider, a graph, a layout that holds other modules. Modules sit in the columns of a row (see [Card, rows and columns](../card/README.md)), or inside a layout module. This folder has one page per module type.

## Contents

-   [All modules](#all-modules)
-   [Shared keys](#shared-keys)
-   [Editor tabs](#editor-tabs)
-   [Adding a module](#adding-a-module)
-   [Templates](#templates)
-   [Hints and errors while editing](#hints-and-errors-while-editing)

## All modules

The name is how the module is listed in the Add module picker. The `type` is the YAML key.

### [Content](content/README.md)

| Module | `type` | What it does |
| --- | --- | --- |
| [Text](content/text.md) | `text` | Static text, a Jinja template, or an entity's state or name |
| [Icon](content/icon.md) | `icon` | An icon, optionally the entity's icon and state colour |
| [Info](content/info.md) | `info` | An entity's name, state and one secondary attribute |
| [Image](content/image.md) | `image` | An image from a URL, the media browser or an entity |
| [Markdown](content/markdown.md) | `markdown` | Markdown with Home Assistant templates |
| [Bar](content/bar.md) | `bar` | A progress bar for a numeric value |
| [Graph](content/graphs.md) | `graphs` | A history line graph |
| [Camera](content/camera.md) | `camera` | A live camera stream or a refreshed snapshot |

### [Controls](controls/README.md)

| Module | `type` | What it does |
| --- | --- | --- |
| [Button](controls/button.md) | `button` | A button with icon, label and optional state; runs its actions |
| [Slider](controls/slider.md) | `slider` | Sets a numeric value: brightness, position, volume, temperature and more |
| [Spinbox](controls/spinbox.md) | `spinbox` | Minus and plus buttons for a numeric value |
| [Dropdown](controls/dropdown.md) | `dropdown` | Picks an option: a select entity, an HVAC mode, a source, an effect |
| [Light](controls/light.md) | `light` | A light with toggle, brightness, colour temperature, colour and effects |
| [Gauge](controls/gauge.md) | `gauge` | An arc gauge for a numeric value (display only) |

### [Layout](layout/README.md)

| Module | `type` | What it does |
| --- | --- | --- |
| [Horizontal](layout/horizontal.md) | `horizontal` | Children side by side |
| [Vertical](layout/vertical.md) | `vertical` | Children stacked |
| [Row](layout/row.md) | `row` | A grid of columns inside a column |
| [Tabs](layout/tabs.md) | `tabs` | Tabbed groups of children |
| [Separator](layout/separator.md) | `separator` | A divider line |
| [Slider layout](layout/slider-layout.md) | `slider-layout` | A swipeable carousel, one child per slide |

### [Advanced](advanced/README.md)

| Module | `type` | What it does |
| --- | --- | --- |
| [Clock](advanced/clock.md) | `clock` | The current time and date |
| [Weather](advanced/weather.md) | `weather` | Current weather of a weather entity, optionally with a short forecast |
| [Forecast](advanced/forecast.md) | `forecast` | A daily, hourly or twice-daily forecast |
| [Video background](advanced/video-bg.md) | `video-bg` | A video playing behind the other modules of its container |
| [Custom card](advanced/custom-card.md) | `custom-card` | Any other Lovelace card, built in or custom |

## Shared keys

Every module is a YAML mapping with these keys. The module pages only list the keys specific to that module.

| Key | Type | Meaning |
| --- | --- | --- |
| `type` | string | The module type, from the tables above. Required. |
| `id` | string | Identifies the module. The editor writes a generated id. Without one, the card derives an id from the module's position. Flow lines refer to modules by id, so give a module a fixed id when a flow starts or ends there (see [Flow lines](../flows/README.md)). |
| `entity` | entity id, or `none` | The module's entity. Most modules read their value from it. Modules that do not use it still pass it to the design (entity colours, animation triggers, rings) and to actions. Without the key the module follows the card's `entity`, or the layout around it when that layout has `share_entity: true`. `none` gives the module no entity. See [Card entity](../card-entity/README.md). |
| `share_entity` | `true` / `false` | Layout modules only (horizontal, vertical, row, tabs, slider layout). The layout's own `entity` also applies to the modules inside it. Default `false`. |
| `attribute` | string | An attribute of the entity to use instead of its state, where the module supports it. |
| `design` | mapping | Spacing, borders, typography, background, animations, ring, shape, value background, hover styles and custom CSS. See [Design](../design/README.md). |
| `actions` | mapping | `tap_action`, `hold_action` and `double_tap_action`. See [Card, rows and columns](../card/README.md) and the [Inspector](../inspector/README.md). |
| `display` | mapping | Display conditions: `conditions` (a list) and `mode` (`every` or `any`). While the conditions do not match, the module is hidden. See [Card, rows and columns](../card/README.md). |
| `not_synced` | list | On a card linked to a template: the keys of this module that keep their local value instead of following the template. The editor maintains it. See [Pane editor](../editor/README.md). |

Modules that draw an icon (icon, info, button, light, tabs, weather, forecast) also take `icon_fx`, `icon_on`, `icon_off` and `svg`. These are described in [Icon effects](../icon-effects/README.md).

Every module can also take a shape and a value background in its design:

-   `design.shape` (with `design.shape_options`) gives the module an outline such as a squircle, hexagon, wave or ticket. It wins over `border_radius`.
-   `design.value_background` draws a fill level or a history sparkline behind the module's content. Without its own `entity` it uses the module's entity.

Both are set in the Design tab and described in [Design](../design/README.md).

Notes on actions:

-   A module only reacts to taps when it has at least one action other than `none`. A module without actions is inert, and a tap on it does not reach the layout or row around it.
-   A hold is a press of 500 ms.
-   The interactive parts of control modules (slider track, spinbox buttons, dropdown, light controls, tab buttons, slider-layout arrows) do not trigger the module's own actions.
-   Actions written in YAML work on every module, including the four that have no Actions tab in the editor (separator, clock, video background, custom card).

```yaml
- type: info
  id: living-temp
  entity: sensor.living_room_temperature
  design:
    padding: 8px
  actions:
    tap_action:
      action: more-info
  display:
    mode: every
    conditions:
      - id: c1
        type: state
        entity: input_boolean.show_climate
        state: "on"
```

## Editor tabs

When a module is selected, the [Inspector](../inspector/README.md) shows these tabs:

| Tab | Shown for | Contains |
| --- | --- | --- |
| General | All modules | The module's own options (the tables on each module page) |
| Actions | All modules except separator, clock, video background and custom card | Tap, hold and double tap |
| Conditions | All modules | Display conditions |
| Design | All modules | The design panel |

Fields in the General tab use the shared pickers: an entity picker (filtered to one domain for the camera, light, weather and forecast modules), an attribute picker that lists the attributes of the chosen entity, an icon picker (on the Icon, Info, Button and Light modules it also has an Animated icons tab, see [Animated icons in the icon picker](../animation-studio/using-in-cards.md#animated-icons-in-the-icon-picker)), a colour field, a unit field (a number with `px`, `em`, `rem`, `%`, `vw` or `vh`, or a custom CSS value; clearing it removes the key, so the default applies), and a media field with a browse button for Home Assistant's media browser.

## Adding a module

Add module opens a picker:

-   A search field (Search modules) matches the module name, its description and its `type`.
-   A segmented filter shows All, Content, Controls, Layout or Advanced.
-   Each entry shows the module's icon, name and description. Click one to add it.

A new module starts with the defaults listed on its page under "New module". These are sometimes different from what applies when a key is missing from YAML. The option tables give the value that applies when the key is not set. Most on/off options that show a part of the module (Show value, Fill, Show labels, Show needle, Pagination and similar) are on when the key is missing. Set one to `false` to turn it off.

Layout modules have their own list of children in their General tab, with a type select and an Add button. See [Layout](layout/README.md). The [studio](../studio/README.md) can also place modules on its canvas.

## Templates

Two modules render Home Assistant (Jinja) templates:

-   [Text](content/text.md) with Use template on.
-   [Markdown](content/markdown.md), always.

Text is treated as a template when it contains `{{`, `{%` or `{#`. Home Assistant renders it and the card updates when the result changes. Other modules do not render templates in their fields. Display conditions have a template condition type, see [Card, rows and columns](../card/README.md).

## Hints and errors while editing

-   An unfinished module shows a hint in its place while you edit, for example "Entity is required" or "Text content is required". On the dashboard it renders as it is.
-   A contradictory option shows an error in place of that module, for example "Min must be less than max". The rest of the card keeps rendering.
-   An unknown `type` shows "Unknown module: ..." in place of the module.
