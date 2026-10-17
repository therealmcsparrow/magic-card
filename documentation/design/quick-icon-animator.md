# Icon animations in cards

An icon animation makes a module's icon move in parts: the blades of a fan turn, a bell swings while its waves draw on, rain falls from a cloud. You give a module one in two ways:

-   The icon picker's Animated icons tab, in the card editor. Pick a ready-made animation from the icon library or one of your own from My animations. See [Animated icons in the icon picker](../animation-studio/using-in-cards.md#animated-icons-in-the-icon-picker).
-   The animation studio in Magic Card Utils. There you split an icon into parts, give each part a preset or your own keyframes, and export the result as an animated SVG. See [Icon animations](../animation-studio/icon-mode.md) and [Animated SVG export](../animation-studio/animated-svg-export.md). Save it, and it shows in the Animated icons tab under My animations.

Earlier releases had an Animate icon button in the Design tab, under the Animations list. The card editor and the card studio no longer have it. Cards that use an animation made with it keep playing it unchanged.

-   [Which modules](#which-modules)
-   [Animations already on a card](#animations-already-on-a-card)
-   [Styles: Quiet, Living and Glow](#styles-quiet-living-and-glow)
-   [When the module's icon changes](#when-the-modules-icon-changes)
-   [What the card stores](#what-the-card-stores)
-   [Template-linked cards](#template-linked-cards)
-   [The editor file](#the-editor-file)

## Which modules

Icon animations play on the main icon of these modules, at any depth inside layout modules:

-   Icon
-   Button
-   Info
-   Light

The Icon, Button, Info and Light modules have the Animated icons tab in their icon picker. The Light module's Icon field is optional. While it is empty the module shows the light's own icon, and an animation you add by hand in the Animations list still plays on it with Target set to Icon.

A Weather module also plays icon animations, but it has no Animated icons tab. Add one by hand in its Animations list with Target set to Icon. Tabs modules cannot play icon animations.

## Animations already on a card

An animation the picker or the former Animate icon stored in the card is an entry in the module's Animations list with a `custom:quick-icon-…` preset. The list shows "An animated icon stored in this card." under it. You can change its play condition, colour and timing there, or delete it. The card plays its own copy, also on a Home Assistant without the integration.

To pick another one, open the icon picker's Animated icons tab and click a tile. The new pick replaces the old one, so a module never holds two. To change the parts or the motion of an animation stored in the card, import the card's YAML in the animation studio. See [Import YAML](../animation-studio/library.md#import-yaml).

## Styles: Quiet, Living and Glow

Every animation in the Icon library plays in three Styles. The Style switch sits next to the Icon library heading in the Animated icons tab. The tiles play in the Style you choose, and the tile you click is stored in that Style.

-   Quiet moves one part of the icon a little, and more slowly. The rest of the icon stays still and colour changes are left out. A turning part, such as fan blades, keeps turning at half speed. Use it on dashboards where a lot of moving icons would distract.
-   Living is the full animation as it was drawn. It is the default.
-   Glow is the full animation with a soft outline around the lit part of the icon (the flame, the bulb, the rays) that slowly brightens and fades. The lit parts take the glow colour. Glow uses no blur or filter, so a wall tablet does no extra work beyond one more outline per icon.

The glow colour is set when you pick the icon or its Style. It is the animation entry's Color field, if that holds a plain colour such as `#ffa000` or `rgb(255, 160, 0)`. Otherwise it is the icon's theme colour: amber for fire, pale yellow for lights, light blue for cleaning, and so on. Icons without a theme glow amber. If you change Color later, click the tile again to use the new colour.

The card checks how light its background is. On a dark card (Home Assistant's dark mode) the icon glows in that colour with the outline. On a light card the colour is darker and there is no outline, so the icon stays readable on white. This follows a theme change without picking again. The check reads the theme's card background (`--ha-card-background`, else `--card-background-color`). It runs in CSS, so browsers without CSS relative colours (Chrome and Android WebView before 119, Safari before 16.4) show Glow like Living.

When the module already plays an animation from the Icon library, switching the Style in the tab changes that animation at once and the picker stays open. Animations from My animations have no Style: the switch only affects the Icon library tiles. Animations picked before this release play as Living. To give one of them another Style, open the tab and choose it.

An animation you changed by hand, for example in the card's YAML or in the animation studio, is your own from then on. The tab marks no tile for it, and switching the Style leaves it alone. When the module's icon changes, it follows the new icon like an animation of the module's own icon instead of being removed. At that point the editor also removes its `library_icon` and `icon_style`. Renaming the animation does not count as a change.

The Jack-o'-lantern lights up behind its face in Glow only.

## When the module's icon changes

An animation of the module's own icon (split into parts, as the studio does) follows the module's icon. When you give the module another icon in the card editor (the icon picker in the General tab, the studio, or YAML), the editor splits the new icon and moves the animation onto it. It waits until the icon has stayed the same for about a second, so typing `mdi:bell-ring` in YAML moves the animation once, onto `mdi:bell-ring`, and never onto `mdi:bell` on the way:

-   The parts keep their place: Part 1 of the old icon becomes Part 1 of the new one, and its motion stays with it. A pivot (Swing hangs from the top) moves to the same spot on the new part.
-   Parts the new icon does not have are removed, with their motion and any group left empty. When the new icon has more parts, the extra ones are added without motion.
-   The new icon's shapes are stored in the animation (`rig.svg`). A name the editor gave ("Animated bell") is renamed after the new icon.
-   The change is part of the last icon edit's undo step, so one undo takes back that edit and the move together. When you made other changes in the meantime, the move is an undo step of its own.

Home Assistant shows a short note, for example "The icon animation now uses the new icon (mdi:bell). 2 part animations were removed because the new icon has fewer parts."

Some changes leave the animation as it is:

-   Clearing the icon, so the module shows its entity's icon again, or switching to an own SVG. The editor does not look up the entity's icon here.
-   An icon whose shape cannot be loaded, such as a misspelled id. The animation follows once the icon is one Home Assistant knows.
-   Going back to the icon the module had before, within that second.
-   A change that does not come from the editor, such as editing the dashboard's raw YAML.

When the animation is shared with another module that keeps the old icon, the changed module gets its own copy under a new id, and the other module keeps the original. The new id is one the card, its template and the animation library do not use yet. On a template-linked card the module's animation list is then marked not_synced. The copy goes into the card's own `custom_animations`, which stay synced with the template.

On a template-linked card, an animation of the module's own icon that comes from the template follows too. The result is stored as the card's own version under the same id, so this card plays it in place of the template's (Changed on this card in the Template animations section), and the template is not changed. An animation hidden on this card is left alone.

The animation follows only while the card editor is open. If the editor closes within that second, for example because you press Save, the card is saved with the animation as it was and no note is shown. Change the icon again to update the animation. Switching to the Visibility or Layout tab of the card dialog and back lets the animation follow once you are back.

### Library animations

A library animation (from the Icon library or My animations) draws its own icon, so it would keep drawing the old icon over the new one. The editor removes it instead. When you give the module another icon in the card editor (the icon picker, Clear, or the card editor's YAML mode), the animation goes once the icon has stayed the same for about a second and the new icon resolves. Turning on the entity's icon or switching to an own SVG counts as an icon change too and removes the animation. An icon id that cannot be loaded, such as `mdi:fa` on the way to `mdi:fan`, removes nothing: the editor waits for the next change, and going back to the icon the module had keeps the animation. Home Assistant shows "The animated icon was removed because the module's icon changed." One undo brings it back.

-   An animation of the module's own icon is not affected. It follows the icon as described above.
-   Changes that do not come from the editor, such as raw dashboard YAML or template sync, leave the animation as it is.
-   A changed copy of a My animations animation (`quick-mine-…`, made with the former Animate icon) is removed the same way, with its stored document.
-   When the removed animation was a My animations reference, an embedded copy of it in `custom_animations` stays.
-   Entries you added by hand in the Animations list are never removed.

## What the card stores

A pick from the Icon library adds one entry to the module's `design.animations` and stores the animation document in the card's `custom_animations`:

```yaml
type: custom:magic-card
custom_animations:
  - id: quick-icon-k3x9pa
    name: Fan spin
    kind: keyframes
    duration: 1.2
    iterations: infinite
    target: icon
    keyframes:
      - at: 0
        opacity: 1
    rig:
      # the icon's shapes, shortened here
      svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,11A1,1 0 0,0 ..."/></svg>
      parts:
        - id: blades
          name: Blades
          from: [0]
    tracks:
      - target: part:blades
        keyframes:
          - at: 0
            transform: { rotate: 0 }
            easing: linear
          - at: 100
            transform: { rotate: 360 }
rows:
  - columns:
      - modules:
          - type: icon
            entity: fan.bedroom
            icon: mdi:fan
            design:
              animations:
                - id: anim-icon-1
                  preset: custom:quick-icon-k3x9pa
                  target: icon
                  trigger: always
                  library_icon: fan-spin
                  icon_style: quiet # left out for Living
```

-   The document id starts with `quick-icon-` followed by six random letters and digits, unique on the card. The entry id is `anim-icon-1` (or the next free number).
-   `library_icon` names the Icon library animation the document was made from, and `icon_style` its Style (`quiet` or `glow`; Living writes nothing). Only the editor reads them. The card plays the stored document, which is already in the chosen Style. Switching the Style rewrites that document under the same id. Once the document is edited by hand, the editor no longer treats it as a library pick.
-   A pick from My animations writes the same entry with `preset: custom:<id>` and stores nothing in the card.
-   `custom_animations` keeps the form it already has, a list or a map.
-   The card editor never writes to the Magic Card Utils library. The card plays the stored copy, also on a Home Assistant without the integration. See [Using animations in cards](../animation-studio/using-in-cards.md#what-happens-without-the-integration).
-   A stored icon animation that no entry uses any more is removed when you pick another one. Other documents in `custom_animations` are never touched.

## Template-linked cards

On a card linked to a template, a pick overrides the module's `design.animations`. For a module inside a layout module, the layout's child list is overridden instead of the module's design.

The animation document goes into the card's own `custom_animations`, which merge with the template's by id. The template's other animations keep coming from the template. See [Template animations](../editor/templates.md#template-animations).

## The editor file

The Animated icons tab and the icon follow described above live in their own file, `magic-card-icon-animator.js`, next to `magic-card.js`. The editor loads it the first time you open the tab or change an animated module's icon. Dashboards never load it. HACS installs it with the card; with a manual install, copy it next to `magic-card.js` as well. Without the file, the tab shows "The animated icons could not be loaded. Try again." and everything else works.
