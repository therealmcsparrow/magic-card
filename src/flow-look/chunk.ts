import { VERSION } from '../version';
import { flowLookSlot } from '../card/flow-look-slot';
import type { FlowLookRenderer } from '../contracts/flow-look';
import { FLOW_LOOK_CSS } from './css';
import './parts';
import { renderFlow, wanted } from './render';
import { resolveLook } from './resolve';

// Chunk entry of dist/magic-card-flow-look.js. Evaluating it changes nothing global: the renderer is provided in
// install(), which lazy-chunk.ts calls only when BUILD matches. Shapes, colour and ends plug in through flowLookRegistry
// and the list in ./parts.

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

export { flowLookRegistry } from './registry';
export type { FlowLookRegistry, LineCtx, StrokeSpec } from './registry';

export const renderer: FlowLookRenderer = {
  resolve: resolveLook,
  requested: wanted,
  render: renderFlow,
  css: FLOW_LOOK_CSS,
};

export function install(): void {
  flowLookSlot.provide(renderer);
}
