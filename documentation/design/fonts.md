# Fonts and Google Fonts

Every font picker in Magic Card can offer the whole Google Fonts catalogue. This needs Magic Card Utils and one switch.

## Turn on Google Fonts

1. Go to Settings → Devices & services → Magic Card Utils.
2. Choose Configure.
3. Turn on **Load Google Fonts** and submit.
4. Reload the page.

The switch is off by default. It covers the whole Home Assistant install, so it applies to every user and every dashboard. A change applies after a page reload.

Without Magic Card Utils there is no switch, and Google fonts do not load.

## The font picker

With the switch on, every font picker shows a Google tab next to the local fonts. The tab lists the full catalogue, with a search field and category filters. With the switch off, the Google tab is hidden.

The same picker is used in:

-   The card editor and the Studio, for `font_family`, `label_font_family` and `tab_font_family`.
-   The theme editor, in the font fields of a theme.
-   The image editor, for image text.

Save writes a CSS font stack, for example `"Open Sans", sans-serif`. If you type a catalogue name such as `lato` into a font field, Magic Card stores it as `"Lato", sans-serif`. The typing and the tidied name are one undo step.

A custom `font-family` in a card's css counts too. The card loads each catalogue font that its design or css names. Roboto is never loaded, because Home Assistant ships it. If a font's stylesheet fails to download, the card asks for it again the next time it draws, up to three times per page load.

## Cards that already use a Google font

This changed in 2026.11.04. A card that names a Google font now needs Magic Card Utils with the switch on. Until then it shows the fallback font at the end of its stack, such as `sans-serif`. The card editor shows a short note under such a font field and tells you what is missing.

To keep the look, install Magic Card Utils and turn on the switch. Or pick a font that is installed on the device.

Google renamed Source Sans Pro, which the old font list offered, to Source Sans 3. A card that names Source Sans Pro shows the fallback font even with the switch on. Pick Source Sans 3 in the Google tab to get the look back.

## Theme fonts

When the switch is on, Magic Card Utils also loads the fonts that your active Home Assistant theme names, if they are Google fonts. They load on every Home Assistant page, not only on dashboards with a Magic Card.

## Fonts in images

Image text can use a Google font. It is stored as `"Name", <generic>`, where the generic family is `sans-serif`, `serif`, `monospace` or `system-ui`. A handwriting font falls back to `sans-serif` in images. A font from the local fonts tab is stored as its generic family, so Arial becomes `sans-serif` and Times New Roman becomes `serif`. A name that is not in the catalogue is not stored.

A drawing holds no font file and no link. With the switch off, the drawing shows the generic font. An exported SVG file shows the generic font as well. See [Privacy and your images](../images/privacy.md) and the [SVG allowlist](../sharing-safety/svg-allowlist.md).

## Privacy

Google fonts load only when the Google Fonts switch in Magic Card Utils is on. When it is on, the browser of everyone who views a dashboard requests font files from Google (`fonts.googleapis.com` and `fonts.gstatic.com`). Google receives the viewer's IP address, browser details and the page address, and logs the request; see [Google's privacy policy](https://policies.google.com/privacy). This happens in cards, the editors, the theme preview, images and the forum shot export.

When the switch is off, or Magic Card Utils is not installed, nothing is requested from Google and a font that only Google provides shows as a plain generic font.

The switch does not cover an `@import url(https://fonts.googleapis.com/...)` that you typed into a card's custom css. That is an address you chose, like an image address, and the browser requests it either way. The same goes for a stylesheet you add as a dashboard resource, as the [complete dashboards](../gallery/dashboards/README.md) ask. The browser requests it whatever the switch says.

See [Privacy](../../README.md#privacy) for the full text.
