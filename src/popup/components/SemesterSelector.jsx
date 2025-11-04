import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, CheckSquare, Square, MinusSquare } from 'lucide-react';

export default function SemesterSelector({ 
  semesters, 
  selectedCourses, 
  onSelectionChange,
  onCalculate 
}) {
  const [expandedSemesters, setExpandedSemesters] = useState(new Set());

  useEffect(() => {
    // Auto-select all courses initially
    if (selectedCourses.length === 0 && semesters.length > 0) {
      const allCourses = semesters.flatMap(sem => 
        sem.courses.map(course => ({ ...course, semesterId: sem.id }))
      );
      onSelectionChange(allCourses);
    }
  }, [semesters]);

  const toggleSemester = (semId) => {
    const newExpanded = new Set(expandedSemesters);
    if (newExpanded.has(semId)) {
      newExpanded.delete(semId);
    } else {
      newExpanded.add(semId);
    }
    setExpandedSemesters(newExpanded);
  };

  const toggleCourse = (course, semesterId) => {
    const courseWithSem = { ...course, semesterId };
    const isSelected = selectedCourses.some(
      c => c.code === course.code && c.semesterId === semesterId
    );

    if (isSelected) {
      onSelectionChange(selectedCourses.filter(
        c => !(c.code === course.code && c.semesterId === semesterId)
      ));
    } else {
      onSelectionChange([...selectedCourses, courseWithSem]);
    }
  };

  const toggleAllInSemester = (semester) => {
    const semesterCourses = semester.courses.map(c => ({ ...c, semesterId: semester.id }));
    const allSelected = semesterCourses.every(sc => 
      selectedCourses.some(c => c.code === sc.code && c.semesterId === sc.semesterId)
    );

    if (allSelected) {
      // Deselect all
      onSelectionChange(selectedCourses.filter(
        c => c.semesterId !== semester.id
      ));
    } else {
      // Select all
      const otherCourses = selectedCourses.filter(c => c.semesterId !== semester.id);
      onSelectionChange([...otherCourses, ...semesterCourses]);
    }
  };

  const getSemesterState = (semester) => {
    const semesterCourses = semester.courses.map(c => ({ ...c, semesterId: semester.id }));
    const selectedCount = semesterCourses.filter(sc => 
      selectedCourses.some(c => c.code === sc.code && c.semesterId === sc.semesterId)
    ).length;

    if (selectedCount === 0) return 'none';
    if (selectedCount === semesterCourses.length) return 'all';
    return 'partial';
  };

  const isBacklogOnly = (semester) => {
    return semester.courses.every(c => c.regType === 'Backlog');
  };

  const getSemesterNumber = (index) => {
    const nonBacklogSemesters = semesters.filter(s => !isBacklogOnly(s));
    const semIndex = nonBacklogSemesters.findIndex(s => s.id === semesters[index].id);
    return semIndex !== -1 ? nonBacklogSemesters.length - semIndex : null;
  };

  return (
    <div className="card p-2">
      <div className="flex items-center justify-between mb-2 px-2">
        <h3 className="text-sm font-semibold text-gray-800">Select Courses</h3>
        <button
          onClick={() => onCalculate(selectedCourses)}
          disabled={selectedCourses.length === 0}
          className="btn-primary btn-sm py-1 px-2 text-xs disabled:opacity-50"
        >
          Calculate
        </button>
      </div>

      <div className="space-y-1 max-h-96 overflow-y-auto">
        {semesters.map((semester, index) => {
          const state = getSemesterState(semester);
          const isExpanded = expandedSemesters.has(semester.id);
          const backlogOnly = isBacklogOnly(semester);
          const semNumber = getSemesterNumber(index);

          return (
            <div key={semester.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Semester Header */}
              <div className="bg-gray-50 px-2 py-1.5 flex items-center gap-2">
                <button
                  onClick={() => toggleSemester(semester.id)}
                  className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                
                <button
                  onClick={() => toggleAllInSemester(semester)}
                  className="p-0.5"
                >
                  {state === 'all' && <CheckSquare size={16} className="text-primary-600" />}
                  {state === 'none' && <Square size={16} className="text-gray-400" />}
                  {state === 'partial' && <MinusSquare size={16} className="text-primary-600" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-800 truncate">
                      {semester.name}
                    </span>
                    {backlogOnly ? (
                      <span className="badge badge-warning text-[10px] px-1.5 py-0">Holidays</span>
                    ) : semNumber && (
                      <span className="badge badge-primary text-[10px] px-1.5 py-0">Sem {semNumber}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {semester.courses.length} courses
                  </span>
                </div>
              </div>

              {/* Course List */}
              {isExpanded && (
                <div className="bg-white">
                  {semester.courses.map((course, idx) => {
                    const isSelected = selectedCourses.some(
                      c => c.code === course.code && c.semesterId === semester.id
                    );

                    return (
                      <label
                        key={idx}
                        className={`flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer border-t border-gray-100 ${
                          isSelected ? 'bg-primary-50' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCourse(course, semester.id)}
                          className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-1 focus:ring-primary-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-gray-700">{course.code}</span>
                            {course.grade && (
                              <span className={`text-xs font-bold ${
                                ['A+', 'A', 'A-'].includes(course.grade) ? 'text-green-600' :
                                ['B', 'B-'].includes(course.grade) ? 'text-blue-600' :
                                ['C', 'C-'].includes(course.grade) ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {course.grade}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-600 truncate">{course.title}</p>
                        </div>
                        <span className="text-[10px] text-gray-500">{course.credits}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 px-2 text-[10px] text-gray-500 text-center">
        {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''} selected
      </div>
    </div>
  );
}