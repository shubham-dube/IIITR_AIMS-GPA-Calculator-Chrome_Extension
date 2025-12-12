import React, { useState, useEffect } from 'react';
import { Download, Printer, FileText } from 'lucide-react';
import OfficialTemplate from './templates/OfficialTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import OfficialTemplateV2 from './templates/OfficialTemplateV2';

  
export default function Transcript() {
  const [data, setData] = useState(null);
  const [template, setTemplate] = useState('Detailed');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Receive data from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === 'TRANSCRIPT_DATA') {
        setData(request.data);
        setLoading(false);
      }
    });

    // Request data
    chrome.runtime.sendMessage({ type: 'GET_TRANSCRIPT_DATA' });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
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
    <div className="min-h-screen bg-gray-100 py-6">
      {/* Controls */}
      <div className="max-w-4xl mx-auto mb-4 px-4 no-print">
        <div className="bg-white rounded-lg shadow p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Template:</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="Detailed">Detailed</option>
              {/* <option value="Official">Official with Stamp & Signature</option> */}
              <option value="minimal">Minimal</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              <Download size={16} />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Transcript Content */}
      <div id="transcript-content" className="max-w-4xl mx-auto px-4">
        {template === 'Detailed' && <OfficialTemplate data={data} />}
        {template === 'minimal' && <MinimalTemplate data={data} />}
        {template === 'Official' && <OfficialTemplateV2 data={data} />}
      </div>

      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .no-print { display: none !important; }
          #transcript-content { padding: 0; margin: 0; }
        }
      `}</style>
    </div>
  );
}