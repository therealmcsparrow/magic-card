import { LitElement, html, nothing, PropertyValues, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { ANIMATION_GROUPS, ANIMATION_PRESETS, EASINGS } from '../utils/animation-presets';
import type { AnimationDirection } from '../types';
import { docFromPreset, presetDocId } from './from-preset';
import { ANIMATION_CAPS, ANIMATION_KINDS, newAnimationDoc, validateAnimationDoc, type AnimationDoc, type AnimationKind, type FieldError } from './model';
import {
  DocHistory,
  KIND_ICON,
  KIND_LABEL,
  copyName,
  docsToYaml,
  filterDocs,
  libraryDocs,
  parseImport,
  sequencesUsing,
  uniqueId,
  type ImportResult,
} from './studio-model';
import type { AnimationStage } from './studio-stage';
import { studioStyles } from './studio-styles';
import { KIND_EDITORS, PATH_OVERLAY_TAG, editorDefined } from './editor-slots';
import { NO_SELECTION, PANELS, panelsFor, type PanelSpec, type PreviewChangeDetail, type StageInfo, type StudioSelection } from './slots';
import { TILES, type PreviewTile } from './tiles';
import type { TargetRef } from './model';
import { TIMELINE_NARROW, laneTimes, targetIcon, targetLabel, timelineTracks, tkeyExists, usedLanes } from './editors/keyframes-utils';
import { docSizeError } from './editors/draw-utils';

/*
 * The animation studio: `<magic-card-animation-studio>`, a full-screen surface with the library
 * (search, new, customise a preset, duplicate, rename, delete, export / import YAML) and the editor
 * (live preview stage, timing form, undo / redo, dirty guard). The host (the magic-card-utils
 * panel) does the storage; the studio only emits events:
 *
 *   mc-anim-save       { animation }         create or update
 *   mc-anim-duplicate  { animation }         the copy, with its new id
 *   mc-anim-delete     { id }
 *   mc-anim-select     { id | null }         the open animation (deep links: ?animation=<id>)
 *
 * All bubble and are composed. `detail` is mutable: a host that stores sets `detail.result` to its
 * promise during dispatch; the studio awaits it (resolving to `{ animation }`, the stored document)
 * and shows a rejection's `message` and field `errors: [{ path, message }]`. A host may also resolve
 * to the stored document itself. With `standalone` (the dev harness) the studio applies the change
 * to its own in-memory library; otherwise no result means nothing stored it: an error.
 *
 * Unsaved edits survive the studio leaving the page (in-HA navigation, reload): kept in
 * sessionStorage per animation id (one key for an unsaved new one), offered back on the next open.
 */

type Dialog =
  | { type: 'delete'; doc: AnimationDoc; uses: number | undefined; sequences: AnimationDoc[] }
  | { type: 'discard'; then: () => void }
  | { type: 'export'; title: string; yaml: string; file: string }
  | { type: 'import' }
  | { type: 'presets' }
  | { type: 'icon' }
  | { type: 'restore'; draft: AnimationDoc; isNew: boolean };

/** sessionStorage key of a document's unsaved draft; no id: the unsaved new document. */
const draftKey = (id?: string): string => (id ? `mc-anim-draft:${id}` : 'mc-anim-draft-new');
/** Drafts over this size (JSON characters) are not kept. */
const DRAFT_MAX = 64 * 1024;

function readDraft(key: string): AnimationDoc | undefined {
  try {
    const d = JSON.parse(sessionStorage.getItem(key) ?? 'null') as AnimationDoc | null;
    return d && typeof d === 'object' && typeof d.id === 'string' && typeof d.name === 'string' && ANIMATION_KINDS.includes(d.kind) ? d : undefined;
  } catch {
    return undefined;
  }
}

/** Keep `doc` as the draft under `key`; no doc (or too big): forget it. */
function writeDraft(key: string, doc?: AnimationDoc): void {
  try {
    const text = doc ? JSON.stringify(doc) : '';
    if (text && text.length <= DRAFT_MAX) sessionStorage.setItem(key, text);
    else sessionStorage.removeItem(key);
  } catch {
    // storage blocked or full: nothing kept
  }
}

const DIRECTIONS: Array<{ value: AnimationDirection; label: string }> = [
  { value: 'normal', label: 'Normal' },
  { value: 'reverse', label: 'Reverse' },
  { value: 'alternate', label: 'Alternate' },
  { value: 'alternate-reverse', label: 'Alternate reverse' },
];
/** Section icons of the inspector and layers panels (sections and rail buttons need one). */
const PANEL_ICON: Record<string, string> = {
  'mc-anim-states-panel': 'mdi:state-machine',
  'mc-anim-key-inspector': 'mdi:key-variant',
  'mc-anim-part-inspector': 'mdi:vector-square',
  'mc-anim-shape-inspector': 'mdi:draw',
  'mc-anim-bindings-panel': 'mdi:link-variant',
  'mc-anim-targets-layers': 'mdi:card-text-outline',
  'mc-anim-parts-layers': 'mdi:vector-square',
  'mc-anim-shapes-layers': 'mdi:shape-outline',
  'mc-anim-part-presets': 'mdi:auto-fix',
};
/** The icon animation start (icon picker and icon library; editors/icon-start.ts). */
const ICON_START = 'mc-anim-icon-start';
/** The layers panel that splits the icon (also offered in the Icon target's inspector). */
const PARTS_LAYERS = 'mc-anim-parts-layers';
/** Panels that show the playhead (they get .time; the others never re-render while it plays). */
const TIME_TAGS = new Set(['mc-anim-keyframes-editor', 'mc-anim-sequence-editor', PATH_OVERLAY_TAG]);

/** What the preview's animation colour is (no entity there: the theme accent, like a card). */
const ENTITY_COLOR = 'var(--primary-color, #03a9f4)';
const REPEATS = ['infinite', '1', '2', '3', '5'];
const ORIGINS = ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'];
const NEW_NAMES: Record<AnimationKind, string> = {
  keyframes: 'New keyframes',
  particles: 'New particles',
  path: 'New path',
  sequence: 'New sequence',
};
const NEW_HELP: Record<AnimationKind, string> = {
  keyframes: 'Move, scale, turn and colour on a timeline',
  particles: 'Icons, emoji or shapes that fall, rise or burst',
  path: 'Follow a drawn path',
  sequence: 'Play animations one after another',
};

/** Fields the form shows; their errors appear under them, the rest in the summary. */
const FORM_FIELDS = ['name', 'duration', 'easing', 'iterations', 'direction', 'target', 'origin'];

function isTyping(e: Event): boolean {
  const t = e.composedPath()[0];
  if (!(t instanceof HTMLElement)) return false;
  return /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable;
}

const NOT_CONNECTED = { message: 'The animation library is not connected.' };

const errorText = (err: unknown): { message: string; errors: FieldError[] } => {
  const e = (err ?? {}) as { message?: unknown; errors?: unknown };
  const errors = Array.isArray(e.errors) ? (e.errors as FieldError[]).filter((x) => x && typeof x.message === 'string') : [];
  return {
    message: typeof e.message === 'string' && e.message ? e.message : 'Saving failed.',
    errors,
  };
};

// ── layout v2: remembered in localStorage ──

/** Stage share of the centre column (0-1). */
export const SPLIT_KEY = 'mcas-split';
/** Collapsed inspector sections (JSON list of ids). */
export const SECTIONS_KEY = 'mcas-sections';
/** The layers column: 'rail' or 'open' (unset: rail below RAIL_BELOW). */
export const LAYERS_KEY = 'mcas-layers';
export const SPLIT_DEFAULT = 0.4;
/** The stage and the timeline each keep at least this height (px). */
export const SPLIT_MIN_PX = 160;
/**
 * Below this width the layers column starts as a rail (unless the user opened it); below
 * COMPACT_BELOW the columns are narrower; below SLIDE_BELOW the inspector slides over.
 */
export const RAIL_BELOW = 1000;
export const COMPACT_BELOW = 1100;
export const SLIDE_BELOW = 900;

function readStore(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStore(key: string, value: string | undefined): void {
  try {
    if (value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // storage blocked: not remembered
  }
}
const clampSplit = (n: number): number => Math.min(0.8, Math.max(0.15, n));
function readSplit(): number {
  const n = Number(readStore(SPLIT_KEY));
  return readStore(SPLIT_KEY) !== null && Number.isFinite(n) && n > 0 ? clampSplit(n) : SPLIT_DEFAULT;
}
function readCollapsed(): Set<string> {
  try {
    const v = JSON.parse(readStore(SECTIONS_KEY) ?? '[]');
    return new Set(Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
  } catch {
    return new Set();
  }
}

/** A target's name (card parts by label, rig pieces by their rig name) and icon. */
export { targetLabel };

/** Timeline chrome (px): panel padding, toolbar, gap, ruler, footer, borders; then rows. */
const TL_CHROME = 146;
const TL_GROUP_ROW = 41;
const TL_LANE_ROW = 35;
const TL_EMPTY = 44;
/** A row of the narrow timeline's keyframe list (48 px and its border). */
const TL_LIST_ROW = 49;

/**
 * The stage share that gives the timeline the height of its lanes, for a centre column `h` px high.
 * `narrow`: the timeline shows its keyframe list (one target's group row and a row per keyframe).
 */
export function autoSplit(doc: AnimationDoc, h: number, narrow = false): number {
  const groups = timelineTracks(doc).filter((t) => t.main || t.keyframes.length);
  const lanes = groups.reduce((n, g) => n + usedLanes(g.keyframes).length, 0);
  const rows = Math.max(0, ...groups.map((g) => laneTimes(g.keyframes, '*').length));
  const want = narrow
    ? TL_CHROME + TL_GROUP_ROW + rows * TL_LIST_ROW + (rows ? 0 : TL_EMPTY)
    : TL_CHROME + groups.length * TL_GROUP_ROW + lanes * TL_LANE_ROW + (lanes ? 0 : TL_EMPTY);
  const tl = Math.max(SPLIT_MIN_PX, Math.min(0.6 * h, want));
  return Math.round(clampSplit((h - 9 - tl) / h) * 1000) / 1000;
}

/** The document's own keyframes move a target (element or icon). */
const moves = (d: AnimationDoc): boolean => d.kind === 'keyframes' || d.kind === 'sequence';

/** What the inspector is about: the kind, plus the first key's target and lane, or the target. */
function selectionSubject(s: StudioSelection | undefined): string {
  if (!s) return 'none';
  const k = s.keys?.[0];
  return `${s.kind}|${s.kind === 'keys' ? `${k?.target}|${k?.lane}|${s.keys?.length === 1 ? 1 : 'n'}` : (s.target ?? s.tool ?? '')}`;
}

/** A selection-change detail is a usable StudioSelection. */
function isSelection(v: unknown): v is StudioSelection {
  const s = v as StudioSelection | undefined;
  return !!s && typeof s === 'object' && ['none', 'keys', 'target', 'tool'].includes(s.kind);
}

export class AnimationStudio extends LitElement {
  static styles = studioStyles;

  @property({ attribute: false }) hass?: Record<string, unknown>;
  /** The library: documents as a list or by id (the panel passes `{ [id]: doc }`). */
  @property({ attribute: false }) library?: unknown;
  /** The animation to open (deep link); null / '' for the library. */
  @property({ attribute: false }) selectedId?: string | null;
  /** Cards using each animation, by id; the column is hidden while undefined. */
  @property({ attribute: false }) usage?: Record<string, number>;
  /** No host: library changes stay in memory (the dev harness). */
  @property({ type: Boolean }) standalone = false;

  @state() private _docs = new Map<string, AnimationDoc>();
  @state() private _view: 'library' | 'editor' = 'library';
  @state() private _query = '';
  @state() private _kind: AnimationKind | 'all' = 'all';
  @state() private _menu = false;
  @state() private _renaming?: string;
  @state() private _dialog?: Dialog;
  @state() private _doc?: AnimationDoc;
  /** The stored version of the open document; null while it was never saved. */
  @state() private _saved: AnimationDoc | null = null;
  @state() private _errors: FieldError[] = [];
  @state() private _saveError = '';
  @state() private _busy = false;
  @state() private _status = '';
  @state() private _import?: ImportResult & { done?: string };
  @state() private _importText = '';
  @state() private _presetQuery = '';
  @state() private _customRepeat = false;
  /** What is selected in the editor (keys, a target, a stage tool): drives the inspector. */
  @state() private _selection: StudioSelection = NO_SELECTION;
  /** The stage's preview tile (panels get it as `.tile`). */
  @state() private _tile: PreviewTile = 'icon';
  /** The stage's share of the centre column (0-1). */
  @state() private _split = readSplit();
  /** The user's layers column choice; unset: a rail below RAIL_BELOW. */
  @state() private _layersPref = readStore(LAYERS_KEY) as 'rail' | 'open' | null;
  /** The studio's own width (rail and slide-over breakpoints). */
  @state() private _width = 0;
  @state() private _height = 0;
  /** The user set the split (dragged, keys, or remembered): no automatic split. */
  private _userSplit = readStore(SPLIT_KEY) !== null;
  /** Below SLIDE_BELOW: the inspector slide-over is open. */
  @state() private _inspOpen = false;
  /** Collapsed inspector sections. */
  @state() private _collapsed = readCollapsed();
  private _ro?: ResizeObserver;
  private _splitDrag?: { pointerId: number };
  /** A rail button opened the layers column: bring this panel's section into view. */
  private _revealPanel?: string;
  /** What `dirty` was last computed for (identity of the open and the stored document). */
  private _dirtyFor?: { doc: AnimationDoc; saved: AnimationDoc | null; value: boolean };
  /** The state before a drag's first transient change (a drag that ends there leaves no undo step). */
  private _gestureBase?: AnimationDoc;

  private _history = new DocHistory<AnimationDoc | undefined>(undefined);
  /** A deep link waiting for its document. */
  private _wantId?: string;
  private _focusSel?: string;
  /** The last input was a pointer: opening the editor does not move focus (no stray ring). */
  private _pointer = false;
  private _onPointer = (): void => {
    this._pointer = true;
  };

  // ── host data ──

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('library')) this._docs = libraryDocs(this.library);
    if (changed.has('library') || changed.has('_docs')) {
      this._lookup = (id: string) => this._docs.get(id);
      this._libraryObj = Object.fromEntries(this._docs);
    }
    if (changed.has('library')) {
      // the open, unchanged document follows the library (edited elsewhere)
      const fresh = this._doc && this._saved ? this._docs.get(this._saved.id) : undefined;
      if (fresh && !this.dirty && JSON.stringify(fresh) !== JSON.stringify(this._saved)) {
        this._saved = fresh;
        this._doc = fresh;
        this._playable = fresh;
        this._history.reset(fresh);
      }
    }
    if (changed.has('selectedId')) {
      const id = this.selectedId || undefined;
      if (!id) {
        if (this._view === 'editor' && !this.dirty && this._saved) this._closeEditor(false);
        this._wantId = undefined;
      } else if (this._doc?.id !== id) this._wantId = id;
    }
    if (this._wantId && this._docs.has(this._wantId)) {
      const doc = this._docs.get(this._wantId)!;
      this._wantId = undefined;
      if (!this.dirty) this._openDoc(doc, false, false);
    }
  }

  protected updated(changed: PropertyValues): void {
    // the automatic split: on open and resize; an edit only grows the timeline (no jumping stage)
    const prev = changed.get('_doc') as AnimationDoc | undefined;
    // (the layers column opening or closing changes the timeline's width: lanes or its keyframe list)
    if (changed.has('_height') || changed.has('_width') || changed.has('_layersPref') || changed.has('_view') || (changed.has('_doc') && prev?.id !== this._doc?.id)) this._autoSplit();
    else if (changed.has('_doc')) this._autoSplit(true);
    // the slide-over takes the focus when it opens (its scrim covers the rest)
    if (changed.has('_inspOpen') && this._inspOpen && this._slideOver) this._focusSel ??= 'aside.inspector';
    if (this._revealPanel) {
      const sec = this.shadowRoot?.querySelector<HTMLElement>(`.layer-group[data-panel="${this._revealPanel}"]`);
      this._revealPanel = undefined;
      sec?.scrollIntoView?.({ block: 'start' });
      sec?.focus({ preventScroll: true });
    }
    // the inspector shows something else: start at its top (its head in view); edits of the same
    // key or target keep the scroll
    if (changed.has('_selection') && selectionSubject(changed.get('_selection') as StudioSelection | undefined) !== selectionSubject(this._selection)) {
      const aside = this.shadowRoot?.querySelector<HTMLElement>('aside.inspector');
      if (aside) aside.scrollTop = 0;
    }
    if (this._focusSel) {
      const el = this.shadowRoot?.querySelector<HTMLElement>(this._focusSel);
      if (el) {
        el.focus();
        if (el instanceof HTMLInputElement) el.select();
      }
      this._focusSel = undefined;
    }
    const dlg = this.shadowRoot?.querySelector<HTMLDialogElement>('dialog.dlg');
    if (dlg && !dlg.open) dlg.showModal?.();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this._onKeydown);
    this.addEventListener('pointerdown', this._onPointer);
    window.addEventListener('beforeunload', this._onBeforeUnload);
    // a new animation left unsaved last time (a known one is offered when it opens)
    const draft = this._doc || this._dialog ? undefined : readDraft(draftKey());
    if (draft) this._dialog = { type: 'restore', draft, isNew: true };
    // kind editors and panels defined later (their own files) replace the placeholders
    for (const tag of [...Object.values(KIND_EDITORS).map((x) => x.tag), PATH_OVERLAY_TAG, ...PANELS.map((p) => p.tag)]) {
      if (!editorDefined(tag)) void customElements.whenDefined(tag).then(() => this.requestUpdate());
    }
    if (typeof ResizeObserver !== 'undefined' && !this._ro) {
      this._ro = new ResizeObserver((entries) => {
        const w = Math.round(entries[0]?.contentRect.width ?? 0);
        const h = Math.round(entries[0]?.contentRect.height ?? 0);
        if (w && w !== this._width) this._width = w;
        if (h && h !== this._height) this._height = h;
      });
      this._ro.observe(this);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('pointerdown', this._onPointer);
    window.removeEventListener('beforeunload', this._onBeforeUnload);
    this._ro?.disconnect();
    this._ro = undefined;
    this._keepDraft();
  }

  /** The open document's unsaved changes into sessionStorage (or forget them when there are none). */
  private _keepDraft(): void {
    // a draft still on offer stays as it is
    if (this._doc && this._dialog?.type !== 'restore') writeDraft(draftKey(this._saved?.id), this.dirty ? this._doc : undefined);
  }

  /** The open document differs from its stored version (a new one always does). */
  get dirty(): boolean {
    const doc = this._doc;
    if (!doc) return false;
    // compared once per document version (not per render: the playhead re-renders the shell)
    const m = this._dirtyFor;
    if (m && m.doc === doc && m.saved === this._saved) return m.value;
    const value = !this._saved || JSON.stringify(doc) !== JSON.stringify(this._saved);
    this._dirtyFor = { doc, saved: this._saved, value };
    return value;
  }

  get docs(): AnimationDoc[] {
    return [...this._docs.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Documents by id for previews (a new function per library change, so previews refresh). */
  private _lookup = (id: string): AnimationDoc | undefined => this._docs.get(id);

  private _onBeforeUnload = (e: BeforeUnloadEvent): void => {
    this._keepDraft();
    if (!this.dirty) return;
    e.preventDefault();
    e.returnValue = '';
  };

  // ── events ──

  /**
   * Dispatch `name` with a mutable detail; resolve with the host's result (`detail.result`). Rejects
   * with the host's error, or (a change, not standalone) when no host set a result.
   */
  private async _emit<T>(name: string, detail: Record<string, unknown>, change = true): Promise<T | undefined> {
    const d: Record<string, unknown> = { ...detail };
    this.dispatchEvent(new CustomEvent(name, { detail: d, bubbles: true, composed: true }));
    if (d.result) return (await d.result) as T;
    if (change && !this.standalone) throw NOT_CONNECTED;
    return undefined;
  }

  private _store(doc: AnimationDoc): void {
    const next = new Map(this._docs);
    next.set(doc.id, doc);
    this._docs = next;
  }

  private _toastTimer?: ReturnType<typeof setTimeout>;

  /** A polite announcement, also shown as a toast for a few seconds. */
  private _say(msg: string): void {
    // re-announce the same text
    this._status = '';
    void this.updateComplete.then(() => (this._status = msg));
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => (this._status = ''), 4000);
  }

  /** The stored document from a host result, else `doc`. */
  private _stored(res: unknown, doc: AnimationDoc): AnimationDoc {
    // `{ animation }`, or the document itself (the magic-card-utils panel)
    const raw = (res as { animation?: unknown } | undefined)?.animation ?? res;
    const r = raw ? validateAnimationDoc(raw) : undefined;
    return r?.ok ? r.doc : doc;
  }

  private _select(id: string | null): void {
    void this._emit('mc-anim-select', { id }, false);
  }

  // ── library actions ──

  private _taken = (id: string): boolean => this._docs.has(id) || this._doc?.id === id;

  private _new(kind: AnimationKind): void {
    this._menu = false;
    const names = new Set(this.docs.map((d) => d.name));
    let name = NEW_NAMES[kind];
    for (let n = 2; names.has(name); n++) name = `${NEW_NAMES[kind]} ${n}`;
    this._guard(() => this._openDoc(newAnimationDoc(kind, uniqueId(name, this._taken), name), true));
  }

  /** Open the icon animation start (pick an icon or a library entry). */
  private _openIconStart(): void {
    this._menu = false;
    this._dialog = { type: 'icon' };
  }

  /** A new icon animation from the start dialog: unique id and name; a fresh split selects its first part. */
  private _startIcon(e: Event): void {
    e.stopPropagation();
    const { doc, from } = ((e as CustomEvent).detail ?? {}) as { doc?: AnimationDoc; from?: string };
    if (!doc) return;
    this._dialog = undefined;
    const names = new Set(this.docs.map((d) => d.name));
    let name = doc.name;
    for (let n = 2; names.has(name); n++) name = `${doc.name} ${n}`;
    const next: AnimationDoc = { ...doc, id: uniqueId(doc.id, this._taken), name };
    this._guard(() => {
      this._openDoc(next, true);
      const first = next.rig?.parts[0]?.id;
      if (from === 'icon' && first) this._selection = { kind: 'target', target: `part:${first}`, targets: [`part:${first}`] };
    });
  }

  private _customise(presetId: string): void {
    const doc = docFromPreset(presetId, uniqueId(presetDocId(presetId), this._taken));
    if (!doc) return;
    this._dialog = undefined;
    this._guard(() => this._openDoc(doc, true));
  }

  private async _duplicate(doc: AnimationDoc): Promise<void> {
    const copy: AnimationDoc = {
      ...structuredClone(doc),
      id: uniqueId(`${doc.id}-copy`, this._taken),
      name: copyName(doc.name, new Set(this.docs.map((d) => d.name))),
    };
    try {
      const res = await this._emit('mc-anim-duplicate', { animation: copy });
      this._store(this._stored(res, copy));
      this._say(`Duplicated as "${copy.name}".`);
    } catch (err) {
      this._say(`Duplicating failed: ${errorText(err).message}`);
    }
  }

  private async _rename(doc: AnimationDoc, name: string): Promise<void> {
    // Enter commits, then the input's blur would again: once
    if (this._renaming !== doc.id) return;
    this._renaming = undefined;
    const clean = name.trim();
    if (!clean || clean === doc.name) return;
    const next = { ...doc, name: clean };
    const v = validateAnimationDoc(next);
    if (!v.ok) {
      this._say(`Not renamed: ${v.errors[0].message}`);
      return;
    }
    try {
      const res = await this._emit('mc-anim-save', { animation: v.doc });
      this._store(this._stored(res, v.doc));
      this._say(`Renamed to "${clean}".`);
    } catch (err) {
      this._say(`Renaming failed: ${errorText(err).message}`);
    }
  }

  /** Delete: asks first when cards or sequences use it, or when the use is unknown. */
  private _askDelete(doc: AnimationDoc): void {
    const uses = this.usage ? (this.usage[doc.id] ?? 0) : undefined;
    const sequences = sequencesUsing(doc.id, this._docs.values());
    if (uses === 0 && !sequences.length) void this._delete(doc);
    else this._dialog = { type: 'delete', doc, uses, sequences };
  }

  private async _delete(doc: AnimationDoc): Promise<void> {
    this._dialog = undefined;
    try {
      await this._emit('mc-anim-delete', { id: doc.id });
      const next = new Map(this._docs);
      next.delete(doc.id);
      this._docs = next;
      this._say(`Deleted "${doc.name}".`);
    } catch (err) {
      this._say(`Deleting failed: ${errorText(err).message}`);
    }
  }

  private _export(docs: AnimationDoc[], title: string, file: string): void {
    this._dialog = { type: 'export', title, yaml: docsToYaml(docs), file };
  }

  private async _copy(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this._say('YAML copied.');
    } catch {
      this._say('Copying failed: the browser blocked the clipboard.');
    }
  }

  private _download(text: string, file: string): void {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/yaml' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = file;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  private async _loadFile(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0];
    if (!f) return;
    this._importText = await f.text();
    this._import = undefined;
    input.value = '';
  }

  private async _runImport(): Promise<void> {
    const r = parseImport(this._importText, this._taken, ANIMATION_CAPS.docs - this._docs.size);
    this._import = r;
    if (!r.docs.length) return;
    let ok = 0;
    const failed: FieldError[] = [];
    for (const d of r.docs) {
      try {
        const res = await this._emit('mc-anim-save', { animation: d });
        this._store(this._stored(res, d));
        ok++;
      } catch (err) {
        const t = errorText(err);
        failed.push(...(t.errors.length ? t.errors.map((x) => ({ path: `${d.id}.${x.path}`, message: x.message })) : [{ path: d.id, message: t.message }]));
      }
    }
    const renamed = r.renamed.length ? ` Renamed (id taken): ${r.renamed.map((x) => `${x.from} → ${x.to}`).join(', ')}.` : '';
    this._import = {
      ...r,
      errors: [...r.errors, ...failed],
      done: `Imported ${ok} animation${ok === 1 ? '' : 's'}.${renamed}`,
    };
    this._say(this._import.done!);
    if (ok) this._importText = '';
  }

  // ── editor ──

  /** Run `then` now, or after the user discards / saves the open changes. */
  private _guard(then: () => void): void {
    if (this._view === 'editor' && this.dirty) this._dialog = { type: 'discard', then };
    else then();
  }

  private _openDoc(doc: AnimationDoc, isNew: boolean, announce = true): void {
    this._doc = doc;
    this._saved = isNew ? null : doc;
    this._history.reset(doc);
    this._errors = [];
    this._saveError = '';
    this._customRepeat = false;
    this._playable = doc;
    this._endGesture();
    this._time = 0;
    this._selection = NO_SELECTION;
    this._preview = undefined;
    this._inspOpen = false;
    this._view = 'editor';
    if (!this._pointer) this._focusSel = '.back';
    if (announce && !isNew) this._select(doc.id);
    // changes to it that were not saved last time
    const draft = isNew ? undefined : readDraft(draftKey(doc.id));
    if (draft && JSON.stringify(draft) !== JSON.stringify(doc)) this._dialog = { type: 'restore', draft, isNew: false };
    else if (draft) writeDraft(draftKey(doc.id));
  }

  /** Take back a kept draft: a new one opens as new, a known one becomes an undoable edit. */
  private _restoreDraft(draft: AnimationDoc, isNew: boolean): void {
    this._dialog = undefined;
    if (isNew) this._openDoc(this._taken(draft.id) ? { ...draft, id: uniqueId(draft.id, this._taken) } : draft, true);
    else if (this._doc?.id === draft.id) this._apply(draft);
  }

  private _closeEditor(announce = true): void {
    const had = !!this._doc;
    this._view = 'library';
    this._doc = undefined;
    this._selection = NO_SELECTION;
    this._preview = undefined;
    this._saved = null;
    this._history.reset(undefined);
    this._errors = [];
    this._saveError = '';
    if (announce && had) this._select(null);
  }

  private _back(): void {
    this._guard(() => this._closeEditor());
  }

  /** One edit of the open document (`key`: typing in one field merges into one undo step). */
  private _set(patch: Partial<AnimationDoc>, key: string): void {
    if (!this._doc) return;
    const next = { ...this._doc, ...patch } as Record<string, unknown>;
    for (const [k, v] of Object.entries(patch)) if (v === undefined) delete next[k];
    this._apply(next as unknown as AnimationDoc, key);
  }

  private _apply(doc: AnimationDoc, key?: string): void {
    this._endGesture();
    this._history.push(doc, key);
    this._doc = doc;
    this._check();
    this._pruneSelection();
  }

  /** Forget a drag in progress (undo, redo or another edit took over). */
  private _endGesture(): void {
    this._gesture = false;
    this._gestureBase = undefined;
  }

  /** The stage's scrub position (0-1), for the editors' playheads. */
  @state() private _time = 0;
  /** The preview card's size (the path overlay covers it). */
  @state() private _stageRect?: { width: number; height: number };
  /** The moving element's box at rest within the preview card (the path overlay's subject). */
  @state() private _subjectRect?: { x: number; y: number; width: number; height: number };
  /** The stage geometry for panels (`.stage`). */
  @state() private _stageInfo?: StageInfo;
  /** The preview's simulated entity (a panel's preview-change), kept until changed. */
  @state() private _preview?: PreviewChangeDetail;
  /** The library by id, for the editors (sequence steps, pickers). */
  private _libraryObj: Record<string, AnimationDoc> = {};
  /** A drag in a kind editor is going on (transient doc-change events). */
  private _gesture = false;

  /** The last valid state of the open document: what the stage plays while a field is invalid. */
  @state() private _playable?: AnimationDoc;

  private _check(): void {
    const r = this._doc ? validateAnimationDoc(this._doc) : undefined;
    this._errors = r && !r.ok ? r.errors : [];
    if (r?.ok) this._playable = r.doc;
  }

  undo(): void {
    this._endGesture();
    const d = this._history.undo();
    if (d) {
      this._doc = d;
      this._check();
      this._pruneSelection();
    }
  }

  redo(): void {
    this._endGesture();
    const d = this._history.redo();
    if (d) {
      this._doc = d;
      this._check();
      this._pruneSelection();
    }
  }

  /** The selection without keys and targets the document no longer has (none left: nothing selected). */
  private _pruneSelection(): void {
    const d = this._doc;
    const sel = this._selection;
    if (!d || sel.kind === 'none') return;
    const has = (t: TargetRef): boolean => {
      const m = /^(part|group|shape):(.+)$/.exec(t);
      if (!m) return true;
      const list = m[1] === 'part' ? d.rig?.parts : m[1] === 'group' ? d.rig?.groups : d.rig?.shapes;
      return !!list?.some((x) => x.id === m[2]);
    };
    if (sel.kind === 'tool') {
      // a tool keeps working without the part or shape it was on
      if (sel.target && !has(sel.target)) this._selection = { kind: 'tool', tool: sel.tool };
      return;
    }
    if (sel.kind === 'keys') {
      const keys = (sel.keys ?? []).filter((k) => tkeyExists(d, { target: k.target, lane: k.lane as never, at: k.at }));
      if (keys.length === (sel.keys ?? []).length) return;
      if (!keys.length) {
        this._selection = NO_SELECTION;
        return;
      }
      const targets = [...new Set(keys.map((k) => k.target))];
      this._selection = { kind: 'keys', keys, targets, target: sel.target && targets.includes(sel.target) ? sel.target : keys[keys.length - 1].target };
      return;
    }
    const targets = (sel.targets ?? (sel.target ? [sel.target] : [])).filter(has);
    if (!targets.length) this._selection = NO_SELECTION;
    else if (targets.length !== (sel.targets?.length ?? 1) || !sel.target || !has(sel.target))
      this._selection = { kind: 'target', target: sel.target && has(sel.target) ? sel.target : targets[0], targets };
  }

  async save(): Promise<boolean> {
    if (!this._doc || this._busy) return false;
    const v = validateAnimationDoc(this._doc);
    if (!v.ok) {
      this._errors = v.errors;
      this._saveError = 'Fix the marked fields first.';
      return false;
    }
    this._busy = true;
    this._saveError = '';
    const sent = JSON.stringify(this._doc);
    try {
      const res = await this._emit('mc-anim-save', { animation: v.doc });
      const stored = this._stored(res, v.doc);
      const isNew = !this._saved;
      this._store(stored);
      this._saved = stored;
      writeDraft(draftKey(stored.id));
      if (isNew) writeDraft(draftKey());
      // the stored form (normalised): keep undo, but its current state is what was stored; edits
      // made while it was saving stay (and keep the document dirty)
      const now = JSON.stringify(this._doc);
      if (now === sent && JSON.stringify(stored) !== now) this._apply(stored);
      else this._check();
      this._say(`Saved "${stored.name}".`);
      if (isNew) this._select(stored.id);
      return true;
    } catch (err) {
      const t = errorText(err);
      this._errors = t.errors;
      this._saveError = t.message;
      return false;
    } finally {
      this._busy = false;
    }
  }

  private _stage(): AnimationStage | null {
    return this.shadowRoot?.querySelector('mcas-stage') ?? null;
  }

  private _onKeydown = (e: KeyboardEvent): void => {
    this._pointer = false;
    if (e.defaultPrevented || this._dialog) return;
    const key = e.key.toLowerCase();
    const mod = (e.ctrlKey || e.metaKey) && !e.altKey;
    if (this._view === 'editor') {
      if (mod && key === 's') {
        e.preventDefault();
        void this.save();
        return;
      }
      if (mod && (key === 'z' || key === 'y')) {
        if (isTyping(e)) return;
        e.preventDefault();
        if (key === 'y' || e.shiftKey) this.redo();
        else this.undo();
        return;
      }
      if (e.key === ' ' && !mod && !isTyping(e)) {
        const t = e.composedPath()[0];
        if (t instanceof HTMLElement && /^(BUTTON|A)$/.test(t.tagName)) return;
        e.preventDefault();
        this._stage()?.togglePlay();
        return;
      }
      if (e.key === 'Escape' && !isTyping(e)) {
        if (this._inspOpen && this._slideOver) {
          e.preventDefault();
          this._inspOpen = false;
          this._focusSel = '.insp-toggle';
        } else if (this._selection.kind !== 'none') {
          e.preventDefault();
          // focus inside the inspector would be lost with its panel: it goes to the inspector itself
          const aside = this.shadowRoot?.querySelector('aside.inspector');
          const active = this.shadowRoot?.activeElement;
          const inAside = !!aside && !!active && (aside === active || aside.contains(active));
          this._setSelection(NO_SELECTION);
          if (inAside || !active) this._focusSel = 'aside.inspector';
        }
      }
      return;
    }
    if (e.key === '/' && !mod && !isTyping(e)) {
      e.preventDefault();
      this.shadowRoot?.querySelector<HTMLInputElement>('.search input')?.focus();
    } else if (e.key === 'Escape' && this._menu) {
      e.preventDefault();
      this._menu = false;
      this._focusSel = '.new-btn';
    }
  };

  // ── render: library ──

  private _renderNewMenu(): TemplateResult {
    const onKey = (e: KeyboardEvent) => {
      const items = [...(e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role="menuitem"]')];
      const i = items.indexOf(e.composedPath()[0] as HTMLElement);
      const next =
        e.key === 'ArrowDown'
          ? (i + 1) % items.length
          : e.key === 'ArrowUp'
            ? (i - 1 + items.length) % items.length
            : e.key === 'Home'
              ? 0
              : e.key === 'End'
                ? items.length - 1
                : -1;
      if (next >= 0) {
        e.preventDefault();
        items[next].focus();
      } else if (e.key === 'Escape' || e.key === 'Tab') {
        this._menu = false;
        if (e.key === 'Escape') {
          e.preventDefault();
          this._focusSel = '.new-btn';
        }
      }
    };
    return html`
      <div class="menu new-menu" role="menu" aria-label="New animation" @keydown=${onKey}>
        ${ANIMATION_KINDS.map(
          (k) =>
            html`<button type="button" role="menuitem" data-kind=${k} @click=${() => this._new(k)}>
              <ha-icon icon=${KIND_ICON[k]}></ha-icon>
              <span class="mi"><span class="mi-t">Blank ${KIND_LABEL[k].toLowerCase()}</span><span class="mi-s">${NEW_HELP[k]}</span></span>
            </button>`,
        )}
        <hr />
        <button
          type="button"
          role="menuitem"
          data-kind="preset"
          @click=${() => {
            this._menu = false;
            this._presetQuery = '';
            this._dialog = { type: 'presets' };
          }}
        >
          <ha-icon icon="mdi:auto-fix"></ha-icon>
          <span class="mi"
            ><span class="mi-t">Customise a preset…</span><span class="mi-s">Start from one of the ${ANIMATION_PRESETS.length} presets</span></span
          >
        </button>
        <button type="button" role="menuitem" data-kind="icon" @click=${() => this._openIconStart()}>
          <ha-icon icon="mdi:motion-play-outline"></ha-icon>
          <span class="mi"><span class="mi-t">Icon animation…</span><span class="mi-s">Split an icon into parts, or start from the icon library</span></span>
        </button>
      </div>
    `;
  }

  private _renderNewButton(): TemplateResult {
    return html`<div class="menu-anchor">
      <button
        type="button"
        class="btn btn-primary btn-sm new-btn"
        aria-haspopup="menu"
        aria-expanded=${this._menu ? 'true' : 'false'}
        @click=${() => {
          this._menu = !this._menu;
          if (this._menu) this._focusSel = '.new-menu [role="menuitem"]';
        }}
      >
        <ha-icon icon="mdi:plus"></ha-icon>New animation<ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${
        this._menu
          ? html`<div class="scrim" @click=${() => (this._menu = false)}></div>
              ${this._renderNewMenu()}`
          : nothing
      }
    </div>`;
  }

  private _usedBy(id: string): TemplateResult | typeof nothing {
    if (!this.usage) return nothing;
    const n = this.usage[id] ?? 0;
    return html`<span class="used ${n ? '' : 'none'}">${n ? `Used by ${n} card${n === 1 ? '' : 's'}` : 'Not used'}</span>`;
  }

  private _renderRow(d: AnimationDoc): TemplateResult {
    const renaming = this._renaming === d.id;
    const commit = (e: Event) => void this._rename(d, (e.target as HTMLInputElement).value);
    return html`
      <li class="lib-row" data-id=${d.id}>
        <mcas-thumb .doc=${d} .lookup=${this._lookup} .hass=${this.hass}></mcas-thumb>
        ${
          renaming
            ? html`<div class="name-cell">
                <input
                  class="input rename"
                  aria-label="Name of ${d.name}"
                  maxlength="80"
                  .value=${d.name}
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === 'Enter') commit(e);
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      e.stopPropagation();
                      this._renaming = undefined;
                      this._focusSel = `.lib-row[data-id="${d.id}"] .rename-btn`;
                    }
                  }}
                  @blur=${commit}
                />
              </div>`
            : html`<button type="button" class="open name-cell" @click=${() => this._guard(() => this._openDoc(d, false))}>
                <span class="nm">${d.name}</span>
                <span class="id mono">custom:${d.id}</span>
              </button>`
        }
        <span class="chip kind"><ha-icon icon=${KIND_ICON[d.kind]}></ha-icon>${KIND_LABEL[d.kind]}</span>
        ${this._usedBy(d.id)}
        <span class="acts">
          <button type="button" class="icon-btn sm" title="Duplicate" aria-label="Duplicate ${d.name}" @click=${() => this._duplicate(d)}>
            <ha-icon icon="mdi:content-copy"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm rename-btn"
            title="Rename"
            aria-label="Rename ${d.name}"
            @click=${() => {
              this._renaming = d.id;
              this._focusSel = '.rename';
            }}
          >
            <ha-icon icon="mdi:rename-outline"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm"
            title="Export YAML"
            aria-label="Export ${d.name} as YAML"
            @click=${() => this._export([d], `Export "${d.name}"`, `${d.id}.yaml`)}
          >
            <ha-icon icon="mdi:export-variant"></ha-icon>
          </button>
          <button type="button" class="icon-btn sm danger" title="Delete" aria-label="Delete ${d.name}" @click=${() => this._askDelete(d)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </span>
      </li>
    `;
  }

  private _renderEmpty(): TemplateResult {
    return html`<div class="empty lib-empty">
      <ha-icon icon="mdi:animation-play-outline"></ha-icon>
      <strong>No animations yet</strong>
      <p>Build one from scratch or customise one of the presets. Saved animations appear in every card's animation picker, under My animations.</p>
      <div class="starters">
        ${ANIMATION_KINDS.map(
          (k) =>
            html`<button type="button" class="starter" @click=${() => this._new(k)}>
              <ha-icon icon=${KIND_ICON[k]}></ha-icon><span class="mi-t">${KIND_LABEL[k]}</span><span class="mi-s">${NEW_HELP[k]}</span>
            </button>`,
        )}
        <button
          type="button"
          class="starter"
          @click=${() => {
            this._presetQuery = '';
            this._dialog = { type: 'presets' };
          }}
        >
          <ha-icon icon="mdi:auto-fix"></ha-icon><span class="mi-t">From a preset</span><span class="mi-s">Customise one of ${ANIMATION_PRESETS.length}</span>
        </button>
        <button type="button" class="starter" data-kind="icon" @click=${() => this._openIconStart()}>
          <ha-icon icon="mdi:motion-play-outline"></ha-icon><span class="mi-t">Icon animation</span><span class="mi-s">Animate an icon's parts</span>
        </button>
      </div>
    </div>`;
  }

  private _renderLibrary(): TemplateResult {
    const all = this.docs;
    const kinds: Array<{ id: AnimationKind | 'all'; label: string }> = [
      { id: 'all', label: 'All' },
      ...ANIMATION_KINDS.map((k) => ({ id: k, label: KIND_LABEL[k] })),
    ];
    const shown = filterDocs(all, this._query).filter((d) => this._kind === 'all' || d.kind === this._kind);
    const onKindKey = (e: KeyboardEvent) => {
      const i = kinds.findIndex((k) => k.id === this._kind);
      const map: Record<string, number> = {
        ArrowRight: (i + 1) % kinds.length,
        ArrowLeft: (i - 1 + kinds.length) % kinds.length,
        Home: 0,
        End: kinds.length - 1,
      };
      if (map[e.key] === undefined) return;
      e.preventDefault();
      this._kind = kinds[map[e.key]].id;
      this._focusSel = '.kinds [aria-checked="true"]';
    };
    return html`
      <header class="topbar">
        <div class="grp title">
          <ha-icon class="title-icon" icon="mdi:animation-play-outline"></ha-icon>
          <h1>Animation studio</h1>
          <span class="chip is-count">${all.length}</span>
        </div>
        <span class="spacer"></span>
        <div class="grp">
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            @click=${() => {
              this._importText = '';
              this._import = undefined;
              this._dialog = { type: 'import' };
            }}
          >
            <ha-icon icon="mdi:import"></ha-icon>Import
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            ?disabled=${!all.length}
            @click=${() => this._export(all, 'Export all animations', 'my-animations.yaml')}
          >
            <ha-icon icon="mdi:export-variant"></ha-icon>Export all
          </button>
          ${this._renderNewButton()}
        </div>
      </header>
      <main class="lib">
        <div class="lib-inner">
          ${
            all.length
              ? html`
                  <div class="lib-tools">
                    <div class="with-icon search">
                      <ha-icon icon="mdi:magnify"></ha-icon>
                      <input
                        class="input"
                        type="search"
                        placeholder="Search animations"
                        aria-label="Search animations"
                        aria-keyshortcuts="/"
                        .value=${live(this._query)}
                        @input=${(e: InputEvent) => (this._query = (e.target as HTMLInputElement).value)}
                      />
                    </div>
                    <div class="seg kinds" role="radiogroup" aria-label="Kind" @keydown=${onKindKey}>
                      ${kinds.map((k) => {
                        const on = k.id === this._kind;
                        return html`<button
                          type="button"
                          role="radio"
                          aria-checked=${on ? 'true' : 'false'}
                          tabindex=${on ? '0' : '-1'}
                          @click=${() => (this._kind = k.id)}
                        >
                          ${k.label}
                        </button>`;
                      })}
                    </div>
                  </div>
                  ${
                    shown.length
                      ? html`<ul class="lib-list ${this.usage ? 'has-usage' : ''}" aria-label="My animations">
                          ${shown.map((d) => this._renderRow(d))}
                        </ul>`
                      : html`<p class="no-results">No animations match${this._query ? html` "${this._query}"` : ''}.</p>`
                  }
                `
              : this._renderEmpty()
          }
        </div>
      </main>
    `;
  }

  // ── render: editor ──

  private _fieldErrors(path: string): TemplateResult | typeof nothing {
    const list = this._errors.filter((e) => e.path === path);
    return list.length ? html`${list.map((e) => html`<p class="help error" id="err-${path}">${e.message}</p>`)}` : nothing;
  }

  private _field(label: string, id: string, control: TemplateResult, path?: string, help?: string | TemplateResult): TemplateResult {
    return html`<div class="field">
      <div class="field-head"><label for=${id}>${label}</label></div>
      ${control} ${help ? html`<p class="help">${help}</p>` : nothing} ${path ? this._fieldErrors(path) : nothing}
    </div>`;
  }

  private _selectEl(id: string, value: string, options: Array<{ value: string; label: string }>, pick: (v: string) => void): TemplateResult {
    return html`<div class="select">
      <select class="input" id=${id} @change=${(e: Event) => pick((e.target as HTMLSelectElement).value)}>
        ${options.map((o) => html`<option value=${o.value} ?selected=${o.value === value}>${o.label}</option>`)}
      </select>
      <ha-icon icon="mdi:chevron-down"></ha-icon>
    </div>`;
  }

  // ── layout v2: sections, layers, inspector, splitter ──

  private get _rail(): boolean {
    return this._layersPref ? this._layersPref === 'rail' : this._width > 0 && this._width < RAIL_BELOW;
  }

  /** Narrower layers and inspector columns, so the timeline keeps its lanes (1000 to 1100 px). */
  private get _compact(): boolean {
    return this._width > 0 && this._width < COMPACT_BELOW && !this._slideOver;
  }

  /** A rail button: open the layers column at that panel's section. */
  private _openLayers(tag: string): void {
    this._layersPref = 'open';
    writeStore(LAYERS_KEY, 'open');
    this._revealPanel = tag;
  }

  private get _slideOver(): boolean {
    return this._width > 0 && this._width < SLIDE_BELOW;
  }

  private _toggleRail(): void {
    const next = this._rail ? 'open' : 'rail';
    this._layersPref = next;
    writeStore(LAYERS_KEY, next);
  }

  private _setSelection(sel: StudioSelection): void {
    this._selection = sel;
    // tablet portrait: only picked keys open the slide-over (tools and stage taps keep the stage in view)
    if (this._slideOver && sel.kind === 'keys') this._inspOpen = true;
  }

  private _onSelection = (e: Event): void => {
    e.stopPropagation();
    const sel = (e as CustomEvent).detail?.selection;
    if (isSelection(sel)) this._setSelection(sel);
  };

  private _toggleSection(id: string): void {
    const next = new Set(this._collapsed);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this._collapsed = next;
    writeStore(SECTIONS_KEY, JSON.stringify([...next]));
  }

  /** A collapsible inspector section (open state remembered per id; a section with errors stays open). */
  private _section(id: string, title: string, icon: string, body: TemplateResult, opts: { errors?: boolean; cls?: string } = {}): TemplateResult {
    const open = opts.errors || !this._collapsed.has(id);
    return html`<section class="sec ${opts.cls ?? ''}" data-sec=${id} aria-labelledby="sec-${id}">
      <h3 class="sec-title">
        <button
          type="button"
          class="sec-head"
          id="sec-${id}"
          aria-expanded=${open ? 'true' : 'false'}
          aria-controls="secb-${id}"
          @click=${() => this._toggleSection(id)}
        >
          <ha-icon icon=${icon}></ha-icon><span class="sec-name">${title}</span>
          ${opts.errors ? html`<span class="sec-err" title="Has errors"></span>` : nothing}
          <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
        </button>
      </h3>
      <div class="sec-body" id="secb-${id}" ?hidden=${!open}>${open ? body : nothing}</div>
    </section>`;
  }

  private _hasErrors(paths: string[]): boolean {
    return this._errors.some((e) => paths.includes(e.path));
  }

  private _renderErrors(): TemplateResult | typeof nothing {
    const other = this._errors.filter((e) => !FORM_FIELDS.includes(e.path));
    return this._saveError || other.length
      ? html`<div class="errors" role="alert">
          ${this._saveError ? html`<strong>${this._saveError}</strong>` : nothing}
          ${
            other.length
              ? html`<ul>
                  ${other.map((e) => html`<li><span class="mono">${e.path || 'animation'}</span> ${e.message}</li>`)}
                </ul>`
              : nothing
          }
        </div>`
      : nothing;
  }

  /** The animation settings (nothing selected): name, timing, what moves, in collapsible sections. */
  private _renderForm(d: AnimationDoc): TemplateResult {
    const easingOpts = EASINGS.map((e) => ({ value: e.id, label: e.label }));
    if (!EASINGS.some((e) => e.id === d.easing)) easingOpts.push({ value: d.easing, label: d.easing });
    const it = String(d.iterations);
    const custom = this._customRepeat || !REPEATS.includes(it);
    const repeatOpts = [...REPEATS.map((r) => ({ value: r, label: r === 'infinite' ? 'Infinite' : r })), { value: 'custom', label: 'Custom' }];
    const moves = d.kind === 'keyframes' || d.kind === 'sequence';
    const name = this._field(
      'Name',
      'f-name',
      html`<input
        class="input"
        id="f-name"
        maxlength="80"
        .value=${live(d.name)}
        aria-invalid=${this._errors.some((e) => e.path === 'name') ? 'true' : 'false'}
        @input=${(e: InputEvent) => this._set({ name: (e.target as HTMLInputElement).value }, 'name')}
      />`,
      'name',
      html`Cards use it as <span class="mono ref">custom:${d.id}</span>`,
    );
    const timing = html`
      ${
        d.kind === 'sequence'
          ? html`<p class="help">A sequence lasts as long as its steps. Cards can still scale it with their Duration.</p>`
          : this._field(
              'Duration',
              'f-duration',
              html`<div class="suffix">
                <input
                  class="input"
                  id="f-duration"
                  type="number"
                  inputmode="decimal"
                  min="0.05"
                  max="600"
                  step="any"
                  .value=${live(String(d.duration))}
                  @input=${(e: InputEvent) => {
                    const v = (e.target as HTMLInputElement).value;
                    if (v !== '' && Number.isFinite(Number(v))) this._set({ duration: Number(v) }, 'duration');
                  }}
                />
                <span aria-hidden="true">s</span>
              </div>`,
              'duration',
            )
      }
      <div class="two">
        ${this._field(
          'Easing',
          'f-easing',
          this._selectEl('f-easing', d.easing, easingOpts, (v) => this._set({ easing: v }, 'easing')),
          'easing',
        )}
        ${this._field(
          'Repeat',
          'f-repeat',
          this._selectEl('f-repeat', custom ? 'custom' : it, repeatOpts, (v) => {
            if (v === 'custom') {
              this._customRepeat = true;
              if (d.iterations === 'infinite') this._set({ iterations: 10 }, 'iterations');
              return;
            }
            this._customRepeat = false;
            this._set({ iterations: v === 'infinite' ? 'infinite' : Number(v) }, 'iterations');
          }),
          'iterations',
        )}
      </div>
      ${
        custom
          ? this._field(
              'Repeat count',
              'f-count',
              html`<input
                class="input"
                id="f-count"
                type="number"
                min="1"
                step="1"
                .value=${live(typeof d.iterations === 'number' ? String(d.iterations) : '')}
                @input=${(e: InputEvent) => {
                  const n = Number((e.target as HTMLInputElement).value);
                  if (Number.isFinite(n) && n > 0) this._set({ iterations: n }, 'count');
                }}
              />`,
            )
          : nothing
      }
      ${this._field(
        'Direction',
        'f-dir',
        this._selectEl('f-dir', d.direction ?? 'normal', DIRECTIONS, (v) =>
          this._set({ direction: v === 'normal' ? undefined : (v as AnimationDirection) }, 'direction'),
        ),
        'direction',
      )}
    `;
    return html`
      ${this._section('anim', 'Animation', KIND_ICON[d.kind], name, { errors: this._hasErrors(['name']) })}
      ${this._section('timing', 'Timing', 'mdi:timer-outline', timing, { errors: this._hasErrors(['duration', 'easing', 'iterations', 'direction']) })}
      ${moves ? this._section('moves', 'What moves', 'mdi:cursor-move', this._renderMoves(d), { errors: this._hasErrors(['target', 'origin']) }) : nothing}
    `;
  }

  /** Target (element / icon) and transform origin of the document's own keyframes. */
  private _renderMoves(d: AnimationDoc): TemplateResult {
    const originOpts = ORIGINS.map((o) => ({
      value: o,
      label: o.charAt(0).toUpperCase() + o.slice(1),
    }));
    if (!ORIGINS.includes(d.origin)) originOpts.push({ value: d.origin, label: d.origin });
    const target = d.target === 'icon' ? 'icon' : 'element';
    const onTargetKey = (e: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      this._set({ target: target === 'icon' ? 'element' : 'icon' }, 'target');
      this._focusSel = '.target [aria-checked="true"]';
    };
    return html`
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-target">Target</span></div>
        <div class="seg full target" role="radiogroup" aria-labelledby="l-target" @keydown=${onTargetKey}>
          ${(['element', 'icon'] as const).map((t) => {
            const on = t === target;
            return html`<button
              type="button"
              role="radio"
              aria-checked=${on ? 'true' : 'false'}
              tabindex=${on ? '0' : '-1'}
              @click=${() => this._set({ target: t }, 'target')}
            >
              ${t === 'element' ? 'Element' : 'Icon'}
            </button>`;
          })}
        </div>
        <p class="help">Icon moves only the module's icon. Cards can override it.</p>
        ${this._fieldErrors('target')}
      </div>
      ${
        d.kind === 'keyframes'
          ? this._field(
              'Origin',
              'f-origin',
              this._selectEl('f-origin', d.origin, originOpts, (v) => this._set({ origin: v }, 'origin')),
              'origin',
              'The point it scales and turns around.',
            )
          : nothing
      }
    `;
  }

  /** A kind editor, the path overlay or a registered panel by tag, wired to the shell (slots.ts). */
  private _editorEl(
    tag: string,
    d: AnimationDoc,
    extra: {
      slot?: string;
      cls?: string;
      panel?: boolean;
      stageRect?: { width: number; height: number };
      subjectRect?: { x: number; y: number; width: number; height: number };
    } = {},
  ): TemplateResult {
    const t = unsafeStatic(tag);
    // panels get the StudioSelection as .selection; the kind editors as .studioSelection (the
    // timeline's own .selection is its key id list)
    if (extra.panel) {
      return staticHtml`<${t}
        class=${extra.cls ?? 'panel'}
        slot=${extra.slot ?? nothing}
        .doc=${d}
        .hass=${this.hass}
        .library=${this._libraryObj}
        .time=${TIME_TAGS.has(tag) ? this._time : 0}
        .disabled=${this._busy}
        .selection=${this._selection}
        .tile=${this._tile}
        .stage=${this._stageInfo}
        .stageRect=${extra.stageRect}
        .subjectRect=${extra.subjectRect}
        .entityColor=${ENTITY_COLOR}
        @doc-change=${this._onDocChange}
        @seek=${this._onSeek}
        @selection-change=${this._onSelection}
      ></${t}>`;
    }
    return staticHtml`<${t}
      class=${extra.cls ?? 'kind-editor'}
      slot=${extra.slot ?? nothing}
      .doc=${d}
      .hass=${this.hass}
      .library=${this._libraryObj}
      .time=${TIME_TAGS.has(tag) ? this._time : 0}
      .disabled=${this._busy}
      .studioSelection=${this._selection}
      .tile=${this._tile}
      .stage=${this._stageInfo}
      .stageRect=${extra.stageRect}
      .subjectRect=${extra.subjectRect}
      .entityColor=${ENTITY_COLOR}
      @doc-change=${this._onDocChange}
      @seek=${this._onSeek}
      @selection-change=${this._onSelection}
    ></${t}>`;
  }

  /** Registered panels of a place, each once its element is defined. */
  private _panels(place: PanelSpec['place'], d: AnimationDoc, extra: Parameters<AnimationStudio['_editorEl']>[2] = {}): TemplateResult[] {
    return panelsFor(place, d, this._selection)
      .filter((p) => editorDefined(p.tag))
      .map((p) =>
        this._editorEl(p.tag, d, {
          cls: `panel panel-${p.place}`,
          panel: true,
          ...extra,
          // stage tools: over the card (overlay) or docked above / below it
          ...(p.place === 'stage-tool' && p.dock && p.dock !== 'overlay' ? { slot: p.dock } : {}),
        }),
      );
  }

  /** The kind's own editor (timeline, particle designer, path or sequence editor), or a placeholder. */
  private _renderKindSlot(d: AnimationDoc): TemplateResult {
    const slot = KIND_EDITORS[d.kind];
    const loaded = editorDefined(slot.tag);
    const body = loaded ? this._editorEl(slot.tag, d) : html`<p class="help">Loading the ${slot.title.toLowerCase()} editor…</p>`;
    if (slot.place === 'inspector') {
      return html`<div class="kind-slot place-inspector" data-kind=${d.kind}>${this._section(`kind-${d.kind}`, slot.title, KIND_ICON[d.kind], body)}</div>`;
    }
    return html`<section class="kind-slot place-panel" aria-label=${slot.title} data-kind=${d.kind}>${body} ${this._panels('timeline', d)}</section>`;
  }

  private _onDocChange = (e: Event): void => {
    e.stopPropagation();
    const { doc, label, transient } = ((e as CustomEvent).detail ?? {}) as {
      doc?: AnimationDoc;
      label?: string;
      transient?: boolean;
    };
    if (!doc || !this._doc) return;
    // one size check for every editor (drawing, splitting, the timeline): over 64 KB is not taken
    const big = docSizeError(doc);
    if (big) {
      if (!transient) {
        this._endGesture();
        this._say(`Not changed: ${big}`);
        // the editors go back to the document as it is
        this._doc = { ...this._doc };
      }
      return;
    }
    if (transient) {
      // a drag: its first move is one undo step, the next moves (and the release) update it
      if (this._gesture) this._history.replace(doc);
      else {
        this._gestureBase = this._doc;
        this._history.push(doc);
      }
      this._gesture = true;
    } else if (this._gesture) {
      // the release, or a cancel back to the start (which leaves no undo step behind)
      const base = this._gestureBase;
      if (base && (doc === base || JSON.stringify(doc) === JSON.stringify(base))) this._history.revert();
      else this._history.replace(doc);
      this._endGesture();
    } else this._history.push(doc, `editor:${label ?? ''}`);
    this._doc = doc;
    this._check();
    this._pruneSelection();
  };

  private _onStageRect = (e: Event): void => {
    const { width, height, subject } = (e as CustomEvent).detail ?? {};
    if (!Number.isFinite(width) || !Number.isFinite(height)) return;
    if (!this._stageRect || this._stageRect.width !== width || this._stageRect.height !== height) this._stageRect = { width, height };
    if (JSON.stringify(subject) !== JSON.stringify(this._subjectRect)) this._subjectRect = subject;
    const { scale, viewBox } = (e as CustomEvent).detail ?? {};
    const info: StageInfo = {
      rect: { width, height },
      scale: Number.isFinite(scale) && scale > 0 ? scale : 1,
      ...(subject ? { subject } : {}),
      ...(Array.isArray(viewBox) && viewBox.length === 4 ? { viewBox: viewBox as [number, number, number, number] } : {}),
    };
    if (JSON.stringify(info) !== JSON.stringify(this._stageInfo)) this._stageInfo = info;
  };

  /** A panel's simulated entity for the preview (state switcher, value slider). */
  private _onPreviewChange = (e: Event): void => {
    e.stopPropagation();
    const d = (e as CustomEvent).detail as PreviewChangeDetail | undefined;
    if (!d || typeof d !== 'object') return;
    // merged into the current simulation (a value alone keeps the state), like track E's applyPreviewChange
    const next: PreviewChangeDetail = { ...(this._preview ?? {}) };
    if (typeof d.state === 'string') next.state = d.state;
    if (typeof d.value === 'number' && Number.isFinite(d.value)) next.value = d.value;
    if (d.attributes && typeof d.attributes === 'object') next.attributes = { ...d.attributes };
    this._preview = Object.keys(next).length ? next : undefined;
  };

  private _onSeek = (e: Event): void => {
    e.stopPropagation();
    const time = Number((e as CustomEvent).detail?.time);
    const stage = this._stage();
    if (stage && Number.isFinite(time)) stage.seek(Math.min(1, Math.max(0, time)) * stage.cycle);
  };

  // ── splitter ──

  private _setSplit(n: number, persist: boolean): void {
    this._split = this._clampSplitPx(clampSplit(Math.round(n * 1000) / 1000));
    this._userSplit = true;
    if (persist) writeStore(SPLIT_KEY, String(this._split));
  }

  /** A split that keeps SPLIT_MIN_PX for the stage and the timeline (when the column is measured). */
  private _clampSplitPx(n: number): number {
    const h = this.shadowRoot?.querySelector<HTMLElement>('.center')?.getBoundingClientRect().height ?? 0;
    if (h <= 0) return n;
    const min = Math.min(0.45, SPLIT_MIN_PX / h);
    return Math.round(Math.min(1 - min, Math.max(min, n)) * 1000) / 1000;
  }

  /** The split for a pointer at clientY. */
  private _splitAt(clientY: number): number | undefined {
    const c = this.shadowRoot?.querySelector<HTMLElement>('.center')?.getBoundingClientRect();
    if (!c || c.height <= 0) return undefined;
    return (clientY - c.top) / c.height;
  }

  /** Back to the automatic split (the timeline sized to its lanes). */
  private _resetSplit(): void {
    writeStore(SPLIT_KEY, undefined);
    this._userSplit = false;
    this._split = SPLIT_DEFAULT;
    this._autoSplit();
  }

  /**
   * Without a split of the user's, the timeline is sized to its lanes (toolbar, ruler, a 41 px
   * summary row per target and 35 px per lane, footer), between SPLIT_MIN_PX and 60% of the column,
   * so a short animation leaves no empty lane area.
   */
  private _autoSplit(growOnly = false): void {
    const d = this._doc;
    if (this._userSplit || !d || this._view !== 'editor' || KIND_EDITORS[d.kind].place !== 'panel') return;
    const center = this.shadowRoot?.querySelector<HTMLElement>('.center');
    const h = center?.getBoundingClientRect().height ?? 0;
    if (h <= 0) return;
    // the timeline's own width decides between its lanes and its keyframe list
    const tl = this.shadowRoot?.querySelector<HTMLElement>('.kind-slot.place-panel .kind-editor');
    const w = tl?.getBoundingClientRect().width || center?.getBoundingClientRect().width || 0;
    const split = autoSplit(d, h, w > 0 && w < TIMELINE_NARROW);
    // growOnly: only a smaller stage share (a taller timeline) is taken
    if (growOnly ? split < this._split - 0.002 : Math.abs(split - this._split) > 0.002) this._split = split;
  }

  private _onSplitDown = (e: PointerEvent): void => {
    if (e.button !== 0) return;
    e.preventDefault();
    this._splitDrag = { pointerId: e.pointerId };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      /* synthetic events have no active pointer */
    }
  };

  private _onSplitMove = (e: PointerEvent): void => {
    if (!this._splitDrag || e.pointerId !== this._splitDrag.pointerId) return;
    const n = this._splitAt(e.clientY);
    if (n !== undefined) this._setSplit(n, false);
  };

  private _onSplitUp = (e: PointerEvent): void => {
    if (!this._splitDrag || e.pointerId !== this._splitDrag.pointerId) return;
    this._splitDrag = undefined;
    this._setSplit(this._split, true);
  };

  private _onSplitKey = (e: KeyboardEvent): void => {
    const step = e.shiftKey ? 0.1 : 0.05;
    const map: Record<string, number> = {
      ArrowUp: this._split - step,
      ArrowDown: this._split + step,
      Home: 0,
      End: 1,
    };
    if (map[e.key] === undefined) return;
    e.preventDefault();
    this._setSplit(map[e.key], true);
  };

  // ── layers ──

  /** The targets the shell lists when no layers panel is registered: Element, Icon and the document's tracks. */
  private _layerTargets(d: AnimationDoc): TargetRef[] {
    const out: TargetRef[] = ['element', 'icon'];
    for (const t of d.tracks ?? []) if (!out.includes(t.target)) out.push(t.target);
    return out;
  }

  private _renderLayerList(d: AnimationDoc, rail: boolean): TemplateResult {
    if (d.kind === 'particles') return rail ? html`` : html`<p class="help layers-note">Particles play on the whole element.</p>`;
    const tile = TILES.find((t) => t.id === this._tile);
    const sel = this._selection;
    const keyed = (t: TargetRef) =>
      t === d.target && d.kind === 'keyframes' ? (d.keyframes?.length ?? 0) : (d.tracks?.find((x) => x.target === t)?.keyframes.length ?? 0);
    return html`<ul class="layer-list" role="list">
      ${this._layerTargets(d).map((t) => {
        const on = (sel.kind === 'target' || sel.kind === 'keys') && (sel.target === t || !!sel.targets?.includes(t));
        const off = !!tile && t !== 'element' && !tile.targets.includes(t);
        const label = targetLabel(d, t);
        const n = keyed(t);
        const main = t === d.target;
        const title = `${label}${main ? ' (the animation moves it)' : ''}${off ? ` · not on the ${tile!.label.toLowerCase()} tile` : ''}`;
        return html`<li>
          <button
            type="button"
            class="layer ${off ? 'off' : ''}"
            data-target=${t}
            aria-pressed=${on ? 'true' : 'false'}
            aria-label=${rail ? title : nothing}
            title=${title}
            @click=${(e: MouseEvent) => this._pickLayer(t, e.ctrlKey || e.metaKey || e.shiftKey)}
          >
            <ha-icon icon=${targetIcon(t)}></ha-icon>
            ${
              rail
                ? nothing
                : html`<span class="layer-name">${label}</span> ${main && moves(d) ? html`<span class="chip is-accent layer-main">Moves</span>` : nothing}
                    ${n ? html`<span class="layer-count" title="${n} keyframe${n === 1 ? '' : 's'}">${n}</span>` : nothing}`
            }
          </button>
        </li>`;
      })}
    </ul>`;
  }

  /** Select a target (Ctrl, Cmd or Shift: add it to / take it from the selected targets; again: none). */
  private _pickLayer(t: TargetRef, add: boolean): void {
    const sel = this._selection;
    const cur = sel.kind === 'target' || sel.kind === 'keys' ? (sel.targets ?? (sel.target ? [sel.target] : [])) : [];
    if (!add) {
      const only = cur.length === 1 && cur[0] === t && sel.kind === 'target';
      this._setSelection(only ? NO_SELECTION : { kind: 'target', target: t, targets: [t] });
      return;
    }
    const has = cur.includes(t);
    const list = has ? cur.filter((x) => x !== t) : [...cur, t];
    if (!list.length) this._setSelection(NO_SELECTION);
    else
      this._setSelection({
        kind: 'target',
        target: has ? (sel.target && list.includes(sel.target) ? sel.target : list[0]) : t,
        targets: list,
      });
  }

  private _renderLayers(d: AnimationDoc): TemplateResult {
    const rail = this._rail;
    const specs = panelsFor('layers', d, this._selection).filter((p) => editorDefined(p.tag));
    // card parts, icon parts, shapes: each under its own heading, in registration order
    const panels = rail
      ? []
      : specs.map(
          (p) =>
            html`<section class="layer-group" data-panel=${p.tag} aria-label=${p.title} tabindex="-1">
              <h3 class="layer-head">${p.title}</h3>
              ${this._editorEl(p.tag, d, { cls: 'panel panel-layers', panel: true })}
            </section>`,
        );
    // the rail: the targets as icons, then a button per panel that opens the column at it
    const opens = rail && specs.length
      ? html`<ul class="layer-list rail-panels" role="list" aria-label="Open in the layers column">
          ${specs.map(
            (p) => html`<li>
              <button
                type="button"
                class="layer rail-open"
                data-open=${p.tag}
                aria-label="Open ${p.title}"
                title=${p.title}
                @click=${() => this._openLayers(p.tag)}
              >
                <ha-icon icon=${PANEL_ICON[p.tag] ?? 'mdi:layers-outline'}></ha-icon>
              </button>
            </li>`,
          )}
        </ul>`
      : nothing;
    return html`<nav class="layers ${rail ? 'rail' : ''}" aria-label="Layers">
      <div class="layers-head">
        ${rail ? nothing : html`<h2>Layers</h2>`}
        <button
          type="button"
          class="icon-btn sm rail-toggle"
          aria-expanded=${rail ? 'false' : 'true'}
          aria-label=${rail ? 'Expand layers' : 'Collapse layers'}
          title=${rail ? 'Expand layers' : 'Collapse layers'}
          @click=${() => this._toggleRail()}
        >
          <ha-icon icon=${rail ? 'mdi:chevron-double-right' : 'mdi:chevron-double-left'}></ha-icon>
        </button>
      </div>
      <div class="layers-body">${panels.length ? panels : html`${this._renderLayerList(d, rail)}${opens}`}</div>
    </nav>`;
  }

  // ── inspector ──

  /** The inspector's context line for a selection (what it shows), with the way back to the animation settings. */
  private _renderContext(d: AnimationDoc): TemplateResult {
    const sel = this._selection;
    const n = sel.keys?.length ?? 0;
    const what =
      sel.kind === 'keys'
        ? `${n} keyframe${n === 1 ? '' : 's'}${sel.target ? ` · ${targetLabel(d, sel.target)}` : ''}`
        : sel.kind === 'target' && sel.target
          ? (sel.targets?.length ?? 0) > 1
            ? `${sel.targets!.length} targets`
            : targetLabel(d, sel.target)
          : sel.kind === 'tool'
            ? `Tool: ${sel.tool ?? ''}`
            : '';
    return html`<div class="ctx">
      <button type="button" class="btn btn-text btn-sm ctx-back" title="Animation settings (Esc)" @click=${() => this._setSelection(NO_SELECTION)}>
        <ha-icon icon="mdi:arrow-left"></ha-icon>Animation
      </button>
      <span class="ctx-what">${what}</span>
    </div>`;
  }

  /** What the inspector shows for a selection no panel handles: the main target's settings, or a note. */
  private _renderFallback(d: AnimationDoc): TemplateResult {
    const sel = this._selection;
    if (sel.kind === 'target' && (sel.target === 'element' || sel.target === 'icon') && moves(d)) {
      const main = sel.target === d.target;
      return this._section(
        'target',
        targetLabel(d, sel.target),
        targetIcon(sel.target),
        html`<p class="help">
            ${main ? `The animation's keyframes move the ${sel.target === 'icon' ? "module's icon" : 'whole element'}.` : `The animation's keyframes move the ${d.target === 'icon' ? 'icon' : 'element'}.`}
          </p>
          ${
            main
              ? nothing
              : html`<button
                  type="button"
                  class="btn btn-secondary btn-sm make-main"
                  @click=${() => this._set({ target: sel.target as 'element' | 'icon' }, 'target')}
                >
                  <ha-icon icon="mdi:target"></ha-icon>Move the ${sel.target === 'icon' ? 'icon' : 'element'} instead
                </button>`
          }
          ${d.kind === 'keyframes' && main ? this._renderMoves(d) : nothing}`,
      );
    }
    const n = sel.keys?.length ?? 0;
    return html`<p class="help ctx-note">${sel.kind === 'keys' ? `${n} keyframe${n === 1 ? '' : 's'} selected.` : 'Nothing to set here yet.'}</p>`;
  }

  private _renderInspector(d: AnimationDoc): TemplateResult {
    const sel = this._selection;
    const kind = KIND_EDITORS[d.kind].place === 'inspector' ? this._renderKindSlot(d) : nothing;
    // the kind's own editor (path, particles, steps) first: what is edited most, without scrolling
    if (sel.kind === 'none') {
      // with nothing selected, panels (states...) are collapsible sections like the settings above them
      const sections = panelsFor('inspector', d, sel)
        .filter((p) => editorDefined(p.tag))
        .map((p) => this._section(`panel-${p.tag}`, p.title, PANEL_ICON[p.tag] ?? 'mdi:puzzle-outline', this._editorEl(p.tag, d, { cls: 'panel panel-inspector', panel: true })));
      return html`${this._renderErrors()} ${kind} ${this._renderForm(d)} ${sections}`;
    }
    // every panel under its own titled, collapsible section
    const sections = panelsFor('inspector', d, sel)
      .filter((p) => editorDefined(p.tag))
      .map((p) => this._section(`panel-${p.tag}`, p.title, PANEL_ICON[p.tag] ?? 'mdi:puzzle-outline', this._editorEl(p.tag, d, { cls: 'panel panel-inspector', panel: true })));
    // Element / Icon: what the animation moves (and "Move the icon instead") comes first
    const own = sel.kind === 'target' && (sel.target === 'element' || sel.target === 'icon');
    const lead = own && moves(d) ? this._renderFallback(d) : nothing;
    // the Icon target of an icon without parts: split it right here (the layers column may be a rail)
    const split =
      sel.kind === 'target' && sel.target === 'icon' && d.kind === 'keyframes' && !d.rig?.parts?.length && editorDefined(PARTS_LAYERS)
        ? this._section('split-icon', 'Icon parts', PANEL_ICON[PARTS_LAYERS], this._editorEl(PARTS_LAYERS, d, { cls: 'panel panel-inspector', panel: true }))
        : nothing;
    const rest = sections.length ? sections : lead === nothing && split === nothing ? this._renderFallback(d) : nothing;
    return html`${this._renderContext(d)} ${this._renderErrors()} ${lead} ${split} ${rest}`;
  }

  /**
   * The stage zooms to the icon while its parts or the drawing tools are in use (a part, group or
   * shape selected, or a draw tool), so parts are big enough to pick and edit.
   */
  private _zoomIcon(d: AnimationDoc): boolean {
    const sel = this._selection;
    if (d.kind !== 'keyframes') return false;
    return sel.kind === 'tool' || ((sel.kind === 'target' || sel.kind === 'keys') && !!sel.target && /^(part|group|shape):/.test(sel.target));
  }

  private _renderEditor(d: AnimationDoc): TemplateResult {
    const dirty = this.dirty;
    const panel = KIND_EDITORS[d.kind].place === 'panel';
    const slide = this._slideOver;
    const rail = this._rail;
    return html`
      <header class="topbar">
        <div class="grp">
          <button type="button" class="btn btn-secondary btn-sm back" @click=${() => this._back()}><ha-icon icon="mdi:arrow-left"></ha-icon>Library</button>
          <span class="vr" aria-hidden="true"></span>
          <div class="title">
            <strong class="doc-name">${d.name.trim() || 'Untitled animation'}</strong>
            <span class="chip kind"><ha-icon icon=${KIND_ICON[d.kind]}></ha-icon>${KIND_LABEL[d.kind]}</span>
            ${!this._saved ? html`<span class="chip is-accent">New</span>` : dirty ? html`<span class="chip is-warn">Unsaved changes</span>` : nothing}
          </div>
        </div>
        <span class="spacer"></span>
        <div class="grp">
          <button
            type="button"
            class="icon-btn"
            aria-label="Undo (Ctrl+Z)"
            title="Undo (Ctrl+Z)"
            ?disabled=${!this._history.canUndo()}
            @click=${() => this.undo()}
          >
            <ha-icon icon="mdi:undo"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn"
            aria-label="Redo (Ctrl+Y)"
            title="Redo (Ctrl+Y)"
            ?disabled=${!this._history.canRedo()}
            @click=${() => this.redo()}
          >
            <ha-icon icon="mdi:redo"></ha-icon>
          </button>
          ${
            slide
              ? html`<button
                  type="button"
                  class="icon-btn insp-toggle"
                  aria-controls="inspector"
                  aria-expanded=${this._inspOpen ? 'true' : 'false'}
                  aria-label="Inspector"
                  title="Inspector"
                  @click=${() => (this._inspOpen = !this._inspOpen)}
                >
                  <ha-icon icon="mdi:tune-variant"></ha-icon>
                </button>`
              : nothing
          }
          <button
            type="button"
            class="btn btn-primary btn-sm save"
            ?disabled=${this._busy || (!dirty && !!this._saved)}
            title="Save (Ctrl+S)"
            @click=${() => this.save()}
          >
            <ha-icon icon=${this._busy ? 'mdi:progress-upload' : 'mdi:content-save-outline'}></ha-icon>${this._busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </header>
      <div
        @preview-change=${this._onPreviewChange}
        class="workspace ${rail ? 'rail' : ''} ${this._compact ? 'compact' : ''} ${slide ? 'slide' : ''} ${slide && this._inspOpen ? 'insp-open' : ''}"
      >
        ${this._renderLayers(d)}
        <div class="center ${panel ? 'with-panel' : ''}" style="--split: ${this._split}">
          <mcas-stage
            .doc=${this._playable ?? d}
            .lookup=${this._lookup}
            .hass=${this.hass}
            .tile=${this._tile}
            .preview=${this._preview}
            .subjectTarget=${d.kind === 'keyframes' && this._selection.kind !== 'none' ? this._selection.target : undefined}
            .zoomIcon=${this._zoomIcon(d)}
            @stage-tile=${(e: CustomEvent) => (this._tile = e.detail.tile)}
            @stage-time=${(e: CustomEvent) => (this._time = e.detail.time)}
            @stage-rect=${this._onStageRect}
          >
            ${d.kind === 'path' && editorDefined(PATH_OVERLAY_TAG) ? this._editorEl(PATH_OVERLAY_TAG, d, { slot: 'overlay', stageRect: this._stageRect, subjectRect: this._subjectRect }) : nothing}
            ${this._panels('stage-tool', d, { slot: 'overlay', stageRect: this._stageRect, subjectRect: this._subjectRect })}
          </mcas-stage>
          ${
            panel
              ? html`<div
                    class="splitter"
                    role="separator"
                    tabindex="0"
                    aria-orientation="horizontal"
                    aria-label="Stage height"
                    aria-valuemin="15"
                    aria-valuemax="80"
                    aria-valuenow=${Math.round(this._split * 100)}
                    title="Drag to resize the stage (double-click: reset)"
                    @pointerdown=${this._onSplitDown}
                    @pointermove=${this._onSplitMove}
                    @pointerup=${this._onSplitUp}
                    @pointercancel=${this._onSplitUp}
                    @keydown=${this._onSplitKey}
                    @dblclick=${() => this._resetSplit()}
                  ></div>
                  ${this._renderKindSlot(d)}`
              : nothing
          }
        </div>
        <aside class="inspector" id="inspector" tabindex="-1" aria-label=${this._selection.kind === 'none' ? 'Animation settings' : 'Inspector'}>
          ${this._renderInspector(d)}
        </aside>
        ${slide && this._inspOpen ? html`<div class="insp-scrim" @click=${() => (this._inspOpen = false)}></div>` : nothing}
      </div>
    `;
  }

  // ── dialogs ──

  private _closeDialog = (): void => {
    this._dialog = undefined;
  };

  private _renderDialog(): TemplateResult | typeof nothing {
    const dg = this._dialog;
    if (!dg) return nothing;
    const shell = (label: string, body: TemplateResult, wide = false) =>
      html`<dialog
        class="dlg ${wide ? 'wide' : ''}"
        aria-label=${label}
        @cancel=${(e: Event) => {
          e.preventDefault();
          this._closeDialog();
        }}
        @close=${() => this._dialog === dg && this._closeDialog()}
      >
        ${body}
      </dialog>`;

    switch (dg.type) {
      case 'delete': {
        const { doc, uses, sequences } = dg;
        const lines: string[] = [];
        if (uses === undefined) lines.push('Cards that use it stop playing it, unless they embed a copy.');
        else if (uses) lines.push(`It is used by ${uses} card${uses === 1 ? '' : 's'}; they stop playing it, unless they embed a copy.`);
        if (sequences.length) lines.push(`Sequences that play it skip that step: ${sequences.map((s) => s.name).join(', ')}.`);
        return shell(
          'Delete animation',
          html`<h2>Delete "${doc.name}"?</h2>
            ${lines.map((l) => html`<p>${l}</p>`)}
            <div class="dlg-actions">
              <button type="button" class="btn btn-secondary btn-sm" autofocus @click=${this._closeDialog}>Cancel</button>
              <button type="button" class="btn btn-danger btn-sm confirm-delete" @click=${() => this._delete(doc)}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>Delete
              </button>
            </div>`,
        );
      }
      case 'discard':
        return shell(
          'Unsaved changes',
          html`<h2>Save your changes?</h2>
            <p>"${this._doc?.name || 'This animation'}" has changes that are not saved yet.</p>
            <div class="dlg-actions">
              <button type="button" class="btn btn-secondary btn-sm" autofocus @click=${this._closeDialog}>Keep editing</button>
              <button
                type="button"
                class="btn btn-secondary btn-sm discard"
                @click=${() => {
                  this._dialog = undefined;
                  writeDraft(draftKey(this._saved?.id));
                  this._saved = this._doc ?? null;
                  dg.then();
                }}
              >
                Discard
              </button>
              <button
                type="button"
                class="btn btn-primary btn-sm"
                @click=${async () => {
                  this._dialog = undefined;
                  if (await this.save()) dg.then();
                }}
              >
                Save
              </button>
            </div>`,
        );
      case 'restore':
        return shell(
          'Unsaved changes',
          html`<h2>Restore unsaved changes?</h2>
            <p>
              ${dg.isNew ? `The new animation "${dg.draft.name}" was not saved last time.` : `"${dg.draft.name}" has changes that were not saved last time.`}
            </p>
            <div class="dlg-actions">
              <button
                type="button"
                class="btn btn-secondary btn-sm discard-draft"
                @click=${() => {
                  this._dialog = undefined;
                  writeDraft(draftKey(dg.isNew ? undefined : dg.draft.id));
                }}
              >
                Discard
              </button>
              <button type="button" class="btn btn-primary btn-sm restore-draft" autofocus @click=${() => this._restoreDraft(dg.draft, dg.isNew)}>
                Restore unsaved changes
              </button>
            </div>`,
        );
      case 'export':
        return shell(
          dg.title,
          html`<h2>${dg.title}</h2>
            <p>
              Import this YAML in another animation studio. A card can also embed it as
              <span class="mono">custom_animations:</span>.
            </p>
            <textarea class="input yaml" readonly aria-label="YAML" .value=${dg.yaml}></textarea>
            <div class="dlg-actions">
              <button type="button" class="btn btn-secondary btn-sm" @click=${this._closeDialog}>Close</button>
              <button type="button" class="btn btn-secondary btn-sm" @click=${() => this._download(dg.yaml, dg.file)}>
                <ha-icon icon="mdi:download"></ha-icon>Download
              </button>
              <button type="button" class="btn btn-primary btn-sm" autofocus @click=${() => this._copy(dg.yaml)}>
                <ha-icon icon="mdi:content-copy"></ha-icon>Copy YAML
              </button>
            </div>`,
          true,
        );
      case 'import': {
        const r = this._import;
        return shell(
          'Import animations',
          html`<h2>Import animations</h2>
            <p>
              Paste YAML from an export: one animation, a list, or a card's
              <span class="mono">custom_animations</span>. An id that exists gets a new one.
            </p>
            <textarea
              class="input yaml"
              aria-label="YAML to import"
              placeholder="- id: doorbell-wiggle&#10;  name: Doorbell wiggle&#10;  kind: keyframes&#10;  …"
              .value=${live(this._importText)}
              @input=${(e: InputEvent) => {
                this._importText = (e.target as HTMLTextAreaElement).value;
                this._import = undefined;
              }}
            ></textarea>
            ${
              r?.errors.length
                ? html`<div class="errors" role="alert">
                    <strong>${r.docs.length ? 'Some items were not imported:' : 'Nothing imported:'}</strong>
                    <ul>
                      ${r.errors.slice(0, 8).map((e) => html`<li><span class="mono">${e.path || 'YAML'}</span> ${e.message}</li>`)}
                    </ul>
                  </div>`
                : nothing
            }
            ${r?.done ? html`<p class="ok" role="status">${r.done}</p>` : nothing}
            <div class="dlg-actions">
              <label class="btn btn-text btn-sm file">
                <ha-icon icon="mdi:file-upload-outline"></ha-icon>Load file
                <input type="file" accept=".yaml,.yml,.json,text/yaml,application/json" @change=${(e: Event) => this._loadFile(e)} />
              </label>
              <span class="spacer"></span>
              <button type="button" class="btn btn-secondary btn-sm" @click=${this._closeDialog}>${r?.done ? 'Done' : 'Cancel'}</button>
              <button type="button" class="btn btn-primary btn-sm run-import" ?disabled=${!this._importText.trim()} @click=${() => this._runImport()}>
                <ha-icon icon="mdi:import"></ha-icon>Import
              </button>
            </div>`,
          true,
        );
      }
      case 'icon':
        return shell(
          'Icon animation',
          html`<h2>Icon animation</h2>
            ${
              editorDefined(ICON_START)
                ? html`<mc-anim-icon-start class="icon-start" .hass=${this.hass} .lookup=${this._lookup} @icon-start=${(e: Event) => this._startIcon(e)}></mc-anim-icon-start>`
                : html`<p class="help">Loading…</p>`
            }
            <div class="dlg-actions">
              <button type="button" class="btn btn-secondary btn-sm" @click=${this._closeDialog}>Cancel</button>
            </div>`,
          true,
        );
      case 'presets': {
        const q = this._presetQuery.trim().toLowerCase();
        const groups = ANIMATION_GROUPS.map((g) => ({
          g,
          items: ANIMATION_PRESETS.filter((p) => p.group === g && (!q || `${p.name} ${p.id}`.toLowerCase().includes(q))),
        })).filter((x) => x.items.length);
        return shell(
          'Customise a preset',
          html`<h2>Customise a preset</h2>
            <p>The preset becomes your own animation to edit: motion presets as keyframes, particle and ring presets with their settings.</p>
            <div class="with-icon">
              <ha-icon icon="mdi:magnify"></ha-icon>
              <input
                class="input preset-search"
                type="search"
                autofocus
                placeholder="Search presets"
                aria-label="Search presets"
                .value=${live(this._presetQuery)}
                @input=${(e: InputEvent) => (this._presetQuery = (e.target as HTMLInputElement).value)}
              />
            </div>
            <div class="preset-list">
              ${
                groups.length
                  ? groups.map(
                      (x) =>
                        html`<div class="pg" role="group" aria-label=${x.g}>
                          <h3>${x.g}</h3>
                          <div class="pg-items">
                            ${x.items.map((p) => html`<button type="button" class="preset" data-preset=${p.id} @click=${() => this._customise(p.id)}>${p.name}</button>`)}
                          </div>
                        </div>`,
                    )
                  : html`<p class="no-results">No presets match "${this._presetQuery}".</p>`
              }
            </div>
            <div class="dlg-actions">
              <button type="button" class="btn btn-secondary btn-sm" @click=${this._closeDialog}>Cancel</button>
            </div>`,
          true,
        );
      }
    }
  }

  protected render(): TemplateResult {
    const d = this._view === 'editor' ? this._doc : undefined;
    return html`
      <div class="shell" data-view=${d ? 'editor' : 'library'}>${d ? this._renderEditor(d) : this._renderLibrary()}</div>
      ${this._renderDialog()}
      <div class="sr-only" role="status" aria-live="polite">${this._status}</div>
      ${this._status ? html`<div class="toast" aria-hidden="true">${this._status}</div>` : nothing}
    `;
  }
}
