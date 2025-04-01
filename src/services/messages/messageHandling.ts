
import { sendMessage as apiSendMessage } from '@/services/messages';

export const handleSendMessage = async (
  matchId: string | undefined,
  content: string,
  contentType: 'text' | 'image' | 'audio' = 'text',
  mediaUrl?: string,
  setIsSending?: (isSending: boolean) => void
) => {
  if (!matchId) return;
  
  if (setIsSending) setIsSending(true);
  
  try {
    if (contentType === 'text') {
      return await apiSendMessage(matchId, content);
    } else {
      // For non-text messages, handle them specifically
      return await apiSendMessage(matchId, content, contentType, mediaUrl);
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  } finally {
    if (setIsSending) setIsSending(false);
  }
};
