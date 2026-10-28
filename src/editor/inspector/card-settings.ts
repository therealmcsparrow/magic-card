import { html, nothing, TemplateResult } from 'lit';
import type {
  AnimationConfig,
  DesignConfig,
  RingConfig,
  CardAppearanceOverrides,
  ConditionalCardAppearance,
  DisplayCondition,
  DisplayConfig,
  FlowConfig,
  HomeAssistant,
  MagicCardConfig,
  PopupConfig,
  SeasonalSetting,
  ValueBackgroundConfig,
} from '../../types';
import type { FlowBudget } from '../../contracts/flow-look';
import type { ShapePatch } from '../components/shape-editor';
import type { SyncContext } from '../../utils/sync-path';
import { generateId } from '../../utils/id-generator';
import {
  renderFieldHead,
  renderBoxField,
  renderColorField,
  renderMediaField,
  renderNumberField,
  renderSelectField,
  renderTextField,
  renderToggleField,
  renderUnitField,
} from '../../utils/form-utils';
import { renderConditionsList } from './conditions-list';
import { readAnimations } from '../../anim-studio/entries';
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
import '../components/entity-picker';
import '../components/condition-row';
import { t } from '../i18n';
import { t as lt } from '../../i18n/labels';
import { BORDER_STYLE_OPTS } from '../../utils/css-property-options';
import type { PauseButtonCorner, PauseButtonMode } from '../../contracts/card-pause';
import { layerEditorNote } from '../layers/layer-editor-loader';
import { backdropHasProblem, startRuleLayers } from '../layers/bg-layers-model';
import type { BackgroundLayerConfig } from '../../contracts/bg-stack';

/** Border width units: a percentage border is not valid CSS, so the card frame ignores it. */
const BORDER_UNITS = ['px', 'em', 'rem', 'vw', 'vh'];

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
  return [{ label: t('card-editor.card-settings.dashboard-default'), value: '__default__' }, ...names.map((n) => ({ label: n, value: n }))];
}

const newCondition = (): DisplayCondition => ({ id: generateId('cond'), type: 'state', entity: '', state: '' });

/** The card's own entity (contract entity-scope 1.0.0): never part of a template, so no sync mark and no not_synced entry. */
export interface CardEntityField {
  /** Modules that follow it (the plain "N tiles follow it." line; hidden at 0). */
  following: number;
  /** Modules that need another kind of device than the card entity. */
  needing: number;
  /** Domains the card's modules need: listed first in the picker window. */
  preferred: string[];
  /** undefined removes the key. */
  onChange: (entity: string | undefined) => void;
}

function renderCardEntity(config: MagicCardConfig, hass: HomeAssistant | undefined, field: CardEntityField): TemplateResult {
  return html`
    <div class="mc-field">
      <div class="field-head"><label>${t('card-editor.card-settings.card-entity')}</label><span class="help">${t('card-editor.card-settings.optional')}</span></div>
      <mc-entity-picker
        data-card-entity
        .hass=${hass}
        .value=${typeof config.entity === 'string' ? config.entity : ''}
        .label=${t('card-editor.card-settings.card-entity')}
        .placeholder=${t('card-editor.card-settings.pick-a-device')}
        .strict=${true}
        .preferred=${field.preferred}
        .help=${`${t('card-editor.card-settings.the-device-this-card-is-for-tiles-follow')} ${t("card-editor.card-settings.magic-card-utils-templates-never-include")}`}
        @value-changed=${(e: CustomEvent<{ value: string }>) => field.onChange(e.detail.value === '' ? undefined : e.detail.value)}
      ></mc-entity-picker>
      ${field.following > 0
        ? html`<p class="help follow">${t('card-editor.card-settings.n', { n: field.following })}</p>`
        : nothing}
      ${field.needing > 0
        ? html`<p class="help follow needs">${t('card-editor.card-settings.n-2', { n: field.needing })}</p>`
        : nothing}
    </div>
  `;
}

export function renderCardGeneral(
  config: MagicCardConfig,
  update: CardUpdate,
  syncCtx: SyncContext | undefined,
  hass: HomeAssistant | undefined,
  canvas = false,
  entityField?: CardEntityField,
): TemplateResult {
  const usePageTheme = config.use_page_theme !== false;
  const popup = config.popup && typeof config.popup === 'object' ? config.popup : undefined;
  const popupOn = popup?.enabled === true;
  return html`
    <div class="group">
      ${renderTextField(t('card-editor.card-settings.name'), config.name, (v) => update('name', v), 'name', syncCtx)}
      ${entityField ? renderCardEntity(config, hass, entityField) : nothing}
      ${renderToggleField(
        t('card-editor.card-settings.use-dashboard-theme'),
        usePageTheme,
        (v) => update('use_page_theme', v),
        'use_page_theme',
        syncCtx,
        t('card-editor.card-settings.turn-off-to-pick-a-theme-for-this-card'),
      )}
      ${renderSelectField(
        t('card-editor.card-settings.card-theme'),
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
        <h3>${t('card-editor.card-settings.pop-up')}</h3>
      </div>
      ${renderToggleField(
        t('card-editor.card-settings.show-as-pop-up'),
        popupOn,
        (v) => update('popup', v ? { ...popup, enabled: true } : popup && Object.keys(popup).length > 1 ? { ...popup, enabled: false } : undefined),
        'popup',
        syncCtx,
        t('card-editor.card-settings.hidden-on-the-dashboard-opens-over-it'),
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
const DESIGN_KEYS = ['ring', 'shape', 'value_background', 'seasonal', 'background_layers'];

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
    writeRules([...rules, { id, name: t('card-editor.card-settings.rule-n', { n: rules.length + 1 }), conditions: [], mode: 'every', overrides: {} }]);
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
    src.rule && !(key in ov) ? html`<p class="help">${t('card-editor.card-settings.not-set-in-this-rule-default-applies')}</p>` : nothing;

  const str = (k: string) => src.get(k) as string | undefined;
  const fields: Record<string, () => TemplateResult | typeof nothing> = {
    card_height: () => html`${renderUnitField(t('card-editor.card-settings.card-height'), str('card_height'), (v) => src.set('card_height', v), 'card_height', sc, 'auto')}${unset('card_height')}`,
    padding: () => html`${renderBoxField(t('card-editor.card-settings.padding'), str('padding'), (v) => src.set('padding', v), 'padding', 'padding', sc)}${unset('padding')}`,
    margin: () => html`${renderBoxField(lt('Margin'), str('margin'), (v) => src.set('margin', v), 'margin', 'margin', sc)}${unset('margin')}`,
    border_width: () => html`${renderUnitField(lt('Border width'), str('border_width'), (v) => src.set('border_width', v), 'border_width', sc, t('card-editor.card-settings.theme-default'), BORDER_UNITS)}${unset('border_width')}`,
    border_style: () =>
      html`${renderSelectField(lt('Border style'), str('border_style') ?? '', [{ label: t('card-editor.card-settings.theme-default'), value: '' }, ...BORDER_STYLE_OPTS.map((o) => ({ label: lt(o.label), value: o.value }))], (v) => src.set('border_style', v || undefined), 'border_style', sc)}${unset('border_style')}`,
    border_color: () => html`${renderColorField(lt('Border colour'), str('border_color'), (v) => src.set('border_color', v), 'border_color', sc)}${unset('border_color')}`,
    opacity: () =>
      html`${renderNumberField(t('card-editor.card-settings.opacity'), src.get('opacity') as number | undefined, (v) => src.set('opacity', Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : undefined), { min: 0, max: 1, step: 0.05, placeholder: '1', optional: true }, 'opacity', sc)}
        <p class="help">${t('card-editor.card-settings.below-1-the-whole-card-fades-text')}</p>${unset('opacity')}`,
    backdrop_filter: () =>
      html`${renderTextField(lt('Backdrop filter'), str('backdrop_filter'), (v) => src.set('backdrop_filter', v), 'backdrop_filter', sc, { placeholder: 'blur(8px)', mono: true })}
        <p class="help">${t('card-editor.card-settings.blurs-what-is-behind-the-card-it-only')}</p>${unset('backdrop_filter')}`,
    background: () => html`${renderColorField(t('card-editor.card-settings.background-colour'), str('background'), (v) => src.set('background', v), 'background', sc, 'css')}${unset('background')}`,
    background_image: () =>
      html`${renderMediaField(t('card-editor.card-settings.background-image'), str('background_image'), (v) => src.set('background_image', v), hass, 'image', 'background_image', sc)}${unset('background_image')}`,
    border_radius: () => html`${renderUnitField(t('card-editor.card-settings.border-radius'), str('border_radius'), (v) => src.set('border_radius', v), 'border_radius', sc)}${unset('border_radius')}`,
    box_shadow: () =>
      html`${renderTextField(t('card-editor.card-settings.box-shadow'), str('box_shadow'), (v) => src.set('box_shadow', v), 'box_shadow', sc, { placeholder: t('card-editor.card-settings.theme-default'), mono: true })}${unset('box_shadow')}`,
    shape: () => html`<div class="field">
      ${lbl(t('card-editor.card-settings.shape'), 'shape')}
      <mc-shape-editor
        .shape=${src.get('shape') as never}
        .options=${src.get('shape_options') as never}
        .explicitNone=${src.rule ? !!config.shape : !!config.template}
        .target=${'card'}
        .hasRadius=${!!(src.get('border_radius') || (src.rule && config.border_radius))}
        .hasShadow=${!!(src.get('box_shadow') || (src.rule && config.box_shadow))}
        .popup=${config.popup?.enabled === true}
        .hass=${hass}
        .onChange=${(p: ShapePatch) => src.many({ shape: p.shape, shape_options: p.shape_options })}
      ></mc-shape-editor>
      ${unset('shape')}
    </div>`,
    value_background: () => html`<div class="field">
      ${lbl(t('card-editor.card-settings.value-background'), 'value_background')}
      <mc-value-bg-editor
        .value=${src.get('value_background') as ValueBackgroundConfig | undefined}
        .hass=${hass}
        .explicitNone=${src.rule ? !!config.value_background : !!config.template}
        .onChange=${(vb: ValueBackgroundConfig | undefined) => src.set('value_background', vb)}
      ></mc-value-bg-editor>
      ${unset('value_background')}
    </div>`,
    // Card backdrop (bg-stack 1.0.0): a rule that sets background_layers replaces the whole list; Hover never carries it
    style_hint: () =>
      !src.rule && (config.background_layers?.length ?? 0) > 0
        ? html`<p class="help" data-hint="backdrop">${t('card-editor.card-settings.card-backdrop-layers-sit-on-top-of-this')}</p>`
        : nothing,
    backdrop: () => {
      const own = src.rule ? 'background_layers' in ov : true;
      const layers = src.rule ? ov.background_layers : config.background_layers;
      const write = (list: BackgroundLayerConfig[]) => {
        if (src.rule) updateRule({ overrides: { ...ov, background_layers: list } });
        else update('background_layers', list.length ? list : undefined);
      };
      return html`<div class="field">
        ${lbl(t('card-editor.card-settings.layers'), 'background_layers')}
        ${layerEditorNote()}
        <mc-bg-layers
          .layers=${layers}
          .hass=${hass}
          .rule=${src.rule ? { own } : undefined}
          .lowPower=${config.layers_low_power === true}
          .cardEntity=${config.entity}
          .onWrite=${write}
          .onRule=${(act: 'start' | 'reset') => {
            if (act === 'start') write(startRuleLayers(config.background_layers));
            else {
              const rest = { ...ov };
              delete rest.background_layers;
              updateRule({ overrides: rest });
            }
          }}
          .onLowPower=${() => update('layers_low_power', config.layers_low_power ? undefined : true)}
        ></mc-bg-layers>
      </div>`;
    },
    ring: () => html`<div class="field">
      ${lbl(t('card-editor.card-settings.ring'), 'ring')}
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
      ${lbl(t('card-editor.card-settings.seasonal'), 'seasonal')}
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
            ${renderFieldHead(t('card-editor.card-settings.animations'), 'animations', syncCtx)}
            <mc-animation-list
              .animations=${readAnimations({ animations: config.animations })}
              .hass=${hass}
              .requireTriggerEntity=${true}
              .onChange=${(list: AnimationConfig[]) => update('animations', list.length ? list : undefined)}
            ></mc-animation-list>
          </div>`,
    template_animations: () => (src.rule || !write ? nothing : renderTemplateAnimations(config, templateDocs, write, syncCtx)),
    // viewer pause button (card-pause 2.0.0, Motion group): a card setting, not part of a rule's design
    pause_button: () => {
      if (src.rule) return nothing;
      const cur = config.pause_button === 'always' || config.pause_button === 'auto' ? config.pause_button : 'hidden';
      const modes: Array<[PauseButtonMode, string]> = [['auto', t('card-editor.card-settings.automatic')], ['always', t('card-editor.card-settings.always')], ['hidden', t('card-editor.card-settings.hidden')]];
      const pick = (m: PauseButtonMode) => update('pause_button', m === 'hidden' ? undefined : m);
      // roving tabindex and arrow keys, as the segmented control of the flows editor
      const onKey = (e: KeyboardEvent) => {
        const group = e.currentTarget as HTMLElement;
        const rtl = getComputedStyle(group).direction === 'rtl' ? -1 : 1;
        const step: Record<string, number> = { ArrowRight: rtl, ArrowDown: 1, ArrowLeft: -rtl, ArrowUp: -1 };
        const at = modes.findIndex(([m]) => m === cur);
        let to: number;
        if (e.key === 'Home') to = 0;
        else if (e.key === 'End') to = modes.length - 1;
        else if (Object.prototype.hasOwnProperty.call(step, e.key)) to = (at + step[e.key] + modes.length) % modes.length;
        else return;
        e.preventDefault();
        const next = modes[to][0];
        pick(next);
        requestAnimationFrame(() => group.querySelector<HTMLElement>(`[data-val="${next}"]`)?.focus());
      };
      return html`<div class="field" data-field="pause_button">
        ${renderFieldHead(t('card-editor.card-settings.pause-button'), 'pause_button', syncCtx)}
        <div class="seg full" role="radiogroup" aria-label=${t('card-editor.card-settings.pause-button')} aria-describedby="pause-button-help" @keydown=${onKey}>
          ${modes.map(([m, label]) => html`<button type="button" role="radio" data-val=${m} tabindex=${cur === m ? '0' : '-1'} aria-checked=${cur === m ? 'true' : 'false'} @click=${() => pick(m)}>${label}</button>`)}
        </div>
        <p class="help" id="pause-button-help">${cur === 'always' ? t('card-editor.card-settings.always-shown-even-when-nothing-moves') : cur === 'hidden' ? t("card-editor.card-settings.viewers-can-t-pause-the-motion-on-this") : t('card-editor.card-settings.shown-while-the-card-has-motion-viewers')}</p>
      </div>`;
    },
    pause_button_corner: () => {
      if (src.rule || (config.pause_button !== 'auto' && config.pause_button !== 'always')) return nothing; // unset counts as hidden
      const cur = config.pause_button_corner ?? 'bottom-left';
      const corners: Array<[PauseButtonCorner, string]> = [['bottom-left', t('card-editor.card-settings.bottom-left')], ['bottom-right', t('card-editor.card-settings.bottom-right')], ['top-left', t('card-editor.card-settings.top-left')], ['top-right', t('card-editor.card-settings.top-right')]];
      return html`<div class="field" data-field="pause_button_corner">
        <div class="field-head"><label for="pause-corner">${t('card-editor.card-settings.corner')}</label></div>
        <div class="select">
          <select class="input" id="pause-corner" @change=${(e: Event) => update('pause_button_corner', ((e.target as HTMLSelectElement).value as PauseButtonCorner) === 'bottom-left' ? undefined : ((e.target as HTMLSelectElement).value as PauseButtonCorner))}>
            ${corners.map(([c, label]) => html`<option value=${c} ?selected=${cur === c}>${label}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </div>`;
    },
    css: () =>
      src.rule
        ? nothing
        : html`<div class="field">
            ${renderFieldHead(t('card-editor.card-settings.custom-css'), 'css', syncCtx, {
              forId: 'card-css',
              reset: fieldReset(t('card-editor.card-settings.custom-css'), !!config.css, () => update('css', undefined)),
            })}
            <textarea
              class="input mono"
              id="card-css"
              rows="4"
              spellcheck="false"
              placeholder=${t("card-editor.card-settings.applied-to-the-card-s-content-e-g-letter")}
              .value=${config.css || ''}
              @input=${(e: InputEvent) => update('css', (e.target as HTMLTextAreaElement).value || undefined)}
            ></textarea>
          </div>`,
  };
  // [group id, name, open by default, [field, counted key][]]
  const groups: Array<[string, string, boolean, Array<[string, string?]>]> = [
    ['layout', t('card-editor.card-settings.layout'), true, [['card_height', 'card_height'], ['padding', 'padding'], ['margin', 'margin']]],
    ['motion', t('card-editor.card-settings.motion'), true, [['pause_button', 'pause_button'], ['pause_button_corner']]],
    [
      'style',
      t('card-editor.card-settings.style'),
      true,
      [['background', 'background'], ['background_image', 'background_image'], ['style_hint'], ['border_radius', 'border_radius'], ['border_width', 'border_width'], ['border_style', 'border_style'], ['border_color', 'border_color'], ['box_shadow', 'box_shadow'], ['opacity', 'opacity'], ['backdrop_filter', 'backdrop_filter'], ['shape', 'shape'], ['value_background', 'value_background']],
    ],
    ['backdrop', t('card-editor.card-settings.card-backdrop'), false, [['backdrop', 'background_layers']]],
    ['effects', t('card-editor.card-settings.effects'), false, [['ring', 'ring'], ['seasonal', 'seasonal'], ['animations', 'animations'], ['template_animations']]],
    ['advanced', t('card-editor.card-settings.advanced'), false, [['css', 'css']]],
  ];
  const renderGroup = ([id, name, defaultOpen, entries]: (typeof groups)[number]) => {
    const body = entries.map(([f]) => fields[f]()).filter((t) => t !== nothing);
    if (!body.length) return nothing;
    const count = entries.filter(([, k]) => k && isSet(src.get(k))).length;
    // the backdrop group is always at hand inside a rule (its first choice is made when the rule is created)
    const open = design.open.get(id) ?? (defaultOpen || count > 0 || (id === 'backdrop' && src.rule));
    return html`<section class="dgroup" data-group=${id}>
      <button type="button" class="dgroup-btn" aria-expanded=${open ? 'true' : 'false'} aria-controls=${`dg-${id}`} @click=${() => design.toggle(id, !open)}>
        <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
        <span class="nm">${name}</span>
        ${count > 0 ? html`<span class="chip is-count">${t('card-editor.card-settings.n-set', { n: count })}</span>` : nothing}
        ${id === 'backdrop' && !src.rule && backdropHasProblem(config.background_layers) ? html`<span class="chip is-warn" data-warn="backdrop">⚠ ${t('card-editor.card-settings.problem')}</span>` : nothing}
      </button>
      <div class="dgroup-body" id=${`dg-${id}`} ?hidden=${!open}>${body}</div>
    </section>`;
  };

  const n = rules.length;
  const help = hover
    ? t('card-editor.card-settings.applied-while-the-pointer-is-over-this')
    : n
      ? t('card-editor.card-settings.n-same-rules-as-the-conditions-tab-rules', { n })
      : t('card-editor.card-settings.add-a-rule-to-change-the-look-when');
  const mode = rule?.mode === 'any' ? 'any' : 'every';
  const conditions = rule?.conditions || [];
  const picker = html`<div class="rule-pick">
    <div class="field">
      <div class="field-head"><label for="design-view">${t('card-editor.card-settings.editing-design-for')}</label></div>
      <div class="select">
        <select class="input" id="design-view" aria-describedby="design-view-help" @change=${(e: Event) => design.set((e.target as HTMLSelectElement).value)}>
          <option value="default" ?selected=${!hover && !rule}>${t('card-editor.card-settings.default')}</option>
          <option value=${HOVER_VIEW} ?selected=${hover}>${t('card-editor.card-settings.hover')}</option>
          ${rules.map((r, i) => html`<option value=${r.id} ?selected=${r === rule}>${t('card-editor.card-settings.rule-name', { name: r.name || t('card-editor.card-settings.rule-n', { n: i + 1 }) })}</option>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
      <p class="help" id="design-view-help">${help}</p>
    </div>
    <div class="rule-actions">
      <button type="button" class="btn btn-text btn-sm" @click=${addRule}><ha-icon icon="mdi:plus"></ha-icon>${t('card-editor.card-settings.add-conditional-rule')}</button>
      ${n && openTab
        ? html`<button type="button" class="btn btn-text btn-sm" data-open-tab="conditions" @click=${() => openTab('conditions')}>${t('card-editor.card-settings.open-conditions')}</button>`
        : nothing}
    </div>
  </div>`;

  const ruleBox = rule
    ? html`<div class="rule">
        <div class="rule-head">
          <h3>${t('card-editor.card-settings.rule')}</h3>
          <button
            type="button"
            class="btn btn-text btn-sm danger-text"
            @click=${() => {
              writeRules(rules.filter((r) => r !== rule));
              design.set('default');
            }}
          ><ha-icon icon="mdi:delete-outline"></ha-icon>${t('card-editor.card-settings.delete-rule')}</button>
        </div>
        <div class="field">
          <div class="field-head"><label for="rule-name">${t('card-editor.card-settings.rule-name-2')}</label></div>
          <input class="input" id="rule-name" type="text" placeholder=${t('card-editor.card-settings.rule-name-2')} .value=${rule.name || ''} @input=${(e: InputEvent) => updateRule({ name: (e.target as HTMLInputElement).value })} />
        </div>
        <div class="field">
          <div class="field-head"><span class="lbl">${t('card-editor.card-settings.match')}</span></div>
          <div class="seg full" role="radiogroup" aria-label=${t('card-editor.card-settings.condition-match')}>
            ${(['every', 'any'] as const).map(
              (m) => html`<button type="button" role="radio" aria-checked=${mode === m ? 'true' : 'false'} @click=${() => updateRule({ mode: m })}>${m === 'every' ? t('card-editor.card-settings.all-match-and') : t('card-editor.card-settings.any-matches-or')}</button>`,
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
            : html`<p class="help">${t('card-editor.card-settings.no-conditions-yet-the-rule-applies-once')}</p>`}
          <div>
            <button type="button" class="btn btn-secondary btn-sm" @click=${() => updateRule({ conditions: [...conditions, newCondition()] })}>
              <ha-icon icon="mdi:plus"></ha-icon>${t('card-editor.card-settings.add-condition')}
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
              ${renderFieldHead(t('card-editor.card-settings.hover'), 'hover', syncCtx, { reset: fieldReset(t('card-editor.card-settings.hover'), !!config.hover, () => update('hover', undefined)) })}
            </div>
            <div class="field" data-hover-backdrop>
              <span class="lbl">${t('card-editor.card-settings.card-backdrop')}</span>
              <p class="help">${t('card-editor.card-settings.backgrounds-do-not-change-on-hover')}</p>
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
${renderFieldHead(t('card-editor.card-settings.template-animations'), 'custom_animations', syncCtx)}
${config.not_synced?.includes('custom_animations')
  ? html`<p class="help">${t('card-editor.card-settings.this-card-uses-only-its-own-custom')}</p>`
  : docs.map((d) => {
      const id = String(d.id);
      const mine = own.has(id);
      const off = !mine && hidden.has(id);
      return html`<div class="cond-head" data-id=${id}><span class="n">${d.name ?? id}
<span class="chip">${mine ? t('card-editor.card-settings.changed-on-this-card') : off ? t('card-editor.card-settings.hidden') : t('card-editor.card-settings.from-template')}</span></span>
${mine ? btn(t('card-editor.card-settings.use-template'), () => write(dropOwnAnimation(config, id))) : btn(off ? t('card-editor.card-settings.show') : t('card-editor.card-settings.hide'), () => write(setAnimationHidden(config, id, !off)))}</div>`;
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
    writeRules([...rules, { id, name: t('card-editor.card-settings.rule-n', { n: rules.length + 1 }), conditions: [], mode: 'every', overrides: {} }]);
  };
  const removeRule = (id: string) => {
    rulesState.collapse(id);
    writeRules(rules.filter((r) => r.id !== id));
  };
  const updateRule = (id: string, patch: Partial<ConditionalCardAppearance>) =>
    writeRules(rules.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const designLink = openTab
    ? html`<div><button type="button" class="btn btn-text btn-sm" data-open-tab="design" @click=${() => openTab('design')}>${t('card-editor.card-settings.open-design')}</button></div>`
    : nothing;
  return html`
    <section class="group">
      <div class="group-head">
        <ha-icon icon="mdi:palette-swatch-outline"></ha-icon>
        <h3>${t('card-editor.card-settings.conditional-appearance')}</h3>
      </div>
      ${rules.length
        ? html`
            <p class="help">${t('card-editor.card-settings.override-appearance-fields-while')}</p>
            ${designLink}
            ${rules.map((rule) => renderAppearanceRule(rule, hass, themeOptions, rulesState, updateRule, removeRule))}
            <div>
              <button type="button" class="btn btn-secondary btn-sm" @click=${addRule}>
                <ha-icon icon="mdi:plus"></ha-icon>${t('card-editor.card-settings.add-appearance-rule')}
              </button>
            </div>
          `
        : html`
            <div class="empty">
              <ha-icon icon="mdi:palette-swatch-outline"></ha-icon>
              <strong>${t('card-editor.card-settings.no-appearance-rules')}</strong>
              <p>${t('card-editor.card-settings.change-card-fields-like-background')}</p>
              ${designLink}
              <button type="button" class="btn btn-secondary btn-sm" @click=${addRule}>
                <ha-icon icon="mdi:plus"></ha-icon>${t('card-editor.card-settings.add-appearance-rule')}
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
          aria-label=${expanded ? t('card-editor.card-settings.collapse-rule') : t('card-editor.card-settings.expand-rule')}
          @click=${() => rulesState.toggle(rule.id)}
        >
          <ha-icon icon=${expanded ? 'mdi:chevron-down' : 'mdi:chevron-right'}></ha-icon>
        </button>
        <input
          class="input rule-name"
          type="text"
          aria-label=${t('card-editor.card-settings.rule-name-2')}
          placeholder=${t('card-editor.card-settings.rule-name-2')}
          .value=${rule.name || ''}
          @input=${(e: InputEvent) => updateRule(rule.id, { name: (e.target as HTMLInputElement).value })}
        />
        <span class="chip is-count">${t('card-editor.card-settings.n-cond', { n: conditions.length })}</span>
        ${designCount ? html`<span class="chip">${t('card-editor.card-settings.n-3', { n: designCount })}</span>` : nothing}
        <button
          type="button"
          class="icon-btn sm danger"
          aria-label=${t('card-editor.card-settings.remove-rule')}
          title=${t('card-editor.card-settings.remove-rule')}
          @click=${() => removeRule(rule.id)}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      ${expanded
        ? html`
            <div class="rule-body" id=${bodyId}>
              <div class="sub-head">${t('card-editor.card-settings.conditions')}</div>
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
              <div class="sub-head">${t('card-editor.card-settings.appearance-overrides')}</div>
              <p class="help">${t('card-editor.card-settings.only-fields-you-set-override-leave-blank')}</p>
              ${renderColorField(t('card-editor.card-settings.background-colour'), overrides.background, (v) => updateOverride('background', v), undefined, undefined, 'css')}
              ${renderMediaField(t('card-editor.card-settings.background-image'), overrides.background_image, (v) => updateOverride('background_image', v), hass, 'image')}
              ${renderToggleField(t('card-editor.card-settings.override-dashboard-theme'), usePageTheme === false, (v) => updateOverride('use_page_theme', v ? false : undefined))}
              ${usePageTheme === false
                ? renderSelectField(t('card-editor.card-settings.card-theme'), overrides.theme || '__default__', themeOptions, (v) =>
                    updateOverride('theme', v === '__default__' ? undefined : v),
                  )
                : nothing}
              ${renderUnitField(t('card-editor.card-settings.border-radius'), overrides.border_radius, (v) => updateOverride('border_radius', v))}
              ${renderBoxField(t('card-editor.card-settings.padding'), overrides.padding, (v) => updateOverride('padding', v), 'padding')}
              ${renderBoxField(lt('Margin'), overrides.margin as string | undefined, (v) => updateOverride('margin', v), 'margin')}
              ${renderUnitField(lt('Border width'), overrides.border_width as string | undefined, (v) => updateOverride('border_width', v), undefined, undefined, undefined, BORDER_UNITS)}
              ${renderSelectField(lt('Border style'), overrides.border_style ?? '', [{ label: t('card-editor.card-settings.theme-default'), value: '' }, ...BORDER_STYLE_OPTS.map((o) => ({ label: lt(o.label), value: o.value }))], (v) => updateOverride('border_style', v || undefined))}
              ${renderColorField(lt('Border colour'), overrides.border_color, (v) => updateOverride('border_color', v))}
              ${renderTextField(t('card-editor.card-settings.box-shadow'), overrides.box_shadow, (v) => updateOverride('box_shadow', v))}
              ${renderNumberField(t('card-editor.card-settings.opacity'), overrides.opacity as number | undefined, (v) => updateOverride('opacity', Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : undefined), { min: 0, max: 1, step: 0.05, placeholder: '1', optional: true })}
              ${renderTextField(lt('Backdrop filter'), overrides.backdrop_filter, (v) => updateOverride('backdrop_filter', v), undefined, undefined, { placeholder: 'blur(8px)', mono: true })}
              ${renderUnitField(t('card-editor.card-settings.card-height'), overrides.card_height, (v) => updateOverride('card_height', v))}
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
  /** Disclosure states of the flow blocks ("flowKey|section" -> open) and the look editor's sections ("flowKey|look:section"). */
  sections?: ReadonlyMap<string, boolean>;
  setSection?: (id: string, open: boolean) => void;
  /** One-level Undo snapshot per flow key (look editor, contract look-editor 1.0.0); session only, never written to YAML. */
  undoSnapshots?: ReadonlyMap<string, FlowConfig>;
  setUndoSnapshot?: (flowKey: string, snapshot: FlowConfig | undefined) => void;
  /** The studio canvas' flow budget, when the canvas has one. */
  budget?: FlowBudget;
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
        ${renderFieldHead(t('card-editor.card-settings.flows'), 'flows', syncCtx)}
        <mc-flows-editor
          .config=${config}
          .hass=${hass}
          .expanded=${flowsState.expanded}
          .selected=${flowsState.selected}
          .onToggle=${flowsState.toggle}
          .onRekey=${flowsState.rekey}
          .sections=${flowsState.sections}
          .onSection=${flowsState.setSection}
          .undoSnapshots=${flowsState.undoSnapshots}
          .onUndoSnapshot=${flowsState.setUndoSnapshot}
          .budget=${flowsState.budget}
          .onChange=${write}
        ></mc-flows-editor>
      </div>
    </section>
  `;
}

/** The card's Conditions tab holds Conditional appearance, then Display conditions. */
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
        <h3>${t('card-editor.card-settings.display-conditions')}</h3>
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
