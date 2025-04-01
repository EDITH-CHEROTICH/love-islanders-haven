
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AudioPlayerProvider } from '@/hooks/use-audio-player';
import { useInlineChat } from './useInlineChat';
import InlineChatHeader from './InlineChatHeader';
import InlineChatContent from './InlineChatContent';

interface InlineChatOverlayProps {
  matchId: string;
  matchName: string;
  onClose: () => void;
}

const InlineChatOverlay: React.FC<InlineChatOverlayProps> = ({ matchId, matchName, onClose }) => {
  const navigate = useNavigate();
  const { messages, isLoading, currentUserId, handleSendMessage } = useInlineChat(matchId);
  
  const handleViewFullChat = () => {
    onClose();
    navigate(`/messages/${matchId}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <AudioPlayerProvider>
        <div className="bg-island-dark border border-island-light/20 rounded-lg w-full max-w-md h-[80vh] flex flex-col overflow-hidden animate-fade-in chat-container">
          <InlineChatHeader 
            matchName={matchName} 
            onClose={onClose} 
            onViewFullChat={handleViewFullChat} 
          />

          <InlineChatContent 
            matchId={matchId}
            messages={messages}
            isLoading={isLoading}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
          />
        </div>
      </AudioPlayerProvider>
    </div>
  );
};

export default InlineChatOverlay;
