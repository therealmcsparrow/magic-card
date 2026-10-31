import { css } from 'lit';

/** The two host rules of a pop-up card, in the plain sheet. */
export const popupHostStyles = css`:host([data-mc-popup-hidden]){display:block;position:absolute;width:0;height:0;overflow:visible}:host([data-mc-popup-editor]){position:relative}`;
