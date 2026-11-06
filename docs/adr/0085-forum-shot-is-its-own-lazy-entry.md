# 0085 The forum shot is its own lazy entry

Status: accepted (architect, forum shot, 2026-11-01). The Remote assets section is replaced by [ADR 0086](0086-forum-shot-fetches-fonts-from-any-https-host.md).

## Decision

The forum shot ships with Magic Card as its own lazy entry, dist/magic-card-forum-shot.js, which registers `<magic-card-forum-shot>` and which the Magic Card Utils panel loads, as it does the theme editor. It has to draw real cards with the card's own code and it must add nothing to magic-card.js, whose module list stays as it is. Its contract is forum-shot 1.0.0 (src/contracts/forum-shot.ts) and its raw size ceiling is 98,304 B.

Every later release ships this file. The panel depends on it from the paired Magic Card version onwards (`MIN_MAGIC_CARD_FOR_FORUM_SHOT`), so the file keeps its fixed name, stays in the fixed-name entries of tools/check-manifest.mjs and keeps its entry in tools/size-caps.json. Removing it would be a breaking change to the contract.

## Capture

A frame is captured by cloning the rendered DOM with its computed styles into an SVG `foreignObject`, loading that SVG as a `data:image/svg+xml` URL and drawing it to a canvas that gives the PNG. A `blob:` URL taints the canvas in Chrome, so it is not an option. A web font loaded in the page is not available inside the SVG image, so same-origin faces are embedded as `data:` `@font-face` rules. This needs no new dependency.

A start-up taint check throws `capture_failed` in a browser that taints the canvas. Safari and Firefox were not run, so on those browsers the export may stop with that error.

## Remote assets

Replaced by [ADR 0086](0086-forum-shot-fetches-fonts-from-any-https-host.md), which allows font requests under exact rules. The text below is the original decision, kept as history.

The forum shot makes no request outside the Home Assistant origin, because a request would tell a third party who is viewing the card. Three layers enforce that, and the first two act before the browser could fetch anything:

1. A config that names a cross-origin URL or a Google font is refused. The picker lists the card with the `remote_asset` notice and it cannot be picked; `renderSheet` throws `remote_asset` before any card mounts.
2. The card mounts on a copy of hass. Off-origin URLs are scrubbed from that copy's state attributes (`entity_picture` and image attributes) and from `render_template` results before the mount. Replacing them after the render is too late, since the spike saw those requests leave at render time.
3. After the frame renders, every `img` `src`, `srcset`, image `href` and CSS `url()` in it is swept. Anything not on the Home Assistant origin or `data:image` is replaced by the fallback before capture.

When layer 2 or 3 replaces anything, the sheet carries the `remote_placeholder` notice, which the panel shows under the preview. A test asserts zero off-origin requests for a template-built image.

No URL, entity id, token or config goes into the PNG, its file name or a log, and the forum shot writes nothing to storage.
