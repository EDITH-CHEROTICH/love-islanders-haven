
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Smile } from 'lucide-react';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
};

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading
}) => {
  const [message, setMessage] = useState('');
  
  // Common emoji shortcuts
  const emojiShortcuts: Record<string, string> = {
    ':)': '😊',
    ':(': '😔',
    ':D': '😁',
    ':P': '😛',
    '<3': '❤️',
    ':*': '😘',
    ';)': '😉',
  };

  // Replace emoji shortcuts in the message
  const replaceEmojiShortcuts = (text: string): string => {
    let result = text;
    Object.entries(emojiShortcuts).forEach(([shortcut, emoji]) => {
      // Escape special characters in the shortcut for regex
      const escapedShortcut = shortcut.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
      result = result.replace(new RegExp(escapedShortcut, 'g'), emoji);
    });
    return result;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      // Replace emoji shortcuts before sending
      const processedMessage = replaceEmojiShortcuts(message);
      onSendMessage(processedMessage);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey && !isLoading && message.trim()) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 10
      }} 
      className="flex items-center gap-2 p-3 bg-island border-t border-island-light w-full mx-[4px] my-[54px]"
    >
      <Input 
        value={message} 
        onChange={e => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..." 
        disabled={isLoading} 
        className="flex-1 bg-island-dark text-white border-island-light" 
        autoFocus 
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={isLoading || !message.trim()} 
        className="bg-love hover:bg-love-dark text-white"
        onClick={handleSubmit}
      >
        <Send size={18} />
      </Button>
    </form>
  );
};

export default ChatInput;
