import type { KitTemplate } from './ui-kit';

/*
 * Contract: ui kit, panel lips (part of ui-kit 1.2.0; re-exported by ./ui-kit).
 *
 * A lip is a small button on the inner edge of a side panel that hides and shows that panel. One
 * controller per editor owns its lips, the remembered state, the one-time hint, the status region and
 * the Ctrl/Cmd + \ shortcut. It is a source-shared controller plus templates (layer 2 of the kit): it
 * renders in the caller's shadow root and never crosses a bundle boundary, so there is no new element and
 * no revision change.
 *
 * ── Files ──
 *   src/ui-kit/controllers/panel-lips.ts       PanelLips (implements PanelLipsController), exported from
 *                                              src/ui-kit/controllers/index.ts and so from src/ui-kit/index.ts
 *   src/ui-kit/controllers/scrollbar-width.ts  ScrollbarWatch and scrollbarWidth (see "Scrollbar
 *                                              measurement"), exported from src/ui-kit/controllers/index.ts
 *                                              and so from src/ui-kit/index.ts; hosts import them from the
 *                                              kit (the index or this file), never copy them
 *   src/ui-kit/css/lip.ts                      kitLip (CSSResult), exported from src/ui-kit/css/index.ts;
 *                                              not part of kitCss: only the editors with lips import it
 * None of these files holds module-level mutable state; every bit of state lives on the controller
 * instances. kitLip writes rules for LIP_CLASSES; the selector scan (ui-kit test 5) treats them like
 * KIT_CLASSES. kitLip does not depend on kitBase or kitButton (the animation studio does not load them all).
 *
 * ── Columns only ──
 * A panel has a lip only while it sits as a column beside the canvas or preview. The host says which
 * panels are columns right now through columns(); a panel that is an overlay, sheet, slide-over, tab or
 * stacked block is 'off': no lip, the remembered hidden state is not applied (the panel keeps its narrow
 * control) and stays remembered for when the panel is a column again. `suspended` (the card studio's
 * Preview) turns every panel 'off'; the shortcut then changes nothing but is still prevented (see
 * "Shortcut").
 *
 * ── States and the host's DOM ──
 * state(id): 'off' | 'shown' | 'hidden'. The host binds on the panel element:
 *   id=<spec.controls>   data-lip=${state(id)}   data-dir=${dir}   ?inert=${isHidden(id)}
 * and renders lip(id) as the panel's sibling in the same grid container: directly after a 'start' panel,
 * directly before an 'end' panel, so the tab order follows the visual order. lip(id) returns lit
 * `nothing` while 'off'. The lip is the same button node in both states (fixed template position), so
 * focus survives a toggle. If the panel element has an accessible name of its own, it is spec.name.
 * The host also renders status() once in its root template, unconditionally, from the first render.
 * A hidden panel stays mounted (selection, scroll position, open sections and field drafts are kept):
 * kitLip sets `visibility: hidden` and `pointer-events: none` on [data-lip=hidden]. Visibility carries
 * the behaviour (out of the tab order and the accessibility tree) on every browser, including Chromium
 * 85-101 where `inert` is missing; `inert` is an extra, never the only guard. The panel is never
 * conditionally rendered for this.
 *
 * ── Hidden layout: the panel keeps its width ──
 * The panel's track gives its width to the canvas, but the panel element itself never changes width and
 * never reflows its content while hidden. A panel squeezed into a 0 px track (width 0, content reflowing)
 * loses the scroll position of a nested scroller (such as mc-inspector's shadow-root list) on WebKit 27
 * (iPad, iOS companion app): scroll anchoring moves it while hidden and WebKit does not restore it. The
 * host's layout CSS uses one of these, all of which kept scrollTop in Chromium 85/156, WebKit 16.4/27.2
 * and Firefox 157:
 *   a. position: absolute at the panel's usual width, out of the grid flow; its track is 0 (preferred,
 *      the kitLip slide works);
 *   b. the panel stays in its track, the track is 0, the panel has an explicit width (e.g. width: 240px)
 *      and overflows the track (justify-self: end for an 'end' panel), so its content never reflows;
 *   c. display: none, only for a host that does not slide the panel (no --mc-lip-off); the slide and the
 *      visibility delay do not run then.
 * Forbidden: width 0, max-width 0, min-width: 0 with the content reflowing, or any track or flex basis
 * that narrows the panel element itself. Everything that sets the panel's content box (width, padding,
 * border) has the same value for [data-lip=shown] and [data-lip=hidden].
 * Hosts do not save or restore scrollTop on hide or show. Because the hidden panel stays mounted at its
 * own width, the browser keeps the scroll position of every scroller inside it, including one inside a
 * child shadow root (Test 2).
 *
 * ── Direction ──
 * `dir` is 'ltr' or 'rtl', read from getComputedStyle(host).direction on hostConnected, restore() and
 * setPanels() (a locale change is where the direction changes). The lip renders data-dir=${dir}, and the
 * host binds the same on the panel. kitLip uses [data-dir=rtl] for every left/right flip; it never uses
 * :dir() (Chromium 120) or :host-context().
 *
 * ── Lip button ──
 *   <button type="button" class="lip" data-side="start|end" data-dir="ltr|rtl" aria-expanded="true|false"
 *           aria-controls=<spec.controls> aria-label=<spec.name> title=<hideLabel|showLabel>
 *           aria-describedby=<hint id, only while the hint shows>>chevron</button>
 * - Disclosure pattern: the accessible name is fixed (spec.name, e.g. "Layers panel"); the state is only
 *   aria-expanded (true while shown). `title` is the pointer tooltip and the accessible description and
 *   swaps between hideLabel and showLabel (e.g. "Hide layers (Ctrl+\)"). The kit holds no strings. No
 *   aria-keyshortcuts (the shortcut acts on all panels; each editor lists it in its own shortcut help).
 * - Enter and Space toggle (native button); activation is `click` only, with no pointerdown, pointer
 *   capture or drag handler, so a touch drag that starts on the lip scrolls or pans as anywhere else.
 *   After a toggle by the lip, focus stays on the lip. A lip toggle never uses the status region.
 * - Look (colours only from KIT_TOKENS; the chevron points the way the panel will move and mirrors in RTL):
 *     shown    24 x 56 px, fill --mc-surface, 16 px chevron --mc-text-2, edge 1 px solid --mc-text-2;
 *              hover (hover: hover) fill --mc-surface-2, edge and chevron --mc-text; pressed fill
 *              --mc-accent-tint, chevron --mc-accent-ink; focus ring 2 px --mc-focus, outline-offset -3px
 *     hidden   28 x 72 px, fill --mc-accent-fill, 18 px chevron --mc-on-accent, edge 1 px solid
 *              --mc-text-2; hover and pressed darken with `box-shadow: inset 0 0 0 100vmax rgba(0,0,0,.15)`
 *              (no color-mix(), Chromium 111); focus ring 2 px --mc-on-accent, outline-offset -4px
 *   The edge and chevron reach 3:1 against the panel and the canvas in light and dark.
 * - Hit area: on a fine pointer the visible tab is the target (24 px wide or more, WCAG 2.5.8). Under
 *   @media (pointer: coarse) a transparent ::after extends it on the canvas side to 44 px wide and at
 *   least 72 px tall, and --mc-lip-edge-gap (default 0) insets a window-edge lip.
 * - z-index: var(--mc-lip-z, 4), never above LIP_Z_MAX. In the card studio the float bar and the column
 *   handles are z-index 5 in the same stacking context and stay above the lip and its extension. The lip
 *   is above the canvas content and the scroller next to it.
 * - Vertically centred in the grid container (top 50 %, transform: translateY(-50%)), or at --mc-lip-top
 *   when the host sets it (the host clamps it inside its working box).
 * - Placement, floor value first, then the logical property (browser floor Chromium 85; inset-inline-*
 *   arrives in Chromium 87, so 85-86 use the physical value and 87+ the logical one):
 *     .lip[data-side=start]                 left: var(--mc-lip-at-start, 0); then inset-inline-start: same
 *     .lip[data-side=start][data-dir=rtl]   left: auto; right: var(--mc-lip-at-start, 0)
 *     .lip[data-side=end]                   right: var(--mc-lip-at-end, 0); then inset-inline-end: same
 *     .lip[data-side=end][data-dir=rtl]     right: auto; left: var(--mc-lip-at-end, 0)
 *   The host sets these tokens on the grid container from the geometry model below.
 * - Focus ring, floor first: `.lip:focus` draws the ring; a separate rule `.lip:focus:not(:focus-visible)`
 *   removes it (Chromium 85 drops that rule as unknown and keeps the ring on every focus); then
 *   `.lip:focus-visible` draws the same ring. The three are never grouped in one selector list, so one
 *   unknown selector cannot drop the others. The ring is drawn inside the tab (negative offset).
 * - Slide off the edge: kitLip owns the hidden panel's move, with `transform` only (never the `translate`
 *   property, Chromium 104). The host sets --mc-lip-off on the panel as a left-to-right length: a negative
 *   value for a start panel (for example -100%), a positive one for an end panel.
 *     [data-lip=hidden]                  transform: translateX(var(--mc-lip-off, 0px))
 *     [data-lip=hidden][data-dir=rtl]    transform: translateX(calc(-1 * var(--mc-lip-off, 0px)))
 *   The panel element sets no transform of its own (a host that needs one wraps the panel).
 * - Motion: transform uses var(--mc-lip-ms, 200ms), 0s under prefers-reduced-motion: reduce; visibility
 *   switches at the end of a hide and at the start of a show (visibility transition with a delay of
 *   --mc-lip-ms on hide, 0s on show). Grid tracks do not transition (not animatable on the browser floor),
 *   so the canvas resizes at once. The timing is the kit's own --mc-lip-ms with a literal fallback, not an
 *   HA animation token.
 *
 * ── Geometry per editor (LIP_GEOMETRY) ──
 * Two models. The host picks the one in LIP_GEOMETRY[editor]; kitLip is the same for both.
 *   'overlay' (model O+): no column is reserved for the lip. While shown, the lip sits at the panel's
 *     inner edge; while hidden, it lies over the canvas at the window edge (or the tool rail's edge).
 *     In both states the host adds the measured width of the scrollbar the lip faces, so the lip never
 *     sits on a scrollbar. The canvas gets the whole freed track.
 *   'gutter' (model G40): while a column panel is hidden, the host keeps a real LIP_GUTTER_PX (40 px)
 *     track at that edge, beside the stage, and the lip lies in it (--mc-lip-at-* = rail edge or window
 *     edge plus the scrollbar width, which is 0 for a stage with overflow: hidden). While shown, the lip
 *     sits at the panel's inner edge inside the panel's column, never over the stage. The stage never
 *     has a lip, its ::after extension or a hint over it, so a handle at the stage edge stays reachable.
 *   card-studio, anim-studio: 'overlay'. Canvas content keeps 24 px padding; no handle sits in the lip's
 *     band (column handles are only on inner gutters of a row, .sel-frame is pointer-events: none). On a
 *     full-width card (Wide, Panel) the coarse-pointer ::after (44 px) covers the card's outer 20 px in a
 *     56-72 px band, and the hidden tab (28 px) its outer 4 px on any pointer; clicks there hit the lip.
 *     A float bar flush at its 8 px margin can cover up to 12 px of the visible tab; the rest and the
 *     extension stay reachable.
 *   svg-editor, shape-studio: 'gutter'. Their .stage has no padding and overflow: hidden, and SVG handles
 *     reach the stage edge; they cannot sit above an outside lip.
 *   theme-editor: 'overlay'. Its preview has no edit handles.
 * Measurement (both models): scrollbar width = scroller.offsetWidth - scroller.clientWidth minus the
 * scroller's computed border-left-width and border-right-width, for the scroller that touches the lip's
 * edge at the lip's vertical middle. Overlay scrollbars measure 0. No `scrollbar-gutter` (Chromium 94,
 * Safari 18.2, both above the floor) and no hard-coded width. Hosts measure with ScrollbarWatch (below)
 * and set --mc-lip-at-* from its `width`; they do not keep their own measuring code.
 * Success metric, measured at 820 x 1180 (iPad portrait, overlay scrollbars) with every column panel the
 * editor has there hidden:
 *   card-studio, anim-studio   canvas >= 780 px (O+ gives 820; 803-805 with a classic 15-17 px bar,
 *                              which only appears on desktop widths >= 900)
 *   svg-editor, shape-studio   layout 'compact' (641-900 px: 56 px rail, stage, 300 px inspector; the
 *                              side panel is an overlay there, so only the inspector has a lip). The
 *                              stage is 820 - 56 - 40 = 724 px (464 with the inspector shown); 764 px
 *                              is the widest stage this layout allows.
 *                              Metric: hiding the inspector gives the stage its width minus LIP_GUTTER_PX
 *                              (+260 px at compact, +280 at mid, +300 at wide), and no stage pixel lies
 *                              under the lip, its extension or the hint.
 *   theme-editor               the preview gains the variables panel's full width.
 * In every editor: the lip covers 0 px of any scrollbar, with a 0, 15 and 17 px bar.
 *
 * ── Scrollbar measurement (src/ui-kit/controllers/scrollbar-width.ts) ──
 * General kit helpers, not tied to PanelLips; source-shared like the controller.
 *   scrollbarWidth(el: HTMLElement): number
 *     max(0, round(el.offsetWidth - el.clientWidth - inline borders)). The borders come from
 *     getComputedStyle(el) inside a try; when it throws they count as 0. Each call reads layout.
 *   class ScrollbarWatch implements ReactiveController
 *     constructor(host: ReactiveControllerHost, onChange?: (width: number) => void)
 *       Adds itself to host with addController().
 *     width: number
 *       The last measured width; 0 until the first measurement, and 0 for a null scroller.
 *     watch(scroller: HTMLElement | null, ...also: Array<HTMLElement | null>): void
 *       Measures `scroller` at once. When the list of non-null elements (scroller first, then `also`,
 *       e.g. the grid container) differs from the last call, it disconnects the old ResizeObserver and
 *       observes the new list with one new observer that re-measures `scroller` on every resize. Where
 *       ResizeObserver is missing it only measures on watch(). An unchanged list keeps the observer.
 *     A measurement equal to `width` does nothing. A different one sets `width`, calls onChange(width)
 *     and requests one host update.
 *     hostDisconnected(): disconnects the observer and forgets the elements; the next watch() after a
 *       reconnect sets it up again.
 *   The observer follows size changes on its own, so a host calls watch() when the scroller or the
 *   container element may have changed (first render, a layout or columns change). Calling it on every
 *   update is allowed but forces a layout each time; a host whose updates run per frame (drags) gates
 *   the call.
 *
 * ── Status region ──
 * status() renders one visually hidden <div class="lip-status" role="status" aria-live="polite"
 * aria-atomic="true">, empty at first, so it is in the accessibility tree before any key press. kitLip
 * hides it visually itself. It is the only announcer of the controller and is used by the shortcut only.
 * Text: strings.hidden or strings.shown with {panels} replaced by the nouns of the panels that changed,
 * in declared order, joined with Intl.ListFormat(strings.locale, { type: 'conjunction' }), first letter
 * upper-cased with toLocaleUpperCase(strings.locale), e.g. "Layers and inspector hidden". Both calls sit
 * in one try: where Intl.ListFormat is missing or either call throws (a RangeError for an invalid tag;
 * strings.locale comes from hass), the nouns are joined with ", " and upper-cased with toUpperCase().
 * The region is emptied first and the text set on the next animation frame, so the same text twice is
 * announced twice; a pending frame is cancelled on hostDisconnected.
 * All text goes through lit text bindings; placeholders are plain string replacement, never HTML.
 *
 * ── Shortcut ──
 * The key matches when all of these hold:
 *   (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && !e.getModifierState?.('AltGraph')
 *   && (e.key === '\\' || e.code === 'Backslash') && !e.repeat && !e.isComposing
 * Ctrl or Cmd works on every platform. No Alt, no Shift and no AltGraph: on Windows layouts that type
 * '\' with AltGr (de, nl and others) Chromium reports key '\\' with getModifierState('AltGraph') true and
 * ctrlKey and altKey false; other browser and OS pairs report ctrlKey and altKey true. Either way that
 * keystroke is text entry: it never matches, is never prevented and reaches the field. On those layouts
 * the lips (in the tab order) are the way; each editor's documentation says so.
 * preventDefault() is called only when the key matches. It does not stopPropagation.
 * Capture phase: HA's ha-code-editor (CodeMirror) adds `keydown -> stopPropagation` on its own element,
 * so a bubble-phase listener on the editor root never sees Ctrl+\ typed in the YAML field. The listener
 * is therefore registered with { capture: true } on the host element and runs before CodeMirror. Because
 * of that, e.defaultPrevented no longer tells whether a field below uses the key; it is still respected
 * (another capture listener above may have taken the key). CodeMirror binds Ctrl-Alt-\ and Shift-Mod-\,
 * which the matcher already excludes; plain Mod-\ is unbound there.
 * Nested editors (the SVG editor inside the card studio): the innermost editor that holds focus owns the
 * key. In capture the outer host runs first, so the controller marks its host with LIP_HOST_ATTR from
 * hostConnected to hostDisconnected and, before acting, walks e.composedPath() from the target up to its
 * own host: if any element on that stretch carries LIP_HOST_ATTR, it returns without acting and without
 * preventDefault, and the inner controller handles the key in its own capture listener. The inner one
 * calls preventDefault() whenever the key matches, also when it has nothing to toggle.
 * Scope: only panels that are columns now and have a lip (state 'shown' or 'hidden'). 'off' panels
 * (overlays, sheets, slide-overs, tabs, stacked, suspended) are never opened, closed or counted.
 * Suspended (Preview): the owning controller still calls preventDefault() on a match, as with any match
 * that has nothing to toggle, so Ctrl+\ never reaches the browser or HA while the editor is open. It
 * changes, announces, writes and fires nothing, and the remembered set is kept; handleKey returns true.
 * Action: when any column panel is shown, the controller remembers which column panels were shown and
 * hides them all. When none is shown, it shows the remembered ones that are columns now; when nothing is
 * remembered (or none of them is a column now), it shows all column panels. The remembered set is held
 * in memory only (never stored) and is cleared by a lip click, by toggle()/show()/hide()/reveal() and by
 * restore(). So "layers hidden by its lip, Ctrl+\, Ctrl+\" returns to layers hidden, inspector shown.
 * A shortcut that changes something announces it (status region), saves the memory and fires
 * PANEL_CHANGE_EVENT; one that changes nothing announces nothing and writes nothing.
 * keys 'host' (default): the controller adds the keydown listener on the host element with
 * { capture: true } in hostConnected and removes it with the same option in hostDisconnected.
 * keys 'manual': the host calls handleKey(e) from its own keydown listener, which must also be a
 * capture-phase listener on the host or above it; handleKey applies the same matcher and nesting rule.
 *
 * ── Focus ──
 * - Hiding a panel that holds focus (:focus-within), by lip or shortcut, moves focus to that panel's lip
 *   after the update.
 * - Showing never moves focus.
 * - reveal(id): an explicit "edit this" action (Edit on a layer, Skip to inspector, a rename that needs
 *   the layers list). Only when the panel is a column now and hidden: it shows the panel, saves that
 *   (the next open does not hide it again), waits for the host's update and resolves; the caller then
 *   moves focus into the panel. Otherwise it changes nothing, writes nothing and resolves at once. A plain
 *   canvas tap or a selection change never reveals.
 *
 * ── Memory (per device, per editor) ──
 * localStorage key PANEL_MEMORY_PREFIX + editor, e.g. "mc-panels:card-studio". Value: the hidden panel
 * ids in declared order joined by ","; the key is removed when no panel is hidden. Read on hostConnected
 * and on restore(); written on every user change (lip, shortcut, reveal).
 * Every storage touch sits inside try/catch, including the `window.localStorage` access itself (its
 * getter throws a SecurityError in sandboxed or cookie-blocked contexts), not only getItem, setItem and
 * removeItem.
 * Untrusted on read: a value longer than PANEL_MEMORY_MAX is ignored; each id is checked against an
 * allow-list Set built from PANEL_IDS[editor] (or PANEL_IDS[editor].includes(id)), never by looking the
 * stored string up as an object key; unknown ids and duplicates drop.
 * Storage missing, blocked or full: every panel opens shown, nothing is logged or shown, and toggling
 * still works for the visit. Never in the card config, MCU storage or the undo history.
 * `fallback` runs once when the key is absent (getItem returned null); its ids pass the same allow-list,
 * are applied and written. The animation studio uses it to carry its earlier "Collapse layers" choice
 * over. restoredFrom tells where the hidden state of this open came from.
 *
 * ── Hint (once per editor) ──
 * When the editor opens with a column panel hidden by restored state (restoredFrom 'stored' or
 * 'fallback') and the hint was not dismissed for this editor, lip(id) renders, directly after the lip
 * button of the first such panel in declared order, one hint:
 *   <div class="lip-hint" id="<spec.controls>-hint" data-side data-dir>
 *     <p>text</p><p class="lip-hint-keys">strings.hintShortcut</p><button type="button">strings.gotIt</button>
 *   </div>
 * Text: strings.hintMigrated when restoredFrom is 'fallback'; else strings.hintOne with {noun} when one
 * column panel is hidden; else strings.hintMany. .lip-hint-keys is hidden under @media (hover: none).
 * The lip carries aria-describedby to the hint while it shows. Not modal, no focus move, no timer; Tab
 * reaches its button right after the lip. A hint pending for an 'off' panel waits until it is a column.
 * Dismissed by its button, by Escape inside the hint (preventDefault and stopPropagation, so the editor
 * and HA's dialog keep their Escape) or by any show (lip, shortcut, reveal). Focus inside the hint at
 * dismissal moves to its lip. Dismissal writes PANEL_HINT_PREFIX + editor = "1"; only exactly "1" reads
 * as seen. Same try/catch rule as the memory; blocked storage shows the hint on each such open.
 * Look: kitLip only (it does not rely on kitButton): --mc-surface fill, 1 px --mc-text-2 edge,
 * --mc-shadow-float, text --mc-text, 8 px from the lip on the canvas side with a notch towards it, max
 * width min(260px, var(--mc-lip-hint-max, 260px)), its button at least --mc-hit high (44 px coarse).
 * Opacity fade 160 ms, none under reduced motion. In a 'gutter' editor the host sets --mc-lip-hint-max
 * and --mc-lip-top so the hint stays inside the panel column or the gutter's band and off the stage's
 * handles, or the host accepts that the hint covers the stage until it is dismissed (not modal).
 *
 * ── Event ──
 * PANEL_CHANGE_EVENT on the host (bubbles: false, composed: false), detail PanelChange, after a user
 * change only (not on restore or columns()).
 *
 * ── Tests ──
 * 1. Toggle by click, Enter and Space; aria-expanded and title swap while aria-label stays spec.name;
 *    aria-controls set; focus stays on the lip; no status text after a lip toggle.
 * 2. A hidden panel keeps its DOM node, scrollTop and selection; data-lip and inert set; not focusable.
 *    Run once more with the inert attribute ignored (removed after render): still not focusable.
 *    Kept width: the hidden panel's offsetWidth (or its computed width for variant c) and its content
 *    width equal their shown values, and a nested scroller inside a child shadow root (like mc-inspector)
 *    at scrollTop 1000 reads 1000 after hide and show, with a row at index 50 at the same on-screen
 *    offset. jsdom cannot show the WebKit loss, so the same check runs once in WebKit 27 in a browser.
 * 3. Shortcut from a text field and from a nested shadow root; repeat, isComposing and defaultPrevented
 *    ignored; Shift + Ctrl + \ and Alt + Ctrl + \ do nothing; any shown -> all hide, none shown -> the
 *    remembered set shows (layers hidden by lip, key, key: layers hidden, inspector shown); a lip click
 *    clears the remembered set; 'off' panels are untouched; with no lip, and while suspended, it prevents
 *    the key but changes nothing, announces nothing, writes nothing, fires nothing.
 *    Capture: the key typed in an element inside the host that adds `keydown -> stopPropagation` on
 *    itself (as ha-code-editor does) still toggles, with Ctrl and with Meta; the listener is added and
 *    removed with { capture: true }.
 *    Nesting: an inner host with LIP_HOST_ATTR inside an outer one; focus in the inner one: only the inner
 *    controller acts, the outer one neither acts nor calls preventDefault; focus in the outer one outside
 *    the inner host: the outer one acts.
 *    AltGr: "AltGr + key producing \ types it and toggles nothing". A keydown in a text field with
 *    key '\\', ctrlKey true and altKey true (the ctrl+alt report), and a second one with ctrlKey and
 *    altKey false and getModifierState('AltGraph') true (the Chromium report): defaultPrevented stays
 *    false, no panel changes, no PANEL_CHANGE_EVENT, no status text.
 * 4. Memory: one key per editor, allow-list, length cap, hostile values (over PANEL_MEMORY_MAX, unknown
 *    ids, "__proto__", "constructor", duplicates, empty string), blocked storage (the window.localStorage
 *    getter, getItem, setItem and removeItem each throw), fallback once, removeItem when all are shown,
 *    restoredFrom per case.
 * 5. columns() and suspended: 'off' renders no lip and keeps the memory; reveal() on an 'off' or shown
 *    panel writes nothing.
 * 6. Hiding the focused panel (lip and shortcut) moves focus to its lip; reveal() resolves after the
 *    update.
 * 7. Import scan unchanged: magic-card.js reaches none of the three files.
 * 8. kitLip text: left/right appear before inset-inline-*, :focus before :focus-visible, a
 *    [data-dir=rtl] rule for placement and for the slide, no :dir(, no `translate:` property, no
 *    color-mix(, no scrollbar-gutter, no selector list mixing :focus-visible with another selector, a
 *    z-index no higher than LIP_Z_MAX. dir=rtl host: data-dir is rtl on the lip.
 * 9. Status region: present and empty after the first render (also suspended); shortcut text names the
 *    changed panels in declared order with the list format; the same shortcut twice is announced twice;
 *    strings.locale "x_" (and Intl.ListFormat removed) still announces, joined with ", ".
 * 10. Hint: shows for stored and fallback state only (not after a hide in this visit), migrated text for
 *    fallback, one hint for two hidden panels, aria-describedby while shown, dismissed by its button,
 *    Escape (consumed) and any show, flag "1" written, other flag values read as unseen, blocked storage
 *    shows it again, focus returns to the lip.
 * 11. Geometry (per host in a browser; ScrollbarWatch and scrollbarWidth also in unit tests with stubbed
 *    sizes): scrollbar width = offsetWidth - clientWidth minus inline borders, never below 0; an equal
 *    measurement requests no update and does not call onChange; a changed element list replaces the
 *    observer, an unchanged one keeps it; no ResizeObserver: watch() still measures; observer
 *    disconnected on disconnect. The lip covers 0 px of a 0, 15 and 17 px bar. 'gutter' hosts: with a
 *    panel hidden the gutter track is LIP_GUTTER_PX and the lip's box (with ::after) does not intersect
 *    the stage's box. 'overlay' hosts: the lip's z-index is below the float bar's. The success metric
 *    above at 820 x 1180, per editor.
 */

/** localStorage key prefix; the editor id follows. */
export const PANEL_MEMORY_PREFIX = 'mc-panels:';
/** localStorage key prefix of the hint flag ("1" = dismissed); the editor id follows. */
export const PANEL_HINT_PREFIX = 'mc-panels-hint:';
/** Longest stored value that is read; anything longer is ignored. */
export const PANEL_MEMORY_MAX = 64;
/** Event fired on the host after a user change. */
export const PANEL_CHANGE_EVENT = 'mc-panels-change';
/** Longest panel move in ms (0 under reduced motion). */
export const LIP_MOTION_MS = 200;
/** Attribute the controller sets on its host while connected; marks a lip owner for nested shortcut handling. */
export const LIP_HOST_ATTR = 'data-mc-lips';
/** Width of the lip column in the 'gutter' model, px. */
export const LIP_GUTTER_PX = 40;
/** Highest z-index a lip may use (the card studio's float bar and column handles are 5). */
export const LIP_Z_MAX = 4;

/** Editors with lips. One storage key each. */
export const PANEL_EDITORS = ['card-studio', 'anim-studio', 'svg-editor', 'shape-studio', 'theme-editor'] as const;
export type PanelEditorId = (typeof PANEL_EDITORS)[number];

/** Panel ids per editor (the storage allow-list). */
export const PANEL_IDS: Readonly<Record<PanelEditorId, readonly string[]>> = {
  'card-studio': ['layers', 'inspector'],
  'anim-studio': ['layers', 'inspector'],
  'svg-editor': ['side', 'inspector'],
  'shape-studio': ['side', 'inspector'],
  'theme-editor': ['variables'],
};

/** 'overlay': model O+ (lip over the canvas, inset by the scrollbar). 'gutter': model G40 (own 40 px track). */
export type LipGeometry = 'overlay' | 'gutter';

/** Geometry model per editor (see "Geometry per editor"). */
export const LIP_GEOMETRY: Readonly<Record<PanelEditorId, LipGeometry>> = {
  'card-studio': 'overlay',
  'anim-studio': 'overlay',
  'svg-editor': 'gutter',
  'shape-studio': 'gutter',
  'theme-editor': 'overlay',
};

/** Class names kitLip writes rules for; screens may not style them (selector scan). */
export const LIP_CLASSES = ['lip', 'lip-hint', 'lip-hint-keys', 'lip-status'] as const;

/** Layout tokens kitLip reads; the host sets them, the part carries var() fallbacks. */
export const LIP_TOKENS = [
  '--mc-lip-at-start', '--mc-lip-at-end', '--mc-lip-top', '--mc-lip-ms', '--mc-lip-off',
  '--mc-lip-edge-gap', '--mc-lip-hint-max', '--mc-lip-z',
] as const;

export type PanelSide = 'start' | 'end';
export type PanelState = 'off' | 'shown' | 'hidden';
export type PanelDir = 'ltr' | 'rtl';

export interface PanelLipSpec {
  /** One of PANEL_IDS[editor]. */
  id: string;
  side: PanelSide;
  /** DOM id of the panel element in the same shadow root (aria-controls). */
  controls: string;
  /** Fixed accessible name (aria-label) in both states, e.g. "Layers panel". */
  name: string;
  /** Lower-case noun for announcements and the hint, e.g. "layers", "side panel". */
  noun: string;
  /** Tooltip (title) while shown, e.g. "Hide layers (Ctrl+\)". */
  hideLabel: string;
  /** Tooltip (title) while hidden, e.g. "Show layers (Ctrl+\)". */
  showLabel: string;
}

/** Caller strings (the kit holds none). Placeholders are replaced as plain text. */
export interface PanelLipStrings {
  /** BCP 47 tag for Intl.ListFormat and upper-casing, e.g. hass.locale.language. May be invalid. */
  locale: string;
  /** "{panels} hidden" */
  hidden: string;
  /** "{panels} shown" */
  shown: string;
  /** One hidden panel: "The {noun} panel is hidden, as you left it. ..." */
  hintOne: string;
  /** Several hidden panels. */
  hintMany: string;
  /** Hidden by `fallback` (an earlier setting carried over). */
  hintMigrated: string;
  /** Second hint line, hover devices only: "Shortcut: Ctrl+\ or ⌘\". */
  hintShortcut: string;
  /** Hint button: "Got it". */
  gotIt: string;
}

export interface PanelLipsOptions {
  editor: PanelEditorId;
  panels: readonly PanelLipSpec[];
  strings: PanelLipStrings;
  /** 'host' (default): capture-phase keydown listener on the host. 'manual': the host calls handleKey() from its own capture-phase listener. */
  keys?: 'host' | 'manual';
  /** Runs once when the storage key is absent; the allowed ids it returns start hidden and are written. */
  fallback?: () => readonly string[] | null;
}

export interface PanelChange {
  editor: PanelEditorId;
  /** Hidden panel ids after the change, in declared order. */
  hidden: string[];
  cause: 'lip' | 'key' | 'reveal' | 'api';
}

/**
 * PanelLips (src/ui-kit/controllers/panel-lips.ts):
 *   new PanelLips(host: ReactiveControllerHost & HTMLElement, options: PanelLipsOptions)
 * Requests a host update on every state change. Labels may change with the locale: the host passes new
 * specs and strings through setPanels().
 */
export interface PanelLipsController {
  readonly editor: PanelEditorId;
  /** Text direction of the host, bound as data-dir on the lip and the panel. */
  readonly dir: PanelDir;
  /** Where this open's hidden state came from: nothing hidden, the stored key, or `fallback`. */
  readonly restoredFrom: 'none' | 'stored' | 'fallback';
  /** Replace the specs (same ids) and strings after a locale change. Re-reads dir. */
  setPanels(panels: readonly PanelLipSpec[], strings: PanelLipStrings): void;
  /** Which panels are columns now; call before render (willUpdate). Unchanged input requests nothing. */
  columns(map: Readonly<Record<string, boolean>>): void;
  /** True: every panel 'off', no lips; a matching shortcut is still prevented and changes nothing. */
  suspended: boolean;
  state(id: string): PanelState;
  isHidden(id: string): boolean;
  /** At least one panel is a column and the controller is not suspended. */
  readonly active: boolean;
  /** The lip button (plus the hint while it shows), or lit `nothing` while the panel is 'off'. */
  lip(id: string): KitTemplate;
  /** The status region; rendered once by the host from the first render. */
  status(): KitTemplate;
  toggle(id: string): void;
  show(id: string): void;
  hide(id: string): void;
  /** The shortcut's action (scope and remembered set as above). False when nothing changed. */
  toggleAll(): boolean;
  /** Shows a hidden column panel, saves it, resolves after the host's update. Resolves at once otherwise. */
  reveal(id: string): Promise<void>;
  /** keys 'manual': true when the event was the shortcut and this controller owns it (preventDefault was called). */
  handleKey(e: KeyboardEvent): boolean;
  /** Re-read the memory, the hint flag and dir (for an editor element that stays connected between opens). */
  restore(): void;
}

/** src/ui-kit/controllers/scrollbar-width.ts: inline scrollbar width of `el` in px (see "Scrollbar measurement"). */
export type ScrollbarWidthFn = (el: HTMLElement) => number;

/**
 * ScrollbarWatch (src/ui-kit/controllers/scrollbar-width.ts):
 *   new ScrollbarWatch(host: ReactiveControllerHost, onChange?: (width: number) => void)
 * Adds itself to the host; behaviour under "Scrollbar measurement".
 */
export interface ScrollbarWatchController {
  /** Last measured width in px; 0 before the first measurement and for a null scroller. */
  width: number;
  /** Measure `scroller` now; (re)observe scroller and `also` when that element list changed. */
  watch(scroller: HTMLElement | null, ...also: Array<HTMLElement | null>): void;
  hostDisconnected(): void;
}
