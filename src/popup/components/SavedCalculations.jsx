import React from 'react';
import { FileText, Trash2, Calendar, Award, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function SavedCalculations({ calculations, onLoad, onDelete }) {
  if (!calculations || calculations.length === 0) {
    return (
      <div className="card text-center py-8 animate-fade-in">
        <FileText size={48} className="mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No Saved Calculations
        </h3>
        <p className="text-sm text-gray-600">
          Your saved GPA calculations will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {calculations.map((calc, index) => (
        <div
          key={calc.id || index}
          className="card hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onLoad(calc)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full">
                  <span className="text-white font-bold text-lg">
                    {calc.result.gpa.toFixed(1)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">CGPA Calculation</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    {format(new Date(calc.timestamp), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Award size={14} />
                  <span>{calc.result.totalCredits} credits</span>
                </div>
                <div>
                  {calc.semesters.length} semesters
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(calc.id);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              <ExternalLink size={14} />
              Load Calculation
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}