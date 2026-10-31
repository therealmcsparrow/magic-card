import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { HomeAssistant, SliderModuleConfig } from '../../types';
import { SLIDER_LOOK_EDITOR_TAG } from '../../contracts/look-editor';
import { notice } from '../../ui-kit';
import { editorSystem } from '../../css/editor-stack';
import { loadLookEditor, lookEditorLoaded } from '../look-editor-loader';
import { t } from '../i18n';

/*
 * The Look block of the slider editor: <mc-slider-look-editor> once its chunk is in, a skeleton while loading, a status line with Try again on failure.
 * Open sections and the one-level Undo snapshot are kept per module for the session, never in YAML.
 */

interface Session {
  open: Set<string>;
  undo?: SliderModuleConfig;
  /** The config the preset or reset produced; any other change (say a new entity) ends the Undo, so it cannot overwrite it. */
  after?: string;
}
const sessions = new Map<string, Session>();
const SESSION_CAP = 64;

const sessionOf = (key: string): Session => {
  let s = sessions.get(key);
  if (!s) {
    if (sessions.size >= SESSION_CAP) sessions.delete(sessions.keys().next().value as string);
    s = { open: new Set() };
    sessions.set(key, s);
  }
  return s;
};

export class SliderLookHost extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .grp {
        display: grid;
        gap: 12px;
        min-width: 0;
      }
      .grp-h {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 600;
      }
      .skeleton {
        display: grid;
        gap: 8px;
      }
      .skeleton .bar {
        height: 56px;
        border-radius: var(--mc-radius, 8px);
        background: var(--mc-surface-2);
      }
      .skeleton:focus {
        outline: none;
      }
    `,
  ];

  @property({ attribute: false }) config?: SliderModuleConfig;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) template?: string;
  /** The entity the slider controls (a source or template entity resolved by the module editor). */
  @property({ attribute: false }) entity?: string;
  @property({ attribute: false }) onChange?: (next: SliderModuleConfig) => void;

  @state() private _look: 'loading' | 'ready' | 'failed' = lookEditorLoaded() ? 'ready' : 'loading';

  connectedCallback(): void {
    super.connectedCallback();
    if (this._look === 'loading') this._load();
  }

  private _load(focus = false): void {
    this._look = 'loading';
    void loadLookEditor().then((ok) => {
      this._look = ok ? 'ready' : 'failed';
    });
    if (focus) void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('.skeleton')?.focus());
  }

  private get _session(): Session {
    return sessionOf(`${this.template ?? ''}|${this.config?.id ?? ''}`);
  }

  protected render(): TemplateResult {
    const c = this.config;
    let body: TemplateResult | typeof nothing = nothing;
    if (!c) return html``;
    if (this._look === 'ready' && customElements.get(SLIDER_LOOK_EDITOR_TAG)) {
      const s = this._session;
      if (s.undo && s.after !== undefined && s.after !== JSON.stringify(c)) s.undo = s.after = undefined;
      body = html`<mc-slider-look-editor
        .config=${c}
        .hass=${this.hass}
        .template=${this.template}
        .entity=${this.entity}
        .open=${new Set(s.open)}
        .onToggle=${(name: string) => {
          if (s.open.has(name)) s.open.delete(name);
          else s.open.add(name);
          this.requestUpdate();
        }}
        .undo=${s.undo}
        .onUndoChange=${(snap: SliderModuleConfig | undefined) => {
          s.undo = snap;
          s.after = undefined;
          this.requestUpdate();
        }}
        .onChange=${(next: SliderModuleConfig) => {
          if (s.undo) s.after = JSON.stringify(next);
          this.onChange?.(next);
        }}
      ></mc-slider-look-editor>`;
    } else if (this._look === 'failed') {
      body = notice({ tone: 'warn', text: t("card-editor.slider-look-host.couldn-t-load-the-slider-looks"), action: { label: t('card-editor.slider-look-host.try-again'), onClick: () => this._load(true) } });
    } else if (this._look === 'loading') {
      body = html`<div class="skeleton" role="status" aria-busy="true" tabindex="-1">
        <span>${t('card-editor.slider-look-host.loading-slider-looks')}</span>
        <div class="bar"></div>
      </div>`;
    }
    // chunk in but the element not defined (a stub build): nothing to show, the General fields are all there is
    return html`<section class="grp" aria-labelledby="look-h">
      <h4 class="grp-h" id="look-h">${t('card-editor.slider-look-host.look')}</h4>
      ${body}
    </section>`;
  }
}

// guarded: a second copy of the bundle (or a hot reload) must not throw on a double define
if (!customElements.get('mc-slider-look-host')) customElements.define('mc-slider-look-host', SliderLookHost);
