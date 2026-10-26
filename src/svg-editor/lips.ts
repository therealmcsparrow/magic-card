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
    id, side, controls: id, name, noun, hideLabel: t('Hide {noun} ({keys})', { noun, keys }), showLabel: t('Show {noun} ({keys})', { noun, keys }),
  });
  return [
    spec('side', 'start', t('Layers and library panel'), t('layers and library')),
    spec('inspector', 'end', t('Inspector panel'), t('inspector')),
  ];
}

export function lipStrings(locale: string): PanelLipStrings {
  const hintOne = t('The {noun} panel is hidden, as you left it. Use the arrow on the edge to show it.', { noun: '{noun}' });
  return {
    locale,
    hidden: t('{panels} hidden', { panels: '{panels}' }),
    shown: t('{panels} shown', { panels: '{panels}' }),
    hintOne,
    hintMany: t('Some panels are hidden, as you left them. Use the arrows on the edges to show them.'),
    hintMigrated: hintOne,
    hintShortcut: t('Shortcut: {keys}', { keys: shortcutKeys() }),
    gotIt: t('Got it'),
  };
}

/**
 * Where the lips sit, in the working area's own pixels. A hidden panel's lip lies in its 40 px gutter, at the
 * rail's edge or the window edge (a touch screen's longer hit area is pulled back so it stays out of the stage);
 * a shown one sits inside its panel at the inner edge, clear of the panel's scrollbar and of the stage.
 */
export function lipTokens(side: 'shown' | 'hidden' | 'off', insp: 'shown' | 'hidden' | 'off', bar: number): string {
  const start = side === 'hidden' ? 'calc(56px - var(--lg))' : `calc(56px + var(--lw) - 24px - var(--lx) - ${bar}px - 1px)`;
  const end = insp === 'hidden' ? 'calc(0px - var(--lg))' : 'calc(var(--iw) - 24px - var(--lx) - 1px)';
  return `--mc-lip-at-start: ${start}; --mc-lip-at-end: ${end}`;
}
