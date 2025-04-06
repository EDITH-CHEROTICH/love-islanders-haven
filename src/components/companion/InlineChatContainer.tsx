
import React, { useRef, useEffect } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import { MessageType } from './types';

interface InlineChatContainerProps {
  messages: MessageType[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const InlineChatContainer: React.FC<InlineChatContainerProps> = ({
  messages,
  isLoading,
  onSendMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
        {messages.map((message, index) => (
          <Message 
            key={index} 
            message={message} 
            isLast={index === messages.length - 1} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default InlineChatContainer;
