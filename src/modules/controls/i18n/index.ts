import type { KeyedI18n } from '../../../contracts/i18n-keys';
import type { MessageIndex, RichArgs } from '../../../contracts/i18n';
import { i18nFor } from '../../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

type Typed = Pick<KeyedI18n<Keys>, 'm'> & {
  t: KeyedI18n<Keys>['t'] & ((id: MessageIndex, args?: RichArgs) => string);
  tx: KeyedI18n<Keys>['tx'] & ((id: MessageIndex, args: RichArgs) => unknown[]);
  tc: (context: string, id: MessageIndex, args?: RichArgs) => string;
};

/**
 * Messages of the controls chunk views (namespace 'controls', tables in magic-card-controls.js). Write
 * t('controls.<file>.<text>'); the build replaces each key with its table index, which the second signature accepts.
 */
export const { t, tc, tx, m } = i18nFor('controls', tables) as unknown as Typed;
