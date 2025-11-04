import React from 'react';
import { GraduationCap, Settings, User } from 'lucide-react';

export default function Header({ studentInfo, onSettingsClick }) {
  return (
    <header className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white shadow-lg">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <GraduationCap size={28} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">GPA Genie</h1>
              <p className="text-xs text-primary-100">CGPA Calculator</p>
            </div>
          </div>
          
          <button
            onClick={onSettingsClick}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* {studentInfo && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <User size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{studentInfo.name}</p>
                <p className="text-xs text-primary-100">{studentInfo.rollNo} • {studentInfo.branch}</p>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </header>
  );
}