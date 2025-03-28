
import { supabase } from '@/integrations/supabase/client';

const aiCompanionService = {
  sendMessage: async (message: string, userId: string, conversationHistory: { role: string; content: string }[]) => {
    try {
      const response = await fetch('/api/ai-companion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, userId, conversationHistory }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error: any) {
      console.error("Failed to send message to AI Companion:", error);
      throw new Error(error.message || "Failed to send message to AI Companion");
    }
  },
};

export default aiCompanionService;
