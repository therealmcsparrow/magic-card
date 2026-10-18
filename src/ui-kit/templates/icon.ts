import { html, nothing, type TemplateResult } from 'lit';
import type { KitIcon } from '../../contracts/ui-kit';
import { glyph, isGlyphName } from '../glyphs';

/** `glyph` (the kit's 24 x 24 stroke set) wins over `icon` (an HA icon name, drawn by <ha-icon>). */
export function iconOf(o: KitIcon, size: 18 | 20 | 24 = 18): TemplateResult | typeof nothing {
  if (o.glyph && isGlyphName(o.glyph)) return glyph(o.glyph, size);
  if (o.icon) return html`<ha-icon icon=${o.icon}></ha-icon>`;
  return nothing;
}
