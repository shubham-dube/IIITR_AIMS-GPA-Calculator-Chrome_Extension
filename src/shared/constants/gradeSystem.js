export const GRADE_POINTS = {
  'A+': 10,
  'A': 10,
  'A-': 9,
  'B': 8,
  'B-': 7,
  'C': 6,
  'C-': 5,
  'D': 4,
  'F': 0,
  'FR': 0,
  'FS': 0,
  'I': null,  // Incomplete - not counted
  'S': null,  // Satisfactory - not counted in GPA
  'U': null,  // Unsatisfactory - not counted in GPA
  'AU': null, // Audit - not counted in GPA
};

export const GRADE_DESCRIPTIONS = {
  'A+': 'Outstanding',
  'A': 'Excellent',
  'A-': 'Very Good',
  'B': 'Good',
  'B-': 'Above Average',
  'C': 'Average',
  'C-': 'Below Average',
  'D': 'Marginal',
  'F': 'Fail',
  'FR': 'Fail (Reappear)',
  'FS': 'Fail (Absent)',
  'I': 'Incomplete',
  'S': 'Satisfactory',
  'U': 'Unsatisfactory',
  'AU': 'Audit',
};

export const PASSING_GRADES = ['A+', 'A', 'A-', 'B', 'B-', 'C', 'C-', 'D', 'S'];

export const FAILING_GRADES = ['F', 'FR', 'FS', 'U'];

export const NON_COUNTED_GRADES = ['I', 'S', 'U', 'AU'];

export const GRADE_COLORS = {
  'A+': 'text-green-600',
  'A': 'text-green-600',
  'A-': 'text-green-500',
  'B': 'text-blue-600',
  'B-': 'text-blue-500',
  'C': 'text-yellow-600',
  'C-': 'text-yellow-500',
  'D': 'text-orange-600',
  'F': 'text-red-600',
  'FR': 'text-red-600',
  'FS': 'text-red-600',
  'I': 'text-gray-500',
  'S': 'text-purple-600',
  'U': 'text-red-500',
  'AU': 'text-gray-500',
};