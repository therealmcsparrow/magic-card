import { i18nForLazy } from '../runtime';

/**
 * Namespace 'labels' (contract i18n 1.0.0 r3): editor-only labels of files magic-card.js carries (their
 * lm() calls ship as numbers) and the few files the card-editor chunk and the studio entry both compile.
 * The tables are the lazy chunk magic-card-i18n-labels.js. Never import this file from a file magic-card.js
 * carries (check D7): the editor chunk and the studio entry import it and await ready() before they render.
 */
export const { t, tc, tx, m, locale, ready } = i18nForLazy('labels', () => import(/* webpackChunkName: "i18n-labels" */ './messages.gen'));
