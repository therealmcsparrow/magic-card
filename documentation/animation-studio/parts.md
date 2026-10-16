# Icon parts

Icon parts let one keyframes animation move pieces of a module's icon separately. The bell of a doorbell icon swings, its clapper swings a little later, and the sound waves draw themselves on. The studio splits the icon into parts. Each part, group of parts or drawn shape then gets its own timeline. In YAML this is the `rig` field plus one entry in `tracks` per animated part.

Icon parts are for keyframes animations only.

The quickest start is New animation, then Icon animation…: pick an icon or a library entry and the studio splits it and selects the first part. Then use the Part presets panel to animate a part with one click. See [Icon animations](icon-mode.md) and [Icon library](icon-library.md).

-   [Splitting an icon](#splitting-an-icon)
-   [The parts list](#the-parts-list)
-   [Selecting parts on the stage](#selecting-parts-on-the-stage)
-   [Groups, merge and split back](#groups-merge-and-split-back)
-   [Pivots](#pivots)
    -   [Preset pivots](#preset-pivots)
-   [Animating a part](#animating-a-part)
-   [Part presets](#part-presets)
-   [Draw on](#draw-on)
-   [Motion path](#motion-path)
-   [How a card shows the parts](#how-a-card-shows-the-parts)
-   [Limits](#limits)
-   [What does not work with parts](#what-does-not-work-with-parts)
-   [Example: a ringing doorbell](#example-a-ringing-doorbell)

## Splitting an icon

The Icon parts panel is in the Layers column. Until the icon is split it shows "Split the icon to animate its shapes one by one: a bell's clapper, a fan's blades." The same panel shows in the inspector when you select the Icon target, so you can split the icon while the Layers column is a rail.

1.  Icon to split holds the preview tile's icon by default (`mdi:bell-ring` on the Icon tile) and follows the tile until you choose another icon. It is the same icon picker as in the card editor: pick an icon from the list or type an id. Until Magic Card has loaded on the page it is a plain text field.
2.  Split icon resolves the icon and makes one part per separate shape, named Part 1, Part 2 and so on.

How the split works:

-   An icon from Material Design Icons or an icon pack is one path. It is split into its separate shapes. A hole inside a shape stays with that shape, so a split never fills a hole: the fan keeps the hole in its hub and the lock keeps its keyhole. An island inside a hole, such as the water in a washing machine, becomes a part of its own.
-   An own SVG (see [Own icons](own-icons.md)) is split per element. Accent shapes and stroked shapes are separate parts. The panel then says "The parts come from the document's own SVG, one part per shape."
-   `mdi:bell-ring` splits into four parts: the bell, the clapper, the right wave and the left wave.
-   A split stops at 64 parts and says so. The rest of the icon is still drawn, at rest.

When the icon cannot load, the panel shows "This icon could not be loaded. Check the icon id, or try again when Home Assistant is reachable."

Split again starts over. It first asks for a second click (Replace N parts), because it replaces the parts, their groups and their keys. Drawn shapes and the card-part tracks stay.

## The parts list

The list is a tree of parts and groups. Each row shows:

-   The name. Double-click it or press F2 to rename it. Enter keeps the new name, Escape drops it.
-   For a part made of several shapes, the number of shapes.
-   The number of keys the part has on the timeline.
-   An eye button that hides the part in the preview. Hidden parts are only hidden in the studio, for this session. H does the same from the keyboard.

Click a row to select it and animate it on the timeline. Shift selects a range, Ctrl or Cmd adds or removes a row. Up and Down move between rows, Left and Right collapse and expand a group, and Space or Enter selects.

The toolbar under the list has the part actions, so nothing depends on hovering:

| Button | Keys | Action |
| --- | --- | --- |
| Group | Ctrl+G | Put the selected parts in a new group |
| Ungroup | Ctrl+Shift+G | Remove the selected groups. The parts stay. |
| Merge parts | | Join the selected parts into one part |
| Split back into shapes | | Undo a merge: one part per shape again |
| Move up (drawn underneath) | Alt+Up | Draw the part earlier, under the others |
| Move down (drawn on top) | Alt+Down | Draw the part later, over the others |

Every action is one undo step. Removing a part or group also removes its track and its value bindings. A group left without parts goes too.

Drawn shapes have their own list, Shapes, described in [Drawing](drawing.md#the-shapes-list).

## Selecting parts on the stage

With a split icon, the stage lays an overlay on the preview icon:

-   Hovering a part highlights it. Click selects it, Shift or Ctrl adds to the selection.
-   Dragging a box selects every part that lies fully inside it.
-   A selected part shows its outline, a dashed bounding box and its pivot.

The overlay shows the parts at rest. While the animation is paused at another moment, the outlines stay where the parts rest, not where they have moved to.

## Groups, merge and split back

A group animates its parts together. A group track moves all members around the group's pivot, and each member can still have its own track on top. Use groups for parts that should move as one, such as both sound waves.

A group is drawn at the position of its first member. Members that sat further up or down the paint order move with it.

Merge parts joins the selected parts into the first of them, which keeps its id, name and track and takes the shapes of the others. The tracks of the others are dropped. Split back into shapes gives the selected part one part per shape again. The first keeps the id, name and track, and the new parts join the same group.

## Pivots

The pivot is the point a part turns and scales around. By default it is the centre of the part's bounding box.

-   Drag the pivot on the stage. It snaps to 0.25 icon units, Shift places it freely. The whole drag is one undo step.
-   With the pivot focused, the arrow keys move it by 0.25 units, or 1 unit with Shift.
-   In the inspector, Pivot has X and Y fields in icon units and a 3 by 3 grid that puts the pivot on a corner, an edge or the centre of the part's box. Reset pivot returns to the centre.

Icon units are the units of the icon's viewBox: 0 to 24 for Material Design Icons. In YAML the pivot is `origin: [x, y]` on the part or group. A track's own `origin` (a CSS transform origin) wins over it.

### Preset pivots

A part preset such as Swing or Spin stores its pivot on the target's track, as `origin: 12px 3px` in icon units. That pivot wins over the part's own, so the stage and the inspector show it instead:

-   The label next to Pivot in the inspector says Preset pivot. Without one it says Part pivot, or Group pivot for a group.
-   Dragging the pivot on the stage, the arrow keys, the X and Y fields and the 3 by 3 grid all move the preset pivot. The part's own pivot does not change.
-   Reset to part pivot (Reset to group pivot for a group) removes the track's origin. The part's own pivot applies again and the keys stay.

Applying a preset again puts its pivot back on the track. The stage shows the pivot of the selected target only: with several parts selected, the handle and the inspector belong to the one you selected last.

## Animating a part

Select a part, group or shape and the timeline shows its lanes in a group of their own. Add keys as on any other target. See [Keyframes](keyframes.md#targets-on-the-timeline).

What works on a part, group or shape:

| Lane | On a part |
| --- | --- |
| Move X, Move Y | In icon units |
| Scale, Scale X, Scale Y, Rotate, Skew | Around the pivot |
| Opacity | |
| Color | The fill colour |
| Stroke color | The colour of the outline and of stroked shapes. Parts, groups and shapes only. |
| Draw on | 0 to 100% of the outline drawn. Parts, groups and shapes only. See [Draw on](#draw-on). |
| Blur, Filter | |

Background, Shadow and glow and Corner radius have no effect on parts.

The part inspector shows the part's name (or the members of a group, as chips that select them), its pivot, Draw, Motion path and Keys. Keys says how many keys the part has. "Remove this part's animation" removes its track.

## Part presets

With a part, group or shape selected, the Part presets panel in the inspector animates it with one click: Swing, Ring, Spin, Pulse, Bounce, Shake, Wobble, Blink, Fade, the four slides, Draw on, Draw loop, Pop, Float, Flicker and Wave. Each preset has parameters for its share of the cycle, a delay, its intensity and its direction. A preset writes ordinary keys to the target's track, which you can then change on the timeline. See [Part presets](icon-mode.md#part-presets).

## Draw on

Draw traces the part's outline and then fills the part in. Choose Off, Draw on or Draw off in the inspector:

-   Draw on draws the outline from nothing to complete.
-   Draw off removes it again.
-   Starts at and Complete at set when the drawing starts and ends, in % of the cycle (0 and 60 by default).

A filled part shows its outline being drawn, starts to fill over the last quarter of the drawing, and drops the outline once it is filled. A part with several shapes draws them all at the same pace. Stroked parts draw their stroke. The parts of an own SVG draw the outlines of their shapes.

The inspector shows "This part has its own draw keys on the timeline." when the Draw on lane holds other keys than the two Draw sets.

In YAML, draw-on is the `draw` value of a key (0 to 1) on a `part:`, `group:` or `shape:` track. `draw` on any other target is an error.

## Motion path

A part can follow a curve. Turn on Follow a path in the inspector:

-   The part starts on a small arc from where it rests. Drag the path's points on the stage to change it.
-   Shape replaces the path with a template scaled to icon units.
-   Turn with the path rotates the part along the direction it travels.

The Motion path tool in the [drawing tools](drawing.md#motion-paths) draws a path by hand instead.

A motion path is stored on the track as `path: { d, follow_rotation }`, relative to the part's rest position and in icon units. While it plays, it wins over the part's Move X and Move Y lanes, and over Rotate when Turn with the path is on.

## How a card shows the parts

When a card plays an animation with a rig, the module's icon is drawn as the parts. This works on the icon of Icon, Button, Info and Light modules.

-   The parts show for an entry with Target Icon and for an entry without a target, even when the animation's own target is Element. The element then moves with the top-level keyframes and the icon shows its parts. An entry with Target Module does not draw the parts.
-   `rig.icon` names the icon the parts come from. Without it, the parts come from the module's own icon, so a part's shape indices have to match that icon.
-   When the source icon cannot be resolved, or a part points at a shape the icon does not have, the module shows its normal icon and the rest of the animation plays.
-   With reduced motion the parts stay at rest.
-   While a [state clip](states-and-values.md#state-clips) other than the own timeline plays, the parts are drawn at rest and their tracks stop.
-   Cards need the runtime file `magic-card-anim-runtime.js` next to `magic-card.js`. Until it has loaded, the module shows its normal icon. See [Requirements](README.md#requirements).

## Limits

| Limit | Value |
| --- | --- |
| Parts | 64 |
| Groups | 16 |
| Drawn shapes | 48 |
| Animated targets (tracks) | 24 |
| Keys per track | 40 |
| Shape indices in one part (`from`) | 256 |
| Own geometry of one part (`svg`) | 32 KB |
| The whole animation as JSON | 64 KB |

Ids of parts, groups and shapes are 1 to 32 lowercase letters, digits, `-` or `_`, starting with a letter or digit. Parts, groups and shapes share one set of ids, so a part and a shape cannot have the same id.

When an animation already has 24 tracks, the inspector disables Draw on, Draw off and Follow a path for parts without a track and says "This animation has 24 animated targets, the most it can hold. Remove one to animate this part."

## What does not work with parts

-   Liquid fill, line draw and morphing icons (the [icon effects](../icon-effects/README.md)) are turned off while the icon is drawn as parts. Draw on replaces line draw.
-   Parts are painted in the icon colour. A solid or gradient colour style from the icon effects reaches the parts. The accent colour does not: accent shapes are painted in the icon colour too.
-   An own SVG used as the parts source loses its own fill colours and is painted in the icon colour.
-   The overlay on the stage shows the parts at rest, not at the scrubbed moment.

## Example: a ringing doorbell

The bell swings around its top, the clapper swings a beat later around the point where it hangs, and both waves draw on together as a group and fade at the end of the cycle.

```yaml
id: doorbell-ring
name: Doorbell ring
kind: keyframes
duration: 1.6
easing: ease-in-out
iterations: infinite
target: icon
rig:
  icon: mdi:bell-ring
  parts:
    - { id: bell, name: Bell, from: [0], origin: [12, 3] }
    - { id: clapper, name: Clapper, from: [1], origin: [12, 19] }
    - { id: wave_r, name: Right wave, from: [2] }
    - { id: wave_l, name: Left wave, from: [3] }
  groups:
    - { id: waves, name: Sound waves, parts: [wave_r, wave_l] }
tracks:
  - target: part:bell
    keyframes:
      - { at: 0, transform: { rotate: 0 } }
      - { at: 12, transform: { rotate: -14 } }
      - { at: 28, transform: { rotate: 12 } }
      - { at: 44, transform: { rotate: -6 } }
      - { at: 60, transform: { rotate: 0 } }
  - target: part:clapper
    keyframes:
      - { at: 0, transform: { rotate: 0 } }
      - { at: 18, transform: { rotate: 22 }, easing: ease-out }
      - { at: 34, transform: { rotate: -18 } }
      - { at: 52, transform: { rotate: 8 } }
      - { at: 68, transform: { rotate: 0 } }
  - target: group:waves
    keyframes:
      - { at: 0, draw: 0, opacity: 1 }
      - { at: 45, draw: 1 }
      - { at: 85, opacity: 1 }
      - { at: 100, draw: 1, opacity: 0 }
```

On a card:

```yaml
type: icon
entity: binary_sensor.doorbell
icon: mdi:bell-ring
design:
  animations:
    - id: ring
      preset: custom:doorbell-ring
      trigger: entity_on
```

The animation has no top-level `keyframes`: a keyframes animation with at least one track may leave them out.
