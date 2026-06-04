# API Contracts: Overdue Indicator

**Feature**: Overdue Todo Items
**Date**: 2026-06-04

## Overview

**No API changes required for this feature.**

The overdue indicator is a frontend-only feature that derives display state from existing todo data. The backend API remains unchanged.

---

## Existing API Contracts (Unchanged)

### GET /api/todos

**Description**: Fetch all todos

**Request**: None

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "dueDate": "2026-06-03",
    "completed": 0,
    "createdAt": "2026-06-01T10:00:00.000Z"
  },
  {
    "id": 2,
    "title": "Review pull request",
    "dueDate": null,
    "completed": 1,
    "createdAt": "2026-06-02T14:30:00.000Z"
  }
]
```

**Notes**:
- `completed`: Integer (0 = incomplete, 1 = complete) in SQLite
- `dueDate`: ISO 8601 date string (YYYY-MM-DD) or `null`
- Frontend computes overdue status from `dueDate` and `completed`

---

### POST /api/todos

**Description**: Create a new todo

**Request**:
```json
{
  "title": "New todo task",
  "dueDate": "2026-06-10"  // Optional, can be null
}
```

**Response** (201 Created):
```json
{
  "id": 3,
  "title": "New todo task",
  "dueDate": "2026-06-10",
  "completed": 0,
  "createdAt": "2026-06-04T12:00:00.000Z"
}
```

---

### PUT /api/todos/:id

**Description**: Update a todo's title and/or due date

**Request**:
```json
{
  "title": "Updated title",
  "dueDate": "2026-06-15"  // Optional, can be null
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Updated title",
  "dueDate": "2026-06-15",
  "completed": 0,
  "createdAt": "2026-06-01T10:00:00.000Z"
}
```

---

### PATCH /api/todos/:id/toggle

**Description**: Toggle todo completion status

**Request**: None

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "dueDate": "2026-06-03",
  "completed": 1,  // Toggled to complete
  "createdAt": "2026-06-01T10:00:00.000Z"
}
```

---

### DELETE /api/todos/:id

**Description**: Delete a todo

**Request**: None

**Response** (204 No Content)

---

## Frontend Data Contract

### Todo Object Structure

The frontend receives todo objects from the API with the following structure:

```typescript
interface Todo {
  id: number;               // Unique identifier
  title: string;            // Todo title (max 255 characters)
  dueDate: string | null;   // ISO 8601 date (YYYY-MM-DD) or null
  completed: number;        // 0 = incomplete, 1 = complete (SQLite integer)
  createdAt: string;        // ISO 8601 timestamp
}
```

**Frontend Conversion**:
- Frontend converts `completed` from integer (0/1) to boolean (false/true) for easier handling
- API returns integer; frontend logic treats 0 as `false` and 1 as `true`

### Overdue Calculation (Frontend Only)

```javascript
// Frontend computes overdue status from API data
const isOverdue = (todo) => {
  if (!todo.dueDate || todo.completed) return false;
  
  const today = new Date().setHours(0, 0, 0, 0);
  const due = new Date(todo.dueDate).setHours(0, 0, 0, 0);
  
  return due < today;
};
```

**No Backend Computation**:
- Backend does NOT compute or return `isOverdue` flag
- Overdue status is derived on the frontend based on user's local date/time
- Keeps API simple and stateless

---

## Why No Backend Changes?

### Rationale

1. **Stateless API**: Overdue status depends on the current date, which varies by user and changes daily. Backend would need to recalculate on every request.

2. **Timezone Independence**: Users may be in different timezones. Frontend uses user's local date for accurate "today" comparison.

3. **Performance**: Simple frontend calculation (O(1)) is negligible compared to network latency.

4. **Separation of Concerns**: Display logic (visual indicators) belongs in the presentation layer (frontend), not the data layer (backend).

5. **KISS Principle**: Simplest solution is to compute derived state where it's needed (frontend) rather than adding backend complexity.

---

## Data Flow

```
Backend (SQLite)
    ↓
    [API: GET /api/todos]
    ↓
Frontend receives: { id, title, dueDate, completed, createdAt }
    ↓
    [Frontend computes: isOverdue = dueDate < today && !completed]
    ↓
    [Conditional Render: Show <OverdueIcon /> if isOverdue]
    ↓
User sees: ⏰ icon for overdue incomplete todos
```

**No data flows back to backend**:
- Overdue status is NOT persisted
- No API updates required
- Pure frontend presentation feature

---

## Summary

- **Backend API**: Unchanged, no modifications needed
- **Frontend Logic**: Computes overdue status from existing todo data
- **Separation**: Backend provides data, frontend handles display logic
- **Efficiency**: Avoids unnecessary backend computation and API bloat
