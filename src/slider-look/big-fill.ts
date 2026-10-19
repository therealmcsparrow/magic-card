import { html, nothing, type TemplateResult } from 'lit';
import type { HomeAssistant } from '../types';
import { renderEntityIcon } from '../utils/entity-icon';
import { css, ratio, type RGB } from './colour';

/*
 * Big fill (slider-look 1.0.0): the entity icon and the value sit in the track, so whatever is under
 * them is the fill or the empty track depending on the value. Designer round 1 (Marco S2): one text
 * colour plus a 1 px outline in the opposite colour on both, not a two-tone clip. The text colour is
 * the one that reads best on the fill (4.5:1 on a plain fill); the outline carries it over the empty
 * track and across the fill edge (text against outline is 21:1).
 */

const WHITE: RGB = [255, 255, 255];
const BLACK: RGB = [0, 0, 0];
const hex = (n: number) => Math.round(n);

/** Colours the fill passes through where the icon or the value can sit. */
export function fillSamples(fill: RGB | undefined, mode: 'solid' | 'gradient' | 'brightness' | 'kelvin', to?: RGB): RGB[] {
  if (mode === 'kelvin') return [[0xff, 0xa9, 0x4d], [0xbf, 0xe0, 0xff]];
  if (!fill) return [];
  if (mode === 'gradient' && to) return [fill, to];
  // brightness: a 75 % black ramp over the colour, darkest at the start (where the icon sits at low values)
  if (mode === 'brightness') return [[hex(fill[0] * 0.25), hex(fill[1] * 0.25), hex(fill[2] * 0.25)], fill];
  return [fill];
}

export interface BigFillColours {
  /** Colour of the icon and the value. */
  text: string;
  /** 1 px outline colour, the opposite of the text. */
  outline: string;
}

/** White or black, whichever reads best on the worst of the samples; the outline is the other one. No samples: white on black. */
export function bigFillColours(samples: RGB[]): BigFillColours {
  const worst = (c: RGB) => Math.min(...samples.map((s) => ratio(c, s)));
  const light = !samples.length || worst(WHITE) >= worst(BLACK);
  return { text: css(light ? WHITE : BLACK), outline: css(light ? BLACK : WHITE) };
}

/** The entity's icon (or the configured one) at the start of the track; `centre` puts it mid-track (vertical only). */
export function bigFillIcon(hass: HomeAssistant | undefined, entityId: string | undefined, icon: string | undefined, centre: boolean): TemplateResult | typeof nothing {
  const cls = centre ? 'mc-sl-i mc-sl-i--c' : 'mc-sl-i';
  return icon ? html`<ha-icon class=${cls} icon=${icon}></ha-icon>` : renderEntityIcon(hass, entityId, 'mdi:eye', cls);
}
