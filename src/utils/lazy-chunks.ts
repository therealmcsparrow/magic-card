import type { LazyChunkModule, LazyChunkName, OnDemandChunkName } from '../contracts/lazy-module';
import { provideRuntimeChunk } from './anim-runtime-loader';
import type * as AnimChunk from '../anim-studio/anim-chunk';
import type * as FlowsChunk from '../card/flows-chunk';
import type * as ControlsChunk from '../modules/lazy/controls-chunk';
import { lazyChunk, type LazyChunkControl, type LazyImporter } from './lazy-chunk';
import { provideParticlesChunk } from './particles-loader';
import { provideShapeChunk } from './shape-custom-loader';
import { provideSvgIconChunk } from './svg-icon-loader';
import { provideSvgImageChunk } from './svg-image-loader';

type AnimModule = typeof AnimChunk;
type FlowsModule = typeof FlowsChunk;
type ControlsModule = typeof ControlsChunk;

/** The chunk table: one lazyChunk() per LazyChunkName with its literal import(); only the card bundle imports it. */

/**
 * flow-look is a child of `flows`: its import() sits in src/card/flows-chunk.ts. The importer calls it synchronously, so a
 * retry's `r=` reaches the request; it rejects while `flows` is not installed (load() below loads `flows` first).
 */
const viaFlows = <M extends LazyChunkModule>(pick: (f: FlowsModule) => () => Promise<M>) => (): Promise<M> => {
  const f = lazyChunks.flows.module() as FlowsModule | undefined;
  return f ? pick(f)() : Promise.reject(new Error('flows not installed'));
};
const afterFlows = <M extends LazyChunkModule>(c: LazyChunkControl<M>): LazyChunkControl<M> => ({
  ...c,
  load: () => lazyChunks.flows.load().then((ok) => ok && c.load()),
});

/**
 * slider-look is a child of `controls`: its import() sits in src/modules/lazy/controls-chunk.ts. The importer calls it synchronously,
 * so a retry's `r=` reaches the request; it rejects while `controls` is not installed (load() below loads `controls` first).
 */
const viaControls = <M extends LazyChunkModule>(pick: (c: ControlsModule) => () => Promise<M>) => (): Promise<M> => {
  const c = lazyChunks.controls.module() as ControlsModule | undefined;
  return c ? pick(c)() : Promise.reject(new Error('controls not installed'));
};
const afterControls = <M extends LazyChunkModule>(c: LazyChunkControl<M>): LazyChunkControl<M> => ({
  ...c,
  load: () => lazyChunks.controls.load().then((ok) => ok && c.load()),
});

export const lazyChunks: Record<LazyChunkName, LazyChunkControl> = {
  slider: lazyChunk('slider', () => import(/* webpackChunkName: "slider" */ '../modules/lazy/slider-chunk')),
  seasonal: lazyChunk('seasonal', () => import(/* webpackChunkName: "seasonal" */ '../card/seasonal-chunk')),
  markdown: lazyChunk('markdown', () => import(/* webpackChunkName: "markdown" */ '../modules/lazy/markdown-chunk')),
  'modules-extra': lazyChunk('modules-extra', () => import(/* webpackChunkName: "modules-extra" */ '../modules/lazy/extras-chunk')),
  // the flow resolver, line geometry, <mc-flows> and the card rules of a card with flows; the card reads it through src/card/flows-seam.ts
  flows: lazyChunk('flows', () => import(/* webpackChunkName: "flows" */ '../card/flows-chunk')),
  // the Pause motion button; the card reads it through src/card/pause-seam.ts
  pause: lazyChunk('pause', () => import(/* webpackChunkName: "pause" */ '../card/pause-chunk')),
  // the pop-up controller and the page's pop-up coordinator; the card and the editor read it through src/card/popup-seam.ts
  popup: lazyChunk('popup', () => import(/* webpackChunkName: "popup" */ '../card/popup-chunk')),
  // the views of the slider, spinbox, dropdown, light and gauge modules
  controls: lazyChunk('controls', () => import(/* webpackChunkName: "controls" */ '../modules/lazy/controls-chunk')),
  // <mc-ring>, <mc-shape> and <mc-value-bg>; the card renders their tags and reads nothing from the chunk
  decor: lazyChunk('decor', () => import(/* webpackChunkName: "decor" */ '../card/decor-chunk')),
  'flow-look': afterFlows(lazyChunk('flow-look', viaFlows((f) => f.importFlowLook))),
  'slider-look': afterControls(lazyChunk('slider-look', viaControls((c) => c.importSliderLook))),
  // the motion and refresh part of <mc-bg-stack> (the element itself is in magic-card.js)
  layers: lazyChunk('layers', () => import(/* webpackChunkName: "layers" */ '../layers/stack/chunk')),
  // icon source, <mc-svg-icon>, the SVG sanitiser and the mcu: library client; renderIcon reads it through svg-icon-loader.ts
  'svg-icon': lazyChunk('svg-icon', () => import(/* webpackChunkName: "svg-icon" */ '../icons/chunk')),
  // the animation resolve, compiler and model, the preset tables and the animation rules; the card reads it through src/utils/anim-seam.ts
  anim: lazyChunk('anim', () => import(/* webpackChunkName: "anim" */ '../anim-studio/anim-chunk')),
  // the template source and the template merge; the card reads it through src/card/templates-seam.ts
  templates: lazyChunk('templates', () => import(/* webpackChunkName: "templates" */ '../services/templates-chunk')),
};

/**
 * anim-runtime and particles are children of `anim`: their import()s sit in src/anim-studio/anim-chunk.ts.
 * The importer calls it synchronously (no await or .then first), so a retry's `r=` reaches the request;
 * it rejects while `anim` is not installed (the loader slots load `anim` first).
 */
const viaAnim = <M extends LazyChunkModule>(pick: (a: AnimModule) => () => Promise<M>) => (): Promise<M> => {
  const a = lazyChunks.anim.module() as AnimModule | undefined;
  return a ? pick(a)() : Promise.reject(new Error('anim not installed'));
};

/** The slot control of a child of `anim`: everything as is, but load() loads `anim` first and stays false when it fails. */
const afterAnim = <M extends LazyChunkModule>(c: LazyChunkControl<M>): LazyChunkControl<M> => ({
  ...c,
  load: () => lazyChunks.anim.load().then((ok) => ok && c.load()),
});

/** Chunks a render starts when it meets the need (not from the config alone). Their loaders: src/utils/*-loader.ts. */
export const onDemandChunks = {
  'anim-runtime': lazyChunk('anim-runtime', viaAnim((a) => a.importRuntime)),
  particles: lazyChunk('particles', viaAnim((a) => a.importParticles)),
  'shape-custom': lazyChunk('shape-custom', () => import(/* webpackChunkName: "shape-custom" */ './shape-custom')),
  'svg-image': lazyChunk('svg-image', () => import(/* webpackChunkName: "svg-image" */ '../svg-image/chunk')),
  // the connection and not-updated faces; a quiet chunk, so a failure shows no notice
  status: lazyChunk('status', () => import(/* webpackChunkName: "status" */ '../card-status/index'), { silent: true }),
};
provideRuntimeChunk(afterAnim(onDemandChunks['anim-runtime']));
provideParticlesChunk(afterAnim(onDemandChunks.particles));
provideShapeChunk(onDemandChunks['shape-custom']);
provideSvgIconChunk(lazyChunks['svg-icon']);
provideSvgImageChunk(onDemandChunks['svg-image']);

/** window.MagicCard.loadSeasonal: true once <mc-seasonal> and <mc-seasonal-deco> are defined. */
export const loadSeasonal = (): Promise<boolean> => lazyChunks.seasonal.load();

/** Tests: replace one chunk import (undefined restores it) and forget its state. */
export function __setLazyImporterForTests(name: LazyChunkName | OnDemandChunkName, importer: LazyImporter | undefined): void {
  (name in lazyChunks ? lazyChunks[name as LazyChunkName] : onDemandChunks[name as OnDemandChunkName]).__reset(importer as never);
}

/** Tests (vitest setup): load and install every chunk so renderPreview output stays synchronous. */
export async function __loadAllLazyChunksForTests(): Promise<void> {
  await Promise.all(Object.values(lazyChunks).map((c) => c.load()));
}
