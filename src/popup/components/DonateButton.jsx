import React, { useState } from 'react';
import { Heart, X, Copy, Check } from 'lucide-react';

export default function DonateButton() {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const upiId = '7687877772@ptaxis';
  const recipientName = 'Shubham Dubey';

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleUPIPayment = (amount) => {
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(recipientName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Support GPA Calculator')}`;
    window.open(upiUrl, '_blank');
  };

  return (
    <>
      {/* Compact Floating Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-3 right-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        title="Support the developer ❤️"
      >
        <Heart size={16} className="group-hover:animate-pulse" fill="currentColor" />
      </button>

      {/* Compact Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs">
            {/* Compact Header */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-t-xl relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all"
              >
                <X size={16} />
              </button>
              <div className="text-center text-white">
                <Heart size={24} className="mx-auto mb-1" fill="currentColor" />
                <h2 className="text-base font-bold">Support My Work</h2>
                <p className="text-pink-100 text-[10px] mt-0.5">
                  Keep this extension free ☕
                </p>
              </div>
            </div>

            {/* Compact Content */}
            <div className="p-3 space-y-3">
              {/* QR Code Section */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-3 border border-pink-200">
                <div className="flex items-center gap-3">
                  {/* QR Code */}
                  <div className="flex-shrink-0 bg-white rounded-lg p-2 border-2 border-pink-300">
                    <img 
                      src={chrome.runtime.getURL('icons/qr-code.jpg')}
                      alt="UPI QR Code"
                      className="w-24 h-24"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="w-24 h-24 bg-gray-100 rounded items-center justify-center text-xs text-gray-500 text-center p-2"
                      style={{ display: 'none' }}
                    >
                      QR Code<br/>Not Found
                    </div>
                  </div>
                  
                  {/* Instructions */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 mb-1">
                      Scan with any UPI app
                    </p>
                    <p className="text-[10px] text-gray-600 leading-relaxed">
                      GPay, PhonePe, Paytm, or any UPI app
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div>
                <p className="text-[10px] text-gray-600 mb-2 text-center">Or buy me a</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { amount: 20, label: '☕ Coffee', emoji: '☕' },
                    { amount: 50, label: '🍕 Pizza', emoji: '🍕' },
                    { amount: 100, label: '🍔 Burger', emoji: '🍔' }
                  ].map((item) => (
                    <button
                      key={item.amount}
                      onClick={() => handleUPIPayment(item.amount)}
                      className="bg-white hover:bg-pink-50 border border-pink-200 hover:border-pink-300 rounded-lg py-2 px-2 transition-all transform hover:scale-105 active:scale-95"
                    >
                      <div className="text-lg leading-none mb-0.5">{item.emoji}</div>
                      <div className="text-[10px] font-semibold text-pink-600">₹{item.amount}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* UPI ID */}
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-[10px] text-gray-500 mb-1">UPI ID</div>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs font-mono font-semibold text-gray-800 truncate">
                    {upiId}
                  </code>
                  <button
                    onClick={handleCopyUPI}
                    className="flex-shrink-0 p-1.5 hover:bg-gray-200 rounded transition-colors"
                    title="Copy UPI ID"
                  >
                    {copied ? (
                      <Check size={14} className="text-green-600" />
                    ) : (
                      <Copy size={14} className="text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Thank You */}
              <div className="text-center bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-2 border border-pink-100">
                <p className="text-xs text-gray-700 font-medium">
                  💖 Thank you for your support!
                </p>
              </div>

              {/* Developer Info */}
              <div className="text-center text-[10px] text-gray-500">
                Made with ❤️ by {recipientName}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}