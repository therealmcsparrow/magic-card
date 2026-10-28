import type { MessageIndex } from '../../contracts/i18n';
import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

export type { MessageIndex };

/**
 * Messages of the card editor (namespace 'card-editor', contract i18n 1.0.0; the tables sit inline in
 * magic-card-editor.js). Write t('card-editor.<file>.<text>'); the build replaces each key with its table index. A module-level table of labels holds m('card-editor.<file>.<text>')
 * and is read through tl() / t(item.label) where it is rendered.
 */
export const { t, tc, tx, m, locale } = i18nFor(
  'card-editor',
  tables,
) as unknown as KeyedNamespace<Keys>;

/** Option rows (`{ label, value, ... }`) of a module-level table, with each m() label resolved for the current language. */
export const tl = <R extends { label: MessageIndex }>(rows: readonly R[]): Array<Omit<R, 'label'> & { label: string }> =>
  rows.map((r) => ({ ...r, label: t(r.label) }));

const AMERICAN: Record<string, string> = { colour: 'color', centre: 'center', grey: 'gray', customis: 'customiz', behaviour: 'behavior', favourite: 'favorite', maximis: 'maximiz', minimis: 'minimiz', organis: 'organiz' };

/** Search folding: lower case, and the British spellings read as American, so a search for "color" finds "Colour" (and the reverse). */
export const fold = (s: string): string => s.toLowerCase().replace(/colour|centre|grey|customis|behaviour|favourite|maximis|minimis|organis/g, (w) => AMERICAN[w]);
