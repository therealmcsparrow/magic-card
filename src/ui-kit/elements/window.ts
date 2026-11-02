import { LitElement, html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { UI_KIT_CONTRACT_REVISION, type UiWindowClose } from '../../contracts/ui-kit';
import { kitWindowElementCss } from '../css/elements';
import { glyph } from '../glyphs';
import { DirectionController } from '../controllers/direction';
import {
  CLICK_PX, NO_DRAG, arrowDelta, centred, clampRect, dockRect, maximisedRect, resizeRect, stepWidth, type Dock, type Rect,
} from '../controllers/window-frame';

// <mc-ui-window>: one modal window (native <dialog> + showModal()) with slotted content; movable, resizable and maximizable.

const DOCKS: Dock[] = ['centre', 'end', 'start'];
interface Drag {
  mode: 'move' | 'size';
  id: number;
  sx: number;
  sy: number;
  r0: Rect;
  was: Rect | null;
  grip: boolean;
  moved: boolean;
}

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export class UiWindow extends LitElement {
  static uiKitRevision = UI_KIT_CONTRACT_REVISION;
  static styles = kitWindowElementCss;

  @property() heading = '';
  @property() closeLabel = '';
  @property() variant: 'dialog' | 'picker' | 'alert' | 'sheet' = 'dialog';
  /** Width: s 420, m 480, l 640, xl 880. Default m; the picker variant defaults to l and the alert to s. */
  @property({ reflect: true }) size?: 's' | 'm' | 'l' | 'xl';
  /** Id of an element inside the slotted content that gets focus first; default the first focusable one. */
  @property() initialFocus?: string;
  @property({ attribute: false }) opener?: HTMLElement;
  /** Scrim click closes (default true, never for 'alert'). */
  @property({ type: Boolean }) dismissible = true;
  /** Header drag and the move grip. */
  @property({ type: Boolean }) movable = false;
  /** Corner resize grip. */
  @property({ type: Boolean }) resizable = false;
  /** Maximise / restore button. */
  @property({ type: Boolean }) maximizable = false;
  @property({ type: Boolean, reflect: true }) maximized = false;
  @property() moveLabel = '';
  @property() resizeLabel = '';
  @property() maximizeLabel = '';
  @property() restoreLabel = '';

  @state() private _open = false;
  @state() private _hasFooter = false;
  @state() private _r: Rect | null = null;
  @state() private _compact = false;
  private _dir = new DirectionController(this);
  private _drag: Drag | null = null;
  private _dock = 0;
  private _downScrim: boolean | null = null;
  private _id = `mc-ui-win-${Math.random().toString(36).slice(2, 8)}`;

  get open(): boolean {
    return this._open;
  }

  private dlg(): HTMLDialogElement | null {
    return this.renderRoot.querySelector('dialog');
  }

  show(): void {
    if (this._open) return;
    this._open = true;
    // the footer is shown from the first render, so a button in it can take the first focus
    this._hasFooter = !!this.querySelector(':scope > [slot="footer"]');
    this._compact = this._isCompact();
    window.addEventListener('resize', this._viewport);
    // eslint-disable-next-line no-console
    if ((this.movable && !this.moveLabel) || (this.resizable && !this.resizeLabel) || (this.maximizable && !this.maximizeLabel)) console.debug('[magic-card] <mc-ui-window> needs moveLabel, resizeLabel and maximizeLabel');
    void this.updateComplete.then(() => {
      const d = this.dlg();
      if (!d) return;
      if (typeof d.showModal === 'function') {
        try {
          d.showModal();
        } catch {
          d.setAttribute('open', '');
        }
      } else d.setAttribute('open', '');
      this.focusFirst();
    });
  }

  close(reason: UiWindowClose['reason'] = 'action'): void {
    if (!this._open) return;
    this._open = false;
    this._forget();
    const d = this.dlg();
    if (d?.open && typeof d.close === 'function') d.close();
    else d?.removeAttribute('open');
    this.dispatchEvent(new CustomEvent<UiWindowClose>('mc-window-close', { detail: { reason }, bubbles: true, composed: true }));
    const back = this.opener;
    if (back?.isConnected) back.focus({ preventScroll: true });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._open) {
      this._open = false;
      this._forget();
      const d = this.dlg();
      if (d?.open && typeof d.close === 'function') d.close();
    }
  }

  /** Nothing is stored: the next show() starts centred, at the default size, not maximised. */
  private _forget(): void {
    window.removeEventListener('resize', this._viewport);
    this._r = null;
    this._drag = null;
    this._dock = 0;
    this.maximized = false;
  }

  private focusFirst(): void {
    const byId = this.initialFocus ? this.querySelector<HTMLElement>(`#${CSS.escape(this.initialFocus)}`) : null;
    const target = byId ?? this.querySelector<HTMLElement>(FOCUSABLE);
    (target ?? this.renderRoot.querySelector<HTMLElement>('.close'))?.focus({ preventScroll: true });
  }

  private get _rtl(): boolean {
    return this._dir.direction === 'rtl' || getComputedStyle(this).direction === 'rtl';
  }

  private _isCompact = (): boolean => typeof matchMedia === 'function' && matchMedia('(max-width: 599px)').matches;
  private _vw = (): number => document.documentElement.clientWidth || window.innerWidth;
  private _vh = (): number => window.innerHeight;
  /** The sheet on a phone and the alert have no grips. */
  private _free = (): boolean => this.variant !== 'alert' && !(this.variant === 'sheet' && this._compact);

  private _viewport = (): void => {
    this._compact = this._isCompact();
    if (this._r) this._r = clampRect(this._r, this._vw(), this._vh());
  };

  /** The rectangle on screen now: the explicit one, or what the CSS made of the default size. */
  private _now(): Rect {
    return this._r ?? this._measure();
  }

  private _measure(): Rect {
    const b = this.dlg()?.getBoundingClientRect();
    return { x: b?.left ?? 0, y: b?.top ?? 0, w: b?.width ?? 0, h: b?.height ?? 0 };
  }

  private _set(r: Rect): void {
    this._r = clampRect(r, this._vw(), this._vh());
  }

  /** Escape during a drag cancels the drag and leaves the window open (true: consumed). */
  private _abort(): boolean {
    const g = this._drag;
    if (!g) return false;
    this._drag = null;
    this._r = g.was;
    return true;
  }

  /** The browser's own Escape (cancel): this window closes, nothing above it does. */
  private _cancel = (e: Event): void => {
    e.preventDefault();
    e.stopPropagation();
    if (!this._abort()) this.close('escape');
  };

  /** Tab from the last stop goes to the first and Shift+Tab from the first to the last: a modal window left by Tab would hand the focus to the browser's own bar (and BODY). The stops come in the order a browser walks them, through open shadow roots and slots. */
  private _tab(e: KeyboardEvent): void {
    if (e.defaultPrevented) return;
    const list: HTMLElement[] = [];
    const walk = (n: Node): void => {
      if (!(n instanceof HTMLElement) || n.hasAttribute('hidden')) return;
      if (n instanceof HTMLSlotElement) return n.assignedNodes({ flatten: true }).forEach(walk);
      if (n.matches(FOCUSABLE)) list.push(n);
      (n.shadowRoot ?? n).childNodes.forEach(walk);
    };
    this.renderRoot.childNodes.forEach(walk);
    const at = list.indexOf(e.composedPath()[0] as HTMLElement);
    const to = e.shiftKey ? (at === 0 ? list[list.length - 1] : undefined) : at === list.length - 1 ? list[0] : undefined;
    if (to) {
      e.preventDefault();
      to.focus({ preventScroll: true });
    }
  }

  private _key = (e: KeyboardEvent): void => {
    if (e.key === 'Tab') return this._tab(e);
    if (e.key !== 'Escape') return;
    e.preventDefault();
    e.stopPropagation();
    if (!this._abort()) this.close('escape');
  };

  private _press = (e: PointerEvent): void => {
    this._downScrim = e.target === e.currentTarget;
  };

  private _click = (e: MouseEvent): void => {
    // A press on the backdrop lands on the <dialog> itself: the panel inside fills it. Press and release must both be
    // there; a click with no press before it (keyboard, script) counts.
    const down = this._downScrim;
    this._downScrim = null;
    if (e.target === e.currentTarget && down !== false && this.dismissible && this.variant !== 'alert') this.close('scrim');
  };

  private _footer = (e: Event): void => {
    this._hasFooter = (e.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  // ---- placement --------------------------------------------------------------------------------

  private _begin(e: PointerEvent, mode: 'move' | 'size', grip: boolean): void {
    if (this.maximized || (e.pointerType === 'mouse' && e.button !== 0)) return;
    if (!grip && (e.composedPath()[0] as Element | undefined)?.closest?.(NO_DRAG)) return;
    this._drag = { mode, id: e.pointerId, sx: e.clientX, sy: e.clientY, r0: this._now(), was: this._r, grip, moved: false };
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch {
      /* a synthetic pointer */
    }
  }

  private _moved = (e: PointerEvent): void => {
    const g = this._drag;
    if (!g || e.pointerId !== g.id) return;
    const dx = e.clientX - g.sx;
    const dy = e.clientY - g.sy;
    if (!g.moved && Math.hypot(dx, dy) < CLICK_PX) return;
    g.moved = true;
    this._dock = 0;
    const r = g.r0;
    if (g.mode === 'move') return this._set({ ...r, x: r.x + dx, y: r.y + dy });
    this._set(resizeRect(r, dx, dy, this._rtl, this._vw(), this._vh()));
  };

  private _released = (e: PointerEvent): void => {
    const g = this._drag;
    if (!g || e.pointerId !== g.id) return;
    this._drag = null;
    if (e.type === 'pointercancel') this._r = g.was;
    else if (!g.moved && g.grip) {
      if (g.mode === 'move') this._dockNext();
      else this._stepWidth();
    }
  };

  private _dockNext(): void {
    if (this.maximized) return;
    this._dock = (this._dock + 1) % DOCKS.length;
    this._set(dockRect(this._now(), DOCKS[this._dock], this._rtl, this._vw(), this._vh()));
  }

  private _stepWidth(): void {
    if (!this.maximized) this._set(stepWidth(this._now(), this._vw()));
  }

  /** Keyboard alternative to dragging (WCAG 2.1.1): arrows 16 px, Shift 64 px, Home re-centres / resets the size. */
  private _grip(mode: 'move' | 'size', e: KeyboardEvent): void {
    const d = arrowDelta(e.key, e.shiftKey);
    if (this.maximized || (!d && e.key !== 'Home')) return;
    e.preventDefault();
    e.stopPropagation();
    const r = this._now();
    this._dock = 0;
    if (!d) {
      if (mode === 'move') return this._set(centred(r, this._vw(), this._vh()));
      const dlg = this.dlg();
      const keep = dlg?.getAttribute('style') ?? null;
      dlg?.removeAttribute('style');
      const def = this._measure();
      if (keep !== null) dlg?.setAttribute('style', keep);
      if (!this._r) return;
      return this._set({ ...r, w: def.w, h: def.h });
    }
    if (mode === 'move') return this._set({ ...r, x: r.x + d[0], y: r.y + d[1] });
    this._set(resizeRect(r, d[0], d[1], this._rtl, this._vw(), this._vh()));
  }

  private _style(): string {
    const r = this.maximized ? maximisedRect(this._vw(), this._vh()) : this._r;
    return r ? `inset:auto;margin:0;max-width:none;max-height:none;left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px` : '';
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._open) return nothing;
    const alert = this.variant === 'alert';
    const free = this._free();
    const move = free && this.movable;
    const size = free && this.resizable && !this.maximized;
    const max = free && this.maximizable;
    return html`<dialog
      class="${this.variant} size-${this.size ?? (alert ? 's' : this.variant === 'picker' ? 'l' : 'm')}${this._rtl ? ' rtl' : ''}${this.maximized || this._r ? ' placed' : ''}"
      style=${this._style()}
      role=${alert ? 'alertdialog' : 'dialog'}
      aria-labelledby="${this._id}-t"
      @cancel=${this._cancel}
      @keydown=${this._key}
      @pointerdown=${this._press}
      @click=${this._click}
      @pointermove=${this._moved}
      @pointerup=${this._released}
      @pointercancel=${this._released}
    >
      <div class="panel${size ? ' sizable' : ''}${this._hasFooter ? ' has-footer' : ''}" part="panel">
        <div class="header${move ? ' movable' : ''}" part="header" @pointerdown=${(e: PointerEvent) => move && this._begin(e, 'move', false)}>
          ${move
            ? html`<button type="button" class="tool move" part="move" aria-label=${this.moveLabel} title=${this.moveLabel} ?disabled=${this.maximized}
                @pointerdown=${(e: PointerEvent) => this._begin(e, 'move', true)}
                @keydown=${(e: KeyboardEvent) => this._grip('move', e)}
                @click=${(e: MouseEvent) => e.detail === 0 && this._dockNext()}>${glyph('grip', 20)}</button>`
            : nothing}
          <h2 class="title" id="${this._id}-t" part="title">${this.heading}</h2>
          <slot name="header-actions"></slot>
          ${max
            ? html`<button type="button" class="tool maximize" part="maximize" aria-pressed=${this.maximized ? 'true' : 'false'}
                aria-label=${this.maximized ? this.restoreLabel : this.maximizeLabel} title=${this.maximized ? this.restoreLabel : this.maximizeLabel}
                @click=${() => (this.maximized = !this.maximized)}>${glyph(this.maximized ? 'restore' : 'maximize', 20)}</button>`
            : nothing}
          <button type="button" class="tool close" part="close" aria-label=${this.closeLabel} title=${this.closeLabel} @click=${() => this.close('close-button')}>${glyph('close', 20)}</button>
        </div>
        <div class="body" part="body"><slot></slot></div>
        <div class="footer" part="footer" ?hidden=${!this._hasFooter}><slot name="footer" @slotchange=${this._footer}></slot></div>
      </div>
      ${size
        ? html`<button type="button" class="tool resize" part="resize" aria-label=${this.resizeLabel} title=${this.resizeLabel}
            @pointerdown=${(e: PointerEvent) => this._begin(e, 'size', true)}
            @keydown=${(e: KeyboardEvent) => this._grip('size', e)}
            @click=${(e: MouseEvent) => e.detail === 0 && this._stepWidth()}>${glyph('resizeCorner', 20)}</button>`
        : nothing}
    </dialog>`;
  }
}
