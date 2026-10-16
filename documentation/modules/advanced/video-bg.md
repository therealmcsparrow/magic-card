# Video background

A video that plays behind the other modules of its column or layout. On its own it is shown at its own size, like an image.

| | |
| --- | --- |
| `type` | `video-bg` |
| Category | Advanced |
| Editor tabs | General, Conditions, Design (no Actions tab) |
| Suits | A video URL or a video from Home Assistant's media browser. No entity. |
| New module | `autoplay: true`, `loop: true`, `muted: true` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Video URL | `url` | URL, path or media | none | The video. A path such as `/local/rain.mp4`, a full URL, or a media browser item (the browse button lists videos). |
| Poster image URL | `poster` | URL, path or media | none | Shown until the video plays, and instead of it when it cannot play. |
| Fit | `fit` | `cover`, `contain` | `cover` | How the video fills its area. |
| Autoplay | `autoplay` | boolean | `true` | Plays while the card is visible. |
| Loop | `loop` | boolean | `true` | Starts again at the end. |
| Muted | `muted` | boolean | `true` | Plays without sound. Browsers only autoplay muted videos. |

## Placement

-   Next to other modules in a card column, a row module's column, a tab, a horizontal or vertical layout, or a slide, the video becomes a background layer of that container. It fills the container behind the other modules and takes no space of its own. It does not react to taps.
-   Alone in its container it is a normal block at its own size.
-   Browsers without CSS `:has()` support (some older WebViews) show the video in the normal flow instead of behind its siblings.

Round the container's corners in its design and the video follows them.

## Playback

-   The video only plays while it is on screen, and pauses when it scrolls out of view.
-   With reduced motion turned on in the operating system, it does not autoplay. The poster stays.
-   When autoplay is blocked (for example with sound on) or the video fails to load, the poster stays.
-   A video or poster from the media browser is resolved again when its signed link has expired.

Without a video and a poster, the module shows a placeholder.

## Example

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: video-bg
            url: /local/videos/fireplace.mp4
            poster: /local/videos/fireplace.jpg
          - type: info
            entity: sensor.living_room_temperature
            design:
              padding: 24px
              color: white
```
