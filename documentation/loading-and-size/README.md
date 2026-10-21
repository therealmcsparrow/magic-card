# Loading and size

Magic Card splits its code into files. `magic-card.js` is the only file a dashboard loads at once. The other files load from the same folder when a card, or the editor, needs them. A plain card, with no animation, icon effect, flow, pop-up, pause button, template, ring or moving backdrop, downloads only the card file.

The table under [Loading the other files](../../README.md#loading-the-other-files) in the main README lists which file each feature needs.

## Sizes

These are the sizes of `magic-card.js`, the card file, in the current release, measured on a clean build. Gzip uses level 9 and Brotli uses quality 11.

| Copy of `magic-card.js` | Before the size work | Now |
| --- | ---: | ---: |
| Brotli (`.br`) | 129,897 B | 69,894 B |
| gzip (`.gz`) | 156,490 B | 81,825 B |
| Uncompressed | 503,361 B | 256,616 B |

A browser downloads the Brotli or gzip copy it accepts, so a viewer receives the first two rows, not the uncompressed file.

## When a part cannot load

A part is a file that a feature needs, such as the slider, a background, an animation or the editor. When one cannot be fetched, the card does not break. It shows one of these messages in place of the part, and the rest of the card keeps working.

| Message | When it appears | Button |
| --- | --- | --- |
| "{part} did not load. The rest of this card works." | The part failed to load after one more try. `{part}` names the feature, for example "The slider" or "The background". | **Try again** |
| "Still not loading. Try again in a moment, or reload the page." | The part still has not loaded after a retry. | **Try again** |
| "Magic Card was updated. Reload the page to see this part. The rest of this card works." | The card file and its parts come from different releases, usually after an update. | **Reload page** |
| "Template "name" couldn't be loaded. Showing this card's own settings." | The template cannot be shown, for example because Magic Card Utils is missing or still starting. See [Templates](../editor/templates.md#when-a-template-cannot-be-shown). | None |
| "Magic Card: the visual editor could not be loaded." | The editor file cannot load. Home Assistant shows its YAML editor instead. | None |

The card tries a failed part once more after two seconds. If that fails too, it keeps trying in the background, after 30 seconds, 90 seconds and 5 minutes. **Try again** asks for the file at once.

Parts that depend on a file behave in a fixed way while they wait:

-   An animated card is drawn still first and starts moving when its animation code arrives. If the code cannot load, the card stays still.
-   An icon shows Home Assistant's default icon until its code arrives.
-   A slider, spinbox, dropdown, light, gauge or tabs module keeps an empty box of its usual height, so the cards below do not move.
-   A card with an outline shape waits for its decoration file before it shows.
-   A pop-up card stays out of the layout until its file arrives.

## Offline and failed connections

The files come from the same Home Assistant server as `magic-card.js`, through `/hacsfiles/magic-card/` or `/local/`. A part can load only while the browser can reach Home Assistant. If the connection drops, the notice appears, and **Try again** asks for the file once the connection is back.

Once a part has loaded, the card keeps it for the rest of the page visit. A reload starts again from the card file.

If a file is missing from the folder, the feature it belongs to shows its notice and the rest of the card still works. Check that every file of the release is in the folder next to `magic-card.js`, including the `.br` and `.gz` copies. See [Manual](../../README.md#manual).

## Remembered pause

A card you paused stays paused, also after a reload. The pause is remembered in the browser for each card on each dashboard page. If the Pause button's code cannot load, the card stays paused and shows its notice.

To play a card again:

1.  Open the browser's developer tools and find the storage for the Home Assistant address (Local storage in Chrome and Edge, Storage in Firefox).
2.  Delete the entry whose key starts with `mc-paused:`. Each key stands for one card on one page, so delete only the entries for the cards you want to play.
3.  Reload the page.

If the browser does not allow the card to use storage, a pause lasts only for the page visit. More about the button is in [Pause motion button](../design/layers.md#pause-motion-button) and [Remembered pause](../design/layers.md#remembered-pause).

## After an update

Update through HACS, then hard refresh the browser. HACS does not delete the files of an earlier release. Once the update is done, you can delete the older hashed chunk files that the new release no longer uses. Keep every file of the new release.

For a manual install, copy the whole new release, including the `.br` and `.gz` copies. When you replace a file, replace or delete its three copies together, because an old `.br` file is sent in place of a new `.js` file.
