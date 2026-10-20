import { html, nothing, type TemplateResult } from 'lit';
import type { KitButtonOptions, KitIcon, KitNoticeOptions } from '../../contracts/ui-kit';
import { glyph } from '../glyphs';
import { button } from './button';
import { iconOf } from './icon';

const TONE_GLYPH = { info: 'information', success: 'check', warn: 'help', error: 'close' } as const;

/**
 * Inline banner. Tone is carried by glyph and words, not by colour alone. role=status (polite) for info, success and
 * warn; role=alert for a refusal. `transient` marks a result-note: the caller clears it on the next edit.
 */
export function notice(o: KitNoticeOptions): TemplateResult {
  const lines = Array.isArray(o.text) ? o.text : [o.text];
  return html`<div class="notice ${o.tone}${o.transient ? ' result-note' : ''}" role=${o.tone === 'error' ? 'alert' : 'status'}>
    ${glyph(TONE_GLYPH[o.tone], 20)}
    <div class="body">
      ${lines.map((l) => html`<p>${l}</p>`)}
      ${o.action ? html`<div class="actions">${button({ label: o.action.label, size: 'sm', variant: 'secondary', onClick: o.action.onClick })}</div>` : nothing}
    </div>
  </div>`;
}

export function empty(o: { title: string; text?: string; action?: KitButtonOptions } & KitIcon): TemplateResult {
  return html`<div class="empty">
    ${iconOf(o, 24)}
    <strong>${o.title}</strong>
    ${o.text ? html`<p>${o.text}</p>` : nothing}
    ${o.action ? button({ ...o.action, variant: o.action.variant ?? 'secondary', size: 'sm' }) : nothing}
  </div>`;
}
