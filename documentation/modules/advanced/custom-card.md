# Custom card

Embeds another Lovelace card inside the Magic Card: a built-in card such as `entities` or `history-graph`, or a custom card such as `custom:mushroom-light-card`.

| | |
| --- | --- |
| `type` | `custom-card` |
| Category | Advanced |
| Editor tabs | General, Conditions, Design (no Actions tab) |
| Suits | Any Lovelace card that is installed |
| New module | `name: ""`, `card_type: ""`, `card_config: {}` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Name | `name` | string | empty | A label to recognise the module in the editor. |
| Card type | `card_type` | card type | none | The card to embed: `entities`, `gauge`, ... for built-in cards, `custom:<name>` for custom cards. |
| Card configuration | `card_config` | mapping | `{}` | The embedded card's own config, without `type`. |

`card_config_yaml` may appear in the config too. It is the YAML text as typed in the code editor, kept while it does not parse yet. You do not need to write it yourself.

## Card type picker

Type the card type in the Card type field, for example `button` or `custom:mushroom-light-card`, or press Select. Select opens a searchable list of Home Assistant's built-in cards and the custom cards that register themselves (in `window.customCards`), each marked Built-in or Custom.

## Card configuration

Once a card type is set, the Card configuration section shows the card's own editor:

-   The card's visual editor, when it has one (its editor element or its form).
-   Show code editor and Show visual editor switch between the visual editor and YAML.
-   A card without a visual editor gets a YAML field ("No visual editor available for this card type").
-   A config the visual editor cannot show opens the YAML field with the reason.

In the YAML field, do not include `type`: it comes from Card type. Invalid YAML is flagged, and the card keeps using the last valid config.

## Behaviour

-   The embedded card is created the way Home Assistant creates cards. When it cannot be created, Home Assistant's error card is shown in its place.
-   The embedded card receives every Home Assistant update, so it tracks its own entities.
-   The embedded card gets the Magic Card's preview and edit mode flags, as Home Assistant's own card wrappers pass them.
-   A `card_config` that is not a mapping shows the error "Card config must be a mapping".
-   Without a card type the module shows "No card type set".

## Example

```yaml
- type: custom-card
  name: Mushroom desk lamp
  card_type: custom:mushroom-light-card
  card_config:
    entity: light.desk
    show_brightness_control: true
```

```yaml
- type: custom-card
  card_type: history-graph
  card_config:
    entities:
      - sensor.living_room_temperature
    hours_to_show: 12
```
