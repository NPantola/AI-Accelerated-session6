# Frontend Component Contracts: Todo Priority

**Feature**: Todo Priority Levels
**Date**: 2026-06-04

## PriorityBadge Component (NEW)

### Props Contract

```typescript
{
  priority: string,        // Required: "high", "medium", or "low"
  className?: string,      // Optional: Additional CSS classes
}
```

### Rendering Contract

**HTML Structure**:
```html
<span 
  className="priority-badge priority-badge-high" 
  aria-label="High priority" 
  role="img"
>
  <span className="priority-icon">!</span>
  <span className="priority-label">High</span>
</span>
```

**CSS Requirements**:
- `.priority-badge` base class applies common styling (padding, border-radius, display flex)
- `.priority-badge-high` applies red color scheme
- `.priority-badge-medium` applies orange color scheme (uses `--color-primary`)
- `.priority-badge-low` applies blue color scheme
- Responsive sizing: compact on mobile (<640px), full on desktop

**Visual Output by Priority**:
- **High**: Red badge with "!" icon + "High" label
- **Medium**: Orange badge with "●" icon + "Medium" label  
- **Low**: Blue badge with "▼" icon + "Low" label

**Accessibility Contract**:
- `role="img"` indicates semantic icon
- `aria-label` provides screen reader text (e.g., "High priority")
- Icon + text + color provide multiple distinction methods (color-blind accessible)

**Performance Contract**:
- Wrapped in `React.memo` to prevent unnecessary re-renders
- O(1) configuration lookup via priorityUtils
- No side effects (pure presentational component)

---

## PrioritySelector Component (NEW)

### Props Contract

```typescript
{
  value: string,                // Required: Current priority ("high", "medium", or "low")
  onChange: (priority: string) => void,  // Required: Callback when priority changes
  disabled?: boolean,           // Optional: Disable all buttons (default: false)
  className?: string,           // Optional: Additional CSS classes
}
```

### Rendering Contract

**HTML Structure**:
```html
<div className="priority-selector" role="group" aria-label="Priority selection">
  <button
    type="button"
    className="priority-button priority-button-high selected"
    onClick={handleClick}
    disabled={false}
    aria-pressed="true"
  >
    High
  </button>
  <button
    type="button"
    className="priority-button priority-button-medium"
    onClick={handleClick}
    disabled={false}
    aria-pressed="false"
  >
    Medium
  </button>
  <button
    type="button"
    className="priority-button priority-button-low"
    onClick={handleClick}
    disabled={false}
    aria-pressed="false"
  >
    Low
  </button>
</div>
```

**Interaction Contract**:
- Click any button to select that priority
- `onChange(priority)` called with selected value ("high", "medium", or "low")
- Visual feedback: selected button has `.selected` class
- Keyboard accessible: Tab to navigate, Enter/Space to select

**CSS Requirements**:
- `.priority-selector` container uses flexbox horizontal layout
- `.priority-button` base class for all buttons
- `.selected` class highlights currently selected button
- Buttons have 8px spacing between them (`--space-xs`)
- Hover and focus states for accessibility

**Accessibility Contract**:
- `role="group"` with `aria-label="Priority selection"` for semantic grouping
- `aria-pressed` indicates selection state for each button
- `type="button"` prevents form submission
- Keyboard navigation supported

**State Management**:
- Controlled component: value prop controls selection
- Calls onChange with new priority when user clicks button
- No internal state (fully controlled by parent)

---

## TodoCard Component (Modified)

### Props Contract (Extended)

```typescript
{
  todo: {
    id: number,
    title: string,
    dueDate: string | null,
    completed: boolean,
    priority: string,        // NEW: "high", "medium", or "low"
    createdAt: string
  },
  onToggle: (id: number) => Promise<void>,
  onEdit: (id: number, title: string, dueDate: string | null, priority: string) => Promise<void>,  // MODIFIED: Added priority param
  onDelete: (id: number) => void,
  isLoading: boolean
}
```

### Display Contract (Modified Layout)

**Visual Layout** (left to right):
1. **PriorityBadge** (NEW: positioned at left edge)
2. Checkbox (completion toggle)
3. Overdue Icon (if applicable, existing feature)
4. Todo title text
5. Due date (formatted)
6. Action buttons (Edit, Delete)

**Layout Example**:
```
[🔴!] ☐ ⏰ Buy Halloween candy  Due: Oct 30  [✎][✕]
```

**Rendering Rules**:
- Priority badge ALWAYS displayed (every todo has priority)
- Priority badge positioned before checkbox
- Priority badge uses PriorityBadge component
- Overdue icon (if present) positioned after checkbox, before title

**Code Integration**:
```javascript
<div className="todo-card">
  <PriorityBadge priority={todo.priority} />
  
  <input type="checkbox" ... />
  
  {isOverdue && <OverdueIcon />}
  
  <div className="todo-content">
    <h3>{todo.title}</h3>
    {todo.dueDate && <p>Due: {formatDate(todo.dueDate)}</p>}
  </div>
  
  <div className="todo-actions">...</div>
</div>
```

**Changes from Original**:
- ✅ Added PriorityBadge component before checkbox
- ✅ onEdit callback extended with priority parameter
- ✅ Props include todo.priority field

---

## TodoForm Component (Modified)

### Props Contract (Extended)

```typescript
{
  onSubmit: (title: string, dueDate: string | null, priority: string) => Promise<void>,  // MODIFIED: Added priority param
  isLoading: boolean,
  initialData?: {          // Optional: For edit mode
    title: string,
    dueDate: string | null,
    priority: string       // NEW: Initial priority
  }
}
```

### Form Fields Contract (Extended)

**Fields**:
1. Title input (existing)
2. Due date input (existing)
3. **Priority selector** (NEW: PrioritySelector component)

**Form Layout**:
```html
<form onSubmit={handleSubmit}>
  <input type="text" name="title" placeholder="Todo title" />
  
  <input type="date" name="dueDate" />
  
  <PrioritySelector 
    value={priority}
    onChange={setPriority}
    disabled={isLoading}
  />
  
  <button type="submit">Save</button>
  <button type="button" onClick={onCancel}>Cancel</button>
</form>
```

**State Management**:
- Maintains `priority` state (default: "medium")
- Updates priority when user interacts with PrioritySelector
- Includes priority in onSubmit callback
- Initializes with `initialData.priority` if in edit mode

**Submission Contract**:
- `onSubmit(title, dueDate, priority)` called with all three values
- Priority is always provided (never null/undefined)
- Validation: Ensure priority is one of valid values before submission

**Changes from Original**:
- ✅ Added PrioritySelector component to form
- ✅ onSubmit callback extended with priority parameter
- ✅ State management includes priority
- ✅ initialData includes priority for edit mode

---

## priorityUtils.js Module (NEW)

### Export Contract

```javascript
// Constants
export const PRIORITY_LEVELS: string[];        // ["high", "medium", "low"]
export const DEFAULT_PRIORITY: string;         // "medium"

export const PRIORITY_CONFIG: {
  high: PriorityConfig,
  medium: PriorityConfig,
  low: PriorityConfig
};

// Types
interface PriorityConfig {
  label: string;        // Display label: "High", "Medium", "Low"
  icon: string;         // Unicode icon: "!", "●", "▼"
  className: string;    // CSS class: "priority-badge-high", etc.
  ariaLabel: string;    // Screen reader text: "High priority", etc.
}

// Functions
export function isValidPriority(priority: string): boolean;
export function getPriorityConfig(priority: string): PriorityConfig;
export function normalizePriority(priority: string | null | undefined): string;
```

### Function Contracts

**isValidPriority(priority)**:
- **Input**: Any string value
- **Output**: Boolean (true if valid priority, false otherwise)
- **Contract**: Returns true only for "high", "medium", or "low"

**getPriorityConfig(priority)**:
- **Input**: Priority string ("high", "medium", or "low")
- **Output**: PriorityConfig object with display properties
- **Contract**: Returns config for given priority, or DEFAULT_PRIORITY config if invalid

**normalizePriority(priority)**:
- **Input**: Priority string, null, or undefined
- **Output**: Normalized priority string ("high", "medium", or "low")
- **Contract**: Always returns valid priority, defaults to "medium" for invalid/null/undefined input

---

## todoService.js Module (Modified)

### API Methods (Extended)

**createTodo(title, dueDate, priority)**:
```javascript
async function createTodo(title, dueDate = null, priority = 'medium') {
  const response = await axios.post('/api/todos', {
    title,
    dueDate,
    priority  // NEW: Include priority in request
  });
  return response.data;
}
```

**updateTodo(id, title, dueDate, priority)**:
```javascript
async function updateTodo(id, title, dueDate = null, priority) {
  const response = await axios.put(`/api/todos/${id}`, {
    title,
    dueDate,
    priority  // NEW: Include priority in request
  });
  return response.data;
}
```

**getAllTodos()**:
```javascript
async function getAllTodos() {
  const response = await axios.get('/api/todos');
  // Response data includes priority field for each todo
  return response.data;
}
```

**Changes**:
- ✅ createTodo accepts priority parameter (defaults to "medium")
- ✅ updateTodo accepts priority parameter
- ✅ getAllTodos returns todos with priority field

---

## CSS Contract

### New Styles Required

**Priority Badge Styles** (priority.css):
```css
.priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 600;
  margin-right: var(--space-xs);
  line-height: 1.2;
}

.priority-badge-high {
  background-color: var(--priority-high-bg);
  color: var(--priority-high-text);
}

.priority-badge-medium {
  background-color: var(--color-primary);
  color: var(--text-primary);
}

.priority-badge-low {
  background-color: var(--priority-low-bg);
  color: var(--priority-low-text);
}
```

**Priority Selector Styles** (priority.css):
```css
.priority-selector {
  display: flex;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
}

.priority-button {
  flex: 1;
  padding: 8px 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.priority-button:hover {
  border-color: var(--color-primary);
}

.priority-button.selected {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: white;
}
```

**Theme Tokens** (add to theme.css):
```css
:root {
  /* Priority colors - Light mode */
  --priority-high-bg: #fee2e2;
  --priority-high-text: #991b1b;
  --priority-low-bg: #dbeafe;
  --priority-low-text: #1e40af;
}

[data-theme="dark"] {
  /* Priority colors - Dark mode */
  --priority-high-bg: #7f1d1d;
  --priority-high-text: #fca5a5;
  --priority-low-bg: #1e3a8a;
  --priority-low-text: #93c5fd;
}
```

---

## Testing Contract

### Unit Test Coverage

**PriorityBadge Component**:
- ✅ Renders with high priority (red badge, ! icon)
- ✅ Renders with medium priority (orange badge, ● icon)
- ✅ Renders with low priority (blue badge, ▼ icon)
- ✅ Has correct aria-label for each priority
- ✅ Has correct CSS classes

**PrioritySelector Component**:
- ✅ Renders three buttons (High, Medium, Low)
- ✅ Highlights selected button
- ✅ Calls onChange with correct priority when clicked
- ✅ Disables all buttons when disabled prop is true
- ✅ Has correct ARIA attributes

**TodoCard Component**:
- ✅ Displays PriorityBadge for each todo
- ✅ PriorityBadge positioned before checkbox
- ✅ Passes correct priority to PriorityBadge
- ✅ Existing tests continue to pass (backward compatible)

**TodoForm Component**:
- ✅ Displays PrioritySelector
- ✅ Submits with selected priority
- ✅ Defaults to "medium" if no selection
- ✅ Initializes with correct priority in edit mode

**priorityUtils Module**:
- ✅ isValidPriority returns true for valid priorities
- ✅ isValidPriority returns false for invalid priorities
- ✅ getPriorityConfig returns correct config for each priority
- ✅ normalizePriority handles null/undefined gracefully
- ✅ normalizePriority defaults to "medium" for invalid values

---

## Summary

The priority feature introduces:
- **2 new components**: PriorityBadge (display), PrioritySelector (input)
- **1 new utility module**: priorityUtils.js (validation, configuration)
- **2 modified components**: TodoCard (displays badge), TodoForm (adds selector)
- **1 modified service**: todoService.js (includes priority in API calls)
- **New CSS**: priority.css + theme tokens for priority colors

All components follow React best practices:
- Pure, functional components
- Controlled component pattern
- Props validation via JSDoc
- Accessibility (ARIA labels, keyboard navigation)
- Performance optimization (React.memo, useMemo)
- Theme support (CSS custom properties)
