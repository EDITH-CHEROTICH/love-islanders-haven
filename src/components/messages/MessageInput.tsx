
import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  isSending: boolean;
  onTypingStatus?: (isTyping: boolean) => void;
}

const MessageInput = ({ onSendMessage, isSending, onTypingStatus }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle typing status
  const handleTyping = () => {
    if (onTypingStatus) {
      // User is typing
      onTypingStatus(true);
      
      // Clear previous timeout if it exists
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set a new timeout to stop "typing" status after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        onTypingStatus(false);
      }, 2000);
    }
  };
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Make sure typing status is set to false when component unmounts
      if (onTypingStatus) {
        onTypingStatus(false);
      }
    };
  }, [onTypingStatus]);
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      await onSendMessage(newMessage.trim());
      setNewMessage('');
      
      // Set typing status to false after sending a message
      if (onTypingStatus) {
        onTypingStatus(false);
        
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  return (
    <div className="p-4 border-t border-gray-700/50 bg-island-dark">
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
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
  );
};

export default MessageInput;
