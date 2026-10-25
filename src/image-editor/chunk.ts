import type { TemplateResult } from 'lit';
import { IMAGE_CANVAS_PRESETS, IMAGE_EDITOR_CONTRACT_REVISION } from '../contracts/image-editor';
import { IMAGE_MAX_BYTES, MAX_IMAGES, MAX_IMAGE_BOX, type ImageBinding, type SavedImage, type SavedImageInput } from '../contracts/mcu-library-images';
import type { MenuEntry } from '../contracts/path-canvas';
import type { SvgEditorSource, SvgSaveDetail } from '../contracts/svg-editor';
import type { SvgImageApi } from '../contracts/svg-image';
import type { Out } from '../svg-editor/mc-svg-editor';
import type { ImageShell, ImageUi } from '../svg-editor/image-seam';
import type { Doc, Paint, Shape } from '../svg-editor/model';
import { K, bindKit, type Kit } from './kit';
import { DEFAULT_PRESET, IMAGE_GRID_MIN, IMAGE_GRID_STEPS, gridFor, keepRatio, outsideCount, presetOf, readSize, sideOk } from './canvas';
import { t } from './i18n';
import { ImageError, fetchImage, listImages, storeImage, type ImageHass } from './library';
import { kibShown, meterLevel, savedBytes, type MeterLevel } from './meter';
import { buildSave, type Built } from './save';
import { freeImageId } from './ids';
import { cssOf, dashText, layerPaint, paintOf, parseDash, readPaint, stroked, toneOf, type Flag, type Look, type Rich } from './paint';
import { imageStyles } from './styles';
import { lookRows, handles, paintRow, type Which } from './paint-ui';
import { canvasDefs, detailsWin, sizeWin, tooBigWin, topBar, viewer } from './ui';

/*
 * The image-only half of <mc-svg-editor> (contract image-editor 1.0.0): what the shell asks of an ImageUi at the places
 * where an image differs from an icon. Holds the canvas size, the save path, the size meter's words and the view-only
 * workspace. It draws no SVG itself: every sanitiser, thumbnail and download goes through the svg-image chunk's api.
 */

export interface SizeDlg {
  mode: 'create' | 'apply';
  preset: string;
  w: string;
  h: string;
  keep: boolean;
  /** Layers would be cut off: the warning is showing and the next Apply goes through. */
  warned: boolean;
}

export interface DetailsDlg {
  mode: 'first' | 'copy' | 'duplicate';
  name: string;
  keywords: string;
  author: string;
  description: string;
  more: boolean;
  error?: string;
}

/** Main, Accent and none are the layer's own paints; any other value is read by lookOf (the layer then keeps Main as its placeholder). */
const tone = (v: string): Paint => toneOf(v) ?? (/^(none|transparent)$/i.test(v) ? 'none' : 'main');

/** The id of a layer's gradient in the canvas. */
export const gradientRef = (s: Shape, k: 'fill' | 'stroke'): string => `cg-${s.id}-${k[0]}`;

/** Parts the editor cannot keep: text, clipping, masks, copies, opacity of a group or of a fill or stroke alone. */
const LOSSY = 'text,tspan,clipPath,mask,use,image,[clip-path],[mask],[fill-opacity],[stroke-opacity],g[opacity],svg[opacity]';

/** The paints, opacity and dashes of one element, put on its layer; `f.v` is set when something in it cannot be kept. */
function lookOf(el: Element, s: Shape, xml: Document, f: Flag): Shape {
  const inherited = (k: string): string | undefined => {
    for (let e: Element | null = el; e; e = e.parentElement) {
      const v = e.getAttribute(k);
      if (v !== null) return v.trim();
    }
    return undefined;
  };
  const box = K.shapeBox(s) ?? { x: 0, y: 0, w: 0, h: 0 };
  const rich = (k: 'fill' | 'stroke'): Rich | undefined => {
    const v = inherited(k);
    return s[k] === 'none' || v === undefined || toneOf(v) || tone(v) === 'none' ? undefined : readPaint(v, xml, box, f);
  };
  const look: Look = {};
  const fill = rich('fill');
  const stroke = rich('stroke');
  if (fill !== undefined) look.fill = fill;
  if (stroke !== undefined) look.stroke = stroke;
  const op = el.getAttribute('opacity');
  if (op !== null) {
    const n = Number(op);
    if (n >= 0 && n <= 1) look.opacity = Math.round(n * 100);
    else f.v = true;
  }
  const dash = inherited('stroke-dasharray');
  if (s.stroke !== 'none' && dash && dash !== 'none') {
    const d = parseDash(dash);
    if (d === 'bad') f.v = true;
    else if (d.length) look.dash = d;
    const off = Number(inherited('stroke-dashoffset') ?? 0);
    if (look.dash && Number.isFinite(off) && off) look.offset = off;
  }
  if (look.opacity === 100) delete look.opacity;
  return Object.keys(look).length ? { ...s, look } : s;
}

/** A library image (already through the image sanitiser) as a document; `all` is false when parts of it cannot be edited yet. */
function readImage(markup: string, viewBox: string, name: string): { doc: Doc; all: boolean } {
  const notes = K.emptyNotes();
  const xml = new DOMParser().parseFromString(markup, 'image/svg+xml');
  const flag: Flag = { v: !!xml.querySelector(LOSSY) };
  const doc = K.readMarkup(markup, viewBox, notes, name, tone, (el, s) => lookOf(el, s, xml, flag));
  return { doc, all: !flag.v };
}

// eslint-disable-next-line no-control-regex
const esc = (s: string): string => s.replace(/[<>"&\\\u0000-\u001f]/g, '').slice(0, 80);

export class ImageExt implements ImageUi {
  readonly revision = IMAGE_EDITOR_CONTRACT_REVISION;
  readonly styles = [imageStyles];
  readonly grid = { chips: IMAGE_GRID_STEPS, min: IMAGE_GRID_MIN, max: MAX_IMAGE_BOX };
  /** Library id once the image is saved or was opened from the library; fixed from then on. */
  id?: string;
  updatedAt?: string;
  private stored: ImageBinding[] = [];
  private meta: Pick<SavedImageInput, 'keywords' | 'author' | 'description'> = {};
  denied = false;
  lossy = false;
  problem?: string;
  busy = false;
  conflict = false;
  size?: SizeDlg;
  details?: DetailsDlg;
  big?: { bytes: number; limit?: number };
  kibOpen = false;
  level?: MeterLevel;
  /** Ids already in the library (loaded when a name dialog opens). */
  taken?: Set<string>;
  private pending: Array<{ kind: 'warn' | 'info'; text: string; detail?: string[] }> = [];
  private back?: HTMLElement;
  private colours = false;
  /** The paint whose gradient handles show, and the field with a message under it. */
  which: Which = 'fill';
  problemAt?: string;
  dashList?: string;
  dragging = false;
  private gradients: string[] = [];
  private gradientId = (): string => 'grad1';

  constructor(
    readonly shell: ImageShell,
    readonly api: SvgImageApi,
  ) {}

  private get hass(): ImageHass | undefined {
    return this.shell.hass as unknown as ImageHass | undefined;
  }

  /** Library writes are allowed: Magic Card Utils is present and the user is an administrator (the server enforces it too). */
  get canWrite(): boolean {
    return this.shell.libraryAvailable && (this.shell.hass as { user?: { is_admin?: boolean } } | undefined)?.user?.is_admin === true;
  }

  get readOnly(): boolean {
    return !this.canWrite || this.denied || this.lossy;
  }

  /** Why the editor is view-only, in plain words. */
  get readReason(): string {
    if (this.lossy) return t('This image has parts that this editor cannot change yet, so it opens for viewing only.');
    if (this.noLibrary) return t('Images need Magic Card Utils. It is installed through HACS, like Magic Card.');
    return t('You can look at this image but not change it. Ask an administrator.');
  }

  private get noLibrary(): boolean {
    return !this.shell.libraryAvailable;
  }

  get title(): string {
    return t('Image editor');
  }

  get canvasLabel(): string {
    return t('Image canvas');
  }

  get modal(): boolean {
    return !!(this.size || this.details || this.big);
  }

  get name(): string {
    return this.shell.doc.name.trim();
  }

  // ── opening ──

  async open(src: SvgEditorSource): Promise<Doc | undefined> {
    this.problem = undefined;
    if (src.kind === 'image-blank') {
      const w = src.width;
      const h = src.height;
      const known = w !== undefined && h !== undefined && sideOk(w) && sideOk(h);
      const doc = this.canvasDoc(known ? w : DEFAULT_PRESET.width, known ? h : DEFAULT_PRESET.height);
      if (!known) this.size = { mode: 'create', preset: DEFAULT_PRESET.ratio, w: String(DEFAULT_PRESET.width), h: String(DEFAULT_PRESET.height), keep: true, warned: false };
      return doc;
    }
    if (src.kind === 'image-svg') {
      const s = this.api.sanitizeImage(src.svg, { file: true });
      if (s.error) {
        this.problem = this.sanitiseText(s.error);
        return undefined;
      }
      const r = readImage(s.markup, s.viewBox, t('My image'));
      if (!r.doc.shapes.length) {
        this.problem = t('That file has no shapes an image can use.');
        return undefined;
      }
      K.reserveIds([...r.doc.shapes.map((x) => x.id), ...r.doc.groups.map((x) => x.id)]);
      if (s.stripped.length) this.pending.push({ kind: 'warn', text: t('Removed parts an image cannot use. Everything else was kept.'), detail: s.stripped });
      if (!r.all) this.pending.push({ kind: 'warn', text: t('Some parts of this file, such as text, gradients or transparency, cannot be edited yet. They were left out.') });
      return r.doc;
    }
    if (src.kind !== 'image') return undefined;
    try {
      const item = await fetchImage(this.hass, src.id);
      if (!item) {
        this.problem = t('This image is no longer in the library.');
        return undefined;
      }
      return this.fromStored(item);
    } catch (e) {
      this.problem = this.problemText(e);
      return undefined;
    }
  }

  private fromStored(item: SavedImage): Doc | undefined {
    const s = this.api.sanitizeImage(item.svg);
    if (s.error) {
      this.problem = this.sanitiseText(s.error);
      return undefined;
    }
    const r = readImage(s.markup, s.viewBox, item.name);
    K.reserveIds([...r.doc.shapes.map((x) => x.id), ...r.doc.groups.map((x) => x.id)]);
    this.id = item.id;
    this.updatedAt = item.updated_at;
    this.stored = item.bindings ?? [];
    this.meta = { keywords: item.keywords, author: item.author, description: item.description };
    this.lossy = !r.all;
    this.conflict = false;
    return r.doc;
  }

  /** Called when the first document is showing. */
  ready(): void {
    const sh = this.shell;
    sh.safe = false;
    sh.grid = gridFor(sh.doc.vb.w, sh.doc.vb.h);
    if (this.readOnly) sh.tool = 'hand';
    if (this.pending.length) {
      sh.banners = this.pending.map((b, i) => ({ id: `note${i}`, kind: b.kind, text: b.text, detail: b.detail }));
      this.pending = [];
    }
    this.shell.requestUpdate();
  }

  private canvasDoc(w: number, h: number): Doc {
    return { ...K.blankDoc(''), vb: { x: 0, y: 0, w, h } };
  }

  private sanitiseText(e: string): string {
    return e === 'too_large' ? t('That drawing is over 256 KiB.') : e === 'not_svg' ? t('This is not valid SVG. Check that it starts with <svg and is closed.') : e === 'empty' ? t('That file has no shapes an image can use.') : t('That file cannot be used as an image.');
  }

  // ── markup out ──

  serialiseLayer(layer: unknown): string {
    const s = layer as Shape;
    const name = esc(s.name);
    const on = s.stroke !== 'none' && s.width > 0;
    return (
      ` id="${s.id}"${name ? ` data-name="${name}"` : ''}` +
      layerPaint(s, () => K.shapeBox(s), this.gradients, this.gradientId) +
      (s.fill !== 'none' && s.rule === 'evenodd' ? ' fill-rule="evenodd"' : '') +
      (on ? `${s.cap !== 'butt' ? ` stroke-linecap="${s.cap}"` : ''}${s.join !== 'miter' ? ` stroke-linejoin="${s.join}"` : ''}` : '')
    );
  }

  importParts(): unknown[] {
    return [];
  }

  bindings(): ImageBinding[] {
    return [...this.stored];
  }

  buildOut(doc: Doc, decimals: number): Out {
    const points = K.pointCount(doc);
    const vb = `${doc.vb.x} ${doc.vb.y} ${doc.vb.w} ${doc.vb.h}`;
    this.gradients = [];
    const taken = new Set(doc.shapes.map((s) => s.id));
    let n = 0;
    this.gradientId = () => {
      let id: string;
      do id = `grad${++n}`;
      while (taken.has(id));
      return id;
    };
    const body = K.toSvg(doc, decimals, (s, d) => `<path d="${d}"${this.serialiseLayer(s)}/>`);
    const raw = this.gradients.length ? body.replace(/^(<svg[^>]*>)/, `$1<defs>${this.gradients.join('')}</defs>`) : body;
    if (!/<path/.test(raw)) return { bytes: 0, error: 'empty', points, viewBox: vb };
    const s = this.api.sanitizeImage(raw);
    if (s.error) return { bytes: s.bytes, error: s.error === 'too_large' ? 'over' : 'invalid', message: s.error, points, viewBox: vb };
    const bytes = savedBytes(s.markup, this.stored);
    return { svg: s.markup, bytes, error: bytes > IMAGE_MAX_BYTES ? 'over' : undefined, points, viewBox: s.viewBox };
  }

  /** The same change to every selected layer, each judged on its own (locked layers stay as they are). */
  edit(f: (s: Shape) => Shape, label: string, merge?: string): void {
    this.shell.editShapes(this.shell.sel, f, label, merge);
  }

  /** The colour popup lives in the card editor's chunk; ask for it once. */
  needColours(): void {
    if (this.colours) return;
    this.colours = true;
    void window.MagicCard?.loadEditor?.()
      ?.then(() => customElements.whenDefined('mc-color-picker'))
      .then(() => this.shell.requestUpdate());
  }

  paint(s: Shape, k: Which): TemplateResult {
    return paintRow(this, s, k);
  }

  more(s: Shape): TemplateResult {
    return lookRows(this, s);
  }

  handles(): TemplateResult | undefined {
    return handles(this) as TemplateResult | undefined;
  }

  style(s: Shape): string {
    const css = (k: 'fill' | 'stroke'): string => {
      const v = paintOf(s, k);
      return typeof v === 'string' ? cssOf(v) : `url(#${gradientRef(s, k)})`;
    };
    const l = s.look;
    return (
      `fill:${css('fill')};stroke:${css('stroke')}` +
      (l?.opacity !== undefined && l.opacity < 100 ? `;opacity:${l.opacity / 100}` : '') +
      (stroked(s) && l?.dash?.length ? `;stroke-dasharray:${dashText(l.dash)};stroke-dashoffset:${l.offset ?? 0}` : '')
    );
  }

  defs(doc: Doc): TemplateResult[] {
    return canvasDefs(doc);
  }

  stamp(doc: Doc): string {
    return K.toSvg(doc) + doc.shapes.map((s) => (s.look ? JSON.stringify(s.look) : '')).join('|');
  }

  blockReason(out: Out): string | undefined {
    return out.error === 'empty' ? t('Draw something first') : out.error === 'over' ? t('Too big to save') : out.error === 'invalid' ? t('This drawing cannot be saved as an image.') : undefined;
  }

  /** The meter's sentence for a size. */
  sentence(bytes: number): string {
    const used = kibShown(bytes);
    const l = meterLevel(bytes);
    return l === 'small' ? t('Image size: {used} KiB of 256 KiB. Fine.', { used }) : l === 'big' ? t('Image size: {used} KiB of 256 KiB. Getting big. Large images can be slow on wall tablets.', { used }) : l === 'full' ? t('Image size: {used} KiB of 256 KiB. Nearly full. You can add a little more.', { used }) : t('Image size: {used} KiB of 256 KiB. Too big to save.', { used });
  }

  word(l: MeterLevel): string {
    return l === 'small' ? t('fine') : l === 'big' ? t('getting big') : l === 'full' ? t('nearly full') : t('too big');
  }

  /** One polite announcement per crossing into Getting big or Nearly full (Too big is an alert in the meter itself). */
  changed(out: Out): void {
    const l = out.error === 'empty' ? 'small' : meterLevel(out.bytes);
    const was = this.level;
    this.level = l;
    if (was && was !== l && (l === 'big' || l === 'full')) this.shell.say(this.sentence(out.bytes));
  }

  // ── canvas size ──

  openSize(opener?: HTMLElement): void {
    const v = this.shell.doc.vb;
    this.back = opener;
    this.size = { mode: 'apply', preset: presetOf(v.w, v.h), w: String(v.w), h: String(v.h), keep: true, warned: false };
    this.shell.requestUpdate();
  }

  setSize(patch: Partial<SizeDlg>, edited?: 'w' | 'h'): void {
    if (!this.size) return;
    const s = { ...this.size, ...patch, warned: false };
    const pre = IMAGE_CANVAS_PRESETS.find((x) => x.ratio === patch.preset);
    if (pre) {
      s.w = String(pre.width);
      s.h = String(pre.height);
    }
    if (edited && s.keep) {
      const n = Number(s[edited].replace(',', '.'));
      const cur = readSize(this.size.w, this.size.h);
      const base = cur.ok ? { w: cur.w, h: cur.h } : { w: this.shell.doc.vb.w, h: this.shell.doc.vb.h };
      if (sideOk(n)) {
        const o = keepRatio(base, edited, n);
        if (edited === 'w') s.h = String(o.h);
        else s.w = String(o.w);
      }
    }
    this.size = s;
    this.shell.requestUpdate();
  }

  closeSize(): void {
    const create = this.size?.mode === 'create';
    this.size = undefined;
    this.shell.requestUpdate();
    if (create) this.shell.fire('mc-svg-close', { dirty: false });
    else this.restoreFocus();
  }

  commitSize(): void {
    const s = this.size;
    if (!s) return;
    const r = readSize(s.w, s.h);
    if (!r.ok) return;
    const sh = this.shell;
    if (s.mode === 'create') {
      sh.begin(this.canvasDoc(r.w, r.h));
      this.size = undefined;
      this.ready();
      return;
    }
    const out = outsideCount(sh.doc, r.w, r.h);
    if (out && !s.warned) {
      this.size = { ...s, warned: true };
      sh.requestUpdate();
      return;
    }
    sh.apply({ ...sh.doc, vb: { ...sh.doc.vb, w: r.w, h: r.h } }, 'Canvas size');
    sh.grid = gridFor(r.w, r.h);
    this.size = undefined;
    sh.say(t('Canvas size set to {w} by {h}.', { w: r.w, h: r.h }));
    sh.requestUpdate();
    sh.fitView();
    this.restoreFocus();
  }

  private restoreFocus(): void {
    const b = this.back;
    this.back = undefined;
    queueMicrotask(() => (b?.isConnected ? b : this.shell.canvas())?.focus({ preventScroll: true }));
  }

  // ── save ──

  save(): void {
    const sh = this.shell;
    if (this.readOnly || sh.stage !== 'edit' || this.busy) return;
    const why = this.blockReason(sh.out);
    if (why || !sh.out.svg) {
      if (sh.out.error === 'over') this.big = { bytes: sh.out.bytes };
      else sh.say(why ?? '');
      sh.requestUpdate();
      return;
    }
    if (!this.id || !this.name) return this.openDetails('first');
    void this.write({ id: this.id, name: this.name, ...this.meta }, false);
  }

  openDetails(mode: DetailsDlg['mode'], opener?: HTMLElement): void {
    this.back = opener ?? this.back;
    const name = mode === 'first' ? this.name : t('{name} copy', { name: this.name || t('My image') });
    this.details = { mode, name, keywords: (this.meta.keywords ?? []).join(', '), author: this.meta.author ?? '', description: this.meta.description ?? '', more: false };
    this.shell.requestUpdate();
    void this.loadTaken();
  }

  setDetails(patch: Partial<DetailsDlg>): void {
    if (!this.details) return;
    this.details = { error: undefined, ...this.details, ...patch };
    if (!('error' in patch)) this.details.error = undefined;
    this.shell.requestUpdate();
  }

  closeDetails(): void {
    this.details = undefined;
    this.shell.requestUpdate();
    this.restoreFocus();
  }

  private async loadTaken(): Promise<void> {
    try {
      this.taken = new Set((await listImages(this.hass)).map((i) => i.id));
    } catch {
      this.taken = undefined;
    }
    this.shell.requestUpdate();
  }

  /** The address the name dialog shows. */
  idFor(name: string): string {
    return freeImageId(name, this.taken ?? new Set());
  }

  async confirmDetails(): Promise<void> {
    const d = this.details;
    if (!d || this.busy) return;
    const name = d.name.trim();
    if (!name) return this.setDetails({ error: t('Give it a name.') });
    if (name.length > 80) return this.setDetails({ error: t('Use 80 characters or fewer.') });
    const meta = {
      name,
      keywords: d.keywords.split(',').map((k) => k.trim()).filter(Boolean).slice(0, 12),
      author: d.author.trim() || undefined,
      description: d.description.trim() || undefined,
    };
    this.busy = true;
    this.shell.requestUpdate();
    try {
      const taken = new Set((await listImages(this.hass)).map((i) => i.id));
      this.taken = taken;
      if (taken.size >= MAX_IMAGES) return this.setDetails({ error: t('The library is full (200 images). Delete one to add another.') });
      const id = freeImageId(name, taken);
      if (d.mode === 'duplicate') await this.duplicate(id, meta);
      else await this.write({ id, ...meta }, d.mode === 'copy');
    } catch (e) {
      this.setDetails({ error: this.problemText(e) });
    } finally {
      this.busy = false;
      this.shell.requestUpdate();
    }
  }

  /** Builds the payload from the committed drawing. */
  async buildSave(meta: { id: string; name: string }): Promise<{ ok: true; input: SavedImageInput } | { ok: false; reason: 'too_large' | 'full' | 'invalid'; bytes?: number }> {
    const out = this.shell.out;
    if (!out.svg) return { ok: false, reason: 'invalid' };
    const r: Built = await buildSave(this.api, out.svg, this.stored, { ...this.meta, ...meta });
    return r.ok ? { ok: true, input: r.input } : { ok: false, reason: r.reason === 'too_large' ? 'too_large' : 'invalid', bytes: r.bytes };
  }

  /** Save under `meta.id`: an existing id with its stored version (conflict check), `copy` a new id and the editor goes on with it. */
  private async write(meta: { id: string; name: string; keywords?: string[]; author?: string; description?: string }, copy: boolean): Promise<void> {
    const sh = this.shell;
    this.busy = true;
    this.conflict = false;
    sh.note = undefined;
    sh.requestUpdate();
    try {
      const built = await this.buildSave(meta);
      if (!built.ok) {
        this.details = undefined;
        if (built.reason === 'too_large') this.big = { bytes: built.bytes ?? sh.out.bytes };
        else sh.note = { tone: 'error', lines: [this.blockReason({ ...sh.out, error: 'invalid' }) ?? ''] };
        return;
      }
      const isNew = copy || meta.id !== this.id;
      const sum = await storeImage(this.hass, { ...built.input, ...(meta.keywords ? { keywords: meta.keywords } : {}) }, isNew ? undefined : this.updatedAt);
      const was = this.id;
      this.id = sum.id;
      this.updatedAt = sum.updated_at;
      this.meta = { keywords: meta.keywords, author: meta.author, description: meta.description };
      this.details = undefined;
      this.api.invalidate([sum.id]);
      if (sh.doc.name !== meta.name) sh.apply({ ...sh.doc, name: meta.name }, 'Rename image', 'name');
      sh.markSaved();
      sh.fire('mc-svg-save', { target: 'image-library', svg: built.input.svg, saved: built.input } satisfies SvgSaveDetail);
      if (copy && was) {
        sh.showToast(t("Saved as '{name}'. The original is unchanged.", { name: meta.name }), undefined, 8000);
        sh.say(t("Saved as '{name}'. The original is unchanged.", { name: meta.name }));
      } else {
        sh.showToast(t("Saved '{name}'.", { name: meta.name }), undefined, 6000);
        sh.say(t('Saved'));
      }
      this.restoreFocus();
    } catch (e) {
      this.fail(e);
    } finally {
      this.busy = false;
      sh.requestUpdate();
    }
  }

  /** Duplicate: the stored version under a new id, then the editor shows the copy. */
  private async duplicate(newId: string, meta: { name: string }): Promise<void> {
    const sh = this.shell;
    const src = this.id ? await fetchImage(this.hass, this.id) : undefined;
    if (!src) throw new ImageError('invalid');
    const { id: _id, created_at: _c, updated_at: _u, ...rest } = src;
    void _id;
    void _c;
    void _u;
    const input: SavedImageInput = { ...rest, id: newId, name: meta.name };
    const sum = await storeImage(this.hass, input);
    this.details = undefined;
    const doc = this.fromStored({ ...src, ...input, created_at: sum.updated_at, updated_at: sum.updated_at });
    if (doc) {
      sh.begin(doc);
      this.ready();
    }
    this.api.invalidate([newId]);
    sh.fire('mc-svg-save', { target: 'image-library', svg: input.svg, saved: input } satisfies SvgSaveDetail);
    sh.showToast(t("Saved as '{name}'. The original is unchanged.", { name: meta.name }), undefined, 8000);
    this.restoreFocus();
  }

  private problemText(e: unknown): string {
    const p = e instanceof ImageError ? e.problem : 'unreachable';
    return p === 'readonly'
      ? t('You can look at this image but not change it. Ask an administrator.')
      : p === 'conflict'
        ? t('This image was changed somewhere else.')
        : p === 'full'
          ? t('The library is full (200 images). Delete one to add another.')
          : p === 'too_large'
            ? t('Too big to save')
            : p === 'invalid'
              ? t('The library could not accept this image. Tidy it and try again.')
              : p === 'missing'
                ? t('Images need Magic Card Utils. It is installed through HACS, like Magic Card.')
                : t('Could not reach Magic Card Utils. Your work is safe.');
  }

  private fail(e: unknown): void {
    const sh = this.shell;
    if (e instanceof ImageError) {
      if (e.problem === 'conflict') {
        this.details = undefined;
        this.conflict = true;
        sh.say(t('This image was changed somewhere else.'));
        return;
      }
      if (e.problem === 'too_large') {
        this.details = undefined;
        this.big = { bytes: e.bytes ?? sh.out.bytes, limit: e.limit };
        return;
      }
      if (e.problem === 'readonly' || e.problem === 'missing') {
        this.details = undefined;
        this.denied = e.problem === 'readonly' || this.denied;
        sh.tool = 'hand';
      }
    }
    sh.note = { tone: 'error', lines: [this.problemText(e)] };
  }

  /** Conflict: keep this drawing as a new image, or load the stored one. */
  async reload(): Promise<void> {
    if (!this.id) return;
    try {
      const item = await fetchImage(this.hass, this.id);
      const doc = item && this.fromStored(item);
      if (doc) {
        this.shell.begin(doc);
        this.ready();
      }
    } catch (e) {
      this.fail(e);
    }
  }

  // ── export, menu, keys ──

  exportFile(): Blob | undefined {
    const svg = this.shell.out.svg;
    return svg ? this.api.fileBlob(svg) : undefined;
  }

  download(): void {
    const b = this.exportFile();
    if (!b) return;
    const url = URL.createObjectURL(b);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${K.slug(this.name || t('My image'))}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /** The More menu under its button; a pick comes back to pick(). */
  openMenu(opener: HTMLElement): void {
    const r = opener.getBoundingClientRect();
    this.shell.menu = { items: this.menuItems(), at: [r.left, r.bottom], touch: false, opener, key: 'xfer' };
  }

  menuItems(): MenuEntry[] {
    const sh = this.shell;
    const need = this.id ? undefined : t('Save the image first.');
    return [
      { id: 'img:copy', label: t('Save as a copy…'), reason: sh.out.svg ? undefined : t('Draw something first') },
      { id: 'img:duplicate', label: t('Duplicate…'), reason: need ?? (sh.dirty ? t('Save your changes first.') : undefined) },
    ];
  }

  pick(id: string): void {
    if (id === 'copy') this.openDetails('copy');
    else if (id === 'duplicate') this.openDetails('duplicate');
  }

  close(): boolean {
    if (this.big) this.big = undefined;
    else if (this.details) return this.closeDetails(), true;
    else if (this.size) return this.closeSize(), true;
    else return false;
    this.shell.requestUpdate();
    return true;
  }

  dispose(): void {
    this.size = this.details = this.big = undefined;
  }

  topBar(): TemplateResult {
    return topBar(this);
  }

  viewer(): TemplateResult {
    return viewer(this);
  }

  dialogs(): TemplateResult | undefined {
    if (this.size) return sizeWin(this);
    if (this.details) return detailsWin(this);
    if (this.big) return tooBigWin(this);
    return undefined;
  }
}

export function createImageExt(shell: ImageShell, api: SvgImageApi, kit: Kit): ImageUi {
  bindKit(kit);
  return new ImageExt(shell, api);
}
