import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DesignConfig, ConditionalDesign, DisplayCondition, HomeAssistant } from '../../types';
import { CSS_SECTORS, CssSector, CssPropertyDef } from '../../utils/css-properties';
import { designPanelStyles } from '../../css/css';
import { SyncService } from '../../services/sync-service';
import { generateId } from '../../utils/id-generator';

import './color-picker';
import './unit-field';
import './box-field';
import './media-picker';
import './font-picker';
import './sync-indicator';
import './condition-row';

@customElement('mc-design-panel')
export class DesignPanel extends LitElement {
  static styles = [designPanelStyles];

  @property({ attribute: false }) design: DesignConfig = {};
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) onChange!: (updates: Record<string, unknown>) => void;
  @property({ type: Boolean }) hasTemplate = false;
  @property({ attribute: false }) notSynced: string[] = [];
  @property({ type: String }) moduleEntity = '';

  @state() private _openSectors = new Set<string>();
  @state() private _searchQuery = '';
  @state() private _activeView: 'default' | string = 'default';

  private _getActiveRule(): ConditionalDesign | undefined {
    if (this._activeView === 'default') return undefined;
    return this.design.conditional?.find((r) => r.id === this._activeView);
  }

  private _getActiveDesign(): Record<string, unknown> {
    const rule = this._getActiveRule();
    if (rule) return rule.design as Record<string, unknown>;
    return this.design as Record<string, unknown>;
  }

  private _getValue(key: string): string {
    return (this._getActiveDesign()[key] as string) || '';
  }

  private _handlePropertyChange(key: string, value: string): void {
    const rule = this._getActiveRule();
    if (rule) {
      const updatedDesign = { ...rule.design, [key]: value || undefined };
      this._updateRule(rule.id, { design: updatedDesign });
      return;
    }

    const updates: Record<string, unknown> = { [key]: value || undefined };

    // If this card is linked to a template, mark this property as not_synced
    if (this.hasTemplate) {
      updates._markNotSynced = key;
    }

    this.onChange(updates);
  }

  private _handleSyncToggle(propertyName: string, currentlySynced: boolean): void {
    if (currentlySynced) {
      // Mark as not synced (propertyName is already the key like "background_color")
      this.onChange({ _markNotSynced: propertyName });
    } else {
      // Re-sync this property
      this.onChange({ _markSynced: propertyName });
    }
  }

  private _toggleSector(id: string): void {
    const next = new Set(this._openSectors);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this._openSectors = next;
  }

  private _countSetProperties(sector: CssSector): number {
    const rec = this._getActiveDesign();
    return sector.properties.filter((p) => {
      const v = rec[p.key];
      return v !== undefined && v !== '';
    }).length;
  }

  private _filterProperties(properties: CssPropertyDef[]): CssPropertyDef[] {
    if (!this._searchQuery) return properties;
    const q = this._searchQuery.toLowerCase();
    return properties.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.cssProperty.toLowerCase().includes(q) ||
        p.key.toLowerCase().includes(q),
    );
  }

  // ── Conditional rule management ──

  private _addRule(): void {
    const rules = [...(this.design.conditional || [])];
    const newRule: ConditionalDesign = {
      id: generateId('rule'),
      name: 'New Rule',
      conditions: [],
      mode: 'every',
      design: {},
    };
    rules.push(newRule);
    this.onChange({ conditional: rules });
    this._activeView = newRule.id;
  }

  private _removeRule(id: string): void {
    const rules = (this.design.conditional || []).filter((r) => r.id !== id);
    this.onChange({ conditional: rules.length ? rules : undefined });
    this._activeView = 'default';
  }

  private _updateRule(id: string, updates: Partial<ConditionalDesign>): void {
    const rules = (this.design.conditional || []).map((r) =>
      r.id === id ? { ...r, ...updates } : r,
    );
    this.onChange({ conditional: rules });
  }

  private _updateRuleName(id: string, name: string): void {
    this._updateRule(id, { name });
  }

  private _updateRuleMode(id: string, mode: 'every' | 'any'): void {
    this._updateRule(id, { mode });
  }

  private _updateRuleConditions(id: string, conditions: DisplayCondition[]): void {
    this._updateRule(id, { conditions });
  }

  private _addConditionToRule(rule: ConditionalDesign): void {
    const conditions = [
      ...rule.conditions,
      { id: generateId('cond'), type: 'state' as const },
    ];
    this._updateRuleConditions(rule.id, conditions);
  }

  private _updateCondition(rule: ConditionalDesign, condId: string, updates: Partial<DisplayCondition>): void {
    const conditions = rule.conditions.map((c) =>
      c.id === condId ? { ...c, ...updates } : c,
    );
    this._updateRuleConditions(rule.id, conditions);
  }

  private _removeCondition(rule: ConditionalDesign, condId: string): void {
    const conditions = rule.conditions.filter((c) => c.id !== condId);
    this._updateRuleConditions(rule.id, conditions);
  }

  // ── Render methods ──

  private _renderField(
    label: string,
    control: TemplateResult,
    syncIndicator: TemplateResult | typeof nothing = nothing,
  ): TemplateResult {
    return html`
      <div class="mc-field">
        <label class="mc-field-label">${label} ${syncIndicator}</label>
        ${control}
      </div>
    `;
  }

  private _renderProperty(p: CssPropertyDef): TemplateResult {
    const value = this._getValue(p.key);
    const isRuleView = this._activeView !== 'default';
    const propertyPath = `design.${p.key}`; // Design properties are prefixed with "design."
    const isSynced = this.hasTemplate && !this.notSynced.includes(propertyPath);

    const syncIndicator = this.hasTemplate && !isRuleView
      ? html`
          <mc-sync-indicator
            .synced=${isSynced}
            .hasTemplate=${this.hasTemplate}
            @sync-toggle=${() => this._handleSyncToggle(p.key, isSynced)}
          ></mc-sync-indicator>
        `
      : nothing;

    switch (p.type) {
      case 'box':
        if (isRuleView) {
          // In rule view, box fields work on the rule's design
          const rule = this._getActiveRule()!;
          const ruleDesign = rule.design as Record<string, unknown>;
          return this._renderField(
            p.label,
            html`
              <mc-box-field
                .design=${ruleDesign}
                .onChange=${(updates: Record<string, unknown>) => {
                  const updatedDesign = { ...rule.design, ...updates };
                  this._updateRule(rule.id, { design: updatedDesign });
                }}
                .baseName=${p.key as 'padding' | 'margin' | 'border_radius'}
              ></mc-box-field>
            `,
          );
        }
        return this._renderField(
          p.label,
          html`
            <mc-box-field
              .design=${this.design}
              .onChange=${this.onChange}
              .baseName=${p.key as 'padding' | 'margin' | 'border_radius'}
            ></mc-box-field>
          `,
          syncIndicator,
        );

      case 'unit':
        return this._renderField(
          p.label,
          html`
            <mc-unit-field
              .value=${value}
              @value-changed=${(e: CustomEvent) => this._handlePropertyChange(p.key, e.detail.value)}
            ></mc-unit-field>
          `,
          syncIndicator,
        );

      case 'color':
        return this._renderField(
          p.label,
          html`
            <mc-color-picker
              .value=${value}
              .label=${p.label}
              @value-changed=${(e: CustomEvent) => this._handlePropertyChange(p.key, e.detail.value)}
            ></mc-color-picker>
          `,
          syncIndicator,
        );

      case 'image':
        return this._renderField(
          p.label,
          html`
            <mc-media-picker
              .hass=${this.hass}
              .value=${value}
              .mediaType=${'image'}
              @value-changed=${(e: CustomEvent) => this._handlePropertyChange(p.key, e.detail.value)}
            ></mc-media-picker>
          `,
          syncIndicator,
        );

      case 'font':
        return this._renderField(
          p.label,
          html`
            <mc-font-picker
              .hass=${this.hass}
              .value=${value}
              @value-changed=${(e: CustomEvent) => this._handlePropertyChange(p.key, e.detail.value)}
            ></mc-font-picker>
          `,
          syncIndicator,
        );

      case 'select':
        return this._renderField(
          p.label,
          html`
            <select
              @change=${(e: Event) => this._handlePropertyChange(p.key, (e.target as HTMLSelectElement).value)}
            >
              <option value="" ?selected=${!value}></option>
              ${(p.options || []).map(
                (opt) =>
                  html`<option value=${opt.value} ?selected=${value === opt.value}>${opt.label}</option>`,
              )}
            </select>
          `,
          syncIndicator,
        );

      case 'number':
        return this._renderField(
          p.label,
          html`
            <input
              type="number"
              .value=${value}
              @input=${(e: InputEvent) => this._handlePropertyChange(p.key, (e.target as HTMLInputElement).value)}
            />
          `,
          syncIndicator,
        );

      case 'text':
      default:
        return this._renderField(
          p.label,
          html`
            <input
              type="text"
              .value=${value}
              @input=${(e: InputEvent) => this._handlePropertyChange(p.key, (e.target as HTMLInputElement).value)}
            />
          `,
          syncIndicator,
        );
    }
  }

  private _renderSector(sector: CssSector): TemplateResult | typeof nothing {
    const filtered = this._filterProperties(sector.properties);
    if (filtered.length === 0) return nothing;

    const isOpen = this._openSectors.has(sector.id);
    const count = this._countSetProperties(sector);

    return html`
      <div class="mc-design-sector ${isOpen ? 'open' : ''}">
        <button
          class="mc-design-sector-header"
          @click=${() => this._toggleSector(sector.id)}
        >
          <ha-icon icon=${sector.icon}></ha-icon>
          <span class="sector-name">${sector.name}</span>
          ${count > 0 ? html`<span class="mc-design-sector-badge">${count}</span>` : nothing}
          <ha-icon class="mc-design-sector-chevron" icon="mdi:chevron-down"></ha-icon>
        </button>
        <div class="mc-design-sector-body">
          <div class="mc-design-sector-content">
            ${filtered.map((p) => this._renderProperty(p))}
          </div>
        </div>
      </div>
    `;
  }

  private _renderViewTabs(): TemplateResult {
    const rules = this.design.conditional || [];

    return html`
      <div class="mc-design-views">
        <button
          class="mc-design-view-tab ${this._activeView === 'default' ? 'active' : ''}"
          @click=${() => { this._activeView = 'default'; }}
        >
          Default
        </button>
        ${rules.map(
          (rule) => html`
            <button
              class="mc-design-view-tab ${this._activeView === rule.id ? 'active' : ''}"
              @click=${() => { this._activeView = rule.id; }}
            >
              ${rule.name || 'Rule'}
              <span
                class="tab-remove"
                @click=${(e: Event) => {
                  e.stopPropagation();
                  this._removeRule(rule.id);
                }}
              >&times;</span>
            </button>
          `,
        )}
        <button class="mc-design-add-rule-btn" @click=${() => this._addRule()}>
          + Add Rule
        </button>
      </div>
    `;
  }

  private _renderRuleHeader(rule: ConditionalDesign): TemplateResult {
    return html`
      <div class="mc-design-rule-header">
        <div class="rule-name-row">
          <input
            type="text"
            .value=${rule.name || ''}
            placeholder="Rule name..."
            @input=${(e: InputEvent) =>
              this._updateRuleName(rule.id, (e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="rule-mode-row">
          <span>Match</span>
          <select
            @change=${(e: Event) =>
              this._updateRuleMode(rule.id, (e.target as HTMLSelectElement).value as 'every' | 'any')}
          >
            <option value="every" ?selected=${rule.mode !== 'any'}>All conditions (AND)</option>
            <option value="any" ?selected=${rule.mode === 'any'}>Any condition (OR)</option>
          </select>
        </div>
      </div>
    `;
  }

  private _renderRuleConditions(rule: ConditionalDesign): TemplateResult {
    return html`
      <div class="mc-design-rule-conditions">
        <div class="conditions-header">
          <span>Conditions</span>
          <button class="add-condition-btn" @click=${() => this._addConditionToRule(rule)}>
            + Add
          </button>
        </div>
        ${rule.conditions.map(
          (cond) => html`
            <mc-condition-row
              .condition=${cond}
              .hass=${this.hass}
              .moduleEntity=${this.moduleEntity}
              .onChange=${(updates: Partial<DisplayCondition>) =>
                this._updateCondition(rule, cond.id, updates)}
              .onRemove=${() => this._removeCondition(rule, cond.id)}
            ></mc-condition-row>
          `,
        )}
      </div>
    `;
  }

  private _handleCustomCssChange(value: string): void {
    const rule = this._getActiveRule();
    if (rule) {
      const updatedDesign = { ...rule.design, css: value || undefined };
      this._updateRule(rule.id, { design: updatedDesign });
      return;
    }
    this.onChange({ css: value || undefined });
  }

  private _getCustomCssValue(): string {
    const rule = this._getActiveRule();
    if (rule) return (rule.design.css as string) || '';
    return this.design.css || '';
  }

  protected render(): TemplateResult {
    const visibleSectors = CSS_SECTORS.filter(
      (s) => this._filterProperties(s.properties).length > 0,
    );

    const activeRule = this._getActiveRule();

    // If active view references a deleted rule, reset to default
    if (this._activeView !== 'default' && !activeRule) {
      this._activeView = 'default';
    }

    return html`
      <div class="mc-design-panel">
        ${this._renderViewTabs()}

        ${activeRule
          ? html`
              ${this._renderRuleHeader(activeRule)}
              ${this._renderRuleConditions(activeRule)}
            `
          : nothing}

        <div class="mc-design-search">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="text"
            placeholder="Search CSS properties..."
            .value=${this._searchQuery}
            @input=${(e: InputEvent) => {
              this._searchQuery = (e.target as HTMLInputElement).value;
            }}
          />
        </div>

        ${visibleSectors.length === 0
          ? html`<div class="mc-design-empty">No properties match "${this._searchQuery}"</div>`
          : visibleSectors.map((s) => this._renderSector(s))}

        <div class="mc-design-custom-css">
          <label>Custom CSS</label>
          <textarea
            .value=${this._getCustomCssValue()}
            @input=${(e: InputEvent) =>
              this._handleCustomCssChange((e.target as HTMLTextAreaElement).value)}
            rows="4"
            placeholder="color: red; font-size: 20px;"
          ></textarea>
        </div>

        ${activeRule
          ? html`
              <button
                class="mc-design-remove-rule"
                @click=${() => this._removeRule(activeRule.id)}
              >
                Remove Rule
              </button>
            `
          : nothing}
      </div>
    `;
  }
}
