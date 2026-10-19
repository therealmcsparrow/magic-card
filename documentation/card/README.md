# Card configuration

The YAML reference for the card itself, its rows and columns, actions, display conditions, conditional appearance and pop-ups. Most keys also have a field in the editor, described in [Inspector](../inspector/README.md); the pages mark the ones that are YAML only. Module options are in [Modules](../modules/README.md), design keys in [Design](../design/README.md), and flow lines in [Flows](../flows/README.md). For writing YAML by hand, see [YAML](../yaml/README.md).

## Pages

-   [Card options](card-options.md): card-level keys, themes, background, size, custom CSS, hover, shape, value background, seasonal scene, Home Assistant's `grid_options`
-   [Card entity](../card-entity/README.md): one entity for the whole card, which modules, rows and columns follow
-   [Rows and columns](rows-and-columns.md): layout, column widths, row actions, gap, padding, alignment
-   [Actions](actions.md): tap, hold and double tap on modules and rows, every action type, pop-up actions
-   [Display conditions](display-conditions.md): state, attribute, time and template conditions
-   [Conditional appearance](conditional-appearance.md): card fields that change while conditions match
-   [Pop-ups](popups.md): a card shown as a bottom sheet or dialog

## Structure

```
card
 └─ rows[]            layout, column_widths, gap, padding, design, actions, display
     └─ columns[]     vertical_align, gap, padding, design, display
         └─ modules[] type, entity, design, actions, display, module options
```

A minimal card:

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: text
            text: Welcome to Magic Card
```

The card needs `type` and a `rows` list. Every row needs a `columns` list, and every column a `modules` list; the card shows a configuration error otherwise. `id` keys on rows, columns and modules are optional. The editor writes them, and the card derives stable ones from the position when they are missing.
