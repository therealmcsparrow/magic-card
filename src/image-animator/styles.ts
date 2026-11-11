import { css } from 'lit';

// Layout of the image animator window inside the studio frame; the frame's blueprint tokens reach the slotted content.
export const animatorStyles = css`
  :host {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: block;
  }
  .backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }
  .window {
    position: absolute;
    inset: 16px;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    border: 1px solid var(--mc-divider);
    background: var(--mc-surface);
    color: var(--mc-text);
    box-shadow: var(--mc-shadow-float);
    overflow: hidden;
  }
  mc-ui-studio-frame {
    flex: 1 1 auto;
    min-block-size: 0;
    min-inline-size: 0;
  }
  header,
  footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    padding: 8px 12px;
    border-block-end: 1px solid var(--mc-divider);
  }
  footer {
    border-block-start: 1px solid var(--mc-divider);
    border-block-end: 0;
  }
  .bar {
    flex: 1 1 auto;
    min-inline-size: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  h2 {
    flex: 0 1 auto;
    min-inline-size: 0;
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  header h2 {
    flex: 1 1 auto;
  }
  h2:focus {
    outline: none;
  }
  .bar .status {
    flex: 1 1 0;
    min-inline-size: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .bar .btn {
    flex: none;
  }
  .body {
    flex: 1 1 auto;
    min-block-size: 0;
    padding: 12px;
  }
  .stage-wrap {
    display: grid;
    justify-items: start;
    gap: 40px;
  }
  .stage {
    display: block;
    cursor: crosshair;
    touch-action: manipulation;
  }
  .stage svg {
    display: block;
    inline-size: 100%;
    block-size: 100%;
  }
  .stage [data-mc-picked] {
    outline: 2px dashed var(--mc-accent, currentColor);
    outline-offset: 2px;
  }
  .saved {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8125rem;
    color: var(--bp-mute, var(--mc-text-2));
  }
  .saved mc-svg-image {
    display: block;
    inline-size: 4rem;
    block-size: 4rem;
  }
  .drawer-body {
    display: grid;
    align-content: start;
    gap: 16px;
    padding: 4px 4px 16px;
    color: var(--bp-ink, var(--mc-text));
  }
  .drawer-body h3 {
    margin: 0 0 4px;
    font-size: 0.875rem;
    font-weight: 600;
  }
  .targets {
    list-style: none;
    margin: 0;
    padding: 0;
    max-block-size: 12rem;
    overflow: auto;
    display: grid;
    gap: 2px;
  }
  .target {
    inline-size: 100%;
    min-block-size: 32px;
    padding-inline: 8px;
    text-align: start;
    border: 1px solid transparent;
    border-radius: 6px;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    overflow-wrap: anywhere;
  }
  .target[aria-pressed='true'] {
    border-color: var(--bp-acc, var(--mc-accent, currentColor));
    background: var(--bp-acc-soft, var(--mc-ground));
    font-weight: 600;
  }
  .target:focus-visible,
  .effects button:focus-visible,
  .ia-row :is(select, input, button):focus-visible,
  .bar .btn:focus-visible {
    outline: 2px solid var(--bp-acc, var(--mc-accent, currentColor));
    outline-offset: 2px;
  }
  .effects,
  .ia-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 8px;
    margin-block-start: 8px;
  }
  .effects button[aria-disabled='true'] {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .ia-row label {
    flex: 1 0 100%;
    font-size: 0.8125rem;
    color: var(--bp-mute, var(--mc-text-2));
  }
  .ia-row :is(select, input:not([type='checkbox'])) {
    flex: 1 1 8rem;
    min-inline-size: 0;
    min-block-size: 32px;
  }
  p {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--bp-mute, var(--mc-text-2));
  }
  p.problem {
    color: var(--mc-danger-ink, var(--mc-text));
    font-weight: 600;
  }
  .status {
    flex: 1 1 12em;
    min-inline-size: 0;
  }
  .confirm {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 8px 12px;
    padding: 12px 16px;
    border-block-start: 1px solid var(--mc-border, currentColor);
  }
  .confirm p {
    flex: 1 1 16em;
    margin: 0;
  }
  .warnings p {
    margin: 0 0 4px;
  }
  .warnings ul {
    margin: 0 0 8px;
    padding-inline-start: 20px;
  }
  @media (prefers-reduced-motion: reduce) {
    .window,
    .window * {
      transition: none;
      animation: none;
      scroll-behavior: auto;
    }
  }
`;
