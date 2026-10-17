# Backgrounds

The Backgrounds section of the [Design tab](README.md), in the Style group.

| UI label | YAML key | Field | Values |
| --- | --- | --- | --- |
| Background | `background` | Text | CSS `background` shorthand, for example a gradient |
| Background color | `background_color` | Colour | Any CSS colour, `entity`, `entity N%` |
| Background image | `background_image` | Image | A browsed media item, a path or URL such as `/local/bg.jpg`, or a CSS image such as a gradient |
| Background position | `background_position` | Text | CSS position, for example `center` or `50% 20%` |
| Background size | `background_size` | Select | `auto`, `cover`, `contain` |
| Background repeat | `background_repeat` | Select | `repeat`, `no-repeat`, `repeat-x`, `repeat-y`, `space`, `round` |
| Background attachment | `background_attachment` | Select | `scroll`, `fixed`, `local` |
| Background clip | `background_clip` | Select | `border-box`, `padding-box`, `content-box` |
| Background origin | `background_origin` | Select | `border-box`, `padding-box`, `content-box` |
| Backdrop filter | `backdrop_filter` | Text | CSS backdrop filter, for example `blur(8px)` |

Nothing is set by default.

```yaml
design:
  background: linear-gradient(135deg, #1e3c72, #2a5298)
  border_radius: 16px
```

```yaml
design:
  background_image: media-source://media_source/local/backgrounds/kitchen.jpg
  background_size: cover
  background_position: center
  background_repeat: no-repeat
```

## Background colour and image

- `background_color` accepts an entity colour; `background` does not, because it is a free text property. Use `background_color: entity 20%` for a tint in the entity's colour. See [Entity colours](entity-colours.md).
- A gradient is set on `background`, the shorthand, with the Gradient option of Background color. The editor then removes `background_color`. Gradient rules and limits are on the [Gradients](gradients.md) page.
- `background` is a shorthand: it resets the other background keys that come before it in CSS. The card writes `background` first, then `background_color`, `background_image` and the rest, so the specific keys win.
- `background_color` (or `background` when there is no colour) also reaches the surfaces that some modules draw themselves (button, dropdown, slider, bar track, image).
- A browsed image is stored as its `media-source://` id and resolved when the card renders. Until it resolves, no image is drawn.
- A typed path or URL that starts with `/`, `http://`, `https://` or `data:` is wrapped in `url("...")` for you, so `background_image: /local/backgrounds/kitchen.jpg` works. Any other typed value, such as `url("...")` or a gradient, is used as CSS as it is.

To draw an entity's value behind the content (a tank fill or a history sparkline), use a [value background](value-backgrounds.md). It sits over these backgrounds and under the content.

## Backdrop filter

`backdrop_filter` blurs or tints what is behind the element. It only shows through a transparent or semi-transparent background:

```yaml
design:
  background_color: rgba(255, 255, 255, 0.08)
  backdrop_filter: blur(10px) saturate(140%)
```
