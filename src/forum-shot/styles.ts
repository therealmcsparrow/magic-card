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
  table {
    width: 100%;
    margin: 0 0 16px;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 4px 8px;
    border-bottom: 1px solid var(--divider-color, #727272);
    text-align: start;
    vertical-align: top;
    overflow-wrap: anywhere;
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
  td > .status {
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 44px;
    font-weight: 500;
  }
  .status svg {
    flex: none;
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentcolor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  td > .hint {
    margin: 0 0 8px;
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
    content: 'B2';
    font-size: 0.7em;
  }
  th[aria-sort='descending'] button.sort::after {
    content: 'BC';
    font-size: 0.7em;
  }
  @media (max-width: 600px) {
    :host {
      padding: 8px;
    }
    table,
    tbody {
      display: block;
    }
    thead tr {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    thead th {
      display: block;
      padding: 0;
      border: 0;
    }
    tbody tr {
      display: block;
      margin-bottom: 8px;
      border: 1px solid var(--divider-color, #727272);
      border-radius: 8px;
    }
    tbody td {
      display: block;
      border-bottom: 0;
    }
    tbody td::before {
      content: attr(data-label);
      display: block;
      font-size: 0.85em;
      font-weight: 600;
      color: var(--secondary-text-color, #5f5f5f);
    }
  }
  :host([narrow]) table,
  :host([narrow]) tbody {
    display: block;
  }
  :host([narrow]) thead tr {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  :host([narrow]) thead th {
    display: block;
    padding: 0;
    border: 0;
  }
  :host([narrow]) tbody tr {
    display: block;
    margin-bottom: 8px;
    border: 1px solid var(--divider-color, #727272);
    border-radius: 8px;
  }
  :host([narrow]) tbody td {
    display: block;
    border-bottom: 0;
  }
  :host([narrow]) tbody td::before {
    content: attr(data-label);
    display: block;
    font-size: 0.85em;
    font-weight: 600;
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
