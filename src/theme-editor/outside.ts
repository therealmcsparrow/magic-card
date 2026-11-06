import { CARD_MOD_KEY_RE, contactsOtherHost, externalHosts } from '../contracts/preset-transfer';
import type { ThemeDoc } from '../contracts/theme-editor';

// Detects theme values that make the browser contact another host; the picker and editor warn about them.

/** The host names a value points at, as the browser resolves them. */
export function hostsIn(value: string): string[] {
  return externalHosts(value).hosts;
}

/** Hosts named by a theme document (flat variables and both modes); `any` is true also when no host name could be read; `unknown` when some address could not be named. */
export function outsideOf(doc: ThemeDoc | undefined): { any: boolean; unknown: boolean; hosts: string[] } {
  const hosts = new Set<string>();
  let any = false;
  let unknown = false;
  const scan = (vars: Record<string, unknown> | undefined): void => {
    for (const [k, v] of Object.entries(vars ?? {})) {
      if (typeof v !== 'string' || !contactsOtherHost(v, k)) continue;
      any = true;
      if (CARD_MOD_KEY_RE.test(k)) {
        unknown = true;
        continue;
      }
      const r = externalHosts(v);
      if (r.unknown || !r.hosts.length) unknown = true;
      for (const h of r.hosts) hosts.add(h);
    }
  };
  const d = (doc ?? {}) as Record<string, unknown>;
  scan(d);
  const modes = d.modes as Record<string, Record<string, unknown>> | undefined;
  scan(modes?.light);
  scan(modes?.dark);
  return { any, unknown, hosts: [...hosts] };
}
