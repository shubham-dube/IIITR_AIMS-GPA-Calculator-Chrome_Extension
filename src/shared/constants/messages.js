export const MESSAGE_TYPES = {
  FETCH_DATA: 'FETCH_DATA',
  DATA_FETCHED: 'DATA_FETCHED',
  CALCULATE_GPA: 'CALCULATE_GPA',
  SAVE_CALCULATION: 'SAVE_CALCULATION',
  OPEN_TRANSCRIPT: 'OPEN_TRANSCRIPT',
  SELECT_COURSE: 'SELECT_COURSE',
  ERROR: 'ERROR',
};

export const STORAGE_KEYS = {
  STUDENT_DATA: 'studentData',
  SEMESTER_DATA: 'semesterData',
  SAVED_CALCULATIONS: 'savedCalculations',
  PROJECTED_GRADES: 'projectedGrades',
  USER_SETTINGS: 'userSettings',
};

export const ERROR_MESSAGES = {
  NOT_ON_AIMS: 'Please open AIMS Portal Course History page',
  FETCH_FAILED: 'Failed to fetch data. Please refresh the page',
  NO_SEMESTERS_SELECTED: 'Please select at least one semester',
  CALCULATION_ERROR: 'Error calculating GPA. Please try again',
};