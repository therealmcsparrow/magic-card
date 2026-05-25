import { nothing, TemplateResult, html } from 'lit';
import { SyncContext, isNotSynced, hasTemplate as ctxHasTemplate, getFullPath } from './sync-path';
import { HomeAssistant } from '../types';
import '../editor/components/sync-indicator';
import '../editor/components/attribute-picker';
import '../editor/components/box-field';

/**
 * Render a field label with optional sync indicator.
 */
function renderLabel(
  label: string,
  propertyName?: string,
  syncContext?: SyncContext,
): TemplateResult {
  const showSync = propertyName && syncContext && ctxHasTemplate(syncContext);
  if (!showSync) {
    return html`<label class="mc-field-label">${label}</label>`;
  }

  const isSynced = !isNotSynced(syncContext!, propertyName!);
  const fullPath = getFullPath(syncContext!, propertyName!);

  return html`
    <label class="mc-field-label">
      ${label}
      <mc-sync-indicator
        .synced=${isSynced}
        .hasTemplate=${true}
        .propertyPath=${fullPath}
        .hideIfNoTemplate=${true}
        @sync-toggle=${(e: CustomEvent) => {
          const event = new CustomEvent('field-sync-toggle', {
            detail: { propertyPath: e.detail.propertyPath, synced: e.detail.synced },
            bubbles: true,
            composed: true,
          });
          (e.target as HTMLElement).dispatchEvent(event);
        }}
      ></mc-sync-indicator>
    </label>
  `;
}

export function renderFieldHint(text: string, className?: string): TemplateResult {
  return html`<div class=${`mc-field-hint${className ? ` ${className}` : ''}`}>${text}</div>`;
}

type BoxBaseName = 'padding' | 'margin' | 'border_radius';

interface BoxSides {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

function parseBoxShorthand(value: string | undefined): BoxSides {
  const raw = (value || '').trim();
  if (!raw) return { top: '', right: '', bottom: '', left: '' };
  const parts = raw.split(/\s+/);
  if (parts.length === 1) {
    return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
  }
  if (parts.length === 2) {
    return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
  }
  if (parts.length === 3) {
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
  }
  return {
    top: parts[0] || '',
    right: parts[1] || '',
    bottom: parts[2] || '',
    left: parts[3] || '',
  };
}

function toBoxShorthand(sides: BoxSides): string | undefined {
  const { top, right, bottom, left } = sides;
  if (!top && !right && !bottom && !left) return undefined;
  if (top === right && right === bottom && bottom === left) return top || undefined;
  if (top === bottom && right === left) return `${top || '0'} ${right || '0'}`;
  if (right === left) return `${top || '0'} ${right || '0'} ${bottom || '0'}`;
  return `${top || '0'} ${right || '0'} ${bottom || '0'} ${left || '0'}`;
}

function applyBoxFieldUpdates(
  currentValue: string | undefined,
  baseName: BoxBaseName,
  updates: Record<string, unknown>,
): string | undefined {
  const next = parseBoxShorthand(currentValue);

  if (typeof updates[baseName] === 'string') {
    return toBoxShorthand(parseBoxShorthand(updates[baseName] as string));
  }

  if (typeof updates[`${baseName}_top`] === 'string') next.top = updates[`${baseName}_top`] as string;
  if (typeof updates[`${baseName}_right`] === 'string') next.right = updates[`${baseName}_right`] as string;
  if (typeof updates[`${baseName}_bottom`] === 'string') next.bottom = updates[`${baseName}_bottom`] as string;
  if (typeof updates[`${baseName}_left`] === 'string') next.left = updates[`${baseName}_left`] as string;

  if (baseName === 'border_radius') {
    if (typeof updates.border_top_left_radius === 'string') next.top = updates.border_top_left_radius as string;
    if (typeof updates.border_top_right_radius === 'string') next.right = updates.border_top_right_radius as string;
    if (typeof updates.border_bottom_right_radius === 'string') next.bottom = updates.border_bottom_right_radius as string;
    if (typeof updates.border_bottom_left_radius === 'string') next.left = updates.border_bottom_left_radius as string;
  }

  return toBoxShorthand(next);
}

export function renderTextField(
  label: string,
  value: string | undefined,
  onChange: (value: string) => void,
  propertyName?: string,
  syncContext?: SyncContext,
): TemplateResult {
  return html`
    <div class="mc-field">
      ${renderLabel(label, propertyName, syncContext)}
      <input
        type="text"
        .value=${value || ''}
        @input=${(e: InputEvent) => onChange((e.target as HTMLInputElement).value)}
      />
    </div>
  `;
}

export function renderTextareaField(
  label: string,
  value: string | undefined,
  onChange: (value: string) => void,
  options?: { rows?: number; placeholder?: string },
  propertyName?: string,
  syncContext?: SyncContext,
): TemplateResult {
  return html`
    <div class="mc-field">
      ${renderLabel(label, propertyName, syncContext)}
      <textarea
        .value=${value || ''}
        rows=${String(options?.rows ?? 4)}
        placeholder=${options?.placeholder ?? nothing}
        @input=${(e: InputEvent) => onChange((e.target as HTMLTextAreaElement).value)}
      ></textarea>
    </div>
  `;
}

export function renderNumberField(
  label: string,
  value: number | undefined,
  onChange: (value: number) => void,
  options?: { min?: number; max?: number; step?: number },
  propertyName?: string,
  syncContext?: SyncContext,
): TemplateResult {
  return html`
    <div class="mc-field">
      ${renderLabel(label, propertyName, syncContext)}
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
  propertyName?: string,
  syncContext?: SyncContext,
): TemplateResult {
  return html`
    <div class="mc-field">
     ${label ? renderLabel(label, propertyName, syncContext) : nothing}
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
  propertyName?: string,
  syncContext?: SyncContext,
): TemplateResult {
  return html`
    <div class="mc-field mc-field-toggle">
      ${renderLabel(label, propertyName, syncContext)}
      <ha-switch
        .checked=${value ?? false}
        @change=${(e: Event) => onChange((e.target as HTMLInputElement).checked)}
      ></ha-switch>
    </div>
  `;
}

export function renderEntityField(
  label: string,
  value: string | undefined,
  onChange: (value: string) => void,
  hass?: unknown,
  domain?: string,
  propertyName?: string,
  syncContext?: SyncContext,
): TemplateResult {
  return html`
    <div class="mc-field">
      ${renderLabel(label, propertyName, syncContext)}
      <mc-entity-picker
        .hass=${hass}
        .value=${value || ''}
        .domain=${domain || ''}
        @value-changed=${(e: CustomEvent) => onChange(e.detail.value)}
      ></mc-entity-picker>
    </div>
  `;
}

export function renderServiceField(
  label: string,
  value: string | undefined,
  onChange: (value: string) => void,
  hass?: unknown,
  propertyName?: string,
  syncContext?: SyncContext,
): TemplateResult {
  return html`
    <div class="mc-field">
      ${renderLabel(label, propertyName, syncContext)}
      <mc-service-picker
        .hass=${hass}
        .value=${value || ''}
        @value-changed=${(e: CustomEvent) => onChange(e.detail.value)}
      ></mc-service-picker>
    </div>
  `;
}

export function renderColorField(
  label: string,
  value: string | undefined,
  onChange: (value: string) => void,
  propertyName?: string,
  syncContext?: SyncContext,
): TemplateResult {
  return html`
    <div class="mc-field">
      ${renderLabel(label, propertyName, syncContext)}
      <mc-color-picker
        .value=${value || ''}
        .label=${label}
        @value-changed=${(e: CustomEvent) => onChange(e.detail.value)}
      ></mc-color-picker>
    </div>
  `;
}

export function renderUnitField(
  label: string,
  value: string | undefined,
  onChange: (value: string) => void,
  propertyName?: string,
  syncContext?: SyncContext,
): TemplateResult {
  return html`
    <div class="mc-field">
      ${renderLabel(label, propertyName, syncContext)}
      <mc-unit-field
        .value=${value || ''}
        @value-changed=${(e: CustomEvent) => onChange(e.detail.value)}
      ></mc-unit-field>
    </div>
  `;
}

export function renderBoxField(
  label: string,
  value: string | undefined,
  onChange: (value: string | undefined) => void,
  baseName: BoxBaseName,
  propertyName?: string,
  syncContext?: SyncContext,
): TemplateResult {
  const design = { [baseName]: value || '' } as Record<string, unknown>;
  return html`
    <div class="mc-field">
      ${renderLabel(label, propertyName, syncContext)}
      <mc-box-field
        .design=${design}
        .onChange=${(updates: Record<string, unknown>) =>
          onChange(applyBoxFieldUpdates(value, baseName, updates))}
        .baseName=${baseName}
      ></mc-box-field>
    </div>
  `;
}

export function renderIconField(
  label: string,
  value: string | undefined,
  onChange: (value: string) => void,
  hass?: unknown,
  propertyName?: string,
  syncContext?: SyncContext,
): TemplateResult {
  return html`
    <div class="mc-field">
      ${renderLabel(label, propertyName, syncContext)}
      <mc-icon-picker
        .hass=${hass}
        .value=${value || ''}
        @value-changed=${(e: CustomEvent) => onChange(e.detail.value || '')}
      ></mc-icon-picker>
    </div>
  `;
}

export function renderCardField(
  label: string,
  value: string | undefined,
  onChange: (value: string) => void,
  propertyName?: string,
  syncContext?: SyncContext,
): TemplateResult {
  return html`
    <div class="mc-field">
      ${renderLabel(label, propertyName, syncContext)}
      <mc-card-picker
        .value=${value || ''}
        @value-changed=${(e: CustomEvent) => onChange(e.detail.value)}
      ></mc-card-picker>
    </div>
  `;
}

export function renderMediaField(
  label: string,
  value: string | undefined,
  onChange: (value: string) => void,
  hass?: unknown,
  mediaType?: 'image' | 'video' | '',
  propertyName?: string,
  syncContext?: SyncContext,
): TemplateResult {
  return html`
    <div class="mc-field">
      ${renderLabel(label, propertyName, syncContext)}
      <mc-media-picker
        .hass=${hass}
        .value=${value || ''}
        .mediaType=${mediaType || ''}
        @value-changed=${(e: CustomEvent) => onChange(e.detail.value)}
      ></mc-media-picker>
    </div>
  `;
}

/**
 * Render an attribute picker for an entity.
 * Uses mc-attribute-picker component styled like the entity picker.
 * Hidden when no entity is provided.
 */
export function renderAttributeField(
  label: string,
  value: string | undefined,
  onChange: (value: string) => void,
  hass?: HomeAssistant,
  entityId?: string,
  propertyName?: string,
  syncContext?: SyncContext,
): TemplateResult {
  if (!entityId || !hass) return html``;

  const entity = hass.states[entityId];
  if (!entity || Object.keys(entity.attributes).length === 0) return html``;

  return html`
    <div class="mc-field">
      ${renderLabel(label, propertyName, syncContext)}
      <mc-attribute-picker
        .hass=${hass}
        .value=${value || ''}
        .entityId=${entityId}
        @value-changed=${(e: CustomEvent) => onChange(e.detail.value)}
      ></mc-attribute-picker>
    </div>
  `;
}
