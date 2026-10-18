import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { MenuClose, MenuEntry, MenuPick } from '../contracts/path-canvas';
import type { Pt } from '../contracts/path-model';

/*
 * <mc-path-menu> (contract path-canvas rev 5): a generic menu both editors use for the canvas, layer
 * rows and a "More actions" button. The host passes every label; the element has no strings of its own.
 * Roving focus on real elements, one submenu level, position: fixed so it never clips.
 */

const M = 8;

export class PathMenu extends LitElement {
  static styles = css`
    :host {
      display: contents;
      --a: var(--mc-accent, var(--primary-color, #03a9f4));
      --t2: var(--mc-text-2, var(--secondary-text-color, #5f6368));
    }
    .menu {
      position: fixed;
      z-index: 9;
      box-sizing: border-box;
      min-width: 180px;
      max-width: calc(100vw - 16px);
      padding: 4px;
      overflow-y: auto;
      border-radius: 10px;
      background: var(--mc-surface, var(--card-background-color, #fff));
      color: var(--mc-text, var(--primary-text-color, #212121));
      box-shadow: var(--mc-shadow-float, 0 4px 16px #0003);
      font: 14px/1.3 system-ui, sans-serif;
    }
    .item {
      display: flex;
      flex-wrap: wrap;
      gap: 2px 16px;
      min-height: 32px;
      padding: 6px 10px;
      box-sizing: border-box;
      align-items: center;
      border-radius: 6px;
      cursor: pointer;
      outline: none;
    }
    .item:hover {
      background: var(--mc-accent-tint, #03a9f41f);
    }
    .item:focus-visible {
      outline: 2px solid var(--a);
      outline-offset: -2px;
    }
    [aria-disabled] {
      opacity: 0.6;
      cursor: default;
    }
    .lbl {
      flex: 1;
    }
    .key,
    .why {
      font-size: 12px;
      color: var(--t2);
    }
    .why {
      display: none;
      flex-basis: 100%;
    }
    .item:focus .why {
      display: block;
    }
    .sep {
      height: 1px;
      margin: 4px 0;
      background: var(--mc-divider, #0002);
    }
    @media (pointer: coarse) {
      .item {
        min-height: 44px;
      }
      .key {
        display: none;
      }
    }
  `;

  @property({ attribute: false }) items: MenuEntry[] = [];
  @property() label = '';
  @property({ attribute: false }) at: Pt = [0, 0];
  @property({ type: Boolean }) touch = false;
  @property({ attribute: false }) opener?: HTMLElement;

  @state() private _open = false;
  /** Index of the open submenu parent in `items`, or -1. */
  @state() private _sub = -1;
  private _pos: Pt = [0, 0];
  private _subPos: Pt = [0, 0];

  open(): void {
    this._open = true;
    this._sub = -1;
    document.addEventListener('pointerdown', this._outside, true);
    void this.updateComplete.then(() => {
      this.place('.menu', this.at, this.touch ? M : 0, (p) => (this._pos = p));
      this.focusIn(this.list(), this.firstFree(this.items));
    });
  }

  close(reason: MenuClose['reason'] = 'escape'): void {
    if (!this._open) return;
    this._open = false;
    this._sub = -1;
    document.removeEventListener('pointerdown', this._outside, true);
    this.dispatchEvent(new CustomEvent<MenuClose>('mc-menu-close', { detail: { reason }, bubbles: true, composed: true }));
    if (reason === 'escape' || reason === 'outside') this.opener?.focus();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('pointerdown', this._outside, true);
  }

  private _outside = (e: Event): void => {
    if (!e.composedPath().includes(this)) this.close('outside');
  };

  private list(): HTMLElement {
    return this.renderRoot.querySelector(this._sub >= 0 ? '.sub' : '.menu') as HTMLElement;
  }

  private firstFree(list: MenuEntry[]): number {
    return Math.max(0, list.findIndex((i) => !i.reason));
  }

  private focusIn(root: HTMLElement | null, i: number): void {
    (root?.querySelectorAll<HTMLElement>('[role^=menuitem]')[i] ?? null)?.focus();
  }

  /** Put the element at `at`, flipped and clamped into the viewport; `gap` keeps it off a touch point. */
  private place(sel: string, at: Pt, gap: number, set: (p: Pt) => void): void {
    const el = this.renderRoot.querySelector<HTMLElement>(sel);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const fit = (p: number, size: number, max: number): number => {
      let v = p + gap;
      if (v + size > max - M) v = p - gap - size;
      return Math.max(M, Math.min(v, max - M - size));
    };
    set([fit(at[0], r.width, window.innerWidth), fit(at[1], r.height, window.innerHeight)]);
    this.requestUpdate();
  }

  private entries(): MenuEntry[] {
    return this._sub >= 0 ? (this.items[this._sub]?.items ?? []) : this.items;
  }

  private openSub(i: number, row: HTMLElement): void {
    const e = this.items[i];
    if (!e?.items?.length || e.reason) return;
    const r = row.getBoundingClientRect();
    this._sub = i;
    void this.updateComplete.then(() => {
      const w = this.renderRoot.querySelector('.sub')?.getBoundingClientRect().width ?? 0;
      this.place('.sub', [r.right + w + M <= window.innerWidth ? r.right : Math.max(M, r.left - w), r.top], 0, (p) => (this._subPos = p));
      void this.updateComplete.then(() => this.focusIn(this.list(), this.firstFree(e.items ?? [])));
    });
  }

  private pick(i: number, row: HTMLElement): void {
    const e = this.entries()[i];
    if (!e || e.reason) return;
    if (e.items) return this.openSub(i, row);
    this.dispatchEvent(new CustomEvent<MenuPick>('mc-menu-pick', { detail: { id: e.id }, bubbles: true, composed: true }));
    this.close('pick');
  }

  private _key = (ev: KeyboardEvent): void => {
    const rows = [...this.list().querySelectorAll<HTMLElement>('[role^=menuitem]')];
    const cur = rows.indexOf(ev.composedPath()[0] as HTMLElement);
    const list = this.entries();
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
      if (this._sub < 0 && list[cur]?.items) this.openSub(cur, rows[cur]);
    } else if (k === 'ArrowLeft' || k === 'Escape') {
      if (this._sub >= 0) {
        const p = this._sub;
        this._sub = -1;
        void this.updateComplete.then(() => this.focusIn(this.list(), p));
      } else if (k === 'Escape') this.close('escape');
    } else if (k === 'Tab') {
      handled = false;
      this.opener?.focus();
      this.close('tab');
    } else if (k.length === 1 && !ev.ctrlKey && !ev.metaKey && !ev.altKey) {
      const at = list.map((_, j) => (cur + 1 + j) % n).find((j) => list[j].label.toLowerCase().startsWith(k.toLowerCase()));
      if (at !== undefined) go(at);
    } else handled = false;
    if (handled) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  };

  private row(e: MenuEntry, i: number): TemplateResult {
    const sub = !!e.items;
    const role = e.checked === undefined ? 'menuitem' : 'menuitemcheckbox';
    return html`${e.separatorBefore ? html`<div class="sep" role="separator"></div>` : nothing}<div
        class="item"
        role=${role}
        tabindex="-1"
        aria-checked=${e.checked === undefined ? nothing : String(e.checked)}
        aria-disabled=${e.reason ? 'true' : nothing}
        aria-description=${e.reason ?? nothing}
        aria-keyshortcuts=${e.keys ?? nothing}
        aria-haspopup=${sub ? 'menu' : nothing}
        aria-expanded=${sub ? String(this._sub === i) : nothing}
        @click=${(ev: Event) => this.pick(i, ev.currentTarget as HTMLElement)}
      >
        <span class="lbl">${e.label}</span>${e.keys ? html`<span class="key">${e.keys}</span>` : nothing}${sub ? '›' : nothing}${e.reason ? html`<span class="why">${e.reason}</span>` : nothing}
      </div>`;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._open) return nothing;
    const style = (p: Pt): string => `left:${p[0]}px;top:${p[1]}px;max-height:${window.innerHeight - M * 2}px`;
    const sub = this.items[this._sub];
    return html`<div class="menu" role="menu" aria-label=${this.label} style=${style(this._pos)} @keydown=${this._key}>
        ${this.items.map((e, i) => this.row(e, i))}
      </div>${sub?.items ? html`<div class="sub menu" role="menu" aria-label=${sub.label} style=${style(this._subPos)} @keydown=${this._key}>${sub.items.map((e, i) => this.row(e, i))}</div>` : nothing}`;
  }
}
