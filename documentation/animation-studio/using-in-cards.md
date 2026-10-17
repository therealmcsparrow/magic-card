# Using animations in cards

Animations from the library work like the built-in presets. You add them to a module, row, column or the card in the same Animations list, and they combine with presets on the same element.

-   [My animations in the picker](#my-animations-in-the-picker)
-   [Animated icons in the icon picker](#animated-icons-in-the-icon-picker)
-   [The entry](#the-entry)
-   [YAML](#yaml)
-   [Overrides](#overrides)
-   [Live updates](#live-updates)
-   [Sharing a card](#sharing-a-card)
-   [What happens without the integration](#what-happens-without-the-integration)

## My animations in the picker

The Animations list is in the Design tab, Transitions & animations section (see [Animations](../design/animations.md)). Its Preset select starts with a My animations group that lists the library by name. The group only shows when the library has answered and holds at least one animation.

Picking an animation from My animations writes `preset: custom:<id>` and clears the entry's Duration, Delay, Easing, Repeat, Direction, Intensity, Strength and Target, so the animation's own values apply. Play, State value and Color stay. If the previous preset had switched Play to On tap (Tap ripple, Press), Play goes back to Always.

## Animated icons in the icon picker

The icon field of the Icon, Info, Button and Light modules has an icon picker with two tabs: Icons, the usual list, and Animated icons. On the Light module the field is optional: empty keeps the light's own icon, and a picked icon replaces it. An animation from My animations can also be added through the Animations list, with Target set to Icon. See [Icon animations in cards](../design/quick-icon-animator.md#which-modules).

Animated icons is a grid of tiles that play their animation while they are on screen. It has a search field ("Search icons") and a domain filter. The grid has two sections:

-   My animations lists the icon animations you saved in the Magic Card Utils library. It shows only when the library is available and holds at least one icon animation.
-   Icon library lists the 192 built-in animations. Matches for the module's icon and entity come first. Show all (192) lists every entry, and Show matches only goes back. The Style switch next to its heading plays the tiles Quiet, Living or Glow, and a click stores that Style. See [Styles: Quiet, Living and Glow](../design/quick-icon-animator.md#styles-quiet-living-and-glow).

The module's current animated icon is highlighted. A click on a tile sets the module's icon and its animation in one undo step and closes the picker.

What a click writes depends on the section:

| Section | Entry | Stored in the card |
| --- | --- | --- |
| Icon library | `anim-icon-N` with `preset: custom:quick-icon-…`, target icon | The animation, in `custom_animations`. It works without the integration. |
| My animations | `anim-icon-N` with `preset: custom:<id>`, target icon | Nothing. Later edits in the studio reach the card. Copy YAML with Embed my animations on covers sharing. |

A module has one animated icon. Picking another replaces it. Entries you added by hand in the Animations list have other ids and are never touched.

When the module's icon changes in the editor, a library animation is removed. See [When the module's icon changes](../design/quick-icon-animator.md#when-the-modules-icon-changes).

Without the animator file `magic-card-icon-animator.js` next to `magic-card.js`, the tab shows "The animated icons could not be loaded. Try again."

## The entry

An entry with an animation from the library shows:

| Field | Shown for | Notes |
| --- | --- | --- |
| Preset | All | The My animations group and the presets |
| Target | Keyframes, sequences and paths without particles, on modules that offer Target | Module or Icon. Empty follows the animation's own target. |
| Entity for play condition, Play, State value | All | As for presets |
| Color | All but sequences | The animation colour |
| Strength (%) | All but sequences | How strongly the colour is painted; for particles, the layer's opacity |
| Duration, Delay | All | The placeholder shows the animation's own duration |
| Easing, Repeat, Direction | All | Start at the animation's own values |
| Amplitude (%) | Keyframes and paths without particles | 0 to 400. 100 plays the animation as drawn, 50 at half the movement. |
| The preset's parameter | Particles based on a preset | Labelled by the preset, for example "Particles" |
| Entity for states and values | Animations with state clips or value bindings | The entity the clips and bindings read. Empty uses the module's entity. |

Under the fields is Reset to animation, which clears the overrides again. The card editor has no link to the studio, so edits to the animation itself happen in the Magic Card Utils panel.

## YAML

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: icon
            entity: binary_sensor.doorbell
            icon: mdi:bell
            design:
              animations:
                - id: ring
                  preset: custom:doorbell-wiggle
                  trigger: entity_on
                  duration: 0.8s
                  intensity: 150
```

`custom:` is followed by the animation's id, as shown in the library and under the Name field in the studio.

## Overrides

Fields you set on the entry win over the animation's own values. Fields you leave out use the animation's.

| Key | Effect on a custom animation |
| --- | --- |
| `duration` | Length of one cycle. For a sequence it scales the whole sequence. |
| `delay` | Wait before it starts. For a sequence, before the first cycle. |
| `easing` | The animation's easing. Keyframes with an easing of their own keep it. |
| `iterations` | Number of cycles, or `infinite`. For a sequence, a number plays the whole sequence that many times. |
| `direction` | `normal`, `reverse`, `alternate` or `alternate-reverse` |
| `trigger`, `trigger_entity`, `state` | Play conditions, as for presets. A sequence ignores `tap` and plays always. |
| `color` | The animation colour that the animation's colours, shadows and particles use |
| `strength` | 0 to 100. How strongly the colour is painted. |
| `target` | `module` or `icon`. Without it, the animation moves what it was built for. Only modules have an icon target; cards, rows and columns animate themselves. |
| `intensity` | Keyframes and paths: the amplitude in %, where 100 is as drawn. Particles based on a preset: the preset's parameter. |
| `entity` | Animations with state clips or value bindings: the entity they read instead of the module's. In the editor: Entity for states and values. See [The driving entity](states-and-values.md#the-driving-entity). |

An On tap animation set to repeat forever plays once per tap, as with presets.

## Live updates

Every card on a page shares one connection to the library. When an animation is saved or deleted, cards that use it update without a reload. After Home Assistant reconnects, the library is fetched again.

A card that uses no animation from the library never contacts it.

## Sharing a card

The card's YAML holds only the reference, `custom:<id>`. To share a card with someone who doesn't have your animations, embed them:

1.  Switch the pane editor to YAML mode. A card that uses animations from the library shows a bar: "Uses N of your animations".
2.  Leave Embed my animations on (it starts on).
3.  Press Copy YAML.

The copied YAML has a `custom_animations:` list with every animation the card uses, including the animations that its sequences play. Each one is the library's current version, else the card's own embedded copy. Embedded animations the card no longer uses stay in the list. An id found in neither place is reported as "Not embedded (not found)".

```yaml
type: custom:magic-card
custom_animations:
  - id: doorbell-wiggle
    name: Doorbell wiggle
    kind: keyframes
    duration: 1.2
    easing: ease-in-out
    iterations: infinite
    target: icon
    origin: center
    version: 1
    keyframes:
      - at: 0
        transform: { rotate: 0 }
      - at: 50
        transform: { rotate: 12 }
      - at: 100
        transform: { rotate: 0 }
rows:
  - columns:
      - modules:
          - type: icon
            icon: mdi:bell
            design:
              animations:
                - id: ring
                  preset: custom:doorbell-wiggle
```

`custom_animations` can also be a map keyed by id. A document there can leave out its `id` field and take the key instead. The format is on the [Animation YAML](yaml.md) page.

A card looks an id up in the library first and uses its embedded copy only when the library doesn't have that id. On your own Home Assistant the library version wins; on another one, the embedded copy plays.

### Cards linked to a template

A template's `custom_animations` reach the cards linked to it. A linked card's own documents merge with the template's by id, and `hidden_animations` leaves single template documents out. See [Template animations](../editor/templates.md#template-animations).

## What happens without the integration

Without Magic Card Utils, or when the library can't be reached:

-   The My animations group is hidden in the picker.
-   A `custom:` reference plays the card's embedded copy from `custom_animations` when there is one, and nothing otherwise.
-   The entry in the editor shows "Not found. My animations needs the Magic Card Utils integration; the card plays its embedded copy if it has one." The Preset select shows the reference as "id (not found)".

With the integration installed but without that id in the library, the entry says "Not found in My animations. The card plays its embedded copy if it has one."

An icon animation stored in the card by the Animated icons tab (a `custom:quick-icon-…` reference) says "An animated icon stored in this card." instead. See [Icon animations in cards](../design/quick-icon-animator.md). The card plays its own copy from `custom_animations`, with or without the integration.
