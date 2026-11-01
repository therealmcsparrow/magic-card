import { SHARE_KIT_VERSION } from '../contracts/share-kit';
import type { CreateShareKit, ShareKit } from '../contracts/share-kit';
import { checkCss, importNoticeOf, readCardWith } from './card';
import { toPlaceholders } from './placeholders';
import { scanMarkers, strictValue, themeValue } from './strict';

// Chunk entry of dist/magic-card-share-kit.js (share-kit 1.0.0): the strict value checks the transfer chunk reads files through.

const unavailable = (what: string) => (): never => {
  throw new Error(`share-kit: ${what} is not available`);
};

export const createShareKit: CreateShareKit = (helpers) => {
  const kit: ShareKit = {
    version: SHARE_KIT_VERSION,
    checkValue: strictValue,
    themeValue,
    scanMarkers,
    checkCss,
    readCard: readCardWith(helpers),
    placeholderItems: toPlaceholders,
    findPlaceholders: unavailable('findPlaceholders'),
    applyMapping: unavailable('applyMapping'),
    demoStates: unavailable('demoStates'),
    importNotice: importNoticeOf,
    previewSafe: unavailable('previewSafe'),
    checkContrast: unavailable('checkContrast'),
  };
  return kit;
};
