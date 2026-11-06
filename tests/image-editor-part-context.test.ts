import { describe, expect, it } from 'vitest';
import { contextOf } from '../src/image-editor/part';

describe('imported part: ancestor attributes written as markup', () => {
  it('escapes quotes, angle brackets and ampersands in a value', () => {
    const doc = new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg"><g data-x="a"><path id="p" d="M0 0"/></g></svg>', 'image/svg+xml');
    const g = doc.querySelector('g')!;
    g.setAttribute('data-x', 'a"><script>x</script>&b');
    const [ctx] = contextOf(doc.querySelector('path')!);
    expect(ctx).toBe(' data-x="a&quot;&gt;&lt;script&gt;x&lt;/script&gt;&amp;b"');
    expect(ctx).not.toContain('<');
    const back = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg"><g${ctx}/></svg>`, 'image/svg+xml');
    expect(back.querySelector('g')!.getAttribute('data-x')).toBe('a"><script>x</script>&b');
  });
});
