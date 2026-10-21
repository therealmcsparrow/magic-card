import { css } from 'lit';

/*
 * The two host rules of a pop-up card, in the plain sheet so the card is laid out the same before the popup chunk has
 * loaded. data-mc-popup-hidden (a pop-up on a live dashboard, set from the config alone): out of the flow with zero size,
 * its dialog is in the top layer. data-mc-popup-editor (a pop-up in an editor): inline, and the positioning context of
 * its absolutely placed parts. Written compact: css`` text goes into the bundle as is.
 */
export const popupHostStyles = css`:host([data-mc-popup-hidden]){display:block;position:absolute;width:0;height:0;overflow:visible}:host([data-mc-popup-editor]){position:relative}`;
