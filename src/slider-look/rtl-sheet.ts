import type { ElementPart, Part } from 'lit';
import { directive, Directive } from 'lit/directive.js';
import { elementRtl } from '../utils/slider-track';
import { SLIDER_LOOK_RTL_CSS } from './css';

type SheetRoot = (ShadowRoot | Document) & { adoptedStyleSheets: CSSStyleSheet[] };

let sheet: CSSStyleSheet | undefined;
const marked = new WeakSet<Node>();

const adoptable = (root: Node): root is SheetRoot =>
  typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype && 'adoptedStyleSheets' in root;

/** Gives the root the mirrored slider rules (a constructable sheet; a <style> in an engine without one, only when the track runs right to left). */
function adoptRtlRules(el: Element): void {
  const root = el.getRootNode();
  if (marked.has(root)) return;
  if (adoptable(root)) {
    sheet ??= new CSSStyleSheet();
    if (!sheet.cssRules.length) sheet.replaceSync(SLIDER_LOOK_RTL_CSS);
    if (!root.adoptedStyleSheets.includes(sheet)) root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
    marked.add(root);
  } else if (elementRtl(el) && 'append' in root) {
    const style = document.createElement('style');
    style.textContent = SLIDER_LOOK_RTL_CSS;
    (root as ParentNode).append(style);
    marked.add(root);
  }
}

/** An element binding that leaves no markup: it hands the track's root the mirrored rules once the element sits in it. */
class LookRtlSheet extends Directive {
  render(): void {}
  override update(part: Part): void {
    const el = (part as ElementPart).element;
    queueMicrotask(() => {
      if (el.isConnected) adoptRtlRules(el);
    });
  }
}
export const lookRtlSheet = directive(LookRtlSheet);
