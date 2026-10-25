import { noChange } from 'lit';
import { Directive, directive, type AttributePart, type Part } from 'lit/directive.js';
import { setCommittedValue } from 'lit/directive-helpers.js';

/**
 * `.value=${shownValue(text)}` (or an attribute) writes when the element's own value differs from `text`, not when `text`
 * differs from the last render. A value the user dragged or typed past what the host holds is put back on the next render,
 * also when the host holds the value it held before.
 */
class ShownValue extends Directive {
  render(value: string): string {
    return value;
  }

  update(part: Part, [value]: [string]): string | typeof noChange {
    const p = part as AttributePart;
    const el = p.element as unknown as Record<string, unknown>;
    // an attribute part is type 1; a property part reads the property
    const now = p.type === 1 ? p.element.getAttribute(p.name) : el[p.name];
    if (now === value) return noChange;
    setCommittedValue(part);
    return value;
  }
}

export const shownValue = directive(ShownValue);
