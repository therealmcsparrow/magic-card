import { html, nothing, svg, type TemplateResult } from 'lit';
import { guard } from 'lit/directives/guard.js';
import type { TransferItem } from '../contracts/preset-transfer';
import { toPathString } from '../path/core';
import { D, E } from './bind';
import { PRIMITIVE_KINDS, type PrimitiveKind } from '../contracts/path-model';
import { HA_SECONDARY_OPACITY, type SvgArrange } from '../contracts/svg-editor';
import { haWarns } from './ha';
import { groupBlocked, layerTree, subject } from './layers';
import { glyph, type GlyphName } from '../ui-kit/glyphs';
import { button, chip, empty, field, notice, row, sectionHead, seg, switchRow, tiles, toolbar } from '../ui-kit/templates';
import { byId, isOff, round2, shapeBox, type Doc, type Paint, type Shape } from './model';
import type { Banner, McSvgEditor } from './mc-svg-editor';
import { apply, cancel, change, panelState } from './pathtools';
import { GRID_CHIPS, GRID_MAX, GRID_MIN, kbOf, toolName } from './mc-svg-editor';
import { freeId } from './library';
import { S } from './strings';
import type { Tool } from './tools';

/* The editor's templates: plain functions of the editor element (state lives there). Look and behaviour of the controls come from the ui kit. */

const fmt = (v: number): string => String(round2(v));
const aria = (b: boolean): string => (b ? 'true' : 'false');

// ── artwork ──

const dCache = new WeakMap<Shape, string>();
const dOf = (s: Shape): string => {
  let d = dCache.get(s);
  if (d === undefined) {
    d = s.paths.filter((p) => p.anchors.length).map((p) => toPathString([E.fromEdit(p)])).join(' ');
    dCache.set(s, d);
  }
  return d;
};
const paintVar = (p: Paint): string => (p === 'none' ? 'none' : p === 'main' ? 'var(--m)' : 'var(--a)');

/** The shapes as SVG nodes painted with --m (Main) and --a (Accent), set by the parent. */
export function artNodes(d: Doc, onlyVisible = true): TemplateResult[] {
  return d.shapes
    .filter((s) => !onlyVisible || !isOff(d, s, 'hidden'))
    .map((s) => svg`<path d=${dOf(s)} style=${`fill:${paintVar(s.fill)};stroke:${paintVar(s.stroke)};stroke-width:${s.width};stroke-linecap:${s.cap};stroke-linejoin:${s.join};fill-rule:${s.rule}`}></path>`);
}

const viewBox = (d: Doc): string => `${d.vb.x} ${d.vb.y} ${d.vb.w} ${d.vb.h}`;

const PREVIEW: Record<string, { ground: string; m: string; a: string }> = {
  light: { ground: '#ffffff', m: '#1f2933', a: '#d9622b' },
  dark: { ground: '#1f2428', m: '#eceff1', a: '#ff9f68' },
  on: { ground: '#1f2428', m: '#ffc107', a: '#4fc3f7' },
  off: { ground: '#1f2428', m: '#8b949b', a: '#66707a' },
};

// ── small pieces (thin wrappers over the kit's templates) ──

interface BtnOpts {
  variant?: 'primary' | 'secondary' | 'text' | 'danger';
  size?: 'md' | 'sm';
  /** Show the label next to (or instead of) the glyph. */
  text?: boolean;
  /** Unavailable for now. The button stays focusable (aria-disabled) and a press does nothing. */
  disabled?: boolean;
  pressed?: boolean;
  keys?: string;
  expanded?: boolean;
  haspopup?: 'menu' | 'dialog';
  controls?: string;
}

/** An icon button, or a text button with an optional glyph. Small (32) unless a screen asks for more. */
function btn(label: string, g: GlyphName | undefined, on: () => void, o: BtnOpts = {}): TemplateResult {
  return button({
    label,
    glyph: g,
    iconOnly: !!g && !o.text,
    size: o.size ?? 'sm',
    variant: o.variant ?? 'secondary',
    pressed: o.pressed,
    disabledReason: o.disabled ? label : undefined,
    keys: o.keys,
    expanded: o.expanded,
    haspopup: o.haspopup,
    controls: o.controls,
    onClick: () => on(),
  });
}

function numField(id: string, label: string, v: number | undefined, on: (n: number) => void, o: { field?: string; min?: number; max?: number; step?: number; disabled?: boolean; back?: () => void; hint?: string } = {}): TemplateResult {
  const set = (e: Event): void => {
    const el = e.target as HTMLInputElement;
    const n = parseFloat(el.value);
    if (Number.isFinite(n)) on(n);
    else el.value = v === undefined ? '' : fmt(v);
  };
  return field({
    id,
    label,
    control: html`<input
      id=${id}
      class="input"
      type="number"
      inputmode="decimal"
      step=${o.step ?? 'any'}
      min=${o.min ?? nothing}
      max=${o.max ?? nothing}
      data-field=${o.field ?? nothing}
      title=${o.hint ?? nothing}
      .value=${v === undefined ? '' : fmt(v)}
      ?disabled=${o.disabled}
      @change=${set}
      @keydown=${(e: KeyboardEvent) => {
        if (e.key === 'Escape' && o.back) {
          e.preventDefault();
          e.stopPropagation();
          o.back();
        }
      }}
    />`,
  });
}

function segc<T extends string>(label: string, value: T, items: Array<[T, string]>, on: (v: T) => void): TemplateResult {
  return seg({ role: 'radiogroup', label, value, items: items.map(([v, text]) => ({ value: v, label: text })), onChange: on });
}

/** A yes / no setting is always a switch. */
const chk = (id: string, label: string, on: boolean, set: (v: boolean) => void, help?: string): TemplateResult => switchRow({ id, label, help, checked: on, onChange: set });

const pick = (id: string, label: string, v: string | number, items: Array<[string | number, string]>, set: (v: string) => void): TemplateResult =>
  field({
    id,
    label,
    control: html`<div class="select"
      ><select id=${id} class="input" @change=${(e: Event) => set((e.target as HTMLSelectElement).value)}>${items.map(([k, t]) => html`<option value=${k} ?selected=${k === v}>${t}</option>`)}</select
      ><ha-icon icon="mdi:chevron-down"></ha-icon
    ></div>`,
  });

/** A titled block of the side panels. */
const group = (title: string, body: unknown, level: 3 | 4 = 4): TemplateResult => html`<section class="group" aria-label=${title}>${sectionHead({ title, level })}${body as TemplateResult}</section>`;

const paintItems = (dual: boolean): Array<[Paint, string]> => [
  ['none', S.paintNone],
  ['main', S.paintMain],
  ...(dual ? [['accent', S.paintAccent] as [Paint, string]] : []),
];

/** The icon-level Dual-tone switch: Main and Accent over the same paint. */
const dualSwitch = (ed: McSvgEditor): TemplateResult => chk('sw-dual', S.dualTone, ed.dualOn, (v) => ed.toggleDual(v), S.dualHelp);

/** A confirmation: an alert window with the safe choice first (it gets the focus). */
function confirm(heading: string, body: unknown, buttons: unknown, close: () => void, size: 's' | 'm' = 's'): TemplateResult {
  return html`<mc-ui-window variant="alert" size=${size} heading=${heading} closeLabel=${S.close} @mc-window-close=${close}>
    <div class="confirm">${body as TemplateResult}</div>
    <div slot="footer" class="foot">${buttons as TemplateResult}</div>
  </mc-ui-window>`;
}

function singleWin(ed: McSvgEditor): TemplateResult {
  return confirm(
    S.singleAsk(ed.accentCount),
    html`<p>${S.singleBody}</p>`,
    html`${btn(S.singleKeep, undefined, () => ed.closeSingle(), { text: true, size: 'md' })}${btn(S.singleGo, undefined, () => ed.singleTone(), { text: true, size: 'md', variant: 'primary' })}`,
    () => ed.dlg === 'single' && ed.closeSingle(),
  );
}

function xferWin(ed: McSvgEditor): TemplateResult {
  const x = ed.xfer!;
  return html`<mc-ui-window
    variant="sheet"
    heading=${x.mode === 'export' ? S.exportFile : S.importFile}
    closeLabel=${S.close}
    movable
    resizable
    maximizable
    moveLabel=${S.moveWindow}
    resizeLabel=${S.resizeWindow}
    maximizeLabel=${S.maximize}
    restoreLabel=${S.restore}
    .dismissible=${false}
    @mc-window-close=${() => ed.xfer && ed.closeTransfer()}
  >
    <mc-transfer-panel .host=${'svg-editor'} .mode=${x.mode} .exportItems=${x.items ? { kind: 'icon', items: x.items } : undefined} .hasLibrary=${!ed.libraryMissing}
      @mc-transfer-close=${() => ed.closeTransfer()} @mc-transfer-import=${(e: CustomEvent<{ items: TransferItem[] }>) => (e.stopPropagation(), ed.importItems(e.detail.items))}></mc-transfer-panel>
  </mc-ui-window>`;
}

// ── the layer ──

export function renderEditor(ed: McSvgEditor): TemplateResult {
  return html`<div class="layer" role="dialog" aria-modal="true" aria-label=${S.title} data-layout=${ed.layout} @keydown=${ed.onKey} @keyup=${ed.onKeyUp}>
    <span class="sentinel" tabindex="0" @focus=${() => ed.wrapFocus(true)}></span>
    ${skipLinks(ed)} ${topBar(ed)} ${banners(ed)}
    ${ed.stage === 'edit' ? workspace(ed) : ed.stage === 'loading' ? html`<p class="center-msg" role="status">${S.loading}</p>` : html`<div class="center-msg" role="alert"><p>${S.loadFail}</p>${btn(S.retry, undefined, () => void ed.start(), { text: true, size: 'md', variant: 'primary' })}</div>`}
    ${ed.startOpen ? startWindow(ed) : nothing}
    ${ed.dlg === 'save' ? saveWin(ed) : nothing} ${ed.dlg === 'single' ? singleWin(ed) : nothing} ${ed.leaving ? leaveWin(ed) : nothing} ${ed.newAsk ? newWin(ed) : nothing} ${ed.xfer ? xferWin(ed) : nothing}
    ${ed.dlg === 'help' ? helpPop(ed) : nothing} ${ed.pvOpen ? previewPop(ed) : nothing}
    ${ed.menu ? html`<mc-ui-menu .items=${ed.menu.items} .label=${ed.menu.key === 'xfer' ? S.xferMenu : ed.menu.key ? ed.menu.opener.textContent!.trim() : S.shapeActions} .at=${ed.menu.at} .touch=${ed.menu.touch} .opener=${ed.menu.opener} @mc-menu-pick=${ed.onPick} @mc-menu-close=${ed.onMenuClose}></mc-ui-menu>` : nothing}
    <mc-ui-toast @mc-toast-action=${() => ed.toastAct()}></mc-ui-toast>
    <div class="sr" role="status" aria-live="polite">${ed.live}</div>
    <span class="sentinel" tabindex="0" @focus=${() => ed.wrapFocus(false)}></span>
  </div>`;
}

function skipLinks(ed: McSvgEditor): TemplateResult | typeof nothing {
  if (ed.stage !== 'edit') return nothing;
  const go = (sel: string) => () => {
    const el = ed.renderRoot.querySelector<HTMLElement>(sel);
    el?.focus();
  };
  return html`<nav class="skips">
    ${btn(S.skipCanvas, undefined, go('mc-path-canvas'), { text: true })}
    ${ed.pointCtx ? btn(S.skipPoint, undefined, go('[data-field="px"]'), { text: true }) : nothing}
    ${btn(S.skipInspector, undefined, go('.insp input, .insp button'), { text: true })}
  </nav>`;
}

function topBar(ed: McSvgEditor): TemplateResult {
  const edit = ed.stage === 'edit';
  const blocked = ed.blockReason;
  const o = ed.out;
  const used = kbOf(o.bytes);
  const zone = o.error === 'over' ? ' is-error' : o.bytes >= 24 * 1024 ? ' is-warn' : '';
  const needLib = ed.libraryMissing && !ed.mcu;
  const sm = ed.layout === 'stacked';
  const z = sm ? 'sm' : 'md';
  const why = ed.mcu && edit && !ed.doc.name.trim() ? S.nameNeeded : blocked;
  return html`<header class="topbar">
    ${button({ label: ed.mcu ? S.close : S.back, glyph: 'arrowLeft', variant: 'secondary', size: z, onClick: () => ed.back() })}
    <h1 class="title">${S.title}</h1>
    ${edit ? button({ label: S.startNew, glyph: 'fileOutline', variant: 'secondary', size: z, haspopup: 'dialog', onClick: (e) => ed.openStart(e.currentTarget as HTMLElement) }) : nothing}
    ${edit
      ? html`<div class="nm-field">
          <div class="name"
            ><input class="input" type="text" maxlength="80" aria-label=${S.nameLabel} aria-required=${ed.mcu ? 'true' : nothing} title=${S.nameTip} .value=${ed.doc.name} @change=${(e: Event) => ed.apply({ ...ed.doc, name: (e.target as HTMLInputElement).value }, 'Rename icon', 'name')}
          /></div>
          ${ed.saved ? chip({ label: ed.savedCurrent ? S.savedMark : S.changedMark, tone: ed.savedCurrent ? undefined : 'warn' }) : nothing}
        </div>`
      : nothing}
    <span class="spacer"></span>
    ${edit
      ? html`${ed.layout === 'compact' ? btn(ed.panel === 'layers' ? S.layers : S.library, undefined, () => (ed.overlay = !ed.overlay), { text: true, size: z, pressed: ed.overlay }) : nothing}
          ${btn(S.undo, 'undo', () => ed.undo(), { disabled: !ed.hist?.canUndo, keys: 'Control+Z', size: z })}${btn(S.redo, 'redo', () => ed.redo(), { disabled: !ed.hist?.canRedo, keys: 'Control+Shift+Z', size: z })}
          <span class=${`chip meter${zone}`} title=${S.meterTip}>${o.error === 'empty' ? '0.0' : used} / 32 KB · ${S.points(o.points)}${o.bytes >= 4096 && !zone ? html` · ${S.heavy}` : nothing}</span>
          ${button({ label: S.xferMenu, variant: 'secondary', size: z, haspopup: 'menu', expanded: ed.menu?.key === 'xfer', onClick: (e) => ed.xferMenu(e.currentTarget as HTMLElement) })}
          ${ed.mcu ? nothing : html`<button type="button" class=${`btn btn-secondary${sm ? ' btn-sm' : ''}`} aria-disabled=${needLib ? 'true' : nothing} aria-describedby=${needLib ? 'lib-hint' : nothing} aria-keyshortcuts="Control+S" @click=${() => !needLib && ed.openSave()}>${S.saveLib}</button>`}
          ${needLib ? html`<span id="lib-hint" class="sr">${S.libMissing}</span>` : nothing}
          <button type="button" class=${`btn btn-primary${sm ? ' btn-sm' : ''}`} aria-disabled=${why ? 'true' : nothing} aria-describedby=${why ? 'done-why' : nothing} aria-keyshortcuts="Control+Enter" title=${why ?? nothing} @click=${() => ed.done()}>${glyph('check', 18)}${ed.mcu ? S.saveGo : S.done}</button>
          ${why ? html`<span id="done-why" class="sr">${why}</span>` : nothing}
          ${button({ label: S.help, glyph: 'helpCircle', iconOnly: true, size: z, expanded: ed.dlg === 'help', controls: 'help-pop', keys: '?', onClick: () => (ed.dlg = ed.dlg === 'help' ? undefined : 'help') })}`
      : nothing}
  </header>`;
}

/** A banner follows the document: a kit notice with its actions and a Dismiss button where the message can go away. */
function bannerView(ed: McSvgEditor, b: { kind: Banner['kind']; text: string; detail?: string[]; action?: Banner['action']; dismiss?: () => void }): TemplateResult {
  return html`<div class=${`notice ${b.kind}`} role=${b.kind === 'error' ? 'alert' : 'status'}>
    ${glyph(b.kind === 'info' ? 'information' : 'alertCircle', 20)}
    <div class="body">
      <p>${b.text}</p>
      ${b.detail ? html`<details><summary>${S.details}</summary><ul>${b.detail.map((x) => html`<li>${x}</li>`)}</ul></details>` : nothing}
      ${b.action ? html`<div class="actions">${btn(b.action.label, undefined, b.action.run, { text: true })}</div>` : nothing}
    </div>
    ${b.dismiss ? btn(S.dismiss, 'close', b.dismiss) : nothing}
  </div>`;
}

function banners(ed: McSvgEditor): TemplateResult | typeof nothing {
  if (!ed.banners.length && !ed.conflict && !(ed.module && ed.stage === 'edit')) return nothing;
  const facts = ed.module && ed.stage === 'edit' && !ed.noticeGone ? moduleNotice(ed) : nothing;
  return html`<div class="banners">
    ${ed.banners.map((b) => bannerView(ed, { ...b, dismiss: b.id === 'over' || b.id === 'safe' ? undefined : () => (ed.banners = ed.banners.filter((x) => x !== b)) }))}
    ${facts}
    ${ed.conflict
      ? html`<div class="notice warn" role="alert">
          ${glyph('alertCircle', 20)}
          <div class="body"><p>${S.mcuConflict}</p><div class="actions">${btn(S.mcuCopy, undefined, () => void ed.saveMcu(true), { text: true })}${btn(S.mcuReload, undefined, () => ed.reload(), { text: true })}</div></div>
        </div>`
      : nothing}
  </div>`;
}

function moduleNotice(ed: McSvgEditor): TemplateResult {
  const m = ed.module!;
  const lines = [
    m.icon ? S.noteEffects(m.icon) : S.noteEffectsPlain,
    m.hasStateIcons ? S.noteState : '',
    m.pickedAnimation ? S.notePicked : '',
    m.followsIcon ? S.noteFollows : '',
    m.linked ? S.noteLinked : '',
  ].filter(Boolean);
  return bannerView(ed, { kind: 'info', text: lines.join(' '), dismiss: () => (ed.noticeGone = true) });
}

// ── start window ──

function startPanel(ed: McSvgEditor): TemplateResult {
  const tile = (g: GlyphName, name: string, sub: string, on: () => void, pressed?: boolean): TemplateResult =>
    html`<button type="button" class="tile glyph-only" aria-pressed=${pressed === undefined ? nothing : aria(pressed)} @click=${on}>${glyph(g, 24)}<span>${name}</span><span class="meta">${sub}</span></button>`;
  return html`<div class="start">
    <div class="tiles">
      ${tile('squareOutline', S.startBlank, S.startBlankSub, () => ed.begin(ed.blankStart()))}
      ${tile('shapeOutline', S.startIcon, S.startIconSub, () => (ed.startMode = ed.startMode === 'icon' ? undefined : 'icon'), ed.startMode === 'icon')}
      ${tile('contentPaste', S.startPaste, S.startPasteSub, () => (ed.startMode = ed.startMode === 'paste' ? undefined : 'paste'), ed.startMode === 'paste')}
      ${tile('fileOutline', S.startFile, S.startFileSub, () => ed.renderRoot.querySelector<HTMLInputElement>('input[type=file]')?.click())}
      ${ed.libraryMissing ? nothing : tile('bookshelf', S.startLib, S.startLibSub, () => ed.startLibrary())}
    </div>
    <div class="acts">${button({ label: S.importFile, glyph: 'folderOpenOutline', variant: 'secondary', size: 'sm', onClick: (e) => ((ed.startOpen = false), void ed.openTransfer('import', e.currentTarget as HTMLElement)) })}</div>
    <input type="file" accept=".svg,image/svg+xml" hidden @change=${(e: Event) => void ed.startFile((e.target as HTMLInputElement).files?.[0])} />
    ${ed.startMode === 'icon'
      ? html`<form class="startform" @submit=${(e: Event) => {
          e.preventDefault();
          void ed.openIcon((ed.renderRoot.querySelector<HTMLInputElement>('#start-icon')?.value ?? '').trim());
        }}>
          ${field({ id: 'start-icon', label: S.iconField, help: S.iconHelp, control: html`<input id="start-icon" class="input" type="text" placeholder="mdi:lightbulb" autocomplete="off" aria-describedby="start-icon-help" />` })}
          <div class="acts"><button class="btn btn-primary" type="submit">${S.iconUse}</button></div>
        </form>`
      : nothing}
    ${ed.startMode === 'paste'
      ? html`<div class="startform">
          ${field({
            id: 'start-paste',
            label: S.pasteField,
            help: S.pasteCount(kbOf(new TextEncoder().encode(ed.renderRoot.querySelector<HTMLTextAreaElement>('#start-paste')?.value ?? '').length)),
            control: html`<textarea id="start-paste" class="input" rows="6" aria-describedby="start-paste-help" @input=${() => ed.requestUpdate()}></textarea>`,
          })}
          <div class="acts">${btn(S.pasteImport, undefined, () => ed.openSvg(ed.renderRoot.querySelector<HTMLTextAreaElement>('#start-paste')?.value ?? '', S.untitled), { text: true, size: 'md', variant: 'primary' })}</div>
        </div>`
      : nothing}
    ${ed.startError ? html`<p class="help error" role="alert">${ed.startError}</p>` : nothing}
    <p class="help">${S.startHint}</p>
  </div>`;
}

/** The start choices in a kit window: movable, resizable and maximisable like the card editor's pickers. */
function startWindow(ed: McSvgEditor): TemplateResult {
  return html`<mc-ui-window
    variant="dialog"
    size="m"
    heading=${S.startTitle}
    closeLabel=${S.close}
    movable
    resizable
    maximizable
    moveLabel=${S.moveWindow}
    resizeLabel=${S.resizeWindow}
    maximizeLabel=${S.maximize}
    restoreLabel=${S.restore}
    @mc-window-close=${() => ed.startOpen && ed.closeStart()}
  >
    ${startPanel(ed)}
  </mc-ui-window>`;
}

// ── workspace ──

const TOOLS: Array<[Tool, GlyphName, string]> = [
  ['select', 'cursorDefault', 'V'],
  ['node', 'vectorPolylineEdit', 'A'],
  ['pen', 'pen', 'P'],
  ['rect', 'rectangleOutline', 'R'],
  ['ellipse', 'ellipseOutline', 'E'],
  ['line', 'vectorLine', 'L'],
  ['polygon', 'vectorPolygon', 'G'],
  ['shapes', 'shapeOutline', 'S'],
  ['free', 'draw', 'B'],
  ['knife', 'contentCut', 'K'],
  ['hand', 'handBackLeftOutline', 'H'],
];

function rail(ed: McSvgEditor): TemplateResult {
  return toolbar({
    label: S.tools,
    orientation: ed.layout === 'stacked' ? 'horizontal' : 'vertical',
    kind: 'rail',
    items: TOOLS.map(([t, g, k]) => ({
      label: toolName(t),
      glyph: g,
      iconOnly: true,
      pressed: ed.tool === t,
      keys: k,
      haspopup: t === 'shapes' ? ('dialog' as const) : undefined,
      expanded: t === 'shapes' ? ed.picker : undefined,
      onClick: () => (t === 'shapes' && ed.tool === t && ed.picker ? ed.closePicker() : ed.setTool(t)),
    })),
  });
}

// ── shape picker ──

const primD = new Map<PrimitiveKind, string>();
/** The glyph of a kind: the same primitive() outline in a 20 px box, so there is no extra icon art. */
function primGlyph(k: PrimitiveKind, size: number): TemplateResult {
  let d = primD.get(k);
  if (d === undefined) {
    d = toPathString([E.fromEdit(D.primitive(k, { x: 2, y: 2, w: 16, h: 16 }))]);
    primD.set(k, d);
  }
  return html`<svg class="gl" viewBox="0 0 20 20" width=${size} height=${size} aria-hidden="true" focusable="false"><path d=${d} fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"></path></svg>`;
}

function picker(ed: McSvgEditor): TemplateResult {
  const sheet = ed.coarse || ed.layout === 'stacked';
  return html`<div class=${`picker${sheet ? ' sheet' : ''}`} role="dialog" aria-modal="false" aria-labelledby="pick-h">
    <div class="pick-head"><h3 id="pick-h">${S.shapesTitle}</h3>${btn(S.close, 'close', () => ed.closePicker(), { text: sheet })}</div>
    <div @click=${(e: Event) => (e.target as Element).closest('.tile') && ed.closePicker()}>${tiles({ label: S.shapesTitle, value: ed.opts.prim, items: PRIMITIVE_KINDS.map((k) => ({ value: k, label: S.prim[k], preview: primGlyph(k, 28) })), onPick: (k) => ed.pickPrim(k) })}</div>
    <p class="help">${S.shapesHelp}</p>
  </div>`;
}

function workspace(ed: McSvgEditor): TemplateResult {
  const stacked = ed.layout === 'stacked';
  const left = ed.layout === 'wide' || ed.layout === 'mid' || stacked || ed.overlay;
  return html`<div class=${`work${ed.overlay ? ' ov' : ''}`}>
    ${rail(ed)}
    ${ed.picker ? picker(ed) : nothing}
    ${left ? leftPanel(ed) : nothing}
    <section class="center" aria-label=${S.title}>
      ${floatBar(ed)}
      <div
        class=${`stage tool-${ed.tool}`}
        @pointerdown=${ed.cap.down}
        @pointermove=${ed.onStageMove}
        @pointerup=${ed.onStageUp}
        @pointercancel=${ed.onStageUp}
        @keydown=${ed.cap.key}
      >
        ${artLayer(ed)}
        <mc-path-canvas
          underlay
          role="group"
          aria-label=${S.canvasLabel}
          .frame=${ed.doc.vb}
          .paths=${ed.cvPaths}
          .paint=${ed.flat.paint}
          .selection=${ed.cvSelection}
          .mode=${ed.canvasMode}
          .snap=${{ enabled: ed.snapOn, grid: ed.grid, anchors: true, frame: true, safeArea: ed.safeOn }}
          .transform=${ed.transformBox}
          .contextMenu=${ed.tool === 'select' || ed.tool === 'node'}
          .gridStep=${ed.grid}
          .safeArea=${ed.safeOn ? 2 : undefined}
          .pixelGrid=${ed.pixelGrid}
          .maxPaths=${512}
          .kinds=${['corner', 'smooth']}
          @mc-path-change=${ed.onChange}
          @mc-path-select=${ed.onSelect}
          @mc-path-view=${ed.onView}
          @mc-path-limit=${ed.onLimit}
          @mc-path-fields=${ed.onFields}
          @mc-path-transform=${ed.onTransform}
          @mc-path-context=${ed.onContext}
        ></mc-path-canvas>
        ${overLayer(ed)}
        ${ed.doc.shapes.length === 0 && !ed.liveShape ? html`<div class="hint">${empty({ title: S.emptyTitle, text: S.emptyText })}</div>` : nothing}
      </div>
      ${resultNote(ed)}
      ${ed.layout !== 'wide' && ed.layout !== 'mid' ? pointBar(ed) : nothing} ${toolOptions(ed)} ${nudgePad(ed)}
    </section>
    ${inspector(ed)}
  </div>`;
}

function hintFor(ed: McSvgEditor): string {
  switch (ed.tool) {
    case 'select':
      return '';
    case 'node':
      return S.hintNode;
    case 'pen':
      return S.hintPen;
    case 'shapes':
      return S.hintShapes;
    case 'free':
      return S.hintFree;
    case 'hand':
      return S.hintHand;
    case 'knife':
      return S.hintKnife;
    default:
      return S.hintShape;
  }
}

/** The canvas toolbar: zoom, view, then Align, Combine and Path after a divider. Small, borderless buttons (kit `.toolbar`). */
function floatBar(ed: McSvgEditor): TemplateResult {
  const menuBtn = (k: 'align' | 'combine' | 'path'): TemplateResult => {
    const busy = (k === 'combine' && ed.boolBusy) || (k === 'path' && ed.ptBusy);
    const label = k === 'combine' && ed.boolBusy ? S.boolWorking : k === 'align' ? S.alignTitle : k === 'combine' ? S.boolOps.union : S.ptTitle;
    return html`<button type="button" class="btn btn-secondary btn-sm" data-menu=${k} aria-haspopup="menu" aria-expanded=${aria(ed.menu?.key === k)} aria-busy=${busy ? 'true' : nothing} @click=${(e: Event) => ed.toolMenu(k, e.currentTarget as HTMLElement)}>${label}</button>`;
  };
  return html`<div class="toolbar" role="toolbar" aria-label=${S.canvasLabel}>
    ${btn(S.zoomOut, 'minus', () => ed.zoomBy(0.8), { keys: '-' })}<span class="zoom" aria-live="off">${Math.round((ed.view.zoom / (ed.fitZoom || ed.view.zoom || 1)) * 100)}%</span>${btn(S.zoomIn, 'add', () => ed.zoomBy(1.25), { keys: '=' })}${btn(S.zoomFit, 'fitToScreenOutline', () => ed.fitView(), { keys: '0' })}
    <button type="button" class="btn btn-secondary btn-sm" data-pv aria-expanded=${aria(ed.pvOpen)} aria-controls="pv" @click=${() => (ed.pvOpen = !ed.pvOpen)}>${S.preview}</button>
    ${btn(S.gridToggle(ed.grid), 'grid', () => (ed.pixelGrid = !ed.pixelGrid), { pressed: ed.pixelGrid, keys: "Control+'", text: true })}${btn(S.snapOn, 'magnet', () => (ed.snapOn = !ed.snapOn), { pressed: ed.snapOn, keys: 'Control+;' })}
    <span role="separator" aria-orientation="vertical"></span>
    ${menuBtn('align')}${menuBtn('combine')}${menuBtn('path')}
  </div>`;
}

function artLayer(ed: McSvgEditor): TemplateResult {
  const v = ed.view;
  const f = ed.doc.vb;
  const live = ed.liveShape?.shape;
  return html`<svg class="art" aria-hidden="true" style=${ed.mcu ? `--m:${ed.pvMain};--a:${ed.pvAccent}` : '--m: var(--mc-text, #212121); --a: var(--art-accent)'}>
    <g transform=${`translate(${v.x} ${v.y}) scale(${v.zoom})`}>
      <rect class="board" x=${f.x} y=${f.y} width=${f.w} height=${f.h}></rect>
      ${guard([ed.doc.shapes, ed.doc.groups], () => artNodes(ed.doc))}
      ${live ? svg`<g class="ghost">${artNodes({ ...ed.doc, shapes: [live] })}</g>` : nothing}
      ${ed.pt?.res?.doc ? svg`<g class="pvw">${ed.pt.res.prev.map((s) => svg`<path d=${dOf(s)}></path>`)}</g>` : nothing}
    </g>
  </svg>`;
}

function overLayer(ed: McSvgEditor): TemplateResult {
  const v = ed.view;
  const to = (x: number, y: number): [number, number] => [v.x + x * v.zoom, v.y + y * v.zoom];
  const boxes = ed.tool === 'node' || ed.tool === 'pen' || ed.transformBox ? [] : ed.selected.filter((s) => !s.hidden).map((s) => ({ s, b: shapeBox(s) }));
  const l = ed.liveShape;
  return html`<svg class="over" aria-hidden="true">
    ${boxes.map(({ b }) => {
      if (!b) return nothing;
      const [x, y] = to(b.x, b.y);
      return svg`<rect class="selbox" x=${x} y=${y} width=${b.w * v.zoom} height=${b.h * v.zoom}></rect>`;
    })}
    ${l?.from && l.cursor ? svg`<path class="rubber" d=${ed.tool === 'knife' ? `M${to(...l.from).join(' ')}L${to(...l.cursor).join(' ')}` : `M${to(...l.from).join(' ')}L${to(l.cursor[0], l.from[1]).join(' ')}L${to(...l.cursor).join(' ')}L${to(l.from[0], l.cursor[1]).join(' ')}Z`}></path>` : nothing}
    ${l?.cursor ? svg`<path class="cross" d=${`M${to(l.cursor[0], l.cursor[1])[0] - 9} ${to(l.cursor[0], l.cursor[1])[1]}h18M${to(l.cursor[0], l.cursor[1])[0]} ${to(l.cursor[0], l.cursor[1])[1] - 9}v18`}></path>` : nothing}
    ${l?.trail ? svg`<polyline class="trail" points=${l.trail.map((p) => to(p[0], p[1]).join(',')).join(' ')}></polyline>` : nothing}
  </svg>`;
}

// ── tool options, point bar, nudge pad ──

function toolOptions(ed: McSvgEditor): TemplateResult | typeof nothing {
  const o = ed.opts;
  const set = (patch: Partial<typeof o>): void => void (ed.opts = { ...o, ...patch });
  if (ed.tool === 'rect') return html`<div class="opts">${numField('o-radius', S.radiusField, o.r, (n) => set({ r: Math.max(0, n) }), { min: 0 })}</div>`;
  if (ed.tool === 'polygon')
    return html`<div class="opts">
      ${numField('o-sides', S.sidesField, o.sides, (n) => set({ sides: Math.min(24, Math.max(3, Math.round(n))) }), { min: 3, max: 24, step: 1 })}
      ${chk('sw-star', S.starSwitch, o.star, (v) => set({ star: v }))}
      ${o.star ? numField('o-inner', S.innerField, o.inner, (n) => set({ inner: Math.min(0.95, Math.max(0.1, n)) }), { min: 0.1, max: 0.95, step: 0.05 }) : nothing}
    </div>`;
  if (ed.tool === 'pen') return html`<div class="opts">${btn(S.finishPath, undefined, () => ed.finishPath(), { text: true })}</div>`;
  return nothing;
}

function pointFields(ed: McSvgEditor, prefix: string, field?: string, back?: () => void): TemplateResult | typeof nothing {
  const c = ed.pointCtx;
  if (!c) return nothing;
  const a = c.a;
  return html`${segc(S.kind, c.kind, [['corner', S.kindCorner], ['smooth', S.kindSmooth]], (k) => ed.setKind(k))}
    <div class="grid2">
      ${numField(`${prefix}-x`, S.fieldX, a.x, (n) => ed.editPoint((p, i) => E.moveAnchor(p, i, n, p.anchors[i].y), 'Move point', 'px'), { field, back })}
      ${numField(`${prefix}-y`, S.fieldY, a.y, (n) => ed.editPoint((p, i) => E.moveAnchor(p, i, p.anchors[i].x, n), 'Move point', 'py'), { back })}
    </div>`;
}

function pointBar(ed: McSvgEditor): TemplateResult | typeof nothing {
  const c = ed.pointCtx;
  if (!c) return nothing;
  return html`<div class="pointbar" role="group" aria-label=${S.pointTitle}>
    <strong>${S.pointOf(c.i + 1, c.p.anchors.length)}</strong>
    ${btn(S.prev, undefined, () => ed.stepPoint(-1), { text: true })}${btn(S.next, undefined, () => ed.stepPoint(1), { text: true })}
    ${pointFields(ed, 'pb', 'pxb', () => ed.canvas()?.focusAnchor(c.pathIndex, c.i))}
  </div>`;
}

function nudgePad(ed: McSvgEditor): TemplateResult | typeof nothing {
  if (!ed.coarse || !ed.nudgePad || (ed.tool !== 'node' && ed.tool !== 'select') || (!ed.pointCtx && !ed.sel.length)) return nothing;
  const k = (g: GlyphName, label: string, dx: number, dy: number) => btn(label, g, () => ed.nudge(dx, dy), { size: 'md' });
  return html`<div class="pad" role="group" aria-label=${S.nudgeLabel}>
    ${k('arrowLeft', S.nudgeLeft, -1, 0)}${k('arrowUp', S.nudgeUp, 0, -1)}${k('arrowDown', S.nudgeDown, 0, 1)}${k('arrowRight', S.nudgeRight, 1, 0)}
    ${chk('sw-big', S.nudgeStep, ed.nudgeBig, (v) => (ed.nudgeBig = v))}
  </div>`;
}

// ── left panel ──

function leftPanel(ed: McSvgEditor): TemplateResult {
  return html`<aside class=${`left${ed.overlay ? ' sheet' : ''}`} aria-label=${S.panelTabs} role=${ed.overlay ? 'dialog' : nothing} aria-modal=${ed.overlay ? 'false' : nothing}>
    ${ed.overlay ? html`<div class="sheet-head">${btn(S.close, 'close', () => (ed.overlay = false))}</div>` : nothing}
    ${seg({ role: 'radiogroup', label: S.panelTabs, full: true, value: ed.panel, items: [{ value: 'layers', label: S.layers }, { value: 'library', label: S.library }], onChange: (p) => ed.openPanel(p) })}
    ${ed.panel === 'layers' ? layersPanel(ed) : libraryPanel(ed)}
  </aside>`;
}

function layersPanel(ed: McSvgEditor): TemplateResult {
  const some = ed.sel.length > 0;
  const one = subject(ed);
  const blocked = groupBlocked(ed);
  return html`<div class="layers">
    ${ed.doc.shapes.length ? layerTree(ed) : html`<p class="help">${S.layersEmpty}</p>`}
    <div class="acts">
      ${btn(S.groupAdd, 'group', () => ed.group(), { disabled: ed.sel.length < 2 || blocked })}${btn(S.duplicate, 'contentCopy', () => ed.duplicate(), { disabled: !some, keys: 'Control+D' })}${btn(S.remove, 'delete', () => ed.deleteSelected(), { disabled: !some })}
      ${btn(S.selectAll, 'selectAll', () => ed.select(ed.doc.shapes.map((x) => x.id)), { keys: 'Control+A' })}${button({ label: S.moveTo, glyph: 'swapVertical', iconOnly: true, size: 'sm', haspopup: 'menu', expanded: !!ed.menu && ed.menu.opener.getAttribute('aria-label') === S.moveTo, disabledReason: one ? undefined : S.moveTo, onClick: (e) => one && ed.moveMenuOpen(e.currentTarget as HTMLElement) })}
      ${btn(S.moveUp, 'arrowUp', () => one && ed.reorder(one, 1), { disabled: !one })}${btn(S.moveDown, 'arrowDown', () => one && ed.reorder(one, -1), { disabled: !one })}
    </div>
    ${blocked ? html`<p class="help">${S.groupDepth}</p>` : nothing}
    <p class="help">${S.layerMove}</p>
  </div>`;
}

function libraryPanel(ed: McSvgEditor): TemplateResult {
  const l = ed.lib;
  if (ed.libraryMissing)
    return html`<div class="libmsg"><p>${S.libMissing}</p><div class="acts"><a class="btn btn-secondary btn-sm" href="https://github.com/therealmcsparrow/magic-card-utils" target="_blank" rel="noopener">${S.libHow}</a>${btn(S.libCopySvg, 'contentCopy', () => ed.copySvg(), { text: true })}</div></div>`;
  if (l.state === 'idle' || l.state === 'loading') return html`<p class="help" role="status">${S.libLoading}</p>`;
  if (l.state === 'readonly' || l.state === 'unreachable' || l.state === 'invalid' || l.state === 'conflict' || l.state === 'full')
    return html`<div class="libmsg"><p role="alert">${S.libUnreachable}</p><div class="acts">${btn(S.retry, undefined, () => void ed.loadLib(), { text: true })}${btn(S.libCopySvg, 'contentCopy', () => ed.copySvg(), { text: true })}</div></div>`;
  const q = l.q.trim().toLowerCase();
  const items = l.items
    .filter((i) => !q || i.name.toLowerCase().includes(q) || i.id.includes(q))
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  return html`<div class="lib">
    <p class="help">${S.libRule}</p>
    ${field({ id: 'lib-search', label: S.libSearch, control: html`<input id="lib-search" class="input" type="search" placeholder=${S.libSearch} .value=${l.q} @input=${(e: Event) => (ed.lib = { ...ed.lib, q: (e.target as HTMLInputElement).value })} />` })}
    ${l.items.length === 0
      ? html`<p class="help" role="status">${S.libEmpty}</p>`
      : items.length === 0
        ? html`<p class="help" role="status">${S.libNoMatch(l.q)}</p>`
        : html`<div class="rows" role="list">
            ${items.map((i) =>
              row({
                id: i.id,
                name: i.name,
                content: html`<span class="name" title=${i.id}>${i.name}</span>`,
                trail: html`<span class="acts"><button type="button" class="btn btn-text btn-sm" title=${S.libInsertTip(i.name)} aria-label=${`${S.libInsert} ${i.name}`} @click=${() => void ed.insertIcon(i.id)}>${S.libInsert}</button>${button({ label: S.libDelete(i.name), glyph: 'delete', iconOnly: true, size: 'sm', onClick: () => ed.removeIcon(i.id) })}</span>`,
              }),
            )}
          </div>`}
    ${btn(S.libSaveCurrent, undefined, () => ed.openSave(), { text: true, disabled: !!ed.out.error })}
    <p class="help">${S.libStored}</p>
    ${ed.deleted ? notice({ tone: 'info', text: S.libDeleted(ed.deleted.item.name), action: { label: S.undoAction, onClick: () => ed.undoDelete() }, transient: true }) : nothing}
  </div>`;
}

// ── inspector ──

function inspector(ed: McSvgEditor): TemplateResult {
  const sel = ed.selected;
  return html`<aside class="insp" aria-label=${S.inspector}>
    ${ed.pointCtx ? pointSection(ed) : nothing}
    ${sel.length ? shapeSections(ed, sel) : html`${ed.pt ? pathSection(ed) : nothing}${documentSection(ed)}`}
  </aside>`;
}

function gridChips(ed: McSvgEditor): TemplateResult {
  const items: Array<[string, string]> = [...GRID_CHIPS.map((g): [string, string] => [String(g), String(g)]), ['custom', S.gridCustom]];
  const cur = ed.gridCustom ? 'custom' : GRID_CHIPS.includes(ed.grid) ? String(ed.grid) : 'custom';
  const pickChip = (k: string): void => {
    if (k === 'custom') {
      ed.gridCustom = true;
      ed.gridMsg = undefined;
    } else ed.setGrid(parseFloat(k));
  };
  return html`<div class="field">
    <div class="field-head"><span id="gs-l" class="lbl">${S.gridChips}</span></div>
    ${segc(S.gridChips, cur, items, pickChip)}
    ${cur === 'custom'
      ? field({
          id: 'grid-custom',
          label: S.gridCustomField,
          control: html`<span class="row-u"
            ><input id="grid-custom" class="input" type="number" inputmode="decimal" step="0.05" min=${GRID_MIN} max=${GRID_MAX} data-field="grid-custom" aria-invalid=${ed.gridMsg?.error ? 'true' : 'false'} aria-describedby="gs-m" .value=${fmt(ed.grid)} @input=${(e: Event) => ed.typeGrid((e.target as HTMLInputElement).value, false)} @change=${(e: Event) => {
              const el = e.target as HTMLInputElement;
              ed.typeGrid(el.value, true);
              if (!ed.gridMsg?.error) el.value = fmt(ed.grid);
            }} /><span>${S.gridUnits}</span></span
          >`,
        })
      : nothing}
    <p id="gs-m" class=${`help${ed.gridMsg?.error ? ' error' : ''}`} role=${ed.gridMsg?.error ? 'alert' : nothing}>${ed.gridMsg ? ed.gridMsg.text : ed.snapOn ? S.gridHelp : S.gridHelpOff}</p>
  </div>`;
}

function documentSection(ed: McSvgEditor): TemplateResult {
  return html`${group(
      S.docTitle,
      html`<p class="help">${S.noneSelected}</p>
        ${dualSwitch(ed)} ${gridChips(ed)}
        ${chk('sw-safe', S.safeArea, ed.safe, (v) => { ed.safe = v; ed.checks(); })}
        ${chk('sw-nudge', S.nudgePad, ed.nudgePad, (v) => (ed.nudgePad = v))}`,
      3,
    )}
    ${group(
      S.tidy,
      html`${pick('tidy-decimals', S.tidyPrecision, ed.decimals, [0, 1, 2, 3].map((k) => [k, String(k)]), (v) => { ed.decimals = parseInt(v, 10); ed.refresh(); })}
        <p class="help">${S.tidyHelp}</p>
        ${ed.out.bytes >= 24 * 1024 ? html`<p class="help error">${S.getting}</p><div class="acts">${btn(S.tidyNow, undefined, () => ed.tidyNow(), { text: true })}</div>` : nothing}`,
    )}`;
}

function pathSection(ed: McSvgEditor): TemplateResult {
  const p = ed.pt!;
  return p.c.renderPanel(panelState(p), { change: (x) => change(ed, x), apply: () => apply(ed), cancel: () => cancel(ed) }) as TemplateResult;
}

/** The result of an action: a kit notice with Undo (or Try again), cleared by the next edit. */
function resultNote(ed: McSvgEditor): TemplateResult | typeof nothing {
  const n = ed.note;
  if (!n) return nothing;
  return notice({ tone: n.tone, text: n.lines, action: n.action ? { label: n.action.label, onClick: () => n.action!.run() } : undefined, transient: true });
}

/** A button that stays focusable when unavailable; the editor says why when it is pressed. */
function abtn(label: string, g: GlyphName, on: () => void, off: boolean): TemplateResult {
  return btn(label, g, on, { text: true, disabled: off });
}

function arrangeRow(ed: McSvgEditor): TemplateResult {
  const hows: Array<[SvgArrange, GlyphName]> = [['front', 'arrangeBringToFront'], ['forward', 'arrangeBringForward'], ['backward', 'arrangeSendBackward'], ['back', 'arrangeSendToBack']];
  return html`<div class="acts arr">${hows.map(([h, g]) => abtn(S.arrange[h], g, () => ed.arrange(h), !ed.canArrange(h)))}</div>`;
}

function shapeSections(ed: McSvgEditor, sel: Shape[]): TemplateResult {
  const one = sel.length === 1 ? sel[0] : undefined;
  const b = ed.unionBox;
  const locked = sel.every((s) => s.locked);
  const first = sel[0];
  const off = { disabled: locked };
  return html`${group(
      one ? one.name : S.shapes(sel.length),
      one ? field({ id: 'sh-name', label: S.rename, control: html`<input id="sh-name" class="input" type="text" .value=${one.name} @change=${(e: Event) => ed.renameShape(one.id, (e.target as HTMLInputElement).value)} />` }) : nothing,
      3,
    )}
    ${group(
      S.posSize,
      html`<div class="grid2">
          ${numField('sh-x', S.fieldX, b?.x, (n) => ed.setBox({ x: n }, 'Move'), off)}${numField('sh-y', S.fieldY, b?.y, (n) => ed.setBox({ y: n }, 'Move'), off)}
          ${numField('sh-w', S.fieldW, b?.w, (n) => ed.setBox({ w: n }, 'Resize'), { ...off, min: 0.1 })}${numField('sh-h', S.fieldH, b?.h, (n) => ed.setBox({ h: n }, 'Resize'), { ...off, min: 0.1 })}
          ${numField('sh-angle', S.fieldAngle, one?.angle ?? 0, (n) => ed.setAngle(n), { disabled: locked || !one, step: 1 })}
        </div>
        ${chk('sw-ratio', S.lockRatio, ed.lockRatio, (v) => (ed.lockRatio = v))}
        <div class="acts">
          ${btn(S.rotMinus, 'rotateLeft', () => ed.rotate(-15), off)}${btn(S.rotPlus, 'rotateRight', () => ed.rotate(15), off)}${btn(S.rotCcw, 'rotateLeftVariant', () => ed.rotate(-90), off)}${btn(S.rotCw, 'rotateRightVariant', () => ed.rotate(90), off)}
          ${btn(S.flipH, 'flipHorizontal', () => ed.flip('h'), { ...off, keys: 'Shift+H' })}${btn(S.flipV, 'flipVertical', () => ed.flip('v'), { ...off, keys: 'Shift+V' })}
        </div>`,
    )}
    ${ed.pt ? pathSection(ed) : nothing}
    ${one && (one.type === 'rect' || one.type === 'polygon' || one.type === 'star')
      ? group(
          S.typeOptions,
          html`${one.type === 'rect' ? numField('to-r', S.radiusField, one.r ?? 0, (n) => ed.option({ r: Math.max(0, n) }), { min: 0 }) : numField('to-sides', S.sidesField, one.sides ?? 5, (n) => ed.option({ sides: Math.min(24, Math.max(3, Math.round(n))) }), { min: 3, max: 24, step: 1 })}
          ${one.type === 'star' ? numField('to-inner', S.innerField, one.inner ?? 0.5, (n) => ed.option({ inner: Math.min(0.95, Math.max(0.1, n)) }), { min: 0.1, max: 0.95, step: 0.05 }) : nothing}`,
        )
      : nothing}
    ${group(
      S.fillAndStroke,
      html`${dualSwitch(ed)}
        <div class="field"><div class="field-head"><span class="lbl">${S.fill}</span></div>${segc(S.fill, first.fill, paintItems(ed.dualOn), (v) => ed.setPaint('fill', v))}</div>
        <div class="field"><div class="field-head"><span class="lbl">${S.stroke}</span></div>${segc(S.stroke, first.stroke, paintItems(ed.dualOn), (v) => ed.setPaint('stroke', v))}</div>
        <p class="help">${S.paintHelp}</p>
        ${first.stroke !== 'none'
          ? html`<div class="grid2">
              ${numField('st-w', S.strokeWidth, first.width, (n) => ed.patch({ width: Math.max(0.1, n) }, 'Stroke width', 'sw'), { min: 0.1, step: 0.25 })}
              ${pick('st-cap', S.cap, first.cap, [['butt', S.capButt], ['round', S.capRound], ['square', S.capSquare]], (v) => ed.patch({ cap: v as Shape['cap'] }, 'Stroke cap'))}
              ${pick('st-join', S.join, first.join, [['miter', S.joinMiter], ['round', S.joinRound], ['bevel', S.joinBevel]], (v) => ed.patch({ join: v as Shape['join'] }, 'Stroke join'))}
            </div>`
          : nothing}`,
    )}
    ${group(
      S.layerSection,
      html`${arrangeRow(ed)}
        ${pick('ly-rule', S.fillRule, first.rule, [['nonzero', S.ruleNonzero], ['evenodd', S.ruleEvenodd]], (v) => ed.patch({ rule: v as Shape['rule'] }, 'Fill rule'))}
        <p class="help">${S.ruleHelp}</p>
        ${chk('sw-hidden', S.hidden, !!first.hidden, (v) => ed.patch({ hidden: v }, 'Hide'))}
        ${chk('sw-locked', S.locked, !!first.locked, (v) => ed.patch({ locked: v }, 'Lock'))}`,
    )}`;
}

function pointSection(ed: McSvgEditor): TemplateResult {
  const c = ed.pointCtx!;
  const a = c.a;
  const hand = (which: 'in' | 'out'): TemplateResult | typeof nothing => {
    const h = a[which];
    if (!h) return nothing;
    const name = which === 'out' ? S.handleOut : S.handleIn;
    const ang = (Math.atan2(h[1] - a.y, h[0] - a.x) * 180) / Math.PI;
    const len = Math.hypot(h[0] - a.x, h[1] - a.y);
    const set = (angle: number, length: number): void => {
      const r = (angle * Math.PI) / 180;
      ed.editPoint((p, i) => E.setHandle(p, i, which, [a.x + Math.cos(r) * length, a.y + Math.sin(r) * length]), 'Move handle', which);
    };
    return html`<div class="grid2">${numField(`pt-${which}-a`, S.angleOf(name), ang, (n) => set(n, len), { step: 1 })}${numField(`pt-${which}-l`, S.lengthOf(name), len, (n) => set(ang, Math.max(0.01, n)), { min: 0.01 })}</div>`;
  };
  return group(
    S.pointTitle,
    html`<p class="help">${S.pointOf(c.i + 1, c.p.anchors.length)}</p>
      ${pointFields(ed, 'pt', 'px', () => ed.canvas()?.focusAnchor(c.pathIndex, c.i))}${hand('out')}${hand('in')}
      <div class="acts">
        ${btn(S.prev, undefined, () => ed.stepPoint(-1), { text: true })}${btn(S.next, undefined, () => ed.stepPoint(1), { text: true })}
        ${btn(S.pointAdd, 'add', () => ed.addAfter(), { text: true, disabled: !ed.canAddPoint })}${btn(S.pointDelete, 'delete', () => ed.deletePoint(), { text: true })}
        ${btn(c.p.closed ? S.pathOpen : S.pathClose, undefined, () => ed.editPoint((p) => E.setClosed(p, !p.closed), 'Close path'), { text: true })}${btn(S.pathReverse, undefined, () => ed.editPoint((p) => E.reverse(p), 'Reverse'), { text: true })}
      </div>`,
    3,
  );
}

// ── the preview popover ──

function previews(ed: McSvgEditor): TemplateResult {
  const c = PREVIEW[ed.pvTheme];
  const doc = ed.base;
  const ha = ed.ha;
  const tile = (px: number): TemplateResult =>
    html`<div class="pv-tile" style=${`background:${c.ground};--m:${ed.mcu ? ed.pvMain : c.m};--a:${ed.mcu ? ed.pvAccent : c.a}`} role="img" aria-label=${S.pvSize(px)}>
      ${guard([doc.shapes, doc.groups, ed.pvTheme, px], () => html`<svg viewBox=${viewBox(doc)} width=${px} height=${px} aria-hidden="true">${artNodes(doc)}</svg>`)}
    </div>`;
  const haTile = (px: number): TemplateResult =>
    html`<div class="pv-tile" style=${`background:${c.ground};color:${ed.mcu ? ed.pvMain : c.m}`} role="img" aria-label=${S.pvHaSize(px)}>
      ${ha && !ha.empty ? html`<svg viewBox=${ha.viewBox} width=${px} height=${px} aria-hidden="true">${ha.secondary ? svg`<path d=${ha.secondary} fill="currentColor" opacity=${HA_SECONDARY_OPACITY}></path>` : nothing}${ha.path ? svg`<path d=${ha.path} fill="currentColor" fill-rule="nonzero"></path>` : nothing}</svg>` : nothing}
    </div>`;
  const warn = ha && haWarns(ha);
  const colour = (id: string, label: string, v: string, on: (v: string) => void): TemplateResult =>
    field({ id, label, control: html`<input id=${id} type="color" class="swatch" .value=${v} @input=${(e: Event) => on((e.target as HTMLInputElement).value)} />` });
  return html`<div class="pv">
    ${segc(S.preview, ed.pvTheme, [['light', S.pvLight], ['dark', S.pvDark], ['on', S.pvOn], ['off', S.pvOff]] as Array<['light' | 'dark' | 'on' | 'off', string]>, (t) => (ed.pvTheme = t))}
    ${ed.mcu ? html`<div class="acts">${colour('pv-main', S.pvMainColour, ed.pvMain, (v) => (ed.pvMain = v))}${colour('pv-accent', S.pvAccentColour, ed.pvAccent, (v) => (ed.pvAccent = v))}</div>` : nothing}
    <div class="pv-g pv-mc"><span class="help">${S.pvMc}</span><div class="pv-row">${tile(24)}${tile(48)}${tile(96)}</div></div>
    <div class="pv-g pv-ha"><span class="help" title=${S.pvHaTip}>${S.pvHa}</span><div class="pv-row">${[24, 48].map(haTile)}</div></div>
    ${warn ? notice({ tone: 'warn', text: ha.empty ? S.haWarnEmpty : S.haWarn }) : nothing}
  </div>`;
}

function previewPop(ed: McSvgEditor): TemplateResult {
  return html`<mc-ui-popover id="pv" label=${S.preview} .align=${'start'} @mc-popover-close=${() => (ed.pvOpen = false)}>${previews(ed)}</mc-ui-popover>`;
}

function helpPop(ed: McSvgEditor): TemplateResult {
  return html`<mc-ui-popover id="help-pop" label=${S.help} .align=${'end'} @mc-popover-close=${() => ed.dlg === 'help' && (ed.dlg = undefined)}>
    <div class="pop-body" tabindex="-1">
      <h2 class="title">${S.help}</h2>
      <ul class="help-list">${hintFor(ed) ? html`<li>${hintFor(ed)}</li>` : nothing}${S.helpKeys.map((x) => html`<li>${x}</li>`)}</ul>
    </div>
  </mc-ui-popover>`;
}

// ── windows ──

function saveWin(ed: McSvgEditor): TemplateResult {
  const name = ed.saveName.trim();
  const target = ed.updateTarget();
  const clash = !!target && target.name.toLowerCase() === name.toLowerCase();
  const mode = target ? 'update' : 'new';
  const go = (m: 'update' | 'new'): void => void ed.saveToLibrary(m);
  const bytes = ed.out.svg ? new TextEncoder().encode(ed.out.svg).length : 0;
  return html`<mc-ui-window variant="dialog" size="m" heading=${S.saveTitle} closeLabel=${S.close} @mc-window-close=${() => ed.dlg === 'save' && (ed.dlg = undefined)}>
    <div class="dlg" @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && (e.target as HTMLInputElement).type === 'text' && (e.preventDefault(), go(mode))}>
      ${field({
        id: 'save-name',
        label: S.saveName,
        help: `${S.saveNameHelp} ${S.saveUsedAs(target?.id ?? freeId(name, new Set(ed.lib.items.map((i) => i.id))))}`,
        control: html`<input id="save-name" class="input" type="text" maxlength="60" .value=${ed.saveName} aria-describedby="save-name-help save-err" aria-invalid=${ed.saveError ? 'true' : 'false'} @input=${(e: Event) => { ed.saveName = (e.target as HTMLInputElement).value; ed.saveError = ''; }} />`,
      })}
      <p id="save-err" class="help error" role="alert" ?hidden=${!ed.saveError}>${ed.saveError}</p>
      ${target ? notice({ tone: 'warn', text: [clash ? S.saveExists(target.name) : '', S.saveUpdateWarn(target.name)].filter(Boolean) }) : nothing}
      ${chk('sw-keep', `${S.saveKeep} (${S.saveKeepSize(kbOf(bytes))})`, ed.keepCopy, (v) => (ed.keepCopy = v), S.saveKeepHelp)}
    </div>
    <div slot="footer" class="foot">
      ${btn(S.saveCancel, undefined, () => (ed.dlg = undefined), { text: true, size: 'md' })}
      ${target && !clash ? btn(S.saveNew, undefined, () => go('new'), { text: true, size: 'md', disabled: ed.saveBusy }) : nothing}
      ${btn(target ? S.saveUpdate(target.name) : S.saveGo, undefined, () => go(mode), { text: true, size: 'md', variant: 'primary', disabled: ed.saveBusy })}
    </div>
  </mc-ui-window>`;
}

function leaveWin(ed: McSvgEditor): TemplateResult {
  const body = ed.mcu ? S.mcuLeaveBody : ed.savedCurrent ? `${S.leaveBody} ${S.leaveSaved}` : S.leaveBody;
  return confirm(
    ed.mcu ? S.mcuLeaveTitle : S.leaveTitle,
    html`<p>${body}</p>`,
    html`${btn(S.leaveKeep, undefined, () => (ed.leaving = false), { text: true, size: 'md' })}
      ${btn(ed.mcu ? S.mcuLeave : S.leaveDiscard, undefined, () => ed.leave(), { text: true, size: 'md', variant: 'danger' })}
      ${ed.mcu ? nothing : btn(S.leaveUse, undefined, () => ed.done(), { text: true, size: 'md', variant: 'primary', disabled: !!ed.blockReason })}`,
    () => (ed.leaving = false),
    'm',
  );
}

function newWin(ed: McSvgEditor): TemplateResult {
  return confirm(
    S.newAsk,
    html`<p>${S.newBody}</p>`,
    html`${btn(S.newKeep, undefined, () => ed.closeNew(), { text: true, size: 'md' })}${btn(S.newGo, undefined, () => ed.confirmNew(), { text: true, size: 'md', variant: 'danger' })}`,
    () => ed.newAsk && ed.closeNew(),
  );
}

void byId;
