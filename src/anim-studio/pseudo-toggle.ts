// Pseudo RTL switch of the animation studio: loads the pseudo transform on first use, sends or clears the wrap and sets the direction.
import { DIR_CHANGE_EVENT } from '../contracts/ui-kit';
import { broadcastWrap } from '../i18n/pseudo-hook';

const importPseudo = () => import(/* webpackChunkName: "i18n-pseudo" */ '../i18n/pseudo');

/**
 * Turns pseudo right-to-left on or off: the wrap goes to every runtime copy, `dir` is set (or removed) on each host,
 * then mc-dir-change fires. Resolves false, changing nothing, when the transform chunk does not load.
 */
export async function setPseudoRtl(on: boolean, hosts: ReadonlyArray<Element | null | undefined>): Promise<boolean> {
  let wrap = null;
  if (on) {
    try {
      wrap = (await importPseudo()).pseudoWrap;
    } catch {
      return false;
    }
  }
  broadcastWrap(wrap);
  for (const h of hosts) {
    if (!h) continue;
    if (on) h.setAttribute('dir', 'rtl');
    else h.removeAttribute('dir');
  }
  window.dispatchEvent(new Event(DIR_CHANGE_EVENT));
  return true;
}
