# Icon animations

An icon animation makes the parts of an icon move: a bell swings, its waves draw on, a fan's blades turn. The studio splits the icon for you and selects the first part, and the Part presets panel animates a part with one click. The result is a normal keyframes animation with a `rig` and `tracks`, so everything stays editable on the timeline.

-   [Starting an icon animation](#starting-an-icon-animation)
-   [Start from an icon](#start-from-an-icon)
-   [Start from the icon library](#start-from-the-icon-library)
-   [Part presets](#part-presets)
-   [Parameters](#parameters)
-   [Several parts and Wave](#several-parts-and-wave)
-   [Remove motion](#remove-motion)
-   [After the presets](#after-the-presets)

## Starting an icon animation

Two places open the Icon animation window:

-   New animation in the library's top bar, then Icon animation… ("Split an icon into parts, or start from the icon library").
-   On an empty library, the Icon animation starter ("Animate an icon's parts").

The window has two ways in: an icon of your choice, or an entry from the icon library. Cancel closes it.

## Start from an icon

Under Start from an icon:

1.  Icon is the same icon picker as in the card editor. You can pick an icon from the list or type an id such as `mdi:bell-ring`. Until Magic Card has loaded on the page, it is a plain text field.
2.  Split and start (or Enter in the field) splits the icon into its parts and opens it as a new animation. While it works, the button reads "Splitting…".

The new animation:

-   is a keyframes animation of 2 s, ease-in-out, repeating forever, with Target Icon;
-   is named after the icon, for example "Bell ring animation", with an id made from the icon name (`bell-ring`, then `bell-ring-2` when that is taken);
-   has one part per separate shape of the icon, named Part 1, Part 2 and so on, as in [Splitting an icon](parts.md#splitting-an-icon), up to 64 parts;
-   stores the icon's shapes in the animation itself (`rig.svg`), so its parts keep pointing at the same shapes whatever icon version a dashboard loads. An icon whose SVG would be over 32 KB keeps its icon id (`rig.icon`) instead;
-   opens with the first part selected, so the Part presets panel is ready.

The window says why when it cannot start:

| Message | Cause |
| --- | --- |
| Pick an icon, or type an id like mdi:bell-ring. | The field is empty or does not hold an icon id. |
| This icon could not be loaded. Check the icon id, or try again when Home Assistant is reachable. | The icon is unknown, or its shape could not be fetched. |
| This icon has no shapes to animate. | The icon resolved to nothing that can be split. |

The studio knows the shapes of the icons in the icon library by itself. Other icons come from Home Assistant: its Material Design Icons and any icon pack you have installed.

## Start from the icon library

Under Or start from the icon library, with the number of entries beside it, the window shows every animation of the icon library with a live thumbnail. Search icons and the domain list filter it. Click an entry to open a copy of it as a new animation in the editor. See [Icon library](icon-library.md).

The library is a separate file, `magic-card-icon-library.js`, next to `magic-card.js`. The window shows Loading icon library… until it has loaded. If it cannot load, the window says so and has a Try again button. Start from an icon works either way.

## Part presets

The Part presets panel is in the inspector when a keyframes animation has a part, group or drawn shape selected (on the stage, in the parts list or on the timeline). It shows "One click animates the selection; fine-tune the keys on the timeline." and a grid of presets. Each button has a tooltip that says what it does.

| Preset | What it does | Parameters |
| --- | --- | --- |
| Swing | Swings from its top, settling back | Duration share, Delay, Intensity, Direction |
| Ring | Rings like a bell: quick swings that die down | Duration share (70 %), Delay, Intensity, Direction |
| Spin | Turns round at a steady speed (intensity: turns per cycle) | Duration share, Delay, Intensity, Direction |
| Pulse | Grows and shrinks back (direction -1 shrinks) | Duration share, Delay, Intensity, Direction |
| Bounce | Squashes, jumps and lands | Duration share, Delay, Intensity, Direction |
| Shake | Shakes from side to side | Duration share (60 %), Delay, Intensity, Direction |
| Wobble | Rocks on its base | Duration share, Delay, Intensity, Direction |
| Blink | Blinks twice | Duration share, Delay, Intensity |
| Fade | Fades out and back in | Duration share, Delay, Intensity |
| Slide up, Slide down, Slide left, Slide right | Moves that way and back | Duration share, Delay, Intensity, Direction |
| Draw on | Draws its outline, then fills (direction -1 draws it off) | Duration share (60 %), Delay, Direction |
| Draw loop | Draws on, holds, and draws off again | Duration share, Delay |
| Pop | Pops in from nothing with an overshoot | Duration share (50 %), Delay, Intensity |
| Float | Drifts up and down | Duration share, Delay, Intensity, Direction |
| Flicker | Flickers like a flame | Duration share, Delay, Intensity |
| Wave | Lights up one part after another (on a group or several parts) | Duration share, Delay, Intensity, Direction |

Clicking a preset writes the keys of that motion into the target's track and replaces the keys it had. The button stays marked and its parameters appear under the grid. Clicking the marked preset again keeps the parameters you set.

A preset that turns, scales or swings a target puts a fitting pivot on the target's track: the top for Swing and Ring, the bottom for Bounce, Wobble and Flicker, the centre for Spin, Pulse, Pop and Wave. This preset pivot wins over the pivot of the part or group, and applying a preset again sets it again. The pivot of the part stays stored. To move the preset pivot or go back to the part's own, see [Preset pivots](parts.md#preset-pivots).

An animation holds at most 24 animated targets. When it is full, a preset on a new target does nothing and the panel says "This animation already has 24 animated targets: remove one to add a preset."

## Parameters

| Parameter | Range | Default | What it does |
| --- | --- | --- | --- |
| Duration share | 10 to 100 % | 100 % (some presets less, see above) | How much of the cycle the motion takes. The target rests for the rest of the cycle. |
| Delay | 0 to 90 % | 0 % | Where in the cycle the motion starts. When Delay and Duration share add up to more than 100 %, the motion is squeezed into what is left of the cycle. |
| Intensity | 0.25× to 3× | 1× | How far, how big or how often: the swing angle, the jump height, the number of turns. |
| Direction | Forward or Reverse | Forward | Turns the other way, slides the other way, shrinks instead of grows, draws off instead of on. |

The sliders update the animation while you drag. A whole drag is one undo step, and so is each click on a preset.

Use Delay and Duration share to make parts take turns: the clapper of a bell can start at 15 % while the bell starts at 0 %.

## Several parts and Wave

With several parts, groups or shapes selected, the panel says "N targets selected: a preset plays on each (Wave: one after another)." A preset then plays on every selected target at the same time.

Wave is different: it plays on the targets one after another. Each one takes 60 % of the window that Delay and Duration share set, and the starts are spread evenly so the last one ends where the window ends. On a group, Wave runs through the group's parts.

## Remove motion

Remove motion, under the grid, removes the tracks of the selected targets. It shows only when one of them moves.

The Animated SVG button beside it opens Save as icon on its Animated SVG view, for the whole animation. See [Animated SVG export](animated-svg-export.md).

## After the presets

A preset only writes keys. Everything else in the studio still works on the result:

-   Change, add or move keys on the timeline. See [Keyframes](keyframes.md).
-   Group parts, merge them or move their pivots. See [Icon parts](parts.md).
-   Draw shapes and animate them the same way. See [Drawing](drawing.md).
-   Add state clips or value bindings. See [States and values](states-and-values.md).

Save the animation to keep it in the library, then use it on a card as `preset: custom:<id>`. See [Using animations in cards](using-in-cards.md). For quick results without the studio, the card editor's [Animate icon](../design/quick-icon-animator.md) uses the same presets and library.
