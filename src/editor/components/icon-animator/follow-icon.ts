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
import { handEdited, libraryPickOf, withoutPickFields } from './library-pick';
import type { AnimationConfig } from '../../../types';
import type { CardState } from './card-request';
import {
  cardIds,
  MINE_PREFIX,
  QUICK_PREFIX,
  iconEntry,
  newQuickId,
  quickEntry,
  referenceCount,
  removeInlineDoc,
  storedDoc,
  upsertInlineDoc,
  withoutQuickEntry,
} from './quick-model';
import { t, m } from '../../../icon-anim/i18n';

/*
 * "This icon" animations follow their module's icon: after the icon settles, the quick document is split again from the new icon (parts keep their piece index).
 * Library animations are removed instead when the icon changes; other modules' documents and unloadable icons are left alone.
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

/** Marks the icon ref of a module's own drawing (`icon: svg`): this prefix, then the markup. */
const OWN = 'mc-own:';

/**
 * A module's own icon ref ('' when it shows its entity's icon or the type default): an icon id, a
 * saved icon (`mcu:<id>`), or its own drawing (`icon: svg`), which is OWN plus the markup, so a
 * changed drawing is a changed icon.
 */
export function explicitIcon(m: Record<string, unknown> | undefined): string {
  const icon = m?.icon;
  if (!m || m.use_entity_icon || typeof icon !== 'string') return '';
  if (icon === 'svg') return typeof m.svg === 'string' && m.svg.trim() ? OWN + m.svg : '';
  return icon.includes(':') ? icon : '';
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
export function iconChanges(prev: MagicCardConfig, next: MagicCardConfig, tpl?: unknown): IconChange[] {
  const before = quickModules(prev);
  const out: IconChange[] = [];
  for (const [key, { path, m }] of quickModules(next)) {
    const old = before.get(key)?.m;
    const id = quickOf(m);
    const to = explicitIcon(m);
    if (!id || !old || old.type !== m.type || old.id !== m.id || quickOf(old) !== id || !to) continue;
    // a library pick (library_icon, document as derived): never re-split, it goes (libraryIconChanges);
    // edited by hand since, it is the user's own and follows
    const e = entryOf(m)!;
    if (libraryPickOf(e.entry, storedDoc(next, tpl, id)?.doc)) continue;
    const from = explicitIcon(old);
    if (from !== to) out.push({ path, from, to, id });
  }
  return out;
}

/** The modules whose library animation goes: same icon entry in `prev` and `next` playing a built-in, My animations or edited-copy document, with an own icon that changed. */
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
    const mine = e.id.startsWith(MINE_PREFIX);
    const name = e.quick && !mine && storedDoc(next, tpl, e.id)?.doc.name;
    const raw = e.quick && !mine ? storedDoc(next, tpl, e.id)?.doc : undefined;
    // a library pick goes; one edited by hand since is the user's own (it follows: iconChanges)
    if (e.quick && !mine && e.entry.library_icon && ICON_LIBRARY.some((x) => x.id === e.entry.library_icon)) {
      if (!libraryPickOf(e.entry, raw)) continue;
    } else if (e.quick && !mine && !ICON_LIBRARY.some((x) => x.name === name)) continue;
    const from = explicitIcon(old);
    const to = explicitIcon(m);
    if (from !== to) out.push({ path, from, to, id: e.id });
  }
  return out;
}

/**
 * What an icon change does to the module's icon animation, for the SVG editor's notice: a library
 * animation (a built-in document, a My animations copy or reference) draws its own copy of the old
 * icon and is removed; a "This icon" animation follows the new icon. Same rules as
 * libraryIconChanges / iconChanges. `tpl`: the linked template's documents.
 */
export function iconAnimationFacts(
  m: Record<string, unknown>,
  config: MagicCardConfig,
  tpl?: unknown,
): { pickedAnimation: boolean; followsIcon: boolean } {
  const e = entryOf(m);
  if (!e) return { pickedAnimation: false, followsIcon: false };
  const raw = e.quick ? storedDoc(config, tpl, e.id)?.doc : undefined;
  const picked =
    !e.quick ||
    e.id.startsWith(MINE_PREFIX) ||
    (e.entry.library_icon && ICON_LIBRARY.some((x) => x.id === e.entry.library_icon)
      ? !!libraryPickOf(e.entry, raw)
      : ICON_LIBRARY.some((x) => x.name === raw?.name));
  return { pickedAnimation: picked, followsIcon: !picked };
}

/**
 * A stored document that follows the module's icon: a split of the module's own icon ("This icon",
 * not a library entry nor a My animations copy) whose drawing is embedded or names the old icon.
 * Raw, as stored. `own`: a library pick edited by hand, the user's own whatever its name.
 */
export function followsIcon(
  raw: Record<string, unknown> | undefined,
  from: string,
  to: string,
  own = false,
): boolean {
  const rig = raw?.rig as Partial<Rig> | undefined;
  if (
    !raw ||
    !rig ||
    typeof rig !== 'object' ||
    String(raw.id).startsWith(MINE_PREFIX) ||
    (!own && ICON_LIBRARY.some((e) => e.name === raw.name))
  )
    return false;
  if (typeof rig.svg === 'string') return true;
  return typeof rig.icon === 'string' && rig.icon !== to && (!from || rig.icon === from);
}

/** The animator's name for a split of `icon`. */
export const ownName = (icon: string): string =>
  icon.startsWith(OWN) ? t('icon-animator.follow-icon.animated-drawing') : t('icon-animator.follow-icon.animated-name', { name: icon.slice(icon.indexOf(':') + 1).replace(/-/g, ' ') });

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
 * The document on `icon` (shape `g`): parts keep their piece indices, new pieces become parts, pivots follow their box and the drawing is embedded.
 * `removed` collects the tracks and bindings that went.
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
    parts.push({ id: `part-${n}`, name: t('icon-animator.follow-icon.part-n', { n }), from: [i] });
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
  const head = t('icon-animator.follow-icon.the-icon-animation-now-uses-the-new-icon', { icon });
  if (!removed) return head;
  return `${head} ${t('icon-animator.follow-icon.count-removed-because-the-new-icon-has', { count: removed })}`;
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

/** The card with the icon entry of the module at `path` without its library pick fields. */
function withoutPickFieldsAt(config: MagicCardConfig, path: Path): MagicCardConfig {
  const out = JSON.parse(JSON.stringify(config)) as MagicCardConfig;
  const m = at(out, path);
  const list = (m?.design as { animations?: AnimationConfig[] } | undefined)?.animations;
  const q = Array.isArray(list) ? quickEntry(list) : undefined;
  if (list && q) list[q.index] = withoutPickFields(list[q.index]);
  return out;
}

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
  /** Bumped by every arm: a drop still running when its module changed again is superseded. */
  gen: number;
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
  const gen = ++w.gen;
  w.timer = setTimeout(() => {
    if (sm.attached === false) {
      if (w.waits++ < MAX_WAITS) arm(h, sm, map, w);
      else map.delete(w.key);
      return;
    }
    // a drop stays in the map while it runs: a change meanwhile re-arms it from the burst's first
    // icon (a half-typed id still loading, then the old id back, drops nothing)
    if (!w.drop) map.delete(w.key);
    void (w.drop ? drop : follow)(h, sm, w).then((wait) => {
      if (w.drop ? map.get(w.key) !== w || w.gen !== gen : map.has(w.key)) return;
      // parked: the next icon change of the module re-arms it, still from the burst's first icon
      if (wait === 'park') return;
      if (wait) arm(h, sm, map, w);
      else map.delete(w.key);
    });
  }, FOLLOW_DELAY_MS);
}

/**
 * After an edit (`prev` to `next`): a module whose own icon changed has its quick document follow the new icon once it stayed put for FOLLOW_DELAY_MS.
 * A burst of edits follows once; a library animation is dropped the same way.
 */
export function followIcons(
  h: FollowHost,
  sm: CardState,
  prev: MagicCardConfig,
  next: MagicCardConfig,
): void {
  let map = waiting.get(sm);
  if (!map) waiting.set(sm, (map = new Map()));
  const m = map;
  // (re)start the wait of `c`: the burst keeps its first icon and document, its last edit
  const wait = (key: string, c: IconChange, p: Pending | undefined, drop?: boolean) => {
    const entry: Pending = p ?? {
      key,
      path: c.path,
      id: c.id,
      from: c.from,
      doc: JSON.stringify(played(sm, prev, c.id)),
      last: next,
      timer: undefined as unknown as Pending['timer'],
      waits: 0,
      drop,
      gen: 0,
    };
    entry.last = next;
    entry.waits = 0;
    arm(h, sm, m, entry);
  };
  const tpl = sm.getState().templateAnimations;
  for (const c of iconChanges(prev, next, tpl)) {
    const key = `${JSON.stringify(c.path)} ${c.id}`;
    const p = map.get(key);
    const raw = played(sm, next, c.id);
    if (p || followsIcon(raw, c.from, c.to, handEdited(entryOf(at(next, c.path)!)?.entry, raw))) wait(key, c, p);
  }
  for (const c of libraryIconChanges(prev, next, tpl)) {
    const key = `drop ${JSON.stringify(c.path)} ${c.id}`;
    // a parked wait whose document changed since (Update) starts over from this change
    const p = map.get(key);
    wait(key, c, p && p.doc === JSON.stringify(played(sm, prev, c.id)) ? p : undefined, true);
  }
}

/**
 * An icon's shape: a drawing's markup, Home Assistant's icon sets, the card's kept copy of a saved
 * icon, else the bundled mdi paths; undefined when it cannot load.
 */
async function shapeOf(h: FollowHost, ref: string, config?: MagicCardConfig): Promise<IconGeometry | undefined> {
  if (ref.startsWith(OWN)) return svgGeometry(ref.slice(OWN.length));
  let g = await h.resolveIcon(ref, { timeoutMs: 1500 }).catch(() => undefined);
  const kept = ref.startsWith('mcu:') ? config?.custom_icons?.[ref.slice(4)] : undefined;
  if (!g && kept) g = svgGeometry(kept);
  if (!g && (g = mdiGeometry(ref))) h.setIcon(ref, g);
  return g;
}

/** The note after a library animation went with its module's old icon. */
export const DROP_NOTE = m("icon-animator.follow-icon.the-animated-icon-was-removed-because");

/**
 * Removes one module's library animation once its icon settled on another, with its quick document when nothing else plays it.
 * Returns 'park' when the shape cannot load yet; true when the editor was detached (the caller waits).
 */
async function drop(h: FollowHost, sm: CardState, w: Pending): Promise<boolean | 'park' | void> {
  const live = () => {
    const c = sm.getConfig();
    const m = at(c, w.path);
    const ok =
      !!m &&
      entryOf(m)?.id === w.id &&
      explicitIcon(m) !== w.from &&
      JSON.stringify(played(sm, c, w.id)) === w.doc;
    return { c, ok, to: m ? explicitIcon(m) : '' };
  };
  const first = live();
  if (!first.ok) return;
  // like follow: an icon whose shape cannot load (a half-typed id) keeps the animation; Clear drops
  if (first.to && !(await shapeOf(h, first.to, first.c))) return 'park';
  if (sm.attached === false) return true;
  const { c, ok, to } = live();
  if (!ok || to !== first.to) return;
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
  // a My animations reference stores nothing of its own: an inline document with the library id
  // (Copy YAML's embedded animations) is the user's and stays
  if (w.id.startsWith(QUICK_PREFIX)) config = removeInlineDoc(config, w.id, h.customIds(config));
  sm.updateConfig(config, JSON.stringify(c) !== JSON.stringify(w.last));
  for (const a of LIVE) a.followed();
  document
    .querySelector('home-assistant')
    ?.dispatchEvent(new CustomEvent('hass-notification', { detail: { message: t(DROP_NOTE) } }));
}

/**
 * Makes one module's document follow the icon it settled on, folded into the burst's last undo step when possible.
 * A document another module still plays is copied; true when the editor was detached (nothing written).
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
  // a library pick edited by hand follows like the user's own animation, and loses its pick fields
  const own = handEdited(entryOf(first.m!)?.entry, raw);
  if (!followsIcon(raw, from, to, own)) return;
  const v = validateAnimationDoc(raw, { v2: 'lenient' });
  if (!v.ok || !v.doc.rig) return;
  const shape = (ref: string) => shapeOf(h, ref, first.c);
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
  if (own) config = withoutPickFieldsAt(config, path);
  const note = followNote(to, removed);
  FOLLOW_NOTES.set(docId, note);
  sm.updateConfig(config, JSON.stringify(now.c) !== JSON.stringify(w.last));
  for (const a of LIVE) a.followed();
  document
    .querySelector('home-assistant')
    ?.dispatchEvent(new CustomEvent('hass-notification', { detail: { message: note } }));
}
