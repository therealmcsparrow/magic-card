# Import and export

This page covers bringing an SVG into the [SVG editor](README.md), getting one out, and using a saved icon in a card.

## Import an SVG

Choose **Paste SVG** in the start window, paste the SVG markup into the box and choose **Use this SVG**, or choose **Open file** and pick an SVG file. **Start from…** in the top bar opens the same window while you draw; the new drawing replaces the old one as one step that Undo brings back. The editor reads the file on your computer. It does not download anything.

The editor checks the file type first, then the size. A file that is not an .svg file is refused with "This is not valid SVG. Check that it starts with <svg and is closed.", and an .svg file over 32 KB with "The SVG is larger than 32 KB." A file the browser cannot read gives "Could not read that file." A refused file or text changes nothing: the start window stays open, the reason shows in one line under the tiles, pasted text stays in the box, and your drawing is as it was.

The editor removes the parts it does not support, and it shows a warning that lists what it removed:

-   Scripts and event handlers.
-   `<use>` and `<image>` elements, and references to other files.
-   Parts the editor does not draw, such as text, filters, `<style>` blocks and animation.

Files from icon sets import too. The editor has been tested with Lucide, Tabler, Feather and Heroicons. Those sets have their own licences (Lucide is ISC; Tabler, Feather and Heroicons are MIT). Check the licence of an icon set before you publish an icon that you made from it.

The markup can be up to 32 KB. A larger file is refused with a message that shows the size.

## Export

-   Download .svg saves the icon as a file.
-   Copy SVG puts the markup on the clipboard.
-   Copy as HA path puts one `d` string and a `viewBox` on the clipboard, in the form Home Assistant accepts as `{path, viewBox}`. Use it where Home Assistant takes an icon as a path and a viewBox.

## Save to the library

Choose Save to put the icon in the Magic Card Utils library. The name is required.

Keep a copy in this card is a switch on the save screen. When it is on, the card also keeps the icon's markup, so the card still shows the icon if Magic Card Utils is removed. The switch is on by default for a small icon. The size of the copy is shown next to the switch.

Choose Cancel to leave the editor without saving. If you have unsaved changes, the editor asks before it closes.

## Use the icon in a card

After you save, a card refers to the icon as `icon: mcu:<id>`. Effects from [icon effects](../icon-effects/README.md) work on it, such as colours, fill and draw-on.

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: icon
            icon: mcu:fan-2
            size: 48px
            icon_fx:
              colors:
                style: duotone
```

A saved icon also appears in Home Assistant's own icon picker, after you reload the page. Home Assistant's cards show the icon as a one-colour silhouette. See [Magic Card Utils](../magic-card-utils/README.md#saved-icons-in-home-assistant-cards).
