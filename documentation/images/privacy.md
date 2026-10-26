# Privacy and your images

Library images are drawings you make in the Magic Card image editor and save in Magic Card Utils. Everything stays on your own Home Assistant server. Magic Card and Magic Card Utils send nothing to McSparrow or to any third party, and they have no analytics.

**What is stored.** For each saved image: the drawing (SVG, including any text you typed), its name, keywords, author and description if you filled them in, a small preview picture, and the entity bindings (which entity changes which part of the drawing). Magic Card Utils keeps these in Home Assistant's `.storage` folder, so they are part of your Home Assistant backups. A backup you share or upload contains your images. An image can be up to 256 KiB and you can keep 200 images.

**Who can see them.** Every user who can log in to your Home Assistant can read every library image, because dashboards draw them for everyone. Only administrators can save, rename, delete or import images. If someone has an account but should not see a drawing, do not put it in the library.

**What is never stored or sent.** A reference picture (the photo you trace over) stays in your browser while you edit. It is not saved with the image, not sent to Home Assistant, not put in exported files and not turned into a web address. Large photos are scaled down in the browser only. Your browser keeps five numbers per image (position, size, rotation and opacity of the picture) in its local storage on that device so the picture lines up next time; it contains no part of the photo and no file name. Clear the site data of your browser to remove them.

**Cache on your device.** Dashboards keep drawings in the page's memory while the page is open. Nothing is written to the device's storage, and closing the page clears it.

**Export files.** Exporting an image gives you an SVG or a library file on your own device. It contains the drawing and may contain entity names from its bindings. Check a file before you post it in a forum or an issue.

**Deleting an image.** An administrator can delete an image in the Images tab of Magic Card Utils. It is removed from the library at once and cards that use it show the missing-picture state. Copies stay in older Home Assistant backups and in files you exported until you delete those too.

**A floor plan is sensitive.** A drawing of your home shows its layout, and bindings can reveal where cameras, locks, alarms or presence sensors are. Keep real detail to what the dashboard needs, avoid labelling bedrooms, valuables or entrances in text, and do not use real names in text or entity ids you plan to share. Share screenshots, exports and backups only after you have looked at them. If you do not run Home Assistant for your own household alone (for example for a business, a rental or a shared building), you are responsible for telling the people concerned and for your own GDPR duties.
