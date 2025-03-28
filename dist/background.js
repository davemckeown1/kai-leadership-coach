// Kai Leadership Coach - Background Service Worker
console.log('Kai Leadership Coach background script loaded');

// Create context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'askKai',
    title: 'Ask Kai about this',
    contexts: ['selection', 'page'],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'askKai') {
    const selectedText = info.selectionText || '';
    
    // Send message to content script
    if (tab && tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'ASK_KAI',
        payload: {
          text: selectedText,
        },
      });
    }
  }
});
