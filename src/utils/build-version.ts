import { VERSION } from '../version';

declare const __MC_BUILD_VERSION__: string | undefined;

/** The release this bundle was built from (the webpack define; VERSION in tests). Lazy chunk entries export it as BUILD. */
export const BUILD_VERSION: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;
