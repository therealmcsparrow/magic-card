// Dev-only entry: the icon animator's path table and library for the harness pages.
// Serves the table's icons as a fake `mdi` icon pack, so the card's rig runtime and the studio
// resolve real MDI geometry without Home Assistant. Never shipped.
import { MDI_PATHS } from '../src/icon-anim/mdi-paths';
import { ICON_LIBRARY } from '../src/icon-anim/library';
import { exportAnimatedSvg } from '../src/icon-anim/animated-svg';
import { sanitizeSvg } from '../src/icons/svg-sanitize';

const sets = (window.customIconsets = window.customIconsets || {});
const prev = sets.mdi;
sets.mdi = async (name) => {
  const d = MDI_PATHS[`mdi:${name}`];
  if (d) return { path: d, viewBox: '0 0 24 24' };
  return prev ? prev(name) : undefined;
};

const geometryOf = (doc) => {
  if (doc.rig && doc.rig.svg) {
    const s = sanitizeSvg(doc.rig.svg);
    return { paths: s.paths, viewBox: s.viewBox };
  }
  return { paths: [MDI_PATHS[doc.rig.icon]], viewBox: '0 0 24 24' };
};

window.__iconAnim = { MDI_PATHS, ICON_LIBRARY, exportAnimatedSvg, geometryOf };
