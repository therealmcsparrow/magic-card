# Try, revert and use

Saving a theme writes a file. Trying a theme shows it on your dashboard without saving anything. Using a theme selects it for your user. This page covers all three.

## Try on dashboard

**Try on dashboard** applies the theme you are editing to Home Assistant in the current browser tab. Nothing is saved, and other tabs, other browsers, other devices and other users keep their own theme.

1.  Click **Try on dashboard**. The button shows as pressed, the header shows a trial chip, and a bar appears at the top of the page.
2.  Change values in the editor. The dashboard follows each change.
3.  Go back to the editor, or leave the editor and look around the dashboard. The trial keeps running until one of the ends listed below.

The bar shows the theme's name and the **Revert** button. Narrow windows show a shorter bar with an **Editor** button. The bar can be moved to the top or the bottom of the screen, and the editor remembers where you put it. When the bar would cover the field you focus, the page scrolls so the field stays in view.

Press Escape, or click **Revert**, to end the trial and show your own theme again.

### When a trial ends

A trial ends when:

-   you click **Revert**, or press Escape,
-   you discard the draft in the editor,
-   you save the theme. Saving ends the trial, and the dashboard returns to your own theme. To select the saved theme, use **Use this theme**,
-   you choose another theme for your user in your profile,
-   ten minutes pass without an edit. The bar then says the trial ended after ten minutes, or
-   you reload the page.

When a trial ends, the dashboard returns to your own theme, and a short message says so.

### Limits of a trial

-   Views and cards that set their own `theme:` in the dashboard keep it. A trial changes the theme for the rest of the page, not for those.
-   Other browser tabs do not change.
-   The editor's own colours stay the same during a trial, so you can keep reading the fields.
-   The preview in the editor can still differ from the real dashboard. Cards use their own shadow DOM and may draw some parts differently. Use **Try on dashboard** to check the real look.

## Revert

**Revert** returns the current tab to your own theme. It changes nothing else: the draft in the editor stays as it is, and the saved file stays as it is. Click **Try on dashboard** again to keep trying.

## Use this theme

Once you save a theme, the header offers **Use this theme**. It selects the saved theme for your user. Home Assistant stores the choice in your user profile, so it also applies in other browsers where you are signed in. Other users keep their own theme.

After the click the editor says **Now using** the theme's name **for your user**.

If the editor cannot reach Home Assistant from the page, it says **Pick** the theme's name **in your profile to use it**, with an **Open your profile** link. You can select the theme there as you would any other theme.

**Use this theme** needs a saved file. The theme must be saved before Home Assistant can select it.
