import type { LabelMark } from '../../contracts/i18n';

/**
 * lm('Background colour'): marks editor-only label data in a file magic-card.js carries (CSS properties,
 * animation presets, module names, ...). Identity at run time; tools/i18n-loader.cjs rewrites the call to
 * the message's number in the 'labels' tables, so magic-card.js ships numbers and no text. Imports nothing
 * and never touches the tables (contract i18n 1.0.0). Render with t() from './index'.
 */
export const lm: LabelMark = (id) => id;
