import { LitElement, html, css, svg, nothing, type TemplateResult, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { editorSystem } from '../../css/editor-stack';
import type { SvgCssResolve } from '../../contracts/svg-safety';
import type { UiWindowElement } from '../../contracts/ui-kit';
import { ICON_SVG_INTAKE } from '../../contracts/svg-intake';
import { readFile } from '../../svg-io/intake';
import { loadSvgCss } from '../../svg-safety/css-loader';
import { seg } from '../../ui-kit/templates/choice';
import { deepActive, studioWindow } from '../window';
import { validationText } from '../validation-text';
import { SVG_MAX_BYTES, sanitizeSvg } from '../../icons/svg-sanitize';
import type { AnimationDoc } from '../model';
import { V2_CAPS, type RigShape } from '../model-v2';
import { checkExportSvg, exportRigSvg, importSvgFile, rigFromSvgIcon, svgFileName, useInCardYaml, type ExportPiece } from '../svg-export';
import { addShape, docSizeError, isFilled, isStroked, paintOrder, rigIds } from './draw-utils';
import { ANIMATED_SVG_WARN_BYTES, animatedSvgFileName, checkAnimatedSvg, exportAnimatedSvg, geometryFromPieces } from '../../icon-anim/animated-svg';
import { bakedParticlesSvg } from './particles-utils';
import { t } from '../i18n';

// The own-icon dialog of the drawing tools (a kit <mc-ui-window>): "Save as icon" shows the rig at rest as SVG (copy,
// download, use in card) or as an animated SVG; "Import SVG" previews a file and adds its shapes or makes it the rig
// source. A particles document exports only as an animated SVG. Emits doc-change.

const kb = (n: number): string => t('anim-studio.draw-svg-dialog.size-kb', { size: (n / 1024).toFixed(n < 10240 ? 1 : 0) });
const bytes = (s: string): number => new TextEncoder().encode(s).length;

/**
 * Copy text to the clipboard. Falls back to a hidden textarea where the API is missing or refused;
 * `container` hosts it (an open modal window: everything outside it is inert, so a textarea in the
 * body could not be selected).
 */
export async function copyText(text: string, container?: Element | null): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // denied (no user gesture, insecure context): try the old way
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    (container ?? document.body).appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Save text as a file download. */
export function downloadText(text: string, filename: string, type = 'image/svg+xml'): void {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Read an .svg File (type and size checked first). */
export async function readSvgFile(file: File): Promise<{ text: string } | { error: string }> {
  const r = await readFile(file, ICON_SVG_INTAKE);
  if (r.ok) return { text: r.text };
  return { error: r.code === 'too_large' ? t('anim-studio.draw-svg-dialog.the-svg-is-larger-than-32-kb') : r.code === 'wrong_type' ? t('anim-studio.draw-svg-dialog.choose-an-svg-file') : t('anim-studio.draw-svg-dialog.the-file-could-not-be-read') };
}

@customElement('mc-anim-svg-dialog')
export class AnimSvgDialog extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: contents;
      }
      /* the window brings the frame, header and footer row; what is slotted in is a grid */
      .body {
        display: grid;
        gap: 16px;
        min-width: 0;
      }
      .foot {
        display: contents;
      }
      .foot .grow {
        flex: 1;
      }
      .top {
        display: grid;
        grid-template-columns: 120px minmax(0, 1fr);
        gap: 16px;
        align-items: start;
      }
      .preview {
        width: 120px;
        height: 120px;
        box-sizing: border-box;
        border-radius: 12px;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        display: grid;
        place-items: center;
        color: var(--state-icon-color, #44739e);
        background-color: color-mix(in srgb, var(--primary-text-color, #212121) 4%, var(--card-background-color, #fff));
        background-image: radial-gradient(color-mix(in srgb, var(--primary-text-color, #212121) 14%, transparent) 1px, transparent 1px);
        background-size: 12px 12px;
      }
      .preview img.anim {
        width: 88px;
        height: 88px;
      }
      .check {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 32px;
        font-size: 0.875rem;
        cursor: pointer;
      }
      .color-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 12px;
      }
      .color-row .muted {
        font-size: 0.75rem;
        color: var(--secondary-text-color, #5f6368);
      }
      .check input[type='color'] {
        width: 28px;
        height: 28px;
        padding: 0;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 6px;
        background: none;
      }
      .check input {
        width: 18px;
        height: 18px;
        margin: 0;
        accent-color: var(--primary-color, #03a9f4);
      }
      .warn {
        margin: 0;
        padding-inline-start: 18px;
        font-size: 0.8125rem;
        color: color-mix(in srgb, var(--warning-color, #ff9800) 65%, var(--primary-text-color, #212121));
      }
      .preview svg {
        width: 88px;
        height: 88px;
        overflow: visible;
      }
      .facts {
        display: grid;
        gap: 6px;
        font-size: 0.875rem;
      }
      .facts .muted {
        color: var(--secondary-text-color, #5f6368);
        font-size: 0.8125rem;
      }
      .meter {
        height: 6px;
        border-radius: 3px;
        background: var(--secondary-background-color, #f2f3f5);
        overflow: hidden;
      }
      .meter i {
        display: block;
        height: 100%;
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 70%, #000);
      }
      .meter.over i {
        background: var(--error-color, #db4437);
      }
      textarea.code {
        width: 100%;
        box-sizing: border-box;
        min-height: 120px;
        max-height: 200px;
        resize: vertical;
        font: 0.8125rem/1.5 'Roboto Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
        padding: 8px 12px;
        border-radius: 8px;
        border: 1px solid color-mix(in srgb, var(--primary-text-color, #212121) 40%, transparent);
        background: var(--card-background-color, #fff);
        color: inherit;
      }
      .status {
        min-height: 1.2em;
        margin: 0;
        font-size: 0.75rem;
        color: var(--secondary-text-color, #5f6368);
        align-self: center;
      }
      .error {
        margin: 0;
        color: color-mix(in srgb, var(--error-color, #db4437) 80%, var(--primary-text-color, #212121));
        font-size: 0.8125rem;
      }
      .drop {
        display: grid;
        place-items: center;
        gap: 8px;
        min-height: 140px;
        padding: 16px;
        border: 1px dashed var(--divider-color, rgba(0, 0, 0, 0.24));
        border-radius: 12px;
        text-align: center;
        color: var(--secondary-text-color, #5f6368);
        font-size: 0.875rem;
      }
      .drop.over {
        border-color: var(--primary-color, #03a9f4);
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
      }
      .drop ha-icon {
        --mdc-icon-size: 32px;
      }
    `,
  ];

  @property({ attribute: false }) doc?: AnimationDoc;
  /** The rig source's pieces (export). */
  @property({ attribute: false }) pieces: ExportPiece[] = [];
  /** The pieces' viewBox (export; imports scale into the rig's viewBox). */
  @property({ type: String }) viewBox = '0 0 24 24';
  @property({ type: Boolean }) disabled = false;

  @state() private _open = false;
  @state() private _mode: 'export' | 'import' = 'export';
  /** Export: the icon at rest (own icon) or the animation (animated SVG file). */
  @state() private _format: 'still' | 'animated' = 'still';
  /** Animated SVG: add the SMIL fallback copy. */
  @state() private _smil = true;
  /** Animated SVG: the icon colour written into the file ('' = currentColor). */
  @state() private _color = '';
  @state() private _text = '';
  @state() private _fileName = '';
  @state() private _status = '';
  @state() private _error = '';
  @state() private _over = false;
  /** Copying failed: the text to select and copy by hand. */
  @state() private _manual?: { label: string; text: string };

  /** The CSS paint resolver for the file being imported; set by _ready(), passed on to the sanitiser and used by nothing else. */
  private _css?: SvgCssResolve;
  private _cssLoad?: Promise<void>;
  /** Counts the texts taken in, so a text whose load was overtaken by another is dropped. */
  private _textSeq = 0;
  private _taking?: Promise<void>;
  private _importMemo?: { text: string; doc: AnimationDoc; viewBox: string; r: RigShape[] | { error: string } };
  private _exportMemo?: { doc?: AnimationDoc; pieces: ExportPiece[]; viewBox: string; text: string; error?: string; clean: string };
  private _srcMemo?: { text: string; error?: string };
  private _animMemo?: { doc?: AnimationDoc; pieces: ExportPiece[]; viewBox: string; smil: boolean; color: string; text: string; warnings: string[]; error?: string; url: string };

  /** Open "Save as icon" (`animated`: on the animated SVG). */
  openExport(animated = false): void {
    this._mode = 'export';
    this._format = animated || this._isParticles ? 'animated' : 'still';
    this._manual = undefined;
    this._status = '';
    this._error = '';
    void this._show();
  }

  /** Open "Import SVG", optionally with a file's text already read. */
  openImport(text = '', fileName = ''): void {
    this._mode = 'import';
    this._text = '';
    void this._take(text);
    this._fileName = fileName;
    this._status = '';
    this._error = '';
    void this._show();
  }

  close(): void {
    const win = this.renderRoot.querySelector<UiWindowElement>('mc-ui-window');
    if (win?.open) win.close('action');
    else this._open = false;
  }

  get open(): boolean {
    return this._open;
  }

  private get _isParticles(): boolean {
    return this.doc?.kind === 'particles';
  }

  /** The exported SVG text of the current document. */
  get exportText(): string {
    return this._export().text;
  }

  /** The export and its checks, computed once per document / pieces / viewBox. */
  private _export(): { text: string; error?: string; clean: string } {
    const m = this._exportMemo;
    if (m && m.doc === this.doc && m.pieces === this.pieces && m.viewBox === this.viewBox) return m;
    const rig = this.doc?.rig ?? { parts: [] };
    const text = exportRigSvg(rig, this.pieces, { viewBox: rig.svg ? undefined : this.viewBox });
    const error = checkExportSvg(text);
    const clean = error ? '' : sanitizeSvg(text).markup;
    this._exportMemo = { doc: this.doc, pieces: this.pieces, viewBox: this.viewBox, text, error, clean };
    return this._exportMemo;
  }

  /** The animated SVG of the current document, once per document / pieces / viewBox / SMIL choice. */
  private _animated(): { text: string; warnings: string[]; error?: string; url: string } {
    const m = this._animMemo;
    if (m && m.doc === this.doc && m.pieces === this.pieces && m.viewBox === this.viewBox && m.smil === this._smil && m.color === this._color) return m;
    const r = !this.doc
      ? { svg: '', warnings: [] }
      : this._isParticles
        ? bakedParticlesSvg(this.doc)
        : exportAnimatedSvg(this.doc, geometryFromPieces(this.pieces, this.viewBox), { smil: this._smil, ...(this._color ? { color: this._color } : {}) });
    const error = r.svg ? checkAnimatedSvg(r.svg) : (r.warnings[0] ?? t('anim-studio.draw-svg-dialog.nothing-to-export-yet'));
    const warnings = r.svg ? r.warnings : r.warnings.slice(1);
    // an <img> plays the file as it is, isolated from the page (scripts never run in an image)
    // the file is currentColor (black in an image): the preview shows it in the theme's icon colour
    const theme = typeof getComputedStyle === 'function' ? getComputedStyle(this).getPropertyValue('--state-icon-color').trim() : '';
    const color = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\))$/i.test(theme) ? theme : '#44739e';
    const shown = this._color ? r.svg : r.svg.replace('class="mc-anim ', `color="${color}" class="mc-anim `);
    const url = r.svg && !error ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(shown)}` : '';
    this._animMemo = { doc: this.doc, pieces: this.pieces, viewBox: this.viewBox, smil: this._smil, color: this._color, text: r.svg, warnings, error, url };
    return this._animMemo;
  }

  /** Loads the resolver once for this dialog (undefined when it did not load). */
  private _ready(): Promise<void> {
    return (this._cssLoad ??= loadSvgCss().then((css) => {
      this._css = css;
    }));
  }

  /** The imported text, set only after the resolver has settled: nothing is sanitised, shown or remembered before that. */
  private _take(text: string): Promise<void> {
    const seq = ++this._textSeq;
    const done = (): void => {
      if (seq === this._textSeq) this._text = text;
    };
    if (!text) {
      done();
      return Promise.resolve();
    }
    const p = this._ready().then(done);
    this._taking = p;
    return p;
  }

  /** Settled once a text taken in has been set (the resolver has loaded) and shown. */
  override async getUpdateComplete(): Promise<boolean> {
    await this._taking;
    return super.getUpdateComplete();
  }

  /** Why the imported file can't be the icon (sanitiser verdict), once per text. */
  private _sourceError(): string | undefined {
    if (this._srcMemo?.text !== this._text) this._srcMemo = { text: this._text, error: sanitizeSvg(this._text, { css: this._css }).error };
    return this._srcMemo.error;
  }

  private async _copy(text: string, label: string, done: string): Promise<void> {
    const ok = await copyText(text, this.renderRoot.querySelector('mc-ui-window'));
    if (ok) {
      this._manual = undefined;
      this._status = done;
    } else {
      this._manual = { label, text };
      this._status = t('anim-studio.draw-svg-dialog.copy-failed-select-the-text-below-and');
    }
  }

  private async _show(): Promise<void> {
    const opener = deepActive() ?? undefined;
    this._open = true;
    await this.updateComplete;
    const win = this.renderRoot.querySelector<UiWindowElement>('mc-ui-window');
    if (win && !win.open) {
      win.opener = opener;
      win.show();
    }
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has('_manual') && this._manual) {
      const ta = this.renderRoot.querySelector<HTMLTextAreaElement>('textarea.manual');
      ta?.focus();
      ta?.select();
    }
    if (changed.has('_status') && this._status) {
      const s = this._status;
      setTimeout(() => {
        if (this._status === s) this._status = '';
      }, 2500);
    }
  }

  private _emit(doc: AnimationDoc, label: string): void {
    this.dispatchEvent(new CustomEvent('doc-change', { bubbles: true, composed: true, detail: { doc, label } }));
  }

  // ── import ──

  private _imported(): RigShape[] | { error: string } | undefined {
    if (!this._text || !this.doc) return undefined;
    const m = this._importMemo;
    if (m && m.text === this._text && m.doc === this.doc && m.viewBox === this.viewBox) return m.r;
    const room = V2_CAPS.shapes - (this.doc.rig?.shapes?.length ?? 0);
    const r = importSvgFile(this._text, this.viewBox, rigIds(this.doc), room, this._css);
    this._importMemo = { text: this._text, doc: this.doc, viewBox: this.viewBox, r };
    return r;
  }

  private async _pick(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (file) await this._takeFile(file);
  }

  private async _takeFile(file: File): Promise<void> {
    const r = await readSvgFile(file);
    if ('error' in r) {
      this._error = validationText(r.error);
      void this._take('');
      return;
    }
    this._error = '';
    this._fileName = file.name;
    await this._take(r.text);
  }

  private _drop(e: DragEvent): void {
    e.preventDefault();
    this._over = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) void this._takeFile(file);
  }

  private _addShapes(shapes: RigShape[]): void {
    if (!this.doc) return;
    let doc: AnimationDoc | undefined = this.doc;
    for (const s of shapes) doc = doc && addShape(doc, s);
    if (!doc) {
      this._error = t('anim-studio.draw-svg-dialog.at-most-shapes-shapes-fit-in-a-rig', { shapes: V2_CAPS.shapes });
      return;
    }
    const big = docSizeError(doc);
    if (big) {
      this._error = big;
      return;
    }
    this._emit(doc, t('anim-studio.draw-svg-dialog.import-shapes', { count: shapes.length }));
    this.close();
  }

  private _useAsIcon(): void {
    if (!this.doc) return;
    const r = rigFromSvgIcon(this.doc, this._text, this.viewBox, this._css);
    if ('error' in r) {
      this._error = validationText(r.error);
      return;
    }
    const big = docSizeError(r);
    if (big) {
      this._error = big;
      return;
    }
    this._emit(r, 'Use SVG as icon');
    this.close();
  }

  // ── rendering ──

  private _shapesPreview(shapes: RigShape[], viewBox: string): TemplateResult {
    return html`<svg viewBox=${viewBox} aria-hidden="true">
      ${paintOrder(shapes).map(
        (s) =>
          svg`<path d=${s.d} fill=${isFilled(s) ? (s.fill && !/^entity|var\(/.test(s.fill) ? s.fill : 'currentColor') : 'none'}
            stroke=${isStroked(s) ? (/^entity|var\(/.test(s.stroke!) ? 'currentColor' : s.stroke!) : 'none'}
            stroke-width=${s.stroke_width ?? 1} stroke-linecap=${s.linecap ?? 'butt'} stroke-linejoin="round"></path>`,
      )}
    </svg>`;
  }

  private _renderFormat(): TemplateResult {
    const opts: Array<['still' | 'animated', string, string]> = [
      ['still', t('anim-studio.draw-svg-dialog.icon'), 'mdi:image-outline'],
      ['animated', t('anim-studio.draw-svg-dialog.animated-svg'), 'mdi:motion-play-outline'],
    ];
    const pick = (id: 'still' | 'animated') => {
      this._format = id;
      this._status = '';
      this._manual = undefined;
    };
    return html`<div class="format">${seg({ role: 'radiogroup', label: t('anim-studio.draw-svg-dialog.what-to-save'), full: true, value: this._format, items: opts.map(([value, label, icon]) => ({ value, label, icon })), onChange: pick })}</div>`;
  }

  private _renderManual(): TemplateResult | typeof nothing {
    return this._manual
      ? html`<div class="field">
          <div class="field-head"><label for="svg-manual">${this._manual.label}</label></div>
          <textarea id="svg-manual" class="code manual" readonly .value=${this._manual.text} @focus=${(e: Event) => (e.target as HTMLTextAreaElement).select()}></textarea>
        </div>`
      : nothing;
  }

  private _renderAnimated(): TemplateResult {
    const { text, warnings, error, url } = this._animated();
    const size = bytes(text);
    return html`
      <div class="body">
        ${this._isParticles ? nothing : this._renderFormat()}
        <div class="top">
          <div class="preview">${url ? html`<img class="anim" src=${url} alt="" />` : html`<ha-icon icon="mdi:image-off-outline"></ha-icon>`}</div>
          <div class="facts">
            <span>${this._isParticles ? t('anim-studio.draw-svg-dialog.a-looping-svg-file-of-the-baked') : t('anim-studio.draw-svg-dialog.a-looping-svg-file-of-the-animation')}</span>
            <span class="muted">${kb(size)}${size > ANIMATED_SVG_WARN_BYTES ? t('anim-studio.draw-svg-dialog.large') : ''}</span>
            ${this._isParticles
              ? html`<span class="muted">${t('anim-studio.draw-svg-dialog.browsers-play-its-css-keyframes')}</span>`
              : html`<span class="muted">${t('anim-studio.draw-svg-dialog.browsers-play-its-css-keyframes-the-smil')}</span>
            <div class="color-row">
              <label class="check">
                <input type="color" class="color" .value=${this._color || '#03a9f4'} @input=${(e: Event) => (this._color = (e.target as HTMLInputElement).value)} />
                ${this._color ? html`${t('anim-studio.draw-svg-dialog.colour')} <span class="mono">${this._color}</span>` : t('anim-studio.draw-svg-dialog.colour-currentcolor')}
              </label>
              ${this._color
                ? html`<button type="button" class="btn btn-text btn-sm color-reset" @click=${() => (this._color = '')}>${t('anim-studio.draw-svg-dialog.use-currentcolor')}</button>`
                : html`<span class="muted">${t('anim-studio.draw-svg-dialog.black-in-an-img-the-text-colour-inline')}</span>`}
            </div>
            <label class="check">
              <input type="checkbox" class="smil" .checked=${this._smil} @change=${(e: Event) => (this._smil = (e.target as HTMLInputElement).checked)} />
              ${t('anim-studio.draw-svg-dialog.smil-fallback')}
            </label>
            `}
            ${warnings.length ? html`<ul class="warn">${warnings.map((w) => html`<li>${w}</li>`)}</ul>` : nothing}
            ${error ? html`<p class="error" role="alert">${error}</p>` : nothing}
          </div>
        </div>
        <div class="field">
          <div class="field-head"><label for="svg-anim-code">${t('anim-studio.draw-svg-dialog.animated-svg')}</label></div>
          <textarea id="svg-anim-code" class="code" readonly .value=${text}></textarea>
        </div>
        ${this._renderManual()}
      </div>
      <div slot="footer" class="foot">
        <p class="status grow" role="status" aria-live="polite">${this._status}</p>
        <button type="button" class="btn btn-secondary copy" ?disabled=${!!error} @click=${() => this._copy(text, t('anim-studio.draw-svg-dialog.svg-to-copy'), t('anim-studio.draw-svg-dialog.animated-svg-copied'))}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${t('anim-studio.draw-svg-dialog.copy-svg')}
        </button>
        <button
          type="button"
          class="btn btn-primary download"
          ?disabled=${!!error}
          @click=${() => {
            downloadText(text, animatedSvgFileName(this.doc?.name ?? ''));
            this._status = t('anim-studio.draw-svg-dialog.download-started');
          }}
        >
          <ha-icon icon="mdi:tray-arrow-down"></ha-icon>${t('anim-studio.draw-svg-dialog.download-svg')}
        </button>
      </div>
    `;
  }

  private _renderExport(): TemplateResult {
    if (this._format === 'animated') return this._renderAnimated();
    const { text, error, clean } = this._export();
    const size = bytes(text);
    const parts = this.doc?.rig?.parts?.length ?? 0;
    const shapes = this.doc?.rig?.shapes?.length ?? 0;
    const pct = Math.min(100, (size / SVG_MAX_BYTES) * 100);
    return html`
      <div class="body">
        ${this._renderFormat()}
        <div class="top">
          <div class="preview">${clean ? unsafeSVG(clean) : html`<ha-icon icon="mdi:image-off-outline"></ha-icon>`}</div>
          <div class="facts">
            <span>${this.pieces.length ? t('anim-studio.draw-svg-dialog.parts-shapes', { parts, shapes }) : t('anim-studio.draw-svg-dialog.parts-shapes-no-icon', { parts, shapes })}</span>
            <span class="muted">${t('anim-studio.draw-svg-dialog.kb-of-32-kb', { kb: kb(size) })}</span>
            <div class="meter ${size > SVG_MAX_BYTES ? 'over' : ''}" role="meter" aria-label=${t('anim-studio.draw-svg-dialog.size')} aria-valuemin="0" aria-valuemax=${SVG_MAX_BYTES} aria-valuenow=${size}>
              <i style="width:${pct}%"></i>
            </div>
            <span class="muted">${t('anim-studio.draw-svg-dialog.the-icon-at-rest-without-animation-ids')}</span>
            ${error ? html`<p class="error" role="alert">${error}</p>` : nothing}
          </div>
        </div>
        <div class="field">
          <div class="field-head"><label for="svg-code">SVG</label></div>
          <textarea id="svg-code" class="code" readonly .value=${text}></textarea>
        </div>
        ${this._manual
          ? html`<div class="field">
              <div class="field-head"><label for="svg-manual">${this._manual.label}</label></div>
              <textarea id="svg-manual" class="code manual" readonly .value=${this._manual.text} @focus=${(e: Event) => (e.target as HTMLTextAreaElement).select()}></textarea>
            </div>`
          : nothing}
      </div>
      <div slot="footer" class="foot">
        <p class="status grow" role="status" aria-live="polite">${this._status}</p>
        <button type="button" class="btn btn-secondary copy" ?disabled=${!!error} @click=${() => this._copy(text, t('anim-studio.draw-svg-dialog.svg-to-copy'), t('anim-studio.draw-svg-dialog.svg-copied'))}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${t('anim-studio.draw-svg-dialog.copy-svg')}
        </button>
        <button type="button" class="btn btn-secondary download" ?disabled=${!!error} @click=${() => {
          downloadText(text, svgFileName(this.doc?.name ?? ''));
          this._status = t('anim-studio.draw-svg-dialog.download-started');
        }}>
          <ha-icon icon="mdi:tray-arrow-down"></ha-icon>${t('anim-studio.draw-svg-dialog.download-svg')}
        </button>
        <button
          type="button"
          class="btn btn-primary use"
          ?disabled=${!!error}
          title=${t('anim-studio.draw-svg-dialog.copies-icon-svg-and-the-svg-as-card-yaml')}
          @click=${() => this._copy(useInCardYaml(text), t('anim-studio.draw-svg-dialog.card-yaml-to-copy'), t('anim-studio.draw-svg-dialog.card-yaml-copied-paste-it-into-a-module'))}
        >
          <ha-icon icon="mdi:card-text-outline"></ha-icon>${t('anim-studio.draw-svg-dialog.use-in-card')}
        </button>
      </div>
    `;
  }

  private _renderImport(): TemplateResult {
    const r = this._imported();
    const shapes = r && !('error' in r) ? r : undefined;
    const error = this._error || (r && 'error' in r ? validationText(r.error) : '');
    return html`
      <div class="body">
        ${this._text
          ? html`<div class="top">
              <div class="preview">${shapes ? this._shapesPreview(shapes, this.viewBox) : html`<ha-icon icon="mdi:image-off-outline"></ha-icon>`}</div>
              <div class="facts">
                <span>${this._fileName || 'SVG'}</span>
                ${shapes ? html`<span class="muted">${t('anim-studio.draw-svg-dialog.count-scaled-into-the-icon', { count: shapes.length })}</span>` : nothing}
                <span class="muted">${t('anim-studio.draw-svg-dialog.add-the-drawing-as-shapes-over-the-icon')}</span>
                ${error ? html`<p class="error" role="alert">${error}</p>` : nothing}
              </div>
            </div>`
          : html`<div
              class="drop ${this._over ? 'over' : ''}"
              @dragover=${(e: DragEvent) => {
                e.preventDefault();
                this._over = true;
              }}
              @dragleave=${() => (this._over = false)}
              @drop=${(e: DragEvent) => this._drop(e)}
            >
              <ha-icon icon="mdi:file-upload-outline"></ha-icon>
              <span>${t('anim-studio.draw-svg-dialog.drop-an-svg-file-here')}</span>
              <label class="btn btn-secondary">
                ${t('anim-studio.draw-svg-dialog.choose-file')}
                <input type="file" accept=".svg,image/svg+xml" class="sr-only" @change=${(e: Event) => this._pick(e)} />
              </label>
              ${error ? html`<p class="error" role="alert">${error}</p>` : nothing}
            </div>`}
      </div>
      <div slot="footer" class="foot">
        ${this._text ? html`<button type="button" class="btn btn-text again" @click=${() => void this._take('')}>${t('anim-studio.draw-svg-dialog.choose-another')}</button><span class="grow"></span>` : html`<span class="grow"></span>`}
        <button type="button" class="btn btn-secondary use-icon" ?disabled=${!this._text || !!this._sourceError()} @click=${() => this._useAsIcon()}>
          <ha-icon icon="mdi:star-four-points-outline"></ha-icon>${t('anim-studio.draw-svg-dialog.use-as-icon')}
        </button>
        <button type="button" class="btn btn-primary add" ?disabled=${!shapes} @click=${() => shapes && this._addShapes(shapes)}>
          <ha-icon icon="mdi:shape-plus-outline"></ha-icon>${t('anim-studio.draw-svg-dialog.add-as-shapes')}
        </button>
      </div>
    `;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this._open) return nothing;
    const title = this._mode === 'import' ? t('anim-studio.draw-svg-dialog.import-svg') : this._isParticles ? t('anim-studio.draw-svg-dialog.animated-svg') : t('anim-studio.draw-svg-dialog.save-as-icon');
    return studioWindow(
      {
        heading: title,
        size: 'm',
        onClose: () => {
          this._open = false;
          this._status = '';
        },
      },
      this._mode === 'export' ? this._renderExport() : this._renderImport(),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-svg-dialog': AnimSvgDialog;
  }
}
