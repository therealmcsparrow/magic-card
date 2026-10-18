import { LitElement, html, css, nothing } from 'lit';
import type { TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../css/editor-system';
import { animationDocList } from '../utils/custom-animations';
import { animationLibrary } from '../services/animation-library';
import type { LibraryHass } from '../services/animation-library';
import { CMD, LIBRARY_CHANGED_EVENT } from '../contracts/mcu-library';
import type { ItemMeta, SavedIcon, SavedShape, SavedThemePreset } from '../contracts/mcu-library';
import type { ThemePresetStore } from '../contracts/theme-editor';
import type { TransferItem, TransferKind } from '../contracts/preset-transfer';
import { getIcon, isSaved, listIcons, listShapes, resetLibrary } from '../editor/custom/library';
import './panel';

/*
 * <mc-library-view> (preset-transfer 1.0.0): the saved animations, shapes and icons (and, when the host
 * gives it `presets`, the My theme presets) in one list. Sources: "Magic Card Utils" (animations from the
 * page's animationLibrary and its existing commands, icons and shapes from the mcu-library commands) and
 * "This card" (the card's custom_* copies, read only). Rename and delete need an admin; other users see
 * the list. Import saves into Magic Card Utils itself; without it the `mc-transfer-import` event goes on
 * to the host (the card editor writes inline copies).
 */

interface Row {
  id: string;
  name: string;
  words: string;
  /** The stored object (mcu source), by kind. */
  src: unknown;
}
interface Hass extends LibraryHass {
  user?: { is_admin?: boolean };
}
type Source = 'mcu' | 'card';
type Status = 'loading' | 'ok' | 'missing' | 'error';

const SAVE_ANIM = 'magic_card_utils/save_animation';
const DEL_ANIM = 'magic_card_utils/delete_animation';
const LABEL: Record<TransferKind, string> = { animation: 'Animations', shape: 'Shapes', icon: 'Icons', theme: 'Theme presets' };
const rest = (o: object): Record<string, unknown> => {
  const { id: _i, name: _n, created_at: _c, updated_at: _u, ...r } = o as Record<string, unknown>;
  void [_i, _n, _c, _u];
  return r;
};
const meta = (m: ItemMeta): ItemMeta => ({ ...(m.author ? { author: m.author } : {}), ...(m.description ? { description: m.description } : {}) });

@customElement('mc-library-view')
export class LibraryView extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .wrap {
        display: grid;
        gap: 12px;
      }
      .row,
      li {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 4px;
      }
      li {
        padding: 4px 8px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius);
        min-height: 44px;
      }
      .grow {
        flex: 1 1 140px;
        min-width: 0;
        overflow-wrap: anywhere;
      }
      .grow small {
        display: block;
        color: var(--mc-text-2);
      }
      input[type='checkbox'] {
        width: 24px;
        height: 24px;
      }
    `,
  ];

  @property({ attribute: false }) hass?: Hass;
  @property({ attribute: false }) kinds: TransferKind[] = ['animation', 'shape', 'icon'];
  /** The card's custom_animations / custom_shapes / custom_icons copies ("This card"). */
  @property({ attribute: false }) config?: { custom_animations?: unknown; custom_shapes?: Record<string, unknown>; custom_icons?: Record<string, string> };
  /** The card editor: imports that do not go to Magic Card Utils bubble up as `mc-transfer-import` for the host to write into the card. */
  @property({ type: Boolean }) inline = false;
  /** The kind shown first. */
  @property({ type: String }) startKind?: TransferKind;
  /** The theme editor's backend.presets; absent = an older Magic Card Utils (or none). */
  @property({ attribute: false }) presets?: ThemePresetStore;

  @state() private _kind: TransferKind = 'animation';
  @state() private _source: Source = 'mcu';
  @state() private _q = '';
  @state() private _status: Status = 'loading';
  @state() private _rows: Row[] = [];
  @state() private _sel = new Set<string>();
  @state() private _edit?: { id: string; kind: 'rename' | 'delete' };
  @state() private _msg = '';
  @state() private _panel?: { mode: 'import' | 'export'; exportItems?: { kind: TransferKind; items: TransferItem[] } };

  private _unsub?: () => void;
  private _seq = 0;
  private _switched = false;
  private _onChanged = (): void => void this._load();

  connectedCallback(): void {
    super.connectedCallback();
    this._kind = this.startKind && this.kinds.includes(this.startKind) ? this.startKind : this.kinds.includes(this._kind) ? this._kind : this.kinds[0];
    this._unsub = animationLibrary.subscribe(() => this._kind === 'animation' && void this._load());
    window.addEventListener(LIBRARY_CHANGED_EVENT, this._onChanged);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsub?.();
    window.removeEventListener(LIBRARY_CHANGED_EVENT, this._onChanged);
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('hass')) animationLibrary.ensure(this.hass);
  }

  protected updated(changed: PropertyValues): void {
    // the panel went away (closed or imported): focus would fall to the page, so it goes back to the toolbar
    if (changed.has('_panel') && changed.get('_panel') && !this._panel) this.renderRoot.querySelector<HTMLElement>('.seg button.active')?.focus();
    if (changed.has('hass') && !changed.get('hass') && this.hass) void this._load();
    if (changed.has('config') || changed.has('presets')) void this._load();
  }

  private get _admin(): boolean {
    return this.hass?.user?.is_admin !== false;
  }

  /** Rows of the current kind and source; sets the status. */
  private async _load(): Promise<void> {
    const seq = ++this._seq;
    const kind = this._kind;
    let status: Status = 'ok';
    let rows: Row[] = [];
    const row = (id: string, name: string, src: unknown, kw: string[] = []): Row => ({ id, name, src, words: [id, name, ...kw].join(' ').toLowerCase() });
    if (this._source === 'card') {
      const c = this.config ?? {};
      if (kind === 'animation') rows = animationDocList(c.custom_animations).map((d) => row(String(d.id), String(d.name ?? d.id), d));
      else if (kind === 'shape') rows = Object.entries(c.custom_shapes ?? {}).map(([id, s]) => row(id, id, s));
      else if (kind === 'icon') rows = Object.entries(c.custom_icons ?? {}).map(([id, s]) => row(id, id, s));
    } else if (kind === 'animation') {
      status = animationLibrary.status === 'ready' ? 'ok' : animationLibrary.status === 'unavailable' ? 'missing' : 'loading';
      rows = animationLibrary.list().map((d) => row(d.id, d.name, d));
    } else if (kind === 'theme') {
      if (!this.presets) status = 'missing';
      else
        try {
          // the panel adapter answers { theme_presets }, the contract type says a list: take both
          const r = (await this.presets.list()) as SavedThemePreset[] | { theme_presets?: SavedThemePreset[] };
          rows = (Array.isArray(r) ? r : (r?.theme_presets ?? [])).map((p) => row(p.id, p.name, p));
        } catch {
          status = 'error';
        }
    } else {
      const l = await (kind === 'icon' ? listIcons(this.hass) : listShapes(this.hass));
      status = l.state;
      rows = (l.items as Array<{ id: string; name: string; keywords?: string[] }>).map((i) => row(i.id, i.name, i, i.keywords));
    }
    if (seq !== this._seq) return;
    if (status === 'missing' && this.inline && this._source === 'mcu' && kind !== 'theme' && !this._switched) {
      // no Magic Card Utils: the card's own copies are all there is to list
      this._switched = true;
      this._source = 'card';
      return this._load();
    }
    this._rows = rows.sort((a, b) => a.name.localeCompare(b.name));
    this._status = status;
    this._sel = new Set([...this._sel].filter((id) => rows.some((r) => r.id === id)));
  }

  private _go(kind: TransferKind, source: Source): void {
    this._kind = kind;
    this._source = source;
    this._sel = new Set();
    this._edit = undefined;
    this._q = '';
    this._msg = '';
    this._status = 'loading';
    void this._load();
  }

  /** Whether imports of `kind` go to Magic Card Utils (else the host gets the event). */
  private _has(kind: TransferKind): boolean {
    return kind === 'theme' ? !!this.presets : this._status === 'ok' && this._source === 'mcu' && kind === this._kind;
  }

  private _taken = (kind: TransferKind, id: string): boolean => {
    if (kind === this._kind && this._source === 'mcu') return this._rows.some((r) => r.id === id);
    if (kind === 'animation') return !!animationLibrary.get(id) || animationDocList(this.config?.custom_animations).some((d) => d.id === id);
    // a copy that shares an id with a saved item would be pruned from the card as unused
    if (kind === 'shape') return !!this.config?.custom_shapes?.[id] || isSaved('shapes', id);
    return kind === 'icon' && (!!this.config?.custom_icons?.[id] || isSaved('icons', id));
  };

  private async _call(msg: Record<string, unknown>): Promise<void> {
    await this.hass!.callWS(msg);
  }

  private _fail(e: unknown): void {
    const c = String((e as { code?: string })?.code ?? '');
    this._msg =
      c === 'unauthorized'
        ? 'Your account can use the library but not change it. Ask an admin.'
        : c === 'conflict'
          ? 'It changed while you were looking. The list is reloaded; try again.'
          : c === 'library_full'
            ? 'The library is full.'
            : 'Could not reach Magic Card Utils. Nothing was changed.';
  }

  private async _after(done: string): Promise<void> {
    resetLibrary();
    this._edit = undefined;
    await this._load();
    this._msg = done;
  }

  private async _rename(r: Row, raw: string): Promise<void> {
    const name = raw.trim();
    if (!name || name.length > 80) {
      this._msg = 'The name must be 1 to 80 characters.';
      return;
    }
    try {
      const k = this._kind;
      if (k === 'animation') await this._call({ type: SAVE_ANIM, animation: { ...(r.src as object), name } });
      else if (k === 'theme') await this.presets!.save({ ...rest(r.src as SavedThemePreset), id: r.id, name } as never, (r.src as SavedThemePreset).updated_at);
      else {
        const full = k === 'icon' ? await getIcon(this.hass, r.id) : (r.src as SavedShape);
        if (!full) throw new Error('gone');
        const key = k === 'icon' ? 'icon' : 'shape';
        await this._call({ type: k === 'icon' ? CMD.iconsSave : CMD.shapesSave, [key]: { ...rest(full as never), id: r.id, name }, base_updated_at: (full as SavedIcon).updated_at });
      }
      await this._after(`Renamed to ${name}.`);
    } catch (e) {
      this._fail(e);
    }
  }

  private async _delete(r: Row): Promise<void> {
    try {
      const k = this._kind;
      if (k === 'animation') await this._call({ type: DEL_ANIM, animation_id: r.id });
      else if (k === 'theme') await this.presets!.remove(r.id);
      else await this._call(k === 'icon' ? { type: CMD.iconsDelete, icon_id: r.id } : { type: CMD.shapesDelete, shape_id: r.id });
      await this._after(`Deleted ${r.name}.`);
    } catch (e) {
      this._fail(e);
    }
  }

  /** The rows as export items (selected rows, or all listed when none is selected). */
  private async _export(): Promise<void> {
    const kind = this._kind;
    const pick = this._rows.filter((r) => (this._sel.size ? this._sel.has(r.id) : true));
    const items: TransferItem[] = [];
    for (const r of pick) {
      const base = { id: r.id, name: r.name };
      const s = r.src as Record<string, unknown>;
      if (kind === 'animation') items.push({ ...base, data: rest(s) } as never);
      else if (kind === 'theme') items.push({ ...base, ...meta(s as ItemMeta), data: (s as unknown as SavedThemePreset).doc } as never);
      else if (kind === 'shape') {
        const sh = this._source === 'card' ? rest(s) : (s as unknown as SavedShape).shape;
        items.push({ ...base, ...(this._source === 'card' ? {} : meta(s as ItemMeta)), data: { ...sh, ref: undefined } } as never);
      } else if (this._source === 'card') items.push({ ...base, data: { svg: String(r.src) } } as never);
      else {
        const full = await getIcon(this.hass, r.id);
        if (full) items.push({ ...base, ...meta(full), ...(full.keywords?.length ? { keywords: full.keywords } : {}), data: { svg: full.svg, path: full.path, ...(full.secondary_path ? { secondary_path: full.secondary_path } : {}), view_box: full.view_box } } as never);
      }
    }
    this._panel = { mode: 'export', exportItems: { kind, items } };
  }

  private async _import(e: CustomEvent<{ kind: TransferKind; items: TransferItem[] }>): Promise<void> {
    const { kind, items } = e.detail;
    if (!this._has(kind)) {
      // the host writes the inline copies
      this._panel = undefined;
      this._msg = `Added ${items.length} to this card.`;
      return;
    }
    e.stopPropagation();
    let ok = 0;
    let full = 0;
    let bad = 0;
    for (const it of items) {
      try {
        const m = { id: it.id, name: it.name, ...meta(it) };
        const d = it.data as unknown as Record<string, unknown>;
        if (kind === 'animation') await this._call({ type: SAVE_ANIM, animation: { ...d, id: it.id, name: it.name } });
        else if (kind === 'theme') await this.presets!.save({ ...m, doc: d } as never);
        else if (kind === 'shape') await this._call({ type: CMD.shapesSave, shape: { ...m, shape: d } });
        else await this._call({ type: CMD.iconsSave, icon: { ...m, ...(it.keywords ? { keywords: it.keywords } : {}), svg: d.svg, path: d.path ?? '', ...(d.secondary_path ? { secondary_path: d.secondary_path } : {}), view_box: d.view_box ?? '0 0 24 24' } });
        ok++;
      } catch (err) {
        if ((err as { code?: string })?.code === 'library_full') full++;
        else bad++;
      }
    }
    this._panel = undefined;
    await this._after(`Imported ${ok} of ${items.length}.${full ? ` ${full} did not fit: the library is full.` : ''}${bad ? ` ${bad} could not be saved.` : ''}`);
  }

  render(): TemplateResult {
    if (this._panel)
      return html`<mc-transfer-panel
        host="card-editor"
        .mode=${this._panel.mode}
        .exportItems=${this._panel.exportItems}
        .taken=${this._taken}
        .hasLibrary=${this._kind === 'theme' ? !!this.presets : this._status !== 'missing'}
        @mc-transfer-import=${this._import}
        @mc-transfer-close=${(e: Event) => {
          e.stopPropagation();
          this._panel = undefined;
        }}
      ></mc-transfer-panel>`;
    const q = this._q.trim().toLowerCase();
    const shown = this._rows.filter((r) => r.words.includes(q));
    const can = this._admin && this._source === 'mcu' && this._status === 'ok';
    const noun = LABEL[this._kind].toLowerCase();
    return html`
      <div class="wrap">
        <div class="seg" role="group" aria-label="Kind">
          ${this.kinds.map((k) => html`<button aria-pressed=${this._kind === k} class=${this._kind === k ? 'active' : ''} @click=${() => this._go(k, this._source)}>${LABEL[k]}</button>`)}
        </div>
        ${this._kind === 'theme'
          ? nothing
          : html`<div class="seg" role="group" aria-label="Source">
              ${(['mcu', 'card'] as const).map((s) => html`<button aria-pressed=${this._source === s} class=${this._source === s ? 'active' : ''} @click=${() => this._go(this._kind, s)}>${s === 'mcu' ? 'Magic Card Utils' : 'This card'}</button>`)}
            </div>`}
        <div class="field">
          <div class="field-head"><label for="q">Search ${noun}</label></div>
          <input id="q" class="input" type="search" .value=${this._q} @input=${(e: Event) => (this._q = (e.target as HTMLInputElement).value)} />
        </div>
        <div class="row">
          <button class="btn btn-secondary" ?disabled=${!shown.length} @click=${() => this._export()}>${this._sel.size ? `Export ${this._sel.size} selected` : 'Export all'}</button>
          ${can || this.inline ? html`<button class="btn btn-secondary" @click=${() => (this._panel = { mode: 'import' })}>Import</button>` : nothing}
        </div>
        ${this.inline && this._source === 'card' ? html`<p class="help">Imported items are saved in this card.</p>` : nothing}
        <div role="status" aria-live="polite" class="help">${this._msg || (this._status === 'ok' ? `${shown.length} ${noun}` : '')}</div>
        ${this._body(shown, can)}
      </div>
    `;
  }

  private _body(shown: Row[], can: boolean): TemplateResult {
    const s = this._status;
    if (s === 'loading') return html`<p class="help">Loading...</p>`;
    if (s === 'missing' || s === 'error') {
      const older = this._kind === 'theme' ? 'Update Magic Card Utils to keep theme presets.' : 'Keep your own items on every dashboard with the free Magic Card Utils add-on. Until then they stay in this card.';
      return html`<div class="empty"><p>${s === 'error' ? 'Could not reach Magic Card Utils. Your work is safe.' : older}</p>${s === 'error' ? html`<button class="btn btn-secondary" @click=${() => { resetLibrary(); void this._load(); }}>Try again</button>` : nothing}</div>`;
    }
    if (!shown.length) return html`<div class="empty"><p>${this._q ? `No ${LABEL[this._kind].toLowerCase()} match "${this._q}".` : `No ${LABEL[this._kind].toLowerCase()} here yet.`}</p></div>`;
    return html`<ul>${shown.map((r) => this._item(r, can))}</ul>`;
  }

  private _item(r: Row, can: boolean): TemplateResult {
    const e = this._edit?.id === r.id ? this._edit.kind : undefined;
    const set = (kind: 'rename' | 'delete' | undefined) => () => (this._edit = kind ? { id: r.id, kind } : undefined);
    return html`<li>
      <input type="checkbox" aria-label="Select ${r.name}" .checked=${this._sel.has(r.id)} @change=${(ev: Event) => {
        const n = new Set(this._sel);
        if ((ev.target as HTMLInputElement).checked) n.add(r.id);
        else n.delete(r.id);
        this._sel = n;
      }} />
      ${e === 'rename'
        ? html`<input class="input grow" aria-label="New name for ${r.name}" .value=${r.name} maxlength="80" @keydown=${(ev: KeyboardEvent) => {
            if (ev.key === 'Enter') void this._rename(r, (ev.target as HTMLInputElement).value);
            if (ev.key === 'Escape') {
              ev.stopPropagation();
              set(undefined)();
            }
          }} />
          <button class="btn btn-secondary btn-sm" @click=${(ev: Event) => void this._rename(r, (ev.target as HTMLElement).parentElement!.querySelector<HTMLInputElement>('.input')!.value)}>Save</button>
          <button class="btn btn-text btn-sm" @click=${set(undefined)}>Cancel</button>`
        : html`<span class="grow">${r.name}<small class="mono">${r.id}</small></span>`}
      ${can && !e
        ? html`<button class="btn btn-text btn-sm" aria-label="Rename ${r.name}" @click=${set('rename')}>Rename</button>
            <button class="btn btn-text btn-sm" aria-label="Delete ${r.name}" @click=${set('delete')}>Delete</button>`
        : nothing}
      ${e === 'delete'
        ? html`<span class="help" role="alert">Delete ${r.name}? ${this._kind === 'theme' ? 'Themes you applied stay.' : 'Cards that use it keep their own copy, or show the default.'}</span>
            <button class="btn btn-primary btn-sm" @click=${() => this._delete(r)}>Delete</button>
            <button class="btn btn-text btn-sm" @click=${set(undefined)}>Cancel</button>`
        : nothing}
    </li>`;
  }
}
