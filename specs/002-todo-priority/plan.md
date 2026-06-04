# Implementation Plan: Todo Priority Levels

**Branch**: `002-todo-priority` | **Date**: 2026-06-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/workspaces/AI-Accelerated-session6/specs/002-todo-priority/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Users need a clear, visual way to identify which todos are the highest priority (High, Medium, Low) through color badges and icons. The feature extends the existing todo schema with a priority field (stored as lowercase string enum), adds a button group selector in the todo form, and displays priority badges at the left edge of each todo card. This is a full-stack implementation requiring both frontend (React components, UI controls) and backend (SQLite schema extension, API updates) changes.

## Technical Context

**Language/Version**: JavaScript (ES6+), Node.js v16+, React 18.2.0

**Primary Dependencies**: React, React DOM, Express.js, better-sqlite3, axios, Jest, React Testing Library

**Storage**: SQLite (better-sqlite3) - existing todo schema will be extended with priority TEXT column

**Testing**: Jest with React Testing Library (frontend), Jest with supertest (backend)

**Target Platform**: Web browser (modern browsers: Chrome, Firefox, Safari, Edge) + Node.js server

**Project Type**: Web application - React frontend + Express.js REST API backend (monorepo with npm workspaces)

**Performance Goals**: Priority badge render <100ms, button group interaction <50ms, API response <200ms, minimal bundle size increase (<5KB)

**Constraints**: 
- Must work in both light and dark theme modes
- Must use existing color tokens where possible (--color-primary for medium)
- Must follow 8px grid spacing system
- No external icon libraries (use Unicode/CSS)
- Minimum 80% test coverage required
- Must not break existing todos (migration strategy for null priorities)

**Scale/Scope**: Small to medium feature scope - affects multiple files (frontend: TodoCard, TodoForm, new PriorityBadge component, new priority utilities; backend: database schema, todo routes, todo service)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Code Quality and Maintainability (NON-NEGOTIABLE)
- ✅ **DRY**: Priority display logic extracted to reusable PriorityBadge component and utility functions
- ✅ **KISS**: Simple string enum storage, straightforward button group UI, minimal complexity
- ✅ **Single Responsibility**: Each component has clear purpose (PriorityBadge displays, PrioritySelector chooses, utility validates)

### Test-First Development (NON-NEGOTIABLE)
- ✅ **80% Coverage**: Tests planned for all new components, utilities, and API endpoints
- ✅ **TDD Approach**: Unit tests for priority validation + integration tests for full workflow
- ✅ **Independent Tests**: Each test scenario isolated with mocked dependencies

### SOLID Principles
- ✅ **Single Responsibility**: PriorityBadge only displays, PrioritySelector only handles selection
- ✅ **Open/Closed**: Extends TodoCard via composition (adds badge), doesn't modify existing logic
- ✅ **Dependency Inversion**: Priority utilities are pure functions with no dependencies

### Consistent Code Style
- ✅ **Conventions**: Follows existing camelCase, 2-space indentation, 100-char line length
- ✅ **ESLint**: All code must pass linting before commit
- ✅ **Import Order**: External → internal → styles

### UI/UX Consistency
- ✅ **Theme**: Uses --color-primary for medium, defines new priority color tokens
- ✅ **Dark Mode**: CSS custom properties ensure automatic theme support
- ✅ **Spacing**: Badge margins use --space-xs (8px) from grid system
- ✅ **Accessibility**: Badges have aria-label for screen readers, icons + color for distinction

### Clean Code and Documentation
- ✅ **Self-Documenting**: Function names like `getPriorityConfig`, `isValidPriority` clearly indicate purpose
- ✅ **JSDoc**: All utility functions include JSDoc comments explaining parameters and return values
- ✅ **Meaningful Names**: Variables like `selectedPriority`, `priorityLevel`, `badgeConfig` are descriptive

### Error Handling and Performance
- ✅ **Graceful Handling**: Defaults to "medium" for null/undefined/invalid priorities, no crashes
- ✅ **Performance**: Memoized components where needed, O(1) priority lookups
- ✅ **No Unnecessary Renders**: React.memo for PriorityBadge, useMemo for priority config

**Constitution Compliance**: ✅ PASS - All principles satisfied, no violations

## Project Structure

### Documentation (this feature)

```text
specs/002-todo-priority/
├── spec.md              # Feature specification (input)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command) ✅
├── data-model.md        # Phase 1 output (/speckit.plan command) ✅
├── quickstart.md        # Phase 1 output (/speckit.plan command) ✅
├── contracts/           # Phase 1 output (/speckit.plan command) ✅
│   ├── frontend-components.md  # Component interface contracts ✅
│   └── api.md                  # API contracts ✅
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TodoCard.js           # MODIFY: Add priority badge rendering
│   │   │   ├── TodoForm.js           # MODIFY: Add priority selector
│   │   │   ├── PriorityBadge.js      # NEW: Priority display component
│   │   │   ├── PrioritySelector.js   # NEW: Button group for priority selection
│   │   │   └── __tests__/
│   │   │       ├── TodoCard.test.js  # MODIFY: Add priority tests
│   │   │       ├── TodoForm.test.js  # MODIFY: Add priority selection tests
│   │   │       ├── PriorityBadge.test.js  # NEW: Badge component tests
│   │   │       └── PrioritySelector.test.js  # NEW: Selector component tests
│   │   ├── utils/
│   │   │   ├── priorityUtils.js      # NEW: Priority validation and config
│   │   │   └── __tests__/
│   │   │       └── priorityUtils.test.js # NEW: Utility function tests
│   │   ├── services/
│   │   │   ├── todoService.js        # MODIFY: Add priority to API calls
│   │   │   └── __tests__/
│   │   │       └── todoService.test.js # MODIFY: Add priority tests
│   │   └── styles/
│   │       ├── theme.css             # MODIFY: Add priority color tokens
│   │       └── priority.css          # NEW: Priority-specific styles
│   └── package.json
└── backend/
    ├── src/
    │   ├── services/
    │   │   └── todoService.js        # MODIFY: Add priority handling
    │   ├── routes/
    │   │   └── todos.js              # MODIFY: Add priority to endpoints
    │   ├── db/
    │   │   └── database.js           # MODIFY: Add priority column migration
    │   └── __tests__/
    │       └── todos.test.js         # MODIFY: Add priority tests
    └── package.json
```

**Structure Decision**: Web application (frontend + backend) structure. This feature requires changes to both frontend (UI components) and backend (database schema, API). The monorepo with npm workspaces structure is maintained.
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
