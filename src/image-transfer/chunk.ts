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

const text: ImageTransfer['text'] = (key, args) => {
  switch (key) {
    case 'export_all':
      return t('Export all images');
    case 'new':
      return t('New image');
    case 'view':
      return t('View {name}', args);
    case 'duplicate':
      return t('Duplicate {name}', args);
    case 'copy_label':
      return t('Name for the copy of {name}', args);
    case 'copy_name':
      return t('{name} copy', args);
    case 'create_copy':
      return t('Create copy');
    case 'delete_confirm':
      return t('Delete {name}? Cards that use it show that the image is missing. This cannot be undone.', args);
    default:
      return t('Duplicated as {name}.', args);
  }
};

const row = (s: ImageSummary): { thumb?: string; meta: string } => ({
  ...(s.thumb && THUMB_RE.test(s.thumb) ? { thumb: s.thumb } : {}),
  meta: [t('{n} KB', { n: Math.max(1, Math.round(s.bytes / 1024)) }), s.bindings ? t('{n, plural, one {# connection} other {# connections}}', { n: s.bindings }) : ''].filter(Boolean).join(' · '),
});

export const createImageTransfer: CreateImageTransfer = (api, kit) => ({
  revision: IMAGE_TRANSFER_REVISION,
  readImage: (index, data, options) => readImage(api, kit, index, data, options),
  ...imageCommands(api, kit),
  row,
  text,
});
