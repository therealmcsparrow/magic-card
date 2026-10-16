# Custom CSS

The Custom CSS field sits at the bottom of the [Design tab](README.md), in the Advanced group after Lists & tables. Its placeholder says where it applies: "Applied to this module only" (or row, or column). The YAML key is `design.css`.

The text is added to the element's inline style after all other design keys. It takes CSS declarations only, separated by semicolons. Selectors, `@media`, `@keyframes` and other rules don't work here.

```yaml
design:
  css: "mix-blend-mode: screen; letter-spacing: 0.08em; --mc-gap: 4px"
```

Because the declarations come last, they win over the same properties set in the fields above. Custom properties (`--name: value`) set here are inherited by the content of the element, which is a way to adjust theme variables for one element:

```yaml
design:
  css: "--primary-color: #ff9800; --secondary-text-color: #bbb"
```

The field has its own reset button. In a [conditional rule](conditional-design.md), the field edits the rule's `css`, which replaces the default `css` while the rule matches. In the [Hover](hover.md) view it edits `hover.css`, which is added on top of the default `css` while the pointer is over the element.

A Google font named in a `font-family` declaration here is loaded like one picked in the font field. See [Font family](README.md#font-family).

The card's own Custom CSS is the last field of the card's Design tab (`css` at the top level). It applies to the card's content.
