# Tasks: Overdue Todo Indicator

**Input**: Design documents from `/specs/001-overdue-todo-indicator/`

**Prerequisites**: plan.md (✅), spec.md (✅), research.md (✅), data-model.md (✅), contracts/ (✅)

**Tests**: No test tasks included (tests not explicitly requested in feature specification)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app structure: `packages/frontend/src/` and `packages/backend/src/`
- Frontend-only feature (no backend changes)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verify existing structure

- [ ] T001 Verify project structure and dependencies per implementation plan
- [ ] T002 Verify CSS custom properties exist: `--color-primary` and `--space-xs` in packages/frontend/src/styles/theme.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and components that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 [P] Create isOverdue utility function in packages/frontend/src/utils/dateUtils.js
- [ ] T004 [P] Create OverdueIcon component in packages/frontend/src/components/OverdueIcon.js
- [ ] T005 Add overdue icon styles to packages/frontend/src/styles/theme.css or component CSS

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Visual Identification of Overdue Items (Priority: P1) 🎯 MVP

**Goal**: Users can immediately see which incomplete todos are past their due date through an orange clock icon positioned between the checkbox and text

**Independent Test**: Create a todo with a past due date and incomplete status. Verify that it displays with an orange clock icon after the checkbox and before the text. Verify that multiple overdue items all show the icon.

### Implementation for User Story 1

- [ ] T006 [US1] Import isOverdue utility function into packages/frontend/src/components/TodoCard.js
- [ ] T007 [US1] Import OverdueIcon component into packages/frontend/src/components/TodoCard.js
- [ ] T008 [US1] Add useMemo hook to compute isOverdue status in packages/frontend/src/components/TodoCard.js
- [ ] T009 [US1] Add conditional rendering of OverdueIcon component in TodoCard layout between checkbox and text in packages/frontend/src/components/TodoCard.js
- [ ] T010 [US1] Verify overdue icon displays with correct color and position in both light and dark themes

**Checkpoint**: At this point, User Story 1 should be fully functional - overdue incomplete todos display the orange clock icon

---

## Phase 4: User Story 2 - Overdue Status Persists Until Completion (Priority: P2)

**Goal**: Overdue todos remain visually marked until the user marks them complete, and the indicator is removed immediately upon completion

**Independent Test**: Create an overdue todo and verify the icon persists across page refreshes. Mark it complete and verify the icon disappears immediately.

### Implementation for User Story 2

- [ ] T011 [US2] Verify useMemo dependencies include todo.completed in packages/frontend/src/components/TodoCard.js
- [ ] T012 [US2] Verify isOverdue function returns false when completed is true in packages/frontend/src/utils/dateUtils.js
- [ ] T013 [US2] Test overdue indicator removal when marking todo complete via onToggle handler
- [ ] T014 [US2] Test overdue indicator persistence across page refresh/reload

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - overdue status is correctly tied to completion state

---

## Phase 5: User Story 3 - No False Positives for Future or Today's Items (Priority: P3)

**Goal**: Todos with due dates of today or in the future are never incorrectly marked as overdue, ensuring accuracy and user trust

**Independent Test**: Create todos with today's date, future dates, and no due date. Verify none display the overdue indicator.

### Implementation for User Story 3

- [ ] T015 [US3] Verify isOverdue function returns false when dueDate is null/undefined in packages/frontend/src/utils/dateUtils.js
- [ ] T016 [US3] Verify isOverdue function returns false when dueDate is today in packages/frontend/src/utils/dateUtils.js
- [ ] T017 [US3] Verify isOverdue function returns false when dueDate is in the future in packages/frontend/src/utils/dateUtils.js
- [ ] T018 [US3] Test that todos due today do not display overdue indicator
- [ ] T019 [US3] Test that todos with future due dates do not display overdue indicator
- [ ] T020 [US3] Test that todos with no due date do not display overdue indicator

**Checkpoint**: All user stories should now be independently functional - overdue logic handles all edge cases correctly

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [ ] T021 [P] Verify accessibility: OverdueIcon has aria-label="Overdue" and role="img" in packages/frontend/src/components/OverdueIcon.js
- [ ] T022 [P] Verify date normalization uses setHours(0,0,0,0) for day-level comparison in packages/frontend/src/utils/dateUtils.js
- [ ] T023 [P] Add JSDoc comments to isOverdue function in packages/frontend/src/utils/dateUtils.js
- [ ] T024 Test editing todo due date from past to future removes overdue indicator
- [ ] T025 Test editing todo due date from future to past adds overdue indicator (if incomplete)
- [ ] T026 Run quickstart.md validation scenarios for all user stories
- [ ] T027 [P] Verify ESLint passes with no errors or warnings
- [ ] T028 [P] Verify code follows constitution principles (DRY, KISS, Single Responsibility)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Validates US1 behavior but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Validates edge cases but independently testable

### Within Each User Story

- **User Story 1**: Import utilities → Add useMemo → Add conditional rendering → Verify display
- **User Story 2**: Verify dependencies → Verify function logic → Test completion → Test persistence
- **User Story 3**: Verify null handling → Verify today handling → Verify future handling → Test all scenarios

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel (different verification tasks)
- **Phase 2**: T003, T004, T005 can run in parallel (different files, no dependencies)
- Once Foundational phase completes, User Stories 1, 2, and 3 can be worked on in parallel by different team members
- **Phase 6**: T021, T022, T023, T027, T028 can run in parallel (different files/concerns)

---

## Parallel Example: Foundational Phase

```bash
# Launch all foundational tasks together (Phase 2):
Task: "Create isOverdue utility function in packages/frontend/src/utils/dateUtils.js"
Task: "Create OverdueIcon component in packages/frontend/src/components/OverdueIcon.js"
Task: "Add overdue icon styles to packages/frontend/src/styles/theme.css"
```

---

## Parallel Example: Polish Phase

```bash
# Launch all polish tasks together (Phase 6):
Task: "Verify accessibility attributes in OverdueIcon component"
Task: "Verify date normalization logic in isOverdue function"
Task: "Add JSDoc comments to isOverdue function"
Task: "Verify ESLint passes"
Task: "Verify constitution compliance"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (verify structure)
2. Complete Phase 2: Foundational (CRITICAL - create utilities and components)
3. Complete Phase 3: User Story 1 (visual identification)
4. **STOP and VALIDATE**: Test User Story 1 independently using quickstart.md scenarios
5. Deploy/demo if ready

**Result**: Users can visually identify overdue items with orange clock icons - core value delivered!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP! ✅)
3. Add User Story 2 → Test independently → Deploy/Demo (Persistence! ✅)
4. Add User Story 3 → Test independently → Deploy/Demo (Edge case handling! ✅)
5. Add Polish → Final validation → Deploy/Demo (Production ready! ✅)

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (visual display)
   - Developer B: User Story 2 (persistence validation)
   - Developer C: User Story 3 (edge case validation)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies - safe to run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Frontend-only feature - no backend changes required
- All date comparisons use day-level granularity (midnight-to-midnight)
- Orange color uses CSS custom property `var(--color-primary)` for theme support
- Icon positioned between checkbox and text per UX guidelines
- Accessibility: Icon has `aria-label="Overdue"` for screen readers
- Constitution compliance: DRY (utility function), KISS (simple date comparison), Single Responsibility (separate components)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
