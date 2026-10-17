# Files and limits

## Where the files go

Each saved theme is one file in `/config/themes`, named after the theme: `my-theme` is saved as `/config/themes/my-theme.yaml`. The file holds one top-level key, the theme's name, and the theme's variables under it:

```yaml
my-theme:
  primary-color: "#0276ab"
  modes:
    dark:
      primary-background-color: "#111827"
```

The editor writes the file with the variables in the order they had, and keeps variables it does not know. It starts the file with a comment line that says the editor wrote it.

The editor only writes inside `/config/themes`. It never edits `configuration.yaml`. The [include lines](getting-started.md#add-the-include-lines) are yours to add.

## Names

A theme name is 1 to 64 characters: lowercase letters, digits, hyphens and underscores, starting with a letter or a digit. The file name is the name followed by `.yaml`, so the name and the top-level key must match.

The names `default` and `backend-selected` are reserved, because Home Assistant uses them itself.

If a name is already taken by another file, Save refuses to overwrite it and offers to choose another name. If the file changed on disk after you opened it, the editor refuses the save so you do not overwrite a change you have not seen.

## Read-only themes

Some files in `/config/themes` are listed but cannot be edited. The list marks them **Read only**, and the editor shows the reason when it knows it. A file is read only when it:

-   sits in a subfolder of `/config/themes`,
-   holds more than one theme,
-   has a top-level key that does not match the file name,
-   has a name that the editor does not allow,
-   uses Home Assistant tags such as `!secret`,
-   uses YAML aliases (`&anchor` and `*alias`) or merge keys (`<<:`),
-   cannot be read as YAML,
-   is larger than 256 KB, or
-   is a symbolic link.

A read-only theme that the editor can read still opens, so you can look at it. Its fields are read only and Save stays off. To change it, click **Copy to edit**. The editor opens the create dialog with that theme's variables copied under a new name. The original file is not changed.

## Deleting a theme

**Delete** removes the file after you confirm. Only editable files can be deleted. Screens that use the theme, such as a wall tablet, switch to the default theme when it is gone. The confirmation says so. Home Assistant reloads its themes after the file is removed.

## Limits

-   **Comments are removed on save.** The first save of an existing file asks you to confirm the rewrite. Comments in the file are not kept. Variables are kept.
-   **YAML aliases make a file read only.** A file with `&anchor` and `*alias` is listed read only, because the editor cannot write it back safely. If you want the editor to manage the file, replace the aliases with the values they stand for in a text editor.
-   **Magic Card's own `--mc-*` variables cannot be themed yet.** The card sets them on its own element, and a theme value for them is ignored. The Magic Card group lists only the variables a theme can reach. A themeable subset is on the list for a later release.
-   **Size limits.** A file is at most 256 KB. A theme has at most 2000 variables across the shared base and both modes. A value is at most 4000 characters, and it cannot contain control characters, except line breaks and tabs.
-   **Only admins can save or delete.** Other users can select a theme, but the Themes tab and its commands are for admin users.
-   **Preview is not the dashboard.** The preview shows the fields against sample elements. Real cards can draw some parts differently. Use **Try on dashboard** to check the real look.
-   **Views and cards with their own `theme:`** keep it, and a trial does not change them.
-   **Ultra Card has no preview sample.** Its fields edit and save as usual.

## When saving fails

The editor refuses a save it cannot complete, and then writes nothing. The usual reasons:

-   The name is used by another file. Choose another name.
-   The include lines are missing from `configuration.yaml`. Add them, then check again.
-   The file changed on disk after you opened it. Open the theme again and make your change once more.
-   Home Assistant could not write or read the file. The message does not show the file path. The details are in Home Assistant's log.
