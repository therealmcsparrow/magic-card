import { BUILD_VERSION } from '../utils/build-version';
import { McFlows } from './mc-flows';
import { resolveCardFlows } from './flows-resolve';

/** Chunk entry of dist/magic-card-flows.js: flow resolver, line geometry and <mc-flows>. */

export const BUILD: string = BUILD_VERSION;

/** The card-side rules of a card with flows; Core adopts them with the chunk. */
export { flowsCardStyles as styles } from './flows-css';

/** What the card calls into (a plain object, so the entry never imports this file at run time). */
export const api = { resolveCardFlows } as const;

export type FlowsApi = typeof api;

export function install(): void {
  if (!customElements.get('mc-flows')) customElements.define('mc-flows', McFlows);
}

/** Only returns the import() promise: the chunk table calls it in the same synchronous call as its retry. */
export const importFlowLook = () => import(/* webpackChunkName: "flow-look" */ '../flow-look/chunk');
