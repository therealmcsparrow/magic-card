import type { StageHide, StageParticles } from '../contracts/studio-layers';
import { PARENTS_PREFIX, resolveHidden } from './layer-view';

/*
 * The stage-only hide rules (contract studio-layers.ts section 3a). Every drawn row that is hidden or
 * soloed away gets one `opacity:0!important` rule. An important declaration beats CSS animations, Web
 * Animations (the clip crossfade), bindings' inline styles and live particle frames, so one mechanism
 * covers finite iterations, reduced motion, another clip playing and the crossfade, and the preview
 * document is not rewritten (no card re-render, no restart). The sheets go into the preview card only.
 *
 * Selectors used (a studio-facing surface of the runtime; tests/stage-hide.test.ts guards them):
 * data-p / data-g / data-s (rig.ts markup), data-mc-part (module templates), .mc-module-wrapper and
 * data-mc-gen-bg (targets.ts), .mc-anim-fx[data-fx] > i in slot order (card-decorations.ts).
 */

const HIDE = '{opacity:0!important}';
/** A CSS attribute-selector string. */
const q = (s: string): string => `"${s.replace(/[\\"]/g, '\\$&').replace(/\n/g, '\\a ')}"`;

/** The wrapper's own part, not the part of a module nested in it (the way targets.ts scopes them). */
const ownPart = (part: string): string =>
  `.mc-module-wrapper[data-mc-run] [data-mc-part=${q(part)}]:not(.mc-module-wrapper[data-mc-run] .mc-module-wrapper [data-mc-part])`;

/** The slot rules of the emitters hidden in `hidden` (ranges are 1-based, inclusive; see CompiledEmitterSlots). */
function emitterRules(hidden: Set<string>, p: StageParticles): string[] {
  const out: string[] = [];
  p.ids.forEach((id, i) => {
    const s = p.emitterSlots.find((x) => x.index === i);
    if (!s) return;
    const fx = `.mc-anim-fx[data-fx^=${q(`${p.base}${s.part ? 'o' : ''}-g`)}]>i`;
    const range = (a: number, b: number): void => void (b >= a && out.push(`${fx}:nth-child(n+${a}):nth-child(-n+${b})${HIDE}`));
    if (hidden.has(`emitter:${id}`)) range(s.first + 1, s.first + s.parents + s.children);
    else {
      if (hidden.has(`${PARENTS_PREFIX}${id}`)) range(s.first + 1, s.first + s.parents);
      if (hidden.has(`children:${id}`)) range(s.first + s.parents + 1, s.first + s.parents + s.children);
    }
  });
  return out;
}

export const stageHide: StageHide = (doc, view, particles) => {
  const icon: string[] = [];
  const card: string[] = [];
  const hidden = resolveHidden(doc, view);
  for (const key of hidden) {
    const at = key.indexOf(':');
    const kind = key.slice(0, at);
    const id = key.slice(at + 1);
    if (kind === 'part') icon.push(`[data-p=${q(id)}]${HIDE}`);
    else if (kind === 'group') icon.push(`[data-g=${q(id)}]${HIDE}`);
    // data-s is the rig's shape marker; particle slots use data-s too, so it never goes in the card sheet
    else if (kind === 'shape') icon.push(`[data-s=${q(id)}]${HIDE}`);
    // version 1 particles / presets: the whole fx layer (the document has no emitter slots)
    else if (kind === 'emitter' && !particles && !doc.particles?.sim) card.push(`.mc-anim-fx${HIDE}`);
    else if (kind === 'target') {
      if (id === 'background') card.push('.mc-module-wrapper{background:none!important}', `[data-mc-gen-bg]${HIDE}`);
      else if (id !== 'element') card.push(`${ownPart(id)}${HIDE}`);
    }
  }
  if (particles) card.push(...emitterRules(hidden, particles));
  return { icon: icon.join('\n'), card: card.join('\n') };
};

// ── adopting the sheets ──

const STYLE_ATTR = 'data-mc-stage-hide';
const canAdopt = (): boolean =>
  typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype && typeof ShadowRoot !== 'undefined' && 'adoptedStyleSheets' in ShadowRoot.prototype;

/**
 * Keeps the stage sheets in the preview card's shadow root (card rules) and in the shadow root of
 * every icon of the card (rig rules). The rig swaps only its own sheet, so an icon re-render keeps
 * these; an icon element the card replaces gets them back on the next `attach`.
 */
export class StageSheets {
  private _css = { icon: '', card: '' };
  private _sheets: { icon?: CSSStyleSheet; card?: CSSStyleSheet } = {};

  /** Set the rules and put them where they belong (call again after the card re-rendered). */
  set(card: ShadowRoot | null | undefined, css: { icon: string; card: string }): void {
    this._css = css;
    this.attach(card);
  }

  /** (Re-)adopt into the card root and its icons' roots; rule text is written only when it changed. */
  attach(card: ShadowRoot | null | undefined): void {
    if (!card) return;
    this._into(card, 'card');
    for (const el of card.querySelectorAll('.mc-anim-icon')) if (el.shadowRoot) this._into(el.shadowRoot, 'icon');
  }

  private _into(root: ShadowRoot, which: 'icon' | 'card'): void {
    const css = this._css[which];
    if (canAdopt()) {
      let sheet = this._sheets[which];
      if (!sheet) {
        sheet = new CSSStyleSheet();
        this._sheets[which] = sheet;
        sheet.replaceSync(css);
      }
      if (this._text.get(sheet) !== css) {
        sheet.replaceSync(css);
        this._text.set(sheet, css);
      }
      if (!root.adoptedStyleSheets.includes(sheet)) root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
      return;
    }
    let el = [...root.children].find((c): c is HTMLStyleElement => c.tagName === 'STYLE' && c.hasAttribute(STYLE_ATTR));
    if (!el) {
      el = document.createElement('style');
      el.setAttribute(STYLE_ATTR, '');
      root.appendChild(el);
    }
    if (el.textContent !== css) el.textContent = css;
  }

  private _text = new WeakMap<CSSStyleSheet, string>();
}
