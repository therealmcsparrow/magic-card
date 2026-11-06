import { LitElement, html, css, PropertyValues, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { AnimationTrigger, ColorRange, HomeAssistant, RingConfig, ValueBound } from '../../types';
import { editorSystem } from '../../css/editor-stack';
import { RING_DEFAULTS } from '../../utils/ring';
import { renderColorRangesField } from './color-ranges-field';
import { fieldReset } from './field-reset';
import { isTimer } from '../../utils/timer';

import './color-picker';
import './unit-field';
import './entity-picker';
import './attribute-picker';
import { t, m, type MessageIndex } from '../i18n';
import { readDirection } from '../../ui-kit/controllers/direction';

type Opt = { value: string; label: MessageIndex };

const MODES: Opt[] = [
  { value: 'off', label: m('card-editor.ring-editor.off') },
  { value: 'value', label: m('card-editor.ring-editor.value') },
  { value: 'animated', label: m('card-editor.ring-editor.animated') },
];
const ANIMATIONS: Opt[] = [
  { value: 'snake', label: m('card-editor.ring-editor.snake') },
  { value: 'pulse', label: m('card-editor.ring-editor.pulse') },
  { value: 'full', label: m('card-editor.ring-editor.full') },
  { value: 'dots', label: m('card-editor.ring-editor.chase-dots') },
  { value: 'dashes', label: m('card-editor.ring-editor.marching-ants') },
];
const STARTS: Opt[] = [
  { value: 'top', label: m('card-editor.ring-editor.top') },
  { value: 'top-right', label: m('card-editor.ring-editor.top-right') },
  { value: 'right', label: m('card-editor.ring-editor.right') },
  { value: 'bottom-right', label: m('card-editor.ring-editor.bottom-right') },
  { value: 'bottom', label: m('card-editor.ring-editor.bottom') },
  { value: 'bottom-left', label: m('card-editor.ring-editor.bottom-left') },
  { value: 'left', label: m('card-editor.ring-editor.left') },
  { value: 'top-left', label: m('card-editor.ring-editor.top-left') },
];
const DIRECTIONS: Opt[] = [
  { value: 'cw', label: m('card-editor.ring-editor.clockwise') },
  { value: 'ccw', label: m('card-editor.ring-editor.counter-clockwise') },
];
const CAPS: Opt[] = [
  { value: 'round', label: m('card-editor.ring-editor.round') },
  { value: 'butt', label: m('card-editor.ring-editor.flat') },
];
const POSITIONS: Opt[] = [
  { value: 'inside', label: m('card-editor.ring-editor.inside') },
  { value: 'center', label: m('card-editor.ring-editor.centre') },
  { value: 'outside', label: m('card-editor.ring-editor.outside') },
];
const BOUND_MODES: Opt[] = [
  { value: 'number', label: m('card-editor.ring-editor.number') },
  { value: 'entity', label: m('card-editor.ring-editor.entity') },
];
const TIMER_FILLS: Opt[] = [
  { value: 'remaining', label: m('card-editor.ring-editor.remaining') },
  { value: 'elapsed', label: m('card-editor.ring-editor.elapsed') },
];
const SHOW: Array<Opt & { entity?: boolean }> = [
  { value: 'always', label: m('card-editor.ring-editor.always') },
  { value: 'entity_on', label: m('card-editor.ring-editor.while-entity-is-on'), entity: true },
  { value: 'state', label: m('card-editor.ring-editor.while-state-equals'), entity: true },
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
      const h = readDirection(e.currentTarget as Element) === 'rtl' ? -1 : 1;
      const step: Record<string, number> = { ArrowRight: h, ArrowDown: 1, ArrowLeft: -h, ArrowUp: -1 };
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
      html`${this._seg(t('card-editor.ring-editor.label-source', { label }), mode, BOUND_MODES, pick)}
        ${mode === 'number'
          ? this._number(id, key, RING_DEFAULTS[key], undefined, undefined, 0.1)
          : html`<mc-entity-picker
                .hass=${this.hass}
                .value=${entity}
                .label=${t('card-editor.ring-editor.label-entity', { label })}
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
      ${this._field(t('card-editor.ring-editor.entity'), 'entity', this._entity('entity', t('card-editor.ring-editor.entity'), this.defaultEntity ? t('card-editor.ring-editor.module-entity-entity', { entity: this.defaultEntity }) : t('card-editor.ring-editor.entity')))}
      ${entity ? nothing : html`<p class="help">${t('card-editor.ring-editor.pick-an-entity-a-value-ring-without-one')}</p>`}
      ${!timer && entity && this.hass?.states[entity] && Object.keys(this.hass.states[entity].attributes || {}).length
        ? this._field(
            t('card-editor.ring-editor.attribute'),
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
            t('card-editor.ring-editor.timer-fill'),
            'timer_fill',
            html`${this._seg(t('card-editor.ring-editor.timer-fill'), r.timer_fill ?? 'remaining', TIMER_FILLS, (v) => this._set({ timer_fill: v === 'remaining' ? undefined : (v as RingConfig['timer_fill']) }))}
              <p class="help">${t('card-editor.ring-editor.min-max-and-attribute-do-not-apply-to-a')}</p>`,
          )
        : html`<div class=${typeof r.min === 'object' || typeof r.max === 'object' || this._entityBound.min || this._entityBound.max ? 'bounds' : 'two'}>
            ${this._bound('min', t('card-editor.ring-editor.min'))} ${this._bound('max', t('card-editor.ring-editor.max'))}
          </div>`}
      ${this._field(t('card-editor.ring-editor.fill-transition'), 'transition', this._time('transition', t('card-editor.ring-editor.fill-transition'), RING_DEFAULTS.transition))}
      ${renderColorRangesField(t('card-editor.ring-editor.thresholds'), r.thresholds, (t: ColorRange[] | undefined) => this._set({ thresholds: t }), {
        min: timer ? 0 : bound(r.min, RING_DEFAULTS.min),
        max: timer ? 100 : bound(r.max, RING_DEFAULTS.max),
        help: timer ? t('card-editor.ring-editor.ring-colour-from-this-remaining-up') : t('card-editor.ring-editor.ring-colour-from-this-value-up-overrides'),
      })}
    `;
  }

  private _animated(): TemplateResult {
    const anim = this._r.animation ?? RING_DEFAULTS.animation;
    return html`
      ${this._field(t('card-editor.ring-editor.animation'), 'animation', this._select('ring-anim', anim, ANIMATIONS, (v) => this._set({ animation: v as RingConfig['animation'] })), 'ring-anim')}
      <div class="two">
        ${anim === 'snake' ? this._field(t('card-editor.ring-editor.length'), 'length', this._number('ring-len', 'length', RING_DEFAULTS.length, 1, 99), 'ring-len') : nothing}
        ${anim === 'full' ? nothing : this._field(t('card-editor.ring-editor.speed'), 'speed', this._time('speed', t('card-editor.ring-editor.speed'), RING_DEFAULTS.speed))}
      </div>
    `;
  }

  private _position(): TemplateResult {
    const pick = (v: string) => this._set({ position: v as RingConfig['position'] });
    const pos = this._r.position ?? RING_DEFAULTS.position;
    if (!this.clipped) return this._field(t('card-editor.ring-editor.position'), 'position', this._seg(t('card-editor.ring-editor.position'), pos, POSITIONS, pick));
    const opts = POSITIONS.filter((o) => o.value !== 'outside');
    return this._field(
      t('card-editor.ring-editor.position'),
      'position',
      html`${this._seg(t('card-editor.ring-editor.position'), pos === 'outside' ? 'inside' : pos, opts, pick)}
        <p class="help">${t('card-editor.ring-editor.the-card-clips-its-edge-the-ring-sits')}</p>`,
    );
  }

  private _show(): TemplateResult {
    const r = this._r;
    const trigger = (r.trigger as string) || 'always';
    const hasEntity = !!(r.trigger_entity || (!this.requireEntity && this.defaultEntity));
    const opts = SHOW.map((o) => ({ ...o, disabled: !!o.entity && !hasEntity && o.value !== trigger }));
    return html`
      ${this._field(
        t('card-editor.ring-editor.entity-for-show-condition'),
        'trigger_entity',
        this._entity('trigger_entity', t('card-editor.ring-editor.entity-for-show-condition'), this.defaultEntity && !this.requireEntity ? t('card-editor.ring-editor.module-entity-entity', { entity: this.defaultEntity }) : t('card-editor.ring-editor.entity-for-show-condition')),
      )}
      ${this._field(t('card-editor.ring-editor.show'), 'trigger', this._select('ring-show', trigger, opts, (v) => this._set({ trigger: v === 'always' ? undefined : (v as AnimationTrigger) })), 'ring-show')}
      ${!hasEntity && trigger !== 'always'
        ? html`<p class="help">${t('card-editor.ring-editor.pick-an-entity-this-condition-never')}</p>`
        : nothing}
      ${trigger === 'state'
        ? this._field(
            t('card-editor.ring-editor.state-value'),
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
        ${this._field(t('card-editor.ring-editor.mode'), undefined, this._seg(t('card-editor.ring-editor.ring-mode'), mode, MODES, (v) => this._mode(v)))}
        ${mode === 'off'
          ? nothing
          : html`
              ${mode === 'value' ? this._value() : this._animated()}
              <div class="two">
                ${this._field(t('card-editor.ring-editor.width-px'), 'width', this._number('ring-width', 'width', RING_DEFAULTS.width, 0.5, 40, 0.5), 'ring-width')}
                ${this._field(t('card-editor.ring-editor.glow-px'), 'glow', this._number('ring-glow', 'glow', 0, 0, 40), 'ring-glow')}
              </div>
              ${this._field(t('card-editor.ring-editor.colour'), 'color', this._color('color', t('card-editor.ring-editor.ring-colour')))}
              ${this._field(t('card-editor.ring-editor.track-colour'), 'track_color', this._color('track_color', t('card-editor.ring-editor.track-colour')))}
              ${this._field(t('card-editor.ring-editor.track-opacity'), 'track_opacity', this._number('ring-track-op', 'track_opacity', 100, 0, 100, 5), 'ring-track-op')}
              ${this._field(t('card-editor.ring-editor.start'), 'start', this._select('ring-start', r.start ?? RING_DEFAULTS.start, STARTS, (v) => this._set({ start: v as RingConfig['start'] })), 'ring-start')}
              ${this._field(t('card-editor.ring-editor.direction'), 'direction', this._seg(t('card-editor.ring-editor.direction'), r.direction ?? 'cw', DIRECTIONS, (v) => this._set({ direction: v as RingConfig['direction'] })))}
              ${this._field(t('card-editor.ring-editor.caps'), 'linecap', this._seg(t('card-editor.ring-editor.caps'), r.linecap ?? 'round', CAPS, (v) => this._set({ linecap: v as RingConfig['linecap'] })))}
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
