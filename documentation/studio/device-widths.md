# Device widths

The device switch in the top bar sets how wide the card is drawn on the canvas.

| Device | Width |
| --- | --- |
| Phone | 360 px |
| Tablet | 560 px |
| Desktop | 760 px |

-   Phone is the default.
-   The label above the card shows the device and width ("Phone · 360 px") and "Live data".
-   When the canvas is narrower than the chosen width, the card shrinks to fit the canvas.
-   The width changes with a short animation, and the selection frame follows.
-   The choice is not saved in the config. It stays while the card dialog is open.
-   The switch is hidden in YAML mode.

The switch is a radio group. With focus on it, Right and Left move to the next and previous width (wrapping), Home and End to the first and last.
