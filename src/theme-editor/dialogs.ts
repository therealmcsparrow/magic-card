import { html } from 'lit';
import type { TemplateResult } from 'lit';

/** The focused element, looking through open shadow roots. */
export function deepActive(): HTMLElement | null {
  let a: Element | null = document.activeElement;
  while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement;
  return a && a !== document.body ? (a as HTMLElement) : null;
}

let opener: HTMLElement | null = null;

/** Gives focus back to what opened the dialog (Esc, Cancel and a finished action all end here). */
function restoreFocus(): void {
  const o = opener;
  if (!o) return;
  const back = (): void => {
    if (o.isConnected) o.focus({ preventScroll: true });
  };
  back();
  queueMicrotask(back);
}

/** Opens the first closed <dialog> in a render root as a modal (falls back to `open` where showModal is missing). */
export function openDialog(root: ParentNode): void {
  const d = root.querySelector<HTMLDialogElement>('dialog:not([open])');
  if (!d) return;
  opener = deepActive();
  if (typeof d.showModal === 'function') d.showModal();
  else d.setAttribute('open', '');
}

/** Closes the first open <dialog> in a render root. */
export function closeDialog(root: ParentNode): void {
  const d = root.querySelector<HTMLDialogElement>('dialog[open]');
  if (d && typeof d.close === 'function') d.close();
}

/** One modal: title, body and a footer of buttons, labelled by its title. `close` runs on Esc and on `close`. */
export function dialog(title: string, body: unknown, foot: unknown, close: () => void, submit?: (e: Event) => void): TemplateResult {
  const inner = html`<h2 id="t">${title}</h2>${body}<div class="foot">${foot}</div>`;
  const done = (): void => (close(), restoreFocus());
  return html`<dialog aria-labelledby="t" @close=${done} @cancel=${done}>
    ${submit ? html`<form class="dlg" @submit=${submit}>${inner}</form>` : html`<div class="dlg">${inner}</div>`}
  </dialog>`;
}
