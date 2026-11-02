import { LitElement, html, css, svg, nothing, PropertyValues, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-stack';
import type { UiMenuElement, UiMenuEntry, UiMenuPick } from '../../contracts/ui-kit';
import '../kit';
import type { AnimationDoc, AnimationKeyframe, TargetRef } from '../model';
import type { StudioSelection } from '../slots';
import type { LayerView } from '../../contracts/studio-layers';
import { isLocked, lanesOf } from '../layer-view';
import './bezier-editor';
import './key-inspector';
import {
  TIMELINE_NARROW,
  LANE_BY_ID,
  laneLabel,
  SNAP_GRIDS,
  addKey,
  addWholeKey,
  bezierOf,
  clampZoom,
  copyTargetKeys,
  deleteTargetKeys,
  easingLabel,
  fragmentText,
  keyClipboard,
  keyEasing,
  keyFragment,
  laneEasingOverride,
  laneTimes,
  lanesFor,
  mainTarget,
  moveTargetKeys,
  onKeyClipboard,
  parseTKeyId,
  pasteTargetKeys,
  rulerTicks,
  sampleLane,
  setKeyClipboard,
  snapTime,
  targetIcon,
  targetLabel,
  timelineTracks,
  tkeyExists,
  tkeyId,
  trackKeyframes,
  usedLanes,
  withTrackKeyframes,
  zoomStep,
  type KeyLane,
  type LaneId,
  type SnapGrid,
  type TKey,
  type TimelineTrack,
} from './keyframes-utils';
import { t } from '../i18n';

/** Below this width the lanes collapse to a keyframe list. */
const NARROW = TIMELINE_NARROW;
const DRAG_THRESHOLD = 3;
/** Width of the lane heads (px); narrow: icons only. */
const HEAD = 216;
const HEAD_NARROW = 44;
/** Keys and the playhead snap within this many px. */
const SNAP_PX = 6;
/** Touch: a press held this long without moving starts a box select (else the finger scrolls). */
const LONG_PRESS_MS = 400;
/** Touch: moving this far before the long press means scrolling. */
const TOUCH_SLOP = 8;
const round1 = (n: number): number => Math.round(n * 10) / 10;
const pctText = (at: number): string => `${round1(at)}%`;

interface DragState {
  kind: 'keys' | 'band' | 'seek';
  pointerId: number;
  x0: number;
  y0: number;
  moved: boolean;
  /** keys: the doc the drag started from, the grabbed key, the selection at the start. */
  base?: AnimationDoc;
  grab?: TKey;
  sel?: TKey[];
  duplicate?: boolean;
  /** keys: a click without movement collapses the selection to the key (a plain click only). */
  clickKey?: TKey;
  wasSelected?: boolean;
  additive?: boolean;
  pointerType?: string;
  /** band: the selection to add to. */
  baseSel?: TKey[];
  /** band: the target of the track it started on. */
  target?: TargetRef;
  label?: string;
  lastTarget?: number;
  /** keys: snap targets (other keys, the playhead), taken at the drag start. */
  snaps?: number[];
  /** keys: a transient change was sent (a drag back to its start still sends the start). */
  emitted?: boolean;
  /** band: the keys' centres relative to the lanes, taken at the drag start. */
  centres?: Array<{ key: TKey; x: number; y: number }>;
}

/**
 * Keyframe timeline of a `keyframes` document: a zoomable ruler with the playhead and, per target, a collapsible group
 * with a summary lane plus one lane per animated property. Key values are edited in the key inspector. `.doc` is never
 * mutated: edits emit `doc-change` (drags transient, then final), the ruler emits `seek`, selection emits
 * `selection-change`. Mouse and keyboard: add, drag, range and box select, copy / paste, zoom, delete.
 */
@customElement('mc-anim-keyframes-editor')
export class AnimKeyframesEditor extends LitElement {
  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) library?: Record<string, AnimationDoc>;
  /** Playhead, 0-1 of the cycle. */
  @property({ type: Number }) time = 0;
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Preview-only lock of lanes and targets: their keys cannot be added, moved or deleted. */
  @property({ attribute: false }) layerView?: LayerView;
  /** Onion skin: ghost markers of the keyframes around the playhead (view only, never emitted). */
  @property({ type: Boolean, reflect: true, attribute: 'onion-skin' }) onionSkin = false;
  /** auto: lanes from 480px wide, the keyframe list below that. */
  @property({ type: String }) layout: 'auto' | 'wide' | 'narrow' = 'auto';
  /** The colour shown for the animation colour (entity colour) in colour fields. */
  @property({ type: String }) entityColor = 'var(--primary-color, #03a9f4)';
  /** The studio's selection: its keys select here, its target is the active target. */
  @property({ attribute: false }) studioSelection?: StudioSelection;

  @state() private _keys: TKey[] = [];
  @state() private _draft?: AnimationDoc;
  @state() private _band?: { x0: number; y0: number; x1: number; y1: number };
  @state() private _width = 0;
  @state() private _viewW = 0;
  @state() private _menuOpen = false;
  @state() private _status = '';
  /** 1 = the whole cycle fits; up to 10. */
  @state() private _zoom = 1;
  @state() private _unit: 'pct' | 's' = 'pct';
  @state() private _snap = true;
  @state() private _grid: SnapGrid = 'pct1';
  @state() private _collapsed = new Set<TargetRef>();
  /** The target last worked on (Add property and paste go there). */
  @state() private _lastTarget?: TargetRef;

  private _drag?: DragState;
  private _ro?: ResizeObserver;
  private _bodyRo?: ResizeObserver;
  private _pendingFocus?: string;
  /** Range selection anchor (the last plainly clicked key). */
  private _anchor?: TKey;
  /** Zoom around a time under a pointer x: restored after the re-render. */
  private _zoomAnchor?: { at: number; clientX: number };
  /** Last focused key per lane (the lane's tab stop), by `${target}|${lane}`. */
  private _laneFocus = new Map<string, number>();
  private _unsubClip?: () => void;
  /** Touch on a track: waiting for the long press that starts a box select. */
  private _hold?: { pointerId: number; x: number; y: number; timer: ReturnType<typeof setTimeout>; target: TargetRef; additive: boolean };
  /** A selection-change during a drag, once per frame. */
  private _selFrame = 0;
  /** The Add property button's own press closes the menu (an outside press); the click that follows must not open it again. */
  private _menuClosedAt = 0;

  /** Onion skin markers: the active target's keyframe times before and after the playhead. */
  get onion(): { prev?: number; next?: number } {
    const times = laneTimes(this._kfsOf(this._active), '*');
    const t = this.time * 100;
    return { prev: [...times].reverse().find((a) => a < t - 0.001), next: times.find((a) => a > t + 0.001) };
  }

  /** The selected keys as ids: `scale@50` on the main track, `part:x/rotate@20` on the others. */
  get selection(): string[] {
    return this._keys.map((k) => tkeyId(k, this._main));
  }
  set selection(ids: string[]) {
    this._select(ids.map((id) => parseTKeyId(id, this._main)));
  }

  /** The timeline zoom (1 = 100%, the whole cycle fits). */
  get zoom(): number {
    return this._zoom;
  }
  set zoom(z: number) {
    this._zoom = clampZoom(z);
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver((entries) => {
        const w = Math.round(entries[0]?.contentRect.width ?? 0);
        if (w && w !== this._width) this._width = w;
      });
      this._ro.observe(this);
    }
    this._unsubClip = onKeyClipboard(() => this.requestUpdate());
    this.addEventListener('touchmove', this._onTouchMove, { passive: false });
  }

  /** A touch box select (after the long press) keeps the finger from scrolling the lanes. */
  private _onTouchMove = (e: TouchEvent): void => {
    if (this._drag?.kind === 'band' && this._drag.pointerType === 'touch') e.preventDefault();
  };

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ro?.disconnect();
    this._ro = undefined;
    this._bodyRo?.disconnect();
    this._bodyRo = undefined;
    this._unsubClip?.();
    this.removeEventListener('touchmove', this._onTouchMove);
    this._cancelHold();
    cancelAnimationFrame(this._selFrame);
  }

  private get _view(): AnimationDoc | undefined {
    return this._draft ?? this.doc;
  }
  private get _main(): TargetRef {
    return this._view ? mainTarget(this._view) : 'element';
  }
  private _kfsOf(target: TargetRef): AnimationKeyframe[] {
    return this._view ? trackKeyframes(this._view, target) : [];
  }
  private get _narrow(): boolean {
    return this.layout === 'narrow' || (this.layout === 'auto' && this._width > 0 && this._width < NARROW);
  }

  /** The target Add property and paste use: the studio's selected target, else the last one worked on. */
  private get _active(): TargetRef {
    const s = this.studioSelection;
    const sel = s && (s.kind === 'target' || s.kind === 'keys') ? s.target : undefined;
    return sel ?? this._keys[this._keys.length - 1]?.target ?? this._lastTarget ?? this._main;
  }

  /** The target groups shown: the main one, every track with keys, and the selected targets. */
  private _groups(): TimelineTrack[] {
    const view = this._view;
    if (!view) return [];
    const all = timelineTracks(view);
    const s = this.studioSelection;
    const picked = new Set<TargetRef>([...(s?.targets ?? []), ...(s?.target ? [s.target] : []), ...this._keys.map((k) => k.target)]);
    const out = all.filter((t) => t.main || t.keyframes.length || picked.has(t.target));
    for (const t of picked) if (!out.some((g) => g.target === t)) out.push({ target: t, keyframes: [], main: false });
    return out;
  }

  /** Every row in display order (for Up / Down and ranges). */
  private _rows(): Array<{ target: TargetRef; lane: KeyLane }> {
    const out: Array<{ target: TargetRef; lane: KeyLane }> = [];
    for (const g of this._groups()) {
      out.push({ target: g.target, lane: '*' });
      if (!this._narrow && !this._collapsed.has(g.target)) for (const l of usedLanes(g.keyframes)) out.push({ target: g.target, lane: l });
    }
    return out;
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('doc')) {
      if (!this._drag) this._draft = undefined;
      // undo / outside edits: drop keys that no longer exist
      const view = this._view;
      const kept = view ? this._keys.filter((k) => tkeyExists(view, k)) : [];
      if (kept.length !== this._keys.length) this._select(kept);
    }
    if (changed.has('studioSelection')) this._adopt();
  }

  /** Take the studio's selection (no event back): its keys, or none when it selects something else. */
  private _adopt(): void {
    const s = this.studioSelection;
    const view = this._view;
    if (!s || !view) return;
    if (s.kind === 'keys' && s.keys) {
      const keys = s.keys.map((k) => ({ target: k.target, lane: k.lane as KeyLane, at: k.at })).filter((k) => tkeyExists(view, k));
      const main = this._main;
      if (keys.map((k) => tkeyId(k, main)).join() !== this.selection.join()) this._keys = keys;
    } else if (this._keys.length) this._keys = [];
  }

  protected updated(): void {
    const menu = this._menuOpen ? this.renderRoot.querySelector<UiMenuElement>('mc-ui-menu.add-menu') : null;
    if (menu && !menu.open) {
      menu.anchor = this.renderRoot.querySelector<HTMLElement>('.add-btn') ?? undefined;
      menu.show();
    }
    if (this._pendingFocus) {
      const el = this.renderRoot.querySelector<HTMLElement>(`.key[data-key="${CSS.escape(this._pendingFocus)}"]`);
      this._pendingFocus = undefined;
      el?.focus();
    }
    const body = this.renderRoot.querySelector<HTMLElement>('.tl-body');
    if (body && !this._bodyRo && typeof ResizeObserver !== 'undefined') {
      this._bodyRo = new ResizeObserver(() => {
        const w = this.renderRoot.querySelector<HTMLElement>('.tl-body')?.clientWidth ?? 0;
        if (w && w !== this._viewW) this._viewW = w;
      });
      this._bodyRo.observe(body);
    }
    if (this._zoomAnchor && body) {
      const { at, clientX } = this._zoomAnchor;
      this._zoomAnchor = undefined;
      const r = this._trackRect();
      if (r) body.scrollLeft += r.left + 12 + (at / 100) * (r.width - 24) - clientX;
    }
  }

  // ── emitting ──

  private _emit(doc: AnimationDoc, label: string, transient = false): void {
    this.dispatchEvent(new CustomEvent('doc-change', { bubbles: true, composed: true, detail: transient ? { doc, label, transient: true } : { doc, label } }));
  }

  /** Set the selected keys; tells the studio (selection-change) unless `quiet` or unchanged. */
  private _select(keys: TKey[], quiet = false): void {
    const main = this._main;
    const seen = new Set<string>();
    const next = keys.filter((k) => {
      const id = tkeyId(k, main);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
    const changed = next.map((k) => tkeyId(k, main)).join() !== this.selection.join();
    this._keys = next;
    if (next.length) this._lastTarget = next[next.length - 1].target;
    if (changed && !quiet) this._emitSelection();
  }

  private _emitSelection(): void {
    const main = this._main;
    const keys = this._keys;
    const targets = [...new Set(keys.map((k) => k.target))];
    const selection: StudioSelection = keys.length
      ? {
          kind: 'keys',
          target: keys[keys.length - 1].target,
          targets,
          keys: keys.map((k) => ({ target: k.target, lane: k.lane, at: k.at, id: tkeyId(k, main) })),
        }
      : { kind: 'none' };
    // no keys and the studio selects something else already: nothing to say
    if (!keys.length && this.studioSelection && this.studioSelection.kind !== 'keys') return;
    this.dispatchEvent(new CustomEvent('selection-change', { bubbles: true, composed: true, detail: { selection } }));
  }

  /** Whether a key is locked: its lane, its target, or (a whole keyframe) any lane of its target. */
  private _isLocked(k: { target: TargetRef; lane: string }): boolean {
    const v = this.layerView;
    const d = this.doc;
    if (!d || !v?.locked.length) return false;
    if (k.lane !== '*') return isLocked(d, v, `lane:${k.target}|${k.lane}`);
    return isLocked(d, v, /^(part|group|shape):/.test(k.target) ? k.target : `target:${k.target}`) || lanesOf(d, k.target).some((l) => isLocked(d, v, `lane:${k.target}|${l}`));
  }

  /** Refuse an edit of locked keys, and say which (the live region); true when refused. */
  private _refuseLocked(keys: Array<{ target: TargetRef; lane: string }>): boolean {
    const k = keys.find((x) => this._isLocked(x));
    if (!k || !this._view) return false;
    const where = targetLabel(this._view, k.target);
    this._announce(t('anim-studio.keyframes-editor.name-is-locked-unlock-it-in-layers', { name: k.lane === '*' ? where : `${where} ${LANE_BY_ID[k.lane as LaneId] ? laneLabel(k.lane as LaneId).toLowerCase() : k.lane}` }));
    return true;
  }

  private _commit(doc: AnimationDoc, label: string, sel?: TKey[]): void {
    if (!this.doc || this.disabled) return;
    this._emit(doc, label);
    if (sel) this._select(sel);
  }

  private _seek(at: number): void {
    const time = Math.min(1, Math.max(0, at / 100));
    this.dispatchEvent(new CustomEvent('seek', { bubbles: true, composed: true, detail: { time } }));
  }

  private _announce(msg: string): void {
    this._status = '';
    void this.updateComplete.then(() => (this._status = msg));
  }

  // ── selection / geometry ──

  private _isSel(k: TKey): boolean {
    return this._keys.some((s) => s.target === k.target && s.lane === k.lane && s.at === k.at);
  }

  private _trackRect(): DOMRect | undefined {
    return this.renderRoot.querySelector<HTMLElement>('.track, .ruler-track')?.getBoundingClientRect();
  }

  /** % of the cycle under a client x (the tracks' inner width). */
  private _atFromX(clientX: number): number {
    const r = this._trackRect();
    if (!r || r.width <= 24) return 0;
    return ((clientX - r.left - 12) / (r.width - 24)) * 100;
  }

  private _pxPerPct(): number {
    const r = this._trackRect();
    return r && r.width > 24 ? (r.width - 24) / 100 : 6;
  }

  /** Times a drag snaps to: the playhead and every shown key but `exclude`. */
  private _snapTargets(exclude: TKey[] = []): number[] {
    const main = this._main;
    const skip = new Set(exclude.map((k) => tkeyId(k, main)));
    const targets = new Set<number>([this.time * 100]);
    for (const g of this._groups()) {
      for (const lane of ['*' as KeyLane, ...usedLanes(g.keyframes)]) {
        for (const at of laneTimes(g.keyframes, lane)) if (!skip.has(tkeyId({ target: g.target, lane, at }, main))) targets.add(at);
      }
    }
    return [...targets];
  }

  /** A dragged time snapped (Shift or snapping off: free 0.1%) to keys, the playhead and the grid. */
  private _snapAt(raw: number, free: boolean, exclude: TKey[] = [], targets = this._snapTargets(exclude), ppp = this._pxPerPct()): number {
    return snapTime(raw, { free: free || !this._snap, grid: this._grid, duration: this._view?.duration ?? 1, targets, threshold: SNAP_PX / ppp });
  }

  /** The keys of rows `a`..`b` (display order) between two times. */
  private _range(a: TKey, b: TKey): TKey[] {
    const rows = this._rows();
    const ia = rows.findIndex((r) => r.target === a.target && r.lane === a.lane);
    const ib = rows.findIndex((r) => r.target === b.target && r.lane === b.lane);
    if (ia < 0 || ib < 0) return [b];
    const [lo, hi] = [Math.min(a.at, b.at), Math.max(a.at, b.at)];
    const out: TKey[] = [];
    for (const r of rows.slice(Math.min(ia, ib), Math.max(ia, ib) + 1)) {
      for (const at of laneTimes(this._kfsOf(r.target), r.lane)) if (at >= lo && at <= hi) out.push({ target: r.target, lane: r.lane, at });
    }
    return out;
  }

  // ── pointer: keys, box select ──

  private _onKeyDown(e: PointerEvent, k: TKey): void {
    if (this.disabled || e.button !== 0 || !this.doc) return;
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).focus();
    const was = this._isSel(k);
    const toggle = e.ctrlKey || e.metaKey;
    if (e.shiftKey && this._anchor) this._select(toggle ? [...this._keys, ...this._range(this._anchor, k)] : this._range(this._anchor, k));
    else if (toggle) {
      this._select(was ? this._keys.filter((s) => tkeyId(s, this._main) !== tkeyId(k, this._main)) : [...this._keys, k]);
      if (was) return;
    } else {
      if (!was) this._select([k]);
      this._anchor = k;
    }
    this._laneFocus.set(`${k.target}|${k.lane}`, k.at);
    // a locked key can be selected (its values show), not dragged
    if (this._refuseLocked(this._keys)) return;
    this._drag = {
      kind: 'keys',
      pointerId: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      moved: false,
      base: this.doc,
      grab: k,
      sel: [...this._keys],
      duplicate: e.altKey,
      clickKey: k,
      wasSelected: was,
      additive: e.shiftKey || toggle,
      snaps: this._snapTargets(e.altKey ? [] : this._keys),
    };
    this._pxCache = this._pxPerPct();
    this._capture(e);
  }

  /** px per % at the drag start (the track does not resize during a drag). */
  private _pxCache = 0;

  private _cancelHold(): void {
    if (this._hold) clearTimeout(this._hold.timer);
    this._hold = undefined;
  }

  private _onTrackDown(e: PointerEvent, target: TargetRef): void {
    if (this.disabled || e.button !== 0) return;
    const additive = e.shiftKey || e.ctrlKey || e.metaKey;
    if (e.pointerType === 'touch') {
      // a touch scrolls the lanes; held still for a moment it starts a box select
      this._cancelHold();
      const { pointerId, clientX, clientY } = e;
      this._hold = {
        pointerId,
        x: clientX,
        y: clientY,
        target,
        additive,
        timer: setTimeout(() => {
          this._hold = undefined;
          this._startBand(pointerId, clientX, clientY, target, additive, 'touch');
        }, LONG_PRESS_MS),
      };
      return;
    }
    this._startBand(e.pointerId, e.clientX, e.clientY, target, additive, e.pointerType);
  }

  private _startBand(pointerId: number, clientX: number, clientY: number, target: TargetRef, additive: boolean, pointerType: string): void {
    const lanes = this.renderRoot.querySelector<HTMLElement>('.lanes');
    if (!lanes) return;
    const r = lanes.getBoundingClientRect();
    const main = this._main;
    const centres = [...this.renderRoot.querySelectorAll<HTMLElement>('.lanes .key')].map((el) => {
      const kr = el.getBoundingClientRect();
      return { key: parseTKeyId(el.dataset.key!, main), x: kr.left + kr.width / 2 - r.left, y: kr.top + kr.height / 2 - r.top };
    });
    this._drag = {
      kind: 'band',
      pointerId,
      x0: clientX - r.left,
      y0: clientY - r.top,
      moved: false,
      baseSel: additive ? [...this._keys] : [],
      additive,
      target,
      pointerType,
      centres,
    };
    try {
      lanes.setPointerCapture?.(pointerId);
    } catch {
      /* synthetic events, or the pointer is gone */
    }
  }

  private _capture(e: PointerEvent): void {
    const lanes = this.renderRoot.querySelector<HTMLElement>('.lanes');
    try {
      (lanes ?? (e.currentTarget as HTMLElement)).setPointerCapture?.(e.pointerId);
    } catch {
      /* synthetic events have no active pointer */
    }
  }

  private _onPointerMove = (e: PointerEvent): void => {
    const h = this._hold;
    if (h && e.pointerId === h.pointerId && Math.hypot(e.clientX - h.x, e.clientY - h.y) > TOUCH_SLOP) this._cancelHold();
    const d = this._drag;
    if (!d || e.pointerId !== d.pointerId) return;
    if (d.kind === 'seek') {
      this._seek(this._atFromX(e.clientX));
      return;
    }
    if (d.kind === 'band') {
      const r = this.renderRoot.querySelector<HTMLElement>('.lanes')!.getBoundingClientRect();
      const x1 = e.clientX - r.left;
      const y1 = e.clientY - r.top;
      if (!d.moved && Math.hypot(x1 - d.x0, y1 - d.y0) < DRAG_THRESHOLD) return;
      d.moved = true;
      this._band = { x0: d.x0, y0: d.y0, x1, y1 };
      const main = this._main;
      const base = d.baseSel ?? [];
      this._select([...base, ...this._keysInBand(d.centres).filter((k) => !base.some((s) => tkeyId(s, main) === tkeyId(k, main)))], true);
      return;
    }
    const dx = e.clientX - d.x0;
    if (!d.moved && Math.abs(dx) < DRAG_THRESHOLD) return;
    d.moved = true;
    const ppp = this._pxCache || this._pxPerPct();
    const target = this._snapAt(d.grab!.at + dx / ppp, e.shiftKey, d.duplicate ? [] : d.sel, d.snaps, ppp);
    if (d.lastTarget === target) return;
    d.lastTarget = target;
    const res = moveTargetKeys(d.base!, d.sel!, target - d.grab!.at, d.duplicate);
    const n = d.sel!.length;
    d.label = d.duplicate ? t('anim-studio.keyframes-editor.duplicate-count', { count: n }) : t('anim-studio.keyframes-editor.move-count', { count: n });
    this._draft = res.doc;
    this._select(res.selection, true);
    const grabbed = res.selection[d.sel!.findIndex((s) => tkeyId(s, this._main) === tkeyId(d.grab!, this._main))];
    if (grabbed) this._laneFocus.set(`${grabbed.target}|${grabbed.lane}`, grabbed.at);
    // back at the start before anything was sent: nothing to say
    if (res.doc === d.base && !d.emitted) return;
    d.emitted = true;
    this._emit(this._draft, d.label, true);
    // the key inspector follows the moving keys (once per frame), so it never shows stale keys
    if (!this._selFrame) {
      this._selFrame = requestAnimationFrame(() => {
        this._selFrame = 0;
        if (this._drag?.kind === 'keys') this._emitSelection();
      });
    }
  };

  private _onPointerUp = (e: PointerEvent): void => {
    const h = this._hold;
    if (h && e.pointerId === h.pointerId) {
      // a tap on a track (no long press, no scroll): like a click on empty track
      this._cancelHold();
      if (e.type === 'pointerup' && !h.additive) {
        this._lastTarget = h.target;
        this._select([]);
      }
      return;
    }
    const d = this._drag;
    if (!d || e.pointerId !== d.pointerId) return;
    this._drag = undefined;
    this._pxCache = 0;
    cancelAnimationFrame(this._selFrame);
    this._selFrame = 0;
    if (d.kind === 'band') {
      this._band = undefined;
      if (!d.moved && !d.additive) {
        if (d.target) this._lastTarget = d.target;
        this._select([]);
      } else this._emitSelection();
      return;
    }
    if (d.kind !== 'keys') return;
    if (d.moved && this._draft && d.emitted) {
      const doc = this._draft;
      const grabbed = this._keys.find((s) => s.target === d.grab!.target && s.lane === d.grab!.lane);
      if (grabbed) this._pendingFocus = tkeyId(grabbed, this._main);
      this._emit(doc, d.label ?? t('anim-studio.keyframes-editor.move-keyframe'));
      this._emitSelection();
      // keep showing the result until the host feeds the doc back
      this._draft = doc;
      if (this.doc === doc) this._draft = undefined;
      return;
    }
    this._draft = undefined;
    // a plain click on a selected key keeps only it
    if (!d.additive && d.wasSelected) this._select([d.clickKey!]);
  };

  /** The keys whose centres (measured at the drag start) are inside the band. */
  private _keysInBand(centres: Array<{ key: TKey; x: number; y: number }> = []): TKey[] {
    const b = this._band;
    if (!b) return [];
    const [l, r] = [Math.min(b.x0, b.x1), Math.max(b.x0, b.x1)];
    const [t, bt] = [Math.min(b.y0, b.y1), Math.max(b.y0, b.y1)];
    return centres.filter((c) => c.x >= l && c.x <= r && c.y >= t && c.y <= bt).map((c) => c.key);
  }

  // ── ruler, zoom ──

  private _onRulerDown(e: PointerEvent): void {
    if (e.button !== 0) return;
    e.preventDefault();
    this._drag = { kind: 'seek', pointerId: e.pointerId, x0: e.clientX, y0: e.clientY, moved: false };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      /* synthetic */
    }
    this._seek(this._atFromX(e.clientX));
  }

  private _onRulerKey(e: KeyboardEvent): void {
    const t = this.time * 100;
    const step = e.shiftKey ? 10 : 1;
    const map: Record<string, number> = {
      ArrowLeft: t - step,
      ArrowDown: t - step,
      ArrowRight: t + step,
      ArrowUp: t + step,
      Home: 0,
      End: 100,
      PageUp: t + 10,
      PageDown: t - 10,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    this._seek(round1(map[e.key]));
  }

  private _jump(dir: -1 | 1): void {
    const o = this.onion;
    const at = dir < 0 ? o.prev : o.next;
    if (at !== undefined) this._seek(at);
  }

  /** Zoom to `z`, keeping the time under `clientX` (default: the playhead) in place. */
  private _setZoom(z: number, clientX?: number): void {
    const next = clampZoom(z);
    if (next === this._zoom) return;
    const r = this._trackRect();
    const at = clientX !== undefined ? this._atFromX(clientX) : this.time * 100;
    const x = clientX ?? (r ? r.left + 12 + (at / 100) * (r.width - 24) : 0);
    this._zoomAnchor = { at, clientX: x };
    this._zoom = next;
  }

  private _onWheel = (e: WheelEvent): void => {
    if (!(e.ctrlKey || e.metaKey) || this._narrow) return;
    e.preventDefault();
    this._setZoom(this._zoom * Math.exp(-e.deltaY * 0.002), e.clientX);
  };

  // ── keyboard ──

  private _onKeyKeydown(e: KeyboardEvent, k: TKey): void {
    if (this.disabled || !this._view) return;
    const mod = e.ctrlKey || e.metaKey;
    const main = this._main;
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.altKey && !mod) {
      e.preventDefault();
      if (!this._isSel(k)) this._select([k]);
      const sel = this._keys;
      if (this._refuseLocked(sel)) return;
      const res = moveTargetKeys(this._view, sel, (e.key === 'ArrowLeft' ? -1 : 1) * (e.shiftKey ? 10 : 1));
      if (res.doc === this._view) return;
      const idx = sel.findIndex((s) => tkeyId(s, main) === tkeyId(k, main));
      const moved = res.selection[idx] ?? res.selection[0];
      if (moved) {
        this._pendingFocus = tkeyId(moved, main);
        this._laneFocus.set(`${moved.target}|${moved.lane}`, moved.at);
      }
      this._commit(res.doc, `Move ${sel.length === 1 ? 'keyframe' : 'keyframes'}`, res.selection);
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      const times = laneTimes(this._kfsOf(k.target), k.lane);
      const i = times.indexOf(k.at);
      const j = e.key === 'Home' ? 0 : e.key === 'End' ? times.length - 1 : i + (e.key === 'ArrowLeft' ? -1 : 1);
      if (j >= 0 && j < times.length) this._focusKey({ target: k.target, lane: k.lane, at: times[j] }, e.shiftKey);
      return;
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const rows = this._rows();
      const r = rows.findIndex((x) => x.target === k.target && x.lane === k.lane) + (e.key === 'ArrowUp' ? -1 : 1);
      if (r < 0 || r >= rows.length) return;
      const times = laneTimes(this._kfsOf(rows[r].target), rows[r].lane);
      const near = times.reduce((a, b) => (Math.abs(b - k.at) < Math.abs(a - k.at) ? b : a), times[0]);
      if (near !== undefined) this._focusKey({ ...rows[r], at: near }, e.shiftKey);
      return;
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      if (!this._isSel(k)) this._select([k]);
      this._delete();
      return;
    }
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const add = e.shiftKey || mod;
      this._select(add ? (this._isSel(k) ? this._keys.filter((s) => tkeyId(s, main) !== tkeyId(k, main)) : [...this._keys, k]) : [k]);
      if (!add) this._anchor = k;
    }
  }

  /** Shortcuts anywhere in the timeline (keys, tracks, ruler). */
  private _onTimelineKeydown(e: KeyboardEvent): void {
    if (this.disabled) return;
    const mod = e.ctrlKey || e.metaKey;
    const tag = (e.composedPath()[0] as HTMLElement)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    const key = e.key.toLowerCase();
    if (mod && key === 'c') {
      e.preventDefault();
      this._copy();
    } else if (mod && key === 'v') {
      e.preventDefault();
      this._paste();
    } else if (mod && key === 'a') {
      e.preventDefault();
      const all: TKey[] = [];
      for (const r of this._rows()) for (const at of laneTimes(this._kfsOf(r.target), r.lane)) if (!this._narrow || r.lane === '*') all.push({ ...r, at });
      this._select(all);
    } else if (mod && (key === '=' || key === '+' || key === '-')) {
      e.preventDefault();
      this._setZoom(zoomStep(this._zoom, key === '-' ? -1 : 1));
    } else if (e.key === 'Escape' && this._keys.length) {
      e.preventDefault();
      e.stopPropagation();
      this._select([]);
    }
  }

  private _focusKey(k: TKey, extend = false): void {
    this._select(extend && !this._isSel(k) ? [...this._keys, k] : extend ? this._keys : [k]);
    if (!extend) this._anchor = k;
    this._laneFocus.set(`${k.target}|${k.lane}`, k.at);
    this._pendingFocus = tkeyId(k, this._main);
    this.requestUpdate();
  }

  // ── actions ──

  private _add(target: TargetRef, lane: KeyLane, at: number): void {
    const view = this._view;
    if (!this.doc || !view || this.disabled) return;
    if (this._refuseLocked([{ target, lane }])) return;
    const pos = round1(Math.min(100, Math.max(0, at)));
    const kfs = trackKeyframes(view, target);
    const res = lane === '*' ? addWholeKey(kfs, pos, view.easing) : addKey(kfs, lane, pos, view.easing);
    const sel = res.selection.map((k) => ({ ...k, target }));
    this._pendingFocus = tkeyId(sel[0], this._main);
    this._laneFocus.set(`${target}|${lane}`, sel[0].at);
    this._anchor = sel[0];
    this._collapsed.delete(target);
    this._commit(withTrackKeyframes(view, target, res.keyframes), lane === '*' ? t('anim-studio.keyframes-editor.add-keyframe') : t('anim-studio.keyframes-editor.add-lane-keyframe', { lane: laneLabel(lane).toLowerCase() }), sel);
  }

  private _onTrackDblClick(e: MouseEvent, target: TargetRef, lane: KeyLane): void {
    if ((e.target as HTMLElement).closest('.key')) return;
    this._add(target, lane, this._snapAt(this._atFromX(e.clientX), e.shiftKey));
  }

  private _addLane(lane: LaneId): void {
    this._menuOpen = false;
    this._add(this._active, lane, this.time * 100);
  }

  private _delete(): void {
    const n = this._keys.length;
    const view = this._view;
    if (!n || !view || this._refuseLocked(this._keys)) return;
    this._commit(deleteTargetKeys(view, this._keys), `Delete ${n === 1 ? 'keyframe' : 'keyframes'}`, []);
    this._announce(t('anim-studio.keyframes-editor.count-deleted', { count: n }));
  }

  private _copy(): void {
    const view = this._view;
    const c = view ? copyTargetKeys(view, this._keys) : undefined;
    if (!c) return;
    setKeyClipboard(c);
    this._announce(t('anim-studio.keyframes-editor.count-copied', { count: c.items.length }));
  }

  /**
   * Paste at the playhead: into the active target (keys from several targets go back to their
   * own); with the keys of one lane selected, a one-lane clip goes into that lane.
   */
  private _paste(): void {
    const clip = keyClipboard();
    const view = this._view;
    if (!clip || !view || !this.doc) return;
    const targets = new Set(clip.items.map((i) => i.target ?? this._main));
    const lanes = new Set(this._keys.map((k) => `${k.target}|${k.lane}`));
    const one = lanes.size === 1 && this._keys[0].lane !== '*' ? this._keys[0] : undefined;
    // keys from several targets go back to their own; a one-target clip goes to the selected lane or target
    const dest = targets.size > 1 ? {} : one ? { target: one.target, lane: one.lane as LaneId } : { target: this._active };
    const res = pasteTargetKeys(view, clip, round1(this.time * 100), dest);
    if (!res.selection.length) {
      this._announce(t('anim-studio.keyframes-editor.nothing-pasted-those-properties-do-not'));
      return;
    }
    if (this._refuseLocked(res.selection)) return;
    this._commit(res.doc, `Paste ${res.selection.length === 1 ? 'keyframe' : 'keyframes'}`, res.selection);
    const skipped = res.skipped ? t('anim-studio.keyframes-editor.skipped-skipped-not-for-this-target-or', { skipped: res.skipped }) : '';
    this._announce(t('anim-studio.keyframes-editor.count-pasted-at-at-skipped', { count: res.selection.length, at: pctText(this.time * 100), skipped }));
  }

  private _selectLane(target: TargetRef, lane: KeyLane, extend: boolean): void {
    const keys = laneTimes(this._kfsOf(target), lane).map((at) => ({ target, lane, at }));
    this._lastTarget = target;
    this._select(extend ? [...this._keys.filter((s) => !(s.target === target && s.lane === lane)), ...keys] : keys);
  }

  private _toggleGroup(target: TargetRef): void {
    const next = new Set(this._collapsed);
    if (next.has(target)) next.delete(target);
    else next.add(target);
    this._collapsed = next;
  }

  // ── render: shared ──

  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
        height: 100%;
        container: kf / inline-size;
        --head: ${unsafeCSS(HEAD)}px;
        --row: 34px;
        --inset: 12px;
        --key-ink: var(--mc-text-2);
        --grid-line: color-mix(in srgb, var(--mc-text) 7%, transparent);
        --grid-major: color-mix(in srgb, var(--mc-text) 12%, transparent);
        --ph: var(--mc-accent);
      }
      :host([disabled]) .tl {
        opacity: 0.6;
        pointer-events: none;
      }
      .shell {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        gap: 8px;
        min-width: 0;
        height: 100%;
        min-height: 0;
      }
      /* ── toolbar ── */
      .bar {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        min-width: 0;
      }
      .readout {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding: 2px;
        border: 1px solid var(--mc-divider);
        border-radius: 10px;
        background: var(--mc-surface-2);
      }
      .readout .now {
        display: inline-flex;
        align-items: baseline;
        gap: 6px;
        min-width: 104px;
        justify-content: center;
        padding: 0 4px;
        font-family: var(--mc-mono);
        font-size: 0.8125rem;
        font-variant-numeric: tabular-nums;
        color: var(--mc-text);
      }
      .readout .now small {
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .spacer {
        flex: 1;
      }
      .tools {
        display: inline-flex;
        align-items: center;
        gap: 2px;
      }
      .sep {
        width: 1px;
        height: 20px;
        margin: 0 4px;
        background: var(--mc-divider);
      }
      .icon-btn[aria-pressed='true'] {
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
      }
      .add-btn ha-icon {
        --mdc-icon-size: 18px;
      }
      /* ── timeline ── */
      .tl {
        position: relative;
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto;
        min-width: 0;
        min-height: 0;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
        background: var(--mc-surface);
        direction: ltr; /* time runs left to right */
        overflow: hidden;
        user-select: none;
        -webkit-user-select: none;
      }
      /* the scroll area: lanes scroll vertically, zoomed tracks sideways; heads and ruler stay */
      .tl-body {
        position: relative;
        min-height: 0;
        overflow: auto;
        overscroll-behavior: contain;
      }
      .tl-content {
        position: relative;
        min-width: 100%;
        width: max-content;
      }
      .tl.narrow {
        --head: ${unsafeCSS(HEAD_NARROW)}px;
      }
      .tl.narrow .lane-name .nm,
      .tl.narrow .lane-name .val,
      .tl.narrow .collapse {
        display: none;
      }
      .row,
      .ruler {
        display: grid;
        grid-template-columns: var(--head) var(--tw, minmax(0, 1fr));
      }
      .row {
        min-height: var(--row);
      }
      .ruler {
        position: sticky;
        top: 0;
        z-index: 6;
        height: 36px;
        border-bottom: 1px solid var(--mc-divider);
        background: var(--mc-surface-2);
      }
      .ruler-head {
        position: sticky;
        left: 0; /* physical */
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 0 8px 0 12px;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mc-text-2);
        background: var(--mc-surface-2);
        border-right: 1px solid var(--mc-divider); /* physical */
      }
      .ruler-track {
        position: relative;
        cursor: ew-resize;
        touch-action: none;
        overflow: hidden;
      }
      .ruler-track:focus-visible {
        outline-offset: -2px;
      }
      .tick {
        position: absolute;
        bottom: 0;
        width: 1px;
        height: 5px;
        background: var(--mc-field-border);
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--at)); /* physical */
      }
      .tick.major {
        height: 9px;
        background: var(--mc-text-2);
      }
      .tick-label {
        position: absolute;
        top: 5px;
        transform: translateX(-50%);
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--at)); /* physical */
        font-size: 0.6875rem;
        font-variant-numeric: tabular-nums;
        color: var(--mc-text-2);
        pointer-events: none;
        white-space: nowrap;
      }
      .tick-label.first {
        transform: translateX(-2px);
      }
      .tick-label.last {
        transform: translateX(calc(-100% + 2px));
      }
      .ph-tag {
        position: absolute;
        top: 3px;
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--t)); /* physical */
        transform: translateX(-50%);
        z-index: 4;
        padding: 2px 6px;
        border-radius: 6px;
        background: var(--mc-accent-fill);
        color: var(--mc-on-accent);
        font-size: 0.6875rem;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
        pointer-events: none;
        white-space: nowrap;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }
      .ph-tag::after {
        content: '';
        position: absolute;
        left: 50%; /* physical */
        bottom: -4px;
        width: 8px;
        height: 8px;
        margin-left: -4px; /* physical */
        background: inherit;
        transform: rotate(45deg);
        border-radius: 1px;
        z-index: -1;
      }
      .ph-line {
        position: absolute;
        top: 36px;
        bottom: 0;
        width: 2px;
        margin-left: -1px; /* physical */
        left: calc(var(--head) + var(--inset) + (100% - var(--head) - 2 * var(--inset)) * var(--t)); /* physical */
        background: var(--ph);
        z-index: 3;
        pointer-events: none;
      }
      .onion-band {
        position: absolute;
        top: 36px;
        bottom: 0;
        left: calc(var(--head) + var(--inset) + (100% - var(--head) - 2 * var(--inset)) * var(--a)); /* physical */
        width: calc((100% - var(--head) - 2 * var(--inset)) * (var(--b) - var(--a)));
        background: repeating-linear-gradient(135deg, color-mix(in srgb, var(--mc-text) 5%, transparent) 0 6px, transparent 6px 12px);
        border-left: 1px dashed var(--mc-field-border); /* physical */
        border-right: 1px dashed var(--mc-field-border); /* physical */
        pointer-events: none;
        z-index: 0;
      }
      .ghost {
        position: absolute;
        bottom: 4px;
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--at)); /* physical */
        width: 10px;
        height: 10px;
        margin-left: -5px; /* physical */
        border: 1.5px dashed var(--mc-text-2);
        border-radius: 2px;
        transform: rotate(45deg);
        pointer-events: none;
      }
      .lanes {
        position: relative;
        touch-action: pan-x pan-y;
      }
      .lane {
        border-top: 1px solid var(--mc-divider);
      }
      .lane.summary {
        min-height: 40px;
        background: color-mix(in srgb, var(--mc-surface-2) 45%, var(--mc-surface));
      }
      .lanes > .lane.summary:first-child {
        border-top: 0;
      }
      .head {
        position: sticky;
        left: 0; /* physical */
        z-index: 4;
        display: flex;
        align-items: center;
        gap: 2px;
        min-width: 0;
        padding: 0 2px 0 4px;
        background: var(--mc-surface);
        border-right: 1px solid var(--mc-divider); /* physical */
      }
      .lane.summary .head {
        background: color-mix(in srgb, var(--mc-surface-2) 45%, var(--mc-surface));
      }
      .lane.sub .head {
        padding-left: 20px; /* physical */
      }
      .lane.active .head {
        background: var(--mc-surface-2);
      }
      .collapse {
        flex: none;
      }
      .collapse ha-icon {
        transition: transform 0.15s ease-out;
      }
      .collapse[aria-expanded='false'] ha-icon {
        transform: rotate(-90deg);
      }
      .lane-name {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        min-height: 32px;
        padding: 0 6px;
        border: 0;
        border-radius: 6px;
        background: transparent;
        text-align: start;
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--mc-text);
      }
      .lane.sub .lane-name {
        font-weight: 400;
      }
      .lane-name:hover {
        background: var(--mc-surface-2);
      }
      .lane-name ha-icon {
        --mdc-icon-size: 16px;
        color: var(--mc-text-2);
        flex: none;
      }
      .lane.target-active .lane-name ha-icon {
        color: var(--mc-accent-ink);
      }
      .lane-name .nm {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .lane-name .val {
        flex: none;
        max-width: 64px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: var(--mc-mono);
        font-size: 0.6875rem;
        font-weight: 400;
        color: var(--mc-text-2);
        font-variant-numeric: tabular-nums;
      }
      .val .sw {
        display: inline-block;
        width: 14px;
        height: 14px;
        vertical-align: middle;
        border-radius: 4px;
        border: 1px solid var(--mc-field-border);
      }
      .head .icon-btn.sm {
        width: 28px;
        height: 28px;
        --mdc-icon-size: 16px;
      }
      .track {
        position: relative;
        min-width: 0;
        cursor: crosshair;
        background-image: linear-gradient(to right, var(--grid-major) 1px, transparent 1px), linear-gradient(to right, var(--grid-line) 1px, transparent 1px);
        background-size:
          calc((100% - 2 * var(--inset)) / 4) 100%,
          calc((100% - 2 * var(--inset)) / 20) 100%;
        background-position:
          var(--inset) 0,
          var(--inset) 0;
        background-repeat: repeat-x;
        background-clip: content-box;
        padding: 0 var(--inset);
        touch-action: pan-x pan-y;
      }
      .span {
        position: absolute;
        top: 50%;
        height: 2px;
        margin-top: -1px;
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--a)); /* physical */
        width: calc((100% - 2 * var(--inset)) * (var(--b) - var(--a)));
        background: color-mix(in srgb, var(--mc-text-2) 45%, transparent);
        border-radius: 1px;
        pointer-events: none;
      }
      /* a lane segment with its own easing */
      .span.own {
        height: 3px;
        margin-top: -1.5px;
        background: repeating-linear-gradient(90deg, var(--mc-text-2) 0 4px, transparent 4px 7px);
      }
      .lane.summary .span {
        height: 24px;
        margin-top: -12px;
        background: none;
      }
      .span svg {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
      }
      .span path {
        fill: none;
        stroke: color-mix(in srgb, var(--mc-text-2) 60%, transparent);
        stroke-width: 1.5;
        vector-effect: non-scaling-stroke;
      }
      .span .area {
        fill: color-mix(in srgb, var(--mc-text-2) 8%, transparent);
        stroke: none;
      }
      .span.sel path {
        stroke: var(--mc-accent);
      }
      .span.sel {
        background: color-mix(in srgb, var(--mc-accent) 55%, transparent);
      }
      .lane.summary .span.sel {
        background: none;
      }
      .key.locked {
        opacity: 0.55;
        cursor: not-allowed;
      }
      .key {
        position: absolute;
        top: 50%;
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--at)); /* physical */
        width: 24px;
        height: 32px;
        margin: -16px 0 0 -12px;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: grab;
        z-index: 2;
        touch-action: none;
      }
      .key::before {
        content: '';
        position: absolute;
        left: 50%; /* physical */
        top: 50%;
        width: 11px;
        height: 11px;
        margin: -5.5px 0 0 -5.5px;
        border-radius: 2px;
        transform: rotate(45deg);
        background: var(--key-ink);
        box-shadow: 0 0 0 2px var(--mc-surface);
        transition:
          transform 0.15s ease-out,
          background-color 0.15s ease-out,
          box-shadow 0.15s ease-out;
      }
      .lane.summary .key::before {
        width: 13px;
        height: 13px;
        margin: -6.5px 0 0 -6.5px;
        background: var(--mc-surface);
        box-shadow:
          inset 0 0 0 2px var(--mc-text),
          0 0 0 2px var(--mc-surface);
      }
      .key:hover::before {
        transform: rotate(45deg) scale(1.2);
      }
      .key.sel::before {
        background: var(--mc-accent-fill);
        box-shadow:
          0 0 0 2px var(--mc-surface),
          0 0 0 4px color-mix(in srgb, var(--mc-accent) 45%, transparent);
      }
      .lane.summary .key.sel::before {
        background: var(--mc-accent-fill);
        box-shadow:
          inset 0 0 0 2px var(--mc-accent-fill),
          0 0 0 2px var(--mc-surface),
          0 0 0 4px color-mix(in srgb, var(--mc-accent) 45%, transparent);
      }
      .key.onion::after {
        content: '';
        position: absolute;
        left: 50%; /* physical */
        top: 50%;
        width: 19px;
        height: 19px;
        margin: -9.5px 0 0 -9.5px;
        border: 1.5px dashed var(--mc-text-2);
        border-radius: 4px;
        transform: rotate(45deg);
        pointer-events: none;
      }
      .key:focus-visible {
        outline: none;
      }
      .key:focus-visible::before {
        box-shadow:
          0 0 0 2px var(--mc-surface),
          0 0 0 4px var(--mc-accent);
      }
      .key.dragging {
        cursor: grabbing;
      }
      .band {
        position: absolute;
        z-index: 5;
        border: 1px solid var(--mc-accent);
        background: var(--mc-accent-tint);
        border-radius: 2px;
        pointer-events: none;
      }
      .empty-lanes,
      .empty-group {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
        border-top: 1px solid var(--mc-divider);
        font-size: 0.8125rem;
        color: var(--mc-text-2);
      }
      .empty-group {
        position: sticky;
        left: 0; /* physical */
        width: max-content;
        max-width: 100cqw;
        padding-left: 24px; /* physical */
        border-top: 0;
        font-size: 0.75rem;
      }
      /* ── footer: snapping, ruler unit, zoom ── */
      .tl-foot {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px 6px;
        padding: 4px 8px;
        border-top: 1px solid var(--mc-divider);
        background: color-mix(in srgb, var(--mc-surface-2) 55%, var(--mc-surface));
      }
      .tl-foot .icon-btn.sm {
        width: 30px;
        height: 30px;
        --mdc-icon-size: 17px;
      }
      .grid-select {
        width: 92px;
      }
      .grid-select select.input {
        min-height: 30px;
        padding-top: 2px;
        padding-bottom: 2px;
        font-size: 0.8125rem;
      }
      .unit-btn {
        min-width: 34px;
        height: 30px;
        padding: 0 8px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius);
        background: var(--mc-surface);
        color: var(--mc-text);
        font-size: 0.75rem;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
      }
      .unit-btn:hover {
        background: var(--mc-surface-2);
      }
      .zoom-pct {
        min-width: 44px;
        text-align: center;
        font-size: 0.75rem;
        font-variant-numeric: tabular-nums;
        color: var(--mc-text-2);
      }
      kbd {
        display: inline-block;
        min-width: 18px;
        padding: 1px 5px;
        border: 1px solid var(--mc-divider);
        border-bottom-width: 2px;
        border-radius: 4px;
        background: var(--mc-surface);
        font-family: var(--mc-mono);
        font-size: 0.6875rem;
        line-height: 1.4;
        color: var(--mc-text);
        text-align: center;
      }
      /* ── narrow: keyframe list ── */
      .kf-list {
        display: grid;
        gap: 0;
        margin: 0;
        padding: 0;
        list-style: none;
        border-top: 1px solid var(--mc-divider);
      }
      .kf-row {
        display: grid;
        grid-template-columns: 56px minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        width: 100%;
        min-height: 48px;
        padding: 6px 12px;
        border: 0;
        border-top: 1px solid var(--mc-divider);
        background: transparent;
        text-align: start;
      }
      .kf-list li:first-child .kf-row {
        border-top: 0;
      }
      .kf-row:hover {
        background: var(--mc-surface-2);
      }
      .kf-row[aria-pressed='true'] {
        background: var(--mc-accent-tint);
      }
      .kf-row[aria-pressed='true'] .at {
        color: var(--mc-accent-ink);
      }
      .kf-row:focus-visible {
        outline-offset: -2px;
      }
      .kf-row .at {
        font-family: var(--mc-mono);
        font-size: 0.8125rem;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
      }
      .kf-row .props {
        min-width: 0;
        font-size: 0.8125rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .kf-row .props small {
        display: block;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .kf-row .ease {
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      @container kf (max-width: 560px) {
        .readout .now {
          min-width: 88px;
        }
        .add-btn .lbl {
          display: none;
        }
      }
    `,
  ];

  protected render(): TemplateResult {
    const doc = this._view;
    if (!doc) return html``;
    const narrow = this._narrow;
    return html`
      <div class="shell" @keydown=${this._onTimelineKeydown}>
        ${this._renderBar(narrow)} ${narrow ? this._renderNarrow() : this._renderTimeline()}
        <div class="sr-only" role="status" aria-live="polite">${this._status}</div>
      </div>
    `;
  }

  /** The property list of the Add property button: the kit menu, one entry per free lane, a rule between lane groups. */
  private _renderAddMenu(free: ReturnType<typeof lanesFor>, active: TargetRef, at: number): TemplateResult {
    const items: UiMenuEntry[] = free.map((l, i) => ({ id: l.id, label: t(l.label), icon: l.icon, separatorBefore: i > 0 && free[i - 1].group !== l.group }));
    return html`<mc-ui-menu
      class="add-menu"
      .items=${items}
      label=${t('anim-studio.keyframes-editor.add-property-to-target-at-the-playhead', { target: targetLabel(this._view!, active), at: pctText(at) })}
      @mc-menu-pick=${(e: CustomEvent<UiMenuPick>) => {
        e.stopPropagation();
        this._addLane(e.detail.id as LaneId);
      }}
      @mc-menu-close=${(e: CustomEvent<{ reason: string }>) => {
        e.stopPropagation();
        if (e.detail.reason === 'outside') this._menuClosedAt = Date.now();
        this._menuOpen = false;
      }}
    ></mc-ui-menu>`;
  }

  private _renderBar(narrow: boolean): TemplateResult {
    const at = this.time * 100;
    const secs = (this._view!.duration * this.time).toFixed(2);
    const o = this.onion;
    const active = this._active;
    const used = new Set(usedLanes(this._kfsOf(active)));
    const free = lanesFor(active).filter((l) => !used.has(l.id));
    const clip = keyClipboard();
    return html`
      <div class="bar">
        <div class="readout" role="group" aria-label=${t('anim-studio.keyframes-editor.playhead')}>
          <button
            type="button"
            class="icon-btn sm"
            aria-label=${t('anim-studio.keyframes-editor.previous-keyframe')}
            title=${t('anim-studio.keyframes-editor.previous-keyframe')}
            ?disabled=${o.prev === undefined}
            @click=${() => this._jump(-1)}
          >
            <ha-icon icon="mdi:skip-previous"></ha-icon>
          </button>
          <span class="now">${pctText(at)} <small>${secs} s</small></span>
          <button
            type="button"
            class="icon-btn sm"
            aria-label=${t('anim-studio.keyframes-editor.next-keyframe')}
            title=${t('anim-studio.keyframes-editor.next-keyframe')}
            ?disabled=${o.next === undefined}
            @click=${() => this._jump(1)}
          >
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </button>
        </div>
        <button
          type="button"
          class="btn btn-secondary btn-sm add-btn"
          aria-haspopup="menu"
          aria-expanded=${this._menuOpen ? 'true' : 'false'}
          title=${t('anim-studio.keyframes-editor.add-a-property-to-target', { target: targetLabel(this._view!, active) })}
          ?disabled=${this.disabled || !free.length}
          @click=${() => {
            if (this._menuOpen) this._menuOpen = false;
            else if (Date.now() - this._menuClosedAt > 400) this._menuOpen = true;
          }}
        >
          <ha-icon icon="mdi:plus"></ha-icon><span class="lbl">${narrow ? t('anim-studio.keyframes-editor.property') : t('anim-studio.keyframes-editor.add-property')}</span>
        </button>
        ${this._menuOpen ? this._renderAddMenu(free, active, at) : nothing}
        <span class="spacer"></span>
        <div class="tools" role="toolbar" aria-label=${t('anim-studio.keyframes-editor.keyframe-tools')}>
          <button
            type="button"
            class="icon-btn sm"
            data-act="copy"
            aria-label=${t('anim-studio.keyframes-editor.copy-keyframes')}
            title=${t('anim-studio.keyframes-editor.copy-ctrl-c')}
            ?disabled=${!this._keys.length}
            @click=${this._copy}
          >
            <ha-icon icon="mdi:content-copy"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm"
            data-act="paste"
            aria-label=${t('anim-studio.keyframes-editor.paste-keyframes-at-the-playhead')}
            title=${clip ? t('anim-studio.keyframes-editor.paste-at-the-playhead-into-target-ctrl-v', { target: targetLabel(this._view!, active) }) : t('anim-studio.keyframes-editor.copy-keyframes-first')}
            ?disabled=${!clip || this.disabled}
            @click=${this._paste}
          >
            <ha-icon icon="mdi:content-paste"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm danger"
            data-act="delete"
            aria-label=${t('anim-studio.keyframes-editor.delete-keyframes')}
            title=${t('anim-studio.keyframes-editor.delete-del')}
            ?disabled=${!this._keys.length || this.disabled}
            @click=${this._delete}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
          <span class="sep" aria-hidden="true"></span>
          <button
            type="button"
            class="icon-btn sm"
            data-act="onion"
            aria-pressed=${this.onionSkin ? 'true' : 'false'}
            aria-label=${t('anim-studio.keyframes-editor.onion-skin')}
            title=${t('anim-studio.keyframes-editor.onion-skin-mark-the-keyframes-around-the')}
            @click=${() => (this.onionSkin = !this.onionSkin)}
          >
            <ha-icon icon="mdi:layers-triple-outline"></ha-icon>
          </button>
        </div>
      </div>
    `;
  }

  private _renderRuler(): TemplateResult {
    const now = Math.min(1, Math.max(0, this.time));
    const o = this.onionSkin ? this.onion : {};
    const narrow = this._narrow;
    const ppp = this._pxPerPct();
    const ticks = rulerTicks(narrow ? Math.min(ppp, 2.5) : ppp, this._view!.duration, this._unit);
    const labels = ticks.major.filter((p) => Math.abs(p - now * 100) * ppp > 34);
    return html`
      <div class="ruler">
        <div class="ruler-head">${narrow ? '' : this._unit === 's' ? t('anim-studio.keyframes-editor.seconds') : t('anim-studio.keyframes-editor.cycle')}</div>
        <div
          class="ruler-track"
          role="slider"
          tabindex="0"
          aria-label=${t('anim-studio.keyframes-editor.playhead')}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${round1(now * 100)}
          aria-valuetext=${t('anim-studio.keyframes-editor.pct-seconds-seconds', { pct: pctText(now * 100), seconds: (this._view!.duration * now).toFixed(2) })}
          @pointerdown=${this._onRulerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerUp}
          @keydown=${this._onRulerKey}
        >
          ${ticks.minor.map((p) => html`<i class="tick" style="--at: ${p / 100}"></i>`)}
          ${ticks.major.map((p) => html`<i class="tick major" style="--at: ${p / 100}"></i>`)}
          ${labels.map((p) => html`<span class="tick-label ${p === 0 ? 'first' : p >= 99.999 ? 'last' : ''}" style="--at: ${p / 100}">${ticks.label(p)}</span>`)}
          ${o.prev !== undefined ? html`<i class="ghost" style="--at: ${o.prev / 100}"></i>` : nothing}
          ${o.next !== undefined ? html`<i class="ghost" style="--at: ${o.next / 100}"></i>` : nothing}
          <span class="ph-tag" style="--t: ${now}">${this._unit === 's' ? `${(this._view!.duration * now).toFixed(2)} s` : pctText(now * 100)}</span>
        </div>
      </div>
    `;
  }

  private _overlays(): TemplateResult {
    const t = Math.min(1, Math.max(0, this.time));
    const o = this.onionSkin ? this.onion : {};
    const a = o.prev ?? (o.next !== undefined ? t * 100 : undefined);
    const b = o.next ?? (o.prev !== undefined ? t * 100 : undefined);
    return html`
      ${this.onionSkin && a !== undefined && b !== undefined ? html`<div class="onion-band" style="--a: ${a / 100}; --b: ${b / 100}" aria-hidden="true"></div>` : nothing}
      <div class="ph-line" style="--t: ${t}" aria-hidden="true"></div>
    `;
  }

  private _laneTab(target: TargetRef, lane: KeyLane, times: number[]): number | undefined {
    const remembered = this._laneFocus.get(`${target}|${lane}`);
    if (remembered !== undefined && times.includes(remembered)) return remembered;
    return this._keys.find((s) => s.target === target && s.lane === lane && times.includes(s.at))?.at ?? times[0];
  }

  private _renderKeys(g: TimelineTrack, lane: KeyLane, times: number[]): TemplateResult[] {
    const kfs = g.keyframes;
    const target = g.target;
    const main = this._main;
    const tab = this._laneTab(target, lane, times);
    const o = this.onionSkin && target === this._active ? this.onion : {};
    const tname = target === main && this._groups().length === 1 ? '' : `${targetLabel(this._view!, target)} `;
    const name = lane === '*' ? (tname ? t('anim-studio.keyframes-editor.target-keyframe', { target: tname.trim() }) : t('anim-studio.keyframes-editor.keyframe')) : tname ? t('anim-studio.keyframes-editor.target-lane-keyframe', { target: tname.trim(), lane: laneLabel(lane).toLowerCase() }) : t('anim-studio.keyframes-editor.lane-keyframe', { lane: laneLabel(lane).toLowerCase() });
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    const spans = times.slice(0, -1).map((a, i) => {
      const b = times[i + 1];
      const sel = this._isSel({ target, lane, at: a }) && this._isSel({ target, lane, at: b });
      if (lane !== '*')
        return html`<i class="span ${sel ? 'sel' : ''} ${laneEasingOverride(kfs, lane, a) ? 'own' : ''}" style="--a: ${a / 100}; --b: ${b / 100}"></i>`;
      const bz = bezierOf(keyEasing(kfs, a) ?? this._view!.easing);
      const d = bz ? `M0 20 C${bz[0] * 100} ${20 - bz[1] * 16} ${bz[2] * 100} ${20 - bz[3] * 16} 100 4` : 'M0 20 L100 4';
      return html`<i class="span ${sel ? 'sel' : ''}" style="--a: ${a / 100}; --b: ${b / 100}">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
          ${svg`<path class="area" d="${d} L100 24 L0 24 Z"></path><path d=${d}></path>`}
        </svg>
      </i>`;
    });
    const keys = times.map((at) => {
      const k: TKey = { target, lane, at };
      const sel = this._isSel(k);
      const val = lane === '*' ? this._kfLanesText(kfs, at) : fragmentText(lane, keyFragment(kfs, lane, at));
      const locked = this._isLocked(k);
      return html`<button
        type="button"
        class="key ${sel ? 'sel' : ''} ${locked ? 'locked' : ''} ${at === o.prev || at === o.next ? 'onion' : ''} ${this._drag?.kind === 'keys' && sel ? 'dragging' : ''}"
        style="--at: ${at / 100}"
        data-key=${tkeyId(k, main)}
        data-lane=${lane}
        data-target=${target}
        data-at=${at}
        role="slider"
        tabindex=${at === tab ? '0' : '-1'}
        aria-label=${label}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${at}
        aria-valuetext=${[pctText(at), val, sel ? t('anim-studio.keyframes-editor.selected') : '', locked ? t('anim-studio.keyframes-editor.locked') : ''].filter(Boolean).join(', ')}
        aria-describedby="kf-help"
        title=${val ? t('anim-studio.keyframes-editor.label-at-at-value', { label, at: pctText(at), value: val }) : t('anim-studio.keyframes-editor.label-at-at', { label, at: pctText(at) })}
        @pointerdown=${(e: PointerEvent) => this._onKeyDown(e, k)}
        @keydown=${(e: KeyboardEvent) => this._onKeyKeydown(e, k)}
        @focus=${() => this._laneFocus.set(`${target}|${lane}`, at)}
        @dblclick=${(e: Event) => e.stopPropagation()}
      ></button>`;
    });
    return [...spans, ...keys];
  }

  private _kfLanesText(kfs: AnimationKeyframe[], at: number): string {
    return usedLanes(kfs.filter((k) => k.at === at))
      .map((l) => laneLabel(l))
      .join(', ');
  }

  /** A target group's head row: collapse, the target's name (selects its keys), add a whole keyframe. */
  private _renderGroupHead(g: TimelineTrack, single: boolean): TemplateResult {
    const times = laneTimes(g.keyframes, '*');
    const name = targetLabel(this._view!, g.target);
    const open = !this._collapsed.has(g.target);
    const active = g.target === this._active && !single;
    return html`
      <div
        class="row lane summary ${active ? 'target-active' : ''} ${this._keys.some((s) => s.target === g.target && s.lane === '*') ? 'active' : ''}"
        data-lane="*"
        data-target=${g.target}
        role="group"
        aria-label=${t('anim-studio.keyframes-editor.name-keyframes', { name })}
      >
        <div class="head">
          <button
            type="button"
            class="icon-btn sm collapse"
            aria-expanded=${open ? 'true' : 'false'}
            aria-label=${open ? t('anim-studio.keyframes-editor.collapse-name', { name }) : t('anim-studio.keyframes-editor.expand-name', { name })}
            title=${open ? t('anim-studio.keyframes-editor.collapse') : t('anim-studio.keyframes-editor.expand')}
            @click=${() => this._toggleGroup(g.target)}
          >
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <button
            type="button"
            class="lane-name"
            title=${t('anim-studio.keyframes-editor.select-every-name-keyframe-shift-adds', { name: name.toLowerCase() })}
            @click=${(e: MouseEvent) => this._selectLane(g.target, '*', e.shiftKey || e.ctrlKey || e.metaKey)}
          >
            <ha-icon icon=${targetIcon(g.target)}></ha-icon>
            <span class="nm">${name}</span>
          </button>
          <button
            type="button"
            class="icon-btn sm lane-add"
            aria-label=${t('anim-studio.keyframes-editor.add-a-name-keyframe-at-the-playhead', { name: name.toLowerCase() })}
            title=${t('anim-studio.keyframes-editor.add-a-keyframe-at-the-playhead')}
            ?disabled=${this.disabled}
            @click=${() => this._add(g.target, '*', this.time * 100)}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
        <div
          class="track"
          @pointerdown=${(e: PointerEvent) => this._onTrackDown(e, g.target)}
          @dblclick=${(e: MouseEvent) => this._onTrackDblClick(e, g.target, '*')}
        >
          ${this._renderKeys(g, '*', times)}
        </div>
      </div>
    `;
  }

  private _renderLane(g: TimelineTrack, lane: LaneId): TemplateResult {
    const kfs = g.keyframes;
    const times = laneTimes(kfs, lane);
    const def = LANE_BY_ID[lane];
    const now = fragmentText(def.id, sampleLane(kfs, def.id, this.time * 100, this._view!.easing));
    const active = this._keys.some((s) => s.target === g.target && s.lane === lane);
    return html`
      <div class="row lane sub ${active ? 'active' : ''}" data-lane=${lane} data-target=${g.target} role="group" aria-label=${t('anim-studio.keyframes-editor.label-lane', { label: t(def.label) })}>
        <div class="head">
          <button
            type="button"
            class="lane-name"
            title=${t('anim-studio.keyframes-editor.select-every-name-keyframe-shift-adds', { name: t(def.label).toLowerCase() })}
            @click=${(e: MouseEvent) => this._selectLane(g.target, lane, e.shiftKey || e.ctrlKey || e.metaKey)}
          >
            <ha-icon icon=${def.icon}></ha-icon>
            <span class="nm">${t(def.label)}</span>
            ${now ? this._laneValue(kfs, def.id, now) : nothing}
          </button>
          <button
            type="button"
            class="icon-btn sm lane-add"
            aria-label=${t('anim-studio.keyframes-editor.add-name-keyframe-at-the-playhead', { name: t(def.label).toLowerCase() })}
            title=${t('anim-studio.keyframes-editor.add-a-keyframe-at-the-playhead')}
            ?disabled=${this.disabled}
            @click=${() => this._add(g.target, lane, this.time * 100)}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
        <div
          class="track"
          @pointerdown=${(e: PointerEvent) => this._onTrackDown(e, g.target)}
          @dblclick=${(e: MouseEvent) => this._onTrackDblClick(e, g.target, lane)}
        >
          ${this._renderKeys(g, lane, times)}
        </div>
      </div>
    `;
  }

  /** The lane's value at the playhead: a number, or a swatch for colours / shadows. */
  private _laneValue(kfs: AnimationKeyframe[], lane: LaneId, text: string): TemplateResult {
    const f = sampleLane(kfs, lane, this.time * 100, this._view!.easing) ?? {};
    const swatch = (bg: string, extra = '') =>
      html`<span class="val" title=${t('anim-studio.keyframes-editor.at-the-playhead-text', { text })}><i class="sw" style="background: ${bg};${extra}"></i></span>`;
    const anim = (v: string) => v.replace(/var\(--mc-anim-c\)/g, this.entityColor);
    if (lane === 'color' && f.color) return swatch(anim(f.color));
    if (lane === 'background' && f.background) return swatch(anim(f.background));
    if (lane === 'stroke' && f.stroke) return swatch(anim(f.stroke));
    if (lane === 'shadow' && f.shadow)
      return swatch(
        'var(--mc-surface)',
        `box-shadow: ${f.shadow === 'none' ? 'none' : anim(f.shadow).replace(/(\d+(?:\.\d+)?)px/g, (_, n) => `${Math.min(4, Number(n) / 4)}px`)}`,
      );
    if (lane === 'filter' && f.filter)
      return html`<span class="val" title=${t('anim-studio.keyframes-editor.at-the-playhead-filter', { filter: f.filter })}>${f.filter.match(/^[a-z-]+/)?.[0] ?? f.filter}</span>`;
    return html`<span class="val" title=${t('anim-studio.keyframes-editor.at-the-playhead-text', { text })}>${text}</span>`;
  }

  /** The zoomed tracks' width (px); undefined at 100% (the tracks fill the body). */
  private _trackWidth(): string | undefined {
    if (this._zoom <= 1 || !this._viewW) return undefined;
    const head = this._narrow ? HEAD_NARROW : HEAD;
    return `${Math.round(Math.max(100, this._viewW - head) * this._zoom)}px`;
  }

  private _renderTimeline(): TemplateResult {
    const groups = this._groups();
    const single = groups.length === 1;
    const rows: TemplateResult[] = [];
    for (const g of groups) {
      rows.push(this._renderGroupHead(g, single));
      if (this._collapsed.has(g.target)) continue;
      const used = usedLanes(g.keyframes);
      for (const id of used) rows.push(this._renderLane(g, id));
      if (!used.length && !g.main) rows.push(html`<div class="empty-group">${t('anim-studio.keyframes-editor.no-keyframes-yet-use-add-property-or')}</div>`);
    }
    const b = this._band;
    const tw = this._trackWidth();
    const nothingYet = groups.every((g) => !usedLanes(g.keyframes).length);
    return html`
      <div class="tl" role="group" aria-label=${t('anim-studio.keyframes-editor.keyframe-timeline')}>
        <div class="tl-body" @wheel=${this._onWheel}>
          <div class="tl-content" style=${tw ? `--tw: ${tw}` : ''}>
            ${this._renderRuler()}
            <div class="lanes" @pointermove=${this._onPointerMove} @pointerup=${this._onPointerUp} @pointercancel=${this._onPointerUp}>
              ${rows}
              ${
                b
                  ? html`<div
                      class="band"
                      style="left: ${Math.min(b.x0, b.x1)}px; top: ${Math.min(b.y0, b.y1)}px; width: ${Math.abs(b.x1 - b.x0)}px; height: ${Math.abs(b.y1 - b.y0)}px"
                    ></div>`
                  : nothing
              }
            </div>
            ${nothingYet ? html`<div class="empty-lanes"><ha-icon icon="mdi:information-outline"></ha-icon>${t('anim-studio.keyframes-editor.no-properties-animate-yet-use-add')}</div>` : nothing}
            ${this._overlays()}
          </div>
        </div>
        ${this._renderFoot()}
        <span class="sr-only" id="kf-help">
          ${t('anim-studio.keyframes-editor.drag-to-move-snaps-shift-free-alt')}
        </span>
      </div>
    `;
  }

  private _renderFoot(): TemplateResult {
    const z = this._zoom;
    return html`<div class="tl-foot" role="toolbar" aria-label=${t('anim-studio.keyframes-editor.timeline-view')}>
      <button
        type="button"
        class="icon-btn sm"
        data-act="snap"
        aria-pressed=${this._snap ? 'true' : 'false'}
        aria-label=${t('anim-studio.keyframes-editor.snapping')}
        title=${t('anim-studio.keyframes-editor.snap-to-keyframes-the-playhead-and-the')}
        @click=${() => (this._snap = !this._snap)}
      >
        <ha-icon icon="mdi:magnet"></ha-icon>
      </button>
      <label class="grid-select">
        <span class="sr-only">${t('anim-studio.keyframes-editor.snap-grid')}</span>
        <div class="select">
          <select
            class="input"
            data-act="grid"
            aria-label=${t('anim-studio.keyframes-editor.snap-grid')}
            ?disabled=${!this._snap}
            @change=${(e: Event) => (this._grid = (e.target as HTMLSelectElement).value as SnapGrid)}
          >
            ${SNAP_GRIDS.map((g) => html`<option value=${g.id} ?selected=${g.id === this._grid}>${t(g.label)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </label>
      <button
        type="button"
        class="unit-btn"
        data-act="units"
        aria-label=${this._unit === 's' ? t('anim-studio.keyframes-editor.ruler-in-seconds-show-percent') : t('anim-studio.keyframes-editor.ruler-in-percent-show-seconds')}
        title=${t('anim-studio.keyframes-editor.ruler-in-percent-of-the-cycle-or-in')}
        @click=${() => (this._unit = this._unit === 's' ? 'pct' : 's')}
      >
        ${this._unit === 's' ? 's' : '%'}
      </button>
      <span class="spacer"></span>
      <button
        type="button"
        class="icon-btn sm"
        data-act="zoom-out"
        aria-label=${t('anim-studio.keyframes-editor.zoom-out')}
        title=${t('anim-studio.keyframes-editor.zoom-out-ctrl')}
        ?disabled=${z <= 1}
        @click=${() => this._setZoom(zoomStep(z, -1))}
      >
        <ha-icon icon="mdi:magnify-minus-outline"></ha-icon>
      </button>
      <span class="zoom-pct" aria-live="polite" title=${t('anim-studio.keyframes-editor.ctrl-wheel-zooms')}>${Math.round(z * 100)}%</span>
      <button
        type="button"
        class="icon-btn sm"
        data-act="zoom-in"
        aria-label=${t('anim-studio.keyframes-editor.zoom-in')}
        title=${t('anim-studio.keyframes-editor.zoom-in-ctrl')}
        ?disabled=${z >= 10}
        @click=${() => this._setZoom(zoomStep(z, 1))}
      >
        <ha-icon icon="mdi:magnify-plus-outline"></ha-icon>
      </button>
      <button
        type="button"
        class="icon-btn sm"
        data-act="zoom-fit"
        aria-label=${t('anim-studio.keyframes-editor.fit-the-cycle')}
        title=${t('anim-studio.keyframes-editor.fit-the-whole-cycle')}
        ?disabled=${z <= 1}
        @click=${() => this._setZoom(1)}
      >
        <ha-icon icon="mdi:arrow-expand-horizontal"></ha-icon>
      </button>
    </div>`;
  }

  private _renderNarrow(): TemplateResult {
    const target = this._active;
    const kfs = this._kfsOf(target);
    const g: TimelineTrack = { target, keyframes: kfs, main: target === this._main };
    const times = laneTimes(kfs, '*');
    return html`
      <div class="tl narrow" role="group" aria-label=${t('anim-studio.keyframes-editor.keyframe-timeline')}>
        <div class="tl-body">
          <div class="tl-content">
            ${this._renderRuler()}
            <div class="lanes" @pointermove=${this._onPointerMove} @pointerup=${this._onPointerUp} @pointercancel=${this._onPointerUp}>
              ${this._renderGroupHead(g, true)}
            </div>
            ${this._overlays()}
          </div>
          <ul class="kf-list" aria-label=${t('anim-studio.keyframes-editor.keyframes')}>
            ${times.map((at) => {
              const k: TKey = { target, lane: '*', at };
              const sel = this._isSel(k);
              const lanes = this._kfLanesText(kfs, at);
              const e = keyEasing(kfs, at);
              const vals = usedLanes(kfs.filter((x) => x.at === at))
                .map((l) => fragmentText(l, keyFragment(kfs, l, at)))
                .filter(Boolean)
                .join(' · ');
              return html`<li>
                <button
                  type="button"
                  class="kf-row"
                  data-at=${at}
                  aria-pressed=${sel ? 'true' : 'false'}
                  @click=${(ev: MouseEvent) => {
                    const add = ev.shiftKey || ev.ctrlKey || ev.metaKey;
                    this._select(add ? (sel ? this._keys.filter((s) => !(s.target === target && s.lane === '*' && s.at === at)) : [...this._keys, k]) : [k]);
                  }}
                >
                  <span class="at">${pctText(at)}</span>
                  <span class="props">${lanes || t('anim-studio.keyframes-editor.empty-keyframe')}${vals ? html`<small>${vals}</small>` : nothing}</span>
                  <span class="ease">${easingLabel(e)}</span>
                </button>
              </li>`;
            })}
          </ul>
        </div>
        <span class="sr-only" id="kf-help">${t('anim-studio.keyframes-editor.arrows-move-the-keyframe-alt-and-arrows')}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-keyframes-editor': AnimKeyframesEditor;
  }
}
