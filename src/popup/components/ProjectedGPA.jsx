import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Calculator, TrendingUp } from 'lucide-react';
import { GPACalculator } from '@shared/utils/gpaCalculator';
import { GRADE_POINTS } from '@shared/constants/gradeSystem';

export default function ProjectedGPA({ semesters, currentGPA }) {
  const [projectedCourses, setProjectedCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: '',
    credits: '',
    expectedGrade: 'A',
  });
  const [projectedResult, setProjectedResult] = useState(null);

  const availableGrades = Object.keys(GRADE_POINTS).filter(g => 
    GRADE_POINTS[g] !== null && GRADE_POINTS[g] !== undefined
  );

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.credits) return;

    const course = {
      code: `PROJ-${Date.now()}`,
      title: newCourse.title,
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
  };

  const handleCalculate = () => {
    if (projectedCourses.length === 0) return;

    const result = GPACalculator.projectGPA(semesters, projectedCourses);
    setProjectedResult(result);
  };

  const getGradeColor = (grade) => {
    const point = GRADE_POINTS[grade];
    if (point >= 9) return 'text-green-600';
    if (point >= 8) return 'text-blue-600';
    if (point >= 7) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Info Card */}
      <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Target size={20} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-1">Project Your Future GPA</h3>
            <p className="text-sm text-gray-600">
              Add courses with expected grades to see how they'll impact your CGPA
            </p>
          </div>
        </div>
      </div>

      {/* Add Course Form */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Plus size={18} className="text-primary-600" />
          Add Projected Course
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Course Title
            </label>
            <input
              type="text"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              placeholder="e.g., Advanced Algorithms"
              className="input-field text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Credits
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="10"
                value={newCourse.credits}
                onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
                placeholder="3.0"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Expected Grade
              </label>
              <select
                value={newCourse.expectedGrade}
                onChange={(e) => setNewCourse({ ...newCourse, expectedGrade: e.target.value })}
                className="input-field text-sm"
              >
                {availableGrades.map(grade => (
                  <option key={grade} value={grade}>
                    {grade} ({GRADE_POINTS[grade]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAddCourse}
            disabled={!newCourse.title || !newCourse.credits}
            className="w-full btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} className="inline mr-1.5" />
            Add Course
          </button>
        </div>
      </div>

      {/* Projected Courses List */}
      {projectedCourses.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Projected Courses ({projectedCourses.length})
          </h3>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {projectedCourses.map((course, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {course.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    {course.credits} credits • Grade: 
                    <span className={`font-semibold ml-1 ${getGradeColor(course.grade)}`}>
                      {course.grade}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveCourse(index)}
                  className="ml-2 p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleCalculate}
            className="w-full btn-success mt-3"
          >
            <Calculator size={16} className="inline mr-1.5" />
            Calculate Projected CGPA
          </button>
        </div>
      )}

      {/* Projected Result */}
      {projectedResult && (
        <div className="card bg-gradient-to-br from-success-50 to-green-50 border-2 border-success-300 animate-scale-in">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success-500 to-green-600 rounded-full shadow-lg mb-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {projectedResult.gpa.toFixed(2)}
                </div>
                <div className="text-xs text-green-100">Projected</div>
              </div>
            </div>
            
            {currentGPA && (
              <div className="flex items-center justify-center gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Current: </span>
                  <span className="font-bold text-gray-800">{currentGPA.gpa.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1 text-success-700">
                  <TrendingUp size={16} />
                  <span className="font-bold">
                    +{(projectedResult.gpa - currentGPA.gpa).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-2 border border-success-200">
              <p className="text-xs text-gray-600 mb-1">Total Credits</p>
              <p className="text-lg font-bold text-gray-800">{projectedResult.totalCredits}</p>
            </div>
            <div className="bg-white rounded-lg p-2 border border-success-200">
              <p className="text-xs text-gray-600 mb-1">Courses</p>
              <p className="text-lg font-bold text-gray-800">{projectedResult.courseCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      {projectedCourses.length === 0 && (
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Add courses you plan to take with your target grades 
            to see how they'll affect your overall CGPA.
          </p>
        </div>
      )}
    </div>
  );
}