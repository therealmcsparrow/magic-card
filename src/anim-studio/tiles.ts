import type { TargetRef } from './model';

/*
 * The preview stage's tiles: what the studio previews a document on. Each tile is one module of
 * the preview card (studio-model.ts previewConfig) with the card-part targets it has, so the
 * studio can offer only the targets the current tile can show. Tracks add tiles here (the card
 * tile: icon, name, state and background).
 */

export type PreviewTile = 'icon' | 'button' | 'text' | 'card';

/** A simulated entity the tile's module reads (the stage adds it to the preview's hass, see tileHass). */
export interface TileEntity {
  state: string;
  attributes: Record<string, unknown>;
}

export interface TileDef {
  id: PreviewTile;
  /** Stage toolbar label (sentence case). */
  label: string;
  /** Stage toolbar icon. */
  icon: string;
  /** Card-part targets the tile's module has (`element` always). */
  targets: TargetRef[];
  /** Entities the tile's module shows (name, state), by entity id. */
  entities?: Record<string, TileEntity>;
}

/** The card tile's entity: a room temperature, so it has a name, a state with a unit and an icon. */
export const CARD_TILE_ENTITY = 'sensor.mc_studio_living_room';

export const TILES: TileDef[] = [
  { id: 'icon', label: 'Icon', icon: 'mdi:bell-ring-outline', targets: ['element', 'icon'] },
  { id: 'button', label: 'Button', icon: 'mdi:gesture-tap-button', targets: ['element', 'icon', 'name'] },
  { id: 'text', label: 'Text', icon: 'mdi:format-text', targets: ['element', 'name'] },
  {
    id: 'card',
    label: 'Card',
    icon: 'mdi:card-text-outline',
    targets: ['element', 'icon', 'name', 'state', 'background'],
    entities: {
      [CARD_TILE_ENTITY]: {
        state: '21.5',
        attributes: { friendly_name: 'Living room', unit_of_measurement: '°C', device_class: 'temperature', state_class: 'measurement' },
      },
    },
  },
];

/** The tile's definition (the icon tile for an unknown id). */
export const tileDef = (tile: PreviewTile): TileDef => TILES.find((t) => t.id === tile) ?? TILES[0];

/** The tile's module config for the preview card (`thumb`: the smaller thumbnail tile). */
export function tileModule(tile: PreviewTile, id: string, thumb: boolean, animations?: unknown[]): Record<string, unknown> {
  const design: Record<string, unknown> = { text_align: 'center', ...(animations ? { animations } : {}) };
  switch (tile) {
    case 'icon':
      return { id, type: 'icon', icon: 'mdi:bell-ring', size: thumb ? '36px' : '64px', design };
    case 'button':
      return { id, type: 'button', label: 'Doorbell', icon: 'mdi:bell', design };
    case 'text':
      return { id, type: 'text', text: 'Front door', design: { ...design, font_size: thumb ? '18px' : '28px', font_weight: '500' } };
    case 'card':
      // info-like: icon, name and state on a surface of its own, so the background has something to move
      return {
        id,
        type: 'info',
        entity: CARD_TILE_ENTITY,
        icon: 'mdi:thermometer',
        show_icon: true,
        show_name: true,
        show_state: true,
        design: {
          ...design,
          text_align: 'left',
          background_color: 'var(--secondary-background-color, #f2f3f5)',
          border_radius: '12px',
          padding: thumb ? '8px 10px' : '14px 18px',
        },
      };
  }
}

/**
 * The preview's hass with the tile's simulated entities added (the hass itself when the tile has
 * none). Real entities of the same id win, so a page with that entity shows its own state.
 */
export function tileHass<T extends { states?: Record<string, unknown> }>(tile: PreviewTile, hass: T): T {
  const ents = tileDef(tile).entities;
  if (!ents) return hass;
  // one object per (tile, hass): the preview card re-renders only when the hass really changes
  let byTile = tileHassCache.get(hass);
  if (!byTile) tileHassCache.set(hass, (byTile = new Map()));
  const hit = byTile.get(tile);
  if (hit) return hit as T;
  const states: Record<string, unknown> = {};
  for (const [id, e] of Object.entries(ents)) states[id] = { entity_id: id, state: e.state, attributes: e.attributes, last_changed: '', last_updated: '', context: { id: '' } };
  const out = { ...hass, states: { ...states, ...(hass.states ?? {}) } };
  byTile.set(tile, out);
  return out;
}
const tileHassCache = new WeakMap<object, Map<PreviewTile, unknown>>();
