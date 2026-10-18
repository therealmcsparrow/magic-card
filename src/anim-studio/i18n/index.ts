import type { MessageId } from '../../contracts/i18n';
import { i18nFor } from '../../i18n/runtime';
import tables from './messages.gen';

export type { MessageId };

/**
 * Messages of the animation studio (namespace 'anim-studio', contract i18n 1.0.0 r3; the tables sit inline in
 * magic-card-animation-studio.js). Write t('British text'); a module-level table of labels holds m('British text')
 * and is read through t(item.label) or tr() where it is rendered. Files the card editor or the card also compile use
 * the 'labels' namespace (src/i18n/labels) instead.
 */
export const { t, tc, tx, m, locale } = i18nFor('anim-studio', tables);

/** Option rows (`{ label, value, ... }`) of a module-level table, with each m() label resolved for the current language. */
export const tr = <R extends { label: MessageId }>(rows: readonly R[]): Array<Omit<R, 'label'> & { label: string }> =>
  rows.map((r) => ({ ...r, label: t(r.label) }));

/** "Name, State and Background": a list of names in the current language. */
export const list = (items: readonly string[]): string =>
  items.length < 2 ? (items[0] ?? '') : new Intl.ListFormat(locale(), { style: 'long', type: 'conjunction' }).format(items);
