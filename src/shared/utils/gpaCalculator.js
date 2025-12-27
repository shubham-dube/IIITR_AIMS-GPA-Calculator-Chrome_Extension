import { GPACalculationRules } from '../rules/GPACalculationRules';

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
  
  static projectGPA(currentCourses, projectedCourses) {
    return GPACalculationRules.calculateProjectedGPA(currentCourses, projectedCourses);
  }
}