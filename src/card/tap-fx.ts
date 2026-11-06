// "On tap" animations: a pointerdown restarts the tap animations and tap layers of the elements
// under the pointer; tap layers start at the pointer (--mc-tap-x / --mc-tap-y).
export function playTapAnimations(e: PointerEvent, host: Element): void {
  for (const node of e.composedPath()) {
    if (node === host) break;
    if (!(node instanceof HTMLElement)) continue;
    if (node.hasAttribute('data-mc-tap')) restart(node, 'data-mc-tapped');
    for (const layer of node.querySelectorAll<HTMLElement>(':scope > .mc-anim-fx[data-tap], :scope > .mc-anim-ring[data-tap]')) {
      const r = node.getBoundingClientRect();
      layer.style.setProperty('--mc-tap-x', `${Math.round(e.clientX - r.left)}px`);
      layer.style.setProperty('--mc-tap-y', `${Math.round(e.clientY - r.top)}px`);
      restart(layer, 'data-tapped');
    }
  }
}

/** Remove and set the attribute again with a style flush in between, so the animation starts over. */
function restart(el: HTMLElement, attr: string): void {
  el.removeAttribute(attr);
  void el.offsetWidth;
  el.setAttribute(attr, '');
}
