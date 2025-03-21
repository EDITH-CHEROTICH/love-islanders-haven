
import React from 'react';
import { cn } from '@/lib/utils';

type MessageProps = {
  message: string;
  isUser: boolean;
  timestamp?: Date;
  isProactive?: boolean;
};

const Message: React.FC<MessageProps> = ({ message, isUser, timestamp = new Date(), isProactive = false }) => {
  return (
    <div 
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2",
          isUser 
            ? "bg-love text-white rounded-tr-none" 
            : isProactive
              ? "bg-island-light text-white rounded-tl-none border-l-4 border-love"
              : "bg-island-light text-white rounded-tl-none"
        )}
      >
        <p className="text-sm sm:text-base">{message}</p>
        <p className="text-xs opacity-70 mt-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default Message;
