# Slider layout

A swipeable carousel. Each child is one slide. It is built on Swiper.

| | |
| --- | --- |
| `type` | `slider-layout` |
| Category | Layout |
| Editor tabs | General, Actions, Conditions, Design |
| Children | `modules`, one per slide |
| New module | `modules: []`, `pagination: true`, `navigation: true` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Pagination | `pagination` | boolean | `true` | Bullets under the slides. |
| Navigation | `navigation` | boolean | `true` | Previous and next arrow buttons. |
| Slides per view | `slides_per_view` | 1 to 6, decimals allowed | `1` | Slides visible at once. A fraction such as `1.2` shows part of the next slide. |
| Space between slides (px) | `space_between` | number, 0 or more | `8` | Gap between slides in pixels. |
| Loop | `loop` | boolean | `false` | After the last slide, go back to the first one (and from the first back to the last). |
| Autoplay | `autoplay` | boolean | `false` | Moves to the next slide on a timer. |
| Autoplay delay (ms) | `autoplay_delay` | 1000 or more | `5000` | Time per slide. A value under 1000 uses 5000. Only in the editor while Autoplay is on. |
| (tree) | `modules` | list of modules | empty | The slides, one child each, in order. They are added and arranged in the structure tree, not in the General tab. See [Editing children](README.md#editing-children). |

## Behaviour

-   A child hidden by its display conditions gets no slide and no bullet.
-   Arrows and bullets only appear with two or more slides. Set `pagination` or `navigation` to `false` to leave them out.
-   Using the arrows and bullets does not trigger the slider layout's own actions.
-   In the studio canvas the slides cannot be dragged (a click selects a module) and autoplay is off. Selecting a child shows its slide.

To put several modules on one slide, make the slide a [vertical](vertical.md) or [horizontal](horizontal.md) layout.

## Example

```yaml
- type: slider-layout
  pagination: true
  slides_per_view: 1.2
  space_between: 12
  autoplay: true
  autoplay_delay: 8000
  modules:
    - type: camera
      entity: camera.front_door
    - type: camera
      entity: camera.garden
```
