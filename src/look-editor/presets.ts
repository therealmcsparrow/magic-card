import type { MessageIndex } from '../contracts/i18n';
import type { FlowPreset } from '../contracts/look-editor';
import { m } from './i18n';

/** A preset whose label and description are m() marks of this namespace, so t() accepts them. */
export type MarkedPreset<P extends { label: unknown; description: unknown }> = P & { label: MessageIndex; description: MessageIndex };

/*
 * Preset data of the look editors (contract look-editor 1.0.0). Every `preview` is a chunk-constant, static SVG
 * (72 x 56, the preset's own colours): <mc-ui-chip-group> draws it with unsafeHTML, so it must never be built from
 * config text. Labels and descriptions are m() marks, read with t() where the chips are built. A preset removes every
 * look key plus the existing keys it lists, then writes `values` (flows: tube_fill_value only for a flow with an entity).
 * Slider presets: SLIDER_PRESETS follows the flow ones.
 */
const pv = (inner: string): string => `<svg viewBox="0 0 72 56" width="72" height="56" fill="none" stroke-linecap="round">${inner}</svg>`;

export const FLOW_PRESETS: readonly MarkedPreset<FlowPreset>[] = [
  {
    id: 'energy',
    label: m('look-editor.presets.energy'),
    description: m('look-editor.presets.glowing-yellow-orange-line-with-sparks'),
    preview: pv(
      '<path d="M6 38C22 12 50 44 66 18" stroke="#ff9100" stroke-opacity=".35" stroke-width="9"/><path d="M6 38C22 12 50 44 66 18" stroke="#ffd54f" stroke-width="3"/><path d="M28 24l6-7-1 6 6-1-7 8 1-6z" fill="#fff59d" stroke="none"/>',
    ),
    values: { line_style: 'neon', color: '#ffd54f', color_to: '#ff9100', shape: 'spark', dot_size: 10, dots: 3, glow: 8, flicker: 'subtle' },
  },
  {
    id: 'water',
    label: m('look-editor.presets.water'),
    description: m('look-editor.presets.blue-tube-with-drops-and-a-rising-level'),
    preview: pv(
      '<rect x="5" y="22" width="62" height="12" rx="6" stroke="currentColor" stroke-opacity=".55" stroke-width="1.5"/><rect x="7" y="24" width="40" height="8" rx="4" fill="#29b6f6" stroke="none"/><path d="M47 24v8" stroke="currentColor" stroke-opacity=".55" stroke-width="2"/><circle cx="20" cy="28" r="2" fill="#e1f5fe" stroke="none"/><circle cx="34" cy="27" r="1.5" fill="#e1f5fe" stroke="none"/>',
    ),
    values: { line_style: 'tube', color: '#29b6f6', shape: 'drop', dot_size: 8, dots: 3, bubbles: true, tube_fill_value: true, width: 12 },
  },
  {
    id: 'data',
    label: m('look-editor.presets.data'),
    description: m('look-editor.presets.cool-dashed-line-with-arrows'),
    preview: pv(
      '<path d="M6 28H66" stroke="#26c6da" stroke-width="2.5" stroke-dasharray="10 6" stroke-linecap="butt"/><path d="M28 21l7 7-7 7M46 21l7 7-7 7" stroke="#26c6da" stroke-width="2.5"/>',
    ),
    values: { line_style: 'dashed', dash_length: 10, dash_gap: 6, color: '#26c6da', shape: 'chevron', dot_size: 8, dots: 3, width: 2, glow: 0 },
  },
  {
    id: 'heat',
    label: m('look-editor.presets.heat'),
    description: m('look-editor.presets.warm-wavy-line-with-comets'),
    preview: pv(
      '<path d="M6 28q7.5-14 15 0t15 0 15 0 15 0" stroke="#ff7043" stroke-width="3"/><path d="M40 28q4-7 8-7" stroke="#ffca28" stroke-width="3" stroke-opacity=".5"/><circle cx="52" cy="25" r="4" fill="#ffca28" stroke="none"/>',
    ),
    values: { line_style: 'wave', amplitude: 6, wavelength: 32, color: '#ff7043', color_to: '#ffca28', shape: 'comet', dot_size: 10, dots: 2, glow: 4 },
  },
  {
    id: 'neon',
    label: m('look-editor.presets.neon'),
    description: m('look-editor.presets.pink-glowing-line-with-dots'),
    preview: pv(
      '<path d="M6 40L30 20 44 34 66 14" stroke="#ff2fd6" stroke-opacity=".35" stroke-width="10" stroke-linejoin="round"/><path d="M6 40L30 20 44 34 66 14" stroke="#ff2fd6" stroke-width="3" stroke-linejoin="round"/><path d="M6 40L30 20 44 34 66 14" stroke="#fff" stroke-opacity=".8" stroke-width="1" stroke-linejoin="round"/><circle cx="30" cy="20" r="3" fill="#fff" stroke="none"/>',
    ),
    values: { line_style: 'neon', color: '#ff2fd6', shape: 'dot', dot_size: 6, dots: 3, glow: 10, flicker: 'off' },
  },
];
