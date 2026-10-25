import type { TransferKind } from '../contracts/preset-transfer';
import { t } from './i18n';

/** "3 animations": the count with its noun, plural by locale. */
export function count(n: number, kind: TransferKind): string {
  switch (kind) {
    case 'animation':
      return t('{n, plural, one {# animation} other {# animations}}', { n });
    case 'theme':
      return t('{n, plural, one {# theme} other {# themes}}', { n });
    case 'shape':
      return t('{n, plural, one {# shape} other {# shapes}}', { n });
    case 'image':
      return t('{n, plural, one {# image} other {# images}}', { n });
    default:
      return t('{n, plural, one {# icon} other {# icons}}', { n });
  }
}
