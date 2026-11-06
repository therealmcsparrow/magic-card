# 0086 The forum shot fetches fonts from any https host

Status: accepted (architect, forum shot, 2026-11-02). Replaces the Remote assets section of [ADR 0085](0085-forum-shot-is-its-own-lazy-entry.md).

## Decision

A card that names a web font can be picked, and its picture carries the real font. Pressing Download may now contact font hosts, which ADR 0085 ruled out. The panel names those hosts before Download, and nothing is fetched until then. Every other outside address still locks the card. A picture never falls back to another font: a font that cannot be prepared stops the run with `font_unavailable` and saves nothing.

The contract becomes forum-shot 1.1.0 (src/contracts/forum-shot.ts). The change is additive: the six existing error codes keep their meaning, and `remote_asset` still means the card is locked.

## One place fetches

Only `src/forum-shot/font-fetch.ts` may request an outside address, because one choke point makes the no-cookie, no-referrer and no-other-address rules testable in one place. `capture.ts` stays origin-only.

Every request uses `credentials: 'omit'`, `referrerPolicy: 'no-referrer'`, `mode: 'cors'`, `redirect: 'error'` and `cache: 'no-store'`. A redirect counts as a failed fetch, because following one reaches an address nothing has judged. `no-store` keeps an `ETag` from working as a cookie across Downloads. font-fetch judges each address again before its request, so a bug elsewhere cannot widen the rule.

## Which addresses count

tests/fixtures/forum-shot-font-cases.json holds the settled verdict for each hostile form; a case there and a sentence here must agree.

Only plain forms count as font addresses, and only in a `css` text: `@import url(...)` or `@import "..."` closed by `;`, with at most media words after the address, and each `url(...)` in the `src` of a top-level `@font-face`. Keywords are case-insensitive. Every `url()` of a `src` list is judged and named, although only one is fetched. Anything else goes through the existing `remoteHosts` scan, so an address in a comment, a `background`, a `layer()` or `supports()` import, a nested rule or any other key still locks with `outside_address`.

The text is read as CSS tokens first. An unterminated comment, string, `url(` or block, an at-rule the text ends without closing (an `@import` with no `;`), a stray `}`, or a backslash in an at-keyword or function name locks with `cannot_judge`, and that text is not scanned further.

Inside a plain form the address locks with `cannot_judge` when:

- it is longer than 2048 characters, or holds a character other than ASCII letters, digits and `- . _ ~ : / ? # @ ! $ & + , ; = %`. This list is why a backslash, a space, a tab, a square bracket (every IPv6 form), a quote, `*`, any non-ASCII character and every template form (`{{`, `{%`, `{#`, `[[[`, `${`) stop here. A host outside ASCII is written in its `xn--` form;
- a `%` is not followed by two hex digits, or the address reads differently once `decodeEntities` has run (a character reference, `&amp;`, `&num`). A bare `&display=swap` is plain;
- it stays on the page's own origin, relative or absolute, or uses a scheme that fetches no host (`data:`, `blob:`). A font address is explicit `https`, and the own origin is never a font host, so nothing outside the capture route reads it. A scheme with no `//` (`https:host/a.css`) does not count as staying on the own origin, because it reads as a path on an https origin and as a host on an http origin; it fails the next rule on every origin.

Otherwise it must be a font address, or it locks with `outside_address`:

- it starts with `https://` in any letter case, with no user or password, on the default port;
- the host and port as written, in lower case, are what `new URL` returns, with `:443` allowed. This refuses `%6cocalhost` and `:0443`;
- the host is at least two labels of `a-z`, `0-9` and inner hyphens, up to 63 characters each and 253 in all, with no trailing dot, and the last label is letters only or an `xn--` label. The URL parser normalises every IPv4 form (decimal, hex, octal, short) to dotted digits, so this refuses all of them, public ones included;
- it is not `localhost`, and not under `.localhost`, `.local`, `.internal`, `.intranet`, `.private`, `.corp`, `.home`, `.lan`, `.localdomain` or `.arpa`. Those are the names that route inside a home or resolve to the device itself (RFC 6761, RFC 6762 Appendix G, RFC 8375).

A public name that resolves to a private address cannot be seen from a browser, so `127.0.0.1.nip.io` stays a font address. A list of such names could never be complete. The no-credentials fetch and the font-content check are the answer: the request carries nothing, and the response has to pass CORS and be a font before anything reads it.

A card that would name more than 8 font hosts locks with `limit`.

## What the panel's list promises

Naming the hosts before Download is enough for a pasted card that logs who pressed Download, on these conditions. The address's owner learns the visitor's IP address, the time, the browser's ordinary request headers and the Home Assistant address, and nothing else. The Home Assistant address arrives in the `Origin` header, which each font request sends because the request stays `mode: 'cors'`; `no-referrer` does not remove it from a GET. The panel states this on screen. No cookie, no referrer, no cached `ETag` and no other value from the home is sent, since a template in an address locks the card. The person pressing Download has read who will learn that.

So the list has to be true and readable. `fontHosts` holds full hosts in lower-case ASCII, never a shortened domain, so a look-alike or a long subdomain shows as what it is. It is complete: every request of a Download goes to a host on it. A stylesheet may send a font to a host the card's config does not name only in the one built-in pair, `fonts.googleapis.com` to `fonts.gstatic.com`, and the list names both as soon as the Google stylesheet or a Google family appears. Any other unnamed host stops the run, even when it passes the address rule. An author whose stylesheet keeps its fonts on another host names that host with an `@font-face` in `css`.

Nothing is contacted when the tab opens, when the list is built or when a row is selected. A locked card names no host, because it contacts none.

## What a response must be

The status must be exactly 200 and the response type `cors`. A redirected, opaque, partial or empty response is a failed fetch.

A stylesheet response must declare `text/css`, with parameters allowed. A font response must declare `font/*`, `application/font-*`, `application/x-font-*`, `application/octet-stream` or `binary/octet-stream`, and its bytes must start with the `wOF2`, `wOFF`, `OTTO`, `true`, `ttcf` or `00 01 00 00` signature, because many static hosts serve real fonts as octet-stream and the bytes are the real proof. Before mount, each face must also load through `new FontFace(...).load()`. The type in the prepared `data:` source comes from the signature and never from the response's header.

A fetched stylesheet is read by the same tokeniser. Only top-level `@font-face` rules are kept, and they are rewritten from validated values:

- family: 1 to 64 letters, digits, spaces, `-` or `_` in any script;
- weight: `normal`, `bold` or one or two numbers from 1 to 1000;
- style: `normal`, `italic` or `oblique`;
- stretch: a keyword, or one or two percentages;
- unicode-range: comma-separated `U+` ranges, up to 4096 characters;
- one source: the first `url()` of the `src` list with a woff2, woff, opentype or truetype hint, or no hint. A relative source is read against the stylesheet's own address.

A rule with a value outside its grammar is dropped and its source is not fetched. Other rules and their addresses are dropped unread, and so are later sources in a `src` list. An `@import` at the top level, a tokeniser failure or a backslash in a kept rule stops the run. So does a chosen source that is not `https`, fails the address rule or is on a host the list does not name. Sources are all judged before the stylesheet's first font request. A stylesheet that yields no face, or more than 128, stops the run.

The existing limits stay: 5 MiB per file, 24 MiB per run, 8 s per fetch, covering the body. A stylesheet is capped at 1,000,000 bytes, the size the config scan reads. A new cap of 128 requests per run, stylesheets included, with 6 at once bounds a hostile stylesheet. The body is counted as it arrives and cancelled at the limit, because a declared length can lie. A broken limit is a failed fetch.

## How the font reaches the picture

The card mounts on a copy of the config in which font addresses are removed from `css` and each listed Google family (Roboto excepted) is renamed to an alias (`Open Sans` becomes `mc-shot-open-sans`). The card's own `loadGoogleFonts` then finds nothing to load and adds no `<link>`, with no change to the card's main file.

Prepared faces go in one `<style>` in `document.head` as sanitised `@font-face` rules with `data:` sources, under the alias and the real family name, and it is removed in a `finally`. Layout and `embeddedFonts` then read them through the existing route.

Each removed form is replaced by a space and the text left over is read again by the `remoteHosts` scan. An address in it stops the run, so removing one form can never join two pieces into a new one.

A family that arrives through a template result is aliased by the `scrubHass` copy and stops the run with `font_unavailable` when no face was prepared for it, because the picture must never fall back and the disclosed hosts are the ones in the card's config.

## What stays from ADR 0085

`renderSheet` still throws `remote_asset` for a locked card before any card mounts. Off-origin addresses are still scrubbed from the copy of hass before the mount. `sweepRemote` does not change, because no font address reaches the DOM on the mounted copy, which is stricter than a sweep that lets font addresses through. The `remote_placeholder` notice works as before.

No URL, entity id, token or config goes into the PNG, its file name or a log, and the forum shot writes nothing to storage.

## The card table

A table header sorts ascending on first click and then toggles. Rows return to dashboard order only when the tab is reopened, so no column is sorted on opening and a sort is not undone while the tab is in use. Selection is keyed on dashboard plus index path, because an index into a sorted list would move.

The table is a native `table` with explicit ARIA table roles, because the stacked phone layout sets `display: block`, which drops table semantics in some screen readers. Each row holds a radio button in the Card cell, and a click on the row selects through it.

## Magic Card Utils

The Magic Card Utils docs and changelog also have to describe this change. They live in that repository and are changed there.
