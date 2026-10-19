import { TEMPLATE_CMD, TEMPLATE_RETRY_MS, type TemplateHass, type TemplateSource, type TemplateState } from '../contracts/mcu-templates';

/*
 * Template source (Module `template-source`, contract mcu-templates 1.0.0, src/contracts/mcu-templates.ts).
 * One page-wide instance. Per HA connection and template name there is one `subscribe_template`,
 * shared by every card that watches the name (reference counted). Replies are `unknown` and narrowed
 * here; anything unexpected is 'unavailable' plus one warning.
 */

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
}

interface Link {
  hass: TemplateHass;
  entries: Map<string, Entry>;
  /** An MCU without subscribe_template: one shared get_templates for the page. */
  legacy?: boolean;
  all?: Promise<unknown>;
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
      // a non-admin on an older MCU (unauthorized) or no MCU: no retry, it won't change
      link.all = undefined;
      if (!entry.dead) fail(link, entry, n, err, !['unauthorized', 'unknown_command'].includes(codeOf(err)));
    },
  );
}

function begin(link: Link, entry: Entry, n: string): void {
  if (entry.dead || entry.busy || entry.unsub) return;
  clearTimeout(entry.timer);
  if (link.legacy) return readAll(link, entry, n);
  entry.busy = true;
  const failed = (err: unknown): void => {
    entry.busy = false;
    if (entry.dead) return;
    if (codeOf(err) === 'unknown_command') {
      link.legacy = true;
      readAll(link, entry, n);
    } else fail(link, entry, n, err, true);
  };
  try {
    Promise.resolve(link.hass.connection!.subscribeMessage<unknown>((msg) => !entry.dead && onEvent(link, entry, n, msg), { type: TEMPLATE_CMD.subscribeTemplate, name: n })).then((unsub) => {
      entry.busy = false;
      if (typeof unsub !== 'function') return;
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
      onReady: () => {
        // reconnected: retry what failed; live subscriptions are re-sent by the websocket library
        if (l.legacy) l.all = undefined;
        for (const [n, e] of l.entries) if (e.retry || (l.legacy && e.state)) begin(l, e, n);
      },
    };
    conn.addEventListener?.('ready', l.onReady);
    links.set(conn, (link = l));
  }
  return link;
}

function drop(conn: Conn, link: Link): void {
  conn.removeEventListener?.('ready', link.onReady);
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
