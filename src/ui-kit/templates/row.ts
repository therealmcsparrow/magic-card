import { html, nothing, type TemplateResult } from 'lit';
import type { KitButtonOptions, KitRowOptions } from '../../contracts/ui-kit';
import { glyph } from '../glyphs';
import { iconOf } from './icon';

/**
 * The list or tree row (design/10 section 4.9). Renders in the caller's root, so the caller's kit CSS styles it.
 * `level` makes it a treeitem (aria-level, aria-selected, aria-expanded); without it it is a listitem and `selected`
 * only tints it (aria-selected is not allowed there). Additive to KitRowOptions, used by the library view:
 * - `sub` a second line under the name (mono),
 * - `check` a leading `.check` checkbox, and the name becomes its label (multi-select lists),
 * - `content` replaces the name (inline rename), `trail` follows the actions (inline delete confirmation).
 * `onSelect` is optional because a check row selects through its checkbox.
 */
export interface RowOptions extends Omit<KitRowOptions, 'onSelect'> {
  onSelect?: KitRowOptions['onSelect'];
  sub?: string;
  check?: { label: string; checked: boolean; onChange: (v: boolean) => void };
  content?: TemplateResult;
  /** A host's leading node (a thumbnail), drawn before the name; any lit child value. */
  lead?: unknown;
  trail?: TemplateResult;
}

const action = (a: KitButtonOptions): TemplateResult => {
  const blocked = !!a.disabledReason;
  return html`<button
    type="button"
    class="icon-btn xs${a.variant === 'danger' ? ' danger' : ''}"
    aria-label=${a.label}
    title=${a.label}
    aria-pressed=${a.pressed === undefined ? nothing : String(a.pressed)}
    aria-disabled=${blocked ? 'true' : nothing}
    ?disabled=${a.disabled}
    @click=${(e: MouseEvent) => {
      if (!blocked) a.onClick(e);
    }}
  >${iconOf(a, 18)}</button>`;
};

export function row(o: RowOptions): TemplateResult {
  const tree = o.level !== undefined;
  const checkId = `row-${o.id}-check`;
  const label = html`${o.name}${o.sub ? html`<small>${o.sub}</small>` : nothing}`;
  const name = o.content
    ? o.content
    : o.check
      ? html`<label class="name" for=${checkId}>${label}</label>`
      : html`<button type="button" class="name" @click=${(e: MouseEvent) => o.onSelect?.(e)}>${label}</button>`;
  return html`<div
    class="row${o.selected || o.check?.checked ? ' selected' : ''}"
    role=${tree ? 'treeitem' : 'listitem'}
    aria-level=${tree ? String(o.level) : nothing}
    aria-selected=${tree ? String(!!o.selected) : nothing}
    aria-expanded=${o.expanded === undefined ? nothing : String(o.expanded)}
    style=${tree ? `--lvl:${Math.max(0, o.level! - 1)}` : nothing}
  >
    ${o.grip ? html`<span class="grip" aria-hidden="true">${glyph('grip', 18)}</span>` : nothing}
    ${o.check
      ? html`<input type="checkbox" class="check" id=${checkId} aria-label=${o.check.label} .checked=${o.check.checked} @change=${(e: Event) => o.check!.onChange((e.target as HTMLInputElement).checked)} />`
      : nothing}
    ${iconOf(o)}${o.lead ?? nothing}${name}
    ${o.actions?.length ? html`<span class="acts">${o.actions.map(action)}</span>` : nothing}${o.trail ?? nothing}
  </div>`;
}
