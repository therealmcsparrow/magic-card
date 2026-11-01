import type { TemplateResult } from 'lit';
import { CONNECTION_GRACE_MS, MAX_TIMER_MS, RECONNECTED_HOLD_MS, type StatusController, type StatusFace, type StatusHost } from '../contracts/card-status';
import type { HomeAssistant } from '../types';
import { statusOverlay } from './faces';
import { collectQuiet, nextStaleAt, staleFace, type Quiet } from './stale';

// The status controller: one per card; grace, hold and stale timers; the face to show now and whether its sentence is open.

type Timer = ReturnType<typeof setTimeout> | undefined;

class Controller implements StatusController {
  private shut = false;
  private open = false;
  private hass?: HomeAssistant;
  private pairs: Quiet[] = [];
  private attached: boolean;
  private lostShown = false;
  private lostSince = 0;
  private backing = false;
  private grace: Timer;
  private hold: Timer;
  private stale: Timer;
  private current?: StatusFace;
  private key = '';

  constructor(private readonly host: StatusHost) {
    this.attached = (host as { isConnected?: boolean }).isConnected !== false;
  }

  get preview(): boolean {
    return this.shut;
  }

  set preview(v: boolean) {
    if (v === this.shut) return;
    this.shut = v;
    this.sync();
  }

  config(config: unknown): void {
    this.pairs = collectQuiet(config);
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
    return statusOverlay(this.current, this.hass, this.open, this.toggle);
  }

  connected(): void {
    this.attached = true;
    this.sync();
  }

  private toggle = (): void => {
    this.setOpen(!this.open);
    this.host.requestUpdate();
  };

  private onKey = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape') return;
    this.setOpen(false);
    this.host.requestUpdate();
  };

  private setOpen(v: boolean): void {
    if (v === this.open) return;
    this.open = v;
    if (v) document.addEventListener('keydown', this.onKey);
    else document.removeEventListener('keydown', this.onKey);
  }

  disconnected(): void {
    this.attached = false;
    this.setOpen(false);
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
    if (!h || this.shut) {
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
    const next = nextStaleAt(this.pairs, h, now);
    if (next === undefined) return;
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
    return staleFace(this.pairs, h);
  }

  private publish(): void {
    const f = this.current = this.compute();
    const key = f ? `${f.kind}|${'entity' in f ? f.entity : ''}|${'since' in f ? f.since : ''}` : '';
    if (key === this.key) return;
    this.key = key;
    this.setOpen(false);
    this.host.requestUpdate();
  }
}

/** The controller of one card (contract card-status 1.0.0). */
export const createStatusController = (host: StatusHost): StatusController => new Controller(host);
