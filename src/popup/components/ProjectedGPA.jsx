import React, { useState, useEffect, useMemo } from 'react';
import { Target, Plus, Trash2, Calculator, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';

/**
 * FIXED IMPORTS: Using standard relative paths with extensions to ensure resolution.
 * These match the project structure: src/popup/components/ -> src/shared/
 */
import { GPACalculator } from '../../shared/utils/gpaCalculator.js';
import { GRADE_POINTS } from '../../shared/constants/gradeSystem.js';
import { StorageManager } from '../../shared/storage/storageManager.js';

export default function ProjectedGPA({ semesters = [] }) {
  const [projectedCourses, setProjectedCourses] = useState([]);
  const [currentGPA, setGPAResult] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    credits: '',
    expectedGrade: 'A',
    isSwap: false,
    targetCourseUid: '' 
  });
  const [projectedResult, setProjectedResult] = useState(null);

  /**
   * Pre-process historical courses for the manual Swap Selector.
   * Ensures every course has a unique UID based on its code, semester, and credits.
   */
  const historicalCoursesList = useMemo(() => {
    return (semesters || []).flatMap(s => (s.courses || []).map(c => {
      const semName = s.name || s.semesterName || 'HIST';
      const uid = `${c.code}-${semName}-${c.credits}`;
      return {
        ...c,
        semester: semName,
        uid: uid,
        displayName: `${c.title} (${c.code}): ${c.grade} (${c.credits}cr)`
      };
    })).filter(c => GRADE_POINTS[c.grade] !== null);
  }, [semesters]);

  const availableGrades = Object.keys(GRADE_POINTS).filter(g => 
    GRADE_POINTS[g] !== null && GRADE_POINTS[g] !== undefined
  );

  useEffect(() => {
    loadSavedProjection();
    if (semesters && semesters.length > 0) {
      // Summary header always uses standard CGPA rules (F = 0)
      const result = GPACalculator.calculateCumulativeGPA(semesters);
      setGPAResult(result);
    }
  }, [semesters]);

  const loadSavedProjection = async () => {
    try {
      const saved = await StorageManager.getProjectedGrades();
      if (saved && Array.isArray(saved)) setProjectedCourses(saved);
    } catch (err) { console.error(err); }
  };

  const handleAddCourse = () => {
    if (newCourse.isSwap && !newCourse.targetCourseUid) return;
    if (!newCourse.isSwap && !newCourse.credits) return;
    
    let swapDetails = null;
    if (newCourse.isSwap && newCourse.targetCourseUid) {
      swapDetails = historicalCoursesList.find(c => c.uid === newCourse.targetCourseUid);
    }

    const course = {
      code: `PROJ-${Date.now()}`,
      title: newCourse.isSwap && swapDetails 
        ? `Swapping ${swapDetails.code}` 
        : (newCourse.title || `Future Course`),
      credits: newCourse.isSwap && swapDetails ? swapDetails.credits : parseFloat(newCourse.credits),
      grade: newCourse.expectedGrade,
      isSwap: newCourse.isSwap,
      targetCourseUid: newCourse.isSwap ? newCourse.targetCourseUid : null,
      regType: 'Projected',
    };

    const updated = [...projectedCourses, course];
    setProjectedCourses(updated);
    StorageManager.saveProjectedGrades(updated);
    setNewCourse({ ...newCourse, title: '', credits: '', targetCourseUid: '' });
  };

  const handleRemoveCourse = (index) => {
    const updated = projectedCourses.filter((_, i) => i !== index);
    setProjectedCourses(updated);
    StorageManager.saveProjectedGrades(updated);
    if (updated.length === 0) setProjectedResult(null);
  };

  const handleCalculate = () => {
    if (projectedCourses.length === 0) return;
    // Prepare data: ensure historical courses carry the 'semester' property for UID matching
    const currentPool = (semesters || []).flatMap(s => {
      const semName = s.name || s.semesterName || 'HIST';
      return (s.courses || []).map(c => ({ ...c, semester: semName }));
    });
    // This triggers the projection engine: uses the isProjected logic (F/FR/FS = null)
    const result = GPACalculator.projectGPA(currentPool, projectedCourses);
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
    <div className="space-y-3 animate-fade-in p-1">
      {/* 1. Statistics Summary Header */}
      {currentGPA && (
        <div className="card p-3 bg-white border border-gray-100 shadow-sm rounded-xl flex justify-around items-center">
          <div className="text-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Current CGPA</p>
            <p className="text-lg font-black text-purple-600">{currentGPA.gpa.toFixed(2)}</p>
          </div>
          <div className="h-8 w-px bg-gray-100"></div>
          <div className="text-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Credits Done</p>
            <p className="text-lg font-black text-gray-800">{currentGPA.earnedCredits}</p>
          </div>
        </div>
      )}

      {/* 2. Mode Selector & Input Form */}
      <div className="card p-3 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="space-y-3">
          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button onClick={() => setNewCourse({ ...newCourse, isSwap: false })} className={`flex-1 py-1.5 text-[10px] font-black rounded-md transition-all ${!newCourse.isSwap ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'}`}>FUTURE</button>
            <button onClick={() => setNewCourse({ ...newCourse, isSwap: true })} className={`flex-1 py-1.5 text-[10px] font-black rounded-md transition-all ${newCourse.isSwap ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'}`}>SWAP</button>
          </div>

          <div className="space-y-2">
            {newCourse.isSwap ? (
              <select value={newCourse.targetCourseUid} onChange={(e) => setNewCourse({ ...newCourse, targetCourseUid: e.target.value })} className="input-field w-full text-xs py-2 bg-amber-50 border-amber-200 rounded-lg font-bold outline-none">
                <option value="">Choose course to replace...</option>
                {historicalCoursesList.map(c => <option key={c.uid} value={c.uid}>{c.displayName}</option>)}
              </select>
            ) : (
              <input type="text" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} placeholder="Course title" className="input-field w-full text-xs py-2 bg-gray-50 border border-gray-200 rounded-lg px-3 outline-none" />
            )}
            <div className="flex gap-2">
              {!newCourse.isSwap && <input type="number" step="0.5" value={newCourse.credits} onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })} placeholder="Credits" className="input-field flex-1 text-xs py-2 bg-gray-50 border border-gray-200 rounded-lg px-3 outline-none" />}
              <select value={newCourse.expectedGrade} onChange={(e) => setNewCourse({ ...newCourse, expectedGrade: e.target.value })} className="input-field flex-1 text-xs py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none">
                {availableGrades.map(grade => <option key={grade} value={grade}>{grade} ({GRADE_POINTS[grade]})</option>)}
              </select>
            </div>
            <button onClick={handleAddCourse} disabled={newCourse.isSwap ? !newCourse.targetCourseUid : !newCourse.credits} className="w-full btn-primary py-2 text-xs font-bold disabled:opacity-50">Add to List</button>
          </div>
        </div>
      </div>

      {/* 3. Added Courses List */}
      {projectedCourses.length > 0 && (
        <div className="card p-3">
          <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
            {projectedCourses.map((course, index) => (
              <div key={index} className={`flex items-center gap-2 p-2 rounded-lg border ${course.isSwap ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${getGradeColor(course.grade)}`}>{course.grade}</span>
                    <span className="text-[10px] font-bold text-gray-600">{course.credits}cr</span>
                    {course.isSwap && <span className="bg-amber-200 text-amber-800 text-[8px] px-1 rounded font-black tracking-tight uppercase">Swap</span>}
                  </div>
                  <p className="text-[9px] text-gray-500 truncate">{course.title}</p>
                </div>
                <button onClick={() => handleRemoveCourse(index)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={handleCalculate} className="w-full btn-success mt-3 py-2 text-xs font-bold shadow-sm">Calculate Projected CGPA</button>
        </div>
      )}

      {/* 4. Results Card */}
      {projectedResult && currentGPA && (
        <div className="card p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg rounded-2xl animate-in zoom-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg ring-4 ring-white">
                <div className="text-center text-white font-black"><div className="text-lg leading-tight">{projectedResult.gpa.toFixed(2)}</div><div className="text-[7px]">CGPA</div></div>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Outcome</p>
                <p className={`text-sm font-black flex items-center gap-1 ${projectedResult.gpa >= currentGPA.gpa ? 'text-green-700' : 'text-red-700'}`}>
                  {projectedResult.gpa >= currentGPA.gpa ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {projectedResult.gpa >= currentGPA.gpa ? '+' : ''}{(projectedResult.gpa - currentGPA.gpa).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
             <div className="bg-white rounded-xl p-2 text-center border border-green-100 shadow-sm backdrop-blur-sm">
                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">Final Credits Earned</p>
                <p className="text-xs font-black text-gray-800">{projectedResult.earnedCredits}</p>
             </div>
             <div className="bg-white rounded-xl p-2 text-center border border-green-100 shadow-sm backdrop-blur-sm">
                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">Total Swaps</p>
                <p className="text-xs font-black text-amber-600">{projectedResult.swappedOut?.length || 0}</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}