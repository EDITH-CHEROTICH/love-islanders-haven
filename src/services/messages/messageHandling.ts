
import { sendMessage as apiSendMessage } from '@/services/messages';

export const handleSendMessage = async (
  matchId: string | undefined,
  content: string,
  contentType: 'text' | 'image' | 'audio' = 'text',
  mediaUrl?: string,
  setIsSending?: (isSending: boolean) => void
) => {
  if (!matchId) return null;
  
  if (setIsSending) setIsSending(true);
  
  try {
    let message;
    if (contentType === 'text') {
      message = await apiSendMessage(matchId, content);
    } else {
      // For non-text messages, handle them specifically
      message = await apiSendMessage(matchId, content, contentType, mediaUrl);
    }
    
    return message;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  } finally {
    if (setIsSending) setIsSending(false);
  }
};
