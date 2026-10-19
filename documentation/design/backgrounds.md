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

## Card backdrop

The card backdrop is a stack of up to four layers behind the card's content. Each layer is a picture, a gradient, a pattern or a colour. Set it in the Card backdrop group of the card's Design tab, in the Style group, or with `background_layers` in YAML.

The first entry is the front layer. The stack is drawn from the back, so later entries sit behind earlier ones. A fifth entry is ignored.

`background` and `background_image` still work. They sit at the bottom of the stack, under every backdrop layer.

```yaml
background_layers:
  - type: gradient
    gradient: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)
  - type: image
    image: /local/backgrounds/garden.jpg
    size: cover
```

| Key | Values | Default | Notes |
| --- | --- | --- | --- |
| `type` | `image`, `gradient`, `pattern`, `color` | required | The kind of layer. |
| `hidden` | boolean | `false` | Hides the layer and keeps it in the YAML. |
| `opacity` | 0 to 100 (%) | `100` | |
| `blend` | as in [Layers](layers.md#options-for-both) | `normal` | |

### Pictures

| Key | Values | Default | Notes |
| --- | --- | --- | --- |
| `image` | a path, URL or media item | | One picture. With `states`, it is the picture for any other state. |
| `entity` | entity id | the card's entity | Follows a device. The picture comes from `attribute`. |
| `attribute` | attribute name | `entity_picture` | The attribute that holds the picture. |
| `states` | state and picture pairs | | Changes with state. Matches the state exactly. |
| `position` | an anchor such as `center`, or `"50% 20%"` | `center` | |
| `size` | `cover`, `contain`, `auto` or `"<n>%"` | `cover` | Fill the card, Fit inside, Original size, or Custom size. |
| `repeat` | `no-repeat`, `repeat`, `repeat-x`, `repeat-y` | `no-repeat` | Only used when `size` is not `cover`. |
| `blur` | 0 to 24 (px) | `0` | Above 12 px is heavy for older tablets. |
| `refresh` | seconds, 5 or more | `10` | Camera pictures only. How often a still picture is fetched. |
| `stale_badge` | boolean | `true` | Camera pictures only. See [Stale pictures](#stale-pictures). |
| `pan_zoom` | object | off | See [Pan and zoom](#pan-and-zoom). |

Pictures come from one of three sources, in this order:

1. With `states`, the picture for the entity's current state. If no state matches, `image` is used.
2. With `entity`, the picture named by `attribute` on that entity. Leave out `entity` to use the card's entity.
3. Otherwise, `image`.

A new picture loads before it replaces the old one, over 0.3 seconds, so there is no blank frame. The change is instant when reduced motion is on or the card is paused.

If a picture is missing or fails to load, its layer shows nothing and the layers under it show through. The dashboard stays quiet. The editor shows a warning on that layer and on the group heading.

For pictures that change with state, the editor adds this note: "Pictures change but text stays. Darken behind text works for all of them. On a wall tablet seen from across the room, use large text." Darkening is set on the module, in [Darken behind text](layers.md#darken-behind-text).

### Gradients, patterns and colours

| Type | Keys | Notes |
| --- | --- | --- |
| `gradient` | `gradient` | A CSS linear or radial gradient with 2 to 8 stops. The head can be `<n>deg`, `to top`, `to bottom right` and so on. The corner heads are approximate on a card that is not square. |
| `pattern` | `pattern`, `color`, `size`, `thickness` | `pattern` is `dots`, `grid`, `lines`, `diagonal` or `checks`. `size` is the cell, 4 to 64 px. `thickness` is the line width, or the dot size for `dots` and `checks`, 1 to 8 px. |
| `color` | `color` | Any CSS colour. |

Patterns are drawn with CSS gradients, so they need no image.

### Pan and zoom

Pan and zoom slowly moves and scales a picture. It works on pictures and on camera still pictures. It does not work on live video.

| Key | Values | Default | Notes |
| --- | --- | --- | --- |
| `from` | 100 to 200 (%) | `100` | The starting scale. |
| `to` | 100 to 200 (%) | `115` | The final scale. |
| `focus` | an anchor | `center` | The point the framing ends on. |
| `duration` | 10 to 120 (s) | `30` | One pass. |
| `alternate` | boolean | `true` | Goes back and forth. |
| `pause_when_idle` | boolean | `false` | The editor turns it on when you first switch on the motion option. |

Pan and zoom moves only while the card is on screen, the page is visible and the card is not paused. With reduced motion or low-power mode, it rests at its starting frame. With `pause_when_idle: true`, it rests after 2 minutes without a touch, key press or pointer movement, and starts again with the next one. See [Reduced motion and what pauses](layers.md#reduced-motion-and-what-pauses).

### Live camera or still picture

A camera can appear in two places. They cost very different amounts on a wall tablet.

| | Camera module set to Behind others | Card backdrop picture from a camera |
| --- | --- | --- |
| What it shows | Live video | A still picture, refreshed every 5 seconds or more (default 10) |
| Cost on a wall tablet | High, runs all day | Low |
| Pan and zoom | No | Yes |
| Taps | Go through (default) | Not applicable |

For a quiet backdrop, use a still picture in the card backdrop. Use a live camera module only when you need live video.

### Stale pictures

A camera picture is marked stale when either of these happens:

- Three refreshes in a row fail.
- The last good picture is older than the larger of three times the refresh interval and 60 seconds.

A stale picture is dimmed and greyed. A label reading "Not updated" and how long ago the last good picture arrived shows in the top-right corner of the card. It clears with the next good picture. Set `stale_badge: false` to turn this off.

### Low-power mode

`layers_low_power: true` on the card drops blur, blend and pan and zoom for that card's backdrop and layered modules. Pictures, opacity and darkening stay. The editor shows a cost line (light, medium or heavy) and says why.

### Conditional appearance

A design rule that sets `background_layers` replaces the whole list, including an empty one. The rule view says so: "This rule uses its own backgrounds instead of the normal ones."

### Example

```yaml
layers_low_power: false
background_layers:
  - type: gradient
    gradient: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)
  - type: image
    entity: camera.garden
    refresh: 10
    pan_zoom:
      from: 100
      to: 115
      duration: 30
      pause_when_idle: true
  - type: image
    entity: weather.home
    states:
      sunny: /local/backgrounds/sun.jpg
      rainy: /local/backgrounds/rain.jpg
    image: /local/backgrounds/cloud.jpg
```

Here the gradient is the front layer, the garden camera is behind it, and the weather picture is at the back.
