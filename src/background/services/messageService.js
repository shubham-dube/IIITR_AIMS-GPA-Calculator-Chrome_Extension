import { MESSAGE_TYPES } from '@shared/constants/messages';

export class MessageService {
  
  static sendToPopup(message) {
    return chrome.runtime.sendMessage(message);
  }

  static sendToContent(tabId, message) {
    return chrome.tabs.sendMessage(tabId, message);
  }

  static broadcastToAllTabs(message) {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, message).catch(() => {
          // Tab might not have content script
        });
      });
    });
  }

  static createResponse(type, data, error = null) {
    return {
      type,
      data,
      error,
      timestamp: new Date().toISOString(),
    };
  }
}