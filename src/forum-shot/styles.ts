// Styles of the forum shot element: HA variables with fallbacks, no transitions or animation.
import { css } from 'lit';

export const forumShotStyles = css`
  :host {
    display: block;
    box-sizing: border-box;
    padding: 16px;
    color: var(--primary-text-color, #212121);
    font-family: var(--paper-font-body1_-_font-family, inherit);
    font-size: 0.875rem;
    --mdc-icon-size: 18px;
  }
  :host([narrow]) {
    padding: 8px;
  }
  section {
    position: relative;
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
    border-spacing: 0;
  }
  .filter input,
  .pop {
    background: var(--card-background-color, #fff);
  }
  th,
  td {
    padding: 2px 8px;
    text-align: start;
    vertical-align: middle;
    overflow-wrap: break-word;
  }
  th {
    font-size: 0.8125rem;
    font-weight: 500;
  }
  td.state {
    width: 1%;
    white-space: nowrap;
  }
  tbody tr:not(.off) {
    cursor: pointer;
  }
  tbody tr:not(.off):hover,
  tbody tr.picked,
  button.tip[aria-expanded='true'] {
    background: var(--secondary-background-color, #f3f3f3);
  }
  fieldset,
  .preview,
  button.tip,
  .pop {
    border: 1px solid var(--divider-color, #727272);
  }
  button.tip {
    gap: 6px;
    min-height: 32px;
    padding: 0 10px 0 6px;
    border-radius: 16px;
    background: transparent;
    color: inherit;
  }
  @media (hover: hover) {
    button.tip:hover {
      background: var(--secondary-background-color, #f3f3f3);
    }
  }
  button.tip svg {
    flex: none;
    width: 16px;
    height: 16px;
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
  }
  button.sort {
    gap: 4px;
    min-height: 32px;
    padding: 4px 0;
    background: transparent;
    color: inherit;
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
  .filter,
  .bar {
    margin: 0 0 12px;
  }
  .filter {
    display: grid;
    gap: 6px;
    font-size: 0.8125rem;
    font-weight: 500;
  }
  .box {
    position: relative;
    display: grid;
  }
  .box ha-icon {
    position: absolute;
    margin: 8px 10px;
  }
  .bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }
  .filter input {
    min-height: 40px;
    padding: 8px 12px 8px 36px;
    border: 1px solid var(--secondary-text-color, #727272);
    border-radius: 8px;
    color: inherit;
    font: inherit;
    font-size: 0.875rem;
    font-weight: 400;
  }
  .hint,
  .box ha-icon,
  th,
  tbody tr.off td,
  .pop .fonts {
    color: var(--secondary-text-color, #5f5f5f);
  }
  .hint {
    font-size: 0.9em;
  }
  .privacy,
  .error {
    padding: 8px 12px;
    border-left: 4px solid var(--warning-color, #b26a00);
    background: var(--secondary-background-color, #f3f3f3);
  }
  .error {
    border-color: var(--error-color, #b3261e);
  }
  button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    padding: 0 16px;
    border: 1px solid transparent;
    border-radius: 8px;
    background: color-mix(in srgb, var(--primary-color, #03a9f4) 70%, #000);
    color: #fff;
    font: inherit;
    font-weight: 500;
    cursor: pointer;
  }
  button.retry,
  button[aria-disabled='true'] {
    border-color: var(--divider-color, #727272);
    background: transparent;
    color: var(--primary-text-color, #212121);
  }
  button[aria-disabled='true'] {
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
