# Slider

A slider for an entity's numeric value. What it sets depends on the entity's domain. The service call goes out when you let go, or while you drag if [Update while dragging](#look) is on.

| | |
| --- | --- |
| `type` | `slider` |
| Category | Controls |
| Editor tabs | General, Actions, Conditions, Design |
| Suits | See [Domains](#domains). Other entities (sensors) are shown read-only. |
| New module | `show_value: true`, `direction: horizontal` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Entity | `entity` | entity id | none | The entity. |
| Attribute | `attribute` | attribute name | domain default | Which value to set, see [Domains](#domains). |
| Min | `min` | number | the entity's minimum | Narrows the range. |
| Max | `max` | number | the entity's maximum | Narrows the range. |
| Step | `step` | number above 0 | the entity's step | The step. |
| Show value | `show_value` | boolean | `true` | Shows the value next to the slider. `false` hides it. |
| Direction | `direction` | `horizontal`, `vertical` | `horizontal` | Orientation. |
| Slider color | `slider_color` | colour, or an entity colour | design text colour, else theme primary | Colour of the slider. See [Entity colours](#entity-colours). |
| Track color | `track_color` | colour, or an entity colour | design `background`, else the default track | Colour of the track. See [Entity colours](#entity-colours). |

Empty Min, Max and Step use the entity's own range and step. The editor shows them as placeholders.

Slider color and Track color are checked the same way as the slider look colours. A value that is not a colour falls back to the next choice in the table. A gradient in design `background` does not fill the track: set Track color to a colour instead.

The look options (track, fill, handle, value display, shape, stops and live updates) are in [Look](#look) below.

-   Min and max only narrow the entity's range. Values outside what the entity accepts fall back to the entity's own limits, so the slider never sends a value the entity refuses.
-   A step is used when it is a multiple of the entity's step. Otherwise the entity's step applies.
-   Min greater than or equal to max shows "Min must be less than max". A step of 0 or less shows "Step must be greater than 0".

When the entity or attribute cannot be set, the slider is disabled and the editor says so.

## Entity colours

Slider color, Track color, End colour and Border colour take an entity colour, as other colour fields do. Turn on **Entity colour** for the field, then pick a source in **Colour from**:

- **State colour** (`entity`): the entity's state colour. A light shows its own colour while it is on. Other entities use the theme colour for their state.
- **An attribute** (`entity.<attr>`), for example `rgb_color` or `hs_color`. The list offers only the attributes of the entity that hold a colour.

Add an opacity with a percentage: `entity 50%`, or `entity.rgb_color 50%`. Choosing 100% removes it.

| Value | Meaning |
| --- | --- |
| `entity` | The state colour, at full opacity |
| `entity 50%` | The state colour at 50% opacity |
| `entity.rgb_color` | The colour in the entity's `rgb_color` attribute |
| `entity.hs_color 50%` | The colour in the entity's `hs_color` attribute, at 50% opacity |

- An entity with no colour for the chosen source counts as not set. For example, a sensor has no state colour, and a missing or non-colour attribute gives none. The slider then uses its design colour, else its default.
- Plain colours, such as `#ff9800` or a theme variable, work as before.
- Use the light's colour still wins for the fill of a light, as described under [Look](#look).
- On browsers without `color-mix()`, a theme colour at less than 100% shows at full opacity.

## Look

A slider has a look when one of the look keys below is set. A slider without one looks and works as before, and the look code is not loaded. The Look block is in the General tab, under Track colour. Set the keys in YAML, or use the editor. The editor reads them back the same way, so opening and saving a slider without changes leaves its YAML as it was.

Presets are editor only. Picking one clears the look keys, then writes its own. Each setting stays editable afterwards.

| Preset | Sets | Looks like |
| --- | --- | --- |
| Minimal | Thin track, round handle, value beside it | Thin line, round handle, value beside it |
| Material | Standard bar, round handle with a border | Standard bar with a round handle |
| Neon | Thin pink track, round glowing handle | Glowing line, round glowing handle |
| Glass | Glass track, pill handle, value in the track | See-through track, pill handle |
| Big fill | Big fill track, no handle, value in the track, auto fill, updates while you drag | Large fill with icon and value. Updates while you drag. |

Reset look removes the look keys, Slider colour and Track colour. After a preset or Reset look, a notice with **Undo** stays for 20 seconds. An **Undo** button also stays in the Look header until you change a look setting. Undo goes back one step.

### Track and fill

| Label | Key | Values | Default | Effect |
| --- | --- | --- | --- | --- |
| Track style | `track_style` | `standard`, `thin`, `pill`, `segmented`, `glass`, `big-fill` | `standard` | The shape of the track. Standard removes the key. |
| Thickness (px) | `track_thickness` | 2 to 96 | `40` standard, `6` thin, `16` pill and segmented, `28` glass, `64` big fill | Track width (height when vertical). Under 6 px, the touch area stays 40 px. |
| Track corners (px) | `track_radius` | 0 to 48 | The style's own corners | Standard follows the corners set in the Design tab. Pill is fully round. Big fill is 20 px. |
| Segments | `segments` | 2 to 20 | From the step, at most 20 | Segmented only. |
| Gap (px) | `segment_gap` | 1 to 8 | `2` | Segmented only. |
| Blur behind | `glass_blur` | `true`, `false` | `false` | Glass only. Blurs what is behind the track. Off gives a flat, see-through fill. Blur can slow down older wall tablets. |
| Fill | `fill_mode` | `solid`, `gradient`, `auto` | `solid` | The shape of the fill. See below. |
| End colour | `slider_color_to` | Any colour, or an entity colour | None | Gradient only. The fill runs from the start colour to this one. |
| Use the light's colour | `use_entity_color` | `true`, `false` | `false` | Starts the fill with the light's own colour. Lights only. |
| Update while dragging | `live` | `true`, `false` | `false` | Sends changes while you drag, at most 4 a second. The final value always goes out when you let go. Works on every track style. The Big fill preset turns it on. |

The start colour is the light's own colour when Use the light's colour is on and the light has one. Otherwise it is Slider colour. Fill then sets the shape:

- Solid: the start colour everywhere.
- Gradient: the start colour to End colour.
- Auto, brightness: the start colour with a dark overlay. The overlay is black at 75 % at the low end and fades to nothing at the high end.
- Auto, colour temperature: from warm to cool, whatever the start colour is.
- Auto, any other entity: solid.

On a light card, the fill is darkened where it is too pale to show against the card (a contrast of 3:1), as the handle is. Dark cards are not changed.

Use the light's colour combines with every fill. Auto works with brightness and colour temperature sliders. The editor disables it for other entities and says why.

### Handle

Handle is the grip of the slider. The key is `thumb`.

| Label | Key | Values | Default | Effect |
| --- | --- | --- | --- | --- |
| Handle | `thumb` | `line`, `circle`, `pill`, `square`, `none` | `line` | Line removes the key. None draws a track with no handle. |
| Size (px) | `thumb_size` | 4 to 64 | `20` circle, `28` pill, `18` square | The long side. Line uses half the thickness. A pill's short side is 0.57 times its size. |
| Border (px) | `thumb_border` | 0 to 6 | `0` | Circle, pill and square. |
| Border colour | `thumb_border_color` | Any colour, or an entity colour | White | |
| Glow (px) | `thumb_glow` | 0 to 30 | `0` | Glows in the fill colour. |
| Icon | `thumb_icon` | `mdi:name` | None | Circle, pill and square only. |

Handle options apply to circle, pill and square. The Border and Icon keys are ignored for other handles.

### Value display

| Label | Key | Values | Default | Effect |
| --- | --- | --- | --- | --- |
| Where | `value_position` | `beside`, `bubble`, `track`, `hidden` | `beside` (`track` for Big fill) | Beside the slider, in a bubble while you drag, in the track, or hidden. |
| Show value | `show_value` | `true`, `false` | `true` | `false` hides the value whatever Where says. |
| Ticks | `ticks` | `true`, `false` | `false` | Tick marks. Labelled stops get longer ticks. |
| Tick every | `tick_every` | A number | Auto: 5 to 10 ticks | Distance between ticks. |
| Min and max labels | `show_limits` | `true`, `false` | `false` | Shows the lowest and highest value at the ends. |

- Show value and Where stay in step. Hidden writes `show_value: false`. Picking another position removes `show_value`.
- Bubble: it shows while you drag, while the slider has keyboard focus, and for 2 seconds after you let go or tap. Touch screens have no hover, so this is how a value shows on them.
- Hidden needs a handle. The editor refuses Hidden while Handle is None. If the YAML sets both, the card still draws it as written and the editor shows a warning.
- Handle None while the value is hidden moves Where to Beside the slider, and the editor says so.
- In the track: the value sits in a small chip, so it stays readable on any fill.
- Min and max labels, tick labels and stop labels use rem, so they grow with the text size.

### Shape

| Label | Key | Values | Default | Effect |
| --- | --- | --- | --- | --- |
| Slider shape | `track_shape` | `custom`, `squircle`, `hexagon`, `octagon`, `blob`, `wave`, `notch`, `ticket`, `pill`, `circle`, `none` | None | The track and fill follow this shape. See [Shapes](../../design/shapes.md). |
| Shape options | `track_shape_options` | Shape options | None | Set in the shape editor. |

The track and fill are clipped to the shape. The handle stays on the track and is not clipped. The focus ring is never clipped.

### Stops

| Label | Key | Values | Default | Effect |
| --- | --- | --- | --- | --- |
| Stops | `stops` | List of `value` and `label`, at most 12 | None | Named points on the slider, shown as ticks with a label. |
| Snap to stops | `snap` | `true`, `false` | `false` | Dragging and the arrow keys go from stop to stop. |

```yaml
- type: slider
  entity: light.desk
  stops:
    - value: 0
      label: "Off"
    - value: 30
      label: Dim
    - value: 100
      label: Bright
  snap: true
```

- Stops outside Min and Max are ignored.
- A label shows up to 8 characters on the card. The full text is in the editor and for screen readers.
- Home and End go to the first and last stop.

### Big fill

Big fill is a large track with the entity's icon and its value. It is for wall tablets and phones.

| Label | Key | Values | Default | Effect |
| --- | --- | --- | --- | --- |
| Entity icon | `show_icon` | `true`, `false` | `true` | Shows the entity's icon. |
| Icon | `icon` | `mdi:name` | The entity's icon | Overrides the entity's icon. |
| Icon position | `icon_position` | `start`, `center` | `start` | Centre needs a vertical slider. |

- A horizontal Big fill is as thick as its thickness setting. A vertical one is 12 rem high, with 1.5 rem of space above and below, so a swipe can always start off the track.
- Where the fill meets the empty track, the text and icon have a thin outline in the opposite colour, so they stay readable.
- With Update while dragging on, the entity follows your finger as you drag. If a drag is cancelled, the entity keeps the last value that was sent, and nothing is sent to restore the old one.

### Errors and reduced motion

- Failed call: the fill goes back to the entity's value. For 5 seconds the track shows an outline in the error colour and an alert icon at the value end, and screen readers hear "Couldn't set {name}". The colour is never the only cue.
- Reduced motion: the handle does not grow while you drag, and the bubble appears and disappears without a fade. Nothing moves while the slider is idle.
- Keyboard: arrows move by one step. Page Up and Page Down move by a tenth of the range. Home and End go to the ends, or to the first and last stop.
- Touch: on a horizontal slider, a sideways drag on the track moves the value, and the page still scrolls up and down. A vertical slider works the other way round. Start a swipe on the card background, not on the track, to change view.

### Right to left

When the card is shown right to left, a horizontal slider mirrors.

- The fill starts at the right edge, and a drag measures from the right.
- Gradients run with the reading direction, so a brightness or colour temperature fill gets brighter or warmer towards the left.
- The handle, ticks, tick labels, bubble, value in the track and error mark sit from the right.
- The Left and Right arrow keys swap, so Right still moves towards the end you read.
- A shaped track stays as drawn. The fill is clipped to the same shape, and only the fill direction changes.
- A vertical slider is unchanged.
- Home, End, Page Up, Page Down and the values read by screen readers are unchanged.

The slider follows the direction of the page and of its own container, and updates when either changes. Your card layout is never mirrored. See [Accessibility](../../accessibility/README.md#right-to-left).

## Domains

| Domain | Attribute | Value | Service |
| --- | --- | --- | --- |
| `input_number`, `number` | none | The state, with the entity's min, max and step | `set_value` |
| `light` | none, `brightness` or `brightness_pct` | Brightness 0 to 100 % | `light.turn_on` with `brightness_pct`. 0 turns the light off. |
| `light` | `color_temp_kelvin` (or `color_temp`) | Colour temperature in kelvin across the light's range, step 50 | `light.turn_on` with `color_temp_kelvin` |
| `fan` | none or `percentage` | Speed 0 to 100 % (0 while off) | `fan.set_percentage`, if the fan supports speeds |
| `cover` | none or `current_position` | Position 0 to 100 % | `cover.set_cover_position`, if supported |
| `cover` | `current_tilt_position` | Tilt 0 to 100 % | `cover.set_cover_tilt_position`, if supported |
| `valve` | none or `current_position` | Position 0 to 100 % | `valve.set_valve_position`, if supported |
| `media_player` | none or `volume_level` | Volume 0 to 100 % | `media_player.volume_set`. Not while the player is off. |
| `climate` | none or `temperature` | Target temperature, with the entity's min, max and step | `climate.set_temperature` |
| `climate` | `target_temp_low`, `target_temp_high` | One end of a target range | `climate.set_temperature` with both ends |
| `climate` | `humidity` | Target humidity | `climate.set_humidity` |
| `water_heater` | none or `temperature` | Target temperature | `water_heater.set_temperature` |
| `humidifier` | none or `humidity` | Target humidity | `humidifier.set_humidity` |

Any other domain or attribute is read-only: the slider shows the numeric value but cannot be moved.

## Example

```yaml
- type: slider
  entity: cover.living_room_blinds
  show_value: true
  slider_color: "#ff9800"
```

```yaml
- type: slider
  entity: light.desk
  attribute: color_temp_kelvin
  direction: vertical
```
