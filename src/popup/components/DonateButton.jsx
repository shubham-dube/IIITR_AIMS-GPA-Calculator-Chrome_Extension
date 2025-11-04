import React, { useState } from 'react';
import { Heart, Coffee, X, Copy, Check, ExternalLink } from 'lucide-react';

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
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(recipientName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Support GPA Calculator Extension')}`;
    window.open(upiUrl, '_blank');
  };

  const donationAmounts = [
    { amount: 20, label: '☕ Coffee', description: 'Buy me a coffee' },
    { amount: 50, label: '🍕 Pizza', description: 'Buy me a pizza slice' },
    { amount: 100, label: '🍔 Burger', description: 'Buy me a burger' },
    { amount: 0, label: '💝 Custom', description: 'Choose your amount' }
  ];

  return (
    <>
      {/* Floating Donate Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 group"
        title="Support the developer"
      >
        <Heart size={20} className="group-hover:animate-pulse" fill="currentColor" />
      </button>

      {/* Donation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 rounded-t-2xl relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all"
              >
                <X size={20} />
              </button>
              <div className="text-center text-white">
                <Coffee size={48} className="mx-auto mb-3" />
                <h2 className="text-2xl font-bold mb-2">Support My Work</h2>
                <p className="text-pink-100 text-sm">
                  Help keep this extension free and updated! ☕
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Quick Donation Amounts */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Quick Donation
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {donationAmounts.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => item.amount > 0 && handleUPIPayment(item.amount)}
                      className="bg-gradient-to-br from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 border-2 border-pink-200 hover:border-pink-300 rounded-xl p-4 transition-all transform hover:scale-105 text-left group"
                    >
                      <div className="text-2xl mb-1">{item.label}</div>
                      <div className="text-xs text-gray-600">{item.description}</div>
                      {item.amount > 0 && (
                        <div className="text-lg font-bold text-pink-600 mt-1">
                          ₹{item.amount}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* UPI Details */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    UPI
                  </span>
                  Pay with UPI
                </h3>
                
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">UPI ID</div>
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono font-semibold text-gray-800">
                        {upiId}
                      </code>
                      <button
                        onClick={handleCopyUPI}
                        className="ml-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copy UPI ID"
                      >
                        {copied ? (
                          <Check size={16} className="text-green-600" />
                        ) : (
                          <Copy size={16} className="text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Name</div>
                    <div className="text-sm font-semibold text-gray-800">
                      {recipientName}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <span className="text-blue-600">💡</span>
                  <p>
                    You can use any UPI app (GPay, PhonePe, Paytm, etc.) to scan or pay using the UPI ID above.
                  </p>
                </div>
              </div>

              {/* Thank You Message */}
              <div className="text-center bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
                <p className="text-sm text-gray-700 font-medium mb-1">
                  💖 Thank you for your support!
                </p>
                <p className="text-xs text-gray-600">
                  Every contribution helps me maintain and improve this extension.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
