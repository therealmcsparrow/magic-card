import type { ReactiveController, ReactiveControllerHost } from 'lit';

/** True when the browser supports the Popover API (top-layer rendering). */
export function supportsPopover(): boolean {
  return typeof HTMLElement !== 'undefined' && typeof (HTMLElement.prototype as { showPopover?: unknown }).showPopover === 'function';
}

export interface MenuPopoverOptions {
  /** The rendered menu element (role="menu") while open. */
  menu: () => HTMLElement | null | undefined;
  /** Called after the menu closed (host resets its own open state here). */
  onClose?: () => void;
  /** Horizontal alignment with the trigger: 'start' = left edges, 'end' = right edges. */
  align?: 'start' | 'end';
  /**
   * Without the Popover API: still position with fixed viewport coordinates (the menu's own CSS is
   * position: fixed). Otherwise the menu keeps its CSS (absolute, under the trigger).
   */
  fixedFallback?: boolean;
}

const GAP = 4;
const EDGE = 8;
const ITEMS = '[role="menuitem"]:not([disabled])';

/** Where a context menu opens: a viewport point (pointer) and the element focus returns to. */
export interface MenuOpenAt {
  /** Viewport point (right-click, long-press); without it the menu sits at the trigger's rect. */
  point?: { x: number; y: number };
  /** Focus goes back here on Escape / Tab (default: the trigger). */
  returnFocus?: HTMLElement;
}

/**
 * One overflow / action menu of an editor element.
 *
 * The menu element stays in the host's shadow root (so its styles apply) but is shown in the
 * browser's top layer with the Popover API (`popover="manual"` + showPopover()). Top-layer elements
 * are positioned against the viewport even when an ancestor has a transform or clips overflow, which
 * is exactly what HA's card-editor dialog does (ha-dialog -> wa-dialog::part(dialog) has
 * `transform: translate(...)` and `overflow: hidden`): a plain `position: fixed` menu inside it is
 * offset by the dialog's origin and clipped away. Popovers opened later also stack above the
 * studio's modal <dialog>.
 *
 * Handles: positioning from the trigger rect or a pointer point (flips up when there is no room
 * below), keyboard navigation (ArrowUp/Down, Home/End, first-letter type-ahead, Escape with
 * stopPropagation, Tab closes and returns focus to the origin), outside-pointer close via
 * composedPath, following scroll in every enclosing shadow root, close on resize.
 */
export class MenuPopover implements ReactiveController {
  trigger: HTMLElement | null = null;
  private _at: MenuOpenAt = {};
  private _shown: HTMLElement | null = null;
  private _scrollRoots: EventTarget[] = [];
  private _raf = 0;

  constructor(private readonly host: ReactiveControllerHost & HTMLElement, private readonly opts: MenuPopoverOptions) {
    host.addController(this);
  }

  get isOpen(): boolean {
    return !!this.trigger;
  }

  hostUpdated(): void {
    if (!this.trigger) return;
    const el = this.opts.menu();
    if (el && el !== this._shown) this._show(el);
  }

  hostDisconnected(): void {
    this.close(false);
  }

  /** Open for `trigger` (toggle: the same trigger closes it). The host renders the menu while isOpen. */
  open(trigger: HTMLElement): void {
    if (this.trigger === trigger) {
      this.close(true);
      return;
    }
    this.openAt(trigger);
  }

  /**
   * Open as a context menu (no toggle): at `at.point` when given (else at the trigger's rect); focus
   * returns to `at.returnFocus` (else the trigger). A menu already open closes first.
   */
  openAt(trigger: HTMLElement, at: MenuOpenAt = {}): void {
    if (this.trigger) this.close(false);
    this.trigger = trigger;
    this._at = at;
    document.addEventListener('pointerdown', this._onOutside, true);
    window.addEventListener('resize', this._onResize);
    this._scrollRoots = scrollRoots(trigger);
    for (const r of this._scrollRoots) r.addEventListener('scroll', this._onScroll, true);
    this.host.requestUpdate();
  }

  close(restoreFocus: boolean): void {
    const trigger = this.trigger;
    if (!trigger) return;
    const back = this._at.returnFocus ?? trigger;
    this.trigger = null;
    this._at = {};
    document.removeEventListener('pointerdown', this._onOutside, true);
    window.removeEventListener('resize', this._onResize);
    for (const r of this._scrollRoots) r.removeEventListener('scroll', this._onScroll, true);
    this._scrollRoots = [];
    cancelAnimationFrame(this._raf);
    const el = this._shown;
    this._shown = null;
    if (el && supportsPopover() && el.hasAttribute('popover')) {
      try {
        el.hidePopover();
      } catch {
        /* already hidden or gone */
      }
    }
    this.opts.onClose?.();
    this.host.requestUpdate();
    if (restoreFocus && back.isConnected) back.focus({ preventScroll: true });
  }

  /** Keyboard handling for the menu element (@keydown on it). */
  onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this.close(true);
      return;
    }
    if (e.key === 'Tab') {
      // from a top-layer menu the next Tab stop is unpredictable: back to where the menu came from
      e.preventDefault();
      this.close(true);
      return;
    }
    const items = Array.from(this.opts.menu()?.querySelectorAll<HTMLElement>(ITEMS) || []);
    const active = (this.host.shadowRoot?.activeElement ?? document.activeElement) as HTMLElement | null;
    const i = active ? items.indexOf(active) : -1;
    // type-ahead: the next item starting with the typed letter
    if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const k = e.key.toLowerCase();
      const n = items.length;
      const hit = Array.from({ length: n }, (_, d) => items[(i + 1 + d) % n]).find((b) => b.textContent?.trim().toLowerCase().startsWith(k));
      if (hit) {
        e.preventDefault();
        e.stopPropagation();
        hit.focus();
      }
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();
    if (!items.length) return;
    let next = 0;
    if (e.key === 'ArrowDown') next = i < 0 ? 0 : (i + 1) % items.length;
    else if (e.key === 'ArrowUp') next = i < 0 ? items.length - 1 : (i - 1 + items.length) % items.length;
    else if (e.key === 'End') next = items.length - 1;
    items[next].focus();
  };

  /** Place the menu next to its trigger in viewport coordinates. */
  position(): void {
    const el = this._shown;
    const t = this.trigger;
    if (!el || !t) return;
    const popover = supportsPopover();
    if (!popover && !this.opts.fixedFallback) return;
    const p = this._at.point;
    const r = p ? ({ left: p.x, right: p.x, top: p.y, bottom: p.y } as DOMRect) : t.getBoundingClientRect();
    const vw = window.innerWidth || document.documentElement.clientWidth || 0;
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    el.style.maxHeight = '';
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const below = vh - r.bottom - GAP - EDGE;
    const above = r.top - GAP - EDGE;
    const up = vh > 0 && h > below && above > below;
    const room = up ? above : below;
    if (vh > 0 && h > room) el.style.maxHeight = `${Math.max(120, room)}px`;
    const height = Math.min(h, vh > 0 ? Math.max(120, room) : h);
    const top = up ? Math.max(EDGE, r.top - GAP - height) : r.bottom + GAP;
    let left = this.opts.align === 'end' && !p ? r.right - w : r.left;
    if (vw > 0) left = Math.min(left, vw - w - EDGE);
    left = Math.max(EDGE, left);
    Object.assign(el.style, { top: `${Math.round(top)}px`, left: `${Math.round(left)}px`, right: 'auto', bottom: 'auto' });
    el.dataset.placement = up ? 'top' : 'bottom';
  }

  private _show(el: HTMLElement): void {
    this._shown = el;
    if (supportsPopover()) {
      el.setAttribute('popover', 'manual');
      try {
        el.showPopover();
      } catch {
        /* keep the in-flow fallback */
      }
    }
    this.position();
    el.querySelector<HTMLElement>(ITEMS)?.focus({ preventScroll: true });
  }

  private _inMenu(e: Event): boolean {
    const el = this._shown;
    return !!el && e.composedPath().includes(el);
  }

  private _onOutside = (e: Event): void => {
    // a context menu (point) closes on any press outside it, its trigger included
    if (this._inMenu(e) || (!this._at.point && this.trigger && e.composedPath().includes(this.trigger))) return;
    this.close(false);
  };

  private _onResize = (): void => this.close(false);

  /** A scroll anywhere around the trigger: follow it; close once the trigger has left the viewport. */
  private _onScroll = (e: Event): void => {
    if (this._inMenu(e)) return;
    cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(() => {
      const t = this.trigger;
      if (!t) return;
      // a menu opened at the pointer stays where it was put (it no longer points at anything after a scroll)
      if (this._at.point) return this.close(false);
      const r = t.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      if (!t.isConnected || (vh && (r.bottom < 0 || r.top > vh))) this.close(false);
      else this.position();
    });
  };
}

/**
 * Scroll events are not composed: a scroll inside a shadow root never reaches window. Listen on
 * every shadow root along the trigger's flat-tree ancestors, slots included (HA's dialog scroller
 * lives in the shadow root of the ha-dialog our editor is slotted into).
 */
function scrollRoots(node: Node): EventTarget[] {
  const out: EventTarget[] = [];
  let n: Node | null = node;
  while (n) {
    if (n instanceof ShadowRoot) {
      if (!out.includes(n)) out.push(n);
      n = n.host;
      continue;
    }
    const slot: HTMLSlotElement | null = n instanceof Element || n instanceof Text ? n.assignedSlot : null;
    n = slot || n.parentNode;
  }
  out.push(window);
  return out;
}
