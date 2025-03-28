// Basic content script for Kai Leadership Coach
console.log('Kai Leadership Coach content script loaded');

// Store messages for the current session
let messages = [];

// Create and append the floating bubble to the page
function createFloatingBubble() {
  const bubble = document.createElement('div');
  bubble.className = 'kai-bubble';
  bubble.style.position = 'fixed';
  bubble.style.zIndex = '9999';
  bubble.style.width = '48px';
  bubble.style.height = '48px';
  bubble.style.borderRadius = '50%';
  bubble.style.backgroundColor = '#0284c7';
  bubble.style.boxShadow = '0 4px 12px rgba(2, 132, 199, 0.2)';
  bubble.style.display = 'flex';
  bubble.style.alignItems = 'center';
  bubble.style.justifyContent = 'center';
  bubble.style.cursor = 'pointer';
  bubble.style.transition = 'transform 0.2s ease, background-color 0.2s ease';
  bubble.style.right = '20px';
  bubble.style.bottom = '20px';
  
  const bubbleText = document.createElement('span');
  bubbleText.textContent = 'K';
  bubbleText.style.color = 'white';
  bubbleText.style.fontSize = '24px';
  bubbleText.style.fontWeight = 'bold';
  
  bubble.appendChild(bubbleText);
  document.body.appendChild(bubble);
  
  // Make the bubble draggable
  let isDragging = false;
  let startX, startY, startLeft, startTop;
  
  bubble.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseInt(bubble.style.right) || 20;
    startTop = parseInt(bubble.style.bottom) || 20;
    
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = startX - e.clientX;
    const deltaY = startY - e.clientY;
    
    bubble.style.right = `${startLeft + deltaX}px`;
    bubble.style.bottom = `${startTop + deltaY}px`;
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  // Open panel when clicking the bubble
  bubble.addEventListener('click', () => {
    // Only open if not dragging
    if (!isDragging) {
      createOrShowPanel();
    }
  });
  
  return bubble;
}

// Create a message element
function createMessageElement(content, sender) {
  const messageElement = document.createElement('div');
  messageElement.className = `kai-message kai-message-${sender}`;
  messageElement.textContent = content;
  messageElement.style.maxWidth = '85%';
  messageElement.style.padding = '12px 16px';
  messageElement.style.borderRadius = '12px';
  messageElement.style.position = 'relative';
  
  if (sender === 'user') {
    messageElement.style.backgroundColor = '#0284c7';
    messageElement.style.color = 'white';
    messageElement.style.alignSelf = 'flex-end';
    messageElement.style.borderBottomRightRadius = '4px';
  } else {
    messageElement.style.backgroundColor = '#f1f5f9';
    messageElement.style.color = '#0f172a';
    messageElement.style.alignSelf = 'flex-start';
    messageElement.style.borderBottomLeftRadius = '4px';
  }
  
  return messageElement;
}

// Show typing indicator
function showTypingIndicator(messagesContainer) {
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'kai-typing-indicator';
  typingIndicator.style.display = 'flex';
  typingIndicator.style.alignItems = 'center';
  typingIndicator.style.padding = '8px 16px';
  typingIndicator.style.color = '#64748b';
  typingIndicator.style.alignSelf = 'flex-start';
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'kai-typing-dot';
    dot.style.width = '6px';
    dot.style.height = '6px';
    dot.style.borderRadius = '50%';
    dot.style.backgroundColor = '#64748b';
    dot.style.margin = '0 2px';
    dot.style.animation = 'typing-dot 1.4s infinite ease-in-out';
    dot.style.animationDelay = `${i * 0.2}s`;
    
    typingIndicator.appendChild(dot);
  }
  
  messagesContainer.appendChild(typingIndicator);
  return typingIndicator;
}

// Create the side panel
function createOrShowPanel() {
  // Check if panel already exists
  let panel = document.querySelector('.kai-panel');
  
  if (panel) {
    panel.style.display = 'flex';
    return panel;
  }
  
  panel = document.createElement('div');
  panel.className = 'kai-panel';
  panel.style.position = 'fixed';
  panel.style.top = '0';
  panel.style.right = '0';
  panel.style.height = '100vh';
  panel.style.width = '380px';
  panel.style.backgroundColor = 'white';
  panel.style.boxShadow = '-4px 0 24px rgba(2, 132, 199, 0.2)';
  panel.style.zIndex = '10000';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  panel.style.overflow = 'hidden';
  
  // Create panel header
  const header = document.createElement('div');
  header.className = 'kai-panel-header';
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.style.justifyContent = 'space-between';
  header.style.padding = '16px 20px';
  header.style.borderBottom = '1px solid #e5e7eb';
  
  const title = document.createElement('h2');
  title.className = 'kai-panel-title';
  title.textContent = 'Kai Coach';
  title.style.fontSize = '18px';
  title.style.fontWeight = 'bold';
  title.style.margin = '0';
  
  const closeButton = document.createElement('button');
  closeButton.className = 'kai-panel-close';
  closeButton.innerHTML = '&times;';
  closeButton.style.backgroundColor = 'transparent';
  closeButton.style.border = 'none';
  closeButton.style.width = '32px';
  closeButton.style.height = '32px';
  closeButton.style.borderRadius = '50%';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '24px';
  
  closeButton.addEventListener('click', () => {
    panel.style.display = 'none';
  });
  
  header.appendChild(title);
  header.appendChild(closeButton);
  
  // Create messages container
  const messagesContainer = document.createElement('div');
  messagesContainer.className = 'kai-messages';
  messagesContainer.style.flex = '1';
  messagesContainer.style.overflowY = 'auto';
  messagesContainer.style.padding = '16px';
  messagesContainer.style.display = 'flex';
  messagesContainer.style.flexDirection = 'column';
  messagesContainer.style.gap = '16px';
  
  // Create welcome message if it's a new conversation
  if (messages.length === 0) {
    const welcomeMessage = createMessageElement("Hello! I'm Kai, your leadership coach. How can I help you today?", 'coach');
    messagesContainer.appendChild(welcomeMessage);
    
    // Add to messages array
    messages.push({
      content: "Hello! I'm Kai, your leadership coach. How can I help you today?",
      sender: 'coach'
    });
  } else {
    // Load existing messages
    messages.forEach(msg => {
      const messageElement = createMessageElement(msg.content, msg.sender);
      messagesContainer.appendChild(messageElement);
    });
  }
  
  // Create input container
  const inputContainer = document.createElement('div');
  inputContainer.className = 'kai-input-container';
  inputContainer.style.padding = '12px 16px';
  inputContainer.style.borderTop = '1px solid #e5e7eb';
  inputContainer.style.display = 'flex';
  inputContainer.style.gap = '8px';
  
  const input = document.createElement('input');
  input.className = 'kai-input';
  input.type = 'text';
  input.placeholder = 'Ask Kai for guidance...';
  input.style.flex = '1';
  input.style.border = '1px solid #d1d5db';
  input.style.borderRadius = '8px';
  input.style.padding = '10px 16px';
  input.style.fontSize = '14px';
  input.style.outline = 'none';
  
  const sendButton = document.createElement('button');
  sendButton.className = 'kai-send-button';
  sendButton.textContent = 'Send';
  sendButton.style.backgroundColor = '#0284c7';
  sendButton.style.color = 'white';
  sendButton.style.border = 'none';
  sendButton.style.borderRadius = '8px';
  sendButton.style.padding = '0 16px';
  sendButton.style.fontWeight = '500';
  sendButton.style.cursor = 'pointer';
  
  // Handle sending messages
  async function handleSendMessage() {
    const userMessage = input.value.trim();
    if (!userMessage) return;
    
    // Clear input
    input.value = '';
    
    // Add user message to UI
    const userMessageElement = createMessageElement(userMessage, 'user');
    messagesContainer.appendChild(userMessageElement);
    
    // Add to messages array
    messages.push({
      content: userMessage,
      sender: 'user'
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Show typing indicator
    const typingIndicator = showTypingIndicator(messagesContainer);
    
    // Disable input while waiting
    input.disabled = true;
    sendButton.disabled = true;
    
    try {
      // Get AI response
      const response = await window.KaiAI.getCoachingResponse(userMessage);
      
      // Remove typing indicator
      typingIndicator.remove();
      
      // Add AI response to UI
      const aiMessageElement = createMessageElement(response, 'coach');
      messagesContainer.appendChild(aiMessageElement);
      
      // Add to messages array
      messages.push({
        content: response,
        sender: 'coach'
      });
      
      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
      console.error('Error getting coaching response:', error);
      
      // Remove typing indicator
      typingIndicator.remove();
      
      // Add error message
      const errorMessage = createMessageElement("I apologize, but I'm having trouble connecting to my coaching resources. Could you please try again in a moment?", 'coach');
      messagesContainer.appendChild(errorMessage);
      
      // Add to messages array
      messages.push({
        content: "I apologize, but I'm having trouble connecting to my coaching resources. Could you please try again in a moment?",
        sender: 'coach'
      });
    } finally {
      // Re-enable input
      input.disabled = false;
      sendButton.disabled = false;
      input.focus();
    }
  }
  
  // Add event listeners
  sendButton.addEventListener('click', handleSendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });
  
  inputContainer.appendChild(input);
  inputContainer.appendChild(sendButton);
  
  // Append all elements to panel
  panel.appendChild(header);
  panel.appendChild(messagesContainer);
  panel.appendChild(inputContainer);
  
  // Append panel to body
  document.body.appendChild(panel);
  
  // Focus input
  input.focus();
  
  return panel;
}

// Handle selected text analysis
async function handleSelectedTextAnalysis(selectedText) {
  // Create or show panel
  const panel = createOrShowPanel();
  const messagesContainer = panel.querySelector('.kai-messages');
  
  // Add user message to UI
  const userMessage = `Can you analyze this text for me from a leadership perspective?\n\n"${selectedText}"`;
  const userMessageElement = createMessageElement(userMessage, 'user');
  messagesContainer.appendChild(userMessageElement);
  
  // Add to messages array
  messages.push({
    content: userMessage,
    sender: 'user'
  });
  
  // Show typing indicator
  const typingIndicator = showTypingIndicator(messagesContainer);
  
  try {
    // Get AI analysis
    const analysis = await window.KaiAI.analyzeContent(selectedText, 'selection');
    
    // Remove typing indicator
    typingIndicator.remove();
    
    // Add AI response to UI
    const aiMessageElement = createMessageElement(analysis, 'coach');
    messagesContainer.appendChild(aiMessageElement);
    
    // Add to messages array
    messages.push({
      content: analysis,
      sender: 'coach'
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  } catch (error) {
    console.error('Error analyzing selected text:', error);
    
    // Remove typing indicator
    typingIndicator.remove();
    
    // Add error message
    const errorMessage = createMessageElement("I apologize, but I'm having trouble analyzing this text right now. Could you please try again in a moment?", 'coach');
    messagesContainer.appendChild(errorMessage);
    
    // Add to messages array
    messages.push({
      content: "I apologize, but I'm having trouble analyzing this text right now. Could you please try again in a moment?",
      sender: 'coach'
    });
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ASK_KAI') {
    const { text } = message.payload;
    if (text) {
      handleSelectedTextAnalysis(text);
    }
  }
});

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  createFloatingBubble();
  
  // Reset AI conversation when loading a new page
  if (window.KaiAI) {
    window.KaiAI.resetConversation();
  }
}
