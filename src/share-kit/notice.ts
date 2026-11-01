import { t } from './i18n';

// Fixed notice texts of the share-kit chunk, shown as plain text through the bound t.

/** The line shown above the preview of every import, before Confirm. */
export const untrustedNotice = (): string => t('share-kit.notice.only-import-files-from-people-you-trust');

/** The personal-data line shown on export when an item carries an author name. */
export const authorNotice = (): string => t('share-kit.notice.author-name-is-optional');

export const actionsHeading = (): string => t('share-kit.notice.actions-in-this-card');
export const actionsHelp = (): string => t('share-kit.notice.actions-in-this-card-help');
export const templatesHeading = (): string => t('share-kit.notice.templates-in-this-card');
export const templatesHelp = (): string => t('share-kit.notice.templates-in-this-card-help');

/** Shown under the export text when entity IDs were swapped for placeholders. */
export const idsReplacedNotice = (): string => t('share-kit.notice.entity-ids-were-replaced');
