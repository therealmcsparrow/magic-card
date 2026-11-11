// Registers the studio font faces on document.fonts, once, and skips faces the document already holds.
// Resolves false and leaves the system fonts when FontFace is missing, the faces cannot be read or one cannot load.
export type StudioFontFace = { family: string; weight: string; data: string };

const bare = (s: string): string => s.replace(/^["']|["']$/g, '');

function held(): Set<string> {
  const keys = new Set<string>();
  document.fonts.forEach((f) => keys.add(`${bare(f.family)}/${f.weight}`));
  return keys;
}

async function register(get: () => Promise<readonly StudioFontFace[]>): Promise<boolean> {
  if (typeof FontFace !== 'function' || !document.fonts) return false;
  const have = held();
  const wanted = (await get()).filter((f) => !have.has(`${f.family}/${f.weight}`));
  const faces = wanted.map((f) => new FontFace(f.family, `url(data:font/woff2;base64,${f.data})`, { weight: f.weight, display: 'swap' }));
  await Promise.all(faces.map((f) => f.load()));
  for (const f of faces) document.fonts.add(f);
  return true;
}

/** Builds an idempotent loader; a failed attempt may be retried by the next call. */
export function createFontLoader(get: () => Promise<readonly StudioFontFace[]>): () => Promise<boolean> {
  let pending: Promise<boolean> | undefined;
  return () =>
    (pending ??= register(get)
      .catch((err: unknown) => {
        console.warn('Magic Card: studio fonts not loaded', err);
        return false;
      })
      .then((ok) => {
        if (!ok) pending = undefined;
        return ok;
      }));
}
