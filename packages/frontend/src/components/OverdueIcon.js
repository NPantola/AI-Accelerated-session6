/**
 * OverdueIcon Component
 * 
 * Displays a clock icon to indicate that a todo item is overdue.
 * Uses theme color (--color-primary) for consistency across light/dark modes.
 */

import React from 'react';
import './OverdueIcon.css';

/**
 * OverdueIcon - Stateless presentational component
 * Renders an orange clock emoji with proper accessibility attributes
 */
function OverdueIcon() {
  return (
    <span 
      className="overdue-icon" 
      aria-label="Overdue" 
      role="img"
    >
      ⏰
    </span>
  );
}

export default OverdueIcon;
