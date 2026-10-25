import type { SvgImageApi } from '../contracts/svg-image';
import { onDemandChunks } from '../utils/lazy-chunks';

/*
 * The svg-image chunk's api, the one place library-image markup is sanitised, thumbnailed and cached. This chunk holds
 * no SVG sink and no sanitiser of its own; it reaches them through the card's chunk table.
 */

/** The api once its chunk is installed; undefined before that. */
export const imageApi = (): SvgImageApi | undefined => (onDemandChunks['svg-image'].module() as { api?: SvgImageApi } | undefined)?.api;

/** Loads the chunk (shared and memoised by the table). undefined when it cannot be loaded. */
export async function loadImageApi(): Promise<SvgImageApi | undefined> {
  try {
    return (await onDemandChunks['svg-image'].load()) ? imageApi() : undefined;
  } catch {
    return undefined;
  }
}
