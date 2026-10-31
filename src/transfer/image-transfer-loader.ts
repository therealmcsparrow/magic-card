import { IMAGE_TRANSFER_REVISION, LOAD_TIMEOUT_MS } from '../contracts/preset-transfer';
import type { ImageTransfer, ImageTransferKit } from '../contracts/preset-transfer';
import { t } from './i18n';
import { slug, uniqueId } from './ids';
import { attributeWhat, elementWhat, removedNote } from './kinds/icon';
import { note } from './types';

/*
 * The one import() of the image-transfer chunk, together with the svg-image chunk whose api it
 * uses. Resolves undefined, never rejects (import failure, LOAD_TIMEOUT_MS, unknown revision);
 * the next call tries again.
 */

/** The helpers and shared messages the chunk is handed once; it imports none of them. */
export const imageTransferKit: ImageTransferKit = {
  note,
  droppedKey: (item, path) => note('dropped_key', item, path, t('transfer.image-transfer-loader.key-is-not-a-preset-field-so-it-was-left', { key: path.slice(path.lastIndexOf('.') + 1) })),
  removedNote,
  elementWhat,
  attributeWhat,
  slug,
  uniqueId,
};

let pending: Promise<ImageTransfer | undefined> | undefined;
let loaded: ImageTransfer | undefined;

/** The loaded image side, or undefined before it is loaded. */
export const imageTransfer = (): ImageTransfer | undefined => loaded;

export function loadImageTransfer(): Promise<ImageTransfer | undefined> {
  pending ??= Promise.race([
    Promise.all([import(/* webpackChunkName: "svg-image" */ '../svg-image/chunk'), import(/* webpackChunkName: "image-transfer" */ '../image-transfer/chunk')]).then(([images, chunk]) => chunk.createImageTransfer(images.api, imageTransferKit)),
    new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), LOAD_TIMEOUT_MS)),
  ]).then(
    (it) => {
      if (it?.revision === IMAGE_TRANSFER_REVISION) return (loaded = it);
      pending = undefined;
      return undefined;
    },
    (err: unknown) => {
      pending = undefined;
      console.warn('Magic Card: image transfer not loaded', err);
      return undefined;
    },
  );
  return pending;
}

/** Tests: forget the loaded chunk. */
export function __resetImageTransferForTests(): void {
  pending = undefined;
  loaded = undefined;
}
