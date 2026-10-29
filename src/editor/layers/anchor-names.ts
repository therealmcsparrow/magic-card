import type { LayerAnchor } from '../../contracts/layer-placement';
import { m, t } from '../i18n';

const NAMES: Record<LayerAnchor, ReturnType<typeof m>> = {
  'top-left': m('card-editor.anchor-names.top-left'),
  top: m('card-editor.anchor-names.top'),
  'top-right': m('card-editor.anchor-names.top-right'),
  left: m('card-editor.anchor-names.left'),
  center: m('card-editor.anchor-names.centre'),
  right: m('card-editor.anchor-names.right'),
  'bottom-left': m('card-editor.anchor-names.bottom-left'),
  bottom: m('card-editor.anchor-names.bottom'),
  'bottom-right': m('card-editor.anchor-names.bottom-right'),
};

/** Name of an anchor in the editor's language ("Top left"). */
export const anchorName = (a: LayerAnchor): string => t(NAMES[a]);

