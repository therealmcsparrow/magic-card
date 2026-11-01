# Layers

A layer is a module placed outside the normal flow of its container. Use one to put a camera, a picture or a gauge behind other modules, or to float a control at a fixed spot. Set it with the Placement control in the editor, or with the `placement` and `layer` keys in YAML. No CSS is needed.

The card backdrop (pictures, gradients, patterns and colours behind the whole card) is a separate feature. See [Backgrounds](backgrounds.md#card-backdrop).

## Placement

| Editor label | YAML | What happens |
| --- | --- | --- |
| Normal | `placement: flow`, or no key | The module takes its place in the column, as before. |
| Behind others | `placement: background` | The module fills its container behind the other modules. It takes no space of its own. |
| On top | `placement: overlay` | The module sits at a fixed spot in its container, above the other modules. |

A module without a `placement` key is Normal, so existing cards look the same. The [video background](../modules/advanced/video-bg.md) is the one exception: without a placement key it keeps its own default.

## Behind others

A Behind others module fills an area behind the other modules. Choose the area with `layer.fill`:

| Editor label | YAML | Fills |
| --- | --- | --- |
| Its container (default) | `container` | The column, row, layout or tab the module is in. |
| Its row | `row` | The whole row. |
| The whole card | `card` | The whole card, behind every row. |

`row` and `card` apply only to a module placed directly in a card column or in a row module's column. Anywhere else the module fills its container.

Behind others modules are drawn in config order, so a later module sits in front of an earlier one. They sit behind every normal module of the same area.

## On top

An On top module keeps a fixed spot in its container.

| Option | YAML | Values | Default |
| --- | --- | --- | --- |
| Position | `layer.anchor` | `top-left`, `top`, `top-right`, `left`, `center`, `right`, `bottom-left`, `bottom`, `bottom-right` | `top-left` |
| Offsets | `layer.offset_x`, `layer.offset_y` | CSS lengths, for example `8px` or `5%` | `0` |

Offsets are measured from the edge of the container, inside any border. The container's padding is ignored.

- On an edge (for example `top-left`), an offset moves the module inwards and must be 0 or more. A negative value shows an error in the editor. It is not changed silently.
- On a middle position (`top`, `center` or `bottom` for the horizontal offset; `left`, `center` or `right` for the vertical one), the offset can be negative. A positive value moves the module right or down.

The module stays inside its container at any width.

Keyboard order follows the layers. On top modules at the top come before the normal modules, the other On top modules come after them, and Behind others modules come last. Within the On top modules, later modules sit in front of earlier ones.

## Options for both

| Option | YAML | Values | Default |
| --- | --- | --- | --- |
| Opacity | `layer.opacity` | 0 to 100 (%) | `100` |
| Blur | `layer.blur` | 0 to 24 (px) | `0` |
| Blend | `layer.blend` | `normal`, `multiply`, `screen`, `overlay`, `darken`, `lighten`, `soft-light` | `normal` |

Blur above 12 px counts as heavy for older tablets. The editor says so.

The blend modes do the following:

- Normal: no blending.
- Multiply: darker where layers overlap.
- Screen: lighter, like projected light.
- Overlay: more contrast.
- Darken: keeps the darker colour.
- Lighten: keeps the lighter colour.
- Soft light: gentle contrast.

A blend mixes with what is painted behind the layer, inside the same card or container. A card with no background of its own has nothing to blend with, so its layers look normal. The editor then says "Add a colour at the back to blend with." If a browser cannot blend or blur, the layer is shown without that effect. It is never hidden.

## Clicks and taps go through

`layer.click_through` takes `true` or `false`.

- Behind others: on by default.
- On top: on when the module has no action, off when it has one.

With click-through on, taps reach whatever is under the module. The editor describes it like this:

- Behind others, on: "Clicks reach the modules in front. This module's own action is off while this is on."
- On top, on: "Clicks go to whatever is under this module."
- Off: "This module keeps its own action."

If the module has an action and click-through is on, the editor shows the warning "Tapping this will do nothing while this is on."

Behind others modules with no action are not tab stops. In older browsers (Chromium 85 to 101), a control inside a Behind others module can still take focus.

## Darken behind text

Darken behind text adds a dark fade over the module's picture, so that text placed on top of it stays readable. In YAML it is the `layer.scrim` block, and it is on when the block is present. Its other name is scrim.

| Option | YAML | Values | Default |
| --- | --- | --- | --- |
| Style | `layer.scrim.style` | `dim` (Even), `bottom` (From bottom), `top` (From top), `left` (From left), `right` (From right) | The editor writes `bottom` when you switch it on. Set it in YAML. |
| Colour | `layer.scrim.color` | Black, White, Card colour (`card`), or any CSS colour | Black |
| Strength | `layer.scrim.strength` | 0 to 90 (%) | `60` |

`dim` darkens the whole area evenly. The other styles fade in from one edge. The darkening is at full strength over the first 35% from that edge, then fades to nothing at the far edge.

### Contrast of the presets

The editor offers four strength presets. The table shows the contrast of white text on a pure white picture, with a black, even darkening. This is the worst case. The ratios use the WCAG 2.x contrast formula.

| Preset | Strength | Contrast | What it means |
| --- | --- | --- | --- |
| Light | 25% | 1.8:1 | A tint only. Not for text. |
| Medium | 45% | 3.4:1 | Large text only (WCAG needs 3:1). |
| Strong (editor default) | 60% | 5.7:1 | Normal text is readable (WCAG needs 4.5:1). |
| Very strong | 75% | 10.4:1 | Normal text is readable. |

So, with a black even darkening of 60% or more, white text reaches 4.5:1 even on a white picture.

With a fade, put the text in the part where the darkening is at full strength, which is the first 35% from that edge.

For a colour other than black, the editor gives no figure. Check the text yourself.

## Pause motion button

Each card can show a Pause motion button. It pauses everything on the card that moves: layer pictures and their pan and zoom, seasonal scenes, flows, particles, animations, and a video or camera behind other modules. Press it again to play.

| Key | Values | Default | Effect |
| --- | --- | --- | --- |
| `pause_button` | `auto`, `always`, `hidden` | `hidden` | `auto` shows the button on every card that has motion. `always` shows it even when nothing moves. `hidden` (the default) shows no button. |
| `pause_button_corner` | `bottom-left`, `bottom-right`, `top-left`, `top-right` | `bottom-left` | The corner of the card where the button sits. |

In the editor, the settings are in the card's Design tab, in a Motion group that sits under Layout and is open by default. "Pause button" offers Automatic, Always and Hidden, as a radio group: Tab reaches the chosen one, and the arrow keys move between the three. "Corner" appears only when the button is shown.

A card has motion when something on it moves: an animation, a seasonal scene, flows, particles, a picture with pan and zoom, or a live camera or video behind other modules. The default is `hidden`, so a card shows no button until you set `auto` or `always`.

If anything on the card moves for more than five seconds, set `pause_button` to `auto` or `always`, so viewers can stop the motion. WCAG 2.2.2 asks for a way to pause or stop moving content that runs for more than five seconds.

### Remembered pause

A paused card stays paused. The browser remembers the pause for each card on each dashboard page, so the card is still paused after you reload the page. It is paused from the moment it appears, before the Pause button has loaded, and flow lines that load later stay paused too.

If the button's code cannot load, the card stays paused and shows the usual notice. To play the card again, delete its `mc-paused:` entry in your browser's storage (in the developer tools, under Local storage or Storage) and reload the page. If the browser does not allow storage, a pause lasts only for the page visit.

### Space for the button

With `auto` or `always`, the card keeps a 24 px strip at the button's edge: the top for a top corner, the bottom for a bottom corner. The button sits over that strip, so it does not cover a module in the normal case. The strip adds to the card's padding and gap.

- Under `auto`, the strip stays even when no button shows, so the layout does not move when motion starts or stops. A card with `auto` is therefore taller by the strip than it was before this version, whether or not it has motion.
- With `hidden`, the card reserves no strip.
- A card whose padding and gap add up to less than 10 px, for example `padding: 0`, can still be touched by the button, because the button reaches 34 px from its corner. Give such a card a little padding or gap if its modules sit at the edge.

- The button is a small round control in the chosen corner. Its name is always "Pause motion"; a screen reader hears whether it is pressed. Its touch area is 46 by 46 pixels. Tab reaches it after the card's content. Enter or Space toggles it.
- While the card is paused, a visible "Paused" label sits beside the button. Screen readers do not read the label. The button keeps its one name, "Pause motion", and announces its pressed state.
- While the card is paused, the button and the label stay visible. A look cannot hide them. While the card plays, hiding the button is your own choice, with `pause_button: hidden` or your own styles.
- In forced-colours mode (Windows High Contrast), the button and the label use the system colours, and the button keeps a visible border.
- Pressing it does not trigger the tap action of the card or module under it.
- Under reduced motion, `auto` shows the button only when a video or particles run.
- `hidden` shows no button, and the card plays even if it was paused before. In the editor, the help under Hidden says: "Viewers can't pause the motion on this card. Turn the button on if anything moves for more than 5 seconds."
- Editing the card's config starts the card playing again.
- The paused state is remembered for each card in this browser.
- When the card appears, it decides in this order: reduced motion first, then the remembered flag, then playing. Under reduced motion the card stays still whatever the flag says. Only a stored value of exactly `1` counts as paused; any other value plays.
- A remembered pause holds from the moment the card appears, before the button has loaded. The button itself appears a moment later and shows as pressed. If the button's code cannot load (offline, blocked, a very slow link), the card stays paused, shows the usual notice that part of the card did not load, and has no button. To play it again, clear the stored note (see below) or fix the connection and reload, then press the button.

**What the pause button stores.** When you press pause, your browser keeps a small note on your own device (in its local storage, under a key starting `mc-paused:`) so the card stays paused when you come back to the page. The note is written only after you press the button, and it is removed when you press play. It holds no personal information, it never leaves your device, and Magic Card does not track you. Because the note only remembers a choice you made, no consent banner is needed; you can also clear it any time by clearing the site data for your Home Assistant address. To undo one held pause without the button, open your browser's developer tools, find the local storage entry whose key starts with `mc-paused:` and delete it, then reload.

### Preview pause in the studio

While you edit, the studio canvas has a "Pause preview motion" button beside the preview status. Press it to freeze the card's motion so you can read the layout, and press it again to play. It works whatever `pause_button` says.

- It is for editing only. It is not saved in the card, it does not change what viewers see, and it is not remembered: a reload starts the preview playing.
- It stays on while you change the card's settings.
- The card's own pause button does not save a pause while you edit.

## Reduced motion and what pauses

Layers and card motion stop or rest in these cases:

| Case | What happens |
| --- | --- |
| The card is off screen | Motion stops. It resumes when the card is back on screen. |
| The page is hidden (for example, a wall tablet's screen turns off) | Motion stops. It resumes when the page is visible again. |
| The viewer presses Pause motion | Everything on the card stops. |
| The system asks for reduced motion | Pan and zoom rests at its starting frame. A video does not start by itself. |
| `pause_when_idle: true` and no touch, key or pointer movement for 2 minutes | Pan and zoom rests at its starting frame. It resumes with the next input. |
| `layers_low_power: true` on the card | Pan and zoom rests at its starting frame. Blur and blend are dropped. |

A paused picture keeps the frame it is showing. Reduced motion is a system setting, and the Pause motion button only pauses when the viewer presses it.

## Layers in the studio

In the studio, Alt-click (Option-click on a Mac) selects the layer under the pointer. On a touch screen, press and hold on the canvas to open "Layers here" when two or more layers share that point. The float bar has a "Layers here" button for the same list. The structure list always shows every layer.

## Examples

A badge in the bottom-right corner of a card, 8 pixels from each edge:

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: info
            entity: sensor.living_room_temperature
            placement: overlay
            layer:
              anchor: bottom-right
              offset_x: 8px
              offset_y: 8px
```

A module behind the others, dimmed at the bottom so that the text above it stays readable:

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: info
            entity: sensor.living_room_temperature
            placement: background
            layer:
              opacity: 60
              scrim:
                style: bottom
                strength: 60
              click_through: true
```

## Related

- [Backgrounds](backgrounds.md): the card backdrop, pictures and camera snapshots
- [Video background](../modules/advanced/video-bg.md): a video behind other modules
- [Design](README.md): the Design tab
- [Config schema](../yaml/schema.md#layers): every key in one table
