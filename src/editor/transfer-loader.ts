import { LOAD_TIMEOUT_MS, TRANSFER_CHUNK, TRANSFER_CONTRACT_VERSION, type TransferChunk } from '../contracts/preset-transfer';

/*
 * The only importer of the transfer chunk (magic-card-transfer.js, preset-transfer 1.0.0). It lives in
 * the card-editor chunk, which sets it as window.MagicCard.loadTransfer() (src/editor/custom/loaders.ts),
 * so the theme editor and the animation studio reach the chunk without a new import() of their own and
 * js-yaml and the Core validators come from the parents. Memoised while pending and once loaded; rejects
 * on an import failure, after LOAD_TIMEOUT_MS, or when the chunk is not major 1. A rejection clears the
 * memo, so the next call retries.
 */

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
