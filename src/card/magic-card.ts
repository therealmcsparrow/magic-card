import { LitElement, html, TemplateResult, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  MagicCardConfig,
  HomeAssistant,
  RowConfig,
  ColumnConfig,
  CardModule,
  DesignConfig,
} from '../types';
import { magicCardStyles } from './magic-card.styles';
import { ModuleRegistry } from '../modules/module-registry';
import { CARD_TAG, EDITOR_TAG, DEFAULT_LAYOUT, DEFAULT_GAP, DEFAULT_PADDING } from '../utils/constants';
import { designToStyle, layoutToGridTemplate } from '../utils/css-utils';
import { generateId } from '../utils/id-generator';

@customElement(CARD_TAG)
export class MagicCard extends LitElement {
  static styles = magicCardStyles;

  @property({ attribute: false })
  hass?: HomeAssistant;

  @state()
  private _config?: MagicCardConfig;

  static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_TAG);
  }

  static getStubConfig(): MagicCardConfig {
    return {
      type: `custom:${CARD_TAG}`,
      rows: [
        {
          id: generateId('row'),
          layout: '1',
          columns: [
            {
              id: generateId('col'),
              modules: [
                {
                  id: generateId('text'),
                  type: 'text',
                  text: 'Welcome to Magic Card',
                },
              ],
            },
          ],
        },
      ],
    };
  }

  setConfig(config: MagicCardConfig): void {
    if (!config) {
      throw new Error('No configuration provided');
    }

    this._config = {
      ...config,
      rows: config.rows || [],
    };

    // Ensure all rows/columns/modules have IDs
    this._config.rows = this._config.rows.map((row) => ({
      ...row,
      id: row.id || generateId('row'),
      columns: (row.columns || []).map((col) => ({
        ...col,
        id: col.id || generateId('col'),
        modules: (col.modules || []).map((mod) => ({
          ...mod,
          id: mod.id || generateId(mod.type),
        })),
      })),
    }));
  }

  getCardSize(): number {
    if (!this._config?.rows) return 1;
    return Math.max(this._config.rows.length, 1);
  }

  protected render(): TemplateResult {
    if (!this._config) {
      return html`<ha-card><div class="mc-error">No configuration</div></ha-card>`;
    }

    const cardStyle = this._buildCardStyle();

    return html`
      <ha-card>
        <div class="mc-card-content" style=${cardStyle}>
          ${this._config.rows.map((row) => this._renderRow(row))}
        </div>
      </ha-card>
    `;
  }

  private _buildCardStyle(): string {
    const parts: string[] = [];
    const c = this._config!;
    if (c.padding) parts.push(`padding: ${c.padding}`);
    if (c.background) parts.push(`background: ${c.background}`);
    if (c.border_radius) parts.push(`border-radius: ${c.border_radius}`);
    if (c.box_shadow) parts.push(`box-shadow: ${c.box_shadow}`);
    if (c.card_height) parts.push(`min-height: ${c.card_height}`);
    if (c.overflow) parts.push(`overflow: ${c.overflow}`);
    return parts.join('; ');
  }

  private _renderRow(row: RowConfig): TemplateResult {
    if (row.display?.conditions?.length && !this._evaluateDisplay(row.display)) {
      return html``;
    }

    const gridTemplate = layoutToGridTemplate(row.layout || DEFAULT_LAYOUT);
    const gap = row.gap || DEFAULT_GAP;
    const rowStyle = `grid-template-columns: ${gridTemplate}; gap: ${gap}${row.padding ? `; padding: ${row.padding}` : ''}`;
    const designStyle = designToStyle(row.design);

    return html`
      <div class="mc-row" style="${rowStyle}; ${designStyle}">
        ${row.columns.map((col) => this._renderColumn(col))}
      </div>
    `;
  }

  private _renderColumn(col: ColumnConfig): TemplateResult {
    if (col.display?.conditions?.length && !this._evaluateDisplay(col.display)) {
      return html``;
    }

    const gap = col.gap || DEFAULT_GAP;
    const colStyle = `gap: ${gap}${col.padding ? `; padding: ${col.padding}` : ''}`;
    const designStyle = designToStyle(col.design);

    return html`
      <div
        class="mc-column"
        data-valign=${col.vertical_align || nothing}
        style="${colStyle}; ${designStyle}"
      >
        ${col.modules.map((mod) => this._renderModule(mod))}
      </div>
    `;
  }

  private _renderModule(mod: CardModule): TemplateResult {
    if (mod.display?.conditions?.length && !this._evaluateDisplay(mod.display)) {
      return html``;
    }

    const module = ModuleRegistry.get(mod.type);
    if (!module) {
      return html`<div class="mc-error">Unknown module: ${mod.type}</div>`;
    }

    const designStyle = designToStyle(mod.design as DesignConfig);
    const hasActions = mod.actions?.tap_action || mod.actions?.hold_action || mod.actions?.double_tap_action;

    return html`
      <div
        class="mc-module-wrapper ${hasActions ? 'mc-hoverable' : ''}"
        style=${designStyle}
        @click=${hasActions ? (e: Event) => this._handleAction(e, mod, 'tap') : nothing}
        @contextmenu=${hasActions ? (e: Event) => this._handleAction(e, mod, 'hold') : nothing}
        @dblclick=${hasActions ? (e: Event) => this._handleAction(e, mod, 'double_tap') : nothing}
      >
        ${module.renderPreview(mod, this.hass)}
      </div>
    `;
  }

  private _evaluateDisplay(display: import('../types').DisplayConfig): boolean {
    if (!display.conditions?.length) return true;
    if (!this.hass) return true;

    const results = display.conditions.map((cond) => {
      switch (cond.type) {
        case 'state': {
          if (!cond.entity) return true;
          const entity = this.hass!.states[cond.entity];
          if (!entity) return false;
          if (cond.state !== undefined && cond.state !== '') return entity.state === cond.state;
          if (cond.state_not !== undefined && cond.state_not !== '') return entity.state !== cond.state_not;
          if (cond.above !== undefined && Number(entity.state) <= cond.above) return false;
          if (cond.below !== undefined && Number(entity.state) >= cond.below) return false;
          return true;
        }
        case 'attribute': {
          if (!cond.entity || !cond.attribute) return true;
          const entity = this.hass!.states[cond.entity];
          if (!entity) return false;
          const val = String(entity.attributes[cond.attribute] ?? '');
          if (cond.state !== undefined && cond.state !== '') return val === cond.state;
          if (cond.state_not !== undefined && cond.state_not !== '') return val !== cond.state_not;
          return true;
        }
        case 'time': {
          const now = new Date();
          const currentMinutes = now.getHours() * 60 + now.getMinutes();
          if (cond.after) {
            const [h, m] = cond.after.split(':').map(Number);
            if (currentMinutes < h * 60 + m) return false;
          }
          if (cond.before) {
            const [h, m] = cond.before.split(':').map(Number);
            if (currentMinutes >= h * 60 + m) return false;
          }
          return true;
        }
        default:
          return true;
      }
    });

    return display.mode === 'any' ? results.some(Boolean) : results.every(Boolean);
  }

  private _handleAction(e: Event, mod: CardModule, actionType: 'tap' | 'hold' | 'double_tap'): void {
    if (actionType === 'hold') e.preventDefault();

    const actionKey = `${actionType}_action` as const;
    const action = mod.actions?.[actionKey];
    if (!action || action.action === 'none') return;

    const entity = mod.entity;

    switch (action.action) {
      case 'more-info':
        if (entity || action.entity) {
          const event = new CustomEvent('hass-more-info', {
            bubbles: true,
            composed: true,
            detail: { entityId: action.entity || entity },
          });
          this.dispatchEvent(event);
        }
        break;

      case 'toggle':
        if (entity || action.entity) {
          const targetEntity = action.entity || entity!;
          const domain = targetEntity.split('.')[0];
          this.hass?.callService(domain, 'toggle', {
            entity_id: targetEntity,
          });
        }
        break;

      case 'navigate':
        if (action.navigation_path) {
          history.pushState(null, '', action.navigation_path);
          const navEvent = new Event('location-changed', {
            bubbles: true,
            composed: true,
          });
          window.dispatchEvent(navEvent);
        }
        break;

      case 'url':
        if (action.url_path) {
          window.open(action.url_path, '_blank');
        }
        break;

      case 'perform-action':
        if (action.service) {
          const [domain, service] = action.service.split('.');
          this.hass?.callService(domain, service, {
            ...action.data,
            ...action.service_data,
          });
        }
        break;

      case 'assist':
        this.dispatchEvent(
          new CustomEvent('show-dialog', {
            bubbles: true,
            composed: true,
            detail: {
              dialogTag: 'ha-voice-command-dialog',
              dialogImport: () => undefined,
              dialogParams: {},
            },
          }),
        );
        break;
    }
  }
}
