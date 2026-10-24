import { IMAGE_ID_SLUG } from '../contracts/image-editor';

/** The id a new image gets from its name: lower-case a-z, 0-9 and dashes, at most 48 characters, "image" when nothing is left. */
export function imageSlug(name: string): string {
  const s = name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .replace(/-+$/, '');
  return IMAGE_ID_SLUG.test(s) ? s : 'image';
}

/** The first free id for `name`: ground-floor, ground-floor-2, ground-floor-3... */
export function freeImageId(name: string, taken: ReadonlySet<string>): string {
  const base = imageSlug(name);
  if (!taken.has(base)) return base;
  for (let i = 2; ; i++) {
    const tail = `-${i}`;
    const id = base.slice(0, 48 - tail.length).replace(/-+$/, '') + tail;
    if (!taken.has(id)) return id;
  }
}
