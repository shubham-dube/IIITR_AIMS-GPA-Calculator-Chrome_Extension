import React, { useState, useEffect } from 'react';
import { Calculator, BarChart3, Target, Settings, FileText, MousePointerClick } from 'lucide-react';
import Header from './components/Header';
import SemesterSelector from './components/SemesterSelector';
import GPACard from './components/GPACard';
import Analytics from './components/Analytics';
import ProjectedGPA from './components/ProjectedGPA';
import SavedCalculations from './components/SavedCalculations';
import SettingsPanel from './components/SettingsPanel';
import { useSemesters } from './hooks/useSemesters';
import { useGPACalculator } from './hooks/useGPACalculator';
import DonateButton from './components/DonateButton';
import FeedbackWidget from './components/FeedbackWidget';
import InfoBanner from './components/InfoBanner';

export default function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [showSettings, setShowSettings] = useState(false);
  const [pageSelectedCourses, setPageSelectedCourses] = useState([]);

  const {
    semesters,
    loading,
    error,
    studentInfo,
    fetchData,
    isOnAIMS
  } = useSemesters();

  const {
    selectedCourses,
    setSelectedCourses,
    gpaResult,
    calculateGPA,
    saveCalculation,
    savedCalculations,
    deleteCalculation,
  } = useGPACalculator(semesters);

  useEffect(() => {
    if (isOnAIMS) {
      fetchData();

      // Listen for selection changes from content script
      chrome.runtime.onMessage.addListener((request) => {
        if (request.type === 'SELECTION_CHANGED') {
          setPageSelectedCourses(request.courses);
        }
      });

      // Get initial selection
      getPageSelection();
    }
  }, [isOnAIMS]);

  const getPageSelection = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'GET_SELECTED_COURSES',
      });
      if (response?.courses) {
        calculateGPA(response?.courses, true);
        setPageSelectedCourses(response.courses);
        setActiveTab('calculator');
      }
    } catch (error) {
      console.error('Error getting page selection:', error);
    }
  };

  const calculateFromPageSelection = () => {
    if (pageSelectedCourses.length === 0) return;

    const result = calculateGPA(pageSelectedCourses, true);
    setActiveTab('calculator');
  };

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'projected', label: 'Projected', icon: Target },
    { id: 'saved', label: 'Saved', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      <Header
        studentInfo={studentInfo}
        onSettingsClick={() => setShowSettings(true)}
      />

      {/* Page Selection Quick Action */}
      {pageSelectedCourses.length > 0 && (
        <div className="bg-purple-50 border-b border-purple-200 px-3 py-2">
          <button
            onClick={calculateFromPageSelection}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-800"
          >
            <MousePointerClick size={16} />
            Calculate from Page Selection ({pageSelectedCourses.length} courses)
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-2 py-1.5">
        <div className="flex gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-lg transition-all ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 pb-4 overflow-y-auto" style={{ maxHeight: '550px' }}>
        {loading && (
          <div className="space-y-2">
            <div className="skeleton h-16 rounded-lg"></div>
            <div className="skeleton h-24 rounded-lg"></div>
          </div>
        )}

        {error && (
          <div className="card bg-danger-50 border-danger-200 text-danger-800 py-3 px-3">
            <p className="text-xs">{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 text-danger-700 underline text-xs font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'calculator' && (
              <div className="space-y-3 animate-fade-in">
                <InfoBanner />
                {gpaResult && (
                  <GPACard
                    result={gpaResult}
                    onSave={saveCalculation}
                    studentInfo={studentInfo}
                    selectedSemesters={semesters.filter(s =>
                      selectedCourses.some(c => c.semesterId === s.id)
                    )}
                  />
                )}
                {!isOnAIMS ? (
                  <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
                    <div className="p-4">
                      <div className="card text-center py-6">
                        <FileText size={40} className="mx-auto text-primary-400 mb-3" />
                        <h3 className="text-base font-semibold text-gray-800 mb-2">
                          Open AIMS Portal
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">
                          Navigate to Course History page
                        </p>
                        <a
                          href="https://aims.iiitr.ac.in/iiitraichur/courseReg/myCrsHistoryPage"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary text-sm inline-block p-2 px-4"
                        >
                          Open Course History (AIMS IIIT Raichur)
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <SemesterSelector
                    semesters={semesters}
                    selectedCourses={selectedCourses}
                    onSelectionChange={setSelectedCourses}
                    onCalculate={(courses) => calculateGPA(courses, false)}
                  />
                )}

              </div>
            )}

            {activeTab === 'analytics' && (
              <Analytics semesters={semesters} />
            )}

            {activeTab === 'projected' && (
              <ProjectedGPA semesters={semesters} />
            )}

            {activeTab === 'saved' && (
              <SavedCalculations
                calculations={savedCalculations}
                onLoad={(calc) => {
                  setSelectedCourses(calc.courses);
                  calculateGPA(calc.courses, false);
                  setActiveTab('calculator');
                }}
                onDelete={deleteCalculation}
              />
            )}
          </>
        )}
      </div>

      <DonateButton />
      <FeedbackWidget />

      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}