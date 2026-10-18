import { t } from '../../i18n/labels';
import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, SeasonalConfig, SeasonalHoliday, SeasonalSceneSetting, SeasonalSetting } from '../../types';
import { editorSystem } from '../../css/editor-system';
import { autoScene, combineList, DEFAULT_CALENDAR, hemisphereOf, normalizeSeasonal, parseRange, SEASONAL_PICKS, zonedDay } from '../../utils/seasonal';
import { SEASONAL_PREVIEW_EVENT } from '../../utils/seasonal-preview';
import { SCENES } from '../../utils/seasonal-scenes';
import { seasonalPreviewDate, setSeasonalPreviewDate } from '../../utils/seasonal-preview';
import { fieldReset } from './field-reset';

import './entity-picker';
import './unit-field';

interface SceneTile {
  value: SeasonalSceneSetting;
  label: string;
  icon: string;
}

export const SEASONAL_TILES: SceneTile[] = [
  { value: 'auto', label: 'Auto', icon: 'mdi:calendar-star' },
  { value: 'winter', label: 'Winter', icon: 'mdi:snowflake' },
  { value: 'spring', label: 'Spring', icon: 'mdi:flower-tulip-outline' },
  { value: 'summer', label: 'Summer', icon: 'mdi:white-balance-sunny' },
  { value: 'autumn', label: 'Autumn', icon: 'mdi:leaf-maple' },
  { value: 'christmas', label: 'Christmas', icon: 'mdi:pine-tree' },
  { value: 'new_year', label: 'New Year', icon: 'mdi:party-popper' },
  { value: 'valentine', label: 'Valentine', icon: 'mdi:heart-outline' },
  { value: 'easter', label: 'Easter', icon: 'mdi:egg-easter' },
  { value: 'halloween', label: 'Halloween', icon: 'mdi:halloween' },
  { value: 'weather', label: 'Weather', icon: 'mdi:weather-partly-rainy' },
  { value: 'daynight', label: 'Day and night', icon: 'mdi:weather-night' },
  { value: 'none', label: 'None', icon: 'mdi:cancel' },
];

const LABEL: Record<string, string> = Object.fromEntries(SEASONAL_TILES.map((t) => [t.value, t.label]));

const HOLIDAYS: Array<{ key: SeasonalHoliday; label: string }> = [
  { key: 'christmas', label: 'Christmas' },
  { key: 'new_year', label: 'New Year' },
  { key: 'valentine', label: 'Valentine' },
  { key: 'easter', label: 'Easter' },
  { key: 'halloween', label: 'Halloween' },
];

type Opt = { value: string; label: string };
const LAYERS: Opt[] = [
  { value: 'back', label: 'Behind content' },
  { value: 'front', label: 'Over content' },
];
const HEMISPHERES: Opt[] = [
  { value: 'north', label: 'North' },
  { value: 'south', label: 'South' },
];

/** A calendar entry the resolver accepts: a range, one day, `off` (or false), `auto` (easter). */
export function validCalendarValue(holiday: SeasonalHoliday, v: string): boolean {
  const s = v.trim().toLowerCase();
  if (s === 'off' || (holiday === 'easter' && s === 'auto')) return true;
  return !!parseRange(s);
}

/** The intensity as the field shows it: a fraction (0.7) or a bare number as a percentage. */
function intensityText(v: unknown): string {
  if (v === undefined || v === null || v === '') return '';
  if (typeof v === 'number') return `${v > 0 && v <= 1 ? Math.round(v * 100) : v}%`;
  const s = String(v).trim();
  if (/^\d*\.?\d+$/.test(s)) {
    const n = parseFloat(s);
    return `${n > 0 && n <= 1 ? Math.round(n * 100) : n}%`;
  }
  return s;
}

/** `yyyy-mm-dd` of a local date (the date input's value). */
const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * The card's Seasonal section: a grid of scene tiles (Auto first, showing today's scene; None
 * removes `seasonal`, or writes `none` on a template-linked card), then the scene's options: layer,
 * intensity, decorations, off switch, weather entity, hemisphere, combined scenes, the holiday
 * calendar (collapsible) and an editor-only Preview date that drives the previews (never saved).
 */
@customElement('mc-seasonal-editor')
export class SeasonalEditor extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .seasonal-ed {
        display: grid;
        gap: 16px;
      }
      .pick {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 8px;
        align-items: center;
        container-type: inline-size;
      }
      .pick .select {
        min-width: 0;
      }
      .scene-ico {
        display: grid;
        place-items: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
        --mdc-icon-size: 20px;
      }
      @container (max-width: 259px) {
        .pick {
          grid-template-columns: 1fr;
        }
        .scene-ico {
          display: none;
        }
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      button.chip[aria-pressed='true'] {
        color: var(--mc-accent-ink);
        border-color: color-mix(in srgb, var(--mc-accent) 45%, transparent);
        background: var(--mc-accent-tint);
      }
      .cal {
        display: grid;
        gap: 12px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
      }
      .cal > .sector-btn {
        border-radius: var(--mc-radius-lg);
      }
      .cal-body {
        display: grid;
        gap: 16px;
        padding: 0 12px 16px;
      }
      .input[aria-invalid='true'] {
        border-color: var(--mc-error-ink);
      }
      .date-row {
        display: flex;
        gap: 8px;
      }
      .date-row .input {
        flex: 1;
        min-width: 0;
      }
    `,
  ];

  @property({ attribute: false }) value?: SeasonalSetting;
  @property({ attribute: false }) hass?: HomeAssistant;
  /** A template-linked card: None writes `seasonal: none` (a removed key would take the template's). */
  @property({ type: Boolean }) explicitNone = false;
  @property({ attribute: false }) onChange?: (next: SeasonalSetting | undefined) => void;

  @state() private _calendarOpen = false;
  /** Calendar text being typed that is not a valid range yet (shown, flagged, not written). */
  @state() private _draft: Partial<Record<SeasonalHoliday, string>> = {};
  @state() private _preview = '';

  private _onPreviewEvent = () => {
    const d = seasonalPreviewDate();
    this._preview = d ? isoDay(d) : '';
  };

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(SEASONAL_PREVIEW_EVENT, this._onPreviewEvent);
    this._onPreviewEvent();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener(SEASONAL_PREVIEW_EVENT, this._onPreviewEvent);
    // the preview date belongs to this editing session only
    if (this._preview) setSeasonalPreviewDate(undefined);
  }

  /** The config as an object; a malformed `combine` (one name, junk) read as a list. */
  private get _cfg(): SeasonalConfig {
    const cfg = normalizeSeasonal(this.value) ?? {};
    return cfg.combine === undefined || Array.isArray(cfg.combine) ? cfg : { ...cfg, combine: combineList(cfg) };
  }

  private get _scene(): SeasonalSceneSetting {
    if (this.value === undefined || this.value === null || this.value === false) return 'none';
    const s = this._cfg.scene ?? 'auto';
    return SEASONAL_TILES.some((t) => t.value === s) ? s : 'none';
  }

  /** Write the config without empty values (an object, or nothing / `none` for None). */
  private _write(next: SeasonalConfig): void {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(next)) {
      if (v === undefined || v === '' || (Array.isArray(v) && !v.length)) continue;
      if (k === 'calendar' && v && typeof v === 'object' && !Object.keys(v).length) continue;
      out[k] = v;
    }
    this.onChange?.(out as SeasonalConfig);
  }

  private _set(patch: Partial<SeasonalConfig>): void {
    this._write({ ...this._cfg, ...patch });
  }

  private _pick(scene: SeasonalSceneSetting): void {
    if (scene === 'none') {
      this.onChange?.(this.explicitNone ? 'none' : undefined);
      return;
    }
    const combine = combineList(this._cfg).filter((c) => c !== scene);
    this._write({ ...this._cfg, scene, combine });
  }

  /** What auto shows on the preview date (else today). */
  private _today(): string {
    const d = seasonalPreviewDate() ?? zonedDay(new Date(), this.hass);
    const scene = autoScene(d, this._cfg);
    const l = SCENES[scene]?.label;
    return l === undefined ? (LABEL[scene] ?? scene) : t(l);
  }

  private _picker(current: SeasonalSceneSetting): TemplateResult {
    const opt = (t: SceneTile) =>
      html`<option value=${t.value} ?selected=${t.value === current}>${t.value === 'auto' ? `Auto (${this._preview ? 'preview' : 'today'}: ${this._today()})` : t.label}</option>`;
    const tile = (v: string) => SEASONAL_TILES.find((t) => t.value === v)!;
    const group = (label: string, values: string[]) => html`<optgroup label=${label}>${values.map((v) => opt(tile(v)))}</optgroup>`;
    return html`<div class="pick">
      <span class="scene-ico" aria-hidden="true"><ha-icon icon=${tile(current).icon}></ha-icon></span>
      <div class="select">
        <select class="input" id="seasonal-scene" aria-label="Seasonal scene" @change=${(e: Event) => this._pick((e.target as HTMLSelectElement).value as SeasonalSceneSetting)}>
          ${opt(tile('auto'))}
          ${group('Seasons', ['winter', 'spring', 'summer', 'autumn'])}
          ${group('Holidays', ['christmas', 'new_year', 'valentine', 'easter', 'halloween'])}
          ${group('Live', ['weather', 'daynight'])}
          ${opt(tile('none'))}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    </div>`;
  }

  private _field(label: string, key: keyof SeasonalConfig | undefined, control: TemplateResult, forId?: string, help?: TemplateResult | string): TemplateResult {
    const v = key ? this._cfg[key] : undefined;
    const set = v !== undefined && v !== '' && !(Array.isArray(v) && !v.length);
    return html`
      <div class="field">
        <div class="field-head">
          ${forId ? html`<label for=${forId}>${label}</label>` : html`<span class="lbl">${label}</span>`}
          ${key ? fieldReset(label, set, () => this._set({ [key]: undefined })) : nothing}
        </div>
        ${control} ${help ? html`<p class="help">${help}</p>` : nothing}
      </div>
    `;
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
        >${o.label}</button>`;
      })}
    </div>`;
  }

  private _decorations(): TemplateResult {
    const on = this._cfg.decorations !== false;
    return html`<div class="switch-row">
      <div class="txt">
        <div class="field-head">
          <span class="lbl">Border decorations</span>
          ${fieldReset('Border decorations', this._cfg.decorations !== undefined, () => this._set({ decorations: undefined }))}
        </div>
        <p class="help">Lights, icicles, frost, a cobweb, a pumpkin or a flower vine along the border, for the scenes that have them. The content keeps clear of them.</p>
      </div>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${on ? 'true' : 'false'}
        aria-label="Border decorations"
        @click=${() => this._set({ decorations: on ? false : undefined })}
      ></button>
    </div>`;
  }

  private _combine(scene: SeasonalSceneSetting): TemplateResult {
    const list = combineList(this._cfg);
    const toggle = (s: SeasonalSceneSetting) =>
      this._set({ combine: list.includes(s) ? list.filter((c) => c !== s) : [...list, s] });
    return this._field(
      'Combine with',
      'combine',
      html`<div class="chips" role="group" aria-label="Combine with">
        ${SEASONAL_PICKS.filter((s) => s !== scene).map(
          (s) => html`<button type="button" class="chip" aria-pressed=${list.includes(s) ? 'true' : 'false'} @click=${() => toggle(s)}>
            ${LABEL[s] ?? s}
          </button>`,
        )}
      </div>`,
      undefined,
      'Extra scenes layered on top, like Day and night during winter.',
    );
  }

  private _writeCalendar(key: SeasonalHoliday, v: string | undefined): void {
    const cal = { ...(this._cfg.calendar ?? {}) };
    if (v === undefined) delete cal[key];
    else cal[key] = v;
    this._set({ calendar: Object.keys(cal).length ? cal : undefined });
  }

  private _calendarField(h: { key: SeasonalHoliday; label: string }): TemplateResult {
    const id = `seasonal-cal-${h.key}`;
    const stored = this._cfg.calendar?.[h.key];
    const storedText = stored === false ? 'off' : typeof stored === 'string' ? stored : '';
    const draft = this._draft[h.key];
    const text = draft ?? storedText;
    const invalid = draft !== undefined && draft.trim() !== '' && !validCalendarValue(h.key, draft);
    const set = stored !== undefined;
    const onInput = (e: InputEvent) => {
      const v = (e.target as HTMLInputElement).value;
      if (v.trim() === '') {
        this._draft = { ...this._draft, [h.key]: undefined };
        this._writeCalendar(h.key, undefined);
      } else if (validCalendarValue(h.key, v)) {
        this._draft = { ...this._draft, [h.key]: undefined };
        this._writeCalendar(h.key, v.trim().toLowerCase() === 'off' ? 'off' : v.trim());
      } else this._draft = { ...this._draft, [h.key]: v };
    };
    const reset = () => {
      this._draft = { ...this._draft, [h.key]: undefined };
      this._writeCalendar(h.key, undefined);
    };
    const errId = `${id}-err`;
    const input = (placeholder: string) => html`<input
      class="input mono"
      id=${id}
      type="text"
      spellcheck="false"
      autocomplete="off"
      placeholder=${placeholder}
      aria-invalid=${invalid ? 'true' : 'false'}
      aria-describedby=${invalid ? errId : nothing}
      .value=${text}
      @input=${onInput}
    />`;
    const error = invalid ? html`<p class="help error" id=${errId} role="alert">Use MM-DD..MM-DD, like 12-01..12-26, or off.</p>` : nothing;
    if (h.key === 'easter') {
      const auto = !set || storedText.trim().toLowerCase() === 'auto';
      return html`<div class="field">
        <div class="switch-row">
          <div class="txt">
            <div class="field-head">
              <span class="lbl">Easter</span>
              ${fieldReset('Easter', set, reset)}
            </div>
            <p class="help">Automatic: Palm Sunday to Easter Monday, worked out for each year.</p>
          </div>
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${auto ? 'true' : 'false'}
            aria-label="Easter dates automatic"
            @click=${() => (auto ? this._writeCalendar('easter', '04-01..04-07') : reset())}
          ></button>
        </div>
        ${auto ? nothing : html`${input('04-01..04-07')}${error}`}
      </div>`;
    }
    return html`<div class="field">
      <div class="field-head">
        <label for=${id}>${h.label}</label>
        ${fieldReset(h.label, set || draft !== undefined, reset)}
      </div>
      ${input(DEFAULT_CALENDAR[h.key])}${error}
    </div>`;
  }

  private _calendar(): TemplateResult {
    const open = this._calendarOpen;
    const n = Object.keys(this._cfg.calendar ?? {}).length;
    return html`<div class="cal">
      <button
        type="button"
        class="sector-btn"
        aria-expanded=${open ? 'true' : 'false'}
        aria-controls="seasonal-cal-body"
        @click=${() => (this._calendarOpen = !open)}
      >
        <ha-icon icon="mdi:calendar-range"></ha-icon>
        <span class="nm">Holiday dates</span>
        ${n ? html`<span class="chip is-count">${n} changed</span>` : nothing}
        <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${open
        ? html`<div class="cal-body" id="seasonal-cal-body">
            <p class="help">Auto shows a holiday between these dates (inclusive), else the season. A range may run over the new year. Type off to skip a holiday.</p>
            ${HOLIDAYS.map((h) => this._calendarField(h))}
          </div>`
        : nothing}
    </div>`;
  }

  private _previewDate(): TemplateResult {
    const id = 'seasonal-preview-date';
    return html`<div class="field">
      <div class="field-head">
        <label for=${id}>Preview date</label>
        ${fieldReset('Preview date', !!this._preview, () => setSeasonalPreviewDate(undefined))}
      </div>
      <input
        class="input"
        id=${id}
        type="date"
        .value=${this._preview}
        @change=${(e: Event) => {
          const v = (e.target as HTMLInputElement).value;
          const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
          setSeasonalPreviewDate(m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12) : undefined);
        }}
      />
      <p class="help">Shows Auto on another day in this preview only. Not saved.</p>
    </div>`;
  }

  protected updated(): void {
    // options inside an optgroup do not always take `selected`: set the value after render
    const sel = this.renderRoot.querySelector<HTMLSelectElement>('select#seasonal-scene');
    if (sel && sel.value !== this._scene) sel.value = this._scene;
  }

  protected render(): TemplateResult {
    const scene = this._scene;
    const cfg = this._cfg;
    const combine = combineList(cfg);
    const on = scene !== 'none' || !!combine.length;
    const settings = [scene, ...combine];
    const auto = settings.includes('auto');
    const weather = settings.includes('weather');
    return html`
      <div class="seasonal-ed">
        ${this._picker(scene)}
        ${on
          ? html`
              ${this._field('Layer', 'layer', this._seg('Layer', cfg.layer === 'front' ? 'front' : 'back', LAYERS, (v) => this._set({ layer: v === 'front' ? 'front' : undefined })), undefined, cfg.layer === 'front' ? 'Over the content, dimmed. Taps still reach the content.' : undefined)}
              ${this._field(
                'Intensity',
                'intensity',
                html`<mc-unit-field
                  .value=${intensityText(cfg.intensity)}
                  .label=${'Intensity'}
                  .units=${['%']}
                  .noCustom=${true}
                  .placeholder=${'50'}
                  .inputId=${'seasonal-intensity'}
                  @value-changed=${(e: CustomEvent) => this._set({ intensity: e.detail.value || undefined })}
                ></mc-unit-field>`,
                undefined,
                'How many particles: 100% is 24, the most a scene draws.',
              )}
              ${this._decorations()}
              ${weather
                ? this._field(
                    'Weather entity',
                    'weather_entity',
                    html`<mc-entity-picker
                      .hass=${this.hass}
                      .value=${cfg.weather_entity || ''}
                      .label=${'Weather entity'}
                      .domain=${'weather'}
                      @value-changed=${(e: CustomEvent) => this._set({ weather_entity: e.detail.value || undefined })}
                    ></mc-entity-picker>`,
                    undefined,
                    'Snow, rain, a storm, sun, clouds, fog or wind, from its state.',
                  )
                : nothing}
              ${this._field(
                'Off switch',
                'entity',
                html`<mc-entity-picker
                  .hass=${this.hass}
                  .value=${cfg.entity || ''}
                  .label=${'Off switch'}
                  @value-changed=${(e: CustomEvent) => this._set({ entity: e.detail.value || undefined })}
                ></mc-entity-picker>`,
                undefined,
                'An input_boolean or switch: off hides the scene, on every card that uses it.',
              )}
              ${auto
                ? this._field('Hemisphere', 'hemisphere', this._seg('Hemisphere', hemisphereOf(cfg.hemisphere), HEMISPHERES, (v) => this._set({ hemisphere: v === 'south' ? 'south' : undefined })), undefined, 'South flips the seasons.')
                : nothing}
              ${this._combine(scene)} ${auto ? this._calendar() : nothing} ${auto ? this._previewDate() : nothing}
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-seasonal-editor': SeasonalEditor;
  }
}
