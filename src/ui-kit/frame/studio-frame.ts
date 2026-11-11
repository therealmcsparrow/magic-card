import { LitElement, html, nothing, svg, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  UI_KIT_CONTRACT_REVISION, FRAME_DRAWER_EVENT, FRAME_MODIFIED_EVENT, FRAME_PIN_EVENT, FRAME_WIDE_MIN_PX,
  type FrameDrawerChange, type FrameDrawerReason, type FrameMeasure, type FrameModifiedChange, type FramePinChange,
  type FrameScheme, type FrameSlot, type FrameStudioId, type StudioFrameElement, type StudioFrameStrings,
} from '../../contracts/ui-kit';
import { kitBlueprint } from '../css/blueprint';
import { glyph } from '../glyphs';
import { frameStyles } from './frame-styles';

// <mc-ui-studio-frame> (contract studio-frame 1.0.0): top bar, rulers, grid stage, zoom pill and a drawer that pushes the stage or becomes a sheet.
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const RULER_STEPS = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
const MAX_LABELS = 200;

const PIN = svg`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M15 4l5 5-3 1-3.5 3.5.5 4.5-1.5 1.5-3.5-3.5L5 20l-1-1 4.5-4.5L5 11l1.5-1.5 4.5.5L14.5 6.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

export class StudioFrame extends LitElement implements StudioFrameElement {
  static uiKitRevision = UI_KIT_CONTRACT_REVISION;
  static styles = [kitBlueprint, frameStyles];

  @property({ reflect: true }) studio: FrameStudioId = 'card-studio';
  @property({ attribute: 'data-bp-mode', reflect: true }) scheme: FrameScheme = 'light';
  @property({ attribute: false }) strings: StudioFrameStrings = { pin: '', modifiedOnly: '', noneModified: '', close: '', drawer: '', zoom: '' };
  @property({ attribute: false }) selectionLabel = '';
  @property({ attribute: false }) measure: FrameMeasure | null = null;
  @property({ attribute: false }) rulers = true;
  @property({ attribute: 'start-mode' }) startMode: 'sheet' | 'rail' = 'sheet';

  @state() private _open = false;
  @state() private _pinned = false;
  @state() private _modified = false;
  @state() private _width = 0;

  private _opener: HTMLElement | null = null;
  private _observer: ResizeObserver | null = null;

  get drawerOpen(): boolean {
    return this._open;
  }
  get pinned(): boolean {
    return this._pinned;
  }
  get modifiedOnly(): boolean {
    return this._modified;
  }
  get narrow(): boolean {
    return this._width > 0 && this._width < FRAME_WIDE_MIN_PX;
  }

  constructor() {
    super();
    this.addEventListener('keydown', this._onKey);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._observer = new ResizeObserver((entries) => {
      const last = entries[entries.length - 1];
      if (last) this._width = last.contentRect.width;
    });
    this._observer.observe(this);
    this._width = this.getBoundingClientRect().width;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._observer?.disconnect();
    this._observer = null;
  }

  openDrawer(opener?: HTMLElement | null, reason: FrameDrawerReason = 'user'): void {
    if (opener) this._opener = opener;
    else if (!this._open) {
      const at = this._deepActive();
      this._opener = at && !this._inDrawer(at) && !this._holdsFrame(at) ? at : null;
    }
    if (this._open) return;
    this._open = true;
    this._fire<FrameDrawerChange>(FRAME_DRAWER_EVENT, { open: true, reason });
    if (this.narrow) {
      void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('[data-bp="sheet"] button')?.focus());
    }
  }

  closeDrawer(reason: FrameDrawerReason = 'user'): void {
    if (!this._open) return;
    const inside = this._inDrawer(this._deepActive());
    this._open = false;
    this._fire<FrameDrawerChange>(FRAME_DRAWER_EVENT, { open: false, reason });
    const opener = this._opener;
    this._opener = null;
    if (reason === 'stage') return;
    // below the push breakpoint the bar, the start slot and the stage are inert until the sheet is gone, so focus waits for that render
    const land = (): void => {
      if (opener?.isConnected) opener.focus();
      else if (inside) this._topStops()[0]?.focus();
    };
    if (this.narrow) void this.updateComplete.then(land);
    else land();
  }

  /** True when the node holds this frame, for example a dialog host that took focus itself. */
  private _holdsFrame(node: Node): boolean {
    for (let n: Node | null = this; n; n = n.parentNode ?? (n as ShadowRoot).host ?? null) if (n === node) return true;
    return false;
  }

  stageWork(): void {
    if (this._open && !this._pinned) this.closeDrawer('stage');
  }

  private _fire<T>(name: string, detail: T): void {
    this.dispatchEvent(new CustomEvent<T>(name, { detail, bubbles: true, composed: true }));
  }

  private _togglePin = (): void => {
    this._pinned = !this._pinned;
    this._fire<FramePinChange>(FRAME_PIN_EVENT, { pinned: this._pinned });
  };

  private _toggleModified = (): void => {
    this._modified = !this._modified;
    this._fire<FrameModifiedChange>(FRAME_MODIFIED_EVENT, { on: this._modified });
  };

  private _onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      if (e.defaultPrevented || !this._open || (!this.narrow && this._pinned)) return;
      e.preventDefault();
      e.stopPropagation();
      this.closeDrawer('escape');
    } else if (e.key === 'Tab' && this._open && this.narrow) this._trap(e);
  };

  private _deepActive(): HTMLElement | null {
    let a: Element | null = document.activeElement;
    try {
      while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement;
    } catch {
      /* some DOMs throw on a detached shadow root; keep the outer element */
    }
    return a instanceof HTMLElement && a !== document.body ? a : null;
  }

  /** True when the node sits in the drawer, the sheet or an element slotted into either. */
  private _inDrawer(node: Node | null): boolean {
    const own = this.renderRoot.querySelector('[data-bp="drawer"], [data-bp="sheet"]');
    for (let n: Node | null = node; n; n = n.parentNode ?? (n as ShadowRoot).host ?? null) {
      if (n === own) return true;
      if (n instanceof HTMLElement && n.parentElement === this && (n.slot === 'drawer' || n.slot === 'drawer-actions')) return true;
    }
    return false;
  }

  /** Tab stops reached through shadow roots and slots, in document order. */
  private _stops(el: Element, out: HTMLElement[]): void {
    if (el.hasAttribute('hidden') || el.hasAttribute('inert')) return;
    if (el.matches(FOCUSABLE) && !(el as HTMLButtonElement).disabled) out.push(el as HTMLElement);
    if (el instanceof HTMLSlotElement) {
      for (const a of el.assignedElements({ flatten: true })) this._stops(a, out);
    } else if (el.shadowRoot) {
      for (const c of Array.from(el.shadowRoot.children)) this._stops(c, out);
    } else {
      for (const c of Array.from(el.children)) this._stops(c, out);
    }
  }

  private _topStops(): HTMLElement[] {
    const out: HTMLElement[] = [];
    for (const c of Array.from(this.children)) if (c.slot === 'top') this._stops(c, out);
    return out;
  }

  /** Keeps Tab inside the sheet: wraps from the last tab stop to the first and back. */
  private _trap(e: KeyboardEvent): void {
    const sheet = this.renderRoot.querySelector('[data-bp="sheet"]');
    if (!sheet) return;
    const list: HTMLElement[] = [];
    for (const c of Array.from(sheet.children)) this._stops(c, list);
    const first = list[0];
    const last = list[list.length - 1];
    if (!first || !last) return;
    const at = this._deepActive();
    if (e.shiftKey && at === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && at === last) {
      e.preventDefault();
      first.focus();
    }
  }

  private _has(slot: FrameSlot): boolean {
    return Array.from(this.children).some((c) => c.slot === slot && !c.hasAttribute('hidden'));
  }

  private _size(): 'wide' | 'mid' | 'narrow' | 'tiny' {
    const w = this._width;
    if (w > 0 && w < 640) return 'tiny';
    if (w > 0 && w < FRAME_WIDE_MIN_PX) return 'narrow';
    return w > 0 && w < 1280 ? 'mid' : 'wide';
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('_width')) this.setAttribute('data-bp-w', this._size());
    if (changed.has('startMode') && this.startMode === 'rail' && this.getAttribute('start-mode') !== 'rail') this.setAttribute('start-mode', 'rail');
  }

  private _onSlot = (): void => {
    this.requestUpdate();
  };

  private _ruler(axis: 'x' | 'y'): TemplateResult {
    const m = this.measure;
    const zoom = m && m.zoom > 0 ? m.zoom : 1;
    const len = m ? (axis === 'x' ? m.width : m.height) : 0;
    const step = RULER_STEPS.find((s) => s * zoom >= 48) ?? RULER_STEPS[RULER_STEPS.length - 1]!;
    const labels: number[] = [];
    for (let v = 0; v <= len && labels.length < MAX_LABELS; v += step) labels.push(v);
    const tick = Math.max(4, (step / 5) * zoom);
    const pos = axis === 'x' ? 'left' : 'top';
    return html`<div data-bp="ruler" data-axis=${axis} aria-hidden="true" style=${`--bp-tick:${tick}px`}>
      ${labels.map((v) => html`<span style=${`${pos}:${v * zoom}px`}>${v}</span>`)}
    </div>`;
  }

  private _marks(): TemplateResult | typeof nothing {
    const m = this.measure;
    if (!m) return nothing;
    const z = m.zoom > 0 ? m.zoom : 1;
    const s = m.selection;
    return html`
      <div data-bp="width-callout" aria-hidden="true"><output>${Math.round(m.width)} px</output></div>
      ${s
        ? html`<div data-bp="callout" aria-hidden="true" style=${`left:${s.x * z}px;top:${s.y * z}px;width:${s.width * z}px;height:${s.height * z}px`}>
            <output>${Math.round(s.width)} × ${Math.round(s.height)}</output>
          </div>`
        : nothing}
    `;
  }

  private _stage(): TemplateResult {
    const m = this.measure;
    const z = m && m.zoom > 0 ? m.zoom : 1;
    const step = m && m.grid > 0 ? m.grid * z : 0;
    const sheet = this._open && this.narrow;
    const box = m ? `min-inline-size:${m.width * z}px;min-block-size:${m.height * z}px` : '';
    return html`<div data-bp="stage" data-rulers=${this.rulers ? 'on' : 'off'} ?inert=${sheet}>
      ${this.rulers
        ? html`<div class="corner" aria-hidden="true">px</div>${this._ruler('x')}${this._ruler('y')}`
        : nothing}
      <div data-bp="grid" aria-hidden="true" data-lines=${m && m.grid === 0 ? 'off' : 'on'} style=${step ? `--bp-grid-step:${step}px` : ''}></div>
      <div class="field">
        <div class="content" style=${box}>
          <slot name="stage"></slot>
          ${this._marks()}
        </div>
      </div>
      <div class="zoomrow">
        <div data-bp="zoom" role="group" aria-label=${this.strings.zoom} ?data-empty=${!this._has('zoom')}>
          <slot name="zoom" @slotchange=${this._onSlot}></slot>
        </div>
      </div>
    </div>`;
  }

  private _filter(): TemplateResult {
    return html`<div class="filt">
      <button type="button" data-bp="modified-only" role="switch" aria-checked=${this._modified ? 'true' : 'false'} @click=${this._toggleModified}>
        <span class="track" aria-hidden="true"></span><span>${this.strings.modifiedOnly}</span>
      </button>
      <slot name="drawer-actions"></slot>
    </div>`;
  }

  private _body(): TemplateResult {
    const empty = this._modified && !this._has('drawer');
    return html`<div class="body">
      <slot name="drawer" @slotchange=${this._onSlot}></slot>
      <div class="none" role="status">${empty ? this.strings.noneModified : nothing}</div>
    </div>`;
  }

  private _drawer(): TemplateResult {
    const label = `${this.strings.drawer}: ${this.selectionLabel}`;
    return html`<aside data-bp="drawer" class="panel" aria-label=${label} ?hidden=${!this._open} ?inert=${!this._open}>
      <div class="head">
        <h2 title=${this.selectionLabel}>${this.selectionLabel}</h2>
        <button type="button" class="ib" data-bp="pin" aria-label=${this.strings.pin} title=${this.strings.pin} aria-pressed=${this._pinned ? 'true' : 'false'} @click=${this._togglePin}>${PIN}</button>
        <button type="button" class="ib" aria-label=${this.strings.close} title=${this.strings.close} @click=${() => this.closeDrawer('user')}>${glyph('close', 18)}</button>
      </div>
      ${this._filter()}${this._body()}
    </aside>`;
  }

  private _sheet(): TemplateResult {
    return html`<div data-bp="sheet" class="panel" role="dialog" aria-modal="true" aria-labelledby="bp-sheet-title">
      <div class="head">
        <button type="button" class="ib" aria-label=${this.strings.close} title=${this.strings.close} @click=${() => this.closeDrawer('user')}>${glyph('left', 18)}</button>
        <h2 id="bp-sheet-title" title=${this.selectionLabel}>${this.selectionLabel}</h2>
      </div>
      ${this._filter()}${this._body()}
    </div>`;
  }

  render(): TemplateResult {
    const narrow = this.narrow;
    const sheet = this._open && narrow;
    return html`<div class="shell">
      <div data-bp="bar" ?inert=${sheet}><slot name="top"></slot></div>
      <div class="work" ?data-start=${this._has('start')} ?data-open=${this._open && !narrow} ?data-narrow=${narrow} ?data-rail=${this.startMode === 'rail'}>
        <div data-bp="start" ?inert=${sheet}><slot name="start" @slotchange=${this._onSlot}></slot></div>
        ${this._stage()}
        ${narrow ? nothing : this._drawer()}
      </div>
      ${sheet ? this._sheet() : nothing}
    </div>`;
  }
}
