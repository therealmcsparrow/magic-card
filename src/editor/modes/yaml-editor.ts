import { LitElement, html, css, TemplateResult, PropertyValues, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, EditorState, MagicCardConfig } from '../../types';
import { EditorStateManager } from '../state/editor-state';
import { editorStyles, yamlEditorStyles } from '../../css/editor-css';
import { editorTokens } from '../../css/editor-system';
import { editorPrimitives } from '../../ui-kit/css/primitives';
import type { LibraryHass } from '../../anim-studio/animation-library';
import { animLibrary } from '../../utils/anim-hooks';
import { customAnimationIds, embedCustomAnimations } from '../../utils/custom-animations';
import { toYaml } from '../../utils/yaml-utils';
import { withTemplateAnimations } from '../../services/template-merge';
import { t } from '../i18n';

/** Returns config with type, name, template ordered first in the YAML object */
export function orderedYamlConfig(config: MagicCardConfig | undefined): Record<string, unknown> {
  if (!config) return {};
  const { type, name, template, ...rest } = config;
  return { type, name, template, ...rest } as Record<string, unknown>;
}

/**
 * The YAML to copy: the ordered config, with `custom_animations` holding the library documents it
 * uses when `embed` is on (so the YAML still plays on an install without them).
 */
export function exportYaml(
  config: MagicCardConfig,
  embed: boolean,
  templateDocs?: unknown,
): { yaml: string; missing: string[] } {
  let out = orderedYamlConfig(config);
  let missing: string[] = [];
  if (embed) {
    // a linked card: the template's documents are found too (templateDocs: the editor's copy)
    const inline = animLibrary().inlineDocs(withTemplateAnimations(config, templateDocs));
    const r = embedCustomAnimations(out, (id) => animLibrary().get(id) ?? inline?.get(id));
    out = r.config;
    missing = r.missing;
  }
  // undefined keys (no name / template) are left out like ha-yaml-editor does
  return { yaml: toYaml(JSON.parse(JSON.stringify(out))), missing };
}

@customElement('mc-yaml-editor')
export class YamlEditor extends LitElement {
  static styles = [
    editorStyles,
    yamlEditorStyles,
    editorTokens,
    editorPrimitives,
    css`
      .export {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 12px;
        padding: 10px 12px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
        background: var(--mc-surface);
      }
      .export .txt {
        flex: 1 1 220px;
        min-width: 0;
        font-size: 0.8125rem;
        color: var(--mc-text-2);
      }
      .export .txt strong {
        color: var(--mc-text);
        font-weight: 500;
      }
      .export .opt {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 0.8125rem;
        cursor: pointer;
      }
      .export .status {
        flex-basis: 100%;
        margin: 0;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .export .status:empty {
        display: none;
      }
    `,
  ];

  @property({ attribute: false }) stateManager!: EditorStateManager;
  @property({ attribute: false }) hass?: HomeAssistant;

  @state() private _editorState?: EditorState;
  /** Embed the card's animations from the library in the copied YAML. */
  @state() private _embed = true;
  @state() private _status = '';
  @state() private _libVersion = 0;

  private _unsubscribe?: () => void;
  private _unsubLibrary?: () => void;
  private _suppressUpdate = false;

  connectedCallback(): void {
    super.connectedCallback();
    if (this.stateManager) {
      this._unsubscribe = this.stateManager.subscribe((s) => {
        this._editorState = s;
      });
    }
    this._unsubLibrary ??= animLibrary().subscribe(() => {
      this._libVersion = animLibrary().version;
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribe?.();
    this._unsubLibrary?.();
    this._unsubLibrary = undefined;
  }

  protected willUpdate(changed: PropertyValues): void {
    // only a card that uses animations from the library needs it (to embed them)
    if ((changed.has('hass') || changed.has('_editorState')) && this._customIds().length) {
      animLibrary().ensure(this.hass as unknown as LibraryHass | undefined);
    }
  }

  private _customIds(): string[] {
    return customAnimationIds(this._editorState?.config);
  }

  private async _copy(): Promise<void> {
    const config = this._editorState?.config;
    if (!config) return;
    const { yaml, missing } = exportYaml(config, this._embed, this._editorState?.templateAnimations);
    try {
      await navigator.clipboard.writeText(yaml);
      this._status = missing.length
        ? t('YAML copied. Not embedded (not found): {ids}.', { ids: missing.join(', ') })
        : this._embed
          ? t('YAML copied with your animations.')
          : t('YAML copied.');
    } catch {
      this._status = t('Copying failed: the browser blocked the clipboard.');
    }
  }

  private _renderExport(): TemplateResult | typeof nothing {
    const ids = this._customIds();
    if (!ids.length) return nothing;
    void this._libVersion;
    const n = ids.length;
    return html`
      <div class="export">
        <span class="txt"><strong>${t('Uses {n} of your animations.', { n })}</strong> ${t('{n, plural, one {Embed it to share this card with another Home Assistant.} other {Embed them to share this card with another Home Assistant.}}', { n })}</span>
        <label class="opt">
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${this._embed ? 'true' : 'false'}
            aria-label=${t('Embed my animations')}
            @click=${() => {
              this._embed = !this._embed;
              this._status = '';
            }}
          ></button>
          ${t('Embed my animations')}
        </label>
        <button type="button" class="btn btn-secondary btn-sm copy-yaml" @click=${() => this._copy()}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${t('Copy YAML')}
        </button>
        <p class="status" role="status" aria-live="polite">${this._status}</p>
      </div>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="mc-yaml-container">
        ${this._renderExport()}
        <div class="mc-yaml-editor-wrapper">
          <ha-yaml-editor
            .hass=${this.hass}
            .defaultValue=${orderedYamlConfig(this._editorState?.config)}
            @value-changed=${this._onYamlChanged}
          ></ha-yaml-editor>
        </div>
      </div>
    `;
  }

  private _onYamlChanged(e: CustomEvent): void {
    const value = e.detail.value;
    if (!this._editorState) return;
    this._suppressUpdate = true;

    try {
      if (value && typeof value === 'object') {
        const config: MagicCardConfig = {
          ...value,
          type: this._editorState.config.type,
        } as MagicCardConfig;
        this.stateManager.updateConfig(config);
      }
    } catch {
      // Errors displayed by ha-yaml-editor
    } finally {
      this._suppressUpdate = false;
    }
  }
}
