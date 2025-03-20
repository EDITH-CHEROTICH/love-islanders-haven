
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InlineChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isSending: boolean;
}

const InlineChatInput: React.FC<InlineChatInputProps> = ({ 
  newMessage, 
  setNewMessage, 
  handleSendMessage, 
  isSending 
}) => {
  return (
    <div className="p-4 border-t border-gray-700">
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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

export default InlineChatInput;
