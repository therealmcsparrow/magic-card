/**
 * CSS tokenizer for sanitizeStyle (imported only by sanitize-html.ts). Mirrors the CSS Syntax Level 3
 * tokenizer (section 4.3: strings, bad strings, escapes, comments, numbers, function tokens, bracket
 * stack), because a style value must be split the way the browser splits it. Threats it closes:
 * an escape that hides a function name (`\75 rl(`), a comment that splits one (`ur/**\/l(`), a quote or `;`
 * that ends a declaration early in one parser and not in the other, an unclosed string or block that
 * swallows the next declaration. Escapes, comments, bad strings and strings cut off by the end of the
 * input are flagged `x` (unsafe to re-emit). One linear pass, hand-written, no backtracking regex.
 * Differences from the spec, both safe: `url(` is a plain function token, and a top-level at-rule runs
 * to the next `;`. Our declaration then ends at or after the browser's, so we merge more, never less.
 */
export type TokType =
  | 'ws' | 'str' | 'num' | 'pct' | 'dim' | 'id' | 'fn' | 'sym' | 'cmt'
  | 'open' | 'close' | 'comma' | 'colon' | 'semi' | 'delim';
export interface Tok {
  t: TokType;
  /** Source slice. */
  s: string;
  /** Lower-case function name or dimension unit. */
  v?: string;
  /** Unsafe to re-emit: escape, comment, bad string, or string cut off by the end of the input. */
  x?: 1;
}
export interface Decl {
  toks: Tok[];
  bad: boolean;
}

export const MAX_NEST = 16;
const SINGLE: Record<string, TokType> = { ',': 'comma', ':': 'colon', ';': 'semi', '(': 'open', '[': 'open', '{': 'open' };
/**
 * One escape: a backslash and 1-6 hex digits plus one optional space, or one character that is no newline or hex digit.
 * The branches are disjoint (six hex digits, or one to five not followed by a hex digit, or a non-hex character),
 * so a repeated group of them has one way to match and cannot backtrack (websec.M-SEC6).
 */
const ESC = String.raw`\\(?:(?:[\da-f]{6}|[\da-f]{1,5}(?![\da-f]))[ \t\n]?|[^\n\da-f])`;
const NAME = String.raw`(?:[\w\u0080-\uffff-]|${ESC})`;
const IDENT = new RegExp(String.raw`(?:--|-?(?:[a-z_\u0080-\uffff]|${ESC}))${NAME}*`, 'iy');
/**
 * Sticky regexes, tried in order at each position. Each has one way to match at a given character
 * (no overlapping alternatives), so a run is linear. A string takes its escapes and a continuation
 * (backslash + newline) whole; it ends before a bare newline or at the end of the input.
 * `sym` holds hash, at-keyword, CDO and CDC: none of them is ever kept but a `#hex` colour.
 */
const RULES: [TokType, RegExp][] = [
  ['ws', /[ \t\n]+/y],
  ['str', /(["'])(?:(?!\1)[^\\\n]|\\[\s\S]?)*\1?/y],
  ['cmt', /\/\*[\s\S]*?(?:\*\/|$)/y],
  ['num', /[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?/iy],
  ['sym', new RegExp(String.raw`-->|<!--|[#@]${NAME}+`, 'iy')],
  ['id', IDENT],
];

export function tokenize(css: string): Tok[] {
  const c = css.replace(/\r\n?|\f/g, '\n').replace(/\0/g, '\ufffd');
  const out: Tok[] = [];
  const stack: string[] = [];
  const scan = (re: RegExp, i: number) => {
    re.lastIndex = i;
    const m = re.exec(c);
    return m ? m[0] : '';
  };
  for (let i = 0; i < c.length; ) {
    let t: TokType = 'delim';
    let s = '';
    for (const [type, re] of RULES) {
      if ((s = scan(re, i))) {
        t = type;
        break;
      }
    }
    let v: string | undefined;
    let x: 1 | undefined;
    if (t === 'num') {
      // A number glued to a name is a dimension, glued to % a percentage.
      const unit = scan(IDENT, i + s.length);
      if (unit) {
        t = 'dim';
        v = unit.toLowerCase();
        s += unit;
      } else if (c[i + s.length] === '%') {
        t = 'pct';
        s += '%';
      }
    } else if (t === 'id' && c[i + s.length] === '(') {
      t = 'fn';
      v = s.toLowerCase();
      s += '(';
      stack.push(')');
    } else if (t === 'str') {
      if (s.length < 2 || s[s.length - 1] !== s[0]) x = 1;
    } else if (!s) {
      s = c[i];
      if (SINGLE[s] === 'open') stack.push(')]}'['([{'.indexOf(s)]);
      if (SINGLE[s]) t = SINGLE[s];
      else if (s === ')' || s === ']' || s === '}') {
        if (stack[stack.length - 1] === s) {
          stack.pop();
          t = 'close';
        }
      } else if (s === '\\') x = 1; // a backslash that starts no escape
    }
    if (t === 'cmt' || s.indexOf('\\') >= 0) x = 1;
    out.push({ t, s, v, x });
    i += s.length;
  }
  return out;
}

/** Splits on `;` at block depth 0. A declaration is `bad` with an unsafe token, an open block at the end, or nesting over MAX_NEST. */
export function declarations(toks: Tok[]): Decl[] {
  const list: Decl[] = [];
  let cur: Tok[] = [];
  let depth = 0;
  let bad = false;
  for (const tok of toks) {
    if (tok.t === 'semi' && !depth) {
      list.push({ toks: cur, bad });
      cur = [];
      bad = false;
      continue;
    }
    if (tok.t === 'fn' || tok.t === 'open') {
      if (++depth > MAX_NEST) bad = true;
    } else if (tok.t === 'close') depth--;
    if (tok.x) bad = true;
    cur.push(tok);
  }
  if (cur.length) list.push({ toks: cur, bad: bad || depth > 0 });
  return list;
}
