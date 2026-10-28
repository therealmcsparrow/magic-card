import type { MessageIndex } from '../../contracts/i18n';
import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nFor } from '../../i18n/runtime';
import type { Keys } from './keys.gen';
import tables from './messages.gen';

/** What m('anim-studio.<file>.<text>') returns: the table index the build turns the key into; read it through t() or tr(). */
export type MessageId = MessageIndex;

/**
 * Messages of the animation studio (namespace 'anim-studio', tables inline in magic-card-animation-studio.js). Write
 * t('anim-studio.<file>.<text>'); the build replaces each key with its table index, which the second signature
 * accepts. A module-level table of labels holds m('anim-studio.<file>.<text>') and is read through t(item.label) or
 * tr() where it is rendered. Files the card editor or the card also compile use the 'labels' namespace
 * (src/i18n/labels) instead.
 */
export const { t, tx, m, locale } = i18nFor('anim-studio', tables) as unknown as KeyedNamespace<Keys>;

/** Option rows (`{ label, value, ... }`) of a module-level table, with each m() label resolved for the current language. */
export const tr = <R extends { label: MessageId }>(rows: readonly R[]): Array<Omit<R, 'label'> & { label: string }> =>
  rows.map((r) => ({ ...r, label: t(r.label) }));

/** "Name, State and Background": a list of names in the current language. */
export const list = (items: readonly string[]): string =>
  items.length < 2 ? (items[0] ?? '') : new Intl.ListFormat(locale(), { style: 'long', type: 'conjunction' }).format(items);
