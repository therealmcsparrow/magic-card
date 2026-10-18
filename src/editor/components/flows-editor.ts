import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { FlowConfig, HomeAssistant, MagicCardConfig } from '../../types';
import { editorSystem } from '../../css/editor-system';
import { FLOW_DEFAULTS, flowKeys, flowModuleEntities } from '../../utils/flow';
import { deepClone } from '../../utils/deep-merge';
import { entityStateColor } from '../../utils/entity-color';
import { FlowModuleOption, TEMPLATE_ID_HINT, flowModuleOptions, newFlow, resolveFlowEndpoint } from '../state/flows';
import { fieldReset } from './field-reset';
import { t, m, tl, type MessageId } from '../i18n';

import './color-picker';
import './entity-picker';
import './attribute-picker';

type Opt = { value: string; label: string };
type OptMark = { value: string; label: MessageId };
type SelectOpt = Opt & { disabled?: boolean; title?: string };
type Key = keyof FlowConfig;

/** "Width (px)" → "width": the reset button reads "Reset width". */
const resetName = (label: string) => {
  const name = label.replace(/\s*\([^)]*\)$/, '');
  return name.charAt(0).toLowerCase() + name.slice(1);
};

const ROUTES: OptMark[] = [
  { value: 'curve', label: m('Curve') },
  { value: 'straight', label: m('Straight') },
  { value: 'elbow', label: m('Elbow') },
];
const SIDES: OptMark[] = [
  { value: 'auto', label: m('Auto') },
  { value: 'top', label: m('Top') },
  { value: 'right', label: m('Right') },
  { value: 'bottom', label: m('Bottom') },
  { value: 'left', label: m('Left') },
];
const LABELS: OptMark[] = [
  { value: 'none', label: m('None') },
  { value: 'value', label: m('Value') },
  { value: 'template', label: m('Template') },
];
const LABEL_POSITIONS: OptMark[] = [
  { value: 'auto', label: m('Auto') },
  { value: 'line', label: m('On the line') },
  { value: 'side', label: m('Beside the line') },
  { value: 'hidden', label: m('Hidden') },
];
const SHOW: OptMark[] = [
  { value: 'always', label: m('Always') },
  { value: 'flowing', label: m('While flowing') },
];
const LAYERS: OptMark[] = [
  { value: 'back', label: m('Back') },
  { value: 'front', label: m('Front') },
];

/**
 * The card's Flows (Card settings → Flows): one condition-style block per flow line, "Flow N · From →
 * To" with delete, collapsible (the inspector owns which are open, so a flow picked on the studio
 * canvas opens here). From / To list every module of the card, nested children included; picking a
 * module without an id writes a generated id into it in the same change. Every set field has a reset.
 */
@customElement('mc-flows-editor')
export class FlowsEditor extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .list {
        display: grid;
        gap: 12px;
      }
      .cond-head .n {
        overflow-wrap: anywhere;
      }
      .cond-head .icon-btn.toggle {
        margin: -4px 0 -4px -6px;
      }
      .cond[data-selected] {
        border-color: var(--mc-accent);
        box-shadow: 0 0 0 1px var(--mc-accent);
      }
      .body {
        display: grid;
        gap: 16px;
      }
      .hints {
        display: grid;
        gap: 4px;
      }
    `,
  ];

  /** The whole card: From / To list its modules; a pick may write a module id. */
  @property({ attribute: false }) config?: MagicCardConfig;
  @property({ attribute: false }) hass?: HomeAssistant;
  /** Keys (flowKeys) of the open blocks. */
  @property({ attribute: false }) expanded: ReadonlySet<string> = new Set();
  /** Key of the flow selected on the canvas (highlighted). */
  @property({ attribute: false }) selected?: string | null;
  @property({ attribute: false }) onToggle?: (key: string) => void;
  /** A flow's key changed (an id-less flow got other ends): keep it open / selected. */
  @property({ attribute: false }) onRekey?: (from: string, to: string) => void;
  /** The next card config (flows, and a module id when a pick needed one). One edit. */
  @property({ attribute: false }) onChange?: (config: MagicCardConfig) => void;

  private get _flows(): FlowConfig[] {
    const f = this.config?.flows;
    return Array.isArray(f) ? f : [];
  }

  /** Write `flows` (and whatever `mutate` changed in the clone), keeping open blocks open. */
  private _write(mutate: (config: MagicCardConfig, flows: FlowConfig[]) => FlowConfig[]): void {
    if (!this.config) return;
    const before = flowKeys(this._flows);
    const next = deepClone(this.config);
    const flows = mutate(next, (next.flows ?? []).map((f) => ({ ...f })));
    if (flows.length) next.flows = flows;
    else delete next.flows;
    if (flows.length === before.length) {
      const after = flowKeys(flows);
      after.forEach((k, i) => {
        if (k !== before[i]) this.onRekey?.(before[i], k);
      });
    }
    this.onChange?.(next);
  }

  private _patch(index: number, patch: Partial<Record<Key, unknown>>, config?: (c: MagicCardConfig) => Partial<Record<Key, unknown>>): void {
    this._write((c, flows) => {
      const extra = config ? config(c) : {};
      const f = { ...flows[index], ...patch, ...extra } as Record<string, unknown>;
      for (const [k, v] of Object.entries({ ...patch, ...extra })) {
        if (v === undefined || v === '' || (typeof v === 'number' && Number.isNaN(v))) delete f[k];
      }
      flows[index] = f as unknown as FlowConfig;
      return flows;
    });
  }

  private _add(): void {
    const flow = newFlow();
    this._write((_c, flows) => [...flows, flow]);
    if (!this.expanded.has(flow.id)) this.onToggle?.(flow.id);
  }

  private _remove(index: number): void {
    const before = flowKeys(this._flows);
    const key = before[index];
    if (this.expanded.has(key)) this.onToggle?.(key);
    // Keys without an id are positional (`flow~i`, `a>b~i`): the flows after the deleted one keep
    // their open / selected state under their new key (in order, so a chain of renames can't collide).
    const after = flowKeys(this._flows.filter((_f, i) => i !== index));
    for (let i = index; i < after.length; i++) if (before[i + 1] !== after[i]) this.onRekey?.(before[i + 1], after[i]);
    this._write((_c, flows) => flows.filter((_f, i) => i !== index));
  }

  // ── controls ──

  private _field(label: string, set: boolean, onReset: (() => void) | undefined, control: TemplateResult, forId?: string): TemplateResult {
    return html`
      <div class="field">
        <div class="field-head">
          ${forId ? html`<label for=${forId}>${label}</label>` : html`<span class="lbl">${label}</span>`}
          ${onReset ? fieldReset(resetName(label), set, onReset) : nothing}
        </div>
        ${control}
      </div>
    `;
  }

  /** A field bound to one flow key: reset shows while the key is set. */
  private _keyField(index: number, f: FlowConfig, key: Key, label: string, control: TemplateResult, forId?: string): TemplateResult {
    const v = f[key];
    return this._field(label, v !== undefined && v !== '', () => this._patch(index, { [key]: undefined }), control, forId);
  }

  private _seg(label: string, value: string, options: Opt[], onPick: (v: string) => void, describedBy?: string): TemplateResult {
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
    return html`<div class="seg full" role="radiogroup" aria-label=${label} aria-describedby=${describedBy || nothing} @keydown=${onKey}>
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

  private _select(id: string, value: string, options: SelectOpt[], onPick: (v: string) => void, describedBy?: string): TemplateResult {
    return html`<div class="select">
      <select class="input" id=${id} aria-describedby=${describedBy || nothing} @change=${(e: Event) => onPick((e.target as HTMLSelectElement).value)}>
        ${options.map((o) => html`<option value=${o.value} ?selected=${o.value === value} ?disabled=${!!o.disabled} title=${o.title ?? nothing}>${o.label}</option>`)}
      </select>
      <ha-icon icon="mdi:chevron-down"></ha-icon>
    </div>`;
  }

  private _number(index: number, f: FlowConfig, key: Key, id: string, placeholder: number, min?: number, max?: number, step: number | 'any' = 1, describedBy?: string): TemplateResult {
    const v = f[key];
    return html`<input
      class="input"
      id=${id}
      type="number"
      min=${min ?? nothing}
      max=${max ?? nothing}
      step=${step}
      placeholder=${String(placeholder)}
      aria-describedby=${describedBy || nothing}
      .value=${v === undefined ? '' : String(v)}
      @input=${(e: InputEvent) => {
        // While typing only a whole number writes: an intermediate "-" or "1e" (value '') keeps the old one.
        const s = (e.target as HTMLInputElement).value;
        const n = Number(s);
        if (s.trim() !== '' && Number.isFinite(n)) this._patch(index, { [key]: n });
      }}
      @change=${(e: Event) => {
        // Committed empty (not a half-typed number): the value is cleared.
        const input = e.target as HTMLInputElement;
        if (input.value.trim() === '' && !input.validity?.badInput) this._patch(index, { [key]: undefined });
      }}
    />`;
  }

  private _switch(index: number, f: FlowConfig, key: 'reverse_negative' | 'scale_width', label: string, def: boolean, help?: string): TemplateResult {
    const v = f[key];
    const on = v ?? def;
    const helpId = `flow-${index}-${key}-help`;
    return html`
      <div class="switch-row">
        <div class="txt">
          <div class="field-head">
            <span class="lbl">${label}</span>
            ${fieldReset(resetName(label), v !== undefined, () => this._patch(index, { [key]: undefined }))}
          </div>
          ${help ? html`<p class="help" id=${helpId}>${help}</p>` : nothing}
        </div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${on ? 'true' : 'false'}
          aria-label=${label}
          aria-describedby=${help ? helpId : nothing}
          @click=${() => this._patch(index, { [key]: on === def ? !def : undefined })}
        ></button>
      </div>
    `;
  }

  private _color(index: number, f: FlowConfig, key: 'color' | 'idle_color', label: string): TemplateResult {
    // same source as the resolver: the flow's entity, else the From module's
    const entity = f.entity || (this.config && typeof f.from === 'string' ? flowModuleEntities(this.config).get(f.from) : undefined) || '';
    const entityColor = entity ? entityStateColor(this.hass?.states?.[entity]) ?? '' : '';
    return this._keyField(
      index,
      f,
      key,
      label,
      html`<mc-color-picker
        .value=${(f[key] as string) || ''}
        .label=${label}
        .allowEntity=${key === 'color'}
        .entityColor=${entityColor}
        @value-changed=${(e: CustomEvent) => this._patch(index, { [key]: e.detail.value })}
      ></mc-color-picker>`,
    );
  }

  /** From / To: every module except the other end; an unknown id stays listed as not found. */
  private _endpoint(index: number, f: FlowConfig, which: 'from' | 'to', modules: FlowModuleOption[]): TemplateResult {
    const id = `flow-${index}-${which}`;
    const label = which === 'from' ? t('From') : t('To');
    const value = typeof f[which] === 'string' ? (f[which] as string) : '';
    const other = which === 'from' ? f.to : f.from;
    const known = !value || modules.some((m) => m.id === value);
    const listed = modules.filter((m) => !other || m.id !== other);
    const locked = listed.some((m) => m.locked);
    const options: SelectOpt[] = [
      ...(value ? [] : [{ value: '', label: t('Pick a module'), disabled: true }]),
      ...(known ? [] : [{ value, label: t('Module not found ({id})', { id: value }) }]),
      ...listed.map((m) =>
        m.locked ? { value: m.value, label: t('{label} (no id)', { label: m.label }), disabled: true, title: t(TEMPLATE_ID_HINT) } : { value: m.value, label: m.label },
      ),
    ];
    const onPick = (v: string) => {
      if (!v) return;
      this._patch(index, {}, (c) => ({ [which]: resolveFlowEndpoint(c, v) }));
    };
    const hintId = `${id}-hint`;
    const lockedId = `${id}-locked`;
    const describedBy = [!value || !known ? hintId : '', locked ? lockedId : ''].filter(Boolean).join(' ');
    return html`
      ${this._field(label, false, undefined, this._select(id, value, options, onPick, describedBy), id)}
      ${!value
        ? html`<p class="help" id=${hintId}>${which === 'from' ? t('Pick the start module') : t('Pick the end module')}</p>`
        : known
          ? nothing
          : html`<p class="help error" id=${hintId}>${t('Module not found')}</p>`}
      ${locked ? html`<p class="help" id=${lockedId}>${t('Modules marked (no id) come from the template. {hint} to connect it.', { hint: t(TEMPLATE_ID_HINT) })}</p>` : nothing}
    `;
  }

  private _body(index: number, f: FlowConfig, modules: FlowModuleOption[]): TemplateResult {
    const id = (k: string) => `flow-${index}-${k}`;
    const label = f.label ?? FLOW_DEFAULTS.label;
    const entity = f.entity || '';
    const attrs = entity && this.hass?.states?.[entity] ? Object.keys(this.hass.states[entity].attributes || {}) : [];
    return html`
      <div class="body">
        <div class="two">
          <div>${this._endpoint(index, f, 'from', modules)}</div>
          <div>${this._endpoint(index, f, 'to', modules)}</div>
        </div>
        ${this._keyField(
          index,
          f,
          'entity',
          t('Entity'),
          html`<mc-entity-picker
            .hass=${this.hass}
            .value=${entity}
            .label=${t('Entity')}
            @value-changed=${(e: CustomEvent) => this._patch(index, { entity: e.detail.value })}
          ></mc-entity-picker>`,
        )}
        ${entity ? nothing : html`<p class="help">${t('No entity: the line always flows at its speed.')}</p>`}
        ${attrs.length
          ? this._keyField(
              index,
              f,
              'attribute',
              t('Attribute'),
              html`<mc-attribute-picker
                .hass=${this.hass}
                .entityId=${entity}
                .value=${f.attribute || ''}
                @value-changed=${(e: CustomEvent) => this._patch(index, { attribute: e.detail.value })}
              ></mc-attribute-picker>`,
            )
          : nothing}
        <div class="two">
          ${this._keyField(index, f, 'min', t('Min'), this._number(index, f, 'min', id('min'), FLOW_DEFAULTS.min, 0, undefined, 'any'), id('min'))}
          ${this._keyField(index, f, 'max', t('Max'), this._number(index, f, 'max', id('max'), FLOW_DEFAULTS.max, undefined, undefined, 'any'), id('max'))}
        </div>
        ${this._switch(index, f, 'reverse_negative', t('Reverse when negative'), FLOW_DEFAULTS.reverse_negative, t('A negative value runs the dots from the end to the start.'))}
        ${this._keyField(index, f, 'route', t('Route'), this._seg(t('Route'), f.route ?? FLOW_DEFAULTS.route, tl(ROUTES), (v) => this._patch(index, { route: v })))}
        <div class="two">
          ${this._keyField(index, f, 'from_side', t('From side'), this._select(id('from-side'), f.from_side ?? 'auto', tl(SIDES), (v) => this._patch(index, { from_side: v === 'auto' ? undefined : v })), id('from-side'))}
          ${this._keyField(index, f, 'to_side', t('To side'), this._select(id('to-side'), f.to_side ?? 'auto', tl(SIDES), (v) => this._patch(index, { to_side: v === 'auto' ? undefined : v })), id('to-side'))}
        </div>
        ${this._color(index, f, 'color', t('Colour'))}
        ${this._color(index, f, 'idle_color', t('Idle colour'))}
        <div class="two">
          ${this._keyField(index, f, 'width', t('Width (px)'), this._number(index, f, 'width', id('width'), FLOW_DEFAULTS.width, 0.5, 40, 0.5), id('width'))}
          ${this._keyField(index, f, 'glow', t('Glow (px)'), this._number(index, f, 'glow', id('glow'), FLOW_DEFAULTS.glow, 0, 30), id('glow'))}
        </div>
        ${this._switch(index, f, 'scale_width', t('Scale width'), FLOW_DEFAULTS.scale_width, t('Up to twice the width at Max.'))}
        <div class="two">
          ${this._keyField(index, f, 'dots', t('Dots'), this._number(index, f, 'dots', id('dots'), FLOW_DEFAULTS.dots, 0, 8, 1, f.dots === 0 ? id('dots-help') : undefined), id('dots'))}
          ${this._keyField(index, f, 'dot_size', t('Dot size (px)'), this._number(index, f, 'dot_size', id('dot-size'), FLOW_DEFAULTS.dot_size, 1, 40), id('dot-size'))}
        </div>
        ${f.dots === 0 ? html`<p class="help" id=${id('dots-help')}>${t('0 dots: moving dashes instead.')}</p>` : nothing}
        <div class="two">
          ${this._keyField(index, f, 'speed', t('Speed (s)'), this._number(index, f, 'speed', id('speed'), FLOW_DEFAULTS.speed, 0.2, undefined, 0.1, id('speed-help')), id('speed'))}
          ${this._keyField(index, f, 'min_speed', t('Min speed (s)'), this._number(index, f, 'min_speed', id('min-speed'), FLOW_DEFAULTS.min_speed, 0.2, undefined, 0.1, id('speed-help')), id('min-speed'))}
        </div>
        <p class="help" id=${id('speed-help')}>${t('Seconds for a dot to travel the line: Speed at Max, Min speed just above Min.')}</p>
        ${this._keyField(index, f, 'label', t('Label'), this._seg(t('Label'), label, tl(LABELS), (v) => this._patch(index, { label: v === 'none' ? undefined : v }), label === 'value' && !entity ? id('label-help') : undefined))}
        ${label === 'value' && !entity ? html`<p class="help" id=${id('label-help')}>${t('Pick an entity: a value label needs one.')}</p>` : nothing}
        ${label === 'template'
          ? this._keyField(
              index,
              f,
              'label_template',
              t('Label template'),
              html`<textarea
                class="input"
                id=${id('tpl')}
                rows="2"
                placeholder="{{ states('sensor.solar_power') | int }} W"
                .value=${f.label_template || ''}
                @input=${(e: InputEvent) => this._patch(index, { label_template: (e.target as HTMLTextAreaElement).value })}
              ></textarea>`,
              id('tpl'),
            )
          : nothing}
        ${label !== 'none'
          ? this._keyField(
              index,
              f,
              'label_position',
              t('Label position'),
              this._select(id('label-pos'), f.label_position ?? FLOW_DEFAULTS.label_position, tl(LABEL_POSITIONS), (v) =>
                this._patch(index, { label_position: v === 'auto' ? undefined : v }),
              ),
              id('label-pos'),
            )
          : nothing}
        ${this._keyField(index, f, 'show_when', t('Show'), this._seg(t('Show'), f.show_when ?? FLOW_DEFAULTS.show_when, tl(SHOW), (v) => this._patch(index, { show_when: v === 'always' ? undefined : v })))}
        ${this._keyField(index, f, 'layer', t('Layer'), this._seg(t('Layer'), f.layer ?? FLOW_DEFAULTS.layer, tl(LAYERS), (v) => this._patch(index, { layer: v === 'back' ? undefined : v })))}
      </div>
    `;
  }

  private _block(f: FlowConfig, index: number, key: string, modules: FlowModuleOption[]): TemplateResult {
    const open = this.expanded.has(key);
    const bodyId = `flow-body-${index}`;
    const name = (v: unknown) =>
      typeof v === 'string' && v ? modules.find((m) => m.id === v)?.name ?? t('Module not found') : '…';
    const missing = [f.from, f.to].some((v) => typeof v === 'string' && v && !modules.some((m) => m.id === v));
    return html`
      <div class="cond flow" data-flow=${key} data-selected=${this.selected === key ? '' : nothing}>
        <div class="cond-head">
          <button
            type="button"
            class="icon-btn sm toggle"
            aria-expanded=${open ? 'true' : 'false'}
            aria-controls=${open ? bodyId : nothing}
            aria-label=${open ? t('Collapse flow {n}', { n: index + 1 }) : t('Expand flow {n}', { n: index + 1 })}
            @click=${() => this.onToggle?.(key)}
          >
            <ha-icon icon=${open ? 'mdi:chevron-down' : 'mdi:chevron-right'}></ha-icon>
          </button>
          <span class="n">${t('Flow {n}', { n: index + 1 })}${f.from || f.to ? html` <span class="sub">· ${name(f.from)} → ${name(f.to)}</span>` : nothing}</span>
          <button
            type="button"
            class="icon-btn sm danger"
            aria-label=${t('Delete flow {n}', { n: index + 1 })}
            title=${t('Delete flow')}
            @click=${() => this._remove(index)}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${open
          ? html`<div id=${bodyId}>${this._body(index, f, modules)}</div>`
          : !f.from || !f.to || missing
            ? html`<div class="hints">
                ${!f.from ? html`<p class="help">${t('Pick the start module')}</p>` : nothing}
                ${!f.to ? html`<p class="help">${t('Pick the end module')}</p>` : nothing}
                ${missing ? html`<p class="help error">${t('Module not found')}</p>` : nothing}
              </div>`
            : nothing}
      </div>
    `;
  }

  protected render(): TemplateResult {
    const flows = this._flows;
    const keys = flowKeys(flows);
    const modules = this.config ? flowModuleOptions(this.config, this.hass) : [];
    return html`
      <div class="list">
        ${flows.length
          ? nothing
          : html`<p class="help">${t('Animated lines between two modules, like solar to house. Speed, width and direction can follow an entity value.')}</p>`}
        ${flows.map((f, i) => (f && typeof f === 'object' ? this._block(f, i, keys[i], modules) : nothing))}
        <div>
          <button type="button" class="btn btn-text btn-sm" @click=${() => this._add()}>
            <ha-icon icon="mdi:plus"></ha-icon>${t('Add flow')}
          </button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-flows-editor': FlowsEditor;
  }
}
