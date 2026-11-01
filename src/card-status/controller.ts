import type { TemplateResult } from 'lit';
import { CONNECTION_GRACE_MS, MAX_TIMER_MS, RECONNECTED_HOLD_MS, type StatusController, type StatusFace, type StatusHost } from '../contracts/card-status';
import type { HomeAssistant } from '../types';
import { parseDuration } from '../utils/timer';
import { statusOverlay } from './faces';
import { lastReport } from './time';

// The status controller: one per card; grace, hold and stale timers; the face to show now.

type Timer = ReturnType<typeof setTimeout> | undefined;
interface Quiet {
  entity: string;
  ms: number;
}

const MAX_NODES = 5000;
const MAX_QUIET_CHARS = 32;

/** quiet_time in ms, or undefined when unreadable. */
function readQuiet(v: unknown): number | undefined {
  return typeof v === 'string' && v.length > MAX_QUIET_CHARS ? undefined : parseDuration(v);
}

/** Every `entity` + `quiet_time` pair written on the same node, anywhere in the config. */
function collect(node: unknown, out: Quiet[], budget: { n: number }): void {
  if (!node || typeof node !== 'object' || budget.n-- <= 0) return;
  const o = node as Record<string, unknown>;
  if (!Array.isArray(node) && typeof o.entity === 'string' && o.quiet_time !== undefined) {
    const ms = readQuiet(o.quiet_time);
    if (ms !== undefined) out.push({ entity: o.entity, ms });
  }
  for (const v of Object.values(o)) collect(v, out, budget);
}

class Controller implements StatusController {
  preview = false;
  private hass?: HomeAssistant;
  private pairs: Quiet[] = [];
  private attached = true;
  private lostShown = false;
  private lostSince = 0;
  private backing = false;
  private grace: Timer;
  private hold: Timer;
  private stale: Timer;
  private current?: StatusFace;
  private key = '';

  constructor(private readonly host: StatusHost) {}

  config(config: unknown): void {
    this.pairs = [];
    collect(config, this.pairs, { n: MAX_NODES });
    this.sync();
  }

  hassChanged(_prev?: HomeAssistant, next?: HomeAssistant): void {
    this.hass = next;
    this.sync();
  }

  face(): StatusFace | undefined {
    return this.current;
  }

  render(): TemplateResult {
    return statusOverlay(this.current, this.hass);
  }

  connected(): void {
    this.attached = true;
    this.sync();
  }

  disconnected(): void {
    this.attached = false;
    this.stop();
    this.lostShown = false;
    this.backing = false;
    this.current = undefined;
    this.key = '';
  }

  private stop(): void {
    clearTimeout(this.grace);
    clearTimeout(this.hold);
    clearTimeout(this.stale);
    this.grace = this.hold = this.stale = undefined;
  }

  private sync(): void {
    if (!this.attached) return;
    const h = this.hass;
    if (!h || this.preview) {
      clearTimeout(this.grace);
      clearTimeout(this.hold);
      this.grace = this.hold = undefined;
      this.lostShown = this.backing = false;
    } else if (h.connected === false) this.down();
    else this.up();
    this.armStale();
    this.publish();
  }

  private down(): void {
    if (this.backing) {
      this.backing = false;
      this.lostShown = false;
    }
    clearTimeout(this.hold);
    this.hold = undefined;
    clearTimeout(this.grace);
    this.grace = undefined;
    const now = Date.now();
    const lostAt = (this.host.lostAt ??= now);
    const wait = lostAt + CONNECTION_GRACE_MS - now;
    if (wait <= 0) {
      this.lostShown = true;
      this.lostSince = lostAt;
    } else {
      this.lostShown = false;
      this.grace = setTimeout(() => {
        this.grace = undefined;
        this.sync();
      }, wait);
    }
  }

  private up(): void {
    clearTimeout(this.grace);
    this.grace = undefined;
    if (this.lostShown && !this.backing) {
      this.backing = true;
      this.hold = setTimeout(() => {
        this.hold = undefined;
        this.backing = false;
        this.lostShown = false;
        this.host.lostAt = undefined;
        this.sync();
      }, RECONNECTED_HOLD_MS);
    } else if (!this.lostShown && !this.backing) this.host.lostAt = undefined;
  }

  /** One timer to the nearest moment an entity turns stale (steps of at most 2^31 - 1 ms). */
  private armStale(): void {
    clearTimeout(this.stale);
    this.stale = undefined;
    const h = this.hass;
    if (!h) return;
    const now = Date.now();
    let next = Infinity;
    for (const p of this.pairs) {
      const ts = lastReport(h.states?.[p.entity]);
      if (ts !== undefined && ts + p.ms >= now) next = Math.min(next, ts + p.ms + 1);
    }
    if (next === Infinity) return;
    this.stale = setTimeout(() => {
      this.stale = undefined;
      this.sync();
    }, Math.min(Math.max(next - now, 0), MAX_TIMER_MS));
  }

  private compute(): StatusFace | undefined {
    const h = this.hass;
    if (!h) return undefined;
    if (this.backing) return { kind: 'back' };
    if (this.lostShown) return { kind: 'lost', since: this.lostSince };
    const now = Date.now();
    let oldest: StatusFace | undefined;
    for (const p of this.pairs) {
      const ts = lastReport(h.states?.[p.entity]);
      if (ts === undefined || ts > now || now - ts <= p.ms) continue;
      if (!oldest || ts < (oldest as { since: number }).since) oldest = { kind: 'stale', entity: p.entity, since: ts };
    }
    return oldest;
  }

  private publish(): void {
    const f = this.current = this.compute();
    const key = f ? `${f.kind}|${'entity' in f ? f.entity : ''}|${'since' in f ? f.since : ''}` : '';
    if (key === this.key) return;
    this.key = key;
    this.host.requestUpdate();
  }
}

/** The controller of one card (contract card-status 1.0.0). */
export const createStatusController = (host: StatusHost): StatusController => new Controller(host);
