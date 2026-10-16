import { html, nothing, TemplateResult } from 'lit';
import type {
  AnimationConfig,
  DesignConfig,
  RingConfig,
  CardAppearanceOverrides,
  ConditionalCardAppearance,
  DisplayCondition,
  DisplayConfig,
  HomeAssistant,
  MagicCardConfig,
  PopupConfig,
  SeasonalSetting,
  ValueBackgroundConfig,
} from '../../types';
import type { ShapePatch } from '../components/shape-editor';
import type { SyncContext } from '../../utils/sync-path';
import { generateId } from '../../utils/id-generator';
import {
  renderFieldHead,
  renderBoxField,
  renderColorField,
  renderMediaField,
  renderSelectField,
  renderTextField,
  renderToggleField,
  renderUnitField,
} from '../../utils/form-utils';
import { renderConditionsList } from './conditions-list';
import { readAnimations } from '../../utils/animation';
import { fieldReset } from '../components/field-reset';
import { animationDocList } from '../../utils/custom-animations';
import { dropOwnAnimation, setAnimationHidden } from '../state/template-sync';
import '../components/animation-list';
import '../components/ring-editor';
import '../components/shape-editor';
import '../components/value-bg-editor';
import '../components/popup-settings';
import '../components/flows-editor';
import '../components/seasonal-editor';
import '../components/design-panel';

/** Write one top-level card property (marks it not_synced when the card is linked to a template). */
export type CardUpdate = (propertyName: keyof MagicCardConfig, value: unknown) => void;

/**
 * Write several top-level card properties as one edit (undefined removes a key); `syncKey` is the
 * field marked not_synced on a template-linked card (the shape covers its options too).
 */
export type CardPatch = (updates: Partial<Record<keyof MagicCardConfig, unknown>>, syncKey: keyof MagicCardConfig) => void;

export type ThemeOption = { label: string; value: string };

/** Which appearance rules are expanded; owned by the inspector so it survives re-renders. */
export interface RulesState {
  expanded: Set<string>;
  toggle: (id: string) => void;
  expand: (id: string) => void;
  collapse: (id: string) => void;
}

export function cardThemeOptions(hass?: HomeAssistant): ThemeOption[] {
  const names = Object.keys(hass?.themes?.themes || {}).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' }),
  );
  return [{ label: 'Dashboard default', value: '__default__' }, ...names.map((n) => ({ label: n, value: n }))];
}

const newCondition = (): DisplayCondition => ({ id: generateId('cond'), type: 'state', entity: '', state: '' });

export function renderCardGeneral(
  config: MagicCardConfig,
  update: CardUpdate,
  syncCtx: SyncContext | undefined,
  hass: HomeAssistant | undefined,
  canvas = false,
): TemplateResult {
  const usePageTheme = config.use_page_theme !== false;
  const popup = config.popup && typeof config.popup === 'object' ? config.popup : undefined;
  const popupOn = popup?.enabled === true;
  return html`
    <div class="group">
      ${renderTextField('Name', config.name, (v) => update('name', v), 'name', syncCtx)}
      ${renderToggleField(
        'Use dashboard theme',
        usePageTheme,
        (v) => update('use_page_theme', v),
        'use_page_theme',
        syncCtx,
        'Turn off to pick a theme for this card only.',
      )}
      ${renderSelectField(
        'Card theme',
        usePageTheme ? '__default__' : config.theme || '__default__',
        cardThemeOptions(hass),
        (v) => update('theme', v === '__default__' ? undefined : v),
        'theme',
        syncCtx,
        { disabled: usePageTheme },
      )}
    </div>
    <section class="group">
      <div class="group-head">
        <ha-icon icon="mdi:dock-window"></ha-icon>
        <h3>Pop-up</h3>
      </div>
      ${renderToggleField(
        'Show as pop-up',
        popupOn,
        (v) => update('popup', v ? { ...popup, enabled: true } : popup && Object.keys(popup).length > 1 ? { ...popup, enabled: false } : undefined),
        'popup',
        syncCtx,
        'Hidden on the dashboard; opens over it from its #ID, a trigger or an Open pop-up action.',
      )}
      ${popupOn
        ? html`<mc-popup-settings
            .popup=${popup}
            .hass=${hass}
            .canvas=${canvas}
            .onChange=${(next: PopupConfig) => update('popup', { ...next, enabled: true })}
          ></mc-popup-settings>`
        : nothing}
    </section>
  `;
}

export function renderCardDesign(
  config: MagicCardConfig,
  update: CardUpdate,
  syncCtx: SyncContext | undefined,
  hass: HomeAssistant | undefined,
  patch?: CardPatch,
  templateDocs?: Array<Record<string, unknown>>,
  write?: (next: MagicCardConfig) => void,
): TemplateResult {
  const writeShape = (p: ShapePatch) => {
    if (patch) patch({ shape: p.shape, shape_options: p.shape_options }, 'shape');
    else {
      update('shape', p.shape);
      update('shape_options', p.shape_options);
    }
  };
  return html`
    <div class="group">
      ${renderColorField('Background color', config.background, (v) => update('background', v), 'background', syncCtx)}
      ${renderMediaField('Background image', config.background_image, (v) => update('background_image', v), hass, 'image', 'background_image', syncCtx)}
      <div class="two">
        ${renderUnitField('Border radius', config.border_radius, (v) => update('border_radius', v), 'border_radius', syncCtx)}
        ${renderUnitField('Card height', config.card_height, (v) => update('card_height', v), 'card_height', syncCtx, 'auto')}
      </div>
      ${renderBoxField('Padding', config.padding, (v) => update('padding', v), 'padding', 'padding', syncCtx)}
      ${renderTextField('Box shadow', config.box_shadow, (v) => update('box_shadow', v), 'box_shadow', syncCtx, {
        placeholder: 'Theme default',
        mono: true,
      })}
    </div>
    <section class="group">
      <div class="field">
        ${renderFieldHead('Animations', 'animations', syncCtx)}
        <mc-animation-list
          .animations=${readAnimations({ animations: config.animations })}
          .hass=${hass}
          .requireTriggerEntity=${true}
          .onChange=${(list: AnimationConfig[]) => update('animations', list.length ? list : undefined)}
        ></mc-animation-list>
      </div>
    </section>
    ${write ? renderTemplateAnimations(config, templateDocs, write, syncCtx) : nothing}
    <section class="group">
      <div class="field">
        ${renderFieldHead('Ring', 'ring', syncCtx)}
        <mc-ring-editor
          .ring=${config.ring}
          .hass=${hass}
          .requireEntity=${true}
          .clipped=${true}
          .onChange=${(ring: RingConfig | undefined) => update('ring', ring)}
        ></mc-ring-editor>
      </div>
    </section>
    <section class="group">
      <div class="field">
        ${renderFieldHead('Shape', 'shape', syncCtx)}
        <mc-shape-editor
          .shape=${config.shape}
          .options=${config.shape_options}
          .explicitNone=${!!config.template}
          .target=${'card'}
          .hasRadius=${!!config.border_radius}
          .hasShadow=${!!config.box_shadow}
          .popup=${config.popup?.enabled === true}
          .onChange=${writeShape}
        ></mc-shape-editor>
      </div>
    </section>
    <section class="group">
      <div class="field">
        ${renderFieldHead('Value background', 'value_background', syncCtx)}
        <mc-value-bg-editor
          .value=${config.value_background}
          .hass=${hass}
          .explicitNone=${!!config.template}
          .onChange=${(vb: ValueBackgroundConfig | undefined) => update('value_background', vb)}
        ></mc-value-bg-editor>
      </div>
    </section>
    <section class="group">
      <div class="field">
        ${renderFieldHead('Seasonal', 'seasonal', syncCtx)}
        <mc-seasonal-editor
          .value=${config.seasonal}
          .hass=${hass}
          .explicitNone=${!!config.template}
          .onChange=${(next: SeasonalSetting | undefined) => update('seasonal', next)}
        ></mc-seasonal-editor>
      </div>
    </section>
    <section class="group">
      <div class="field">
        ${renderFieldHead('Hover', 'hover', syncCtx, {
          reset: fieldReset('Hover', !!config.hover, () => update('hover', undefined)),
        })}
        <p class="help">Applied while the pointer is over the card, on top of the fields above.</p>
      </div>
      <mc-design-panel
        class="card-hover"
        .design=${{ hover: config.hover } as DesignConfig}
        .hass=${hass}
        .target=${'card'}
        .hoverOnly=${true}
        .onChange=${(u: Record<string, unknown>) => update('hover', u.hover)}
      ></mc-design-panel>
    </section>
    <section class="group">
      <div class="field">
        ${renderFieldHead('Custom CSS', 'css', syncCtx, {
          forId: 'card-css',
          reset: fieldReset('Custom CSS', !!config.css, () => update('css', undefined)),
        })}
        <textarea
          class="input mono"
          id="card-css"
          rows="4"
          spellcheck="false"
          placeholder="Applied to the card's content, e.g. letter-spacing: 0.5px"
          .value=${config.css || ''}
          @input=${(e: InputEvent) => update('css', (e.target as HTMLTextAreaElement).value || undefined)}
        ></textarea>
      </div>
    </section>
  `;
}

/**
 * A linked card's view of the template's custom animations: each one from the template, hidden here
 * (hidden_animations) or replaced by this card's own document with its id. The sync mark keeps the
 * whole list local (only the card's own).
 */
function renderTemplateAnimations(
  config: MagicCardConfig,
  docs: Array<Record<string, unknown>> | undefined,
  write: (next: MagicCardConfig) => void,
  syncCtx: SyncContext | undefined,
): TemplateResult | typeof nothing {
  if (!config.template || !docs?.length) return nothing;
  const own = new Set(animationDocList(config.custom_animations).map((d) => String(d.id)));
  const hidden = new Set(config.hidden_animations ?? []);
  const btn = (label: string, act: () => void) => html`<button type="button" class="btn btn-text btn-sm" @click=${act}>${label}</button>`;
  // compact markup: Lit keeps a template's whitespace in the bundle
  return html`<section class="group tpl-anims"><div class="field">
${renderFieldHead('Template animations', 'custom_animations', syncCtx)}
${config.not_synced?.includes('custom_animations')
  ? html`<p class="help">This card uses only its own custom_animations.</p>`
  : docs.map((d) => {
      const id = String(d.id);
      const mine = own.has(id);
      const off = !mine && hidden.has(id);
      return html`<div class="cond-head" data-id=${id}><span class="n">${d.name ?? id}
<span class="chip">${mine ? 'Changed on this card' : off ? 'Hidden' : 'From template'}</span></span>
${mine ? btn('Use template', () => write(dropOwnAnimation(config, id))) : btn(off ? 'Show' : 'Hide', () => write(setAnimationHidden(config, id, !off)))}</div>`;
    })}</div></section>`;
}

function renderConditionalAppearance(
  config: MagicCardConfig,
  update: CardUpdate,
  hass: HomeAssistant | undefined,
  themeOptions: ThemeOption[],
  rulesState: RulesState,
): TemplateResult {
  const rules = config.conditional_appearance || [];
  const writeRules = (next: ConditionalCardAppearance[]) => update('conditional_appearance', next);

  const addRule = () => {
    const id = generateId('appr');
    rulesState.expand(id);
    writeRules([...rules, { id, name: `Rule ${rules.length + 1}`, conditions: [], mode: 'every', overrides: {} }]);
  };
  const removeRule = (id: string) => {
    rulesState.collapse(id);
    writeRules(rules.filter((r) => r.id !== id));
  };
  const updateRule = (id: string, patch: Partial<ConditionalCardAppearance>) =>
    writeRules(rules.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return html`
    <section class="group">
      <div class="group-head">
        <ha-icon icon="mdi:palette-swatch-outline"></ha-icon>
        <h3>Conditional appearance</h3>
      </div>
      ${rules.length
        ? html`
            <p class="help">Override appearance fields while conditions match. Rules apply in order; later rules win.</p>
            ${rules.map((rule) => renderAppearanceRule(rule, hass, themeOptions, rulesState, updateRule, removeRule))}
            <div>
              <button type="button" class="btn btn-secondary btn-sm" @click=${addRule}>
                <ha-icon icon="mdi:plus"></ha-icon>Add appearance rule
              </button>
            </div>
          `
        : html`
            <div class="empty">
              <ha-icon icon="mdi:palette-swatch-outline"></ha-icon>
              <strong>No appearance rules</strong>
              <p>Change card fields, like background color, while conditions match.</p>
              <button type="button" class="btn btn-secondary btn-sm" @click=${addRule}>
                <ha-icon icon="mdi:plus"></ha-icon>Add appearance rule
              </button>
            </div>
          `}
    </section>
  `;
}

function renderAppearanceRule(
  rule: ConditionalCardAppearance,
  hass: HomeAssistant | undefined,
  themeOptions: ThemeOption[],
  rulesState: RulesState,
  updateRule: (id: string, patch: Partial<ConditionalCardAppearance>) => void,
  removeRule: (id: string) => void,
): TemplateResult {
  const expanded = rulesState.expanded.has(rule.id);
  const conditions = rule.conditions || [];
  const overrides = rule.overrides || {};
  const bodyId = `rule-body-${rule.id}`;

  const updateOverride = (key: keyof CardAppearanceOverrides, value: unknown) => {
    const next: Record<string, unknown> = { ...overrides };
    if (value === undefined || value === '' || value === null) delete next[key];
    else next[key] = value;
    updateRule(rule.id, { overrides: next as CardAppearanceOverrides });
  };
  const usePageTheme = overrides.use_page_theme;

  return html`
    <div class="cond rule">
      <div class="cond-head">
        <button
          type="button"
          class="icon-btn sm"
          aria-expanded=${expanded ? 'true' : 'false'}
          aria-controls=${bodyId}
          aria-label=${expanded ? 'Collapse rule' : 'Expand rule'}
          @click=${() => rulesState.toggle(rule.id)}
        >
          <ha-icon icon=${expanded ? 'mdi:chevron-down' : 'mdi:chevron-right'}></ha-icon>
        </button>
        <input
          class="input rule-name"
          type="text"
          aria-label="Rule name"
          placeholder="Rule name"
          .value=${rule.name || ''}
          @input=${(e: InputEvent) => updateRule(rule.id, { name: (e.target as HTMLInputElement).value })}
        />
        <span class="chip is-count">${conditions.length} cond.</span>
        <button
          type="button"
          class="icon-btn sm danger"
          aria-label="Remove rule"
          title="Remove rule"
          @click=${() => removeRule(rule.id)}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      ${expanded
        ? html`
            <div class="rule-body" id=${bodyId}>
              <div class="sub-head">Conditions</div>
              ${renderConditionsList(
                conditions,
                rule.mode || 'every',
                {
                  onAdd: () => updateRule(rule.id, { conditions: [...conditions, newCondition()] }),
                  onUpdate: (i, patch) =>
                    updateRule(rule.id, { conditions: conditions.map((c, j) => (j === i ? { ...c, ...patch } : c)) }),
                  onRemove: (i) => updateRule(rule.id, { conditions: conditions.filter((_c, j) => j !== i) }),
                  onMode: (mode) => updateRule(rule.id, { mode }),
                },
                hass,
                undefined,
                'rule',
              )}
              <div class="sub-head">Appearance overrides</div>
              <p class="help">Only fields you set override. Leave blank to fall through to the base settings.</p>
              ${renderColorField('Background color', overrides.background, (v) => updateOverride('background', v))}
              ${renderMediaField('Background image', overrides.background_image, (v) => updateOverride('background_image', v), hass, 'image')}
              ${renderToggleField('Override dashboard theme', usePageTheme === false, (v) => updateOverride('use_page_theme', v ? false : undefined))}
              ${usePageTheme === false
                ? renderSelectField('Card theme', overrides.theme || '__default__', themeOptions, (v) =>
                    updateOverride('theme', v === '__default__' ? undefined : v),
                  )
                : nothing}
              ${renderUnitField('Border radius', overrides.border_radius, (v) => updateOverride('border_radius', v))}
              ${renderBoxField('Padding', overrides.padding, (v) => updateOverride('padding', v), 'padding')}
              ${renderTextField('Box shadow', overrides.box_shadow, (v) => updateOverride('box_shadow', v))}
              ${renderUnitField('Card height', overrides.card_height, (v) => updateOverride('card_height', v))}
            </div>
          `
        : nothing}
    </div>
  `;
}

/** Which flow blocks are open and which flow is selected (canvas highlight); owned by the inspector. */
export interface FlowsState {
  expanded: ReadonlySet<string>;
  selected?: string | null;
  toggle: (key: string) => void;
  rekey: (from: string, to: string) => void;
}

/**
 * The card's Flows tab: animated lines between modules (src/editor/components/flows-editor.ts). The
 * flows editor writes the whole card (a pick may give a module an id); `write` makes it one edit.
 */
export function renderCardFlows(
  config: MagicCardConfig,
  write: (next: MagicCardConfig) => void,
  syncCtx: SyncContext | undefined,
  hass: HomeAssistant | undefined,
  flowsState: FlowsState,
): TemplateResult {
  return html`
    <section class="group">
      <div class="field">
        ${renderFieldHead('Flows', 'flows', syncCtx)}
        <mc-flows-editor
          .config=${config}
          .hass=${hass}
          .expanded=${flowsState.expanded}
          .selected=${flowsState.selected}
          .onToggle=${flowsState.toggle}
          .onRekey=${flowsState.rekey}
          .onChange=${write}
        ></mc-flows-editor>
      </div>
    </section>
  `;
}

/** Mockup: the card's Conditions tab holds Conditional appearance, then Display conditions. */
export function renderCardConditions(
  config: MagicCardConfig,
  writeDisplay: (next: DisplayConfig) => void,
  syncCtx: SyncContext | undefined,
  hass: HomeAssistant | undefined,
  update: CardUpdate,
  themeOptions: ThemeOption[],
  rulesState: RulesState,
): TemplateResult {
  const display: DisplayConfig = config.display || {};
  const conditions = display.conditions || [];
  const updateDisplay = (patch: Partial<DisplayConfig>) => writeDisplay({ ...display, ...patch });
  return html`
    ${renderConditionalAppearance(config, update, hass, themeOptions, rulesState)}
    <section class="group">
      <div class="group-head">
        <ha-icon icon="mdi:eye-outline"></ha-icon>
        <h3>Display conditions</h3>
      </div>
      ${renderConditionsList(
        conditions,
        display.mode || 'every',
        {
          onAdd: () => updateDisplay({ conditions: [...conditions, newCondition()] }),
          onUpdate: (i, patch) => updateDisplay({ conditions: conditions.map((c, j) => (j === i ? { ...c, ...patch } : c)) }),
          onRemove: (i) => updateDisplay({ conditions: conditions.filter((_c, j) => j !== i) }),
          onMode: (mode) => updateDisplay({ mode }),
        },
        hass,
        syncCtx ? { ...syncCtx, basePath: 'display' } : undefined,
        'card',
      )}
    </section>
  `;
}
