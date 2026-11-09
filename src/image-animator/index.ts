import { VERSION } from '../version';
import { IMAGE_ANIMATOR_CONTRACT, IMAGE_ANIMATOR_TAG, type ImageAnimatorApi, type OpenImageAnimator } from '../contracts/image-animator';
import { McImageAnimator } from './mc-image-animator';

// Chunk entry of dist/magic-card-image-animator.js (contract image-animator 1.0.0).

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

export function install(): void {
  if (!customElements.get(IMAGE_ANIMATOR_TAG)) customElements.define(IMAGE_ANIMATOR_TAG, McImageAnimator);
}

/** Mounts the window in the root of `host`; resolves once it is shown, false when there is no connection to the library. */
export const openImageAnimator: OpenImageAnimator = async (host, source) => {
  if (!host.hass) return false;
  install();
  const el = document.createElement(IMAGE_ANIMATOR_TAG) as McImageAnimator;
  el.hass = host.hass;
  el.source = source;
  el.opener = host;
  const root = host.getRootNode();
  const parent: Node = root instanceof ShadowRoot ? root : document.body;
  el.addEventListener('close', () => {
    el.remove();
    host.focus?.();
  });
  parent.appendChild(el);
  await el.updateComplete;
  return true;
};

/** What the image-animator chunk exports as `api`. Counting the cards that use an image is added by its own change. */
export const api: Omit<ImageAnimatorApi, 'countImageUse'> & { version: typeof IMAGE_ANIMATOR_CONTRACT } = { version: IMAGE_ANIMATOR_CONTRACT, openImageAnimator };
