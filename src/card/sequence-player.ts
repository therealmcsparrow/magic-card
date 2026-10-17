import { hashString, type Schedule } from '../anim-studio/compile';
import { unwatchOffscreen, watchOffscreen } from '../icons/offscreen';

/*
 * Custom sequences (src/anim-studio/compile.ts schedules) on Web Animations: the resolver
 * registers a run and marks its element `data-mc-seq="<key> ..."`; after each render the card
 * syncs the players of its shadow root. One player per element: its sequences start when the
 * element is on screen, pause off-screen (the shared IntersectionObserver) and never run for
 * reduced motion. A staggered sequence runs on the element's children one after another.
 */

export interface SequenceRun extends Schedule {
  /** s before the first cycle */
  delay: number;
  /** Times to play the cycle; undefined: the schedule's loop (forever, or once). */
  cycles?: number;
  /** Time factor (an entry's duration over the schedule's total). */
  scale: number;
}

/**
 * Runs by key, oldest first. Every render registers its runs again (a dropped one comes back) and
 * the card syncs its players right after, so only the newest are needed: the oldest go over the cap.
 */
const registry = new Map<string, SequenceRun>();
const REGISTRY_CAP = 64;

/** Register a run; its key goes into `data-mc-seq`. */
export function registerSequence(run: SequenceRun): string {
  const key = `s${hashString(JSON.stringify(run))}`;
  registry.set(key, run);
  if (registry.size > REGISTRY_CAP) registry.delete(registry.keys().next().value!);
  return key;
}

export const sequenceRun = (key: string): SequenceRun | undefined => registry.get(key);

export const reducedMotion = (): boolean => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Children a stagger runs on: content, not the decorative layers (aria-hidden, mc-* elements). */
const contentChildren = (el: Element): HTMLElement[] =>
  [...el.children].filter((c): c is HTMLElement => c.getAttribute('aria-hidden') !== 'true' && !c.localName.startsWith('mc-') && c.localName !== 'style');

class Run {
  private _anims: Animation[] = [];
  private _cycle = 0;
  private _stopped = false;
  private _on = true;

  constructor(
    private readonly _el: HTMLElement,
    private readonly _run: SequenceRun,
  ) {}

  private _targets(): HTMLElement[] {
    const base = this._run.stagger !== undefined ? contentChildren(this._el) : [this._el];
    return base.map((t) => (this._run.target === 'icon' ? (t.querySelector<HTMLElement>('.mc-anim-icon') ?? t) : t));
  }

  private _start(): void {
    if (this._stopped || reducedMotion() || !this._run.steps.length) return;
    const { steps, scale } = this._run;
    const anims: Animation[] = [];
    this._targets().forEach((t, i) => {
      if (typeof t.animate !== 'function') return;
      const offset = (this._cycle === 0 ? this._run.delay : 0) + i * (this._run.stagger ?? 0);
      for (const s of steps) {
        const frames = s.origin ? s.frames.map((f) => ({ ...f, transformOrigin: s.origin })) : s.frames;
        anims.push(
          t.animate(frames, {
            duration: s.duration * scale * 1000,
            delay: (offset + s.start * scale) * 1000,
            iterations: s.iterations,
            easing: s.easing,
            fill: 'none',
          }),
        );
      }
    });
    this._anims = anims;
    if (!anims.length) return;
    if (!this._on) for (const a of anims) a.pause();
    Promise.all(anims.map((a) => a.finished)).then(
      () => {
        if (this._stopped || this._anims !== anims) return;
        this._cycle++;
        const more = this._run.cycles !== undefined ? this._cycle < this._run.cycles : this._run.loop;
        this._anims = [];
        if (more) this._start();
      },
      () => undefined, // cancelled
    );
  }

  visible(on: boolean): void {
    if (this._stopped) return;
    this._on = on;
    if (!on) for (const a of this._anims) a.pause();
    else if (this._anims.length) for (const a of this._anims) a.play();
    else if (this._cycle === 0) this._start();
  }

  get playing(): boolean {
    return this._anims.some((a) => a.playState === 'running');
  }

  stop(): void {
    this._stopped = true;
    for (const a of this._anims) a.cancel();
    this._anims = [];
  }
}

/** The sequences of one element. */
export class SequencePlayer {
  private readonly _runs: Run[];

  constructor(
    readonly el: HTMLElement,
    readonly key: string,
  ) {
    this._runs = key
      .split(' ')
      .map((k) => registry.get(k))
      .filter((r): r is SequenceRun => !!r)
      .map((r) => new Run(el, r));
    // without an IntersectionObserver nothing reports: start right away
    if (!watchOffscreen(el, (on) => this._runs.forEach((r) => r.visible(on)))) this._runs.forEach((r) => r.visible(true));
  }

  /** Some step is playing now (tests, probes). */
  get playing(): boolean {
    return this._runs.some((r) => r.playing);
  }

  /** Off-screen report (also what the observer calls). */
  visible(on: boolean): void {
    this._runs.forEach((r) => r.visible(on));
  }

  stop(): void {
    unwatchOffscreen(this.el);
    this._runs.forEach((r) => r.stop());
  }
}

/** Start / stop the players of `root` to match its `[data-mc-seq]` elements. */
export function syncSequences(root: ParentNode | undefined, players: Map<Element, SequencePlayer>): void {
  const seen = new Set<Element>();
  for (const el of root?.querySelectorAll<HTMLElement>('[data-mc-seq]') ?? []) {
    const key = el.getAttribute('data-mc-seq') ?? '';
    seen.add(el);
    const cur = players.get(el);
    if (cur?.key === key) continue;
    cur?.stop();
    players.set(el, new SequencePlayer(el, key));
  }
  for (const [el, p] of players) {
    if (seen.has(el)) continue;
    p.stop();
    players.delete(el);
  }
}

export function stopSequences(players: Map<Element, SequencePlayer>): void {
  for (const p of players.values()) p.stop();
  players.clear();
}
