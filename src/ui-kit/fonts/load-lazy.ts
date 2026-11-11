// Studio font loader for the animation studio and theme editor entries: the faces come from the lazy studio-fonts chunk.
import { createFontLoader, type StudioFontFace } from './register';

let loader: (() => Promise<boolean>) | undefined;

// The only export of data.ts is the face list; it is read without its name so the entry holds no word of the font data.
async function faces(): Promise<StudioFontFace[]> {
  const ns = await import(/* webpackChunkName: "studio-fonts" */ './data');
  return Object.values(ns).find(Array.isArray) ?? [];
}

export const loadStudioFonts = (): Promise<boolean> => (loader ??= createFontLoader(faces))();
