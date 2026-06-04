# API Contracts: Todo Priority

**Feature**: Todo Priority Levels
**Date**: 2026-06-04

## Overview

The priority feature extends existing todo API endpoints to include a priority field. No new endpoints are created. All changes are backward compatible with optional priority parameters.

---

## Modified API Endpoints

### GET /api/todos

**Description**: Fetch all todos (priority field added to response)

**Request**: None (unchanged)

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Buy Halloween candy",
    "dueDate": "2026-10-30",
    "completed": 0,
    "priority": "high",
    "createdAt": "2026-06-04T10:00:00.000Z"
  },
  {
    "id": 2,
    "title": "Plan costume party",
    "dueDate": null,
    "completed": 1,
    "priority": "medium",
    "createdAt": "2026-06-03T14:30:00.000Z"
  },
  {
    "id": 3,
    "title": "Decorate house",
    "dueDate": "2026-10-28",
    "completed": 0,
    "priority": "low",
    "createdAt": "2026-06-02T09:15:00.000Z"
  }
]
```

**Changes**:
- ✅ Added `priority` field to each todo object
- ✅ Priority is always present (never null, defaults to "medium")
- ✅ Priority values: "high", "medium", or "low"

**Backward Compatibility**: Existing clients ignoring priority field continue to work

---

### POST /api/todos

**Description**: Create a new todo (priority field added to request/response)

**Request** (priority is optional):
```json
{
  "title": "Buy candy corn",
  "dueDate": "2026-10-29",
  "priority": "high"
}
```

**Request (without priority)**:
```json
{
  "title": "Check costume fit",
  "dueDate": "2026-10-25"
}
```

**Response** (201 Created):
```json
{
  "id": 4,
  "title": "Buy candy corn",
  "dueDate": "2026-10-29",
  "completed": 0,
  "priority": "high",
  "createdAt": "2026-06-04T15:00:00.000Z"
}
```

**Response (without priority in request)**:
```json
{
  "id": 5,
  "title": "Check costume fit",
  "dueDate": "2026-10-25",
  "completed": 0,
  "priority": "medium",
  "createdAt": "2026-06-04T15:05:00.000Z"
}
```

**Validation Rules**:
- `priority` is optional in request
- If provided, MUST be one of: "high", "medium", "low"
- If omitted or null, defaults to "medium"
- Case-insensitive (backend normalizes to lowercase)

**Error Responses**:

**400 Bad Request** (invalid priority):
```json
{
  "error": "Invalid priority. Must be one of: high, medium, low"
}
```

**400 Bad Request** (missing title):
```json
{
  "error": "Title is required"
}
```

**Changes**:
- ✅ Added optional `priority` field to request body
- ✅ Added `priority` field to response (always present)
- ✅ Added validation for priority values

**Backward Compatibility**: Clients not sending priority default to "medium"

---

### PUT /api/todos/:id

**Description**: Update an existing todo (priority field added to request/response)

**Request** (priority is optional):
```json
{
  "title": "Buy MORE candy corn",
  "dueDate": "2026-10-28",
  "priority": "medium"
}
```

**Request (without priority)**:
```json
{
  "title": "Updated title only",
  "dueDate": "2026-10-28"
}
```

**Response** (200 OK):
```json
{
  "id": 4,
  "title": "Buy MORE candy corn",
  "dueDate": "2026-10-28",
  "completed": 0,
  "priority": "medium",
  "createdAt": "2026-06-04T15:00:00.000Z"
}
```

**Validation Rules**:
- `priority` is optional in request
- If provided, MUST be one of: "high", "medium", "low"
- If omitted, priority remains unchanged
- Case-insensitive (backend normalizes to lowercase)

**Error Responses**:

**400 Bad Request** (invalid priority):
```json
{
  "error": "Invalid priority. Must be one of: high, medium, low"
}
```

**404 Not Found** (todo doesn't exist):
```json
{
  "error": "Todo not found"
}
```

**Changes**:
- ✅ Added optional `priority` field to request body
- ✅ Added `priority` field to response (always present)
- ✅ Added validation for priority values

**Backward Compatibility**: Clients not sending priority leave existing value unchanged

---

### PATCH /api/todos/:id/toggle

**Description**: Toggle todo completion status (priority field added to response only)

**Request**: None (unchanged)

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Buy Halloween candy",
  "dueDate": "2026-10-30",
  "completed": 1,
  "priority": "high",
  "createdAt": "2026-06-04T10:00:00.000Z"
}
```

**Changes**:
- ✅ Added `priority` field to response
- ⚠️ Priority value remains unchanged when toggling completion

**Backward Compatibility**: Full backward compatibility, only response extended

---

### DELETE /api/todos/:id

**Description**: Delete a todo (no changes)

**Request**: None

**Response** (200 OK):
```json
{
  "message": "Todo deleted successfully"
}
```

**Changes**: None

---

## Data Types

### Priority Field Contract

**Type**: String (enum)

**Valid Values**:
- `"high"` - High priority (urgent/important)
- `"medium"` - Medium priority (default)
- `"low"` - Low priority (non-urgent)

**Rules**:
- MUST be lowercase
- MUST be one of the three valid values
- MUST NOT be null (defaults to "medium" if omitted)
- Case-insensitive on input (backend normalizes)

### Request Validation

**Frontend Responsibility**:
- Send only valid priority values ("high", "medium", "low")
- Send lowercase strings
- Omit priority field if user doesn't select one (backend defaults)

**Backend Responsibility**:
- Validate priority is one of valid values
- Normalize to lowercase if needed
- Return 400 Bad Request if invalid
- Default to "medium" if null/undefined

---

## Backward Compatibility

### For Existing Clients

**Before Priority Feature**:
```json
POST /api/todos
{
  "title": "Old client request",
  "dueDate": "2026-10-30"
}

Response:
{
  "id": 1,
  "title": "Old client request",
  "dueDate": "2026-10-30",
  "completed": 0,
  "priority": "medium",  // NEW: Added with default value
  "createdAt": "2026-06-04T10:00:00.000Z"
}
```

**After Priority Feature**:
- Existing clients receive extra `priority` field in responses
- Existing clients can ignore `priority` field
- Existing clients not sending `priority` get default value
- **No breaking changes**: All existing requests/responses work unchanged

### For New Clients

**With Priority Feature**:
```json
POST /api/todos
{
  "title": "New client request",
  "dueDate": "2026-10-30",
  "priority": "high"  // NEW: Client can specify priority
}

Response:
{
  "id": 2,
  "title": "New client request",
  "dueDate": "2026-10-30",
  "completed": 0,
  "priority": "high",  // Honors client selection
  "createdAt": "2026-06-04T10:10:00.000Z"
}
```

---

## Testing Contract

### Unit Test Coverage

**Backend Route Handlers**:
- ✅ POST with valid priority returns 201 with correct priority
- ✅ POST without priority returns 201 with "medium" priority
- ✅ POST with invalid priority returns 400 error
- ✅ PUT with valid priority returns 200 with updated priority
- ✅ PUT without priority returns 200 with unchanged priority
- ✅ PUT with invalid priority returns 400 error
- ✅ GET returns all todos with priority field
- ✅ PATCH toggle returns todo with priority field unchanged

**Backend Service Layer**:
- ✅ createTodo with priority stores correct value
- ✅ createTodo without priority defaults to "medium"
- ✅ updateTodo with priority updates field
- ✅ updateTodo without priority preserves existing value

---

## Summary

The priority feature extends existing API endpoints with minimal changes:
- **GET /api/todos**: Adds priority to response
- **POST /api/todos**: Accepts optional priority, returns priority
- **PUT /api/todos/:id**: Accepts optional priority, returns priority
- **PATCH /api/todos/:id/toggle**: Returns priority (unchanged by toggle)
- **DELETE /api/todos/:id**: No changes

**Key Principles**:
- Backward compatible: All existing requests work unchanged
- Optional input: Priority is optional in POST/PUT, defaults to "medium"
- Always present in output: Response always includes priority (never null)
- Validated at backend: Invalid priorities return 400 Bad Request
- No new endpoints: Extends existing RESTful structure
