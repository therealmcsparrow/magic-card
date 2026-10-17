# Light, dark and Shared

A theme can set different values for light and dark mode. Home Assistant reads them from a `modes` block with a `light` and a `dark` part. The values outside `modes` are shared: they apply in both modes unless a mode sets its own value.

```yaml
my-theme:
  primary-color: "#0276ab"
  modes:
    light:
      primary-background-color: "#f8fafc"
    dark:
      primary-background-color: "#111827"
```

## Flat and moded themes

A theme without `modes` is flat. It has one set of values that applies in both modes. It stays flat until you add the light and dark blocks. Tick **Light and dark modes** when you create a blank theme, or choose **Add light and dark modes** later. The editor then explains that the values you already set stay shared, and you can override any of them for light or dark.

## The scope switch

The editor has three scopes: **Shared**, **Light** and **Dark**. The scope decides where a value you type is written.

-   **Shared** writes to the top level of the theme. It applies in both modes.
-   **Light** and **Dark** write to that mode's block only.

The header line reads **Editing** and **Previewing**, so you can see both at once. The preview toggle and the scope switch move together. When a theme opens, the scope matches the preview mode, not Shared. This keeps the first edit you make visible in the preview.

## Preview each mode

Use the Light and Dark switch in the preview to see each mode. The preview shows only that mode's values. Dark-only values do not appear in the light preview, and light-only values do not appear in the dark one.

For a flat theme the preview has no switch. It follows Home Assistant's dark mode setting instead.

## Values with no effect

A shared value does nothing when the mode it applies to sets its own value for the same name. The editor warns about this:

> Light and dark both use their own value, so this has no effect.

The warning offers **Set in both**, which writes the value to both modes. Use it when you want the same value for both.

## Values set in one mode only

A non-colour value, such as a size, that is set in one mode only shows a chip that names that mode, for example **Only in Dark**. After you change such a value in this session, the editor also shows a callout:

> Only Dark gets this value. Light keeps the default.

The callout offers **Set in both**, **Move to Shared** and **Keep in Dark only**. Colour values do not get this callout, because a colour usually belongs to one mode only.

The warnings only check what you set. They do not change the file.
