import { VERSION } from '../../version';
import { ModuleRegistry } from '../module-registry';
import { CameraView } from '../content/camera-view';
import { McCameraLive } from '../content/camera-live';
import { GraphsView } from '../content/graphs-view';
import { CustomCardView, EmbeddedCard } from '../advanced/custom-card-view';
import { ForecastView } from '../advanced/forecast-view';
import { VideoBgView, McBgVideo } from '../advanced/video-bg-view';
import { WeatherView } from '../advanced/weather-view';
import { TabsView } from '../layout/tabs-view';
import { ClockView } from '../advanced/clock-view';
import { ImageView } from '../content/image-view';

/*
 * Chunk entry of dist/magic-card-modules-extra.js (contract lazy-module 1.0.0). Evaluating this file changes
 * nothing global: everything happens in install(), which src/utils/lazy-chunk.ts calls only when
 * BUILD matches the magic-card.js that loaded it.
 */

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

export { weatherIconStyles as styles } from '../../icons/weather-icons';

export function install(): void {
  if (!customElements.get('mc-embedded-card')) customElements.define('mc-embedded-card', EmbeddedCard);
  if (!customElements.get('mc-bg-video')) customElements.define('mc-bg-video', McBgVideo);
  if (!customElements.get('mc-camera-live')) customElements.define('mc-camera-live', McCameraLive);
  ModuleRegistry.provideView('camera', new CameraView());
  ModuleRegistry.provideView('video-bg', new VideoBgView());
  ModuleRegistry.provideView('weather', new WeatherView());
  ModuleRegistry.provideView('forecast', new ForecastView());
  ModuleRegistry.provideView('graphs', new GraphsView());
  ModuleRegistry.provideView('custom-card', new CustomCardView());
  ModuleRegistry.provideView('tabs', new TabsView());
  ModuleRegistry.provideView('clock', new ClockView());
  ModuleRegistry.provideView('image', new ImageView());
}
