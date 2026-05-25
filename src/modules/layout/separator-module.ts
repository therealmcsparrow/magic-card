import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, SeparatorModuleConfig, EditorTab } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField, renderSelectField, renderColorField } from '../../utils/form-utils';
import { SyncContext } from '../../utils/sync-path';

class SeparatorModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'separator',
    name: 'Separator',
    description: 'Visual divider between modules',
    category: 'layout',
    icon: 'mdi:minus',
  };

  getAvailableTabs(): EditorTab[] {
    return ['general', 'conditions', 'design'];
  }

  createDefault(): SeparatorModuleConfig {
    return {
      id: generateId('separator'),
      type: 'separator',
      separator_style: 'solid',
      separator_color: 'var(--divider-color, #e5e7eb)',
      separator_width: '1px',
      direction: 'horizontal',
    };
  }

  renderPreview(config: CardModule, _hass?: HomeAssistant): TemplateResult {
    const c = config as SeparatorModuleConfig;
    const isVertical = c.direction === 'vertical';

    if (isVertical) {
      return html`
        <div class="mc-module mc-separator-vertical"
          style="border-left-style:${c.separator_style || 'solid'}; border-left-color:${c.separator_color || 'var(--divider-color)'}; border-left-width:${c.separator_width || '1px'}">
        </div>
      `;
    }

    return html`
      <hr class="mc-module mc-separator"
        style="border-top-style:${c.separator_style || 'solid'}; border-top-color:${c.separator_color || 'var(--divider-color)'}; border-top-width:${c.separator_width || '1px'}" />
    `;
  }

  renderGeneralTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const syncCtx = this._buildSyncContext(config, template);
    const c = config as SeparatorModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderSelectField('Direction', c.direction, [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
        ], (v) => onChange({ ...c, direction: v as 'horizontal' | 'vertical' }), 'direction', syncCtx)}
        ${renderSelectField('Style', c.separator_style, [
          { label: 'Solid', value: 'solid' },
          { label: 'Dashed', value: 'dashed' },
          { label: 'Dotted', value: 'dotted' },
          { label: 'None', value: 'none' },
        ], (v) => onChange({ ...c, separator_style: v as SeparatorModuleConfig['separator_style'] }), 'separator_style', syncCtx)}
        ${renderColorField('Color', c.separator_color, (v) => onChange({ ...c, separator_color: v }), 'separator_color', syncCtx)}
        ${renderTextField('Width', c.separator_width, (v) => onChange({ ...c, separator_width: v }), 'separator_width', syncCtx)}
      </div>
    `;
  }
}

ModuleRegistry.register(new SeparatorModule());
