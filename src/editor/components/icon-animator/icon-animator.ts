import type { TemplateResult } from 'lit';
import type {
  AnimationConfig,
  CardModule,
  DesignConfig,
  HomeAssistant,
  MagicCardConfig,
} from '../../../types';
import {
  validateAnimationDoc,
  type AnimationDoc,
  type TargetRef,
} from '../../../anim-studio/model';
// v2 checking (rig, tracks) in validateAnimationDoc: this chunk validates what Apply stores
import '../../../anim-studio/model-v2';
import type { IconGeometry } from '../../../icons/icon-source';
import { ICON_LIBRARY, libraryFor, type LibraryEntry } from '../../../icon-anim/library';
import {
  PART_PRESETS,
  applyPartPresetMany,
  clearPartMotion,
} from '../../../icon-anim/part-presets';
import { iconAnimationDoc } from '../../../icon-anim/icon-doc';
import {
  animatedSvgFileName,
  checkAnimatedSvg,
  exportAnimatedSvg,
} from '../../../icon-anim/animated-svg';
import { mdiGeometry } from '../../../icon-anim/mdi-paths';
import { splitIcon } from '../../../icons/icon-split';
import type { IconAnimatorHost } from './loader';
import type { AnimatedIconPick } from './animated-icon-grid';
import { cardState, patchCard } from './card-request';
import { FOLLOW_NOTES, LIVE, svgGeometry } from './follow-icon';
import { referenceMine } from './animated-icon-pick';
import {
  MINE_PREFIX,
  cardIds,
  referenceCount,
  storedDoc,
  newQuickId,
  iconEntry,
  removeInlineDoc,
  upsertInlineDoc,
  withQuickEntry,
  withoutQuickEntry,
} from './quick-model';

/*
 * The quick icon animator (lazy chunk magic-card-icon-animator.js): start from a library animation
 * for this icon / domain, or split the module's own icon and give its parts presets; a live preview
 * plays the result on a card; Apply stores it inline in the card and adds the animation entry.
 */

type Mode = 'library' | 'own';

/** The animated SVG export: the file text ('' when there is none) and why it can't be used. */
interface ExportResult {
  svg: string;
  warnings: string[];
  error?: string;
}

/**
 * A split of the module's own icon (not a library entry): its drawing embedded (`rig.svg`), or its
 * icon id (`rig.icon`) when the drawing is over the own-icon size cap. The validator allows only
 * one of the two, so a library document is told apart by its name, a copy of a My animations
 * document by its id (MINE_PREFIX).
 */
function isOwnDoc(doc: AnimationDoc, icon: string): boolean {
  const rig = doc.rig;
  if (!rig || doc.id.startsWith(MINE_PREFIX) || ICON_LIBRARY.some((e) => e.name === doc.name))
    return false;
  return rig.svg ? true : rig.icon === icon;
}

/** Both documents valid and the same once validated (leniently, as the card reads them). */
function sameDoc(a: unknown, b: unknown): boolean {
  const x = validateAnimationDoc(a, { v2: 'lenient' });
  const y = validateAnimationDoc(b, { v2: 'lenient' });
  return x.ok && y.ok && JSON.stringify(x.doc) === JSON.stringify(y.doc);
}

/** Default icons of the modules when neither the module nor its entity sets one. */
const FALLBACK_ICON: Record<string, string> = {
  button: 'mdi:gesture-tap',
  light: 'mdi:lightbulb',
  info: 'mdi:information-outline',
  icon: 'mdi:help',
};

/**
 * The design panel the animator sits in (design-panel.ts): the module's design, type, icon and
 * entity, its animation list writer (template sync included) and its open flag. Reading the panel
 * keeps the loader stub in magic-card.js to two bindings.
 */
export interface PanelLike {
  design: DesignConfig;
  hass?: HomeAssistant;
  moduleType: string;
  moduleEntity: string;
  /** 0 closed, 1 loading, 2 open, 3 failed to load. */
  _qa: number;
  _handleAnimationsChange(list: AnimationConfig[]): void;
  updateComplete: Promise<unknown>;
  shadowRoot: ShadowRoot | null;
}

interface PreviewCard extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(c: MagicCardConfig): void;
}

export const ICON_ANIMATOR_TAG = 'mc-icon-animator';

/**
 * Define <mc-icon-animator> with the card bundle's modules from `h` (loader.ts `host`). Lit comes
 * from the host too: the element extends the card bundle's LitElement.
 */
export function defineIconAnimator(h: IconAnimatorHost): void {
  if (customElements.get(ICON_ANIMATOR_TAG)) return;
  const { html, css } = h;
  /** Renders nothing (Lit's `nothing` is not passed in: an empty string renders the same here). */
  const nothing = '';

  class IconAnimator extends h.LitElement {
    static properties = {
      panel: { attribute: false },
      design: { attribute: false },
      _mode: { state: true },
      _doc: { state: true },
      _entry: { state: true },
      _part: { state: true },
      _preset: { state: true },
      _params: { state: true },
      _smil: { state: true },
      _msg: { state: true },
      _busy: { state: true },
    };

    static styles = [
      h.editorSystem,
      css`
        :host {
          display: block;
          min-width: 0;
        }
        .qa {
          display: grid;
          gap: 12px;
        }
        .stage {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .preview {
          flex: none;
          width: 112px;
          height: 96px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: var(--mc-radius-lg);
          border: 1px solid var(--mc-divider);
          background: var(--mc-surface-2);
        }
        .preview > * {
          width: 100%;
        }
        .stage-meta {
          display: grid;
          gap: 6px;
          min-width: 0;
        }
        .stage-meta .name {
          font-size: 0.875rem;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        button.chip[aria-pressed='true'] {
          color: var(--mc-accent-ink);
          border-color: color-mix(in srgb, var(--mc-accent) 45%, transparent);
          background: var(--mc-accent-tint);
        }
        .chip .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }
        .params {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 8px 12px;
        }
        .row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 4px 8px;
        }
        .row.end {
          justify-content: flex-start;
        }
        a.btn {
          text-decoration: none;
          justify-self: start;
        }
        .danger-text {
          color: var(--mc-error-ink);
        }
        .danger-text:hover {
          background: color-mix(in srgb, var(--mc-error-ink) 10%, transparent);
        }
        .sep {
          height: 1px;
          background: var(--mc-divider);
        }
      `,
    ];

    panel?: PanelLike;
    /** The panel's design (bound so every design edit re-renders the animator). */
    design?: DesignConfig;

    get hass(): HomeAssistant | undefined {
      return this.panel?.hass;
    }
    get moduleType(): string {
      return this.panel?.moduleType ?? '';
    }
    /** The edited module (the editor's selection; the Design tab shows the selected module). */
    get module(): CardModule | undefined {
      const m = cardState(this)?.getSelectedModule();
      return m && m.type === this.moduleType ? m : undefined;
    }
    /** The module's own icon ('' when it shows its entity's icon or an own SVG). */
    get moduleIcon(): string {
      const m = this.module;
      return m && !m.use_entity_icon && typeof m.icon === 'string' && m.icon !== 'svg'
        ? m.icon
        : '';
    }
    get moduleEntity(): string {
      return this.panel?.moduleEntity ?? '';
    }
    /** Write the module's animation list. */
    onAnimations(list: AnimationConfig[]): void {
      this.panel?._handleAnimationsChange(list);
    }
    /** Close: the panel shows "Animate icon" again, which gets the focus back. */
    onClose(): void {
      const p = this.panel;
      if (!p) return;
      p._qa = 0;
      void p.updateComplete.then(() =>
        p.shadowRoot?.querySelector<HTMLElement>('.qa-open')?.focus(),
      );
    }

    private _mode: Mode = 'library';
    private _doc?: AnimationDoc;
    private _entry = '';
    private _unsubLib?: () => void;
    /** The My animations document the working one came from (a pick, or the module's reference). */
    private _mine = '';
    private _part = '';
    private _preset = PART_PRESETS[0]?.id ?? '';
    private _params: Record<string, number> = {};
    private _smil = true;
    private _msg = '';
    private _busy = false;
    /** Module key the working document belongs to (a new module starts over). */
    private _key = '';
    private _card?: PreviewCard;
    private _previewJson = '';
    /** Icon shapes by ref (resolved through the card bundle's icon source). */
    private _geoms = new Map<string, IconGeometry>();
    /** Refs being resolved (one lookup each). */
    private _pending = new Set<string>();

    /** The icon the module shows (own icon, else its entity's, else the module default). */
    get icon(): string {
      if (this.moduleIcon) return this.moduleIcon;
      return (
        h.entityIcon(this.hass, this.moduleEntity || undefined) ||
        FALLBACK_ICON[this.moduleType] ||
        'mdi:help'
      );
    }

    private get _domain(): string {
      return this.moduleEntity.includes('.')
        ? this.moduleEntity.slice(0, this.moduleEntity.indexOf('.'))
        : '';
    }

    private _list(): AnimationConfig[] {
      return h.readAnimations(this.design ?? this.panel?.design);
    }

    /** The card config (undefined outside the card editor). */
    private _config(): MagicCardConfig | undefined {
      return cardState(this)?.getConfig();
    }

    /** The document the card plays for `id` (its own, else a linked template's). */
    private _stored(config: MagicCardConfig | undefined, id: string) {
      return storedDoc(config, cardState(this)?.getState().templateAnimations, id);
    }

    /**
     * Which module the working document belongs to: the editor's selected path and module id (two
     * modules with the same type, icon and entity are still two modules), plus type, icon, entity.
     */
    private _moduleKey(): string {
      const sm = cardState(this);
      const where = sm
        ? JSON.stringify(sm.getState().selectedPath ?? null) + (this.module?.id ?? '')
        : '';
      return `${where}|${this.moduleType}|${this.icon}|${this.moduleEntity}|`;
    }

    protected willUpdate(): void {
      const ie = iconEntry(this._list());
      const q = ie?.quick ? ie : undefined;
      // a My animations reference: its library document (the key changes once the library has it)
      const ref = ie && !ie.quick ? h.library.get(ie.id) : undefined;
      const mod = this._moduleKey();
      const key = mod + (ie?.id ?? '') + (ref ? '+' : '');
      if (key === this._key) return;
      const sameModule = this._key.startsWith(mod);
      this._key = key;
      // the same module after Apply / Remove / undo of either: keep working on the same document
      if (sameModule && this._doc && (!ie || this._doc.id === ie.id) && !(ref && !q)) return;
      // the module's applied animation, when the card holds it; else a fresh start
      const stored = q ? this._stored(this._config(), q.id)?.doc : ref;
      const v = stored ? validateAnimationDoc(stored, { v2: 'lenient' }) : undefined;
      if (v?.ok && ref) {
        this._doc = v.doc;
        this._mode = 'library';
        this._entry = '';
        this._mine = ie!.id;
      } else if (v?.ok) {
        this._doc = v.doc;
        // it followed the module's new icon: say so once
        const note = FOLLOW_NOTES.get(v.doc.id);
        if (note) this._msg = note;
        FOLLOW_NOTES.delete(v.doc.id);
        // library documents and splits of this icon both carry their drawing (rig.svg): the
        // library name tells them apart
        this._mode = isOwnDoc(v.doc, this.icon) ? 'own' : 'library';
        this._entry = ICON_LIBRARY.find((e) => e.name === v.doc.name)?.id ?? '';
      } else {
        this._doc = undefined;
        this._entry = '';
        this._mode = this._matches().length ? 'library' : 'own';
      }
      if (!(v?.ok && ref)) this._mine = '';
      this._part = '';
    }

    protected updated(): void {
      this._syncPreview();
      this._ensureGeometry();
    }

    /** Opened: the focus moves into the animator (the selected "Start from" option). */
    protected firstUpdated(): void {
      this.shadowRoot?.querySelector<HTMLElement>('.seg [aria-checked="true"]')?.focus();
    }

    /** Escape closes the animator (and does not reach HA's dialog). */
    private _onKey(e: KeyboardEvent): void {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      e.preventDefault();
      e.stopPropagation();
      this.onClose();
    }

    connectedCallback(): void {
      super.connectedCallback();
      LIVE.add(this);
      // a My animations reference loads its document once the library has it
      this._unsubLib = h.library.subscribe(() => {
        const ie = iconEntry(this._list());
        if (ie && !ie.quick) this.requestUpdate();
      });
    }

    /** The stored document followed the module's icon (follow-icon.ts): load it again. */
    followed(): void {
      this._key = '';
      this.requestUpdate();
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      LIVE.delete(this);
      this._unsubLib?.();
      this._card?.remove();
      this._card = undefined;
      this._previewJson = '';
    }

    // ── document ──

    /** The id this module's animation is stored under (the applied one, else a new unique id). */
    private _id(): string {
      const ie = iconEntry(this._list());
      // a My animations copy (MINE_PREFIX) keeps its id only for itself (see _apply): a split or a
      // library entry gets a quick-icon id, so it is told apart from the copy
      if (ie?.quick && !ie.id.startsWith(MINE_PREFIX)) return ie.id;
      // a My animations document is never overwritten: a picked animation gets a new id
      if (this._doc && this._doc.id !== ie?.id && !h.library.get(this._doc.id)) return this._doc.id;
      return this._newId();
    }

    /** A new id, unique in the card (inline documents, references) and in the library. */
    private _newId(kind?: 'mine'): string {
      const lib = h.library.status === 'ready' ? h.library.list().map((d) => d.id) : [];
      const config = this._config();
      const tpl = cardState(this)?.getState().templateAnimations;
      return newQuickId(
        [...cardIds(config, config ? h.customIds(config) : [], tpl), ...lib],
        undefined,
        kind,
      );
    }

    /** The working document is My animations document `_mine` as the library holds it. */
    private _isMine(doc: AnimationDoc | undefined): boolean {
      const lib = this._mine ? h.library.get(this._mine) : undefined;
      return !!doc && !!lib && doc.id === lib.id && sameDoc(doc, lib);
    }

    private _matches(): LibraryEntry[] {
      const out = new Map<string, LibraryEntry>();
      for (const q of [this.icon, this._domain])
        for (const e of q ? libraryFor(q) : []) out.set(e.id, e);
      return [...out.values()];
    }

    private _pickEntry(e: LibraryEntry): void {
      const built = e.build();
      this._entry = e.id;
      this._mine = '';
      this._doc = { ...built, id: this._id(), name: e.name };
      this._msg = '';
    }

    /** Split the module's icon into parts (needs its shape: HA's icon database or an icon pack). */
    private async _splitOwn(): Promise<void> {
      const icon = this.icon;
      this._busy = true;
      this._msg = '';
      let g: IconGeometry | undefined;
      try {
        g = await this._shape(icon);
      } finally {
        this._busy = false;
      }
      if (!g) {
        this._msg = `The shape of ${icon} could not be loaded, so it cannot be split into parts.`;
        return;
      }
      this._entry = '';
      this._mine = '';
      // the drawing goes into the document (rig.svg): the parts never depend on the icon version a
      // dashboard resolves (an icon over the 32 KB cap keeps its id)
      this._doc = iconAnimationDoc(
        icon,
        g,
        this._id(),
        `Animated ${icon.slice(icon.indexOf(':') + 1).replace(/-/g, ' ')}`,
        { embed: true },
      );
      this._part = this._doc.rig?.parts[0]?.id ?? '';
    }

    private _presetParams(): Record<string, number> {
      const p = PART_PRESETS.find((x) => x.id === this._preset);
      return Object.fromEntries(
        (p?.params ?? []).map((x) => [x.id, this._params[x.id] ?? x.default]),
      );
    }

    /** The selected part, or every part ('*'). */
    private _targets(): TargetRef[] {
      const parts = this._doc?.rig?.parts ?? [];
      if (this._part === '*') return parts.map((p) => `part:${p.id}` as TargetRef);
      return parts.some((p) => p.id === this._part) ? [`part:${this._part}` as TargetRef] : [];
    }

    private _applyPreset(): void {
      if (!this._doc) return;
      // the pieces let a preset set its pivot (Swing from the top, Spin around the centre)
      const g = this._geometry();
      this._doc = applyPartPresetMany(
        this._doc,
        this._targets(),
        this._preset,
        this._presetParams(),
        {
          pieces: g ? splitIcon(g) : undefined,
        },
      );
    }

    private _clearPart(): void {
      if (!this._doc) return;
      this._doc = this._targets().reduce((d, t) => clearPartMotion(d, t), this._doc);
    }

    /**
     * A number field's change: clamped to [min, max] (the field shows the clamped value); anything
     * else is reverted to `current` with a note. Returns the value to use, or undefined.
     */
    private _number(
      e: Event,
      current: number,
      min: number,
      max: number,
      what: string,
    ): number | undefined {
      const input = e.target as HTMLInputElement;
      const n = Number(input.value);
      if (input.value.trim() === '' || !Number.isFinite(n)) {
        input.value = String(current);
        this._msg = `${what}: enter a number from ${min} to ${max}.`;
        return undefined;
      }
      const v = Math.min(max, Math.max(min, n));
      input.value = String(v);
      this._msg = v === n ? '' : `${what}: kept within ${min} to ${max}.`;
      return v;
    }

    private _setDuration(e: Event): void {
      if (!this._doc) return;
      const v = this._number(e, this._doc.duration, 0.1, 60, 'Duration');
      if (v !== undefined) this._doc = { ...this._doc, duration: v };
    }

    /** Make the working document a copy under a new id (Apply then leaves the shared one alone). */
    private _copyDoc(): void {
      // the copy keeps its kind: a My animations copy stays one (it goes with the icon)
      if (this._doc)
        this._doc = {
          ...this._doc,
          id: this._newId(this._doc.id.startsWith(MINE_PREFIX) ? 'mine' : undefined),
        };
    }

    // ── apply / remove ──

    private _validDoc(): AnimationDoc | undefined {
      if (!this._doc) return undefined;
      const v = validateAnimationDoc(this._doc, { v2: 'strict' });
      if (!v.ok) {
        this._msg = `This animation is not valid: ${v.errors.map((e) => `${e.path || 'document'}: ${e.message}`).join('; ')}`;
        return undefined;
      }
      return v.doc;
    }

    private _apply(): void {
      if (!this._config()) {
        this._msg = 'Open this card in the Magic Card editor to apply.';
        return;
      }
      let doc = this._validDoc();
      if (!doc) return;
      const ie = iconEntry(this._list());
      if (this._mine && doc.id === this._mine) {
        // a My animations document as the library holds it: the entry references it, nothing stored
        if (this._isMine(doc)) {
          referenceMine(h, this, this._list(), doc.id, (list) => this.onAnimations(list));
          this._doc = doc;
          this._msg = 'Applied from My animations.';
          this.requestUpdate();
          return;
        }
        // changed here: the card's own copy (a MINE_PREFIX id: it goes with the icon, never follows it)
        const keep =
          ie?.quick && ie.id.startsWith(MINE_PREFIX) && referenceCount(this._config(), ie.id) <= 1;
        doc = { ...doc, id: keep ? ie.id : this._newId('mine') };
      } else if (
        // a document other modules play (carried over, duplicated) is never taken over by a module
        // that has no entry yet: it gets its own copy
        (!ie || !ie.quick) &&
        (doc.id === ie?.id || (!ie && referenceCount(this._config(), doc.id) > 0))
      )
        doc = { ...doc, id: this._newId() };
      const stored = doc;
      // module edit first (its own undo step), the card's inline copy folded into the same step
      this.onAnimations(withQuickEntry(this._list(), doc.id));
      patchCard(this, (c) => upsertInlineDoc(c, stored, h.customIds(c)), true);
      this._doc = doc;
      this._msg = 'Applied. The card keeps this animation in its own config (custom_animations).';
      this.requestUpdate();
    }

    private _remove(): void {
      const ie = iconEntry(this._list());
      if (!ie || !this._config()) return;
      this.onAnimations(withoutQuickEntry(this._list()));
      if (ie.quick) patchCard(this, (c) => removeInlineDoc(c, ie.id, h.customIds(c)), true);
      // the library document is not this module's to keep working on
      else if (this._doc?.id === ie.id) this._doc = undefined;
      this._msg = 'Removed from this module.';
      this.requestUpdate();
    }

    /**
     * applied: the stored copy equals the working document; changed: applied, then edited (or
     * another animation picked); ref: a My animations reference whose document is the working one
     * as the library holds it (or there is none); lost: a reference the library does not hold.
     */
    private _status(
      config: MagicCardConfig | undefined,
    ): 'none' | 'applied' | 'changed' | 'ref' | 'lost' {
      const ie = iconEntry(this._list());
      if (ie && !ie.quick) {
        const lib = h.library.get(ie.id);
        // a library still loading: no verdict yet
        if (!lib && !this._doc) return ['ready', 'unavailable'].includes(h.library.status) ? 'lost' : 'ref';
        return !this._doc || (this._doc.id === ie.id && sameDoc(this._doc, lib)) ? 'ref' : 'changed';
      }
      const q = ie;
      const stored = q && config ? this._stored(config, q.id)?.doc : undefined;
      if (!q || !stored) return 'none';
      if (!this._doc) return 'applied';
      return sameDoc(this._doc, stored) ? 'applied' : 'changed';
    }

    // ── export ──

    /** The document's drawing: its own SVG (library documents), else its icon's resolved shape. */
    private _geometry(): IconGeometry | undefined {
      const rig = this._doc?.rig;
      if (rig?.svg) {
        if (!this._geoms.has(rig.svg)) {
          const g = svgGeometry(rig.svg);
          if (g) this._geoms.set(rig.svg, g);
        }
        return this._geoms.get(rig.svg);
      }
      return rig?.icon ? this._geoms.get(rig.icon) : undefined;
    }

    /**
     * Resolve the shape of the document's icon once (the export needs it synchronously): only a
     * document that names its icon (rig.icon, a drawing over the size cap); an embedded drawing
     * (rig.svg) needs no lookup. HA's own
     * geometry (icon database, icon packs) wins; the curated MDI table is registered for an icon
     * only when HA cannot resolve it (outside HA, an icon database still loading), so the editor
     * never draws other shapes than the dashboard does where HA knows the icon.
     */
    private _ensureGeometry(): void {
      const ref = this._doc?.rig?.icon;
      if (!ref || this._geoms.has(ref) || this._pending.has(ref)) return;
      this._pending.add(ref);
      void this._shape(ref).then((g) => {
        if (g) this.requestUpdate();
      });
    }

    /**
     * The shape of an icon: HA's own (icon database, icon packs), else the curated MDI table, which
     * is then registered for that icon so the preview card draws it too. Never rejects.
     */
    private async _shape(ref: string): Promise<IconGeometry | undefined> {
      let g = this._geoms.get(ref);
      if (g) return g;
      g = await h.resolveIcon(ref, { timeoutMs: 1500 }).catch(() => undefined);
      if (!g && (g = mdiGeometry(ref))) h.setIcon(ref, g);
      if (g) this._geoms.set(ref, g);
      return g;
    }

    private _svgMemo?: { doc: AnimationDoc; geometry: IconGeometry; smil: boolean; out: ExportResult };

    /**
     * The animated SVG of the working document (undefined until its drawing is known), checked like
     * the studio checks it; once per document, drawing and SMIL choice.
     */
    private _svg(): ExportResult | undefined {
      const doc = this._doc;
      const g = this._geometry();
      if (!doc || !g) return undefined;
      const m = this._svgMemo;
      if (m && m.doc === doc && m.geometry === g && m.smil === this._smil) return m.out;
      const r = exportAnimatedSvg(doc, g, { smil: this._smil });
      const out: ExportResult = r.svg
        ? { svg: r.svg, warnings: r.warnings, error: checkAnimatedSvg(r.svg) }
        : // no file: the last warning says why (the earlier ones are notes)
          {
            svg: '',
            warnings: r.warnings.slice(0, -1),
            error: r.warnings[r.warnings.length - 1] ?? 'Nothing to export yet.',
          };
      this._svgMemo = { doc, geometry: g, smil: this._smil, out };
      return out;
    }

    /** The SVG text to copy or download (none when there is nothing usable). */
    private _usableSvg(): string | undefined {
      const out = this._svg();
      return out?.svg && !out.error ? out.svg : undefined;
    }

    private async _copy(): Promise<void> {
      const svg = this._usableSvg();
      if (!svg) return;
      try {
        await navigator.clipboard.writeText(svg);
        this._msg = 'Animated SVG copied.';
      } catch {
        this._msg = 'Copy is not available here; use Download.';
      }
    }

    private _download(): void {
      const svg = this._usableSvg();
      if (!svg || !this._doc) return;
      const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = animatedSvgFileName(this._doc.name);
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    // ── preview ──

    /** A one-module card playing the working document on the module's icon (the real runtime). */
    private _previewConfig(): MagicCardConfig {
      const doc = this._doc;
      const module: Record<string, unknown> = {
        id: 'qa-icon',
        type: 'icon',
        icon: this.icon,
        size: '56px',
      };
      if (doc)
        module.design = {
          animations: [{ id: 'qa', preset: `custom:${doc.id}`, target: 'icon', trigger: 'always' }],
        };
      return {
        type: 'custom:magic-card',
        background: 'transparent',
        box_shadow: 'none',
        rows: [{ id: 'qa-r', columns: [{ id: 'qa-c', modules: [module] }] }],
        ...(doc ? { custom_animations: [doc as unknown as Record<string, unknown>] } : {}),
      } as unknown as MagicCardConfig;
    }

    private _syncPreview(): void {
      const host = this.shadowRoot?.querySelector('.preview');
      if (!host) return;
      if (!this._card) {
        this._card = document.createElement('magic-card') as PreviewCard;
        this._previewJson = '';
      }
      if (this._card.parentNode !== host) host.appendChild(this._card);
      if (this._card.hass !== this.hass) this._card.hass = this.hass;
      const cfg = this._previewConfig();
      const json = JSON.stringify(cfg);
      if (json === this._previewJson || typeof this._card.setConfig !== 'function') return;
      this._previewJson = json;
      try {
        this._card.setConfig(cfg);
      } catch {
        /* the preview never breaks the editor */
      }
    }

    // ── render ──

    private _seg(): TemplateResult {
      const opts: Array<{ v: Mode; label: string }> = [
        { v: 'library', label: 'Library' },
        { v: 'own', label: 'This icon' },
      ];
      const onKey = (e: KeyboardEvent) => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key))
          return;
        e.preventDefault();
        const next: Mode = this._mode === 'library' ? 'own' : 'library';
        this._mode = next;
        const group = e.currentTarget as HTMLElement;
        requestAnimationFrame(() =>
          group.querySelector<HTMLElement>(`[data-val="${next}"]`)?.focus(),
        );
      };
      return html`<div class="seg full" role="radiogroup" aria-label="Start from" @keydown=${onKey}>
        ${opts.map(
          (o) =>
            html`<button
              type="button"
              role="radio"
              data-val=${o.v}
              aria-checked=${o.v === this._mode ? 'true' : 'false'}
              tabindex=${o.v === this._mode ? '0' : '-1'}
              @click=${() => (this._mode = o.v)}
            >
              ${o.label}
            </button>`,
        )}
      </div>`;
    }

    private _library(): TemplateResult {
      const picked = ICON_LIBRARY.find((e) => e.id === this._entry);
      // the tile on the module now: the library entry, else the My animations document it plays
      const current = this._entry ? `lib:${this._entry}` : this._mine;
      return html`
        <mc-animated-icon-grid
          .hass=${this.hass}
          .icon=${this.icon}
          .entity=${this.moduleEntity}
          .current=${current}
          @animated-icon-pick=${(e: CustomEvent<AnimatedIconPick>) => this._onPick(e.detail)}
        ></mc-animated-icon-grid>
        ${picked && picked.icon !== this.icon ? html`<p class="help">Plays its own ${picked.icon} drawing in place of the module's icon.</p>` : nothing}
      `;
    }

    private _onPick(p: AnimatedIconPick): void {
      if (p.kind === 'library') this._pickEntry(p.entry);
      else this._pickMine(p.doc);
    }

    /**
     * A My animations document, under its library id: Apply references it, or stores a copy of
     * its own once it is changed here.
     */
    private _pickMine(doc: AnimationDoc): void {
      const v = validateAnimationDoc(doc, { v2: 'lenient' });
      if (!v.ok) return;
      this._doc = v.doc;
      this._mine = doc.id;
      this._entry = '';
      this._mode = 'library';
      this._msg = '';
    }

    private _own(): TemplateResult {
      const doc = this._doc;
      const own = !!doc && !this._entry && isOwnDoc(doc, this.icon);
      if (!own) {
        return html`
          <p class="help">Splits ${this.icon} into its parts; then give each part a preset.</p>
          <div>
            <button
              type="button"
              class="btn btn-secondary btn-sm split"
              ?disabled=${this._busy}
              @click=${() => this._splitOwn()}
            >
              <ha-icon icon="mdi:vector-difference"></ha-icon
              >${this._busy ? 'Loading the icon…' : 'Animate this icon'}
            </button>
          </div>
        `;
      }
      return this._parts(doc!);
    }

    private _parts(doc: AnimationDoc): TemplateResult {
      const parts = doc.rig?.parts ?? [];
      const animated = new Set((doc.tracks ?? []).map((t) => t.target));
      const preset = PART_PRESETS.find((p) => p.id === this._preset);
      const params = this._presetParams();
      const targets = this._targets();
      return html`
        <div class="field">
          <div class="field-head"><span class="lbl">Part</span></div>
          <div class="chips parts" role="group" aria-label="Parts">
            ${
              parts.length > 1
                ? html`<button
                    type="button"
                    class="chip"
                    data-part="*"
                    aria-pressed=${this._part === '*' ? 'true' : 'false'}
                    @click=${() => (this._part = '*')}
                  >
                    All parts
                  </button>`
                : nothing
            }
            ${parts.map(
              (p) =>
                html`<button
                  type="button"
                  class="chip"
                  data-part=${p.id}
                  aria-pressed=${p.id === this._part ? 'true' : 'false'}
                  @click=${() => (this._part = p.id)}
                >
                  ${animated.has(`part:${p.id}`) ? html`<span class="dot"></span><span class="sr-only">animated:</span>` : nothing}${p.name}
                </button>`,
            )}
          </div>
        </div>
        <div class="field">
          <div class="field-head"><label for="qa-preset">Preset</label></div>
          <div class="select">
            <select
              class="input"
              id="qa-preset"
              @change=${(e: Event) => {
                this._preset = (e.target as HTMLSelectElement).value;
                this._params = {};
              }}
            >
              ${PART_PRESETS.map((p) => html`<option value=${p.id} ?selected=${p.id === this._preset}>${p.name}</option>`)}
            </select>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </div>
        </div>
        ${
          preset?.params.length
            ? html`<div class="params">
                ${preset.params.map((x) =>
                  x.id === 'direction'
                    ? html`<div class="field">
                        <div class="field-head"><label for="qa-p-${x.id}">${x.label}</label></div>
                        <div class="select">
                          <select
                            class="input"
                            id="qa-p-${x.id}"
                            @change=${(e: Event) =>
                              (this._params = {
                                ...this._params,
                                [x.id]: Number((e.target as HTMLSelectElement).value),
                              })}
                          >
                            <option value="1" ?selected=${params[x.id] >= 0}>Normal</option>
                            <option value="-1" ?selected=${params[x.id] < 0}>Reversed</option>
                          </select>
                          <ha-icon icon="mdi:chevron-down"></ha-icon>
                        </div>
                      </div>`
                    : html`<div class="field">
                        <div class="field-head">
                          <label for="qa-p-${x.id}">${x.label}${x.unit ? ` (${x.unit})` : ''}</label>
                        </div>
                        <input
                          class="input"
                          id="qa-p-${x.id}"
                          type="number"
                          min=${x.min}
                          max=${x.max}
                          step=${x.step}
                          .value=${String(params[x.id])}
                          @change=${(e: Event) => {
                            const v = this._number(e, params[x.id], x.min, x.max, x.label);
                            if (v !== undefined) this._params = { ...this._params, [x.id]: v };
                          }}
                        />
                      </div>`,
                )}
              </div>`
            : nothing
        }
        <div class="row">
          <button
            type="button"
            class="btn btn-secondary btn-sm apply-preset"
            ?disabled=${!targets.length}
            @click=${() => this._applyPreset()}
          >
            <ha-icon icon="mdi:auto-fix"></ha-icon>Use on
            ${this._part === '*' ? 'all parts' : 'part'}
          </button>
          <button
            type="button"
            class="btn btn-text btn-sm"
            ?disabled=${!targets.some((t) => animated.has(t))}
            @click=${() => this._clearPart()}
          >
            Clear
          </button>
        </div>
        ${targets.length ? nothing : html`<p class="help">Pick a part to animate.</p>`}
      `;
    }

    private _export(): TemplateResult {
      const out = this._svg();
      const usable = !!out?.svg && !out.error;
      return html`
        <div class="field">
          <div class="field-head"><span class="lbl">Animated SVG</span></div>
          <div class="switch-row">
            <div class="txt">
              SMIL fallback
              <p class="help">Also animates where CSS in SVG files does not play.</p>
            </div>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${this._smil ? 'true' : 'false'}
              aria-label="SMIL fallback"
              @click=${() => (this._smil = !this._smil)}
            ></button>
          </div>
          <div class="row">
            <button
              type="button"
              class="btn btn-secondary btn-sm copy-svg"
              ?disabled=${!usable}
              @click=${() => this._copy()}
            >
              <ha-icon icon="mdi:content-copy"></ha-icon>Copy
            </button>
            <button
              type="button"
              class="btn btn-secondary btn-sm download-svg"
              ?disabled=${!usable}
              @click=${() => this._download()}
            >
              <ha-icon icon="mdi:download"></ha-icon>Download
            </button>
          </div>
          ${out?.error ? html`<p class="help export-error">${out.error}</p>` : nothing}
          ${out?.warnings.map((w) => html`<p class="help">${w}</p>`) ?? nothing}
        </div>
      `;
    }

    protected render(): TemplateResult {
      const config = this._config();
      const status = this._status(config);
      const doc = this._doc;
      const ie = iconEntry(this._list());
      const q = ie?.quick ? ie : undefined;
      const id = doc?.id ?? q?.id;
      // other design entries playing this module's document (a duplicated module, copied YAML)
      const shared = q && doc?.id === q.id ? referenceCount(config, q.id) - 1 : 0;
      return html`
        <div class="qa cond" @keydown=${(e: KeyboardEvent) => this._onKey(e)}>
          <div class="cond-head">
            <span class="n">Animate icon <span class="sub">· ${this.icon}</span></span>
            <button
              type="button"
              class="icon-btn sm close"
              aria-label="Close icon animator"
              title="Close"
              @click=${() => this.onClose()}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="stage">
            <div class="preview" aria-label="Preview"></div>
            <div class="stage-meta">
              <span class="name">${doc?.name ?? 'No animation yet'}</span>
              <div>
                ${
                  status === 'applied' || status === 'ref'
                    ? html`<span class="chip is-accent status">Applied</span>`
                    : status === 'changed'
                      ? html`<span class="chip is-warn status">Changed, not applied</span>`
                      : status === 'lost'
                        ? html`<span class="chip is-warn status">Not found</span>`
                        : html`<span class="chip status">Not applied</span>`
                }
                ${q && this._stored(config, q.id)?.template ? html`<span class="chip from-template">From template</span>` : nothing}
                ${status === 'ref' ? html`<p class="help">From My animations.</p>` : nothing}
                ${status === 'lost' ? html`<p class="help missing">${ie!.id}: not found in My animations.</p>` : nothing}
              </div>
            </div>
          </div>
          ${this._seg()} ${this._mode === 'library' ? this._library() : this._own()}
          ${
            doc
              ? html`<div class="field">
                  <div class="field-head"><label for="qa-dur">Duration (s)</label></div>
                  <input
                    class="input"
                    id="qa-dur"
                    type="number"
                    min="0.1"
                    max="60"
                    step="0.1"
                    .value=${String(doc.duration)}
                    @change=${(e: Event) => this._setDuration(e)}
                  />
                </div>`
              : nothing
          }
          <div class="row end">
            <button
              type="button"
              class="btn btn-primary btn-sm apply"
              ?disabled=${!doc || !config || status === 'ref'}
              @click=${() => this._apply()}
            >
              <ha-icon icon="mdi:check"></ha-icon>${status === 'none' ? 'Apply' : 'Update'}
            </button>
            ${
              ie
                ? html`<button
                    type="button"
                    class="btn btn-text btn-sm danger-text remove"
                    @click=${() => this._remove()}
                  >
                    <ha-icon icon="mdi:delete-outline"></ha-icon>Remove
                  </button>`
                : nothing
            }
          </div>
          ${
            shared > 0
              ? html`<div class="row shared">
                  <p class="help">
                    Shared with ${shared} other ${shared === 1 ? 'module' : 'modules'}: Update
                    changes ${shared === 1 ? 'it' : 'them'} too.
                  </p>
                  <button
                    type="button"
                    class="btn btn-text btn-sm make-copy"
                    @click=${() => this._copyDoc()}
                  >
                    <ha-icon icon="mdi:content-duplicate"></ha-icon>Make a copy
                  </button>
                </div>`
              : nothing
          }
          ${
            q && status === 'none'
              ? html`<p class="help missing">
                  This module's animation is missing from the card; Apply stores it again.
                </p>`
              : nothing
          }
          ${config ? nothing : html`<p class="help">Apply needs the Magic Card editor.</p>`}
          <p class="help msg" role="status">${this._msg}</p>
          ${
            doc
              ? html`<div class="sep"></div>
                  ${this._export()}`
              : nothing
          }
          ${
            // the card's own document only (a My animations reference is already there)
            id && q && status !== 'none'
              ? html`<div class="field">
                  <p class="help">
                    To edit it further or keep it in My animations, import this card's YAML in Magic Card Utils.
                  </p>
                </div>`
              : nothing
          }
        </div>
      `;
    }
  }

  customElements.define(ICON_ANIMATOR_TAG, IconAnimator);
}
