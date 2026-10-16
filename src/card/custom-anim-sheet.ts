/*
 * The compiled rules of custom animations (@keyframes, particle styles): one constructable
 * stylesheet for the page, written once per document version and adopted by each card's shadow root
 * that renders a custom animation. Cards without one never adopt it. Without constructable
 * stylesheets a <style> per shadow root carries the same text.
 */

/** Rules by document id: an edited document replaces its old rules. */
const rules = new Map<string, { name: string; css: string }>();
let sheet: CSSStyleSheet | undefined;
const fallbacks = new Set<HTMLStyleElement>();

const supported = (): boolean =>
  typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype && typeof ShadowRoot !== 'undefined' && 'adoptedStyleSheets' in ShadowRoot.prototype;

const text = (): string => [...rules.values()].map((r) => r.css).join('\n');

function flush(): void {
  const css = text();
  sheet?.replaceSync(css);
  for (const el of fallbacks) {
    if (el.isConnected) el.textContent = css;
    else fallbacks.delete(el);
  }
}

/** Make the rules of `name` (a document's compiled name) available to every card. */
export function useAnimationCss(id: string, name: string, css: string): void {
  if (!name || !css || rules.get(id)?.name === name) return;
  rules.set(id, { name, css });
  flush();
}

/** Adopt the shared sheet into a card's shadow root (once). */
export function adoptAnimationSheet(root: ShadowRoot | undefined): void {
  if (!root || !rules.size) return;
  if (supported()) {
    if (!sheet) {
      sheet = new CSSStyleSheet();
      sheet.replaceSync(text());
    }
    if (!root.adoptedStyleSheets.includes(sheet)) root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
    return;
  }
  let el = root.querySelector<HTMLStyleElement>(':scope > style[data-mc-custom-anim]');
  if (!el) {
    el = document.createElement('style');
    el.setAttribute('data-mc-custom-anim', '');
    root.prepend(el);
  }
  el.textContent = text();
  fallbacks.add(el);
}

/** Tests: the current rules text. */
export const animationSheetText = (): string => text();

export function __resetAnimationSheetForTests(): void {
  rules.clear();
  sheet = undefined;
  fallbacks.clear();
}
