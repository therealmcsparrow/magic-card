import { toCubicSubpaths } from '../path/core';
import { SVG_MAX_BYTES, sanitizeSvg } from '../icons/svg-sanitize';
import { ANIMATION_PRESETS } from '../utils/animation-presets';
import {
  ANIMATION_CAPS,
  ANIMATION_ID_RE,
  ICON_RE,
  ORIGIN_RE,
  PATH_RE,
  checkKeyframe,
  customRefId,
  isCustomRef,
  safeCssValue,
  useV2Validator,
  type AnimationDoc,
  type AnimationKeyframe,
  type Checker,
} from './model';
import {
  type BindProperty,
  type Binding,
  type Clip,
  type ClipWhen,
  type Rig,
  type RigGroup,
  type RigPart,
  type RigShape,
  type TargetRef,
  type Track,
} from './model-v2-core';

export * from './model-v2-core';

/*
 * Validators of the v2 document fields (types and helpers: model-v2-core.ts). Importing this file
 * turns on v2 checking in validateAnimationDoc (model.ts): the studio and the runtime chunk import
 * it; the card bundle does not, so magic-card.js stays small and keeps v2 fields as stored until
 * the runtime chunk checks them (compile-v2.ts, leniently: invalid entries are dropped one by one).
 * Every checker returns only valid entries, so its output is safe whether or not errors were
 * reported.
 */

/** Size caps of the v2 fields (the document's 64 KB cap still applies). */
export const V2_CAPS = { parts: 64, groups: 16, shapes: 48, tracks: 24, keysPerTrack: 40, clips: 12, bindings: 8 } as const;
/** Ids of parts, groups and shapes. */
export const PART_ID_RE = /^[a-z0-9][a-z0-9_-]{0,31}$/;

export const CARD_TARGETS = ['element', 'icon', 'name', 'state', 'background'] as const;
export const BIND_PROPERTIES: BindProperty[] = ['rotate', 'x', 'y', 'scale', 'opacity', 'draw', 'color_mix', 'speed', 'rotate_speed'];
export const CLIP_TRANSITIONS = ['cut', 'crossfade', 'finish'] as const;

export type ParsedTarget = { kind: (typeof CARD_TARGETS)[number]; id?: undefined } | { kind: 'part' | 'group' | 'shape'; id: string };

/** A target ref split into its kind and id; undefined when malformed. */
export function parseTargetRef(ref: unknown): ParsedTarget | undefined {
  if (typeof ref !== 'string') return undefined;
  if ((CARD_TARGETS as readonly string[]).includes(ref)) return { kind: ref as (typeof CARD_TARGETS)[number] };
  const m = /^(part|group|shape):(.+)$/.exec(ref);
  return m && PART_ID_RE.test(m[2]) ? { kind: m[1] as 'part' | 'group' | 'shape', id: m[2] } : undefined;
}

/** Targets that are pieces of the icon rig (draw-on applies to them only). */
export const isRigTarget = (ref: TargetRef | string): boolean => /^(part|group|shape):/.test(ref);

// ── validation ──

const NAME_MAX = ANIMATION_CAPS.name;
const ATTRIBUTE_RE = /^[a-z0-9_][a-z0-9_.-]{0,63}$/i;
const PRESET_IDS = (): Set<string> => new Set(ANIMATION_PRESETS.map((p) => p.id));

/** A list with a cap: over the cap, the error points at the first entry past it (`rig.parts[64]`). */
function cappedList(c: Checker, v: unknown, path: string, max: number): unknown[] | undefined {
  if (!Array.isArray(v)) return c.err(path, 'Must be a list.');
  if (v.length > max) return c.err(`${path}[${max}]`, `At most ${max} entries.`);
  return v;
}

function checkId(c: Checker, o: Record<string, unknown>, path: string, taken: Set<string>): string | undefined {
  const id = typeof o.id === 'string' ? o.id.trim() : '';
  if (!PART_ID_RE.test(id)) return c.err(`${path}.id`, 'Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).');
  if (taken.has(id)) return c.err(`${path}.id`, `Duplicate id "${id}".`);
  taken.add(id);
  return id;
}

function checkName(c: Checker, o: Record<string, unknown>, path: string, id: string): string {
  if (o.name === undefined || o.name === null || o.name === '') return id;
  if (typeof o.name !== 'string' || !o.name.trim()) return c.err(`${path}.name`, 'Must be text.') ?? id;
  const n = o.name.trim();
  return n.length > NAME_MAX ? (c.err(`${path}.name`, `At most ${NAME_MAX} characters.`) ?? id) : n;
}

function checkPoint(c: Checker, v: unknown, path: string): [number, number] | undefined {
  if (v === undefined || v === null) return undefined;
  if (!Array.isArray(v) || v.length !== 2 || v.some((n) => typeof n !== 'number' || !Number.isFinite(n) || Math.abs(n) > 10000)) {
    return c.err(path, 'Must be two numbers [x, y].');
  }
  return [v[0], v[1]];
}

function checkPathData(c: Checker, v: unknown, path: string): string | undefined {
  if (typeof v !== 'string' || !v.trim()) return c.err(path, 'Required.');
  if (v.length > ANIMATION_CAPS.pathLength) return c.err(path, `At most ${ANIMATION_CAPS.pathLength} characters.`);
  if (!PATH_RE.test(v) || !/^\s*[Mm]/.test(v)) return c.err(path, 'Not valid path data (it must start with M).');
  if (!toCubicSubpaths(v).some((s) => s.length)) return c.err(path, 'The path draws nothing.');
  return v.trim().replace(/\s+/g, ' ');
}

/** An own SVG (full `<svg>` document, or element markup when `fragment`). */
function checkSvg(c: Checker, v: unknown, path: string, fragment: boolean): string | undefined {
  if (typeof v !== 'string' || !v.trim()) return c.err(path, 'Must be SVG markup.');
  const bytes = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(v).length : v.length;
  if (bytes > SVG_MAX_BYTES) return c.err(path, 'The SVG is larger than 32 KB.');
  const full = fragment && !/^\s*<svg[\s>]/i.test(v) ? `<svg viewBox="0 0 24 24">${v}</svg>` : v;
  if (!/<svg[\s>]/i.test(full)) return c.err(path, 'No <svg> element found.');
  if (typeof DOMParser !== 'undefined') {
    const r = sanitizeSvg(full);
    if (r.error) return c.err(path, r.error);
  }
  return v;
}

function checkRig(c: Checker, raw: unknown, path: string): Rig | undefined {
  const o = c.obj(raw, path);
  if (!o) return undefined;
  const out: Rig = { parts: [] };
  const hasIcon = o.icon !== undefined && o.icon !== null && o.icon !== '';
  const hasSvg = o.svg !== undefined && o.svg !== null && o.svg !== '';
  if (hasIcon && hasSvg) c.err(path, 'Set icon or svg, not both.');
  if (hasIcon) {
    if (typeof o.icon === 'string' && ICON_RE.test(o.icon.trim())) out.icon = o.icon.trim();
    else c.err(`${path}.icon`, 'Must be an icon id like mdi:bell.');
  }
  if (hasSvg) {
    const svg = checkSvg(c, o.svg, `${path}.svg`, false);
    if (svg) out.svg = svg;
  }

  // one id space for parts, groups and shapes (the later duplicate is the error)
  const ids = new Set<string>();
  const parts = o.parts === undefined ? [] : cappedList(c, o.parts, `${path}.parts`, V2_CAPS.parts);
  parts?.forEach((r, i) => {
    const p = `${path}.parts[${i}]`;
    const po = c.obj(r, p);
    if (!po) return;
    const id = checkId(c, po, p, ids);
    if (!id) return;
    const part: RigPart = { id, name: checkName(c, po, p, id) };
    const hasFrom = po.from !== undefined && po.from !== null;
    const hasOwn = po.svg !== undefined && po.svg !== null && po.svg !== '';
    if (hasFrom === hasOwn) {
      c.err(p, 'Set one of from or svg.');
      return;
    }
    if (hasFrom) {
      const list = c.list(po.from, `${p}.from`, 256, 1);
      const from: number[] = [];
      list?.forEach((n, j) => {
        if (typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 4095) from.push(n);
        else c.err(`${p}.from[${j}]`, 'Must be a subpath index (a whole number from 0).');
      });
      part.from = from;
    } else {
      const svg = checkSvg(c, po.svg, `${p}.svg`, true);
      if (svg) part.svg = svg;
    }
    const origin = checkPoint(c, po.origin, `${p}.origin`);
    if (origin) part.origin = origin;
    out.parts.push(part);
  });

  if (o.groups !== undefined && o.groups !== null) {
    const partIds = new Set(out.parts.map((x) => x.id));
    const groups: RigGroup[] = [];
    cappedList(c, o.groups, `${path}.groups`, V2_CAPS.groups)?.forEach((r, i) => {
      const p = `${path}.groups[${i}]`;
      const go = c.obj(r, p);
      if (!go) return;
      const id = checkId(c, go, p, ids);
      if (!id) return;
      const members: string[] = [];
      c.list(go.parts, `${p}.parts`, V2_CAPS.parts, 1)?.forEach((m, j) => {
        if (typeof m === 'string' && partIds.has(m)) {
          if (!members.includes(m)) members.push(m);
        } else c.err(`${p}.parts[${j}]`, 'Not a part of this rig.');
      });
      const g: RigGroup = { id, name: checkName(c, go, p, id), parts: members };
      const origin = checkPoint(c, go.origin, `${p}.origin`);
      if (origin) g.origin = origin;
      if (members.length) groups.push(g);
    });
    out.groups = groups;
  }

  if (o.shapes !== undefined && o.shapes !== null) {
    const shapes: RigShape[] = [];
    cappedList(c, o.shapes, `${path}.shapes`, V2_CAPS.shapes)?.forEach((r, i) => {
      const p = `${path}.shapes[${i}]`;
      const so = c.obj(r, p);
      if (!so) return;
      const id = checkId(c, so, p, ids);
      if (!id) return;
      const d = checkPathData(c, so.d, `${p}.d`);
      const s: RigShape = { id, name: checkName(c, so, p, id), d: d ?? '', layer: 'over' };
      const fill = c.css(so, 'fill', `${p}.fill`, 'color');
      if (fill) s.fill = fill;
      const stroke = c.css(so, 'stroke', `${p}.stroke`, 'color');
      if (stroke) s.stroke = stroke;
      const sw = c.num(so, 'stroke_width', `${p}.stroke_width`, 0, 100);
      if (sw !== undefined) s.stroke_width = sw;
      const cap = c.oneOf(so, 'linecap', `${p}.linecap`, ['round', 'butt', 'square'] as const);
      if (cap) s.linecap = cap;
      s.layer = c.oneOf(so, 'layer', `${p}.layer`, ['over', 'under'] as const, 'over') ?? 'over';
      const origin = checkPoint(c, so.origin, `${p}.origin`);
      if (origin) s.origin = origin;
      if (d) shapes.push(s);
    });
    out.shapes = shapes;
  }
  return out;
}

/** A target ref that exists (rig targets need their part / group / shape). */
function checkTarget(c: Checker, v: unknown, path: string, rig: Rig | undefined): TargetRef | undefined {
  const t = parseTargetRef(v);
  if (!t) return c.err(path, 'Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.');
  if (t.id !== undefined) {
    const list = t.kind === 'part' ? rig?.parts : t.kind === 'group' ? rig?.groups : rig?.shapes;
    if (!list?.some((x) => x.id === t.id)) return c.err(path, `No ${t.kind} "${t.id}" in the rig.`);
  }
  return v as TargetRef;
}

function checkTracks(c: Checker, raw: unknown, rig: Rig | undefined): Track[] {
  const out: Track[] = [];
  const seen = new Set<string>();
  cappedList(c, raw, 'tracks', V2_CAPS.tracks)?.forEach((r, i) => {
    const p = `tracks[${i}]`;
    const o = c.obj(r, p);
    if (!o) return;
    let target = checkTarget(c, o.target, `${p}.target`, rig);
    if (target && seen.has(target)) target = c.err(`${p}.target`, 'Another track already animates this target.');
    if (target) seen.add(target);
    const allowDraw = !!target && isRigTarget(target);
    const list = o.keyframes === undefined ? [] : cappedList(c, o.keyframes, `${p}.keyframes`, V2_CAPS.keysPerTrack);
    const keyframes = (list ?? [])
      .map((k, j) => checkKeyframe(c, k, `${p}.keyframes[${j}]`, allowDraw))
      .filter((k): k is AnimationKeyframe => !!k)
      .sort((a, b) => a.at - b.at);
    const t: Track = { target: target ?? 'element', keyframes };
    if (o.origin !== undefined && o.origin !== '') {
      if (typeof o.origin === 'string' && ORIGIN_RE.test(o.origin.trim())) t.origin = o.origin.trim();
      else c.err(`${p}.origin`, 'Use keywords, lengths or percentages, e.g. "50% 100%".');
    }
    if (o.path !== undefined && o.path !== null) {
      const po = c.obj(o.path, `${p}.path`);
      if (po) {
        const d = checkPathData(c, po.d, `${p}.path.d`);
        if (d) t.path = { d, ...(po.follow_rotation !== undefined ? { follow_rotation: c.bool(po, 'follow_rotation', `${p}.path.follow_rotation`, false) } : {}) };
      }
    }
    if (target) out.push(t);
  });
  return out;
}

function checkWhen(c: Checker, raw: unknown, path: string): ClipWhen | undefined {
  const o = c.obj(raw, path);
  if (!o) return undefined;
  const keys = (['state', 'state_not', 'entity_on', 'above', 'below'] as const).filter((k) => o[k] !== undefined && o[k] !== null);
  if (keys.length !== 1) return c.err(path, 'Set one of state, state_not, entity_on, above or below.');
  const k = keys[0];
  const v = o[k];
  if (k === 'state' || k === 'state_not') {
    // YAML reads an unquoted on / off as true / false
    const s = typeof v === 'boolean' ? (v ? 'on' : 'off') : typeof v === 'string' || typeof v === 'number' ? String(v).trim() : '';
    if (!s || s.length > 255) return c.err(`${path}.${k}`, 'Must be a state (text).');
    return k === 'state' ? { state: s } : { state_not: s };
  }
  if (k === 'entity_on') return typeof v === 'boolean' ? { entity_on: v } : c.err(`${path}.entity_on`, 'Must be true or false.');
  const n = c.num(o, k, `${path}.${k}`, -1e9, 1e9);
  return n === undefined ? undefined : k === 'above' ? { above: n } : { below: n };
}

function checkClips(c: Checker, raw: unknown, selfId: string): Clip[] {
  const out: Clip[] = [];
  const presets = PRESET_IDS();
  cappedList(c, raw, 'clips', V2_CAPS.clips)?.forEach((r, i) => {
    const p = `clips[${i}]`;
    const o = c.obj(r, p);
    if (!o) return;
    const when = checkWhen(c, o.when, `${p}.when`);
    const a = typeof o.animation === 'string' ? o.animation.trim() : '';
    let ok = true;
    if (!a) ok = !!c.err(`${p}.animation`, 'Required.');
    else if (isCustomRef(a)) {
      const ref = customRefId(a);
      if (ref === selfId) ok = !!c.err(`${p}.animation`, 'A clip cannot play its own document (use self).');
      else if (!ANIMATION_ID_RE.test(ref)) ok = !!c.err(`${p}.animation`, 'Not a valid animation id.');
    } else if (a !== 'self' && a !== 'none' && !presets.has(a)) ok = !!c.err(`${p}.animation`, 'Must be self, none, a preset or custom:<id>.');
    const transition = c.oneOf(o, 'transition', `${p}.transition`, CLIP_TRANSITIONS);
    if (!when || !ok) return;
    out.push({ when, animation: a, ...(transition ? { transition } : {}) });
  });
  return out;
}

function checkBindings(c: Checker, raw: unknown, rig: Rig | undefined): Binding[] {
  const out: Binding[] = [];
  cappedList(c, raw, 'bindings', V2_CAPS.bindings)?.forEach((r, i) => {
    const p = `bindings[${i}]`;
    const o = c.obj(r, p);
    if (!o) return;
    const target = checkTarget(c, o.target, `${p}.target`, rig);
    const property = c.oneOf(o, 'property', `${p}.property`, BIND_PROPERTIES);
    if (o.property === undefined) c.err(`${p}.property`, 'Required.');
    const io = c.obj(o.input, `${p}.input`);
    let input: Binding['input'] | undefined;
    if (io) {
      const min = c.num(io, 'min', `${p}.input.min`, -1e9, 1e9, 0);
      const max = c.num(io, 'max', `${p}.input.max`, -1e9, 1e9, 100);
      if (min !== undefined && max !== undefined && min === max) c.err(`${p}.input.max`, 'Must differ from min.');
      else if (min !== undefined && max !== undefined) input = { min, max };
      if (io.attribute !== undefined && io.attribute !== null && io.attribute !== '') {
        if (typeof io.attribute === 'string' && ATTRIBUTE_RE.test(io.attribute.trim())) input = input && { attribute: io.attribute.trim(), ...input };
        else {
          c.err(`${p}.input.attribute`, 'Must be an attribute name.');
          input = undefined;
        }
      }
    }
    let output: Binding['output'] | undefined;
    const ov = o.output;
    if (!Array.isArray(ov) || ov.length !== 2) c.err(`${p}.output`, 'Must be a pair [from, to].');
    else if (property === 'color_mix') {
      const a = safeCssValue(ov[0], 'color');
      const b = safeCssValue(ov[1], 'color');
      if (a && b) output = [a, b];
      else c.err(`${p}.output`, 'color_mix needs two colours.');
    } else if (ov.every((n) => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= 1e6)) output = [ov[0] as number, ov[1] as number];
    else c.err(`${p}.output`, 'Must be two numbers (colours only for color_mix).');
    const smoothing = c.num(o, 'smoothing', `${p}.smoothing`, 0, 10);
    if (!target || !property || !input || !output) return;
    out.push({ target, property, input, output, ...(smoothing !== undefined ? { smoothing } : {}) });
  });
  return out;
}

/**
 * The v2 fields of a raw document, checked and normalised (only the fields present are returned).
 * Rig, tracks and bindings belong to keyframes documents (dropped on other kinds, like other
 * kinds' fields); clips are allowed on every kind.
 */
export function validateV2(input: Record<string, unknown>, c: Checker): Pick<AnimationDoc, 'rig' | 'tracks' | 'clips' | 'bindings'> {
  const out: Pick<AnimationDoc, 'rig' | 'tracks' | 'clips' | 'bindings'> = {};
  const present = (k: string) => input[k] !== undefined && input[k] !== null;
  const keyframes = input.kind === 'keyframes';
  let rig: Rig | undefined;
  if (keyframes && present('rig')) {
    rig = checkRig(c, input.rig, 'rig');
    if (rig) out.rig = rig;
  }
  if (keyframes && present('tracks')) out.tracks = checkTracks(c, input.tracks, rig);
  if (present('clips')) out.clips = checkClips(c, input.clips, typeof input.id === 'string' ? input.id.trim() : '');
  if (keyframes && present('bindings')) out.bindings = checkBindings(c, input.bindings, rig);
  return out;
}

useV2Validator(validateV2);
