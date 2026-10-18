import { html, nothing, svg, type TemplateResult } from 'lit';
import { guard } from 'lit/directives/guard.js';
import type { TransferItem } from '../contracts/preset-transfer';
import { toPathString } from '../path/core';
import { D, E } from './bind';
import { PRIMITIVE_KINDS, type PrimitiveKind } from '../contracts/path-model';
import { HA_SECONDARY_OPACITY, type SvgArrange } from '../contracts/svg-editor';
import { haWarns } from './ha';
import { groupBlocked, layerTree, subject } from './layers';
import { glyph, type GlyphName } from './icons';
import { byId, isOff, round2, shapeBox, type Doc, type Paint, type Shape } from './model';
import type { McSvgEditor } from './mc-svg-editor';
import { apply, cancel, change, panelState } from './pathtools';
import { GRID_CHIPS, GRID_MAX, GRID_MIN, kbOf, toolName } from './mc-svg-editor';
import { freeId } from './library';
import { S } from './strings';
import type { Tool } from './tools';

/* The editor's templates: plain functions of the editor element (state lives there). */

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

// ── small pieces ──

function btn(label: string, glyphName: GlyphName | undefined, on: () => void, o: { cls?: string; disabled?: boolean; pressed?: boolean; text?: boolean; tip?: string; keys?: string } = {}): TemplateResult {
  return html`<button
    type="button"
    class=${`b ${o.cls ?? ''}`}
    aria-label=${o.text ? nothing : label}
    title=${o.tip ?? (o.text ? nothing : label)}
    aria-keyshortcuts=${o.keys ?? nothing}
    aria-pressed=${o.pressed === undefined ? nothing : aria(o.pressed)}
    aria-disabled=${o.disabled ? 'true' : nothing}
    @click=${() => !o.disabled && on()}
  >
    ${glyphName ? glyph(glyphName, 18) : nothing}${o.text ? html`<span>${label}</span>` : nothing}
  </button>`;
}

function numField(label: string, v: number | undefined, on: (n: number) => void, o: { field?: string; min?: number; max?: number; step?: number; disabled?: boolean; back?: () => void; hint?: string } = {}): TemplateResult {
  const set = (e: Event): void => {
    const el = e.target as HTMLInputElement;
    const n = parseFloat(el.value);
    if (Number.isFinite(n)) on(n);
    else el.value = v === undefined ? '' : fmt(v);
  };
  return html`<label class="f"
    ><span>${label}</span
    ><input
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
  /></label>`;
}

function seg<T extends string>(label: string, value: T, items: Array<[T, string]>, on: (v: T) => void): TemplateResult {
  return html`<div class="seg" role="radiogroup" aria-label=${label}>
    ${items.map(
      ([k, text]) =>
        html`<button type="button" role="radio" aria-checked=${aria(k === value)} tabindex=${k === value ? 0 : -1} @click=${() => on(k)} @keydown=${(e: KeyboardEvent) => segKey(e, items, k, on)}>${text}</button>`,
    )}
  </div>`;
}

const chk = (label: string, on: boolean, set: (v: boolean) => void): TemplateResult =>
  html`<label class="switch"><input type="checkbox" .checked=${on} @change=${(e: Event) => set((e.target as HTMLInputElement).checked)} /><span>${label}</span></label>`;

const pick = (label: string, v: string | number, items: Array<[string | number, string]>, set: (v: string) => void): TemplateResult =>
  html`<label class="f"><span>${label}</span><select @change=${(e: Event) => set((e.target as HTMLSelectElement).value)}>${items.map(([k, t]) => html`<option value=${k} ?selected=${k === v}>${t}</option>`)}</select></label>`;

function segKey<T extends string>(e: KeyboardEvent, items: Array<[T, string]>, k: T, on: (v: T) => void): void {
  const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
  if (!d) return;
  e.preventDefault();
  const i = (items.findIndex((x) => x[0] === k) + d + items.length) % items.length;
  on(items[i][0]);
  (e.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>('button')[i]?.focus();
}

const paintItems = (dual: boolean): Array<[Paint, string]> => [
  ['none', S.paintNone],
  ['main', S.paintMain],
  ...(dual ? [['accent', S.paintAccent] as [Paint, string]] : []),
];

/** The icon-level Dual-tone switch: Main and Accent over the same paint. */
const dualSwitch = (ed: McSvgEditor): TemplateResult =>
  html`<label class="switch"><input type="checkbox" data-dual .checked=${ed.dualOn} @change=${(e: Event) => {
    const i = e.target as HTMLInputElement;
    ed.toggleDual(i.checked);
    i.checked = ed.dualOn;
  }} /><span>${S.dualTone}</span></label><p class="help">${S.dualHelp}</p>`;

function singlePop(ed: McSvgEditor): TemplateResult {
  return html`<div class="pop single" role="alertdialog" aria-label=${S.singleAsk(ed.accentCount)}>
    <p><strong>${S.singleAsk(ed.accentCount)}</strong></p>
    <div class="acts end">
      ${btn(S.singleKeep, undefined, () => ed.closeSingle(), { text: true })}
      ${btn(S.singleGo, undefined, () => ed.singleTone(), { text: true, cls: 'primary' })}
    </div>
  </div>`;
}

function xferLayer(ed: McSvgEditor): TemplateResult {
  const x = ed.xfer!;
  return html`<div class="xfer" role="dialog" aria-modal="true" aria-label=${x.mode === 'export' ? S.exportFile : S.importFile} @keydown=${(e: Event) => e.stopPropagation()}>
    <mc-transfer-panel .host=${'svg-editor'} .mode=${x.mode} .exportItems=${x.items ? { kind: 'icon', items: x.items } : undefined} .hasLibrary=${!ed.libraryMissing}
      @mc-transfer-close=${() => ed.closeTransfer()} @mc-transfer-import=${(e: CustomEvent<{ items: TransferItem[] }>) => (e.stopPropagation(), ed.importItems(e.detail.items))}></mc-transfer-panel>
  </div>`;
}

// ── the layer ──

export function renderEditor(ed: McSvgEditor): TemplateResult {
  return html`<div class="layer" role="dialog" aria-modal="true" aria-label=${S.title} data-layout=${ed.layout} @keydown=${ed.onKey} @keyup=${ed.onKeyUp}>
    <span class="sentinel" tabindex="0" @focus=${() => ed.wrapFocus(true)}></span>
    ${skipLinks(ed)} ${topBar(ed)} ${banners(ed)}
    ${ed.stage === 'edit' ? workspace(ed) : ed.stage === 'loading' ? html`<p class="center-msg" role="status">${S.loading}</p>` : html`<div class="center-msg" role="alert"><p>${S.loadFail}</p>${btn(S.retry, undefined, () => void ed.start(), { text: true, cls: 'primary' })}</div>`}
    ${ed.startOpen ? startDialog(ed) : nothing}
    ${ed.dlg === 'save' ? savePop(ed) : nothing} ${ed.dlg === 'help' ? helpPop(ed) : nothing} ${ed.dlg === 'single' ? singlePop(ed) : nothing} ${ed.leaving ? leavePop(ed) : nothing} ${ed.xfer ? xferLayer(ed) : nothing} ${toast(ed)}
    ${ed.menu ? html`<mc-path-menu .items=${ed.menu.items} .label=${ed.menu.key === 'xfer' ? S.xferMenu : ed.menu.key ? ed.menu.opener.textContent!.trim() : S.shapeActions} .at=${ed.menu.at} .touch=${ed.menu.touch} .opener=${ed.menu.opener} @mc-menu-pick=${ed.onPick} @mc-menu-close=${ed.onMenuClose}></mc-path-menu>` : nothing}
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
    <button type="button" @click=${go('mc-path-canvas')}>${S.skipCanvas}</button>
    ${ed.pointCtx ? html`<button type="button" @click=${go('[data-field="px"]')}>${S.skipPoint}</button>` : nothing}
    <button type="button" @click=${go('.insp input, .insp button')}>${S.skipInspector}</button>
  </nav>`;
}

function topBar(ed: McSvgEditor): TemplateResult {
  const edit = ed.stage === 'edit';
  const blocked = ed.blockReason;
  const o = ed.out;
  const used = kbOf(o.bytes);
  const zone = o.error === 'over' ? 'is-error' : o.bytes >= 24 * 1024 ? 'is-warn' : '';
  const needLib = ed.libraryMissing && !ed.mcu;
  const why = ed.mcu && edit && !ed.doc.name.trim() ? S.nameNeeded : blocked;
  return html`<header class="top" role="toolbar" aria-label=${S.title}>
    ${btn(ed.mcu ? S.close : S.back, 'back', () => ed.back(), { text: true, cls: 'ghost' })}
    <h2>${S.title}</h2>
    ${edit ? html`<button type="button" class="b new-btn" @click=${(e: Event) => ed.openStart(e.currentTarget as HTMLElement)}><span>${S.startNew}</span></button>` : nothing}
    ${edit
      ? html`<label class="nm-field"
          ><span class="sr">${S.nameLabel}</span
          ><input class="name" type="text" maxlength="80" aria-required=${ed.mcu ? 'true' : nothing} title=${S.nameTip} .value=${ed.doc.name} @change=${(e: Event) => ed.apply({ ...ed.doc, name: (e.target as HTMLInputElement).value }, 'Rename icon', 'name')} />
          ${ed.saved ? html`<small class="mark">${ed.savedCurrent ? S.savedMark : S.changedMark}</small>` : nothing}</label
        >`
      : nothing}
    <span class="grow"></span>
    ${edit
      ? html`${ed.layout === 'compact' ? btn(ed.panel === 'layers' ? S.layers : S.library, undefined, () => (ed.overlay = !ed.overlay), { text: true, cls: 'ghost', pressed: ed.overlay }) : nothing}
          ${btn(S.undo, 'undo', () => ed.undo(), { disabled: !ed.hist?.canUndo, keys: 'Control+Z' })}${btn(S.redo, 'redo', () => ed.redo(), { disabled: !ed.hist?.canRedo, keys: 'Control+Shift+Z' })}
          <span class=${`chip meter ${zone}`} title=${S.meterTip}>${o.error === 'empty' ? '0.0' : used} / 32 KB · ${S.points(o.points)}${o.bytes >= 4096 && !zone ? html` · ${S.heavy}` : nothing}</span>
          <button type="button" class="b xfer-btn" aria-haspopup="menu" aria-expanded=${aria(ed.menu?.key === 'xfer')} @click=${(e: Event) => ed.xferMenu(e.currentTarget as HTMLElement)}><span>${S.xferMenu}</span></button>
          ${ed.mcu ? nothing : html`<button type="button" class="b" aria-disabled=${needLib ? 'true' : nothing} aria-describedby=${needLib ? 'lib-hint' : nothing} @click=${() => !needLib && ed.openSave()} aria-keyshortcuts="Control+S"><span>${S.saveLib}</span></button>`}
          ${needLib ? html`<span id="lib-hint" class="sr">${S.libMissing}</span>` : nothing}
          <button type="button" class="b primary" aria-disabled=${why ? 'true' : nothing} aria-describedby=${why ? 'done-why' : nothing} title=${why ?? nothing} @click=${() => ed.done()} aria-keyshortcuts="Control+Enter"><span>${ed.mcu ? S.saveGo : S.done}</span></button>
          ${why ? html`<span id="done-why" class="sr">${why}</span>` : nothing}
          ${btn(S.help, 'help', () => (ed.dlg = ed.dlg === 'help' ? undefined : 'help'), { pressed: ed.dlg === 'help', keys: '?' })}`
      : nothing}
  </header>`;
}

function banners(ed: McSvgEditor): TemplateResult | typeof nothing {
  if (!ed.banners.length && !ed.conflict && !(ed.module && ed.stage === 'edit')) return nothing;
  const facts = ed.module && ed.stage === 'edit' && !ed.noticeGone ? moduleNotice(ed) : nothing;
  return html`<div class="banners">
    ${ed.banners.map(
      (b) => html`<div class=${`banner ${b.kind}`} role=${b.kind === 'error' ? 'alert' : 'status'}>
        <span class="txt">${b.text}</span>
        ${b.detail ? html`<details><summary>${S.details}</summary><ul>${b.detail.map((x) => html`<li>${x}</li>`)}</ul></details>` : nothing}
        ${b.action ? html`<button type="button" class="b" @click=${b.action.run}>${b.action.label}</button>` : nothing}
        ${b.id === 'over' || b.id === 'safe' ? nothing : html`<button type="button" class="b" aria-label=${S.dismiss} title=${S.dismiss} @click=${() => (ed.banners = ed.banners.filter((x) => x !== b))}>${glyph('close', 16)}</button>`}
      </div>`,
    )}
    ${facts}
    ${ed.conflict
      ? html`<div class="banner warn" role="alert"><span class="txt">${S.mcuConflict}</span>${btn(S.mcuCopy, undefined, () => void ed.saveMcu(true), { text: true })}${btn(S.mcuReload, undefined, () => ed.reload(), { text: true })}</div>`
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
  return html`<div class="banner info" role="status">
    <span class="txt">${lines.join(' ')}</span>
    <button type="button" class="b" aria-label=${S.dismiss} title=${S.dismiss} @click=${() => (ed.noticeGone = true)}>${glyph('close', 16)}</button>
  </div>`;
}

// ── start panel ──

function startPanel(ed: McSvgEditor): TemplateResult {
  const tile = (g: GlyphName, name: string, sub: string, on: () => void, pressed?: boolean): TemplateResult =>
    html`<button type="button" class="tile" aria-pressed=${pressed === undefined ? nothing : aria(pressed)} @click=${on}>${glyph(g, 28)}<strong>${name}</strong><small>${sub}</small></button>`;
  return html`<div class="start">
    <div class="tiles">
      ${tile('blank', S.startBlank, S.startBlankSub, () => ed.begin(ed.blankStart()))}
      ${tile('iconpick', S.startIcon, S.startIconSub, () => (ed.startMode = ed.startMode === 'icon' ? undefined : 'icon'), ed.startMode === 'icon')}
      ${tile('paste', S.startPaste, S.startPasteSub, () => (ed.startMode = ed.startMode === 'paste' ? undefined : 'paste'), ed.startMode === 'paste')}
      ${tile('file', S.startFile, S.startFileSub, () => ed.renderRoot.querySelector<HTMLInputElement>('input[type=file]')?.click())}
      ${ed.libraryMissing ? nothing : tile('library', S.startLib, S.startLibSub, () => ed.startLibrary())}
    </div>
    <div class="acts">${xferBtns(ed)}</div>
    <input type="file" accept=".svg,image/svg+xml" hidden @change=${(e: Event) => void ed.startFile((e.target as HTMLInputElement).files?.[0])} />
    ${ed.startMode === 'icon'
      ? html`<form class="startform" @submit=${(e: Event) => {
          e.preventDefault();
          void ed.openIcon((ed.renderRoot.querySelector<HTMLInputElement>('#start-icon')?.value ?? '').trim());
        }}>
          <label class="f"><span>${S.iconField}</span><input id="start-icon" type="text" placeholder="mdi:lightbulb" autocomplete="off" aria-describedby="start-icon-h" /></label>
          <p id="start-icon-h" class="help">${S.iconHelp}</p>
          <button class="b primary" type="submit"><span>${S.iconUse}</span></button>
        </form>`
      : nothing}
    ${ed.startMode === 'paste'
      ? html`<div class="startform">
          <label class="f"><span>${S.pasteField}</span><textarea id="start-paste" class="mono" rows="6" @input=${() => ed.requestUpdate()}></textarea></label>
          <p class="help">${S.pasteCount(kbOf(new TextEncoder().encode(ed.renderRoot.querySelector<HTMLTextAreaElement>('#start-paste')?.value ?? '').length))}</p>
          <button class="b primary" type="button" @click=${() => ed.openSvg(ed.renderRoot.querySelector<HTMLTextAreaElement>('#start-paste')?.value ?? '', S.untitled)}><span>${S.pasteImport}</span></button>
        </div>`
      : nothing}
    ${ed.startError ? html`<p class="error" role="alert">${ed.startError}</p>` : nothing}
    <p class="help">${S.startHint}</p>
  </div>`;
}

/** The start choices as a modal dialog in the top layer, styled like the editor's picker windows. */
function startDialog(ed: McSvgEditor): TemplateResult {
  return html`<dialog class="start-dlg" aria-labelledby="start-h" @cancel=${(e: Event) => (e.preventDefault(), ed.closeStart())} @click=${(e: Event) => e.target === e.currentTarget && ed.closeStart()}>
    <div class="start-win">
      <div class="start-head"><h3 id="start-h">${S.startTitle}</h3>${btn(S.close, 'close', () => ed.closeStart())}</div>
      ${startPanel(ed)}
    </div>
  </dialog>`;
}

// ── workspace ──

const TOOLS: Array<[Tool, GlyphName, string]> = [
  ['select', 'select', 'V'],
  ['node', 'node', 'A'],
  ['pen', 'pen', 'P'],
  ['rect', 'rect', 'R'],
  ['ellipse', 'ellipse', 'E'],
  ['line', 'line', 'L'],
  ['polygon', 'polygon', 'G'],
  ['shapes', 'rect', 'S'],
  ['free', 'free', 'B'],
  ['knife', 'knife', 'K'],
  ['hand', 'hand', 'H'],
];

function rail(ed: McSvgEditor): TemplateResult {
  return html`<nav class="rail" role="toolbar" aria-orientation=${ed.layout === 'stacked' ? 'horizontal' : 'vertical'} aria-label=${S.tools}>
    ${TOOLS.map(
      ([t, g, k]) =>
        html`<button
          type="button"
          class=${`tool${ed.tool === t ? ' on' : ''}`}
          aria-pressed=${aria(ed.tool === t)}
          aria-label=${toolName(t)}
          aria-keyshortcuts=${k}
          title=${`${toolName(t)} (${k})`}
          tabindex=${ed.tool === t ? 0 : -1}
          aria-haspopup=${t === 'shapes' ? 'dialog' : nothing}
          aria-expanded=${t === 'shapes' ? aria(ed.picker) : nothing}
          @click=${() => (t === 'shapes' && ed.tool === t && ed.picker ? ed.closePicker() : ed.setTool(t))}
          @keydown=${(e: KeyboardEvent) => railKey(e, ed, t)}
        >
          ${t === 'shapes' ? primGlyph(ed.opts.prim, 20) : glyph(g, 20)}
        </button>`,
    )}
  </nav>`;
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

function tileKey(e: KeyboardEvent, ed: McSvgEditor, i: number, cols: number): void {
  const n = PRIMITIVE_KINDS.length;
  const to: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, ArrowDown: i + cols, ArrowUp: i - cols, Home: 0, End: n - 1 };
  const j = to[e.key];
  if (j === undefined) return;
  e.preventDefault();
  if (j < 0 || j >= n) return;
  ed.opts = { ...ed.opts, prim: PRIMITIVE_KINDS[j] };
  ed.updateComplete.then(() => ed.renderRoot.querySelectorAll<HTMLElement>('.picker [role=radio]')[j]?.focus());
}

function picker(ed: McSvgEditor): TemplateResult {
  const sheet = ed.coarse || ed.layout === 'stacked';
  const cols = sheet ? 3 : 4;
  return html`<div class=${`picker${sheet ? ' sheet' : ''}`} role="dialog" aria-modal="false" aria-labelledby="pick-h">
    <div class="pick-head"><h3 id="pick-h">${S.shapesTitle}</h3>${btn(S.close, 'close', () => ed.closePicker(), { text: sheet, cls: 'ghost' })}</div>
    <div class="tiles" role="radiogroup" aria-label=${S.shapesTitle} style=${`--cols:${cols}`}>
      ${PRIMITIVE_KINDS.map(
        (k, i) =>
          html`<button type="button" class="tile" role="radio" aria-checked=${aria(ed.opts.prim === k)} tabindex=${ed.opts.prim === k ? 0 : -1} @click=${() => ed.choosePrim(k)} @keydown=${(e: KeyboardEvent) => tileKey(e, ed, i, cols)}>${primGlyph(k, 20)}<span>${S.prim[k]}</span></button>`,
      )}
    </div>
    <p class="help">${S.shapesHelp}</p>
  </div>`;
}

function railKey(e: KeyboardEvent, ed: McSvgEditor, t: Tool): void {
  const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
  if (!d) return;
  e.preventDefault();
  const i = (TOOLS.findIndex((x) => x[0] === t) + d + TOOLS.length) % TOOLS.length;
  ed.setTool(TOOLS[i][0]);
  ed.updateComplete.then(() => ed.renderRoot.querySelectorAll<HTMLElement>('.rail .tool')[i]?.focus());
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
        ${ed.doc.shapes.length === 0 && !ed.liveShape ? html`<p class="empty">${S.empty}</p>` : nothing}
      </div>
      ${resultNote(ed)}
      ${ed.layout !== 'wide' && ed.layout !== 'mid' ? pointBar(ed) : nothing} ${toolOptions(ed)} ${nudgePad(ed)} ${ed.pvOpen ? previews(ed) : nothing}
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

function floatBar(ed: McSvgEditor): TemplateResult {
  return html`<div class="float" role="toolbar" aria-label=${S.canvasLabel}>
    ${btn(S.zoomOut, 'minus', () => ed.zoomBy(0.8), { keys: '-' })}<span class="zoom" aria-live="off">${Math.round((ed.view.zoom / (ed.fitZoom || ed.view.zoom || 1)) * 100)}%</span>${btn(S.zoomIn, 'plus', () => ed.zoomBy(1.25), { keys: '=' })}${btn(S.zoomFit, 'fit', () => ed.fitView(), { keys: '0' })}
    <button type="button" class="b pv-toggle" aria-expanded=${aria(ed.pvOpen)} aria-controls="pv" @click=${() => (ed.pvOpen = !ed.pvOpen)}><span>${S.preview}</span></button>
    ${btn(S.gridToggle(ed.grid), 'grid', () => (ed.pixelGrid = !ed.pixelGrid), { pressed: ed.pixelGrid, keys: "Control+'", text: true, tip: S.gridOn })}${btn(S.snapOn, 'snap', () => (ed.snapOn = !ed.snapOn), { pressed: ed.snapOn, keys: 'Control+;' })}
    <span class="vsep" role="separator" aria-orientation="vertical"></span>
    ${(['align', 'combine', 'path'] as const).map((k) => html`<button type="button" class="b tb-menu" data-menu=${k} aria-haspopup="menu" aria-expanded=${aria(ed.menu?.key === k)} aria-busy=${(k === 'combine' && ed.boolBusy) || (k === 'path' && ed.ptBusy) ? 'true' : nothing} @click=${(e: Event) => ed.toolMenu(k, e.currentTarget as HTMLElement)}><span>${k === 'combine' && ed.boolBusy ? S.boolWorking : k === 'align' ? S.alignTitle : k === 'combine' ? S.boolOps.union : S.ptTitle}</span></button>`)}
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
  if (ed.tool === 'rect') return html`<div class="opts">${numField(S.radiusField, o.r, (n) => set({ r: Math.max(0, n) }), { min: 0 })}</div>`;
  if (ed.tool === 'polygon')
    return html`<div class="opts">
      ${numField(S.sidesField, o.sides, (n) => set({ sides: Math.min(24, Math.max(3, Math.round(n))) }), { min: 3, max: 24, step: 1 })}
      ${chk(S.starSwitch, o.star, (v) => set({ star: v }))}
      ${o.star ? numField(S.innerField, o.inner, (n) => set({ inner: Math.min(0.95, Math.max(0.1, n)) }), { min: 0.1, max: 0.95, step: 0.05 }) : nothing}
    </div>`;
  if (ed.tool === 'pen') return html`<div class="opts">${btn(S.finishPath, undefined, () => ed.finishPath(), { text: true })}</div>`;
  return nothing;
}

function pointFields(ed: McSvgEditor, field?: string, back?: () => void): TemplateResult | typeof nothing {
  const c = ed.pointCtx;
  if (!c) return nothing;
  const a = c.a;
  return html`${seg(S.kind, c.kind, [['corner', S.kindCorner], ['smooth', S.kindSmooth]], (k) => ed.setKind(k))}
    <div class="grid2">
      ${numField(S.fieldX, a.x, (n) => ed.editPoint((p, i) => E.moveAnchor(p, i, n, p.anchors[i].y), 'Move point', 'px'), { field, back })}
      ${numField(S.fieldY, a.y, (n) => ed.editPoint((p, i) => E.moveAnchor(p, i, p.anchors[i].x, n), 'Move point', 'py'), { back })}
    </div>`;
}

function pointBar(ed: McSvgEditor): TemplateResult | typeof nothing {
  const c = ed.pointCtx;
  if (!c) return nothing;
  return html`<div class="pointbar" role="group" aria-label=${S.pointTitle}>
    <strong>${S.pointOf(c.i + 1, c.p.anchors.length)}</strong>
    ${btn(S.prev, undefined, () => ed.stepPoint(-1), { text: true })}${btn(S.next, undefined, () => ed.stepPoint(1), { text: true })}
    ${pointFields(ed, 'pxb', () => ed.canvas()?.focusAnchor(c.pathIndex, c.i))}
  </div>`;
}

function nudgePad(ed: McSvgEditor): TemplateResult | typeof nothing {
  if (!ed.coarse || !ed.nudgePad || (ed.tool !== 'node' && ed.tool !== 'select') || (!ed.pointCtx && !ed.sel.length)) return nothing;
  const k = (g: GlyphName, label: string, dx: number, dy: number) => btn(label, g, () => ed.nudge(dx, dy));
  return html`<div class="pad" role="group" aria-label=${S.nudgeLabel}>
    ${k('left', S.nudgeLeft, -1, 0)}${k('up', S.nudgeUp, 0, -1)}${k('down', S.nudgeDown, 0, 1)}${k('right', S.nudgeRight, 1, 0)}
    ${chk(`${S.nudgeStep} ${ed.nudgeBig ? 4 : 1}`, ed.nudgeBig, (v) => (ed.nudgeBig = v))}
  </div>`;
}

// ── left panel ──

function leftPanel(ed: McSvgEditor): TemplateResult {
  return html`<aside class=${`left${ed.overlay ? ' sheet' : ''}`} aria-label=${S.panelTabs} role=${ed.overlay ? 'dialog' : nothing} aria-modal=${ed.overlay ? 'false' : nothing}>
    ${ed.overlay ? html`<div class="sheet-head">${btn(S.close, 'close', () => (ed.overlay = false), { text: true })}</div>` : nothing}
    ${seg(S.panelTabs, ed.panel, [['layers', S.layers], ['library', S.library]], (p) => ed.openPanel(p))}
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
      ${btn(S.groupAdd, 'group', () => ed.group(), { disabled: ed.sel.length < 2 || blocked })}${btn(S.duplicate, 'copy', () => ed.duplicate(), { disabled: !some, keys: 'Control+D' })}${btn(S.remove, 'trash', () => ed.deleteSelected(), { disabled: !some })}
      ${btn(S.moveUp, 'up', () => one && ed.reorder(one, 1), { disabled: !one })}${btn(S.moveDown, 'down', () => one && ed.reorder(one, -1), { disabled: !one })}
    </div>
    ${blocked ? html`<p class="help">${S.groupDepth}</p>` : nothing}
    <p class="help">${S.layerMove}</p>
  </div>`;
}

function libraryPanel(ed: McSvgEditor): TemplateResult {
  const l = ed.lib;
  if (ed.libraryMissing)
    return html`<div class="libmsg"><p>${S.libMissing}</p><a class="b" href="https://github.com/therealmcsparrow/magic-card-utils" target="_blank" rel="noopener">${S.libHow}</a>${btn(S.libCopySvg, 'copy', () => ed.copySvg(), { text: true })}</div>`;
  if (l.state === 'idle' || l.state === 'loading') return html`<p class="help" role="status">${S.libLoading}</p>`;
  if (l.state === 'readonly' || l.state === 'unreachable' || l.state === 'invalid' || l.state === 'conflict' || l.state === 'full')
    return html`<div class="libmsg"><p role="alert">${S.libUnreachable}</p>${btn(S.retry, undefined, () => void ed.loadLib(), { text: true })}${btn(S.libCopySvg, 'copy', () => ed.copySvg(), { text: true })}</div>`;
  const q = l.q.trim().toLowerCase();
  const items = l.items
    .filter((i) => !q || i.name.toLowerCase().includes(q) || i.id.includes(q))
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  return html`<div class="lib">
    <p class="help">${S.libRule}</p>
    <label class="f"><span class="sr">${S.libSearch}</span><input type="search" placeholder=${S.libSearch} .value=${l.q} @input=${(e: Event) => (ed.lib = { ...ed.lib, q: (e.target as HTMLInputElement).value })} /></label>
    ${l.items.length === 0
      ? html`<p class="help" role="status">${S.libEmpty}</p>`
      : items.length === 0
        ? html`<p class="help" role="status">${S.libNoMatch(l.q)}</p>`
        : html`<ul class="libs">
            ${items.map(
              (i) => html`<li>
                <span class="nm" title=${i.id}>${i.name}</span>
                <button type="button" class="b" title=${S.libInsertTip(i.name)} aria-label=${`${S.libInsert} ${i.name}`} @click=${() => void ed.insertIcon(i.id)}><span>${S.libInsert}</span></button>
                <button type="button" class="b icon" aria-label=${S.libDelete(i.name)} title=${S.libDelete(i.name)} @click=${() => ed.removeIcon(i.id)}>${glyph('trash', 16)}</button>
              </li>`,
            )}
          </ul>`}
    <button type="button" class="b" aria-disabled=${ed.out.error ? 'true' : nothing} @click=${() => !ed.out.error && ed.openSave()}><span>${S.libSaveCurrent}</span></button>
    <p class="help">${S.libStored}</p>
    ${ed.deleted
      ? html`<div class="snack" role="status"><span>${S.libDeleted(ed.deleted.item.name)}</span>${btn(S.undoAction, undefined, () => ed.undoDelete(), { text: true })}</div>`
      : nothing}
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

function xferBtns(ed: McSvgEditor): TemplateResult {
  return html`<button type="button" class="b" data-xfer="import" @click=${(e: Event) => ((ed.startOpen = false), void ed.openTransfer('import', e.currentTarget as HTMLElement))}><span>${S.importFile}</span></button>`;
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
  return html`<div class="grid-size">
    <span id="gs-l" class="lbl">${S.gridChips}</span>
    <div class="seg chips" role="radiogroup" aria-labelledby="gs-l">
      ${items.map(
        ([k, text]) =>
          html`<button type="button" role="radio" aria-checked=${aria(k === cur)} tabindex=${k === cur ? 0 : -1} @click=${() => pickChip(k)} @keydown=${(e: KeyboardEvent) => segKey(e, items, k, pickChip)}>${k === cur ? glyph('check', 14) : nothing}${text}</button>`,
      )}
    </div>
    ${cur === 'custom'
      ? html`<label class="f"><span>${S.gridCustomField}</span><span class="row-u"><input type="number" inputmode="decimal" step="0.05" min=${GRID_MIN} max=${GRID_MAX} data-field="grid-custom" aria-invalid=${ed.gridMsg?.error ? 'true' : 'false'} aria-describedby="gs-m" .value=${fmt(ed.grid)} @input=${(e: Event) => ed.typeGrid((e.target as HTMLInputElement).value, false)} @change=${(e: Event) => {
          const el = e.target as HTMLInputElement;
          ed.typeGrid(el.value, true);
          if (!ed.gridMsg?.error) el.value = fmt(ed.grid);
        }} /><span>${S.gridUnits}</span></span></label>`
      : nothing}
    <p id="gs-m" class=${`help${ed.gridMsg?.error ? ' warn' : ''}`} role=${ed.gridMsg?.error ? 'alert' : nothing}>${ed.gridMsg ? ed.gridMsg.text : ed.snapOn ? S.gridHelp : S.gridHelpOff}</p>
  </div>`;
}

function documentSection(ed: McSvgEditor): TemplateResult {
  return html`<section class="grp-s" aria-labelledby="doc-h">
      <h3 id="doc-h">${S.docTitle}</h3>
      <p class="help">${S.noneSelected}</p>
      ${dualSwitch(ed)}
      ${gridChips(ed)}
      ${chk(S.safeArea, ed.safe, (v) => { ed.safe = v; ed.checks(); })}
      ${chk(S.nudgePad, ed.nudgePad, (v) => (ed.nudgePad = v))}
    </section>
    <section class="grp-s" aria-labelledby="tidy-h">
      <h4 id="tidy-h">${S.tidy}</h4>
      ${pick(S.tidyPrecision, ed.decimals, [0, 1, 2, 3].map((k) => [k, String(k)]), (v) => { ed.decimals = parseInt(v, 10); ed.refresh(); })}
      <p class="help">${S.tidyHelp}</p>
      ${ed.out.bytes >= 24 * 1024 ? html`<p class="help warn">${S.getting}</p>${btn(S.tidyNow, undefined, () => ed.tidyNow(), { text: true })}` : nothing}
    </section>`;
}

function pathSection(ed: McSvgEditor): TemplateResult {
  const p = ed.pt!;
  return p.c.renderPanel(panelState(p), { change: (x) => change(ed, x), apply: () => apply(ed), cancel: () => cancel(ed) }) as TemplateResult;
}

function resultNote(ed: McSvgEditor): TemplateResult | typeof nothing {
  const n = ed.note;
  if (!n) return nothing;
  const mark = n.tone === 'info' ? 'i' : n.tone === 'warn' ? '!' : 'x';
  return html`<div class=${`result-note is-${n.tone}`}><span class="mk" aria-hidden="true">${mark}</span><div class="tx">${n.lines.map((l) => html`<p>${l}</p>`)}</div>${n.action ? html`<button type="button" class="b" @click=${() => n.action!.run()}><span>${n.action.label}</span></button>` : nothing}</div>`;
}

/** A button that stays focusable when unavailable; the editor says why when it is pressed. */
function abtn(label: string, g: GlyphName, on: () => void, off: boolean, text = false): TemplateResult {
  return html`<button type="button" class="b" aria-label=${text ? nothing : label} title=${text ? nothing : label} aria-disabled=${off ? 'true' : nothing} @click=${on}>${glyph(g, 18)}${text ? html`<span>${label}</span>` : nothing}</button>`;
}

function arrangeRow(ed: McSvgEditor): TemplateResult {
  const hows: Array<[SvgArrange, GlyphName]> = [['front', 'toFront'], ['forward', 'up'], ['backward', 'down'], ['back', 'toBack']];
  return html`<div class="acts arr">${hows.map(([h, g]) => abtn(S.arrange[h], g, () => ed.arrange(h), !ed.canArrange(h), true))}</div>`;
}

function shapeSections(ed: McSvgEditor, sel: Shape[]): TemplateResult {
  const one = sel.length === 1 ? sel[0] : undefined;
  const b = ed.unionBox;
  const locked = sel.every((s) => s.locked);
  const first = sel[0];
  const off = { disabled: locked };
  return html`<section class="grp-s" aria-labelledby="sh-h">
      <h3 id="sh-h">${one ? one.name : S.shapes(sel.length)}</h3>
      ${one ? html`<label class="f"><span>${S.rename}</span><input type="text" .value=${one.name} @change=${(e: Event) => ed.renameShape(one.id, (e.target as HTMLInputElement).value)} /></label>` : nothing}
    </section>
    <section class="grp-s" aria-labelledby="ps-h">
      <h4 id="ps-h">${S.posSize}</h4>
      <div class="grid2">
        ${numField(S.fieldX, b?.x, (n) => ed.setBox({ x: n }, 'Move'), off)}${numField(S.fieldY, b?.y, (n) => ed.setBox({ y: n }, 'Move'), off)}
        ${numField(S.fieldW, b?.w, (n) => ed.setBox({ w: n }, 'Resize'), { ...off, min: 0.1 })}${numField(S.fieldH, b?.h, (n) => ed.setBox({ h: n }, 'Resize'), { ...off, min: 0.1 })}
        ${numField(S.fieldAngle, one?.angle ?? 0, (n) => ed.setAngle(n), { disabled: locked || !one, step: 1 })}
      </div>
      ${chk(S.lockRatio, ed.lockRatio, (v) => (ed.lockRatio = v))}
      <div class="acts">
        ${btn(S.rotMinus, 'rotL', () => ed.rotate(-15), off)}${btn(S.rotPlus, 'rotR', () => ed.rotate(15), off)}${btn(S.rotCcw, 'rot90L', () => ed.rotate(-90), off)}${btn(S.rotCw, 'rot90R', () => ed.rotate(90), off)}
        ${btn(S.flipH, 'flipH', () => ed.flip('h'), { ...off, keys: 'Shift+H' })}${btn(S.flipV, 'flipV', () => ed.flip('v'), { ...off, keys: 'Shift+V' })}
      </div>
    </section>
    ${ed.pt ? pathSection(ed) : nothing}
    ${one && (one.type === 'rect' || one.type === 'polygon' || one.type === 'star')
      ? html`<section class="grp-s" aria-labelledby="to-h"><h4 id="to-h">${S.typeOptions}</h4>
          ${one.type === 'rect' ? numField(S.radiusField, one.r ?? 0, (n) => ed.option({ r: Math.max(0, n) }), { min: 0 }) : numField(S.sidesField, one.sides ?? 5, (n) => ed.option({ sides: Math.min(24, Math.max(3, Math.round(n))) }), { min: 3, max: 24, step: 1 })}
          ${one.type === 'star' ? numField(S.innerField, one.inner ?? 0.5, (n) => ed.option({ inner: Math.min(0.95, Math.max(0.1, n)) }), { min: 0.1, max: 0.95, step: 0.05 }) : nothing}
        </section>`
      : nothing}
    <section class="grp-s" aria-labelledby="fs-h">
      <h4 id="fs-h">${S.fillAndStroke}</h4>
      ${dualSwitch(ed)}
      <div class="lbl">${S.fill}</div>${seg(S.fill, first.fill, paintItems(ed.dualOn), (v) => ed.setPaint('fill', v))}
      <div class="lbl">${S.stroke}</div>${seg(S.stroke, first.stroke, paintItems(ed.dualOn), (v) => ed.setPaint('stroke', v))}
      <p class="help">${S.paintHelp}</p>
      ${first.stroke !== 'none'
        ? html`<div class="grid2">
            ${numField(S.strokeWidth, first.width, (n) => ed.patch({ width: Math.max(0.1, n) }, 'Stroke width', 'sw'), { min: 0.1, step: 0.25 })}
            ${pick(S.cap, first.cap, [['butt', S.capButt], ['round', S.capRound], ['square', S.capSquare]], (v) => ed.patch({ cap: v as Shape['cap'] }, 'Stroke cap'))}
            ${pick(S.join, first.join, [['miter', S.joinMiter], ['round', S.joinRound], ['bevel', S.joinBevel]], (v) => ed.patch({ join: v as Shape['join'] }, 'Stroke join'))}
          </div>`
        : nothing}
    </section>
    <section class="grp-s" aria-labelledby="ly-h">
      <h4 id="ly-h">${S.layerSection}</h4>
      ${arrangeRow(ed)}
      ${pick(S.fillRule, first.rule, [['nonzero', S.ruleNonzero], ['evenodd', S.ruleEvenodd]], (v) => ed.patch({ rule: v as Shape['rule'] }, 'Fill rule'))}
      <p class="help">${S.ruleHelp}</p>
      ${chk(S.hidden, !!first.hidden, (v) => ed.patch({ hidden: v }, 'Hide'))}
      ${chk(S.locked, !!first.locked, (v) => ed.patch({ locked: v }, 'Lock'))}
    </section>`;
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
    return html`<div class="grid2">${numField(S.angleOf(name), ang, (n) => set(n, len), { step: 1 })}${numField(S.lengthOf(name), len, (n) => set(ang, Math.max(0.01, n)), { min: 0.01 })}</div>`;
  };
  return html`<section class="grp-s" aria-labelledby="pt-h">
    <h3 id="pt-h">${S.pointTitle}</h3>
    <p class="help">${S.pointOf(c.i + 1, c.p.anchors.length)}</p>
    ${pointFields(ed, 'px', () => ed.canvas()?.focusAnchor(c.pathIndex, c.i))}${hand('out')}${hand('in')}
    <div class="acts">
      ${btn(S.prev, undefined, () => ed.stepPoint(-1), { text: true })}${btn(S.next, undefined, () => ed.stepPoint(1), { text: true })}
      ${btn(S.pointAdd, 'plus', () => ed.addAfter(), { text: true, disabled: !ed.canAddPoint })}${btn(S.pointDelete, 'trash', () => ed.deletePoint(), { text: true })}
      ${btn(c.p.closed ? S.pathOpen : S.pathClose, undefined, () => ed.editPoint((p) => E.setClosed(p, !p.closed), 'Close path'), { text: true })}${btn(S.pathReverse, undefined, () => ed.editPoint((p) => E.reverse(p), 'Reverse'), { text: true })}
    </div>
  </section>`;
}

// ── previews ──

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
  return html`<section id="pv" class="pv" role="group" aria-label=${S.preview}>
    ${seg(S.preview, ed.pvTheme, [['light', S.pvLight], ['dark', S.pvDark], ['on', S.pvOn], ['off', S.pvOff]] as Array<['light' | 'dark' | 'on' | 'off', string]>, (t) => (ed.pvTheme = t))}
    ${ed.mcu
      ? html`<div class="acts">${[[S.pvMainColour, ed.pvMain, (v: string) => (ed.pvMain = v)], [S.pvAccentColour, ed.pvAccent, (v: string) => (ed.pvAccent = v)]].map(
          ([l, v, on]) => html`<label class="f"><span>${l as string}</span><input type="color" .value=${v as string} @input=${(e: Event) => (on as (v: string) => void)((e.target as HTMLInputElement).value)} /></label>`,
        )}</div>`
      : nothing}
    <div class="pv-g pv-mc"><small>${S.pvMc}</small><div class="pv-row">${tile(24)}${tile(48)}${tile(96)}</div></div>
    <div class="pv-g pv-ha"><small title=${S.pvHaTip}>${S.pvHa}</small><div class="pv-row">${[24, 48].map(haTile)}</div></div>
    ${warn ? html`<p class="banner warn inline" role="status">${ha.empty ? S.haWarnEmpty : S.haWarn}</p>` : nothing}
  </section>`;
}

// ── popovers ──

function savePop(ed: McSvgEditor): TemplateResult {
  const name = ed.saveName.trim();
  const target = ed.updateTarget();
  const clash = !!target && target.name.toLowerCase() === name.toLowerCase();
  const mode = target ? 'update' : 'new';
  const go = (m: 'update' | 'new'): void => void ed.saveToLibrary(m);
  const bytes = ed.out.svg ? new TextEncoder().encode(ed.out.svg).length : 0;
  return html`<div class="pop" role="dialog" aria-label=${S.saveTitle} aria-modal="false" @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && (e.target as HTMLInputElement).type === 'text' && (e.preventDefault(), go(mode))}>
    <h3>${S.saveTitle}</h3>
    <label class="f"><span>${S.saveName}</span><input type="text" maxlength="60" .value=${ed.saveName} aria-describedby="save-h save-err" aria-invalid=${ed.saveError ? 'true' : 'false'} @input=${(e: Event) => { ed.saveName = (e.target as HTMLInputElement).value; ed.saveError = ''; }} /></label>
    <p id="save-h" class="help">${S.saveNameHelp} ${S.saveUsedAs(target?.id ?? freeId(name, new Set(ed.lib.items.map((i) => i.id))))}</p>
    <p id="save-err" class="error" role="alert">${ed.saveError}</p>
    ${target ? html`<p class="help warn">${clash ? S.saveExists(target.name) : ''} ${S.saveUpdateWarn(target.name)}</p>` : nothing}
    ${chk(`${S.saveKeep} (${S.saveKeepSize(kbOf(bytes))})`, ed.keepCopy, (v) => (ed.keepCopy = v))}
    <p class="help">${S.saveKeepHelp}</p>
    <div class="acts end">
      ${btn(S.saveCancel, undefined, () => (ed.dlg = undefined), { text: true })}
      ${target && !clash ? btn(S.saveNew, undefined, () => go('new'), { text: true, disabled: ed.saveBusy }) : nothing}
      ${btn(target ? S.saveUpdate(target.name) : S.saveGo, undefined, () => go(mode), { text: true, cls: 'primary', disabled: ed.saveBusy })}
    </div>
  </div>`;
}

function helpPop(ed: McSvgEditor): TemplateResult {
  return html`<div class="pop help-pop" role="dialog" aria-label=${S.help} aria-modal="false">
    <h3>${S.help}</h3>
    <ul>${hintFor(ed) ? html`<li>${hintFor(ed)}</li>` : nothing}${S.helpKeys.map((x) => html`<li>${x}</li>`)}</ul>
    ${btn(S.close, 'close', () => (ed.dlg = undefined), { text: true })}
  </div>`;
}

function leavePop(ed: McSvgEditor): TemplateResult {
  return html`<div class="pop leave" role="alertdialog" aria-label=${S.leaveTitle}>
    <p><strong>${ed.mcu ? S.mcuLeaveTitle : S.leaveTitle}</strong> ${ed.savedCurrent && !ed.mcu ? S.leaveSaved : ''}</p>
    <div class="acts end">
      ${btn(S.leaveKeep, undefined, () => (ed.leaving = false), { text: true })}
      ${btn(ed.mcu ? S.mcuLeave : S.leaveDiscard, undefined, () => ed.leave(), { text: true })}
      ${ed.mcu ? nothing : btn(S.leaveUse, undefined, () => ed.done(), { text: true, cls: 'primary', disabled: !!ed.blockReason })}
    </div>
  </div>`;
}

function toast(ed: McSvgEditor): TemplateResult | typeof nothing {
  const t = ed.toast;
  if (!t) return nothing;
  return html`<div class="toast" role="status"><span>${t.text}</span>${t.action ? html`<button type="button" class="b" @click=${() => { ed.toast = undefined; t.action!.run(); }}><span>${t.action.label}</span></button>` : nothing}</div>`;
}

void byId;
