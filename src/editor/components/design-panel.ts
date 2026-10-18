import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AnimationConfig, DesignConfig, ConditionalDesign, DisplayCondition, HomeAssistant, RingConfig, ShapeOptions, ValueBackgroundConfig } from '../../types';
import type { ShapePatch } from './shape-editor';
import {
  BOX_LONGHANDS,
  DEPENDENT_OPTIONS,
  CSS_SECTORS,
  CUSTOM_CSS_ENTRY,
  CssSector,
  DESIGN_GROUPS,
  DesignGroup,
  CssPropertyDef,
  CssPropertyOption,
  displayProperties,
  propertyKeys,
} from '../../utils/css-properties';
import { t } from '../../i18n/labels';
import type { MessageId } from '../../contracts/i18n';
import { editorSystem } from '../../css/editor-system';
import { DEFAULT_BORDER_LENGTH_WIDTH } from '../../utils/css-utils';
import { generateId } from '../../utils/id-generator';
import { ANIMATION_ICON_MODULES, animationsUpdate, readAnimations } from '../../utils/animation';
import { fieldReset } from './field-reset';
import { MenuPopover } from '../../ui-kit/controllers/menu-popover';
import { entityStateColor } from '../../utils/entity-color';
import { PasteMode, copyDesign, designUpdates, pastedDesign, readDesignClipboard } from '../../utils/design-clipboard';

import './color-picker';
import './unit-field';
import './box-field';
import './media-picker';
import './font-picker';
import './sync-indicator';
import './condition-row';
import './animation-list';
import './ring-editor';
import './shape-editor';
import './value-bg-editor';
import { parseGradient } from '../../utils/gradient';

/** Mockup placeholders: sizes read "auto", font size "inherit", everything else "0". */
function unitPlaceholder(key: string, design: Record<string, unknown>): string {
  if (/^(min_|max_)?(width|height)$/.test(key) || key === 'flex_basis') return 'auto';
  if (key === 'font_size') return 'inherit';
  if (key === 'border_length') return '100';
  // a border length line without a width is drawn at 2px (resolveBorderLength)
  if (key === 'border_width' && design.border_length) return DEFAULT_BORDER_LENGTH_WIDTH.replace('px', '');
  return '0';
}

/** The "Editing design for" value of the hover design (`design.hover`). */
/** Module types whose text is painted straight on the module, so a gradient text fill stays legible. */
export const TEXT_GRADIENT_MODULES = ['text', 'info', 'markdown'];

const HOVER_VIEW = '__hover__';

/** Label text of an optional message (labels namespace). */
const lbl = (id: MessageId | undefined): string | undefined => (id === undefined ? undefined : t(id));

/** Field types a hover rule cannot apply (the card draws them itself, not through CSS). */
const NO_HOVER_TYPES = new Set(['animations', 'ring', 'shape', 'value_bg']);

/** The edited part of the design besides Default: a conditional rule's design or the hover design. */
interface SubDesign {
  design: Record<string, unknown>;
  write: (design: Record<string, unknown>) => void;
}

const TEXT_PLACEHOLDERS: Record<string, string> = {
  box_shadow: '0 2px 8px rgba(0, 0, 0, .12)',
  text_shadow: '0 1px 2px rgba(0, 0, 0, .3)',
  transition: 'all 0.2s ease-out',
  transform: 'scale(1.02)',
};

@customElement('mc-design-panel')
export class DesignPanel extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .panel {
        display: grid;
        gap: 20px;
      }
      .rule-pick {
        display: grid;
        gap: 8px;
      }
      .rule {
        display: grid;
        gap: 16px;
        padding: 12px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
      }
      .rule-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .rule-head h3 {
        margin: 0;
        flex: 1;
        font-size: 0.875rem;
        font-weight: 500;
      }
      .danger-text {
        color: var(--mc-error-ink);
      }
      .danger-text:hover {
        background: color-mix(in srgb, var(--mc-error-ink) 10%, transparent);
      }
      .rule-conds {
        display: grid;
        gap: 12px;
      }
      .no-results {
        margin: 0;
      }
      .design-clip {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 8px;
      }
      .design-clip .menu {
        top: calc(100% + 4px);
        left: 0;
        min-width: 200px;
      }
      .design-clip .clip-status {
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .sector-reset-row {
        display: flex;
        justify-content: flex-end;
        margin: -4px -8px -8px 0;
      }
      /* headed groups (Layout, Style, Effects, Advanced) in one scrolling list */
      .dgroups {
        display: grid;
        gap: 12px;
      }
      .dgroup {
        display: grid;
        gap: 8px;
      }
      .dgroup-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        min-height: 40px;
        padding: 0 8px 0 4px;
        border: 0;
        border-radius: var(--mc-radius);
        background: color-mix(in srgb, var(--mc-surface-2) 55%, transparent);
        text-align: left;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--mc-text);
      }
      .dgroup-btn:hover {
        background: var(--mc-surface-2);
      }
      .dgroup-btn .nm {
        flex: 1;
        min-width: 0;
      }
      .dgroup-btn .chev {
        --mdc-icon-size: 20px;
        color: var(--mc-text-2);
        transition: transform 0.15s ease-out;
      }
      .dgroup-btn[aria-expanded='false'] .chev {
        transform: rotate(-90deg);
      }
      .dgroup-body {
        display: grid;
        gap: 16px;
      }
      @media (prefers-reduced-motion: reduce) {
        .dgroup-btn .chev {
          transition: none;
        }
      }
    `,
  ];

  @property({ attribute: false }) design: DesignConfig = {};
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) onChange!: (updates: Record<string, unknown>) => void;
  @property({ type: Boolean }) hasTemplate = false;
  @property({ attribute: false }) notSynced: string[] = [];
  @property({ type: String }) moduleEntity = '';
  /** What this design applies to, for the Custom CSS hint ("Applied to this module only"). */
  @property({ type: String }) target = 'module';
  /** Module type, for the animation Target (only modules with an icon hook). */
  @property({ type: String }) moduleType = '';
  /**
   * Edit only `design.hover` (the card's Hover section): no Default view, rules or copy / paste.
   * Writes still go out as `{ hover }`.
   */
  @property({ type: Boolean }) hoverOnly = false;

  @state() private _openSectors = new Set<string>();
  /** Groups the user opened or closed in this panel; the rest follow defaultOpen / a set value. */
  @state() private _groupOpen = new Map<string, boolean>();
  /** Groups shown open because they held a set value (not reactive: written while rendering). */
  private _openedForValue = new Set<string>();
  @state() private _searchQuery = '';
  @state() private _activeView: 'default' | string = 'default';
  @state() private _pasteMenu = false;
  private _pastePop = new MenuPopover(this, {
    menu: () => this.shadowRoot?.querySelector<HTMLElement>('.design-clip .menu'),
    onClose: () => {
      this._pasteMenu = false;
    },
    align: 'start',
  });
  /** aria-live confirmation: "Design copied" / "Design pasted". */
  @state() private _clipStatus = '';
  private _clipTimer?: number;

  /** Colour fields offer the entity's state colour only for a module with an entity. */
  private get _allowEntityColor(): boolean {
    return this.target === 'module' && !!this.moduleEntity;
  }

  /** The module entity's live state colour, for the swatch of an `entity` colour value. */
  private get _entityColor(): string {
    if (!this._allowEntityColor) return '';
    return entityStateColor(this.hass?.states?.[this.moduleEntity]) ?? 'currentColor';
  }

  protected willUpdate(): void {
    if (this.hoverOnly) this._activeView = HOVER_VIEW;
  }

  private _getActiveRule(): ConditionalDesign | undefined {
    if (this._activeView === 'default') return undefined;
    return this.design.conditional?.find((r) => r.id === this._activeView);
  }

  private _isHoverView(): boolean {
    return this._activeView === HOVER_VIEW;
  }

  /**
   * The rule or hover design being edited, with its writer; undefined in the Default view. A hover
   * edit writes the whole `hover` object (removed once empty), synced as one `hover` field.
   */
  private _sub(): SubDesign | undefined {
    const rule = this._getActiveRule();
    if (rule) return { design: rule.design as Record<string, unknown>, write: (d) => this._updateRule(rule.id, { design: d as DesignConfig }) };
    if (!this._isHoverView()) return undefined;
    return {
      design: (this.design.hover || {}) as Record<string, unknown>,
      write: (d) => {
        const next = { ...d };
        for (const k of Object.keys(next)) if (next[k] === undefined || next[k] === '') delete next[k];
        const updates: Record<string, unknown> = { hover: Object.keys(next).length ? next : undefined };
        if (this.hasTemplate) updates._markNotSynced = 'hover';
        this.onChange(updates);
      },
    };
  }

  private _getActiveDesign(): Record<string, unknown> {
    return this._sub()?.design ?? (this.design as Record<string, unknown>);
  }

  private _getValue(key: string): string {
    const rec = this._getActiveDesign();
    // a gradient in the `background` shorthand shows as the Background color's Gradient
    if (key === 'background_color' && !rec.background_color && parseGradient(rec.background)) return rec.background as string;
    return (rec[key] as string) || '';
  }

  /**
   * Why the Background color stays Solid, or '' when Gradient is offered. A gradient is written to the
   * `background` shorthand, so it must not replace another shorthand or sit under a background image,
   * and a rule view cannot clear the Default's solid color.
   */
  private _bgGradientBlock(): string {
    const rec = this._getActiveDesign();
    const base = this.design as Record<string, unknown>;
    const sub = !!this._sub();
    if (parseGradient(this._getValue('background_color'))) return '';
    const shorthand = rec.background ?? (sub ? base.background : undefined);
    if (shorthand && !parseGradient(shorthand as string)) return 'Gradient needs an empty Background field. Clear it to use a gradient here.';
    if (rec.background_image || (sub && base.background_image)) return 'A background image replaces a gradient here. Remove the image to use a gradient.';
    if (sub && base.background_color) return 'Default sets a solid color, so a rule cannot swap it for a gradient. Clear the Default color first.';
    return '';
  }

  /** Background color edit: a gradient goes to the `background` shorthand, a solid to background_color. */
  private _handleBackgroundColor(value: string): void {
    const rec = this._getActiveDesign();
    const gradient = !!parseGradient(value);
    const updates: Record<string, unknown> = gradient
      ? { background: value, background_color: undefined }
      : { background_color: value || undefined, ...(parseGradient(rec.background) ? { background: undefined } : {}) };
    const sub = this._sub();
    if (sub) {
      sub.write({ ...sub.design, ...updates });
      return;
    }
    if (this.hasTemplate) updates._markNotSynced = ['background_color', 'background'];
    this.onChange(updates);
  }

  /** Whether a property has a value in the edited design (a box field: shorthand or any side). */
  private _isSet(p: CssPropertyDef): boolean {
    const rec = this._getActiveDesign();
    if (p.type === 'animations') return readAnimations(rec as DesignConfig).length > 0;
    if (p.key === 'background_color' && this._getValue(p.key)) return true;
    // an empty object (a linked row's `shape_options: {}` marker) is not a value
    const empty = (v: unknown) => v === undefined || v === '' || (!!v && typeof v === 'object' && !Array.isArray(v) && !Object.keys(v).length);
    return propertyKeys(p.key).some((k) => !empty(rec[k]));
  }

  /** Design keys a property owns: a box field's sides, the animation list with its legacy keys. */
  private _keysOf(p: CssPropertyDef): string[] {
    if (p.key === 'background_color' && this._getValue(p.key) !== (this._getActiveDesign().background_color || '')) return ['background_color', 'background'];
    return p.type === 'animations' ? Object.keys(animationsUpdate([])) : propertyKeys(p.key);
  }

  /**
   * Reset: remove the properties' keys from the edited design (the default view or the active
   * rule), in one change. On a template-linked card it is an override like any other edit.
   */
  private _reset(props: CssPropertyDef[]): void {
    const keys = props.flatMap((p) => this._keysOf(p));
    const sub = this._sub();
    if (sub) {
      const design = { ...sub.design };
      for (const k of keys) delete design[k];
      sub.write(design);
      return;
    }
    const updates: Record<string, unknown> = Object.fromEntries(keys.map((k) => [k, undefined]));
    if (this.hasTemplate) updates._markNotSynced = props.length === 1 ? props[0].key : props.map((p) => p.key);
    this.onChange(updates);
  }

  private _handlePropertyChange(key: string, value: string): void {
    const sub = this._sub();
    if (sub) {
      sub.write({ ...sub.design, [key]: value || undefined });
      return;
    }

    const updates: Record<string, unknown> = { [key]: value || undefined };

    // If this card is linked to a template, mark this property as not_synced
    if (this.hasTemplate) {
      updates._markNotSynced = key;
    }

    this.onChange(updates);
  }

  /** Writes the animation list (and drops the legacy single-animation keys). */
  private _handleAnimationsChange(list: AnimationConfig[]): void {
    const updates = animationsUpdate(list);
    const sub = this._sub();
    if (sub) {
      const design = { ...sub.design, ...updates } as Record<string, unknown>;
      for (const k of Object.keys(updates)) if (design[k] === undefined) delete design[k];
      sub.write(design);
      return;
    }
    if (this.hasTemplate) updates._markNotSynced = 'animations';
    this.onChange(updates);
  }

  /** Writes a whole-object design key (the ring) to the default view or the active rule. */
  private _handleObjectChange(key: string, value: unknown): void {
    const sub = this._sub();
    if (sub) {
      const design = { ...sub.design };
      if (value === undefined) delete design[key];
      else design[key] = value;
      sub.write(design);
      return;
    }
    const updates: Record<string, unknown> = { [key]: value };
    if (this.hasTemplate) updates._markNotSynced = key;
    this.onChange(updates);
  }

  /** Writes several design keys as one edit (the shape and its options), synced as one field `syncKey`. */
  private _handleKeysChange(updates: Record<string, unknown>, syncKey: string): void {
    const sub = this._sub();
    if (sub) {
      const design = { ...sub.design };
      for (const [k, v] of Object.entries(updates)) {
        if (v === undefined) delete design[k];
        else design[k] = v;
      }
      sub.write(design);
      return;
    }
    const out: Record<string, unknown> = { ...updates };
    if (this.hasTemplate) out._markNotSynced = syncKey;
    this.onChange(out);
  }

  /** Any border radius (shorthand or a corner) in the edited view or the default design. */
  private _hasRadius(): boolean {
    const merged = { ...(this.design as Record<string, unknown>), ...this._getActiveDesign() };
    return propertyKeys('border_radius').some((k) => merged[k] !== undefined && merged[k] !== '');
  }

  private _handleSyncToggle(propertyName: string, currentlySynced: boolean): void {
    if (currentlySynced) {
      // Mark as not synced (propertyName is already the key like "background_color")
      this.onChange({ _markNotSynced: propertyName === 'background_color' ? ['background_color', 'background'] : propertyName });
    } else {
      // Re-sync this property
      this.onChange({ _markSynced: propertyName === 'background_color' ? ['background_color', 'background'] : propertyName });
    }
  }

  private _toggleSector(id: string): void {
    const next = new Set(this._openSectors);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this._openSectors = next;
  }

  /** Open state of a group: the user's choice, else open by default or when it holds a set value. */
  private _isGroupOpen(group: DesignGroup, count: number): boolean {
    // once opened for a set value it stays open, so clearing the last value does not fold it away
    if (count > 0) this._openedForValue.add(group.id);
    return this._groupOpen.get(group.id) ?? (group.defaultOpen || this._openedForValue.has(group.id));
  }

  private _toggleGroup(group: DesignGroup, open: boolean): void {
    this._groupOpen = new Map(this._groupOpen).set(group.id, !open);
  }

  /** Whether the Custom CSS field matches the search (always shown without one). */
  private _customCssMatches(): boolean {
    const q = this._searchQuery.toLowerCase();
    return !q || 'custom css'.includes(q) || q === 'css';
  }

  private _countSetProperties(sector: CssSector): number {
    const rec = this._getActiveDesign();
    // A box property counts once whether it is set as a shorthand or per side.
    return sector.properties.filter((p) =>
      p.type === 'animations'
        ? readAnimations(rec as DesignConfig).length > 0
        : propertyKeys(p.key).some((k) => rec[k] !== undefined && rec[k] !== ''),
    ).length;
  }

  /** Options that depend on another one stay hidden until it is set (border length alignment). */
  private _isVisible(p: CssPropertyDef): boolean {
    const merged = { ...(this.design as Record<string, unknown>), ...this._getActiveDesign() };
    if (DEPENDENT_OPTIONS[p.key]) return !!merged[DEPENDENT_OPTIONS[p.key]];
    return true;
  }

  private _filterProperties(all: CssPropertyDef[]): CssPropertyDef[] {
    // hover is a CSS rule: only CSS properties (no card-drawn options like the ring or border length)
    const hover = this._isHoverView();
    const properties = all.filter((p) => this._isVisible(p) && !(hover && (p.virtual || NO_HOVER_TYPES.has(p.type))));
    if (!this._searchQuery) return properties;
    const q = this._searchQuery.toLowerCase();
    return properties.filter(
      (p) =>
        t(p.label).toLowerCase().includes(q) ||
        p.cssProperty.toLowerCase().includes(q) ||
        p.key.toLowerCase().includes(q) ||
        p.key.replace(/_/g, ' ').includes(q) ||
        (BOX_LONGHANDS[p.key] || []).some(
          (l) => l.cssProperty.includes(q) || l.key.includes(q),
        ),
    );
  }

  // ── Copy / paste design (src/utils/design-clipboard.ts) ──

  private _announce(msg: string): void {
    this._clipStatus = msg;
    window.clearTimeout(this._clipTimer);
    this._clipTimer = window.setTimeout(() => (this._clipStatus = ''), 2500);
  }

  private _copyDesign(): void {
    copyDesign(this.design);
    this._announce('Design copied');
  }

  /** Paste the copied design onto the whole design (all rules included), in one change. */
  private _pasteDesign(mode: PasteMode): void {
    this._closePasteMenu(true);
    const clip = readDesignClipboard();
    if (!clip) return;
    const next = pastedDesign(this.design, clip, mode);
    const updates = designUpdates(this.design, next);
    const before = this.design as Record<string, unknown>;
    const changed = Object.keys(updates).filter((k) => JSON.stringify(before[k]) !== JSON.stringify(updates[k]));
    if (this.hasTemplate && changed.length) updates._markNotSynced = changed;
    this._activeView = 'default';
    this.onChange(updates);
    this._announce('Design pasted');
  }

  private _openPasteMenu(trigger: HTMLElement): void {
    this._pasteMenu = true;
    this._pastePop.open(trigger);
  }

  private _closePasteMenu(restoreFocus: boolean): void {
    this._pastePop.close(restoreFocus);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearTimeout(this._clipTimer);
  }

  /** "Copy design" / "Paste design" (menu: Replace design / Merge into design), above the rule picker. */
  private _renderClipboard(): TemplateResult {
    const canPaste = !!readDesignClipboard();
    return html`
      <div class="design-clip">
        <button type="button" class="btn btn-text btn-sm" @click=${() => this._copyDesign()}>
          <ha-icon icon="mdi:content-copy"></ha-icon>Copy design
        </button>
        <button
          type="button"
          class="btn btn-text btn-sm paste"
          aria-haspopup="menu"
          aria-expanded=${this._pasteMenu ? 'true' : 'false'}
          ?disabled=${!canPaste}
          title=${canPaste ? 'Paste the copied design' : 'Copy a design first'}
          @click=${(e: Event) => this._openPasteMenu(e.currentTarget as HTMLElement)}
        >
          <ha-icon icon="mdi:content-paste"></ha-icon>Paste design
        </button>
        <span class="clip-status" role="status" aria-live="polite">${this._clipStatus}</span>
        ${this._pasteMenu
          ? html`<div class="menu" role="menu" aria-label="Paste design" @keydown=${this._pastePop.onKeydown}>
              <button type="button" role="menuitem" @click=${() => this._pasteDesign('replace')}>
                <ha-icon icon="mdi:content-paste"></ha-icon>Replace design
              </button>
              <button type="button" role="menuitem" @click=${() => this._pasteDesign('merge')}>
                <ha-icon icon="mdi:set-merge"></ha-icon>Merge into design
              </button>
            </div>`
          : nothing}
      </div>
    `;
  }

  // ── Conditional rule management ──

  private _addRule(): void {
    const rules = [...(this.design.conditional || [])];
    const newRule: ConditionalDesign = {
      id: generateId('rule'),
      name: `Rule ${(this.design.conditional?.length ?? 0) + 1}`,
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

  /** By index: YAML conditions often have no `id`. */
  private _updateCondition(rule: ConditionalDesign, index: number, updates: Partial<DisplayCondition>): void {
    const conditions = rule.conditions.map((c, i) =>
      i === index ? { ...c, ...updates } : c,
    );
    this._updateRuleConditions(rule.id, conditions);
  }

  private _removeCondition(rule: ConditionalDesign, index: number): void {
    const conditions = rule.conditions.filter((_c, i) => i !== index);
    this._updateRuleConditions(rule.id, conditions);
  }

  // ── Render methods ──

  private _renderField(
    label: string,
    control: TemplateResult,
    syncIndicator: TemplateResult | typeof nothing = nothing,
    forId?: string,
    help?: string,
    reset: TemplateResult | typeof nothing = nothing,
  ): TemplateResult {
    return html`
      <div class="field">
        <div class="field-head">
          ${forId ? html`<label for=${forId}>${label}</label>` : html`<span class="lbl">${label}</span>`}
          ${reset}${syncIndicator}
        </div>
        ${control}
        ${help ? html`<p class="help">${help}</p>` : nothing}
      </div>
    `;
  }

  private _renderProperty(p: CssPropertyDef): TemplateResult {
    const value = this._getValue(p.key);
    const isRuleView = this._activeView !== 'default';
    const propertyPath = `design.${p.key}`; // Design properties are prefixed with "design."
    const isSynced = this.hasTemplate && !this.notSynced.includes(propertyPath);
    const id = `dp-${p.key}`;

    const syncIndicator = this.hasTemplate && !isRuleView
      ? html`
          <mc-sync-indicator
            .synced=${isSynced}
            .hasTemplate=${this.hasTemplate}
            @sync-toggle=${() => this._handleSyncToggle(p.key, isSynced)}
          ></mc-sync-indicator>
        `
      : nothing;
    // the animation list has its own per-entry "Reset to preset", the ring editor per-field resets and Off
    const reset = p.type === 'animations' || p.type === 'ring' || p.type === 'value_bg' ? nothing : fieldReset(t(p.label), this._isSet(p), () => this._reset([p]));
    const field = (control: TemplateResult, sync: TemplateResult | typeof nothing = nothing, forId?: string, help?: string) =>
      this._renderField(t(p.label), control, sync, forId, help, reset);

    switch (p.type) {
      case 'animations': {
        const isModule = this.target === 'module';
        return field(
          html`
            <mc-animation-list
              .animations=${readAnimations(this._getActiveDesign() as DesignConfig)}
              .allowIcon=${isModule && ANIMATION_ICON_MODULES.includes(this.moduleType)}
              .hass=${this.hass}
              .defaultEntity=${isModule ? this.moduleEntity : ''}
              .requireTriggerEntity=${!isModule}
              .allowEntityColor=${this._allowEntityColor}
              .entityColor=${this._entityColor}
              .onChange=${(list: AnimationConfig[]) => this._handleAnimationsChange(list)}
            ></mc-animation-list>
          `,
          syncIndicator,
        );
      }

      case 'ring': {
        const isModule = this.target === 'module';
        return field(
          html`<mc-ring-editor
            .ring=${this._getActiveDesign().ring as RingConfig | undefined}
            .hass=${this.hass}
            .defaultEntity=${isModule ? this.moduleEntity : ''}
            .requireEntity=${!isModule}
            .allowEntityColor=${this._allowEntityColor}
            .entityColor=${this._entityColor}
            .onChange=${(ring: RingConfig | undefined) => this._handleObjectChange('ring', ring)}
          ></mc-ring-editor>`,
          syncIndicator,
        );
      }

      case 'shape': {
        const active = this._getActiveDesign();
        const merged = { ...(this.design as Record<string, unknown>), ...active };
        // None must stay off where a removed key would take another shape: a template's, or the
        // default design's under a conditional rule
        const explicitNone = (!isRuleView && this.hasTemplate) || (isRuleView && !!this.design.shape && this.design.shape !== 'none');
        return field(
          html`<mc-shape-editor
            .shape=${active.shape as string | undefined}
            .options=${active.shape_options as ShapeOptions | undefined}
            .explicitNone=${explicitNone}
            .target=${this.target}
            .hasRadius=${this._hasRadius()}
            .hasShadow=${!!merged.box_shadow}
            .hass=${this.hass}
            .onChange=${(patch: ShapePatch) => this._handleKeysChange({ ...patch }, 'shape')}
          ></mc-shape-editor>`,
          syncIndicator,
        );
      }

      case 'value_bg': {
        const isModule = this.target === 'module';
        // Off must stay off where a removed key would take another value background (like the shape)
        const base = this.design.value_background as ValueBackgroundConfig | undefined;
        const explicitNone = (!isRuleView && this.hasTemplate) || (isRuleView && !!base?.type && base.type !== 'none');
        return field(
          html`<mc-value-bg-editor
            .value=${this._getActiveDesign().value_background as ValueBackgroundConfig | undefined}
            .hass=${this.hass}
            .explicitNone=${explicitNone}
            .defaultEntity=${isModule ? this.moduleEntity : ''}
            .onChange=${(vb: ValueBackgroundConfig | undefined) => this._handleObjectChange('value_background', vb)}
          ></mc-value-bg-editor>`,
          syncIndicator,
        );
      }

      case 'box':
        if (isRuleView) {
          // In a rule or hover view, box fields work on that design
          const sub = this._sub()!;
          return field(
            html`
              <mc-box-field
                .design=${sub.design}
                .onChange=${(updates: Record<string, unknown>) => sub.write({ ...sub.design, ...updates })}
                .baseName=${p.key as 'padding' | 'margin' | 'border_radius'}
              ></mc-box-field>
            `,
          );
        }
        return field(
          html`
            <mc-box-field
              .design=${this.design}
              .onChange=${(updates: Record<string, unknown>) =>
                // a side edit on a template-linked card un-syncs the whole box field (shorthand + sides)
                this.onChange(this.hasTemplate ? { ...updates, _markNotSynced: p.key } : updates)}
              .baseName=${p.key as 'padding' | 'margin' | 'border_radius'}
            ></mc-box-field>
          `,
          syncIndicator,
        );

      case 'unit':
        return field(
          html`
            <mc-unit-field
              .value=${value}
              .label=${t(p.label)}
              .units=${p.units}
              .placeholder=${unitPlaceholder(p.key, { ...(this.design as Record<string, unknown>), ...this._getActiveDesign() })}
              @value-changed=${(e: CustomEvent) => this._handlePropertyChange(p.key, e.detail.value)}
            ></mc-unit-field>
          `,
          syncIndicator,
          undefined,
          lbl(p.help),
        );

      case 'color': {
        const bgBlock = p.key === 'background_color' ? this._bgGradientBlock() : '';
        return field(
          html`
            <mc-color-picker
              .value=${value}
              .label=${t(p.label)}
              .allowEntity=${this._allowEntityColor}
              .entityColor=${this._entityColor}
              .gradient=${(p.key === 'background_color' && !bgBlock) || (p.key === 'color' && this.target === 'module' && TEXT_GRADIENT_MODULES.includes(this.moduleType)) ? 'css' : ''}
              .gradientNote=${p.key === 'color' ? 'Text uses this gradient as its fill. Older tablets show the first color.' : ''}
              @value-changed=${(e: CustomEvent) =>
                p.key === 'background_color' ? this._handleBackgroundColor(e.detail.value) : this._handlePropertyChange(p.key, e.detail.value)}
            ></mc-color-picker>
          `,
          syncIndicator,
          undefined,
          bgBlock || undefined,
        );
      }

      case 'image':
        return field(
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
        return field(
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
        return field(
          html`
            <div class="select">
              <select
                class="input"
                id=${id}
                @change=${(e: Event) => this._handlePropertyChange(p.key, (e.target as HTMLSelectElement).value)}
              >
                <option value="" ?selected=${!value}>${p.emptyLabel === undefined ? 'Not set' : t(p.emptyLabel)}</option>
                ${this._renderOptions(p.options || [], value)}
              </select>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </div>
          `,
          syncIndicator,
          id,
        );

      case 'segmented': {
        const opts = p.options || [];
        const current = opts.some((o) => o.value === value) ? value : (p.defaultValue ?? opts[0]?.value);
        const onKey = (e: KeyboardEvent) => {
          const idx = opts.findIndex((o) => o.value === current);
          const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
          const next = e.key === 'Home' ? 0 : e.key === 'End' ? opts.length - 1 : step[e.key] !== undefined ? (idx + step[e.key] + opts.length) % opts.length : -1;
          if (next < 0) return;
          e.preventDefault();
          const group = e.currentTarget as HTMLElement;
          this._handlePropertyChange(p.key, opts[next].value);
          requestAnimationFrame(() => group.querySelector<HTMLElement>(`[data-val="${opts[next].value}"]`)?.focus());
        };
        return field(
          html`
            <div class="seg full" role="radiogroup" aria-label=${t(p.label)} @keydown=${onKey}>
              ${opts.map((o) => {
                const on = o.value === current;
                return html`<button
                  type="button"
                  role="radio"
                  data-val=${o.value}
                  aria-checked=${on ? 'true' : 'false'}
                  tabindex=${on ? '0' : '-1'}
                  @click=${() => this._handlePropertyChange(p.key, o.value)}
                >${t(o.label)}</button>`;
              })}
            </div>
          `,
          syncIndicator,
        );
      }

      case 'number':
        return field(
          html`
            <input
              class="input"
              id=${id}
              type="number"
              .value=${value}
              @input=${(e: InputEvent) => this._handlePropertyChange(p.key, (e.target as HTMLInputElement).value)}
            />
          `,
          syncIndicator,
          id,
        );

      case 'text':
      default:
        return field(
          html`
            <input
              class="input mono"
              id=${id}
              type="text"
              spellcheck="false"
              placeholder=${TEXT_PLACEHOLDERS[p.key] ?? nothing}
              .value=${value}
              @input=${(e: InputEvent) => this._handlePropertyChange(p.key, (e.target as HTMLInputElement).value)}
            />
          `,
          syncIndicator,
          id,
        );
    }
  }

  /** Options, inside <optgroup>s when they carry a group (animation presets). */
  private _renderOptions(options: CssPropertyOption[], value: string): TemplateResult[] {
    const opt = (o: CssPropertyOption) => html`<option value=${o.value} ?selected=${value === o.value}>${t(o.label)}</option>`;
    const groups = [...new Set(options.map((o) => o.group))];
    if (groups.length === 1 && groups[0] === undefined) return options.map(opt);
    return groups.map(
      (g) => html`<optgroup label=${g ?? ''}>${options.filter((o) => o.group === g).map(opt)}</optgroup>`,
    );
  }

  private _renderSector(sector: CssSector): TemplateResult | typeof nothing {
    const filtered = this._filterProperties(displayProperties(sector));
    if (filtered.length === 0) return nothing;

    // While searching, sectors with matches are shown open.
    const isOpen = this._openSectors.has(sector.id) || !!this._searchQuery;
    const count = this._countSetProperties(sector);
    const bodyId = `sb-${sector.id}`;

    return html`
      <div class="sector">
        <button
          type="button"
          class="sector-btn"
          aria-expanded=${isOpen ? 'true' : 'false'}
          aria-controls=${bodyId}
          @click=${() => this._toggleSector(sector.id)}
        >
          <ha-icon icon=${sector.icon}></ha-icon>
          <span class="nm">${t(sector.name)}</span>
          ${count > 0 ? html`<span class="chip is-count">${count} set</span>` : nothing}
          <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
        </button>
        ${isOpen
          ? html`<div class="sector-body" id=${bodyId}>
              ${count > 0
                ? html`<div class="sector-reset-row">
                    <button
                      type="button"
                      class="btn btn-text btn-sm sector-reset"
                      aria-label="Reset section ${t(sector.name)}"
                      title="Clear every value in this section"
                      @click=${() => this._reset(sector.properties.filter((p) => this._isSet(p)))}
                    >
                      <ha-icon icon="mdi:backup-restore"></ha-icon>Reset section
                    </button>
                  </div>`
                : nothing}
              ${this._renderPropertyList(filtered)}
            </div>`
          : nothing}
      </div>
    `;
  }

  /** Compact fields (unit / select / number) pair up side by side, like the mockup's Width + Min height. */
  private _renderPropertyList(props: CssPropertyDef[]): TemplateResult[] {
    const compact = (p?: CssPropertyDef) => !!p && (p.type === 'unit' || p.type === 'select' || p.type === 'number');
    const out: TemplateResult[] = [];
    for (let i = 0; i < props.length; i++) {
      const p = props[i];
      if (compact(p) && compact(props[i + 1])) {
        out.push(html`<div class="two">${this._renderProperty(p)}${this._renderProperty(props[i + 1])}</div>`);
        i++;
      } else {
        out.push(this._renderProperty(p));
      }
    }
    return out;
  }

  /** Mockup: "Editing design for" select (Default + one option per rule), help line, "Add conditional rule". */
  private _renderRulePicker(): TemplateResult {
    const rules = this.design.conditional || [];
    const n = rules.length;
    const help = this._isHoverView()
      ? `Applied while the pointer is over this ${this.target}, on top of Default and matching rules.`
      : n
        ? `${n} conditional rule${n === 1 ? '' : 's'}. Rules override Default only while their conditions match.`
        : 'Add a rule to change the look when conditions match.';
    return html`
      <div class="rule-pick">
        <div class="field">
          <div class="field-head"><label for="design-view">Editing design for</label></div>
          <div class="select">
            <select
              class="input"
              id="design-view"
              aria-describedby="design-view-help"
              @change=${(e: Event) => {
                this._activeView = (e.target as HTMLSelectElement).value;
              }}
            >
              <option value="default" ?selected=${this._activeView === 'default'}>Default</option>
              <option value=${HOVER_VIEW} ?selected=${this._isHoverView()}>Hover</option>
              ${rules.map(
                (r, i) => html`<option value=${r.id} ?selected=${this._activeView === r.id}>Rule: ${r.name || `Rule ${i + 1}`}</option>`,
              )}
            </select>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </div>
          <p class="help" id="design-view-help">${help}</p>
        </div>
        <div>
          <button type="button" class="btn btn-text btn-sm" @click=${() => this._addRule()}>
            <ha-icon icon="mdi:plus"></ha-icon>Add conditional rule
          </button>
        </div>
      </div>
    `;
  }

  private _renderRuleHeader(rule: ConditionalDesign): TemplateResult {
    const mode = rule.mode === 'any' ? 'any' : 'every';
    const modes: Array<{ v: 'every' | 'any'; l: string }> = [
      { v: 'every', l: 'All match (AND)' },
      { v: 'any', l: 'Any matches (OR)' },
    ];
    return html`
      <div class="rule-head">
        <h3>Rule</h3>
        <button
          type="button"
          class="btn btn-text btn-sm danger-text"
          @click=${() => this._removeRule(rule.id)}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>Delete rule
        </button>
      </div>
      <div class="field">
        <div class="field-head"><label for="rule-name">Rule name</label></div>
        <input
          class="input"
          id="rule-name"
          type="text"
          .value=${rule.name || ''}
          placeholder="Rule name"
          @input=${(e: InputEvent) =>
            this._updateRuleName(rule.id, (e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="field">
        <div class="field-head"><span class="lbl">Match</span></div>
        <div class="seg full" role="radiogroup" aria-label="Condition match">
          ${modes.map(
            (m) => html`
              <button
                type="button"
                role="radio"
                aria-checked=${mode === m.v ? 'true' : 'false'}
                @click=${() => this._updateRuleMode(rule.id, m.v)}
              >${m.l}</button>
            `,
          )}
        </div>
      </div>
    `;
  }

  private _renderRuleConditions(rule: ConditionalDesign): TemplateResult {
    return html`
      <div class="rule-conds">
        ${rule.conditions.length
          ? rule.conditions.map(
              (cond, idx) => html`
                <mc-condition-row
                  .condition=${cond}
                  .hass=${this.hass}
                  .moduleEntity=${this.moduleEntity}
                  .onChange=${(updates: Partial<DisplayCondition>) =>
                    this._updateCondition(rule, idx, updates)}
                  .onRemove=${() => this._removeCondition(rule, idx)}
                ></mc-condition-row>
              `,
            )
          : html`<p class="help">No conditions yet. The rule applies once a condition is added and matches.</p>`}
        <div>
          <button type="button" class="btn btn-secondary btn-sm" @click=${() => this._addConditionToRule(rule)}>
            <ha-icon icon="mdi:plus"></ha-icon>Add condition
          </button>
        </div>
      </div>
    `;
  }

  private _handleCustomCssChange(value: string): void {
    const sub = this._sub();
    if (sub) {
      sub.write({ ...sub.design, css: value || undefined });
      return;
    }
    this.onChange({ css: value || undefined });
  }

  private _getCustomCssValue(): string {
    return (this._getActiveDesign().css as string) || '';
  }

  /** Number of set values in a group: its sectors' counts plus Custom CSS. */
  private _countGroup(group: DesignGroup): number {
    return group.entries.reduce((n, id) => {
      if (id === CUSTOM_CSS_ENTRY) return n + (this._getCustomCssValue() ? 1 : 0);
      const sector = CSS_SECTORS.find((s) => s.id === id);
      return n + (sector ? this._countSetProperties(sector) : 0);
    }, 0);
  }

  /**
   * A headed group (Layout, Style, Effects, Advanced): heading button with the group's set count,
   * then its sectors. Hidden when nothing in it is visible; open while searching.
   */
  private _renderGroup(group: DesignGroup): TemplateResult | typeof nothing {
    const sectors = group.entries
      .map((id) => CSS_SECTORS.find((s) => s.id === id))
      .filter((s): s is CssSector => !!s && this._filterProperties(s.properties).length > 0);
    const showCss = group.entries.includes(CUSTOM_CSS_ENTRY) && this._customCssMatches();
    if (!sectors.length && !showCss) return nothing;

    const count = this._countGroup(group);
    const open = !!this._searchQuery || this._isGroupOpen(group, count);
    const bodyId = `dg-${group.id}`;
    return html`
      <section class="dgroup" data-group=${group.id}>
        <button
          type="button"
          class="dgroup-btn"
          aria-expanded=${open ? 'true' : 'false'}
          aria-controls=${bodyId}
          @click=${() => this._toggleGroup(group, this._isGroupOpen(group, count))}
        >
          <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
          <span class="nm">${t(group.name)}</span>
          ${count > 0 ? html`<span class="chip is-count">${count} set</span>` : nothing}
        </button>
        <div class="dgroup-body" id=${bodyId} ?hidden=${!open}>
          ${open
            ? html`${sectors.length ? html`<div class="sectors">${sectors.map((s) => this._renderSector(s))}</div>` : nothing}
              ${showCss ? this._renderCustomCss() : nothing}`
            : nothing}
        </div>
      </section>
    `;
  }

  private _renderCustomCss(): TemplateResult {
    return html`
      <div class="field">
        <div class="field-head">
          <label for="custom-css">Custom CSS</label>
          ${fieldReset('Custom CSS', !!this._getCustomCssValue(), () => this._handleCustomCssChange(''))}
        </div>
        <textarea
          class="input"
          id="custom-css"
          spellcheck="false"
          .value=${this._getCustomCssValue()}
          @input=${(e: InputEvent) => this._handleCustomCssChange((e.target as HTMLTextAreaElement).value)}
          rows="4"
          placeholder="Applied to this ${this.target} only"
        ></textarea>
      </div>
    `;
  }

  protected render(): TemplateResult {
    const activeRule = this._getActiveRule();

    // If active view references a deleted rule, reset to default
    if (this._activeView !== 'default' && !this._isHoverView() && !activeRule) {
      this._activeView = 'default';
    }
    const groups = DESIGN_GROUPS.map((g) => this._renderGroup(g));

    return html`
      <div class="panel">
        ${this.hoverOnly
          ? nothing
          : html`<div class="group">
          ${this._renderClipboard()}
          ${this._renderRulePicker()}
          ${activeRule
            ? html`
                <div class="rule">
                  ${this._renderRuleHeader(activeRule)}
                  ${this._renderRuleConditions(activeRule)}
                </div>
              `
            : nothing}
        </div>`}

        <div class="group">
          <div class="with-icon">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input
              class="input"
              type="search"
              placeholder="Search CSS properties, e.g. padding"
              aria-label="Search CSS properties"
              .value=${this._searchQuery}
              @input=${(e: InputEvent) => {
                this._searchQuery = (e.target as HTMLInputElement).value;
              }}
            />
          </div>
          ${groups.some((g) => g !== nothing)
            ? html`<div class="dgroups">${groups}</div>`
            : html`<p class="no-results">No CSS property matches "${this._searchQuery}".</p>`}
        </div>
      </div>
    `;
  }
}
