// lookTraits: the facts a tile carries, `animated` and `fonts`, computed from a parsed look (contract look-grammar 2.1.0).
// Both rules are fixed for grammar 1. Pure TS, no DOM.

import { LOOK_FONT_KEYS, type LookDoc, type LookTraits } from '../contracts/look-grammar';
import { isGenericFont, readCssDeclarations, readFontFamily } from './grammar';

type Plain = Record<string, unknown>;

const isPlain = (v: unknown): v is Plain => typeof v === 'object' && v !== null && !Array.isArray(v);
const MAX_DEPTH = 16;

/** `seasonal` moves unless it is `false`, `'none'` or an object whose scene is `'none'`. */
const seasonalMoves = (v: unknown): boolean => {
  if (v === false || v === 'none' || v === undefined || v === null) return false;
  return !(isPlain(v) && v.scene === 'none');
};

/** True when an icon_fx or tab_icon_fx object animates. */
const iconFxMoves = (fx: Plain, tab: boolean): boolean => {
  if ((fx.device !== undefined && fx.device !== 'off') || (fx.draw !== undefined && fx.draw !== 'off')) return true;
  if (tab) return false;
  if (fx.morph === true) return true;
  return isPlain(fx.fill) && fx.fill.wave === true;
};

/** True when one key and value of the look make something move. */
const entryMoves = (key: string, v: unknown): boolean => {
  switch (key) {
    case 'animations':
    case 'tab_animations':
      return Array.isArray(v) && v.length > 0;
    case 'seasonal':
      return seasonalMoves(v);
    case 'shape_options':
    case 'track_shape_options':
      return isPlain(v) && v.animate === true;
    case 'icon_fx':
    case 'tab_icon_fx':
      return isPlain(v) && iconFxMoves(v, key === 'tab_icon_fx');
    case 'ring':
      return isPlain(v) && v.mode === 'animated';
    case 'value_background':
      return isPlain(v) && v.wave === true && (v.type === undefined || v.type === 'fill');
    case 'css': {
      const list = typeof v === 'string' ? readCssDeclarations(v) : null;
      return list !== null && list.some((d) => d.property.replace(/^-[a-z]+-/, '').indexOf('animation') === 0);
    }
    default:
      return false;
  }
};

const anyMoves = (v: unknown, depth: number): boolean => {
  if (depth > MAX_DEPTH) return false;
  if (Array.isArray(v)) return v.some((x) => anyMoves(x, depth + 1));
  if (!isPlain(v)) return false;
  return Object.keys(v).some((k) => entryMoves(k, v[k]) || anyMoves(v[k], depth + 1));
};

const addFamily = (found: Set<string>, value: string): void => {
  const names = readFontFamily(value);
  if (names) for (const n of names) if (!isGenericFont(n)) found.add(n);
};

const collectFonts = (v: unknown, found: Set<string>, depth: number): void => {
  if (depth > MAX_DEPTH) return;
  if (Array.isArray(v)) {
    for (const x of v) collectFonts(x, found, depth + 1);
    return;
  }
  if (!isPlain(v)) return;
  for (const k of Object.keys(v)) {
    const x = v[k];
    if ((LOOK_FONT_KEYS as readonly string[]).indexOf(k) >= 0 && typeof x === 'string') addFamily(found, x);
    else if (k === 'css' && typeof x === 'string') {
      for (const d of readCssDeclarations(x) ?? []) if (d.property === 'font-family') addFamily(found, d.value);
    } else collectFonts(x, found, depth + 1);
  }
};

export const lookTraits: LookTraits = (look: LookDoc) => {
  const found = new Set<string>();
  collectFonts(look.card, found, 0);
  collectFonts(look.modules, found, 0);
  return { animated: anyMoves(look.card, 0) || anyMoves(look.modules, 0), fonts: Array.from(found).sort() };
};
