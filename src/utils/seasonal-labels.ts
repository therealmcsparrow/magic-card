import type { SceneId } from './seasonal';
import type { MessageIndex } from '../contracts/i18n';
import { lm } from '../i18n/labels/mark';

/** The display name of each seasonal scene, kept apart from the scene tables. */
export const SCENE_LABELS: Record<SceneId, MessageIndex> = {
  winter: lm('labels.seasonal-labels.winter'),
  spring: lm('labels.seasonal-labels.spring'),
  summer: lm('labels.seasonal-labels.summer'),
  autumn: lm('labels.seasonal-labels.autumn'),
  christmas: lm('labels.seasonal-labels.christmas'),
  new_year: lm('labels.seasonal-labels.new-year'),
  valentine: lm('labels.seasonal-labels.valentine'),
  easter: lm('labels.seasonal-labels.easter'),
  halloween: lm('labels.seasonal-labels.halloween'),
  snow: lm('labels.seasonal-labels.snow'),
  rain: lm('labels.seasonal-labels.rain'),
  storm: lm('labels.seasonal-labels.thunderstorm'),
  sun: lm('labels.seasonal-labels.sunny'),
  clouds: lm('labels.seasonal-labels.cloudy'),
  fog: lm('labels.seasonal-labels.fog'),
  wind: lm('labels.seasonal-labels.windy'),
  night: lm('labels.seasonal-labels.night'),
  dusk: lm('labels.seasonal-labels.dusk'),
};
