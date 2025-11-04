import { AIMSScraper } from './scrapers/AIMSScraper';
import { CourseSelector } from './ui/CourseSelector';
import { MESSAGE_TYPES } from '@shared/constants/messages';

const scraper = new AIMSScraper();
let courseSelector = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === MESSAGE_TYPES.FETCH_DATA) {
    console.log('GPA Genie: Fetching data from page...');
    scraper.scrapeData().then(result => {
      sendResponse(result);
    });
    return true;
  }
  
  if (request.type === 'INJECT_SELECTORS') {
    console.log('GPA Genie: Injecting course selectors...');
    if (!courseSelector) {
      courseSelector = new CourseSelector(scraper);
      courseSelector.inject();
    }
    sendResponse({ success: true });
    return true;
  }
  
  if (request.type === 'GET_SELECTED') {
    console.log('GPA Genie: Getting selected courses...');
    const selected = courseSelector ? courseSelector.getSelectedCourses() : [];
    sendResponse({ selected });
    return true;
  }

  if (request.type === 'SELECT_ALL') {
    console.log('GPA Genie: Selecting all courses...');
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
      obs.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Fallback: inject after 2 seconds
  setTimeout(() => {
    if (!courseSelector) {
      const table = document.querySelector('.hierarchyContent');
      if (table) {
        courseSelector = new CourseSelector(scraper);
        courseSelector.inject();
      }
    }
  }, 2000);
}

console.log('GPA Genie Content Script Loaded');