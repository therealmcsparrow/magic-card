# YAML

Writing Magic Card configs by hand. Everything the editor can do is stored as YAML, and a few options (`fire-dom-event` data, Home Assistant's `layout_options`) exist only there.

A minimal card:

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: text
            text: Hello
```

## Pages

| Page | Covers |
| --- | --- |
| [Schema](schema.md) | The whole config tree as one annotated skeleton, then every key of the card, rows, columns, shared module keys, layout children, design, hover, actions, conditions, animations, ring, shape, value background, seasonal scenes, icon effects, flows, pop-up and template link, with types and defaults |
| [Value syntax](value-syntax.md) | Lengths and units, numbers and booleans, times, colours, entity colours, images and media, fonts, entity and attribute references, Jinja templates, ids, quoting |
| [YAML mode](yaml-mode.md) | How the editor applies YAML, validation and error messages, what it keeps and changes, round trips with Form mode, template-linked cards, legacy keys |
| [Troubleshooting](troubleshooting.md) | Common mistakes and their fixes |
| [Examples](examples/README.md) | Thirteen complete cards to copy and adapt |

## Related

-   [Card, rows and columns](../card/README.md): card-level keys, actions, display conditions, conditional appearance and pop-ups in detail
-   [Modules](../modules/README.md): every module type and its options
-   [Design](../design/README.md): design keys group by group, hover, animations, rings, shapes, value backgrounds and seasonal scenes
-   [Icon effects](../icon-effects/README.md): fill, device animations, line draw, morphing, colours, own SVG
-   [Flow lines](../flows/README.md): animated lines between modules
-   [Pane editor](../editor/README.md): the Form / YAML switch and templates
