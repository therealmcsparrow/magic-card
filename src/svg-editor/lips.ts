import type { PanelLipSpec, PanelLipStrings } from '../contracts/ui-kit';
import { t } from './i18n';

/** Ctrl on most systems, the command key on Apple ones. */
export function shortcutKeys(): string {
  return /Mac|iPhone|iPad/.test(navigator.platform || '') ? '⌘\\' : 'Ctrl+\\';
}

/** The lip of each side panel: a fixed name, a noun for announcements, and the tooltips. */
export function lipSpecs(): PanelLipSpec[] {
  const keys = shortcutKeys();
  const spec = (id: string, side: 'start' | 'end', name: string, noun: string): PanelLipSpec => ({
    id, side, controls: id, name, noun, hideLabel: t('svg-editor.lips.hide-noun-keys', { noun, keys }), showLabel: t('svg-editor.lips.show-noun-keys', { noun, keys }),
  });
  return [
    spec('side', 'start', t('svg-editor.lips.layers-and-library-panel'), t('svg-editor.lips.layers-and-library')),
    spec('inspector', 'end', t('svg-editor.lips.inspector-panel'), t('svg-editor.lips.inspector')),
  ];
}

export function lipStrings(locale: string): PanelLipStrings {
  const hintOne = t('svg-editor.lips.the-noun-panel-is-hidden-as-you-left-it', { noun: '{noun}' });
  return {
    locale,
    hidden: t('svg-editor.lips.panels-hidden', { panels: '{panels}' }),
    shown: t('svg-editor.lips.panels-shown', { panels: '{panels}' }),
    hintOne,
    hintMany: t('svg-editor.lips.some-panels-are-hidden-as-you-left-them'),
    hintMigrated: hintOne,
    hintShortcut: t('svg-editor.lips.shortcut-keys', { keys: shortcutKeys() }),
    gotIt: t('svg-editor.lips.got-it'),
  };
}
