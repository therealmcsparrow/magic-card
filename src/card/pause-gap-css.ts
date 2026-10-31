import { css } from 'lit';

/*
 * The 24 px strip the Pause button sits in (set by data-mc-pause-gap) and the paused animation
 * rule, in the plain sheet so a remembered pause holds before the chunk loads. Written compact.
 */
export const pauseGapStyles = css`
ha-card[data-mc-paused],ha-card[data-mc-paused] *,ha-card[data-mc-paused] *::before,ha-card[data-mc-paused] *::after{animation-play-state:paused!important}
.mc-card-content[data-mc-pause-gap]::before,.mc-card-content[data-mc-pause-gap]::after{content:'';flex:none;height:24px}
.mc-card-content[data-mc-pause-gap=top]::after,.mc-card-content[data-mc-pause-gap=bottom]::before{display:none}
`;
