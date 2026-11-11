import { css, CSSResult } from 'lit';

// kitBlueprint: the soft-blueprint palette, type, spacing and size tokens, set on the studio host and switched by data-bp-mode.
export const kitBlueprint: CSSResult = /* @__PURE__ */ css`
  :host {
    --bp-font-ui: 'MC Space Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif;
    --bp-font-mono: 'MC Space Mono', ui-monospace, 'SF Mono', Consolas, monospace;
    --bp-t-ruler: 0.594rem;
    --bp-t-meta: 0.6875rem;
    --bp-t-help: 0.75rem;
    --bp-t-mono: 0.781rem;
    --bp-t-label: 0.8125rem;
    --bp-t-body: 0.875rem;
    --bp-t-bar: 0.9375rem;
    --bp-t-head: 1rem;
    --bp-t-page: 1.125rem;
    --bp-lh: 1.5;
    --bp-s-1: 2px;
    --bp-s-2: 4px;
    --bp-s-3: 6px;
    --bp-s-4: 8px;
    --bp-s-5: 10px;
    --bp-s-6: 12px;
    --bp-s-7: 16px;
    --bp-s-8: 20px;
    --bp-s-9: 24px;
    --bp-s-10: 32px;
    --bp-r-xs: 6px;
    --bp-r-s: 8px;
    --bp-r-m: 10px;
    --bp-r-l: 12px;
    --bp-r-xl: 20px;
    --bp-r-pill: 999px;
    --bp-bar-h: 44px;
    --bp-ruler: 22px;
    --bp-grid: 20px;
    --bp-drawer-w: 360px;
    --bp-layers-w: 240px;
    --bp-hit: 32px;
    --bp-focus-w: 2px;
    --bp-focus-off: 2px;
    --bp-dur: 0.15s;
    --bp-dur-sheet: 0.22s;
    color-scheme: light;
  }

  :host([data-bp-mode="light"]),
  :host(:not([data-bp-mode])) {
    --bp-bg: oklch(0.972 0.007 85);
    --bp-sheet: oklch(0.985 0.005 85);
    --bp-surf: oklch(0.995 0.003 85);
    --bp-surf2: oklch(0.955 0.008 85);
    --bp-hair: oklch(0.93 0.008 85);
    --bp-hair2: oklch(0.9 0.009 85);
    --bp-line: oklch(0.87 0.01 85);
    --bp-edge: oklch(0.6 0.012 250);
    --bp-ink: oklch(0.27 0.015 250);
    --bp-mute: oklch(0.47 0.014 250);
    --bp-acc: oklch(0.5 0.07 250);
    --bp-acc-ink: oklch(0.99 0.003 85);
    --bp-acc-soft: oklch(0.93 0.025 250);
    --bp-warn: oklch(0.5 0.12 40);
    --bp-danger: oklch(0.5 0.15 25);
    --bp-sw-slate: oklch(0.55 0.03 250);
    --bp-sw-sage: oklch(0.62 0.06 150);
    --bp-sw-sky: oklch(0.6 0.07 235);
    --bp-sw-rose: oklch(0.6 0.09 20);
    --bp-shadow: oklch(0.3 0.02 250 / 0.08);
    --bp-shadow-card: 0 1px 2px var(--bp-shadow), 0 8px 24px var(--bp-shadow);
    --bp-shadow-pill: 0 4px 14px var(--bp-shadow);
    color-scheme: light;
  }

  :host([data-bp-mode="dark"]) {
    --bp-bg: oklch(0.22 0.012 250);
    --bp-sheet: oklch(0.235 0.013 250);
    --bp-surf: oklch(0.27 0.014 250);
    --bp-surf2: oklch(0.31 0.015 250);
    --bp-hair: oklch(0.26 0.012 250);
    --bp-hair2: oklch(0.29 0.013 250);
    --bp-line: oklch(0.37 0.015 250);
    --bp-edge: oklch(0.58 0.014 250);
    --bp-ink: oklch(0.93 0.008 250);
    --bp-mute: oklch(0.74 0.014 250);
    --bp-acc: oklch(0.74 0.055 250);
    --bp-acc-ink: oklch(0.2 0.02 250);
    --bp-acc-soft: oklch(0.32 0.03 250);
    --bp-warn: oklch(0.76 0.1 50);
    --bp-danger: oklch(0.74 0.12 25);
    --bp-sw-slate: oklch(0.7 0.03 250);
    --bp-sw-sage: oklch(0.72 0.06 150);
    --bp-sw-sky: oklch(0.72 0.06 235);
    --bp-sw-rose: oklch(0.72 0.08 20);
    --bp-shadow: oklch(0 0 0 / 0.3);
    --bp-shadow-card: 0 1px 2px var(--bp-shadow), 0 8px 24px var(--bp-shadow);
    --bp-shadow-pill: 0 4px 14px var(--bp-shadow);
    color-scheme: dark;
  }

  /* sRGB values for browsers without oklch(): the same palette, rounded */
  @supports not (color: oklch(0 0 0)) {
    :host([data-bp-mode="light"]),
    :host(:not([data-bp-mode])) {
      --bp-bg: #f8f5f1;
      --bp-sheet: #fcfaf6;
      --bp-surf: #fefdfb;
      --bp-surf2: #f3f0ea;
      --bp-hair: #eae7e2;
      --bp-hair2: #e1ded7;
      --bp-line: #d7d4cd;
      --bp-edge: #7b8187;
      --bp-ink: #21272e;
      --bp-mute: #555c63;
      --bp-acc: #43668a;
      --bp-acc-ink: #fdfcf9;
      --bp-acc-soft: #dceaf8;
      --bp-warn: #9a4729;
      --bp-danger: #a83634;
      --bp-shadow: rgba(30, 40, 50, 0.08);
    }
    :host([data-bp-mode="dark"]) {
      --bp-bg: #161b20;
      --bp-sheet: #1a1f24;
      --bp-surf: #21272d;
      --bp-surf2: #2b3138;
      --bp-hair: #20252a;
      --bp-hair2: #272c32;
      --bp-line: #3a4148;
      --bp-edge: #747b83;
      --bp-ink: #e4e8ed;
      --bp-mute: #a4acb4;
      --bp-acc: #91aecd;
      --bp-acc-ink: #0f171f;
      --bp-acc-soft: #273442;
      --bp-warn: #e59e77;
      --bp-danger: #ed8c84;
      --bp-shadow: rgba(0, 0, 0, 0.3);
    }
  }

  @media (pointer: coarse) {
    :host {
      --bp-hit: 44px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :host {
      --bp-dur: 0s;
      --bp-dur-sheet: 0s;
      scroll-behavior: auto;
    }
  }
`;
