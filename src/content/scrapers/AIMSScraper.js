import { MESSAGE_TYPES } from '@shared/constants/messages';

export class AIMSScraper {
  
  async scrapeData() {
    try {
      // Fetch course history data
      const response = await fetch(
        'https://aims.iiitr.ac.in/iiitraichur/courseReg/loadMyCoursesHistroy?' +
        'studentId=&courseCd=&courseName=&orderBy=1&degreeIds=&acadPeriodIds=&regTypeIds=&gradeIds=&resultIds=&isGradeIds='
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const courseData = await response.json();
      
      // Extract student info
      const studentInfo = this.extractStudentInfo();
      
      return {
        success: true,
        courseData,
        studentInfo,
      };
    } catch (error) {
      console.error('Scraping error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
  
  extractStudentInfo() {
    const studentName = document.querySelector('.stuName')?.textContent.trim();
    const infoDiv = document.querySelector('.studentInfoDiv');
    const spans = infoDiv?.querySelectorAll('span');
    
    return {
      name: studentName || '',
      id: spans?.[0]?.textContent.trim() || '',
      branch: spans?.[1]?.textContent.trim() || '',
      type: spans?.[2]?.textContent.trim() || '',
      photo: document.querySelector('.studentPhoto')?.src || '',
    };
  }
  
  injectCourseSelectors() {
    // Add checkboxes next to each course in the table
    const courseRows = document.querySelectorAll('.hierarchyLi.dataLi:not(.hierarchyHdr)');
    
    courseRows.forEach((row, index) => {
      if (row.querySelector('.gpa-genie-checkbox')) return; // Already injected
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'gpa-genie-checkbox';
      checkbox.style.cssText = 'margin-right: 10px; cursor: pointer;';
      checkbox.dataset.courseIndex = index;
      
      const firstCol = row.querySelector('.col1');
      if (firstCol) {
        firstCol.insertBefore(checkbox, firstCol.firstChild);
      }
    });
  }
  
  getSelectedCourses() {
    const checkboxes = document.querySelectorAll('.gpa-genie-checkbox:checked');
    return Array.from(checkboxes).map(cb => parseInt(cb.dataset.courseIndex));
  }
}