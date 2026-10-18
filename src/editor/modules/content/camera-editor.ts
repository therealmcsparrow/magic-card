import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { CameraModuleConfig } from '../../../types';
import { renderTextField, renderToggleField, renderEntityField, renderSegField, renderNumberField, renderFieldHint } from '../../../utils/form-utils';
import { DEFAULT_REFRESH_S } from '../../../modules/content/camera-module';
import { buildSyncContext } from '../base-editor';
import { t } from '../../i18n';

export const cameraEditor: ModuleEditor = {
  type: 'camera',
  general(config, hass, onChange, template) {
    const c = config as CameraModuleConfig;
    const syncCtx = buildSyncContext(config, template);
    const live = c.camera_view === 'live';
    return html`
      <div class="mc-tab-content">
        ${renderEntityField(t('Camera entity'), c.entity, (v) => onChange({ ...c, entity: v }), hass, 'camera', 'entity', syncCtx)}
        ${renderSegField(t('View'), live ? 'live' : 'snapshot', [
          { label: t('Live'), value: 'live' },
          { label: t('Snapshot'), value: 'snapshot' },
        ], (v) => onChange({ ...c, camera_view: v as CameraModuleConfig['camera_view'] }), 'camera_view', syncCtx)}
        ${live
          ? html`
              ${renderToggleField(t('Show controls'), c.show_controls !== false, (v) => onChange({ ...c, show_controls: v }), 'show_controls', syncCtx,
                t('Play, pause, sound and full screen on the live stream.'))}
              ${renderFieldHint(t('The studio canvas shows a snapshot; the dashboard plays the stream (muted).'))}
            `
          : nothing}
        ${renderNumberField(live ? t('Snapshot refresh (seconds)') : t('Refresh every (seconds)'), c.refresh_interval,
          (v) => onChange({ ...c, refresh_interval: Number.isFinite(v) && v > 0 ? v : undefined }),
          { min: 1, max: 3600, optional: true, placeholder: String(DEFAULT_REFRESH_S) }, 'refresh_interval', syncCtx)}
        ${live ? renderFieldHint(t('Used until the stream player is available.')) : nothing}
        ${renderTextField(t('Aspect ratio'), c.aspect_ratio === undefined ? undefined : String(c.aspect_ratio),
          (v) => onChange({ ...c, aspect_ratio: v }), 'aspect_ratio', syncCtx, { placeholder: '16:9' })}
      </div>
    `;
  },
};
