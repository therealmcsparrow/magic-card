import { SHARE_KIT_VERSION } from '../contracts/share-kit';
import type { CreateShareKit, ShareKit } from '../contracts/share-kit';
import { checkCss, importNoticeOf, readCardWith } from './card';
import { demoStates } from './demo-states';
import { applyMapping, findPlaceholders } from './mapping';
import { previewSafe } from './preview';
import { toPlaceholders } from './placeholders';
import { styleDrops } from './style-drops';
import { scanMarkers, strictValue, themeValue } from './strict';
import { checkTheme, contrastHeading, contrastWarnings } from './theme-check';
import { importPreview } from './import-preview';
import { contrastView, exportNotes, runView, untrustedNotice, untrustedView } from './notice';
import { mappingView } from './mapping';
import './anim-preview';
import './map-step';

// Chunk entry of dist/magic-card-share-kit.js (share-kit 1.0.0): the strict value checks the transfer chunk reads files through.

export const createShareKit: CreateShareKit = (helpers) => {
  const kit: ShareKit = {
    version: SHARE_KIT_VERSION,
    checkValue: strictValue,
    themeValue,
    scanMarkers,
    checkCss,
    readCard: readCardWith(helpers),
    placeholderItems: toPlaceholders,
    findPlaceholders,
    applyMapping,
    demoStates,
    importNotice: importNoticeOf,
    previewSafe,
    styleDrops,
    checkContrast: checkTheme,
    views: { untrustedNotice, untrustedView, exportNotes, runView, contrastHeading, contrastWarnings, contrastView, mappingView, importPreview },
  };
  return kit;
};
