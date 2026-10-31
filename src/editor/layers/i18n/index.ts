import type { KeyedNamespace } from '../../../contracts/i18n-keys';
import { i18nFor } from '../../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

// Messages of the layer editor panels (namespace 'layer-editor', i18n 1.0.0).
// Write t('layer-editor.<file>.<text>'); the build replaces each key with its table index.
export const { t, tx, m, locale } = i18nFor(
  'layer-editor',
  tables,
) as unknown as KeyedNamespace<Keys>;
