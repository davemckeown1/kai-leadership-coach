// Debounce function to limit how often we check for email composition
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Check for email composition fields
const checkForEmailComposition = () => {
  // Gmail compose
  const gmailCompose = document.querySelector('div[role="textbox"][aria-label*="Message Body"]');
  if (gmailCompose) {
    chrome.runtime.sendMessage({
      type: 'EMAIL_COMPOSITION_DETECTED',
      payload: {
        type: 'gmail',
        element: gmailCompose,
      },
    });
  }

  // Outlook compose
  const outlookCompose = document.querySelector('[role="textbox"][aria-label*="Message body"]');
  if (outlookCompose) {
    chrome.runtime.sendMessage({
      type: 'EMAIL_COMPOSITION_DETECTED',
      payload: {
        type: 'outlook',
        element: outlookCompose,
      },
    });
  }
};

// Start observing DOM changes
const observer = new MutationObserver(
  debounce(() => {
    checkForEmailComposition();
  }, 1000)
);

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ASK_KAI') {
    // Handle context menu selection
    const { text, url } = message.payload;
    
    // TODO: Implement AI analysis of selected text
    console.log('Analyzing text:', text);
  } else if (message.type === 'OPEN_KAI_FOR_EMAIL') {
    // Handle email composition assistance
    const composeElement = document.querySelector(
      'div[role="textbox"][aria-label*="Message Body"], [role="textbox"][aria-label*="Message body"]'
    );
    
    if (composeElement) {
      // TODO: Implement email analysis and suggestions
      console.log('Analyzing email composition');
    }
  }
}); 