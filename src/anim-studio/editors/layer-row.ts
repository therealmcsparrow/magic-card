import { css, html, nothing, type ReactiveController, type ReactiveControllerHost, type TemplateResult } from 'lit';
import type { UiMenuEntry, UiMenuPick, UiMenuElement } from '../../contracts/ui-kit';
import { kitButtonExtras, kitTokens } from '../../ui-kit/css/extras';
import '../kit';
import { EMPTY_LAYER_VIEW, LAYER_TOGGLES, type LayerKey, type LayerToggle, type LayerView, type LayerViewChangeDetail, type LayersDensity } from '../../contracts/studio-layers';
import type { AnimationDoc } from '../model';
import { hideReason, isLocked, markedBelow, parentKey, toggleLayer } from '../layer-view';
import { t, m, type MessageId } from '../i18n';

// The shared layer row and its keyboard model: every layers panel renders rows with `LayerRows.row()` and gets a roving
// tab stop, arrow / Home / End navigation, disclosure keys, Alt+Up / Down to move, H S L toggles, F2 rename, the compact
// actions menu and `layer-view-change` events.

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
  level?: 1 | 2 | 3;
  /** No kind icon (a lane row). */
  bare?: boolean;
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

const TOGGLE_TEXT: Record<LayerToggle, { name: MessageId; tip: [MessageId, MessageId]; key: string; icon: [string, string] }> = {
  hide: { name: m('anim-studio.layer-row.hide-in-preview'), tip: [m('anim-studio.layer-row.hide-in-preview-not-saved'), m('anim-studio.layer-row.show-in-preview')], key: 'H', icon: ['mdi:eye-outline', 'mdi:eye-off-outline'] },
  solo: { name: m('anim-studio.layer-row.solo-in-preview'), tip: [m('anim-studio.layer-row.solo-in-preview-hides-the-others-not'), m('anim-studio.layer-row.end-solo')], key: 'S', icon: ['mdi:radiobox-blank', 'mdi:radiobox-marked'] },
  lock: { name: m('anim-studio.layer-row.lock'), tip: [m('anim-studio.layer-row.lock'), m('anim-studio.layer-row.unlock')], key: 'L', icon: ['mdi:lock-open-variant-outline', 'mdi:lock-outline'] },
};
const TOGGLES: LayerToggle[] = ['hide', 'solo', 'lock'];
/** What the live region says after a toggle, with the row's name. */
const SAYS: Record<LayerToggle, [MessageId, MessageId]> = {
  hide: [m('anim-studio.layer-row.name-hidden-in-the-preview'), m('anim-studio.layer-row.name-shown-in-the-preview')],
  solo: [m('anim-studio.layer-row.name-soloed-in-the-preview'), m('anim-studio.layer-row.name-no-longer-soloed')],
  lock: [m('anim-studio.layer-row.name-locked'), m('anim-studio.layer-row.name-unlocked')],
};

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
  private _menu?: { key: LayerKey; first?: boolean };
  /** The menu button's own press closes the menu (an outside press); the click that follows must not open it again. */
  private _outsideAt?: { key: LayerKey; at: number };
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
    const menu = this.host.renderRoot?.querySelector<UiMenuElement>('mc-ui-menu');
    if (menu && this._menu?.first) {
      this._menu.first = false;
      menu.anchor = this.host.renderRoot?.querySelector<HTMLElement>(`li[data-ref="${this._menu.key}"] [data-ctl="menu"]`) ?? undefined;
      menu.show();
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
    this.announce(t('anim-studio.layer-row.name-is-locked-unlock-it-in-layers', { name }));
    return true;
  }

  /** Open or close a row's disclosure that lives in the view (`LayerView.open`); nothing is announced. */
  setOpen(key: LayerKey, open: boolean): void {
    const v = this.view;
    if (v.open.includes(key) !== open) this.announce('', { ...v, open: open ? [...v.open, key] : v.open.filter((k) => k !== key) });
  }

  toggle(key: LayerKey, name: string, kind: LayerToggle): void {
    const next = toggleLayer(this.view, key, kind);
    const on = next[kind === 'hide' ? 'hidden' : kind === 'solo' ? 'solo' : 'locked'].includes(key);
    this.announce(t(SAYS[kind][on ? 0 : 1], { name }), next);
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

  private _openMenu(key: LayerKey, first = true): void {
    this._menu = { key, first };
    this.host.requestUpdate();
  }

  private _toggleMenu(key: LayerKey): void {
    if (this._menu?.key === key) return this._closeMenu();
    const o = this._outsideAt;
    this._outsideAt = undefined;
    if (o && o.key === key && Date.now() - o.at < 400) return;
    this._openMenu(key);
  }

  private _closeMenu(back = true): void {
    const key = this._menu?.key;
    this._menu = undefined;
    this.host.requestUpdate();
    if (key && back) this.focusKey(key, 'menu');
  }

  private _menuItems(r: RowInit): Array<UiMenuEntry & { run: () => void }> {
    const lock = this.locked(r.key);
    const out: Array<UiMenuEntry & { run: () => void }> = [];
    if (this.actions.move) {
      for (const dir of ['up', 'down'] as const) {
        const m = dir === 'up' ? r.up : r.down;
        if (!m) continue;
        const base = m.menu ?? m.label;
        const reason = lock ? t('anim-studio.layer-row.locked') : !m.ok ? (dir === 'up' ? t('anim-studio.layer-row.already-at-the-top') : t('anim-studio.layer-row.already-at-the-bottom')) : undefined;
        out.push({ id: `move-${dir}`, icon: dir === 'up' ? 'mdi:arrow-up' : 'mdi:arrow-down', label: lock ? base.replace(/ \(.*\)$/, '') : base, reason, keys: dir === 'up' ? t('anim-studio.layer-row.alt-up') : t('anim-studio.layer-row.alt-down'), run: () => this._move(r, dir, 'menu') });
      }
    }
    if (r.renamable && this.actions.rename) out.push({ id: 'rename', icon: 'mdi:rename-outline', label: t('anim-studio.layer-row.rename'), reason: lock ? t('anim-studio.layer-row.locked') : undefined, keys: 'F2', run: () => this._rename(r) });
    const view = this.view;
    TOGGLES.filter((k) => this._toggles(r).includes(k)).forEach((k, i) => {
      const on = view[k === 'hide' ? 'hidden' : k === 'solo' ? 'solo' : 'locked'].includes(r.key);
      out.push({ id: k, icon: on ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline', label: t(TOGGLE_TEXT[k].name), checked: on, keys: TOGGLE_TEXT[k].key, separatorBefore: i === 0 && out.length > 0, run: () => this.toggle(r.key, r.name, k) });
    });
    return out;
  }

  private _renderMenu(r: RowInit): TemplateResult {
    const entries = this._menuItems(r);
    return html`<mc-ui-menu
      .items=${entries}
      .align=${'end' as const}
      label=${t('anim-studio.layer-row.layer-actions-name', { name: r.name })}
      @mc-menu-pick=${(e: CustomEvent<UiMenuPick>) => {
        e.stopPropagation();
        const hit = entries.find((x) => x.id === e.detail.id);
        this._closeMenu();
        hit?.run();
      }}
      @mc-menu-close=${(e: Event) => {
        e.stopPropagation();
        const reason = (e as CustomEvent<{ reason: string }>).detail.reason;
        if (reason === 'pick') return;
        if (reason === 'outside' && this._menu) this._outsideAt = { key: this._menu.key, at: Date.now() };
        this._closeMenu(false);
      }}
    ></mc-ui-menu>`;
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
      why?.kind === 'self' && t('anim-studio.layer-row.hidden-in-the-preview'),
      why?.kind === 'solo' && t('anim-studio.layer-row.hidden-because-another-layer-is-soloed'),
      why?.kind === 'parent' && t('anim-studio.layer-row.hidden-because-name-is-hidden', { name: name(why.by) }),
      soloed && 'solo',
      lockedSelf && 'locked',
      lockedVia && t('anim-studio.layer-row.locked-because-the-layer-it-belongs-to'),
      below > 0 && t('anim-studio.layer-row.below-hidden-below', { below }),
    ].filter(Boolean);
    const id = `ld${this._n++}`;
    const locked = lockedSelf || lockedVia;
    const btn = (k: LayerToggle): TemplateResult => {
      const on = (k === 'hide' ? why?.kind === 'self' : k === 'solo' ? soloed : lockedSelf) as boolean;
      const soft = !on && (k === 'hide' ? !!why : k === 'lock' ? lockedVia : false);
      const tt = TOGGLE_TEXT[k];
      return html`<button type="button" class="icon-btn xs lt ${soft ? 'soft' : ''}" data-ctl=${k} data-toggle=${k} tabindex="-1" aria-pressed=${on ? 'true' : 'false'} aria-label=${t(tt.name)} title=${k === 'hide' && !on && r.key.startsWith('lane:') ? t('anim-studio.layer-row.hide-in-preview-the-layer-rests-at-its') : t(tt.tip[on ? 1 : 0])} @click=${() => this.toggle(r.key, r.name, k)}>
        <ha-icon icon=${tt.icon[on || soft ? 1 : 0]}></ha-icon>
      </button>`;
    };
    const mv = (dir: 'up' | 'down'): TemplateResult | typeof nothing => {
      const m = dir === 'up' ? r.up : r.down;
      if (!m) return nothing;
      return html`<button type="button" class="icon-btn xs lt mv ${dir}" data-ctl=${dir} tabindex="-1" aria-label=${m.label} title=${m.label} aria-disabled=${m.ok && !locked ? nothing : 'true'} @click=${() => this._move(r, dir, dir)}>
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
          : html`<button type="button" class="icon-btn xs lt lcaret" tabindex="-1" aria-label=${r.expanded ? t('anim-studio.layer-row.collapse-name', { name: r.name }) : t('anim-studio.layer-row.expand-name', { name: r.name })} @click=${() => this.actions.open?.(r.key, !r.expanded)}>
              <ha-icon icon=${r.expanded ? 'mdi:chevron-down' : 'mdi:chevron-right'}></ha-icon>
            </button>`}
        <button type="button" class="lr-main" data-lk=${r.key} tabindex="-1" aria-pressed=${r.selected ? 'true' : 'false'} aria-expanded=${r.expanded === undefined ? nothing : r.expanded ? 'true' : 'false'} aria-describedby=${said.length ? id : nothing} aria-keyshortcuts="H S L Alt+ArrowUp Alt+ArrowDown" title=${(r.title ?? r.name) + (r.badge && !r.title ? ` (${r.badge})` : '')} @focus=${(e: Event) => ((active = (e.currentTarget as HTMLElement).dataset.lk!), syncTabStops(h))} @click=${(e: MouseEvent) => this.actions.select(r.key, e)}>
          ${r.thumb ?? (r.bare ? nothing : html`<ha-icon class="kind" icon=${r.icon ?? 'mdi:layers-outline'}></ha-icon>`)}
          ${r.renaming ? nothing : html`<span class="nm"><span class="nm-t">${r.name}</span>${r.note ? html`<small>${r.note}</small>` : nothing}</span>`}
          ${r.badge ? html`<span class="lbadge">${r.badge}</span>` : nothing}
          ${below > 0 ? html`<span class="lbadge warn" aria-hidden="true">${t('anim-studio.layer-row.below-hidden', { below })}</span>` : nothing}
        </button>
        ${r.renaming ? html`<div class="lrename">${r.renaming}</div>` : nothing}
        <span class="lst" aria-hidden="true">
          ${why ? html`<ha-icon icon="mdi:eye-off-outline"></ha-icon>` : nothing}${soloed ? html`<ha-icon icon="mdi:radiobox-marked"></ha-icon>` : nothing}${locked ? html`<ha-icon icon="mdi:lock-outline"></ha-icon>` : nothing}
        </span>
        ${full}
        ${hasMenu
          ? html`<button type="button" class="icon-btn xs lt lm" data-ctl="menu" tabindex="-1" aria-haspopup="menu" aria-expanded=${this._menu?.key === r.key ? 'true' : 'false'} aria-label=${t('anim-studio.layer-row.layer-actions-name', { name: r.name })} title=${t('anim-studio.layer-row.layer-actions')} @click=${() => this._toggleMenu(r.key)} @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                this._openMenu(r.key);
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

/*
 * The row on the kit: every in-row control is the kit's borderless 24 px `.icon-btn.xs`, the
 * row never wraps, and the name is what gives way (an ellipsis; the full name is the button's title). The container
 * breakpoints: under 200 px the toggles live in the Layer actions menu, 200 to 319 px they stay inline
 * (move up and down go to the menu), from 320 px everything is inline.
 */
export const layerRowStyles = css`
  ${kitTokens}
  ${kitButtonExtras}
  .lr {
    list-style: none;
    container-type: inline-size;
    border-radius: var(--mc-radius, 8px);
  }
  .lr-in {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
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
  .lr.lvl-3 .lr-in {
    padding-left: 36px;
  }
  .lr-main {
    all: unset;
    box-sizing: border-box;
    flex: 1 1 0;
    min-width: 0;
    min-height: 32px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 4px;
    border-radius: var(--mc-radius, 8px);
    color: inherit;
    font-size: 0.875rem;
    cursor: pointer;
  }
  .lr-main:focus-visible {
    outline: 2px solid var(--mc-focus, var(--mc-accent));
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
  .lbadge {
    flex: none;
    padding: 0 6px;
    min-height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
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
  .lt:focus-visible {
    outline: 2px solid var(--mc-focus, var(--mc-accent));
    outline-offset: 0;
  }
  .lr .lt:hover:not(:disabled) {
    background: var(--mc-surface);
  }
  .lr.sel .lt {
    color: inherit;
  }
  .lt.soft {
    opacity: 0.6;
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
    display: inline-grid;
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
  /* under 320 px the name needs the room: the count is read out (and in the tooltip) but not drawn */
  @container (max-width: 319px) {
    .lbadge:not(.warn) {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      border: 0;
      white-space: nowrap;
    }
  }
  @container (max-width: 199px) {
    .lfull {
      display: none;
    }
    .lm {
      display: inline-grid;
    }
    .lst:not(:empty) {
      display: flex;
    }
  }
  @container (min-width: 200px) and (max-width: 319px) {
    .lm {
      display: inline-grid;
    }
    .lfull .mv {
      display: none;
    }
  }
  @media (pointer: coarse) {
    @container (max-width: 319px) {
      .lfull {
        display: none;
      }
      .lst:not(:empty) {
        display: flex;
      }
    }
    .lr-main {
      min-height: var(--mc-hit, 44px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .lr * {
      transition: none !important;
    }
  }
`;
