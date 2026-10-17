# Canvas width

The width switch in the top bar sets how wide the card is drawn on the canvas. It has three options, and the Studio picks one for you from the dashboard view the card sits in.

| Option | Width | Matches |
| --- | --- | --- |
| Narrow | 400 px | One masonry column, one section, a phone held upright |
| Wide | 800 px | Two section columns side by side, the main column of a sidebar view |
| Panel | The whole canvas | A panel view, where one card fills the screen |

## Following the view

When the Studio opens, it looks at the dashboard you are editing and checks the view type:

| View type | What the canvas shows |
| --- | --- |
| Masonry | Narrow, 400 px |
| Sections | Narrow, scaled to the card's `grid_options.columns`. A card of 6 of 12 columns in a standard section is 196 px wide. |
| Panel | Panel. The card border is removed, as Home Assistant does in a panel view. |
| Sidebar | Wide for the main column, Narrow at 380 px for the side column |
| Anything else | Narrow, with a note above the card |

Home Assistant tells the editor the dashboard layout, and the view comes from the page address. If the card sits inside a stack card, you see the width of the view, which is wider than the stack's slot. Pick Narrow in that case.

Custom view types (for example `custom:grid-layout`) and dashboards that Home Assistant builds from a strategy can't be read. The canvas uses Narrow and the label says so ("View type custom:grid-layout isn't supported" or "Couldn't tell the view type").

## Changing it yourself

-   Pick another option and the canvas uses it. The label above the card then shows a "Match view" button. It returns to the view's width.
-   Picking the option that is already checked changes nothing.
-   The label shows the option and the drawn width ("Narrow · 400 px"), on the right where the width comes from ("Matches this view (masonry)"), and "Live data".
-   The Panel width in the label follows the canvas as you resize the window.
-   When the canvas is narrower than the chosen width, the card shrinks to fit and the label adds "shown at 560 px".
-   The width changes with a short animation, and the selection frame follows.
-   The choice is not saved in the config. It stays while the card dialog is open, and the next card dialog starts on the view's width again.
-   The switch is hidden in YAML mode.

The switch is a radio group. With focus on it, Right and Left move to the next and previous option (wrapping), Home and End to the first and last.
