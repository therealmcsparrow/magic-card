import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, PopupConfig, PopupTrigger } from '../../types';
import { editorSystem } from '../../css/editor-stack';
import { POPUP_DEFAULTS, isValidPopupHash, normalizePopupHash } from '../../utils/popup-hash';
import { popupIfLoaded } from '../../card/popup-seam';
import { lazyChunks } from '../../utils/lazy-chunks';
import { fieldReset } from './field-reset';

import './unit-field';
import './entity-picker';
import { t, tx, m, tl, type MessageIndex } from '../i18n';

type Opt = { value: string; label: MessageIndex };

const STYLES: Opt[] = [
  { value: 'sheet', label: m('card-editor.popup-settings.sheet') },
  { value: 'dialog', label: m('card-editor.popup-settings.dialog') },
];

/**
 * The fields of a pop-up card (card settings → General → Pop-up, shown while "Show as pop-up" is
 * on): ID with its navigation path, look, close behaviour, triggers, and "Preview pop-up" which
 * opens the real pop-up of the card the editor previews. Every set field has a reset.
 */
@customElement('mc-popup-settings')
export class PopupSettings extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .popup-ed {
        display: grid;
        gap: 16px;
      }
      .path {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 6px;
        min-width: 0;
      }
      .path code {
        font-family: var(--mc-mono, 'Roboto Mono', ui-monospace, monospace);
        font-size: 0.8125rem;
        overflow-wrap: anywhere;
      }
      .two {
        align-items: start;
      }
      .trigger {
        display: grid;
        gap: 12px;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
    `,
  ];

  @property({ attribute: false }) popup?: PopupConfig;
  @property({ attribute: false }) hass?: HomeAssistant;
  /** Open the studio canvas card's pop-up (true) or HA's preview card's. */
  @property({ type: Boolean }) canvas = false;
  @property({ attribute: false }) onChange?: (popup: PopupConfig) => void;

  @state() private _status = '';
  private _statusTimer?: number;

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearTimeout(this._statusTimer);
  }

  private get _p(): PopupConfig {
    return this.popup && typeof this.popup === 'object' ? this.popup : {};
  }

  private _set(patch: Partial<PopupConfig>): void {
    const next = { ...this._p, ...patch } as Record<string, unknown>;
    for (const [k, v] of Object.entries(next)) {
      if (v === undefined || v === '' || (typeof v === 'number' && Number.isNaN(v))) delete next[k];
    }
    this.onChange?.(next as PopupConfig);
  }

  private _say(text: string): void {
    this._status = text;
    window.clearTimeout(this._statusTimer);
    this._statusTimer = window.setTimeout(() => {
      this._status = '';
    }, 2500);
  }

  private _field(label: string, key: keyof PopupConfig | undefined, control: TemplateResult, forId?: string, extra: TemplateResult | typeof nothing = nothing): TemplateResult {
    const v = key ? this._p[key] : undefined;
    const set = v !== undefined && v !== '';
    return html`
      <div class="field">
        <div class="field-head">
          ${forId ? html`<label for=${forId}>${label}</label>` : html`<span class="lbl">${label}</span>`}
          ${key ? fieldReset(label, set, () => this._set({ [key]: undefined })) : nothing}
        </div>
        ${control}${extra}
      </div>
    `;
  }

  private _text(id: string, key: 'hash' | 'title', placeholder: string, mono = false): TemplateResult {
    return html`<input
      class="input ${mono ? 'mono' : ''}"
      id=${id}
      type="text"
      spellcheck=${mono ? 'false' : nothing}
      autocomplete="off"
      placeholder=${placeholder}
      .value=${(this._p[key] as string) || ''}
      @input=${(e: InputEvent) => {
        const raw = (e.target as HTMLInputElement).value;
        this._set({ [key]: key === 'hash' ? normalizePopupHash(raw) : raw });
      }}
    />`;
  }

  private _unit(key: 'width' | 'max_height' | 'backdrop_blur', label: string, units: string[], placeholder: string): TemplateResult {
    return html`<mc-unit-field
      .value=${(this._p[key] as string) || ''}
      .label=${label}
      .units=${units}
      .placeholder=${placeholder}
      @value-changed=${(e: CustomEvent) => this._set({ [key]: e.detail.value })}
    ></mc-unit-field>`;
  }

  private _seg(label: string, value: string, options: Opt[], onPick: (v: string) => void): TemplateResult {
    const onKey = (e: KeyboardEvent) => {
      const i = options.findIndex((o) => o.value === value);
      const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (!(e.key in step)) return;
      e.preventDefault();
      const next = options[(i + step[e.key] + options.length) % options.length].value;
      const group = e.currentTarget as HTMLElement;
      onPick(next);
      requestAnimationFrame(() => group.querySelector<HTMLElement>(`[data-val="${next}"]`)?.focus());
    };
    return html`<div class="seg full" role="radiogroup" aria-label=${label} @keydown=${onKey}>
      ${options.map((o) => {
        const on = o.value === value;
        return html`<button
          type="button"
          role="radio"
          data-val=${o.value}
          aria-checked=${on ? 'true' : 'false'}
          tabindex=${on ? '0' : '-1'}
          @click=${() => onPick(o.value)}
        >${t(o.label)}</button>`;
      })}
    </div>`;
  }

  private _trigger(key: 'open_on' | 'close_on', label: string, help: string): TemplateResult {
    const trig: PopupTrigger = this._p[key] || {};
    const write = (patch: Partial<PopupTrigger>) => {
      const next = { ...(this._p[key] || {}), ...patch } as Record<string, unknown>;
      for (const [k, v] of Object.entries(next)) if (v === undefined || v === '') delete next[k];
      this._set({ [key]: Object.keys(next).length ? (next as PopupTrigger) : undefined });
    };
    const stateId = `popup-${key}-state`;
    return html`
      <div class="field">
        <div class="field-head">
          <span class="lbl">${label}</span>
          ${fieldReset(label, !!(trig.entity || trig.state), () => this._set({ [key]: undefined }))}
        </div>
        <div class="trigger">
          <mc-entity-picker
            .hass=${this.hass}
            .value=${trig.entity || ''}
            .label=${t('card-editor.popup-settings.entity')}
            @value-changed=${(e: CustomEvent) => write({ entity: e.detail.value })}
          ></mc-entity-picker>
          <input
            class="input"
            id=${stateId}
            type="text"
            aria-label=${t('card-editor.popup-settings.label-state', { label })}
            placeholder=${t('card-editor.popup-settings.state-e-g-on-empty-any-change')}
            .value=${trig.state || ''}
            @input=${(e: InputEvent) => write({ state: (e.target as HTMLInputElement).value.trim() })}
          />
        </div>
        <p class="help">${help}</p>
      </div>
    `;
  }

  private async _copy(path: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(path);
      this._say(t('card-editor.popup-settings.navigation-path-copied'));
    } catch {
      this._say(t('card-editor.popup-settings.copy-failed-select-the-path-and-copy-it'));
    }
  }

  /** The coordinator is in the popup chunk: load it (a previewed pop-up card has already asked for it), then ask. */
  private async _preview(): Promise<void> {
    await lazyChunks.popup.load();
    this._say(popupIfLoaded()?.api.preview(this.canvas) ? '' : t('card-editor.popup-settings.no-preview-of-this-card-to-open-yet'));
  }

  protected render(): TemplateResult {
    const p = this._p;
    const hash = normalizePopupHash(p.hash);
    const error = hash && !isValidPopupHash(hash) ? t('card-editor.popup-settings.use-letters-digits-and-only-no-spaces') : '';
    const path = isValidPopupHash(hash) ? `#${hash}` : '';
    const opacity = p.backdrop_opacity;
    const pathRow = error
      ? html`<p class="help error" role="alert">${error}</p>`
      : path
        ? html`
            <div class="path">
              <span class="help">${t('card-editor.popup-settings.navigation-path')}</span>
              <code>${path}</code>
              <button type="button" class="icon-btn sm" aria-label=${t('card-editor.popup-settings.copy-navigation-path')} title=${t('card-editor.popup-settings.copy-navigation-path')} @click=${() => this._copy(path)}>
                <ha-icon icon="mdi:content-copy"></ha-icon>
              </button>
            </div>
            <p class="help">${tx('card-editor.popup-settings.open-it-from-any-button-tap-action', { path: html`<span class="mono">${path}</span>` })}</p>
          `
        : html`<p class="help">${t('card-editor.popup-settings.without-an-id-it-opens-only-from-its')}</p>`;

    return html`
      <div class="popup-ed">
        ${this._field(t('card-editor.popup-settings.pop-up-id'), 'hash', this._text('popup-hash', 'hash', 'kitchen', true), 'popup-hash', pathRow)}
        ${this._field(t('card-editor.popup-settings.title'), 'title', this._text('popup-title', 'title', t('card-editor.popup-settings.no-header-text')), 'popup-title')}
        ${this._field(t('card-editor.popup-settings.style'), 'style', this._seg(t('card-editor.popup-settings.style'), p.style === 'dialog' ? 'dialog' : 'sheet', tl(STYLES) as unknown as Opt[], (v) => this._set({ style: v as PopupConfig['style'] })))}
        <div class="two">
          ${this._field(t('card-editor.popup-settings.width'), 'width', this._unit('width', t('card-editor.popup-settings.width'), ['px', '%', 'vw', 'rem', 'em'], POPUP_DEFAULTS.width.replace('px', '')))}
          ${this._field(t('card-editor.popup-settings.max-height'), 'max_height', this._unit('max_height', t('card-editor.popup-settings.max-height'), ['vh', 'px', '%', 'rem'], POPUP_DEFAULTS.max_height.replace('vh', '')))}
        </div>
        <div class="two">
          ${this._field(t('card-editor.popup-settings.backdrop-blur'), 'backdrop_blur', this._unit('backdrop_blur', t('card-editor.popup-settings.backdrop-blur'), ['px'], POPUP_DEFAULTS.backdrop_blur.replace('px', '')))}
          ${this._field(
            t('card-editor.popup-settings.backdrop-opacity'),
            'backdrop_opacity',
            html`<input
              class="input"
              id="popup-opacity"
              type="number"
              min="0"
              max="100"
              step="5"
              placeholder=${String(POPUP_DEFAULTS.backdrop_opacity * 100)}
              aria-describedby="popup-opacity-unit"
              .value=${opacity === undefined ? '' : String(Math.round((opacity > 1 ? opacity / 100 : opacity) * 100))}
              @input=${(e: InputEvent) => {
                const s = (e.target as HTMLInputElement).value;
                this._set({ backdrop_opacity: s === '' ? undefined : Math.min(100, Math.max(0, Number(s))) / 100 });
              }}
            /><p class="help" id="popup-opacity-unit">${t('card-editor.popup-settings.percent-0-is-no-darkening')}</p>`,
            'popup-opacity',
          )}
        </div>
        <div class="switch-row">
          <div class="txt"><div class="field-head"><label>${t('card-editor.popup-settings.show-close-button')}</label></div></div>
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${p.show_close !== false ? 'true' : 'false'}
            aria-label=${t('card-editor.popup-settings.show-close-button')}
            @click=${() => this._set({ show_close: p.show_close === false ? undefined : false })}
          ></button>
        </div>
        ${this._field(
          t('card-editor.popup-settings.auto-close'),
          'auto_close',
          html`<input
            class="input"
            id="popup-auto"
            type="number"
            min="0"
            step="1"
            placeholder=${t('card-editor.popup-settings.off')}
            .value=${p.auto_close ? String(p.auto_close) : ''}
            @input=${(e: InputEvent) => {
              const s = (e.target as HTMLInputElement).value;
              const n = Number(s);
              this._set({ auto_close: s === '' || !(n > 0) ? undefined : n });
            }}
          /><p class="help">${t('card-editor.popup-settings.seconds-without-interaction-empty-stays')}</p>`,
          'popup-auto',
        )}
        ${this._trigger('open_on', t('card-editor.popup-settings.open-when'), t('card-editor.popup-settings.opens-when-the-entity-changes-to-this'))}
        ${this._trigger('close_on', t('card-editor.popup-settings.close-when'), t('card-editor.popup-settings.closes-when-the-entity-changes-to-this'))}
        <div class="actions">
          <button type="button" class="btn btn-secondary btn-sm" @click=${() => this._preview()}>
            <ha-icon icon="mdi:eye-outline"></ha-icon>${t('card-editor.popup-settings.preview-pop-up')}
          </button>
          <span class="help" role="status" aria-live="polite">${this._status}</span>
        </div>
      </div>
    `;
  }
}
