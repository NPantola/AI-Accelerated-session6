# Research: Todo Priority Levels

**Feature**: Todo Priority Levels
**Date**: 2026-06-04
**Branch**: 002-todo-priority

## Research Tasks

### 1. Priority Storage and Validation in SQLite

**Decision**: Use TEXT column with CHECK constraint for priority field

**Rationale**:
- SQLite TEXT type is efficient for short string enums
- CHECK constraint ensures data integrity at database level: `CHECK(priority IN ('high', 'medium', 'low'))`
- Self-documenting in database queries and exports
- No mapping logic needed between storage and application layer
- Default value handled by `DEFAULT 'medium'` clause
- Migration strategy: ALTER TABLE ADD COLUMN with DEFAULT handles existing rows automatically

**Best Practices**:
- Add CHECK constraint to prevent invalid values at database level
- Use lowercase consistently ("high", "medium", "low") for case-sensitive comparisons
- Set DEFAULT 'medium' so existing todos get sensible priority
- Use prepared statements to prevent SQL injection
- Index not needed (priority has low cardinality, filtering not in scope for v1)

**Alternatives Considered**:
- Integer storage (0/1/2): Rejected - requires mapping logic, less readable
- ENUM type: Rejected - SQLite doesn't have native ENUM, would need application-level enforcement

---

### 2. Priority Badge Visual Design

**Decision**: Use CSS badges with Unicode icons and semantic colors

**Rationale**:
- No external dependencies (constitution KISS principle)
- Unicode icons (!, ●, ▼) are universally supported
- CSS custom properties enable theme support
- Small bundle size (<1KB CSS)
- Accessible with proper aria-labels

**Implementation Approach**:
```css
.priority-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  margin-right: var(--space-xs);
}

.priority-badge-high {
  background-color: var(--priority-high-bg);
  color: var(--priority-high-text);
}

.priority-badge-medium {
  background-color: var(--priority-medium-bg);
  color: var(--priority-medium-text);
}

.priority-badge-low {
  background-color: var(--priority-low-bg);
  color: var(--priority-low-text);
}
```

**Color Tokens** (add to theme.css):
- High: `--priority-high-bg: #fee2e2` (light), `#7f1d1d` (dark); `--priority-high-text: #991b1b` (light), `#fca5a5` (dark)
- Medium: Uses existing `--color-primary` (#ff6b35 light, #ff8c42 dark)
- Low: `--priority-low-bg: #dbeafe` (light), `#1e3a8a` (dark); `--priority-low-text: #1e40af` (light), `#93c5fd` (dark)

**Best Practices**:
- WCAG AA contrast ratio (4.5:1 for text, 3:1 for UI components)
- Icons provide shape distinction for color-blind users
- Light backgrounds prevent visual clutter
- Consistent sizing with 8px grid system

**Alternatives Considered**:
- SVG icons: Rejected - adds complexity, Unicode sufficient
- Icon-only (no badge): Rejected - less prominent, harder to distinguish
- Full-width colored bar: Rejected - too prominent, breaks layout

---

### 3. Button Group Component Pattern

**Decision**: Create reusable PrioritySelector component with accessible button group

**Rationale**:
- React best practice: reusable, testable component
- Single responsibility: only handles priority selection
- Keyboard accessible (Tab navigation, arrow keys, Enter/Space to select)
- ARIA attributes for screen reader support
- Visual feedback for selection state

**Implementation Approach**:
```javascript
function PrioritySelector({ value, onChange, disabled }) {
  const priorities = ['high', 'medium', 'low'];
  
  return (
    <div className="priority-selector" role="group" aria-label="Priority selection">
      {priorities.map((priority) => (
        <button
          key={priority}
          type="button"
          className={`priority-button ${value === priority ? 'selected' : ''}`}
          onClick={() => onChange(priority)}
          disabled={disabled}
          aria-pressed={value === priority}
        >
          {capitalize(priority)}
        </button>
      ))}
    </div>
  );
}
```

**Best Practices**:
- Use `role="group"` with `aria-label` for semantic grouping
- Use `aria-pressed` to indicate selection state
- Type="button" prevents form submission
- Controlled component pattern (value + onChange props)
- Disable prop for loading states

**Alternatives Considered**:
- HTML `<select>` dropdown: Rejected - requires extra click, less visual
- Radio buttons: Rejected - takes more vertical space, less modern
- Segmented control library: Rejected - unnecessary dependency

---

### 4. Backend API Extension Strategy

**Decision**: Extend existing todo endpoints to include priority field

**Rationale**:
- RESTful principles: priority is an attribute of todo resource
- No new routes needed, maintains API simplicity
- Backward compatible: priority is optional in requests, defaults to "medium"
- Consistent with how dueDate and completed fields work

**API Changes**:

**GET /api/todos**
- Response includes priority field:
```json
[
  {
    "id": 1,
    "title": "Buy Halloween candy",
    "dueDate": "2026-10-30",
    "completed": 0,
    "priority": "high",
    "createdAt": "2026-06-04T10:00:00.000Z"
  }
]
```

**POST /api/todos**
- Accept optional priority in request body:
```json
{
  "title": "Plan costume",
  "dueDate": "2026-10-25",
  "priority": "medium"  // Optional, defaults to "medium" if omitted
}
```

**PUT /api/todos/:id**
- Accept optional priority in update:
```json
{
  "title": "Updated title",
  "dueDate": "2026-10-26",
  "priority": "high"  // Optional
}
```

**Validation**:
- Backend validates priority is one of: "high", "medium", "low"
- Returns 400 Bad Request if invalid
- Silently defaults to "medium" if null/undefined

**Best Practices**:
- Validate priority values in route handler before database call
- Use prepared statements to prevent SQL injection
- Return full updated todo object after POST/PUT
- Include priority in all todo responses for consistency

**Alternatives Considered**:
- Separate PATCH /api/todos/:id/priority: Rejected - over-engineering for simple field
- Query parameter ?priority=high: Rejected - body parameters are standard for POST/PUT

---

### 5. Priority Utility Functions

**Decision**: Create priorityUtils.js with validation and configuration helpers

**Rationale**:
- DRY: Centralize priority logic used across multiple components
- Single source of truth for priority configuration
- Easy to test in isolation
- Consistent priority handling across application

**Utility Functions**:

```javascript
/**
 * Valid priority levels
 */
export const PRIORITY_LEVELS = ['high', 'medium', 'low'];
export const DEFAULT_PRIORITY = 'medium';

/**
 * Priority configuration with visual properties
 */
export const PRIORITY_CONFIG = {
  high: {
    label: 'High',
    icon: '!',
    className: 'priority-badge-high',
    ariaLabel: 'High priority'
  },
  medium: {
    label: 'Medium',
    icon: '●',
    className: 'priority-badge-medium',
    ariaLabel: 'Medium priority'
  },
  low: {
    label: 'Low',
    icon: '▼',
    className: 'priority-badge-low',
    ariaLabel: 'Low priority'
  }
};

/**
 * Validates if a priority value is valid
 * @param {string} priority - Priority to validate
 * @returns {boolean} True if valid
 */
export function isValidPriority(priority) {
  return PRIORITY_LEVELS.includes(priority);
}

/**
 * Gets priority configuration or default
 * @param {string} priority - Priority level
 * @returns {object} Priority config object
 */
export function getPriorityConfig(priority) {
  return PRIORITY_CONFIG[priority] || PRIORITY_CONFIG[DEFAULT_PRIORITY];
}

/**
 * Normalizes priority value (handles null, undefined, invalid)
 * @param {string|null|undefined} priority - Priority to normalize
 * @returns {string} Normalized priority ("high", "medium", or "low")
 */
export function normalizePriority(priority) {
  if (!priority || !isValidPriority(priority)) {
    return DEFAULT_PRIORITY;
  }
  return priority.toLowerCase();
}
```

**Best Practices**:
- Export constants for reuse
- Pure functions with no side effects
- JSDoc documentation for all functions
- Handle edge cases (null, undefined, invalid values)
- Return sensible defaults rather than throwing errors

**Alternatives Considered**:
- Class-based priority manager: Rejected - overkill for simple utilities
- Separate file per function: Rejected - small functions, keep together

---

## Summary

The priority feature will be implemented using:
- **Storage**: SQLite TEXT column with CHECK constraint and DEFAULT 'medium'
- **Visual Design**: CSS badges with Unicode icons (!, ●, ▼) and semantic colors
- **UI Component**: Reusable PrioritySelector button group with accessibility support
- **API**: Extended existing GET/POST/PUT endpoints with optional priority field
- **Utilities**: Centralized priorityUtils.js for validation and configuration

All approaches follow the project's constitution principles: KISS (no unnecessary dependencies), DRY (reusable components and utilities), comprehensive testing (unit + integration tests), and accessibility (ARIA labels, icons + color).
