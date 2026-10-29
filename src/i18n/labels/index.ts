import type { KeyedNamespace } from '../../contracts/i18n-keys';
import { i18nForLazy } from '../runtime';
import type { Keys } from './keys.gen';

/**
 * Namespace 'labels' (contract i18n 1.0.0): editor-only labels of files magic-card.js carries (their
 * lm() calls ship as numbers) and the few files the card-editor chunk and the studio entry both compile.
 * The tables are the lazy chunk magic-card-i18n-labels.js. Never import this file from a file magic-card.js
 * carries: the editor chunk and the studio entry import it and await ready() before they render.
 * Write t('labels.<file>.<text>'); the build replaces each key with its table index.
 */
export const { t, tx, m, locale, ready } = i18nForLazy('labels', () => import(/* webpackChunkName: "i18n-labels" */ './messages.gen')) as unknown as KeyedNamespace<Keys> &
  Pick<ReturnType<typeof i18nForLazy>, 'ready'>;
