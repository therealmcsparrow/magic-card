# Graph

A line graph of an entity's history, with an optional label line under it.

| | |
| --- | --- |
| `type` | `graphs` (plural) |
| Category | Content |
| Editor tabs | General, Actions, Conditions, Design |
| Suits | Entities with a numeric state or attribute that the recorder keeps: `sensor`, `input_number`, `number`, a climate's `current_temperature` |
| New module | `hours_to_show: 24`, `points_per_hour: 2`, `line_width: 2`, `fill: true`, `show_points: false`, `show_labels: true` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Entity | `entity` | entity id | none | The entity. |
| Attribute | `attribute` | attribute name | none | Graphs this attribute instead of the state. |
| Hours to show | `hours_to_show` | 1 to 168 | `24` | The period shown. |
| Points per hour | `points_per_hour` | 0.1 to 60, or empty | every change | Values are averaged per period: 2 is one point per 30 minutes. Empty draws every recorded change. |
| Line color | `line_color` | colour | theme primary colour | Line colour. |
| Line width | `line_width` | 1 to 10 | `2` | Line width in pixels. |
| Fill | `fill` | boolean | `true` | Fills the area under the line. `false` draws the line alone. |
| Fill color | `fill_color` | colour | theme primary colour | Fill colour, drawn at 15% opacity. Only in the editor while Fill is on. |
| Show points | `show_points` | boolean | `false` | Draws a dot on each point. |
| Show labels | `show_labels` | boolean | `true` | A line under the graph with the name (and attribute), the current value and the period, for example `21.5 °C · 24h`. |

## Behaviour

-   History comes from Home Assistant's recorder. The current value is added as the last point.
-   The graph is 60 pixels high. The vertical scale runs from the lowest to the highest value shown.
-   States that are not numbers (unavailable, unknown) are skipped.
-   A period without a recorded change keeps the last value.
-   Fetched history is kept for 5 minutes and shared by every graph and sparkline [value background](../../design/README.md) with the same entity, attribute and period. The card checks every minute whether it needs fetching again.
-   When fetching again fails, the graph keeps drawing the history it already had.
-   An attribute graph loads every recorded state with all its attributes, so long periods can load slowly. The editor warns above 48 hours.

Instead of a graph the module can show "No entity", "Loading history…", "History unavailable" (the request failed and there is no earlier history to draw) or "No numeric history".

## Example

```yaml
- type: graphs
  entity: sensor.living_room_temperature
  hours_to_show: 48
  points_per_hour: 1
  line_color: "#ff9800"
  fill: true
  show_labels: true
```
