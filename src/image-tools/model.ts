import type { ImageBinding } from '../contracts/mcu-library-images';
import { cssAspectRatio } from '../utils/aspect-ratio';

/*
 * The plain logic of the library image field: reading a reference, the drawing's shape against the card's
 * aspect_ratio, and the keys a pick writes. No DOM and no hass, so it is cheap to test.
 * REF_PREFIX, REF_RE, THUMB_RE and the two commands are the same text as in contracts/svg-image.ts and
 * contracts/mcu-library-images.ts, written out so this chunk does not carry those files' constant lists; a test keeps them equal.
 */

export const THUMB_RE = /^data:image\/(png|webp);base64,[A-Za-z0-9+/]+={0,2}$/;
export const CMD_LIST = 'magic_card_utils/images_list';
export const CMD_GET = 'magic_card_utils/images_get';

export const REF_PREFIX = 'mcu-image:';
export const REF_RE = /^mcu-image:([a-z0-9][a-z0-9_-]{0,63})$/;

/** The id of a well-formed reference. */
export const refId = (v: unknown): string | undefined => (typeof v === 'string' ? REF_RE.exec(v)?.[1] : undefined);

export const toRef = (id: string): string => REF_PREFIX + id;

/** A value the card draws as a library image (or, when malformed, as the missing state), never as a URL. */
export const isLibraryValue = (v: unknown): v is string => typeof v === 'string' && v.startsWith(REF_PREFIX);

export interface Shape {
  w: number;
  h: number;
  /** `16:9`, or a decimal when the reduced ratio has no short form. */
  label: string;
  /** w / h. */
  ratio: number;
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** The shape of a viewBox ("minX minY width height"); undefined when it cannot be read. */
export function shapeOf(viewBox: string | undefined): Shape | undefined {
  if (typeof viewBox !== 'string' || viewBox.length > 200) return undefined;
  const parts = viewBox.trim().split(/[\s,]+/);
  if (parts.length !== 4) return undefined;
  const w = Number(parts[2]);
  const h = Number(parts[3]);
  if (!(w > 0) || !(h > 0) || !Number.isFinite(w) || !Number.isFinite(h)) return undefined;
  const ratio = w / h;
  const g = Number.isInteger(w) && Number.isInteger(h) ? gcd(w, h) : 1;
  const a = w / g;
  const b = h / g;
  const label = Number.isInteger(a) && Number.isInteger(b) && Math.max(a, b) <= 100 ? `${a}:${b}` : String(Math.round(ratio * 1000) / 1000);
  return { w, h, label, ratio };
}

/** width / height of a module's aspect_ratio as the card reads it (number, 16:9, 16/9, 16x9, 56.25%); undefined when empty or unreadable. */
export function ratioValue(v: unknown): number | undefined {
  if (typeof v === 'string' && v.length > 40) return undefined;
  const css = cssAspectRatio(v, '');
  if (!css) return undefined;
  const [w, h] = css.split('/').map(Number);
  return h ? w / h : w;
}

/** Whether the card's aspect_ratio is the drawing's shape (within 0.5 %). */
export function sameShape(aspect: unknown, shape: Shape): boolean {
  const r = ratioValue(aspect);
  return r !== undefined && Math.abs(r - shape.ratio) / shape.ratio < 0.005;
}

export type FieldContext = 'module' | 'background';

/**
 * The keys a pick writes. An image module with no aspect_ratio also gets the drawing's shape (`shapeSet`, announced);
 * one that has a shape keeps it, and the field offers shapeKeys() instead. A background layer gets the reference only.
 */
export function pickKeys(context: FieldContext, module: { aspect_ratio?: unknown }, id: string, shape: Shape | undefined): { keys: Record<string, unknown>; shapeSet: boolean } {
  const keys: Record<string, unknown> = { image: toRef(id) };
  const none = module.aspect_ratio === undefined || module.aspect_ratio === null || (typeof module.aspect_ratio === 'string' && module.aspect_ratio.trim() === '');
  const shapeSet = context === 'module' && none && !!shape;
  if (shapeSet) keys.aspect_ratio = shape!.label;
  return { keys, shapeSet };
}

/** "Use the drawing's shape". */
export const shapeKeys = (shape: Shape): Record<string, unknown> => ({ aspect_ratio: shape.label });

/** The entities a drawing's connections use, each once, in order of first use. */
export function entitiesOf(bindings: readonly ImageBinding[] | undefined): string[] {
  const out: string[] = [];
  for (const b of bindings ?? []) if (typeof b.entity === 'string' && b.entity && !out.includes(b.entity)) out.push(b.entity);
  return out;
}
