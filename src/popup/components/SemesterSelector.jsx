import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

export default function SemesterSelector({ 
  semesters, 
  selectedSemesters, 
  onSelectionChange,
  onCalculate 
}) {
  const [selectAll, setSelectAll] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    // Auto-select non-backlog semesters on load
    if (semesters.length > 0 && selectedSemesters.length === 0) {
      const defaultSelection = semesters
        .filter(sem => sem.courses.some(c => c.regType !== 'Backlog'))
        .map(sem => sem.id);
      onSelectionChange(defaultSelection);
    }
  }, [semesters]);

  const handleToggleSemester = (semId) => {
    if (selectedSemesters.includes(semId)) {
      onSelectionChange(selectedSemesters.filter(id => id !== semId));
    } else {
      onSelectionChange([...selectedSemesters, semId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      onSelectionChange([]);
    } else {
      onSelectionChange(semesters.map(sem => sem.id));
    }
    setSelectAll(!selectAll);
  };

  const isBacklogOnly = (semester) => {
    return semester.courses.every(c => c.regType === 'Backlog');
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-primary-600" />
          <h3 className="font-semibold text-gray-800">Select Semesters</h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {expanded && (
        <>
          <div className="mb-3">
            <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Select All Semesters</span>
            </label>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {semesters.map((semester, index) => {
              const isSelected = selectedSemesters.includes(semester.id);
              const backlogOnly = isBacklogOnly(semester);
              const semNumber = semesters.length - index;

              return (
                <label
                  key={semester.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-primary-50 border-primary-300'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSemester(semester.id)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">
                        {semester.name}
                      </span>
                      {backlogOnly && (
                        <span className="badge badge-warning text-xs">Holidays</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {backlogOnly ? 'Backlog Clearance' : `Semester ${semNumber}`} • 
                      {' '}{semester.courses.length} courses
                    </p>
                  </div>
                  {isSelected ? (
                    <CheckSquare size={20} className="text-primary-600" />
                  ) : (
                    <Square size={20} className="text-gray-300" />
                  )}
                </label>
              );
            })}
          </div>

          <button
            onClick={() => onCalculate(selectedSemesters)}
            disabled={selectedSemesters.length === 0}
            className="w-full btn-primary mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate CGPA
          </button>
        </>
      )}
    </div>
  );
}