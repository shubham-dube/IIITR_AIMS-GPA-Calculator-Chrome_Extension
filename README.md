# GPA Genie - Professional CGPA Calculator

A modern, feature-rich Chrome extension for calculating CGPA, projecting grades, viewing analytics, and generating professional transcripts for IIIT Raichur AIMS Portal.

## ✨ Features

### Core Features
- 📊 **Smart GPA Calculator**: Calculate CGPA for selected semesters with intelligent rule-based calculations
- 🎯 **Projected GPA**: Add expected courses and grades to see future CGPA
- 📈 **Analytics Dashboard**: Visualize semester-wise performance with charts and trends
- 📄 **Professional Transcripts**: Generate official-looking transcripts with multiple templates
- 💾 **Save Calculations**: Store and reload previous GPA calculations
- ⚙️ **Customizable Settings**: Configure decimal places, default views, and more

### Intelligent Calculation Rules
- ✅ Handles duplicate courses (best grade considered)
- ✅ Proper backlog course management
- ✅ Excludes non-counted grades (I, S, U, AU)
- ✅ Semester-wise and cumulative GPA calculation
- ✅ Credits and grade points tracking

### UI/UX Features
- 🎨 Modern, professional interface with Tailwind CSS
- 🌊 Smooth animations and transitions
- 📱 Responsive design
- 🔄 Real-time GPA updates on course selection
- ⚡ Fast performance with optimized React components

## 🚀 Installation

### For Development

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/gpa-genie.git
   cd gpa-genie
```

2. **Install dependencies**
```bash
   npm install
```

3. **Build the extension**
```bash
   npm run build
```

4. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### For Development with Live Reload
```bash
npm run dev
```

This will watch for changes and rebuild automatically.

## 📖 Usage

1. **Navigate to AIMS Portal**
   - Go to your Course History page on AIMS
   - The extension will automatically inject course selectors

2. **Calculate GPA**
   - Click the extension icon
   - Select semesters you want to include
   - Click "Calculate CGPA"
   - View your results with detailed breakdown

3. **View Analytics**
   - Switch to the Analytics tab
   - See semester-wise GPA trends
   - View grade distribution and performance stats

4. **Project Future GPA**
   - Go to Projected tab
   - Add courses with expected grades
   - See how they'll impact your CGPA

5. **Generate Transcript**
   - After calculating GPA, click "Transcript"
   - Choose template (Official or Minimal)
   - Print or download as PDF

## 🏗️ Project Structure
```
gpa-genie/
├── src/
│   ├── background/         # Background service worker
│   ├── content/           # Content scripts for AIMS
│   ├── popup/             # Extension popup UI
│   ├── transcript/        # Transcript generation
│   └── shared/            # Shared utilities and rules
├── public/                # Static assets
├── dist/                  # Build output
└── package.json
```

## 🔧 Configuration

### GPA Calculation Rules

All calculation rules are centralized in `src/shared/rules/GPACalculationRules.js`:

- **Duplicate Course Rule**: Only best grade is counted
- **Backlog Rule**: Cleared backlogs replace original fails
- **Grade Counting**: Only valid, graded courses count toward GPA
- **Credit System**: 10-point scale (A+=10, F=0)

### Adding New Rules
```javascript
// src/shared/rules/GPACalculationRules.js
static yourNewRule(courses) {
  // Implement your rule logic
  return processedCourses;
}
```

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#your-color',
    // ...
  },
}
```

### Adding New Templates

Create a new template in `src/transcript/templates/`:
```jsx
export default function YourTemplate({ data }) {
  return (
    <div className="transcript-page">
      {/* Your template design */}
    </div>
  );
}
```

## 🧪 Testing
```bash
# Run tests (when implemented)
npm test

# Lint code
npm run lint
```

## 📦 Building for Production
```bash
npm run build
```

The production-ready extension will be in the `dist/` folder.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- IIIT Raichur for the AIMS portal
- React and Tailwind CSS teams
- All contributors and users

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/gpa-genie](https://github.com/yourusername/gpa-genie)

---

Made with ❤️ for IIIT Raichur students