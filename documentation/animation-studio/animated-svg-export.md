# Animated SVG export

A keyframes animation of an icon can be saved as a standalone SVG file that plays by itself and loops. Use it outside Home Assistant: on a web page, in a README, in another app that shows SVG images. Inside Magic Card you do not need it, because cards play the animation directly.

-   [Where to export](#where-to-export)
-   [The Animated SVG view](#the-animated-svg-view)
-   [What the file holds](#what-the-file-holds)
-   [Colour](#colour)
-   [What is not exported](#what-is-not-exported)
-   [Using the file](#using-the-file)

## Where to export

| Where | How |
| --- | --- |
| Animation studio, Draw toolbar | Save as icon, then Animated SVG in the switch at the top of the window ("Icon" is the still icon). See [Own icons](own-icons.md#save-as-icon). |
| Animation studio, Part presets panel | The Animated SVG button opens Save as icon straight on Animated SVG. See [Icon animations](icon-mode.md#remove-motion). |

In the studio the Icon / Animated SVG switch also works with the arrow keys, Home and End.

## The Animated SVG view

| Part | What it shows |
| --- | --- |
| Preview | The exported file itself, playing, drawn in the theme's icon colour. |
| Facts | "A looping SVG file of the animation", the file size (with ", large" above 256 KB), and "Browsers play its CSS keyframes; the SMIL copy plays where CSS animation is missing." |
| Colour | A colour picker. Sets a fixed colour in the file, or leaves it in `currentColor`. See [Colour](#colour). |
| SMIL fallback | A checkbox, on by default. Off leaves out the second copy (see below) and makes the file smaller. |
| Warnings | What the file leaves out or plays differently, one line each. See [What is not exported](#what-is-not-exported). |
| Animated SVG | The SVG text. |
| Copy SVG | Copies the text. When the browser blocks the clipboard, a box with the text appears, selected, so you can copy it by hand. |
| Download .svg | Saves the file as `<name>-animated.svg`, named after the animation (`doorbell-ring-animated.svg`). |

When there is nothing to export, the view shows the reason, for example "Only keyframe animations export as an animated SVG." or "The icon has no shapes to export.", and the buttons are disabled.

## What the file holds

The file is one `<svg>` element with the icon's viewBox and:

-   a `<title>` with the animation's name;
-   a `<style>` block with the animation as CSS `@keyframes`: one set per animated part, group and shape, and one for the whole icon when the animation has element or icon keyframes. These are the same rules a card uses;
-   the icon drawn as its parts (and your drawn shapes), animated by that style;
-   with SMIL fallback on, a second copy of the parts animated with SMIL (`<animateTransform>` and `<animate>`) for viewers that do not run CSS animations in SVG files.

A viewer that runs CSS shows the CSS copy and hides the SMIL copy. A viewer without CSS shows only the SMIL copy. The two never play at the same time.

Every rule in the style is scoped to a class made from the file's content, so several exported files can sit inline in one HTML page without styling each other.

The CSS copy respects reduced motion: with "reduce motion" set in the system, it stands still. The SMIL copy has no such setting.

## Colour

The file is drawn in `currentColor`:

-   inline in an HTML page, it takes the text colour around it;
-   as an image (`<img src="…svg">`), there is no text colour, so it is black.

In the studio, the Colour field writes a fixed colour into the file. Without one it reads "Colour: currentColor" with the note "Black in an <img>, the text colour inline." Pick a colour and the file gets it as a `color` attribute; Use currentColor takes it out again. The preview shows a file without a colour in the theme's icon colour.

Entity colours and theme variables have no meaning outside Home Assistant. Parts with those colours are drawn in `currentColor` too.

## What is not exported

A file has no entity and no card around it, so some parts of an animation cannot go in. The view lists them as warnings:

| Warning | Meaning |
| --- | --- |
| States (clips) are not exported: the file plays the animation's own timeline. | [State clips](states-and-values.md#state-clips) are left out. |
| Value bindings are not exported: the file plays at the drawn values. | [Value bindings](states-and-values.md#value-bindings) are left out. |
| Tracks of card parts (name, state, background) are not exported. | [Card parts](card-parts.md) are left out. The icon, its parts and shapes are in. |
| The file loops: the repeat count is not exported. | The animation has a repeat count. The file always repeats forever. |
| The SMIL fallback plays the animation forwards only. | The animation runs in reverse or alternates. The CSS copy does that; the SMIL copy plays forwards. |
| 3D turns play flat in the SMIL fallback. | A key turns around the X or Y axis. The SMIL copy cannot. |
| The file is N KB, larger than 256 KB. | The export still works; the file is just large. |

Only keyframes animations export. Particles, paths and sequences do not.

## Using the file

-   On a web page: `<img src="doorbell-ring-animated.svg" width="48">`, or paste the SVG text inline.
-   In Markdown, such as a README: `![Doorbell](doorbell-ring-animated.svg)`. GitHub shows SVG images as images, so the CSS copy plays.
-   In Home Assistant itself, use the animation on a card instead. A still version for `icon: svg` comes from the Icon side of Save as icon. See [Own icons](own-icons.md#using-the-icon-in-a-card).

The file is checked by the same sanitiser as own icons before it is offered, so scripts, event handlers and outside links never get in. See [What the sanitiser removes](own-icons.md#what-the-sanitiser-removes).
