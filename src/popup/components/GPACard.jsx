import React, { useState } from 'react';
import { Award, TrendingUp, BookOpen, Download, Save, FileText } from 'lucide-react';

export default function GPACard({ result, onSave, onViewTranscript }) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(result);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getGPAColor = (gpa) => {
    if (gpa >= 9) return 'text-green-600';
    if (gpa >= 8) return 'text-blue-600';
    if (gpa >= 7) return 'text-yellow-600';
    if (gpa >= 6) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGPAGrade = (gpa) => {
    if (gpa >= 9.5) return 'Outstanding';
    if (gpa >= 9) return 'Excellent';
    if (gpa >= 8) return 'Very Good';
    if (gpa >= 7) return 'Good';
    if (gpa >= 6) return 'Average';
    return 'Below Average';
  };

  return (
    <div className="card bg-gradient-to-br from-white to-primary-50 border-2 border-primary-200 animate-scale-in">
      {/* Main GPA Display */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full shadow-lg mb-3">
          <div className="text-center">
            <div className={`text-3xl font-bold text-white`}>
              {result.gpa.toFixed(2)}
            </div>
            <div className="text-xs text-primary-100">CGPA</div>
          </div>
        </div>
        <p className="text-sm font-medium text-gray-600">{getGPAGrade(result.gpa)}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={16} className="text-primary-600" />
            <span className="text-xs text-gray-600">Total Credits</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{result.totalCredits}</p>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Award size={16} className="text-success-600" />
            <span className="text-xs text-gray-600">Earned</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{result.earnedCredits}</p>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-blue-600" />
            <span className="text-xs text-gray-600">Grade Points</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{result.gradePoints}</p>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={16} className="text-purple-600" />
            <span className="text-xs text-gray-600">Courses</span>
          </div>
          <p className="text-lg font-bold text-gray-800">{result.courseCount}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className={`flex-1 btn-secondary ${saved ? 'bg-success-100 text-success-700' : ''}`}
          disabled={saved}
        >
          <Save size={16} className="inline mr-1.5" />
          {saved ? 'Saved!' : 'Save'}
        </button>
        <button
          onClick={onViewTranscript}
          className="flex-1 btn-primary"
        >
          <Download size={16} className="inline mr-1.5" />
          Transcript
        </button>
      </div>
    </div>
  );
}