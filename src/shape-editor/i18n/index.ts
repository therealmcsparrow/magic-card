import type { MessageIndex, RichArgs } from '../../contracts/i18n';
import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/** A message key as m() returns it; the build has already turned it into its table index. */
export type NameKey = (keyof Keys & string) | MessageIndex;

type Bound = KeyedNamespace<Keys>;
type ShapeEditorMessages = Omit<Bound, 't'> & { t: Bound['t'] & ((id: NameKey, args?: RichArgs) => string) };

/**
 * Messages of the shape editor (namespace 'shape-editor', tables in magic-card-shape-editor.js). Write
 * t('shape-editor.<file>.<text>'); the build replaces each key with its table index, which the second signature accepts.
 */
export const { t, tc, tx, m, locale } = i18nFor('shape-editor', tables) as unknown as ShapeEditorMessages;
