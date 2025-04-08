import React, { useRef, useEffect } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import { MessageType } from './types';
import { ScrollArea } from "@/components/ui/scroll-area";
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
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <div className="flex flex-col h-[calc(100vh-4rem)]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => <Message key={message.id || index} message={message} isLast={index === messages.length - 1} />)}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 my-[41px]">
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>;
};
export default InlineChatContainer;