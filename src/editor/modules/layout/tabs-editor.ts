import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { TabsModuleConfig } from '../../../types';
import { renderSelectField } from '../../../utils/form-utils';
import { renderIconFxEditor } from '../../components/icon-fx-editor';
import { buildSyncContext } from '../base-editor';
import { t } from '../../i18n';

/** The module's own settings; tabs, their labels, icons and modules are managed in the tree. */
export const tabsEditor: ModuleEditor = {
  type: 'tabs',
  general(config, hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as TabsModuleConfig;
    const tabs = c.tabs || [];

    return html`
      <div class="mc-tab-content">
        ${renderSelectField(t('card-editor.tabs-editor.tab-style'), c.tab_style, [
          { label: t('card-editor.tabs-editor.default'), value: 'default' },
          { label: t('card-editor.tabs-editor.pills'), value: 'pills' },
          { label: t('card-editor.tabs-editor.underline'), value: 'underline' },
        ], (v) => onChange({ ...c, tab_style: v as TabsModuleConfig['tab_style'] }), 'tab_style', syncCtx)}
        ${tabs.length > 1
          ? renderSelectField(t('card-editor.tabs-editor.default-tab'), String(Math.min(c.active_tab ?? 0, tabs.length - 1)),
            tabs.map((tab, i) => ({ label: tab.label || t('card-editor.tabs-editor.tab-n', { n: i + 1 }), value: String(i) })),
            (v) => onChange({ ...c, active_tab: Number(v) }), 'active_tab', syncCtx)
          : nothing}
        ${tabs.some((t) => t.icon)
          ? renderIconFxEditor(c, hass, onChange, { icon: tabs.find((t) => t.icon)?.icon ?? '', syncCtx })
          : nothing}
        <p class="help">${t('card-editor.tabs-editor.add-rename-and-order-tabs-and-add-their')}</p>
      </div>
    `;
  },
};
