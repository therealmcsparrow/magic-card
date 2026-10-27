# The image editor

Open the editor from the Images tab of the Magic Card Utils panel, or from an image field in the card editor. This page describes what the editor does.

Only administrators can create or change images. Everyone else sees the same editor in view-only mode. See [View only](#view-only).

## Start a new image

1. Open the Magic Card Utils panel and go to the Images tab.
2. Choose New image.
3. Pick a canvas size:
   - 1:1, 4:3, 16:9 or 9:16.
   - Custom, with a width and height from 16 to 4096 pixels. Keep ratio keeps the proportions when you change one side.
4. Choose Create.

The canvas shape sets the shape of the picture on a card. Pixel numbers only set the drawing grid. The image scales to any card.

## Draw

The editor has the same tools as the icon editor: shapes, the pen, path booleans, alignment, layers and groups. The Layers list shows every layer in stacking order. Select a layer to see its details in the Inspector.

- Undo and Redo work on every change.
- Zoom in and Zoom out change the view. Fit to view shows the whole canvas.
- The Layers list can be used with the keyboard: arrow keys move between layers and Enter selects one.
- The Rectangle options panel floats over the canvas. Opening it does not move the drawing.

## Colours and paints

Each fill and outline can use:

- **Main** or **Accent**, the two colours of the image. A card sets them from its theme.
- **Theme colour**, a colour from the theme variables.
- **Custom colour**, a hex colour such as `#3f6fb5`.
- **Linear gradient** or **Radial gradient**, with 2 to 8 stops. Each stop has its own colour and position. A radial gradient also has a centre and a radius.
- **None**.

Opacity fades the whole layer. A dashed outline takes up to 8 numbers separated by spaces, such as `8 4`.

New closed shapes (rectangles, ellipses, polygons, stars, freehand shapes and closed pen paths) start with a thin outline in Accent. Lines and text do not.

**As on a card** is a toggle in the canvas toolbar. It shows Main and Accent the way a card shows them when its entity is off. It changes only what you see on the canvas. The saved colours stay the same.

The drawing looks the same in the editor and on the card.

## Text

Choose Add text, then click or tap where the text goes. Press Enter to start in the middle of the canvas. Type, then press Enter or Done.

- Enter adds the text. Shift+Enter starts a new line. Esc cancels.
- A text layer has a font, size, weight, italic, alignment and letter spacing.
- New text is white with a thin dark outline.
- Text uses fonts that are already on the device. Nothing is downloaded, so it can look a little different on another device.
- A text layer can hold up to 2048 characters.

## Reference picture

A reference picture is a photo or drawing you trace over. It appears behind the canvas, and you can move, scale, rotate and fade it.

- The picture stays in your browser while you edit. It is never saved with the image, never sent to Home Assistant, and never put in an exported file.
- Alignment is remembered on this device for this image. The picture is not.
- If you reopen the image, pick the picture again.
- A shape you draw while the picture shows starts at 60 % opacity, so the picture shows through. The status line says so. Change it in Opacity. The 60 % is saved with the image unless you change it.
- The Reference picture panel floats over the canvas, so the drawing does not move when it opens. At high zoom the panel scrolls inside the editor.

## Start from an SVG file

When you draw a new image, the first window asks for a canvas size. It also has an **Open file** button. Choose an .svg file and the editor opens it as your drawing, with no blank canvas first. The file is cleaned and read in the same way as Import an SVG file, below, and the same summary says what was removed.

If a file cannot be opened, the window stays open and says why, for example "That file is too big to open (over 8 MB). Try a smaller copy." or "That drawing is over 256 KiB." You can then choose another file or pick a canvas size. A file can be up to 8 MB to be opened, but the cleaned drawing must still fit in 256 KiB, like every image.

## Import an SVG file

Choose Import an SVG file. If the canvas already has content, the editor asks **Replace your drawing?** with two choices: Keep my drawing, which is the default, and Replace. Escape keeps your drawing too. A replaced drawing can be brought back with Undo. A file the editor refuses is not imported, so the question is not asked. The window then has the heading "Could not import the file" and says why, for example "Choose an SVG file." or "The file could not be read."

The editor keeps what it can use and removes what it cannot. After the import, a summary says what was removed, for example "Removed scripts, event handlers." If nothing was removed, it says so.

Things the editor always removes:

- Scripts.
- Event handlers, such as `onclick`.
- Embedded pictures.
- Links to another site.
- Other parts an image cannot use.

Some parts cannot be edited, such as clipped parts, parts with masks, and parts with group opacity. The editor keeps them as **Imported part** layers in the same place in the stack. An imported part:

- keeps its own colours,
- can be renamed, reordered, hidden and deleted,
- cannot be moved, resized, rotated or repainted,
- stays locked. Its lock button and the Locked switch in the Inspector say why.

Trying to unlock an imported part changes nothing and adds no undo step. The editor says that the part stays locked, for example "Imported part 1 stays locked: imported parts cannot be edited."

If a summary says some parts were kept as locked layers, those layers still draw the same as in the original file.

A file that is only a script is refused with "That file has no shapes an image can use."

## The size meter

The meter shows how big the drawing is, out of the 256 KiB limit:

| Size | Message |
|---|---|
| Under 96 KiB | Fine |
| 96 to 224 KiB | Getting big. Large images can be slow on wall tablets. |
| 224 to 256 KiB | Nearly full. You can add a little more. |
| Over 256 KiB | Too big to save. |

The meter is written out in words, so you do not need to read a bar. "What is KiB?" explains the unit: a kibibyte is a little over a thousand characters.

If a drawing is too big to save, the Too big window opens. It can select the biggest layer, or delete the hidden layers, so you can simplify the drawing. Delete hidden layers can be undone.

## Save

1. Choose Save, or press Ctrl+S (Command+S on a Mac).
2. The first time you save, fill in the Details: a name is required. Keywords, author and description are optional.
3. The editor shows the image's address, for example `mcu-image:my-floor-plan`. The address is fixed after the first save. Renaming the image does not change it.

The editor stays open after a save. The address is what you put in YAML. See [Use images in a card](using-images.md#yaml).

Other save options:

- **Duplicate** and **Save as a copy** save the drawing under a new name. The editor then works on the copy, and the original stays as it was. A toast confirms: "Saved as '{name}'. The original is unchanged."
- **Export file** saves the drawing to a file on your device. Check the file before you share it. See [Privacy and your images](privacy.md#export-files).

If a save fails, the Save window shows the reason in words and stays open, so your drawing is not lost. The reason is one of these:

- **Too big to save: 270 KiB of 256 KiB.** The drawing is over the limit. Simplify it, then save again.
- **The library is full (200 images). Delete one to add another.** The library holds at most 200 images.
- **The library does not accept the text "javascript:", in the layer "Title". Change it, then save again.** The library refuses some words in text layers. The Save window names the word and, where it can find it, the layer.
- **This image was changed somewhere else.** Choose Save as a copy to keep your work, or Reload to see the other version.
- **You can look at this image but not change it. Ask an administrator.** Your account is view-only.
- **The library refused this image: {reason}.** The library gave a reason. If it gave none, the editor says "The library refused this image. Use Export file to keep a copy."
- **Magic Card Utils reported an error and did not finish. Your work is safe. Use Export file to keep a copy.** The library reported an error the editor does not know.
- **Could not reach Magic Card Utils. Your work is safe.** The editor could not reach the library at all.
- **Images need Magic Card Utils. It is installed through HACS, like Magic Card.** Install Magic Card Utils first.

## View only

If you cannot change an image, the editor opens in view-only mode. It shows the banner "You can look at this image but not change it. Ask an administrator." You can look at the layers, select them, and use Export file. Save, Rename, Delete, Canvas size, Import and the reference picture are not available.

An image with parts that are too large or too complex to open opens view-only as well.

## Keyboard and screen readers

The size meter announces a change of level once, and it announces when a drawing goes over the limit. Keyboard and screen reader behaviour for the rest of the editor is still being tested in this release.

## Known limits in this release

- Making a layer follow an entity (for example, a colour that follows a light) is not available yet. Bindings that are already in an image are kept.
- Overlays on an image module are not available yet.
