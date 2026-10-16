# Keyframes

A keyframes animation changes properties over one cycle. The top-level keyframes move the element or the module's icon. Extra tracks move other targets on their own: the name, the state, the background, or [parts of the icon](parts.md). You edit them all on the timeline under the preview stage.

-   [Timeline](#timeline)
-   [Targets on the timeline](#targets-on-the-timeline)
-   [Properties](#properties)
-   [Adding and moving keyframes](#adding-and-moving-keyframes)
-   [Selecting several keyframes](#selecting-several-keyframes)
-   [Snapping](#snapping)
-   [Zoom](#zoom)
-   [Keyframe inspector](#keyframe-inspector)
-   [Easing between keyframes](#easing-between-keyframes)
-   [Easing per property](#easing-per-property)
-   [Copy and paste](#copy-and-paste)
-   [Onion skin](#onion-skin)
-   [Keyboard](#keyboard)
-   [Narrow screens](#narrow-screens)

## Timeline

The timeline runs from 0% to 100% of one cycle.

-   The bar above it shows the playhead position (in % and seconds), Previous keyframe and Next keyframe, Add property, and the keyframe tools: Copy, Paste, Delete and Onion skin.
-   The ruler holds the playhead. Click or drag it to move the playhead; the preview stage follows.
-   The footer has the snapping switch and grid, the ruler unit (% or s) and the zoom buttons.

The lanes scroll inside the timeline. The lane names and the ruler stay in view while you scroll.

## Targets on the timeline

The lanes are grouped per target. Each group starts with a summary lane, which has one diamond per keyframe of that target, followed by one lane per property the target animates. Each lane name shows the property's value at the playhead.

-   The animation's main target (Element or Icon, set under What moves) comes first, always.
-   Then every other target that has keys: Name, State, Background, icon parts, groups and shapes.
-   A target you select in the Layers column is shown too, even without keys, with a hint to add some.

A group header has a collapse button, the target's name and a plus button. Click the name to select every keyframe of the target, Shift adds them to the selection. The plus button adds a whole keyframe at the playhead.

Add property, Paste and Onion skin act on the active target: the target selected in the Layers column, else the last one you worked on. The Add property tooltip names it, for example "Add a property to Clapper".

In YAML, the main target's keys are the top-level `keyframes`. Every other target is an entry in `tracks`. See [Animation YAML](yaml.md#tracks).

## Properties

Add property lists the properties the active target doesn't animate yet, and adds a keyframe for the chosen one at the playhead.

| Lane | Value | Range |
| --- | --- | --- |
| Move X, Move Y | Offset in px (icon units on parts) | -10000 to 10000 |
| Scale | % | 0 to 10000 |
| Scale X, Scale Y | % per axis, on top of Scale (squash and stretch) | -10000 to 10000 |
| Rotate | Angle in deg, with Turn: Flat (Z), Flip sideways (Y) or Flip over (X) | -36000 to 36000 |
| Skew | Skew X and Skew Y in deg | -89 to 89 |
| Opacity | % (stored as 0 to 1) | 0 to 100 |
| Color | Text and icon colour | |
| Background | A colour or a gradient | |
| Shadow and glow | A box shadow, with Glow, Drop shadow, Lift and None presets | |
| Blur | px | 0 to 200 |
| Corner radius | px | 0 to 1000 |
| Filter | A CSS filter list, with Brighten, Hue shift, Grayscale, Glow and None presets. Blur is added to this list. | |
| Draw on | % of the outline drawn (stored as 0 to 1). Icon parts, groups and shapes only. | 0 to 100 |
| Stroke color | The outline colour. Icon parts, groups and shapes only. | |

Colours can use the animation colour. In the colour fields, the entity colour button stands for it: the card entry's colour, else the design colour, else the entity's colour, else the theme's primary colour. In YAML it is `var(--mc-anim-c)`.

Colour, background, shadow and filter values accept CSS colours, gradients and the usual colour and filter functions. `url()` and image functions are not allowed.

## Adding and moving keyframes

-   Double-click a lane to add a keyframe at that point, or use the plus button on a lane to add one at the playhead.
-   Drag a diamond to move it. Hold Alt to drag a copy.
-   Delete removes the selected keyframes.

Moving or deleting a diamond in a summary lane moves or deletes the whole keyframe. In a property lane it only affects that property.

## Selecting several keyframes

-   Click a diamond to select it.
-   Ctrl-click or Cmd-click adds a diamond to the selection or takes it out.
-   Shift-click selects the range from the last clicked diamond: every diamond in the lanes between the two, over the times between the two. A range can span several targets.
-   Drag a box over the lanes to select the diamonds inside it, across lanes and targets. Hold Shift or Ctrl to add to the selection.
-   Ctrl+A selects every keyframe. Escape clears the selection.
-   Click a lane's name to select every keyframe in it.

Dragging any selected diamond moves the whole selection by the same amount, so the keyframes keep their spacing, also across targets. When one of them reaches 0% or 100% the whole selection stops there. Alt drags a copy of the selection.

On a touchscreen, a finger drag scrolls the lanes. Hold for 400 ms and then drag to select with a box. A quick tap clears the selection.

## Snapping

The magnet button in the footer turns snapping on and off. While it is on, a dragged or double-clicked keyframe snaps:

1.  To another keyframe or the playhead within 6 px.
2.  Else to the grid chosen next to the magnet: 1%, 5%, 0.1 s or 30 fps.

Hold Shift while dragging to place keyframes freely, in steps of 0.1%.

## Zoom

The timeline zooms from 100% to 1000%:

-   Ctrl or Cmd with the mouse wheel zooms around the pointer.
-   Ctrl and plus, Ctrl and minus zoom in and out.
-   The footer has Zoom out, the zoom level, Zoom in and Fit the whole cycle.

When zoomed in, the lanes scroll sideways. The ruler adds finer ticks as you zoom. The % or s button in the footer labels the ruler in percent of the cycle or in seconds.

## Keyframe inspector

Selecting keyframes opens the keyframe inspector at the top of the inspector column.

With one keyframe selected it shows:

-   The property's name (or Keyframe for a whole keyframe), the target when the animation has several, and the position in % and seconds. The bin button deletes the keyframe.
-   Position: move the keyframe by typing a percentage (0 to 100).
-   The value fields of the property, with units. A whole keyframe shows every property it sets, each with a button to remove it.
-   Also at: chips for the other properties set at the same moment, and Whole keyframe.
-   The easing to the next keyframe (see below).

With several keyframes selected it shows how many, on which target or targets and over what span, with Copy, Delete and one easing for all of them. Drag any of them on the timeline, or use the arrow keys, to move them together.

## Easing between keyframes

Each keyframe can set the easing from itself to the next keyframe. The easing editor has:

-   Preset tiles for the built-in easings. The first tile, Default, uses the animation's own easing.
-   A curve with a start handle and an end handle to drag. With focus on a handle, the arrow keys move it by 0.01, or 0.1 with Shift.
-   The four `cubic-bezier()` numbers.
-   Easing value: a text field that takes any easing, including `steps()`.

The last keyframe has no segment after it, so its easing has no effect. With several keyframes selected, a choice sets all of them.

## Easing per property

A keyframe's easing applies to every property it sets. One property can have its own curve:

1.  Select the keyframe in that property's lane.
2.  The inspector shows "Rotate easing to the next key" (with the lane's name). Default follows the keyframe's easing.
3.  Pick another curve. That segment of the lane is then drawn dashed on the timeline.

Edit the keyframe's easing jumps to the whole keyframe.

Some properties share one curve, because the card animates them as one CSS property:

-   Move X and Move Y.
-   Scale, Scale X and Scale Y.
-   Filter and Blur.

Setting the easing of one of them sets it for the others at that keyframe too. The inspector names them, for example "Scale X and Scale Y share this curve." on a Scale key.

In YAML a per-property easing is `easings` on the keyframe:

```yaml
- at: 0
  transform: { x: 0, rotate: 0 }
  easing: ease-in-out
  easings: { rotate: ease-out }
```

`easings` takes the lanes `x`, `y`, `scale`, `scale_x`, `scale_y`, `rotate`, `skew`, `opacity`, `color`, `background`, `shadow`, `blur`, `radius`, `filter`, `draw` and `stroke`.

## Copy and paste

Copy (Ctrl+C) copies the selected keyframes. Paste (Ctrl+V) pastes them at the playhead. The copy is kept while the page is open, so you can paste into another target or another animation.

Where pasted keyframes go:

-   Into the active target, each property into the lane of the same name.
-   With the keyframes of one lane selected, keyframes copied from one lane go into that lane. Numbers move between related lanes (Move X and Move Y; Scale, Scale X and Scale Y; Opacity and Draw on; Blur and Corner radius), and colours between Color, Background and Stroke color. Other properties are skipped.
-   Keyframes copied from several targets go back to the targets they came from.
-   Draw on and Stroke color are skipped on card targets, which don't have them.

When nothing fits, the timeline says "Nothing pasted: those properties do not fit here".

## Onion skin

Onion skin marks the keyframes just before and after the playhead on the ruler. It only changes the timeline view.

## Keyboard

On macOS, use Cmd where this page says Ctrl.

| Key | On | Action |
| --- | --- | --- |
| Tab | Timeline | Move between lanes |
| Left, Right | A diamond | Move the selected keyframes by 1%, or 10% with Shift |
| Alt+Left, Alt+Right | A diamond | Go to the previous or next keyframe in the lane |
| Home, End | A diamond | Go to the first or last keyframe in the lane |
| Up, Down | A diamond | Go to the nearest keyframe in the lane above or below |
| Space or Enter | A diamond | Select it. Shift or Ctrl adds it to the selection or takes it out. |
| Delete or Backspace | A diamond | Delete the selected keyframes |
| Ctrl+C, Ctrl+V | Timeline | Copy, paste at the playhead |
| Ctrl+A | Timeline | Select every keyframe |
| Ctrl and plus, Ctrl and minus | Timeline | Zoom in, zoom out |
| Escape | Timeline | Clear the selection |
| Arrows | Ruler | Move the playhead by 1%, or 10% with Shift |
| Page Up, Page Down | Ruler | Move the playhead by 10% |
| Home, End | Ruler | Playhead to 0% or 100% |

## Narrow screens

Below 480 px wide, the lanes collapse into the summary lane of the active target and a list of its keyframes. Each list item shows the position, the properties with their values, and the easing.
