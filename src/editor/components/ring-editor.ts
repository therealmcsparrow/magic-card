import { LitElement, html, css, PropertyValues, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { AnimationTrigger, ColorRange, HomeAssistant, RingConfig, ValueBound } from '../../types';
import { editorSystem } from '../../css/editor-system';
import { RING_DEFAULTS } from '../../utils/ring';
import { renderColorRangesField } from './color-ranges-field';
import { fieldReset } from './field-reset';
import { isTimer } from '../../utils/timer';

import './color-picker';
import './unit-field';
import './entity-picker';
import './attribute-picker';
import { t, m, type MessageId } from '../i18n';

type Opt = { value: string; label: MessageId };

const MODES: Opt[] = [
  { value: 'off', label: m('Off') },
  { value: 'value', label: m('Value') },
  { value: 'animated', label: m('Animated') },
];
const ANIMATIONS: Opt[] = [
  { value: 'snake', label: m('Snake') },
  { value: 'pulse', label: m('Pulse') },
  { value: 'full', label: m('Full') },
  { value: 'dots', label: m('Chase dots') },
  { value: 'dashes', label: m('Marching ants') },
];
const STARTS: Opt[] = [
  { value: 'top', label: m('Top') },
  { value: 'top-right', label: m('Top right') },
  { value: 'right', label: m('Right') },
  { value: 'bottom-right', label: m('Bottom right') },
  { value: 'bottom', label: m('Bottom') },
  { value: 'bottom-left', label: m('Bottom left') },
  { value: 'left', label: m('Left') },
  { value: 'top-left', label: m('Top left') },
];
const DIRECTIONS: Opt[] = [
  { value: 'cw', label: m('Clockwise') },
  { value: 'ccw', label: m('Counter-clockwise') },
];
const CAPS: Opt[] = [
  { value: 'round', label: m('Round') },
  { value: 'butt', label: m('Flat') },
];
const POSITIONS: Opt[] = [
  { value: 'inside', label: m('Inside') },
  { value: 'center', label: m('Centre') },
  { value: 'outside', label: m('Outside') },
];
const BOUND_MODES: Opt[] = [
  { value: 'number', label: m('Number') },
  { value: 'entity', label: m('Entity') },
];
const TIMER_FILLS: Opt[] = [
  { value: 'remaining', label: m('Remaining') },
  { value: 'elapsed', label: m('Elapsed') },
];
const SHOW: Array<Opt & { entity?: boolean }> = [
  { value: 'always', label: m('Always') },
  { value: 'entity_on', label: m('While entity is on'), entity: true },
  { value: 'state', label: m('While state equals…'), entity: true },
];

/**
 * The Ring section (design of a card, row, column or module): mode (Off / Value / Animated), the
 * fields of that mode, then the look (width, colours, start, direction, caps, glow, position) and
 * "Show". Every set field has a reset.
 */
@customElement('mc-ring-editor')
export class RingEditor extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .ring-ed,
      .bounds {
        display: grid;
        gap: 16px;
      }
    `,
  ];

  @property({ attribute: false }) ring?: RingConfig;
  @property({ attribute: false }) hass?: HomeAssistant;
  /** The module's entity (Value and Show default); empty for a card, row or column. */
  @property({ type: String }) defaultEntity = '';
  /** Card / row / column: Show options that read an entity need "Entity for show condition". */
  @property({ type: Boolean }) requireEntity = false;
  /** The card: ha-card clips its edge, so there is no Outside position (drawn Inside). */
  @property({ type: Boolean }) clipped = false;
  @property({ type: Boolean }) allowEntityColor = false;
  @property({ type: String }) entityColor = '';
  @property({ attribute: false }) onChange?: (ring: RingConfig | undefined) => void;
  /** Min / Max switched to Entity before an entity is picked (nothing to store yet). */
  @state() private _entityBound: { min?: boolean; max?: boolean } = {};

  private get _r(): RingConfig {
    return this.ring && typeof this.ring === 'object' ? this.ring : {};
  }

  /** The ring this editor last wrote (JSON), to tell its own edits from another ring being loaded. */
  private _emitted?: string;

  private _emit(ring: RingConfig | undefined): void {
    this._emitted = JSON.stringify(ring ?? null);
    this.onChange?.(ring);
  }

  private _set(patch: Partial<RingConfig>): void {
    const next = { ...this._r, ...patch } as Record<string, unknown>;
    for (const [k, v] of Object.entries(next)) if (v === undefined || v === '' || (typeof v === 'number' && Number.isNaN(v))) delete next[k];
    this._emit(next as RingConfig);
  }

  private _mode(v: string): void {
    if (v === 'off') this._emit(undefined);
    else this._set({ mode: v as RingConfig['mode'] });
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    // another ring (another element, undo, a YAML edit): Min / Max show what it stores again
    if (changed.has('ring') && JSON.stringify(this.ring ?? null) !== this._emitted) this._entityBound = {};
  }


  private _field(label: string, key: keyof RingConfig | undefined, control: TemplateResult, forId?: string, onReset?: () => void): TemplateResult {
    const set = key !== undefined && this._r[key] !== undefined && this._r[key] !== '';
    return html`
      <div class="field">
        <div class="field-head">
          ${forId ? html`<label for=${forId}>${label}</label>` : html`<span class="lbl">${label}</span>`}
          ${key ? fieldReset(label, set, onReset ?? (() => this._set({ [key]: undefined }))) : nothing}
        </div>
        ${control}
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
        >${t(o.label)}</button>`;
      })}
    </div>`;
  }

  private _select(id: string, value: string, options: Array<Opt & { disabled?: boolean }>, onPick: (v: string) => void): TemplateResult {
    return html`<div class="select">
      <select class="input" id=${id} @change=${(e: Event) => onPick((e.target as HTMLSelectElement).value)}>
        ${options.map((o) => html`<option value=${o.value} ?selected=${o.value === value} ?disabled=${!!o.disabled}>${t(o.label)}</option>`)}
      </select>
      <ha-icon icon="mdi:chevron-down"></ha-icon>
    </div>`;
  }

  private _number(id: string, key: keyof RingConfig, placeholder: number | string, min?: number, max?: number, step = 1): TemplateResult {
    const v = this._r[key];
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
        // While typing only a whole number writes: an intermediate "-" or "1e" (value '') keeps the old one.
        const s = (e.target as HTMLInputElement).value;
        const n = Number(s);
        if (s.trim() !== '' && Number.isFinite(n)) this._set({ [key]: n });
      }}
      @change=${(e: Event) => {
        // Committed empty (not a half-typed number): the value is cleared.
        const input = e.target as HTMLInputElement;
        if (input.value.trim() === '' && !input.validity?.badInput) this._set({ [key]: undefined });
      }}
    />`;
  }

  private _time(key: 'transition' | 'speed', label: string, placeholder: string): TemplateResult {
    return html`<mc-unit-field
      .value=${(this._r[key] as string) || ''}
      .label=${label}
      .units=${['s', 'ms']}
      .placeholder=${placeholder.replace(/m?s$/, '')}
      @value-changed=${(e: CustomEvent) => this._set({ [key]: e.detail.value })}
    ></mc-unit-field>`;
  }

  private _color(key: 'color' | 'track_color', label: string): TemplateResult {
    return html`<mc-color-picker
      .value=${(this._r[key] as string) || ''}
      .label=${label}
      .allowEntity=${this.allowEntityColor}
      .entityColor=${this.entityColor}
      .gradient=${key === 'color' ? 'linear' : ''}
      @value-changed=${(e: CustomEvent) => this._set({ [key]: e.detail.value })}
    ></mc-color-picker>`;
  }

  private _entity(key: 'entity' | 'trigger_entity', label: string, placeholder: string): TemplateResult {
    return html`<mc-entity-picker
      .hass=${this.hass}
      .value=${(this._r[key] as string) || ''}
      .label=${placeholder}
      @value-changed=${(e: CustomEvent) => this._set({ [key]: e.detail.value })}
    ></mc-entity-picker>`;
  }

  /** Min / Max: a number, or Entity (entity + attribute pickers), switched by a segmented control. */
  private _bound(key: 'min' | 'max', label: string): TemplateResult {
    const v = this._r[key];
    const linked = typeof v === 'object' && v !== null ? v : undefined;
    const mode = linked || this._entityBound[key] ? 'entity' : 'number';
    const pick = (m: string) => {
      this._entityBound = { ...this._entityBound, [key]: m === 'entity' };
      if ((m === 'entity') !== !!linked) this._set({ [key]: undefined });
    };
    const write = (b: ValueBound | undefined) => this._set({ [key]: b });
    const id = `ring-${key}`;
    const entity = linked?.entity || '';
    const hasAttrs = !!entity && Object.keys(this.hass?.states[entity]?.attributes || {}).length > 0;
    return this._field(
      label,
      key,
      html`${this._seg(t('{label} source', { label }), mode, BOUND_MODES, pick)}
        ${mode === 'number'
          ? this._number(id, key, RING_DEFAULTS[key], undefined, undefined, 0.1)
          : html`<mc-entity-picker
                .hass=${this.hass}
                .value=${entity}
                .label=${t('{label} entity', { label })}
                @value-changed=${(e: CustomEvent) => write(e.detail.value ? { entity: e.detail.value } : undefined)}
              ></mc-entity-picker>
              ${hasAttrs
                ? html`<mc-attribute-picker
                    .hass=${this.hass}
                    .entityId=${entity}
                    .value=${linked?.attribute || ''}
                    @value-changed=${(e: CustomEvent) => write(e.detail.value ? { entity, attribute: e.detail.value } : { entity })}
                  ></mc-attribute-picker>`
                : nothing}`}`,
      mode === 'number' ? id : undefined,
      () => {
        this._entityBound = { ...this._entityBound, [key]: false };
        write(undefined);
      },
    );
  }

  private _value(): TemplateResult {
    const r = this._r;
    const entity = r.entity || this.defaultEntity;
    // a timer fills from its remaining time: min, max and attribute do not apply
    const timer = isTimer(entity) && !r.attribute;
    const bound = (v: ValueBound | undefined, def: number) => (typeof v === 'number' ? v : def);
    return html`
      ${this._field(t('Entity'), 'entity', this._entity('entity', t('Entity'), this.defaultEntity ? t('Module entity ({entity})', { entity: this.defaultEntity }) : t('Entity')))}
      ${entity ? nothing : html`<p class="help">${t('Pick an entity: a value ring without one stays empty.')}</p>`}
      ${!timer && entity && this.hass?.states[entity] && Object.keys(this.hass.states[entity].attributes || {}).length
        ? this._field(
            t('Attribute'),
            'attribute',
            html`<mc-attribute-picker
              .hass=${this.hass}
              .entityId=${entity}
              .value=${r.attribute || ''}
              @value-changed=${(e: CustomEvent) => this._set({ attribute: e.detail.value })}
            ></mc-attribute-picker>`,
          )
        : nothing}
      ${timer
        ? this._field(
            t('Timer fill'),
            'timer_fill',
            html`${this._seg(t('Timer fill'), r.timer_fill ?? 'remaining', TIMER_FILLS, (v) => this._set({ timer_fill: v === 'remaining' ? undefined : (v as RingConfig['timer_fill']) }))}
              <p class="help">${t('Min, Max and Attribute do not apply to a timer; thresholds use its remaining %.')}</p>`,
          )
        : html`<div class=${typeof r.min === 'object' || typeof r.max === 'object' || this._entityBound.min || this._entityBound.max ? 'bounds' : 'two'}>
            ${this._bound('min', t('Min'))} ${this._bound('max', t('Max'))}
          </div>`}
      ${this._field(t('Fill transition'), 'transition', this._time('transition', t('Fill transition'), RING_DEFAULTS.transition))}
      ${renderColorRangesField(t('Thresholds'), r.thresholds, (t: ColorRange[] | undefined) => this._set({ thresholds: t }), {
        min: timer ? 0 : bound(r.min, RING_DEFAULTS.min),
        max: timer ? 100 : bound(r.max, RING_DEFAULTS.max),
        help: timer ? t('Ring colour from this remaining % up; overrides Colour.') : t('Ring colour from this value up; overrides Colour.'),
      })}
    `;
  }

  private _animated(): TemplateResult {
    const anim = this._r.animation ?? RING_DEFAULTS.animation;
    return html`
      ${this._field(t('Animation'), 'animation', this._select('ring-anim', anim, ANIMATIONS, (v) => this._set({ animation: v as RingConfig['animation'] })), 'ring-anim')}
      <div class="two">
        ${anim === 'snake' ? this._field(t('Length (%)'), 'length', this._number('ring-len', 'length', RING_DEFAULTS.length, 1, 99), 'ring-len') : nothing}
        ${anim === 'full' ? nothing : this._field(t('Speed'), 'speed', this._time('speed', t('Speed'), RING_DEFAULTS.speed))}
      </div>
    `;
  }

  private _position(): TemplateResult {
    const pick = (v: string) => this._set({ position: v as RingConfig['position'] });
    const pos = this._r.position ?? RING_DEFAULTS.position;
    if (!this.clipped) return this._field(t('Position'), 'position', this._seg(t('Position'), pos, POSITIONS, pick));
    const opts = POSITIONS.filter((o) => o.value !== 'outside');
    return this._field(
      t('Position'),
      'position',
      html`${this._seg(t('Position'), pos === 'outside' ? 'inside' : pos, opts, pick)}
        <p class="help">${t('The card clips its edge: the ring sits inside it and its glow shows inward.')}</p>`,
    );
  }

  private _show(): TemplateResult {
    const r = this._r;
    const trigger = (r.trigger as string) || 'always';
    const hasEntity = !!(r.trigger_entity || (!this.requireEntity && this.defaultEntity));
    const opts = SHOW.map((o) => ({ ...o, disabled: !!o.entity && !hasEntity && o.value !== trigger }));
    return html`
      ${this._field(
        t('Entity for show condition'),
        'trigger_entity',
        this._entity('trigger_entity', t('Entity for show condition'), this.defaultEntity && !this.requireEntity ? t('Module entity ({entity})', { entity: this.defaultEntity }) : t('Entity for show condition')),
      )}
      ${this._field(t('Show'), 'trigger', this._select('ring-show', trigger, opts, (v) => this._set({ trigger: v === 'always' ? undefined : (v as AnimationTrigger) })), 'ring-show')}
      ${!hasEntity && trigger !== 'always'
        ? html`<p class="help">${t('Pick an entity: this condition never shows the ring without one.')}</p>`
        : nothing}
      ${trigger === 'state'
        ? this._field(
            t('State value'),
            'state',
            html`<input class="input" id="ring-state" type="text" .value=${r.state || ''} @input=${(e: InputEvent) => this._set({ state: (e.target as HTMLInputElement).value })} />`,
            'ring-state',
          )
        : nothing}
    `;
  }

  protected render(): TemplateResult {
    const r = this._r;
    const mode = r.mode === 'value' || r.mode === 'animated' ? r.mode : 'off';
    return html`
      <div class="ring-ed">
        ${this._field(t('Mode'), undefined, this._seg(t('Ring mode'), mode, MODES, (v) => this._mode(v)))}
        ${mode === 'off'
          ? nothing
          : html`
              ${mode === 'value' ? this._value() : this._animated()}
              <div class="two">
                ${this._field(t('Width (px)'), 'width', this._number('ring-width', 'width', RING_DEFAULTS.width, 0.5, 40, 0.5), 'ring-width')}
                ${this._field(t('Glow (px)'), 'glow', this._number('ring-glow', 'glow', 0, 0, 40), 'ring-glow')}
              </div>
              ${this._field(t('Colour'), 'color', this._color('color', t('Ring colour')))}
              ${this._field(t('Track colour'), 'track_color', this._color('track_color', t('Track colour')))}
              ${this._field(t('Track opacity (%)'), 'track_opacity', this._number('ring-track-op', 'track_opacity', 100, 0, 100, 5), 'ring-track-op')}
              ${this._field(t('Start'), 'start', this._select('ring-start', r.start ?? RING_DEFAULTS.start, STARTS, (v) => this._set({ start: v as RingConfig['start'] })), 'ring-start')}
              ${this._field(t('Direction'), 'direction', this._seg(t('Direction'), r.direction ?? 'cw', DIRECTIONS, (v) => this._set({ direction: v as RingConfig['direction'] })))}
              ${this._field(t('Caps'), 'linecap', this._seg(t('Caps'), r.linecap ?? 'round', CAPS, (v) => this._set({ linecap: v as RingConfig['linecap'] })))}
              ${this._position()}
              ${this._show()}
            `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-ring-editor': RingEditor;
  }
}
