import { GPACalculator } from '@shared/utils/gpaCalculator';
import { InlineGPA } from './InlineGPA';

export class CourseSelector {
  constructor(scraper) {
    this.scraper = scraper;
    this.inlineGPA = new InlineGPA();
    this.selectedCourses = new Set();
    this.allCourses = [];
    this.onSelectionChange = null;
  }

  inject() {

    const tryInject = () => {
      const courseRows = document.querySelectorAll('.hierarchyLi.dataLi:not(.hierarchyHdr):not(.hierarchySubHdr)');
      if (courseRows.length > 0) {
        this._injectCourses(courseRows);
        observer.disconnect();
      }
    };

    tryInject();

    const observer = new MutationObserver(() => {
      tryInject();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }


  _injectCourses(courseRows) {
    courseRows.forEach((row, index) => {
      if (row.querySelector('.gpa-genie-checkbox')) return;

      const courseCode = row.querySelector('.col1')?.textContent.trim();
      const courseName = row.querySelector('.col2')?.textContent.trim();
      const credits = parseFloat(row.querySelector('.col3')?.textContent.trim()) || 0;
      const grade = row.querySelector('.col8')?.textContent.trim();
      const regType = row.querySelector('.col4')?.textContent.trim();

      if (!courseCode) return;

      const course = { code: courseCode, title: courseName, credits, grade, regType, index };
      this.allCourses.push(course);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'gpa-genie-checkbox';
      checkbox.dataset.courseIndex = index;
      checkbox.checked = true;
      this.selectedCourses.add(index);

      checkbox.addEventListener('change', () => {
        if (checkbox.checked) this.selectedCourses.add(index);
        else this.selectedCourses.delete(index);
        this.updateInlineGPA();
      });

      const firstCol = row.querySelector('.col1');
      if (firstCol) firstCol.insertBefore(checkbox, firstCol.firstChild);
    });

    this.injectSemesterGPAs();
    this.updateInlineGPA();
  }

injectSemesterGPAs() {
    const semesterHeaders = document.querySelectorAll('.hierarchyHdr');
    
    semesterHeaders.forEach(header => {
      const semesterName = header.querySelector('.col')?.textContent.trim();
      if (!semesterName) return;

      let nextSibling = header.nextElementSibling;
      const semesterCourses = [];

      while (nextSibling && !nextSibling.classList.contains('hierarchyHdr')) {
        if (nextSibling.classList.contains('dataLi') && 
            !nextSibling.classList.contains('hierarchySubHdr')) {
          
          const courseCode = nextSibling.querySelector('.col1')?.textContent.trim();
          const credits = parseFloat(nextSibling.querySelector('.col3')?.textContent.trim()) || 0;
          const grade = nextSibling.querySelector('.col8')?.textContent.trim();
          const regType = nextSibling.querySelector('.col4')?.textContent.trim();

          if (courseCode && grade) {
            semesterCourses.push({
              code: courseCode,
              credits: credits,
              grade: grade,
              regType: regType,
            });
          }
        }
        nextSibling = nextSibling.nextElementSibling;
      }

      if (semesterCourses.length > 0) {
        const result = GPACalculator.calculateSemesterGPA({ courses: semesterCourses });
        
        const gpaSpan = document.createElement('span');
        gpaSpan.className = 'gpa-genie-semester-gpa';
        gpaSpan.textContent = `SGPA: ${result.gpa.toFixed(2)}`;
        
        const headerCol = header.querySelector('.col');
        if (headerCol && !headerCol.querySelector('.gpa-genie-semester-gpa')) {
          headerCol.appendChild(gpaSpan);
          header.classList.add('gpa-genie-enhanced');
        }
      }
    });
  }

  updateInlineGPA() {
    const selected = this.allCourses.filter((_, index) => 
      this.selectedCourses.has(index)
    );

    if (selected.length === 0) {
      this.inlineGPA.remove();
      return;
    }

    const result = GPACalculator.calculateSemesterGPA({ courses: selected });
    this.inlineGPA.update(result.gpa, result.totalCredits, result.courseCount);
  }

  notifySelectionChange() {
    if (this.onSelectionChange) {
      const selected = this.getSelectedCourses();
      this.onSelectionChange(selected);
    }
  }

  getSelectedCourses() {
    return this.allCourses.filter((_, index) => 
      this.selectedCourses.has(index)
    );
  }

  updateSelection(selectedCourses) {
    this.selectedCourses.clear();
    
    selectedCourses.forEach(course => {
      const index = this.allCourses.findIndex(c => 
        c.code === course.code && c.grade === course.grade
      );
      
      if (index !== -1) {
        this.selectedCourses.add(index);
        const checkbox = document.querySelector(`.gpa-genie-checkbox[data-course-index="${index}"]`);
        if (checkbox) checkbox.checked = true;
      }
    });
    
    this.updateInlineGPA();
  }

  selectAll() {
    this.allCourses.forEach((_, index) => {
      this.selectedCourses.add(index);
      const checkbox = document.querySelector(`.gpa-genie-checkbox[data-course-index="${index}"]`);
      if (checkbox) checkbox.checked = true;
    });
    this.updateInlineGPA();
    this.notifySelectionChange();
  }

  deselectAll() {
    this.selectedCourses.clear();
    document.querySelectorAll('.gpa-genie-checkbox').forEach(cb => {
      cb.checked = false;
    });
    this.inlineGPA.remove();
    this.notifySelectionChange();
  }
}