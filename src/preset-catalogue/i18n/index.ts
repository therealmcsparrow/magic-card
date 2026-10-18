import { i18nFor } from '../../i18n/runtime';
import tables from './messages.gen';

/**
 * Messages of the preset catalogue (namespace 'preset-catalogue', contract i18n 1.0.0 r3; the tables sit
 * inline in magic-card-preset-catalogue.js, which no dashboard loads). Preset names are m() marks in the
 * entry files and read with t() where the entry is built. Write t('British text').
 */
export const { t, tc, tx, m, locale } = i18nFor('preset-catalogue', tables);
