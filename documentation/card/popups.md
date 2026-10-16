# Pop-ups

Any Magic Card can be a pop-up. It then takes no room on the dashboard and opens over it as a bottom sheet or a centred dialog. The pop-up's content is the card's own rows, so modules, design, animations and conditions work as usual. In the editor the settings are in the card's [General tab](../inspector/card-general.md#pop-up). Back to [Card configuration](README.md).

## Contents

-   [Set up a pop-up](#set-up-a-pop-up)
-   [Pop-up keys](#pop-up-keys)
-   [Opening](#opening)
-   [Closing](#closing)
-   [Triggers](#triggers)
-   [Look](#look)
-   [In the editor](#in-the-editor)
-   [Examples](#examples)

## Set up a pop-up

1.  Add a Magic Card to the dashboard and build its content.
2.  In its General tab, turn on Show as pop-up and set a Pop-up ID, for example `kitchen`.
3.  On any button, set a tap action: Open pop-up with the ID `kitchen`, or Navigate to `#kitchen`.

```yaml
type: custom:magic-card
popup:
  enabled: true
  hash: kitchen
  title: Kitchen
rows:
  - columns:
      - modules:
          - type: light
            entity: light.kitchen
```

## Pop-up keys

All keys go under `popup`.

| Key | Type / values | Default | What it does |
| --- | --- | --- | --- |
| `enabled` | `true` / `false` | `false` | Turns pop-up mode on. Only `true` counts. |
| `hash` | Letters, digits, `-`, `_`; starts with a letter or digit | none | The pop-up ID. The pop-up is open while the page URL ends in `#<hash>`. Case-sensitive. Store it without `#`. An invalid ID is ignored. |
| `title` | Text | none | Header text. Also the dialog's accessible name; without it the card's `name` is used, else "Pop-up". |
| `style` | `sheet`, `dialog` | `sheet` | `sheet` slides up from the bottom; `dialog` is centred. |
| `width` | CSS length (a bare number is px) | `600px` | Maximum width. |
| `max_height` | CSS length (a bare number is px) | `90vh` | Maximum height. Longer content scrolls. |
| `backdrop_blur` | CSS length (a bare number is px) | `8px` | Blur of the dashboard behind the pop-up. |
| `backdrop_opacity` | 0 to 1 (values above 1 are read as percent) | `0.4` | Darkness of the backdrop. |
| `show_close` | `true` / `false` | `true` | Close button in the header. |
| `auto_close` | Seconds | off | Close after this many seconds without interaction. `0` or unset: off. |
| `open_on` | `entity`, `state` | none | Opens when the entity changes to `state`. See [Triggers](#triggers). |
| `close_on` | `entity`, `state` | none | Closes when the entity changes to `state`. |

## Opening

A pop-up opens when:

-   The page URL changes to end in `#<hash>`: an Open pop-up action (`action: popup`), a Navigate action to `#<hash>` (from a Magic Card or any Home Assistant card), or a link.
-   A page loads with `#<hash>` already in its URL, for example after a reload or from a bookmark.
-   Its `open_on` trigger fires.

Only one Magic Card pop-up is open at a time. Opening another closes the first.

## Closing

A pop-up closes with:

-   The close button.
-   A click or tap on the backdrop.
-   Escape.
-   A downward swipe on the sheet's header (sheet style only). A short quick flick also closes it.
-   The browser's back button, or the back gesture on Android.
-   The `auto_close` timer. Any pointer, wheel, touch or key event inside the pop-up restarts it.
-   A `close_on` trigger.
-   A `close-popup` action, also from a button inside the pop-up.
-   Navigating away from `#<hash>`, when the URL opened it.

When the pop-up was opened by the URL, closing it removes `#<hash>` again: it goes back one step in the browser history when the hash added a history entry, and otherwise replaces the URL. Focus returns to where it was before the pop-up opened.

## Triggers

```yaml
popup:
  enabled: true
  hash: doorbell
  open_on:
    entity: binary_sensor.doorbell
    state: "on"
  close_on:
    entity: binary_sensor.doorbell
    state: "off"
```

| Key | What it does |
| --- | --- |
| `entity` | The entity to watch. |
| `state` | The state it must change to. Empty or unset: any state change fires. |

-   A trigger fires on a change of state only. Attribute-only updates do not fire it.
-   The first state the card receives after loading never fires it, so a pop-up does not open just because the doorbell is already on.
-   A pop-up with an ID opens from a trigger through the URL, like any other opening, so back closes it. Without an ID it opens directly.
-   Triggers only work on a live dashboard, not in the editors.

## Look

-   The pop-up surface uses the card's background, box shadow and theme. Padding and the other content settings apply inside it.
-   A single-value `border_radius` on the card shapes the corners of the surface.
-   `background` and `box-shadow` declarations in the card's `css` go to the surface too. The other declarations apply to the content.
-   The surface keeps its rectangular outline: a card `shape` is not applied to it, and a card ring follows the rounded corners.
-   The card's `hover`, `animations` and `seasonal` scene work inside the pop-up. A card `value_background` is not drawn there.
-   The header holds the title, the close button and, for the sheet style, a drag handle. With dialog style, no title and `show_close: false`, there is no header.
-   With reduced motion turned on in the system, the pop-up opens and closes without animation.

## In the editor

In the pane editor, the studio and a dashboard in edit mode, the card stays visible inline with a "Pop-up · #<hash>" badge, so you can edit it. Hash changes and triggers do nothing there. Preview pop-up in the General tab opens the real pop-up.

On a live dashboard the pop-up card takes no space. In the sections view it asks for a full-width, auto-height cell and then takes itself out of the layout.

## Examples

A centred dialog without a close button that closes by itself after 30 seconds:

```yaml
popup:
  enabled: true
  hash: camera-front
  style: dialog
  width: 800px
  show_close: false
  auto_close: 30
  backdrop_opacity: 0.7
```

A pop-up without an ID, opened only by a trigger:

```yaml
popup:
  enabled: true
  title: Washing machine done
  open_on:
    entity: sensor.washing_machine_status
    state: finished
```

Buttons that open and close it:

```yaml
- type: button
  label: Kitchen
  icon: mdi:silverware-fork-knife
  actions:
    tap_action:
      action: popup
      hash: kitchen
- type: button
  label: Close
  icon: mdi:close
  actions:
    tap_action:
      action: close-popup
```

See [Actions](actions.md#pop-up-actions) for all pop-up actions.
