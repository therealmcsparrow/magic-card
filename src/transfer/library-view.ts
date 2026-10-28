import { LitElement, html, css, nothing } from 'lit';
import type { TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorTokens } from '../css/editor-system';
import { button, defineUiKit, editorPrimitives, empty, field, kitCss, notice, row, seg } from '../ui-kit';
import type { LibraryHass } from '../anim-studio/animation-library';
import { animLibrary } from '../utils/anim-hooks';
import { animationDocList } from '../utils/custom-animations';
import { CMD, LIBRARY_CHANGED_EVENT } from '../contracts/mcu-library';
import type { ItemMeta, SavedIcon, SavedShape, SavedThemePreset } from '../contracts/mcu-library';
import { IMAGES_MIN_CONTRACT_REVISION, MAX_IMAGES } from '../contracts/mcu-library-images';
import type { ImageSummary } from '../contracts/mcu-library-images';
import type { ThemePresetStore } from '../contracts/theme-editor';
import { HOST_KINDS, LIBRARY_OPEN_EVENT } from '../contracts/preset-transfer';
import type { ImageTransfer, ImageTransferText, LibraryListing, LibraryOpenDetail, LibrarySource, LibraryViewContext, TransferItem, TransferKind } from '../contracts/preset-transfer';
import { SVG_EDITOR_CONTRACT_REVISION } from '../contracts/svg-editor';
import { setI18nLocale } from '../i18n/runtime';
import { count } from './count';
import { loadImageTransfer } from './image-transfer-loader';
import { locale, t } from './i18n';
import './panel';
import type { TransferPanel } from './panel';

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
const LABEL = (kind: TransferKind): string => (kind === 'animation' ? t('transfer.library-view.animations') : kind === 'shape' ? t('transfer.library-view.shapes') : kind === 'icon' ? t('transfer.library-view.icons') : kind === 'image' ? t('transfer.library-view.images') : t('transfer.library-view.theme-presets'));
const rest = (o: object): Record<string, unknown> => {
  const { id: _i, name: _n, created_at: _c, updated_at: _u, ...r } = o as Record<string, unknown>;
  void [_i, _n, _c, _u];
  return r;
};
const meta = (m: ItemMeta): ItemMeta => ({ ...(m.author ? { author: m.author } : {}), ...(m.description ? { description: m.description } : {}) });

const DEFAULT_KINDS: TransferKind[] = ['animation', 'shape', 'icon'];

const codeOf = (e: unknown): string => String((e as { code?: string })?.code ?? '');

/** The source used when the host passes none: the mcu-library commands, with the ids of the last lists remembered. */
function commandSource(): LibrarySource {
  const known: Record<string, Set<string> | undefined> = {};
  const ws = (h: unknown, msg: Record<string, unknown>): Promise<Record<string, never[]>> => (h as LibraryHass).callWS(msg);
  const list = async (h: unknown, type: string, key: string): Promise<LibraryListing<never>> => {
    try {
      const items = (await ws(h, { type }))?.[key] ?? [];
      known[key] = new Set(items.map((i: { id: string }) => i.id));
      return { state: 'ok', items };
    } catch (e) {
      return { state: codeOf(e) === 'unknown_command' || !(h as LibraryHass)?.callWS ? 'missing' : 'error', items: [] };
    }
  };
  return {
    listIcons: (h) => list(h, CMD.iconsList, 'icons'),
    listShapes: (h) => list(h, CMD.shapesList, 'shapes'),
    getIcon: (h, id) => ws(h, { type: CMD.iconsGet, ids: [id] }).then((r) => (r?.icons?.[0] as SavedIcon | undefined), () => undefined),
    isSaved: (kind, id) => !!known[kind]?.has(id),
    reset: () => (known.icons = known.shapes = known.images = undefined) as never,
  };
}

@customElement('mc-library-view')
export class LibraryView extends LitElement {
  /** The Magic Card Utils panel gates on this (svg-editor contract), so the Library tab needs no SVG editor fetch. */
  static contractRevision = Math.max(SVG_EDITOR_CONTRACT_REVISION, IMAGES_MIN_CONTRACT_REVISION);
  // kit parts plus layout only (contract ui-kit 1.0.0: a screen styles its own layout, never a kit class)
  static styles = [
    editorTokens,
    editorPrimitives,
    ...kitCss,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .wrap {
        display: grid;
        gap: 12px;
      }
      .bar {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      .thumb {
        width: 40px;
        height: 40px;
        flex: none;
        object-fit: contain;
        border-radius: 6px;
        background: var(--secondary-background-color);
      }
    `,
  ];

  @property({ attribute: false }) hass?: Hass;
  @property({ attribute: false }) kinds: TransferKind[] = DEFAULT_KINDS;
  /** The card's custom_animations / custom_shapes / custom_icons copies ("This card"). */
  @property({ attribute: false }) config?: { custom_animations?: unknown; custom_shapes?: Record<string, unknown>; custom_icons?: Record<string, string> };
  /** The card editor: imports that do not go to Magic Card Utils bubble up as `mc-transfer-import` for the host to write into the card. */
  @property({ type: Boolean }) inline = false;
  /** The kind shown first. */
  @property({ type: String }) startKind?: TransferKind;
  /** The theme editor's backend.presets; absent = an older Magic Card Utils (or none). */
  @property({ attribute: false }) presets?: ThemePresetStore;
  /** Where saved icons and shapes are read; absent = the view calls the mcu-library commands itself. */
  @property({ attribute: false }) source?: LibrarySource;
  /** A host's extra for a row: a leading node (a thumbnail) and a short text after the id. Read on every render; absent = none. */
  @property({ attribute: false }) rowExtra?: (kind: TransferKind, id: string) => { thumb?: Node; meta?: string } | undefined;
  private _own?: LibrarySource;
  private get _src(): LibrarySource {
    return this.source ?? (this._own ??= commandSource());
  }
  /** The image side (reader, images_* calls, row text); loaded when the view lists images. */
  private _ix?: ImageTransfer;
  private _word(key: ImageTransferText, args?: Record<string, string | number>): string {
    return this._ix?.text(key, args) ?? '';
  }

  /** 'mcu-panel': the Magic Card Utils Library tab (all four kinds, no "This card", New / Edit fire mc-library-open). */
  @property({ type: String }) context: LibraryViewContext = 'card-editor';

  @state() private _kind: TransferKind = 'animation';
  @state() private _source: Source = 'mcu';
  @state() private _q = '';
  @state() private _status: Status = 'loading';
  @state() private _rows: Row[] = [];
  @state() private _sel = new Set<string>();
  @state() private _edit?: { id: string; kind: 'rename' | 'delete' | 'duplicate' };
  @state() private _msg = '';
  @state() private _bad = false;
  private _opener?: HTMLElement;
  @state() private _panel?: { mode: 'import' | 'export'; exportItems?: { kind: TransferKind; items: TransferItem[] } };

  private _unsub?: () => void;
  private _seq = 0;
  private _switched = false;
  private _onChanged = (): void => void this._load();

  connectedCallback(): void {
    super.connectedCallback();
    defineUiKit();
    const ks = this._kinds;
    this._kind = this.startKind && ks.includes(this.startKind) ? this.startKind : this.context === 'mcu-panel' ? ks[0] : ks.includes(this._kind) ? this._kind : ks[0];
    this._unsub = animLibrary().subscribe(() => this._kind === 'animation' && void this._load());
    window.addEventListener(LIBRARY_CHANGED_EVENT, this._onChanged);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsub?.();
    window.removeEventListener(LIBRARY_CHANGED_EVENT, this._onChanged);
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('hass')) {
      setI18nLocale(this.hass as never);
      animLibrary().ensure(this.hass);
    }
  }

  protected updated(changed: PropertyValues): void {
    // the window opens once the panel is in it; when the panel went away the window has closed, so focus goes back to the button that opened it
    if (changed.has('_panel')) {
      if (this._panel && !changed.get('_panel')) {
        const w = this.renderRoot.querySelector<HTMLElement & { show(): void; updateComplete: Promise<unknown> }>('mc-ui-window');
        w?.show();
        // the window focuses its close button; a screen reader user is better served by the panel heading
        void w?.updateComplete.then(() => this.renderRoot.querySelector<TransferPanel>('mc-transfer-panel')?.focusHeading());
      }
      else if (!this._panel && changed.get('_panel') && this._opener?.isConnected) this._opener.focus();
    }
    if (changed.has('hass') && !changed.get('hass') && this.hass) void this._load();
    if (changed.has('config') || changed.has('presets')) void this._load();
  }

  private get _kinds(): readonly TransferKind[] {
    // in the panel context a `kinds` set by the host narrows the four kinds (the Shapes tab); left alone it shows them all
    if (this.context !== 'mcu-panel') return this.kinds;
    const some = this.kinds !== DEFAULT_KINDS ? HOST_KINDS['mcu-panel'].filter((k) => this.kinds.includes(k)) : [];
    return some.length ? some : HOST_KINDS['mcu-panel'];
  }

  private get _panelCtx(): boolean {
    return this.context === 'mcu-panel';
  }

  private _open(kind: 'icon' | 'shape' | 'image', id?: string): void {
    this.dispatchEvent(new CustomEvent<LibraryOpenDetail>(LIBRARY_OPEN_EVENT, { detail: id ? { kind, id } : { kind }, bubbles: true, composed: true }));
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
    if (this._source === 'card' && !this._panelCtx) {
      const c = this.config ?? {};
      if (kind === 'animation') rows = animationDocList(c.custom_animations).map((d) => row(String(d.id), String(d.name ?? d.id), d));
      else if (kind === 'shape') rows = Object.entries(c.custom_shapes ?? {}).map(([id, s]) => row(id, id, s));
      else if (kind === 'icon') rows = Object.entries(c.custom_icons ?? {}).map(([id, s]) => row(id, id, s));
    } else if (kind === 'animation') {
      status = animLibrary().status === 'ready' ? 'ok' : animLibrary().status === 'unavailable' ? 'missing' : 'loading';
      rows = animLibrary().list().map((d) => row(d.id, d.name, d));
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
    } else if (kind === 'image') {
      this._ix = await loadImageTransfer();
      const l: LibraryListing<ImageSummary> = this._ix ? await this._ix.list(this.hass as never) : { state: 'error', items: [] };
      status = l.state;
      rows = l.items.map((i) => row(i.id, i.name, i, i.keywords));
    } else {
      const l = await (kind === 'icon' ? this._src.listIcons(this.hass) : this._src.listShapes(this.hass));
      status = l.state;
      rows = (l.items as Array<{ id: string; name: string; keywords?: string[] }>).map((i) => row(i.id, i.name, i, i.keywords));
    }
    if (seq !== this._seq) return;
    if (status === 'missing' && this.inline && !this._panelCtx && this._source === 'mcu' && kind !== 'theme' && kind !== 'image' && !this._switched) {
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
    this._source = kind === 'image' ? 'mcu' : source;
    this._sel = new Set();
    this._edit = undefined;
    this._q = '';
    this._msg = '';
    this._bad = false;
    this._status = 'loading';
    void this._load();
  }

  /** Whether imports of `kind` go to Magic Card Utils (else the host gets the event). */
  private _has(kind: TransferKind): boolean {
    return kind === 'theme' ? !!this.presets : this._status === 'ok' && this._source === 'mcu' && kind === this._kind;
  }

  /** The import lands in this card (the "This card" list of the card editor), not in Magic Card Utils. */
  private get _intoCard(): boolean {
    return this._source === 'card' && !this._panelCtx;
  }

  /** Ids the import would collide with in its target; what the clash choice is about. */
  private _taken = (kind: TransferKind, id: string): boolean => {
    if (this._intoCard) {
      const c = this.config;
      return kind === 'animation' ? animationDocList(c?.custom_animations).some((d) => d.id === id) : kind === 'shape' ? !!c?.custom_shapes?.[id] : !!c?.custom_icons?.[id];
    }
    if (kind === this._kind && this._source === 'mcu') return this._rows.some((r) => r.id === id);
    if (kind === 'animation') return !!animLibrary().get(id) || animationDocList(this.config?.custom_animations).some((d) => d.id === id);
    // a copy that shares an id with a saved item would be pruned from the card as unused
    if (kind === 'shape') return !!this.config?.custom_shapes?.[id] || this._src.isSaved('shapes', id);
    return kind === 'icon' && (!!this.config?.custom_icons?.[id] || this._src.isSaved('icons', id));
  };

  /** Into the card: ids Magic Card Utils holds too. They are renamed without asking, since a copy under a saved id would be pruned. */
  private _reserved = (kind: TransferKind, id: string): boolean =>
    this._intoCard && (kind === 'animation' ? !!animLibrary().get(id) : kind === 'shape' ? this._src.isSaved('shapes', id) : kind === 'icon' && this._src.isSaved('icons', id));

  /** Animation names the target already shows, so an import of "Pendulum" arrives as "Pendulum 2". */
  private _takenName = (kind: TransferKind, name: string): boolean => {
    if (kind !== 'animation') return false;
    const n = name.trim().toLowerCase();
    const docs = this._intoCard ? animationDocList(this.config?.custom_animations) : animLibrary().list();
    return docs.some((d) => String(d.name ?? d.id).trim().toLowerCase() === n);
  };

  private async _call(msg: Record<string, unknown>): Promise<void> {
    await this.hass!.callWS(msg);
  }

  private _fail(e: unknown): void {
    const c = String((e as { code?: string })?.code ?? '');
    this._bad = true;
    this._msg =
      c === 'unauthorized'
        ? t('transfer.library-view.your-account-can-use-the-library-but-not')
        : c === 'conflict'
          ? t('transfer.library-view.it-changed-while-you-were-looking-the')
          : c === 'library_full'
            ? t('transfer.library-view.the-library-is-full')
            : t('transfer.library-view.could-not-reach-magic-card-utils-nothing');
  }

  private async _after(done: string): Promise<void> {
    this._src.reset();
    this._edit = undefined;
    await this._load();
    this._bad = false;
    this._msg = done;
  }

  /** Focus must not fall to the page when a row button is pressed: put it on `q` inside the row once it is drawn. */
  private _fr(id: string, q: string): void {
    void this.updateComplete.then(() => (this.renderRoot as ShadowRoot).getElementById(`row-${id}-check`)?.closest('.row')?.querySelector<HTMLElement>(q)?.focus());
  }

  private async _rename(r: Row, raw: string): Promise<void> {
    const name = raw.trim();
    if (!name || name.length > 80) {
      this._bad = true;
      this._msg = t('transfer.library-view.the-name-must-be-1-to-80-characters');
      return;
    }
    try {
      const k = this._kind;
      if (k === 'animation') await this._call({ type: SAVE_ANIM, animation: { ...(r.src as object), name } });
      else if (k === 'theme') await this.presets!.save({ ...rest(r.src as SavedThemePreset), id: r.id, name } as never, (r.src as SavedThemePreset).updated_at);
      else if (k === 'image') {
        await this._ix!.rename(this.hass as never, r.id, name);
      } else {
        const full = k === 'icon' ? await this._src.getIcon(this.hass, r.id) : (r.src as SavedShape);
        if (!full) throw new Error('gone');
        const key = k === 'icon' ? 'icon' : 'shape';
        await this._call({ type: k === 'icon' ? CMD.iconsSave : CMD.shapesSave, [key]: { ...rest(full as never), id: r.id, name }, base_updated_at: (full as SavedIcon).updated_at });
      }
      await this._after(t('transfer.library-view.renamed-to-name', { name }));
      this._fr(r.id, '.acts button:nth-last-child(2)');
    } catch (e) {
      this._fail(e);
    }
  }

  /** Duplicate: the saved image again under a new name and a new id; the editor opens on it. */
  private async _duplicate(r: Row, raw: string): Promise<void> {
    const name = raw.trim();
    if (!name || name.length > 80) {
      this._bad = true;
      this._msg = t('transfer.library-view.the-name-must-be-1-to-80-characters');
      return;
    }
    try {
      const id = await this._ix!.duplicate(this.hass as never, r.id, name, (x) => this._rows.some((o) => o.id === x));
      await this._after(this._word('duplicated', { name }));
      if (this._panelCtx) this._open('image', id);
    } catch (e) {
      this._fail(e);
    }
  }

  private async _delete(r: Row): Promise<void> {
    try {
      const k = this._kind;
      if (k === 'animation') await this._call({ type: DEL_ANIM, animation_id: r.id });
      else if (k === 'theme') await this.presets!.remove(r.id);
      else if (k === 'image') await this._ix!.remove(this.hass as never, r.id);
      else await this._call(k === 'icon' ? { type: CMD.iconsDelete, icon_id: r.id } : { type: CMD.shapesDelete, shape_id: r.id });
      await this._after(t('transfer.library-view.deleted-name', { name: r.name }));
      // the row is gone: focus goes to the search field
      void this.updateComplete.then(() => (this.renderRoot as ShadowRoot).getElementById('q')?.focus());
    } catch (e) {
      this._fail(e);
    }
  }

  /** The rows as export items (selected rows, or all listed when none is selected). */
  private async _export(): Promise<void> {
    const kind = this._kind;
    const pick = this._rows.filter((r) => (this._sel.size ? this._sel.has(r.id) : true));
    const items: TransferItem[] = [];
    if (kind === 'image') {
      try {
        items.push(...((await this._ix!.exportItems(this.hass as never, pick.map((r) => r.id))) as TransferItem[]));
      } catch (e) {
        return this._fail(e);
      }
      this._panel = { mode: 'export', exportItems: { kind, items } };
      return;
    }
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
        const full = await this._src.getIcon(this.hass, r.id);
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
      this._bad = false;
      this._msg = t('transfer.library-view.added-n-to-this-card', { n: items.length });
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
        else if (kind === 'image') {
          // an id the library already holds is replaced, which the command wants named by the version it is replacing
          const old = this._rows.find((r) => r.id === it.id)?.src as ImageSummary | undefined;
          await this._ix!.save(this.hass as never, it as TransferItem<'image'>, old?.updated_at);
        } else await this._call({ type: CMD.iconsSave, icon: { ...m, ...(it.keywords ? { keywords: it.keywords } : {}), svg: d.svg, path: d.path ?? '', ...(d.secondary_path ? { secondary_path: d.secondary_path } : {}), view_box: d.view_box ?? '0 0 24 24' } });
        ok++;
      } catch (err) {
        if ((err as { code?: string })?.code === 'library_full') full++;
        else bad++;
      }
    }
    this._panel = undefined;
    if (kind === 'image') this._ix?.invalidate(items.map((i) => i.id));
    await this._after([t('transfer.library-view.imported-ok-of-total', { ok, total: items.length }), full ? t('transfer.library-view.n-did-not-fit-the-library-is-full', { n: full }) : '', bad ? t('transfer.library-view.n-could-not-be-saved', { n: bad }) : ''].filter(Boolean).join(' '));
  }

  private _closePanel = (e?: Event): void => {
    e?.stopPropagation();
    this._panel = undefined;
  };

  render(): TemplateResult {
    const q = this._q.trim().toLowerCase();
    const shown = this._rows.filter((r) => r.words.includes(q));
    const can = this._admin && this._source === 'mcu' && this._status === 'ok';
    const p = this._panel;
    const ask = (mode: 'import' | 'export', run?: () => void) => (e: MouseEvent): void => {
      this._opener = e.currentTarget as HTMLElement;
      if (run) run();
      else this._panel = { mode };
    };
    return html`
      <div class="wrap" lang=${locale()}>
        ${this._kinds.length > 1 ? seg({ role: 'tablist', label: t('transfer.library-view.kind'), value: this._kind, items: this._kinds.map((k) => ({ value: k, label: LABEL(k) })), onChange: (k) => this._go(k, this._source) }) : nothing}
        ${this._kind === 'theme' || this._kind === 'image' || this._panelCtx
          ? nothing
          : seg({
              role: 'radiogroup',
              label: t('transfer.library-view.source'),
              value: this._source,
              items: [
                { value: 'mcu' as const, label: t('transfer.library-view.magic-card-utils') },
                { value: 'card' as const, label: t('transfer.library-view.this-card') },
              ],
              onChange: (s) => this._go(this._kind, s),
            })}
        ${field({
          id: 'q',
          label: t('transfer.library-view.kind-2', { kind: this._kind }),
          control: html`<div class="with-icon"><ha-icon icon="mdi:magnify"></ha-icon><input id="q" class="input" type="search" .value=${this._q} @input=${(e: Event) => (this._q = (e.target as HTMLInputElement).value)} /></div>`,
        })}
        <div class="bar">
          ${button({ label: this._sel.size ? t('transfer.library-view.export-n-selected', { n: this._sel.size }) : this._kind === 'image' && this._ix ? this._word('export_all') : t('transfer.library-view.export-all'), icon: 'mdi:export-variant', disabled: !shown.length, onClick: (e) => ask('export', () => void this._export())(e) })}
          ${this._panelCtx && (this._kind === 'icon' || this._kind === 'shape') ? button({ label: this._kind === 'icon' ? t('transfer.library-view.new-icon') : t('transfer.library-view.new-shape'), variant: 'primary', icon: 'mdi:plus', onClick: () => this._open(this._kind as 'icon' | 'shape') }) : nothing}
          ${this._panelCtx && this._kind === 'image' && can ? button({ label: this._word('new'), variant: 'primary', icon: 'mdi:plus', onClick: () => this._open('image') }) : nothing}
          ${can || (this.inline && this._kind !== 'image') ? button({ label: t('transfer.library-view.import'), icon: 'mdi:import', onClick: ask('import') }) : nothing}
        </div>
        ${this.inline && this._source === 'card' ? html`<p class="help">${t('transfer.library-view.imported-items-are-saved-in-this-card')}</p>` : nothing}
        ${this._kind === 'image' && this._status === 'ok' && this._rows.length >= MAX_IMAGES ? html`<p class="help">${t('transfer.library-view.the-library-is-full')}</p>` : nothing}
        ${this._msg ? notice({ tone: this._bad ? 'error' : 'success', text: this._msg, transient: true }) : nothing}
        <div role="status" aria-live="polite" class="help">${this._msg ? '' : this._status === 'ok' ? count(shown.length, this._kind) : ''}</div>
        ${this._body(shown, can)}
      </div>
      ${p
        ? html`<mc-ui-window
            variant="sheet"
            heading=${p.mode === 'import' ? t('transfer.library-view.import') : t('transfer.library-view.export')}
            closeLabel=${t('transfer.library-view.close')}
            movable
            resizable
            maximizable
            moveLabel=${t('transfer.library-view.move-window')}
            resizeLabel=${t('transfer.library-view.resize-window')}
            maximizeLabel=${t('transfer.library-view.maximise')}
            restoreLabel=${t('transfer.library-view.restore-size')}
            .dismissible=${false}
            .opener=${this._opener}
            @mc-window-close=${this._closePanel}
          >
            <mc-transfer-panel
              host=${this._panelCtx ? 'mcu-panel' : 'card-editor'}
              .accept=${this._kind === 'image' ? ['image'] : HOST_KINDS[this._panelCtx ? 'mcu-panel' : 'card-editor'].filter((k) => k !== 'image')}
              .mode=${p.mode}
              .exportItems=${p.exportItems}
              .taken=${this._taken}
              .reserved=${this._reserved}
              .takenName=${this._takenName}
              .hasLibrary=${this._kind === 'theme' ? !!this.presets : this._intoCard || this._status !== 'missing'}
              @mc-transfer-import=${this._import}
              @mc-transfer-close=${this._closePanel}
            ></mc-transfer-panel>
          </mc-ui-window>`
        : nothing}
    `;
  }

  private _body(shown: Row[], can: boolean): TemplateResult {
    const s = this._status;
    if (s === 'loading') return html`<p class="help">${t('transfer.library-view.loading')}</p>`;
    if (s === 'missing' || s === 'error') {
      const older = this._kind === 'theme' ? t('transfer.library-view.update-magic-card-utils-to-keep-theme') : this._kind === 'image' ? t('transfer.library-view.images-need-magic-card-utils-it-is') : t('transfer.library-view.keep-your-own-items-on-every-dashboard');
      return empty({
        icon: 'mdi:cloud-off-outline',
        title: s === 'error' ? t('transfer.library-view.could-not-reach-magic-card-utils-your') : older,
        action: s === 'error' ? { label: t('transfer.library-view.try-again'), onClick: () => { this._src.reset(); void this._load(); } } : undefined,
      });
    }
    if (!shown.length) return empty({ icon: 'mdi:tray-remove', title: this._q ? t('transfer.library-view.kind-3', { kind: this._kind, q: this._q }) : t('transfer.library-view.kind-4', { kind: this._kind }) });
    return html`<div class="rows" role="list">${shown.map((r) => this._item(r, can))}</div>`;
  }

  private _item(r: Row, can: boolean): TemplateResult {
    const e = this._edit?.id === r.id ? this._edit.kind : undefined;
    const set = (kind: 'rename' | 'delete' | 'duplicate' | undefined) => () => {
      const back = `.acts button:nth-last-child(${this._edit?.kind === 'delete' ? 1 : this._edit?.kind === 'duplicate' ? 3 : 2})`;
      this._edit = kind ? { id: r.id, kind } : undefined;
      this._fr(r.id, kind ? (kind === 'delete' ? ':scope > button:last-child' : '.input') : back);
    };
    const edit = this._panelCtx && !e && (this._kind === 'icon' || this._kind === 'shape' || this._kind === 'image');
    const image = this._kind === 'image' ? (r.src as ImageSummary) : undefined;
    const keyed = (run: (v: string) => void) => (ev: KeyboardEvent): void => {
      if (ev.key === 'Enter') run((ev.target as HTMLInputElement).value);
      if (ev.key === 'Escape') {
        ev.stopPropagation();
        set(undefined)();
      }
    };

    const check = {
      label: t('transfer.library-view.select-name', { name: r.name }),
      checked: this._sel.has(r.id),
      onChange: (on: boolean) => {
        const n = new Set(this._sel);
        if (on) n.add(r.id);
        else n.delete(r.id);
        this._sel = n;
      },
    };
    const act = (label: string, icon: string, onClick: () => void, variant?: 'danger') => ({ label, icon, iconOnly: true as const, variant, onClick });
    const x = this.rowExtra?.(this._kind, r.id);
    const full = this._rows.length >= MAX_IMAGES;
    const typed = (ev: Event): string => (ev.currentTarget as HTMLElement).closest('.row')!.querySelector<HTMLInputElement>('.input')!.value;
    const line = image && this._ix?.row(image);
    const thumb = line?.thumb ? html`<img class="thumb" src=${line.thumb} alt="" loading="lazy" />` : undefined;
    const sub = line
      ? [r.id, line.meta].filter(Boolean).join(' · ')
      : x?.meta
        ? `${r.id} · ${x.meta}`
        : r.id;
    const input = (aria: string, value: string, run: (v: string) => void) => html`<input class="input" aria-label=${aria} .value=${value} maxlength="80" @keydown=${keyed(run)} />`;
    return row({
      id: r.id,
      name: r.name,
      sub,
      lead: thumb ?? x?.thumb,
      check,
      content:
        e === 'rename'
          ? input(t('transfer.library-view.new-name-for-name', { name: r.name }), r.name, (v) => void this._rename(r, v))
          : e === 'duplicate'
            ? input(this._word('copy_label', { name: r.name }), this._word('copy_name', { name: r.name }), (v) => void this._duplicate(r, v))
            : undefined,
      actions: [
        ...(edit ? [act(image && !this._admin ? this._word('view', { name: r.name }) : t('transfer.library-view.edit-name', { name: r.name }), image && !this._admin ? 'mdi:eye-outline' : 'mdi:pencil-outline', () => this._open(this._kind as 'icon' | 'shape' | 'image', r.id))] : []),
        ...(can && !e && image ? [{ ...act(this._word('duplicate', { name: r.name }), 'mdi:content-copy', set('duplicate')), disabled: full }] : []),
        ...(can && !e ? [act(t('transfer.library-view.rename-name', { name: r.name }), 'mdi:rename-box', set('rename')), act(t('transfer.library-view.delete-name', { name: r.name }), 'mdi:delete-outline', set('delete'), 'danger')] : []),
      ],
      trail:
        e === 'rename' || e === 'duplicate'
          ? html`${button({ label: e === 'rename' ? t('transfer.library-view.save') : this._word('create_copy'), size: 'sm', onClick: (ev) => void (e === 'rename' ? this._rename(r, typed(ev)) : this._duplicate(r, typed(ev))) })}${button({ label: t('transfer.library-view.cancel'), variant: 'text', size: 'sm', onClick: set(undefined) })}`
          : e === 'delete'
            ? html`<span class="help" role="alert">${this._kind === 'theme' ? t('transfer.library-view.delete-name-themes-you-applied-stay', { name: r.name }) : this._kind === 'image' ? this._word('delete_confirm', { name: r.name }) : t('transfer.library-view.delete-name-cards-that-use-it-keep-their', { name: r.name })}</span>
                ${button({ label: t('transfer.library-view.delete'), variant: 'danger', size: 'sm', onClick: () => void this._delete(r) })}${button({ label: t('transfer.library-view.cancel'), variant: 'text', size: 'sm', onClick: set(undefined) })}`
            : undefined,
    });
  }
}
