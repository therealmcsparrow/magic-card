import { html, nothing, TemplateResult } from 'lit';
import { CardModule, HomeAssistant } from '../types';
import { ModuleRegistry } from '../modules/module-registry';

export type ModuleTypeOption = { label: string; value: string };

export interface ChildModuleEditorOptions {
  ownerId: string;
  scopeId: string;
  children: CardModule[];
  hass?: HomeAssistant;
  template?: string;
  expandedState: Map<string, boolean>;
  moduleTypes: ModuleTypeOption[];
  onRefresh: () => void;
  onRemoveChild: (childIdx: number) => void;
  onUpdateChild: (childIdx: number, updated: CardModule) => void;
  onAddChild: (type: string) => void;
  addButtonLabel?: string;
  getItemLabel?: (child: CardModule, index: number, moduleName: string) => string;
}

export function getModuleTypeOptions(): ModuleTypeOption[] {
  return ModuleRegistry.getAll().map((m) => ({
    label: m.metadata.name,
    value: m.metadata.type,
  }));
}

export function renderChildModuleEditor(options: ChildModuleEditorOptions): TemplateResult {
  const {
    ownerId,
    scopeId,
    children,
    hass,
    template,
    expandedState,
    moduleTypes,
    onRefresh,
    onRemoveChild,
    onUpdateChild,
    onAddChild,
    addButtonLabel = 'Add',
    getItemLabel,
  } = options;

  const selectId = `mc-add-child-${ownerId}-${scopeId}`;

  const toggleExpand = (childIdx: number) => {
    const key = `${ownerId}:${scopeId}:${childIdx}`;
    expandedState.set(key, !expandedState.get(key));
    onRefresh();
  };

  return html`
    <div class="mc-child-module-list">
      ${children.map((child, i) => {
        const mod = ModuleRegistry.get(child.type);
        const expandKey = `${ownerId}:${scopeId}:${i}`;
        const isExpanded = expandedState.get(expandKey) ?? false;
        const moduleName = mod?.metadata.name || child.type;
        const title = getItemLabel ? getItemLabel(child, i, moduleName) : moduleName;

        return html`
          <div class="mc-child-module-item">
            <div class="mc-child-module-head" @click=${() => toggleExpand(i)}>
              ${mod?.metadata.icon
                ? html`<ha-icon icon=${mod.metadata.icon} style="--mdc-icon-size:18px"></ha-icon>`
                : nothing}
              <span class="mc-child-module-title">${title}</span>
              <button
                class="mc-btn-icon mc-btn-small"
                @click=${(e: Event) => {
                  e.stopPropagation();
                  onRemoveChild(i);
                }}
              >
                &times;
              </button>
            </div>
            ${isExpanded && mod
              ? html`<div class="mc-child-module-body">
                  ${mod.renderGeneralTab(child, hass, (updated) => onUpdateChild(i, updated), template)}
                </div>`
              : nothing}
          </div>
        `;
      })}

      <div class="mc-child-module-add-row">
        <select id=${selectId} class="mc-child-module-select">
          ${moduleTypes.map((t) => html`<option value=${t.value}>${t.label}</option>`)}
        </select>
        <button
          class="mc-btn mc-btn-secondary"
          @click=${(e: Event) => {
            const container = (e.currentTarget as HTMLElement).parentElement;
            const select = container?.querySelector('select') as HTMLSelectElement | null;
            if (select) onAddChild(select.value);
          }}
        >
          ${addButtonLabel}
        </button>
      </div>
    </div>
  `;
}
