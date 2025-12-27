/**
 * Global Grade System Configuration
 */
export const GRADE_POINTS = {
  'A+': 10,
  'A': 10,
  'A-': 9,
  'B': 8,
  'B-': 7,
  'C': 6,
  'C-': 5,
  'D': 4,
  'F': 0,    // Standard: 0 points
  'FR': 0,   // Standard: 0 points
  'FS': 0,   // Standard: 0 points
  'I': null,
  'S': null,
  'U': null,
  'AU': null,
};

// Grades that should be ignored entirely in Projected mode
export const PROJECTED_IGNORE_GRADES = ['F', 'FR', 'FS'];

// Grades that are never counted regardless of context
export const ALWAYS_NON_COUNTED = ['I', 'S', 'U', 'AU'];

export const PASSING_GRADES = ['A+', 'A', 'A-', 'B', 'B-', 'C', 'C-', 'D', 'S'];

export const GRADE_COLORS = {
  'A+': 'text-green-600',
  'A': 'text-green-600',
  'A-': 'text-green-500',
  'B': 'text-blue-600',
  'B-': 'text-blue-500',
  'C': 'text-yellow-600',
  'C-': 'text-yellow-500',
  'D': 'text-orange-600',
  'F': 'text-red-400',
  'FR': 'text-red-400',
  'FS': 'text-red-400',
};