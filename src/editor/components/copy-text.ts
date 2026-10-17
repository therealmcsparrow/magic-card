/**
 * Put text on the system clipboard. Order: the Clipboard API (secure contexts only, so not on
 * Home Assistant over plain http), then a hidden textarea with `execCommand('copy')`. Resolves false
 * when both fail; the caller then shows the text to copy by hand.
 *
 * `within`: where the hidden textarea goes. Inside a modal <dialog> (the studio) everything outside
 * the dialog is inert and cannot be selected, so pass the caller's shadow root.
 */
export async function copyText(text: string, within: Node): Promise<boolean> {
  try {
    if (window.isSecureContext !== false && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // blocked (permissions, no user activation): try the textarea
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.setAttribute('aria-hidden', 'true');
  Object.assign(ta.style, { position: 'fixed', top: '0', left: '0', width: '1px', height: '1px', opacity: '0', pointerEvents: 'none' });
  try {
    within.appendChild(ta);
    ta.select();
    return typeof document.execCommand === 'function' && document.execCommand('copy') === true;
  } catch {
    return false;
  } finally {
    ta.remove();
  }
}
