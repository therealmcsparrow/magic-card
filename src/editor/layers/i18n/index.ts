import type { KeyedNamespace } from '../../../contracts/i18n-keys';
import { i18nFor } from '../../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/**
 * Messages of the layer editor panels (namespace 'layer-editor', contract i18n 1.0.0 and layer-editor
 * 1.0.0; the tables sit inline in magic-card-layer-editor.js). Write t('layer-editor.<file>.<text>'); the build replaces each key with its table index. Text the light host
 * parts show (tree chips, float bar, canvas announcements, status sentences) stays in 'card-editor'; an m()
 * label made in a card-editor file is rendered with the card-editor t(), never with this one.
 */
export const { t, tc, tx, m, locale } = i18nFor(
  'layer-editor',
  tables,
) as unknown as KeyedNamespace<Keys>;
