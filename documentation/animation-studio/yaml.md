# Animation YAML

An animation is one document: a set of shared fields, plus the fields of its kind. The studio exports and imports this format, the library stores it as JSON, and a card embeds it under `custom_animations`.

Every document is checked when it is saved, imported, loaded from the library or read from a card. The studio and the library refuse a document with an error as a whole, and the error names the field, for example `keyframes[2].transform.rotate Must be between -36000 and 36000.` A stored document holds only the fields of its kind, with every default written out.

Cards are more forgiving with the fields `rig`, `tracks`, `clips`, `bindings`, and `draw`, `stroke` and `easings` on keyframes. A card drops an invalid entry of these one by one and plays the rest of the document. An error in any other field still makes the card ignore the document.

-   [Units](#units)
-   [Shared fields](#shared-fields)
-   [Keyframes](#keyframes)
-   [Particles](#particles)
-   [Path](#path)
-   [Sequence](#sequence)
-   [Targets](#targets)
-   [Rig](#rig)
-   [Tracks](#tracks)
-   [Clips](#clips)
-   [Bindings](#bindings)
-   [CSS values](#css-values)
-   [Limits](#limits)
-   [In a card](#in-a-card)

## Units

Times are in seconds, lengths in px, angles in degrees, keyframe positions in % of the cycle and opacity from 0 to 1. Numbers can also be written as numeric strings (`"1.5"`).

## Shared fields

```yaml
id: doorbell-wiggle        # required
name: Doorbell wiggle      # required
kind: keyframes            # required: keyframes | particles | path | sequence
duration: 1.2
easing: ease-in-out
iterations: infinite
direction: alternate
target: icon
origin: 50% 100%
version: 1
```

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `id` | string | | Required. 1 to 64 characters: lowercase letters, digits, `-` and `_`, starting with a letter or digit. Cards reference it as `custom:<id>`. |
| `name` | string | | Required. Up to 80 characters. |
| `kind` | string | | Required. `keyframes`, `particles`, `path` or `sequence`. |
| `duration` | number | `1` | Seconds per cycle, 0.05 to 600. A sequence takes its length from its steps. |
| `easing` | string | `ease-in-out` | `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`, `spring`, `smooth`, `snap`, a `cubic-bezier()` with four numbers, or `steps(n)` with an optional `start`, `end`, `jump-start`, `jump-end`, `jump-none` or `jump-both`. |
| `iterations` | number or `infinite` | `infinite` | A number from 0.01 to 1000. |
| `direction` | string | `normal` | `normal`, `reverse`, `alternate` or `alternate-reverse`. `normal` is left out of the stored document. |
| `target` | string | `element` | `element` or `icon`: what the animation moves when a card's entry doesn't say. Used by keyframes and sequences. |
| `origin` | string | `center` | The transform origin: up to three keywords (`left`, `right`, `top`, `bottom`, `center`), lengths (`px`, `em`, `rem`) or percentages. |
| `version` | number | `1` | Only `1` is accepted. |

## Keyframes

```yaml
kind: keyframes
keyframes:
  - at: 0
    transform: { rotate: 0 }
  - at: 30
    transform: { rotate: 14, scale: 1.1 }
    color: var(--mc-anim-c)
    easing: ease-out
  - at: 100
    transform: { rotate: 0, scale: 1 }
```

`keyframes` is a list of 1 to 40 keyframes, sorted by `at`. It is required, unless the document has at least one entry in [`tracks`](#tracks): then it may be left out or hold 0 to 40 keyframes.

| Key | Type | Range | Notes |
| --- | --- | --- | --- |
| `at` | number | 0 to 100 | Required. Position in % of the cycle. |
| `transform.x`, `transform.y` | number | -10000 to 10000 | Offset in px |
| `transform.scale` | number | 0 to 100 | `1` is the normal size |
| `transform.scale_x`, `transform.scale_y` | number | -100 to 100 | Per axis, multiplied with `scale` |
| `transform.rotate` | number | -36000 to 36000 | Degrees |
| `transform.axis` | list of 3 numbers | Not all `0` | Rotation axis `[x, y, z]` for 3D turns, for example `[0, 1, 0]` to flip sideways. Default: the z axis. |
| `transform.skew_x`, `transform.skew_y` | number | -89 to 89 | Degrees |
| `opacity` | number | 0 to 1 | |
| `color` | string | | A CSS colour. See [CSS values](#css-values). |
| `background` | string | | A CSS colour or gradient |
| `shadow` | string | | A `box-shadow` value |
| `filter` | string | | A filter list (`brightness()`, `drop-shadow()`, `hue-rotate()` and so on). `blur` is added to it. |
| `blur` | number | 0 to 200 | px |
| `radius` | number | 0 to 1000 | Corner radius in px |
| `easing` | string | | Easing from this keyframe to the next, in the same forms as the shared `easing` |
| `easings` | map | | Easing per lane from this keyframe to the next, overriding `easing` for that lane. Keys: `x`, `y`, `scale`, `scale_x`, `scale_y`, `rotate`, `skew`, `opacity`, `color`, `background`, `shadow`, `blur`, `radius`, `filter`, `draw`, `stroke`. Values as for `easing`. `x` and `y` share one curve on the card, as do `scale`, `scale_x` and `scale_y`, and `filter` and `blur`; the studio sets them together. |
| `draw` | number | 0 to 1 | Part of the outline drawn. Only in a track on `part:`, `group:` or `shape:`; anywhere else it is an error. See [Draw on](parts.md#draw-on). |
| `stroke` | string | | Stroke colour of icon parts and shapes. See [CSS values](#css-values). |

`var(--mc-anim-c)` is the animation colour: the card entry's `color`, else the design colour, else the entity colour, else the theme's primary colour.

## Particles

```yaml
kind: particles
particles:
  shape: { emoji: "❄️" }
  count: 14
  direction: fall
  speed: 1
  size: [8, 16]
  colors: []
  spin: 180
  fade: true
  spread: 100
  gravity: 0.3
  layer: back
```

`particles` is required.

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `shape` | object | | Exactly one of `icon` (an icon id like `mdi:star`), `emoji` (up to 8 characters, none of `< > & " ' \ { } ;`) or `svg` (SVG markup up to 32 KB, with an `<svg>` element). Without a shape, each particle is a round dot. |
| `count` | whole number | `12` | 1 to 60 |
| `direction` | string | `fall` | `fall`, `rise`, `drift`, `burst`, `orbit` or `spiral` |
| `speed` | number | `1` | 0.1 to 10. One cycle takes `duration / speed`. |
| `size` | number or `[min, max]` | `[6, 12]` | px, each above 0 and up to 200, min not above max. A single number means `[n, n]`. |
| `colors` | list | `[]` | Up to 12 CSS colours, taken in turn. Empty: the animation colour. |
| `spin` | number | `0` | -3600 to 3600. Degrees per cycle; every other particle turns the other way. |
| `fade` | boolean | `true` | Fade in and out |
| `spread` | number | `100` | 0 to 100. % of the width particles start across (`fall`, `rise`), or the radius in % (`burst`, `orbit`, `spiral`). |
| `gravity` | number | `0` | -1 to 1. Positive pulls down, negative pulls up. |
| `layer` | string | `back` | `back` (behind the content) or `front` (over it) |
| `preset` | string | | A built-in particle, ring, scene or seasonal preset id. The animation then draws that preset: only `intensity`, the colour and the timing are used, and the fields above are ignored. |
| `intensity` | number | The preset's | The preset's parameter, with `preset` only |

## Path

```yaml
kind: path
path:
  d: "M0 0 C 20 -30 40 30 60 0 S 20 -10 0 0"
  units: px
  follow_rotation: false
  subject: element
```

`path` is required.

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `d` | string | | Required. SVG path data, up to 8192 characters, starting with `M` or `m`. Only path commands and numbers. The path has to draw something. Coordinates are the offset from the element's rest position; for particles, from the element's top left corner. |
| `units` | string | `px` | `px`, or `percent` (% of the moving element's own size) |
| `follow_rotation` | boolean | `false` | Turn the subject along the path |
| `subject` | string | `element` | `element`, `icon` or `particles` |
| `particles` | object | | With `subject: particles`: `shape`, `count` (default 3, 1 to 60), `size` and `colors`, as for [Particles](#particles) |

## Sequence

```yaml
kind: sequence
steps:
  - animation: pop
    delay: 0
    repeat: 1
  - animation: custom:doorbell-wiggle
    delay: 0.2
    duration: 0.8
    repeat: 2
loop: true
stagger: { children: false, delay: 0.1 }
```

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `steps` | list | | Required. 1 to 20 steps. |
| `steps[].animation` | string | | Required. A built-in motion preset id (no presets with their own layer) or `custom:<id>` of a keyframes or path animation. A sequence can't play itself. |
| `steps[].delay` | number | `0` | 0 to 600. Seconds after the previous step ends. |
| `steps[].duration` | number | The animation's | 0.05 to 600. Seconds per play. |
| `steps[].repeat` | whole number | `1` | 1 to 100. Plays of this step. |
| `loop` | boolean | `true` | Start again after the last step |
| `stagger.children` | boolean | `false` | Play on the element's children one after another (a row's columns, a column's modules) |
| `stagger.delay` | number | `0.1` | 0 to 10. Seconds between children. |

A `custom:` step whose animation is missing, or is a particles animation, a path with particles or a sequence, is accepted but skipped when the sequence plays.

## Targets

`tracks` and `bindings` name what they move with a target:

| Target | What it is |
| --- | --- |
| `element` | The whole module (or row, column, card) |
| `icon` | The module's icon |
| `name` | The name or label text. See [Card parts](card-parts.md). |
| `state` | The state or value text |
| `background` | The module's background |
| `part:<id>` | A part of the rig |
| `group:<id>` | A group of the rig |
| `shape:<id>` | A drawn shape of the rig |

A `part:`, `group:` or `shape:` target must exist in the document's `rig`.

## Rig

Keyframes documents only. The icon split into parts, groups of parts and drawn shapes, all in the units of the icon's viewBox (0 to 24 for Material Design Icons). See [Icon parts](parts.md) and [Drawing](drawing.md).

```yaml
rig:
  icon: mdi:bell-ring
  parts:
    - { id: bell, name: Bell, from: [0], origin: [12, 3] }
    - { id: clapper, name: Clapper, from: [1], origin: [12, 19] }
  groups:
    - { id: swing, name: Swing, parts: [bell, clapper] }
  shapes:
    - { id: spark, name: Spark, d: "M19 3 L20 5 L22 6 L20 7 Z", fill: entity, layer: over }
```

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `icon` | string | | The icon the parts come from, an icon id like `mdi:bell-ring`. Without `icon` and `svg`, the parts come from the module's own icon. |
| `svg` | string | | An own SVG as the source instead of `icon`, up to 32 KB. Set `icon` or `svg`, not both. |
| `parts` | list | `[]` | Up to 64 parts |
| `parts[].id` | string | | Required. 1 to 32 lowercase letters, digits, `-` or `_`, starting with a letter or digit. Unique among the parts, groups and shapes. |
| `parts[].name` | string | The id | Up to 80 characters |
| `parts[].from` | list | | The source's shapes this part is made of, as indices from 0 (up to 4095), 1 to 256 of them. Set `from` or `svg`. |
| `parts[].svg` | string | | Own geometry: SVG element markup, up to 32 KB, cleaned before it is drawn |
| `parts[].origin` | `[x, y]` | Centre of the part | Pivot in icon units, each from -10000 to 10000 |
| `groups` | list | | Up to 16 groups |
| `groups[].id`, `groups[].name` | string | | As for parts |
| `groups[].parts` | list | | Required. Ids of parts of this rig. A group without any valid part is dropped. |
| `groups[].origin` | `[x, y]` | | Pivot in icon units |
| `shapes` | list | | Up to 48 shapes. Keys: `id`, `name`, `d`, `fill`, `stroke`, `stroke_width`, `linecap`, `layer`, `origin`. See [Shapes in YAML](drawing.md#shapes-in-yaml). |

Shape indices follow the split the studio makes: for `mdi:bell-ring`, 0 is the bell, 1 the clapper, 2 the right wave and 3 the left wave. When a part names an index the icon does not have, the card shows the plain icon.

## Tracks

Keyframes documents only. Keyframes per target, next to the top-level `keyframes`, which stay the track of the document's `target`. All tracks share the document's timing.

```yaml
tracks:
  - target: part:clapper
    keyframes:
      - { at: 0, transform: { rotate: 0 } }
      - { at: 25, transform: { rotate: 18 } }
      - { at: 50, transform: { rotate: 0 } }
  - target: name
    origin: left center
    keyframes:
      - { at: 0, transform: { x: -16 }, opacity: 0 }
      - { at: 20, transform: { x: 0 }, opacity: 1 }
  - target: part:bell
    path: { d: "M0 0 C 1 -1 2 -1 3 0", follow_rotation: false }
```

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `target` | string | | Required. A [target](#targets). Only one track per target. |
| `keyframes` | list | `[]` | 0 to 40 keyframes in the format of [Keyframes](#keyframes). `draw` is allowed on `part:`, `group:` and `shape:` targets. |
| `origin` | string | | Transform origin of the target, as the shared `origin`. On a part it wins over the part's pivot. |
| `path` | map | | A motion path: `d` (path data as for [Path](#path), relative to the target's rest position; icon units on parts, px on card parts) and `follow_rotation` (boolean, default `false`). It plays after the keyframes, so it wins over `x` and `y`, and over `rotate` with `follow_rotation`. |

Up to 24 tracks. A track on `element` or `icon` plays on top of the top-level keyframes and wins where both set the same property.

## Clips

Any kind. What plays per state of the driving entity. See [State clips](states-and-values.md#state-clips).

```yaml
clips:
  - when: { state: "on" }
    animation: self
    transition: crossfade
  - when: { state: "off" }
    animation: none
```

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `when` | map | | Required. Exactly one of `state` (text, up to 255 characters), `state_not` (text), `entity_on` (`true` or `false`), `above` (number) or `below` (number). An unquoted `on` or `off` reads as the text "on" or "off". |
| `animation` | string | | Required. `self` (this document's own timeline), `none`, a preset id, or `custom:<id>` of another document. A document can't name itself with `custom:`. |
| `transition` | string | `cut` | `cut`, `crossfade` or `finish` |

Up to 12 clips. A clip that plays a document with clips of its own is skipped.

## Bindings

Keyframes documents only. An entity value driving a property of a target. See [Value bindings](states-and-values.md#value-bindings).

```yaml
bindings:
  - target: icon
    property: rotate_speed
    input: { attribute: percentage, min: 0, max: 100 }
    output: [0, 720]
    smoothing: 0.6
```

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `target` | string | | Required. A [target](#targets). |
| `property` | string | | Required. `rotate` (deg), `x`, `y` (px), `scale`, `opacity`, `draw` (0 to 1), `color_mix`, `speed` (playback rate) or `rotate_speed` (deg per second) |
| `input` | map | | Required, may be `{}` |
| `input.attribute` | string | | Attribute to read: 1 to 64 letters, digits, `_`, `.` or `-`, not starting with `.` or `-`. Without it, the state. |
| `input.min`, `input.max` | number | `0`, `100` | The input range, -1,000,000,000 to 1,000,000,000. They must differ; `max` below `min` inverts the binding. |
| `output` | list of 2 | | Required. `[from, to]`: numbers up to 1,000,000 either way, or two colours for `color_mix` |
| `smoothing` | number | | 0 to 10 seconds |

Up to 8 bindings.

## CSS values

`color`, `background`, `shadow`, `filter`, `stroke`, the shape colours, the `color_mix` colours and the particle `colors` are written into the card's style rules, so they are restricted:

-   Up to 600 characters.
-   Letters, digits, spaces and `# ( ) , . % + * / -` only. No quotes, semicolons, braces or comments.
-   Only these functions: `rgb`, `rgba`, `hsl`, `hsla`, `hwb`, `lab`, `lch`, `oklab`, `oklch`, `color`, `color-mix`, `var`, `light-dark`, `calc`, `min`, `max` and `clamp`. Backgrounds also take the linear, radial and conic gradients and their repeating forms. Filters also take `blur`, `brightness`, `contrast`, `drop-shadow`, `grayscale`, `hue-rotate`, `invert`, `opacity`, `saturate` and `sepia`.
-   `var()` only reads custom properties (`var(--name)`).

`url()` and other image functions are not allowed. Shape `fill` and `stroke` also take `currentColor` (the icon colour) and `entity` or `entity N%` (the entity colour).

## Limits

| Limit | Value |
| --- | --- |
| Animations in the library | 200 |
| Size of one document as JSON | 64 KB |
| Keyframes per animation | 40 |
| Particles | 60 |
| Sequence steps | 20 |
| Particle colours | 12 |
| Path data | 8192 characters |
| Name | 80 characters |
| One CSS value | 600 characters |
| Own SVG particle shape | 32 KB |
| Icon parts (`rig.parts`) | 64 |
| Groups (`rig.groups`) | 16 |
| Drawn shapes (`rig.shapes`) | 48 |
| Own SVG of a rig, or of one part | 32 KB |
| Tracks | 24 |
| Keyframes per track | 40 |
| Clips | 12 |
| Bindings | 8 |
| Part, group and shape ids | 32 characters |

The Magic Card Utils integration enforces the library and size limits too.

## In a card

`custom_animations` on the card holds documents in this format, as a list or as a map keyed by id. In a map, a document without an `id` field takes its key as the id (if the key is a valid id). The card checks them the same way, keeps the first of two documents with the same id, and ignores invalid ones with a warning in the browser console. Invalid entries in the newer fields are dropped one by one, as described at the top of this page. See [Sharing a card](using-in-cards.md#sharing-a-card).

```yaml
type: custom:magic-card
custom_animations:
  doorbell-wiggle:
    name: Doorbell wiggle
    kind: keyframes
    duration: 1.2
    keyframes:
      - at: 0
        transform: { rotate: 0 }
      - at: 50
        transform: { rotate: 12 }
      - at: 100
        transform: { rotate: 0 }
rows:
  - columns:
      - modules:
          - type: icon
            icon: mdi:bell
            design:
              animations:
                - id: ring
                  preset: custom:doorbell-wiggle
```
