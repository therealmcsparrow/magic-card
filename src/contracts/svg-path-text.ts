/* Path-data and whitespace text helpers shared by the image sanitiser (through src/svg-safety) and the image animator.
 * Version 1.0.0. Plain string functions only: no DOM, no markup, no sanitising. */

/**
 * The command structure of one path-data text, which every frame of a morph shares: its command letters in order, each
 * with the count of numbers after it ("M 2 L 4"). Undefined when some text is no token, a number comes before the first
 * letter, or there is no letter.
 */
export function pathStructure(d: string): string | undefined {
  const text = d.replace(/[\t\n\r\f]/g, ' ');
  const parts: string[] = [];
  const token = /([MmLlHhVvCcSsQqTtAaZz])|[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[ ,]+/y;
  while (token.lastIndex < text.length) {
    const m = token.exec(text);
    if (!m) return undefined;
    if (m[1]) parts.push(m[1], '0');
    else if (/^[ ,]/.test(m[0])) continue;
    else if (parts.length) parts[parts.length - 1] = String(Number(parts[parts.length - 1]) + 1);
    else return undefined;
  }
  return parts.length ? parts.join(' ') : undefined;
}

/** True for the code of an IMAGE_ANIM_WS character. */
const isAnimWs = (c: number): boolean => c === 32 || c === 9 || c === 10 || c === 13 || c === 12;

/** `s` without IMAGE_ANIM_WS at either end, in one pass; other spaces stay. */
export function trimAnimWs(s: string): string {
  let i = 0;
  let j = s.length;
  while (i < j && isAnimWs(s.charCodeAt(i))) i++;
  while (j > i && isAnimWs(s.charCodeAt(j - 1))) j--;
  return s.slice(i, j);
}
