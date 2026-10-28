import { THUMB_RE } from '../contracts/mcu-library-images';
import type { ImageSummary } from '../contracts/mcu-library-images';
import { IMAGE_TRANSFER_REVISION } from '../contracts/preset-transfer';
import type { CreateImageTransfer, ImageTransfer } from '../contracts/preset-transfer';
import { imageCommands } from './commands';
import { t } from './i18n';
import { readImage } from './reader';

/*
 * Chunk entry of dist/magic-card-image-transfer.js (contract preset-transfer 1.2.0, "The image-transfer chunk"). The
 * image side of the transfer panel and the library view: the reader of image files, the images_* calls, the row text
 * and the image-only words. It holds no SVG sink; thumbnails come from the svg-image api it is given.
 */

type NameArgs = { name: string | number };

const text: ImageTransfer['text'] = (key, args) => {
  switch (key) {
    case 'export_all':
      return t('image-transfer.chunk.export-all-images');
    case 'new':
      return t('image-transfer.chunk.new-image');
    case 'view':
      return t('image-transfer.chunk.view-name', args as NameArgs);
    case 'duplicate':
      return t('image-transfer.chunk.duplicate-name', args as NameArgs);
    case 'copy_label':
      return t('image-transfer.chunk.name-for-the-copy-of-name', args as NameArgs);
    case 'copy_name':
      return t('image-transfer.chunk.name-copy', args as NameArgs);
    case 'create_copy':
      return t('image-transfer.chunk.create-copy');
    case 'delete_confirm':
      return t('image-transfer.chunk.delete-name-cards-that-use-it-show-that', args as NameArgs);
    default:
      return t('image-transfer.chunk.duplicated-as-name', args as NameArgs);
  }
};

const row = (s: ImageSummary): { thumb?: string; meta: string } => ({
  ...(s.thumb && THUMB_RE.test(s.thumb) ? { thumb: s.thumb } : {}),
  meta: [t('image-transfer.chunk.n-kb', { n: Math.max(1, Math.round(s.bytes / 1024)) }), s.bindings ? t('image-transfer.chunk.n', { n: s.bindings }) : ''].filter(Boolean).join(' · '),
});

export const createImageTransfer: CreateImageTransfer = (api, kit) => ({
  revision: IMAGE_TRANSFER_REVISION,
  readImage: (index, data, options) => readImage(api, kit, index, data, options),
  ...imageCommands(api, kit),
  row,
  text,
});
