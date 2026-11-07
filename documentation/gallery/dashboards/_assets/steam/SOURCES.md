# Texture sources

All colour maps are CC0 1.0. Poly Haven states that all its assets are CC0 (<https://polyhaven.com/license>), and ambientCG states that all its assets are CC0 1.0 Universal (<https://docs.ambientcg.com/license/>). Both licence pages and each asset page below were checked on 2026-11-07. CC0 needs no attribution; the list is here so each file can be traced.

| File | Source page | Author | Licence | What was done to it |
|---|---|---|---|---|
| `tex/brass-worn.webp` | <https://polyhaven.com/a/rusty_metal_03> | Amal Kumar | CC0 | Ochre rust scan, desaturated and soft-lit towards brass |
| `tex/copper-verdigris.webp` | <https://polyhaven.com/a/rusty_metal_02> | Rob Tuytel | CC0 | Mapped through a copper to green-blue ramp, edges blended |
| `tex/iron-rusted.webp` | <https://polyhaven.com/a/rusty_metal_05> | Amal Kumar | CC0 | Darkened, edges blended |
| `tex/iron-soot.webp` | <https://ambientcg.com/view?id=Metal063> | Lennart Demes (ambientCG) | CC0 | Greyscale, levelled to near black, warmed, edges blended |
| `tex/enamel-chipped.webp` | <https://polyhaven.com/a/rusty_metal_04> | Amal Kumar | CC0 | Remaining paint recoloured dark green through a saturation mask, rust kept, edges blended |
| `tex/leather-old.webp` | <https://ambientcg.com/view?id=Leather014> | Lennart Demes (ambientCG) | CC0 | Local contrast raised, darkened |
| `tex/paper-foxed.webp` | <https://ambientcg.com/view?id=Paper005> and <https://polyhaven.com/a/rusty_metal_02> | Lennart Demes (ambientCG); Rob Tuytel | CC0 | Paper lightened, rust spots of the plate scan multiplied on as foxing, edges blended |

## What is not straight from a camera

- **Brass and copper are regraded.** Neither site has a photo-captured brass, bronze or copper. ambientCG's metals with those tags are all marked `PBRProcedural`, so they were left out. The surface structure here is real rust; the colour is graded.
- **Enamel and foxing are composites** of photo-based sources, as described in the table.
- **ambientCG capture method:** `Metal063`, `Leather014` and `Paper005` are marked `PBRApproximated`, meaning material maps estimated from a source image. The Poly Haven assets are listed as scans.
- **`leather-old` reads as scuffed and scratched, not deeply cracked.** No CC0 photo-based leather with real cracking turned up in the candidates reviewed.

## Baked parts

`parts/` uses no new downloads. Everything comes from the CC0 textures above, graded while baking: `iron-soot` for the surface and recess grime on the iron, `iron-rusted` for rust and the wear mask, `brass-worn` for brass, and the green areas of `copper-verdigris` for corrosion. The blue-black and grey come from the drawn fitting colours, which the soot photo is multiplied and overlaid onto.
