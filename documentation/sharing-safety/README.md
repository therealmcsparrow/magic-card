# Sharing safety

Magic Card can export presets, themes, icons, animations, shapes, images and whole cards as plain JSON or YAML files, and import them again. This page says what an import checks, what it leaves as written, and what is still up to you.

Nobody reviews shared files. Magic Card does not send them anywhere, and no person at Magic Card or anywhere else looks at them. The checks below are the only ones. Only import files from people you trust.

## Before you confirm

Every import shows this line above the preview:

> Only import files from people you trust. Magic Card checks the file and shows a preview, and nothing is saved until you confirm. Look at the preview, the actions and the templates before you confirm.

The panel loads the checking code before it reads a file. If that code cannot load, import and export are not offered and the panel shows the load failure.

## What an import checks

-   **Size first.** The size of a file, or the length of pasted text, is checked before anything is read. A compressed file (gzip, zip, brotli or zstd) is refused with "This file is compressed. Magic Card reads only plain JSON or YAML; unpack it first." Magic Card never unpacks files.
-   **Every value must fit its key.** Theme and design values are checked against the kind of value the key takes: a colour, a length, a time, a shadow, a gradient, a number, a font or a keyword. A value that fits none of the allowed kinds for its key, such as `url(https://...)`, is left out and listed. The rest of the file is kept. The list names the check (for example `strict.colour`) and where the value was. It never repeats the value.
-   **Break-out characters refuse the whole file.** A value that holds `{`, `}`, `<`, `@`, a backslash, `/*`, a `;` outside quotes and brackets, `expression(`, `javascript:` or a control character is not left out. The whole file is refused and nothing is saved.
-   **Unknown keys are left out and listed.** So are unknown module types in a shared card.
-   **SVG is cleaned.** Icons, shapes and images pass the same [SVG allowlist](svg-allowlist.md) as the ones you draw or add yourself. What was removed is listed.
-   **Nothing is fetched from another website.** A picture, background or font that points to another website is left out and listed with the host name. Pictures that are part of the file (`data:` images) and files in your own `/local/` folder are kept; a `/local/` file may not exist on your system, and the import says so.
-   **The preview makes no requests.** A preview shows a neutral pattern in place of any picture that is not part of the file, a placeholder box for an image module, and the fallback font instead of loading a font.
-   **Animated previews respect reduced motion.** With reduced motion turned on in your system, an animated preview starts still. A Play button, reachable with Tab, starts and pauses it.
-   **Nothing runs at import.** The preview never calls Home Assistant.

## Shared cards

A card file holds actions and Home Assistant templates. Before Confirm, the import lists:

-   **Actions.** Every tap, hold, double-tap and module action is listed with its type. For a service call it shows the service and the targets. For a link it shows the host. A link action that is not a web link or a path on your dashboard (`javascript:`, `data:` and other schemes) is left out and listed. Actions run only when someone uses the card.
-   **Templates.** Jinja templates are shown as text and are not run. They run on your Home Assistant once the card is saved, and they can read the state of your entities.

The card type must be `custom:magic-card`; anything else is refused. Free-form `css` is split into single declarations, and each one is checked on its own. A declaration with a rejected name is left out and the others stay.

In the card editor, **Share this card** exports the open card and **Import a shared card** replaces the open card after you confirm.

## Entity IDs on export

Every export replaces entity IDs with placeholders such as `light.mc_placeholder_1`. The domain stays, so the importer's preview and the mapping step can offer matching entities. The same file always gives the same placeholders. The pass finds IDs in the entity fields of images and cards, and in any text that looks like `domain.name`, including templates.

After an import, the **Map entities** step lets the importer type their own entity for each placeholder, or skip it. A field left empty stays a placeholder. The step can be reached again later from the image library and from Card settings.

### What stays as written

The export pass does not change:

-   names and titles that hold no entity ID, for example "Anna's bedroom lamp";
-   `device_id` and `area_id` targets in actions.

Read an export before you hand it out, and remove anything private.

## Fonts are limited

A font value in a theme or card is accepted when it is a family from the Magic Card font picker, a generic family such as `sans-serif`, or a plain device font name of letters, numbers, spaces, underscores and hyphens. Anything else is left out and listed. An imported file never loads a font from another website, and the preview shows the fallback family.

## Theme contrast

When a theme is imported, Magic Card checks that the main text on the card background and on the page background, the secondary text on the card background, the text on the primary colour and, when the theme sets them, Magic Card's text on its card background reach a contrast of at least 4.5:1, in light and in dark mode. A pair that falls short is listed as a warning before you confirm. The import is not blocked.

## Wall tablet

The Wall tablet preview draws a 1280 by 800 pixel tablet with one sample card at the width of a dashboard column. It is drawn at one fifth size, which shows how the text looks from 3 metres away. It is reached with Tab and has a name for screen readers. The [Wall tablet card](../gallery/flows-sliders.md#wall-tablet) in the gallery is a card for such a screen.

## CC0 and the author name

When you share a file, you release it under CC0 1.0:

> By sharing this file you release it under CC0 1.0, which means anyone may copy, change and reuse it for any purpose, without asking you and without crediting you. Only share work that is yours to give away. Do not include images, fonts, icons or text that belong to someone else.

Magic Card cannot check who owns what is in a file. That stays your responsibility.

The author name is optional and empty by default. Nothing is filled in from Home Assistant or your browser. The export panel says:

> Author name is optional. A name is personal data. If you fill it in, it is written into the file and everyone who gets the file can read it. Use a nickname if you prefer, and do not add an email address or contact details. Leave it empty to share without a name.

On import, an author name is shown as plain text only.

## What this page does not promise

The checks reduce what a file can do. They do not make an untrusted file safe. A card you import can still hold actions and templates that you approve at Confirm, so read them.

## Related

-   [SVG allowlist](svg-allowlist.md)
-   [Presets and the library](../presets/README.md) and [Export and import](../presets/export-and-import.md)
-   [Themes](../themes/README.md)
-   [Card gallery](../gallery/README.md)
