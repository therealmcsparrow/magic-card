# Camera

Shows a camera: a live stream through Home Assistant's own stream player, or a snapshot refreshed on a timer.

| | |
| --- | --- |
| `type` | `camera` |
| Category | Content |
| Editor tabs | General, Actions, Conditions, Design |
| Suits | `camera` entities (the entity picker only lists these) |
| New module | `aspect_ratio: "16:9"`, `camera_view: live`, `show_controls: true` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Camera entity | `entity` | `camera.*` | none | The camera. |
| View | `camera_view` | `live`, `snapshot` | `snapshot` | Live stream or refreshed snapshot. Any value other than `live` is a snapshot. |
| Show controls | `show_controls` | boolean | `true` | Play, pause, sound and full screen on the live stream. Only shown for Live. `false` hides them. |
| Snapshot refresh (seconds) / Refresh every (seconds) | `refresh_interval` | 1 to 3600 | `10` | Seconds between snapshots. With Live it applies until the stream player is available. |
| Aspect ratio | `aspect_ratio` | `16:9`, `4/3`, `1.5`, `56.25%` | `16:9` | Shape of the module. |

A module without `camera_view` shows a snapshot. Modules from before the option keep working that way. New modules are created with `live`.

## Behaviour

-   The live stream uses Home Assistant's camera player (HLS, WebRTC or MJPEG, whatever the camera offers). It plays muted and fills the area.
-   The studio canvas always shows a snapshot, so editing does not start a stream for every change. The dashboard plays the stream.
-   A snapshot is the camera's `entity_picture`, reloaded every `refresh_interval` seconds.
-   An unavailable camera shows its name and state. A camera without a picture shows a camera-off icon.

## Example

```yaml
- type: camera
  entity: camera.front_door
  camera_view: live
  show_controls: true
  aspect_ratio: "4:3"
```
