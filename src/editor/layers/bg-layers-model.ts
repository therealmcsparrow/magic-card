import type { BackgroundLayerConfig, BgLayerType } from '../../contracts/bg-stack';
import { m } from '../i18n';
import { getStatus } from './bg-status';

// The light half of the Card backdrop model (layer-editor 1.0.0): what the editor chunk itself needs.
// The rest is in bg-layers-ops.ts.

export const LAYER_TYPES: ReadonlyArray<{ value: BgLayerType; label: ReturnType<typeof m>; icon: string }> = [
  { value: 'image', label: m('card-editor.bg-layers-model.image'), icon: 'mdi:image-outline' },
  { value: 'gradient', label: m('card-editor.bg-layers-model.gradient'), icon: 'mdi:gradient-vertical' },
  { value: 'pattern', label: m('card-editor.bg-layers-model.pattern'), icon: 'mdi:dots-grid' },
  { value: 'color', label: m('card-editor.bg-layers-model.colour'), icon: 'mdi:palette-outline' },
];

export function layerSummary(layer: BackgroundLayerConfig): { type: ReturnType<typeof m>; detail?: string } {
  const type = LAYER_TYPES.find((x) => x.value === layer.type)?.label ?? m('card-editor.bg-layers-model.image');
  let detail: string | undefined;
  if (layer.type === 'image') {
    detail = layer.entity || (layer.image ? layer.image.split('/').pop() : undefined) || undefined;
  } else if (layer.type === 'pattern') detail = layer.pattern;
  else if (layer.type === 'color') detail = layer.color;
  return detail ? { type, detail } : { type };
}

// ── rule view ──

/** "Change backgrounds in this rule": the normal layers, copied in. */
export function startRuleLayers(normal: readonly BackgroundLayerConfig[] | undefined): BackgroundLayerConfig[] {
  return normal ? (JSON.parse(JSON.stringify(normal)) as BackgroundLayerConfig[]) : [];
}

/** A card with a layer that fell back: the group header shows a warning mark. */
export function backdropHasProblem(layers: readonly BackgroundLayerConfig[] | undefined): boolean {
  return (layers ?? []).some((l, i) => {
    const s = getStatus(i);
    return !!s && !l.hidden && s.status === 'error' && s.reason !== 'stale';
  });
}
