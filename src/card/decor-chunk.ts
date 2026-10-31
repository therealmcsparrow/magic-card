import { BUILD_VERSION } from '../utils/build-version';
import { McRing } from './mc-ring';
import { McShape } from './mc-shape';
import { McValueBg } from './mc-value-bg';

/*
 * Chunk entry of dist/magic-card-decor.js: <mc-ring>, <mc-shape> and <mc-value-bg>. install()
 * defines them and they upgrade in place; a shaped card stays hidden until then (`data-mc-decor-wait`).
 */

export const BUILD: string = BUILD_VERSION;

/** The card calls nothing in this chunk: the elements are the whole surface. */
export const api = {} as const;

export function install(): void {
  if (!customElements.get('mc-ring')) customElements.define('mc-ring', McRing);
  if (!customElements.get('mc-shape')) customElements.define('mc-shape', McShape);
  if (!customElements.get('mc-value-bg')) customElements.define('mc-value-bg', McValueBg);
}
