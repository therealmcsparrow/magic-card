import { html, nothing, svg, type TemplateResult } from 'lit';
import { IMAGE_CANVAS_MIN, IMAGE_CANVAS_PRESETS } from '../contracts/image-editor';
import { IMAGE_MAX_BYTES, MAX_IMAGE_BOX } from '../contracts/mcu-library-images';
import { glyph } from '../ui-kit/glyphs';
import { button, chip, field, notice, switchRow, tiles } from '../ui-kit/templates';
import type { McSvgEditor } from '../svg-editor/mc-svg-editor';
import type { Doc, Shape } from '../svg-editor/model';
import { K } from './kit';
import { gradientRef, type ImageExt } from './chunk';
import { outsideCount, readSize } from './canvas';
import { t } from './i18n';
import { kibShown, meterLevel } from './meter';
import { importFile } from './importer';
import { refButton, refPanel, refPill } from './reference-ui';
import { ACCENT, MAIN, cssOf, gradGeo, paintOf, stopsOf, type Box, type Grad } from './paint';

/* The image editor's templates: functions of the ImageExt (state lives there). */

const mac = (): boolean => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform ?? '');
const saveKey = (): string => (mac() ? 'Meta+S' : 'Control+S');
const aria = (b: boolean): string => (b ? 'true' : 'false');

function meter(x: ImageExt): TemplateResult {
  const o = x.shell.out;
  const bytes = o.error === 'empty' ? 0 : o.bytes;
  const l = meterLevel(bytes);
  const used = kibShown(bytes);
  const pct = Math.min(100, (bytes / IMAGE_MAX_BYTES) * 100);
  return html`<div class=${`img-meter is-${l}`}>
    <div class="bar" role="meter" aria-label=${t('Image size')} aria-valuemin="0" aria-valuemax="256" aria-valuenow=${Math.min(used, 256)} aria-valuetext=${t('{used} of 256 KiB, {word}', { used, word: x.word(l) })}><span style=${`width:${pct}%`}></span></div>
    ${l === 'over'
      ? html`<p class="sentence" role="alert">${glyph('alertCircle', 18)} ${x.sentence(bytes)}${x.bindings().length ? html` ${t('Includes connections.')}` : nothing}</p>`
      : html`<p class="sentence">${l === 'small' ? nothing : glyph(l === 'big' ? 'information' : 'alertCircle', 18)} ${x.sentence(bytes)}${x.bindings().length ? html` ${t('Includes connections.')}` : nothing}</p>`}
    <button type="button" class="btn btn-text btn-sm" aria-expanded=${aria(x.kibOpen)} aria-controls="kib" @click=${() => ((x.kibOpen = !x.kibOpen), x.shell.requestUpdate())}>${t('What is KiB?')}</button>
    ${x.kibOpen ? html`<p id="kib" class="kib help">${t('KiB is a kibibyte, a little over a thousand characters. 256 KiB is about a quarter of a megabyte.')}</p>` : nothing}
  </div>`;
}

export function topBar(x: ImageExt): TemplateResult {
  const s = x.shell;
  const edit = s.stage === 'edit';
  const ro = x.readOnly;
  const sm = s.layout === 'stacked';
  const tight = s.layout === 'compact' || sm;
  const z = sm ? 'sm' : 'md';
  const empty = s.out.error === 'empty';
  return html`<header class="topbar">
      ${button({ label: t('Close'), glyph: 'arrowLeft', variant: 'secondary', size: z, iconOnly: tight, onClick: () => s.back() })}
      <h1 class=${tight ? 'title sr' : 'title'}>${t('Image editor')}</h1>
      ${edit && !ro
        ? html`<div class="nm-field">
            <label class=${tight ? 'sr' : 'nm-label'} for="img-title-name">${t('Image name')}</label>
            <div class="name"><input id="img-title-name" class="input" type="text" maxlength="80" .value=${s.doc.name} @change=${(e: Event) => s.apply({ ...s.doc, name: (e.target as HTMLInputElement).value }, 'Rename image', 'name')} /></div>
            ${x.id ? chip({ label: s.dirty ? t('Changed since saved') : t('Saved'), tone: s.dirty ? 'warn' : undefined }) : nothing}
          </div>`
        : edit
          ? html`<strong class="title">${s.doc.name}</strong>`
          : nothing}
      <span class="spacer"></span>
      ${edit && !ro
        ? html`${s.layout === 'compact' ? button({ label: t('Layers'), variant: 'secondary', size: z, pressed: s.overlay, onClick: () => (s.overlay = !s.overlay) }) : nothing}${button({ label: t('Undo'), glyph: 'undo', iconOnly: true, size: z, variant: 'secondary', keys: 'Control+Z', disabledReason: s.hist?.canUndo ? undefined : t('Undo'), onClick: () => s.undo() })}${button({ label: t('Redo'), glyph: 'redo', iconOnly: true, size: z, variant: 'secondary', keys: 'Control+Shift+Z', disabledReason: s.hist?.canRedo ? undefined : t('Redo'), onClick: () => s.redo() })}
          ${button({ label: t('Canvas size'), variant: 'secondary', size: z, haspopup: 'dialog', onClick: (e) => x.openSize(e.currentTarget as HTMLElement) })}
          ${refButton(x, sm)}
          ${button({ label: t('Export file'), variant: 'secondary', size: z, disabledReason: s.out.svg ? undefined : t('Nothing to export yet.'), onClick: () => x.download() })}
          ${button({ label: t('More'), variant: 'secondary', size: z, haspopup: 'menu', onClick: (e) => x.openMenu(e.currentTarget as HTMLElement) })}
          ${button({ label: t('Save'), glyph: 'check', variant: 'primary', size: z, keys: saveKey(), disabledReason: empty ? t('Draw something first') : x.busy ? t('Saving…') : undefined, onClick: () => x.save() })}
          <span class="sr">${mac() ? t('Save, Command+S') : t('Save, Control+S')}</span>`
        : edit
          ? button({ label: t('Export file'), variant: 'secondary', size: z, disabledReason: s.out.svg ? undefined : t('Nothing to export yet.'), onClick: () => x.download() })
          : nothing}
    </header>
    ${edit && !ro ? meter(x) : nothing}
    ${edit && !ro
      ? html`<input id="img-import" type="file" hidden accept=".svg,image/svg+xml" @change=${(e: Event) => {
          const i = e.target as HTMLInputElement;
          const f = i.files?.[0];
          i.value = '';
          if (f) void importFile(x, f);
        }} />${refPill(x)}${refPanel(x)}`
      : nothing}
    ${x.conflict
      ? html`<div class="img-notice notice warn" role="alert">${glyph('alertCircle', 20)}<div class="body"><p>${t('This image was changed somewhere else.')}</p><div class="actions">${button({ label: t('Save as a copy'), variant: 'text', size: 'sm', onClick: () => x.openDetails('copy') })}${button({ label: t('Reload'), variant: 'text', size: 'sm', onClick: () => void x.reload() })}</div></div></div>`
      : nothing}`;
}

// ── windows ──

const enter = (ok: () => void) => (e: KeyboardEvent) => {
  const el = e.target as HTMLInputElement;
  if (e.key !== 'Enter' || el.tagName !== 'INPUT' || el.type === 'checkbox') return;
  e.preventDefault();
  ok();
};

export function sizeWin(x: ImageExt): TemplateResult {
  const s = x.size!;
  const sh = x.shell;
  const create = s.mode === 'create';
  const r = readSize(s.w, s.h);
  const bad = r.ok ? [] : r.bad;
  const outside = r.ok && !create ? outsideCount(sh.doc, r.w, r.h) : 0;
  const msg = t('Use a number from {min} to {max}.', { min: String(IMAGE_CANVAS_MIN), max: String(MAX_IMAGE_BOX) });
  const side = (id: 'w' | 'h', label: string): TemplateResult =>
    field({
      id: `size-${id}`,
      label,
      error: bad.includes(id) ? msg : undefined,
      control: html`<input id=${`size-${id}`} class="input" type="text" inputmode="numeric" autocomplete="off" aria-invalid=${aria(bad.includes(id))} aria-describedby=${bad.includes(id) ? `size-${id}-error` : nothing} .value=${s[id]} @input=${(e: Event) => x.setSize({ [id]: (e.target as HTMLInputElement).value, preset: 'custom' }, id)} />`,
    });
  const go = (): void => (r.ok ? x.commitSize() : undefined);
  return html`<mc-ui-window variant="dialog" size="m" heading=${t('Canvas size')} closeLabel=${t('Close')} @mc-window-close=${() => x.closeSize()}>
    <div class="dlg" @keydown=${enter(go)}>
      <p class="help">${t('Pick a shape. Pixel numbers only set the drawing grid. The image scales to any card.')}</p>
      ${tiles({
        label: t('Shape'),
        value: s.preset,
        items: [
          ...IMAGE_CANVAS_PRESETS.map((p) => ({ value: p.ratio, label: `${p.ratio} · ${p.width} x ${p.height}`, preview: html`<span class="ratio" style=${`width:${p.width >= p.height ? 36 : Math.round((36 * p.width) / p.height)}px;height:${p.height >= p.width ? 36 : Math.round((36 * p.height) / p.width)}px`}></span>` })),
          { value: 'custom', label: t('Custom') },
        ],
        onPick: (v) => x.setSize({ preset: v }),
      })}
      <div class="sizes">${side('w', t('Width'))}${side('h', t('Height'))}</div>
      ${switchRow({ id: 'size-keep', label: t('Keep ratio'), checked: s.keep, onChange: (v) => x.setSize({ keep: v }) })}
      <p class="help">${t('{min} to {max} pixels per side.', { min: String(IMAGE_CANVAS_MIN), max: String(MAX_IMAGE_BOX) })}</p>
      ${x.ref ? button({ label: t('Match reference picture'), variant: 'secondary', size: 'sm', onClick: () => x.matchSize() }) : nothing}
      ${create ? nothing : html`<p class="help">${t("Cards that set their own shape keep it. In each card's image field, choose 'Use the drawing's shape' to follow the new one.")}</p>`}
      ${s.warned && outside ? notice({ tone: 'warn', text: t('{c, plural, one {# layer sits} other {# layers sit}} outside the new canvas. They are kept but will be cut off.', { c: outside }) }) : nothing}
    </div>
    <div slot="footer" class="foot">
      ${button({ label: s.warned ? t('Back') : t('Cancel'), variant: 'text', size: 'md', onClick: () => (s.warned ? x.setSize({}) : x.closeSize()) })}
      ${button({ label: create ? t('Create') : s.warned ? t('Apply anyway') : t('Apply'), variant: 'primary', size: 'md', disabledReason: r.ok ? undefined : msg, onClick: go })}
    </div>
  </mc-ui-window>`;
}

export function detailsWin(x: ImageExt): TemplateResult {
  const d = x.details!;
  const set = (patch: Parameters<ImageExt['setDetails']>[0]) => x.setDetails(patch);
  const heading = d.mode === 'first' ? t('Save image') : d.mode === 'copy' ? t('Save as a copy') : t('Duplicate');
  const input = (id: string, label: string, value: string, on: (v: string) => void, extra?: { error?: string; required?: boolean; max?: number }): TemplateResult =>
    field({ id, label, error: extra?.error, control: html`<input id=${id} class="input" type="text" maxlength=${extra?.max ?? 200} aria-required=${extra?.required ? 'true' : nothing} aria-invalid=${aria(!!extra?.error)} aria-describedby=${extra?.error ? `${id}-error` : nothing} .value=${value} @input=${(e: Event) => on((e.target as HTMLInputElement).value)} />` });
  const go = (): void => void x.confirmDetails();
  return html`<mc-ui-window variant="dialog" size="m" heading=${heading} closeLabel=${t('Close')} @mc-window-close=${() => x.closeDetails()}>
    <div class="dlg" @keydown=${enter(go)}>
      ${input('img-name', t('Name'), d.name, (v) => set({ name: v }), { error: d.error, required: true, max: 80 })}
      <p class="help id-line">${t('The address is mcu-image:{id}. It cannot be changed later.', { id: x.idFor(d.name) })}</p>
      <p class="help">${t('Name is the only thing you need.')}</p>
      ${d.fault ? notice({ tone: 'error', text: d.fault }) : nothing}
      <details class="more" ?open=${d.more} @toggle=${(e: Event) => (d.more = (e.target as HTMLDetailsElement).open)}>
        <summary>${t('More details')}</summary>
        ${input('img-keywords', t('Keywords'), d.keywords, (v) => set({ keywords: v }))}
        ${input('img-author', t('Author'), d.author, (v) => set({ author: v }))}
        ${field({ id: 'img-desc', label: t('Description'), control: html`<textarea id="img-desc" class="input" rows="3" maxlength="500" .value=${d.description} @input=${(e: Event) => set({ description: (e.target as HTMLTextAreaElement).value })}></textarea>` })}
      </details>
    </div>
    <div slot="footer" class="foot">
      ${button({ label: t('Cancel'), variant: 'text', size: 'md', onClick: () => x.closeDetails() })}
      ${button({ label: d.mode === 'duplicate' ? t('Duplicate') : t('Save'), variant: 'primary', size: 'md', disabledReason: x.busy ? t('Saving…') : undefined, onClick: go })}
    </div>
  </mc-ui-window>`;
}

/** Layers that carry the most anchors, then the hidden ones: what the Too big window offers. */
const weight = (s: Shape): number => s.paths.reduce((n, p) => n + p.anchors.length, 0);
const hiddenOf = (d: Doc): Shape[] => d.shapes.filter((s) => K.isOff(d, s, 'hidden'));

export function tooBigWin(x: ImageExt): TemplateResult {
  const sh = x.shell;
  const b = x.big!;
  const used = kibShown(b.bytes);
  const close = (): void => {
    x.big = undefined;
    sh.requestUpdate();
  };
  const hidden = hiddenOf(sh.base);
  const biggest = [...sh.base.shapes].sort((p, q) => weight(q) - weight(p))[0];
  return html`<mc-ui-window variant="alert" size="m" heading=${t('Too big to save')} closeLabel=${t('Close')} @mc-window-close=${close}>
    <div class="confirm">
      <p>${t('Image size: {used} KiB of 256 KiB. Too big to save.', { used })}</p>
      <p class="help">${t('Select the biggest layer and simplify it, or delete layers you do not need.')}</p>
    </div>
    <div slot="footer" class="foot">
      ${biggest
        ? button({
            label: t('Select the biggest layer'),
            variant: 'secondary',
            size: 'md',
            onClick: () => {
              sh.select([biggest.id]);
              close();
            },
          })
        : nothing}
      ${hidden.length
        ? button({
            label: t('{c, plural, one {Delete # hidden layer} other {Delete # hidden layers}}', { c: hidden.length }),
            variant: 'secondary',
            size: 'md',
            onClick: () => {
              sh.apply(K.removeShapes(sh.base, hidden.map((s) => s.id)), 'Delete hidden layers');
              sh.showToast(t('{c, plural, one {Deleted # hidden layer.} other {Deleted # hidden layers.}}', { c: hidden.length }), { label: t('Undo'), run: () => sh.undo() });
              close();
            },
          })
        : nothing}
      ${button({ label: t('Close'), variant: 'primary', size: 'md', onClick: close })}
    </div>
  </mc-ui-window>`;
}

// ── view-only workspace ──

export function viewer(x: ImageExt): TemplateResult {
  const s = x.shell;
  const sel = s.sel.length === 1 ? s.doc.shapes.find((l) => l.id === s.sel[0]) : undefined;
  const locked = s.flat.paths.map(() => ({ fill: 'none' as const, stroke: 'none' as const, locked: true }));
  const paint = (l: Shape, k: 'fill' | 'stroke'): string => {
    const v = paintOf(l, k);
    return v === 'none' ? t('None') : v === MAIN ? t('Main') : v === ACCENT ? t('Accent') : typeof v === 'string' ? v : v.t === 'linear' ? t('Linear gradient') : t('Radial gradient');
  };
  return html`<div class="vw">
    <aside class="left" aria-label=${t('Layers')}>
      <h2 class="sr">${t('Layers')}</h2>
      ${s.doc.shapes.length
        ? html`<div class="layer-btns">${[...s.doc.shapes].reverse().map((l) => html`<button type="button" class="btn btn-secondary btn-sm" aria-pressed=${aria(s.sel.includes(l.id))} @click=${() => s.select([l.id])}>${l.name}</button>`)}</div>`
        : html`<p class="help">${t('No layers yet.')}</p>`}
    </aside>
    <section class="center" aria-label=${t('Canvas')}>
      <div class="notice warn view-note" role="status">${glyph('information', 20)}<div class="body"><p>${x.readReason}</p></div></div>
      <div class="toolbar" role="toolbar" aria-label=${t('Image canvas')}>
        ${button({ label: t('Zoom out'), glyph: 'minus', iconOnly: true, size: 'sm', variant: 'secondary', onClick: () => s.zoomBy(0.8) })}${button({ label: t('Zoom in'), glyph: 'add', iconOnly: true, size: 'sm', variant: 'secondary', onClick: () => s.zoomBy(1.25) })}${button({ label: t('Fit to view'), glyph: 'fitToScreenOutline', iconOnly: true, size: 'sm', variant: 'secondary', onClick: () => s.fitView() })}
      </div>
      <div class="stagebox">
        <div class="stage tool-hand" @pointerdown=${s.cap.down} @pointermove=${s.onStageMove} @pointerup=${s.onStageUp} @pointercancel=${s.onStageUp}>
          ${K.artLayer(s as unknown as McSvgEditor)}
          <mc-path-canvas role="group" aria-label=${t('Image canvas')} .frame=${s.doc.vb} .paths=${s.flat.paths} .paint=${locked} .mode=${'select'} .snap=${{ enabled: false, grid: s.grid, anchors: false, frame: false, safeArea: false }} .pixelGrid=${false} .maxPaths=${512} .kinds=${['corner', 'smooth']} @mc-path-view=${s.onView}></mc-path-canvas>
        </div>
      </div>
    </section>
    <aside class="insp" aria-label=${t('Inspector')}>
      <h2>${sel ? sel.name : t('Image')}</h2>
      ${sel
        ? html`<p>${t('Fill: {paint}', { paint: paint(sel, 'fill') })}</p><p>${t('Outline: {paint}', { paint: paint(sel, 'stroke') })}</p>`
        : html`<p class="help">${t('{w} x {h} units. Pick a layer to read its details.', { w: s.doc.vb.w, h: s.doc.vb.h })}</p>`}
      ${button({ label: t('Close'), variant: 'primary', size: 'md', onClick: () => s.back() })}
    </aside>
  </div>`;
}

// ── canvas ──

const gradientNode = (g: Grad, id: string, b: Box): TemplateResult => {
  const n = gradGeo(g, b);
  const stops = stopsOf(g).map((s) => svg`<stop offset=${s.o} style=${`stop-color:${cssOf(s.c)}${s.a !== undefined && s.a < 1 ? `;stop-opacity:${s.a}` : ''}`}></stop>`);
  return g.t === 'linear'
    ? svg`<linearGradient id=${id} gradientUnits="userSpaceOnUse" x1=${n[0]} y1=${n[1]} x2=${n[2]} y2=${n[3]}>${stops}</linearGradient>`
    : svg`<radialGradient id=${id} gradientUnits="userSpaceOnUse" cx=${n[0]} cy=${n[1]} r=${n[2]}>${stops}</radialGradient>`;
};

/** The gradients of every layer, in drawing units like the saved file (ids per layer and paint). */
export function canvasDefs(d: Doc): TemplateResult[] {
  const out: TemplateResult[] = [];
  for (const s of d.shapes) {
    const b = s.look && K.shapeBox(s);
    if (b)
      for (const k of ['fill', 'stroke'] as const) {
        const v = paintOf(s, k);
        if (typeof v !== 'string') out.push(gradientNode(v, gradientRef(s, k), b));
      }
  }
  return out;
}
