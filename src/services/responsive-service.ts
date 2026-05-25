import { BREAKPOINTS } from '../utils/constants';

export type Breakpoint = keyof typeof BREAKPOINTS;

export class ResponsiveService {
  private observer: ResizeObserver | null = null;
  private currentBreakpoint: Breakpoint = 'md';
  private callbacks: Array<(bp: Breakpoint) => void> = [];

  observe(element: HTMLElement): void {
    this.observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const bp = this.getBreakpoint(width);
        if (bp !== this.currentBreakpoint) {
          this.currentBreakpoint = bp;
          this.callbacks.forEach((cb) => cb(bp));
        }
      }
    });

    this.observer.observe(element);
  }

  disconnect(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  onBreakpointChange(callback: (bp: Breakpoint) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  getBreakpoint(width: number): Breakpoint {
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    return 'xs';
  }

  getCurrentBreakpoint(): Breakpoint {
    return this.currentBreakpoint;
  }
}
