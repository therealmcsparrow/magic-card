import { html, type TemplateResult } from 'lit';
import { IMAGE_CANVAS_PRESETS, IMAGE_EDITOR_CONTRACT_REVISION, IMAGE_PART_DATA_MAX } from '../contracts/image-editor';
import { IMAGE_MAX_BYTES, MAX_IMAGES, MAX_IMAGE_BOX, type ImageBinding, type SavedImage, type SavedImageInput } from '../contracts/mcu-library-images';
import type { MenuEntry } from '../contracts/path-canvas';
import type { KitButtonOptions } from '../contracts/ui-kit';
import type { Pt } from '../contracts/path-model';
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
import { button } from '../ui-kit/templates';
import { lookRows, handles, paintRow, withLook, type Which } from './paint-ui';
import { anchorOf, blank, boxFor, readText, refusedWord, textAttrs, textBody, nameOf, type TextData } from './text';
import { addText, addTextButton, textNode, textRows } from './text-ui';
import { cancelField, disposeField, place, textField, type TextField } from './text-tool';
import { FRESH, decodePicture, dispose as disposeRef, matchShape, moved, underlay, type Align, type Picture } from './reference';
import { closePanel } from './reference-ui';
import { importWin, refuse, replaceWin, summary, type Imported } from './importer';
import { contextOf, layerOf, lift, partColours, plain, partDefs, partNode, partOut, partRows, type Held } from './part';
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
  /** What went wrong with the save itself (not with the name). */
  fault?: string;
}

/** Main, Accent and none are the layer's own paints; any other value is read by lookOf (the layer then keeps Main as its placeholder). */
/** Layer opacity (percent) of a shape drawn while a reference picture shows, so the picture stays visible through it. */
const REF_OPACITY = 60;

const tone = (v: string): Paint => toneOf(v) ?? (/^(none|transparent)$/i.test(v) ? 'none' : 'main');

/** The id of a layer's gradient in the canvas. */
export const gradientRef = (s: Shape, k: 'fill' | 'stroke'): string => `cg-${s.id}-${k[0]}`;

/** The paints, opacity and dashes of one element, put on its layer; `f.v` is set when something in it cannot be kept. */
function lookOf(el: Element, s: Shape, xml: Document, f: Flag, texts: Map<string, TextData>): Shape {
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
  const words = texts.get(el.getAttribute('data-mc-text') ?? '');
  if (words) {
    look.text = words;
    if (!el.hasAttribute('data-name')) s = { ...s, name: nameOf(words.s, t('Text')) };
  }
  return Object.keys(look).length ? { ...s, look } : s;
}

/**
 * A library image (already through the image sanitiser) as a document. Each run of adjacent elements the editor cannot edit
 * becomes one locked layer (see part.ts); `all` is false only when the markup did not parse as XML.
 */
function readImage(markup: string, viewBox: string, name: string): { doc: Doc; all: boolean } {
  const notes = K.emptyNotes();
  const xml = new DOMParser().parseFromString(markup, 'image/svg+xml');
  const flag: Flag = { v: false };
  const texts = new Map<string, TextData>();
  if (xml.querySelector('parsererror') && /<text[\s>]/i.test(markup)) flag.v = true;
  K.reserveIds([...xml.querySelectorAll('[id]')].map((e) => e.id));
  const held = lift(xml, (el) => !!readText(el, { v: false }));
  // each text becomes a rectangle with the same paint and place, carrying a number that finds its words again
  [...xml.querySelectorAll('text')].forEach((el, i) => {
    const r = readText(el, flag);
    if (!r) return;
    const b = boxFor(r.at, r.t);
    const box = xml.createElementNS(el.namespaceURI, 'rect');
    for (const k of ['id', 'data-name', 'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-dashoffset', 'opacity']) {
      const v = el.getAttribute(k);
      if (v !== null) box.setAttribute(k, v);
    }
    box.setAttribute('x', String(b.x));
    box.setAttribute('y', String(b.y));
    box.setAttribute('width', String(b.w));
    box.setAttribute('height', String(b.h));
    box.setAttribute('data-mc-text', String(i));
    texts.set(String(i), r.t);
    el.replaceWith(box);
  });
  const runs = new Map<string, Held>();
  const src = held.size || texts.size ? new XMLSerializer().serializeToString(xml) : markup;
  const doc = K.readMarkup(src, viewBox, notes, name, tone, (el, s) => {
    const lifted = held.get(el.getAttribute('data-mc-part') ?? '');
    const f: Flag = { v: false };
    const r = lifted ? s : lookOf(el, s, xml, f, texts);
    if (lifted || f.v) runs.set(s.id, lifted ?? { el, ctx: contextOf(el) });
    return r;
  });
  if (!runs.size) return { doc, all: !flag.v };
  // adjacent parts in the same group, under groups with the same attributes, are one layer
  const shapes: Shape[] = [];
  let run: { at: Shape; held: Held[] } | undefined;
  let used = 0;
  const close = (): void => {
    if (!run) return;
    const l = flag.v ? run.at : layerOf(run.at, run.held, xml, doc.vb, shapes.filter((x) => x.look?.part).length + 1);
    const p = l.look?.part;
    // what the parts hold, definitions included once for each part that uses them, the part just made counted too
    if (p) used += p.m.length + [...p.d.values()].reduce((n, d) => n + d.length, 0);
    if (used > IMAGE_PART_DATA_MAX) flag.v = true;
    shapes.push(l);
    run = undefined;
  };
  for (const s of doc.shapes) {
    const h = runs.get(s.id);
    if (h && run && !h.own && !run.held[0].own && run.at.group === s.group && run.held[0].ctx.join() === h.ctx.join()) run.held.push(h);
    else {
      close();
      if (h) run = { at: s, held: [h] };
      else shapes.push(s);
    }
  }
  close();
  return { doc: { ...doc, shapes }, all: !flag.v };
}

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
  /** Why the file chosen in the start window was not opened (the window stays open). */
  startError?: string;
  details?: DetailsDlg;
  big?: { bytes: number; limit?: number };
  kibOpen = false;
  /** The canvas draws Main and Accent the way a card does with its entity off. */
  asCard = false;
  level?: MeterLevel;
  /** Ids already in the library (loaded when a name dialog opens). */
  taken?: Set<string>;
  /** The reference picture (held in page memory only), its alignment, and what its panel shows. */
  ref?: Picture;
  shown = true;
  align: Align = FRESH;
  refOpen = false;
  msg?: string;
  note?: string;
  decode: (f: Blob) => Promise<Picture> = decodePicture;
  /** The import summary window. */
  imp?: Imported;
  /** A file ready to replace a drawing that has content: waits for the answer. */
  replacing?: { doc: Doc; stripped: string[]; name: string };
  private back?: HTMLElement;
  private colours = false;
  /** The paint whose gradient handles show, and the field with a message under it. */
  which: Which = 'fill';
  problemAt?: string;
  dashList?: string;
  dragging = false;
  /** The Text tool's field while it is open, and the listener that keeps it in view above a soft keyboard. */
  field?: TextField;
  viewport?: () => void;
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
    return !!(this.size || this.details || this.big || this.imp || this.replacing);
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
      const r = this.openSvg(src.svg);
      if (typeof r === 'string') {
        this.problem = r;
        return undefined;
      }
      return r;
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

  /** The 'image-svg' source: the markup of an opened file through the sanitiser, with the import summary. */
  private openSvg(text: string, name?: string): Doc | string {
    const r = this.fromFile(text, t('My image'));
    if (typeof r === 'string') return r;
    this.imp = summary(name, r.stripped, r.doc);
    return r.doc;
  }

  /** Open file in the start window: the file gate, then the same path as the 'image-svg' source. A refusal keeps the window open. */
  async startFile(file: File): Promise<void> {
    let why = refuse(file);
    let text = '';
    if (!why) {
      try {
        text = await file.text();
      } catch {
        why = t('The file could not be read.');
      }
    }
    const r = why ? why : this.openSvg(text, file.name);
    if (typeof r === 'string') {
      this.startError = r;
      this.shell.requestUpdate();
      return;
    }
    this.startError = undefined;
    this.size = undefined;
    this.shell.begin(r);
    this.ready();
    this.restoreFocus();
  }

  /** A file's markup through the sanitiser and the reader: the document, or the reason it gave nothing. */
  private fromFile(text: string, name: string): { doc: Doc; stripped: string[] } | string {
    const s = this.api.sanitizeImage(text, { file: true });
    if (s.error) return this.sanitiseText(s.error);
    const r = readImage(s.markup, s.viewBox, name);
    if (!r.doc.shapes.length) return t('That file has no shapes an image can use.');
    if (!r.all) return t('That file cannot be used as an image.');
    K.reserveIds([...r.doc.shapes.map((x) => x.id), ...r.doc.groups.map((x) => x.id)]);
    return { doc: r.doc, stripped: s.stripped };
  }

  /** An imported file replaces the drawing as one undoable step. */
  importSvg(text: string, name: string): void {
    const sh = this.shell;
    const r = this.fromFile(text, sh.doc.name);
    if (typeof r === 'string') {
      this.imp = { name, kinds: [], kept: false, error: r };
      return;
    }
    if (sh.doc.shapes.length) {
      this.replacing = { ...r, name };
      sh.requestUpdate();
      return;
    }
    this.useFile(r, name);
  }

  /** The answer to the replace question: use the file. */
  confirmReplace(): void {
    const r = this.replacing;
    this.replacing = undefined;
    if (r) this.useFile(r, r.name);
    this.restoreFocus();
  }

  cancelReplace(): void {
    this.replacing = undefined;
    this.shell.requestUpdate();
    this.restoreFocus();
  }

  private useFile(r: { doc: Doc; stripped: string[] }, name: string): void {
    const sh = this.shell;
    sh.apply(r.doc, 'Import SVG file');
    sh.grid = gridFor(r.doc.vb.w, r.doc.vb.h);
    this.imp = summary(name, r.stripped, r.doc);
    sh.showToast(t("Imported '{name}'.", { name }), { label: t('Undo'), run: () => sh.undo() });
    sh.requestUpdate();
    sh.fitView();
  }

  closeImport(): void {
    this.imp = undefined;
    this.shell.requestUpdate();
    this.restoreFocus();
  }

  get hasRef(): boolean {
    return !!this.ref && this.shown;
  }

  underlay(): TemplateResult | undefined {
    return underlay(this);
  }

  /** Canvas size window with the picture's shape applied but not committed. */
  matchSize(): void {
    if (!this.ref) return;
    if (!this.size) this.openSize(this.shell.renderRoot.querySelector<HTMLElement>('#ref-btn') ?? undefined);
    const m = matchShape(this.ref, this.align.r, this.shell.doc.vb);
    this.setSize({ preset: 'custom', w: String(m.w), h: String(m.h), keep: true });
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
    this.shell.requestUpdate();
    if (this.size) this.focusShape();
    else this.landFocus();
  }

  /** The Canvas size window opens on the shape that is chosen, not on the first one. */
  private focusShape(): void {
    const sh = this.shell;
    void sh.updateComplete.then(() => setTimeout(() => sh.renderRoot.querySelector<HTMLElement>('mc-ui-window .tile[aria-checked="true"]')?.focus({ preventScroll: true }), 0));
  }

  /** After the next draw: focus goes to the canvas unless it is already somewhere inside the editor. */
  private landFocus(): void {
    const sh = this.shell;
    void sh.updateComplete.then(async () => {
      // the canvas element takes its focus stop (tabindex) in its own first render
      await (sh.canvas() as unknown as { updateComplete?: Promise<unknown> } | null)?.updateComplete;
      const inside = (): boolean => {
        try {
          return !!(sh.renderRoot as ShadowRoot).activeElement;
        } catch {
          // focus sits in a tree that is gone
          return false;
        }
      };
      if (sh.isConnected && !inside()) sh.canvas()?.focus({ preventScroll: true });
    });
  }

  /** A new shape as this editor draws it: a thin outline in the Accent colour so shapes stay apart on a card, and room for a shown reference picture to show through. */
  fresh(s: Shape): { shape: Shape; note?: string } {
    if (s.look || s.fill === 'none' || s.stroke !== 'none' || s.type === 'line') return { shape: s };
    const vb = this.shell.doc.vb;
    const out: Shape = { ...s, stroke: 'accent', width: Math.max(2, Math.round(Math.max(vb.w, vb.h) / 500)) };
    if (this.ref && this.shown) return { shape: withLook(out, { opacity: REF_OPACITY }), note: t('Opacity set to {pct} % so the reference picture shows through. Change it in Opacity.', { pct: REF_OPACITY }) };
    return { shape: out };
  }

  /** The canvas colours of Main and Accent while "As on a card" is on. */
  artColours(): string | undefined {
    return this.asCard ? '--m: var(--state-inactive-color, #9e9e9e); --a: var(--accent-color, #ff9800)' : undefined;
  }

  previewButton(): TemplateResult {
    return button({
      label: t('As on a card'),
      size: 'sm',
      variant: 'secondary',
      pressed: this.asCard,
      onClick: () => {
        this.asCard = !this.asCard;
        this.shell.say(this.asCard ? t('Showing the drawing as on a card, with the entity off.') : t('Showing the drawing in the editor colours.'));
        this.shell.requestUpdate();
      },
    });
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
    const name = plain(s.name);
    const on = s.stroke !== 'none' && s.width > 0;
    const words = s.look?.text;
    const box = words && K.shapeBox(s);
    return (
      ` id="${s.id}"${name ? ` data-name="${name}"` : ''}` +
      layerPaint(s, () => K.shapeBox(s), this.gradients, this.gradientId) +
      (words && box ? `${on ? ' stroke-linejoin="round"' : ''}${textAttrs(words, anchorOf(box, words))}` : '') +
      (!words && s.fill !== 'none' && s.rule === 'evenodd' ? ' fill-rule="evenodd"' : '') +
      (!words && on ? `${s.cap !== 'butt' ? ` stroke-linecap="${s.cap}"` : ''}${s.join !== 'miter' ? ` stroke-linejoin="${s.join}"` : ''}` : '')
    );
  }

  /** One layer's element: a path, or its words as <text> (nothing for an empty text). */
  private element(s: Shape, d: string): string {
    const words = s.look?.text;
    const box = words && K.shapeBox(s);
    if (!words || !box) return `<path d="${d}"${this.serialiseLayer(s)}/>`;
    return blank(words) ? '' : `<text${this.serialiseLayer(s)}>${textBody(words, anchorOf(box, words))}</text>`;
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
    const taken = new Set(doc.shapes.flatMap((s) => [s.id, ...(s.look?.part?.i ?? [])]));
    let n = 0;
    this.gradientId = () => {
      let id: string;
      do id = `grad${++n}`;
      while (taken.has(id));
      return id;
    };
    const body = K.toSvg(doc, decimals, (s, d) => (s.look?.part ? partOut(s, s.look.part) : this.element(s, d)));
    const defs = [...this.gradients, ...partDefs(doc.shapes)];
    const raw = defs.length ? body.replace(/^(<svg[^>]*>)/, `$1<defs>${defs.join('')}</defs>`) : body;
    if (!/<(?:path|text)/.test(raw) && !doc.shapes.some((s) => s.look?.part && !s.hidden)) return { bytes: 0, error: 'empty', points, viewBox: vb };
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
    return s.look?.part ? (k === 'fill' ? partColours() : html``) : paintRow(this, s, k);
  }

  more(s: Shape): TemplateResult {
    return s.look?.part ? html`` : lookRows(this, s);
  }

  handles(): TemplateResult | undefined {
    return html`${handles(this)}${textField(this)}`;
  }

  place(p?: Pt): void {
    place(this, p);
  }

  /** Why a layer's lock stays as it is (an imported part cannot be unlocked), else undefined. */
  lockNote(s: Shape): string | undefined {
    return s.look?.part ? t('{name} stays locked: imported parts cannot be edited.', { name: s.name }) : undefined;
  }

  get hint(): string {
    return t('Text tool. Click or tap where the text goes, or press Enter to start in the middle. Type, then press Enter or Done.');
  }

  railTool(): KitButtonOptions {
    const sh = this.shell;
    return {
      label: t('Text'),
      icon: 'mdi:format-text',
      iconOnly: true,
      keys: 'T',
      pressed: sh.tool === 'text',
      onClick: () => {
        sh.setTool('text');
        sh.say(this.hint);
      },
    };
  }

  node(s: Shape): TemplateResult | undefined {
    return partNode(this, s) ?? textNode(this, s);
  }

  text(s: Shape): TemplateResult | undefined {
    return partRows(s) ?? textRows(this, s);
  }

  addText(): void {
    addText(this);
  }

  addTextButton(): TemplateResult {
    return addTextButton(this);
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
    return K.toSvg(doc) + doc.shapes.map((s, i) => (s.look?.part ? JSON.stringify([i, s.id, s.name, s.group, s.hidden]) : s.look ? JSON.stringify(s.look) : '')).join('|');
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
    this.focusShape();
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
      this.restoreFocus();
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
    const bad = this.refusedText();
    if (bad) {
      sh.select([bad.id]);
      sh.note = { tone: 'error', lines: [bad.why] };
      sh.requestUpdate();
      return;
    }
    if (!this.id || !this.name) return this.openDetails('first');
    void this.write({ id: this.id, name: this.name, ...this.meta }, false);
  }

  /** The first layer whose words or name hold text the library refuses to store (it would refuse the whole image). */
  private refusedText(): { id: string; why: string } | undefined {
    for (const s of this.shell.doc.shapes) {
      const word = refusedWord(s.look?.text?.s ?? '') ?? refusedWord(s.name);
      if (word) return { id: s.id, why: t('The library does not accept the text "{word}", in the layer "{name}". Change it, then save again.', { word, name: s.name }) };
    }
    return undefined;
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
    this.details = { error: undefined, fault: undefined, ...this.details, ...patch };
    if (!('error' in patch)) this.details.error = undefined;
    if (!('fault' in patch)) this.details.fault = undefined;
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
      moved(this, was);
      this.updatedAt = sum.updated_at;
      this.meta = { keywords: meta.keywords, author: meta.author, description: meta.description };
      this.details = undefined;
      this.api.invalidate([sum.id]);
      if (sh.doc.name !== meta.name) sh.apply({ ...sh.doc, name: meta.name }, 'Rename image', 'name');
      sh.markSaved();
      sh.fire('mc-svg-save', { target: 'image-library', svg: built.input.svg, saved: built.input } satisfies SvgSaveDetail);
      if (copy && was) {
        sh.showToast(t("Saved as '{name}'. The original is unchanged.", { name: meta.name }) + this.refNote(), undefined, 8000);
        sh.say(t("Saved as '{name}'. The original is unchanged.", { name: meta.name }));
      } else {
        sh.showToast(t("Saved '{name}'.", { name: meta.name }) + this.refNote(), undefined, 6000);
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

  private refNote(): string {
    return this.ref ? ` ${t('The reference picture was not saved.')}` : '';
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
    const err = e instanceof ImageError ? e : undefined;
    const p = err?.problem ?? 'unreachable';
    return p === 'readonly'
      ? t('You can look at this image but not change it. Ask an administrator.')
      : p === 'conflict'
        ? t('This image was changed somewhere else.')
        : p === 'full'
          ? t('The library is full (200 images). Delete one to add another.')
          : p === 'too_large'
            ? t('Too big to save: {used} KiB of 256 KiB.', { used: kibShown(err?.bytes ?? this.shell.out.bytes) })
            : p === 'invalid'
              ? err?.word
                ? t('The library does not accept the text "{word}". Change it, then save again.', { word: err.word })
                : err?.detail
                  ? t('The library refused this image: {reason}', { reason: err.detail })
                  : t('The library refused this image. Use Export file to keep a copy.')
              : p === 'missing'
                ? t('Images need Magic Card Utils. It is installed through HACS, like Magic Card.')
                : p === 'failed'
                  ? t('Magic Card Utils reported an error and did not finish. Your work is safe. Use Export file to keep a copy.')
                  : t('Could not reach Magic Card Utils. Your work is safe.');
  }

  private fail(e: unknown): void {
    const sh = this.shell;
    if (e instanceof ImageError) {
      if (e.problem === 'conflict') {
        this.details = undefined;
        this.conflict = true;
        sh.say(t('This image was changed somewhere else.'));
        this.landFocus();
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
        this.landFocus();
      }
    }
    const why = this.problemText(e);
    if (this.details) this.setDetails({ fault: why });
    else sh.note = { tone: 'error', lines: [why] };
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
      { id: 'img:copy', label: t('Save as a copy…'), reason: sh.out.svg ? this.refusedText()?.why : t('Draw something first') },
      { id: 'img:duplicate', label: t('Duplicate…'), reason: need ?? (sh.dirty ? t('Save your changes first.') : undefined) },
      { id: 'img:import', label: t('Import an SVG file…') },
    ];
  }

  pick(id: string): void {
    if (id === 'copy') this.openDetails('copy');
    else if (id === 'duplicate') this.openDetails('duplicate');
    else if (id === 'import') this.shell.renderRoot.querySelector<HTMLInputElement>('#img-import')?.click();
  }

  close(): boolean {
    if (this.field) return cancelField(this), true;
    if (this.replacing) return this.cancelReplace(), true;
    if (this.imp) return this.closeImport(), true;
    if (this.refOpen) return closePanel(this), true;
    if (this.big) this.big = undefined;
    else if (this.details) return this.closeDetails(), true;
    else if (this.size) return this.closeSize(), true;
    else return false;
    this.shell.requestUpdate();
    return true;
  }

  dispose(): void {
    this.size = this.details = this.big = this.imp = this.replacing = undefined;
    disposeRef(this);
    disposeField(this);
  }

  topBar(): TemplateResult {
    return topBar(this);
  }

  viewer(): TemplateResult {
    return viewer(this);
  }

  dialogs(): TemplateResult | undefined {
    if (this.replacing) return replaceWin(this);
    if (this.imp) return importWin(this);
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
