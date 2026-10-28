import { html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import type { UiWindowElement } from '../contracts/ui-kit';
import { t } from './i18n';

/** The focused element, looking through open shadow roots. */
export function deepActive(): HTMLElement | null {
  let a: Element | null = document.activeElement;
  while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement;
  return a && a !== document.body ? (a as HTMLElement) : null;
}

/** Opens the first closed <mc-ui-window> in a render root; it hands focus back to what had it (Esc, Cancel and a finished action all end there). */
export function openDialog(root: ParentNode): void {
  const w = root.querySelector<UiWindowElement>('mc-ui-window');
  if (!w || w.open) return;
  w.opener = deepActive() ?? undefined;
  w.show();
}

/** Closes the first open <mc-ui-window> in a render root. */
export function closeDialog(root: ParentNode): void {
  const w = root.querySelector<UiWindowElement>('mc-ui-window');
  if (w?.open) w.close('action');
}

/**
 * One window of the ui kit: title, body and a footer of buttons, movable, resizable and maximisable on a desktop. Phones get the bottom sheet (no grips), never a full screen.
 * `close` runs when the window closes (Esc, scrim, the X, Cancel). With `submit` the window sits inside a <form>, so a
 * submit button in the footer and Enter in a field both reach it.
 */
export function dialog(title: string, body: unknown, foot: unknown, close: () => void, submit?: (e: Event) => void, size: 's' | 'm' | 'l' | 'xl' = 'm'): TemplateResult {
  const win = html`<mc-ui-window variant="sheet" size=${size} heading=${title} closeLabel=${t('theme-editor.dialogs.close')} movable resizable maximizable moveLabel=${t('theme-editor.dialogs.move-window')} resizeLabel=${t('theme-editor.dialogs.resize-window')} maximizeLabel=${t('theme-editor.dialogs.maximise')} restoreLabel=${t('theme-editor.dialogs.restore-size')} @mc-window-close=${close}>
    <div class="dlg">${body}</div>
    ${foot === nothing ? nothing : html`<div slot="footer" class="foot">${foot}</div>`}
  </mc-ui-window>`;
  return submit ? html`<form class="dlg-form" @submit=${submit}>${win}</form>` : win;
}
