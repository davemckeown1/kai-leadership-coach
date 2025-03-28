// Kai Leadership Coach - AI Service
const API_KEY = 'YOUR_OPENAI_API_KEY';  // Replace with your actual key when testing locally

// Coaching system prompt
const COACHING_SYSTEM_PROMPT = `You are Kai — an AI-powered executive coach and strategic mentor.

You help leaders reflect deeply, make better decisions, and lead with intention. You do NOT give immediate answers or advice. Instead, you guide through insight, questions, and structured coaching.

You always follow this coaching pattern:

1️⃣ **First Interaction**
- Start with a short, empathetic hook (e.g. "You're not alone in this.")
- Reflect back what the user shared
- Ask 1–2 clear, open-ended questions
- Never give solutions or direct advice

2️⃣ **Second Interaction**
- Acknowledge their response with genuine encouragement
- Surface 1 key insight, theme, or tension
- Ask 1 deeper follow-up question

3️⃣ **Third+ Interaction**
- Offer 1–2 actionable suggestions, frameworks, or next moves
- Invite the user to continue or apply it ("Want help building that plan?")

Your tone is warm, focused, human, and always respectful. Use short sentences. Speak like a trusted coach or wise peer — not a chatbot. Always tailor your questions to the user's role and emotional context when available.`;

// Store conversation history
let conversationHistory = [];

// Check which interaction number we're on (1st, 2nd, 3rd+)
function getInteractionCount() {
  return Math.floor(conversationHistory.filter(msg => msg.role === 'user').length / 2) + 1;
}

// Get coaching response from OpenAI
async function getCoachingResponse(userMessage) {
  try {
    // Add user message to conversation history
    conversationHistory.push({
      role: 'user',
      content: userMessage
    });
    
    // Prepare messages for API call
    const messages = [
      { role: 'system', content: COACHING_SYSTEM_PROMPT },
      ...conversationHistory
    ];
    
    // Make API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(data.error?.message || 'Failed to get response from OpenAI');
    }
    
    const coachingResponse = data.choices[0].message.content;
    
    // Add AI response to conversation history
    conversationHistory.push({
      role: 'assistant',
      content: coachingResponse
    });
    
    return coachingResponse;
  } catch (error) {
    console.error('Error getting coaching response:', error);
    return "I apologize, but I'm having trouble connecting to my coaching resources. Could you please try again in a moment?";
  }
}

// Analyze email or text with leadership lens
async function analyzeContent(content, contentType = 'email') {
  try {
    let promptPrefix = '';
    
    if (contentType === 'email') {
      promptPrefix = `Please analyze this email from a leadership perspective. Consider:
1. Tone and clarity
2. Leadership impact
3. Potential improvements
4. Strategic implications

Email content:
`;
    } else if (contentType === 'selection') {
      promptPrefix = `Please analyze this selected text from a leadership perspective. Consider:
1. Key leadership themes or challenges
2. Potential insights
3. Questions that might help reflect on this deeper

Selected text:
`;
    }
    
    const fullPrompt = `${promptPrefix}${content}

Provide concise, thoughtful coaching that helps me reflect on this content.`;
    
    // Make API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: COACHING_SYSTEM_PROMPT },
          { role: 'user', content: fullPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(data.error?.message || 'Failed to get response from OpenAI');
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing content:', error);
    return "I apologize, but I'm having trouble analyzing this content right now. Could you please try again in a moment?";
  }
}

// Reset conversation
function resetConversation() {
  conversationHistory = [];
}

// Make functions available to other scripts
window.KaiAI = {
  getCoachingResponse,
  analyzeContent,
  resetConversation,
  getInteractionCount
}; 