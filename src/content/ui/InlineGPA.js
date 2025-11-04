export class InlineGPA {
  constructor() {
    this.container = null;
  }

  show(gpa, credits, courses) {
    this.remove(); // Remove existing if any

    this.container = document.createElement('div');
    this.container.className = 'gpa-genie-inline-gpa';
    this.container.innerHTML = `
      <button class="close-btn">×</button>
      <h4>CGPA (Selected Courses)</h4>
      <div class="gpa-value">${gpa.toFixed(2)}</div>
      <div class="gpa-subtitle">${credits} credits • ${courses} courses</div>
    `;

    document.body.appendChild(this.container);

    // Add close handler
    this.container.querySelector('.close-btn').addEventListener('click', () => {
      this.remove();
    });

    // Auto-hide after 10 seconds
    setTimeout(() => {
      this.remove();
    }, 10000);
    }

  remove() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
  }

  update(gpa, credits, courses) {
    if (this.container) {
      const valueEl = this.container.querySelector('.gpa-value');
      const subtitleEl = this.container.querySelector('.gpa-subtitle');
      
      if (valueEl) valueEl.textContent = gpa.toFixed(2);
      if (subtitleEl) subtitleEl.textContent = `${credits} credits • ${courses} courses`;
    } else {
      this.show(gpa, credits, courses);
    }
  }
}