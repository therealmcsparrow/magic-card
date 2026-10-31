import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

// Messages of the library image field (namespace "image-tools"); write t("image-tools.<file>.<text>").
export const { t, tx, m, locale } = i18nFor('image-tools', tables) as unknown as KeyedNamespace<Keys>;
