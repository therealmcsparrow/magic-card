import { IMAGE_ID_RE } from '../contracts/svg-image';

// What an effect can be put on: the whole image, a group or an element of the drawing, picked by pointer or from a list.

export interface ImageTarget {
  /** `element` for the whole image, else `part:<IMAGE_ID_RE id>`. */
  ref: 'element' | `part:${string}`;
  kind: 'image' | 'group' | 'element';
  id?: string;
  /** True when the element had no usable id: the id is new and must be written into the drawing before saving. */
  generated: boolean;
  /** The drawing's element; absent for the whole image. */
  element?: Element;
}

const TARGETABLE = new Set(['g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'use', 'image']);
const NOT_DRAWN = new Set(['defs', 'clippath', 'mask', 'symbol', 'pattern', 'marker', 'lineargradient', 'radialgradient', 'filter', 'metadata', 'title', 'desc']);
const GENERATED_PREFIX = 'mc-';

const given = new WeakMap<Element, Map<Element, string>>();

const tag = (e: Element): string => e.localName.toLowerCase();

const inside = (svg: SVGSVGElement, node: Node | null): node is Element => !!node && node !== svg && svg.contains(node) && node.nodeType === 1;

const drawn = (svg: SVGSVGElement, e: Element): boolean => {
  if (!TARGETABLE.has(tag(e))) return false;
  for (let p: Element | null = e.parentElement; p && p !== svg; p = p.parentElement) if (NOT_DRAWN.has(tag(p))) return false;
  return true;
};

/** The ids of one drawing read once: the first holder of each id, and on demand every id in use with the next free number. */
interface IdIndex {
  first: Map<string, Element>;
  used?: Set<string>;
  next: number;
}

const indexOf = (svg: SVGSVGElement): IdIndex => {
  const first = new Map<string, Element>();
  for (const e of svg.querySelectorAll('[id]')) {
    const id = e.getAttribute('id') ?? '';
    if (!first.has(id)) first.set(id, e);
  }
  return { first, next: 1 };
};

/** Ids in use in the drawing plus those already given out for it. */
const taken = (svg: SVGSVGElement, index: IdIndex): Set<string> => {
  const used = new Set(index.first.keys());
  for (const id of given.get(svg)?.values() ?? []) used.add(id);
  return used;
};

const usable = (index: IdIndex, e: Element): string | undefined => {
  const id = e.getAttribute('id');
  return id && IMAGE_ID_RE.test(id) && index.first.get(id) === e ? id : undefined;
};

/** The target of one element of the drawing; a bare or unusable id gets a new one that is free in the drawing. The drawing itself is not changed. */
function targetOf(svg: SVGSVGElement, e: Element, index: IdIndex): ImageTarget {
  const kind = tag(e) === 'g' ? 'group' : 'element';
  const own = usable(index, e);
  if (own) return { ref: `part:${own}`, kind, id: own, generated: false, element: e };
  let ids = given.get(svg);
  if (!ids) given.set(svg, (ids = new Map()));
  let id = ids.get(e);
  if (!id) {
    const used = (index.used ??= taken(svg, index));
    while (used.has(`${GENERATED_PREFIX}${index.next}`)) index.next += 1;
    id = `${GENERATED_PREFIX}${index.next}`;
    used.add(id);
    ids.set(e, id);
  }
  return { ref: `part:${id}`, kind, id, generated: true, element: e };
}

const WHOLE: ImageTarget = { ref: 'element', kind: 'image', generated: false };

/** The target for a clicked node: the nearest drawn element at or above it, the whole image for null or the root; undefined outside the image. */
export function pickTarget(svg: SVGSVGElement, picked: Element | null): ImageTarget | undefined {
  if (picked === null || picked === svg) return { ...WHOLE };
  if (!inside(svg, picked)) return undefined;
  for (let e: Element | null = picked; e && e !== svg; e = e.parentElement) if (drawn(svg, e)) return targetOf(svg, e, indexOf(svg));
  return { ...WHOLE };
}

/** Every target in document order, the whole image first; the keyboard list next to the canvas. */
export function listTargets(svg: SVGSVGElement): ImageTarget[] {
  const out: ImageTarget[] = [{ ...WHOLE }];
  const index = indexOf(svg);
  for (const e of svg.querySelectorAll('*')) if (drawn(svg, e)) out.push(targetOf(svg, e, index));
  return out;
}

/** Writes the generated id of a target into the drawing; returns true when it changed. */
export function commitTargetId(target: ImageTarget): boolean {
  if (!target.generated || !target.element || !target.id) return false;
  target.element.setAttribute('id', target.id);
  return true;
}

/** The element a target stands for in this drawing, found by its id. */
export function elementOf(svg: SVGSVGElement, target: ImageTarget): Element | undefined {
  if (target.ref === 'element') return svg;
  if (target.element && svg.contains(target.element)) return target.element;
  return Array.from(svg.querySelectorAll('[id]')).find((e) => e.getAttribute('id') === target.id);
}
