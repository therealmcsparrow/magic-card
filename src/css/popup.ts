import { css } from 'lit';

/**
 * Pop-up mode (src/card/popup-controller.ts): a full-viewport transparent native <dialog> in the top
 * layer holding our own backdrop and the surface (the card's ha-card). Sheet: slides up from the
 * bottom edge; dialog: centred, fades and scales. Reduced motion: no movement.
 */
export const popupStyles = css`
  /* editor: inline card, marked as a pop-up (its host rules are in src/card/popup-host-css.ts); the badge sits on the card's top edge, so it covers as little of the content as possible */
  .mc-popup-badge {
    position: absolute;
    top: -12px;
    right: 12px;
    z-index: 3;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 24px;
    padding: 0 10px;
    border-radius: 9999px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    background: color-mix(in srgb, var(--card-background-color, #fff) 92%, transparent);
    color: var(--secondary-text-color, #5f6368);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    pointer-events: none;
    --mdc-icon-size: 14px;
  }

  dialog.mc-popup {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--primary-text-color);
    overflow: hidden;
    outline: none;
  }
  dialog.mc-popup:not([open]) {
    display: none;
  }
  dialog.mc-popup::backdrop {
    background: transparent;
  }

  .mc-popup-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, var(--mc-popup-backdrop-opacity, 0.4));
    -webkit-backdrop-filter: blur(var(--mc-popup-blur, 8px));
    backdrop-filter: blur(var(--mc-popup-blur, 8px));
    opacity: 1;
    transition: opacity 0.28s ease-out;
  }
  dialog.mc-popup[data-phase='closing'] .mc-popup-backdrop {
    opacity: 0;
  }

  .mc-popup-frame {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    pointer-events: none;
    box-sizing: border-box;
  }
  dialog.mc-popup[data-style='sheet'] .mc-popup-frame {
    align-items: flex-end;
    padding-top: max(16px, env(safe-area-inset-top));
  }
  dialog.mc-popup[data-style='dialog'] .mc-popup-frame {
    align-items: center;
    padding: 16px;
  }

  ha-card.mc-popup-surface {
    pointer-events: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: var(--mc-popup-width, 600px);
    max-height: min(var(--mc-popup-max-height, 90vh), 100%);
    height: auto;
    overflow: hidden;
    outline: none;
    border-radius: var(--mc-popup-radius, var(--ha-card-border-radius, 12px));
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08);
  }
  dialog.mc-popup[data-style='sheet'] ha-card.mc-popup-surface {
    border-radius: var(--mc-popup-radius, 24px) var(--mc-popup-radius, 24px) 0 0;
    border-bottom-width: 0;
    padding-bottom: env(safe-area-inset-bottom);
    transform: translateY(var(--mc-popup-drag, 0px));
    transition: transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  dialog.mc-popup[data-style='sheet'][data-phase='closing'] ha-card.mc-popup-surface {
    transform: translateY(100%);
    transition-duration: 0.28s;
    transition-timing-function: ease-in;
  }
  dialog.mc-popup[data-style='dialog'] ha-card.mc-popup-surface {
    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
  }
  dialog.mc-popup[data-style='dialog'][data-phase='closing'] ha-card.mc-popup-surface {
    opacity: 0;
    transform: scale(0.96);
  }
  ha-card.mc-popup-surface[data-dragging] {
    transition: none;
  }
  @starting-style {
    dialog.mc-popup[data-style='sheet'][data-phase='open'] ha-card.mc-popup-surface {
      transform: translateY(100%);
    }
    dialog.mc-popup[data-style='dialog'][data-phase='open'] ha-card.mc-popup-surface {
      opacity: 0;
      transform: scale(0.96);
    }
    dialog.mc-popup[data-phase='open'] .mc-popup-backdrop {
      opacity: 0;
    }
  }

  .mc-popup-head {
    position: relative;
    flex: none;
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 48px;
    padding: 8px 8px 0 16px;
    box-sizing: border-box;
  }
  dialog.mc-popup[data-style='sheet'] .mc-popup-head {
    padding-top: 16px;
    touch-action: none;
    cursor: grab;
  }
  dialog.mc-popup[data-style='sheet'] ha-card[data-dragging] .mc-popup-head {
    cursor: grabbing;
  }
  .mc-popup-handle {
    position: absolute;
    top: 6px;
    left: 50%;
    width: 36px;
    height: 4px;
    margin-left: -18px;
    border-radius: 9999px;
    background: color-mix(in srgb, var(--primary-text-color, #212121) 28%, transparent);
  }
  .mc-popup-title {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: var(--ha-card-header-font-size, 1.125rem);
    font-weight: 500;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }
  .mc-popup-close {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    border-radius: 9999px;
    background: transparent;
    color: var(--secondary-text-color, #5f6368);
    cursor: pointer;
    transition: background-color 0.15s ease-out;
  }
  .mc-popup-close:hover {
    background: color-mix(in srgb, var(--primary-text-color, #212121) 8%, transparent);
  }
  .mc-popup-close:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
  }
  .mc-popup-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  @media (prefers-reduced-motion: reduce) {
    .mc-popup-backdrop,
    dialog.mc-popup ha-card.mc-popup-surface,
    dialog.mc-popup[data-phase='closing'] ha-card.mc-popup-surface {
      transition: none;
    }
  }
`;
