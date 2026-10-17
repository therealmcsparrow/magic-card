import { LitElement, html, css, nothing, PropertyValues, TemplateResult } from 'lit';
import type { PropertyDeclarations } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { CatalogueGroupId } from '../contracts/theme-catalogue';
import type { IncludeStatus, ThemeBackend, ThemeBackendError, ThemeDoc, ThemeMode } from '../contracts/theme-editor';
import { CATALOGUE_GROUPS, entryByName, groupEntries, kindOf } from './catalogue/index';
import { icon } from './icons';
import { cloneDoc, docErrors, isDirty, previewVars, removeVar, resolveTheme, setVar, validateValue } from './model';
import type { DocError } from './model';
import { closeDialog, dialog, openDialog } from './dialogs';
import { base } from './styles';
import { getTrial, isTrialActive, startTrial, stopTrial, subscribeTrial, updateTrial, useTheme } from './trial';
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
  SCOPE_LABEL,
  textContrast,
  toYaml,
} from './util';
import type { Scope } from './util';
import type { FieldCtx, FieldHint, FieldRow } from './field-group';
import type { SaveReason } from './save-bar';
import './field-group';
import './preview';
import './preview-cards';
import './include-notice';
import './mode-switch';
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
}

type Dlg = 'discard' | 'first-save' | 'delete' | 'add-modes' | 'yaml' | 'rename' | null;

interface Banner {
  kind: 'error' | 'warn';
  title: string;
  message: string;
  actions: Array<{ label: string; run: () => void }>;
}

interface Toast {
  text: string;
  action?: { label: string; run: () => void };
}

const CORE_GROUPS: CatalogueGroupId[] = ['primary', 'backgrounds', 'text', 'states', 'sizes', 'chrome', 'other'];
const CARD_GROUPS: CatalogueGroupId[] = ['magic-card', 'tile', 'mushroom', 'bubble-card', 'ultra-card', 'button-card'];
const WIDE = 1024;
const SHORT = 500;
const TOAST_MS = 10_000;
const HINT_DELAY_MS = 800;

const clock = (): string => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/**
 * <mcte-editor-view>: one theme open for editing (design 4 to 9, round 1 in 16). It owns the draft
 * (`_doc`), the scope and the preview mode, saves through the ThemeBackend and drives the trial.
 * Events up to the host: `mcte-back`, `mcte-dirty` { dirty }, `mcte-saved` { name }, `mcte-deleted` { name },
 * `mcte-recheck` (include).
 */
export class McteEditorView extends LitElement {
  static properties: PropertyDeclarations = {
    draft: { attribute: false },
    hass: { attribute: false },
    backend: { attribute: false },
    include: { attribute: false },
    checking: { type: Boolean },
    checkResult: {},
    _doc: { state: true },
    _saved: { state: true },
    _name: { state: true },
    _file: { state: true },
    _mtime: { state: true },
    _scope: { state: true },
    _mode: { state: true },
    _open: { state: true },
    _query: { state: true },
    _q: { state: true },
    _onlyChanged: { state: true },
    _panel: { state: true },
    _saving: { state: true },
    _savedAt: { state: true },
    _usedMsg: { state: true },
    _msg: { state: true },
    _dlg: { state: true },
    _toast: { state: true },
    _banner: { state: true },
    _trial: { state: true },
    _touched: { state: true },
    _hints: { state: true },
    _w: { state: true },
    _h: { state: true },
    _stackH: { state: true },
    _stripOpen: { state: true },
    _menu: { state: true },
    _rawPrefill: { state: true },
    _renameValue: { state: true },
    _renameError: { state: true },
    _dlgError: { state: true },
    _rewriteAck: { state: true },
    _previewDoc: { state: true },
  };

  draft!: Draft;
  hass: unknown;
  backend: ThemeBackend | undefined;
  include: IncludeStatus | undefined;
  checking = false;
  checkResult = '';

  private _doc: ThemeDoc = {};
  private _saved: ThemeDoc | null = null;
  private _name = '';
  private _file: string | undefined;
  private _mtime: number | undefined;
  private _scope: Scope = 'shared';
  private _mode: ThemeMode = 'light';
  private _open = new Set<string>(['primary']);
  private _query = '';
  private _q = '';
  private _onlyChanged = false;
  private _panel: 'vars' | 'preview' = 'vars';
  private _saving = false;
  private _savedAt = '';
  private _usedMsg = '';
  private _msg = '';
  private _dlg: Dlg = null;
  private _toast: Toast | null = null;
  private _banner: Banner | null = null;
  private _trial: TrialState | null = null;
  private _touched = new Set<string>();
  private _hints = new Map<string, FieldHint>();
  private _w = 1280;
  private _h = 800;
  private _stackH = 0;
  private _stripOpen = true;
  private _menu = false;
  private _rawPrefill = '';
  private _renameValue = '';
  private _renameError = '';
  private _dlgError = '';
  private _rewriteAck = false;
  private _previewDoc: ThemeDoc = {};

  private _ro?: ResizeObserver;
  private _stackRo?: ResizeObserver;
  private _unsub?: () => void;
  private _toastTimer?: ReturnType<typeof setTimeout>;
  private _toastPaused = false;
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
    this._unsub = subscribeTrial((s) => (this._trial = s));
    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(([e]) => {
        const r = e.contentRect;
        if (r.width) this._w = Math.round(r.width);
        if (r.height) this._h = Math.round(r.height);
      });
      this._ro.observe(this);
    }
  }

  disconnectedCallback(): void {
    this._ro?.disconnect();
    this._stackRo?.disconnect();
    this._unsub?.();
    for (const t of [this._toastTimer, this._hintTimer, this._msgTimer, this._qTimer]) clearTimeout(t);
    super.disconnectedCallback();
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('draft') && this.draft) this._load(this.draft);
  }

  private _load(d: Draft): void {
    this._name = d.name;
    this._doc = cloneDoc(d.doc);
    this._saved = d.saved ? cloneDoc(d.saved) : null;
    this._baseline = cloneDoc(d.saved ?? d.doc);
    this._file = d.file;
    this._mtime = d.mtime;
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
    this._computeHints(true);
    if (d.from) this._say(`Editing ${SCOPE_LABEL[this._scope]}. Created from ${d.from}.`);
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has('_dlg') && this._dlg) {
      openDialog(this.renderRoot);
      if (this._dlg === 'rename') this.renderRoot.querySelector<HTMLInputElement>('#rename')?.focus();
    }
    this._syncStrip();
    if (changed.has('_doc') || changed.has('_mode')) this._queueHints();
    if (changed.has('_doc') || changed.has('_saved') || changed.has('_baseline')) {
      const dirty = this._needsPrompt;
      if (dirty !== this._wasDirty) {
        this._wasDirty = dirty;
        fire(this, 'mcte-dirty', { dirty });
      }
    }
    const stack = this.renderRoot.querySelector<HTMLElement>('.stack');
    if (stack !== this._stackEl) {
      this._stackRo?.disconnect();
      this._stackEl = stack;
      if (stack && typeof ResizeObserver !== 'undefined') {
        this._stackRo = new ResizeObserver(() => {
          const h = Math.round(stack.getBoundingClientRect().height);
          if (h !== this._stackH) this._stackH = h;
        });
        this._stackRo.observe(stack);
      }
    }
  }
  private _stackEl: HTMLElement | null = null;

  // ── derived ──

  private get _dirty(): boolean {
    return this._saved === null ? true : isDirty(this._saved, this._doc);
  }

  /** True when leaving would lose work worth asking about. */
  private get _needsPrompt(): boolean {
    return isDirty(this._saved ?? this._baseline, this._doc);
  }

  private get _isNew(): boolean {
    return this._saved === null;
  }

  private get _hasModes(): boolean {
    return !!this._doc.modes;
  }

  private get _errors(): DocError[] {
    return docErrors(this._doc, kindOf);
  }

  private get _reason(): SaveReason | null {
    if (!this.draft?.editable) return { text: 'This theme is read only. Copy it to edit.' };
    if (this.include && this.include.state !== 'ok') return { text: 'Saving is off until themes are set up', action: 'recheck', actionLabel: 'Check again' };
    const n = this._errors.length;
    if (n) return { text: `Fix ${n} ${n === 1 ? 'value' : 'values'} to save`, action: 'fix', actionLabel: 'Show the first' };
    if (!this._isNew && !this._dirty) return { text: 'No changes to save', quiet: true };
    return null;
  }

  private get _layout(): 'wide' | 'mid' | 'narrow' {
    return this._w >= WIDE ? 'wide' : this._w >= 600 ? 'mid' : 'narrow';
  }

  private get _sticky(): boolean {
    return this._layout !== 'wide' && this._h >= SHORT && (this._stackH === 0 || this._stackH <= this._h * 0.4);
  }

  private _say(text: string): void {
    this._msg = text;
    clearTimeout(this._msgTimer);
    this._msgTimer = setTimeout(() => (this._msg = ''), 5000);
  }

  // ── edits ──

  private _edit(next: ThemeDoc): void {
    this._doc = next;
    this._usedMsg = '';
    this._savedAt = '';
    this._banner = null;
    this._previewDoc = heldBackDoc(next, this._previewDoc, docErrors(next, kindOf));
    updateTrial(next);
  }

  private _onSet(name: string, value: string): void {
    const mode = this._scope === 'shared' ? undefined : this._scope;
    if (value.trim() === '') {
      this._edit(removeVar(this._doc, name, mode));
      return;
    }
    if (this._scope === 'shared') this._touched = new Set(this._touched).add(name);
    this._edit(setVar(this._doc, name, value, mode));
  }

  private _onReset(name: string): void {
    const label = entryByName(name)?.label ?? name;
    this._edit(removeVar(this._doc, name, this._scope === 'shared' ? undefined : this._scope));
    this._say(`Removed ${label} from ${SCOPE_LABEL[this._scope]}`);
  }

  private _onSetModes(name: string, value: string, modes: ThemeMode[]): void {
    let d = this._doc;
    for (const m of modes) d = setVar(d, name, value, m);
    this._edit(d);
    this._say(`Set in ${modes.map((m) => SCOPE_LABEL[m]).join(' and ')}`);
  }

  private _onAdd(entries: Array<{ name: string; value: string }>): void {
    let d = this._doc;
    const mode = this._scope === 'shared' ? undefined : this._scope;
    for (const e of entries) {
      d = setVar(d, e.name, e.value, mode);
      if (!mode) this._touched = new Set(this._touched).add(e.name);
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
    this._say('Added light and dark modes. Variables you set before stay shared.');
  }

  private _copyMode(from: ThemeMode, to: ThemeMode): void {
    const src = this._doc.modes?.[from] ?? {};
    const n = Object.keys(src).length;
    this._undo = cloneDoc(this._doc);
    const d = cloneDoc(this._doc);
    d.modes = { ...(d.modes ?? {}), [to]: { ...src } };
    this._edit(d);
    this._menu = false;
    this._showToast({ text: `Copied ${n} ${n === 1 ? 'variable' : 'variables'} from ${SCOPE_LABEL[from]} to ${SCOPE_LABEL[to]}.`, action: { label: 'Undo', run: () => this._undoEdit() } });
  }

  private _undoEdit(): void {
    if (!this._undo) return;
    this._edit(this._undo);
    this._undo = null;
    this._toast = null;
  }

  // ── hints (contrast) ──

  private _queueHints(): void {
    clearTimeout(this._hintTimer);
    this._hintTimer = setTimeout(() => this._computeHints(), HINT_DELAY_MS);
  }

  private _computeHints(_now = false): void {
    const vars = resolveTheme(this._doc, this._mode);
    const hints = new Map<string, FieldHint>();
    const card = String(vars['ha-card-background'] ?? vars['card-background-color'] ?? '#ffffff');
    const stage = String(vars['lovelace-background'] ?? vars['primary-background-color'] ?? '');
    const modeName = SCOPE_LABEL[this._mode];
    for (const name of ['primary-text-color', 'secondary-text-color']) {
      const text = vars[name];
      if (text === undefined) continue;
      const t = String(text);
      if (/^var\(/i.test(t) || !t.trim()) continue;
      const r = /gradient\(/i.test(card) ? 'transparent' : textContrast(t, card, stage);
      if (r === null) continue;
      if (r === 'transparent') hints.set(name, { text: 'Contrast not checked: value has transparency.', ok: null });
      else hints.set(name, { text: `Contrast on card, ${modeName}: ${r.ratio.toFixed(1)} to 1, ${r.ok ? 'easy to read' : 'hard to read, below 4.5 to 1'}`, ok: r.ok });
    }
    this._hints = hints;
  }

  // ── the live strip (below 1024 px) ──

  private _syncStrip(): void {
    const el = this.renderRoot.querySelector<HTMLElement>('.strip-sample');
    if (!el) return;
    const vars = previewVars(this._previewDoc, this._mode);
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
          entry: { name: k, group: 'other' as const, source: 'ha' as const, kind: 'text' as const, label: k },
          follows: false,
          custom: true,
        }));
    } else {
      rows = groupEntries(id).map((r) => ({ entry: r.entry, follows: r.follows }));
    }
    rows = rows.filter((r) => !seen.has(r.entry.name));
    for (const r of rows) seen.add(r.entry.name);
    const q = this._q;
    return rows.filter((r) => {
      if (this._onlyChanged && !isSetAnywhere(this._doc, r.entry.name)) return false;
      if (!q) return true;
      const value = String(ownValue(this._doc, this._scope, r.entry.name) ?? ownValue(this._doc, 'shared', r.entry.name) ?? '').toLowerCase();
      return r.entry.name.toLowerCase().includes(q) || r.entry.label.toLowerCase().includes(q) || value.includes(q);
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
    const group = entryByName(name)?.group ?? 'other';
    this._setScope(scope);
    this._panel = 'vars';
    this._query = '';
    this._q = '';
    this._open = new Set(this._open).add(group);
    void this.updateComplete.then(() => {
      const g = this.renderRoot.querySelector<HTMLElement & { focusField(n: string): void }>(`mcte-field-group[data-id="${group}"]`);
      g?.focusField(name);
    });
  }

  // ── toast ──

  private _showToast(t: Toast): void {
    this._toast = t;
    this._startToastTimer();
  }

  private _startToastTimer(): void {
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      if (this._toastPaused) return;
      this._toast = null;
    }, TOAST_MS);
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
    if (this._needsPrompt) this._openDlg('discard');
    else this._leave();
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

  private async _saveClick(): Promise<void> {
    if (this._reason || this._saving) return;
    if (!this._isNew && this._file && !this._rewriteAck) {
      this._openDlg('first-save');
      return;
    }
    await this._doSave();
  }

  private async _doSave(anyway = false): Promise<boolean> {
    if (!this.backend || this._saving) return false;
    const snap = cloneDoc(this._doc);
    this._saving = true;
    this._banner = null;
    try {
      const res = await this.backend.save({ name: this._name, theme: snap, overwrite: !this._isNew, base_mtime: anyway ? undefined : this._mtime });
      this._saved = snap;
      this._baseline = snap;
      this._mtime = res.mtime;
      this._file = res.file;
      this._savedAt = clock();
      this._usedMsg = '';
      this._rewriteAck = true;
      if (isTrialActive()) stopTrial('saved');
      this._showToast({
        text: res.loaded
          ? `Saved ${this._name} and reloaded themes. Screens that use this theme update now, including wall tablets.`
          : `Saved ${this._name}.`,
        action: { label: 'Use this theme', run: () => this._use() },
      });
      if (!res.loaded) {
        this._banner = {
          kind: 'warn',
          title: `Saved ${res.file}, but Home Assistant does not list ${this._name} yet`,
          message: 'Reload themes in Developer tools, YAML, or restart Home Assistant. The file is written.',
          actions: [{ label: 'Dismiss', run: () => (this._banner = null) }],
        };
      }
      fire(this, 'mcte-saved', { name: this._name });
      this._saving = false;
      if (this._afterSave === 'back') {
        this._afterSave = null;
        this._leave();
      }
      return true;
    } catch (e) {
      this._saving = false;
      this._afterSave = null;
      this._banner = this._saveBanner(e as ThemeBackendError);
      void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('.banner .title')?.focus());
      return false;
    }
  }

  private _saveBanner(err: ThemeBackendError): Banner {
    const name = this._name;
    const dismiss = { label: 'Dismiss', run: () => (this._banner = null) };
    const retry = { label: 'Try again', run: () => void this._saveClick() };
    switch (err.code) {
      case 'conflict':
        return {
          kind: 'warn',
          title: `${name}.yaml changed on disk`,
          message: 'This file changed since you opened it. Reload it to see the new version, or save anyway to replace it with yours.',
          actions: [
            { label: 'Reload', run: () => void this._reload() },
            { label: 'Save anyway', run: () => void this._doSave(true) },
          ],
        };
      case 'name_taken':
        return {
          kind: 'error',
          title: `Could not save ${name}`,
          message: err.message || 'A theme with this name already exists.',
          actions: this._isNew ? [{ label: 'Choose another name', run: () => this._openRename() }, dismiss] : [dismiss],
        };
      case 'themes_not_included':
        fire(this, 'mcte-recheck');
        return {
          kind: 'error',
          title: `Could not save ${name}`,
          message: 'Home Assistant does not load /config/themes yet. Add the lines shown above, restart, then press Check again.',
          actions: [dismiss],
        };
      case 'unauthorized':
        return { kind: 'error', title: `Could not save ${name}`, message: 'Only administrators can edit themes.', actions: [dismiss] };
      case 'invalid_format': {
        const first = err.errors?.[0];
        const nameErr = err.errors?.find((x) => x.path === 'name');
        return {
          kind: 'error',
          title: `Could not save ${name}`,
          message: first ? `${first.path.replace(/^theme\./, '')}: ${first.message}` : err.message,
          actions: nameErr && this._isNew ? [{ label: 'Choose another name', run: () => this._openRename() }, dismiss] : [dismiss],
        };
      }
      default:
        return {
          kind: 'error',
          title: `Could not save ${name}`,
          message: /lost|closed|connection/i.test(err.message ?? '') ? 'The connection to Home Assistant was lost. Your changes are still here.' : (err.message ?? ''),
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
      this._banner = null;
      this._say('Reloaded the file from disk.');
    } catch (e) {
      this._banner = { kind: 'error', title: `Could not read ${this._name}`, message: (e as Error).message, actions: [{ label: 'Dismiss', run: () => (this._banner = null) }] };
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
      this._renameError = 'Use lowercase letters, numbers, hyphens and underscores, starting with a letter or number (64 characters at most).';
      return;
    }
    this._name = v;
    this._closeDlg();
    this._banner = null;
    fire(this, 'mcte-rename', { name: v });
    this._say(`Named the theme ${v}. Press Save to write it.`);
  }

  private _use(): void {
    const ok = useTheme(this._name);
    this._usedMsg = ok
      ? `Now using ${this._name} for your user.`
      : `Pick ${this._name} in your profile to use it.`;
    this._toast = null;
  }

  private async _delete(): Promise<void> {
    if (!this.backend) return;
    try {
      await this.backend.remove(this._name);
    } catch (e) {
      this._dlgError = `Could not delete ${this._name}. ${(e as Error).message ?? ''}`.trim();
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
    startTrial({ name: this._name, doc: this._doc, hass: this.hass });
  }

  // ── keyboard ──

  private _onKey(e: KeyboardEvent): void {
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
      this.renderRoot.querySelector<HTMLInputElement>('#vsearch')?.focus();
      return;
    }
    if (e.key === 'Escape' && this._menu) {
      this._menu = false;
      this.renderRoot.querySelector<HTMLElement>('.more')?.focus();
    }
  }

  private _menuKey(e: KeyboardEvent): void {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = [...this.renderRoot.querySelectorAll<HTMLElement>('.menu [role="menuitem"]')];
    const at = items.indexOf(e.composedPath()[0] as HTMLElement);
    items[(at + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
  }

  private _copyKey(text: string, what: string): void {
    void copyText(text).then(() => this._say(`Copied ${what} ${text}`));
  }

  // ── render: pieces ──

  private _chips(): TemplateResult {
    const dirtyChip = this._isNew
      ? html`<span class="chip is-warn">New, not saved</span>`
      : this._dirty
        ? html`<span class="chip is-warn">Unsaved changes</span>`
        : nothing;
    const n = this._errors.length;
    return html`${dirtyChip}
    ${this._trial ? html`<span class="chip is-accent">Trying on this tab</span>` : nothing}
    ${!this.draft.editable ? html`<span class="chip is-warn">Read only</span>` : nothing}
    ${n ? html`<button type="button" class="chip is-warn" @click=${() => this._jumpToFirstError()}>${n} ${n === 1 ? 'value needs' : 'values need'} a fix</button>` : nothing}`;
  }

  private _tryHelp(): string {
    const mode = browserMode(this.hass);
    return `Applies to this browser tab only. Open a dashboard to see it. The Revert button stays at the edge of the screen. It uses your browser's current mode (${mode}). To try ${mode === 'dark' ? 'light' : 'dark'}, switch your profile to ${mode === 'dark' ? 'light' : 'dark'}.`;
  }

  private _tryButton(inMenu = false): TemplateResult {
    const on = !!this._trial;
    return html`<button
      type="button"
      class=${inMenu ? 'mi' : 'btn btn-secondary try'}
      role=${inMenu ? 'menuitem' : 'button'}
      aria-pressed=${ifDefined(inMenu ? undefined : on ? 'true' : 'false')}
      aria-describedby="try-help"
      @click=${() => this._toggleTrial()}
    >
      ${icon('eye')} ${on ? 'Stop trying' : 'Try on dashboard'}
    </button>`;
  }

  private _menuEl(): TemplateResult {
    const compact = this._w < 640;
    const canDelete = !this._isNew && !!this._file && this.draft.editable;
    return html`<div class="menuwrap" @focusout=${(e: FocusEvent) => {
      if (this._menu && !(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null)) this._menu = false;
    }}>
      <button type="button" class="icon-btn more" aria-label="More actions" aria-haspopup="menu" aria-expanded=${this._menu ? 'true' : 'false'} @click=${() => (this._menu = !this._menu)}>
        ${icon('more')}
      </button>
      ${this._menu
        ? html`<div class="menu" role="menu" aria-label="More actions" @keydown=${this._menuKey}>
            ${compact ? html`${this._tryButton(true)}<p class="help tryhelp-menu" id="try-help">${this._tryHelp()}</p>` : nothing}
            <button type="button" role="menuitem" class="mi" @click=${() => this._openDlg('yaml')}>Show YAML</button>
            <button type="button" role="menuitem" class="mi" @click=${() => void copyText(toYaml(this._name, this._doc)).then(() => (this._say('Copied YAML'), (this._menu = false)))}>Copy YAML</button>
            ${this._hasModes
              ? html`<button type="button" role="menuitem" class="mi" @click=${() => this._copyMode('light', 'dark')}>Copy Light to Dark</button>
                  <button type="button" role="menuitem" class="mi" @click=${() => this._copyMode('dark', 'light')}>Copy Dark to Light</button>`
              : nothing}
            ${canDelete ? html`<button type="button" role="menuitem" class="mi danger" @click=${() => this._openDlg('delete')}>Delete theme</button>` : nothing}
          </div>`
        : nothing}
    </div>`;
  }

  private _header(): TemplateResult {
    const compact = this._w < 640;
    return html`<header class="hdr">
      <div class="left">
        <button type="button" class="btn btn-text back" @click=${() => this._back()}>${icon('back')} Themes</button>
        <h2 class="tname">${this._name}</h2>
        <div class="chips">${this._chips()}</div>
      </div>
      <div class="mid">
        ${this._hasModes
          ? html`<span class="lbl sr-only" id="edit-lbl">Editing</span>
              <mcte-mode-switch
                label="Edit variables for"
                .value=${this._scope}
                .options=${[
                  { value: 'shared', label: 'Shared' },
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
                @mcte-change=${(e: CustomEvent) => this._setScope(e.detail.value as Scope)}
              ></mcte-mode-switch>`
          : this.draft.editable
            ? html`<button type="button" class="btn btn-secondary btn-sm" @click=${() => this._openDlg('add-modes')}>Add light and dark modes</button>`
            : nothing}
        ${compact ? nothing : this._tryButton()}
      </div>
      <div class="right">
        <mcte-save-bar
          .reason=${this._reason}
          .saving=${this._saving}
          .savedAt=${this._savedAt}
          .usedMessage=${this._usedMsg}
          ?show-shortcut=${true}
          @mcte-save=${() => void this._saveClick()}
          @mcte-use=${() => this._use()}
          @mcte-reason-action=${(e: CustomEvent) => (e.detail.action === 'fix' ? this._jumpToFirstError() : fire(this, 'mcte-recheck'))}
        ></mcte-save-bar>
        ${this._menuEl()}
      </div>
      ${compact ? nothing : html`<p class="help tryhelp" id="try-help">${this._tryHelp()}</p>`}
    </header>`;
  }

  private _bannerEl(): TemplateResult | typeof nothing {
    const b = this._banner;
    if (!b) return nothing;
    return html`<div class="callout ${b.kind === 'error' ? 'is-error' : 'is-warn'} banner" role="alert">
      ${icon('alert')}
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
        @mcte-copy=${(e: CustomEvent) => (e.stopPropagation(), this._copyKey(e.detail.text, e.detail.what))}
      ></mcte-field-group>`;
    };
    const core = CORE_GROUPS.map(one);
    const cards = CARD_GROUPS.map(one);
    return html`
      ${searching ? html`<p class="help" role="status">${shown} ${shown === 1 ? 'variable matches' : 'variables match'}</p>` : nothing}
      ${searching && shown === 0
        ? html`<div class="empty">
            <p>No variable called ${this._query} in the lists.</p>
            <button type="button" class="btn btn-secondary" @click=${() => ((this._rawPrefill = this._query.trim()), (this._query = ''), (this._q = ''))}>Add ${this._query.trim()} as a variable</button>
          </div>`
        : nothing}
      ${core}
      ${cards.some((c) => c !== nothing) ? html`<h2 class="sect">Magic Card and integrations</h2>${cards}` : nothing}
    `;
  }

  private _varsPanel(): TemplateResult {
    const n = this._errors.length;
    void n;
    return html`
      ${this.include && this.include.state !== 'ok'
        ? html`<mcte-include-notice .status=${this.include} .checking=${this.checking} .result=${this.checkResult}></mcte-include-notice>`
        : this.checkResult
          ? html`<p class="help" role="status">${this.checkResult}</p>`
          : nothing}
      ${this._bannerEl()}
      <div class="tools">
        <div class="searchbox">
          <label class="sr-only" for="vsearch">Search variables</label>
          <input
            id="vsearch"
            class="input"
            type="search"
            placeholder="Search by name or value"
            autocomplete="off"
            .value=${this._query}
            @input=${(e: Event) => this._search((e.target as HTMLInputElement).value)}
            @keydown=${(e: KeyboardEvent) => e.key === 'Escape' && this._query && (e.stopPropagation(), this._search(''))}
          />
        </div>
        <label class="switch-row"><input type="checkbox" .checked=${this._onlyChanged} @change=${(e: Event) => (this._onlyChanged = (e.target as HTMLInputElement).checked)} /> Only changed</label>
      </div>
      <p class="help status" role="status" aria-live="polite">Editing ${SCOPE_LABEL[this._scope]}. Previewing ${SCOPE_LABEL[this._mode]}.</p>
      ${this._scope === 'shared' && this._hasModes
        ? html`<p class="help">Shared applies to light and dark unless a mode sets its own value (the top level of the file).</p>`
        : nothing}
      ${!this.draft.editable ? html`<p class="help">This theme is read only${this.draft.reason ? `. ${this.draft.reason}` : ''} Copy it to edit.</p>` : nothing}
      <div class="groups">${this._groups()}</div>
      ${this.draft.editable
        ? html`<mcte-raw-rows
            .scopeLabel=${SCOPE_LABEL[this._scope]}
            .existing=${new Set(Object.keys((this._scope === 'shared' ? this._doc : (this._doc.modes?.[this._scope] ?? {})) as object))}
            .prefill=${this._rawPrefill}
            @mcte-add=${(e: CustomEvent) => (e.stopPropagation(), this._onAdd(e.detail.entries))}
          ></mcte-raw-rows>`
        : nothing}
    `;
  }

  private _previewPanel(): TemplateResult {
    return html`<mcte-theme-preview
      .doc=${this._previewDoc}
      .mode=${this._mode}
      .hass=${this.hass}
      @mcte-preview-mode=${(e: CustomEvent) => this._setMode(e.detail.mode as ThemeMode)}
    ></mcte-theme-preview>`;
  }

  private _strip(): TemplateResult {
    return html`<div class="strip">
      <div class="strip-bar">
        <button type="button" class="btn btn-text btn-sm" aria-expanded=${this._stripOpen ? 'true' : 'false'} @click=${() => (this._stripOpen = !this._stripOpen)}>
          ${this._stripOpen ? 'Hide live strip' : 'Show live strip'}
        </button>
        <button type="button" class="btn btn-text btn-sm" @click=${() => (this._panel = 'preview')}>Open preview</button>
      </div>
      ${this._stripOpen
        ? html`<div class="strip-sample" inert aria-hidden="true">
            <div class="mini-tile"><span class="dot"></span><span><b>Living room</b><br /><small>On</small></span></div>
            <span class="mini-btn">Button</span>
          </div>`
        : nothing}
    </div>`;
  }

  private _body(): TemplateResult {
    const layout = this._layout;
    const sticky = this._sticky;
    if (layout === 'wide') {
      return html`<div class="cols">
        <section class="pane vars" role="region" aria-label="Variables">${this._varsPanel()}</section>
        <section class="pane prev" role="region" aria-label="Preview">${this._previewPanel()}</section>
      </div>`;
    }
    return html`
      <div class="stack ${sticky ? 'sticky' : ''}">
        ${this._header()}
        <div class="tabs">
          <mcte-mode-switch
            full
            kind="tablist"
            label="Editor panels"
            .value=${this._panel}
            .options=${[
              { value: 'vars', label: 'Variables', controls: 'panel-vars' },
              { value: 'preview', label: 'Preview', controls: 'panel-preview' },
            ]}
            @mcte-change=${(e: CustomEvent) => (this._panel = e.detail.value)}
          ></mcte-mode-switch>
        </div>
        ${this._panel === 'vars' ? this._strip() : nothing}
      </div>
      <div class="panes">
        <section id="panel-vars" class="pane" role="tabpanel" aria-label="Variables" ?hidden=${this._panel !== 'vars'}>${this._varsPanel()}</section>
        <section id="panel-preview" class="pane" role="tabpanel" aria-label="Preview" ?hidden=${this._panel !== 'preview'}>${this._previewPanel()}</section>
      </div>
    `;
  }

  private _dialog(): TemplateResult | typeof nothing {
    const name = this._name;
    const cancel = html`<button type="button" class="btn btn-secondary" autofocus @click=${() => this._closeDlg()}>Cancel</button>`;
    const close = () => (this._dlg = null);
    const err = (t: string) => html`<p class="help error" role="alert">${icon('alert')}<span>${t}</span></p>`;
    switch (this._dlg) {
      case 'discard':
        return dialog(`Discard changes to ${name}?`, html`<p>You have changes that are not saved.</p>`, html`${cancel}
          <button type="button" class="btn btn-danger" @click=${() => this._discard()}>Discard</button>
          ${this._reason ? nothing : html`<button type="button" class="btn btn-primary" @click=${() => ((this._afterSave = 'back'), this._closeDlg(), void this._saveClick())}>Save</button>`}`, close);
      case 'first-save':
        return dialog('Save and rewrite this file?', html`<p>Saving rewrites ${name}.yaml. Comments in the file are removed. All variables, including ones this editor does not know, are kept.</p>`, html`${cancel}
          <button type="button" class="btn btn-primary" @click=${() => ((this._rewriteAck = true), this._closeDlg(), void this._doSave())}>Save</button>`, close);
      case 'delete':
        return dialog(`Delete ${name}?`, html`<p>This removes /config/${this._file ?? `themes/${name}.yaml`}. Screens that use it, such as wall tablets, switch to the default theme.</p>${this._dlgError ? err(this._dlgError) : nothing}`, html`${cancel}
          <button type="button" class="btn btn-danger" @click=${() => void this._delete()}>Delete</button>`, close);
      case 'add-modes':
        return dialog('Add light and dark modes?', html`<p>Variables you set now stay shared. You can then override any of them for light or dark.</p>`, html`${cancel}
          <button type="button" class="btn btn-primary" @click=${() => this._addModes()}>Add modes</button>`, close);
      case 'yaml': {
        const text = toYaml(name, this._doc);
        return dialog(`${name}.yaml`, html`<p class="help">The file Save would write. It is read only here.</p><pre class="code" tabindex="0" aria-label="YAML of ${name}">${text}</pre>`, html`
          <button type="button" class="btn btn-secondary" @click=${() => void copyText(text).then(() => this._say('Copied YAML'))}>${icon('copy')} Copy YAML</button>
          <button type="button" class="btn btn-primary" autofocus @click=${() => this._closeDlg()}>Close</button>`, close);
      }
      case 'rename':
        return dialog('Choose another name', html`<label class="lbl" for="rename">Name your theme</label>
          <input id="rename" class="input mono" .value=${this._renameValue} aria-invalid=${this._renameError ? 'true' : 'false'} @input=${(e: Event) => ((this._renameValue = (e.target as HTMLInputElement).value), (this._renameError = ''))} />
          ${this._renameError ? err(this._renameError) : html`<p class="help">Lowercase letters, numbers, hyphens and underscores. Used as the file name.</p>`}`, html`${cancel}
          <button type="submit" class="btn btn-primary">Use this name</button>`, close, (e) => (e.preventDefault(), this._applyRename()));
      default:
        return nothing;
    }
  }

  protected render(): TemplateResult {
    if (!this.draft) return html``;
    const layout = this._layout;
    return html`
      <div class="root ${layout} ${this._sticky ? 'is-sticky' : ''}" @keydown=${this._onKey}>
        ${layout === 'wide' ? html`<div class="stack">${this._header()}</div>` : nothing}
        ${this._body()}
      </div>
      <p class="sr-only" role="status">${this._msg}</p>
      ${this._toast
        ? html`<div class="toast" role="status" @mouseenter=${() => (this._toastPaused = true)} @mouseleave=${() => ((this._toastPaused = false), this._startToastTimer())} @focusin=${() => (this._toastPaused = true)} @focusout=${() => ((this._toastPaused = false), this._startToastTimer())}>
            <span>${this._toast.text}</span>
            ${this._toast.action ? html`<button type="button" @click=${() => this._toast?.action?.run()}>${this._toast.action.label}</button>` : nothing}
            <button type="button" aria-label="Dismiss" @click=${() => (this._toast = null)}>${icon('close')}</button>
          </div>`
        : nothing}
      ${this._dialog()}
    `;
  }

  static styles = [
    base,
    css`
      :host {
        display: block;
        height: 100%;
        background: var(--mc-ground);
        position: relative;
      }
      .root {
        height: 100%;
        display: flex;
        flex-direction: column;
        min-height: 0;
      }
      .root:not(.wide):not(.is-sticky) {
        overflow: auto;
        display: block;
      }
      .stack {
        background: var(--mc-surface);
        border-bottom: 1px solid var(--mc-divider);
        flex: none;
      }
      .hdr {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 16px;
        padding: 8px 12px;
        justify-content: space-between;
      }
      .left {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 10px;
        min-width: 0;
        flex: 1 1 auto;
      }
      .tname {
        font-size: 1rem;
        font-weight: 500;
        overflow-wrap: anywhere;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .mid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      .right {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        justify-content: flex-end;
      }
      .tryhelp {
        flex: 1 0 100%;
      }
      .tryhelp-menu {
        padding: 0 12px 8px;
        max-width: 280px;
      }
      .menuwrap {
        position: relative;
      }
      .menu {
        position: absolute;
        right: 0;
        top: calc(100% + 4px);
        z-index: 4;
        min-width: 220px;
        max-width: calc(100vw - 24px);
        padding: 4px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
        background: var(--mc-surface);
        box-shadow: var(--mc-shadow-float);
        display: grid;
      }
      .mi {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 40px;
        padding: 0 12px;
        border: 0;
        border-radius: var(--mc-radius);
        background: transparent;
        text-align: left;
        cursor: pointer;
        font-size: 0.875rem;
      }
      .mi:hover,
      .mi:focus-visible {
        background: var(--mc-surface-2);
      }
      .mi.danger {
        color: var(--mc-error-ink);
      }
      .btn.try .ico {
        width: 18px;
        height: 18px;
      }
      .cols {
        flex: 1 1 auto;
        min-height: 0;
        display: grid;
        grid-template-columns: minmax(360px, 440px) 1fr;
      }
      .pane {
        display: grid;
        gap: 12px;
        align-content: start;
        padding: 12px;
        min-width: 0;
      }
      .cols .pane {
        overflow: auto;
        min-height: 0;
      }
      .cols .vars {
        border-right: 1px solid var(--mc-divider);
      }
      .cols .prev {
        padding: 0;
      }
      .sticky {
        position: relative;
      }
      .root.is-sticky .panes {
        flex: 1 1 auto;
        min-height: 0;
        overflow: auto;
      }
      .tabs {
        padding: 0 12px 8px;
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
        margin-top: 8px;
        font-size: 0.9375rem;
        font-weight: 500;
        color: var(--mc-text-2);
      }
      .strip {
        padding: 0 12px 8px;
      }
      .strip-bar {
        display: flex;
        justify-content: space-between;
        gap: 8px;
      }
      .strip-sample {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 8px 12px;
        border-radius: var(--mc-radius-lg);
        background: var(--lovelace-background, var(--primary-background-color));
        color: var(--primary-text-color);
        min-height: 56px;
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
        width: 24px;
        height: 24px;
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
        min-height: 1.2em;
      }
      .wide .hdr {
        flex-wrap: wrap;
      }
      @media (max-width: 479px) {
        .hdr {
          padding: 6px 8px;
        }
      }
    `,
  ];
}
