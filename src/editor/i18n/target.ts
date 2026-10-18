import { t } from './index';

/** "this card", "this row", "this column" or "this module" for a design target, so a sentence can name what it is about and each language agrees the words around it. */
export const thisTarget = (target: string): string =>
  target === 'card' ? t('this card') : target === 'row' ? t('this row') : target === 'column' ? t('this column') : t('this module');
