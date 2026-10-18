import type { ApplyLayerView, IsLocked, LayerKey, LayerToggle, LayerView } from '../contracts/studio-layers';
import type { AnimationDoc, AnimationKeyframe } from './model';
import type { BindProperty, TargetRef, Track } from './model-v2-core';
import { isEmptyKeyframe, stripLane, usedLanes, type LaneId } from './editors/keyframes-utils';

/*
 * Layer view state resolved against a document (contract studio-layers.ts section 3). Pure.
 *  - rowsOf: the rows of a document that have a hide toggle, with the list each belongs to.
 *  - resolveHidden: solo resolved first into the set of effectively hidden keys.
 *  - applyLayerView: the preview document. Lanes and steps only (3b); everything drawn is the stage
 *    sheet's job (stage-hide.ts), so the document opacity is never touched here.
 *  - pruneLayerView: keys of rows that no longer exist leave the view.
 */

/** The lists a solo is scoped to (one per layers panel; a lane solo spans every target's lanes). */
export type LayerList = 'targets' | 'parts' | 'over' | 'under' | 'lanes' | 'emitters' | 'steps';

/** Card parts that can be hidden (`element` would hide the whole card). */
const CARD_PARTS = ['icon', 'name', 'state', 'background'] as const;

/** The LayerKey id of each emitter of a particles v2 document: index 0 = the primary. */
export function emitterIds(doc: AnimationDoc): string[] {
  const sim = doc.kind === 'particles' ? doc.particles?.sim : undefined;
  if (!sim) return [];
  const extra = sim.emitters ?? [];
  return [sim.id ?? 'main', ...extra.map((e, i) => e.id ?? `e${i + 1}`)];
}

/** The lanes that have keys, per target (the document's own track and `tracks`). */
function laneTargets(doc: AnimationDoc): Array<[TargetRef, AnimationKeyframe[]]> {
  const out: Array<[TargetRef, AnimationKeyframe[]]> = [];
  if (doc.kind === 'keyframes') out.push([doc.target, doc.keyframes ?? []]);
  for (const t of doc.tracks ?? []) out.push([t.target, t.keyframes]);
  return out;
}

/** Every row of `doc` that can be hidden or soloed, with its list. */
export function rowsOf(doc: AnimationDoc): Map<LayerKey, LayerList> {
  const rows = new Map<LayerKey, LayerList>();
  if (doc.kind === 'keyframes') {
    for (const t of CARD_PARTS) rows.set(`target:${t}`, 'targets');
    for (const p of doc.rig?.parts ?? []) rows.set(`part:${p.id}`, 'parts');
    for (const g of doc.rig?.groups ?? []) rows.set(`group:${g.id}`, 'parts');
    for (const s of doc.rig?.shapes ?? []) rows.set(`shape:${s.id}`, s.layer === 'under' ? 'under' : 'over');
    for (const [target, kfs] of laneTargets(doc)) for (const l of usedLanes(kfs)) rows.set(`lane:${target}|${l}`, 'lanes');
  }
  const sim = doc.kind === 'particles' ? doc.particles?.sim : undefined;
  if (sim) {
    const ids = emitterIds(doc);
    const kids = [sim.children, ...(sim.emitters ?? []).map((e) => e.children)];
    ids.forEach((id, i) => {
      rows.set(`emitter:${id}`, 'emitters');
      if (kids[i]) rows.set(`children:${id}`, 'emitters');
    });
  }
  if (doc.kind === 'sequence') (doc.steps ?? []).forEach((_, i) => rows.set(`step:${i}`, 'steps'));
  return rows;
}

/** The parents of an emitter hidden by a solo on its child particles (a pseudo row of the stage sheet). */
export const PARENTS_PREFIX = 'parents:';

/**
 * The effectively hidden keys: the view's own hides plus what solos hide. Solo is scoped to its list:
 * its other rows are hidden. A soloed group keeps its members; a soloed part keeps its group (members
 * are hidden one by one). A soloed emitter keeps its children; soloing only the child particles hides
 * the emitter's parents (`parents:<id>`). Keys of rows that do not exist are ignored.
 */
export function resolveHidden(doc: AnimationDoc, view: LayerView): Set<LayerKey> {
  const rows = rowsOf(doc);
  const hidden = new Set<LayerKey>(view.hidden.filter((k) => rows.has(k)));
  const solo = new Set(view.solo.filter((k) => rows.has(k)));
  if (!solo.size) return hidden;
  const soloed = new Set<LayerList>([...solo].map((k) => rows.get(k)!));
  const groupOf = new Map<string, string>();
  for (const g of doc.rig?.groups ?? []) for (const id of g.parts) if (!groupOf.has(id)) groupOf.set(id, g.id);
  for (const [key, list] of rows) {
    if (!soloed.has(list) || solo.has(key)) continue;
    const [kind, ...rest] = key.split(':');
    const id = rest.join(':');
    if (list === 'parts') {
      // groups are not hidden by solo: their members decide
      if (kind === 'group' || solo.has(`group:${groupOf.get(id)}`)) continue;
    } else if (list === 'emitters') {
      const own = id;
      if (kind === 'children') {
        if (solo.has(`emitter:${own}`)) continue;
      } else if (solo.has(`children:${own}`) && !hidden.has(key)) {
        hidden.add(`${PARENTS_PREFIX}${own}`);
        continue;
      }
    }
    hidden.add(key);
  }
  return hidden;
}

/**
 * Number of layers the preview hides (the chip's N): the effective hidden rows, without the pseudo
 * `parents:` rows and without a row that is hidden only because its parent is (the child particles of
 * a hidden emitter, a lane of a hidden target).
 */
export function hiddenCount(doc: AnimationDoc, view: LayerView): number {
  const hidden = resolveHidden(doc, view);
  let n = 0;
  for (const k of hidden) {
    if (k.startsWith(PARENTS_PREFIX)) continue;
    const p = parentKey(doc, k);
    if (p && hidden.has(p)) continue;
    n++;
  }
  return n;
}

/** The row a row belongs to: a part to its group, child particles to their emitter, a lane to its target. */
export function parentKey(doc: AnimationDoc, key: LayerKey): LayerKey | undefined {
  const [kind, ...rest] = key.split(':');
  const id = rest.join(':');
  if (kind === 'part') {
    const g = doc.rig?.groups?.find((x) => x.parts.includes(id));
    return g ? `group:${g.id}` : undefined;
  }
  if (kind === 'children') return `emitter:${id}`;
  if (kind === 'lane') {
    const t = key.slice(5, key.lastIndexOf('|'));
    return t === 'element' ? undefined : /^(part|group|shape):/.test(t) ? t : `target:${t}`;
  }
  return undefined;
}

const FIELD: Record<LayerToggle, 'hidden' | 'solo' | 'locked'> = { hide: 'hidden', solo: 'solo', lock: 'locked' };

/** The view with that toggle flipped for that row (a new object). */
export function toggleLayer(view: LayerView, key: LayerKey, toggle: LayerToggle): LayerView {
  const f = FIELD[toggle];
  return { ...view, [f]: view[f].includes(key) ? view[f].filter((k) => k !== key) : [...view[f], key] };
}

/** Locked directly, or through its group, target or emitter. */
export const isLocked: IsLocked = (doc, view, key) => {
  for (let k: LayerKey | undefined = key, n = 0; k && n < 4; k = parentKey(doc, k), n++) if (view.locked.includes(k)) return true;
  return false;
};

/** Why a row is not shown in the preview: its own hide, a solo elsewhere, or the row it belongs to (`by`). */
export function hideReason(doc: AnimationDoc, view: LayerView, key: LayerKey): { kind: 'self' | 'solo' | 'parent'; by?: LayerKey } | undefined {
  if (view.hidden.includes(key)) return { kind: 'self' };
  const hidden = resolveHidden(doc, view);
  if (hidden.has(key)) return { kind: 'solo' };
  for (let k = parentKey(doc, key), n = 0; k && n < 4; k = parentKey(doc, k), n++) if (hidden.has(k)) return { kind: 'parent', by: k };
  return undefined;
}

/** How many rows below a row (a group's parts, a target's lanes, an emitter's child particles) are hidden or soloed: the "2 hidden" badge of a closed row. */
export function markedBelow(doc: AnimationDoc, view: LayerView, key: LayerKey): number {
  const hidden = resolveHidden(doc, view);
  let n = 0;
  for (const k of rowsOf(doc).keys()) if (parentKey(doc, k) === key && (hidden.has(k) || view.solo.includes(k))) n++;
  return n;
}

/** The binding properties that write a lane. */
const BIND_LANE: Partial<Record<BindProperty, LaneId>> = { rotate: 'rotate', rotate_speed: 'rotate', x: 'x', y: 'y', scale: 'scale', opacity: 'opacity', draw: 'draw', color_mix: 'color' };

function stripLanes(kfs: AnimationKeyframe[], lanes: LaneId[]): AnimationKeyframe[] {
  return kfs.map((k) => lanes.reduce(stripLane, k)).filter((k) => !isEmptyKeyframe(k));
}

/**
 * The document the preview card renders. Lanes: the property leaves every key of that target (the main
 * track and `tracks`), its bindings are dropped and the target rests at its base value. Steps: removed.
 * Returns `doc` itself when no lane or step is effectively hidden. Clips that play another document are
 * left as they are (the clip's own document is not part of this one).
 */
export const applyLayerView: ApplyLayerView = (doc, view) => {
  const hidden = resolveHidden(doc, view);
  const lanes = new Map<string, LaneId[]>();
  const steps = new Set<number>();
  for (const key of hidden) {
    if (key.startsWith('lane:')) {
      const at = key.lastIndexOf('|');
      const target = key.slice(5, at);
      lanes.set(target, [...(lanes.get(target) ?? []), key.slice(at + 1) as LaneId]);
    } else if (key.startsWith('step:')) steps.add(Number(key.slice(5)));
  }
  if (!lanes.size && !steps.size) return doc;
  const out: AnimationDoc = { ...doc };
  if (steps.size) out.steps = (doc.steps ?? []).filter((_, i) => !steps.has(i));
  if (lanes.size) {
    if (doc.keyframes && lanes.has(doc.target)) out.keyframes = stripLanes(doc.keyframes, lanes.get(doc.target)!);
    if (doc.tracks) {
      out.tracks = doc.tracks.flatMap((t): Track[] => {
        const l = lanes.get(t.target);
        if (!l) return [t];
        const keyframes = stripLanes(t.keyframes, l);
        // a track left with nothing to play and no motion path is dropped
        return keyframes.length || t.path ? [{ ...t, keyframes }] : [];
      });
    }
    if (doc.bindings) out.bindings = doc.bindings.filter((b) => !lanes.get(b.target)?.some((l) => BIND_LANE[b.property] === l));
  }
  return out;
};

/** The view without the keys of rows the document no longer has (the same object when nothing leaves). */
export function pruneLayerView(doc: AnimationDoc, view: LayerView): LayerView {
  const rows = rowsOf(doc);
  // kinds this module knows are pruned; others (path, content, element ...) are the panels' business
  const known = (k: LayerKey): boolean => !/^(target|part|group|shape|lane|emitter|children|step):/.test(k) || rows.has(k) || k === 'target:element';
  const keep = (list: LayerKey[]): LayerKey[] => (list.every(known) ? list : list.filter(known));
  const hidden = keep(view.hidden);
  const solo = keep(view.solo);
  const locked = keep(view.locked);
  const open = keep(view.open);
  return hidden === view.hidden && solo === view.solo && locked === view.locked && open === view.open ? view : { hidden, solo, locked, open };
}
