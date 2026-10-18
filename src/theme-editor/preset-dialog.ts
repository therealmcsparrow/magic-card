import { LitElement, html, css, nothing, PropertyValues, TemplateResult } from 'lit';
import type { PropertyDeclarations } from 'lit';
import type { SavedThemePreset, SavedThemePresetInput } from '../contracts/mcu-library';
import type { TransferItem } from '../contracts/preset-transfer';
import type { ThemeBackend, ThemeBackendError, ThemeDoc } from '../contracts/theme-editor';
import { closeDialog, deepActive, dialog, openDialog } from './dialogs';
import type { UiWindowElement } from '../contracts/ui-kit';
import { glyph } from '../ui-kit/glyphs';
import { cloneDoc } from './model';
import { base } from './styles';
import { fire, slugName, uniqueName } from './util';

export type PresetDlgMode = 'save' | 'rename' | 'delete' | 'import' | 'export';

export interface PresetDlgOpts {
  name?: string;
  description?: string;
  author?: string;
  doc?: ThemeDoc;
  /** The My preset to rename or delete. */
  target?: SavedThemePreset;
  /** Id of the exported item (the file's item id). */
  id?: string;
}

const MSG: Record<string, string> = {
  library_full: 'You can keep 100 presets. Delete one first.',
  conflict: 'This preset changed elsewhere. Reopen the list.',
};
const why = (e: unknown): string => {
  const x = e as ThemeBackendError;
  return x.errors?.map((f) => f.message).join(' ') || MSG[x.code] || x.message || 'It did not work.';
};

/**
 * <mcte-preset-dialog>: every modal of My presets (Save as my preset, Rename, Delete) and of export /
 * import. Export and import show <mc-transfer-panel>, which comes from the transfer chunk
 * (window.MagicCard.loadTransfer, after loadEditor). Props: `backend`, `mine` (SavedThemePreset[]),
 * `taken` (theme names already used). Events (bubbling, composed): `mcte-mine-changed`,
 * `mcte-notice` { text }, `mcte-create` { name, doc, from } (an imported theme opened as a new one).
 */
export class MctePresetDialog extends LitElement {
  static properties: PropertyDeclarations = {
    backend: { attribute: false },
    mine: { attribute: false },
    taken: { attribute: false },
    _mode: { state: true },
    _name: { state: true },
    _desc: { state: true },
    _author: { state: true },
    _busy: { state: true },
    _error: { state: true },
    _tx: { state: true },
    _done: { state: true },
  };

  backend: ThemeBackend | undefined;
  mine: SavedThemePreset[] | undefined;
  taken: ReadonlySet<string> = new Set();

  private _mode: PresetDlgMode | null = null;
  private _name = '';
  private _desc = '';
  private _author = '';
  private _busy = false;
  private _error = '';
  private _tx: 'loading' | 'ready' | 'error' = 'loading';
  private _done: { saved: TransferItem<'theme'>[]; failed: string[] } | null = null;
  private _opts: PresetDlgOpts = {};
  private _opener: HTMLElement | null = null;

  open(mode: PresetDlgMode, opts: PresetDlgOpts = {}): void {
    this._opener = deepActive();
    this._opts = opts;
    this._name = opts.name ?? '';
    this._desc = opts.description ?? '';
    this._author = opts.author ?? '';
    this._error = '';
    this._busy = false;
    this._done = null;
    this._mode = mode;
    if (mode === 'import' || mode === 'export') void this._loadTx();
  }

  private async _loadTx(): Promise<void> {
    this._tx = 'loading';
    const load = window.MagicCard?.loadTransfer as (() => Promise<unknown>) | undefined;
    try {
      if (!load) throw new Error('missing');
      await load();
      this._tx = 'ready';
    } catch {
      this._tx = 'error';
    }
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has('_done') && this._done) this.renderRoot.querySelector<HTMLElement>('#res')?.focus();
    if (changed.has('_mode') && this._mode) openDialog(this.renderRoot);
  }

  private _close(): void {
    const w = this.renderRoot.querySelector<UiWindowElement>('mc-ui-window');
    if (w?.open) closeDialog(this.renderRoot);
    else this._closed();
  }

  private _closed(): void {
    this._mode = null;
    const o = this._opener;
    if (o?.isConnected) o.focus({ preventScroll: true });
  }

  private get _store(): NonNullable<ThemeBackend['presets']> | undefined {
    return this.backend?.presets;
  }

  private async _run(fn: () => Promise<string>): Promise<void> {
    if (this._busy) return;
    this._busy = true;
    this._error = '';
    try {
      const text = await fn();
      this._close();
      fire(this, 'mcte-mine-changed');
      fire(this, 'mcte-notice', { text });
    } catch (e) {
      this._error = why(e);
    }
    this._busy = false;
  }

  /** Save as my preset, Rename (conflict check on updated_at) and Delete share this. */
  private _submit(): void {
    const store = this._store;
    const t = this._opts.target;
    const del = this._mode === 'delete';
    const re = this._mode === 'rename';
    const name = this._name.trim();
    if (!store) return;
    if (!del && (!name || name.length > 80)) {
      this._error = 'Enter a name of 1 to 80 characters.';
      return;
    }
    const d = re ? t?.description : this._desc.trim();
    const a = re ? t?.author : this._author.trim();
    const input: SavedThemePresetInput = {
      id: re ? t!.id : uniqueName(slugName(name) || 'preset', new Set((this.mine ?? []).map((m) => m.id))),
      name,
      doc: re ? t!.doc : cloneDoc(this._opts.doc ?? {}),
      ...(d ? { description: d } : {}),
      ...(a ? { author: a } : {}),
    };
    void this._run(async () => (del ? (await store.remove(t!.id), `Deleted ${t!.name}.`) : (await store.save(input, re ? t!.updated_at : undefined), re ? `Renamed to ${name}.` : `Saved ${name} under My presets.`)));
  }

  private async _import(items: TransferItem<'theme'>[]): Promise<void> {
    const store = this._store;
    if (!store) {
      // Older Magic Card Utils: one theme opens as a new, unsaved theme ("Create from file").
      if (items.length !== 1) {
        this._error = 'Update Magic Card Utils to keep theme presets. A file with one theme still opens.';
        return;
      }
      this._open(items[0]);
      return;
    }
    this._busy = true;
    const saved: TransferItem<'theme'>[] = [];
    const failed: string[] = [];
    for (const it of items) {
      const input: SavedThemePresetInput = { id: it.id, name: it.name, doc: cloneDoc(it.data) };
      if (it.description) input.description = it.description;
      if (it.author) input.author = it.author;
      try {
        await store.save(input);
        saved.push(it);
      } catch (e) {
        failed.push(`${it.name}: ${why(e)}`);
      }
    }
    this._busy = false;
    this._done = { saved, failed };
    if (saved.length) fire(this, 'mcte-mine-changed');
  }

  private _open(it: TransferItem<'theme'>): void {
    this._close();
    fire(this, 'mcte-create', { name: uniqueName(slugName(it.name) || 'imported-theme', new Set(this.taken)), doc: cloneDoc(it.data), from: it.name });
  }

  private _fields(): TemplateResult {
    const f = (id: string, label: string, max: number, k: '_name' | '_desc' | '_author'): TemplateResult =>
      html`<label class="lbl" for=${id}>${label}</label><input id=${id} class="input" maxlength=${max} .value=${this[k]} @input=${(e: Event) => ((this[k] = (e.target as HTMLInputElement).value), (this._error = ''))} />`;
    return html`${f('pn', 'Name', 80, '_name')}${this._mode === 'save' ? html`${f('pd', 'Description (optional)', 280, '_desc')}${f('pa', 'Author (optional)', 80, '_author')}` : nothing}`;
  }

  private _panel(mode: 'import' | 'export'): TemplateResult {
    if (this._tx === 'loading') return html`<p class="help" role="status">Loading...</p>`;
    if (this._tx === 'error') {
      return html`<p class="help error" role="alert">${glyph('alertCircle', 16)}<span>The tools could not load. Check your connection.</span></p>
        <button type="button" class="btn btn-secondary btn-sm" @click=${() => void this._loadTx()}>Try again</button>`;
    }
    const o = this._opts;
    const item = o.doc
      ? [{ id: o.id ?? (slugName(o.name ?? '') || 'theme'), name: o.name ?? 'theme', ...(o.description ? { description: o.description } : {}), ...(o.author ? { author: o.author } : {}), data: o.doc }]
      : [];
    return html`<mc-transfer-panel
      .host=${'theme-editor'}
      .mode=${mode}
      .exportItems=${{ kind: 'theme', items: item }}
      .taken=${(_k: string, id: string) => (this.mine ?? []).some((m) => m.id === id)}
      .hasLibrary=${true}
      @mc-transfer-close=${(e: Event) => (e.stopPropagation(), this._close())}
      @mc-transfer-import=${(e: CustomEvent) => (e.stopPropagation(), void this._import(e.detail.items))}
    ></mc-transfer-panel>${this._err()}`;
  }

  private _err(): TemplateResult | typeof nothing {
    return this._error ? html`<p class="help error" role="alert">${glyph('alertCircle', 16)}<span>${this._error}</span></p>` : nothing;
  }

  private _body(): { title: string; body: unknown; foot: unknown } {
    const m = this._mode;
    const t = this._opts.target;
    const go = (label: string, cls = 'btn-primary'): TemplateResult =>
      html`<button type="button" class="btn btn-secondary" @click=${() => this._close()}>Cancel</button><button type="submit" class="btn ${cls}" aria-disabled=${this._busy ? 'true' : 'false'}>${label}</button>`;
    if (m === 'save') return { title: 'Save as my preset', body: html`${this._fields()}${this._err()}`, foot: go('Save preset') };
    if (m === 'rename') return { title: 'Rename preset', body: html`${this._fields()}${this._err()}`, foot: go('Rename') };
    if (m === 'delete') return { title: `Delete ${t?.name}?`, body: html`<p>This removes it from My presets. Themes made from it stay.</p>${this._err()}`, foot: go('Delete', 'btn-danger') };
    return { title: m === 'export' ? 'Export theme' : 'Import theme', body: this._done ? this._result() : this._panel(m!), foot: nothing };
  }

  private _result(): TemplateResult {
    const { saved, failed } = this._done!;
    return html`<h3 tabindex="-1" id="res" role="status">${saved.length ? `Saved ${saved.length} under My presets` : 'Nothing was saved'}</h3>
      ${failed.map((f) => html`<p role="alert">${f}</p>`)}
      <div class="res-foot">
        ${saved.length === 1 ? html`<button type="button" class="btn btn-secondary" @click=${() => this._open(saved[0])}>Open as new theme</button>` : nothing}
        <button type="button" class="btn btn-primary" @click=${() => this._close()}>Close</button>
      </div>`;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._mode) return nothing;
    const { title, body, foot } = this._body();
    const submit = (e: Event): void => {
      e.preventDefault();
      this._submit();
    };
    return dialog(title, body, foot, () => this._closed(), foot === nothing ? undefined : submit, this._mode === 'import' || this._mode === 'export' ? 'l' : 'm');
  }

  static styles = [
    base,
    css`
      :host {
        display: contents;
      }
      ul {
        margin: 0;
        padding-left: 18px;
        overflow-wrap: anywhere;
      }
      h3:focus {
        outline: none;
      }
      .res-foot {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 8px;
      }
    `,
  ];
}
