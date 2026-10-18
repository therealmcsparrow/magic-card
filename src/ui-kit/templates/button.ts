import { html, nothing, type TemplateResult } from 'lit';
import type { KitButtonOptions } from '../../contracts/ui-kit';
import { iconOf } from './icon';

/*
 * Button helper (contract ui-kit 1.0.0). Renders in the caller's root, so the caller's kit CSS styles it.
 * Icon-only: `label` becomes aria-label and title. `disabledReason` keeps the button focusable (aria-disabled)
 * and the click is ignored; the caller shows the reason as text next to it.
 */
export function button(o: KitButtonOptions): TemplateResult {
  const blocked = !!o.disabledReason;
  const cls = o.iconOnly
    ? `icon-btn${o.size === 'sm' ? ' sm' : ''}`
    : `btn btn-${o.variant ?? 'secondary'}${o.size === 'sm' ? ' btn-sm' : ''}`;
  return html`<button
    type="button"
    class=${cls}
    aria-label=${o.iconOnly ? o.label : nothing}
    title=${o.iconOnly ? o.label : nothing}
    aria-pressed=${o.pressed === undefined ? nothing : String(o.pressed)}
    aria-disabled=${blocked ? 'true' : nothing}
    aria-haspopup=${o.haspopup ?? nothing}
    aria-expanded=${o.expanded === undefined ? nothing : String(o.expanded)}
    aria-controls=${o.controls ?? nothing}
    aria-keyshortcuts=${o.keys ?? nothing}
    ?disabled=${o.disabled}
    @click=${(e: MouseEvent) => {
      if (!blocked) o.onClick(e);
    }}
  >${iconOf(o, o.iconOnly ? 20 : 18)}${o.iconOnly ? nothing : o.label}</button>`;
}
