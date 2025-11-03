export class TabService {
  
  static async openTranscript() {
    try {
      const tab = await chrome.tabs.create({
        url: chrome.runtime.getURL('transcript.html'),
      });
      return tab;
    } catch (error) {
      console.error('Error opening transcript tab:', error);
      throw error;
    }
  }

  static async getCurrentTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
  }

  static async sendMessageToTab(tabId, message) {
    try {
      const response = await chrome.tabs.sendMessage(tabId, message);
      return response;
    } catch (error) {
      console.error('Error sending message to tab:', error);
      throw error;
    }
  }

  static async executeScript(tabId, func) {
    try {
      const result = await chrome.scripting.executeScript({
        target: { tabId },
        function: func,
      });
      return result[0]?.result;
    } catch (error) {
      console.error('Error executing script:', error);
      throw error;
    }
  }
}