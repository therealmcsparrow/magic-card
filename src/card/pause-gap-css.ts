import { css } from 'lit';

/*
 * The 24 px strip the Pause motion button sits in. While pause_button is auto or always, .mc-card-content carries
 * data-mc-pause-gap=top|bottom (from the config alone) and gets a flex ::before / ::after at that edge, on top of its
 * padding and gap, so the button covers no module. These rules are in the plain sheet so the strip is there before the
 * pause chunk has loaded. Written compact: css`` text goes into the bundle as is.
 */
export const pauseGapStyles = css`
.mc-card-content[data-mc-pause-gap]::before,.mc-card-content[data-mc-pause-gap]::after{content:'';flex:none;height:24px}
.mc-card-content[data-mc-pause-gap=top]::after,.mc-card-content[data-mc-pause-gap=bottom]::before{display:none}
`;
