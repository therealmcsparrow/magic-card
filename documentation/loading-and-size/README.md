# Loading and updates

Magic Card loads its files from one folder. `magic-card.js` is the only file a dashboard loads at once. The other files load from the same folder when a card, or the editor, needs them. A plain card, with no animation, icon effect, flow, pop-up, pause button, `quiet_time`, template, ring or moving backdrop, loads only the card file. A card also asks for `magic-card-status.js` when its connection to Home Assistant drops, see [Connection and quiet sensors](#connection-and-quiet-sensors).

The table under [Loading the other files](../../README.md#loading-the-other-files) in the main README lists which file each feature needs.

## Files that features share

Two small files hold code that several features read, so the card file does not need it and no feature carries its own copy. A plain card loads neither.

-   `magic-card-history.js` holds the cache of recorded entity history. A card fetches it together with the file of a feature that reads history: a value background with a sparkline (in `magic-card-decor.js`) or a graphs module (in `magic-card-modules-extra.js`). Both use the same copy, so history that one has read is not requested again by the other.
-   `magic-card-shape-path.js` holds the maths for outline shapes. A card fetches it together with a feature that draws along an outline: a ring, an outline shape or a value background (`magic-card-decor.js`), flow lines, seasonal scenes, a slider look, a custom shape, or the card editor.

Keep both files in the folder next to `magic-card.js`, with their `.br` and `.gz` copies, like every other file of the release.

## The Google Fonts list

Magic Card knows 20 Google Fonts by name: Roboto, Open Sans, Lato, Montserrat, Oswald, Source Sans Pro, Raleway, PT Sans, Merriweather, Playfair Display, Lora, PT Serif, Noto Sans, Ubuntu, Poppins, Nunito, Inconsolata, Fira Code, Source Code Pro and Dancing Script. The list lives in the card file, `magic-card.js`, so it is not a part of its own.

The card reads it each time it draws. When a font family in the card's settings names one of these fonts, the card adds one stylesheet link for it to the page, once per font per page visit. The font comes from `fonts.googleapis.com`, with the weights 300, 400, 500 and 700, or fewer for a font that does not have all four. A card that names none of them, or only Roboto or a system font, loads nothing from Google. Roboto is Home Assistant's own font and is never fetched. The card editor's font picker uses the same loader. See the privacy note in the main README.

## When a part cannot load

A part is a file that a feature needs, such as the slider, a background, an animation or the editor. When one cannot be fetched, the card does not break. It shows one of these messages in place of the part, and the rest of the card keeps working.

| Message | When it appears | Button |
| --- | --- | --- |
| "{part} did not load. The rest of this card works." | The part failed to load after one more try. `{part}` names the feature, for example "The slider" or "The background". | **Try again** |
| "Still not loading. Try again in a moment, or reload the page." | The part still has not loaded after a retry. | **Try again** |
| "Magic Card updated. Tap to reload." | The card file and its parts come from different releases, usually after an update. The whole tile is one button, and the version of the loaded card file shows in its corner. | Tap the tile |
| "Still the old version. Clear the browser cache, then reload." | You tapped the tile and the page came back with the same old card file. A link, **How to clear the cache**, opens [Clear the browser cache](#clear-the-browser-cache). | None |
| "Template "name" couldn't be loaded. Showing this card's own settings." | The template cannot be shown, for example because Magic Card Utils is missing or still starting. See [Templates](../editor/templates.md#when-a-template-cannot-be-shown). | None |
| "Magic Card: the visual editor could not be loaded." | The editor file cannot load. Home Assistant shows its YAML editor instead. | None |

The "Magic Card updated" tile uses the key `card.chunk-notice.magic-card-updated-tap-to-reload`, and its text is "Magic Card updated. Tap to reload."

A tap on the tile asks the server for a fresh copy of the card file, waiting at most three seconds for it, and then reloads the page. The card remembers only the version it was running, in the browser's session storage under `mc-reload`, so it can tell whether the reload helped. If the browser does not allow storage, you see the first wording again instead of the second.

The card tries a failed part once more after two seconds. If that fails too, it keeps trying in the background, after 30 seconds, 90 seconds and 5 minutes. **Try again** asks for the file at once.

Parts that depend on a file behave in a fixed way while they wait:

-   An animated card is drawn still first and starts moving when its animation code arrives. If the code cannot load, the card stays still.
-   An icon shows Home Assistant's default icon until its code arrives.
-   A slider, spinbox, dropdown, light, gauge or tabs module keeps an empty box of its usual height, so the cards below do not move.
-   A card with an outline shape waits for its decoration file before it shows.
-   A pop-up card stays out of the layout until its file arrives.

## Offline and failed connections

The files come from the same Home Assistant server as `magic-card.js`, through `/hacsfiles/magic-card/` or `/local/`. A part can load only while the browser can reach Home Assistant. If the connection drops, the notice appears, and **Try again** asks for the file once the connection is back.

When a card needs a part, it asks for the file once and reuses that one request. Cards on the same page that need the same part share it, and a part that has loaded is not requested again. Nothing in the card unloads a part. A reload of the page starts again from the card file.

If a file is missing from the folder, the feature it belongs to shows its notice and the rest of the card still works. Check that every file of the release is in the folder next to `magic-card.js`, including the `.br` and `.gz` copies. See [Manual](../../README.md#manual).

## Connection and quiet sensors

A card can tell you when what it shows may be out of date. It does this with three faces, each one shown as a small icon in the top-left corner of the card. Tap the icon, or press Enter or Space while it has keyboard focus, to read the full sentence. Press Escape or tap the icon again to close it. The icon floats over the card without moving anything, and the values underneath keep their normal colour. When the card has a pause button in the top-left corner, the icon moves to the right of it while the card plays. While the card is paused, it moves to the top-right corner instead, so it never covers the "Paused" label. A screen reader announces the text politely.

| Face | Text | When it shows |
| --- | --- | --- |
| Connection | "Connection lost at {time}" | The card's connection to Home Assistant has been down for 15 seconds. The time is the moment of the drop. A shorter gap, such as Wi-Fi roaming, shows nothing. |
| Reconnected | "Reconnected" | The connection is back. It stays for 3 seconds, then goes. |
| Not updated | "Not updated since {time}" | The `entity` of the card has not changed for longer than its `quiet_time`. The time is the entity's last change. |

When more than one applies, the card shows the connection face first, then Reconnected, then Not updated. With several quiet entities it names the one that has been quiet longest. The time follows your Home Assistant language and time format: the time alone on the same day, the short date and the time on another day. The editor preview shows the Not updated face so you can see `quiet_time` work, but never the connection faces, because Home Assistant shows its own connection message in the editor.

### Set quiet_time

Add `quiet_time` next to the `entity` it applies to, on the card or on any module. It takes seconds, as a number (`900`) or a quoted whole number (`"900"`), or `H:MM:SS` (`0:15:00`). See [Card](../yaml/schema.md#card).

```yaml
type: custom:magic-card
entity: sensor.hall_temperature
quiet_time: "0:30:00"   # the entity above is quiet after 30 minutes
rows:
  # your rows as usual
```

-   A value that cannot be read, such as `soon`, makes the card show a configuration error. This holds wherever the value is written: on the card, in rows, columns, flows or modules, or in `value_bg`.
-   A sensor that sends the same value again does not count as a change. Home Assistant does not pass the time of that report on to cards, so such a sensor looks quiet from its last real change. Use `quiet_time` on entities whose value changes, not on one that mostly repeats itself.
-   `quiet_time` that exists only after a template is merged into the card does not start the faces. Write it in the card itself.

### What the first outage shows

A card asks for `magic-card-status.js` at the moment the connection first drops, or at once when `quiet_time` is set. When Home Assistant is unreachable at that moment, the file cannot arrive. So on a card without `quiet_time`, the first outage after a page load shows no "Connection lost" unless the browser already has the file cached. The card asks again when the connection is back, so "Reconnected" and every later outage on that page show as described. Set `quiet_time` on the card if you want the file loaded up front. If the file never loads, the card looks and works as it does without the faces, and shows no notice for it.

## Remembered pause

A card you paused stays paused, also after a reload. The pause is remembered in the browser for each card on each dashboard page. If the Pause button's code cannot load, the card stays paused and shows its notice.

To play a card again:

1.  Open the browser's developer tools and find the storage for the Home Assistant address (Local storage in Chrome and Edge, Storage in Firefox).
2.  Delete the entry whose key starts with `mc-paused:`. Each key stands for one card on one page, so delete only the entries for the cards you want to play.
3.  Reload the page.

If the browser does not allow the card to use storage, a pause lasts only for the page visit. More about the button is in [Pause motion button](../design/layers.md#pause-motion-button) and [Remembered pause](../design/layers.md#remembered-pause).

## After an update

Update through HACS, then hard refresh the browser. HACS does not delete the files of an earlier release. Once the update is done, you can delete the older files that the new release no longer uses. Keep every file of the new release.

For a manual install, copy the whole new release, including the `.br` and `.gz` copies. When you replace a file, replace or delete its three copies together, because an old `.br` file is sent in place of a new `.js` file.

## Clear the browser cache

Do this when the tile says "Still the old version. Clear the browser cache, then reload." The browser is still running an old copy of `magic-card.js`.

In a browser:

1.  Open the browser's settings and find the option to clear browsing data. Choose cached images and files, limited to the last day or to this site.
2.  Clear the data. Do not tick cookies or site data, because clearing those signs you out of Home Assistant.
3.  Reload the dashboard. The tile is gone and the console shows `MAGIC-CARD v<version>` with the version you installed.

On a wall tablet or in the Home Assistant app:

1.  Open the app settings and go to Debugging.
2.  Choose Reset frontend cache.
3.  Reopen the dashboard. The tile is gone.

If the tile stays after this, check that every file of the release is in the folder next to `magic-card.js`, as under [Offline and failed connections](#offline-and-failed-connections).

### Wall tablets

The tile and its reload have not yet been checked on a real wall tablet. The steps above are the ones to follow, but nobody has confirmed on a tablet that a tap on the tile gets the new version. If your tablet still shows the tile after you tap it and reset the frontend cache, report which tablet and which app or browser you use at https://github.com/therealmcsparrow/magic-card/issues. This section will say what we found once a tablet has been tried.

## How we word size and speed claims

A claim about size names the release it compares, and gives the gzip and the Brotli bytes. A claim about speed links to a measured run on a named device. Until a timed run exists, Magic Card makes no speed claim. A script, `npm run claims`, reads the README, the changelog and these pages on every push and before every release, and it fails when a claim lacks one of these.

## How we measured

The box has one column for the size check and one for the tablet timing, so a figure from one never sits under the other.

| Field | Size of `magic-card.js` | Tablet timing |
| --- | --- | --- |
| Release compared | `v2026.10.12-beta.12` against `v2026.10.12-beta.11` | `v2026.10.12-beta.12` against `v2026.10.12-beta.11` |
| Device | Not used. The bytes do not depend on a device. | No timed run yet |
| Browser | Not used. | No timed run yet |
| Network | Not used. | No timed run yet |
| Cache state | Not used. | No timed run yet. Cold and warm runs are kept apart, and a warm figure is never set against a cold one. |
| Date | 31 October 2026 | No timed run yet |
| Gzip bytes | Listed under the box | Not used |
| Brotli bytes | Listed under the box | Not used |

The bytes of `magic-card.js`, as measured on 31 October 2026:

-   Release 2026.10.12-beta.12: 73,017 B with gzip and 62,433 B with Brotli (225,204 B raw).
-   Release 2026.10.12-beta.11: 84,683 B with gzip and 72,222 B with Brotli (264,566 B raw).

How the bytes are taken: the committed `dist/magic-card.js` at each named release tag, compressed with gzip at level 9 and with Brotli at quality 11, on the Node version the size gate pins (24.22.0). A figure from any other Node version is not quoted, because another version can give other bytes for the same file.

The tablet row stays on "No timed run yet" until a timed run on a real wall tablet is written up.

## Bad cases we test

These are the situations where a part cannot load or a stored value is wrong. The check is a script in `tests/kernel/browser/`, run against a copy of the released files. Every case passes today. A case that fails is a gap, and it is listed as one here.

| Case | What you see | Result | Check |
| --- | --- | --- | --- |
| The connection drops while parts load | A notice per part, "did not load. The rest of this card works.", with **Try again**. Once the connection is back, **Try again** loads the parts and the notices go. | Pass | `bad-cases.mjs`, case `drop` |
| Old card file with newer parts on the server | The tile "Magic Card updated. Tap to reload." The rest of the card is drawn. | Pass | `bad-cases.mjs`, case `stale`; `skew-retry.mjs`, case `skew` |
| A part from another build | The same "Magic Card updated" tile. The part is asked for once and not retried. | Pass | `bad-cases.mjs`, case `other-build` |
| A stored pause value that is not valid | Only the stored value `1` pauses the card. Anything else plays, and the Pause button still works afterwards. | Pass | `bad-cases.mjs`, case `junk-pause` |
