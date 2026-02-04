import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, VideoBgModuleConfig, EditorTab } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderToggleField, renderMediaField } from '../../utils/form-utils';

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
        <div class="mc-module mc-video-bg" style="display:flex;align-items:center;justify-content:center;height:120px;background:var(--mc-border);border-radius:8px">
          <ha-icon icon="mdi:video-off-outline" style="--mdc-icon-size:32px;color:var(--mc-text-secondary)"></ha-icon>
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
  ): TemplateResult {
    const c = config as VideoBgModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderMediaField('Video URL', c.url, (v) => onChange({ ...c, url: v }), hass, 'video')}
        ${renderMediaField('Poster Image URL', c.poster, (v) => onChange({ ...c, poster: v }), hass, 'image')}
        ${renderToggleField('Autoplay', c.autoplay, (v) => onChange({ ...c, autoplay: v }))}
        ${renderToggleField('Loop', c.loop, (v) => onChange({ ...c, loop: v }))}
        ${renderToggleField('Muted', c.muted, (v) => onChange({ ...c, muted: v }))}
      </div>
    `;
  }
}

ModuleRegistry.register(new VideoBgModule());
