/*
 * Shows a full-screen editor element (<mc-svg-editor>, <mc-shape-studio>) in the browser's top layer.
 * Home Assistant's card dialog has a transform and clips overflow, so a `position: fixed` layer inside
 * it would cover the dialog, not the screen (the reason pickers use showModal() too, picker-parts.ts).
 * The layer lives on <body>: it stays when the form behind it re-renders. A modal <dialog> makes the
 * page behind it inert and keeps focus inside.
 *
 * Escape (svg-editor 1.0.0 shell rules): the editors stop Escape themselves while focus is inside their
 * shadow DOM. Focus can also sit on the editor element, the dialog or the page (the editor is still
 * loading, or a click landed on nothing focusable). There the key would travel on to Home Assistant's
 * own document-level key handling and its card dialog behind the layer would close (found in HA
 * 2026.10.2: its dialog is a wa-dialog that closes on the key, not only on the browser's cancel). So
 * the layer stops Escape twice: on the dialog (bubble, for the editor element and the dialog as
 * target) and on the window (capture, for any target outside the layer). The dialog's own `cancel` is
 * ignored too. The editor element takes focus on open (tabindex -1).
 */

const STYLE =
  'padding:0;border:0;margin:0;width:100vw;height:100vh;max-width:none;max-height:none;background:transparent;color:inherit;overflow:visible;';

/** Mount `el` in the top layer; returns the function that removes it. */
export function openLayer(el: HTMLElement): () => void {
  const dlg = document.createElement('dialog');
  dlg.className = 'mc-editor-layer';
  dlg.style.cssText = STYLE;
  dlg.addEventListener('cancel', (e) => e.preventDefault());
  const stop = (e: KeyboardEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  };
  // bubble on the dialog: the editor's own handlers (inside its shadow DOM) have run and stop the key themselves
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') stop(e);
  });
  // capture on the window: a key whose target is outside the layer never reaches anything else
  const onKey = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape' || e.composedPath().includes(dlg)) return;
    stop(e);
    e.stopImmediatePropagation();
  };
  window.addEventListener('keydown', onKey, true);
  el.tabIndex = -1;
  dlg.append(el);
  document.body.append(dlg);
  if (typeof dlg.showModal === 'function') {
    try {
      dlg.showModal();
    } catch {
      dlg.setAttribute('open', '');
    }
  } else dlg.setAttribute('open', '');
  // keyboard events now start inside the editor (its Escape handler), not on the dialog
  el.focus({ preventScroll: true });
  return () => {
    window.removeEventListener('keydown', onKey, true);
    if (!dlg.isConnected) return;
    try {
      dlg.close();
    } catch {
      /* not open */
    }
    dlg.remove();
  };
}
