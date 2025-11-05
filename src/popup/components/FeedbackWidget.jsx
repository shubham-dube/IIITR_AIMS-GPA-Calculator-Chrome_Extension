import React, { useState } from 'react';
import { MessageCircle, X, Mail, Phone, Github, Linkedin, ExternalLink, Copy, Check } from 'lucide-react';

export default function FeedbackWidget() {
  const [showModal, setShowModal] = useState(false);
  const [copiedItem, setCopiedItem] = useState(null);

  const contactInfo = {
    email: 'itzshubhamofficial@gmail.com',
    phone: '+91 7687877772',
    github: 'https://github.com/shubham-dube',
    linkedin: 'https://linkedin.com/in/shubhamdubey772',
    portfolio: 'https://shubhamdube.in'
  };

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(type);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-3 left-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        title="Feedback & Contact"
      >
        <MessageCircle size={16} className="group-hover:rotate-12 transition-transform" />
      </button>

      {/* Feedback Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-t-xl relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all"
              >
                <X size={16} />
              </button>
              <div className="text-center text-white">
                <MessageCircle size={24} className="mx-auto mb-1" />
                <h2 className="text-base font-bold">Get in Touch</h2>
                <p className="text-blue-100 text-[10px] mt-0.5">
                  Feedback, suggestions, or just say hi!
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
              {/* Email */}
              <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Mail size={14} className="text-blue-600" />
                    <span className="text-xs font-semibold text-gray-700">Email</span>
                  </div>
                  <button
                    onClick={() => handleCopy(contactInfo.email, 'email')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Copy email"
                  >
                    {copiedItem === 'email' ? (
                      <Check size={12} className="text-green-600" />
                    ) : (
                      <Copy size={12} className="text-gray-600" />
                    )}
                  </button>
                </div>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-xs text-blue-600 hover:text-blue-700 break-all"
                >
                  {contactInfo.email}
                </a>
              </div>

              {/* Phone */}
              <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Phone size={14} className="text-green-600" />
                    <span className="text-xs font-semibold text-gray-700">Phone</span>
                  </div>
                  <button
                    onClick={() => handleCopy(contactInfo.phone, 'phone')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Copy phone"
                  >
                    {copiedItem === 'phone' ? (
                      <Check size={12} className="text-green-600" />
                    ) : (
                      <Copy size={12} className="text-gray-600" />
                    )}
                  </button>
                </div>
                <a 
                  href={`tel:${contactInfo.phone}`}
                  className="text-xs text-green-600 hover:text-green-700"
                >
                  {contactInfo.phone}
                </a>
              </div>

              {/* Social Links */}
              <div className="space-y-1.5">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">
                  Connect
                </p>
                
                {/* GitHub */}
                <a
                  href={contactInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <Github size={14} className="text-gray-700" />
                    <span className="text-xs font-medium text-gray-700">GitHub</span>
                  </div>
                  <ExternalLink size={12} className="text-gray-400 group-hover:text-gray-600" />
                </a>

                {/* LinkedIn */}
                <a
                  href={contactInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <Linkedin size={14} className="text-blue-600" />
                    <span className="text-xs font-medium text-gray-700">LinkedIn</span>
                  </div>
                  <ExternalLink size={12} className="text-gray-400 group-hover:text-gray-600" />
                </a>

                {/* Portfolio */}
                <a
                  href={contactInfo.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-lg border border-purple-200 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🌐</span>
                    <span className="text-xs font-medium text-gray-700">Portfolio</span>
                  </div>
                  <ExternalLink size={12} className="text-purple-400 group-hover:text-purple-600" />
                </a>
              </div>

              {/* Developer Info */}
              <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 border border-blue-100">
                <p className="text-xs font-semibold text-gray-800 mb-0.5">
                  Shubham Dubey
                </p>
                <p className="text-[10px] text-gray-600">
                  Software Engineer • CS Student @ IIIT Raichur
                </p>
              </div>

              {/* Message Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                <p className="text-[10px] text-amber-800 text-center">
                  💡 Found a bug or have a feature request? Drop me a message!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}