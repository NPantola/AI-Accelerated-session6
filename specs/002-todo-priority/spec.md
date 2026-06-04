# Feature Specification: Todo Priority Levels

**Feature Branch**: `002-todo-priority`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "Support for assigning priority to todos. Users need a clear, visual way to identify which todos are the highest priority and need to be done first. This helps users distinguish between high and low priority items without having to read each todo."

## Clarifications

### Session 2026-06-04

- Q: What specific visual treatment should be used for priority indicators to ensure both accessibility and brand consistency? → A: Use combined approach with color badges and icons - High: red badge with "!" icon (urgency), Medium: orange badge with "●" icon (fits Halloween theme, uses --color-primary token), Low: blue/gray badge with "▼" icon (calm, low-urgency). This provides multiple visual cues (color + shape + icon) for accessibility including color-blind users.
- Q: Should priority be stored as string or integer in the database? → A: Store as lowercase string enum ("high", "medium", "low") for readability, easier debugging, self-documenting API, and simpler maintenance. Backend column: priority TEXT DEFAULT 'medium'.
- Q: What UI control should be used for priority selection in the todo form? → A: Use horizontal button group (segmented control) with three buttons labeled "High", "Medium", "Low". All options visible at once, single click to select, clear visual feedback, faster than dropdown, works well on mobile and desktop.
- Q: Where should the priority badge be positioned on the todo card? → A: Position at left edge before checkbox. Layout: [Priority Badge] [Checkbox] [Overdue Icon?] [Title] [Due Date] [Actions]. This ensures priority scans first (left-to-right), creates clear visual hierarchy, and doesn't interfere with existing overdue indicator.
- Q: Should we extend existing REST API endpoints or create new ones for priority? → A: Extend existing todo endpoints to include priority field. GET /api/todos returns priority, POST/PUT accept optional priority parameter. No new endpoints needed - follows RESTful principles and keeps API simple.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Priority Identification (Priority: P1) 🎯 MVP

Users can immediately distinguish between high, medium, and low priority todos through clear visual indicators (color, icon, or label) without reading the full todo text.

**Why this priority**: This is the core value proposition - enabling users to quickly identify important todos at a glance. Visual priority distinction is the minimal viable feature that delivers immediate user value.

**Independent Test**: Create todos with different priority levels (High, Medium, Low) and verify that each is visually distinct and immediately recognizable. A user should be able to identify the priority of any todo within 1 second of viewing it.

**Acceptance Scenarios**:

1. **Given** multiple todos exist with different priorities, **When** user views the todo list, **Then** high priority todos are clearly distinguished from medium and low priority todos through visual indicators
2. **Given** a todo has high priority, **When** user views the todo, **Then** the high priority indicator is prominent and immediately noticeable
3. **Given** a todo has medium priority, **When** user views the todo, **Then** the medium priority indicator is present and distinct from high/low
4. **Given** a todo has low priority, **When** user views the todo, **Then** the low priority indicator is present and distinct from high/medium
5. **Given** todos with different priorities are displayed, **When** user switches between light and dark themes, **Then** all priority indicators remain visible and clearly distinguishable

---

### User Story 2 - Set Priority When Creating Todo (Priority: P2)

Users can assign a priority level (High, Medium, or Low) when creating a new todo, ensuring important tasks are marked from the start.

**Why this priority**: Enables users to mark priority at task creation time, making the workflow more efficient. Builds on US1 by adding the ability to set priority, but US1 must exist first for this to have value.

**Independent Test**: Create a new todo and set its priority to High. Verify the todo is saved with high priority and displays with the correct visual indicator from US1.

**Acceptance Scenarios**:

1. **Given** user is creating a new todo, **When** user opens the todo form, **Then** a priority selection button group is available with three buttons: "High", "Medium", "Low"
2. **Given** user is creating a new todo, **When** user selects "High" priority and saves, **Then** todo is created with high priority and displays the high priority indicator
3. **Given** user is creating a new todo, **When** user selects "Medium" priority and saves, **Then** todo is created with medium priority and displays the medium priority indicator
4. **Given** user is creating a new todo, **When** user selects "Low" priority and saves, **Then** todo is created with low priority and displays the low priority indicator
5. **Given** user is creating a new todo, **When** user does not explicitly select a priority, **Then** todo is created with medium priority (default)

---

### User Story 3 - Change Priority for Existing Todos (Priority: P3)

Users can update the priority of existing todos as circumstances change, ensuring priority levels remain accurate and relevant.

**Why this priority**: Allows users to adjust priorities over time as task importance changes. Completes the priority lifecycle but is less critical than initial assignment (US2).

**Independent Test**: Edit an existing todo and change its priority from Medium to High. Verify the priority indicator updates immediately without requiring a page refresh.

**Acceptance Scenarios**:

1. **Given** an existing todo with medium priority, **When** user opens edit mode and changes priority to high, **Then** todo updates and displays high priority indicator immediately
2. **Given** an existing todo with high priority, **When** user opens edit mode and changes priority to low, **Then** todo updates and displays low priority indicator immediately
3. **Given** an existing todo is being edited, **When** user changes the priority, **Then** the change persists after saving and page refresh
4. **Given** an existing todo is being edited, **When** user cancels the edit without saving, **Then** the priority remains unchanged

---

### Edge Cases

- What happens when a todo with undefined/null priority is displayed? (Should default to medium)
- How does the system handle invalid priority values from corrupted data? (Should default to medium and log warning)
- What if a user has color blindness and cannot distinguish color-based priorities? (Should use icons or text labels in addition to color)
- How does priority display on very small screens where space is limited? (Should use compact icons or indicators)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support three priority levels: High, Medium, and Low
- **FR-002**: Every todo MUST have a priority level (default to Medium if not specified)
- **FR-003**: System MUST display a visual indicator for each priority level that is immediately distinguishable from other levels
- **FR-004**: Visual indicators MUST be visible and distinguishable in both light and dark theme modes
- **FR-005**: Users MUST be able to set priority when creating a new todo
- **FR-006**: Users MUST be able to change priority when editing an existing todo
- **FR-007**: Priority values MUST persist across sessions (stored in database/backend)
- **FR-008**: System MUST use distinct visual indicators combining both color and iconography for each priority: High uses red badge with "!" icon (urgent), Medium uses orange badge with "●" icon (neutral, leveraging --color-primary theme token), Low uses blue/gray badge with "▼" icon (calm, low-urgency)
- **FR-009**: Priority indicators MUST be accessible with appropriate aria labels for screen readers
- **FR-010**: System MUST handle missing or invalid priority values by defaulting to Medium priority

### Key Entities *(include if feature involves data)*

- **Todo Item**: Existing entity extended with a priority field
  - **New Attribute**: `priority` - enumerated string value: "high", "medium", or "low" (stored as TEXT in database)
  - **Storage Format**: Lowercase string enum for readability and maintainability
  - **Default Value**: "medium" when not explicitly set
  - **Relationships**: No new relationships; extends existing Todo schema

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify the priority level of any todo within 1 second of viewing it
- **SC-002**: Users can assign or change priority in under 5 seconds
- **SC-003**: 100% of todos display a clear, distinguishable priority indicator
- **SC-004**: Priority indicators are visible in both light and dark modes with sufficient contrast (WCAG AA compliance)
- **SC-005**: Users with color blindness can distinguish priorities through non-color-dependent indicators (icons or labels)

## Assumptions

- Three priority levels (High, Medium, Low) are sufficient for user needs; five-star or custom priority systems are out of scope
- Priority is a display and organization feature; automatic sorting or filtering by priority is not included in this specification (future enhancement)
- Existing backend todo schema can be extended to include a priority field without breaking changes
- Priority is independent of due date; overdue todos can have any priority level
- Users prefer a simple dropdown or button group for priority selection rather than a complex multi-step picker
- Medium priority is the appropriate default for todos where priority is not explicitly set
- Visual distinction through color/icon is sufficient; audible or haptic priority indicators are out of scope
