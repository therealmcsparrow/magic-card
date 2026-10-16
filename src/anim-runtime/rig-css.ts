import type { CompiledTrack } from '../anim-studio/compile-v2';
import type { Rig, TargetRef } from '../anim-studio/model';

/*
 * The stylesheet of an icon rig: the rig's track keyframes and their animations on the parts,
 * groups and shapes of the rigged <mc-svg-icon>. It is adopted inside the icon's own shadow root
 * (rig.ts), where the parts live, so the selectors need no further scoping and the keyframe names
 * (the document's hashed name) resolve there.
 *
 * Parts carry `data-p="<id>"`, groups `data-g`, shapes `data-s` (ids match PART_ID_RE, safe in a
 * selector). Pivots are inline (`transform-origin` in viewBox px, transform-box view-box), so the
 * sheet does not depend on the resolved geometry.
 *
 * Draw-on: the compiler writes `stroke-dashoffset: 1 - draw` (inherited by the part's paths). A
 * drawn filled part gets an outline group (`.outlines`, one path per subpath, each pathLength=1 and
 * `stroke-dasharray: 1`, so every subpath draws evenly); it fills as the outline completes (an
 * extra `<name>-fill` animation, fill-opacity fading in over the last quarter of a draw-on segment)
 * and the outline then fades out (`<name>-outline` on `.outlines`), so no stroke is left over.
 */

/** The selector of a rig target; undefined for card targets. */
export function rigSelector(target: TargetRef | string): string | undefined {
  const m = /^(part|group|shape):([a-z0-9][a-z0-9_-]{0,31})$/.exec(target);
  if (!m) return undefined;
  return `[data-${m[1] === 'part' ? 'p' : m[1] === 'group' ? 'g' : 's'}="${m[2]}"]`;
}

/** The track draws its target on (it animates stroke-dashoffset). */
export const tracksDraw = (t: CompiledTrack): boolean => t.css.includes('stroke-dashoffset');

/** The draw's fill steps: [at, fill 0..1], the fill fading in over the last quarter of a draw-on segment. */
function fillSteps(t: CompiledTrack): Array<[number, number]> {
  const keys = new Map<number, number>();
  for (const m of t.css.matchAll(/(-?[\d.]+)% \{([^}]*)\}/g)) {
    const off = /stroke-dashoffset: (-?[\d.]+)/.exec(m[2]);
    if (off) keys.set(Number(m[1]), Number(off[1]) <= 0.001 ? 1 : 0);
  }
  const sorted = [...keys].sort((a, b) => a[0] - b[0]);
  // the fill waits for the outline: it fades in over the last quarter of a draw-on segment (and
  // out over the first quarter of a draw-off one), so the line is seen being drawn first
  const out: Array<[number, number]> = [];
  sorted.forEach(([at, v], i) => {
    const prev = sorted[i - 1];
    if (prev && prev[1] !== v) out.push([+(prev[0] + (at - prev[0]) * (v ? 0.75 : 0.25)).toFixed(2), 0]);
    out.push([at, v]);
  });
  return out;
}

/** fill-opacity keyframes following a draw track: 1 where draw is complete, 0 before. */
export function fillKeyframes(t: CompiledTrack): string {
  const steps = fillSteps(t);
  if (!steps.length) return '';
  const blocks = steps.map(([at, v]) => `  ${at}% { fill-opacity: ${v}; }`);
  return `@keyframes ${t.name}-fill {\n${blocks.join('\n')}\n}`;
}

/** The outline's stroke-opacity: shown while the part is drawn, gone once it has filled. */
export function outlineKeyframes(t: CompiledTrack): string {
  const steps = fillSteps(t);
  if (!steps.length) return '';
  const blocks = steps.map(([at, v]) => `  ${at}% { stroke-opacity: ${1 - v}; }`);
  return `@keyframes ${t.name}-outline {\n${blocks.join('\n')}\n}`;
}

/** Fallback timing when the card passes none (`<duration> <easing> <delay> <iterations> <direction>`). */
export const DEFAULT_TIMING = '1s ease 0s infinite normal';

/** Base rules of every rig (colour, pivots' reference box, draw-on dashes). */
export const RIG_BASE_CSS = [
  // the parts inherit the icon colour; a part's colour animation recolours it (fill: currentColor)
  // icon_fx paint reaches the parts: a solid colour (--mc-rig-paint) or a gradient fill (--mc-rig-fill)
  '.rig { color: var(--mc-rig-paint, var(--icon-primary-color, currentColor)); }',
  '.rig .primary { fill: var(--mc-rig-fill, currentColor); }',
  // a drawn part's outline (per subpath, see rig.ts): hidden at rest, shown by its draw animation
  '.rig .outlines { stroke-opacity: 0; }',
  '.rig [data-p], .rig [data-g], .rig [data-s] { transform-box: view-box; }',
  '.rig .drawn { stroke-dasharray: 1; stroke-linecap: round; stroke-linejoin: round; }',
  // outlines of filled parts are closed paths: flat ends, a dash a hair short of the length and a
  // gap longer than it, so no dash starts at the closing point (an outline not drawn yet, offset 1,
  // would otherwise show a dot there)
  '.rig .outlines .drawn { stroke-linecap: butt; stroke-dasharray: 0.999 2; }',
  // reduced motion: the rig stands at rest (drawn parts fully drawn)
  '@media (prefers-reduced-motion: reduce) { .rig, .rig * { animation: none !important; } }',
].join('\n');

/**
 * The rig's stylesheet: base rules, then per rig track its keyframes and `animation` on its target
 * (main name, split-off lanes, the draw fill), all with the entry's timing. `still` (reduced motion):
 * base rules only, the rig stands at rest.
 */
export function rigCss(tracks: CompiledTrack[], rig: Rig, opts: { timing?: string; still?: boolean } = {}): string {
  const out = [RIG_BASE_CSS];
  if (opts.still) return out.join('\n');
  const timing = opts.timing || DEFAULT_TIMING;
  const known = new Set<string>([
    ...rig.parts.map((p) => `part:${p.id}`),
    ...(rig.groups ?? []).map((g) => `group:${g.id}`),
    ...(rig.shapes ?? []).map((s) => `shape:${s.id}`),
  ]);
  for (const t of tracks) {
    const sel = rigSelector(t.target);
    if (!sel || !known.has(t.target) || !t.css) continue;
    const names = [t.name, ...(t.lanes ?? [])];
    out.push(t.css);
    const play = (n: string) => `${n} ${timing}`;
    if (tracksDraw(t)) {
      const fill = fillKeyframes(t);
      if (fill) {
        out.push(fill, outlineKeyframes(t));
        names.push(`${t.name}-fill`);
        out.push(`.rig ${sel} .outlines { animation: ${play(`${t.name}-outline`)}; }`);
      }
      // the outline's colour (a stroke track animates it on the same element); the filled pieces
      // never take it (they would show a full 1-unit outline over the draw-on)
      out.push(`.rig ${sel} { stroke: currentColor; }`, `.rig ${sel} .primary, .rig ${sel} .secondary { stroke: none; }`);
    }
    // a track's own origin wins over the part's pivot (inline on the element)
    if (t.origin) out.push(`.rig ${sel} { transform-origin: ${t.origin} !important; }`);
    out.push(`.rig ${sel} { animation: ${names.map(play).join(', ')}; }`);
  }
  return out.join('\n');
}
