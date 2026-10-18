# Security policy

## Supported versions

Only the latest release receives security fixes. Releases use calendar versions (for example 2026.10.06). Update through HACS before you report a problem.

## Status of this project

Magic Card is free software under the MIT licence. It is non-commercial open source software under the EU Cyber Resilience Act (CRA). It is not sold. At most, it receives voluntary donations. If that ever changes, this page changes with it.

## Scope

In scope:

-   **SVG import.** An SVG file or pasted SVG that runs script, loads an outside file, or gets past the cleaning that removes scripts, links and external references.
-   **Preset-file import.** A preset, theme, animation, icon or shape file that hangs the editor, reads local data, writes outside the place it is meant for, or sends a request without the confirmation described in [Export and import](documentation/presets/export-and-import.md#safe-import).
-   **The Magic Card Utils library.** The library commands that Magic Card calls over the Home Assistant WebSocket, and the script that Magic Card Utils adds to every Home Assistant page so cards can read the library. Report problems in that integration in its own repository: [magic-card-utils](https://github.com/therealmcsparrow/magic-card-utils/security).
-   **Magic Card's own files** in `dist/`.

Out of scope:

-   A request that you confirmed with **Import anyway**. A theme kept with an outside address or with `card-mod-` lines does what the warning says.
-   Faults in Home Assistant, card-mod, other custom cards, or a website a configuration points to.
-   A card configuration or template that you wrote or imported yourself, and that holds what it was told to hold.

Dependencies are listed in the SBOM (`sbom.cdx.json`) attached to each release. We check them on every release and ship a fix release for a confirmed vulnerability.

## Reporting a vulnerability

Please do not open a public issue for a security problem.

Report it privately through GitHub: open the **Security** tab of this repository and choose **Report a vulnerability** (private vulnerability reporting). Include the card version, your Home Assistant version, and steps to reproduce.

We handle reports on a best-effort basis. We aim to reply within 7 days. Confirmed issues are fixed in a new release, and the advisory is published once a fix is available. The report is credited unless you prefer otherwise.
