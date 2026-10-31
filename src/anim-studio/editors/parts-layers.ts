import { LitElement, html, css, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorTokens } from '../../css/editor-system';
import { editorPrimitives } from '../../ui-kit/css/primitives';
import type { AnimationDoc, TargetRef } from '../model';
import { V2_CAPS } from '../model-v2';
import { editorDefined } from '../editor-slots';
import { registerPanel, type StageInfo, type StudioSelection } from '../slots';
import { EMPTY_LAYER_VIEW, type LayerView, type LayersDensity } from '../../contracts/studio-layers';
import { LayerRows, layerRowStyles } from './layer-row';
import { lanesOf } from '../layer-view';
import { laneName, selectLane, trackRows, tracksOpen } from './lane-rows';
import type { PreviewTile } from '../tiles';
import {
  emitDoc,
  emitSelection,
  groupBlocker,
  groupOfPart,
  groupParts,
  groupRef,
  hasRig,
  loadGeometry,
  mergeParts,
  movePart,
  partIdsOf,
  partRef,
  piecesOf,
  renameTarget,
  selectedRefs,
  sourceIcon,
  splitInto,
  splitPart,
  targetName,
  targetSelection,
  trackOf,
  ungroup,
} from './parts-model';
import { t, m } from '../i18n';

// Icon parts in the Layers column: split the icon, list parts and groups as a tree, select, rename, group, ungroup, merge,
// split, reorder, and hide / solo / lock in the preview (session only). Selection is the studio's (selection-change with
// target `part:<id>` / `group:<id>`). Every action is a button too.

interface Row {
  ref: TargetRef;
  level: 1 | 2;
  kind: 'part' | 'group' | 'shape';
  name: string;
  /** Group rows: member count; part rows: piece count. */
  count: number;
  keys: number;
}

const ICONS = { part: 'mdi:vector-square', group: 'mdi:folder-outline', shape: 'mdi:draw' } as const;

@customElement('mc-anim-parts-layers')
export class AnimPartsLayers extends LitElement {
  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) library?: unknown;
  @property({ type: Number }) time = 0;
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: false }) selection: StudioSelection = { kind: 'none' };
  @property({ attribute: false }) tile: PreviewTile = 'icon';
  @property({ attribute: false }) stage?: StageInfo;
  @property({ attribute: false }) layerView?: LayerView;
  @property() density: LayersDensity = 'full';

  @state() private _renaming?: TargetRef;
  @state() private _icon = '';
  @state() private _busy = false;
  @state() private _error = '';
  /** "Split again" asked once: the next click replaces the parts. */
  @state() private _confirm = false;
  @state() private _resplit = false;
  @state() private _collapsed = new Set<string>();
  @state() private _status = '';
  /** A visible note after a split (the 64-part cap cut it short). */
  @state() private _notice = '';
  /** Shift-click range anchor. */
  private _anchor?: TargetRef;
  /** The user typed the icon to split (else it follows the document and the preview tile). */
  private _iconTyped = false;

  private readonly _list = new LayerRows(this, {
    select: (key, e) => {
      if (key.startsWith('tracks:')) return this._list.setOpen(key.slice(7), !this.layerView?.open.includes(key.slice(7)));
      if (key.startsWith('lane:')) return this.disabled ? undefined : selectLane(this, this.doc!, key);
      const rows = this._rows();
      const row = rows.find((r) => r.ref === key);
      if (row && e instanceof MouseEvent) this._onRowClick(e, row, rows);
      else if (row) {
        this._anchor = row.ref;
        this._select([row.ref]);
      }
    },
    move: (key, dir) => this._move(dir === 'up' ? 1 : -1, key as TargetRef),
    rename: (key) => (this._renaming = key as TargetRef),
    dblclick: (key) => !this.disabled && !this._list.refuseLocked(key, targetName(this.doc!, key as TargetRef)) && (this._renaming = key as TargetRef),
    open: (key, open) => (key.startsWith('group:') ? this._setOpen(key.slice(6), open) : this._list.setOpen(key.startsWith('tracks:') ? key.slice(7) : key, open)),
    nameOf: (key) => (key.startsWith('lane:') ? laneName(key) : this.doc ? targetName(this.doc, key as TargetRef) : key),
  });

  connectedCallback(): void {
    super.connectedCallback();
    // the card bundle defines the icon picker: until it does, "Icon to split" is a plain field
    if (!editorDefined('mc-icon-picker') && typeof customElements !== 'undefined') void customElements.whenDefined('mc-icon-picker').then(() => this.requestUpdate());
  }
  protected willUpdate(changed: PropertyValues<this>): void {
    // another document: nothing of the last one's split carries over
    const prev = changed.get('doc') as AnimationDoc | undefined;
    if (changed.has('doc') && prev && prev.id !== this.doc?.id) {
      this._icon = '';
      this._iconTyped = false;
      this._confirm = false;
      this._resplit = false;
      this._error = '';
      this._notice = '';
    }
    // "Icon to split" starts as the icon the preview shows (the tile's), until the user types one
    if ((changed.has('doc') || changed.has('tile')) && !this._iconTyped && this.doc) {
      const icon = sourceIcon(this.doc, this.tile);
      this._icon = icon.startsWith('svg:') ? '' : icon;
    }
  }

  // ── model ──

  private get _sel(): TargetRef[] {
    return selectedRefs(this.selection);
  }

  private _rows(): Row[] {
    const d = this.doc;
    const rig = d?.rig;
    if (!d || !rig) return [];
    const keys = (ref: string) => trackOf(d, ref)?.keyframes.length ?? 0;
    const rows: Row[] = [];
    const placed = new Set<string>();
    // the list reads like the Shapes list: the part painted last (on top) first, the bottom part last
    const top = [...rig.parts].reverse();
    for (const p of top) {
      const g = groupOfPart(rig, p.id);
      if (!g) {
        rows.push({ ref: partRef(p.id), level: 1, kind: 'part', name: p.name, count: p.from?.length ?? 1, keys: keys(partRef(p.id)) });
        continue;
      }
      if (placed.has(g.id)) continue;
      placed.add(g.id);
      rows.push({ ref: groupRef(g.id), level: 1, kind: 'group', name: g.name, count: g.parts.length, keys: keys(groupRef(g.id)) });
      if (this._collapsed.has(g.id)) continue;
      for (const m of top.filter((x) => groupOfPart(rig, x.id)?.id === g.id)) {
        rows.push({ ref: partRef(m.id), level: 2, kind: 'part', name: m.name, count: m.from?.length ?? 1, keys: keys(partRef(m.id)) });
      }
    }
    // drawn shapes are listed by the Shapes panel (draw-layers.ts), not here: one row per shape in the studio
    return rows;
  }

  private _change(doc: AnimationDoc, label: string, status = label): void {
    this._status = status;
    emitDoc(this, doc, label);
  }

  private _select(refs: TargetRef[], primary?: TargetRef): void {
    emitSelection(this, targetSelection(refs, primary));
  }

  // ── actions ──

  private async _split(): Promise<void> {
    const d = this.doc;
    if (!d || this._busy || this.disabled) return;
    if (hasRig(d) && !this._confirm) {
      this._confirm = true;
      return;
    }
    const own = !this._resplit && d.rig?.svg ? d.rig.svg : undefined;
    const ref = own ? sourceIcon(d, this.tile) : this._icon.trim() || sourceIcon(d, this.tile);
    if (!own && !/^[a-z0-9_-]+:[a-z0-9_-]+$/i.test(ref)) {
      this._error = t('anim-studio.parts-layers.use-an-icon-id-like-mdi-bell-ring');
      return;
    }
    this._busy = true;
    this._error = '';
    try {
      const g = await loadGeometry(ref);
      // another document opened while the icon loaded: the split is not for it
      if (this.doc?.id !== d.id) return;
      if (!g) {
        this._error = t('anim-studio.parts-layers.this-icon-could-not-be-loaded-check-the');
        return;
      }
      const pieces = piecesOf(g);
      if (!pieces.length) {
        this._error = t('anim-studio.parts-layers.this-icon-has-no-shapes-to-split');
        return;
      }
      const next = splitInto(this.doc ?? d, pieces, own ? { svg: own } : { icon: ref });
      const n = next.rig?.parts.length ?? 0;
      const capped = pieces.length > V2_CAPS.parts;
      this._notice = capped ? t('anim-studio.parts-layers.the-icon-has-count-shapes-the-first', { count: pieces.length, parts: V2_CAPS.parts }) : '';
      this._change(next, 'Split icon', capped ? t('anim-studio.parts-layers.split-into-count-the-first-parts', { count: n, parts: V2_CAPS.parts }) : t('anim-studio.parts-layers.split-into-count', { count: n }));
      this._confirm = false;
      this._resplit = false;
      this._select([]);
    } finally {
      this._busy = false;
    }
  }

  private _group(): void {
    const d = this.doc;
    if (!d || this.disabled) return;
    if (this._lockedSel()) return;
    const why = groupBlocker(d, this._sel);
    if (why) {
      this._status = why;
      return;
    }
    const r = groupParts(d, this._sel);
    if (!r.id) return;
    this._change(r.doc, 'Group parts', t('anim-studio.parts-layers.grouped-count-parts', { count: partIdsOf(d, this._sel).length }));
    this._select([groupRef(r.id)]);
  }

  private _ungroup(): void {
    const d = this.doc;
    const groups = this._sel.filter((r) => r.startsWith('group:'));
    if (!d || !groups.length || this.disabled || this._lockedSel()) return;
    let next = d;
    const members: TargetRef[] = [];
    for (const g of groups) {
      members.push(...(d.rig?.groups?.find((x) => `group:${x.id}` === g)?.parts ?? []).map(partRef));
      next = ungroup(next, g.slice(6));
    }
    this._change(next, 'Ungroup', t('anim-studio.parts-layers.groups-removed', { count: groups.length }));
    this._select(members);
  }

  private _merge(): void {
    const d = this.doc;
    if (!d || this.disabled || this._lockedSel()) return;
    const r = mergeParts(d, this._sel);
    if (!r.id) return;
    this._change(r.doc, 'Merge parts', t('anim-studio.parts-layers.parts-merged'));
    this._select([partRef(r.id)]);
  }

  private _splitBack(): void {
    const d = this.doc;
    const part = this._sel.find((r) => r.startsWith('part:'));
    if (!d || !part || this.disabled || this._lockedSel()) return;
    const r = splitPart(d, part.slice(5));
    if (r.ids.length < 2) return;
    this._change(r.doc, 'Split part', t('anim-studio.parts-layers.split-into-count-parts', { count: r.ids.length }));
    this._select(r.ids.map(partRef));
  }

  /** Say so and return true when a selected part, group or piece is locked. */
  private _lockedSel(): boolean {
    const d = this.doc;
    const hit = d && this._sel.find((r) => this._list.locked(r));
    return !!hit && this._list.refuseLocked(hit, targetName(d!, hit));
  }

  private _move(by: -1 | 1, ref?: TargetRef): void {
    const d = this.doc;
    const part = ref ?? this._sel.find((r) => r.startsWith('part:'));
    if (!d || !part || !part.startsWith('part:') || this.disabled) return;
    if (this._list.refuseLocked(part, targetName(d, part))) return;
    const next = movePart(d, part.slice(5), by);
    if (next !== d) {
      this._change(next, 'Move part', by > 0 ? t('anim-studio.parts-layers.moved-up-drawn-on-top') : t('anim-studio.parts-layers.moved-down-drawn-underneath'));
      this._list.announce(t('anim-studio.parts-layers.name-moved-direction', { name: targetName(d, part), direction: by > 0 ? t('anim-studio.parts-layers.up') : t('anim-studio.parts-layers.down') }));
    }
  }

  private _setOpen(gid: string, open: boolean): void {
    const next = new Set(this._collapsed);
    if (open) next.delete(gid);
    else next.add(gid);
    this._collapsed = next;
  }

  private _rename(ref: TargetRef, name: string): void {
    // Enter (or Escape) then the blur of the removed input: only the first counts
    if (this._renaming !== ref) return;
    this._renaming = undefined;
    const d = this.doc;
    if (!d || !name.trim() || name.trim() === targetName(d, ref) || this._list.refuseLocked(ref, targetName(d, ref))) return;
    this._change(renameTarget(d, ref, name), 'Rename part', t('anim-studio.parts-layers.renamed'));
  }

  // ── events ──

  private _onRowClick(e: MouseEvent, row: Row, rows: Row[]): void {
    if (this._renaming === row.ref) return;
    const sel = this._sel;
    if (e.shiftKey && this._anchor) {
      const a = rows.findIndex((r) => r.ref === this._anchor);
      const b = rows.findIndex((r) => r.ref === row.ref);
      if (a >= 0 && b >= 0) {
        const [lo, hi] = a < b ? [a, b] : [b, a];
        this._select(rows.slice(lo, hi + 1).map((r) => r.ref), row.ref);
        return;
      }
    }
    this._anchor = row.ref;
    if (e.ctrlKey || e.metaKey) {
      this._select(sel.includes(row.ref) ? sel.filter((r) => r !== row.ref) : [...sel, row.ref], row.ref);
      return;
    }
    this._select([row.ref]);
  }

  private _onKey(e: KeyboardEvent): void {
    if (this._renaming || this.disabled) return;
    const mod = e.ctrlKey || e.metaKey;
    const k = e.key.toLowerCase();
    if (mod && k === 'g') {
      e.preventDefault();
      if (e.shiftKey) this._ungroup();
      else this._group();
      return;
    }
    const rows = this._rows();
    const cur = rows.findIndex((r) => r.ref === ((e.target as HTMLElement).closest?.('li.lr')?.getAttribute('data-ref') ?? this.selection.target ?? this._anchor));
    // Shift+Up / Down: extend the selection (plain arrows, Home / End, Alt, F2, H S L: the shared row)
    if (e.shiftKey && !e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp') && (e.target as HTMLElement).matches?.('[data-lk]')) {
      // a track row is not a part: it does not extend the part selection
      if (/^(lane|tracks):/.test((e.target as HTMLElement).dataset.lk ?? '')) return;
      e.preventDefault();
      const next = rows[Math.max(0, Math.min(rows.length - 1, cur + (e.key === 'ArrowDown' ? 1 : -1)))];
      if (!next) return;
      if (cur >= 0) this._select([...this._sel, next.ref], next.ref);
      else this._select([next.ref]);
      this._focusRow(next.ref);
      return;
    }
    if (e.key === 'Escape' && this._sel.length && (e.target as HTMLElement).matches?.('[data-lk]')) {
      e.preventDefault();
      this._select([]);
    }
  }

  private _focusRow(ref: string): void {
    this._list.focusKey(ref);
  }

  // ── render ──

  private _iconBtn(icon: string, label: string, run: () => void, enabled: boolean, shortcut?: string): TemplateResult {
    return html`<button
      type="button"
      class="icon-btn sm"
      title=${shortcut ? `${label} (${shortcut})` : label}
      aria-label=${label}
      aria-keyshortcuts=${shortcut ?? nothing}
      ?disabled=${this.disabled || !enabled}
      @click=${run}
    >
      <ha-icon icon=${icon}></ha-icon>
    </button>`;
  }

  private _renderSource(rigged: boolean): TemplateResult {
    const d = this.doc!;
    const own = !!d.rig?.svg && !this._resplit;
    return html`<div class="source">
      ${own
        ? html`<p class="help">${t("anim-studio.parts-layers.the-parts-come-from-the-document-s-own")}</p>`
        : editorDefined('mc-icon-picker')
          ? html`<div class="field">
              <div class="field-head"><span class="lbl" id="pl-icon-l">${t('anim-studio.parts-layers.icon-to-split')}</span></div>
              <mc-icon-picker
                .hass=${this.hass}
                .value=${this._icon}
                label=${t('anim-studio.parts-layers.icon-to-split')}
                aria-labelledby="pl-icon-l"
                @value-changed=${(e: CustomEvent) => {
                  e.stopPropagation();
                  this._icon = String(e.detail?.value ?? '').trim();
                  this._iconTyped = this._icon !== '';
                  this._error = '';
                  this._confirm = false;
                }}
              ></mc-icon-picker>
            </div>`
          : html`<div class="field">
            <div class="field-head"><label for="pl-icon">${t('anim-studio.parts-layers.icon-to-split')}</label></div>
            <input
              id="pl-icon"
              class="input mono"
              .value=${this._icon}
              placeholder=${sourceIcon(d, this.tile)}
              spellcheck="false"
              ?disabled=${this.disabled || this._busy}
              @input=${(e: Event) => {
                this._icon = (e.target as HTMLInputElement).value;
                this._iconTyped = this._icon.trim() !== '';
                this._error = '';
              }}
              @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && void this._split()}
            />
          </div>`}
      ${this._error ? html`<p class="help error" role="alert">${this._error}</p>` : nothing}
      <div class="actions">
        <button type="button" class="btn ${rigged ? 'btn-secondary' : 'btn-primary'} btn-sm" ?disabled=${this.disabled || this._busy} @click=${() => void this._split()}>
          <ha-icon icon="mdi:scissors-cutting"></ha-icon>${this._busy ? t('anim-studio.parts-layers.splitting') : this._confirm ? t('anim-studio.parts-layers.replace-count-parts', { count: d.rig?.parts.length ?? 0 }) : rigged ? t('anim-studio.parts-layers.split-again') : t('anim-studio.parts-layers.split-icon')}
        </button>
        ${rigged
          ? html`<button
              type="button"
              class="btn btn-text btn-sm"
              @click=${() => {
                this._resplit = false;
                this._confirm = false;
                this._error = '';
              }}
            >
              ${t('anim-studio.parts-layers.cancel')}
            </button>`
          : nothing}
      </div>
      ${this._confirm ? html`<p class="help">${t('anim-studio.parts-layers.splitting-again-replaces-the-parts-their')}</p>` : nothing}
    </div>`;
  }

  private _renderRow(row: Row, rows: Row[], sel: TargetRef[]): TemplateResult[] {
    const d = this.doc!;
    const gid = row.kind === 'group' ? row.ref.slice(6) : '';
    const parts = d.rig?.parts ?? [];
    const order = row.kind === 'part' ? parts.findIndex((p) => `part:${p.id}` === row.ref) : -1;
    const lockedRow = this._list.locked(row.ref);
    const lanes = lanesOf(d, row.ref).length > 0;
    // a part's tracks open with the view; a group has two disclosures: its members (open by default) and its
    // tracks, a "Tracks" row under it (closed by default, the view's `open` list)
    const open = row.kind === 'group' ? undefined : tracksOpen(d, this.layerView ?? EMPTY_LAYER_VIEW, row.ref, row.ref);
    const item = this._list.row({
      key: row.ref,
      name: row.name,
      icon: ICONS[row.kind],
      note: row.kind === 'part' && row.count > 1 ? t('anim-studio.parts-layers.count-shapes', { count: row.count }) : undefined,
      badge: row.keys ? t('anim-studio.parts-layers.count', { count: row.keys }) : undefined,
      level: row.level,
      expanded: row.kind === 'group' ? !this._collapsed.has(gid) : open,
      selected: sel.includes(row.ref) && !(open && row.kind === 'part' && this.selection.kind === 'keys'),
      renamable: true,
      up: row.kind === 'part' ? { ok: !this.disabled && order >= 0 && order < parts.length - 1 && !lockedRow, label: t('anim-studio.parts-layers.move-name-up-drawn-on-top', { name: row.name }), menu: t('anim-studio.parts-layers.move-up-drawn-on-top') } : undefined,
      down: row.kind === 'part' ? { ok: !this.disabled && order > 0 && !lockedRow, label: t('anim-studio.parts-layers.move-name-down-drawn-underneath', { name: row.name }), menu: t('anim-studio.parts-layers.move-down') } : undefined,
      renaming:
        this._renaming === row.ref
          ? html`<input
              class="input rename"
              aria-label=${t('anim-studio.parts-layers.name')}
              .value=${row.name}
              maxlength="80"
              @click=${(e: Event) => e.stopPropagation()}
              @keydown=${(e: KeyboardEvent) => {
                e.stopPropagation();
                if (e.key === 'Enter') {
                  this._rename(row.ref, (e.target as HTMLInputElement).value);
                  this._focusRow(row.ref);
                }
                if (e.key === 'Escape') {
                  this._renaming = undefined;
                  this._focusRow(row.ref);
                }
              }}
              @blur=${(e: Event) => this._rename(row.ref, (e.target as HTMLInputElement).value)}
            />`
          : undefined,
    });
    if (row.kind === 'group') {
      if (!lanes || this._collapsed.has(gid)) return [item];
      const tOpen = !!tracksOpen(d, this.layerView ?? EMPTY_LAYER_VIEW, row.ref, row.ref);
      const head = this._list.row({ key: `tracks:${row.ref}`, name: t('anim-studio.parts-layers.tracks-combined-no-order'), bare: true, level: 2, expanded: tOpen, selected: false, toggles: [], describe: t('anim-studio.parts-layers.keyframe-tracks-of-name', { name: row.name }) });
      return tOpen ? [item, head, ...trackRows(this._list, d, this.selection, row.ref, 3)] : [item, head];
    }
    return open ? [item, ...trackRows(this._list, d, this.selection, row.ref, row.level === 2 ? 3 : 2)] : [item];
  }

  protected render(): TemplateResult {
    const d = this.doc;
    if (!d || d.kind !== 'keyframes') return html``;
    const rigged = hasRig(d);
    const rows = this._rows();
    const sel = this._sel;
    const parts = partIdsOf(d, sel);
    const one = sel.length === 1 ? sel[0] : undefined;
    const mergeable = parts.length >= 2 && parts.every((id) => d.rig?.parts.find((p) => p.id === id)?.from);
    const splittable = !!one && one.startsWith('part:') && (d.rig?.parts.find((p) => `part:${p.id}` === one)?.from?.length ?? 0) > 1;
    const order = one?.startsWith('part:') ? d.rig!.parts.findIndex((p) => `part:${p.id}` === one) : -1;
    return html`<div class="parts" @keydown=${this._onKey}>
      ${!rigged || this._resplit || this._confirm
        ? html`${!rigged
              ? html`<p class="lead">${t("anim-studio.parts-layers.split-the-icon-to-animate-its-shapes-one")}</p>`
              : nothing}${this._renderSource(rigged)}`
        : nothing}
      ${rigged
        ? html`<div class="bar" role="toolbar" aria-label=${t('anim-studio.parts-layers.part-actions')}>
              ${this._iconBtn('mdi:group', t('anim-studio.parts-layers.group'), () => this._group(), !groupBlocker(d, sel), t('anim-studio.parts-layers.ctrl-g'))}
              ${this._iconBtn('mdi:ungroup', t('anim-studio.parts-layers.ungroup'), () => this._ungroup(), sel.some((r) => r.startsWith('group:')), t('anim-studio.parts-layers.ctrl-shift-g'))}
              ${this._iconBtn('mdi:set-merge', t('anim-studio.parts-layers.merge-parts'), () => this._merge(), mergeable)}
              ${this._iconBtn('mdi:call-split', t('anim-studio.parts-layers.split-back-into-shapes'), () => this._splitBack(), splittable)}
              ${this._iconBtn('mdi:arrow-up', t('anim-studio.parts-layers.move-up-drawn-on-top'), () => this._move(1), order >= 0 && order < d.rig!.parts.length - 1, t('anim-studio.parts-layers.alt-arrowup'))}
              ${this._iconBtn('mdi:arrow-down', t('anim-studio.parts-layers.move-down-drawn-underneath'), () => this._move(-1), order > 0, t('anim-studio.parts-layers.alt-arrowdown'))}
            </div>
            <ul class="tree" aria-label=${t('anim-studio.parts-layers.icon-parts')}>
              ${rows.map((r) => this._renderRow(r, rows, sel))}
            </ul>
            ${this._notice ? html`<p class="help notice" role="note">${this._notice}</p>` : nothing}
            <p class="help">${t('anim-studio.parts-layers.click-a-part-to-animate-it-on-the')}</p>
            ${this._resplit || this._confirm
              ? nothing
              : html`<div>
                  <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${() => ((this._resplit = true), (this._confirm = false))}>
                    <ha-icon icon="mdi:scissors-cutting"></ha-icon>${t('anim-studio.parts-layers.split-again')}
                  </button>
                </div>`}`
        : nothing}
      <p class="sr-only" role="status" aria-live="polite">${this._status}</p>
    </div>`;
  }

  static styles = [
    editorTokens,
    editorPrimitives,
    layerRowStyles,
    css`
      :host {
        display: block;
        font-size: 0.875rem;
        color: var(--mc-text);
      }
      .parts {
        display: grid;
        gap: 12px;
      }
      .lead {
        margin: 0;
        color: var(--mc-text-2);
        font-size: 0.8125rem;
        line-height: 1.5;
      }
      .source {
        display: grid;
        gap: 8px;
      }
      .actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .bar {
        display: flex;
        align-items: center;
        gap: 2px;
        flex-wrap: wrap;
      }
      .bar .spacer {
        flex: 1;
      }
      .tree {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 1px;
      }
      .help {
        margin: 0;
      }
    `,
  ];
}

registerPanel({
  tag: 'mc-anim-parts-layers',
  place: 'layers',
  title: m('anim-studio.parts-layers.icon-parts'),
  order: 20,
  when: (doc) => doc.kind === 'keyframes',
});

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-parts-layers': AnimPartsLayers;
  }
}
