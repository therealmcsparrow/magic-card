import type { OpenImageAnimator } from '../contracts/image-animator';
import { loadImageAnimator } from '../image-animator/loader';

// The library image field's way into the image animator: loads the chunk on the first click and opens the window.

/** Resolves true once the window is shown, false when the chunk did not load or there is no connection to the library. */
export const openImageAnimator: OpenImageAnimator = async (host, source) => {
  const api = await loadImageAnimator();
  return api ? api.openImageAnimator(host, source) : false;
};
