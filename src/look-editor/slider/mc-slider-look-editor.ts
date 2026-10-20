import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { HomeAssistant, SliderModuleConfig } from '../../types';
import { LOOK_UNDO_TOAST_MS, SLIDER_LOOK_EDITOR_TAG, type SliderLookEditorElement } from '../../contracts/look-editor';
import { SLIDER_LOOK_DEFAULTS } from '../../contracts/slider-look.defaults';
import type { SliderStop, SliderThumb, SliderTrackStyle } from '../../contracts/slider-look';
import { editorSystem } from '../../css/editor-stack';
import { kitNotice } from '../../ui-kit/css';
import { lazyChunks } from '../../utils/lazy-chunks';
import { field, switchRow } from '../../ui-kit/templates/field';
import { seg } from '../../ui-kit/templates/choice';
import { notice } from '../../ui-kit/templates/status';
import { numericControl } from '../../utils/entity-control';
import { entityStateColor } from '../../utils/entity-color';
import { t } from '../i18n';
import { SLIDER_PRESETS, TRACK_TILES } from './presets';
import {
  MAX_STOPS, STOP_LABEL_CHARS, applyPreset, changedCount, evenStops, hasLookKeys, hiddenRefused, levelUnreadable, lookStatus, nextStopValue,
  positionPatch, readStops, resetLook, sortStops, stopInRange, thumbPatch, valuePosition, withKeys, type ValuePosition,
} from './logic';

/*
 * <mc-slider-look-editor> (contract look-editor 1.0.0 r2, designer 03 section 2 with the 12 deltas). The Look block of the
 * slider editor: presets, then Track and fill, Handle, Value display, Shape and Stops. Nothing is written on mount (AC3);
 * every change is one `onChange` with the whole next config; presets and Reset look are one change each with the Undo
 * routes (toast, 20 s, and a persistent button). Only SLIDER_LOOK_KEYS, slider_color, track_color and show_value are written.
 */

type Bag = Record<string, unknown>;
type Section = 'track' | 'thumb' | 'value' | 'shape' | 'stops';
const AUTO_ATTRS = new Set(['brightness', 'color_temp', 'color_temp_kelvin']);

export class SliderLookEditor extends LitElement implements SliderLookEditorElement {
  static styles = [
    editorSystem,
    kitNotice,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .look {
        display: grid;
        gap: 12px;
      }
      .bar {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
      }
      .bar .status {
        margin: 0;
        flex: 1 1 12em;
      }
      .bar .btns {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .body {
        display: grid;
        gap: 12px;
        padding-top: 8px;
      }
      .two {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr));
        gap: 12px;
      }
      .stop {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) auto;
        gap: 8px;
        align-items: end;
      }
      .stop-err {
        grid-column: 1 / -1;
        margin: 0;
      }
      .inline {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: end;
      }
      .inline .input {
        width: 6rem;
      }
      .look p {
        margin: 0;
      }
    `,
  ];

  @property({ attribute: false }) config: SliderModuleConfig = { type: 'slider' } as SliderModuleConfig;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) template?: string;
  /** The entity the slider controls (the host resolves a template or source entity); falls back to config.entity. */
  @property({ attribute: false }) entity?: string;
  @property({ attribute: false }) open: ReadonlySet<string> = new Set();
  @property({ attribute: false }) onToggle?: (section: string) => void;
  @property({ attribute: false }) undo?: SliderModuleConfig;
  @property({ attribute: false }) onUndoChange?: (snapshot: SliderModuleConfig | undefined) => void;
  @property({ attribute: false }) onChange?: (next: SliderModuleConfig) => void;

  /** Sections opened here when the host passes no onToggle (a bare mount). */
  private _own = new Set<string>();
  /** The user closed Track and fill, which is open by itself while a look key is set. */
  @state() private _trackClosed = false;
  @state() private _undoLabel = '';
  @state() private _refused = false;
  @state() private _rm = false;
  @state() private _evenly = 3;

  // ── state helpers ──

  private get _c(): SliderModuleConfig {
    return this.config;
  }
  private get _eid(): string | undefined {
    return this.entity ?? this._c.entity;
  }
  private get _stateObj() {
    const e = this._eid;
    return e ? this.hass?.states?.[e] : undefined;
  }
  private get _isLight(): boolean {
    return !!this._eid?.startsWith('light.');
  }
  private get _autoOk(): boolean {
    const a = this._c.attribute;
    return a ? AUTO_ATTRS.has(a) : this._isLight;
  }
  private get _range(): { min: number; max: number; step: number } {
    const c = this._c;
    const so = this._stateObj;
    if (!so) return { min: c.min ?? 0, max: c.max ?? 100, step: c.step ?? 1 };
    const own = numericControl(this.hass, so, c.attribute, { min: c.min, max: c.max, step: c.step });
    return { min: own.min, max: own.max, step: own.step };
  }

  private _isOpen(name: Section): boolean {
    const set = this.onToggle ? this.open : this._own;
    if (name === 'track') return !this._trackClosed && (set.has(name) || hasLookKeys(this._c));
    return set.has(name);
  }

  private _toggleSection(name: Section, want: boolean): void {
    if (name === 'track') this._trackClosed = !want;
    const set = this.onToggle ? this.open : this._own;
    if (set.has(name) === want) return;
    if (this.onToggle) this.onToggle(name);
    else {
      if (want) this._own.add(name);
      else this._own.delete(name);
      this.requestUpdate();
    }
  }

  // ── writes ──

  /** One field edit: the whole next config; the inline Undo ends with the first edit of a look field. */
  private _set(patch: Bag): void {
    const next = withKeys(this._c, patch);
    if (JSON.stringify(next) === JSON.stringify(this._c)) return;
    this._rm = false;
    this._refused = false;
    if (this.undo) this.onUndoChange?.(undefined);
    this._undoLabel = '';
    this.onChange?.(next);
  }

  private _toast(text: string, undoable: boolean): void {
    const el = this.renderRoot.querySelector('mc-ui-toast') as (HTMLElement & { show?: (o: unknown) => void }) | null;
    el?.show?.({ text, action: undoable ? { id: 'undo', label: t('Undo') } : undefined, duration: LOOK_UNDO_TOAST_MS });
  }

  /** The card draws the look with the slider-look chunk: when it cannot load, say so here (the settings are saved, the card keeps the standard slider). */
  private _watchChunk(): void {
    void lazyChunks['slider-look'].load().then(() => this.requestUpdate());
  }

  private _applyPreset(id: string): void {
    const p = SLIDER_PRESETS.find((x) => x.id === id);
    if (!p) return;
    const prev = this._c;
    const next = applyPreset(prev, p.id);
    const n = changedCount(prev, next);
    const name = t(p.label);
    this._refused = false;
    this._rm = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!n) {
      this._toast(t('{name} look is already applied.', { name }), false);
      return;
    }
    this._undoLabel = t('Undo {name} look', { name });
    this.onUndoChange?.(prev);
    this.onChange?.(next);
    this._watchChunk();
    this._toast(t('{name} look applied. {count}.', { name, count: this._countText(n) }), true);
  }

  private _reset(): void {
    const prev = this._c;
    const next = resetLook(prev);
    const n = changedCount(prev, next);
    if (!n) return;
    this._rm = false;
    this._undoLabel = t('Undo reset');
    this.onUndoChange?.(prev);
    this.onChange?.(next);
    this._toast(t('Look reset. {count}.', { count: this._countText(n, true) }), true);
  }

  private _countText(n: number, removed = false): string {
    return removed
      ? t('{n, plural, one {# setting removed} other {# settings removed}}', { n })
      : t('{n, plural, one {# setting changed} other {# settings changed}}', { n });
  }

  private _undo(): void {
    const snap = this.undo;
    if (!snap) return;
    this._undoLabel = '';
    this._rm = false;
    this.onUndoChange?.(undefined);
    this.onChange?.(snap);
    // the Undo button is gone after this: keep focus in the group (Reset look) and say what happened
    this._toast(t('Look change undone.'), false);
    void this.updateComplete.then(() => {
      const reset = this.renderRoot.querySelector<HTMLButtonElement>('[data-role=reset]');
      // Reset look is disabled when the undo left no look keys: the preset chips are the next place
      const chip = this.renderRoot.querySelector('mc-ui-chip-group')?.shadowRoot?.querySelector<HTMLElement>('[tabindex="0"]');
      (reset && !reset.disabled ? reset : chip)?.focus();
    });
  }

  // ── field helpers ──

  private _fieldOf(key: string, label: string, control: TemplateResult, help?: string, id = `sl-${key}`): TemplateResult {
    const set = (this._c as Bag)[key] !== undefined;
    return field({
      id,
      label,
      help,
      control,
      onReset: set ? () => this._set({ [key]: undefined }) : undefined,
      resetLabel: t('Reset {label}', { label: label.toLowerCase() }),
    });
  }

  private _num(key: string, label: string, o: { placeholder: number | string; min: number; max: number; step?: number; help?: string; disabled?: boolean }): TemplateResult {
    const id = `sl-${key}`;
    const v = (this._c as Bag)[key];
    return this._fieldOf(
      key,
      label,
      html`<input
        class="input"
        id=${id}
        type="number"
        min=${o.min}
        max=${o.max}
        step=${o.step ?? 1}
        placeholder=${String(o.placeholder)}
        ?disabled=${o.disabled}
        aria-describedby=${o.help ? `${id}-help` : nothing}
        .value=${v === undefined ? '' : String(v)}
        @change=${(e: Event) => {
          const el = e.target as HTMLInputElement;
          const s = el.value.trim();
          if (s === '') return this._set({ [key]: undefined });
          const n = Number(s);
          if (!Number.isFinite(n)) return;
          const clamped = Math.min(o.max, Math.max(o.min, n));
          el.value = String(clamped);
          this._set({ [key]: clamped });
        }}
      />`,
      o.help,
    );
  }

  private _switch(key: string, label: string, on: boolean, o: { help?: string; disabled?: boolean; write?: (v: boolean) => Bag } = {}): TemplateResult {
    const set = (this._c as Bag)[key] !== undefined;
    return html`${switchRow({
      id: `sl-${key}`,
      label,
      help: o.help,
      checked: on,
      disabled: o.disabled,
      // a value equal to the default removes the key (rule 2)
      onChange: (v) => this._set(o.write ? o.write(v) : { [key]: v === (SLIDER_LOOK_DEFAULTS as Bag)[key] ? undefined : v }),
    })}${set && !o.disabled
      ? html`<button type="button" class="btn sm ghost" @click=${() => this._set({ [key]: undefined })}>${t('Reset {label}', { label: label.toLowerCase() })}</button>`
      : nothing}`;
  }

  private _color(key: string, label: string): TemplateResult {
    const v = ((this._c as Bag)[key] as string | undefined) ?? '';
    return this._fieldOf(
      key,
      label,
      html`<mc-color-picker id=${`sl-${key}`} .value=${v} .label=${label} allowEntity allowAttribute .entityColor=${entityStateColor(this._stateObj) ?? 'currentColor'} .entityAttributes=${this._stateObj?.attributes} @value-changed=${(e: CustomEvent<{ value: string }>) => this._set({ [key]: e.detail.value || undefined })}></mc-color-picker>`,
    );
  }

  private _icon(key: string, label: string): TemplateResult {
    const v = ((this._c as Bag)[key] as string | undefined) ?? '';
    return this._fieldOf(
      key,
      label,
      html`<mc-icon-picker id=${`sl-${key}`} .hass=${this.hass} .value=${v} @value-changed=${(e: CustomEvent<{ value: string }>) => this._set({ [key]: e.detail.value || undefined })}></mc-icon-picker>`,
    );
  }

  private _select(id: string, value: string, options: Array<{ value: string; label: string }>, onPick: (v: string, el: HTMLSelectElement) => void, describedBy?: string): TemplateResult {
    return html`<div class="select">
      <select class="input" id=${id} aria-describedby=${describedBy || nothing} @change=${(e: Event) => onPick((e.target as HTMLSelectElement).value, e.target as HTMLSelectElement)}>
        ${options.map((o) => html`<option value=${o.value} ?selected=${o.value === value}>${o.label}</option>`)}
      </select>
      <ha-icon icon="mdi:chevron-down"></ha-icon>
    </div>`;
  }

  private _section(name: Section, heading: string, summary: string, body: TemplateResult): TemplateResult {
    return html`<mc-ui-disclosure
      level="5"
      .heading=${heading}
      .summary=${summary}
      .open=${this._isOpen(name)}
      @mc-toggle=${(e: CustomEvent<{ open: boolean }>) => {
        e.stopPropagation();
        this._toggleSection(name, e.detail.open);
      }}
    >
      <div class="body">${body}</div>
    </mc-ui-disclosure>`;
  }

  // ── labels ──

  private _styleLabel(s: SliderTrackStyle): string {
    switch (s) {
      case 'thin': return t('Thin');
      case 'pill': return t('Pill');
      case 'segmented': return t('Segmented');
      case 'glass': return t('Glass');
      case 'big-fill': return t('Big fill');
      default: return t('Standard');
    }
  }

  private _thumbLabel(s: SliderThumb): string {
    switch (s) {
      case 'circle': return t('Circle');
      case 'pill': return t('Pill');
      case 'square': return t('Square');
      case 'none': return t('None');
      default: return t('Line');
    }
  }

  private _positionLabel(p: ValuePosition): string {
    switch (p) {
      case 'bubble': return t('In a bubble while dragging');
      case 'track': return t('In the track');
      case 'hidden': return t('Hidden');
      default: return t('Beside the slider');
    }
  }

  /** The colour source in force: the light, a gradient or Auto built on it, or Slider colour (contract precedence). */
  private _fillSource(): string {
    const c = this._c;
    const base = c.use_entity_color ? t("Light's colour") : t('Slider colour');
    if (c.fill_mode === 'gradient') return c.use_entity_color ? t("Gradient, light's colour to end colour") : t('Gradient');
    if (c.fill_mode === 'auto') return c.use_entity_color ? t("Auto, from the light's colour") : t('Auto');
    return base;
  }

  // ── render ──

  private _status(): string {
    const s = lookStatus(this._c);
    if (s.kind === 'default') return t('Default look');
    if (s.kind === 'preset') return t('{name} look', { name: t(SLIDER_PRESETS.find((p) => p.id === s.id)!.label) });
    if (s.from) return t('Your own look, started from {name}', { name: t(SLIDER_PRESETS.find((p) => p.id === s.from)!.label) });
    return t('Your own look');
  }

  private _rmText(): string {
    const ua = typeof navigator === 'undefined' ? '' : navigator.userAgent;
    const where = /iPad|iPhone|iPod/.test(ua)
      ? t('On iPad: Settings, Accessibility, Motion.')
      : /Mac/.test(ua)
        ? t('On a Mac: System Settings, Accessibility, Display.')
        : t('In your system settings, turn on reduced motion (Accessibility).');
    return `${t('Your system has reduced motion on, so this look stays still.')} ${where}`;
  }

  protected render(): TemplateResult {
    const c = this._c;
    const status = lookStatus(c);
    const chipValue = status.kind === 'preset' ? status.id : undefined;
    return html`<div class="look">
      <div class="bar">
        <p class="help status" id="sl-status">${this._status()}</p>
        <div class="btns">
          ${this.undo ? html`<button type="button" class="btn secondary sm" @click=${() => this._undo()}>${this._undoLabel || t('Undo look change')}</button>` : nothing}
          <button type="button" class="btn secondary sm" data-role="reset" ?disabled=${!hasLookKeys(c)} @click=${() => this._reset()}>${t('Reset look')}</button>
        </div>
      </div>
      <mc-ui-chip-group
        .label=${t('Presets')}
        .items=${SLIDER_PRESETS.map((p) => ({ value: p.id, label: t(p.label), description: t(p.description), preview: p.preview }))}
        .value=${chipValue}
        @mc-pick=${(e: CustomEvent<{ value: string }>) => this._applyPreset(e.detail.value)}
      ></mc-ui-chip-group>
      ${lazyChunks['slider-look'].failed()
        ? notice({ tone: 'warn', text: t('The slider look could not be loaded, so the card keeps the standard slider. Your settings are saved.') })
        : nothing}
      ${this._rm ? notice({ tone: 'info', text: this._rmText() }) : nothing}
      ${this._trackSection()} ${this._thumbSection()} ${this._valueSection()} ${this._shapeSection()} ${this._stopsSection()}
      <mc-ui-toast .offset=${88} .dismissLabel=${t('Close')} @mc-toast-action=${(e: CustomEvent<{ id: string }>) => e.detail.id === 'undo' && this._undo()}></mc-ui-toast>
    </div>`;
  }

  private _trackSection(): TemplateResult {
    const c = this._c;
    const style = c.track_style ?? 'standard';
    const mode = c.fill_mode ?? 'solid';
    const th = (SLIDER_LOOK_DEFAULTS.track_thickness as Record<string, number>)[style];
    const vertical = c.direction === 'vertical';
    const fillItems = [
      { value: 'solid', label: t('Solid') },
      { value: 'gradient', label: t('Gradient') },
      { value: 'auto', label: t('Auto'), disabledReason: this._autoOk ? undefined : t('Auto works with brightness and colour temperature sliders.') },
    ];
    const lightReason = !this._eid ? t('Pick a light first.') : !this._isLight ? t('Only lights have a colour of their own.') : '';
    return this._section(
      'track',
      t('Track and fill'),
      `${this._styleLabel(style)} · ${this._fillSource()}`,
      html`
        <div class="field">
          <div class="field-head"><span class="lbl">${t('Fill')}</span></div>
          ${seg({ role: 'radiogroup', label: t('Fill'), full: true, items: fillItems, value: mode, onChange: (v) => this._set({ fill_mode: v === 'solid' ? undefined : v }) })}
          ${mode === 'auto' && !this._autoOk ? html`<p class="help" role="status">${t('Auto works with brightness and colour temperature sliders.')}</p>` : nothing}
          ${mode === 'auto' ? html`<p class="help">${t('Brightness: dark to bright in the slider colour. Colour temperature: warm to cool.')}</p>` : nothing}
          <p class="help" id="sl-source">${t('Colour source: {source}.', { source: this._fillSource() })} ${t("The light's colour, if that is on, or Slider colour is where the fill starts. Gradient and Auto build on it.")}</p>
        </div>
        ${mode === 'gradient' ? this._color('slider_color_to', t('End colour')) : nothing}
        ${this._switch('use_entity_color', t("Use the light's colour"), !!c.use_entity_color, { disabled: !!lightReason && !c.use_entity_color, help: lightReason || t('Falls back to Slider colour when the light has no colour.') })}
        ${c.use_entity_color ? html`<p class="help">${t('Following the light')} <button type="button" class="btn sm ghost" @click=${() => this._set({ use_entity_color: undefined })}>${t('Use own colour')}</button></p>` : nothing}
        <mc-ui-tile-group
          .label=${t('Track style')}
          .items=${TRACK_TILES.map((x) => ({ value: x.value, label: this._styleLabel(x.value), preview: x.preview }))}
          .value=${style}
          @mc-pick=${(e: CustomEvent<{ value: string }>) => this._set({ track_style: e.detail.value === 'standard' ? undefined : e.detail.value })}
        ></mc-ui-tile-group>
        <div class="two">
          ${this._num('track_thickness', t('Thickness (px)'), { placeholder: th, min: 2, max: 96, help: (c.track_thickness ?? th) < 6 ? t('The touch area stays at least 40 px.') : undefined })}
          ${this._num('track_radius', t('Track corners (px)'), { placeholder: style === 'pill' ? 999 : style === 'big-fill' ? 20 : t('auto'), min: 0, max: 48 })}
        </div>
        <p class="help">${t("The module's own corners are in the Design tab.")}</p>
        ${style === 'segmented' ? html`<div class="two">${this._num('segments', t('Segments'), { placeholder: t('auto'), min: 2, max: 20 })}${this._num('segment_gap', t('Gap (px)'), { placeholder: SLIDER_LOOK_DEFAULTS.segment_gap, min: 1, max: 8 })}</div>` : nothing}
        ${style === 'glass' ? this._switch('glass_blur', t('Blur behind'), !!c.glass_blur, { help: t('Blurs what is behind the track. Off gives a flat, see-through fill. Blur can slow down older wall tablets.') }) : nothing}
        ${style === 'big-fill'
          ? html`
              ${this._switch('show_icon', t('Entity icon'), c.show_icon !== false, { write: (v) => ({ show_icon: v ? undefined : false }) })}
              ${c.show_icon !== false ? this._icon('icon', t('Icon')) : nothing}
              <div class="field">
                <div class="field-head"><span class="lbl">${t('Icon position')}</span></div>
                ${seg({
                  role: 'radiogroup',
                  label: t('Icon position'),
                  full: true,
                  items: [
                    { value: 'start', label: t('Start') },
                    { value: 'center', label: t('Centre'), disabledReason: vertical ? undefined : t('Centre needs a vertical slider.') },
                  ],
                  value: c.icon_position ?? 'start',
                  onChange: (v) => this._set({ icon_position: v === 'start' ? undefined : v }),
                })}
                ${vertical ? nothing : html`<p class="help">${t('Centre needs a vertical slider.')}</p>`}
              </div>
            `
          : nothing}
        ${this._switch('live', t('Update while dragging'), !!c.live, { help: t('Sends at most 4 changes a second. The final value always goes out when you let go. Off by default.') })}
      `,
    );
  }

  private _thumbSection(): TemplateResult {
    const c = this._c;
    const thumb = c.thumb ?? 'line';
    const shaped = thumb === 'circle' || thumb === 'pill' || thumb === 'square';
    const size = (SLIDER_LOOK_DEFAULTS.thumb_size as Record<string, number>)[thumb];
    const items = (['line', 'circle', 'pill', 'square', 'none'] as SliderThumb[]).map((v) => ({ value: v, label: this._thumbLabel(v) }));
    return this._section(
      'thumb',
      t('Handle'),
      this._thumbLabel(thumb),
      html`
        ${seg({
          role: 'radiogroup',
          label: t('Handle'),
          full: true,
          items,
          value: thumb,
          onChange: (v) => {
            const { patch, movedValue } = thumbPatch(this._c, v);
            this._set(patch);
            if (movedValue) this._toast(t('Value shown beside the slider, because there is no handle.'), false);
          },
        })}
        ${thumb === 'none' ? html`<p class="help">${t('The track still moves and can be used with keyboard and touch. Add a value display so people can read the level.')}</p>` : nothing}
        ${levelUnreadable(c) ? notice({ tone: 'warn', text: t('With no handle and no value shown, the level can only be read from the fill.') }) : nothing}
        ${shaped
          ? html`
              ${this._num('thumb_size', t('Size (px)'), { placeholder: size, min: 4, max: 64, help: (c.thumb_size ?? size) < 24 ? t('The touch area stays at least 40 px.') : thumb === 'pill' ? t('The long side. The short side is 0.57 times that.') : undefined })}
              <div class="two">
                ${this._num('thumb_border', t('Border (px)'), { placeholder: 0, min: 0, max: 6 })}
                ${this._num('thumb_glow', t('Glow (px)'), { placeholder: 0, min: 0, max: 30 })}
              </div>
              ${this._color('thumb_border_color', t('Border colour'))} ${this._icon('thumb_icon', t('Icon'))}
            `
          : nothing}
      `,
    );
  }

  private _valueSection(): TemplateResult {
    const c = this._c;
    const pos = valuePosition(c);
    const options = (['beside', 'bubble', 'track', 'hidden'] as ValuePosition[]).map((v) => ({ value: v, label: this._positionLabel(v) }));
    return this._section(
      'value',
      t('Value display'),
      this._positionLabel(pos),
      html`
        ${field({
          id: 'sl-where',
          label: t('Where'),
          control: this._select(
            'sl-where',
            pos,
            options,
            (v, el) => {
              const next = v as ValuePosition;
              if (hiddenRefused(this._c, next)) {
                this._refused = true;
                el.value = pos; // the select shows the real state again
                return;
              }
              this._set(positionPatch(next));
            },
            'sl-where-help',
          ),
        })}
        <p class="help" id="sl-where-help">${t('Hidden is the same as turning Show value off.')} ${t('Touch screens have no hover, so the value is shown for 2 seconds after you let go.')}</p>
        ${this._refused ? html`<p class="help error" role="status">${t('Hidden needs a handle.')}</p>` : nothing}
        ${this._switch('ticks', t('Ticks'), !!c.ticks)}
        ${c.ticks ? this._num('tick_every', t('Tick every'), { placeholder: t('auto'), min: 0, max: 100000, step: 0.1 }) : nothing}
        ${this._switch('show_limits', t('Min and max labels'), !!c.show_limits)}
      `,
    );
  }

  private _shapeSection(): TemplateResult {
    const c = this._c;
    return this._section(
      'shape',
      t('Shape'),
      c.track_shape ?? t('None'),
      html`
        <mc-shape-editor
          .shape=${c.track_shape}
          .options=${c.track_shape_options}
          .label=${t('Slider shape')}
          .hass=${this.hass}
          .onChange=${(p: { shape?: string; shape_options?: unknown }) => this._set({ track_shape: p.shape === 'none' ? undefined : p.shape, track_shape_options: p.shape_options })}
        ></mc-shape-editor>
        <p class="help">${t('The track and fill follow this shape. The handle stays on the track. Use a wide or tall shape for the clearest result.')}</p>
      `,
    );
  }

  private _setStops(stops: SliderStop[]): void {
    this._set({ stops: stops.length ? stops : undefined });
  }

  private _stopsSection(): TemplateResult {
    const c = this._c;
    const stops = readStops(c);
    const { min, max, step } = this._range;
    const sorted = stops.every((s, i) => i === 0 || stops[i - 1].value <= s.value);
    return this._section(
      'stops',
      t('Stops'),
      stops.length ? t('{n, plural, one {# stop} other {# stops}}', { n: stops.length }) : t('None'),
      html`
        ${this._switch('snap', t('Snap to stops'), !!c.snap)}
        ${stops.map((s, i) => {
          const bad = !stopInRange(s, min, max);
          const errId = `sl-stop-${i}-err`;
          return html`<div class="stop" role="group" aria-label=${t('Stop {n}', { n: i + 1 })}>
            <div class="field">
              <div class="field-head"><label for="sl-stop-${i}-v">${t('Value')}</label></div>
              <input
                class="input"
                id="sl-stop-${i}-v"
                type="number"
                step="any"
                aria-invalid=${bad ? 'true' : 'false'}
                aria-describedby=${bad ? errId : nothing}
                .value=${Number.isFinite(s.value) ? String(s.value) : ''}
                @change=${(e: Event) => {
                  const n = Number((e.target as HTMLInputElement).value);
                  if (Number.isFinite(n)) this._setStops(stops.map((x, j) => (j === i ? { ...x, value: n } : x)));
                }}
              />
            </div>
            <div class="field">
              <div class="field-head"><label for="sl-stop-${i}-l">${t('Label')}</label></div>
              <input
                class="input"
                id="sl-stop-${i}-l"
                type="text"
                .value=${s.label ?? ''}
                @change=${(e: Event) => {
                  const label = (e.target as HTMLInputElement).value;
                  this._setStops(stops.map((x, j) => (j === i ? { value: x.value, ...(label ? { label } : {}) } : x)));
                }}
              />
            </div>
            <button type="button" class="icon-btn" aria-label=${t('Delete stop {n}', { n: i + 1 })} @click=${() => this._setStops(stops.filter((_x, j) => j !== i))}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </button>
            ${bad ? html`<p class="help error stop-err" id=${errId} role="alert">${t('Stop outside the range')}</p>` : nothing}
          </div>`;
        })}
        ${stops.length ? html`<p class="help">${t('{n} characters of each label show on the card. Screen readers get the full label.', { n: STOP_LABEL_CHARS })}</p>` : nothing}
        <div class="inline">
          <button type="button" class="btn secondary sm" ?disabled=${stops.length >= MAX_STOPS} @click=${() => this._setStops([...stops, { value: nextStopValue(stops, min, max, step) }])}>${t('Add stop')}</button>
          <button type="button" class="btn secondary sm" ?disabled=${sorted} @click=${() => this._setStops(sortStops(stops))}>${t('Sort by value')}</button>
        </div>
        <div class="field">
          <div class="field-head"><label for="sl-evenly">${t('Add evenly')}</label></div>
          <div class="inline">
            <input class="input" id="sl-evenly" type="number" min="2" max=${MAX_STOPS} step="1" aria-describedby="sl-evenly-help" .value=${String(this._evenly)} @input=${(e: Event) => (this._evenly = Number((e.target as HTMLInputElement).value) || 3)} />
            <button type="button" class="btn secondary sm" @click=${() => this._setStops(evenStops(min, max, this._evenly))}>${t('Apply')}</button>
          </div>
          <p class="help" id="sl-evenly-help">${t('Replaces the stops with this many, spread from {min} to {max}.', { min, max })}</p>
        </div>
        ${stops.length >= MAX_STOPS ? html`<p class="help">${t('{n} stops is the most.', { n: MAX_STOPS })}</p>` : nothing}
      `,
    );
  }
}

/** Guarded define (lit.M5): called from install(), never at evaluation. */
export function defineSliderLookEditor(): void {
  if (!customElements.get(SLIDER_LOOK_EDITOR_TAG)) customElements.define(SLIDER_LOOK_EDITOR_TAG, SliderLookEditor);
}
