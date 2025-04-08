import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { useSettings } from '@/context/SettingsContext';
import { supabase } from '@/integrations/supabase/client';
import { useMatchMessages } from '@/hooks/use-match-messages';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sent_at: string;
  content_type: string;
  media_url: string | null;
}

interface MessageContainerProps {
  matchId: string;
}

const MessageContainer: React.FC<MessageContainerProps> = ({ matchId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { settings } = useSettings();
  const { messages, loading, createMessage, refreshMessages } = useMatchMessages(matchId);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const sentMessage = await createMessage(matchId, newMessage);

    if (sentMessage) {
      setNewMessage('');
      // refreshMessages(); // Refresh messages after sending
      // Scroll to bottom after sending
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 100);
    } else {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getSenderAvatar = (senderId: string) => {
    const sender = senderId === user?.id ? user : null;

    return (
      <Avatar className="w-8 h-8">
        <AvatarImage src={sender?.avatar_url || '/placeholder.svg'} alt={sender?.name} />
        <AvatarFallback>{sender?.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
      </Avatar>
    );
  };

  const formatSentAt = (sentAt: string) => {
    try {
      return formatDistanceToNow(new Date(sentAt), { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'a while ago';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-48">Loading messages...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 space-y-4">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex items-start ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender_id !== user?.id && getSenderAvatar(message.sender_id)}
            <div className={`ml-2 rounded-lg p-3 w-fit max-w-[75%] ${message.sender_id === user?.id ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}>
              <p className="text-sm">{message.content}</p>
              <p className="text-xs text-gray-500 mt-1">{formatSentAt(message.sent_at)}</p>
            </div>
          </div>
        ))}
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}><Send className="h-4 w-4 mr-1" /> Send</Button>
        </div>
      </div>
    </div>
  );
};

export default MessageContainer;
