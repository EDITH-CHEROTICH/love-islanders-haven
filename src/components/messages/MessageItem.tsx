
import { useMemo } from 'react';
import { Message } from '@/services/messages';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageItem = ({ message, isCurrentUser }: MessageItemProps) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formattedTime = useMemo(() => formatTime(message.sent_at), [message.sent_at]);
  
  return (
    <div 
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`max-w-[80%] p-3 rounded-lg ${
          isCurrentUser 
            ? 'bg-love/80 text-white' 
            : 'bg-gray-700/60 text-white'
        }`}
      >
        <p>{message.content}</p>
        <p className={`text-xs mt-1 ${
          isCurrentUser ? 'text-white/70' : 'text-white/50'
        }`}>
          {formattedTime}
        </p>
      </div>
    </div>
  );
};

export default MessageItem;
