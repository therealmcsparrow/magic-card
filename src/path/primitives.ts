/*
 * Path model, editor-only: the primitive outlines (contract path-model 1.0.0). Each is one
 * closed clockwise subpath (y down) inside its box, straight sides and cubics only, at most
 * PRIMITIVE_MAX_ANCHORS anchors. Proportions are fixed per kind and scale with the box.
 */
import type { Anchor, Box, EditPath, Pt, PrimitiveKind } from '../contracts/path-model';

const K = 0.5522847498;

/** [x, y, in?, out?, smooth?] in unit coordinates of the box. */
type U = [number, number, Pt?, Pt?, boolean?];

const unit = (b: Box, list: U[]): EditPath => ({
  closed: true,
  anchors: list.map(([x, y, i, o, s]): Anchor => {
    const a: Anchor = { x: b.x + x * b.w, y: b.y + y * b.h };
    if (i) a.in = [b.x + i[0] * b.w, b.y + i[1] * b.h];
    if (o) a.out = [b.x + o[0] * b.w, b.y + o[1] * b.h];
    if (s) a.kind = 'smooth';
    return a;
  }),
});

/** Anchors in absolute units: [x, y, in?, out?]. */
const abs = (list: Array<[number, number, Pt?, Pt?]>): EditPath => ({
  closed: true,
  anchors: list.map(([x, y, i, o]): Anchor => {
    const a: Anchor = { x, y };
    if (i) a.in = i;
    if (o) a.out = o;
    return a;
  }),
});

/** Rounded corners r on a body x..x+w, y..y+h; `mid` adds anchors on the bottom edge (right to left). */
const body = (x: number, y: number, w: number, h: number, r: number, mid: Array<[number, number]> = []): EditPath => {
  const c = r * K;
  const R = x + w;
  const B = y + h;
  return abs([
    [x + r, y, [x + r - c, y], undefined],
    [R - r, y, undefined, [R - r + c, y]],
    [R, y + r, [R, y + r - c], undefined],
    [R, B - r, undefined, [R, B - r + c]],
    [R - r, B, [R - r + c, B], undefined],
    ...mid.map(([mx, my]): [number, number] => [mx, my]),
    [x + r, B, undefined, [x + r - c, B]],
    [x, B - r, [x, B - r + c], undefined],
    [x, y + r, undefined, [x, y + r - c]],
  ]);
};

/** An ellipse as four smooth anchors, clockwise from the top. */
const oval = (cx: number, cy: number, rx: number, ry: number): EditPath => ({
  closed: true,
  anchors: [
    { x: cx, y: cy - ry, in: [cx - rx * K, cy - ry], out: [cx + rx * K, cy - ry], kind: 'smooth' },
    { x: cx + rx, y: cy, in: [cx + rx, cy - ry * K], out: [cx + rx, cy + ry * K], kind: 'smooth' },
    { x: cx, y: cy + ry, in: [cx + rx * K, cy + ry], out: [cx - rx * K, cy + ry], kind: 'smooth' },
    { x: cx - rx, y: cy, in: [cx - rx, cy + ry * K], out: [cx - rx, cy - ry * K], kind: 'smooth' },
  ],
});

/** A five-point star, clockwise from the top tip, fitted to the unit box. */
const STAR: Array<[number, number]> = (() => {
  const raw = Array.from({ length: 10 }, (_, i): [number, number] => {
    const r = i % 2 ? 0.4 : 1;
    const a = (i * Math.PI) / 5;
    return [Math.sin(a) * r, -Math.cos(a) * r];
  });
  const x0 = Math.min(...raw.map((p) => p[0]));
  const x1 = Math.max(...raw.map((p) => p[0]));
  const y0 = Math.min(...raw.map((p) => p[1]));
  const y1 = Math.max(...raw.map((p) => p[1]));
  return raw.map(([x, y]) => [(x - x0) / (x1 - x0), (y - y0) / (y1 - y0)]);
})();

export function primitive(kind: PrimitiveKind, b: Box): EditPath {
  const { x, y, w, h } = b;
  switch (kind) {
    case 'rounded-rect':
      return body(x, y, w, h, Math.min(w, h) * 0.2);
    case 'triangle':
      return unit(b, [[0.5, 0], [1, 1], [0, 1]]);
    case 'arrow':
      return unit(b, [[0, 0.3], [0.6, 0.3], [0.6, 0], [1, 0.5], [0.6, 1], [0.6, 0.7], [0, 0.7]]);
    case 'chevron':
      return unit(b, [[0, 0], [0.4, 0], [1, 0.5], [0.4, 1], [0, 1], [0.6, 0.5]]);
    case 'plus':
      return unit(b, [[1 / 3, 0], [2 / 3, 0], [2 / 3, 1 / 3], [1, 1 / 3], [1, 2 / 3], [2 / 3, 2 / 3], [2 / 3, 1], [1 / 3, 1], [1 / 3, 2 / 3], [0, 2 / 3], [0, 1 / 3], [1 / 3, 1 / 3]]);
    case 'heart':
      return unit(b, [
        [0.5, 0.25, [0.42, 0], [0.58, 0]],
        [1, 0.32, [1, 0], [1, 0.6], true],
        [0.5, 1, [0.78, 0.8], [0.22, 0.8]],
        [0, 0.32, [0, 0.6], [0, 0], true],
      ]);
    case 'speech-bubble': {
      const bb = h * 0.8;
      const r = Math.min(w, bb) * 0.2;
      const xl = r + w * 0.04;
      return body(x, y, w, bb, r, [
        [x + xl + w * 0.25, y + bb],
        [x + xl, y + h],
        [x + xl, y + bb],
      ]);
    }
    case 'drop':
      return unit(b, [
        [0.5, 0, [0.38, 0.18], [0.62, 0.18]],
        [1, 0.65, [1, 0.45], [1, 0.65 + 0.35 * K], true],
        [0.5, 1, [0.5 + 0.5 * K, 1], [0.5 - 0.5 * K, 1], true],
        [0, 0.65, [0, 0.65 + 0.35 * K], [0, 0.45], true],
      ]);
    case 'leaf':
      return unit(b, [[0, 1, [0.3, 1], [0, 0.3]], [1, 0, [0.7, 0], [1, 0.7]]]);
    case 'shield':
      return unit(b, [[0, 0.12], [0.5, 0], [1, 0.12], [1, 0.5, undefined, [1, 0.78], true], [0.5, 1, [0.72, 0.9], [0.28, 0.9]], [0, 0.5, [0, 0.78], undefined, true]]);
    case 'cloud':
      return unit(b, [
        [0.25, 0.92, undefined, [0.1, 0.92]],
        [0, 0.68, [0, 0.82], [0, 0.54], true],
        [0.26, 0.42, [0.12, 0.42], [0.26, 0.2]],
        [0.5, 0, [0.3, 0], [0.7, 0], true],
        [0.74, 0.44, [0.74, 0.2], [0.88, 0.44]],
        [1, 0.68, [1, 0.54], [1, 0.82], true],
        [0.78, 0.92, [0.9, 0.92]],
      ]);
    case 'ticket': {
      const n = Math.min(w, h) * 0.15;
      const cy = y + h / 2;
      const e = n * 1.33;
      return abs([
        [x, y],
        [x + w, y],
        [x + w, cy - n, undefined, [x + w - e, cy - n]],
        [x + w, cy + n, [x + w - e, cy + n]],
        [x + w, y + h],
        [x, y + h],
        [x, cy + n, undefined, [x + e, cy + n]],
        [x, cy - n, [x + e, cy - n]],
      ]);
    }
    case 'tab':
      return unit(b, [[0, 0], [0.38, 0], [0.48, 0.18], [1, 0.18], [1, 1], [0, 1]]);
    case 'tag':
      return unit(b, [[0, 0], [0.72, 0], [1, 0.5], [0.72, 1], [0, 1]]);
    case 'circle': {
      const r = Math.min(w, h) / 2;
      return oval(x + w / 2, y + h / 2, r, r);
    }
    case 'ellipse':
      return oval(x + w / 2, y + h / 2, w / 2, h / 2);
    case 'semicircle':
      return unit(b, [
        [0, 1, undefined, [0, 1 - K]],
        [0.5, 0, [0.5 - 0.5 * K, 0], [0.5 + 0.5 * K, 0], true],
        [1, 1, [1, 1 - K]],
      ]);
    case 'star':
      return unit(b, STAR.map(([sx, sy]): U => [sx, sy]));
    case 'hexagon':
      return unit(b, [[0.25, 0], [0.75, 0], [1, 0.5], [0.75, 1], [0.25, 1], [0, 0.5]]);
  }
}
