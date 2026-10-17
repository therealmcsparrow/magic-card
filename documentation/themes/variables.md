# Variables and groups

A Home Assistant theme is a set of variables. Each one is a CSS custom property such as `primary-color`, and each sets one part of the look: a button colour, a card background, a corner radius. The editor lists the variables it knows in groups. Each row has a field for the value, and colour fields have a swatch you can click.

The field shows the value the theme sets. When the theme does not set a variable, the field shows Home Assistant's default and says so in the status line. When the value comes from the shared base of the theme, the status line shows it as text, for example `Shared: #ffffff`.

## Home Assistant groups

| Group | Covers |
| --- | --- |
| Primary and accent | Buttons, active controls and accents |
| Backgrounds and cards | The page, cards, dialogs and menus |
| Text | Primary and secondary text, and titles |
| States and alerts | Success, warning, error and disabled colours |
| Sizes and radii | Font sizes and corner radii |
| Header and sidebar | The app header and the sidebar |
| Other | Variables that fit none of the groups above |

Many cards from other integrations read these variables too, so a change here can change those cards as well.

## The Magic Card group

The Magic Card group lists the variables the card reads from the theme. A theme can change these, so the group previews on a real Magic Card. The group has:

-   Slider track, which is the card's own variable for the track behind a slider fill.
-   The Home Assistant variables the card follows: primary colour, card background, card background override, primary and secondary text, divider colour, text on primary colour, success, error and disabled colours, the light on colour, card corner radius, card border width and colour, and card shadow.

The card sets most of its own `--mc-*` variables itself, so a theme cannot change them. See [Files and limits](files.md#limits).

## Third-party card groups

Every third-party group is always listed, even when its card is not installed. The variables come from a curated list. A name is only in the list after it was checked against that project's code.

| Group | Preview |
| --- | --- |
| Tile card | Built into Home Assistant. Always previews. |
| Mushroom | Previews when Mushroom is loaded on the page. |
| Bubble Card | Previews when Bubble Card is loaded on the page. |
| Ultra Card | No preview sample. The fields still edit and save. |
| button-card | Previews when button-card is loaded on the page. |

When a card is not loaded, its group still shows its fields, marked **Preview not available**, and you can edit and save them. For Mushroom, Bubble Card and button-card, the group offers a **Load** button. A click adds that card's dashboard resource to the page for the preview only. The editor waits up to 8 seconds for the card to appear. Only a path on your own Home Assistant or an `http` or `https` address is loaded.

## Other variables and the raw row

Some variables are not in any group. Use the **Add any variable** row at the bottom of a group to add one:

-   Type a name and a value, for example `--my-card-radius` and `12px`. You can also paste several `name: value` or `--name: value;` lines at once. A trailing semicolon is removed.
-   A row that holds text but is not added yet counts as unsaved. Save offers to add it first or to save without it.

The search box above the groups matches names and values. When nothing matches, it offers to add the search text as a variable. **Only changed** hides the variables that the theme does not set.

## Colour, size and gradient fields

-   **Colour fields** take one colour: a hex value such as `#0276ab`, or `rgb()` or `hsl()`. A gradient in a colour field is refused with the message "This field takes one colour, not a gradient."
-   **Background fields** take a colour or a CSS gradient. A gradient is written like any CSS value, for example `linear-gradient(135deg, #1e3a8a, #0f172a)`. Radial, conic and repeating gradients work too.
-   **Size fields** take a number with a unit, such as `12px` or `0.5rem`. The arrow keys step the value.

A value can be up to 4000 characters long. An invalid value shows an inline error at the field. Save stays off until every value is valid, and the line next to Save names the first invalid value. Pressing Save jumps to it.

Text colour fields show a contrast hint for each mode. The hint names the mode and checks the text against the card colour behind it, including a translucent card over a gradient.

## Gradients on cards

A gradient works in any background field. Text and border fields take one colour, so a gradient there is refused. The Frost preset sets a gradient background, which its translucent cards show through.
