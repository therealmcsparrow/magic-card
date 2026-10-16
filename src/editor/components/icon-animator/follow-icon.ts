import type { MagicCardConfig } from '../../../types';
import {
  CUSTOM_PREFIX,
  validateAnimationDoc,
  type AnimationDoc,
  type Rig,
  type RigGroup,
  type RigPart,
  type TargetRef,
} from '../../../anim-studio/model';
import type { IconGeometry } from '../../../icons/icon-source';
import { splitIcon, type SplitPiece } from '../../../icons/icon-split';
import { sanitizeSvg } from '../../../icons/svg-sanitize';
import { ICON_LIBRARY } from '../../../icon-anim/library';
import { mdiGeometry } from '../../../icon-anim/mdi-paths';
import { RIG_PART_CAP, piecesBox, svgFromGeometry } from '../../../icon-anim/icon-doc';
import type { IconAnimatorHost } from './loader';
import type { CardState } from './card-request';
import {
  cardIds,
  iconEntry,
  newQuickId,
  quickEntry,
  referenceCount,
  removeInlineDoc,
  storedDoc,
  upsertInlineDoc,
  withoutQuickEntry,
} from './quick-model';

/*
 * "This icon" animations follow their module's icon (lazy chunk; the card editor's state manager
 * calls followIcons through loader.ts after every edit of a card with inline animations). When a
 * module's own icon changes and then stays put for a second, its quick document is split again from the new icon: parts keep their
 * place by piece index (Part 1 stays Part 1), parts the new icon does not have go with their tracks,
 * bindings and empty groups, pivots move with their part's box, and the new drawing is embedded like
 * Apply does. Library animations (see below), documents of other modules, icons cleared back to the entity's
 * icon and icons whose shape cannot be loaded (a half-typed id in YAML) are left alone. On a
 * template-linked card a document the template supplies follows too: the result is the card's own
 * document with the same id (an override of the template's, like Apply on that card).
 *
 * A library animation (a stored built-in document, or a My animations reference the icon picker
 * set) draws its own copy of an icon, so after the same settled icon change (Clear too) its entry
 * is removed instead, with its quick document when nothing else plays it. The tile pick that set it
 * changes the icon and the document in one action: nothing is removed then.
 */

/** An own SVG (a document's `rig.svg`) as icon geometry, like icon-source builds it. */
export function svgGeometry(svg: string): IconGeometry | undefined {
  const r = sanitizeSvg(svg);
  if (r.error) return undefined;
  const g: IconGeometry = { paths: r.paths, viewBox: r.viewBox };
  if (r.accentPaths.length) g.secondary = r.accentPaths;
  if (r.strokes.length) g.strokes = r.strokes;
  if (r.evenodd) g.evenodd = r.evenodd;
  return g;
}

/** A module's own icon id ('' when it shows its entity's icon, the type default or an own SVG). */
export function explicitIcon(m: Record<string, unknown> | undefined): string {
  const icon = m?.icon;
  return m && !m.use_entity_icon && typeof icon === 'string' && icon !== 'svg' && icon.includes(':')
    ? icon
    : '';
}

type Path = Array<string | number>;

/** A module whose own icon changed while it kept its quick animation entry. */
export interface IconChange {
  path: Path;
  /** The icon before ('' when the module showed its entity's icon or the type default). */
  from: string;
  to: string;
  /** Its quick document id. */
  id: string;
}

/** The module's icon entry (iconEntry: its quick document, else a picker library reference). */
const entryOf = (m: Record<string, unknown>) => {
  const list = (m.design as { animations?: unknown } | undefined)?.animations;
  return Array.isArray(list)
    ? iconEntry(list.filter((a) => !!a && typeof a === 'object'))
    : undefined;
};

const quickOf = (m: Record<string, unknown>): string | undefined => {
  const e = entryOf(m);
  return e?.quick ? e.id : undefined;
};

/** Every object with an icon animation entry (modules at any depth), by path. */
function quickModules(config: unknown): Map<string, { path: Path; m: Record<string, unknown> }> {
  const out = new Map<string, { path: Path; m: Record<string, unknown> }>();
  const walk = (node: unknown, path: Path) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach((x, i) => walk(x, [...path, i]));
    const m = node as Record<string, unknown>;
    if (typeof m.type === 'string' && entryOf(m)) out.set(JSON.stringify(path), { path, m });
    for (const [k, v] of Object.entries(m))
      if (k !== 'custom_animations' && k !== 'design') walk(v, [...path, k]);
  };
  walk(config, []);
  return out;
}

/**
 * The modules whose own icon changed from `prev` to `next` (same place, type and quick document):
 * set or changed to another icon. An icon cleared back to the entity's is not a change here.
 */
export function iconChanges(prev: MagicCardConfig, next: MagicCardConfig): IconChange[] {
  const before = quickModules(prev);
  const out: IconChange[] = [];
  for (const [key, { path, m }] of quickModules(next)) {
    const old = before.get(key)?.m;
    const id = quickOf(m);
    const to = explicitIcon(m);
    if (!id || !old || old.type !== m.type || old.id !== m.id || quickOf(old) !== id || !to) continue;
    const from = explicitIcon(old);
    if (from !== to) out.push({ path, from, to, id });
  }
  return out;
}

/**
 * The modules whose library animation goes (`tpl`: the linked template's documents): the same icon
 * entry in `prev` and `next` (place, type, preset) playing a built-in document (its name is an
 * ICON_LIBRARY entry's) or a My animations reference, and an own icon that changed, Clear included.
 */
export function libraryIconChanges(
  prev: MagicCardConfig,
  next: MagicCardConfig,
  tpl?: unknown,
): IconChange[] {
  const before = quickModules(prev);
  const out: IconChange[] = [];
  for (const [key, { path, m }] of quickModules(next)) {
    const old = before.get(key)?.m;
    const e = entryOf(m)!;
    if (!old || old.type !== m.type || old.id !== m.id || entryOf(old)?.id !== e.id) continue;
    const name = e.quick && storedDoc(next, tpl, e.id)?.doc.name;
    if (e.quick && !ICON_LIBRARY.some((x) => x.name === name)) continue;
    const from = explicitIcon(old);
    const to = explicitIcon(m);
    if (from !== to) out.push({ path, from, to, id: e.id });
  }
  return out;
}

/**
 * A stored document that follows the module's icon: a split of the module's own icon ("This icon",
 * not a library entry) whose drawing is embedded or names the old icon. Raw, as stored.
 */
export function followsIcon(
  raw: Record<string, unknown> | undefined,
  from: string,
  to: string,
): boolean {
  const rig = raw?.rig as Partial<Rig> | undefined;
  if (!raw || !rig || typeof rig !== 'object' || ICON_LIBRARY.some((e) => e.name === raw.name))
    return false;
  if (typeof rig.svg === 'string') return true;
  return typeof rig.icon === 'string' && rig.icon !== to && (!from || rig.icon === from);
}

/** The animator's name for a split of `icon`. */
export const ownName = (icon: string): string =>
  `Animated ${icon.slice(icon.indexOf(':') + 1).replace(/-/g, ' ')}`;

type Box = [number, number, number, number];

/** A point in an old box moved to the same relative place in a new one (rounded to 0.01). */
function moved(pt: [number, number], from?: Box, to?: Box): [number, number] {
  if (!from || !to) return pt;
  const r = (n: number) => Math.round(n * 100) / 100;
  const f = (v: number, o: number, s: number, no: number, ns: number) =>
    r(no + (s ? (v - o) / s : 0.5) * ns);
  return [f(pt[0], from[0], from[2], to[0], to[2]), f(pt[1], from[1], from[3], to[1], to[3])];
}

/**
 * The document on `icon` (its shape `g`): parts keep their piece indices (pieces the new icon lacks
 * are dropped, a part left without pieces goes with its tracks, bindings and empty groups), the new
 * icon's other pieces become new parts, pivots move with their part's box (`old`: the previous
 * drawing, when known) and the drawing is embedded (rig.svg) like Apply; an icon over the own-icon
 * cap keeps its id. `removed`: the tracks and bindings that went.
 */
export function repointDoc(
  doc: AnimationDoc,
  icon: string,
  g: IconGeometry,
  old?: IconGeometry,
): { doc: AnimationDoc; removed: number } {
  const rig = doc.rig!;
  const name = /^Animated /.test(doc.name) ? ownName(icon) : doc.name;
  const pieces = splitIcon(g);
  const before = old ? splitIcon(old) : undefined;
  const boxOf = (list: SplitPiece[] | undefined, from: number[]): Box | undefined =>
    list ? piecesBox(list, from) : undefined;
  const fromOf = new Map<string, number[]>();
  const gone = new Set<string>();
  const parts: RigPart[] = [];
  for (const p of rig.parts) {
    if (p.svg) {
      parts.push(p);
      continue;
    }
    const from = (p.from ?? []).filter((i) => i < pieces.length);
    if (!from.length) {
      gone.add(`part:${p.id}`);
      continue;
    }
    fromOf.set(`part:${p.id}`, from);
    const part = { ...p, from };
    if (p.origin) part.origin = moved(p.origin, boxOf(before, p.from ?? []), boxOf(pieces, from));
    parts.push(part);
  }
  const groups: RigGroup[] = [];
  for (const x of rig.groups ?? []) {
    const members = x.parts.filter((id) => !gone.has(`part:${id}`));
    if (members.length) groups.push({ ...x, parts: members });
    else gone.add(`group:${x.id}`);
  }
  for (const x of groups)
    fromOf.set(
      `group:${x.id}`,
      x.parts.flatMap((id) => fromOf.get(`part:${id}`) ?? []),
    );
  // the new icon's other pieces: parts of their own, as a fresh split would give them
  const used = new Set(parts.flatMap((p) => p.from ?? []));
  const ids = new Set([...parts, ...groups, ...(rig.shapes ?? [])].map((x) => x.id));
  for (let i = 0; i < pieces.length && parts.length < RIG_PART_CAP; i++) {
    if (used.has(i)) continue;
    let n = i + 1;
    while (ids.has(`part-${n}`)) n++;
    ids.add(`part-${n}`);
    parts.push({ id: `part-${n}`, name: `Part ${n}`, from: [i] });
  }
  // a track's pivot (viewBox px) moves with its target's box
  const oldFrom = new Map<string, number[]>([
    ...rig.parts.map((p): [string, number[]] => [`part:${p.id}`, p.from ?? []]),
    ...(rig.groups ?? []).map((x): [string, number[]] => [
      `group:${x.id}`,
      x.parts.flatMap((id) => rig.parts.find((p) => p.id === id)?.from ?? []),
    ]),
  ]);
  const pivot = (target: TargetRef, origin?: string): string | undefined => {
    const m = origin && /^(-?[\d.]+)px (-?[\d.]+)px$/.exec(origin);
    const from = fromOf.get(target);
    if (!m || !from) return origin;
    const [x, y] = moved(
      [+m[1], +m[2]],
      boxOf(before, oldFrom.get(target) ?? []),
      boxOf(pieces, from),
    );
    return `${x}px ${y}px`;
  };
  const tracks = (doc.tracks ?? [])
    .filter((t) => !gone.has(t.target))
    .map((t) => (t.origin ? { ...t, origin: pivot(t.target, t.origin) } : t));
  const bindings = (doc.bindings ?? []).filter((b) => !gone.has(b.target));
  const svg = svgFromGeometry(g);
  const next: Rig = { ...(svg ? { svg } : { icon }), parts };
  if (rig.groups) next.groups = groups;
  if (rig.shapes) next.shapes = rig.shapes;
  const out: AnimationDoc = { ...doc, name, rig: next };
  if (doc.tracks) out.tracks = tracks;
  if (doc.bindings) out.bindings = bindings;
  return {
    doc: out,
    removed:
      (doc.tracks?.length ?? 0) - tracks.length + (doc.bindings?.length ?? 0) - bindings.length,
  };
}

/** The note for the user after a document followed its module's icon. */
export function followNote(icon: string, removed: number): string {
  const head = `The icon animation now uses the new icon (${icon}).`;
  if (!removed) return head;
  return `${head} ${removed} part animation${removed === 1 ? ' was' : 's were'} removed because the new icon has fewer parts.`;
}

/** Notes by document id until the animator shows them (once). */
export const FOLLOW_NOTES = new Map<string, string>();
/** Open animators: told to reload their document after it followed an icon. */
export const LIVE = new Set<{ followed(): void }>();

const at = (config: unknown, path: Path): Record<string, unknown> | undefined =>
  path.reduce<unknown>(
    (n, k) => (n && typeof n === 'object' ? (n as Record<string, unknown>)[k] : undefined),
    config,
  ) as Record<string, unknown> | undefined;

/** The card with the quick entry of the modules at `paths` playing `id` (the module keeps its other fields). */
function withQuickId(config: MagicCardConfig, paths: Path[], id: string): MagicCardConfig {
  const out = JSON.parse(JSON.stringify(config)) as MagicCardConfig;
  for (const path of paths) {
    const m = at(out, path)!;
    const list = (m.design as { animations: Array<{ preset: unknown }> }).animations;
    const q = quickEntry(list as never)!;
    list[q.index] = { ...list[q.index], preset: CUSTOM_PREFIX + id };
    // a template-linked card keeps the module's own animation list
    const marks = (m.not_synced ?? []) as string[];
    if (out.template && !marks.includes('design.animations'))
      m.not_synced = [...marks, 'design.animations'];
  }
  return out;
}

type FollowHost = Pick<IconAnimatorHost, 'resolveIcon' | 'setIcon' | 'customIds' | 'library'>;

/** How long a module's icon stays put before its animation follows (a burst of edits: YAML typing). */
export const FOLLOW_DELAY_MS = 1000;

/** A module waiting for its icon to settle: its icon and stored document before the burst. */
interface Pending {
  key: string;
  path: Path;
  id: string;
  from: string;
  /** The stored document as it was before the burst (JSON). */
  doc: string;
  /** The card after the burst's last edit (the undo step a follow folds into). */
  last: MagicCardConfig;
  timer: ReturnType<typeof setTimeout>;
  /** Delays spent waiting for a detached editor. */
  waits: number;
  /** A library animation: removed (drop) instead of followed. */
  drop?: boolean;
}

const waiting = new WeakMap<CardState, Map<string, Pending>>();

/** The document the card plays for `id` (its own, else the linked template's unless hidden). */
const played = (sm: CardState, config: MagicCardConfig, id: string) =>
  storedDoc(config, sm.getState().templateAnimations, id)?.doc;

/** How many delays a follow waits for a detached editor to come back (HA's dialog tabs) before it is dropped. */
const MAX_WAITS = 120;

/**
 * Run `w` once its icon stayed put for FOLLOW_DELAY_MS. While the editor is detached (`attached`
 * false: HA's card dialog closed, or showing another tab) nothing is written: a Save has already
 * taken the config, and a config written now would not reach Home Assistant. The follow waits for
 * the editor to come back (another tab), else it is dropped with no note.
 */
function arm(h: FollowHost, sm: CardState, map: Map<string, Pending>, w: Pending): void {
  clearTimeout(w.timer);
  map.set(w.key, w);
  w.timer = setTimeout(() => {
    if (sm.attached === false) {
      if (w.waits++ < MAX_WAITS) arm(h, sm, map, w);
      else map.delete(w.key);
      return;
    }
    map.delete(w.key);
    if (w.drop) return drop(h, sm, w);
    void follow(h, sm, w).then((wait) => {
      if (wait && !map.has(w.key)) arm(h, sm, map, w);
    });
  }, FOLLOW_DELAY_MS);
}

/**
 * After an edit (`prev` to `next`): a module whose own icon changed has its quick document follow
 * the new icon once the icon stayed put for FOLLOW_DELAY_MS. A burst of edits (bell, bel, bell-ring
 * typed in YAML) follows once, from the icon and document before the burst to the final icon, so
 * parts are pruned only against that one. A library animation is dropped the same way, once after
 * the burst.
 */
export function followIcons(
  h: FollowHost,
  sm: CardState,
  prev: MagicCardConfig,
  next: MagicCardConfig,
): void {
  let map = waiting.get(sm);
  if (!map) waiting.set(sm, (map = new Map()));
  for (const c of iconChanges(prev, next)) {
    const key = `${JSON.stringify(c.path)} ${c.id}`;
    const p = map.get(key);
    if (!p && !followsIcon(played(sm, next, c.id), c.from, c.to)) continue;
    const entry: Pending = p ?? {
      key,
      path: c.path,
      id: c.id,
      from: c.from,
      doc: JSON.stringify(played(sm, prev, c.id)),
      last: next,
      timer: undefined as unknown as Pending['timer'],
      waits: 0,
    };
    entry.last = next;
    entry.waits = 0;
    arm(h, sm, map, entry);
  }
  for (const c of libraryIconChanges(prev, next, sm.getState().templateAnimations)) {
    const key = `drop ${JSON.stringify(c.path)} ${c.id}`;
    const entry: Pending = map.get(key) ?? {
      key,
      path: c.path,
      id: c.id,
      from: c.from,
      doc: JSON.stringify(played(sm, prev, c.id)),
      last: next,
      timer: undefined as unknown as Pending['timer'],
      waits: 0,
      drop: true,
    };
    entry.last = next;
    entry.waits = 0;
    arm(h, sm, map, entry);
  }
}

/** The note after a library animation went with its module's old icon. */
export const DROP_NOTE = "The animated icon was removed because the module's icon changed.";

/**
 * One module's library animation goes once its icon settled on another (nothing when it went back
 * to the icon it had, or when the entry or its document changed meanwhile: a tile pick rewrote it).
 * The entry is removed (a template-linked module's list becomes its own) and its quick document
 * with it when nothing else plays it; a document the template supplies stays the template's.
 * Folded into the burst's last undo step while the card is still as that edit left it, like follow.
 */
function drop(h: FollowHost, sm: CardState, w: Pending): void {
  const c = sm.getConfig();
  const m = at(c, w.path);
  if (!m || entryOf(m)?.id !== w.id || explicitIcon(m) === w.from) return;
  if (JSON.stringify(played(sm, c, w.id)) !== w.doc) return;
  let config = JSON.parse(JSON.stringify(c)) as MagicCardConfig;
  const mod = at(config, w.path)!;
  const design = { ...(mod.design as Record<string, unknown>) };
  const list = withoutQuickEntry(design.animations as never);
  if (list.length) design.animations = list;
  else delete design.animations;
  mod.design = design;
  const marks = (mod.not_synced ?? []) as string[];
  if (config.template && !marks.includes('design.animations'))
    mod.not_synced = [...marks, 'design.animations'];
  config = removeInlineDoc(config, w.id, h.customIds(config));
  sm.updateConfig(config, JSON.stringify(c) !== JSON.stringify(w.last));
  for (const a of LIVE) a.followed();
  document
    .querySelector('home-assistant')
    ?.dispatchEvent(new CustomEvent('hass-notification', { detail: { message: DROP_NOTE } }));
}

/**
 * One module's document follows the icon it settled on (nothing when it went back to the icon it
 * had). Folded into the burst's last undo step while the card is still as that edit left it, else
 * its own step. A document another module still plays on its old icon is copied (the module gets
 * the copy). The note goes to Home Assistant's toast and to the animator. True: the editor was
 * detached when the result was ready (nothing written; the caller waits for it to come back).
 */
async function follow(h: FollowHost, sm: CardState, w: Pending): Promise<boolean | void> {
  const { id, from, path } = w;
  const live = () => {
    const c = sm.getConfig();
    const m = at(c, path);
    return { c, m, ok: !!m && quickOf(m) === id && JSON.stringify(played(sm, c, id)) === w.doc };
  };
  const first = live();
  const to = first.m ? explicitIcon(first.m) : '';
  if (!first.ok || !to || to === from) return;
  const raw = played(sm, first.c, id);
  if (!followsIcon(raw, from, to)) return;
  const v = validateAnimationDoc(raw, { v2: 'lenient' });
  if (!v.ok || !v.doc.rig) return;
  const shape = async (ref: string) => {
    let g = await h.resolveIcon(ref, { timeoutMs: 1500 }).catch(() => undefined);
    if (!g && (g = mdiGeometry(ref))) h.setIcon(ref, g);
    return g;
  };
  const g = await shape(to);
  if (!g) return;
  const rig = v.doc.rig;
  const old = rig.svg ? svgGeometry(rig.svg) : await shape(rig.icon || from);
  const { doc, removed } = repointDoc(v.doc, to, g, old);
  // the card may have moved on during the lookups: the module and the document still as they were
  if (sm.attached === false) return true;
  const now = live();
  if (!now.ok || explicitIcon(now.m) !== to) return;
  let config = now.c;
  let docId = id;
  if (referenceCount(config, id) > 1) {
    const lib = h.library.status === 'ready' ? h.library.list().map((d) => d.id) : [];
    // the copy's id is new to the card, the linked template and the library
    docId = newQuickId([
      ...cardIds(config, h.customIds(config), sm.getState().templateAnimations),
      ...lib,
    ]);
    config = withQuickId(config, [path], docId);
  }
  const valid = validateAnimationDoc({ ...doc, id: docId }, { v2: 'strict' });
  if (!valid.ok) return;
  config = upsertInlineDoc(config, valid.doc, h.customIds(config));
  const note = followNote(to, removed);
  FOLLOW_NOTES.set(docId, note);
  sm.updateConfig(config, JSON.stringify(now.c) !== JSON.stringify(w.last));
  for (const a of LIVE) a.followed();
  document
    .querySelector('home-assistant')
    ?.dispatchEvent(new CustomEvent('hass-notification', { detail: { message: note } }));
}
