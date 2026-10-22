# Card options

Keys at the top level of the card. Back to [Card configuration](README.md).

## Contents

-   [All card keys](#all-card-keys)
-   [Card entity](#card-entity)
-   [Theme](#theme)
-   [Background](#background)
-   [Size and spacing](#size-and-spacing)
-   [Custom CSS](#custom-css)
-   [Hover](#hover)
-   [Shape, value background and seasonal scene](#shape-value-background-and-seasonal-scene)
-   [Home Assistant layout keys](#home-assistant-layout-keys)
-   [Example](#example)

## All card keys

| Key | Type / values | Default | What it does |
| --- | --- | --- | --- |
| `type` | `custom:magic-card` | required | The card type. |
| `rows` | List of rows | required | The content. See [Rows and columns](rows-and-columns.md). |
| `name` | Text | none | A name for the card in the editor. Also the accessible name of a pop-up without a title. Not drawn on the card. |
| `entity` | Entity id | none | The device the card is for. Modules, rows and columns without an entity of their own use it. See [Card entity](#card-entity). |
| `use_page_theme` | `true` / `false` | `true` | `false` gives the card its own theme. |
| `theme` | Theme name | Home Assistant's default theme | The card's theme while `use_page_theme` is `false`. |
| `background` | CSS colour or background value | Theme card background | Background of the card. |
| `background_image` | Media source id, a path or URL such as `/local/bg.jpg`, or a CSS image value | none | Background image, set to cover and centred. |
| `border_radius` | CSS length | Theme card radius | Corner radius. |
| `padding` | One to four CSS lengths | `16px` | Space inside the card around the rows. |
| `margin` | One to four CSS lengths | none | Space around the card. See [Border and frame](#border-and-frame). |
| `border_width` | One to four lengths in `px`, `em`, `rem`, `vw` or `vh` (no `%`) | Theme border width | Width of the card border. |
| `border_style` | `none`, `hidden`, `solid`, `dashed`, `dotted`, `double`, `groove`, `ridge`, `inset`, `outset` | Theme border style | Style of the card border. |
| `border_color` | CSS colour | Theme border colour | Colour of the card border. |
| `opacity` | Number from 0 to 1 | `1` | Opacity of the whole card. |
| `backdrop_filter` | A filter such as `blur(8px)` | none | Filter on what is behind the card. |
| `box_shadow` | CSS `box-shadow` | none | Shadow of the card content. |
| `card_height` | CSS length | auto | Minimum height of the card content. |
| `overflow` | `visible`, `hidden`, `auto` | not set | Overflow of the card content. YAML only. |
| `css` | CSS declarations | none | Extra CSS for the card content. See [Custom CSS](#custom-css). |
| `hover` | Design values | none | Design values applied while the pointer is over the card. See [Hover](#hover). |
| `display` | Display conditions | always shown | When the card is shown. See [Display conditions](display-conditions.md). |
| `conditional_appearance` | List of rules | none | Card fields that change while conditions match. See [Conditional appearance](conditional-appearance.md). |
| `animations` | List of preset animations | none | Animations of the whole card. See [Design](../design/README.md). |
| `custom_animations` | List or map of animation documents | none | Animation documents the card plays with `preset: custom:<id>`, embedded in the card. See [Using animations in cards](../animation-studio/using-in-cards.md#sharing-a-card). |
| `ring` | Ring settings | off | An outline around the card. See [Design](../design/README.md). |
| `shape` | `none`, `squircle`, `pill`, `circle`, `hexagon`, `octagon`, `notch`, `ticket`, `wave`, `blob` | none | Outline shape of the card. Wins over `border_radius`. See [Design](../design/README.md). |
| `shape_options` | Shape options | none | Options of the shape, such as the corner size or the wave edge. See [Design](../design/README.md). |
| `value_background` | Value background settings | none | A fill level or history sparkline behind the rows. Needs its own `entity`. See [Design](../design/README.md). |
| `seasonal` | Seasonal settings, a scene name, or `true` | none | A seasonal scene of particles and border decorations. See [Design](../design/README.md). |
| `popup` | Pop-up settings | off | Shows the card as a pop-up. See [Pop-ups](popups.md). |
| `flows` | List of flows | none | Animated lines between modules. See [Flows](../flows/README.md). |
| `template` | Template name | none | Links the card to a saved template. See [Templates](../editor/templates.md). |
| `not_synced` | List of key paths | none | Fields of a linked card that are local overrides. Written by the editor. |
| `hidden_animations` | List of ids | none | Template animation documents a linked card leaves out. See [Template animations](../editor/templates.md#template-animations). |

## Card entity

```yaml
entity: light.kitchen
```

Modules, rows and columns that have no `entity` of their own use the card entity. A module can pick its own entity, or write `entity: none` to have none. Layouts pass their own entity on to the modules inside only with `share_entity: true`. The card entity is not part of a Magic Card Utils template: the card keeps its own when it links to a template. The editor field is Card entity in [Card: General tab](../inspector/card-general.md). The rules, the YAML spellings and the `entity` and `card_entity` template variables are on [Card entity](../card-entity/README.md).

## Theme

```yaml
use_page_theme: false
theme: Midnight
```

With `use_page_theme: false` the card applies the theme's variables to itself, so everything inside it uses them. Without `theme` it uses Home Assistant's default theme. With `use_page_theme` unset or `true`, `theme` is ignored.

## Background

`background` is written into the CSS `background` of the card, so a colour, a gradient or any other background value works:

```yaml
background: linear-gradient(135deg, #1e3c72, #2a5298)
```

`background_image` takes three kinds of value:

-   A media source id, which is what the editor's media browser writes, for example `media-source://media_source/local/bg.jpg`. The card resolves it each time it renders, so the link does not expire.
-   A plain path or URL: one starting with `/`, `http://`, `https://` or `data:`. The card wraps it in `url(...)`, so `/local/bg.jpg` works as it is.
-   Any other CSS image value, such as `url('/local/bg.jpg')` or a gradient, used as written.

The image covers the card and is centred, and a `background` colour shows under it.

```yaml
background_image: /local/backgrounds/living-room.jpg
```

## Size and spacing

```yaml
border_radius: 20px
padding: 12px 16px
box_shadow: 0 4px 16px rgba(0, 0, 0, 0.25)
card_height: 180px
```

`card_height` is a minimum: the card still grows with its content. `padding` takes the CSS shorthand (one to four values). In a pop-up, `border_radius` shapes the pop-up surface when it is a single value.

With a `shape`, or with seasonal border decorations, the padding grows where needed so the rows keep clear of the edge.

## Border and frame

```yaml
border_width: 2px
border_style: dashed
border_color: "#03a9f4"
opacity: 0.9
backdrop_filter: blur(8px)
margin: 8px
```

The border, opacity and backdrop filter are drawn on the card's outer element, the one that holds Home Assistant's own border. A key you leave out keeps the theme's value. Setting only `border_color` recolours the theme border. If your theme has no border (width 0), set `border_width` too. `border_style: none` removes the border. A bare number is px, so `border_width: 2` is `2px`.

On a card with a `shape` the border is drawn along the shape, as a solid, dashed or dotted line.

`opacity` fades the whole card, text included, so a low value lowers contrast.

`backdrop_filter` blurs or tints what is behind the card. It only shows through a see-through background, so give the card a translucent `background` such as `rgba(0, 0, 0, 0.3)`, or use a theme with a see-through card. It takes `none` or up to six of `blur()`, `brightness()`, `contrast()`, `grayscale()`, `hue-rotate()`, `invert()`, `opacity()`, `saturate()` and `sepia()`, each with one plain number. A value that does not fit is ignored.

`margin` adds space around the card. It takes one to four lengths and no negative values. On a Sections dashboard the card keeps its cell and the space is inside it. A pop-up has no margin. All six keys also work in [conditional appearance](conditional-appearance.md) and sync from a template.

## Custom CSS

`css` holds CSS declarations for the card content. They are added after the card's own fields, so they win over `background`, `padding` and the rest.

```yaml
css: "letter-spacing: 0.5px; backdrop-filter: blur(6px)"
```

In a pop-up, `background` and `box-shadow` declarations go to the pop-up surface and `border-radius` is left out, like the card fields of the same name. The other declarations apply to the content inside the surface.

## Hover

`hover` holds design values that apply while the pointer is over the card content, on top of the card's own fields. It takes the same keys as the `hover` of a row, column or module design. With reduced motion turned on in the system, the change happens without a transition.

```yaml
hover:
  background: rgba(255, 255, 255, 0.08)
  box_shadow: 0 6px 20px rgba(0, 0, 0, 0.35)
```

See [Design](../design/README.md) for the keys.

## Shape, value background and seasonal scene

These work on the card as they do in a row, column or module design. The keys sit at the top level of the card. See [Design](../design/README.md) for their options.

```yaml
shape: squircle
shape_options:
  corner: 32px
value_background:
  type: fill
  entity: sensor.water_tank_level
seasonal: auto
```

-   `shape` clips the card to the outline and draws the theme's card border along it. `box_shadow`, or the theme's card shadow when it is unset, is drawn as a drop shadow that follows the shape. An open pop-up keeps a rectangular surface.
-   `value_background` on the card needs its own `entity`: the card has no entity to fall back on. It is not drawn in an open pop-up.
-   `seasonal` takes the full settings, a scene name such as `winter` (short for `scene: winter`), or `true` for Auto.

## Home Assistant layout keys

`grid_options` (sections view), `layout_options` (older sections view), `visibility` and `view_layout` are read by Home Assistant, not by the card. Use them as with any card:

```yaml
grid_options:
  columns: 12
  rows: auto
```

These keys belong to one card on one dashboard, so they are never saved into a template or taken from one.

A card in pop-up mode tells the sections view to give it a full-width, auto-height cell, which it then takes out of the layout. Your own `grid_options` win over that.

## Example

```yaml
type: custom:magic-card
name: Living room
use_page_theme: false
theme: Midnight
background: rgba(20, 30, 50, 0.8)
border_radius: 20px
padding: 16px
card_height: 160px
display:
  conditions:
    - type: state
      entity: person.me
      state: home
rows:
  - layout: "1-1"
    columns:
      - modules:
          - type: icon
            icon: mdi:sofa
      - modules:
          - type: info
            entity: sensor.living_room_temperature
```
