# Implementation Plan: Overdue Todo Indicator

**Branch**: `001-overdue-todo-indicator` | **Date**: 2026-06-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/workspaces/AI-Accelerated-session6/specs/001-overdue-todo-indicator/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Users need a visual indicator to quickly identify incomplete todos that are past their due date. The feature adds an orange clock icon (⏰) positioned after the checkbox and before the todo text for incomplete items with due dates before today. This is a frontend-only implementation using native JavaScript date comparison with day-level granularity, requiring no backend changes or external dependencies.

## Technical Context

**Language/Version**: JavaScript (ES6+), Node.js v16+, React 18.2.0

**Primary Dependencies**: React, React DOM, Express.js, better-sqlite3, axios, Jest, React Testing Library

**Storage**: SQLite (better-sqlite3) - existing todo schema, no changes required

**Testing**: Jest with React Testing Library (frontend), Jest with supertest (backend, no changes needed)

**Target Platform**: Web browser (modern browsers: Chrome, Firefox, Safari, Edge) + Node.js server

**Project Type**: Web application - React frontend + Express.js REST API backend (monorepo with npm workspaces)

**Performance Goals**: Icon render <500ms, date comparison O(1) per todo, <1% bundle size increase

**Constraints**: 
- Must work in both light and dark theme modes
- Must use existing color tokens (--color-primary)
- Must follow 8px grid spacing system
- No external icon libraries allowed (KISS principle)
- Minimum 80% test coverage required

**Scale/Scope**: Small feature scope - affects one component (TodoCard), adds one utility function, frontend-only change

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Code Quality and Maintainability (NON-NEGOTIABLE)
- ✅ **DRY**: Date comparison logic extracted to reusable `isOverdue` utility function
- ✅ **KISS**: Simple native JavaScript date comparison, no external dependencies
- ✅ **Single Responsibility**: Each component has clear purpose (TodoCard displays, isOverdue calculates)

### Test-First Development (NON-NEGOTIABLE)
- ✅ **80% Coverage**: Tests planned for utility function and component rendering
- ✅ **TDD Approach**: Unit tests for `isOverdue` function + integration tests for TodoCard
- ✅ **Independent Tests**: Each scenario isolated with mocked Date object

### SOLID Principles
- ✅ **Single Responsibility**: TodoCard displays todos, utility function handles date logic
- ✅ **Open/Closed**: Extends TodoCard via composition (adds icon), doesn't modify existing logic
- ✅ **Dependency Inversion**: Pure utility function, no dependencies

### Consistent Code Style
- ✅ **Conventions**: Follows existing camelCase, 2-space indentation, 100-char line length
- ✅ **ESLint**: All code must pass linting before commit
- ✅ **Import Order**: External → internal → styles

### UI/UX Consistency
- ✅ **Theme**: Uses `--color-primary` token for orange color
- ✅ **Dark Mode**: CSS custom properties ensure automatic theme support
- ✅ **Spacing**: Icon margin uses `--space-xs` (8px) from grid system
- ✅ **Accessibility**: Icon has `aria-label="Overdue"` for screen readers

### Clean Code and Documentation
- ✅ **Self-Documenting**: Function name `isOverdue` clearly indicates purpose
- ✅ **JSDoc**: Utility function includes JSDoc comments explaining parameters and return value
- ✅ **Meaningful Names**: Variables like `isOverdue`, `dueDate`, `completed` are descriptive

### Error Handling and Performance
- ✅ **Graceful Handling**: Returns `false` for null/undefined dates, no crashes
- ✅ **Performance**: `useMemo` caches calculation, O(1) per item
- ✅ **No Unnecessary Renders**: Memoized with dependencies `[todo.dueDate, todo.completed]`

**Constitution Compliance**: ✅ PASS - All principles satisfied, no violations

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todo-indicator/
├── spec.md              # Feature specification (input)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command) ✅
├── data-model.md        # Phase 1 output (/speckit.plan command) ✅
├── quickstart.md        # Phase 1 output (/speckit.plan command) ✅
├── contracts/           # Phase 1 output (/speckit.plan command) ✅
│   ├── frontend-components.md  # Component interface contracts ✅
│   └── api.md                  # API contracts (no changes) ✅
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TodoCard.js           # MODIFY: Add overdue icon rendering
│   │   │   ├── OverdueIcon.js        # NEW: Clock icon component
│   │   │   └── __tests__/
│   │   │       ├── TodoCard.test.js  # MODIFY: Add overdue tests
│   │   │       └── OverdueIcon.test.js  # NEW: Icon component tests
│   │   ├── utils/
│   │   │   ├── dateUtils.js          # NEW: isOverdue utility function
│   │   │   └── __tests__/
│   │   │       └── dateUtils.test.js # NEW: Utility function tests
│   │   └── styles/
│   │       └── theme.css             # VERIFY: --color-primary exists (no changes)
│   └── package.json
└── backend/
    └── (no changes required)
```

**Structure Decision**: Web application (frontend + backend) structure. This feature is frontend-only, modifying the TodoCard component and adding a utility function. Backend remains unchanged as overdue status is derived on the frontend from existing todo data (dueDate, completed fields).
