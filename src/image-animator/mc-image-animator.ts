import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { ImageAnimation, ImageClip } from '../contracts/image-animation';
import { IMAGE_ANIMATOR_SAVED_EVENT, type ImageAnimatorSaved } from '../contracts/image-animator';
import { FRAME_WIDE_MIN_PX, UI_STUDIO_FRAME_TAG, type FrameDrawerChange, type FrameMeasure, type FrameModifiedChange, type StudioFrameElement, type StudioFrameStrings } from '../contracts/studio-frame';
import type { HomeAssistant } from '../types';
import { editorSystem } from '../css/editor-stack';
import { kitButtonExtras } from '../ui-kit/css/extras';
import { defineKitElements } from '../ui-kit/define-parts';
import { loadStudioFonts } from '../ui-kit';
import { StudioFrame } from '../ui-kit/frame/studio-frame';
import { createClip, deleteClip, duplicateClip, moveClip, parseWhen, renameClip, setClipPlay, setClipTiming, type ClipsError, type ClipTiming } from './clips';
import { clipsHaveEffects, clipsModified, renderClips, type ClipsPanelProps, type StateFields, type TriggerKind } from './clips-panel';
import { presetChoices, renderEffects, renderTargetList, effectLabel, targetName, type PanelProps } from './effects-panel';
import { t } from './i18n';
import { loadImageTools } from './image-loader';
import { renderMorph, type MorphPanelProps } from './morph/morph-panel';
import { addMorph } from './morph/writer';
import { startPreview, type Preview, type PreviewKit } from './preview';
import { openSource, type FailReason, type Opened, type Source } from './source';
import { animatorStyles } from './styles';
import { commitTargetId, listTargets, pickTarget, type ImageTarget } from './targets';
import { addEffect, effectAvailability, type EffectKind } from './tracks';
import { libraryImages, saveConfirmed, type UseNotice } from './usage';
import { heavyReasons, libraryWarning, type HeavyReason } from './warnings';

// The image animator window: opens a library image or an upload, shows it playing, and saves it back to the library.
// Fires `mc-image-animator-saved` on `opener` after each confirmed save, and `close` when the window should go.

type Phase = 'opening' | 'ready' | 'failed';

/** What a save writes, to tell whether anything is unsaved. */
const snapshot = (o: Opened): string => `${o.svg}\u0000${JSON.stringify(o.animation ?? null)}`;

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export class McImageAnimator extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) source?: Source;
  /** The element that opened the window; it receives the saved event and the focus again on close. */
  opener?: HTMLElement;
  @state() private _phase: Phase = 'opening';
  @state() private _opened?: Opened;
  @state() private _reason?: FailReason;
  @state() private _saving = false;
  @state() private _ask?: { notice: UseNotice; answer: (yes: boolean) => void };
  @state() private _libraryBytes = 0;
  @state() private _unchecked = false;
  @state() private _note: '' | 'saved' = '';
  /** Set while the discard question is open: the element that had the focus before it. */
  @state() private _leaving?: { from: HTMLElement | null };
  /** Close was asked for while a save was running; the window closes, or asks, once the save has settled. */
  @state() private _closeAfterSave = false;
  @state() private _target: ImageTarget = { ref: 'element', kind: 'image', generated: false };
  @state() private _targets: ImageTarget[] = [];
  @state() private _presetId = '';
  @state() private _path = '';
  @state() private _message = '';
  @state() private _morphFrom = '';
  @state() private _morphInto = '';
  @state() private _morphBack = false;
  @state() private _morphMessage = '';
  @state() private _clipId = '';
  @state() private _drafting = '';
  @state() private _clipMessage = '';
  /** The drawing's size in its own units and the scale it is shown at, so the rulers read in drawing units. */
  @state() private _view = { width: 100, height: 100, zoom: 1 };
  @state() private _drawerOpen = false;
  @state() private _narrow = false;
  @state() private _modifiedOnly = false;
  private _frame?: StudioFrameElement;
  private _observer?: ResizeObserver;
  /** The drawing and animation as last saved or opened; anything else is unsaved. */
  private _clean = '';
  private _started?: Promise<void>;
  private _svg?: SVGSVGElement;
  private _preview?: Preview;
  private _kit?: PreviewKit;

  static styles = [editorSystem, kitButtonExtras, animatorStyles];

  connectedCallback(): void {
    super.connectedCallback();
    defineKitElements([[UI_STUDIO_FRAME_TAG, StudioFrame]]);
    void loadStudioFonts();
    this._started ??= this._open();
  }

  /** Memoised: every caller waits for the same open. */
  private async _open(): Promise<void> {
    const source = this.source;
    const hass = this.hass;
    if (!source || !hass) return this._fail('failed');
    const tools = await loadImageTools();
    if (!tools) return this._fail('failed');
    tools.install();
    this._kit = tools.kit;
    const r = await openSource(hass, source);
    if (!r.ok) return this._fail(r.reason);
    this._opened = r;
    this._clean = snapshot(r);
    this._presetId = presetChoices()[0]?.id ?? '';
    this._phase = 'ready';
    void this._readLibrary();
  }

  private async _readLibrary(): Promise<void> {
    const images = this.hass ? await libraryImages(this.hass) : undefined;
    const w = libraryWarning(images ?? []);
    this._libraryBytes = w.show ? w.bytes : 0;
  }

  private _confirm(notice: UseNotice): Promise<boolean> {
    return new Promise((answer) => {
      this._ask = { notice, answer };
      void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('.confirm .btn-primary')?.focus());
    });
  }

  private _answer(yes: boolean): void {
    const ask = this._ask;
    this._ask = undefined;
    ask?.answer(yes);
  }

  private _fail(reason: FailReason): void {
    this._reason = reason;
    this._phase = 'failed';
  }

  private _announce(id: string): void {
    const detail: ImageAnimatorSaved = { id };
    (this.opener ?? this).dispatchEvent(new CustomEvent(IMAGE_ANIMATOR_SAVED_EVENT, { detail, bubbles: true, composed: true }));
  }

  /** Closes at once when nothing is unsaved; otherwise asks whether to discard the edits. During a save it waits for the result. */
  private _close(): void {
    if (this._ask) this._answer(false);
    if (this._leaving) return;
    if (this._saving) {
      this._closeAfterSave = true;
      return;
    }
    if (!this._opened || snapshot(this._opened) === this._clean) return this._discard();
    this._leaving = { from: (this.shadowRoot?.activeElement as HTMLElement | null) ?? null };
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('.leave .btn-secondary')?.focus());
  }

  private _keepEditing(): void {
    const from = this._leaving?.from;
    this._leaving = undefined;
    void this.updateComplete.then(() => (from?.isConnected ? from : this.renderRoot.querySelector<HTMLElement>('h2'))?.focus());
  }

  private _discard(): void {
    this._leaving = undefined;
    this.dispatchEvent(new CustomEvent('close'));
  }

  private async _save(): Promise<void> {
    const o = this._opened;
    const hass = this.hass;
    if (!o || !hass || this._saving) return;
    this._saving = true;
    this._note = '';
    this._reason = undefined;
    this._unchecked = false;
    let r: Awaited<ReturnType<typeof saveConfirmed>>;
    try {
      r = await saveConfirmed(
        hass,
        { id: o.id, name: o.name, svg: o.svg, viewBox: o.viewBox, bindings: o.bindings, animation: o.animation, baseUpdatedAt: o.updatedAt, isNew: o.isNew },
        (notice) => this._confirm(notice),
      );
    } catch {
      r = { ok: false, reason: 'failed' };
    } finally {
      this._saving = false;
    }
    if (r.ok) this._saved(o, r.id, r.notice.kind === 'unknown', r.summary?.updated_at);
    else if (r.reason !== 'cancelled') this._reason = r.reason;
    if (this._closeAfterSave) {
      this._closeAfterSave = false;
      this._close();
    }
  }

  /** Takes the library's id and time, marks what was sent as clean and tells the opener. */
  private _saved(o: Opened, id: string, unchecked: boolean, updatedAt: string | undefined): void {
    this._unchecked = unchecked;
    void this._readLibrary();
    const now = this._opened ?? o;
    this._opened = { ...now, id, isNew: false, updatedAt: updatedAt ?? now.updatedAt };
    this._clean = snapshot(o);
    this._note = 'saved';
    this._announce(id);
  }

  disconnectedCallback(): void {
    this._preview?.release();
    this._preview = undefined;
    this._observer?.disconnect();
    this._observer = undefined;
    this._frame = undefined;
    super.disconnectedCallback();
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has('_phase')) this.renderRoot.querySelector<HTMLElement>('h2')?.focus();
    if (this._phase === 'ready' && !this._svg) this._mountCanvas();
    if (this._phase === 'ready') this._watchFrame();
  }

  /** Once the frame is on screen: follows its size for the sheet and the drawing scale, and opens the drawer when there is room for it. */
  private _watchFrame(): void {
    const frame = this.renderRoot.querySelector<StudioFrameElement>(UI_STUDIO_FRAME_TAG);
    if (!frame || frame === this._frame) return;
    this._observer?.disconnect();
    this._frame = frame;
    this._observer = new ResizeObserver((entries) => {
      const r = entries[entries.length - 1]?.contentRect;
      if (r) this._fit(r.width, r.height);
    });
    this._observer.observe(frame);
    const box = frame.getBoundingClientRect();
    this._fit(box.width, box.height);
    if (!this._narrow) frame.openDrawer(this.renderRoot.querySelector<HTMLElement>('.settings'), 'user');
  }

  /** Chooses the scale that shows the whole drawing in the room the stage has, between a quarter and six times. */
  private _fit(width: number, height: number): void {
    this._narrow = width > 0 && width < FRAME_WIDE_MIN_PX;
    const room = Math.max(160, width - (this._narrow ? 0 : 344) - 96);
    const tall = Math.max(160, (height || 640) - 56 - 96 - 56);
    const { width: w, height: h } = this._view;
    const zoom = Math.round(Math.min(6, Math.max(0.25, Math.min(room / w, tall / h))) * 100) / 100;
    if (zoom !== this._view.zoom) this._view = { ...this._view, zoom };
  }

  /** Puts the working drawing on the canvas. Its markup was sanitised when the image was opened. */
  private _mountCanvas(): void {
    const stage = this.renderRoot.querySelector<HTMLElement>('.stage');
    const o = this._opened;
    if (!stage || !o) return;
    stage.innerHTML = o.svg;
    const svg = stage.querySelector('svg');
    if (!svg) return;
    this._svg = svg as unknown as SVGSVGElement;
    const box = (svg.getAttribute('viewBox') ?? '').trim().split(/[\s,]+/).map(Number);
    const [w, h] = box.length === 4 ? [box[2], box[3]] : [Number(svg.getAttribute('width')), Number(svg.getAttribute('height'))];
    this._view = { ...this._view, width: w > 0 ? w : 100, height: h > 0 ? h : 100 };
    this._fit(this._frame?.clientWidth ?? 0, this._frame?.clientHeight ?? 0);
    this._targets = listTargets(this._svg);
    this._replay();
  }

  /** Plays the first clip on the canvas; reduced motion, pause and off-screen are held by the player. */
  private _replay(): void {
    this._preview?.release();
    this._preview = undefined;
    const anim = this._opened?.animation;
    if (this._svg && this._kit && anim?.clips.length) this._preview = startPreview(this._svg, anim, this._clip(anim)?.id ?? anim.clips[0].id, this._kit);
  }

  private _clip(anim: ImageAnimation | undefined): ImageClip | undefined {
    return anim?.clips.find((c) => c.id === this._clipId) ?? anim?.clips[0];
  }

  private _clipError(error: ClipsError): string {
    switch (error) {
      case 'name-empty':
        return t('image-animator.clips-panel.enter-a-name-for-the-clip');
      case 'name-too-long':
        return t('image-animator.clips-panel.a-clip-name-can-be-64-characters-at');
      case 'name-taken':
        return t('image-animator.clips-panel.choose-a-name-that-no-other-clip-has');
      case 'name-denied':
        return t('image-animator.clips-panel.this-name-cannot-be-used');
      case 'limit':
        return t('image-animator.clips-panel.an-image-can-hold-16-clips-at-most');
      case 'bad-play':
        return t('image-animator.clips-panel.enter-an-entity-id-such-as-cover-garage-and');
      case 'bad-timing':
        return t('image-animator.clips-panel.the-duration-or-the-number-of-repeats-is');
      case 'direction-morph':
        return t('image-animator.clips-panel.a-clip-with-a-morph-can-only-play-forwards');
      default:
        return t('image-animator.clips-panel.this-change-could-not-be-made');
    }
  }

  /** Takes a changed record, or says why the change was refused; the preview plays the chosen clip again. */
  private _applyClips(r: { ok: true; anim: ImageAnimation; id: string } | { ok: false; error: ClipsError }, done: 'added' | 'updated'): void {
    const o = this._opened;
    if (!o) return;
    if (!r.ok) {
      this._clipMessage = this._clipError(r.error);
      return;
    }
    this._clipId = r.id;
    this._drafting = '';
    this._commitClips(r.anim);
    const name = r.anim.clips.find((c) => c.id === r.id)?.name ?? '';
    this._clipMessage = done === 'added' ? t('image-animator.clips-panel.added-the-clip-name', { name }) : t('image-animator.clips-panel.updated-the-clip-name', { name });
  }

  /** Stores the clips with the drawing as it is without the playing preview and the pick mark, then plays again. */
  private _commitClips(anim: ImageAnimation | undefined): void {
    const o = this._opened;
    if (!o) return;
    this._preview?.release();
    this._preview = undefined;
    this._svg?.querySelector('[data-mc-picked]')?.removeAttribute('data-mc-picked');
    this._opened = { ...o, animation: anim, svg: this._svg?.outerHTML ?? o.svg };
    this._mark(this._target);
    this._replay();
  }

  private _clipsPanel(): ClipsPanelProps {
    const anim = this._opened?.animation;
    const withClip = (edit: (a: ImageAnimation) => ReturnType<typeof setClipPlay>, done: 'added' | 'updated' = 'updated'): void => {
      if (anim) this._applyClips(edit(anim), done);
    };
    return {
      clips: anim?.clips ?? [],
      selected: this._clip(anim)?.id ?? '',
      drafting: this._drafting,
      message: this._clipMessage,
      select: (id) => {
        this._clipId = id;
        this._drafting = '';
        this._replay();
      },
      create: (name) => this._applyClips(createClip(anim, name), 'added'),
      rename: (id, name) => withClip((a) => renameClip(a, id, name)),
      remove: (id) => {
        if (!anim) return;
        const removed = anim.clips.find((c) => c.id === id);
        const ids = new Set((removed?.morphs ?? []).map((m) => m.smil));
        this._svg?.querySelectorAll('animate').forEach((e) => {
          if (ids.has(e.getAttribute('id') ?? '')) e.remove();
        });
        this._clipId = '';
        this._drafting = '';
        this._commitClips(deleteClip(anim, id));
        this._clipMessage = t('image-animator.clips-panel.deleted-the-clip-name', { name: removed?.name ?? '' });
      },
      duplicate: (id) => withClip((a) => duplicateClip(a, id), 'added'),
      move: (id, delta) => {
        if (anim) this._commitClips(moveClip(anim, id, delta));
      },
      setTrigger: (id, kind: TriggerKind) => {
        if (kind === 'state') {
          this._drafting = id;
          return;
        }
        this._drafting = '';
        withClip((a) => setClipPlay(a, id, { on: kind }));
      },
      bindState: (id, f: StateFields) => {
        const when = parseWhen(f.kind, f.value);
        withClip((a) => (when ? setClipPlay(a, id, { on: 'state', entity: f.entity, ...(f.attribute ? { attribute: f.attribute } : {}), when }) : { ok: false, error: 'bad-play' }));
      },
      setTiming: (id, timing: ClipTiming) => withClip((a) => setClipTiming(a, this._svg, id, timing)),
    };
  }

  private _mark(target: ImageTarget): void {
    this._svg?.querySelector('[data-mc-picked]')?.removeAttribute('data-mc-picked');
    if (target.element) target.element.setAttribute('data-mc-picked', '');
  }

  private _pick(target: ImageTarget | undefined): void {
    if (!target) return;
    this._target = target;
    this._mark(target);
    this._message = '';
  }

  private _onStageClick(e: Event): void {
    if (!this._svg) return;
    const before = this._target?.ref;
    this._pick(pickTarget(this._svg, e.target instanceof Element ? e.target : null));
    if (this._target?.ref !== before && !this._narrow) this._frame?.openDrawer(null, 'selection');
    // The stage click moves focus to the drawing's host outside the dialog; Escape and Tab need it back inside.
    const win = this.renderRoot.querySelector<HTMLElement>('.window');
    if (win && !win.contains(this.shadowRoot?.activeElement ?? null)) (this.renderRoot.querySelector<HTMLElement>('#title') ?? win).focus({ preventScroll: true });
  }

  /** Work on the drawing gives the stage the room back when the drawer is not pinned. */
  private _onStageWork(): void {
    this._frame?.stageWork();
  }

  private _toggleDrawer(e: Event): void {
    if (this._drawerOpen) this._frame?.closeDrawer('user');
    else this._frame?.openDrawer(e.currentTarget as HTMLElement, 'user');
  }

  private _strings(): StudioFrameStrings {
    return {
      pin: t('image-animator.mc-image-animator.keep-settings-open'),
      modifiedOnly: t('image-animator.mc-image-animator.modified-only'),
      noneModified: t('image-animator.mc-image-animator.nothing-modified'),
      close: t('image-animator.mc-image-animator.close-settings'),
      drawer: t('image-animator.mc-image-animator.settings'),
      zoom: t('image-animator.mc-image-animator.zoom'),
    };
  }

  /** The drawing's size for the rulers and the picked part's box for the callout, both in drawing units. */
  private _measure(): FrameMeasure {
    let selection: FrameMeasure['selection'] = null;
    try {
      const b = this._target.element && 'getBBox' in this._target.element ? (this._target.element as unknown as SVGGraphicsElement).getBBox() : undefined;
      if (b && b.width > 0 && b.height > 0) selection = { x: b.x, y: b.y, width: b.width, height: b.height };
    } catch {
      selection = null;
    }
    const { width, height, zoom } = this._view;
    return { width, height, grid: 10, selection, zoom };
  }

  private _pickRef(ref: ImageTarget['ref']): void {
    this._pick(this._targets.find((x) => x.ref === ref));
  }

  /** Adds an effect to the picked target. A new id is written into the drawing, the playing styles stay out of the saved markup. */
  private _add(kind: EffectKind): void {
    const o = this._opened;
    const svg = this._svg;
    if (!o || !svg) return;
    const target = this._target;
    let anim: ImageAnimation;
    try {
      anim = addEffect(o.animation, target, kind, { presetId: this._presetId, path: this._path, clipId: this._clip(o.animation)?.id });
    } catch {
      this._message = kind === 'motion-path' ? t('image-animator.mc-image-animator.enter-path-data-for-example-m0-0') : t('image-animator.mc-image-animator.this-effect-could-not-be-added');
      return;
    }
    this._preview?.release();
    this._preview = undefined;
    this._svg?.querySelector('[data-mc-picked]')?.removeAttribute('data-mc-picked');
    if (commitTargetId(target)) {
      this._targets = listTargets(svg);
      this._target = this._targets.find((x) => x.ref === target.ref) ?? target;
    }
    this._opened = { ...o, animation: anim, svg: svg.outerHTML };
    this._mark(this._target);
    this._note = '';
    this._message = t('image-animator.mc-image-animator.added-effect-to-name', { effect: effectLabel(kind), name: targetName(target) });
    this._replay();
  }

  private _paths(): ImageTarget[] {
    return this._targets.filter((x) => x.element?.localName === 'path');
  }

  /** Adds a morph from one path to the shape of another. The path gets an id in the drawing when it has none. */
  private _addMorph(): void {
    const o = this._opened;
    const svg = this._svg;
    const paths = this._paths();
    const from = paths.find((x) => x.ref === (this._morphFrom || paths[0]?.ref));
    const into = paths.find((x) => x.ref === (this._morphInto || paths[1]?.ref));
    const d = into?.element?.getAttribute('d');
    if (!o || !svg || !from?.element || !d || from === into) {
      this._morphMessage = t('image-animator.morph-panel.choose-two-different-shapes-to-morph');
      return;
    }
    const id = from.element.getAttribute('id');
    try {
      commitTargetId(from);
      this._preview?.release();
      this._preview = undefined;
      svg.querySelector('[data-mc-picked]')?.removeAttribute('data-mc-picked');
      const anim = addMorph(o.animation, svg, { path: from.element, into: d, back: this._morphBack, clipId: this._clip(o.animation)?.id });
      this._targets = listTargets(svg);
      this._opened = { ...o, animation: anim, svg: svg.outerHTML };
      this._morphMessage = t('image-animator.mc-image-animator.added-effect-to-name', { effect: t('image-animator.morph-panel.morph'), name: targetName(from) });
    } catch {
      if (from.generated && !id) from.element.removeAttribute('id');
      this._morphMessage = t('image-animator.morph-panel.this-morph-could-not-be-added');
    }
    this._mark(this._target);
    this._replay();
  }

  private _morphPanel(): MorphPanelProps {
    const paths = this._paths();
    return {
      paths,
      from: this._morphFrom || paths[0]?.ref || '',
      into: this._morphInto || paths[1]?.ref || '',
      back: this._morphBack,
      message: this._morphMessage,
      setFrom: (ref) => (this._morphFrom = ref),
      setInto: (ref) => (this._morphInto = ref),
      setBack: (on) => (this._morphBack = on),
      add: () => this._addMorph(),
    };
  }

  private _panel(): PanelProps | undefined {
    const svg = this._svg;
    if (!svg) return undefined;
    return {
      targets: this._targets,
      target: this._target,
      availability: effectAvailability(svg, this._target),
      presets: presetChoices(),
      presetId: this._presetId,
      path: this._path,
      message: this._message,
      pick: (ref) => this._pickRef(ref),
      add: (kind) => this._add(kind),
      setPreset: (id) => (this._presetId = id),
      setPath: (d) => (this._path = d),
    };
  }

  private _onKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      e.stopPropagation();
      if (this._leaving) this._keepEditing();
      else if (this._ask) this._answer(false);
      else this._close();
      return;
    }
    if (e.key !== 'Tab' || e.defaultPrevented) return;
    const asking = !!(this._leaving || this._ask);
    if (!asking && this._drawerOpen && this._narrow) return;
    const items = asking ? [...(this.renderRoot.querySelector('.confirm')?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])] : this._tabStops();
    if (!items.length) return;
    let active = this.shadowRoot?.activeElement as HTMLElement | null | undefined;
    if (active && active === this._frame) active = (active.shadowRoot?.activeElement as HTMLElement | null) ?? active;
    const first = items[0];
    const last = items[items.length - 1];
    const outside = !items.includes(active as HTMLElement);
    if (e.shiftKey && (active === first || outside)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || outside)) {
      e.preventDefault();
      first.focus();
    }
  }

  /** Every control in tab order, through the frame's own buttons and the content slotted into it. */
  private _tabStops(): HTMLElement[] {
    const frame = this._frame;
    if (!frame?.shadowRoot) return [];
    const out: HTMLElement[] = [];
    const add = (el: HTMLElement): void => {
      if (el.matches(FOCUSABLE) && !el.closest('[inert]')) out.push(el);
      for (const c of el.querySelectorAll<HTMLElement>(FOCUSABLE)) if (!c.closest('[inert]')) out.push(c);
    };
    for (const n of frame.shadowRoot.querySelectorAll<HTMLElement>('button, slot')) {
      if (n instanceof HTMLSlotElement) for (const el of n.assignedElements({ flatten: true }) as HTMLElement[]) add(el);
      else if (!n.closest('[inert], [hidden]')) out.push(n);
    }
    return out;
  }

  private _problem(reason: FailReason): string {
    switch (reason) {
      case 'missing':
        return t('image-animator.mc-image-animator.this-image-is-not-in-the-library-any');
      case 'too_large':
        return t('image-animator.mc-image-animator.this-image-is-larger-than-the-library-accepts');
      case 'not_svg':
        return t('image-animator.mc-image-animator.this-file-is-not-an-svg-drawing');
      case 'unsafe_markup':
        return t('image-animator.mc-image-animator.this-drawing-contains-markup-that-cannot-be');
      case 'needs_utils':
        return t('image-animator.mc-image-animator.animating-needs-a-newer-magic-card-utils');
      case 'invalid_animation':
        return t('image-animator.mc-image-animator.the-saved-animation-of-this-image-is-not');
      case 'conflict':
        return t('image-animator.mc-image-animator.this-image-was-changed-somewhere-else-close-this');
      default:
        return t('image-animator.mc-image-animator.could-not-reach-magic-card-utils-your');
    }
  }

  /** The stage: the playing drawing and, for a saved image, how it looks as last saved. */
  private _stageSlot(o: Opened): TemplateResult {
    const { width, height, zoom } = this._view;
    return html`<div slot="stage" class="stage-wrap">
      <div class="stage" role="group" aria-label=${o.name} style=${`inline-size:${width * zoom}px;block-size:${height * zoom}px`} @pointerdown=${this._onStageWork} @click=${this._onStageClick}></div>
      ${o.isNew
        ? nothing
        : html`<div class="saved">
            <span>${t('image-animator.mc-image-animator.as-saved')}</span>
            <mc-svg-image .hass=${this.hass} .ref=${`mcu-image:${o.id}`} .description=${o.name}></mc-svg-image>
          </div>`}
    </div>`;
  }

  private _drawerSlot(o: Opened): TemplateResult {
    const panel = this._panel();
    const clips = o.animation?.clips.length ?? 0;
    const busy = this._saving || !!this._ask || !!this._leaving;
    if (this._modifiedOnly) {
      const cp = panel ? this._clipsPanel() : undefined;
      const changed = !!cp && clipsModified(cp.clips, cp.drafting);
      return html`<div slot="drawer" id="ia-drawer" class="drawer-body" ?inert=${busy}>
        ${this._warnings(o)}
        ${panel && cp && clipsHaveEffects(cp.clips) ? html`${renderTargetList(panel)}${renderEffects(panel)}${renderMorph(this._morphPanel())}` : nothing}
        ${cp && changed ? renderClips({ ...cp, modifiedOnly: true }) : nothing}
        ${changed ? nothing : html`<p class="hint" role="status">${t('image-animator.mc-image-animator.nothing-modified')}</p>`}
      </div>`;
    }
    return html`<div slot="drawer" id="ia-drawer" class="drawer-body" ?inert=${busy}>
      ${this._warnings(o)}
      ${panel ? html`${renderTargetList(panel)}${renderEffects(panel)}${renderMorph(this._morphPanel())}${renderClips(this._clipsPanel())}` : nothing}
      <p>${clips ? t('image-animator.mc-image-animator.count-animations', { count: clips }) : t('image-animator.mc-image-animator.this-image-has-no-animations-yet')}</p>
    </div>`;
  }

  private _body(): TemplateResult {
    if (this._phase === 'opening') return html`<p role="status">${t('image-animator.mc-image-animator.opening-the-image')}</p>`;
    return html`<p class="problem" role="alert">${this._problem(this._reason ?? 'failed')}</p>`;
  }

  private _heavyLine(r: HeavyReason): string {
    switch (r.kind) {
      case 'targets':
        return t('image-animator.mc-image-animator.count-animated-shapes-over-limit', { count: r.n, limit: r.limit });
      case 'filters':
        return t('image-animator.mc-image-animator.count-shapes-with-a-blur-or-colour-filter-over', { count: r.n, limit: r.limit });
      case 'morph-points':
        return t('image-animator.mc-image-animator.count-morph-points-over-limit', { count: Math.round(r.n), limit: r.limit });
      default:
        return t('image-animator.mc-image-animator.animation-data-of-size-kib-over-limit-kib', { size: Math.ceil(r.n / 1024), limit: Math.round(r.limit / 1024) });
    }
  }

  private _warnings(o: Opened): TemplateResult | typeof nothing {
    const heavy = o.animation ? heavyReasons(o.animation) : [];
    if (!heavy.length && !this._libraryBytes) return nothing;
    return html`<div class="warnings">
      ${heavy.length
        ? html`<p role="status">${t('image-animator.mc-image-animator.this-animation-is-heavy-and-may-run-slowly-on')}</p>
            <ul>${heavy.map((r) => html`<li>${this._heavyLine(r)}</li>`)}</ul>`
        : nothing}
      ${this._libraryBytes ? html`<p role="status">${t('image-animator.mc-image-animator.your-image-library-is-over-50-mib-a-large')}</p>` : nothing}
    </div>`;
  }

  private _confirmBox(): TemplateResult | typeof nothing {
    const n = this._ask?.notice;
    if (!n || (n.kind !== 'used' && n.kind !== 'at-least')) return nothing;
    const text =
      n.kind === 'used'
        ? t('image-animator.mc-image-animator.used-on-count-cards-saving-changes-all-of-them', { count: n.count })
        : t('image-animator.mc-image-animator.used-on-at-least-count-cards-some-dashboards-could', { count: n.count });
    return html`<div class="confirm" role="alertdialog" aria-labelledby="used-text">
      <p id="used-text">${text}</p>
      <button class="btn btn-secondary" type="button" @click=${() => this._answer(false)}>${t('image-animator.mc-image-animator.cancel')}</button>
      <button class="btn btn-primary" type="button" @click=${() => this._answer(true)}>${t('image-animator.mc-image-animator.save')}</button>
    </div>`;
  }

  private _leaveBox(): TemplateResult | typeof nothing {
    if (!this._leaving) return nothing;
    const text = this._opened?.isNew
      ? t('image-animator.mc-image-animator.discard-this-image-and-your-changes-it-is')
      : t('image-animator.mc-image-animator.discard-the-changes-you-have-not-saved');
    return html`<div class="confirm leave" role="alertdialog" aria-labelledby="leave-text">
      <p id="leave-text">${text}</p>
      <button class="btn btn-secondary" type="button" @click=${this._keepEditing}>${t('image-animator.mc-image-animator.keep-editing')}</button>
      <button class="btn btn-danger" type="button" @click=${this._discard}>${t('image-animator.mc-image-animator.discard')}</button>
    </div>`;
  }

  private _status(): TemplateResult | typeof nothing {
    if (this._saving && this._closeAfterSave) {
      return html`<p class="status" role="status">${t('image-animator.mc-image-animator.saving-the-window-closes-when-it-is-done')}</p>`;
    }
    if (this._saving) return html`<p class="status" role="status">${t('image-animator.mc-image-animator.saving')}</p>`;
    if (this._reason && this._phase === 'ready') return html`<p class="status problem" role="alert">${this._problem(this._reason)}</p>`;
    if (this._opened && !this._opened.canSave) return html`<p class="status" role="status">${this._problem('needs_utils')}</p>`;
    if (this._note === 'saved' && this._unchecked) return html`<p class="status" role="status">${t('image-animator.mc-image-animator.saved-magic-card-could-not-check-where-this-image')}</p>`;
    if (this._note === 'saved') return html`<p class="status" role="status">${t('image-animator.mc-image-animator.saved')}</p>`;
    if (this._opened?.isNew) {
      return html`<p class="status" role="status">${t('image-animator.mc-image-animator.not-in-the-library-yet-save-adds-it-as', { name: this._opened.name })}</p>`;
    }
    return html`<p class="status" role="status"></p>`;
  }

  protected render(): TemplateResult {
    const o = this._opened;
    const ready = this._phase === 'ready' && !!o;
    const title = html`<h2 id="title" tabindex="-1">${o ? t('image-animator.mc-image-animator.animate-name', { name: o.name }) : t('image-animator.mc-image-animator.animate-image')}</h2>`;
    const close = html`<button class="btn btn-secondary close" type="button" @click=${this._close}>${t('image-animator.mc-image-animator.close')}</button>`;
    return html`<div class="backdrop" @click=${this._close} aria-hidden="true"></div>
      <div class="window" role="dialog" aria-modal="true" aria-labelledby="title" @keydown=${this._onKey}>
        ${ready
          ? html`<mc-ui-studio-frame
              studio="image-animator"
              .scheme=${this.hass?.themes?.darkMode ? 'dark' : 'light'}
              .strings=${this._strings()}
              .selectionLabel=${targetName(this._target)}
              .measure=${this._measure()}
              @mc-frame-drawer=${(e: CustomEvent<FrameDrawerChange>) => (this._drawerOpen = e.detail.open)}
              @mc-frame-modified=${(e: CustomEvent<FrameModifiedChange>) => (this._modifiedOnly = e.detail.on)}
            >
              <div slot="top" class="bar">
                ${title}
                ${this._status()}
                <button
                  class="btn btn-secondary settings"
                  type="button"
                  aria-label=${t('image-animator.mc-image-animator.settings')}
                  aria-controls="ia-drawer"
                  aria-expanded=${this._drawerOpen ? 'true' : 'false'}
                  aria-haspopup=${this._narrow ? 'dialog' : nothing}
                  @click=${this._toggleDrawer}
                >
                  ${t('image-animator.mc-image-animator.settings')}
                </button>
                ${close}
                <button class="btn btn-primary" type="button" ?disabled=${!o.canSave || this._saving || !!this._ask || !!this._leaving} @click=${this._save}>${t('image-animator.mc-image-animator.save')}</button>
              </div>
              ${this._stageSlot(o)} ${this._drawerSlot(o)}
            </mc-ui-studio-frame>`
          : html`<header>${title}${close}</header>
              <div class="body">${this._body()}</div>
              <footer>${this._status()}<button class="btn btn-primary" type="button" disabled>${t('image-animator.mc-image-animator.save')}</button></footer>`}
        ${this._confirmBox()} ${this._leaveBox()}
      </div>`;
  }
}
