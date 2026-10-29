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

/** "Export 3 animations": one message per kind, so each plural keeps its own noun. */
export function exportLabel(n: number, kind: TransferKind): string {
  switch (kind) {
    case 'animation':
      return t('transfer.panel.export-animations', { n });
    case 'theme':
      return t('transfer.panel.export-themes', { n });
    case 'shape':
      return t('transfer.panel.export-shapes', { n });
    case 'image':
      return t('transfer.panel.export-images', { n });
    default:
      return t('transfer.panel.export-icons', { n });
  }
}

/** "Import 3 animations". */
export function importLabel(n: number, kind: TransferKind): string {
  switch (kind) {
    case 'animation':
      return t('transfer.panel.import-animations', { n });
    case 'theme':
      return t('transfer.panel.import-themes', { n });
    case 'shape':
      return t('transfer.panel.import-shapes', { n });
    case 'image':
      return t('transfer.panel.import-images', { n });
    default:
      return t('transfer.panel.import-icons', { n });
  }
}

/** "file.yaml holds 3 animations." */
export function sourceHolds(source: string, n: number, kind: TransferKind): string {
  switch (kind) {
    case 'animation':
      return t('transfer.panel.source-holds-animations', { source, n });
    case 'theme':
      return t('transfer.panel.source-holds-themes', { source, n });
    case 'shape':
      return t('transfer.panel.source-holds-shapes', { source, n });
    case 'image':
      return t('transfer.panel.source-holds-images', { source, n });
    default:
      return t('transfer.panel.source-holds-icons', { source, n });
  }
}
