import { LOAD_TIMEOUT_MS, TRANSFER_CHUNK, TRANSFER_CONTRACT_VERSION, type TransferChunk } from '../contracts/preset-transfer';

// The only importer of the transfer chunk; set as window.MagicCard.loadTransfer().

let importer = (): Promise<unknown> => import(/* webpackChunkName: "transfer" */ '../transfer/chunk');
let pending: Promise<TransferChunk> | undefined;

export function loadTransfer(): Promise<TransferChunk> {
  pending ??= new Promise<TransferChunk>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${TRANSFER_CHUNK} chunk: timed out`)), LOAD_TIMEOUT_MS);
    importer().then(
      (m) => {
        clearTimeout(timer);
        const api = (m as { TRANSFER?: TransferChunk }).TRANSFER;
        if (api && String(api.version).split('.')[0] === TRANSFER_CONTRACT_VERSION.split('.')[0]) resolve(api);
        else reject(new Error(`${TRANSFER_CHUNK} chunk: unsupported version ${String(api?.version)}`));
      },
      (e: unknown) => {
        clearTimeout(timer);
        reject(e instanceof Error ? e : new Error(String(e)));
      },
    );
  }).catch((e: unknown) => {
    pending = undefined;
    throw e;
  });
  return pending;
}

/** Tests: forget the memo; `load` replaces the import (restored when omitted). */
export function __setTransferImportForTests(load?: () => Promise<unknown>): void {
  pending = undefined;
  importer = load ?? (() => import(/* webpackChunkName: "transfer" */ '../transfer/chunk'));
}
