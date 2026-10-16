# Text

Shows a line of text. The text can be static, a Jinja template rendered by Home Assistant, or an entity's state or name.

| | |
| --- | --- |
| `type` | `text` |
| Category | Content |
| Editor tabs | General, Actions, Conditions, Design |
| Suits | Any entity (with Use entity), or none |
| New module | `text: Hello World` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Text | `text` | string | empty | The text to show. Hidden in the editor while Use entity is on (the value is kept). |
| Use template | `use_template` | boolean | `false` | Renders `text` as a Home Assistant template. |
| Use entity | `use_entity` | boolean | `false` | Shows the entity instead of `text`. |
| Entity | `entity` | entity id | none | The entity shown with Use entity. |
| Attribute | `attribute` | string | none | Shows this attribute instead of the state. |
| Display | `entity_display` | `state`, `name`, `name_state`, `remaining` | `state` | With Use entity: the state, the name, `Name: state`, or a timer's time left. Remaining is offered for `timer` entities. |

Entity, Attribute and Display only appear while Use entity is on. Use template only appears while it is off.

## Entity values

-   The state and attribute are formatted by Home Assistant: translated, with the unit and the entity's display precision.
-   The name is the entity's name as Home Assistant shows it, or its id when it has none.
-   An entity that does not exist shows its id followed by "unavailable".
-   Remaining shows a timer's time left as `H:MM:SS`, or `M:SS` under an hour. It counts down every second while the timer runs and the module is on screen. A paused timer shows the time left when it was paused. An idle timer, or an entity that is not a timer, shows the state.

Use entity wins over Use template when both are on.

## Templates

With Use template on, `text` is rendered by Home Assistant when it contains `{{`, `{%` or `{#`. Text without any of these is shown as typed. The result updates live.

-   While the first result is loading, the module is empty.
-   A template error shows "Template error: ..." in place of the text.
-   The field hint in the editor is `{{ states('sensor.temp') }}`.

The module entity is not passed to the template. Write the entity id in the template.

## Examples

```yaml
- type: text
  text: Living room
```

```yaml
- type: text
  use_template: true
  text: "{{ states('sensor.outdoor_temperature') }} °C outside"
```

```yaml
- type: text
  use_entity: true
  entity: sensor.washing_machine_status
  entity_display: name_state
```

```yaml
- type: text
  use_entity: true
  entity: timer.tea
  entity_display: remaining
```
