import type { CardModule, MagicCardConfig } from '../../types';
import { moduleAt, selectionFromPathAttr, type ModuleSelection } from '../studio/selection';
import { m, t } from '../i18n';
import { layerSummary } from './bg-layers-model';
import { layersAtPoint, layersInRegion, type HitItem, type HitPlacement } from './layers-at';
import { moduleName, placementOf } from './placement-model';
import type { Box } from './checks';

// Everything at one point of the canvas, modules and card backdrop layers together, front first.

export interface HereEntry {
  /** data-mc-path, or `backdrop:<index>` (YAML index). */
  key: string;
  kind: 'module' | 'backdrop';
  name: string;
  /** "Behind others", "On top", "Card backdrop, layer 2". */
  detail: string;
  sel?: ModuleSelection;
  index?: number;
}

const PLACEMENT_WORDS = { flow: m('card-editor.layers-here.normal'), background: m('card-editor.layers-here.behind-others'), overlay: m('card-editor.layers-here.on-top') } as const;

/** The module wrappers of the live card with their boxes. Placement comes from the config, not the DOM. */
export function collectHitItems(root: ParentNode | null | undefined, config: MagicCardConfig): HitItem[] {
  if (!root) return [];
  const out: HitItem[] = [];
  let order = 0;
  for (const el of Array.from(root.querySelectorAll<HTMLElement>('[data-mc-path]'))) {
    const path = el.dataset.mcPath ?? '';
    const sel = selectionFromPathAttr(path);
    const mod = sel ? moduleAt(config, sel) : undefined;
    if (!mod) continue;
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) continue;
    out.push({ path, placement: hitPlacement(mod), order: order++, rect: { left: r.left, top: r.top, width: r.width, height: r.height } });
  }
  return out;
}

/** video-bg without a `placement` key sits behind its siblings on its own. */
function hitPlacement(mod: CardModule): HitPlacement {
  if (mod.type === 'video-bg' && mod.placement === undefined) return 'background';
  return placementOf(mod);
}

const inBox = (b: Box | undefined, x: number, y: number): boolean => !!b && x >= b.left && x < b.left + b.width && y >= b.top && y < b.top + b.height;

/** Layers at a point, or (a Box) under a region such as the selection. */
const touchesBox = (a: Box, b: Box): boolean => a.left < b.left + b.width && b.left < a.left + a.width && a.top < b.top + b.height && b.top < a.top + a.height;

export function layersHere(items: readonly HitItem[], config: MagicCardConfig, card: Box | undefined, at: { x: number; y: number } | Box): HereEntry[] {
  const out: HereEntry[] = [];
  const point = 'x' in at;
  const paths = point ? layersAtPoint(items, at.x, at.y) : layersInRegion(items, at);
  for (const path of paths) {
    const sel = selectionFromPathAttr(path);
    const mod = sel ? moduleAt(config, sel) : undefined;
    if (!sel || !mod) continue;
    out.push({ key: path, kind: 'module', name: moduleName(mod), detail: t(PLACEMENT_WORDS[hitPlacement(mod)]), sel });
  }
  const overCard = point ? inBox(card, at.x, at.y) : !!card && touchesBox(card, at);
  if (overCard) {
    (config.background_layers ?? []).slice(0, 4).forEach((layer, index) => {
      if (layer?.hidden === true) return;
      const s = layerSummary(layer);
      out.push({
        key: `backdrop:${index}`, kind: 'backdrop', index,
        name: s.detail ? `${t(s.type)}, ${s.detail}` : t(s.type),
        detail: t('card-editor.layers-here.card-backdrop-layer-n', { n: index + 1 }),
      });
    });
  }
  return out;
}
