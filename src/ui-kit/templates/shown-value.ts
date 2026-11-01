import { noChange } from 'lit';
import { Directive, directive, type AttributePart, type Part } from 'lit/directive.js';
import { setCommittedValue } from 'lit/directive-helpers.js';
import { textDir } from './field';

/**
 * `.value=${shownValue(text)}` writes when the element's own value differs from `text`, not when `text` differs from the last render.
 * A value the user dragged or typed past what the host holds is put back on the next render.
 */
class ShownValue extends Directive {
  render(value: string): string {
    return value;
  }

  update(part: Part, [value]: [string]): string | typeof noChange {
    const p = part as AttributePart;
    const el = p.element as unknown as Record<string, unknown>;
    // a text field the user types in reads in the direction of its own text; code fields (.mono) stay as they are
    const own = p.element;
    if (p.name === 'value' && !own.hasAttribute('dir') && !own.classList.contains('mono') && (own.localName === 'textarea' || (own as HTMLInputElement).type === 'text')) own.setAttribute('dir', textDir(undefined));
    // an attribute part is type 1; a property part reads the property
    const now = p.type === 1 ? p.element.getAttribute(p.name) : el[p.name];
    if (now === value) return noChange;
    setCommittedValue(part);
    return value;
  }
}

export const shownValue = directive(ShownValue);
