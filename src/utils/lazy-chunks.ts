import type { LazyChunkModule, LazyChunkName, OnDemandChunkName } from '../contracts/lazy-module';
import { provideRuntimeChunk } from './anim-runtime-loader';
import type * as AnimChunk from '../anim-studio/anim-chunk';
import { lazyChunk, type LazyChunkControl, type LazyImporter } from './lazy-chunk';
import { provideParticlesChunk } from './particles-loader';
import { provideShapeChunk } from './shape-custom-loader';
import { provideSvgIconChunk } from './svg-icon-loader';

type AnimModule = typeof AnimChunk;

/*
 * The chunk table: one lazyChunk() per LazyChunkName, each with its literal import(), and the three chunks that load
 * on demand (the animation runtime, particles and the custom shape builder; no needs() row, because only the render
 * knows). Nothing else calls import() for these entries (contract lazy-module 1.4.0 "import() sites"). Output file
 * names come from the webpackChunkName: dist/magic-card-<name>.js.
 *
 * Only the card bundle imports this file. The three loaders (src/utils/*-loader.ts) get their chunk from a slot filled
 * at the end of this file instead of importing it: the animation studio bundle imports one of them, and this table
 * would pull every card chunk entry into that bundle's chunk graph (the studio and several chunks grew by 8 to 60 KB).
 */

export const lazyChunks: Record<LazyChunkName, LazyChunkControl> = {
  slider: lazyChunk('slider', () => import(/* webpackChunkName: "slider" */ '../modules/lazy/slider-chunk')),
  seasonal: lazyChunk('seasonal', () => import(/* webpackChunkName: "seasonal" */ '../card/seasonal-chunk')),
  markdown: lazyChunk('markdown', () => import(/* webpackChunkName: "markdown" */ '../modules/lazy/markdown-chunk')),
  'modules-extra': lazyChunk('modules-extra', () => import(/* webpackChunkName: "modules-extra" */ '../modules/lazy/extras-chunk')),
  'flow-look': lazyChunk('flow-look', () => import(/* webpackChunkName: "flow-look" */ '../flow-look/chunk')),
  'slider-look': lazyChunk('slider-look', () => import(/* webpackChunkName: "slider-look" */ '../slider-look/chunk')),
  // <mc-bg-stack>, the card backdrop
  layers: lazyChunk('layers', () => import(/* webpackChunkName: "layers" */ '../layers/stack/chunk')),
  // icon source, <mc-svg-icon>, the SVG sanitiser and the mcu: library client; renderIcon reads it through svg-icon-loader.ts
  'svg-icon': lazyChunk('svg-icon', () => import(/* webpackChunkName: "svg-icon" */ '../icons/chunk')),
  // the animation resolve, compiler and model, the preset tables and the animation rules; the card reads it through src/utils/anim-seam.ts
  anim: lazyChunk('anim', () => import(/* webpackChunkName: "anim" */ '../anim-studio/anim-chunk')),
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
};
provideRuntimeChunk(afterAnim(onDemandChunks['anim-runtime']));
provideParticlesChunk(afterAnim(onDemandChunks.particles));
provideShapeChunk(onDemandChunks['shape-custom']);
provideSvgIconChunk(lazyChunks['svg-icon']);

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
