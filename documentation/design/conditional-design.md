# Conditional design

A conditional rule changes the design of a module, row or column while its conditions match. Rules are stored under `design.conditional`.

```yaml
type: icon
entity: light.desk
icon: mdi:desk-lamp
design:
  background_color: "#1e1e1e"
  transition: background-color 0.3s ease
  conditional:
    - id: rule-on
      name: Light on
      mode: every
      conditions:
        - type: state
          state: "on"          # no entity: the module's entity
      design:
        background_color: entity 25%
        color: entity
```

## Creating a rule

At the top of the Design tab, "Editing design for" selects what the tab edits: Default (the normal design), Hover (see [Hover](hover.md)) or one of the rules, listed as "Rule: name". The help line under it counts the rules.

Add conditional rule creates a rule named "Rule N" with no conditions and switches the tab to it. The rule changes nothing until it has a complete condition (see [Incomplete rules](#incomplete-rules)). In a rule view the tab shows:

- Rule name (`name`).
- Match: All match (AND) (`mode: every`, the default) or Any matches (OR) (`mode: any`).
- The conditions, each with its type and fields, and Add condition. A new condition is a State condition.
- Delete rule, which removes the rule and goes back to Default.

Below that, every design section and Custom CSS edit the rule's own `design`. Sync indicators of template-linked cards are hidden in a rule view.

When the Default design has a shape or a value background, picking None in Shape or Off in Value background inside a rule writes `shape: none` or `value_background: { type: none }`, so the rule turns it off while it matches.

## Conditions

Rules use the same condition types as display conditions (see [Inspector](../inspector/README.md)):

| Type | Fields | Matches when |
| --- | --- | --- |
| `state` | `entity`, `state` (Equals), `state_not` (Not equals), `above`, `below` (YAML only) | With `state` set, the state equals it. Otherwise, with `state_not` set, the state differs from it. Otherwise `above` and `below` bound a numeric state. |
| `attribute` | `entity`, `attribute`, `state` (Equals), `state_not` (Not equals) | The attribute value, compared as text, equals `state` or differs from `state_not` |
| `time` | `after`, `before` (`HH:MM`) | The current time is at or after `after` and before `before` |
| `template` | `template` | The Jinja template renders a truthy result |

On a module, a state or attribute condition without an `entity` uses the module's entity. Set `use_module_entity: false` on the condition to turn that off. In the editor this is the Use module entity switch. Rows and columns have no entity, so their conditions need one.

### Incomplete rules

A rule changes nothing while it has no conditions, or while one of its conditions isn't filled in:

| Type | Complete when it has |
| --- | --- |
| `state` | An entity |
| `attribute` | An entity and an attribute |
| `template` | A template |
| `time` | `after`, `before` or both |

On a module, the module's entity fills in a missing entity first, so a state condition without its own entity is complete there. A complete state condition without Equals, Not equals or a bound matches while its entity exists.

## How rules apply

- Without matching rules the Default design applies.
- A matching rule's keys replace the same keys of the Default design. Keys the rule doesn't set keep their Default value.
- Rules apply in order. When two matching rules set the same key, the later rule wins.
- The replacement is per key. A rule that sets `animations` replaces the whole animation list, and a rule that sets `ring` replaces the whole ring.
- Per-side keys are separate keys: a rule's `padding` doesn't replace a Default `padding_top`.
- The [hover design](hover.md) applies on top of the Default design and every matching rule.

Add a `transition` to the Default design to animate the change when a rule starts or stops matching.

## Copying rules

Copy design copies the rules with the rest of the design. Paste in Merge mode adds the copied rules after the existing ones. See [Copy and paste](README.md#copy-and-paste).

The card itself has its own conditional appearance rules in Card settings. See [Card options](../card/README.md).
