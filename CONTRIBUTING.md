# Contributing to Magic Card

Thank you for helping with Magic Card. This page covers how to report a problem, suggest an idea, set up the project and send a change. The community rules are in the [Code of Conduct](CODE_OF_CONDUCT.md).

## Report a bug

Open a [new issue](https://github.com/therealmcsparrow/magic-card/issues/new/choose) and choose **Bug report (Magic Card card)**. The form asks for the card and Home Assistant versions, your browser, the steps to reproduce the problem, the card YAML and any browser console errors. Use it only for a problem you can reproduce on the latest release.

## Suggest an idea

For a question, a setup to share or a rough idea, start a [discussion](https://github.com/therealmcsparrow/magic-card/discussions). If you know exactly what should change, open a **Feature request (Magic Card card)** issue instead.

## Report a security problem

Do not open a public issue or discussion for a security problem. Report it privately: open the **Security** tab and choose **Report a vulnerability**. [SECURITY.md](SECURITY.md) lists what to include and when to expect a reply.

## Set up the project

You need Node.js 24, the version the CI uses.

1.  Clone the repository and run `npm ci` in its folder.
2.  Run `npm run build`. It writes the card files to `dist/`. Before it builds, it generates the translation tables and `src/version.ts` from `package.json`.
3.  Run `npm run lint` for ESLint and `node tools/check-i18n.mjs --ci` for the translation tables. The maintainer runs the Vitest suite before merging; it is kept outside the repository, so describe in your pull request how you tested your change.

Other scripts you will use:

-   `npm run watch` rebuilds on every change.
-   `npm run size` checks each built file against its size cap, and fails when one is over. Run it before you open a pull request that changes code.
-   `npm run dups` fails when a module that holds state (a top-level `let`, a mutated `const`, a `customElements.define`) ends up in two chunks of the card bundle. Run it after `npm run build` when you move a module between chunks.
-   `npm run notices` rebuilds the third-party notices. Run it after you add or update a dependency, or CI fails.

Pull requests normally leave `dist/` alone. The maintainer rebuilds it in the release commit. The release steps are in [MAINTAINING.md](MAINTAINING.md#release-steps).

## Text and translations

Every sentence a user can read goes through `t()`. Write the source text in British English, and add the same key to the en-US and nl tables. Before you open a pull request, run:

```sh
node tools/check-i18n.mjs --ci
```

Fix every message it reports.

## Tests and documentation

Add or update tests for every change in behaviour. In the same pull request, update the README, the [CHANGELOG](CHANGELOG.md) and the pages in the [documentation](documentation/README.md) folder that the change affects. A new option needs a line in the options reference, and a changed screen needs its page updated.

## Commit messages

Write a plain description of what the commit does, with no prefix such as `feat:` or `fix:`. For example: `Keep the studio canvas width when the view changes`.

## Pull requests

Open pull requests against `main`. The pull request template asks for a summary, the linked issue, the checks you ran and screenshots of UI changes in light and dark mode. Keep each pull request to one change where you can.

## Licence

Magic Card is released under the MIT Licence (see [LICENSE](LICENSE)). By sending a contribution, you agree that it is released under the same licence. Third-party code and icons keep their own licences, listed in [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
