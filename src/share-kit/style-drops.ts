import type { ShareKit } from '../contracts/share-kit';
import { t } from './i18n';

// The listing of what the CSS resolver and the XML parser drop without leaving a trace in the cleaned markup.

const RULES: readonly [string, RegExp][] = [
  ['@import', /@import/gi],
  ['url()', /url\(\s*['"]?\s*(?!['"#\s)])/gi],
  ['expression()', /expression\s*\(/gi],
  ['behavior', /(?:^|[\s;{"'])behavior\s*:/gi],
];

export const styleDrops: ShareKit['styleDrops'] = (input, elements, resolved) => {
  const css = resolved ? elements.map((el) => (el.localName.toLowerCase() === 'style' ? el.textContent : '') + ' ' + el.getAttribute('style')).join(' ') : '';
  const out: { what: string; count: number }[] = [];
  if (/<\?xml-stylesheet\b/i.test(input)) out.push({ what: t('share-kit.style-drops.a-stylesheet-link'), count: 1 });
  for (const [name, re] of RULES) {
    const count = css.match(re)?.length;
    if (count) out.push({ what: t('share-kit.style-drops.a-style-rule-name', { name }), count });
  }
  return out;
};
