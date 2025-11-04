import { GPACalculator } from '@shared/utils/gpaCalculator';
import { InlineGPA } from './InlineGPA';


export class CourseSelector {
  constructor(scraper) {
    this.scraper = scraper;
    this.inlineGPA = new InlineGPA();
    this.selectedCourses = new Set();
    this.allCourses = [];
    this.onSelectionChange = null;
    this.settings = {
      showSGPA: false,
      showCGPA: false,
      showOverallCGPA: false,
    };
    this.loadSettings();
  }


  async loadSettings() {
    const result = await chrome.storage.local.get('gpaDisplaySettings');
    if (result.gpaDisplaySettings) {
      this.settings = { ...this.settings, ...result.gpaDisplaySettings };
    }
  }


  async saveSettings() {
    await chrome.storage.local.set({ gpaDisplaySettings: this.settings });
  }


  inject() {
    const tryInject = () => {
      const courseRows = document.querySelectorAll('.hierarchyLi.dataLi:not(.hierarchyHdr):not(.hierarchySubHdr)');
      if (courseRows.length > 0) {
        this._injectCourses(courseRows);
        this.injectOverallCGPA();
        this.injectSettingsPanel();
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
      checkbox.checked = false;
      // this.selectedCourses.add(index);


      checkbox.addEventListener('change', () => {
        if (checkbox.checked) this.selectedCourses.add(index);
        else this.selectedCourses.delete(index);
        this.updateInlineGPA();
        this.notifySelectionChange();
      });


      const firstCol = row.querySelector('.col1');
      if (firstCol) firstCol.insertBefore(checkbox, firstCol.firstChild);
    });


    this.injectSemesterCards();
    this.updateInlineGPA();
  }


  injectSemesterCards() {
    const semesterHeaders = document.querySelectorAll('.hierarchyHdr');
    let cumulativeCourses = [];
    
    semesterHeaders.forEach((header, headerIndex) => {
      if (header.querySelector('.gpa-genie-semester-card')) return;
      
      const semesterName = header.querySelector('.col')?.textContent.trim();
      if (!semesterName) return;

      // Extract academic session and degree info from semester name
      // Example: "Fall 2023 - Bachelor of Science"
      const sessionMatch = semesterName.match(/(\d{4})/);
      const academicYear = sessionMatch ? sessionMatch[1] : '';
      
      let nextSibling = header.nextElementSibling;
      const semesterCourses = [];
      let degreeInfo = '';

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
        // Calculate SGPA and CGPA
        const sgpaResult = GPACalculator.calculateSemesterGPA({ courses: semesterCourses });
        cumulativeCourses = [...cumulativeCourses, ...semesterCourses];
        const cgpaResult = GPACalculator.calculateSemesterGPA({ courses: cumulativeCourses });
        
        // Create custom semester card
        const semesterCard = this.createSemesterCard(
          semesterName,
          academicYear,
          degreeInfo,
          sgpaResult,
          cgpaResult,
          semesterCourses.length,
          header
        );
        
        // Hide original header and insert card
        header.style.display = 'none';
        header.parentNode.insertBefore(semesterCard, header);
      }
    });
  }

  createSemesterCard(semesterName, academicYear, degreeInfo, sgpaResult, cgpaResult, courseCount, originalHeader) {
    const card = document.createElement('div');
    card.className = 'gpa-genie-semester-card';
    
    card.innerHTML = `
      <div class="gpa-genie-card-header">
        <div class="gpa-genie-header-left">
          <div class="gpa-genie-semester-badge">${degreeInfo}</div>
          <div class="gpa-genie-semester-info">
            <div class="gpa-genie-semester-name">${semesterName}</div>
            ${academicYear ? `<div class="gpa-genie-academic-year">AY ${academicYear}</div>` : ''}
          </div>
        </div>
        
        <div class="gpa-genie-card-stats">
          ${this.settings.showSGPA ? `
            <div class="gpa-genie-stat-item">
              <div class="gpa-genie-stat-label">SGPA</div>
              <div class="gpa-genie-stat-value">${sgpaResult.gpa.toFixed(2)}</div>
            </div>
          ` : ''}
          
          ${this.settings.showCGPA ? `
            <div class="gpa-genie-stat-item">
              <div class="gpa-genie-stat-label">CGPA</div>
              <div class="gpa-genie-stat-value">${cgpaResult.gpa.toFixed(2)}</div>
            </div>
          ` : ''}
          
          <div class="gpa-genie-stat-item gpa-genie-stat-secondary">
            <div class="gpa-genie-stat-label">Credits</div>
            <div class="gpa-genie-stat-value">${sgpaResult.earnedCredits}</div>
          </div>
        </div>
        
        <div class="gpa-genie-card-actions">
          <button class="gpa-genie-select-btn" title="Toggle semester selection">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Select All</span>
          </button>
        
        </div>
      </div>
    `;

    // Event listeners remain the same
    const selectBtn = card.querySelector('.gpa-genie-select-btn');
    
    selectBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleSemesterSelection(originalHeader);
      this.updateSelectButtonState(selectBtn, originalHeader);
    });

    this.updateSelectButtonState(selectBtn, originalHeader);
    
    return card;
  }


  getGradeColor(gpa) {
    if (gpa >= 9) return '#10b981'; // Green
    if (gpa >= 8) return '#3b82f6'; // Blue
    if (gpa >= 7) return '#f59e0b'; // Yellow
    if (gpa >= 6) return '#f97316'; // Orange
    return '#ef4444'; // Red
  }

  updateSelectButtonState(button, header) {
    let nextSibling = header.nextElementSibling;
    const semesterCourseIndices = [];
    
    while (nextSibling && !nextSibling.classList.contains('hierarchyHdr')) {
      if (nextSibling.classList.contains('dataLi') && 
          !nextSibling.classList.contains('hierarchySubHdr')) {
        const checkbox = nextSibling.querySelector('.gpa-genie-checkbox');
        if (checkbox) {
          const index = parseInt(checkbox.dataset.courseIndex);
          semesterCourseIndices.push(index);
        }
      }
      nextSibling = nextSibling.nextElementSibling;
    }

    const allSelected = semesterCourseIndices.every(index => 
      this.selectedCourses.has(index)
    );

    if (allSelected) {
      button.classList.add('selected');
      button.setAttribute('title', 'Deselect all courses');
    } else {
      button.classList.remove('selected');
      button.setAttribute('title', 'Select all courses');
    }
  }


  toggleCoursesVisibility(header, button) {
    let nextSibling = header.nextElementSibling;
    let isHidden = false;
    
    while (nextSibling && !nextSibling.classList.contains('hierarchyHdr')) {
      if (nextSibling.classList.contains('dataLi')) {
        if (!isHidden) {
          isHidden = nextSibling.style.display === 'none';
        }
        nextSibling.style.display = isHidden ? '' : 'none';
      }
      nextSibling = nextSibling.nextElementSibling;
    }

    // Rotate collapse icon
    const svg = button.querySelector('svg');
    svg.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
  }

  toggleSemesterSelection(header) {
    let nextSibling = header.nextElementSibling;
    const semesterCourseIndices = [];
    
    while (nextSibling && !nextSibling.classList.contains('hierarchyHdr')) {
      if (nextSibling.classList.contains('dataLi') && 
          !nextSibling.classList.contains('hierarchySubHdr')) {
        const checkbox = nextSibling.querySelector('.gpa-genie-checkbox');
        if (checkbox) {
          const index = parseInt(checkbox.dataset.courseIndex);
          semesterCourseIndices.push({ checkbox, index });
        }
      }
      nextSibling = nextSibling.nextElementSibling;
    }

    const allSelected = semesterCourseIndices.every(({ index }) => 
      this.selectedCourses.has(index)
    );

    semesterCourseIndices.forEach(({ checkbox, index }) => {
      if (allSelected) {
        this.selectedCourses.delete(index);
        checkbox.checked = false;
      } else {
        this.selectedCourses.add(index);
        checkbox.checked = true;
      }
    });

    this.updateInlineGPA();
    this.notifySelectionChange();
  }


  injectOverallCGPA() {
    if (!this.settings.showOverallCGPA) return;

    const studentInfoDiv = document.querySelector('.studentInfoDiv');
    if (!studentInfoDiv || document.querySelector('.gpa-genie-overall-cgpa')) return;

    const allCoursesWithGrades = this.allCourses.filter(c => c.grade && c.grade.trim());
    if (allCoursesWithGrades.length === 0) return;

    const result = GPACalculator.calculateSemesterGPA({ courses: allCoursesWithGrades });

    const cgpaDiv = document.createElement('div');
    cgpaDiv.className = 'gpa-genie-overall-cgpa';
    cgpaDiv.innerHTML = `
      <div class="clear"></div>
      <div class="flexDiv" style="margin-top: 10px; border-top: 2px solid #0ea5e9; padding-top: 10px;">
        <div style="flex;">
          <label style="font-weight: bold; color: #0ea5e9;">Overall CGPA: </label>
          <span style="font-size: 12px; font-weight: bold; color: #0369a1;">${result.gpa.toFixed(2)}</span>
        </div>
        <div style="flex;">
          <label style="font-weight: bold; color: #0ea5e9;">Credits Completed: </label>
          <span style="font-size: 12px; color: #64748b;">${result.earnedCredits} / ${result.totalCredits}</span>
        </div>
      </div>
    `;

    studentInfoDiv.appendChild(cgpaDiv);
  }


  injectSettingsPanel() {
    if (document.querySelector('.gpa-genie-settings-panel')) return;

    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'gpa-genie-settings-panel';
    settingsPanel.innerHTML = `
      <button class="gpa-genie-settings-toggle" title="GPA Display Settings">
        GPA Visibility Settings
      </button>
      <div class="gpa-genie-settings-content" style="display: none;">
        <div class="gpa-genie-settings-title">GPA Visibility Settings</div>
        <label class="gpa-genie-settings-option">
          <input type="checkbox" id="showSGPA" ${this.settings.showSGPA ? 'checked' : ''}>
          <span>Show Semester GPA (SGPA)</span>
        </label>
        <label class="gpa-genie-settings-option">
          <input type="checkbox" id="showOverallCGPA" ${this.settings.showOverallCGPA ? 'checked' : ''}>
          <span>Show Overall CGPA in Student Info</span>
        </label>
        <button class="gpa-genie-settings-apply">Apply Settings</button>
      </div>
    `;

    const mainDiv = document.querySelector('.main');
    if (mainDiv) {
      mainDiv.insertBefore(settingsPanel, mainDiv.firstChild);
    }

    const toggleBtn = settingsPanel.querySelector('.gpa-genie-settings-toggle');
    const content = settingsPanel.querySelector('.gpa-genie-settings-content');
    const applyBtn = settingsPanel.querySelector('.gpa-genie-settings-apply');

    toggleBtn.addEventListener('click', () => {
      const isHidden = content.style.display === 'none';
      content.style.display = isHidden ? 'block' : 'none';
    });

    applyBtn.addEventListener('click', async () => {
      this.settings.showSGPA = document.getElementById('showSGPA').checked;
      // this.settings.showCGPA = document.getElementById('showCGPA').checked;
      this.settings.showOverallCGPA = document.getElementById('showOverallCGPA').checked;
      
      await this.saveSettings();
      this.refreshGPADisplay();
      
      content.style.display = 'none';
      
      const originalText = applyBtn.textContent;
      applyBtn.textContent = '✓ Applied!';
      applyBtn.style.backgroundColor = '#22c55e';
      setTimeout(() => {
        applyBtn.textContent = originalText;
        applyBtn.style.backgroundColor = '';
      }, 2000);
    });
  }


  refreshGPADisplay() {
    document.querySelectorAll('.gpa-genie-semester-card').forEach(el => el.remove());
    document.querySelectorAll('.hierarchyHdr').forEach(el => el.style.display = '');
    document.querySelectorAll('.gpa-genie-overall-cgpa').forEach(el => el.remove());
    
    this.injectSemesterCards();
    this.injectOverallCGPA();
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
