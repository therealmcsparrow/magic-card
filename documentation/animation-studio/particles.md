# Particles

A particles animation draws a layer of small particles inside the element: dots and other shapes, icons, emoji or your own SVG. The particle designer sits at the top of the inspector when nothing is selected. It has four open sections (Mode, Shape, Movement and Look) and four closed ones (Variation, Physics, Collisions and Child particles). A closed section shows a summary of its settings on its button, for example "No gravity" or "Floor, bounce 0.5".

-   [Live preview](#live-preview)
-   [Mode](#mode)
-   [Shape](#shape)
-   [Movement](#movement)
-   [Look](#look)
-   [Variation](#variation)
-   [Physics](#physics)
-   [Collisions](#collisions)
-   [Child particles](#child-particles)
-   [Size limits](#size-limits)
-   [Animated SVG export](#animated-svg-export)
-   [Particles based on a preset](#particles-based-on-a-preset)
-   [On the card](#on-the-card)
-   [Older particle animations](#older-particle-animations)

## Live preview

The designer has a small preview of its own at the top, with a summary such as "12 particles · fall · 4 s loop". Under it are three buttons:

-   Animated SVG saves the animation as an animated SVG file. See [Animated SVG export](#animated-svg-export).
-   Shuffle gives the particles new random paths (a new seed).
-   Pause preview stops and starts the preview.

With reduced motion turned on, the preview stays still. The big preview stage plays the animation too.

## Mode

| Option | What it does |
| --- | --- |
| Baked loop | The default. The studio works out every particle's path once and plays it as a loop. The card plays it as CSS, so a dashboard runs no script for it. |
| Live simulation | The physics run on the dashboard, frame by frame. Particles never repeat the same loop. |

When you pick Live simulation, the designer shows this warning: "Live simulation runs on every dashboard that shows this card and uses more CPU, especially on wall tablets. Animated SVG export plays the baked loop instead."

Use Live simulation sparingly, for example on one card you watch on a desktop. Every preset in the catalogue is a baked loop.

## Shape

A particle layer can mix up to four shapes. Each shape is a chip at the top of the section; Add shape adds one. Select a chip to change it:

| Shape | What each particle is |
| --- | --- |
| Circle, Square, Triangle, Star, Heart, Ring, Streak, Spark | A built-in shape in the particle colour |
| Icon | An icon from the icon picker, for example `mdi:star` |
| Emoji | An emoji or symbol of up to 8 characters, typed or picked from Common emoji. The characters `< > & " ' \ { } ;` are not allowed. |
| SVG | Your own SVG, up to 32 KB. Scripts, styles and links are removed, and the shape is filled with the particle colour. |

With more than one shape, each chip has a Weight from 1 to 10. The line under it says how many particles get that shape, for example "About 75% of particles" for weights 3 and 1. The remove button or Delete on a chip takes a shape out of the mix.

Arrow keys, Home and End move between the shape tiles.

## Movement

| Field | Meaning | Range |
| --- | --- | --- |
| Flow | How particles move. See the table below. | |
| Loop speed (×) | Multiplies the speed of the loop: one loop takes Duration divided by Loop speed | 0.1 to 10 |
| Spread across, Spread down or Radius | The width particles start across (Fall, Rise and similar), the height they drift across (Drift, Wave, Fireflies), or the radius (Burst, Orbit, Spiral, Explode and fall, Swirl). The label follows the flow. | 0 to 100% |
| Wind angle (deg) | Rain only. Negative blows the rain to the left, positive to the right. It sets the gravity direction. | -60 to 60 |
| Particle speed (% of short side/s) | From and To. Each particle picks a speed in this range. | 0 to 500 |

Speeds are in % of the card's shorter side per second, so a motion looks the same on a wide card and a square one. At 100, a particle crosses a square card in one second.

| Flow | Motion |
| --- | --- |
| Fall | Down from the top |
| Rise | Up from the bottom |
| Drift | Across from the side |
| Burst | Out from the centre |
| Orbit | Round the centre |
| Spiral | Out from the centre in a spiral |
| Fountain | Up from the bottom and back down |
| Explode and fall | Out from the centre, then down |
| Wave | Across in a wave |
| Swirl | Round and into the centre |
| Zigzag | Down in a zigzag |
| Rain | Down in streaks, slanted by the wind angle |
| Fireflies | Wandering slowly in place |

Each flow tile shows a small preview of its motion. With reduced motion turned on, the tiles stay still.

## Look

| Field | Meaning | Range |
| --- | --- | --- |
| Count | Number of particles | 1 to 60 |
| Layer | Back (behind the content) or Front (over the content) | |
| Size | From and To, in px. Particles get sizes between the two. | 1 to 200 px |
| Opacity (%) | From and To. Each particle picks its brightest opacity in this range. | 0 to 100 |
| Colours | Particle colours, taken in turn. Add colour adds one, up to 12. Without colours, particles use the animation colour. A colour can be the entity colour, which stands for the animation colour. | Up to 12 |
| Fade in and out | Particles appear and vanish softly | On or off |

## Variation

| Field | Meaning | Range |
| --- | --- | --- |
| Seed | The number the random paths come from. The same seed gives the same loop every time. Shuffle next to it picks a new one. | 0 to 4294967295 |
| Spin per loop (deg) | From and To. Each particle turns by an amount in this range per loop, to the left or to the right. | -3600 to 3600 |
| Start delay (s) | From and To. When each particle starts. | 0 to 60 |
| Lifetime (s) | From and To. How long each particle lives. A baked loop keeps lifetimes inside one loop. | 0.1 to 60 |

## Physics

| Field | Meaning | Range |
| --- | --- | --- |
| Gravity | How strongly particles are pulled. 0 shows None. | 0 to 1 |
| Gravity direction | Eight arrows: down, down-left, left, up-left, up, up-right, right and down-right | |
| Angle (deg) | Any direction: 0 pulls down, 90 left, 180 up, 270 right | 0 to 359 |
| Drag | Slows particles down over time | 0 to 1 |
| Turbulence | Adds random swirls to the motion | 0 to 1 |

## Collisions

Turn on what particles bump into: Floor, Ceiling, Left edge, Right edge and Content box. The edges are the edges of the element the layer is drawn in. Content box is the box of the card's icon or of its text; pick Icon or Text under it. The card measures that box on the dashboard.

Bounce sets how much speed a particle keeps on a hit: 0 stops on impact, 1 bounces back at full speed. It is disabled while no collider is on.

## Child particles

Turn on Spawn child particles to let each particle release smaller ones. Children burst out from the point where they spawn. They never have children of their own.

| Field | Meaning | Range |
| --- | --- | --- |
| Spawn | On collision (when the particle hits a collider) or At end of life. On collision needs a collider; without one the designer says "Turn on a collider first." | |
| Count per spawn | Children per spawn | 1 to 8 |
| Child shape | One of the shape tiles | |
| Size (px) | From and To | 1 to 200 |
| Speed (% of short side/s) | From and To | 0 to 500 |
| Lifetime (s) | How long a child lives | 0.1 to 10 |
| Use the parent's colours | On: children take the colour of their parent. Off: pick one Child colour. | |

A new set of children starts as six sparks of 2 to 4 px.

## Size limits

A baked loop is stored as CSS, so many particles with many children make the card's code larger. A layer holds at most 60 particles and 160 particles with their children.

-   Above 64 KB of CSS the designer says "This loop is large, so it takes longer to load on wall tablets. Lower the count or the child particles."
-   At the hard limit of 128 KB the preview shows a Trimmed chip and "This loop hit the size limit, so it shows fewer particles. Lower the count or the child particles." The loop then has fewer children, or coarser paths.

## Animated SVG export

The Animated SVG button under the preview saves the particles as a looping SVG file. The file always plays the baked loop. For a Live simulation the window says "Live simulation exports as its baked loop."

-   The built-in shapes and your own SVG shapes are drawn as paths in the particle colour.
-   Icon and emoji particles become dots, because a file of its own cannot draw them.
-   An own SVG shape with very large paths also becomes a dot, so the file stays under 32 KB.
-   With reduced motion, the file shows the middle of the loop, standing still.

## Particles based on a preset

[Customise a preset](library.md#customise-a-preset) on a particle, ring, scene or seasonal preset makes a particles animation based on that preset. The designer then shows the preset's name ("Based on a built-in …") and only its parameter, labelled like in the card editor, for example "Particles" or "Width (px)". Empty uses the preset's default. Timing and colour come from the animation settings.

Convert to custom particles swaps the preset for your own particles, so shape, movement, size and colours become editable. For particle presets the look changes a little; for the other presets, your particles replace the preset's look.

## On the card

On a card, a particles animation draws its layer inside the element it is set on, clipped like the built-in particle presets. A card entry can override the timing, colour and Strength (the opacity of the layer). Play On tap shows the layer when the element is tapped. See [Using animations in cards](using-in-cards.md).

-   A layer with the new settings needs `magic-card-particles.js` next to `magic-card.js`. Cards load it only when they play such a layer. While it loads, or when it is missing, the card plays a simpler version of the layer: one shape and the closest of the six older flows.
-   A baked loop is worked out once per card size, the first time the card is drawn, and then plays as CSS.
-   A live simulation runs only while the card is on screen and the browser tab is visible, and stops when the card is removed.
-   With reduced motion turned on, a layer with the new settings shows one still frame. A particles animation made with 2026.10.03 hides its layer.

## Older particle animations

Particle animations made with Magic Card 2026.10.03 open in the designer as a Baked loop and play unchanged. They keep their old format until you change something only the new settings can hold, such as a second shape, a new flow, a range, physics, a collider or child particles. From then on the animation also keeps a simpler version (one shape and the closest older flow) that older Magic Card versions play. The YAML is described in [Animation YAML](yaml.md#particles).
