# Data Model: Todo Priority Levels

**Feature**: Todo Priority Levels
**Date**: 2026-06-04
**Branch**: 002-todo-priority

## Entities

### Todo Item (Extended)

**Description**: Core entity representing a todo task. Extended with priority field for this feature.

**Fields**:
- `id` (number, primary key): Unique identifier for the todo
- `title` (string, required, max 255 chars): Todo task description
- `dueDate` (string, nullable, ISO 8601 format): Optional due date (YYYY-MM-DD)
- `completed` (boolean/integer): Completion status (0 = incomplete, 1 = complete in SQLite)
- **`priority`** (string, required, enum): Priority level - **NEW FIELD**
- `createdAt` (timestamp): Creation timestamp

**Relationships**: None (standalone entity)

**Validation Rules**:
- `title`: Non-empty string, max 255 characters
- `dueDate`: Valid ISO 8601 date string (YYYY-MM-DD) or null
- `completed`: Boolean value (stored as 0/1 in SQLite)
- **`priority`**: MUST be one of: "high", "medium", or "low" (lowercase)

**State Transitions**:
- Incomplete → Complete: User marks todo as done (priority remains unchanged)
- Complete → Incomplete: User unchecks completed todo (priority remains unchanged)
- Priority changes: User can change priority at any time regardless of completion status

---

### Priority Level (Value Object)

**Description**: Enumerated value representing the urgency/importance level of a todo. This is NOT a stored entity; it is a constrained value within Todo.

**Valid Values**:
- **"high"**: Urgent, high-importance tasks (displayed with red badge and ! icon)
- **"medium"**: Normal-priority tasks (displayed with orange badge and ● icon) - DEFAULT
- **"low"**: Low-priority, non-urgent tasks (displayed with blue badge and ▼ icon)

**Storage Format**: Lowercase string enum stored in todo.priority field

**Display Configuration**:
```javascript
{
  "high": {
    "label": "High",
    "icon": "!",
    "badgeClass": "priority-badge-high",
    "colorBg": "--priority-high-bg",
    "colorText": "--priority-high-text",
    "ariaLabel": "High priority"
  },
  "medium": {
    "label": "Medium",
    "icon": "●",
    "badgeClass": "priority-badge-medium",
    "colorBg": "--color-primary",
    "colorText": "--text-primary",
    "ariaLabel": "Medium priority"
  },
  "low": {
    "label": "Low",
    "icon": "▼",
    "badgeClass": "priority-badge-low",
    "colorBg": "--priority-low-bg",
    "colorText": "--priority-low-text",
    "ariaLabel": "Low priority"
  }
}
```

---

## Database Schema Changes

### SQLite Migration

**Table**: `todos` (existing table)

**Migration Script**:
```sql
-- Add priority column with CHECK constraint and default value
ALTER TABLE todos 
ADD COLUMN priority TEXT DEFAULT 'medium' 
CHECK(priority IN ('high', 'medium', 'low'));

-- Verify migration
SELECT id, title, priority FROM todos LIMIT 5;
```

**Migration Notes**:
- All existing todos automatically get `priority = 'medium'` due to DEFAULT clause
- CHECK constraint prevents invalid values at database level
- Migration is non-breaking: existing queries work without changes
- New queries can optionally include priority

**Rollback Strategy** (if needed):
```sql
-- Note: SQLite doesn't support DROP COLUMN in older versions
-- Workaround: Recreate table without priority column
-- For v1, rollback not necessary (default value is benign)
```

---

## Data Flow

### Frontend → Backend (Create/Update)

1. **User selects priority** in TodoForm component (button group)
2. **Frontend validates** priority value is one of ["high", "medium", "low"]
3. **API request** sent with priority in body:
   ```json
   POST /api/todos
   {
     "title": "Buy Halloween candy",
     "dueDate": "2026-10-30",
     "priority": "high"
   }
   ```
4. **Backend validates** priority value (route handler)
5. **Database insert** with validated priority
6. **Response returned** with full todo including priority

### Backend → Frontend (Read)

1. **Database query** fetches todos with priority column
2. **Backend serializes** priority in response:
   ```json
   GET /api/todos
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
3. **Frontend receives** todo data with priority
4. **PriorityBadge component** renders based on priority value

### Priority Display Logic

```javascript
// In TodoCard component
import { getPriorityConfig } from '../utils/priorityUtils';

const priorityConfig = getPriorityConfig(todo.priority);
// Returns: { label: "High", icon: "!", className: "priority-badge-high", ... }

// Render:
<PriorityBadge priority={todo.priority} config={priorityConfig} />
```

---

## Validation Rules

### Frontend Validation

- **User Input**: Button group only allows selection of valid priorities (["high", "medium", "low"])
- **Null Handling**: If priority is null/undefined in received data, default to "medium"
- **Case Sensitivity**: Normalize to lowercase before sending to backend

### Backend Validation

- **Route Handler**: Validate priority is one of ["high", "medium", "low"] before database operation
- **Error Response**: Return 400 Bad Request with message if invalid:
  ```json
  {
    "error": "Invalid priority. Must be one of: high, medium, low"
  }
  ```
- **Default Value**: If priority is null/undefined in request, default to "medium"

### Database Validation

- **CHECK Constraint**: `CHECK(priority IN ('high', 'medium', 'low'))` prevents invalid data at database level
- **Default Value**: `DEFAULT 'medium'` ensures all rows have valid priority

---

## Edge Cases

### Data Scenarios

- **Null priority in database**: Should not occur (default value prevents), but if found, frontend defaults to "medium"
- **Invalid priority string**: Database CHECK constraint prevents, but frontend should handle gracefully (default to "medium" + log warning)
- **Missing priority field**: New field, so existing todos get "medium" via DEFAULT clause
- **Case mismatch**: Backend normalizes to lowercase, frontend validates only lowercase

### User Actions

- **Change priority of completed todo**: Allowed - priority and completion are independent
- **Create todo without selecting priority**: Defaults to "medium"
- **Edit todo without changing priority**: Priority field remains unchanged in database

---

## Performance Considerations

### Query Performance

- **No index needed**: Priority has low cardinality (3 values), filtering not in scope for v1
- **SELECT queries**: Include priority in column list (no performance impact)
- **INSERT/UPDATE queries**: Priority is simple TEXT field, negligible overhead

### Frontend Performance

- **Memoization**: PriorityBadge component wrapped in React.memo to prevent unnecessary re-renders
- **Config lookup**: O(1) dictionary lookup for priority configuration
- **Bundle size**: Priority utilities add < 1KB to bundle

---

## Migration Strategy

### Phase 1: Database Migration

1. Run ALTER TABLE to add priority column with DEFAULT 'medium'
2. Verify all existing todos have priority = 'medium'
3. No data backfill needed (default handles it)

### Phase 2: API Updates

1. Update GET /api/todos to include priority in response
2. Update POST /api/todos to accept optional priority
3. Update PUT /api/todos to accept optional priority
4. Add validation in route handlers

### Phase 3: Frontend Updates

1. Update todoService.js to send/receive priority
2. Create PriorityBadge and PrioritySelector components
3. Update TodoCard to display priority badge
4. Update TodoForm to include priority selector
5. Add priority utilities and tests

### Backward Compatibility

- **Existing todos**: Automatically get "medium" priority via DEFAULT clause
- **API**: Priority is optional in requests, maintains backward compatibility
- **Frontend**: Gracefully handles missing priority (defaults to "medium")

---

## Summary

The priority feature extends the existing Todo entity with a single priority field (TEXT enum: "high", "medium", "low"). The implementation:
- **Minimal schema changes**: One column with CHECK constraint and DEFAULT value
- **Self-documenting storage**: String enum is readable in database
- **Backward compatible**: Default value handles existing data
- **Performant**: Simple TEXT field, no indexes needed
- **Validated at all layers**: Frontend, backend, and database validation

Priority is treated as an independent attribute that doesn't affect other todo properties (due date, completion status).
