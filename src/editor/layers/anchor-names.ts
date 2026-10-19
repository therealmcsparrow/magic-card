import type { LayerAnchor } from '../../contracts/layer-placement';
import { m, t } from '../i18n';

const NAMES: Record<LayerAnchor, ReturnType<typeof m>> = {
  'top-left': m('Top left'),
  top: m('Top'),
  'top-right': m('Top right'),
  left: m('Left'),
  center: m('Centre'),
  right: m('Right'),
  'bottom-left': m('Bottom left'),
  bottom: m('Bottom'),
  'bottom-right': m('Bottom right'),
};

/** Name of an anchor in the editor's language ("Top left"). */
export const anchorName = (a: LayerAnchor): string => t(NAMES[a]);

