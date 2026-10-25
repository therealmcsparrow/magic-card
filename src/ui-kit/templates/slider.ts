import { html, nothing, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { shownValue } from './shown-value';
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

export function slider(o: SliderOptions): TemplateResult {
  /** The row's two fields show one value: an input mirrors into the other field, a commit also clamps it and reports. */
  const sync = (e: Event, commit: boolean): void => {
    const f = e.target as HTMLInputElement;
    const n = Number(f.value);
    if (f.value === '' || !Number.isFinite(n)) return;
    const v = Math.max(o.min, Math.min(o.max, n));
    [...f.parentElement!.querySelectorAll('input')].find((i) => i !== f)!.value = String(v);
    if (commit) {
      f.value = String(v);
      o.onChange(v);
    } else if (f.type === 'range') o.onInput(v);
  };
  const mirror = (e: Event): void => sync(e, false);
  const commit = (e: Event): void => sync(e, true);
  return html`<div class="slider-row">
    <label for=${o.id}>${o.label}</label>
    <input
      id=${o.id}
      type="range"
      min=${o.min}
      max=${o.max}
      step=${o.step}
      .value=${shownValue(String(o.value))}
      aria-valuetext=${ifDefined(o.valueText)}
      ?disabled=${o.disabled}
      @input=${mirror}
      @change=${commit}
    />
    <input
      class="input"
      type="number"
      min=${o.min}
      max=${o.max}
      step=${o.step}
      aria-label=${o.numberLabel ?? o.label}
      .value=${shownValue(String(o.value))}
      ?disabled=${o.disabled}
      @input=${mirror}
      @change=${commit}
    />
    ${o.unit ? html`<span aria-hidden="true">${o.unit}</span>` : nothing}
  </div>`;
}
