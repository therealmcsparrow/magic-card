import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { LOOK_GALLERY_CHUNK_FILE } from '../contracts/lazy-module';
import { LOOK_GALLERY_BANNER_ID, LOOK_GALLERY_BUTTON_ID, LOOK_GALLERY_HINT_ID } from '../contracts/look-gallery';
import type { LookGalleryModule, LookGalleryOpenOptions } from '../contracts/look-gallery';
import type { HomeAssistant, MagicCardConfig } from '../types';
import { editorSystem } from '../css/editor-stack';
import { deepClone } from '../utils/deep-merge';
import type { EditorStateManager } from './state/editor-state';
import { t } from './i18n';

// The editor's side of the look gallery (contracts look-gallery 1.0.0, mcu-settings 1.0.0): the gate, and the one place the
// lazy chunk is imported. Nothing is fetched until openGallery runs.

type Settings = { lookGallery?: unknown; googleFonts?: unknown };
const settings = (): Settings | undefined => {
  const s = (window as unknown as { magicCardUtils?: { settings?: unknown } }).magicCardUtils?.settings;
  return s && typeof s === 'object' ? (s as Settings) : undefined;
};

/** True when Magic Card Utils is installed (it has a settings object). The off hint needs this. */
export const utilsPresent = (): boolean => settings() !== undefined;

/** The gate: both Magic Card Utils switches are on. Read on every call. */
export const lookGalleryAllowed = (): boolean => {
  const s = settings();
  return s?.lookGallery === true && s?.googleFonts === true;
};

const realImport = (): Promise<LookGalleryModule> => import(/* webpackChunkName: "look-gallery" */ '../look-gallery/index');
let importer = realImport;

/** Tests: replace the import (restored when omitted). */
export function __setLookGalleryImportForTests(load?: () => Promise<LookGalleryModule>): void {
  importer = load ?? realImport;
}

async function load(): Promise<LookGalleryModule> {
  try {
    return await importer();
  } catch (e) {
    if ((e as { name?: string })?.name !== 'ChunkLoadError') throw e;
    await new Promise((r) => setTimeout(r, 400));
    return importer();
  }
}

/**
 * Opens the gallery over the editor (appended to `host`). Resolves to the closer, or undefined when the gate is off or the chunk
 * did not load; `onClose` has then been called, so the editor has nothing left to clean up.
 */
export async function openGallery(host: HTMLElement, options: LookGalleryOpenOptions): Promise<(() => void) | undefined> {
  if (!lookGalleryAllowed()) return undefined;
  try {
    return (await load()).openLookGallery(host, options);
  } catch (e) {
    console.warn(`Magic Card: ${LOOK_GALLERY_CHUNK_FILE} did not load`, e);
    options.onClose();
    return undefined;
  }
}

/**
 * The entry in the card editor: the Browse looks button with the applied banner under it, or the off hint. The editor renders it
 * only when Magic Card Utils is installed. It writes through the editor's state manager, so the editor fires its one config-changed.
 */
@customElement('mc-look-entry')
export class LookEntry extends LitElement {
  @property({ attribute: false }) sm?: EditorStateManager;
  @property({ attribute: false }) hass?: HomeAssistant;
  /** The look just kept: its name, the config Undo restores and the config it produced (another change ends the banner). */
  @state() private _applied?: { name: string; before: MagicCardConfig; kept: string };
  private _open = false;
  private _off?: () => void;
  private readonly _settings = (): void => this.requestUpdate();

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('mcu-settings', this._settings);
    this._off = this.sm?.subscribe((s) => {
      if (this._applied && JSON.stringify(s.config) !== this._applied.kept) this._applied = undefined;
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('mcu-settings', this._settings);
    this._off?.();
    this._applied = undefined;
  }

  private readonly _openGallery = (): void => {
    const sm = this.sm;
    if (this._open || !this.hass || !sm) return;
    this._open = true;
    const before = deepClone(sm.getConfig());
    const done = (): void => {
      this._open = false;
    };
    const mount = this.renderRoot.querySelector<HTMLElement>('#mc-look-gallery-mount') ?? this;
    openGallery(mount, {
      hass: this.hass,
      config: before,
      onKeep: (config, kept) => {
        sm.updateConfig(deepClone(config));
        this._applied = { name: kept.name, before, kept: JSON.stringify(sm.getConfig()) };
      },
      onClose: done,
    }).then((close) => close || done(), done);
  };

  private readonly _undo = (): void => {
    const a = this._applied;
    if (!a || !this.sm) return;
    this._applied = undefined;
    this.sm.updateConfig(deepClone(a.before));
    this.renderRoot.querySelector<HTMLElement>('#' + LOOK_GALLERY_BUTTON_ID)?.focus();
  };

  protected render(): TemplateResult | typeof nothing {
    if (!utilsPresent()) return nothing;
    if (!lookGalleryAllowed()) return html`<p class="hint" id=${LOOK_GALLERY_HINT_ID}>${t('card-editor.magic-card-editor.look-gallery-turn-it-on-in-the-magic')}</p>`;
    const a = this._applied;
    return html`<button type="button" class="btn btn-secondary" id=${LOOK_GALLERY_BUTTON_ID} @click=${this._openGallery}>${t('card-editor.magic-card-editor.browse-looks')}</button>
<div id="mc-look-gallery-mount"></div>
${a ? html`<div class="banner" id=${LOOK_GALLERY_BANNER_ID} role="status" aria-live="polite"><span>${t('card-editor.magic-card-editor.look-name-applied', { name: a.name })}</span>
<button type="button" class="btn btn-secondary" @click=${this._undo}>${t('card-editor.magic-card-editor.undo')}</button>
<button type="button" class="btn btn-secondary" @click=${() => { this._applied = undefined; }}>${t('card-editor.magic-card-editor.dismiss')}</button></div>` : nothing}`;
  }

  static styles = [
    editorSystem,
    css`
:host { display: grid; gap: 8px; justify-items: start; margin-bottom: 8px; }
.hint { margin: 0; font-size: 0.8125rem; color: var(--mc-text-2); }
.banner { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 0.875rem; overflow-wrap: anywhere; }
`,
  ];
}
