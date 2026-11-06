import { TEMPLATE_CMD, TEMPLATE_PROBE_MAX_MS, TEMPLATE_PROBE_MIN_MS, TEMPLATE_RETRY_MS, type TemplateHass, type TemplateSource, type TemplateState } from '../contracts/mcu-templates';

// Template source (Module `template-source`, contract mcu-templates 1.0.0, src/contracts/mcu-templates.ts), one page-wide instance.
// Per HA connection and template name there is one `subscribe_template`, shared by every card that watches the name.
// Replies are `unknown` and narrowed here; anything unexpected is 'unavailable' plus one warning.

type Conn = NonNullable<TemplateHass['connection']>;
type Listener = (state: TemplateState) => void;

interface Entry {
  listeners: Set<Listener>;
  state?: TemplateState;
  unsub?: () => void;
  timer?: ReturnType<typeof setTimeout>;
  busy?: boolean;
  dead?: boolean;
  /** The last failure may pass: retry on 'ready' and after TEMPLATE_RETRY_MS. */
  retry?: boolean;
  /** Generation of the latest subscribe attempt. */
  gen?: number;
}

interface Link {
  hass: TemplateHass;
  entries: Map<string, Entry>;
  /** An MCU without subscribe_template: one shared get_templates for the page. */
  legacy?: boolean;
  all?: Promise<unknown>;
  /** Slow re-probe of subscribe_template while legacy (MCU may still be loading). */
  probeTimer?: ReturnType<typeof setTimeout>;
  probes: number;
  onReady: () => void;
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const has = (o: object, k: string): boolean => Object.prototype.hasOwnProperty.call(o, k);
const codeOf = (err: unknown): string => String((err as { code?: unknown } | undefined)?.code ?? '');

const links = new Map<Conn, Link>();
const warned = new Set<string>();

const warnOnce = (kind: string, err: unknown): void => {
  if (warned.has(kind)) return;
  warned.add(kind);
  console.warn('Magic Card: template unavailable', kind, err);
};

function set(entry: Entry, state: TemplateState): void {
  entry.state = state;
  entry.retry = false;
  for (const l of [...entry.listeners]) l(state);
}

function fail(link: Link, entry: Entry, n: string, err: unknown, retry: boolean): void {
  warnOnce(codeOf(err) || 'error', err);
  set(entry, { status: 'unavailable' });
  entry.retry = retry;
  if (retry && !entry.dead) entry.timer = setTimeout(() => begin(link, entry, n), TEMPLATE_RETRY_MS);
}

/** Narrow a template record ({ config, ... }) to a state. */
function toState(tpl: unknown): TemplateState | undefined {
  return isObj(tpl) && isObj(tpl.config) ? { status: 'ready', config: tpl.config } : undefined;
}

function onEvent(link: Link, entry: Entry, n: string, msg: unknown): void {
  if (!isObj(msg) || msg.name !== n) return;
  if (msg.action === 'deleted') return set(entry, { status: 'missing' });
  const state = msg.action === 'saved' ? toState(msg.template) : undefined;
  if (state) set(entry, state);
  else fail(link, entry, n, new Error('unexpected template event'), false);
}

function readAll(link: Link, entry: Entry, n: string): void {
  link.all ??= link.hass.callWS({ type: TEMPLATE_CMD.getTemplates });
  link.all.then(
    (res) => {
      if (entry.dead) return;
      const all = isObj(res) && isObj(res.templates) ? res.templates : {};
      set(entry, has(all, n) ? (toState(all[n]) ?? { status: 'missing' }) : { status: 'missing' });
    },
    (err) => {
      // unauthorized / unknown_command: no timer retry; the next 'ready' probes subscribe_template again
      link.all = undefined;
      if (!entry.dead) fail(link, entry, n, err, !['unauthorized', 'unknown_command'].includes(codeOf(err)));
    },
  );
}

/** Slow re-probe of subscribe_template while the link is in legacy mode: 5, 10, 20, then every 30 s. */
function scheduleProbe(link: Link): void {
  if (link.probeTimer || !link.legacy) return;
  const delay = Math.min(TEMPLATE_PROBE_MIN_MS * 2 ** link.probes++, TEMPLATE_PROBE_MAX_MS);
  link.probeTimer = setTimeout(() => {
    link.probeTimer = undefined;
    const first = link.entries.entries().next().value;
    if (link.legacy && first) begin(link, first[1], first[0], true);
  }, delay);
}

function begin(link: Link, entry: Entry, n: string, probing = false): void {
  if (entry.dead || entry.busy || entry.unsub) return;
  clearTimeout(entry.timer);
  if (link.legacy && !probing) return readAll(link, entry, n);
  entry.busy = true;
  // A 'ready' starts a new generation: answers and events of an older one belong to a dead socket.
  const g = (entry.gen = (entry.gen ?? 0) + 1);
  const current = (): boolean => entry.gen === g;
  const leaveLegacy = (): void => {
    link.legacy = false;
    link.all = undefined;
    link.probes = 0;
    for (const [m, e] of link.entries) if (e !== entry) begin(link, e, m);
  };
  const failed = (err: unknown): void => {
    if (!current()) return;
    entry.busy = false;
    const unknown = codeOf(err) === 'unknown_command';
    if (probing) {
      if (unknown) return scheduleProbe(link);
      leaveLegacy();
      if (entry.dead) return;
    }
    if (entry.dead) return;
    if (unknown) {
      link.legacy = true;
      readAll(link, entry, n);
      scheduleProbe(link);
    } else fail(link, entry, n, err, true);
  };
  try {
    Promise.resolve(link.hass.connection!.subscribeMessage<unknown>((msg) => current() && !entry.dead && onEvent(link, entry, n, msg), { type: TEMPLATE_CMD.subscribeTemplate, name: n }, { resubscribe: false })).then((unsub) => {
      // stale: do not call its unsub, the id is meaningless on the new socket
      if (!current()) return;
      entry.busy = false;
      if (typeof unsub !== 'function') return;
      if (probing) leaveLegacy();
      if (entry.dead) unsub();
      else entry.unsub = unsub;
    }, failed);
  } catch (err) {
    failed(err);
  }
}

function linkFor(hass: TemplateHass, conn: Conn): Link {
  let link = links.get(conn);
  if (!link) {
    const l: Link = {
      hass,
      entries: new Map(),
      probes: 0,
      onReady: () => {
        // Reconnected: the old socket and its subscriptions are gone, and so are their ids. Never send
        // the old unsub on the new socket (the ids restart there and could cancel another subscription).
        // This module owns re-subscription (resubscribe:false): leave legacy mode, forget in-flight
        // subscribes (they never settle) and subscribe again; MCU may have finished loading.
        l.legacy = false;
        l.all = undefined;
        l.probes = 0;
        clearTimeout(l.probeTimer);
        l.probeTimer = undefined;
        for (const [n, e] of l.entries) {
          e.unsub = undefined;
          e.busy = false;
          begin(l, e, n);
        }
      },
    };
    conn.addEventListener?.('ready', l.onReady);
    links.set(conn, (link = l));
  }
  return link;
}

function drop(conn: Conn, link: Link): void {
  conn.removeEventListener?.('ready', link.onReady);
  clearTimeout(link.probeTimer);
  links.delete(conn);
}

export const templateSource: TemplateSource = {
  watch(hass, n, onChange) {
    const conn = hass.connection;
    if (!conn) {
      onChange({ status: 'unavailable' });
      return () => undefined;
    }
    const link = linkFor(hass, conn);
    let entry = link.entries.get(n);
    const fresh = !entry;
    if (!entry) link.entries.set(n, (entry = { listeners: new Set() }));
    const e = entry;
    e.listeners.add(onChange);
    if (e.state) onChange(e.state);
    if (fresh) begin(link, e, n);
    return () => {
      if (!e.listeners.delete(onChange) || e.listeners.size) return;
      e.dead = true;
      clearTimeout(e.timer);
      e.unsub?.();
      link.entries.delete(n);
      if (!link.entries.size) drop(conn, link);
    };
  },
  reset() {
    for (const [conn, link] of links) {
      for (const e of link.entries.values()) {
        e.dead = true;
        clearTimeout(e.timer);
        e.unsub?.();
      }
      drop(conn, link);
    }
    warned.clear();
  },
};
