# Particles

A particles animation draws a layer of small particles inside the element: dots, icons, emoji or your own SVG shape. The particle designer sits at the top of the inspector when nothing is selected.

-   [Live preview](#live-preview)
-   [Shape](#shape)
-   [Movement](#movement)
-   [Look](#look)
-   [Particles based on a preset](#particles-based-on-a-preset)
-   [On the card](#on-the-card)

## Live preview

The designer has a small preview of its own at the top, with a pause button and a summary such as "12 particles · fall · 4 s per cycle". With reduced motion turned on, it stays still. The big preview stage plays the animation too.

## Shape

| Shape | What each particle is |
| --- | --- |
| Dot | A round dot in the particle colour |
| Icon | An icon from the icon picker, for example `mdi:star` |
| Emoji | An emoji or symbol of up to 8 characters, typed or picked from Common emoji. The characters `< > & " ' \ { } ;` are not allowed. |
| SVG | Your own SVG, up to 32 KB. Scripts, styles and links are removed, and the shape is used as a mask filled with the particle colour. |

Arrow keys, Home and End move between the four shapes.

## Movement

| Field | Meaning | Range |
| --- | --- | --- |
| Direction | Fall, Rise, Drift (across), Burst (out from the centre), Orbit (around the centre) or Spiral | |
| Speed (×) | Multiplies the speed: one cycle takes Duration divided by Speed | 0.1 to 10 |
| Spread | The width particles start across (Fall and Rise), the height they drift across (Drift), or the radius (Burst, Orbit, Spiral). The label changes to Spread across, Spread down or Radius. | 0 to 100% |
| Gravity | A slider from Up to Down. Pulls particles down or up; with Fall, it also speeds the fall up. | -1 to 1 |
| Spin per cycle | How far each particle turns per cycle. Every other particle turns the other way. | -3600 to 3600 deg |

## Look

| Field | Meaning | Range |
| --- | --- | --- |
| Count | Number of particles | 1 to 60 |
| Layer | Back (behind the content) or Front (over the content) | |
| Size | Smallest and Largest, in px. Particles get sizes between the two. | 1 to 200 px |
| Fade in and out | Particles appear and vanish softly | On or off |
| Colours | Particle colours, taken in turn. Add colour adds one, up to 12. Without colours, particles use the animation colour. A colour can be the entity colour, which stands for the animation colour. | Up to 12 |

## Particles based on a preset

[Customise a preset](library.md#customise-a-preset) on a particle, ring, scene or seasonal preset makes a particles animation based on that preset. The designer then shows the preset's name ("Based on a built-in …") and only its parameter, labelled like in the card editor, for example "Particles" or "Width (px)". Empty uses the preset's default. Timing and colour come from the animation settings.

Convert to custom particles swaps the preset for your own particles, so shape, direction, size and colours become editable. For particle presets the look changes a little; for the other presets, your particles replace the preset's look.

## On the card

On a card, a particles animation draws its layer inside the element it is set on, clipped like the built-in particle presets. A card entry can override the timing, colour and Strength (the opacity of the layer). Play On tap shows the layer when the element is tapped. With reduced motion turned on, the layer is hidden. See [Using animations in cards](using-in-cards.md).
