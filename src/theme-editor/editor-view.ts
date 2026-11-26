import { LitElement, html, css, nothing, PropertyValues, TemplateResult } from 'lit';
import type { PropertyDeclarations } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { CatalogueGroupId } from '../contracts/theme-catalogue';
import type { SavedThemePreset } from '../contracts/mcu-library';
import type { FolderState, IncludeStatus, ThemeBackend, ThemeBackendError, ThemeDoc, ThemeMode, ThemeSaveRequest } from '../contracts/theme-editor';
import { CATALOGUE_GROUPS, entryByName, groupEntries, kindOf } from './catalogue/index';
import { glyph } from '../ui-kit/glyphs';
import { kitBlueprint } from '../ui-kit/css/blueprint';
import { DirectionController } from '../ui-kit/controllers/direction';
import { outsideOf } from './outside';
import { cloneDoc, docErrors, isDirty, previewVars, removeVar, resolveTheme, setVar, validateValue } from './model';
import type { DocError } from './model';
import { closeDialog, dialog, openDialog } from './dialogs';
import type { UiToastElement } from '../contracts/ui-kit';
import { FRAME_WIDE_MIN_PX, UI_STUDIO_FRAME_TAG } from '../contracts/studio-frame';
import type { FrameMeasure, StudioFrameElement, StudioFrameStrings } from '../contracts/studio-frame';
import { base } from './styles';
import { hasWrap } from '../i18n/pseudo-hook';
import { englishOf } from '../i18n/english-of';
import { isTranslated, legalText } from '../ui-kit/templates/legal';
import { en, locale, m, t } from './i18n';
import { fold } from '../i18n/fold';
import { getTrial, isTrialActive, startTrial, stopTrial, subscribeTrial, syncTrialMode, updateTrial, useTheme } from './trial';
import type { TrialState } from './trial';
import {
  allKeys,
  browserMode,
  copyText,
  fire,
  heldBackDoc,
  isSetAnywhere,
  openingScope,
  ownValue,
  modeList,
  scopeLabel,
  slugName,
  textContrast,
  toYaml,
} from './util';
import type { Scope } from './util';
import type { FieldCtx, FieldHint, FieldRow } from './field-group';
import type { McteRawRows } from './raw-rows';
import type { McteSaveBar, SaveReason } from './save-bar';
import './field-group';
import './preview';
import './preview-cards';
import './include-notice';
import './mode-switch';
import './preset-dialog';
import type { MctePresetDialog } from './preset-dialog';
import './raw-rows';
import './save-bar';

/** What the host hands the editor when a theme opens. */
export interface Draft {
  name: string;
  doc: ThemeDoc;
  /** The doc on disk; null for a theme that has no file yet. */
  saved: ThemeDoc | null;
  file?: string;
  mtime?: number;
  editable: boolean;
  reason?: string;
  /** Where a new draft came from ("Paper", "a blank theme"), for the first status line. */
  from?: string;
  /** (theme-files 2.0.0) The theme is saved in Magic Card Utils; false for a file-only theme. */
  stored?: boolean;
  /** (theme-files 2.0.0) Where the theme stands in /config/themes. */
  folder?: FolderState;
}

type Dlg = 'discard' | 'first-save' | 'delete' | 'add-modes' | 'yaml' | 'rename' | null;

interface Banner {
  kind: 'error' | 'warn';
  title: string;
  message: string;
  actions: Array<{ label: string; run: () => void }>;
}

/** The page variables the editor's own chrome reads; pinned while a trial runs so the chrome stays on the HA theme. */
const PIN_BASE = [
  'card-background-color',
  'secondary-background-color',
  'primary-background-color',
  'primary-text-color',
  'secondary-text-color',
  'divider-color',
  'warning-color',
  'error-color',
  'success-color',
];

interface Toast {
  text: string;
  action?: { label: string; run: () => void };
}

const CORE_GROUPS: CatalogueGroupId[] = ['primary', 'backgrounds', 'text', 'states', 'sizes', 'chrome', 'other'];
const CARD_GROUPS: CatalogueGroupId[] = ['magic-card', 'tile', 'mushroom', 'bubble-card', 'ultra-card', 'button-card'];
const TOAST_MS = 10_000;
const HINT_DELAY_MS = 800;

const clock = (): string => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/**
 * <mcte-editor-view>: one theme open for editing. It owns the draft
 * (`_doc`), the scope and the preview mode, saves through the ThemeBackend and drives the trial.
 * Events up to the host: `mcte-back`, `mcte-dirty` { dirty }, `mcte-saved` { name }, `mcte-deleted` { name },
 * `mcte-recheck` (include).
 */
export class McteEditorView extends LitElement {
  private readonly _dir = new DirectionController(this);
  static properties: PropertyDeclarations = {
    draft: { attribute: false },
    hass: { attribute: false },
    backend: { attribute: false },
    include: { attribute: false },
    writesEnabled: { attribute: false },
    storage: { attribute: false },
    mine: { attribute: false },
    checking: { type: Boolean },
    checkResult: {},
    _doc: { state: true },
    _saved: { state: true },
    _name: { state: true },
    _file: { state: true },
    _mtime: { state: true },
    _stored: { state: true },
    _folder: { state: true },
    _publishing: { state: true },
    _deleteFile: { state: true },
    _scope: { state: true },
    _mode: { state: true },
    _open: { state: true },
    _query: { state: true },
    _q: { state: true },
    _onlyChanged: { state: true },
    _drawerOpen: { state: true },
    _saving: { state: true },
    _savedAt: { state: true },
    _english: { state: true },
    _usedMsg: { state: true },
    _msg: { state: true },
    _dlg: { state: true },
    _banner: { state: true },
    _trial: { state: true },
    _touched: { state: true },
    _hints: { state: true },
    _w: { state: true },
    _h: { state: true },
    _stripOpen: { state: true },
    _menu: { state: true },
    _menuPos: { state: true },
    _rawPrefill: { state: true },
    _renameValue: { state: true },
    _renameError: { state: true },
    _dlgError: { state: true },
    _rewriteAck: { state: true },
    _previewDoc: { state: true },
    _rawPending: { state: true },
    _usedLink: { state: true },
    _reveal: { state: true },
  };

  draft!: Draft;
  hass: unknown;
  backend: ThemeBackend | undefined;
  include: IncludeStatus | undefined;
  /**
   * themes_list writes_enabled. With `storage` it only gates Save to themes folder; on an older Magic Card Utils
   * (no `storage`) it is false while the Theme files option is off and nothing saves.
   */
  writesEnabled: boolean | undefined;
  /** themes_list storage (theme-files 2.0.0): Save keeps the theme in Magic Card Utils; publishing writes the file. */
  storage = false;
  /** My theme presets, for the ids "Save as my preset" must not reuse. */
  mine: SavedThemePreset[] | undefined;
  checking = false;
  checkResult = '';

  private _doc: ThemeDoc = {};
  private _saved: ThemeDoc | null = null;
  private _name = '';
  private _file: string | undefined;
  private _mtime: number | undefined;
  private _stored = false;
  private _folder: FolderState | undefined;
  /** The save in flight writes /config/themes too. */
  private _publishing = false;
  /** Delete dialog: also remove the themes folder file. Off each time the dialog opens. */
  private _deleteFile = false;
  /** The rewrite dialog was opened by Save to themes folder. */
  private _publishAfterAck = false;
  private _scope: Scope = 'shared';
  private _mode: ThemeMode = 'light';
  private _open = new Set<string>(['primary']);
  private _query = '';
  private _q = '';
  private _onlyChanged = false;
  private _drawerOpen = false;
  private _saving = false;
  private _savedAt = '';
  private _english = false;
  private _usedMsg = '';
  private _msg = '';
  private _wasNarrow = false;
  private _dlg: Dlg = null;
  private _toastRun?: () => void;
  private _banner: Banner | null = null;
  private _trial: TrialState | null = null;
  private _touched = new Set<string>();
  private _hints = new Map<string, FieldHint>();
  private _w = 1280;
  private _h = 800;
  private _stripOpen = true;
  private _menu = false;
  private _menuPos = { top: 0, end: 0 };
  private _rawPrefill = '';
  private _renameValue = '';
  private _renameError = '';
  private _dlgError = '';
  private _rewriteAck = false;
  private _previewDoc: ThemeDoc = {};
  private _rawPending = false;
  private _usedLink = false;
  /** A variable a click on the preview showed: it stays listed while "Only changed" is on. */
  private _reveal = '';
  private _pinned = new Set<string>();

  private _ro?: ResizeObserver;
  private _strings?: { language: string; value: StudioFrameStrings };
  private _opened = false;
  private _sized = typeof ResizeObserver === 'undefined';
  private _unsub?: () => void;
  private _hintTimer?: ReturnType<typeof setTimeout>;
  private _msgTimer?: ReturnType<typeof setTimeout>;
  private _qTimer?: ReturnType<typeof setTimeout>;
  private _afterSave: 'back' | null = null;
  private _baseline: ThemeDoc = {};
  private _undo: ThemeDoc | null = null;
  private _stripVars = new Set<string>();
  private _wasDirty = false;

  // ── lifecycle ──

  connectedCallback(): void {
    super.connectedCallback();
    this._trial = getTrial();
    this._unsub = subscribeTrial((s, reason) => {
      const was = !!this._trial;
      this._trial = s;
      if (s) return;
      this._unpin();
      // The bar closed under the pointer or keyboard: put focus back where the trial was started.
      if (was && reason === 'revert') void this.updateComplete.then(() => this._focusTrialButton());
    });
    if (!this._trial) this._unpin();
    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(([e]) => {
        const r = e.contentRect;
        if (r.width) this._w = Math.round(r.width);
        this._sized = true;
        if (r.height) this._h = Math.round(r.height);
      });
      this._ro.observe(this);
    }
    this.addEventListener('keydown', this._onKey);
  }

  /** Keeps the editor's chrome on the HA theme while a trial applies the draft to the whole page. */
  private _pin(doc: ThemeDoc): void {
    const cs = getComputedStyle(this);
    for (const k of [...PIN_BASE, ...Object.keys(resolveTheme(doc, browserMode(this.hass)))]) {
      if (this._pinned.has(k)) continue;
      this._pinned.add(k);
      this.style.setProperty(`--${k}`, cs.getPropertyValue(`--${k}`).trim() || 'initial');
    }
  }

  private _unpin(): void {
    for (const k of this._pinned) this.style.removeProperty(`--${k}`);
    this._pinned.clear();
  }

  private _focusTrialButton(): void {
    const el = this.renderRoot.querySelector<HTMLElement>('.btn.try') ?? this.renderRoot.querySelector<HTMLElement>('.more');
    if (el && (!document.activeElement || document.activeElement === document.body)) el.focus();
  }

  disconnectedCallback(): void {
    this._ro?.disconnect();
    this.removeEventListener('keydown', this._onKey);
    this._unsub?.();
    for (const t of [this._hintTimer, this._msgTimer, this._qTimer]) clearTimeout(t);
    super.disconnectedCallback();
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('draft') && this.draft) this._load(this.draft);
    if (changed.has('hass') && isTrialActive() && getTrial()?.name === this._name) syncTrialMode(this._doc, this.hass);
  }

  private _load(d: Draft): void {
    this._name = d.name;
    this._doc = cloneDoc(d.doc);
    this._saved = d.saved ? cloneDoc(d.saved) : null;
    this._baseline = cloneDoc(d.saved ?? d.doc);
    this._file = d.file;
    this._mtime = d.mtime;
    this._stored = !!d.stored;
    this._folder = d.folder;
    this._mode = browserMode(this.hass);
    this._scope = openingScope(this._doc, this._mode);
    if (this._scope !== 'shared') this._mode = this._scope;
    this._open = new Set(['primary']);
    this._query = '';
    this._q = '';
    this._banner = null;
    this._savedAt = '';
    this._usedMsg = '';
    this._touched = new Set();
    this._rewriteAck = false;
    this._previewDoc = cloneDoc(d.doc);
    this._wasDirty = false;
    this._rawPending = false;
    this._usedLink = false;
    this._computeHints(true);
    if (d.from) this._say(t('theme-editor.editor-view.editing-scope-created-from-from', { scope: scopeLabel(this._scope), from: d.from }));
  }

  protected updated(changed: PropertyValues): void {
    // the footer sits outside the frame and takes the same soft-blueprint tokens
    this.setAttribute('data-bp-mode', this._scheme);
    if (changed.has('draft') && this.draft) {
      // A theme just opened (Create, a deep link): focus would otherwise be lost with the view that held it.
      void this.updateComplete.then(() => {
        if (!document.activeElement || document.activeElement === document.body) this._focus('.tname');
      });
    }
    if (changed.has('_dlg') && this._dlg) {
      openDialog(this.renderRoot);
      if (this._dlg === 'rename') this._focus('#rename');
    }
    this._syncStrip();
    let flipped = false;
    if (changed.has('hass') && !this._hasModes) {
      const before = changed.get('hass') as typeof this.hass | undefined;
      flipped = !!before && browserMode(before) !== browserMode(this.hass);
    }
    if (changed.has('_doc') || changed.has('_mode') || flipped) this._queueHints();
    if (changed.has('_doc') || changed.has('_saved') || changed.has('_baseline') || changed.has('_rawPending')) {
      const dirty = this._needsPrompt;
      if (dirty !== this._wasDirty) {
        this._wasDirty = dirty;
        fire(this, 'mcte-dirty', { dirty });
      }
    }
    // the variables drawer is open when the editor opens on a wide screen; a narrow screen starts on the preview
    if (!this._opened && this._sized && this.draft && !this._narrow && this._frame()) {
      this._opened = true;
      this._wasNarrow = this._narrow;
      this._frame()?.openDrawer(null, 'selection');
    } else if (this._opened && this._sized && this._narrow !== this._wasNarrow) {
      // the variables stay open beside the preview; narrowing into the sheet width closes them, and widening opens them again
      this._wasNarrow = this._narrow;
      if (this._narrow) this._frame()?.closeDrawer('stage');
      else this._frame()?.openDrawer(null, 'user');
    }
  }

  // ── derived ──

  private get _dirty(): boolean {
    return this._saved === null ? true : isDirty(this._saved, this._doc);
  }

  /** True when leaving would lose work worth asking about. */
  private get _needsPrompt(): boolean {
    return isDirty(this._saved ?? this._baseline, this._doc) || this._rawPending;
  }

  private get _isNew(): boolean {
    return this._saved === null;
  }

  private get _hasModes(): boolean {
    return !!this._doc.modes && Object.keys(this._doc.modes).length > 0;
  }

  /** Every readout names the mode drawn: the switch for a themed doc, else the live Home Assistant mode. */
  private get _effectiveMode(): ThemeMode {
    return this._hasModes ? this._mode : browserMode(this.hass);
  }

  private get _errors(): DocError[] {
    return docErrors(this._doc, kindOf);
  }

  /** Why Save is off. With `storage` (theme-files 2.0.0) a save stays in Magic Card Utils, so neither the folder option nor the include lines matter. */
  private get _reason(): SaveReason | null {
    if (!this.storage && this.writesEnabled === false) return { text: t('theme-editor.editor-view.saving-theme-files-is-off') };
    if (!this.draft?.editable) return { text: t('theme-editor.editor-view.this-theme-is-read-only-copy-it-to-edit') };
    if (!this.storage && this.include && this.include.state !== 'ok') return { text: t('theme-editor.editor-view.saving-is-off-until-themes-are-set-up'), action: 'recheck', actionLabel: t('theme-editor.editor-view.check-again') };
    const n = this._errors.length;
    if (n) return { text: t('theme-editor.editor-view.fix-c-to-save', { c: n }), action: 'fix', actionLabel: t('theme-editor.editor-view.show-the-first') };
    if (!this._isNew && !this._dirty) return { text: t('theme-editor.editor-view.no-changes-to-save'), quiet: true };
    return null;
  }

  /** Save to themes folder is offered: theme-files 2.0.0, the folder option on and a theme that may be published. */
  private get _canPublish(): boolean {
    return this.storage && this.writesEnabled !== false && !!this.draft?.editable && this._folder !== 'foreign';
  }

  /** Why Save to themes folder cannot run now, or null. Errors and the include lines block it; unchanged themes can still be published. */
  private get _publishReason(): SaveReason | null {
    const n = this._errors.length;
    if (n) return { text: t('theme-editor.editor-view.fix-c-to-save', { c: n }), action: 'fix', actionLabel: t('theme-editor.editor-view.show-the-first') };
    if (this.include && this.include.state !== 'ok') return { text: t('theme-editor.editor-view.saving-is-off-until-themes-are-set-up'), action: 'recheck', actionLabel: t('theme-editor.editor-view.check-again') };
    return null;
  }

  /** The delete dialog offers "Also remove the file": a stored theme with Magic Card's own file, folder option on. */
  private get _deleteFileOffered(): boolean {
    return this.storage && this._stored && this.writesEnabled !== false && (this._folder === 'current' || this._folder === 'outdated');
  }

  /** The folder state in words, for the chip and the status line. */
  private _folderText(): string {
    if (!this._stored) return t('theme-editor.editor-view.only-in-the-themes-folder');
    switch (this._folder) {
      case 'current':
        return t('theme-editor.editor-view.in-the-themes-folder');
      case 'outdated':
        return t('theme-editor.editor-view.themes-folder-copy-is-older');
      case 'foreign':
        return t('theme-editor.editor-view.another-file-in-the-themes-folder-uses');
      default:
        return t('theme-editor.editor-view.not-in-the-themes-folder');
    }
  }

  /** Narrower than the frame's wide width: the drawer is a sheet opened from the bar. */
  private get _narrow(): boolean {
    return this._w < FRAME_WIDE_MIN_PX;
  }

  private _say(text: string): void {
    this._msg = text;
    clearTimeout(this._msgTimer);
    this._msgTimer = setTimeout(() => (this._msg = ''), 5000);
  }

  // ── edits ──

  private _edit(next: ThemeDoc): void {
    // A read-only theme (several themes in one file, !secret, a subfolder) can never be saved: no edits.
    if (!this.draft.editable) return;
    this._doc = next;
    this._usedMsg = '';
    this._savedAt = '';
    this._banner = null;
    this._previewDoc = heldBackDoc(next, this._previewDoc, docErrors(next, kindOf));
    if (isTrialActive()) this._pin(next);
    updateTrial(next);
  }

  private _onSet(name: string, value: string): void {
    const mode = this._scope === 'shared' ? undefined : this._scope;
    if (value.trim() === '') {
      this._edit(removeVar(this._doc, name, mode));
      return;
    }
    this._touched = new Set(this._touched).add(name);
    this._edit(setVar(this._doc, name, value, mode));
  }

  /** A variable's label in the language, or its name when the catalogue does not know it. */
  private _labelOf(name: string): string {
    const e = entryByName(name);
    return e ? t(e.label) : name;
  }

  private _onMoveShared(name: string, value: string): void {
    this._edit(setVar(removeVar(this._doc, name, this._scope === 'shared' ? undefined : this._scope), name, value));
    this._say(t('theme-editor.editor-view.moved-label-to-shared-light-and-dark', { label: this._labelOf(name) }));
  }

  private _onReset(name: string): void {
    const label = this._labelOf(name);
    this._edit(removeVar(this._doc, name, this._scope === 'shared' ? undefined : this._scope));
    this._say(t('theme-editor.editor-view.removed-label-from-scope', { label, scope: scopeLabel(this._scope) }));
  }

  private _onSetModes(name: string, value: string, modes: ThemeMode[]): void {
    let d = this._doc;
    for (const m of modes) d = setVar(d, name, value, m);
    this._edit(d);
    this._say(t('theme-editor.editor-view.set-in-modes', { modes: modeList(modes) }));
  }

  private _onAdd(entries: Array<{ name: string; value: string }>): void {
    let d = this._doc;
    const mode = this._scope === 'shared' ? undefined : this._scope;
    for (const e of entries) {
      try {
        d = setVar(d, e.name, e.value, mode);
      } catch {
        continue; // a name that is an object internal; the raw row refuses these before it gets here
      }
      this._touched = new Set(this._touched).add(e.name);
      const group = entryByName(e.name)?.group ?? 'other';
      this._open = new Set(this._open).add(group);
    }
    this._edit(d);
    this._rawPrefill = '';
  }

  private _setScope(scope: Scope): void {
    this._scope = scope;
    if (scope !== 'shared') this._mode = scope;
  }

  private _setMode(mode: ThemeMode): void {
    this._mode = mode;
    if (this._scope !== 'shared') this._scope = mode;
  }

  private _addModes(): void {
    const d = cloneDoc(this._doc) as Record<string, unknown>;
    d.modes = { light: {}, dark: {} };
    this._edit(d as ThemeDoc);
    this._closeDlg();
    this._say(t('theme-editor.editor-view.added-light-and-dark-modes-variables-you'));
  }

  private _copyMode(from: ThemeMode, to: ThemeMode): void {
    const src = this._doc.modes?.[from] ?? {};
    const n = Object.keys(src).length;
    this._undo = cloneDoc(this._doc);
    const d = cloneDoc(this._doc);
    d.modes = { ...(d.modes ?? {}), [to]: { ...src } };
    this._edit(d);
    this._menu = false;
    this._showToast({
      text: t('theme-editor.editor-view.copied-c-from-from-to-to', { c: n, from: scopeLabel(from), to: scopeLabel(to) }),
      action: { label: t('theme-editor.editor-view.undo'), run: () => this._undoEdit() },
    });
  }

  private _undoEdit(): void {
    if (!this._undo) return;
    this._edit(this._undo);
    this._undo = null;
    this._toastEl()?.close();
  }

  // ── hints (contrast) ──

  private _queueHints(): void {
    clearTimeout(this._hintTimer);
    this._hintTimer = setTimeout(() => this._computeHints(), HINT_DELAY_MS);
  }

  private _computeHints(_now = false): void {
    const vars = resolveTheme(this._doc, this._effectiveMode);
    const hints = new Map<string, FieldHint>();
    const card = String(vars['ha-card-background'] ?? vars['card-background-color'] ?? '#ffffff');
    const stage = String(vars['lovelace-background'] ?? vars['primary-background-color'] ?? '');
    const modeName = scopeLabel(this._effectiveMode);
    const one = new Intl.NumberFormat(locale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    for (const name of ['primary-text-color', 'secondary-text-color']) {
      const text = vars[name];
      if (text === undefined) continue;
      const col = String(text);
      if (/^var\(/i.test(col) || !col.trim()) continue;
      const r = /gradient\(/i.test(card) ? 'transparent' : textContrast(col, card, stage);
      if (r === null) continue;
      if (r === 'transparent') hints.set(name, { text: t('theme-editor.editor-view.contrast-not-checked-value-has'), ok: null });
      else {
        const ratio = one.format(r.ratio);
        hints.set(name, {
          text: r.ok ? t('theme-editor.editor-view.contrast-on-card-mode-ratio-to-1-easy-to', { mode: modeName, ratio }) : t('theme-editor.editor-view.contrast-on-card-mode-ratio-to-1-hard-to', { mode: modeName, ratio }),
          ok: r.ok,
        });
      }
    }
    this._hints = hints;
  }

  // ── the live strip (below 1024 px) ──

  private _syncStrip(): void {
    const el = this.renderRoot.querySelector<HTMLElement>('.strip-sample');
    if (!el) return;
    const vars = previewVars(this._previewDoc, this._effectiveMode);
    const next = new Set<string>();
    for (const [k, v] of Object.entries(vars)) {
      if (!k.startsWith('rgb-') && validateValue(kindOf(k) ?? 'text', v) !== null) continue;
      el.style.setProperty(`--${k}`, v);
      next.add(k);
    }
    for (const k of this._stripVars) if (!next.has(k)) el.style.removeProperty(`--${k}`);
    this._stripVars = next;
  }

  // ── search and groups ──

  private _search(value: string): void {
    this._query = value;
    clearTimeout(this._qTimer);
    this._qTimer = setTimeout(() => (this._q = value.trim().toLowerCase()), 120);
  }

  private _rowsFor(id: CatalogueGroupId, seen: Set<string>): FieldRow[] {
    let rows: FieldRow[];
    if (id === 'other') {
      rows = allKeys(this._doc)
        .filter((k) => !entryByName(k))
        .map((k) => ({
          entry: { name: k, group: 'other' as const, source: 'ha' as const, kind: 'text' as const },
          follows: false,
          custom: true as const,
        }));
    } else {
      rows = groupEntries(id).map((r) => ({ entry: r.entry, follows: r.follows }));
    }
    rows = rows.filter((r) => !seen.has(r.entry.name));
    for (const r of rows) seen.add(r.entry.name);
    const q = this._q;
    return rows.filter((r) => {
      if (this._onlyChanged && !this._isModified(r.entry.name) && r.entry.name !== this._reveal) return false;
      if (!q) return true;
      const value = String(ownValue(this._doc, this._scope, r.entry.name) ?? ownValue(this._doc, 'shared', r.entry.name) ?? '').toLowerCase();
      return r.entry.name.toLowerCase().includes(q) || fold(r.custom ? r.entry.name : t(r.entry.label)).includes(fold(q)) || value.includes(q);
    });
  }

  private _toggle(id: string): void {
    const next = new Set(this._open);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this._open = next;
  }

  private _jumpToFirstError(): void {
    const e = this._errors[0];
    if (!e) return;
    const parts = e.path.replace(/^theme\./, '').split('.');
    const scope: Scope = parts[0] === 'modes' ? ((parts[1] as ThemeMode) ?? 'shared') : 'shared';
    const name = parts[0] === 'modes' ? parts.slice(2).join('.') : parts.join('.');
    this._setScope(scope);
    this._showVar(name);
  }

  /**
   * Opens the variables panel on one variable and focuses its field: clears the search and "Only changed", opens its group.
   * `group:<id>` opens and shows a whole group instead (a card sample on the preview).
   */
  private _showVar(target: string): void {
    const groupOnly = target.startsWith('group:');
    const name = groupOnly ? '' : target;
    const group = groupOnly ? (target.slice(6) as CatalogueGroupId) : (entryByName(name)?.group ?? 'other');
    if (!CATALOGUE_GROUPS.some((g) => g.id === group)) return;
    this._query = '';
    this._q = '';
    this._reveal = name;
    this._open = new Set(this._open).add(group);
    this._frame()?.openDrawer(null, 'user');
    void this.updateComplete.then(() => {
      const g = this.renderRoot.querySelector<HTMLElement & { focusField(n: string): void }>(`mcte-field-group[data-id="${group}"]`);
      if (!g) return;
      g.scrollIntoView({ block: 'start', behavior: 'smooth' });
      if (!name) return;
      void (g as unknown as LitElement).updateComplete?.then(() => {
        g.shadowRoot?.querySelector(`#f-${CSS.escape(name)}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        g.focusField(name);
      });
    });
  }

  // ── toast ──

  private _toastEl(): UiToastElement | null {
    return this.renderRoot.querySelector<UiToastElement>('mc-ui-toast');
  }

  private _showToast(t: Toast): void {
    this._toastRun = t.action?.run;
    this._toastEl()?.show({ text: t.text, action: t.action && { id: 'action', label: t.action.label }, duration: TOAST_MS });
  }

  // ── dialogs ──

  private _openDlg(d: Dlg): void {
    this._menu = false;
    this._dlgError = '';
    this._dlg = d;
  }

  private _closeDlg(): void {
    closeDialog(this.renderRoot);
    this._dlg = null;
  }

  // ── leaving ──

  private _back(): void {
    if (this._needsPrompt) {
      this._openDlg('discard');
      return;
    }
    // Nothing to lose: leaving also ends a trial of this theme, so no Revert bar is left behind.
    if (isTrialActive() && getTrial()?.name === this._name) stopTrial('discard');
    this._leave();
  }

  private _leave(): void {
    fire(this, 'mcte-back');
  }

  private _discard(): void {
    if (isTrialActive() && getTrial()?.name === this._name) stopTrial('discard');
    this._closeDlg();
    this._leave();
  }

  // ── save ──

  /** Save pressed while it is off: say why and take the user to the cause (a tap has no hover). */
  private _explainBlocked(r: SaveReason | null = this._reason): void {
    this._afterSave = null;
    if (!r) return;
    if (r.action === 'fix') {
      this._jumpToFirstError();
      return;
    }
    this._say(r.text);
    if (r.action === 'recheck') {
      this._frame()?.openDrawer(null, 'user');
      void this.updateComplete.then(() => this.renderRoot.querySelector('mcte-include-notice')?.scrollIntoView({ block: 'nearest' }));
    }
  }

  private _rawRows(): McteRawRows | null {
    return this.renderRoot.querySelector<McteRawRows>('mcte-raw-rows');
  }

  /** A half-filled "Add any variable" row would be lost by a save: warn first instead. */
  private _warnRawPending(publish = false): void {
    this._afterSave = null;
    const dismiss = { label: t('theme-editor.editor-view.cancel'), run: () => this._dismiss() };
    this._showBanner({
      kind: 'warn',
      title: t('theme-editor.editor-view.a-variable-is-typed-but-not-added'),
      message: t('theme-editor.editor-view.the-add-any-variable-row-still-holds'),
      actions: [
        { label: t('theme-editor.editor-view.add-it-and-save'), run: () => void this._addPendingAndSave(publish) },
        { label: t('theme-editor.editor-view.save-without-it'), run: () => ((this._banner = null), void (publish ? this._publishClick(true) : this._saveClick(true))) },
        dismiss,
      ],
    });
  }

  private _focus(sel: string): void {
    this.renderRoot.querySelector<HTMLElement>(sel)?.focus();
  }

  /** The banner lives in the Variables panel, a closed sheet on a narrow screen: open it, then focus the banner title. */
  private _showBanner(b: Banner): void {
    const f = this._frame();
    this._banner = b;
    f?.openDrawer();
    // after the frame's own render, which focuses the sheet's close button
    void this.updateComplete
      .then(() => (f as Partial<LitElement> | null)?.updateComplete)
      .then(() => this._focus('.banner .title'));
  }

  /** Dismiss removes the focused button, so focus goes back to Save; closing a sheet hands focus back to what opened it. */
  private _dismiss(): void {
    const f = this._frame();
    this._banner = null;
    if (f?.narrow && f.drawerOpen) f.closeDrawer();
    else void this.updateComplete.then(() => this.renderRoot.querySelector<McteSaveBar>('mcte-save-bar')?.focusSave());
  }

  private get _dismissAct(): Banner['actions'][number] {
    return { label: t('theme-editor.editor-view.dismiss'), run: () => this._dismiss() };
  }

  private async _addPendingAndSave(publish = false): Promise<void> {
    this._banner = null;
    if (!this._rawRows()?.addPending()) return;
    await this.updateComplete;
    await (publish ? this._publishClick() : this._saveClick());
  }

  private async _saveClick(skipRaw = false): Promise<void> {
    if (this._saving) return;
    if (this._reason) {
      this._explainBlocked();
      return;
    }
    if (!skipRaw && this._rawRows()?.hasPending) {
      this._warnRawPending();
      return;
    }
    // Before theme-files 2.0.0 every save rewrites the file; with storage only Save to themes folder does.
    if (!this.storage && !this._isNew && this._file && !this._rewriteAck) {
      this._publishAfterAck = false;
      this._openDlg('first-save');
      return;
    }
    await this._doSave();
  }

  /** Save to themes folder (theme-files 2.0.0): saves the theme in Magic Card Utils and writes /config/themes/<name>.yaml. */
  private async _publishClick(skipRaw = false): Promise<void> {
    this._menu = false;
    if (this._saving || !this._canPublish) return;
    const r = this._publishReason;
    if (r) {
      this._explainBlocked(r);
      return;
    }
    if (!skipRaw && this._rawRows()?.hasPending) {
      this._warnRawPending(true);
      return;
    }
    if ((this._folder === 'current' || this._folder === 'outdated') && !this._rewriteAck) {
      this._publishAfterAck = true;
      this._openDlg('first-save');
      return;
    }
    await this._doSave(false, true);
  }

  private async _doSave(anyway = false, publish = false): Promise<boolean> {
    if (!this.backend || this._saving) return false;
    const snap = cloneDoc(this._doc);
    this._saving = true;
    this._publishing = publish;
    this._banner = null;
    try {
      const req: ThemeSaveRequest = { name: this._name, theme: snap, overwrite: !this._isNew, base_mtime: anyway ? undefined : this._mtime };
      if (publish) req.publish = true;
      const res = await this.backend.save(req);
      this._saved = snap;
      this._baseline = snap;
      this._mtime = res.mtime;
      this._file = res.file;
      this._savedAt = clock();
      this._usedMsg = '';
      if (this.storage) {
        this._stored = true;
        this._folder = res.folder ?? this._folder;
      }
      // the file was rewritten (or every save rewrites it): no need to ask again
      const wroteFile = !this.storage || !!res.published;
      if (wroteFile) this._rewriteAck = true;
      if (isTrialActive()) stopTrial('saved');
      // The header's status row shows "Saved hh:mm" and "Use this theme"; this is for screen readers.
      this._say(
        !wroteFile
          ? t('theme-editor.editor-view.saved-name-in-magic-card-utils', { name: this._name })
          : res.loaded
            ? t('theme-editor.editor-view.saved-name-and-reloaded-themes-screens', { name: this._name })
            : t('theme-editor.editor-view.saved-name', { name: this._name }),
      );
      if (wroteFile && !res.loaded) {
        this._banner = {
          kind: 'warn',
          title: t('theme-editor.editor-view.saved-file-but-home-assistant-does-not', { file: res.file, name: this._name }),
          message: t('theme-editor.editor-view.reload-themes-in-developer-tools-yaml-or'),
          actions: [this._dismissAct],
        };
      }
      fire(this, 'mcte-saved', { name: this._name });
      this._saving = false;
      this._publishing = false;
      if (this._afterSave === 'back') {
        this._afterSave = null;
        this._leave();
      }
      return true;
    } catch (e) {
      this._saving = false;
      this._publishing = false;
      this._afterSave = null;
      this._showBanner(this._saveBanner(e as ThemeBackendError, publish));
      return false;
    }
  }

  private _saveBanner(err: ThemeBackendError, publish = false): Banner {
    const name = this._name;
    const dismiss = this._dismissAct;
    const retry = { label: t('theme-editor.editor-view.try-again'), run: () => void (publish ? this._publishClick() : this._saveClick()) };
    const failed = t('theme-editor.editor-view.could-not-save-name', { name });
    switch (err.code) {
      case 'conflict':
        return {
          kind: 'warn',
          title: this.storage ? t('theme-editor.editor-view.name-changed-since-you-opened-it', { name }) : t('theme-editor.editor-view.name-yaml-changed-on-disk', { name }),
          message: t('theme-editor.editor-view.this-file-changed-since-you-opened-it'),
          actions: [
            { label: t('theme-editor.editor-view.reload'), run: () => void this._reload() },
            { label: t('theme-editor.editor-view.save-anyway'), run: () => void this._doSave(true, publish) },
          ],
        };
      case 'name_taken':
        return {
          kind: 'error',
          title: failed,
          message: err.message || t('theme-editor.editor-view.a-theme-with-this-name-already-exists'),
          actions: this._isNew ? [{ label: t('theme-editor.editor-view.choose-another-name'), run: () => this._openRename() }, dismiss] : [dismiss],
        };
      case 'themes_not_included':
        fire(this, 'mcte-recheck');
        return {
          kind: 'error',
          title: failed,
          message: t('theme-editor.editor-view.home-assistant-does-not-load-config'),
          actions: [dismiss],
        };
      case 'unauthorized':
        return { kind: 'error', title: failed, message: t('theme-editor.editor-view.only-administrators-can-edit-themes'), actions: [dismiss] };
      case 'theme_files_off':
        return { kind: 'error', title: failed, message: this.storage ? t('theme-editor.editor-view.theme-folder-off-message') : t('theme-editor.editor-view.theme-files-off-message'), actions: [dismiss] };
      case 'not_editable':
        return { kind: 'error', title: failed, message: t('theme-editor.editor-view.this-editor-only-changes-its-own-files'), actions: this._isNew ? [{ label: t('theme-editor.editor-view.choose-another-name'), run: () => this._openRename() }, dismiss] : [dismiss] };
      case 'too_large':
        return { kind: 'error', title: failed, message: t('theme-editor.editor-view.magic-card-utils-has-no-room-for-this-theme'), actions: [dismiss] };
      case 'invalid_format': {
        const first = err.errors?.[0];
        const nameErr = err.errors?.find((x) => x.path === 'name');
        return {
          kind: 'error',
          title: failed,
          message: first ? t('theme-editor.editor-view.path-message', { path: first.path.replace(/^theme\./, ''), message: first.message }) : err.message,
          actions: nameErr && this._isNew ? [{ label: t('theme-editor.editor-view.choose-another-name'), run: () => this._openRename() }, dismiss] : [dismiss],
        };
      }
      default:
        return {
          kind: 'error',
          title: failed,
          message: /lost|closed|connection/i.test(err.message ?? '') ? t('theme-editor.editor-view.the-connection-to-home-assistant-was') : (err.message ?? ''),
          actions: [retry, dismiss],
        };
    }
  }

  private async _reload(): Promise<void> {
    if (!this.backend) return;
    try {
      const r = await this.backend.get(this._name);
      this._doc = cloneDoc(r.theme);
      this._saved = cloneDoc(r.theme);
      this._baseline = cloneDoc(r.theme);
      this._previewDoc = cloneDoc(r.theme);
      this._mtime = r.mtime;
      if (this.storage) {
        this._stored = !!r.stored;
        this._folder = r.folder;
      }
      this._banner = null;
      this._say(t('theme-editor.editor-view.reloaded-the-file-from-disk'));
    } catch (e) {
      this._banner = { kind: 'error', title: t('theme-editor.editor-view.could-not-read-name', { name: this._name }), message: (e as Error).message, actions: [this._dismissAct] };
    }
  }

  private _openRename(): void {
    this._renameValue = this._name;
    this._renameError = '';
    this._openDlg('rename');
  }

  private _applyRename(): void {
    const v = this._renameValue.trim();
    if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(v) || v === 'default' || v === 'backend-selected') {
      this._renameError = t('theme-editor.editor-view.use-lowercase-letters-numbers-hyphens');
      return;
    }
    this._name = v;
    this._closeDlg();
    this._banner = null;
    fire(this, 'mcte-rename', { name: v });
    this._say(t('theme-editor.editor-view.named-the-theme-name-press-save-to-write', { name: v }));
  }

  private _use(): void {
    const ok = useTheme(this._name);
    this._usedLink = !ok;
    this._usedMsg = ok ? t('theme-editor.editor-view.now-using-name-for-your-user', { name: this._name }) : t('theme-editor.editor-view.pick-name-in-your-profile-to-use-it', { name: this._name });
    this._toastEl()?.close();
  }

  private async _delete(): Promise<void> {
    if (!this.backend) return;
    try {
      // theme-files 2.0.0: a stored theme keeps its file unless the box is ticked; a file-only theme is a file
      const file = this.storage && (!this._stored || (this._deleteFileOffered && this._deleteFile));
      await this.backend.remove(this._name, file ? { file: true } : undefined);
    } catch (e) {
      this._dlgError = t('theme-editor.editor-view.could-not-delete-name-reason', { name: this._name, reason: (e as Error).message ?? '' }).trim();
      return;
    }
    if (isTrialActive() && getTrial()?.name === this._name) stopTrial('discard');
    const name = this._name;
    this._closeDlg();
    fire(this, 'mcte-deleted', { name });
  }

  // ── trial ──

  private _toggleTrial(): void {
    this._menu = false;
    if (isTrialActive()) {
      stopTrial('revert');
      return;
    }
    this._pin(this._doc);
    startTrial({ name: this._name, doc: this._doc, hass: this.hass, baseline: this._baseline });
  }

  // ── keyboard ──

  private _onKey = (e: KeyboardEvent): void => {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === '\\' || e.code === 'Backslash') && !e.repeat) {
      e.preventDefault();
      this._toggleDrawer();
      return;
    }
    const inDialog = e.composedPath().some((n) => n instanceof HTMLDialogElement);
    if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 's' && !inDialog) {
      e.preventDefault();
      void this._saveClick();
      return;
    }
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !inDialog) {
      const t = e.composedPath()[0] as HTMLElement | undefined;
      const editing = t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable);
      if (editing) return;
      e.preventDefault();
      this._focus('#vsearch');
      return;
    }
    if (e.key === 'Escape' && this._menu) {
      this._menu = false;
      this._focus('.more');
    }
  };

  private _menuKey(e: KeyboardEvent): void {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = [...this.renderRoot.querySelectorAll<HTMLElement>('.menu [role="menuitem"]')];
    const at = items.indexOf(e.composedPath()[0] as HTMLElement);
    items[(at + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
  }

  /** Opens the My presets / export dialog from the More menu; focus goes back to the More button. */
  private _presetDlg(mode: 'save' | 'export'): void {
    this._menu = false;
    const el = this.renderRoot.querySelector<MctePresetDialog>('mcte-preset-dialog');
    this._focus(mode === 'save' && this._w >= 900 ? '.savepreset' : '.more');
    el?.open(mode, { name: this._name, doc: this._doc, id: slugName(this._name) || 'theme' });
  }

  private _copyKey(text: string): void {
    void copyText(text).then(() => this._say(t('theme-editor.editor-view.copied-key-text', { text })));
  }

  // ── render: pieces ──

  private _chips(): TemplateResult {
    const dirtyChip = this._isNew
      ? html`<span class="chip is-warn">${t('theme-editor.editor-view.new-not-saved')}</span>`
      : this._dirty
        ? html`<span class="chip is-warn">${t('theme-editor.editor-view.unsaved-changes')}</span>`
        : nothing;
    const n = this._errors.length;
    return html`${dirtyChip}
    ${this._trial ? html`<span class="chip is-accent">${t('theme-editor.editor-view.trying-on-this-tab')}</span>` : nothing}
    ${!this.draft.editable ? html`<span class="chip is-warn">${t('theme-editor.editor-view.read-only')}</span>` : nothing}
    ${this.storage && this.draft.editable && !this._isNew ? html`<span class="chip folder" data-folder=${this._stored ? (this._folder ?? 'none') : 'only'}>${this._folderText()}</span>` : nothing}
    ${n ? html`<button type="button" class="chip is-warn" @click=${() => this._jumpToFirstError()}>${t('theme-editor.editor-view.c-a-fix', { c: n })}</button>` : nothing}`;
  }

  private _tryHelp(): string {
    return t('theme-editor.editor-view.applies-to-this-browser-tab-only-open-a', { mode: browserMode(this.hass) });
  }

  private _tryTip(): string {
    const other = browserMode(this.hass) === 'dark' ? 'light' : 'dark';
    return t('theme-editor.editor-view.help-the-revert-button-stays-at-the-edge', { help: this._tryHelp(), other });
  }

  private _tryButton(inMenu = false): TemplateResult {
    const on = !!this._trial;
    return html`<button
      type="button"
      class=${inMenu ? 'mi' : 'btn btn-secondary try'}
      role=${inMenu ? 'menuitem' : 'button'}
      aria-pressed=${ifDefined(inMenu ? undefined : on ? 'true' : 'false')}
      aria-describedby="try-help"
      title=${this._tryTip()}
      @click=${() => this._toggleTrial()}
    >
      ${glyph('eyeOn', 18)} ${on ? t('theme-editor.editor-view.stop-trying') : t('theme-editor.editor-view.try-on-dashboard')}
    </button>`;
  }

  /** The bar clips what hangs out of it, so the menu is fixed to the viewport, under its button. */
  private _toggleMenu(button: HTMLElement): void {
    if (!this._menu) {
      const r = button.getBoundingClientRect();
      const rtl = getComputedStyle(this).direction === 'rtl';
      this._menuPos = { top: Math.round(r.bottom + 4), end: Math.max(0, Math.round(rtl ? r.left : window.innerWidth - r.right)) };
    }
    this._menu = !this._menu;
  }

  private _menuEl(): TemplateResult {
    const compact = this._w < 768;
    // theme-files 2.0.0: a stored theme can always be deleted; a file-only one only while the folder option is on
    const canDelete = this.storage
      ? !this._isNew && this.draft.editable && (this._stored || this.writesEnabled !== false)
      : !this._isNew && !!this._file && this.draft.editable;
    return html`<div class="menuwrap" @focusout=${(e: FocusEvent) => {
      if (this._menu && !(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null)) this._menu = false;
    }}>
      <button type="button" class="icon-btn more" aria-label=${t('theme-editor.editor-view.more-actions')} aria-haspopup="menu" aria-expanded=${this._menu ? 'true' : 'false'} @click=${(e: Event) => this._toggleMenu(e.currentTarget as HTMLElement)}>
        ${glyph('dotsHorizontal')}
      </button>
      ${this._menu
        ? html`<div class="menu" role="menu" style="inset-block-start: ${this._menuPos.top}px; inset-inline-end: ${this._menuPos.end}px" aria-label=${t('theme-editor.editor-view.more-actions')} @keydown=${this._menuKey}>
            ${compact ? html`${this._tryButton(true)}<p class="help tryhelp-menu" id="try-help">${this._tryHelp()}</p>` : nothing}
            ${this._w < 900 && this.backend?.presets ? html`<button type="button" role="menuitem" @click=${() => this._presetDlg('save')}>${t('theme-editor.editor-view.save-as-my-preset')}</button>` : nothing}
            <button type="button" role="menuitem" @click=${() => this._presetDlg('export')}>${t('theme-editor.editor-view.export-theme')}</button>
            <button type="button" role="menuitem" @click=${() => this._openDlg('yaml')}>${t('theme-editor.editor-view.show-yaml')}</button>
            <button type="button" role="menuitem" @click=${() => void copyText(toYaml(this._name, this._doc)).then(() => (this._say(t('theme-editor.editor-view.copied-yaml')), (this._menu = false)))}>${t('theme-editor.editor-view.copy-yaml')}</button>
            ${this._hasModes && this.draft.editable
              ? html`<button type="button" role="menuitem" @click=${() => this._copyMode('light', 'dark')}>${t('theme-editor.editor-view.copy-light-to-dark')}</button>
                  <button type="button" role="menuitem" @click=${() => this._copyMode('dark', 'light')}>${t('theme-editor.editor-view.copy-dark-to-light')}</button>`
              : nothing}
            ${canDelete ? html`<button type="button" role="menuitem" class="danger" @click=${() => ((this._deleteFile = false), this._openDlg('delete'))}>${t('theme-editor.editor-view.delete-theme')}</button>` : nothing}
          </div>`
        : nothing}
    </div>`;
  }

  /** One status row under the controls: why Save is off, the saved line and what "Use this theme" did. Its height is reserved so nothing below it moves. */
  private _statusLine(): TemplateResult {
    const r = this._reason;
    const showReason = r && !this._saving && !(r.quiet && this._savedAt);
    const showSaved = this._savedAt && (!r || r.quiet);
    return html`<div class="line">
      ${showReason
        ? html`<span class="help reason">${r.text}</span>${r.action
            ? html`<button type="button" class="btn btn-text btn-sm" @click=${() => (r.action === 'fix' ? this._jumpToFirstError() : fire(this, 'mcte-recheck'))}>${r.actionLabel}</button>`
            : nothing}`
        : nothing}
      ${showSaved
        ? html`<span class="help saved" role="status">${t('theme-editor.editor-view.saved-time', { time: this._savedAt })}</span>
            ${!this.storage || this._folder === 'current'
              ? html`<button type="button" class="btn btn-text btn-sm" @click=${() => this._use()}>${t('theme-editor.editor-view.use-this-theme')}</button>`
              : nothing}`
        : nothing}
      ${this._usedMsg
        ? html`<span class="help" role="status">${this._usedMsg}</span>${this._usedLink ? html`<a class="btn btn-text btn-sm" href="/profile">${t('theme-editor.editor-view.open-your-profile')}</a>` : nothing}`
        : nothing}
    </div>`;
  }

  /** Why the bar's Save to themes folder is off, or null. */
  private get _publishOffReason(): string | null {
    if (this.writesEnabled === false) return t('theme-editor.editor-view.theme-folder-off-message');
    if (this._folder === 'foreign') return t('theme-editor.editor-view.another-file-in-the-themes-folder-uses');
    return null;
  }

  /** Save to themes folder in the bar: aria-disabled while off, so it stays focusable and says why. */
  private _publishButton(compact: boolean): TemplateResult | typeof nothing {
    if (!this.storage || !this.draft?.editable) return nothing;
    const name = t('theme-editor.editor-view.save-to-themes-folder');
    const why = this._publishOffReason;
    const off = why !== null || this._saving;
    const press = () => {
      if (why !== null) {
        this._showBanner({ kind: 'warn', title: name, message: why, actions: [this._dismissAct] });
        return;
      }
      void this._publishClick();
    };
    return html`<button
        type="button"
        class=${compact ? 'icon-btn publish' : 'btn btn-secondary btn-sm publish'}
        data-publish
        aria-disabled=${off ? 'true' : 'false'}
        aria-busy=${this._saving ? 'true' : nothing}
        aria-label=${ifDefined(compact ? name : undefined)}
        title=${why ?? (compact ? name : nothing)}
        aria-describedby=${ifDefined(why ? 'publish-why' : undefined)}
        @click=${press}
      >
        ${compact ? glyph('folderOpenOutline') : name}
      </button>${why ? html`<span class="sr-only" id="publish-why">${why}</span>` : nothing}`;
  }

  /** The bar of the frame: Back, the theme and its state, the trial and preset buttons, the drawer toggle, Save and the more menu. */
  private _bar(): TemplateResult {
    const compact = this._w < 768;
    const label = t('theme-editor.lips.variables-panel');
    const keys = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘\\' : 'Ctrl+\\';
    const noun = t('theme-editor.lips.variables');
    const title = `${(this._drawerOpen ? t('theme-editor.lips.hide-noun-keys', { noun, keys }) : t('theme-editor.lips.show-noun-keys', { noun, keys }))} - ${t('theme-editor.lips.shortcut-keys', { keys })}`;
    return html`<header class="fr-bar" slot="top" aria-label=${t('theme-editor.editor-view.editor-panels')}>
      <button type="button" class="btn btn-text btn-sm back" @click=${() => this._back()}>${glyph('arrowLeft')} <span class="back-label">${t('theme-editor.editor-view.themes')}</span></button>
      <span class="vr" aria-hidden="true"></span>
      ${this._w < 1100 ? nothing : html`<strong class="studio-title">${t('theme-editor.editor-view.theme-editor')}</strong>`}
      <h2 class="tname" tabindex="-1">${this._name}</h2>
      <div class="chips">${this._chips()}</div>
      <span class="spacer"></span>
      ${this._viewControls(this._w < 1100)}
      <div class="grp">
        ${this.backend?.presets && this._w >= 900 ? html`<button type="button" class="btn btn-secondary btn-sm savepreset" @click=${() => this._presetDlg('save')}>${t('theme-editor.editor-view.save-as-my-preset')}</button>` : nothing}
        ${compact ? nothing : this._tryButton()}
        <mcte-save-bar .reason=${this._reason} .saving=${this._saving} ?show-shortcut=${true} @mcte-save=${() => void this._saveClick()}></mcte-save-bar>
        ${this._publishButton(compact)}
        <button
          type="button"
          class="icon-btn vars-toggle"
          aria-controls="vars"
          aria-expanded=${this._drawerOpen ? 'true' : 'false'}
          aria-haspopup=${this._narrow ? 'dialog' : nothing}
          aria-label=${label}
          aria-keyshortcuts=${keys.startsWith('Ctrl') ? 'Control+Backslash' : 'Meta+Backslash'}
          title=${title}
          @click=${(e: Event) => this._toggleDrawer(e.currentTarget as HTMLElement)}
        >
          ${glyph('palette')}
        </button>
        ${this._menuEl()}
      </div>
    </header>`;
  }

  /** The preview's mode switch, and what it previews, in the bar. */
  private _viewControls(compact: boolean): TemplateResult {
    return html`<div class="grp view">
      ${this._hasModes
        ? html`<mcte-mode-switch
            label=${t('theme-editor.preview.preview-mode')}
            .value=${this._mode}
            .options=${[
              { value: 'light', label: scopeLabel('light') },
              { value: 'dark', label: scopeLabel('dark') },
            ]}
            @mcte-change=${(e: CustomEvent<{ value: ThemeMode }>) => (e.stopPropagation(), this._setMode(e.detail.value))}
          ></mcte-mode-switch>`
        : nothing}
      ${compact || !this._hasModes ? nothing : html`<span class="previewing" aria-live="polite">${t('theme-editor.preview.previewing-mode', { mode: this._mode })}</span>`}
    </div>`;
  }

  /** Scope switch, the status line and what the open theme is doing: the top of the drawer. */
  private _scopeRow(): TemplateResult {
    return html`<div class="scope">
      ${this._hasModes
        ? html`<span class="lbl sr-only" id="edit-lbl">${t('theme-editor.editor-view.editing')}</span>
            <mcte-mode-switch
              label=${t('theme-editor.editor-view.edit-variables-for')}
              .value=${this._scope}
              .options=${[
                { value: 'shared', label: scopeLabel('shared') },
                { value: 'light', label: scopeLabel('light') },
                { value: 'dark', label: scopeLabel('dark') },
              ]}
              @mcte-change=${(e: CustomEvent) => this._setScope(e.detail.value as Scope)}
            ></mcte-mode-switch>`
        : this.draft.editable
          ? html`<button type="button" class="btn btn-secondary btn-sm" @click=${() => this._openDlg('add-modes')}>${t('theme-editor.editor-view.add-light-and-dark-modes')}</button>`
          : nothing}
    </div>`;
  }

  /** Values that point at another website: the preview and Try on dashboard load them at once, so say so (not by colour alone). */
  private _outsideEl(): TemplateResult | typeof nothing {
    const o = outsideOf(this._doc);
    if (!o.any) return nothing;
    return html`<div class="notice warn" role="status">
      ${glyph('information')}
      <div class="body">
        <strong>${t('theme-editor.editor-view.contacts-another-website')}</strong>
        <p>${legalText({
          text: o.hosts.length && !o.unknown ? t('theme-editor.editor-view.some-values-load-files-from-hosts-the', { hosts: o.hosts.join(', ') }) : t('theme-editor.editor-view.some-values-load-files-from-another'),
          english: o.hosts.length && !o.unknown ? englishOf(en(m('theme-editor.editor-view.some-values-load-files-from-hosts-the')), { hosts: o.hosts.join(', ') }) : englishOf(en(m('theme-editor.editor-view.some-values-load-files-from-another'))),
          translated: isTranslated(locale(), hasWrap()),
          showEnglish: this._english,
          onToggle: () => (this._english = !this._english),
          prevailsLabel: t('theme-editor.legal.english-prevails'),
          showLabel: t('theme-editor.legal.show-english'),
          id: 'legal-outside',
        })}</p>
      </div>
    </div>`;
  }

  private _bannerEl(): TemplateResult | typeof nothing {
    const b = this._banner;
    if (!b) return nothing;
    return html`<div class="notice ${b.kind === 'error' ? 'error' : 'warn'} banner" role="alert">
      ${glyph('alertCircle')}
      <div class="body">
        <h3 class="title" tabindex="-1">${b.title}</h3>
        <p>${b.message}</p>
        <div class="actions">${b.actions.map((a) => html`<button type="button" class="btn btn-secondary btn-sm" @click=${a.run}>${a.label}</button>`)}</div>
      </div>
    </div>`;
  }

  private _groups(): TemplateResult {
    const seen = new Set<string>();
    const errs = new Map<string, string>();
    for (const e of this._errors) {
      const parts = e.path.replace(/^theme\./, '').split('.');
      const inMode = parts[0] === 'modes';
      const sc: Scope = inMode ? ((parts[1] as Scope) ?? 'shared') : 'shared';
      if (sc === this._scope) errs.set(inMode ? parts.slice(2).join('.') : parts.join('.'), e.message);
    }
    const ctx: FieldCtx = {
      doc: this._doc,
      scope: this._scope,
      hasModes: this._hasModes,
      errors: errs,
      hints: this._hints,
      touched: this._touched,
      readOnly: !this.draft.editable,
    };
    const searching = !!this._q;
    let shown = 0;
    const one = (id: CatalogueGroupId): TemplateResult | typeof nothing => {
      const group = CATALOGUE_GROUPS.find((g) => g.id === id);
      if (!group) return nothing;
      const rows = this._rowsFor(id, seen);
      if (!rows.length && (searching || this._onlyChanged || id === 'other')) return nothing;
      shown += rows.length;
      const setCount = rows.filter((r) => isSetAnywhere(this._doc, r.entry.name)).length;
      return html`<mcte-field-group
        data-id=${id}
        .group=${group}
        .rows=${rows}
        .ctx=${ctx}
        .hass=${this.hass}
        .setCount=${setCount}
        ?open=${searching ? rows.length > 0 : this._open.has(id)}
        @mcte-toggle=${(e: CustomEvent) => this._toggle(e.detail.id)}
        @mcte-set=${(e: CustomEvent) => (e.stopPropagation(), this._onSet(e.detail.name, e.detail.value))}
        @mcte-reset=${(e: CustomEvent) => (e.stopPropagation(), this._onReset(e.detail.name))}
        @mcte-set-modes=${(e: CustomEvent) => (e.stopPropagation(), this._onSetModes(e.detail.name, e.detail.value, e.detail.modes))}
        @mcte-move-shared=${(e: CustomEvent) => (e.stopPropagation(), this._onMoveShared(e.detail.name, e.detail.value))}
        @mcte-copy=${(e: CustomEvent) => (e.stopPropagation(), this._copyKey(e.detail.text))}
      ></mcte-field-group>`;
    };
    const core = CORE_GROUPS.map(one);
    const cards = CARD_GROUPS.map(one);
    return html`
      ${searching ? html`<p class="help" role="status">${t('theme-editor.editor-view.c', { c: shown })}</p>` : nothing}
      ${searching && shown === 0
        ? html`<div class="empty">
            <p>${t('theme-editor.editor-view.no-variable-called-query-in-the-lists', { query: this._query })}</p>
            <button type="button" class="btn btn-secondary" @click=${() => ((this._rawPrefill = this._query.trim()), (this._query = ''), (this._q = ''))}>${t('theme-editor.editor-view.add-name-as-a-variable', { name: this._query.trim() })}</button>
          </div>`
        : nothing}
      ${core}
      ${cards.some((c) => c !== nothing) ? html`<h2 class="sect">${t('theme-editor.editor-view.magic-card-and-integrations')}</h2>${cards}` : nothing}
    `;
  }

  private _varsPanel(): TemplateResult {
    return html`
      ${this._narrow ? this._strip() : nothing}
      ${this._scopeRow()}
      ${this.include && this.include.state !== 'ok'
        ? html`<mcte-include-notice .status=${this.include} .checking=${this.checking} .result=${this.checkResult}></mcte-include-notice>`
        : this.checkResult
          ? html`<p class="help" role="status">${this.checkResult}</p>`
          : nothing}
      ${this._outsideEl()}
      ${this._bannerEl()}
      <div class="tools">
        <div class="searchbox">
          <label class="sr-only" for="vsearch">${t('theme-editor.editor-view.search-variables')}</label>
          <input
            id="vsearch"
            class="input"
            type="search"
            placeholder=${t('theme-editor.editor-view.search-by-name-or-value')}
            autocomplete="off"
            .value=${this._query}
            @input=${(e: Event) => this._search((e.target as HTMLInputElement).value)}
            @keydown=${(e: KeyboardEvent) => e.key === 'Escape' && this._query && (e.stopPropagation(), this._search(''))}
          />
        </div>
      </div>
      <p class="help status" role="status" aria-live="polite">${t('theme-editor.editor-view.editing-scope-previewing-mode', { scope: scopeLabel(this._scope), mode: scopeLabel(this._effectiveMode) })}</p>
      ${this._scope === 'shared' && this._hasModes
        ? html`<p class="help">${t('theme-editor.editor-view.shared-applies-to-light-and-dark-unless')}</p>`
        : nothing}
      ${this.writesEnabled === false
        ? html`<p class="help" data-theme-files-off>${this.storage ? t('theme-editor.editor-view.theme-folder-off-message') : t('theme-editor.editor-view.theme-files-off-message')}</p>`
        : !this.draft.editable ? html`<p class="help">${this.draft.reason ? t('theme-editor.editor-view.this-theme-is-read-only-reason-copy-it', { reason: this.draft.reason }) : t('theme-editor.editor-view.this-theme-is-read-only-copy-it-to-edit')}</p>` : nothing}
      <div class="groups">${this._groups()}</div>
      ${this.draft.editable
        ? html`<mcte-raw-rows
            .scopeLabel=${scopeLabel(this._scope)}
            .existing=${new Set(Object.keys((this._scope === 'shared' ? this._doc : (this._doc.modes?.[this._scope] ?? {})) as object))}
            .prefill=${this._rawPrefill}
            @mcte-add=${(e: CustomEvent) => (e.stopPropagation(), this._onAdd(e.detail.entries))}
            @mcte-raw-pending=${(e: CustomEvent) => (e.stopPropagation(), (this._rawPending = !!e.detail.pending))}
          ></mcte-raw-rows>`
        : nothing}
    `;
  }

  private _previewPanel(): TemplateResult {
    return html`<mcte-theme-preview class="preview"
      .doc=${this._previewDoc}
      .mode=${this._mode}
      .hass=${this.hass}
      hide-toolbar
      pickable
      @mcte-preview-mode=${(e: CustomEvent) => this._setMode(e.detail.mode as ThemeMode)}
      @mcte-preview-pick=${(e: CustomEvent<{ name: string }>) => (e.stopPropagation(), this._showVar(e.detail.name))}
    ></mcte-theme-preview>`;
  }

  private _strip(): TemplateResult {
    return html`<div class="strip">
      ${this._stripOpen
        ? html`<div class="strip-sample" inert aria-hidden="true">
            <div class="mini-tile"><span class="dot"></span><span><b>${t('theme-editor.editor-view.living-room')}</b><br /><small>${t('theme-editor.editor-view.on')}</small></span></div>
            <span class="mini-btn">${t('theme-editor.editor-view.button')}</span>
          </div>`
        : nothing}
      <div class="strip-bar">
        <button type="button" class="btn btn-text btn-sm" aria-expanded=${this._stripOpen ? 'true' : 'false'} @click=${() => (this._stripOpen = !this._stripOpen)}>
          ${this._stripOpen ? t('theme-editor.editor-view.hide-live-strip') : t('theme-editor.editor-view.show-live-strip')}
        </button>
        <button type="button" class="btn btn-text btn-sm" @click=${() => this._frame()?.closeDrawer('user')}>${t('theme-editor.editor-view.open-preview')}</button>
      </div>
    </div>`;
  }

  private _frame(): StudioFrameElement | null {
    return this.renderRoot?.querySelector<StudioFrameElement>(UI_STUDIO_FRAME_TAG) ?? null;
  }

  private _toggleDrawer(opener?: HTMLElement | null): void {
    const f = this._frame();
    if (!f) return;
    const panels = t('theme-editor.lips.variables-panel');
    this._say(f.drawerOpen ? t('theme-editor.lips.panels-hidden', { panels }) : t('theme-editor.lips.panels-shown', { panels }));
    if (f.drawerOpen) f.closeDrawer('user');
    else f.openDrawer(opener ?? null, 'user');
  }

  private _onFrameDrawer = (e: Event): void => {
    this._drawerOpen = (e as CustomEvent<{ open: boolean }>).detail.open;
  };

  private _onFrameModified = (e: Event): void => {
    this._reveal = '';
    this._onlyChanged = (e as CustomEvent<{ on: boolean }>).detail.on;
  };

  /** The frame's strings, in the editor's language (one object per language, so the frame re-renders only when it changes). */
  private _frameStrings(): StudioFrameStrings {
    const language = locale();
    if (this._strings?.language !== language) {
      this._strings = {
        language,
        value: {
          pin: t('theme-editor.editor-view.frame-pin'),
          modifiedOnly: t('theme-editor.editor-view.only-changed'),
          noneModified: t('theme-editor.editor-view.frame-none-modified'),
          close: t('theme-editor.editor-view.frame-close'),
          drawer: t('theme-editor.editor-view.variables'),
          zoom: t('theme-editor.editor-view.frame-zoom'),
        },
      };
    }
    return this._strings.value;
  }

  /** The scheme follows the Home Assistant theme, never the system setting. */
  private get _scheme(): 'light' | 'dark' {
    return browserMode(this.hass) === 'dark' ? 'dark' : 'light';
  }

  /** The preview's room on the stage for the rulers: the editor's size less the drawer, bar and the frame's padding. */
  private _measure(): FrameMeasure {
    const push = this._drawerOpen && !this._narrow ? 360 : 0;
    const width = Math.max(240, this._w - push - 96);
    const height = Math.max(200, this._h - 200);
    return { width, height, grid: 24, selection: null, zoom: 1 };
  }

  /** A variable is modified when the theme sets it in some scope. A new theme starts from its starter values, so only what differs from them counts until it is saved. */
  private _isModified(name: string): boolean {
    if (this._saved) return isSetAnywhere(this._doc, name);
    return (['shared', 'light', 'dark'] as const).some((sc) => {
      const v = ownValue(this._doc, sc, name);
      return v !== undefined && v !== ownValue(this._baseline, sc, name);
    });
  }

  /** With Modified only on and nothing changed, no drawer content is drawn and the frame shows its own note. */
  private get _nothingModified(): boolean {
    return this._onlyChanged && !this._reveal && !allKeys(this._doc).some((k) => this._isModified(k)) && !this._banner && !this._rawPending && !(this.include && this.include.state !== 'ok') && !this.checkResult;
  }

  private _dialog(): TemplateResult | typeof nothing {
    const name = this._name;
    const cancel = html`<button type="button" class="btn btn-secondary" autofocus @click=${() => this._closeDlg()}>${t('theme-editor.editor-view.cancel')}</button>`;
    const close = () => (this._dlg = null);
    const err = (t: string) => html`<p class="help error" role="alert">${glyph('alertCircle', 16)}<span>${t}</span></p>`;
    switch (this._dlg) {
      case 'discard':
        return dialog(t('theme-editor.editor-view.discard-changes-to-name', { name }), html`<p>${t('theme-editor.editor-view.you-have-changes-that-are-not-saved')}</p>`, html`${cancel}
          <button type="button" class="btn btn-danger" @click=${() => this._discard()}>${t('theme-editor.editor-view.discard')}</button>
          ${this._reason ? nothing : html`<button type="button" class="btn btn-primary" @click=${() => ((this._afterSave = 'back'), this._closeDlg(), void this._saveClick())}>${t('theme-editor.editor-view.save')}</button>`}`, close);
      case 'first-save':
        return dialog(t('theme-editor.editor-view.save-and-rewrite-this-file'), html`<p>${t('theme-editor.editor-view.saving-rewrites-name-yaml-comments-in', { name })}</p>`, html`${cancel}
          <button type="button" class="btn btn-primary" @click=${() => {
            const publish = this._publishAfterAck;
            this._publishAfterAck = false;
            this._rewriteAck = true;
            this._closeDlg();
            void this._doSave(false, publish);
          }}>${t('theme-editor.editor-view.save')}</button>`, close);
      case 'delete': {
        const file = this._file ?? `themes/${name}.yaml`;
        // theme-files 2.0.0: a stored theme is removed from Magic Card Utils, with its file only when ticked
        const body = this.storage && this._stored
          ? html`<p>${t('theme-editor.editor-view.this-removes-name-from-magic-card-utils', { name })}</p>
              ${this._deleteFileOffered
                ? html`<label class="check-row"><input type="checkbox" data-delete-file .checked=${this._deleteFile} @change=${(e: Event) => (this._deleteFile = (e.target as HTMLInputElement).checked)} />
                    <span>${t('theme-editor.editor-view.also-remove-file-from-the-themes-folder', { file: `/config/${file}` })}</span></label>`
                : nothing}`
          : html`<p>${t('theme-editor.editor-view.this-removes-config-file-screens-that', { file })}</p>`;
        return dialog(t('theme-editor.editor-view.delete-name', { name }), html`${body}${this._dlgError ? err(this._dlgError) : nothing}`, html`${cancel}
          <button type="button" class="btn btn-danger" @click=${() => void this._delete()}>${t('theme-editor.editor-view.delete')}</button>`, close);
      }
      case 'add-modes':
        return dialog(t('theme-editor.editor-view.add-light-and-dark-modes-2'), html`<p>${t('theme-editor.editor-view.variables-you-set-now-stay-shared-you')}</p>`, html`${cancel}
          <button type="button" class="btn btn-primary" @click=${() => this._addModes()}>${t('theme-editor.editor-view.add-modes')}</button>`, close);
      case 'yaml': {
        const text = toYaml(name, this._doc);
        return dialog(`${name}.yaml`, html`<p class="help">${t('theme-editor.editor-view.the-file-save-would-write-it-is-read')}</p><pre class="code" tabindex="0" aria-label=${t('theme-editor.editor-view.yaml-of-name', { name })}>${text}</pre>`, html`
          <button type="button" class="btn btn-secondary" @click=${() => void copyText(text).then(() => this._say(t('theme-editor.editor-view.copied-yaml')))}>${glyph('contentCopy')} ${t('theme-editor.editor-view.copy-yaml')}</button>
          <button type="button" class="btn btn-primary" autofocus @click=${() => this._closeDlg()}>${t('theme-editor.editor-view.close')}</button>`, close);
      }
      case 'rename':
        return dialog(t('theme-editor.editor-view.choose-another-name'), html`<label class="lbl" for="rename">${t('theme-editor.editor-view.name-your-theme')}</label>
          <input id="rename" class="input mono" .value=${this._renameValue} aria-invalid=${this._renameError ? 'true' : 'false'} @input=${(e: Event) => ((this._renameValue = (e.target as HTMLInputElement).value), (this._renameError = ''))} />
          ${this._renameError ? err(this._renameError) : html`<p class="help">${t('theme-editor.editor-view.lowercase-letters-numbers-hyphens-and')}</p>`}`, html`${cancel}
          <button type="submit" class="btn btn-primary">${t('theme-editor.editor-view.use-this-name')}</button>`, close, (e) => (e.preventDefault(), this._applyRename()));
      default:
        return nothing;
    }
  }

  protected render(): TemplateResult {
    if (!this.draft) return html``;
    const compact = this._w < 768;
    return html`
      <mc-ui-studio-frame
        studio="theme-editor"
        fixed-drawer
        .scheme=${this._scheme}
        .strings=${this._frameStrings()}
        .selectionLabel=${this._name}
        .measure=${this._measure()}
        .rulers=${true}
        @mc-frame-drawer=${this._onFrameDrawer}
        @mc-frame-modified=${this._onFrameModified}
      >
        ${this._bar()}
        <div class="stage" slot="stage" role="region" aria-label=${t('theme-editor.editor-view.preview')}>
          ${this._previewPanel()}
        </div>
        ${this._nothingModified ? nothing : html`<div class="vars" id="vars" slot="drawer">${this._varsPanel()}</div>`}
      </mc-ui-studio-frame>
      <footer class="foot">
        ${this._statusLine()}
        ${compact ? nothing : html`<p class="help tryhelp" id="try-help">${this._tryHelp()}</p>`}
      </footer>
      <p class="sr-only" role="status">${this._msg}</p>
      <mc-ui-toast .offset=${this._trial ? 88 : 16} @mc-toast-action=${() => this._toastRun?.()}></mc-ui-toast>
      ${this._dialog()}
      <mcte-preset-dialog .backend=${this.backend} .mine=${this.mine} .include=${this.include}></mcte-preset-dialog>
    `;
  }

  static styles = [
    base,
    kitBlueprint,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        position: relative;
        overflow: hidden;
      }
      .check-row {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin-block-start: 12px;
        min-block-size: 24px;
        cursor: pointer;
      }
      .check-row input {
        inline-size: 18px;
        block-size: 18px;
        margin: 2px 0 0;
        flex: none;
        accent-color: var(--bp-acc, var(--primary-color));
      }
      mc-ui-studio-frame {
        flex: 1 1 auto;
        min-block-size: 0;
        --mc-ground: var(--bp-bg);
        --mc-surface: var(--bp-sheet);
        --mc-surface-2: var(--bp-surf2);
        --mc-text: var(--bp-ink);
        --mc-text-2: var(--bp-mute);
        --mc-divider: var(--bp-line);
        --mc-field-border: var(--bp-edge);
        --mc-accent: var(--bp-acc);
        --mc-accent-tint: var(--bp-acc-soft);
        --mc-radius: var(--bp-r-s);
        --mc-font: var(--bp-font-ui);
        --mc-mono: var(--bp-font-mono);
      }
      .fr-bar {
        display: flex;
        flex: 1;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--bp-s-3);
        min-inline-size: 0;
        block-size: 100%;
      }
      .fr-bar .spacer {
        flex: 1;
      }
      .fr-bar .grp {
        display: flex;
        flex: none;
        align-items: center;
        gap: var(--bp-s-3);
      }
      .publish {
        flex: none;
        white-space: nowrap;
      }
      .publish[aria-disabled='true'] {
        opacity: 0.55;
        cursor: not-allowed;
      }
      .publish:focus-visible {
        outline: 2px solid var(--bp-acc, var(--primary-color));
        outline-offset: 2px;
      }
      .vr {
        flex: none;
        inline-size: 1px;
        block-size: 20px;
        background: var(--bp-line);
      }
      .studio-title {
        flex: none;
        font-size: var(--bp-t-bar);
        font-weight: 600;
        white-space: nowrap;
      }
      .tname {
        flex: 0 1 auto;
        min-inline-size: 0;
        font-size: var(--bp-t-bar);
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .chips {
        display: flex;
        flex: none;
        gap: var(--bp-s-3);
        white-space: nowrap;
      }
      @media (max-width: 679px) {
        /* the name, the chips and the buttons wrap onto a second row instead of pushing a control off the screen */
        .fr-bar {
          padding-block: var(--bp-s-3);
        }
        .tname {
          flex: 1 1 8rem;
        }
        .chips {
          flex: 0 1 auto;
          flex-wrap: wrap;
          white-space: normal;
        }
        .fr-bar .spacer {
          display: none;
        }
        .fr-bar .grp {
          flex: 1 1 auto;
          justify-content: flex-end;
        }
        .back-label,
        .vr {
          position: absolute;
          inline-size: 1px;
          block-size: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
      }
      a.btn {
        text-decoration: none;
      }
      .menuwrap {
        position: relative;
      }
      .menu {
        position: fixed;
        min-inline-size: 220px;
        max-inline-size: calc(100vw - 24px);
        z-index: 40;
      }
      .tryhelp-menu {
        padding: 0 12px 8px;
        max-inline-size: 280px;
      }
      .stage {
        display: grid;
        gap: var(--bp-s-5);
        align-content: start;
        inline-size: 100%;
      }
      .foot {
        flex: none;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0 var(--bp-s-6);
        min-block-size: 36px;
        padding: 0 var(--bp-s-5);
        border-block-start: 1px solid var(--bp-line);
        background: var(--bp-sheet);
        color: var(--bp-mute);
      }
      .foot .help {
        margin: 0;
      }
      .line {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 8px;
        min-block-size: 32px;
      }
      .fr-bar .view {
        flex: none;
      }
      .previewing {
        white-space: nowrap;
        font-size: var(--bp-t-label, 0.8125rem);
        color: var(--bp-mute);
      }
      .preview {
        display: block;
        min-inline-size: 0;
      }
      .vars {
        display: grid;
        gap: var(--bp-s-6);
        align-content: start;
        padding: var(--bp-s-6);
        min-inline-size: 0;
      }
      .scope:empty {
        display: none;
      }
      .tools {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 16px;
        align-items: center;
      }
      .searchbox {
        flex: 1 1 200px;
      }
      .groups {
        display: grid;
        gap: 8px;
      }
      .sect {
        margin-block-start: 8px;
        font-size: 0.9375rem;
        font-weight: 500;
        color: var(--mc-text-2);
      }
      .strip {
        position: sticky;
        inset-block-start: 0;
        z-index: 3;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 12px;
        padding: 6px 0;
        background: var(--mc-surface);
        border-block-end: 1px solid var(--mc-divider);
      }
      .strip-bar {
        display: flex;
        gap: 4px;
        flex: none;
        margin-inline-start: auto;
      }
      .strip-sample {
        flex: 1 1 220px;
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 4px 12px;
        border-radius: var(--mc-radius-lg);
        background: var(--lovelace-background, var(--primary-background-color));
        color: var(--primary-text-color);
        min-block-size: 44px;
      }
      .mini-tile {
        display: flex;
        gap: 8px;
        align-items: center;
        padding: 6px 12px;
        border-radius: var(--ha-card-border-radius, 12px);
        background: var(--ha-card-background, var(--card-background-color));
        color: var(--primary-text-color);
        font-size: 0.8125rem;
      }
      .mini-tile .dot {
        inline-size: 24px;
        block-size: 24px;
        border-radius: 50%;
        background: var(--primary-color);
      }
      .mini-tile small {
        color: var(--secondary-text-color);
      }
      .mini-btn {
        padding: 6px 14px;
        border-radius: 8px;
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        font-size: 0.8125rem;
      }
      .banner .title {
        font-size: 0.9375rem;
      }
      .status {
        min-block-size: 1.2em;
      }
      @media (prefers-reduced-motion: reduce) {
        .spin,
        .strip,
        .stage {
          animation: none;
          transition: none;
        }
      }
    `,
  ];
}
