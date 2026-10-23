import type { CardModule } from '../types';
import { t } from './i18n';

/** Name of a slot as the editor shows it ("Column 2", the tab's own label, or "Tab 2"); undefined for flat layouts. */
export function slotLabel(mod: CardModule, slot: number): string | undefined {
  if (mod.type === 'row') return t('Column {n}', { n: slot + 1 });
  if (mod.type === 'tabs') {
    const tab = (mod as { tabs?: Array<{ label?: string }> }).tabs?.[slot];
    return tab?.label?.trim() || t('Tab {n}', { n: slot + 1 });
  }
  return undefined;
}
