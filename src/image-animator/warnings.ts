import { HEAVY_ANIM_BYTES, HEAVY_FILTER_TARGETS, HEAVY_MORPH_POINTS, HEAVY_TARGETS, type ImageAnimation } from '../contracts/image-animation';
import { LIBRARY_WARN_BYTES } from '../contracts/image-editor';

// Warnings that never block a save: a heavy animation and a library close to its size limit.

export interface HeavyReason {
  kind: 'targets' | 'filters' | 'morph-points' | 'anim-bytes';
  /** The measured value. */
  n: number;
  /** The threshold it is above. */
  limit: number;
}

const NUMBER_RE = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g;
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

/** Why an animation is heavy, in the order targets, filters, morph points, data size; empty when it is not. */
export function heavyReasons(anim: ImageAnimation): HeavyReason[] {
  const targets = new Set<string>();
  const filtered = new Set<string>();
  let numbers = 0;
  for (const clip of list(isRecord(anim) ? anim.clips : undefined)) {
    if (!isRecord(clip)) continue;
    for (const track of list(clip.tracks)) {
      if (!isRecord(track) || typeof track.target !== 'string') continue;
      targets.add(track.target);
      for (const frame of list(track.keyframes)) {
        if (isRecord(frame) && (frame.filter !== undefined || frame.blur !== undefined)) filtered.add(track.target);
      }
    }
    for (const morph of list(clip.morphs)) {
      if (!isRecord(morph)) continue;
      for (const frame of list(morph.frames)) {
        if (isRecord(frame) && typeof frame.d === 'string') numbers += frame.d.match(NUMBER_RE)?.length ?? 0;
      }
    }
  }
  const points = numbers / 2;
  let bytes: number;
  try {
    bytes = new TextEncoder().encode(JSON.stringify(anim) ?? '').length;
  } catch {
    bytes = 0;
  }
  const out: HeavyReason[] = [];
  if (targets.size > HEAVY_TARGETS) out.push({ kind: 'targets', n: targets.size, limit: HEAVY_TARGETS });
  if (filtered.size > HEAVY_FILTER_TARGETS) out.push({ kind: 'filters', n: filtered.size, limit: HEAVY_FILTER_TARGETS });
  if (points > HEAVY_MORPH_POINTS) out.push({ kind: 'morph-points', n: points, limit: HEAVY_MORPH_POINTS });
  if (bytes > HEAVY_ANIM_BYTES) out.push({ kind: 'anim-bytes', n: bytes, limit: HEAVY_ANIM_BYTES });
  return out;
}

/** The library size warning: shown from LIBRARY_WARN_BYTES up, summing the `bytes` of every image; entries without a number count nothing. */
export function libraryWarning(images: readonly { bytes: number }[]): { show: boolean; bytes: number } {
  let bytes = 0;
  for (const i of images) if (isRecord(i) && typeof i.bytes === 'number' && Number.isFinite(i.bytes) && i.bytes > 0) bytes += i.bytes;
  return { show: bytes >= LIBRARY_WARN_BYTES, bytes };
}
