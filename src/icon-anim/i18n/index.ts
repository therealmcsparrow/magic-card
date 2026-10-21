import { i18nFor } from '../../i18n/runtime';
import tables from './messages.gen';

/**
 * Messages of the icon animator (namespace 'icon-animator', contract i18n 1.0.0; the tables sit inline in
 * magic-card-icon-animator.js). Write t('British text').
 */
export const { t, tc, tx, m, locale } = i18nFor('icon-animator', tables);
