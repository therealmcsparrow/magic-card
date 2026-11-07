# Texture sources

Every colour map is CC0 1.0. ambientCG states that all its assets are CC0 1.0 Universal (<https://docs.ambientcg.com/license/>), and Poly Haven states that all its assets are CC0 (<https://polyhaven.com/license>). Both licence pages and each source page below were checked on 2026-11-07. CC0 needs no attribution; the list is here so each file can be traced.

| File | Source page | Download | Author | Licence | What was done to it |
|---|---|---|---|---|---|
| `tex/metal-brushed.webp` | <https://ambientcg.com/view?id=Metal009> | `Metal009_1K-JPG.zip` | Lennart Demes (ambientCG) | CC0 | Colour map, greyscale, mapped to graphite and pale steel |
| `tex/metal-anodised.webp` | <https://ambientcg.com/view?id=Metal012> | `Metal012_1K-JPG.zip` | Lennart Demes (ambientCG) | CC0 | Colour map, greyscale, mapped to dark navy |
| `tex/composite-carbon.webp` | <https://ambientcg.com/view?id=Fabric004> | `Fabric004_1K-JPG.zip` | Lennart Demes (ambientCG) | CC0 | Colour map, greyscale, mapped to near black |
| `tex/panel-seams.webp` | <https://ambientcg.com/view?id=MetalPlates002> | `MetalPlates002_1K-JPG.zip` | Lennart Demes (ambientCG) | CC0 | Colour map, greyscale, mapped to graphite and steel |
| `tex/mesh-perforated.webp` | <https://ambientcg.com/view?id=SheetMetal001> | `SheetMetal001_1K-JPG.zip` | Lennart Demes (ambientCG) | CC0 | Colour map, greyscale, mapped to dark steel |
| `tex/glass-scratched.webp` | <https://ambientcg.com/view?id=Scratches005> | `Scratches005_1K-JPG.zip` | Lennart Demes (ambientCG) | CC0 | Opacity map, levelled so only the marks remain |
| `tex/smudge-grime.webp` | <https://ambientcg.com/view?id=SurfaceImperfections013> | `SurfaceImperfections013_1K-JPG.zip` | Lennart Demes (ambientCG) | CC0 | Colour map, greyscale, normalised |
| `tex/hull-painted.webp` | <https://polyhaven.com/a/blue_metal_plate> | `blue_metal_plate_diff_1k.jpg` | Rob Tuytel | CC0 | Darkened, saturation lowered |

The Poly Haven author comes from its API. ambientCG's API returned no author field, so its name is the site's usual credit and was not checked per asset.

## What is not straight from a camera

- **Only `hull-painted` is a scan.** The ambientCG assets are marked `PBRProcedural`, apart from `SurfaceImperfections013`, marked `PBRApproximated`. Neither site offered a photo-captured brushed metal, carbon or perforated sheet among the candidates reviewed.
- **No anodised source exists.** `metal-anodised` is a second brushed map graded dark.
- **`panel-seams` has large round holes.** It tiles as a real plate, but the holes are distracting, so the hull tile uses `hull-painted` and draws its own seams. No baked part uses it.
