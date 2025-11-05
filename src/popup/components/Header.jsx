import React from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

export default function Header({ studentInfo, onSettingsClick }) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-3 py-2.5">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2.5">
            {/* Clean logo container */}
            <div className="relative p-1.5 bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg border border-primary-200">
              {/* <GraduationCap size={20} className="text-primary-600" strokeWidth={2.5} /> */}
              <img 
                src={chrome.runtime.getURL('icons/icon16.png')} 
                alt="GPA Genie" 
                className="w-7 h-7 relative z-10 drop-shadow-md" 
              />
            </div>
            
            {/* Brand name */}
            <div className="flex flex-col -space-y-0.5">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-gray-900 tracking-tight">
                  GPA Genie
                </h1>
                <Sparkles size={12} className="text-primary-500" fill="currentColor" />
              </div>
              <p className="text-[9px] font-medium text-gray-500 tracking-wide uppercase">
                CGPA Calculator
              </p>
            </div>
          </div>
          
          {/* Student Info Badge (if available) */}
          {studentInfo && (
            <div className="flex items-center gap-1.5 bg-primary-50 px-2 py-1 rounded-md border border-primary-100">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-semibold text-primary-700">
                {studentInfo.rollNo}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}