# Copy my setup

When you report a problem, the first questions are usually the same: which card version, which Magic Card Utils version, which look and fonts, and what loads when. **Copy my setup** answers them in one paste.

## Where the button is

Open a card in the card editor. The **Copy my setup** button sits next to the look entry. It always shows, with or without Magic Card Utils.

1. Select **Copy my setup**.
2. The label changes to **Copied**.
3. Paste into your bug report or forum post.

The block is built when you select the button, from the card as it is in the editor at that moment. Unsaved changes are included. Nothing is sent anywhere: the block is made in your browser and only you paste it.

## What the block holds

The block is plain English text, whatever language Home Assistant uses. The first line is always `setup v1`. Seven lines follow, in this order. Every line is always there. A value Magic Card cannot find prints `unknown`, and an empty list prints `none`.

```
setup v1
card: <card version>
utils: <Magic Card Utils version>
looks: <key=name, ...>
fonts: <font name, ...>
first paint: <part, ...>
on click: <part, ...>
transport: secure
```

| Line | What it says |
| --- | --- |
| `card` | The version of the Magic Card file in your browser. |
| `utils` | The version of Magic Card Utils. `not installed` when Utils is not installed. `unknown` when it is installed but does not report a version, for example an older release. |
| `looks` | The line, track and theme looks the card uses, written as `key=name`, for example `line_style=dashed`. |
| `fonts` | The font names the card uses. |
| `first paint` | The card parts this card needs when it first shows. |
| `on click` | The parts that load later, on use, and that this page has loaded or failed to load. |
| `transport` | `secure` or `not secure`. Some browser features only work on a secure page (https). |

A part that has not finished loading gets `(pending)` after its name. A part that failed gets `(failed)`. A part that came from a different release than the card file gets `(other release)`. Lists are sorted by name.

## What the block leaves out

The block holds only the seven lines above. It does not hold entity ids, web addresses, host names, dashboard names, area names or user names, and it does not hold the rest of your card config.

Look and font names are copied as you wrote them. If you gave a look or font a name you would rather not share, change it in the block before you post. Control characters in a name, and the characters that change text direction, print as a space so the pasted block reads the way it is written.

## When the browser blocks copying

A browser can refuse clipboard access. This happens on a page opened over plain http, or when the permission is denied.

1. Select **Copy my setup**.
2. A one-line reason appears: "Your browser blocked copying. Select the text below and copy it yourself."
3. A read-only text box shows the same block. When it gets focus, all the text is selected.
4. Copy it with your usual keys, then paste it.

A screen reader announces that copying failed and that the text is shown below. The text box has the name "Setup details to copy". If the block itself cannot be prepared, which is not expected, the button area shows "Could not prepare your setup. Try again."

## Going back to the button

**Copied** is not permanent. The label returns to **Copy my setup** when any of these happens:

-   the button loses focus,
-   you press Escape,
-   you select the button again,
-   you press anywhere outside the button.

On a touch screen, where there may be no blur or Escape, the label also returns by itself after 10 seconds. Focus never moves when you copy.

## Language and screen readers

The button, the helper text and the messages follow your Home Assistant language (English UK, English US and Dutch). The block text stays English, and a screen reader reads it as English. Selecting the button again after **Copied** announces **Copied** again.
