import { BLUR_LIGHT_MAX } from '../../contracts/layer-placement';
import type { BackgroundLayerConfig } from '../../contracts/bg-stack';
import type { CardModule } from '../../types';
import { layerOf, placementOf } from './placement-model';

// Cost meter: "Cost on older tablets: light / medium / heavy", with the reasons.

export type CostLevel = 'light' | 'medium' | 'heavy';
export type CostReason = { code: 'blur'; px: number } | { code: 'blend' } | { code: 'panzoom' } | { code: 'camera' };

export interface CostInput {
  /** Layers in the stack (card backdrop) or layered modules in the container. */
  layers: number;
  blur: readonly number[];
  blends: readonly string[];
  /** Layers with pan and zoom. */
  panZoom: number;
  liveCamera: boolean;
}

export interface Cost {
  level: CostLevel;
  reasons: CostReason[];
}

export function costOf(i: CostInput): Cost {
  const reasons: CostReason[] = [];
  const maxBlur = Math.max(0, ...i.blur);
  const heavyBlur = maxBlur > BLUR_LIGHT_MAX;
  if (heavyBlur) reasons.push({ code: 'blur', px: maxBlur });
  let factors = 0;
  if (i.blends.some((b) => b && b !== 'normal')) {
    reasons.push({ code: 'blend' });
    factors++;
  }
  if (i.panZoom > 0) {
    reasons.push({ code: 'panzoom' });
    factors++;
  }
  if (i.liveCamera) {
    reasons.push({ code: 'camera' });
    factors++;
  }
  let level: CostLevel = 'light';
  if (heavyBlur || factors >= 2 || (i.layers >= 3 && factors >= 1)) level = 'heavy';
  else if (factors === 1) level = 'medium';
  return { level, reasons };
}

/** A layered module; `layers` = layered modules in its container (itself included). */
export function costFromModule(mod: CardModule, layers: number): Cost {
  const l = layerOf(mod);
  return costOf({
    layers,
    blur: [l.blur ?? 0],
    blends: l.blend ? [l.blend] : [],
    panZoom: 0,
    liveCamera: placementOf(mod) === 'background' && mod.type === 'camera',
  });
}

/** The card backdrop: visible layers only; Low-power mode drops blur, blend and pan / zoom, so the cost is light. */
export function costFromBackdrop(layers: readonly BackgroundLayerConfig[], lowPower = false): Cost {
  const shown = layers.filter((l) => l.hidden !== true);
  if (lowPower) return { level: 'light', reasons: [] };
  return costOf({
    layers: shown.length,
    blur: shown.map((l) => (l.type === 'image' ? l.blur ?? 0 : 0)),
    blends: shown.map((l) => l.blend ?? 'normal'),
    panZoom: shown.filter((l) => l.type === 'image' && !!l.pan_zoom).length,
    liveCamera: false,
  });
}
