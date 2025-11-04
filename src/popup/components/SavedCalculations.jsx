import React from 'react';
import { FileText, Trash2, Calendar, Award, Download, ExternalLink, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function SavedCalculations({ calculations, onLoad, onDelete }) {
  const handleDownloadTranscript = (calc) => {
    chrome.runtime.sendMessage({
      type: 'OPEN_TRANSCRIPT',
      data: {
        student: calc.student || {},
        semesters: [], // Will be derived from courses
        result: calc.result,
      },
    });
  };

  if (!calculations || calculations.length === 0) {
    return (
      <div className="card text-center py-8 animate-fade-in">
        <FileText size={36} className="mx-auto text-gray-300 mb-2" />
        <h3 className="text-sm font-semibold text-gray-800 mb-1">
          No Saved Calculations
        </h3>
        <p className="text-xs text-gray-600">
          Calculate and save GPA to see them here
        </p>
      </div>
    );
  }

  const getPerformanceColor = (gpa) => {
    if (gpa >= 9) return 'from-green-500 to-green-600';
    if (gpa >= 8) return 'from-blue-500 to-blue-600';
    if (gpa >= 7) return 'from-yellow-500 to-yellow-600';
    return 'from-orange-500 to-orange-600';
  };

  const getPerformanceText = (gpa) => {
    if (gpa >= 9) return 'Outstanding';
    if (gpa >= 8) return 'Excellent';
    if (gpa >= 7) return 'Good';
    return 'Average';
  };

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-xs font-semibold text-gray-700">
          {calculations.length} Saved Calculation{calculations.length !== 1 ? 's' : ''}
        </span>
      </div>

      {calculations.map((calc, index) => {
        const colorClass = getPerformanceColor(calc.result.gpa);
        const perfText = getPerformanceText(calc.result.gpa);

        return (
          <div
            key={calc.id || index}
            className="card p-2 hover:shadow-lg transition-all duration-200 border-l-4 border-primary-500"
          >
            <div className="flex items-start gap-2 mb-2">
              {/* GPA Badge */}
              <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${colorClass} rounded-lg shadow-sm flex-shrink-0`}>
                <div className="text-center">
                  <div className="text-base font-bold text-white leading-none">
                    {calc.result.gpa.toFixed(1)}
                  </div>
                  <div className="text-[8px] text-white/80">CGPA</div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-xs font-semibold text-gray-800">{perfText}</span>
                  <span className="text-[10px] text-gray-500">•</span>
                  <span className="text-[10px] text-gray-500">
                    {calc.result.courseCount} courses
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                  <Calendar size={10} />
                  {format(new Date(calc.timestamp), 'MMM dd, yyyy HH:mm')}
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px]">
                  <span className="flex items-center gap-0.5 text-gray-600">
                    <Award size={10} />
                    {calc.result.totalCredits} cr
                  </span>
                  <span className="flex items-center gap-0.5 text-gray-600">
                    Earned: {calc.result.earnedCredits}
                  </span>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Delete this calculation?')) {
                    onDelete(calc.id);
                  }
                }}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-1.5 pt-2 border-t border-gray-200">
              <button
                onClick={() => onLoad(calc)}
                className="flex-1 py-1.5 px-2 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded transition-colors flex items-center justify-center gap-1"
              >
                <ExternalLink size={12} />
                Load
              </button>
              <button
                onClick={() => handleDownloadTranscript(calc)}
                className="flex-1 py-1.5 px-2 text-xs font-medium text-success-700 bg-success-50 hover:bg-success-100 rounded transition-colors flex items-center justify-center gap-1"
              >
                <Download size={12} />
                Transcript
              </button>
            </div>
          </div>
        );
      })}

      {/* Info Box */}
      <div className="card p-2 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-2">
          <AlertCircle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-amber-800">
            Saved calculations are stored locally. Loading a calculation will restore your course selection.
          </p>
        </div>
      </div>
    </div>
  );
}