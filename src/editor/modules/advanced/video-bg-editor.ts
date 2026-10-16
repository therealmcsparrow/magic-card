import { html } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { VideoBgModuleConfig } from '../../../types';
import { renderToggleField, renderMediaField, renderSegField, renderFieldHint } from '../../../utils/form-utils';
import { buildSyncContext } from '../base-editor';

export const videoBgEditor: ModuleEditor = {
  type: 'video-bg',
  tabs: ['general', 'conditions', 'design'],
  general(config, hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as VideoBgModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderFieldHint('Plays behind the other modules in the same column or layout. On its own in a column it shows at its own size.')}
        ${renderMediaField('Video URL', c.url, (v) => onChange({ ...c, url: v }), hass, 'video', 'url', syncCtx)}
        ${renderMediaField('Poster image URL', c.poster, (v) => onChange({ ...c, poster: v }), hass, 'image', 'poster', syncCtx)}
        ${renderFieldHint('Shown until the video plays, and instead of it when it cannot play.')}
        ${renderSegField('Fit', c.fit ?? 'cover', [
          { label: 'Cover', value: 'cover' },
          { label: 'Contain', value: 'contain' },
        ], (v) => onChange({ ...c, fit: v as VideoBgModuleConfig['fit'] }), 'fit', syncCtx)}
        ${renderToggleField('Autoplay', c.autoplay !== false, (v) => onChange({ ...c, autoplay: v }), 'autoplay', syncCtx,
          'Plays while the card is visible (not with reduced motion).')}
        ${renderToggleField('Loop', c.loop !== false, (v) => onChange({ ...c, loop: v }), 'loop', syncCtx)}
        ${renderToggleField('Muted', c.muted !== false, (v) => onChange({ ...c, muted: v }), 'muted', syncCtx,
          'Browsers only autoplay muted videos.')}
      </div>
    `;
  },
};
