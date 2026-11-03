import { afterEach, describe, expect, it, vi } from 'vitest';
import { classifyCard } from '../src/forum-shot/font-address';
import { findRemoteAssets, scrubValue } from '../src/forum-shot/remote';

const ORIGIN = 'https://ha.example.org';
const SECRET = 'SECRETVALUE';

// The console line for a real Home Assistant: same reads and same card walk as the Forum shot tab, and counts only in its output.
const SNIPPET = String.raw`(async()=>{const h=document.querySelector('home-assistant').hass,O=v=>!!v&&typeof v==='object'&&!Array.isArray(v),L=v=>Array.isArray(v)?v:[],C=[],F=n=>{if(!O(n))return;if(n.type==='custom:magic-card'){C.push(n);return}(Array.isArray(n.views)?n.views:[...L(n.cards),...L(n.sections),...(n.card===undefined?[]:[n.card])]).forEach(F)};let D=[];try{D=(await h.callWS({type:'lovelace/dashboards/list'})).filter(d=>d.url_path&&d.mode!=='yaml').map(d=>d.url_path)}catch{}for(const p of [null,...D]){try{F(await h.callWS(p===null?{type:'lovelace/config',force:false}:{type:'lovelace/config',url_path:p,force:false}))}catch{}}const R=C.map(c=>{let nodes=0,longStrings=0,leaf=0,str=0,other=0;const H=new Set(),W=(v,d)=>{nodes++;if(d>24){if(typeof v==='string')str++;else if(v&&typeof v==='object')other++;else leaf++;return}if(typeof v==='string'){if(v.length>1e6)longStrings++}else if(Array.isArray(v))v.forEach(x=>W(x,d+1));else if(v&&typeof v==='object')for(const[k,x]of Object.entries(v)){if(k==='css'&&typeof x==='string')for(const m of x.matchAll(/(?:@import\s+(?:url\(\s*)?|url\(\s*)["']?https:\/\/([^\/"'\s)?#]+)/gi))H.add(m[1].toLowerCase());W(x,d+1)}};W(c,0);if(H.has('fonts.googleapis.com'))H.add('fonts.gstatic.com');const limits=[longStrings&&'string',(str||other)&&'depth',!str&&!other&&leaf&&'depth_leaf',nodes>5e4&&'nodes',H.size>8&&'font_hosts'].filter(Boolean);return{limits,longStrings,pastDepth:{leaf,string:str,other},nodes,fontHosts:H.size}});console.log('forum-shot-limits '+JSON.stringify({cards:C.length,firing:R.filter(r=>r.limits.length)}))})()`;

const nest = (leaf: unknown, levels: number): unknown => {
  let v = leaf;
  for (let i = 0; i < levels; i++) v = { n: v };
  return v;
};
/** A card whose `deep` key holds `leaf` at exactly config depth 25, one past the limit. */
const pastDepth = (leaf: unknown): Record<string, unknown> => ({ type: 'custom:magic-card', name: SECRET, deep: nest(leaf, 24) });
const atLimit = (leaf: unknown): Record<string, unknown> => ({ type: 'custom:magic-card', deep: nest(leaf, 23) });

interface Report {
  cards: number;
  firing: { limits: string[]; longStrings: number; pastDepth: { leaf: number; string: number; other: number }; nodes: number; fontHosts: number }[];
}

const runSnippet = async (cards: unknown[]): Promise<{ report: Report; printed: string; calls: Record<string, unknown>[] }> => {
  const calls: Record<string, unknown>[] = [];
  const hass = {
    callWS: async (msg: Record<string, unknown>) => {
      calls.push(msg);
      return msg.type === 'lovelace/dashboards/list' ? [] : { title: SECRET, views: [{ title: SECRET, cards }] };
    },
  };
  const el = document.createElement('home-assistant');
  (el as unknown as { hass: unknown }).hass = hass;
  document.body.append(el);
  const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  await (new Function(`return ${SNIPPET}`)() as Promise<void>);
  const printed = log.mock.calls.flat().join(' ');
  log.mockRestore();
  el.remove();
  return { report: JSON.parse(printed.replace('forum-shot-limits ', '')) as Report, printed, calls };
};

afterEach(() => {
  document.body.replaceChildren();
});

describe('a value past the depth limit that cannot hold an address', () => {
  it.each([[1], [0], [true], [false], [null]])('does not lock on %j', (leaf) => {
    const config = pastDepth(leaf);
    expect(findRemoteAssets(config, ORIGIN)).toEqual([]);
    expect(classifyCard(config, ORIGIN)).toEqual({ lock: null, fontHosts: [] });
  });

  it.each([[1], [true], [null]])('reaches the picture unchanged and unreported: %j', (leaf) => {
    const config = nest(leaf, 25);
    const onRemove = vi.fn();
    expect(scrubValue(config, ORIGIN, onRemove)).toEqual(config);
    expect(onRemove).not.toHaveBeenCalled();
  });

  it('does not lock an array of numbers that ends past the limit', () => {
    expect(classifyCard(atLimit([1, 2, 3]), ORIGIN).lock).toBeNull();
  });
});

describe('a true limit stays locked', () => {
  it.each([
    ['an address', 'https://evil.example.com/x.png'],
    ['a plain string, which the picture would blank', 'red'],
    ['an empty string', ''],
    ['an object', { a: 1 }],
    ['an empty object, which the picture would replace', {}],
    ['an array', [1]],
    ['a custom-card module', { type: 'custom-card' }],
  ])('past the depth limit: %s', (_name, leaf) => {
    expect(classifyCard(pastDepth(leaf), ORIGIN).lock).toBe('limit');
  });

  it('over the node limit, numbers included', () => {
    expect(classifyCard({ type: 'custom:magic-card', big: Array.from({ length: 60_000 }, () => 1) }, ORIGIN).lock).toBe('limit');
  });

  it('a string over the size limit', () => {
    expect(classifyCard({ type: 'custom:magic-card', text: 'a'.repeat(1_000_001) }, ORIGIN).lock).toBe('limit');
  });

  it('a css text over the size limit', () => {
    expect(classifyCard({ type: 'custom:magic-card', css: `a{color:red}${' '.repeat(1_000_001)}` }, ORIGIN).lock).toBe('limit');
  });
});

describe('the console snippet', () => {
  const nineHosts = Array.from({ length: 9 }, (_, i) => `@import url("https://f${i}.example.com/a.css");`).join('');

  it('names the limit that fired', async () => {
    const cases: [string, Record<string, unknown>][] = [
      ['string', { type: 'custom:magic-card', text: 'a'.repeat(1_000_001) }],
      ['depth', pastDepth('red')],
      ['nodes', { type: 'custom:magic-card', big: Array.from({ length: 60_000 }, () => 1) }],
      ['font_hosts', { type: 'custom:magic-card', css: nineHosts }],
    ];
    for (const [name, config] of cases) {
      expect(classifyCard(config, ORIGIN).lock).toBe('limit');
      const { report } = await runSnippet([config]);
      expect(report.firing).toHaveLength(1);
      expect(report.firing[0].limits).toEqual([name]);
    }
  });

  it('names the false lock apart from a true one', async () => {
    const { report } = await runSnippet([pastDepth(1)]);
    expect(report.firing[0].limits).toEqual(['depth_leaf']);
    expect(report.firing[0].pastDepth).toEqual({ leaf: 1, string: 0, other: 0 });
  });

  it('agrees with the classifier on a card no limit touches', async () => {
    const config = { type: 'custom:magic-card', name: SECRET, css: '@import url("https://fonts.googleapis.com/css2?family=Lato");' };
    expect(classifyCard(config, ORIGIN).lock).toBeNull();
    const { report } = await runSnippet([config]);
    expect(report).toEqual({ cards: 1, firing: [] });
  });

  it('prints no config content, value or name, and only reads', async () => {
    const css = `@import url("https://${SECRET.toLowerCase()}.example.com/a.css");`;
    const { printed, calls } = await runSnippet([{ type: 'custom:magic-card', name: SECRET, css, secret_key: nest(SECRET, 30), text: SECRET.repeat(100_000) }]);
    expect(printed.toLowerCase()).not.toContain(SECRET.toLowerCase());
    expect(printed).not.toContain('example.com');
    expect(printed).not.toContain('secret_key');
    expect(printed).toMatch(/"limits":\["string","depth"\]/);
    expect(new Set(calls.map((c) => c.type))).toEqual(new Set(['lovelace/dashboards/list', 'lovelace/config']));
  });

  it('is one line', () => {
    expect(SNIPPET).not.toMatch(/[\r\n]/);
  });
});
