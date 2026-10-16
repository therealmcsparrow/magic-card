# Image

Shows an image: a static URL, a file from Home Assistant's media browser, an entity's picture, or an image URL held in an entity attribute.

| | |
| --- | --- |
| `type` | `image` |
| Category | Content |
| Editor tabs | General, Actions, Conditions, Design |
| Suits | Static images. `person`, `image`, `camera` and `media_player` entities (entity picture). Any entity with an attribute that holds an image URL, such as `entity_picture_local`. |
| New module | `image: ""`, `entity_picture: false`, `aspect_ratio: "16:9"`, `fit: cover` |

## Options

| Label | Key | Type / values | Default | Effect |
| --- | --- | --- | --- | --- |
| Entity | `entity` | entity id | none | The entity for the picture or attribute. |
| Use entity picture | `entity_picture` | boolean | `false` | Shows the entity's `entity_picture`. Hidden in the editor while an attribute is set. |
| Image from attribute | `attribute` | attribute name | none | An attribute whose value is the image URL. It replaces the entity picture and the image URL. |
| Image URL | `image` | URL, path or media | none | The static image. A path such as `/local/room.jpg`, a full URL, or a media browser item. Hidden while Use entity picture is on or an attribute is set. |
| Aspect ratio | `aspect_ratio` | `16:9`, `16/9`, a number such as `1.5`, or a percentage of the width such as `56.25%` | `16:9` | Height of the module relative to its width. An invalid value uses 16:9. |
| Fit | `fit` | `cover`, `contain`, `fill`, `none` | `cover` | How the image fills the area (CSS `object-fit`). |

## Which image is shown

1.  With an entity and an attribute: the attribute value, when it is a URL (it starts with `/`, `http://`, `https://` or `data:image/`).
2.  Otherwise, with Use entity picture on: the entity's `entity_picture`. Nothing falls back to Image URL in this case.
3.  Otherwise: Image URL.

Relative Home Assistant paths are resolved against your Home Assistant address. A media browser item is stored as a `media-source://` id and resolved when the card loads. A signed URL that has expired is resolved again.

A missing or broken image shows an image-off placeholder. The image comes back as soon as it loads.

While editing, Use entity picture without an entity shows the hint "Entity is required when using entity picture".

## Examples

```yaml
- type: image
  image: /local/floorplan.png
  aspect_ratio: "4:3"
  fit: contain
```

```yaml
- type: image
  entity: person.anna
  entity_picture: true
  aspect_ratio: 1
  design:
    border_radius: 50%
```
