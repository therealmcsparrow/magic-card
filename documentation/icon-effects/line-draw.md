# Line draw

Line draw traces the icon's outline, as if drawn with a pen, and then shows the icon. Part of [Icon effects](README.md).

| UI label | YAML key | Values | Default |
| --- | --- | --- | --- |
| Line draw | `icon_fx.draw` | `off`, `load` (On load), `change` (On change), `loop` (Loop) | `off` |
| Draw duration | `icon_fx.draw_duration` | CSS time (`s`, `ms`), or a number of seconds | `1.2s` |

| `draw` | Plays |
| --- | --- |
| `load` | Once, when the icon first appears |
| `change` | When the drawn icon changes (another state icon, another entity icon) or the entity turns on or off |
| `loop` | Over and over |

- On change reacts to the on and off side of the entity, not to every state change: a sensor's new reading or a cover going from `open` to `opening` doesn't replay it.
- Draw duration only shows while Line draw is on. Turning Line draw off (or resetting it) removes `draw_duration` too.
- With reduced motion turned on nothing is traced; the icon shows at once. A looping draw pauses while the icon is off-screen.

```yaml
type: button
entity: switch.coffee_machine
icon: mdi:coffee
icon_fx:
  draw: change
  draw_duration: 800ms
```

Line draw combines with [state icons and morphing](morphing-icons.md): with `draw: change` the outline is traced again each time the icon switches.
