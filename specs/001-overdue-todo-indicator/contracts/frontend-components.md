# Frontend Component Contracts: Overdue Indicator

**Feature**: Overdue Todo Items
**Date**: 2026-06-04

## TodoCard Component Interface

### Props Contract

The TodoCard component receives the following props:

```javascript
{
  todo: {
    id: number,              // Unique todo identifier
    title: string,           // Todo task description (max 255 chars)
    dueDate: string | null,  // ISO 8601 date string (YYYY-MM-DD) or null
    completed: boolean,      // Completion status
    createdAt: string        // ISO 8601 timestamp
  },
  onToggle: (id: number) => Promise<void>,     // Toggle completion status
  onEdit: (id: number, title: string, dueDate: string | null) => Promise<void>,
  onDelete: (id: number) => void,              // Delete todo
  isLoading: boolean                            // Loading state for async operations
}
```

### Display Contract

**Visual Layout** (left to right):
1. Checkbox (completion toggle)
2. **Overdue Icon** (NEW: conditionally rendered)
3. Todo title text
4. Due date (formatted)
5. Action buttons (Edit, Delete)

**Overdue Icon Rendering Rules**:
- **Shown when**: `dueDate` exists AND `completed === false` AND `dueDate < today`
- **Hidden when**: Any of the above conditions is false
- **Icon**: Clock/timer symbol (⏰ or SVG)
- **Color**: `var(--color-primary)` (orange)
- **Position**: After checkbox, before title text
- **Accessibility**: `aria-label="Overdue"`

### Overdue Calculation Contract

```javascript
/**
 * Determines if a todo is overdue
 * @param {string | null} dueDate - ISO 8601 date string (YYYY-MM-DD)
 * @param {boolean} completed - Completion status
 * @returns {boolean} True if overdue, false otherwise
 */
function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false;
  
  const today = new Date().setHours(0, 0, 0, 0);
  const due = new Date(dueDate).setHours(0, 0, 0, 0);
  
  return due < today;
}
```

**Contract Guarantees**:
- Returns `false` if `dueDate` is `null` or `undefined`
- Returns `false` if `completed` is `true`
- Returns `false` if `dueDate` is today or future
- Returns `true` only if `dueDate` is past AND `completed` is `false`
- Uses day-level granularity (ignores time of day)

---

## OverdueIcon Component Interface (NEW)

### Props Contract

```javascript
{
  // No props needed (stateless presentational component)
}
```

### Rendering Contract

**HTML Structure**:
```html
<span className="overdue-icon" aria-label="Overdue" role="img">
  ⏰
</span>
```

**CSS Requirements**:
- `.overdue-icon` class applies styling
- `color: var(--color-primary)` for orange color
- Margin spacing: `margin-right: var(--space-xs)` (8px)
- Font size: Match surrounding text or slightly larger for visibility

**Accessibility Contract**:
- `role="img"` indicates decorative/semantic icon
- `aria-label="Overdue"` provides screen reader text
- Icon is purely visual enhancement (overdue status is also conveyed through other means if needed)

---

## Utility Function Contract

### isOverdue Utility

**Location**: `src/utils/dateUtils.js` (new file) or inline in TodoCard

**Function Signature**:
```javascript
/**
 * Checks if a todo item is overdue based on its due date and completion status.
 * 
 * @param {string | null | undefined} dueDate - ISO 8601 date string (YYYY-MM-DD)
 * @param {boolean} completed - Whether the todo is marked as complete
 * @returns {boolean} True if the todo is overdue (past due date and incomplete), false otherwise
 * 
 * @example
 * isOverdue('2026-06-01', false) // true (if today is 2026-06-04)
 * isOverdue('2026-06-10', false) // false (future date)
 * isOverdue('2026-06-01', true)  // false (completed)
 * isOverdue(null, false)          // false (no due date)
 */
export function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false;
  
  const today = new Date().setHours(0, 0, 0, 0);
  const due = new Date(dueDate).setHours(0, 0, 0, 0);
  
  return due < today;
}
```

**Input Contracts**:
- `dueDate`: String in ISO 8601 format (YYYY-MM-DD), or null/undefined
- `completed`: Boolean indicating completion status

**Output Contract**:
- Returns `boolean` (never null/undefined)

**Side Effects**:
- None (pure function)

**Performance Contract**:
- O(1) time complexity
- No external dependencies
- Safe to call in render methods (memoized in React)

---

## CSS Contract

### New Styles Required

```css
/* Overdue icon styling */
.overdue-icon {
  color: var(--color-primary);
  margin-right: var(--space-xs);
  font-size: 1em;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}
```

**CSS Custom Properties Used**:
- `var(--color-primary)`: Orange color (#ff6b35 light, #ff8c42 dark)
- `var(--space-xs)`: 8px spacing

**Theme Support**:
- Automatically adapts to light/dark mode via CSS custom properties
- No additional dark mode styles needed

---

## Backward Compatibility

### Changes to Existing Components

**TodoCard.js**:
- **Added**: `isOverdue` calculation using `useMemo`
- **Added**: Conditional rendering of `<OverdueIcon />` in layout
- **No Breaking Changes**: All existing props and behavior unchanged

**TodoCard.css** (or inline styles):
- **Added**: `.overdue-icon` styles
- **No Breaking Changes**: Existing styles unchanged

### API Contract

**No Backend Changes Required**:
- Backend API remains unchanged
- No new endpoints
- No schema modifications
- Existing GET `/api/todos` response unchanged

---

## Testing Contract

### Unit Test Coverage

**isOverdue Utility Function**:
- ✅ Returns `false` when `dueDate` is `null`
- ✅ Returns `false` when `completed` is `true`
- ✅ Returns `false` when `dueDate` is today
- ✅ Returns `false` when `dueDate` is future
- ✅ Returns `true` when `dueDate` is past and `completed` is `false`
- ✅ Handles invalid date strings gracefully

**TodoCard Component**:
- ✅ Renders overdue icon when todo is overdue
- ✅ Does NOT render icon when todo is complete
- ✅ Does NOT render icon when due date is null
- ✅ Does NOT render icon when due date is future
- ✅ Icon has correct `aria-label` for accessibility
- ✅ Icon has correct color (orange)

**OverdueIcon Component**:
- ✅ Renders with correct HTML structure
- ✅ Has `aria-label="Overdue"`
- ✅ Has `role="img"`
- ✅ Applies correct CSS class

### Integration Test Coverage

- ✅ Overdue icon appears in todo list for overdue incomplete items
- ✅ Marking overdue todo complete removes icon
- ✅ Editing due date from past to future removes icon
- ✅ Theme switch (light/dark) maintains icon visibility

---

## Summary

The overdue indicator feature introduces:
- **1 new component**: `OverdueIcon` (presentational)
- **1 new utility function**: `isOverdue` (date comparison logic)
- **1 modified component**: `TodoCard` (adds conditional overdue icon rendering)
- **New CSS styles**: `.overdue-icon` class
- **No API changes**: Entirely frontend implementation
- **No breaking changes**: Fully backward compatible
