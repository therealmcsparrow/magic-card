import { fold } from '../i18n/fold';
import { toYaml, fromYaml } from '../utils/yaml-utils';
import { embedCustomAnimations } from '../utils/custom-animations';
// the studio checks and compiles the v2 fields (rigs, tracks, clips, bindings): register them
import './model-v2';
import './compile-v2';
import { tileModule, type PreviewTile } from './tiles';
import type { TransferItem } from '../contracts/preset-transfer';
import { ANIMATION_CAPS, ANIMATION_ID_RE, CUSTOM_PREFIX, validateAnimationDoc, type AnimationDoc, type AnimationKind, type FieldError } from './model';
import { t, m, type MessageId } from './i18n';
import { validationText } from './validation-text';

export type { PreviewTile } from './tiles';

/*
 * Pure parts of the animation studio: undo history, ids, search, YAML export / import and the
 * config of the preview card. No DOM.
 */

export const KIND_LABEL: Record<AnimationKind, MessageId> = {
  keyframes: m('anim-studio.studio-model.keyframes'),
  particles: m('anim-studio.studio-model.particles'),
  path: m('anim-studio.studio-model.path'),
  sequence: m('anim-studio.studio-model.sequence'),
};

export const KIND_ICON: Record<AnimationKind, string> = {
  keyframes: 'mdi:vector-polyline',
  particles: 'mdi:shimmer',
  path: 'mdi:vector-curve',
  sequence: 'mdi:format-list-numbered',
};

// ── history ──

/**
 * Undo / redo of a document. Edits with the same `key` within `mergeMs` (typing in one field)
 * become one step.
 */
export class DocHistory<T> {
  private _past: T[] = [];
  private _future: T[] = [];
  private _lastKey?: string;
  private _lastAt = 0;

  constructor(
    public current: T,
    private readonly _mergeMs = 600,
    private readonly _limit = 100,
  ) {}

  /** Record `next` as the new current state. */
  push(next: T, key?: string, now = Date.now()): void {
    const merge = key !== undefined && key === this._lastKey && now - this._lastAt < this._mergeMs && this._past.length > 0;
    if (!merge) {
      this._past.push(this.current);
      if (this._past.length > this._limit) this._past.shift();
    }
    this.current = next;
    this._future = [];
    this._lastKey = key;
    this._lastAt = now;
  }

  /** Change the current state without a new undo step (the moves of a drag after its first). */
  replace(next: T): void {
    this.current = next;
    this._future = [];
  }

  /** Drop the last undo step and go back to it, with no redo (a drag that ended where it started). */
  revert(): void {
    const prev = this._past.pop();
    if (prev === undefined) return;
    this.current = prev;
    this._lastKey = undefined;
  }

  canUndo(): boolean {
    return this._past.length > 0;
  }

  canRedo(): boolean {
    return this._future.length > 0;
  }

  undo(): T | undefined {
    const prev = this._past.pop();
    if (prev === undefined) return undefined;
    this._future.push(this.current);
    this.current = prev;
    this._lastKey = undefined;
    return prev;
  }

  redo(): T | undefined {
    const next = this._future.pop();
    if (next === undefined) return undefined;
    this._past.push(this.current);
    this.current = next;
    this._lastKey = undefined;
    return next;
  }

  /** Start over at `state` (a saved or newly opened document). */
  reset(state: T): void {
    this.current = state;
    this._past = [];
    this._future = [];
    this._lastKey = undefined;
  }
}

// ── ids and names ──

/** A slug for an id from a name or preset id (`Doorbell wiggle` -> `doorbell-wiggle`). */
export function slugify(s: string): string {
  const slug = s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return slug || 'animation';
}

/** `base`, or `base-2`, `base-3`... : the first id not in `taken`. */
export function uniqueId(base: string, taken: (id: string) => boolean): string {
  const root = slugify(base);
  if (!taken(root)) return root;
  for (let n = 2; ; n++) {
    const id = `${root.slice(0, 60)}-${n}`;
    if (!taken(id)) return id;
  }
}

/** `name`, or `name (copy)`, `name (copy 2)`... : a name not in `names`. */
export function copyName(name: string, names: Set<string>): string {
  const base = t('anim-studio.studio-model.name-copy', { name });
  if (!names.has(base)) return base.slice(0, ANIMATION_CAPS.name);
  for (let n = 2; ; n++) {
    const next = t('anim-studio.studio-model.name-copy-n', { name, n });
    if (!names.has(next)) return next.slice(0, ANIMATION_CAPS.name);
  }
}

/** Library search: name, id or kind, every word must match. */
export function filterDocs(docs: AnimationDoc[], query: string): AnimationDoc[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return docs;
  return docs.filter((d) => {
    const hay = fold(`${d.name} ${d.id} ${d.kind} ${t(KIND_LABEL[d.kind])}`);
    return words.every((w) => hay.includes(w));
  });
}

/** The custom documents a sequence plays (direct steps). */
export function stepRefs(doc: AnimationDoc): string[] {
  return (doc.steps ?? []).filter((s) => s.animation.startsWith(CUSTOM_PREFIX)).map((s) => s.animation.slice(CUSTOM_PREFIX.length));
}

/** Sequences in `docs` that play `id` as a step (deleting it leaves them a skipped step). */
export function sequencesUsing(id: string, docs: Iterable<AnimationDoc>): AnimationDoc[] {
  return [...docs].filter((d) => d.kind === 'sequence' && d.id !== id && stepRefs(d).includes(id));
}

// ── YAML ──

/** One document (or several) as YAML for sharing: a list, so imports can take any number. */
export function docsToYaml(docs: AnimationDoc[]): string {
  return toYaml(JSON.parse(JSON.stringify(docs)));
}

export interface ImportResult {
  docs: AnimationDoc[];
  errors: FieldError[];
  /** Ids that existed and got a new id. */
  renamed: Array<{ from: string; to: string }>;
}

/** Longest YAML an import reads (characters). */
export const IMPORT_MAX_CHARS = 1024 * 1024;

/**
 * Parse pasted / loaded YAML (or JSON): one document, a list, an id-keyed map, or a card config's
 * `custom_animations`. Valid documents come back with ids made unique against `taken` (and each
 * other); sequence steps follow a renamed id. Errors carry the item index in the path. At most
 * `room` documents come back (the space left in the library); the rest is an error.
 */
export function parseImport(text: string, taken: (id: string) => boolean, room: number = ANIMATION_CAPS.docs): ImportResult {
  if (text.length > IMPORT_MAX_CHARS) return { docs: [], errors: [{ path: '', message: t('anim-studio.studio-model.the-yaml-is-too-large-to-import-over-1') }], renamed: [] };
  const raw = fromYaml<unknown>(text);
  if (raw === null || raw === undefined || typeof raw !== 'object') {
    return { docs: [], errors: [{ path: '', message: text.trim() ? t('anim-studio.studio-model.not-valid-yaml') : t('anim-studio.studio-model.paste-or-load-some-yaml-first') }], renamed: [] };
  }
  let items: unknown[];
  const obj = raw as Record<string, unknown>;
  if (Array.isArray(raw)) items = raw;
  else if ('custom_animations' in obj) items = listOf(obj.custom_animations);
  else if ('kind' in obj || 'keyframes' in obj) items = [raw];
  else items = listOf(raw);
  if (!items.length) return { docs: [], errors: [{ path: '', message: t('anim-studio.studio-model.no-animations-found') }], renamed: [] };

  const errors: FieldError[] = [];
  const valid: AnimationDoc[] = [];
  items.forEach((item, i) => {
    const r = validateAnimationDoc(item);
    if (r.ok) valid.push(r.doc);
    else errors.push(...r.errors.map((e) => ({ path: `[${i}]${e.path ? `.${e.path}` : ''}`, message: validationText(e.message) })));
  });
  const fit = Math.max(0, room);
  if (valid.length > fit) {
    const cap = ANIMATION_CAPS.docs;
    errors.push({
      path: '',
      message: fit
        ? t('anim-studio.studio-model.the-library-holds-at-most-cap-animations', { cap, fit, skipped: valid.length - fit })
        : t('anim-studio.studio-model.the-library-is-full-cap-animations', { cap }),
    });
    valid.length = fit;
  }
  const used = new Set<string>();
  const map = new Map<string, string>();
  const renamed: ImportResult['renamed'] = [];
  for (const d of valid) {
    const to = taken(d.id) || used.has(d.id) ? uniqueId(d.id, (x) => taken(x) || used.has(x)) : d.id;
    used.add(to);
    map.set(d.id, to);
    if (to !== d.id) renamed.push({ from: d.id, to });
  }
  const docs = valid.map((d) => {
    const steps = d.steps?.map((s) => {
      const ref = s.animation.startsWith(CUSTOM_PREFIX) ? s.animation.slice(CUSTOM_PREFIX.length) : undefined;
      return ref && map.has(ref) ? { ...s, animation: CUSTOM_PREFIX + map.get(ref) } : s;
    });
    return { ...d, id: map.get(d.id)!, ...(steps ? { steps } : {}) };
  });
  return { docs, errors, renamed };
}

function listOf(v: unknown): unknown[] {
  if (Array.isArray(v)) return v;
  if (v && typeof v === 'object') {
    return Object.entries(v as Record<string, unknown>).map(([id, d]) => (d && typeof d === 'object' && !('id' in d) && ANIMATION_ID_RE.test(id) ? { id, ...d } : d));
  }
  return [];
}

// ── preview card ──

/** The stage plays the edited document under this id, so the saved version never shadows it. */
export const PREVIEW_ID = 'studio-preview';

export interface PreviewOptions {
  tile: PreviewTile;
  /** Thumbnail: a smaller tile. */
  thumb?: boolean;
  /** Reduced motion: the still state (the card plays nothing). */
  still?: boolean;
  /** Id the document plays under (default PREVIEW_ID; thumbnails use its own id). */
  as?: string;
  /** The entity driving the document's states and bindings (`entity:` on the entry; the stage's simulated one). */
  entity?: string;
}

/** A layer of its own (particles): it plays on the row, which gives it room. */
export const playsOnRow = (doc: AnimationDoc): boolean =>
  doc.kind === 'particles' || (doc.kind === 'path' && doc.path?.subject === 'particles') || (doc.kind === 'sequence' && !!doc.stagger?.children);

/**
 * The preview card for a document: one tile (three for a sequence across children) with the
 * document as `custom:<id>`, the document (and the custom ones it plays) inline, so the card needs
 * no library. Particles play on the row, the rest on the module.
 */
export function previewConfig(doc: AnimationDoc, lookup: (id: string) => AnimationDoc | undefined, opts: PreviewOptions): Record<string, unknown> {
  const id = opts.as ?? PREVIEW_ID;
  const own = { ...doc, id };
  const animations = opts.still ? [] : [{ id: 'preview', preset: CUSTOM_PREFIX + id, ...(opts.entity ? { entity: opts.entity } : {}) }];
  const onRow = playsOnRow(doc);
  const staggered = doc.kind === 'sequence' && !!doc.stagger?.children;
  const moduleAnims = !onRow && animations.length ? animations : undefined;
  const columns = (staggered ? ['a', 'b', 'c'] : ['a']).map((k) => ({
    id: `c${k}`,
    vertical_align: 'center',
    modules: [tileModule(opts.tile, `m${k}`, !!opts.thumb, moduleAnims)],
  }));
  const config = {
    type: 'custom:magic-card',
    rows: [
      {
        id: 'r',
        layout: staggered ? '1-1-1' : '1',
        columns,
        design: {
          // the icon tile is small: a short card, so the stage is not mostly empty card
          min_height: opts.thumb ? '112px' : opts.tile === 'icon' && !onRow ? '144px' : '240px',
          border_radius: '12px',
          ...(onRow && animations.length ? { animations } : {}),
        },
      },
    ],
  };
  const docs = new Map<string, AnimationDoc>([[id, own]]);
  const r = embedCustomAnimations(config, (x) => docs.get(x) ?? lookup(x));
  return r.config;
}

/**
 * The host's library (a list or an id-keyed map, as the panel passes it) as validated documents by
 * id; a map entry without an id takes its key.
 */
export function libraryDocs(input: unknown): Map<string, AnimationDoc> {
  if (!input || typeof input !== 'object') return new Map();
  const list = Array.isArray(input) ? input : listOf(input);
  const out = new Map<string, AnimationDoc>();
  for (const raw of list) {
    const r = validateAnimationDoc(raw);
    if (r.ok && !out.has(r.doc.id)) out.set(r.doc.id, r.doc);
  }
  return out;
}

// ── preset files (transfer chunk) ──

/**
 * The envelope items for `docs`. A sequence takes the custom documents its steps play along
 * (looked up in `library`, followed through nested sequences).
 */
export function exportItems(docs: AnimationDoc[], library: Map<string, AnimationDoc>): TransferItem<'animation'>[] {
  const out = new Map<string, AnimationDoc>();
  const add = (d: AnimationDoc): void => {
    if (out.has(d.id)) return;
    out.set(d.id, d);
    for (const ref of stepRefs(d)) {
      const dep = library.get(ref);
      if (dep) add(dep);
    }
  };
  docs.forEach(add);
  return [...out.values()].map((d) => {
    const { id, name, ...data } = JSON.parse(JSON.stringify(d)) as AnimationDoc;
    return { id, name, data };
  });
}

/** Documents from imported envelope items (ids already resolved); at most `room`, the rest is an error. */
export function importDocs(items: TransferItem<'animation'>[], room: number): { docs: AnimationDoc[]; errors: string[] } {
  const docs: AnimationDoc[] = [];
  const errors: string[] = [];
  for (const it of items) {
    const r = validateAnimationDoc({ ...it.data, id: it.id, name: it.name });
    if (!r.ok) errors.push(`${it.id}: ${r.errors[0] ? validationText(r.errors[0].message) : t('anim-studio.studio-model.not-valid')}`);
    else if (docs.length >= Math.max(0, room)) errors.push(t('anim-studio.studio-model.id-the-library-is-full', { id: it.id }));
    else docs.push(r.doc);
  }
  return { docs, errors };
}
