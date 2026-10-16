# Content modules

Content modules show something: text, an icon, an entity's value, an image, a graph or a camera. They have no controls of their own. Give them actions to make them tappable.

| Module | `type` | Suits |
| --- | --- | --- |
| [Text](text.md) | `text` | Static labels, templates, any entity's state or name |
| [Icon](icon.md) | `icon` | Any entity, or none |
| [Info](info.md) | `info` | Any entity |
| [Image](image.md) | `image` | Static images; `person`, `image`, `camera` and `media_player` entities |
| [Markdown](markdown.md) | `markdown` | Formatted text with templates |
| [Bar](bar.md) | `bar` | Numeric states or attributes: `sensor`, `input_number`, `number`, battery levels |
| [Graph](graphs.md) | `graphs` | Numeric history from the recorder |
| [Camera](camera.md) | `camera` | `camera` entities |

The shared keys (`type`, `id`, `entity`, `design`, `actions`, `display`) are described in [Modules](../README.md#shared-keys).
