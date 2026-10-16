# Card parts

A keyframes animation can move parts of a module separately from the module itself: its name, its state, its icon and its background. The name slides in while the background pulses, or the state text fades while the icon bounces. Each part is a target with its own track on the timeline.

-   [Targets](#targets)
-   [Which modules have which parts](#which-modules-have-which-parts)
-   [In the studio](#in-the-studio)
-   [The generated background layer](#the-generated-background-layer)
-   [How the parts combine](#how-the-parts-combine)
-   [Limits](#limits)
-   [Example: name slides in, background pulses](#example-name-slides-in-background-pulses)

## Targets

| Target | YAML | What moves |
| --- | --- | --- |
| Element | `element` | The whole module, as the top-level keyframes do |
| Icon | `icon` | The module's icon |
| Name | `name` | The name or label text |
| State | `state` | The state or value text |
| Background | `background` | The module's background, without the content on it |

The top-level `keyframes` of an animation move its main target (`target: element` or `target: icon`). The tracks in `tracks` move the other targets. See [Targets on the timeline](keyframes.md#targets-on-the-timeline).

A track can also target `element` or `icon`. Its keys then play on top of the top-level keyframes and win where both animate the same property. Keep the keys of the main target in the top-level keyframes to avoid surprises.

## Which modules have which parts

| Module | Icon | Name | State | Background |
| --- | --- | --- | --- | --- |
| Icon | The icon | | | Generated layer |
| Button | The icon | The label | The state | Generated layer |
| Info | The icon | The name | The state. The secondary info line stays still. | Generated layer |
| Light | The icon | The name | The secondary line | Generated layer |
| Text | | The whole text | | Generated layer |
| Bar | | | The value text | The bar's track |
| Gauge | | The name | The value text | The gauge's arc track |
| Other modules | | | | Generated layer |

A target the module does not have does nothing. Only the module that plays the animation is affected: parts of modules inside a layout module (horizontal, vertical and so on) stay still when the layout module plays a card-part animation. The same goes for value bindings.

Rows, columns and the card itself play card-part animations too, but they have no icon, name or state of their own: those belong to the modules inside. On them only Element and Background play. A row or column moves its own design background on a generated layer. On the card the layer takes the card's theme background; a background set in the card's own design stays put.

Name and state texts turn and scale about the side they are aligned to: a left-aligned name scales from its left edge. A track `origin` sets another point.

## In the studio

The Card parts panel in the Layers column lists Element, Icon, Name, State and Background:

-   A row shows when the preview tile has that part, when the animation animates it (with "Not on this tile"), or when it is selected.
-   A dot marks the targets that have keys.
-   A hint names the parts the tile lacks, for example "Name, State and Background are not on the Icon tile. Switch the preview tile to Card to see them."

Click a row to select the target. The timeline then shows its lanes and the inspector shows its value bindings.

The Card preview tile is an Info module with an icon, name, state and background: a thermometer, "Living room" and "21.5 °C". It shows every card part.

## The generated background layer

Most modules have no background element of their own. When an animation has a `background` track, the card puts a layer behind the module's content and moves the module's background onto it. Moving, scaling or fading the layer leaves the text and icon where they are.

-   The layer covers the module and follows its corner radius. In a shaped module it is clipped to the shape.
-   A value background and particle layers are drawn over the layer.
-   A hover background is carried over to the layer.
-   The layer is only there while such an animation plays. Without it, and with reduced motion, the module looks as before.

Exceptions:

-   While a background track plays, Background keys on the element's own keyframes have no effect on that module. Put background colour keys on the Background track.
-   A Button draws its background on the button face, so its layer is transparent. Give the Background track a `background` colour key to see it move.
-   Bar and Gauge have their own background element (the track), so they get no layer. The gauge's track is an SVG arc: move, scale, turn, opacity and stroke colour work on it, but Background, Corner radius and Shadow keys do not.

## How the parts combine

-   Two animations on the same module that move the same part both play on it, each with its own timing.
-   Presets and other animations on the module keep playing.
-   The same animation on two modules, or with two durations on one page, plays with each entry's own timing.
-   With reduced motion no card-part track plays.
-   While a [state clip](states-and-values.md#state-clips) other than the own timeline plays, the card-part tracks stop.

## Limits

-   At most 24 tracks per animation (card parts, icon parts and shapes together), with up to 40 keys each.
-   Card-part tracks need the runtime file `magic-card-anim-runtime.js` next to `magic-card.js`. Until it has loaded, only the top-level keyframes play.

## Example: name slides in, background pulses

The name slides in from the left and holds, then fades out at the end of the cycle. The background swells and fades twice per cycle.

```yaml
id: name-slide-pulse
name: Name slides in, background pulses
kind: keyframes
duration: 4
easing: ease-in-out
iterations: infinite
tracks:
  - target: name
    keyframes:
      - { at: 0, transform: { x: -24 }, opacity: 0, easing: ease-out }
      - { at: 15, transform: { x: 0 }, opacity: 1 }
      - { at: 85, transform: { x: 0 }, opacity: 1 }
      - { at: 100, transform: { x: 0 }, opacity: 0 }
  - target: background
    origin: center
    keyframes:
      - { at: 0, opacity: 1, transform: { scale: 1 } }
      - { at: 25, opacity: 0.6, transform: { scale: 1.03 } }
      - { at: 50, opacity: 1, transform: { scale: 1 } }
      - { at: 75, opacity: 0.6, transform: { scale: 1.03 } }
      - { at: 100, opacity: 1, transform: { scale: 1 } }
```

On an Info module:

```yaml
type: info
entity: sensor.living_room_temperature
show_icon: true
design:
  background_color: var(--secondary-background-color)
  border_radius: 12px
  padding: 12px
  animations:
    - id: intro
      preset: custom:name-slide-pulse
```
