import { LitElement, html, css, nothing, adoptStyles, PropertyValues, TemplateResult } from 'lit';
import type { CSSResultOrNative } from 'lit';
import type { PropertyDeclarations } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { SavedThemePreset } from '../contracts/mcu-library';
import type { IncludeStatus, ReadOnlyReason, ThemeBackend, ThemeDoc, ThemeFileEntry, ThemePreset } from '../contracts/theme-editor';
import { closeDialog, dialog, openDialog } from './dialogs';
import { glyph } from '../ui-kit/glyphs';
import { cloneDoc } from './model';
import type { PickerView } from './presets/picker';
import { loadPresetLibrary, presetLibraryIfLoaded, type PresetChunk } from './presets/loader';
import { base } from './styles';
import { t } from './i18n';
import { docFromHass, fire, hassOf, nameError, slugName, uniqueName } from './util';
import './include-notice';
import './mode-switch';
import './preset-dialog';
import type { MctePresetDialog } from './preset-dialog';

const note = (t: string, id?: string): TemplateResult => html`<p class="help error" id=${ifDefined(id)} role="alert">${glyph('alertCircle', 16)}<span>${t}</span></p>`;
const skeleton = html`<div class="skel"></div><div class="skel"></div><div class="skel"></div>`;

export type StartKind = 'blank' | 'preset' | 'installed';

export interface CreateDetail {
  name: string;
  doc: ThemeDoc;
  /** What the draft was made from, for the editor's first status line. */
  from: string;
}

/** A My preset in the picker: its id gets this prefix so it can never equal a built-in id. */
const MINE = 'my:';

/** Why a theme file is read only, in a sentence (empty for a code this version does not know). */
export const reasonText = (reason: ReadOnlyReason): string => {
  switch (reason) {
    case 'subfolder':
      return t('It is in a subfolder of /config/themes.');
    case 'multiple_themes':
      return t('Its file holds several themes, and saving would rewrite all of them.');
    case 'name_mismatch':
      return t('The theme name does not match the file name.');
    case 'invalid_name':
      return t('The file name is not a name this editor can write.');
    case 'yaml_tags':
      return t('It uses Home Assistant tags such as !secret.');
    case 'parse_error':
      return t('The file could not be read as YAML.');
    case 'too_large':
      return t('The file is too large to edit here.');
    case 'symlink':
      return t('The file is a link to somewhere else.');
    default:
      return '';
  }
};

/**
 * <mcte-start-view>: the theme list and the create dialog (design 2, 3 and 16.2). Properties are
 * set by the host (`mcte-*`): `files`, `loaded`, `include`, `phase`, `error`, `hass`, `backend`.
 * Events: `mcte-open` { name }, `mcte-create` { name, doc, from }, `mcte-reload`,
 * `mcte-recheck` (from the include notice), `mcte-deleted` { name }.
 */
export class McteStartView extends LitElement {
  static properties: PropertyDeclarations = {
    files: { attribute: false },
    loaded: { attribute: false },
    include: { attribute: false },
    phase: {},
    error: {},
    hass: { attribute: false },
    backend: { attribute: false },
    mine: { attribute: false },
    checking: { type: Boolean },
    checkResult: {},
    _query: { state: true },
    _dlg: { state: true },
    _kind: { state: true },
    _preset: { state: true },
    _chunk: { state: true },
    _libState: { state: true },
    _pq: { state: true },
    _pf: { state: true },
    _installed: { state: true },
    _installedQuery: { state: true },
    _listOpen: { state: true },
    _active: { state: true },
    _modes: { state: true },
    _name: { state: true },
    _nameTouched: { state: true },
    _typedName: { state: true },
    _busy: { state: true },
    _createError: { state: true },
    _target: { state: true },
    _deleteError: { state: true },
  };

  files: ThemeFileEntry[] = [];
  loaded: string[] = [];
  include: IncludeStatus | undefined;
  phase: 'loading' | 'ready' | 'error' = 'loading';
  error = '';
  hass: unknown;
  backend: ThemeBackend | undefined;
  /** My theme presets (undefined: Magic Card Utils has none to offer). */
  mine: SavedThemePreset[] | undefined;
  checking = false;
  checkResult = '';

  private _query = '';
  private _dlg: 'create' | 'delete' | null = null;
  // create dialog
  private _kind: StartKind = 'preset';
  private _preset = '';
  private _chunk: PresetChunk | undefined;
  private _libState: 'loading' | 'ready' | 'error' = 'loading';
  private _pq = '';
  private _pf = 'all';
  private _installed = '';
  private _installedQuery = '';
  private _listOpen = false;
  private _active = 0;
  private _modes = true;
  private _name = '';
  private _nameTouched = false;
  private _typedName = false;
  private _busy = false;
  private _createError = '';
  // delete dialog
  private _target: ThemeFileEntry | null = null;
  private _deleteError = '';
  private _opener: HTMLElement | null = null;

  private get _taken(): Set<string> {
    const names = new Set<string>([...this.files.map((f) => f.name), ...this.loaded]);
    for (const k of Object.keys(hassOf(this.hass).themes?.themes ?? {})) names.add(k);
    return names;
  }

  /** Installed themes: everything HA has loaded, plus every file (so unloaded files can be copied too). */
  private get _installedNames(): Array<{ name: string; modes: boolean }> {
    const hassThemes = hassOf(this.hass).themes?.themes ?? {};
    const byName = new Map<string, boolean>();
    for (const [k, v] of Object.entries(hassThemes)) byName.set(k, !!(v as { modes?: unknown } | undefined)?.modes);
    for (const f of this.files) {
      // An unreadable file reports has_modes false whatever it holds; HA's loaded copy knows better.
      if (f.reason && byName.has(f.name)) continue;
      byName.set(f.name, f.has_modes);
    }
    return [...byName].map(([name, modes]) => ({ name, modes })).sort((a, b) => a.name.localeCompare(b.name));
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('mine') && this._chunk) {
      this._preset = this._chunk.pickerSelection(this._view(this._chunk));
      this._prefill();
    }
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has('_dlg') && this._dlg) {
      openDialog(this.renderRoot);
      if (this._dlg === 'create') this._focusCreate();
    }
  }

  // ── create dialog ──

  openCreate(opts: { kind?: StartKind; installed?: string } = {}): void {
    this._opener = (this.renderRoot.querySelector('.new') as HTMLElement | null) ?? null;
    this._kind = opts.kind ?? 'preset';
    this._preset = '';
    this._pq = '';
    this._pf = 'all';
    this._installed = opts.installed ?? '';
    this._installedQuery = opts.installed ?? '';
    this._listOpen = false;
    this._modes = true;
    this._nameTouched = false;
    this._typedName = false;
    this._createError = '';
    this._busy = false;
    this._name = '';
    this._loadLib();
    this._prefill();
    this._dlg = 'create';
  }

  /** The preset chunk loads on the first open of the dialog (and again on "Try again"). */
  private _loadLib(again = false): void {
    const cached = presetLibraryIfLoaded();
    if (cached) return this._gotLib(cached);
    this._libState = 'loading';
    loadPresetLibrary().then(
      (l) => {
        this._gotLib(l);
        // the Try again button is gone now: hand focus to the selected card, not to nothing
        if (again) void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('.pin:checked')?.focus());
      },
      () => (this._libState = 'error'),
    );
  }

  private _gotLib(c: PresetChunk): void {
    // the picker's styles come with the chunk: adopt them next to the view's own
    adoptStyles(this.renderRoot as ShadowRoot, [...(((this.constructor as typeof McteStartView).styles as unknown[]).flat(Infinity) as CSSResultOrNative[]), c.pickerStyles]);
    this._chunk = c;
    this._libState = 'ready';
    this._preset ||= this._mineCards[0]?.id ?? c.THEME_PRESET_LIBRARY.presets[0].id;
    this._prefill();
  }

  private get _mineCards(): ThemePreset[] {
    return (this.mine ?? []).map((m) => ({ id: MINE + m.id, name: m.name, blurb: m.description ?? '', group: 'mine', doc: m.doc }));
  }

  private get _sel(): ThemePreset | undefined {
    return [...this._mineCards, ...(this._chunk?.THEME_PRESET_LIBRARY.presets ?? [])].find((p) => p.id === this._preset);
  }

  /** A preset's name: a built-in one is translated by the chunk, a My preset is the user's own text. */
  private _title(p: ThemePreset): string {
    return this._chunk ? this._chunk.presetTitle(p) : String(p.name);
  }

  private get _dlgEl(): MctePresetDialog | null {
    return this.renderRoot.querySelector('mcte-preset-dialog');
  }

  /** The picker's Export (and, for My presets, Rename and Delete) of the selected preset. */
  private _act(mode: 'export' | 'rename' | 'delete', p: ThemePreset): void {
    const mine = this.mine?.find((m) => MINE + m.id === p.id);
    this._dlgEl?.open(mode, { name: this._title(p), description: mine ? mine.description : this._chunk?.presetBlurb(p), author: mine?.author, doc: p.doc, target: mine, id: mine?.id ?? p.id });
  }

  private _prefill(): void {
    if (this._typedName) return;
    const taken = this._taken;
    const seed =
      this._kind === 'preset' ? slugName(this._sel ? this._title(this._sel) : '') : this._kind === 'installed' && this._installed ? `${this._installed}_copy` : 'my-theme';
    this._name = uniqueName(slugName(seed) || 'my-theme', taken);
  }

  private _focusCreate(): void {
    // Never steal focus on touch, and not when a preset card is the main choice (the cards must stay visible).
    const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
    if (coarse || this._kind === 'preset') return;
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLInputElement>('#new-name')?.focus());
  }

  private _closeDlg(): void {
    closeDialog(this.renderRoot);
    this._dlg = null;
    this._target = null;
    (this._opener ?? (this.renderRoot.querySelector('.new') as HTMLElement | null))?.focus();
  }

  private get _nameMsg(): string {
    return nameError(this._name, this._taken);
  }

  private get _createReason(): string {
    if (this._kind === 'installed' && !this._installed) return t('Pick a theme to copy');
    if (this._kind === 'preset' && !this._sel) return this._libState === 'loading' ? t('Presets are still loading') : t('Pick a preset to start from');
    return '';
  }

  private async _create(): Promise<void> {
    if (this._busy) return;
    this._nameTouched = true;
    if (this._nameMsg) {
      this.renderRoot.querySelector<HTMLInputElement>('#new-name')?.focus();
      return;
    }
    if (this._createReason) return;
    const name = this._name;
    let doc: ThemeDoc;
    let from: string;
    if (this._kind === 'preset') {
      const p = this._sel!;
      doc = cloneDoc(p.doc);
      from = this._title(p);
    } else if (this._kind === 'blank') {
      doc = this._modes ? { modes: { light: {}, dark: {} } } : {};
      from = t('a blank theme');
    } else {
      from = this._installed;
      const file = this.files.find((f) => f.name === this._installed);
      this._busy = true;
      this._createError = '';
      try {
        const got = file && this.backend ? await this.backend.get(file.name) : undefined;
        // A non-empty theme means the file parsed, whatever the reason says (subfolder, name mismatch, ...).
        // An empty one (aliases, several themes) falls back to the copy HA loaded.
        if (got && Object.keys(got.theme ?? {}).length) doc = cloneDoc(got.theme);
        else doc = docFromHass(hassOf(this.hass).themes?.themes?.[this._installed]);
        if (!Object.keys(doc).length) {
          this._busy = false;
          this._createError = t('Could not read {name}. Neither its file nor Home Assistant has its values. Reload the themes and try again.', { name: this._installed });
          return;
        }
      } catch (e) {
        this._busy = false;
        this._createError = t('Could not read {name}. {reason}', { name: this._installed, reason: (e as Error).message ?? '' }).trim();
        return;
      }
      this._busy = false;
    }
    this._closeDlg();
    fire<CreateDetail>(this, 'mcte-create', { name, doc, from });
  }

  private _pickInstalled(name: string): void {
    this._installed = name;
    this._installedQuery = name;
    this._listOpen = false;
    this._prefill();
  }

  private _comboKey(e: KeyboardEvent, options: Array<{ name: string }>): void {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._listOpen = true;
      this._active = Math.min(options.length - 1, this._active + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this._active = Math.max(0, this._active - 1);
    } else if (e.key === 'Enter' && this._listOpen && options[this._active]) {
      e.preventDefault();
      this._pickInstalled(options[this._active].name);
    } else if (e.key === 'Escape' && this._listOpen) {
      e.stopPropagation();
      e.preventDefault();
      this._listOpen = false;
    }
  }

  private _presetPicker(): TemplateResult {
    const c = this._chunk;
    if (this._libState === 'loading') {
      return html`<div class="pl" aria-busy="true"><p class="help" aria-hidden="true">${t('Loading presets')}</p>${skeleton}</div>`;
    }
    if (!c) {
      return html`<div class="pl">
        ${note(t('Presets could not load. Check your connection and try again. If it keeps failing, reload the page.'))}
        <button type="button" class="btn btn-secondary btn-sm" @click=${() => this._loadLib(true)}>${t('Try again')}</button>
      </div>`;
    }
    return c.renderPicker(this._view(c), {
        select: (id) => ((this._preset = id), this._prefill()),
        query: (q, f) => ((this._pq = q), f && (this._pf = f), this._follow(c)),
        filter: (f) => ((this._pf = f), this._follow(c)),
        act: (m, p) => this._act(m, p),
    });
  }

  /** The selection follows the visible list, so the footer never names a preset the list does not show. */
  private _follow(c: PresetChunk): void {
    this._preset = c.pickerSelection(this._view(c));
    this._prefill();
  }

  private _view(c: PresetChunk): PickerView {
    return { lib: c.THEME_PRESET_LIBRARY, mine: this._mineCards, selected: this._preset, query: this._pq, filter: this._pf };
  }

  private _createDialog(): TemplateResult {
    const preset = this._sel;
    const q = this._installedQuery.trim().toLowerCase();
    const options = this._installedNames.filter((o) => !q || o.name.toLowerCase().includes(q) || this._installed === o.name);
    const nameMsg = this._nameTouched ? this._nameMsg : '';
    const reason = this._createReason;
    const label = this._kind === 'preset' && preset ? t('Create from {name}', { name: this._title(preset) }) : t('Create theme');
    return dialog(t('New theme'), html`<div class="grid">
          <span class="lbl" id="start-lbl">${t('Start from')}</span>
          <mcte-mode-switch
            full
            label=${t('Start from')}
            .value=${this._kind}
            .options=${[
              { value: 'preset', label: t('A preset') },
              { value: 'blank', label: t('Blank') },
              { value: 'installed', label: t('An installed theme') },
            ]}
            @mcte-change=${(e: CustomEvent) => {
              this._kind = e.detail.value as StartKind;
              this._prefill();
            }}
          ></mcte-mode-switch>
          <p class="sr-only" role="status">${this._kind !== 'preset' ? '' : this._libState === 'loading' ? t('Loading presets') : this._chunk ? this._chunk.pickerStatus(this._view(this._chunk)) : ''}</p>
          ${this._kind === 'preset' ? this._presetPicker() : nothing}
          ${this._kind === 'blank'
            ? html`<p class="help">${t('An empty theme. Add only the variables you want to change.')}</p>
                <label class="switch-row"><input type="checkbox" .checked=${this._modes} @change=${(e: Event) => (this._modes = (e.target as HTMLInputElement).checked)} /> ${t('Light and dark modes')}</label>
                <p class="help">${t('Cannot be removed later.')}</p>`
            : nothing}
          ${this._kind === 'installed'
            ? html`<div class="combo">
                <label class="lbl" for="inst">${t('Installed theme')}</label>
                <input
                  id="inst"
                  class="input"
                  role="combobox"
                  autocomplete="off"
                  aria-expanded=${this._listOpen ? 'true' : 'false'}
                  aria-controls="inst-list"
                  aria-autocomplete="list"
                  aria-activedescendant=${ifDefined(this._listOpen && options[this._active] ? `opt-${options[this._active].name}` : undefined)}
                  placeholder=${t('Search installed themes')}
                  .value=${this._installedQuery}
                  @input=${(e: Event) => {
                    this._installedQuery = (e.target as HTMLInputElement).value;
                    this._installed = '';
                    this._listOpen = true;
                    this._active = 0;
                  }}
                  @focus=${() => (this._listOpen = true)}
                  @keydown=${(e: KeyboardEvent) => this._comboKey(e, options)}
                />
                ${this._listOpen
                  ? html`<ul id="inst-list" class="list" role="listbox" aria-label=${t('Installed themes')}>
                      ${options.length
                        ? options.map(
                            (o, i) => html`<li id="opt-${o.name}" role="option" aria-selected=${this._installed === o.name ? 'true' : 'false'} class=${i === this._active ? 'act' : ''} @mousedown=${(e: Event) => (e.preventDefault(), this._pickInstalled(o.name))}>
                              <span>${o.name}</span><span class="chip">${o.modes ? t('Light + dark') : t('Same in light and dark')}</span>
                            </li>`,
                          )
                        : html`<li class="none" role="presentation">${t('No installed theme matches.')}</li>`}
                    </ul>`
                  : nothing}
                <p class="help">${t('Copies the variables from the installed theme. The original is not changed. Built-in themes expose only part of their variables.')}</p>
              </div>`
            : nothing}
          <div class="namef">
            <label class="lbl" for="new-name">${t('Name your theme')}</label>
            <input
              id="new-name"
              class="input mono"
              spellcheck="false"
              autocomplete="off"
              aria-invalid=${nameMsg ? 'true' : 'false'}
              aria-describedby="name-help"
              .value=${this._name}
              @input=${(e: Event) => ((this._name = (e.target as HTMLInputElement).value), (this._typedName = true))}
              @blur=${() => (this._nameTouched = true)}
            />
            ${nameMsg
              ? note(nameMsg, 'name-help')
              : html`<p class="help" id="name-help">${t('Lowercase letters, numbers, hyphens and underscores. Used as the file name.')}</p>`}
          </div>
          ${this._createError ? note(this._createError) : nothing}
        </div>`, html`
          ${reason ? html`<span class="help" id="why">${reason}</span>` : nothing}
          <button type="button" class="btn btn-text" @click=${() => this._closeDlg()}>${t('Cancel')}</button>
          <button type="submit" class="btn btn-primary" aria-disabled=${nameMsg || reason || this._busy ? 'true' : 'false'} aria-describedby=${ifDefined(reason ? 'why' : undefined)}>
            ${this._busy ? t('Reading...') : label}
          </button>
        `, () => (this._dlg = null), (e) => (e.preventDefault(), void this._create()), 'xl');
  }

  // ── delete ──

  private _askDelete(f: ThemeFileEntry, ev: Event): void {
    this._opener = ev.currentTarget as HTMLElement;
    this._target = f;
    this._deleteError = '';
    this._dlg = 'delete';
  }

  private async _doDelete(): Promise<void> {
    const f = this._target;
    if (!f || !this.backend) return;
    try {
      await this.backend.remove(f.name);
    } catch (e) {
      this._deleteError = t('Could not delete {name}. {reason}', { name: f.name, reason: (e as Error).message ?? '' }).trim();
      return;
    }
    const name = f.name;
    this._closeDlg();
    fire(this, 'mcte-deleted', { name });
  }

  private _deleteDialog(): TemplateResult {
    const f = this._target;
    if (!f) return html``;
    const others = this.files.filter((x) => x.file === f.file && x !== f).length;
    return dialog(
      t('Delete {name}?', { name: f.name }),
      html`<p>${others ? t('This removes /config/{file} and the other {c, plural, one {# theme} other {# themes}} in that file. Screens that use it, such as wall tablets, switch to the default theme.', { file: f.file, c: others }) : t('This removes /config/{file}. Screens that use it, such as wall tablets, switch to the default theme.', { file: f.file })}</p>
        ${this._deleteError ? note(this._deleteError) : nothing}`,
      html`<button type="button" class="btn btn-secondary" autofocus @click=${() => this._closeDlg()}>${t('Cancel')}</button>
        <button type="button" class="btn btn-danger" @click=${() => void this._doDelete()}>${t('Delete')}</button>`,
      () => (this._dlg = null),
    );
  }

  // ── list ──

  private _row(f: ThemeFileEntry): TemplateResult {
    const multi = this.files.filter((x) => x.file === f.file).length > 1;
    return html`<li class="theme-item">
      <div class="top">
        <button type="button" class="title" @click=${() => fire(this, 'mcte-open', { name: f.name })}>${f.name}</button>
        <span class="chip">${f.has_modes ? t('Light + dark') : t('Same in light and dark')}</span>
        ${f.editable ? nothing : html`<span class="chip is-warn">${t('Read only')}</span>`}
        <span class="help">${t('{c, plural, one {# variable} other {# variables}}', { c: f.var_count })}</span>
      </div>
      ${multi || !f.editable ? html`<p class="help">${t('File {file}.', { file: f.file })}${!f.editable && f.reason ? ` ${reasonText(f.reason)}` : ''}</p>` : nothing}
      <div class="acts">
        ${f.editable
          ? html`<button type="button" class="btn btn-text btn-sm" @click=${() => this.openCreate({ kind: 'installed', installed: f.name })}>${glyph('contentCopy')} ${t('Duplicate')}<span class="sr-only"> ${f.name}</span></button>
              <button type="button" class="btn btn-text btn-sm danger" @click=${(e: Event) => this._askDelete(f, e)}>${glyph('delete')} ${t('Delete')}<span class="sr-only"> ${f.name}</span></button>`
          : html`<button type="button" class="btn btn-secondary btn-sm" @click=${() => this.openCreate({ kind: 'installed', installed: f.name })}>${t('Copy to edit')}<span class="sr-only"> ${f.name}</span></button>`}
      </div>
    </li>`;
  }

  private _list(): TemplateResult {
    if (this.phase === 'loading') {
      return html`<div aria-busy="true"><p class="sr-only" role="status">${t('Loading themes')}</p>${skeleton}</div>`;
    }
    if (this.phase === 'error') {
      return html`<div class="empty" role="alert">
        <h2>${t('Themes could not be read')}</h2>
        <p>${this.error}</p>
        <button type="button" class="btn btn-secondary" @click=${() => fire(this, 'mcte-reload')}>${t('Try again')}</button>
      </div>`;
    }
    const q = this._query.trim().toLowerCase();
    const rows = [...this.files].sort((a, b) => a.name.localeCompare(b.name)).filter((f) => !q || f.name.toLowerCase().includes(q));
    if (!this.files.length) {
      return html`<div class="empty">
        <h2>${t('No themes yet')}</h2>
        <p>${this.mine?.length ? t('{n, plural, one {# preset is} other {# presets are}} saved under My presets, but a preset is not a theme yet. Choose New theme and pick it to make one.', { n: this.mine.length }) : t('Create a theme from a preset or copy one you have installed.')}</p>
        <button type="button" class="btn btn-primary" @click=${() => this.openCreate()}>${t('New theme')}</button>
      </div>`;
    }
    return html`
      ${this.files.length >= 8
        ? html`<div class="search">
            <label class="sr-only" for="q">${t('Search themes')}</label>
            <input id="q" class="input" type="search" placeholder=${t('Search themes')} .value=${this._query} @input=${(e: Event) => (this._query = (e.target as HTMLInputElement).value)} />
          </div>`
        : nothing}
      ${rows.length ? html`<ul class="theme-list">${rows.map((f) => this._row(f))}</ul>` : html`<p class="help">${t('No theme called {query}.', { query: this._query })}</p>`}
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="wrap">
        <header class="bar">
          <div>
            <h2>${t('Themes')}</h2>
            <p class="help">${t('Your themes live in /config/themes.')}</p>
          </div>
          <div class="barbtns">
            <button type="button" class="btn btn-secondary" @click=${() => this._dlgEl?.open('import', { name: '' })}>${t('Import')}</button>
            <button type="button" class="btn btn-primary new" @click=${() => this.openCreate()}>${glyph('add')} ${t('New theme')} ${glyph('chevronDown')}</button>
          </div>
        </header>
        <mcte-include-notice .status=${this.include} .checking=${this.checking} .result=${this.checkResult}></mcte-include-notice>
        ${this._list()}
      </div>
      ${this._dlg === 'create' ? this._createDialog() : this._dlg === 'delete' ? this._deleteDialog() : nothing}
      <mcte-preset-dialog .backend=${this.backend} .mine=${this.mine} .include=${this.include} .taken=${this._taken}></mcte-preset-dialog>
    `;
  }

  static styles = [
    base,
    css`
      :host {
        display: block;
        height: 100%;
        overflow: auto;
        background: var(--mc-ground);
      }
      .wrap {
        max-width: 860px;
        margin: 0 auto;
        padding: 16px;
        display: grid;
        gap: 16px;
      }
      .bar {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
        justify-content: space-between;
      }
      .barbtns {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .bar h2 {
        font-size: 1.375rem;
        font-weight: 500;
      }
      .theme-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 8px;
      }
      .theme-item {
        display: grid;
        gap: 6px;
        padding: 12px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
        background: var(--mc-surface);
      }
      .top {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 10px;
        align-items: center;
      }
      .title {
        border: 0;
        background: transparent;
        padding: 0;
        min-height: 32px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        color: var(--mc-text);
        text-align: left;
        overflow-wrap: anywhere;
      }
      .title:hover {
        text-decoration: underline;
      }
      .acts {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .danger {
        color: var(--mc-error-ink);
      }
      .skel {
        height: 76px;
        margin-bottom: 8px;
        border-radius: var(--mc-radius-lg);
        background: var(--mc-surface-2);
      }
      .grid {
        display: grid;
        gap: 12px;
      }
      .combo {
        position: relative;
        display: grid;
        gap: 4px;
      }
      .list {
        list-style: none;
        margin: 0;
        padding: 4px;
        max-height: 240px;
        overflow: auto;
        border: 1px solid var(--mc-field-border);
        border-radius: var(--mc-radius);
        background: var(--mc-surface);
      }
      .list li {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        align-items: center;
        padding: 8px;
        border-radius: 6px;
        cursor: pointer;
        min-height: 40px;
      }
      .list li.act,
      .list li[aria-selected='true'] {
        background: var(--mc-accent-tint);
      }
      .list li.none {
        cursor: default;
        color: var(--mc-text-2);
      }
      .namef {
        display: grid;
        gap: 4px;
      }
      .foot .help {
        align-self: center;
        margin-right: auto;
      }
    `,
  ];
}
