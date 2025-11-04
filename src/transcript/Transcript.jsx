import React, { useState, useEffect } from 'react';
import { Download, Printer, FileText, Loader } from 'lucide-react';
import OfficialTemplate from './templates/OfficialTemplate';
import MinimalTemplate from './templates/MinimalTemplate';

export default function Transcript() {
  const [data, setData] = useState(null);
  const [template, setTemplate] = useState('official');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Transcript component mounted');
    
    // Listen for data from background
    const messageListener = (request, sender, sendResponse) => {
      console.log('Transcript received message:', request.type);
      if (request.type === 'TRANSCRIPT_DATA') {
        console.log('Received transcript data:', request.data);
        setData(request.data);
        setLoading(false);
        sendResponse({ success: true });
      }
    };
    
    chrome.runtime.onMessage.addListener(messageListener);

    // Request data from background
    setTimeout(() => {
      console.log('Requesting transcript data');
      chrome.runtime.sendMessage({ type: 'GET_TRANSCRIPT_DATA' }, (response) => {
        if (response && response.data) {
          console.log('Got transcript data from background:', response.data);
          setData(response.data);
          setLoading(false);
        } else {
          console.log('No data received, waiting for message...');
          setTimeout(() => {
            if (!data) {
              setLoading(false);
            }
          }, 3000);
        }
      });
    }, 100);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading transcript...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">No transcript data available</p>
          <p className="text-sm text-gray-500">Please calculate GPA first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Controls */}
      <div className="max-w-5xl mx-auto mb-6 no-print px-4">
        <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Template:</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="official">Official</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Printer size={18} />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
            >
              <Download size={18} />
              Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* Transcript Content */}
      <div className="max-w-5xl mx-auto px-4">
        {template === 'official' && <OfficialTemplate data={data} />}
        {template === 'minimal' && <MinimalTemplate data={data} />}
      </div>
    </div>
  );
}