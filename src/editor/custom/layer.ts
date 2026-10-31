/* Shows a full-screen editor element in the top layer of a modal <dialog> on <body>, and stops Escape from closing HA's card dialog behind it. */

const STYLE =
  'padding:0;border:0;margin:0;width:100vw;height:100vh;max-width:none;max-height:none;background:transparent;color:inherit;overflow:visible;';

/**
 * Where focus goes when the layer closes: the nearest noted ancestor of the opener still on the page,
 * searched through shadow roots for a visible element with `data-focus-key=<key>`.
 */
function parents(el: Node): Element[] {
  const out: Element[] = [];
  for (let n: Node | null = el; n; ) {
    n = n.parentNode ?? (n as ShadowRoot).host ?? null;
    if (n?.nodeType === 1) out.push(n as Element);
  }
  return out;
}

function findEntry(root: ParentNode, sel: string): HTMLElement | undefined {
  for (const el of root.querySelectorAll<HTMLElement>('*')) {
    if (el.matches(sel) && el.textContent?.trim() && el.getClientRects().length) return el;
    const hit = el.shadowRoot && findEntry(el.shadowRoot, sel);
    if (hit) return hit;
  }
  return undefined;
}

function refocus(chain: Element[], key: string): void {
  const sel = `[data-focus-key="${key}"]`;
  for (const a of chain) {
    if (!a.isConnected) continue;
    const hit = (a.shadowRoot && findEntry(a.shadowRoot, sel)) || findEntry(a, sel);
    if (hit) return hit.focus({ preventScroll: true });
  }
}

/** Mount `el` in the top layer; returns the function that removes it (`back`: where focus returns, see refocus; `label`: the name of the layer's own dialog, which would otherwise be unnamed above the editor's). */
export function openLayer(el: HTMLElement, back?: { from: Element; key: string }, onEscape?: () => void, label?: string): () => void {
  const chain = back ? parents(back.from) : [];
  const dlg = document.createElement('dialog');
  dlg.className = 'mc-editor-layer';
  if (label) dlg.setAttribute('aria-label', label);
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
    // focus fell to the page (a clicked button went away): the layer still answers Escape if it was given a handler
    onEscape?.();
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
    // after the owner re-rendered (the button may carry a new label)
    if (back) requestAnimationFrame(() => requestAnimationFrame(() => refocus(chain, back.key)));
  };
}
