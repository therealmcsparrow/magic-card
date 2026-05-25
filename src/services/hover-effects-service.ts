import { DesignConfig } from '../types';
import { designToStyle } from '../utils/css-utils';

export class HoverEffectsService {
  private static activeElements = new Map<HTMLElement, { enter: () => void; leave: () => void }>();

  static apply(element: HTMLElement, design?: DesignConfig): () => void {
    if (!design?.hover) return () => {};

    const hoverStyle = designToStyle(design.hover as DesignConfig);
    const originalStyle = element.getAttribute('style') || '';

    const handlers = {
      enter: () => {
        element.setAttribute('style', `${originalStyle}; ${hoverStyle}`);
      },
      leave: () => {
        element.setAttribute('style', originalStyle);
      },
    };

    element.addEventListener('mouseenter', handlers.enter);
    element.addEventListener('mouseleave', handlers.leave);
    this.activeElements.set(element, handlers);

    return () => {
      element.removeEventListener('mouseenter', handlers.enter);
      element.removeEventListener('mouseleave', handlers.leave);
      this.activeElements.delete(element);
    };
  }

  static removeAll(): void {
    this.activeElements.forEach((handlers, element) => {
      element.removeEventListener('mouseenter', handlers.enter);
      element.removeEventListener('mouseleave', handlers.leave);
    });
    this.activeElements.clear();
  }
}
