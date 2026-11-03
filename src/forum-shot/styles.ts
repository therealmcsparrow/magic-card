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
    position: relative;
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
  .scroll {
    margin: 0 0 16px;
    padding: 6px;
    overflow-x: auto;
  }
  table {
    width: 100%;
    min-width: 30rem;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 4px 8px;
    border-bottom: 1px solid var(--divider-color, #727272);
    text-align: start;
    vertical-align: middle;
    overflow-wrap: break-word;
  }
  td.state {
    width: 1%;
    white-space: nowrap;
  }
  td .choice {
    min-height: 44px;
  }
  tbody tr:not(.off) {
    cursor: pointer;
  }
  tbody tr.picked {
    background: var(--secondary-background-color, #f3f3f3);
  }
  tbody tr.off td {
    color: var(--secondary-text-color, #5f5f5f);
  }
  fieldset,
  .preview,
  button.tip,
  .pop {
    border: 1px solid var(--divider-color, #727272);
  }
  button.tip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 44px;
    padding: 0 12px 0 8px;
    border-radius: 22px;
    background: transparent;
    color: inherit;
  }
  button.tip[aria-expanded='true'] {
    background: var(--secondary-background-color, #f3f3f3);
  }
  @media (hover: hover) {
    button.tip:hover {
      background: var(--secondary-background-color, #f3f3f3);
    }
  }
  button.tip svg {
    flex: none;
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentcolor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .pop {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    box-sizing: border-box;
    width: max-content;
    max-width: min(20rem, 100%);
    padding: var(--ha-space-3, 12px);
    border-radius: var(--ha-border-radius-md, 8px);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #212121);
    font-weight: 400;
    text-align: start;
    white-space: normal;
  }
  .pop p {
    margin: 0 0 8px;
  }
  .pop .fonts {
    font-size: 0.9em;
    color: var(--secondary-text-color, #5f5f5f);
  }
  button.sort {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-height: 44px;
    padding: 4px 8px;
    border: 2px solid transparent;
    border-radius: 8px;
    background: transparent;
    color: var(--primary-text-color, #212121);
    font-weight: 600;
    text-align: start;
  }
  th[aria-sort='ascending'] button.sort::after {
    content: '\\25B2';
    content: '\\25B2' / '';
    font-size: 0.7em;
  }
  th[aria-sort='descending'] button.sort::after {
    content: '\\25BC';
    content: '\\25BC' / '';
    font-size: 0.7em;
  }
  .filter input {
    min-height: 44px;
    margin: 0 8px 8px;
    font: inherit;
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
  input:focus-visible,
  .scroll:focus-visible {
    outline: 3px solid var(--primary-text-color, #212121);
    outline-offset: 3px;
  }
  .preview {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 12px 0;
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
