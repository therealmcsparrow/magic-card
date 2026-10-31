import { LitElement, html, css, nothing, PropertyValues, TemplateResult } from 'lit';
import type { PropertyDeclarations } from 'lit';
import type { SavedThemePreset, SavedThemePresetInput } from '../contracts/mcu-library';
import type { TransferItem } from '../contracts/preset-transfer';
import type { IncludeStatus, ThemeBackend, ThemeBackendError, ThemeDoc } from '../contracts/theme-editor';
import { closeDialog, deepActive, dialog, openDialog } from './dialogs';
import type { UiWindowElement } from '../contracts/ui-kit';
import { glyph } from '../ui-kit/glyphs';
import { cloneDoc } from './model';
import { base } from './styles';
import { t } from './i18n';
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

const known = (code: string): string | undefined =>
  code === 'library_full' ? t('theme-editor.preset-dialog.you-can-keep-100-presets-delete-one') : code === 'conflict' ? t('theme-editor.preset-dialog.this-preset-changed-elsewhere-reopen-the') : undefined;
const why = (e: unknown): string => {
  const x = e as ThemeBackendError;
  // only text of this editor: the server's own field messages are English and are not shown
  return known(x.code) ?? (x.code === 'invalid_format' ? t('theme-editor.preset-dialog.magic-card-utils-did-not-accept-this') : x.code === 'unauthorized' ? t('theme-editor.preset-dialog.only-administrators-can-change-presets') : t('theme-editor.preset-dialog.it-did-not-work'));
};

/**
 * <mcte-preset-dialog>: the modals of My presets (save, rename, delete) and of export / import.
 * Props `backend`, `mine`, `taken`; events `mcte-mine-changed`, `mcte-notice`, `mcte-create`.
 */
export class MctePresetDialog extends LitElement {
  static properties: PropertyDeclarations = {
    backend: { attribute: false },
    mine: { attribute: false },
    include: { attribute: false },
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
  /** Whether Home Assistant loads theme files; the import result says what to do when it does not. */
  include: IncludeStatus | undefined;
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
    if (changed.has('_done') && this._done) {
      // the result sits under the file chooser in a short window: focus it and scroll it into view
      const res = this.renderRoot.querySelector<HTMLElement>('#res');
      res?.focus({ preventScroll: true });
      res?.scrollIntoView?.({ block: 'start' });
    }
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
    const tgt = this._opts.target;
    const del = this._mode === 'delete';
    const re = this._mode === 'rename';
    const name = this._name.trim();
    if (!store) return;
    if (!del && (!name || name.length > 80)) {
      this._error = t('theme-editor.preset-dialog.enter-a-name-of-1-to-80-characters');
      return;
    }
    const d = re ? tgt?.description : this._desc.trim();
    const a = re ? tgt?.author : this._author.trim();
    const input: SavedThemePresetInput = {
      id: re ? tgt!.id : uniqueName(slugName(name) || 'preset', new Set((this.mine ?? []).map((m) => m.id))),
      name,
      doc: re ? tgt!.doc : cloneDoc(this._opts.doc ?? {}),
      ...(d ? { description: d } : {}),
      ...(a ? { author: a } : {}),
    };
    void this._run(async () =>
      del
        ? (await store.remove(tgt!.id), t('theme-editor.preset-dialog.deleted-name', { name: tgt!.name }))
        : (await store.save(input, re ? tgt!.updated_at : undefined), re ? t('theme-editor.preset-dialog.renamed-to-name', { name }) : t('theme-editor.preset-dialog.saved-name-under-my-presets', { name })),
    );
  }

  private async _import(items: TransferItem<'theme'>[]): Promise<void> {
    const store = this._store;
    if (!store) {
      // Older Magic Card Utils: one theme opens as a new, unsaved theme ("Create from file").
      if (items.length !== 1) {
        this._error = t('theme-editor.preset-dialog.update-magic-card-utils-to-keep-theme');
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
        failed.push(t('theme-editor.preset-dialog.name-reason', { name: it.name, reason: why(e) }));
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
    return html`${f('pn', t('theme-editor.preset-dialog.name'), 80, '_name')}${this._mode === 'save' ? html`${f('pd', t('theme-editor.preset-dialog.description-optional'), 280, '_desc')}${f('pa', t('theme-editor.preset-dialog.author-optional'), 80, '_author')}` : nothing}`;
  }

  private _panel(mode: 'import' | 'export'): TemplateResult {
    if (this._tx === 'loading') return html`<p class="help" role="status">${t('theme-editor.preset-dialog.loading')}</p>`;
    if (this._tx === 'error') {
      return html`<p class="help error" role="alert">${glyph('alertCircle', 16)}<span>${t('theme-editor.preset-dialog.the-tools-could-not-load-check-your')}</span></p>
        <button type="button" class="btn btn-secondary btn-sm" @click=${() => void this._loadTx()}>${t('theme-editor.preset-dialog.try-again')}</button>`;
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
    const tgt = this._opts.target;
    const go = (label: string, cls = 'btn-primary'): TemplateResult =>
      html`<button type="button" class="btn btn-secondary" @click=${() => this._close()}>${t('theme-editor.preset-dialog.cancel')}</button><button type="submit" class="btn ${cls}" aria-disabled=${this._busy ? 'true' : 'false'}>${label}</button>`;
    if (m === 'save') return { title: t('theme-editor.preset-dialog.save-as-my-preset'), body: html`${this._fields()}${this._err()}`, foot: go(t('theme-editor.preset-dialog.save-preset')) };
    if (m === 'rename') return { title: t('theme-editor.preset-dialog.rename-preset'), body: html`${this._fields()}${this._err()}`, foot: go(t('theme-editor.preset-dialog.rename')) };
    if (m === 'delete') return { title: t('theme-editor.preset-dialog.delete-name', { name: String(tgt?.name ?? '') }), body: html`<p>${t('theme-editor.preset-dialog.this-removes-it-from-my-presets-themes')}</p>${this._err()}`, foot: go(t('theme-editor.preset-dialog.delete'), 'btn-danger') };
    return { title: m === 'export' ? t('theme-editor.preset-dialog.export-theme') : t('theme-editor.preset-dialog.import-theme'), body: this._done ? this._result() : this._panel(m!), foot: nothing };
  }

  private _result(): TemplateResult {
    const { saved, failed } = this._done!;
    const one = saved.length === 1;
    const setup = !!this.include && this.include.state !== 'ok';
    return html`<h3 tabindex="-1" id="res" role="status">${saved.length ? t('theme-editor.preset-dialog.added-c-to-my-presets', { c: saved.length }) : t('theme-editor.preset-dialog.nothing-was-saved')}</h3>
      ${saved.length
        ? html`<p>${t('theme-editor.preset-dialog.these-are-presets-not-themes-on-your', { count: saved.length })}</p>
            ${setup ? html`<p class="help">${t('theme-editor.preset-dialog.saving-a-theme-needs-one-setup-step-in')}</p>` : nothing}`
        : nothing}
      ${failed.map((f) => html`<p role="alert">${f}</p>`)}
      <div class="res-foot">
        <button type="button" class="btn ${one ? 'btn-secondary' : 'btn-primary'}" @click=${() => this._close()}>${t('theme-editor.preset-dialog.close')}</button>
        ${one ? html`<button type="button" class="btn btn-primary" @click=${() => this._open(saved[0])}>${t('theme-editor.preset-dialog.open-as-new-theme')}</button>` : nothing}
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
