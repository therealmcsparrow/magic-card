import { html, nothing, TemplateResult } from 'lit';
import type { ActionConfig, ActionsConfig, ActionType, HomeAssistant } from '../../types';
import type { SyncContext } from '../../utils/sync-path';
import {
  renderEntityField,
  renderFieldHead,
  renderSelectField,
  renderServiceField,
  renderTextField,
  renderToggleField,
} from '../../utils/form-utils';
import { fromYaml, toYaml } from '../../utils/yaml-utils';
import { normalizePopupHash, popupHashError } from '../../utils/popup';
import { popupCoordinator } from '../../card/popup-coordinator';

/** The gestures of an Actions tab, in order. */
export const ACTION_GESTURES: Array<{ key: keyof ActionsConfig; title: string; icon: string }> = [
  { key: 'tap_action', title: 'Tap', icon: 'mdi:gesture-tap' },
  { key: 'hold_action', title: 'Hold', icon: 'mdi:gesture-tap-hold' },
  { key: 'double_tap_action', title: 'Double tap', icon: 'mdi:gesture-double-tap' },
];

const ACTION_OPTIONS: Array<{ label: string; value: ActionType }> = [
  { label: 'None', value: 'none' },
  { label: 'Toggle', value: 'toggle' },
  { label: 'More info', value: 'more-info' },
  { label: 'Navigate', value: 'navigate' },
  { label: 'Call service', value: 'perform-action' },
  { label: 'URL', value: 'url' },
  { label: 'Assist', value: 'assist' },
  { label: 'Open pop-up', value: 'popup' },
  { label: 'Close pop-up', value: 'close-popup' },
];

/**
 * One gesture's action: the Action select, then the fields that action needs (entity, navigation
 * path, URL, service with target and YAML data, pop-up ID). `ownerEntity` is the module's entity
 * (toggle / more-info may use it); a row has none, so it always asks for an entity.
 */
export function renderActionConfig(
  action: ActionConfig | undefined,
  onChange: (action: ActionConfig) => void,
  hass?: HomeAssistant,
  ownerEntity?: string,
  syncCtx?: SyncContext,
  key = 'action',
): TemplateResult {
  const currentAction = action || { action: 'none' as ActionType };
  const popupId = normalizePopupHash(currentAction.hash);
  const popupError = popupHashError(popupId);
  const listId = `mc-popup-ids-${key}`;
  const needsEntity = currentAction.action === 'more-info' || currentAction.action === 'toggle';
  const useModuleEntity = currentAction.use_module_entity !== false; // default true
  const data = { ...(currentAction.data || {}) } as Record<string, unknown>;
  const target = typeof data.entity_id === 'string' ? data.entity_id : '';
  delete data.entity_id;
  const dataYaml = Object.keys(data).length ? toYaml(data).trimEnd() : '';
  const writeData = (next: Record<string, unknown>) =>
    onChange({ ...currentAction, data: Object.keys(next).length ? next : undefined });

  return html`
    <div class="mc-action-config">
      ${renderSelectField(
        'Action',
        currentAction.action,
        ACTION_OPTIONS,
        (v) => onChange({ ...currentAction, action: v as ActionType }),
        'action',
        syncCtx,
      )}
      ${needsEntity && ownerEntity
        ? renderToggleField(
            'Use module entity',
            useModuleEntity,
            (v) => onChange({
              ...currentAction,
              use_module_entity: v,
              entity: v ? undefined : currentAction.entity,
            }),
            'use_module_entity',
            syncCtx,
          )
        : nothing}
      ${needsEntity && (!ownerEntity || !useModuleEntity)
        ? renderEntityField('Entity', currentAction.entity, (v) =>
            onChange({ ...currentAction, entity: v }), hass, undefined,
            'entity', syncCtx,
          )
        : nothing}
      ${currentAction.action === 'toggle' && ownerEntity && useModuleEntity
        ? html`<p class="help">Toggles <span class="mono">${ownerEntity}</span> (the module entity).</p>`
        : nothing}
      ${currentAction.action === 'navigate'
        ? renderTextField('Navigation path', currentAction.navigation_path, (v) =>
            onChange({ ...currentAction, navigation_path: v }),
            'navigation_path', syncCtx,
          )
        : nothing}
      ${currentAction.action === 'popup'
        ? html`
            <div class="mc-field">
              ${renderFieldHead('Pop-up ID', 'hash', syncCtx)}
              <input
                class="input mono"
                type="text"
                spellcheck="false"
                autocomplete="off"
                list=${listId}
                placeholder="kitchen"
                aria-label="Pop-up ID"
                .value=${popupId}
                @input=${(e: InputEvent) => onChange({ ...currentAction, hash: normalizePopupHash((e.target as HTMLInputElement).value) || undefined })}
              />
              <datalist id=${listId}>
                ${popupCoordinator.knownIds().map((id) => html`<option value=${id}></option>`)}
              </datalist>
              ${popupError
                ? html`<p class="help error" role="alert">${popupError}</p>`
                : html`<p class="help">Opens the Magic Card pop-up with this ID (navigates to <span class="mono">#${popupId || 'id'}</span>).</p>`}
            </div>
          `
        : nothing}
      ${currentAction.action === 'close-popup'
        ? html`<p class="help">Closes the Magic Card pop-up that is open (also from inside it).</p>`
        : nothing}
      ${currentAction.action === 'url'
        ? renderTextField('URL', currentAction.url_path, (v) =>
            onChange({ ...currentAction, url_path: v }),
            'url_path', syncCtx,
          )
        : nothing}
      ${currentAction.action === 'perform-action'
        ? html`
            ${renderServiceField('Service', currentAction.service, (v) =>
              onChange({ ...currentAction, service: v }), hass,
              'service', syncCtx,
            )}
            ${renderTextField('Target entity', target, (v) => {
              const next = { ...(currentAction.data || {}) } as Record<string, unknown>;
              if (v.trim()) next.entity_id = v.trim();
              else delete next.entity_id;
              writeData(next);
            }, 'data', syncCtx, { placeholder: 'entity_id', mono: true })}
            <div class="mc-field">
              ${renderFieldHead('Service data', 'data', syncCtx)}
              <textarea
                class="input"
                rows="3"
                spellcheck="false"
                .value=${dataYaml}
                @input=${(e: InputEvent) => {
                  const text = (e.target as HTMLTextAreaElement).value;
                  const parsed = text.trim() ? fromYaml<Record<string, unknown>>(text) : {};
                  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return; // keep typing until it parses
                  writeData(target ? { ...parsed, entity_id: target } : { ...parsed });
                }}
              ></textarea>
              <p class="help">YAML. Leave empty to call the service without data.</p>
            </div>
          `
        : nothing}
    </div>
  `;
}

/** The Actions tab: one group per gesture (icon heading) with its action editor. */
export function renderActionGroups(
  actions: ActionsConfig | undefined,
  update: (key: keyof ActionsConfig, action: ActionConfig) => void,
  hass?: HomeAssistant,
  ownerEntity?: string,
  syncCtxFor?: (key: keyof ActionsConfig) => SyncContext | undefined,
): TemplateResult {
  return html`${ACTION_GESTURES.map(
    (g) => html`
      <section class="group">
        <div class="group-head"><ha-icon icon=${g.icon}></ha-icon><h3>${g.title}</h3></div>
        ${renderActionConfig(actions?.[g.key], (a) => update(g.key, a), hass, ownerEntity, syncCtxFor?.(g.key), g.key)}
      </section>
    `,
  )}`;
}
