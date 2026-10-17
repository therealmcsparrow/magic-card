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
import '../components/condition-row';

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

/** Which design the card Design tab edits ('default', '__hover__' or a rule id) and which groups the user toggled; owned by the inspector so it survives re-renders. */
export interface DesignViewState {
  view: string;
  set: (view: string) => void;
  open: ReadonlyMap<string, boolean>;
  toggle: (group: string, open: boolean) => void;
}

const HOVER_VIEW = '__hover__';
const NO_VIEW: DesignViewState = { view: 'default', set: () => {}, open: new Map(), toggle: () => {} };

type Ov = Record<string, unknown>;

/** The design keys a rule can hold beyond the legacy appearance fields (counted on the Conditions tab). */
const DESIGN_KEYS = ['ring', 'shape', 'value_background', 'seasonal'];

/** Where a field reads and writes: the card itself (Default) or one rule's overrides. */
interface DesignSource {
  rule: boolean;
  get: (key: string) => unknown;
  /** undefined, '' and null remove the key. */
  set: (key: string, value: unknown) => void;
  many: (updates: Ov) => void;
  sync?: SyncContext;
}

const isSet = (v: unknown) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length);

export function renderCardDesign(
  config: MagicCardConfig,
  update: CardUpdate,
  syncCtx: SyncContext | undefined,
  hass: HomeAssistant | undefined,
  patch?: CardPatch,
  templateDocs?: Array<Record<string, unknown>>,
  write?: (next: MagicCardConfig) => void,
  design: DesignViewState = NO_VIEW,
  openTab?: (tab: string) => void,
): TemplateResult {
  const rules = config.conditional_appearance || [];
  const hover = design.view === HOVER_VIEW;
  const rule = rules.find((r) => r.id === design.view);
  const writeRules = (next: ConditionalCardAppearance[]) => update('conditional_appearance', next);
  const addRule = () => {
    const id = generateId('appr');
    writeRules([...rules, { id, name: `Rule ${rules.length + 1}`, conditions: [], mode: 'every', overrides: {} }]);
    design.set(id);
  };
  const updateRule = (patchRule: Partial<ConditionalCardAppearance>) =>
    writeRules(rules.map((r) => (r === rule ? { ...r, ...patchRule } : r)));

  const ov = (rule?.overrides || {}) as Ov;
  const applyOv = (updates: Ov) => {
    const next: Ov = { ...ov };
    for (const [k, v] of Object.entries(updates)) {
      if (!isSet(v)) delete next[k];
      else next[k] = v;
    }
    updateRule({ overrides: next as CardAppearanceOverrides });
  };
  const src: DesignSource = rule
    ? { rule: true, get: (k) => ov[k], set: (k, v) => applyOv({ [k]: v }), many: applyOv }
    : {
        rule: false,
        get: (k) => (config as unknown as Ov)[k],
        set: (k, v) => update(k as keyof MagicCardConfig, v),
        many: (u) => {
          if (patch) patch(u as never, 'shape');
          else for (const [k, v] of Object.entries(u)) update(k as keyof MagicCardConfig, v);
        },
        sync: syncCtx,
      };
  const sc = src.sync;
  const lbl = (label: string, key: string, forId?: string) =>
    renderFieldHead(label, key, sc, { forId, reset: src.rule ? fieldReset(label, key in ov, () => src.set(key, undefined)) : undefined });
  const unset = (key: string) =>
    src.rule && !(key in ov) ? html`<p class="help">Not set in this rule: Default applies.</p>` : nothing;

  const str = (k: string) => src.get(k) as string | undefined;
  const fields: Record<string, () => TemplateResult | typeof nothing> = {
    card_height: () => html`${renderUnitField('Card height', str('card_height'), (v) => src.set('card_height', v), 'card_height', sc, 'auto')}${unset('card_height')}`,
    padding: () => html`${renderBoxField('Padding', str('padding'), (v) => src.set('padding', v), 'padding', 'padding', sc)}${unset('padding')}`,
    background: () => html`${renderColorField('Background color', str('background'), (v) => src.set('background', v), 'background', sc, 'css')}${unset('background')}`,
    background_image: () =>
      html`${renderMediaField('Background image', str('background_image'), (v) => src.set('background_image', v), hass, 'image', 'background_image', sc)}${unset('background_image')}`,
    border_radius: () => html`${renderUnitField('Border radius', str('border_radius'), (v) => src.set('border_radius', v), 'border_radius', sc)}${unset('border_radius')}`,
    box_shadow: () =>
      html`${renderTextField('Box shadow', str('box_shadow'), (v) => src.set('box_shadow', v), 'box_shadow', sc, { placeholder: 'Theme default', mono: true })}${unset('box_shadow')}`,
    shape: () => html`<div class="field">
      ${lbl('Shape', 'shape')}
      <mc-shape-editor
        .shape=${src.get('shape') as never}
        .options=${src.get('shape_options') as never}
        .explicitNone=${src.rule ? !!config.shape : !!config.template}
        .target=${'card'}
        .hasRadius=${!!(src.get('border_radius') || (src.rule && config.border_radius))}
        .hasShadow=${!!(src.get('box_shadow') || (src.rule && config.box_shadow))}
        .popup=${config.popup?.enabled === true}
        .onChange=${(p: ShapePatch) => src.many({ shape: p.shape, shape_options: p.shape_options })}
      ></mc-shape-editor>
      ${unset('shape')}
    </div>`,
    value_background: () => html`<div class="field">
      ${lbl('Value background', 'value_background')}
      <mc-value-bg-editor
        .value=${src.get('value_background') as ValueBackgroundConfig | undefined}
        .hass=${hass}
        .explicitNone=${src.rule ? !!config.value_background : !!config.template}
        .onChange=${(vb: ValueBackgroundConfig | undefined) => src.set('value_background', vb)}
      ></mc-value-bg-editor>
      ${unset('value_background')}
    </div>`,
    ring: () => html`<div class="field">
      ${lbl('Ring', 'ring')}
      <mc-ring-editor
        .ring=${src.get('ring') as RingConfig | undefined}
        .hass=${hass}
        .requireEntity=${true}
        .clipped=${true}
        .onChange=${(ring: RingConfig | undefined) => src.set('ring', ring === undefined && src.rule && config.ring ? {} : ring)}
      ></mc-ring-editor>
      ${unset('ring')}
    </div>`,
    seasonal: () => html`<div class="field">
      ${lbl('Seasonal', 'seasonal')}
      <mc-seasonal-editor
        .value=${src.get('seasonal') as SeasonalSetting | undefined}
        .hass=${hass}
        .explicitNone=${src.rule ? !!config.seasonal : !!config.template}
        .onChange=${(next: SeasonalSetting | undefined) => src.set('seasonal', next)}
      ></mc-seasonal-editor>
      ${unset('seasonal')}
    </div>`,
    animations: () =>
      src.rule
        ? nothing
        : html`<div class="field">
            ${renderFieldHead('Animations', 'animations', syncCtx)}
            <mc-animation-list
              .animations=${readAnimations({ animations: config.animations })}
              .hass=${hass}
              .requireTriggerEntity=${true}
              .onChange=${(list: AnimationConfig[]) => update('animations', list.length ? list : undefined)}
            ></mc-animation-list>
          </div>`,
    template_animations: () => (src.rule || !write ? nothing : renderTemplateAnimations(config, templateDocs, write, syncCtx)),
    css: () =>
      src.rule
        ? nothing
        : html`<div class="field">
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
          </div>`,
  };
  // [group id, name, open by default, [field, counted key][]]
  const groups: Array<[string, string, boolean, Array<[string, string?]>]> = [
    ['layout', 'Layout', true, [['card_height', 'card_height'], ['padding', 'padding']]],
    [
      'style',
      'Style',
      true,
      [['background', 'background'], ['background_image', 'background_image'], ['border_radius', 'border_radius'], ['box_shadow', 'box_shadow'], ['shape', 'shape'], ['value_background', 'value_background']],
    ],
    ['effects', 'Effects', false, [['ring', 'ring'], ['seasonal', 'seasonal'], ['animations', 'animations'], ['template_animations']]],
    ['advanced', 'Advanced', false, [['css', 'css']]],
  ];
  const renderGroup = ([id, name, defaultOpen, entries]: (typeof groups)[number]) => {
    const body = entries.map(([f]) => fields[f]()).filter((t) => t !== nothing);
    if (!body.length) return nothing;
    const count = entries.filter(([, k]) => k && isSet(src.get(k))).length;
    const open = design.open.get(id) ?? (defaultOpen || count > 0);
    return html`<section class="dgroup" data-group=${id}>
      <button type="button" class="dgroup-btn" aria-expanded=${open ? 'true' : 'false'} aria-controls=${`dg-${id}`} @click=${() => design.toggle(id, !open)}>
        <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
        <span class="nm">${name}</span>
        ${count > 0 ? html`<span class="chip is-count">${count} set</span>` : nothing}
      </button>
      <div class="dgroup-body" id=${`dg-${id}`} ?hidden=${!open}>${body}</div>
    </section>`;
  };

  const n = rules.length;
  const help = hover
    ? 'Applied while the pointer is over this card, on top of Default and matching rules.'
    : n
      ? `${n} conditional rule${n === 1 ? '' : 's'}. Same rules as the Conditions tab. Rules override Default only while their conditions match. A later rule wins over an earlier one.`
      : 'Add a rule to change the look when conditions match.';
  const mode = rule?.mode === 'any' ? 'any' : 'every';
  const conditions = rule?.conditions || [];
  const picker = html`<div class="rule-pick">
    <div class="field">
      <div class="field-head"><label for="design-view">Editing design for</label></div>
      <div class="select">
        <select class="input" id="design-view" aria-describedby="design-view-help" @change=${(e: Event) => design.set((e.target as HTMLSelectElement).value)}>
          <option value="default" ?selected=${!hover && !rule}>Default</option>
          <option value=${HOVER_VIEW} ?selected=${hover}>Hover</option>
          ${rules.map((r, i) => html`<option value=${r.id} ?selected=${r === rule}>Rule: ${r.name || `Rule ${i + 1}`}</option>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
      <p class="help" id="design-view-help">${help}</p>
    </div>
    <div class="rule-actions">
      <button type="button" class="btn btn-text btn-sm" @click=${addRule}><ha-icon icon="mdi:plus"></ha-icon>Add conditional rule</button>
      ${n && openTab
        ? html`<button type="button" class="btn btn-text btn-sm" data-open-tab="conditions" @click=${() => openTab('conditions')}>Open Conditions</button>`
        : nothing}
    </div>
  </div>`;

  const ruleBox = rule
    ? html`<div class="rule">
        <div class="rule-head">
          <h3>Rule</h3>
          <button
            type="button"
            class="btn btn-text btn-sm danger-text"
            @click=${() => {
              writeRules(rules.filter((r) => r !== rule));
              design.set('default');
            }}
          ><ha-icon icon="mdi:delete-outline"></ha-icon>Delete rule</button>
        </div>
        <div class="field">
          <div class="field-head"><label for="rule-name">Rule name</label></div>
          <input class="input" id="rule-name" type="text" placeholder="Rule name" .value=${rule.name || ''} @input=${(e: InputEvent) => updateRule({ name: (e.target as HTMLInputElement).value })} />
        </div>
        <div class="field">
          <div class="field-head"><span class="lbl">Match</span></div>
          <div class="seg full" role="radiogroup" aria-label="Condition match">
            ${(['every', 'any'] as const).map(
              (m) => html`<button type="button" role="radio" aria-checked=${mode === m ? 'true' : 'false'} @click=${() => updateRule({ mode: m })}>${m === 'every' ? 'All match (AND)' : 'Any matches (OR)'}</button>`,
            )}
          </div>
        </div>
        <div class="rule-conds">
          ${conditions.length
            ? conditions.map(
                (cond, i) => html`<mc-condition-row
                  .condition=${cond}
                  .hass=${hass}
                  .onChange=${(u: Partial<DisplayCondition>) => updateRule({ conditions: conditions.map((c, j) => (j === i ? { ...c, ...u } : c)) })}
                  .onRemove=${() => updateRule({ conditions: conditions.filter((_c, j) => j !== i) })}
                ></mc-condition-row>`,
              )
            : html`<p class="help">No conditions yet. The rule applies once a condition is added and matches.</p>`}
          <div>
            <button type="button" class="btn btn-secondary btn-sm" @click=${() => updateRule({ conditions: [...conditions, newCondition()] })}>
              <ha-icon icon="mdi:plus"></ha-icon>Add condition
            </button>
          </div>
        </div>
      </div>`
    : nothing;

  return html`
    <div class="design-tab">
      ${picker} ${ruleBox}
      ${hover
        ? html`<section class="group">
            <div class="field">
              ${renderFieldHead('Hover', 'hover', syncCtx, { reset: fieldReset('Hover', !!config.hover, () => update('hover', undefined)) })}
            </div>
            <mc-design-panel
              class="card-hover"
              .design=${{ hover: config.hover } as DesignConfig}
              .hass=${hass}
              .target=${'card'}
              .hoverOnly=${true}
              .onChange=${(u: Record<string, unknown>) => update('hover', u.hover)}
            ></mc-design-panel>
          </section>`
        : html`<div class="dgroups">${groups.map(renderGroup)}</div>`}
    </div>
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
  openTab?: (tab: string) => void,
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

  const designLink = openTab
    ? html`<div><button type="button" class="btn btn-text btn-sm" data-open-tab="design" @click=${() => openTab('design')}>Open Design</button></div>`
    : nothing;
  return html`
    <section class="group">
      <div class="group-head">
        <ha-icon icon="mdi:palette-swatch-outline"></ha-icon>
        <h3>Conditional appearance</h3>
      </div>
      ${rules.length
        ? html`
            <p class="help">Override appearance fields while conditions match. Rules apply in order; later rules win.</p>
            ${designLink}
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
              <p>Change card fields, like background color, while conditions match. For ring, shape and more, use a design rule on the Design tab.</p>
              ${designLink}
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
  const designCount = DESIGN_KEYS.filter((k) => k in overrides).length;

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
        ${designCount ? html`<span class="chip">+ ${designCount} design field${designCount === 1 ? '' : 's'}</span>` : nothing}
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
              ${renderColorField('Background color', overrides.background, (v) => updateOverride('background', v), undefined, undefined, 'css')}
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
  openTab?: (tab: string) => void,
): TemplateResult {
  const display: DisplayConfig = config.display || {};
  const conditions = display.conditions || [];
  const updateDisplay = (patch: Partial<DisplayConfig>) => writeDisplay({ ...display, ...patch });
  return html`
    ${renderConditionalAppearance(config, update, hass, themeOptions, rulesState, openTab)}
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
