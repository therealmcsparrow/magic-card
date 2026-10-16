# Device animations

A device animation moves the icon like the device it shows: a fan spins, a light glows, a heater shows a flame. Part of [Icon effects](README.md).

In the editor it is the Device animation select in the Icon effects group. The help line under it explains the choice.

| UI label | `icon_fx.device` |
| --- | --- |
| Off | not set (or `off`) |
| Auto | `auto` |
| Spin | `spin` |
| Glow | `glow` |
| Flame | `flame` |
| Drum | `drum` |
| Swing | `swing` |
| Pulse | `pulse` |
| Snow | `snow` |
| Shake | `shake` |
| Equalizer | `eq` |

Auto is only offered on a module with an entity.

## Auto

`auto` picks the animation from the entity's domain and state. Nothing moves in any other state.

| Entity | Animation |
| --- | --- |
| `fan` | Spin while on, faster at a higher `percentage` (0.6 s per turn at 100%, 3 s near 0%) |
| `light` | Glow while on, in the light's `rgb_color` and stronger at a higher `brightness` |
| `climate` | Flame while `hvac_action` is `heating` or `preheating`, Snow while `cooling`, Spin while `fan` |
| `vacuum` | Drum while `cleaning` |
| `sensor` | Drum while the state is `run`, `running`, `washing`, `drying`, `spin`, `spinning`, `rinse`, `wash` or `dry` (washer and dryer sensors) |
| `binary_sensor`, device class `running` | Drum while on |
| `binary_sensor`, device class `door`, `window`, `garage_door`, `opening` | Swing: a still, slightly opened pose while on |
| `binary_sensor`, device class `problem`, `smoke`, `gas`, `moisture`, `safety`, `carbon_monoxide`, `heat`, `tamper` | Pulse in the error colour while on |
| `cover` | Swing while `opening` or `closing`, a slightly opened pose while `open` |
| `lock` | Shake while `jammed`, Pulse while `locking`, `unlocking` or `opening` |
| `media_player` | Equalizer while `playing` |
| `alarm_control_panel` | Pulse in the error colour while `triggered` |
| `siren` | Pulse in the error colour while on |

Other domains have no Auto animation. The editor then says "Auto has no animation for this entity; pick one." For a supported entity it shows the rule and what plays now, for example "Auto for this entity: Spin while on, faster at a higher speed. Now: Spin."

The error colour is the theme's `--error-color`.

## A named animation

A named animation (`spin`, `glow` and so on) plays all the time, except while the entity rests: unavailable or unknown, or off for domains with an on and off state (a light or switch that is off, a cover that is closed, a lock that is locked, a vacuum that is docked, a climate whose `hvac_action` is `idle` or `off`, a paused media player). Help line: "Pauses while the entity is off or unavailable."

Sensors, weather entities and icons without an entity have no off state, so a named animation always plays there.

When Auto would pick the same animation for the entity's current state, the named one uses Auto's speed, strength and colour (a fan at its speed, a light in its colour). Otherwise it runs at 1.5 seconds per cycle at full strength.

## Examples

```yaml
type: icon
entity: fan.bedroom
icon: mdi:fan
icon_fx:
  device: auto
```

```yaml
# a sensor without an off state: always spins
type: info
entity: sensor.ventilation_flow
show_icon: true
icon: mdi:fan
icon_fx:
  device: spin
```

With reduced motion turned on the icon doesn't move. The animation also pauses while the icon is off-screen.
