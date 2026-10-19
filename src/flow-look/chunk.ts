import { VERSION } from '../version';
import { flowLookSlot } from '../card/flow-look-slot';
import type { FlowLookRenderer } from '../contracts/flow-look';
import { FLOW_LOOK_CSS } from './css';
import './parts';
import { renderFlow, wanted } from './render';
import { resolveLook } from './resolve';

/*
 * Chunk entry of dist/magic-card-flow-look.js (contracts lazy-module 1.2.0, flow-look 1.0.0). Evaluating
 * this file changes nothing global: the renderer is provided to the slot in install(), which
 * src/utils/lazy-chunk.ts calls only when BUILD matches the magic-card.js that loaded it (AC13).
 * T3 fills the slot with the line styles; T4 (shapes) and T5 (colour, ends) plug in through
 * flowLookRegistry (re-exported here) and the list in ./parts.
 */

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
