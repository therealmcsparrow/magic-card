# Magic Card

[![HACS][hacs-badge]][hacs-url]
[![GitHub Version][version-badge]][version-url]
[![GitHub License][license-badge]][license-url]
[![GitHub Last Commit][last-commit-badge]][last-commit-url]
[![GitHub Issues][issues-badge]][issues-url]

A fully open-source Home Assistant Lovelace custom card with an advanced multi-mode configuration editor. Create beautiful, modular dashboards with 22+ content, control, layout, and advanced modules.

<!-- Add a screenshot or GIF of the card and editor in action -->

## Features

-   **Three Editor Modes**: A visual **Form Mode**, a powerful side-by-side **YAML Mode** with real-time sync, and a Figma-style **Tree Mode** for layout management.
-   **22+ Modules**: Build anything you can imagine with a rich library of modules for content, controls, and layout.
-   **Display Conditions**: Show or hide any module based on entity states, attributes, time, or complex Jinja2 templates.
-   **Advanced Actions**: Configure tap, hold, and double-tap gestures to call services, navigate, toggle entities, and more.
-   **Powerful Design System**: Apply fine-grained styling to every module, including colors, fonts, spacing, shadows, and even animations.
-   **Responsive Layouts**: Design dashboards that adapt to different screen sizes.
-   **Undo/Redo & Live Preview**: Edit with confidence.

## Installation

### HACS (Home Assistant Community Store) - Recommended

1.  Ensure you have [HACS](https://hacs.xyz/) installed.
2.  Go to HACS > Frontend.
3.  Click the 3-dots menu in the top right and select "Custom repositories."
4.  Add the URL for this repository (`https://github.com/therealmcsparrow/magic-card`) and select the "Lovelace" category.
5.  Click "Add", then find "Magic Card" in the list and install it.
6.  In your Home Assistant UI settings, add the resource: `url: /hacsfiles/magic-card/magic-card.js` and `type: module`.

### Manual Installation

1.  Download `magic-card.js` from the [latest release](https://github.com/therealmcsparrow/magic-card/releases).7
2.  Place the file in your `config/www` directory.
3.  In your Home Assistant UI settings, add the resource: `url: /local/magic-card.js` and `type: module`.

## Getting Started

Add the card to your dashboard with a basic configuration:

```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: text
            text: Hello World!
          - type: icon
            icon: mdi:home
```

## Module Overview

Magic Card comes packed with over 22 modules across 4 categories:

-   **Content**: `text`, `icon`, `info`, `image`, `markdown`, `bar`, `graphs`, `camera`
-   **Controls**: `button`, `slider`, `spinbox`, `dropdown`, `gauge`, `light`
-   **Layout**: `horizontal`, `vertical`, `tabs`, `separator`
-   **Advanced**: `clock`, `weather`, `forecast`, `custom-card`, `video-bg`

For a detailed reference of all card and module options, please see the [Advanced Configuration Guide](docs/CONFIGURATION.md) (Note: A more detailed guide could be created here).

## Development

-   **Prerequisites**: Node.js 16+ and npm.
-   **Install Dependencies**: `npm install`
-   **Run Dev Server**: `npm run dev` (serves on `http://localhost:5050`)
-   **Build for Production**: `npm run build`

## UX Documentation

-   **Optimization Plan**: [docs/UX_OPTIMIZATION_PLAN.md](docs/UX_OPTIMIZATION_PLAN.md)
-   **Validation Checklist**: [docs/UX_TEST_CHECKLIST.md](docs/UX_TEST_CHECKLIST.md)

## Contributing

This is an open-source project and contributions are welcome! Feel free to open an issue or submit a pull request.

## Support

For issues, feature requests, or questions, please [create an issue on GitHub][issues-url].

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

[hacs-badge]: https://img.shields.io/badge/HACS-Custom-41BDF5.svg
[hacs-url]: https://hacs.xyz/
[version-badge]: https://img.shields.io/github/package-json/v/therealmcsparrow/magic-card
[version-url]: https://github.com/therealmcsparrow/magic-card/releases
[license-badge]: https://img.shields.io/github/license/therealmcsparrow/magic-card
[license-url]: https://github.com/therealmcsparrow/magic-card/blob/main/LICENSE
[last-commit-badge]: https://img.shields.io/github/last-commit/therealmcsparrow/magic-card
[last-commit-url]: https://github.com/therealmcsparrow/magic-card/commits/main
[issues-badge]: https://img.shields.io/github/issues/therealmcsparrow/magic-card
[issues-url]: https://github.com/therealmcsparrow/magic-card/issues
