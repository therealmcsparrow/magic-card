import { CORNER_TYPES, MAX_SHAPE_POINTS } from '../../contracts/custom-shape';
import type { CustomShapeOptions } from '../../contracts/custom-shape';
import { SHAPE_MAX_BYTES } from '../../contracts/mcu-library';
import type { TransferDataByKind, TransferNote } from '../../contracts/preset-transfer';
import { compactBytes, isObj, note } from '../types';
import type { KindResult, Raw } from '../types';

/** The CustomShapeOptions keys a file may carry (`ref` is a card-side pointer and is never exported). */
export const SHAPE_KEYS = ['corner', 'corner_type', 'corners', 'smoothing', 'points', 'padding'] as const;

const LENGTH = /^\s*-?(?:\d*\.)?\d+\s*(?:%|px)?\s*$/i;
const COORD = /^\s*(?:-?(?:\d*\.)?\d+%)?\s*(?:[+-]?\s*(?:\d*\.)?\d+)?\s*(?:px)?\s*$/i;
const num = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isLength = (v: unknown): boolean => (num(v) && v >= 0) || (typeof v === 'string' && LENGTH.test(v) && !v.trim().startsWith('-'));
const isCoord = (v: unknown): boolean => num(v) || (typeof v === 'string' && /\d/.test(v) && COORD.test(v));
const isType = (v: unknown): boolean => typeof v === 'string' && (CORNER_TYPES as readonly string[]).includes(v);
const isPair = (v: unknown): v is [number, number] => Array.isArray(v) && v.length === 2 && num(v[0]) && num(v[1]);

/** A shape item: known keys only, values checked one by one (invalid ones dropped and listed). */
export function readShape(index: number, data: unknown): KindResult<TransferDataByKind['shape']> {
  if (!isObj(data)) return { ok: false, notes: [note('invalid_item', index, 'data', 'The shape data is missing.')] };
  const notes: TransferNote[] = [];
  const bad = (path: string, what: string) => notes.push(note('dropped_value', index, `data.${path}`, `${what} is not valid, so it was left out.`));
  const out: Raw = {};

  for (const [k, v] of Object.entries(data)) {
    if (!(SHAPE_KEYS as readonly string[]).includes(k)) {
      notes.push(note('dropped_key', index, `data.${k}`, `"${k}" is not a shape setting, so it was left out.`));
      continue;
    }
    if (k === 'corner') {
      if (isLength(v)) out.corner = v;
      else bad(k, 'The corner size');
    } else if (k === 'corner_type') {
      if (isType(v)) out.corner_type = v;
      else bad(k, 'The corner type');
    } else if (k === 'smoothing') {
      if (num(v) || (typeof v === 'string' && /^\s*(?:\d*\.)?\d+\s*$/.test(v))) out.smoothing = v;
      else bad(k, 'The smoothing');
    } else if (k === 'corners') {
      if (!isObj(v)) {
        bad(k, 'The corners setting');
        continue;
      }
      const corners: Raw = {};
      for (const [c, spec] of Object.entries(v)) {
        if (!['tl', 'tr', 'br', 'bl'].includes(c)) notes.push(note('dropped_key', index, `data.corners.${c}`, `"${c}" is not a corner, so it was left out.`));
        else if (isType(spec) || isLength(spec)) corners[c] = spec;
        else if (isObj(spec) && (spec.type === undefined || isType(spec.type)) && (spec.size === undefined || isLength(spec.size))) {
          corners[c] = { ...(spec.type !== undefined ? { type: spec.type } : {}), ...(spec.size !== undefined ? { size: spec.size } : {}) };
        } else bad(`corners.${c}`, `Corner ${c}`);
      }
      if (Object.keys(corners).length) out.corners = corners;
    } else if (k === 'padding') {
      if (isLength(v)) out.padding = v;
      else if (isObj(v)) {
        const pad: Raw = {};
        for (const [side, sv] of Object.entries(v)) {
          if (['top', 'right', 'bottom', 'left'].includes(side) && isLength(sv)) pad[side] = sv;
          else bad(`padding.${side}`, `Padding "${side}"`);
        }
        if (Object.keys(pad).length) out.padding = pad;
      } else bad(k, 'The padding');
    } else if (k === 'points') {
      if (!Array.isArray(v)) {
        bad(k, 'The points list');
        continue;
      }
      if (v.length > MAX_SHAPE_POINTS) return { ok: false, notes: [note('invalid_item', index, 'data.points', `A shape holds at most ${MAX_SHAPE_POINTS} points (this one has ${v.length}).`)] };
      const points: Raw[] = [];
      v.forEach((pt, i) => {
        if (!isObj(pt) || !isCoord(pt.x) || !isCoord(pt.y) || (pt.in !== undefined && !isPair(pt.in)) || (pt.out !== undefined && !isPair(pt.out))) {
          bad(`points[${i}]`, `Point ${i + 1}`);
          return;
        }
        const keep: Raw = { x: pt.x, y: pt.y };
        if (pt.in !== undefined) keep.in = pt.in;
        if (pt.out !== undefined) keep.out = pt.out;
        if (typeof pt.kind === 'string') keep.kind = pt.kind;
        points.push(keep);
      });
      if (points.length) out.points = points;
    }
  }
  if (!Object.keys(out).length) return { ok: false, notes: [...notes, note('invalid_item', index, 'data', 'The shape has no valid settings.')] };
  if (compactBytes(out) > SHAPE_MAX_BYTES) return { ok: false, notes: [note('invalid_item', index, 'data', `The shape is larger than ${SHAPE_MAX_BYTES / 1024} KB.`)] };
  return { ok: true, data: out as Omit<CustomShapeOptions, 'ref'>, notes };
}
