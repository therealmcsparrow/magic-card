// Frame capture for the forum shot: clones the card's DOM with computed styles, draws it through an SVG data: URL, returns a PNG blob.
import { FORUM_SHOT_MAX_PIXELS, FORUM_SHOT_SCALE } from '../contracts/forum-shot';
import { forumShotError } from './settle';

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const MAX_NODES = 40_000;
const SKIP = new Set(['style', 'script', 'link', 'template', 'meta', 'iframe', 'object', 'embed', 'video', 'audio']);
const URL_PROPS = ['background-image', 'mask-image', '-webkit-mask-image', 'border-image-source', 'list-style-image', 'content'];
const CSS_URL = /url\((["']?)(.*?)\1\)/g;
// Only pictures and fonts are fetched, each within a byte and a time limit.
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_RUN_BYTES = 24 * 1024 * 1024;
const FETCH_MS = 8000;
const INLINE_TYPE = /^(?:image\/|font\/|application\/(?:font|x-font|vnd\.ms-fontobject))/i;
// Elements whose href is a picture or a part of one; on any other element (a link) it is removed, not fetched.
const HREF_PICTURES = new Set(['image', 'use', 'feimage']);
const TAINT_PROBE =
  '<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"><foreignObject width="2" height="2"><div xmlns="http://www.w3.org/1999/xhtml" style="background:#000">.</div></foreignObject></svg>';

export interface CapturedFrame {
  blob: Blob;
  /** Size in device pixels. */
  width: number;
  height: number;
  /** True when an off-origin picture was swapped for a one-pixel placeholder. */
  replaced: boolean;
}

/** The browser step of the capture; tests replace it because happy-dom has no canvas. */
export interface CaptureSeams {
  rasterise: (svgUrl: string, width: number, height: number) => Promise<Blob>;
}

/** True for a data: URL or a URL on the page's own origin. */
function sameOrigin(url: string): boolean {
  try {
    const u = new URL(url, location.href);
    return u.protocol === 'data:' || u.origin === location.origin;
  } catch {
    return false;
  }
}

const readAsDataUrl = (blob: Blob) =>
  new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(String(reader.result));
    reader.onerror = () => rej(new Error('read'));
    reader.readAsDataURL(blob);
  });

/** Draws the SVG on a canvas at the given size and returns the PNG; a tainted canvas fails with `capture_failed`. */
async function rasterise(svgUrl: string, width: number, height: number): Promise<Blob> {
  const img = new Image();
  await new Promise<void>((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(forumShotError('capture_failed'));
    img.src = svgUrl;
  });
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw forumShotError('capture_failed');
  ctx.drawImage(img, 0, 0);
  try {
    return await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(forumShotError('capture_failed'))), 'image/png'));
  } catch {
    throw forumShotError('capture_failed');
  }
}

const svgDataUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

function asCaptureError(e: unknown): Error {
  return e instanceof Error && 'code' in e ? e : forumShotError('capture_failed');
}

let supported: Promise<void> | undefined;

/** Start-up check: a tiny foreignObject picture must survive the canvas; a browser that taints it fails with `capture_failed`. The real check runs once per page. */
export function checkCaptureSupport(seams?: CaptureSeams): Promise<void> {
  const probe = (draw: CaptureSeams['rasterise']) =>
    draw(svgDataUrl(TAINT_PROBE), 2, 2).then(
      () => undefined,
      (e: unknown) => {
        throw asCaptureError(e);
      },
    );
  if (seams) return probe(seams.rasterise);
  supported ??= probe(rasterise).catch((e: unknown) => {
    supported = undefined;
    throw e;
  });
  return supported;
}

interface Run {
  replaced: boolean;
  nodes: number;
  families: Set<string>;
  /** Bytes inlined so far. */
  bytes: number;
  cache: Map<string, string>;
}

/** The body of a picture or font response, or `undefined` when it is not one or is over `cap` bytes; the stream is cancelled at the cap. */
async function readCapped(res: Response, cap: number): Promise<Blob | undefined> {
  const type = res.headers.get('content-type') ?? '';
  if (!INLINE_TYPE.test(type)) return undefined;
  if (Number(res.headers.get('content-length')) > cap) return undefined;
  if (!res.body) {
    const whole = await res.blob();
    return whole.size <= cap ? whole : undefined;
  }
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > cap) {
      await reader.cancel().catch(() => undefined);
      return undefined;
    }
    chunks.push(value);
  }
  return new Blob(chunks as BlobPart[], { type });
}

/** One same-origin GET within `cap` bytes and FETCH_MS; `undefined` when it fails, is too big, is too slow or is not a picture or font. */
async function fetchCapped(abs: string, cap: number): Promise<Blob | undefined> {
  const ctl = new AbortController();
  const timedOut = new Promise<undefined>((res) => ctl.signal.addEventListener('abort', () => res(undefined)));
  const timer = setTimeout(() => ctl.abort(), FETCH_MS);
  const work = (async () => {
    const res = await fetch(abs, { credentials: 'same-origin', signal: ctl.signal });
    return res.ok ? readCapped(res, cap) : undefined;
  })();
  work.catch(() => undefined);
  try {
    return await Promise.race([work, timedOut]);
  } finally {
    clearTimeout(timer);
    ctl.abort();
  }
}

async function toDataUrl(url: string, run: Run): Promise<string> {
  const abs = new URL(url, location.href).href;
  if (abs.startsWith('data:')) return abs;
  if (!sameOrigin(abs)) {
    run.replaced = true;
    return PIXEL;
  }
  const hit = run.cache.get(abs);
  if (hit) return hit;
  try {
    const blob = await fetchCapped(abs, Math.min(MAX_FILE_BYTES, MAX_RUN_BYTES - run.bytes));
    if (!blob) return PIXEL;
    run.bytes += blob.size;
    const data = await readAsDataUrl(blob);
    run.cache.set(abs, data);
    return data;
  } catch {
    return PIXEL;
  }
}

async function inlineUrls(value: string, run: Run): Promise<string> {
  let out = '';
  let last = 0;
  for (const m of value.matchAll(CSS_URL)) {
    out += `${value.slice(last, m.index)}url("${await toDataUrl(m[2], run)}")`;
    last = (m.index ?? 0) + m[0].length;
  }
  return out + value.slice(last);
}

async function styleOf(el: Element, run: Run, pseudo?: string): Promise<string> {
  const cs = getComputedStyle(el, pseudo);
  let css = '';
  for (const p of Array.from(cs)) {
    if (p.startsWith('animation') || p.startsWith('transition')) continue;
    let v = cs.getPropertyValue(p);
    if (p === 'font-family') for (const f of v.split(',')) run.families.add(f.trim().replace(/^["']|["']$/g, '').toLowerCase());
    if (URL_PROPS.includes(p) && v.includes('url(')) v = await inlineUrls(v, run);
    css += `${p}:${v};`;
  }
  return `${css}animation:none;transition:none;`;
}

async function cloneInto(node: Node, out: Node, run: Run): Promise<void> {
  if (++run.nodes > MAX_NODES) throw forumShotError('too_large');
  if (node.nodeType === 3) {
    out.appendChild(document.createTextNode((node as Text).data));
    return;
  }
  if (node.nodeType !== 1) return;
  const el = node as Element;
  if (el.localName === 'slot') {
    const assigned = (el as HTMLSlotElement).assignedNodes({ flatten: true });
    for (const c of assigned.length ? assigned : Array.from(el.childNodes)) await cloneInto(c, out, run);
    return;
  }
  if (SKIP.has(el.localName) || getComputedStyle(el).display === 'none') return;
  if (el.localName === 'canvas' || el.localName === 'img') {
    const img = document.createElement('img');
    let src = PIXEL;
    if (el.localName === 'canvas') {
      try {
        src = (el as HTMLCanvasElement).toDataURL();
      } catch {
        run.replaced = true;
      }
    } else {
      const url = (el as HTMLImageElement).currentSrc || el.getAttribute('src');
      if (url) src = await toDataUrl(url, run);
    }
    img.setAttribute('src', src);
    img.setAttribute('style', await styleOf(el, run));
    out.appendChild(img);
    return;
  }
  const clone = el.cloneNode(false) as Element;
  for (const a of Array.from(clone.attributes)) {
    if (a.name === 'style' || a.name === 'class' || a.name === 'srcset' || a.name.startsWith('on')) clone.removeAttribute(a.name);
    else if ((a.name === 'href' || a.name === 'xlink:href') && !a.value.startsWith('#')) {
      if (HREF_PICTURES.has(el.localName.toLowerCase())) clone.setAttribute(a.name, await toDataUrl(a.value, run));
      else clone.removeAttribute(a.name);
    }
  }
  clone.setAttribute('style', await styleOf(el, run));
  for (const ps of ['::before', '::after']) {
    const content = getComputedStyle(el, ps).content;
    if (!content || content === 'none' || content === 'normal') continue;
    const span = document.createElement('span');
    span.setAttribute('style', await styleOf(el, run, ps));
    if (!/^(url|attr|counter)/.test(content)) span.textContent = content.replace(/^["']|["']$/g, '');
    if (ps === '::before') clone.insertBefore(span, clone.firstChild);
    else clone.appendChild(span);
  }
  const kids = el.shadowRoot?.childNodes ?? el.childNodes;
  for (const k of Array.from(kids)) await cloneInto(k, clone, run);
  out.appendChild(clone);
}

/** @font-face rules of the page for the families the clone uses, with a same-origin face embedded as a data: URL. */
async function embeddedFonts(run: Run): Promise<string> {
  let css = '';
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSFontFaceRule)) continue;
      const family = rule.style.getPropertyValue('font-family').trim().replace(/^["']|["']$/g, '');
      if (!run.families.has(family.toLowerCase())) continue;
      const m = /url\((["']?)(.*?)\1\)/.exec(rule.style.getPropertyValue('src'));
      if (!m) continue;
      const data = await toDataUrl(new URL(m[2], sheet.href ?? location.href).href, run);
      if (data === PIXEL) continue;
      css += `@font-face{font-family:"${family.replace(/"/g, '')}";font-weight:${rule.style.getPropertyValue('font-weight') || 'normal'};font-style:${rule.style.getPropertyValue('font-style') || 'normal'};src:url("${data}");}`;
    }
  }
  return css;
}

/**
 * One PNG of a settled card. Throws `too_large` before drawing when width times height exceeds FORUM_SHOT_MAX_PIXELS, and
 * `capture_failed` when the browser taints the canvas; there is no second route. Nothing is stored or logged.
 */
export async function captureFrame(el: HTMLElement, seams?: CaptureSeams): Promise<CapturedFrame> {
  await checkCaptureSupport(seams);
  const draw = seams?.rasterise ?? rasterise;
  const box = el.getBoundingClientRect();
  const w = Math.ceil(box.width);
  const h = Math.ceil(box.height);
  if (!w || !h) throw forumShotError('capture_failed');
  const width = w * FORUM_SHOT_SCALE;
  const height = h * FORUM_SHOT_SCALE;
  if (width * height > FORUM_SHOT_MAX_PIXELS) throw forumShotError('too_large');
  if (document.fonts?.ready) await document.fonts.ready;
  const run: Run = { replaced: false, nodes: 0, families: new Set(), bytes: 0, cache: new Map() };
  const holder = document.createElement('div');
  await cloneInto(el, holder, run);
  const root = holder.firstElementChild;
  if (!root) throw forumShotError('capture_failed');
  root.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  const fonts = await embeddedFonts(run);
  const xml = (fonts ? `<style xmlns="http://www.w3.org/1999/xhtml">${fonts}</style>` : '') + new XMLSerializer().serializeToString(root);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${w} ${h}"><foreignObject x="0" y="0" width="${w}" height="${h}">${xml}</foreignObject></svg>`;
  try {
    return { blob: await draw(svgDataUrl(svg), width, height), width, height, replaced: run.replaced };
  } catch (e) {
    throw asCaptureError(e);
  }
}
