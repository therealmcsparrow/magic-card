# Security policy

## Supported versions

Only the latest release receives security fixes. Releases use calendar versions (for example 2026.10.06).

## Status of this project

Magic Card is non-commercial open source software under the EU Cyber Resilience Act (CRA). It is not sold. At most, it receives voluntary donations.

## Scope

Reports about importing preset, theme, animation, icon or shape files are in scope, for example a file that runs script, reads local data, hangs the editor or sends a request without the confirmation described in the documentation. Out of scope: a request the user confirmed with Import anyway. Dependencies are listed in the SBOM (sbom.cdx.json) attached to each release; we check them on every release and ship a fix release for a confirmed vulnerability.

## Reporting a vulnerability

Please do not open a public issue for a security problem.

Report it privately through GitHub: open the **Security** tab of this repository and choose **Report a vulnerability** (private vulnerability reporting). Include the card version, your Home Assistant version, and steps to reproduce.

We handle reports on a best-effort basis. We aim to reply within 7 days. Confirmed issues are fixed in a new release, and the report is credited in the changelog unless you prefer otherwise.
