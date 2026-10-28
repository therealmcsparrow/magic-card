import { t as lt } from '../../i18n/labels';
import { LitElement, html, css, TemplateResult, PropertyValues, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { AnimationConfig, AnimationDirection, AnimationTrigger, HomeAssistant } from '../../types';
import { editorSystem } from '../../css/editor-stack';
import { applyPreset, newAnimation, resetToPreset } from '../../anim-studio/entries';
import { animationConflicts } from './animation-conflicts';
import {
  ANIMATION_GROUPS,
  GROUP_LABELS,
  ANIMATION_PRESETS,
  DEFAULT_STRENGTH,
  EASINGS,
  getAnimationPreset,
  hasStrength,
  intensityLabel,
} from '../../utils/animation-presets';
import { generateId } from '../../utils/id-generator';
import { SCENE_INSETS } from '../../utils/seasonal.needs';
import type { AnimationPreset } from '../../utils/animation-presets';
import type { LibraryHass } from '../../anim-studio/animation-library';
import { animLibrary } from '../../utils/anim-hooks';
import { CUSTOM_PREFIX, customRefId, isCustomRef, validateAnimationDoc, type AnimationDoc } from '../../anim-studio/model';
import type { CataloguePreset } from '../../contracts/preset-catalogue';
import type { CardState } from './icon-animator/card-request';
import { loadCatalogue } from './preset-catalogue-loader';
import { applyCataloguePick } from './icon-animator/loader';
import { animationDocList } from '../../utils/custom-animations';
import { openLibrary } from '../custom/library-sheet';
import { cardStateOf } from '../custom/bridge';
import { docBytes, hasCopy, keepPicked, setAnimationCopy } from '../custom/animation-copies';

import './color-picker';
import './unit-field';
import './entity-picker';
import { t, m, tl, type MessageIndex } from '../i18n';

const TRIGGERS: Array<{ value: AnimationTrigger; label: MessageIndex; entity?: boolean }> = [
  { value: 'always', label: m('card-editor.animation-list.always') },
  { value: 'entity_on', label: m('card-editor.animation-list.while-entity-is-on'), entity: true },
  { value: 'state', label: m('card-editor.animation-list.while-state-equals'), entity: true },
  { value: 'tap', label: m('card-editor.animation-list.on-tap') },
];

const DIRECTIONS: Array<{ value: AnimationDirection; label: MessageIndex }> = [
  { value: 'normal', label: m('card-editor.animation-list.normal') },
  { value: 'reverse', label: m('card-editor.animation-list.reverse') },
  { value: 'alternate', label: m('card-editor.animation-list.alternate') },
  { value: 'alternate-reverse', label: m('card-editor.animation-list.alternate-reverse') },
];

const REPEATS = ['infinite', '1', '2', '3', '5'];

/** The built-in group catalogue 'Light & colour' presets join (preset-catalogue 1.1.0). */
const LIGHT_GROUP = 'Light & colour';
/**
 * The contract's CATALOGUE_DOC_PREFIX. Not imported: the icon animator chunk imports the contract,
 * and a module both share stops being scope-hoisted (tests/preset-catalogue-card.test.ts checks
 * the two match).
 */
export const CAT_PREFIX = 'cat-';
const catRef = (entryId: string) => `${CUSTOM_PREFIX}${CAT_PREFIX}${entryId}`;

/** A preset an element without particle, ring or seasonal layers can play: moves, glows and fades, not "On tap". */
export const isMotionPreset = (p: AnimationPreset): boolean => !p.channels.includes('fx') && !p.particles && !p.ring && !p.seasonal && p.trigger !== 'tap';

/** Catalogue documents built for field defaults, per entry id (build() is fresh on every call). */
const built = new Map<string, AnimationDoc>();
/** Inline catalogue copies as read for field defaults, per stored object. */
const read = new WeakMap<object, AnimationDoc | undefined>();

/**
 * The design's preset animations: one condition-style block per entry (preset, target, play,
 * colour, strength, timing, intensity), "Add animation" below. Choosing a preset writes its values into the
 * fields; "Reset to preset" restores them. A muted note marks an entry that overrides an earlier
 * one on the same element and channel. The preset dropdown also lists the preset catalogue (lazy
 * chunk): a pick plays `custom:cat-<entry id>` from a copy stored in the card.
 */
@customElement('mc-animation-list')
export class AnimationList extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .list {
        display: grid;
        gap: 12px;
      }
      .cond-head .n .sub {
        font-weight: 400;
        color: var(--mc-text-2);
      }
      .foot {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 4px 8px;
      }
      a.btn {
        text-decoration: none;
      }
    `,
  ];

  @property({ attribute: false }) animations: AnimationConfig[] = [];
  /** The module has an icon hook: show Target. */
  @property({ type: Boolean }) allowIcon = false;
  /** The module has a label (a button): Target also offers Label. */
  @property({ type: Boolean }) allowLabel = false;
  /**
   * Motion presets only (a tab): no library, card copies or catalogue, no particle, ring or seasonal
   * presets and no "On tap" play, because the element has no layer for them.
   */
  @property({ type: Boolean }) motionOnly = false;
  /** What the Target "Module" choice is called (a tabs module's tab button reads "Tab"). */
  @property({ type: String }) moduleLabel = '';
  @property({ attribute: false }) hass?: HomeAssistant;
  /** The module's entity: what Play reads when an entry sets no entity of its own. */
  @property({ type: String }) defaultEntity = '';
  /** Card / row / column: no default entity, so entity Play options need "Entity for play condition". */
  @property({ type: Boolean }) requireTriggerEntity = false;
  /** The Color field offers the module entity's state colour (`entity` / `entity N%`). */
  @property({ type: Boolean }) allowEntityColor = false;
  @property({ type: String }) entityColor = '';
  @property({ attribute: false }) onChange?: (list: AnimationConfig[]) => void;

  /** Entries whose Repeat select is on "Custom" (a count outside the shortcuts). */
  @state() private _custom = new Set<string>();
  /** The library's change counter: a new value re-renders ("My animations"). */
  @state() private _libVersion = 0;
  /** The preset catalogue, once its chunk loaded (built-ins only until then, or when it fails). */
  @state() private _catalogue?: CataloguePreset[];

  private _unsubLibrary?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this._unsubLibrary ??= animLibrary().subscribe(() => {
      this._libVersion = animLibrary().version;
    });
    if (!this._catalogue && !this.motionOnly)
      void loadCatalogue().then((m) => {
        if (m) this._catalogue = m.CATALOGUE;
      });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubLibrary?.();
    this._unsubLibrary = undefined;
  }

  protected willUpdate(changed: PropertyValues): void {
    // the picker needs the library: one shared fetch / subscription per page (lazy)
    if (changed.has('hass') && !this.motionOnly) animLibrary().ensure(this.hass as unknown as LibraryHass | undefined);
  }

  /** "My animations": the library's documents, only once it answered. */
  private _mine(): AnimationDoc[] {
    return animLibrary().status === 'ready' ? animLibrary().list() : [];
  }

  /**
   * The document of a `custom:<id>` preset: the library's; for a catalogue pick (`cat-*`) else the
   * copy stored in the card, else the catalogue entry's own.
   */
  private _doc(preset: string): AnimationDoc | undefined {
    if (!isCustomRef(preset)) return undefined;
    const id = customRefId(preset);
    const lib = animLibrary().status === 'ready' ? animLibrary().get(id) : undefined;
    if (lib || !id.startsWith(CAT_PREFIX)) return lib;
    const raw = this._stored(id);
    if (raw) {
      if (!read.has(raw)) {
        const v = validateAnimationDoc(raw, { v2: 'lenient' });
        read.set(raw, v.ok ? v.doc : undefined);
      }
      return read.get(raw);
    }
    const entry = this._catEntry(preset);
    if (entry && !built.has(entry.id)) built.set(entry.id, entry.build());
    return entry && built.get(entry.id);
  }

  /**
   * The card's stored document `id` (the card editor's state, asked like the icon animator's
   * card-request.ts does): its own, else on a linked card the template's unless hidden or local.
   */
  private _stored(id: string): Record<string, unknown> | undefined {
    const detail: { sm?: CardState } = {};
    this.dispatchEvent(new CustomEvent('mc-card-bridge', { bubbles: true, composed: true, detail }));
    const c = detail.sm?.getConfig();
    const own = animationDocList(c?.custom_animations).find((d) => d.id === id);
    if (own || !c?.template || c.not_synced?.includes('custom_animations') || c.hidden_animations?.includes(id)) return own;
    return animationDocList(detail.sm?.getState().templateAnimations).find((d) => d.id === id);
  }

  /** The catalogue entry a `custom:cat-<entry id>` preset plays (once the catalogue loaded). */
  private _catEntry(preset: string): CataloguePreset | undefined {
    return this._catalogue?.find((e) => catRef(e.id) === preset);
  }

  /**
   * The Preset dropdown's pick: a catalogue preset is stored in the card first (icon animator
   * chunk); when that cannot happen (outside the card editor, chunk failed) nothing changes.
   */
  private _pickPreset(index: number, select: HTMLSelectElement): void {
    const was = this.animations[index]?.preset ?? '';
    const list = this.animations.map((a, i) => (i === index ? applyPreset(a, select.value) : a));
    const entry = this._catEntry(select.value);
    if (!entry) {
      this._write(list);
      // a library animation: the card keeps a copy (small ones by default), written after the module edit
      if (isCustomRef(select.value) && !customRefId(select.value).startsWith(CAT_PREFIX)) keepPicked(cardStateOf(this), customRefId(select.value));
      return;
    }
    void applyCataloguePick(this, entry, list, (l) => this._write(l)).then((ok) => {
      if (!ok) select.value = was;
    });
  }

  private _catOptions(group: string, value: string): TemplateResult[] {
    return (this._catalogue ?? [])
      .filter((e) => e.group === group)
      .map((e) => html`<option value=${catRef(e.id)} ?selected=${catRef(e.id) === value}>${e.name}</option>`);
  }

  private _write(list: AnimationConfig[]): void {
    this.onChange?.(list);
  }

  private _update(index: number, next: AnimationConfig): void {
    this._write(this.animations.map((a, i) => (i === index ? next : a)));
  }

  private _patch(index: number, patch: Partial<AnimationConfig>): void {
    const next = { ...this.animations[index], ...patch } as Record<string, unknown>;
    for (const [k, v] of Object.entries(patch)) if (v === undefined || v === '') delete next[k];
    this._update(index, next as unknown as AnimationConfig);
  }

  private _add(): void {
    const first = this.motionOnly ? ANIMATION_PRESETS.find(isMotionPreset) ?? ANIMATION_PRESETS[0] : ANIMATION_PRESETS[0];
    this._write([...this.animations, newAnimation(first.id, generateId('anim'))]);
  }

  private _remove(index: number): void {
    this._write(this.animations.filter((_a, i) => i !== index));
  }

  private _field(label: string, control: TemplateResult, forId?: string): TemplateResult {
    return html`
      <div class="field">
        <div class="field-head">${forId ? html`<label for=${forId}>${label}</label>` : html`<span class="lbl">${label}</span>`}</div>
        ${control}
      </div>
    `;
  }

  private _select(
    id: string,
    value: string,
    options: Array<{ value: string; label: string; disabled?: boolean }>,
    onPick: (v: string) => void,
  ): TemplateResult {
    return html`
      <div class="select">
        <select class="input" id=${id} @change=${(e: Event) => onPick((e.target as HTMLSelectElement).value)}>
          ${options.map((o) => html`<option value=${o.value} ?selected=${o.value === value} ?disabled=${!!o.disabled}>${o.label}</option>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    `;
  }

  /** "This card": the card's own inline documents the library does not list (a hand-written or imported copy), by id and name. */
  private _cardDocs(): Array<{ id: string; name: string }> {
    const detail: { sm?: CardState } = {};
    this.dispatchEvent(new CustomEvent('mc-card-bridge', { bubbles: true, composed: true, detail }));
    const inLib = new Set(this._mine().map((d) => d.id));
    return animationDocList(detail.sm?.getConfig()?.custom_animations)
      .map((d) => ({ id: String(d.id ?? ''), name: String(d.name ?? d.id ?? '') }))
      .filter((d) => d.id && !d.id.startsWith(CAT_PREFIX) && !inLib.has(d.id));
  }

  private _presetSelect(id: string, index: number, value: string): TemplateResult {
    const motion = this.motionOnly;
    const mine = motion ? [] : this._mine();
    const card = motion ? [] : this._cardDocs();
    // two entries that read the same (a built-in "Pendulum" and an imported one) show the id after the name
    const seen = new Map<string, number>();
    const key = (n: string): string => n.trim().toLowerCase();
    for (const n of [...mine.map((d) => d.name), ...card.map((d) => d.name), ...ANIMATION_PRESETS.map((p) => lt(p.name))]) seen.set(key(n), (seen.get(key(n)) ?? 0) + 1);
    const label = (name: string, docId: string): string => ((seen.get(key(name)) ?? 0) > 1 ? t('card-editor.animation-list.name-id', { name, id: docId }) : name);
    const cat = isCustomRef(value) && customRefId(value).startsWith(CAT_PREFIX);
    const preset = getAnimationPreset(value);
    const known = (motion ? !!preset && isMotionPreset(preset) : !!preset) || !!this._catEntry(value) || (!cat && !!this._doc(value)) || (isCustomRef(value) && card.some((d) => d.id === customRefId(value)));
    // a stored catalogue pick reads as its id until the catalogue loaded (or when it is not in it)
    const unknown = motion && (preset || isCustomRef(value))
      ? t('card-editor.animation-list.name-not-played-on-tabs', { name: preset ? lt(preset.name) : customRefId(value) })
      : cat
        ? this._doc(value)?.name ?? customRefId(value)
        : isCustomRef(value)
          ? t('card-editor.animation-list.id-not-found', { id: customRefId(value) })
          : t('card-editor.animation-list.id-unknown', { id: value });
    return html`
      <div class="select">
        <select
          class="input"
          id=${id}
          @change=${(e: Event) => this._pickPreset(index, e.target as HTMLSelectElement)}
        >
          ${known ? nothing : html`<option value=${value} selected>${unknown}</option>`}
          ${mine.length
            ? html`<optgroup label=${t('card-editor.animation-list.my-animations')}>
                ${mine.map((d) => html`<option value=${CUSTOM_PREFIX + d.id} ?selected=${CUSTOM_PREFIX + d.id === value}>${label(d.name, d.id)}</option>`)}
              </optgroup>`
            : nothing}
          ${card.length
            ? html`<optgroup label=${t('card-editor.animation-list.this-card')}>
                ${card.map((d) => html`<option value=${CUSTOM_PREFIX + d.id} ?selected=${CUSTOM_PREFIX + d.id === value}>${label(d.name, d.id)}</option>`)}
              </optgroup>`
            : nothing}
          ${ANIMATION_GROUPS.filter((g) => !motion || ANIMATION_PRESETS.some((p) => p.group === g && isMotionPreset(p))).map(
            (g) => html`<optgroup label=${lt(GROUP_LABELS[g])}>
              ${ANIMATION_PRESETS.filter((p) => p.group === g && (!motion || isMotionPreset(p))).map(
                (p) => html`<option value=${p.id} ?selected=${p.id === value}>${lt(p.name)}</option>`,
              )}
              ${g === LIGHT_GROUP && !motion ? this._catOptions(g, value) : nothing}
            </optgroup>`,
          )}
          ${this._catalogue && !motion
            ? // the catalogue comes in CATALOGUE_GROUPS order
              [...new Set(this._catalogue.map((e) => e.group))].filter((g) => g !== LIGHT_GROUP).map(
                (g) => html`<optgroup label=${g}>${this._catOptions(g, value)}</optgroup>`,
              )
            : nothing}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    `;
  }

  private _target(index: number, a: AnimationConfig, fallback: 'module' | 'icon' = 'module'): TemplateResult {
    const opts = [
      { value: 'module', label: this.moduleLabel || t('card-editor.animation-list.module') },
      { value: 'icon', label: t('card-editor.animation-list.icon') },
      ...(this.allowLabel ? [{ value: 'label', label: t('card-editor.animation-list.label') }] : []),
    ];
    const current = opts.some((o) => o.value === a.target) ? a.target : fallback;
    const pick = (v: string) => this._patch(index, { target: v as AnimationConfig['target'] });
    const onKey = (e: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const at = opts.findIndex((o) => o.value === current);
      const next = opts[e.key === 'Home' ? 0 : e.key === 'End' ? opts.length - 1 : (at + (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1) + opts.length) % opts.length].value;
      const group = e.currentTarget as HTMLElement;
      pick(next);
      requestAnimationFrame(() => group.querySelector<HTMLElement>(`[data-val="${next}"]`)?.focus());
    };
    return html`
      <div class="seg full" role="radiogroup" aria-label=${t('card-editor.animation-list.target')} @keydown=${onKey}>
        ${opts.map((o) => {
          const on = o.value === current;
          return html`<button
            type="button"
            role="radio"
            data-val=${o.value}
            aria-checked=${on ? 'true' : 'false'}
            tabindex=${on ? '0' : '-1'}
            @click=${() => pick(o.value)}
          >${o.label}</button>`;
        })}
      </div>
    `;
  }

  private _repeat(index: number, a: AnimationConfig, id: string, def?: 'infinite' | number): TemplateResult {
    const it = a.iterations ?? def ?? getAnimationPreset(a.preset)?.defaults.iterations ?? 'infinite';
    const custom = this._custom.has(a.id) || !REPEATS.includes(String(it));
    const opts = [...REPEATS.map((r) => ({ value: r, label: r === 'infinite' ? t('card-editor.animation-list.infinite') : r })), { value: 'custom', label: t('card-editor.animation-list.custom') }];
    const onPick = (v: string) => {
      const next = new Set(this._custom);
      if (v === 'custom') {
        next.add(a.id);
        this._custom = next;
        if (it === 'infinite') this._patch(index, { iterations: 10 });
        return;
      }
      next.delete(a.id);
      this._custom = next;
      this._patch(index, { iterations: v === 'infinite' ? 'infinite' : Number(v) });
    };
    return this._field(t('card-editor.animation-list.repeat'), this._select(id, custom ? 'custom' : String(it), opts, onPick), id);
  }

  /**
   * A seasonal preset (its own timing and colours): preset, play, density, strength and, for scenes
   * with border decorations, the Decorations switch.
   */
  private _seasonalBlock(a: AnimationConfig, index: number, note: string | undefined, p: AnimationPreset): TemplateResult {
    const id = (k: string) => `an-${index}-${k}`;
    const trigger = a.trigger ?? 'always';
    const scene = p.seasonal;
    const deco = !!SCENE_INSETS[scene ?? ''];
    const decoOn = a.decorations !== false;
    const help =
      scene === 'weather'
        ? t("card-editor.animation-list.follows-a-weather-entity-the-module-s-or")
        : scene === 'daynight'
          ? t('card-editor.animation-list.stars-and-fireflies-at-night-a-warm-glow')
          : '';
    return html`
      <div class="cond">
        <div class="cond-head">
          <span class="n">${t('card-editor.animation-list.animation-n', { n: index + 1 })} <span class="sub">· ${lt(p.name)}</span></span>
          <button type="button" class="icon-btn sm danger" aria-label=${t('card-editor.animation-list.delete-animation-n', { n: index + 1 })} title=${t('card-editor.animation-list.delete-animation')} @click=${() => this._remove(index)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${note ? html`<p class="help anim-note">${note}</p>` : nothing}
        ${this._field(t('card-editor.animation-list.preset'), this._presetSelect(id('preset'), index, a.preset), id('preset'))}
        ${help ? html`<p class="help">${help}</p>` : nothing}
        ${this._play(index, a, trigger, id('play'))}
        <div class="two">
          ${this._field(
            t('card-editor.animation-list.density'),
            html`<input
              class="input"
              id=${id('int')}
              type="number"
              min="0"
              max="100"
              step="5"
              .value=${String(a.intensity ?? p.defaults.intensity)}
              @input=${(e: InputEvent) => {
                const v = (e.target as HTMLInputElement).value;
                this._patch(index, { intensity: v === '' ? undefined : Number(v) });
              }}
            />`,
            id('int'),
          )}
          ${this._field(
            t('card-editor.animation-list.strength'),
            html`<input
              class="input"
              id=${id('strength')}
              type="number"
              min="0"
              max="100"
              step="5"
              .value=${String(a.strength ?? DEFAULT_STRENGTH)}
              @input=${(e: InputEvent) => {
                const v = (e.target as HTMLInputElement).value;
                this._patch(index, { strength: v === '' ? undefined : Number(v) });
              }}
            />`,
            id('strength'),
          )}
        </div>
        ${deco
          ? html`<div class="switch-row">
              <div class="txt">
                ${t('card-editor.animation-list.border-decorations')}
                <p class="help">${t('card-editor.animation-list.drawn-along-the-border-the-content-keeps')}</p>
              </div>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${decoOn ? 'true' : 'false'}
                aria-label=${t('card-editor.animation-list.border-decorations')}
                @click=${() => this._patch(index, { decorations: decoOn ? false : undefined })}
              ></button>
            </div>`
          : nothing}
        <div class="foot">
          <button type="button" class="btn btn-text btn-sm" @click=${() => this._update(index, resetToPreset(a))}>
            <ha-icon icon="mdi:restore"></ha-icon>${t('card-editor.animation-list.reset-to-preset')}
          </button>
        </div>
      </div>
    `;
  }

  private _block(a: AnimationConfig, index: number, note: string | undefined): TemplateResult {
    if (isCustomRef(a.preset)) return this._customBlock(a, index, note);
    const p = getAnimationPreset(a.preset);
    if (p?.seasonal) return this._seasonalBlock(a, index, note, p);
    const d = p?.defaults;
    const id = (k: string) => `an-${index}-${k}`;
    const trigger = a.trigger ?? 'always';
    const it = a.iterations ?? d?.iterations ?? 'infinite';
    const custom = this._custom.has(a.id) || !REPEATS.includes(String(it));
    const easing = a.easing ?? d?.easing ?? 'ease';
    const easingOpts = EASINGS.map((e) => ({ value: e.id, label: lt(e.label) }));
    if (!EASINGS.some((e) => e.id === easing)) easingOpts.push({ value: easing, label: easing });

    return html`
      <div class="cond">
        <div class="cond-head">
          <span class="n">${t('card-editor.animation-list.animation-n', { n: index + 1 })} <span class="sub">· ${p?.name ?? a.preset}</span></span>
          <button
            type="button"
            class="icon-btn sm danger"
            aria-label=${t('card-editor.animation-list.delete-animation-n', { n: index + 1 })}
            title=${t('card-editor.animation-list.delete-animation')}
            @click=${() => this._remove(index)}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${note ? html`<p class="help anim-note">${note}</p>` : nothing}
        ${this._field(t('card-editor.animation-list.preset'), this._presetSelect(id('preset'), index, a.preset), id('preset'))}
        ${this.allowIcon ? this._field(t('card-editor.animation-list.target'), this._target(index, a)) : nothing}
        ${this._play(index, a, trigger, id('play'))}
        ${trigger === 'state'
          ? this._field(
              t('card-editor.animation-list.state-value'),
              html`<input
                class="input"
                id=${id('state')}
                type="text"
                .value=${a.state || ''}
                @input=${(e: InputEvent) => this._patch(index, { state: (e.target as HTMLInputElement).value })}
              />`,
              id('state'),
            )
          : nothing}
        ${this._field(
          t('card-editor.animation-list.colour'),
          html`<mc-color-picker
            .value=${a.color || ''}
            .label=${t('card-editor.animation-list.animation-colour')}
            .allowEntity=${this.allowEntityColor}
            .entityColor=${this.entityColor}
            @value-changed=${(e: CustomEvent) => this._patch(index, { color: e.detail.value })}
          ></mc-color-picker>`,
        )}
        ${p && hasStrength(p)
          ? this._field(
              t('card-editor.animation-list.strength'),
              html`<input
                class="input"
                id=${id('strength')}
                type="number"
                min="0"
                max="100"
                step="5"
                .value=${String(a.strength ?? DEFAULT_STRENGTH)}
                @input=${(e: InputEvent) => {
                  const v = (e.target as HTMLInputElement).value;
                  this._patch(index, { strength: v === '' ? undefined : Number(v) });
                }}
              />`,
              id('strength'),
            )
          : nothing}
        <div class="two">
          ${this._field(t('card-editor.animation-list.duration'), this._time(index, 'duration', a.duration ?? d?.duration, d?.duration))}
          ${this._field(t('card-editor.animation-list.delay'), this._time(index, 'delay', a.delay ?? d?.delay, d?.delay))}
        </div>
        <div class="two">
          ${this._field(t('card-editor.animation-list.easing'), this._select(id('easing'), easing, easingOpts, (v) => this._patch(index, { easing: v })), id('easing'))}
          ${this._repeat(index, a, id('repeat'))}
        </div>
        ${custom
          ? this._field(
              t('card-editor.animation-list.repeat-count'),
              html`<input
                class="input"
                id=${id('count')}
                type="number"
                min="1"
                step="1"
                .value=${typeof it === 'number' ? String(it) : ''}
                @input=${(e: InputEvent) => {
                  const n = Number((e.target as HTMLInputElement).value);
                  if (Number.isFinite(n) && n > 0) this._patch(index, { iterations: n });
                }}
              />`,
              id('count'),
            )
          : nothing}
        <div class="two">
          ${this._field(
            t('card-editor.animation-list.direction'),
            this._select(id('dir'), a.direction ?? d?.direction ?? 'normal', tl(DIRECTIONS), (v) => this._patch(index, { direction: v as AnimationDirection })),
            id('dir'),
          )}
          ${p
            ? this._field(
                intensityLabel(p, lt),
                html`<input
                  class="input"
                  id=${id('int')}
                  type="number"
                  min=${p.intensity.min}
                  max=${p.intensity.max}
                  step=${p.intensity.step ?? 1}
                  .value=${String(a.intensity ?? p.defaults.intensity)}
                  @input=${(e: InputEvent) => {
                    const v = (e.target as HTMLInputElement).value;
                    this._patch(index, { intensity: v === '' ? undefined : Number(v) });
                  }}
                />`,
                id('int'),
              )
            : nothing}
        </div>
        ${p
          ? html`<div class="foot">
              <button type="button" class="btn btn-text btn-sm" @click=${() => this._update(index, resetToPreset(a))}>
                <ha-icon icon="mdi:restore"></ha-icon>${t('card-editor.animation-list.reset-to-preset')}
              </button>
            </div>`
          : nothing}
      </div>
    `;
  }

  /** A number field writing `key` (empty removes it). */
  private _number(index: number, key: 'intensity' | 'strength', id: string, value: number | undefined, placeholder: string, min: number, max: number, step: number): TemplateResult {
    return html`<input
      class="input"
      id=${id}
      type="number"
      min=${min}
      max=${max}
      step=${step}
      placeholder=${placeholder}
      .value=${value === undefined ? '' : String(value)}
      @input=${(e: InputEvent) => {
        const v = (e.target as HTMLInputElement).value;
        this._patch(index, { [key]: v === '' ? undefined : Number(v) });
      }}
    />`;
  }

  /** Why a `custom:` entry has no document here. */
  private _missingHelp(): string {
    switch (animLibrary().status) {
      case 'unavailable':
        return t('card-editor.animation-list.not-found-my-animations-needs-the-magic');
      case 'ready':
        return t('card-editor.animation-list.not-found-in-my-animations-the-card');
      default:
        return t('card-editor.animation-list.loading-my-animations');
    }
  }

  /** "Keep a copy in this card" for a library animation (animation-copies.ts). */
  private _keepCopy(ref: string, id: string): TemplateResult | typeof nothing {
    const lib = animLibrary().get(ref);
    const sm = lib ? cardStateOf(this) : undefined;
    if (!lib || !sm) return nothing;
    const on = hasCopy(sm.getConfig(), ref);
    const n = docBytes(lib);
    const kb = n < 1024 ? t('card-editor.animation-list.n-b', { n }) : t('card-editor.animation-list.size-kb', { size: (n / 1024).toFixed(1) });
    return html`<div class="switch-row">
      <div class="txt">
        <div class="field-head"><label for=${id}>${on ? t('card-editor.animation-list.keep-a-copy-in-this-card-size', { size: kb }) : t('card-editor.animation-list.keep-a-copy-in-this-card-adds-size', { size: kb })}</label></div>
        <p class="help" id="${id}-help">${t('card-editor.animation-list.without-a-copy-the-card-plays-nothing-if')}</p>
      </div>
      <button type="button" class="switch" id=${id} role="switch" aria-checked=${on ? 'true' : 'false'} aria-describedby="${id}-help"
        @click=${() => { setAnimationCopy(sm, ref, !on, false); this.requestUpdate(); }}></button>
    </div>`;
  }

  /**
   * An animation from the library (`custom:<id>`): the preset fields, its own values as the defaults
   * (empty fields follow the document).
   */
  private _customBlock(a: AnimationConfig, index: number, note: string | undefined): TemplateResult {
    const doc = this._doc(a.preset);
    const ref = customRefId(a.preset);
    const id = (k: string) => `an-${index}-${k}`;
    const trigger = a.trigger ?? 'always';
    const head = html`
      <div class="cond-head">
        <span class="n">${t('card-editor.animation-list.animation-n', { n: index + 1 })} <span class="sub">· ${doc?.name ?? ref}</span></span>
        <button type="button" class="icon-btn sm danger" aria-label=${t('card-editor.animation-list.delete-animation-n', { n: index + 1 })} title=${t('card-editor.animation-list.delete-animation')} @click=${() => this._remove(index)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      ${note ? html`<p class="help anim-note">${note}</p>` : nothing}
      ${this._field(t('card-editor.animation-list.preset'), this._presetSelect(id('preset'), index, a.preset), id('preset'))}
      ${this._keepCopy(ref, id('keep'))}
    `;
    if (!doc) {
      return html`<div class="cond">
        ${head}
        <p class="help">
          ${ref.startsWith('quick-')
            ? t('card-editor.animation-list.an-animated-icon-stored-in-this-card')
            : ref.startsWith(CAT_PREFIX)
              ? t('card-editor.animation-list.a-preset-stored-in-this-card')
              : this._missingHelp()}
        </p>
        ${this._play(index, a, trigger, id('play'))}
      </div>`;
    }

    const layer = doc.kind === 'particles' || (doc.kind === 'path' && doc.path?.subject === 'particles');
    const base = doc.particles?.preset ? getAnimationPreset(doc.particles.preset) : undefined;
    const easing = a.easing ?? doc.easing;
    const easingOpts = EASINGS.map((e) => ({ value: e.id, label: lt(e.label) }));
    if (!EASINGS.some((e) => e.id === easing)) easingOpts.push({ value: easing, label: easing });
    const it = a.iterations ?? doc.iterations;
    const custom = this._custom.has(a.id) || !REPEATS.includes(String(it));
    const amplitude = !layer && doc.kind !== 'sequence';
    const docTarget = doc.kind === 'path' ? (doc.path?.subject === 'icon' ? 'icon' : 'module') : doc.target === 'icon' ? 'icon' : 'module';

    return html`
      <div class="cond">
        ${head}
        ${this.allowIcon && !layer ? this._field(t('card-editor.animation-list.target'), this._target(index, a, docTarget)) : nothing}
        ${this._play(index, a, trigger, id('play'))}
        ${doc.clips?.length || doc.bindings?.length
          ? this._field(
              t('card-editor.animation-list.entity-for-states-and-values'),
              html`<mc-entity-picker
                .hass=${this.hass}
                .value=${a.entity || ''}
                .label=${t('card-editor.animation-list.entity-for-states-and-values')}
                .placeholder=${this.defaultEntity ? t('card-editor.animation-list.module-entity-entity', { entity: this.defaultEntity }) : 'entity_id'}
                @value-changed=${(e: CustomEvent) => this._patch(index, { entity: e.detail.value })}
              ></mc-entity-picker>`,
            )
          : nothing}
        ${trigger === 'state'
          ? this._field(
              t('card-editor.animation-list.state-value'),
              html`<input
                class="input"
                id=${id('state')}
                type="text"
                .value=${a.state || ''}
                @input=${(e: InputEvent) => this._patch(index, { state: (e.target as HTMLInputElement).value })}
              />`,
              id('state'),
            )
          : nothing}
        ${doc.kind === 'sequence'
          ? nothing
          : this._field(
              t('card-editor.animation-list.colour'),
              html`<mc-color-picker
                .value=${a.color || ''}
                .label=${t('card-editor.animation-list.animation-colour')}
                .allowEntity=${this.allowEntityColor}
                .entityColor=${this.entityColor}
                @value-changed=${(e: CustomEvent) => this._patch(index, { color: e.detail.value })}
              ></mc-color-picker>`,
            )}
        ${doc.kind === 'sequence'
          ? nothing
          : this._field(t('card-editor.animation-list.strength'), this._number(index, 'strength', id('strength'), a.strength, String(DEFAULT_STRENGTH), 0, 100, 5), id('strength'))}
        <div class="two">
          ${this._field(t('card-editor.animation-list.duration'), this._time(index, 'duration', a.duration, `${doc.duration}s`))}
          ${this._field(t('card-editor.animation-list.delay'), this._time(index, 'delay', a.delay, '0s'))}
        </div>
        <div class="two">
          ${this._field(t('card-editor.animation-list.easing'), this._select(id('easing'), easing, easingOpts, (v) => this._patch(index, { easing: v })), id('easing'))}
          ${this._repeat(index, a, id('repeat'), doc.iterations)}
        </div>
        ${custom
          ? this._field(
              t('card-editor.animation-list.repeat-count'),
              html`<input
                class="input"
                id=${id('count')}
                type="number"
                min="1"
                step="1"
                .value=${typeof it === 'number' ? String(it) : ''}
                @input=${(e: InputEvent) => {
                  const n = Number((e.target as HTMLInputElement).value);
                  if (Number.isFinite(n) && n > 0) this._patch(index, { iterations: n });
                }}
              />`,
              id('count'),
            )
          : nothing}
        <div class="two">
          ${this._field(
            t('card-editor.animation-list.direction'),
            this._select(id('dir'), a.direction ?? doc.direction ?? 'normal', tl(DIRECTIONS), (v) => this._patch(index, { direction: v as AnimationDirection })),
            id('dir'),
          )}
          ${amplitude
            ? this._field(t('card-editor.animation-list.amplitude'), this._number(index, 'intensity', id('int'), a.intensity, '100', 0, 400, 5), id('int'))
            : base
              ? this._field(
                  intensityLabel(base, lt),
                  this._number(index, 'intensity', id('int'), a.intensity, String(doc.particles?.intensity ?? base.defaults.intensity), base.intensity.min, base.intensity.max, base.intensity.step ?? 1),
                  id('int'),
                )
              : nothing}
        </div>
        <div class="foot">
          <button type="button" class="btn btn-text btn-sm" @click=${() => this._update(index, resetToPreset(a))}>
            <ha-icon icon="mdi:restore"></ha-icon>${t('card-editor.animation-list.reset-to-animation')}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * "Entity for play condition" (default: the module's entity) and Play. Without any entity the
   * options that read one are disabled (card / row / column until an entity is picked).
   */
  private _play(index: number, a: AnimationConfig, trigger: string, playId: string): TemplateResult {
    const hasEntity = !!(a.trigger_entity || (!this.requireTriggerEntity && this.defaultEntity));
    const opts = TRIGGERS.filter((tr) => !this.motionOnly || tr.value !== 'tap' || trigger === 'tap').map((tr) => ({
      ...tr,
      label: t(tr.label),
      disabled: !!tr.entity && !hasEntity && tr.value !== trigger,
    }));
    return html`
      ${this._field(
        t('card-editor.animation-list.entity-for-play-condition'),
        html`<mc-entity-picker
          .hass=${this.hass}
          .value=${a.trigger_entity || ''}
          .label=${this.defaultEntity && !this.requireTriggerEntity ? t('card-editor.animation-list.module-entity-entity', { entity: this.defaultEntity }) : t('card-editor.animation-list.entity-for-play-condition')}
          @value-changed=${(e: CustomEvent) => this._patch(index, { trigger_entity: e.detail.value })}
        ></mc-entity-picker>`,
      )}
      ${this._field(
        t('card-editor.animation-list.play'),
        this._select(playId, trigger, opts, (v) => this._patch(index, { trigger: v as AnimationTrigger })),
        playId,
      )}
      ${!hasEntity && trigger !== 'always' && TRIGGERS.find((t) => t.value === trigger)?.entity
        ? html`<p class="help">${t('card-editor.animation-list.pick-an-entity-this-condition-never')}</p>`
        : nothing}
    `;
  }

  private _time(index: number, key: 'duration' | 'delay', value: string | undefined, placeholder: string | undefined): TemplateResult {
    return html`<mc-unit-field
      .value=${value ?? ''}
      .label=${key === 'duration' ? t('card-editor.animation-list.duration') : t('card-editor.animation-list.delay')}
      .units=${['s', 'ms']}
      .placeholder=${(placeholder ?? '0s').replace(/m?s$/, '')}
      @value-changed=${(e: CustomEvent) => this._patch(index, { [key]: e.detail.value })}
    ></mc-unit-field>`;
  }

  protected render(): TemplateResult {
    const notes = animationConflicts(this.animations, { allowIcon: this.allowIcon }).map((n) =>
      n ? lt('labels.animation-list.overrides-name-both-animate-the-what', { name: lt(n.name), what: lt(n.what) }) : undefined,
    );
    return html`
      <div class="list">
        ${this.animations.map((a, i) => this._block(a, i, notes[i]))}
        <div>
          <button type="button" class="btn btn-text btn-sm" @click=${() => this._add()}>
            <ha-icon icon="mdi:plus"></ha-icon>${t('card-editor.animation-list.add-animation')}
          </button>
          ${this.motionOnly
            ? nothing
            : html`<button type="button" class="btn btn-text btn-sm" @click=${(e: Event) => void openLibrary(e.currentTarget as HTMLElement, this.hass, 'animation')}>${t('card-editor.animation-list.library')}</button>`}
        </div>
      </div>
    `;
  }
}
