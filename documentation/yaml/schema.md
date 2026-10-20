# Config schema

The whole Magic Card config as one annotated tree, then a table per level. Per-module options are listed in [Modules](../modules/README.md). Design keys are covered group by group in [Design](../design/README.md).

## Contents

-   [Annotated skeleton](#annotated-skeleton)
-   [Card](#card)
-   [Rows](#rows)
-   [Columns](#columns)
-   [Shared module keys](#shared-module-keys)
-   [Layers](#layers)
-   [Layout modules and their children](#layout-modules-and-their-children)
    -   [Row module columns](#row-module-columns)
-   [Slider look keys](#slider-look-keys)
-   [Design](#design)
-   [Actions](#actions)
-   [Display conditions](#display-conditions)
-   [Conditional design rules](#conditional-design-rules)
-   [Conditional appearance](#conditional-appearance)
-   [Animations](#animations)
-   [Ring](#ring)
-   [Shape](#shape)
-   [Value background](#value-background)
-   [Seasonal scenes](#seasonal-scenes)
-   [Icon effects](#icon-effects)
-   [Colour ranges](#colour-ranges)
-   [Flows](#flows)
-   [Pop-up](#pop-up)
-   [Template link](#template-link)
-   [Keys kept for Home Assistant](#keys-kept-for-home-assistant)
-   [Legacy keys](#legacy-keys)

## Annotated skeleton

Every key below is optional unless the comment says required. Values shown are examples. Defaults are the values the card uses when the key is missing.

```yaml
type: custom:magic-card            # required
name: Living room                  # editor title; pop-up label when popup.title is empty
template: living_room              # name of a saved Magic Card template (not Jinja)
not_synced: [background, flows]    # template-linked card: card keys kept local

use_page_theme: true               # default true; false = use `theme`
theme: Midnight                    # with use_page_theme: false; default: HA's default theme
background: "#1c1c1c"              # CSS background value
background_image: url('/local/bg.jpg')   # url(), gradient or media-source:// id
border_radius: 16px                # card corners; also the pop-up corners
padding: 16px                      # default 16px
box_shadow: 0 2px 8px rgba(0,0,0,.3)
card_height: 220px                 # minimum height
overflow: hidden                   # visible | hidden | auto
css: "letter-spacing: 0.5px"      # CSS declarations for the card's content, applied last
hover:                             # design values while the pointer is over the card's content
  background: "#263238"

display:                           # show the whole card only while conditions match
  mode: every                      # every (default) | any
  conditions: []                   # see Display conditions

conditional_appearance:            # override card fields while conditions match
  - id: night                      # unique; the editor finds rules by id
    name: Night
    mode: every
    conditions: []
    overrides:
      background: "#0d1b2a"        # background, background_image, border_radius, padding,
                                   # box_shadow, card_height, use_page_theme, theme

animations: []                     # card animations (see Animations); trigger_entity required
custom_animations: []              # embedded animation documents for preset: custom:<id> (see Animations)
hidden_animations: []              # template-linked card: template animation ids left out on this card
ring: {}                           # card ring (see Ring); entity required for value mode
shape: squircle                    # card outline (see Shape); wins over border_radius
shape_options: { corner: 24px }
value_background:                  # fill or sparkline behind the rows (see Value background)
  type: fill
  entity: sensor.water_tank        # required on the card
seasonal: auto                     # seasonal scene (see Seasonal scenes)
popup: {}                          # see Pop-up
flows: []                          # see Flows

grid_options: {}                   # Home Assistant's own keys, kept as they are
layout_options: {}
visibility: []
view_layout: {}

rows:                              # required (a list, may be empty)
  - id: row_main                   # optional; derived from the position when missing
    layout: "1-2"                  # relative column widths; default equal columns
    column_widths: [2fr, 120px]    # one width per column; wins over layout
    gap: 8px                       # space between columns; default 8px
    padding: 0px
    display: {}                    # display conditions for the row
    hidden: true                   # left out on the dashboard (the studio shows it dimmed)
    editor_name: Header            # name in the editor's tree and canvas only
    design: {}                     # see Design
    actions:                       # run on a tap outside the row's modules
      tap_action: { action: navigate, navigation_path: "#kitchen" }
    not_synced: [layout]           # template-linked card: row keys kept local
    columns:                       # required
      - id: col_left               # optional
        gap: 8px                   # space between modules; default 8px
        padding: 0px
        vertical_align: center     # start | center | end | stretch
        display: {}
        design: {}
        not_synced: [design]
        modules:                   # required (a list, may be empty)
          - id: lamp               # optional; needed for flows and template overrides
            type: button           # required; one of the 25 module types
            entity: light.desk     # most modules
            attribute: brightness  # read an attribute instead of the state (where supported)
            display: {}
            editor_name: Desk lamp # also on columns, row-module columns; hidden: true works here too
            design: {}
            actions:
              tap_action: { action: toggle }
            not_synced: [label, design.color]
            # ...module options, see Modules
            # icon modules also take icon_fx, icon_on, icon_off, svg (see Icon effects)

          - type: horizontal       # layout modules hold more modules
            gap: 8px
            modules:
              - type: icon
                icon: mdi:sofa
              - type: tabs
                tabs:
                  - label: Lights
                    icon: mdi:lightbulb
                    modules: []
              - type: row
                layout: "1-1"
                column_widths: [2fr, 1fr]  # optional, wins over layout
                gap: 8px
                padding: 4px
                columns:
                  - id: c1         # columns take the keys of a card column
                    vertical_align: center
                    modules: []
                  - modules: []
```

## Card

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `type` | string | | Required. `custom:magic-card`. |
| `rows` | list | | Required. A missing `rows` list stops the card with "Invalid configuration". |
| `name` | string | | Shown in the editor. Used as the pop-up's accessible name when `popup.title` is empty. Not drawn on the card. |
| `template` | string | | Links the card to a saved template. See [Template link](#template-link). |
| `not_synced` | list | | See [Template link](#template-link). |
| `use_page_theme` | boolean | `true` | Only `false` switches to `theme`. |
| `theme` | string | HA default theme | Theme name. Its variables are set on the card. |
| `background` | string | | Any CSS `background` value. |
| `background_image` | string | | `url('...')`, a gradient, or a `media-source://` id. Drawn with `cover`, centred, no repeat. |
| `border_radius` | string | theme | CSS length. Also rounds the pop-up surface. |
| `padding` | string | `16px` | CSS padding. |
| `box_shadow` | string | theme | CSS box shadow. |
| `card_height` | string | | Written as `min-height`. |
| `overflow` | string | | `visible`, `hidden` or `auto`. |
| `css` | string | | CSS declarations for the card's content, written after the fields above so they win. Custom CSS in the card's Design tab. |
| `hover` | object | | Design values applied while the pointer is over the card's content. Same keys as [Design](#design). See [Hover](#hover). |
| `display` | object | | See [Display conditions](#display-conditions). |
| `conditional_appearance` | list | | See [Conditional appearance](#conditional-appearance). |
| `animations` | list | | See [Animations](#animations). The card has no entity, so play conditions need `trigger_entity`. |
| `custom_animations` | list or map | | Animation documents for `preset: custom:<id>`, used when the animation library lacks the id. A map is keyed by id, and each document still needs its own `id`. Format: [Animation YAML](../animation-studio/yaml.md), with the keys in [Animation documents](#animation-documents). The icon picker's [Animated icons](../design/quick-icon-animator.md) tab stores its animations here, with ids starting `quick-icon-`. |
| `hidden_animations` | list | | Template-linked card: ids of the template's `custom_animations` this card leaves out. See [Template link](#template-link). |
| `ring` | object | | See [Ring](#ring). `position: outside` is drawn inside on the card. |
| `shape` | string | | Outline of the card. See [Shape](#shape). Wins over `border_radius`. |
| `shape_options` | object | | Options of the card's shape. See [Shape](#shape). |
| `value_background` | object | | Fill or sparkline behind the card's rows. See [Value background](#value-background). Needs its own `entity`. |
| `seasonal` | object, string or boolean | | Seasonal scene. See [Seasonal scenes](#seasonal-scenes). |
| `background_layers` | list | | Card backdrop: at most 4 layers, first entry in front. A fifth entry is ignored. Keys in [Layers](#layers). See [Backgrounds](../design/backgrounds.md#card-backdrop). |
| `layers_low_power` | boolean | `false` | Drops blur, blend and pan and zoom on this card's backdrop and layered modules. Pictures, opacity and darkening stay. |
| `pause_button` | string | `hidden` | `hidden` (the default: no button), `auto` (shown on cards that have motion) or `always`. If anything on the card moves for more than 5 seconds, set `auto` or `always` so viewers can stop it. With `auto` or `always` the card keeps a 24 px strip at the button's edge, even when no button shows under `auto`. Set in the Design tab, Motion group. See [Pause motion button](../design/layers.md#pause-motion-button). |
| `pause_button_corner` | string | `bottom-left` | `bottom-left`, `bottom-right`, `top-left` or `top-right`. Places the button, and with `auto` or `always` also sets the edge (top or bottom) that keeps the strip for it. |
| `popup` | object | | See [Pop-up](#pop-up). |
| `flows` | list | | See [Flows](#flows). |

Rows are stacked with a 10px gap. Detail: [Card, rows and columns](../card/README.md).

## Rows

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `columns` | list | | Required. A row without a `columns` list stops the card. |
| `id` | string | `row~<index>` | See [ids](value-syntax.md#ids). |
| `layout` | string | equal columns | Relative widths joined by dashes, one per column: `1`, `1-1`, `1-2`, `2-1`, `1-1-1`, `1-2-1`, `3-1-1`. A dash layout with the wrong number of parts falls back to equal columns. Anything else is used as a CSS `grid-template-columns` value, for example `"80px 1fr"`. |
| `column_widths` | list | | One width per column: `<n>fr`, `<n>%`, `<n>px` or `auto`. A bare number is `fr`. When the list has entries it wins over `layout`. Missing or invalid entries are `1fr`, and extra entries are ignored. The editor writes it from the width fields and the drag handles between columns. |
| `gap` | string | `8px` | Space between columns. |
| `padding` | string | | CSS padding. |
| `display` | object | | Display conditions. |
| `hidden` | boolean | `false` | `true` leaves the row out on the dashboard. The studio still shows it, dimmed. Set by Hide on dashboard in the item menu. |
| `editor_name` | string | | A name for the row in the editor's structure tree, canvas labels and inspector. Never shown on the dashboard. Set by Rename. |
| `design` | object | | See [Design](#design). |
| `actions` | object | | `tap_action`, `hold_action`, `double_tap_action`, as on a module. They run when the row is tapped outside a module with its own action or control. A row has no entity, so `toggle` and `more-info` need the action's `entity`. See [Actions](#actions). |
| `not_synced` | list | | Template-linked card: `layout`, `column_widths`, `gap`, `padding`, `design`, `actions`, `hidden`, `editor_name`. |

## Columns

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `modules` | list | | Required. A column without a `modules` list stops the card. |
| `id` | string | `<row id>~col<index>` | |
| `gap` | string | `8px` | Space between modules. |
| `padding` | string | | |
| `vertical_align` | string | `start` | `start`, `center`, `end`, `stretch`. |
| `display` | object | | Display conditions. |
| `hidden` | boolean | `false` | `true` leaves the column out on the dashboard (it takes no space). The studio shows it dimmed. |
| `editor_name` | string | | Editor-only name, as on a row. |
| `design` | object | | See [Design](#design). |
| `not_synced` | list | | Template-linked card: `design`, `gap`, `padding`, `vertical_align`, `hidden`, `editor_name`, `modules`. |

## Shared module keys

Every module has these. The module-specific keys are in [Modules](../modules/README.md).

| Key | Type | Notes |
| --- | --- | --- |
| `type` | string | Required. Content: `text`, `icon`, `info`, `image`, `markdown`, `bar`, `graphs`, `camera`. Controls: `button`, `slider`, `spinbox`, `dropdown`, `light`, `gauge`. Layout: `horizontal`, `vertical`, `row`, `tabs`, `separator`, `slider-layout`. Advanced: `clock`, `weather`, `forecast`, `video-bg`, `custom-card`. |
| `id` | string | Optional. Derived from the position when missing. Give one to a module that a flow connects to, or that a template-linked card overrides. |
| `entity` | string | Entity id. Most modules read it; layout modules and `separator` ignore it. |
| `attribute` | string | Reads this attribute instead of the state, on modules that support it. |
| `display` | object | Display conditions. A condition without `entity` counts as met (it does not fall back to the module's entity). |
| `hidden` | boolean | `true` leaves the module out on the dashboard, as if its display conditions failed. The studio shows it dimmed. Works on layout children too. |
| `editor_name` | string | Editor-only name. The structure tree, canvas labels and inspector show it in place of "Type · label". The card never shows it, so `label`, `text` and `name` stay what the dashboard shows. |
| `design` | object | See [Design](#design). |
| `actions` | object | See [Actions](#actions). |
| `placement` | string | `flow` (Normal, also when absent), `background` (Behind others) or `overlay` (On top). See [Layers](#layers). |
| `layer` | object | Options of a Behind others or On top module. See [Layers](#layers). Ignored when `placement` is `flow` or absent. |
| `not_synced` | list | Template-linked card only. |

A module with a missing or unknown `type` shows an error in its own place. The rest of the card keeps rendering.

## Layers

Placement and the `layer` block are shared by every module. The card backdrop is set with `background_layers`. How each option behaves is in [Layers](../design/layers.md) and [Backgrounds](../design/backgrounds.md#card-backdrop).

Keys of the `layer` block:

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `layer.fill` | `container`, `row` or `card` | `container` | Behind others only. `row` and `card` apply to a module directly in a card column or row module column. |
| `layer.anchor` | `top-left`, `top`, `top-right`, `left`, `center`, `right`, `bottom-left`, `bottom` or `bottom-right` | `top-left` | On top only. |
| `layer.offset_x` | CSS length, for example `8px` or `5%` | `0` | On top only. On an edge it must be 0 or more. On a middle position it can be negative. |
| `layer.offset_y` | CSS length | `0` | As `offset_x`, for the vertical axis. |
| `layer.opacity` | 0 to 100 (%) | `100` | |
| `layer.blur` | 0 to 24 (px) | `0` | Above 12 counts as heavy for older tablets. |
| `layer.blend` | `normal`, `multiply`, `screen`, `overlay`, `darken`, `lighten` or `soft-light` | `normal` | |
| `layer.click_through` | boolean | Behind others: `true`. On top: `true` without an action, `false` with one. | Taps pass through to what is under the module. |
| `layer.scrim` | object | absent (off) | Darken behind text. Present means on. |
| `layer.scrim.style` | `dim`, `bottom`, `top`, `left` or `right` | | `dim` is flat. The others fade from that edge. The editor writes `bottom`. |
| `layer.scrim.color` | CSS colour or `card` | `black` | `card` is the card's background colour. |
| `layer.scrim.strength` | 0 to 90 (%) | `60` | |

Keys of a `background_layers` entry:

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `type` | `image`, `gradient`, `pattern` or `color` | required | |
| `hidden` | boolean | `false` | |
| `opacity` | 0 to 100 (%) | `100` | |
| `blend` | as `layer.blend` | `normal` | |
| `image` | path, URL or media item | | One picture. With `states`, the picture for any other state. |
| `entity` | entity id | the card's entity | `image` layers. Follows a device, taking the picture from `attribute`. |
| `attribute` | string | `entity_picture` | |
| `states` | map of state to picture | | Changes with state. Exact match. |
| `refresh` | seconds, 5 or more | `10` | Camera entities only. |
| `stale_badge` | boolean | `true` | Camera entities only. `false` turns off the stale label. |
| `position` | an anchor, or `"<x>% <y>%"` | `center` | |
| `size` | `cover`, `contain`, `auto` or `"<n>%"` | `cover` | |
| `repeat` | `no-repeat`, `repeat`, `repeat-x` or `repeat-y` | `no-repeat` | Only when `size` is not `cover`. |
| `blur` | 0 to 24 (px) | `0` | Image layers. |
| `pan_zoom` | object | off | Pictures and camera still pictures only. Keys: `from` (100 to 200, default 100), `to` (100 to 200, default 115), `focus` (an anchor, default `center`), `duration` (10 to 120 s, default 30), `alternate` (default `true`), `pause_when_idle` (default `false`). |
| `gradient` | CSS gradient | | `gradient` layers. 2 to 8 stops. |
| `pattern` | `dots`, `grid`, `lines`, `diagonal` or `checks` | | `pattern` layers. |
| `color` | CSS colour | | `color` layers, and the ink of `pattern` layers. |
| `size` | 4 to 64 (px) | | `pattern` layers: the cell size. |
| `thickness` | 1 to 8 (px) | | `pattern` layers: line width, or dot size for `dots` and `checks`. |

The pause button keys are described in [Pause motion button](../design/layers.md#pause-motion-button).

Modules that draw an icon (`icon`, `button`, `info`, `light`, `tabs`, `weather`, `forecast`) also take `icon_fx`, `icon_on` and `icon_off`. `svg` is for `icon`, `button` and `info`; the Light module has no Custom SVG switch. See [Icon effects](#icon-effects).

## Slider look keys

A `type: slider` module can take these optional keys. A slider without them looks and works as before. `show_value`, `slider_color` and `track_color` keep their meaning. `slider_color`, `track_color`, `slider_color_to` and `thumb_border_color` also accept an entity colour: `entity`, `entity 50%`, `entity.rgb_color` or `entity.hs_color 50%`. Each key is described in [Slider](../modules/controls/slider.md#look) and [Entity colours for sliders](../modules/controls/slider.md#entity-colours). The keys are shown commented out here, so copying this block changes nothing.

```yaml
- type: slider
  entity: light.desk
  # track_style: standard          # standard | thin | pill | segmented | glass | big-fill
  # track_thickness: 40            # px, 2-96
  # track_radius: 12               # px, 0-48
  # segments: 6                    # segmented; 2-20
  # segment_gap: 2                 # px, 1-8
  # glass_blur: false              # glass; blur what is behind the track
  # fill_mode: solid               # solid | gradient | auto
  # slider_color_to: "#ff9100"     # gradient end colour
  # use_entity_color: false        # start the fill with the light's own colour
  # show_icon: true                # big fill; the entity's icon
  # icon: mdi:lightbulb            # big fill; overrides the entity's icon
  # icon_position: start           # start | center (centre only when vertical)
  # live: false                    # update while dragging, at most 4 a second
  # thumb: line                    # line | circle | pill | square | none
  # thumb_size: 20                 # px, 4-64
  # thumb_border: 0                # px, 0-6
  # thumb_border_color: "#ffffff"
  # thumb_glow: 0                  # px, 0-30
  # thumb_icon: mdi:star           # circle, pill and square only
  # value_position: beside         # beside | bubble | track | hidden
  # ticks: false
  # tick_every: 10                 # unset = automatic, 5 to 10 ticks
  # show_limits: false
  # track_shape: circle            # custom | squircle | hexagon | octagon | blob | wave | notch | ticket | pill | circle | none
  # track_shape_options: {}        # from the shape editor
  # stops:                         # at most 12
  #   - value: 0
  #     label: Off
  # snap: false
```

## Layout modules and their children

Children are full modules: they take `id`, `entity`, `design`, `actions`, `display` and their own options. Layouts nest to any depth.

| `type` | Children | Other keys |
| --- | --- | --- |
| `horizontal` | `modules: [...]` | `gap`, `align` (`start`, `center`, `end`, `stretch`), `justify` (`start`, `center`, `end`, `space-between`, `space-around`) |
| `vertical` | `modules: [...]` | `gap`, `align` |
| `row` | `columns: [{ modules: [...] }, ...]`, see [Row module columns](#row-module-columns) | `layout` (same syntax as a card row), `column_widths` (one width per column, wins over `layout`, as on a card row), `gap` (default `8px`), `padding` |
| `tabs` | `tabs: [{ label, icon, hidden, modules: [...] }, ...]`; a tab with `hidden: true` is left out on the dashboard (`active_tab` still counts every tab; when it names a hidden tab, the first shown tab opens) | `active_tab` (index of the tab shown first, default 0), `tab_style` (`default`, `pills`, `underline`) |
| `slider-layout` | `modules: [...]`, one slide each | `pagination`, `navigation`, `slides_per_view` (default 1), `space_between` (px, default 8), `loop`, `autoplay`, `autoplay_delay` (ms, default 5000) |

A child hidden by its display conditions is left out. A slider then builds no empty slide for it.

The editor manages children, tabs and row-module columns in the structure tree. The YAML keys are unchanged for `horizontal`, `vertical`, `tabs` and `slider-layout`.

### Row module columns

Each entry of a row module's `columns` takes the keys of a card column:

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `modules` | list | | Required. The column's children. |
| `id` | string | | Optional. The editor adds one to every column it edits; configs without ids keep working. |
| `gap` | string | `8px` | Space between modules. |
| `padding` | string | | |
| `vertical_align` | string | `start` | `start`, `center`, `end`, `stretch`. |
| `display` | object | | Display conditions. A hidden column takes no space. |
| `hidden` | boolean | `false` | `true` leaves the column out on the dashboard. |
| `editor_name` | string | | Editor-only name, as on a card column. |
| `design` | object | | See [Design](#design). |

A row-module column has no `not_synced` of its own: on a template-linked card, changes to it override the row module's `columns` list. Row modules whose columns have only `modules` (no `column_widths` or `padding`) render with equal columns and the default gap. Detail: [Row](../modules/layout/row.md).

## Design

`design` is a map of CSS properties with underscores: `font_size`, `background_color`, `border_radius`. The same block exists on rows, columns and modules. The card stores its few design values at the top level instead (see [Card](#card)).

```yaml
design:
  padding: 12px                    # box keys: padding, margin, border_radius
  padding_top: 4px                 # per-side longhands override the shorthand
  border_top_left_radius: 20px
  color: entity                    # colour keys accept entity / entity N%
  background_color: entity 15%
  border_width: 2px                # a width without a style draws solid
  border_color: var(--primary-color)
  border_length: 40%               # shorten each drawn side to a line
  border_length_align: center      # start | center | end
  border_length_sides: bottom      # top | right | bottom | left; default every side
  font_size: 1.2rem
  font_weight: "600"               # every design value is a string: quote numbers
  opacity: "0.8"
  css: "letter-spacing: 1px"       # raw CSS declarations appended to this element
  animations: []                   # see Animations
  ring: {}                         # see Ring
  shape: hexagon                   # see Shape
  shape_options: {}
  value_background: {}             # see Value background
  hover: {}                        # see Hover
  conditional: []                  # see Conditional design rules
```

Rules for every design key:

-   Values are strings or numbers. A number gets a unit where the key needs one: `px` for lengths (`padding: 8`, `font_size: 14`, `border_width: 2`), `s` for transition and animation times, `%` for `border_length`. Other keys take the number as it is (`opacity: 0.8`, `z_index: 2`, `font_weight: 600`, `line_height: 1.4`).
-   A string is written into the element's inline style as it is, so any valid CSS works: `calc()`, `var()`, `clamp()`, gradients.
-   Colour keys (`color`, `background_color`, `border_color`, `outline_color`) also take `entity` and `entity N%`. See [Colours](value-syntax.md#colours).
-   `background_image` takes `url('...')`, a gradient, a `media-source://` id, or a plain path or URL (`/local/bg.jpg`, `https://...`), which is wrapped in `url()`.
-   A `font_family` that names one of the Google Fonts in the font picker loads that font. See [Fonts](value-syntax.md#fonts).

The full key list by group: Spacing (`margin`, `padding`, `width`, `height`, `min_width`, `min_height`, `max_width`, `max_height`, `box_sizing`), Borders (`border`, `border_top`, `border_right`, `border_bottom`, `border_left`, `border_width`, `border_style`, `border_color`, `border_length`, `border_length_align`, `border_length_sides`, `border_radius`, `outline`, `outline_width`, `outline_style`, `outline_color`, `outline_offset`, `box_shadow`), Positioning (`position`, `top`, `right`, `bottom`, `left`, `inset`, `display`, `visibility`, `opacity`, `z_index`, `overflow`, `overflow_x`, `overflow_y`, `float`, `clear`, `cursor`, `pointer_events`), Typography (`font_family`, `font_size`, `font_weight`, `font_style`, `font_variant`, `color`, `text_align`, `text_decoration`, `text_transform`, `text_indent`, `text_overflow`, `text_shadow`, `line_height`, `letter_spacing`, `word_spacing`, `white_space`, `word_break`, `overflow_wrap`), Backgrounds (`background`, `background_color`, `background_image`, `background_position`, `background_size`, `background_repeat`, `background_attachment`, `background_clip`, `background_origin`, `backdrop_filter`), Flexbox (`flex_direction`, `flex_wrap`, `justify_content`, `align_items`, `align_content`, `gap`, `row_gap`, `column_gap`, `flex`, `flex_grow`, `flex_shrink`, `flex_basis`, `align_self`, `order`), Grid (`grid_template_columns`, `grid_template_rows`, `grid_template_areas`, `grid_auto_columns`, `grid_auto_rows`, `grid_auto_flow`, `grid_column`, `grid_row`, `grid_area`), Transitions (`transition`, `transition_property`, `transition_duration`, `transition_timing_function`, `transition_delay`, `transform`, `transform_origin`, `animation_name`, `animation_duration`, `animation_timing_function`, `animation_delay`, `animation_iteration_count`, `animation_direction`, `animation_fill_mode`, `animation_play_state`, `filter`), Lists and tables (`list_style`, `list_style_type`, `list_style_position`, `list_style_image`, `border_collapse`, `border_spacing`, `table_layout`, `caption_side`), and `css`, `animations`, `ring`, `shape`, `shape_options`, `value_background`, `hover`, `conditional`.

Detail per group: [Design](../design/README.md).

### Hover

`design.hover` on rows, columns and modules, `hover` on the card. It takes the same keys as the design, `css` included, and applies them while the pointer is over the element (on the card: over its content).

```yaml
design:
  background_color: "#1e1e1e"
  transition: background-color 0.2s, transform 0.2s
  hover:
    background_color: "#2c2c2c"
    transform: scale(1.03)
```

-   Hover values win over the base design and over matching conditional rules. They are applied with `!important`, so a hover `transform` or `opacity` also overrides a running animation preset. A declaration marked `!important` in the base design's `css` still wins.
-   `animations`, `ring`, `shape`, `shape_options`, `value_background` and border length have no effect under `hover`.
-   On a shaped element, a hover `border_color` recolours the shape's outline and a hover `box_shadow` replaces its shadow, as long as the base design has a border or shadow. With border length, a hover `border_color` recolours the short lines.
-   Put a `transition` in the base design for a smooth change. With reduced motion the change is immediate.

## Actions

```yaml
actions:
  tap_action:
    action: toggle                 # see the table
    entity: light.other            # optional; wins over the module's entity
    use_module_entity: true        # false: no fallback to the module's entity
    haptic: light                  # success | warning | failure | light | medium | heavy | selection
    confirmation: { text: Sure? }  # accepted, not used by the card
  hold_action:                     # after 500 ms
    action: more-info
  double_tap_action:               # a tap then waits 250 ms for a second one
    action: perform-action
    service: script.goodnight
    data: { mode: quiet }
```

| `action` | Keys | Result |
| --- | --- | --- |
| `none` | | Nothing |
| `toggle` | `entity` | Toggles the action's `entity`, else the module's |
| `more-info` | `entity` | Opens the more-info dialog |
| `navigate` | `navigation_path` | Goes to a path. `"#kitchen"` opens a pop-up. |
| `url` | `url_path` | Opens an `http` or `https` URL in a new tab. Other schemes are blocked. |
| `perform-action` | `service`, `data`, `service_data` | Calls `domain.service` with `data` and `service_data` merged. There is no `target` key: put `entity_id` in `data`. |
| `assist` | | Opens Assist |
| `popup` | `hash` | Opens the Magic Card pop-up with that ID |
| `close-popup` | | Closes the open pop-up |
| `fire-dom-event` | `data` | Fires `ll-custom` with `data` as detail |

Modules and rows run actions. Columns and the card do not. A module without actions stays inert, and so does an action that misses what it needs (a `navigate` without a path, a `toggle` without any entity, a `popup` without `hash`). A child's action never also runs its layout's action.

A row action runs when the row is tapped outside a module that has its own action or control, so module actions win. A row has no entity, so `toggle` and `more-info` need the action's `entity`. The row takes keyboard focus (Enter or Space taps) only when nothing inside it is interactive. Detail: [Actions](../card/actions.md).

## Display conditions

```yaml
display:
  mode: every                      # every = all must match (default); any = one is enough
  conditions:
    - type: state
      entity: person.anna
      state: home                  # exact match (string compare)
    - type: state
      entity: sensor.lux
      below: 50                    # numbers; checked only when state and state_not are empty
    - type: attribute
      entity: climate.living
      attribute: hvac_action
      state_not: idle
    - type: time
      after: "07:00"               # HH:MM, 24 h, browser time; at or after
      before: "22:30"              # before (exclusive)
    - type: template
      template: "{{ is_state('sun.sun', 'below_horizon') }}"
```

| Key | Type | Notes |
| --- | --- | --- |
| `type` | string | `state`, `attribute`, `time`, `template`. An unknown type counts as met. |
| `id` | string | Optional for the card. The editor adds one. |
| `entity` | string | `state` / `attribute`. No entity: met. Entity not found: not met. |
| `attribute` | string | `attribute` type. No attribute: met. |
| `state` | string | Equal to |
| `state_not` | string | Not equal to |
| `above`, `below` | number | Strictly above / below. Only used when `state` and `state_not` are empty. |
| `after`, `before` | string | `HH:MM`. A window across midnight (`after: "22:00"`, `before: "06:00"`) never matches; use `mode: any` with two conditions. |
| `template` | string | Jinja. Met when the result is `true`, `yes`, `on`, `enable` or a non-zero number. Not met while pending or on error. Empty: met. |
| `use_module_entity` | boolean | Only in conditional design rules (see below). |

Hidden items stay visible, marked, in the studio canvas. Detail: [Display conditions](../card/display-conditions.md).

## Conditional design rules

Rules under `design.conditional` on a row, column or module. Each rule's `design` overrides the base design while its conditions match. Rules apply in order; later rules win.

```yaml
design:
  background_color: "#2b2b2b"
  conditional:
    - id: rule-on                  # unique; the editor finds rules by id
      name: On
      mode: every
      conditions:
        - type: state
          state: "on"              # no entity: the module's entity is used
      design:
        background_color: entity 25%
```

On a module, a condition without `entity` uses the module's entity unless the condition has `use_module_entity: false`.

A rule without conditions changes nothing. Neither does a rule with a condition that is not filled in: a `state` condition without an entity (on a row or column, or on a module with no entity), an `attribute` condition without its attribute, a `template` condition with an empty template, or a `time` condition without `after` and `before`. This differs from display conditions, where such a condition counts as met.

A rule's `design` can set any design key, including `shape` and `value_background`.

## Conditional appearance

Card-level rules: while a rule's conditions match, its `overrides` replace card fields. Rules apply in order; later rules win. Empty override values are skipped.

| Key | Notes |
| --- | --- |
| `id`, `name` | Give each rule a unique `id` |
| `mode` | `every` (default) or `any` |
| `conditions` | Same as display conditions. There is no module entity here. |
| `overrides` | Any of `background`, `background_image`, `border_radius`, `padding`, `box_shadow`, `card_height`, `use_page_theme`, `theme` |

As with conditional design rules, a rule without conditions, or with a condition that is not filled in, changes nothing.

Detail: [Conditional appearance](../card/conditional-appearance.md).

## Animations

A list under `design.animations` (rows, columns, modules) or `animations` (card).

```yaml
animations:
  - id: glow                       # optional; default anim-<index>
    preset: glow-pulse             # required; entries without a preset are dropped
                                   # or custom:<id>: an animation from the library
    target: module                 # module (default) | icon
    trigger: entity_on             # always (default) | entity_on | state | tap
    trigger_entity: light.desk     # default: the module's entity; required on card/row/column
    state: "on"                    # for trigger: state
    color: entity                  # colour; entity / entity N% accepted
    duration: 2s                   # CSS time; a bare number is seconds
    delay: 0s
    easing: ease-in-out            # linear | ease | ease-in | ease-out | ease-in-out | spring
                                   # | smooth | snap | cubic-bezier(...) | steps(...)
    iterations: infinite           # infinite or a number
    direction: normal              # normal | reverse | alternate | alternate-reverse
    intensity: 16                  # preset-specific, clamped to the preset's range
    strength: 60                   # 0-100, colour presets only; default 100
    decorations: true              # seasonal presets: border decorations; default true
    entity: fan.bedroom            # custom: animations with clips or bindings: the entity they
                                   # read; default the module's entity (card/row/column: none)
```

Unset fields use the preset's own values.

`preset: custom:<id>` plays an animation from the library of the Magic Card Utils integration, made in the [animation studio](../animation-studio/README.md). The card looks the id up in the library first, then in the card's `custom_animations`. Without either it draws nothing. The entry's fields override the animation's own values; `intensity` is the amplitude in % (100 = as drawn) for keyframes and paths. See [Using animations in cards](../animation-studio/using-in-cards.md#overrides).

`entity` only matters for a `custom:` animation that has state clips or value bindings. It replaces the module's entity for those, and leaves the play condition (`trigger_entity`) alone. Cards, rows and columns have no entity of their own, so their clips and bindings need it. See [States and values](../animation-studio/states-and-values.md#the-driving-entity).

`target: icon` is offered in the editor for `icon`, `button`, `light` and `weather` modules (the `info` module's icon also takes it). Preset ids and play rules: [Design](../design/README.md).

Seasonal presets draw a seasonal scene inside one element. Their ids are the scene names (`winter`, `spring`, `summer`, `autumn`, `christmas`, `new_year`, `valentine`, `easter`, `halloween`, `weather`, `daynight`) plus the single weather scenes `snow`, `rain`, `storm`, `sun`, `clouds`, `fog`, `wind`, `night` and `dusk`. `intensity` is the density in percent (default 50), `strength` the opacity, and `decorations: false` turns off the border decorations. The timing keys do not apply. `weather` follows the module's weather entity, or a `weather.*` entity given as `trigger_entity`. `daynight` follows `sun.sun`. See [Seasonal scenes](#seasonal-scenes).

### Animation documents

The documents under `custom_animations` follow the [Animation YAML](../animation-studio/yaml.md) format. A card drops an invalid entry of these keys one by one and plays the rest.

```yaml
custom_animations:
  - id: doorbell-ring
    name: Doorbell ring
    kind: keyframes
    keyframes: []                  # may be empty or left out when tracks has entries
    rig:                           # keyframes only: the icon split into parts
      icon: mdi:bell-ring          # or svg: <svg>...</svg> (32 KB); none: the module's icon
      parts:                       # up to 64; ids 1-32 of a-z 0-9 - _, unique in the rig
        - { id: clapper, name: Clapper, from: [1], origin: [12, 19] }   # or svg: instead of from
      groups:                      # up to 16
        - { id: waves, name: Waves, parts: [clapper] }
      shapes:                      # up to 48 drawn shapes, icon units
        - { id: spark, d: "M19 3 L22 6 L19 9 Z", fill: entity, stroke: currentColor,
            stroke_width: 1, linecap: round, layer: over }               # layer: over | under
    tracks:                        # keyframes only, up to 24, one per target
      - target: part:clapper       # element | icon | name | state | background
                                   # | part:<id> | group:<id> | shape:<id>
        origin: center             # optional transform origin
        path: { d: "M0 0 C 1 -1 2 -1 3 0", follow_rotation: false }      # optional
        keyframes:                 # up to 40
          - at: 0
            transform: { rotate: 0 }
            draw: 0                # 0-1, parts, groups and shapes only
            stroke: currentColor   # stroke colour, parts and shapes
            easing: ease-in-out
            easings: { rotate: ease-out }   # per lane: x y scale scale_x scale_y rotate skew
                                            # opacity color background shadow blur radius
                                            # filter draw stroke
    clips:                         # any kind, up to 12, first match plays
      - when: { state: "on" }      # or state_not | entity_on: true/false | above | below
        animation: self            # self | none | <preset id> | custom:<id>
        transition: crossfade      # cut (default) | crossfade | finish
    bindings:                      # keyframes only, up to 8
      - target: icon
        property: rotate_speed     # rotate | x | y | scale | opacity | draw | color_mix
                                   # | speed | rotate_speed
        input: { attribute: percentage, min: 0, max: 100 }   # min 0, max 100 by default
        output: [0, 720]           # [from, to]; two colours for color_mix
        smoothing: 0.6             # 0-10 s
```

The whole document stays within 64 KB as JSON. Details: [Animation YAML](../animation-studio/yaml.md#targets).

## Ring

`design.ring` on rows, columns and modules, `ring` on the card. No `mode` (or any other value) means off.

```yaml
ring:
  mode: value                      # value | animated
  entity: sensor.filter_life       # value mode; default the module's entity
  attribute: ""                    # optional
  min: 0                           # default 0; or { entity, attribute } (numeric state / attribute)
  max: 100                         # default 100; e.g. { entity: sensor.capacity, attribute: usable }
  timer_fill: remaining            # timer entity: remaining (default, empties) | elapsed (fills up)
  thresholds:                      # colour by value (colour ranges)
    - { from: 0, color: "#f44336" }
    - { from: 30, color: "#4caf50" }  # on a timer: the remaining %
  transition: 1s                   # value mode fill transition; default 1s
  animation: snake                 # animated: snake (default) | pulse | full | dots | dashes
  length: 25                       # snake length in % of the outline, 1-99; default 25
  speed: 3s                        # animated: one lap; default 3s
  width: 3                         # px, 0.5-40; default 3
  color: var(--primary-color)      # default the theme's primary colour; entity accepted
  track_color: entity 20%          # background track
  track_opacity: 30                # 0-100; with no track_color the track is `color` at this opacity
  start: top                       # top (default) | top-left | right | bottom | left
  direction: cw                    # cw (default) | ccw
  linecap: round                   # round (default) | butt
  glow: 0                          # px, 0-40
  position: inside                 # inside (default) | center | outside
  trigger: always                  # show only while: always | entity_on | state
  trigger_entity: light.desk
  state: "on"
```

## Shape

`design.shape` and `design.shape_options` on rows, columns and modules, `shape` and `shape_options` on the card. A shape wins over `border_radius`. Without `shape`, or with `none`, the element keeps its rectangle. On a template-linked card, `none` turns off a shape that the template sets.

```yaml
shape: wave                        # squircle | pill | circle | hexagon | octagon | notch
                                   # | ticket | wave | blob | none
shape_options:
  corner: 16px                     # squircle, hexagon, octagon, notch, ticket
  smoothing: 0.6                   # squircle, 0-1; default 0.6
  edge: bottom                     # wave: top | right | bottom (default) | left | all
  amplitude: 8px                   # wave height; default 8px
  waves: 3                         # wave count; default 3
  seed: 7                          # blob outline; default 7
  wobble: 0.25                     # blob irregularity, 0-1; default 0.25
  animate: false                   # wave flows / blob morphs; default false
```

| `shape` | Options | `corner` default |
| --- | --- | --- |
| `squircle` | `corner`, `smoothing` | Half the shorter side |
| `pill`, `circle` | none | |
| `hexagon` | `corner`: how far the slanted sides reach in | A 60 degree point |
| `octagon` | `corner`: the corner cut | A regular octagon's cut |
| `notch` | `corner`: the corner cut | 16px |
| `ticket` | `corner`: radius of the half-circle cutouts | 16px |
| `wave` | `edge`, `amplitude`, `waves`, `animate` | |
| `blob` | `seed`, `wobble`, `animate` | |

Lengths (`corner`, `amplitude`) take a px number, `16px`, or a `%` of the shorter side. They are clamped so the shape fits the box. `animate` pauses off-screen and with reduced motion.

The border, border length and ring follow the shape. A ring on a shaped element is always drawn inside. `box_shadow` becomes a drop shadow along the shape (first shadow only). Content gets extra padding so it stays clear of cut corners and waves. The shape clips anything that pops out of the element, such as a dropdown list. A pop-up card keeps a rectangular surface while it is open. Detail: [Design](../design/README.md).

## Value background

`design.value_background` on rows, columns and modules, `value_background` on the card. It draws an entity's value behind the content, as a tank fill or a history sparkline, and follows the element's border radius or shape.

```yaml
value_background:
  type: fill                       # fill | sparkline | none; required to draw anything
  entity: sensor.water_tank        # default the module's entity; required on card, row, column
  attribute: ""                    # optional
  min: 0                           # fill: default 0; sparkline: the data's own range
  max: 100                         # fill: default 100; sparkline: the data's own range
  color: "#29b6f6"                 # default the theme's primary colour; entity / entity N% accepted
  opacity: 25%                     # fill default 25%, sparkline area default 18%; also 0.25 or 25
  direction: up                    # fill: up (default) | down | left | right
  wave: true                       # fill: moving wave on the surface; default true
  hours: 24                        # sparkline: history window; default 24, at most 168
  line_width: 1.5                  # sparkline: px; default 1.5
  area: true                       # sparkline: filled area under the line; default true
  smoothing: true                  # sparkline: curved line; default true
```

-   Without a `type`, or with an unknown one, nothing is drawn. `none` turns off a value background that a template or the base design sets.
-   An unavailable or non-numeric value shows an empty tank with a faint hatch.
-   A sparkline without history draws nothing. When the live value is unavailable, the last recorded value is held as a dashed line.
-   Sparklines only fetch history while they are on screen. The fill wave stops off-screen and with reduced motion.
-   An open pop-up does not show the card's own value background.

Detail: [Design](../design/README.md).

## Seasonal scenes

`seasonal` on the card. It draws a particle scene (snow, petals, leaves, fireworks, bats) with border decorations behind or over the content. For one module, row or column, use a seasonal animation preset (see [Animations](#animations)).

```yaml
seasonal: auto                     # short for { scene: auto }; also `true`, or a scene name
```

```yaml
seasonal:
  scene: auto                      # auto (default) | none | a scene name
  layer: back                      # back (default) | front: over the content, dimmed
  intensity: 50%                   # particle density; default 50%
  decorations: true                # border decorations; default true
  entity: input_boolean.festive    # off switch: state `off` hides the scene
  weather_entity: weather.home     # for the weather scene (also in combine)
  hemisphere: north                # north (default) | south: flips the seasons
  combine: [daynight]              # more scenes drawn with the main one
  calendar:                        # holiday dates auto uses, MM-DD..MM-DD (inclusive)
    christmas: 12-01..12-26        # default
    new_year: 12-31..01-01         # default; a range may run over the year end
    valentine: 02-14..02-14        # default; a single MM-DD also works
    easter: auto                   # default: Palm Sunday to Easter Monday
    halloween: 10-24..10-31        # default
```

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `scene` | string | `auto` | `winter`, `spring`, `summer`, `autumn`, `christmas`, `new_year`, `valentine`, `easter`, `halloween`, `weather`, `daynight`, `auto` or `none`. An unknown name draws nothing. |
| `layer` | string | `back` | `front` draws the scene over the content, dimmed. It never blocks taps. |
| `intensity` | string or number | `50%` | `70%`, or a number: from 0 to 1 a fraction (`0.7` is 70%), above 1 a percentage (`70`). Clamped to 0-100%. |
| `decorations` | boolean | `true` | Lights, icicles, frost, vine, cobweb or pumpkin, depending on the scene |
| `entity` | string | | While its state is `off`, the scene is hidden |
| `weather_entity` | string | | A `weather.*` entity. The `weather` scene draws nothing without it. |
| `hemisphere` | string | `north` | `south` flips the seasons. Any case. |
| `combine` | list | | Scenes added to the main one. A single name also works. |
| `calendar` | object | see above | Per holiday: a range, `auto` (easter only), or `off` (quote it, or write `false`) to skip that holiday. An invalid range keeps the default. |

`auto` shows a holiday while its range holds the date (new year is checked first, then christmas, valentine, easter, halloween), and otherwise the meteorological season: December to February is winter in the north. `weather` follows the state of `weather_entity`. `daynight` follows `sun.sun`: stars at night, a glow at dusk and dawn, nothing by day. Auto goes by the date in the time zone your Home Assistant profile shows times in.

Room for decorations: a card with `seasonal` keeps at least as much padding as its decorations need, worked out from the setting alone, so the card is the same size in every month and before the scene has loaded. `auto` keeps room for the widest scene it can show: 20 px at the top, right and left and 30 px at the bottom. This is a minimum. A card whose padding is already larger does not change, and the default padding of 16 px grows by 4 px at the top, right and left and by 14 px at the bottom. To keep less room, set `decorations: false`, name a scene (`winter` keeps 20 px at the top only), or switch holidays off in `calendar`: with `christmas` and `halloween` both `off`, `auto` keeps 20 px at the top and left and 18 px at the bottom. A seasonal animation preset on a module, row or column keeps its room whether or not its trigger is active.

`seasonal: none`, `seasonal: false` or a missing key draws nothing. Detail: [Design](../design/README.md).

## Icon effects

On `icon`, `button`, `info`, `light`, `tabs`, `weather` and `forecast` modules.

```yaml
icon: mdi:battery                  # `svg` here uses the `svg` key below
icon_on: mdi:lock                  # icon while the entity is on
icon_off: mdi:lock-open-variant    # icon while it is off
svg: '<svg viewBox="0 0 24 24">...</svg>'   # own SVG, max 32 KB, sanitised
icon_fx:
  fill:                            # liquid fill; `fill: {}` uses every default
    entity: sensor.phone_battery   # default the module's entity
    attribute: ""
    min: 0                         # default 0
    max: 100                       # default 100
    color: "#4caf50"               # default: value colour, else primary
    empty_color: 25%               # share = opacity of the empty icon (default 25%); or a colour
    wave: true                     # default true
    direction: up                  # up (default) | down | left | right
  device: auto                     # auto | off | spin | glow | flame | drum | swing | pulse | snow | shake | eq
  draw: off                        # off (default) | load | change | loop
  draw_duration: 1.2s              # default 1.2s
  morph: false                     # true morphs icon_off <-> icon_on
  colors:
    style: solid                   # solid (default) | duotone | gradient | value
    primary: entity                # default: the module's icon colour
    secondary: 40%                 # colour, or a share of primary; duotone default 40%
    gradient: ["#2196f3", "#f44336"]   # gradient / value stops; default these two
    angle: 90                      # gradient angle in degrees; default 90
```

Detail: [Icon effects](../icon-effects/README.md).

## Colour ranges

Used by `bar` and `gauge` (`severity`) and by the ring (`thresholds`).

```yaml
severity:
  - { from: 0, color: "#f44336" }
  - { from: 20, color: "#ff9800" }
  - { from: 50, color: "#4caf50" }
```

The range with the highest `from` at or below the value wins. Order does not matter. Older configs may have a `to`; a range with `to` only applies up to that value.

## Flows

```yaml
flows:
  - id: solar-house                # optional; default "<from>><to>"
    from: solar                    # module id (required)
    to: house                      # module id (required)
    from_side: auto                # auto (default) | top | right | bottom | left
    to_side: auto
    # from_anchor: icon            # icon | box; unset: box for a wide look, else icon
    # to_anchor: icon              # same as from_anchor
    route: curve                   # curve (default) | straight | elbow
    entity: sensor.solar_power     # no entity: always flowing at `speed`
    attribute: ""
    min: 0                         # |value| at or below: idle; default 0
    max: 1000                      # value of full speed and width; default 1000
    reverse_negative: true         # negative value runs to -> from; default true
    color: var(--primary-color)    # default primary; entity / entity N% accepted
    idle_color: 30%                # share of `color`, or a colour; default secondary text at 50%
    width: 3                       # px, max 40; default 3
    scale_width: true              # up to 2 x width at max; default true
    dots: 3                        # 0-8; 0 = moving dashes; default 3
    dot_size: 6                    # px, max 40; default 6
    speed: 2                       # seconds per traversal at max; default 2, min 0.2
    min_speed: 8                   # seconds just above min; default 8
    glow: 0                        # px, max 30; default 0
    label: none                    # none (default) | value | template
    label_template: "{{ states('sensor.solar_power') }} W"
    label_position: auto           # auto (default) | line | side | hidden
    show_when: always              # always (default) | flowing
    layer: back                    # back (default) | front
    # Look keys, all optional and shown commented out. Any one of them gives the flow a look.
    # line_style: solid              # solid | dashed | dotted | double | wave | zigzag | tube | neon | cable
    # dash_length: 10                # dashed; 2-40 px
    # dash_gap: 6                    # dashed, dotted; 2-40 px
    # rail_gap: 6                    # double; 2-24 px
    # amplitude: 6                   # wave, zigzag; height 1-20 px
    # wavelength: 32                 # wave 32, zigzag 24; 8-80 px
    # electric: false                # zigzag
    # tube_tint: "#ffffff"           # tube; default theme text colour at 8 %
    # bubbles: true                  # tube; default true
    # bubble_count: 4                # tube; 1-8
    # tube_fill_value: false         # tube; level follows the value, needs an entity
    # flicker: "off"                 # neon; off | subtle | strong (quote "off", or YAML reads it as false)
    # neon_core: "#ffffff"           # neon; default derived from the theme
    # cable_color: "#333333"         # cable; default a darker shade of color
    # twisted: false                 # cable
    # color_mode: single             # single | gradient | value; unset: see Look in options
    # color_to: "#ff9100"            # gradient end colour
    # thresholds:                    # by value: list of from and color
    #   - from: 0
    #     color: "#4caf50"
    # start_cap: none                # none | round | arrow
    # end_cap: none                  # none | round | arrow
    # cap_size: 8                    # px, 4-40; default 2 x width, at most 24
    # shape: dot                     # dot | arrow | chevron | square | diamond | star | comet | spark | bubble | drop | icon
    # shape_icon: mdi:star           # shape icon, mdi:name
    # shape_icon_rotate: true        # icon turns with the line
    # shape_spin: false              # star, square, diamond, icon; one turn every 3 s
    # shape_color: "#ffffff"         # default the line colour
    # shape_alternate: dot           # every second shape
    # size_variation: 0              # 0-60 %
    # spacing_mode: even             # even | pixels | random
    # spacing: 32                    # px, 4-400
    # motion: travel                 # travel | pulse
    # arrival: none                  # none | ring | splash
    # arrival_size: 24               # px, 8-80
```

A flow with a missing, unknown, hidden or identical `from` / `to` is not drawn. Detail: [Flow lines](../flows/README.md). The look keys are explained in [Look](../flows/options.md#look).

| Key | Type | Default | Values |
| --- | --- | --- | --- |
| `from_anchor` | string | Unset: `box` for a wide look, else `icon` | `icon`: the module's icon, picture or dial (its box when it has none). `box`: the module's outer box. Any other value counts as unset. |
| `to_anchor` | string | Unset: `box` for a wide look, else `icon` | Same as `from_anchor`, at the `to` module. |

A wide look is `line_style` `tube`, `cable`, `neon` or `zigzag`, or a swarm whose shapes travel: `spacing_mode: random`, a `size_variation` above 0, or a known `shape_alternate`. A swarm does not count with `motion: pulse`, or with `dots: 0` and no spacing. `electric`, `spacing` and `motion` do not count. Every other flow, including one with no look, ends at the icon. An explicit `icon` or `box` always wins. See [Attach to](../flows/options.md#attach-to).

## Pop-up

```yaml
popup:
  enabled: true                    # only `true` turns pop-up mode on
  hash: kitchen                    # pop-up ID; letters, digits, - and _; a leading # is removed
  title: Kitchen                   # header text and accessible name
  style: sheet                     # sheet (default) | dialog
  width: 600px                     # max width; a bare number is px; default 600px
  max_height: 90vh                 # default 90vh
  backdrop_blur: 8px               # default 8px
  backdrop_opacity: 0.4            # 0-1 (values above 1 read as percent); default 0.4
  show_close: true                 # default true
  auto_close: 0                    # seconds without interaction; 0 = off
  open_on: { entity: binary_sensor.doorbell, state: "on" }   # state empty: any change
  close_on: { entity: binary_sensor.doorbell, state: "off" }
```

Detail: [Card, rows and columns](../card/README.md).

## Template link

| Key | Where | Notes |
| --- | --- | --- |
| `template` | card | Name of a template saved with the `magic_card_utils` integration. The card fetches it and follows it. |
| `not_synced` | card | Card keys kept local: `use_page_theme`, `theme`, `background`, `background_image`, `border_radius`, `padding`, `box_shadow`, `card_height`, `overflow`, `css`, `hover`, `animations`, `ring`, `shape` (with `shape_options`), `value_background`, `seasonal`, `popup`, `flows`. `name`, `display` and `conditional_appearance` always come from the template. |
| `not_synced` | card | `custom_animations`: the card uses only its own `custom_animations` and none of the template's. |
| `hidden_animations` | card | Ids of template animation documents this card leaves out. Each item is an id string; any other value hides nothing. A document of the card's own with that id still plays. A template's own `hidden_animations` has no effect. |
| `not_synced` | row | `layout`, `column_widths`, `gap`, `padding`, `design`, `actions`, `hidden`, `editor_name`. `column_widths` or `actions` listed without a local value removes the template's. So does `hidden` or `editor_name` listed without a local value. |
| `not_synced` | column | `design`, `gap`, `padding`, `vertical_align`, `hidden`, `editor_name`, `modules` (the column's whole module list is the card's own; Wrap in layout sets it) |
| `not_synced` | module | Content keys (`text`, `icon`, `entity`, `image`, `content`, `label`, `attribute`, `prefix`, `suffix`, `url`, `service`, `service_data`, `data`, `use_entity`, `entity_display`, `use_entity_icon`, `use_entity_color`, `icon_color`, `size`, `icon_fx`, `icon_on`, `icon_off`, `svg`, `animated_icons`), `hidden`, `editor_name`, the child list (`modules`, `columns` or `tabs`), on a row module also `layout`, `column_widths`, `gap` and `padding`, `design` or `design.<key>` (`design.shape` covers `shape_options` too), `actions` or `actions.<name>` |

A linked card's `custom_animations` is merged with the template's by id. The card plays the template's documents in the template's order. A document of the card's own with the same id replaces the template's version of that one, and the card's other documents come after the template's. When an id appears twice on one side, the first one counts.

```yaml
template: living_room
custom_animations:                 # this card's own documents only
  - id: doorbell-wiggle            # replaces the template's doorbell-wiggle on this card
    name: Doorbell wiggle
    kind: keyframes
    duration: 1.2
    keyframes:
      - { at: 0, transform: { rotate: 0 } }
      - { at: 50, transform: { rotate: 12 } }
      - { at: 100, transform: { rotate: 0 } }
hidden_animations: [fan-spin]      # the template's fan-spin does not play on this card
```

Rows, columns and modules are matched to the template by `id`. Local rows, columns and modules whose id is not in the template are added after the template's. Module `not_synced` only works on modules directly in a column; changes inside a layout module are kept by marking its child list. Detail: [Templates](../editor/templates.md) and [Template-linked example](examples/template-linked.md).

## Keys kept for Home Assistant

`grid_options`, `layout_options`, `visibility` and `view_layout` belong to Home Assistant (sections Layout tab, Visibility tab, view layouts). The card does not read them. The editor keeps them, and linking to a template never touches them. Other keys you add (for example `card_mod`) are kept too.

## Legacy keys

These older keys are still read:

| Key | Read as |
| --- | --- |
| `design.animation_preset`, `animation_target`, `animation_speed` (`slow`, `normal`, `fast`), `animation_trigger`, `animation_state`, `animation_color` | One `animations` entry. Ignored when `animations` exists. The editor removes them when you edit the animation list. |
| `design.animation` | Not used |
| `to` in colour ranges | Upper bound of that range |
| Markdown `{{ state }}`, `{{ attribute }}`, `{{ entity }}` | Filled from the module's entity. See [Templates](value-syntax.md#jinja-templates). |
| Clock `date_format: full` | `long` |
