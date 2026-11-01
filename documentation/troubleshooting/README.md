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
