/**
 * Date utility functions for todo management
 */

/**
 * Checks if a todo item is overdue based on its due date and completion status.
 * 
 * Uses day-level granularity for date comparison (ignores time of day).
 * A todo is considered overdue if:
 * - It has a valid due date
 * - It is not completed
 * - The due date is before today (midnight-to-midnight comparison)
 * 
 * @param {string | null | undefined} dueDate - ISO 8601 date string (YYYY-MM-DD)
 * @param {boolean} completed - Whether the todo is marked as complete
 * @returns {boolean} True if the todo is overdue (past due date and incomplete), false otherwise
 * 
 * @example
 * isOverdue('2026-06-01', false) // true (if today is 2026-06-04)
 * isOverdue('2026-06-10', false) // false (future date)
 * isOverdue('2026-06-01', true)  // false (completed)
 * isOverdue(null, false)          // false (no due date)
 */
export function isOverdue(dueDate, completed) {
  // Return false if no due date or todo is completed
  if (!dueDate || completed) return false;
  
  // Normalize dates to midnight for day-level comparison
  const today = new Date().setHours(0, 0, 0, 0);
  const due = new Date(dueDate).setHours(0, 0, 0, 0);
  
  // Return true only if due date is before today
  return due < today;
}
