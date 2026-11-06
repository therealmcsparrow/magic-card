# Languages

Magic Card has three languages:

-   **English (UK)**, `en-GB`. This is the source text. The other languages are written from it.
-   **English (US)**, `en-US`. The text is made from the English (UK) text with a word list, so it reads the same with American spelling.
-   **Dutch**, `nl`. The Dutch text was drafted with machine help. It has not been checked by a professional translator. If a word reads badly, tell us on [GitHub](https://github.com/therealmcsparrow/magic-card/issues).

In all languages, the English (UK) text is the authoritative version of any legal text, such as the privacy warnings. The English text prevails over a translation, and a translation of legal text is published only after a qualified lawyer has checked it. Legal text is never machine-translated for release. Where a legal text is shown in another language, an "English prevails" label and a Show English button give you the English text.

Magic Card follows the language in your Home Assistant profile. To change the language, change it in your profile.

## What is not translated

Some text stays in English on purpose:

-   The default text of a new card, such as "Welcome to Magic Card" and "Hello World".
-   Google font family names, such as "Roboto".
-   Some technical words, such as the names of CSS properties and YAML keys.

## Words in the editors

The editors use the same language setting as the rest of Magic Card. The dialogs, labels, menus and warnings of the [SVG editor](../svg-editor/README.md), the [shape editor](../shape-editor/README.md), the [animation studio](../animation-studio/README.md) and the [theme editor](../themes/README.md) follow it.

## Right to left

Magic Card ships no right-to-left language yet. The animation studio has a Pseudo RTL switch for testing. It shows the editors and the card's sliders and rings mirrored, with made-up text and Arabic-Indic digits, so that a layout problem shows up before a real language arrives. It is not a translation and it is not a language you can pick in Home Assistant. The mirrored layout has been checked in a browser only, not with a screen reader and not on real right-to-left devices. Icons mirror only where an icon is marked to mirror. The layout of your own cards is never mirrored.

## Translations

Translations are welcome. Contributed translations come under the project's MIT Licence. Open an issue on [GitHub](https://github.com/therealmcsparrow/magic-card/issues) if you want to help with a language. How the text files work is in [Translating](../translating/README.md).
