import { GRADE_POINTS } from '../constants/gradeSystem';

/**
 * Transform raw AIMS data to structured format
 */
export class DataTransformer {
  
  static transformAIMSData(rawData, studentInfo) {
    const semesterMap = new Map();
    
    rawData.forEach(course => {
      if (!course.periodName) return;
      
      if (!semesterMap.has(course.periodName)) {
        semesterMap.set(course.periodName, {
          id: course.periodName,
          name: course.periodName,
          courses: [],
        });
      }
      
      const semester = semesterMap.get(course.periodName);
      semester.courses.push({
        code: course.courseCd,
        title: course.courseName,
        credits: parseFloat(course.credits) || 0,
        grade: course.gradeDesc?.trim() || '',
        gradePoints: GRADE_POINTS[course.gradeDesc?.trim()] || 0,
        regType: course.courseRegTypeDesc,
        electiveType: course.courseElectiveDesc || '',
        segment: course.segmentCode || '',
        coordinator: course.courseCoordinatorName || '',
        regDate: course.courseRegDt,
      });
    });
    
    return {
      student: {
        name: studentInfo.name,
        rollNo: studentInfo.id,
        branch: studentInfo.branch,
        type: studentInfo.type,
        photo: studentInfo.photo,
      },
      semesters: Array.from(semesterMap.values()), // Most recent first
    };
  }
  
  static transformForTranscript(data, selectedSemesters) {
    return {
      student: data.student,
      semesters: data.semesters.filter(sem => 
        selectedSemesters.includes(sem.id)
      ),
      generatedAt: new Date().toISOString(),
    };
  }
}