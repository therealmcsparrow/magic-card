import { LitElement, html, css, nothing, TemplateResult } from 'lit';
import type { PropertyDeclarations } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import type { CatalogueEntry, CatalogueGroup } from '../contracts/theme-catalogue';
import type { ThemeDoc, ThemeMode } from '../contracts/theme-editor';
import { icon } from './icons';
import { groupPreview, previewCardsEvents } from './preview-cards';
import { base } from './styles';
import { fire, ownValue, overriddenIn, SCOPE_LABEL } from './util';
import type { Scope } from './util';

export interface FieldRow {
  entry: CatalogueEntry;
  /** True when the group's card reads a variable another group owns. */
  follows: boolean;
  /** A variable in the file the catalogue does not know (group "Other"). */
  custom?: boolean;
}

export interface FieldHint {
  text: string;
  /** true: passes; false: fails; null: not measured. */
  ok: boolean | null;
}

export interface FieldCtx {
  doc: ThemeDoc;
  scope: Scope;
  hasModes: boolean;
  /** Error message by variable name, for the scope being edited. */
  errors: ReadonlyMap<string, string>;
  hints: ReadonlyMap<string, FieldHint>;
  /** Names edited in Shared this session (they get the "no effect" check). */
  touched: ReadonlySet<string>;
  readOnly: boolean;
}

const GRADIENT_MSG = 'This variable takes a single colour. Gradients work in Card background and Dashboard background.';
const COLOUR_MSG = 'This is not a colour. Pick one with the swatch, or type a value like #3b82f6 or teal.';
const modeLabel = (m: ThemeMode): string => (m === 'light' ? 'Light' : 'Dark');
const isColour = (entry: CatalogueEntry): boolean => entry.kind === 'color' || entry.kind === 'background';

/** The text under a field for an error from model.validateValue (colour fields lead with the picker). */
export const fieldErrorText = (entry: CatalogueEntry, message: string): string => {
  if (entry.kind === 'color') return /gradient/i.test(message) ? GRADIENT_MSG : message.startsWith('Enter a colour') ? COLOUR_MSG : message;
  return message;
};

/**
 * <mcte-field-group>: one accordion group of variable fields (design 5.3 and 5.4). Closed groups
 * render nothing inside. Events (all composed): `mcte-toggle` { id }, `mcte-set` { name, value } (an
 * empty value removes the key), `mcte-reset` { name }, `mcte-set-modes` { name, modes }, `mcte-copy`
 * { text, what }. Colour fields use `mc-color-picker` by tag (defined by magic-card.js).
 */
export class McteFieldGroup extends LitElement {
  static properties: PropertyDeclarations = {
    group: { attribute: false },
    rows: { attribute: false },
    ctx: { attribute: false },
    open: { type: Boolean },
    hass: { attribute: false },
    setCount: { type: Number },
    _kept: { state: true },
  };

  group!: CatalogueGroup;
  rows: FieldRow[] = [];
  ctx!: FieldCtx;
  open = false;
  hass: unknown;
  /** How many variables of this group the theme sets (any scope). */
  setCount = 0;
  private _kept = new Set<string>();
  private readonly _timers = new Map<string, ReturnType<typeof setTimeout>>();

  private readonly _onCards = (): void => this.requestUpdate();

  connectedCallback(): void {
    super.connectedCallback();
    previewCardsEvents.addEventListener('change', this._onCards);
  }

  disconnectedCallback(): void {
    previewCardsEvents.removeEventListener('change', this._onCards);
    for (const t of this._timers.values()) clearTimeout(t);
    this._timers.clear();
    super.disconnectedCallback();
  }

  protected updated(): void {
    this._markPickers();
  }

  /**
   * The colour picker owns its textbox (another shadow root), so an error cannot be linked by id. Set
   * aria-invalid and an aria-description on that textbox instead, once the picker has drawn it.
   */
  private _markPickers(): void {
    for (const f of this.renderRoot.querySelectorAll<HTMLElement>('.field')) {
      const picker = f.querySelector<HTMLElement & { updateComplete?: Promise<unknown> }>('mc-color-picker');
      if (!picker) continue;
      const apply = (): void => {
        const input = picker.shadowRoot?.querySelector<HTMLInputElement>('input[type="text"]');
        if (!input) return;
        const err = f.querySelector('.help.error span')?.textContent;
        if (err) {
          input.setAttribute('aria-invalid', 'true');
          input.setAttribute('aria-description', err);
        } else {
          input.removeAttribute('aria-invalid');
          input.removeAttribute('aria-description');
        }
      };
      apply();
      void picker.updateComplete?.then(apply);
    }
  }

  /** The id of a field's focus target, for "jump to the first problem". */
  focusField(name: string): void {
    const root = this.renderRoot;
    const el = root.querySelector<HTMLElement>(`#in-${CSS.escape(name)}`) ?? root.querySelector<HTMLElement>(`#f-${CSS.escape(name)} mc-color-picker`);
    if (el && 'focus' in el) el.focus();
    const picker = root.querySelector<HTMLElement>(`#f-${CSS.escape(name)} mc-color-picker`);
    (picker?.shadowRoot?.querySelector('input') as HTMLElement | null | undefined)?.focus();
  }

  private get _notInstalled(): boolean {
    return this.group.id !== 'magic-card' && groupPreview(this.group.id).state === 'unavailable';
  }

  private _commit(name: string, value: string, shown: string, own: boolean): void {
    const v = value.trim();
    if (!own && v === shown) return;
    if (!own && v === '') return;
    fire(this, 'mcte-set', { name, value: v });
  }

  private _typed(e: Event, name: string, shown: string, own: boolean): void {
    const v = (e.target as HTMLInputElement).value;
    clearTimeout(this._timers.get(name));
    this._timers.set(
      name,
      setTimeout(() => {
        this._timers.delete(name);
        this._commit(name, v, shown, own);
      }, 80),
    );
  }

  private _changed(e: Event, name: string, shown: string, own: boolean): void {
    clearTimeout(this._timers.get(name));
    this._timers.delete(name);
    this._commit(name, (e.target as HTMLInputElement).value, shown, own);
  }

  private _step(e: KeyboardEvent, name: string, shown: string, own: boolean): void {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    const input = e.target as HTMLInputElement;
    const m = /^(-?\d*\.?\d+)\s*([a-z%]*)$/i.exec(input.value.trim());
    if (!m) return;
    e.preventDefault();
    const n = Math.round((parseFloat(m[1]) + (e.shiftKey ? 10 : 1) * (e.key === 'ArrowUp' ? 1 : -1)) * 100) / 100;
    input.value = `${n}${m[2]}`;
    this._commit(name, input.value, shown, own);
  }

  private _control(row: FieldRow, shown: string, own: boolean, err: string | undefined, label: string): TemplateResult {
    const { entry } = row;
    const name = entry.name;
    if (isColour(entry) && !this.ctx.readOnly) {
      return html`<mc-color-picker
        .value=${shown}
        .label=${label}
        .gradient=${entry.kind === 'background' ? 'css' : ''}
        @value-changed=${(e: CustomEvent) => {
          e.stopPropagation();
          this._commit(name, String(e.detail?.value ?? ''), shown, own);
        }}
      ></mc-color-picker>`;
    }
    const rgb = entry.kind === 'rgb' && !err && shown ? shown : '';
    // A read-only theme shows its colours as text with a swatch; the picker is for editing only.
    const look = isColour(entry) && shown ? shown : '';
    return html`<div class="ctl">
      ${rgb ? html`<span class="swatch" style="background:rgb(${rgb})" aria-hidden="true"></span>` : nothing}
      ${look ? html`<span class="swatch" style=${styleMap({ background: look })} aria-hidden="true"></span>` : nothing}
      <input
        id="in-${name}"
        class="input mono"
        spellcheck="false"
        autocomplete="off"
        inputmode=${entry.kind === 'number' ? 'decimal' : 'text'}
        placeholder=${entry.default || 'Not set'}
        aria-invalid=${err ? 'true' : 'false'}
        aria-describedby=${ifDefined(err ? `err-${name}` : undefined)}
        ?readonly=${this.ctx.readOnly}
        .value=${shown}
        @input=${(e: Event) => this._typed(e, name, shown, own)}
        @change=${(e: Event) => this._changed(e, name, shown, own)}
        @keydown=${(e: KeyboardEvent) => (entry.kind === 'size' || entry.kind === 'number') && this._step(e, name, shown, own)}
      />
    </div>`;
  }

  private _noEffect(name: string, value: string): TemplateResult | typeof nothing {
    const { doc, scope, hasModes, touched } = this.ctx;
    if (scope !== 'shared' || !hasModes || !touched.has(name)) return nothing;
    const others = overriddenIn(doc, scope, name);
    const key = `${name}:${others.join()}`;
    if (!others.length || this._kept.has(key)) return nothing;
    const both = others.length === 2;
    const covered = (['light', 'dark'] as ThemeMode[]).filter((m) => !others.includes(m));
    const text = both
      ? 'Light and Dark both use their own value, so this has no effect.'
      : `${modeLabel(others[0])} uses its own value. This only changes ${modeLabel(covered[0])}.`;
    return html`<div class="callout is-warn" role="group" aria-label="Shared value has no effect">
      ${icon('alert')}
      <div class="body">
        <p>${text}</p>
        <div class="actions">
          <button type="button" class="btn btn-secondary btn-sm" @click=${() => fire(this, 'mcte-set-modes', { name, value, modes: others })}>
            ${both ? 'Set in both' : `Set in ${modeLabel(others[0])} too`}
          </button>
          <button type="button" class="btn btn-text btn-sm" @click=${() => (this._kept = new Set(this._kept).add(key))}>Keep in Shared only</button>
        </div>
      </div>
    </div>`;
  }

  /** True for a non-colour variable that only one mode sets: the other mode gets nothing (Ruben: sizes land in one mode). */
  private _onlyIn(row: FieldRow, name: string): ThemeMode | null {
    const { doc, scope, hasModes } = this.ctx;
    if (!hasModes || scope === 'shared' || isColour(row.entry) || row.entry.kind === 'rgb') return null;
    if (row.custom && /color|background/.test(name)) return null;
    if (ownValue(doc, scope, name) === undefined || ownValue(doc, 'shared', name) !== undefined) return null;
    return overriddenIn(doc, scope, name).length ? null : scope;
  }

  private _modeOnly(name: string, value: string, scope: ThemeMode): TemplateResult | typeof nothing {
    const key = `${name}:only:${scope}`;
    if (!this.ctx.touched.has(name) || this._kept.has(key)) return nothing;
    const other: ThemeMode = scope === 'light' ? 'dark' : 'light';
    return html`<div class="callout is-warn" role="group" aria-label="Value set in one mode only">
      ${icon('alert')}
      <div class="body">
        <p>Only ${modeLabel(scope)} gets this value. ${modeLabel(other)} keeps the default.</p>
        <div class="actions">
          <button type="button" class="btn btn-secondary btn-sm" @click=${() => fire(this, 'mcte-set-modes', { name, value, modes: [other] })}>Set in both</button>
          <button type="button" class="btn btn-secondary btn-sm" @click=${() => fire(this, 'mcte-move-shared', { name, value })}>Move to Shared</button>
          <button type="button" class="btn btn-text btn-sm" @click=${() => (this._kept = new Set(this._kept).add(key))}>Keep in ${modeLabel(scope)} only</button>
        </div>
      </div>
    </div>`;
  }

  private _field(row: FieldRow): TemplateResult {
    const { entry, custom } = row;
    const name = entry.name;
    const { doc, scope, hasModes, errors, hints } = this.ctx;
    const ownV = ownValue(doc, scope, name);
    const sharedV = scope === 'shared' ? undefined : ownValue(doc, 'shared', name);
    const own = ownV !== undefined;
    const state = own ? 'set' : sharedV !== undefined ? 'shared' : 'default';
    const shown = String(ownV ?? sharedV ?? '');
    const rawErr = errors.get(name);
    const err = rawErr ? fieldErrorText(entry, rawErr) : undefined;
    const label = custom ? name : entry.label;
    const others = hasModes ? overriddenIn(doc, scope, name) : [];
    const hint = hints.get(name);
    const scopeName = SCOPE_LABEL[scope];
    const statusText = state === 'set' ? 'Set here' : state === 'shared' ? 'Shared' : 'Default';
    const sharedValues =
      scope === 'shared' && others.length
        ? others.map((m) => `${modeLabel(m)} ${ownValue(doc, m, name)}`).join(', ')
        : '';
    const only = this._onlyIn(row, name);
    return html`<div class="field ${err ? 'bad' : ''}" id="f-${name}" data-state=${state}>
      <div class="head">
        ${isColour(entry) && !this.ctx.readOnly
          ? html`<span class="lbl" id="lbl-${name}">${label}</span>`
          : html`<label class="lbl ${custom ? 'mono' : ''}" for="in-${name}">${label}</label>`}
        <span class="status help">${statusText}</span>
        ${custom ? html`<span class="chip">Custom</span>` : nothing}
        ${row.follows ? html`<span class="chip">Home Assistant variable</span>` : nothing}
        ${others.length ? html`<span class="chip">Also set in ${others.map(modeLabel).join(' and ')}</span>` : nothing}
        ${only ? html`<span class="chip is-warn">Only in ${modeLabel(only)}</span>` : nothing}
        ${own && !this.ctx.readOnly
          ? html`<button type="button" class="icon-btn sm reset" aria-label="Remove ${label} from ${scopeName}" title="Remove from ${scopeName}" @click=${() => fire(this, 'mcte-reset', { name })}>
              ${icon('reset')}
            </button>`
          : nothing}
      </div>
      ${custom
        ? nothing
        : html`<button type="button" class="key mono" aria-label="Copy key ${name}" @click=${() => fire(this, 'mcte-copy', { text: name, what: 'key' })}>${name}</button>`}
      ${this._control(row, shown, own, err, label)}
      ${err ? html`<p class="help error" id="err-${name}" role="alert">${icon('alert')}<span>${err}</span></p>` : nothing}
      ${state === 'shared' ? html`<p class="help">Shared: ${sharedV}</p>` : nothing}
      ${state === 'default' ? html`<p class="help">${entry.default ? `Default: ${entry.default}` : 'Not set'}</p>` : nothing}
      ${sharedValues ? html`<p class="help">${sharedValues}</p>` : nothing}
      ${entry.hint ? html`<p class="help">${entry.hint}</p>` : nothing}
      ${hint
        ? html`<p class="help hint ${hint.ok === false ? 'bad' : ''}" aria-live="polite">${hint.ok === null ? icon('info') : icon(hint.ok ? 'check' : 'alert')}<span>${hint.text}</span></p>`
        : nothing}
      ${this._noEffect(name, shown)} ${only ? this._modeOnly(name, shown, only) : nothing}
    </div>`;
  }

  protected render(): TemplateResult {
    const g = this.group;
    const missing = this._notInstalled;
    return html`<section class="grp ${this.open ? 'open' : ''}" data-group=${g.id}>
      <h3>
        <button type="button" class="sector-btn" aria-expanded=${this.open ? 'true' : 'false'} aria-controls="body-${g.id}" @click=${() => fire(this, 'mcte-toggle', { id: g.id })}>
          <span class="gname">${g.label}</span>
          ${this.setCount ? html`<span class="chip">${this.setCount} set</span>` : nothing}
          ${missing ? html`<span class="chip">${icon('info')} Not installed here</span>` : nothing}
          ${icon('chevron', 'chev')}
        </button>
      </h3>
      <div class="sector-body" id="body-${g.id}">
        ${this.open
          ? html`${g.previewTag ? html`<mcte-group-preview .hass=${this.hass} .group=${g.id}></mcte-group-preview>` : nothing}
            ${repeat(this.rows, (r) => r.entry.name, (r) => this._field(r))}`
          : nothing}
      </div>
    </section>`;
  }

  static styles = [
    base,
    css`
      :host {
        display: block;
      }
      .grp {
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
        background: var(--mc-surface);
        overflow: clip;
      }
      h3 {
        font-size: 1rem;
      }
      .sector-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        min-height: 48px;
        padding: 0 12px;
        border: 0;
        background: transparent;
        cursor: pointer;
        text-align: left;
        scroll-margin-top: var(--stack-h, 0px);
      }
      .gname {
        flex: 1 1 auto;
        font-weight: 500;
        overflow-wrap: anywhere;
      }
      .chev {
        transition: transform 0.15s;
      }
      .open .chev {
        transform: rotate(180deg);
      }
      .sector-body {
        display: grid;
        gap: 0;
      }
      .open .sector-body {
        border-top: 1px solid var(--mc-divider);
      }
      .sector-body > .help {
        padding: 8px 12px 0;
      }
      .field {
        display: grid;
        gap: 6px;
        padding: 12px;
        border-bottom: 1px solid var(--mc-divider);
        scroll-margin-top: var(--stack-h, 0px);
        min-width: 0;
      }
      .field.bad {
        box-shadow: inset 4px 0 0 var(--mc-error-ink);
      }
      .field:last-child {
        border-bottom: 0;
      }
      .head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 8px;
      }
      .head .lbl {
        flex: 1 1 auto;
        font-size: 0.8125rem;
        font-weight: 500;
        overflow-wrap: anywhere;
      }
      .key {
        justify-self: start;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: pointer;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        text-align: left;
        overflow-wrap: anywhere;
        min-height: 20px;
      }
      .key:hover {
        text-decoration: underline;
      }
      .ctl {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .swatch {
        flex: none;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        border: 1px solid var(--mc-field-border);
      }
      .hint {
        display: flex;
        gap: 6px;
        align-items: center;
      }
      .hint .ico {
        width: 16px;
        height: 16px;
      }
      .hint.bad {
        color: var(--mc-error-ink);
      }
      .callout {
        padding: 8px 10px;
      }
      mc-color-picker {
        display: block;
      }
    `,
  ];
}
