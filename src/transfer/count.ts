import type { TransferKind } from '../contracts/preset-transfer';
import { t } from './i18n';

/** "3 animations": the count with its noun, plural by locale. */
export function count(n: number, kind: TransferKind): string {
  switch (kind) {
    case 'animation':
      return t('transfer.count.n', { n });
    case 'theme':
      return t('transfer.count.n-2', { n });
    case 'shape':
      return t('transfer.count.n-3', { n });
    case 'image':
      return t('transfer.count.n-4', { n });
    default:
      return t('transfer.count.n-5', { n });
  }
}
