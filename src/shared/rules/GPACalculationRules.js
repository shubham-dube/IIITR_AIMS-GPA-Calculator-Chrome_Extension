import { GRADE_POINTS, NON_COUNTED_GRADES } from '../constants/gradeSystem';

/**
 * Centralized GPA Calculation Rules
 * All business logic for GPA calculation is defined here
 */
export class GPACalculationRules {
  
  /**
   * Rule 1: For duplicate course codes, only consider the best grade
   * @param {Array} courses - Array of course objects
   * @returns {Array} - Filtered courses with best grades
   */
  static applyDuplicateCourseRule(courses) {
    const courseMap = new Map();
    
    courses.forEach(course => {
      const existingCourse = courseMap.get(course.code);
      
      if (!existingCourse) {
        courseMap.set(course.code, course);
      } else {
        // Compare grades and keep the better one
        const existingPoints = GRADE_POINTS[existingCourse.grade];
        const currentPoints = GRADE_POINTS[course.grade];
        
        if (currentPoints !== null && (existingPoints === null || currentPoints > existingPoints)) {
          courseMap.set(course.code, course);
        }
      }
    });
    
    return Array.from(courseMap.values());
  }
  
  /**
   * Rule 2: Only count courses with valid grades
   * @param {Object} course - Course object
   * @returns {boolean} - Whether course should be counted
   */
  static shouldCountCourse(course) {
    // Don't count courses with non-counted grades
    if (NON_COUNTED_GRADES.includes(course.grade)) {
      return false;
    }
    
    // Don't count courses without grades
    if (!course.grade || course.grade.trim() === '') {
      return false;
    }
    
    // Don't count audit courses
    if (course.electiveType === 'Audit') {
      return false;
    }
    
    return true;
  }
  
  /**
   * Rule 3: Handle backlog courses correctly
   * If a backlog course is cleared later, use the clearing attempt
   * @param {Array} allCourses - All courses across semesters
   * @returns {Array} - Courses with backlog rules applied
   */
  static applyBacklogRule(allCourses) {
    const regularCourses = allCourses.filter(c => c.regType !== 'Backlog');
    const backlogCourses = allCourses.filter(c => c.regType === 'Backlog');
    
    // For each backlog course, check if it's cleared
    const clearedBacklogs = new Set();
    
    backlogCourses.forEach(backlog => {
      const originalFail = regularCourses.find(
        c => c.code === backlog.code && 
        (c.grade === 'F' || c.grade === 'FR' || c.grade === 'FS')
      );
      
      if (originalFail) {
        clearedBacklogs.add(originalFail.code);
      }
    });
    
    // Remove original failed courses that were cleared via backlog
    return regularCourses.filter(c => !clearedBacklogs.has(c.code))
      .concat(backlogCourses);
  }
  
  /**
   * Rule 4: Calculate GPA for a set of courses
   * @param {Array} courses - Array of course objects
   * @returns {Object} - GPA calculation result
   */
  static calculateGPA(courses) {
    // Apply all rules first
    let processedCourses = this.applyDuplicateCourseRule(courses);
    processedCourses = this.applyBacklogRule(processedCourses);
    
    let totalCredits = 0;
    let totalGradePoints = 0;
    let earnedCredits = 0;
    
    const countedCourses = processedCourses.filter(course => this.shouldCountCourse(course));
    
    countedCourses.forEach(course => {
      const gradePoint = GRADE_POINTS[course.grade];
      const credits = parseFloat(course.credits) || 0;
      
      if (gradePoint !== null && gradePoint !== undefined) {
        totalGradePoints += gradePoint * credits;
        totalCredits += credits;
        
        // Only count as earned if passing grade
        if (gradePoint >= 4) {
          earnedCredits += credits;
        }
      }
    });
    
    const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
    
    return {
      gpa: parseFloat(gpa.toFixed(3)),
      totalCredits: parseFloat(totalCredits.toFixed(2)),
      earnedCredits: parseFloat(earnedCredits.toFixed(2)),
      gradePoints: parseFloat(totalGradePoints.toFixed(2)),
      courseCount: countedCourses.length,
      courses: countedCourses,
    };
  }
  
  /**
   * Rule 5: Calculate SGPA (Semester GPA) for a single semester
   * @param {Array} courses - Courses in the semester
   * @returns {Object} - SGPA result
   */
  static calculateSGPA(courses) {
    return this.calculateGPA(courses);
  }
  
  /**
   * Rule 6: Calculate CGPA (Cumulative GPA) across semesters
   * @param {Array} semesters - Array of semester objects with courses
   * @returns {Object} - CGPA result
   */
  static calculateCGPA(semesters) {
    const allCourses = semesters.flatMap(sem => sem.courses);
    return this.calculateGPA(allCourses);
  }
  
  /**
   * Rule 7: Projected GPA with expected grades
   * @param {Array} currentCourses - Current completed courses
   * @param {Array} projectedCourses - Courses with projected grades
   * @returns {Object} - Projected GPA
   */
  static calculateProjectedGPA(currentCourses, projectedCourses) {
    const allCourses = [...currentCourses, ...projectedCourses];
    return this.calculateGPA(allCourses);
  }
}