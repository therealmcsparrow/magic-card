import { i18nFor } from '../../i18n/runtime';
import tables from './messages.gen';

/** Messages of the theme editor (namespace 'theme-editor', tables in magic-card-theme-editor.js). Write t('British text'); mark catalogue data with m(). */
export const { t, tc, tx, m, locale } = i18nFor('theme-editor', tables);
