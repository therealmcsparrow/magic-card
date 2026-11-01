/** The tapped update tile: remember the tap, fetch the entry file past the cache, reload. */
const KEY = 'mc-reload';

/** True when the last tap already reloaded into this same version (storage errors: false). */
export const reloadAsked = (version: string): boolean => {
  try {
    return sessionStorage.getItem(KEY) === version;
  } catch {
    return false;
  }
};

/** Stores the tap, fetches the entry file with no cache for 3 s at most (body dropped), then reloads whatever happened. */
export async function freshReload(version: string): Promise<void> {
  try {
    sessionStorage.setItem(KEY, version);
  } catch {
    /* storage denied: the first wording shows again */
  }
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 3000);
    await fetch(import.meta.url, { cache: 'reload', signal: ctl.signal }).finally(() => clearTimeout(timer));
  } catch {
    /* offline or slow: reload anyway */
  }
  location.reload();
}
