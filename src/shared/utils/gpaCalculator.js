import { GPACalculationRules } from '../rules/GPACalculationRules';

/**
 * Utility wrapper for GPA calculations
 */
export class GPACalculator {
  
  static calculateSemesterGPA(semester) {
    return GPACalculationRules.calculateSGPA(semester.courses);
  }
  
  static calculateCumulativeGPA(semesters) {
    return GPACalculationRules.calculateCGPA(semesters);
  }
  
  static calculateSelectedGPA(selectedSemesters) {
    return GPACalculationRules.calculateCGPA(selectedSemesters);
  }
  
  static projectGPA(currentSemesters, projectedCourses) {
    const currentCourses = currentSemesters.flatMap(sem => sem.courses);
    return GPACalculationRules.calculateProjectedGPA(currentCourses, projectedCourses);
  }
  
  static getGPABreakdown(semesters) {
    return semesters.map(semester => ({
      semester: semester.name,
      ...this.calculateSemesterGPA(semester),
    }));
  }
}