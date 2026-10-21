import Swiper from 'swiper';
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
import { TAP_MOVE_TOLERANCE_PX } from '../../utils/constants';

/** What the slider-layout module asks of the slider (see SliderLayoutModuleConfig). */
export interface McSwiperOptions {
  slidesPerView: number | 'auto';
  spaceBetween: number;
  rewind: boolean;
  pagination: boolean;
  navigation: boolean;
  /** Autoplay delay in ms; 0 = off. */
  autoplay: number;
  /** Studio canvas: no dragging (clicks select modules), no autoplay. */
  editMode: boolean;
}

/**
 * Light-DOM host of one Swiper instance. Its children (`.swiper > .swiper-wrapper > .swiper-slide`,
 * pagination, prev / next buttons) are rendered by Lit inside the card's shadow root, so the card's
 * styles and module pipeline apply to every slide; this element only creates, updates and destroys
 * the Swiper instance (on connect / option change / disconnect). Slide changes made by Lit are picked
 * up by Swiper's mutation observer.
 */
export class McSwiper extends HTMLElement {
  private _options?: McSwiperOptions;
  private _swiper?: Swiper;
  private _initQueued = false;
  private _activeIndex?: number;

  constructor() {
    super();
    // Upgrade in place: Lit set `options` / `activeIndex` as own properties before this class was
    // defined (the chunk loads after the first render); re-set them through the accessors.
    for (const key of ['options', 'activeIndex'] as const) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        const value = (this as unknown as Record<string, unknown>)[key];
        delete (this as unknown as Record<string, unknown>)[key];
        (this as unknown as Record<string, unknown>)[key] = value;
      }
    }
  }

  get options(): McSwiperOptions | undefined {
    return this._options;
  }

  set options(value: McSwiperOptions | undefined) {
    const changed = JSON.stringify(value) !== JSON.stringify(this._options);
    this._options = value;
    if (!changed) return;
    this._destroy();
    this._queueInit();
  }

  /** Slide to show (studio: the slide holding the selected module); undefined leaves the slider alone. */
  get activeIndex(): number | undefined {
    return this._activeIndex;
  }

  set activeIndex(value: number | undefined) {
    this._activeIndex = value;
    if (value !== undefined && this._swiper && this._swiper.activeIndex !== value) this._swiper.slideTo(value, 0);
  }

  /** The Swiper instance (tests, debugging). */
  get swiper(): Swiper | undefined {
    return this._swiper;
  }

  connectedCallback(): void {
    this._queueInit();
  }

  disconnectedCallback(): void {
    this._destroy();
  }

  private _queueInit(): void {
    if (this._initQueued || !this.isConnected) return;
    this._initQueued = true;
    // After the Lit render that created / updated the slides has been committed.
    queueMicrotask(() => {
      this._initQueued = false;
      this._init();
    });
  }

  private _init(): void {
    const o = this._options;
    const container = this.querySelector<HTMLElement>(':scope > .swiper');
    if (!o || !container || this._swiper || !this.isConnected) return;
    const paginationEl = o.pagination ? this.querySelector<HTMLElement>(':scope > .mc-slider-pagination') : null;
    const nextEl = o.navigation ? this.querySelector<HTMLElement>(':scope > .mc-slider-next') : null;
    const prevEl = o.navigation ? this.querySelector<HTMLElement>(':scope > .mc-slider-prev') : null;
    const config: SwiperOptions = {
      modules: [Navigation, Pagination, Autoplay, A11y],
      slidesPerView: o.slidesPerView,
      spaceBetween: o.spaceBetween,
      rewind: o.rewind,
      // Lit owns the slide elements: Swiper must never clone or move them (no `loop`).
      loop: false,
      observer: true,
      observeSlideChildren: true,
      allowTouchMove: !o.editMode,
      // a slide's tap tolerance: a smaller move is a tap on the module, a larger one drags the slider
      threshold: TAP_MOVE_TOLERANCE_PX,
      initialSlide: this._activeIndex ?? 0,
      pagination: paginationEl ? { el: paginationEl, clickable: !o.editMode } : false,
      navigation: nextEl && prevEl ? { nextEl, prevEl } : false,
      autoplay: o.autoplay > 0 && !o.editMode
        ? { delay: o.autoplay, disableOnInteraction: false, pauseOnMouseEnter: true }
        : false,
      // The arrows are native <button>s: A11y adds no Enter / Space handler of its own to them (only to
      // non-buttons), so a key press is the button's one click -> one slide. Its live region is
      // visually hidden by the card styles (.swiper-notification).
      a11y: { enabled: true },
    };
    try {
      this._swiper = new Swiper(container, config);
    } catch (err) {
      console.warn('Magic Card: slider failed to start', err);
    }
  }

  private _destroy(): void {
    if (!this._swiper) return;
    try {
      this._swiper.destroy(true, true);
    } catch {
      // already torn down with its elements
    }
    this._swiper = undefined;
  }
}

/** Called by the slider chunk's install(); evaluating this file defines nothing. */
export function defineSwiper(): void {
  if (!customElements.get('mc-swiper')) customElements.define('mc-swiper', McSwiper);
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-swiper': McSwiper;
  }
}
