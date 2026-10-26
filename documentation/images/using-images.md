# Use images in a card

You can use a library image in two places: in an image module, and as a background layer behind the content. Both show the same drawing.

## Image module

1. Add an image module, or open an existing one.
2. In the image field, choose one of:
   - **Choose an image** to pick a library image.
   - **Draw a new image** to open the image editor with a blank canvas.
   - **Edit image** to change the image that is already set.
3. Optional: fill in **Description for screen readers**. Describe what the picture shows.

A card that sets its own shape keeps it when the drawing's shape changes. To follow the drawing's shape again, choose "Use the drawing's shape" in the image field.

### Description for screen readers

- With a description, screen readers read it.
- Without one, the field says "Not set (screen readers skip this picture)". Screen readers skip the picture.

Write a description that tells the user what the picture means. For a floor plan, name the rooms that matter.

### Missing picture

If the image is deleted, or the address does not match a library image, the module shows the placeholder with the text "Picture not available". The card keeps its layout, so the rest of the card still works.

If the image editor cannot load, the module shows a notice. The rest of the card still works.

## Background layer

A background layer is a picture behind the card's content. Use the background field and choose a library image.

- **Live.** The drawing is drawn by the card, so it stays sharp at any size.
- **Per state.** The layer can show a different library image for each state of an entity, such as on and off. The change uses the same fade as an image URL.
- **Decorative.** A background is hidden from screen readers, and it cannot hold buttons. The description field does not apply to backgrounds. If the picture carries information, add an image module behind the content instead.

Background layers do not yet change colour or visibility with an entity. That comes in a later release.

## YAML

An image module that uses a library image holds a short reference, not the drawing. The `image` key of the module reads:

```yaml
image: mcu-image:floor-plan
description: Ground floor plan
```

- `mcu-image:` is the prefix for library images.
- `floor-plan` is the image id. The editor shows it after the first save, and it does not change when you rename the image.
- The drawing itself stays in Home Assistant. The YAML never holds the SVG.

A background layer uses the same reference as its image value, and the same reference can be used in its states.

## Check that it works

1. Save the image in the editor.
2. Add the reference to the module or layer.
3. Open the dashboard. The drawing should show.
4. Delete the image in the Images tab. The card should show "Picture not available", not a blank space.
