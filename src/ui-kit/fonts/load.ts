// Studio font loader for the card editor chunk: the faces travel inside that chunk (static import).
import { STUDIO_FONT_FACES } from './data';
import { createFontLoader } from './register';

let loader: (() => Promise<boolean>) | undefined;

export const loadStudioFonts = (): Promise<boolean> => (loader ??= createFontLoader(() => Promise.resolve(STUDIO_FONT_FACES)))();
