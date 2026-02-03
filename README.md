# Magic Card

A fully open-source Home Assistant Lovelace custom card with an advanced multi-mode configuration editor. Create beautiful, modular dashboards with 22+ content, control, layout, and advanced modules.

## Features

### 🎨 Three Editor Modes
- **Form Mode**: Visual tree editor with collapsible sections for rows, columns, and modules
- **YAML Mode**: Side-by-side YAML editor and form GUI with real-time synchronization
- **Tree Mode**: Figma-style layers panel with drag-and-drop support

### 📦 22 Modules Across 4 Categories

**Content Modules**
- Text, Icon, Info, Image, Markdown, Bar, Graphs, Camera

**Control Modules**
- Button, Slider, Spinbox, Dropdown, Gauge, Light

**Layout Modules**
- Horizontal, Vertical, Tabs, Separator

**Advanced Modules**
- Clock, Weather, Forecast, Video Background

### ⚡ Smart Features
- **Display Conditions**: Show/hide modules based on entity state, attributes, time, or Jinja2 templates
- **Actions**: Tap, hold, and double-tap gestures with support for more-info, toggle, navigate, URL, and custom service calls
- **Design System**: Per-module styling for colors, fonts, spacing, shadows, and animations
- **Responsive**: Breakpoint-aware layouts that adapt to screen size
- **Undo/Redo**: 50-level edit history
- **Live Preview**: See changes as you configure

## Installation

### 1. Copy the Card File
```bash
cp dist/magic-card.js /path/to/homeassistant/config/www/magic-card.js
```

### 2. Add as Resource in Lovelace
In your Home Assistant dashboard YAML:

```yaml
resources:
  - url: /local/magic-card.js
    type: module
```

Or via the UI:
1. Dashboard Settings → Resources
2. Click "Create resource"
3. URL: `/local/magic-card.js`
4. Type: `JavaScript Module`

### 3. Add Card to Dashboard
```yaml
type: custom:magic-card
rows:
  - columns:
      - modules:
          - type: text
            text: Hello World
```

## Configuration

### Basic Structure
```yaml
type: custom:magic-card
rows:
  - layout: 1-1  # column layout preset
    columns:
      - modules:
          - type: text
            text: Module 1
          - type: icon
            icon: mdi:home
      - modules:
          - type: info
            entity: sensor.temperature
```

### Rows & Layouts
- `layout: '1'` - Full width (default)
- `layout: '1-1'` - Two equal columns (50/50)
- `layout: '1-2'` - Two columns (33/66)
- `layout: '2-1'` - Two columns (66/33)
- `layout: '1-1-1'` - Three equal columns

### Display Conditions
Hide modules based on entity state or time:

```yaml
type: text
text: Temperature is high
display:
  conditions:
    - type: state
      entity: sensor.temperature
      above: 25
  mode: every  # 'every' = AND, 'any' = OR
```

**Condition Types:**
- `state`: Entity state comparison
- `attribute`: Entity attribute comparison
- `time`: Time range (after/before HH:MM)
- `template`: Jinja2 template evaluation

### Actions
Tap, hold, and double-tap interactions:

```yaml
type: button
label: Toggle Light
actions:
  tap_action:
    action: toggle
    entity: light.living_room
  hold_action:
    action: more-info
    entity: light.living_room
  double_tap_action:
    action: navigate
    navigation_path: /lovelace/bedroom
```

**Action Types:**
- `none` - No action
- `more-info` - Open more-info dialog
- `toggle` - Toggle entity (on/off)
- `navigate` - Navigate to dashboard path
- `url` - Open external URL
- `perform-action` - Call Home Assistant service
- `assist` - Open voice assistant

### Design & Styling
Customize appearance per module:

```yaml
type: text
text: Styled Text
design:
  font_size: 20px
  font_weight: bold
  color: '#ff6b6b'
  background: rgba(255, 107, 107, 0.1)
  padding: 16px
  border_radius: 12px
  box_shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
```

Available design properties:
- Typography: `font_size`, `font_weight`, `font_family`, `line_height`, `text_align`, `text_transform`
- Colors: `color`, `background`, `opacity`
- Spacing: `padding`, `margin`
- Borders: `border`, `border_radius`, `border_color`
- Effects: `box_shadow`, `filter`, `transform`, `transition`
- Size: `width`, `height`, `min_width`, `max_width`

## Module Reference

### Text
Display static or templated text.
```yaml
type: text
text: Static text here
use_template: false  # Enable Jinja2 templates
```

### Icon
Display Material Design Icons.
```yaml
type: icon
icon: mdi:home
size: 24px
icon_color: '#6366f1'
entity: light.living_room  # Optional: display entity's icon
use_entity_icon: false
```

### Info
Display entity name, state, and attributes.
```yaml
type: info
entity: sensor.temperature
show_name: true
show_state: true
show_unit: true
prefix: ''
suffix: ' °C'
```

### Button
Interactive button with state display.
```yaml
type: button
label: Button Text
icon: mdi:lightbulb
show_state: false
button_style: default  # 'default', 'outline', 'flat', 'icon-only'
```

### Slider
Adjustable slider control.
```yaml
type: slider
entity: light.living_room
min: 0
max: 100
step: 1
show_value: true
direction: horizontal  # 'horizontal' or 'vertical'
```

### Bar
Progress bar visualization.
```yaml
type: bar
entity: sensor.battery
min: 0
max: 100
show_value: true
direction: horizontal
```

### Clock
Display current time and date.
```yaml
type: clock
format_12h: false
show_seconds: false
show_date: true
```

### Weather
Display weather entity information.
```yaml
type: weather
entity: weather.home
show_temperature: true
show_condition: true
show_forecast: false
forecast_days: 5
```

### Horizontal / Vertical
Container layouts for child modules.
```yaml
type: horizontal
gap: 8px
modules:
  - type: icon
    icon: mdi:home
  - type: text
    text: Living Room
```

## Development

### Prerequisites
- Node.js 16+
- npm

### Setup
```bash
npm install
```

### Build
```bash
npm run build
```

Output: `dist/magic-card.js`

### Development Server
```bash
npm run dev
```

Server runs on `http://localhost:5050`

### Lint
```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

### Format
```bash
npm run format
```

## Architecture

### Module System
Modules are plain TypeScript classes that implement the `MagicModule` interface:
- `createDefault()` - Create default config
- `renderPreview()` - Render module preview
- `renderGeneralTab()` - General settings UI
- `renderActionsTab()` - Actions configuration
- `renderLogicTab()` - Display conditions UI
- `renderDesignTab()` - Styling options
- `validate()` - Config validation

### Editor State Management
Central `EditorStateManager` provides:
- Observable state for all editor modes
- Config mutations (add row, delete module, etc.)
- Undo/redo history
- Config serialization/deserialization

### Services
- **LogicService**: Evaluate display conditions
- **TemplateService**: Jinja2 rendering via HA WebSocket
- **ActionService**: Execute tap/hold/double-tap actions
- **ConfigValidator**: Validate config structure

## Browser Support
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Known Limitations
- CodeMirror YAML syntax highlighting requires Home Assistant 2023.12+
- Template rendering requires Home Assistant WebSocket connection
- Drag-and-drop in tree editor works best with mouse; touch support is limited

## Contributing
This is an open-source project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
MIT License - See LICENSE file for details

## Credits
Inspired by [Ultra Card](https://github.com/Alia5/ultracard) - built with same proven architecture but entirely open-source and feature-rich.

## Support
For issues, feature requests, or questions:
- Create an issue on GitHub
- Check existing documentation and examples
- Review the source code - it's well-organized and commented

## Changelog

### v0.1.0 (Initial Release)
- ✅ 22 modules across 4 categories
- ✅ Three editor modes (Form, YAML, Tree)
- ✅ Display conditions and actions
- ✅ Full design/styling system
- ✅ Undo/redo history
- ✅ HACS integration ready
