/** Puts text on the clipboard (Clipboard API, then a hidden textarea in `within`); resolves false if both fail. */
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
