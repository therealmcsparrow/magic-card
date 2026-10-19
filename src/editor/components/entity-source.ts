import { LitElement, html, css, nothing, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { EntitySourceInfo, EntitySourceKind } from '../../contracts/entity-scope';
import type { CardModule, HomeAssistant } from '../../types';
import { editorSystem } from '../../css/editor-stack';
import { editorKey } from '../../utils/editor-key';
import { renderEntityField, renderFieldHead, renderToggleField } from '../../utils/form-utils';
import type { SyncContext } from '../../utils/sync-path';
import { m, t, type MessageId } from '../i18n';
import './entity-picker';

const SOURCES: Record<EntitySourceKind, MessageId> = { card: m('card'), row: m('row'), column: m('column'), tabs: m('tabs'), slides: m('slides') };

/** The nouns of the field, as plain words (no "domain", no "entity" jargon in the mismatch sentence). */
export const sourceWord = (kind: EntitySourceKind): string => t(SOURCES[kind]);

const KINDS: Record<string, MessageId> = {
  camera: m('a camera'),
  light: m('a light'),
  weather: m('a weather source'),
  sensor: m('a sensor'),
  binary_sensor: m('a sensor'),
  switch: m('a switch'),
  input_select: m('a list of options'),
  select: m('a list of options'),
  other: m('a different kind of device'),
};

/** "a sensor", "a camera": what a Home Assistant domain is called in a sentence. */
export const kindNoun = (domain: string | undefined): string => t(KINDS[domain && domain in KINDS ? domain : 'other']);

/** "Attributes of light.kitchen (card)": which entity the attribute list comes from, when it is not the module's own. */
export function attributeCaption(scope?: EntitySourceInfo): string | undefined {
  const from = scope?.inherited;
  if (!scope || scope.choice !== 'inherit' || !from || !scope.effective) return undefined;
  return t('Attributes of {id} ({source})', { id: scope.effective, source: sourceWord(from.from) });
}

/** Event: the user asked for Card settings > General (the Card entity field). */
export const OPEN_CARD_ENTITY = 'mc-open-card-entity';

type Choice = 'same' | 'pick' | 'none';

/**
 * The entity source of one module: Same as card / row / column, Pick one, No entity (designer R2-R8).
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
        padding-left: 22px;
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
    return t("This tile needs {kind}. The {source}'s device is {thing}, so the tile stays empty.", {
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
    const base = t('Now using {name} from the {source}.', { name: this._name(inh.id), source: sourceWord(inh.from) });
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
    this._say(t('No entity.'));
  };

  /** The mismatch button: opens the picker window, filtered to the kind this tile needs. */
  private _pickAndOpen = (): void => {
    this._pick();
    this._picking = true;
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement & { open?: () => void }>('mc-entity-picker')?.open?.());
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
      this._say(t('Now using {name}.', { name: this._name(v) }));
    }
  };

  private _onKey = (e: KeyboardEvent): void => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    const btns = [...(e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('button')];
    const at = btns.indexOf(e.target as HTMLElement);
    if (at < 0) return;
    e.preventDefault();
    const n = btns.length;
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (at + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + n) % n;
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
    return html`${before}<button type="button" class="link" @click=${this._openCardSettings}>${t('Card settings > General')}</button>${after ?? ''}`;
  }

  private _hint(): TemplateResult | typeof nothing {
    const i = this.info;
    if (i.cardModule) return html`<p class="help" id="hint">${t("Card modules do not follow the card's entity.")}</p>`;
    if (i.choice === 'none') {
      return html`<p class="help" id="hint">${this.layout ? t('Tiles inside get no entity unless they pick one.') : t('This tile shows no device.')}</p>`;
    }
    if (i.choice === 'own') return nothing;
    if (this._canFollow && !this._picking) {
      const inh = i.inherited!;
      const stateObj = this.hass?.states?.[inh.id];
      const known = !this.hass?.states || !!stateObj;
      const name = this._name(inh.id);
      const first = known ? name : t('{name} (not found)', { name });
      const detail = stateObj ? `${inh.id} · ${this.hass!.formatEntityState?.(stateObj) ?? stateObj.state}` : '';
      return html`
        <p class="line" id="hint"><ha-icon icon="mdi:link-variant" aria-hidden="true"></ha-icon><span>${t('From {source}: {name}', { source: sourceWord(inh.from), name: first })}</span></p>
        ${stateObj ? html`<p class="sub mono">${detail}</p>` : nothing}
      `;
    }
    if (this._picking || i.cardModule) return nothing;
    // nothing to follow
    const msg = i.walled
      ? html`${t('A layout around this tile has No entity, so there is nothing to follow.')}`
      : this._link(t("Nothing chosen yet. To use the card's device, set it in {link}.", { link: '\u0001' }));
    return html`<p class="help" id="hint">${msg}</p>`;
  }

  private _mismatch(): TemplateResult | typeof nothing {
    const i = this.info;
    if (!i.mismatch || this._picking || i.choice !== 'inherit') return nothing;
    const one = i.domains?.length === 1;
    return html`
      <p class="warn"><ha-icon icon="mdi:alert-outline" aria-hidden="true"></ha-icon><span>${this._mismatchText()}</span></p>
      <div class="acts">
        <button type="button" class="btn btn-secondary btn-sm" @click=${this._pickAndOpen}>${t('Pick {kind}', { kind: one ? kindNoun(i.domains![0]) : t('a device') })}</button>
        <button type="button" class="btn btn-secondary btn-sm" @click=${this._none}>${t('No entity')}</button>
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
        ? t('Did you mean No entity?')
        : t('That is not an entity id. It needs a dot, like light.kitchen. To switch the entity off, use No entity.')}</span></p>
      ${near ? html`<div class="acts"><button type="button" class="btn btn-secondary btn-sm" @click=${this._none}>${t('Use No entity')}</button></div>` : nothing}
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
        label: t('Same as {source}', { source: sourceWord(i.inherited?.from ?? 'card') }),
        on: this._same,
        disabled: !canFollow,
      });
    }
    options.push({ id: 'pick', label: t('Pick one'), on: this._pick }, { id: 'none', label: t('No entity'), on: this._none });
    const tabbable = options.find((o) => o.id === pressed) ?? options.find((o) => !o.disabled) ?? options[0];
    const hint = this._hint();
    return html`
      <div class="src">
        <div class="seg full" role="group" aria-label=${t('Entity source')} @keydown=${this._onKey} @focusout=${this._onFocusOut}>
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
              .label=${t('Own entity')}
              .placeholder=${t('Pick a device')}
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
        .layout=${LAYOUT_TYPES.includes(c.type)}
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
  const share = LAYOUT_TYPES.includes(c.type) && scope.choice === 'own' && !scope.invalidOwn;
  return html`
    <div class="mc-tab-content">
      ${renderEntitySourceField(t('Entity'), c, onChange, hass, scope, { syncCtx })}
      ${share
        ? renderToggleField(
            t('Share with tiles inside'),
            (c as { share_entity?: boolean }).share_entity === true,
            (v) => onChange({ ...c, share_entity: v } as CardModule),
            'share_entity',
            syncCtx,
            t('Tiles inside follow this entity unless they pick their own.'),
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
