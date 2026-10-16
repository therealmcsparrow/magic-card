# Card: General tab

Select the card (click its frame, or the card at the top of the outline or layers) and open General. Back to the [inspector overview](README.md).

## Contents

-   [Fields](#fields)
-   [Pop-up](#pop-up)

## Fields

| UI label | YAML key | Type / values | Default | What it does |
| --- | --- | --- | --- | --- |
| Name | `name` | Text | none | A name for the card. Shown in the editor header, and used as the accessible name of a pop-up without a title. It is not drawn on the card. |
| Use dashboard theme | `use_page_theme` | `true` / `false` | `true` | On: the card uses the dashboard's theme. Turn off to pick a theme for this card only. |
| Card theme | `theme` | A theme name from your Home Assistant themes | none | The theme for this card. Only active while Use dashboard theme is off. The list starts with Dashboard default, which removes the key. |

With Use dashboard theme off and no Card theme picked, the card uses Home Assistant's default theme. The theme's variables are set on the card itself, so they apply to everything inside it.

## Pop-up

The Pop-up section turns the card into a pop-up: hidden on the dashboard, opened over it from its ID, a trigger or an Open pop-up action. How pop-ups behave is described in [Pop-ups](../card/popups.md).

| UI label | YAML key | Type / values | Default | What it does |
| --- | --- | --- | --- | --- |
| Show as pop-up | `popup.enabled` | `true` / `false` | off | Turns pop-up mode on. The other fields appear while it is on. Turning it off keeps your other pop-up settings (with `enabled: false`) when there are any. |
| Pop-up ID | `popup.hash` | Letters, digits, `-` and `_`; starts with a letter or digit | none | The pop-up opens while the page URL ends in `#<ID>`. A leading `#` you type is removed. Case-sensitive. An invalid ID shows "Use letters, digits, - and _ only (no spaces)." |
| Title | `popup.title` | Text | none | Header text of the pop-up, also its accessible name. |
| Style | `popup.style` | `sheet`, `dialog` | `sheet` | Sheet slides up from the bottom; Dialog is centred. |
| Width | `popup.width` | CSS length (px, %, vw, rem, em) | `600px` | Maximum width of the pop-up. |
| Max height | `popup.max_height` | CSS length (vh, px, %, rem) | `90vh` | Maximum height of the pop-up. |
| Backdrop blur | `popup.backdrop_blur` | CSS length in px | `8px` | Blur of the dashboard behind the pop-up. |
| Backdrop opacity | `popup.backdrop_opacity` | 0 to 100 in the editor, stored as 0 to 1 | 40 (`0.4`) | How dark the backdrop is. 0 is no darkening. |
| Show close button | `popup.show_close` | `true` / `false` | on | A close button in the pop-up header. Turning it off writes `show_close: false`. |
| Auto close | `popup.auto_close` | Seconds (number above 0) | off | Closes the pop-up after this many seconds without interaction. Empty: it stays open. |
| Open when | `popup.open_on.entity`, `popup.open_on.state` | Entity, and a state | none | Opens when the entity changes to this state, for example a doorbell turning `on`. With an empty state, any state change opens it. |
| Close when | `popup.close_on.entity`, `popup.close_on.state` | Entity, and a state | none | Closes when the entity changes to this state (any change when the state is empty). |

Below the ID the editor shows the navigation path (`#<ID>`) with a copy button. Without an ID it says the pop-up opens only from its triggers.

Every pop-up field that is set has a reset button, which removes the key so the default applies again.

Preview pop-up opens the real pop-up of the card being previewed (the studio canvas card in the studio, Home Assistant's preview card in the pane editor). In the editors the card itself stays visible inline, with a "Pop-up · #ID" badge.
