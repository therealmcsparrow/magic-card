# Transitions and CSS animation properties

The Transitions & animations section of the [Design tab](README.md), in the Effects group, starts with the Animations list, the card's preset animations. That list has its own page: [Animations](animations.md). The fields below it are plain CSS properties.

| UI label | YAML key | Field | Values |
| --- | --- | --- | --- |
| Transition | `transition` | Text | CSS shorthand, for example `all 0.2s ease-out` |
| Transition property | `transition_property` | Text | For example `background-color, transform` |
| Transition duration | `transition_duration` | Unit (`s`, `ms`) | Time |
| Transition timing | `transition_timing_function` | Text | `ease`, `linear`, `cubic-bezier(...)` |
| Transition delay | `transition_delay` | Unit (`s`, `ms`) | Time |
| Transform | `transform` | Text | For example `scale(1.02)` or `rotate(-2deg)` |
| Transform origin | `transform_origin` | Text | For example `center` or `0 0` |
| Animation name | `animation_name` | Text | CSS `animation-name` |
| Animation duration | `animation_duration` | Unit (`s`, `ms`) | Time |
| Animation timing | `animation_timing_function` | Text | CSS timing function |
| Animation delay | `animation_delay` | Unit (`s`, `ms`) | Time |
| Iteration count | `animation_iteration_count` | Text | `infinite` or a number |
| Animation direction | `animation_direction` | Select | `normal`, `reverse`, `alternate`, `alternate-reverse` |
| Fill mode | `animation_fill_mode` | Select | `none`, `forwards`, `backwards`, `both` |
| Play state | `animation_play_state` | Select | `running`, `paused` |
| Filter | `filter` | Text | For example `grayscale(1)`, `brightness(0.8)`, `drop-shadow(0 2px 4px #0006)` |

Nothing is set by default.

## Transitions

A transition animates a change of another design value, for example when a [conditional rule](conditional-design.md) starts or stops matching:

```yaml
design:
  background_color: "#1e1e1e"
  transition: background-color 0.4s ease
  conditional:
    - id: on
      name: On
      conditions:
        - type: state
          entity: light.desk
          state: "on"
      design:
        background_color: "#3a2a00"
```

## The raw animation keys

The `animation_*` keys are written as inline CSS on the element. The card has no way to add your own `@keyframes` (Custom CSS takes declarations only), so use the [preset animations](animations.md) for motion. Inline values win over the card's stylesheet, so these keys also change the preset animations of the same element. Leave them empty unless you need that.

## Filter and transform

`filter` and `transform` apply to the whole element. Motion presets animate the separate `rotate`, `translate` and `scale` properties, so a static `transform` combines with them. Presets that animate a filter (Rainbow hue, Neon flicker, Glitch, Flame flicker, Heat shimmer) replace a static `filter` while they play.

On a card with [flow lines](../flows/README.md), a row or column with a filter, opacity or transform is lifted above the lines, so its background covers them.
