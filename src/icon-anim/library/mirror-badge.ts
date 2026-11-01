// The text label of an icon's mirror flag, for the studio icon list.
import type { MirrorFlag } from '../../contracts/icon-library';
import { t } from './i18n';

/** The label for a flag, and whether the flag is not set (the studio highlights those). */
export function mirrorBadge(flag?: MirrorFlag): { label: string; unset: boolean } {
  if (flag === 'mirror') return { label: t('icon-library.mirror-badge.mirrors'), unset: false };
  if (flag === 'keep') return { label: t('icon-library.mirror-badge.keeps'), unset: false };
  return { label: t('icon-library.mirror-badge.not-set'), unset: true };
}
