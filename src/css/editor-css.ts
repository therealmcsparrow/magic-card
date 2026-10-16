import { css } from 'lit';
import { mcVariables } from './tokens';
import { editorSystem } from './editor-system';

export const componentControlStyles = css`
  :host {
    color: var(--primary-text-color, #1a1a2e);
    font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
  }

  input,
  select,
  textarea,
  button {
    font-family: inherit;
    color: inherit;
  }

  input[type='text'],
  input[type='number'],
  input[type='time'],
  select,
  textarea {
    padding: 8px 10px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #1a1a2e);
    outline: none;
    box-sizing: border-box;
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-color: var(--primary-color, #6366f1);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color, #6366f1) 20%, transparent);
  }

  button {
    border-radius: 8px;
  }
`;

/* ================================================================== */
/*  EDITOR STYLES                                                      */
/* ================================================================== */
const editorLocalStyles = css`
  :host {
    display: block;
  }

  .mc-editor {
    padding: 20px;
    font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
    color: var(--mc-text);
  }

  .mc-mode-help {
    margin: 0 0 20px;
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--mc-text-secondary);
    line-height: 1.5;
    max-width: 60ch;
  }

  /* Toolbar */
  .mc-editor-toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 16px;
  }

  .mc-toolbar-spacer {
    flex: 1;
  }

  .mc-toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    border-radius: 6px;
    cursor: pointer;
    color: var(--mc-text-secondary);
    transition: all 0.15s;
  }

  .mc-toolbar-btn:hover:not(:disabled) {
    background: var(--mc-border);
    color: var(--mc-text);
  }

  .mc-toolbar-btn:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .mc-editor-toolbar .mc-btn {
    height: 32px;
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 8px;
    font-size: var(--ha-font-size-s, 0.875rem);
  }

  .mc-linked-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    height: 32px;
    color: var(--mc-primary);
    background: var(--mc-primary-light);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
  }

  .mc-toolbar-template-name {
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mc-linked-indicator:hover {
    filter: brightness(0.95);
  }

  .mc-linked-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 8px;
    background: var(--mc-primary);
    color: var(--text-primary-color, #fff);
    font-size: 10px;
    font-weight: 700;
    line-height: 16px;
    text-align: center;
    box-shadow: 0 0 0 2px var(--mc-bg);
  }

  /* Linked template popup */
  .mc-linked-popup {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--mc-border);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 12px;
    min-width: 220px;
    z-index: 100;
  }

  .mc-linked-popup-name {
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 600;
    color: var(--mc-text);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .mc-linked-popup-sync-summary {
    padding: 8px 0;
    margin-bottom: 4px;
    border-top: 1px solid var(--mc-border);
    border-bottom: 1px solid var(--mc-border);
  }

  .mc-sync-summary-header {
    font-size: var(--ha-font-size-xs, 0.75rem);
    font-weight: 600;
    color: var(--warning-color, #ff9800);
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .mc-sync-summary-header.synced {
    color: var(--success-color, #4caf50);
    margin-bottom: 0;
  }

  .mc-sync-summary-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-height: 150px;
    overflow-y: auto;
  }

  .mc-sync-summary-item {
    display: flex;
    flex-direction: column;
    padding: 3px 0 3px 20px;
    font-size: var(--ha-font-size-xs, 0.75rem);
  }

  .mc-sync-summary-location {
    font-weight: 600;
    color: var(--mc-text);
  }

  .mc-sync-summary-paths {
    color: var(--secondary-text-color, #666);
  }

  .mc-linked-popup-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mc-linked-popup-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border: none;
    background: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: var(--ha-font-size-s, 0.875rem);
    color: var(--mc-text);
    transition: background 0.15s;
    width: 100%;
    text-align: left;
  }

  .mc-linked-popup-btn:hover {
    background: var(--mc-border);
  }

  .mc-linked-popup-btn.danger {
    color: var(--error-color, #f44336);
  }

  .mc-linked-popup-btn.danger:hover {
    background: color-mix(in srgb, var(--error-color, #f44336) 10%, transparent);
  }

  /* Toolbar container for popup positioning */
  .mc-toolbar-linked-container {
    position: relative;
  }

  .mc-selected-context {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border: none;
    border-left: 3px solid var(--mc-primary);
    border-radius: 6px;
    background: var(--mc-primary-light);
    margin-bottom: 12px;
    font-size: var(--ha-font-size-s, 0.875rem);
    color: var(--mc-text);
  }

  .mc-selected-context ha-icon {
    color: var(--mc-primary);
    flex-shrink: 0;
  }

  .mc-selected-context strong {
    font-weight: 600;
    color: var(--mc-primary);
  }

  /* Settings Panel */
  .mc-settings-panel {
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-radius-md);
    overflow: hidden;
    margin-top: 12px;
  }

  .mc-settings-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    background: var(--mc-primary-light);
    border-bottom: 1px solid var(--mc-border);
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
  }

  .mc-settings-tabs {
    display: flex;
    border-bottom: 1px solid var(--mc-border);
  }

  .mc-settings-tab {
    flex: 1;
    padding: 10px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: var(--ha-font-size-xs, 0.75rem);
    font-weight: 500;
    color: var(--mc-text-secondary);
    border-bottom: 2px solid transparent;
    transition: all 0.15s;
    text-align: center;
  }

  .mc-settings-tab.active {
    color: var(--mc-primary);
    border-bottom-color: var(--mc-primary);
  }

  .mc-settings-tab:hover:not(.active) {
    color: var(--mc-text);
  }

  .mc-settings-content {
    padding: 16px;
  }

  .mc-bp-xs,
  .mc-bp-sm {
    padding: 14px;
  }

  .mc-bp-xs .mc-editor-toolbar,
  .mc-bp-sm .mc-editor-toolbar {
    gap: 6px;
    margin-bottom: 10px;
  }

  .mc-bp-xs .mc-btn,
  .mc-bp-sm .mc-btn {
    padding: 8px 10px;
  }

  /* Shared Form Styles */
  .mc-tab-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .mc-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .mc-section-header {
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 600;
    color: var(--mc-text);
    padding-bottom: 6px;
    border-bottom: 1px solid var(--mc-border);
    margin-top: 12px;
  }

  .mc-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .mc-field-label {
    font-size: var(--mc-font-size-xs, 0.75rem);
    font-weight: 500;
    color: var(--mc-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .mc-field input[type='text'],
  .mc-field input[type='number'],
  .mc-field select,
  .mc-field textarea {
    padding: 10px 12px;
    border: 1px solid var(--mc-border);
    border-radius: 8px;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
    box-sizing: border-box;
  }

  .mc-field input:focus,
  .mc-field select:focus,
  .mc-field textarea:focus {
    border-color: var(--mc-primary);
  }

  .mc-field-toggle {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .mc-field-toggle input[type='checkbox'] {
    width: 18px;
    height: 18px;
    accent-color: var(--mc-primary);
  }

  .mc-field-hint {
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--mc-text-secondary);
    font-style: italic;
  }

  .mc-field-hint-tight {
    margin-top: -4px;
    margin-bottom: 8px;
  }

  .mc-field-hint-with-margin {
    margin-bottom: 8px;
  }

  .mc-entity-field {
    position: relative;
  }

  .mc-entity-field input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--mc-border);
    border-radius: 8px;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }

  .mc-entity-field input:focus {
    border-color: var(--mc-primary);
  }

  /* Buttons */
  .mc-btn {
    padding: 10px 18px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
    transition: all 0.15s;
  }

  .mc-btn-primary {
    background: var(--mc-primary);
    color: var(--text-primary-color, #fff);
  }

  .mc-btn-primary:hover {
    filter: brightness(1.1);
  }

  .mc-btn-secondary {
    background: var(--mc-surface-recessed);
    color: var(--mc-text);
  }

  .mc-btn-secondary:hover {
    background: color-mix(in srgb, var(--mc-text) 10%, transparent);
  }

  .mc-btn-compact {
    padding: 4px 8px;
    font-size: var(--ha-font-size-xs, 0.75rem);
  }

  .mc-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--mc-border);
    border-radius: 8px;
    background: none;
    cursor: pointer;
    color: var(--mc-text-secondary);
    font-size: 1rem;
    transition: all 0.15s;
  }

  .mc-btn-icon:hover {
    background: var(--mc-border);
    color: var(--mc-text);
  }

  .mc-option-row {
    display: flex;
    gap: 8px;
    align-items: flex-end;
    margin-bottom: 8px;
  }

  .mc-option-row .mc-field {
    flex: 1;
  }

  .mc-card-editor-section {
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    overflow: hidden;
  }

  .mc-card-editor-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 6%, transparent);
    border-bottom: 1px solid var(--divider-color, #e5e7eb);
  }

  .mc-card-editor-icon {
    --mdc-icon-size: 16px;
  }

  .mc-card-editor-body {
    padding: 16px;
  }

  .mc-card-editor-toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }

  .mc-card-editor-toggle:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .mc-yaml-fallback textarea {
    width: 100%;
    min-height: 200px;
    font-family: monospace;
    font-size: 0.8125rem;
    resize: vertical;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 6px;
    padding: 12px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #1a1a2e);
    box-sizing: border-box;
  }

  .mc-yaml-fallback textarea:focus {
    outline: none;
    border-color: var(--primary-color, #6366f1);
  }

  .mc-yaml-fallback-note {
    margin-bottom: 8px;
    font-size: 0.8125rem;
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-yaml-fallback-error {
    color: var(--error-color, #ef4444);
    font-size: 0.8125rem;
    margin-top: 4px;
  }

  .mc-yaml-fallback-help {
    margin-top: 4px;
    font-size: 0.75rem;
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-editor-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    color: var(--secondary-text-color, #757575);
    font-size: 0.875rem;
  }

  /* Editor skeleton (loading state) */
  @keyframes mc-skel-shimmer {
    0%   { background-position: -240px 0; }
    100% { background-position: calc(240px + 100%) 0; }
  }

  .mc-skel {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--mc-text) 5%, transparent) 25%,
      color-mix(in srgb, var(--mc-text) 10%, transparent) 50%,
      color-mix(in srgb, var(--mc-text) 5%, transparent) 75%
    );
    background-size: 240px 100%;
    background-repeat: no-repeat;
    background-color: var(--mc-surface-recessed);
    border-radius: 6px;
    animation: mc-skel-shimmer 1.4s ease-in-out infinite;
  }

  .mc-skel-switcher {
    height: 44px;
    border-radius: var(--mc-radius-md);
    margin-bottom: 8px;
  }

  .mc-skel-line {
    height: 12px;
    margin-bottom: 20px;
  }

  .mc-skel-line-short {
    width: 60%;
  }

  .mc-skel-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .mc-skel-spacer {
    flex: 1;
  }

  .mc-skel-icon-btn {
    width: 32px;
    height: 32px;
    border-radius: 6px;
  }

  .mc-skel-pill {
    width: 100px;
    height: 32px;
    border-radius: 8px;
  }

  .mc-skel-card-header {
    height: 44px;
    margin-bottom: 12px;
    border-radius: 8px;
  }

  .mc-skel-row {
    height: 96px;
    margin-bottom: 12px;
    border-radius: 8px;
  }

  /* Condition items */
  .mc-condition-item {
    padding: 16px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-radius-md);
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
  }

  .mc-condition-item .mc-btn-icon {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .mc-conditions-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 8px 0;
  }

  /* Conditional Appearance section */
  .mc-cond-appearance-section {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .mc-cond-appearance-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--mc-text, var(--primary-text-color));
  }

  .mc-cond-appearance-header ha-icon {
    --mdc-icon-size: 18px;
    color: var(--primary-color, #6366f1);
  }

  .mc-cond-appearance-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mc-cond-appearance-rule {
    border: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
    border-radius: 8px;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 4%, transparent);
    overflow: hidden;
  }

  .mc-cond-appearance-rule.expanded {
    border-color: color-mix(in srgb, var(--primary-color, #6366f1) 30%, var(--mc-border, var(--divider-color, #e5e7eb)));
  }

  .mc-cond-appearance-rule-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    cursor: pointer;
    user-select: none;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 6%, transparent);
  }

  .mc-cond-appearance-rule-header:hover {
    background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, transparent);
  }

  .mc-cond-appearance-rule-header ha-icon {
    --mdc-icon-size: 18px;
    color: var(--mc-text-secondary, var(--secondary-text-color));
  }

  .mc-cond-appearance-rule-name {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--mc-text, var(--primary-text-color));
    padding: 4px 6px;
    border-radius: 4px;
    min-width: 0;
  }

  .mc-cond-appearance-rule-name:hover,
  .mc-cond-appearance-rule-name:focus {
    background: var(--mc-bg, var(--card-background-color, #fff));
    outline: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
  }

  .mc-cond-appearance-rule-count {
    font-size: 0.7rem;
    color: var(--mc-text-secondary, var(--secondary-text-color));
    padding: 2px 6px;
    background: var(--mc-bg, var(--card-background-color, #fff));
    border-radius: 10px;
    border: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
  }

  .mc-cond-appearance-rule-body {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: var(--mc-bg, var(--card-background-color, #fff));
  }

  .mc-cond-appearance-subhead {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--mc-text-secondary, var(--secondary-text-color));
    margin-top: 6px;
  }

  .mc-cond-appearance-subhead:first-child {
    margin-top: 0;
  }

  /* Action config */
  .mc-action-config {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    // border: 1px solid var(--mc-border);
    border-radius: 6px;
  }

  /* Card Settings Modal */
  .mc-modal {
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    width: 480px;
    max-width: 100%;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .mc-modal-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px 20px;
    border-bottom: 1px solid var(--divider-color, #e5e7eb);
    background: var(--card-background-color, #fff);
  }

  .mc-modal-header ha-icon {
    color: var(--primary-color, #6366f1);
    --mdc-icon-size: 24px;
  }

  .mc-modal-title {
    flex: 1;
    font-size: var(--ha-font-size-l, 1.25rem);
    font-weight: 600;
    color: var(--primary-text-color, #1a1a2e);
  }

  .mc-modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--secondary-text-color, #6b7280);
    border-radius: 6px;
    font-size: 1.5rem;
    line-height: 1;
  }

  .mc-modal-close:hover {
    background: var(--divider-color, #e5e7eb);
    color: var(--primary-text-color, #1a1a2e);
  }

  .mc-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }

  .mc-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 20px;
    border-top: 1px solid var(--divider-color, #e5e7eb);
  }

  /* Interactive feedback — focus-visible, active, tap highlight */
  /* Font-family inherit */
  /* Input focus ring enhancement */
  .mc-field input:focus-visible,
  .mc-field select:focus-visible,
  .mc-field textarea:focus-visible,
  .mc-entity-field input:focus-visible,
  .mc-card-name-input:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--mc-primary) 25%, transparent);
  }
`;

// editorSystem comes last so the Studio field look wins over the local rules.
export const editorStyles = [mcVariables, componentControlStyles, editorLocalStyles, ...editorSystem];

/* ================================================================== */
/*  PICKER STYLES                                                      */
/* ================================================================== */
const pickerLocalStyles = css`
  /* Shared picker field + picker modal shell. Use as [editorSystem, pickerStyles]. */
  :host {
    display: block;
    min-width: 0;
  }

  /* ── Closed field: value (or input) + select button ───────────── */
  .mc-picker-row {
    display: flex;
    gap: 8px;
    align-items: stretch;
    min-width: 0;
  }

  .mc-picker-row > .input,
  .mc-picker-row > .mc-picker-value {
    flex: 1 1 auto;
    min-width: 0;
  }

  .mc-picker-row > .btn {
    flex: none;
  }

  .mc-picker-value {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 40px;
    padding: 6px 12px;
    border: 1px solid var(--mc-field-border);
    border-radius: var(--mc-radius);
    background: var(--mc-surface);
    color: var(--mc-text);
    text-align: left;
    transition: border-color 0.15s ease-out;
  }

  .mc-picker-value:hover {
    border-color: var(--mc-text-2);
  }

  .mc-picker-value > ha-icon {
    flex: none;
    --mdc-icon-size: 20px;
    color: var(--mc-text-2);
  }

  .mc-picker-value-text {
    flex: 1;
    min-width: 0;
    display: grid;
    line-height: 1.35;
  }

  .mc-picker-value-name {
    font-size: 0.875rem;
    overflow-wrap: anywhere;
  }

  .mc-picker-value-id {
    font-family: var(--mc-mono);
    font-size: 0.75rem;
    color: var(--mc-text-2);
    overflow-wrap: anywhere;
  }

  .mc-picker-value .dot {
    background: var(--mc-success);
  }

  .mc-picker-value .dot.is-off {
    background: var(--mc-field-border);
  }

  .mc-picker-value .dot.is-unavailable {
    background: var(--mc-error-ink);
  }

  /* ── Overlay / backdrop ────────────────────────────────────────── */
  /* A <dialog> shown with showModal() (PickerDialogController): in the top layer it is fixed to the
     viewport even inside HA's transformed dialog. The UA dialog box (fit-content, auto margins,
     border, padding, max sizes) is reset so it covers the viewport like the old overlay did. */
  .mc-picker-overlay {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: auto;
    height: auto;
    max-width: none;
    max-height: none;
    margin: 0;
    border: 0;
    padding: 16px;
    overflow: hidden;
    color: inherit;
    background: rgba(0, 0, 0, 0.38);
    /* Scrolling past a list's end must not scroll the HA dialog / dashboard behind. */
    overscroll-behavior: contain;
  }

  .mc-picker-overlay:not([open]) {
    display: none;
  }

  .mc-picker-overlay::backdrop {
    background: transparent;
  }

  /* ── Modal container ───────────────────────────────────────────── */
  .mc-picker-modal {
    position: relative;
    display: flex;
    flex-direction: column;
    width: var(--mc-picker-width, 440px);
    max-width: 100%;
    max-height: min(80vh, 720px);
    overflow: hidden;
    background: var(--mc-surface);
    color: var(--mc-text);
    border-radius: 16px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.22), 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* The window takes focus when it opens (role=dialog); its controls show their own focus rings. */
  .mc-picker-modal:focus {
    outline: none;
  }

  /* ── Header: title + icon buttons ──────────────────────────────── */
  .mc-picker-header {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 12px 12px 12px 20px;
    border-bottom: 1px solid var(--mc-divider);
    cursor: grab;
    user-select: none;
  }

  .mc-picker-header:active {
    cursor: grabbing;
  }

  .mc-picker-title {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.3;
  }

  /* ── Toolbar rows under the header (search, filters, breadcrumbs) ─ */
  .mc-picker-search {
    padding: 12px 16px;
    display: grid;
    gap: 12px;
    border-bottom: 1px solid var(--mc-divider);
  }

  .mc-picker-search .input {
    min-height: 40px;
  }

  /* ── Scrollable list ───────────────────────────────────────────── */
  .mc-picker-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 8px;
    display: grid;
    align-content: start;
    gap: 2px;
  }

  .mc-picker-category,
  .mc-picker-domain {
    padding: 12px 12px 4px;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--mc-text-2);
  }

  .mc-picker-category:first-child,
  .mc-picker-domain:first-child {
    padding-top: 4px;
  }

  /* ── List row ──────────────────────────────────────────────────── */
  .mc-picker-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 48px;
    padding: 6px 12px;
    border: 1px solid transparent;
    border-radius: var(--mc-radius);
    background: transparent;
    color: var(--mc-text);
    text-align: left;
    cursor: pointer;
    transition: background-color 0.15s ease-out;
  }

  .mc-picker-item:hover {
    background: var(--mc-surface-2);
  }

  .mc-picker-item.selected,
  .mc-picker-item[aria-selected='true'] {
    background: var(--mc-accent-tint);
    border-color: color-mix(in srgb, var(--mc-accent) 45%, transparent);
  }

  .mc-picker-item:focus-visible {
    outline-offset: -2px;
  }

  .mc-picker-item-icon {
    flex: none;
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    color: var(--mc-text-2);
    --mdc-icon-size: 20px;
  }

  .mc-picker-item.selected .mc-picker-item-icon,
  .mc-picker-item[aria-selected='true'] .mc-picker-item-icon {
    color: var(--mc-accent-ink);
  }

  .mc-picker-item-content {
    flex: 1;
    min-width: 0;
    display: grid;
    line-height: 1.35;
  }

  .mc-picker-item-name {
    font-size: 0.875rem;
    font-weight: 500;
    overflow-wrap: anywhere;
  }

  .mc-picker-item-id {
    font-family: var(--mc-mono);
    font-size: 0.75rem;
    color: var(--mc-text-2);
    overflow-wrap: anywhere;
  }

  .mc-picker-item-desc,
  .mc-picker-item-meta {
    font-size: 0.75rem;
    color: var(--mc-text-2);
    margin-top: 2px;
  }

  .mc-picker-item-desc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .mc-picker-item > .chip {
    flex: none;
    max-width: 40%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mc-picker-item-thumb {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: var(--mc-radius);
    object-fit: cover;
    background: var(--mc-surface-2);
  }

  .mc-picker-item-actions {
    display: flex;
    gap: 2px;
    flex: none;
  }

  .mc-picker-item-chev {
    flex: none;
    --mdc-icon-size: 20px;
    color: var(--mc-text-2);
  }

  /* ── Breadcrumbs (media picker) ────────────────────────────────── */
  .mc-picker-breadcrumbs {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 8px 12px;
    border-bottom: 1px solid var(--mc-divider);
    overflow-x: auto;
    white-space: nowrap;
    flex-shrink: 0;
    --mdc-icon-size: 16px;
  }

  .mc-picker-breadcrumbs > ha-icon {
    color: var(--mc-text-2);
    flex: none;
  }

  .mc-breadcrumb-current {
    padding: 0 8px;
    font-size: 0.8125rem;
    font-weight: 500;
  }

  /* ── Empty / loading states ────────────────────────────────────── */
  .mc-picker-empty,
  .mc-picker-loading {
    padding: 32px 16px;
    text-align: center;
    font-size: 0.8125rem;
    color: var(--mc-text-2);
  }

  /* ── Footer ────────────────────────────────────────────────────── */
  .mc-picker-footer {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid var(--mc-divider);
  }

  /* ── Positioned modal (after first drag/resize) ─────────────── */
  .mc-modal--positioned {
    position: fixed;
    margin: 0;
    max-width: none;
    max-height: none;
  }

  /* ── Maximized modal ────────────────────────────────────────── */
  .mc-modal--maximized {
    position: fixed;
    margin: 0;
    max-width: none;
    max-height: none;
    transition: left 0.2s ease-out, top 0.2s ease-out, width 0.2s ease-out, height 0.2s ease-out;
  }

  /* ── Resize handle ──────────────────────────────────────────── */
  .mc-modal-resize-handle {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 10;
    width: 16px;
    height: 16px;
    cursor: nwse-resize;
    opacity: 0.35;
    border-radius: 0 0 16px 0;
    background: linear-gradient(135deg, transparent 50%, var(--mc-text-2) 50%);
  }

  .mc-modal-resize-handle:hover {
    opacity: 0.7;
  }
`;

export const pickerStyles = pickerLocalStyles;

/* ================================================================== */
/*  MODULE SELECTOR STYLES                                             */
/* ================================================================== */
export const moduleSelectorStyles = css`
  :host {
    --mc-picker-width: 480px;
  }

  .mc-picker-header {
    cursor: default;
  }
`;

/* ================================================================== */
/*  YAML EDITOR STYLES                                                 */
/* ================================================================== */
export const yamlEditorStyles = css`
  :host {
    display: block;
  }

  .mc-yaml-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 300px;
  }

  .mc-yaml-editor-wrapper {
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }

  .mc-yaml-textarea {
    width: 100%;
    min-height: 300px;
    padding: 12px;
    border: none;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-size: var(--ha-font-size-s, 0.875rem);
    line-height: 1.5;
    resize: vertical;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #1a1a2e);
    outline: none;
    tab-size: 2;
    box-sizing: border-box;
  }

  .mc-yaml-error {
    padding: 8px 12px;
    background: color-mix(in srgb, var(--error-color, #ef4444) 10%, transparent);
    color: var(--error-color, #ef4444);
    border-radius: 6px;
    font-size: var(--ha-font-size-xs, 0.75rem);
  }

  .mc-yaml-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--secondary-text-color, #6b7280);
    padding: 4px 0;
  }

  .mc-yaml-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--success-color, #22c55e);
  }

  .mc-yaml-status-dot.error {
    background: var(--error-color, #ef4444);
  }
`;

/* ================================================================== */
/*  TEMPLATE PICKER STYLES (with stale var fixes)                      */
/* ================================================================== */
export const templatePickerStyles = css`
  .mc-template-form {
    display: grid;
    gap: 16px;
    padding: 16px 20px;
  }

  .mc-template-error {
    font-size: 0.8125rem;
    color: var(--mc-error-ink);
  }

  .mc-template-overwrite {
    font-size: 0.8125rem;
    color: var(--mc-warn-ink);
  }

  .mc-template-confirm {
    display: grid;
    gap: 8px;
    padding: 12px 16px;
    background: var(--mc-surface-2);
    border-bottom: 1px solid var(--mc-divider);
  }

  .mc-template-confirm-text {
    font-size: 0.8125rem;
  }

  .mc-template-confirm-actions,
  .mc-template-edit-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
  }

  .mc-template-edit-form {
    display: grid;
    gap: 12px;
    padding: 16px;
    background: var(--mc-surface-2);
    border-bottom: 1px solid var(--mc-divider);
  }

  .mc-template-edit-form textarea.input,
  .mc-template-form textarea.input {
    min-height: 64px;
    font-family: inherit;
    font-size: 0.875rem;
  }
`;

/* ================================================================== */
/*  ICON PICKER STYLES (with stale var fixes)                          */
/* ================================================================== */
export const iconPickerStyles = css`
  :host {
    --mc-picker-width: 480px;
  }

  /* Keyboard-highlighted row (arrow keys in the search field). */
  .mc-picker-item.is-active {
    background: var(--mc-surface-2);
    border-color: var(--mc-field-border);
  }

  .mc-picker-item.is-active[aria-selected='true'] {
    background: var(--mc-accent-tint);
    border-color: var(--mc-accent);
  }

  .mc-picker-more {
    padding: 8px 12px 4px;
    font-size: 0.75rem;
    color: var(--mc-text-2);
    text-align: center;
  }

  .mc-picker-footer .spacer {
    flex: 1;
  }

  .mc-picker-footer .clear {
    margin-left: -8px;
  }
`;

/* ================================================================== */
/*  MEDIA PICKER STYLES (with stale var fixes)                         */
/* ================================================================== */
export const mediaPickerStyles = css`
  :host {
    --mc-picker-width: 480px;
  }
`;

/* ================================================================== */
/*  FONT PICKER STYLES (with stale var fixes)                          */
/* ================================================================== */
export const fontPickerStyles = css`
  :host {
    --mc-picker-width: 500px;
  }

  .mc-font-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 64px;
    margin: 12px 16px 0;
    padding: 12px;
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius-lg);
    background: var(--mc-surface-2);
    text-align: center;
  }

  .mc-font-preview-text {
    font-size: 1.5rem;
    line-height: 1.3;
    color: var(--mc-text);
    overflow-wrap: anywhere;
  }
`;

/* ================================================================== */
/*  SERVICE PICKER STYLES (with stale var fixes)                       */
/* ================================================================== */
export const servicePickerStyles = css`
  :host {
    --mc-picker-width: 480px;
  }
`;

/* ================================================================== */
/*  COLOR PICKER STYLES (with stale var fixes)                         */
/* ================================================================== */
export const colorPickerStyles = css`
  :host {
    --mc-picker-width: 340px;
  }

  /* ── Color field: swatch + text input ──────────────────────── */
  .swatch {
    position: relative;
    overflow: hidden;
    padding: 3px;
  }

  .swatch-fill {
    position: absolute;
    inset: 3px;
    border-radius: 5px;
    background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0;
  }

  .swatch-fill > span {
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }

  .swatch:disabled {
    cursor: default;
  }

  /* Entity colour toggle (design colour fields of a module with an entity) */
  .entity-toggle[aria-pressed='true'],
  .entity-toggle[aria-pressed='true']:hover {
    background: var(--mc-accent-tint);
    color: var(--mc-accent-ink);
  }

  .entity-opacity {
    margin-top: 8px;
  }

  /* ── Popup body ────────────────────────────────────────────── */
  .mc-color-body {
    display: grid;
    gap: 16px;
    padding: 16px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .mc-color-area {
    position: relative;
    width: 100%;
    height: 180px;
    border-radius: var(--mc-radius);
    cursor: crosshair;
    touch-action: none;
  }

  .mc-color-area-gradient {
    position: absolute;
    inset: 0;
    border-radius: var(--mc-radius);
    background: linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent);
  }

  .mc-color-area-pointer,
  .mc-slider-thumb {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.3);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .mc-slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mc-slider-label {
    width: 16px;
    flex: none;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--mc-text-2);
  }

  .mc-slider-track {
    position: relative;
    flex: 1;
    height: 12px;
    border-radius: 9999px;
    cursor: pointer;
    touch-action: none;
  }

  .mc-slider-thumb {
    top: 50%;
  }

  .mc-hue-track {
    background: linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
  }

  .mc-opacity-track {
    background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0;
  }

  .mc-opacity-gradient {
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }

  .mc-slider-row > .input {
    flex: none;
    width: 64px;
    min-height: 32px;
    padding: 4px 8px;
    text-align: center;
  }

  .mc-input-row {
    display: grid;
    grid-template-columns: minmax(0, 2fr) repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .mc-input-row .field {
    gap: 4px;
  }

  .mc-input-row .lbl {
    font-size: 0.75rem;
    color: var(--mc-text-2);
  }

  .mc-input-row .input {
    min-width: 0;
    padding: 8px;
    font-family: var(--mc-mono);
    font-size: 0.8125rem;
  }

  .mc-color-section {
    display: grid;
    gap: 8px;
  }

  .mc-color-section-header {
    font-size: 0.8125rem;
    font-weight: 500;
  }

  .mc-color-grid {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 4px;
  }

  .mc-color-swatch,
  .mc-saved-swatch {
    position: relative;
    padding: 0;
    border: 1px solid var(--mc-divider);
    border-radius: 6px;
  }

  .mc-color-swatch {
    aspect-ratio: 1;
  }

  .mc-color-swatch:hover,
  .mc-saved-swatch:hover {
    border-color: var(--mc-text-2);
  }

  .mc-color-swatch.var-color {
    display: grid;
    place-items: center;
    overflow: hidden;
    font-size: 0.625rem;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  }

  .mc-saved-colors {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .mc-saved-swatch {
    width: 32px;
    height: 32px;
  }

  .mc-saved-pick {
    position: absolute;
    inset: 0;
    padding: 0;
    border: 0;
    border-radius: inherit;
    background: transparent;
  }

  .mc-saved-pick:focus-visible {
    outline-offset: 1px;
  }

  .mc-saved-swatch .mc-remove-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    display: none;
    place-items: center;
    width: 18px;
    height: 18px;
    padding: 0;
    border: 1px solid var(--mc-divider);
    border-radius: 50%;
    background: var(--mc-surface);
    color: var(--mc-text-2);
    --mdc-icon-size: 12px;
  }

  .mc-saved-swatch:hover .mc-remove-btn,
  .mc-saved-swatch:focus-within .mc-remove-btn {
    display: grid;
  }

  .mc-saved-swatch .mc-remove-btn:hover {
    color: var(--mc-error-ink);
  }
`;

