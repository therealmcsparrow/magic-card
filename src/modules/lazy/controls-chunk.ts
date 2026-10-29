import { VERSION } from '../../version';
import { ModuleRegistry } from '../module-registry';
import { SliderView } from '../controls/slider-view';
import { SpinboxView } from '../controls/spinbox-view';
import { DropdownView } from '../controls/dropdown-view';
import { LightView } from '../controls/light-view';
import { GaugeView } from '../controls/gauge-view';
import { controlsViewStyles } from '../../css/controls-styles';

/*
 * Chunk entry of dist/magic-card-controls.js (contract lazy-module 1.4.0): the views of the slider, spinbox, dropdown,
 * light and gauge modules. Evaluating this file changes nothing global: everything happens in install(), which
 * src/utils/lazy-chunk.ts calls only when BUILD matches the magic-card.js that loaded it.
 *
 * Parent of the slider-look chunk (the literal import() sits here), so webpack leaves the modules this chunk holds, among
 * them the slider-look slot, out of it.
 */

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

/** The rules only these views render; they reach the cards in the same task as the views. */
export const styles = [controlsViewStyles];

export function install(): void {
  ModuleRegistry.provideView('slider', new SliderView());
  ModuleRegistry.provideView('spinbox', new SpinboxView());
  ModuleRegistry.provideView('dropdown', new DropdownView());
  ModuleRegistry.provideView('light', new LightView());
  ModuleRegistry.provideView('gauge', new GaugeView());
}

/** Only returns the import() promise: the chunk table calls it in the same synchronous call as its retry. */
export const importSliderLook = () => import(/* webpackChunkName: "slider-look" */ '../../slider-look/chunk');
