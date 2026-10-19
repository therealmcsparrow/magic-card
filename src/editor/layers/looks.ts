import type { BackgroundLayerConfig } from '../../contracts/bg-stack';
import { MAX_BACKGROUND_LAYERS } from '../../contracts/bg-stack';
import type { LayerConfig, Placement } from '../../contracts/layer-placement';
import type { CardModule, HomeAssistant } from '../../types';
import { m } from '../i18n';

/*
 * Looks (designer 11 I): one-tap tiles that write plain YAML (placement + layer, or background_layers
 * entries). A look is never stored by name. Data plus CSS gradients for the thumbnails, no images.
 */

export interface ModuleLook {
  id: string;
  name: ReturnType<typeof m>;
  /** CSS background of the 40 px tile preview. */
  preview: string;
  placement: Exclude<Placement, 'flow'>;
  layer: LayerConfig;
}

export const MODULE_LOOKS: readonly ModuleLook[] = [
  {
    id: 'picture-behind-buttons', name: m('Picture behind buttons'), placement: 'background',
    layer: { scrim: { style: 'bottom', strength: 60 } },
    preview: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.6)), linear-gradient(135deg, #6fa8dc, #93c47d)',
  },
  {
    id: 'dimmed-backdrop', name: m('Dimmed backdrop'), placement: 'background',
    layer: { scrim: { style: 'dim', strength: 60 } },
    preview: 'linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,.6)), linear-gradient(135deg, #6fa8dc, #93c47d)',
  },
  {
    id: 'soft-glow', name: m('Soft glow'), placement: 'background',
    layer: { blend: 'screen', opacity: 60 },
    preview: 'radial-gradient(circle, rgba(255,255,255,.9), rgba(255,255,255,.1) 70%), #334',
  },
  {
    id: 'corner-badge', name: m('Corner badge'), placement: 'overlay',
    layer: { anchor: 'bottom-right', offset_x: '8px', offset_y: '8px' },
    preview: 'radial-gradient(circle at 78% 78%, #f9a825 0 18%, transparent 20%), #cfd8dc',
  },
  {
    id: 'top-banner', name: m('Top banner'), placement: 'overlay',
    layer: { anchor: 'top', offset_x: '0px', offset_y: '0px' },
    preview: 'linear-gradient(#f9a825 0 28%, transparent 30%), #cfd8dc',
  },
  {
    id: 'frosted', name: m('Frosted'), placement: 'background',
    layer: { blur: 8, scrim: { style: 'dim', strength: 45 } },
    preview: 'linear-gradient(rgba(255,255,255,.35), rgba(255,255,255,.35)), repeating-linear-gradient(45deg, #6fa8dc 0 6px, #93c47d 6px 12px)',
  },
];

/** The module with the look's keys. The layer is replaced wholesale; the module's own keys stay. */
export function applyModuleLook(mod: CardModule, look: ModuleLook): CardModule {
  return { ...mod, placement: look.placement, layer: JSON.parse(JSON.stringify(look.layer)) as LayerConfig };
}

// ── Card backdrop looks (T7) ──

export interface BackdropLook {
  id: string;
  name: ReturnType<typeof m>;
  preview: string;
  /** Layers the look adds (front first). */
  count: number;
  build(hass: HomeAssistant | undefined): BackgroundLayerConfig[];
}

/** First entity of a domain, so the look points at something the user has. */
function firstEntity(hass: HomeAssistant | undefined, domain: string, fallback: string): string {
  const id = Object.keys(hass?.states ?? {}).find((e) => e.startsWith(`${domain}.`));
  return id ?? fallback;
}

export const BACKDROP_LOOKS: readonly BackdropLook[] = [
  {
    id: 'photo-dark-bottom', name: m('Photo, dark at the bottom'), count: 2,
    preview: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.6)), linear-gradient(135deg, #6fa8dc, #93c47d)',
    build: () => [{ type: 'gradient', gradient: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.6))' }, { type: 'image', image: '' }],
  },
  {
    id: 'weather', name: m('Weather backdrop'), count: 1,
    preview: 'linear-gradient(#90caf9, #e3f2fd)',
    build: (hass) => [{
      type: 'image', entity: firstEntity(hass, 'weather', 'weather.home'),
      states: { 'clear-night': '', sunny: '', rainy: '', cloudy: '', snowy: '' }, image: '',
    }],
  },
  {
    id: 'camera-still', name: m('Camera still picture'), count: 1,
    preview: 'linear-gradient(135deg, #455a64, #90a4ae)',
    build: (hass) => [{ type: 'image', entity: firstEntity(hass, 'camera', 'camera.front_door'), refresh: 10 }],
  },
  {
    id: 'dotted', name: m('Dotted texture'), count: 1,
    preview: 'radial-gradient(circle, rgba(0,0,0,.45) 1.5px, transparent 2px) 0 0 / 8px 8px, #eceff1',
    build: () => [{ type: 'pattern', pattern: 'dots', color: 'rgba(128,128,128,.35)', size: 16, thickness: 2 }],
  },
  {
    id: 'colour-wash', name: m('Colour wash'), count: 1,
    preview: 'linear-gradient(rgba(3,169,244,.4), rgba(3,169,244,.4)), #eceff1',
    build: () => [{ type: 'color', color: '#03a9f4', opacity: 40 }],
  },
  {
    id: 'vignette', name: m('Soft vignette'), count: 1,
    preview: 'radial-gradient(circle, transparent 45%, rgba(0,0,0,.55)), #cfd8dc',
    build: () => [{ type: 'gradient', gradient: 'radial-gradient(circle, rgba(0,0,0,0), rgba(0,0,0,.55))' }],
  },
];

/** Whether the look still fits under the layer limit, and the list with the look in front. */
export function addBackdropLook(current: readonly BackgroundLayerConfig[] | undefined, look: BackdropLook, hass: HomeAssistant | undefined): BackgroundLayerConfig[] | undefined {
  const list = current ?? [];
  if (list.length + look.count > MAX_BACKGROUND_LAYERS) return undefined;
  return [...look.build(hass), ...list];
}
