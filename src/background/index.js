import { MESSAGE_TYPES } from '@shared/constants/messages';
import { StorageService } from './services/storageService';
import { TabService } from './services/tabService';

let transcriptData = null;

// Extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('GPA Genie installed:', details.reason);
  
  if (details.reason === 'install') {
    // Initialize default settings
    StorageService.initializeSettings();
  }
});

// Message handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request.type);

  switch (request.type) {
    case MESSAGE_TYPES.OPEN_TRANSCRIPT:
      handleOpenTranscript(request.data);
      break;

    case 'GET_TRANSCRIPT_DATA':
      sendResponse({ type: 'TRANSCRIPT_DATA', data: transcriptData });
      break;

    case MESSAGE_TYPES.DATA_FETCHED:
      // Cache the data
      StorageService.saveData(request.data);
      break;

    default:
      console.log('Unknown message type:', request.type);
  }

  return true; // Keep channel open for async responses
});

// Handle transcript opening
async function handleOpenTranscript(data) {
  try {
    // Store transcript data
    transcriptData = {
      student: data.student,
      semesters: data.semesters.filter(sem => data.semesters.includes(sem.id)),
      result: data.result,
      generatedAt: new Date().toISOString(),
    };

    // Open transcript page
    const tab = await TabService.openTranscript();
    
    // Send data once tab is ready
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
      if (tabId === tab.id && changeInfo.status === 'complete') {
        chrome.tabs.sendMessage(tabId, {
          type: 'TRANSCRIPT_DATA',
          data: transcriptData,
        });
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });
  } catch (error) {
    console.error('Error opening transcript:', error);
  }
}

// Context menu (optional - for right-click actions)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'calculate-gpa',
    title: 'Calculate GPA with GPA Genie',
    contexts: ['page'],
    documentUrlPatterns: ['https://aims.iiitr.ac.in/iiitraichur/courseReg/myCrsHistoryPage*'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'calculate-gpa') {
    chrome.action.openPopup();
  }
});

console.log('GPA Genie Background Service Worker Started');