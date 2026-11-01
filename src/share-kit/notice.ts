import { t } from './i18n';

// Fixed notice texts of the share-kit chunk, shown as plain text through the bound t.

/** The line shown above the preview of every import, before Confirm. */
export const untrustedNotice = (): string => t('share-kit.notice.only-import-files-from-people-you-trust');

/** The personal-data line shown on export when an item carries an author name. */
export const authorNotice = (): string => t('share-kit.notice.author-name-is-optional');
