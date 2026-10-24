# 0049 Tabs bar design keys

Status: proposed; the active tab keys, the indicator and "base design only" are replaced by ADR 0050

## Context

The tabs module draws its bar with fixed rules in the card stylesheet; only `tab_style` (default, pills, underline) changes it. Users want to style the bar, the tabs, the indicator, the icons and the switch. Config keys are public YAML, so names and value grammars are hard to change later. The card entry has no byte headroom, while the tabs view already lives in the `modules-extra` chunk. Tabs without the new keys must render exactly as before.

## Decision

Flat keys inside the module's `design`, all prefixed `tab_`, so Copy design, Paste design and card templates carry them like any other design key:

- Bar: `tab_bar_background` (colour), `tab_bar_border_width` (length), `tab_bar_border_color` (colour), `tab_bar_border_style` (one to four border style words), `tab_bar_padding` (lengths), `tab_bar_position` (top, bottom), `tab_align` (start, center, end, stretch), `tab_gap` (length).
- Tabs: `tab_color`, `tab_background`, `tab_active_color`, `tab_active_background`, `tab_indicator_color` (colours), `tab_border_width` (length), `tab_border_color` (colour), `tab_radius` (lengths), `tab_padding` (lengths).
- Text: `tab_font_family`, `tab_font_size` (length or %), `tab_font_weight`, `tab_text_transform`.
- Icon: `tab_icon_position` (left, right, above, below; left and right follow the writing direction), `tab_icon_size` (length).
- Switch: `tab_animation` (none, fade, slide).

The tabs view in `modules-extra` turns each valid key into a custom property on `.mc-tabs` plus one token in a `data-mc-tab` attribute, using the allow-list helpers of `src/utils/safe-css.ts`. The rules that read them ship as that chunk's `styles` and are gated on the token, so a key that is not set changes no rule. `tab_bar_position: bottom` renders the bar after the panel in the DOM, so focus order follows the visual order. The keys are base design only: they are not offered in the hover design or in conditional rules.

## Consequences

magic-card.js does not change. The editor fields are a module-restricted, virtual sector in `src/utils/css-properties.ts` (editor chunk). The keys join the plain design list in tools/plain-keys.json (a tab key on another module type does nothing). The pending placeholder keeps its current height, so a heavily restyled bar may shift by a few pixels when the chunk lands. Hover and rule support can be added later by reading the resolved design in the view.
