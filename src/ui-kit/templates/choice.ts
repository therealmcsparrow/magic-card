import { html, nothing, type TemplateResult } from 'lit';
import type { KitSegOptions, KitTileOptions } from '../../contracts/ui-kit';
import { RovingFocus } from '../controllers/roving-focus';
import { iconOf } from './icon';

/*
 * Seg: the one tab bar and segmented control (role tablist or radiogroup). Arrow keys, Home and End move AND
 * select (radio and tab semantics), one tab stop.
 */
export function seg<V extends string>(o: KitSegOptions<V>): TemplateResult {
  const tabs = o.role === 'tablist';
  const roving = new RovingFocus({
    items: '[data-val]',
    orientation: 'horizontal',
    onMove: (el) => {
      const v = el.dataset.val as V;
      if (v !== o.value) o.onChange(v);
    },
  });
  return html`<div class="seg${o.full ? ' full' : ''}" role=${o.role} aria-label=${o.label} @keydown=${roving.onKeydown}>
    ${o.items.map((c) => {
      const on = c.value === o.value;
      const blocked = !!c.disabledReason;
      return html`<button
        type="button"
        role=${tabs ? 'tab' : 'radio'}
        data-val=${c.value}
        aria-selected=${tabs ? String(on) : nothing}
        aria-checked=${tabs ? nothing : String(on)}
        aria-disabled=${blocked ? 'true' : nothing}
        tabindex=${on ? '0' : '-1'}
        @click=${() => {
          if (!blocked) o.onChange(c.value);
        }}
      >${iconOf(c)}${c.label}</button>`;
    })}
  </div>`;
}

export function chip(o: { label: string; tone?: 'accent' | 'warn' | 'error' | 'count'; pressed?: boolean; onClick?: () => void; glyph?: string; icon?: string }): TemplateResult {
  const cls = `chip${o.tone ? ` is-${o.tone}` : ''}`;
  if (!o.onClick) return html`<span class=${cls}>${iconOf(o)}${o.label}</span>`;
  return html`<button type="button" class=${cls} aria-pressed=${o.pressed === undefined ? nothing : String(o.pressed)} @click=${o.onClick}>${iconOf(o)}${o.label}</button>`;
}

/** Pick-one tiles in a radiogroup: aria-checked, the picked tile carries the accent border. */
export function tiles<V extends string>(o: KitTileOptions<V>): TemplateResult {
  const roving = new RovingFocus({ items: '.tile', orientation: 'both', onMove: (el) => o.onPick(el.dataset.val as V) });
  return html`<div class="tiles" role="radiogroup" aria-label=${o.label} @keydown=${roving.onKeydown}>
    ${o.items.map((c) => {
      const on = c.value === o.value;
      const stop = on || (o.value === undefined && c === o.items[0]);
      return html`<button type="button" class="tile" role="radio" data-val=${c.value} aria-checked=${String(on)} tabindex=${stop ? '0' : '-1'} @click=${() => o.onPick(c.value)}>
        ${c.preview ? html`<span class="thumb">${c.preview as TemplateResult}</span>` : iconOf(c, 24)}<span>${c.label}</span>
      </button>`;
    })}
  </div>`;
}
