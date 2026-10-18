import { LitElement, html, css, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorPrimitives, editorTokens } from '../../css/editor-system';
import type { AnimationDoc, TargetRef } from '../model';
import { V2_CAPS } from '../model-v2';
import { editorDefined } from '../editor-slots';
import { registerPanel, type StageInfo, type StudioSelection } from '../slots';
import type { PreviewTile } from '../tiles';
import {
  emitDoc,
  emitSelection,
  groupBlocker,
  groupOfPart,
  groupParts,
  groupRef,
  hasRig,
  hiddenParts,
  loadGeometry,
  mergeParts,
  movePart,
  onHiddenChange,
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
  toggleHidden,
  clearHidden,
  trackOf,
  ungroup,
} from './parts-model';

/*
 * Icon parts in the Layers column (studio slot 'layers', track B2). Splits the icon into parts
 * ("Split icon": each separate shape a part, holes kept with their shape), lists parts and groups
 * as a tree, selects them (click, Shift range, Ctrl / Cmd toggle; the selection is the studio's:
 * selection-change with target 'part:<id>' / 'group:<id>', so the timeline adds keys to that
 * target's track), renames (double-click, F2), groups (Ctrl+G), ungroups (Ctrl+Shift+G), merges,
 * splits back, reorders (Alt+arrows) and hides parts in the preview (session only, never stored).
 * Every action is a button too: no hover-only or keyboard-only actions (tablet).
 */

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
  /** The row that holds the tab stop (roving tabindex): the focused row, else the primary selection, else the first row. */
  private _focusRef?: string;
  /** Shift-click range anchor. */
  private _anchor?: TargetRef;
  /** The user typed the icon to split (else it follows the document and the preview tile). */
  private _iconTyped = false;
  private _offHidden?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this._offHidden = onHiddenChange(() => this.requestUpdate());
    // the card bundle defines the icon picker: until it does, "Icon to split" is a plain field
    if (!editorDefined('mc-icon-picker') && typeof customElements !== 'undefined') void customElements.whenDefined('mc-icon-picker').then(() => this.requestUpdate());
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._offHidden?.();
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
      this._error = 'Use an icon id like mdi:bell-ring.';
      return;
    }
    this._busy = true;
    this._error = '';
    try {
      const g = await loadGeometry(ref);
      // another document opened while the icon loaded: the split is not for it
      if (this.doc?.id !== d.id) return;
      if (!g) {
        this._error = 'This icon could not be loaded. Check the icon id, or try again when Home Assistant is reachable.';
        return;
      }
      const pieces = piecesOf(g);
      if (!pieces.length) {
        this._error = 'This icon has no shapes to split.';
        return;
      }
      const next = splitInto(this.doc ?? d, pieces, own ? { svg: own } : { icon: ref });
      const n = next.rig?.parts.length ?? 0;
      const capped = pieces.length > V2_CAPS.parts;
      this._notice = capped ? `The icon has ${pieces.length} shapes: the first ${V2_CAPS.parts} became parts (the most a rig holds), the rest stay at rest.` : '';
      clearHidden();
      this._change(next, 'Split icon', `Split into ${n} part${n === 1 ? '' : 's'}${capped ? ` (the first ${V2_CAPS.parts})` : ''}`);
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
    const why = groupBlocker(d, this._sel);
    if (why) {
      this._status = why;
      return;
    }
    const r = groupParts(d, this._sel);
    if (!r.id) return;
    this._change(r.doc, 'Group parts', `Grouped ${partIdsOf(d, this._sel).length} parts`);
    this._select([groupRef(r.id)]);
  }

  private _ungroup(): void {
    const d = this.doc;
    const groups = this._sel.filter((r) => r.startsWith('group:'));
    if (!d || !groups.length || this.disabled) return;
    let next = d;
    const members: TargetRef[] = [];
    for (const g of groups) {
      members.push(...(d.rig?.groups?.find((x) => `group:${x.id}` === g)?.parts ?? []).map(partRef));
      next = ungroup(next, g.slice(6));
    }
    this._change(next, 'Ungroup', groups.length > 1 ? 'Groups removed' : 'Group removed');
    this._select(members);
  }

  private _merge(): void {
    const d = this.doc;
    if (!d || this.disabled) return;
    const r = mergeParts(d, this._sel);
    if (!r.id) return;
    this._change(r.doc, 'Merge parts', 'Parts merged');
    this._select([partRef(r.id)]);
  }

  private _splitBack(): void {
    const d = this.doc;
    const part = this._sel.find((r) => r.startsWith('part:'));
    if (!d || !part || this.disabled) return;
    const r = splitPart(d, part.slice(5));
    if (r.ids.length < 2) return;
    this._change(r.doc, 'Split part', `Split into ${r.ids.length} parts`);
    this._select(r.ids.map(partRef));
  }

  private _move(by: -1 | 1): void {
    const d = this.doc;
    const part = this._sel.find((r) => r.startsWith('part:'));
    if (!d || !part || this.disabled) return;
    const next = movePart(d, part.slice(5), by);
    if (next !== d) this._change(next, 'Move part', by > 0 ? 'Moved up: drawn on top' : 'Moved down: drawn underneath');
  }

  private _rename(ref: TargetRef, name: string): void {
    // Enter (or Escape) then the blur of the removed input: only the first counts
    if (this._renaming !== ref) return;
    this._renaming = undefined;
    const d = this.doc;
    if (!d || !name.trim() || name.trim() === targetName(d, ref)) return;
    this._change(renameTarget(d, ref, name), 'Rename part', 'Renamed');
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
    const focused = (this.renderRoot as ShadowRoot).activeElement?.closest?.('li.row')?.getAttribute('data-ref') ?? undefined;
    const curRef = focused ?? this.selection.target ?? this._anchor;
    const cur = rows.findIndex((r) => r.ref === curRef);
    const row = rows[cur];
    if (row && !mod && k === 'h') {
      // hide / show in the preview
      e.preventDefault();
      toggleHidden(row.ref);
      return;
    }
    if (row?.kind === 'group' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      const gid = row.ref.slice(6);
      const next = new Set(this._collapsed);
      if (e.key === 'ArrowLeft') next.add(gid);
      else next.delete(gid);
      this._collapsed = next;
      return;
    }
    if (row?.level === 2 && e.key === 'ArrowLeft') {
      // to the row's group
      e.preventDefault();
      const g = rows.slice(0, cur).reverse().find((r) => r.kind === 'group');
      if (g) {
        this._select([g.ref]);
        this._focusRow(g.ref);
      }
      return;
    }
    if (e.key === ' ' || e.key === 'Enter') {
      if (row && (e.target as HTMLElement).matches?.('li.row')) {
        e.preventDefault();
        this._anchor = row.ref;
        this._select([row.ref]);
      }
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (e.altKey) return this._move(e.key === 'ArrowUp' ? 1 : -1);
      const next = rows[Math.max(0, Math.min(rows.length - 1, cur + (e.key === 'ArrowDown' ? 1 : -1)))];
      if (!next) return;
      if (e.shiftKey && cur >= 0) this._select([...this._sel, next.ref], next.ref);
      else {
        this._anchor = next.ref;
        this._select([next.ref]);
      }
      this._focusRow(next.ref);
      return;
    }
    if (e.key === 'F2' && this.selection.target) {
      e.preventDefault();
      this._renaming = this.selection.target;
      return;
    }
    if (e.key === 'Escape' && this._sel.length) {
      e.preventDefault();
      this._select([]);
    }
  }

  private _focusRow(ref: string): void {
    this._focusRef = ref;
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>(`li[data-ref="${ref}"]`)?.focus());
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
        ? html`<p class="help">The parts come from the document's own SVG, one part per shape.</p>`
        : editorDefined('mc-icon-picker')
          ? html`<div class="field">
              <div class="field-head"><span class="lbl" id="pl-icon-l">Icon to split</span></div>
              <mc-icon-picker
                .hass=${this.hass}
                .value=${this._icon}
                label="Icon to split"
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
            <div class="field-head"><label for="pl-icon">Icon to split</label></div>
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
          <ha-icon icon="mdi:scissors-cutting"></ha-icon>${this._busy ? 'Splitting…' : this._confirm ? `Replace ${d.rig?.parts.length ?? 0} parts` : rigged ? 'Split again' : 'Split icon'}
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
              Cancel
            </button>`
          : nothing}
      </div>
      ${this._confirm ? html`<p class="help">Splitting again replaces the parts, their groups and their keys.</p>` : nothing}
    </div>`;
  }

  private _tabRef(rows: Row[]): string | undefined {
    for (const r of [this._focusRef, this.selection.target]) if (r && rows.some((x) => x.ref === r)) return r;
    return rows[0]?.ref;
  }

  private _renderRow(row: Row, rows: Row[], sel: TargetRef[]): TemplateResult {
    const selected = sel.includes(row.ref);
    const hidden = hiddenParts().has(row.ref);
    const gid = row.kind === 'group' ? row.ref.slice(6) : '';
    const collapsed = !!gid && this._collapsed.has(gid);
    const meta = row.kind === 'part' && row.count > 1 ? `${row.count} shapes` : '';
    return html`<li
      role="treeitem"
      class="row lvl-${row.level} ${selected ? 'is-selected' : ''} ${hidden ? 'is-hidden' : ''}"
      aria-level=${row.level}
      aria-selected=${selected ? 'true' : 'false'}
      aria-expanded=${row.kind === 'group' ? (collapsed ? 'false' : 'true') : nothing}
      tabindex=${row.ref === this._tabRef(rows) ? 0 : -1}
      @focus=${() => (this._focusRef = row.ref)}
      data-ref=${row.ref}
      @click=${(e: MouseEvent) => this._onRowClick(e, row, rows)}
      @dblclick=${() => !this.disabled && (this._renaming = row.ref)}
    >
      ${row.kind === 'group'
        ? html`<button
            type="button"
            class="caret"
            tabindex="-1"
            aria-label=${collapsed ? `Expand ${row.name}` : `Collapse ${row.name}`}
            @click=${(e: Event) => {
              e.stopPropagation();
              const next = new Set(this._collapsed);
              if (collapsed) next.delete(gid);
              else next.add(gid);
              this._collapsed = next;
            }}
          >
            <ha-icon icon=${collapsed ? 'mdi:chevron-right' : 'mdi:chevron-down'}></ha-icon>
          </button>`
        : html`<span class="caret-space"></span>`}
      <ha-icon class="kind" icon=${ICONS[row.kind]}></ha-icon>
      ${this._renaming === row.ref
        ? html`<input
            class="input rename"
            aria-label="Name"
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
        : html`<span class="name">${row.name}</span>`}
      ${meta ? html`<span class="meta">${meta}</span>` : nothing}
      ${row.keys ? html`<span class="keys" title="Keys on the timeline">${row.keys}</span>` : nothing}
      <button
        type="button"
        class="eye"
        tabindex="-1"
        aria-pressed=${hidden ? 'true' : 'false'}
        aria-label=${hidden ? `Show ${row.name} in the preview` : `Hide ${row.name} in the preview`}
        title=${hidden ? 'Show in the preview' : 'Hide in the preview'}
        @click=${(e: Event) => {
          e.stopPropagation();
          toggleHidden(row.ref);
        }}
      >
        <ha-icon icon=${hidden ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}></ha-icon>
      </button>
    </li>`;
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
              ? html`<p class="lead">Split the icon to animate its shapes one by one: a bell's clapper, a fan's blades.</p>`
              : nothing}${this._renderSource(rigged)}`
        : nothing}
      ${rigged
        ? html`<div class="bar" role="toolbar" aria-label="Part actions">
              ${this._iconBtn('mdi:group', 'Group', () => this._group(), !groupBlocker(d, sel), 'Ctrl+G')}
              ${this._iconBtn('mdi:ungroup', 'Ungroup', () => this._ungroup(), sel.some((r) => r.startsWith('group:')), 'Ctrl+Shift+G')}
              ${this._iconBtn('mdi:set-merge', 'Merge parts', () => this._merge(), mergeable)}
              ${this._iconBtn('mdi:call-split', 'Split back into shapes', () => this._splitBack(), splittable)}
              ${this._iconBtn('mdi:arrow-up', 'Move up (drawn on top)', () => this._move(1), order >= 0 && order < d.rig!.parts.length - 1, 'Alt+ArrowUp')}
              ${this._iconBtn('mdi:arrow-down', 'Move down (drawn underneath)', () => this._move(-1), order > 0, 'Alt+ArrowDown')}
            </div>
            <ul class="tree" role="tree" aria-label="Icon parts" aria-multiselectable="true">
              ${rows.map((r) => this._renderRow(r, rows, sel))}
            </ul>
            ${this._notice ? html`<p class="help notice" role="note">${this._notice}</p>` : nothing}
            <p class="help">Click a part to animate it on the timeline. Shift or Ctrl adds to the selection; double-click or F2 renames, H hides.</p>
            ${this._resplit || this._confirm
              ? nothing
              : html`<div>
                  <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${() => ((this._resplit = true), (this._confirm = false))}>
                    <ha-icon icon="mdi:scissors-cutting"></ha-icon>Split again
                  </button>
                </div>`}`
        : nothing}
      <p class="sr-only" role="status" aria-live="polite">${this._status}</p>
    </div>`;
  }

  static styles = [
    editorTokens,
    editorPrimitives,
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
      .row {
        display: flex;
        align-items: center;
        gap: 6px;
        min-height: 36px;
        padding: 0 4px 0 2px;
        border-radius: var(--mc-radius-sm, 6px);
        cursor: pointer;
        user-select: none;
        --mdc-icon-size: 18px;
      }
      .row:hover {
        background: var(--mc-surface-2);
      }
      .row.is-selected {
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
      }
      .row:focus-visible {
        outline: 2px solid var(--mc-accent);
        outline-offset: -2px;
      }
      .row.lvl-2 {
        padding-left: 22px;
      }
      .row.is-hidden .name,
      .row.is-hidden .kind {
        opacity: 0.5;
      }
      .kind {
        color: var(--mc-text-2);
        flex: none;
      }
      .row.is-selected .kind {
        color: inherit;
      }
      .caret,
      .eye {
        flex: none;
        display: grid;
        place-items: center;
        width: 28px;
        height: 28px;
        border: 0;
        border-radius: var(--mc-radius-sm, 6px);
        background: transparent;
        color: var(--mc-text-2);
        padding: 0;
        cursor: pointer;
      }
      .caret:hover,
      .eye:hover {
        background: var(--mc-surface);
      }
      .eye[aria-pressed='true'] {
        color: var(--mc-accent-ink);
      }
      .caret-space {
        width: 28px;
        flex: none;
      }
      .name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .meta {
        flex: none;
        color: var(--mc-text-2);
        font-size: 0.75rem;
      }
      .row.is-selected .meta {
        color: inherit;
      }
      .keys {
        flex: none;
        min-width: 20px;
        height: 20px;
        padding: 0 6px;
        box-sizing: border-box;
        border-radius: 9999px;
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface);
        color: var(--mc-text-2);
        font-size: 0.6875rem;
        font-weight: 500;
        display: grid;
        place-items: center;
      }
      .rename {
        flex: 1;
        min-width: 0;
        height: 30px;
        padding: 4px 8px;
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
  title: 'Icon parts',
  order: 20,
  when: (doc) => doc.kind === 'keyframes',
});

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-parts-layers': AnimPartsLayers;
  }
}
