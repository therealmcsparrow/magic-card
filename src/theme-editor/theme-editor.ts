import { LitElement, html, css, nothing, PropertyValues, TemplateResult } from 'lit';
import type { PropertyDeclarations } from 'lit';
import { THEME_EDITOR_CONTRACT_VERSION } from '../contracts/theme-editor';
import type { IncludeStatus, ThemeBackend, ThemeBackendError, ThemeEditorElement, ThemeFileEntry, ThemeList } from '../contracts/theme-editor';
import { cloneDoc } from './model';
import { base } from './styles';
import { fire } from './util';
import { REASON_TEXT } from './start-view';
import type { CreateDetail } from './start-view';
import type { Draft } from './editor-view';
import './editor-view';
import './start-view';

type Phase = 'waiting' | 'loading' | 'ready' | 'failed';
type ListPhase = 'loading' | 'ready' | 'error';

const NOTICE_MS = 10_000;

/**
 * <magic-card-theme-editor>: the theme editor host (Contract theme-editor 1.0.0). The panel sets
 * `hass`, `narrow`, `backend` and `selectedName`. This shell waits for the backend, asks
 * magic-card.js for the editor chunk (mc-color-picker, mc-unit-field: window.MagicCard.loadEditor,
 * module-editor 1.0.0), then shows the theme list or one theme in the editor. It keeps the open
 * draft when the panel detaches it (tab switch) and mirrors the open theme through `mc-theme-select`.
 */
export class MagicCardThemeEditor extends LitElement implements ThemeEditorElement {
  static readonly contractVersion = THEME_EDITOR_CONTRACT_VERSION;

  static properties: PropertyDeclarations = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    backend: { attribute: false },
    selectedName: { attribute: false },
    _phase: { state: true },
    _listPhase: { state: true },
    _listError: { state: true },
    _files: { state: true },
    _loaded: { state: true },
    _include: { state: true },
    _draft: { state: true },
    _dirty: { state: true },
    _checking: { state: true },
    _checkResult: { state: true },
    _notice: { state: true },
  };

  hass: unknown;
  narrow = false;
  backend: ThemeBackend | undefined;
  selectedName: string | null = null;

  private _phase: Phase = 'waiting';
  private _listPhase: ListPhase = 'loading';
  private _listError = '';
  private _files: ThemeFileEntry[] = [];
  private _loaded: string[] = [];
  private _include: IncludeStatus | undefined;
  private _draft: Draft | undefined;
  private _dirty = false;
  private _checking = false;
  private _checkResult = '';
  private _notice = '';
  private _loading?: Promise<void>;
  private _noticeTimer?: ReturnType<typeof setTimeout>;
  private _opened: string | null = null;
  private readonly _beforeUnload = (e: BeforeUnloadEvent): void => {
    if (!this._dirty) return;
    e.preventDefault();
    e.returnValue = '';
  };

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('beforeunload', this._beforeUnload);
  }

  disconnectedCallback(): void {
    window.removeEventListener('beforeunload', this._beforeUnload);
    super.disconnectedCallback();
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('backend') && this.backend && this._phase === 'waiting') this._startLoad();
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has('selectedName') && this._phase === 'ready' && this._listPhase === 'ready') void this._openSelected();
  }

  private _startLoad(): void {
    this._phase = 'loading';
    this._loading ??= (async () => {
      const load = window.MagicCard?.loadEditor;
      const ok = await Promise.resolve(load?.()).then(
        (v) => v === true,
        () => false,
      );
      this._phase = ok ? 'ready' : 'failed';
      this._loading = undefined;
      if (ok) await this._loadList();
    })();
  }

  private async _loadList(): Promise<void> {
    const backend = this.backend;
    if (!backend) return;
    if (!this._files.length) this._listPhase = 'loading';
    try {
      const r: Partial<ThemeList> = await backend.list();
      this._files = r.files ?? [];
      this._loaded = r.loaded ?? [];
      this._include = r.include;
      this._listPhase = 'ready';
      this._listError = '';
      void this._openSelected();
    } catch (e) {
      this._listError = (e as ThemeBackendError).code === 'unauthorized' ? 'Only administrators can edit themes.' : ((e as Error).message ?? '');
      this._listPhase = 'error';
    }
  }

  private async _recheck(): Promise<void> {
    if (!this.backend || this._checking) return;
    this._checking = true;
    this._checkResult = '';
    try {
      const r = await this.backend.list();
      this._files = r.files ?? this._files;
      this._loaded = r.loaded ?? this._loaded;
      this._include = r.include;
      this._checkResult = r.include?.state === 'ok' ? 'Found it. You can save themes now.' : 'Still not found. Restart Home Assistant if you have just added the lines.';
    } catch (e) {
      this._checkResult = `The check failed. ${(e as Error).message ?? ''}`.trim();
    }
    this._checking = false;
  }

  private async _openSelected(): Promise<void> {
    const name = this.selectedName;
    if (!name || name === this._opened || this._dirty) return;
    await this._open(name);
  }

  private async _open(name: string): Promise<void> {
    if (!this.backend) return;
    try {
      const r = await this.backend.get(name);
      this._opened = name;
      this._draft = {
        name: r.name,
        doc: cloneDoc(r.theme),
        saved: cloneDoc(r.theme),
        file: r.file,
        mtime: r.mtime,
        editable: r.editable,
        reason: r.reason ? REASON_TEXT[r.reason] : undefined,
      };
      fire(this, 'mc-theme-select', { name: r.name });
    } catch (e) {
      this._say(`Could not open ${name}. ${(e as Error).message ?? ''}`.trim());
      fire(this, 'mc-theme-select', { name: null });
    }
  }

  private _create(d: CreateDetail): void {
    this._opened = null;
    this._draft = { name: d.name, doc: d.doc, saved: null, editable: true, from: d.from };
    fire(this, 'mc-theme-select', { name: null });
  }

  private _close(): void {
    this._draft = undefined;
    this._dirty = false;
    this._opened = null;
    fire(this, 'mc-theme-select', { name: null });
    void this._loadList();
  }

  private _say(text: string): void {
    this._notice = text;
    clearTimeout(this._noticeTimer);
    this._noticeTimer = setTimeout(() => (this._notice = ''), NOTICE_MS);
  }

  private _views(): TemplateResult {
    if (this._draft) {
      return html`<mcte-editor-view
        .draft=${this._draft}
        .hass=${this.hass}
        .backend=${this.backend}
        .include=${this._include}
        .checking=${this._checking}
        .checkResult=${this._checkResult}
        @mcte-back=${() => this._close()}
        @mcte-dirty=${(e: CustomEvent) => (this._dirty = !!e.detail.dirty)}
        @mcte-saved=${(e: CustomEvent) => {
          this._opened = e.detail.name;
          fire(this, 'mc-theme-select', { name: e.detail.name });
          void this._loadList();
        }}
        @mcte-rename=${(e: CustomEvent) => this._draft && (this._draft = { ...this._draft, name: e.detail.name })}
        @mcte-deleted=${(e: CustomEvent) => {
          this._say(`Deleted ${e.detail.name}.`);
          this._close();
        }}
        @mcte-recheck=${() => void this._recheck()}
      ></mcte-editor-view>`;
    }
    return html`<mcte-start-view
      .files=${this._files}
      .loaded=${this._loaded}
      .include=${this._include}
      .phase=${this._listPhase}
      .error=${this._listError}
      .hass=${this.hass}
      .backend=${this.backend}
      .checking=${this._checking}
      .checkResult=${this._checkResult}
      @mcte-open=${(e: CustomEvent) => void this._open(e.detail.name)}
      @mcte-create=${(e: CustomEvent<CreateDetail>) => this._create(e.detail)}
      @mcte-reload=${() => void this._loadList()}
      @mcte-recheck=${() => void this._recheck()}
      @mcte-deleted=${(e: CustomEvent) => {
        this._say(`Deleted ${e.detail.name}.`);
        void this._loadList();
      }}
    ></mcte-start-view>`;
  }

  protected render(): TemplateResult {
    switch (this._phase) {
      case 'waiting':
        return html`<p class="note" role="status">Waiting for Home Assistant to connect...</p>`;
      case 'loading':
        return html`<p class="note" role="status">Loading the theme editor...</p>`;
      case 'failed':
        return html`<div class="note" role="alert">
          <p>The theme editor could not load. Reload the page.</p>
          <details>
            <summary>Details</summary>
            <p>
              The editor parts of Magic Card could not be loaded. The editor ships with Magic Card as magic-card-theme-editor.js: update
              Magic Card to 2026.10.06 or newer if it keeps happening.
            </p>
          </details>
        </div>`;
      default:
        return html`${this._notice ? html`<p class="notice" role="status">${this._notice}</p>` : nothing}${this._views()}`;
    }
  }

  static styles = [
    base,
    css`
      :host {
        display: block;
        height: 100%;
        color: var(--primary-text-color);
        position: relative;
      }
      .note {
        margin: 16px;
      }
      .notice {
        position: absolute;
        z-index: 2;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 16px;
        border-radius: var(--mc-radius);
        background: var(--mc-text);
        color: var(--mc-surface);
      }
      mcte-start-view,
      mcte-editor-view {
        height: 100%;
      }
    `,
  ];
}
