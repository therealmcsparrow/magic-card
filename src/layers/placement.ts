import { LAYER_ANCHORS, LAYER_BLENDS, LEADING_ANCHORS, BLUR_MAX, MAX_OVERLAY_RANK, SCRIM_HOLD, SCRIM_DEFAULT_STRENGTH } from '../contracts/layer-placement';
import type { Arranged, ArrangedChild, ArrangeOptions, ResolvedLayer, ScrimConfig } from '../contracts/layer-placement';
import { safeColor } from '../utils/animation';
import { isLayered, placementOf } from './layer-slot';
import type { CardModule } from '../types';

/*
 * Layer placement (contract layer-placement 1.0.0): which children of a container are in flow,
 * behind the others or on top, and what each wrapper gets. Pure: no lit, no DOM. Every value that
 * reaches an attribute or a style is clamped, matched against an allow-list or parsed from a strict
 * grammar here; nothing is copied from the config as text. Lives in the 'layers' chunk
 * (src/layers/stack/chunk.ts hands it to the slot); only that entry imports this file.
 */

const CARD_COLOR = 'var(--ha-card-background, var(--card-background-color, #fff))';
const OFFSET = /^\s*(-?\d{1,6}(?:\.\d{1,3})?)(px|%)\s*$/;

type Rec = Record<string, unknown>;
const obj = (v: unknown): Rec => (v && typeof v === 'object' ? (v as Rec) : {});
const clamp = (v: unknown, min: number, max: number, fallback: number): number => {
  const n = typeof v === 'string' && v.trim() ? +v : v;
  return typeof n === 'number' && isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};
const pick = <T extends string>(list: readonly T[], v: unknown, fallback: T): T => (list.includes(v as T) ? (v as T) : fallback);

/** An offset: a number (px) or "<n>px" / "<n>%", bounded; anything else is 0px. A centred axis may be negative. */
function offset(v: unknown, signed: boolean): string {
  const m = typeof v === 'string' ? OFFSET.exec(v) : null;
  return `${+clamp(m ? m[1] : v, signed ? -10000 : 0, 10000, 0).toFixed(3)}${m ? m[2] : 'px'}`;
}

/** The scrim colour: `card`, a safe CSS colour, else black. */
const scrimColor = (s: Rec): string => (s.color === 'card' ? CARD_COLOR : safeColor(s.color) ?? '#000');

/** Strength 0-90 %, as the scrim element's opacity (no color-mix on the Chromium 85 floor; it multiplies the colour's own alpha). */
export const scrimOpacity = (scrim: ScrimConfig): number => +(clamp(obj(scrim).strength, 0, 90, SCRIM_DEFAULT_STRENGTH) / 100).toFixed(2);

/** CSS background of .mc-layer-scrim: the flat colour, or a fade from an edge (full to 35 %, transparent at 100 %). */
export function scrimCss(scrim: ScrimConfig): string {
  const s = obj(scrim);
  const c = scrimColor(s);
  const dir = ['to top', 'to bottom', 'to right', 'to left'][['bottom', 'top', 'left', 'right'].indexOf(s.style as string)];
  return dir ? `linear-gradient(${dir}, ${c} 0%, ${c} ${SCRIM_HOLD * 100}%, transparent 100%)` : c;
}

export function resolveLayer(
  mod: CardModule,
  opts: { canHoist: boolean; overlayRank: number; hasActions: boolean },
): ResolvedLayer | undefined {
  const placement = placementOf(mod);
  if (!placement) return undefined;
  const c = obj(mod.layer);
  const overlay = placement === 'overlay';
  const anchor = pick(LAYER_ANCHORS, overlay && c.anchor, 'top-left');
  const fill = !overlay && opts.canHoist && (c.fill === 'row' || c.fill === 'card') ? c.fill : 'container';
  const clickThrough = typeof c.click_through === 'boolean' ? c.click_through : !overlay || !opts.hasActions;
  const opacity = clamp(c.opacity, 0, 100, 100);
  const blur = clamp(c.blur, 0, BLUR_MAX, 0);
  const blend = pick(LAYER_BLENDS, c.blend, 'normal');
  const sc = c.scrim && typeof c.scrim === 'object' && !Array.isArray(c.scrim) ? (c.scrim as ScrimConfig) : undefined;
  const scrim = sc && scrimCss(sc);

  const attrs: Record<string, string> = { 'data-mc-placement': placement };
  const style: string[] = [];
  if (overlay) {
    attrs['data-mc-anchor'] = anchor;
    // an axis is centred (signed offset) when the anchor names no edge on it
    style.push(`--mc-layer-x:${offset(c.offset_x, !/left|right/.test(anchor))}`, `--mc-layer-y:${offset(c.offset_y, !/top|bottom/.test(anchor))}`);
  }
  if (clickThrough) attrs['data-mc-pass'] = '';
  if (blur > 0) {
    attrs['data-mc-blur'] = '';
    style.push(`--mc-layer-blur:${+blur.toFixed(2)}px`);
  }
  if (opacity < 100) style.push(`opacity:${+(opacity / 100).toFixed(2)}`);
  if (blend !== 'normal') style.push(`mix-blend-mode:${blend}`);
  if (overlay) style.push(`z-index:${2 + Math.trunc(clamp(opts.overlayRank, 0, MAX_OVERLAY_RANK, 0))}`);
  if (sc) style.push(`--mc-scrim:${scrim}`, `--mc-scrim-opacity:${scrimOpacity(sc)}`);

  return { placement, fill, anchor, clickThrough, attrs, style: style.join(';'), media: blur > 0 || !!sc, scrim };
}

/**
 * What a row's (or the card's) module lists hold, for the row / card fill: a visible module in flow,
 * and a background asking to fill the row or the card. Direct children only.
 */
export function scanFills(lists: ReadonlyArray<readonly CardModule[] | undefined>, hidden: (c: CardModule) => boolean): { flow: boolean; row: boolean; card: boolean } {
  const out = { flow: false, row: false, card: false };
  for (const list of lists) {
    for (const m of Array.isArray(list) ? list : []) {
      if (!m || hidden(m)) continue;
      const fill = placementOf(m) === 'background' ? obj(m.layer).fill : undefined;
      if (!placementOf(m)) out.flow = true;
      else if (fill === 'row' || fill === 'card') out[fill] = true;
    }
  }
  return out;
}

export function arrange(children: readonly CardModule[], opts: ArrangeOptions): Arranged {
  // nothing layered here: the children as they are, no condition is evaluated
  if (!children.some(isLayered)) return { front: children.map((child, index) => ({ child, index })), backgrounds: [], hoisted: [], layered: false };
  let rank = 0;
  const visible = (c: CardModule | undefined) => !!c && !opts.hidden(c);
  const entries = children.map((child, index): ArrangedChild => {
    const overlayRank = placementOf(child) === 'overlay' ? rank++ : 0;
    let layer = visible(child) ? resolveLayer(child, { canHoist: opts.canHoist, overlayRank, hasActions: opts.hasActions(child) }) : undefined;
    // row / card fill with nothing else in flow there: the module stays in its column
    if ((layer?.fill === 'row' && opts.rowHasFlow === false) || (layer?.fill === 'card' && opts.cardHasFlow === false)) layer = undefined;
    return { child, index, layer };
  });
  const hoisted = entries.filter((e) => e.layer && e.layer.fill !== 'container');
  const local = entries.filter((e) => e.layer && e.layer.fill === 'container');
  // a container whose visible children are all layered would collapse: they render in flow
  if (!entries.some((e) => !e.layer && visible(e.child))) for (const e of local) e.layer = undefined;
  const live = local.filter((e) => e.layer);
  const anchorOf = (e: ArrangedChild) => LAYER_ANCHORS.indexOf(e.layer!.anchor);
  const overlays = live.filter((e) => e.layer!.placement === 'overlay').sort((a, b) => anchorOf(a) - anchorOf(b));
  return {
    front: [
      ...overlays.filter((e) => LEADING_ANCHORS.includes(e.layer!.anchor)),
      ...entries.filter((e) => !e.layer),
      ...overlays.filter((e) => !LEADING_ANCHORS.includes(e.layer!.anchor)),
    ],
    backgrounds: live.filter((e) => e.layer!.placement === 'background'),
    hoisted,
    layered: live.length > 0,
  };
}
