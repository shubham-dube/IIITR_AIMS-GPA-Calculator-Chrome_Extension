import { GRADE_POINTS } from '../constants/gradeSystem';

export class Validators {
  
  static isValidGrade(grade) {
    return grade && GRADE_POINTS.hasOwnProperty(grade.trim());
  }

  static isValidCredits(credits) {
    const num = parseFloat(credits);
    return !isNaN(num) && num >= 0 && num <= 20;
  }

  static isValidCourse(course) {
    if (!course) return false;
    
    return (
      course.code &&
      course.title &&
      this.isValidCredits(course.credits) &&
      this.isValidGrade(course.grade)
    );
  }

  static isValidSemester(semester) {
    if (!semester) return false;
    
    return (
      semester.id &&
      semester.name &&
      Array.isArray(semester.courses) &&
      semester.courses.length > 0
    );
  }

  static sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/\s+/g, ' ');
  }

  static sanitizeNumber(num, decimals = 2) {
    const parsed = parseFloat(num);
    if (isNaN(parsed)) return 0;
    return parseFloat(parsed.toFixed(decimals));
  }
}