# Seasonal scenes

A seasonal scene fills the card with snow, blossom, falling leaves, fireworks, bats and the like, with border decorations such as Christmas lights or icicles for some scenes. `seasonal: auto` picks the scene from the date, so a card looks festive at the right time of year without further setup.

The card stores it under `seasonal` at the top level. In the editor it is the Seasonal section of the card's Design tab. A single module, row or column can show a scene through the [seasonal animation presets](#seasonal-presets).

## Contents

- [Example](#example)
- [Scenes](#scenes)
- [Options](#options)
- [Auto and the calendar](#auto-and-the-calendar)
- [Border decorations](#border-decorations)
- [In the editor](#in-the-editor)
- [Seasonal presets](#seasonal-presets)
- [Limits and motion](#limits-and-motion)

## Example

```yaml
type: custom:magic-card
seasonal: auto
rows:
  - columns:
      - modules:
          - type: info
            entity: sensor.living_room_temperature
```

```yaml
type: custom:magic-card
seasonal:
  scene: auto
  intensity: 70%
  entity: input_boolean.festive
  combine: [daynight]
  calendar:
    christmas: 12-06..12-26
    valentine: "off"
rows: []
```

## Scenes

| UI label | `scene` | Particles | Border decorations | Shown by auto |
| --- | --- | --- | --- | --- |
| Winter | `winter` | Snowflakes | Frost in the corners, icicles along the top | December to February |
| Spring | `spring` | Blossom petals | A flowering vine round the bottom-left corner | March to May |
| Summer | `summer` | Sun glow, butterflies, golden motes | | June to August |
| Autumn | `autumn` | Falling leaves, a little drizzle | | September to November |
| Christmas | `christmas` | Snow and twinkling stars | Christmas lights along the border | 1 to 26 December |
| New Year | `new_year` | Fireworks and confetti | | 31 December and 1 January |
| Valentine | `valentine` | Rising hearts | | 14 February |
| Easter | `easter` | Petals and bobbing eggs | | Palm Sunday to Easter Monday |
| Halloween | `halloween` | Bats and low fog | A cobweb in the top-right corner, a pumpkin at the bottom | 24 to 31 October |
| Weather | `weather` | The scene of `weather_entity`'s state (see below) | | Never |
| Day and night | `daynight` | Follows `sun.sun`: stars, moon glow and fireflies at night, a warm glow at dusk and dawn, nothing by day | | Never |
| None | `none` | Nothing | | |

`weather` maps the weather entity's state to a scene:

| Weather state | Scene |
| --- | --- |
| `snowy`, `snowy-rainy` | Snow |
| `rainy`, `pouring`, `hail` | Rain |
| `lightning`, `lightning-rainy` | Thunderstorm: rain and lightning flashes |
| `sunny` | Sun glow and golden motes |
| `clear-night` | Night sky |
| `cloudy`, `partlycloudy` | Drifting clouds |
| `fog` | Fog bands |
| `windy`, `windy-variant` | Wind lines and blown leaves |

Any other state (`exceptional`, `unavailable` and so on) draws nothing. `daynight` counts as dusk or dawn while the sun is within 6° of the horizon.

## Options

| UI label | YAML key | Values | Default |
| --- | --- | --- | --- |
| Scene tiles | `scene` | A scene from the table, `auto` or `none` | `auto` |
| Layer | `layer` | `back` (Behind content), `front` (Over content) | `back` |
| Intensity | `intensity` | `0%` to `100%` | `50%` |
| Border decorations | `decorations` | `true`, `false` | `true` |
| Off switch | `entity` | An entity id | None |
| Weather entity | `weather_entity` | A `weather.*` entity | None |
| Hemisphere | `hemisphere` | `north`, `south` | `north` |
| Combine with | `combine` | A list of scenes | None |
| Holiday dates | `calendar` | Date ranges per holiday, see [Auto and the calendar](#auto-and-the-calendar) | The dates in the scene table |

- Short forms: `seasonal: christmas` is short for `seasonal: { scene: christmas }`, and `seasonal: true` for auto.
- Layer `front` draws the scene over the content, dimmed. Taps still reach the content. Border decorations always sit behind the content.
- Intensity is how many particles a scene draws. `100%` is 24, the most a scene draws. A plain number from 0 to 1 is a fraction (`0.7` is 70%), a larger number a percentage (`70` is 70%), and a value with `%` is read as it is.
- Off switch: while this entity's state is `off`, the scene is hidden. One `input_boolean` on all your cards turns the decorations off everywhere at once.
- Weather entity is the entity for the `weather` scene, also when `weather` is in `combine`.
- Hemisphere `south` flips the seasons. It accepts any letter case.
- `combine` draws more scenes together with the main one, for example `[daynight]` for stars at night during winter. A scene that resolves to nothing at the moment (daytime for `daynight`) adds nothing.

## Auto and the calendar

With `auto`, a holiday wins over the season. Outside the holidays the card shows the meteorological season: winter is December to February, spring March to May, summer June to August and autumn September to November. With `hemisphere: south` the seasons are flipped.

`calendar` changes the dates auto uses per holiday (`christmas`, `new_year`, `valentine`, `easter`, `halloween`):

- `MM-DD..MM-DD` is an inclusive range, for example `12-06..12-26`. A range can run over the new year, like `12-31..01-01`. A single `MM-DD` is one day.
- `easter: auto` (the default) works out Palm Sunday to Easter Monday for each year.
- `off` (or `false`) skips a holiday. Quote it in YAML (`"off"`) to keep it a string.
- An invalid range is ignored and the default dates apply.
- Where two ranges overlap, the first in this order wins: New Year, Christmas, Valentine, Easter, Halloween.

Auto goes by the date in the time zone your Home Assistant profile shows times in. With the profile set to the server's time zone, the scene changes at the server's midnight.

## Border decorations

Some scenes add decorations along the card's border: Christmas lights, icicles and frost, a flowering vine, a cobweb and a pumpkin. They follow the card's border radius or [shape](shapes.md). `decorations: false` turns them off.

The content moves in so the decorations never cover it:

| Decoration | Space kept free |
| --- | --- |
| Christmas lights | 20 px on every side |
| Icicles | 20 px at the top |
| Pumpkin | 30 px at the bottom |
| Vine | About 20 px at the bottom and left |

Frost and the cobweb are faint corner backdrops behind the content and keep no space. A small element drops the decorations that don't fit. The lights twinkle; the other decorations are still.

## In the editor

The Seasonal section starts with a grid of scene tiles: Auto, the scenes, Weather, Day and night and None. The Auto tile shows what auto picks today, for example "Today: Autumn". Arrow keys move between the tiles.

- None removes `seasonal`. On a template-linked card it writes `seasonal: none`, so the template's scene stays off.
- Picking a scene removes it from Combine with.

With a scene picked, the section shows:

- Layer, Behind content or Over content. Over content adds the help line "Over the content, dimmed. Taps still reach the content."
- Intensity, a `%` field. Help line: "How many particles: 100% is 24, the most a scene draws."
- Border decorations, a switch. Help line: "Lights, icicles, frost, a cobweb, a pumpkin or a flower vine along the border, for the scenes that have them. The content keeps clear of them."
- Weather entity, while Weather is the scene or is combined. Help line: "Snow, rain, a storm, sun, clouds, fog or wind, from its state."
- Off switch. Help line: "An input_boolean or switch: off hides the scene, on every card that uses it."
- Hemisphere, North or South, while auto is in use. Help line: "South flips the seasons."
- Combine with: a chip per scene, on or off. Help line: "Extra scenes layered on top, like Day and night during winter."
- Holiday dates, a collapsible block while auto is in use. It shows "N changed" when you changed dates. Each holiday has a text field with its default as placeholder; Easter has a switch for the automatic dates. A value that isn't valid shows "Use MM-DD..MM-DD, like 12-01..12-26, or off." and isn't saved.
- Preview date, while auto is in use. The card in the editor shows auto on that day, and the Auto tile reads "Preview: …". Help line: "Shows Auto on another day in this preview only. Not saved."

## Seasonal presets

Every scene is also an [animation preset](animations.md#seasonal) in the Seasonal group, so a single module, row or column can have one:

```yaml
type: button
entity: light.christmas_tree
design:
  animations:
    - id: tree
      preset: christmas
      intensity: 40
```

- `intensity` is the density in percent, `strength` the layer's opacity, and `decorations: false` turns off the border decorations.
- The fixed weather scenes are presets of their own: `snow`, `rain`, `storm`, `sun`, `clouds`, `fog`, `wind`, `night` and `dusk`.
- The `weather` preset follows the weather entity picked as Entity for play condition, else the module's weather entity. The `daynight` preset follows `sun.sun`.
- The other presets show a fixed scene. They don't change with the date.
- The play conditions work as for any preset.

## Limits and motion

- A card draws at most 60 seasonal particles. Its own scene takes its share first. When the seasonal presets on its modules, rows and columns ask for more than what is left, each of them is scaled down by the same factor.
- Thunderstorm flashes don't stack. A layer inside an element that already flashes skips its own flash, and at most five layers per card flash, which keeps a card under three flashes a second.
- Particles pause while the card is off-screen.
- With reduced motion turned on, a scene is a still picture.
- A card without `seasonal` and without seasonal presets is not affected at all.
