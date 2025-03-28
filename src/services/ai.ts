import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
});

const COACHING_PROMPT = `You are Kai — an AI-powered executive coach and strategic mentor.

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

interface CoachingContext {
  role?: string;
  previousMessages?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  currentTopic?: string;
}

export class AICoach {
  private context: CoachingContext = {};

  async getCoachingResponse(
    userMessage: string,
    context?: CoachingContext
  ): Promise<string> {
    if (context) {
      this.context = { ...this.context, ...context };
    }

    const messages = [
      { role: 'system', content: COACHING_PROMPT },
      ...(this.context.previousMessages || []),
      { role: 'user', content: userMessage },
    ];

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0].message.content;
      
      // Update context with new messages
      this.context.previousMessages = [
        ...(this.context.previousMessages || []),
        { role: 'user', content: userMessage },
        { role: 'assistant', content: response || '' },
      ];

      return response || 'I apologize, but I encountered an error. Could you please rephrase your question?';
    } catch (error) {
      console.error('Error getting coaching response:', error);
      return 'I apologize, but I encountered an error. Could you please try again?';
    }
  }

  async analyzeEmail(emailContent: string): Promise<string> {
    const prompt = `Please analyze this email from a leadership perspective. Consider:
1. Tone and clarity
2. Leadership impact
3. Potential improvements
4. Strategic implications

Email content:
${emailContent}

Provide concise, actionable feedback that maintains a coaching tone.`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: COACHING_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0].message.content || 'Unable to analyze email.';
    } catch (error) {
      console.error('Error analyzing email:', error);
      return 'Unable to analyze email at this time.';
    }
  }

  resetContext() {
    this.context = {};
  }
} 