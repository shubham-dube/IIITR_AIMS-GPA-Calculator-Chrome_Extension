import React, { useState, useEffect } from 'react';
import { X, Settings, Save, Info } from 'lucide-react';

export default function SettingsPanel({ onClose }) {
  const [settings, setSettings] = useState({
    showDecimalPlaces: 2,
    includeBacklogs: true,
    defaultView: 'calculator',
    theme: 'light',
  });

  useEffect(() => {
    // Load settings from storage
    chrome.storage.local.get('userSettings', (result) => {
      if (result.userSettings) {
        setSettings(result.userSettings);
      }
    });
  }, []);

  const handleSave = () => {
    chrome.storage.local.set({ userSettings: settings }, () => {
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {/* Decimal Places */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GPA Decimal Places
            </label>
            <select
              value={settings.showDecimalPlaces}
              onChange={(e) => setSettings({ ...settings, showDecimalPlaces: parseInt(e.target.value) })}
              className="input-field"
            >
              <option value={1}>1 (e.g., 8.5)</option>
              <option value={2}>2 (e.g., 8.56)</option>
              <option value={3}>3 (e.g., 8.567)</option>
            </select>
          </div>

          {/* Include Backlogs */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.includeBacklogs}
                onChange={(e) => setSettings({ ...settings, includeBacklogs: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Include Backlog Semesters
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              Show semesters with only backlog courses
            </p>
          </div>

          {/* Default View */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default View
            </label>
            <select
              value={settings.defaultView}
              onChange={(e) => setSettings({ ...settings, defaultView: e.target.value })}
              className="input-field"
            >
              <option value="calculator">Calculator</option>
              <option value="analytics">Analytics</option>
              <option value="projected">Projected GPA</option>
              <option value="saved">Saved Calculations</option>
            </select>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">About GPA Calculation</p>
                <p>
                  GPA Genie follows your institution's rules for duplicate courses, 
                  backlog clearance, and grade point calculation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-gray-200">
          <button onClick={onClose} className="flex-1 btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 btn-primary">
            <Save size={16} className="inline mr-1.5" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}