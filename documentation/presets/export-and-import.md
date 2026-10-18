# Export and import

You can save an animation, a theme, a shape or an icon as a file, and open that file on another Home Assistant. The file is plain YAML or JSON. You can read it, edit it and share it.

## Export

Export is available in the library, the animation studio, the theme editor, the shape editor and the SVG editor. Choose YAML or JSON.

Exported files hold your presets and, if you fill it in, the author name you typed. They contain no date, no computer name and no Home Assistant address. Check the author field before you share a file.

## The file format

Each file holds one kind of item, and one or more items of that kind. Every file starts with the format version. A file looks like this:

```yaml
magic_card_export: "1.0"
kind: icon
items:
  - id: fan-2
    name: Fan 2
    author: Ruben
    data:
      svg: '<svg viewBox="0 0 24 24">...</svg>'
```

| Field | Meaning |
| --- | --- |
| `magic_card_export` | The format version, as `major.minor`. |
| `kind` | `animation`, `theme`, `shape` or `icon`. |
| `items` | A list of items. A file with one item also has a list. |
| `id`, `name` | The id and the name. The name is shown in the library. |
| `author`, `description` | Optional. |
| `data` | The item itself. Its contents depend on the kind. |

Built-in animations are not exported, because every Magic Card has them. Animations from the catalogue are exported, like the ones you made yourself. A sequence also exports the animations its steps use.

Files from the animation studio's YAML export, which are a plain list of animations, import too.

## Import

Import is available in the same places as export. Choose a file, or paste the text into the box. You do not need to drag anything.

When you import a file:

-   A file bigger than 1 MB is refused.
-   A file with a newer major format version is refused, and the message says which version it needs. Nothing is saved.
-   A file with a kind that Magic Card does not know is refused, and the message names the kind.
-   Each item is checked on its own. An item that is not valid is left out and listed. The other items import.
-   Unknown keys are dropped and listed.
-   If an item has the same id as one you already have, Magic Card asks you to choose Replace or Keep both. Keep both gives the new item a new id.
-   The summary lists what was dropped and what was changed. It is read out to screen readers.

Icons are cleaned the same way as icons in the SVG editor. Scripts, links to other files and similar parts are removed, and the summary lists them.

Animations and shapes import into a card as copies, when you do not have Magic Card Utils.

## Safe import

Imported files are untrusted. Treat a file from someone you do not know with care.

Imported files are limited to 1 MB, parsed with a safe YAML reader, checked item by item, and cleaned (SVG scripts, links and external references are removed and listed). Theme files are the one exception, as described below, and only after you confirm.

## The outside-host warning for themes

Importing a theme file. Magic Card reads the file on your computer. It does not download anything while you read it, and it sends nothing to us. Some theme files point to a picture or font on another website, or contain card-mod lines. If a file does, Magic Card lists each setting and the website before you confirm. If you choose Import anyway, every browser that shows a dashboard with this theme asks that website for the file, and the website can see the visitor's IP address. Lines that start with card-mod- only work when card-mod is installed, and they can restyle any card. Only import files from people you trust. To avoid this, choose Cancel, or delete those lines from the file and import it again.

The import summary shows the warning before you confirm. The confirm button reads Import anyway while the warning is shown. Choose Cancel to stop the import.

## Privacy

Magic Card and Magic Card Utils have no telemetry and make no network calls of their own. Your icons, shapes and presets are stored in your own Home Assistant (Magic Card Utils) or in the card configuration. Nothing is sent to the author. The only outside requests are the ones your own configuration asks for, for example an image address you typed or a theme file that points to another website.
