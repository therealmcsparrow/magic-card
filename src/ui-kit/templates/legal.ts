import { html, nothing, type TemplateResult } from 'lit';
import type { KitLegalTextOptions } from '../../contracts/ui-kit';
import { button } from './button';

export type LegalTextOptions = KitLegalTextOptions;

/** True for any locale tag that is not English, and under a pseudo wrap. */
export const isTranslated = (tag: string, pseudo: boolean): boolean => pseudo || !/^en(-|$)/i.test(tag);

/** Legal text with an English-prevails label and a Show English button; both texts are bound as text. */
export function legalText(o: LegalTextOptions): TemplateResult {
  if (!o.translated) return html`<span class="legal-text" id=${o.id}>${o.text}</span>`;
  const en = o.showEnglish;
  return html`<span class="legal-text" id=${o.id} lang=${en ? 'en' : nothing} dir=${en ? 'ltr' : nothing}>${en ? o.english : o.text}</span>
    <span class="legal-note">${o.prevailsLabel}</span>
    ${button({ label: o.showLabel, size: 'sm', variant: 'secondary', expanded: en, controls: o.id, onClick: o.onToggle })}`;
}
