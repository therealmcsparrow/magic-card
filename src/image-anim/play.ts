import type { AnimationDoc } from '../anim-studio/model';
import type { Track } from '../anim-studio/model-v2-core';
import type { ImageAnimContext, ImageAnimHandle, ImageAnimation, ImageClip, ImageTrackCompiler } from '../contracts/image-animation';
import { morphCss } from './morph-css';
import { startSmil } from './smil';

// Plays the always clip of a library image: its tracks as CSS animations on the drawing's parts, its morphs once per cycle.

const SVG_NS = 'http://www.w3.org/2000/svg';
const DIRECTIONS = ['normal', 'reverse', 'alternate', 'alternate-reverse'];
const EASING_RE = /^(?:[a-z][a-z-]{0,31}|cubic-bezier\([\d.,\s-]{1,80}\)|steps\([\w,\s-]{1,40}\))$/;
const PART_ATTR = 'data-mc-ia-part';
const ROOT_ATTR = 'data-mc-ia';

let counter = 0;
const probed = new WeakMap<Document, boolean>();

/** True when CSS `d` changes the bounding box of a rendered but invisible path in this document; unsure counts as no. Runs once per document. */
function cssMorphWorks(doc: Document): boolean {
  const known = probed.get(doc);
  if (known !== undefined) return known;
  let works: boolean;
  const holder = doc.createElementNS(SVG_NS, 'svg');
  holder.setAttribute('width', '0');
  holder.setAttribute('height', '0');
  holder.setAttribute('aria-hidden', 'true');
  holder.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none');
  const path = doc.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', 'M0 0H10V10H0Z');
  path.setAttribute('style', 'visibility:hidden');
  holder.appendChild(path);
  try {
    (doc.body ?? doc.documentElement).appendChild(holder);
    const before = path.getBBox().width;
    path.setAttribute('style', 'visibility:hidden;d:path("M0 0H20V10H0Z")');
    works = path.getBBox().width > before;
  } catch {
    works = false;
  }
  holder.remove();
  probed.set(doc, works);
  return works;
}

const num = (n: number): string => String(+n.toFixed(4));
const byId = (svg: SVGSVGElement, id: string): Element | undefined => Array.from(svg.querySelectorAll('[id]')).find((e) => e.id === id);

/** The always clip that has something to play; one clip plays at a time. */
const pickClip = (anim: ImageAnimation): ImageClip | undefined => anim.clips.find((c) => c.play.on === 'always' && (c.tracks.length || c.morphs?.length));

/** The studio document the tracks compile from: each `part:<svg id>` becomes a rig part `p<n>` of its own. */
function trackDoc(clip: ImageClip, ids: string[]): AnimationDoc {
  const tracks = clip.tracks.map((t): Track => {
    if (!t.target.startsWith('part:')) return t as Track;
    const id = t.target.slice(5);
    let n = ids.indexOf(id);
    if (n < 0) n = ids.push(id) - 1;
    return { ...t, target: `part:p${n}` };
  });
  return {
    id: `img-${clip.id}`,
    name: clip.name,
    kind: 'keyframes',
    duration: clip.duration,
    easing: clip.easing,
    iterations: clip.iterations,
    ...(clip.direction ? { direction: clip.direction } : {}),
    target: 'element',
    origin: 'center',
    version: 1,
    keyframes: [],
    rig: { icon: 'mdi:circle', parts: ids.map((_, n) => ({ id: `p${n}`, name: `p${n}`, from: [0] })) },
    tracks,
  } as AnimationDoc;
}

/** The CSS of the clip's tracks; the elements it marks are pushed on `marked`. */
function trackCss(svg: SVGSVGElement, clip: ImageClip, key: string, marked: Element[], compile: ImageTrackCompiler): string {
  if (!clip.tracks.length) return '';
  const ids: string[] = [];
  const compiled = compile(trackDoc(clip, ids));
  const delay = clip.delay && clip.delay > 0 ? clip.delay : 0;
  const count = clip.iterations === 'infinite' ? 'infinite' : num(Number(clip.iterations));
  const dir = DIRECTIONS.includes(clip.direction ?? '') ? ` ${clip.direction}` : '';
  if (!EASING_RE.test(clip.easing) || !Number.isFinite(clip.duration) || !Number.isFinite(delay) || count === 'NaN') return '';
  const timing = `${num(clip.duration)}s ${clip.easing} ${num(delay)}s ${count}${dir}`;
  const out: string[] = [];
  for (const t of compiled) {
    if (!t.css) continue;
    const names = [t.name, ...(t.lanes ?? [])].map((n) => `${n} ${timing}`).join(',');
    out.push(t.css);
    if (t.target === 'element') {
      out.push(`svg[${ROOT_ATTR}="${key}"]{animation:${names};transform-origin:${t.origin ?? 'center'};}`);
      continue;
    }
    const id = ids[Number(t.target.slice(6))];
    const el = id === undefined ? undefined : byId(svg, id);
    if (!el) continue;
    const mark = `${key}-${marked.length}`;
    el.setAttribute(PART_ATTR, mark);
    marked.push(el);
    out.push(`svg[${ROOT_ATTR}="${key}"] [${PART_ATTR}="${mark}"]{animation:${names};transform-box:fill-box;transform-origin:${t.origin ?? 'center'};}`);
  }
  return out.join('\n');
}

/**
 * Plays the animation of `svg` (the sanitised, mounted drawing). Each morph runs through one engine only: the CSS `d`
 * keyframes when the probe sees CSS `d` take effect, otherwise its SMIL copy.
 */
export function play(svg: SVGSVGElement, anim: ImageAnimation, _ctx: ImageAnimContext, compile?: ImageTrackCompiler): ImageAnimHandle {
  const key = `ia${(counter += 1)}`;
  const clip = pickClip(anim);
  const marked: Element[] = [];
  let style: Element | undefined;
  let stopSmil: (() => void) | undefined;

  /** The one place a track begins: its keyframes go into the drawing, and its SMIL copies are begun when CSS cannot move them. */
  const startTrack = (c: ImageClip): void => {
    svg.setAttribute(ROOT_ATTR, key);
    const morphs = c.morphs ?? [];
    const viaCss = !morphs.length || cssMorphWorks(svg.ownerDocument);
    const timing = { duration: c.duration, delay: c.delay, iterations: c.iterations };
    const css = [(compile ? trackCss(svg, c, key, marked, compile) : ''), viaCss ? morphCss(morphs, timing, key) : ''].filter(Boolean).join('\n');
    if (css) {
      style = svg.ownerDocument.createElementNS(SVG_NS, 'style');
      style.textContent = css;
      svg.insertBefore(style, svg.firstChild);
    }
    if (morphs.length && !viaCss) stopSmil = startSmil(svg, morphs, c.delay ?? 0);
  };

  /** The one place a track ends: its styles, marks and the SMIL copies it began are removed. */
  const stopTrack = (): void => {
    stopSmil?.();
    stopSmil = undefined;
    style?.remove();
    style = undefined;
    for (const el of marked.splice(0)) el.removeAttribute(PART_ATTR);
    svg.removeAttribute(ROOT_ATTR);
  };

  if (clip && (!clip.tracks.length || compile)) startTrack(clip);
  return {
    // state, hover and tap clips match against the new context here; the always clip needs nothing
    update() {},
    release() {
      stopTrack();
    },
  };
}
