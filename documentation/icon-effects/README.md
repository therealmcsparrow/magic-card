# Icon effects

Icon effects draw a module's icon as an SVG the card controls, so it can fill like a liquid, move like the device it shows, trace its outline, morph between icons and take duotone or gradient colours. They are set under `icon_fx` on the module.

Without `icon_fx` the icon renders exactly as before, as a normal Home Assistant icon.

## Pages

- [Liquid fill](liquid-fill.md): fill the icon by a value, such as a battery level
- [Device animations](device-animations.md): a fan that spins, a light that glows, a heater with a flame
- [Line draw](line-draw.md): trace the icon's outline
- [State icons and morphing](morphing-icons.md): an icon per on and off state, with a morph between them
- [Colours](colours.md): solid, duotone, gradient and value colours
- [Custom SVG](custom-svg.md): draw your own SVG as the icon

## Modules

| Module | Where the effects are in the General tab |
| --- | --- |
| Icon | Under the icon field. With an entity, Icon when on and Icon when off sit above the group. |
| Button | Under the icon field, the same as Icon |
| Info | Under the icon field, while Show icon is on |
| Light | Under the icon field |
| Tabs | Once a tab has an icon. The effects apply to every tab icon. |
| Weather, Forecast | While Animated icons is off (`animated_icons: false`) |

On Weather and Forecast, Animated icons replace the effects. Animated icons is on by default, so turn it off (`animated_icons: false`) to use icon effects there. Any `icon_fx` you set is kept and comes back when you turn Animated icons off. The editor says so: "Animated weather icons replace icon effects. Your icon effects are paused and come back when Animated icons is off."

See [Modules](../modules/README.md) for the rest of each module's options.

## The Icon effects group

The effects sit in a collapsible group, Icon effects. With effects set it shows a chip such as "2 set" and, when open, a Reset section button that removes `icon_fx` entirely. Each field has its own reset button while it is set. On a card linked to a template, the group has a sync indicator for `icon_fx`.

The Custom SVG switch and the state icons sit above the group, outside it.

## Keys

| Key | Page |
| --- | --- |
| `icon_fx.fill` | [Liquid fill](liquid-fill.md) |
| `icon_fx.device` | [Device animations](device-animations.md) |
| `icon_fx.draw`, `icon_fx.draw_duration` | [Line draw](line-draw.md) |
| `icon_fx.morph`, `icon_on`, `icon_off` | [State icons and morphing](morphing-icons.md) |
| `icon_fx.colors` | [Colours](colours.md) |
| `icon: svg`, `svg` | [Custom SVG](custom-svg.md) |

`icon_on`, `icon_off` and `svg` sit on the module next to `icon`, not inside `icon_fx`.

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: icon
            entity: sensor.phone_battery
            icon: mdi:battery
            size: 48px
            icon_fx:
              fill:
                min: 0
                max: 100
              colors:
                style: value
                gradient: ["#f44336", "#ffc107", "#4caf50"]
          - type: icon
            entity: fan.bedroom
            icon: mdi:fan
            size: 48px
            icon_fx:
              device: auto
          - type: button
            entity: lock.front_door
            icon_on: mdi:lock
            icon_off: mdi:lock-open-variant
            icon_fx:
              morph: true
```

Effects combine. A battery can fill, take value colours and trace its outline on load at the same time.

## Icon sources

Effects need the icon's shape. They work with:

- Material Design Icons and the other prefixes Home Assistant resolves itself (`mdi:`, `hass:`, `hassio:`, `hademo:`).
- Third-party icon packs that provide the shape, for example through `window.customIconsets` (the current HACS icon pack API) or the older `window.customIcons` API.
- Your own SVG (see [Custom SVG](custom-svg.md)).

An icon that can't be loaded, or a multi-colour logo, shows as it is without effects. The editor says: "Effects need the icon shape; this icon could not be loaded (or is a multi-color logo), so it is shown as is."

## Colour of the icon

The effects paint in the module's icon colour unless [Colours](colours.md) sets one. Module options such as `icon_color` and Use entity color still decide that base colour.

## Motion

- With reduced motion turned on in the system, nothing moves: no device animation, wave, line draw or morph. The fill level and the colours still show.
- Looping effects (device animations, the fill wave, a looping line draw) pause while the icon is off-screen.

## Related

- [Design animations](../design/animations.md) animate a whole module, or with Target Icon its icon, and combine with icon effects.
- [Value backgrounds](../design/value-backgrounds.md) fill a whole module, row or column by a value, the way liquid fill fills an icon.
- [Inspector](../inspector/README.md) and [Editor](../editor/README.md) for the General tab.
