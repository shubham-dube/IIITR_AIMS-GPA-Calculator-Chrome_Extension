import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Calculator, TrendingUp, Zap, Save, BookOpen } from 'lucide-react';
import { GPACalculator } from '@shared/utils/gpaCalculator';
import { GRADE_POINTS } from '@shared/constants/gradeSystem';
import { StorageManager } from '@shared/storage/storageManager';

export default function ProjectedGPA({ semesters }) {
  const [projectedCourses, setProjectedCourses] = useState([]);
  const [currentGPA, setGPAResult] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    credits: '',
    expectedGrade: 'A',
  });
  const [projectedResult, setProjectedResult] = useState(null);

  const availableGrades = Object.keys(GRADE_POINTS).filter(g => 
    GRADE_POINTS[g] !== null && GRADE_POINTS[g] !== undefined
  );

  useEffect(() => {
    loadSavedProjection();
    const result = GPACalculator.calculateCumulativeGPA(semesters);
    setGPAResult(result);
  }, []);

  const loadSavedProjection = async () => {
    const saved = await StorageManager.getProjectedGrades();
    if (saved && saved.length > 0) {
      setProjectedCourses(saved);
    }
  };

  const saveProjection = async () => {
    await StorageManager.saveProjectedGrades(projectedCourses);
  };

  const handleAddCourse = () => {
    if (!newCourse.credits) return;

    const course = {
      code: `PROJ-${Date.now()}`,
      title: newCourse.title || `Projected Course ${projectedCourses.length + 1}`,
      credits: parseFloat(newCourse.credits),
      grade: newCourse.expectedGrade,
      regType: 'Projected',
      electiveType: 'Projected',
    };

    setProjectedCourses([...projectedCourses, course]);
    setNewCourse({ title: '', credits: '', expectedGrade: 'A' });
  };

  const handleRemoveCourse = (index) => {
    setProjectedCourses(projectedCourses.filter((_, i) => i !== index));
    // saveProjection();
  };

  const handleCalculate = () => {
    if (projectedCourses.length === 0) return;

    const result = GPACalculator.projectGPA(semesters, projectedCourses);
    setProjectedResult(result);
    // saveProjection();
  };

  const getGradeColor = (grade) => {
    const point = GRADE_POINTS[grade];
    if (point >= 9) return 'text-green-600';
    if (point >= 8) return 'text-blue-600';
    if (point >= 7) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const totalProjectedCredits = projectedCourses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Info Banner */}
      <div className="card p-2 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-purple-600" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-800">Project Future GPA</p>
            <p className="text-[10px] text-gray-600">Add expected courses to predict CGPA</p>
          </div>
        </div>
      </div>

      {/* Add Course Form */}
      <div className="card p-2">
          <div className="space-y-2">
            <input
              type="text"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              placeholder="Course title (optional)"
              className="input-field"
            />
            <div className="flex gap-2">
              <input
                type="number"
                step="0.5"
                min="0"
                max="10"
                value={newCourse.credits}
                onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
                placeholder="Credits"
                className="input-field flex-1"
              />
              <select
                value={newCourse.expectedGrade}
                onChange={(e) => setNewCourse({ ...newCourse, expectedGrade: e.target.value })}
                className="input-field flex-1"
              >
                {availableGrades.map(grade => (
                  <option key={grade} value={grade}>
                    {grade} ({GRADE_POINTS[grade]})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddCourse}
              disabled={!newCourse.credits}
              className="w-full btn-primary py-1.5 text-xs disabled:opacity-50"
            >
              <Plus size={14} className="inline mr-1" />
              Add Course
            </button>
          </div>
      </div>

      {/* Projected Courses List */}
      {projectedCourses.length > 0 && (
        <div className="card p-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-800">
              Projected Courses ({projectedCourses.length})
            </span>
            <span className="text-xs text-gray-600">
              {totalProjectedCredits.toFixed(1)} credits
            </span>
          </div>
          
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {projectedCourses.map((course, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-1.5 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${getGradeColor(course.grade)}`}>
                      {course.grade}
                    </span>
                    <span className="text-[10px] text-gray-600">
                      {course.credits} cr
                    </span>
                  </div>
                  {course.title && course.title !== `Quick Add (${course.grade})` && (
                    <p className="text-[10px] text-gray-600 truncate">{course.title}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveCourse(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleCalculate}
            className="w-full btn-success mt-2 py-1.5 text-xs"
          >
            <Calculator size={14} className="inline mr-1" />
            Calculate Projected CGPA
          </button>
        </div>
      )}

      {/* Projected Result */}
      {projectedResult && (
        <div className="card p-3 bg-gradient-to-br from-success-50 to-green-50 border-2 border-success-300 animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-success-500 to-green-600 rounded-full shadow-lg">
                <div className="text-center">
                  <div className="text-xl font-bold text-white leading-none">
                    {projectedResult.gpa.toFixed(2)}
                  </div>
                  <div className="text-[9px] text-green-100">Projected</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Current: {currentGPA.gpa.toFixed(2)}</div>
                <div className={`text-sm font-bold flex items-center gap-1 ${
                  projectedResult.gpa >= currentGPA.gpa ? 'text-success-700' : 'text-red-700'
                }`}>
                  {projectedResult.gpa >= currentGPA.gpa ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {projectedResult.gpa >= currentGPA.gpa ? '+' : ''}
                  {(projectedResult.gpa - currentGPA.gpa).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded p-1.5 text-center border border-success-200">
              <p className="text-[10px] text-gray-600">Total Credits</p>
              <p className="text-sm font-bold text-gray-800">{projectedResult.totalCredits}</p>
            </div>
            <div className="bg-white rounded p-1.5 text-center border border-success-200">
              <p className="text-[10px] text-gray-600">Courses</p>
              <p className="text-sm font-bold text-gray-800">{projectedResult.courseCount}</p>
            </div>
            <div className="bg-white rounded p-1.5 text-center border border-success-200">
              <p className="text-[10px] text-gray-600">New Courses</p>
              <p className="text-sm font-bold text-gray-800">{projectedCourses.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      {projectedCourses.length === 0 && (
        <div className="card p-2 bg-blue-50 border-blue-200">
          <p className="text-xs text-blue-800">
            <strong>💡 Tip:</strong> Use this feature to pridict future CGPA or calculate GPA with your course data.
          </p>
        </div>
      )}
    </div>
  );
}