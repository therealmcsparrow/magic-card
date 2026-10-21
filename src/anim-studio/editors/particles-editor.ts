import { LitElement, html, css, svg, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { t as tl } from '../../i18n/labels';
import { editorSystem } from '../../css/editor-stack';
import { seg } from '../../ui-kit/templates/choice';
import type { LayerView } from '../../contracts/studio-layers';
import { emitterIds, isLocked } from '../layer-view';
import { lockBanner, lockBannerStyles } from './lock-banner';
import { animationStyles } from '../../css/animations';
import { resolveAnimations, type FxLayer, type ResolvedAnimations } from '../resolve';
import { intensityLabel } from '../../utils/animation-presets';
import type { DesignConfig, HomeAssistant } from '../../types';
import { DEFAULT_GEOMETRY, PARTICLES_V2_CAPS, type BakedLoop, type BuiltinShape, type ParticleMode, type ParticleSlotV2, type ParticlesSim, type Range, type SubEmitter, type WeightedShape } from '../../contracts/particles-v2';
import { compileAnimationDoc, easingCss } from '../compile';
import { ANIMATION_CAPS, type AnimationDoc, type ParticleShape, type ParticlesSpec } from '../model';
import {
  COLLIDERS,
  COMMON_EMOJI,
  COMPASS,
  FLOWS,
  FLOW_LABELS,
  LIMITS,
  MAX_SHAPES,
  PHYSICS_SCALE,
  SHAPE_DEFAULTS,
  SHAPE_KINDS,
  V2_LIMITS,
  EMITTER_NAME_MAX,
  addEmitter,
  anyCollider,
  bakeSpec,
  canAddEmitter,
  basePreset,
  childrenSummary,
  colliderOn,
  collisionsSummary,
  convertPresetParticles,
  defaultChildren,
  duplicateEmitter,
  editEmitter,
  editSim,
  emitterCount,
  emitterDoc,
  emitterLabel,
  emitterParents,
  emitterPlacement,
  emojiError,
  flowSpreadLabel,
  fromDocColor,
  getStudioParticles,
  isBuiltinKind,
  isEntityDocColor,
  limitNumber,
  limitV2,
  newSeed,
  nextShape,
  orderRange,
  parentsLeft,
  patchParticles,
  periodOf,
  physicsSummary,
  presetIntensity,
  presetKind,
  removeEmitter,
  renameEmitter,
  setEmitterPlacement,
  setFlow,
  setGravity,
  setMode,
  setShapes,
  setSpin,
  setWind,
  shapeKind,
  shapeLabel,
  shapeShare,
  shownShapes,
  shuffleSeed,
  sizeRange,
  spinPerLoop,
  svgError,
  toDocColor,
  validIcon,
  variationSummary,
  viewSim,
  windOf,
  withPresetIntensity,
  type ColliderId,
  type ShapeKind,
  type V2LimitKey,
} from './particles-utils';
import './draw-svg-dialog';
import type { AnimSvgDialog } from './draw-svg-dialog';
import { t, m } from '../i18n';

/**
 * The particle layers of `anim`, as the card renders them (card-decorations.ts renderAnimFx). The
 * studio bundle must not define the card's elements: mc-ring / mc-seasonal are used by tag only
 * (the card bundle, loaded first, defines them). A v2 slot may carry its own built-in shape
 * (`data-s`) or symbol (particles-v2 ParticleSlotV2).
 */
function renderFx(anim: ResolvedAnimations): TemplateResult {
  const symbol = (s: FxLayer['symbol'] | ParticleSlotV2['symbol']) => (!s ? nothing : 'icon' in s ? html`<ha-icon .icon=${s.icon}></ha-icon>` : s.text);
  // the card's seasonal chunk defines <mc-seasonal>; the element upgrades in place once it is loaded
  if (anim.fx.some((l) => l.seasonal)) void window.MagicCard?.loadSeasonal?.();
  return html`${anim.fx.map((l) =>
    l.seasonal
      ? html`<mc-seasonal class="mc-anim-seasonal" data-fx=${l.preset} .scenes=${l.seasonal.scenes} .intensity=${l.seasonal.intensity} .seed=${`pv|${l.preset}`}></mc-seasonal>`
      : l.ring
        ? html`<mc-ring class="mc-anim-ring" data-fx=${l.preset} style=${l.style} .ring=${l.ring}></mc-ring>`
        : html`<span class="mc-anim-fx" data-fx=${l.preset} ?data-front=${l.front} style=${l.style} aria-hidden="true">${(l.particles as ParticleSlotV2[]).map(
            (p) =>
              html`<i data-s=${p.shape ?? nothing} style="--mc-anim-x: ${p.x}%; --mc-anim-phase: ${p.phase}; --mc-anim-k: ${p.k}${p.style ? `; ${p.style}` : ''}"
                >${symbol(p.symbol ?? l.symbol)}</i
              >`,
          )}</span>`,
  )}`;
}

/** The built-in shapes as 24px glyphs in the current colour (shape tiles and chips). */
const GLYPHS: Record<BuiltinShape, TemplateResult> = {
  circle: svg`<circle cx="12" cy="12" r="7"></circle>`,
  square: svg`<rect x="5" y="5" width="14" height="14" rx="1.5"></rect>`,
  triangle: svg`<path d="M12 4l8 15H4z"></path>`,
  star: svg`<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"></path>`,
  heart: svg`<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"></path>`,
  ring: svg`<circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="3"></circle>`,
  line: svg`<path d="M6 19L18 5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>`,
  spark: svg`<path d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"></path>`,
};

function glyph(kind: ShapeKind): TemplateResult {
  if (isBuiltinKind(kind)) return html`<svg class="glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${GLYPHS[kind]}</svg>`;
  return html`<ha-icon class="glyph" icon=${SHAPE_KINDS.find((k) => k.id === kind)!.icon!}></ha-icon>`;
}

/** What a chip shows for its shape: an emoji as itself, the rest as their glyph. */
const chipFace = (s: WeightedShape['shape']): TemplateResult =>
  'emoji' in s ? html`<span class="emo" aria-hidden="true">${s.emoji}</span>` : 'icon' in s ? html`<ha-icon class="glyph" icon=${s.icon}></ha-icon>` : glyph(shapeKind(s));

/** Colours offered by "Add colour", in turn (one not in the list yet). */
const NEW_COLORS = ['#ef4444', '#eab308', '#22c55e', '#3b82f6', '#ec4899', '#ffffff', '#f97316', '#8b5cf6'];

/** The verbatim Live simulation warning (P2-1). */
export const LIVE_WARNING =
  m('Live simulation runs on every dashboard that shows this card and uses more CPU, especially on wall tablets. Animated SVG export plays the baked loop instead.');

/** A bake slower than this shows "Baking…" while the next one runs. */
const SLOW_BAKE_MS = 150;

type SectorId = 'variation' | 'physics' | 'collisions' | 'children';

export interface DocChangeDetail {
  doc: AnimationDoc;
  label: string;
  transient?: boolean;
}

/**
 * The particle designer of the animation studio (particles v2, contract src/contracts/particles-
 * v2.ts). Open
 * sections: Mode (Baked loop / Live simulation), Shape (a weighted mix of up to 4 shapes),
 * Movement (13 flows, loop and particle speed, spread) and Look. Closed sections with a live
 * summary: Variation (seed, spin, delay, lifetime), Physics, Collisions and Child particles. A
 * 2026.10.03 document opens unchanged as a Baked loop; see particles-utils.ts for when an edit adds
 * `sim`. A document based on a built-in preset (particles.preset) shows that preset and can be
 * converted to custom particles. Never mutates `.doc`: every edit is one `doc-change` { doc, label }
 * (text and sliders send transient changes while editing, then one final change).
 */
@customElement('mc-anim-particles-editor')
export class AnimParticlesEditor extends LitElement {
  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) library?: Record<string, AnimationDoc>;
  /** 0-1 scrub position (unused: particles loop on their own). */
  @property({ attribute: false }) time = 0;
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Preview-only locks: a locked emitter (or its child particles) is read-only here. */
  @property({ attribute: false }) layerView?: LayerView;
  /** The emitter the fields edit (0 = the primary). Clamped to the document's emitters; the Layers list sets it too. */
  @property({ type: Number }) emitter = 0;

  /** The last icon / emoji / SVG used, so switching a chip back restores it. */
  @state() private _shapes: Partial<Record<'icon' | 'emoji' | 'svg', ParticleShape>> = {};
  /** Text being edited that the model does not accept yet (with its error). */
  @state() private _svgDraft?: string;
  @state() private _emojiDraft?: string;
  /** Selected colour chip (its picker is open under the chips). */
  @state() private _color = -1;
  /** Selected shape chip (its editor is open under the chips). */
  @state() private _chip = 0;
  @state() private _paused = false;
  /** Open closed-by-default sections (per editor session, never saved). */
  @state() private _open: Partial<Record<SectorId, boolean>> = {};
  /** Stats of the last bake (with the particles module only). */
  @state() private _stats?: BakedLoop['stats'];
  @state() private _baking = false;
  /** "All particles" is open (only with 2+ emitters): the document-wide fields, no emitter. */
  @property({ type: Boolean }) all = false;
  /** The announcement of the last Placement change. */
  @state() private _live = '';

  /** The seed a v1 document's first v2 edit writes (and the one shown until then). */
  private _seed = newSeed();
  /** A transient edit is open (text, slider): its final change still has to be sent. */
  private _pending?: { doc: AnimationDoc; label: string };
  private _bakeMs = 0;
  private _bakeToken = 0;
  /** The preview layer the particles module was applied to (released when it goes). */
  private _applied: HTMLElement[] = [];
  private _liveCss = new Map<string, string>();

  static styles = [
    editorSystem,
    animationStyles,
    lockBannerStyles,
    css`
      .lk[inert],
      .sector-body[inert] {
        opacity: 0.55;
      }
      :host {
        display: block;
        container-type: inline-size;
        color: var(--mc-text);
      }
      :host([disabled]) .form {
        opacity: 0.55;
      }
      .wrap {
        display: grid;
        gap: 20px;
      }
      .form {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 0;
        min-width: 0;
        container: form / inline-size;
      }
      .form > * {
        min-width: 0;
      }
      .form > .group {
        padding-bottom: 20px;
      }
      .form > .group:last-child,
      .form > .sectors {
        margin-bottom: 0;
      }
      .group-head h3 {
        color: var(--mc-text);
      }

      /* ── preview ── */
      .preview {
        display: grid;
        gap: 6px;
      }
      .stage {
        position: relative;
        height: 128px;
        border-radius: var(--mc-radius-lg);
        border: 1px solid var(--mc-divider);
        background-color: var(--mc-canvas);
        background-image: radial-gradient(var(--mc-canvas-dot) 1px, transparent 1.2px);
        background-size: 14px 14px;
        display: grid;
        place-items: center;
        overflow: hidden;
      }
      .stage-module {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px 8px 10px;
        border-radius: 12px;
        background: var(--mc-surface);
        border: 1px solid var(--mc-divider);
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--mc-text);
        --mdc-icon-size: 20px;
      }
      .stage-module ha-icon {
        color: var(--mc-text-2);
      }
      .stage mc-seasonal {
        z-index: -1;
        pointer-events: none;
      }
      .stage[data-paused] .mc-anim-fx > i {
        animation-play-state: paused;
      }
      .preview-foot {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        min-width: 0;
      }
      .preview-foot .sum {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .reduced-note {
        display: none;
      }
      @media (prefers-reduced-motion: reduce) {
        .reduced-note {
          display: block;
        }
      }

      /* ── emitters ── */
      .em-bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding-bottom: 16px;
      }
      .em-tabs {
        flex: 1 1 100%;
        min-width: 0;
        display: flex;
      }
      .em-tabs .seg,
      .placement .seg {
        flex-wrap: wrap;
        max-width: 100%;
      }
      .placement .seg > button {
        flex: 1 1 0;
        white-space: normal;
      }
      .em-tabs .seg > button {
        max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .em-cap {
        flex-basis: 100%;
        margin: 0;
      }
      .em-head {
        display: flex;
        align-items: flex-end;
        gap: 4px;
        padding-bottom: 16px;
      }
      .em-name-field {
        flex: 1;
        min-width: 0;
      }
      .all-note {
        margin: 0 0 16px;
      }
      .placement {
        padding-bottom: 20px;
      }
      .em-live {
        margin: 0;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .em-live:empty {
        display: none;
      }

      /* ── mode ── */
      .note.is-warn {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        margin: 0;
        padding: 10px 12px;
        border-radius: var(--mc-radius);
        background: var(--mc-warn-tint);
        border: 1px solid color-mix(in srgb, var(--mc-warn-ink) 40%, transparent);
        color: var(--mc-text);
        font-size: 0.8125rem;
        line-height: 1.4;
      }
      .note.is-warn ha-icon {
        flex: none;
        --mdc-icon-size: 18px;
        color: var(--mc-warn-ink);
      }
      .mode-status > .help {
        margin: 0;
      }

      /* ── shape ── */
      .glyph {
        width: 18px;
        height: 18px;
        --mdc-icon-size: 18px;
      }
      .schips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      .schip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 32px;
        min-width: 32px;
        padding: 0 8px;
        border-radius: 16px;
        border: 1px solid var(--mc-field-border);
        background: var(--mc-surface);
        color: var(--mc-text);
        font-size: 0.75rem;
        font-variant-numeric: tabular-nums;
        justify-content: center;
      }
      .schip .emo {
        font-size: 1rem;
        line-height: 1;
      }
      .schip[aria-pressed='true'] {
        border-color: var(--mc-accent);
        box-shadow: 0 0 0 1px var(--mc-accent);
      }
      .schip.add {
        border-style: dashed;
        color: var(--mc-text-2);
        --mdc-icon-size: 18px;
      }
      .schip.add:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .chip-edit {
        display: grid;
        gap: 12px;
        padding: 12px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
      }
      .chip-edit-head {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 24px;
        font-size: 0.8125rem;
        font-weight: 500;
      }
      .chip-edit-head > span {
        flex: 1;
      }
      .chip-edit-head .icon-btn {
        margin: -4px -6px -4px 0;
      }
      .emoji-grid {
        display: grid;
        grid-template-columns: repeat(8, minmax(0, 1fr));
        gap: 4px;
      }
      .emoji-grid button {
        height: 36px;
        min-width: 0;
        padding: 0;
        border: 1px solid transparent;
        border-radius: var(--mc-radius);
        background: transparent;
        font-size: 1.15rem;
        line-height: 1;
        transition: background-color 0.15s ease-out, border-color 0.15s ease-out;
      }
      .emoji-grid button:hover {
        background: var(--mc-surface-2);
      }
      .emoji-grid button[aria-pressed='true'] {
        border-color: color-mix(in srgb, var(--mc-accent) 55%, transparent);
        background: var(--mc-accent-tint);
      }
      .emoji-row {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .emoji-row .input {
        flex: 1;
        min-width: 0;
        font-size: 1rem;
      }
      .emoji-big {
        flex: none;
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        border-radius: var(--mc-radius);
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface-2);
        font-size: 1.35rem;
      }
      .svg-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 56px;
        gap: 8px;
        align-items: start;
      }
      .svg-thumb {
        width: 56px;
        height: 56px;
        border-radius: var(--mc-radius);
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface-2);
        display: grid;
        place-items: center;
      }
      .svg-thumb > span {
        width: 32px;
        height: 32px;
        background: var(--mc-text);
      }
      textarea.input[aria-invalid='true'],
      .input[aria-invalid='true'] {
        border-color: var(--mc-error-ink);
      }

      /* ── tiles (flows, shapes) ── */
      .dirs,
      .shapes {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }
      .dir {
        display: grid;
        gap: 4px;
        justify-items: center;
        align-content: center;
        min-height: 44px;
        padding: 6px 4px 6px;
        min-width: 0;
        border-radius: var(--mc-radius);
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface);
        color: var(--mc-text-2);
        font-size: 0.75rem;
        font-weight: 500;
        transition: border-color 0.15s ease-out, background-color 0.15s ease-out, color 0.15s ease-out;
      }
      .dir > span:last-child {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dir:hover {
        border-color: var(--mc-field-border);
        color: var(--mc-text);
      }
      .dir[aria-checked='true'] {
        border-color: var(--mc-accent);
        box-shadow: inset 0 0 0 1px var(--mc-accent);
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
      }
      .dir-pv {
        position: relative;
        width: 100%;
        height: 34px;
        overflow: hidden;
        border-radius: 6px;
        background: var(--mc-surface-2);
      }
      .dir[aria-checked='true'] .dir-pv {
        background: color-mix(in srgb, var(--mc-surface) 70%, transparent);
      }
      .dir-pv i {
        position: absolute;
        width: 5px;
        height: 5px;
        margin: -2.5px 0 0 -2.5px;
        border-radius: 50%;
        background: currentColor;
        animation: var(--a) 1.8s linear infinite;
        animation-delay: calc(var(--n) * -0.6s);
      }
      .dir-pv i:nth-child(1) { --n: 0; }
      .dir-pv i:nth-child(2) { --n: 1; }
      .dir-pv i:nth-child(3) { --n: 2; }
      .dir-pv.fall i, .dir-pv.rise i, .dir-pv.zigzag i, .dir-pv.rain i { left: calc(25% + var(--n) * 25%); top: 0; }
      .dir-pv.fall i { --a: pv-fall; }
      .dir-pv.rise i { --a: pv-rise; }
      .dir-pv.zigzag i { --a: pv-zigzag; animation-duration: 2.2s; animation-delay: calc(var(--n) * -0.73s); }
      .dir-pv.rain i { --a: pv-rain; width: 2px; height: 7px; border-radius: 1px; animation-duration: 0.9s; animation-delay: calc(var(--n) * -0.3s); }
      .dir-pv.drift i, .dir-pv.wave i { left: 0; top: calc(30% + var(--n) * 20%); animation-duration: 2.4s; animation-delay: calc(var(--n) * -0.8s); }
      .dir-pv.drift i { --a: pv-drift; }
      .dir-pv.wave i { --a: pv-wave; }
      .dir-pv.burst i, .dir-pv.orbit i, .dir-pv.spiral i, .dir-pv.vortex i, .dir-pv.explode i { left: 50%; top: 50%; }
      .dir-pv.burst i { --a: pv-burst; animation-delay: calc(var(--n) * -0.15s); animation-timing-function: ease-out; }
      .dir-pv.orbit i { --a: pv-orbit; animation-duration: 2.4s; animation-delay: calc(var(--n) * -0.8s); }
      .dir-pv.spiral i { --a: pv-spiral; animation-duration: 2.4s; animation-delay: calc(var(--n) * -0.8s); }
      .dir-pv.vortex i { --a: pv-vortex; animation-duration: 2.4s; animation-delay: calc(var(--n) * -0.8s); }
      .dir-pv.explode i { top: 30%; --a: pv-explode; animation-duration: 2s; animation-delay: calc(var(--n) * -0.1s); }
      .dir-pv.fountain i { left: 50%; top: 100%; --a: pv-fountain; animation-duration: 1.8s; }
      .dir-pv.wander i { left: calc(25% + var(--n) * 25%); top: 50%; --a: pv-wander; animation-duration: 3s; animation-delay: calc(var(--n) * -1s); }
      @keyframes pv-fall {
        from { translate: 0 -4px; opacity: 0; }
        20%, 80% { opacity: 1; }
        to { translate: 0 38px; opacity: 0; }
      }
      @keyframes pv-rise {
        from { translate: 0 38px; opacity: 0; }
        20%, 80% { opacity: 1; }
        to { translate: 0 -4px; opacity: 0; }
      }
      @keyframes pv-drift {
        from { translate: -4px 0; opacity: 0; }
        20%, 80% { opacity: 1; }
        to { translate: 80px 0; opacity: 0; }
      }
      @keyframes pv-wave {
        0% { translate: -4px 0; opacity: 0; }
        20% { opacity: 1; }
        25% { translate: 18px -6px; }
        50% { translate: 38px 0; }
        75% { translate: 58px 6px; }
        80% { opacity: 1; }
        100% { translate: 80px 0; opacity: 0; }
      }
      @keyframes pv-zigzag {
        0% { translate: 0 -4px; opacity: 0; }
        20% { opacity: 1; }
        25% { translate: 6px 6px; }
        50% { translate: -6px 16px; }
        75% { translate: 6px 26px; }
        80% { opacity: 1; }
        100% { translate: 0 38px; opacity: 0; }
      }
      @keyframes pv-rain {
        from { translate: 6px -8px; opacity: 0; }
        15%, 85% { opacity: 1; }
        to { translate: -6px 38px; opacity: 0; }
      }
      @keyframes pv-burst {
        from { transform: rotate(calc(var(--n) * 120deg)) translateY(0); opacity: 0; }
        10%, 60% { opacity: 1; }
        to { transform: rotate(calc(var(--n) * 120deg)) translateY(-15px); opacity: 0; }
      }
      @keyframes pv-explode {
        0% { translate: 0 0; opacity: 0; }
        10% { opacity: 1; }
        35% { translate: calc((var(--n) - 1) * 16px) -8px; }
        85% { opacity: 1; }
        100% { translate: calc((var(--n) - 1) * 24px) 26px; opacity: 0; }
      }
      @keyframes pv-fountain {
        0% { translate: 0 0; opacity: 0; }
        10% { opacity: 1; }
        45% { translate: calc((var(--n) - 1) * 10px) -30px; }
        85% { opacity: 1; }
        100% { translate: calc((var(--n) - 1) * 20px) 0; opacity: 0; }
      }
      @keyframes pv-orbit {
        from { transform: rotate(0deg) translateY(-11px); }
        to { transform: rotate(360deg) translateY(-11px); }
      }
      @keyframes pv-spiral {
        from { transform: rotate(0deg) translateY(0); opacity: 0; }
        25%, 75% { opacity: 1; }
        to { transform: rotate(540deg) translateY(-15px); opacity: 0; }
      }
      @keyframes pv-vortex {
        from { transform: rotate(0deg) translateY(-15px); opacity: 0; }
        25%, 75% { opacity: 1; }
        to { transform: rotate(540deg) translateY(0); opacity: 0; }
      }
      @keyframes pv-wander {
        0%, 100% { translate: 0 0; opacity: 0.3; }
        25% { translate: 8px -6px; opacity: 1; }
        50% { translate: -4px 6px; opacity: 0.5; }
        75% { translate: 6px 4px; opacity: 1; }
      }
      .shape-tile {
        min-height: 52px;
        --mdc-icon-size: 22px;
      }
      .shape-tile .glyph {
        width: 22px;
        height: 22px;
        --mdc-icon-size: 22px;
      }
      @media (prefers-reduced-motion: reduce) {
        .dir-pv i {
          animation-play-state: paused;
        }
      }

      /* ── numbers ── */
      .pair {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .sub-lbl {
        display: block;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        margin-bottom: 4px;
      }
      .slider {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        align-items: center;
        min-height: 32px;
      }
      .slider input[type='range'] {
        width: 100%;
        margin: 0;
        accent-color: var(--mc-accent-fill);
      }
      .field-head .val {
        font-size: 0.75rem;
        color: var(--mc-text-2);
        font-variant-numeric: tabular-nums;
      }
      .seg.compass button {
        padding: 0;
        min-width: 32px;
        flex: 1;
        --mdc-icon-size: 18px;
      }

      /* ── colours ── */
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      .cchip {
        position: relative;
        width: 32px;
        height: 32px;
        padding: 3px;
        border-radius: 50%;
        border: 1px solid var(--mc-field-border);
        background: var(--mc-surface);
        display: grid;
        place-items: center;
      }
      .cchip > span {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--mc-text) 18%, transparent);
      }
      .cchip > ha-icon.ent {
        position: absolute;
        --mdc-icon-size: 14px;
        color: var(--mc-surface);
      }
      .cchip[aria-pressed='true'] {
        border-color: var(--mc-accent);
        box-shadow: 0 0 0 1px var(--mc-accent);
      }
      .cchip.add {
        border-style: dashed;
        color: var(--mc-text-2);
        --mdc-icon-size: 18px;
      }
      .cchip.add:hover:not(:disabled) {
        color: var(--mc-text);
        border-color: var(--mc-text-2);
      }
      .cchip.add:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .color-edit {
        display: grid;
        gap: 8px;
        padding: 12px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
      }
      .color-edit-head {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 24px;
        font-size: 0.8125rem;
        font-weight: 500;
      }
      .color-edit-head > span {
        flex: 1;
      }
      .color-edit-head .icon-btn {
        margin: -4px -6px -4px 0;
      }

      /* ── closed sections ── */
      .sector-btn .nm {
        display: grid;
        gap: 2px;
      }
      .sector-btn .ssum {
        font-size: 0.75rem;
        font-weight: 400;
        color: var(--mc-text-2);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .seed-row {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .seed-row .input {
        flex: 1;
        min-width: 0;
      }
      .checks {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 4px 12px;
      }
      .check {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 32px;
        font-size: 0.8125rem;
      }
      .check input {
        width: 18px;
        height: 18px;
        margin: 0;
        accent-color: var(--mc-accent-fill);
      }

      /* ── preset-based ── */
      .preset-card {
        display: grid;
        gap: 12px;
      }
      .preset-name {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }
      .preset-name .tile {
        flex: none;
        width: 36px;
        height: 36px;
        border-radius: var(--mc-radius);
        display: grid;
        place-items: center;
        background: var(--mc-surface-2);
        color: var(--mc-text-2);
        --mdc-icon-size: 20px;
      }
      .preset-name .txt {
        display: grid;
        gap: 2px;
        min-width: 0;
      }
      .preset-name strong {
        font-size: 0.875rem;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .preset-name .kind {
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .convert {
        justify-self: start;
      }

      /* the wide panel: preview beside the fields */
      @container (min-width: 640px) {
        .wrap {
          grid-template-columns: minmax(240px, 320px) minmax(0, 1fr);
          align-items: start;
          gap: 24px;
        }
        .preview {
          position: sticky;
          top: 0;
        }
        .stage {
          height: 180px;
        }
      }
      /* a wide form (the bottom panel): more tiles per row */
      @container form (min-width: 480px) {
        .dirs {
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }
        .shapes {
          grid-template-columns: repeat(6, minmax(0, 1fr));
        }
        .checks {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
    `,
  ];

  // ── events ──

  private _emit(doc: AnimationDoc, label: string, transient = false): void {
    if (this.disabled || doc === this.doc) return;
    if (transient) this._pending = { doc, label };
    else this._pending = undefined;
    const detail: DocChangeDetail = transient ? { doc, label, transient: true } : { doc, label };
    this.dispatchEvent(new CustomEvent<DocChangeDetail>('doc-change', { detail, bubbles: true, composed: true }));
  }

  /** Close an open transient edit with its final change (the last accepted document). */
  private _settle(): void {
    if (this._pending) {
      const { doc, label } = this._pending;
      this._pending = undefined;
      if (this.disabled) return;
      this.dispatchEvent(new CustomEvent<DocChangeDetail>('doc-change', { detail: { doc, label }, bubbles: true, composed: true }));
    }
  }

  /** The selected emitter, inside the document's emitters. */
  private get _em(): number {
    return this.doc ? Math.max(0, Math.min(Math.trunc(this.emitter) || 0, emitterCount(this.doc) - 1)) : 0;
  }

  private _viewKey?: { doc: AnimationDoc; em: number; view: AnimationDoc };

  /** The document as if the selected emitter were its only one: every field below reads and edits this. */
  private get _vdoc(): AnimationDoc {
    const doc = this.doc!;
    const em = this._em;
    if (this._viewKey?.doc !== doc || this._viewKey.em !== em) this._viewKey = { doc, em, view: emitterDoc(doc, this._seed, em) };
    return this._viewKey.view;
  }

  private get _p(): ParticlesSpec | undefined {
    return this.doc?.kind === 'particles' ? this._vdoc.particles : undefined;
  }

  /** The simulation the fields show (a v1 document read as one). */
  private get _sim(): ParticlesSim {
    return viewSim(this._vdoc, this._seed);
  }

  /** Runs a single-emitter edit on the selected emitter; the result is a whole document. */
  private _on(fn: (view: AnimationDoc) => AnimationDoc): AnimationDoc {
    return editEmitter(this.doc!, this._seed, this._em, fn);
  }

  private _patch(patch: Partial<ParticlesSpec>, label: string, transient = false): void {
    if (!this.doc) return;
    this._emit(this._on((d) => patchParticles(d, patch)), label, transient);
  }

  /** A v2-only edit (adds `sim` to a v1 document). */
  private _editSim(fn: (s: ParticlesSim) => ParticlesSim, label: string, transient = false): void {
    if (!this.doc) return;
    this._emit(this._on((d) => editSim(d, this._seed, fn)), label, transient);
  }

  /** The same edit on every emitter (document-wide fields such as bounce). */
  private _editAll(fn: (s: ParticlesSim) => ParticlesSim, label: string, transient = false): void {
    if (!this.doc) return;
    let doc = this.doc;
    for (let i = 0; i < emitterCount(doc); i++) doc = editEmitter(doc, this._seed, i, (d) => editSim(d, this._seed, fn));
    this._emit(doc, label, transient);
  }

  /** Selects an emitter (or "All particles"); the Layers list follows through `emitter-change`. */
  private _select(index: number, all = false): void {
    this.emitter = index;
    this.all = all;
    this.dispatchEvent(new CustomEvent('emitter-change', { detail: { index, all }, bubbles: true, composed: true }));
  }

  private get _multi(): boolean {
    return !!this.doc && emitterCount(this.doc) > 1;
  }

  private _name(i: number): string {
    return this._multi ? emitterLabel(this.doc!, this._seed, i) : t('Particles');
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('emitter') && changed.get('emitter') !== undefined) {
      // another emitter: drop drafts and selections of the old one
      this._svgDraft = undefined;
      this._emojiDraft = undefined;
      this._color = -1;
      this._chip = 0;
      this._live = '';
    }
    if (changed.has('doc')) {
      const prev = changed.get('doc') as AnimationDoc | undefined;
      // a document from outside (undo, another document): drop drafts of the old one
      if (prev && prev.id !== this.doc?.id) {
        this._svgDraft = undefined;
        this._emojiDraft = undefined;
        this._shapes = {};
        this._color = -1;
        this._chip = 0;
        this._seed = newSeed();
        this._stats = undefined;
        this.all = false;
        this._live = '';
      }
      if (this._p && !this._p.preset) {
        for (const w of this._sim.shapes) if (!('builtin' in w.shape)) this._shapes = { ...this._shapes, [shapeKind(w.shape)]: w.shape };
        const chips = shownShapes(this._sim).length;
        if (this._chip >= chips) this._chip = chips - 1;
      }
      const n = this._p?.colors.length ?? 0;
      if (this._color >= n) this._color = n - 1;
    }
  }

  // ── preview ──

  /** The particle layer the card would render for this document (always looping here). */
  private _preview(): { anim?: ResolvedAnimations; css: string } {
    const doc = this.doc;
    const p = this._p;
    if (!doc || !p) return { css: '' };
    if (p.preset) {
      const design = {
        animations: [{ id: 'pv', preset: p.preset, intensity: p.intensity, duration: `${doc.duration}s`, easing: doc.easing, iterations: 'infinite', direction: doc.direction }],
      } as unknown as DesignConfig;
      return { anim: resolveAnimations(design), css: '' };
    }
    // a v2 document compiles its v1 fallback until compile.ts has the particles compiler
    const c = compileAnimationDoc(doc);
    if (!c.layer || !c.name) return { css: '' };
    const cycle = +(doc.duration / c.layer.speed).toFixed(3);
    // part 1 (the emitters on the other side of the content) is the card's second layer, right after the first
    const fx: FxLayer[] = [[c.name, c.layer] as const, ...(c.split ? [[c.split.name, c.split.layer] as const] : [])].map(([name, l]) => ({
      preset: name,
      front: l.front,
      style: `--mc-fx-anim: ${name} ${cycle}s ${easingCss(doc.easing)} 0s infinite ${doc.direction ?? 'normal'}; --mc-fx-dur: ${cycle}s; --mc-fx-delay: 0s`,
      particles: l.particles,
      ...(l.symbol ? { symbol: l.symbol } : {}),
    }));
    return { css: c.css, anim: { style: '', fx } };
  }

  private _previewCss = '';

  protected updated(changed: PropertyValues<this>): void {
    // the compiled rules live in this shadow root only (no shared sheet: the editor has no global state)
    const el = this.renderRoot.querySelector<HTMLStyleElement>('style[data-pv]');
    if (el && el.textContent !== this._previewCss) el.textContent = this._previewCss;
    if (changed.has('doc')) this._scheduleBake();
    this._applyModule();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._release();
    this._bakeToken++;
  }

  /** With the particles module: bake once the edits settle, for the size stats under the preview. */
  private _scheduleBake(): void {
    const m = getStudioParticles();
    const spec = this.doc && this._p?.sim && !this._p.preset ? bakeSpec(this.doc) : undefined;
    const token = ++this._bakeToken;
    if (!m || !spec) {
      this._stats = undefined;
      this._baking = false;
      return;
    }
    if (this._bakeMs > SLOW_BAKE_MS) this._baking = true;
    const doc = this.doc!;
    setTimeout(() => {
      if (token !== this._bakeToken) return;
      const t0 = performance.now();
      try {
        this._stats = m.bake({ spec, period: periodOf(doc), geometry: DEFAULT_GEOMETRY }).stats;
      } catch {
        this._stats = undefined;
      }
      this._bakeMs = performance.now() - t0;
      this._baking = false;
    }, 0);
  }

  /** With the particles module: hand the preview layer of a v2 document to it (re-bake, Live engine); Pause releases Live. */
  private _applyModule(): void {
    const m = getStudioParticles();
    const spec = this.doc && this._p?.sim && !this._p.preset ? bakeSpec(this.doc) : undefined;
    const layers = [...this.renderRoot.querySelectorAll<HTMLElement>('.stage .mc-anim-fx')];
    if (this._applied.some((l, i) => l !== layers[i])) this._release();
    if (!m || !spec || !layers.length || (this._paused && spec.sim.mode === 'live')) {
      this._release();
      return;
    }
    const reducedMotion = typeof matchMedia === 'function' && matchMedia(t('(prefers-reduced-motion: reduce)')).matches;
    try {
      layers.forEach((layer, i) => {
        m.apply(layer, {
          useCss: (name, rules) => {
            this._liveCss.set(name, rules);
            const s = this.renderRoot.querySelector<HTMLStyleElement>('style[data-live]');
            if (s) s.textContent = [...this._liveCss.values()].join('\n');
          },
          reducedMotion,
          content: () => this.renderRoot.querySelector('.stage-module') ?? undefined,
          docId: this.doc!.id,
          spec,
          period: periodOf(this.doc!),
          ...(i === 1 ? { part: 1 as const } : {}),
        });
      });
      this._applied = layers;
    } catch {
      /* the module logs its own errors */
    }
  }

  private _release(): void {
    for (const l of this._applied) getStudioParticles()?.release(l);
    this._applied = [];
  }

  private _renderPreview(): TemplateResult {
    const { anim, css: rules } = this._preview();
    this._previewCss = rules;
    const p = this._p!;
    const preset = basePreset(this.doc!);
    const sim = p.preset ? undefined : this._sim;
    const sum = !sim
      ? `${preset ? tl(preset.name) : p.preset} · ${this.doc!.duration} s`
      : this._baking
        ? t('Baking…')
        : `${this._multi ? t('{particles} particles · {emitters} emitters', { particles: emitterParents(this.doc!), emitters: emitterCount(this.doc!) }) : t('{count, plural, one {# particle} other {# particles}} · {flow}', { count: p.count, flow: t(FLOW_LABELS[sim.flow]).toLowerCase() })} · ${sim.mode === 'live' ? t('live') : t('{seconds} s loop', { seconds: +periodOf(this.doc!).toFixed(2) })}`;
    const capped = !!sim && !!this._stats?.capped;
    const warn = !!sim && !capped && !!this._stats?.warn;
    const canExport = !!sim && !!getStudioParticles();
    return html`<div class="preview">
      <div class="stage" data-mc-anim-fx ?data-paused=${this._paused} aria-hidden="true">
        <div class="stage-module"><ha-icon icon="mdi:lightbulb-outline"></ha-icon><span>${t('Living room')}</span></div>
        ${anim ? renderFx(anim) : nothing}
      </div>
      <div class="preview-foot">
        <span class="sum">${sum}</span>
        ${capped ? html`<span class="chip is-warn trimmed">${t('Trimmed')}</span>` : nothing}
        ${canExport
          ? html`<button type="button" class="icon-btn sm export" aria-label=${t('Animated SVG')} title=${t('Save as animated SVG')} ?disabled=${this.disabled} @click=${this._openExport}>
              <ha-icon icon="mdi:motion-play-outline"></ha-icon>
            </button>`
          : nothing}
        ${sim
          ? html`<button type="button" class="icon-btn sm shuffle" aria-label=${t('Shuffle')} title=${t('Shuffle: new random paths')} ?disabled=${this.disabled} @click=${this._shuffle}>
              <ha-icon icon="mdi:dice-5-outline"></ha-icon>
            </button>`
          : nothing}
        <button
          type="button"
          class="icon-btn sm pause"
          aria-pressed=${this._paused ? 'true' : 'false'}
          aria-label=${t('Pause preview')}
          title=${this._paused ? t('Play preview') : t('Pause preview')}
          @click=${() => (this._paused = !this._paused)}
        >
          <ha-icon icon=${this._paused ? 'mdi:play' : 'mdi:pause'}></ha-icon>
        </button>
      </div>
      ${capped ? html`<p class="help cap-note">${t('This loop hit the size limit, so it shows fewer particles. Lower the count or the child particles.')}</p>` : nothing}
      ${warn ? html`<p class="help cap-note">${t('This loop is large, so it takes longer to load on wall tablets. Lower the count or the child particles.')}</p>` : nothing}
      <p class="help reduced-note">${t('Reduced motion is on, so the preview stays still.')}</p>
      ${canExport ? html`<mc-anim-svg-dialog .doc=${this.doc}></mc-anim-svg-dialog>` : nothing}
    </div>`;
  }

  private _shuffle = (): void => {
    if (!this.doc) return;
    // "All particles" shuffles every emitter, an emitter only itself
    const all = this._multi && this.all;
    let doc = this.doc;
    for (let i = all ? 0 : this._em; i < (all ? emitterCount(this.doc) : this._em + 1); i++) doc = editEmitter(doc, this._seed, i, (d) => shuffleSeed(d, this._seed));
    this._emit(doc, 'Shuffle');
  };

  private _openExport = (): void => {
    this.renderRoot.querySelector<AnimSvgDialog>('mc-anim-svg-dialog')?.openExport(true);
  };

  // ── keyboard ──

  /** Columns a tile grid renders with (its container query decides), for Up / Down. */
  private _cols(grid: Element | null): number {
    if (!grid || typeof getComputedStyle !== 'function') return 3;
    const t = getComputedStyle(grid).gridTemplateColumns || '';
    const rep = /^repeat\((\d+)/.exec(t);
    if (rep) return +rep[1];
    const n = t.split(/\s+/).filter((x) => /px$/.test(x)).length;
    return n || 3;
  }

  private _radioKeys(e: KeyboardEvent, ids: readonly string[], current: string, pick: (id: string) => void, grid = 0): void {
    const i = Math.max(0, ids.indexOf(current));
    let j: number;
    if (e.key === 'ArrowRight') j = i + 1;
    else if (e.key === 'ArrowLeft') j = i - 1;
    else if (e.key === 'ArrowDown') j = i + (grid || 1);
    else if (e.key === 'ArrowUp') j = i - (grid || 1);
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = ids.length - 1;
    else return;
    e.preventDefault();
    j = (j + ids.length) % ids.length;
    pick(ids[j]);
  }

  private _focus(selector: string): void {
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>(selector)?.focus());
  }

  // ── mode ──

  private _pickMode(mode: ParticleMode, focus = false): void {
    if (this.doc) this._emit(setMode(this.doc, this._seed, mode), mode === 'live' ? t('Use live simulation') : t('Use baked loop'));
    if (focus) this._focus(`.mode-seg [data-mode="${mode}"]`);
  }

  private _renderMode(sim: ParticlesSim): TemplateResult {
    const modes: Array<[ParticleMode, string, string]> = [
      ['baked', t('Baked loop'), 'mdi:repeat'],
      ['live', t('Live simulation'), 'mdi:pulse'],
    ];
    return html`<section class="group" aria-labelledby="h-mode">
      <div class="group-head"><h3 id="h-mode">${t('Mode')}</h3></div>
      <div
        class="seg full mode-seg"
        role="radiogroup"
        aria-label=${t('Simulation')}
        @keydown=${(e: KeyboardEvent) => this._radioKeys(e, ['baked', 'live'], sim.mode, (id) => this._pickMode(id as ParticleMode, true))}
      >
        ${modes.map(
          ([id, label, icon]) => html`<button
            type="button"
            role="radio"
            data-mode=${id}
            aria-checked=${sim.mode === id ? 'true' : 'false'}
            tabindex=${sim.mode === id ? 0 : -1}
            @click=${() => this._pickMode(id)}
          >
            <ha-icon icon=${icon}></ha-icon>${label}
          </button>`,
        )}
      </div>
      <div class="mode-status" role="status">
        ${sim.mode === 'live'
          ? html`<p class="note is-warn live-warning"><ha-icon icon="mdi:alert-outline" aria-hidden="true"></ha-icon><span>${LIVE_WARNING}</span></p>`
          : html`<p class="help">${t("The studio works out every particle's path once and plays it as a loop. Light on dashboards.")}</p>`}
      </div>
    </section>`;
  }

  // ── shape ──

  private _chips(): WeightedShape[] {
    return shownShapes(this._sim);
  }

  private _setShapes(shapes: WeightedShape[], label: string, transient = false): void {
    if (this.doc) this._emit(this._on((d) => setShapes(d, this._seed, shapes)), label, transient);
  }

  /** Chip `i` becomes `shape` (weight kept). */
  private _setChip(i: number, shape: WeightedShape['shape'], label: string, transient = false): void {
    const shapes = this._chips().map((w, j) => (j === i ? { shape, weight: w.weight } : w));
    this._setShapes(shapes, label, transient);
  }

  /** The shape a tile kind starts as (own shapes: the last one used, else the default). */
  private _shapeFor(kind: ShapeKind): WeightedShape['shape'] {
    if (isBuiltinKind(kind)) return { builtin: kind };
    return this._shapes[kind] ?? SHAPE_DEFAULTS[kind];
  }

  private _pickKind(kind: ShapeKind, focus = false): void {
    const cur = this._chips()[this._chip];
    if (cur && shapeKind(cur.shape) !== kind) {
      this._svgDraft = undefined;
      this._emojiDraft = undefined;
      this._setChip(this._chip, this._shapeFor(kind), `Use ${kind}`);
    }
    if (focus) this._focus(`.shapes.main [data-kind="${kind}"]`);
  }

  private _addShape(): void {
    const chips = this._chips();
    if (chips.length >= MAX_SHAPES) return;
    this._chip = chips.length;
    this._setShapes([...chips, { shape: nextShape(chips), weight: 1 }], t('Add shape'));
  }

  private _removeShape(i: number): void {
    const chips = this._chips();
    if (chips.length <= 1) return;
    this._chip = Math.max(0, Math.min(i, chips.length - 2));
    this._setShapes(
      chips.filter((_, j) => j !== i),
      t('Remove shape'),
    );
    this._focus(`.schip[data-i="${this._chip}"]`);
  }

  private _shapeGrid(kind: ShapeKind | undefined, cls: string, label: string, pick: (k: ShapeKind, focus: boolean) => void): TemplateResult {
    const ids = SHAPE_KINDS.map((k) => k.id);
    const current = kind ?? ids[0];
    return html`<div
      class="shapes ${cls}"
      role="radiogroup"
      aria-label=${label}
      @keydown=${(e: KeyboardEvent) => this._radioKeys(e, ids, current, (id) => pick(id as ShapeKind, true), this._cols(e.currentTarget as Element))}
    >
      ${SHAPE_KINDS.map(
        (k) => html`<button
          type="button"
          class="dir shape-tile"
          role="radio"
          data-kind=${k.id}
          aria-checked=${k.id === kind ? 'true' : 'false'}
          tabindex=${k.id === current ? 0 : -1}
          @click=${() => pick(k.id, false)}
        >
          ${glyph(k.id)}<span>${t(k.label)}</span>
        </button>`,
      )}
    </div>`;
  }

  private _renderShape(): TemplateResult {
    const chips = this._chips();
    const sel = Math.min(this._chip, chips.length - 1);
    const cur = chips[sel];
    const kind = shapeKind(cur.shape);
    const mixed = chips.length > 1;
    const full = chips.length >= MAX_SHAPES;
    return html`<section class="group" aria-labelledby="h-shape">
      <div class="group-head"><h3 id="h-shape">${t('Shape')}</h3></div>
      <div class="schips" role="group" aria-label=${t('Shape mix')}>
        ${chips.map(
          (w, i) => html`<button
            type="button"
            class="schip"
            data-i=${i}
            aria-pressed=${i === sel ? 'true' : 'false'}
            aria-label=${mixed ? t('Shape {n}: {shape}, weight {weight}', { n: i + 1, shape: shapeLabel(w.shape), weight: w.weight }) : t('Shape {n}: {shape}', { n: i + 1, shape: shapeLabel(w.shape) })}
            title=${shapeLabel(w.shape)}
            @click=${() => (this._chip = i)}
            @keydown=${(e: KeyboardEvent) => {
              if ((e.key === 'Delete' || e.key === 'Backspace') && mixed) {
                e.preventDefault();
                this._removeShape(i);
              }
            }}
          >
            ${chipFace(w.shape)}${mixed ? html`<span>${w.weight}</span>` : nothing}
          </button>`,
        )}
        <button type="button" class="schip add" aria-label=${t('Add shape')} title=${full ? t('At most {mAX_SHAPES} shapes', { mAX_SHAPES: MAX_SHAPES }) : t('Add shape')} ?disabled=${full} @click=${() => this._addShape()}>
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
      </div>
      <div class="chip-edit">
        <div class="chip-edit-head">
          <span>${t('Shape {n}', { n: sel + 1 })}</span>
          ${mixed
            ? html`<button type="button" class="icon-btn sm danger remove-shape" aria-label=${t('Remove shape {n}', { n: sel + 1 })} title=${t('Remove shape')} @click=${() => this._removeShape(sel)}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>`
            : nothing}
        </div>
        ${this._shapeGrid(kind, 'main', t('Shape {n}', { n: sel + 1 }), (k, focus) => this._pickKind(k, focus))}
        ${kind === 'icon' ? this._renderIcon(cur.shape) : kind === 'emoji' ? this._renderEmoji(cur.shape) : kind === 'svg' ? this._renderSvg(cur.shape) : nothing}
        ${mixed ? this._renderWeight(chips, sel) : nothing}
      </div>
      ${mixed ? nothing : html`<p class="help">${t('Add a shape to mix shapes. Each one gets a weight.')}</p>`}
    </section>`;
  }

  private _renderWeight(chips: WeightedShape[], i: number): TemplateResult {
    const w = chips[i].weight;
    return html`<div class="field">
      <div class="field-head"><label for="f-weight">${t('Weight')}</label></div>
      <input
        id="f-weight"
        class="input"
        type="number"
        inputmode="numeric"
        min=${V2_LIMITS.weight.min}
        max=${V2_LIMITS.weight.max}
        step="1"
        .value=${live(String(w))}
        aria-describedby="h-weight"
        @change=${(e: Event) => {
          const input = e.target as HTMLInputElement;
          const n = limitV2('weight', input.value);
          if (n === undefined || n === w) {
            input.value = String(w);
            return;
          }
          input.value = String(n);
          this._setShapes(
            chips.map((c, j) => (j === i ? { shape: c.shape, weight: n } : c)),
            t('Change weight'),
          );
        }}
      />
      <p class="help" id="h-weight">${t('About {percent}% of particles', { percent: shapeShare(chips, i) })}</p>
    </div>`;
  }

  private _renderIcon(shape: WeightedShape['shape']): TemplateResult {
    const value = 'icon' in shape ? shape.icon : '';
    return html`<div class="field">
      <div class="field-head"><span class="lbl" id="l-icon">${t('Icon')}</span></div>
      <mc-icon-picker
        .hass=${this.hass}
        .value=${value}
        label=${t('Particle icon')}
        aria-labelledby="l-icon"
        @value-changed=${(e: CustomEvent) => {
          e.stopPropagation();
          const v = String(e.detail.value ?? '').trim();
          if (validIcon(v) && v !== value) this._setChip(this._chip, { icon: v }, 'Change icon');
        }}
      ></mc-icon-picker>
    </div>`;
  }

  private _renderEmoji(shape: WeightedShape['shape']): TemplateResult {
    const value = 'emoji' in shape ? shape.emoji : '';
    const text = this._emojiDraft ?? value;
    const err = this._emojiDraft !== undefined ? emojiError(this._emojiDraft) : undefined;
    const set = (v: string, label: string, transient: boolean) => {
      if (!emojiError(v) && v.trim() !== this._lastEmoji()) this._setChip(this._chip, { emoji: v.trim() }, label, transient);
    };
    return html`<div class="field">
      <div class="field-head"><label for="f-emoji">${t('Emoji or symbol')}</label></div>
      <div class="emoji-row">
        <span class="emoji-big" aria-hidden="true">${value}</span>
        <input
          id="f-emoji"
          class="input"
          type="text"
          maxlength="24"
          autocomplete="off"
          .value=${text}
          aria-invalid=${err ? 'true' : 'false'}
          aria-describedby=${err ? 'e-emoji' : nothing}
          @input=${(e: InputEvent) => {
            const v = (e.target as HTMLInputElement).value;
            this._emojiDraft = v;
            set(v, 'Change emoji', true);
          }}
          @change=${() => {
            if (this._emojiDraft !== undefined && !emojiError(this._emojiDraft)) this._emojiDraft = undefined;
            this._settle();
          }}
        />
      </div>
      ${err ? html`<p class="help error" id="e-emoji" role="alert">${err}</p>` : nothing}
      <div class="emoji-grid" role="group" aria-label=${t('Common emoji')}>
        ${COMMON_EMOJI.map(
          (em) => html`<button
            type="button"
            aria-pressed=${em === value ? 'true' : 'false'}
            aria-label=${t('Use {emoji}', { emoji: em })}
            @click=${() => {
              this._emojiDraft = undefined;
              if (em !== value) this._setChip(this._chip, { emoji: em }, 'Change emoji');
            }}
          >
            ${em}
          </button>`,
        )}
      </div>
    </div>`;
  }

  private _lastEmoji(): string {
    const s = this._chips()[this._chip]?.shape;
    return s && 'emoji' in s ? s.emoji : '';
  }

  private _renderSvg(shape: WeightedShape['shape']): TemplateResult {
    const value = 'svg' in shape ? shape.svg : '';
    const text = this._svgDraft ?? value;
    const err = this._svgDraft !== undefined ? svgError(this._svgDraft) : undefined;
    // the mask the card uses for this SVG (compiled as a one-shape v1 layer)
    const c = compileAnimationDoc({ ...this.doc!, particles: { ...this._p!, sim: undefined, shape: { svg: value } } });
    const mask = /mask: (url\("[^"]*"\))/.exec(c.css)?.[1];
    return html`<div class="field">
      <div class="field-head"><label for="f-svg">${t('Own SVG')}</label></div>
      <div class="svg-row">
        <textarea
          id="f-svg"
          class="input"
          rows="4"
          spellcheck="false"
          .value=${text}
          aria-invalid=${err ? 'true' : 'false'}
          aria-describedby=${err ? 'e-svg h-svg' : 'h-svg'}
          @input=${(e: InputEvent) => {
            const v = (e.target as HTMLTextAreaElement).value;
            this._svgDraft = v;
            if (!svgError(v) && v !== value) this._setChip(this._chip, { svg: v }, 'Edit SVG', true);
          }}
          @change=${() => {
            if (this._svgDraft !== undefined && !svgError(this._svgDraft)) this._svgDraft = undefined;
            this._settle();
          }}
        ></textarea>
        <span class="svg-thumb" aria-hidden="true" title=${t('The shape as a mask')}>
          ${mask ? html`<span style=${`-webkit-mask: ${mask} center / contain no-repeat; mask: ${mask} center / contain no-repeat;`}></span>` : nothing}
        </span>
      </div>
      ${err ? html`<p class="help error" id="e-svg" role="alert">${err}</p>` : nothing}
      <p class="help" id="h-svg">${t('Paths and shapes only: scripts, styles and links are removed. The shape is filled with the particle colour.')}</p>
    </div>`;
  }

  // ── movement ──

  private _pickFlow(f: ParticlesSim['flow'], focus = false): void {
    if (this.doc && this._sim.flow !== f) this._emit(this._on((d) => setFlow(d, this._seed, f)), 'Change flow');
    if (focus) this._focus(`.dir[data-dir="${f}"]`);
  }

  private _number(key: 'count' | 'speed', id: string, value: number, label: string): TemplateResult {
    const l = LIMITS[key];
    // an emitter's count stops at the parents still free in the document
    const max = key === 'count' ? Math.min(l.max, value + parentsLeft(this.doc!)) : l.max;
    return html`<input
      id=${id}
      class="input"
      type="number"
      inputmode="decimal"
      min=${l.min}
      max=${max}
      step=${key === 'speed' ? 0.1 : 1}
      .value=${String(value)}
      @change=${(e: Event) => {
        const input = e.target as HTMLInputElement;
        const raw = limitNumber(key, input.value);
        const n = raw === undefined ? undefined : Math.min(raw, max);
        if (n === undefined || n === value) {
          input.value = String(value);
          return;
        }
        input.value = String(n);
        this._patch({ [key]: n }, label);
      }}
    />`;
  }

  private _unit(key: 'spread', id: string, value: number, unit: string, label: string, def: number): TemplateResult {
    return html`<mc-unit-field
      .inputId=${id}
      .value=${`${value}${unit}`}
      .units=${[unit]}
      noCustom
      .label=${label}
      ?disabled=${this.disabled}
      @value-changed=${(e: CustomEvent) => {
        e.stopPropagation();
        const raw = String(e.detail.value ?? '');
        const n = raw === '' ? def : limitNumber(key, raw);
        if (n === undefined) {
          (e.target as { revert?: () => void }).revert?.();
          return;
        }
        if (n !== value) this._patch({ [key]: n }, label);
        else (e.target as { revert?: () => void }).revert?.();
      }}
    ></mc-unit-field>`;
  }

  /**
   * A From / To pair of number inputs (`scale`: shown = stored × scale). A From above To is swapped.
   * Labels the inputs "Lowest …" / "Highest …".
   */
  private _range(id: string, label: string, noun: string, value: Range, key: V2LimitKey, set: (r: Range) => void, opts: { scale?: number; help?: string } = {}): TemplateResult {
    const scale = opts.scale ?? 1;
    const shown: Range = [+(value[0] * scale).toFixed(2), +(value[1] * scale).toFixed(2)];
    const step = V2_LIMITS[key].step;
    return html`<div class="field">
      <div class="field-head"><span class="lbl" id=${`l-${id}`}>${label}</span></div>
      <div class="pair" role="group" aria-labelledby=${`l-${id}`}>
        ${([0, 1] as const).map(
          (end) => html`<div>
            <label class="sub-lbl" for=${`f-${id}-${end}`}>${end === 0 ? t('From') : t('To')}</label>
            <input
              id=${`f-${id}-${end}`}
              class="input"
              type="number"
              inputmode="decimal"
              min=${V2_LIMITS[key].min}
              max=${V2_LIMITS[key].max}
              step=${step}
              aria-label=${end === 0 ? t('Lowest {noun}', { noun }) : t('Highest {noun}', { noun })}
              .value=${live(String(shown[end]))}
              @change=${(e: Event) => {
                const input = e.target as HTMLInputElement;
                const n = limitV2(key, input.value);
                if (n === undefined) {
                  input.value = String(shown[end]);
                  return;
                }
                const next = orderRange(end === 0 ? [n, shown[1]] : [shown[0], n]);
                if (next[0] === shown[0] && next[1] === shown[1]) {
                  input.value = String(shown[end]);
                  return;
                }
                set([+(next[0] / scale).toFixed(4), +(next[1] / scale).toFixed(4)]);
              }}
            />
          </div>`,
        )}
      </div>
      ${opts.help ? html`<p class="help">${opts.help}</p>` : nothing}
    </div>`;
  }

  /** One 0-1 slider: transient changes while dragging, one final change. */
  private _slider(id: string, label: string, unit: number, text: string, onValue: (n: number, transient: boolean) => void, opts: { help?: string; disabled?: boolean } = {}): TemplateResult {
    return html`<div class="field">
      <div class="field-head"><label for=${id}>${label}</label><span class="val">${text}</span></div>
      <div class="slider">
        <input
          id=${id}
          type="range"
          min="0"
          max="1"
          step=${V2_LIMITS.unit.step}
          .value=${live(String(unit))}
          aria-valuetext=${text}
          ?disabled=${opts.disabled}
          @input=${(e: Event) => {
            const n = limitV2('unit', (e.target as HTMLInputElement).value);
            if (n !== undefined) onValue(n, true);
          }}
          @change=${() => this._settle()}
        />
      </div>
      ${opts.help ? html`<p class="help">${opts.help}</p>` : nothing}
    </div>`;
  }

  /** The loop speed: one for the whole document (the period every emitter shares). */
  private _renderTiming(p: ParticlesSpec): TemplateResult {
    return html`<section class="group" aria-labelledby="h-timing">
      <div class="group-head"><h3 id="h-timing">${t('Timing')}</h3></div>
      <div class="field">
        <div class="field-head"><label for="f-speed">${t('Loop speed (×)')}</label></div>
        ${this._number('speed', 'f-speed', p.speed, t('Change speed'))}
      </div>
    </section>`;
  }

  private _renderMovement(p: ParticlesSpec, sim: ParticlesSim, withSpeed = true): TemplateResult {
    return html`<section class="group" aria-labelledby="h-move">
      <div class="group-head"><h3 id="h-move">${t('Movement')}</h3></div>
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-dir">${t('Flow')}</span></div>
        <div
          class="dirs"
          role="radiogroup"
          aria-labelledby="l-dir"
          @keydown=${(e: KeyboardEvent) => this._radioKeys(e, FLOWS, sim.flow, (id) => this._pickFlow(id as ParticlesSim['flow'], true), this._cols(e.currentTarget as Element))}
        >
          ${FLOWS.map(
            (d) => html`<button
              type="button"
              class="dir"
              role="radio"
              data-dir=${d}
              aria-checked=${d === sim.flow ? 'true' : 'false'}
              tabindex=${d === sim.flow ? 0 : -1}
              title=${t(FLOW_LABELS[d])}
              @click=${() => this._pickFlow(d)}
            >
              <span class="dir-pv ${d}" aria-hidden="true"><i></i><i></i><i></i></span>
              <span>${t(FLOW_LABELS[d])}</span>
            </button>`,
          )}
        </div>
      </div>
      <div class=${withSpeed ? 'pair' : ''}>
        ${withSpeed
          ? html`<div class="field">
              <div class="field-head"><label for="f-speed">${t('Loop speed (×)')}</label></div>
              ${this._number('speed', 'f-speed', p.speed, t('Change speed'))}
            </div>`
          : nothing}
        <div class="field">
          <div class="field-head"><label for="f-spread">${flowSpreadLabel(sim.flow)}</label></div>
          ${this._unit('spread', 'f-spread', p.spread, '%', t('Change spread'), 100)}
        </div>
      </div>
      ${sim.flow === 'rain' ? this._renderWind(sim) : nothing}
      ${this._range('pspeed', t('Particle speed (% of short side/s)'), t('speed'), sim.ranges.speed, 'pspeed', (r) => this._editSim((s) => ({ ...s, ranges: { ...s.ranges, speed: r } }), 'Change particle speed'), {
        help: t("Each particle picks a speed in this range, measured in % of the card's shorter side per second. At 100, a particle crosses a square card in one second."),
      })}
    </section>`;
  }

  /** Rain only: the wind angle, written as the gravity direction (no contract field). */
  private _renderWind(sim: ParticlesSim): TemplateResult {
    const w = windOf(sim.physics.gravity.angle);
    return html`<div class="field">
      <div class="field-head"><label for="f-wind">${t('Wind angle (deg)')}</label></div>
      <input
        id="f-wind"
        class="input"
        type="number"
        inputmode="numeric"
        min=${V2_LIMITS.wind.min}
        max=${V2_LIMITS.wind.max}
        step=${V2_LIMITS.wind.step}
        .value=${live(String(w))}
        aria-describedby="h-wind"
        @change=${(e: Event) => {
          const input = e.target as HTMLInputElement;
          const n = limitV2('wind', input.value);
          if (n === undefined || n === w) {
            input.value = String(w);
            return;
          }
          input.value = String(n);
          this._emit(this._on((d) => setWind(d, this._seed, n)), 'Change wind angle');
        }}
      />
      <p class="help" id="h-wind">${t('Negative blows the rain to the left, positive to the right. It sets the gravity direction.')}</p>
    </div>`;
  }

  // ── look ──

  private _setSize(end: 0 | 1, raw: string, el: HTMLElement): void {
    const p = this._p!;
    const n = raw === '' ? undefined : parseFloat(raw);
    if (n === undefined || !Number.isFinite(n)) {
      (el as unknown as { revert?: () => void }).revert?.();
      return;
    }
    const size = sizeRange(p.size, end, n);
    if (size[0] === p.size[0] && size[1] === p.size[1]) (el as unknown as { revert?: () => void }).revert?.();
    else this._patch({ size }, 'Change size');
  }

  private _renderLook(p: ParticlesSpec, sim: ParticlesSim): TemplateResult {
    return html`<section class="group" aria-labelledby="h-look">
      <div class="group-head"><h3 id="h-look">${t('Look')}</h3></div>
      <div class="field">
        <div class="field-head"><label for="f-count">${t('Count')}</label></div>
        ${this._number('count', 'f-count', p.count, t('Change count'))}
        ${this._multi ? html`<p class="help count-help">${t('Up to {parentsLeft} for this emitter. All emitters share {parents} particles.', { parentsLeft: p.count + parentsLeft(this.doc!), parents: PARTICLES_V2_CAPS.parents })}</p>` : nothing}
      </div>
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-size">${t('Size')}</span></div>
        <div class="pair" role="group" aria-labelledby="l-size">
          ${([0, 1] as const).map(
            (end) => html`<div>
              <label class="sub-lbl" for=${`f-size-${end}`}>${end === 0 ? t('From') : t('To')}</label>
              <mc-unit-field
                compact
                .inputId=${`f-size-${end}`}
                .value=${`${p.size[end]}px`}
                .units=${['px']}
                noCustom
                .label=${end === 0 ? t('Smallest size') : t('Largest size')}
                ?disabled=${this.disabled}
                @value-changed=${(e: CustomEvent) => {
                  e.stopPropagation();
                  this._setSize(end, String(e.detail.value ?? ''), e.target as HTMLElement);
                }}
              ></mc-unit-field>
            </div>`,
          )}
        </div>
      </div>
      ${this._range('opacity', t('Opacity (%)'), t('opacity'), sim.ranges.opacity, 'opacity', (r) => this._editSim((s) => ({ ...s, ranges: { ...s.ranges, opacity: r } }), 'Change opacity'), { scale: 100 })}
      ${this._renderColors(p)}
      <div class="switch-row">
        <span class="txt" id="l-fade">${t('Fade in and out')}<p class="help">${t('Particles appear and vanish softly.')}</p></span>
        <button
          type="button"
          class="switch fade"
          role="switch"
          aria-labelledby="l-fade"
          aria-checked=${p.fade ? 'true' : 'false'}
          @click=${() => this._patch({ fade: !p.fade }, p.fade ? t('Turn fade off') : t('Turn fade on'))}
        ></button>
      </div>
    </section>`;
  }

  private _pickLayer(l: ParticlesSpec['layer'], focus = false): void {
    if (this.doc && emitterPlacement(this.doc, this._em) !== l) {
      const name = this._name(this._em);
      const where = l === 'front' ? t('in front of the content') : t('behind the content');
      this._live = t('{name} is now {where}.', { name, where });
      this._emit(setEmitterPlacement(this.doc, this._seed, this._em, l), `${name} ${where}`);
    }
    if (focus) this._focus(`.layer-seg [data-layer="${l}"]`);
  }

  /** Placement of the selected emitter: behind or in front of the content (the card draws a second particle layer for the other side). */
  private _renderPlacement(): TemplateResult {
    const side = emitterPlacement(this.doc!, this._em);
    return html`<div class="field placement">
      <div class="field-head"><span class="lbl" id="l-place">${t('Placement')}</span></div>
      <div
        class="seg full layer-seg"
        role="radiogroup"
        aria-label=${t('Placement')}
        @keydown=${(e: KeyboardEvent) => this._radioKeys(e, ['back', 'front'], side, (id) => this._pickLayer(id as ParticlesSpec['layer'], true))}
      >
        ${(['back', 'front'] as const).map(
          (l) => html`<button type="button" role="radio" data-layer=${l} aria-checked=${side === l ? 'true' : 'false'} tabindex=${side === l ? 0 : -1} aria-describedby="h-place" @click=${() => this._pickLayer(l)}>
            ${l === 'back' ? t('Behind the content') : t('In front of the content')}
          </button>`,
        )}
      </div>
      <p class="help placement-help" id="h-place">${t('In front: particles draw over text and icons. They never block clicks.')}</p>
      <p class="em-live" role="status">${this._live}</p>
    </div>`;
  }

  private _addColor(): void {
    const p = this._p!;
    if (p.colors.length >= ANIMATION_CAPS.colors) return;
    const next = NEW_COLORS.find((c) => !p.colors.includes(c)) ?? NEW_COLORS[p.colors.length % NEW_COLORS.length];
    this._color = p.colors.length;
    this._patch({ colors: [...p.colors, next] }, 'Add colour');
  }

  private _removeColor(i: number): void {
    const p = this._p!;
    const colors = p.colors.filter((_, j) => j !== i);
    this._color = colors.length ? Math.min(i, colors.length - 1) : -1;
    this._patch({ colors }, 'Remove colour');
    void this.updateComplete.then(() =>
      (this.renderRoot.querySelector<HTMLButtonElement>(`.cchip[data-i="${this._color}"]`) ?? this.renderRoot.querySelector<HTMLButtonElement>('.cchip.add'))?.focus(),
    );
  }

  private _renderColors(p: ParticlesSpec): TemplateResult {
    const sel = this._color >= 0 && this._color < p.colors.length ? this._color : -1;
    const full = p.colors.length >= ANIMATION_CAPS.colors;
    return html`<div class="field">
      <div class="field-head">
        <span class="lbl" id="l-colors">${t('Colours')}</span>
        ${p.colors.length ? html`<span class="val">${t('{count} of {colours}', { count: p.colors.length, colours: ANIMATION_CAPS.colors })}</span>` : nothing}
      </div>
      <div class="chips" role="group" aria-labelledby="l-colors">
        ${p.colors.map((c, i) => {
          const entity = isEntityDocColor(c);
          return html`<button
            type="button"
            class="cchip"
            data-i=${i}
            aria-pressed=${i === sel ? 'true' : 'false'}
            aria-label=${entity ? t('Colour {n}: entity colour', { n: i + 1 }) : t('Colour {n}: {colour}', { n: i + 1, colour: c })}
            title=${entity ? t('Entity colour') : c}
            @click=${() => (this._color = i === sel ? -1 : i)}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                this._removeColor(i);
              }
            }}
          >
            <span style=${`background: ${entity ? 'var(--mc-text-2)' : c}`}></span>
            ${entity ? html`<ha-icon class="ent" icon="mdi:palette-swatch-variant"></ha-icon>` : nothing}
          </button>`;
        })}
        <button type="button" class="cchip add" aria-label=${t('Add colour')} title=${full ? t('At most {colours} colours', { colours: ANIMATION_CAPS.colors }) : t('Add colour')} ?disabled=${full} @click=${() => this._addColor()}>
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
      </div>
      ${sel >= 0
        ? html`<div class="color-edit">
            <div class="color-edit-head">
              <span>${t('Colour {n}', { n: sel + 1 })}</span>
              <button
                type="button"
                class="icon-btn sm danger remove-color"
                aria-label=${t('Remove colour {n}', { n: sel + 1 })}
                title=${t('Remove colour')}
                @click=${() => this._removeColor(sel)}
              >
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
            <mc-color-picker
              allowEntity
              .label=${t('Colour {n}', { n: sel + 1 })}
              .value=${fromDocColor(p.colors[sel])}
              @value-changed=${(e: CustomEvent) => {
                e.stopPropagation();
                const v = toDocColor(String(e.detail.value ?? ''));
                if (!v || v === p.colors[sel]) return;
                const colors = [...p.colors];
                colors[sel] = v;
                this._patch({ colors }, 'Change colour');
              }}
            ></mc-color-picker>
          </div>`
        : html`<p class="help">${p.colors.length ? t('Particles take the colours in turn. Pick one to change it.') : t('No colours: particles use the animation colour.')}</p>`}
    </div>`;
  }

  // ── closed sections ──

  private _sector(id: SectorId, icon: string, name: string, summary: string, body: () => TemplateResult): TemplateResult {
    const open = !!this._open[id];
    return html`<div class="sector" data-sector=${id}>
      <button
        type="button"
        class="sector-btn"
        aria-expanded=${open ? 'true' : 'false'}
        aria-controls=${open ? `sb-${id}` : nothing}
        @click=${() => (this._open = { ...this._open, [id]: !open })}
      >
        <ha-icon icon=${icon}></ha-icon>
        <span class="nm">${name}<span class="sr-only">, </span><span class="ssum">${summary}</span></span>
        <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${open ? html`<div class="sector-body" id=${`sb-${id}`}>${body()}</div>` : nothing}
    </div>`;
  }

  private _renderVariation(sim: ParticlesSim): TemplateResult {
    const doc = this._vdoc;
    return html`<div class="field">
        <div class="field-head"><label for="f-seed">${t('Seed')}</label></div>
        <div class="seed-row">
          <input
            id="f-seed"
            class="input"
            type="number"
            inputmode="numeric"
            min="0"
            max=${V2_LIMITS.seed.max}
            step="1"
            .value=${live(String(sim.seed))}
            aria-describedby="h-seed"
            @change=${(e: Event) => {
              const input = e.target as HTMLInputElement;
              const n = limitV2('seed', input.value);
              if (n === undefined || (n === sim.seed && !!this._p?.sim)) {
                input.value = String(sim.seed);
                return;
              }
              this._editSim((s) => ({ ...s, seed: n }), 'Change seed');
            }}
          />
          <button type="button" class="btn btn-secondary btn-sm shuffle-seed" @click=${this._shuffle}><ha-icon icon="mdi:dice-5-outline"></ha-icon>${t('Shuffle')}</button>
        </div>
        <p class="help" id="h-seed">${t('The same seed gives the same loop every time.')}</p>
      </div>
      ${this._range('spin', t('Spin per loop (deg)'), t('spin'), spinPerLoop(doc, sim), 'spin', (r) => this._emit(this._on((d) => setSpin(d, this._seed, r)), 'Change spin'), {
        help: t('Each particle turns the way it picks, left or right.'),
      })}
      ${this._range('delay', t('Start delay (s)'), t('start delay'), sim.ranges.delay, 'delay', (r) => this._editSim((s) => ({ ...s, ranges: { ...s.ranges, delay: r } }), 'Change start delay'))}
      ${this._range('life', t('Lifetime (s)'), t('lifetime'), sim.ranges.lifetime, 'lifetime', (r) => this._editSim((s) => ({ ...s, ranges: { ...s.ranges, lifetime: r } }), 'Change lifetime'), {
        help: t('A baked loop keeps lifetimes inside one loop.'),
      })}`;
  }

  private _pickGravityAngle(angle: number, focus = false): void {
    const sim = this._sim;
    const unit = sim.physics.gravity.strength / PHYSICS_SCALE.gravity;
    if (this.doc && angle !== sim.physics.gravity.angle) this._emit(this._on((d) => setGravity(d, this._seed, angle, unit)), 'Change gravity direction');
    if (focus) this._focus(`.compass [data-angle="${angle}"]`);
  }

  private _renderPhysics(sim: ParticlesSim): TemplateResult {
    const g = sim.physics.gravity;
    const gUnit = +(g.strength / PHYSICS_SCALE.gravity).toFixed(2);
    const dragUnit = +(sim.physics.drag / PHYSICS_SCALE.drag).toFixed(2);
    const turbUnit = +(sim.physics.turbulence.strength / PHYSICS_SCALE.turbulence).toFixed(2);
    const angles = COMPASS.map((c) => String(c.angle));
    const onCompass = COMPASS.some((c) => c.angle === g.angle);
    return html`${this._slider('f-grav', t('Gravity'), gUnit, gUnit ? gUnit.toFixed(2) : t('None'), (n, tr) => this._emit(this._on((d) => setGravity(d, this._seed, g.angle, n)), 'Change gravity', tr))}
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-gdir">${t('Gravity direction')}</span></div>
        <div
          class="seg full compass"
          role="radiogroup"
          aria-labelledby="l-gdir"
          @keydown=${(e: KeyboardEvent) => this._radioKeys(e, angles, String(g.angle), (id) => this._pickGravityAngle(+id, true))}
        >
          ${COMPASS.map(
            (c, i) => html`<button
              type="button"
              role="radio"
              data-angle=${c.angle}
              aria-checked=${c.angle === g.angle ? 'true' : 'false'}
              aria-label=${t(c.name)}
              title=${t(c.name)}
              tabindex=${c.angle === g.angle || (!onCompass && i === 0) ? 0 : -1}
              @click=${() => this._pickGravityAngle(c.angle)}
            >
              <ha-icon icon=${c.icon}></ha-icon>
            </button>`,
          )}
        </div>
      </div>
      <div class="field">
        <div class="field-head"><label for="f-gangle">${t('Angle (deg)')}</label></div>
        <input
          id="f-gangle"
          class="input"
          type="number"
          inputmode="numeric"
          min="0"
          max="359"
          step="1"
          .value=${live(String(g.angle))}
          aria-describedby="h-gangle"
          @change=${(e: Event) => {
            const input = e.target as HTMLInputElement;
            const n = limitV2('angle', input.value);
            if (n === undefined || n === g.angle) {
              input.value = String(g.angle);
              return;
            }
            this._emit(this._on((d) => setGravity(d, this._seed, n, gUnit)), 'Change gravity direction');
          }}
        />
        <p class="help" id="h-gangle">${t('0 pulls down, 90 left, 180 up, 270 right.')}</p>
      </div>
      ${this._slider(
        'f-drag',
        t('Drag'),
        dragUnit,
        dragUnit.toFixed(2),
        (n, tr) => this._editSim((s) => ({ ...s, physics: { ...s.physics, drag: +(n * PHYSICS_SCALE.drag).toFixed(2) } }), 'Change drag', tr),
        { help: t('Slows particles down over time.') },
      )}
      ${this._slider(
        'f-turb',
        t('Turbulence'),
        turbUnit,
        turbUnit.toFixed(2),
        (n, tr) => this._editSim((s) => ({ ...s, physics: { ...s.physics, turbulence: { ...s.physics.turbulence, strength: +(n * PHYSICS_SCALE.turbulence).toFixed(2) } } }), 'Change turbulence', tr),
        { help: t('Adds random swirls to the motion.') },
      )}`;
  }

  private _setCollider(id: ColliderId, on: boolean): void {
    this._editSim((s) => ({ ...s, colliders: { ...s.colliders, ...(id === 'content' ? { content: on ? 'icon' : 'none' } : { [id]: on }) } }), on ? t('Turn collider on') : t('Turn collider off'));
  }

  private _renderCollisions(sim: ParticlesSim): TemplateResult {
    const c = sim.colliders;
    const any = anyCollider(c);
    return html`<div class="checks" role="group" aria-label=${t('Collide with')}>
        ${COLLIDERS.map(
          (k) => html`<label class="check">
            <input type="checkbox" data-collider=${k.id} .checked=${colliderOn(c, k.id)} @change=${(e: Event) => this._setCollider(k.id, (e.target as HTMLInputElement).checked)} />
            ${t(k.label)}
          </label>`,
        )}
      </div>
      ${c.content !== 'none'
        ? html`<div class="field">
            <div class="field-head"><span class="lbl">${t('Content box')}</span></div>
            <div
              class="seg full content-seg"
              role="radiogroup"
              aria-label=${t('Content box')}
              @keydown=${(e: KeyboardEvent) =>
                this._radioKeys(e, ['icon', 'text'], c.content, (id) => {
                  if (id !== c.content) this._editSim((s) => ({ ...s, colliders: { ...s.colliders, content: id as 'icon' | 'text' } }), 'Change content box');
                  this._focus(`.content-seg [data-content="${id}"]`);
                })}
            >
              ${(['icon', 'text'] as const).map(
                (k) => html`<button
                  type="button"
                  role="radio"
                  data-content=${k}
                  aria-checked=${c.content === k ? 'true' : 'false'}
                  tabindex=${c.content === k ? 0 : -1}
                  @click=${() => c.content !== k && this._editSim((s) => ({ ...s, colliders: { ...s.colliders, content: k } }), 'Change content box')}
                >
                  ${k === 'icon' ? t('Icon') : t('Text')}
                </button>`,
              )}
            </div>
            <p class="help">${t("The box of the card's icon or of its text.")}</p>
          </div>`
        : nothing}
      ${this._slider(
        'f-bounce',
        t('Bounce'),
        sim.physics.bounce,
        sim.physics.bounce.toFixed(2),
        (n, tr) => this._editAll((s) => ({ ...s, physics: { ...s.physics, bounce: n } }), 'Change bounce', tr),
        { help: t('0 stops on impact, 1 bounces back at full speed.'), disabled: !any },
      )}`;
  }

  private _child(patch: Partial<SubEmitter>, label: string): void {
    this._editSim((s) => (s.children ? { ...s, children: { ...s.children, ...patch } } : s), label);
  }

  private _renderChildren(sim: ParticlesSim): TemplateResult {
    const ch = sim.children;
    const any = anyCollider(sim.colliders);
    const sw = html`<div class="switch-row">
      <span class="txt" id="l-children">${t('Spawn child particles')}<p class="help">${t('Children burst out from the point where they spawn.')}</p></span>
      <button
        type="button"
        class="switch children"
        role="switch"
        aria-labelledby="l-children"
        aria-checked=${ch ? 'true' : 'false'}
        @click=${() => {
          if (ch) {
            this._editSim((s) => {
              const { children: _c, ...rest } = s;
              void _c;
              return rest;
            }, 'Turn child particles off');
          } else this._editSim((s) => ({ ...s, children: defaultChildren(s) }), 'Turn child particles on');
        }}
      ></button>
    </div>`;
    if (!ch) return sw;
    const triggers: Array<[SubEmitter['trigger'], string]> = [
      ['collision', t('On collision')],
      ['death', t('At end of life')],
    ];
    const pickTrigger = (trg: SubEmitter['trigger'], focus = false) => {
      if (trg === 'collision' && !any) return;
      if (trg !== ch.trigger) this._child({ trigger: trg, at: undefined }, 'Change child trigger');
      if (focus) this._focus(`.trigger-seg [data-trigger="${trg}"]`);
    };
    const kind = shapeKind(ch.shapes[0]?.shape ?? { builtin: 'circle' });
    const parentColours = !ch.colors.length;
    return html`${sw}
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-trigger">${t('Spawn')}</span></div>
        <div
          class="seg full trigger-seg"
          role="radiogroup"
          aria-labelledby="l-trigger"
          @keydown=${(e: KeyboardEvent) => this._radioKeys(e, any ? ['collision', 'death'] : ['death'], ch.trigger, (id) => pickTrigger(id as SubEmitter['trigger'], true))}
        >
          ${triggers.map(
            ([id, label]) => html`<button
              type="button"
              role="radio"
              data-trigger=${id}
              aria-checked=${ch.trigger === id ? 'true' : 'false'}
              tabindex=${ch.trigger === id || (ch.trigger === 'time' && id === 'death') ? 0 : -1}
              ?disabled=${id === 'collision' && !any}
              @click=${() => pickTrigger(id)}
            >
              ${label}
            </button>`,
          )}
        </div>
        ${!any ? html`<p class="help">${t('Turn on a collider first.')}</p>` : nothing}
        ${ch.trigger === 'time' ? html`<p class="help">${t('Spawns {seconds} s after birth (set in YAML).', { seconds: ch.at ?? 0 })}</p>` : nothing}
      </div>
      <div class="field">
        <div class="field-head"><label for="f-ccount">${t('Count per spawn')}</label></div>
        <input
          id="f-ccount"
          class="input"
          type="number"
          inputmode="numeric"
          min="1"
          max=${V2_LIMITS.childCount.max}
          step="1"
          .value=${live(String(ch.count))}
          @change=${(e: Event) => {
            const input = e.target as HTMLInputElement;
            const n = limitV2('childCount', input.value);
            if (n === undefined || n === ch.count) {
              input.value = String(ch.count);
              return;
            }
            input.value = String(n);
            this._child({ count: n }, 'Change child count');
          }}
        />
      </div>
      <div class="field">
        <div class="field-head"><span class="lbl">${t('Child shape')}</span></div>
        ${this._shapeGrid(kind, 'child', t('Child shape'), (k, focus) => {
          if (k !== kind) {
            const own = this._sim.shapes.find((w) => shapeKind(w.shape) === k)?.shape;
            this._child({ shapes: [{ shape: own ?? this._shapeFor(k), weight: 1 }] }, 'Change child shape');
          }
          if (focus) this._focus(`.shapes.child [data-kind="${k}"]`);
        })}
      </div>
      ${this._range('csize', t('Size (px)'), t('child size'), ch.size, 'childSize', (r) => this._child({ size: r }, 'Change child size'))}
      ${this._range('cspeed', t('Speed (% of short side/s)'), t('child speed'), ch.ranges.speed, 'pspeed', (r) => this._child({ ranges: { ...ch.ranges, speed: r } }, 'Change child speed'))}
      <div class="field">
        <div class="field-head"><label for="f-clife">${t('Lifetime (s)')}</label></div>
        <input
          id="f-clife"
          class="input"
          type="number"
          inputmode="decimal"
          min=${V2_LIMITS.childLife.min}
          max=${V2_LIMITS.childLife.max}
          step="0.1"
          .value=${live(String(ch.ranges.lifetime[1]))}
          @change=${(e: Event) => {
            const input = e.target as HTMLInputElement;
            const n = limitV2('childLife', input.value);
            if (n === undefined || (n === ch.ranges.lifetime[0] && n === ch.ranges.lifetime[1])) {
              input.value = String(ch.ranges.lifetime[1]);
              return;
            }
            this._child({ ranges: { ...ch.ranges, lifetime: [n, n] } }, 'Change child lifetime');
          }}
        />
      </div>
      <div class="switch-row">
        <span class="txt" id="l-ccolors">${t("Use the parent's colours")}</span>
        <button
          type="button"
          class="switch child-colors"
          role="switch"
          aria-labelledby="l-ccolors"
          aria-checked=${parentColours ? 'true' : 'false'}
          @click=${() => this._child({ colors: parentColours ? [this._p?.colors[0] ?? '#ffffff'] : [] }, parentColours ? t('Own child colour') : t("Use the parent's colours"))}
        ></button>
      </div>
      ${parentColours
        ? nothing
        : html`<mc-color-picker
            allowEntity
            label=${t('Child colour')}
            .value=${fromDocColor(ch.colors[0])}
            @value-changed=${(e: CustomEvent) => {
              e.stopPropagation();
              const v = toDocColor(String(e.detail.value ?? ''));
              if (v && v !== ch.colors[0]) this._child({ colors: [v] }, 'Change child colour');
            }}
          ></mc-color-picker>`}`;
  }

  private _renderSectors(sim: ParticlesSim, only?: 'emitter' | 'all'): TemplateResult {
    return html`<div class="sectors">
      ${only === 'all' ? nothing : this._sector('variation', 'mdi:dice-multiple-outline', t('Variation'), variationSummary(this._vdoc, sim), () => this._renderVariation(sim))}
      ${only === 'all' ? nothing : this._sector('physics', 'mdi:weight', t('Physics'), physicsSummary(sim), () => this._renderPhysics(sim))}
      ${only === 'emitter' ? nothing : this._sector('collisions', 'mdi:arrow-collapse-down', t('Collisions'), collisionsSummary(sim), () => this._renderCollisions(sim))}
      ${only === 'all' ? nothing : this._sector('children', 'mdi:creation-outline', t('Child particles'), childrenSummary(sim), () => html`<div class="sector-body-lk" ?inert=${this._locks.kids.length > 0}>${this._renderChildren(sim)}</div>`)}
    </div>`;
  }

  // ── preset-based ──

  private _renderPreset(p: ParticlesSpec): TemplateResult {
    const preset = basePreset(this.doc!);
    const value = preset ? presetIntensity(this.doc!, preset) : undefined;
    return html`<section class="group preset-card" aria-labelledby="h-preset">
      <div class="preset-name">
        <span class="tile" aria-hidden="true"><ha-icon icon="mdi:shimmer"></ha-icon></span>
        <span class="txt">
          <strong id="h-preset">${preset ? tl(preset.name) : p.preset}</strong>
          <span class="kind">${preset ? t('Based on a built-in {kind}', { kind: presetKind(preset).toLowerCase() }) : t('Unknown preset')}</span>
        </span>
      </div>
      ${preset
        ? html`<div class="field">
            <div class="field-head"><label for="f-intensity">${intensityLabel(preset, t)}</label></div>
            <input
              id="f-intensity"
              class="input"
              type="number"
              inputmode="decimal"
              min=${preset.intensity.min}
              max=${preset.intensity.max}
              step=${preset.intensity.step ?? 1}
              placeholder=${String(preset.defaults.intensity)}
              .value=${p.intensity === undefined ? '' : String(value)}
              @change=${(e: Event) => {
                const raw = (e.target as HTMLInputElement).value;
                const next = withPresetIntensity(this.doc!, preset, raw === '' ? undefined : Number(raw));
                if (next.particles!.intensity !== p.intensity) this._emit(next, 'Change intensity');
                else (e.target as HTMLInputElement).value = p.intensity === undefined ? '' : String(p.intensity);
              }}
            />
            <p class="help">${t('Between {min} and {max}; empty uses {intensity}. Timing and colour come from the animation settings.', { min: preset.intensity.min, max: preset.intensity.max, intensity: preset.defaults.intensity })}</p>
          </div>`
        : html`<p class="help error">${t('This preset is not available in this version of Magic Card.')}</p>`}
      <button type="button" class="btn btn-secondary btn-sm convert" @click=${this._convert}>
        <ha-icon icon="mdi:creation-outline"></ha-icon>${t('Convert to custom particles')}
      </button>
      <p class="help">
        ${t('Swaps the preset for your own particles: shape, movement, size and colours become editable.')}
        ${preset && preset.particles === 'count' && !preset.ring && !preset.seasonal ? t('The look changes a little.') : t("They replace the preset's look.")}
      </p>
    </section>`;
  }

  private _convert = (): void => {
    if (!this.doc) return;
    this._emit(convertPresetParticles(this.doc), 'Convert to custom particles');
    this._focus('.mode-seg [aria-checked="true"]');
  };

  /** The locked rows among the emitters being edited (one, or all in "All particles"): `own` locks the fields, `kids` only the child particles. */
  private get _locks(): { own: string[]; kids: string[] } {
    const doc = this.doc;
    const v = this.layerView;
    if (!doc || !v?.locked.length) return { own: [], kids: [] };
    const ids = doc.particles?.sim ? emitterIds(doc) : ['main'];
    const on = this.all && ids.length > 1 ? ids : [ids[Math.min(this._em, ids.length - 1)] ?? 'main'];
    return {
      own: on.filter((id) => isLocked(doc, v, `emitter:${id}`)).map((id) => `emitter:${id}`),
      kids: on.filter((id) => isLocked(doc, v, `children:${id}`)).map((id) => `children:${id}`),
    };
  }

  // ── render ──

  protected render(): TemplateResult {
    const p = this._p;
    if (!this.doc || !p) {
      return html`<div class="empty"><ha-icon icon="mdi:shimmer"></ha-icon><p>${t('Open a particles animation to design its particles.')}</p></div>`;
    }
    const sim = p.preset ? undefined : this._sim;
    return html`<style data-pv></style>
      <style data-live></style>
      <div class="wrap">
        ${this._renderPreview()}
        <div class="form" ?inert=${this.disabled} @focusout=${this._onFocusOut}>
          ${this._locks.own.length ? lockBanner(this.doc, this.layerView!, this._locks.own) : nothing}
          ${!sim ? html`<div class="lk" ?inert=${this._locks.own.length > 0}>${this._renderPreset(p)}</div>` : this._renderForm(p, sim)}
        </div>
      </div>`;
  }

  // ── emitters ──

  private _renderForm(p: ParticlesSpec, sim: ParticlesSim): TemplateResult {
    const multi = this._multi;
    const all = multi && this.all;
    return html`${this._renderBar()}
      <div class="lk" ?inert=${this._locks.own.length > 0}>
      ${all
        ? html`<p class="help all-note">${t('These apply to every emitter. Placement is set per emitter.')}</p>
            ${this._renderMode(sim)}${this._renderTiming(p)}${this._renderSectors(sim, 'all')}`
        : html`${multi ? this._renderEmitterHead() : nothing}${this._renderPlacement()}
            ${multi ? nothing : this._renderMode(sim)}${this._renderShape()}${this._renderMovement(p, sim, !multi)}${this._renderLook(p, sim)}${this._renderSectors(sim, multi ? 'emitter' : undefined)}`}
      </div>`;
  }

  /** The emitter switcher (2+ emitters) and Add emitter. */
  private _renderBar(): TemplateResult {
    const doc = this.doc!;
    const n = emitterCount(doc);
    const can = canAddEmitter(doc);
    const cur = this.all ? 'all' : String(this._em);
    const ids = ['all', ...Array.from({ length: n }, (_, i) => String(i))];
    const pick = (id: string) => {
      if (id === 'all') this._select(this._em, true);
      else this._select(+id);
      this._focus(`.em-tabs [data-val="${id}"]`);
    };
    return html`<div class="em-bar">
      ${n > 1
        ? html`<div class="em-tabs">${seg({ role: 'tablist', label: t('Emitters'), value: cur, items: ids.map((id) => ({ value: id, label: id === 'all' ? t('All particles') : this._name(+id) })), onChange: pick })}</div>`
        : nothing}
      <button type="button" class="btn btn-secondary btn-sm em-add" ?disabled=${!can || this.disabled} aria-describedby=${can ? nothing : 'h-em-cap'} @click=${this._addEmitter}>
        <ha-icon icon="mdi:plus"></ha-icon>${t('Add emitter')}
      </button>
      ${can ? nothing : html`<p class="help em-cap" id="h-em-cap">${n >= PARTICLES_V2_CAPS.emitters ? t('At most {emitters} emitters.', { emitters: PARTICLES_V2_CAPS.emitters }) : t('No free particles left. Lower a count to add an emitter.')}</p>`}
    </div>`;
  }

  private _renderEmitterHead(): TemplateResult {
    const i = this._em;
    const sim = this.doc!.particles!.sim!;
    const own = (i === 0 ? sim.name : sim.emitters?.[i - 1]?.name) ?? '';
    return html`<div class="em-head">
      <div class="field em-name-field">
        <div class="field-head"><label for="f-em-name">${t('Emitter name')}</label></div>
        <input
          id="f-em-name"
          class="input em-name"
          type="text"
          maxlength=${EMITTER_NAME_MAX}
          placeholder=${emitterLabel(this.doc!, this._seed, i)}
          .value=${live(own)}
          @change=${(e: Event) => {
            const input = e.target as HTMLInputElement;
            const next = renameEmitter(this.doc!, this._seed, i, input.value);
            input.value = (i === 0 ? next.particles!.sim!.name : next.particles!.sim!.emitters?.[i - 1]?.name) ?? '';
            this._emit(next, 'Rename emitter');
          }}
        />
      </div>
      <button type="button" class="icon-btn sm em-dup" aria-label=${t('Duplicate emitter')} title=${t('Duplicate emitter')} ?disabled=${!canAddEmitter(this.doc!) || this.disabled} @click=${this._dupEmitter}>
        <ha-icon icon="mdi:content-copy"></ha-icon>
      </button>
      <button type="button" class="icon-btn sm danger em-remove" aria-label=${t('Remove emitter')} title=${t('Remove emitter')} ?disabled=${this.disabled} @click=${this._removeEmitter}>
        <ha-icon icon="mdi:delete-outline"></ha-icon>
      </button>
    </div>`;
  }

  private _addEmitter = (): void => {
    if (!this.doc) return;
    const next = addEmitter(this.doc, this._seed);
    if (next === this.doc) return;
    this._emit(next, 'Add emitter');
    this._select(emitterCount(next) - 1);
    this._focus('.em-tabs [aria-selected="true"]');
  };

  private _dupEmitter = (): void => {
    if (!this.doc) return;
    const next = duplicateEmitter(this.doc, this._seed, this._em);
    if (next === this.doc) return;
    this._emit(next, 'Duplicate emitter');
    this._select(this._em + 1);
    this._focus('.em-tabs [aria-selected="true"]');
  };

  private _removeEmitter = (): void => {
    if (!this.doc) return;
    const i = this._em;
    const next = removeEmitter(this.doc, this._seed, i);
    if (next === this.doc) return;
    this._emit(next, 'Remove emitter');
    this._select(Math.max(0, i - 1));
    this._focus('.em-tabs [aria-selected="true"]');
  };

  /** Leaving a text field or slider without a change event (Escape, a re-render) still closes its edit. */
  private _onFocusOut = (e: FocusEvent): void => {
    const t = e.target as HTMLElement;
    if (this._pending && ['f-svg', 'f-emoji', 'f-grav', 'f-drag', 'f-turb', 'f-bounce'].includes(t.id)) this._settle();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-particles-editor': AnimParticlesEditor;
  }
}
