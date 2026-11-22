# Files and limits

## Where themes are kept

The editor always saves a theme in Magic Card Utils, in Home Assistant's own storage. A saved theme is safe there, but Home Assistant does not load it as a theme yet.

To use a theme in Home Assistant, choose **Save to themes folder**. The editor then also writes it to `/config/themes`, named after the theme: `my-theme` becomes `/config/themes/my-theme.yaml`. The file holds one top-level key, the theme's name, and the theme's variables under it:

```yaml
my-theme:
  primary-color: "#0276ab"
  modes:
    dark:
      primary-background-color: "#111827"
```

The editor writes the file with the variables in the order they had, and keeps variables it does not know. It starts the file with a comment line that says the editor wrote it.

The theme list and the open theme show where each theme stands:

-   **Not in the themes folder**: saved in Magic Card Utils only.
-   **Also in the themes folder**: the folder has the same copy.
-   **Themes folder copy is older**: you saved changes after the last **Save to themes folder**. Save to the folder again to update it.
-   **Another file in the themes folder uses this name**: a file the editor did not write has this name, so this theme cannot go to the folder under it.
-   **Only in the themes folder**: a file the editor wrote earlier that is not saved in Magic Card Utils yet. Your next save keeps it under the same name, and it stays linked to the file.

The editor only writes inside `/config/themes`. It never edits `configuration.yaml`. The [include lines](getting-started.md#add-the-include-lines) are yours to add, and **Save to themes folder** needs them.

## Names

A theme name is 1 to 64 characters: lowercase letters, digits, hyphens and underscores, starting with a letter or a digit. The file name is the name followed by `.yaml`, so the name and the top-level key must match.

The names `default` and `backend-selected` are reserved, because Home Assistant uses them itself.

If a name is already taken, Save refuses to overwrite it and offers to choose another name. If someone saved the theme after you opened it, the editor refuses the save so you do not overwrite a change you have not seen.

## Allow themes to be saved in the themes folder

Saving to `/config/themes` is off until an administrator turns on **Allow themes to be saved in the themes folder** in Settings > Devices & services > Magic Card Utils > Configure. Turning it on shows a disclaimer first. While it is off, you can still create, edit and delete themes in Magic Card Utils, but **Save to themes folder** is not offered and the editor does not touch any file.

## Themes from the themes folder

The theme list also shows the themes in `/config/themes`. The editor never changes, replaces or deletes a file it did not write. Every file it writes starts with `# Written by the Magic Card theme editor.`. A file without that first line, such as one you wrote by hand or got from another tool, is read only. To change it, use **Copy to edit**: the editor opens the create dialog with that theme's variables copied under a new name, and saves the copy in Magic Card Utils. The original file is not changed.

A file is read only when it:

-   was not written by the theme editor,
-   sits in a subfolder of `/config/themes`,
-   holds more than one theme,
-   has a top-level key that does not match the file name,
-   has a name that the editor does not allow,
-   uses Home Assistant tags such as `!secret`,
-   uses YAML aliases (`&anchor` and `*alias`) or merge keys (`<<:`),
-   cannot be read as YAML,
-   is larger than 256 KB, or
-   is a symbolic link.

A read-only theme that the editor can read still opens, so you can look at it. Its fields are read only and Save stays off.

## Deleting a theme

**Delete** asks first. For a theme saved in Magic Card Utils, it removes the theme from there. When the editor also wrote the theme to `/config/themes` and the folder option is on, the confirmation has a box to also remove the file from the themes folder. The box is clear each time, so the file stays unless you tick it. Screens that use the theme, such as a wall tablet, switch to the default theme when the file is gone, and Home Assistant reloads its themes.

A theme that is only in the themes folder can be deleted only when the editor wrote it and the folder option is on. That removes the file. Files the editor did not write cannot be deleted from the editor.

## Limits

-   **Comments are removed on save.** The first time you save to an existing file in the themes folder, the editor asks you to confirm the rewrite. Comments in the file are not kept. Variables are kept.
-   **YAML aliases make a file read only.** A file with `&anchor` and `*alias` is listed read only, because the editor cannot write it back safely. If you want the editor to manage the file, replace the aliases with the values they stand for in a text editor.
-   **Magic Card's own `--mc-*` variables cannot be themed yet.** The card sets them on its own element, and a theme value for them is ignored. The Magic Card group lists only the variables a theme can reach. A themeable subset is on the list for a later release.
-   **Size limits.** A file is at most 256 KB. A theme has at most 2000 variables across the shared base and both modes. A value is at most 4000 characters, and it cannot contain control characters, except line breaks and tabs.
-   **Only admins can save or delete.** Other users can select a theme, but the Themes tab and its commands are for admin users.
-   **Preview is not the dashboard.** The preview shows the fields against sample elements. Real cards can draw some parts differently. Use **Try on dashboard** to check the real look.
-   **Views and cards with their own `theme:`** keep it, and a trial does not change them.
-   **Ultra Card has no preview sample.** Its fields edit and save as usual.

## When saving fails

The editor refuses a save it cannot complete, and then writes nothing. The usual reasons:

-   The name is used by another theme. Choose another name.
-   **Allow themes to be saved in the themes folder** is off in Magic Card Utils, for **Save to themes folder**. The theme is still saved in Magic Card Utils. An administrator can turn the option on under Configure.
-   A file in the themes folder that the editor did not write uses the name. Save the theme under another name.
-   The include lines are missing from `configuration.yaml`, for **Save to themes folder**. Add them, then check again.
-   Someone saved the theme after you opened it. Reload it and make your change once more.
-   Home Assistant could not write or read the file. The message does not show the file path. The details are in Home Assistant's log.
