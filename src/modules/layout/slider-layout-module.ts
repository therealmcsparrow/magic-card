import { html, nothing, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, SliderLayoutModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderToggleField } from '../../utils/form-utils';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { createRef, ref } from 'lit/directives/ref.js';
import { ModuleRenderer } from '../../services/module-renderer';
import { getModuleTypeOptions, renderChildModuleEditor } from '../../utils/layout-editor';

/** Track which child module is expanded for editing (keyed by "moduleId:childIdx") */
const _expandedChildMap = new Map<string, boolean>();

class SliderLayoutModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'slider-layout',
    name: 'Slider Layout',
    description: 'Arrange child modules in a slider',
    category: 'layout',
    icon: 'mdi:view-carousel',
  };

  createDefault(): SliderLayoutModuleConfig {
    return {
      id: generateId('slider-layout'),
      type: 'slider-layout',
      modules: [],
      pagination: true,
      navigation: true,
    };
  }

  renderCard(config: CardModule, hass: HomeAssistant): TemplateResult {
    const c = config as SliderLayoutModuleConfig;
    const children = c.modules || [];
    const swiperRef = createRef<HTMLDivElement>();

    const swiperClass = `swiper-${c.id}`;

    setTimeout(() => {
      const swiperElement = swiperRef.value;
      if (swiperElement && !(swiperElement as any).swiper) {
        new Swiper(swiperElement as HTMLElement, {
          modules: [Navigation, Pagination],
          pagination: c.pagination ? { el: '.swiper-pagination' } : false,
          navigation: c.navigation ? { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' } : false,
        });
      }
    });

    return html`
      <div class="mc-module mc-slider">
        <div class="swiper ${swiperClass}" ${ref(swiperRef)}>
          <div class="swiper-wrapper">
            ${children.map((child) => html`
              <div class="swiper-slide">
                ${ModuleRenderer.render(child, hass)}
              </div>
            `)}
          </div>
          ${c.pagination ? html`<div class="swiper-pagination"></div>` : ''}
          ${c.navigation ? html`
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
          ` : ''}
        </div>
      </div>
    `;
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as SliderLayoutModuleConfig;
    const children = c.modules || [];

    return html`
      <div class="mc-module mc-slider" style="padding: 16px; border: 1px dashed #ccc; position: relative;">
        <div style="display: flex; gap: 8px; overflow: hidden;">
            ${children.length > 0
              ? children.map((child) => {
                  const mod = ModuleRegistry.get(child.type);
                  return html`
                    <div style="flex-shrink: 0; width: 100px; height: 100px; border: 1px solid #eee; display: flex; align-items: center; justify-content: center;">
                        ${mod ? mod.renderPreview(child, hass) : html`<span class="mc-error">?</span>`}
                    </div>
                  `;
                })
              : html`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty slider</span>`}
        </div>
        ${c.navigation ? html`
            <div style="position: absolute; top: 50%; left: 8px; transform: translateY(-50%);">&#10094;</div>
            <div style="position: absolute; top: 50%; right: 8px; transform: translateY(-50%);">&#10095;</div>
        ` : ''}
        ${c.pagination ? html`<div style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px;">
            ${children.map(() => html`<div style="width: 8px; height: 8px; border-radius: 50%; background: #ccc;"></div>`)}
        </div>` : ''}
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
    const c = config as SliderLayoutModuleConfig;
    const children = c.modules || [];
    const moduleTypes = getModuleTypeOptions();

    return html`
      <div class="mc-tab-content">
        ${renderToggleField('Pagination', c.pagination, (v: boolean) => onChange({ ...c, pagination: v }), 'pagination', syncCtx)}
        ${renderToggleField('Navigation', c.navigation, (v: boolean) => onChange({ ...c, navigation: v }), 'navigation', syncCtx)}

        <div class="mc-section">
          <div class="mc-section-header">Slides (${children.length})</div>
          ${this._renderChildModuleList(c, hass, onChange, moduleTypes, template)}
        </div>
      </div>
    `;
  }

  private _renderChildModuleList(
    c: SliderLayoutModuleConfig,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    moduleTypes: Array<{ label: string; value: string }>,
    template?: string,
  ): TemplateResult {
    const children = c.modules || [];

    const updateChildren = (newModules: CardModule[]) => {
      onChange({ ...c, modules: newModules });
    };

    const removeChild = (childIdx: number) => {
      updateChildren(children.filter((_, i) => i !== childIdx));
    };

    const updateChild = (childIdx: number, updated: CardModule) => {
      const newModules = [...children];
      newModules[childIdx] = updated;
      updateChildren(newModules);
    };

    const addChild = (type: string) => {
      const newMod = ModuleRegistry.createDefault(type as any);
      if (newMod) updateChildren([...children, newMod]);
    };

    return html`
      ${renderChildModuleEditor({
        ownerId: c.id,
        scopeId: 'slides',
        children,
        hass,
        template,
        expandedState: _expandedChildMap,
        moduleTypes,
        onRefresh: () => onChange({ ...c }),
        onRemoveChild: removeChild,
        onUpdateChild: updateChild,
        onAddChild: addChild,
        addButtonLabel: 'Add Slide',
        getItemLabel: (_child, index, moduleName) => `${moduleName} (Slide ${index + 1})`,
      })}
    `;
  }
}

ModuleRegistry.register(new SliderLayoutModule());
