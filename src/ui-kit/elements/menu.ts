import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { UI_KIT_CONTRACT_REVISION, type UiMenuClose, type UiMenuEntry, type UiMenuPick } from '../../contracts/ui-kit';
import { kitMenuElementCss } from '../css/elements';
import { isGlyphName, glyph, type GlyphName } from '../glyphs';
import { placeAtPoint, placeAtRect, showTop } from '../place';

/*
 * <mc-ui-menu> (contract ui-kit 1.0.0): action, overflow and context menu. Data API and events of <mc-path-menu>
 * (path-canvas): `items`, 'mc-menu-pick', 'mc-menu-close'. Top layer through the Popover API, a fixed-position
 * fallback without it. No strings of its own: every label comes from the caller.
 */

const M = 8;

export class UiMenu extends LitElement {
  static uiKitRevision = UI_KIT_CONTRACT_REVISION;
  static styles = kitMenuElementCss;

  @property({ attribute: false }) items: UiMenuEntry[] = [];
  @property() label = '';
  /** Viewport point (right-click, long-press). */
  @property({ attribute: false }) at?: [number, number];
  /** Or under / over this element (menu button). */
  @property({ attribute: false }) anchor?: HTMLElement;
  @property() align: 'start' | 'end' = 'start';
  @property({ type: Boolean }) touch = false;
  @property({ attribute: false }) opener?: HTMLElement;

  @state() private _open = false;
  /** Index of the open submenu parent in `items`, or -1. */
  @state() private _sub = -1;
  private _subRow?: HTMLElement;

  get open(): boolean {
    return this._open;
  }

  show(): void {
    this._open = true;
    this._sub = -1;
    document.addEventListener('pointerdown', this._outside, true);
    void this.updateComplete.then(() => {
      this.placeMain();
      this.focusIn(this.list(), this.firstFree(this.items));
    });
  }

  close(reason: UiMenuClose['reason'] = 'escape'): void {
    if (!this._open) return;
    this._open = false;
    this._sub = -1;
    document.removeEventListener('pointerdown', this._outside, true);
    this.dispatchEvent(new CustomEvent<UiMenuClose>('mc-menu-close', { detail: { reason }, bubbles: true, composed: true }));
    if (reason !== 'pick') (this.opener ?? this.anchor)?.focus?.({ preventScroll: true });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('pointerdown', this._outside, true);
  }

  protected updated(_c: PropertyValues): void {
    for (const el of this.renderRoot.querySelectorAll<HTMLElement>('.menu[popover]')) showTop(el);
  }

  private _outside = (e: Event): void => {
    const path = e.composedPath();
    if (path.includes(this)) return;
    // the menu button toggles: its own press closes through its click handler, not as an outside press
    if (this.anchor && path.includes(this.anchor)) return this.close('outside');
    this.close('outside');
  };

  private placeMain(): void {
    const el = this.renderRoot.querySelector<HTMLElement>('.menu');
    if (!el) return;
    showTop(el);
    if (this.anchor) placeAtRect(el, this.anchor.getBoundingClientRect(), this.align);
    else placeAtPoint(el, this.at ?? [0, 0], this.touch ? M : 0);
  }

  private list(): HTMLElement | null {
    return this.renderRoot.querySelector(this._sub >= 0 ? '.sub' : '.menu');
  }

  private firstFree(list: UiMenuEntry[]): number {
    return Math.max(0, list.findIndex((i) => !i.reason));
  }

  private focusIn(root: HTMLElement | null, i: number): void {
    root?.querySelectorAll<HTMLElement>('[role^=menuitem]')[i]?.focus({ preventScroll: true });
  }

  private entries(): UiMenuEntry[] {
    return this._sub >= 0 ? (this.items[this._sub]?.items ?? []) : this.items;
  }

  private openSub(i: number, row: HTMLElement): void {
    const e = this.items[i];
    if (!e?.items?.length || e.reason) return;
    this._sub = i;
    this._subRow = row;
    void this.updateComplete.then(() => {
      const sub = this.renderRoot.querySelector<HTMLElement>('.sub');
      if (sub) {
        showTop(sub);
        const r = row.getBoundingClientRect();
        const w = sub.getBoundingClientRect().width;
        const x = r.right + w + M <= window.innerWidth ? r.right : Math.max(M, r.left - w);
        placeAtPoint(sub, [x, r.top]);
      }
      this.focusIn(this.list(), this.firstFree(e.items ?? []));
    });
  }

  private pick(i: number, row: HTMLElement): void {
    const e = this.entries()[i];
    if (!e || e.reason) return;
    if (e.items) return this.openSub(i, row);
    this.dispatchEvent(new CustomEvent<UiMenuPick>('mc-menu-pick', { detail: { id: e.id }, bubbles: true, composed: true }));
    this.close('pick');
  }

  private _key = (ev: KeyboardEvent): void => {
    const list = this.list();
    if (!list) return;
    const rows = [...list.querySelectorAll<HTMLElement>('[role^=menuitem]')];
    const cur = rows.indexOf(ev.composedPath()[0] as HTMLElement);
    const entries = this.entries();
    const n = rows.length;
    const go = (i: number): void => rows[(i + n) % n]?.focus();
    const k = ev.key;
    let handled = true;
    if (k === 'ArrowDown') go(cur + 1);
    else if (k === 'ArrowUp') go(cur < 0 ? n - 1 : cur - 1);
    else if (k === 'Home') go(0);
    else if (k === 'End') go(n - 1);
    else if (k === 'Enter' || k === ' ') this.pick(cur, rows[cur]);
    else if (k === 'ArrowRight') {
      if (this._sub < 0 && entries[cur]?.items) this.openSub(cur, rows[cur]);
    } else if (k === 'ArrowLeft' || k === 'Escape') {
      if (this._sub >= 0) {
        const p = this._sub;
        this._sub = -1;
        void this.updateComplete.then(() => this.focusIn(this.list(), p));
      } else if (k === 'Escape') this.close('escape');
    } else if (k === 'Tab') {
      handled = false;
      this.close('tab');
    } else if (k.length === 1 && !ev.ctrlKey && !ev.metaKey && !ev.altKey) {
      const hit = entries.map((_, j) => (cur + 1 + j) % n).find((j) => entries[j].label.toLowerCase().startsWith(k.toLowerCase()));
      if (hit !== undefined) go(hit);
    } else handled = false;
    if (handled) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  };

  private mark(e: UiMenuEntry): TemplateResult | typeof nothing {
    if (e.glyph && isGlyphName(e.glyph)) return html`<span class="glyph">${glyph(e.glyph as GlyphName, 18)}</span>`;
    if (e.icon) return html`<span class="glyph"><ha-icon icon=${e.icon}></ha-icon></span>`;
    return nothing;
  }

  private row(e: UiMenuEntry, i: number): TemplateResult {
    const sub = !!e.items;
    const role = e.checked === undefined ? 'menuitem' : 'menuitemcheckbox';
    return html`${e.separatorBefore ? html`<div class="sep" role="separator"></div>` : nothing}<div
        class="item ${e.danger ? 'danger' : ''}"
        role=${role}
        tabindex="-1"
        aria-checked=${e.checked === undefined ? nothing : String(e.checked)}
        aria-disabled=${e.reason ? 'true' : nothing}
        aria-description=${e.reason ?? e.sub ?? nothing}
        aria-keyshortcuts=${e.keys ?? nothing}
        aria-haspopup=${sub ? 'menu' : nothing}
        aria-expanded=${sub ? String(this._sub === i) : nothing}
        @click=${(ev: Event) => this.pick(i, ev.currentTarget as HTMLElement)}
      >
        ${this.mark(e)}<span class="label">${e.label}</span>${e.keys ? html`<span class="keys">${e.keys}</span>` : nothing}${sub ? '›' : nothing}${e.reason ? html`<span class="why">${e.reason}</span>` : nothing}${e.sub ? html`<span class="sub-line">${e.sub}</span>` : nothing}
      </div>`;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._open) return nothing;
    const sub = this.items[this._sub];
    return html`<div class="menu" role="menu" aria-label=${this.label} popover="manual" style=${`max-height:${window.innerHeight - M * 2}px`} @keydown=${this._key}>
        ${this.items.map((e, i) => this.row(e, i))}
      </div>${sub?.items
        ? html`<div class="sub menu" role="menu" aria-label=${sub.label} popover="manual" @keydown=${this._key}>${sub.items.map((e, i) => this.row(e, i))}</div>`
        : nothing}`;
  }
}
