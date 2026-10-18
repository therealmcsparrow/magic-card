# Getting started with themes

This page takes you from the include lines to a saved theme that you can select.

## Add the include lines

Home Assistant loads themes from `/config/themes` only when `configuration.yaml` has these lines:

```yaml
frontend:
  themes: !include_dir_merge_named themes
```

If you already have a `frontend:` section, add only the `themes:` line under it. Then check the configuration and restart Home Assistant.

The Themes tab checks for these lines. When they are missing, it shows them with a Copy lines button and a Check again button, and saving stays off until the check passes. The check also passes when Home Assistant already loads a theme from `/config/themes`, for example one from a package.

If `configuration.yaml` lists themes inline, or loads them another way, the Themes tab says so and shows the lines the editor needs. Try on dashboard works before the include lines are in place. Saving does not.

## Open the Themes tab

1.  Open **Magic Card Templates** in the sidebar. (The panel name is from the Magic Card Utils integration.)
2.  Click the **Themes** tab. The list shows the theme files in `/config/themes`.

Each row shows the theme name and whether the file is editable. Read-only files are covered in [Files and limits](files.md#read-only-themes).

## Create a theme

1.  Click **New theme** in the list.
2.  Under **Start from**, choose one of three starting points:
    -   **Blank**: an empty theme. Tick **Light and dark modes** if you want separate `light` and `dark` blocks from the start.
    -   **A preset**: one of 57 starting points in three groups: Original, Inspired by, and Sci-fi & fantasy. Search by name, palette or style, or use Show to filter by group. The [theme examples](examples/README.md) page has a screenshot of each one. The preset's name fills the name field. Change it if you like.
    -   **An installed theme**: copies the variables of a theme Home Assistant has loaded, or of a file in `/config/themes`. The original is not changed. Built-in Home Assistant themes expose only some of their variables.
3.  Type a name. Names use lowercase letters, digits, hyphens and underscores. They start with a letter or a digit and are at most 64 characters long. The names `default` and `backend-selected` are reserved.
4.  Click **Create theme**, or **Create from** and the preset name.

The editor opens with the fields filled in and the preview showing the theme.

## Presets

The create dialog offers 57 presets in three groups. Original has 25 themes, including the five starters from earlier releases: Paper, Midnight OLED, Ember, Contrast and Frost. Inspired by has 20 themes that draw on well-known editor and web palettes, such as Nord, Dracula, Solarized and Tokyo Night. Their colour values are our own, not the official palettes, and each one credits the palette it draws on. Sci-fi & fantasy has 12 themes that take a mood from science-fiction and fantasy worlds. The [theme examples](examples/README.md#sci-fi--fantasy) page has the notice for that group.

The [theme examples](examples/README.md) page shows every preset with a screenshot of its light and dark modes.

Each preset sets a light and a dark mode, including the text on primary colours and the state colours. In every mode, the text, the secondary text, the text on the primary colour and the state colours reach a contrast of at least 4.5 to 1. Presets are starting points you can change.

A theme that loads a file from another website is marked **Contacts another host**, with an info icon, on its card. A theme you open that does this shows a note above the variables. The preview and Try on dashboard ask that website for the file, so it sees your address. See [Export and import](../presets/export-and-import.md#safe-import) for the warning on theme files.

### Loading and failure

The presets load the first time you open the create dialog. The Themes tab opens without them.

While they load, the dialog shows Loading presets, and Create stays off until a preset is picked. Blank and An installed theme work during loading.

If the presets cannot load, the dialog shows "Presets could not load" with a Try again button. Click Try again to request the presets again. If it keeps failing, reload the page. Blank and An installed theme still work.

## Edit and save

1.  Change a value. The preview updates while you type. Colour values that are not valid yet show an inline error, and the preview keeps the last valid value.
2.  Click **Save** when every value is valid.
3.  The editor writes `/config/themes/<name>.yaml` and asks Home Assistant to reload its themes. The theme then appears in Home Assistant's theme list without a restart.
4.  The header shows **Saved** with the time, and **Use this theme**.

The first time you save an existing file, the editor asks you to confirm the rewrite. Comments in the file are removed. Variables the editor does not know are kept, and so is the order of the variables. The question appears once per session.

Save stays off while a value is invalid, while the include lines are missing, or while the file is read only. The line next to Save says which one applies.

To use the saved theme, see [Use this theme](trying-and-using.md#use-this-theme).
