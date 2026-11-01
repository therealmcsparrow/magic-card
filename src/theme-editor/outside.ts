import { contactsOtherHost, decodeCssEscapes } from '../contracts/preset-transfer';
import type { ThemeDoc } from '../contracts/theme-editor';

// Detects theme values that make the browser contact another host; the picker and editor warn about them.

const HOST = /(?:\b(?:https?|wss?|ftp):(?!\/)|\/\/)(?:[^\s/@)"'\\]*@)?(\[[0-9a-f:]+\]|[\p{L}\p{N}\p{M}._~%*-]+)/giu;

/** The host names a value points at, after CSS escapes are decoded. */
export function hostsIn(value: string): string[] {
  const out = new Set<string>();
  for (const m of decodeCssEscapes(value).matchAll(HOST)) out.add(m[1].toLowerCase());
  return [...out];
}

/** Hosts named by a theme document (flat variables and both modes); `any` is true also when no host name could be read. */
export function outsideOf(doc: ThemeDoc | undefined): { any: boolean; hosts: string[] } {
  const hosts = new Set<string>();
  let any = false;
  const scan = (vars: Record<string, unknown> | undefined): void => {
    for (const v of Object.values(vars ?? {})) {
      if (typeof v !== 'string' || !contactsOtherHost(v)) continue;
      any = true;
      for (const h of hostsIn(v)) hosts.add(h);
    }
  };
  const d = (doc ?? {}) as Record<string, unknown>;
  scan(d);
  const modes = d.modes as Record<string, Record<string, unknown>> | undefined;
  scan(modes?.light);
  scan(modes?.dark);
  return { any, hosts: [...hosts] };
}
