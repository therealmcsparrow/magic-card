import { html, nothing, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { KitSliderOptions } from '../../contracts/ui-kit';

/*
 * .slider-row: label for the range, the range, a number field with the same value and an optional unit. The range
 * reports onInput while it moves and onChange on release; the number field reports onChange. The three extras are
 * additive to KitSliderOptions (valueText for aria-valuetext, numberLabel for the number field, disabled).
 */
export interface SliderOptions extends KitSliderOptions {
  valueText?: string;
  numberLabel?: string;
  disabled?: boolean;
}

const val = (e: Event): number => Number((e.target as HTMLInputElement).value);

export function slider(o: SliderOptions): TemplateResult {
  return html`<div class="slider-row">
    <label for=${o.id}>${o.label}</label>
    <input
      id=${o.id}
      type="range"
      min=${o.min}
      max=${o.max}
      step=${o.step}
      .value=${String(o.value)}
      aria-valuetext=${ifDefined(o.valueText)}
      ?disabled=${o.disabled}
      @input=${(e: Event) => o.onInput(val(e))}
      @change=${(e: Event) => o.onChange(val(e))}
    />
    <input
      class="input"
      type="number"
      min=${o.min}
      max=${o.max}
      step=${o.step}
      aria-label=${o.numberLabel ?? o.label}
      .value=${String(o.value)}
      ?disabled=${o.disabled}
      @change=${(e: Event) => o.onChange(val(e))}
    />
    ${o.unit ? html`<span aria-hidden="true">${o.unit}</span>` : nothing}
  </div>`;
}
