
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { sendMessage } from '@/services/messages';
import { supabase } from '@/integrations/supabase/client';
import MessageHeader from '@/components/messages/MessageHeader';
import MessageList from '@/components/messages/MessageList';
import MessageInput from '@/components/messages/MessageInput';
import { useMatchMessages } from '@/hooks/use-match-messages';

const Messages = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch current user ID on component mount
    const fetchCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  useEffect(() => {
    if (!matchId) {
      navigate('/matches');
    }
  }, [matchId, navigate]);
  
  const { messages, isLoading, matchInfo } = useMatchMessages(matchId, currentUserId);
  
  const handleSendMessage = async (content: string) => {
    if (!matchId) return;
    
    setIsSending(true);
    try {
      await sendMessage(matchId, content);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  const handleBackClick = () => {
    navigate('/matches');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container hide-scrollbar">
        <MessageHeader matchInfo={matchInfo} onBackClick={handleBackClick} />
        
        <main className="flex flex-col h-[calc(100vh-180px)]">
          <MessageList 
            messages={messages} 
            isLoading={isLoading} 
            currentUserId={currentUserId} 
          />
          
          <MessageInput 
            onSendMessage={handleSendMessage} 
            isSending={isSending} 
          />
        </main>
      </div>
    </div>
  );
};

export default Messages;
