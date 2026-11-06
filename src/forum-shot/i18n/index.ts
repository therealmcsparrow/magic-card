import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/** Messages of the forum shot (namespace 'forum-shot', tables in magic-card-forum-shot.js). Write t('forum-shot.<file>.<text>'); the build replaces each key with its table index. */
export const { t } = i18nFor('forum-shot', tables) as unknown as KeyedNamespace<Keys>;
