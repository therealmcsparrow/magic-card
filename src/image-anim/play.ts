import type { AnimationDoc } from '../anim-studio/model';
import type { Track } from '../anim-studio/model-v2-core';
import type { ClipPlay, ImageAnimContext, ImageAnimHandle, ImageAnimation, ImageClip, ImageTrackCompiler } from '../contracts/image-animation';
import { isCardPaused, unwatchOffscreen, watchOffscreen } from '../icons/offscreen';
import { askForPause, canHover, watchMotion } from './motion';
import { asTransform } from './play-transform';
import { morphCss } from './morph-css';
import { startSmil } from './smil';
import { bindTriggers, cardOf, stateMatches, triggerHost } from './triggers';

// Plays the clips of a library image: tracks as CSS animations on the drawing's parts, morphs once per cycle, started by
// always, hover, tap or an entity state, and held by reduced motion, the card's pause and the page being off screen.

const SVG_NS = 'http://www.w3.org/2000/svg';
const DIRECTIONS = ['normal', 'reverse', 'alternate', 'alternate-reverse'];
const EASING_RE = /^(?:[a-z][a-z-]{0,31}|cubic-bezier\([0-9., \t\n\r\f-]{1,80}\)|steps\([A-Za-z0-9_, \t\n\r\f-]{1,40}\))$/;
const PART_ATTR = 'data-mc-ia-part';
const ROOT_ATTR = 'data-mc-ia';
const HOLD_ATTR = 'data-mc-ia-hold';
const TAP_LINGER_MAX_MS = 10_000;

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
/** True only when the browser reports no transform of the element's own, so a CSS `transform` replaces nothing. */
const untransformed = (el: Element): boolean => el.ownerDocument.defaultView?.getComputedStyle(el).transform === 'none';
const byId = (svg: SVGSVGElement, id: string): Element | undefined => Array.from(svg.querySelectorAll('[id]')).find((e) => e.id === id);

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
    if (t.target === 'element') {
      out.push(t.css, `svg[${ROOT_ATTR}="${key}"]{animation:${names};transform-origin:${t.origin ?? 'center'};}`);
      continue;
    }
    const id = ids[Number(t.target.slice(6))];
    const el = id === undefined ? undefined : byId(svg, id);
    if (!el) continue;
    out.push(t.lanes?.length || !untransformed(el) ? t.css : asTransform(t.css));
    const mark = `${key}-${marked.length}`;
    el.setAttribute(PART_ATTR, mark);
    marked.push(el);
    out.push(`svg[${ROOT_ATTR}="${key}"] [${PART_ATTR}="${mark}"]{animation:${names};transform-box:fill-box;transform-origin:${t.origin ?? 'center'};}`);
  }
  return out.join('\n');
}

type StatePlay = Extract<ClipPlay, { on: 'state' }>;
type SvgTimeline = SVGSVGElement & { pauseAnimations?: () => void; unpauseAnimations?: () => void; setCurrentTime?: (t: number) => void };

/**
 * Plays the animation of `svg` (the sanitised, mounted drawing). One clip plays at a time, by priority tap > hover >
 * state > always. Each morph runs through one engine only: the CSS `d` keyframes when the probe sees CSS `d` take
 * effect, otherwise its SMIL copy. Reduced motion shows the drawn frame; a paused card or an off-screen page holds the
 * CSS tracks and the SMIL clock.
 */
export function play(svg: SVGSVGElement, anim: ImageAnimation, ctx: ImageAnimContext, compile?: ImageTrackCompiler): ImageAnimHandle {
  const key = `ia${(counter += 1)}`;
  const timeline = svg as SvgTimeline;
  const card = cardOf(ctx.host);
  const playable = anim.clips.filter((c) => (c.tracks.length || c.morphs?.length) && (!c.tracks.length || compile));
  const ofKind = (on: ClipPlay['on']): ImageClip | undefined => playable.find((c) => c.play.on === on);
  const alwaysClip = ofKind('always');
  const hoverClip = ofKind('hover');
  const tapClip = ofKind('tap');
  const stateClips = playable.filter((c): c is ImageClip & { play: StatePlay } => c.play.on === 'state');
  const marked: Element[] = [];
  const motion = watchMotion(() => sync());
  const releasePause = card ? askForPause(card) : () => undefined;
  let hass = ctx.hass;
  let current: ImageClip | undefined;
  let hovering = false;
  let tapping = false;
  let held = card ? isCardPaused(card) : false;
  let style: Element | undefined;
  let stopSmil: (() => void) | undefined;
  let beginSmil: (() => void) | undefined;
  let tapTimer: ReturnType<typeof setTimeout> | undefined;
  let seen: unknown[] = stateClips.map((c) => hass?.states?.[c.play.entity]);

  /** The one place a track begins: its keyframes go into the drawing, and its SMIL copies are begun when CSS cannot move them. */
  const startTrack = (c: ImageClip): void => {
    svg.setAttribute(ROOT_ATTR, key);
    const morphs = c.morphs ?? [];
    const viaCss = !morphs.length || cssMorphWorks(svg.ownerDocument);
    const timing = { duration: c.duration, delay: c.delay, iterations: c.iterations };
    const hold = `svg[${ROOT_ATTR}="${key}"][${HOLD_ATTR}],svg[${ROOT_ATTR}="${key}"][${HOLD_ATTR}] *{animation-play-state:paused !important;}`;
    const css = [compile ? trackCss(svg, c, key, marked, compile) : '', viaCss ? morphCss(morphs, timing, key) : ''].filter(Boolean).join('\n');
    if (css) {
      style = svg.ownerDocument.createElementNS(SVG_NS, 'style');
      style.textContent = `${css}\n${hold}`;
      svg.insertBefore(style, svg.firstChild);
    }
    if (morphs.length && !viaCss) {
      beginSmil = () => {
        beginSmil = undefined;
        stopSmil = startSmil(svg, morphs, c.delay ?? 0);
      };
      if (!held) beginSmil();
    }
  };

  /** The one place a track ends: its styles, marks and the SMIL copies it began are removed. */
  const stopTrack = (): void => {
    beginSmil = undefined;
    stopSmil?.();
    stopSmil = undefined;
    style?.remove();
    style = undefined;
    for (const el of marked.splice(0)) el.removeAttribute(PART_ATTR);
    svg.removeAttribute(ROOT_ATTR);
  };

  /** The clip that should play now; nothing under reduced motion. */
  const wanted = (): ImageClip | undefined => {
    if (motion.reduced()) return undefined;
    if (tapping && tapClip) return tapClip;
    if (hovering && hoverClip && canHover()) return hoverClip;
    return stateClips.find((c) => stateMatches(c.play, hass)) ?? alwaysClip;
  };

  /** CSS and SMIL are held together: the hold attribute stops the CSS, the timeline pause stops SMIL. */
  const applyHold = (): void => {
    svg.toggleAttribute(HOLD_ATTR, held);
    if (motion.reduced()) {
      timeline.pauseAnimations?.();
      timeline.setCurrentTime?.(0);
    } else if (held) {
      timeline.pauseAnimations?.();
    } else {
      timeline.unpauseAnimations?.();
      beginSmil?.();
    }
  };

  /** Switches to the wanted clip. A moving clip counts as motion of the card; the observer tells when the card is paused or the drawing is off screen. */
  const sync = (): void => {
    const next = wanted();
    if (next !== current) {
      stopTrack();
      current = next;
      if (next) startTrack(next);
    }
    watchOffscreen(
      svg,
      (onScreen) => {
        held = !onScreen;
        applyHold();
      },
      { counted: !!current },
    );
    applyHold();
  };

  /** A press that ended as a tap lets a finite clip play out; any other end stops the tap clip. */
  const endTap = (done: boolean): void => {
    clearTimeout(tapTimer);
    const rest = tapClip && typeof tapClip.iterations === 'number' ? ((tapClip.delay ?? 0) + tapClip.duration * tapClip.iterations) * 1000 : 0;
    if (done && rest > 0) {
      tapTimer = setTimeout(() => {
        tapping = false;
        sync();
      }, Math.min(rest, TAP_LINGER_MAX_MS));
      return;
    }
    tapping = false;
    sync();
  };

  const unbind =
    hoverClip || tapClip
      ? bindTriggers(
          triggerHost(ctx.host),
          {
            hover(on) {
              hovering = on;
              sync();
            },
            tap(on, done) {
              if (!on) return endTap(done === true);
              clearTimeout(tapTimer);
              if (motion.reduced()) return;
              if (current === tapClip) {
                stopTrack();
                current = undefined;
              }
              tapping = true;
              sync();
            },
          },
          { hover: !!hoverClip, tap: !!tapClip },
        )
      : () => undefined;

  sync();
  return {
    update(next) {
      hass = next.hass;
      const states = stateClips.map((c) => hass?.states?.[c.play.entity]);
      if (states.length === seen.length && states.every((s, i) => s === seen[i])) return;
      seen = states;
      sync();
    },
    release() {
      clearTimeout(tapTimer);
      unbind();
      motion.stop();
      unwatchOffscreen(svg);
      stopTrack();
      svg.removeAttribute(HOLD_ATTR);
      releasePause();
    },
  };
}
