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
  .preview {
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: var(--mc-ground);
    overflow: hidden;
  }
  .preview mc-svg-image {
    display: block;
    width: 100%;
    height: 100%;
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
`;
