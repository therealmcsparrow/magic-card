import { LitElement, type PropertyValues, type TemplateResult } from 'lit';
import type { History, PathCanvasChunk, PathChange, PathContext, PathPaint, PathSelection, PathTransform, TransformBox } from '../contracts/path-canvas';
import type { MenuEntry } from '../contracts/path-canvas';
import type { UiPopoverElement, UiToastElement, UiWindowElement } from '../contracts/ui-kit';
import type { SavedIcon } from '../contracts/mcu-library';
import type { MagicCardEditorWindowAdditions } from '../contracts/module-editor';
import type { TransferItem } from '../contracts/preset-transfer';
import { KEEP_COPY_DEFAULT_MAX_BYTES } from '../contracts/mcu-library';
import { MCU_PREVIEW_ACCENT, MCU_PREVIEW_MAIN, SVG_EDITOR_TAG, type SvgAlignEdge, type SvgAlignTarget, type SvgArrange, type SvgEditorHost, type SvgEditorModuleFacts, type SvgEditorSource, type SvgSaveDetail } from '../contracts/svg-editor';
import type { Anchor, Box, EditPath, PrimitiveKind, Pt } from '../contracts/path-model';
import { svgIconApi } from '../utils/svg-icon-loader';
import { SVG_MAX_BYTES, sanitizeSvg } from '../icons/svg-sanitize';
import { readFile, refuseText } from '../svg-io/intake';
import { ICON_SVG_INTAKE, ICON_SVG_MAX_FILE_BYTES, IMAGE_SVG_MAX_FILE_BYTES } from '../contracts/svg-intake';
import { loadPathBooleans } from '../path-booleans/loader';
import type { PathTool } from '../contracts/path-tools';
import type { BooleanOp } from '../contracts/path-booleans';
import { loadPathCanvas } from '../path-canvas/loader';
import { loadSvgCss } from '../svg-safety/css-loader';
import type { SvgCssResolve } from '../contracts/svg-safety';
import { alignMoves, centreMove, distributeMoves, fitBox, itemsOf, matchMove, safeBox, union, type Item, type Move } from './arrange';
import { boolNote, boolReason, boolState, operandsOf, withResult } from './combine';
import { bind, E } from './bind';
import { haForm, type HaForm } from './ha';
import { appendDoc, droppedTotal, fromGeometry, importSvg, type ImportNotes } from './import';
import { deleteIcon, freeId, getIcon, listIcons, LibraryError, saveIcon, slug, type Hass, type LibraryProblem } from './library';
import {
  blankDoc,
  boxMatrix,
  bytesOf,
  byId,
  duplicateShapes,
  flipMatrix,
  groupItems,
  isOff,
  pruneGroups,
  under,
  is24,
  mapShapes,
  arrangeOrder,
  moveShape,
  newShape,
  nameFor,
  outsideSafe,
  pointCount,
  removeShapes,
  retype,
  rotateMatrix,
  round2,
  setShapeBox,
  shapeBox,
  toSvg,
  transformShape,
  toneOf,
  ungroup,
  unionBox,
  boxOf,
  asPath,
  type Doc,
  type Group,
  type Paint,
  type Shape,
} from './model';
import { endDrag, stepOrder, groupBlocked, moveMenu, type DragState } from './layers';
import { PanelLips } from '../ui-kit/controllers/panel-lips';
import { ScrollbarWatch } from '../ui-kit/controllers/scrollbar-width';
import { lipSpecs, lipStrings } from './lips';
import { alignItems, combineItems, emptyMenu, pathItems, pointMenu, runMenu, shapeMenu, xferItems } from './menu';
import { cancel as ptCancel, later as ptLater, openTool, type PtState } from './pathtools';
import { editorStyles } from './styles';
import type { LocaleHassLike } from '../contracts/i18n';
import { setI18nLocale } from '../i18n/runtime';
import { locale, t } from './i18n';
import { svgErrorKind } from '../icons/svg-error';
import { PRIM, ARRANGE, BOOL_OPS, PT_NAME } from './names';
import { DRAW_TOOLS, Gestures, type Live, type StageHost, type Tool, type ToolOpts } from './tools';
import { renderEditor } from './views';
import { imageApi, loadImageEditor } from './image-loader';
import { imageKit } from './image-kit';
import type { ImageShell, ImageUi } from './image-seam';

/*
 * <mc-svg-editor> (contract svg-editor 1.0.0): the 24 x 24 icon editor. The document is a list of
 * layers; <mc-path-canvas> (path-canvas 1.0.0) is the editing surface for their anchors, and this element
 * is its host: it passes every subpath as one canvas path, draws the artwork underneath, and turns the
 * canvas's `mc-path-change` events back into layer edits. History keeps whole documents.
 */

export interface Flat {
  paths: EditPath[];
  map: Array<{ sid: string; sub: number }>;
  paint: PathPaint[];
}

export interface Out {
  svg?: string;
  bytes: number;
  error?: 'empty' | 'invalid' | 'over';
  message?: string;
  points: number;
  viewBox: string;
}

export interface Banner {
  id: string;
  kind: 'warn' | 'error' | 'info';
  text: string;
  detail?: string[];
  action?: { label: string; run: () => void };
}

export type Stage = 'loading' | 'fail' | 'start' | 'edit';
export type CanvasEl = HTMLElement & { fit(): void; view: { zoom: number; pan: Pt }; setView(z: number, p: Pt): void; focusAnchor(p: number, a: number): void; selection?: PathSelection };

const DEFAULT_OPTS: ToolOpts = { r: 0, sides: 5, inner: 0.5, star: false, prim: 'rounded-rect' };
/** What a frame of a move or resize gesture changes. */
const FRAME_KEYS = new Set(['doc', 'moving', 'view', 'cvSel', 'out', 'dirty']);
const FIELD_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

export class McSvgEditor extends LitElement implements StageHost {
  static styles = editorStyles;
  static properties = {
    hass: { attribute: false },
    source: { attribute: false },
    libraryAvailable: { type: Boolean },
    savedId: { attribute: false },
    module: { attribute: false },
    host: { type: String },
    ...Object.fromEntries(['stage', 'doc', 'sel', 'tool', 'cvSel', 'view', 'snapOn', 'pixelGrid', 'grid', 'safe', 'decimals', 'nudgePad', 'lockRatio', 'opts', 'panel', 'pvTheme', 'out', 'ha', 'banners', 'notes', 'dlg', 'leaving', 'live', 'dirty', 'layout', 'overlay', 'renaming', 'startMode', 'startIcon', 'startError', 'startBusy', 'liveShape', 'note', 'boolBusy', 'pt', 'ptBusy', 'alignTarget', 'picker', 'gridCustom', 'gridMsg', 'coarse', 'nudgeBig', 'lib', 'saved', 'keepCopy', 'saveName', 'saveError', 'saveBusy', 'deleted', 'escHinted', 'noticeGone', 'xfer', 'menu', 'conflict', 'pvMain', 'pvAccent', 'dual', 'pvOpen', 'startOpen', 'newAsk', 'cur', 'drag', 'tmsg', 'moving'].map((n) => [n, { state: true }])),
  };

  hass?: Hass;
  source: SvgEditorSource = { kind: 'blank' };
  libraryAvailable = true;
  savedId?: string;
  module?: SvgEditorModuleFacts;
  /** 'mcu' = hosted by the Magic Card Utils panel (no card, no module). */
  host: SvgEditorHost = 'card';
  /** The element revision the panel checks against SVG_EDITOR_MCU_MIN_REVISION. */
  static contractRevision = 7;
  /** Set when the editor was opened on an image source: everything image-only goes through it. */
  img?: ImageUi;
  /** Layers being dragged, moved by handles or nudged: they carry will-change until the gesture ends. */
  moving: ReadonlySet<string> = new Set();
  private movingTimer?: ReturnType<typeof setTimeout>;
  conflict = false;
  pvMain = MCU_PREVIEW_MAIN;
  pvAccent = MCU_PREVIEW_ACCENT;
  get mcu(): boolean {
    return this.host === 'mcu';
  }

  stage: Stage = 'loading';
  doc: Doc = blankDoc('');
  sel: string[] = [];
  tool: Tool = 'select';
  cvSel?: PathSelection;
  view = { zoom: 10, x: 0, y: 0 };
  snapOn = true;
  pixelGrid = true;
  grid = 1;
  /** Shape picker open (Shapes tool). */
  picker = false;
  /** Custom grid size chosen. */
  gridCustom = false;
  gridMsg?: { text: string; error: boolean };
  safe = true;
  decimals = 2;
  nudgePad = true;
  lockRatio = true;
  opts: ToolOpts = { ...DEFAULT_OPTS };
  panel: 'layers' | 'library' = 'layers';
  pvTheme: 'light' | 'dark' | 'on' | 'off' = 'light';
  out: Out = { bytes: 0, points: 0, viewBox: '0 0 24 24', error: 'empty' };
  ha?: HaForm;
  banners: Banner[] = [];
  notes?: ImportNotes;
  /** What Align is relative to. */
  alignTarget: SvgAlignTarget = 'selection';
  /** The status strip under the canvas. */
  note?: { tone: 'info' | 'warn' | 'error'; lines: string[]; action?: { label: string; run: () => void } };
  /** The boolean button waiting for the chunk. */
  boolBusy?: BooleanOp;
  /** The open path tool (panel and preview), the tool waiting for its chunks, and and where. */
  pt?: PtState;
  ptBusy?: PathTool;
  /** What the toast's action button does (the toast itself is the kit's <mc-ui-toast>). */
  private toastRun?: () => void;
  pvOpen = false;
  dlg: 'save' | 'help' | 'single' | 'poly' | undefined;
  /** Dual-tone switch (session state): on also whenever a layer paints Accent. */
  dual = false;
  /** The export / import panel (preset-transfer 1.0.0), loaded through window.MagicCard.loadTransfer(). */
  xfer?: { mode: 'import' | 'export'; items?: TransferItem[]; back?: HTMLElement };
  leaving = false;
  live = '';
  dirty = false;
  layout: 'wide' | 'mid' | 'compact' | 'stacked' = 'wide';
  overlay = false;
  renaming?: string;
  /** The tree row that holds the tab stop (`g:<id>` for a group). */
  cur?: string;
  /** A layer drag in progress, its target and whether it is allowed. */
  drag?: DragState;
  dragPend?: { id: string; x: number; y: number; cy: number; raf?: number };
  /** The tree's status line: why a move was refused. */
  tmsg = '';
  /** The element the tree scrolls in (the left panel). */
  listScroller = (): HTMLElement | null => {
    for (let n = this.renderRoot.querySelector<HTMLElement>('.tree'); n; n = n.parentElement) if (/auto|scroll/.test(getComputedStyle(n).overflowY)) return n;
    return null;
  };
  startMode?: 'icon' | 'paste' | 'canvas-size';
  /** What is typed in the icon name field of the start window; empty until the user types. */
  startIcon = '';
  /** The start dialog is open (over a blank editor first, or from New). */
  startOpen = false;
  /** New was pressed with unsaved changes: the Start over question is showing. */
  newAsk = false;
  private startReturn?: HTMLElement;
  startError?: string;
  /** The file being read for the start window. */
  startBusy?: string;
  /** The id of the control that began the last start action (a refusal puts the focus back there). */
  startAt = '';
  /** The shell opened the start window itself (a first open), not the user. */
  private startAuto = false;
  /** Counts start actions: an answer that finds another number was meant for a window that has moved on. */
  private seq = 0;
  private readTimer?: ReturnType<typeof setTimeout>;
  liveShape?: Live;
  coarse = false;
  nudgeBig = false;
  // library
  lib: { state: 'idle' | 'loading' | 'ready' | LibraryProblem; items: Array<{ id: string; name: string; updated_at: string; svg?: string }>; q: string } = { state: 'idle', items: [], q: '' };
  saved?: { item: SavedIcon; svg: string };
  keepCopy = true;
  saveName = '';
  saveError = '';
  saveBusy = false;
  deleted?: { item: SavedIcon; timer: ReturnType<typeof setTimeout> };
  escHinted = false;
  noticeGone = false;

  /** The open "Shape actions" menu. */
  menu?: { items: MenuEntry[]; at: Pt; touch: boolean; opener: HTMLElement; key?: 'xfer' | 'align' | 'combine' | 'path' };
  private press?: { x: number; y: number; t: ReturnType<typeof setTimeout> };
  private menuAt = 0;
  private tk = '';
  private tv?: TransformBox;

  /** Panel lips: hide and show the side panel and the inspector, remembered per device; Ctrl/Cmd + backslash toggles the column panels. */
  readonly lips = new PanelLips(this, { editor: 'svg-editor', panels: lipSpecs(), strings: lipStrings('en') });
  private lipLocale = 'en';
  /** Width of the scrollbar of the side panel, whose inner edge carries its lip. */
  readonly bar = new ScrollbarWatch(this);
  private barSig = '';

  hist?: History<Doc>;
  chunk?: PathCanvasChunk;
  base: Doc = blankDoc();
  flat: Flat = { paths: [], map: [], paint: [] };
  flatBase: Flat = { paths: [], map: [], paint: [] };
  space = false;
  gestures = new Gestures(this);
  private baseline = '';
  private started = false;
  /** The CSS paint resolver, loaded in start() before any text the user brings in is read; undefined when it did not load. */
  private css?: SvgCssResolve;
  private opener?: { el: HTMLElement; key?: string; root: Node };
  private dialogs: Array<[HTMLDialogElement, EventListener]> = [];
  private ro?: ResizeObserver;
  private shift = false;
  private penHold = false;
  private raf = 0;
  private outTimer?: ReturnType<typeof setTimeout>;
  private liveTimer?: ReturnType<typeof setTimeout>;

  // ── lifecycle ──

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('data-mc-svg-editor', '');
    const active = deepActive();
    if (active) this.opener = { el: active, key: active.getAttribute('data-focus-key') ?? undefined, root: active.getRootNode() };
    // Escape never reaches Home Assistant's card dialog (shell rules 2): every ancestor <dialog> ignores its cancel while open
    for (let n: Node | null = this.parentNode; n; n = n.parentNode ?? (n as ShadowRoot).host ?? null) {
      if (n instanceof HTMLDialogElement) {
        const f: EventListener = (e) => e.preventDefault();
        n.addEventListener('cancel', f);
        this.dialogs.push([n, f]);
      }
    }
    if (this.hass) setI18nLocale(this.hass as LocaleHassLike);
    this.coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
    if (typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => this.measure());
      this.ro.observe(this);
    }
    if (!this.started) {
      this.started = true;
      void this.start();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.ro?.disconnect();
    for (const [d, f] of this.dialogs) d.removeEventListener('cancel', f);
    this.dialogs = [];
    cancelAnimationFrame(this.raf);
    for (const t of [this.outTimer, this.liveTimer, this.movingTimer, this.readTimer]) clearTimeout(t);
    this.img?.dispose();
    if (this.deleted) void this.flushDelete();
    const o = this.opener;
    if (o) {
      const el = o.el.isConnected ? o.el : o.key ? (o.root as ParentNode).querySelector?.<HTMLElement>(`[data-focus-key="${o.key}"]`) : null;
      setTimeout(() => el?.focus?.(), 0);
    }
  }

  private measure(): void {
    const w = this.getBoundingClientRect().width;
    if (!w) return;
    this.layout = w > 1180 ? 'wide' : w > 900 ? 'mid' : w > 640 ? 'compact' : 'stacked';
    if (this.layout === 'wide' || this.layout === 'mid') this.overlay = false;
  }

  // ── loading and sources ──

  async start(): Promise<void> {
    this.stage = 'loading';
    const src = this.source;
    const imageLoad = src.kind === 'image' || src.kind === 'image-blank' || src.kind === 'image-svg' ? loadImageEditor() : undefined;
    // the resolver is for the SVG text a user brings in: loaded here only for markup the editor starts from, otherwise when a file or pasted text is opened
    const [chunk] = await Promise.all([loadPathCanvas(), src.kind === 'svg' ? this.needCss() : undefined]);
    if (!chunk) {
      this.stage = 'fail';
      return;
    }
    bind(chunk);
    this.chunk = chunk;
    this.measure();
    if (imageLoad) return this.startImage(await imageLoad);
    if (src.kind === 'svg') this.openSvg(src.svg, t('My icon'), true);
    else if (src.kind === 'icon') await this.openIcon(src.icon, true);
    else if (src.kind === 'library') await this.openLibrary(src.id);
    else this.showStart();
    if (this.stage === 'loading') this.showStart();
    if (this.savedId && this.libraryAvailable) void this.loadLib();
  }

  /** An image source: the image-editor chunk makes the first document and the shell begins on it. */
  private async startImage(create: Awaited<ReturnType<typeof loadImageEditor>>): Promise<void> {
    const api = imageApi();
    this.img?.dispose();
    this.img = undefined;
    if (!create || !api) {
      this.stage = 'fail';
      return;
    }
    const img = create(this as unknown as ImageShell, api, imageKit);
    this.img = img;
    const root = this.renderRoot as ShadowRoot;
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, ...img.styles.flatMap((s) => s.styleSheet ?? [])];
    const doc = await img.open(this.source);
    if (!doc) {
      this.stage = 'fail';
      return;
    }
    this.begin(doc);
    if (img.asks) this.showStart();
    else img.ready();
  }

  /** First open without a start: a blank editor with the start dialog over it. */
  showStart(): void {
    if (!this.hist) this.begin(this.blankStart());
    this.startAuto = true;
    this.armStart();
  }

  private armStart(): void {
    this.seq++;
    if (this.img) {
      this.startMode = 'canvas-size';
      this.img.reset();
    }
    this.startOpen = true;
  }

  openStart(opener: HTMLElement, asked = false): void {
    this.startReturn = opener;
    if (this.dirty && !asked) {
      this.newAsk = true;
      return;
    }
    this.startError = undefined;
    this.startMode = undefined;
    this.startBusy = undefined;
    this.startAuto = false;
    this.armStart();
  }

  closeNew(): void {
    this.newAsk = false;
    const back = this.startReturn;
    this.startReturn = undefined;
    void this.updateComplete.then(() => (back?.isConnected ? back : this.canvas())?.focus({ preventScroll: true }));
  }

  confirmNew(): void {
    this.newAsk = false;
    this.openStart(this.startReturn!, true);
  }

  closeStart(): void {
    this.seq++;
    this.startOpen = false;
    this.startError = undefined;
    this.startMode = undefined;
    this.startBusy = undefined;
    if (this.img?.asks) return this.fire('mc-svg-close', { dirty: false });
    const back = this.startReturn;
    this.startReturn = undefined;
    void this.updateComplete.then(() => (back?.isConnected ? back : this.canvas())?.focus({ preventScroll: true }));
  }

  /** Begin editing `doc` (history, baseline, banners). */
  begin(doc: Doc, notes?: ImportNotes): void {
    this.hist = this.chunk?.createHistory(doc);
    this.note = undefined;
    this.base = doc;
    this.setDoc(doc);
    this.baseline = this.stamp(doc);
    this.sel = [];
    this.dual = false;
    this.cvSel = undefined;
    this.tool = 'select';
    this.stage = 'edit';
    this.startOpen = false;
    this.banners = [];
    this.notes = notes;
    if (notes) this.noteBanners(notes);
    this.refresh();
    this.updateComplete.then(() => this.canvas()?.fit());
  }

  /**
   * A start entry gave a drawing. The first drawing begins the editor; later the new drawing replaces the old one as one
   * history step (Undo brings it back) and keeps its name.
   */
  take(doc: Doc, notes?: ImportNotes): void {
    this.seq++;
    const auto = this.startAuto;
    if (auto || !this.hist) this.begin(doc, notes);
    else {
      this.apply({ ...doc, name: this.doc.name }, 'Start from');
      this.select([]);
      this.notes = notes;
      if (notes) this.noteBanners(notes);
      else this.banners = [];
      void this.updateComplete.then(() => this.canvas()?.fit());
    }
    this.startOpen = false;
    this.startAuto = false;
    this.startError = undefined;
    this.startMode = undefined;
    this.startBusy = undefined;
    this.img?.ready();
    if (auto) this.say(t('Drawing opened.'));
    const back = this.startReturn;
    this.startReturn = undefined;
    void this.updateComplete.then(() => (back?.isConnected ? back : this.canvas())?.focus({ preventScroll: true }));
  }

  /** A sanitiser or importer reason as text in the user's language. */
  errorText(error: string | undefined): string {
    switch (svgErrorKind(error)) {
      case 'size':
        return t('The SVG is larger than 32 KB.');
      case 'not-svg':
        return t('This is not valid SVG. Check that it starts with <svg and is closed.');
      case 'complex':
        return t('The SVG is too complex.');
      default:
        return t('That file has no shapes an icon can use.');
    }
  }

  private cssLoad?: Promise<void>;

  /** Loads the CSS resolver once; every caller awaits the same load. It stays undefined when the chunk does not load. */
  private needCss(): Promise<void> {
    return (this.cssLoad ??= loadSvgCss().then((c) => {
      this.css = c;
    }));
  }

  /** Opens SVG text a user brought in (a pasted text or a chosen file), after the CSS resolver has loaded. A start action that was answered another way meanwhile (`seq`) is dropped. */
  async importText(text: string, name: string, seq?: number): Promise<boolean> {
    await this.needCss();
    return seq === undefined || seq === this.seq ? this.openSvg(text, name) : false;
  }

  /** `stored`: the text is a saved library icon (already clean), so it is read without the CSS resolver. */
  openSvg(text: string, name: string, first = false, stored = false): boolean {
    const r = importSvg(text, name, stored ? undefined : this.css);
    if (r.error || !r.doc) {
      this.startError = this.errorText(r.error);
      this.startMode = this.startMode ?? 'paste';
      if (first) this.showStart();
      return false;
    }
    this.startError = undefined;
    if (first) {
      this.begin(r.doc);
      this.notes = r.notes;
    } else this.take(r.doc, r.notes);
    return true;
  }

  /** A start action that was answered another way while the icon resolved (`seq`) is dropped. */
  async openIcon(ref: string, first = false): Promise<boolean> {
    const n = first ? this.seq : ++this.seq;
    if (!first) {
      this.startBusy = undefined;
      clearTimeout(this.readTimer);
    }
    const g = await svgIconApi()!.resolveIconGeometry(ref.trim());
    if (n !== this.seq) return false;
    if (!g) {
      this.startError = t('Could not find "{name}". Check the name, or wait for the icon packs to load.', { name: ref.trim() });
      this.startMode = 'icon';
      if (first) this.showStart();
      return false;
    }
    const name = ref.includes(':') ? ref.split(':')[1].replace(/[-_]/g, ' ') : ref;
    this.startError = undefined;
    this.take(fromGeometry(g, t('{name} copy', { name })));
    return true;
  }

  async openLibrary(id: string): Promise<void> {
    try {
      const item = await getIcon(this.hass, id);
      if (item && this.openSvg(item.svg, item.name, true, true)) {
        this.saved = { item, svg: this.out.svg ?? '' };
        return;
      }
    } catch {
      /* the start panel shows the library state */
    }
    this.showStart();
    this.panel = 'library';
  }

  noteBanners(n: ImportNotes): void {
    const out: Banner[] = [];
    const d = n.dropped;
    if (droppedTotal(d)) {
      const parts = [d.script && t('{c, plural, one {# script} other {# scripts}}', { c: d.script }), d.image && t('{c, plural, one {# image} other {# images}}', { c: d.image }), d.link && t('{c, plural, one {# external link} other {# external links}}', { c: d.link }), d.other && t('{c, plural, one {# other item} other {# other items}}', { c: d.other })].filter(Boolean) as string[];
      out.push({ id: 'dropped', kind: 'warn', text: `${t('Removed {c, plural, one {# thing} other {# things}} icons cannot use', { c: droppedTotal(d) })}: ${parts.join(', ')}. ${t('Everything else was kept.')}`, detail: parts });
    }
    const change = [n.transforms && t('Transforms were applied to the paths. The drawing looks the same, the markup is different.'), n.colours && t('Colours were replaced by the card\'s colours: Main and Accent.'), n.opacity && t('Opacity is not kept. Icons are one solid colour.'), n.merged && t('Groups deeper than 4 levels were merged.')].filter(Boolean) as string[];
    if (change.length) out.push({ id: 'changed', kind: 'info', text: change.join(' ') });
    this.banners = out;
  }

  // ── canvas bridge ──

  private cv?: CanvasEl;

  canvas(): CanvasEl | null {
    if (!this.cv?.isConnected) this.cv = this.renderRoot?.querySelector<CanvasEl>('mc-path-canvas') ?? undefined;
    return this.cv ?? null;
  }

  /** The document as canvas paths: one per subpath, the layer it belongs to, and how the canvas treats each. */
  makeFlat(doc: Doc): Flat {
    const paths: EditPath[] = [];
    const map: Flat['map'] = [];
    const paint: PathPaint[] = [];
    const pick = this.tool === 'select' || this.tool === 'node' || this.tool === 'pen';
    for (const s of doc.shapes) {
      s.paths.forEach((p, sub) => {
        paths.push(p);
        map.push({ sid: s.id, sub });
        paint.push({ fill: s.fill === 'none' ? 'none' : 'transparent', stroke: 'none', hidden: isOff(doc, s, 'hidden'), locked: !pick || isOff(doc, s, 'locked') });
      });
    }
    return { paths, map, paint };
  }

  /** A drag or handle gesture is moving the document: the layers list keeps what it shows until the gesture ends. */
  private hot = false;
  private thaw = false;
  /** Changes whenever the layers list has to show the document again. */
  listKey: object = {};

  /** `live`: a frame of a gesture that only moves or resizes layers; the commit that ends it (or any other edit) passes false. */
  setDoc(doc: Doc, live = false): void {
    if (this.hot && !live) this.thaw = true;
    this.hot = live;
    this.doc = doc;
    this.flat = this.makeFlat(doc);
    if (this.thaw) this.requestUpdate();
  }

  /** The canvas gets its paths, and a blank trailing path while the pen waits to start a new one. */
  get cvPaths(): EditPath[] {
    return this.penHold ? [...this.flat.paths, { anchors: [], closed: false }] : this.flat.paths;
  }

  get cvSelection(): PathSelection | undefined {
    if (this.tool === 'pen' && this.penHold) return { path: this.flat.paths.length, anchors: [] };
    if (this.tool === 'node' || this.tool === 'pen') {
      if (this.cvSel && this.flat.map[this.cvSel.path]) return this.cvSel;
    }
    const sid = this.sel[this.sel.length - 1];
    const i = sid ? this.flat.map.findIndex((m) => m.sid === sid) : -1;
    return i >= 0 ? { path: i, anchors: [] } : undefined;
  }

  get canvasMode(): 'select' | 'nodes' | 'add' {
    return this.tool === 'node' ? 'nodes' : this.tool === 'pen' ? 'add' : 'select';
  }

  /** Does the pen start a new path? Yes unless the selected shape ends in an open path. */
  syncPen(): void {
    if (this.tool !== 'pen') {
      this.penHold = false;
      return;
    }
    const s = this.sel.length === 1 ? byId(this.doc, this.sel[0]) : undefined;
    const last = s?.paths[s.paths.length - 1];
    this.penHold = !(last && !last.closed && last.anchors.length > 0 && !s?.locked);
  }

  /** Mark layers as moving (will-change) until `ms` pass without another call, or until the gesture ends. */
  private setMoving(ids: readonly string[], ms = 0): void {
    if (!this.img) return;
    clearTimeout(this.movingTimer);
    if (ids.length !== this.moving.size || ids.some((i) => !this.moving.has(i))) this.moving = new Set(ids);
    if (ms) this.movingTimer = setTimeout(() => this.endMoving(), ms);
  }

  private endMoving(): void {
    clearTimeout(this.movingTimer);
    if (this.moving.size) this.moving = new Set();
  }

  onChange = (e: Event): void => {
    const { paths, commit, label } = (e as CustomEvent<PathChange>).detail;
    const doc = this.reconcile(paths);
    if (!doc) return;
    if (!commit) this.setMoving(this.sel);
    this.setDoc(doc, !commit);
    this.syncPen();
    if (commit) this.commit(label);
  };

  onSelect = (e: Event): void => {
    const d = (e as CustomEvent<PathSelection | undefined>).detail;
    if (!d) {
      // Esc in the pen ends the path; the point tools keep their layer
      if (this.tool === 'select' || this.tool === 'pen') this.select([]);
      else this.cvSel = undefined;
      return;
    }
    const m = this.flat.map[d.path];
    if (!m) {
      this.cvSel = d;
      return;
    }
    if (this.tool === 'select') this.sel = this.shift ? (this.sel.includes(m.sid) ? this.sel.filter((x) => x !== m.sid) : [...this.sel, m.sid]) : [m.sid];
    else this.sel = [m.sid];
    this.cvSel = this.tool === 'select' ? undefined : d;
    this.syncPen();
    this.say(m ? t('{name} selected.', { name: byId(this.doc, m.sid)?.name ?? '' }) : '');
  };

  onView = (e: Event): void => {
    const d = (e as CustomEvent<{ zoom: number; pan: Pt }>).detail;
    this.view = { zoom: d.zoom, x: d.pan[0], y: d.pan[1] };
  };

  onLimit = (): void => this.checks();

  onFields = (e: Event): void => {
    const d = (e as CustomEvent<{ path: number; anchor: number }>).detail;
    void d;
    this.updateComplete.then(() => (this.renderRoot.querySelector<HTMLInputElement>('[data-field="pxb"]') ?? this.renderRoot.querySelector<HTMLInputElement>('[data-field="px"]'))?.focus());
  };

  /** The selection box the canvas draws with handles (Select tool, unlocked visible layers). */
  get transformBox(): TransformBox | undefined {
    const sel = this.tool === 'select' ? this.selected.filter((s) => !isOff(this.doc, s, 'locked') && !isOff(this.doc, s, 'hidden')) : [];
    const box = boxOf(sel);
    const t = box && { box, scale: true, rotate: true, keepRatio: this.lockRatio, angle: sel.length === 1 ? sel[0].angle ?? 0 : 0 };
    const k = JSON.stringify(t);
    if (k !== this.tk) [this.tk, this.tv] = [k, t || undefined];
    return this.tv;
  }

  /** A scale or rotate from the handles or keys: the matrix applies to the document at gesture start. */
  onTransform = (e: Event): void => {
    const d = (e as CustomEvent<PathTransform>).detail;
    if (d.label === 'Cancel') return this.endMoving(), this.setDoc(this.base);
    if (!d.commit) this.setMoving(this.sel);
    const sel = this.selected.filter((s) => !isOff(this.doc, s, 'locked') && !isOff(this.doc, s, 'hidden'));
    const from = boxOf(this.base.shapes.filter((s) => sel.some((x) => x.id === s.id)));
    if (!from) return;
    const m = d.matrix;
    const to: Box = { x: m[0] * from.x + m[4], y: m[3] * from.y + m[5], w: m[0] * from.w, h: m[3] * from.h };
    const rot = d.kind === 'rotate';
    this.setDoc(mapShapes(this.base, sel.map((s) => s.id), (s) => (rot ? { ...transformShape(s, m), angle: round2(((s.angle ?? 0) + (d.angle ?? 0)) % 360) } : setShapeBox(s, from, to))), !d.commit);
    if (d.commit) this.commit(d.label, d.source === 'keyboard' ? d.label : undefined);
  };

  // ── Shape actions menu ──

  onContext = (e: Event): void => {
    const d = (e as CustomEvent<PathContext>).detail;
    const sid = d.hit ? this.flat.map[d.hit.path]?.sid : undefined;
    if (sid && !this.sel.includes(sid) && this.tool === 'select') this.select([sid]);
    const on = d.hit || d.source === 'keyboard';
    const items = d.hit?.anchor !== undefined && this.pointCtx ? pointMenu(this) : on && this.sel.length ? shapeMenu(this) : emptyMenu();
    this.menu = { items, at: d.client, touch: d.source === 'touch', opener: this.canvas()! };
  };

  /** The layer "Move to…" entries, opened from the Layers panel button. */
  moveMenuOpen(b: HTMLElement): void {
    const items = moveMenu(this)?.items;
    if (!items) return;
    const r = b.getBoundingClientRect();
    this.menu = { items, at: [r.left, r.bottom], touch: false, opener: b };
  }

  xferMenu(b: HTMLElement): void {
    const r = b.getBoundingClientRect();
    this.menu = { items: xferItems(this), at: [r.left, r.bottom], touch: false, opener: b, key: 'xfer' };
  }

  /** A canvas toolbar menu: Align, Combine or Path. */
  toolMenu(key: 'align' | 'combine' | 'path', b: HTMLElement): void {
    const r = b.getBoundingClientRect();
    this.menu = { items: key === 'align' ? alignItems(this, true) : key === 'combine' ? combineItems(this) : pathItems(this), at: [r.left, r.bottom], touch: false, opener: b, key };
  }

  /** A layer row opens the menu; the row's shape is selected first unless it is in the selection already. */
  openRowMenu(id: string, row: HTMLElement, at: Pt, touch: boolean): void {
    const ids = id.startsWith('g:') ? under(this.doc, id.slice(2)).map((s) => s.id) : [id];
    if (!ids.every((i) => this.sel.includes(i))) this.select(ids);
    this.cur = id;
    this.menuAt = Date.now();
    this.menu = { items: shapeMenu(this), at, touch, opener: row };
  }

  rowContext(e: MouseEvent, id: string): void {
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    e.preventDefault();
    if (Date.now() - this.menuAt > 500) this.openRowMenu(id, e.currentTarget as HTMLElement, [e.clientX, e.clientY], false);
  }

  pressDown(e: PointerEvent, id: string): void {
    this.pressEnd();
    if (e.pointerType !== 'touch') return;
    const row = e.currentTarget as HTMLElement;
    const [x, y] = [e.clientX, e.clientY];
    this.press = { x, y, t: setTimeout(() => (this.press = undefined, this.openRowMenu(id, row, [x, y], true)), 500) };
  }

  pressMove = (e: PointerEvent): void => {
    if (this.press && Math.hypot(e.clientX - this.press.x, e.clientY - this.press.y) > 8) this.pressEnd();
  };

  pressEnd = (): void => {
    if (this.press) clearTimeout(this.press.t);
    this.press = undefined;
  };

  onPick = (e: Event): void => {
    const row = this.menu?.opener;
    this.menu = undefined;
    const id = (e as CustomEvent<{ id: string }>).detail.id;
    if (this.img && id.startsWith('img:')) return this.img.pick(id.slice(4));
    runMenu(this, id, row);
    if (id.startsWith('x:')) return;
    this.updateComplete.then(() => (row?.isConnected && (row.classList.contains('row') || row.tagName === 'BUTTON') ? row : this.canvas())?.focus({ preventScroll: true }));
  };

  onMenuClose = (): void => {
    this.menu = undefined;
  };

  /** Turn the canvas's path list into an edit of the committed document. */
  reconcile(list: EditPath[]): Doc | undefined {
    const fb = this.flatBase;
    const old = fb.paths;
    let next = list;
    while (next.length > old.length && next[next.length - 1].anchors.length === 0) next = next.slice(0, -1);
    let doc = this.base;
    if (next.length < old.length) {
      const gone = new Set(old.map((_, i) => i).filter((i) => !next.includes(old[i])));
      const shapes = doc.shapes
        .map((s) => {
          const keep = s.paths.filter((_, sub) => !gone.has(fb.map.findIndex((m) => m.sid === s.id && m.sub === sub)));
          return keep.length === s.paths.length ? s : keep.length ? asPath({ ...s, paths: keep }) : undefined;
        })
        .filter((s): s is Shape => !!s);
      doc = pruneGroups({ ...doc, shapes });
      this.sel = this.sel.filter((id) => shapes.some((s) => s.id === id));
    } else {
      const changed = old.map((_, i) => i).filter((i) => next[i] !== old[i]);
      if (changed.length) {
        if (this.tool === 'select') {
          const i = changed[0];
          const a = old[i].anchors[0];
          const b = next[i].anchors[0];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const sid = fb.map[i].sid;
          const ids = (this.sel.includes(sid) ? this.sel : [sid]).filter((id) => { const x = byId(doc, id); return !x || !isOff(doc, x, 'locked'); });
          doc = mapShapes(doc, ids, (s) => moveShape(s, dx, dy));
        } else {
          for (const i of changed) {
            const m = fb.map[i];
            const s = byId(doc, m.sid);
            if (!s) continue;
            const paths = s.paths.slice();
            paths[m.sub] = next[i];
            let n: Shape = asPath({ ...s, paths, angle: undefined });
            if (s.auto && next[i].closed && !old[i].closed) n = { ...n, fill: 'main', stroke: 'none', auto: false };
            doc = { ...doc, shapes: doc.shapes.map((x) => (x.id === s.id ? n : x)) };
          }
        }
      }
      for (let i = old.length; i < next.length; i++) {
        if (!next[i].anchors.length) continue;
        const s = newShape('path', [next[i]], { name: nameFor(doc, 'path'), fill: next[i].closed ? 'main' : 'none', stroke: next[i].closed ? 'none' : 'main', auto: true });
        doc = { ...doc, shapes: [...doc.shapes, s] };
        this.sel = [s.id];
      }
    }
    return doc;
  }

  // ── history ──

  /** Make the live document the new committed one: one history step. */
  commit(label: string, merge?: string): void {
    this.endMoving();
    this.note = undefined;
    this.base = this.doc;
    this.flatBase = this.flat;
    this.hist?.push(this.doc, label, merge);
    this.refresh();
  }

  /** An edit that is finished in one go (a button, a field, a tool). */
  apply(doc: Doc, label: string, merge?: string): void {
    if (this.img?.readOnly) return;
    this.setDoc(doc);
    this.syncPen();
    this.commit(label, merge);
    // a short window (a phone, or 200 % zoom) cannot spare the module notice once the user has started drawing
    if (this.module && (this.layout === 'compact' || this.layout === 'stacked')) this.noticeGone = true;
  }

  undo(): void {
    this.step(this.hist?.undo(), t('Undo'));
  }

  redo(): void {
    this.step(this.hist?.redo(), t('Redo'));
  }

  private step(d: Doc | undefined, label: string): void {
    if (!d) return;
    this.gestures.reset();
    this.note = undefined;
    this.setDoc(d);
    this.base = d;
    this.flatBase = this.flat;
    this.sel = this.sel.filter((id) => byId(d, id));
    this.syncPen();
    this.refresh();
    this.say(label);
  }

  /** What "changed since saved" compares: the drawing, with an image's paints. */
  private stamp(d: Doc): string {
    return this.img ? this.img.stamp(d) : toSvg(d);
  }

  /** Output, meter and Home Assistant form of the committed document. */
  refresh(): void {
    this.flatBase = this.makeFlat(this.base);
    this.out = this.buildOut(this.base);
    this.dirty = this.stamp(this.base) !== this.baseline;
    if (this.img) {
      this.img.changed(this.out);
      this.checks();
      return;
    }
    clearTimeout(this.outTimer);
    this.outTimer = setTimeout(() => {
      this.ha = this.doc.shapes.length ? haForm(this.base) : undefined;
      this.checks();
    }, 120);
    this.checks();
  }

  /** Banners that follow the document: size, points over the cap, outside the safe area. */
  checks(): void {
    const keep = this.banners.filter((b) => !['over', 'safe', 'limit'].includes(b.id));
    const add: Banner[] = [];
    const o = this.out;
    if (o.error === 'over' && !this.img) add.push({ id: 'over', kind: 'error', text: t('This icon is {used} KB and the limit is 32 KB. Tidy it, remove hidden layers, or simplify paths.', { used: kbOf(o.bytes) }), action: { label: t('Tidy now'), run: () => this.tidyNow() } });
    const most = Math.max(0, ...this.base.shapes.flatMap((x) => x.paths.map((q) => q.anchors.length)));
    if (most >= 100) add.push({ id: 'limit', kind: 'info', text: t('This icon has {c} points. You can edit and move them, but not add points until it has fewer than 100.', { c: most }) });
    const out = outsideSafe(this.base);
    if (out.length && this.safe && !this.img) add.push({ id: 'safe', kind: 'warn', text: t('{c, plural, one {# layer reaches} other {# layers reach}} outside the 20 x 20 safe area. Home Assistant may clip the edges.', { c: out.length }), action: { label: t('Fit to 20'), run: () => this.fitSafe() } });
    this.banners = [...keep, ...add];
  }

  buildOut(doc: Doc): Out {
    if (this.img) return this.img.buildOut(doc, this.decimals);
    const points = pointCount(doc);
    const raw = toSvg(doc, this.decimals);
    const vb = `${doc.vb.x} ${doc.vb.y} ${doc.vb.w} ${doc.vb.h}`;
    if (!/<path/.test(raw)) return { bytes: 0, error: 'empty', points, viewBox: vb };
    const rawBytes = bytesOf(raw);
    if (rawBytes > SVG_MAX_BYTES) return { bytes: rawBytes, error: 'over', points, viewBox: vb };
    const s = sanitizeSvg(raw);
    if (s.error) return { bytes: rawBytes, error: 'invalid', message: s.error, points, viewBox: vb };
    const bytes = bytesOf(s.markup);
    return { svg: s.markup, bytes, error: bytes > SVG_MAX_BYTES ? 'over' : undefined, points, viewBox: s.viewBox };
  }

  // ── document operations ──

  get selected(): Shape[] {
    return this.sel.map((id) => byId(this.doc, id)).filter((s): s is Shape => !!s);
  }

  select(ids: string[]): void {
    this.note = undefined;
    this.sel = ids;
    this.cvSel = undefined;
    this.syncPen();
  }

  /** Close the shape picker and put focus on the canvas, so the crosshair is ready. */
  closePicker(): void {
    this.picker = false;
    this.updateComplete.then(() => this.canvas()?.focus({ preventScroll: true }));
  }

  /** The arrow keys in the picker pick a kind and keep it open. */
  pickPrim(k: PrimitiveKind): void {
    this.opts = { ...this.opts, prim: k };
    this.say(t(PRIM[k]));
  }

  choosePrim(k: PrimitiveKind): void {
    this.pickPrim(k);
    this.closePicker();
  }

  /** A chip of the grid size group. */
  setGrid(v: number): void {
    this.grid = v;
    this.gridCustom = false;
    this.gridMsg = undefined;
  }

  /** The custom size field: valid values apply at once, others stay as typed with a reason. */
  typeGrid(raw: string, final: boolean): void {
    const n = parseFloat(raw);
    const g = this.img?.grid;
    const [lo, hi, chips] = g ? [g.min, g.max, g.chips] : [GRID_MIN, GRID_MAX, GRID_CHIPS];
    const ok = Number.isFinite(n) && n >= lo && n <= hi;
    if (ok) {
      this.grid = n;
      this.gridMsg = undefined;
      if (final && chips.includes(n)) this.gridCustom = false;
    } else if (final && Number.isFinite(n)) {
      this.grid = Math.min(hi, Math.max(lo, n));
      this.gridMsg = { text: t('Grid size set to {size}, the nearest allowed size.', { size: this.grid }), error: false };
    } else this.gridMsg = { text: t('Use {min} to {max}.', { min: lo.toLocaleString(locale()), max: hi.toLocaleString(locale()) }), error: true };
  }

  /** The polygon window's way back: the options and the tool as they were when it opened. */
  private polyBack?: { opts: ToolOpts; tool: Tool };

  /** The Polygon tool asks for its corner count in a window (never in a row that would resize the canvas). */
  private askPolygon(from: Tool): void {
    this.polyBack = { opts: this.opts, tool: from };
    this.dlg = 'poly';
  }

  polyOk(): void {
    this.polyBack = undefined;
    this.dlg = undefined;
    void this.updateComplete.then(() => this.canvas()?.focus({ preventScroll: true }));
  }

  polyCancel(): void {
    if (this.dlg !== 'poly') return;
    const b = this.polyBack;
    this.polyBack = undefined;
    this.dlg = undefined;
    if (b) {
      this.opts = b.opts;
      if (b.tool !== this.tool) this.setTool(b.tool);
      else void this.updateComplete.then(() => this.canvas()?.focus({ preventScroll: true }));
    }
  }

  setTool(t: Tool): void {
    if (t === 'shapes') this.picker = true;
    else this.picker = false;
    if (this.tool === t) {
      if (t === 'polygon' && !this.dlg) this.askPolygon(t);
      return;
    }
    const from = this.tool;
    this.gestures.reset();
    this.tool = t;
    if (t === 'polygon') this.askPolygon(from);
    this.cvSel = undefined;
    this.doc = { ...this.doc };
    if (t === 'node' && !this.sel.length && this.doc.shapes.length) this.sel = [this.doc.shapes[this.doc.shapes.length - 1].id];
    this.flat = this.makeFlat(this.doc);
    this.syncPen();
    this.say(toolName(t));
    this.updateComplete.then(() => this.canvas()?.focus({ preventScroll: true }));
  }

  addShape(drawn: Shape): void {
    const made = this.img?.fresh(drawn);
    const s = made?.shape ?? drawn;
    this.apply({ ...this.doc, shapes: [...this.doc.shapes, s] }, `Draw ${s.name}`);
    if (this.tool !== 'shapes') this.tool = 'select';
    this.flat = this.makeFlat(this.doc);
    this.select([s.id]);
    this.say(t('{name} added.', { name: s.name }) + (made?.note ? ` ${made.note}` : ''));
  }

  editShapes(ids: string[], f: (s: Shape) => Shape, label: string, merge?: string): void {
    const todo = ids.filter((id) => !byId(this.doc, id)?.locked);
    if (!todo.length) return;
    this.apply(mapShapes(this.doc, todo, f), label, merge);
  }

  deleteSelected(): void {
    const ids = this.sel;
    if (!ids.length) return;
    const name = byId(this.doc, ids[0])?.name ?? '';
    this.apply(removeShapes(this.doc, ids), 'Delete');
    this.sel = [];
    this.say(t('{name} deleted.', { name: ids.length > 1 ? t('{c} shapes selected', { c: ids.length }) : name }));
  }

  duplicate(): void {
    if (!this.sel.length) return;
    const r = duplicateShapes(this.doc, this.sel);
    this.apply(r.doc, 'Duplicate');
    this.select(r.ids);
  }

  group(): void {
    const r = groupItems(this.doc, this.sel);
    if (r.group) this.apply(r.doc, 'Group');
    else if (groupBlocked(this)) this.say(t('Groups can be 4 levels deep.'));
  }

  ungroupSel(gid: string): void {
    this.apply(ungroup(this.doc, gid), 'Ungroup');
  }

  reorder(id: string, dir: 1 | -1): void {
    stepOrder(this, id, dir);
  }

  editGroup(gid: string, patch: Partial<Group>, label: string): void {
    this.apply({ ...this.doc, groups: this.doc.groups.map((g) => (g.id === gid ? { ...g, ...patch } : g)) }, label);
  }

  // ── align, distribute, placement, arrange ──

  /** The items Align and Distribute act on. */
  get items(): { items: Item[]; leftOut: number } {
    return itemsOf(this.doc, this.sel);
  }

  /** Placement acts on the selection, or on the whole drawing when nothing is selected. */
  get placeItems(): { items: Item[]; leftOut: number } {
    return itemsOf(this.doc, this.sel.length ? this.sel : this.doc.shapes.map((s) => s.id));
  }

  /** The target Align really uses: Selection needs two items, Safe area needs the safe area. */
  get alignBase(): SvgAlignTarget {
    if (this.alignTarget === 'selection' && this.items.items.length < 2) return 'canvas';
    if (this.alignTarget === 'safe' && !this.safeOn) return 'canvas';
    return this.alignTarget;
  }

  private moveItems(moves: Move[], label: string): boolean {
    const by = new Map<string, Move>();
    for (const m of moves) if (Math.abs(m.dx) > 1e-9 || Math.abs(m.dy) > 1e-9) m.ids.forEach((id) => by.set(id, m));
    if (!by.size) return false;
    this.apply({ ...this.doc, shapes: this.doc.shapes.map((s) => (by.has(s.id) ? moveShape(s, by.get(s.id)!.dx, by.get(s.id)!.dy) : s)) }, label);
    return true;
  }

  align(edge: SvgAlignEdge): void {
    const { items } = this.items;
    if (!items.length) return;
    const rel = this.alignBase;
    const to = rel === 'selection' ? union(items)! : rel === 'safe' ? safeBox(this.doc.vb) : this.doc.vb;
    this.moveItems(alignMoves(items, edge, to), 'Align');
    this.say(t('Aligned {c, plural, one {# shape} other {# shapes}} to the {edge, select, left {left} centre {centre} right {right} top {top} middle {middle} other {bottom}}.', { c: items.length, edge }));
  }

  distribute(axis: 'h' | 'v'): void {
    const { items } = this.items;
    if (items.length < 3) {
      this.say(t('Select three or more shapes to space them evenly.'));
      return;
    }
    this.moveItems(distributeMoves(items, axis), 'Distribute');
    this.say(t('Spaced {c} shapes evenly.', { c: items.length }));
  }

  place(kind: 'centre' | 'fit' | 'match'): void {
    const { items } = this.placeItems;
    const from = union(items);
    if (!from) return;
    if (kind !== 'centre' && !this.safeOn) {
      this.say(t('The safe area is hidden.'));
      return;
    }
    const ids = items.flatMap((i) => i.ids);
    let moved = false;
    if (kind === 'fit') {
      const to = fitBox(from, safeBox(this.doc.vb));
      const m = boxMatrix(from, to);
      if (Math.abs(m[0] - 1) > 1e-9 || Math.abs(m[3] - 1) > 1e-9 || Math.abs(m[4]) > 1e-9 || Math.abs(m[5]) > 1e-9) {
        this.apply(mapShapes(this.doc, ids, (s) => setShapeBox(s, from, to)), 'Fit to safe area');
        moved = true;
      }
    } else {
      const d = kind === 'centre' ? centreMove(from, this.doc.vb) : matchMove(from, safeBox(this.doc.vb));
      moved = this.moveItems([{ ids, ...d }], kind === 'centre' ? 'Centre on canvas' : 'Match safe-area edges');
    }
    if (moved) this.say(kind === 'centre' ? t('Centre on canvas') : kind === 'fit' ? t('Fit to safe area') : t('Match safe-area edges'));
  }

  /** Arrange order of the selection; false when it is already at that limit. */
  canArrange(how: SvgArrange): boolean {
    return !!this.sel.length && arrangeOrder(this.doc, this.sel, how) !== this.doc;
  }

  arrange(how: SvgArrange): void {
    const d = arrangeOrder(this.doc, this.sel, how);
    if (d === this.doc) return;
    this.apply(d, 'Arrange');
    this.say(t(ARRANGE[how]));
  }

  // ── booleans ──

  get boolean(): ReturnType<typeof boolState> {
    return boolState(this.doc, this.sel);
  }

  /** Run one boolean operation on the selection (the chunk loads on the first press). */
  async runBoolean(op: BooleanOp): Promise<void> {
    if (this.boolBusy) return;
    const st0 = this.boolean;
    const why = boolReason(st0, op);
    if (why) {
      this.say(why);
      return;
    }
    this.boolBusy = op;
    let chunk;
    try {
      chunk = await loadPathBooleans();
    } finally {
      this.boolBusy = undefined;
    }
    if (!chunk) {
      this.noteFail(t('Couldn\'t load the shape tools. Try again.'), () => void this.runBoolean(op));
      return;
    }
    const st = this.boolean;
    if (boolReason(st, op)) return;
    const r = chunk.run(op, operandsOf(st), { frame: this.doc.vb });
    if (!r.ok) {
      const why = r.reason === 'empty' ? t('Nothing is left of these shapes.') : r.reason === 'no-area' ? t('Select closed shapes. Open lines have no area.') : t('These shapes have too many points to combine.');
      this.note = { tone: 'error', lines: [why, t('Nothing was changed.')] };
      this.say(why);
      return;
    }
    const out = withResult(this.doc, st, op, r.paths);
    this.apply(out.doc, t(BOOL_OPS[op]));
    this.select([out.shape.id]);
    const text = boolNote(op, st, r.skippedOpen + st.openOnly);
    this.noteUndo(text);
  }

  /** The status strip: a result with Undo, or a failure with Try again. Both go to the live region. */
  noteUndo(text: string): void {
    this.note = { tone: 'info', lines: [text], action: { label: t('Undo'), run: () => { this.undo(); this.note = { tone: 'info', lines: [t('Undone.')] }; } } };
    this.say(text);
  }

  noteFail(text: string, retry: () => void): void {
    this.note = { tone: 'error', lines: [text], action: { label: t('Try again'), run: retry } };
    this.say(text);
  }

  /** Move/size fields: X, Y, W, H of the selection's box. */
  setBox(to: Partial<Box>, label: string): void {
    const sel = this.selected.filter((s) => !isOff(this.doc, s, 'locked'));
    const from = boxOf(sel);
    if (!from) return;
    const b: Box = { ...from, ...to };
    if (this.lockRatio && (to.w !== undefined || to.h !== undefined) && from.w > 0 && from.h > 0) {
      if (to.w !== undefined) b.h = (from.h * b.w) / from.w;
      else b.w = (from.w * b.h) / from.h;
    }
    if (b.w <= 0.01 || b.h <= 0.01) return;
    const moveOnly = Math.abs(b.w - from.w) < 1e-9 && Math.abs(b.h - from.h) < 1e-9;
    this.editShapes(sel.map((s) => s.id), (s) => (moveOnly ? moveShape(s, b.x - from.x, b.y - from.y) : setShapeBox(s, from, b)), label, label);
  }

  rotate(deg: number): void {
    const sel = this.selected.filter((s) => !isOff(this.doc, s, 'locked'));
    const b = boxOf(sel);
    if (!b || !deg) return;
    const m = rotateMatrix(deg, [b.x + b.w / 2, b.y + b.h / 2]);
    this.editShapes(sel.map((s) => s.id), (s) => ({ ...transformShape(s, m), angle: round2(((s.angle ?? 0) + deg) % 360) }), 'Rotate', 'rotate');
  }

  setAngle(deg: number): void {
    const s = this.selected[0];
    if (s && this.selected.length === 1) this.rotate(deg - (s.angle ?? 0));
  }

  flip(axis: 'h' | 'v'): void {
    const sel = this.selected.filter((s) => !isOff(this.doc, s, 'locked'));
    const b = boxOf(sel);
    if (!b) return;
    const m = flipMatrix(axis, [b.x + b.w / 2, b.y + b.h / 2]);
    this.editShapes(sel.map((s) => s.id), (s) => transformShape(s, m), 'Flip');
  }

  /** The same change to every selected layer. */
  patch(p: Partial<Shape>, label: string, merge?: string): void {
    if ('locked' in p || 'hidden' in p) {
      // a layer the editor keeps locked (an imported part) says so and is left out: no step is made for it
      const ids = this.sel.filter((id) => {
        const why = p.locked === false && this.img?.lockNote(byId(this.doc, id)!);
        if (why) this.say(why);
        return !why;
      });
      if (ids.length) this.apply(mapShapes(this.doc, ids, (s) => ({ ...s, ...p })), label, merge);
    } else this.editShapes(this.sel, (s) => ({ ...s, ...p }), label, merge);
  }

  option(patch: Partial<Pick<Shape, 'r' | 'sides' | 'inner'>>): void {
    this.editShapes(this.sel, (s) => retype(s, patch), 'Change shape', 'option');
  }

  get accentCount(): number {
    return this.doc.shapes.filter((s) => toneOf(s) !== 'main').length;
  }

  get dualOn(): boolean {
    return !!this.img || this.dual || this.accentCount > 0;
  }

  /** On at once; off asks first while Accent layers exist. */
  toggleDual(on: boolean): void {
    if (on) this.dual = true;
    else if (this.accentCount) this.dlg = 'single';
    else this.dual = false;
  }

  /** Single tone: every Accent fill and stroke becomes Main, one history step (locked layers too). */
  singleTone(): void {
    const main = (p: Paint): Paint => (p === 'accent' ? 'main' : p);
    this.apply({ ...this.doc, shapes: this.doc.shapes.map((s) => (toneOf(s) === 'main' ? s : { ...s, fill: main(s.fill), stroke: main(s.stroke), auto: false })) }, 'Single tone');
    this.dual = false;
    this.closeSingle();
  }

  closeSingle(): void {
    this.dlg = undefined;
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('#sw-dual')?.focus());
  }

  setTone(t: 'main' | 'accent'): void {
    this.editShapes(this.sel, (s) => ({ ...s, fill: s.fill === 'none' ? 'none' : t, stroke: s.stroke === 'none' ? 'none' : t, auto: false }), 'Tone');
  }

  setPaint(which: 'fill' | 'stroke', v: Paint): void {
    this.editShapes(this.sel, (s) => ({ ...s, [which]: v, auto: false, ...(which === 'stroke' && v !== 'none' && s.width <= 0 ? { width: 2 } : {}) }), `Change ${which}`);
  }

  fitSafe(): void {
    const b = boxOf(this.doc.shapes.filter((s) => !isOff(this.doc, s, 'hidden')));
    if (!b) return;
    const k = Math.min(1, 20 / Math.max(b.w, 0.01), 20 / Math.max(b.h, 0.01));
    const w = b.w * k;
    const h = b.h * k;
    const to: Box = { x: 12 - w / 2, y: 12 - h / 2, w, h };
    const m = boxMatrix(b, to);
    this.apply({ ...this.doc, shapes: this.doc.shapes.map((s) => (isOff(this.doc, s, 'hidden') ? s : transformShape(s, m, true))) }, 'Fit to 20');
  }

  tidyNow(): void {
    this.decimals = Math.min(this.decimals, 1);
    this.apply({ ...this.doc, shapes: this.doc.shapes.filter((s) => !isOff(this.doc, s, 'hidden')) }, 'Tidy');
  }

  // ── Escape, keys ──

  private inField(e: Event): boolean {
    const t = e.composedPath()[0] as HTMLElement | undefined;
    return !!t && (FIELD_TAGS.has(t.tagName) || t.isContentEditable);
  }

  private inCanvasOrRail(e: Event): boolean {
    return e.composedPath().some((n) => n instanceof HTMLElement && (n.localName === 'mc-path-canvas' || n.classList?.contains('rail') || n.classList?.contains('stage')));
  }

  /** Shell rule: end a gesture, close an overlay, clear the selection, then nothing (one hint). */
  escape(e: KeyboardEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (this.img?.close()) return;
    if (this.newAsk) return this.closeNew();
    if (this.startOpen) return this.closeStart();
    if (this.picker) {
      this.closePicker();
      return;
    }
    if (endDrag(this, false) || this.gestures.cancel()) return;
    if (this.pt) return ptCancel(this);
    if (this.pvOpen) {
      this.pvOpen = false;
      this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>('[data-pv]')?.focus());
      return;
    }
    if (this.dlg === 'poly') this.polyCancel();
    else if (this.dlg) this.dlg = undefined;
    else if (this.leaving) this.leaving = false;
    else if (this.overlay) this.overlay = false;
    else if (this.renaming) this.renaming = undefined;
    else if (this.sel.length) this.select([]);
    else if (!this.escHinted) {
      this.escHinted = true;
      this.showToast(t('Esc doesn\'t close the editor. Use Done or Back to card editor.'));
    }
  }

  onKey = (e: KeyboardEvent): void => {
    this.shift = e.shiftKey;
    if (this.stage !== 'edit' || this.modal) {
      if (e.key === 'Escape') this.escape(e);
      return;
    }
    const field = this.inField(e);
    const mod = e.ctrlKey || e.metaKey;
    if (e.key === 'Escape') {
      this.escape(e);
      return;
    }
    if (this.img?.readOnly) return;
    if (mod && e.key === 'Enter') {
      e.preventDefault();
      this.done();
      return;
    }
    if (mod && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      this.openSave();
      return;
    }
    if (field) return;
    const code = e.code;
    if (mod) {
      if (code === 'KeyZ') {
        e.preventDefault();
        if (e.shiftKey) this.redo();
        else this.undo();
      } else if (code === 'KeyY') {
        e.preventDefault();
        this.redo();
      } else if (code === 'KeyA') {
        e.preventDefault();
        this.select(this.doc.shapes.map((x) => x.id));
      } else if (code === 'KeyD') {
        e.preventDefault();
        this.duplicate();
      } else if (code === 'BracketRight' || code === 'BracketLeft') {
        e.preventDefault();
        e.stopPropagation();
        this.arrange(code === 'BracketRight' ? (e.shiftKey ? 'front' : 'forward') : e.shiftKey ? 'back' : 'backward');
      } else if (code === 'KeyG') {
        e.preventDefault();
        if (e.shiftKey) {
          const g = this.selected[0]?.group;
          if (g) this.ungroupSel(g);
        } else this.group();
      } else if (e.key === "'") {
        e.preventDefault();
        this.pixelGrid = !this.pixelGrid;
      } else if (e.key === ';') {
        e.preventDefault();
        this.snapOn = !this.snapOn;
      }
      return;
    }
    if (e.key === '?' || (code === 'Slash' && e.shiftKey)) {
      e.preventDefault();
      this.dlg = this.dlg === 'help' ? undefined : 'help';
      return;
    }
    if (this.tool === 'shapes' && code === 'KeyS' && !e.shiftKey && !e.altKey && this.inCanvasOrRail(e)) {
      e.preventDefault();
      this.picker = true;
      return;
    }
    if (this.gestures.active && DRAW_TOOLS.includes(this.tool)) return;
    if (!this.inCanvasOrRail(e) || e.altKey) return;
    if (e.shiftKey && (code === 'KeyH' || code === 'KeyV')) {
      e.preventDefault();
      this.flip(code === 'KeyH' ? 'h' : 'v');
      return;
    }
    if (code === 'KeyT' && this.img && !e.shiftKey) {
      e.preventDefault();
      this.setTool('text');
      this.say(this.img.hint);
      return;
    }
    const t = TOOL_KEYS[code];
    if (t && !e.shiftKey && !(code === 'KeyH' && (this.tool === 'node' || this.tool === 'pen'))) {
      e.preventDefault();
      this.setTool(t);
    } else if ((e.key === 'Delete' || e.key === 'Backspace') && this.tool === 'select') {
      e.preventDefault();
      this.deleteSelected();
    }
  };

  onKeyUp = (e: KeyboardEvent): void => {
    this.shift = e.shiftKey;
    if (e.code === 'Space') this.space = false;
  };

  /** Capture-phase keys on the stage: the draw tools' crosshair, before the canvas sees the key. */
  onStageKey = (e: KeyboardEvent): void => {
    if (e.code === 'Space') this.space = true;
    if (this.inField(e) || !this.gestures.active) return;
    if (e.key === 'Escape') {
      if (this.gestures.cancel()) {
        e.preventDefault();
        e.stopPropagation();
      }
      return;
    }
    if (this.gestures.key(e)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // ── stage pointers (draw tools and the Hand tool) ──

  onStageDown = (e: PointerEvent): void => {
    this.shift = e.shiftKey;
    this.startSync();
    if (!this.gestures.down(e)) return;
    e.stopPropagation();
    e.preventDefault();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* synthetic events cannot be captured */
    }
  };

  onStageMove = (e: PointerEvent): void => {
    if (this.gestures.move(e)) e.stopPropagation();
  };

  onStageUp = (e: PointerEvent): void => {
    this.endMoving();
    this.stopSync();
    if (this.gestures.up(e)) {
      e.stopPropagation();
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* not captured */
      }
    }
  };

  /** The artwork follows the canvas view while a pointer is down (the canvas only reports at the end of a pan). */
  private startSync = (): void => {
    cancelAnimationFrame(this.raf);
    const tick = (): void => {
      const c = this.canvas();
      const v = c?.view;
      if (v && (v.zoom !== this.view.zoom || v.pan[0] !== this.view.x || v.pan[1] !== this.view.y)) this.view = { zoom: v.zoom, x: v.pan[0], y: v.pan[1] };
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  };

  private stopSync = (): void => {
    cancelAnimationFrame(this.raf);
    const v = this.canvas()?.view;
    if (v) this.view = { zoom: v.zoom, x: v.pan[0], y: v.pan[1] };
  };

  // StageHost
  point(e: { clientX: number; clientY: number }): Pt {
    const r = (this.canvas() ?? this).getBoundingClientRect();
    const v = this.view;
    return [(e.clientX - r.left - v.x) / v.zoom, (e.clientY - r.top - v.y) / v.zoom];
  }

  centre(): Pt {
    const f = this.doc.vb;
    return [f.x + f.w / 2, f.y + f.h / 2];
  }

  setLive(l: Live | undefined): void {
    this.liveShape = l;
  }

  cut(a: Pt, b: Pt): void {
    void openTool(this, 'knife', [a, b]);
  }

  placeText(p?: Pt): void {
    this.img?.place(p);
  }

  panBy(dx: number, dy: number): void {
    const c = this.canvas();
    if (!c) return;
    const v = c.view;
    c.setView(v.zoom, [v.pan[0] + dx, v.pan[1] + dy]);
    this.view = { zoom: v.zoom, x: v.pan[0] + dx, y: v.pan[1] + dy };
  }

  zoomBy(f: number): void {
    const c = this.canvas();
    if (!c) return;
    const v = c.view;
    const r = c.getBoundingClientRect();
    const z = Math.min(400, Math.max(0.25, v.zoom * f));
    const ax = r.width / 2;
    const ay = r.height / 2;
    const fx = (ax - v.pan[0]) / v.zoom;
    const fy = (ay - v.pan[1]) / v.zoom;
    c.setView(z, [ax - fx * z, ay - fy * z]);
    this.view = { zoom: z, x: ax - fx * z, y: ay - fy * z };
  }

  fitView(): void {
    this.canvas()?.fit();
  }

  // ── announcements, toast ──

  say(text: string): void {
    if (!text) return;
    clearTimeout(this.liveTimer);
    // emptied first, so the same words said twice are announced twice
    this.live = '';
    this.liveTimer = setTimeout(() => {
      this.live = text;
    }, 50);
  }

  showToast(text: string, action?: { label: string; run: () => void }, ms = 6000): void {
    this.toastRun = action?.run;
    this.renderRoot.querySelector<UiToastElement>('mc-ui-toast')?.show({ text, action: action && { id: 'act', label: action.label }, duration: ms });
  }

  /** The toast's action button was pressed. */
  toastAct(): void {
    const run = this.toastRun;
    this.toastRun = undefined;
    run?.();
  }

  /** A window, popover or confirmation is open: the layer's own keys wait. */
  get modal(): boolean {
    return this.startOpen || this.newAsk || this.leaving || !!this.xfer || this.dlg === 'save' || this.dlg === 'single' || this.dlg === 'poly' || !!this.img?.modal;
  }

  // ── events out ──

  fire<T>(name: string, detail: T): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  /** The saved drawing is the current one (image mode). */
  markSaved(): void {
    this.baseline = this.stamp(this.base);
    this.dirty = false;
  }

  get libraryMissing(): boolean {
    return !this.libraryAvailable || this.lib.state === 'missing';
  }

  private chipSaid?: string;

  /** The words of the Saved chip, else undefined (nothing is stored yet). */
  get savedLabel(): string | undefined {
    const current = this.img ? !this.dirty : this.savedCurrent;
    return (this.img ? this.img.id : this.saved) ? (current ? t('Saved') : t('Changed since saved')) : undefined;
  }

  get savedCurrent(): boolean {
    return !!this.saved && !!this.out.svg && this.saved.svg === this.out.svg;
  }

  get blockReason(): string | undefined {
    if (this.img) return this.img.blockReason(this.out);
    return this.out.error === 'empty' ? t('Draw something first') : this.out.error === 'over' ? t('Over the 32 KB limit') : this.out.error === 'invalid' ? this.errorText(this.out.message) : undefined;
  }

  done(): void {
    if (this.img) return this.img.save();
    if (this.mcu) return void this.saveMcu();
    if (this.blockReason || !this.out.svg) {
      this.say(this.blockReason ?? '');
      return;
    }
    const detail: SvgSaveDetail = this.savedCurrent ? { target: 'library', svg: this.out.svg, saved: this.saved!.item, keepCopy: this.keepCopy } : { target: 'module', svg: this.out.svg };
    this.fire('mc-svg-save', detail);
  }

  back(): void {
    if (!this.dirty) {
      this.fire('mc-svg-close', { dirty: false });
      return;
    }
    this.leaving = true;
  }

  leave(): void {
    this.fire('mc-svg-close', { dirty: this.dirty });
  }

  // ── library ──

  async loadLib(): Promise<void> {
    if (this.lib.state === 'loading') return;
    this.lib = { ...this.lib, state: 'loading' };
    try {
      const items = await listIcons(this.hass);
      this.lib = { ...this.lib, state: 'ready', items };
    } catch (e) {
      this.lib = { ...this.lib, state: e instanceof LibraryError ? e.problem : 'unreachable' };
    }
  }

  openPanel(p: 'layers' | 'library'): void {
    this.panel = p;
    if (p === 'library' && (this.lib.state === 'idle' || this.lib.state === 'unreachable')) void this.loadLib();
  }

  async insertIcon(id: string): Promise<void> {
    try {
      const item = await getIcon(this.hass, id);
      const r = item ? importSvg(item.svg, item.name) : undefined;
      if (!r?.doc) throw new Error('none');
      const m = appendDoc(this.doc, r.doc);
      this.apply(m.doc, 'Insert');
      this.select(m.ids);
      this.tool = 'select';
    } catch {
      this.showToast(t('Could not load that icon.'));
    }
  }

  removeIcon(id: string): void {
    const item = this.lib.items.find((i) => i.id === id);
    if (!item) return;
    void this.flushDelete();
    getIcon(this.hass, id)
      .then((full) => {
        if (!full) return;
        this.lib = { ...this.lib, items: this.lib.items.filter((i) => i.id !== id) };
        const timer = setTimeout(() => void this.flushDelete(), 10_000);
        this.deleted = { item: full, timer };
      })
      .catch(() => this.showToast(t('Could not load that icon.')));
  }

  async flushDelete(): Promise<void> {
    const d = this.deleted;
    if (!d) return;
    clearTimeout(d.timer);
    this.deleted = undefined;
    try {
      await deleteIcon(this.hass, d.item.id);
    } catch {
      this.lib = { ...this.lib, items: [...this.lib.items, d.item] };
    }
  }

  undoDelete(): void {
    const d = this.deleted;
    if (!d) return;
    clearTimeout(d.timer);
    this.deleted = undefined;
    this.lib = { ...this.lib, items: [...this.lib.items, d.item] };
  }

  openSave(): void {
    if (this.stage !== 'edit') return;
    if (this.img) return this.img.save();
    if (this.mcu) return void this.saveMcu();
    if (this.libraryMissing) {
      this.say(t('Keep your own icons for every dashboard with the free Magic Card Utils add-on. Until then, what you draw is saved in this card only.'));
      return;
    }
    this.saveName = this.saved?.item.name ?? this.doc.name ?? t('My icon');
    this.saveError = '';
    this.keepCopy = (this.out.svg ? bytesOf(this.out.svg) : 0) <= KEEP_COPY_DEFAULT_MAX_BYTES;
    this.dlg = 'save';
    if (this.lib.state === 'idle') void this.loadLib();
  }

  /** `mode` 'update' writes over `id`; 'new' takes a free id for the name. */
  async saveToLibrary(mode: 'update' | 'new'): Promise<void> {
    const name = this.saveName.trim();
    if (!name) {
      this.saveError = t('Give it a name.');
      return;
    }
    if (name.length > 40) {
      this.saveError = t('Use 40 characters or fewer.');
      return;
    }
    if (!this.out.svg || this.blockReason) {
      this.saveError = this.blockReason ?? t('Draw something first');
      return;
    }
    const taken = new Set(this.lib.items.map((i) => i.id));
    const target = mode === 'update' ? this.updateTarget() : undefined;
    const id = target?.id ?? freeId(name, taken);
    const ha = haForm(this.doc, this.decimals);
    this.saveBusy = true;
    try {
      const item = await saveIcon(
        this.hass,
        { id, name, svg: this.out.svg, path: ha.path, ...(ha.secondary ? { secondary_path: ha.secondary } : {}), view_box: this.out.viewBox },
        target?.at,
      );
      this.saved = { item, svg: this.out.svg };
      this.doc = { ...this.doc, name: item.name };
      this.dlg = undefined;
      void this.loadLib();
      this.showToast(t('Saved to library as {name}. Press Done to use it on this card.', { name: item.name }), { label: t('Use on this card'), run: () => this.done() }, 10_000);
      this.say(t('Saved to library as {name}. Press Done to use it on this card.', { name: item.name }));
    } catch (e) {
      this.saveError = this.problemText(e, name);
    } finally {
      this.saveBusy = false;
    }
  }

  private problemText(e: unknown, name: string): string {
    const p = e instanceof LibraryError ? e.problem : 'unreachable';
    return p === 'readonly' ? t('Your account can use the library but not change it. Ask an admin, or keep this icon in the card only.') : p === 'conflict' ? t('{name} changed while you were editing. Save as new, or reload it.', { name }) : p === 'full' ? t('The library is full. Delete an icon you no longer use.') : p === 'invalid' ? t('The library could not accept this icon. Tidy it and try again.') : p === 'missing' ? t('Keep your own icons for every dashboard with the free Magic Card Utils add-on. Until then, what you draw is saved in this card only.') : t('Could not save {name}. Try again.', { name });
  }

  /** Host 'mcu': Save writes to the library and the editor stays open. `copy` takes a new id and ignores the stored version. */
  async saveMcu(copy = false): Promise<void> {
    const name = this.doc.name.trim();
    const why = !name ? t('Give the icon a name.') : this.blockReason;
    if (why || !this.out.svg || this.saveBusy) {
      if (why) this.say(why);
      return;
    }
    this.saveBusy = true;
    this.conflict = false;
    this.note = undefined;
    try {
      if (copy || !this.saved) await this.loadLib();
      const cur: { id: string; updated_at: string } | undefined = copy ? undefined : (this.saved?.item ?? this.lib.items.find((i) => i.id === this.savedId));
      if (!cur && this.lib.state !== 'ready') throw new LibraryError(this.lib.state === 'idle' || this.lib.state === 'loading' ? 'unreachable' : this.lib.state);
      const id = cur?.id ?? freeId(name, new Set(this.lib.items.map((i) => i.id)));
      const ha = haForm(this.doc, this.decimals);
      const svg = this.out.svg;
      const item = await saveIcon(this.hass, { id, name, svg, path: ha.path, ...(ha.secondary ? { secondary_path: ha.secondary } : {}), view_box: this.out.viewBox }, cur?.updated_at);
      this.saved = { item, svg };
      this.baseline = toSvg(this.base);
      this.dirty = false;
      void this.loadLib();
      this.fire('mc-svg-save', { target: 'library', svg, saved: item } satisfies SvgSaveDetail);
      this.say(t('Saved'));
    } catch (e) {
      if (e instanceof LibraryError && e.problem === 'conflict') {
        this.conflict = true;
        this.say(t('This icon was changed somewhere else.'));
      } else this.note = { tone: 'error', lines: [this.problemText(e, name)] };
    } finally {
      this.saveBusy = false;
    }
  }

  /** The conflict banner's Reload: the stored version replaces the drawing. */
  reload(): void {
    this.conflict = false;
    if (this.saved) void this.openLibrary(this.saved.item.id);
  }

  /** The item "Update" writes over: the one named like the field, else the one this editor opened or last saved. */
  updateTarget(): { id: string; name: string; at?: string } | undefined {
    const name = this.saveName.trim().toLowerCase();
    const id = this.saved?.item.id ?? this.savedId;
    const it = this.lib.items.find((i) => i.name.toLowerCase() === name) ?? this.lib.items.find((i) => i.id === id) ?? this.saved?.item;
    return it ? { id: it.id, name: it.name, at: it.updated_at } : undefined;
  }

  // ── export ──

  async copyText(text: string, ok: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast(ok);
    } catch {
      this.showToast(t('Could not copy. Select the markup and copy it yourself.'));
    }
  }

  copySvg(): void {
    if (this.out.svg) void this.copyText(this.out.svg, t('Copied the SVG.'));
  }

  copyAccent(): void {
    const f = haForm(this.doc, this.decimals);
    if (f.secondary) void this.copyText(f.secondary, t('Copied the accent path.'));
  }

  copyHa(): void {
    const f = haForm(this.doc, this.decimals);
    void this.copyText(JSON.stringify({ path: f.path, ...(f.secondary ? { secondaryPath: f.secondary } : {}), viewBox: f.viewBox }), t('Copied the path and viewBox, for Home Assistant custom icon sets. See the docs.'));
  }

  download(): void {
    if (this.img) return this.img.download();
    if (!this.out.svg) return;
    const url = URL.createObjectURL(new Blob([this.out.svg], { type: 'image/svg+xml' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug(this.doc.name || t('My icon'))}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ── export / import file (preset-transfer) ──

  async openTransfer(mode: 'import' | 'export', back?: HTMLElement): Promise<void> {
    try {
      const load = (window as unknown as { MagicCard?: Partial<MagicCardEditorWindowAdditions> }).MagicCard?.loadTransfer;
      if (!load) throw new Error('no loader');
      await load();
      const o = this.out;
      const name = this.doc.name || t('My icon');
      const items: TransferItem[] | undefined = o.svg ? [{ id: slug(name), name, data: { svg: o.svg, view_box: o.viewBox } }] : undefined;
      this.xfer = { mode, items: mode === 'export' ? items : undefined, back };
    } catch {
      this.showToast(t('Could not load the export and import tool. Try again.'));
    }
  }

  closeTransfer(): void {
    const back = this.xfer?.back;
    this.xfer = undefined;
    void this.updateComplete.then(() => (back?.isConnected ? back : this.renderRoot.querySelector<HTMLElement>('[data-xfer]'))?.focus());
  }

  /** The first icon of the file opens as the drawing; the sanitiser output is what is read (CRA). */
  importItems(items: TransferItem[]): void {
    const it = items[0];
    const svg = (it?.data as { svg?: string } | undefined)?.svg;
    this.closeTransfer();
    if (!svg) return;
    const r = importSvg(svg, it.name);
    if (!r.doc) return void this.showToast(t('This is not valid SVG. Check that it starts with <svg and is closed.'));
    if (this.stage === 'edit') this.apply(r.doc, 'Import');
    else this.begin(r.doc);
    this.select([]);
    this.showToast(items.length > 1 ? t('Opened {name}, the first of {count} icons in the file. The others were not used.', { name: it.name, count: items.length }) : t('Opened {name} as the drawing. Undo brings your last drawing back.', { name: it.name }));
  }

  // ── layers, points, start ──

  readonly cap = {
    down: { handleEvent: (e: Event) => this.onStageDown(e as PointerEvent), capture: true },
    key: { handleEvent: (e: Event) => this.onStageKey(e as KeyboardEvent), capture: true },
  };

  get fitZoom(): number {
    const r = this.canvas()?.getBoundingClientRect();
    return r && r.width ? Math.max(0.01, Math.min((r.width - 48) / this.doc.vb.w, (r.height - 48) / this.doc.vb.h)) : 0;
  }

  blankStart(): Doc {
    return blankDoc(this.mcu ? '' : t('My icon'));
  }

  startLibrary(): void {
    this.take(this.blankStart());
    this.openPanel('library');
    void this.lips.reveal('side');
  }

  /** Open file in the start window. */
  startFile(file?: File): Promise<void> {
    return file
      ? this.startRun('start-open', file.name, async (n) => {
          if (this.img) return this.img.openFile(file);
          const r = await readFile(file, ICON_SVG_INTAKE);
          if (!r.ok) return r.code === 'unreadable' ? t('Could not read that file.') : this.errorText(r.code === 'too_large' ? 'The SVG is larger than 32 KB.' : 'No <svg> element found.');
          try {
            await this.importText(r.text, file.name.replace(/\.svg$/i, '') || t('My icon'), n);
          } catch {
            return t('Could not read that file.');
          }
          return undefined;
        })
      : Promise.resolve();
  }

  /** Use this SVG in the start window. */
  usePaste(text: string): Promise<void> {
    return this.startRun('start-paste-go', undefined, async (n) => {
      const bad = refuseText(text, this.img ? IMAGE_SVG_MAX_FILE_BYTES : ICON_SVG_MAX_FILE_BYTES);
      if (bad) return bad === 'empty' ? t('Paste some SVG first.') : this.img ? this.img.tooBig : this.errorText('The SVG is larger than 32 KB.');
      if (this.img) return this.img.openText(text);
      await this.importText(text, t('My icon'), n);
      return undefined;
    });
  }

  /**
   * Runs one start action. Its answer counts only while the window still waits for it; a refusal goes to the status line
   * and the focus returns to the control that began it. `go` returns the refusal, a drawing, or nothing when it took the
   * drawing itself.
   */
  private async startRun(at: string, busy: string | undefined, go: (n: number) => Promise<string | { doc: Doc } | undefined>): Promise<void> {
    const n = ++this.seq;
    this.startAt = at;
    this.startError = undefined;
    this.startBusy = busy;
    clearTimeout(this.readTimer);
    if (busy) this.readTimer = setTimeout(() => n === this.seq && this.say(t('Reading {name}…', { name: busy })), 200);
    let r: string | { doc: Doc } | undefined;
    try {
      r = await go(n);
    } catch {
      r = busy ? t('Could not read that file.') : t('This is not valid SVG. Check that it starts with <svg and is closed.');
    }
    if (n !== this.seq) return;
    clearTimeout(this.readTimer);
    this.startBusy = undefined;
    if (typeof r === 'object') return this.take(r.doc);
    if (r) this.startError = r;
    if (this.startError) void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>(`#${at}`)?.focus({ preventScroll: true }));
  }

  replaceOne(s: Shape, patch: Partial<Shape>): Doc {
    return { ...this.doc, shapes: this.doc.shapes.map((x) => (x.id === s.id ? { ...x, ...patch } : x)) };
  }

  renameShape(id: string, name: string): void {
    const n = name.trim();
    this.renaming = undefined;
    if (id.startsWith('g:')) {
      if (n && this.doc.groups.find((g) => g.id === id.slice(2))?.name !== n) this.editGroup(id.slice(2), { name: n }, 'Rename');
      return;
    }
    const s = byId(this.doc, id);
    if (n && s && n !== s.name) this.apply(this.replaceOne(s, { name: n }), 'Rename', `rename-${id}`);
  }

  toggleGroup(gid: string): void {
    const groups = this.doc.groups.map((g) => (g.id === gid ? { ...g, open: g.open === false } : g));
    this.doc = { ...this.doc, groups };
    this.base = { ...this.base, groups };
  }

  finishPath(): void {
    this.cvSel = undefined;
    this.select([]);
    this.say(t('Finish path'));
  }

  /** The point the point tools are on: its layer, subpath and anchor. */
  get pointCtx(): { s: Shape; sub: number; p: EditPath; i: number; a: Anchor; kind: 'corner' | 'smooth'; pathIndex: number } | undefined {
    const c = this.cvSel;
    if ((this.tool !== 'node' && this.tool !== 'pen') || !c || c.anchors.length !== 1) return undefined;
    const m = this.flat.map[c.path];
    const s = m && byId(this.doc, m.sid);
    const p = s && s.paths[m.sub];
    const a = p?.anchors[c.anchors[0]];
    if (!s || !p || !a) return undefined;
    return { s, sub: m.sub, p, i: c.anchors[0], a, kind: a.kind === 'smooth' || a.kind === 'symmetric' || (!a.kind && a.in && a.out) ? 'smooth' : 'corner', pathIndex: c.path };
  }

  get canAddPoint(): boolean {
    const c = this.pointCtx;
    return !!c && E.canAdd(c.p) && (c.p.closed || c.i < c.p.anchors.length - 1);
  }

  /** Edit the point under the point tools (fields, buttons). */
  editPoint(f: (p: EditPath, i: number) => EditPath, label: string, merge?: string): void {
    const c = this.pointCtx;
    if (!c || c.s.locked) return;
    const paths = c.s.paths.slice();
    paths[c.sub] = f(c.p, c.i);
    this.apply({ ...this.doc, shapes: this.doc.shapes.map((x) => (x.id === c.s.id ? asPath({ ...c.s, paths, angle: undefined }) : x)) }, label, merge);
  }

  stepPoint(dir: 1 | -1): void {
    const c = this.pointCtx;
    if (!c) return;
    const n = c.p.anchors.length;
    const next = c.p.closed ? (c.i + dir + n) % n : Math.min(n - 1, Math.max(0, c.i + dir));
    this.cvSel = { path: c.pathIndex, anchors: [next] };
  }

  setKind(k: 'corner' | 'smooth'): void {
    this.editPoint((p, i) => {
      if (k === 'corner') return E.setKind(p, i, 'corner');
      const a = p.anchors[i];
      const q = !a.in && !a.out ? (E as unknown as { toggleSmooth(p: EditPath, i: number): EditPath }).toggleSmooth(p, i) : p;
      return E.setKind(q, i, 'smooth');
    }, 'Change point type');
  }

  addAfter(): void {
    const c = this.pointCtx;
    if (!c || !this.canAddPoint) return;
    const r = E.insertAt(c.p, c.i, 0.5);
    if (r.index < 0) return;
    this.editPoint(() => r.path, 'Add point');
    this.cvSel = { path: c.pathIndex, anchors: [r.index] };
  }

  deletePoint(): void {
    const c = this.pointCtx;
    if (!c) return;
    const q = E.remove(c.p, c.i);
    if (!q.anchors.length) {
      const doc = removeSubpath(this.doc, c.s.id, c.sub);
      this.apply(doc, 'Delete point');
      this.cvSel = undefined;
      return;
    }
    this.editPoint(() => q, 'Delete point');
    this.cvSel = { path: c.pathIndex, anchors: [Math.max(0, c.i - 1)] };
  }

  /** The arrow buttons of the nudge pad. */
  nudge(dx: number, dy: number): void {
    if (this.img?.readOnly) return;
    const k = this.nudgeBig ? 4 : 1;
    const c = this.pointCtx;
    if (c && this.tool === 'node') this.editPoint((p, i) => E.moveAnchor(p, i, p.anchors[i].x + dx * k, p.anchors[i].y + dy * k), 'Move point');
    else if (this.sel.length) this.editShapes(this.sel, (s) => moveShape(s, dx * k, dy * k), 'Move');
    this.setMoving(this.sel, 300);
  }

  // ── render ──

  /** Where focus was when a window (Save to library, Export, ...) opened: it goes back there when the window goes away. */
  private dlgReturn?: HTMLElement;

  protected updated(changed: PropertyValues): void {
    // the Saved chip takes no focus: a change of it is said once
    const chip = this.savedLabel;
    if (chip !== this.chipSaid) {
      if (this.chipSaid && chip) this.say(chip);
      this.chipSaid = chip;
    }
    if (changed.has('dlg') && changed.get('dlg') && !this.dlg) {
      // the window left the page by state, not through its own close(): nothing else puts focus back
      const a = deepActive();
      if (!a || a === document.body || !this.renderRoot.contains(a) && !this.contains(a)) {
        const back = this.dlgReturn?.isConnected ? this.dlgReturn : this.renderRoot.querySelector<HTMLElement>('.topbar [data-act=save-library]');
        back?.focus({ preventScroll: true });
      }
    }
    if (changed.has('menu') && this.menu) this.renderRoot.querySelector<HTMLElement & { show?(): void }>('mc-ui-menu')?.show?.();
    // a gesture frame changes the drawing only: nothing can have opened since the last update
    if (!(this.hot && changed.size > 0 && [...changed.keys()].every((k) => FRAME_KEYS.has(k as string)))) this.openOverlays();
    const barSig = `${this.stage}|${this.layout}|${this.overlay}|${this.lips.state('side')}|${this.lips.state('inspector')}`;
    if (barSig !== this.barSig) {
      this.barSig = barSig;
      this.bar.watch(this.renderRoot.querySelector<HTMLElement>('.left'), this.renderRoot.querySelector<HTMLElement>('.work'));
    }
    if (changed.has('picker') && this.picker) this.renderRoot.querySelector<HTMLElement>('.picker [role=radio][tabindex="0"]')?.focus();
  }

  /** Windows and popovers are rendered closed: open each one the first time it shows up. */
  private openOverlays(): void {
    for (const w of this.renderRoot.querySelectorAll<UiWindowElement>('mc-ui-window')) {
      if (w.open) continue;
      w.show();
      // after the window's own focus step: the Save name is selected for typing over
      if (this.dlg === 'poly') void (w as unknown as { updateComplete: Promise<unknown> }).updateComplete.then(() => this.renderRoot.querySelector<HTMLInputElement>('#o-sides')?.select());
      if (this.dlg === 'save') void (w as unknown as { updateComplete: Promise<unknown> }).updateComplete.then(() => this.renderRoot.querySelector<HTMLInputElement>('#save-name')?.select());
    }
    for (const p of this.renderRoot.querySelectorAll<UiPopoverElement>('mc-ui-popover')) {
      if (p.open) continue;
      p.anchor = this.renderRoot.querySelector<HTMLElement>(`[aria-controls="${p.id}"]`)!;
      p.show();
      // a keyboard user lands in the panel (Esc and Tab leave it); the panel names itself
      void (p as unknown as { updateComplete: Promise<unknown> }).updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>(p.id === 'pv' ? '#pv [role=radio][tabindex="0"]' : '.pop-body')?.focus({ preventScroll: true }));
    }
  }

  protected willUpdate(changed: PropertyValues): void {
    if (this.thaw || (changed.has('doc') && !this.hot)) {
      this.thaw = false;
      this.listKey = {};
    }
    if (changed.has('hass') && this.hass) setI18nLocale(this.hass as LocaleHassLike);
    const language = (this.hass as LocaleHassLike | undefined)?.locale?.language ?? 'en';
    if (language !== this.lipLocale) {
      this.lipLocale = language;
      this.lips.setPanels(lipSpecs(), lipStrings(language));
    }
    // a panel has a lip only while it is a column beside the stage; the side panel is a sheet in the compact layout
    const editing = this.stage === 'edit' && !this.img;
    this.lips.columns({ side: editing && (this.layout === 'wide' || this.layout === 'mid'), inspector: editing && this.layout !== 'stacked' });
    if (changed.has('dlg') && this.dlg && !changed.get('dlg')) this.dlgReturn = deepActive();
    if (changed.has('tool') || changed.has('sel')) this.syncPen();
    if (this.pt && (changed.has('sel') || changed.has('doc'))) ptLater(this);
  }

  protected render(): TemplateResult {
    return renderEditor(this);
  }

  /** Focus the first and last focusable of the layer (the sentinels keep Tab inside it). */
  wrapFocus(end: boolean): void {
    const list = [...this.renderRoot.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select, textarea, [tabindex="0"]')].filter((el) => !el.classList.contains('sentinel') && !el.closest('[hidden], [data-lip="hidden"]') && el.getClientRects().length > 0);
    (end ? list[list.length - 1] : list[0])?.focus();
  }

  get unionBox(): Box | undefined {
    return unionBox(this.selected.map(shapeBox));
  }

  get safeOn(): boolean {
    return this.safe && is24(this.doc);
  }
}

export const GRID_CHIPS: readonly number[] = [0.5, 1, 2, 3, 4];
export const GRID_MIN = 0.1;
export const GRID_MAX = 12;

const TOOL_KEYS: Record<string, Tool> = { KeyV: 'select', KeyA: 'node', KeyP: 'pen', KeyR: 'rect', KeyE: 'ellipse', KeyL: 'line', KeyG: 'polygon', KeyS: 'shapes', KeyB: 'free', KeyH: 'hand', KeyK: 'knife' };

export const toolName = (tool: Tool): string =>
  ({ select: t('Select'), node: t('Edit points'), pen: t('Pen'), rect: t('Rectangle'), ellipse: t('Ellipse'), line: t('Line'), polygon: t('Polygon or star'), shapes: t('Shapes'), free: t('Freehand'), hand: t('Hand'), knife: t(PT_NAME.knife), text: '' })[tool];

/** Bytes as KB, for a {size} argument (the runtime formats numbers in the user's number format). */
export const kbOf = (bytes: number): number => bytes / 1024;

function deepActive(): HTMLElement | undefined {
  let a: Element | null = document.activeElement;
  while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement;
  return a instanceof HTMLElement ? a : undefined;
}

if (!customElements.get(SVG_EDITOR_TAG)) customElements.define(SVG_EDITOR_TAG, McSvgEditor);

function removeSubpath(d: Doc, sid: string, sub: number): Doc {
  const shapes = d.shapes.flatMap((s) => {
    if (s.id !== sid) return [s];
    const paths = s.paths.filter((_, i) => i !== sub);
    return paths.length ? [{ ...s, paths }] : [];
  });
  return { ...d, shapes };
}
