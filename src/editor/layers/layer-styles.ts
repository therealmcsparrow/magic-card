import { css, type CSSResult } from 'lit';

/* Layout of the Placement / Layer groups and the Card backdrop group (shared; the control edges are in tokens.ts). */
export const layerStyles: CSSResult = css`
      :host {
        display: block;
        min-width: 0;
        container-type: inline-size;
      }
      .groups {
        display: grid;
        gap: 20px;
        margin-bottom: 20px;
      }
      h3 {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 600;
      }
      .help {
        margin: 0;
        font-size: 0.8125rem;
        color: var(--mc-text-2);
      }
      .lseg {
        display: flex;
        flex-wrap: wrap;
        gap: var(--lyr-gap);
      }
      .lseg > button {
        flex: 1 1 96px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 0 10px;
        cursor: pointer;
      }
      .lseg > button .tick {
        font-weight: 700;
      }
      .row2 {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: flex-start;
      }
      .row2 > .f {
        flex: 1 1 140px;
        min-width: 0;
      }
      /* narrow pane (container width, not viewport): the position grid stacks above the From fields; Placement wraps one per line */
      @container (max-width: 360px) {
        .row2 {
          display: grid;
        }
      }
      @container (max-width: 280px) {
        .lseg > button {
          flex-basis: 100%;
        }
      }
      label,
      .lbl {
        display: block;
        font-size: 0.8125rem;
        font-weight: 500;
        margin-bottom: 2px;
      }
      .lyr-input {
        width: 100%;
      }
      .err {
        margin: 4px 0 0;
        font-size: 0.8125rem;
        color: var(--mc-error-ink);
      }
      .err::before,
      .warnrow::before {
        content: '\\26A0\\00a0';
      }
      .warnrow {
        margin: 0;
        padding: 8px 10px;
        border: 1px solid var(--mc-warn-ink);
        border-radius: var(--mc-radius);
        background: var(--mc-warn-tint);
        font-size: 0.8125rem;
      }
      .tiles2 {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
        gap: var(--lyr-gap);
      }
      .lyr-tile {
        display: grid;
        gap: 4px;
        padding: 6px;
        text-align: left;
        cursor: pointer;
      }
      .lyr-tile .pv {
        height: 40px;
        border-radius: 4px;
        border: 1px solid var(--mc-ed-ctl-line);
      }
      .lyr-tile .nm {
        font-size: 0.8125rem;
      }
      .lyr-tile .sub {
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .order {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--lyr-gap);
      }
      .order button {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 0 10px;
        min-height: 44px;
        cursor: pointer;
      }
      .order button[aria-disabled='true'] {
        opacity: 0.55;
        cursor: not-allowed;
      }
      .readout {
        margin: 0;
        font-weight: 600;
        font-size: 0.875rem;
      }
      .stack {
        display: flex;
        flex-direction: column;
        gap: 3px;
        align-items: flex-start;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .stack .bar {
        width: 72px;
        height: 8px;
        border-radius: 2px;
        border: 1px solid var(--mc-ed-ctl-line);
      }
      .stack .bar.me {
        background: var(--mc-text, #212121);
        border-color: var(--mc-text, #212121);
        display: flex;
        align-items: center;
        justify-content: center;
        height: 12px;
        color: var(--mc-surface, #fff);
        font-size: 10px;
        line-height: 1;
      }
      .chip2 {
        display: inline-block;
        padding: 0 8px;
        border: 1px solid var(--mc-ed-ctl-line);
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
      }
      .disc {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 0 10px;
        cursor: pointer;
        text-align: left;
      }
      .disc .arrow {
        display: inline-block;
        transition: transform 0.15s ease-out;
      }
      .disc[aria-expanded='true'] .arrow {
        transform: rotate(90deg);
      }
      .effects {
        display: grid;
        gap: 14px;
        padding: 12px 0 0;
      }
      .inline {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .inline > .lyr-range {
        flex: 1 1 120px;
      }
      .inline > .lyr-input {
        width: 72px;
        flex: none;
      }
      .cost {
        margin: 0;
        padding: 8px 10px;
        border: 1px solid var(--mc-ed-ctl-line);
        border-radius: var(--mc-radius);
        font-size: 0.8125rem;
      }
      /* the cost note and the Low-power switch under it are stacked with a gap, never touching */
      .costbox {
        display: grid;
        gap: 12px;
        min-width: 0;
      }
      .costbox > .sw-row {
        align-items: center;
      }
      .cost b {
        font-weight: 700;
      }
      .cost[data-level='heavy']::before {
        content: '\\26A0\\00a0';
      }
      .yaml {
        margin: 8px 0 0;
        padding: 8px;
        border: 1px solid var(--mc-ed-divider);
        border-radius: var(--mc-radius);
        background: var(--mc-surface-2);
        font-family: var(--mc-mono);
        font-size: 0.75rem;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }
      .lyr-btn {
        padding: 0 12px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        justify-content: center;
      }
      .acts {
        display: flex;
        flex-wrap: wrap;
        gap: var(--lyr-gap);
      }
      .undo {
        margin: 0;
        font-size: 0.8125rem;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .sw-row {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        justify-content: space-between;
      }
      .sw-row .txt {
        flex: 1;
        min-width: 0;
      }
      .group {
        display: grid;
        gap: 12px;
      }
      .group + .group {
        padding-top: 20px;
        border-top: 1px solid var(--mc-ed-divider);
      }
      .group-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .group-head h3 {
        flex: 1;
      }
`;
