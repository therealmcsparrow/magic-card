import { LitElement, html, css, nothing, TemplateResult } from 'lit';
import type { PropertyDeclarations } from 'lit';
import { THEME_VAR_RE } from '../contracts/theme-catalogue';
import { kindOf } from './catalogue/index';
import { validateValue } from './model';
import { base } from './styles';
import { fire, parseColor } from './util';

export interface RawEntry {
  name: string;
  value: string;
}

/** `--name: value;` or `name: value` lines (comments and blank lines skipped). Lines that do not fit come back in `failed`. */
export function parseRawLines(text: string): { entries: RawEntry[]; failed: string[] } {
  const entries: RawEntry[] = [];
  const failed: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || line.startsWith('//')) continue;
    const m = /^(?:--)?([A-Za-z0-9][A-Za-z0-9_-]*)\s*:\s*(.+?)\s*;?\s*$/.exec(line);
    if (!m) {
      failed.push(line);
      continue;
    }
    const value = m[2].replace(/^(['"])(.*)\1$/, '$2');
    const bad = rawValueError(m[1], value);
    if (bad || !THEME_VAR_RE.test(m[1])) failed.push(line);
    else entries.push({ name: m[1], value });
  }
  return { entries, failed };
}

/** The liberal check for the raw row, plus the catalogue kind when the name is known. */
export function rawValueError(name: string, value: string): string | null {
  const v = value.trim();
  if (!v) return 'Enter a value.';
  if (/[\r\n]/.test(v)) return 'Use a single line.';
  if (/[;{}]/.test(v)) return 'Remove ; { } from the value.';
  return validateValue(kindOf(name) ?? 'text', v);
}

/**
 * <mcte-raw-rows>: "Add any variable" (design 5.5, 16.7). Name accepts a leading `--` and a pasted
 * block of `key: value` lines. Event: `mcte-add` { entries } (the parent writes them to the scope).
 * `existing` are the names the scope already holds (the button then reads "Update").
 */
export class McteRawRows extends LitElement {
  static properties: PropertyDeclarations = {
    scopeLabel: {},
    existing: { attribute: false },
    prefill: {},
    _name: { state: true },
    _value: { state: true },
    _error: { state: true },
    _status: { state: true },
  };

  scopeLabel = 'Shared';
  existing: ReadonlySet<string> = new Set();
  /** Set by "Add {query} as a variable": the name field takes it and gets the focus. */
  prefill = '';
  private _name = '';
  private _value = '';
  private _error = '';
  private _status = '';

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has('prefill') && this.prefill) {
      this._name = this.prefill;
      this._error = '';
      void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLInputElement>('#raw-name')?.focus());
    }
  }

  private get _cleanName(): string {
    return this._name.trim().replace(/^--/, '');
  }

  private _add(): void {
    const name = this._cleanName;
    if (!name) {
      this._error = 'Enter a name.';
      this._focus('#raw-name');
      return;
    }
    if (!THEME_VAR_RE.test(name)) {
      this._error = 'Use letters, numbers, hyphens and underscores.';
      this._focus('#raw-name');
      return;
    }
    const bad = rawValueError(name, this._value);
    if (bad) {
      this._error = bad;
      this._focus('#raw-value');
      return;
    }
    fire(this, 'mcte-add', { entries: [{ name, value: this._value.trim() }] });
    this._status = `Added ${name} to ${this.scopeLabel}`;
    this._name = '';
    this._value = '';
    this._error = '';
    this._focus('#raw-name');
  }

  private _focus(sel: string): void {
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLInputElement>(sel)?.focus());
  }

  private _paste(e: ClipboardEvent): void {
    const text = e.clipboardData?.getData('text') ?? '';
    if (!/[\r\n]/.test(text) && !/^\s*(?:--)?[\w-]+\s*:\s*\S/.test(text)) return;
    e.preventDefault();
    const { entries, failed } = parseRawLines(text);
    if (entries.length) fire(this, 'mcte-add', { entries });
    this._status = entries.length ? `Added ${entries.length} ${entries.length === 1 ? 'variable' : 'variables'} to ${this.scopeLabel}` : 'Nothing was added';
    this._error = failed.length ? `Could not read: ${failed.join(' | ')}` : '';
    this._name = '';
    this._value = '';
  }

  private _key(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      this._add();
    }
  }

  protected render(): TemplateResult {
    const name = this._cleanName;
    const exists = !!name && this.existing.has(name);
    const colour = !!parseColor(this._value);
    return html`
      <div class="group" role="group" aria-labelledby="raw-title">
        <h3 id="raw-title" class="title">Add any variable</h3>
        <div class="row">
          <div class="cell">
            <label class="lbl" for="raw-name">Name</label>
            <input
              id="raw-name"
              class="input mono"
              spellcheck="false"
              autocomplete="off"
              placeholder="--my-variable"
              aria-invalid=${this._error ? 'true' : 'false'}
              aria-describedby="raw-help"
              .value=${this._name}
              @input=${(e: Event) => ((this._name = (e.target as HTMLInputElement).value), (this._error = ''))}
              @paste=${this._paste}
              @keydown=${this._key}
            />
          </div>
          <div class="cell">
            <label class="lbl" for="raw-value">Value</label>
            <div class="val">
              ${colour ? html`<span class="swatch" style="background:${this._value}" aria-hidden="true"></span>` : nothing}
              <input
                id="raw-value"
                class="input mono"
                spellcheck="false"
                autocomplete="off"
                placeholder="#ff00aa"
                aria-invalid=${this._error ? 'true' : 'false'}
                .value=${this._value}
                @input=${(e: Event) => ((this._value = (e.target as HTMLInputElement).value), (this._error = ''))}
                @keydown=${this._key}
              />
            </div>
          </div>
          <button type="button" class="btn btn-secondary add" @click=${() => this._add()}>${exists ? 'Update' : 'Add'}</button>
        </div>
        <p id="raw-help" class="help">
          ${exists
            ? `This variable already exists in ${this.scopeLabel}. Add will replace its value.`
            : 'Use the name as it appears in the theme file, without the leading dashes. You can also paste several lines of name: value.'}
        </p>
        ${this._error ? html`<p class="help error" role="alert"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"></path></svg>${this._error}</p>` : nothing}
        <p class="help" role="status">${this._status}</p>
      </div>
    `;
  }

  static styles = [
    base,
    css`
      :host {
        display: block;
      }
      .group {
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
        padding: 12px;
        display: grid;
        gap: 8px;
        background: var(--mc-surface);
      }
      .title {
        font-size: 0.9375rem;
        font-weight: 500;
      }
      .row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: flex-end;
      }
      .cell {
        flex: 1 1 140px;
        display: grid;
        gap: 4px;
        min-width: 0;
      }
      .val {
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
    `,
  ];
}
