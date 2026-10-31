import type { KeyedNamespace } from '../../../contracts/i18n-keys';
import { i18nFor } from '../../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/**
 * Messages of the layer editor panels (namespace 'layer-editor', contract i18n 1.0.0). Write t('layer-editor.<file>.<text>').
 * Text the light host parts show (tree chips, float bar, canvas announcements) stays in 'card-editor'.
 */
export const { t, tx, m, locale } = i18nFor(
  'layer-editor',
  tables,
) as unknown as KeyedNamespace<Keys>;
