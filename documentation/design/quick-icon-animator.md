# Animate icon

Animate icon makes a module's icon move in parts, straight from the Design tab: the blades of a fan turn, a bell swings while its waves draw on, rain falls from a cloud. Pick a ready-made animation from the icon library, or split the module's own icon and give each part a preset. The result is a normal [custom animation](../animation-studio/using-in-cards.md) that the card keeps in its own config, so it works without the Magic Card Utils integration.

-   [Where it is](#where-it-is)
-   [The animator](#the-animator)
-   [Library](#library)
-   [This icon](#this-icon)
-   [When the module's icon changes](#when-the-modules-icon-changes)
-   [Apply, Update and Remove](#apply-update-and-remove)
-   [What Apply writes](#what-apply-writes)
-   [Animated SVG](#animated-svg)
-   [Open in animation studio](#open-in-animation-studio)
-   [Template-linked cards](#template-linked-cards)
-   [The animator file](#the-animator-file)

## Where it is

Animate icon is a button under the Animations list in the Transitions & animations section of the [Design tab](README.md), in the Default view. It is there for these modules, at any depth inside layout modules:

-   Icon
-   Button
-   Info
-   Light

Tabs and Weather modules do not get it: their icons cannot play icon animations. Rows, columns, tabs, row-module columns and the card do not get it either.

The first click loads the animator. While it loads, the button reads "Loading…". If the file cannot be loaded, the button comes back with "The icon animator could not be loaded. Try again." under it, and the next click tries again.

## The animator

The animator opens in place of the button, titled "Animate icon" with the module's icon id. From top to bottom:

| Part | What it does |
| --- | --- |
| Preview | A small card that plays the animation on the module's icon, live, as you change it. Under it are the animation's name and a status chip: Not applied, Applied, or Changed, not applied. |
| Start from | Library or This icon. See below. |
| Duration (s) | The length of one cycle, 0.1 to 60 seconds. Shown once there is an animation. |
| Apply / Update, Remove | Write the animation to the module, or take it off. See [Apply, Update and Remove](#apply-update-and-remove). |
| Animated SVG | Export the animation as a looping SVG file. See [Animated SVG](#animated-svg). |
| Open in animation studio | Shown once the animation is applied. See [Open in animation studio](#open-in-animation-studio). |

The close button or Escape closes the animator. Escape closes only the animator, not Home Assistant's dialog. A value outside its range is clamped, and text that is not a number is reverted, each with a short note.

When you select another module while the animator is open, it switches to that module and starts from that module's own animation.

## Library

Library lists animations from the [icon library](../animation-studio/icon-library.md) as chips with their icon and name. It starts with the ones that fit the module:

-   entries for the module's icon first, then entries whose icon starts with the same word or carries it as a tag;
-   then entries for the domain of the module's entity, for example every Light entry for `light.kitchen`.

Show all (107) lists every entry, and Show matches only goes back. When nothing fits, the animator says "No library animation matches mdi:… or …; showing all of them." and lists all of them.

Click a chip to load it into the preview. Library animations carry their own copy of the icon's shapes (`rig.svg`), so they look the same whatever version of the Material Design Icons Home Assistant ships, and the card needs no icon lookup to play them. The animation always draws that copy in place of the module's icon. When the entry was made for another icon, the animator says so: "Plays its own mdi:fan drawing in place of the module's icon."

## This icon

This icon animates the module's own icon:

1.  Animate this icon splits the icon into parts, as the animation studio does (see [Icon parts](../animation-studio/parts.md#splitting-an-icon)). While it loads the icon, the button reads "Loading the icon…". The parts are named Part 1, Part 2 and so on, and the first one is selected.
2.  Part picks what to animate: one part, or All parts. A dot marks a part that already moves.
3.  Preset picks one of the [part presets](../animation-studio/icon-mode.md#part-presets): Swing, Ring, Spin, Pulse, Bounce, Shake, Wobble, Blink, Fade, Slide up, Slide down, Slide left, Slide right, Draw on, Draw loop, Pop, Float, Flicker or Wave. Its parameters follow, depending on the preset: Duration share (%), Delay (%) and Intensity (Turns for Spin) as number fields, and Direction as a choice of Normal or Reversed.
4.  Use on part (or Use on all parts) gives the selected parts that preset, turning or scaling each part around the pivot the preset needs (Swing hangs from the top, Spin turns around the centre). With Wave on all parts, the parts light up one after another. Do this for each part you want to move.
5.  Clear removes the motion of the selected parts.

The icon's shape comes from Home Assistant (its icon database or an installed icon pack). The animator uses its own copy of the shape only for icons Home Assistant cannot resolve. When neither works, it says "The shape of mdi:… could not be loaded, so it cannot be split into parts."

Like a library animation, this one stores a copy of the icon's shapes (`rig.svg`), as the studio's [icon mode](../animation-studio/icon-mode.md) does. The parts stay on the same shapes when a later Home Assistant ships a redrawn version of the icon, and the card needs no icon lookup to play them. Only an icon whose shapes take more than 32 KB keeps its icon id (`rig.icon`); the card then splits the icon Home Assistant draws on the dashboard.

When you open the animator again on a module with such an animation, it starts in This icon with the parts listed. An animation whose name is that of a library entry opens in Library.

For anything more, such as your own keyframes, a pivot in another place or drawn shapes, open the animation in the [animation studio](#open-in-animation-studio).

## When the module's icon changes

A This icon animation follows the module's icon. When you give the module another icon in the card editor (the icon picker in the General tab, the studio, or YAML), the editor splits the new icon and moves the animation onto it. It waits until the icon has stayed the same for about a second, so typing `mdi:bell-ring` in YAML moves the animation once, onto `mdi:bell-ring`, and never onto `mdi:bell` on the way:

-   The parts keep their place: Part 1 of the old icon becomes Part 1 of the new one, and its motion stays with it. A pivot (Swing hangs from the top) moves to the same spot on the new part.
-   Parts the new icon does not have are removed, with their motion and any group left empty. When the new icon has more parts, the extra ones are added without motion.
-   The new icon's shapes are stored in the animation (`rig.svg`), as Apply does. A name the animator gave ("Animated bell") is renamed after the new icon.
-   The change is part of the last icon edit's undo step, so one undo takes back that edit and the move together. When you made other changes in the meantime, the move is an undo step of its own.

Home Assistant shows a short note, for example "The icon animation now uses the new icon (mdi:bell). 2 part animations were removed because the new icon has fewer parts." The animator shows the same note the next time it opens on that module.

Some changes leave the animation as it is:

-   Library animations. They draw their own copy of their icon in any case.
-   Clearing the icon, so the module shows its entity's icon again, or switching to an own SVG. The editor does not look up the entity's icon here; split the icon again with Animate this icon.
-   An icon whose shape cannot be loaded, such as a misspelled id. The animation follows once the icon is one Home Assistant knows.
-   Going back to the icon the module had before, within that second.
-   A change that does not come from the editor, such as editing the dashboard's raw YAML.

When the animation is shared with another module that keeps the old icon, the changed module gets its own copy under a new id, and the other module keeps the original. The new id is one the card, its template and the animation library do not use yet. On a template-linked card the module's animation list is then marked not_synced, as Apply does. The copy goes into the card's own `custom_animations`, which stay synced with the template.

On a template-linked card, a This icon animation that comes from the template follows too. The result is stored as the card's own version under the same id, so this card plays it in place of the template's (Changed on this card in the Template animations section), and the template is not changed. An animation hidden on this card is left alone.

The animation follows only while the card editor is open. If the editor closes within that second, for example because you press Save, the card is saved with the animation as it was and no note is shown. Change the icon again, or split it again with Animate this icon, to update the animation. Switching to the Visibility or Layout tab of the card dialog and back lets the animation follow once you are back.

## Apply, Update and Remove

-   Apply writes the animation to the module and to the card (see below). The status chip turns to Applied, and the animator says "Applied. The card keeps this animation in its own config (custom_animations)."
-   After a change, the chip reads "Changed, not applied" and the button reads Update. Update writes the new version over the old one.
-   Remove takes the entry off the module and says "Removed from this module." It also deletes the stored animation, unless another module still uses it.

Apply and Remove are one undo step each, entry and stored animation together.

When the same stored animation plays on more than one module (after Duplicate, or copied YAML), the animator says "Shared with N other modules: Update changes them too." Make a copy gives this module its own copy under a new id.

When the module's entry points at an animation the card no longer holds, the animator says "This module's animation is missing from the card; Apply stores it again."

Outside the Magic Card editor the animator can still preview and export, but Apply is disabled with "Apply needs the Magic Card editor."

## What Apply writes

Apply adds one entry to the module's `design.animations` and stores the animation document in the card's `custom_animations`:

```yaml
type: custom:magic-card
custom_animations:
  - id: quick-icon-k3x9pa
    name: Fan spin
    kind: keyframes
    duration: 1.2
    iterations: infinite
    target: icon
    keyframes:
      - at: 0
        opacity: 1
    rig:
      # the icon's shapes, shortened here
      svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,11A1,1 0 0,0 ..."/></svg>
      parts:
        - id: blades
          name: Blades
          from: [0]
    tracks:
      - target: part:blades
        keyframes:
          - at: 0
            transform: { rotate: 0 }
            easing: linear
          - at: 100
            transform: { rotate: 360 }
rows:
  - columns:
      - modules:
          - type: icon
            entity: fan.bedroom
            icon: mdi:fan
            design:
              animations:
                - id: anim-icon-1
                  preset: custom:quick-icon-k3x9pa
                  target: icon
                  trigger: always
```

-   The document id starts with `quick-icon-` followed by six random letters and digits, unique on the card. The entry id is `anim-icon-1` (or the next free number).
-   The entry is a normal animation entry. In the Animations list it shows as a custom animation with the note "Made with Animate icon below." You can change its play condition, colour and timing there; Update keeps those fields.
-   `custom_animations` keeps the form it already has, a list or a map.
-   The animator never writes to the Magic Card Utils library. The card plays the stored copy, also on a Home Assistant without the integration. See [Using animations in cards](../animation-studio/using-in-cards.md#what-happens-without-the-integration).
-   Stored animations from the animator that no entry uses any more are removed when you apply or remove. Other documents in `custom_animations` are never touched.

## Animated SVG

Once there is an animation, the Animated SVG section exports it as a standalone SVG file that loops:

-   SMIL fallback (on by default): "Also animates where CSS in SVG files does not play."
-   Copy copies the SVG text. When the browser blocks the clipboard, the animator says "Copy is not available here; use Download."
-   Download saves the file, named after the animation: Fan spin saves as `fan-spin-animated.svg`.

The file goes through the same safety check as the studio's export. When there is no file to give (the animation does not export, or the check fails), Copy and Download are off and the reason shows under them. Anything the file cannot hold is listed under the buttons. The format and its limits are described in [Animated SVG export](../animation-studio/animated-svg-export.md).

## Open in animation studio

After Apply, Open in animation studio opens the Magic Card Utils panel at `?animation=<id>`, in a new browser tab (or in place when you are already in the panel).

The studio reads its own library, and the animator stores the animation in the card, not in the library. To edit it in the studio, import the card's YAML there first (Import in the studio's library). The animator reminds you: "To keep it in My animations, import this card's YAML there (Magic Card Utils)." See [Import YAML](../animation-studio/library.md#import-yaml).

## Template-linked cards

On a card linked to a template, Apply, Update and Remove override the module's `design.animations`. For a module inside a layout module, the layout's child list is overridden instead of the module's design.

The animation document goes into the card's own `custom_animations`, which merge with the template's by id. When the module plays an animation from the template, the animator shows a From template tag next to the status. Apply or Update then stores the card's own version under the same id. The template's other animations keep coming from the template. See [Template animations](../editor/templates.md#template-animations).

## The animator file

The animator lives in its own file, `magic-card-icon-animator.js`, next to `magic-card.js`. The editor loads it the first time you press Animate icon. Dashboards never load it. HACS installs it with the card; with a manual install, copy it next to `magic-card.js` as well. Without the file, Animate icon shows the load error above and everything else works.
