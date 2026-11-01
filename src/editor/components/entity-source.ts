import { LitElement, html, css, nothing, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { EntitySourceInfo, EntitySourceKind } from '../../contracts/entity-scope';
import type { CardModule, HomeAssistant } from '../../types';
import { editorSystem } from '../../css/editor-stack';
import { editorKey } from '../../utils/editor-key';
import { rovingTarget } from '../../ui-kit/controllers/roving-focus';
import { readDirection } from '../../ui-kit/controllers/direction';
import { renderEntityField, renderFieldHead, renderToggleField } from '../../utils/form-utils';
import type { SyncContext } from '../../utils/sync-path';
import { m, t, type MessageIndex } from '../i18n';
import './entity-picker';

const SOURCES: Record<EntitySourceKind, MessageIndex> = { card: m('card-editor.entity-source.card'), row: m('card-editor.entity-source.row'), column: m('card-editor.entity-source.column'), tabs: m('card-editor.entity-source.tabs'), slides: m('card-editor.entity-source.slides') };

/** The nouns of the field, as plain words (no "domain", no "entity" jargon in the mismatch sentence). */
export const sourceWord = (kind: EntitySourceKind): string => t(SOURCES[kind]);

const KINDS: Record<string, MessageIndex> = {
  camera: m('card-editor.entity-source.a-camera'),
  light: m('card-editor.entity-source.a-light'),
  weather: m('card-editor.entity-source.a-weather-source'),
  sensor: m('card-editor.entity-source.a-sensor'),
  binary_sensor: m('card-editor.entity-source.a-sensor'),
  switch: m('card-editor.entity-source.a-switch'),
  input_select: m('card-editor.entity-source.a-list-of-options'),
  select: m('card-editor.entity-source.a-list-of-options'),
  other: m('card-editor.entity-source.a-different-kind-of-device'),
};

/** "a sensor", "a camera": what a Home Assistant domain is called in a sentence. */
export const kindNoun = (domain: string | undefined): string => t(KINDS[domain && domain in KINDS ? domain : 'other']);

/** "Attributes of light.kitchen (card)": which entity the attribute list comes from, when it is not the module's own. */
export function attributeCaption(scope?: EntitySourceInfo): string | undefined {
  const from = scope?.inherited;
  if (!scope || scope.choice !== 'inherit' || !from || !scope.effective) return undefined;
  return t('card-editor.entity-source.attributes-of-id-source', { id: scope.effective, source: sourceWord(from.from) });
}

/** Event: the user asked for Card settings > General (the Card entity field). */
export const OPEN_CARD_ENTITY = 'mc-open-card-entity';

type Choice = 'same' | 'pick' | 'none';

/**
 * The entity source of one module: Same as card / row / column, Pick one, No entity.
 * Three buttons with aria-pressed; arrow keys only move focus, Space or Enter selects, nothing moves
 * focus into the picker. One live region is always present and speaks only after a change by the user.
 * Writes through `onChange`: undefined = no `entity` key, 'none', or an id.
 */
@customElement('mc-entity-source')
export class EntitySource extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .src {
        display: grid;
        gap: 8px;
        min-width: 0;
      }
      .src .seg > button {
        white-space: normal;
        line-height: 1.2;
      }
      .src .seg > button[aria-pressed='true'] {
        background: var(--mc-surface);
        color: var(--mc-accent-ink);
      }
      .src .seg > button[aria-disabled='true'] {
        border: 1px dashed var(--mc-text-2);
        opacity: 0.55;
        cursor: default;
      }
      .src .line,
      .src .warn {
        display: flex;
        gap: 6px;
        margin: 0;
        font-size: 0.8125rem;
        overflow-wrap: anywhere;
      }
      .src .warn {
        font-size: 0.875rem;
        color: var(--mc-warn-ink);
      }
      .src ha-icon {
        --mdc-icon-size: 16px;
        flex: none;
      }
      .src .sub {
        margin: 0;
        padding-inline-start: 22px;
        color: var(--mc-text-2);
        overflow-wrap: anywhere;
      }
      .src .acts {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .src .link {
        padding: 0;
        border: 0;
        background: none;
        color: var(--mc-accent-ink);
        font: inherit;
        text-decoration: underline;
        cursor: pointer;
      }
      @media (pointer: coarse) {
        .src .seg > button,
        .src .acts .btn,
        .src .link {
          min-height: 44px;
        }
        .src .seg > button {
          font-size: 0.875rem;
        }
      }
    `,
  ];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) info!: EntitySourceInfo;
  /** The raw `entity` value of the module's config. */
  @property({ attribute: false }) value: unknown;
  /** Narrows the picker to one kind of device (camera, light, weather). */
  @property({ type: String }) domain = '';
  /** A layout module: shows what the choice means for the tiles inside. */
  @property({ type: Boolean }) layout = false;
  /** The module being edited; a new key resets the transient state. */
  @property({ type: String }) fieldKey = '';
  /** Writes the new `entity` (undefined removes the key). */
  @property({ attribute: false }) onChange: (entity: string | undefined) => void = () => undefined;

  @state() private _picking = false;
  @state() private _live = '';
  private _announced = '';

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('fieldKey')) {
      this._picking = false;
      this._live = '';
    }
  }

  // ── derived state ──

  private get _raw(): string | undefined {
    return typeof this.value === 'string' ? this.value : undefined;
  }

  private get _canFollow(): boolean {
    return !this.info.cardModule && !!this.info.inherited;
  }

  private get _pressed(): Choice | undefined {
    const i = this.info;
    if (i.choice === 'own') return 'pick';
    if (i.choice === 'none') return 'none';
    if (this._picking) return 'pick';
    return this._canFollow ? 'same' : undefined;
  }

  private get _showPicker(): boolean {
    return this._pressed === 'pick' || (this.info.choice === 'inherit' && !this._canFollow);
  }

  private _name(id: string): string {
    const s = this.hass?.states?.[id];
    return (s?.attributes?.friendly_name as string) || id;
  }

  private _mismatchText(): string {
    const i = this.info;
    if (!i.mismatch || !i.inherited) return '';
    const kind = kindNoun(i.domains?.length === 1 ? i.domains[0] : undefined);
    return t("card-editor.entity-source.this-tile-needs-kind-the-source-s-device", {
      kind,
      source: sourceWord(i.inherited.from),
      thing: kindNoun(i.inherited.id.split('.')[0]),
    });
  }

  // ── actions ──

  private _say(text: string): void {
    this._live = text;
  }

  private _same = (): void => {
    if (!this._canFollow) return;
    this._picking = false;
    if (this.value !== undefined) this.onChange(undefined);
    const inh = this.info.inherited!;
    const base = t('card-editor.entity-source.now-using-name-from-the-source', { name: this._name(inh.id), source: sourceWord(inh.from) });
    this._say(this.info.mismatch ? `${base} ${this._mismatchText()}` : base);
  };

  private _pick = (): void => {
    if (this._pressed === 'pick') return;
    this._picking = true;
    const inh = this.info.inherited;
    if (this.info.choice !== 'own' && inh && !this.info.mismatch && !this.info.cardModule) this.onChange(inh.id);
    else if (this.value !== undefined) this.onChange(undefined);
    this._say('');
  };

  private _none = (): void => {
    this._picking = false;
    if (this._raw !== 'none') this.onChange('none');
    this._say(t('card-editor.entity-source.no-entity'));
  };

  /** The mismatch button: opens the picker window, filtered to the kind this tile needs. */
  private _pickAndOpen = (): void => {
    this._pick();
    this._picking = true;
    // the button is gone once the picker shows: the field is the place focus returns to after Save or Cancel
    void this.updateComplete.then(() => {
      const picker = this.renderRoot.querySelector<HTMLElement & { open?: () => void; focusInput?: () => void }>('mc-entity-picker');
      picker?.focusInput?.();
      picker?.open?.();
    });
  };

  private _openCardSettings = (): void => {
    this.dispatchEvent(new CustomEvent(OPEN_CARD_ENTITY, { bubbles: true, composed: true }));
  };

  private _onPicked = (e: CustomEvent<{ value: string }>): void => {
    e.stopPropagation();
    const v = e.detail.value;
    this.onChange(v === '' ? undefined : v);
    if (v && this.hass?.states?.[v] && v !== this._announced) {
      this._announced = v;
      this._say(t('card-editor.entity-source.now-using-name', { name: this._name(v) }));
    }
  };

  private _onKey = (e: KeyboardEvent): void => {
    const group = e.currentTarget as HTMLElement;
    const btns = [...group.querySelectorAll<HTMLElement>('button')];
    const at = btns.indexOf(e.target as HTMLElement);
    const next = rovingTarget(e.key, at, btns.map(() => ({})), 'both', true, readDirection(group) === 'rtl');
    if (at < 0 || next < 0) return;
    e.preventDefault();
    btns.forEach((b, i) => (b.tabIndex = i === next ? 0 : -1));
    btns[next].focus();
  };

  private _onFocusOut = (e: FocusEvent): void => {
    const group = e.currentTarget as HTMLElement;
    if (!group.contains(e.relatedTarget as Node | null)) this._live = '';
  };

  // ── render ──

  private _link(sentence: string): TemplateResult {
    const [before, after] = sentence.split('\u0001');
    return html`${before}<button type="button" class="link" @click=${this._openCardSettings}>${t('card-editor.entity-source.card-settings-general')}</button>${after ?? ''}`;
  }

  private _hint(): TemplateResult | typeof nothing {
    const i = this.info;
    if (i.cardModule) return html`<p class="help" id="hint">${t("card-editor.entity-source.card-modules-do-not-follow-the-card-s")}</p>`;
    if (i.choice === 'none') {
      return html`<p class="help" id="hint">${this.layout ? t('card-editor.entity-source.tiles-inside-get-no-entity-unless-they') : t('card-editor.entity-source.this-tile-shows-no-device')}</p>`;
    }
    if (i.choice === 'own') return nothing;
    if (this._canFollow && !this._picking) {
      const inh = i.inherited!;
      const stateObj = this.hass?.states?.[inh.id];
      const known = !this.hass?.states || !!stateObj;
      const name = this._name(inh.id);
      const first = known ? name : t('card-editor.entity-source.name-not-found', { name });
      const detail = stateObj ? `${inh.id} · ${this.hass!.formatEntityState?.(stateObj) ?? stateObj.state}` : '';
      return html`
        <p class="line" id="hint"><ha-icon icon="mdi:link-variant" aria-hidden="true"></ha-icon><span>${t('card-editor.entity-source.from-source-name', { source: sourceWord(inh.from), name: first })}</span></p>
        ${stateObj ? html`<p class="sub mono">${detail}</p>` : nothing}
      `;
    }
    if (this._picking || i.cardModule) return nothing;
    // nothing to follow
    const msg = i.walled
      ? html`${t('card-editor.entity-source.a-row-column-or-layout-around-this-tile')}`
      : this._link(t("card-editor.entity-source.nothing-chosen-yet-to-use-the-card-s", { link: '\u0001' }));
    return html`<p class="help" id="hint">${msg}</p>`;
  }

  private _mismatch(): TemplateResult | typeof nothing {
    const i = this.info;
    if (!i.mismatch || this._picking || i.choice !== 'inherit') return nothing;
    const one = i.domains?.length === 1;
    return html`
      <p class="warn"><ha-icon icon="mdi:alert-outline" aria-hidden="true"></ha-icon><span>${this._mismatchText()}</span></p>
      <div class="acts">
        <button type="button" class="btn btn-secondary btn-sm" @click=${this._pickAndOpen}>${t('card-editor.entity-source.pick-kind', { kind: one ? kindNoun(i.domains![0]) : t('card-editor.entity-source.a-device') })}</button>
        <button type="button" class="btn btn-secondary btn-sm" @click=${this._none}>${t('card-editor.entity-source.no-entity-2')}</button>
      </div>
    `;
  }

  private _invalid(): TemplateResult | typeof nothing {
    const i = this.info;
    if (i.choice !== 'own' || !i.invalidOwn) return nothing;
    const raw = this._raw ?? '';
    const near = raw.trim().toLowerCase() === 'none';
    return html`
      <p class="warn"><ha-icon icon="mdi:alert-outline" aria-hidden="true"></ha-icon><span>${near
        ? t('card-editor.entity-source.did-you-mean-no-entity')
        : t('card-editor.entity-source.that-is-not-an-entity-id-it-needs-a-dot')}</span></p>
      ${near ? html`<div class="acts"><button type="button" class="btn btn-secondary btn-sm" @click=${this._none}>${t('card-editor.entity-source.use-no-entity')}</button></div>` : nothing}
    `;
  }

  protected render(): TemplateResult {
    const i = this.info;
    if (!i) return html``;
    const pressed = this._pressed;
    const canFollow = this._canFollow;
    const options: Array<{ id: Choice; label: string; on: () => void; disabled?: boolean }> = [];
    if (!i.cardModule) {
      options.push({
        id: 'same',
        label: t('card-editor.entity-source.same-as-source', { source: sourceWord(i.inherited?.from ?? 'card') }),
        on: this._same,
        disabled: !canFollow,
      });
    }
    options.push({ id: 'pick', label: t('card-editor.entity-source.pick-one'), on: this._pick }, { id: 'none', label: t('card-editor.entity-source.no-entity-2'), on: this._none });
    const tabbable = options.find((o) => o.id === pressed) ?? options.find((o) => !o.disabled) ?? options[0];
    const hint = this._hint();
    return html`
      <div class="src">
        <div class="seg full" role="group" aria-label=${t('card-editor.entity-source.entity-source')} @keydown=${this._onKey} @focusout=${this._onFocusOut}>
          ${options.map((o) => html`<button
            type="button"
            data-choice=${o.id}
            aria-pressed=${pressed === o.id ? 'true' : 'false'}
            aria-disabled=${o.disabled ? 'true' : nothing}
            aria-describedby=${o.disabled && hint !== nothing ? 'hint' : nothing}
            tabindex=${o === tabbable ? '0' : '-1'}
            @click=${o.on}
          >${o.label}</button>`)}
        </div>
        ${hint}
        ${this._mismatch()}
        ${this._showPicker
          ? html`<mc-entity-picker
              .hass=${this.hass}
              .value=${i.choice === 'own' ? this._raw ?? '' : ''}
              .domain=${this.domain}
              .label=${t('card-editor.entity-source.own-entity')}
              .placeholder=${t('card-editor.entity-source.pick-a-device')}
              @value-changed=${this._onPicked}
            ></mc-entity-picker>`
          : nothing}
        ${this._invalid()}
        <div class="sr-only" role="status" aria-live="polite" aria-atomic="true">${this._live}</div>
      </div>
    `;
  }
}

/** Layout modules: they can share their own entity with the modules inside. */
const LAYOUT_TYPES: readonly string[] = ['horizontal', 'vertical', 'row', 'tabs', 'slider-layout'];

/** A layout module, or a grid row / column / row module column (those have no `type`). */
const isLayout = (c: CardModule): boolean => !c.type || LAYOUT_TYPES.includes(c.type);

export interface EntitySourceFieldOptions {
  /** Narrows the picker (camera, light, weather). */
  domain?: string;
  syncCtx?: SyncContext;
  /** How a new entity lands in the config (default: set or remove the key). */
  write?: (c: CardModule, entity: string | undefined) => CardModule;
}

/** The module's `entity` with the key removed when the entity is undefined. */
export function withEntityKey(c: CardModule, entity: string | undefined): CardModule {
  const next = { ...c } as Record<string, unknown>;
  if (entity === undefined) delete next.entity;
  else next.entity = entity;
  return next as unknown as CardModule;
}

/**
 * The module's entity field (module-editor 1.2.0): the entity source control with `scope`; without a
 * scope (a host that does not pass one) the plain entity picker, as before.
 */
export function renderEntitySourceField(
  label: string,
  c: CardModule,
  onChange: (m: CardModule) => void,
  hass: HomeAssistant | undefined,
  scope: EntitySourceInfo | undefined,
  opts: EntitySourceFieldOptions = {},
): TemplateResult {
  const write = opts.write ?? withEntityKey;
  if (!scope) {
    return renderEntityField(label, c.entity, (v) => onChange(write(c, v)), hass, opts.domain, 'entity', opts.syncCtx);
  }
  return html`
    <div class="mc-field">
      ${renderFieldHead(label, 'entity', opts.syncCtx)}
      <mc-entity-source
        .hass=${hass}
        .info=${scope}
        .value=${c.entity}
        .domain=${opts.domain ?? ''}
        .layout=${isLayout(c)}
        .fieldKey=${editorKey(c)}
        .onChange=${(v: string | undefined) => onChange(write(c, v))}
      ></mc-entity-source>
    </div>
  `;
}

/** The entity field the registry puts in front of General for editors without their own (layouts, clock, separator, video background, card module), and a layout's share switch. */
export function renderEntityBlock(
  c: CardModule,
  hass: HomeAssistant | undefined,
  onChange: (m: CardModule) => void,
  scope: EntitySourceInfo,
  syncCtx?: SyncContext,
): TemplateResult {
  const share = isLayout(c) && scope.choice === 'own' && !scope.invalidOwn;
  return html`
    <div class="mc-tab-content">
      ${renderEntitySourceField(t('card-editor.entity-source.entity'), c, onChange, hass, scope, { syncCtx })}
      ${share
        ? renderToggleField(
            t('card-editor.entity-source.share-with-tiles-inside'),
            (c as { share_entity?: boolean }).share_entity === true,
            (v) => onChange({ ...c, share_entity: v } as CardModule),
            'share_entity',
            syncCtx,
            t('card-editor.entity-source.tiles-inside-follow-this-entity-unless'),
          )
        : nothing}
    </div>
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-entity-source': EntitySource;
  }
}
