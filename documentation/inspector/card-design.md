# Card: Design tab

The card's Design tab holds the card-level look. It is shorter than the design panel of rows, columns and modules (see [Design](../design/README.md)). Back to the [inspector overview](README.md).

| UI label | YAML key | Type / values | Default | What it does |
| --- | --- | --- | --- | --- |
| Background color | `background` | CSS colour or background value | Theme card background | Background of the card content. |
| Background image | `background_image` | Browsed media, a path or URL, or a CSS image value such as a gradient | none | Image behind the content, set to cover the card and centred. Browse picks a file from Home Assistant media; the card resolves it when it renders. A typed path or URL (`/local/bg.jpg`, `https://…`, `data:…`) is wrapped in `url(...)` for you. Any other value is used as CSS. |
| Border radius | `border_radius` | CSS length | Theme default | Corner radius of the card. A pop-up uses it for its surface too (a single value only). A shape replaces it. |
| Card height | `card_height` | CSS length | auto | Minimum height of the card content. |
| Padding | `padding` | One to four CSS lengths | `16px` | Space inside the card around the rows. Edit per side, or link the sides with Same on all sides. Stored as one CSS shorthand string. |
| Box shadow | `box_shadow` | CSS `box-shadow` value | none | Shadow of the card content (in a pop-up, of the pop-up surface), for example `0 4px 12px rgba(0,0,0,0.3)`. On a shaped card the first shadow follows the shape as a drop shadow. |
| Animations | `animations` | List of preset animations | none | Animations of the whole card. A card animation needs a trigger entity when its trigger reads an entity. See [Design](../design/README.md). |
| Template animations | `hidden_animations`, `custom_animations` | Hide, Show or Use template per document | none | Only on a card linked to a template that has `custom_animations`. Lists the template's animation documents with their state on this card. See [Template animations](#template-animations). |
| Ring | `ring` | Ring settings | off | An outline that follows the card's corners (or its shape), filled by a value or animated. It is drawn inside the card's edge. A value ring needs an entity. See [Design](../design/README.md). |
| Shape | `shape`, `shape_options` | None, Squircle, Pill, Circle, Hexagon, Octagon, Notch, Ticket, Wave, Blob, plus the options of that shape | None | The outline of the card. The card is clipped to it and the theme's card border is drawn along it. See [Design](../design/README.md). |
| Value background | `value_background` | Off, Fill, Sparkline, plus their fields | Off | A fill level or a history sparkline behind the rows. On the card it needs its own entity. See [Design](../design/README.md). |
| Seasonal | `seasonal` | A scene (Auto, a season, a holiday, Weather, Day and night, None) plus its options | none | A seasonal scene of particles and border decorations behind or over the content. See [Design](../design/README.md). |
| Hover | `hover` | Design values | none | Design values applied while the pointer is over the card, on top of the fields above. The reset button removes them all. See [Design](../design/README.md). |
| Custom CSS | `css` | CSS declarations | none | Declarations applied to the card's content, for example `letter-spacing: 0.5px`. They come after the fields above, so they win. |

When a shape or the seasonal border decorations are on, the card's padding grows where needed so the rows keep clear of the edge.

On a card linked to a template, the shape and its options sync as one field.

## Template animations

On a linked card, the Template animations section sits under Animations. It lists every animation document of the template by name, with a tag and a button:

| Tag | Meaning | Button |
| --- | --- | --- |
| From template | The card plays the template's version. | Hide leaves it out on this card (`hidden_animations`). |
| Hidden | The card leaves it out. | Show plays it again. |
| Changed on this card | The card has its own document with this id. | Use template removes the card's own document. |

The sync indicator next to the section title keeps the whole list local (`custom_animations` in `not_synced`). The section then says "This card uses only its own custom_animations." See [Template animations](../editor/templates.md#template-animations).

Background, border radius, padding, box shadow, card height and the theme can be overridden while conditions match. See [Conditional appearance](conditions-tab.md#conditional-appearance-card-only).

`overflow` (`visible`, `hidden` or `auto`) has no field in the editor and is YAML only. See [Card options](../card/card-options.md).
