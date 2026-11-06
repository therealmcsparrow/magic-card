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
        ${renderFieldHint(t('card-editor.video-bg-editor.plays-behind-the-other-modules-in-the'))}
        ${renderMediaField(t('card-editor.video-bg-editor.video-url'), c.url, (v) => onChange({ ...c, url: v }), hass, 'video', 'url', syncCtx)}
        ${renderMediaField(t('card-editor.video-bg-editor.poster-image-url'), c.poster, (v) => onChange({ ...c, poster: v }), hass, 'image', 'poster', syncCtx)}
        ${renderFieldHint(t('card-editor.video-bg-editor.shown-until-the-video-plays-and-instead'))}
        ${renderSegField(t('card-editor.video-bg-editor.fit'), c.fit ?? 'cover', [
          { label: t('card-editor.video-bg-editor.cover'), value: 'cover' },
          { label: t('card-editor.video-bg-editor.contain'), value: 'contain' },
        ], (v) => onChange({ ...c, fit: v as VideoBgModuleConfig['fit'] }), 'fit', syncCtx)}
        ${renderToggleField(t('card-editor.video-bg-editor.autoplay'), c.autoplay !== false, (v) => onChange({ ...c, autoplay: v }), 'autoplay', syncCtx,
          t('card-editor.video-bg-editor.plays-while-the-card-is-visible-not-with'))}
        ${renderToggleField(t('card-editor.video-bg-editor.loop'), c.loop !== false, (v) => onChange({ ...c, loop: v }), 'loop', syncCtx)}
        ${renderToggleField(t('card-editor.video-bg-editor.muted'), c.muted !== false, (v) => onChange({ ...c, muted: v }), 'muted', syncCtx,
          t('card-editor.video-bg-editor.browsers-only-autoplay-muted-videos'))}
      </div>
    `;
  },
};
