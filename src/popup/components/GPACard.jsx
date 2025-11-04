import React, { useState } from 'react';
import { Save, FileText, CheckCircle } from 'lucide-react';

export default function GPACard({ result, onSave, studentInfo, selectedCourses }) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(result);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTranscript = () => {
    // Enhance courses with semester information
    const enhancedCourses = (result?.courses || selectedCourses || []).map(course => ({
      ...course,
      semesterId: course.semesterId || 'Unknown',
      semesterName: course.semesterName || course.semesterId || 'All Courses'
    }));

    chrome.runtime.sendMessage({
      type: 'OPEN_TRANSCRIPT',
      data: {
        student: studentInfo,
        result: {
          ...result,
          courses: enhancedCourses
        },
      },
    });
  };

  const getPerformance = (gpa) => {
    if (gpa >= 9) return { text: 'Outstanding', color: 'text-green-600', bg: 'bg-green-50' };
    if (gpa >= 8) return { text: 'Excellent', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (gpa >= 7) return { text: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (gpa >= 6) return { text: 'Average', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: 'Below Average', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const perf = getPerformance(result.gpa);

  return (
    <div className={`card ${perf.bg} border-2 animate-scale-in p-3`}>
      {/* Main GPA - Compact */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-white leading-none">
                {result.gpa.toFixed(2)}
              </div>
              <div className="text-[10px] text-primary-100">CGPA</div>
            </div>
          </div>
          <div>
            <div className={`text-sm font-bold ${perf.color}`}>{perf.text}</div>
            <div className="text-xs text-gray-600">
              {result.totalCredits} credits • {result.courseCount} courses
            </div>
          </div>
        </div>
        
        {result.earnedCredits < result.totalCredits && (
          <div className="text-right">
            <div className="text-xs text-gray-500">Earned</div>
            <div className="text-sm font-bold text-gray-800">{result.earnedCredits}</div>
          </div>
        )}
      </div>

      {/* Action Buttons - Compact */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            saved 
              ? 'bg-success-100 text-success-700' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          disabled={saved}
        >
          {saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saved ? 'Saved!' : 'Save'}
        </button>
        <button
          onClick={handleTranscript}
          className="flex-1 btn-primary py-2 text-xs flex items-center justify-center gap-1.5"
        >
          <FileText size={14} />
          Transcript
        </button>
      </div>
    </div>
  );
}