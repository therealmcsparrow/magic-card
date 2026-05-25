# Magic Card UX Optimization Plan

## 1) Goals and Baseline

### Primary UX goals
- Reduce time to build a first useful card in Form mode.
- Improve keyboard-only operation in card runtime and editor.
- Reduce accidental drag/reorder errors on desktop and mobile.
- Make mode differences obvious (Form vs YAML vs Tree).
- Keep visual behavior consistent across card, editor, and pickers.

### Baseline tasks to measure
- Task A: create a card with 1 row, 2 columns, and 3 modules.
- Task B: reorder one row and two modules.
- Task C: edit module design and action settings.
- Task D: link to template, create local overrides, re-sync.

### Metrics
- Time-to-completion for each task.
- Total clicks/taps/keypresses per task.
- Error rate (undo usage + mis-clicks + wrong drag targets).
- Keyboard completion rate (task done without pointer).
- Mobile pass/fail at `xs` and `sm` editor breakpoints.

## 2) Interaction and Accessibility
- `magic-card`: action wrappers support keyboard activation.
- Module selector items are real buttons and support ESC close.
- Form and Tree editors support keyboard reorder using `Alt + Arrow`.
- Focus states are visible for all new keyboard-focusable controls.

## 3) Information Architecture
- Mode switcher now has clearer labels/icons and helper text.
- Selected module context is always visible above editor content.
- Row/module controls expose clearer keyboard affordances.

## 4) Visual System Improvements
- Global design tokens extracted from `src/css/css.ts` to `src/css/tokens.ts`.
- Editor spacing and focus behavior normalized for new interactive controls.
- Added responsive spacing adjustments for compact breakpoints.

## 5) Responsive Behavior
- Editor integrates `ResponsiveService` and applies breakpoint classes.
- Compact behavior for `xs/sm`: tighter spacing and controls.
- Toolbar and mode switcher now handle wrapping better.

## 6) Quality Gates
- Run `npm run lint` and `npm run build` before release.
- Execute manual UX checklist in `docs/UX_TEST_CHECKLIST.md`.
- Verify keyboard, mobile, and pointer parity before merge.
