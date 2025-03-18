
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
  const [isTyping, setIsTyping] = useState(false);
  const [channel, setChannel] = useState<any>(null);
  
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
  
  // Set up realtime presence for typing indicator
  useEffect(() => {
    if (!matchId || !currentUserId) return;
    
    // Create a channel for this match
    const presenceChannel = supabase.channel(`match:${matchId}`, {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });
    
    // Handle presence state changes
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        updateTypingStatus(state);
      })
      .on('presence', { event: 'join' }, () => {
        const state = presenceChannel.presenceState();
        updateTypingStatus(state);
      })
      .on('presence', { event: 'leave' }, () => {
        const state = presenceChannel.presenceState();
        updateTypingStatus(state);
      })
      .subscribe();
      
    setChannel(presenceChannel);
    
    return () => {
      if (presenceChannel) {
        supabase.removeChannel(presenceChannel);
      }
    };
  }, [matchId, currentUserId]);
  
  // Function to update typing status based on presence state
  const updateTypingStatus = (state: any) => {
    if (!currentUserId) return;
    
    // Check if any other user is typing
    let someoneIsTyping = false;
    Object.keys(state).forEach(presenceId => {
      if (presenceId !== currentUserId) {
        state[presenceId].forEach((presence: any) => {
          if (presence.isTyping) {
            someoneIsTyping = true;
          }
        });
      }
    });
    
    setIsTyping(someoneIsTyping);
  };
  
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
  
  const handleTypingStatus = async (isTyping: boolean) => {
    if (channel) {
      await channel.track({
        isTyping,
        user_id: currentUserId,
        timestamp: new Date().toISOString(),
      });
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
            isTyping={isTyping}
          />
          
          <MessageInput 
            onSendMessage={handleSendMessage} 
            isSending={isSending}
            onTypingStatus={handleTypingStatus}
          />
        </main>
      </div>
    </div>
  );
};

export default Messages;
