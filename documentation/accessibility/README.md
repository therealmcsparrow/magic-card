# Accessibility

Magic Card is built to WCAG 2.2 AA. This is the standard we build to. We have not yet measured every screen against it, so do not read this page as a certificate. If you find a problem, tell us.

## What the editors do

-   **Every drag has a keyboard or form route.** You can reorder layers from a row menu, move a shape with the numeric fields and the arrow keys, and pick an icon with a file or a paste box. A drag is never the only way to do something.
-   **Choices that write to your YAML are made on purpose.** The Entity field of a module (Same as card, Pick one, No entity) moves the focus with the arrow keys and picks with Space or Enter. A status message announces what changed. See [Card entity](../card-entity/README.md#keyboard-and-screen-readers).
-   **Targets are large enough.** Handles and rows in the SVG editor and the layers list are sized to at least 24 x 24 CSS pixels. On touch screens the Entity field's buttons and picker are 44 px high.
-   **Focus is visible.** A focused control has a visible outline.
-   **Labels on every field.** Every value in the shape editor and the SVG editor is a labelled field.
-   **Changes are announced.** When a layer moves, the new position is announced. An import summary is announced when it appears.
-   **Colour is not the only signal.** The tone of a layer in the SVG editor is shown as text.
-   **Reduced motion.** Cards turn off most movement when the system asks for reduced motion, and the animation studio has a reduced-motion preview. A flow line becomes a static line with an arrow. Particle layers fade in over 200 ms. With reduced motion, particle simulations appear at once and other particle layers stay hidden.
-   **Your language.** The editors follow the language of your Home Assistant profile. See [Languages](../languages/README.md).

## Right to left

No right-to-left language ships with Magic Card. The editors and the card are being prepared for one: the editors, the card sliders and the card rings mirror when the direction is right to left, and an icon flips only if it is flagged to. Your card layout is never mirrored.

On a mirrored horizontal slider the Left and Right arrow keys swap, so Right still moves towards the end you read. Screen readers hear the same values as before. See [Slider](../modules/controls/slider.md#right-to-left) and [Ring](../design/ring.md#right-to-left).

To try this, turn on the Pseudo RTL switch in the animation studio. It uses made-up text and is a test aid, not a language. It has been looked at in a desktop browser only.

What has not been done:

-   No screen reader has been run on a right-to-left layout.
-   No phone or tablet has been tried with it.
-   No right-to-left translation has been read by a native speaker.

See [Animation studio](../animation-studio/README.md#right-to-left) and [Translating](../translating/README.md#legal-text).

## What to check on your own device

Some things we have not tested with real hardware:

-   Long press and drag on an iPad, in the layers list.
-   Screen reader output for the particle layers list. It works in tests, but a screen reader check is still due.
-   Older Android WebViews, for custom shapes and markdown. See [Custom shapes in cards](../shape-editor/custom-shapes-in-cards.md#older-browsers-and-older-tablets).

## Known limitation

The backdrop layer sliders use Home Assistant's own slider when your version provides one. Its focus ring is Home Assistant's grey, which has a contrast of about 2.8:1 on white. WCAG 2.2 asks for 3:1. The ring comes from Home Assistant and Magic Card does not change it.

## Report a problem

Open an issue on [GitHub](https://github.com/therealmcsparrow/magic-card/issues). Say which page, which control and which device or browser you used.
