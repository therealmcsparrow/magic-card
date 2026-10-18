import { LitElement, html, css, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../css/editor-system';
import { HOST_KINDS } from '../contracts/preset-transfer';
import type { ClashChoice, ParseResult, TransferFormat, TransferHost, TransferItem, TransferKind, TransferNote } from '../contracts/preset-transfer';
import { loadRuntime } from '../utils/anim-runtime-loader';
import { loadParticles } from '../utils/particles-loader';
import { checkFileSize, haThemeYaml, parseTransfer, resolveClashes, serialiseTransfer } from './envelope';

/*
 * <mc-transfer-panel> (preset-transfer 1.0.0): import (file or paste, summary, clash choice, kept
 * external values) and export (format, download, copy). It never writes: after the user confirms it
 * dispatches `mc-transfer-import` { kind, items, choice } with the ids already resolved, and the host
 * saves. `mc-transfer-close` on Escape and on Close.
 */

type Ok = Extract<ParseResult, { ok: true }>;

const NOUN: Record<TransferKind, [string, string]> = { animation: ['animation', 'animations'], theme: ['theme', 'themes'], shape: ['shape', 'shapes'], icon: ['icon', 'icons'] };
const count = (n: number, kind: TransferKind): string => `${n} ${NOUN[kind][n === 1 ? 0 : 1]}`;
const KEPT = (n: TransferNote): boolean => n.code === 'external_ref' || n.code === 'card_mod';

@customElement('mc-transfer-panel')
export class TransferPanel extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .wrap {
        display: grid;
        gap: 12px;
      }
      h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
      }
      h3:focus {
        outline: none;
      }
      .row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      input[type='file'] {
        position: absolute;
        width: 1px;
        height: 1px;
        opacity: 0;
      }
      .file:focus-within {
        outline: 2px solid var(--mc-accent);
        outline-offset: 2px;
      }
      ul {
        margin: 0;
        padding-left: 18px;
        font-size: 0.8125rem;
        overflow-wrap: anywhere;
      }
      .box {
        display: grid;
        gap: 6px;
        margin: 0;
        padding: 12px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius);
        min-width: 0;
      }
      .box.warn {
        border-color: var(--mc-warn-ink, #b45309);
      }
      .box.err {
        border-color: var(--mc-error-ink);
        color: var(--mc-error-ink);
      }
      .box strong {
        font-weight: 600;
      }
      .opt {
        display: flex;
        gap: 8px;
        align-items: center;
        min-height: 32px;
      }
    `,
  ];

  @property({ type: String }) host: TransferHost = 'card-editor';
  @property({ type: String }) mode: 'import' | 'export' = 'import';
  @property({ attribute: false }) exportItems?: { kind: TransferKind; items: TransferItem[] };
  @property({ attribute: false }) taken: (kind: TransferKind, id: string) => boolean = () => false;
  @property({ type: Boolean }) hasLibrary = true;

  @state() private _res?: ParseResult;
  @state() private _choice: ClashChoice = 'keep-both';
  @state() private _format: TransferFormat = 'yaml';
  @state() private _done = '';

  private _fileName = '';

  private _focusHeading(): void {
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('h3')?.focus());
  }

  private async _read(text: string, fileName?: string): Promise<void> {
    this._fileName = fileName ?? '';
    // v2 fields and particle simulations are checked by validators that live in lazy chunks of the card; load them first
    const need = (re: RegExp, load: () => Promise<unknown>): Promise<unknown> => (re.test(text) ? load() : Promise.resolve(true));
    const ok = await Promise.all([need(/\b(?:rig|tracks|clips|bindings)\b/, loadRuntime), need(/\bsim\b/, loadParticles)]);
    this._res = ok.every(Boolean)
      ? parseTransfer(text, { accept: HOST_KINDS[this.host], fileName })
      : { ok: false, refusal: 'limits', message: 'The checker for these animations did not load, so the file was not read. Check your connection and try again.' };
    this._choice = 'keep-both';
    this._focusHeading();
  }

  private async _onFile(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const refused = checkFileSize(file);
    if (refused && !refused.ok) {
      this._res = { ok: false, refusal: refused.refusal, message: refused.message };
      this._focusHeading();
    } else await this._read(await file.text(), file.name);
    input.value = '';
  }

  private _close = (): void => void this.dispatchEvent(new CustomEvent('mc-transfer-close', { bubbles: true, composed: true }));

  private _key = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape') return;
    e.stopPropagation();
    this._close();
  };

  private _confirm(): void {
    const r = this._res;
    if (!r?.ok) return;
    const items = resolveClashes(r.items, (id) => this.taken(r.kind, id), this._choice);
    this.dispatchEvent(new CustomEvent('mc-transfer-import', { bubbles: true, composed: true, detail: { kind: r.kind, items, choice: this._choice } }));
    this._res = undefined;
  }

  /** Notes shown to the user: step refs the target already has are not a problem. */
  private _notes(r: Ok): TransferNote[] {
    return r.notes.filter((n) => {
      const id = n.code === 'missing_step_ref' ? /"custom:([^"]+)"/.exec(n.message)?.[1] : undefined;
      return !(id && this.taken('animation', id));
    });
  }

  render(): TemplateResult {
    return html`<div class="wrap" @keydown=${this._key}>${this.mode === 'export' ? this._export() : this._import()}</div>`;
  }

  // ── import ──
  private _import(): TemplateResult {
    const r = this._res;
    const accept = HOST_KINDS[this.host].includes('icon') ? '.yaml,.yml,.json,.svg' : '.yaml,.yml,.json';
    return html`
      <h3 tabindex="-1">${r ? (r.ok ? `Import ${count(r.items.length, r.kind)}` : 'This file was not imported') : 'Import presets'}</h3>
      <div class="row">
        <label class="btn btn-secondary file"><input type="file" accept=${accept} @change=${this._onFile} />Choose a file</label>
        <span class="help">${accept.replace(/\./g, '').replace(/,/g, ', ')}, up to 1 MB</span>
      </div>
      <div class="field">
        <div class="field-head"><label for="paste">Or paste the text</label></div>
        <textarea id="paste" class="input" spellcheck="false"></textarea>
        <div class="row">
          <button class="btn btn-secondary" @click=${() => void this._read(this.renderRoot.querySelector<HTMLTextAreaElement>('#paste')!.value)}>Read</button>
          <button class="btn btn-text" @click=${this._close}>Close</button>
        </div>
      </div>
      <div role="status" aria-live="polite" class="help">${r?.ok ? this._summary(r) : ''}</div>
      ${r && !r.ok ? html`<div class="box err" role="alert">${r.message}</div>` : r ? this._result(r) : nothing}
    `;
  }

  private _summary(r: Ok): string {
    const n = this._notes(r);
    const kept = n.filter(KEPT).length;
    return `${this._fileName || 'The text'} holds ${count(r.items.length, r.kind)}.${kept ? ` ${kept} values are kept as written. Check the list below.` : ''}${n.length - kept ? ` ${n.length - kept} notes.` : ''}`;
  }

  private _result(r: Ok): TemplateResult {
    const notes = this._notes(r);
    const kept = notes.filter(KEPT);
    const local = notes.filter((n) => n.code === 'local_path');
    const rest = notes.filter((n) => !KEPT(n) && n.code !== 'local_path');
    const clashes = r.items.filter((i) => this.taken(r.kind, i.id));
    const blocked = r.kind === 'theme' && !this.hasLibrary;
    const name = (n: TransferNote): string => (r.items[n.item] ? `${r.items[n.item].name}: ` : '');
    const hosts = [...new Set(kept.flatMap((n) => n.hosts ?? []))];
    return html`
      <ul>
        ${r.items.map((i) => html`<li>${i.name}${this.taken(r.kind, i.id) ? html` <span class="help">(you have this one)</span>` : nothing}</li>`)}
      </ul>
      ${kept.length
        ? html`<div class="box warn">
            <strong>${kept.length} ${kept.length === 1 ? 'value is' : 'values are'} kept as written</strong>
            <span class="help">${hosts.length ? `Using this theme makes each browser ask ${hosts.join(', ')} for files, so those sites see its address. ` : ''}Lines that start with card-mod- only work when card-mod is installed, and they can restyle any card.</span>
            <ul>
              ${kept.map((n) => html`<li>${name(n)}<span class="mono">${n.path.replace(/^data\./, '')}</span>${n.hosts?.length ? ` (${n.hosts.join(', ')})` : ''}</li>`)}
            </ul>
          </div>`
        : nothing}
      ${local.length ? html`<p class="help">${local.length} values point to files on the sharer's Home Assistant (url(/local/...)). They may not exist on your system.</p>` : nothing}
      ${rest.length
        ? html`<details class="box">
            <summary>${rest.length} ${rest.length === 1 ? 'note' : 'notes'}</summary>
            <ul>
              ${rest.map((n) => html`<li>${name(n)}${n.message}</li>`)}
            </ul>
          </details>`
        : nothing}
      ${r.kind !== 'theme' && !this.hasLibrary ? html`<p class="help">Magic Card Utils is not installed, so these are saved as copies inside this card.</p>` : nothing}
      ${blocked ? html`<div class="box err" role="alert">Update Magic Card Utils to keep theme presets.</div>` : nothing}
      ${clashes.length
        ? html`<fieldset class="box">
            <legend>${count(clashes.length, r.kind)} already ${clashes.length === 1 ? 'exists' : 'exist'}</legend>
            ${(['keep-both', 'replace'] as const).map(
              (c) => html`<label class="opt"><input type="radio" name="clash" .checked=${this._choice === c} @change=${() => (this._choice = c)} />${c === 'replace' ? 'Replace them' : 'Keep both (the new ones get a number)'}</label>`,
            )}
          </fieldset>`
        : nothing}
      <div class="row">
        <button class="btn btn-primary" ?disabled=${blocked} @click=${() => this._confirm()}>${kept.length ? 'Import anyway' : `Import ${count(r.items.length, r.kind)}`}</button>
        <button class="btn btn-text" @click=${() => (this._res = undefined)}>Cancel</button>
      </div>
    `;
  }

  // ── export ──
  private _text(): string {
    const e = this.exportItems;
    return e ? serialiseTransfer(e.kind, e.items, this._format) : '';
  }

  private _name(): string {
    const e = this.exportItems!;
    return `magic-card-${e.kind}${e.items.length === 1 ? `-${e.items[0].id}` : `s-${e.items.length}`}.${this._format === 'json' ? 'json' : 'yaml'}`;
  }

  private _download(): void {
    const url = URL.createObjectURL(new Blob([this._text()], { type: this._format === 'json' ? 'application/json' : 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = this._name();
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this._done = `Downloaded ${a.download}.`;
  }

  private async _copy(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this._done = 'Copied.';
    } catch {
      this.renderRoot.querySelector<HTMLTextAreaElement>('#out')?.select();
      this._done = 'Could not copy. The text is selected: press Ctrl+C.';
    }
  }

  private _export(): TemplateResult {
    const e = this.exportItems;
    if (!e?.items.length) return html`<p class="help" role="status">Nothing to export.</p>`;
    const text = this._text();
    return html`
      <h3 tabindex="-1">Export ${count(e.items.length, e.kind)}</h3>
      <fieldset class="box">
        <legend>File format</legend>
        <div class="row">${(['yaml', 'json'] as const).map((f) => html`<label class="opt"><input type="radio" name="fmt" .checked=${this._format === f} @change=${() => (this._format = f)} />${f.toUpperCase()}</label>`)}</div>
      </fieldset>
      <textarea id="out" class="input" readonly aria-label="Export text" .value=${text} @focus=${(ev: Event) => (ev.target as HTMLTextAreaElement).select()}></textarea>
      <div class="row">
        <button class="btn btn-primary" @click=${() => this._download()}>Download</button>
        <button class="btn btn-secondary" @click=${() => this._copy(text)}>Copy</button>
        ${e.kind === 'theme' && e.items.length === 1 ? html`<button class="btn btn-secondary" @click=${() => this._copy(haThemeYaml(e.items[0].name, e.items[0].data as never))}>Copy as HA theme</button>` : nothing}
        <button class="btn btn-text" @click=${this._close}>Close</button>
      </div>
      <div role="status" aria-live="polite" class="help">${this._done}</div>
    `;
  }
}
