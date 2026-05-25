# UX Test Checklist

## Runtime Card (Home Assistant)
- Tab to any actionable module and trigger with `Enter`.
- Trigger hold action with `Shift + Enter`.
- Trigger double-tap action with `Ctrl + Enter`.
- Confirm focus ring appears on actionable modules.

## Module Selector
- Open selector, search with keyboard, choose module with `Enter`.
- Press `Escape` and verify dialog closes.
- Search no-result text appears for unknown query.

## Form Editor
- Select module using keyboard (`Tab` + `Enter`).
- Move module with `Alt + ArrowUp/Down`.
- Move module across columns with `Alt + ArrowLeft/Right`.
- Move row with `Alt + ArrowUp/Down` on row header.

## Tree Editor
- Expand/collapse rows and columns with `Enter`/`Space`.
- Move selected module with `Alt + Arrow` keys.
- Move rows with `Alt + ArrowUp/Down`.

## Mode/Context Clarity
- Verify mode helper text updates when switching mode.
- Verify selected context bar shows row/column/module position.

## Responsive
- Validate editor at `xs` and `sm` widths.
- Confirm toolbar wraps without overlapping controls.
- Confirm mode switcher remains usable at small widths.

## Regression
- Undo/redo still works after keyboard reorder actions.
- Template link popup still opens and actions still work.
- Card settings and module settings modals still open/save correctly.
