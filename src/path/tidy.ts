// Path model, editor-only: export tidy-up. Rounds to a number of decimals, drops empty pieces and
// writes each command in the shorter of its absolute and relative forms. Pure.
import type { PathData, Pt, Seg, TidyOptions } from '../contracts/path-model';

/** Numbers glued together: a space only where the next one does not start with a minus. */
const glue = (nums: string[]): string => nums.reduce((s, n, i) => s + (i && !n.startsWith('-') ? ' ' : '') + n, '');

export function tidyPath(p: PathData, o: TidyOptions = {}): string {
  const k = 10 ** (o.decimals ?? 2);
  const rel = o.relative ?? true;
  const r = (v: number): number => Math.round(v * k) / k || 0;
  const str = (v: number): string => String(r(v));
  const rp = (q: Pt): Pt => [r(q[0]), r(q[1])];
  let cur: Pt = [0, 0];
  let out = '';
  /** The shorter of the absolute and relative spelling of one command. */
  const cmd = (letter: string, abs: number[], delta: (c: Pt) => number[]): string => {
    const a = letter + glue(abs.map(str));
    if (!rel) return a;
    const b = letter.toLowerCase() + glue(delta(cur).map(str));
    return b.length < a.length ? b : a;
  };
  const dxy = (q: Pt) => (c: Pt): number[] => [q[0] - c[0], q[1] - c[1]];
  for (const s of p) {
    const start = rp(s.start);
    const mark = out.length;
    out += cmd('M', start, dxy(start));
    cur = start;
    const segs: Seg[] = s.segs.map((g) => ({ ...g }));
    const last = segs[segs.length - 1];
    // a closing line is Z's job
    if (s.closed && last && !last.c1 && segs.length > 1 && rp(last.to)[0] === start[0] && rp(last.to)[1] === start[1]) segs.pop();
    let drawn = 0;
    for (const g of segs) {
      const to = rp(g.to);
      if (g.c1 && g.c2) {
        const c1 = rp(g.c1);
        const c2 = rp(g.c2);
        if (o.dropEmpty !== false && [c1, c2, to].every((q) => q[0] === cur[0] && q[1] === cur[1])) continue;
        out += cmd('C', [...c1, ...c2, ...to], (c) => [c1[0] - c[0], c1[1] - c[1], c2[0] - c[0], c2[1] - c[1], to[0] - c[0], to[1] - c[1]]);
      } else {
        if (to[0] === cur[0] && to[1] === cur[1]) {
          if (o.dropEmpty !== false) continue;
        }
        if (to[1] === cur[1] && to[0] !== cur[0]) out += cmd('H', [to[0]], (c) => [to[0] - c[0]]);
        else if (to[0] === cur[0] && to[1] !== cur[1]) out += cmd('V', [to[1]], (c) => [to[1] - c[1]]);
        else out += cmd('L', to, dxy(to));
      }
      cur = to;
      drawn++;
    }
    if (!drawn && o.dropEmpty !== false) {
      out = out.slice(0, mark);
      cur = start;
    } else if (s.closed) {
      out += 'Z';
      cur = start;
    }
  }
  return out;
}
