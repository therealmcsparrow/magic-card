import { html, nothing, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, RowModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { renderChildModule } from '../render-module';
import { currentRenderContext } from '../../services/render-context';
import { DEFAULT_GAP, NESTED_COLUMN_GAP } from '../../utils/constants';
import { rowGridTemplate } from '../../utils/column-widths';
import { generateId } from '../../utils/id-generator';
import { lm } from '../../i18n/labels/mark';

class RowModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'row',
    name: lm('labels.row-module.row'),
    description: lm('labels.row-module.grid-row-with-columns-nestable-inside'),
    category: 'layout',
    icon: 'mdi:view-sequential-outline',
  };

  createDefault(): RowModuleConfig {
    return {
      id: generateId('row'),
      type: 'row',
      columns: [
        { id: generateId('col'), modules: [] },
        { id: generateId('col'), modules: [] },
      ],
      layout: '1-1',
      gap: '8px',
    };
  }

  /** A grid like a card row; each column renders like a card column (ctx.renderColumn). */
  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as RowModuleConfig;
    const columns = c.columns || [];
    const ctx = currentRenderContext();
    const nested = ctx?.nestedRow?.();
    const style = `grid-template-columns: ${rowGridTemplate(c)}; gap: ${c.gap || DEFAULT_GAP}${c.padding ? `; padding: ${c.padding}` : ''}`;
    return html`
      <div class="mc-module mc-nested-row" data-mc-layers=${nested?.layered ? '' : nothing} style=${style}>
        ${columns.map((col, ci) => (!col || typeof col !== 'object'
          ? nothing // a YAML entry that is not a column (null)
          : ctx?.renderColumn?.(col, ci)
            ?? html`<div class="mc-column" data-valign=${col.vertical_align || nothing} style=${`gap: ${col.gap || NESTED_COLUMN_GAP}`}>${(col.modules || []).map((child, i) => renderChildModule(child, hass, i, ci))}</div>`))}${nested?.hoisted()}
      </div>
    `;
  }
}

ModuleRegistry.register(new RowModule());
