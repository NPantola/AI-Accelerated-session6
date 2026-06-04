<!--
Sync Impact Report:
Version: 0.0.0 → 1.0.0
Modified Principles: Initial constitution creation
Added Sections: All core principles, code standards, testing requirements, development workflow
Removed Sections: None (initial version)
Templates Requiring Updates:
  ✅ Updated: .specify/templates/plan-template.md (verified alignment)
  ✅ Updated: .specify/templates/spec-template.md (verified alignment)
  ✅ Updated: .specify/templates/tasks-template.md (verified alignment)
Follow-up TODOs: None
-->

# Todo App Constitution

## Core Principles

### I. Code Quality and Maintainability (NON-NEGOTIABLE)

Code MUST follow DRY (Don't Repeat Yourself) and KISS (Keep It Simple, Stupid) principles:
- Extract common code into shared functions, utilities, or reusable components
- Avoid duplication across the codebase; create shared utilities for common operations
- Prefer simple, straightforward implementations over complex solutions
- Break complex logic into smaller, understandable functions with single responsibilities
- Each module, component, or function MUST have a single, well-defined responsibility

**Rationale**: Maintainable code reduces technical debt, improves readability, and enables faster 
feature development. Simple code is easier to debug, test, and modify.

### II. Test-First Development (NON-NEGOTIABLE)

Testing is mandatory and MUST be comprehensive:
- MINIMUM 80% code coverage across all packages (frontend and backend)
- Tests MUST be written as part of the development process, not after
- Follow the Test-Driven Development (TDD) approach where practical
- Tests MUST describe expected behavior and validate functionality
- Unit tests for individual components and functions (isolated with mocked dependencies)
- Integration tests for component interactions and API communication
- Test behavior, not implementation details; avoid brittle tests
- Tests MUST be independent, isolated, and not rely on other tests
- Use fixtures and mock data for consistency; create test utilities to reduce duplication

**Rationale**: Comprehensive testing ensures code reliability, catches regressions early, serves as 
living documentation, and enables confident refactoring.

### III. SOLID Principles

All code MUST adhere to SOLID design principles:
- **Single Responsibility**: A module/component has one reason to change
- **Open/Closed**: Open for extension via props/composition, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for their parent types
- **Interface Segregation**: Don't pass unnecessary props; keep interfaces focused and minimal
- **Dependency Inversion**: Depend on abstractions, inject dependencies appropriately

**Rationale**: SOLID principles create flexible, maintainable, and extensible code architectures that 
scale well as the project grows.

### IV. Consistent Code Style and Formatting

Code style MUST be consistent across the entire codebase:
- **Indentation**: 2 spaces (JavaScript, JSON, CSS, Markdown)
- **Line Length**: Maximum 100 characters for code
- **Naming Conventions**:
  - `camelCase` for variables and functions
  - `UPPER_SNAKE_CASE` for constants
  - `PascalCase` for React components and classes
- **Import Order**: External libraries → Internal modules → Styles (separated by blank lines)
- **Line Endings**: LF (Unix-style)
- **No Trailing Whitespace**: All trailing whitespace MUST be removed
- ESLint rules MUST be followed; all linting errors and warnings addressed before commits
- Pre-commit hooks MUST enforce linting rules

**Rationale**: Consistent formatting improves readability, reduces cognitive load, prevents merge 
conflicts, and establishes a professional codebase standard.

### V. UI/UX Consistency

User interface MUST follow the established design system:
- Material Design-inspired with Halloween theme (orange/purple color palette)
- Support both light and dark modes with defined color palettes
- 8px grid system for all spacing (8px, 16px, 24px, 32px, 48px)
- Consistent typography scale (28px heading, 18px subheading, 16px body, 14px button, 12px caption)
- Maximum content width of 600px on larger screens
- Components MUST use defined color tokens, not hardcoded values
- Interactive elements MUST have hover and focus states
- Spacing MUST follow the 8px grid system

**Rationale**: Consistent UI/UX creates a cohesive user experience, improves usability, and ensures 
the application feels polished and professional.

### VI. Clean Code and Documentation

Code MUST be self-documenting with appropriate comments:
- Use descriptive, meaningful names that clearly indicate purpose
- Avoid single-letter variables except in loops or destructuring
- Comments MUST explain "why", not "what" the code does
- JSDoc MUST be used for public functions and components
- Keep comments updated; outdated comments are worse than no comments
- Avoid obvious comments that restate what the code clearly does
- Group related code logically with clear organization

**Rationale**: Clean, well-documented code reduces onboarding time, prevents misunderstandings, and 
serves as reliable documentation for future developers.

### VII. Error Handling and Performance

Applications MUST be robust and performant:
- Always include try-catch blocks around operations that can fail
- Provide clear, actionable error messages to users
- Log errors appropriately for debugging (console.error with context)
- Handle errors gracefully with user feedback
- Avoid unnecessary React renders using `useMemo` and `useCallback` appropriately
- Use efficient algorithms and appropriate data structures
- Keep component and bundle sizes reasonable

**Rationale**: Proper error handling prevents crashes and improves user experience. Performance 
optimization ensures responsive, smooth interactions.

## Technology Stack

The project MUST use the following technologies:

**Frontend**:
- React for UI components
- CSS for styling (no CSS-in-JS libraries)
- Jest and React Testing Library for testing

**Backend**:
- Node.js runtime
- Express.js for REST API
- Jest for testing

**Development**:
- npm workspaces for monorepo management
- ESLint for code quality enforcement
- Git for version control

**Rationale**: This stack provides a simple, maintainable foundation with excellent tooling support 
and a large community.

## Development Workflow

### File Organization

Code MUST follow the established directory structure:
- Tests in `__tests__/` directories colocated with source files
- Frontend components in `packages/frontend/src/components/`
- Frontend services in `packages/frontend/src/services/`
- Backend routes in `packages/backend/src/routes/`
- Backend services in `packages/backend/src/services/`

### Code Organization Within Files

Files MUST follow this structure:
1. Imports at the top (external → internal → styles)
2. Constants
3. Utility functions
4. Main component/class
5. Helper functions (if any)
6. Exports at the bottom

### Git Practices

Version control MUST follow these practices:
- **Atomic Commits**: Each commit represents one logical change
- **Clear Commit Messages**: Use conventional commit format (feat:, fix:, docs:, test:, refactor:)
- **Feature Branches**: Use feature branches for new work (e.g., `feature/todo-editing`)
- **Pull Requests**: Use PRs for code review before merging to main
- Commit message format: `type: brief description` with optional body explaining "why"

### Review Process

All code changes MUST:
- Pass all automated tests (minimum 80% coverage)
- Pass ESLint validation with no errors or warnings
- Be reviewed by at least one other developer (when applicable)
- Follow all principles defined in this constitution
- Include tests for new functionality

## Governance

This constitution supersedes all other development practices and guidelines. All development work 
MUST comply with these principles.

**Amendment Process**:
- Amendments require clear justification and documentation
- Version MUST be incremented using semantic versioning:
  - MAJOR: Backward incompatible changes, principle removals/redefinitions
  - MINOR: New principles added, material expansions to guidance
  - PATCH: Clarifications, wording improvements, typo fixes
- Migration plan MUST be provided for breaking changes

**Compliance**:
- All pull requests MUST be reviewed for constitution compliance
- Violations MUST be addressed before merging
- Complexity MUST be justified against simplicity principles
- Regular reviews MUST be conducted to ensure ongoing compliance

**Living Document**:
- This constitution is a living document that evolves with the project
- Feedback and suggestions for improvements are encouraged
- Updates MUST be documented in the version history

For detailed runtime development guidance, refer to:
- `docs/coding-guidelines.md` - Detailed coding standards and examples
- `docs/testing-guidelines.md` - Comprehensive testing strategies
- `docs/ui-guidelines.md` - Complete UI/UX design system
- `docs/functional-requirements.md` - Feature requirements and scope

**Version**: 1.0.0 | **Ratified**: 2026-06-04 | **Last Amended**: 2026-06-04
