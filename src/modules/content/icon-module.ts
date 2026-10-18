import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, IconModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { entityStateColor } from '../../utils/entity-color';
import { parseGradient } from '../../utils/gradient';
import { renderIcon } from '../../icons/render-icon';
import { t } from '../../card/i18n';

class IconModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'icon',
    get name() {
      return t('Icon');
    },
    description: 'Display an icon from MDI or entity',
    category: 'content',
    icon: 'mdi:emoticon-outline',
  };

  createDefault(): IconModuleConfig {
    return {
      id: generateId('icon'),
      type: 'icon',
      icon: 'mdi:home',
      size: '24px',
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as IconModuleConfig;
    const icon = c.icon || 'mdi:help';
    // use_entity_color > icon_color > design colour (inherited) > theme default
    const entityColor = c.use_entity_color && c.entity ? entityStateColor(hass?.states[c.entity]) : undefined;
    // a gradient icon_color: stop 0 is the colour, the icon draws the gradient (unless icon_fx sets another colour style)
    const g = !entityColor && parseGradient(c.icon_color);
    const colors = c.icon_fx?.colors;
    const fx = g && !colors?.style ? { ...c.icon_fx, colors: { ...colors, style: 'gradient' as const, gradient: g.stops, angle: g.angle } } : c.icon_fx;
    const color = entityColor || (g && g.stops[0]) || c.icon_color || 'inherit';

    // Entity icon as HA resolves it (registry, attribute, translations / state defaults), not only
    // the `icon` attribute most entities don't have.
    const iconEl = renderIcon({
      icon,
      entity: c.entity,
      hass,
      useEntityIcon: c.use_entity_icon,
      className: 'mc-anim-icon',
      part: 'icon',
      fx,
      iconOn: c.icon_on,
      iconOff: c.icon_off,
      svg: c.svg,
      fallbackIcon: 'mdi:help',
    });

    return html`
      <div class="mc-module mc-icon" style="--mc-icon-size: ${c.size || '24px'}; color: ${color}">
        ${iconEl}
      </div>
    `;
  }

}
ModuleRegistry.register(new IconModule());
