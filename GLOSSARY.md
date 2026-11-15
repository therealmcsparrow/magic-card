# Glossary

Look
: A style-only card config fragment from the look gallery: card frame keys and per-module-type design keys, never entities, content, actions or templates. Its keys and values follow the look grammar (src/contracts/look-grammar.ts). Not the same as a flow or slider look, which is a preset inside one module's Look group.

LookIndex
: The signed list of gallery looks that the gallery repository publishes as index.json on its Pages site: name, author, licence, SHA-512 content hash and look traits per look, plus a sequence number and an expiry date (src/contracts/look-index.ts).

Look traits
: Facts computed from a parsed look: whether it moves (Animated) and which Google font families it names. The gallery CI writes them into the LookIndex; the card recomputes them and refuses a tile whose index entry disagrees (src/contracts/look-grammar.ts).

Apply summary
: The list of settings Keep writes or clears, per area (the card, then each module type the card uses), with a total count. The gallery's "What changes" list shows it.

Off hint
: One line of static text in the card editor that says the look gallery can be turned on in Magic Card Utils. Shown only when Utils is installed and the gallery switch is off; it makes no request.

Refused tile
: A gallery tile drawn hatched and not applicable, because its look failed the hash or grammar check. It shows a fixed-code reason in text and a Report link to the gallery repository's issues.
