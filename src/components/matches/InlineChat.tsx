
import React from 'react';
import { useInlineChat } from '@/hooks/use-inline-chat';
import MessageList from '@/components/messages/MessageList';
import InlineChatHeader from '@/components/matches/InlineChatHeader';
import InlineChatInput from '@/components/matches/InlineChatInput';

interface InlineChatProps {
  matchId: string;
  matchName: string;
  onClose: () => void;
}

const InlineChat: React.FC<InlineChatProps> = ({ matchId, matchName, onClose }) => {
  const {
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    isSending,
    currentUserId,
    isTyping,
    messagesEndRef,
    handleSendMessage
  } = useInlineChat(matchId);
  
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-island-dark rounded-lg w-full max-w-md h-[80vh] flex flex-col">
        <InlineChatHeader matchName={matchName} onClose={onClose} />
        
        <MessageList
          messages={messages}
          isLoading={isLoading}
          currentUserId={currentUserId}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
        />
        
        <InlineChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          isSending={isSending}
        />
      </div>
    </div>
  );
};

export default InlineChat;
