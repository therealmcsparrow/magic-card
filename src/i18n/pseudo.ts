// Pseudo right-to-left transform: marks each message and shows digits and separators the Arabic way.
import type { PseudoWrap } from '../contracts/i18n';

const RLM = '\u200f';
const DIGITS = /\d/g;
const SEPARATORS = /[.,]/g;
const toArabicIndic = (s: string) => s.replace(DIGITS, (d) => String.fromCharCode(0x660 + +d));

/** A message sits between two U+200F marks; a number gets Arabic-Indic digits and swapped '.' and ','. */
export const pseudoWrap: PseudoWrap = (s, kind) =>
  kind == 'num' ? toArabicIndic(s).replace(SEPARATORS, (c) => (c == '.' ? ',' : '.')) : RLM + toArabicIndic(s) + RLM;
