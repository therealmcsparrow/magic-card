import type { ModuleEditor } from '../../../contracts/module-editor';
import type { RowModuleConfig } from '../../../types';
import { renderRowModuleGeneral } from '../../inspector/container-settings';
import { buildSyncContext } from '../base-editor';

/** Layout, widths, gap, padding like a card row; columns and their modules are managed in the tree. */
export const rowEditor: ModuleEditor = {
  type: 'row',
  general(config, _hass, onChange, template) {
    return renderRowModuleGeneral(config as RowModuleConfig, onChange, buildSyncContext(config, template));
  },
};
