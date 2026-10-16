import { html, nothing, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, SliderLayoutModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { renderChildModule, renderEmptySlot, visibleChildren } from '../render-module';
import { currentRenderContext } from '../../services/render-context';
import { generateId } from '../../utils/id-generator';
import { renderNumberField, renderToggleField } from '../../utils/form-utils';
import './mc-swiper';
import type { McSwiperOptions } from './mc-swiper';

/** Swiper options from the module config; unset keys keep the defaults (1 slide, 8 px gap). */
export function sliderOptions(c: SliderLayoutModuleConfig, editMode: boolean): McSwiperOptions {
  const spv = Number(c.slides_per_view);
  const gap = Number(c.space_between);
  const delay = Number(c.autoplay_delay);
  return {
    slidesPerView: Number.isFinite(spv) && spv > 0 ? spv : 1,
    spaceBetween: Number.isFinite(gap) && gap >= 0 ? gap : 8,
    rewind: !!c.loop,
    pagination: c.pagination !== false,
    navigation: c.navigation !== false,
    autoplay: c.autoplay ? (Number.isFinite(delay) && delay >= 1000 ? delay : 5000) : 0,
    editMode,
  };
}

class SliderLayoutModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'slider-layout',
    name: 'Slider layout',
    description: 'Arrange child modules in a slider',
    category: 'layout',
    icon: 'mdi:view-carousel-outline',
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

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as SliderLayoutModuleConfig;
    const children = c.modules || [];
    if (!children.length) {
      return html`<div class="mc-module mc-slider-layout">${renderEmptySlot('Empty slider')}</div>`;
    }
    const ctx = currentRenderContext();
    const configured = sliderOptions(c, !!ctx?.editMode);
    // children hidden by their display conditions get no (empty) slide and no pagination bullet
    const slides = visibleChildren(children);
    if (!slides.length) return html``;
    const multi = slides.length > 1;
    // arrows / bullets only with 2+ slides; a change re-creates Swiper with (or without) them
    const options = { ...configured, navigation: configured.navigation && multi, pagination: configured.pagination && multi };
    const selected = ctx?.selectedChild?.()?.index;
    const activeIndex = selected === undefined ? undefined : Math.max(0, slides.findIndex((s) => s.index === selected));
    // Slider controls are not a tap on the slider module (its own actions stay on its wrapper).
    const stop = (e: Event) => e.stopPropagation();

    return html`
      <mc-swiper class="mc-module mc-slider-layout" .options=${options} .activeIndex=${activeIndex}>
        <div class="swiper">
          <div class="swiper-wrapper">
            ${slides.map(({ child, index }) => html`
              <div class="swiper-slide">${renderChildModule(child, hass, index)}</div>
            `)}
          </div>
        </div>
        ${options.navigation
          ? html`
            <button type="button" class="mc-slider-nav mc-slider-prev" @pointerdown=${stop} @pointerup=${stop} @keydown=${stop} aria-label="Previous slide">
              <ha-icon icon="mdi:chevron-left"></ha-icon>
            </button>
            <button type="button" class="mc-slider-nav mc-slider-next" @pointerdown=${stop} @pointerup=${stop} @keydown=${stop} aria-label="Next slide">
              <ha-icon icon="mdi:chevron-right"></ha-icon>
            </button>`
          : nothing}
        ${options.pagination ? html`<div class="mc-slider-pagination" @pointerdown=${stop} @pointerup=${stop} @keydown=${stop}></div>` : nothing}
      </mc-swiper>
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

    return html`
      <div class="mc-tab-content">
        ${renderToggleField('Pagination', c.pagination !== false, (v: boolean) => onChange({ ...c, pagination: v }), 'pagination', syncCtx)}
        ${renderToggleField('Navigation', c.navigation !== false, (v: boolean) => onChange({ ...c, navigation: v }), 'navigation', syncCtx)}
        ${renderNumberField('Slides per view', c.slides_per_view ?? 1, (v) => onChange({ ...c, slides_per_view: v > 0 ? v : 1 }),
          { min: 1, max: 6, step: 0.1 }, 'slides_per_view', syncCtx)}
        ${renderNumberField('Space between slides (px)', c.space_between ?? 8, (v) => onChange({ ...c, space_between: v >= 0 ? v : 0 }),
          { min: 0, step: 1 }, 'space_between', syncCtx)}
        ${renderToggleField('Loop', c.loop, (v: boolean) => onChange({ ...c, loop: v }), 'loop', syncCtx,
          'After the last slide, go back to the first one')}
        ${renderToggleField('Autoplay', c.autoplay, (v: boolean) => onChange({ ...c, autoplay: v }), 'autoplay', syncCtx)}
        ${c.autoplay
          ? renderNumberField('Autoplay delay (ms)', c.autoplay_delay ?? 5000, (v) => onChange({ ...c, autoplay_delay: v }),
            { min: 1000, step: 500 }, 'autoplay_delay', syncCtx)
          : nothing}
      </div>
    `;
  }

}

ModuleRegistry.register(new SliderLayoutModule());
