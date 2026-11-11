// Loads the studio fonts from the lazy studio-fonts chunk and registers the faces on document.fonts, once.
// Resolves false and leaves the system fonts when FontFace is missing, the chunk fails or a face cannot load.
let pending: Promise<boolean> | undefined;

async function load(): Promise<boolean> {
  if (typeof FontFace !== 'function' || !document.fonts) return false;
  const { STUDIO_FONT_FACES } = await import(/* webpackChunkName: "studio-fonts" */ './data');
  const faces = STUDIO_FONT_FACES.map((f) => new FontFace(f.family, `url(data:font/woff2;base64,${f.data})`, { weight: f.weight, display: 'swap' }));
  await Promise.all(faces.map((f) => f.load()));
  for (const f of faces) document.fonts.add(f);
  return true;
}

/** Idempotent; a failed attempt may be retried by the next call. */
export const loadStudioFonts = (): Promise<boolean> =>
  (pending ??= load().catch((err: unknown) => {
    console.warn('Magic Card: studio fonts not loaded', err);
    return false;
  }).then((ok) => {
    if (!ok) pending = undefined;
    return ok;
  }));
