# Research: Overdue Todo Indicator

**Feature**: Overdue Todo Items
**Date**: 2026-06-04
**Branch**: 001-overdue-todo-indicator

## Research Tasks

### 1. Date Comparison in JavaScript

**Decision**: Use native JavaScript Date object for comparison

**Rationale**:
- JavaScript's Date object provides reliable date comparison with `<` and `>` operators
- No external dependencies needed (project avoids unnecessary libraries per constitution)
- Date comparison at day-level granularity: compare dates by creating Date objects at midnight (start of day)
- Method: `new Date(dateString).setHours(0, 0, 0, 0)` normalizes times to midnight for day-level comparison

**Best Practices**:
- Create a utility function `isOverdue(dueDate, completed)` to encapsulate the logic
- Return `false` if `dueDate` is null/undefined or if `completed` is true
- Compare normalized dates: `new Date(dueDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)`
- Use `useMemo` in React to avoid recalculating overdue status on every render

**Alternatives Considered**:
- date-fns or moment.js: Rejected due to unnecessary bundle size for simple comparison
- String comparison: Rejected due to timezone edge cases and brittleness
- Backend computation: Rejected because overdue status depends on user's current local date

### 2. Clock Icon Implementation

**Decision**: Use Unicode clock emoji "⏰" (U+23F0) or CSS-based SVG icon

**Rationale**:
- Unicode emoji requires no dependencies and works cross-platform
- CSS can be used to style and size the emoji consistently
- Alternative: Inline SVG for better control and theme consistency
- Project uses no external icon libraries, following KISS principle

**Best Practices**:
- Create a reusable `<OverdueIcon />` component
- Use `aria-label="Overdue"` for accessibility
- Apply `color: var(--color-primary)` to use theme's orange color
- Position with flexbox: place between checkbox and text using order or DOM position

**Alternatives Considered**:
- Font Awesome or Material Icons: Rejected to avoid adding new dependencies
- Image files: Rejected for theme compatibility and scalability concerns
- Custom SVG inline: Preferred alternative for better control

### 3. Orange Color from Halloween Theme

**Decision**: Use existing `--color-primary` CSS custom property

**Rationale**:
- Theme already defines primary color as orange: `#ff6b35` (light) and `#ff8c42` (dark)
- Using CSS custom properties ensures theme consistency and dark mode support
- No hardcoded color values needed

**Best Practices**:
- Reference `var(--color-primary)` in component styles
- Icon color automatically adapts to light/dark theme
- Maintains constitution requirement for using color tokens, not hardcoded values

**Alternatives Considered**:
- Hardcoded orange hex values: Rejected for theme consistency
- New CSS variable: Rejected as unnecessary duplication

### 4. Component Architecture

**Decision**: Add overdue logic to existing `TodoCard` component

**Rationale**:
- TodoCard already handles todo display and contains all necessary data
- Follows Single Responsibility Principle: TodoCard displays todo visual state
- Avoids creating unnecessary wrapper components
- Overdue status is a derived display property, not stored data

**Implementation Approach**:
```javascript
// In TodoCard component
const isOverdue = useMemo(() => {
  if (!todo.dueDate || todo.completed) return false;
  const today = new Date().setHours(0, 0, 0, 0);
  const due = new Date(todo.dueDate).setHours(0, 0, 0, 0);
  return due < today;
}, [todo.dueDate, todo.completed]);
```

**Best Practices**:
- Use `useMemo` to cache calculation result
- Dependencies: `[todo.dueDate, todo.completed]`
- Keep logic pure and testable
- Extract to utility function if reused elsewhere

**Alternatives Considered**:
- Separate OverdueIndicator component: Rejected as over-engineering for simple icon display
- Backend calculation: Rejected because overdue depends on user's current local date

### 5. Testing Strategy

**Decision**: Unit tests for overdue logic, integration tests for visual display

**Rationale**:
- Test utility function independently with various date scenarios
- Test React component rendering with overdue/non-overdue states
- Mock `Date` object in tests for consistent, deterministic results
- Verify icon presence, color, and accessibility attributes

**Test Scenarios**:
- Past date + incomplete → shows indicator
- Past date + completed → no indicator
- Today's date + incomplete → no indicator
- Future date + incomplete → no indicator
- No due date + incomplete → no indicator
- Dark mode → correct color applied

**Best Practices**:
- Use Jest's `jest.setSystemTime()` or manual Date mocking
- Test both utility function and component rendering
- Verify accessibility: icon has `aria-label`
- Ensure 80%+ code coverage per constitution

**Alternatives Considered**:
- Visual regression testing: Deferred to manual QA (no tooling in place)
- E2E testing: Deferred as overkill for this feature scope

## Summary

The overdue indicator feature will be implemented using:
- **Date logic**: Native JavaScript Date comparison with day-level granularity
- **Icon**: Unicode emoji ⏰ or inline SVG with `color: var(--color-primary)`
- **Architecture**: Logic added to existing TodoCard component with `useMemo` optimization
- **Color**: CSS custom property `--color-primary` for theme consistency
- **Testing**: Unit tests for utility function + component integration tests

All approaches follow the project's constitution principles: KISS, no unnecessary dependencies, theme consistency, and comprehensive testing.
