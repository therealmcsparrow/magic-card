import {
  animationName,
  block,
  cssWriter,
  keyframeListCss,
  keyframesRule,
  pathDecls,
  useV2Compiler,
  type CompileOptions,
} from './compile';
import { Checker, customRefId, isCustomRef, type AnimationDoc } from './model';
import { validateV2, type Binding, type Clip, type Rig, type TargetRef } from './model-v2';

/*
 * The v2 parts of a document for the lazy runtime chunk (src/anim-runtime): per-target keyframes
 * (tracks), and the rig, clips and bindings as validated. Pure. Loading this file registers
 * compileV2 with compile.ts (through src/utils/anim-hooks.ts), which then attaches it as `CompiledAnimation.v2` when
 * docNeedsRuntime(doc). The card bundle does not import it (its runtime chunk does), so
 * magic-card.js stays small.
 */

export interface CompiledTrack {
  target: TargetRef;
  /** `@keyframes` name, `${animationName(doc)}-t${index}` (index into the checked doc.tracks). */
  name: string;
  /** The track's rules ('' when it has nothing to play). */
  css: string;
  /** transform-origin of the target (the track's own; icon parts fall back to their rig origin). */
  origin?: string;
  /**
   * Extra keyframes names to play together with `name` on the same target, same timing: lanes
   * split off for per-lane easing (`<name>-l<lane>`) and the motion path (`<name>-path`, last, so
   * it wins over x / y / rotate).
   */
  lanes?: string[];
}

export interface CompiledV2 {
  tracks: CompiledTrack[];
  rig?: Rig;
  /** The document's clips minus the skipped ones. */
  clips?: Clip[];
  bindings?: Binding[];
  /** Indices (into doc.clips) of clips dropped by the recursion guard: they play a document that has clips itself. */
  skipped?: number[];
}

const trackCache = new WeakMap<AnimationDoc, CompiledTrack[]>();

function tracksCss(doc: AnimationDoc, docName: string): CompiledTrack[] {
  const w = cssWriter(doc.id);
  return (doc.tracks ?? []).map((t, i): CompiledTrack => {
    const name = `${docName}-t${i}`;
    const rules: string[] = [];
    const lanes: string[] = [];
    if (t.keyframes.length) {
      const r = keyframeListCss(name, t.keyframes, w);
      rules.push(r.css);
      lanes.push(...r.lanes);
    }
    if (t.path) {
      // only a path: it is the track's main animation; with keyframes, an extra one played last
      const pathName = t.keyframes.length ? `${name}-path` : name;
      const spec = { d: t.path.d, units: 'px' as const, follow_rotation: !!t.path.follow_rotation, subject: 'element' as const };
      rules.push(keyframesRule(pathName, pathDecls(spec, w, ['px', 'px']).map(([at, d]) => block(`${at}%`, d))));
      if (pathName !== name) lanes.push(pathName);
    }
    return { target: t.target, name, css: rules.join('\n'), ...(t.origin ? { origin: t.origin } : {}), ...(lanes.length ? { lanes } : {}) };
  });
}

/** The document with its v2 fields checked leniently (invalid entries dropped), cached per document. */
const checked = new WeakMap<AnimationDoc, AnimationDoc>();
function checkedDoc(doc: AnimationDoc): AnimationDoc {
  let d = checked.get(doc);
  if (!d) {
    const v1: AnimationDoc = { ...doc };
    delete v1.rig;
    delete v1.tracks;
    delete v1.clips;
    delete v1.bindings;
    d = { ...v1, ...validateV2(doc as unknown as Record<string, unknown>, new Checker()) };
    checked.set(doc, d);
  }
  return d;
}

/**
 * One `@keyframes` per track, named `${animationName(doc)}-t${index}` (index into the checked
 * tracks), amplitudes scaled by the entry's intensity like the main keyframes. The tracks are
 * re-checked leniently first (any document, also an unchecked one from a lookup, is safe to pass).
 * A track path is sampled (viewBox units for icon parts, px for card parts). Reduced motion: no
 * tracks (nothing plays).
 */
export function compileTracks(doc: AnimationDoc, opts: { reducedMotion?: boolean } = {}): CompiledTrack[] {
  if (opts.reducedMotion || !Array.isArray(doc.tracks) || !doc.tracks.length) return [];
  let out = trackCache.get(doc);
  if (!out) trackCache.set(doc, (out = tracksCss(checkedDoc(doc), animationName(doc))));
  return out;
}

/**
 * Everything the runtime chunk needs from a document (v2 fields re-checked leniently, so a
 * document the card kept unchecked is safe). Track names use the given document's animation name
 * (the run key). Clips that play a document which has clips itself are skipped (no recursion); a
 * missing document is left to the runtime (it may load later).
 */
export function compileV2(doc: AnimationDoc, opts: CompileOptions = {}): CompiledV2 {
  const d = checkedDoc(doc);
  const tracks = compileTracks(doc, opts);
  const skipped: number[] = [];
  const clips = d.clips?.filter((c, i) => {
    if (!isCustomRef(c.animation)) return true;
    const ref = opts.lookup?.(customRefId(c.animation));
    if (ref === doc || (ref && Array.isArray(ref.clips) && ref.clips.length)) {
      skipped.push(i);
      return false;
    }
    return true;
  });
  return {
    tracks,
    ...(d.rig ? { rig: d.rig } : {}),
    ...(clips ? { clips } : {}),
    ...(d.bindings ? { bindings: d.bindings } : {}),
    ...(skipped.length ? { skipped } : {}),
  };
}

useV2Compiler(compileV2);
