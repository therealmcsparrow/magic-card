# Library images

A library image is a drawing you make in the Magic Card image editor and save to the Magic Card Utils library. Any dashboard can then show it: as an image module in a card, or as a background layer behind the content.

Library images need two parts:

- **Magic Card** (this card), which draws the image and holds the editor.
- **Magic Card Utils**, installed through HACS like Magic Card, which keeps the saved images in Home Assistant.

## What you can do

- Draw a picture with shapes, paths, text, gradients and opacity, on a canvas of any size. See [The image editor](editor.md).
- Trace over a photo or a floor plan with a reference picture. The picture is never saved. See [The image editor](editor.md#reference-picture).
- Open an SVG file, or paste SVG markup, as a new image from the first window of the image editor, or import one into the open drawing, and keep what the editor can use. See [The image editor](editor.md#start-from-an-svg-file).
- Add an SVG file straight to the library from the Images tab of the Magic Card Utils panel. See [Export and import](../presets/export-and-import.md#add-an-svg-file-as-an-image).
- Show a library image in an image module, or as a background behind the content. See [Use images in a card](using-images.md).
- Refer to a library image in YAML with `mcu-image:<id>`. See [Use images in a card](using-images.md#yaml).

## Limits

- An image can be up to 256 KiB.
- The library holds up to 200 images.

The editor shows a size meter while you draw. See [The size meter](editor.md#the-size-meter).

## Who can do what

Everyone who can log in to Home Assistant can see the library images on a dashboard. Only administrators can create, change, rename, delete or import them. Non-administrators can open an image, look at it and export a copy, but they cannot save changes. The Magic Card Utils documentation describes the Images tab in its panel section.

## Privacy

Library images stay on your Home Assistant server. Read [Privacy and your images](privacy.md) before you draw a floor plan or other picture of your home.

## Pages in this folder

- [The image editor](editor.md): canvas, tools, colours, text, reference picture, import, save, and the size meter.
- [Use images in a card](using-images.md): image modules, background layers, descriptions and missing pictures, and the YAML reference.
- [Privacy and your images](privacy.md): what is stored, who can see it, and what is never sent.
