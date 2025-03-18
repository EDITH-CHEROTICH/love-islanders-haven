
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendMessage, getMessagesForMatch, markMessagesAsRead, Message } from '@/services/messages';
import { supabase } from '@/integrations/supabase/client';

const Messages = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [matchInfo, setMatchInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!matchId) {
      navigate('/matches');
      return;
    }
    
    loadMessages();
    loadMatchDetails();
    setupRealtimeListener();
    
    // Mark messages as read when the conversation is opened
    markMessagesAsRead(matchId).catch(err => {
      console.error('Error marking messages as read:', err);
    });
    
    return () => {
      // Clean up realtime subscription
      const channel = supabase.channel(`messages:${matchId}`);
      supabase.removeChannel(channel);
    };
  }, [matchId]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const loadMessages = async () => {
    if (!matchId) return;
    
    setIsLoading(true);
    try {
      const fetchedMessages = await getMessagesForMatch(matchId);
      setMessages(fetchedMessages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const setupRealtimeListener = () => {
    if (!matchId) return;
    
    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          // Add the new message to the messages array
          setMessages(prev => [...prev, payload.new as Message]);
          
          // Mark new messages as read if they are from the other person
          if (payload.new.sender_id !== supabase.auth.getUser().data.user?.id) {
            markMessagesAsRead(matchId);
          }
        }
      )
      .subscribe();
  };
  
  const loadMatchDetails = async () => {
    if (!matchId) return;
    
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          matched_at,
          user1_id,
          user2_id,
          user1:user1_id(id, name, verified),
          user2:user2_id(id, name, verified)
        `)
        .eq('id', matchId)
        .single();
      
      if (error) throw error;
      
      const currentUserId = (await supabase.auth.getUser()).data.user?.id;
      const otherUser = data.user1_id === currentUserId ? data.user2 : data.user1;
      
      setMatchInfo({
        ...data,
        otherUser
      });
    } catch (error) {
      console.error('Error loading match details:', error);
      toast({
        title: "Error",
        description: "Failed to load match information",
        variant: "destructive",
      });
    }
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !matchId) return;
    
    setIsSending(true);
    try {
      await sendMessage(matchId, newMessage.trim());
      setNewMessage('');
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
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleBackClick = () => {
    navigate('/matches');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container hide-scrollbar">
        <header className="sticky top-0 bg-island-dark z-10 p-4 flex items-center border-b border-island-light/20">
          <button 
            onClick={handleBackClick}
            className="mr-4 text-white"
            aria-label="Back to matches"
          >
            <ArrowLeft size={24} />
          </button>
          
          {matchInfo?.otherUser ? (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img 
                  src="/placeholder.svg" 
                  alt={matchInfo.otherUser.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  {matchInfo.otherUser.name}
                </h1>
                <p className="text-xs text-white/60">
                  {matchInfo.otherUser.verified ? 'Verified ✓' : 'Not verified'}
                </p>
              </div>
            </div>
          ) : (
            <h1 className="text-lg font-semibold text-white">Loading...</h1>
          )}
        </header>
        
        <main className="flex flex-col h-[calc(100vh-180px)]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
            {isLoading ? (
              <div className="text-center text-white/60 py-8">
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-white/60 py-8">
                No messages yet. Say hello to start the conversation!
              </div>
            ) : (
              messages.map((msg) => {
                const isCurrentUser = msg.sender_id === supabase.auth.getUser().data.user?.id;
                return (
                  <div 
                    key={msg.id} 
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        isCurrentUser 
                          ? 'bg-love/80 text-white' 
                          : 'bg-gray-700/60 text-white'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${
                        isCurrentUser ? 'text-white/70' : 'text-white/50'
                      }`}>
                        {formatTime(msg.sent_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-gray-700/50 bg-island-dark">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isSending}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim() || isSending}
                className="bg-love hover:bg-love/90"
              >
                {isSending ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;
