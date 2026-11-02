import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { glyph } from '../ui-kit';
import type { ImportNotice } from '../contracts/share-kit';
import type { LegalLine } from '../contracts/share-kit';
import { en, m, t } from './i18n';

// Fixed notice texts of the share-kit chunk, shown as plain text through the bound t.

/** The line shown above the preview of every import, before Confirm. */
export const untrustedNotice = (): string => t('share-kit.notice.only-import-files-from-people-you-trust');

/** The personal-data line shown on export when an item carries an author name. */
export const authorNotice = (): string => t('share-kit.notice.author-name-is-optional');

/** The untrusted-import line as a warning, through the host's legal text (English-prevails label and Show English). */
export const untrustedView = (legal: LegalLine): TemplateResult =>
  html`<div class="notice warn" role="status">${glyph('help', 20)}<div class="body"><p>${legal('untrusted', untrustedNotice(), en(m('share-kit.notice.only-import-files-from-people-you-trust')))}</p></div></div>`;

export const actionsHeading = (): string => t('share-kit.notice.actions-in-this-card');
export const actionsHelp = (): string => t('share-kit.notice.actions-in-this-card-help');
export const templatesHeading = (): string => t('share-kit.notice.templates-in-this-card');
export const templatesHelp = (): string => t('share-kit.notice.templates-in-this-card-help');

/** Shown under the export text when entity IDs were swapped for placeholders. */
export const idsReplacedNotice = (): string => t('share-kit.notice.entity-ids-were-replaced');

/** The actions and templates of a shared card, listed before Confirm. */
export function runView(run: ImportNotice): TemplateResult {
  const line = (a: ImportNotice['actions'][number]): string => [a.action, a.service, a.targets.join(', '), a.host].filter(Boolean).join(' ');
  return html`${run.actions.length
    ? html`<div data-share-actions><strong>${actionsHeading()}</strong><p class="help">${actionsHelp()}</p><ul>${run.actions.map((a) => html`<li><span class="mono">${line(a)}</span></li>`)}</ul></div>`
    : nothing}${run.templates.length
    ? html`<div data-share-templates><strong>${templatesHeading()}</strong><p class="help">${templatesHelp()}</p><ul>${run.templates.map((x) => html`<li><span class="mono">${x.text}</span></li>`)}</ul></div>`
    : nothing}`;
}

/** The contrast warning of imported themes, one list per item. */
export function contrastView(heading: string, items: { name: string; lines: string[] }[]): TemplateResult | typeof nothing {
  return items.length
    ? html`<div class="notice warn" role="status" data-contrast-warning>
        ${glyph('help', 20)}
        <div class="body">
          <strong>${heading}</strong>
          <ul>
            ${items.flatMap((i) => i.lines.map((l) => html`<li>${i.name}: ${l}</li>`))}
          </ul>
        </div>
      </div>`
    : nothing;
}

/** Shown under the export text when addresses on other websites were taken out; `hosts` are their domain names. */
export const removedHostsNotice = (hosts: readonly string[]): string => t('share-kit.notice.addresses-on-other-websites-were-removed', { hosts: hosts.join(', ') });

/** The notes under the export text: the author name, replaced entity IDs and removed addresses. */
export const exportNotes = (hasAuthor: boolean, replaced: boolean, removedHosts: readonly string[] = [], legal?: LegalLine): TemplateResult =>
  html`${hasAuthor ? html`<p class="help" role="status">${legal ? legal('author', authorNotice(), en(m('share-kit.notice.author-name-is-optional'))) : authorNotice()}</p>` : nothing}${replaced ? html`<p class="help" data-ids-replaced role="status">${idsReplacedNotice()}</p>` : nothing}${removedHosts.length ? html`<p class="help" data-hosts-removed role="status">${removedHostsNotice(removedHosts)}</p>` : nothing}`;
