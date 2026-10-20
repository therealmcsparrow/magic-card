import { t as lt } from '../../i18n/labels';
import { LitElement, html, css, PropertyValues, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HassEntity, HomeAssistant, IconColorsConfig, IconFillConfig, IconFxConfig, IconFxKeys } from '../../types';
import { editorSystem } from '../../css/editor-stack';
import { entityStateColor } from '../../utils/entity-color';
import { hasIconFx } from '../../icons/render-icon';
import { autoDeviceAnim, autoDeviceRule } from '../../icons/device-anim';
import { ICON_FX_DEFAULTS } from '../../icons/icon-fx';
import { svgIconApi } from '../../utils/svg-icon-loader';
import { sanitizeSvg, SVG_MAX_BYTES } from '../../icons/svg-sanitize';
import { fieldReset } from './field-reset';
import { getFullPath, hasTemplate, isNotSynced, type SyncContext } from '../../utils/sync-path';
import { cardStateOf as cardState } from '../custom/bridge';
import { listIcons, type Listing } from '../custom/library';
import { applyIconPatch, openIconEditor, sourceOfModule } from '../custom/icon-host';
import type { IconSummary } from '../../contracts/mcu-library';

import './color-picker';
import './unit-field';
import './entity-picker';
import './attribute-picker';
import './icon-picker';
import './sync-indicator';
import { t, m, type MessageId } from '../i18n';

/** A change of the module's icon keys; a key set to undefined is removed. */
export type IconFxPatch = Partial<Pick<IconFxKeys, 'icon_fx' | 'icon_on' | 'icon_off' | 'svg'>> & { icon?: string };

type Opt = { value: string; label: MessageId };

const DEVICE_LABEL: Record<string, MessageId> = {
  spin: m('Spin'), glow: m('Glow'), flame: m('Flame'), drum: m('Drum'), swing: m('Swing'), pulse: m('Pulse'), snow: m('Snow'), shake: m('Shake'), eq: m('Equalizer'),
};
const DEVICES: Opt[] = [
  { value: 'off', label: m('Off') },
  { value: 'auto', label: m('Auto') },
  ...Object.entries(DEVICE_LABEL).map(([value, label]) => ({ value, label })),
];
const DRAWS: Opt[] = [
  { value: 'off', label: m('Off') },
  { value: 'load', label: m('On load') },
  { value: 'change', label: m('On change') },
  { value: 'loop', label: m('Loop') },
];
const DIRECTIONS: Opt[] = [
  { value: 'up', label: m('Up') },
  { value: 'down', label: m('Down') },
  { value: 'left', label: m('Left') },
  { value: 'right', label: m('Right') },
];
const STYLES: Opt[] = [
  { value: 'solid', label: m('Solid') },
  { value: 'duotone', label: m('Duotone') },
  { value: 'gradient', label: m('Gradient') },
  { value: 'value', label: m('Value') },
];

/** Markup the sanitiser would strip silently but that must never be pasted: say what and refuse it. */
function hostileParts(svg: string): string[] {
  const found: string[] = [];
  if (/<\s*script/i.test(svg)) found.push(t('a script'));
  if (/\son[a-z]+\s*=/i.test(svg)) found.push(t('event handlers'));
  if (/javascript:|vbscript:/i.test(svg)) found.push(t('a javascript: link'));
  if (/<\s*foreignObject/i.test(svg)) found.push('foreignObject');
  if (/<\s*(?:iframe|embed|object)\b/i.test(svg) || /href\s*=\s*(?!["']?\s*#)/i.test(svg)) found.push(t('external references'));
  if (/url\(\s*(?!["']?\s*#)/i.test(svg) || /@import|data:/i.test(svg)) found.push(t('external references'));
  return [...new Set(found)];
}

/** Why a pasted / uploaded SVG is refused; undefined when it is fine. */
export function customSvgError(svg: string): string | undefined {
  const bad = hostileParts(svg);
  if (bad.length) {
    const list = bad.length > 1 ? t('{list} and {last}', { list: bad.slice(0, -1).join(', '), last: bad[bad.length - 1] }) : bad[0];
    return bad.length > 1
      ? t('This SVG contains {list}. Remove them and try again.', { list })
      : t('This SVG contains {list}. Remove it and try again.', { list });
  }
  // Not unsafe, but dropped by the sanitiser: the shapes they draw would silently go missing.
  if (/<\s*(?:use|image)\b/i.test(svg)) return t("<use> and <image> aren't supported. Draw the shapes as paths and try again.");
  return sanitizeSvg(svg).error;
}

/** What the sanitiser removes from an accepted SVG that changes its look; undefined when nothing. */
export function customSvgWarning(svg: string): string | undefined {
  if (/<\s*style\b/i.test(svg) || /\sstyle\s*=/i.test(svg)) return t('Styles are removed; use fill attributes (for example fill="#f44336") for colours.');
  return undefined;
}

/** `25%` → 25; undefined for unset or a colour value. */
function pctOf(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v > 1 ? v : v * 100;
  if (typeof v === 'string' && /^\s*\d*\.?\d+\s*%?\s*$/.test(v)) {
    const n = parseFloat(v);
    return /%/.test(v) || n > 1 ? n : n * 100;
  }
  return undefined;
}

/**
 * Drops keys whose value is undefined, '' or NaN (top level only), so a reset removes the key.
 * Empty objects stay (`fill: {}` is "fill on, all defaults"); undefined when no key is left.
 */
function prune<T extends object>(o: T): T | undefined {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(o)) {
    if (v === undefined || v === '' || (typeof v === 'number' && Number.isNaN(v))) continue;
    out[k] = v;
  }
  return Object.keys(out).length ? (out as T) : undefined;
}

/**
 * "Icon effects" of a module that draws an icon: liquid fill, device animation, line draw, morph
 * with state icons and the colour style, in one collapsible sector; plus the "Custom SVG" option of
 * the icon field (paste or upload, refused with the reason when unsafe or unusable).
 * Writes through `onChange(patch)`; every set field has a reset.
 */
@customElement('mc-icon-fx-editor')
export class IconFxEditor extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: grid;
        gap: 16px;
        min-width: 0;
      }
      .state-icons {
        display: grid;
        gap: 6px;
      }
      .sector-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .sector-head .sector-btn {
        flex: 1;
        min-width: 0;
      }
      .sector-head mc-sync-indicator {
        margin-right: 8px;
      }
      .sector-reset-row {
        display: flex;
        justify-content: flex-end;
        margin-bottom: -8px;
      }
      .stops {
        display: grid;
        gap: 8px;
      }
      .stop {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .stop mc-color-picker {
        flex: 1;
        min-width: 0;
      }
      .svg-actions {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
      }
      .svg-actions input[type='file'] {
        display: none;
      }
      .svg-msg {
        display: grid;
        gap: 6px;
      }
      .help.warn {
        color: var(--mc-warn-ink);
      }
      .icon-editor {
        display: grid;
        gap: 6px;
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }
      textarea.input {
        min-height: 120px;
      }
    `,
  ];

  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) fx?: IconFxConfig;
  /** The module's entity: default value source, Auto device animation, state icons, entity colours. */
  @property({ type: String }) entity = '';
  /** The icon the module draws (for the "no shape" hint); `svg` = the custom SVG. */
  @property({ type: String }) icon = '';
  /** The module's own `icon` value (what Custom SVG off restores). */
  @property({ type: String }) moduleIcon = '';
  @property({ type: String }) iconOn = '';
  @property({ type: String }) iconOff = '';
  @property({ type: String }) svg = '';
  /** Offer "Custom SVG" (modules whose icon field is shown). */
  @property({ type: Boolean }) allowSvg = false;
  /** Offer Morph and the state icons (modules with an on / off entity). */
  @property({ type: Boolean }) allowStateIcons = false;
  @property({ attribute: false }) onChange?: (patch: IconFxPatch) => void;
  /** The module as stored (for the SVG editor's notice: state icons, icon animation). */
  @property({ attribute: false }) moduleCfg?: Record<string, unknown>;
  /** Template link of the module: sync indicators for icon_fx, icon_on, icon_off and svg. */
  @property({ attribute: false }) syncCtx?: SyncContext;

  @state() private _open = false;
  @state() private _svgDraft?: string;
  @state() private _svgError?: string;
  /** The error came from an upload (announced as an alert); typing errors are announced politely. */
  @state() private _svgAlert = false;
  @state() private _noShape = false;
  /** Custom SVG switched on here, before a valid SVG wrote `icon: svg`. */
  @state() private _svgOn = false;
  /** The icon editor's chunk: loading or failed. */
  @state() private _editorState: 'loading' | 'failed' | '' = '';
  /** The saved icons (for the "not found" notice of an mcu: icon). */
  @state() private _saved?: Listing<IconSummary>;
  private _savedFor?: unknown;
  /** The module's icon before Custom SVG: restored when it is switched off. */
  private _prevIcon?: string;
  private _shapeFor = '';
  private _unlisten?: () => void;

  private get _fx(): IconFxConfig {
    return this.fx && typeof this.fx === 'object' ? this.fx : {};
  }
  private get _fill(): IconFillConfig | undefined {
    const f = this._fx.fill;
    return f && typeof f === 'object' ? f : undefined;
  }
  private get _colors(): IconColorsConfig {
    const c = this._fx.colors;
    return c && typeof c === 'object' ? c : {};
  }
  private get _isSvg(): boolean {
    return this.icon === 'svg';
  }
  /** An own SVG or a library icon (mcu:) can have parts drawn in the Accent paint, so it has an accent colour. */
  private get _hasAccent(): boolean {
    return this._isSvg || /^mcu:/.test(this.icon);
  }
  private get _stateObj(): HassEntity | undefined {
    return this.entity ? this.hass?.states?.[this.entity] : undefined;
  }

  // ── writes ──

  private _setFx(patch: Partial<IconFxConfig>): void {
    const next = prune({ ...this._fx, ...patch } as IconFxConfig);
    if (next?.device === 'off') delete next.device;
    // Line draw off (or reset): its duration goes with it, it is hidden and uncounted then.
    if (next && (!next.draw || next.draw === 'off')) {
      delete next.draw;
      delete next.draw_duration;
    }
    if (next?.morph === false) delete next.morph;
    this.onChange?.({ icon_fx: next && Object.keys(next).length ? next : undefined });
  }

  private _setFill(patch: Partial<IconFillConfig>): void {
    this._setFx({ fill: prune({ ...(this._fill ?? {}), ...patch }) ?? {} });
  }

  private _setColors(patch: Partial<IconColorsConfig>): void {
    const next = prune({ ...this._colors, ...patch });
    if (next?.style === 'solid') delete next.style;
    // Keys the style doesn't use are dropped, not kept hidden: the gradient outside Gradient / Value,
    // the angle outside Gradient, the secondary outside Duotone (own SVGs keep it: their accent colour).
    if (next && next.style !== 'gradient' && next.style !== 'value') delete next.gradient;
    if (next && next.style !== 'gradient') delete next.angle;
    if (next && next.style !== 'duotone' && !this._hasAccent) delete next.secondary;
    this._setFx({ colors: next && Object.keys(next).length ? next : undefined });
  }

  private _resetAll(): void {
    this.onChange?.({ icon_fx: undefined });
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    // An icon picked elsewhere (or an undo) while Custom SVG waits for markup: the switch follows it.
    if (changed.has('moduleIcon') && changed.get('moduleIcon') !== undefined && this.moduleIcon !== 'svg') this._svgOn = false;
    // Another module (or an undo) brought a different SVG: drop the local draft and its error.
    if (changed.has('svg') && changed.get('svg') !== undefined && this._svgDraft !== undefined && this.svg !== this._svgDraft) {
      this._svgDraft = undefined;
      this._svgError = undefined;
    }
  }

  // ── icon editor (Draw an icon, Customise this icon, Edit icon) ──

  private async _openEditor(kind: 'draw' | 'customise' | 'edit'): Promise<void> {
    // the button stays enabled while the chunk loads: a disabled button drops focus, and focus must return to it
    if (this._editorState === 'loading') return;
    const module = this.moduleCfg ?? { icon: this.moduleIcon || undefined, svg: this.svg || undefined, icon_on: this.iconOn || undefined, icon_off: this.iconOff || undefined };
    const config = cardState(this)?.getConfig();
    const source =
      kind === 'draw'
        ? ({ kind: 'blank' } as const)
        : kind === 'customise'
          ? ({ kind: 'icon', icon: this.moduleIcon } as const)
          : sourceOfModule(module, config, (await listIcons(this.hass)).state === 'ok') ?? ({ kind: 'blank' } as const);
    this._editorState = 'loading';
    const r = await openIconEditor({
      from: this,
      hass: this.hass,
      module,
      linked: !!this.syncCtx && hasTemplate(this.syncCtx),
      source,
      apply: (patch) => this.onChange?.(patch),
    });
    this._editorState = r === 'failed' ? 'failed' : '';
  }

  private _renderIconEditor(): TemplateResult {
    const icon = this.moduleIcon;
    const kind = icon === 'svg' || icon.startsWith('mcu:') ? 'edit' : icon.includes(':') ? 'customise' : 'draw';
    const label = { edit: t('Edit icon'), customise: t('Customise this icon'), draw: t('Draw an icon') }[kind];
    const loading = this._editorState === 'loading';
    const pack = icon.slice(0, icon.indexOf(':'));
    return html`
      <div class="icon-editor">
        <div class="svg-actions">
          <button type="button" class="btn btn-secondary btn-sm" data-focus-key="icon-entry" aria-busy=${loading ? 'true' : 'false'} @click=${() => void this._openEditor(kind)}>
            <ha-icon icon="mdi:pencil-ruler"></ha-icon>${label}${loading ? html`<span class="sr-only"> ${t('Loading')}</span>` : nothing}
          </button>
        </div>
        ${kind === 'customise'
          ? html`<p class="help">${t('Makes your own copy. The original stays in {pack}.', { pack: pack === 'mdi' ? t('Material Design Icons') : pack })}</p>`
          : nothing}
        ${this._editorState === 'failed'
          ? html`<p class="help error" role="alert">${t('The icon editor could not load. Check your connection and try again.')}</p>`
          : nothing}
        ${this._savedMissing() ? html`<p class="help warn" role="status">${t('Saved icon "{name}" was not found. The card shows the default icon.', { name: icon.slice(4) })}</p>` : nothing}
      </div>
    `;
  }

  /** An `mcu:` icon that neither the library nor a kept copy in the card can draw (design R4). */
  private _savedMissing(): boolean {
    const icon = this.moduleIcon;
    if (!icon.startsWith('mcu:') || !this._saved) return false;
    const id = icon.slice(4);
    if (cardState(this)?.getConfig().custom_icons?.[id]) return false;
    return this._saved.state !== 'ok' || !this._saved.items.some((i) => i.id === id);
  }

  // ── shape hint ──

  protected updated(): void {
    if (this.moduleIcon.startsWith('mcu:') && this.hass && this._savedFor !== this.hass) {
      this._savedFor = this.hass;
      void listIcons(this.hass).then((l) => (this._saved = l));
    }
    const ref = hasIconFx(this._fx) && this.icon && !this._isSvg && this.icon.includes(':') ? this.icon : '';
    if (ref === this._shapeFor) return;
    this._shapeFor = ref;
    this._unlisten?.();
    this._unlisten = undefined;
    this._noShape = false;
    if (!ref) return;
    this._unlisten = svgIconApi()!.onIconGeometry(ref, () => {
      if (this._shapeFor === ref) this._noShape = false;
    });
    void svgIconApi()!.resolveIconGeometry(ref).then((g) => {
      if (this._shapeFor === ref) this._noShape = !g;
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unlisten?.();
    this._unlisten = undefined;
    this._shapeFor = '';
  }

  // ── building blocks ──

  /** The template sync indicator of a module key (only on a template-linked card). */
  private _sync(key: string): TemplateResult | typeof nothing {
    const ctx = this.syncCtx;
    if (!ctx || !hasTemplate(ctx)) return nothing;
    return html`<mc-sync-indicator
      .synced=${!isNotSynced(ctx, key)}
      .hasTemplate=${true}
      .hideIfNoTemplate=${true}
      .propertyPath=${getFullPath(ctx, key)}
      @sync-toggle=${(e: CustomEvent) => {
        e.stopPropagation();
        this.dispatchEvent(
          new CustomEvent('field-sync-toggle', {
            detail: { propertyPath: e.detail.propertyPath, synced: e.detail.synced },
            bubbles: true,
            composed: true,
          }),
        );
      }}
    ></mc-sync-indicator>`;
  }

  private _field(label: string, set: boolean, onReset: (() => void) | undefined, control: TemplateResult, forId?: string, syncKey?: string): TemplateResult {
    return html`
      <div class="field">
        <div class="field-head">
          ${forId ? html`<label for=${forId}>${label}</label>` : html`<span class="lbl">${label}</span>`}
          ${onReset ? fieldReset(label, set, onReset) : nothing}${syncKey ? this._sync(syncKey) : nothing}
        </div>
        ${control}
      </div>
    `;
  }

  private _switch(label: string, on: boolean, onToggle: () => void, help?: string): TemplateResult {
    const id = `fx-sw-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    return html`<div class="switch-row">
      <div class="txt">
        <div class="field-head"><label for=${id}>${label}</label></div>
        ${help ? html`<p class="help" id="${id}-help">${help}</p>` : nothing}
      </div>
      <button
        type="button"
        class="switch"
        id=${id}
        role="switch"
        aria-checked=${on ? 'true' : 'false'}
        aria-label=${label}
        aria-describedby=${help ? `${id}-help` : nothing}
        @click=${onToggle}
      ></button>
    </div>`;
  }

  private _seg(label: string, value: string, options: Opt[], onPick: (v: string) => void): TemplateResult {
    const onKey = (e: KeyboardEvent) => {
      const i = options.findIndex((o) => o.value === value);
      const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (!(e.key in step)) return;
      e.preventDefault();
      const next = options[(i + step[e.key] + options.length) % options.length].value;
      const group = e.currentTarget as HTMLElement;
      onPick(next);
      requestAnimationFrame(() => group.querySelector<HTMLElement>(`[data-val="${next}"]`)?.focus());
    };
    return html`<div class="seg full" role="radiogroup" aria-label=${label} @keydown=${onKey}>
      ${options.map((o) => {
        const on = o.value === value;
        return html`<button type="button" role="radio" data-val=${o.value} aria-checked=${on ? 'true' : 'false'} tabindex=${on ? '0' : '-1'} @click=${() => onPick(o.value)}>${t(o.label)}</button>`;
      })}
    </div>`;
  }

  private _select(id: string, value: string, options: Opt[], onPick: (v: string) => void, describedBy?: string): TemplateResult {
    return html`<div class="select">
      <select class="input" id=${id} aria-describedby=${describedBy || nothing} @change=${(e: Event) => onPick((e.target as HTMLSelectElement).value)}>
        ${options.map((o) => html`<option value=${o.value} ?selected=${o.value === value}>${t(o.label)}</option>`)}
      </select>
      <ha-icon icon="mdi:chevron-down"></ha-icon>
    </div>`;
  }

  private _number(id: string, value: number | undefined, placeholder: number | string, onSet: (n: number | undefined) => void, min?: number, max?: number, step: number | string = 'any'): TemplateResult {
    return html`<input
      class="input"
      id=${id}
      type="number"
      min=${min ?? nothing}
      max=${max ?? nothing}
      step=${step}
      placeholder=${String(placeholder)}
      .value=${value === undefined ? '' : String(value)}
      @input=${(e: InputEvent) => {
        // While typing only a whole number writes: an intermediate "-" or "1e" (value '') keeps the old one.
        const s = (e.target as HTMLInputElement).value;
        const n = Number(s);
        if (s.trim() !== '' && Number.isFinite(n)) onSet(n);
      }}
      @change=${(e: Event) => {
        // Committed empty (not a half-typed number): the value is cleared.
        const input = e.target as HTMLInputElement;
        if (input.value.trim() === '' && !input.validity?.badInput) onSet(undefined);
      }}
    />`;
  }

  private _color(key: string, label: string, value: string | undefined, onSet: (v: string | undefined) => void): TemplateResult {
    const allow = !!this.entity;
    return html`<mc-color-picker
      data-key=${key}
      .value=${value || ''}
      .label=${label}
      .allowEntity=${allow}
      .entityColor=${allow ? entityStateColor(this._stateObj) ?? 'currentColor' : ''}
      @value-changed=${(e: CustomEvent) => onSet(e.detail.value || undefined)}
    ></mc-color-picker>`;
  }

  // ── custom SVG ──

  private _applySvg(text: string, fromUpload = false): void {
    this._svgDraft = text;
    this._svgAlert = fromUpload;
    if (!text.trim()) {
      this._svgError = undefined;
      this.onChange?.({ svg: undefined });
      return;
    }
    const err = customSvgError(text);
    this._svgError = err;
    if (err) return;
    // The first valid SVG switches the icon over, together with the markup (never a blank icon).
    if (this._isSvg) this.onChange?.({ svg: text });
    else this.onChange?.({ icon: 'svg', svg: text });
  }

  private _toggleSvg(): void {
    this._svgDraft = undefined;
    this._svgError = undefined;
    if (this._isSvg) {
      const prev = this._prevIcon;
      this._prevIcon = undefined;
      this._svgOn = false;
      this.onChange?.({ icon: prev || undefined, svg: undefined });
    } else if (this._svgOn) {
      this._svgOn = false;
    } else {
      this._prevIcon = this.moduleIcon;
      this._svgOn = true;
    }
  }

  private async _upload(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > SVG_MAX_BYTES) {
      this._svgError = t('The SVG is larger than 32 KB.');
      this._svgAlert = true;
    } else {
      this._applySvg(await file.text(), true);
    }
    try {
      input.value = '';
    } catch {
      /* some environments don't allow clearing a file input */
    }
  }

  private _renderSvg(): TemplateResult | typeof nothing {
    if (!this.allowSvg) return nothing;
    const on = this._isSvg || this._svgOn;
    const draft = this._svgDraft ?? (this._isSvg ? this.svg : '') ?? '';
    const warning = this._svgError ? undefined : customSvgWarning(draft);
    return html`
      ${this._renderIconEditor()}
      ${this._switch(t('Custom SVG'), on, () => this._toggleSvg(), on ? undefined : t('Draw your own SVG icon instead of one from the icon list.'))}
      ${on
        ? html`${this._field(
            t('SVG markup'),
            !!this.svg,
            () => {
              this._svgDraft = undefined;
              this._svgError = undefined;
              this.onChange?.({ svg: undefined });
            },
            html`<textarea
                class="input mono"
                id="fx-svg"
                spellcheck="false"
                placeholder=${t('<svg viewBox="0 0 24 24">…</svg>')}
                aria-invalid=${this._svgError ? 'true' : 'false'}
                aria-describedby=${this._svgError ? 'fx-svg-error' : warning ? 'fx-svg-help fx-svg-warning' : 'fx-svg-help'}
                .value=${draft}
                @input=${(e: InputEvent) => this._applySvg((e.target as HTMLTextAreaElement).value)}
              ></textarea>
              <div class="svg-msg" aria-live="polite">
                ${this._svgError
                  ? html`<p class="help error" id="fx-svg-error" role=${this._svgAlert ? 'alert' : nothing}>${this._svgError}</p>`
                  : html`<p class="help" id="fx-svg-help">
                      ${t('Up to 32 KB. Parts with fill="currentColor" take the icon colour, parts with class="mc-accent" the accent colour.')}
                    </p>`}
                ${warning ? html`<p class="help warn" id="fx-svg-warning">${warning}</p>` : nothing}
              </div>
              <div class="svg-actions">
                <input type="file" accept=".svg,image/svg+xml" id="fx-svg-file" @change=${(e: Event) => void this._upload(e)} />
                <button type="button" class="btn btn-secondary btn-sm" @click=${() => this.renderRoot.querySelector<HTMLInputElement>('#fx-svg-file')?.click()}>
                  <ha-icon icon="mdi:upload"></ha-icon>${t('Upload SVG')}
                </button>
              </div>`,
            'fx-svg',
            'svg',
          )}`
        : nothing}
    `;
  }

  // ── effect groups ──

  private _renderFill(): TemplateResult {
    const f = this._fill;
    const on = !!f;
    const entity = f?.entity || this.entity;
    const attrs = entity ? Object.keys(this.hass?.states?.[entity]?.attributes || {}) : [];
    const emptyPct = f ? pctOf(f.empty_color) : undefined;
    const emptyIsColor = !!f?.empty_color && emptyPct === undefined;
    return html`
      ${this._switch(t('Liquid fill'), on, () => this._setFx({ fill: on ? undefined : {} }), t('Fills the icon like a liquid with a value, e.g. a battery level.'))}
      ${on
        ? html`
            ${this._field(
              t('Entity'),
              !!f!.entity,
              () => this._setFill({ entity: undefined, attribute: undefined }),
              html`<mc-entity-picker
                .hass=${this.hass}
                .value=${f!.entity || ''}
                .label=${this.entity ? t('Module entity ({entity})', { entity: this.entity }) : t('Entity')}
                @value-changed=${(e: CustomEvent) => this._setFill({ entity: e.detail.value || undefined, attribute: undefined })}
              ></mc-entity-picker>`,
            )}
            ${!entity
              ? html`<p class="help">${t('Pick an entity: a fill without a value stays empty.')}</p>`
              : !f!.entity
                ? html`<p class="help">${t("Empty: the module's entity ({entity}).", { entity: this.entity })}</p>`
                : nothing}
            ${attrs.length
              ? this._field(
                  t('Attribute'),
                  !!f!.attribute,
                  () => this._setFill({ attribute: undefined }),
                  html`<mc-attribute-picker
                    .hass=${this.hass}
                    .entityId=${entity}
                    .value=${f!.attribute || ''}
                    @value-changed=${(e: CustomEvent) => this._setFill({ attribute: e.detail.value || undefined })}
                  ></mc-attribute-picker>`,
                )
              : nothing}
            <div class="two">
              ${this._field(t('Min'), f!.min !== undefined, () => this._setFill({ min: undefined }), this._number('fx-fill-min', f!.min, ICON_FX_DEFAULTS.min, (n) => this._setFill({ min: n })), 'fx-fill-min')}
              ${this._field(t('Max'), f!.max !== undefined, () => this._setFill({ max: undefined }), this._number('fx-fill-max', f!.max, ICON_FX_DEFAULTS.max, (n) => this._setFill({ max: n })), 'fx-fill-max')}
            </div>
            ${this._field(t('Colour'), !!f!.color, () => this._setFill({ color: undefined }), this._color('fill-color', t('Fill colour'), f!.color, (v) => this._setFill({ color: v })))}
            ${this._field(
              t('Empty opacity (%)'),
              f!.empty_color !== undefined,
              () => this._setFill({ empty_color: undefined }),
              html`${this._number('fx-fill-empty', emptyPct, ICON_FX_DEFAULTS.emptyOpacity * 100, (n) => this._setFill({ empty_color: n === undefined ? undefined : `${Math.min(100, Math.max(0, n))}%` }), 0, 100, 5)}
                ${emptyIsColor ? html`<p class="help">${t('The empty part uses the colour {colour} (set in YAML); a value here replaces it.', { colour: String(f!.empty_color) })}</p>` : nothing}`,
              'fx-fill-empty',
            )}
            ${this._switch(t('Wave'), f!.wave !== false, () => this._setFill({ wave: f!.wave === false ? undefined : false }))}
            ${this._field(t('Direction'), !!f!.direction, () => this._setFill({ direction: undefined }), this._seg(t('Direction'), f!.direction ?? 'up', DIRECTIONS, (v) => this._setFill({ direction: v === 'up' ? undefined : (v as IconFillConfig['direction']) })))}
          `
        : nothing}
    `;
  }

  private _deviceHelp(device: string): string {
    if (device !== 'auto') {
      return device === 'off' ? t('Animates the icon like the device it shows.') : t('Pauses while the entity is off or unavailable.');
    }
    if (!this.entity) return t('Pick an entity: Auto animates the icon from its state.');
    const rule = autoDeviceRule(this._stateObj, this.entity);
    if (!rule) return t('Auto has no animation for this entity; pick one.');
    const now = autoDeviceAnim(this._stateObj);
    return t('Auto for this entity: {rule}.', { rule: lt(rule) }) + (now ? ` ${t('Now: {device}.', { device: t(DEVICE_LABEL[now.anim]) })}` : '');
  }

  private _renderDevice(): TemplateResult {
    const device = typeof this._fx.device === 'string' ? this._fx.device : 'off';
    return this._field(
      t('Device animation'),
      device !== 'off',
      () => this._setFx({ device: undefined }),
      html`${this._select('fx-device', device, this.entity || device === 'auto' ? DEVICES : DEVICES.filter((o) => o.value !== 'auto'), (v) => this._setFx({ device: v as IconFxConfig['device'] }), 'fx-device-help')}
        <p class="help" id="fx-device-help">${this._deviceHelp(device)}</p>`,
      'fx-device',
    );
  }

  private _renderDraw(): TemplateResult {
    const draw = this._fx.draw ?? 'off';
    return html`
      ${this._field(t('Line draw'), draw !== 'off', () => this._setFx({ draw: undefined }), this._select('fx-draw', draw, DRAWS, (v) => this._setFx({ draw: v as IconFxConfig['draw'] })), 'fx-draw')}
      ${draw !== 'off'
        ? this._field(
            t('Draw duration'),
            !!this._fx.draw_duration,
            () => this._setFx({ draw_duration: undefined }),
            html`<mc-unit-field
              .value=${this._fx.draw_duration || ''}
              .label=${t('Draw duration')}
              .units=${['s', 'ms']}
              .placeholder=${String(ICON_FX_DEFAULTS.drawDuration)}
              @value-changed=${(e: CustomEvent) => this._setFx({ draw_duration: e.detail.value || undefined })}
            ></mc-unit-field>`,
          )
        : nothing}
    `;
  }

  /** "State icons": always shown for a module with an entity, next to the icon field (outside the sector). */
  private _renderStateIcons(): TemplateResult | typeof nothing {
    if (!this.allowStateIcons) return nothing;
    const iconField = (label: string, key: 'icon_on' | 'icon_off', value: string) =>
      this._field(
        label,
        !!value,
        () => this.onChange?.({ [key]: undefined }),
        html`<mc-icon-picker
          data-key=${key}
          .hass=${this.hass}
          .label=${label}
          .value=${value || ''}
          @value-changed=${(e: CustomEvent) => this.onChange?.({ [key]: e.detail.value || undefined })}
        ></mc-icon-picker>`,
        undefined,
        key,
      );
    return html`<div class="state-icons" role="group" aria-label=${t('State icons')} aria-describedby="fx-state-help">
      <div class="two">${iconField(t('Icon when on'), 'icon_on', this.iconOn)} ${iconField(t('Icon when off'), 'icon_off', this.iconOff)}</div>
      <p class="help" id="fx-state-help">${t("State icons: the icon while the entity is on or off. Empty: the module's icon.")}</p>
    </div>`;
  }

  private _renderMorph(): TemplateResult | typeof nothing {
    if (!this.allowStateIcons) return nothing;
    const on = this._fx.morph === true;
    return html`
      ${this._switch(t('Morph'), on, () => this._setFx({ morph: on ? undefined : true }), t('Morphs between the state icons when the entity turns on or off.'))}
      ${on && !this.iconOn && !this.iconOff ? html`<p class="help">${t("Pick the state icons (Icon when on / off) to morph between; unset sides use the module's icon.")}</p>` : nothing}
    `;
  }

  private _renderColors(): TemplateResult {
    const c = this._colors;
    const style = c.style ?? 'solid';
    const stops = Array.isArray(c.gradient) && c.gradient.length ? c.gradient : [...ICON_FX_DEFAULTS.stops];
    const defaults: readonly string[] = ICON_FX_DEFAULTS.stops;
    // Back to the defaults: no gradient key at all.
    const setStops = (next: string[]) =>
      this._setColors({ gradient: next.length === defaults.length && next.every((x, i) => x === defaults[i]) ? undefined : next });
    // A cleared stop is removed while more than two remain, else it falls back to its default colour:
    // never an empty colour in the list.
    const setStop = (i: number, v: string | undefined) =>
      v
        ? setStops(stops.map((x, j) => (j === i ? v : x)))
        : setStops(stops.length > 2 ? stops.filter((_, j) => j !== i) : stops.map((x, j) => (j === i ? defaults[j] ?? defaults[defaults.length - 1] : x)));
    return html`
      ${this._field(t('Colour style'), !!c.style, () => this._setColors({ style: undefined }), this._seg(t('Colour style'), style, STYLES, (v) => this._setColors({ style: v as IconColorsConfig['style'] })))}
      ${style === 'gradient' || style === 'value'
        ? nothing
        : this._field(style === 'solid' ? t('Colour') : t('Primary colour'), !!c.primary, () => this._setColors({ primary: undefined }), this._color('primary', t('Primary colour'), c.primary, (v) => this._setColors({ primary: v })))}
      ${style === 'duotone'
        ? this._field(t('Secondary colour'), !!c.secondary, () => this._setColors({ secondary: undefined }),
            html`${this._color('secondary', t('Secondary colour'), c.secondary, (v) => this._setColors({ secondary: v }))}
              <p class="help">${t('Empty: the primary colour at {pct}%.', { pct: ICON_FX_DEFAULTS.secondaryPct })}</p>`)
        : this._hasAccent
          ? this._field(t('Accent colour'), !!c.secondary, () => this._setColors({ secondary: undefined }),
              html`${this._color('secondary', t('Accent colour'), c.secondary, (v) => this._setColors({ secondary: v }))}
                <p class="help">${this._isSvg ? t('Parts of the SVG with class="mc-accent".') : t('Parts of the icon drawn in Accent in the icon editor.')}</p>`)
          : nothing}
      ${style === 'gradient' || style === 'value'
        ? html`
            ${this._field(
              t('Gradient colours'),
              Array.isArray(c.gradient) && c.gradient.length > 0,
              () => this._setColors({ gradient: undefined }),
              html`<div class="stops">
                ${stops.map(
                  (s, i) => html`<div class="stop">
                    ${this._color(`stop-${i}`, t('Colour {n}', { n: i + 1 }), s, (v) => setStop(i, v))}
                    ${stops.length > 2
                      ? html`<button type="button" class="icon-btn sm danger" aria-label=${t('Remove colour {n}', { n: i + 1 })} title=${t('Remove colour')} @click=${() => setStops(stops.filter((_, j) => j !== i))}>
                          <ha-icon icon="mdi:delete-outline"></ha-icon>
                        </button>`
                      : nothing}
                  </div>`,
                )}
                <div><button type="button" class="btn btn-text btn-sm" @click=${() => setStops([...stops, stops[stops.length - 1]])}><ha-icon icon="mdi:plus"></ha-icon>${t('Add colour')}</button></div>
              </div>
              ${style === 'value'
                ? html`<p class="help">${t("The colour along these stops follows the value: Liquid fill's entity, min and max, else the module's entity from 0 to 100.")}</p>`
                : nothing}`,
            )}
            ${style === 'gradient'
              ? this._field(t('Angle (deg)'), c.angle !== undefined, () => this._setColors({ angle: undefined }), this._number('fx-angle', c.angle, ICON_FX_DEFAULTS.angle, (n) => this._setColors({ angle: n }), 0, 360, 15), 'fx-angle')
              : nothing}
          `
        : nothing}
    `;
  }

  private _count(): number {
    const fx = this._fx;
    let n = 0;
    if (this._fill) n++;
    if (fx.device && fx.device !== 'off') n++;
    if (fx.draw && fx.draw !== 'off') n++;
    if (fx.morph === true) n++;
    if (Object.keys(this._colors).length) n++;
    return n;
  }

  protected render(): TemplateResult {
    const count = this._count();
    return html`
      ${this._renderSvg()} ${this._renderStateIcons()}
      <div class="sectors">
        <div class="sector">
          <div class="sector-head">
            <button type="button" class="sector-btn" aria-expanded=${this._open ? 'true' : 'false'} aria-controls=${this._open ? 'fx-body' : nothing} @click=${() => (this._open = !this._open)}>
              <ha-icon icon="mdi:creation-outline"></ha-icon>
              <span class="nm">${t('Icon effects')}</span>
              ${count > 0 ? html`<span class="chip is-count">${t('{n} set', { n: count })}</span>` : nothing}
              <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
            </button>
            ${this._sync('icon_fx')}
          </div>
          ${this._open
            ? html`<div class="sector-body" id="fx-body">
                ${count > 0
                  ? html`<div class="sector-reset-row">
                      <button type="button" class="btn btn-text btn-sm sector-reset" aria-label=${t('Reset section Icon effects')} title=${t('Clear every icon effect')} @click=${() => this._resetAll()}>
                        <ha-icon icon="mdi:backup-restore"></ha-icon>${t('Reset section')}
                      </button>
                    </div>`
                  : nothing}
                ${this._noShape
                  ? html`<p class="help" id="fx-shape-hint" role="status">
                      ${t('Effects need the icon shape; this icon could not be loaded (or is a multi-colour logo), so it is shown as is.')}
                    </p>`
                  : nothing}
                ${this._renderFill()} ${this._renderDevice()} ${this._renderDraw()} ${this._renderMorph()} ${this._renderColors()}
              </div>`
            : nothing}
        </div>
      </div>
    `;
  }
}

/** Weather / Forecast note while Animated icons is on: set icon effects are kept, only paused. */
export function animatedIconsNote(fx?: IconFxConfig): string {
  return hasIconFx(fx)
    ? t('Animated weather icons replace icon effects. Your icon effects are paused and come back when Animated icons is off.')
    : t('Animated weather icons replace icon effects.');
}

/**
 * The icon effects editor of a module's General tab: the patch is merged into the module config
 * (removed keys are dropped).
 */
export function renderIconFxEditor<T extends IconFxKeys & { icon?: string }>(
  c: T,
  hass: HomeAssistant | undefined,
  onChange: (next: T) => void,
  opts: { entity?: string; icon?: string; allowSvg?: boolean; allowStateIcons?: boolean; syncCtx?: SyncContext } = {},
): TemplateResult {
  const linked = !!opts.syncCtx && hasTemplate(opts.syncCtx);
  const apply = (patch: IconFxPatch) => onChange(applyIconPatch(c, patch, linked ? opts.syncCtx : undefined) as T);
  return html`<mc-icon-fx-editor
    .hass=${hass}
    .fx=${c.icon_fx}
    .entity=${opts.entity ?? ''}
    .icon=${opts.icon ?? c.icon ?? ''}
    .moduleIcon=${c.icon ?? ''}
    .iconOn=${c.icon_on ?? ''}
    .iconOff=${c.icon_off ?? ''}
    .svg=${c.svg ?? ''}
    .moduleCfg=${c as unknown as Record<string, unknown>}
    .allowSvg=${!!opts.allowSvg}
    .allowStateIcons=${!!opts.allowStateIcons}
    .syncCtx=${opts.syncCtx}
    .onChange=${apply}
  ></mc-icon-fx-editor>`;
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-icon-fx-editor': IconFxEditor;
  }
}
