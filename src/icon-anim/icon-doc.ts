import type { AnimationDoc, Rig, RigPart } from '../anim-studio/model';
import type { IconGeometry } from '../icons/icon-source';
import { splitIcon, unionBox, type SplitPiece } from '../icons/icon-split';

/*
 * Icon animation documents (icon animator core, shared by the studio's icon mode and the Design
 * tab's quick animator): an icon split into parts, ready for part presets. Pure, no DOM.
 */

/** Most parts a rig holds (model-v2 V2_CAPS.parts; repeated so this file needs no validator). */
export const RIG_PART_CAP = 64;

export type Box = [number, number, number, number];

/**
 * A keyframes document for `icon`: the icon split into its pieces (holes stay with their shape),
 * one part per piece ("Part 1…n", ids part-1…), no tracks yet. It plays on the module's icon and
 * loops; its element keyframes are one still key (the parts' tracks carry the motion).
 * `embed`: the geometry goes into the document as its own SVG (`rig.svg`, see svgFromGeometry)
 * instead of the icon id, so the parts never depend on the icon version a dashboard resolves (an
 * SVG over the 32 KB own-icon cap keeps the icon id).
 */
export function iconAnimationDoc(icon: string, geometry: IconGeometry, id: string, name: string, opts: { embed?: boolean } = {}): AnimationDoc {
  const pieces = splitIcon(geometry);
  const parts: RigPart[] = pieces.slice(0, RIG_PART_CAP).map((p, i) => ({ id: `part-${i + 1}`, name: `Part ${i + 1}`, from: [p.index] }));
  const svg = opts.embed ? svgFromGeometry(geometry) : undefined;
  const rig: Rig = svg ? { svg, parts } : { icon, parts };
  return {
    id,
    name,
    kind: 'keyframes',
    duration: 2,
    easing: 'ease-in-out',
    iterations: 'infinite',
    target: 'icon',
    origin: 'center',
    version: 1,
    // one still key (a document without tracks needs element keyframes); the parts' tracks move
    keyframes: [{ at: 0, opacity: 1 }],
    rig,
  };
}

const escAttr = (s: string): string => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * Icon geometry as a standalone SVG whose split gives the same pieces in the same order: accent
 * paths (class mc-accent) first, then the filled paths, then the stroked ones. undefined when over
 * the 32 KB own-icon cap.
 */
export function svgFromGeometry(g: IconGeometry): string | undefined {
  const eo = (list: 'paths' | 'accent', i: number) => (g.evenodd?.[list]?.includes(i) ? ' fill-rule="evenodd"' : '');
  const els = [
    ...(g.secondary ?? []).map((d, i) => `<path class="mc-accent" d="${escAttr(d)}"${eo('accent', i)}/>`),
    ...g.paths.map((d, i) => `<path d="${escAttr(d)}"${eo('paths', i)}/>`),
    ...(g.strokes ?? []).map(
      (s) =>
        `<path${s.accent ? ' class="mc-accent"' : ''} d="${escAttr(s.d)}" fill="none" stroke="currentColor" stroke-width="${s.width}"${s.cap ? ` stroke-linecap="${escAttr(s.cap)}"` : ''}${s.join ? ` stroke-linejoin="${escAttr(s.join)}"` : ''}/>`,
    ),
  ];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${escAttr(g.viewBox || '0 0 24 24')}">${els.join('')}</svg>`;
  return (typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(svg).length : svg.length) > 32 * 1024 ? undefined : svg;
}

/** The box of some pieces (viewBox units). */
export const piecesBox = (pieces: SplitPiece[], indices: number[]): Box | undefined =>
  unionBox(indices.map((i) => pieces[i]?.bbox).filter((b): b is Box => !!b));

export type Anchor = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/** A point on a box: its centre, an edge's middle or a corner (rounded to 0.01). */
export function anchorOf(box: Box, anchor: Anchor = 'center'): [number, number] {
  const [x, y, w, h] = box;
  const fx = /left/.test(anchor) ? 0 : /right/.test(anchor) ? 1 : 0.5;
  const fy = /top/.test(anchor) ? 0 : /bottom/.test(anchor) ? 1 : 0.5;
  const r = (n: number) => Math.round(n * 100) / 100;
  return [r(x + w * fx), r(y + h * fy)];
}
