import { useState, useCallback } from 'react';
import { AICoach } from '../services/ai';
import { FirebaseService, CoachingSession } from '../services/firebase';

interface UseCoachingReturn {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  analyzeEmail: (emailContent: string) => Promise<string>;
  saveSession: () => Promise<void>;
  loadSessions: () => Promise<CoachingSession[]>;
}

export const useCoaching = (): UseCoachingReturn => {
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const aiCoach = new AICoach();
  const firebaseService = FirebaseService.getInstance();

  const sendMessage = useCallback(async (message: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Add user message to state
      const userMessage = {
        role: 'user' as const,
        content: message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Get AI response
      const response = await aiCoach.getCoachingResponse(message);
      
      // Add AI response to state
      const aiMessage = {
        role: 'assistant' as const,
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

      // Save to Firebase if we have a session
      if (currentSessionId) {
        await firebaseService.updateCoachingSession(currentSessionId, {
          messages: [...messages, userMessage, aiMessage],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId]);

  const analyzeEmail = useCallback(async (emailContent: string) => {
    try {
      setIsLoading(true);
      setError(null);
      return await aiCoach.analyzeEmail(emailContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return 'Unable to analyze email at this time.';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!currentSessionId) {
        const user = firebaseService.getCurrentUser();
        if (!user) {
          throw new Error('User must be authenticated to save a session');
        }

        const sessionId = await firebaseService.createCoachingSession({
          messages,
          userId: user.uid,
          context: {
            role: 'leader', // TODO: Get from user profile
            topic: messages[0]?.content.slice(0, 50) + '...',
          },
        });
        setCurrentSessionId(sessionId);
      } else {
        await firebaseService.updateCoachingSession(currentSessionId, {
          messages,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, messages]);

  const loadSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      return await firebaseService.getCoachingSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    analyzeEmail,
    saveSession,
    loadSessions,
  };
}; 