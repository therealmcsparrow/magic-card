# Card entity: YAML and templates

The exact rules behind the [card entity](README.md). Back to [Card entity](README.md).

## Contents

-   [Keys](#keys)
-   [How YAML spellings are read](#how-yaml-spellings-are-read)
-   [Which entity a module uses](#which-entity-a-module-uses)
-   [Template variables](#template-variables)
-   [What does not follow the card entity](#what-does-not-follow-the-card-entity)

## Keys

| Key | On | Type / values | Default | What it does |
| --- | --- | --- | --- | --- |
| `entity` | The card | Entity id | none | The device the card is for. Modules without an entity of their own use it. |
| `entity` | Any module | Entity id, or `none` | none | The module's own entity. `none` switches it off. |
| `entity` | Card row, card column, column of a row module | Entity id, or `none` | none | The same as on a module. |
| `share_entity` | Row, column, tabs, row module and slider layout modules, card rows and columns, columns of a row module | `true` / `false` | `false` | The node passes its own `entity` on to the modules inside it. |

At card level, `none` counts as no card entity. The editor removes the key instead of writing it.

## How YAML spellings are read

A module's `entity` is read the same way in the editor and on the dashboard.

| YAML | Meaning | The editor shows |
| --- | --- | --- |
| no `entity` key | Follow the card or the layout around it | Same as card, or Same as row, Same as column (greyed out when there is nothing to follow) |
| `entity:` (empty), `entity: null`, `entity: ~`, `entity: ''`, spaces only | Follow, the same as no key | The same. The editor writes no key on the next change. |
| `entity: none` | No entity | No entity |
| `entity: light.kitchen` | That entity | Pick one |
| `entity: None`, `entity: NONE`, `entity: " none "` | Not `none` and not an entity id: nothing works | Pick one, with a message. For `None` and `NONE` the message asks "Did you mean No entity?" and offers a button that writes `none`. |

Only the exact lower-case `none` means no entity. The id is used as it is written, without trimming it.

## Which entity a module uses

In this order, the first that applies:

1. The module's own entity (`entity: sensor.temp`).
2. `entity: none`: no entity.
3. The nearest layout module, column or row above it that has its own entity and `share_entity: true` (a column of a row module counts as a column).
4. The card `entity`.
5. No entity.

A row, column or layout with `entity: none` stops the search for everything inside it: modules inside get no entity (not even the card's), unless a layout further in shares one or the module picks its own.

Two more rules apply after the search:

-   The Custom card module takes no inherited entity.
-   A module that needs one kind of device (camera, weather, forecast, light, dropdown) takes the inherited entity only if it is the right kind. Otherwise it has no entity, and the search does not look further out: the nearest source wins.

Rows and columns of the card, and the columns of a row module, are nodes of this search like layout modules. Their own entity (else the one they would pass on from above) feeds their design rules, ring, value background, animations, display conditions and row actions. Only the card itself always uses the card entity. A row or column marked `not_synced` for `entity` or `share_entity` keeps its own value when the card is linked to a Magic Card Utils template.

Display conditions (the ones that show or hide a module) never use a module's entity. A state or attribute condition names its own entity, as before.

## Template variables

Jinja templates get two variables, but only the ones the template mentions:

| Variable | Value |
| --- | --- |
| `entity` | The entity the module uses, as an id. An empty string when it has none. |
| `card_entity` | The card entity. An empty string when the card has none. |

This works in the template of a Text module, in the content of a Markdown module, and in `template` conditions (display conditions and conditional design rules).

```yaml
type: custom:magic-card
entity: light.kitchen
rows:
  - columns:
      - modules:
          - type: text
            template: "{{ state_attr(entity, 'friendly_name') }} is {{ states(entity) }}"
          - type: text
            entity: sensor.outside_temperature
            template: "Outside {{ states(entity) }}, inside the {{ state_attr(card_entity, 'friendly_name') }}"
```

The first module follows the card entity, so `entity` is `light.kitchen`. The second has its own entity, so `entity` is the sensor and `card_entity` is still the light.

A template that mentions neither name gets no variables and behaves exactly as before. A template that used the name `entity` for something else, with no entity set anywhere, now reads an empty string where it used to read an undefined value.

A Text module with Use template on has an Entity field (Same as card, Pick one, No entity) and its hint shows `{{ states(entity) }}` and `{{ states(card_entity) }}`. The other template fields in the editor do not list these names. They are documented on this page and in [Card entity](README.md#templates).

## What does not follow the card entity

-   [Flows](../flows/README.md): a flow with no entity still means "always flowing". A module with `entity: none` counts as having no entity.
-   Pop-up open and close triggers, the seasonal off switch and conditional card appearance keep their own entities.
-   Magic Card Utils templates never contain the card entity (see [Card entity](README.md#templates)).
