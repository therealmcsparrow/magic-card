# Library

The library is the studio's start page. The top bar shows "Animation studio" with the number of animations, and the Import, Export all and New animation buttons.

-   [The list](#the-list)
-   [Search and kind filter](#search-and-kind-filter)
-   [New animation](#new-animation)
-   [Customise a preset](#customise-a-preset)
-   [Duplicate](#duplicate)
-   [Rename](#rename)
-   [Delete](#delete)
-   [Export YAML](#export-yaml)
-   [Import YAML](#import-yaml)
-   [Used by](#used-by)
-   [Limits](#limits)

## The list

Animations are sorted by name. Each row has:

-   A live thumbnail: a small Magic Card playing the animation on an icon tile. It only exists while the row is on screen. Without Magic Card on the page, the row shows the kind's icon instead.
-   The name and the reference cards use, for example `custom:doorbell-wiggle`. Click either to open the animation in the editor.
-   A kind chip: Keyframes, Particles, Path or Sequence.
-   The used-by count, when the panel provides it (see [Used by](#used-by)).
-   Buttons for Duplicate, Rename, Export YAML and Delete.

An empty library shows "No animations yet" with one starter button per kind, a From a preset button and an Icon animation button.

## Search and kind filter

The search field matches the name, the id and the kind. With several words, every word has to match. Press `/` anywhere in the library to jump to the search field.

The All, Keyframes, Particles, Path and Sequence buttons next to it show one kind only. Arrow keys, Home and End move between them.

## New animation

New animation opens a menu:

| Item | Starts with |
| --- | --- |
| Blank keyframes | A gentle pulse: scale 100% at 0%, 110% at 50% and 100% at 100%, 2 s, ease-in-out, repeating forever |
| Blank particles | 12 round dots falling across the whole width, 6 to 12 px, 4 s, linear |
| Blank path | A short curved path in pixels that the element follows, 3 s, linear |
| Blank sequence | Pop, then Wiggle 0.2 s later, looping |
| Customise a preset… | One of the built-in presets as your own animation (see below) |
| Icon animation… | An icon split into parts, or an entry of the icon library. See [Icon animations](icon-mode.md). |

A new animation is named after its kind ("New keyframes", then "New keyframes 2" and so on). Its id is made from that name, for example `new-keyframes`, with `-2`, `-3` added when the id is taken. The id doesn't change when you rename the animation later, so cards that use it keep working.

A new animation is not in the library until you save it. The editor marks it with a New chip.

## Customise a preset

Customise a preset… (or From a preset on the empty page) opens a window with every built-in preset, grouped as in the card editor's animation picker, and a search field. Picking one opens it in the editor as a new animation:

-   Motion presets (rotation, position, scale, opacity, filter and glow) become keyframes animations. The keyframes are the preset's own at its default intensity, so you can edit every value.
-   Particle, ring, scene and seasonal presets become particles animations based on that preset. They keep the preset's look; you edit its parameter (count, width, density and so on), the colour and the timing. See [Particles based on a preset](particles.md#particles-based-on-a-preset).

The name is the preset's name and the id is the preset id with `-custom`, for example `spin-custom`. Duration, easing, repeat, direction and transform origin are taken from the preset.

## Duplicate

Duplicate saves a copy straight away. The copy is named "Name (copy)", then "Name (copy 2)" and so on, and its id is the original id with `-copy` (made unique the same way).

## Rename

Rename turns the name into a text field. Enter or leaving the field saves the new name, and Escape cancels. A name can have up to 80 characters. Renaming keeps the id.

## Delete

Delete removes the animation from the library. It asks first when cards use the animation, when a sequence plays it, or when the studio can't tell whether cards use it:

-   Cards that use it stop playing it, unless they embed a copy (see [Sharing a card](using-in-cards.md#sharing-a-card)).
-   Sequences that play it skip that step. The window names those sequences.

When the panel reports that no card uses it and no sequence plays it, it is deleted without asking.

## Export YAML

The Export YAML button on a row exports that animation. Export all in the top bar exports the whole library. Both open a window with the YAML, a Copy YAML button and a Download button. Download saves `<id>.yaml` for one animation and `my-animations.yaml` for all of them.

The YAML is a list of animation documents, the same format the library stores. See [Animation YAML](yaml.md). You can import it in another animation studio, or paste it into a card under `custom_animations:`.

## Import YAML

Import opens a window where you paste YAML or load a `.yaml`, `.yml` or `.json` file. It accepts:

-   one animation,
-   a list of animations,
-   animations keyed by id (a key without its own `id` field becomes the id),
-   a card config, from which it takes `custom_animations`.

Import checks each animation and saves the valid ones. An animation whose id already exists gets a new id (with `-2`, `-3` and so on), and steps of imported sequences that pointed to the old id follow it. The window then lists the renamed ids, and any animations that were not imported with the field and the reason, for example `[1].keyframes[0].at Required.`

## Used by

The library can show "Used by N cards" or "Not used" on each row. The count comes from the panel that hosts the studio. While the panel doesn't provide it, the column is hidden and Delete always asks first.

## Limits

-   At most 200 animations in the library.
-   At most 64 KB per animation, measured as JSON.

The other limits per field are on the [Animation YAML](yaml.md#limits) page.
