/** A slug for an id from a file name or key (`Doorbell wiggle` -> `doorbell-wiggle`). */
export function slug(s: string, fallback: string): string {
  const out = s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .replace(/-+$/g, '');
  return out || fallback;
}

/** `id`, or `id-2`, `id-3`...: the first id not taken (same rule as the studio's uniqueId). */
export function uniqueId(id: string, taken: (id: string) => boolean, sep = '-'): string {
  if (!taken(id)) return id;
  for (let n = 2; ; n++) {
    const next = `${id.slice(0, 60)}${sep}${n}`;
    if (!taken(next)) return next;
  }
}
