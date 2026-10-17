import { html } from 'lit';
import type { TemplateResult } from 'lit';

/** Opens the first closed <dialog> in a render root as a modal (falls back to `open` where showModal is missing). */
export function openDialog(root: ParentNode): void {
  const d = root.querySelector<HTMLDialogElement>('dialog:not([open])');
  if (!d) return;
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
  return html`<dialog aria-labelledby="t" @close=${close} @cancel=${close}>
    ${submit ? html`<form class="dlg" @submit=${submit}>${inner}</form>` : html`<div class="dlg">${inner}</div>`}
  </dialog>`;
}
