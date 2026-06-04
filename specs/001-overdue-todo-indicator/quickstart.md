# Quickstart Validation: Overdue Todo Indicator

**Feature**: Overdue Todo Items
**Date**: 2026-06-04
**Branch**: 001-overdue-todo-indicator

## Overview

This guide provides step-by-step instructions to validate the overdue indicator feature after implementation. Follow these scenarios to verify that all functional requirements are met.

---

## Prerequisites

### System Requirements
- Node.js installed (v16+)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Setup Steps

1. **Clone and install dependencies**:
   ```bash
   cd /workspaces/AI-Accelerated-session6
   npm install
   ```

2. **Start the application**:
   ```bash
   npm start
   ```
   - Backend runs on: http://localhost:3030
   - Frontend runs on: http://localhost:3000

3. **Verify application loads**:
   - Open http://localhost:3000 in browser
   - Todo list interface should be visible

---

## Validation Scenarios

### Scenario 1: Overdue Incomplete Todo Shows Icon

**Purpose**: Verify that incomplete todos with past due dates display the orange clock icon.

**Steps**:
1. Open the application in browser
2. Create a new todo with title "Past Due Task"
3. Set due date to **yesterday's date** (e.g., if today is 2026-06-04, set to 2026-06-03)
4. Leave the todo **unchecked** (incomplete)

**Expected Result**:
- ✅ Orange clock icon (⏰) appears between checkbox and todo title
- ✅ Icon color matches the theme's orange (visible in both light and dark modes)
- ✅ Icon has `aria-label="Overdue"` (verify with browser dev tools)

**Reference**: [Frontend Component Contract](./contracts/frontend-components.md), [Data Model](./data-model.md)

---

### Scenario 2: Completed Overdue Todo Hides Icon

**Purpose**: Verify that marking an overdue todo as complete removes the indicator.

**Steps**:
1. Using the overdue todo from Scenario 1 (with clock icon visible)
2. Click the **checkbox** to mark the todo as complete

**Expected Result**:
- ✅ Clock icon **disappears immediately**
- ✅ Todo shows checkmark or completed styling
- ✅ Due date still visible, but no overdue indicator

**Reference**: [Functional Requirements FR-005](./spec.md#functional-requirements), [Data Model](./data-model.md)

---

### Scenario 3: Today's Due Date Shows No Icon

**Purpose**: Verify that todos due today are NOT marked as overdue.

**Steps**:
1. Create a new todo with title "Due Today"
2. Set due date to **today's date** (e.g., 2026-06-04)
3. Leave the todo **unchecked** (incomplete)

**Expected Result**:
- ✅ **No clock icon** displayed
- ✅ Todo appears normal without overdue indicator
- ✅ Due date shows today's date formatted

**Reference**: [Functional Requirements FR-006](./spec.md#functional-requirements), [User Story 3](./spec.md#user-story-3)

---

### Scenario 4: Future Due Date Shows No Icon

**Purpose**: Verify that todos with future due dates are NOT marked as overdue.

**Steps**:
1. Create a new todo with title "Future Task"
2. Set due date to **tomorrow or later** (e.g., 2026-06-10)
3. Leave the todo **unchecked** (incomplete)

**Expected Result**:
- ✅ **No clock icon** displayed
- ✅ Todo appears normal without overdue indicator
- ✅ Due date shows future date formatted

**Reference**: [Functional Requirements FR-006](./spec.md#functional-requirements), [User Story 3](./spec.md#user-story-3)

---

### Scenario 5: No Due Date Shows No Icon

**Purpose**: Verify that todos without due dates are NOT marked as overdue.

**Steps**:
1. Create a new todo with title "No Due Date Task"
2. **Leave due date field empty** (null/undefined)
3. Leave the todo **unchecked** (incomplete)

**Expected Result**:
- ✅ **No clock icon** displayed
- ✅ Todo appears normal without overdue indicator
- ✅ No due date text shown

**Reference**: [Functional Requirements FR-004](./spec.md#functional-requirements), [Data Model](./data-model.md)

---

### Scenario 6: Multiple Overdue Todos

**Purpose**: Verify that multiple overdue todos each display the indicator.

**Steps**:
1. Create 3 todos with different past due dates:
   - "Task 1" - due 2026-06-01 (3 days ago)
   - "Task 2" - due 2026-06-02 (2 days ago)
   - "Task 3" - due 2026-06-03 (1 day ago)
2. Leave all **unchecked** (incomplete)

**Expected Result**:
- ✅ **All 3 todos** display the orange clock icon
- ✅ Icons are consistent in appearance across all items
- ✅ Each icon is positioned correctly (after checkbox, before text)

**Reference**: [User Story 1 - Scenario 2](./spec.md#user-story-1), [Frontend Component Contract](./contracts/frontend-components.md)

---

### Scenario 7: Editing Due Date Updates Indicator

**Purpose**: Verify that changing a todo's due date updates the overdue indicator in real-time.

**Steps**:
1. Create a todo with a **past due date** (overdue, icon visible)
2. Click **Edit** button
3. Change due date to a **future date**
4. Save the edit

**Expected Result**:
- ✅ Clock icon **disappears immediately** after saving
- ✅ Todo remains incomplete but no longer shows overdue indicator

**Alternative Flow** (past → past):
1. Edit an incomplete todo with a future date
2. Change due date to a **past date**
3. Save the edit

**Expected Result**:
- ✅ Clock icon **appears immediately** after saving

**Reference**: [Functional Requirements FR-010](./spec.md#functional-requirements), [Data Model - State Transitions](./data-model.md)

---

### Scenario 8: Dark Mode Theme Consistency

**Purpose**: Verify that the overdue indicator is visible in both light and dark themes.

**Steps**:
1. Create an overdue incomplete todo (clock icon visible)
2. Click the **theme toggle** button to switch to dark mode
3. Observe the clock icon color and visibility

**Expected Result**:
- ✅ Clock icon remains visible in dark mode
- ✅ Icon color is orange (`--color-primary` dark mode value: #ff8c42)
- ✅ Icon is clearly distinguishable from background and text

**Repeat** by switching back to light mode:
- ✅ Icon color is orange (`--color-primary` light mode value: #ff6b35)
- ✅ Icon remains visible and clear

**Reference**: [Functional Requirements FR-007](./spec.md#functional-requirements), [Research - Orange Color](./research.md#3-orange-color-from-halloween-theme)

---

### Scenario 9: Page Refresh Persists Indicator

**Purpose**: Verify that overdue indicators persist after page reload.

**Steps**:
1. Create an overdue incomplete todo (clock icon visible)
2. **Refresh the page** (F5 or Ctrl+R)
3. Wait for todos to reload from backend

**Expected Result**:
- ✅ Clock icon **reappears** after reload
- ✅ Overdue status is recalculated on component mount
- ✅ All overdue indicators are correctly displayed

**Reference**: [Functional Requirements FR-008](./spec.md#functional-requirements), [User Story 2](./spec.md#user-story-2)

---

### Scenario 10: Accessibility Validation

**Purpose**: Verify that the overdue indicator is accessible to screen readers and keyboard users.

**Steps**:
1. Create an overdue incomplete todo (clock icon visible)
2. Open browser **Developer Tools** (F12)
3. Inspect the clock icon element
4. Verify HTML attributes

**Expected Result**:
- ✅ Icon has `aria-label="Overdue"` attribute
- ✅ Icon has `role="img"` attribute
- ✅ Icon is readable by screen readers

**Optional - Screen Reader Test**:
1. Enable screen reader (NVDA, JAWS, VoiceOver)
2. Navigate to overdue todo
3. Listen to announcement

**Expected Result**:
- ✅ Screen reader announces "Overdue" when icon is focused/read

**Reference**: [Frontend Component Contract - Accessibility](./contracts/frontend-components.md#overdueicon-component-interface-new)

---

## Running Automated Tests

### Unit Tests

**Run all tests**:
```bash
npm test
```

**Run frontend tests only**:
```bash
npm run test:frontend
```

**Run with coverage report**:
```bash
npm run test:frontend -- --coverage
```

**Expected Coverage**:
- ✅ Minimum 80% code coverage (per constitution)
- ✅ All test suites pass (0 failures)
- ✅ New `isOverdue` utility function covered
- ✅ TodoCard overdue rendering logic covered

**Reference**: [Constitution - Test-First Development](../.specify/memory/constitution.md), [Testing Guidelines](../../docs/testing-guidelines.md)

---

## Test Data Setup (Optional)

For comprehensive testing, create a set of todos covering all scenarios:

```javascript
// Suggested test data (create via UI or API)
[
  { title: "Overdue Task 1", dueDate: "2026-06-01", completed: false }, // Overdue
  { title: "Overdue Task 2", dueDate: "2026-06-02", completed: false }, // Overdue
  { title: "Overdue but Done", dueDate: "2026-06-03", completed: true }, // No icon
  { title: "Due Today", dueDate: "2026-06-04", completed: false },      // No icon
  { title: "Due Tomorrow", dueDate: "2026-06-05", completed: false },   // No icon
  { title: "No Due Date", dueDate: null, completed: false },            // No icon
]
```

---

## Troubleshooting

### Icon Not Appearing

**Possible Causes**:
- Due date is not in the past (check system date)
- Todo is marked as completed
- CSS styles not applied correctly
- JavaScript error in console (check dev tools)

**Solutions**:
- Verify due date is actually before today
- Ensure todo is unchecked (incomplete)
- Check browser console for errors
- Clear cache and hard refresh (Ctrl+Shift+R)

---

### Wrong Color

**Possible Causes**:
- CSS custom property not defined
- Theme not applied correctly
- Hardcoded color used instead of variable

**Solutions**:
- Verify `--color-primary` is defined in theme.css
- Check that component uses `var(--color-primary)`
- Inspect element in dev tools to see computed color

---

### Icon Not Accessible

**Possible Causes**:
- Missing `aria-label` attribute
- Missing `role="img"` attribute
- Incorrect HTML structure

**Solutions**:
- Inspect element and verify attributes
- Check component implementation against contract
- Test with actual screen reader software

---

## Validation Checklist

Use this checklist to confirm all requirements are met:

- [ ] Overdue incomplete todos show orange clock icon
- [ ] Completed overdue todos do NOT show icon
- [ ] Todos due today do NOT show icon
- [ ] Future due date todos do NOT show icon
- [ ] Todos without due dates do NOT show icon
- [ ] Multiple overdue todos each show icon
- [ ] Editing due date updates icon in real-time
- [ ] Marking complete removes icon immediately
- [ ] Icon visible in both light and dark modes
- [ ] Icon color matches theme orange
- [ ] Page refresh persists overdue indicators
- [ ] Icon has accessibility attributes
- [ ] All automated tests pass
- [ ] Code coverage meets 80% minimum

**Reference**: [Success Criteria](./spec.md#success-criteria)

---

## Additional Resources

- [Feature Specification](./spec.md)
- [Data Model](./data-model.md)
- [Frontend Component Contract](./contracts/frontend-components.md)
- [API Contract](./contracts/api.md)
- [Research Document](./research.md)
- [Constitution](../.specify/memory/constitution.md)
- [Testing Guidelines](../../docs/testing-guidelines.md)

---

## Summary

This quickstart guide covers:
- ✅ 10 validation scenarios covering all functional requirements
- ✅ Prerequisites and setup instructions
- ✅ Expected results for each scenario
- ✅ Automated testing commands
- ✅ Troubleshooting common issues
- ✅ Complete validation checklist

Follow these scenarios in order to ensure the overdue indicator feature works correctly end-to-end.
