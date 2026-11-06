import type { AnimationDoc } from '../anim-studio/model';
import type { MirrorFlag } from '../contracts/icon-library';

// Plays a mirror-flagged icon flipped on the vertical axis under a right-to-left direction: the flip sits on the icon's host
// element, so pivots, paths and anything drawn inside it flip together.

/** The individual `scale` value of a flipped host. */
export const MIRROR_SCALE = '-1 1';

const scaleOk = (): boolean => typeof CSS === 'undefined' || typeof CSS.supports !== 'function' || CSS.supports('scale', '1');

/** Flips `host` when the flag is `mirror` and the direction is `rtl`; any other combination leaves it unflipped. */
export function applyMirror(host: HTMLElement, flag: MirrorFlag | undefined, dir: string): void {
  const flip = flag === 'mirror' && dir === 'rtl';
  if (scaleOk()) {
    if (flip) host.style.setProperty('scale', MIRROR_SCALE);
    else host.style.removeProperty('scale');
  } else if (flip) host.style.transform = 'scaleX(-1)';
  else if (host.style.transform === 'scaleX(-1)') host.style.removeProperty('transform');
}

/** The mirror flag of the document behind a run key (`mcc-<id>-<hash>`), when `lookup` knows it. */
export function mirrorOfRun(run: string | undefined, lookup: ((id: string) => AnimationDoc | undefined) | undefined): MirrorFlag | undefined {
  const m = run && /^mcc-(.+)-[0-9a-z]+$/.exec(run);
  const flag = m && lookup ? lookup(m[1])?.mirror : undefined;
  return flag === 'mirror' || flag === 'keep' ? flag : undefined;
}
