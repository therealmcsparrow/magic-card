# Animate a library image

The image animator makes a library image move. You pick a part of the drawing, add an effect, and say what starts it: always, hover, a tap, or a change in an entity. The result is saved with the image, so every card that shows the image moves.

Animating needs Magic Card Utils 2026.11.02 or newer. With an older version the Animate buttons are greyed out and say "Animating needs a newer Magic Card Utils. Update it and try again."

## Words used on this page

- **Image animator.** The window where you animate a library image. It shows the drawing, its parts, and the animations that belong to it.
- **Clip.** One named animation of an image, for example "Idle" or "Door opens". A clip has effects, a duration, a number of repeats and a start. An image holds up to 16 clips, and only one plays at a time.
- **SMIL copy.** A shape morph is saved twice: as frames that Magic Card plays with CSS, and as a small animation element inside the SVG. Magic Card plays one of the two on each browser, never both. You do not edit the SMIL copy. It is the reason an animated image is bigger than a still one.

## Open the animator

1. Open the image editor and choose **Animate** in the toolbar. Or, in a card editor, choose **Animate** next to a library image field.
2. The animator opens with the drawing at the top and the clips below it.
3. Only administrators can save. Everyone else can look but not change.

Expected result: the drawing shows, and "This image has no animations yet." appears until you add a clip.

## Add a clip

1. Choose **Add clip** and type a name. Names can be up to 64 characters, and no two clips share a name.
2. Choose **Starts when** (see [What starts a clip](#what-starts-a-clip)).
3. Set **Duration (seconds)**, **Repeats** (or **Repeat forever**) and **Direction**: forwards, backwards, back and forth, or back and forth starting backwards.
4. Add effects, as described next.

Expected result: "Added the clip {name}." The clip appears in the list. You can rename, duplicate, delete and reorder clips, and Duplicate is the quickest way to try a variation.

## Pick a target and add effects

A target is the part of the drawing an effect moves. Click a part of the drawing, or choose it from **Parts of the image**. Choose **Whole image** to move everything.

1. Select the target.
2. Choose an effect:
   - **Move and turn.** Moves, rotates and scales the part.
   - **Fade.** Changes opacity.
   - **Colour.** Changes the fill or outline colour.
   - **Glow.** A blur or colour filter.
   - **Draw the outline.** Draws the stroke from start to end. It only works on parts that have an outline, and says "Nothing here has an outline to draw." otherwise.
   - **Follow a path.** Moves the part along path data, for example `M0 0 L50 20`.
   - **Add preset.** A ready-made animation from the preset list.
3. Check the preview. It plays the selected clip.

Expected result: "Added {effect} to {name}." The preview moves.

## Morph one shape into another

A morph changes one shape into another. The two shapes do not need the same number of points.

1. In the clip, choose **Add morph**.
2. Under **Shape that changes**, pick the first shape, and under **Changes into**, the second. They must be different shapes.
3. Choose **Add morph**.

Expected result: the first shape changes into the second during the clip. A clip with a morph can only play forwards. If the second shape is wrong, use **Go back to the first shape**.

Morphs are the heaviest effect. Each one is saved twice (see SMIL copy above).

## What starts a clip

| Start | What happens |
|---|---|
| Always | The clip plays as soon as the image is on screen. |
| Hovering over the image | Plays while the pointer is over the image and stops when it leaves. |
| Tapping the image | Plays from the start on each tap. The card's own tap action still works. |
| An entity reaches a state | Plays while the entity matches. Enter an entity such as `cover.garage`, an optional attribute, **State is** or **State is not**, and a value. |

If several clips could play, one wins: tap, then hover, then state, then always. Only one clip plays at a time.

Hover only applies on devices with a pointer. On a touch screen, use tap or a state.

## Motion that is held still

- **Reduced motion.** If the device asks for reduced motion, the image shows its drawn frame and does not move. This follows the setting live.
- **Pause.** An animated library image counts as motion on the card. When no pause button was set, the card shows one automatically (`pause_button: auto`). Set `pause_button: hidden` to remove it. Pause holds the image still, and a remembered pause holds from the first frame.
- **Off screen.** An image that is scrolled out of view, or on a hidden page, stops moving until it is visible again.

## How an animated image plays

The code that plays animated images loads only when a card shows one, so cards with still images do not download it. When a clip moves parts of the image, Magic Card also loads the animation engine and starts the clip once both have loaded. If loading fails, the image stays still and the card works as before.

A clip with moving parts never plays halfway: if the animation engine is missing, the clip does not play at all, shape morphs included. A clip that only holds morphs plays without it.

Each morph plays exactly once. Magic Card first checks whether the browser can animate a path's shape with CSS. If it can, the CSS frames play; if it cannot, or the check is unsure, the SMIL copy plays instead. Reduced motion holds both at the first frame. Pause and scrolling off screen stop both together.

## Used on N cards

When you open an image that cards already use, the animator says "Used on 3 cards. Saving changes how the image looks there." Magic Card counts this in your browser by reading your dashboards and looking for `mcu-image:<id>`. A dashboard that cannot be read is skipped, and the notice then says "Used on at least 3 cards. Magic Card could not check every dashboard." No notice means no card uses the image. The notice does not block a save.

## Heavy animations

The animator warns when an animation may run slowly on an older wall tablet: "This animation is heavy and may run slowly on older devices. You can still save it." It names what is over the limit:

- More than 150 animated shapes.
- More than 8 shapes with a blur or colour filter.
- More than 20,000 morph points.
- More than 512 KiB of animation data.

The same applies to a library over 50 MiB. Warnings never block a save.

## Save

1. Choose **Save**. Expected result: "Saved." or "Saved to the library as {name}."
2. Cards that use the image show the animation after they next load it.

If the save fails, the window says why, for example "This image is larger than the library accepts." or "This image was changed somewhere else. Close this window and open it again." Your work stays open.

## Limits and older versions

- An animated image can be up to 1 MiB with Magic Card Utils 2026.11.02 or newer. The animation counts toward that size.
- The library no longer has a limit on the number of images.
- A card on an older Magic Card version shows an animated image as a still picture, and a very large image as missing. Update the card.
- Share codes do not carry animations yet. An imported SVG loses any animation inside it.

## See also

- [The image editor](editor.md)
- [Use images in a card](using-images.md)
- [Privacy and your images](privacy.md)
