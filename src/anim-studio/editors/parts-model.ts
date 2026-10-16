import type { AnimationDoc, AnimationKeyframe, Rig, RigGroup, RigPart, TargetRef, Track } from '../model';
import { V2_CAPS, PART_ID_RE } from '../model-v2';
import { registerSvgGeometry, resolveIconGeometry, peekIconGeometry, type IconGeometry } from '../../icons/icon-source';
import { splitIcon, unionBox, type SplitPiece } from '../../icons/icon-split';
import { tileModule, type PreviewTile } from '../tiles';
import type { StudioSelection } from '../slots';

/*
 * Icon parts in the studio (track B2): pure document edits for the parts layers, overlay and
 * inspector. Every function returns a new document (never mutates) and keeps the v2 references
 * valid: a removed part / group drops its tracks and bindings and leaves its groups.
 * Ids are unique across parts, groups and shapes (one namespace, `data-p` / `data-g` / `data-s`).
 */

export type Box = [number, number, number, number];

/** The part / group id of a rig target ref. */
export const refId = (ref: string): string => ref.slice(ref.indexOf(':') + 1);
export const partRef = (id: string): TargetRef => `part:${id}`;
export const groupRef = (id: string): TargetRef => `group:${id}`;
export const isPartRef = (ref: unknown): ref is TargetRef => typeof ref === 'string' && /^(part|group):/.test(ref);

/** The rig has parts or shapes to show. */
export const hasRig = (doc: AnimationDoc): boolean => !!doc.rig && (doc.rig.parts.length > 0 || !!doc.rig.shapes?.length);

/** All ids in the rig's namespace (parts, groups, shapes). */
export function rigIds(rig: Rig | undefined): Set<string> {
  return new Set([...(rig?.parts ?? []).map((p) => p.id), ...(rig?.groups ?? []).map((g) => g.id), ...(rig?.shapes ?? []).map((s) => s.id)]);
}

/** A free id from a base (`part-3`, `group-2`...), unique in the rig's namespace. */
export function freeId(rig: Rig | undefined, base: string, taken = rigIds(rig)): string {
  const stem = base.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^[-_]+/, '').slice(0, 24) || 'part';
  for (let n = 1; ; n++) {
    const id = `${stem}-${n}`;
    if (!taken.has(id) && PART_ID_RE.test(id)) return id;
  }
}

/** The icon the rig is built from: its own icon, else the preview tile's icon. */
export function sourceIcon(doc: AnimationDoc, tile: PreviewTile = 'icon'): string {
  if (doc.rig?.icon) return doc.rig.icon;
  if (doc.rig?.svg) return registerSvgGeometry(doc.rig.svg);
  return String(tileModule(tile, 'm', false).icon ?? 'mdi:bell-ring');
}

/** The source geometry when already known (sync). */
export const peekGeometry = (ref: string): IconGeometry | undefined => peekIconGeometry(ref);
/** The source geometry (resolves icon packs / HA's icon database). */
export const loadGeometry = (ref: string): Promise<IconGeometry | undefined> => resolveIconGeometry(ref);

/** Pieces per geometry object (cached). */
const pieceCache = new WeakMap<IconGeometry, SplitPiece[]>();
export function piecesOf(g: IconGeometry): SplitPiece[] {
  let p = pieceCache.get(g);
  if (!p) pieceCache.set(g, (p = splitIcon(g)));
  return p;
}

// ── tracks ──

/** A new track for `ref` would pass the cap (24 tracks): the edit is blocked. */
export const trackCapReached = (doc: AnimationDoc, ref: string): boolean =>
  !doc.tracks?.some((t) => t.target === ref) && (doc.tracks?.length ?? 0) >= V2_CAPS.tracks;
export const TRACK_CAP_MESSAGE = `This animation has ${V2_CAPS.tracks} animated targets, the most it can hold. Remove one to animate this part.`;

export const trackOf = (doc: AnimationDoc, ref: string): Track | undefined => doc.tracks?.find((t) => t.target === ref);

/** Replace (or add, or with undefined remove) the track of a target. */
export function withTrack(doc: AnimationDoc, ref: TargetRef, track: Track | undefined): AnimationDoc {
  const tracks = (doc.tracks ?? []).filter((t) => t.target !== ref);
  const i = (doc.tracks ?? []).findIndex((t) => t.target === ref);
  if (track) tracks.splice(i < 0 ? tracks.length : i, 0, { ...track, target: ref });
  const out: AnimationDoc = { ...doc, tracks };
  if (!tracks.length) delete out.tracks;
  return out;
}

/** Drop the tracks and bindings of removed targets. */
function dropRefs(doc: AnimationDoc, refs: Set<string>): AnimationDoc {
  const out: AnimationDoc = { ...doc };
  if (doc.tracks) {
    out.tracks = doc.tracks.filter((t) => !refs.has(t.target));
    if (!out.tracks.length) delete out.tracks;
  }
  if (doc.bindings) {
    out.bindings = doc.bindings.filter((b) => !refs.has(b.target));
    if (!out.bindings.length) delete out.bindings;
  }
  return out;
}

const withRig = (doc: AnimationDoc, rig: Rig): AnimationDoc => ({ ...doc, rig });

// ── split ──

/** A fresh rig: one part per piece of the source, "Part 1…n". */
export function rigFromPieces(pieces: SplitPiece[], source?: { icon?: string; svg?: string }): Rig {
  const parts: RigPart[] = pieces.slice(0, V2_CAPS.parts).map((p, i) => ({ id: `part-${i + 1}`, name: `Part ${i + 1}`, from: [p.index] }));
  return { ...(source?.svg ? { svg: source.svg } : source?.icon ? { icon: source.icon } : {}), parts };
}

/**
 * Split the source icon into parts (replaces the parts and groups; tracks and bindings of rig parts
 * go, shapes stay). `icon` an icon id, or `svg:` own SVG markup handled by the caller.
 */
export function splitInto(doc: AnimationDoc, pieces: SplitPiece[], source: { icon?: string; svg?: string }): AnimationDoc {
  const old = doc.rig;
  const gone = new Set([...(old?.parts ?? []).map((p) => partRef(p.id)), ...(old?.groups ?? []).map((g) => groupRef(g.id))]);
  const rig = rigFromPieces(pieces, source);
  if (old?.shapes?.length) {
    // shapes keep their ids: renumber parts that would collide
    const taken = new Set(old.shapes.map((s) => s.id));
    rig.parts = rig.parts.map((p) => (taken.has(p.id) ? { ...p, id: freeId(rig, 'part', new Set([...taken, ...rig.parts.map((x) => x.id)])) } : p));
    rig.shapes = old.shapes;
  }
  return withRig(dropRefs(doc, gone), rig);
}

// ── edits ──

export function renameTarget(doc: AnimationDoc, ref: string, name: string): AnimationDoc {
  const rig = doc.rig;
  const n = name.trim();
  if (!rig || !n) return doc;
  const id = refId(ref);
  if (ref.startsWith('part:')) return withRig(doc, { ...rig, parts: rig.parts.map((p) => (p.id === id ? { ...p, name: n } : p)) });
  if (ref.startsWith('group:')) return withRig(doc, { ...rig, groups: (rig.groups ?? []).map((g) => (g.id === id ? { ...g, name: n } : g)) });
  if (ref.startsWith('shape:')) return withRig(doc, { ...rig, shapes: (rig.shapes ?? []).map((s) => (s.id === id ? { ...s, name: n } : s)) });
  return doc;
}

/** Part ids behind refs (a group ref brings its members). */
export function partIdsOf(doc: AnimationDoc, refs: string[]): string[] {
  const rig = doc.rig;
  const out: string[] = [];
  for (const r of refs) {
    const id = refId(r);
    const list = r.startsWith('group:') ? (rig?.groups?.find((g) => g.id === id)?.parts ?? []) : r.startsWith('part:') ? [id] : [];
    for (const p of list) if (!out.includes(p) && rig?.parts.some((x) => x.id === p)) out.push(p);
  }
  // rig order
  return (rig?.parts ?? []).map((p) => p.id).filter((p) => out.includes(p));
}

export const groupOfPart = (rig: Rig | undefined, id: string): RigGroup | undefined => rig?.groups?.find((g) => g.parts.includes(id));

/** Why the selection cannot be grouped ('' when it can). */
export function groupBlocker(doc: AnimationDoc, refs: string[]): string {
  const ids = partIdsOf(doc, refs);
  if (ids.length < 2) return 'Select two or more parts to group them.';
  if ((doc.rig?.groups?.length ?? 0) >= V2_CAPS.groups) return `A rig has at most ${V2_CAPS.groups} groups.`;
  return '';
}

/** Group the selected parts (a part leaves its old group; emptied groups go). New group id. */
export function groupParts(doc: AnimationDoc, refs: string[], name?: string): { doc: AnimationDoc; id?: string } {
  const rig = doc.rig;
  if (!rig || groupBlocker(doc, refs)) return { doc };
  const ids = partIdsOf(doc, refs);
  const id = freeId(rig, 'group');
  const left = (rig.groups ?? []).map((g) => ({ ...g, parts: g.parts.filter((p) => !ids.includes(p)) }));
  const emptied = new Set(left.filter((g) => !g.parts.length).map((g) => groupRef(g.id)));
  const groups = [...left.filter((g) => g.parts.length), { id, name: name?.trim() || `Group ${(rig.groups?.length ?? 0) + 1}`, parts: ids }];
  return { doc: withRig(dropRefs(doc, emptied), { ...rig, groups }), id };
}

/** Remove a group (its parts stay; its track and bindings go). */
export function ungroup(doc: AnimationDoc, groupId: string): AnimationDoc {
  const rig = doc.rig;
  if (!rig?.groups?.some((g) => g.id === groupId)) return doc;
  const groups = rig.groups.filter((g) => g.id !== groupId);
  const next: Rig = { ...rig, groups };
  if (!groups.length) delete next.groups;
  return withRig(dropRefs(doc, new Set([groupRef(groupId)])), next);
}

/** Merge parts into the first one (its id, name, track; the pieces of all). */
export function mergeParts(doc: AnimationDoc, refs: string[]): { doc: AnimationDoc; id?: string } {
  const rig = doc.rig;
  const ids = partIdsOf(doc, refs).filter((id) => rig?.parts.find((p) => p.id === id)?.from);
  if (!rig || ids.length < 2) return { doc };
  const [keep, ...rest] = ids;
  const from = [...new Set(ids.flatMap((id) => rig.parts.find((p) => p.id === id)!.from ?? []))].sort((a, b) => a - b);
  const parts = rig.parts.filter((p) => !rest.includes(p.id)).map((p) => (p.id === keep ? { ...p, from } : p));
  const left = (rig.groups ?? []).map((g) => ({ ...g, parts: g.parts.filter((p) => !rest.includes(p)) }));
  const emptied = left.filter((g) => !g.parts.length).map((g) => groupRef(g.id));
  const next: Rig = { ...rig, parts, ...(rig.groups ? { groups: left.filter((g) => g.parts.length) } : {}) };
  if (next.groups && !next.groups.length) delete next.groups;
  return { doc: withRig(dropRefs(doc, new Set([...rest.map(partRef), ...emptied])), next), id: keep };
}

/** Split a merged part back into one part per piece (the first keeps id, name and track). */
export function splitPart(doc: AnimationDoc, partId: string): { doc: AnimationDoc; ids: string[] } {
  const rig = doc.rig;
  const part = rig?.parts.find((p) => p.id === partId);
  if (!rig || !part?.from || part.from.length < 2) return { doc, ids: [partId] };
  const room = V2_CAPS.parts - rig.parts.length + 1;
  const pieces = part.from.slice(0, Math.max(1, room));
  const taken = rigIds(rig);
  const extra: RigPart[] = pieces.slice(1).map((i) => {
    const id = freeId(rig, 'part', taken);
    taken.add(id);
    // clean numbering: part-7 is "Part 7"
    return { id, name: `Part ${id.slice(5)}`, from: [i] };
  });
  const first: RigPart = { ...part, from: [pieces[0]] };
  delete first.origin;
  const at = rig.parts.indexOf(part);
  const parts = [...rig.parts.slice(0, at), first, ...extra, ...rig.parts.slice(at + 1)];
  // the new parts join the merged part's group
  const groups = rig.groups?.map((g) => (g.parts.includes(partId) ? { ...g, parts: [...g.parts, ...extra.map((p) => p.id)] } : g));
  return { doc: withRig(doc, { ...rig, parts, ...(groups ? { groups } : {}) }), ids: [partId, ...extra.map((p) => p.id)] };
}

/** Move a part up (-1) or down (+1) in drawing order (later parts draw on top). */
export function movePart(doc: AnimationDoc, partId: string, by: -1 | 1): AnimationDoc {
  const rig = doc.rig;
  const i = rig?.parts.findIndex((p) => p.id === partId) ?? -1;
  const j = i + by;
  if (!rig || i < 0 || j < 0 || j >= rig.parts.length) return doc;
  const parts = [...rig.parts];
  [parts[i], parts[j]] = [parts[j], parts[i]];
  return withRig(doc, { ...rig, parts });
}

/** Set (or with undefined clear) the pivot of a part, group or shape, viewBox units. */
export function setPivot(doc: AnimationDoc, ref: string, origin: [number, number] | undefined): AnimationDoc {
  const rig = doc.rig;
  if (!rig) return doc;
  const id = refId(ref);
  const r2 = (n: number) => Math.round(n * 100) / 100;
  const set = <T extends { id: string; origin?: [number, number] }>(x: T): T => {
    if (x.id !== id) return x;
    const y = { ...x };
    if (origin) y.origin = [r2(origin[0]), r2(origin[1])];
    else delete y.origin;
    return y;
  };
  if (ref.startsWith('part:')) return withRig(doc, { ...rig, parts: rig.parts.map(set) });
  if (ref.startsWith('group:')) return withRig(doc, { ...rig, groups: (rig.groups ?? []).map(set) });
  if (ref.startsWith('shape:')) return withRig(doc, { ...rig, shapes: (rig.shapes ?? []).map(set) });
  return doc;
}

// ── track pivots ──

const isRigRef = (ref: string): boolean => /^(part|group|shape):/.test(ref);

/**
 * A track's own origin as a point, viewBox units (a part preset writes its pivot there as
 * "<x>px <y>px"). It plays with transform-box view-box, so lengths count from the viewBox origin
 * and keywords / percentages take the viewBox size. undefined when the track has none.
 */
export function trackPivot(doc: AnimationDoc, ref: string, viewBox: Box = [0, 0, 24, 24]): [number, number] | undefined {
  const origin = isRigRef(ref) ? trackOf(doc, ref)?.origin?.trim() : undefined;
  if (!origin) return undefined;
  const axis = (v: string | undefined, i: 0 | 1): number => {
    const size = viewBox[2 + i];
    if (!v || v === 'center') return size / 2;
    if (v === 'left' || v === 'top') return 0;
    if (v === 'right' || v === 'bottom') return size;
    const n = parseFloat(v);
    if (!Number.isFinite(n)) return size / 2;
    return v.endsWith('%') ? (size * n) / 100 : n;
  };
  // "top center" / "center left": keywords may come in either order
  let [a, b] = origin.split(/\s+/);
  if (a === 'top' || a === 'bottom' || ((b === 'left' || b === 'right') && a === 'center')) [a, b] = [b, a];
  return [axis(a, 0), axis(b, 1)];
}

/** Does the target's track carry its own origin (a preset's pivot, winning over the part's)? */
export const hasTrackPivot = (doc: AnimationDoc, ref: string): boolean => isRigRef(ref) && !!trackOf(doc, ref)?.origin;

/** Set the origin of a target's track ("<x>px <y>px"); undefined removes it, so the part's pivot applies again. */
export function setTrackPivot(doc: AnimationDoc, ref: TargetRef, origin: [number, number] | undefined): AnimationDoc {
  const t = trackOf(doc, ref);
  if (!t || !isRigRef(ref)) return doc;
  const next: Track = { ...t };
  const r2 = (n: number) => Math.round(n * 100) / 100;
  if (origin) next.origin = `${r2(origin[0])}px ${r2(origin[1])}px`;
  else delete next.origin;
  // a track left with nothing to play goes (as the keyframes editor does)
  return withTrack(doc, ref, next.keyframes.length || next.path || next.origin ? next : undefined);
}

/** Move the pivot a target plays with: its track origin while it has one, else its own pivot. */
export function setEffectivePivot(doc: AnimationDoc, ref: TargetRef, origin: [number, number]): AnimationDoc {
  return hasTrackPivot(doc, ref) ? setTrackPivot(doc, ref, origin) : setPivot(doc, ref, origin);
}

// ── geometry of targets ──

/** Box of a part / group / shape on the pieces (viewBox units). */
export function targetBox(doc: AnimationDoc, ref: string, pieces: SplitPiece[]): Box | undefined {
  const rig = doc.rig;
  if (!rig) return undefined;
  const ids = partIdsOf(doc, [ref]);
  const boxes = ids.flatMap((id) => (rig.parts.find((p) => p.id === id)?.from ?? []).map((i) => pieces[i]?.bbox)).filter((b): b is Box => !!b);
  return unionBox(boxes);
}

/** The pivot a target plays with: its track's origin, else its own origin, else its box centre. */
export function targetPivot(doc: AnimationDoc, ref: string, pieces: SplitPiece[], viewBox?: Box): [number, number] | undefined {
  const fromTrack = trackPivot(doc, ref, viewBox);
  if (fromTrack) return fromTrack;
  const rig = doc.rig;
  const id = refId(ref);
  const own = ref.startsWith('part:') ? rig?.parts.find((p) => p.id === id)?.origin : ref.startsWith('group:') ? rig?.groups?.find((g) => g.id === id)?.origin : undefined;
  if (own) return own;
  const b = targetBox(doc, ref, pieces);
  return b ? [b[0] + b[2] / 2, b[1] + b[3] / 2] : undefined;
}

/** A target's display name. */
export function targetName(doc: AnimationDoc, ref: string): string {
  const id = refId(ref);
  const rig = doc.rig;
  if (ref.startsWith('part:')) return rig?.parts.find((p) => p.id === id)?.name ?? id;
  if (ref.startsWith('group:')) return rig?.groups?.find((g) => g.id === id)?.name ?? id;
  if (ref.startsWith('shape:')) return rig?.shapes?.find((s) => s.id === id)?.name ?? id;
  return ref;
}

/** Does the target exist in the rig? */
export function targetExists(doc: AnimationDoc, ref: string): boolean {
  const id = refId(ref);
  if (ref.startsWith('part:')) return !!doc.rig?.parts.some((p) => p.id === id);
  if (ref.startsWith('group:')) return !!doc.rig?.groups?.some((g) => g.id === id);
  if (ref.startsWith('shape:')) return !!doc.rig?.shapes?.some((s) => s.id === id);
  return false;
}

// ── draw-on ──

/** The draw keys of a target's track: [at, draw] pairs, sorted. */
export function drawKeys(doc: AnimationDoc, ref: string): Array<[number, number]> {
  return (trackOf(doc, ref)?.keyframes ?? []).filter((k) => k.draw !== undefined).map((k) => [k.at, k.draw!] as [number, number]);
}

/** Merge a property into the key at `at` of a keyframe list (adding the key when missing). */
function setKey(keys: AnimationKeyframe[], at: number, patch: Partial<AnimationKeyframe>): AnimationKeyframe[] {
  const out = keys.map((k) => (k.at === at ? { ...k, ...patch } : k));
  if (!keys.some((k) => k.at === at)) out.push({ at, ...patch });
  return out.sort((a, b) => a.at - b.at);
}

/**
 * Draw the target on (0 → 1 from `start`% to `end`%, then held) or off (1 → 0), replacing its other
 * draw keys; `kind: 'none'` removes all draw keys. Other properties of the track stay.
 */
export function setDrawOn(doc: AnimationDoc, ref: TargetRef, kind: 'on' | 'off' | 'none', start = 0, end = 60): AnimationDoc {
  if (kind !== 'none' && trackCapReached(doc, ref)) return doc;
  const t = trackOf(doc, ref);
  let keys = (t?.keyframes ?? []).map((k) => {
    if (k.draw === undefined) return k;
    const c = { ...k };
    delete c.draw;
    return c;
  });
  keys = keys.filter((k) => Object.keys(k).some((p) => p !== 'at' && p !== 'easing' && p !== 'easings'));
  if (kind !== 'none') {
    const [a, b] = kind === 'on' ? [0, 1] : [1, 0];
    const s = Math.max(0, Math.min(100, start));
    const e = Math.max(s, Math.min(100, end));
    keys = setKey(keys, s, { draw: a });
    keys = setKey(keys, e, { draw: b });
    if (s > 0) keys = setKey(keys, 0, { draw: a });
    if (e < 100) keys = setKey(keys, 100, { draw: b });
  }
  if (!keys.length && !t?.path) return withTrack(doc, ref, undefined);
  return withTrack(doc, ref, { ...(t ?? { target: ref }), target: ref, keyframes: keys.slice(0, V2_CAPS.keysPerTrack) });
}

// ── motion path ──

/** A default motion path in viewBox units around the rest position: a small arc. */
export const DEFAULT_PART_PATH = 'M0 0 C 2 -3 4 -3 6 0 S 2 3 0 0';

export function setPartPath(doc: AnimationDoc, ref: TargetRef, path: Track['path'] | undefined): AnimationDoc {
  const t = trackOf(doc, ref);
  if (!path) {
    if (!t) return doc;
    const next: Track = { ...t };
    delete next.path;
    return withTrack(doc, ref, next.keyframes.length ? next : undefined);
  }
  if (trackCapReached(doc, ref)) return doc;
  return withTrack(doc, ref, { ...(t ?? { target: ref, keyframes: [] }), target: ref, path });
}

// ── hidden in preview (studio session only, never stored) ──

const hidden = new Set<string>();
const hiddenEvents = new EventTarget();
export const hiddenParts = (): ReadonlySet<string> => hidden;
export function toggleHidden(ref: string, on = !hidden.has(ref)): void {
  if (on) hidden.add(ref);
  else hidden.delete(ref);
  hiddenEvents.dispatchEvent(new Event('change'));
}
/** Show every part again (a new split). */
export function clearHidden(): void {
  if (!hidden.size) return;
  hidden.clear();
  hiddenEvents.dispatchEvent(new Event('change'));
}
export function onHiddenChange(cb: () => void): () => void {
  hiddenEvents.addEventListener('change', cb);
  return () => hiddenEvents.removeEventListener('change', cb);
}
/** CSS hiding the parts, groups and shapes hidden in the preview. */
export function hiddenCss(refs: Iterable<string>): string {
  const sels = [...refs]
    .map((r) => /^(part|group|shape):([a-z0-9][a-z0-9_-]{0,31})$/.exec(r))
    .filter((m): m is RegExpExecArray => !!m)
    .map((m) => `[data-${m[1] === 'part' ? 'p' : m[1] === 'group' ? 'g' : 's'}="${m[2]}"]`);
  return sels.length ? `${sels.join(', ')} { visibility: hidden !important; }` : '';
}

// ── selection ──

const RIG_REF = /^(part|group|shape):/;

/** The rig targets (parts, groups, shapes) of a studio selection, primary first. */
export function selectedRefs(sel: StudioSelection | undefined): TargetRef[] {
  if (!sel || (sel.kind !== 'target' && sel.kind !== 'keys')) return [];
  const list = [...(sel.target ? [sel.target] : []), ...(sel.targets ?? [])];
  return [...new Set(list)].filter((r) => RIG_REF.test(r));
}

/** A target selection of rig refs (`primary` first; none when empty). */
export function targetSelection(refs: TargetRef[], primary?: TargetRef): StudioSelection {
  const list = [...new Set(refs)];
  if (!list.length) return { kind: 'none' };
  const target = primary && list.includes(primary) ? primary : list[list.length - 1];
  return { kind: 'target', target, targets: [target, ...list.filter((r) => r !== target)] };
}

/** Emit `selection-change` from a panel element. */
export function emitSelection(el: HTMLElement, selection: StudioSelection): void {
  el.dispatchEvent(new CustomEvent('selection-change', { detail: { selection }, bubbles: true, composed: true }));
}

/** Emit `doc-change` from a panel element. */
export function emitDoc(el: HTMLElement, doc: AnimationDoc, label: string, transient = false): void {
  el.dispatchEvent(new CustomEvent('doc-change', { detail: { doc, label, ...(transient ? { transient: true } : {}) }, bubbles: true, composed: true }));
}
