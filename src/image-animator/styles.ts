import { css } from 'lit';

// Layout of the image animator window; look and tokens come from the editor stack.
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
  header,
  footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    padding: 8px 12px;
  }
  header {
    border-block-end: 1px solid var(--mc-divider);
  }
  footer {
    border-block-start: 1px solid var(--mc-divider);
  }
  h2 {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  h2:focus {
    outline: none;
  }
  .body {
    flex: 1 1 auto;
    min-height: 0;
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    gap: 8px;
    padding: 12px;
  }
  .work {
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(14rem, 22rem);
    gap: 12px;
  }
  .canvas {
    min-height: 0;
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    gap: 8px;
  }
  .stage {
    min-height: 12rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: var(--mc-ground);
    overflow: hidden;
    cursor: crosshair;
    touch-action: manipulation;
  }
  .stage svg {
    display: block;
    max-width: 100%;
    max-height: 100%;
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
    color: var(--mc-text-2);
  }
  .saved mc-svg-image {
    display: block;
    width: 4rem;
    height: 4rem;
  }
  .side {
    min-height: 0;
    overflow: auto;
    display: grid;
    align-content: start;
    gap: 12px;
  }
  .side h3 {
    margin: 0 0 4px;
    font-size: 0.875rem;
    font-weight: 600;
  }
  .targets {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 12rem;
    overflow: auto;
    display: grid;
    gap: 2px;
  }
  .target {
    width: 100%;
    min-height: 32px;
    padding-inline: 8px;
    text-align: start;
    border: 1px solid transparent;
    border-radius: 6px;
    background: none;
    color: var(--mc-text);
    font: inherit;
    cursor: pointer;
    overflow-wrap: anywhere;
  }
  .target[aria-pressed='true'] {
    border-color: var(--mc-accent, currentColor);
    background: var(--mc-ground);
    font-weight: 600;
  }
  .target:focus-visible,
  .effects button:focus-visible,
  .ia-row :is(select, input, button):focus-visible {
    outline: 2px solid var(--mc-accent, currentColor);
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
    color: var(--mc-text-2);
  }
  .ia-row :is(select, input) {
    flex: 1 1 8rem;
    min-width: 0;
    min-height: 32px;
  }
  @media (max-width: 700px) {
    .work {
      grid-template-columns: minmax(0, 1fr);
      overflow: auto;
    }
  }
  p {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--mc-text-2);
  }
  p.problem {
    color: var(--mc-danger-ink, var(--mc-text));
    font-weight: 600;
  }
  .status {
    flex: 1 1 12em;
    min-width: 0;
  }
  .confirm {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 8px 12px;
    padding: 12px 16px;
    border-top: 1px solid var(--mc-border, currentColor);
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
`;
