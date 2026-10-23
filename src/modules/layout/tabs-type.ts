import type { DesignConfig } from '../../types';
import { designToStyle, isTabType, splitDeclarations } from '../../utils/css-utils';

/** The properties a button does not inherit; the tab button reads them from `--mc-design-<property>`. */
const BUTTON_OWN = /^(font-size|font-weight|text-transform|letter-spacing|text-align):/;

/** The Typography keys of a tabs module as the style of its tab bar: the declarations, plus the variables for BUTTON_OWN. */
export function tabTypeStyle(design?: DesignConfig): string {
  if (!design) return '';
  const style = designToStyle(Object.fromEntries(Object.entries(design).filter(([k]) => isTabType(k))) as DesignConfig);
  const vars = splitDeclarations(style).filter((d) => BUTTON_OWN.test(d)).map((d) => `--mc-design-${d}`);
  return [style, ...vars].filter(Boolean).join('; ');
}
