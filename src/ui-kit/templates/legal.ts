import { html, nothing, type TemplateResult } from 'lit';
import { fmtIn } from '../../i18n/runtime';
import { button } from './button';

export interface LegalTextOptions {
  /** The text in the user's language. */
  text: string;
  /** The English text; shown in place of `text` while `showEnglish` is on. */
  english: string;
  /** False in English: the text stands alone, with no label and no button. */
  translated: boolean;
  showEnglish: boolean;
  onToggle: () => void;
  /** The "English prevails" label and the Show English action text. */
  prevailsLabel: string;
  showLabel: string;
  /** Id of the text element; the button controls it. */
  id: string;
}

/** True for any locale tag that is not English, and under a pseudo wrap. */
export const isTranslated = (tag: string, pseudo: boolean): boolean => pseudo || !/^en(-|$)/i.test(tag);

/** English text of a message with its arguments filled in, never run through a pseudo wrap. */
export const englishOf = (en: string, args: Record<string, string | number> = {}): string => fmtIn('en-GB', en, args).join('');

/** Legal text with an English-prevails label and a Show English button; both texts are bound as text. */
export function legalText(o: LegalTextOptions): TemplateResult {
  if (!o.translated) return html`<span class="legal-text" id=${o.id}>${o.text}</span>`;
  const en = o.showEnglish;
  return html`<span class="legal-text" id=${o.id} lang=${en ? 'en' : nothing} dir=${en ? 'ltr' : nothing}>${en ? o.english : o.text}</span>
    <span class="legal-note">${o.prevailsLabel}</span>
    ${button({ label: o.showLabel, size: 'sm', variant: 'secondary', expanded: en, controls: o.id, onClick: o.onToggle })}`;
}
