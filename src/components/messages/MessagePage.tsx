
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sendMessage } from '@/services/messages';
import { useDatingSafety } from '@/hooks/use-dating-safety';
import { AudioPlayerProvider } from '@/hooks/use-audio-player';
import { useToast } from '@/hooks/use-toast';
import MessageHeaderWrapper from './MessageHeaderWrapper';
import MessageContainer from './MessageContainer';
import useMessageDetail from '@/hooks/use-message-detail';
import { useAuth } from '@/context/auth';

const MessagePage: React.FC = () => {
  const { matchId: matchIdParam } = useParams<{ matchId: string }>();
  const [matchId, setMatchId] = useState<string>(matchIdParam || '');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchSafetyContacts } = useDatingSafety();
  
  // Create a matchInfo state that MessageHeaderWrapper requires
  const [matchInfo, setMatchInfo] = useState<any>(null);
  
  // Safely set matchId from params
  useEffect(() => {
    if (matchIdParam) {
      setMatchId(matchIdParam);
    }
  }, [matchIdParam]);
  
  // Fetch safety contacts on component mount
  useEffect(() => {
    fetchSafetyContacts();
  }, [fetchSafetyContacts]);
  
  const handleBackClick = () => {
    navigate('/matches');
  };
  
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
            onSendMessage={handleSendMessage}
          />
        </div>
      </AudioPlayerProvider>
    </div>
  );
};

export default MessagePage;
