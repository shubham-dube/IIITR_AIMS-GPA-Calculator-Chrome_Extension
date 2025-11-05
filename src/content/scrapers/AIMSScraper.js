import { MESSAGE_TYPES } from '@shared/constants/messages';

export class AIMSScraper {
  async scrapeData() {
    try {
      const { baseUrl, institute } = this.getBaseInfo();

      const url = `${baseUrl}${institute}/courseReg/loadMyCoursesHistroy?` +
        'studentId=&courseCd=&courseName=&orderBy=1&degreeIds=&acadPeriodIds=&regTypeIds=&gradeIds=&resultIds=&isGradeIds=';

      const response = await fetch(url);

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

  getBaseInfo() {
    const { origin, pathname } = window.location;
    const parts = pathname.split('/').filter(Boolean);
    const institute = parts[0] || '';
    return {
      baseUrl: origin + '/',
      institute,
    };
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
    const courseRows = document.querySelectorAll('.hierarchyLi.dataLi:not(.hierarchyHdr)');
    courseRows.forEach((row, index) => {
      if (row.querySelector('.gpa-genie-checkbox')) return;
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
