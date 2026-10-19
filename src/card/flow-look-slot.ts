import type { FlowLookRenderer, FlowLookSlot } from '../contracts/flow-look';

/*
 * The flow-look slot (contract flow-look 1.0.0): empty until the flow-look chunk's install() provides
 * its renderer. resolveFlow and mc-flows read get(); empty means the classic look.
 */

let renderer: FlowLookRenderer | undefined;

export const flowLookSlot: FlowLookSlot = {
  provide(r) {
    renderer = r;
  },
  get: () => renderer,
};
