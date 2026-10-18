import { css, html, nothing, type ReactiveController, type ReactiveControllerHost, type TemplateResult } from 'lit';
import { EMPTY_LAYER_VIEW, LAYER_TOGGLES, type LayerKey, type LayerToggle, type LayerView, type LayerViewChangeDetail, type LayersDensity } from '../../contracts/studio-layers';
import type { AnimationDoc } from '../model';
import { hideReason, isLocked, markedBelow, parentKey, toggleLayer } from '../layer-view';

/*
 * The shared layer row and its keyboard model (contract studio-layers.ts sections 4 and 5, design 08).
 * Every layers panel (Card parts, Icon parts, Shapes over / under the icon, later particles, tracks,
 * steps) renders its rows with `LayerRows.row()` and gets: a roving tab stop for the whole column,
 * Up / Down / Home / End across the panels, Right / Left for a disclosure, Alt+Up / Down to move, H S L
 * for hide / solo / lock, F2 to rename, the "Layer actions" menu in compact density, and
 * `layer-view-change` events. Rows are buttons (aria-pressed = selected) in a list item together with
 * their toggle buttons; the toggles are in the tab order only for the row that holds the tab stop.
 */

/** Why a move is not possible, or what it does. */
export interface MoveInfo {
  ok: boolean;
  /** Accessible name of the button. */
  label: string;
  /** Menu text (default: the label). */
  menu?: string;
}

export interface RowInit {
  key: LayerKey;
  name: string;
  /** mdi icon of the kind, or a thumbnail. */
  icon?: string;
  thumb?: TemplateResult;
  /** Second line (e.g. "draws on"). */
  note?: string;
  /** Count badge ("3 keys"). */
  badge?: string;
  level?: 1 | 2;
  /** Disclosure: undefined = no children. */
  expanded?: boolean;
  selected: boolean;
  /** Which toggles this row offers (default: LAYER_TOGGLES of its kind). */
  toggles?: readonly LayerToggle[];
  up?: MoveInfo;
  down?: MoveInfo;
  /** The rename input replaces the name. */
  renaming?: TemplateResult;
  /** Offer Rename (F2, menu). */
  renamable?: boolean;
  /** Panel buttons after the toggles (e.g. delete); give them `data-ctl`. */
  extra?: TemplateResult;
  /** Extra text for the screen reader ("draws on, moves along a path"). */
  describe?: string;
  title?: string;
}

export interface RowActions {
  /** Click, Enter or Space on a row. */
  select(key: LayerKey, e: MouseEvent | KeyboardEvent): void;
  move?(key: LayerKey, dir: 'up' | 'down'): void;
  rename?(key: LayerKey): void;
  open?(key: LayerKey, open: boolean): void;
  /** Row name for descriptions ("hidden because Group 1 is hidden"). */
  nameOf?(key: LayerKey): string;
  /** Row double-click (default: nothing). */
  dblclick?(key: LayerKey): void;
}

export interface LayerHost extends ReactiveControllerHost, HTMLElement {
  renderRoot: HTMLElement | DocumentFragment;
  doc?: AnimationDoc;
  layerView?: LayerView;
  density?: LayersDensity;
  updateComplete: Promise<boolean>;
}

const TOGGLE_TEXT: Record<LayerToggle, { name: string; tip: [string, string]; key: string; icon: [string, string]; on: string }> = {
  hide: { name: 'Hide in preview', tip: ['Hide in preview (not saved)', 'Show in preview'], key: 'H', icon: ['mdi:eye-outline', 'mdi:eye-off-outline'], on: 'hidden in the preview' },
  solo: { name: 'Solo in preview', tip: ['Solo in preview (hides the others, not saved)', 'End solo'], key: 'S', icon: ['mdi:radiobox-blank', 'mdi:radiobox-marked'], on: 'solo' },
  lock: { name: 'Lock', tip: ['Lock', 'Unlock'], key: 'L', icon: ['mdi:lock-open-variant-outline', 'mdi:lock-outline'], on: 'locked' },
};
const TOGGLES: LayerToggle[] = ['hide', 'solo', 'lock'];
const SAYS: Record<LayerToggle, [string, string]> = { hide: ['hidden in the preview', 'shown in the preview'], solo: ['soloed in the preview', 'no longer soloed'], lock: ['locked', 'unlocked'] };

// ── the column: one tab stop, arrows across the lists ──

let active = '';

/** Forget which row held the tab stop (tests, another document). */
export const resetLayerFocus = (): void => {
  active = '';
};

/** Every row button of the layers column the host is in (DOM order = top to bottom). */
export function columnRows(host: Element, body?: Element | null): HTMLElement[] {
  const root = body ?? host.closest('.layers-body');
  const panels = root ? [...root.querySelectorAll<HTMLElement>('[data-panel] > *')] : [host as HTMLElement];
  return panels.flatMap((p) => [...(p.shadowRoot?.querySelectorAll<HTMLElement>('[data-lk]') ?? [])]);
}

/** Exactly one row of the column is in the tab order, with its buttons; the others are reached by arrow keys. */
export function syncTabStops(host: Element): void {
  const rows = columnRows(host);
  const keep = rows.find((r) => r.dataset.lk === active) ?? rows.find((r) => r.getAttribute('aria-pressed') === 'true') ?? rows[0];
  for (const r of rows) {
    const on = r === keep;
    r.tabIndex = on ? 0 : -1;
    r.closest('li')?.querySelectorAll<HTMLElement>('[data-ctl]').forEach((c) => (c.tabIndex = on ? 0 : -1));
  }
}

export class LayerRows implements ReactiveController {
  private _menu?: { key: LayerKey; x: number; y: number; first?: boolean };
  private _focus?: { key: LayerKey; ctl?: string };
  private _n = 0;

  constructor(
    private readonly host: LayerHost,
    private readonly actions: RowActions,
  ) {
    host.addController(this);
  }

  hostUpdated(): void {
    syncTabStops(this.host);
    const f = this._focus;
    const menu = this.host.renderRoot?.querySelector<HTMLElement>('.lmenu');
    if (menu && this._menu?.first) {
      this._menu.first = false;
      (menu as HTMLElement & { showPopover?: () => void }).showPopover?.();
      menu.querySelector<HTMLElement>('[role^="menuitem"]')?.focus();
    }
    if (f) void this._refocus(f);
  }

  private get view(): LayerView {
    return this.host.layerView ?? EMPTY_LAYER_VIEW;
  }

  // ── events ──

  /** Send a new view (and what the live region says). */
  announce(text: string, view: LayerView = this.view): void {
    this.host.dispatchEvent(new CustomEvent<LayerViewChangeDetail>('layer-view-change', { detail: { view, announce: text }, bubbles: true, composed: true }));
  }

  /** Whether a row is locked (directly or through its group, target or emitter). */
  locked(key: LayerKey): boolean {
    return !!this.host.doc && isLocked(this.host.doc, this.view, key);
  }

  /** Say "X is locked" when it is; true then. */
  refuseLocked(key: LayerKey, name: string): boolean {
    if (!this.locked(key)) return false;
    this.announce(`${name} is locked. Unlock it in Layers.`);
    return true;
  }

  toggle(key: LayerKey, name: string, kind: LayerToggle): void {
    const next = toggleLayer(this.view, key, kind);
    const on = next[kind === 'hide' ? 'hidden' : kind === 'solo' ? 'solo' : 'locked'].includes(key);
    this.announce(`${name} ${SAYS[kind][on ? 0 : 1]}`, next);
  }

  /** Focus a row (or one of its buttons) once it is rendered, also in another panel of the column. */
  focusKey(key: LayerKey, ctl?: string): void {
    this._focus = { key, ctl };
    void this._refocus(this._focus);
    this.host.requestUpdate();
  }

  private async _refocus(f: { key: LayerKey; ctl?: string }, tries = 0): Promise<void> {
    await this.host.updateComplete;
    const row = columnRows(this.host).find((r) => r.dataset.lk === f.key);
    const el = row ? (f.ctl ? row.closest('li')?.querySelector<HTMLElement>(`[data-ctl="${f.ctl}"]`) : row) : undefined;
    if (el) {
      if (this._focus === f) this._focus = undefined;
      active = f.key;
      el.focus();
      el.scrollIntoView?.({ block: 'nearest' });
    } else if (tries < 4 && this._focus === f) setTimeout(() => void this._refocus(f, tries + 1), 16);
    else if (this._focus === f) this._focus = undefined;
  }

  // ── keyboard ──

  private _key(e: KeyboardEvent, r: RowInit): void {
    const t = e.target as HTMLElement;
    if (!t.matches?.('[data-lk]') || e.ctrlKey || e.metaKey) return;
    const rows = columnRows(this.host);
    const at = rows.indexOf(t);
    const go = (i: number): void => {
      e.preventDefault();
      rows[Math.max(0, Math.min(rows.length - 1, i))]?.focus();
    };
    if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      this._move(r, e.key === 'ArrowUp' ? 'up' : 'down');
      return;
    }
    if (e.altKey) return;
    if (!e.shiftKey && e.key === 'ArrowUp') return go(at - 1);
    if (!e.shiftKey && e.key === 'ArrowDown') return go(at + 1);
    if (e.key === 'Home') return go(0);
    if (e.key === 'End') return go(rows.length - 1);
    if (e.key === 'ArrowRight' && r.expanded === false) {
      e.preventDefault();
      this.actions.open?.(r.key, true);
    } else if (e.key === 'ArrowLeft') {
      if (r.expanded) {
        e.preventDefault();
        this.actions.open?.(r.key, false);
      } else {
        const p = this.host.doc ? parentKey(this.host.doc, r.key) : undefined;
        if (p) {
          e.preventDefault();
          this.focusKey(p);
        }
      }
    } else if (e.key === 'F2' && r.renamable && this.actions.rename) {
      e.preventDefault();
      this._rename(r);
    } else if (!e.shiftKey && e.key.length === 1) {
      const kind = TOGGLES.find((k) => TOGGLE_TEXT[k].key === e.key.toUpperCase());
      if (kind && this._toggles(r).includes(kind)) {
        e.preventDefault();
        this.toggle(r.key, r.name, kind);
      }
    }
  }

  private _toggles(r: RowInit): readonly LayerToggle[] {
    return r.toggles ?? LAYER_TOGGLES[r.key.split(':')[0]] ?? [];
  }

  private _move(r: RowInit, dir: 'up' | 'down', ctl?: string): void {
    const m = dir === 'up' ? r.up : r.down;
    if (!m?.ok || !this.actions.move) return;
    if (this.refuseLocked(r.key, r.name)) return;
    this.actions.move(r.key, dir);
    this.focusKey(r.key, ctl);
  }

  private _rename(r: RowInit): void {
    if (this.refuseLocked(r.key, r.name)) return;
    this.actions.rename?.(r.key);
  }

  // ── menu ──

  private _openMenu(key: LayerKey, btn: HTMLElement, first = true): void {
    const b = btn.getBoundingClientRect();
    const h = 8 + 32 * 6;
    const below = b.bottom + h <= (globalThis.innerHeight || 800);
    this._menu = { key, x: Math.max(8, b.right - 200), y: below ? b.bottom + 2 : Math.max(8, b.top - h - 2), first };
    this.host.requestUpdate();
  }

  private _closeMenu(back = true): void {
    const key = this._menu?.key;
    this._menu = undefined;
    this.host.requestUpdate();
    if (key && back) this.focusKey(key, 'menu');
  }

  private _menuKey(e: KeyboardEvent): void {
    const items = [...(e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role^="menuitem"]')];
    const at = items.indexOf(e.target as HTMLElement);
    const to = (i: number): void => {
      e.preventDefault();
      items[(i + items.length) % items.length]?.focus();
    };
    if (e.key === 'ArrowDown') to(at + 1);
    else if (e.key === 'ArrowUp') to(at - 1);
    else if (e.key === 'Home') to(0);
    else if (e.key === 'End') to(items.length - 1);
    else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this._closeMenu();
    } else if (e.key === 'Tab') this._closeMenu(false);
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const n = items.length;
      for (let i = 1; i <= n; i++) {
        const it = items[(at + i) % n];
        if (it.textContent?.trim().toLowerCase().startsWith(e.key.toLowerCase())) return to((at + i) % n);
      }
    }
  }

  private _menuItems(r: RowInit): Array<{ label: string; check?: boolean; disabled?: boolean; hint?: string; run: () => void; sep?: boolean }> {
    const lock = this.locked(r.key);
    const out: Array<{ label: string; check?: boolean; disabled?: boolean; hint?: string; run: () => void; sep?: boolean }> = [];
    if (this.actions.move) {
      for (const dir of ['up', 'down'] as const) {
        const m = dir === 'up' ? r.up : r.down;
        if (!m) continue;
        const base = m.menu ?? m.label;
        out.push({ label: lock ? `${base.replace(/ \(.*\)$/, '')} (locked)` : base, disabled: !m.ok || lock, hint: dir === 'up' ? 'Alt+Up' : 'Alt+Down', run: () => this._move(r, dir, 'menu') });
      }
    }
    if (r.renamable && this.actions.rename) out.push({ label: lock ? 'Rename (locked)' : 'Rename', disabled: lock, hint: 'F2', run: () => this._rename(r) });
    const view = this.view;
    TOGGLES.filter((k) => this._toggles(r).includes(k)).forEach((k, i) => {
      const on = view[k === 'hide' ? 'hidden' : k === 'solo' ? 'solo' : 'locked'].includes(r.key);
      out.push({ label: TOGGLE_TEXT[k].name, check: on, hint: TOGGLE_TEXT[k].key, sep: i === 0 && out.length > 0, run: () => this.toggle(r.key, r.name, k) });
    });
    return out;
  }

  private _renderMenu(r: RowInit): TemplateResult {
    const m = this._menu!;
    return html`<div class="lmenu" role="menu" popover="auto" aria-label=${`Layer actions, ${r.name}`} style=${`top:${m.y}px;left:${m.x}px`} @keydown=${(e: KeyboardEvent) => this._menuKey(e)} @toggle=${(e: Event) => (e as Event & { newState?: string }).newState === 'closed' && this._menu && this._closeMenu(false)}>
      ${this._menuItems(r).map(
        (it) => html`${it.sep ? html`<div class="lsep" role="separator"></div>` : nothing}<button type="button" class="litem" tabindex="-1" role=${it.check === undefined ? 'menuitem' : 'menuitemcheckbox'} aria-checked=${it.check === undefined ? nothing : it.check ? 'true' : 'false'} aria-disabled=${it.disabled ? 'true' : nothing}
          @click=${() => {
            if (it.disabled) return;
            this._closeMenu();
            it.run();
          }}><span>${it.label}</span>${it.hint ? html`<kbd>${it.hint}</kbd>` : nothing}</button>`,
      )}
    </div>`;
  }

  // ── row ──

  row(r: RowInit): TemplateResult {
    const h = this.host;
    const doc = h.doc;
    const view = this.view;
    const compact = h.density === 'compact';
    const toggles = this._toggles(r);
    const why = doc ? hideReason(doc, view, r.key) : undefined;
    const name = (k?: LayerKey): string => (k ? (this.actions.nameOf?.(k) ?? k.split(':').slice(1).join(':')) : '');
    const soloed = view.solo.includes(r.key);
    const lockedSelf = view.locked.includes(r.key);
    const lockedVia = !lockedSelf && this.locked(r.key);
    const below = doc && r.expanded === false ? markedBelow(doc, view, r.key) : 0;
    const said = [
      r.describe,
      why?.kind === 'self' && 'hidden in the preview',
      why?.kind === 'solo' && 'hidden because another layer is soloed',
      why?.kind === 'parent' && `hidden because ${name(why.by)} is hidden`,
      soloed && 'solo',
      lockedSelf && 'locked',
      lockedVia && 'locked because the layer it belongs to is locked',
      below > 0 && `${below} hidden below`,
    ].filter(Boolean);
    const id = `ld${this._n++}`;
    const locked = lockedSelf || lockedVia;
    const btn = (k: LayerToggle): TemplateResult => {
      const on = (k === 'hide' ? why?.kind === 'self' : k === 'solo' ? soloed : lockedSelf) as boolean;
      const soft = !on && (k === 'hide' ? !!why : k === 'lock' ? lockedVia : false);
      const t = TOGGLE_TEXT[k];
      return html`<button type="button" class="lt ${soft ? 'soft' : ''}" data-ctl=${k} data-toggle=${k} tabindex="-1" aria-pressed=${on ? 'true' : 'false'} aria-label=${t.name} title=${t.tip[on ? 1 : 0]} @click=${() => this.toggle(r.key, r.name, k)}>
        <ha-icon icon=${t.icon[on || soft ? 1 : 0]}></ha-icon>
      </button>`;
    };
    const mv = (dir: 'up' | 'down'): TemplateResult | typeof nothing => {
      const m = dir === 'up' ? r.up : r.down;
      if (!m) return nothing;
      return html`<button type="button" class="lt mv ${dir}" data-ctl=${dir} tabindex="-1" aria-label=${m.label} title=${m.label} aria-disabled=${m.ok && !locked ? nothing : 'true'} @click=${() => this._move(r, dir, dir)}>
        <ha-icon icon=${dir === 'up' ? 'mdi:chevron-up' : 'mdi:chevron-down'}></ha-icon>
      </button>`;
    };
    const hasMenu = toggles.length > 0 || !!r.up || !!r.down || (r.renamable && !!this.actions.rename);
    const full = !compact
      ? html`<span class="lfull">${toggles.length ? TOGGLES.filter((k) => toggles.includes(k)).map(btn) : nothing}${mv('up')}${mv('down')}</span>`
      : nothing;
    return html`<li class="lr lvl-${r.level ?? 1} ${compact ? 'compact' : ''} ${r.selected ? 'sel' : ''} ${why ? 'is-hidden' : ''} ${locked ? 'is-locked' : ''}" data-ref=${r.key} data-id=${r.key.slice(r.key.indexOf(':') + 1)} @dblclick=${() => this.actions.dblclick?.(r.key)} @keydown=${(e: KeyboardEvent) => this._key(e, r)}>
      <div class="lr-in">
        ${r.expanded === undefined
          ? html`<span class="lcaret-space"></span>`
          : html`<button type="button" class="lt lcaret" tabindex="-1" aria-label=${r.expanded ? `Collapse ${r.name}` : `Expand ${r.name}`} @click=${() => this.actions.open?.(r.key, !r.expanded)}>
              <ha-icon icon=${r.expanded ? 'mdi:chevron-down' : 'mdi:chevron-right'}></ha-icon>
            </button>`}
        <button type="button" class="lr-main" data-lk=${r.key} tabindex="-1" aria-pressed=${r.selected ? 'true' : 'false'} aria-expanded=${r.expanded === undefined ? nothing : r.expanded ? 'true' : 'false'} aria-describedby=${said.length ? id : nothing} aria-keyshortcuts="H S L Alt+ArrowUp Alt+ArrowDown" title=${r.title ?? r.name} @focus=${(e: Event) => ((active = (e.currentTarget as HTMLElement).dataset.lk!), syncTabStops(h))} @click=${(e: MouseEvent) => this.actions.select(r.key, e)}>
          ${r.thumb ?? html`<ha-icon class="kind" icon=${r.icon ?? 'mdi:layers-outline'}></ha-icon>`}
          ${r.renaming ? nothing : html`<span class="nm"><span class="nm-t">${r.name}</span>${r.note ? html`<small>${r.note}</small>` : nothing}</span>`}
          ${r.badge ? html`<span class="lbadge">${r.badge}</span>` : nothing}
          ${below > 0 ? html`<span class="lbadge warn" aria-hidden="true">${below} hidden</span>` : nothing}
        </button>
        ${r.renaming ? html`<div class="lrename">${r.renaming}</div>` : nothing}
        <span class="lst" aria-hidden="true">
          ${why ? html`<ha-icon icon="mdi:eye-off-outline"></ha-icon>` : nothing}${soloed ? html`<ha-icon icon="mdi:radiobox-marked"></ha-icon>` : nothing}${locked ? html`<ha-icon icon="mdi:lock-outline"></ha-icon>` : nothing}
        </span>
        ${full}
        ${hasMenu
          ? html`<button type="button" class="lt lm" data-ctl="menu" tabindex="-1" aria-haspopup="menu" aria-expanded=${this._menu?.key === r.key ? 'true' : 'false'} aria-label=${`Layer actions, ${r.name}`} title="Layer actions" @click=${(e: Event) => (this._menu?.key === r.key ? this._closeMenu() : this._openMenu(r.key, e.currentTarget as HTMLElement))} @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                this._openMenu(r.key, e.currentTarget as HTMLElement);
              }
            }}>
              <ha-icon icon="mdi:dots-vertical"></ha-icon>
            </button>`
          : nothing}
        ${r.extra ?? nothing}
      </div>
      ${said.length ? html`<span id=${id} class="lr-sr">${said.join(', ')}</span>` : nothing}
      ${this._menu?.key === r.key ? this._renderMenu(r) : nothing}
    </li>`;
  }
}

export const layerRowStyles = css`
  .lr {
    list-style: none;
    container-type: inline-size;
    border-radius: var(--mc-radius, 8px);
  }
  .lr-in {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 2px;
    min-height: 32px;
    padding-right: 2px;
    border-radius: var(--mc-radius, 8px);
    --mdc-icon-size: 18px;
  }
  .lr:hover .lr-in {
    background: var(--mc-surface-2);
  }
  .lr.sel .lr-in {
    background: var(--mc-accent-tint);
    color: var(--mc-accent-ink);
  }
  .lr.lvl-2 .lr-in {
    padding-left: 18px;
  }
  .lr-main {
    all: unset;
    box-sizing: border-box;
    flex: 1 1 0;
    min-width: 0;
    min-height: 32px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 2px 6px;
    border-radius: var(--mc-radius, 8px);
    color: inherit;
    font-size: 0.875rem;
    cursor: pointer;
  }
  .lr-main:focus-visible {
    outline: 2px solid var(--mc-accent);
    outline-offset: -2px;
  }
  .kind {
    flex: none;
    color: var(--mc-text-2);
  }
  .lr.sel .kind {
    color: inherit;
  }
  .lr.is-hidden .kind,
  .lr.is-hidden .thumb {
    opacity: 0.5;
  }
  .nm {
    display: grid;
    min-width: 0;
    flex: 1;
  }
  .nm-t,
  .nm small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .nm small {
    font-size: 0.75rem;
    color: var(--mc-text-2);
  }
  .lr.sel .nm small {
    color: inherit;
  }
  .lr.compact.sel .nm-t,
  .lr.compact:focus-within .nm-t {
    white-space: normal;
    overflow-wrap: anywhere;
  }
  .lbadge {
    flex: none;
    padding: 0 6px;
    min-height: 20px;
    display: grid;
    place-items: center;
    border-radius: 9999px;
    border: 1px solid var(--mc-divider);
    background: var(--mc-surface);
    color: var(--mc-text-2);
    font-size: 0.6875rem;
    font-weight: 500;
    white-space: nowrap;
  }
  .lbadge.warn {
    color: var(--mc-warn-ink);
    background: var(--mc-warn-tint);
  }
  .lcaret-space {
    width: 0;
  }
  .lrename {
    flex: 1;
    min-width: 0;
  }
  .lt {
    all: unset;
    box-sizing: border-box;
    flex: none;
    display: grid;
    place-items: center;
    min-width: 28px;
    height: 28px;
    border-radius: var(--mc-radius-sm, 6px);
    color: var(--mc-text-2);
    cursor: pointer;
  }
  .lt:hover {
    background: var(--mc-surface);
  }
  .lt:focus-visible {
    outline: 2px solid var(--mc-accent);
    outline-offset: 0;
  }
  .lt[aria-pressed='true'] {
    background: var(--mc-accent-tint);
    color: var(--mc-accent-ink);
  }
  .lr.sel .lt {
    color: inherit;
  }
  .lt.soft {
    opacity: 0.6;
  }
  .lt[aria-disabled='true'] {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .lfull {
    display: contents;
  }
  .lst {
    display: none;
    flex: none;
    gap: 2px;
    color: var(--mc-text-2);
    --mdc-icon-size: 16px;
  }
  .lm {
    display: none;
  }
  .lr.compact .lm {
    display: grid;
  }
  .lr.compact .lst:not(:empty) {
    display: flex;
  }
  .lr-sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
  @container (max-width: 319px) {
    .lfull {
      display: none;
    }
    .lm {
      display: grid;
    }
    .lst:not(:empty) {
      display: flex;
    }
  }
  @media (pointer: coarse) {
    .lt,
    .lr-main {
      min-width: 44px;
      min-height: 44px;
      height: 44px;
    }
    .litem {
      min-height: 44px;
    }
    .litem kbd {
      display: none;
    }
  }
  .lmenu {
    position: fixed;
    inset: auto;
    margin: 0;
    min-width: 200px;
    padding: 4px;
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius, 8px);
    background: var(--mc-surface);
    color: var(--mc-text);
    box-shadow: var(--mc-shadow-float);
    display: grid;
  }
  .litem {
    all: unset;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 32px;
    padding: 0 10px;
    border-radius: var(--mc-radius-sm, 6px);
    font-size: 0.8125rem;
    cursor: pointer;
  }
  .litem:hover,
  .litem:focus-visible {
    background: var(--mc-surface-2);
  }
  .litem:focus-visible {
    outline: 2px solid var(--mc-accent);
    outline-offset: -2px;
  }
  .litem[role='menuitemcheckbox']::before {
    content: '';
    width: 14px;
    height: 14px;
    margin-right: -6px;
    border: 1.5px solid var(--mc-field-border);
    border-radius: 3px;
    box-sizing: border-box;
  }
  .litem[aria-checked='true']::before {
    background: var(--mc-accent);
    border-color: var(--mc-accent);
  }
  .litem[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .litem span {
    flex: 1;
  }
  .litem kbd {
    font: inherit;
    font-size: 0.6875rem;
    color: var(--mc-text-2);
  }
  .lsep {
    height: 1px;
    margin: 4px 0;
    background: var(--mc-divider);
  }
  @media (prefers-reduced-motion: reduce) {
    .lr * {
      transition: none !important;
    }
  }
`;
