import type { SliderLookSlot, SliderLookView } from '../../contracts/slider-look';

/*
 * The slider-look slot (contract slider-look 1.0.0): empty until the slider-look chunk's install()
 * provides its view. The slider module reads get(); empty means the classic slider.
 */

let view: SliderLookView | undefined;

export const sliderLookSlot: SliderLookSlot = {
  provide(v) {
    view = v;
  },
  get: () => view,
};
