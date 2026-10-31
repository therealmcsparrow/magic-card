import { noChange } from 'lit';
import { Directive, directive, type AttributePart, type Part } from 'lit/directive.js';
import { setCommittedValue } from 'lit/directive-helpers.js';

// `.value=${shownValue(text)}` writes when the own value of the element differs from `text`, not when `text` differs from the last render.
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
