import { html, nothing, svg, type ReactiveController, type ReactiveControllerHost, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  LIP_HOST_ATTR,
  PANEL_CHANGE_EVENT,
  PANEL_HINT_PREFIX,
  PANEL_IDS,
  PANEL_MEMORY_MAX,
  PANEL_MEMORY_PREFIX,
  type PanelChange,
  type PanelDir,
  type PanelEditorId,
  type PanelLipSpec,
  type PanelLipStrings,
  type PanelLipsController,
  type PanelLipsOptions,
  type PanelState,
} from '../../contracts/ui-kit';
import { DirectionController } from './direction';

type Host = ReactiveControllerHost & HTMLElement;

const CHEVRON = svg`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

/** Ctrl or Cmd + backslash, and nothing that types a backslash (AltGr) or composes text. */
function isShortcut(e: KeyboardEvent): boolean {
  return (
    (e.ctrlKey || e.metaKey) &&
    !e.altKey &&
    !e.shiftKey &&
    !e.getModifierState?.('AltGraph') &&
    (e.key === '\\' || e.code === 'Backslash') &&
    !e.repeat &&
    !e.isComposing
  );
}

function storage(): Storage | null {
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

/**
 * PanelLips (contract ui-kit-lips): the lips that hide and show an editor's side panels, the memory per
 * device and editor, the one-time hint, the status region and the Ctrl/Cmd + \ shortcut. All state lives
 * on the instance.
 */
export class PanelLips implements ReactiveController, PanelLipsController {
  readonly editor: PanelEditorId;
  readonly direction: DirectionController;
  restoredFrom: 'none' | 'stored' | 'fallback' = 'none';

  private panels: readonly PanelLipSpec[];
  private strings: PanelLipStrings;
  private readonly keys: 'host' | 'manual';
  private readonly fallback?: () => readonly string[] | null;
  private hidden = new Set<string>();
  private cols: Record<string, boolean> = {};
  private _suspended = false;
  private remembered: string[] | null = null;
  private hintDone = false;
  private statusText = '';
  private frame = 0;

  constructor(private readonly host: Host, options: PanelLipsOptions) {
    this.editor = options.editor;
    this.panels = options.panels;
    this.strings = options.strings;
    this.keys = options.keys ?? 'host';
    this.fallback = options.fallback;
    this.direction = new DirectionController(host);
    host.addController(this);
  }

  /** Text direction of the host; follows the page direction and the mc-dir-change event. */
  get dir(): PanelDir {
    return this.direction.direction;
  }

  // ── lifecycle ──

  hostConnected(): void {
    this.host.setAttribute(LIP_HOST_ATTR, '');
    if (this.keys === 'host') this.host.addEventListener('keydown', this.onKeydown, { capture: true });
    this.restore();
  }

  hostDisconnected(): void {
    this.host.removeAttribute(LIP_HOST_ATTR);
    this.host.removeEventListener('keydown', this.onKeydown, { capture: true });
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  restore(): void {
    this.remembered = null;
    this.direction.sync();
    this.readMemory();
    this.hintDone = this.readFlag();
    this.host.requestUpdate();
  }

  setPanels(panels: readonly PanelLipSpec[], strings: PanelLipStrings): void {
    this.panels = panels;
    this.strings = strings;
    this.direction.sync();
    this.host.requestUpdate();
  }

  columns(map: Readonly<Record<string, boolean>>): void {
    const ids = new Set([...Object.keys(this.cols), ...Object.keys(map)]);
    let same = true;
    for (const id of ids) if (Boolean(this.cols[id]) !== Boolean(map[id])) same = false;
    if (same) return;
    this.cols = { ...map };
    this.host.requestUpdate();
  }

  get suspended(): boolean {
    return this._suspended;
  }

  set suspended(v: boolean) {
    if (v === this._suspended) return;
    this._suspended = v;
    this.host.requestUpdate();
  }

  // ── state ──

  state(id: string): PanelState {
    if (this._suspended || !this.cols[id] || !this.panels.some((p) => p.id === id)) return 'off';
    return this.hidden.has(id) ? 'hidden' : 'shown';
  }

  isHidden(id: string): boolean {
    return this.state(id) === 'hidden';
  }

  get active(): boolean {
    return !this._suspended && this.panels.some((p) => this.cols[p.id]);
  }

  toggle(id: string): void {
    this.remembered = null;
    this.apply([id], this.state(id) === 'shown', 'api');
  }

  show(id: string): void {
    this.remembered = null;
    this.apply([id], false, 'api');
  }

  hide(id: string): void {
    this.remembered = null;
    this.apply([id], true, 'api');
  }

  toggleAll(): boolean {
    const cols = this.panels.map((p) => p.id).filter((id) => this.state(id) !== 'off');
    if (!cols.length) return false;
    const shown = cols.filter((id) => !this.hidden.has(id));
    let ids: string[];
    let hide: boolean;
    if (shown.length) {
      this.remembered = shown;
      ids = shown;
      hide = true;
    } else {
      const back = (this.remembered ?? []).filter((id) => cols.includes(id));
      ids = back.length ? back : cols;
      hide = false;
      this.remembered = null;
    }
    if (!this.apply(ids, hide, 'key')) return false;
    this.announce(ids, hide);
    return true;
  }

  async reveal(id: string): Promise<void> {
    if (this.state(id) !== 'hidden') return;
    this.remembered = null;
    this.apply([id], false, 'reveal');
    await this.host.updateComplete;
  }

  handleKey(e: KeyboardEvent): boolean {
    if (e.defaultPrevented || !isShortcut(e)) return false;
    const path = e.composedPath();
    const own = path.indexOf(this.host);
    for (let i = 0; i < (own < 0 ? path.length : own); i++) {
      const n = path[i];
      if (n instanceof Element && n.hasAttribute(LIP_HOST_ATTR)) return false;
    }
    e.preventDefault();
    this.toggleAll();
    return true;
  }

  private onKeydown = (e: KeyboardEvent): void => {
    this.handleKey(e);
  };

  // ── changes ──

  /** Sets the hidden state of the column panels in `ids`; false when nothing changed. */
  private apply(ids: readonly string[], hide: boolean, cause: PanelChange['cause']): boolean {
    const changed = this.panels
      .map((p) => p.id)
      .filter((id) => ids.includes(id) && this.state(id) !== 'off' && this.hidden.has(id) !== hide);
    if (!changed.length) return false;
    const active = this.root()?.activeElement;
    const lost = hide
      ? changed.filter((id) => {
          const el = this.panelEl(id);
          return !!el && !!active && el.contains(active);
        })
      : [];
    for (const id of changed) {
      if (hide) this.hidden.add(id);
      else this.hidden.delete(id);
    }
    if (!hide) this.dismissHint();
    this.writeMemory();
    this.host.requestUpdate();
    if (lost.length) void this.host.updateComplete.then(() => this.lipEl(lost[0])?.focus());
    this.host.dispatchEvent(
      new CustomEvent<PanelChange>(PANEL_CHANGE_EVENT, {
        detail: { editor: this.editor, hidden: this.panels.map((p) => p.id).filter((id) => this.hidden.has(id)), cause },
      }),
    );
    return true;
  }

  private announce(ids: readonly string[], hide: boolean): void {
    const nouns = this.panels.filter((p) => ids.includes(p.id)).map((p) => p.noun);
    const template = hide ? this.strings.hidden : this.strings.shown;
    const loc = this.strings.locale;
    let text: string;
    try {
      const list = new Intl.ListFormat(loc, { type: 'conjunction' }).format(nouns);
      const raw = template.replace('{panels}', () => list);
      text = raw.charAt(0).toLocaleUpperCase(loc) + raw.slice(1);
    } catch {
      const raw = template.replace('{panels}', () => nouns.join(', '));
      text = raw.charAt(0).toUpperCase() + raw.slice(1);
    }
    this.statusText = '';
    this.host.requestUpdate();
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.statusText = text;
      this.host.requestUpdate();
    });
  }

  // ── memory ──

  private allowed(ids: readonly unknown[]): Set<string> {
    const allow = new Set<string>(PANEL_IDS[this.editor]);
    const out = new Set<string>();
    for (const id of ids) if (typeof id === 'string' && allow.has(id)) out.add(id);
    return out;
  }

  private readMemory(): void {
    this.hidden = new Set();
    this.restoredFrom = 'none';
    let raw: string | null;
    try {
      const ls = storage();
      if (!ls) return;
      raw = ls.getItem(PANEL_MEMORY_PREFIX + this.editor);
    } catch {
      return;
    }
    if (raw === null) {
      let ids: readonly string[] | null;
      try {
        ids = this.fallback?.() ?? null;
      } catch {
        ids = null;
      }
      const ok = this.allowed(ids ?? []);
      if (ok.size) {
        this.hidden = ok;
        this.restoredFrom = 'fallback';
        this.writeMemory();
      }
      return;
    }
    if (typeof raw !== 'string' || raw.length > PANEL_MEMORY_MAX) return;
    const ok = this.allowed(raw.split(','));
    if (ok.size) {
      this.hidden = ok;
      this.restoredFrom = 'stored';
    }
  }

  private writeMemory(): void {
    try {
      const ls = storage();
      if (!ls) return;
      const key = PANEL_MEMORY_PREFIX + this.editor;
      const ids = PANEL_IDS[this.editor].filter((id) => this.hidden.has(id));
      if (ids.length) ls.setItem(key, ids.join(','));
      else ls.removeItem(key);
    } catch {
      /* blocked or full: the choice holds for this visit only */
    }
  }

  private readFlag(): boolean {
    try {
      return storage()?.getItem(PANEL_HINT_PREFIX + this.editor) === '1';
    } catch {
      return false;
    }
  }

  // ── hint ──

  private hintPanel(): PanelLipSpec | undefined {
    if (this.hintDone || this.restoredFrom === 'none') return undefined;
    return this.panels.find((p) => this.state(p.id) === 'hidden');
  }

  private dismissHint(): void {
    if (this.hintDone) return;
    this.hintDone = true;
    try {
      storage()?.setItem(PANEL_HINT_PREFIX + this.editor, '1');
    } catch {
      /* blocked: the hint shows again on the next open */
    }
  }

  private closeHint(spec: PanelLipSpec): void {
    const root = this.root();
    const hint = root?.getElementById(`${spec.controls}-hint`);
    const inside = !!hint && !!root?.activeElement && hint.contains(root.activeElement);
    this.dismissHint();
    this.host.requestUpdate();
    if (inside) this.lipEl(spec.id)?.focus();
  }

  /** Escape on the lip that carries the hint dismisses the hint and goes no further. */
  private onLipKey(e: KeyboardEvent, spec: PanelLipSpec): void {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    e.stopPropagation();
    this.closeHint(spec);
  }

  private hintTemplate(spec: PanelLipSpec): TemplateResult {
    const hiddenCols = this.panels.filter((p) => this.state(p.id) === 'hidden');
    const s = this.strings;
    const text =
      this.restoredFrom === 'fallback'
        ? s.hintMigrated
        : hiddenCols.length === 1
          ? s.hintOne.replace('{noun}', () => hiddenCols[0].noun)
          : s.hintMany;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      e.stopPropagation();
      this.closeHint(spec);
    };
    return html`<div class="lip-hint" id="${spec.controls}-hint" data-side=${spec.side} data-dir=${this.dir} @keydown=${onKey}>
      <p>${text}</p>
      <p class="lip-hint-keys">${s.hintShortcut}</p>
      <button type="button" @click=${() => this.closeHint(spec)}>${s.gotIt}</button>
    </div>`;
  }

  // ── templates ──

  lip(id: string): TemplateResult | typeof nothing {
    const spec = this.panels.find((p) => p.id === id);
    if (!spec) return nothing;
    const st = this.state(id);
    if (st === 'off') return nothing;
    const hiddenNow = st === 'hidden';
    const showHint = this.hintPanel()?.id === id;
    return html`<button
        type="button"
        class="lip"
        data-side=${spec.side}
        data-dir=${this.dir}
        aria-expanded=${hiddenNow ? 'false' : 'true'}
        aria-controls=${spec.controls}
        aria-label=${spec.name}
        title=${hiddenNow ? spec.showLabel : spec.hideLabel}
        aria-describedby=${ifDefined(showHint ? `${spec.controls}-hint` : undefined)}
        @click=${(e: Event) => {
          // WebKit does not focus a button on a mouse click; the shortcut needs focus inside the host
          (e.currentTarget as HTMLElement | null)?.focus();
          this.remembered = null;
          this.apply([id], this.state(id) === 'shown', 'lip');
        }}
        @keydown=${showHint ? (e: KeyboardEvent) => this.onLipKey(e, spec) : nothing}
      >${CHEVRON}</button>${showHint ? this.hintTemplate(spec) : nothing}`;
  }

  status(): TemplateResult {
    return html`<div class="lip-status" role="status" aria-live="polite" aria-atomic="true">${this.statusText}</div>`;
  }

  // ── lookups ──

  private root(): ShadowRoot | null {
    return (this.host as unknown as { renderRoot?: ShadowRoot }).renderRoot ?? this.host.shadowRoot;
  }

  private panelEl(id: string): HTMLElement | null {
    const spec = this.panels.find((p) => p.id === id);
    return spec ? (this.root()?.getElementById(spec.controls) ?? null) : null;
  }

  private lipEl(id: string): HTMLElement | null {
    const spec = this.panels.find((p) => p.id === id);
    if (!spec) return null;
    for (const b of Array.from(this.root()?.querySelectorAll<HTMLElement>('.lip') ?? [])) {
      if (b.getAttribute('aria-controls') === spec.controls) return b;
    }
    return null;
  }
}
