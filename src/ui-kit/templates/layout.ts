import { html, nothing, type TemplateResult } from 'lit';
import { ref } from 'lit/directives/ref.js';
import type { KitButtonOptions, KitIcon, KitTopBarOptions } from '../../contracts/ui-kit';
import { RovingFocus } from '../controllers/roving-focus';
import { glyph } from '../glyphs';
import { button } from './button';
import { iconOf } from './icon';

/*
 * Layout helpers (contract ui-kit 1.0.0): topBar, toolbar (float capsule or vertical rail) and sectionHead.
 * They render in the caller's root with the kit classes; the strings all come from the caller.
 */

let seq = 0;

/** The full-screen layer header, design/10 4.8: Back | title | name | spacer | Undo, Redo | actions | Help. */
export function topBar(o: KitTopBarOptions): TemplateResult {
  const errId = o.name?.error ? `tb-name-err-${++seq}` : '';
  return html`<header class="topbar">
    ${button({ ...o.back, variant: 'secondary', glyph: 'arrowLeft', iconOnly: false })}
    <h1 class="title">${o.title}</h1>
    ${o.name
      ? html`<div class="name">
          <input
            class="input"
            type="text"
            aria-label=${o.name.label}
            placeholder=${o.name.placeholder ?? ''}
            .value=${o.name.value}
            aria-invalid=${o.name.error ? 'true' : nothing}
            aria-describedby=${errId || nothing}
            @input=${(e: Event) => o.name?.onInput((e.target as HTMLInputElement).value)}
          />
          ${o.name.error ? html`<p class="help error" id=${errId}>${o.name.error}</p>` : nothing}
        </div>`
      : nothing}
    <span class="spacer"></span>
    ${o.undo ? button({ ...o.undo, iconOnly: true }) : nothing}
    ${o.redo ? button({ ...o.redo, iconOnly: true }) : nothing}
    ${o.actions.map((a) => button(a))}
    ${o.help ? button({ ...o.help, iconOnly: true }) : nothing}
  </header>`;
}

/** Float toolbar (`.toolbar`, small buttons) or tool rail (`.rail`), one tab stop, arrows along the orientation. */
export function toolbar(o: { label: string; orientation: 'horizontal' | 'vertical'; kind: 'float' | 'rail'; items: (KitButtonOptions | 'divider')[] }): TemplateResult {
  const roving = new RovingFocus({ items: 'button:not([disabled])', orientation: o.orientation });
  const stops = (group: Element | undefined, focused?: Element): void => {
    if (!group) return;
    const btns = Array.from(group.querySelectorAll<HTMLElement>('button:not([disabled])'));
    const on = focused && btns.includes(focused as HTMLElement) ? focused : btns[0];
    for (const b of btns) b.tabIndex = b === on ? 0 : -1;
  };
  return html`<div
    class=${o.kind === 'rail' ? 'rail' : 'toolbar'}
    role="toolbar"
    aria-label=${o.label}
    aria-orientation=${o.orientation}
    @keydown=${roving.onKeydown}
    @focusin=${(e: FocusEvent) => stops(e.currentTarget as Element, e.composedPath()[0] as Element)}
    ${ref((el) => {
      if (el) queueMicrotask(() => stops(el, el.contains(document.activeElement) ? (document.activeElement as Element) : undefined));
    })}
  >
    ${o.items.map((it) =>
      it === 'divider'
        ? html`<span role="separator" aria-orientation=${o.orientation === 'horizontal' ? 'vertical' : 'horizontal'}></span>`
        : button(o.kind === 'float' && !it.iconOnly ? { ...it, size: 'sm' } : { ...it, size: it.iconOnly && o.kind === 'float' ? 'sm' : it.size }),
    )}
  </div>`;
}

/** Panel heading: plain `h3`/`h4` (0.875rem/500), or a collapsible head, a button inside the heading with aria-expanded. */
export function sectionHead(o: { title: string; level?: 3 | 4; collapsible?: boolean; expanded?: boolean; onToggle?: () => void } & KitIcon): TemplateResult {
  const h4 = o.level === 4;
  const icon = iconOf(o, 18);
  if (!o.collapsible) {
    const t = html`${icon}${h4 ? html`<h4>${o.title}</h4>` : html`<h3>${o.title}</h3>`}`;
    return html`<div class="group-head">${t}</div>`;
  }
  const btn = html`<button type="button" class="sector-btn" aria-expanded=${String(!!o.expanded)} @click=${() => o.onToggle?.()}>
    ${icon}<span class="nm">${o.title}</span><span class="chev">${glyph('chevronDown', 20)}</span>
  </button>`;
  return h4 ? html`<h4 class="sector-head">${btn}</h4>` : html`<h3 class="sector-head">${btn}</h3>`;
}
