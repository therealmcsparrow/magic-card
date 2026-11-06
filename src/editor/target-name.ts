import { t } from './i18n';

/** "this card", "this row", "this column" or "this module" for a design target, so a sentence can name what it is about and each language agrees the words around it. */
export const thisTarget = (target: string): string =>
  target === 'card' ? t('card-editor.target-name.this-card') : target === 'row' ? t('card-editor.target-name.this-row') : target === 'column' ? t('card-editor.target-name.this-column') : t('card-editor.target-name.this-module');
