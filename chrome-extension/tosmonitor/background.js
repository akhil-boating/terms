const targetWebsites = [
  "www.nytimes.com",
  "anotherexample.com"
];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    let matched = false;
    for (const domain of targetWebsites) {
      if (tab.url.includes(domain)) {
        matched = true;
        chrome.action.setBadgeText({ text: "!", tabId });
        chrome.action.setBadgeBackgroundColor({ color: "red", tabId });
        chrome.storage.local.set({ matchedUrl: tab.url });
        break;
      }
    }
    if (!matched) {
      chrome.action.setBadgeText({ text: "", tabId });
    }
  }
});