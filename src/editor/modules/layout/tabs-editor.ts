import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { TabsModuleConfig } from '../../../types';
import { renderSelectField } from '../../../utils/form-utils';
import { renderIconFxEditor } from '../../components/icon-fx-editor';
import { buildSyncContext } from '../base-editor';

/** The module's own settings; tabs, their labels, icons and modules are managed in the tree. */
export const tabsEditor: ModuleEditor = {
  type: 'tabs',
  general(config, hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as TabsModuleConfig;
    const tabs = c.tabs || [];

    return html`
      <div class="mc-tab-content">
        ${renderSelectField('Tab style', c.tab_style, [
          { label: 'Default', value: 'default' },
          { label: 'Pills', value: 'pills' },
          { label: 'Underline', value: 'underline' },
        ], (v) => onChange({ ...c, tab_style: v as TabsModuleConfig['tab_style'] }), 'tab_style', syncCtx)}
        ${tabs.length > 1
          ? renderSelectField('Default tab', String(Math.min(c.active_tab ?? 0, tabs.length - 1)),
            tabs.map((t, i) => ({ label: t.label || `Tab ${i + 1}`, value: String(i) })),
            (v) => onChange({ ...c, active_tab: Number(v) }), 'active_tab', syncCtx)
          : nothing}
        ${tabs.some((t) => t.icon)
          ? renderIconFxEditor(c, hass, onChange, { icon: tabs.find((t) => t.icon)?.icon ?? '', syncCtx })
          : nothing}
        <p class="help">Add, rename and order tabs, and add their modules, in the structure tree.</p>
      </div>
    `;
  },
};
