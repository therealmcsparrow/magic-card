# Look gallery

The look gallery is a collection of looks that other people shared. A look changes how a card looks, never what it does. Your entities, text, actions and templates stay as they are.

You browse the gallery from the card editor, try a look on your own card, and keep it or cancel. Nothing is saved until you choose Keep.

The gallery is off by default. While it is off, Magic Card sends no request to the gallery host. Read the [privacy note](#privacy) before you turn it on.

## Turn it on

Turning it on is an administrator task, because the switch covers everyone who uses the same Home Assistant. It needs [Magic Card Utils](../../README.md#installation).

1. In Home Assistant, go to Settings → Devices & services → Magic Card Utils → Configure.
2. Turn on the **Look gallery** switch and select **Submit**.
   Result: a screen titled "Turn on the look gallery?" lists the websites your browser will contact. Nothing is saved yet.
3. Read it, then select **Continue**. Select **Cancel** to keep the gallery off.
   Result: a second screen titled "Turn on the look gallery for everyone?" explains that the switch applies to every user.
4. Select **Turn on**. Only **Look gallery** is stored. Cancelling or closing either screen stores nothing.
   Result: the options close.
5. Reload each open dashboard. In a browser, refresh the page. In the Home Assistant app on an iPad or iPhone, pull down to refresh, or close and reopen the app.

Turning the gallery on does not change **Load Google Fonts**, and the gallery works with it off. Many looks use Google fonts, so while the gallery is on and **Load Google Fonts** is off, Magic Card Utils suggests turning it on. Without it, cards show a standard font.

To turn the gallery off, switch **Look gallery** off. That stops requests to the gallery host only. Google Fonts requests stop only when **Load Google Fonts** is off; cards then show a standard font instead. Cards that already use a look keep their style settings either way.

## When the gallery is off

If Magic Card Utils is installed but the gallery is off, the card editor shows one line of help: "Looks gallery: turn it on in the Magic Card Utils options." It makes no request. Without Magic Card Utils the editor shows nothing about the gallery.

## Browse and preview

1. Open a card in the editor and select **Browse looks**.
   Result: the gallery opens with a tile for each look. Each tile shows a picture, the look's name, its author and its licence. Tiles say "Style only, verified" for a look that holds only style settings, "Animated" for a look that moves, and "Uses Google Fonts" for a look with a Google font.
2. Select a tile.
   Result: your card shows the look right away. A bar at the bottom says "Previewing" and that nothing is saved yet.
3. Open **Details** to see what the look changes. Under **What changes**, the list names the settings that Keep replaces, grouped by card and module type, with a count. These settings replace the values your card has now.

The preview is a still picture of the card's style. It does not show hover or tap styles, so check those after you keep the look. An animated look can slow older tablets and wall displays, and the bar warns you before you keep one. Under reduced motion the preview stays paused.

A tile that has no picture is still a usable look. You can preview and keep it the same way.

At a narrow width, **Show my card** scrolls to your card so you can see the preview.

## Keep, Cancel or Undo

- **Keep this look** copies the look's style settings into your card and closes the gallery. A kept look is a copy. The card has no link to the gallery, so it works the same if the gallery goes offline or removes the look, and it does not change when the original look changes.
- **Cancel** puts your card back exactly as it was. Esc does the same while a preview is open. With no preview open, Esc goes back to the editor.
- **Undo** appears in a banner under the **Browse looks** button after you keep a look: Look "name" applied, with **Undo** and **Dismiss**. Undo restores the card as it was before you kept the look. The banner has no timer. It goes away when you make another edit, select **Dismiss**, or close the editor.

Keep replaces the look's style settings; it does not merge with them. A look never touches rows, positions, module ids, entities, text or actions.

Two tips: after you keep a look, check the dashboard on the screen where it will actually run, such as a wall tablet. Before a big restyle, keep a copy of the card's configuration.

## Not available

Looks that fail Magic Card's checks are listed under **Not available** and cannot be previewed. Each entry gives a reason in plain words and a small code.

| Code | What it means |
|---|---|
| L-HASH | The look changed after it was checked, so it is blocked. |
| L-PARSE | The look contains more than style settings, so it is blocked. |
| I-SIG | The signature of the list did not check out. |
| I-VER | The list uses a format this version of Magic Card does not know. Update Magic Card. |
| I-PARSE | The list could not be read. |
| I-ROLL | The list is older than the one saved on this device. |
| C-TAMPER | The saved copy failed its check and was discarded. |
| N-FETCH | The gallery could not be reached. Select **Try again**. |

To report a look that you think should not be listed, select **Tell the gallery owner** next to it. The link opens the gallery's issue page in a new tab and needs a GitHub account. Give the look's name and the code.

## Privacy

Your browser contacts the gallery host, therealmcsparrow.github.io (run by GitHub), when the editor loads the list, and it sees your internet address. The gallery does not turn on Load Google Fonts. While Load Google Fonts is on, browsers that show a card with a look that uses a Google font also contact fonts.googleapis.com and fonts.gstatic.com (run by Google), which see the address too. Read the full note in the [README](../../README.md#privacy).

## Sending a look

Looks are added to the gallery repository by pull request, under the author's GitHub account. The gallery's own CONTRIBUTING file has the rules, including the picture format: still WebP images up to 1024 pixels a side and 96 KiB. Its checks re-encode each picture and publish only their own copy. Colour functions that are newer than the oldest supported browser, such as `color-mix()` and `oklch()`, are refused.
