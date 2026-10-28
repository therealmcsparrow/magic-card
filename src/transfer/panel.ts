import { LitElement, html, css, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorTokens } from '../css/editor-system';
import { button, editorPrimitives, glyph, kitCss, notice, seg } from '../ui-kit';
import { HOST_KINDS } from '../contracts/preset-transfer';
import type { ClashChoice, ParseResult, TransferFormat, TransferHost, TransferItem, TransferKind, TransferNote } from '../contracts/preset-transfer';
import { loadSvgCss } from '../svg-safety/css-loader';
import { loadRuntime } from '../utils/anim-runtime-loader';
import { loadParticles } from '../utils/particles-loader';
import { checkFileSize, haThemeYaml, parseTransfer, resolveClashes, serialiseTransfer } from './envelope';
import { count } from './count';
import { looksLikeSvg } from '../svg-io/looks-like-svg';
import { loadImageTransfer } from './image-transfer-loader';
import { locale, t } from './i18n';

/*
 * <mc-transfer-panel> (preset-transfer 1.0.0): import (file or paste, summary, clash choice, kept
 * external values) and export (format, download, copy). It never writes: after the user confirms it
 * dispatches `mc-transfer-import` { kind, items, choice } with the ids already resolved, and the host
 * saves. `mc-transfer-close` on Escape and on Close.
 */

type Ok = Extract<ParseResult, { ok: true }>;

const KEPT = (n: TransferNote): boolean => n.code === 'external_ref' || n.code === 'card_mod';

@customElement('mc-transfer-panel')
export class TransferPanel extends LitElement {
  // kit parts plus layout only (contract ui-kit 1.0.0: a screen styles its own layout, never a kit class)
  static styles = [
    editorTokens,
    editorPrimitives,
    ...kitCss,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .wrap {
        display: grid;
        gap: 12px;
      }
      h3:focus,
      #res:focus {
        outline: none;
      }
      .res {
        margin: 0;
        font-weight: 600;
        font-size: 0.875rem;
      }
      .bar {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      ul {
        margin: 0;
        padding-left: 18px;
        font-size: 0.8125rem;
        overflow-wrap: anywhere;
      }
    `,
  ];

  @property({ type: String }) host: TransferHost = 'card-editor';
  @property({ type: String }) mode: 'import' | 'export' = 'import';
  @property({ attribute: false }) exportItems?: { kind: TransferKind; items: TransferItem[] };
  @property({ attribute: false }) taken: (kind: TransferKind, id: string) => boolean = () => false;
  @property({ type: Boolean }) hasLibrary = true;
  /** Narrows the kinds the host accepts (the library view on its Images tab passes ['image']). */
  @property({ attribute: false }) accept?: readonly TransferKind[];
  /** (optional) Ids another library holds (renamed on import) and names the target already shows (numbered on import). */
  @property({ attribute: false }) reserved?: (kind: TransferKind, id: string) => boolean;
  @property({ attribute: false }) takenName?: (kind: TransferKind, name: string) => boolean;

  @state() private _res?: ParseResult;
  @state() private _choice: ClashChoice = 'keep-both';
  @state() private _format: TransferFormat = 'yaml';
  @state() private _done = '';

  private _fileName = '';

  private _kinds(): readonly TransferKind[] {
    return this.accept ?? HOST_KINDS[this.host];
  }

  /** Images are written as JSON only. */
  private _fmt(): TransferFormat {
    return this.exportItems?.kind === 'image' ? 'json' : this._format;
  }

  focusHeading(): void {
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('h3')?.focus());
  }

  /** After a file is read: focus the result line and bring it into view, so the list of kept values is not left below the fold of a short window. */
  private focusResult(): void {
    void this.updateComplete.then(() => {
      const el = this.renderRoot.querySelector<HTMLElement>('#res');
      if (!el) return this.focusHeading();
      el.focus({ preventScroll: true });
      el.scrollIntoView?.({ block: 'start' });
    });
  }

  private async _read(text: string, fileName?: string): Promise<void> {
    this._fileName = fileName ?? '';
    // v2 fields and particle simulations are checked by validators that live in lazy chunks of the card; load them first
    const need = (re: RegExp, load: () => Promise<unknown>): Promise<unknown> => (re.test(text) ? load() : Promise.resolve(true));
    const ok = await Promise.all([need(/\b(?:rig|tracks|clips|bindings)\b/, loadRuntime), need(/\bsim\b/, loadParticles)]);
    // an image file is checked by the image-transfer chunk, so that chunk is loaded before the text is read
    const kinds = this._kinds();
    const onlyImages = kinds.length === 1 && kinds[0] === 'image';
    // images only: an .svg file, or text whose first element is <svg (the test parseTransfer uses), is one image
    const asksImages = /"kind"\s*:\s*"image"/.test(text) || (onlyImages && looksLikeSvg(text, fileName));
    const wantsImages = asksImages && kinds.includes('image');
    // an SVG text is opened here as an icon or an image, so its styles are resolved; preset files never take the resolver
    const wantsCss = looksLikeSvg(text, fileName) && (kinds.includes('icon') || onlyImages);
    const [images, css] = await Promise.all([wantsImages ? loadImageTransfer() : undefined, wantsCss ? loadSvgCss() : undefined]);
    this._res =
      ok.every(Boolean) && (images || !wantsImages)
        ? parseTransfer(text, { accept: this._kinds(), fileName, images, css })
        : { ok: false, refusal: 'limits', message: wantsImages ? t('transfer.panel.the-checker-for-images-did-not-load-so') : t('transfer.panel.the-checker-for-these-animations-did-not') };
    this._choice = 'keep-both';
    this.focusResult();
  }

  private async _onFile(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const refused = checkFileSize(file, this._kinds());
    if (refused && !refused.ok) {
      this._res = { ok: false, refusal: refused.refusal, message: refused.message };
      this.focusResult();
    } else await this._read(await file.text(), file.name);
    input.value = '';
  }

  private _close = (): void => void this.dispatchEvent(new CustomEvent('mc-transfer-close', { bubbles: true, composed: true }));

  private _key = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    e.stopPropagation();
    this._close();
  };

  private _confirm(): void {
    const r = this._res;
    if (!r?.ok) return;
    const items = resolveClashes(r.items, (id) => this.taken(r.kind, id), this._choice, {
      reserved: this.reserved ? (id) => this.reserved!(r.kind, id) : undefined,
      takenName: this.takenName ? (n) => this.takenName!(r.kind, n) : undefined,
    });
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
    return html`<div class="wrap" lang=${locale()} @keydown=${this._key}>${this.mode === 'export' ? this._export() : this._import()}</div>`;
  }

  // ── import ──
  private _import(): TemplateResult {
    const r = this._res;
    const kinds = this._kinds();
    const images = kinds.length === 1 && kinds[0] === 'image';
    const accept = images ? '.json,.svg' : kinds.includes('icon') ? '.yaml,.yml,.json,.svg' : '.yaml,.yml,.json';
    const icon = kinds.includes('icon');
    const types = accept.replace(/\./g, '').replace(/,/g, ', ');
    return html`
      <div class="group-head"><h3 tabindex="-1">${r ? (r.ok ? t('transfer.panel.import-items', { items: count(r.items.length, r.kind) }) : t('transfer.panel.this-file-was-not-imported')) : t('transfer.panel.import-presets')}</h3></div>
      <div class="bar">
        ${button({ label: t('transfer.panel.choose-a-file'), icon: 'mdi:file-upload-outline', onClick: () => this.renderRoot.querySelector<HTMLInputElement>('input[type=file]')!.click() })}
        <input type="file" class="sr-only" tabindex="-1" aria-hidden="true" accept=${accept} @change=${this._onFile} />
        <span class="help">${images ? t('transfer.panel.json-or-svg-up-to-8-mb') : icon ? t('transfer.panel.types-up-to-1-mb-svg-up-to-32-kb', { types }) : t('transfer.panel.types-up-to-1-mb', { types })}</span>
      </div>
      <div class="field">
        <div class="field-head"><label for="paste">${t('transfer.panel.or-paste-the-text')}</label></div>
        <textarea id="paste" class="input" spellcheck="false"></textarea>
        <div class="bar">
          ${button({ label: t('transfer.panel.read'), onClick: () => void this._read(this.renderRoot.querySelector<HTMLTextAreaElement>('#paste')!.value) })}
          ${button({ label: t('transfer.panel.close'), variant: 'text', onClick: this._close })}
        </div>
      </div>
      ${r?.ok ? html`<p id="res" class="res" tabindex="-1" role="status">${this._summary(r)}</p>` : r ? html`<div id="res" tabindex="-1">${notice({ tone: 'error', text: r.message })}</div>` : nothing}
      ${r?.ok ? this._result(r) : nothing}
    `;
  }

  private _summary(r: Ok): string {
    const n = this._notes(r);
    const kept = n.filter(KEPT).length;
    const parts = [t('transfer.panel.source-holds-items', { source: this._fileName || t('transfer.panel.the-text'), items: count(r.items.length, r.kind) })];
    if (kept) parts.push(t('transfer.panel.n', { n: kept }));
    if (n.length - kept) parts.push(t('transfer.panel.n-2', { n: n.length - kept }));
    return parts.join(' ');
  }

  private _result(r: Ok): TemplateResult {
    const notes = this._notes(r);
    const kept = notes.filter(KEPT);
    const local = notes.filter((n) => n.code === 'local_path');
    const rest = notes.filter((n) => !KEPT(n) && n.code !== 'local_path');
    const clashes = r.items.filter((i) => this.taken(r.kind, i.id));
    const blocked = (r.kind === 'theme' || r.kind === 'image') && !this.hasLibrary;
    const name = (n: TransferNote): string => (r.items[n.item] ? `${r.items[n.item].name}: ` : '');
    const hosts = [...new Set(kept.flatMap((n) => n.hosts ?? []))];
    return html`
      <ul>
        ${r.items.map((i) => html`<li>${i.name}${this.taken(r.kind, i.id) ? html` <span class="help">${t('transfer.panel.you-have-this-one')}</span>` : nothing}</li>`)}
      </ul>
      ${kept.length
        ? html`<div class="notice warn" role="status">
            ${glyph('help', 20)}
            <div class="body">
              <strong>${t('transfer.panel.n-3', { n: kept.length })}</strong>
              <span class="help">${hosts.length ? `${t('transfer.panel.every-browser-that-shows-a-dashboard', { hosts: hosts.join(', ') })} ` : ''}${t('transfer.panel.lines-that-start-with-card-mod-only-work')}</span>
              <ul>
                ${kept.map((n) => html`<li>${name(n)}<span class="mono">${n.path.replace(/^data\./, '')}</span>${n.hosts?.length ? ` (${n.hosts.join(', ')})` : ''}</li>`)}
              </ul>
            </div>
          </div>`
        : nothing}
      ${local.length ? html`<p class="help">${t("transfer.panel.n-4", { n: local.length })}</p>` : nothing}
      ${rest.length
        ? html`<details class="cond" ?open=${r.kind === 'image'}>
            <summary>${t('transfer.panel.n-5', { n: rest.length })}</summary>
            <ul>
              ${rest.map((n) => html`<li>${name(n)}${n.message}</li>`)}
            </ul>
          </details>`
        : nothing}
      ${r.kind !== 'theme' && r.kind !== 'image' && !this.hasLibrary ? html`<p class="help">${t('transfer.panel.magic-card-utils-is-not-installed-so')}</p>` : nothing}
      ${blocked ? notice({ tone: 'error', text: r.kind === 'image' ? t('transfer.panel.images-need-magic-card-utils-it-is') : t('transfer.panel.update-magic-card-utils-to-keep-theme') }) : nothing}
      ${clashes.length
        ? html`<div class="field">
            <div class="field-head"><span class="lbl">${t('transfer.panel.n-6', { n: clashes.length, items: count(clashes.length, r.kind) })}</span></div>
            ${seg({
              role: 'radiogroup',
              label: t('transfer.panel.what-to-do-with-them'),
              full: true,
              value: this._choice,
              items: [
                { value: 'keep-both', label: t('transfer.panel.keep-both') },
                { value: 'replace', label: t('transfer.panel.replace-them') },
              ],
              onChange: (c) => (this._choice = c),
            })}
            <p class="help">${this._choice === 'replace' ? t('transfer.panel.the-saved-ones-are-overwritten') : t('transfer.panel.the-new-ones-get-a-number')}</p>
          </div>`
        : nothing}
      <div class="bar">
        ${button({ label: kept.length ? t('transfer.panel.import-anyway') : t('transfer.panel.import-items', { items: count(r.items.length, r.kind) }), variant: 'primary', disabled: blocked, onClick: () => this._confirm() })}
        ${button({ label: t('transfer.panel.cancel'), variant: 'text', onClick: () => (this._res = undefined) })}
      </div>
    `;
  }

  // ── export ──
  private _text(): string {
    const e = this.exportItems;
    return e ? serialiseTransfer(e.kind, e.items, this._fmt()) : '';
  }

  private _name(): string {
    const e = this.exportItems!;
    return `magic-card-${e.kind}${e.items.length === 1 ? `-${e.items[0].id}` : `s-${e.items.length}`}.${this._fmt() === 'json' ? 'json' : 'yaml'}`;
  }

  private _download(): void {
    const url = URL.createObjectURL(new Blob([this._text()], { type: this._fmt() === 'json' ? 'application/json' : 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = this._name();
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this._done = t('transfer.panel.downloaded-name', { name: a.download });
  }

  private async _copy(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this._done = t('transfer.panel.copied');
    } catch {
      this.renderRoot.querySelector<HTMLTextAreaElement>('#out')?.select();
      this._done = t('transfer.panel.could-not-copy-the-text-is-selected');
    }
  }

  private _export(): TemplateResult {
    const e = this.exportItems;
    if (!e?.items.length) return html`<p class="help" role="status">${t('transfer.panel.nothing-to-export')}</p>`;
    const text = this._text();
    return html`
      <div class="group-head"><h3 tabindex="-1">${t('transfer.panel.export-items', { items: count(e.items.length, e.kind) })}</h3></div>
      ${e.kind === 'image'
        ? nothing
        : html`<div class="field">
        <div class="field-head"><span class="lbl">${t('transfer.panel.file-format')}</span></div>
        ${seg({
          role: 'radiogroup',
          label: t('transfer.panel.file-format'),
          value: this._format,
          items: [
            { value: 'yaml', label: 'YAML' },
            { value: 'json', label: 'JSON' },
          ],
          onChange: (f) => (this._format = f),
        })}
      </div>`}
      ${e.items.some((i) => i.author) ? html`<p class="help">${t('transfer.panel.the-author-name-is-saved-in-the-file')}</p>` : nothing}
      <textarea id="out" class="input" readonly aria-label=${t('transfer.panel.export-text')} .value=${text} @focus=${(ev: Event) => (ev.target as HTMLTextAreaElement).select()}></textarea>
      <div class="bar">
        ${button({ label: t('transfer.panel.download'), variant: 'primary', icon: 'mdi:download', onClick: () => this._download() })}
        ${button({ label: t('transfer.panel.copy'), icon: 'mdi:content-copy', onClick: () => this._copy(text) })}
        ${e.kind === 'theme' && e.items.length === 1 ? button({ label: t('transfer.panel.copy-as-ha-theme'), onClick: () => this._copy(haThemeYaml(e.items[0].name, e.items[0].data as never)) }) : nothing}
        ${button({ label: t('transfer.panel.close'), variant: 'text', onClick: this._close })}
      </div>
      <div role="status" aria-live="polite" class="help">${this._done}</div>
    `;
  }
}
