import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant, ValueBackgroundConfig } from '../../types';
import { editorSystem } from '../../css/editor-system';
import { VALUE_BG_DEFAULTS } from '../../utils/value-background';
import { entityStateColor } from '../../utils/entity-color';
import { share } from '../../icons/icon-fx';
import { fieldReset } from './field-reset';

import './color-picker';
import './unit-field';
import './entity-picker';
import './attribute-picker';

type Opt = { value: string; label: string };
type Key = keyof ValueBackgroundConfig;

const TYPES: Opt[] = [
  { value: 'off', label: 'Off' },
  { value: 'fill', label: 'Fill' },
  { value: 'sparkline', label: 'Sparkline' },
];
const DIRECTIONS: Opt[] = [
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
];

/** Keys only one type reads: dropped when switching to the other. */
const TYPE_KEYS: Record<'fill' | 'sparkline', Key[]> = {
  fill: ['direction', 'wave'],
  sparkline: ['hours', 'line_width', 'area', 'smoothing'],
};

/** A stored opacity (`25%`, 0.25 or 25) as the % field shows it. */
function opacityField(v: unknown): string {
  if (v === undefined || v === '') return '';
  const s = share(v);
  return s === undefined ? '' : `${Math.round(s * 1000) / 10}%`;
}

/**
 * The Value background section (design of a card, row, column or module): type (Off / Fill /
 * Sparkline), then the entity and the fields of that type. Off removes `value_background`;
 * switching type keeps the shared fields and drops the other type's. Every set field has a reset.
 */
@customElement('mc-value-bg-editor')
export class ValueBgEditor extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .vb-ed {
        display: grid;
        gap: 16px;
      }
    `,
  ];

  @property({ attribute: false }) value?: ValueBackgroundConfig;
  @property({ attribute: false }) hass?: HomeAssistant;
  /** The module's entity (the default); empty for a card, row or column (they need their own). */
  @property({ type: String }) defaultEntity = '';
  /**
   * Off writes `{ type: 'none' }` instead of removing the key, where a removed key would bring back
   * another value background (a template-linked element, a conditional rule over the default design).
   */
  @property({ type: Boolean }) explicitNone = false;
  @property({ attribute: false }) onChange?: (value: ValueBackgroundConfig | undefined) => void;

  private get _v(): ValueBackgroundConfig {
    return this.value && typeof this.value === 'object' ? this.value : {};
  }

  private get _type(): 'off' | 'fill' | 'sparkline' {
    const t = this._v.type;
    return t === 'fill' || t === 'sparkline' ? t : 'off';
  }

  private _set(patch: Partial<ValueBackgroundConfig>): void {
    const next = { ...this._v, ...patch } as Record<string, unknown>;
    for (const [k, v] of Object.entries(next)) if (v === undefined || v === '' || (typeof v === 'number' && Number.isNaN(v))) delete next[k];
    this.onChange?.(next as ValueBackgroundConfig);
  }

  private _pickType(t: string): void {
    if (t === 'off') {
      if (this.explicitNone && this._v.type === 'none') return;
      this.onChange?.(this.explicitNone ? { type: 'none' } : undefined);
      return;
    }
    if (t === this._type) return;
    const next = { ...this._v, type: t } as Record<string, unknown>;
    const other = t === 'fill' ? 'sparkline' : 'fill';
    for (const k of TYPE_KEYS[other]) delete next[k];
    for (const [k, v] of Object.entries(next)) if (v === undefined || v === '') delete next[k];
    this.onChange?.(next as ValueBackgroundConfig);
  }

  private _field(label: string, key: Key | undefined, control: TemplateResult, forId?: string, help?: string): TemplateResult {
    const v = key ? this._v[key] : undefined;
    const set = v !== undefined && v !== '';
    return html`
      <div class="field">
        <div class="field-head">
          ${forId ? html`<label for=${forId}>${label}</label>` : html`<span class="lbl">${label}</span>`}
          ${key ? fieldReset(label, set, () => this._set({ [key]: undefined })) : nothing}
        </div>
        ${control}
        ${help ? html`<p class="help">${help}</p>` : nothing}
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

  private _number(id: string, key: 'min' | 'max' | 'hours' | 'line_width', placeholder: number | string, min?: number, max?: number, step: number | 'any' = 'any'): TemplateResult {
    const v = this._v[key];
    return html`<input
      class="input"
      id=${id}
      type="number"
      min=${min ?? nothing}
      max=${max ?? nothing}
      step=${step}
      placeholder=${String(placeholder)}
      .value=${v === undefined ? '' : String(v)}
      @input=${(e: InputEvent) => {
        // a half-typed number ("-", "1e") keeps the stored value
        const s = (e.target as HTMLInputElement).value;
        const n = Number(s);
        if (s.trim() !== '' && Number.isFinite(n)) this._set({ [key]: n });
      }}
      @change=${(e: Event) => {
        const input = e.target as HTMLInputElement;
        if (input.value.trim() === '' && !input.validity?.badInput) this._set({ [key]: undefined });
      }}
    />`;
  }

  /** A switch for an option that is on by default: stored only while off (`false`). */
  private _switch(label: string, key: 'wave' | 'area' | 'smoothing', help: string): TemplateResult {
    const on = this._v[key] !== false;
    return html`<div class="switch-row">
      <div class="txt">
        <div class="field-head">
          <span class="lbl">${label}</span>
          ${fieldReset(label, this._v[key] !== undefined, () => this._set({ [key]: undefined }))}
        </div>
        <p class="help">${help}</p>
      </div>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${on ? 'true' : 'false'}
        aria-label=${label}
        @click=${() => this._set({ [key]: on ? false : undefined })}
      ></button>
    </div>`;
  }

  private _entityFields(entity: string): TemplateResult {
    const v = this._v;
    const stateObj = entity ? this.hass?.states?.[entity] : undefined;
    return html`
      ${this._field(
        'Entity',
        'entity',
        html`<mc-entity-picker
          .hass=${this.hass}
          .value=${v.entity || ''}
          .label=${this.defaultEntity ? `Module entity (${this.defaultEntity})` : 'Entity'}
          @value-changed=${(e: CustomEvent) => this._set({ entity: e.detail.value })}
        ></mc-entity-picker>`,
      )}
      ${entity ? nothing : html`<p class="help no-entity">Pick an entity: a value background without one draws nothing.</p>`}
      ${!v.entity && this.defaultEntity ? html`<p class="help">Empty uses the module entity (${this.defaultEntity}).</p>` : nothing}
      ${stateObj && Object.keys(stateObj.attributes || {}).length
        ? this._field(
            'Attribute',
            'attribute',
            html`<mc-attribute-picker
              .hass=${this.hass}
              .entityId=${entity}
              .value=${v.attribute || ''}
              @value-changed=${(e: CustomEvent) => this._set({ attribute: e.detail.value })}
            ></mc-attribute-picker>`,
          )
        : nothing}
    `;
  }

  private _look(type: 'fill' | 'sparkline', entity: string): TemplateResult {
    const v = this._v;
    const fill = type === 'fill';
    const stateObj = entity ? this.hass?.states?.[entity] : undefined;
    return html`
      ${this._field(
        'Color',
        'color',
        html`<mc-color-picker
          .value=${v.color || ''}
          .label=${fill ? 'Fill color' : 'Line color'}
          .allowEntity=${!!entity}
          .entityColor=${entityStateColor(stateObj) ?? 'currentColor'}
          @value-changed=${(e: CustomEvent) => this._set({ color: e.detail.value })}
        ></mc-color-picker>`,
      )}
      ${this._field(
        fill ? 'Fill opacity' : 'Area opacity',
        'opacity',
        html`<mc-unit-field
          .value=${opacityField(v.opacity)}
          .label=${fill ? 'Fill opacity' : 'Area opacity'}
          .units=${['%']}
          .noCustom=${true}
          .placeholder=${String(Math.round((fill ? VALUE_BG_DEFAULTS.opacity : VALUE_BG_DEFAULTS.areaOpacity) * 100))}
          .inputId=${'vb-opacity'}
          @value-changed=${(e: CustomEvent) => this._set({ opacity: e.detail.value || undefined })}
        ></mc-unit-field>`,
        undefined,
        fill
          ? undefined
          : `The area fades out upwards. The line stays faint (${Math.round(VALUE_BG_DEFAULTS.lineOpacity * 100)}%) so text over it stays readable.`,
      )}
    `;
  }

  private _range(fill: boolean): TemplateResult {
    return html`<div class="two">
      ${this._field('Min', 'min', this._number('vb-min', 'min', fill ? 0 : 'Auto'), 'vb-min')}
      ${this._field('Max', 'max', this._number('vb-max', 'max', fill ? 100 : 'Auto'), 'vb-max')}
    </div>`;
  }

  private _fill(): TemplateResult {
    const v = this._v;
    return html`
      ${this._field('Direction', 'direction', this._seg('Fill direction', v.direction ?? 'up', DIRECTIONS, (d) => this._set({ direction: d as ValueBackgroundConfig['direction'] })))}
      ${this._switch('Wave', 'wave', 'An animated wave on the surface. Still with reduced motion.')}
    `;
  }

  private _sparkline(): TemplateResult {
    return html`
      <div class="two">
        ${this._field('Hours', 'hours', this._number('vb-hours', 'hours', VALUE_BG_DEFAULTS.hours, 1, VALUE_BG_DEFAULTS.maxHours, 1), 'vb-hours', 'Up to 168 (a week).')}
        ${this._field('Line width (px)', 'line_width', this._number('vb-line', 'line_width', VALUE_BG_DEFAULTS.lineWidth, 0.5, 20, 0.5), 'vb-line')}
      </div>
      ${this._switch('Area', 'area', 'Fill the area under the line.')}
      ${this._switch('Smoothing', 'smoothing', 'A curved line instead of straight segments.')}
      <p class="help">History that can't be loaded draws nothing.</p>
    `;
  }

  protected render(): TemplateResult {
    const type = this._type;
    const entity = this._v.entity || this.defaultEntity;
    return html`
      <div class="vb-ed">
        ${this._field('Type', undefined, this._seg('Value background type', type, TYPES, (t) => this._pickType(t)))}
        ${type === 'off'
          ? nothing
          : html`
              ${this._entityFields(entity)}
              ${this._range(type === 'fill')}
              ${this._look(type, entity)}
              ${type === 'fill' ? this._fill() : this._sparkline()}
            `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-value-bg-editor': ValueBgEditor;
  }
}
