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
      name: t('theme-editor.lips.variables-panel'),
      noun: t('theme-editor.lips.variables'),
      hideLabel: t('theme-editor.lips.hide-noun-keys', { noun: t('theme-editor.lips.variables'), keys }),
      showLabel: t('theme-editor.lips.show-noun-keys', { noun: t('theme-editor.lips.variables'), keys }),
    },
  ];
}

export function lipStrings(language: string): PanelLipStrings {
  const hint = t('theme-editor.lips.the-noun-panel-is-hidden-as-you-left-it', { noun: '{noun}' });
  return {
    locale: language,
    hidden: t('theme-editor.lips.panels-hidden', { panels: '{panels}' }),
    shown: t('theme-editor.lips.panels-shown', { panels: '{panels}' }),
    hintOne: hint,
    hintMany: hint,
    hintMigrated: hint,
    hintShortcut: t('theme-editor.lips.shortcut-keys', { keys: shortcutKeys() }),
    gotIt: t('theme-editor.lips.got-it'),
  };
}
