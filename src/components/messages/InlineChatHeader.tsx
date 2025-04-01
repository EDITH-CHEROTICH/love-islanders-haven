
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InlineChatHeaderProps {
  matchName: string;
  onClose: () => void;
  onViewFullChat: () => void;
}

const InlineChatHeader: React.FC<InlineChatHeaderProps> = ({ 
  matchName, 
  onClose, 
  onViewFullChat 
}) => {
  return (
    <div className="bg-island p-4 border-b border-island-light/20 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <h3 className="font-semibold text-white">{matchName}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewFullChat}
          className="text-xs text-white/70 hover:text-white hover:bg-island-light/20 ml-2"
        >
          View full chat
        </Button>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-island-light/20">
        <X size={18} />
      </Button>
    </div>
  );
};

export default InlineChatHeader;
