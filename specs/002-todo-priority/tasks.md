# Tasks: Todo Priority Levels

**Input**: Design documents from `/specs/002-todo-priority/`

**Prerequisites**: plan.md (✅), spec.md (✅), research.md (✅), data-model.md (✅), contracts/ (✅)

**Tests**: No test tasks included (tests not explicitly requested in feature specification)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app structure: `packages/frontend/src/` and `packages/backend/src/`
- Full-stack feature (both frontend and backend changes)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verify existing structure

- [ ] T001 Verify project structure and dependencies per implementation plan
- [ ] T002 Verify CSS custom properties exist: `--color-primary` and `--space-xs` in packages/frontend/src/styles/theme.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend schema, API changes, and frontend utilities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Foundation

- [ ] T003 Add priority column migration to packages/backend/src/db/database.js with CHECK constraint and DEFAULT 'medium'
- [ ] T004 Update getAllTodos in packages/backend/src/services/todoService.js to include priority field
- [ ] T005 Update createTodo in packages/backend/src/services/todoService.js to accept and store priority parameter
- [ ] T006 Update updateTodo in packages/backend/src/services/todoService.js to accept and update priority parameter
- [ ] T007 Add priority validation function in packages/backend/src/services/todoService.js (validates "high", "medium", "low")
- [ ] T008 Update GET /api/todos route in packages/backend/src/routes/todos.js to return priority field
- [ ] T009 Update POST /api/todos route in packages/backend/src/routes/todos.js to accept and validate priority
- [ ] T010 Update PUT /api/todos/:id route in packages/backend/src/routes/todos.js to accept and validate priority
- [ ] T011 Run database migration to add priority column to existing todos table

### Frontend Foundation

- [ ] T012 [P] Create priorityUtils.js in packages/frontend/src/utils/ with PRIORITY_LEVELS, DEFAULT_PRIORITY, PRIORITY_CONFIG constants
- [ ] T013 [P] Implement isValidPriority function in packages/frontend/src/utils/priorityUtils.js
- [ ] T014 [P] Implement getPriorityConfig function in packages/frontend/src/utils/priorityUtils.js
- [ ] T015 [P] Implement normalizePriority function in packages/frontend/src/utils/priorityUtils.js
- [ ] T016 [P] Add priority color tokens to packages/frontend/src/styles/theme.css (--priority-high-bg, --priority-high-text, --priority-low-bg, --priority-low-text for light and dark modes)
- [ ] T017 [P] Create priority.css in packages/frontend/src/styles/ with badge and selector styles

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Visual Priority Identification (Priority: P1) 🎯 MVP

**Goal**: Users can immediately see which todos have high, medium, or low priority through color badges with icons positioned before the checkbox

**Independent Test**: Create todos with different priorities (High, Medium, Low) and verify each displays a distinct badge (red/!, orange/●, blue/▼) at the left edge before the checkbox. All priorities should be distinguishable in both light and dark themes.

### Implementation for User Story 1

- [ ] T018 [P] [US1] Create PriorityBadge.js component in packages/frontend/src/components/
- [ ] T019 [P] [US1] Create PriorityBadge.css in packages/frontend/src/components/
- [ ] T020 [US1] Import priorityUtils in packages/frontend/src/components/PriorityBadge.js
- [ ] T021 [US1] Implement PriorityBadge render with icon, label, and accessibility attributes (aria-label, role="img")
- [ ] T022 [US1] Wrap PriorityBadge component in React.memo for performance
- [ ] T023 [US1] Import PriorityBadge component in packages/frontend/src/components/TodoCard.js
- [ ] T024 [US1] Add PriorityBadge to TodoCard layout positioned before checkbox in packages/frontend/src/components/TodoCard.js
- [ ] T025 [US1] Verify PriorityBadge displays correctly with existing overdue indicator (layout: [Badge] [Checkbox] [Overdue?] [Title])
- [ ] T026 [US1] Test priority badge display in light theme
- [ ] T027 [US1] Test priority badge display in dark theme

**Checkpoint**: At this point, User Story 1 should be fully functional - todos display priority badges with correct colors and icons

---

## Phase 4: User Story 2 - Set Priority When Creating Todo (Priority: P2)

**Goal**: Users can select priority (High, Medium, Low) when creating a new todo using a button group, with Medium as the default

**Independent Test**: Open create todo form, verify button group with three buttons (High, Medium, Low) is visible with Medium pre-selected. Select High, save, and verify todo is created with high priority badge.

### Implementation for User Story 2

- [ ] T028 [P] [US2] Create PrioritySelector.js component in packages/frontend/src/components/
- [ ] T029 [US2] Implement PrioritySelector with three buttons using PRIORITY_LEVELS from priorityUtils
- [ ] T030 [US2] Add accessibility attributes to PrioritySelector (role="group", aria-label, aria-pressed on buttons)
- [ ] T031 [US2] Add keyboard navigation support to PrioritySelector (Tab, Enter, Space)
- [ ] T032 [US2] Import PrioritySelector in packages/frontend/src/components/TodoForm.js
- [ ] T033 [US2] Add priority state to TodoForm component with default value "medium"
- [ ] T034 [US2] Add PrioritySelector to TodoForm layout between due date and buttons
- [ ] T035 [US2] Update TodoForm handleSubmit to include priority in onSubmit callback
- [ ] T036 [US2] Update createTodo call in packages/frontend/src/services/todoService.js to include priority parameter
- [ ] T037 [US2] Update App.js or parent component to pass priority to createTodo API call
- [ ] T038 [US2] Verify default priority ("medium") is used when user doesn't explicitly select priority
- [ ] T039 [US2] Test creating todo with each priority level (high, medium, low)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users can create todos with priority and see the badge

---

## Phase 5: User Story 3 - Change Priority for Existing Todos (Priority: P3)

**Goal**: Users can update the priority of existing todos through the edit form, with changes persisting immediately

**Independent Test**: Edit an existing todo with medium priority, change to high, save, and verify badge updates immediately. Refresh page and verify priority persists.

### Implementation for User Story 3

- [ ] T040 [US3] Update TodoForm to accept initialData prop with priority field
- [ ] T041 [US3] Initialize priority state from initialData.priority when in edit mode in packages/frontend/src/components/TodoForm.js
- [ ] T042 [US3] Update TodoCard edit handler to pass current priority to TodoForm
- [ ] T043 [US3] Update onEdit callback signature to accept priority parameter in packages/frontend/src/components/TodoCard.js
- [ ] T044 [US3] Update updateTodo call in packages/frontend/src/services/todoService.js to include priority parameter
- [ ] T045 [US3] Update App.js or parent component to pass priority to updateTodo API call
- [ ] T046 [US3] Verify priority updates immediately in UI without page refresh
- [ ] T047 [US3] Test changing priority between all combinations (high→medium, medium→low, low→high, etc.)
- [ ] T048 [US3] Verify priority persists after page refresh
- [ ] T049 [US3] Verify cancel edit maintains original priority

**Checkpoint**: All user stories should now be independently functional - full priority lifecycle (create, display, edit) works

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [ ] T050 [P] Add JSDoc comments to all priorityUtils functions in packages/frontend/src/utils/priorityUtils.js
- [ ] T051 [P] Verify WCAG AA contrast ratio for priority badges in both light and dark modes
- [ ] T052 [P] Verify priority badges work with screen readers (test aria-labels)
- [ ] T053 [P] Verify keyboard navigation through priority selector (Tab, Enter, Space keys)
- [ ] T054 [P] Test priority badge with overdue indicator (verify no layout conflicts)
- [ ] T055 [P] Test priority with completed todos (verify badge still displays)
- [ ] T056 [P] Test priority with long todo titles (verify layout doesn't break)
- [ ] T057 Test invalid priority handling: backend returns 400 for invalid values
- [ ] T058 Test null priority handling: frontend defaults to "medium"
- [ ] T059 Test database CHECK constraint prevents invalid priority values
- [ ] T060 Run quickstart.md validation scenarios for all user stories
- [ ] T061 [P] Verify ESLint passes with no errors or warnings (frontend)
- [ ] T062 [P] Verify code follows constitution principles (DRY, KISS, Single Responsibility)
- [ ] T063 Performance test: verify badge render <100ms
- [ ] T064 Performance test: verify button group interaction <50ms
- [ ] T065 Bundle size check: verify priority feature adds <5KB

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
  - Backend tasks (T003-T011) can run in parallel
  - Frontend tasks (T012-T017) can run in parallel
  - Backend and Frontend tasks can run in parallel with each other
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 display but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Validates edit workflow but independently testable

### Within Each User Story

- **User Story 1**: Create PriorityBadge → Add to TodoCard → Verify display
- **User Story 2**: Create PrioritySelector → Add to TodoForm → Update API calls → Test creation
- **User Story 3**: Update TodoForm for edit → Update TodoCard handler → Test updates

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel (different verification tasks)
- **Phase 2 Backend**: T003-T011 can run in parallel once database is ready
- **Phase 2 Frontend**: T012-T017 can run in parallel (different files, no dependencies)
- **Phase 2**: Backend tasks and Frontend tasks can run in parallel with each other
- Once Foundational phase completes, User Stories 1, 2, and 3 can be worked on in parallel by different team members
- **Phase 6**: T050-T056, T061-T065 can run in parallel (different files/concerns)

---

## Parallel Example: Foundational Phase Backend

```bash
# Launch backend foundational tasks together (Phase 2):
Task: "Add priority column migration to database.js"
Task: "Update getAllTodos to include priority field"
Task: "Update createTodo to accept priority parameter"
Task: "Update updateTodo to accept priority parameter"
Task: "Add priority validation function"
```

---

## Parallel Example: Foundational Phase Frontend

```bash
# Launch frontend foundational tasks together (Phase 2):
Task: "Create priorityUtils.js with constants and functions"
Task: "Add priority color tokens to theme.css"
Task: "Create priority.css with styles"
```

---

## Parallel Example: Polish Phase

```bash
# Launch all polish tasks together (Phase 6):
Task: "Add JSDoc comments to priorityUtils"
Task: "Verify WCAG AA contrast"
Task: "Test screen reader support"
Task: "Verify keyboard navigation"
Task: "Performance tests"
Task: "ESLint validation"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify structure)
2. Complete Phase 2: Foundational (CRITICAL - database + API + utilities)
3. Complete Phase 3: User Story 1 (visual priority badges)
4. **STOP and VALIDATE**: Test User Story 1 independently using quickstart.md scenarios
5. Deploy/demo if ready

**Result**: Users can visually identify todo priorities with color badges and icons - core value delivered!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP! ✅)
3. Add User Story 2 → Test independently → Deploy/Demo (Create with priority! ✅)
4. Add User Story 3 → Test independently → Deploy/Demo (Edit priority! ✅)
5. Add Polish → Final validation → Deploy/Demo (Production ready! ✅)

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (display badges)
   - Developer B: User Story 2 (create with priority)
   - Developer C: User Story 3 (edit priority)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies - safe to run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Full-stack feature - requires both frontend and backend changes
- Backend changes must be deployed before frontend changes are visible
- Priority is stored as lowercase string: "high", "medium", "low"
- Color badges use theme tokens for automatic light/dark mode support
- Badge positioned at left edge before checkbox per UX spec
- Accessibility: badges have aria-labels, icons provide shape distinction
- Constitution compliance: DRY (utilities), KISS (simple enum), Single Responsibility (component per function)
- No external dependencies added (uses Unicode icons, CSS)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
