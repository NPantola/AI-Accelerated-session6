# Feature Specification: Overdue Todo Items

**Feature Branch**: `001-overdue-todo-indicator`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "Users need a clear, visual way to identify which todos have not been completed by their due date. This helps users quickly spot overdue items without having to manually check dates against today's date."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Identification of Overdue Items (Priority: P1)

Users can immediately see which incomplete todos are past their due date through distinct visual indicators without needing to manually read and compare dates.

**Why this priority**: This is the core value proposition of the feature. Without clear visual distinction, users cannot quickly identify overdue items, which defeats the entire purpose of the feature.

**Independent Test**: Can be fully tested by creating a todo with a past due date and verifying that it displays with distinctive visual styling that differs from non-overdue items. Delivers immediate value by saving users from manually checking dates.

**Acceptance Scenarios**:

1. **Given** a todo item with a due date in the past and status "incomplete", **When** the user views the todo list, **Then** the overdue todo displays with a distinctive visual indicator (color, icon, or styling)
2. **Given** multiple todos with various due dates (past, today, future), **When** the user scans the todo list, **Then** all overdue items are immediately distinguishable from non-overdue items
3. **Given** a todo item with a due date of today, **When** the user views the todo list, **Then** the todo does NOT display as overdue (only past dates are overdue)

---

### User Story 2 - Overdue Status Persists Until Completion (Priority: P2)

Overdue todos remain visually marked as overdue until the user marks them as completed, regardless of how many days have passed.

**Why this priority**: Ensures consistency and prevents confusion. Users need to know that overdue status is tied to completion, not time-based removal.

**Independent Test**: Create an overdue todo, wait or refresh the page, and verify the overdue indicator persists. Mark it complete and verify the indicator is removed. Tests the persistence logic independently.

**Acceptance Scenarios**:

1. **Given** a todo is marked as overdue, **When** the user refreshes the page or reopens the application, **Then** the overdue indicator remains visible
2. **Given** an overdue todo, **When** the user marks it as completed, **Then** the overdue indicator is immediately removed
3. **Given** a completed todo that was previously overdue, **When** the user views the todo list, **Then** the todo displays as completed without any overdue indicator

---

### User Story 3 - No False Positives for Future or Today's Items (Priority: P3)

Todos with due dates of today or in the future are never incorrectly marked as overdue, ensuring users can trust the indicator accuracy.

**Why this priority**: Prevents user confusion and maintains trust in the system. False positives would undermine the value of the feature.

**Independent Test**: Create todos with today's date and future dates, and verify none display overdue indicators. Can be tested independently by creating test data with various future dates.

**Acceptance Scenarios**:

1. **Given** a todo with a due date of today, **When** the user views the todo at any time during that day, **Then** the todo does NOT display an overdue indicator
2. **Given** a todo with a due date in the future, **When** the user views the todo list, **Then** the todo does NOT display an overdue indicator
3. **Given** a todo with no due date set, **When** the user views the todo list, **Then** the todo does NOT display an overdue indicator

---

### Edge Cases

- What happens when a todo's due date is exactly at midnight (00:00:00)? Is it overdue at 00:00:01 or at the start of the next day?
- How does the system handle timezone differences if implemented in the future?
- What happens if a user changes their system date/time?
- How are overdue items displayed if the user filters or sorts the todo list?
- What happens to the overdue indicator when a todo is edited (e.g., due date is changed from past to future)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST visually distinguish incomplete todos with due dates in the past from other todos
- **FR-002**: System MUST compare the todo's due date against the current date to determine overdue status
- **FR-003**: System MUST consider a todo overdue only if its due date is before today AND its status is incomplete
- **FR-004**: System MUST NOT mark todos as overdue if they have no due date set
- **FR-005**: System MUST remove the overdue indicator when a todo is marked as completed
- **FR-006**: System MUST NOT mark todos with due dates of today or in the future as overdue
- **FR-007**: System MUST display overdue indicators consistently across both light and dark theme modes
- **FR-008**: System MUST recalculate overdue status when the todo list is loaded or refreshed
- **FR-009**: System MUST immediately update the overdue indicator when a todo's completion status changes
- **FR-010**: System MUST immediately update the overdue indicator when a todo's due date is modified

### Key Entities *(include if feature involves data)*

- **Todo Item**: Each todo has a due date (optional), completion status (complete/incomplete), and visual display properties. Overdue status is derived from comparing the due date to the current date and checking completion status.
- **Overdue Indicator**: A visual element or styling applied to todo items. This is a derived display property, not a stored attribute. It is calculated based on the todo's due date and completion status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify overdue items within 2 seconds of viewing the todo list without reading date text
- **SC-002**: The overdue indicator is visible and distinguishable in both light and dark theme modes
- **SC-003**: Users can distinguish between overdue, current (due today), and future todos at a glance
- **SC-004**: Overdue status updates immediately (within 500ms) when a todo is marked complete or its due date is changed
- **SC-005**: 100% of incomplete todos with past due dates display the overdue indicator; 0% false positives (no current or future todos incorrectly marked as overdue)

## Assumptions

- Todos already have a due date field available in the data model
- The application already has access to the current date/time from the user's system
- Users understand that "overdue" means a task was not completed by its due date
- All dates are compared using the user's local date (no timezone conversions required for v1)
- The visual indicator should follow the project's established Halloween theme (orange/purple color palette)
- Overdue indication is a frontend display feature; no changes to backend data storage are required
- Completed todos can be displayed in the list (they exist and are visible, just marked as complete)
- Date comparison uses day-level granularity (not hour/minute) - a todo due "2026-06-03" becomes overdue on "2026-06-04"
