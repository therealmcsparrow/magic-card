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
import { magicCardStyles } from '../css/css';
import { ModuleRegistry } from '../modules/module-registry';
import { CARD_TAG, EDITOR_TAG, DEFAULT_LAYOUT, DEFAULT_GAP } from '../utils/constants';
import { designToStyle, resolveConditionalDesign, layoutToGridTemplate } from '../utils/css-utils';
import { generateId } from '../utils/id-generator';
import { mergeTemplateWithOverrides } from '../services/template-merge';
import { ConfigValidator } from '../services/config-validator';
import { setLanguage } from '../localize/localize';

interface TemplateEntry {
  config: Omit<MagicCardConfig, 'type'> & { type?: string };
  description?: string;
}

type TemplateStore = Record<string, TemplateEntry>;

interface TemplateUpdatedEvent {
  data: {
    name: string;
    template: TemplateEntry;
  };
}

@customElement(CARD_TAG)
export class MagicCard extends LitElement {
  static styles = magicCardStyles;

  @property({ attribute: false })
  hass?: HomeAssistant;

  @state()
  private _config?: MagicCardConfig;

  @state()
  private _resolvedConfig?: MagicCardConfig;

  private _unsubTemplateEvents?: () => void;
  private _templateFetched = false;
  private _boundRequestUpdate = () => this.requestUpdate();
  private _holdTimers = new Map<EventTarget, number>();
  private readonly _cardInstanceId: string = generateId('cardinst');
  private _registeredTemplate?: string;
  private _pendingRegisterTimer?: number;
  private static readonly _REGISTER_DEBOUNCE_MS = 1500;

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

    const validation = ConfigValidator.validate(config);
    if (!validation.valid) {
      throw new Error(`Invalid configuration: ${validation.errors.join('; ')}`);
    }

    const prevTemplate = this._config?.template;

    this._config = {
      ...config,
      rows: config.rows || [],
    };

    if (config.template !== prevTemplate) {
      this._templateFetched = false;
      this._resolvedConfig = undefined;
    }

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

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('mc-request-update', this._boundRequestUpdate);
  }

  protected shouldUpdate(changedProperties: PropertyValues): boolean {
    if (changedProperties.has('_config') || changedProperties.has('_resolvedConfig')) {
      return true;
    }

    if (changedProperties.has('hass') && this.hass) {
      const oldHass = changedProperties.get('hass') as HomeAssistant | undefined;
      if (!oldHass) return true;

      // Sync language when it changes
      if (oldHass.language !== this.hass.language) {
        setLanguage(this.hass.language);
        return true;
      }

      // Only re-render when entities used by the card have changed
      const entities = this._getUsedEntities();
      return entities.some(
        (entityId) => oldHass.states[entityId] !== this.hass!.states[entityId],
      );
    }

    return true;
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    this._reconcileInstanceRegistration();

    if (!this.hass || !this._config?.template) return;
    if (this._templateFetched) return;

    this._templateFetched = true;
    this._fetchTemplate(this._config.template);
    this._subscribeTemplateEvents();
  }

  private _isEditorPreview(): boolean {
    return !!this.closest('hui-card-preview, hui-card-editor, hui-dialog-edit-card, hui-element-editor');
  }

  private _cancelPendingRegister(): void {
    if (this._pendingRegisterTimer !== undefined) {
      window.clearTimeout(this._pendingRegisterTimer);
      this._pendingRegisterTimer = undefined;
    }
  }

  private _reconcileInstanceRegistration(): void {
    if (!this.hass) return;

    const connectedWithTemplate = this.isConnected && !!this._config?.template;
    const desired = connectedWithTemplate && !this._isEditorPreview()
      ? this._config!.template!
      : undefined;

    // Already in sync with no pending work — nothing to do.
    if (desired === this._registeredTemplate && this._pendingRegisterTimer === undefined) {
      return;
    }

    // Any change invalidates a pending register
    this._cancelPendingRegister();

    // Unregister immediately if we had a live registration that's no longer desired
    if (this._registeredTemplate && this._registeredTemplate !== desired) {
      const previous = this._registeredTemplate;
      this._registeredTemplate = undefined;
      this.hass
        .callWS({
          type: 'magic_card_utils/unregister_card_instance',
          name: previous,
          card_id: this._cardInstanceId,
        })
        .catch(() => {
          // Backend integration may not be installed — fail silently
        });
    }

    if (!desired || this._registeredTemplate === desired) return;

    // Debounce register so editor-preview flicker doesn't churn the backend.
    this._pendingRegisterTimer = window.setTimeout(() => {
      this._pendingRegisterTimer = undefined;
      if (!this.hass) return;
      if (!this.isConnected) return;
      if (this._isEditorPreview()) return;
      const current = this._config?.template || undefined;
      if (current !== desired) return;
      if (this._registeredTemplate === desired) return;

      this._registeredTemplate = desired;
      this.hass
        .callWS({
          type: 'magic_card_utils/register_card_instance',
          name: desired,
          card_id: this._cardInstanceId,
        })
        .catch(() => {
          // Backend integration may not be installed — fail silently
        });
    }, MagicCard._REGISTER_DEBOUNCE_MS);
  }

  private _getUsedEntities(): string[] {
    const config = this._resolvedConfig ?? this._config;
    if (!config) return [];
    const entities = new Set<string>();
    this._collectEntities(config.display, entities);
    for (const rule of config.conditional_appearance || []) {
      for (const cond of rule.conditions || []) {
        if (cond.entity) entities.add(cond.entity);
      }
    }
    for (const row of config.rows || []) {
      this._collectEntities(row.display, entities);
      for (const col of row.columns || []) {
        this._collectEntities(col.display, entities);
        for (const mod of col.modules || []) {
          if (mod.entity) entities.add(mod.entity);
          this._collectEntities(mod.display, entities);
          if (mod.actions?.tap_action?.entity) entities.add(mod.actions.tap_action.entity);
          if (mod.actions?.hold_action?.entity) entities.add(mod.actions.hold_action.entity);
          if (mod.actions?.double_tap_action?.entity) entities.add(mod.actions.double_tap_action.entity);
        }
      }
    }
    return Array.from(entities);
  }

  private _collectEntities(display: import('../types').DisplayConfig | undefined, set: Set<string>): void {
    if (!display?.conditions) return;
    for (const cond of display.conditions) {
      if (cond.entity) set.add(cond.entity);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('mc-request-update', this._boundRequestUpdate);
    this._unsubTemplateEvents?.();
    this._unsubTemplateEvents = undefined;
    this._cancelPendingRegister();
    this._reconcileInstanceRegistration();
  }

  private async _fetchTemplate(name: string): Promise<void> {
    if (!this.hass || !this._config) return;
    try {
      const result = await this.hass.callWS<{ templates: TemplateStore }>({
        type: 'magic_card_utils/get_templates',
      });
      const entry = result.templates?.[name];
      if (entry) {
        // Merge template with local overrides
        this._resolvedConfig = mergeTemplateWithOverrides(
          entry.config as MagicCardConfig,
          this._config,
        );
      }
    } catch (err) {
      console.warn('Magic Card: Failed to fetch template', name, err);
    }
  }


  private _subscribeTemplateEvents(): void {
    if (this._unsubTemplateEvents || !this.hass) return;

    this.hass.connection
      .subscribeEvents<TemplateUpdatedEvent>(
        (event) => {
          if (
            this._config?.template &&
            event.data.name === this._config.template
          ) {
            this._fetchTemplate(this._config.template);
          }
        },
        'magic_card_utils_template_updated',
      )
      .then((unsub) => {
        this._unsubTemplateEvents = unsub;
      });
  }

  protected render(): TemplateResult {
    const config = this._resolvedConfig ?? this._config;
    if (!config) {
      return html`<ha-card><div class="mc-error">No configuration</div></ha-card>`;
    }

    if (config.display?.conditions?.length && !this._evaluateDisplay(config.display)) {
      return html``;
    }

    const resolved = this._resolveCardAppearance(config);
    const cardStyle = this._buildCardStyle(resolved);
    const cardThemeStyle = this._buildThemeStyle(resolved);

    return html`
      <ha-card style=${cardThemeStyle || nothing}>
        <div class="mc-card-content" style=${cardStyle}>
          ${config.rows.map((row) => this._renderRow(row))}
        </div>
      </ha-card>
    `;
  }

  private _resolveCardAppearance(c: MagicCardConfig): MagicCardConfig {
    const rules = c.conditional_appearance;
    if (!rules?.length) return c;

    let merged: MagicCardConfig = c;
    for (const rule of rules) {
      const evalDisplay = { conditions: rule.conditions, mode: rule.mode };
      if (!this._evaluateDisplay(evalDisplay)) continue;

      const overrides = rule.overrides || {};
      const patch: Partial<MagicCardConfig> = {};
      for (const [key, value] of Object.entries(overrides)) {
        if (value === undefined || value === '' || value === null) continue;
        (patch as Record<string, unknown>)[key] = value;
      }
      merged = { ...merged, ...patch };
    }
    return merged;
  }

  private _buildThemeStyle(c: MagicCardConfig): string {
    if (!this.hass) return '';
    if (c.use_page_theme !== false) return '';

    const selectedTheme = c.theme || this.hass.themes?.default_theme;
    if (!selectedTheme) return '';

    const vars = this.hass.themes?.themes?.[selectedTheme];
    if (!vars) return '';

    return Object.entries(vars)
      .map(([key, value]) => `${key.startsWith('--') ? key : `--${key}`}: ${String(value)}`)
      .join('; ');
  }

  private _buildCardStyle(c: MagicCardConfig): string {
    const parts: string[] = [];
    if (c.padding) parts.push(`padding: ${c.padding}`);

    const backgroundParts = [];
    if (c.background_image) backgroundParts.push(c.background_image);
    if (c.background) backgroundParts.push(c.background);

    if (backgroundParts.length > 0) {
      parts.push(`background: ${backgroundParts.join(' ')}`);
    }

    if (c.background_image) {
      parts.push(`background-size: cover`);
      parts.push(`background-position: center`);
      parts.push(`background-repeat: no-repeat`);
    }

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

    const gridTemplate = layoutToGridTemplate(row.layout || DEFAULT_LAYOUT, row.columns?.length || 1);
    const gap = row.gap || DEFAULT_GAP;
    const rowStyle = `grid-template-columns: ${gridTemplate}; gap: ${gap}${row.padding ? `; padding: ${row.padding}` : ''}`;
    const designStyle = designToStyle(resolveConditionalDesign(row.design, this.hass));

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
    const designStyle = designToStyle(resolveConditionalDesign(col.design, this.hass));

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

    const designStyle = designToStyle(resolveConditionalDesign(mod.design as DesignConfig, this.hass, mod.entity));
    const hasActions = mod.actions?.tap_action || mod.actions?.hold_action || mod.actions?.double_tap_action;

    return html`
      <div
        class="mc-module-wrapper ${hasActions ? 'mc-hoverable' : ''}"
        role=${hasActions ? 'button' : nothing}
        tabindex=${hasActions ? 0 : nothing}
        aria-label=${hasActions ? this._getActionLabel(mod) : nothing}
        style=${designStyle}
        @pointerdown=${hasActions ? (e: PointerEvent) => this._onPointerDown(e, mod) : nothing}
        @pointerup=${hasActions ? (e: PointerEvent) => this._onPointerUp(e, mod) : nothing}
        @pointercancel=${hasActions ? (e: PointerEvent) => this._onPointerCancel(e) : nothing}
        @contextmenu=${hasActions ? (e: Event) => e.preventDefault() : nothing}
        @dblclick=${hasActions ? (e: Event) => this._handleAction(e, mod, 'double_tap') : nothing}
        @keydown=${hasActions ? (e: KeyboardEvent) => this._onKeyDown(e, mod) : nothing}
      >
        ${module.renderPreview(mod, this.hass)}
      </div>
    `;
  }

  private _getActionLabel(mod: CardModule): string {
    const customLabel = (mod.label as string | undefined) || (mod.name as string | undefined);
    return customLabel ? `Activate ${customLabel}` : `Activate ${mod.type} module`;
  }

  private _onPointerDown(e: PointerEvent, mod: CardModule): void {
    const target = e.currentTarget as EventTarget;
    const timer = window.setTimeout(() => {
      this._holdTimers.delete(target);
      this._handleAction(e, mod, 'hold');
    }, 500);
    this._holdTimers.set(target, timer);
  }

  private _onPointerUp(e: PointerEvent, mod: CardModule): void {
    const target = e.currentTarget as EventTarget;
    const timer = this._holdTimers.get(target);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      this._holdTimers.delete(target);
      this._handleAction(e, mod, 'tap');
    }
  }

  private _onPointerCancel(e: PointerEvent): void {
    const target = e.currentTarget as EventTarget;
    const timer = this._holdTimers.get(target);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      this._holdTimers.delete(target);
    }
  }

  private _onKeyDown(e: KeyboardEvent, mod: CardModule): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        this._handleAction(e, mod, 'double_tap');
        return;
      }
      if (e.shiftKey) {
        this._handleAction(e, mod, 'hold');
        return;
      }
      this._handleAction(e, mod, 'tap');
    }
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
    const actionKey = `${actionType}_action` as const;
    const action = mod.actions?.[actionKey];
    if (!action || action.action === 'none') return;

    // Haptic feedback
    if (action.haptic) {
      this.dispatchEvent(
        new CustomEvent('haptic', {
          bubbles: true,
          composed: true,
          detail: action.haptic,
        }),
      );
    }

    const entity = action.use_module_entity !== false ? (action.entity || mod.entity) : action.entity;

    switch (action.action) {
      case 'more-info':
        if (entity) {
          this.dispatchEvent(
            new CustomEvent('hass-more-info', {
              bubbles: true,
              composed: true,
              detail: { entityId: entity },
            }),
          );
        }
        break;

      case 'toggle':
        if (entity) {
          const domain = entity.split('.')[0];
          this.hass?.callService(domain, 'toggle', {
            entity_id: entity,
          });
        }
        break;

      case 'navigate':
        if (action.navigation_path) {
          history.pushState(null, '', action.navigation_path);
          window.dispatchEvent(
            new Event('location-changed', { bubbles: true, composed: true }),
          );
        }
        break;

      case 'url':
        if (action.url_path) {
          try {
            const url = new URL(action.url_path, window.location.href);
            if (url.protocol === 'http:' || url.protocol === 'https:') {
              window.open(url.href, '_blank', 'noopener,noreferrer');
            } else {
              console.warn('Magic Card: Blocked unsafe URL protocol:', url.protocol);
            }
          } catch {
            console.warn('Magic Card: Invalid URL:', action.url_path);
          }
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

      case 'fire-dom-event':
        this.dispatchEvent(
          new CustomEvent('ll-custom', {
            bubbles: true,
            composed: true,
            detail: action.data || {},
          }),
        );
        break;
    }
  }
}
