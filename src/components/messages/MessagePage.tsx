
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
  
  const { otherUser, loading } = useMessageDetail(matchId);
  
  // Create a matchInfo state based on otherUser for MessageHeaderWrapper
  const [matchInfo, setMatchInfo] = useState<any>(null);
  
  // Update matchInfo whenever otherUser changes
  useEffect(() => {
    if (otherUser) {
      setMatchInfo({
        profile: {
          id: otherUser.id,
          name: otherUser.name,
          images: [otherUser.avatar_url || '/placeholder.svg'],
          verified: false
        }
      });
    }
  }, [otherUser]);
  
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
