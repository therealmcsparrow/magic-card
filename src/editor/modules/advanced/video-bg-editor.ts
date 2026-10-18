import { html } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { VideoBgModuleConfig } from '../../../types';
import { renderToggleField, renderMediaField, renderSegField, renderFieldHint } from '../../../utils/form-utils';
import { buildSyncContext } from '../base-editor';
import { t } from '../../i18n';

export const videoBgEditor: ModuleEditor = {
  type: 'video-bg',
  tabs: ['general', 'conditions', 'design'],
  general(config, hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as VideoBgModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderFieldHint(t('Plays behind the other modules in the same column or layout. On its own in a column it shows at its own size.'))}
        ${renderMediaField(t('Video URL'), c.url, (v) => onChange({ ...c, url: v }), hass, 'video', 'url', syncCtx)}
        ${renderMediaField(t('Poster image URL'), c.poster, (v) => onChange({ ...c, poster: v }), hass, 'image', 'poster', syncCtx)}
        ${renderFieldHint(t('Shown until the video plays, and instead of it when it cannot play.'))}
        ${renderSegField(t('Fit'), c.fit ?? 'cover', [
          { label: t('Cover'), value: 'cover' },
          { label: t('Contain'), value: 'contain' },
        ], (v) => onChange({ ...c, fit: v as VideoBgModuleConfig['fit'] }), 'fit', syncCtx)}
        ${renderToggleField(t('Autoplay'), c.autoplay !== false, (v) => onChange({ ...c, autoplay: v }), 'autoplay', syncCtx,
          t('Plays while the card is visible (not with reduced motion).'))}
        ${renderToggleField(t('Loop'), c.loop !== false, (v) => onChange({ ...c, loop: v }), 'loop', syncCtx)}
        ${renderToggleField(t('Muted'), c.muted !== false, (v) => onChange({ ...c, muted: v }), 'muted', syncCtx,
          t('Browsers only autoplay muted videos.'))}
      </div>
    `;
  },
};
