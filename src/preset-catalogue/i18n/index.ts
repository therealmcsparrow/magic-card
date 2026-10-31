import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/**
 * Messages of the preset catalogue (namespace 'preset-catalogue', tables inline in magic-card-preset-catalogue.js).
 * Preset names are m() marks in the entry files, read with t() where the entry is built.
 */
export const { t, tx, m, locale } = i18nFor('preset-catalogue', tables) as unknown as KeyedNamespace<Keys>;
