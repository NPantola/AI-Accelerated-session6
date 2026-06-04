# Data Model: Overdue Todo Indicator

**Feature**: Overdue Todo Items
**Date**: 2026-06-04
**Branch**: 001-overdue-todo-indicator

## Entities

### Todo Item (Existing)

**Description**: Core entity representing a todo task. No schema changes required for this feature.

**Fields**:
- `id` (number, primary key): Unique identifier for the todo
- `title` (string, required, max 255 chars): Todo task description
- `dueDate` (string, nullable, ISO 8601 format): Optional due date (YYYY-MM-DD)
- `completed` (boolean/integer): Completion status (0 = incomplete, 1 = complete in SQLite)
- `createdAt` (timestamp): Creation timestamp

**Relationships**: None (standalone entity)

**Validation Rules**:
- `title`: Non-empty string, max 255 characters
- `dueDate`: Valid ISO 8601 date string (YYYY-MM-DD) or null
- `completed`: Boolean value (stored as 0/1 in SQLite)

**State Transitions**:
- Incomplete → Complete: User marks todo as done
- Complete → Incomplete: User unchecks completed todo

---

### Overdue Indicator (Derived Display Property)

**Description**: Visual indicator showing when a todo is overdue. This is NOT a stored entity; it is a computed property derived from Todo fields.

**Derived From**:
- `todo.dueDate`: Due date to compare against current date
- `todo.completed`: Completion status affects visibility
- Current date: System date at render time

**Calculation Logic**:
```javascript
isOverdue = (todo.dueDate !== null) 
         && (todo.completed === false)
         && (new Date(todo.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0))
```

**Display Properties**:
- **Icon**: Clock/timer symbol (⏰ Unicode or SVG)
- **Color**: `var(--color-primary)` (orange: #ff6b35 light, #ff8c42 dark)
- **Position**: Between checkbox and todo text
- **Visibility**: Only shown when `isOverdue === true`
- **Accessibility**: Icon has `aria-label="Overdue"` for screen readers

**Conditions for Display**:
1. `dueDate` is NOT null/undefined
2. `completed` is `false` (todo is incomplete)
3. `dueDate` is before today (day-level comparison, ignoring time)

**Conditions for Hidden**:
1. `dueDate` is null → No due date set
2. `completed` is `true` → Todo is complete
3. `dueDate` is today or in future → Not yet overdue

---

## Data Flow

### Frontend Display Logic

1. **TodoCard Component** receives `todo` object as prop
2. **useMemo hook** computes `isOverdue` boolean:
   - Check if `todo.dueDate` exists
   - Check if `todo.completed === false`
   - Compare normalized dates (midnight-to-midnight)
3. **Conditional Rendering**: If `isOverdue === true`, render `<OverdueIcon />`
4. **Icon Component** renders styled clock icon with orange color and accessibility label

### No Backend Changes

- Backend API remains unchanged
- Overdue status is computed on the frontend
- No new API endpoints or database fields required

### Recalculation Triggers

Overdue status is recalculated when:
- Component mounts (initial load)
- `todo.dueDate` changes (user edits due date)
- `todo.completed` changes (user toggles completion)
- Component re-renders (React re-evaluates memoized value)

**Note**: Date changes (midnight crossing) require page refresh. Real-time updates not in scope for v1.

---

## Validation Rules

### Date Comparison Logic

- **Granularity**: Day-level (ignore hours, minutes, seconds)
- **Normalization**: Set all times to 00:00:00.000 (midnight) before comparison
- **Timezone**: Use user's local timezone (no UTC conversion in v1)
- **Null Handling**: Treat null `dueDate` as "no due date" → not overdue

### Visual Display Rules

- **Icon Visibility**: Only when `isOverdue === true`
- **Color Consistency**: Must use theme color token `var(--color-primary)`
- **Theme Support**: Icon must be visible in both light and dark modes
- **Accessibility**: Icon must have semantic label for assistive technologies

---

## Edge Cases

### Date Boundary Scenarios

- **Due today at midnight (00:00:00)**: NOT overdue until next day starts
- **Due yesterday**: Overdue (assuming incomplete)
- **Completed overdue todo**: No indicator shown (completion removes overdue state)

### Data Scenarios

- **No due date**: No indicator (cannot be overdue without a due date)
- **Invalid date format**: Treated as null, no indicator shown
- **Future date**: No indicator until date becomes past

### User Actions

- **Mark overdue todo complete**: Indicator disappears immediately
- **Edit due date from past to future**: Indicator disappears
- **Edit due date from future to past**: Indicator appears (if incomplete)
- **Uncheck completed overdue todo**: Indicator reappears if still past due

---

## Performance Considerations

### Optimization Strategy

- **Memoization**: Use `useMemo` to cache `isOverdue` calculation
- **Dependencies**: Only recalculate when `[todo.dueDate, todo.completed]` change
- **Avoid Unnecessary Renders**: Pure function with no side effects

### Scalability

- **Small Lists (<100 todos)**: Negligible performance impact
- **Large Lists (>100 todos)**: Date comparison is O(1) per item, negligible overhead
- **Real-time Updates**: Not implemented; requires page refresh to reflect date changes at midnight

---

## Summary

The overdue indicator feature introduces:
- **No new database entities** (uses existing Todo structure)
- **One derived display property** (`isOverdue` boolean)
- **Minimal performance overhead** (simple date comparison)
- **Frontend-only implementation** (no backend changes)

All calculations follow day-level date comparison logic and respect the todo's completion status.
