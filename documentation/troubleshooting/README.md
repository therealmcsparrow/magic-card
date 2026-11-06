# Troubleshooting

Short answers for the problems people report most. The [README](../../README.md#troubleshooting) lists more, and the [support page](../support/README.md) has ready replies.

## A card is blank on an old tablet

A blank card on a wall tablet is nearly always the browser engine, not the card.

1.  Find the Android System WebView version of the tablet. Magic Card needs version 85 or newer (Chromium 85). An older WebView still loads Home Assistant, but Magic Card does not run on it. Expected: version 85 or higher.
2.  If it is older, update Android System WebView and, in Fully Kiosk or another kiosk app, the app itself. If the tablet cannot update, see the [guest network tip](../old-tablets/README.md#guest-network).
3.  Hard refresh the page, or clear the cache of the kiosk app. An old copy of `magic-card.js` can stay in the cache after an update. Expected: the card draws.
4.  Open the browser console and look for the line `MAGIC-CARD v<version>`. It must match the version you installed. If the line is missing, the resource is not loaded: check Settings, Dashboards, Resources.
5.  If the card still shows nothing, [tell us which tablet, app and WebView version you use](https://github.com/therealmcsparrow/magic-card/issues). Say which card it is, and say whether a plain Magic Card with one text module draws.

On a desktop copy of Chromium 85, the gallery cards drew, and the card does not show some effects there: the bell swing, the glow and the ripple rings. A card that has missing effects is not blank. See [Older Android tablets](../old-tablets/README.md) and the [old engine check](../old-tablets/old-engine-check.md). The check was made on a desktop, not on a real tablet.

## A card stands still

See the [pause reply](../support/README.md#pause-reply) and the [Pause motion button](../design/layers.md#pause-motion-button). A paused card also stops its animated icons.

## The card editor looks old, or a file is missing

See [Loading and size](../loading-and-size/README.md) for which file loads when and how to clear the browser cache.

## A forum shot does not work

See [Forum shot](https://github.com/therealmcsparrow/magic-card-utils/blob/main/documentation/panel/forum-shot.md#if-something-goes-wrong) in the Magic Card Utils repository.

## A card is locked in the Forum shot tab

A locked row gives one of four reasons. The tab does not show the address itself, so look for it in the card's settings and CSS. To make a picture of the card:

1. Select Locked in the Status column of the card's row. A note opens with the reason. Press Escape or select Close to dismiss it.
2. Open the card in the editor and change what the reason points to:
    - "It loads something from outside Home Assistant." Look in the card's settings and CSS for an image or web address that is not on your Home Assistant, and remove it.
    - "It holds another card (a custom-card module) that nothing here can check." Remove the custom-card module.
    - "It names too many outside websites, or it is too large to check." Remove outside web addresses, or cut very long text, deep nesting or many nested items from the card.
    - "Its settings could not be checked for outside addresses." Simplify the card, for example by removing unusual or very large settings, then try again.
3. Save the card and reopen the Forum shot tab. If no other reason remains for that card, it is no longer locked. If it is still locked, read the new reason and repeat.

## A font could not be loaded

If Download stops with "A font could not be loaded, so no picture was made. Check your connection and try again.", try once more. No picture is saved when a font fails.

If it fails again, the card's font stylesheet may list fonts on a host the card does not name. The tab only contacts the font sites it shows, and such a stylesheet does not lock the row. Instead, Download stops with this message. Use a stylesheet whose fonts sit on a site the tab shows, or remove the stylesheet from the card's CSS.
