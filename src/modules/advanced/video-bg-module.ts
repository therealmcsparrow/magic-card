import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, VideoBgModuleConfig, EditorTab } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderToggleField, renderMediaField } from '../../utils/form-utils';
import { SyncContext } from '../../utils/sync-path';

class VideoBgModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'video-bg',
    name: 'Video Background',
    description: 'Display a video as a background',
    category: 'advanced',
    icon: 'mdi:video-outline',
  };

  getAvailableTabs(): EditorTab[] {
    return ['general', 'conditions', 'design'];
  }

  createDefault(): VideoBgModuleConfig {
    return {
      id: generateId('video-bg'),
      type: 'video-bg',
      autoplay: true,
      loop: true,
      muted: true,
    };
  }

  renderPreview(config: CardModule, _hass?: HomeAssistant): TemplateResult {
    const c = config as VideoBgModuleConfig;

    if (!c.url) {
      return html`
        <div class="mc-module mc-video-bg mc-video-bg-placeholder">
          <ha-icon icon="mdi:video-off-outline"></ha-icon>
        </div>
      `;
    }

    return html`
      <div class="mc-module mc-video-bg">
        <video
          src=${c.url}
          poster=${c.poster || nothing}
          ?autoplay=${c.autoplay}
          ?loop=${c.loop}
          ?muted=${c.muted}
          playsinline
        ></video>
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const syncCtx = this._buildSyncContext(config, template);
    const c = config as VideoBgModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderMediaField('Video URL', c.url, (v) => onChange({ ...c, url: v }), hass, 'video', 'url', syncCtx)}
        ${renderMediaField('Poster Image URL', c.poster, (v) => onChange({ ...c, poster: v }), hass, 'image', 'poster', syncCtx)}
        ${renderToggleField('Autoplay', c.autoplay, (v) => onChange({ ...c, autoplay: v }), 'autoplay', syncCtx)}
        ${renderToggleField('Loop', c.loop, (v) => onChange({ ...c, loop: v }), 'loop', syncCtx)}
        ${renderToggleField('Muted', c.muted, (v) => onChange({ ...c, muted: v }), 'muted', syncCtx)}
      </div>
    `;
  }
}

ModuleRegistry.register(new VideoBgModule());
