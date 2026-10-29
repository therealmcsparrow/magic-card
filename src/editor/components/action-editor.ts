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
import { isValidPopupHash, normalizePopupHash } from '../../utils/popup-hash';
import { popupIfLoaded } from '../../card/popup-seam';
import { t, tx, m, tl, type MessageIndex } from '../i18n';

/** The gestures of an Actions tab, in order. */
export const ACTION_GESTURES: Array<{ key: keyof ActionsConfig; title: MessageIndex; icon: string }> = [
  { key: 'tap_action', title: m('card-editor.action-editor.tap'), icon: 'mdi:gesture-tap' },
  { key: 'hold_action', title: m('card-editor.action-editor.hold'), icon: 'mdi:gesture-tap-hold' },
  { key: 'double_tap_action', title: m('card-editor.action-editor.double-tap'), icon: 'mdi:gesture-double-tap' },
];

const ACTION_OPTIONS: Array<{ label: MessageIndex; value: ActionType }> = [
  { label: m('card-editor.action-editor.none'), value: 'none' },
  { label: m('card-editor.action-editor.toggle'), value: 'toggle' },
  { label: m('card-editor.action-editor.more-info'), value: 'more-info' },
  { label: m('card-editor.action-editor.navigate'), value: 'navigate' },
  { label: m('card-editor.action-editor.call-service'), value: 'perform-action' },
  { label: m('card-editor.action-editor.url'), value: 'url' },
  { label: m('card-editor.action-editor.assist'), value: 'assist' },
  { label: m('card-editor.action-editor.open-pop-up'), value: 'popup' },
  { label: m('card-editor.action-editor.close-pop-up'), value: 'close-popup' },
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
  const popupError = popupId && !isValidPopupHash(popupId) ? t('card-editor.popup-settings.use-letters-digits-and-only-no-spaces') : '';
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
        t('card-editor.action-editor.action'),
        currentAction.action,
        tl(ACTION_OPTIONS),
        (v) => onChange({ ...currentAction, action: v as ActionType }),
        'action',
        syncCtx,
      )}
      ${needsEntity && ownerEntity
        ? renderToggleField(
            t('card-editor.action-editor.use-module-entity'),
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
        ? renderEntityField(t('card-editor.action-editor.entity'), currentAction.entity, (v) =>
            onChange({ ...currentAction, entity: v }), hass, undefined,
            'entity', syncCtx,
          )
        : nothing}
      ${currentAction.action === 'toggle' && ownerEntity && useModuleEntity
        ? html`<p class="help">${tx('card-editor.action-editor.toggles-entity-the-module-entity', { entity: html`<span class="mono">${ownerEntity}</span>` })}</p>`
        : nothing}
      ${currentAction.action === 'navigate'
        ? renderTextField(t('card-editor.action-editor.navigation-path'), currentAction.navigation_path, (v) =>
            onChange({ ...currentAction, navigation_path: v }),
            'navigation_path', syncCtx,
          )
        : nothing}
      ${currentAction.action === 'popup'
        ? html`
            <div class="mc-field">
              ${renderFieldHead(t('card-editor.action-editor.pop-up-id'), 'hash', syncCtx)}
              <input
                class="input mono"
                type="text"
                spellcheck="false"
                autocomplete="off"
                list=${listId}
                placeholder="kitchen"
                aria-label=${t('card-editor.action-editor.pop-up-id')}
                .value=${popupId}
                @input=${(e: InputEvent) => onChange({ ...currentAction, hash: normalizePopupHash((e.target as HTMLInputElement).value) || undefined })}
              />
              <datalist id=${listId}>
                ${(popupIfLoaded()?.api.knownIds() ?? []).map((id) => html`<option value=${id}></option>`)}
              </datalist>
              ${popupError
                ? html`<p class="help error" role="alert">${popupError}</p>`
                : html`<p class="help">${tx('card-editor.action-editor.opens-the-magic-card-pop-up-with-this-id', { path: html`<span class="mono">#${popupId || 'id'}</span>` })}</p>`}
            </div>
          `
        : nothing}
      ${currentAction.action === 'close-popup'
        ? html`<p class="help">${t('card-editor.action-editor.closes-the-magic-card-pop-up-that-is')}</p>`
        : nothing}
      ${currentAction.action === 'url'
        ? renderTextField(t('card-editor.action-editor.url'), currentAction.url_path, (v) =>
            onChange({ ...currentAction, url_path: v }),
            'url_path', syncCtx,
          )
        : nothing}
      ${currentAction.action === 'perform-action'
        ? html`
            ${renderServiceField(t('card-editor.action-editor.service'), currentAction.service, (v) =>
              onChange({ ...currentAction, service: v }), hass,
              'service', syncCtx,
            )}
            ${renderTextField(t('card-editor.action-editor.target-entity'), target, (v) => {
              const next = { ...(currentAction.data || {}) } as Record<string, unknown>;
              if (v.trim()) next.entity_id = v.trim();
              else delete next.entity_id;
              writeData(next);
            }, 'data', syncCtx, { placeholder: 'entity_id', mono: true })}
            <div class="mc-field">
              ${renderFieldHead(t('card-editor.action-editor.service-data'), 'data', syncCtx)}
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
              <p class="help">${t('card-editor.action-editor.yaml-leave-empty-to-call-the-service')}</p>
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
        <div class="group-head"><ha-icon icon=${g.icon}></ha-icon><h3>${t(g.title)}</h3></div>
        ${renderActionConfig(actions?.[g.key], (a) => update(g.key, a), hass, ownerEntity, syncCtxFor?.(g.key), g.key)}
      </section>
    `,
  )}`;
}
