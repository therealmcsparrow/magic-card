import type { PanelLipSpec, PanelLipStrings } from '../contracts/ui-kit';
import { t } from './i18n';

/** Ctrl+\ on most systems, the command key on Apple ones. */
function shortcutKeys(): string {
  return /Mac|iPhone|iPad/.test(navigator.platform || '') ? '⌘\\' : 'Ctrl+\\';
}

/** The lip of the Variables pane: fixed name, noun for announcements, and the tooltips. */
export function lipSpecs(): PanelLipSpec[] {
  const keys = shortcutKeys();
  return [
    {
      id: 'variables',
      side: 'start',
      controls: 'vars-pane',
      name: t('Variables panel'),
      noun: t('variables'),
      hideLabel: t('Hide {noun} ({keys})', { noun: t('variables'), keys }),
      showLabel: t('Show {noun} ({keys})', { noun: t('variables'), keys }),
    },
  ];
}

export function lipStrings(language: string): PanelLipStrings {
  const hint = t('The {noun} panel is hidden, as you left it. Use the arrow on the edge to show it.', { noun: '{noun}' });
  return {
    locale: language,
    hidden: t('{panels} hidden', { panels: '{panels}' }),
    shown: t('{panels} shown', { panels: '{panels}' }),
    hintOne: hint,
    hintMany: hint,
    hintMigrated: hint,
    hintShortcut: t('Shortcut: {keys}', { keys: shortcutKeys() }),
    gotIt: t('Got it'),
  };
}
