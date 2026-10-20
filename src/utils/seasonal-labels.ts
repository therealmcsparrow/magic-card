import type { SceneId } from './seasonal';
import type { MessageId } from '../contracts/i18n';
import { lm } from '../i18n/labels/mark';

/*
 * The display name of each seasonal scene, kept apart from the scene tables (src/utils/seasonal-scenes.ts) so the
 * editor can name a scene without carrying them. A stateless leaf: type-only imports and the lm() marks (a number in
 * the labels table, resolved with t() from src/i18n/labels). seasonal-scenes.ts builds SCENES from it.
 */
export const SCENE_LABELS: Record<SceneId, MessageId> = {
  winter: lm('Winter'),
  spring: lm('Spring'),
  summer: lm('Summer'),
  autumn: lm('Autumn'),
  christmas: lm('Christmas'),
  new_year: lm('New Year'),
  valentine: lm('Valentine'),
  easter: lm('Easter'),
  halloween: lm('Halloween'),
  snow: lm('Snow'),
  rain: lm('Rain'),
  storm: lm('Thunderstorm'),
  sun: lm('Sunny'),
  clouds: lm('Cloudy'),
  fog: lm('Fog'),
  wind: lm('Windy'),
  night: lm('Night'),
  dusk: lm('Dusk'),
};
