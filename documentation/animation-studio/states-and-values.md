# States and values

An animation can react to an entity in two ways:

-   State clips choose what plays per state: a lamp glows while it is on and rests while it is off.
-   Value bindings tie a property to a number: a fan spins faster as its speed goes up, a battery icon turns from red to green as it charges.

Both read the driving entity, which is the module's entity unless the card sets another one.

-   [The driving entity](#the-driving-entity)
-   [State clips](#state-clips)
-   [Value bindings](#value-bindings)
-   [Bindings and the timeline](#bindings-and-the-timeline)
-   [Previewing in the studio](#previewing-in-the-studio)
-   [Example: a fan bound to its speed](#example-a-fan-bound-to-its-speed)
-   [Example: a lamp with on and off clips](#example-a-lamp-with-on-and-off-clips)
-   [More examples](#more-examples)

## The driving entity

Clips and bindings read the entity of the module that plays the animation. They work on rows, columns and the card too, but those have no entity of their own, so there they need one set on the entry.

To read another entity, set `entity:` on the animation's entry in the card:

```yaml
design:
  animations:
    - id: speed
      preset: custom:fan-speed
      entity: fan.living_room
```

In the card editor this is the "Entity for states and values" field under the entry. It only shows for animations from the library that have clips or bindings. Its placeholder names the module's entity, for example "Module entity (fan.bedroom)". Clearing it removes `entity:`.

The entry's Play condition (`trigger`, `trigger_entity`) still decides whether the animation plays at all. `entity:` only changes what the clips and bindings read.

## State clips

A clip says: when the entity matches this condition, play that. Clips work on every kind of animation.

### In the studio

The States section is in the inspector when nothing is selected. Each state is a card with:

| Field | Values |
| --- | --- |
| When | State is, State is not, Entity is on, Entity is off, Value above or Value below, with the value next to it. Value above and Value below take a number. |
| Play | Own timeline, Nothing (stop), one of My animations, or a motion preset |
| Transition | Cut (switch at once), Crossfade (fade out and back in, 0.2 s) or Finish cycle (let the current cycle end first) |

Move up, Move down and Delete state reorder and remove states. Add state adds one: the first added state is "State is on, Own timeline", the second "State is off, Nothing", then "Value above 50". An animation holds up to 12 states, and Add state is then disabled.

The Play list leaves out this animation itself (use Own timeline), animations that have states of their own, and particle and sequence animations. A state shows a warning when the card would play nothing for it:

-   "Unknown preset: plays nothing."
-   "Effect presets cannot play as a state: plays nothing."
-   "Use Own timeline to play this animation."
-   "Not in your animations: plays nothing until it is saved there."
-   "That animation has states of its own: the card skips this state."
-   "Particle and sequence animations cannot play as a state."

### How the card picks a clip

-   The clips are checked in order each time the card renders. The first match plays.
-   With no match, the animation's own timeline plays.
-   An entity that is missing, `unavailable` or `unknown` matches no clip, so the own timeline plays.
-   Entity is on (`entity_on: true`) uses Home Assistant's idea of active for the entity's domain: a cover that is open, a person who is home, a media player that is playing.
-   Value above and Value below compare the numeric state, strictly greater or smaller. A state that is not a number matches neither.
-   State is and State is not compare the state text. In YAML, an unquoted `on` or `off` is read as the state "on" or "off".

What a clip plays:

| `animation` | Plays |
| --- | --- |
| `self` | This animation's own timeline |
| `none` | Nothing for this entry |
| A preset id | That motion preset, with its own timing. Presets with their own layer (particles, scenes, backgrounds) play nothing. |
| `custom:<id>` | That keyframes or path animation, with its own timing. A particles or sequence animation plays nothing. An animation that has clips itself is skipped. |

The played clip keeps the entry's colour, strength, intensity, target, Play condition and `entity:`. A tap entry still plays its clip only on tap.

While a clip other than `self` plays, this animation's own tracks stop: [icon parts](parts.md) are drawn at rest (drawn shapes stay visible) and [card parts](card-parts.md) stay still. Value bindings keep applying, also under `none`.

### Transitions

| Transition | What happens |
| --- | --- |
| `cut` | Switches at once. The default. |
| `crossfade` | Fades the element (or the icon, for an icon entry) out over 0.1 s, switches, and fades back in over 0.1 s |
| `finish` | Lets the running cycle end, including the cycles of the icon parts and card parts, then switches |

The transition of the clip that starts is used. Going back to the own timeline uses the transition of the clip that ends. The first render after a page load never transitions. A new state that arrives during a transition replaces the pending one.

Two modules that show the same animation for the same entity switch together.

### In YAML

```yaml
clips:
  - when: { state: "on" }
    animation: self
    transition: crossfade
  - when: { state: "off" }
    animation: none
    transition: crossfade
  - when: { above: 30 }
    animation: shake-alert
```

| Key | Type | Notes |
| --- | --- | --- |
| `when` | map | Required. Exactly one of `state` (text, up to 255 characters), `state_not` (text), `entity_on` (`true` or `false`), `above` (number) or `below` (number). |
| `animation` | string | Required. `self`, `none`, a preset id or `custom:<id>`. A clip cannot name its own animation with `custom:`; use `self`. |
| `transition` | string | `cut` (default), `crossfade` or `finish` |

Up to 12 clips.

## Value bindings

A binding maps a number from the driving entity onto a property of one target. Bindings are for keyframes animations.

### In the studio

Select a target in the Layers column (Element, Icon, Name, State, Background, a part, a group or a shape). The Value bindings section in the inspector lists that target's bindings. Add value binding adds one: Rotation speed from 0 to 100, with 0.4 s smoothing.

| Field | Notes |
| --- | --- |
| Property | See the table below. Picking a property sets its usual output range. |
| Attribute | The attribute to read, such as `percentage` (fan) or `brightness` (light). Empty reads the state. Letters, digits, `_`, `.` and `-`. |
| Min, Max | The input range. The value is clamped to it. Min and Max must differ. Max below Min works and inverts the binding. |
| From, To | The output at Min and at Max, with the unit in the label. Colour mix has From colour and To colour. |
| Smoothing (s) | How long the property takes to follow a new value. 0 removes the smoothing. |

| Property | YAML | Output | Notes |
| --- | --- | --- | --- |
| Rotation speed | `rotate_speed` | °/s, default 0 to 720 | Spins the target continuously, faster as the value rises |
| Rotation | `rotate` | °, default 0 to 180 | Turns to an angle, like a needle or dial |
| Move X | `x` | px, default 0 to 12 | Icon units on parts and shapes |
| Move Y | `y` | px, default 0 to -12 | Icon units on parts and shapes |
| Scale | `scale` | ×, default 0.8 to 1.2 | |
| Opacity | `opacity` | 0 to 1, default 0.3 to 1 | |
| Draw | `draw` | 0 to 1, default 0 to 1 | Draws the outline on, like a level. Parts, groups and shapes only. |
| Colour mix | `color_mix` | Two colours | Blends from the first colour to the second. On Background it mixes the background colour, on a shape its fill, elsewhere the text and icon colour. |
| Playback speed | `speed` | ×, default 0.25 to 2 | Plays this animation's own keys on the target faster or slower |

An animation holds up to 8 bindings in total, over all its targets.

### How the card applies a binding

-   The value is read on every render: `(value - min) / (max - min)`, clamped to 0 to 1, then mapped onto From to To.
-   When the entity is unavailable, or the value is not a number, the binding keeps its last value. A rotation speed stops.
-   Rotation, Move X, Move Y and Scale on one target combine into one movement.
-   With reduced motion, Rotation speed and Playback speed do nothing. The other bindings still apply, since they set a still value.

### In YAML

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
| `target` | string | | Required. `element`, `icon`, `name`, `state`, `background`, `part:<id>`, `group:<id>` or `shape:<id>`. Rig targets must exist in the rig. |
| `property` | string | | Required. `rotate`, `x`, `y`, `scale`, `opacity`, `draw`, `color_mix`, `speed` or `rotate_speed` |
| `input` | map | | Required, may be empty (`{}`) |
| `input.attribute` | string | | Up to 64 letters, digits, `_`, `.` or `-`, starting with a letter, digit or `_`. Without it, the state is read. |
| `input.min` | number | `0` | Must differ from `max` |
| `input.max` | number | `100` | |
| `output` | `[from, to]` | | Required. Two numbers (each up to 1,000,000 either way), or two colours for `color_mix` |
| `smoothing` | number | | 0 to 10 seconds |

## Bindings and the timeline

A binding sets a still value under the target's own animation. When both touch the same thing:

-   Opacity, Colour mix and Draw write the same property as the timeline's Opacity, Color (or Background) and Draw on lanes. Where the timeline animates that property on the same target, the timeline wins while it plays, and the binding shows only when it does not.
-   Rotation, Move X, Move Y and Scale add to the timeline's Rotate, Move and Scale lanes. They lose only to a Skew lane, which replaces the binding's movement.
-   Rotation speed and Playback speed never conflict.

The Value bindings section warns about each of these, for example "The timeline also animates the opacity here: while it plays, its opacity wins over this binding."

## Previewing in the studio

While an animation has clips or bindings, a capsule at the foot of the stage stands in for the entity:

-   Preview state: On, Off, Unavailable, Value or Custom. Custom shows a field for any state text.
-   Preview value: a slider from 0 to 100%. It shows when a binding or clip reads a value. For an attribute, 0 to 100% runs across the binding's Min to Max. With Value as the state, the state becomes that number on the range of the first binding that reads the state, else 0 to 100.

The preview card uses a simulated entity, `light.mc_studio_preview`, so the preview follows the capsule and not a real device. It starts at On with the value at 60%, or at Value when a binding or condition reads the state as a number. Your choice stays while you edit, and resets when you open another animation.

## Example: a fan bound to its speed

The icon spins from standstill to two turns per second as the fan's `percentage` goes from 0 to 100, and its colour moves from grey to amber. The animation's own keyframes keep the icon still, so all movement comes from the bindings.

```yaml
id: fan-speed
name: Fan speed
kind: keyframes
duration: 1
target: icon
keyframes:
  - { at: 0, opacity: 1 }
  - { at: 100, opacity: 1 }
bindings:
  - target: icon
    property: rotate_speed
    input: { attribute: percentage, min: 0, max: 100 }
    output: [0, 720]
    smoothing: 0.6
  - target: icon
    property: color_mix
    input: { attribute: percentage, min: 0, max: 100 }
    output: ["#9e9e9e", "#ffb300"]
    smoothing: 0.6
```

On a card:

```yaml
type: icon
entity: fan.bedroom
icon: mdi:fan
design:
  animations:
    - id: speed
      preset: custom:fan-speed
```

When the fan is off, its percentage is 0 and the icon stands still. A fan that is unavailable stops spinning.

## Example: a lamp with on and off clips

The icon glows while the light is on and rests while it is off, with a crossfade between the two.

```yaml
id: lamp-states
name: Lamp states
kind: keyframes
duration: 2.4
easing: ease-in-out
iterations: infinite
target: icon
keyframes:
  - { at: 0, filter: "drop-shadow(0 0 0px var(--mc-anim-c))" }
  - { at: 50, filter: "drop-shadow(0 0 8px var(--mc-anim-c))" }
  - { at: 100, filter: "drop-shadow(0 0 0px var(--mc-anim-c))" }
clips:
  - when: { state: "on" }
    animation: self
    transition: crossfade
  - when: { state: "off" }
    animation: none
    transition: crossfade
```

On a card:

```yaml
type: button
entity: light.desk_lamp
icon: mdi:lamp
design:
  animations:
    - id: lamp
      preset: custom:lamp-states
      color: entity
```

An unavailable lamp matches no clip, so it plays the own timeline and glows. To keep it still when unavailable, give the animation still keyframes as its own timeline and play the glow from the on clip, for example `animation: glow-pulse`.

## More examples

A battery icon that turns from red to green with the charge level:

```yaml
bindings:
  - target: icon
    property: color_mix
    input: { min: 10, max: 90 }
    output: ["#f44336", "#4caf50"]
```

A gauge needle drawn as a part, turned by a temperature from 15 to 30 °C:

```yaml
bindings:
  - target: part:needle
    property: rotate
    input: { min: 15, max: 30 }
    output: [-90, 90]
    smoothing: 1
```

A level line that draws on with a tank's percentage:

```yaml
bindings:
  - target: shape:level
    property: draw
    input: { attribute: level }
    output: [0, 1]
```

A pulse that plays faster as the CO2 level rises:

```yaml
bindings:
  - target: element
    property: speed
    input: { min: 400, max: 2000 }
    output: [0.5, 3]
```
