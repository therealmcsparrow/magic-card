import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { ColorRange, FlowConfig, HomeAssistant } from '../../types';
import type { FlowBudget, FlowLineStyle, FlowShape } from '../../contracts/flow-look';
import { FLOW_LOOK_DEFAULTS, defaultCapSize } from '../../contracts/flow-look.defaults';
import { FLOW_SPIN_SHAPES } from '../../contracts/flow-look.needs';
import { FLOW_LOOK_EDITOR_TAG, LOOK_UNDO_TOAST_MS, type FlowLookEditorElement, type FlowPreset } from '../../contracts/look-editor';
import type { UiChoice, UiChoicePick, UiToastElement } from '../../contracts/ui-kit';
import { editorSystem } from '../../css/editor-stack';
import { kitNotice } from '../../ui-kit/css';
import { lazyChunks } from '../../utils/lazy-chunks';
import { notice } from '../../ui-kit/templates';
import { fieldReset } from '../../editor/components/field-reset';
import { renderColorRangesField } from '../../editor/components/color-ranges-field';
import '../../editor/components/color-picker';
import '../../editor/components/icon-picker';
import { t } from '../i18n';
import { FLOW_PRESETS } from '../presets';
import { LINE_TILES, SHAPE_TILES } from '../tiles';
import { applyPreset, appliedPreset, changeCount, colourMode, lookStatus, resetLook, spacingMode, unusedColourKeys, withKeys } from './model';

/*
 * <mc-flow-look-editor> (contract look-editor 1.0.0): the Look group of a flow block. It renders
 * from the keys and writes only on a user action, one onChange with the whole next flow. Presets and Reset look keep one
 * level of Undo (toast for 20 s plus an inline button). Every control carries data-key (its YAML key) for the tests.
 * Section state: `open` holds the sections the user opened; a "-name" entry means the user closed a section that opens
 * by itself because its keys are set.
 */
type Rec = Record<string, unknown>;
type Opt = { value: string; label: string };
type Key = keyof FlowConfig;

const DEFAULT_WIDTH = 3;
const DEFAULT_DOTS = 3;
const DEFAULT_DOT_SIZE = 6;
const SECTION_KEYS: Record<string, readonly Key[]> = {
  line: ['width', 'glow', 'scale_width', 'idle_color'],
  ends: ['start_cap', 'end_cap', 'cap_size'],
  shapes: ['shape', 'shape_icon', 'shape_icon_rotate', 'shape_spin', 'shape_color', 'dots', 'dot_size'],
  swarm: ['motion', 'spacing_mode', 'spacing', 'size_variation', 'shape_alternate'],
  arrival: ['arrival', 'arrival_size'],
};

let uid = 0;
const strip = (s: string): string => s.replace(/\s*\([^)]*\)$/, '');

export class FlowLookEditor extends LitElement implements FlowLookEditorElement {
  static styles = [
    editorSystem,
    kitNotice,
    css`
      :host {
        display: grid;
        gap: 16px;
        min-width: 0;
      }
      .stack {
        display: grid;
        gap: 16px;
        min-width: 0;
      }
      .bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
      .bar .status {
        flex: 1 1 12rem;
        margin: 0;
        min-width: 0;
        overflow-wrap: anywhere;
      }
      .sr {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      }
    `,
  ];

  @property({ attribute: false }) flow: FlowConfig = {} as FlowConfig;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) flowKey = '';
  @property({ attribute: false }) entityColor?: string;
  @property({ attribute: false }) budget?: FlowBudget;
  @property({ attribute: false }) open: ReadonlySet<string> = new Set();
  @property({ attribute: false }) onToggle?: (section: string) => void;
  @property({ attribute: false }) undo?: FlowConfig;
  @property({ attribute: false }) onUndoChange?: (snapshot: FlowConfig | undefined) => void;
  @property({ attribute: false }) onChange?: (next: FlowConfig) => void;

  @state() private _announce = '';
  @state() private _still = false;
  @state() private _startShown = false;
  @state() private _dismissed: ReadonlySet<string> = new Set();
  private _undoName?: string;
  private _before?: FlowConfig;
  private readonly _id = `mc-fle-${++uid}`;

  // ── writes ──

  private get _f(): Rec {
    return this.flow as unknown as Rec;
  }

  /** A field edit: one onChange with the whole next flow; it ends the inline Undo (kept until the next look edit). */
  private _edit(patch: Rec): void {
    if (this.undo) this.onUndoChange?.(undefined);
    this._before = undefined;
    this._undoName = undefined;
    this._still = false;
    this.onChange?.(withKeys(this.flow, patch));
  }

  private _toast(): UiToastElement | null {
    return this.renderRoot.querySelector<UiToastElement>('mc-ui-toast');
  }

  private _snapshot(next: FlowConfig, name: string | undefined, text: string): void {
    this._before = this.flow;
    this._undoName = name;
    this.onUndoChange?.(this.flow);
    this.onChange?.(next);
    void lazyChunks['flow-look'].load().then(() => this.requestUpdate());
    const toast = this._toast();
    if (typeof toast?.show === 'function') toast.show({ text, action: { id: 'undo', label: t('look-editor.element.undo') }, duration: LOOK_UNDO_TOAST_MS });
    this._still = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private _apply(p: FlowPreset): void {
    const next = applyPreset(this.flow, p);
    const n = changeCount(this.flow, next);
    if (!n) return;
    const name = t(p.label);
    this._snapshot(next, name, t('look-editor.element.name-look-applied-n-changed', { name, n }));
  }

  private _reset(): void {
    const next = resetLook(this.flow);
    const n = changeCount(this.flow, next);
    if (!n) return;
    this._snapshot(next, undefined, t('look-editor.element.look-reset-n-removed', { n }));
  }

  private _undo = (): void => {
    const back = this.undo ?? this._before;
    if (!back) return;
    this.onChange?.(back);
    this.onUndoChange?.(undefined);
    this._before = undefined;
    this._undoName = undefined;
    this._toast()?.close();
    // the Undo button is gone after this: keep focus in the group (Reset look) and say what happened
    this._announce = t('look-editor.element.look-change-undone');
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('[data-role=reset]')?.focus());
  };

  // ── sections ──

  private _isOpen(name: string, auto: boolean): boolean {
    return this.open.has(name) ? true : this.open.has(`-${name}`) ? false : auto;
  }

  private _flip(entry: string): void {
    if (this.onToggle) return this.onToggle(entry);
    const s = new Set(this.open);
    if (!s.delete(entry)) s.add(entry);
    this.open = s;
  }

  private _setOpen(name: string, auto: boolean, want: boolean): void {
    const o = this.open;
    const flips: string[] = [];
    if (want) {
      if (o.has(`-${name}`)) flips.push(`-${name}`);
      if (!auto && !o.has(name)) flips.push(name);
    } else {
      if (o.has(name)) flips.push(name);
      if (auto && !o.has(`-${name}`)) flips.push(`-${name}`);
    }
    flips.forEach((e) => this._flip(e));
  }

  private _fold(name: string, heading: string, summary: string, body: TemplateResult): TemplateResult {
    const auto = (SECTION_KEYS[name] ?? []).some((k) => this._f[k] !== undefined);
    return html`<mc-ui-disclosure
      level="5"
      data-section=${name}
      .heading=${heading}
      .summary=${summary}
      .open=${this._isOpen(name, auto)}
      @mc-toggle=${(e: CustomEvent<{ open: boolean }>) => this._setOpen(name, auto, e.detail.open)}
    >
      <div class="stack">${body}</div>
    </mc-ui-disclosure>`;
  }

  // ── controls ──

  private _label(label: string, key: string | undefined, control: TemplateResult, forId?: string, extra?: TemplateResult): TemplateResult {
    const set = key !== undefined && this._f[key] !== undefined;
    return html`<div class="field">
      <div class="field-head">
        ${forId ? html`<label for=${forId}>${label}</label>` : html`<span class="lbl">${label}</span>`}
        ${key !== undefined ? fieldReset(strip(label).toLowerCase(), set, () => this._edit({ [key]: undefined })) : nothing}
      </div>
      ${control}${extra ?? nothing}
    </div>`;
  }

  private _num(key: Key, label: string, ph: number, min: number, max: number, o: { step?: number | 'any'; help?: string; disabled?: boolean } = {}): TemplateResult {
    const id = `${this._id}-${key}`;
    const v = this._f[key];
    const helpId = `${id}-help`;
    return this._label(
      label,
      key,
      html`<input
        class="input"
        id=${id}
        data-key=${key}
        type="number"
        min=${min}
        max=${max}
        step=${o.step ?? 1}
        placeholder=${String(ph)}
        ?disabled=${!!o.disabled}
        aria-describedby=${o.help ? helpId : nothing}
        .value=${v === undefined ? '' : String(v)}
        @input=${(e: InputEvent) => {
          // typing: only a whole number writes (an intermediate "-" keeps the old value)
          const s = (e.target as HTMLInputElement).value;
          const n = Number(s);
          if (s.trim() !== '' && Number.isFinite(n)) this._edit({ [key]: n });
        }}
        @change=${(e: Event) => {
          const input = e.target as HTMLInputElement;
          if (input.value.trim() === '') {
            if (!input.validity?.badInput && this._f[key] !== undefined) this._edit({ [key]: undefined });
            return;
          }
          const n = Number(input.value);
          if (!Number.isFinite(n)) return;
          const c = Math.min(max, Math.max(min, n));
          input.value = String(c);
          if (c !== this._f[key]) this._edit({ [key]: c });
        }}
      />`,
      id,
      o.help ? html`<p class="help" id=${helpId}>${o.help}</p>` : undefined,
    );
  }

  private _switch(key: Key, label: string, def: boolean, help?: string): TemplateResult {
    const v = this._f[key];
    const on = (v as boolean | undefined) ?? def;
    const helpId = `${this._id}-${key}-help`;
    return html`<div class="switch-row">
      <div class="txt">
        <div class="field-head">
          <span class="lbl">${label}</span>
          ${fieldReset(label.toLowerCase(), v !== undefined, () => this._edit({ [key]: undefined }))}
        </div>
        ${help ? html`<p class="help" id=${helpId}>${help}</p>` : nothing}
      </div>
      <button
        type="button"
        class="switch"
        role="switch"
        data-key=${key}
        aria-checked=${on ? 'true' : 'false'}
        aria-label=${label}
        aria-describedby=${help ? helpId : nothing}
        @click=${() => this._edit({ [key]: on === def ? !def : undefined })}
      ></button>
    </div>`;
  }

  private _seg(key: string, label: string, value: string, options: Opt[], onPick: (v: string) => void, describedBy?: string): TemplateResult {
    const onKey = (e: KeyboardEvent): void => {
      const i = options.findIndex((o) => o.value === value);
      const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (!(e.key in step)) return;
      e.preventDefault();
      const next = options[(i + step[e.key] + options.length) % options.length].value;
      const group = e.currentTarget as HTMLElement;
      onPick(next);
      requestAnimationFrame(() => group.querySelector<HTMLElement>(`[data-val="${next}"]`)?.focus());
    };
    return html`<div class="seg full" role="radiogroup" data-key=${key} aria-label=${label} aria-describedby=${describedBy ?? nothing} @keydown=${onKey}>
      ${options.map((o) => {
        const on = o.value === value;
        return html`<button type="button" role="radio" data-val=${o.value} aria-checked=${on ? 'true' : 'false'} tabindex=${on ? '0' : '-1'} @click=${() => onPick(o.value)}>${o.label}</button>`;
      })}
    </div>`;
  }

  /** A seg over a key: the default option removes the key. */
  private _keySeg(key: Key, label: string, def: string, options: Opt[], describedBy?: string): TemplateResult {
    const cur = (this._f[key] as string | undefined) ?? def;
    return this._label(label, key, this._seg(key, label, cur, options, (v) => this._edit({ [key]: v === def ? undefined : v }), describedBy));
  }

  private _select(key: Key, label: string, value: string, options: Opt[], onPick: (v: string) => void): TemplateResult {
    const id = `${this._id}-${key}`;
    return this._label(
      label,
      key,
      html`<div class="select">
        <select class="input" id=${id} data-key=${key} @change=${(e: Event) => onPick((e.target as HTMLSelectElement).value)}>
          ${options.map((o) => html`<option value=${o.value} ?selected=${o.value === value}>${o.label}</option>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>`,
      id,
    );
  }

  private _colour(key: Key, label: string, entity = false): TemplateResult {
    return this._label(
      label,
      key,
      html`<mc-color-picker
        data-key=${key}
        .value=${(this._f[key] as string | undefined) ?? ''}
        .label=${label}
        .allowEntity=${entity}
        .entityColor=${entity ? this.entityColor ?? '' : ''}
        @value-changed=${(e: CustomEvent<{ value: string }>) => this._edit({ [key]: e.detail.value })}
      ></mc-color-picker>`,
    );
  }

  // ── parts of the Look group ──

  private _notices(): TemplateResult | typeof nothing {
    // the card draws the look with the flow-look chunk: when it cannot load, say so (the settings are saved, the card keeps the classic flow)
    if (lazyChunks['flow-look'].failed()) return notice({ tone: 'warn', text: t('look-editor.element.the-flow-look-could-not-be-loaded-so-the') });
    const b = this.budget?.get(this.flowKey);
    if (!b) return nothing;
    const show = (id: string, text: string): TemplateResult | typeof nothing =>
      this._dismissed.has(id) ? nothing : notice({ tone: 'warn', text, action: { label: t('look-editor.element.dismiss'), onClick: () => (this._dismissed = new Set([...this._dismissed, id])) } });
    return html`${b.drawn < b.requested ? show('cap', t("look-editor.element.this-card-shows-at-most-40-moving-shapes")) : nothing}
    ${b.quality === 'lite'
      ? show('lite', t('look-editor.element.4-or-more-glowing-or-tube-lines-on-one'))
      : b.quality === 'minimal'
        ? show('minimal', t('look-editor.element.7-or-more-glowing-or-tube-lines-moving'))
        : nothing}`;
  }

  private _presets(): TemplateResult {
    const items: UiChoice[] = FLOW_PRESETS.map((p) => ({ value: p.id, label: t(p.label), description: t(p.description), preview: p.preview }));
    const st = lookStatus(this.flow);
    const text =
      st.kind === 'default'
        ? t('look-editor.element.default-look')
        : st.kind === 'preset'
          ? t('look-editor.element.name-look', { name: t(st.preset.label) })
          : st.kind === 'started'
            ? t('look-editor.element.your-own-look-started-from-name', { name: t(st.preset.label) })
            : t('look-editor.element.your-own-look');
    const undoText = this._undoName ? t('look-editor.element.undo-name-look', { name: this._undoName }) : this._before ? t('look-editor.element.undo-reset') : t('look-editor.element.undo');
    return html`
      <mc-ui-chip-group
        data-key="presets"
        .label=${t('look-editor.element.presets')}
        .items=${items}
        .value=${appliedPreset(this.flow)}
        @mc-pick=${(e: CustomEvent<UiChoicePick>) => {
          const p = FLOW_PRESETS.find((x) => x.id === e.detail.value);
          if (p) this._apply(p);
        }}
      ></mc-ui-chip-group>
      <div class="bar">
        <p class="help status" data-role="status">${text}</p>
        ${this.undo ? html`<button type="button" class="btn btn-text btn-sm" data-role="undo" @click=${this._undo}>${undoText}</button>` : nothing}
        <button type="button" class="btn btn-text btn-sm" data-role="reset" @click=${() => this._reset()}>${t('look-editor.element.reset-look')}</button>
      </div>
      ${this._still ? html`<p class="help" role="status">${t('look-editor.element.your-system-has-reduced-motion-on-so')}</p>` : nothing}
    `;
  }

  private _colourBlock(): TemplateResult {
    const mode = colourMode(this.flow);
    const unused = unusedColourKeys(this.flow);
    const name = (m: string): string => (m === 'gradient' ? t('look-editor.element.gradient') : m === 'value' ? t('look-editor.element.by-value') : t('look-editor.element.single'));
    return html`
      ${this._colour('color', t('look-editor.element.colour'), true)}
      ${this._label(
        t('look-editor.element.colour-mode'),
        'color_mode',
        this._seg(
          'color_mode',
          t('look-editor.element.colour-mode'),
          mode,
          [
            { value: 'single', label: t('look-editor.element.single') },
            { value: 'gradient', label: t('look-editor.element.gradient') },
            { value: 'value', label: t('look-editor.element.by-value') },
          ],
          (v) => v !== mode && this._edit({ color_mode: v }),
        ),
      )}
      ${mode === 'gradient' ? this._colour('color_to', t('look-editor.element.line-end-colour'), true) : nothing}
      ${mode === 'value'
        ? html`<div data-key="thresholds">
              ${renderColorRangesField(t('look-editor.element.colour-ranges'), this.flow.thresholds as ColorRange[] | undefined, (r) => this._edit({ thresholds: r }), {
                min: 0,
                max: 100,
                help: t('look-editor.element.the-line-takes-the-colour-of-the-range'),
              })}
            </div>
            ${this.flow.entity ? nothing : html`<p class="help">${t('look-editor.element.pick-a-sensor-or-device-first-the-colour')}</p>`}`
        : nothing}
      ${unused.length
        ? html`<p class="help" role="status" data-role="mode-note">
            ${t('look-editor.element.used-is-used-kept-but-not-used-kept', {
              used: name(mode),
              kept: unused.map((k) => (k === 'color_to' ? t('look-editor.element.line-end-colour') : t('look-editor.element.colour-ranges'))).join(', '),
            })}
          </p>`
        : nothing}
    `;
  }

  private _tiles(): TemplateResult {
    const names: Record<FlowLineStyle, string> = {
      solid: t('look-editor.element.solid'),
      dashed: t('look-editor.element.dashed'),
      dotted: t('look-editor.element.dotted'),
      double: t('look-editor.element.double-rail'),
      wave: t('look-editor.element.wave'),
      zigzag: t('look-editor.element.zigzag'),
      tube: t('look-editor.element.tube'),
      neon: t('look-editor.element.neon'),
      cable: t('look-editor.element.cable'),
    };
    const items: UiChoice[] = (Object.keys(names) as FlowLineStyle[]).map((v) => ({ value: v, label: names[v], preview: LINE_TILES[v] }));
    const cur = this.flow.line_style ?? 'solid';
    return html`<mc-ui-tile-group
      data-key="line_style"
      .label=${t('look-editor.element.line-style')}
      .items=${items}
      .value=${cur}
      @mc-pick=${(e: CustomEvent<UiChoicePick>) => {
        const v = e.detail.value as FlowLineStyle;
        if (v === cur) return;
        this._announce = this._added(v);
        this._edit({ line_style: v === 'solid' ? undefined : v });
      }}
    ></mc-ui-tile-group>`;
  }

  /** "Dash length and Gap added." for the polite live region. */
  private _added(v: FlowLineStyle): string {
    const by: Partial<Record<FlowLineStyle, string[]>> = {
      dashed: [t('look-editor.element.dash-length-px'), t('look-editor.element.gap-px')],
      dotted: [t('look-editor.element.gap-px')],
      double: [t('look-editor.element.rail-gap-px')],
      wave: [t('look-editor.element.wave-height-px'), t('look-editor.element.wavelength-px')],
      zigzag: [t('look-editor.element.zigzag-height-px'), t('look-editor.element.wavelength-px'), t('look-editor.element.electric')],
      tube: [t('look-editor.element.glass-tint'), t('look-editor.element.bubbles'), t('look-editor.element.level-follows-value')],
      neon: [t('look-editor.element.flicker'), t('look-editor.element.core-colour')],
      cable: [t('look-editor.element.sheath-colour'), t('look-editor.element.twisted')],
    };
    const names = (by[v] ?? []).map(strip);
    return names.length ? t('look-editor.element.fields-added', { fields: names.join(', ') }) : '';
  }

  private _styleFields(): TemplateResult | typeof nothing {
    const f = this.flow;
    const D = FLOW_LOOK_DEFAULTS;
    switch (f.line_style) {
      case 'dashed':
        return html`<div class="two">${this._num('dash_length', t('look-editor.element.dash-length-px'), D.dash_length, 2, 40)}${this._num('dash_gap', t('look-editor.element.gap-px'), D.dash_gap, 2, 40)}</div>`;
      case 'dotted':
        return this._num('dash_gap', t('look-editor.element.gap-px'), D.dash_gap, 2, 40);
      case 'double':
        return this._num('rail_gap', t('look-editor.element.rail-gap-px'), D.rail_gap, 2, 24);
      case 'wave':
      case 'zigzag': {
        const zig = f.line_style === 'zigzag';
        return html`<div class="two">
            ${this._num('amplitude', zig ? t('look-editor.element.zigzag-height-px') : t('look-editor.element.wave-height-px'), D.amplitude, 1, 20)}
            ${this._num('wavelength', t('look-editor.element.wavelength-px'), zig ? D.wavelength_zigzag : D.wavelength_wave, 8, 80)}
          </div>
          ${zig ? this._switch('electric', t('look-editor.element.electric'), D.electric) : nothing}`;
      }
      case 'tube': {
        const bubbles = f.bubbles ?? D.bubbles;
        const w = f.width ?? D.width.tube;
        return html`${this._colour('tube_tint', t('look-editor.element.glass-tint'))} ${this._switch('bubbles', t('look-editor.element.bubbles'), D.bubbles)}
          ${bubbles ? this._num('bubble_count', t('look-editor.element.bubble-count'), D.bubble_count, 1, 8) : nothing}
          ${this._switch('tube_fill_value', t('look-editor.element.level-follows-value'), D.tube_fill_value, f.entity ? t('look-editor.element.the-tube-is-empty-until-the-value-passes') : t('look-editor.element.pick-a-sensor-or-device-first-the-level'))}
          ${w < 8 ? html`<p class="help" role="status">${t('look-editor.element.a-tube-under-8-px-is-hard-to-read')}</p>` : nothing}`;
      }
      case 'neon':
        return html`${this._keySeg('flicker', t('look-editor.element.flicker'), D.flicker, [
          { value: 'off', label: t('look-editor.element.off') },
          { value: 'subtle', label: t('look-editor.element.subtle') },
          { value: 'strong', label: t('look-editor.element.strong') },
        ])}
        ${this._colour('neon_core', t('look-editor.element.core-colour'))}`;
      case 'cable':
        return html`${this._colour('cable_color', t('look-editor.element.sheath-colour'))}${this._switch('twisted', t('look-editor.element.twisted'), D.twisted)}`;
      default:
        return nothing;
    }
  }

  /** The line width the look draws when `width` is unset (a tube is 12, neon 3, cable 5). */
  private _defaultWidth(): number {
    const style = this.flow.line_style;
    return style === 'tube' || style === 'neon' || style === 'cable' ? FLOW_LOOK_DEFAULTS.width[style] : DEFAULT_WIDTH;
  }

  private _lineFold(): TemplateResult {
    const f = this.flow;
    const style = f.line_style;
    const dw = this._defaultWidth();
    const dg = style === 'neon' ? FLOW_LOOK_DEFAULTS.neon_glow : 0;
    return this._fold(
      'line',
      t('look-editor.element.line'),
      t('look-editor.element.n-px', { n: f.width ?? dw }),
      html`${this._colour('idle_color', t('look-editor.element.idle-colour'))}
        <div class="two">${this._num('width', t('look-editor.element.width-px'), dw, 0.5, 40, { step: 0.5 })}${this._num('glow', t('look-editor.element.glow-px'), dg, 0, 30)}</div>
        ${this._switch('scale_width', t('look-editor.element.scale-width'), true, t('look-editor.element.up-to-twice-the-width-at-max'))}`,
    );
  }

  private _endsFold(): TemplateResult {
    const f = this.flow;
    const caps: Opt[] = [
      { value: 'none', label: t('look-editor.element.none') },
      { value: 'round', label: t('look-editor.element.round-node') },
      { value: 'arrow', label: t('look-editor.element.arrowhead') },
    ];
    const capName = (v: string | undefined): string => caps.find((c) => c.value === (v ?? 'none'))!.label;
    const showStart = this._startShown || f.start_cap !== undefined;
    const capSel = (key: 'start_cap' | 'end_cap', label: string): TemplateResult =>
      this._select(key, label, f[key] ?? 'none', caps, (v) => this._edit({ [key]: v === 'none' ? undefined : v }));
    return this._fold(
      'ends',
      t('look-editor.element.ends'),
      capName(f.end_cap),
      html`${capSel('end_cap', t('look-editor.element.end-marker'))}
        ${showStart
          ? capSel('start_cap', t('look-editor.element.start-marker'))
          : html`<div><button type="button" class="btn btn-text btn-sm" aria-expanded="false" @click=${() => (this._startShown = true)}>${t('look-editor.element.different-start-marker')}</button></div>`}
        ${this._num('cap_size', t('look-editor.element.marker-size-px'), Math.round(defaultCapSize(f.width ?? this._defaultWidth())), 4, 40)}`,
    );
  }

  private _shapesFold(): TemplateResult {
    const f = this.flow;
    const shape = (f.shape ?? 'dot') as FlowShape;
    const names: Record<FlowShape, string> = {
      dot: t('look-editor.element.dot'),
      arrow: t('look-editor.element.arrow'),
      chevron: t('look-editor.element.chevron'),
      square: t('look-editor.element.square'),
      diamond: t('look-editor.element.diamond'),
      star: t('look-editor.element.star'),
      comet: t('look-editor.element.comet'),
      spark: t('look-editor.element.spark'),
      bubble: t('look-editor.element.bubble'),
      drop: t('look-editor.element.drop'),
      icon: t('look-editor.element.icon'),
    };
    const items: UiChoice[] = (Object.keys(names) as FlowShape[]).map((v) => ({ value: v, label: names[v], preview: SHAPE_TILES[v] }));
    const dots = f.dots ?? DEFAULT_DOTS;
    const dot = shape === 'dot';
    const pixels = f.motion !== 'pulse' && spacingMode(f) !== 'even';
    return this._fold(
      'shapes',
      t('look-editor.element.shapes'),
      [names[shape], t('look-editor.element.n-px', { n: f.dot_size ?? DEFAULT_DOT_SIZE }), String(dots)].join(' · '),
      html`<mc-ui-tile-group
          data-key="shape"
          .label=${t('look-editor.element.shape')}
          .items=${items}
          .value=${shape}
          @mc-pick=${(e: CustomEvent<UiChoicePick>) => this._edit({ shape: e.detail.value === 'dot' ? undefined : e.detail.value })}
        ></mc-ui-tile-group>
        ${shape === 'icon'
          ? html`${this._label(
                t('look-editor.element.icon'),
                'shape_icon',
                html`<mc-icon-picker
                  data-key="shape_icon"
                  .hass=${this.hass}
                  .value=${f.shape_icon ?? ''}
                  .label=${t('look-editor.element.icon')}
                  @value-changed=${(e: CustomEvent<{ value: string }>) => this._edit({ shape_icon: e.detail.value })}
                ></mc-icon-picker>`,
              )}
              ${f.shape_icon ? nothing : html`<p class="help">${t('look-editor.element.pick-an-icon')}</p>`}
              ${this._switch('shape_icon_rotate', t('look-editor.element.rotate-with-the-line'), FLOW_LOOK_DEFAULTS.shape_icon_rotate)}`
          : nothing}
        ${FLOW_SPIN_SHAPES.includes(shape)
          ? this._switch('shape_spin', t('look-editor.element.spin'), FLOW_LOOK_DEFAULTS.shape_spin, t('look-editor.element.turns-the-shape-once-every-3-seconds'))
          : nothing}
        <div class="two">
          ${this._num('dot_size', dot ? t('look-editor.element.dot-size-px') : t('look-editor.element.shape-size-px'), DEFAULT_DOT_SIZE, 1, 40)}
          ${this._num('dots', dot ? t('look-editor.element.dots') : t('look-editor.element.shapes'), DEFAULT_DOTS, 0, 8, {
            disabled: pixels,
            help: dots === 0 ? (dot ? t('look-editor.element.0-dots-moving-dashes-instead') : t('look-editor.element.0-shapes-nothing-travels')) : undefined,
          })}
        </div>
        ${pixels ? html`<p class="help">${t('look-editor.element.count-follows-spacing')}</p>` : nothing} ${this._colour('shape_color', t('look-editor.element.shape-colour'), true)}`,
    );
  }

  private _swarmFold(): TemplateResult {
    const f = this.flow;
    const pulse = f.motion === 'pulse';
    const sm = spacingMode(f);
    const names: Record<FlowShape | 'none', string> = {
      none: t('look-editor.element.none'),
      dot: t('look-editor.element.dot'),
      arrow: t('look-editor.element.arrow'),
      chevron: t('look-editor.element.chevron'),
      square: t('look-editor.element.square'),
      diamond: t('look-editor.element.diamond'),
      star: t('look-editor.element.star'),
      comet: t('look-editor.element.comet'),
      spark: t('look-editor.element.spark'),
      bubble: t('look-editor.element.bubble'),
      drop: t('look-editor.element.drop'),
      icon: t('look-editor.element.icon'),
    };
    return this._fold(
      'swarm',
      t('look-editor.element.spread-and-motion'),
      [pulse ? t('look-editor.element.pulse') : t('look-editor.element.travel'), sm === 'even' ? t('look-editor.element.even') : sm === 'pixels' ? t('look-editor.element.in-pixels') : t('look-editor.element.random')].join(' · '),
      html`${this._keySeg('motion', t('look-editor.element.motion'), 'travel', [
          { value: 'travel', label: t('look-editor.element.travel') },
          { value: 'pulse', label: t('look-editor.element.pulse') },
        ])}
        ${pulse ? html`<p class="help">${t('look-editor.element.shapes-stay-in-place-and-pulse-the-pulse')}</p>` : nothing}
        ${this._label(
          t('look-editor.element.spacing'),
          'spacing_mode',
          this._seg(
            'spacing_mode',
            t('look-editor.element.spacing'),
            sm,
            [
              { value: 'even', label: t('look-editor.element.even') },
              { value: 'pixels', label: t('look-editor.element.in-pixels') },
              { value: 'random', label: t('look-editor.element.random') },
            ],
            (v) => v !== sm && this._edit({ spacing_mode: v }),
          ),
        )}
        ${sm !== 'even' ? this._num('spacing', t('look-editor.element.spacing-px'), FLOW_LOOK_DEFAULTS.spacing, 4, 400) : nothing}
        ${pulse && (sm !== 'even' || f.spacing !== undefined) ? html`<p class="help">${t('look-editor.element.spacing-is-ignored-while-motion-is-pulse')}</p>` : nothing}
        ${this._num('size_variation', t('look-editor.element.size-variation'), FLOW_LOOK_DEFAULTS.size_variation, 0, 60)}
        ${this._select(
          'shape_alternate',
          t('look-editor.element.alternate-with'),
          f.shape_alternate ?? 'none',
          (Object.keys(names) as Array<FlowShape | 'none'>).map((v) => ({ value: v, label: names[v] })),
          (v) => this._edit({ shape_alternate: v === 'none' ? undefined : v }),
        )}`,
    );
  }

  private _arrivalFold(): TemplateResult {
    const f = this.flow;
    const cur = f.arrival ?? 'none';
    const opts: Opt[] = [
      { value: 'none', label: t('look-editor.element.none') },
      { value: 'ring', label: t('look-editor.element.ring') },
      { value: 'splash', label: t('look-editor.element.splash') },
    ];
    return this._fold(
      'arrival',
      t('look-editor.element.arrival'),
      opts.find((o) => o.value === cur)!.label,
      html`${this._label(t('look-editor.element.splash-on-arrival'), 'arrival', this._seg('arrival', t('look-editor.element.splash-on-arrival'), cur, opts, (v) => this._edit({ arrival: v === 'none' ? undefined : v })))}
        <p class="help">${f.motion === 'pulse' ? t('look-editor.element.nothing-arrives-while-motion-is-pulse') : t('look-editor.element.a-small-effect-at-the-to-module-each')}</p>
        ${cur !== 'none' ? this._num('arrival_size', t('look-editor.element.splash-size-px'), FLOW_LOOK_DEFAULTS.arrival_size, 8, 80) : nothing}`,
    );
  }

  protected render(): TemplateResult {
    return html`
      ${this._notices()} ${this._presets()}
      <div class="stack">${this._colourBlock()}</div>
      <div class="stack">${this._tiles()} ${this._styleFields()}</div>
      ${this._lineFold()} ${this._endsFold()} ${this._shapesFold()} ${this._swarmFold()} ${this._arrivalFold()}
      <div class="sr" role="status" aria-live="polite">${this._announce}</div>
      <mc-ui-toast .offset=${88} .dismissLabel=${t('look-editor.element.dismiss')} @mc-toast-action=${this._undo}></mc-ui-toast>
    `;
  }
}

/** Define once; keep a tag another bundle already claimed. */
export function defineFlowLookEditor(): void {
  if (!customElements.get(FLOW_LOOK_EDITOR_TAG)) customElements.define(FLOW_LOOK_EDITOR_TAG, FlowLookEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-flow-look-editor': FlowLookEditor;
  }
}
