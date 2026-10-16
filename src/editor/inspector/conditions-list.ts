import { html, nothing, TemplateResult } from 'lit';
import type { DisplayCondition, HomeAssistant } from '../../types';
import type { SyncContext } from '../../utils/sync-path';
import {
  renderEntityField,
  renderFieldHead,
  renderSelectField,
  renderTextField,
  renderTextareaField,
} from '../../utils/form-utils';

export type ConditionMode = 'every' | 'any';

export interface ConditionsListHandlers {
  onAdd: () => void;
  /** By index: YAML conditions often have no `id`. */
  onUpdate: (index: number, patch: Partial<DisplayCondition>) => void;
  onRemove: (index: number) => void;
  onMode: (mode: ConditionMode) => void;
}

const TYPE_OPTIONS = [
  { label: 'State', value: 'state' },
  { label: 'Attribute', value: 'attribute' },
  { label: 'Time', value: 'time' },
  { label: 'Template', value: 'template' },
];

const MODES: Array<{ value: ConditionMode; label: string }> = [
  { value: 'every', label: 'All match (AND)' },
  { value: 'any', label: 'Any matches (OR)' },
];

const OPERATORS = [
  { label: 'equals', value: 'eq' },
  { label: 'not equals', value: 'ne' },
];

/** Match All/Any as a radio `.seg`. */
export function renderMatchSeg(
  mode: ConditionMode,
  onMode: (mode: ConditionMode) => void,
  syncCtx?: SyncContext,
  label = 'Match',
): TemplateResult {
  const onKey = (e: KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const next = mode === 'every' ? 'any' : 'every';
    onMode(next);
    const group = e.currentTarget as HTMLElement;
    requestAnimationFrame(() => group.querySelector<HTMLElement>(`[data-val="${next}"]`)?.focus());
  };
  return html`
    <div class="field">
      ${label ? renderFieldHead(label, syncCtx ? 'mode' : undefined, syncCtx) : nothing}
      <div class="seg full" role="radiogroup" aria-label="Condition match" @keydown=${onKey}>
        ${MODES.map(
          (m) => html`
            <button
              type="button"
              role="radio"
              data-val=${m.value}
              aria-checked=${mode === m.value ? 'true' : 'false'}
              tabindex=${mode === m.value ? '0' : '-1'}
              @click=${() => onMode(m.value)}
            >${m.label}</button>
          `,
        )}
      </div>
    </div>
  `;
}

/** Mockup: Operator (equals / not equals) + value, stored as `state` or `state_not`. */
function renderStateMatch(
  cond: DisplayCondition,
  update: (patch: Partial<DisplayCondition>) => void,
  valueLabel: string,
  ctx: SyncContext | undefined,
): TemplateResult {
  const negated = !cond.state && !!cond.state_not;
  const value = (negated ? cond.state_not : cond.state) || '';
  return html`
    <div class="two">
      ${renderSelectField(
        'Operator',
        negated ? 'ne' : 'eq',
        OPERATORS,
        (op) => update(op === 'ne' ? { state: undefined, state_not: value } : { state: value, state_not: undefined }),
      )}
      ${renderTextField(
        valueLabel,
        value,
        (v) => update(negated ? { state_not: v } : { state: v }),
        ctx ? (negated ? 'state_not' : 'state') : undefined,
        ctx,
      )}
    </div>
  `;
}

function renderTimeField(label: string, value: string | undefined, onChange: (v: string) => void): TemplateResult {
  return html`
    <div class="mc-field">
      ${renderFieldHead(label)}
      <input class="input" type="time" .value=${value || ''} @input=${(e: InputEvent) => onChange((e.target as HTMLInputElement).value)} />
    </div>
  `;
}

function renderConditionFields(
  cond: DisplayCondition,
  update: (patch: Partial<DisplayCondition>) => void,
  hass: HomeAssistant | undefined,
  ctx: SyncContext | undefined,
): TemplateResult {
  const p = (name: string) => (ctx ? name : undefined);
  switch (cond.type) {
    case 'state':
    case 'attribute':
      return html`
        ${renderEntityField('Entity', cond.entity, (v) => update({ entity: v }), hass, undefined, p('entity'), ctx)}
        ${cond.type === 'attribute'
          ? renderTextField('Attribute', cond.attribute, (v) => update({ attribute: v }), p('attribute'), ctx)
          : nothing}
        ${renderStateMatch(cond, update, cond.type === 'attribute' ? 'Value' : 'State', ctx)}
      `;
    case 'time':
      return html`
        <div class="two">
          ${renderTimeField('After', cond.after, (v) => update({ after: v }))}
          ${renderTimeField('Before', cond.before, (v) => update({ before: v }))}
        </div>
      `;
    case 'template':
      return renderTextareaField('Template', cond.template, (v) => update({ template: v }), { rows: 3 }, p('template'), ctx);
    default:
      return html``;
  }
}

/**
 * Display-condition list shared by card, row, column, module and appearance rules.
 * `syncCtx.basePath` should point at the display object (e.g. `display`); items get
 * `<basePath>.conditions.<idx>`.
 */
export function renderConditionsList(
  conditions: DisplayCondition[],
  mode: ConditionMode,
  handlers: ConditionsListHandlers,
  hass: HomeAssistant | undefined,
  syncCtx?: SyncContext,
  subject = 'module',
): TemplateResult {
  if (!conditions.length) {
    return html`
      <div class="empty">
        <ha-icon icon="mdi:eye-check-outline"></ha-icon>
        <strong>Always visible</strong>
        <p>Add a condition to show this ${subject} only when it matters.</p>
        <button type="button" class="btn btn-secondary btn-sm" @click=${handlers.onAdd}>
          <ha-icon icon="mdi:plus"></ha-icon>Add condition
        </button>
      </div>
    `;
  }
  const base = syncCtx?.basePath;
  return html`
    <div class="group">
      <p class="help lead">Show this ${subject} when…</p>
      ${renderMatchSeg(mode, handlers.onMode, syncCtx, '')}
    </div>
    <div class="group cond-list">
      ${conditions.map((cond, idx) => {
        const ctx = syncCtx ? { ...syncCtx, basePath: base ? `${base}.conditions.${idx}` : `conditions.${idx}` } : undefined;
        const update = (patch: Partial<DisplayCondition>) => handlers.onUpdate(idx, patch);
        return html`
          <div class="cond">
            <div class="cond-head">
              <span class="n">Condition ${idx + 1}</span>
              <button
                type="button"
                class="icon-btn sm danger"
                aria-label="Remove condition ${idx + 1}"
                title="Remove condition"
                @click=${() => handlers.onRemove(idx)}
              >
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
            ${renderSelectField(
              'Type',
              cond.type,
              TYPE_OPTIONS,
              (v) => update({ type: v as DisplayCondition['type'] }),
              ctx ? 'type' : undefined,
              ctx,
            )}
            ${renderConditionFields(cond, update, hass, ctx)}
          </div>
        `;
      })}
      <div>
        <button type="button" class="btn btn-secondary btn-sm" @click=${handlers.onAdd}>
          <ha-icon icon="mdi:plus"></ha-icon>Add condition
        </button>
      </div>
    </div>
  `;
}
