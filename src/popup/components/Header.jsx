import React from 'react';

export default function Header({ studentInfo, onSettingsClick }) {
  return (
    <header className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white shadow-2xl overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="relative px-4 py-2.5">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2.5">
            {/* Glassmorphic logo container */}
            <div className="relative p-1.5 bg-white/30 backdrop-blur-md rounded-xl border border-white/40 shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
              <img 
                src={chrome.runtime.getURL('icons/icon16.png')} 
                alt="GPA Genie" 
                className="w-7 h-7 relative z-10 drop-shadow-md" 
              />
            </div>
            
            {/* Brand name with custom font */}
            <div className="flex flex-col -space-y-1">
              <h1 className="text-xl font-black tracking-tight leading-none mb-2" 
                  style={{ fontFamily: "'Poppins', 'Inter', sans-serif", letterSpacing: '-0.02em' }}>
                GPA <span className="bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-100 bg-clip-text text-transparent drop-shadow-sm">Genie</span>
              </h1>
              <p className="text-[10px] font-medium text-purple-100/90 tracking-wide uppercase" 
                 style={{ fontFamily: "'Roboto', sans-serif", letterSpacing: '0.08em' }}>
                CGPA Calculator
              </p>
            </div>
          </div>
          
          {/* Optional: Compact action button */}
          {/* {onSettingsClick && (
            <button
              onClick={onSettingsClick}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Settings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )} */}
        </div>
      </div>
      
      {/* Bottom gradient accent */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </header>
  );
}
