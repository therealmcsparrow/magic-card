# Sequences

A sequence plays other animations one after another: built-in motion presets and your own keyframes and path animations. Its editor sits at the top of the inspector when nothing is selected.

-   [Schedule](#schedule)
-   [Steps](#steps)
-   [What a step can play](#what-a-step-can-play)
-   [Playback](#playback)
-   [On the card](#on-the-card)

## Schedule

The schedule bar at the top draws one cycle of the sequence, a block per step, with the playhead of the preview stage. A step that can't play shows as a marker; click it to open that step. "Loops" shows when Loop is on.

## Steps

Play order lists the steps, with a count such as "3 / 20". A sequence has 1 to 20 steps.

Each step is a row with its number, the animation's name and a summary. Click the row to open it:

| Field | Meaning |
| --- | --- |
| Animation | Opens a menu with a search field: My animations first, then the motion presets in their groups |
| Delay | Seconds after the previous step ends, 0 to 600 |
| Duration | Seconds per play, 0.05 to 600. Empty uses the animation's own duration, shown as the placeholder. |
| Plays | How many times the step plays, 1 to 100 |

-   Add step adds a step at the end.
-   Drag a step by its handle to reorder it, or press Alt+Up or Alt+Down.
-   The delete button removes a step. The last remaining step can't be deleted.

A sequence's length is the sum of its steps: each step starts its delay after the previous one ends and lasts its duration times its plays.

## What a step can play

-   Built-in presets that move the element: rotation, position, scale, opacity, filter and glow presets. Presets with their own layer (particles, sweeps, rings, scenes) can't play in a sequence.
-   Your keyframes animations, and path animations that move the element or the icon.
-   Not particles animations, paths with particles, other sequences or the sequence itself.

A step that can't play is marked on its row ("Not found" or "Cannot play") with the reason, and the sequence skips it when it plays. A step whose animation was deleted from the library is skipped the same way.

## Playback

-   Loop: start again after the last step. On by default.
-   Stagger children: play the sequence on a row's columns or a column's modules one after another, instead of on the element itself.
-   Delay between children: the time between one child starting and the next, 0 to 10 s. It shows while Stagger children is on.

The Target setting (Element or Icon) applies to every step. With Icon, each step moves the module's icon.

## On the card

-   A card plays a sequence with the browser's Web Animations, not with CSS. It starts when the element comes on screen and pauses while it is off screen.
-   The entry's Duration scales the whole sequence: a 3 s sequence with Duration 6s plays at half speed.
-   The entry's Repeat, when it is a number, plays the whole sequence that many times. Otherwise Loop decides.
-   The entry's Delay waits before the first cycle.
-   On tap is not supported for a sequence; it plays as if Play were Always. While entity is on and While state equals… work as usual.
-   With reduced motion turned on, a sequence doesn't play.
