# Icon library

The icon library is a set of 192 ready-made icon animations for the devices and states Home Assistant shows most: lights, fans, covers, media players, appliances, energy, water, alarms, weather and more, plus animals, household chores, maker machines and seasonal icons for Christmas, Halloween and Valentine. Each entry is a keyframes animation of one Material Design Icon, split into parts that move on their own. It is a starting point: open an entry, change what you like and save it as your own animation.

The icon library is built into the studio and the card editor. It is separate from your library of saved animations (My animations), and nothing from it is stored in Home Assistant until you save it.

-   [Where to find it](#where-to-find-it)
-   [Browsing and search](#browsing-and-search)
-   [Customising an entry](#customising-an-entry)
-   [How the entries are built](#how-the-entries-are-built)
-   [The entries](#the-entries)
-   [Credits](#credits)

## Where to find it

-   In the studio: New animation, then Icon animation…, under Or start from the icon library. See [Icon animations](icon-mode.md#start-from-the-icon-library).
-   In the card editor: the Animated icons tab of a module's icon picker. There the entries that fit the module's icon and entity come first, and a Style switch plays them Quiet, Living or Glow. See [Animated icons in the icon picker](using-in-cards.md#animated-icons-in-the-icon-picker) and [Styles](../design/quick-icon-animator.md#styles-quiet-living-and-glow). The studio always opens an entry as Living.

## Browsing and search

The studio shows every entry as a tile with a live thumbnail (a small Magic Card playing the entry), its name and its domain. Hovering a tile shows its name and icon id. Thumbnails play only while they are on screen. Without Magic Card on the page, a tile shows the plain icon.

-   Search icons matches the entry's name, id, icon id, domain and tags. With several words, every word has to match. "bell", "rain" or "washing" all find something.
-   The domain list (All domains, or one domain such as Light or Weather) shows the entries of that domain. Entries tagged with a domain show there too, so Climate also lists the thermometer and Humidifier also lists the humidity drop. Icons no domain fits are in the categories Animal, Household, Maker and Seasonal, which the list shows next to the domains.
-   When nothing matches, the window says "No icon animations match "…"."

## Customising an entry

Click a tile to open a copy of the entry in the editor as a new animation. It keeps the entry's name and id; when you already have one with that name or id, the copy gets a number (`fan-spin-2`). Like any new animation it is marked New and is not in your library until you save it.

Everything is editable: the parts and groups, the pivots, the keys on the timeline, the timing, and [part presets](icon-mode.md#part-presets) for parts that do not move yet. Save keeps it in My animations, ready for any card as `preset: custom:<id>`.

The entry itself never changes. Opening it again starts from the original.

## How the entries are built

-   Each entry is a keyframes animation with Target Icon, repeating forever. The element has one still key (`{ at: 0, opacity: 1 }`); the motion is in the `tracks` of the parts and groups.
-   The parts point at the shapes of the icon. The entries carry their own copy of the icon's shapes (`rig.svg`), so they look the same whatever version of the Material Design Icons Home Assistant ships. The lock entry uses a drawing cut from the lock icon, so its shackle can move apart from the body. The Security camera entry does the same with the camera icon: only the head pans, and the wall mount stays still.
-   On a card, an entry plays on the module's icon and draws its own icon in place of the module's. Use it on a module with the same icon for the most natural result.
-   Every entry stays within the animation limits (64 parts, 24 tracks, 64 KB).

## The entries

Grouped by the Home Assistant domain they are made for, then the four categories for icons no domain fits. The id is the id the copy gets when you open it.

### Alarm panel (`alarm_control_panel`)

| Name | Id | Icon |
| --- | --- | --- |
| Security armed | `security-armed` | `mdi:shield-home` |

### Binary sensor (`binary_sensor`)

| Name | Id | Icon |
| --- | --- | --- |
| Door opening | `door` | `mdi:door` |
| Fridge door | `fridge` | `mdi:fridge` |
| Water drop | `water-drop` | `mdi:water` |
| Smoke alarm | `smoke-alarm` | `mdi:smoke-detector-alert` |
| Smoke detector standby | `smoke-detector` | `mdi:smoke-detector` |
| Alert | `alert` | `mdi:alert` |
| Motion detected | `motion` | `mdi:motion-sensor` |
| Wi-Fi | `wifi` | `mdi:wifi` |
| Router | `router` | `mdi:router-wireless` |
| Mail arrived | `mailbox` | `mdi:mailbox` |
| Parcel delivered | `parcel` | `mdi:package-variant-closed` |
| Water leak | `water-leak` | `mdi:pipe-leak` |
| Fire alert | `fire-alert` | `mdi:fire-alert` |
| Fire extinguisher | `fire-extinguisher` | `mdi:fire-extinguisher` |
| Jingle bell | `jingle-bell` | `mdi:bell-outline` |
| Ghost | `ghost` | `mdi:ghost` |
| Spider | `spider` | `mdi:spider` |
| Bat | `bat` | `mdi:bat` |
| Owl | `owl` | `mdi:owl` |

### Button (`button`)

| Name | Id | Icon |
| --- | --- | --- |
| Doorbell press | `doorbell-press` | `mdi:doorbell` |

### Calendar (`calendar`)

| Name | Id | Icon |
| --- | --- | --- |
| Trash day | `trash` | `mdi:trash-can` |

### Camera (`camera`)

| Name | Id | Icon |
| --- | --- | --- |
| Security camera | `cctv` | `mdi:cctv` |
| Camera snapshot | `camera-snapshot` | `mdi:camera` |

### Climate (`climate`)

| Name | Id | Icon |
| --- | --- | --- |
| Flame | `flame` | `mdi:fire` |
| Fireplace | `fireplace` | `mdi:fireplace` |
| Snowflake | `snowflake` | `mdi:snowflake` |
| Air conditioner | `air-conditioner` | `mdi:air-conditioner` |
| Radiator heat | `radiator` | `mdi:radiator` |
| Stove | `stove` | `mdi:stove` |

### Cover (`cover`)

| Name | Id | Icon |
| --- | --- | --- |
| Garage door | `garage-door` | `mdi:garage-variant` |
| Roller shutter | `roller-shutter` | `mdi:window-shutter` |
| Curtains | `curtains` | `mdi:curtains` |
| Gate | `gate` | `mdi:gate-open` |
| Garage opening | `garage-open` | `mdi:garage-open-variant` |

### Device tracker (`device_tracker`)

| Name | Id | Icon |
| --- | --- | --- |
| Phone signal | `phone-signal` | `mdi:cellphone-wireless` |
| Phone vibrate | `phone-vibrate` | `mdi:cellphone` |
| Car driving | `car` | `mdi:car` |
| Access point | `access-point` | `mdi:access-point` |

### Event (`event`)

| Name | Id | Icon |
| --- | --- | --- |
| Doorbell ring | `doorbell-ring` | `mdi:bell-ring` |
| Notification | `notification` | `mdi:bell-alert` |
| Phone ringing | `phone-ringing` | `mdi:phone-ring` |

### Fan (`fan`)

| Name | Id | Icon |
| --- | --- | --- |
| Fan spin | `fan-spin` | `mdi:fan` |
| Ceiling fan with light | `ceiling-fan` | `mdi:ceiling-fan-light` |
| Air purifier | `air-purifier` | `mdi:air-purifier` |
| Air filter | `air-filter` | `mdi:air-filter` |

### Humidifier (`humidifier`)

| Name | Id | Icon |
| --- | --- | --- |
| Humidifier mist | `humidifier` | `mdi:air-humidifier` |

### Input boolean (`input_boolean`)

| Name | Id | Icon |
| --- | --- | --- |
| Sleeping | `bed-sleep` | `mdi:bed` |

### Lawn mower (`lawn_mower`)

| Name | Id | Icon |
| --- | --- | --- |
| Robot mower | `robot-mower` | `mdi:robot-mower` |

### Light (`light`)

| Name | Id | Icon |
| --- | --- | --- |
| Bulb glow | `bulb-glow` | `mdi:lightbulb-on` |
| Ceiling light | `ceiling-light` | `mdi:ceiling-light` |
| Table lamp switching on | `table-lamp` | `mdi:lamp` |
| LED strip colour chase | `led-strip` | `mdi:led-strip-variant` |
| Light group | `light-group` | `mdi:lightbulb-group` |
| Desk lamp | `desk-lamp` | `mdi:desk-lamp` |
| Floor lamp | `floor-lamp` | `mdi:floor-lamp` |
| Lava lamp | `lava-lamp` | `mdi:lava-lamp` |
| Spotlight | `spotlight` | `mdi:spotlight-beam` |
| Chandelier | `chandelier` | `mdi:chandelier` |
| Night light | `night-light` | `mdi:lightbulb-night` |
| Bulb shining | `bulb-rays` | `mdi:lightbulb-on-outline` |
| Track light | `track-light` | `mdi:track-light` |
| Pendant lights | `pendant-lights` | `mdi:ceiling-light-multiple` |
| Candle | `candle` | `mdi:candle` |
| Torch | `torch` | `mdi:torch` |
| Christmas tree | `christmas-tree` | `mdi:pine-tree` |
| String lights | `string-lights` | `mdi:string-lights` |
| Ornament | `ornament` | `mdi:ornament` |
| Twinkling star | `twinkle-star` | `mdi:star-four-points` |
| Jack-o'-lantern | `jack-o-lantern` | `mdi:halloween` |

### Lock (`lock`)

| Name | Id | Icon |
| --- | --- | --- |
| Lock | `lock` | `mdi:lock` |

### Media player (`media_player`)

| Name | Id | Icon |
| --- | --- | --- |
| Speaker | `speaker` | `mdi:speaker-wireless` |
| Volume | `volume` | `mdi:volume-high` |
| TV on | `tv` | `mdi:television-classic` |
| Music note dance | `music-note` | `mdi:music-note` |
| Play | `play` | `mdi:play-circle` |
| Headphones | `headphones` | `mdi:headphones` |

### Person (`person`)

| Name | Id | Icon |
| --- | --- | --- |
| Walking | `walking` | `mdi:walk` |
| Person home | `person-home` | `mdi:account` |

### Plant (`plant`)

| Name | Id | Icon |
| --- | --- | --- |
| Watering | `watering-can` | `mdi:watering-can` |
| Plant | `plant` | `mdi:sprout` |
| Flower | `flower` | `mdi:flower` |

### Sensor (`sensor`)

| Name | Id | Icon |
| --- | --- | --- |
| Heat haze | `heat-haze` | `mdi:heat-wave` |
| Thermometer | `thermometer` | `mdi:thermometer-lines` |
| Humidity drop | `humidity` | `mdi:water-percent` |
| Outdoor temperature | `outdoor-temperature` | `mdi:sun-thermometer` |
| Washing machine | `washing-machine` | `mdi:washing-machine` |
| Tumble dryer | `dryer` | `mdi:tumble-dryer` |
| Dishwasher | `dishwasher` | `mdi:dishwasher` |
| Cooking pot | `cooking-pot` | `mdi:pot-steam` |
| Printer | `printer` | `mdi:printer` |
| Battery charging | `battery-charging` | `mdi:battery-charging-high` |
| Battery level | `battery-level` | `mdi:battery-high` |
| Energy | `energy-bolt` | `mdi:lightning-bolt` |
| Solar power | `solar-power` | `mdi:solar-power` |
| Electric car charging | `electric-car` | `mdi:car-electric` |
| Energy meter | `energy-meter` | `mdi:meter-electric-outline` |
| Alarm clock | `alarm-clock` | `mdi:alarm` |
| Clock | `clock` | `mdi:clock-outline` |
| Leaf in the wind | `leaf` | `mdi:leaf` |
| Pet | `paw` | `mdi:paw` |
| Dog | `dog` | `mdi:dog` |
| Bee | `bee` | `mdi:bee` |
| Bird | `bird` | `mdi:bird` |
| Fish | `fish` | `mdi:fish` |
| Heartbeat | `heartbeat` | `mdi:heart-pulse` |
| Gauge | `gauge` | `mdi:gauge` |
| Wind turbine | `wind-turbine` | `mdi:wind-turbine` |
| Server | `server` | `mdi:server` |
| Home Assistant | `home-assistant` | `mdi:home-assistant` |
| Campfire | `campfire` | `mdi:campfire` |
| Fire ring | `fire-ring` | `mdi:fire-circle` |
| Washing machine alert | `washing-alert` | `mdi:washing-machine-alert` |
| Beating heart | `heart-beat` | `mdi:heart` |

### Siren (`siren`)

| Name | Id | Icon |
| --- | --- | --- |
| Alarm light | `alarm-light` | `mdi:alarm-light` |

### Sun (`sun`)

| Name | Id | Icon |
| --- | --- | --- |
| Sunset | `sunset` | `mdi:weather-sunset` |

### Switch (`switch`)

| Name | Id | Icon |
| --- | --- | --- |
| Switch toggle | `switch-toggle` | `mdi:toggle-switch-outline` |
| Power button | `power-button` | `mdi:power` |
| Plug in | `plug-in` | `mdi:power-plug` |
| Coffee maker | `coffee-maker` | `mdi:coffee-maker` |
| Kettle boiling | `kettle` | `mdi:kettle-steam` |
| Oven heating | `oven` | `mdi:toaster-oven` |
| Water pump | `water-pump` | `mdi:water-pump` |
| Shower | `shower` | `mdi:shower-head` |
| Pool | `pool` | `mdi:pool` |
| Toaster | `toaster` | `mdi:toaster` |
| Light switch | `light-switch` | `mdi:light-switch` |
| Fire sprinkler | `fire-sprinkler` | `mdi:sprinkler-fire` |

### Timer (`timer`)

| Name | Id | Icon |
| --- | --- | --- |
| Hourglass | `hourglass` | `mdi:timer-sand` |
| Timer | `timer` | `mdi:timer-outline` |

### Vacuum (`vacuum`)

| Name | Id | Icon |
| --- | --- | --- |
| Robot vacuum | `robot-vacuum` | `mdi:robot-vacuum` |
| Vacuum cleaner | `vacuum` | `mdi:vacuum` |
| Robot vacuum side view | `robot-vacuum-side` | `mdi:robot-vacuum-variant` |
| Sparkling clean | `sparkle-clean` | `mdi:shimmer` |

### Valve (`valve`)

| Name | Id | Icon |
| --- | --- | --- |
| Faucet | `faucet` | `mdi:faucet` |
| Sprinkler | `sprinkler` | `mdi:sprinkler-variant` |
| Valve | `valve` | `mdi:valve` |

### Weather (`weather`)

| Name | Id | Icon |
| --- | --- | --- |
| Sunny | `sunny` | `mdi:weather-sunny` |
| Cloudy | `cloudy` | `mdi:weather-cloudy` |
| Pouring rain | `pouring` | `mdi:weather-pouring` |
| Rain | `rainy` | `mdi:weather-rainy` |
| Snow | `snowy` | `mdi:weather-snowy` |
| Heavy snow | `heavy-snow` | `mdi:weather-snowy-heavy` |
| Thunderstorm | `thunderstorm` | `mdi:weather-lightning` |
| Storm with rain | `storm-rain` | `mdi:weather-lightning-rainy` |
| Fog | `fog` | `mdi:weather-fog` |
| Windy | `windy` | `mdi:weather-windy` |
| Clear night | `clear-night` | `mdi:weather-night` |
| Partly cloudy | `partly-cloudy` | `mdi:weather-partly-cloudy` |
| Hail | `hail` | `mdi:weather-hail` |
| Tornado | `tornado` | `mdi:weather-tornado` |
| Hurricane | `hurricane` | `mdi:weather-hurricane` |
| Snowman | `snowman` | `mdi:snowman` |
| Shooting star | `shooting-star` | `mdi:star-shooting` |

### Zone (`zone`)

| Name | Id | Icon |
| --- | --- | --- |
| Home | `home` | `mdi:home` |

### Animal (`animal`)

| Name | Id | Icon |
| --- | --- | --- |
| Cat | `cat` | `mdi:cat` |
| Dog barking | `dog-side` | `mdi:dog-side` |
| Duck | `duck` | `mdi:duck` |
| Turtle | `turtle` | `mdi:turtle` |
| Snail | `snail` | `mdi:snail` |
| Butterfly | `butterfly` | `mdi:butterfly` |
| Ladybug | `ladybug` | `mdi:ladybug` |
| Jellyfish | `jellyfish` | `mdi:jellyfish` |
| Dolphin | `dolphin` | `mdi:dolphin` |
| Penguin | `penguin` | `mdi:penguin` |
| Bee and flower | `bee-flower` | `mdi:bee-flower` |

### Household (`household`)

| Name | Id | Icon |
| --- | --- | --- |
| Grill | `grill` | `mdi:grill` |
| Broom | `broom` | `mdi:broom` |
| Spray bottle | `spray-bottle` | `mdi:spray-bottle` |
| Spray can | `spray-can` | `mdi:spray` |
| Iron | `iron` | `mdi:iron` |
| Hand wash | `hand-wash` | `mdi:hand-wash` |

### Maker (`maker`)

| Name | Id | Icon |
| --- | --- | --- |
| 3D printer | `printer-3d` | `mdi:printer-3d` |
| 3D printer nozzle | `printer-3d-nozzle` | `mdi:printer-3d-nozzle` |
| Laser cutter | `laser-cutter` | `mdi:laser-pointer` |

### Seasonal (`seasonal`)

| Name | Id | Icon |
| --- | --- | --- |
| Gift | `gift` | `mdi:gift` |
| Candy cane | `candy-cane` | `mdi:candycane` |
| Firework | `firework` | `mdi:firework` |
| Party popper | `party-popper` | `mdi:party-popper` |
| Pumpkin | `pumpkin` | `mdi:pumpkin` |
| Skull | `skull` | `mdi:skull` |
| Cauldron | `cauldron` | `mdi:pot-mix` |
| Gravestone | `gravestone` | `mdi:grave-stone` |
| Wizard hat | `wizard-hat` | `mdi:wizard-hat` |
| Magic staff | `magic-staff` | `mdi:magic-staff` |
| Floating hearts | `hearts-floating` | `mdi:heart-multiple` |
| Broken heart | `heart-broken` | `mdi:heart-broken` |
| Ring | `ring` | `mdi:ring` |
| Tulip | `tulip` | `mdi:flower-tulip` |
| Hand with heart | `hand-heart` | `mdi:hand-heart` |
| Cupcake | `cupcake` | `mdi:cupcake` |
| Balloon | `balloon` | `mdi:balloon` |

## Credits

The icon shapes come from [Material Design Icons](https://pictogrammers.com/library/mdi/) by Pictogrammers, licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
