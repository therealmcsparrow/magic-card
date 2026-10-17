# Value syntax

How the card reads lengths, times, colours, entities, templates and ids.

## Contents

-   [Lengths](#lengths)
-   [Numbers and booleans](#numbers-and-booleans)
-   [Times](#times)
-   [Colours](#colours)
-   [Entity colour](#entity-colour)
-   [Images and media](#images-and-media)
-   [Fonts](#fonts)
-   [Entities and attributes](#entities-and-attributes)
-   [Jinja templates](#jinja-templates)
-   [ids](#ids)
-   [Quoting](#quoting)

## Lengths

Most size keys are CSS strings written into the element's style as they are. Any CSS length or function works: `12px`, `1.5rem`, `50%`, `40vh`, `calc(100% - 8px)`, `var(--ha-card-border-radius)`, `clamp(14px, 2vw, 20px)`.

In a `design` block (and under `hover` and in conditional rules) a bare number is a pixel length: `padding: 16` is `16px`, `font_size: 14` is `14px`. Outside `design`, a length needs its unit. Card `padding`, `border_radius` and `card_height`, and row and column `gap` and `padding`, are written into CSS as they are, so `padding: 16` there is not valid CSS. Write `padding: 16px`.

Box keys (`padding`, `margin`, `border_radius`) take the CSS 1 to 4 value shorthand: `8px 16px`, `12px 12px 0 0`. Per-side keys (`padding_top`, `margin_left`, `border_top_left_radius` and so on) override the shorthand.

A few keys take a plain number of pixels:

| Key | Unit |
| --- | --- |
| `ring.width`, `ring.glow` | px |
| Flow `width`, `dot_size`, `glow` | px |
| `slider-layout` `space_between` | px |
| `popup.width`, `max_height`, `backdrop_blur` | a bare number is px; strings are kept |
| `shape_options.corner`, `amplitude` | px; also `16px` or a `%` of the shorter side |
| `value_background.line_width` | px |

## Numbers and booleans

Keys such as `min`, `max`, `step`, `decimals`, `dots`, `intensity` take numbers. Numeric strings (`"100"`) are read as numbers in rings, flows, icon effects and animations.

A `design` value can be a string or a number. A number gets the unit the key needs: `px` for lengths (`padding`, `margin`, `width`, `font_size`, `border_width`, `gap` and the per-side keys), `s` for `transition_duration`, `transition_delay`, `animation_duration` and `animation_delay`, and `%` for `border_length`. Every other key takes the number as it is: `opacity: 0.8`, `font_weight: 600`, `z_index: 2`, `flex_grow: 1`, `line_height: 1.4`. Quoted numbers (`"0.8"`) still work and are written as they are.

Booleans are `true` and `false`. A module toggle that is on for a new module from the editor is also on when the key is missing, for example `show_value` on a bar, `fill` on a graph, `needle` on a gauge, `show_date` on a clock, `show_temperature` and `animated_icons` on a weather module, `pagination` on a slider layout. Set it to `false` to turn it off. Toggles that start off stay off when missing (`show_state` on a button, `show_seconds` on a clock, `show_color` on a light). The `info` module shows name and state when both `show_name` and `show_state` are missing; with only one of them set, the other is off. [Modules](../modules/README.md) lists each module's keys.

## Times

Animation `duration` and `delay`, ring `speed` and `transition`, icon `draw_duration`, and the design keys `transition_duration`, `transition_delay`, `animation_duration` and `animation_delay` take a CSS time: `2s`, `600ms`, `0.5s`. A bare number (`2`) is seconds.

Flow `speed` and `min_speed` are plain seconds (numbers). `popup.auto_close` is seconds. `slider-layout` `autoplay_delay` is milliseconds. `value_background.hours` is hours (default 24, at most 168).

Seasonal `calendar` dates are `MM-DD..MM-DD`, inclusive, for example `12-01..12-26`. A range may run over the year end (`12-31..01-01`), and a single `MM-DD` is one day.

Time conditions take `HH:MM` in 24-hour form and compare against the browser's clock. The card checks them again every minute.

## Colours

Colour keys accept:

| Form | Example |
| --- | --- |
| Hex | `"#ff9800"`, `"#f80"` (quote: `#` starts a YAML comment) |
| Name | `orange`, `transparent`, `currentColor` |
| Functions | `rgb(255 152 0)`, `rgba(0,0,0,.4)`, `hsl(...)`, `oklch(...)`, `color-mix(in srgb, red 40%, transparent)` |
| Theme variable | `var(--primary-color)`, `var(--state-light-on-color, orange)` |
| Entity colour | `entity`, `entity 30%` (see below) |

Theme variables need `var(--name)`. A bare name such as `primary-color` is not a colour.

Ring, flow, animation, icon effect and value background colours are checked before use. They accept the forms above and the math functions (`calc`, `min`, `max`, `clamp`), but no `url()` and no other CSS. An unsafe or unknown value falls back to the default colour. Design colour keys (`color`, `background_color`, `border_color`, `outline_color`) and module colour keys (`icon_color`, `bar_color`, `slider_color` and so on) are passed to CSS as they are, so invalid CSS there simply has no effect.

A gradient in a ring, value background or icon colour is checked stop by stop, and an invalid one is ignored. See [Gradients](../design/gradients.md).

## Entity colour

`entity` is the colour Home Assistant gives the entity in its current state: a light's own colour when it is on, the theme's active or inactive state colour otherwise. `entity 30%` is that colour at 30% opacity.

Where it works:

| Key | Entity used |
| --- | --- |
| Design `color`, `background_color`, `border_color`, `outline_color` (also inside `conditional` rules) | The module's entity |
| Animation `color` | The module's entity |
| Ring `color`, `track_color` | The module's entity |
| Icon effect colours (`colors.primary`, `secondary`, `gradient` stops, `fill.color`, `fill.empty_color`) | The module's entity |
| Flow `color`, `idle_color` | The flow's `entity`, else the entity of the From module |
| Value background `color` | The value background's `entity`, else the module's |

Only some domains have a state colour: `alarm_control_panel`, `alert`, `automation`, `binary_sensor`, `calendar`, `camera`, `climate`, `cover`, `device_tracker`, `fan`, `group`, `humidifier`, `input_boolean`, `lawn_mower`, `light`, `lock`, `media_player`, `person`, `plant`, `remote`, `schedule`, `script`, `siren`, `sun`, `switch`, `timer`, `update`, `vacuum`, `valve`, `water_heater`. A sensor has none, and the value then falls back to the element's text colour.

Rows, columns and the card have no entity: `entity` in their design colours is the text colour. A value background on a row, column or card has its own `entity`, so its `color: entity` works there.

Module keys such as `icon_color` and `bar_color` do not take `entity`. Use `use_entity_color: true` on `icon` and `button` modules instead.

## Images and media

| Key | Accepts |
| --- | --- |
| Card `background_image`, design `background_image` | A CSS image: `url('/local/bg.jpg')`, `linear-gradient(...)`, or a `media-source://` id. A plain path or URL that starts with `/`, `http://`, `https://` or `data:` is wrapped in `url()` for you, so `/local/bg.jpg` works too. |
| `image` module `image`, `video-bg` `url` and `poster` | A URL (`/local/x.jpg`, `https://...`, `/api/image_proxy/...`) or a `media-source://` id |

A `media-source://` id is what the editor's media browser stores. The card resolves it to a signed URL while it renders and keeps it fresh, so the stored value never expires. Relative Home Assistant URLs are made absolute for the companion app and external URLs.

## Fonts

`font_family` takes a CSS font list: `"Open Sans", sans-serif`. When the list names one of the Google Fonts in the editor's font picker, the card loads that font from `fonts.googleapis.com`, once per page, in weights 300, 400, 500 and 700 where the family has them. A `font-family` declaration in a `css` string counts too. Names match in any case.

The fonts it loads: Open Sans, Lato, Montserrat, Oswald, Source Sans Pro, Raleway, PT Sans, Merriweather, Playfair Display, Lora, PT Serif, Noto Sans, Ubuntu, Poppins, Nunito, Inconsolata, Fira Code, Source Code Pro and Dancing Script. Roboto is in the picker too, but it is never fetched, because Home Assistant already ships it. Any other family must be installed on the device or loaded some other way.

Loading a font sends a request to Google from every device that shows the card, and the device needs internet access for it.

## Entities and attributes

`entity` is a full entity id: `light.kitchen`, `sensor.outdoor_temperature`. `attribute` is an attribute name of that entity, such as `brightness` or `current_temperature`. With `attribute` set, modules that support it show or control the attribute instead of the state. Values are formatted the way Home Assistant formats them (units, display precision, translated states).

The card re-renders when one of its entities changes, including entities of nested children, flows, rings and play conditions.

## Jinja templates

Home Assistant renders Jinja on the server. The card subscribes to each template string with `render_template` while something on the card shows it, and drops the subscription when nothing does. Results are cached per template string, so a re-created card shows the last value right away.

Jinja is read in these places only:

| Where | Key | Notes |
| --- | --- | --- |
| `text` module | `text` with `use_template: true` | Only when the text contains `{{`, `{%` or `{#`. Errors show inline as "Template error: ...". Empty while pending. |
| `markdown` module | `content` | Markdown with Jinja. With `entity` set, the variable `entity` holds the entity id (`{{ states(entity) }}`); with `attribute` also set, `attribute_name` holds the attribute. |
| Display conditions, conditional design, conditional appearance | `template` | Met when the result is `true`, `yes`, `on`, `enable` or a non-zero number |
| Flows | `label_template` with `label: template` | Shows nothing until it has a result |

Templates are not read anywhere else: not in design values, icons, labels, entity ids or actions. The card-level `template` key is a Magic Card template name, not Jinja.

The markdown module also fills the old placeholders `{{ state }}`, `{{ attribute }}` and `{{ entity }}` from its entity. With only those placeholders in the content, they are filled in the browser without a server call.

A template condition is not met while its result is pending or when the template fails. Without a websocket connection (editor thumbnails), text and markdown show the raw text.

## ids

| Item | Missing id becomes | Needed when |
| --- | --- | --- |
| Row | `row~<index>` | Template-linked cards (matching) |
| Column | `<row id>~col<index>` | Template-linked cards |
| Module | `<column id>~<index>` | Flows (`from` / `to`), template-linked cards |
| Layout child | `<parent id>~<slot>.<index>` | Flows to a nested module |
| Flow | `<from>><to>` | Never; repeated ids get `~<index>` |
| Animation | `anim-<index>` | Never |
| Condition | none | Never |
| Conditional design rule, appearance rule | none | Editing the rule in the editor |

Derived ids are computed on every load and never written back to your config. They follow the position, so they change when you move a module. For a flow or a template override, give the module its own `id`. Any string works; keep it unique within the card.

The editor writes ids such as `button_m1x2k9_4f2a_3` (type, time, random part, counter) when it adds an item. Duplicating gives the copy and its children new ids. Choosing a module without an id as a flow end in the editor gives it one.

## Quoting

Quote these in YAML:

-   Hex colours: `"#ff9800"`. Without quotes the rest of the line is a comment.
-   States that look like booleans: `state: "on"`, `state: "off"`, `state: "yes"`. YAML-mode dashboards (`ui-lovelace.yaml`) read bare `on` as `true`, and a state condition compares strings.
-   Times: `after: "07:30"`. YAML 1.1 reads bare `07:30` as a number.
-   Layouts: `layout: "1-2"`. Bare `1-2` works, but a bare `1` is a number.
-   Templates that start with `{`: `template: "{{ ... }}"`. A bare `{` starts a YAML map.
-   `off` as a seasonal calendar value: `valentine: "off"`, or write `valentine: false`.
