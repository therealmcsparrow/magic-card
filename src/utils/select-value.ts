import { nothing } from 'lit';
import { Directive, directive, PartType, type ChildPart, type PartInfo } from 'lit/directive.js';

/** `${selectValue(value)}` as the last child of a `<select>`: sets its value after the options render. */
class SelectValueDirective extends Directive {
  constructor(part: PartInfo) {
    super(part);
    if (part.type !== PartType.CHILD) throw new Error('selectValue goes inside a <select>');
  }

  render(_value: string): typeof nothing {
    return nothing;
  }

  update(part: ChildPart, [value]: [string]): typeof nothing {
    const select = part.parentNode as HTMLSelectElement | null;
    // the options before this part are already committed
    if (select && select.tagName === 'SELECT' && select.value !== value) select.value = value;
    return nothing;
  }
}

export const selectValue = directive(SelectValueDirective);
