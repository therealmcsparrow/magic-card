import { LitElement, html, css, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-system';
import type { HomeAssistant } from '../../types';
import type { AnimationDoc } from '../model';
import type { BindProperty, Binding, TargetRef } from '../model-v2-core';
import { NO_SELECTION, registerPanel, type StudioSelection } from '../slots';
import {
  ATTRIBUTE_RE,
  BINDINGS_MAX,
  bindInfo,
  bindingProblem,
  bindingsOf,
  canAddBinding,
  laneConflict,
  newBinding,
  propertiesFor,
  withBindings,
  withProperty,
} from './bindings-utils';

// mc-color-picker comes from the editor chunk (loaded through window.MagicCard.loadEditor); the studio bundle must not define it.

/*
 * Value bindings (studio inspector, a target selected): bind a property of the selected target to
 * the driving entity's value, e.g. the icon's rotation speed to a fan's percentage or a part's
 * draw to a battery level. Each binding: property, input (state or an attribute, min, max), output
 * range (numbers, or two colours for colour mix) and smoothing. The stage's value slider previews
 * it. `.doc` is never mutated: every edit emits `doc-change` { doc, label }.
 */

const CARD_TARGET_NAMES: Record<string, string> = { element: 'Element', icon: 'Icon', name: 'Name', state: 'State', background: 'Background' };

/** The selected target's display name. */
export function targetName(doc: AnimationDoc | undefined, target: TargetRef): string {
  if (CARD_TARGET_NAMES[target]) return CARD_TARGET_NAMES[target];
  const m = /^(part|group|shape):(.+)$/.exec(target);
  if (!m) return target;
  const list = m[1] === 'part' ? doc?.rig?.parts : m[1] === 'group' ? doc?.rig?.groups : doc?.rig?.shapes;
  return list?.find((x) => x.id === m[2])?.name || m[2];
}

const selectedTarget = (sel: StudioSelection): TargetRef | undefined => sel.target ?? sel.keys?.[0]?.target;

@customElement('mc-anim-bindings-panel')
export class AnimBindingsPanel extends LitElement {
  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) library?: unknown;
  @property({ type: Number }) time = 0;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ attribute: false }) selection: StudioSelection = NO_SELECTION;
  @property({ attribute: false }) tile?: string;

  @state() private _announce = '';
  /** Attribute fields holding a name that is not valid (by binding index): shown, not written. */
  @state() private _badAttr = new Set<number>();
  private _focusAfter?: string;

  private get _target(): TargetRef | undefined {
    return selectedTarget(this.selection);
  }

  private _write(bindings: Binding[], label: string): void {
    if (!this.doc) return;
    this.dispatchEvent(new CustomEvent('doc-change', { bubbles: true, composed: true, detail: { doc: withBindings(this.doc, bindings), label } }));
  }

  private _patch(index: number, next: Binding, label: string): void {
    this._write(
      (this.doc?.bindings ?? []).map((b, i) => (i === index ? next : b)),
      label,
    );
  }

  private _add(): void {
    const target = this._target;
    if (!target || !this.doc || !canAddBinding(this.doc)) return;
    const list = this.doc.bindings ?? [];
    const b = newBinding(target);
    this._write([...list, b], 'Add value binding');
    this._focusAfter = `.bind[data-i="${list.length}"] select.prop`;
    this._announce = `Binding added: ${bindInfo(b.property).label}.`;
  }

  private _remove(index: number): void {
    const list = (this.doc?.bindings ?? []).filter((_b, i) => i !== index);
    this._write(list, 'Delete value binding');
    this._focusAfter = '.add';
    this._announce = 'Binding deleted.';
  }

  /** Whether an Attribute value can be written; keeps the field's error state. */
  private _checkAttr(index: number, value: string): boolean {
    const ok = !value.trim() || ATTRIBUTE_RE.test(value.trim());
    if (ok !== !this._badAttr.has(index)) {
      const next = new Set(this._badAttr);
      if (ok) next.delete(index);
      else next.add(index);
      this._badAttr = next;
    }
    return ok;
  }

  protected updated(): void {
    const sel = this._focusAfter;
    if (!sel) return;
    this._focusAfter = undefined;
    this.renderRoot.querySelector<HTMLElement>(sel)?.focus();
  }

  private _num(id: string, label: string, value: number, step: number, commit: (n: number) => void): TemplateResult {
    return html`<div class="field">
      <div class="field-head"><label for=${id}>${label}</label></div>
      <input
        class="input"
        id=${id}
        type="number"
        step=${step}
        inputmode="decimal"
        ?disabled=${this.disabled}
        .value=${String(value)}
        @change=${(e: Event) => {
          const el = e.target as HTMLInputElement;
          const n = Number(el.value);
          if (el.value.trim() === '' || !Number.isFinite(n)) {
            el.value = String(value);
            return;
          }
          if (n !== value) commit(n);
        }}
      />
    </div>`;
  }

  private _output(b: Binding, index: number): TemplateResult {
    const info = bindInfo(b.property);
    const id = `bd-${index}`;
    if (b.property === 'color_mix') {
      const [from, to] = b.output as [string, string];
      const pick = (k: 0 | 1, v: string) => {
        if (!v) return;
        const out: [string, string] = [from, to];
        out[k] = v;
        this._patch(index, { ...b, output: out }, 'Change binding colours');
      };
      return html`<div class="field">
          <div class="field-head"><span class="lbl">From colour</span></div>
          <mc-color-picker .value=${from} .label=${'From colour'} @value-changed=${(e: CustomEvent) => pick(0, e.detail.value)}></mc-color-picker>
        </div>
        <div class="field">
          <div class="field-head"><span class="lbl">To colour</span></div>
          <mc-color-picker .value=${to} .label=${'To colour'} @value-changed=${(e: CustomEvent) => pick(1, e.detail.value)}></mc-color-picker>
        </div>`;
    }
    const [a, c] = b.output as [number, number];
    const unit = info.unit ? ` (${info.unit})` : '';
    return html`<div class="pair">
      ${this._num(`${id}-from`, `From${unit}`, a, info.step, (n) => this._patch(index, { ...b, output: [n, c] }, 'Change binding output'))}
      ${this._num(`${id}-to`, `To${unit}`, c, info.step, (n) => this._patch(index, { ...b, output: [a, n] }, 'Change binding output'))}
    </div>`;
  }

  private _binding(b: Binding, index: number, n: number): TemplateResult {
    const id = `bd-${index}`;
    const info = bindInfo(b.property);
    const props = propertiesFor(b.target);
    const problem = bindingProblem(b);
    const conflict = laneConflict(this.doc, b);
    const bad = this._badAttr.has(index);
    return html`<li class="cond bind" data-i=${index}>
      <div class="cond-head">
        <span class="n">Binding ${n + 1} <span class="sub">· ${info.label}</span></span>
        <button type="button" class="icon-btn sm danger del" aria-label="Delete binding ${n + 1}" title="Delete binding" ?disabled=${this.disabled} @click=${() => this._remove(index)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      <div class="field">
        <div class="field-head"><label for="${id}-p">Property</label></div>
        <div class="select">
          <select
            class="input prop"
            id="${id}-p"
            aria-describedby="${id}-ph"
            ?disabled=${this.disabled}
            @change=${(e: Event) => this._patch(index, withProperty(b, (e.target as HTMLSelectElement).value as BindProperty), 'Change bound property')}
          >
            ${props.map((p) => html`<option value=${p.id} ?selected=${p.id === b.property}>${p.label}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
        <p class="help" id="${id}-ph">${info.hint}</p>
      </div>
      <fieldset>
        <legend>Entity value</legend>
        <div class="field">
          <div class="field-head"><label for="${id}-a">Attribute</label></div>
          <input
            class="input mono"
            id="${id}-a"
            type="text"
            placeholder="state"
            autocomplete="off"
            spellcheck="false"
            aria-describedby="${id}-ah"
            aria-invalid=${bad ? 'true' : 'false'}
            ?disabled=${this.disabled}
            .value=${b.input.attribute ?? ''}
            @input=${(e: Event) => this._checkAttr(index, (e.target as HTMLInputElement).value)}
            @change=${(e: Event) => {
              const v = (e.target as HTMLInputElement).value.trim();
              if (!this._checkAttr(index, v)) return;
              const input = { ...b.input };
              if (v) input.attribute = v;
              else delete input.attribute;
              this._patch(index, { ...b, input }, 'Change binding attribute');
            }}
          />
          <p class="help ${bad ? 'error' : ''}" id="${id}-ah">
            ${bad ? 'Attribute names use letters, digits, _ . and - (no spaces).' : 'Empty reads the state. For example percentage (fan) or brightness (light).'}
          </p>
        </div>
        <div class="pair">
          ${this._num(`${id}-min`, 'Min', b.input.min, 1, (v) => this._patch(index, { ...b, input: { ...b.input, min: v } }, 'Change binding range'))}
          ${this._num(`${id}-max`, 'Max', b.input.max, 1, (v) => this._patch(index, { ...b, input: { ...b.input, max: v } }, 'Change binding range'))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Output</legend>
        ${this._output(b, index)}
        ${this._num(`${id}-s`, 'Smoothing (s)', b.smoothing ?? 0, 0.1, (v) => {
          const next = { ...b };
          if (v > 0) next.smoothing = Math.min(10, v);
          else delete next.smoothing;
          this._patch(index, next, 'Change binding smoothing');
        })}
      </fieldset>
      ${conflict ? html`<p class="help warn">${conflict}</p>` : nothing}
      ${problem ? html`<p class="help error" role="alert">${problem}</p>` : nothing}
    </li>`;
  }

  protected render(): TemplateResult {
    const target = this._target;
    if (!target || !this.doc) return html``;
    const mine = bindingsOf(this.doc, target);
    const full = !canAddBinding(this.doc);
    const name = CARD_TARGET_NAMES[target] ? `the ${CARD_TARGET_NAMES[target].toLowerCase()}` : `“${targetName(this.doc, target)}”`;
    return html`
      <div class="wrap">
        <p class="help lead">
          ${mine.length
            ? html`The entity’s value drives ${name}. Preview it with the value slider on the stage.`
            : html`Drive ${name} from the entity’s value: rotation speed from a fan’s percentage, a fill from a battery level.`}
        </p>
        ${mine.length ? html`<ol class="binds">${mine.map((x, n) => this._binding(x.b, x.index, n))}</ol>` : nothing}
        <div class="foot">
          <button type="button" class="btn btn-text btn-sm add" ?disabled=${this.disabled || full} @click=${() => this._add()}>
            <ha-icon icon="mdi:plus"></ha-icon>Add value binding
          </button>
          ${full ? html`<span class="help">At most ${BINDINGS_MAX} bindings per animation.</span>` : nothing}
        </div>
        <div class="sr-only" role="status" aria-live="polite">${this._announce}</div>
      </div>
    `;
  }

  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .wrap {
        display: grid;
        gap: 12px;
      }
      .binds {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 12px;
      }
      fieldset {
        margin: 0;
        padding: 0;
        border: 0;
        display: grid;
        gap: 12px;
        min-width: 0;
      }
      legend {
        padding: 0;
        margin-bottom: 8px;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mc-text-2);
      }
      .pair {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 8px;
        align-items: start;
      }
      .help.warn {
        color: var(--mc-warn-ink, var(--mc-text-2));
      }
      .input[aria-invalid='true'] {
        border-color: var(--mc-error-ink);
      }
      .foot {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
    `,
  ];
}

/** A target selected (keyframes documents only): its value bindings. */
registerPanel({
  tag: 'mc-anim-bindings-panel',
  place: 'inspector',
  when: (doc, sel) => doc.kind === 'keyframes' && sel.kind === 'target' && !!selectedTarget(sel),
  title: 'Value bindings',
  order: 60,
});

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-bindings-panel': AnimBindingsPanel;
  }
}
