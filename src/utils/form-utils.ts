import { nothing, TemplateResult, html } from 'lit';
import '../editor/components/color-picker';

export function renderTextField(
  label: string,
  value: string | undefined,
  onChange: (value: string) => void,
): TemplateResult {
  return html`
    <div class="mc-field">
      <label class="mc-field-label">${label}</label>
      <input
        type="text"
        .value=${value || ''}
        @input=${(e: InputEvent) => onChange((e.target as HTMLInputElement).value)}
      />
    </div>
  `;
}

export function renderNumberField(
  label: string,
  value: number | undefined,
  onChange: (value: number) => void,
  options?: { min?: number; max?: number; step?: number },
): TemplateResult {
  return html`
    <div class="mc-field">
      <label class="mc-field-label">${label}</label>
      <input
        type="number"
        .value=${String(value ?? '')}
        min=${options?.min ?? nothing}
        max=${options?.max ?? nothing}
        step=${options?.step ?? nothing}
        @input=${(e: InputEvent) => onChange(Number((e.target as HTMLInputElement).value))}
      />
    </div>
  `;
}

export function renderSelectField(
  label: string,
  value: string | undefined,
  options: Array<{ label: string; value: string }>,
  onChange: (value: string) => void,
): TemplateResult {
  return html`
    <div class="mc-field">
      <label class="mc-field-label">${label}</label>
      <select @change=${(e: Event) => onChange((e.target as HTMLSelectElement).value)}>
        ${options.map(
          (opt) =>
            html`<option value=${opt.value} ?selected=${value === opt.value}>
              ${opt.label}
            </option>`,
        )}
      </select>
    </div>
  `;
}

export function renderToggleField(
  label: string,
  value: boolean | undefined,
  onChange: (value: boolean) => void,
): TemplateResult {
  return html`
    <div class="mc-field mc-field-toggle">
      <label class="mc-field-label">${label}</label>
      <input
        type="checkbox"
        .checked=${value ?? false}
        @change=${(e: Event) => onChange((e.target as HTMLInputElement).checked)}
      />
    </div>
  `;
}

export function renderEntityField(
  label: string,
  value: string | undefined,
  onChange: (value: string) => void,
): TemplateResult {
  return html`
    <div class="mc-field">
      <label class="mc-field-label">${label}</label>
      <input
        type="text"
        .value=${value || ''}
        placeholder="entity_id"
        @input=${(e: InputEvent) => onChange((e.target as HTMLInputElement).value)}
      />
    </div>
  `;
}

export function renderColorField(
  label: string,
  value: string | undefined,
  onChange: (value: string) => void,
): TemplateResult {
  return html`
    <div class="mc-field">
      <label class="mc-field-label">${label}</label>
      <mc-color-picker
        .value=${value || ''}
        .label=${label}
        @value-changed=${(e: CustomEvent) => onChange(e.detail.value)}
      ></mc-color-picker>
    </div>
  `;
}
