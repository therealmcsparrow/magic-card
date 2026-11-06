import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { CameraModuleConfig } from '../../../types';
import { renderTextField, renderToggleField, renderSegField, renderNumberField, renderFieldHint } from '../../../utils/form-utils';
import { DEFAULT_REFRESH_S } from '../../../modules/content/camera-module';
import { buildSyncContext } from '../base-editor';
import { t } from '../../i18n';
import { renderEntitySourceField } from '../../components/entity-source';

export const cameraEditor: ModuleEditor = {
  type: 'camera',
  entityField: true,
  general(config, hass, onChange, template, scope) {
    const c = config as CameraModuleConfig;
    const syncCtx = buildSyncContext(config, template);
    const live = c.camera_view === 'live';
    return html`
      <div class="mc-tab-content">
        ${renderEntitySourceField(t('card-editor.camera-editor.camera-entity'), c, onChange, hass, scope, { domain: 'camera', syncCtx })}
        ${renderSegField(t('card-editor.camera-editor.view'), live ? 'live' : 'snapshot', [
          { label: t('card-editor.camera-editor.live'), value: 'live' },
          { label: t('card-editor.camera-editor.snapshot'), value: 'snapshot' },
        ], (v) => onChange({ ...c, camera_view: v as CameraModuleConfig['camera_view'] }), 'camera_view', syncCtx)}
        ${live
          ? html`
              ${renderToggleField(t('card-editor.camera-editor.show-controls'), c.show_controls !== false, (v) => onChange({ ...c, show_controls: v }), 'show_controls', syncCtx,
                t('card-editor.camera-editor.play-pause-sound-and-full-screen-on-the'))}
              ${renderFieldHint(t('card-editor.camera-editor.the-studio-canvas-shows-a-snapshot-the'))}
            `
          : nothing}
        ${renderNumberField(live ? t('card-editor.camera-editor.snapshot-refresh-seconds') : t('card-editor.camera-editor.refresh-every-seconds'), c.refresh_interval,
          (v) => onChange({ ...c, refresh_interval: Number.isFinite(v) && v > 0 ? v : undefined }),
          { min: 1, max: 3600, optional: true, placeholder: String(DEFAULT_REFRESH_S) }, 'refresh_interval', syncCtx)}
        ${live ? renderFieldHint(t('card-editor.camera-editor.used-until-the-stream-player-is')) : nothing}
        ${renderTextField(t('card-editor.camera-editor.aspect-ratio'), c.aspect_ratio === undefined ? undefined : String(c.aspect_ratio),
          (v) => onChange({ ...c, aspect_ratio: v }), 'aspect_ratio', syncCtx, { placeholder: '16:9' })}
      </div>
    `;
  },
};
