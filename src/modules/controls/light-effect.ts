import type { HassEntity } from '../../types';

/** LightEntityFeature.EFFECT */
const FEATURE_EFFECT = 4;

export function supportsEffect(stateObj: HassEntity): boolean {
  const list = stateObj.attributes?.effect_list;
  return Array.isArray(list) && list.length > 0 && (Number(stateObj.attributes?.supported_features ?? FEATURE_EFFECT) & FEATURE_EFFECT) !== 0;
}
