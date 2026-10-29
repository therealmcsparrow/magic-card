import { html, nothing, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import type { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, SliderLayoutModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { renderChildModule, renderEmptySlot, visibleChildren } from '../render-module';
import { currentRenderContext } from '../../services/render-context';
import { generateId } from '../../utils/id-generator';
import { lazyChunks } from '../../utils/lazy-chunks';
import type { McSwiperOptions } from './mc-swiper';
import { t } from '../../card/i18n';

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
  // the editor chunk adds name, description, category and icon (src/editor/modules/lazy-metadata.ts)
  readonly metadata = { type: 'slider-layout' } as MagicModuleMetadata;

  createDefault(): SliderLayoutModuleConfig {
    return {
      id: generateId('slider-layout'),
      type: 'slider-layout',
      modules: [],
      pagination: true,
      navigation: true,
    };
  }

  /** Unused: renderPreview works at once; `<mc-swiper>` upgrades in place when the chunk is defined. */
  placeholder(config: CardModule): TemplateResult {
    return this.renderPreview(config);
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as SliderLayoutModuleConfig;
    const children = c.modules || [];
    if (!children.length) {
      return html`<div class="mc-module mc-slider-layout">${renderEmptySlot(t('card.slider-layout-module.empty-slider'))}</div>`;
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
            <button type="button" class="mc-slider-nav mc-slider-prev" @pointerdown=${stop} @pointerup=${stop} @keydown=${stop} aria-label=${t('card.slider-layout-module.previous-slide')}>
              <ha-icon icon="mdi:chevron-left"></ha-icon>
            </button>
            <button type="button" class="mc-slider-nav mc-slider-next" @pointerdown=${stop} @pointerup=${stop} @keydown=${stop} aria-label=${t('card.slider-layout-module.next-slide')}>
              <ha-icon icon="mdi:chevron-right"></ha-icon>
            </button>`
          : nothing}
        ${options.pagination ? html`<div class="mc-slider-pagination" @pointerdown=${stop} @pointerup=${stop} @keydown=${stop}></div>` : nothing}
      </mc-swiper>
    `;
  }
}

ModuleRegistry.registerLazy(new SliderLayoutModule(), lazyChunks.slider);
