import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { sendMessage } from '@/services/messages';
import { supabase } from '@/integrations/supabase/client';
import MessageHeader from '@/components/messages/MessageHeader';
import MessageContainer from '@/components/messages/MessageContainer';
import DatePlanDialog from '@/components/messages/DatePlanDialog';
import { useMatchMessages } from '@/hooks/use-match-messages';
import { useDatingSafety } from '@/hooks/use-dating-safety';

const Messages = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { fetchSafetyContacts } = useDatingSafety();
  const { matchInfo } = useMatchMessages(matchId, currentUserId);
  
  // Fetch safety contacts on component mount
  useEffect(() => {
    fetchSafetyContacts();
  }, []);
  
  // Fetch current user ID on component mount
  useEffect(() => {
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
  
  // Redirect to matches if no matchId
  useEffect(() => {
    if (!matchId) {
      navigate('/matches');
    }
  }, [matchId, navigate]);
  
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
  
  const handleBackClick = () => {
    navigate('/matches');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container hide-scrollbar">
        <MessageHeader 
          matchInfo={matchInfo} 
          onBackClick={handleBackClick} 
          actions={<DatePlanDialog onDatePlanCreated={handleSendMessage} />}
        />
        
        <MessageContainer
          matchId={matchId}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default Messages;
