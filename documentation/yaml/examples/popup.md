# Pop-up card

A doorbell pop-up with the camera. It opens from a button, from a link to `#doorbell`, or by itself when someone rings. It closes when the bell sensor turns off again, or after a minute.

The pop-up card. Put it anywhere on the dashboard; it takes no room there.

```yaml
type: custom:magic-card
name: Front door
border_radius: 20px
popup:
  enabled: true
  hash: doorbell
  title: Front door
  style: dialog
  width: 720px
  backdrop_opacity: 0.6
  auto_close: 60
  open_on:
    entity: binary_sensor.doorbell
    state: "on"
  close_on:
    entity: binary_sensor.doorbell
    state: "off"
rows:
  - columns:
      - modules:
          - type: camera
            entity: camera.front_door
            camera_view: live
            aspect_ratio: "16:9"
  - layout: "1-1"
    columns:
      - modules:
          - type: button
            label: Open door
            icon: mdi:door-open
            entity: lock.front_door
            actions:
              tap_action:
                action: perform-action
                service: lock.unlock
                data:
                  entity_id: lock.front_door
      - modules:
          - type: button
            label: Close
            icon: mdi:close
            button_style: outline
            actions:
              tap_action:
                action: close-popup
```

A button on another card that opens it:

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: button
            label: Front door
            icon: mdi:doorbell-video
            actions:
              tap_action:
                action: popup
                hash: doorbell
```

Notes:

-   `enabled` must be `true`. The `hash` is case-sensitive and may only use letters, digits, `-` and `_`.
-   A `navigate` action to `"#doorbell"`, any Home Assistant link to `#doorbell`, or a URL ending in `#doorbell` opens the same pop-up.
-   `open_on` fires when the entity changes into the given state. The state at page load does not open it, and attribute-only updates are ignored.
-   `perform-action` has no `target` key. The entity goes in `data`.
-   The card's `border_radius` rounds the pop-up surface. In the editor the card stays visible inline, marked as a pop-up.

See also: [Pop-up schema](../schema.md#pop-up), [Card, rows and columns](../../card/README.md).
