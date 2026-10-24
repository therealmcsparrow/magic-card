import { css } from 'lit';

/* Layout of the image-only parts: the size meter row, the canvas-size window and the view-only workspace. Look and tokens are the kit's. */
export const imageStyles = css`
  .img-meter {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 12px;
    padding: 6px 12px;
    background: var(--mc-surface);
    border-bottom: 1px solid var(--mc-divider, rgba(127, 127, 127, 0.25));
  }
  .img-meter .bar {
    flex: 0 0 160px;
    height: 8px;
    border-radius: 4px;
    background: var(--mc-ground);
    overflow: hidden;
  }
  .img-meter .bar > span {
    display: block;
    height: 100%;
    background: var(--mc-text, #212121);
  }
  .img-meter.is-big .bar > span {
    background: var(--mc-accent, #03a9f4);
  }
  .img-meter.is-full .bar > span {
    background: var(--mc-warn, #b26a00);
  }
  .img-meter.is-over .bar > span {
    background: var(--mc-error, #b3261e);
  }
  .img-meter .sentence {
    flex: 1 1 240px;
    min-width: 0;
  }
  .img-meter.is-over .sentence {
    color: var(--mc-error, #b3261e);
    font-weight: 600;
  }
  .img-meter .kib {
    flex: 1 1 100%;
  }
  .img-notice {
    padding: 6px 12px;
    background: var(--mc-surface);
  }
  .presets {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
    gap: 8px;
  }
  .presets .tile .ratio {
    display: block;
    border: 2px solid currentColor;
    border-radius: 3px;
    margin-inline: auto;
  }
  .presets .tile .size {
    font-size: 0.75rem;
    opacity: 0.8;
  }
  .sizes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 12px;
    align-items: start;
  }
  .id-line {
    color: var(--mc-text-secondary, inherit);
    opacity: 0.85;
  }
  .more summary {
    cursor: pointer;
    padding-block: 6px;
  }
  .vw {
    position: relative;
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr) 300px;
  }
  [data-layout='compact'] .vw,
  [data-layout='stacked'] .vw {
    grid-template-columns: minmax(0, 1fr);
    overflow: auto;
  }
  .vw > aside {
    overflow: auto;
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .vw .layer-btns {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .vw .layer-btns .btn {
    justify-content: flex-start;
  }
  .vw .center {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 240px;
  }
  .vw .stagebox {
    position: relative;
    flex: 1;
    display: flex;
    min-height: 0;
    padding: 8px;
  }
  .vw .view-note {
    padding: 8px 12px;
  }
`;
