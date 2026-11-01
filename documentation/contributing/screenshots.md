# Screenshots for issues and pull requests

Every screenshot you attach to an issue, a discussion or a pull request is public, and stays public after you delete the comment. A screenshot of Home Assistant can show more than you notice: names, device IDs, addresses and the time you took it. This page shows how to take a clean one.

## What must not be visible

The pull request template lists the same eight items.

1.  No household names. Leave out people, pets, your address and rooms named after someone.
2.  No entity IDs, such as `light.<name>`. Rename or hide them in the frame.
3.  No URLs. Crop the browser address bar, and remove links to your Home Assistant.
4.  No IP addresses, in the address bar, in a card or in a log.
5.  No QR codes, such as the Home Assistant app pairing code.
6.  No toasts or notifications in the frame. Wait until they have gone.
7.  EXIF and other metadata stripped from the file (see below).
8.  Taken on a demo Home Assistant with a throwaway user, not on your home setup.

## Take the screenshot

1.  Start a demo Home Assistant with made-up devices. A container or a test machine is fine.
2.  Create a user that only exists for this, and sign in as that user. Delete it afterwards.
3.  Open the card in light mode and take the screenshot, then do the same in dark mode.
4.  Crop the image to the card or editor you are showing.

You now have two images that show nothing from your own home.

## Strip the metadata

Image files can carry the camera or device, the time, the GPS position and the software that made them. Remove it with [exiftool](https://exiftool.org/):

```sh
exiftool -all= --icc_profile:all screenshot.png
```

`-all=` deletes EXIF, GPS, XMP and text tags. `--icc_profile:all` keeps the colour profile, so the colours do not shift. exiftool keeps the original as `screenshot.png_original`. Delete that file before you attach anything.

For several files at once, run it on the folder: `exiftool -all= --icc_profile:all <folder>`.

## Check the result

List the tags that are left:

```sh
exiftool screenshot.png
```

The output should hold only file facts such as the name, size, type, image width and height, and perhaps a colour profile. If you see a date from a camera, a GPS entry, a comment or a software name, run the strip command again.

Last, open the image and read it once as a stranger would. The metadata check does not catch a name that is visible in the picture.
