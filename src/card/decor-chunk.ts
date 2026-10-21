import { BUILD_VERSION } from '../utils/build-version';
import { McRing } from './mc-ring';
import { McShape } from './mc-shape';
import { McValueBg } from './mc-value-bg';

/*
 * Chunk entry of dist/magic-card-decor.js (lazy-module 1.4.0 chunk `decor`): <mc-ring>, <mc-shape> and <mc-value-bg>,
 * the elements that draw a ring, an outline shape (clip, content inset, border stroke) and a value background on the
 * element they sit in. Evaluating this file changes nothing global: install() defines the three elements, which
 * upgrade in place. The card renders their tags from its config and the entity states; until the chunk has installed
 * they are inert, and a card with a shape stays hidden (src/card/magic-card.ts, `data-mc-decor-wait`) so the content
 * does not move when the shape's inset lands.
 */

export const BUILD: string = BUILD_VERSION;

/** The card calls nothing in this chunk: the elements are the whole surface. */
export const api = {} as const;

export function install(): void {
  if (!customElements.get('mc-ring')) customElements.define('mc-ring', McRing);
  if (!customElements.get('mc-shape')) customElements.define('mc-shape', McShape);
  if (!customElements.get('mc-value-bg')) customElements.define('mc-value-bg', McValueBg);
}
