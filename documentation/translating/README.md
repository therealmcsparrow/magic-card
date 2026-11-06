# Translating

This page is for people who translate Magic Card, and for contributors who change its text. It describes the files and the commands as they work today. If you only want to know which languages exist, see [Languages](../languages/README.md).

## How the text is stored

Every message has a key that names its place in the interface, for example `card-editor.design.background.label`. Each part of Magic Card keeps its text in a folder `i18n/` with three files:

| File | What it holds |
| --- | --- |
| `en-GB.json` | The source. English (UK) is written here and nowhere else. Each key has `text`, `note`, `max` and, when the text has arguments, `vars`. |
| `en-US.json` | English (US), made from the English (UK) text with a word list and a short list of exceptions. Nobody edits it by hand. |
| `nl.json` | Dutch. Each entry stores the text and a hash of the English it was written from. |

The Magic Card Utils panel keeps its own text in its own repository, under the namespace `mcu-panel`.

## The note on each key

Each key in `en-GB.json` carries a note that tells you where the text shows and what it does. The note, the descriptions of the arguments and the length limit are all you get as context, so read them before you translate.

-   **note** says where the text appears. It has at least 12 characters.
-   **max** is the longest text the place can hold, counted in characters. English, American and Dutch texts must all fit. For a message with a plural or a choice, the longest branch counts.
-   **vars** has one line per argument, such as `{count}`. The names match the arguments in the message.

In the exchange files described below, these three become one `description`, for example "Shown on the Save button. {count}: How many items. Max 40 characters."

A text longer than its `max` is refused when you import it and fails the check, in every language. Size `max` for the longest language that will use the place, and leave room: Dutch runs longer than English, and an Arabic or Hebrew text can differ again.

## Legal text

A key can carry `"legal": true` in `en-GB.json`. Legal text is English only in force: the English prevails, and a translation is published only after a qualified lawyer has checked it. Magic Card gives no legal advice.

-   Next to a translated legal text, Magic Card shows a line that the English prevails and a Show English action. They are generated for every language that is not English, as `<namespace>.legal.english-prevails` and `<namespace>.legal.show-english`. Their English comes from `tools/i18n/legal-labels.json`. You translate them like any other key.
-   When the English of a legal key changes, its translations are stale and the check fails with rule D10, with no way round it. A waiver does not clear a legal key, and adding one for it is itself an error. Only a translation whose hash matches the new English does, which means the text was checked again and imported.
-   Keys in that file that have no `legal` flag in the source also fail D10.

## Plurals and arguments

A message may use arguments in braces, such as `{name}`, and plural forms in ICU style:

```
{count, plural, one {# shape} other {# shapes}}
```

-   Every plural has an `other` branch.
-   A plural branch is `=N` (an exact number) or one of the plural categories of the language. Dutch has `one` and `other`.
-   Keep the argument names exactly as they are in the English. A translation with different arguments is refused.
-   Do not put an apostrophe before `{`, `}` or `#`.
-   Nest at most three levels of braces.

## Working with Weblate or Crowdin

The exchange files are in `i18n/flat/`: `en-GB.arb`, `en-US.arb` and `nl.arb`. They are ARB files, which both Weblate and Crowdin can read. One file holds one language, for the card and for Magic Card Utils together.

In a file, each key has its text and an `@key` entry with the details:

| Field | Meaning |
| --- | --- |
| `description` | The note, the argument descriptions and the maximum length. |
| `source_text` | The English (UK) text. In the translation files only. |
| `x-max-length` | The maximum length in characters. |
| `x-source-hash` | The hash of the current English text. |
| `x-stale` | `true` when the Dutch text was written for older English. Dutch file only. |
| `x-plural` | The plural categories the message uses. |
| `x-aliases` | Earlier keys of the same message, from keys that were renamed. |

To translate:

1.  Upload or sync `i18n/flat/nl.arb` in your service.
2.  Translate the empty units and check the units marked `x-stale`. An empty unit means the message has no Dutch text yet.
3.  Download the returned file and save it as `i18n/flat/nl.arb`.
4.  Run `node tools/i18n-flat.mjs import --mcu <path to magic-card-utils>`.

A Dutch text that you leave empty keeps the text the repository already has.

## The commands

All commands run from the root of the Magic Card repository.

| Command | What it does |
| --- | --- |
| `node tools/i18n-flat.mjs export --mcu <path to magic-card-utils>` | Writes the three `.arb` files from the source catalogues, including the Magic Card Utils panel. |
| `node tools/i18n-flat.mjs import --mcu <path to magic-card-utils>` | Reads `nl.arb` and `en-US.arb` from `i18n/flat/` and writes the Dutch texts to the `nl.json` files and the American exceptions to `tools/i18n/en-US-exceptions.json`. |
| `node tools/i18n-flat.mjs --check --mcu <path to magic-card-utils>` | Exits with 1 when a committed `.arb` file differs from a fresh export. Run `export` to fix it. |

`<path to magic-card-utils>` is the folder where you cloned the Magic Card Utils repository. The committed `.arb` files hold the `mcu-panel` keys, so pass `--mcu` every time. `export` refuses to run without it, so a card-only export cannot drop those keys. `import` needs it to find the keys of the panel. `--check` leaves the `mcu-panel` entries out of the comparison when you omit it.

`import` also takes file names, and `--locale nl` or `--locale en-US` when the file name does not say which language it is. The file for English (UK) is never read back, because `en-GB.json` is the source.

### What import checks

A returned file is not trusted. Before anything is written, `import` checks every text, and it writes nothing at all if one check fails:

-   The file is no larger than 4 MiB, is valid JSON and is an object.
-   Each key exists in `en-GB.json`. Unknown keys are listed by name so you can delete them in the service.
-   The text is a valid message, has the same arguments as the English and fits the maximum length.
-   A text has no control characters and is at most 2,000 characters long.
-   `@@locale` in the file matches the language of the file.

The `@key` entries and every `x-` value in a returned file are ignored. Export rebuilds them from `en-GB.json`.

A changed Dutch text gets the hash of the current English. An unchanged text keeps its old hash, so a stale text stays stale until someone changes or confirms it. For American English, a returned text that differs from what the word list makes is saved as an exception. If it equals the generated text, the exception is removed.

## Stale translations

The hash of the English source is stored with every Dutch text. When the English changes, the hashes no longer match and the Dutch text is stale. Users keep seeing the old Dutch text until a new one is confirmed. The release check fails while a stale text remains.

Two ways to clear it:

-   Translate again, or confirm the existing text, and import it. The hash is updated.
-   For a typo or punctuation fix that does not change the meaning, add a waiver to `i18n/waivers.json` with the key, the hash of the new English and a reason. Waivers are not for changes of meaning. Once the Dutch text is confirmed, the waiver can go.

The `x-stale` mark in the Dutch exchange file ignores waivers, so you still see every text that was not confirmed.

Legal-tagged keys follow a stricter drift rule: no waiver, only a re-checked translation. See [Legal text](#legal-text).

## Checking a layout without a right-to-left language

No right-to-left language ships. To see how a screen behaves in one, open the animation studio and turn on Pseudo RTL. It mirrors the studio and its preview, swaps in Arabic-Indic digits and wraps each message in direction marks. It is for testing only, and no profile language can select it. Real right-to-left translations, a screen reader run and a device run are still to do. See [Animation studio](../animation-studio/README.md#right-to-left).

When a message has an argument that may hold a name or other text, Magic Card isolates the value with direction marks under a right-to-left or pseudo setting, or when the value itself has right-to-left letters. Numbers are never isolated.

## Renamed keys

A renamed message moves its English, American and Dutch texts, their hashes and waivers with it. The old key appears in `x-aliases` of the new one, so a service can match the unit to its history. Old keys are never entries in the exchange files.

## Every change ships its Dutch text

A change that adds or edits text in the interface carries its keys and the English (UK), English (US) and Dutch texts in the same change. Do not leave Dutch for later. `npm run i18n` builds the American text and the tables, and the checks fail on a missing note, a missing maximum, a text over its maximum or a stale Dutch text at release. Run `node tools/i18n-flat.mjs export --mcu <path to magic-card-utils>` last, so the exchange files match.

## What is not in the files

Magic Card does not run its own translation service. You use your own Weblate or Crowdin project, and the exchange files are the only link. Nothing from `dist/` is read or written by these commands.
