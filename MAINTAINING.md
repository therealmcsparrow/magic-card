# Maintaining Magic Card

This page is for two kinds of reader. If your card stopped working, start with the first section. If you publish releases, the last section lists the steps.

## My card broke, what now?

Go back to the version that worked. Every published release stays available, so you can install an earlier one. You do not need a GitHub account.

Which screen you use depends on your Home Assistant version. Each step says which one it is for.

**HACS screens (Home Assistant before 2026.11)**

1. (HACS screens) In the sidebar, open **HACS**. (unverified)
2. (HACS screens) Find **Magic Card** in the list and open it. (unverified)
3. (HACS screens) Open the three dots at the top right and choose **Redownload**. (unverified)
4. (HACS screens) In the version list, pick the last version that worked and confirm. (unverified)
5. (HACS screens) Restart Home Assistant, then hard refresh the browser with Ctrl+Shift+R. (unverified)

**Settings > Marketplace (Home Assistant 2026.11 and later)**

1. (Marketplace) Go to **Settings > Marketplace**. (unverified)
2. (Marketplace) Find **Magic Card** in the list and open it. (unverified)
3. (Marketplace) Open the three dots at the top right and choose **Redownload**. (unverified)
4. (Marketplace) In the version list, pick the last version that worked and confirm. (unverified)
5. (Marketplace) Restart Home Assistant, then hard refresh the browser with Ctrl+Shift+R. (unverified)

The list shows the most recent releases. A version marked as a pre-release only appears if you turned on the pre-release switch for Magic Card.

After the restart your cards should work again. If they do not, open an issue and say which version you went back to.

## Which version is running

The installer and the browser each tell you something.

1. (HACS screens) Open **HACS**, then **Magic Card**. The installed version is shown on its page. (unverified)
2. (Marketplace) Open **Settings > Marketplace**, then **Magic Card**. The installed version is shown on its page. (unverified)
3. In any browser, open the console and look for the line `MAGIC-CARD v<version>`. This is the version the browser has loaded. It must match the version you installed. If it does not, hard refresh with Ctrl+Shift+R and look again.

## How to stay on one version

Install the version you want with the **Redownload** steps above. Then stop Home Assistant from offering the next update.

1. Open **Settings > System > Updates**. (unverified)
2. Find the Magic Card update and open it. (unverified)
3. Choose **Skip**. (unverified)

Home Assistant then hides that update until a newer one comes out. Updating later is the same as any other update: open the update and install it.

## Quiet isn't dead

Magic Card may go a while without a new release. That does not mean it stopped working. A release you installed keeps running as long as Home Assistant keeps loading custom cards the way it does today, and you can stay on it with the steps above.

## Art

No generated art ships with Magic Card. The look of the animated icons is defined by an art spec, `assets/brand/icon-library/p4-spec.json`. Finished originals are kept in one folder, `assets/brand/`. SVG is the original and PNG is an export of it. The licence for the folder is in `assets/brand/LICENSE.md`.

## Release steps

These are the steps for a release. The version is the tag without the `v`.

1. Set the same version in `package.json` and `src/version.ts`, in one commit.
2. Add the entry to `CHANGELOG.md`. If the release changes something Magic Card Utils uses, name the minimum Magic Card Utils version in it.
3. On Linux, run `npm ci` and then `npm run build`, so the committed `dist/` matches the build that CI makes.
4. Run `npm run size`.
5. Run `node tools/check-i18n.mjs --ci`.
6. Run `npm run notices -- --check`.
7. Open a pull request into `main`. The branch takes pull requests only, and the required checks must pass.
8. Push the tag `v<version>`. The tag push runs `.github/workflows/release.yml`, which builds the CycloneDX SBOM (`sbom.cdx.json`) and attaches it to the release, next to the files in `dist/`.
9. A tag with a hyphen, such as `v2026.10.12-beta.1`, is published as a pre-release. Only people who turned on the pre-release switch are offered it.
10. When the release changes something Magic Card Utils uses, a paired Magic Card Utils release follows. Its `.magic-card-ref` is set to the Magic Card release commit, and each changelog names the minimum version of the other.

Published releases and tags are kept. To withdraw a broken version, publish a fixed release.
