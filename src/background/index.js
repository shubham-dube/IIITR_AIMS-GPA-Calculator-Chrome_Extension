import { MESSAGE_TYPES } from '@shared/constants/messages';
import { StorageService } from './services/storageService';
import { TabService } from './services/tabService';

let transcriptData = null;

chrome.runtime.onInstalled.addListener((details) => {
  console.log('GPA Genie installed:', details.reason);
  
  if (details.reason === 'install') {
    StorageService.initializeSettings();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request.type);

  if (request.type === MESSAGE_TYPES.OPEN_TRANSCRIPT || request.type === 'OPEN_TRANSCRIPT') {
    handleOpenTranscript(request.data);
    sendResponse({ success: true });
  }

  if (request.type === 'GET_TRANSCRIPT_DATA') {
    sendResponse({ type: 'TRANSCRIPT_DATA', data: transcriptData });
  }

  if (request.type === MESSAGE_TYPES.DATA_FETCHED) {
    StorageService.saveData(request.data);
  }

  return true;
});

async function handleOpenTranscript(data) {
  try {
    console.log('Opening transcript with data:', data);
    
    // Enhance courses with semester information
    const enhancedCourses = data.result?.courses?.map(course => ({
      ...course,
      semesterId: course.semesterId || 'Unknown',
      semesterName: course.semesterName || course.semesterId || 'Unknown Semester',
      regType: course.regType || 'Regular'
    })) || [];

    // Store transcript data
    transcriptData = {
      student: data.student,
      result: {
        ...data.result,
        courses: enhancedCourses
      },
      generatedAt: new Date().toISOString(),
    };

    // Open transcript page
    const tab = await chrome.tabs.create({
      url: chrome.runtime.getURL('transcript.html'),
    });
    
    console.log('Transcript tab opened:', tab.id);
    
    // Wait for tab to load and send data
    const sendDataToTab = (tabId, changeInfo) => {
      if (tabId === tab.id && changeInfo.status === 'complete') {
        console.log('Tab loaded, sending data');
        chrome.tabs.sendMessage(tabId, {
          type: 'TRANSCRIPT_DATA',
          data: transcriptData,
        }).catch(err => console.error('Error sending to tab:', err));
        
        chrome.tabs.onUpdated.removeListener(sendDataToTab);
      }
    };
    
    chrome.tabs.onUpdated.addListener(sendDataToTab);
    
  } catch (error) {
    console.error('Error opening transcript:', error);
  }
}

chrome.contextMenus.create({
  id: 'calculate-gpa',
  title: 'Calculate GPA with GPA Genie',
  contexts: ['page'],
  documentUrlPatterns: ['https://aims.iiitr.ac.in/iiitraichur/courseReg/myCrsHistoryPage*'],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'calculate-gpa') {
    chrome.action.openPopup();
  }
});

console.log('GPA Genie Background Service Worker Started');