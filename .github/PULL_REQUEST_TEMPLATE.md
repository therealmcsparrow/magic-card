## Summary

<!-- What changes, and why. One or two sentences are enough. -->

## Linked issue

<!-- For example: Closes #123. Write "None" if there is no issue. -->

## Type of change

- [ ] Bug fix
- [ ] New feature or option
- [ ] Documentation only
- [ ] Refactoring or internal change (no change for users)

## Checklist

- [ ] `npm run lint` and `node tools/check-i18n.mjs --ci` pass, and I describe below how I tested this change
- [ ] `npm run lint` passes
- [ ] `npm run size` passes
- [ ] `node tools/check-i18n.mjs --ci` passes. Every new user-facing string goes through `t()`, is written in British English, and has entries in the en-US and nl tables
- [ ] README, CHANGELOG and the `documentation/` folder are updated for this change
- [ ] For a UI change: screenshots in light and dark mode are attached below
- [ ] I tested in Home Assistant version: <!-- for example 2026.10.1 -->
- [ ] I did not change `dist/` (the maintainer rebuilds it in the release commit)

## Screenshots

<!-- For a UI change, attach a light and a dark mode screenshot. Delete this section if it does not apply. Screenshots in a pull request are public, so check the list below first. How to strip metadata: https://github.com/therealmcsparrow/magic-card/blob/main/documentation/contributing/screenshots.md -->

- [ ] No household names (people, pets, rooms named after someone, your address)
- [ ] No entity IDs
- [ ] No URLs, including the browser address bar and any link to your Home Assistant
- [ ] No IP addresses
- [ ] No QR codes
- [ ] No toasts or notifications in the frame
- [ ] EXIF and other metadata stripped (see the [screenshot guide](https://github.com/therealmcsparrow/magic-card/blob/main/documentation/contributing/screenshots.md))
- [ ] Taken on a demo Home Assistant with a throwaway user

## Notes for the reviewer

<!-- Anything you want checked first, or anything that is not finished. -->
