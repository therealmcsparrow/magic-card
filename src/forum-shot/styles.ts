// Styles of the forum shot element: HA variables with fallbacks, no transitions or animation.
import { css } from 'lit';

export const forumShotStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    padding: 16px;
    color: var(--primary-text-color, #212121);
    font-family: var(--paper-font-body1_-_font-family, inherit);
  }
  :host([narrow]) {
    padding: 8px;
  }
  section {
    max-width: 720px;
    margin: 0 auto;
  }
  h2 {
    margin: 0 0 8px;
    font-size: 1.4em;
    font-weight: 500;
  }
  p {
    margin: 0 0 12px;
    line-height: 1.5;
  }
  fieldset {
    margin: 0 0 16px;
    padding: 8px 12px 12px;
    border: 1px solid var(--divider-color, #727272);
    border-radius: 8px;
  }
  legend {
    padding: 0 4px;
    font-weight: 500;
  }
  .choice {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    min-height: 44px;
    padding: 4px 0;
    line-height: 1.4;
  }
  .choice input {
    flex: none;
    width: 24px;
    height: 24px;
    margin: 8px 0 0;
    accent-color: var(--primary-text-color, #212121);
  }
  .choice label {
    padding-top: 10px;
    overflow-wrap: anywhere;
  }
  .choice.off label {
    color: var(--secondary-text-color, #5f5f5f);
  }
  .hint {
    display: block;
    margin-top: 4px;
    font-size: 0.9em;
    color: var(--secondary-text-color, #5f5f5f);
  }
  .privacy {
    padding: 8px 12px;
    border-left: 4px solid var(--warning-color, #b26a00);
    background: var(--secondary-background-color, #f3f3f3);
  }
  .error {
    padding: 8px 12px;
    border-left: 4px solid var(--error-color, #b3261e);
    background: var(--secondary-background-color, #f3f3f3);
  }
  button {
    min-height: 44px;
    min-width: 44px;
    padding: 8px 20px;
    border: 2px solid var(--primary-text-color, #212121);
    border-radius: 22px;
    background: var(--primary-text-color, #212121);
    color: var(--primary-background-color, #fff);
    font: inherit;
    font-weight: 500;
    cursor: pointer;
  }
  button.retry {
    background: transparent;
    color: var(--primary-text-color, #212121);
  }
  button[aria-disabled='true'] {
    border-style: dashed;
    background: transparent;
    color: var(--secondary-text-color, #5f5f5f);
    cursor: not-allowed;
  }
  button:focus-visible,
  input:focus-visible {
    outline: 3px solid var(--primary-text-color, #212121);
    outline-offset: 3px;
  }
  .preview {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 12px 0;
    border: 1px solid var(--divider-color, #727272);
  }
  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
    }
  }
  @media (forced-colors: active) {
    button[aria-disabled='true'] {
      color: GrayText;
    }
  }
`;
