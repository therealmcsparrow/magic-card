import { TRANSFER_CONTRACT_VERSION } from '../contracts/preset-transfer';
import type { TransferChunk } from '../contracts/preset-transfer';
import { haThemeYaml, parseTransfer, resolveClashes, serialiseTransfer } from './envelope';
import './panel';
import './library-view';

/*
 * Root of the transfer chunk (dist/magic-card-transfer.js, preset-transfer 1.0.0). Only
 * src/editor/transfer-loader.ts imports it. js-yaml, sanitizeSvg, the animation model and validators
 * and the custom-shape code come from the parents (magic-card.js, the editor chunk); nothing here may
 * import src/theme-editor/**.
 */
export const TRANSFER: TransferChunk = {
  version: TRANSFER_CONTRACT_VERSION,
  parseTransfer,
  serialiseTransfer,
  haThemeYaml,
  resolveClashes,
  tags: { panel: 'mc-transfer-panel', library: 'mc-library-view' },
};
