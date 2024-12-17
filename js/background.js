
let semestersData;

chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {

       if(request.action === "showReport"){
        data = request.value;
        console.log(data[0].name);
          if( typeof data != "undefined"){
              chrome.tabs.create({ url: '../report.html' }, (tab) => {
              reportTabId = tab.id;
              sendReportData(reportTabId,data);
            });
          }
          else {
            port.postMessage("noData");
          }
    }
});

function sendReportData(reportTabId,data) {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (tabId === reportTabId && changeInfo.status === 'complete') {
          chrome.tabs.sendMessage(reportTabId, { type: 'takeReportData', data: data });
      }
  });
}