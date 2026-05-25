# Per-Field Sync System

## Overview

The sync system allows cards linked to templates to:
- **Auto-sync** all properties from the template by default
- **Track changes** at the individual field level
- **Preserve local changes** even when template updates
- **Re-sync** any field back to template with one click

## Architecture

### 1. Path-Based Tracking (`utils/sync-path.ts`)

Uses dot-notation paths to identify each field:

```typescript
// Examples of property paths:
"entity"                              // Top-level module property
"design.color"                        // Nested in design object
"rows.0.layout"                       // First row's layout
"rows.0.columns.1.gap"               // Second column's gap
"rows.0.columns.0.modules.2.entity"  // Third module's entity in first column
```

**Key Functions:**
- `buildPath(...parts)` - Build a path from components
- `isNotSynced(context, property)` - Check if field is not synced
- `getFullPath(context, property)` - Get complete path for a property
- `extendContext(context, ...parts)` - Create child context with extended path

### 2. Sync Context

Passed through the component tree to track sync state:

```typescript
interface SyncContext {
  templateName?: string;    // Name of linked template
  notSynced: string[];      // Array of not-synced paths
  basePath?: string;        // Current path prefix
}
```

Example contexts at different levels:

```typescript
// At card level:
{
  templateName: "my-template",
  notSynced: ["background_color", "rows.0.design.padding"],
  basePath: ""
}

// At first row level:
{
  templateName: "my-template",
  notSynced: ["background_color", "rows.0.design.padding"],
  basePath: "rows.0"
}

// At first row's first column's second module:
{
  templateName: "my-template",
  notSynced: ["background_color", "rows.0.design.padding"],
  basePath: "rows.0.columns.0.modules.1"
}
```

### 3. Sync Indicator Component

Small button next to each field showing sync status:

```html
<!-- Synced field -->
<mc-sync-indicator
  .synced=${true}
  .hasTemplate=${true}
  .propertyPath=${"entity"}
  @sync-toggle=${handleSyncToggle}
></mc-sync-indicator>
<!-- Shows: 🔗 (link icon, green) -->

<!-- Not synced field -->
<mc-sync-indicator
  .synced=${false}
  .hasTemplate=${true}
  .propertyPath=${"entity"}
  @sync-toggle=${handleSyncToggle}
></mc-sync-indicator>
<!-- Shows: 🔗 (broken link icon, orange) -->
```

### 4. Form Utilities with Sync Support

All form rendering functions now support sync indicators:

```typescript
renderTextField(
  label: string,
  value: string | undefined,
  onChange: (value: string) => void,
  propertyName?: string,      // NEW: Property name for path building
  syncContext?: SyncContext    // NEW: Sync context
)
```

Usage example:

```typescript
// Without sync (backward compatible):
renderTextField("Label", value, onChange);

// With sync tracking:
renderTextField("Entity", config.entity, onChange, "entity", syncContext);

// At nested level:
const rowContext = extendContext(syncContext, "rows", rowIndex);
renderTextField("Gap", row.gap, onChange, "gap", rowContext);
```

### 5. Module Editor Integration

Each module's `renderGeneralTab` receives sync context:

```typescript
renderGeneralTab(
  config: CardModule,
  hass: HomeAssistant | undefined,
  onChange: (updated: CardModule) => void,
  syncContext?: SyncContext  // NEW parameter
): TemplateResult {
  return html`
    <div class="mc-tab-content">
      ${renderEntityField(
        "Entity",
        config.entity,
        (val) => onChange({ ...config, entity: val }),
        hass,
        undefined,
        "entity",      // Property name
        syncContext    // Sync context
      )}

      ${renderTextField(
        "Label",
        (config as ButtonModuleConfig).label,
        (val) => onChange({ ...config, label: val }),
        "label",       // Property name
        syncContext    // Sync context
      )}
    </div>
  `;
}
```

## User Experience

### Visual Indicators

Each field shows a small button next to its label:

```
Entity                        🔗 (green link - synced)
[light.living_room          ]

Label                         🔗💔 (orange broken link - not synced)
[My Light                   ]

Icon                          🔗 (green link - synced)
[Browse...]
```

### Behavior

**When a field is synced (🔗 green):**
- Value comes from template
- Updates automatically when template changes
- Click button → becomes not synced, allows local editing

**When a field is not synced (🔗💔 orange):**
- Has local changes
- Won't update when template changes
- Click button → re-syncs from template, discards local changes

### YAML Structure

```yaml
type: custom:magic-card
template: my-button-template
not_synced:
  - entity              # Entity field not synced
  - design.color        # Color in design tab not synced
rows:
  - id: row1
    not_synced:
      - layout          # This row's layout not synced
    columns:
      - id: col1
        modules:
          - id: mod1
            type: button
            entity: light.custom    # Local override
            not_synced:
              - entity              # This module's entity not synced
              - design.font_size    # Font size not synced
            design:
              font_size: 24px       # Local override
```

## Implementation Checklist

- [x] Path utilities (`sync-path.ts`)
- [x] Sync service with deep merge (`sync-service.ts`)
- [x] Sync indicator component
- [x] Design panel integration
- [x] Form utilities updated (all field types support sync)
- [x] Base module updated to pass sync context
- [x] All module types updated (22 modules)
- [x] Actions tab integration
- [x] Conditions tab integration
- [x] Card-level settings integration
- [x] Template info passed from editor → settings-modal → modules
- [x] Toolbar sync management UI (badge, override list, Re-sync All)
- [x] Backend: not_synced stripped from saved templates
- [x] Backend: API endpoint updated to subscription model
