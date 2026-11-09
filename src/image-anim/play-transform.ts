// Rewrites the translate, rotate and scale declarations of one compiled `@keyframes` rule as a single `transform`, which
// Chromium can run on the compositor for an SVG part; a rule it cannot rewrite exactly comes back unchanged.

const PROPS = ['translate', 'rotate', 'scale'];
/** Most values each property may have in 2D, by PROPS index. */
const MAX = [2, 1, 2];

/** The value split on whitespace outside parentheses; undefined when the parentheses do not balance. */
function tokens(value: string): string[] | undefined {
  const out = [''];
  let depth = 0;
  for (const ch of value) {
    depth += ch === '(' ? 1 : ch === ')' ? -1 : 0;
    if (depth < 0) return undefined;
    if (!depth && /\s/.test(ch)) {
      if (out[out.length - 1]) out.push('');
    } else out[out.length - 1] += ch;
  }
  return depth || !out[0] ? undefined : out;
}

/** `css` with every keyframe's translate, rotate and scale as one `transform`; unchanged unless each keyframe has the same 2D set. */
export function asTransform(css: string): string {
  let exact = css.split('@keyframes').length === 2;
  let want: string | undefined;
  const out = css.replace(/\{([^{}]*)\}/g, (_, body: string) => {
    const kept: string[] = [];
    const found: string[] = [];
    let at = -1;
    for (const decl of body.split(';')) {
      const [name, ...rest] = decl.split(':');
      const prop = name.trim();
      if (!prop) continue;
      const i = PROPS.indexOf(prop);
      if (prop === 'transform' || !rest.length) exact = false;
      if (i < 0) {
        kept.push(decl.trim());
        continue;
      }
      const t = tokens(rest.join(':').trim());
      if (!t || t.length > MAX[i] || t.includes('none')) exact = false;
      found[i] = `${prop}(${t?.join(', ')})`;
      if (at < 0) at = kept.length;
    }
    const set = PROPS.filter((_p, i) => found[i]).join();
    if (!set || (want ?? set) !== set) exact = false;
    want = set;
    kept.splice(at, 0, `transform: ${found.filter(Boolean).join(' ')}`);
    return `{ ${kept.join('; ')}; }`;
  });
  return exact ? out : css;
}
