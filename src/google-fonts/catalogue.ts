import { GOOGLE_ALIASES } from './aliases';
import { PACKED } from './catalogue.gen';

export type GoogleCategory = 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';

export interface GoogleFamily {
  name: string;
  category: GoogleCategory;
  /** Upright weights, ascending. */
  weights: number[];
}

const CATEGORY: Record<string, GoogleCategory> = {
  s: 'sans-serif',
  e: 'serif',
  d: 'display',
  h: 'handwriting',
  m: 'monospace',
};

const GENERIC: Record<GoogleCategory, string> = {
  'sans-serif': 'sans-serif',
  serif: 'serif',
  display: 'sans-serif',
  handwriting: 'cursive',
  monospace: 'monospace',
};

/** The CSS generic family to fall back on for a Google category. */
export function genericFor(category: GoogleCategory): string {
  return GENERIC[category];
}

/** Unpacks `Name<TAB>category letter<TAB>weight digits` lines, in the order given. */
export function parseCatalogue(packed: string): GoogleFamily[] {
  const out: GoogleFamily[] = [];
  for (const line of packed.split('\n')) {
    const [name, code, digits] = line.split('\t');
    const category = CATEGORY[code ?? ''];
    if (!name || !category || !digits) continue;
    out.push({ name, category, weights: [...digits].map((d) => Number(d) * 100) });
  }
  return out;
}

let byName: Map<string, GoogleFamily> | undefined;

/** The catalogue entry for a family name, ignoring case and applying renames. */
export function findFamily(name: string): GoogleFamily | undefined {
  if (!byName) byName = new Map(parseCatalogue(PACKED).map((f) => [f.name.toLowerCase(), f]));
  const key = name.trim().toLowerCase();
  const current = GOOGLE_ALIASES[key] ?? key;
  return byName.get(current.toLowerCase());
}
