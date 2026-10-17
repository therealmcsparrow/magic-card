# Conditions tab

The Conditions tab decides when the card, a row, a column or a module is shown. On the card it also holds conditional appearance rules. Back to the [inspector overview](README.md).

## Contents

-   [Display conditions](#display-conditions)
-   [Condition fields](#condition-fields)
-   [Conditional appearance (card only)](#conditional-appearance-card-only)

## Display conditions

Without conditions the tab shows "Always visible" and an Add condition button. With conditions it shows "Show this card / row / column / module when…", a match choice and the list.

| UI label | YAML key | Values | Default | What it does |
| --- | --- | --- | --- | --- |
| All match (AND) / Any matches (OR) | `display.mode` | `every`, `any` | `every` | Every condition must match, or one is enough. |
| Add condition | `display.conditions` | List | empty | Adds a State condition. |
| Bin button | | | | Removes that condition. |

Hidden items are left out of the card on the dashboard. In the editor canvas they stay visible and are marked as hidden.

## Condition fields

Every condition has a Type (`type`): State, Attribute, Time or Template. The fields depend on the type.

| Type | UI label | YAML key | Values | What it does |
| --- | --- | --- | --- | --- |
| State | Entity | `entity` | Entity id | The entity whose state is checked. |
| State | Operator | `state` or `state_not` | equals, not equals | Equals stores the value as `state`; not equals stores it as `state_not`. |
| State | State | `state` / `state_not` | Text | The state to compare with, for example `on` or `home`. The comparison is exact and case-sensitive. |
| Attribute | Entity | `entity` | Entity id | The entity whose attribute is checked. |
| Attribute | Attribute | `attribute` | Attribute name | For example `brightness` or `current_temperature`. |
| Attribute | Operator | `state` or `state_not` | equals, not equals | As for State. |
| Attribute | Value | `state` / `state_not` | Text | The attribute value to compare with, as text. |
| Time | After | `after` | `HH:MM` | Met from this time on. |
| Time | Before | `before` | `HH:MM` | Met until this time. |
| Template | Template | `template` | Jinja template | Met while the template renders true. |

The number comparisons `above` and `below` have no field and are YAML only. How each type is evaluated (time zone, empty fields, template results) is in [Display conditions](../card/display-conditions.md).

## Conditional appearance (card only)

On the card, the Conditions tab starts with Conditional appearance and then shows the card's display conditions. An appearance rule changes card fields, like the background colour, while its conditions match. Rules apply in order, and a later matching rule wins for the fields it sets.

Without rules the section shows "No appearance rules" and Add appearance rule. Each rule has a header and a body you can expand or collapse.

| UI label | YAML key | Values | Default | What it does |
| --- | --- | --- | --- | --- |
| Add appearance rule | `conditional_appearance` | List of rules | none | Adds a rule named `Rule N` and opens it. |
| Rule name | `name` | Text | `Rule N` | A name for the rule. |
| `N cond.` chip | | | | How many conditions the rule has. |
| Remove rule | | | | Deletes the rule. |
| Conditions | `conditions`, `mode` | As display conditions | none, `every` | When the rule applies. Same types, fields and match choice as above. |

A rule changes nothing until it has at least one condition and every condition is filled in: an entity for State, an entity and an attribute for Attribute, After or Before for Time, and a template for Template.

The appearance overrides below only apply for fields you set. A blank field keeps the card's own setting.

| UI label | YAML key under `overrides` | Values | What it does |
| --- | --- | --- | --- |
| Background color | `background` | CSS colour or background | Replaces the card background. |
| Background image | `background_image` | Media or CSS image | Replaces the background image. |
| Override dashboard theme | `use_page_theme` | Stored as `false` when on | Switches the card to its own theme while the rule matches. |
| Card theme | `theme` | Theme name | The theme to use. Shown while Override dashboard theme is on. |
| Border radius | `border_radius` | CSS length | Replaces the corner radius. |
| Padding | `padding` | One to four CSS lengths | Replaces the card padding. |
| Box shadow | `box_shadow` | CSS `box-shadow` | Replaces the card shadow. |
| Card height | `card_height` | CSS length | Replaces the minimum height. |

Ring, shape, value background and seasonal rules are set in the card's Design tab, under Editing design for. Each rule here shows a count of them, such as "+ 3 design fields", and editing the rule keeps them.

Rules are also applied in the editor preview, so you see the result while the conditions match. The YAML form is in [Conditional appearance](../card/conditional-appearance.md).
