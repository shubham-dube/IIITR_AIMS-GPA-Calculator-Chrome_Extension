import React, { useState } from 'react';
import { Info, X, CheckSquare, MousePointer } from 'lucide-react';

export default function InfoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
      <div className="px-3 py-2 flex items-start gap-2">
        <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-700 leading-relaxed">
            <span className="font-semibold">Quick Tip:</span> Select courses 
            <MousePointer size={12} className="inline mx-1 text-blue-600" />
            directly on the AIMS page or use the 
            <CheckSquare size={12} className="inline mx-1 text-blue-600" />
            semester selector below to calculate your CGPA instantly.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}