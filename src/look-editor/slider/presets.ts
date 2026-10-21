import type { SliderPreset, SliderPresetId } from '../../contracts/look-editor';
import type { SliderTrackStyle } from '../../contracts/slider-look';
import { m } from '../i18n';

/*
 * The five slider presets and the static previews of presets and track styles.
 * Previews are chunk constants: inline SVG, aria-hidden by the tile group, never animated, never config text. Filters
 * are avoided (ids would clash inside one shadow root); glow is drawn with stacked translucent strokes.
 */

const svg = (w: number, h: number, body: string): string =>
  `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true" focusable="false">${body}</svg>`;
const track = 'fill="currentColor" fill-opacity=".22" stroke="currentColor" stroke-opacity=".45"';

const preview = (id: SliderPresetId): string => {
  switch (id) {
    case 'minimal':
      return svg(72, 56, `<rect x="8" y="26" width="56" height="4" rx="2" ${track} stroke-width="1"/><rect x="8" y="26" width="30" height="4" rx="2" fill="#03a9f4"/><circle cx="38" cy="28" r="7" fill="#03a9f4"/><rect x="56" y="40" width="10" height="3" rx="1.5" fill="currentColor" fill-opacity=".6"/>`);
    case 'material':
      return svg(72, 56, `<rect x="8" y="25" width="56" height="6" rx="3" ${track} stroke-width="1"/><rect x="8" y="25" width="34" height="6" rx="3" fill="#6750a4"/><circle cx="42" cy="28" r="10" fill="#6750a4" fill-opacity=".25"/><circle cx="42" cy="28" r="7" fill="#6750a4" stroke="#fff" stroke-width="1"/>`);
    case 'neon':
      return svg(72, 56, `<rect x="8" y="24" width="56" height="8" rx="4" fill="#ff4fd8" fill-opacity=".25" stroke="currentColor" stroke-opacity=".45"/><rect x="8" y="24" width="34" height="8" rx="4" fill="#ff4fd8" fill-opacity=".35"/><rect x="8" y="26" width="34" height="4" rx="2" fill="#ff4fd8"/><circle cx="42" cy="28" r="11" fill="#ff4fd8" fill-opacity=".2"/><circle cx="42" cy="28" r="8" fill="#ff4fd8" fill-opacity=".35"/><circle cx="42" cy="28" r="5" fill="#fff" stroke="#ff4fd8" stroke-width="2"/>`);
    case 'glass':
      return svg(72, 56, `<rect x="6" y="16" width="60" height="24" rx="12" fill="currentColor" fill-opacity=".08" stroke="currentColor" stroke-opacity=".45"/><rect x="6" y="16" width="38" height="24" rx="12" fill="#4fc3f7" fill-opacity=".7"/><rect x="10" y="18" width="30" height="4" rx="2" fill="#fff" fill-opacity=".35"/><rect x="34" y="20" width="20" height="16" rx="8" fill="#fff" fill-opacity=".75" stroke="currentColor" stroke-opacity=".45"/>`);
    default:
      return svg(72, 56, `<rect x="6" y="8" width="60" height="40" rx="12" fill="#ffb74d" fill-opacity=".22" stroke="currentColor" stroke-opacity=".45"/><path d="M18 8h18v40H18a12 12 0 0 1-12-12V20A12 12 0 0 1 18 8z" fill="#ffb74d"/><circle cx="19" cy="28" r="6" fill="#fff" fill-opacity=".85"/><rect x="48" y="25" width="12" height="6" rx="2" fill="currentColor" fill-opacity=".7"/>`);
  }
};

export const SLIDER_PRESETS: readonly SliderPreset[] = [
  {
    id: 'minimal',
    label: m('Minimal'),
    description: m('Thin line, round handle, value beside it.'),
    preview: preview('minimal'),
    values: { track_style: 'thin', track_thickness: 4, thumb: 'circle', thumb_size: 16, value_position: 'beside' },
  },
  {
    id: 'material',
    label: m('Material'),
    description: m('Standard bar with a round handle.'),
    preview: preview('material'),
    values: { track_thickness: 6, track_radius: 3, thumb: 'circle', thumb_size: 20, thumb_border: 1 },
  },
  {
    id: 'neon',
    label: m('Neon'),
    description: m('Glowing line, round glowing handle.'),
    preview: preview('neon'),
    values: { track_style: 'thin', track_thickness: 6, thumb: 'circle', thumb_size: 18, thumb_border: 2, thumb_glow: 10, slider_color: '#ff4fd8', track_color: '#ff4fd840' },
  },
  {
    id: 'glass',
    label: m('Glass'),
    description: m('See-through track, pill handle.'),
    preview: preview('glass'),
    // glass_blur stays off: the flat see-through fill is the default
    values: { track_style: 'glass', track_thickness: 28, thumb: 'pill', thumb_size: 28, value_position: 'track' },
  },
  {
    id: 'big-fill',
    label: m('Big fill'),
    description: m('Large fill with icon and value. Updates while you drag.'),
    preview: preview('big-fill'),
    // Big fill is the one preset that updates while dragging
    values: { track_style: 'big-fill', fill_mode: 'auto', thumb: 'none', value_position: 'track', live: true },
  },
];

/** Track-style tiles (56 x 32, 2 px strokes), in display order. */
const tile = (body: string): string => svg(56, 32, body);
const bar = (y: number, h: number, r: number, fill: number, extra = ''): string =>
  `<rect x="4" y="${y}" width="48" height="${h}" rx="${r}" ${track} stroke-width="2"${extra}/><rect x="4" y="${y}" width="${fill}" height="${h}" rx="${r}" fill="currentColor"/>`;

export const TRACK_TILES: ReadonlyArray<{ value: SliderTrackStyle; preview: string }> = [
  { value: 'standard', preview: tile(bar(8, 16, 4, 28)) },
  { value: 'thin', preview: tile(bar(14, 4, 2, 28)) },
  { value: 'pill', preview: tile(bar(10, 12, 6, 28)) },
  { value: 'segmented', preview: tile([0, 1, 2, 3, 4, 5].map((i) => `<rect x="${4 + i * 8.5}" y="10" width="6.5" height="12" rx="1.5" fill="currentColor" fill-opacity="${i < 3 ? 1 : 0.25}"/>`).join('')) },
  { value: 'glass', preview: tile(`<rect x="4" y="7" width="48" height="18" rx="9" fill="currentColor" fill-opacity=".08" stroke="currentColor" stroke-opacity=".6" stroke-width="2"/><rect x="4" y="7" width="28" height="18" rx="9" fill="currentColor" fill-opacity=".55"/>`) },
  { value: 'big-fill', preview: tile(`<rect x="3" y="3" width="50" height="26" rx="8" ${track} stroke-width="2"/><path d="M11 3h12v26H11a8 8 0 0 1-8-8V11a8 8 0 0 1 8-8z" fill="currentColor"/>`) },
];
