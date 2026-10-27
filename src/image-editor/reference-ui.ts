import { html, nothing, type TemplateResult } from 'lit';
import { REFERENCE_TYPES } from '../contracts/image-editor';
import { glyph } from '../ui-kit/glyphs';
import { button, field, notice, switchRow } from '../ui-kit/templates';
import { t } from './i18n';
import type { ImageExt } from './chunk';
import { fit, pick, remove, reset, setAlign, turn } from './reference';

/* The Reference picture button, its panel and the pill, drawn from the ImageExt's state. */

const aria = (b: boolean): string => (b ? 'true' : 'false');

export function refButton(x: ImageExt, small: boolean, tight: boolean): TemplateResult {
  const label = t('Reference picture');
  return html`<button type="button" id="ref-btn" class=${tight ? `icon-btn${small ? ' sm' : ''}` : `btn btn-secondary${small ? ' btn-sm' : ''}`} aria-label=${tight ? label : nothing} title=${tight ? label : nothing} aria-expanded=${aria(x.refOpen)} aria-controls="ref-panel" @click=${() => toggle(x)}>${glyph('eyeOn', tight ? 20 : 18)}${tight ? nothing : label}</button>`;
}

export function toggle(x: ImageExt, open = !x.refOpen): void {
  x.refOpen = open;
  x.shell.requestUpdate();
  if (open) void x.shell.updateComplete.then(() => x.shell.renderRoot.querySelector<HTMLElement>('#ref-pick')?.focus());
}

export function closePanel(x: ImageExt): void {
  x.refOpen = false;
  x.shell.requestUpdate();
  void x.shell.updateComplete.then(() => x.shell.renderRoot.querySelector<HTMLElement>('#ref-btn')?.focus());
}

/** The strip above the canvas: the picture is on and will not be saved. */
export function refPill(x: ImageExt): TemplateResult | typeof nothing {
  if (!x.ref || !x.shown) return nothing;
  return html`<div class="ref-pill"><span>${t('Reference picture on. Not saved.')}</span>${button({ label: t('Hide'), variant: 'text', size: 'sm', onClick: () => ((x.shown = false), x.shell.requestUpdate()) })}</div>`;
}

const num = (id: string, label: string, value: number, on: (n: number) => void, hint?: string): TemplateResult =>
  field({
    id,
    label,
    help: hint,
    control: html`<input id=${id} class="input" type="text" inputmode="decimal" autocomplete="off" .value=${String(value)} @change=${(e: Event) => {
      const i = e.target as HTMLInputElement;
      const n = Number(i.value.replace(',', '.'));
      if (i.value.trim() && Number.isFinite(n)) on(n);
      else i.value = String(value);
    }} />`,
  });

/** The panel never grows past the bottom of the editor, so it scrolls inside and every control can be reached (also at 200 % zoom). */
export function fitPanel(x: ImageExt, panel: HTMLElement | null | undefined = x.shell.renderRoot.querySelector<HTMLElement>('#ref-panel')): void {
  if (!panel) return;
  const room = Math.min(x.shell.getBoundingClientRect().bottom, window.innerHeight || Infinity) - panel.getBoundingClientRect().top - 8;
  panel.style.maxHeight = `${Math.round(Math.max(120, Math.min(520, room)))}px`;
}

export function refPanel(x: ImageExt): TemplateResult | typeof nothing {
  if (!x.refOpen) return nothing;
  const sh = x.shell;
  const a = x.align;
  const f = sh.doc.vb;
  const step = Math.max(1, Math.round(Math.max(f.w, f.h) / 200));
  void sh.updateComplete.then(() => fitPanel(x));
  const nudge = (label: string, dx: number, dy: number): TemplateResult => button({ label, size: 'sm', variant: 'secondary', onClick: () => setAlign(x, { x: x.align.x + dx, y: x.align.y + dy }) });
  return html`<div class="ref-dock"><section id="ref-panel" class="ref-panel" aria-labelledby="ref-h" @focusin=${(e: FocusEvent) => {
    fitPanel(x, e.currentTarget as HTMLElement);
    (e.target as HTMLElement).scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  }}>
    <h2 id="ref-h">${t('Reference picture')}</h2>
    <p class="help">${t('For tracing only. The picture is never saved.')}</p>
    <input id="ref-file" type="file" hidden accept=${REFERENCE_TYPES.join(',')} @change=${(e: Event) => {
      const i = e.target as HTMLInputElement;
      const file = i.files?.[0];
      i.value = '';
      if (file) void pick(x, file);
    }} />
    <div class="ref-row">
      <button type="button" id="ref-pick" class="btn btn-secondary" @click=${() => sh.renderRoot.querySelector<HTMLInputElement>('#ref-file')?.click()}>${x.ref ? t('Choose another picture…') : t('Choose a picture…')}</button>
      <span class="help">${t('PNG, JPEG, WebP, GIF, AVIF or BMP.')}</span>
      ${button({ label: t('Close'), variant: 'text', size: 'sm', onClick: () => closePanel(x) })}
    </div>
    ${x.msg ? notice({ tone: 'error', text: x.msg }) : nothing}
    ${x.note ? html`<p class="help" role="status">${x.note}</p>` : nothing}
    ${x.ref
      ? html`<div class="ref-grid">
            ${switchRow({ id: 'ref-show', label: t('Show'), checked: x.shown, onChange: (v) => ((x.shown = v), sh.requestUpdate()) })}
            ${field({ id: 'ref-op', label: t('Opacity'), control: html`<div class="ref-op"><input id="ref-op" type="range" min="0" max="100" step="1" .value=${String(a.o)} @input=${(e: Event) => setAlign(x, { o: Number((e.target as HTMLInputElement).value) })} /><span aria-hidden="true">${a.o} %</span></div>` })}
            ${num('ref-x', t('X'), a.x, (n) => setAlign(x, { x: n }))}
            ${num('ref-y', t('Y'), a.y, (n) => setAlign(x, { y: n }))}
            ${num('ref-s', t('Scale (%)'), a.s, (n) => setAlign(x, { s: n }))}
            ${num('ref-r', t('Rotate (degrees)'), a.r, (n) => setAlign(x, { r: n }), t('Scale and rotate are around the middle of the picture.'))}
          </div>
          <div class="ref-row">
            ${button({ label: t('Turn left 90'), size: 'sm', onClick: () => setAlign(x, { r: turn(x.align.r - 90) }) })}${button({ label: t('Turn right 90'), size: 'sm', onClick: () => setAlign(x, { r: turn(x.align.r + 90) }) })}
            ${button({ label: t('Fit to canvas'), size: 'sm', onClick: () => fit(x) })}${button({ label: t('Match canvas shape to this picture'), size: 'sm', onClick: () => x.matchSize() })}${button({ label: t('Reset alignment'), size: 'sm', onClick: () => reset(x) })}
          </div>
          <div class="ref-row" role="group" aria-label=${t('Move the picture')}>${nudge(t('Move picture left'), -step, 0)}${nudge(t('Move picture right'), step, 0)}${nudge(t('Move picture up'), 0, -step)}${nudge(t('Move picture down'), 0, step)}</div>
          <p class="help">${t('Alignment is remembered on this device for this image. The picture is not.')}</p>
          <div class="ref-row">${button({ label: t('Remove picture'), variant: 'danger', size: 'sm', onClick: () => remove(x) })}</div>`
      : html`<p class="help">${t('Reference pictures are not kept. Pick it again if you reopen the image.')}</p>`}
  </section></div>`;
}
