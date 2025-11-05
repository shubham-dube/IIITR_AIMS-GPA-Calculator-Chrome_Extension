import { AIMSScraper } from './scrapers/AIMSScraper';
import { CourseSelector } from './ui/CourseSelector';
import { MESSAGE_TYPES } from '@shared/constants/messages';

const scraper = new AIMSScraper();
let courseSelector = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === MESSAGE_TYPES.FETCH_DATA) {
    scraper.scrapeData().then(result => {
      sendResponse(result);
    });
    return true;
  }
  
  if (request.type === 'INJECT_SELECTORS') {
    if (!courseSelector) {
      courseSelector = new CourseSelector(scraper);
      courseSelector.inject();
    }
    sendResponse({ success: true });
    return true;
  }
  
  if (request.type === 'GET_SELECTED_COURSES') {
    const selected = courseSelector ? courseSelector.getSelectedCourses() : [];
    sendResponse({ courses: selected });
    return true;
  }

  if (request.type === 'UPDATE_SELECTION') {
    if (courseSelector) {
      courseSelector.updateSelection(request.selectedCourses);
    }
    sendResponse({ success: true });
    return true;
  }

  if (request.type === 'SELECT_ALL') {
    if (courseSelector) {
      courseSelector.selectAll();
    }
    sendResponse({ success: true });
    return true;
  }

  if (request.type === 'DESELECT_ALL') {
    if (courseSelector) {
      courseSelector.deselectAll();
    }
    sendResponse({ success: true });
    return true;
  }
});

// Auto-inject on page load
if (window.location.href.includes('myCrsHistoryPage')) {
  const observer = new MutationObserver((mutations, obs) => {
    const table = document.querySelector('.hierarchyContent');
    if (table && !courseSelector) {
      courseSelector = new CourseSelector(scraper);
      courseSelector.inject();
      
      // Notify popup about selection changes
      courseSelector.onSelectionChange = (selected) => {
        chrome.runtime.sendMessage({
          type: 'SELECTION_CHANGED',
          courses: selected,
        });
      };
      
      obs.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  setTimeout(() => {
    if (!courseSelector) {
      const table = document.querySelector('.hierarchyContent');
      if (table) {
        courseSelector = new CourseSelector(scraper);
        courseSelector.inject();
        
        courseSelector.onSelectionChange = (selected) => {
          chrome.runtime.sendMessage({
            type: 'SELECTION_CHANGED',
            courses: selected,
          });
        };
      }
    }
  }, 2000);
}

// console.log('GPA Genie Content Script Loaded');