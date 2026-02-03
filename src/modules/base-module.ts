import { html, TemplateResult, nothing } from 'lit';
import { MagicModule, MagicModuleMetadata } from './module-types';
import {
  CardModule,
  HomeAssistant,
  EditorTab,
  ActionsConfig,
  ActionConfig,
  ActionType,
  DisplayConfig,
  DisplayCondition,
  DesignConfig,
} from '../types';
import { generateId } from '../utils/id-generator';
import {
  renderTextField,
  renderSelectField,
  renderToggleField,
  renderEntityField,
  renderNumberField,
} from '../utils/form-utils';

export abstract class BaseMagicModule implements MagicModule {
  abstract readonly metadata: MagicModuleMetadata;

  abstract createDefault(): CardModule;

  abstract renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult;

  abstract renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult;

  getAvailableTabs(): EditorTab[] {
    return ['general', 'actions', 'logic', 'design'];
  }

  validate(_config: CardModule): string[] {
    return [];
  }

  renderActionsTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const actions = config.actions as ActionsConfig | undefined;

    const updateAction = (key: keyof ActionsConfig, action: ActionConfig) => {
      onChange({
        ...config,
        actions: { ...actions, [key]: action },
      });
    };

    return html`
      <div class="mc-tab-content">
        <div class="mc-section">
          <div class="mc-section-header">Tap Action</div>
          ${this._renderActionConfig(actions?.tap_action, (a) => updateAction('tap_action', a))}
        </div>
        <div class="mc-section">
          <div class="mc-section-header">Hold Action</div>
          ${this._renderActionConfig(actions?.hold_action, (a) => updateAction('hold_action', a))}
        </div>
        <div class="mc-section">
          <div class="mc-section-header">Double Tap Action</div>
          ${this._renderActionConfig(actions?.double_tap_action, (a) =>
            updateAction('double_tap_action', a),
          )}
        </div>
      </div>
    `;
  }

  renderLogicTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const display = config.display as DisplayConfig | undefined;
    const conditions = display?.conditions || [];
    const mode = display?.mode || 'every';

    const updateDisplay = (updates: Partial<DisplayConfig>) => {
      onChange({
        ...config,
        display: { ...display, ...updates },
      });
    };

    const addCondition = () => {
      const newCondition: DisplayCondition = {
        id: generateId('cond'),
        type: 'state',
        entity: '',
        state: '',
      };
      updateDisplay({ conditions: [...conditions, newCondition] });
    };

    const removeCondition = (id: string) => {
      updateDisplay({ conditions: conditions.filter((c) => c.id !== id) });
    };

    const updateCondition = (id: string, updates: Partial<DisplayCondition>) => {
      updateDisplay({
        conditions: conditions.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      });
    };

    return html`
      <div class="mc-tab-content">
        ${renderSelectField(
          'Condition Mode',
          mode,
          [
            { label: 'All conditions (AND)', value: 'every' },
            { label: 'Any condition (OR)', value: 'any' },
          ],
          (v) => updateDisplay({ mode: v as 'every' | 'any' }),
        )}

        <div class="mc-conditions-list">
          ${conditions.map(
            (cond) => html`
              <div class="mc-condition-item">
                ${renderSelectField(
                  'Type',
                  cond.type,
                  [
                    { label: 'State', value: 'state' },
                    { label: 'Attribute', value: 'attribute' },
                    { label: 'Time', value: 'time' },
                    { label: 'Template', value: 'template' },
                  ],
                  (v) => updateCondition(cond.id, { type: v as DisplayCondition['type'] }),
                )}
                ${cond.type === 'state' || cond.type === 'attribute'
                  ? html`
                      ${renderEntityField('Entity', cond.entity, (v) =>
                        updateCondition(cond.id, { entity: v }),
                      )}
                      ${cond.type === 'attribute'
                        ? renderTextField('Attribute', cond.attribute, (v) =>
                            updateCondition(cond.id, { attribute: v }),
                          )
                        : nothing}
                      ${renderTextField('State equals', cond.state, (v) =>
                        updateCondition(cond.id, { state: v }),
                      )}
                      ${renderTextField('State not equals', cond.state_not, (v) =>
                        updateCondition(cond.id, { state_not: v }),
                      )}
                    `
                  : nothing}
                ${cond.type === 'time'
                  ? html`
                      ${renderTextField('After (HH:MM)', cond.after, (v) =>
                        updateCondition(cond.id, { after: v }),
                      )}
                      ${renderTextField('Before (HH:MM)', cond.before, (v) =>
                        updateCondition(cond.id, { before: v }),
                      )}
                    `
                  : nothing}
                ${cond.type === 'template'
                  ? html`
                      <div class="mc-field">
                        <label class="mc-field-label">Template</label>
                        <textarea
                          .value=${cond.template || ''}
                          @input=${(e: InputEvent) =>
                            updateCondition(cond.id, {
                              template: (e.target as HTMLTextAreaElement).value,
                            })}
                          rows="3"
                        ></textarea>
                      </div>
                    `
                  : nothing}
                <button class="mc-btn-icon" @click=${() => removeCondition(cond.id)}>
                  &times;
                </button>
              </div>
            `,
          )}
        </div>

        <button class="mc-btn mc-btn-secondary" @click=${addCondition}>Add Condition</button>
      </div>
    `;
  }

  renderDesignTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const design = (config.design as DesignConfig) || {};

    const updateDesign = (updates: Partial<DesignConfig>) => {
      onChange({
        ...config,
        design: { ...design, ...updates },
      });
    };

    return html`
      <div class="mc-tab-content">
        <div class="mc-section">
          <div class="mc-section-header">Typography</div>
          ${renderTextField('Font Size', design.font_size, (v) => updateDesign({ font_size: v }))}
          ${renderSelectField(
            'Font Weight',
            design.font_weight,
            [
              { label: 'Normal', value: 'normal' },
              { label: 'Bold', value: 'bold' },
              { label: 'Light', value: '300' },
              { label: 'Medium', value: '500' },
              { label: 'Semibold', value: '600' },
            ],
            (v) => updateDesign({ font_weight: v }),
          )}
          ${renderSelectField(
            'Text Align',
            design.text_align,
            [
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
            ],
            (v) => updateDesign({ text_align: v as DesignConfig['text_align'] }),
          )}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Colors</div>
          ${renderTextField('Color', design.color, (v) => updateDesign({ color: v }))}
          ${renderTextField('Background', design.background, (v) =>
            updateDesign({ background: v }),
          )}
          ${renderTextField('Opacity', design.opacity, (v) => updateDesign({ opacity: v }))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Spacing</div>
          ${renderTextField('Padding', design.padding, (v) => updateDesign({ padding: v }))}
          ${renderTextField('Margin', design.margin, (v) => updateDesign({ margin: v }))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Borders</div>
          ${renderTextField('Border', design.border, (v) => updateDesign({ border: v }))}
          ${renderTextField('Border Radius', design.border_radius, (v) =>
            updateDesign({ border_radius: v }),
          )}
          ${renderTextField('Box Shadow', design.box_shadow, (v) =>
            updateDesign({ box_shadow: v }),
          )}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Size</div>
          ${renderTextField('Width', design.width, (v) => updateDesign({ width: v }))}
          ${renderTextField('Height', design.height, (v) => updateDesign({ height: v }))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Custom CSS</div>
          <div class="mc-field">
            <label class="mc-field-label">CSS</label>
            <textarea
              .value=${design.css || ''}
              @input=${(e: InputEvent) =>
                updateDesign({ css: (e.target as HTMLTextAreaElement).value })}
              rows="4"
              placeholder="color: red; font-size: 20px;"
            ></textarea>
          </div>
        </div>
      </div>
    `;
  }

  private _renderActionConfig(
    action: ActionConfig | undefined,
    onChange: (action: ActionConfig) => void,
  ): TemplateResult {
    const currentAction = action || { action: 'none' as ActionType };

    return html`
      <div class="mc-action-config">
        ${renderSelectField(
          'Action',
          currentAction.action,
          [
            { label: 'None', value: 'none' },
            { label: 'More Info', value: 'more-info' },
            { label: 'Toggle', value: 'toggle' },
            { label: 'Navigate', value: 'navigate' },
            { label: 'URL', value: 'url' },
            { label: 'Perform Action', value: 'perform-action' },
            { label: 'Assist', value: 'assist' },
          ],
          (v) => onChange({ ...currentAction, action: v as ActionType }),
        )}
        ${currentAction.action === 'navigate'
          ? renderTextField('Navigation Path', currentAction.navigation_path, (v) =>
              onChange({ ...currentAction, navigation_path: v }),
            )
          : nothing}
        ${currentAction.action === 'url'
          ? renderTextField('URL', currentAction.url_path, (v) =>
              onChange({ ...currentAction, url_path: v }),
            )
          : nothing}
        ${currentAction.action === 'perform-action'
          ? html`
              ${renderTextField('Service', currentAction.service, (v) =>
                onChange({ ...currentAction, service: v }),
              )}
            `
          : nothing}
      </div>
    `;
  }
}
