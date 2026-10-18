import { i18nFor } from '../../i18n/runtime';
import tables from './messages.gen';

/** Messages of the card (namespace 'card', tables in magic-card.js). Write t('British text'). */
export const { t, tc, tx, m } = i18nFor('card', tables);
