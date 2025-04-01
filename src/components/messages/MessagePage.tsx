
import React from 'react';
import { sendMessage } from '@/services/messages';
import { useDatingSafety } from '@/hooks/use-dating-safety';
import { AudioPlayerProvider } from '@/hooks/use-audio-player';
import MessageHeaderWrapper from './MessageHeaderWrapper';
import MessageContainer from './MessageContainer';
import { useMessageDetail } from '@/hooks/use-message-detail';

const MessagePage: React.FC = () => {
  const { 
    matchId, 
    currentUserId, 
    matchInfo, 
    handleBackClick, 
    toast 
  } = useMessageDetail();
  
  // console logs for debugging
  console.log('MessagePage component - matchId:', matchId);
  console.log('MessagePage component - matchInfo:', matchInfo);
  
  const { fetchSafetyContacts } = useDatingSafety();
  
  // Fetch safety contacts on component mount
  React.useEffect(() => {
    fetchSafetyContacts();
  }, [fetchSafetyContacts]);
  
  const handleSendMessage = async (content: string) => {
    if (!matchId) return;
    
    try {
      await sendMessage(matchId, content);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      console.error('Failed to send message:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <AudioPlayerProvider>
        <div className="page-container hide-scrollbar">
          <MessageHeaderWrapper 
            matchInfo={matchInfo} 
            onBackClick={handleBackClick} 
            onSendMessage={handleSendMessage} 
          />
          
          <MessageContainer
            matchId={matchId}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
          />
        </div>
      </AudioPlayerProvider>
    </div>
  );
};

export default MessagePage;
