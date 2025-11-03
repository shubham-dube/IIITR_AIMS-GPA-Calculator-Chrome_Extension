/**
 * Rules for course selection and validation
 */
export class CourseSelectionRules {
  
  /**
   * Check if a course can be selected for GPA calculation
   */
  static canSelectCourse(course) {
    // Can't select courses without grades
    if (!course.grade || course.grade.trim() === '') {
      return false;
    }
    
    return true;
  }
  
  /**
   * Validate semester selection
   */
  static validateSemesterSelection(selectedSemesters) {
    if (!selectedSemesters || selectedSemesters.length === 0) {
      return {
        valid: false,
        message: 'Please select at least one semester',
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Get default semester selection (exclude backlog-only semesters)
   */
  static getDefaultSelection(semesters) {
    return semesters.filter(sem => {
      // Exclude semesters that only have backlog courses
      const hasRegular = sem.courses.some(c => c.regType !== 'Backlog');
      return hasRegular;
    });
  }
}