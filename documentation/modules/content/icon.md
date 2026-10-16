# Icon

Shows one icon. It can follow an entity: use the icon Home Assistant picks for the entity, and colour it the way Home Assistant colours the entity's state.

| | |
| --- | --- |
| `type` | `icon` |
| Category | Content |
| Editor tabs | General, Actions, Conditions, Design |
| Suits | Any entity, or none. State colours work for the domains Home Assistant colours by state (light, switch, climate, cover and so on). |
| New module | `icon: mdi:home`, `size: 24px` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Entity | `entity` | entity id | none | The entity for the options below, design colours and animation triggers. |
| Use entity icon | `use_entity_icon` | boolean | `false` | Uses the entity's icon as Home Assistant resolves it (entity registry, `icon` attribute, state defaults). Hides the Icon field. |
| Use entity color | `use_entity_color` | boolean | `false` | Colours the icon like Home Assistant does for the entity's current state. |
| Icon | `icon` | icon name, for example `mdi:lamp` | `mdi:help` | The icon. `svg` draws your own SVG, see [Icon effects](../../icon-effects/README.md). |
| Icon effects | `icon_fx`, `icon_on`, `icon_off`, `svg` | mapping, icon names, SVG markup | none | Liquid fill, device animation, line draw, morph, colours, icons per state. See [Icon effects](../../icon-effects/README.md). |
| Icon color | `icon_color` | colour | inherited | The icon colour. |
| Size | `size` | CSS size, for example `32px` | `24px` | The icon size. |

## Colour order

The first that applies wins:

1.  The entity's state colour, with Use entity color on and an entity that has one. Sensors have none.
2.  `icon_color`.
3.  The design text colour (`design.color`), which the icon inherits.
4.  The theme's default icon colour.

## Example

```yaml
- type: icon
  entity: light.desk
  use_entity_icon: true
  use_entity_color: true
  size: 40px
```
