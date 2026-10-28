# Changelog

All notable changes to Magic Card. Dates are release dates (UTC). Detailed documentation is in [documentation/](documentation/README.md).

Magic Card uses calendar versions: year, month and a release number within the month.

## 2026.10.12-beta.11 (2026-10-28)

### Added
-   **Draw Line, Rectangle, Ellipse and Freehand with the keyboard.** Tab to the drawing area, move a cursor with the arrow keys (Shift 5 units, Alt a tenth), and press Enter to set the start and then the end. Freehand places a point on each Enter and ends when you press Enter again on the last one. Escape drops the drawing and every step is announced.
-   **Paste SVG in the image editor.** The first window of a new image now has **Paste SVG**, next to Blank canvas and Open file. Paste the markup, then choose **Use this SVG**. The text is cleaned and read the same way as an opened file, and the same summary says what was removed. Text over 8 MB is refused before it is read. A refusal changes nothing and keeps your text in the box. Paste works over http:// too, because it uses a text box and not the clipboard.
-   **Start from… and Shortcuts in the image editor.** The image editor top bar now has **Start from…**, which opens the same window as a new image, and **Shortcuts**, which lists the editor's keys. A drawing started from there replaces the old one as one step that Undo brings back, and the image keeps its name.

### Changed
-   **Motion paths and Draw points, details.** A motion path can no longer add a point before the first one. C, not Enter or Space, now switches a point between smooth and corner. The limit of 100 anchors on a Draw path is gone.
-   **Pen, shape points and motion path share one canvas.** In the animation studio, the Pen tool, the points of a selected shape and the Motion path tool now run on the same canvas that the shape editor uses. A path closes when you click its first point, and only once it has three points (the Pen closed at two before). **Finish path**, which shows from two points, or a second Escape finishes an open line; the first Escape clears the selected point.
-   **Keys on points in the animation studio.** Enter now places a point at the crosshair, which you move with the arrow keys, so the Pen and the Motion path work without a pointer. Enter no longer finishes a Pen line. With a point selected, Delete removes it and the arrow keys move it by 1 unit (Shift 5, Alt 0.1). With no point selected, Delete removes the shape and the arrow keys nudge it by 0.1 units (Shift 1). A locked shape ignores them. The Pen hint now says "or choose Finish path".
-   **Drawing tools that do not load.** If the drawing canvas cannot load, the stage says "Couldn't load the drawing tools." with **Try again**. If the page holds an older Magic Card version, it says to reload the page and offers **Reload page**. The rest of the studio keeps working.
-   **One top bar and one start window for icons and images.** The icon editor and the image editor now draw the same bar and the same start window, so Undo, Redo, Save, the name box and the buttons behave and read alike. In narrow windows the image bar buttons keep their symbol and drop the word. A button that cannot act yet, such as Save with nothing drawn, stays on the Tab path and says why. Both name boxes have a visible label, and Save is read out once as Ctrl+S instead of twice.
-   **The start window of a new image.** Blank canvas, Paste SVG and Open file are tiles in one row. Blank canvas starts open, with Shape, Width, Height, Keep ratio and **Create**. The window has no Cancel button: Close or Esc closes it, and closing it before the first drawing closes the editor.
-   **Start from… in the icon editor is one undo step.** Choosing a blank drawing, an icon, pasted SVG or a file from Start from… now replaces the drawing as one step that Undo brings back, and the icon keeps its name. Before, it reset the history. The "Start over?" question says so: "Undo brings the old drawing back."
-   **Start window messages.** A refused file or text shows its reason in one line under the tiles, and the focus goes back to the button that started it. A file that takes a moment to read says "Reading name…".
-   **Files are checked by type before size.** The icon editor start window, the animation studio Draw import and icon effects now refuse a file that is not an .svg file before they read it, and the file size is checked after the type. Icon effects used to take any file name.
-   **A file that cannot be read says so.** The image editor Import window and icon effects show a message when the browser cannot read a chosen file, instead of failing without a word.
-   **A refused file changes nothing.** In icon effects, a refused upload no longer puts the file's text into the SVG markup box. In the icon editor start window, a refused file leaves your drawing as it was.
-   **The image editor Import window.** A refused file now opens a window headed "Could not import the file" instead of "Imported 'name'".
-   **Library import help.** The help line under Choose a file in the Library import now says an .svg file can be up to 32 KB.

### Fixed
-   **Try again in the drawing tools.** After the drawing canvas failed to load, Try again now asks the browser for a fresh copy instead of reusing the failed answer. Focus goes back to the drawing area and the studio says the tools are ready. Reload page asks before it discards changes that are not saved.
-   **Dragging a point shows at once.** A point of a selected Draw shape now follows the pointer while you drag it.
-   **Drawing messages.** "Too many shapes" when importing an SVG is translated. Finish path and Try again have more contrast, Finish path and a second Escape in the Pen say "Path 1 added, 3 points.", and the Icon animation window returns focus to New animation when it closes.
-   **Tab stays inside a window.** In an editor window, pressing Tab on the last control used to leave the window for a moment (the focus went to the page behind it) before it came back to the first control. Tab now goes straight from the last control to the first, and Shift+Tab from the first to the last, in every window of the kit, including windows whose content sits in a shadow root, such as the Library, Export / Import and the icon picker.
-   **Start window fixes.** A file or text that is refused no longer says "Reading name…" a moment later. After a refusal you can choose the same file again once you have fixed it. Use this icon, when its answer comes after you closed the window or chose something else, no longer replaces the drawing. A read that fails unexpectedly now shows a message and the window stops saying "Reading…".

## 2026.10.12-beta.10 (2026-10-27)

### Added
-   **Open an SVG file as an image.** The Images tab of the Magic Card Utils panel now takes a plain .svg file as well as a .json preset file, and the first window of the image editor has an **Open file** button. Both clean the file the same way as Import in the image editor. An .svg file can be up to 8 MB, and the cleaned image must still be 256 KiB or less. See [Library images](documentation/images/README.md).

### Changed
-   **Backdrop layer sliders follow your finger.** The sliders in the card backdrop layers (Zoom, Duration, Blur, Size, Thickness, Opacity) and in the layer groups now use Home Assistant's own slider when your Home Assistant has one, and a plain browser slider otherwise. The card preview changes while you drag. While you drag any slider in the card editor, the new value also reaches Home Assistant several times a second, so Home Assistant's own preview follows too. The final value is sent when you let go. Every other edit still waits 200 ms after the last change.
-   **An open backdrop layer is no longer blue.** The blue border and the thick blue bar on the left of an open layer are gone; the border is the normal divider colour and the turned arrow shows which layer is open. Keyboard focus rings stay.
-   **The side panel button slides with its panel.** The edge button that hides or shows a side panel used to jump to its new place while the panel slid, and so did the first-open hint beside it. Both now slide with the panel in the card studio, the animation studio, the SVG editor, the shape studio and the theme editor. With reduced motion turned on, nothing slides.
-   **A file must hold what its name says.** Every preset import, in the Magic Card Utils panel and in the card editor, now refuses an .svg file that holds JSON and a .json file that holds SVG, with the message "The name says JSON, but the file holds SVG." (or the other way round). This includes icon imports: a .json file that holds SVG used to import as an icon and is now refused. Save the SVG as an .svg file, or paste the code into the box, which has no name to check. File uploads in the image editor, Draw and icon effects take only .svg files and have no name check.

## 2026.10.12-beta.9 (2026-10-26)

### Changed
-   **One size for the side panel buttons.** The edge button that hides or shows a side panel is now the same size in both states, 28 by 72 pixels with an 18 pixel arrow, in the card studio, the animation studio, the SVG editor, the shape studio and the theme editor. It used to shrink to 24 by 56 pixels while its panel was shown. The module toolbar in the card studio now keeps clear of these buttons.

## 2026.10.12-beta.8 (2026-10-26)

### Added
-   **Library images.** Draw a picture in the image editor, save it to the Magic Card Utils library, and show it in an image module (Choose an image, Draw a new image, Edit image) or as a background layer, including per-state backgrounds. A YAML reference such as `image: mcu-image:<id>` holds the picture's address, not the drawing. See [Library images](documentation/images/README.md).
-   **Image editor.** Canvas sizes (1:1, 4:3, 16:9, 9:16 and custom up to 4096 pixels), the icon editor's tools, Main, Accent, theme and custom colours, linear and radial gradients, opacity, dashed outlines, text layers, a reference picture that is never saved, and an SVG import with a summary of what was removed. Import asks before it replaces a drawing with content. Parts the editor cannot change are kept as locked layers, and the lock says why it cannot be turned off. New text is white with a dark outline, and new closed shapes have a thin Accent outline. An "As on a card" toggle shows the colours a card uses, and shapes drawn over a reference picture start at 60 % opacity.
-   **Image size and limits.** A size meter shows how close a drawing is to 256 KiB. The library holds up to 200 images. Save as a copy, Duplicate and Export file work from the editor. A save that fails says why in the Save window: too big, a full library, a word the library refuses, or view-only.
-   **Missing picture.** An image module that points to a deleted library image shows "Picture not available" and keeps its layout.

### Security
-   **SVG from the library is sanitised.** Scripts, event handlers, embedded pictures, external links and cross-origin `url()` values are removed on import, on save and when a card draws the image.

## 2026.10.12-beta.7 (2026-10-26)

### Added
-   **Side panels hide.** The card studio, the animation studio, the SVG editor (pre-release), the shape studio (pre-release) and the theme editor (from 1024 px wide) get an edge button on each side panel that sits beside the canvas or preview. Press it to hide the panel: the canvas or preview takes the width. Press it again to show the panel with its selection and scroll position. Only the button stays at the window edge. Hiding a panel does not change the card or the undo history. See [Studio layout](documentation/studio/layout-and-toolbar.md#hiding-the-side-panels).
-   **Ctrl+\ (Cmd+\ on a Mac)** hides the side panels of the editor you are working in if any is shown, and otherwise shows again the panels it hid last. It also works from a text field.
-   **Hidden panels are remembered per editor, per device.** An editor opens with the panels hidden that you left hidden there. Storage that the browser blocks keeps every panel shown, without an error.
-   **A one-time hint** explains the button and the shortcut the first time an editor opens with a panel hidden.

### Changed
-   **Animation studio: Collapse layers is replaced.** The Collapse layers button and its icon rail are gone. Layers has the same edge button as the other panels. A Layers panel you collapsed before opens hidden once, with a hint, and the new setting is remembered from then on. See [Editor and preview stage](documentation/animation-studio/preview-stage.md#hiding-the-panels).
-   **Position offsets are one box.** The Positioning & layout section of the Design tab shows Top, Right, Bottom and Left as one four-side Offsets box with a Same on all sides link. Each side is still saved as its own key (`top`, `right`, `bottom`, `left`), so existing cards do not change. Searching the Design tab for Right or Left no longer finds a field; search for Offsets. See [Positioning and layout](documentation/design/positioning.md).
-   **An explicit Edit brings a hidden Inspector back.** Edit on a layer in the card studio shows the Inspector first. A plain click on the canvas does not.

### Fixed
-   **Sliders and number fields stay in step.** Dragging a slider in the editor moves its number field as you drag. Typing a number moves the slider. A value outside the range is pulled back to the nearest limit when you leave the field, in both.
-   **Colour picker hue and opacity can be retyped.** Clearing the Hue or Opacity field leaves it empty, so you can type a new value. A number above the limit (360 for hue, 100 for opacity) is shown at the limit at once. See [Picker windows](documentation/editor/picker-windows.md#colour-window).

## 2026.10.12-beta.6 (2026-10-24)

### Changed
-   **An active tab has no look of its own.** Without `tab_active` settings the active tab looks like the other tabs: no line under it, no accent text colour, no heavier weight in Underline and no Pills fill. Dashboards that relied on the old default marking will see the active tab blend in. Set the `tab_active` keys to mark it. The bar's own line stays. See [The active line](documentation/modules/layout/tabs.md#the-active-line).
-   **Border width, style and colour on a tabs module draw on the tab buttons.** In the Design tab and in the Hover view, the Border width, Border style and Border colour fields now style each tab button instead of the box around the tabs. A `tab_border_` key still wins over them. The `border` shorthand and the `border_top`, `border_right`, `border_bottom` and `border_left` keys stay on the tabs box. See [Tabs](documentation/modules/layout/tabs.md).
-   **Border width, style and colour take one to four values.** The Design tab shows them as a four-side field, like padding, and the colour of each side can follow an entity. See [Borders and outlines](documentation/design/borders.md).

### Added
-   **Bar border style.** `tab_bar_border_style` sets the style of the tab bar's line per side. A width of 0 or the style `none` removes the line in every tab style. See [The bar line](documentation/modules/layout/tabs.md#the-bar-line).
-   **Colour picker pipette and formats.** The colour popup picks a colour from the screen where the browser offers it, and switches the field between HEXA, RGBA, HSLA and OKLCH. Save writes the chosen format. The colour text field selects its text on focus. See [Design](documentation/design/README.md).

### Fixed
-   **Long colour and border lists are read up to a cap, in linear time.** A very long list of border values or entity colours no longer slows the editor or the card.

## 2026.10.12-beta.5 (2026-10-24)

### Fixed
-   **Typography on a tabs module styles the tab buttons.** The Typography section of a tabs module's Design tab (font size, weight, family, case, letter spacing, colour and the other typography keys) now applies to the tab buttons and no longer reaches the content of the tabs. Before, the font size, weight, case and letter spacing missed the buttons and landed on the content. The Tab bar section's `tab_` keys and the per-state fields still override it, and a font weight set in Typography replaces the underline style's own weights unless `tab_font_weight` is set. The Typography keys in the Hover view style the tab buttons too, and a gradient colour paints the tab labels (on the active pill, or a tab while its own background shows, the label uses the gradient's first colour). See [Tabs](documentation/modules/layout/tabs.md#tab-bar-design).

## 2026.10.12-beta.4 (2026-10-23)

### Added
-   **Every tab setting in each tab state.** The Active tab, Disabled tab and Hover states, and conditional design rules, take the same tab settings as the base look: text colour, background, border colour, border width, border style, corner radius, padding, font family, size, weight and case, letter spacing, icon colour, icon size, shadow and opacity. See [Tab states](documentation/modules/layout/tabs.md#tab-states).
-   **Tab borders and corners per side.** The tab border width, border style and border colour take one to four values, and so do the bar border width and colour. The tab corner radius takes one to four values, one per corner. The values follow the CSS shorthand order. The editor offers one value for all sides or four separate values, and the tab border style offers all ten border styles.
-   **Tab settings in groups.** The Tab bar section of a tabs module's Design tab has five collapsible groups (Bar, Text, Border, Icon and Effects). Each shows how many of its settings are set, and has a Reset button. Active tab and Disabled tab have their own reset, and a state field that is not set shows the Default value as a hint.
-   **Icon when active.** A tab can show a different icon while it is the active tab. Set Icon when active in the tab's settings, or `active_icon` in YAML. Without it the tab keeps its icon. See [Tab icons](documentation/modules/layout/tabs.md#tab-icons).
-   **Icon animation per state.** `tab_icon_fx` sets the device animation and line draw of the tab icons in the base design and in the Active and Disabled states. Hover does not use it.
-   **Tab animations per state.** Tab animations are set in the Tab bar section of the Design tab, with the same motion presets as a module. Each state has its own list (base, Active, Disabled and Hover), and each entry can play on the tab button, its icon or its label. The editor offers motion presets only, not particle, ring, seasonal or On tap ones. Reduced motion and the card's pause button stop them. See [Tab animations](documentation/modules/layout/tabs.md#tab-animations).

## 2026.10.12-beta.3 (2026-10-23)

### Added
-   **Studio Preview.** A Preview button in the Studio's top bar runs the card on the canvas as it runs on the dashboard. Taps, holds and double taps, sliders, switches and tabs act on the real entities, and animations play. The notice "Preview: actions are live" shows beside the button. Navigate and URL actions do not leave the editor: the card shows "Navigation is off in Preview" instead. The layers panel and the inspector are hidden, the canvas width buttons still work, and Undo, Redo and the mode switch are off. Press Preview again or Escape to return to editing with the same selection. Escape closes a dialog opened from the card first and never closes the Studio while Preview is on. Preview works in Form and YAML mode. See [Studio preview](documentation/studio/preview.md).
-   **Tab states.** A tabs module can style its active tab, the tab under the pointer and disabled tabs, in the base design and in conditional rules. Choose Active tab or Disabled tab in the Editing design for list. Each state takes text colour, background, border colour, font weight and opacity. The line under the active tab is now the active tab's border, so there is no separate indicator setting.
-   **Disabled tabs.** Tick the tabs that cannot be opened under Disabled tabs (`tab_disabled_tabs`). A disabled tab stays visible and dimmed, cannot be clicked, and arrow keys skip it. Rules add up: two rules can each disable their own tab, and a rule cannot enable a tab that the base design disables. Moving or deleting a tab moves the disabled list with it. See [Tabs](documentation/modules/layout/tabs.md#tab-states).

### Changed
-   **Active tab line and older keys.** The line under the active tab is the active tab's border. `tab_active_color`, `tab_active_background` and `tab_indicator_color` still work. The editor moves them into `tab_active` the first time you change the Active tab design. Two effects on existing cards: a card that combines an indicator colour with a tab border now gets a coloured border on all four sides of the active tab, and a card with a tab border loses the separate underline under the active tab.

### Fixed
-   **Tab fonts.** A Google Font chosen for the tabs now loads. A set tab font weight applies to the active tab in the underline style, where it used to stay bold.
-   **Float bar in the Studio.** The float bar no longer covers the selected module. It slides beside the module when there is room, and sits in a strip above the canvas when there is none.

## 2026.10.12-beta.2 (2026-10-23)

### Added
-   **Tab bar design keys.** The Design tab of a tabs module has a Tab bar section with 23 `tab_` keys. They style the bar, the tabs, the active tab, the icons and the switch between tabs: colours, lengths, font, bar position (top or bottom), alignment, icon position and the animation (none, fade or slide). A tabs module that uses none of them looks exactly as before. The keys apply to the base design only. Hover and conditional design rules do not change the tab bar. Copy design and Paste design carry them. See [Tabs](documentation/modules/layout/tabs.md#tab-bar-design).
-   **Tree drag and drop into and out of containers.** Drag any module in the structure tree onto a column of the card, a column of a row module, a horizontal, vertical or slider layout, a tab, or an empty container, at any depth. An indicator shows whether the module lands before, after or inside. Drag a module out by dropping it just above or below its parent, or on a column of the card. A container cannot be dropped into itself or one of its own children. One undo step reverts the move.
-   **Replace a module.** The module menu's Replace with… changes a module to another type of the same kind: a non-layout module to any other non-layout type, or a layout to another layout type. The layer name, actions, conditions and design carry over, and so does the icon when the new type supports one. Settings the new type does not support are removed, as are design keys of a part the new type does not show, and the status line says how many. Undo restores the original module.
-   **Move to… into and out of containers.** Move to… lists every container in the card under Into, labelled with its path. A layout child can also move Out to its parent. Use it when dragging is hard, for example on a touch screen.

### Changed
-   **Item menus are grouped into submenus.** A module's menu starts with Edit, Rename, Duplicate, Replace with…, Move up, Move down and Delete. Add (when it has an entry), Arrange, Design and Copy and paste open as submenus. Rows and columns group their copy and paste design actions, Hide on dashboard and Copy YAML under Design. A tab's Design submenu holds Hide tab on dashboard and Copy YAML. Card menus are unchanged. A submenu replaces the list, with Back at the top. See [Item menus](documentation/editor/item-menus.md#submenus).
-   **Escape goes back one level.** Inside a submenu, Escape, Left Arrow or Backspace returns to the list above, and focus returns to the row that opened it. Escape in the main list still closes the menu.

### Fixed
-   **Right-click on an unselected item.** In the Studio, right-clicking an item that was not selected yet opened its menu and closed it straight away. Selecting by right-click or long-press no longer scrolls the inspector into view, so the menu stays open and the item stays where it was.
-   **Column and tab names in Dutch.** Generated names such as Column 1 and Tab 1 in the structure tree, Move to… and the selection path are now translated.

## 2026.10.12-beta.1 (2026-10-23)

### Added
-   **Button icon and text controls.** A button's Design tab has an Icon & text section with 17 settings: icon position (left, right, above, below), content alignment, icon size and gap, icon colour, an icon background (circle or rounded), label overflow (wrap or truncate with a tooltip), label colour, font family, size, weight and letter case, and the state's position, colour and size. They are `design` keys (`icon_position`, `content_align`, `content_vertical_align`, `icon_size`, `icon_gap`, `icon_color`, `icon_background`, `icon_background_shape`, `label_overflow`, `label_color`, `label_font_family`, `label_font_size`, `label_font_weight`, `label_text_transform`, `state_position`, `state_color`, `state_font_size`), so the hover design and conditional design rules can change them too. Colours accept `entity` and `entity 30%`, not gradients. An icon colour set by Use entity colour still wins. A button that uses none of them draws exactly as before. An animation can now target `label` to play on the label alone.
-   **Card border, opacity, backdrop filter and margin.** The card's Design tab has Border width, Border style and Border colour, Opacity and Backdrop filter in Style, and Margin in Layout. The keys are `border_width`, `border_style`, `border_color`, `opacity`, `backdrop_filter` and `margin`. Design rules can change them and templates sync them. A shaped card draws its border along the shape. Anything you leave unset keeps the theme's value. Values are checked before use, so a value that isn't a plain length, colour, number or filter is ignored. Backdrop filter only shows through a see-through card background.

### Changed
-   **Colour length.** A colour value in a design or animation can now be up to 256 characters (it was 128), enough for nested `light-dark()` and `color-mix()` values.
-   **Card border width units.** The card's Border width field no longer offers `%`, which is not a valid border width.

### Fixed
-   **Button size.** Design > Size now resizes the button itself. Before, the box around it changed and the button stayed the size of its label. A button with no size set still fits its label. The label and icon are now centred inside the button.

## 2026.10.11 (2026-10-22)

Magic Card's card file, `magic-card.js`, is about 48% smaller: 156,490 B to 81,825 B with gzip, and 129,897 B to 69,894 B with Brotli. A plain card downloads nothing else.

### Loads only when used
-   **Animations** (`magic-card-anim.js`, `magic-card-anim-runtime.js`). The code that plays a card's animations loads only when a card has one, in any row, column, module, hover or conditional design. A card without animations makes no extra request. A card with one is drawn still first and starts moving a moment later. The animation library ships with this file too.
-   **Animation styles.** The keyframes and rules of the animation presets come with the animation code, so a card without animations downloads about 9.6 KB less with gzip (7.5 KB with Brotli). A card with animations gets them in the same frame its animation starts.
-   **Icons and icon effects** (`magic-card-svg-icon.js`). Icons from the library, your own SVG and icon effects load only when a card uses them. A card with plain Material Design icons keeps using Home Assistant's own icon and makes no extra request. The helpers that icon effects and value backgrounds share moved out of the card file too, about 2.1 KB less with gzip.
-   **Flow lines** (`magic-card-flows.js`). Cards without flows download about 8.8 KB less with gzip.
-   **Pause button** (`magic-card-pause.js`). Only cards that turn it on load it, about 0.7 KB less with gzip for the others.
-   **Pop-up cards** (`magic-card-popup.js`). About 3.5 KB less with gzip for cards that are not pop-ups.
-   **Sliders, spinboxes, dropdowns, lights, gauges and tabs** (`magic-card-controls.js`, and tabs in `magic-card-modules-extra.js`). About 5.7 KB less with gzip for cards without them.
-   **Rings, outline shapes and value backgrounds** (`magic-card-decor.js`). About 7.8 KB less with gzip for cards without them.
-   **Templates** (`magic-card-templates.js`). Only linked cards load the template source and merge, about 2.7 KB less with gzip for the others.
-   **Path parser** (`magic-card-path-core.js`). The animation, icon, decoration and slider-look features load it with their own file. Plain cards never fetch it, and the card file is about 3.2 KB smaller.
-   **Weather icon animation, clock and image modules** (`magic-card-modules-extra.js`). They load with the extra modules file, about 0.7 KB and 1.3 KB less with gzip in the card file.
-   **Moving backdrops** (`magic-card-layers.js`). Colour, gradient, pattern and picture backdrops draw without it. Only pan and zoom and camera snapshots load it.
-   **Editor texts** (`magic-card-editor.js`, `magic-card-i18n-labels.js`). Module names, icons, CSS property labels and options load with the editor. The Google Fonts family names load with the font picker.

### Behaviour changes
-   **Failed parts say so.** When a part of a card, such as the slider, a background or an animation, cannot be fetched, the card tries once more after two seconds. If that fails too, a short notice takes the place of the part, reading "{part} did not load. The rest of this card works.", with a **Try again** button. The card keeps trying in the background (after 30 seconds, 90 seconds and 5 minutes). If the card file and its parts come from different releases, the notice reads "Magic Card was updated. Reload the page to see this part." with a **Reload page** button.
-   **Shape cards wait for the decor file.** A card with an outline shape waits for `magic-card-decor.js` before it shows, so its content does not jump.
-   **Tabs cards can change height.** A tabs card grows with its content. To fix its height, set `grid_options.rows` on the card or `design.height` on the tabs module. A spinbox in an `auto` column may change width when it arrives.
-   **Empty boxes keep the space.** A slider, spinbox, dropdown, light, gauge or tabs module shows an empty box of its usual height until its file arrives, so the cards below do not move. Clock and image boxes keep their size while their file loads.
-   **Flow lines draw a moment later.** A card with flows shows its modules first and draws the lines a moment later, without moving anything.
-   **Template cards show their own settings first.** A card linked to a template shows its own settings until the template arrives. If the template cannot load, the card shows its own settings and the line "Template "name" couldn't be loaded. Showing this card's own settings."
-   **Pop-up cards wait for their file.** A pop-up card stays out of the layout until its file arrives, then opens if the page address already ends in its `#id`.
-   **A paused card stays paused.** A card you paused stays paused from the moment it appears, before the Pause button has loaded, and its flow lines stay paused when they load. If the button's code cannot load, the card stays paused and shows the usual notice. To play the card again, delete the stored `mc-paused:` entry in your browser. The card keeps room for the button from the first paint, so nothing moves when the button appears.
-   **Seasonal cards keep their room all year.** A card with `seasonal: auto` now keeps at least 20 px of padding at the top, right and left and 30 px at the bottom in every month, the most that a Christmas or Halloween decoration needs. Before, the card added that room only while a decoration showed, so the layout moved on 1 December and on 24 October. A card with the default padding of 16 px grows by 4 px at the top, right and left and by 14 px at the bottom; a card whose padding is already larger does not change. To keep less room, set `decorations: false`, name one scene, or switch Christmas and Halloween off in `calendar`. A seasonal animation preset on a module, row or column keeps its room the same way, whether or not its trigger is active. See [Seasonal scenes](documentation/yaml/schema.md#seasonal-scenes).

### Install and update
-   **Hashed files and compressed copies.** Most chunk files now carry a short hash in their name, and the release includes a `magic-card-manifest.js`. Each `.js` file has a `.js.br` (Brotli) and a `.js.gz` (gzip) copy next to it. Home Assistant sends the copy a browser accepts, so `magic-card.js` goes over the network as 69,894 B (Brotli) or 81,825 B (gzip). See [Manual](README.md#manual).
-   **Manual installs copy every file.** Copy every file of the release, including the `.br` and `.gz` copies. Replace or delete the three files of a name together.
-   **Old files after an update.** HACS does not delete the files of an earlier release. After a HACS update, the older hashed chunk files that the new release no longer uses can be deleted. Keep every file of the new release.

### Internal
-   **Build checks.** The build fails when a file, its compressed copies or the card file grows past its cap in `tools/size-caps.json`, and when a shared file holds modules other than the ones it lists.
-   **Smaller code.** Small colour, time and trigger helpers have their own files, Lit properties are declared statically, and the card defines its element once even if its resource loads twice.

### Fixed
-   **Entity picker window is wider.** The entity picker opened in the narrowest window size, so long entity names ran into the next row and long entity ids wrapped. It now opens in a wider window, ids stay on one line with an ellipsis and show in full on hover, and list rows grow with their content so wrapped names no longer overlap the next entry on narrow screens.

## 2026.10.11-beta.5 (2026-10-20, pre-release)

### Changed
-   **Pause button keeps a strip.** While `pause_button` is `auto` or `always`, the card keeps a 24 px strip at the button's edge (the top for a top corner, the bottom for a bottom corner). Under `auto` the strip stays even when no button shows, so the layout does not move when motion starts or stops. Cards with `auto` or `always` are therefore taller by that strip. `hidden` reserves nothing. See [Pause motion button](documentation/design/layers.md#pause-motion-button).
-   **Slider colours are checked.** Slider colour and Track colour, and the background of a basic slider, go through the same colour check as the slider looks. A gradient in design `background` no longer fills the track, so use a colour there.
-   **Swarm lines need travelling shapes.** A swarm key (random spacing, size variation or a known alternate shape) makes a wide look, which ends the line at the box by default, only when the shapes travel along the line. A swarm with `motion: pulse`, or with `dots: 0` and no spacing, ends at the icon again, as a thin line does. An unknown `shape_alternate` value does not count. Set [Attach to](documentation/flows/options.md#attach-to) to keep the box.

### Improved
-   **Arrow keys in the Pause button setting.** The editor's Automatic, Always and Hidden choices work as a radio group: Tab reaches the chosen one, and the arrow keys move between them.

### Fixed
-   **Pause button no longer covers modules** when the card has room for it. A card with very small padding and gap (for example `padding: 0`) can still be touched by the button.
-   **Flows editor header.** When both ends of a flow have the same name, the header shows where each end is, so the two can be told apart.
-   **Opacity values** are no longer written in exponent form. `#rgba` colours read their alpha correctly.

## 2026.10.11-beta.4 (2026-10-20, pre-release)

### New
-   **Flow lines attach to icons.** A thin line (solid, dashed, dotted, double rail or wave, or a flow with no look) ends at the module's icon, picture or dial, so two icons side by side in one row get a line between them. Icon, Button, Info, Light, Weather, Image, Camera and Gauge modules have one; other modules use their box. A wide look (tube, cable, neon, zigzag or swarm, meaning random spacing, size variation or an alternate shape) ends at the box by default. Choose Attach to, or set `from_anchor` or `to_anchor`, to pick either. See [Attach to](documentation/flows/options.md#attach-to).
-   **Motion group.** The pause button settings are in a Motion group in the card's Design tab, under Layout and open by default. Corner shows only when the button is shown.
-   **Preview pause.** The studio canvas has a Pause preview motion button that freezes the card while you edit. It is not saved and does not change what viewers see.
-   **Slider colours from an entity.** Slider colour, Track colour, End colour and Border colour accept `entity`, `entity N%`, `entity.<attr>` and `entity.<attr> N%`, for example `entity.rgb_color`. Pick the source in the new Colour from list. See [Slider](documentation/modules/controls/slider.md#entity-colours).

### Changed
-   **Existing flows change look.** A thin line without an attach key now ends at the icon, picture or dial of each module that has one. Wide looks keep the box, so they do not change. To keep the old look of a thin line, set Module box on that end, or add `from_anchor: box` or `to_anchor: box`.
-   **Pause motion button is off by default.** `pause_button` now defaults to `hidden`; set `auto` or `always` to show it. The editor lists Hidden as the default.
-   **Pause motion button.** One fixed name, "Pause motion", with a pressed state for screen readers, and a 44 by 44 pixel touch area on every pointer.
-   **Slider.** The failed-call message wraps instead of being cut off, and the slider is no longer marked invalid once the next change goes through.
-   **Light cards.** Flow lines and the slider fill are darkened where they would be under 3:1 contrast against a light card.
-   **Flows.** The moving highlight on solid and double lines fades out over corner arcs, so it no longer sticks out at sharp elbows.
-   **Background layers.** After Stop preview, focus moves to Play.

### Documentation
-   **Showcase cards.** Twenty new gallery cards (115 to 134) that combine flow looks, slider looks and background layers: ten for everyday rooms and energy, ten in sci-fi, fantasy, seasonal and retro styles. See [Showcase](documentation/gallery/showcase.md).

## 2026.10.11-beta.3 (2026-10-20, pre-release)

### New
-   **Flow looks.** Flows can draw dashed, dotted, double-rail, wave, zigzag, tube, neon and cable lines, with gradient and value colours, end markers, travelling shapes (including MDI icons), bubbles and an arrival effect. Five presets fill the options in one click: Energy, Water, Data, Heat and Neon. Each option is in the Flows tab, with an Undo for presets and Reset look. A flow without look keys looks exactly as before. See [Flow options](documentation/flows/options.md#look).
-   **Slider looks.** Sliders can have thin, pill, segmented and glass tracks, gradient and automatic fills, a handle of your choice, a value bubble, ticks, named stops and a track shape. The Big fill style shows the entity's icon and value, with live updates while you drag. Five presets: Minimal, Material, Neon, Glass and Big fill. A slider without look keys looks exactly as before. See [Slider](documentation/modules/controls/slider.md#look).
-   **Looks load when used.** A card without flow or slider look keys does not load the extra code.

### Documentation
-   **Complete dashboards.** Twenty-five complete dashboards in the gallery, five each for sci-fi, fantasy, western, steampunk and dystopian homes. Each is a sections view made only of Magic Cards, with a matching theme, install steps and a list of the entities it uses. See [Complete dashboards](documentation/gallery/dashboards/README.md).
-   **Gallery cards 81 and 82.** An operations console in a retro starship style, wide and phone-width.
-   **Layers.** A module can go behind the other modules (Behind others, `placement: background`) or sit at a fixed spot above them (On top, `placement: overlay`). Choose a position and offsets, plus opacity, blur, a blend mode and Darken behind text. Set it in the editor, or in YAML with `placement` and `layer`. See [Layers](documentation/design/layers.md).
-   **Card backdrop.** Up to four layers behind the card's content: pictures, gradients, patterns and colours. A picture can come from an entity, or change with the state of an entity. Camera pictures refresh on a timer, can pan and zoom, and show "Not updated" when they fail. See [Backgrounds](documentation/design/backgrounds.md#card-backdrop).
-   **Pause motion button.** A card with motion shows a button that pauses everything on it that moves. Set `pause_button` to `auto` (the default), `always` or `hidden`, and pick the corner with `pause_button_corner`. See [Pause motion button](documentation/design/layers.md#pause-motion-button).
-   **Low-power mode** for a card (`layers_low_power`). It drops blur, blend and pan and zoom on that card's layers.

### Improved
-   **Video background** can use the same placement options. Without a placement key it works as before. See [Video background](documentation/modules/advanced/video-bg.md).

### Existing cards
-   **Existing cards look the same**, with one change: a card that has motion now shows a Pause motion button, by default in its bottom-left corner. Set `pause_button: hidden` to remove it.
-   The pause button remembers a paused card in this browser's local storage, under a key that starts `mc-paused:`.

## 2026.10.11-beta.2 (2026-10-19, pre-release)

### New
-   **Card entity.** A card can name the device it is for with `entity`, and modules, rows and columns without an entity of their own use it. Set it in Card settings, General, in the new Card entity field. Change that one field to point the same card at another device. See [Card entity](documentation/card-entity/README.md).
-   **Entity field with three buttons** in the General tab of every module that takes an entity: Same as card (or Same as row, Same as column), Pick one and No entity. `entity: none` gives a module no entity even when the card has one. The field says where the entity comes from, and the attribute list shows the attributes of that entity.
-   **Share with tiles inside** on layouts (horizontal, vertical, row, tabs and slider layout, `share_entity: true`). The modules in a layout follow the layout's own entity before the card entity. `entity: none` on a layout gives every module inside no entity unless it picks its own.
-   **`entity` and `card_entity` in templates.** Text templates, Markdown content and `template` conditions can read the entity of their module and the card's entity. A template gets them only when it mentions them.
-   **Which device is this card for?** When you load a Magic Card Utils template into a card that has no entity, and the template has modules that would follow one, the confirmation asks for it. Magic Card Utils templates never hold the card entity, so one template fits any device.
-   The structure outline marks modules that follow the card or a layout, and flags a module whose inherited entity is the wrong kind of device.

### Security
-   **Lazy chunk location.** The animation studio and the theme editor now take the folder they load their extra files from out of their own module URL. They no longer read `document.currentScript` or an error stack, which a web page could influence. The folder is used only when it has the same scheme and host as the page. Otherwise the chunk fails to load and the usual retry message shows. Both files are ES modules, so load them with `import()` or `<script type="module">`.
-   **Stricter style filter for Markdown.** The `style` attribute in Markdown HTML is now read the way a browser reads it and rebuilt from allowed parts only, instead of being checked for forbidden text. A declaration that is not allowed is dropped on its own, and the rest of the attribute stays. Margins are stricter too: negative values, constants such as `pi` and `var()` are dropped, so `margin: var(--x)` is no longer kept, because a custom property can be negative. See [Styles in HTML](documentation/modules/content/markdown.md#styles-in-html).

### Fixed
-   **Template cards work for users who are not administrators.** A card linked to a template now shows it for every user, and follows later changes to the template without a reload. Before, only administrators saw the template, and the card sent requests that Magic Card Utils never answered. Those requests are gone. This needs Magic Card Utils 2026.10.11-beta.2 or newer: with an older one, administrators see no change, and other users see a notice instead of the template.
-   **A readable notice** appears on a template card when the template does not exist or could not be loaded: Template "name" wasn't found, or couldn't be loaded. The card shows its own settings below it. The notice is also available in Dutch.

### Improved
-   **Rows and columns can have an entity.** Card rows, card columns and the columns of a row module get the same Entity field as a module (Same as card, Pick one, No entity) and, with an entity of their own, the Share with tiles inside switch. Rows and columns the editor creates start with the switch on. The structure outline shows their entity. Existing cards are unchanged: a row or column without the keys uses the card entity as before.
-   **Pick a light** (or camera, weather source) in the editor hint opens the entity window filtered to that kind of device. In the editor preview, a tile that cannot use the card entity shows "Needs another device", and the Card entity field counts such tiles.
-   The Card entity field suggests entity ids while you type and saves only a real entity id, when you press Enter or leave the field. The Browse window lists the kinds of device your modules need first, and no longer changes size when you pick a row.
-   A Text module with a template has the Entity field, and its hint shows `entity` and `card_entity`.
-   The chosen segment of every segmented control in the editor is bold with an underline, not only a paler fill. A disabled Same as card looks disabled. The tab stop of the entity buttons follows the arrow keys, and the device question of a template load takes the focus.
-   The structure outline shows "No entity" under a module set to none, and no "Same as card" under a static text.
-   A **toggle** action on an entity that comes from the card or a layout only toggles lights, switches, fans, input booleans, automations and humidifiers. For a lock, a cover or anything else it opens the more-info dialog instead. A slider that follows a cover still moves the cover.
-   Camera, Weather, Forecast, Light and Dropdown modules follow the card entity only when it is the right kind of device. Otherwise they show nothing, and the editor says why in plain words. The Custom card module never follows the card entity.
-   **Notices no longer resize the canvas.** In the SVG editor, warnings, banners and the result of an action (with Undo) now float over the canvas instead of pushing it smaller. Dismiss buttons and screen reader announcements work as before.
-   **Shape editor, Draw and Messages tabs.** The left sidebar has a Draw tab and a Messages tab. Warnings and errors are one coloured line each in Messages, with a button that opens the full message in a window. The tab shows a count, and a screen reader announces a new message.
-   **SVG editor, Start from > An icon** uses the same icon picker as the card editor, with search, Material Design Icons, icon packs and your own icons. Pick an icon, then choose Use this icon.
-   **SVG editor, Polygon tool** asks for the number of corners (and the star settings) in a window. The canvas keeps its size. Enter confirms. Cancel and Escape go back to the tool you had.
-   **SVG editor layers:** the layer buttons are smaller and always fit on one line.

### Existing cards
-   **Existing cards are unchanged.** A card without an `entity` key renders as before. A layout that already has an `entity` keeps it to itself until you switch on Share with tiles inside; layouts you add in the editor from now on start with it on, and pasting or duplicating a layout keeps its YAML as it was.
-   `entity: none` had no meaning before, because entity ids always contain a dot.

## 2026.10.11-beta.1 (2026-10-18, pre-release)

A pre-release: an SVG editor, a shape editor, a preset library with file export and import, and a smaller main file. HACS shows it only when you turn on Show beta versions. Each release has 23 files.

Magic Card Utils is needed for the editors and the library. The editors need Magic Card 2026.10.11-beta.1 or newer.

### New
-   **SVG editor** in the Magic Card Utils panel (Library, New icon). Draw and edit icons on a 24 x 24 grid, with a pixel grid and a safe area, numeric fields, snapping, alignment, boolean operations, and handles of at least 24 px on touch screens.
-   **Layers with groups.** Groups nest up to four levels. Drag a layer to reorder it or drop it on a group, or move it from the row menu and the keyboard. A drag is one undo step.
-   **Dual-tone icons.** Turn on Dual-tone to paint some shapes in the card's accent colour. The saved icon keeps both outlines.
-   **Path tools:** outline stroke, offset path, simplify, join, split and knife, each with a preview before you apply it.
-   **Import and export of SVG,** including files from Lucide, Tabler, Feather and Heroicons. Icons are cleaned on import: scripts, links to other files and unsupported parts are removed, and a warning lists them.
-   **Copy as HA path** and Copy SVG. Save an icon to the library, and use it in a card as `icon: mcu:<id>`.
-   **Shape editor** in the Magic Card Utils panel: corners with their own type and size (round, squircle, bevel, scoop, notch and square), a free outline with the pen, start from a preset, combine shapes, grid and snapping, previews at the size of a tile, a row and a wide module.
-   **Custom shapes on cards** with `shape: custom`: corner options in YAML, free outlines with `points`, and saved shapes with `ref`. The border, ring, shadow and value background follow the outline.
-   **Presets library.** My animations and My theme presets are in the Magic Card Utils library. Export an animation, theme, shape or icon to a YAML or JSON file, and import it on another Home Assistant. Imports are checked item by item, and a theme that points to another website warns you before you confirm.
-   **Animation studio layers.** Hide, solo and lock a part in the preview (the file is not changed). Keyframe parts and shapes are one stack. Particle layers show Particles and Card content, with Particles above or below the card. A particles animation can have several emitters, each in front of or behind the card.
-   **Magic Card Utils tabs:** Library, Shapes and Editors.
-   **Languages:** English (UK), English (US) and Dutch. Magic Card follows the language in your Home Assistant profile. The Dutch text is machine-assisted.
-   **Accessibility:** built to WCAG 2.2 AA, with keyboard routes for every drag and labelled fields.
-   **Shapes tool and Combine with** offer 19 shapes: rounded rectangle, triangle, arrow, chevron, plus, heart, speech bubble, drop, leaf, shield, cloud, ticket, tab, tag, circle, ellipse, semicircle, star and hexagon.

### Improved
-   `magic-card.js` is 472 KB, down from about 680 KB. The rarely used parts (the slider, seasonal scenes, markdown, camera, video, weather, forecast, graphs and custom-card modules) are separate files that a dashboard loads only when a card uses them. The cards look and behave as before.
-   Editor messages name the version you need when your Magic Card is too old. After an update, a page that still runs the old files shows "Magic Card was updated, reload the page" once, instead of failing.
-   **Accent color** also paints the Accent shapes of a saved icon (`mcu:`), not only a custom SVG.
-   The icon field opens the icon picker on a tap. The browse button is 44 px on a touch screen. Picking a saved icon shows one collapsed **Advanced** line for the copy setting, so the window does not jump.
-   The **Library** in a card compares an import with that card. Repeated animation names get a number on import, such as "Pendulum 2". The Preset select has a **This card** group for the card's own animations, and a repeated name shows its id.
-   Importing a theme file says **Added N to My presets**, and says that a preset is not a theme yet. A single item has an **Open as new theme** button. When the include lines are missing, the result says that saving needs one setup step in Home Assistant, and that Try on dashboard works without it.
-   A theme value that loads a file from another website is marked **Contacts another website**, on the preset card and above the variables in the editor.
-   **Copy as HA theme** copies a single theme to the clipboard as Home Assistant theme YAML.
-   The shape list in the shape editor refreshes after a save, so a new shape appears without a reload.
-   The Markdown module adds the JavaScript features that tables and reference links need on older browsers, such as Chromium 85 to 91 in an older Android WebView.
-   The Christmas border lights no longer keep a slow tablet busy. They fade five stacked layers instead of recolouring every bulb, so a card with the Christmas scene idles at about 0.4 % CPU on a 4x throttled Chrome, down from 99 %.
-   Markdown, weather and forecast modules reserve their height before they load, so the page no longer jumps when the card finishes loading. Seasonal cards no longer shift when the seasonal files arrive.
-   The five-day forecast fits a 331 px column. The days shrink from 60 to 44 px before the row scrolls.

### Changed
-   Each release has 23 files, up from 10. HACS installs them with the card. With a manual install, copy all 23 to the same folder, then hard refresh.
-   SECURITY.md: the scope covers importing preset, theme, animation, icon and shape files, and it describes the project's status.
-   The documentation has new folders for the SVG editor, the shape editor, presets, Magic Card Utils, languages and accessibility, and a Layers page for the animation studio.

### Known limitations
-   A saved icon appears as a one-colour silhouette in Home Assistant's own cards.
-   A new icon appears in Home Assistant's icon picker after you reload the page.
-   The Home Assistant companion apps are not verified with the editors and the new features yet.

## 2026.10.10 (2026-10-18)

The Sci-fi & fantasy presets no longer look alike. A release still has ten files.

### Changed
-   Eight Sci-fi & fantasy presets got their own colours so they no longer look alike: Orbital Smelter, Ashen Keep and Crimson Pines were nearly the same, and Dust Duel, Ochre Basin, Candlelit Cloister, Silverleaf Glade and Frontier Freighter were close to their neighbours. Within the group, no two presets share a similar header colour in light or in dark. The preset ids and names are unchanged. Themes you already created from these presets stay as they were.

## 2026.10.09 (2026-10-17)

Twelve sci-fi and fantasy presets for the theme editor, twenty sci-fi and fantasy cards in the gallery, and a fix for imported themes that lost their light and dark values. A release still has ten files.

### New
-   The theme editor's create dialog offers 57 presets, up from 45. The 12 new ones form a third group, Sci-fi & fantasy: Amber Console, Ashen Keep, Candlelit Cloister, Cobalt Prism, Crimson Pines, Deep Survey, Dust Duel, Frontier Freighter, Neon Rain, Ochre Basin, Orbital Smelter and Silverleaf Glade.
-   Show has a Sci-fi & fantasy option. The group shows the same notice as on the theme examples page.
-   When a search finds no preset, the dialog suggests five words to try: sci-fi, fantasy, neon, desert and forest. Each one finds presets under All and under Sci-fi & fantasy.
-   The theme editor's preview shows the theme's accent colour as a small chip labelled Accent, in the Controls card.
-   The documentation gallery has 20 new sci-fi and fantasy cards (61 to 80), so it has 80 cards in all. Five of the new cards use the new presets, and 15 are animated.

### Fixed
-   Imported themes keep their light and dark values in the theme editor. The Light and Dark switch works again, and the picker labels such a theme "Light + dark" instead of "Same in light and dark".
-   Files that Home Assistant can read but the editor cannot, such as files with YAML anchors and aliases (`&anchor` and `*alias`) or files with several themes, now open from Home Assistant's copy of the theme. The file itself does not change and stays read only.
-   Try on dashboard follows light and dark, also while you look at a dashboard with the editor closed. When Home Assistant switches mode, including Auto when the system switches, the dashboard switches too and uses the theme's own values for that mode.
-   Try on dashboard shows Home Assistant's default for the current mode (light or dark) for every value your profile theme sets and the trial theme does not, so values from your own profile theme no longer show through. Values without a Home Assistant default are unset.
-   Try on dashboard tells the browser which mode it is in, so form controls and scrollbars match the theme.
-   Try on dashboard keeps imported values as the file has them. An imported gradient background shows instead of being dropped, and card-mod values still reach the dashboard.
-   Copying an installed theme uses its file whenever the file holds values, also for a file in a subfolder. If neither the file nor Home Assistant has the values, the editor shows an error instead of an empty copy.

## 2026.10.08 (2026-10-17)

Maintenance. The card itself does not change.

### Changed
-   The PayPal link in the README goes to <https://www.paypal.biz/therealmcsparrow>.
-   `THIRD-PARTY-NOTICES.md` is generated from the licence files of the bundled packages (`npm run notices`) and no longer lists versions, so it stays correct when packages are updated. Each release's `sbom.cdx.json` has the versions.

### Project
-   Size budgets: `magic-card.js` may be up to 688,067 bytes (B1 + 8,192), about 4 KB more than today. Each lazy file may grow 5 % over its 2026.10.07 size.
-   The release workflow fails when the committed `dist/` files differ from a fresh build. Validate shows a warning for it on every push.
-   The SBOM tool is a pinned development dependency, so the lockfile covers it.
-   `.gitattributes` keeps LF line endings on every OS, so a build on Windows no longer shows `dist/` as changed.

## 2026.10.07 (2026-10-17)

The theme editor starts from 45 presets now, in two groups, and the documentation has a screenshot of each one.

Each release now has ten files. One is new: `magic-card-theme-presets.js`, which the create dialog loads when it opens. HACS installs it with the card. With a manual install, copy all ten to the same folder, then hard refresh.

### New
-   The create dialog of the Themes tab lists 45 presets, up from 5. Original has 25: the five from 2026.10.06 and 20 new ones, such as Glass Aqua, OLED Green and Summer. Inspired by has 20 palettes, such as Nord, Dracula, Solarized and Tokyo Night, each with its own colour values.
-   Search presets by name, palette or style, and use Show to switch between All, Original and Inspired by.
-   Every light and dark mode passes 4.5 to 1 for text, secondary text, text on the primary colour and the state colours.
-   [Theme examples](documentation/themes/examples/README.md): a screenshot of each preset, light and dark side by side.

### Improved
-   The presets load the first time you open the create dialog. While they load, the dialog says so. If they cannot load, it says so and offers Try again. Blank and An installed theme work in every state.
-   The OLED presets note that dark mode is pure black, and the glass presets note that blur and transparency can be slow on old tablets.

### Changed
-   Maintenance, no change to the card: `magic-card.js` keeps its size. js-yaml 5.5.0 and webpack 5.112.0, plus patch updates to the development tools. The editor and studio files grow by 795 bytes each.
-   Releases include `sbom.cdx.json`, a list of the packages in the card in CycloneDX format, and `THIRD-PARTY-NOTICES.md` with the licences of the code bundled into the card (lit, marked, js-yaml, swiper and Material Design Icons).
-   The README shows the Magic Card logo, which HACS shows on the card's page.
-   Removed sortablejs, which nothing used.

### Project
-   The Validate workflow passes again. It no longer runs Hassfest, which only applies to integrations. It now checks lint, the build, the size of every dist file and the production dependencies for known vulnerabilities.
-   Workflows run on Node 24 and pin every action to a commit.
-   SECURITY.md explains how to report a vulnerability privately. Dependabot checks npm packages and workflow actions once a month.

## 2026.10.06 (2026-10-17)

A theme editor for Home Assistant themes, in the Themes tab of the Magic Card Utils panel. Edit a theme with a live preview beside the fields, and try it on your dashboard before you save it.

Each release now has nine files. One is new: `magic-card-theme-editor.js`, which the Themes tab loads. HACS installs it with the card. With a manual install, copy all nine to the same folder, then hard refresh. The Themes tab needs Magic Card Utils 2026.10.08 or newer.

### New
-   Themes tab in Magic Card Utils: create a theme from blank, from one of five presets (Paper, Midnight OLED, Ember, Contrast and Frost) or as a copy of an installed theme. Save writes `/config/themes/<name>.yaml` and reloads Home Assistant's themes, so the theme shows in its list without a restart.
-   Variables in groups: the Home Assistant groups, a Magic Card group, and groups for Tile card, Mushroom, Bubble Card, Ultra Card and button-card. A group whose card is not installed stays editable and says that its preview is not available.
-   Light and dark modes with a shared base. Preview each mode, and get a warning when a value has no effect in a mode.
-   Colour, size and gradient fields, and a raw row for any variable name.
-   Try on dashboard shows the draft in this browser tab, with a Revert bar. Nothing is saved until you save.
-   Use this theme selects the saved theme for your user.
-   When the include lines are missing from `configuration.yaml`, the Themes tab shows them. Saving waits until they are in place. The editor never edits `configuration.yaml`.
-   Read-only theme files open for viewing, with Copy to edit.

### Known limits
-   Comments are removed when a file is saved. The editor asks once before the first rewrite.
-   A file that uses YAML aliases (`&anchor` and `*alias`) is read only.
-   Magic Card's own `--mc-*` variables cannot be themed yet. The card sets them itself.

## 2026.10.05 (2026-10-17)

Card design rules, gradient colours, new ring starts and dropdowns for the long lists.

### New
-   Card Design tab: "Editing design for" picks Default, Hover or a rule, as it does on modules. A rule can change the card's ring, shape, shape options, value background and seasonal scene while its conditions match. The rules are the same as the conditional appearance rules on the Conditions tab, and that tab still lists them.
-   Gradients: a colour field offers Solid or Gradient. Choose a linear or radial gradient, an angle for a linear one, and two to five colours. Gradients work on card and module backgrounds, the value background fill, the ring stroke, the icon colour and the text colour of text, info and markdown modules.
-   Gradient limits: ring and icon gradients are linear only. Ring thresholds, the track and the glow, the sparkline and the wave stay solid. A background gradient is not offered with a background image or with a background that is not a gradient. Where a browser cannot draw a gradient on text, the text shows its first colour. See the [gradients page](documentation/design/gradients.md).
-   Ring start has eight positions: Top, Top right, Right, Bottom right, Bottom, Bottom left, Left and Top left. Top right, Bottom right and Bottom left are new, and "Top center" is now "Top". Saved cards keep working.
-   The animation studio's Part presets are one Preset dropdown instead of a grid of buttons.

### Improved
-   The card Design tab is grouped under headings, like the module design panel. Shape and Seasonal are dropdowns. Value background type and Ring mode stay as buttons.
-   Hover on the card moved into the "Editing design for" picker.
-   Existing solid colours and existing YAML load and render unchanged.

## 2026.10.04 (2026-10-17)

Each release now has eight files. Three are new: `magic-card-editor.js`, `magic-card-particles.js` and `magic-card-preset-catalogue.js`. HACS installs them with the card. With a manual install, copy all eight to the same folder. After the update, hard refresh once.

### New
-   Particles in the animation studio can do much more. Pick Baked loop (the default) or Live simulation. A baked loop works out every particle's path once and plays it as CSS, so a dashboard runs no script for it. Live simulation runs the physics on every dashboard that shows the card, only while the card is on screen. The studio warns that it uses more CPU, especially on wall tablets.
-   Seven new particle flows: Fountain, Explode and fall, Wave, Swirl, Zigzag, Rain (with a Wind angle) and Fireflies, next to Fall, Rise, Drift, Burst, Orbit and Spiral.
-   Eight built-in particle shapes (Circle, Square, Triangle, Star, Heart, Ring, Streak and Spark) next to an icon, an emoji or your own SVG. Mix up to four shapes and give each a weight. The editor shows the share each one gets.
-   Ranges for particle speed, opacity, spin, start delay and lifetime: each particle picks its own value between From and To. A seed makes the loop the same every time, and Shuffle picks new random paths.
-   Physics for particles: gravity in any direction, drag and turbulence. Particles can collide with the floor, the ceiling, the left and right edges and the card's icon or text box, with a bounce setting. Child particles spawn on a collision or at the end of a particle's life.
-   Particle speeds are in % of the card's shorter side per second, so a motion looks the same on wide and narrow cards.
-   A particles animation exports as an animated SVG of its baked loop. Icon and emoji particles export as dots.
-   46 catalogue presets in seven themes: Fire & heat, Cleaning, Christmas, Halloween, Valentine, Home automation, and Light & colour. Among them are snow that settles on the floor, a leak that drips and splashes, soap bubbles that pop and New Year fireworks. They are in the animation studio and in the card editor's Preset list. A pick in the card editor stores the animation in the card as `cat-<id>`, so it plays without Magic Card Utils.
-   Customise a preset in the animation studio shows every preset as a tile with a live mini card. Search also matches the group names. Tiles off screen stay still, and tap presets and heavy scenes play on hover or focus.
-   The icon library grows from 107 to 192 animations: more lights, fire, cleaning, home automation, seasonal icons, and new Animal, Household, Maker and Seasonal categories.
-   A Style switch in the icon picker's Animated icons tab plays library icons Quiet (one part moves, a little and slowly), Living (the full animation) or Glow (a soft outline round the lit part that follows light and dark themes).
-   Item menus on the card, rows, columns, modules, layout children, tabs and row-module columns. Open them with a right-click, a long-press, Shift+F10 or the Menu key, in the tree and on the Studio canvas. New items: Copy YAML, Rename, Hide on dashboard, Copy module, Paste module after, Wrap in layout and Reset to template.
-   Hide on dashboard sets `hidden: true`: the dashboard leaves the item out and the editor shows it dimmed. Rename gives a row, column or module a layer name (`editor_name`) that only the editor shows.
-   A copied module pastes into another card too. Its YAML also goes to the system clipboard.
-   The Studio canvas width follows the dashboard view: Narrow (400 px) for masonry, the card's share of a section for sections, Wide (800 px) for a sidebar view's main column, Panel for a panel view. Narrow, Wide and Panel replace Phone, Tablet and Desktop, and Match view returns to the detected width.
-   The Light module has an optional Icon field with the full icon picker, Animated icons included. Empty keeps the light's own icon.
-   The documentation has a [card gallery](documentation/gallery/README.md) of sixty cards with screenshots and YAML, twenty of them animated.

### Improved
-   Dashboards load about 46% less code. The card editor is now a separate file, `magic-card-editor.js`, that loads when you edit a card or open the animation studio. `magic-card.js` shrinks from 1.25 MB to 0.68 MB.
-   If `magic-card-editor.js` cannot be loaded, Home Assistant opens its YAML editor for the card. If the editor file and `magic-card.js` come from different versions, Home Assistant opens the YAML editor and the browser console asks you to reload the page.
-   The particle physics live in `magic-card-particles.js`, which only cards with such a particle animation load. While it loads, or when it is missing, the card plays a simpler version of the layer.
-   The catalogue presets live in `magic-card-preset-catalogue.js`, which only the card editor and the animation studio load.
-   In the Studio, the inspector's header and tabs stay at the top while its settings scroll. A tab switch starts the settings at the top.
-   The Animate icon button and panel are gone from the Design tab and the Studio. Pick animated icons in the icon picker's Animated icons tab, and split an icon into parts or export an animated SVG in the animation studio. Cards that use an animation made with Animate icon keep playing it.
-   Particle animations made with 2026.10.03 open and play unchanged.

### Fixed
-   Save to template left the card's overrides in place. After a successful save the card now shows In sync. Template animations hidden on the card stay hidden, and a failed save changes nothing.
-   Security camera in the icon library: only the camera head pans now. The wall mount stays still.

## 2026.10.03 (2026-10-16)

### Fixes
-   Animate icon: a This icon animation made on a module that held an edited copy of a My animations animation was stored under the copy's id, so the panel showed no parts and the next icon change removed the animation. It now gets its own id and follows the icon. A library animation picked over such a copy also gets its own id, and Make a copy of such a copy stays a My animations copy.

## 2026.10.02 (2026-10-16)

### Editor
-   Animated icons tab in the icon picker of the Icon, Info and Button modules: a grid of moving tiles with search and a domain filter, with My animations (your saved icon animations from Magic Card Utils) above the 107 built-in ones. A click sets the icon and its animation in one undo step. A built-in animation is stored in the card and plays without the integration. An animation from My animations is linked by id, so later edits in the studio reach the card. One animated icon per module: a new pick replaces the old one, and entries you added in the Animations list are left alone. The Light module keeps Animate icon.
-   On a card linked to a template, a picked animated icon is kept as the card's own change.
-   Animate icon shows the same tile grid in place of the Library chips. Applying an animation from My animations links it like the picker does. It shows as Applied with "From My animations." and a Remove button, and as Changed, not applied once you edit it. A link to an animation the library no longer has says so.
-   A library animation is removed when the module's icon changes in the editor, including Clear, the entity's icon or an own SVG. This happens once the icon has stayed the same for about a second and Home Assistant knows the new icon, so a half-typed id never removes it. One undo brings it back. An embedded copy of a linked animation stays in the card.
-   Removed the Edit in animation studio link from the Animations list and the Open in animation studio link from Animate icon. They left the card editor and lost unsaved changes. To edit an animation further, import the card's YAML in Magic Card Utils.

## 2026.10.01 (2026-10-16)

The first public release. It covers everything built since the initial build.

### Editor
-   Pane editor with a structure outline, an inspector (General, Conditions, Design and Actions tabs), Form and YAML modes, undo and redo, and a template bar.
-   Studio: a full-screen editor with Layers, a clickable live canvas that colours the selection by level, device widths, a floating bar and keyboard shortcuts.
-   Add rows, columns and modules from the outline and from Layers, with an options menu per item. Picker windows (entity, icon, service, media, card, template, colour, font, attribute, module selector) open in the top layer and fit on phones.
-   Column layouts as presets or per-column widths (`fr`, `%`, `px`, `auto`) in `column_widths`, with drag handles on the studio canvas that snap, work with the arrow keys and count as one undo step.
-   Layout modules (horizontal, vertical, slider, tabs, row) are managed in the tree. A tabs module shows one item per tab, a row module one item per column, each with its own Add module row and menu. The row module has the layout presets, column widths and per-column General, Conditions and Design of a card row.
-   Copy and paste a design, and reset buttons for design fields and sections.

### Modules
-   25 module types for content, controls, layout and advanced use: info, icon, text, markdown, image, button, light, bar, gauge, graphs with real history, clock, weather and forecast, camera with a live stream option, slider, spinbox, dropdown, separator, layout modules, an embedded custom card and more.
-   Tap, hold and double-tap actions on modules and rows, including opening and closing pop-ups. Toggle calls `turn_on`, `turn_off`, `open` or `lock` the way Home Assistant does.
-   Display conditions on cards, rows, columns and modules: state, attribute, time and Jinja templates. Templates also work in Text and Markdown.
-   Pop-up mode: a card as a bottom sheet or dialog, opened by a `#hash`, an action or an entity state.

### Design
-   A Design panel for every row, column and module, grouped under Layout, Style, Effects and Advanced: spacing, borders and border length, typography with Google Fonts, backgrounds and video backgrounds, flexbox, grid, hover, custom CSS, entity colours and conditional design rules.
-   Shapes: squircle, pill, circle, hexagon, octagon, notch, ticket, wave and blob, with the border, ring and flow-line anchors following the shape.
-   Value backgrounds: a tank that fills to an entity's value, or a history sparkline behind the content.
-   Rings: a value ring or an animated ring that follows the exact border radius. A ring on a `timer` entity counts down live, and `min` and `max` can come from an entity.
-   Flow lines between any two modules, with moving dots or dashes whose speed follows an entity value, for energy flows such as solar to house to grid.
-   Seasonal scenes for the four seasons and for Christmas, New Year, Valentine, Easter and Halloween, picked by date or by hand, or driven by a `weather` entity and `sun.sun`, with border decorations that follow the shape.
-   Icon effects on every module icon: liquid fill, device animations, line draw, morphing state icons, solid, duotone, gradient and value colours, animated weather icons, your own sanitised SVG, and third-party icon packs.

### Animations
-   More than 100 animation presets on the card, rows, columns and modules, several per element, with play conditions on any entity or on tap.
-   Animate icon in the Design tab of icon, button, info and light modules: pick an animation from a library of 107 animated icons, or split the module's icon into parts and give them one-click presets. The card stores the result in its own `custom_animations`, so it plays without any integration. A split of the module's own icon follows the icon when you change it in the editor.
-   Animation studio, in the Magic Card Utils sidebar panel: keyframes on a timeline with zoom, snapping and per-key easing, particles, path motion and sequences, with a live preview on a real Magic Card and a shared library.
-   Icon animations in the studio: split any icon into parts, group and merge them, set pivots, and animate each part with its own track, draw-on and motion path. A Part presets panel offers nineteen one-click presets, and the pivot handle shows and moves the pivot a preset uses.
-   Drawing tools for extra shapes, card parts (name, state, icon and background as separate targets), state clips and value bindings driven by an entity.
-   Save as icon exports an edited icon as SVG, and Animated SVG exports a looping file with CSS keyframes and a SMIL fallback.
-   Cards use library animations as `preset: custom:<id>` and update live when an animation is saved. YAML mode can copy a card with its animations embedded.

### Templates
-   Save a card as a template and link other cards to it. Linked cards keep local overrides per key, with sync indicators and a reset to the template's value.
-   A template's `custom_animations` reach linked cards, merged by id. A card can replace one with its own version, hide single ones with `hidden_animations`, or use only its own by listing `custom_animations` in `not_synced`.

### Files and requirements
-   `magic-card.js` must be loaded as a JavaScript module (`type: module`). HACS and the Home Assistant resource editor add it that way.
-   The release also attaches `magic-card-anim-runtime.js`, `magic-card-animation-studio.js`, `magic-card-icon-library.js` and `magic-card-icon-animator.js`. HACS installs them next to `magic-card.js`; with a manual install, copy them there too. Dashboards load the runtime only for animations that need it and never load the studio, library or animator files.
-   The animation studio needs the [Magic Card Utils](https://github.com/therealmcsparrow/magic-card-utils) integration, version 2026.10.04 or newer.
-   The icon shapes of the icon library come from Material Design Icons by Pictogrammers (Apache License 2.0).

## Initial build (2026-05-25)

The first version of the card.
