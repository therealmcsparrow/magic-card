/*
 * Rules the v2 runtime writes per module wrapper (clip list overrides, binding values and the
 * bound declarations): one constructable stylesheet for the page, adopted by every shadow root
 * that needs it (the card's, and an icon's for rig targets). Without constructable stylesheets a
 * <style> per root carries the same text. The card's own templates never bind `data-mc-rt`, so the
 * key the runtime gives a wrapper survives re-renders (a re-created wrapper gets a new one).
 */

const rules = new Map<string, string>();
let sheet: CSSStyleSheet | undefined;
const fallbacks = new Map<ShadowRoot, HTMLStyleElement>();
let next = 0;

const supported = (): boolean =>
  typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype && typeof ShadowRoot !== 'undefined' && 'adoptedStyleSheets' in ShadowRoot.prototype;

const text = (): string => [...rules.values()].join('\n');

function flush(): void {
  const css = text();
  try {
    sheet?.replaceSync(css);
  } catch {
    /* an engine that rejects a rule keeps the previous text */
  }
  for (const [root, el] of fallbacks) {
    if (el.isConnected) el.textContent = css;
    else fallbacks.delete(root);
  }
}

/** Adopt the runtime sheet into a shadow root (once). */
export function adoptRuntimeSheet(root: ShadowRoot | null | undefined): void {
  if (!root) return;
  if (supported()) {
    if (!sheet) {
      sheet = new CSSStyleSheet();
      sheet.replaceSync(text());
    }
    if (!root.adoptedStyleSheets.includes(sheet)) root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
    return;
  }
  let el = fallbacks.get(root);
  if (!el?.isConnected) {
    el = document.createElement('style');
    el.setAttribute('data-mc-runtime', '');
    root.append(el);
    fallbacks.set(root, el);
  }
  el.textContent = text();
}

/** Set (or with '' drop) the rules under `key`; writes the sheet only when the text changed. */
export function setRules(key: string, css: string, root?: ShadowRoot | null): void {
  if (!css) {
    if (rules.delete(key)) flush();
    return;
  }
  if (rules.get(key) !== css) {
    rules.set(key, css);
    flush();
  }
  adoptRuntimeSheet(root);
}

/** The wrapper's runtime key (`data-mc-rt`), given on first use. */
export function wrapperKey(el: HTMLElement): string {
  let k = el.getAttribute('data-mc-rt');
  if (!k) {
    k = `r${++next}`;
    el.setAttribute('data-mc-rt', k);
  }
  return k;
}

/** Tests: the current rules text. */
export const runtimeSheetText = (): string => text();

export function __resetRuntimeSheetForTests(): void {
  rules.clear();
  sheet = undefined;
  fallbacks.clear();
}

/** The module's main icon, best match first: the part marker, the animated icon, any svg icon. */
const ICON = ['[data-mc-part="icon"]', '.mc-anim-icon', 'mc-svg-icon'];

/**
 * The wrapper's own main icon (where a rig renders, in its shadow root): one lookup for clips and
 * bindings. Icons of modules nested in a layout module belong to their own wrappers and are skipped.
 */
export function moduleIcon(wrapper: HTMLElement): HTMLElement | null {
  for (const sel of ICON)
    for (const el of wrapper.querySelectorAll<HTMLElement>(sel)) {
      const owner = el.parentElement?.closest('.mc-module-wrapper');
      if (!owner || owner === wrapper || !wrapper.contains(owner)) return el;
    }
  return null;
}
