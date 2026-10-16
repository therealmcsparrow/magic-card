# Template-linked card

Several room cards that share one design. The template holds the structure and look; each card overrides only its entities and, here, its background.

Templates need the `magic_card_utils` backend integration. Without it the card shows its own local config and nothing is fetched.

## The template

Build the card once, then use Create template from this card in the template bar. Give rows, columns and the modules you want to override an `id`: linked cards match by id.

```yaml
type: custom:magic-card
name: Room
padding: 16px
border_radius: 20px
background: var(--card-background-color)
rows:
  - id: room_row
    layout: "1-2"
    columns:
      - id: room_icon_col
        vertical_align: center
        modules:
          - id: room_icon
            type: icon
            icon: mdi:sofa
            size: 40px
      - id: room_info_col
        modules:
          - id: room_temp
            type: info
            entity: sensor.living_room_temperature
            show_name: true
            show_state: true
          - id: room_light
            type: button
            entity: light.living_room
            label: Light
            use_entity_icon: true
            use_entity_color: true
            actions:
              tap_action: { action: toggle }
```

Saved under the name `room`.

## A linked card

```yaml
type: custom:magic-card
template: room
not_synced: [background]
background: "#263238"
rows:
  - id: room_row
    columns:
      - id: room_icon_col
        modules:
          - id: room_icon
            type: icon
            icon: mdi:bed
            not_synced: [icon]
      - id: room_info_col
        modules:
          - id: room_temp
            type: info
            entity: sensor.bedroom_temperature
            not_synced: [entity]
          - id: room_light
            type: button
            entity: light.bedroom
            not_synced: [entity]
```

How the merge works:

-   The card fetches the template and starts from its config. `type`, `template` and Home Assistant's keys (`grid_options`, `visibility` and so on) stay this card's own.
-   A card key listed in the card's `not_synced` keeps the local value. Here that is `background`.
-   Rows, columns and modules are matched by `id`. A matched module keeps the keys in its own `not_synced`; everything else comes from the template. That is why `room_temp` lists `entity`.
-   A local row, column or module whose `id` is not in the template is added after the template's items.
-   When the template is saved again, linked cards on open dashboards update.

When you edit a linked card in Form mode, every changed field is added to `not_synced` for you, and the template bar shows the override count. In YAML mode you add them yourself. The paths each level accepts are in [Template link](../schema.md#template-link).

Re-sync in the template bar clears every `not_synced` list and `hidden_animations`. Unlink removes `template:` and keeps the current config as a normal card, with the template animations it played as its own `custom_animations`.

## Template animations

When the template holds `custom_animations`, every linked card plays them. Say the `room` template has two documents, `light-pulse` and `fan-spin`. The bedroom card below changes `light-pulse` and leaves `fan-spin` out:

```yaml
type: custom:magic-card
template: room
custom_animations:
  - id: light-pulse                # replaces the template's light-pulse on this card
    name: Light pulse
    kind: keyframes
    duration: 3
    keyframes:
      - { at: 0, opacity: 1 }
      - { at: 50, opacity: 0.6 }
      - { at: 100, opacity: 1 }
hidden_animations: [fan-spin]      # the template's fan-spin does not play here
```

-   The card config holds only the card's own documents. The template's are merged in by id when the card renders.
-   A card document with an id the template does not have is added after the template's.
-   `custom_animations` in the card's `not_synced` makes the card use only its own documents.

In the editor, the card's Design tab lists the template's animations with Hide, Show and Use template buttons. See [Template animations](../../editor/templates.md#template-animations).

See also: [Templates](../../editor/templates.md).
