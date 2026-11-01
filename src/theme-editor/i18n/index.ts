import type { KeyedNamespace } from '../../contracts/i18n-keys';
import type { ModuleI18n } from '../../contracts/i18n';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/** Messages of the theme editor (namespace 'theme-editor', tables in magic-card-theme-editor.js). Write t('theme-editor.<file>.<text>'); the build replaces each key with its table index. Mark catalogue data with m(). */
const bundle = i18nFor('theme-editor', tables);
export const { t, tx, m, locale } = bundle as unknown as KeyedNamespace<Keys>;
/** The en-GB text of message `m('<key>')`, unformatted and never through a pseudo wrap. */
export const en: ModuleI18n['en'] = (id) => bundle.en(id);
