import React, { useState, useEffect } from 'react';
import { Calculator, BarChart3, Target, Settings, FileText } from 'lucide-react';
import Header from './components/Header';
import SemesterSelector from './components/SemesterSelector';
import GPACard from './components/GPACard';
import Analytics from './components/Analytics';
import ProjectedGPA from './components/ProjectedGPA';
import SavedCalculations from './components/SavedCalculations';
import SettingsPanel from './components/SettingsPanel';
import { useSemesters } from './hooks/useSemesters';
import { useGPACalculator } from './hooks/useGPACalculator';

export default function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [showSettings, setShowSettings] = useState(false);
  
  const { 
    semesters, 
    loading, 
    error, 
    studentInfo,
    fetchData,
    isOnAIMS 
  } = useSemesters();
  
  const {
    selectedSemesters,
    setSelectedSemesters,
    gpaResult,
    calculateGPA,
    saveCalculation,
    savedCalculations,
  } = useGPACalculator(semesters);

  useEffect(() => {
    if (isOnAIMS) {
      fetchData();
    }
  }, [isOnAIMS]);

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'projected', label: 'Projected', icon: Target },
    { id: 'saved', label: 'Saved', icon: FileText },
  ];

  if (!isOnAIMS) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
        <Header studentInfo={null} onSettingsClick={() => setShowSettings(true)} />
        <div className="p-6">
          <div className="card text-center py-8">
            <div className="mb-4">
              <FileText size={48} className="mx-auto text-primary-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Open AIMS Portal
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Please navigate to your Course History page on AIMS Portal
              </p>
              <a
                href="https://aims.iiitr.ac.in/iiitraichur/courseReg/myCrsHistoryPage"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block"
              >
                Open Course History
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      <Header 
        studentInfo={studentInfo} 
        onSettingsClick={() => setShowSettings(true)} 
      />
      
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex gap-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${
                  activeTab === tab.id ? 'tab-active' : 'tab-inactive'
                }`}
              >
                <Icon size={16} className="inline mr-1.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 pb-6 overflow-y-auto" style={{ maxHeight: '550px' }}>
        {loading && (
          <div className="space-y-3">
            <div className="skeleton h-20 rounded-lg"></div>
            <div className="skeleton h-32 rounded-lg"></div>
            <div className="skeleton h-24 rounded-lg"></div>
          </div>
        )}

        {error && (
          <div className="card bg-danger-50 border-danger-200 text-danger-800">
            <p className="text-sm">{error}</p>
            <button 
              onClick={fetchData}
              className="mt-2 text-danger-700 underline text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'calculator' && (
              <div className="space-y-4 animate-fade-in">
                <SemesterSelector
                  semesters={semesters}
                  selectedSemesters={selectedSemesters}
                  onSelectionChange={setSelectedSemesters}
                  onCalculate={calculateGPA}
                />
                
                {gpaResult && (
                  <GPACard 
                    result={gpaResult} 
                    onSave={saveCalculation}
                    onViewTranscript={() => {
                      chrome.runtime.sendMessage({
                        type: 'OPEN_TRANSCRIPT',
                        data: {
                          semesters: selectedSemesters,
                          result: gpaResult,
                          student: studentInfo,
                        },
                      });
                    }}
                  />
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <Analytics semesters={semesters} />
            )}

            {activeTab === 'projected' && (
              <ProjectedGPA 
                semesters={semesters}
                currentGPA={gpaResult}
              />
            )}

            {activeTab === 'saved' && (
              <SavedCalculations 
                calculations={savedCalculations}
                onLoad={(calc) => {
                  setSelectedSemesters(calc.semesters);
                  calculateGPA(calc.semesters);
                  setActiveTab('calculator');
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}