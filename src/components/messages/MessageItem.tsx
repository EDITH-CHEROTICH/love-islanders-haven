
import { useMemo } from 'react';
import { Music, Image as ImageIcon } from 'lucide-react';
import { Message } from '@/services/messages';
import { useAudioPlayer } from '@/hooks/use-audio-player';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageItem = ({ message, isCurrentUser }: MessageItemProps) => {
  const { playAudio, isPlaying, currentAudioId } = useAudioPlayer();
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formattedTime = useMemo(() => formatTime(message.sent_at), [message.sent_at]);
  
  const renderMessageContent = () => {
    switch (message.content_type) {
      case 'image':
        return (
          <div className="mb-2">
            <img 
              src={message.media_url} 
              alt="Message image" 
              className="rounded-md max-w-full max-h-60 object-contain"
              onClick={() => window.open(message.media_url, '_blank')}
            />
          </div>
        );
      case 'audio':
        return (
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-90 p-2 bg-black/20 rounded-md mb-2"
            onClick={() => playAudio(message.id, message.media_url || '')}
          >
            <Music size={20} />
            <span className="text-sm">
              {isPlaying && currentAudioId === message.id ? 'Playing...' : 'Audio message'}
            </span>
            {isPlaying && currentAudioId === message.id && (
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse delay-100"></div>
                <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse delay-200"></div>
              </div>
            )}
          </div>
        );
      default:
        return <p>{message.content}</p>;
    }
  };
  
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
        {renderMessageContent()}
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
