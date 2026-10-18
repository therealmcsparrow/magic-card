declare const __MC_BUILD_VERSION__: string | undefined;

/** The release this chunk and the editor that loads it were built from (the webpack define; 'dev' in tests). */
export const PRESETS_BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : 'dev';
