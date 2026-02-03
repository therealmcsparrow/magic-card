import { css } from 'lit';

export const formEditorStyles = css`
  :host {
    display: block;
  }

  .mc-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mc-rows-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* Card-level settings */
  .mc-card-section {
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    overflow: hidden;
  }

  .mc-card-section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 6%, transparent);
    cursor: pointer;
    user-select: none;
    font-size: 0.8125rem;
    font-weight: 600;
  }

  .mc-card-section-header:hover {
    background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, transparent);
  }

  .mc-card-section-header .mc-chevron {
    transition: transform 0.2s;
    margin-left: auto;
  }

  .mc-card-section-header .mc-chevron.open {
    transform: rotate(90deg);
  }

  .mc-card-section-body {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-top: 1px solid var(--divider-color, #e5e7eb);
  }

  /* Row */
  .mc-row-item {
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    overflow: hidden;
  }

  .mc-row-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 4%, transparent);
    font-size: 0.8125rem;
    font-weight: 500;
  }

  .mc-row-header .mc-label {
    min-width: 50px;
  }

  .mc-row-layout-select {
    flex: 1;
    max-width: 100px;
  }

  .mc-row-layout-select .mc-field {
    margin: 0;
  }

  .mc-row-layout-select select {
    padding: 4px 8px;
    font-size: 0.75rem;
  }

  .mc-row-body {
    padding: 8px;
    display: flex;
    gap: 8px;
  }

  /* Drag handles */
  .mc-drag-handle,
  .mc-module-drag {
    cursor: grab;
    color: var(--secondary-text-color, #6b7280);
    display: flex;
    align-items: center;
    padding: 2px;
    border-radius: 4px;
  }

  .mc-drag-handle:hover,
  .mc-module-drag:hover {
    background: var(--divider-color, #e5e7eb);
    color: var(--primary-text-color, #1a1a2e);
  }

  .mc-drag-handle:active,
  .mc-module-drag:active {
    cursor: grabbing;
  }

  /* Sortable ghost */
  .mc-sortable-ghost {
    opacity: 0.4;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 20%, transparent);
  }

  /* Column */
  .mc-col-item {
    flex: 1;
    border: 1px dashed var(--divider-color, #e5e7eb);
    border-radius: 6px;
    padding: 8px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .mc-col-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-col-header .mc-label {
    flex: 1;
  }

  .mc-col-header .mc-btn-small {
    opacity: 0;
    transition: opacity 0.15s;
  }

  .mc-col-item:hover .mc-col-header .mc-btn-small {
    opacity: 1;
  }

  .mc-modules-container {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 20px;
  }

  /* Module item */
  .mc-module-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
    font-size: 0.8125rem;
    background: var(--card-background-color, #fff);
  }

  .mc-module-item:hover {
    border-color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 5%, transparent);
  }

  .mc-module-item.selected {
    border-color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, transparent);
  }

  .mc-module-item-icon {
    color: var(--primary-color, #6366f1);
  }

  .mc-module-item-name {
    flex: 1;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mc-module-item-type {
    font-size: 0.6875rem;
    color: var(--secondary-text-color, #6b7280);
    background: var(--divider-color, #e5e7eb);
    padding: 2px 6px;
    border-radius: 4px;
  }

  .mc-module-item .mc-btn-small {
    opacity: 0;
    transition: opacity 0.15s;
  }

  .mc-module-item:hover .mc-btn-small {
    opacity: 1;
  }

  .mc-add-module-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px;
    border: 1px dashed var(--divider-color, #e5e7eb);
    border-radius: 6px;
    background: none;
    cursor: pointer;
    font-size: 0.75rem;
    color: var(--secondary-text-color, #6b7280);
    transition: all 0.15s;
    width: 100%;
  }

  .mc-add-module-btn:hover {
    border-color: var(--primary-color, #6366f1);
    color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 5%, transparent);
  }

  /* Button variants */
  .mc-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 6px;
    background: none;
    cursor: pointer;
    color: var(--secondary-text-color, #6b7280);
    transition: all 0.15s;
  }

  .mc-btn-icon:hover {
    background: var(--divider-color, #e5e7eb);
    color: var(--primary-text-color, #1a1a2e);
  }

  .mc-btn-small {
    width: 22px;
    height: 22px;
  }

  .mc-btn-add-col {
    color: var(--success-color, #22c55e);
  }

  .mc-btn-add-col:hover {
    background: color-mix(in srgb, var(--success-color, #22c55e) 15%, transparent);
    color: var(--success-color, #22c55e);
  }

  .mc-btn-delete {
    color: var(--error-color, #ef4444);
  }

  .mc-btn-delete:hover {
    background: color-mix(in srgb, var(--error-color, #ef4444) 15%, transparent);
    color: var(--error-color, #ef4444);
  }
`;
