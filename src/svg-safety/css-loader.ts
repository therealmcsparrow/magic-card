import { SVG_CSS_LOAD_TIMEOUT_MS, type LoadSvgCss, type SvgCssResolve } from '../contracts/svg-safety';

declare const __MC_BUILD_VERSION__: string | undefined;

/*
 * The one import() of the svg-css chunk. A sanitiser never calls this: an editor that opens or imports an SVG awaits it and
 * passes the resolver to the sanitiser as the `css` option. A chunk that fails to load, takes longer than
 * SVG_CSS_LOAD_TIMEOUT_MS or comes from another release gives undefined and one console warning; the sanitiser then drops
 * styles as it does without a resolver. Nothing is kept between calls (webpack serves a loaded chunk from its own cache).
 */

const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : '';

export const loadSvgCss: LoadSvgCss = async (): Promise<SvgCssResolve | undefined> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const chunk = await Promise.race([
      import(/* webpackChunkName: "svg-css" */ './css-chunk'),
      new Promise<undefined>((resolve) => {
        timer = setTimeout(resolve, SVG_CSS_LOAD_TIMEOUT_MS, undefined);
      }),
    ]);
    if (!chunk) {
      console.warn('Magic Card: magic-card-svg-css.js did not load');
      return undefined;
    }
    if (chunk.BUILD !== BUILD) {
      console.warn('Magic Card was updated, reload the page (magic-card-svg-css.js)');
      return undefined;
    }
    return chunk.resolveCss;
  } catch {
    console.warn('Magic Card: magic-card-svg-css.js did not load');
    return undefined;
  } finally {
    clearTimeout(timer);
  }
};
