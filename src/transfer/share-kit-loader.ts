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

/** The notice texts, from the same chunk as the kit; undefined when they do not load. */
export const loadNotice = (): Promise<typeof import('../share-kit/notice') | undefined> => import(/* webpackChunkName: "share-kit" */ '../share-kit/notice').catch(() => undefined);

/** The mapping step, from the same chunk; undefined when it does not load. */
export const loadMapping = (): Promise<typeof import('../share-kit/mapping') | undefined> => import(/* webpackChunkName: "share-kit" */ '../share-kit/mapping').catch(() => undefined);

/** The mapping step on a saved item (defines <mc-map-entities>), from the same chunk; false when it does not load. */
export const loadMapStep = (): Promise<boolean> => import(/* webpackChunkName: "share-kit" */ '../share-kit/map-step').then(() => true, () => false);

/** The contrast check of an imported theme, from the same chunk; undefined when it does not load. */
export const loadThemeCheck = (): Promise<typeof import('../share-kit/theme-check') | undefined> => import(/* webpackChunkName: "share-kit" */ '../share-kit/theme-check').catch(() => undefined);

/** The animation preview (defines <mc-anim-preview>), from the same chunk; false when it does not load. */
export const loadAnimPreview = (): Promise<boolean> => import(/* webpackChunkName: "share-kit" */ '../share-kit/anim-preview').then(() => true, () => false);

/** Tests: forget the loaded chunk. */
export function __resetShareKitForTests(): void {
  pending = undefined;
  loaded = undefined;
}
