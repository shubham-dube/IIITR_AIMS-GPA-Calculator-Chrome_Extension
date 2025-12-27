import { GRADE_POINTS, ALWAYS_NON_COUNTED, PROJECTED_IGNORE_GRADES } from '../constants/gradeSystem.js';

/**
 * Centralized GPA Calculation Rules
 * Implements context-aware grading and unlimited swapping.
 */
export class GPACalculationRules {
  
  /**
   * Helper to determine points based on context.
   * If isProjected is true, F/FR/FS are treated as null (ignored).
   */
  static getEffectiveGradePoint(grade, isProjected = false) {
    if (isProjected && PROJECTED_IGNORE_GRADES.includes(grade)) {
      return null;
    }
    return GRADE_POINTS[grade];
  }

  static applyDuplicateCourseRule(courses) {
    const courseMap = new Map();
    courses.forEach(course => {
      const existingCourse = courseMap.get(course.code);
      if (!existingCourse) {
        courseMap.set(course.code, course);
      } else {
        const existingPoints = GRADE_POINTS[existingCourse.grade];
        const currentPoints = GRADE_POINTS[course.grade];
        if (currentPoints !== null && (existingPoints === null || currentPoints >= existingPoints)) {
          courseMap.set(course.code, course);
        }
      }
    });
    return Array.from(courseMap.values());
  }
  
  static shouldCountCourse(course, isProjected = false) {
    if (ALWAYS_NON_COUNTED.includes(course.grade)) return false;
    if (!course.grade || course.grade.trim() === '') return false;
    
    // In projection mode, skip F/FR/FS
    const points = this.getEffectiveGradePoint(course.grade, isProjected);
    if (points === null) return false;

    if (course.electiveType === 'Audit') return false;
    return true;
  }
  
  static applyBacklogRule(allCourses) {
    const regularCourses = allCourses.filter(c => c.regType !== 'Backlog');
    const backlogCourses = allCourses.filter(c => c.regType === 'Backlog');
    const clearedBacklogs = new Set();
    backlogCourses.forEach(backlog => {
      const originalFail = regularCourses.find(c => c.code === backlog.code && (c.grade === 'F' || c.grade === 'FR' || c.grade === 'FS'));
      if (originalFail) clearedBacklogs.add(originalFail.code);
    });
    return regularCourses.filter(c => !clearedBacklogs.has(c.code)).concat(backlogCourses);
  }

  /**
   * Targeted Manual Swapping Logic (Unlimited)
   * Ensures strict 1-for-1 replacement by removing historical courses.
   */
  static applyTargetedSwappingRule(currentCourses, projectedCourses) {
    const swapRequests = projectedCourses.filter(p => p.isSwap && p.targetCourseUid);
    
    if (swapRequests.length === 0) {
      return { finalCourses: [...currentCourses, ...projectedCourses], swappedOut: [] };
    }

    const swappedOutIds = new Set();
    const swappedDetails = [];

    swapRequests.forEach(swap => {
      const historicalMatch = currentCourses.find(c => {
        const sem = c.semester || 'HIST';
        const uid = `${c.code}-${sem}-${c.credits}`;
        return uid === swap.targetCourseUid;
      });
      if (historicalMatch) {
        swappedOutIds.add(swap.targetCourseUid);
        swappedDetails.push(historicalMatch);
      }
    });

    const remainingHistorical = currentCourses.filter(c => {
      const sem = c.semester || 'HIST';
      const uid = `${c.code}-${sem}-${c.credits}`;
      return !swappedOutIds.has(uid);
    });
    
    return {
      finalCourses: [...remainingHistorical, ...projectedCourses],
      swappedOut: swappedDetails
    };
  }
  
  /**
   * Main calculation entry point
   * @param {boolean} isProjected - Determines Fail handling
   */
  static calculateGPA(courses, isProjected = false) {
    let processedCourses = this.applyDuplicateCourseRule(courses);
    processedCourses = this.applyBacklogRule(processedCourses);
    
    let totalCredits = 0;
    let totalGradePoints = 0;
    let earnedCredits = 0;
    
    const countedCourses = processedCourses.filter(course => this.shouldCountCourse(course, isProjected));
    
    countedCourses.forEach(course => {
      const gradePoint = this.getEffectiveGradePoint(course.grade, isProjected);
      const credits = parseFloat(course.credits) || 0;
      if (gradePoint !== null && gradePoint !== undefined) {
        totalGradePoints += (gradePoint * credits);
        totalCredits += credits;
        if (gradePoint >= 4) earnedCredits += credits;
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
  
  static calculateSGPA(courses) { return this.calculateGPA(courses, false); }
  
  static calculateCGPA(semesters) {
    const allCourses = (semesters || []).flatMap(sem => {
      const semName = sem.name || sem.semesterName || 'HIST';
      return (sem.courses || []).map(c => ({ ...c, semester: semName }));
    });
    return this.calculateGPA(allCourses, false);
  }
  
  static calculateProjectedGPA(currentCourses, projectedCourses) {
    const { finalCourses, swappedOut } = this.applyTargetedSwappingRule(currentCourses, projectedCourses);
    // Projection mode treats F as null
    const result = this.calculateGPA(finalCourses, true);
    return { ...result, swappedOut };
  }
}