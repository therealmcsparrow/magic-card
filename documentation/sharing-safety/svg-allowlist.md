# SVG allowlist

Magic Card cleans every SVG it takes in with one of two rule sets. The own-icon rules apply to SVG icons you add yourself. The image rules apply to drawings in the image editor and the image library, including SVG files you open or import there. Both work the same way: an element or attribute that is not in the tables below is removed, so anything that could run code or fetch something from another site never reaches your dashboard.

The names and rules on this page are the ones in the code. A test (`tests/svg-allowlist-doc.test.ts`) compares this page with the code, so the two cannot drift apart. Each entry links to the W3C SVG 2 specification, which defines what the element or attribute does. Clipping and masking are defined in CSS Masking Module Level 1, which SVG 2 refers to, so those rows link to both.

## Elements

"yes" means the element is kept; "no" means it is removed with everything inside it.

| Element | Own icons | Images | W3C SVG 2 |
| --- | --- | --- | --- |
| `svg` | yes | yes | https://www.w3.org/TR/SVG2/struct.html#SVGElement |
| `g` | yes | yes | https://www.w3.org/TR/SVG2/struct.html#GElement |
| `defs` | yes | yes | https://www.w3.org/TR/SVG2/struct.html#DefsElement |
| `title` | yes | yes | https://www.w3.org/TR/SVG2/struct.html#TitleElement |
| `path` | yes | yes | https://www.w3.org/TR/SVG2/paths.html#PathElement |
| `circle` | yes | yes | https://www.w3.org/TR/SVG2/shapes.html#CircleElement |
| `ellipse` | yes | yes | https://www.w3.org/TR/SVG2/shapes.html#EllipseElement |
| `rect` | yes | yes | https://www.w3.org/TR/SVG2/shapes.html#RectElement |
| `line` | yes | yes | https://www.w3.org/TR/SVG2/shapes.html#LineElement |
| `polyline` | yes | yes | https://www.w3.org/TR/SVG2/shapes.html#PolylineElement |
| `polygon` | yes | yes | https://www.w3.org/TR/SVG2/shapes.html#PolygonElement |
| `linearGradient` | yes | yes | https://www.w3.org/TR/SVG2/pservers.html#LinearGradientElement |
| `radialGradient` | yes | yes | https://www.w3.org/TR/SVG2/pservers.html#RadialGradientElement |
| `stop` | yes | yes | https://www.w3.org/TR/SVG2/pservers.html#StopElement |
| `clipPath` | yes | yes | https://www.w3.org/TR/SVG2/eltindex.html, https://www.w3.org/TR/css-masking-1/#ClipPathElement |
| `mask` | yes | yes | https://www.w3.org/TR/SVG2/eltindex.html, https://www.w3.org/TR/css-masking-1/#MaskElement |
| `text` | no | yes | https://www.w3.org/TR/SVG2/text.html#TextElement |
| `tspan` | no | yes | https://www.w3.org/TR/SVG2/text.html#TSpanElement |

## Attributes

Each cell names the rule that checks the value, or "no" when the attribute is removed. The rules are explained in the next section.

| Attribute | Own icons | Images | W3C SVG 2 |
| --- | --- | --- | --- |
| `d` | value | path | https://www.w3.org/TR/SVG2/paths.html#DProperty |
| `cx` | value | length | https://www.w3.org/TR/SVG2/geometry.html#CX |
| `cy` | value | length | https://www.w3.org/TR/SVG2/geometry.html#CY |
| `r` | value | length | https://www.w3.org/TR/SVG2/geometry.html#R |
| `rx` | value | length | https://www.w3.org/TR/SVG2/geometry.html#RX |
| `ry` | value | length | https://www.w3.org/TR/SVG2/geometry.html#RY |
| `x` | value | length | https://www.w3.org/TR/SVG2/geometry.html#X |
| `y` | value | length | https://www.w3.org/TR/SVG2/geometry.html#Y |
| `x1` | value | length | https://www.w3.org/TR/SVG2/shapes.html#LineElementX1Attribute |
| `y1` | value | length | https://www.w3.org/TR/SVG2/shapes.html#LineElementY1Attribute |
| `x2` | value | length | https://www.w3.org/TR/SVG2/shapes.html#LineElementX2Attribute |
| `y2` | value | length | https://www.w3.org/TR/SVG2/shapes.html#LineElementY2Attribute |
| `dx` | no | length | https://www.w3.org/TR/SVG2/text.html#TextElementDXAttribute |
| `dy` | no | length | https://www.w3.org/TR/SVG2/text.html#TextElementDYAttribute |
| `fx` | no | length | https://www.w3.org/TR/SVG2/pservers.html#RadialGradientElementFXAttribute |
| `fy` | no | length | https://www.w3.org/TR/SVG2/pservers.html#RadialGradientElementFYAttribute |
| `fr` | no | length | https://www.w3.org/TR/SVG2/pservers.html#RadialGradientElementFRAttribute |
| `width` | value | length | https://www.w3.org/TR/SVG2/geometry.html#Sizing |
| `height` | value | length | https://www.w3.org/TR/SVG2/geometry.html#Sizing |
| `points` | value | points | https://www.w3.org/TR/SVG2/shapes.html#PolylineElementPointsAttribute |
| `fill` | value | paint | https://www.w3.org/TR/SVG2/painting.html#FillProperty |
| `stroke` | value | paint | https://www.w3.org/TR/SVG2/painting.html#StrokeProperty |
| `stroke-width` | value | length | https://www.w3.org/TR/SVG2/painting.html#StrokeWidthProperty |
| `stroke-linecap` | value | keyword | https://www.w3.org/TR/SVG2/painting.html#StrokeLinecapProperty |
| `stroke-linejoin` | value | keyword | https://www.w3.org/TR/SVG2/painting.html#StrokeLinejoinProperty |
| `stroke-miterlimit` | no | length | https://www.w3.org/TR/SVG2/painting.html#StrokeMiterlimitProperty |
| `stroke-dasharray` | no | length | https://www.w3.org/TR/SVG2/painting.html#StrokeDasharrayProperty |
| `stroke-dashoffset` | no | length | https://www.w3.org/TR/SVG2/painting.html#StrokeDashoffsetProperty |
| `opacity` | value | length | https://www.w3.org/TR/SVG2/render.html#ObjectAndGroupOpacityProperties |
| `fill-opacity` | value | length | https://www.w3.org/TR/SVG2/painting.html#FillOpacityProperty |
| `stroke-opacity` | value | length | https://www.w3.org/TR/SVG2/painting.html#StrokeOpacityProperty |
| `transform` | transform | transform | https://www.w3.org/TR/SVG2/coords.html#TransformProperty |
| `viewBox` | value | length | https://www.w3.org/TR/SVG2/coords.html#ViewBoxAttribute |
| `id` | id | id | https://www.w3.org/TR/SVG2/struct.html#IDAttribute |
| `class` | class | class | https://www.w3.org/TR/SVG2/styling.html#ClassAttribute |
| `offset` | value | length | https://www.w3.org/TR/SVG2/pservers.html#StopElementOffsetAttribute |
| `stop-color` | value | paint | https://www.w3.org/TR/SVG2/pservers.html#StopColorProperty |
| `stop-opacity` | value | length | https://www.w3.org/TR/SVG2/pservers.html#StopOpacityProperty |
| `gradientUnits` | value | keyword | https://www.w3.org/TR/SVG2/pservers.html#LinearGradientElementGradientUnitsAttribute |
| `gradientTransform` | transform | transform | https://www.w3.org/TR/SVG2/pservers.html#LinearGradientElementGradientTransformAttribute |
| `spreadMethod` | no | keyword | https://www.w3.org/TR/SVG2/pservers.html#LinearGradientElementSpreadMethodAttribute |
| `clip-path` | value | reference | https://www.w3.org/TR/SVG2/propidx.html, https://www.w3.org/TR/css-masking-1/#the-clip-path |
| `clipPathUnits` | no | keyword | https://www.w3.org/TR/SVG2/attindex.html, https://www.w3.org/TR/css-masking-1/#element-attrdef-clippath-clippathunits |
| `mask` | value | reference | https://www.w3.org/TR/SVG2/propidx.html, https://www.w3.org/TR/css-masking-1/#the-mask |
| `maskUnits` | no | keyword | https://www.w3.org/TR/SVG2/attindex.html, https://www.w3.org/TR/css-masking-1/#element-attrdef-mask-maskunits |
| `maskContentUnits` | no | keyword | https://www.w3.org/TR/SVG2/attindex.html, https://www.w3.org/TR/css-masking-1/#element-attrdef-mask-maskcontentunits |
| `fill-rule` | value | keyword | https://www.w3.org/TR/SVG2/painting.html#FillRuleProperty |
| `clip-rule` | value | keyword | https://www.w3.org/TR/SVG2/propidx.html, https://www.w3.org/TR/css-masking-1/#the-clip-rule |
| `paint-order` | no | keyword | https://www.w3.org/TR/SVG2/painting.html#PaintOrderProperty |
| `vector-effect` | no | keyword | https://www.w3.org/TR/SVG2/coords.html#VectorEffectProperty |
| `visibility` | no | keyword | https://www.w3.org/TR/SVG2/render.html#VisibilityControl |
| `font-size` | no | length | https://www.w3.org/TR/SVG2/propidx.html |
| `font-family` | no | font | https://www.w3.org/TR/SVG2/propidx.html |
| `font-weight` | no | keyword | https://www.w3.org/TR/SVG2/propidx.html |
| `font-style` | no | keyword | https://www.w3.org/TR/SVG2/propidx.html |
| `text-anchor` | no | keyword | https://www.w3.org/TR/SVG2/text.html#TextAnchoringProperties |
| `dominant-baseline` | no | keyword | https://www.w3.org/TR/SVG2/text.html#DominantBaselineProperty |
| `letter-spacing` | no | length | https://www.w3.org/TR/SVG2/text.html#LetterSpacingProperty |
| `preserveAspectRatio` | no | keyword | https://www.w3.org/TR/SVG2/coords.html#PreserveAspectRatioAttribute |
| `data-name` | no | data-name | https://www.w3.org/TR/SVG2/attindex.html |

## Value rules

Before most rules run, a value is removed if it holds any of these blocked tokens: a backslash `\`, `<`, `>`, `//`, `/*`, `javascript:`, `vbscript:`, `data:`, `expression(` or `@import`. Matching ignores upper and lower case. In images, the `path`, `points`, `font`, `data-name` and `class` rules use their own strict patterns, which leave no room for these tokens.

| Rule | Used by | What it keeps |
| --- | --- | --- |
| value | Own icons | The value as written, when every bracket opens a colour function (rgb, rgba, hsl, hsla, hwb, lab, lch, oklab, oklch, color, color-mix). A `url(#id)` that points into the same drawing is the only url() it keeps. |
| transform | Own icons, Images | Only the functions matrix, translate, scale, rotate, skewX and skewY. In images each function takes numbers only, and at most 16 functions are kept. |
| id | Own icons, Images | Own icons: letters, digits, `_`, `.`, `:` and `-`. Images: a letter followed by up to 63 letters, digits, `_`, `.` or `-`; an id used twice is removed the second time. |
| class | Own icons, Images | Class names made of letters, digits, `_` and `-` (up to 64 characters each in images). Other names are removed and the rest kept. |
| length | Images | Digits, letters for units, `%`, `.`, `,`, `+`, `-` and spaces. No brackets, so no functions. |
| path | Images | Path commands (M, L, H, V, C, S, Q, T, A, Z in either case) and numbers. |
| points | Images | Numbers, commas, spaces and `%`. |
| paint | Images | A hex colour, a colour name of 3 to 20 letters, `url(#id)` into the same drawing, `var(--name)` with an optional hex fallback, or a colour function from the list above. At most 200 characters. |
| keyword | Images | Letters, digits, spaces and hyphens, at most 40 characters. |
| reference | Images | `none` or `url(#id)` into the same drawing. |
| font | Images | One of sans-serif, serif, monospace or system-ui. Any other font becomes sans-serif, so a drawing cannot load a web font. |
| data-name | Images | 1 to 80 characters with no `<`, `>`, `"`, `&`, backslash or control characters. |

## Attributes that point somewhere

These are the only places where an SVG could name something outside itself. Each one may only point inside the same drawing.

- `fill`, `stroke` and `stop-color` keep `url(#id)` only. A url() with a web address, a file name, `data:` or `javascript:` is removed. Images also allow `var(--name)`, which reads a colour from your theme and fetches nothing.
- `clip-path` and `mask` keep `url(#id)` only (images also accept `none`).
- `href` and `xlink:href` are never kept. When a gradient inherits its stops from another gradient through `href="#id"`, the stops are copied into it, following at most 8 links, and the `href` is removed. A link to anything other than a gradient in the same drawing is removed.
- `style` attributes and `<style>` elements are never kept. When style reading is on, the properties in the next section are turned into plain attributes first and checked by the same rules; everything else in the style is removed.

## Style properties

Only these properties survive from a `style` attribute or a `<style>` element. A keyword property keeps only the words listed.

| Property | Rule | W3C SVG 2 |
| --- | --- | --- |
| `fill` | paint | https://www.w3.org/TR/SVG2/painting.html#FillProperty |
| `stroke` | paint | https://www.w3.org/TR/SVG2/painting.html#StrokeProperty |
| `stop-color` | stop-paint | https://www.w3.org/TR/SVG2/pservers.html#StopColorProperty |
| `opacity` | alpha | https://www.w3.org/TR/SVG2/render.html#ObjectAndGroupOpacityProperties |
| `fill-opacity` | alpha | https://www.w3.org/TR/SVG2/painting.html#FillOpacityProperty |
| `stroke-opacity` | alpha | https://www.w3.org/TR/SVG2/painting.html#StrokeOpacityProperty |
| `stop-opacity` | alpha | https://www.w3.org/TR/SVG2/pservers.html#StopOpacityProperty |
| `stroke-width` | width | https://www.w3.org/TR/SVG2/painting.html#StrokeWidthProperty |
| `stroke-miterlimit` | miterlimit | https://www.w3.org/TR/SVG2/painting.html#StrokeMiterlimitProperty |
| `stroke-dashoffset` | offset | https://www.w3.org/TR/SVG2/painting.html#StrokeDashoffsetProperty |
| `stroke-dasharray` | dasharray | https://www.w3.org/TR/SVG2/painting.html#StrokeDasharrayProperty |
| `stroke-linecap` | keyword: butt, round, square | https://www.w3.org/TR/SVG2/painting.html#StrokeLinecapProperty |
| `stroke-linejoin` | keyword: miter, round, bevel, arcs, miter-clip | https://www.w3.org/TR/SVG2/painting.html#StrokeLinejoinProperty |
| `fill-rule` | keyword: nonzero, evenodd | https://www.w3.org/TR/SVG2/painting.html#FillRuleProperty |
| `clip-rule` | keyword: nonzero, evenodd | https://www.w3.org/TR/SVG2/propidx.html, https://www.w3.org/TR/css-masking-1/#the-clip-rule |
| `paint-order` | paint-order | https://www.w3.org/TR/SVG2/painting.html#PaintOrderProperty |
| `vector-effect` | keyword: none, non-scaling-stroke | https://www.w3.org/TR/SVG2/coords.html#VectorEffectProperty |

## Never allowed

These are left out on purpose, because they can run code, load another file or show content from another site. They are removed wherever they appear.

| Element | Why | W3C SVG 2 |
| --- | --- | --- |
| `script` | Runs code. | https://www.w3.org/TR/SVG2/interact.html#ScriptElement |
| `foreignObject` | Embeds HTML, which can hold forms, frames and scripts. | https://www.w3.org/TR/SVG2/embedded.html#ForeignObjectElement |
| `use` | Copies in content, also from other files. | https://www.w3.org/TR/SVG2/struct.html#UseElement |
| `image` | Loads a picture from a web address. | https://www.w3.org/TR/SVG2/embedded.html#ImageElement |
| `feImage` | A filter step that loads a picture from a web address. | https://www.w3.org/TR/SVG2/eltindex.html |
| `a` | A link that can open any address. | https://www.w3.org/TR/SVG2/linking.html#AElement |
| `style` | Style sheets can load files; only the properties above are read from it. | https://www.w3.org/TR/SVG2/styling.html#StyleElement |
| `animate` | Can change any attribute after cleaning. The only exception is a path morph that the image editor wrote, described under Library image morphs. | https://www.w3.org/TR/SVG2/eltindex.html |
| `set` | Can change any attribute after cleaning. Never kept, not even beside a morph. | https://www.w3.org/TR/SVG2/eltindex.html |
| `animateMotion` | Animation from the drawing itself. | https://www.w3.org/TR/SVG2/eltindex.html |
| `animateTransform` | Animation from the drawing itself. | https://www.w3.org/TR/SVG2/eltindex.html |
| `filter` | Filter steps can load pictures. | https://www.w3.org/TR/SVG2/eltindex.html |
| `pattern` | Can reference other content. | https://www.w3.org/TR/SVG2/pservers.html#PatternElement |
| `marker` | Not needed for drawings here. | https://www.w3.org/TR/SVG2/painting.html#MarkerElement |
| `symbol` | Only useful with `use`. | https://www.w3.org/TR/SVG2/struct.html#SymbolElement |
| `switch` | Picks content by browser features. | https://www.w3.org/TR/SVG2/struct.html#SwitchElement |
| `iframe` | Embeds another page. | https://www.w3.org/TR/SVG2/embedded.html |

| Attribute | Why | W3C SVG 2 |
| --- | --- | --- |
| `href` | Points at another element or file. | https://www.w3.org/TR/SVG2/linking.html#XLinkHrefAttribute |
| `xlink:href` | The old name of `href`. | https://www.w3.org/TR/SVG2/linking.html#XLinkHrefAttribute |
| `style` | Can hold any CSS; only the properties above are read from it. | https://www.w3.org/TR/SVG2/styling.html#StyleAttribute |
| `onload` | Runs code. Every attribute that starts with `on` is an event handler and is removed. | https://www.w3.org/TR/SVG2/interact.html#EventAttributes |
| `onclick` | Runs code. | https://www.w3.org/TR/SVG2/interact.html#EventAttributes |
| `onerror` | Runs code. | https://www.w3.org/TR/SVG2/interact.html#EventAttributes |

## Library image morphs

A library image can carry one kind of animation: a path morph that the image editor wrote. It is an `animate` element, and it stays only when all of these hold. If any one fails, the whole `animate` element is removed. Nothing is repaired or blanked, and the Utils integration refuses to save the image.

- The image comes from a saved record, not from an upload, a paste or a transfer. Those keep no animation at all.
- The `animate` element is in the SVG namespace, is empty, and is a direct child of a `path`. A path holds at most one.
- Its `id` is named by a morph in the record's animation, its `path` is that morph's target, and it carries only the attributes in the table below. Any other attribute, such as `href`, `from`, `to`, `by` or `end`, removes it.
- The `set`, `animateMotion`, `animateTransform` and `discard` elements are removed in every case.

| Attribute | What it must hold |
| --- | --- |
| `id` | A letter followed by up to 63 letters, digits, `_`, `.` or `-`. Required. |
| `attributeName` | Exactly `d`. Required. |
| `values` | 2 to 32 frames of path data separated by `;`. A frame uses only path commands, digits, `.`, `,`, `+`, `-`, `e`, `E` and spaces, and every frame uses the same commands. The frames match the morph's frames in the record. Required. |
| `dur` | A number followed by `s` or `ms`. Required. |
| `repeatCount` | A number or `indefinite`. |
| `keyTimes` | One number per frame, from 0 to 1, never falling. Each is that frame's place in the record's morph (50 becomes 0.5). |
| `keySplines` | Four numbers from 0 to 1 for each step between frames. Required when `calcMode` is `spline`. |
| `calcMode` | `linear` or `spline`. |
| `fill` | `freeze` or `remove`. |
| `begin` | Exactly `indefinite`. Required. |

## Size limits

- Own icons: at most 32 KiB and nested at most 64 levels deep.
- Images: at most 1 MiB, at most 10,000 elements and nested at most 64 levels deep. An image file that holds a doctype, an entity declaration, a processing instruction or a CDATA section outside a style element is refused before it is read.

## Sources

- Scalable Vector Graphics (SVG) 2, W3C: https://www.w3.org/TR/SVG2/
- CSS Masking Module Level 1, W3C: https://www.w3.org/TR/css-masking-1/
