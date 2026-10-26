import { css, CSSResult } from 'lit';

/*
 * kitLip (contract ui-kit-lips): the panel lip button, the hint, the status region and the hidden-panel
 * rules. Not in kitCss: only the editors with lips import it. Floor values come first (Chromium 85): left and
 * right before inset-inline-*, :focus before :focus:not(:focus-visible) before :focus-visible, transform
 * instead of translate, [data-dir=rtl] instead of :dir().
 */
export const kitLip: CSSResult = /* @__PURE__ */ css`
  .lip {
    position: absolute;
    z-index: var(--mc-lip-z, 4);
    top: var(--mc-lip-top, 50%);
    transform: translateY(-50%);
    box-sizing: border-box;
    display: grid;
    place-items: center;
    width: 28px;
    height: 72px;
    margin: 0;
    padding: 0;
    border: 1px solid var(--mc-text-2);
    background: var(--mc-surface);
    color: var(--mc-text-2);
    font: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .lip svg {
    width: 18px;
    height: 18px;
    pointer-events: none;
  }
  .lip[aria-expanded='false'] {
    border-color: var(--mc-text-2);
    background: var(--mc-accent-fill);
    color: var(--mc-on-accent);
  }

  /* placement: the physical value first, then the logical one */
  .lip[data-side='start'] {
    left: var(--mc-lip-at-start, 0);
    inset-inline-start: var(--mc-lip-at-start, 0);
    border-left-width: 0;
    border-radius: 0 8px 8px 0;
  }
  .lip[data-side='start'][data-dir='rtl'] {
    left: auto;
    right: var(--mc-lip-at-start, 0);
    border-left-width: 1px;
    border-right-width: 0;
    border-radius: 8px 0 0 8px;
  }
  .lip[data-side='end'] {
    right: var(--mc-lip-at-end, 0);
    inset-inline-end: var(--mc-lip-at-end, 0);
    border-right-width: 0;
    border-radius: 8px 0 0 8px;
  }
  .lip[data-side='end'][data-dir='rtl'] {
    right: auto;
    left: var(--mc-lip-at-end, 0);
    border-right-width: 1px;
    border-left-width: 0;
    border-radius: 0 8px 8px 0;
  }

  /* the chevron points the way the panel will move; one right-pointing glyph, mirrored here */
  .lip[data-side='start'][aria-expanded='true'] svg,
  .lip[data-side='end'][aria-expanded='false'] svg {
    transform: scaleX(-1);
  }
  .lip[data-side='start'][aria-expanded='true'][data-dir='rtl'] svg,
  .lip[data-side='end'][aria-expanded='false'][data-dir='rtl'] svg {
    transform: none;
  }
  .lip[data-side='start'][aria-expanded='false'][data-dir='rtl'] svg,
  .lip[data-side='end'][aria-expanded='true'][data-dir='rtl'] svg {
    transform: scaleX(-1);
  }

  /* focus: the ring is drawn inside the tab */
  .lip:focus {
    outline: 2px solid var(--mc-focus);
    outline-offset: -3px;
  }
  .lip:focus:not(:focus-visible) {
    outline: none;
  }
  .lip:focus-visible {
    outline: 2px solid var(--mc-focus);
    outline-offset: -3px;
  }
  .lip[aria-expanded='false']:focus {
    outline: 2px solid var(--mc-on-accent);
    outline-offset: -4px;
  }
  .lip[aria-expanded='false']:focus:not(:focus-visible) {
    outline: none;
  }
  .lip[aria-expanded='false']:focus-visible {
    outline: 2px solid var(--mc-on-accent);
    outline-offset: -4px;
  }

  @media (hover: hover) {
    .lip:hover {
      background: var(--mc-surface-2);
      border-color: var(--mc-text);
      color: var(--mc-text);
    }
    .lip[aria-expanded='false']:hover {
      background: var(--mc-accent-fill);
      border-color: var(--mc-text-2);
      color: var(--mc-on-accent);
      box-shadow: inset 0 0 0 100vmax rgba(0, 0, 0, 0.15);
    }
  }
  .lip:active {
    background: var(--mc-accent-tint);
    color: var(--mc-accent-ink);
  }
  .lip[aria-expanded='false']:active {
    background: var(--mc-accent-fill);
    color: var(--mc-on-accent);
    box-shadow: inset 0 0 0 100vmax rgba(0, 0, 0, 0.15);
  }

  /* touch: an invisible extension on the canvas side makes the target 44 px wide (28 - 1 for the border + 17) and at least 72 px tall; --mc-lip-pull is how far a window-edge lip is pulled out of the window */
  @media (pointer: coarse) {
    .lip::after {
      content: '';
      position: absolute;
      top: 50%;
      height: 72px;
      transform: translateY(-50%);
    }
    .lip[data-side='start']::after {
      left: 100%;
      width: 17px;
    }
    .lip[data-side='end']::after {
      right: 100%;
      width: 17px;
    }
    .lip[data-side='start'][data-dir='rtl']::after {
      left: auto;
      right: 100%;
    }
    .lip[data-side='end'][data-dir='rtl']::after {
      right: auto;
      left: 100%;
    }
    .lip[aria-expanded='false']::after {
      width: calc(17px + var(--mc-lip-pull, 0px));
    }
    /* a window-edge lip can be inset (iPad edge swipes) */
    .lip[aria-expanded='false'][data-side='start'] {
      left: calc(var(--mc-lip-at-start, 0px) + var(--mc-lip-edge-gap, 0px));
    }
    .lip[aria-expanded='false'][data-side='end'] {
      right: calc(var(--mc-lip-at-end, 0px) + var(--mc-lip-edge-gap, 0px));
    }
    .lip[aria-expanded='false'][data-side='start'][data-dir='rtl'] {
      left: auto;
      right: calc(var(--mc-lip-at-start, 0px) + var(--mc-lip-edge-gap, 0px));
    }
    .lip[aria-expanded='false'][data-side='end'][data-dir='rtl'] {
      right: auto;
      left: calc(var(--mc-lip-at-end, 0px) + var(--mc-lip-edge-gap, 0px));
    }
  }

  /* a hidden panel stays mounted: out of the tab order and the accessibility tree, slid off its edge */
  [data-lip] {
    transition: transform var(--mc-lip-ms, 200ms) ease, visibility 0s linear 0s;
  }
  [data-lip='hidden'] {
    visibility: hidden;
    pointer-events: none;
    transform: translateX(var(--mc-lip-off, 0px));
    transition: transform var(--mc-lip-ms, 200ms) ease, visibility 0s linear var(--mc-lip-ms, 200ms);
  }
  [data-lip='hidden'][data-dir='rtl'] {
    transform: translateX(calc(-1 * var(--mc-lip-off, 0px)));
  }
  @media (prefers-reduced-motion: reduce) {
    [data-lip],
    [data-lip='hidden'] {
      transition: none;
    }
  }

  /* the first-open hint */
  .lip-hint {
    position: absolute;
    z-index: var(--mc-lip-z, 4);
    top: var(--mc-lip-top, 50%);
    transform: translateY(-50%);
    box-sizing: border-box;
    width: max-content;
    max-width: min(260px, var(--mc-lip-hint-max, 260px));
    padding: 12px;
    border: 1px solid var(--mc-text-2);
    border-radius: var(--mc-radius, 8px);
    background: var(--mc-surface);
    color: var(--mc-text);
    box-shadow: var(--mc-shadow-float);
    font-size: 0.8125rem;
    line-height: 1.4;
    animation: lip-hint-in 160ms ease-out;
  }
  .lip-hint p {
    margin: 0 0 8px;
  }
  .lip-hint .lip-hint-keys {
    color: var(--mc-text-2);
  }
  @media (hover: none) {
    .lip-hint .lip-hint-keys {
      display: none;
    }
  }
  .lip-hint button {
    min-height: var(--mc-hit, 40px);
    padding: 0 12px;
    border: 1px solid var(--mc-text-2);
    border-radius: var(--mc-radius, 8px);
    background: var(--mc-surface);
    color: var(--mc-text);
    font: inherit;
    cursor: pointer;
  }
  .lip-hint button:focus {
    outline: 2px solid var(--mc-focus);
    outline-offset: 2px;
  }
  .lip-hint button:focus:not(:focus-visible) {
    outline: none;
  }
  .lip-hint button:focus-visible {
    outline: 2px solid var(--mc-focus);
    outline-offset: 2px;
  }
  @media (pointer: coarse) {
    .lip-hint button {
      min-height: 44px;
    }
  }
  /* 8 px from the 28 px tab, with a notch towards it */
  .lip-hint::before {
    content: '';
    position: absolute;
    top: 50%;
    width: 10px;
    height: 10px;
    margin-top: -5px;
    border: 1px solid var(--mc-text-2);
    background: var(--mc-surface);
  }
  .lip-hint[data-side='start'] {
    left: calc(var(--mc-lip-at-start, 0px) + 36px);
    inset-inline-start: calc(var(--mc-lip-at-start, 0px) + 36px);
  }
  .lip-hint[data-side='start']::before {
    left: -6px;
    border-width: 0 0 1px 1px;
    transform: rotate(45deg);
  }
  .lip-hint[data-side='end'] {
    right: calc(var(--mc-lip-at-end, 0px) + 36px);
    inset-inline-end: calc(var(--mc-lip-at-end, 0px) + 36px);
  }
  .lip-hint[data-side='end']::before {
    right: -6px;
    border-width: 1px 1px 0 0;
    transform: rotate(45deg);
  }
  .lip-hint[data-side='start'][data-dir='rtl'] {
    left: auto;
    right: calc(var(--mc-lip-at-start, 0px) + 36px);
  }
  .lip-hint[data-side='start'][data-dir='rtl']::before {
    left: auto;
    right: -6px;
    border-width: 1px 1px 0 0;
  }
  .lip-hint[data-side='end'][data-dir='rtl'] {
    right: auto;
    left: calc(var(--mc-lip-at-end, 0px) + 36px);
  }
  .lip-hint[data-side='end'][data-dir='rtl']::before {
    right: auto;
    left: -6px;
    border-width: 0 0 1px 1px;
  }
  @keyframes lip-hint-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .lip-hint {
      animation: none;
    }
  }

  /* the announcer: in the accessibility tree, not on screen */
  .lip-status {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }
`;
