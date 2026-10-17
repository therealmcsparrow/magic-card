# Animations

Animations are presets the card renders itself. You pick a preset and adjust its timing, colour and intensity. A module, row or column stores them under `design.animations`. The card stores them under `animations` at the top level.

With the Magic Card Utils integration you can also build your own animations in the [animation studio](../animation-studio/README.md). They appear in the Preset list under My animations and are stored as `preset: custom:<id>`. See [Using animations in cards](../animation-studio/using-in-cards.md).

In the editor they are the Animations list at the top of the Transitions & animations section of the [Design tab](README.md), in the Effects group. On the card they are in the card's Design tab (see [Card options](../card/README.md)).

To make a module's icon move in parts, pick an animation in the icon picker's Animated icons tab, or build one in the animation studio and pick it from My animations. A pick from the icon library needs no integration, because the card stores the animation in its own `custom_animations`. See [Icon animations in cards](quick-icon-animator.md).

## Contents

- [Example](#example)
- [Several animations on one element](#several-animations-on-one-element)
- [Entry fields](#entry-fields)
- [Play conditions](#play-conditions)
- [Colour and strength](#colour-and-strength)
- [Presets](#presets)
- [Catalogue presets](#catalogue-presets)
- [Reduced motion](#reduced-motion)
- [Older configs](#older-configs)

## Example

```yaml
type: icon
entity: fan.bedroom
icon: mdi:fan
design:
  animations:
    - id: spin
      preset: spin
      target: icon
      trigger: entity_on
      duration: 1.2s
    - id: glow
      preset: glow-pulse
      trigger: entity_on
      color: entity
      strength: 60
```

## Several animations on one element

An element can have any number of animations. Add animation appends one (the first preset, Breathe, with its values filled in). Each entry is a block titled "Animation N · preset name" with a delete button.

Presets that animate different things combine: Float (position) with Glow pulse (glow) with Spin (rotation). Two presets that animate the same thing on the same element don't combine, and the later one wins. The editor marks such an entry with a note, for example "Overrides Spin: both animate the rotation". Particle, sweep, ring and seasonal presets draw their own layer and never conflict.

The channels are rotation, position, scale, opacity, filter and glow. A glow is a box shadow on a module, row or column, and a drop-shadow filter on an icon, so a glow on an icon conflicts with a filter preset on the same icon.

## Entry fields

| UI label | YAML key | Values | Default |
| --- | --- | --- | --- |
| Preset | `preset` | A preset id (see [Presets](#presets)), or `custom:<id>` for an animation from the library | Required |
| Target | `target` | `module`, `icon` | `module` |
| Entity for play condition | `trigger_entity` | An entity id | The module's entity |
| Play | `trigger` | `always`, `entity_on`, `state`, `tap` | `always` |
| State value | `state` | A state, for `trigger: state` | |
| Color | `color` | Any CSS colour, `entity`, `entity N%` | See [Colour and strength](#colour-and-strength) |
| Strength (%) | `strength` | 0 to 100 | 100 |
| Duration | `duration` | CSS time: `2s`, `600ms`, or a number of seconds | The preset's |
| Delay | `delay` | CSS time | `0s` |
| Easing | `easing` | `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`, `spring`, `smooth`, `snap`, or a `cubic-bezier()` or `steps()` function | The preset's |
| Repeat | `iterations` | `infinite` or a number above 0 | The preset's |
| Direction | `direction` | `normal`, `reverse`, `alternate`, `alternate-reverse` | The preset's |
| Intensity (label varies) | `intensity` | A number in the preset's range | The preset's |

Every entry also has an `id`. The editor generates it. An entry without one still works.

- Choosing a preset writes all its values (duration, delay, easing, repeat, direction, intensity and, where it applies, strength) into the entry, so you see and edit them. Target, play condition, state and colour stay. Tap ripple and Press switch Play to On tap. A [seasonal preset](#seasonal) writes only its density.
- Reset to preset puts those values back to the preset's.
- Target only shows for Icon, Button, Light and Weather modules. `icon` animates only the module's main icon. In YAML it also works on an Info module. A module without an icon (a button with no icon) animates as a whole. Cards, rows and columns always animate themselves.
- Repeat offers Infinite, 1, 2, 3, 5 and Custom. Custom shows Repeat count for any whole number.
- Duration and Delay are unit fields with `s` and `ms`.
- The intensity field is labelled by the preset, for example "Rotation (deg)", "Scale (%)", "Glow size (px)" or "Particles". Values outside the preset's range are clamped.
- Easing `spring` is `cubic-bezier(0.34, 1.56, 0.64, 1)`, `smooth` is `cubic-bezier(0.45, 0, 0.55, 1)`, `snap` is `cubic-bezier(0.7, 0, 0.3, 1)`.
- An unknown preset id shows as "id (unknown)" and draws nothing.

## Play conditions

| UI label | `trigger` | Plays |
| --- | --- | --- |
| Always | `always` | All the time |
| While entity is on | `entity_on` | While the entity is active |
| While state equals… | `state` | While the entity's state equals `state` exactly |
| On tap | `tap` | Once from the pointer position, each time the element is pressed |

- The entity is `trigger_entity`, or the module's entity when that is empty. Cards, rows and columns have no entity, so they need `trigger_entity` for `entity_on` and `state`. Until there is an entity those options are disabled in the editor, and an existing one shows "Pick an entity: this condition never plays without one."
- "Active" uses Home Assistant's rules per domain: a cover that is not closed, a lock that is not locked, a person who is not `not_home`, a media player that isn't idle, off or on standby. `off`, `unavailable`, `unknown`, `idle` and `standby` never count.
- An On tap animation set to repeat forever plays once per tap. A finite repeat plays that many times.
- On tap starts when the pointer goes down, and works on elements without a tap action too.

## Colour and strength

The colour paints glows, particles and coloured filters. The first of these that is set wins:

1. The entry's `color`.
2. The design's `color` (text colour).
3. On a module, the entity's state colour.
4. The theme's `--primary-color`.

`entity` and `entity N%` use the module entity's state colour, see [Entity colours](entity-colours.md). The editor offers it on modules with an entity.

Strength (%) shows for presets that paint a colour: the glows, particle, sweep and ring presets, and Flame flicker, Neon flicker and Glitch. It sets how strongly the colour is painted (a particle layer's opacity). Other presets ignore it.

## Presets

Presets are grouped as in the editor's Preset select. Duration is the preset's default. Intensity shows the field label, its default and its range.

Particle layers (marked "layer") draw inside the element, behind its content, clipped to its border radius or [shape](shapes.md). Layers marked "front" draw over the content. Ring presets draw a stroke along the element's outline or shape, like a [ring](ring.md). Particle counts go up to 12.

### Glow and pulse

| Preset | Name | Duration | Intensity |
| --- | --- | --- | --- |
| `breathe` | Breathe | 3.2s | Scale (%) 4, 0 to 50 |
| `glow-pulse` | Glow pulse | 2s | Glow size (px) 16, 0 to 60 |
| `halo-ripple` | Halo ripple | 1.8s | Ring size (px) 14, 0 to 60 |
| `aura` | Aura | 4s | Glow size (px) 24, 0 to 60 |
| `heartbeat` | Heartbeat | 1.4s | Scale (%) 12, 0 to 50 |

### Motion

| Preset | Name | Duration | Intensity |
| --- | --- | --- | --- |
| `spin` | Spin | 2s | Rotation (deg) 360, 0 to 1080 |
| `fast-spin` | Fast spin | 0.6s | Rotation (deg) 360, 0 to 1080 |
| `sway` | Sway | 2.4s | Angle (deg) 6, 0 to 90 |
| `wobble` | Wobble | 1.2s | Distance (px) 6, 0 to 60 |
| `shake-alert` | Shake alert | 2s | Distance (px) 4, 0 to 60 |
| `rumble` | Rumble | 0.3s | Distance (px) 1, 0 to 10 |
| `float` | Float | 3s | Distance (px) 6, 0 to 60 |
| `pendulum` | Pendulum | 2.4s, alternate | Angle (deg) 20, 0 to 90 |
| `orbit` | Orbit | 4s | Radius (px) 6, 0 to 40 |
| `coin-spin` | Coin spin | 3s | Rotation (deg) 360, 0 to 1080 |
| `rotate-3d` | 3D rotate | 3s, alternate | Tilt (deg) 25, 0 to 180 |
| `squash-stretch` | Squash & stretch | 1.4s | Squash (%) 14, 0 to 50 |
| `wiggle` | Wiggle | 2.5s | Angle (deg) 8, 0 to 45 |
| `shadow-lift` | Shadow lift | 3s | Lift (px) 4, 0 to 20 |

### Playful

These play a short move followed by a rest, so they read as attention cues.

| Preset | Name | Duration | Intensity |
| --- | --- | --- | --- |
| `bounce` | Bounce | 1.6s | Height (px) 10, 0 to 60 |
| `jello` | Jello | 1.8s | Squash (%) 12, 0 to 50 |
| `rubber-band` | Rubber band | 1.6s | Stretch (%) 25, 0 to 50 |
| `tada` | Tada | 2s | Angle (deg) 3, 0 to 45 |
| `swing` | Swing | 2s | Angle (deg) 15, 0 to 90 |
| `flip` | Flip | 2.4s | Rotation (deg) 360, 0 to 1080 |
| `pop` | Pop | 1.8s | Scale (%) 18, 0 to 50 |
| `head-shake` | Head shake | 1.6s | Distance (px) 6, 0 to 30 |

### Light and colour

The Preset select adds the catalogue's light presets to this group, see [Light and colour (catalogue)](#light-and-colour-catalogue).

| Preset | Name | Duration | Intensity |
| --- | --- | --- | --- |
| `shine-sweep` | Shine sweep (layer, front) | 3s | Shine (%) 45, 0 to 100 |
| `blink` | Blink | 1s | Dim (%) 85, 0 to 100 |
| `neon-flicker` | Neon flicker | 3s | Glow size (px) 8, 0 to 30 |
| `rainbow-hue` | Rainbow hue | 6s | Hue range (deg) 360, 0 to 720 |
| `glitch` | Glitch | 2.5s | Offset (px) 3, 0 to 20 |
| `fade-pulse` | Fade pulse | 2.4s | Fade (%) 60, 0 to 100 |
| `holographic-shimmer` | Holographic shimmer (layer, front) | 5s | Strength (%) 35, 0 to 100 |
| `scanline` | Scanline (layer, front) | 3s | Brightness (%) 50, 0 to 100 |
| `twinkle` | Twinkle (layer, front) | 2.4s | Particles 6, 1 to 12 |
| `spotlight` | Spotlight (layer) | 7s | Brightness (%) 45, 0 to 100 |

### Rings and sweeps

| Preset | Name | Duration | Intensity |
| --- | --- | --- | --- |
| `ping` | Ping (layer) | 2s | Ring size (%) 90, 0 to 200 |
| `ripple-rings` | Ripple rings (layer) | 3s | Rings 3, 1 to 6 |
| `radar-sweep` | Radar sweep (layer) | 3s | Beam width (deg) 70, 0 to 180 |
| `conic-border-spin` | Conic border spin (layer) | 3s | Border width (px) 2, 0 to 12 |
| `breathing-border` | Breathing border | 3s | Border width (px) 2, 0 to 12 |

### Borders

| Preset | Name | Duration | Intensity |
| --- | --- | --- | --- |
| `border-snake` | Border snake (ring) | 3s | Width (px) 3, 0 to 12 |
| `neon-border` | Neon border | 2.4s | Glow size (px) 10, 0 to 30 |
| `power-flow` | Power flow dots (ring) | 4s | Dot size (px) 5, 0 to 12 |
| `marching-ants` | Marching ants (ring) | 20s | Width (px) 2, 0 to 12 |

The ring presets draw a snake, chasing dots or moving dashes along the outline, following the border radius. Their stroke uses the entry colour, else the animation colour.

### Weather and device

| Preset | Name | Duration | Intensity |
| --- | --- | --- | --- |
| `flame-flicker` | Flame flicker | 1.2s | Flicker (%) 5, 0 to 30 |
| `steam-rise` | Steam rise (layer) | 3s | Particles 4, 1 to 12 |
| `bubbles` | Bubbles (layer) | 3.5s | Particles 6, 1 to 12 |
| `snow-fall` | Snow fall (layer) | 5s | Particles 6, 1 to 12 |
| `rain-fall` | Rain fall (layer) | 0.9s | Particles 6, 1 to 12 |
| `liquid-wave` | Liquid wave (layer) | 6s | Fill level (%) 40, 0 to 100 |
| `storm-flash` | Storm flash (layer, front) | 5s | Brightness (%) 75, 0 to 100 |

### Scenes

| Preset | Name | Duration | Intensity |
| --- | --- | --- | --- |
| `fireflies` | Fireflies (layer) | 6s | Particles 8, 1 to 12 |
| `confetti` | Confetti (layer) | 3.5s | Particles 10, 1 to 12 |
| `falling-leaves` | Falling leaves (layer) | 7s | Particles 5, 1 to 12 |
| `lightning` | Lightning (layer, front) | 4s | Brightness (%) 90, 0 to 100 |
| `ocean-waves` | Ocean waves (layer) | 4s | Wave height (%) 35, 0 to 100 |
| `sun-rays` | Sun rays (layer) | 24s | Ray width (deg) 6, 0 to 30 |
| `heat-shimmer` | Heat shimmer | 1.2s | Strength (px) 2, 0 to 10 |
| `wind-lines` | Wind lines (layer) | 2.2s | Particles 5, 1 to 12 |
| `drip` | Drip (layer) | 2.4s | Particles 3, 1 to 12 |
| `equalizer-bars` | Equalizer bars (layer) | 0.9s, alternate | Bars 5, 1 to 12 |
| `charging-stripes` | Charging stripes (layer) | 1s | Stripe strength (%) 100, 0 to 100 |
| `orbit-dots` | Orbit dots (layer) | 2.4s | Dots 3, 1 to 8 |
| `typing-dots` | Typing dots (layer) | 1.2s | Bounce (px) 4, 0 to 20 |

### Backgrounds

Scenes that fill the element behind its content.

| Preset | Name | Duration | Intensity |
| --- | --- | --- | --- |
| `aurora` | Aurora | 12s | Glow (%) 55, 0 to 100 |
| `lava-lamp` | Lava lamp | 9s, alternate | Particles 5, 1 to 12 |
| `plasma-gradient` | Plasma gradient | 10s | Strength (%) 70, 0 to 100 |
| `gradient-flow` | Gradient flow | 8s, alternate | Strength (%) 60, 0 to 100 |
| `color-cycle-bg` | Color cycle background | 10s | Strength (%) 35, 0 to 100 |
| `starfield` | Starfield | 3.5s | Particles 12, 1 to 12 |
| `meteor-shower` | Meteor shower | 3s | Particles 4, 1 to 12 |
| `bokeh` | Bokeh | 8s, alternate | Particles 7, 1 to 12 |
| `matrix-rain` | Matrix rain | 2.4s | Streams 10, 1 to 12 |
| `smoke` | Smoke | 6s | Particles 5, 1 to 12 |
| `clouds-drift` | Clouds drift | 30s | Clouds 3, 1 to 6 |
| `water-ripple` | Water ripple | 4s | Ripples 3, 1 to 8 |
| `fireworks` | Fireworks | 2.2s | Sparks 10, 1 to 12 |

### Seasonal

The [seasonal scenes](seasonal.md) of the card, drawn inside one module, row or column. Each one is a layer behind the content with its own timing, so it has no Duration, Delay, Easing, Repeat, Direction, Target or Color. Intensity is Density (%), 50 by default, 0 to 100.

| Preset | Name | Draws |
| --- | --- | --- |
| `winter` | Winter | Snowflakes, with frost and icicles as border decorations |
| `spring` | Spring | Blossom petals, with a flowering vine |
| `summer` | Summer | Sun glow, butterflies and golden motes |
| `autumn` | Autumn | Falling leaves and a little drizzle |
| `christmas` | Christmas | Snow and twinkling stars, with Christmas lights |
| `new_year` | New Year | Fireworks and confetti |
| `valentine` | Valentine | Rising hearts |
| `easter` | Easter | Petals and bobbing eggs |
| `halloween` | Halloween | Bats and low fog, with a cobweb and a pumpkin |
| `weather` | Live weather | The scene of a weather entity's state: snow, rain, a thunderstorm, sun, clouds, fog, wind or a night sky |
| `daynight` | Day and night | Follows `sun.sun`: stars and fireflies at night, a warm glow at dusk and dawn, nothing by day |
| `snow` | Snowy | Snowflakes |
| `rain` | Rainy | Rain |
| `storm` | Thunderstorm | Rain and lightning flashes |
| `sun` | Sunny | Sun glow and golden motes |
| `clouds` | Cloudy | Drifting clouds |
| `fog` | Foggy | Fog bands |
| `wind` | Windy | Wind lines and blown leaves |
| `night` | Night sky | Moon glow, stars and fireflies |
| `dusk` | Dusk glow | A warm low glow and a few stars |

A seasonal entry in the editor shows Preset, the play condition, Density (%) and Strength (%). Strength is the opacity of the layer. Presets with border decorations (Winter, Spring, Christmas and Halloween) also show a Border decorations switch; turning it off writes `decorations: false`.

- `weather` reads the entry's Entity for play condition when that is a `weather.*` entity, else the module's entity. Without a weather entity, or in a weather state that has no scene, it draws nothing.
- The other presets are fixed scenes. They don't change with the date.
- Choosing a seasonal preset removes the entry's duration, delay, easing, repeat and direction. Choosing another preset afterwards removes `decorations`.

```yaml
type: weather
entity: weather.home
design:
  animations:
    - id: sky
      preset: weather
```

See [Seasonal scenes](seasonal.md#seasonal-presets) for the particle budget a card shares between its scene and these presets.

### Interaction

These start with Play set to On tap and play once.

| Preset | Name | Duration | Intensity |
| --- | --- | --- | --- |
| `tap-ripple` | Tap ripple (layer, front) | 0.6s | Brightness (%) 35, 0 to 100 |
| `press` | Press | 0.3s | Depth (%) 6, 0 to 30 |

## Catalogue presets

The Preset select also lists the preset catalogue: ready-made animations in themed groups. They load with the editor from `magic-card-preset-catalogue.js`, so the list can take a moment to show them. If they cannot load, the select shows the built-in presets only. Light and colour presets from the catalogue appear in the built-in Light & colour group; every other theme has its own group after the built-in ones.

A catalogue preset is a full animation document. When you pick one, the editor copies that document into the card's `custom_animations` as `cat-<id>`, and the entry plays it as `preset: custom:cat-<id>`. The card plays the copy itself, so it works without the Magic Card Utils integration and dashboards never load the catalogue. Two entries that pick the same preset share one copy. Animation ids that start with `cat-` are reserved for catalogue presets, and the editor removes every `cat-` copy in the card's `custom_animations` that no entry plays any more. A card keeps its copy as it is, so later changes to the catalogue don't reach cards that already use a preset.

The fields work like those of an animation from My animations: empty fields follow the document. Plays says what moves: the module's icon, the whole element, or a particle layer drawn inside the element. All particle presets are baked loops. Duration is the document's own.

A module entry that plays Hearth flicker looks like this. The editor writes the copy under `custom_animations` at the top of the card when you pick the preset.

```yaml
design:
  animations:
    - id: fire
      preset: custom:cat-fire-hearth-flicker
```

### Fire and heat

| Preset | Name | Plays | Duration |
| --- | --- | --- | --- |
| `custom:cat-fire-hearth-flicker` | Hearth flicker | Icon | 1.3s |
| `custom:cat-fire-heating-up` | Heating up | Icon | 2.4s |
| `custom:cat-fire-rising-embers` | Rising embers | Particle layer | 3s |
| `custom:cat-fire-licking-flames` | Licking flames | Particle layer | 1.6s |
| `custom:cat-fire-chimney-smoke` | Chimney smoke | Particle layer | 4s |
| `custom:cat-fire-sparkler` | Sparkler | Particle layer | 2s |

### Cleaning

| Preset | Name | Plays | Duration |
| --- | --- | --- | --- |
| `custom:cat-clean-soap-bubbles-pop` | Soap bubbles that pop | Particle layer | 4s |
| `custom:cat-clean-fresh-sparkle` | Fresh sparkle | Particle layer | 2.4s |
| `custom:cat-clean-robot-vacuum-glide` | Robot vacuum glide | Icon | 2.4s |
| `custom:cat-clean-washer-spin-cycle` | Washer spin cycle | Icon | 1.6s |
| `custom:cat-clean-dishwasher-steam` | Dishwasher steam | Particle layer | 3.2s |
| `custom:cat-clean-spray-mist` | Spray mist | Particle layer | 1.8s |
| `custom:cat-clean-wipe-clean` | Wipe clean | Icon | 2s |

### Christmas

| Preset | Name | Plays | Duration |
| --- | --- | --- | --- |
| `custom:cat-xmas-snow-settle` | Snow that settles | Particle layer | 8s |
| `custom:cat-xmas-new-year-fireworks` | New Year fireworks | Particle layer | 3.2s |
| `custom:cat-xmas-jingle-bell` | Jingle bell | Icon | 2.4s |
| `custom:cat-xmas-bauble-sway` | Bauble sway | Icon | 3s |
| `custom:cat-xmas-present-hop` | Present hop | Icon | 2.4s |
| `custom:cat-xmas-golden-star-shower` | Golden star shower | Particle layer | 3.2s |
| `custom:cat-xmas-fairy-lights` | Fairy light glow | Icon | 3s |

### Halloween

| Preset | Name | Plays | Duration |
| --- | --- | --- | --- |
| `custom:cat-halloween-bat-flight` | Bat flight | Particle layer | 4s |
| `custom:cat-halloween-ghost-float` | Ghost float | Icon | 3.6s |
| `custom:cat-halloween-jack-o-lantern-glow` | Jack-o'-lantern glow | Icon | 2.6s |
| `custom:cat-halloween-creeping-fog` | Creeping fog | Particle layer | 8s |
| `custom:cat-halloween-bubbling-cauldron` | Bubbling cauldron | Particle layer | 2.8s |
| `custom:cat-halloween-spider-drop` | Spider drop | Icon | 3.6s |
| `custom:cat-halloween-skull-chatter` | Skull chatter | Icon | 2.8s |

### Valentine

| Preset | Name | Plays | Duration |
| --- | --- | --- | --- |
| `custom:cat-valentine-lub-dub` | Lub-dub heartbeat | Icon | 1.2s |
| `custom:cat-valentine-floating-hearts` | Floating hearts | Particle layer | 3s |
| `custom:cat-valentine-heart-burst` | Heart burst | Particle layer | 2.4s |
| `custom:cat-valentine-falling-petals` | Falling petals | Particle layer | 4s |
| `custom:cat-valentine-blush-glow` | Blush glow | Element | 3s |
| `custom:cat-valentine-cupid-sparkle` | Cupid sparkle | Particle layer | 3s |

### Home automation

| Preset | Name | Plays | Duration |
| --- | --- | --- | --- |
| `custom:cat-home-leak-drip-splash` | Leak drip & splash | Particle layer | 2.4s |
| `custom:cat-home-fan-running` | Fan running | Icon | 1.2s |
| `custom:cat-home-doorbell-ring` | Doorbell ring | Icon | 3s |
| `custom:cat-home-motion-detected` | Motion detected | Icon | 2s |
| `custom:cat-home-mail-arrived` | Mail arrived | Icon | 3s |
| `custom:cat-home-energy-flow` | Energy flow | Particle layer | 4s |
| `custom:cat-home-garden-sprinkler` | Garden sprinkler | Particle layer | 2s |

### Light and colour (catalogue)

| Preset | Name | Plays | Duration |
| --- | --- | --- | --- |
| `custom:cat-light-lamp-breathe` | Lamp breathe | Icon | 3.2s |
| `custom:cat-light-lamp-switch-on` | Lamp switch-on | Icon | 2.4s |
| `custom:cat-light-sunbeam-dust` | Sunbeam dust | Particle layer | 4s |
| `custom:cat-light-candlelight` | Candlelight | Element | 2.8s |
| `custom:cat-light-sunrise-warm-up` | Sunrise warm-up | Icon | 4s |
| `custom:cat-light-party-sparkle` | Party sparkle | Particle layer | 3s |

## Reduced motion

With reduced motion turned on in the operating system or browser, no preset animation plays and particle and ring layers are hidden. A seasonal preset shows a still picture of its scene instead.

## Older configs

Older configs store one animation in single keys: `animation_preset`, `animation_target`, `animation_speed` (`slow`, `normal`, `fast`), `animation_trigger`, `animation_state` and `animation_color`. The card still reads them as one entry. Editing the list in the editor writes `animations` and removes the old keys. When `animations` is set, the old keys are ignored.
