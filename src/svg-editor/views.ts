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
import type { ImageUi } from './image-seam';
import type { Banner, McSvgEditor } from './mc-svg-editor';
import { apply, cancel, change, panelState } from './pathtools';
import { GRID_CHIPS, GRID_MAX, GRID_MIN, kbOf, toolName } from './mc-svg-editor';
import { freeId } from './library';
import { locale, t } from './i18n';
import { lipTokens } from './lips';
import { ARRANGE, BOOL_OPS, HELP_KEYS, PRIM } from './names';
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
export function artNodes(d: Doc, onlyVisible = true, moving?: ReadonlySet<string>, img?: ImageUi): TemplateResult[] {
  return d.shapes
    .filter((s) => !onlyVisible || !isOff(d, s, 'hidden'))
    .map((s) => img?.node(s) ?? svg`<path d=${dOf(s)} style=${`${img ? img.style(s) : `fill:${paintVar(s.fill)};stroke:${paintVar(s.stroke)}`};stroke-width:${s.width};stroke-linecap:${s.cap};stroke-linejoin:${s.join};fill-rule:${s.rule}${moving?.has(s.id) ? ';will-change:transform' : ''}`}></path>`);
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
  ['none', t('None')],
  ['main', t('Main')],
  ...(dual ? [['accent', t('Accent')] as [Paint, string]] : []),
];

/** The icon-level Dual-tone switch: Main and Accent over the same paint. */
const dualSwitch = (ed: McSvgEditor): TemplateResult => chk('sw-dual', t('Dual-tone'), ed.dualOn, (v) => ed.toggleDual(v), t('Use two colours: Main and Accent.'));

/** A confirmation: an alert window with the safe choice first (it gets the focus). */
function confirm(heading: string, body: unknown, buttons: unknown, close: () => void, size: 's' | 'm' = 's'): TemplateResult {
  return html`<mc-ui-window variant="alert" size=${size} heading=${heading} closeLabel=${t('Close')} @mc-window-close=${close}>
    <div class="confirm">${body as TemplateResult}</div>
    <div slot="footer" class="foot">${buttons as TemplateResult}</div>
  </mc-ui-window>`;
}

function singleWin(ed: McSvgEditor): TemplateResult {
  return confirm(
    t('Make {c, plural, one {# Accent layer} other {# Accent layers}} Main?', { c: ed.accentCount }),
    html`<p>${t('Everything painted Accent is painted Main instead. You can undo this.')}</p>`,
    html`${btn(t('Keep Accent'), undefined, () => ed.closeSingle(), { text: true, size: 'md' })}${btn(t('Make Main'), undefined, () => ed.singleTone(), { text: true, size: 'md', variant: 'primary' })}`,
    () => ed.dlg === 'single' && ed.closeSingle(),
  );
}

function xferWin(ed: McSvgEditor): TemplateResult {
  const x = ed.xfer!;
  return html`<mc-ui-window
    variant="sheet"
    heading=${x.mode === 'export' ? t('Export file') : t('Import file')}
    closeLabel=${t('Close')}
    movable
    resizable
    maximizable
    moveLabel=${t('Move window')}
    resizeLabel=${t('Resize window')}
    maximizeLabel=${t('Maximise')}
    restoreLabel=${t('Restore size')}
    .dismissible=${false}
    @mc-window-close=${() => ed.xfer && ed.closeTransfer()}
  >
    <mc-transfer-panel .host=${'svg-editor'} .mode=${x.mode} .exportItems=${x.items ? { kind: 'icon', items: x.items } : undefined} .hasLibrary=${!ed.libraryMissing}
      @mc-transfer-close=${() => ed.closeTransfer()} @mc-transfer-import=${(e: CustomEvent<{ items: TransferItem[] }>) => (e.stopPropagation(), ed.importItems(e.detail.items))}></mc-transfer-panel>
  </mc-ui-window>`;
}

// ── the layer ──

export function renderEditor(ed: McSvgEditor): TemplateResult {
  return html`<div class="layer" lang=${locale()} role="dialog" aria-modal="true" aria-label=${ed.img ? ed.img.title : t('Icon editor')} data-layout=${ed.layout} @keydown=${ed.onKey} @keyup=${ed.onKeyUp}>
    <span class="sentinel" tabindex="0" @focus=${() => ed.wrapFocus(true)}></span>
    ${ed.lips.status()} ${skipLinks(ed)} ${topBar(ed)}
    ${ed.stage === 'edit' ? (ed.img?.readOnly ? ed.img.viewer() : workspace(ed)) : ed.stage === 'loading' ? html`<p class="center-msg" role="status">${ed.source.kind.startsWith('image') ? t('Loading the image editor') : t('Loading the icon editor')}</p>` : html`<div class="center-msg" role="alert"><p>${ed.img?.problem ?? (ed.source.kind.startsWith('image') ? t('The image editor could not load. Check your connection and try again.') : t('The icon editor could not load. Check your connection and try again.'))}</p>${btn(t('Try again'), undefined, () => void ed.start(), { text: true, size: 'md', variant: 'primary' })}</div>`}
    ${ed.img?.dialogs()}
    ${ed.startOpen ? startWindow(ed) : nothing}
    ${ed.dlg === 'save' ? saveWin(ed) : nothing} ${ed.dlg === 'single' ? singleWin(ed) : nothing} ${ed.leaving ? leaveWin(ed) : nothing} ${ed.newAsk ? newWin(ed) : nothing} ${ed.xfer ? xferWin(ed) : nothing}
    ${ed.dlg === 'poly' ? polyWin(ed) : nothing} ${ed.dlg === 'help' ? helpPop(ed) : nothing} ${ed.pvOpen ? previewPop(ed) : nothing}
    ${ed.menu ? html`<mc-ui-menu .items=${ed.menu.items} .label=${ed.menu.key === 'xfer' ? t('Export / Import') : ed.menu.key ? ed.menu.opener.textContent!.trim() : t('Shape actions')} .at=${ed.menu.at} .touch=${ed.menu.touch} .opener=${ed.menu.opener} @mc-menu-pick=${ed.onPick} @mc-menu-close=${ed.onMenuClose}></mc-ui-menu>` : nothing}
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
    ${btn(t('Skip to canvas'), undefined, go('mc-path-canvas'), { text: true })}
    ${ed.pointCtx ? btn(t('Skip to point fields'), undefined, go('[data-field="px"]'), { text: true }) : nothing}
    ${btn(t('Skip to inspector'), undefined, () => void ed.lips.reveal('inspector').then(() => go('.insp input, .insp button')()), { text: true })}
  </nav>`;
}

const SAVE_KEY = (): string => (/Mac|iPhone|iPad/.test(navigator.platform ?? '') ? 'Meta+S' : 'Control+S');

/** The top bar, slot by slot in the order of ICON_TOP_BAR, IMAGE_TOP_BAR and IMAGE_READONLY_TOP_BAR (DOM, visual and Tab order are the same). */
function topBar(ed: McSvgEditor): TemplateResult {
  const img = ed.img;
  const edit = ed.stage === 'edit';
  const ro = !!img?.readOnly;
  const sm = ed.layout === 'stacked';
  const z = sm ? 'sm' : 'md';
  // narrow windows (and 200 % zoom): the title is read by screen readers only, secondary buttons keep their glyph and lose the word, so the bar needs two rows at most
  const tight = ed.layout === 'compact' || sm;
  const image = ed.source.kind.startsWith('image');
  const o = ed.out;
  const zone = o.error === 'over' ? ' is-error' : o.bytes >= 24 * 1024 ? ' is-warn' : '';
  const needLib = ed.libraryMissing && !ed.mcu;
  const chip_ = ed.savedLabel;
  const exported = img ? img.slot('transfer', z, tight) : button({ label: t('Export / Import'), glyph: tight ? 'swapVertical' : undefined, iconOnly: tight, variant: 'secondary', size: z, haspopup: 'menu', expanded: ed.menu?.key === 'xfer', onClick: (e) => ed.xferMenu(e.currentTarget as HTMLElement) });
  return html`<header class="topbar">
    ${button({ label: image || ed.mcu ? t('Close') : t('Back to card editor'), glyph: 'arrowLeft', variant: 'secondary', size: z, iconOnly: tight, onClick: () => ed.back() })}
    <h1 class=${tight ? 'title sr' : 'title'}>${image ? t('Image editor') : t('Icon editor')}</h1>
    ${edit && !ro ? button({ label: t('Start from…'), glyph: 'fileOutline', variant: 'secondary', size: z, iconOnly: tight, haspopup: 'dialog', onClick: (e) => ed.openStart(e.currentTarget as HTMLElement) }) : nothing}
    ${edit
      ? ro
        ? html`<strong class="title">${ed.doc.name}</strong><span class="spacer"></span>${exported}`
        : html`<div class="nm-field">
            <label class=${tight ? 'sr' : 'nm-label'} for="title-name">${img ? img.nameLabel : t('Icon name')}</label>
            <div class="name"
              ><input id="title-name" class="input" type="text" maxlength="80" aria-required=${ed.mcu && !img ? 'true' : nothing} title=${img ? nothing : t('Name used in the library')} .value=${ed.doc.name} @change=${(e: Event) => ed.apply({ ...ed.doc, name: (e.target as HTMLInputElement).value }, img ? 'Rename image' : 'Rename icon', 'name')}
            /></div>
            ${chip_ ? chip({ label: chip_, tone: chip_ === t('Saved') ? undefined : 'warn' }) : nothing}
          </div>
          <span class="spacer"></span>
          ${ed.layout === 'compact' ? btn(image || ed.panel === 'layers' ? t('Layers') : t('Library'), undefined, () => (ed.overlay = !ed.overlay), { text: true, size: z, pressed: ed.overlay }) : nothing}${btn(t('Undo'), 'undo', () => ed.undo(), { disabled: !ed.hist?.canUndo, keys: 'Control+Z', size: z })}${btn(t('Redo'), 'redo', () => ed.redo(), { disabled: !ed.hist?.canRedo, keys: 'Control+Shift+Z', size: z })}
          ${img
            ? html`${img.slot('canvas', z, tight)}${img.slot('reference', z, tight)}${exported}${img.slot('more', z, tight)}${primary(ed, sm)}`
            : html`<span class=${`chip meter${zone}`} title=${t('Size of the icon markup in your dashboard')}>${t('{size} / 32 KB · {c, plural, one {# point} other {# points}}', { size: o.error === 'empty' ? 0 : kbOf(o.bytes), c: o.points })}${o.bytes >= 4096 && !zone && !tight ? html` · ${t('Heavy for wall tablets')}` : nothing}</span>
              ${exported}
              ${ed.mcu ? nothing : html`<button type="button" data-act="save-library" class=${`btn btn-secondary${sm ? ' btn-sm' : ''}`} aria-disabled=${needLib ? 'true' : nothing} aria-describedby=${needLib ? 'lib-hint' : nothing} aria-keyshortcuts="Control+S" @click=${() => !needLib && ed.openSave()}>${t('Save to library')}</button>`}
              ${needLib ? html`<span id="lib-hint" class="sr">${t('Keep your own icons for every dashboard with the free Magic Card Utils add-on. Until then, what you draw is saved in this card only.')}</span>` : nothing}
              ${primary(ed, sm)}`}
          ${button({ label: t('Shortcuts'), glyph: 'helpCircle', iconOnly: true, size: z, expanded: ed.dlg === 'help', controls: 'help-pop', keys: '?', onClick: () => (ed.dlg = ed.dlg === 'help' ? undefined : 'help') })}`
      : nothing}
  </header>${edit && !ro ? img?.barTail() : nothing}`;
}

/** Done (Save in the Magic Card Utils panel and for an image): stays focusable while it cannot act, with its reason read out. */
function primary(ed: McSvgEditor, sm: boolean): TemplateResult {
  const img = ed.img;
  const why = img ? img.saveWhy : ed.mcu && !ed.doc.name.trim() ? t('Give the icon a name.') : ed.blockReason;
  return html`<button type="button" class=${`btn btn-primary${sm ? ' btn-sm' : ''}`} aria-disabled=${why ? 'true' : nothing} aria-describedby=${why ? 'done-why' : nothing} aria-keyshortcuts=${img ? SAVE_KEY() : 'Control+Enter'} title=${why ?? nothing} @click=${() => ed.done()}>${glyph('check', 18)}${img || ed.mcu ? t('Save') : t('Done')}</button>
    ${why ? html`<span id="done-why" class="sr">${why}</span>` : nothing}`;
}

/** A banner follows the document: a kit notice with its actions and a Dismiss button where the message can go away. */
function bannerView(ed: McSvgEditor, b: { kind: Banner['kind']; text: string; detail?: string[]; action?: Banner['action']; dismiss?: () => void }): TemplateResult {
  return html`<div class=${`notice ${b.kind}`} role=${b.kind === 'error' ? 'alert' : 'status'}>
    ${glyph(b.kind === 'info' ? 'information' : 'alertCircle', 20)}
    <div class="body">
      <p>${b.text}</p>
      ${b.detail ? html`<details><summary>${t('Details')}</summary><ul>${b.detail.map((x) => html`<li>${x}</li>`)}</ul></details>` : nothing}
      ${b.action ? html`<div class="actions">${btn(b.action.label, undefined, b.action.run, { text: true })}</div>` : nothing}
    </div>
    ${b.dismiss ? btn(t('Dismiss'), 'close', b.dismiss) : nothing}
  </div>`;
}

function banners(ed: McSvgEditor): TemplateResult | typeof nothing {
  const facts = ed.module && ed.stage === 'edit' && !ed.noticeGone ? moduleNotice(ed) : nothing;
  if (!ed.banners.length && !ed.conflict && facts === nothing) return nothing;
  return html`<div class="banners">
    ${ed.banners.map((b) => bannerView(ed, { ...b, dismiss: b.id === 'over' || b.id === 'safe' ? undefined : () => (ed.banners = ed.banners.filter((x) => x !== b)) }))}
    ${facts}
    ${ed.conflict
      ? html`<div class="notice warn" role="alert">
          ${glyph('alertCircle', 20)}
          <div class="body"><p>${t('This icon was changed somewhere else.')}</p><div class="actions">${btn(t('Save as a copy'), undefined, () => void ed.saveMcu(true), { text: true })}${btn(t('Reload'), undefined, () => ed.reload(), { text: true })}</div></div>
        </div>`
      : nothing}
  </div>`;
}

function moduleNotice(ed: McSvgEditor): TemplateResult {
  const m = ed.module!;
  const lines = [
    m.icon ? t('This module will use your drawing instead of {icon}. Colours, Draw and Morph effects keep working on it.', { icon: m.icon }) : t('This module will use your drawing. Colours, Draw and Morph effects keep working on it.'),
    m.hasStateIcons ? t('State icons win over your drawing. Remove them to see your drawing.') : '',
    m.pickedAnimation ? t('The animated icon you picked is removed: it draws the old icon. Animate your drawing with This icon.') : '',
    m.followsIcon ? t('The animation you set on This icon follows your drawing.') : '',
    m.linked ? t('This card is linked to a template. Your drawing is used on this card only.') : '',
  ].filter(Boolean);
  return bannerView(ed, { kind: 'info', text: lines.join(' '), dismiss: () => (ed.noticeGone = true) });
}

// ── start window ──

/** The card editor's icon picker, used by tag (SVG_EDITOR_EXTERNAL_TAGS): a pick or typing fills the name; the button or Enter starts the drawing. */
function startPicked(ed: McSvgEditor, e: CustomEvent<{ value: string }>): void {
  e.stopPropagation();
  ed.startIcon = String(e.detail?.value ?? '').trim();
}

type StartPanel = 'icon' | 'paste' | 'canvas-size';

/** A tile that opens its panel opens it and moves the focus to its first field; pressed again it closes the panel and the focus stays on the tile. */
function toggle(ed: McSvgEditor, panel: StartPanel, e: Event): void {
  const tile = e.currentTarget as HTMLElement;
  ed.startMode = ed.startMode === panel ? undefined : panel;
  void ed.updateComplete.then(() => (ed.startMode ? ed.renderRoot.querySelector<HTMLElement>('#start-panel :is(input, textarea, [tabindex="0"], mc-icon-picker)') : tile)?.focus({ preventScroll: true }));
}

function startPanel(ed: McSvgEditor): TemplateResult {
  const img = ed.img;
  const tile = (id: string, g: GlyphName, name: string, sub: string, on: (e: Event) => void, panel?: StartPanel): TemplateResult => {
    const open = ed.startMode === panel;
    return html`<button type="button" id=${id || nothing} class="tile glyph-only" aria-expanded=${panel ? aria(open) : nothing} aria-controls=${panel ? 'start-panel' : nothing} aria-busy=${id && ed.startBusy ? 'true' : nothing} @click=${on}>${glyph(g, 24)}<span>${name}${panel ? glyph(open ? 'chevronDown' : 'chevronRight', 14) : nothing}</span><span class="meta">${sub}</span></button>`;
  };
  const mode = ed.startMode;
  const pasted = mode === 'paste' ? ed.renderRoot.querySelector<HTMLTextAreaElement>('#start-paste')?.value ?? '' : '';
  const blank = !pasted.trim();
  return html`<div class="start">
    <div class="tiles">
      ${img
        ? tile('', 'squareOutline', t('Blank canvas'), t('Pick a shape'), (e) => toggle(ed, 'canvas-size', e), 'canvas-size')
        : html`${tile('', 'squareOutline', t('Blank'), t('24 x 24'), () => ed.take(ed.blankStart()))}${tile('', 'shapeOutline', t('An icon'), t('Pick MDI or a pack'), (e) => toggle(ed, 'icon', e), 'icon')}`}
      ${tile('', 'contentPaste', t('Paste SVG'), t('markup'), (e) => toggle(ed, 'paste', e), 'paste')}
      ${tile('start-open', 'fileOutline', t('Open file'), ed.startBusy ? t('Reading…') : t('.svg'), () => ed.renderRoot.querySelector<HTMLInputElement>('#start-file')?.click())}
      ${img || ed.libraryMissing ? nothing : tile('', 'bookshelf', t('My icons'), t('Library'), () => ed.startLibrary())}
    </div>
    ${img ? nothing : html`<div class="acts">${button({ label: t('Import file'), glyph: 'folderOpenOutline', variant: 'secondary', size: 'sm', onClick: (e) => ((ed.startOpen = false), void ed.openTransfer('import', e.currentTarget as HTMLElement)) })}</div>`}
    <input id="start-file" type="file" accept=".svg,image/svg+xml" hidden @change=${(e: Event) => void ed.startFile((e.target as HTMLInputElement).files?.[0])} />
    <div id="start-panel">
    ${mode === 'icon'
      ? html`<form class="startform" @submit=${(e: Event) => {
          e.preventDefault();
          const name = ed.startIcon.trim();
          if (name) void ed.openIcon(name);
        }}>
          ${customElements.get('mc-icon-picker')
            ? field({ id: 'start-icon', label: t('Icon name'), help: t('Search the Home Assistant icons and installed icon packs, or type a name like mdi:lightbulb.'), control: html`<mc-icon-picker id="start-icon" .hass=${ed.hass} .value=${ed.startIcon} label=${t('Icon name')} @value-changed=${(e: CustomEvent<{ value: string }>) => startPicked(ed, e)}></mc-icon-picker>` })
            : field({ id: 'start-icon', label: t('Icon name'), help: t('For example mdi:lightbulb. Home Assistant icons and installed icon packs work.'), control: html`<input id="start-icon" class="input" type="text" .value=${ed.startIcon} autocomplete="off" autocapitalize="off" spellcheck="false" aria-describedby="start-icon-help" @input=${(e: Event) => (ed.startIcon = (e.target as HTMLInputElement).value)} />` })}
          <div class="acts"><button class="btn btn-primary" type="submit" ?disabled=${!ed.startIcon.trim()}>${t('Use this icon')}</button></div>
        </form>`
      : nothing}
    ${mode === 'paste'
      ? html`<div class="startform">
          ${field({
            id: 'start-paste',
            label: t('SVG markup'),
            help: t('{size} KB', { size: kbOf(new TextEncoder().encode(pasted).length) }),
            control: html`<textarea id="start-paste" class="input" rows="6" aria-describedby=${blank ? 'start-paste-help start-paste-why' : 'start-paste-help'} aria-invalid=${ed.startError && ed.startAt === 'start-paste-go' ? 'true' : nothing} @input=${() => ed.requestUpdate()}></textarea>`,
          })}
          <div class="acts"><button type="button" id="start-paste-go" class="btn btn-primary" aria-disabled=${blank ? 'true' : nothing} @click=${() => {
            const text = ed.renderRoot.querySelector<HTMLTextAreaElement>('#start-paste')?.value ?? '';
            if (text.trim()) void ed.usePaste(text);
          }}>${t('Use this SVG')}</button></div>
          ${blank ? html`<span id="start-paste-why" class="sr">${t('Paste some SVG first.')}</span>` : nothing}
        </div>`
      : nothing}
    ${mode === 'canvas-size'
      ? html`<div class="startform">
          ${ed.img!.form()}
          <div class="acts"><button type="button" id="start-create" class="btn btn-primary" aria-disabled=${ed.img!.formBad ? 'true' : nothing} @click=${() => {
            const doc = ed.img!.create();
            if (doc) ed.take(doc);
          }}>${t('Create')}</button></div>
        </div>`
      : nothing}
    </div>
    <p id="start-status" class="help error" role="alert">${ed.startError ? glyph('alertCircle', 16) : nothing}${ed.startError ?? ''}</p>
    <p class="help">${t('Pasted and opened files are cleaned first. Scripts, images and links are removed.')}</p>
  </div>`;
}

/** The start choices in a kit window: movable, resizable and maximisable like the card editor's pickers. */
function startWindow(ed: McSvgEditor): TemplateResult {
  return html`<mc-ui-window
    variant="dialog"
    size="m"
    heading=${t('What do you want to start from?')}
    closeLabel=${t('Close')}
    movable
    resizable
    maximizable
    moveLabel=${t('Move window')}
    resizeLabel=${t('Resize window')}
    maximizeLabel=${t('Maximise')}
    restoreLabel=${t('Restore size')}
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
    label: t('Tools'),
    orientation: ed.layout === 'stacked' ? 'horizontal' : 'vertical',
    kind: 'rail',
    items: [
      ...TOOLS.map(([t, g, k]) => ({
        label: toolName(t),
        glyph: g,
        iconOnly: true,
        pressed: ed.tool === t,
        keys: k,
        haspopup: t === 'shapes' ? ('dialog' as const) : undefined,
        expanded: t === 'shapes' ? ed.picker : undefined,
        onClick: () => (t === 'shapes' && ed.tool === t && ed.picker ? ed.closePicker() : ed.setTool(t)),
      })),
      ...(ed.img ? [ed.img.railTool()] : []),
    ],
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
    <div class="pick-head"><h3 id="pick-h">${t('Shapes')}</h3>${btn(t('Close'), 'close', () => ed.closePicker(), { text: sheet })}</div>
    <div @click=${(e: Event) => (e.target as Element).closest('.tile') && ed.closePicker()}>${tiles({ label: t('Shapes'), value: ed.opts.prim, items: PRIMITIVE_KINDS.map((k) => ({ value: k, label: t(PRIM[k]), preview: primGlyph(k, 28) })), onPick: (k) => ed.pickPrim(k) })}</div>
    <p class="help">${t('Click and drag on the canvas, or click two corners. Hold Shift for a square. Without a mouse: arrows move the crosshair, Enter sets each corner.')}</p>
  </div>`;
}

function workspace(ed: McSvgEditor): TemplateResult {
  const stacked = ed.layout === 'stacked';
  const left = ed.layout === 'wide' || ed.layout === 'mid' || stacked || ed.overlay;
  const lips = ed.lips;
  return html`<div class=${`work${ed.overlay ? ' ov' : ''}${lips.isHidden('side') ? ' no-side' : ''}${lips.isHidden('inspector') ? ' no-insp' : ''}`} style=${lipTokens(lips.state('side'), lips.state('inspector'), ed.bar.width)}>
    ${rail(ed)}
    ${ed.picker ? picker(ed) : nothing}
    ${left ? leftPanel(ed) : nothing}${left ? lips.lip('side') : nothing}
    <section class="center" aria-label=${ed.img ? ed.img.title : t('Icon editor')}>
      ${floatBar(ed)}
      <div class="stagebox">
      <div
        class=${`stage tool-${ed.tool}${ed.img?.hasRef ? ' has-ref' : ''}`}
        @pointerdown=${ed.cap.down}
        @pointermove=${ed.onStageMove}
        @pointerup=${ed.onStageUp}
        @pointercancel=${ed.onStageUp}
        @keydown=${ed.cap.key}
      >
        ${ed.img?.underlay()}${artLayer(ed)}
        <mc-path-canvas
          underlay
          role="group"
          aria-label=${ed.img ? ed.img.canvasLabel : t('Icon canvas')}
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
        ${ed.img?.handles()}
        ${ed.doc.shapes.length === 0 && !ed.liveShape ? html`<div class="hint">${empty({ title: t('Nothing here yet'), text: t('Pick a tool on the left, or press P to draw.') })}</div>` : nothing}
      </div>
      ${banners(ed)}
      ${resultNote(ed)}
      ${toolOptions(ed)}
      </div>
      ${ed.layout !== 'wide' && ed.layout !== 'mid' ? pointBar(ed) : nothing} ${nudgePad(ed)}
    </section>
    ${lips.lip('inspector')}${inspector(ed)}
  </div>`;
}

function hintFor(ed: McSvgEditor): string {
  switch (ed.tool) {
    case 'select':
      return '';
    case 'node':
      return t('Tab walks the points. [ and ] jump to the previous or next point. Arrows move it. Enter edits its X and Y.');
    case 'pen':
      return t('Click to place a point. Click the first point to close. Esc ends the path.');
    case 'shapes':
      return t('Click and drag, or click two corners. Hold Shift for a square. Without a mouse: arrows move the crosshair, Enter sets a corner. Press S to pick another shape.');
    case 'free':
      return t('Drag to draw. The line is smoothed when you let go.');
    case 'hand':
      return t('Drag to move the view. Scroll to move, Ctrl and scroll to zoom.');
    case 'knife':
      return t('Drag across shapes to cut them along the whole line. Arrows move the crosshair, Enter sets an end.');
    case 'text':
      return ed.img?.hint ?? '';
    default:
      return t('Drag a box, or click two corners. Without a mouse: arrows move the crosshair, Enter sets a corner.');
  }
}

/** The canvas toolbar: zoom, view, then Align, Combine and Path after a divider. Small, borderless buttons (kit `.toolbar`). */
function floatBar(ed: McSvgEditor): TemplateResult {
  const menuBtn = (k: 'align' | 'combine' | 'path'): TemplateResult => {
    const busy = (k === 'combine' && ed.boolBusy) || (k === 'path' && ed.ptBusy);
    const label = k === 'combine' && ed.boolBusy ? t('Working…') : k === 'align' ? t('Align') : k === 'combine' ? t(BOOL_OPS.union) : t('Path');
    return html`<button type="button" class="btn btn-secondary btn-sm" data-menu=${k} aria-haspopup="menu" aria-expanded=${aria(ed.menu?.key === k)} aria-busy=${busy ? 'true' : nothing} @click=${(e: Event) => ed.toolMenu(k, e.currentTarget as HTMLElement)}>${label}</button>`;
  };
  return html`<div class="toolbar" role="toolbar" aria-label=${ed.img ? ed.img.canvasLabel : t('Icon canvas')}>
    ${btn(t('Zoom out'), 'minus', () => ed.zoomBy(0.8), { keys: '-' })}<span class="zoom" aria-live="off">${Math.round((ed.view.zoom / (ed.fitZoom || ed.view.zoom || 1)) * 100)}%</span>${btn(t('Zoom in'), 'add', () => ed.zoomBy(1.25), { keys: '=' })}${btn(t('Fit to view'), 'fitToScreenOutline', () => ed.fitView(), { keys: '0' })}
    ${ed.img ? ed.img.previewButton() : html`<button type="button" class="btn btn-secondary btn-sm" data-pv aria-expanded=${aria(ed.pvOpen)} aria-controls="pv" @click=${() => (ed.pvOpen = !ed.pvOpen)}>${t('Preview')}</button>`}
    ${btn(t('Grid {size}', { size: ed.grid }), 'grid', () => (ed.pixelGrid = !ed.pixelGrid), { pressed: ed.pixelGrid, keys: "Control+'", text: true })}${btn(t('Snap to grid'), 'magnet', () => (ed.snapOn = !ed.snapOn), { pressed: ed.snapOn, keys: 'Control+;' })}
    <span role="separator" aria-orientation="vertical"></span>
    ${menuBtn('align')}${menuBtn('combine')}${menuBtn('path')}
  </div>`;
}

export function artLayer(ed: McSvgEditor): TemplateResult {
  const v = ed.view;
  const f = ed.doc.vb;
  const live = ed.liveShape?.shape;
  return html`<svg class="art" aria-hidden="true" style=${ed.img?.artColours() ?? (ed.mcu ? `--m:${ed.pvMain};--a:${ed.pvAccent}` : '--m: var(--mc-text, #212121); --a: var(--art-accent)')}>
    <g transform=${`translate(${v.x} ${v.y}) scale(${v.zoom})`}>
      <rect class="board" x=${f.x} y=${f.y} width=${f.w} height=${f.h}></rect>
      ${guard([ed.doc.shapes, ed.doc.groups, ed.moving], () => svg`${ed.img ? svg`<defs>${ed.img.defs(ed.doc)}</defs>` : nothing}${artNodes(ed.doc, true, ed.moving, ed.img)}`)}
      ${live ? svg`<g class="ghost">${artNodes({ ...ed.doc, shapes: [live] }, true, undefined, ed.img)}</g>` : nothing}
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
  if (ed.tool === 'rect') return html`<div class="opts">${numField('o-radius', t('Corner radius'), o.r, (n) => set({ r: Math.max(0, n) }), { min: 0 })}</div>`;
  if (ed.tool === 'pen') return html`<div class="opts">${btn(t('Finish path'), undefined, () => ed.finishPath(), { text: true })}</div>`;
  return nothing;
}

/** Polygon or star: the corner count, asked in a window so the canvas keeps its size. Enter is OK, Esc and Cancel go back to the tool before. */
function polyWin(ed: McSvgEditor): TemplateResult {
  const o = ed.opts;
  const set = (patch: Partial<typeof o>): void => void (ed.opts = { ...o, ...patch });
  const enter = (e: KeyboardEvent): void => {
    const el = e.target as HTMLInputElement;
    if (e.key !== 'Enter' || el.type === 'checkbox' || el.getAttribute('role') === 'switch') return;
    e.preventDefault();
    el.dispatchEvent(new Event('change', { bubbles: true }));
    ed.polyOk();
  };
  return html`<mc-ui-window variant="dialog" size="s" heading=${t('Polygon or star')} closeLabel=${t('Close')} @mc-window-close=${() => ed.polyCancel()}>
    <div class="dlg" @keydown=${enter}>
      ${numField('o-sides', t('Corners'), o.sides, (n) => set({ sides: Math.min(24, Math.max(3, Math.round(n))) }), { min: 3, max: 24, step: 1 })}
      ${chk('sw-star', t('Star'), o.star, (v) => set({ star: v }))}
      ${o.star ? numField('o-inner', t('Inner size'), o.inner, (n) => set({ inner: Math.min(0.95, Math.max(0.1, n)) }), { min: 0.1, max: 0.95, step: 0.05 }) : nothing}
    </div>
    <div slot="footer" class="foot">
      ${btn(t('Cancel'), undefined, () => ed.polyCancel(), { text: true, size: 'md' })}
      ${btn(t('OK'), undefined, () => ed.polyOk(), { text: true, size: 'md', variant: 'primary' })}
    </div>
  </mc-ui-window>`;
}

function pointFields(ed: McSvgEditor, prefix: string, field?: string, back?: () => void): TemplateResult | typeof nothing {
  const c = ed.pointCtx;
  if (!c) return nothing;
  const a = c.a;
  return html`${segc(t('Type'), c.kind, [['corner', t('Corner')], ['smooth', t('Smooth')]], (k) => ed.setKind(k))}
    <div class="grid2">
      ${numField(`${prefix}-x`, t('X'), a.x, (n) => ed.editPoint((p, i) => E.moveAnchor(p, i, n, p.anchors[i].y), 'Move point', 'px'), { field, back })}
      ${numField(`${prefix}-y`, t('Y'), a.y, (n) => ed.editPoint((p, i) => E.moveAnchor(p, i, p.anchors[i].x, n), 'Move point', 'py'), { back })}
    </div>`;
}

function pointBar(ed: McSvgEditor): TemplateResult | typeof nothing {
  const c = ed.pointCtx;
  if (!c) return nothing;
  return html`<div class="pointbar" role="group" aria-label=${t('Selected point')}>
    <strong>${t('Point {index} of {count}', { index: c.i + 1, count: c.p.anchors.length })}</strong>
    ${btn(t('Previous'), undefined, () => ed.stepPoint(-1), { text: true })}${btn(t('Next'), undefined, () => ed.stepPoint(1), { text: true })}
    ${pointFields(ed, 'pb', 'pxb', () => ed.canvas()?.focusAnchor(c.pathIndex, c.i))}
  </div>`;
}

function nudgePad(ed: McSvgEditor): TemplateResult | typeof nothing {
  if (!ed.coarse || !ed.nudgePad || (ed.tool !== 'node' && ed.tool !== 'select') || (!ed.pointCtx && !ed.sel.length)) return nothing;
  const k = (g: GlyphName, label: string, dx: number, dy: number) => btn(label, g, () => ed.nudge(dx, dy), { size: 'md' });
  return html`<div class="pad" role="group" aria-label=${t('Nudge')}>
    ${k('arrowLeft', t('Left'), -1, 0)}${k('arrowUp', t('Up'), 0, -1)}${k('arrowDown', t('Down'), 0, 1)}${k('arrowRight', t('Right'), 1, 0)}
    ${chk('sw-big', t('Move in steps of 4'), ed.nudgeBig, (v) => (ed.nudgeBig = v))}
  </div>`;
}

// ── left panel ──

function leftPanel(ed: McSvgEditor): TemplateResult {
  return html`<aside class=${`left${ed.overlay ? ' sheet' : ''}`} id="side" aria-label=${t('Layers and library panel')} ?inert=${ed.lips.isHidden('side')} data-lip=${ed.lips.state('side')} data-dir=${ed.lips.dir} role=${ed.overlay ? 'dialog' : nothing} aria-modal=${ed.overlay ? 'false' : nothing}>
    ${ed.overlay ? html`<div class="sheet-head">${btn(t('Close'), 'close', () => (ed.overlay = false))}</div>` : nothing}
    ${ed.img ? nothing : seg({ role: 'radiogroup', label: t('Panel'), full: true, value: ed.panel, items: [{ value: 'layers', label: t('Layers') }, { value: 'library', label: t('Library') }], onChange: (p) => ed.openPanel(p) })}
    ${ed.panel === 'layers' || ed.img ? guard([ed.listKey, ed.sel, ed.cur, ed.drag, ed.tmsg, ed.renaming, ed.menu, ed.layout, ed.tool], () => layersPanel(ed)) : libraryPanel(ed)}
  </aside>`;
}

function layersPanel(ed: McSvgEditor): TemplateResult {
  const some = ed.sel.length > 0;
  const one = subject(ed);
  const blocked = groupBlocked(ed);
  return html`<div class="layers">
    ${ed.doc.shapes.length ? layerTree(ed) : html`<p class="help">${t('No layers yet.')}</p>`}
    <div class="acts">
      ${ed.img?.addTextButton()}${btn(t('Add group'), 'group', () => ed.group(), { disabled: ed.sel.length < 2 || blocked })}${btn(t('Duplicate'), 'contentCopy', () => ed.duplicate(), { disabled: !some, keys: 'Control+D' })}${btn(t('Delete'), 'delete', () => ed.deleteSelected(), { disabled: !some })}
      ${btn(t('Select all'), 'selectAll', () => ed.select(ed.doc.shapes.map((x) => x.id)), { keys: 'Control+A' })}${button({ label: t('Move to…'), glyph: 'swapVertical', iconOnly: true, size: 'sm', haspopup: 'menu', expanded: !!ed.menu && ed.menu.opener.getAttribute('aria-label') === t('Move to…'), disabledReason: one ? undefined : t('Move to…'), onClick: (e) => one && ed.moveMenuOpen(e.currentTarget as HTMLElement) })}
      ${btn(t('Move up'), 'arrowUp', () => one && ed.reorder(one, 1), { disabled: !one })}${btn(t('Move down'), 'arrowDown', () => one && ed.reorder(one, -1), { disabled: !one })}
    </div>
    ${blocked ? html`<p class="help">${t('Groups can be 4 levels deep.')}</p>` : nothing}
    <p class="help">${t('Move: Alt+Up / Down. In or out of a group: Alt+Shift+Right / Left.')}</p>
  </div>`;
}

function libraryPanel(ed: McSvgEditor): TemplateResult {
  const l = ed.lib;
  if (ed.libraryMissing)
    return html`<div class="libmsg"><p>${t('Keep your own icons for every dashboard with the free Magic Card Utils add-on. Until then, what you draw is saved in this card only.')}</p><div class="acts"><a class="btn btn-secondary btn-sm" href="https://github.com/therealmcsparrow/magic-card-utils" target="_blank" rel="noopener">${t('How to install')}</a>${btn(t('Copy as SVG'), 'contentCopy', () => ed.copySvg(), { text: true })}</div></div>`;
  if (l.state === 'idle' || l.state === 'loading') return html`<p class="help" role="status">${t('Loading your icons…')}</p>`;
  if (l.state === 'readonly' || l.state === 'unreachable' || l.state === 'invalid' || l.state === 'conflict' || l.state === 'full')
    return html`<div class="libmsg"><p role="alert">${t('Could not reach Magic Card Utils. Your work is safe.')}</p><div class="acts">${btn(t('Try again'), undefined, () => void ed.loadLib(), { text: true })}${btn(t('Copy as SVG'), 'contentCopy', () => ed.copySvg(), { text: true })}</div></div>`;
  const q = l.q.trim().toLowerCase();
  const items = l.items
    .filter((i) => !q || i.name.toLowerCase().includes(q) || i.id.includes(q))
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  return html`<div class="lib">
    <p class="help">${t('Use follows the library: change "Lamp" and every card that uses it changes. Use as copy makes the card independent.')}</p>
    ${field({ id: 'lib-search', label: t('Search my icons'), control: html`<input id="lib-search" class="input" type="search" placeholder=${t('Search my icons')} .value=${l.q} @input=${(e: Event) => (ed.lib = { ...ed.lib, q: (e.target as HTMLInputElement).value })} />` })}
    ${l.items.length === 0
      ? html`<p class="help" role="status">${t('No saved icons yet. Save an icon here and use it on any dashboard.')}</p>`
      : items.length === 0
        ? html`<p class="help" role="status">${t('No matches for "{query}". Clear the search.', { query: l.q })}</p>`
        : html`<div class="rows" role="list">
            ${items.map((i) =>
              row({
                id: i.id,
                name: i.name,
                content: html`<span class="name" title=${i.id}>${i.name}</span>`,
                trail: html`<span class="acts"><button type="button" class="btn btn-text btn-sm" title=${t('Adds {name} as new layers. Your drawing is kept.', { name: i.name })} aria-label=${`${t('Insert')} ${i.name}`} @click=${() => void ed.insertIcon(i.id)}>${t('Insert')}</button>${button({ label: t('Delete {name}', { name: i.name }), glyph: 'delete', iconOnly: true, size: 'sm', onClick: () => ed.removeIcon(i.id) })}</span>`,
              }),
            )}
          </div>`}
    ${btn(t('Save current icon'), undefined, () => ed.openSave(), { text: true, disabled: !!ed.out.error })}
    <p class="help">${t('Stored in Magic Card Utils. Also available in Home Assistant as mcu:<name>.')}</p>
    ${ed.deleted ? notice({ tone: 'info', text: t('Deleted {name}. Cards that use it show the default icon unless they keep a copy.', { name: ed.deleted.item.name }), action: { label: t('Undo'), onClick: () => ed.undoDelete() }, transient: true }) : nothing}
  </div>`;
}

// ── inspector ──

function inspector(ed: McSvgEditor): TemplateResult {
  const sel = ed.selected;
  return html`<aside class="insp" id="inspector" aria-label=${t('Inspector panel')} ?inert=${ed.lips.isHidden('inspector')} data-lip=${ed.lips.state('inspector')} data-dir=${ed.lips.dir}>
    ${ed.pointCtx ? pointSection(ed) : nothing}
    ${sel.length ? shapeSections(ed, sel) : html`${ed.pt ? pathSection(ed) : nothing}${documentSection(ed)}`}
  </aside>`;
}

function gridChips(ed: McSvgEditor): TemplateResult {
  const chips = ed.img?.grid.chips ?? GRID_CHIPS;
  const [lo, hi] = ed.img ? [ed.img.grid.min, ed.img.grid.max] : [GRID_MIN, GRID_MAX];
  const items: Array<[string, string]> = [...chips.map((g): [string, string] => [String(g), String(g)]), ['custom', t('Custom')]];
  const cur = ed.gridCustom ? 'custom' : chips.includes(ed.grid) ? String(ed.grid) : 'custom';
  const pickChip = (k: string): void => {
    if (k === 'custom') {
      ed.gridCustom = true;
      ed.gridMsg = undefined;
    } else ed.setGrid(parseFloat(k));
  };
  return html`<div class="field">
    <div class="field-head"><span id="gs-l" class="lbl">${t('Grid size')}</span></div>
    ${segc(t('Grid size'), cur, items, pickChip)}
    ${cur === 'custom'
      ? field({
          id: 'grid-custom',
          label: t('Custom grid size'),
          control: html`<span class="row-u"
            ><input id="grid-custom" class="input" type="number" inputmode="decimal" step="0.05" min=${lo} max=${hi} data-field="grid-custom" aria-invalid=${ed.gridMsg?.error ? 'true' : 'false'} aria-describedby="gs-m" .value=${fmt(ed.grid)} @input=${(e: Event) => ed.typeGrid((e.target as HTMLInputElement).value, false)} @change=${(e: Event) => {
              const el = e.target as HTMLInputElement;
              ed.typeGrid(el.value, true);
              if (!ed.gridMsg?.error) el.value = fmt(ed.grid);
            }} /><span>${t('units')}</span></span
          >`,
        })
      : nothing}
    <p id="gs-m" class=${`help${ed.gridMsg?.error ? ' error' : ''}`} role=${ed.gridMsg?.error ? 'alert' : nothing}>${ed.gridMsg ? ed.gridMsg.text : ed.snapOn ? t('Snapping and the arrow keys move by this size.') : t('Arrow keys move by 0.5. Turn on Snap to use the grid size.')}</p>
  </div>`;
}

function documentSection(ed: McSvgEditor): TemplateResult {
  return html`${group(
      t('Document'),
      html`<p class="help">${t('Nothing selected. Pick a layer, or click a shape.')}</p>
        ${ed.img ? nothing : dualSwitch(ed)} ${gridChips(ed)}
        ${ed.img ? nothing : chk('sw-safe', t('Show 20 x 20 safe area'), ed.safe, (v) => { ed.safe = v; ed.checks(); })}
        ${chk('sw-nudge', t('Show nudge pad'), ed.nudgePad, (v) => (ed.nudgePad = v))}`,
      3,
    )}
    ${ed.img ? nothing : group(
      t('Tidy'),
      html`${pick('tidy-decimals', t('Decimals'), ed.decimals, [0, 1, 2, 3].map((k) => [k, String(k)]), (v) => { ed.decimals = parseInt(v, 10); ed.refresh(); })}
        <p class="help">${t('Fewer decimals make a smaller icon. Hidden layers are not saved.')}</p>
        ${ed.out.bytes >= 24 * 1024 ? html`<p class="help error">${t('Getting big. Tidy reduces precision and drops hidden layers.')}</p><div class="acts">${btn(t('Tidy now'), undefined, () => ed.tidyNow(), { text: true })}</div>` : nothing}`,
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
  return html`<div class="result">${notice({ tone: n.tone, text: n.lines, action: n.action ? { label: n.action.label, onClick: () => n.action!.run() } : undefined, transient: true })}</div>`;
}

/** A button that stays focusable when unavailable; the editor says why when it is pressed. */
function abtn(label: string, g: GlyphName, on: () => void, off: boolean): TemplateResult {
  return btn(label, g, on, { text: true, disabled: off });
}

function arrangeRow(ed: McSvgEditor): TemplateResult {
  const hows: Array<[SvgArrange, GlyphName]> = [['front', 'arrangeBringToFront'], ['forward', 'arrangeBringForward'], ['backward', 'arrangeSendBackward'], ['back', 'arrangeSendToBack']];
  return html`<div class="acts arr">${hows.map(([h, g]) => abtn(t(ARRANGE[h]), g, () => ed.arrange(h), !ed.canArrange(h)))}</div>`;
}

function shapeSections(ed: McSvgEditor, sel: Shape[]): TemplateResult {
  const one = sel.length === 1 ? sel[0] : undefined;
  const b = ed.unionBox;
  const locked = sel.every((s) => s.locked);
  const first = sel[0];
  const off = { disabled: locked };
  return html`${group(
      one ? one.name : t('{c} shapes selected', { c: sel.length }),
      one ? field({ id: 'sh-name', label: t('Rename'), control: html`<input id="sh-name" class="input" type="text" .value=${one.name} @change=${(e: Event) => ed.renameShape(one.id, (e.target as HTMLInputElement).value)} />` }) : nothing,
      3,
    )}
    ${ed.img?.text(first)}
    ${group(
      t('Position and size'),
      html`<div class="grid2">
          ${numField('sh-x', t('X'), b?.x, (n) => ed.setBox({ x: n }, 'Move'), off)}${numField('sh-y', t('Y'), b?.y, (n) => ed.setBox({ y: n }, 'Move'), off)}
          ${numField('sh-w', t('Width'), b?.w, (n) => ed.setBox({ w: n }, 'Resize'), { ...off, min: 0.1 })}${numField('sh-h', t('Height'), b?.h, (n) => ed.setBox({ h: n }, 'Resize'), { ...off, min: 0.1 })}
          ${numField('sh-angle', t('Angle'), one?.angle ?? 0, (n) => ed.setAngle(n), { disabled: locked || !one, step: 1 })}
        </div>
        ${chk('sw-ratio', t('Lock ratio'), ed.lockRatio, (v) => (ed.lockRatio = v))}
        <div class="acts">
          ${btn(t('Rotate -15'), 'rotateLeft', () => ed.rotate(-15), off)}${btn(t('Rotate +15'), 'rotateRight', () => ed.rotate(15), off)}${btn(t('Rotate 90 degrees anticlockwise'), 'rotateLeftVariant', () => ed.rotate(-90), off)}${btn(t('Rotate 90 degrees clockwise'), 'rotateRightVariant', () => ed.rotate(90), off)}
          ${btn(t('Flip horizontally'), 'flipHorizontal', () => ed.flip('h'), { ...off, keys: 'Shift+H' })}${btn(t('Flip vertically'), 'flipVertical', () => ed.flip('v'), { ...off, keys: 'Shift+V' })}
        </div>`,
    )}
    ${ed.pt ? pathSection(ed) : nothing}
    ${one && (one.type === 'rect' || one.type === 'polygon' || one.type === 'star')
      ? group(
          t('Shape options'),
          html`${one.type === 'rect' ? numField('to-r', t('Corner radius'), one.r ?? 0, (n) => ed.option({ r: Math.max(0, n) }), { min: 0 }) : numField('to-sides', t('Corners'), one.sides ?? 5, (n) => ed.option({ sides: Math.min(24, Math.max(3, Math.round(n))) }), { min: 3, max: 24, step: 1 })}
          ${one.type === 'star' ? numField('to-inner', t('Inner size'), one.inner ?? 0.5, (n) => ed.option({ inner: Math.min(0.95, Math.max(0.1, n)) }), { min: 0.1, max: 0.95, step: 0.05 }) : nothing}`,
        )
      : nothing}
    ${group(
      t('Fill and stroke'),
      html`${ed.img ? nothing : dualSwitch(ed)}
        ${ed.img ? ed.img.paint(first, 'fill') : html`<div class="field"><div class="field-head"><span class="lbl">${t('Fill')}</span></div>${segc(t('Fill'), first.fill, paintItems(ed.dualOn), (v) => ed.setPaint('fill', v))}</div>`}
        ${ed.img ? ed.img.paint(first, 'stroke') : html`<div class="field"><div class="field-head"><span class="lbl">${t('Stroke')}</span></div>${segc(t('Stroke'), first.stroke, paintItems(ed.dualOn), (v) => ed.setPaint('stroke', v))}</div>`}
        <p class="help">${t('Main follows the entity colour. Accent follows the card\'s secondary colour. Colours come from the card, so the icon can change with state.')}</p>
        ${first.stroke !== 'none'
          ? html`<div class="grid2">
              ${numField('st-w', t('Width'), first.width, (n) => ed.patch({ width: Math.max(0.1, n) }, 'Stroke width', 'sw'), { min: 0.1, step: 0.25 })}
              ${pick('st-cap', t('Cap'), first.cap, [['butt', t('Flat')], ['round', t('Round')], ['square', t('Square')]], (v) => ed.patch({ cap: v as Shape['cap'] }, 'Stroke cap'))}
              ${pick('st-join', t('Join'), first.join, [['miter', t('Sharp')], ['round', t('Round')], ['bevel', t('Bevel')]], (v) => ed.patch({ join: v as Shape['join'] }, 'Stroke join'))}
            </div>`
          : nothing}
        ${ed.img ? ed.img.more(first) : nothing}`,
    )}
    ${group(
      t('Layer'),
      html`${arrangeRow(ed)}
        ${pick('ly-rule', t('Fill rule'), first.rule, [['nonzero', t('Solid')], ['evenodd', t('Holes where shapes overlap')]], (v) => ed.patch({ rule: v as Shape['rule'] }, 'Fill rule'))}
        <p class="help">${t('Use holes when overlapping parts should cut each other out.')}</p>
        ${chk('sw-hidden', t('Hidden'), !!first.hidden, (v) => ed.patch({ hidden: v }, 'Hide'))}
        ${chk('sw-locked', t('Locked'), !!first.locked, (v) => ed.patch({ locked: v }, 'Lock'), ed.img?.lockNote(first))}`,
    )}`;
}

function pointSection(ed: McSvgEditor): TemplateResult {
  const c = ed.pointCtx!;
  const a = c.a;
  const hand = (which: 'in' | 'out'): TemplateResult | typeof nothing => {
    const h = a[which];
    if (!h) return nothing;
    const ang = (Math.atan2(h[1] - a.y, h[0] - a.x) * 180) / Math.PI;
    const len = Math.hypot(h[0] - a.x, h[1] - a.y);
    const set = (angle: number, length: number): void => {
      const r = (angle * Math.PI) / 180;
      ed.editPoint((p, i) => E.setHandle(p, i, which, [a.x + Math.cos(r) * length, a.y + Math.sin(r) * length]), 'Move handle', which);
    };
    return html`<div class="grid2">${numField(`pt-${which}-a`, which === 'out' ? t('Out handle angle') : t('In handle angle'), ang, (n) => set(n, len), { step: 1 })}${numField(`pt-${which}-l`, which === 'out' ? t('Out handle length') : t('In handle length'), len, (n) => set(ang, Math.max(0.01, n)), { min: 0.01 })}</div>`;
  };
  return group(
    t('Selected point'),
    html`<p class="help">${t('Point {index} of {count}', { index: c.i + 1, count: c.p.anchors.length })}</p>
      ${pointFields(ed, 'pt', 'px', () => ed.canvas()?.focusAnchor(c.pathIndex, c.i))}${hand('out')}${hand('in')}
      <div class="acts">
        ${btn(t('Previous'), undefined, () => ed.stepPoint(-1), { text: true })}${btn(t('Next'), undefined, () => ed.stepPoint(1), { text: true })}
        ${btn(t('Add point after'), 'add', () => ed.addAfter(), { text: true, disabled: !ed.canAddPoint })}${btn(t('Delete point'), 'delete', () => ed.deletePoint(), { text: true })}
        ${btn(c.p.closed ? t('Open path') : t('Close path'), undefined, () => ed.editPoint((p) => E.setClosed(p, !p.closed), 'Close path'), { text: true })}${btn(t('Reverse direction'), undefined, () => ed.editPoint((p) => E.reverse(p), 'Reverse'), { text: true })}
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
    html`<div class="pv-tile" style=${`background:${c.ground};--m:${ed.mcu ? ed.pvMain : c.m};--a:${ed.mcu ? ed.pvAccent : c.a}`} role="img" aria-label=${t('Preview at {px} pixels', { px })}>
      ${guard([doc.shapes, doc.groups, ed.pvTheme, px], () => html`<svg viewBox=${viewBox(doc)} width=${px} height=${px} aria-hidden="true">${artNodes(doc)}</svg>`)}
    </div>`;
  const haTile = (px: number): TemplateResult =>
    html`<div class="pv-tile" style=${`background:${c.ground};color:${ed.mcu ? ed.pvMain : c.m}`} role="img" aria-label=${t('In Home Assistant at {px} pixels', { px })}>
      ${ha && !ha.empty ? html`<svg viewBox=${ha.viewBox} width=${px} height=${px} aria-hidden="true">${ha.secondary ? svg`<path d=${ha.secondary} fill="currentColor" opacity=${HA_SECONDARY_OPACITY}></path>` : nothing}${ha.path ? svg`<path d=${ha.path} fill="currentColor" fill-rule="nonzero"></path>` : nothing}</svg>` : nothing}
    </div>`;
  const warn = ha && haWarns(ha);
  const colour = (id: string, label: string, v: string, on: (v: string) => void): TemplateResult =>
    field({ id, label, control: html`<input id=${id} type="color" class="swatch" .value=${v} @input=${(e: Event) => on((e.target as HTMLInputElement).value)} />` });
  return html`<div class="pv">
    ${segc(t('Preview'), ed.pvTheme, [['light', t('Light')], ['dark', t('Dark')], ['on', t('Entity on')], ['off', t('Entity off')]] as Array<['light' | 'dark' | 'on' | 'off', string]>, (t) => (ed.pvTheme = t))}
    ${ed.mcu ? html`<div class="acts">${colour('pv-main', t('Main preview colour'), ed.pvMain, (v) => (ed.pvMain = v))}${colour('pv-accent', t('Accent preview colour'), ed.pvAccent, (v) => (ed.pvAccent = v))}</div>` : nothing}
    <div class="pv-g pv-mc"><span class="help">${t('In Magic Card')}</span><div class="pv-row">${tile(24)}${tile(48)}${tile(96)}</div></div>
    <div class="pv-g pv-ha"><span class="help" title=${t('How Home Assistant draws a saved icon in its own cards: one colour, filled shapes only.')}>${t('In Home Assistant')}</span><div class="pv-row">${[24, 48].map(haTile)}</div></div>
    ${warn ? notice({ tone: 'warn', text: ha.empty ? t('Home Assistant would show nothing for this drawing. It draws filled shapes only.') : t('Home Assistant would show little of this drawing. It draws one filled shape without strokes.') }) : nothing}
  </div>`;
}

function previewPop(ed: McSvgEditor): TemplateResult {
  return html`<mc-ui-popover id="pv" label=${t('Preview')} .align=${'start'} @mc-popover-close=${() => (ed.pvOpen = false)}>${previews(ed)}</mc-ui-popover>`;
}

function helpPop(ed: McSvgEditor): TemplateResult {
  return html`<mc-ui-popover id="help-pop" label=${t('Shortcuts')} .align=${'end'} @mc-popover-close=${() => ed.dlg === 'help' && (ed.dlg = undefined)}>
    <div class="pop-body" tabindex="-1">
      <h2 class="title">${t('Shortcuts')}</h2>
      <ul class="help-list">${hintFor(ed) ? html`<li>${hintFor(ed)}</li>` : nothing}<li>${ed.img ? ed.img.keys : t(HELP_KEYS[0])}</li>${HELP_KEYS.slice(1).map((x) => html`<li>${t(x)}</li>`)}</ul>
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
  return html`<mc-ui-window variant="dialog" size="m" heading=${t('Save to library')} closeLabel=${t('Close')} @mc-window-close=${() => ed.dlg === 'save' && (ed.dlg = undefined)}>
    <div class="dlg" @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && (e.target as HTMLInputElement).type === 'text' && (e.preventDefault(), go(mode))}>
      ${field({
        id: 'save-name',
        label: t('Name'),
        help: `${t('Short, no slashes. Shown in the list.')} ${t('Used as mcu:{id}', { id: target?.id ?? freeId(name, new Set(ed.lib.items.map((i) => i.id))) })}`,
        control: html`<input id="save-name" class="input" type="text" maxlength="60" .value=${ed.saveName} aria-describedby="save-name-help save-err" aria-invalid=${ed.saveError ? 'true' : 'false'} @input=${(e: Event) => { ed.saveName = (e.target as HTMLInputElement).value; ed.saveError = ''; }} />`,
      })}
      <p id="save-err" class="help error" role="alert" ?hidden=${!ed.saveError}>${ed.saveError}</p>
      ${target ? notice({ tone: 'warn', text: [clash ? t('An icon named {name} exists.', { name: target.name }) : '', t('Changes every card that uses {name}.', { name: target.name })].filter(Boolean) }) : nothing}
      ${chk('sw-keep', `${t('Keep a copy in this card')} (${t('adds {size} KB', { size: kbOf(bytes) })})`, ed.keepCopy, (v) => (ed.keepCopy = v), t('Without a copy, the card shows the default icon if Magic Card Utils or this icon is removed.'))}
    </div>
    <div slot="footer" class="foot">
      ${btn(t('Cancel'), undefined, () => (ed.dlg = undefined), { text: true, size: 'md' })}
      ${target && !clash ? btn(t('Save as new'), undefined, () => go('new'), { text: true, size: 'md', disabled: ed.saveBusy }) : nothing}
      ${btn(target ? t('Update "{name}"', { name: target.name }) : t('Save'), undefined, () => go(mode), { text: true, size: 'md', variant: 'primary', disabled: ed.saveBusy })}
    </div>
  </mc-ui-window>`;
}

function leaveWin(ed: McSvgEditor): TemplateResult {
  const body = ed.mcu ? t('Changes you have not saved are lost.') : ed.savedCurrent ? `${t('Use it on this card to keep your work, or leave without using it.')} ${t('It is saved in the library.')}` : t('Use it on this card to keep your work, or leave without using it.');
  return confirm(
    ed.mcu ? t('Leave without saving?') : t('This is not used on the card yet.'),
    html`<p>${body}</p>`,
    html`${btn(t('Keep editing'), undefined, () => (ed.leaving = false), { text: true, size: 'md' })}
      ${btn(ed.mcu ? t('Leave') : t('Leave without using'), undefined, () => ed.leave(), { text: true, size: 'md', variant: 'danger' })}
      ${ed.mcu ? nothing : btn(t('Use on this card'), undefined, () => ed.done(), { text: true, size: 'md', variant: 'primary', disabled: !!ed.blockReason })}`,
    () => (ed.leaving = false),
    'm',
  );
}

function newWin(ed: McSvgEditor): TemplateResult {
  return confirm(
    t('Start over?'),
    html`<p>${t('Unsaved changes are lost.')}</p>`,
    html`${btn(t('Keep editing'), undefined, () => ed.closeNew(), { text: true, size: 'md' })}${btn(t('Start over'), undefined, () => ed.confirmNew(), { text: true, size: 'md', variant: 'danger' })}`,
    () => ed.newAsk && ed.closeNew(),
  );
}

void byId;
