// Which library entries a release adds, for the "new" mark on studio library tiles (contract icon-library 1.3.0).
import { BUILD_VERSION } from '../../utils/build-version';

export interface ReleaseNotes {
  /** The release without a pre-release suffix, YYYY.MM.NN. */
  release: string;
  /** Ids of the library entries first shipped in that release. */
  newEntries: readonly string[];
}

export const RELEASE_NOTES: ReleaseNotes = { release: '2026.10.12', newEntries: [] };

/** True when `build` (its `-beta.N` suffix dropped) is the notes' release and `id` is listed; false for anything malformed. */
export function isNewInRelease(id: string, build: string = BUILD_VERSION, notes: ReleaseNotes = RELEASE_NOTES): boolean {
  if (typeof id !== 'string' || typeof build !== 'string' || !notes || typeof notes.release !== 'string' || !Array.isArray(notes.newEntries)) return false;
  const release = build.replace(/-.*$/, '');
  return /^\d{4}\.\d{2}\.\d{2}$/.test(release) && release === notes.release && notes.newEntries.includes(id);
}
