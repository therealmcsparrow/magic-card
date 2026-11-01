import { LOAD_TIMEOUT_MS } from '../contracts/preset-transfer';
import { SHARE_KIT_VERSION } from '../contracts/share-kit';
import type { ShareKit, ShareKitHelpers } from '../contracts/share-kit';
import { t } from './i18n';
import { cleanSvg } from './kinds/icon';
import { note } from './types';

// The one import() of the share-kit chunk. Resolves undefined, never rejects (import failure, LOAD_TIMEOUT_MS,
// another major version); the next call tries again. The panel offers neither import nor export without it.

/** The helpers the chunk is handed once; it imports none of them. */
export const shareKitHelpers: ShareKitHelpers = {
  note,
  droppedKey: (item, path) => note('dropped_key', item, path, t('transfer.image-transfer-loader.key-is-not-a-preset-field-so-it-was-left', { key: path.slice(path.lastIndexOf('.') + 1) })),
  sanitizeIcon: (item, path, svg) => {
    const r = cleanSvg(item, svg);
    return { svg: r.ok ? r.markup : undefined, notes: r.notes.map((n) => ({ ...n, path })) };
  },
};

const MAJOR = SHARE_KIT_VERSION.split('.')[0];
let pending: Promise<ShareKit | undefined> | undefined;
let loaded: ShareKit | undefined;

/** The loaded kit, or undefined before it is loaded. */
export const shareKit = (): ShareKit | undefined => loaded;

export function loadShareKit(): Promise<ShareKit | undefined> {
  pending ??= Promise.race([
    import(/* webpackChunkName: "share-kit" */ '../share-kit/chunk').then((chunk) => chunk.createShareKit(shareKitHelpers)),
    new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), LOAD_TIMEOUT_MS)),
  ]).then(
    (kit) => {
      if (kit?.version.split('.')[0] === MAJOR) return (loaded = kit);
      pending = undefined;
      return undefined;
    },
    (err: unknown) => {
      pending = undefined;
      console.warn('Magic Card: share-kit not loaded', err);
      return undefined;
    },
  );
  return pending;
}

/** Tests: forget the loaded chunk. */
export function __resetShareKitForTests(): void {
  pending = undefined;
  loaded = undefined;
}
