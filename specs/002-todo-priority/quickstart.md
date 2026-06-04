# Quickstart Validation: Todo Priority Levels

**Feature**: Todo Priority Levels
**Date**: 2026-06-04
**Branch**: 002-todo-priority

## Overview

This guide provides step-by-step instructions to validate the priority feature after implementation. Follow these scenarios to verify that all functional requirements are met.

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

### Scenario 1: Visual Priority Distinction

**Purpose**: Verify that todos with different priorities are visually distinct and immediately recognizable (User Story 1 - P1).

**Steps**:
1. Open the application in browser
2. Create three new todos:
   - "High priority task" with priority = High
   - "Medium priority task" with priority = Medium
   - "Low priority task" with priority = Low
3. Observe the todo list

**Expected Result**:
- ✅ High priority todo displays **red badge** with **!** icon before the checkbox
- ✅ Medium priority todo displays **orange badge** with **●** icon before the checkbox
- ✅ Low priority todo displays **blue badge** with **▼** icon before the checkbox
- ✅ All three todos are immediately distinguishable by color, icon, and badge text
- ✅ Badges are positioned at the left edge of each todo card

**Reference**: [Frontend Component Contract - PriorityBadge](./contracts/frontend-components.md#prioritybadge-component-new), [Spec - User Story 1](./spec.md#user-story-1---visual-priority-identification-priority-p1--mvp)

---

### Scenario 2: Priority Visible in Light and Dark Themes

**Purpose**: Verify that priority indicators are visible in both light and dark themes (FR-004).

**Steps**:
1. With the three priority todos from Scenario 1 visible
2. Click the **theme toggle** button to switch to dark mode
3. Observe the priority badges
4. Click the theme toggle again to switch back to light mode

**Expected Result**:
- ✅ Priority badges remain clearly visible in dark mode
- ✅ Badge colors adapt to dark theme (light red, bright orange, light blue)
- ✅ Text contrast meets WCAG AA standards in both modes
- ✅ Icons (!, ●, ▼) are clearly distinguishable in both modes

**Reference**: [Research - Priority Badge Visual Design](./research.md#2-priority-badge-visual-design), [Spec - FR-004](./spec.md#functional-requirements)

---

### Scenario 3: Create Todo with Priority Selection

**Purpose**: Verify that users can set priority when creating a new todo (User Story 2 - P2).

**Steps**:
1. Click the **"Add Todo"** or **"+"** button to open the create form
2. Observe the priority selector (button group with High, Medium, Low)
3. Enter title: "Test high priority"
4. Set due date: Tomorrow
5. Click **"High"** button in priority selector
6. Click **"Save"** or **"Add"** button

**Expected Result**:
- ✅ Priority selector is visible with three buttons: "High", "Medium", "Low"
- ✅ "Medium" button is selected by default
- ✅ Clicking "High" button highlights it (selected state)
- ✅ After saving, new todo appears with **red badge and ! icon**
- ✅ Priority matches selection (high priority)

**Reference**: [Frontend Component Contract - PrioritySelector](./contracts/frontend-components.md#priorityselector-component-new), [Spec - User Story 2](./spec.md#user-story-2---set-priority-when-creating-todo-priority-p2)

---

### Scenario 4: Default Priority When Not Selected

**Purpose**: Verify that todos default to medium priority when no priority is explicitly selected (FR-002).

**Steps**:
1. Click to open the create form
2. Enter title: "Test default priority"
3. Set due date: One week from today
4. **Do NOT change priority selection** (leave as default)
5. Click **"Save"**

**Expected Result**:
- ✅ "Medium" button is pre-selected in priority selector
- ✅ After saving, new todo displays **orange badge with ● icon**
- ✅ Priority is "medium" (default behavior working correctly)

**Reference**: [Spec - FR-002](./spec.md#functional-requirements), [Data Model - Default Value](./data-model.md#priority-level-value-object)

---

### Scenario 5: Change Priority for Existing Todo

**Purpose**: Verify that users can update priority when editing an existing todo (User Story 3 - P3).

**Steps**:
1. Using a todo with medium priority from previous scenarios
2. Click the **Edit** button (✎) on the todo
3. Observe the priority selector shows "Medium" as selected
4. Click **"High"** button in priority selector
5. Click **"Save"**

**Expected Result**:
- ✅ Edit form displays with priority selector
- ✅ Current priority ("Medium") is pre-selected
- ✅ Clicking "High" updates selection immediately
- ✅ After saving, todo displays **red badge with ! icon**
- ✅ Priority change persists (verified after page refresh)

**Reference**: [Frontend Component Contract - TodoForm](./contracts/frontend-components.md#todoform-component-modified), [Spec - User Story 3](./spec.md#user-story-3---change-priority-for-existing-todos-priority-p3)

---

### Scenario 6: Priority Persists Across Page Refresh

**Purpose**: Verify that priority values persist in the database and survive page reloads (FR-007).

**Steps**:
1. Create todos with all three priorities (High, Medium, Low)
2. Note the priority badges displayed
3. **Refresh the page** (F5 or Ctrl+R)
4. Observe the todo list after reload

**Expected Result**:
- ✅ All todos reload with same priority badges
- ✅ High priority todos still show red badge with ! icon
- ✅ Medium priority todos still show orange badge with ● icon
- ✅ Low priority todos still show blue badge with ▼ icon
- ✅ No priority data lost or corrupted

**Reference**: [Spec - FR-007](./spec.md#functional-requirements), [Data Model - Database Schema](./data-model.md#database-schema-changes)

---

### Scenario 7: Priority with Completed Todos

**Purpose**: Verify that priority and completion status are independent (priority visible on completed todos).

**Steps**:
1. Create a todo with high priority
2. Click the **checkbox** to mark it complete
3. Observe the todo display

**Expected Result**:
- ✅ Todo shows as completed (strikethrough or checkmark styling)
- ✅ **Red priority badge with ! icon still visible**
- ✅ Priority indicator does not disappear when todo is completed
- ✅ Unchecking the todo maintains the high priority badge

**Reference**: [Data Model - State Transitions](./data-model.md#entities), [Spec - Assumptions](./spec.md#assumptions)

---

### Scenario 8: Priority with Overdue Indicator

**Purpose**: Verify that priority badges and overdue indicators coexist without interference.

**Steps**:
1. Create a high priority todo with a **past due date** (yesterday)
2. Leave the todo **incomplete**
3. Observe the todo display

**Expected Result**:
- ✅ Todo displays **both** indicators:
   - Priority: Red badge with ! icon (left edge)
   - Overdue: Orange clock icon ⏰ (after checkbox, before text)
- ✅ Layout: `[🔴!] ☐ ⏰ Title`
- ✅ Both indicators are clearly visible and don't overlap
- ✅ Priority badge positioned before checkbox, overdue icon after checkbox

**Reference**: [Frontend Component Contract - TodoCard Layout](./contracts/frontend-components.md#display-contract-modified-layout), [Spec Clarifications](./spec.md#clarifications)

---

### Scenario 9: Accessibility - Screen Reader Support

**Purpose**: Verify that priority indicators have proper accessibility attributes (FR-009).

**Steps**:
1. Open browser developer tools (F12)
2. Inspect a priority badge element
3. Check the HTML attributes

**Expected Result**:
- ✅ Priority badge has `aria-label` attribute (e.g., "High priority")
- ✅ Priority badge has `role="img"` attribute
- ✅ Priority selector has `role="group"` and `aria-label="Priority selection"`
- ✅ Priority buttons have `aria-pressed` attribute indicating selection state

**Reference**: [Frontend Component Contract - Accessibility](./contracts/frontend-components.md#accessibility-contract), [Spec - FR-009](./spec.md#functional-requirements)

---

### Scenario 10: Button Group Keyboard Navigation

**Purpose**: Verify that priority selector is keyboard accessible.

**Steps**:
1. Open create todo form
2. Press **Tab** key to navigate to priority selector
3. Press **Tab** again to move between buttons
4. Press **Enter** or **Space** to select a priority
5. Press **Tab** to move to next form field

**Expected Result**:
- ✅ Priority buttons receive keyboard focus (visible focus ring)
- ✅ Tab key navigates between High, Medium, Low buttons
- ✅ Enter or Space key selects the focused button
- ✅ Selected button shows visual indication
- ✅ Keyboard navigation flow is logical (title → date → priority → save)

**Reference**: [Frontend Component Contract - PrioritySelector Interaction](./contracts/frontend-components.md#interaction-contract), [Research - Button Group Pattern](./research.md#3-button-group-component-pattern)

---

### Scenario 11: API Response Includes Priority

**Purpose**: Verify that backend API returns priority field in todos (API contract).

**Steps**:
1. Open browser developer tools (F12)
2. Go to **Network** tab
3. Refresh the page or create a new todo
4. Find the API request to `/api/todos` (GET or POST)
5. Inspect the response JSON

**Expected Result**:
- ✅ GET `/api/todos` response includes `priority` field for each todo:
   ```json
   {
     "id": 1,
     "title": "Test",
     "priority": "high",
     ...
   }
   ```
- ✅ POST `/api/todos` response includes `priority` field
- ✅ Priority value is lowercase: "high", "medium", or "low"

**Reference**: [API Contract - GET /api/todos](./contracts/api.md#get-apitodos), [API Contract - POST /api/todos](./contracts/api.md#post-apitodos)

---

### Scenario 12: Invalid Priority Handling

**Purpose**: Verify that system handles corrupted/invalid priority data gracefully (FR-010).

**Steps**:
1. Using browser developer tools, manually modify a todo's priority in localStorage or via API
2. Set priority to an invalid value (e.g., "invalid" or null)
3. Refresh the page
4. Observe the todo display

**Expected Result**:
- ✅ Todo displays with **medium priority badge** (default fallback)
- ✅ No error messages or crashes
- ✅ Application continues to function normally
- ✅ Console may show warning about invalid priority (optional)

**Reference**: [Spec - FR-010](./spec.md#functional-requirements), [Data Model - Edge Cases](./data-model.md#edge-cases)

---

### Scenario 13: Multiple Priorities in List View

**Purpose**: Verify visual hierarchy when multiple priority todos are displayed together.

**Steps**:
1. Create 6 todos with mixed priorities:
   - 2 high priority
   - 2 medium priority
   - 2 low priority
2. Observe the entire todo list

**Expected Result**:
- ✅ High priority todos stand out (red badges most prominent)
- ✅ Each priority level is immediately distinguishable
- ✅ List is readable with mixed priorities
- ✅ Color contrast and spacing maintain visual clarity
- ✅ No visual clutter or cognitive overload

**Reference**: [Research - Priority Badge Visual Design](./research.md#2-priority-badge-visual-design), [Spec - SC-001](./spec.md#success-criteria)

---

## Performance Validation

### Scenario 14: Priority Indicator Performance

**Purpose**: Verify that priority badges render quickly (Performance Goals: <100ms).

**Steps**:
1. Open browser developer tools (F12)
2. Go to **Performance** tab
3. Start recording
4. Create a new todo with high priority
5. Stop recording
6. Inspect the timeline

**Expected Result**:
- ✅ PriorityBadge component renders in <100ms
- ✅ No layout thrashing or reflows
- ✅ Button group interaction responds in <50ms
- ✅ No performance warnings in console

**Reference**: [Plan - Technical Context - Performance Goals](./plan.md#technical-context)

---

## Edge Case Validation

### Scenario 15: Long Todo Title with Priority Badge

**Purpose**: Verify layout handles long titles with priority badges.

**Steps**:
1. Create a todo with a very long title (200+ characters)
2. Set priority to High
3. Observe the display on both desktop and mobile viewport sizes

**Expected Result**:
- ✅ Priority badge remains at left edge
- ✅ Title text wraps without overlapping badge
- ✅ Badge doesn't shrink or disappear
- ✅ Layout remains functional on narrow screens

**Reference**: [Frontend Component Contract - TodoCard Layout](./contracts/frontend-components.md#display-contract-modified-layout)

---

## Completion Checklist

After completing all scenarios, verify:

- [ ] **Scenario 1**: Visual distinction works (User Story 1 ✓)
- [ ] **Scenario 2**: Theme support works (Light/Dark modes ✓)
- [ ] **Scenario 3**: Priority selection works (User Story 2 ✓)
- [ ] **Scenario 4**: Default priority works (Medium default ✓)
- [ ] **Scenario 5**: Edit priority works (User Story 3 ✓)
- [ ] **Scenario 6**: Persistence works (Database storage ✓)
- [ ] **Scenario 7**: Priority + completion works (Independent ✓)
- [ ] **Scenario 8**: Priority + overdue works (Coexistence ✓)
- [ ] **Scenario 9**: Accessibility works (ARIA labels ✓)
- [ ] **Scenario 10**: Keyboard navigation works (Tab/Enter/Space ✓)
- [ ] **Scenario 11**: API contract works (Priority in responses ✓)
- [ ] **Scenario 12**: Error handling works (Invalid priorities ✓)
- [ ] **Scenario 13**: Visual hierarchy works (Mixed priorities ✓)
- [ ] **Scenario 14**: Performance works (<100ms render ✓)
- [ ] **Scenario 15**: Layout works (Long titles ✓)

---

## Notes

- All scenarios should be tested in both light and dark theme modes
- Test on multiple browser sizes (desktop, tablet, mobile)
- Verify keyboard navigation works throughout
- Check browser console for any errors or warnings
- Priority feature should work seamlessly with existing overdue indicator feature
